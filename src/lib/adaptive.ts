import { Question, QuestionAttempt, Subject, TopicStat, Difficulty } from '@/types';
import { CEE_SYLLABUS } from './syllabus';

export interface NextBestAction {
  subject: Subject;
  chapter: string;
  topic: string;
  recommendedDifficulty: Difficulty;
  headline: string;
  rationale: string;
  yieldScore: number;
  weaknessScore: number;
}

export function computeTopicStats(attempts: QuestionAttempt[]): TopicStat[] {
  // Aggregate syllabus topics
  const statsMap: Map<string, TopicStat> = new Map();

  // Populate from syllabus baseline
  for (const [subject, chapters] of Object.entries(CEE_SYLLABUS)) {
    for (const chapter of chapters) {
      for (const topic of chapter.topics) {
        const key = `${subject}:::${topic.name}`;
        statsMap.set(key, {
          topic: topic.name,
          chapter: chapter.name,
          subject: subject as Subject,
          attempts: 0,
          correct: 0,
          accuracy: 100, // unattempted default
          yieldScore: topic.yieldScore,
          pastQuestionFrequency: chapter.pastQuestionFrequency,
          conceptImportance: chapter.conceptImportance,
          studentWeakness: 50, // neutral starting baseline
          recentMistakeRate: 0,
          priorityScore: topic.yieldScore
        });
      }
    }
  }

  // Calculate actual attempts and recent performance
  const now = Date.now();
  const recentCutoff = now - 7 * 24 * 60 * 60 * 1000; // last 7 days

  for (const a of attempts) {
    const key = `${a.subject}:::${a.topic}`;
    let stat = statsMap.get(key);
    if (!stat) {
      stat = {
        topic: a.topic,
        chapter: 'General',
        subject: a.subject,
        attempts: 0,
        correct: 0,
        accuracy: 0,
        yieldScore: 85,
        pastQuestionFrequency: 85,
        conceptImportance: 85,
        studentWeakness: 50,
        recentMistakeRate: 0,
        priorityScore: 85
      };
      statsMap.set(key, stat);
    }

    stat.attempts += 1;
    if (a.isCorrect) stat.correct += 1;
  }

  // Refine studentWeakness, recentMistakeRate, and priorityScore
  const result: TopicStat[] = [];
  for (const stat of statsMap.values()) {
    if (stat.attempts > 0) {
      stat.accuracy = Math.round((stat.correct / stat.attempts) * 100);
      stat.studentWeakness = 100 - stat.accuracy;

      const topicAttempts = attempts.filter(a => a.subject === stat.subject && a.topic === stat.topic);
      const recentAttempts = topicAttempts.filter(a => a.timestamp >= recentCutoff);
      if (recentAttempts.length > 0) {
        const recentMistakes = recentAttempts.filter(a => !a.isCorrect).length;
        stat.recentMistakeRate = Math.round((recentMistakes / recentAttempts.length) * 100);
      } else {
        stat.recentMistakeRate = stat.studentWeakness;
      }
    } else {
      // Unattempted: treated as unexplored potential weakness (45%)
      stat.studentWeakness = 45;
      stat.recentMistakeRate = 0;
    }

    // Adaptive Priority Score formula:
    // 40% Yield Score + 35% Student Weakness + 15% Recent Mistake Rate + 10% Past Question Frequency
    stat.priorityScore = Math.round(
      stat.yieldScore * 0.40 +
      stat.studentWeakness * 0.35 +
      stat.recentMistakeRate * 0.15 +
      stat.pastQuestionFrequency * 0.10
    );

    result.push(stat);
  }

  // Sort descending by priorityScore
  return result.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getNextBestAction(attempts: QuestionAttempt[]): NextBestAction {
  const stats = computeTopicStats(attempts);
  const topPriority = stats[0];

  let recommendedDifficulty: Difficulty = 'very_hard';
  if (topPriority.accuracy < 50 && topPriority.attempts >= 3) {
    recommendedDifficulty = 'hard';
  } else if (topPriority.accuracy >= 80 && topPriority.attempts >= 5) {
    recommendedDifficulty = 'elite';
  }

  return {
    subject: topPriority.subject,
    chapter: topPriority.chapter,
    topic: topPriority.topic,
    recommendedDifficulty,
    headline: `${topPriority.topic} · ${recommendedDifficulty.replace('_', ' ').toUpperCase()}`,
    rationale: topPriority.attempts === 0
      ? `High-yield topic (${topPriority.yieldScore}/100 CEE weight) currently unattempted. High probability of recurring exam appearances.`
      : `High mistake rate detected (${topPriority.studentWeakness}% weakness) on an essential CEE concept (Yield: ${topPriority.yieldScore}).`,
    yieldScore: topPriority.yieldScore,
    weaknessScore: topPriority.studentWeakness
  };
}

export function pickSurpriseQuestion(questions: Question[], attempts: QuestionAttempt[]): Question | null {
  if (questions.length === 0) return null;

  const stats = computeTopicStats(attempts);
  const prioritizedTopics = new Set(stats.slice(0, 5).map(s => s.topic));

  // Find candidate questions in prioritized topics that are not recently solved correctly
  const solvedCorrectIds = new Set(attempts.filter(a => a.isCorrect).map(a => a.questionId));

  const highPriorityCandidates = questions.filter(
    q => prioritizedTopics.has(q.topic) && !solvedCorrectIds.has(q.id)
  );

  if (highPriorityCandidates.length > 0) {
    const idx = Math.floor(Math.random() * highPriorityCandidates.length);
    return highPriorityCandidates[idx];
  }

  // Fallback to any unsolved question
  const unsolvedCandidates = questions.filter(q => !solvedCorrectIds.has(q.id));
  if (unsolvedCandidates.length > 0) {
    const idx = Math.floor(Math.random() * unsolvedCandidates.length);
    return unsolvedCandidates[idx];
  }

  // If all solved, return random hard/very_hard question
  const hardQuestions = questions.filter(q => q.difficulty === 'hard' || q.difficulty === 'very_hard' || q.difficulty === 'elite');
  return hardQuestions[Math.floor(Math.random() * hardQuestions.length)] || questions[0];
}

export function getWorstPerformingTopic(attempts: QuestionAttempt[]): TopicStat {
  const stats = computeTopicStats(attempts);
  // Filter for topics with at least 1 attempt first
  const attempted = stats.filter(s => s.attempts > 0);
  if (attempted.length > 0) {
    // Return topic with highest studentWeakness * yieldScore
    attempted.sort((a, b) => (b.studentWeakness * b.yieldScore) - (a.studentWeakness * a.yieldScore));
    return attempted[0];
  }
  // Otherwise top priority topic
  return stats[0];
}

export interface ChapterStat {
  chapter: string;
  subject: Subject;
  yieldScore: number;
  attempts: number;
  correct: number;
  accuracy: number;
  weaknessScore: number;
  priorityScore: number;
  topicsCount: number;
}

export function computeChapterStats(attempts: QuestionAttempt[]): ChapterStat[] {
  const chapterMap: Map<string, ChapterStat> = new Map();

  for (const [subject, chapters] of Object.entries(CEE_SYLLABUS)) {
    for (const chapter of chapters) {
      const key = `${subject}:::${chapter.name}`;
      chapterMap.set(key, {
        chapter: chapter.name,
        subject: subject as Subject,
        yieldScore: chapter.yieldScore,
        attempts: 0,
        correct: 0,
        accuracy: 100,
        weaknessScore: 45,
        priorityScore: chapter.yieldScore,
        topicsCount: chapter.topics.length
      });
    }
  }

  for (const a of attempts) {
    let chapName = a.chapter;
    if (!chapName) {
      for (const chapters of Object.values(CEE_SYLLABUS)) {
        for (const ch of chapters) {
          if (ch.topics.some(t => t.name === a.topic)) {
            chapName = ch.name;
            break;
          }
        }
      }
    }
    chapName = chapName || 'General';
    const key = `${a.subject}:::${chapName}`;
    let stat = chapterMap.get(key);
    if (!stat) {
      stat = {
        chapter: chapName,
        subject: a.subject,
        yieldScore: 85,
        attempts: 0,
        correct: 0,
        accuracy: 0,
        weaknessScore: 50,
        priorityScore: 85,
        topicsCount: 1
      };
      chapterMap.set(key, stat);
    }
    stat.attempts += 1;
    if (a.isCorrect) stat.correct += 1;
  }

  const result: ChapterStat[] = [];
  for (const stat of chapterMap.values()) {
    if (stat.attempts > 0) {
      stat.accuracy = Math.round((stat.correct / stat.attempts) * 100);
      stat.weaknessScore = 100 - stat.accuracy;
    } else {
      stat.weaknessScore = 45;
    }
    stat.priorityScore = Math.round(stat.yieldScore * 0.55 + stat.weaknessScore * 0.45);
    result.push(stat);
  }

  return result.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getWorstPerformingChapter(attempts: QuestionAttempt[]): ChapterStat {
  const stats = computeChapterStats(attempts);
  const attempted = stats.filter(s => s.attempts > 0);
  if (attempted.length > 0) {
    attempted.sort((a, b) => (b.weaknessScore * b.yieldScore) - (a.weaknessScore * a.yieldScore));
    return attempted[0];
  }
  return stats[0];
}

