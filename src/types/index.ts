export type Subject = 'Physics' | 'Chemistry' | 'Biology' | 'MAT';

export type Difficulty = 'medium' | 'hard' | 'very_hard' | 'elite';

export type QuestionSourceType = 'verified_past' | 'ai_generated' | 'ai_variation';

export interface Question {
  id: string;
  sourceType: QuestionSourceType;
  subject: Subject;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  solution: string;
  concepts: string[];
  commonTrap: string;
  estimatedTimeSeconds: number;
  shortcut?: string;
  expertReasoning?: string;
  hints?: [string, string, string]; // Hint 1 (direction), Hint 2 (equation/fact), Hint 3 (almost-solution)
  source?: string | null; // e.g. "CEE 2080", "MECEE-BL 2079", "IOM 2019"
  year?: number | null; // e.g. 2080
  verificationStatus: 'verified' | 'unverified' | 'ai_generated';
  originalPastQuestionId?: string; // If this is an ai_variation of a past question
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  usedHints: number;
}

export interface TopicStat {
  topic: string;
  chapter: string;
  subject: Subject;
  attempts: number;
  correct: number;
  accuracy: number;
  yieldScore: number;
  pastQuestionFrequency: number; // 1 - 100 scale
  conceptImportance: number; // 1 - 100 scale
  studentWeakness: number; // 0 - 100 scale
  recentMistakeRate: number; // 0 - 100 scale
  priorityScore: number; // Combined adaptive weight
}

export interface Flashcard {
  id: string;
  front: string; // Concept / Prompt / Formula
  back: string; // Answer / Derivation / Key distinction
  subject: Subject;
  topic: string;
  chapter: string;
  difficulty: Difficulty;
  trapWarning?: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: number;
  lastReviewedDate?: number;
  fromMistakeQuestionId?: string;
}

export interface MockExamQuestionState {
  questionId: string;
  selectedOption: number | null;
  markedForReview: boolean;
  timeSpentSeconds: number;
  visited: boolean;
}

export interface MockExamResult {
  id: string;
  title: string;
  timestamp: number;
  totalQuestions: number;
  totalAttempted: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  score: number; // +1 for correct, -0.25 for incorrect
  maxScore: number;
  percentage: number;
  timeTakenSeconds: number;
  subjectScores: Record<Subject, { correct: number; incorrect: number; unattempted: number; score: number }>;
  questions: {
    question: Question;
    selectedOption: number | null;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }[];
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  customGeminiApiKey?: string;
  difficultyDistribution: {
    medium: number;
    hard: number;
    very_hard: number;
    elite: number;
  };
  negativeMarkingEnabled: boolean;
  hapticFeedback: boolean;
  dailyGoalQuestions: number;
}

export interface ExportDataPayload {
  version: string;
  exportDate: string;
  attempts: QuestionAttempt[];
  flashcards: Flashcard[];
  mockHistory: MockExamResult[];
  notes: Record<string, string>;
  customQuestions: Question[];
  settings: UserSettings;
  streak: {
    current: number;
    best: number;
    lastActiveDate: string;
  };
}
