'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question, Subject, Difficulty, QuestionAttempt } from '@/types';
import { QuestionCard } from '../QuestionCard';
import { db } from '@/lib/db';
import { 
  Sparkles, 
  RotateCcw, 
  AlertCircle
} from 'lucide-react';

interface PracticeViewProps {
  initialSubject?: Subject;
  initialDifficulty?: Difficulty;
  initialTopic?: string;
  initialMode?: string;
  onAttemptSaved: (attempt: QuestionAttempt) => void;
  onFlashcardCreated: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialSubject,
  initialDifficulty,
  initialTopic,
  initialMode,
  onAttemptSaved,
  onFlashcardCreated
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>(initialSubject || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>(initialDifficulty || 'All');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isGeneratingVariation, setIsGeneratingVariation] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionTotal, setSessionTotal] = useState<number>(0);
  const [activeVariationBase, setActiveVariationBase] = useState<Question | null>(null);

  // Load questions from local DB
  const loadLocalQuestions = useCallback(async () => {
    const list = await db.getQuestions();
    
    let filtered = list;
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    if (initialTopic) {
      const topicMatches = filtered.filter(q => q.topic.toLowerCase().includes(initialTopic.toLowerCase()));
      if (topicMatches.length > 0) filtered = topicMatches;
    }
    if (initialMode === 'past') {
      filtered = filtered.filter(q => q.sourceType === 'verified_past');
    }

    // Shuffle questions slightly for variety
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIdx(0);
  }, [selectedSubject, selectedDifficulty, initialTopic, initialMode]);

  useEffect(() => {
    loadLocalQuestions();
  }, [loadLocalQuestions]);

  const currentQuestion = questions[currentIdx] || null;

  const handleAnswer = async (
    selectedOption: number, 
    isCorrect: boolean, 
    timeSpentSeconds: number, 
    usedHints: number
  ) => {
    if (!currentQuestion) return;

    setSessionTotal(prev => prev + 1);
    if (isCorrect) setSessionCorrect(prev => prev + 1);

    const attempt: QuestionAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      timeSpentSeconds,
      timestamp: Date.now(),
      subject: currentQuestion.subject,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      usedHints
    };

    await db.saveAttempt(attempt);
    onAttemptSaved(attempt);

    // If answer was incorrect, automatically offer/generate a spaced repetition flashcard item
    if (!isCorrect) {
      await db.saveFlashcard({
        id: `card-auto-${Date.now()}`,
        front: currentQuestion.question,
        back: `Correct Answer: Option ${String.fromCharCode(65 + currentQuestion.correctAnswer)}\n\nCore Concept:\n${currentQuestion.explanation}`,
        subject: currentQuestion.subject,
        topic: currentQuestion.topic,
        chapter: currentQuestion.chapter,
        difficulty: currentQuestion.difficulty,
        trapWarning: currentQuestion.commonTrap,
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: Date.now() + 86400000,
        fromMistakeQuestionId: currentQuestion.id
      });
      onFlashcardCreated();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setActiveVariationBase(null);
    } else {
      // Loop or request new AI question
      loadLocalQuestions();
    }
  };

  const handleCreateFlashcard = async (q: Question) => {
    await db.saveFlashcard({
      id: `card-manual-${Date.now()}`,
      front: q.question,
      back: `Correct Answer: Option ${String.fromCharCode(65 + q.correctAnswer)}\n\n${q.explanation}`,
      subject: q.subject,
      topic: q.topic,
      chapter: q.chapter,
      difficulty: q.difficulty,
      trapWarning: q.commonTrap,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: Date.now() + 86400000,
      fromMistakeQuestionId: q.id
    });
    onFlashcardCreated();
  };

  // AI Generation Handler (Call Next.js API Route)
  const handleGenerateAiQuestion = async (difficulty: Difficulty = 'hard') => {
    setIsGeneratingAi(true);
    setAiError(null);

    const targetSubject = selectedSubject === 'All' ? 'Physics' : selectedSubject;
    const settings = db.getSettings();

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.customGeminiApiKey ? { 'x-gemini-key': settings.customGeminiApiKey } : {})
        },
        body: JSON.stringify({
          subject: targetSubject,
          difficulty,
          topic: initialTopic
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'AI service temporarily unavailable.');
      }

      const data = await res.json();
      if (data.question) {
        await db.saveQuestion(data.question);
        // Prepend to current questions and display
        setQuestions(prev => [data.question, ...prev]);
        setCurrentIdx(0);
        setActiveVariationBase(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI temporarily unavailable.';
      setAiError(msg);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // PAST -> HARD Variation Handler
  const handleGenerateHarderVariation = async (baseQ: Question) => {
    setIsGeneratingVariation(true);
    setAiError(null);

    const settings = db.getSettings();

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.customGeminiApiKey ? { 'x-gemini-key': settings.customGeminiApiKey } : {})
        },
        body: JSON.stringify({
          subject: baseQ.subject,
          difficulty: 'very_hard',
          isVariation: true,
          baseQuestion: {
            id: baseQ.id,
            question: baseQ.question,
            topic: baseQ.topic,
            chapter: baseQ.chapter,
            subject: baseQ.subject
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to generate variation.');
      }

      const data = await res.json();
      if (data.question) {
        await db.saveQuestion(data.question);
        setActiveVariationBase(baseQ);
        setQuestions(prev => [data.question, ...prev]);
        setCurrentIdx(0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not generate AI variation.';
      setAiError(msg);
    } finally {
      setIsGeneratingVariation(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 pb-24 md:pb-12">
      {/* Controls & Filter Bar */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap items-center justify-between gap-3">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          {(['All', 'Physics', 'Chemistry', 'Biology', 'MAT'] as const).map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-primary)] font-semibold border border-[var(--color-border)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Difficulty Selection */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'All')}
            className="text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-primary)] px-2.5 py-1 rounded-md focus:outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard (Default)</option>
            <option value="very_hard">Very Hard</option>
            <option value="elite">Elite</option>
          </select>

          {/* AI Generate New Question Button */}
          <button
            onClick={() => handleGenerateAiQuestion(selectedDifficulty === 'All' ? 'hard' : selectedDifficulty)}
            disabled={isGeneratingAi}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            <Sparkles size={13} className={isGeneratingAi ? 'animate-spin' : ''} />
            <span>{isGeneratingAi ? 'Synthesizing...' : 'AI Generate'}</span>
          </button>
        </div>
      </div>

      {/* AI Error Notification (Graceful Fallback) */}
      {aiError && (
        <div className="p-3.5 rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning-subtle)] flex items-start gap-2.5 text-xs text-[var(--color-primary)]">
          <AlertCircle size={16} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-[var(--color-warning)]">
              AI service temporarily unavailable
            </span>
            <span className="text-[var(--color-muted)] mt-0.5 block">
              {aiError}. Continuing seamlessly from local verified question bank.
            </span>
          </div>
          <button
            onClick={() => setAiError(null)}
            className="text-[var(--color-muted)] hover:text-[var(--color-primary)] text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Session Progress Tracker */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)] px-1">
        <div>
          <span>Question </span>
          <span className="text-[var(--color-primary)] font-semibold">{questions.length > 0 ? currentIdx + 1 : 0}</span>
          <span> of </span>
          <span className="text-[var(--color-primary)]">{questions.length}</span>
        </div>

        {sessionTotal > 0 && (
          <div>
            <span>Session: </span>
            <span className="text-[var(--color-success)] font-semibold">{sessionCorrect}</span>
            <span>/{sessionTotal} (</span>
            <span>{Math.round((sessionCorrect / sessionTotal) * 100)}%</span>
            <span>)</span>
          </div>
        )}
      </div>

      {/* Current Question View */}
      {currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          basePastQuestion={activeVariationBase}
          onAnswer={handleAnswer}
          onNextQuestion={handleNextQuestion}
          onCreateFlashcard={handleCreateFlashcard}
          onGenerateHarderVariation={handleGenerateHarderVariation}
          isGeneratingVariation={isGeneratingVariation}
        />
      ) : (
        <div className="p-12 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center gap-3">
          <p className="text-sm text-[var(--color-muted)]">
            No questions matching your current filter in local bank.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => { setSelectedSubject('All'); setSelectedDifficulty('All'); }}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => handleGenerateAiQuestion('hard')}
              disabled={isGeneratingAi}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Generate AI Question</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
