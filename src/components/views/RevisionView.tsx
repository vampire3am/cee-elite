'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard, QuestionAttempt } from '@/types';
import { db } from '@/lib/db';
import { MathRenderer } from '../MathRenderer';
import { 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  AlertTriangle,
  Flame,
  Plus
} from 'lucide-react';

interface RevisionViewProps {
  onStartRetest: (questionIds: string[]) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ onStartRetest }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mistakes'>('flashcards');

  const loadData = async () => {
    const cards = await db.getFlashcards();
    const atts = await db.getAttempts();
    setFlashcards(cards);
    setAttempts(atts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const now = Date.now();
  const dueCards = flashcards.filter(c => c.nextReviewDate <= now);
  const currentCard = dueCards[currentIdx] || flashcards[currentIdx] || null;

  // Mistake questions list
  const mistakeAttempts = attempts.filter(a => !a.isCorrect);
  const uniqueMistakeQuestionIds = Array.from(new Set(mistakeAttempts.map(a => a.questionId)));

  const handleReviewAnswer = async (quality: 'again' | 'good' | 'easy') => {
    if (!currentCard) return;

    let newInterval = 1;
    let newEase = currentCard.easeFactor;

    if (quality === 'again') {
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
    } else if (quality === 'good') {
      newInterval = Math.max(1, Math.round(currentCard.intervalDays * newEase));
    } else if (quality === 'easy') {
      newInterval = Math.max(2, Math.round(currentCard.intervalDays * newEase * 1.3));
      newEase += 0.15;
    }

    const updated: Flashcard = {
      ...currentCard,
      intervalDays: newInterval,
      easeFactor: newEase,
      repetitions: currentCard.repetitions + 1,
      lastReviewedDate: Date.now(),
      nextReviewDate: Date.now() + newInterval * 24 * 60 * 60 * 1000
    };

    await db.saveFlashcard(updated);
    setIsFlipped(false);
    if (currentIdx + 1 < (dueCards.length > 0 ? dueCards.length : flashcards.length)) {
      setCurrentIdx(prev => prev + 1);
    } else {
      loadData();
      setCurrentIdx(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 pb-24 md:pb-12">
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-[var(--color-surface-2)] text-[var(--color-primary)] font-semibold border border-[var(--color-border)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
            }`}
          >
            Spaced Flashcards ({dueCards.length} due)
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'mistakes'
                ? 'bg-[var(--color-surface-2)] text-[var(--color-primary)] font-semibold border border-[var(--color-border)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
            }`}
          >
            Mistake Notebook ({uniqueMistakeQuestionIds.length})
          </button>
        </div>

        <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider hidden sm:inline">
          SM-2 RETENTION ENGINE
        </span>
      </div>

      {activeTab === 'flashcards' ? (
        currentCard ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
              <span>Card {currentIdx + 1} of {dueCards.length > 0 ? dueCards.length : flashcards.length}</span>
              <span className="text-[var(--color-accent)]">{currentCard.subject} · {currentCard.topic}</span>
            </div>

            {/* Flashcard Surface */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[260px] p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col justify-between cursor-pointer hover:border-[var(--color-border-hover)] transition-all relative select-text"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)] block mb-3">
                  {!isFlipped ? 'Concept Prompt (Tap to flip)' : 'Key Explanation & Answer'}
                </span>
                <div className="text-base font-medium leading-relaxed text-[var(--color-primary)]">
                  <MathRenderer content={!isFlipped ? currentCard.front : currentCard.back} />
                </div>
              </div>

              {/* Trap warning on back of card */}
              {isFlipped && currentCard.trapWarning && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-amber-400 mb-0.5">
                    <AlertTriangle size={13} />
                    <span>COMMON TRAP</span>
                  </div>
                  <MathRenderer content={currentCard.trapWarning} />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                <span className="text-[11px] font-mono">Interval: {currentCard.intervalDays}d</span>
                <span className="text-[11px]">{isFlipped ? 'Answer revealed' : 'Tap to flip card'}</span>
              </div>
            </div>

            {/* Recall Rating Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={() => handleReviewAnswer('again')}
                  className="p-3 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-subtle)] text-[var(--color-error)] font-medium text-xs flex flex-col items-center gap-1 hover:bg-[var(--color-error)]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Again (1d)</span>
                </button>
                <button
                  onClick={() => handleReviewAnswer('good')}
                  className="p-3 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium text-xs flex flex-col items-center gap-1 hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Good ({Math.max(2, Math.round(currentCard.intervalDays * 2))}d)</span>
                </button>
                <button
                  onClick={() => handleReviewAnswer('easy')}
                  className="p-3 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success-subtle)] text-[var(--color-success)] font-medium text-xs flex flex-col items-center gap-1 hover:bg-[var(--color-success)]/20 transition-colors cursor-pointer"
                >
                  <Flame size={14} />
                  <span>Easy ({Math.max(4, Math.round(currentCard.intervalDays * 3))}d)</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center gap-3">
            <CheckCircle2 size={36} className="text-[var(--color-success)]" />
            <h3 className="text-sm font-semibold text-[var(--color-primary)]">
              All caught up on revision!
            </h3>
            <p className="text-xs text-[var(--color-muted)] max-w-sm">
              Any mistakes made during practice are automatically transferred here for spaced interval reinforcement.
            </p>
          </div>
        )
      ) : (
        /* Mistake Notebook View */
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-primary)]">
                Mistake Retention Buffer
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                {uniqueMistakeQuestionIds.length} questions answered incorrectly in recent practice sessions.
              </p>
            </div>

            {uniqueMistakeQuestionIds.length > 0 && (
              <button
                onClick={() => onStartRetest(uniqueMistakeQuestionIds)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Retest Mistakes
              </button>
            )}
          </div>

          {uniqueMistakeQuestionIds.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center gap-2">
              <h4 className="text-sm font-semibold text-[var(--color-primary)]">
                No mistakes yet.
              </h4>
              <p className="text-xs text-[var(--color-muted)] max-w-sm">
                That means you are either new here or terrifyingly accurate. Start a hard practice set to stress-test your conceptual boundaries.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mistakeAttempts.slice(0, 10).map((att, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-[var(--color-primary)] block">
                      {att.topic}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-muted)]">
                      {att.subject} · {att.difficulty.replace('_', ' ').toUpperCase()} · {att.timeSpentSeconds}s
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-error-subtle)] text-[var(--color-error)] border border-[var(--color-error)]/30">
                    Needs Review
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
