'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard, QuestionAttempt, Subject } from '@/types';
import { db } from '@/lib/db';
import { getChaptersForSubject } from '@/lib/syllabus';
import { MathRenderer } from '../MathRenderer';
import { 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  AlertTriangle,
  Flame,
  Plus,
  BookOpen
} from 'lucide-react';

interface RevisionViewProps {
  onStartRetest: (questionIds: string[], subject?: Subject, chapter?: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ onStartRetest }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mistakes'>('flashcards');

  // Chapter and Subject Filters
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [filterChapter, setFilterChapter] = useState<string | 'All'>('All');

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

  // Filter flashcards by subject and chapter
  const filteredFlashcards = flashcards.filter(c => {
    if (filterSubject !== 'All' && c.subject !== filterSubject) return false;
    if (filterChapter !== 'All' && c.chapter !== filterChapter) return false;
    return true;
  });

  const dueCards = filteredFlashcards.filter(c => c.nextReviewDate <= now);
  const currentCard = dueCards[currentIdx] || filteredFlashcards[currentIdx] || null;

  // Mistake questions list with subject and chapter filter
  const mistakeAttempts = attempts.filter(a => {
    if (a.isCorrect) return false;
    if (filterSubject !== 'All' && a.subject !== filterSubject) return false;
    if (filterChapter !== 'All' && a.chapter !== filterChapter) return false;
    return true;
  });
  const uniqueMistakeQuestionIds = Array.from(new Set(mistakeAttempts.map(a => a.questionId)));

  // Chapters available for selected subject
  const availableChapters = filterSubject !== 'All' ? getChaptersForSubject(filterSubject) : [];

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
    if (currentIdx + 1 < (dueCards.length > 0 ? dueCards.length : filteredFlashcards.length)) {
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
            onClick={() => { setActiveTab('flashcards'); setCurrentIdx(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-[var(--color-surface-2)] text-[var(--color-primary)] font-semibold border border-[var(--color-border)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
            }`}
          >
            Spaced Flashcards ({dueCards.length} due)
          </button>
          <button
            onClick={() => { setActiveTab('mistakes'); setCurrentIdx(0); }}
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

      {/* Subject & Chapter Filter Controls */}
      <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Subject Filter */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['All', 'Physics', 'Chemistry', 'Biology', 'MAT'] as const).map(s => (
            <button
              key={s}
              onClick={() => {
                setFilterSubject(s);
                setFilterChapter('All');
                setCurrentIdx(0);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                filterSubject === s
                  ? 'bg-[var(--color-primary)] text-[var(--color-bg)] font-bold'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary)] bg-[var(--color-surface-2)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chapter Dropdown if a subject is chosen */}
        {filterSubject !== 'All' && availableChapters.length > 0 && (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-mono text-[var(--color-muted)] shrink-0">Chapter:</span>
            <select
              value={filterChapter}
              onChange={(e) => {
                setFilterChapter(e.target.value);
                setCurrentIdx(0);
              }}
              className="text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-primary)] px-2 py-1 rounded-md max-w-[220px] truncate focus:outline-none"
            >
              <option value="All">All Chapters</option>
              {availableChapters.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'flashcards' ? (
        currentCard ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
              <span>Card {currentIdx + 1} of {dueCards.length > 0 ? dueCards.length : filteredFlashcards.length}</span>
              <span className="text-[var(--color-accent)] font-semibold truncate max-w-[280px]">
                {currentCard.subject} · {currentCard.chapter || currentCard.topic}
              </span>
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
                    <span>Watch Out (Trap Analysis)</span>
                  </div>
                  <p className="text-[var(--color-muted)] leading-relaxed">
                    {currentCard.trapWarning}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-muted)]">
                <span>Interval: {currentCard.intervalDays}d</span>
                <span>Tap anywhere to {isFlipped ? 'flip back' : 'reveal'}</span>
              </div>
            </div>

            {/* Response Rating Buttons (when flipped) */}
            {isFlipped ? (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleReviewAnswer('again')}
                  className="py-3 px-2 rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error-subtle)] text-[var(--color-error)] font-semibold text-xs text-center hover:opacity-90 transition-opacity cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>Again</span>
                  <span className="text-[10px] font-mono opacity-80">&lt; 1 day</span>
                </button>
                <button
                  onClick={() => handleReviewAnswer('good')}
                  className="py-3 px-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] font-semibold text-xs text-center hover:opacity-90 transition-opacity cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>Good</span>
                  <span className="text-[10px] font-mono text-[var(--color-muted)]">
                    {Math.max(1, Math.round(currentCard.intervalDays * currentCard.easeFactor))}d
                  </span>
                </button>
                <button
                  onClick={() => handleReviewAnswer('easy')}
                  className="py-3 px-2 rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-success-subtle)] text-[var(--color-success)] font-semibold text-xs text-center hover:opacity-90 transition-opacity cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>Easy</span>
                  <span className="text-[10px] font-mono opacity-80">
                    {Math.max(2, Math.round(currentCard.intervalDays * currentCard.easeFactor * 1.3))}d
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] font-semibold text-xs tracking-wider uppercase hover:border-[var(--color-border-hover)] transition-colors cursor-pointer text-center"
              >
                Reveal Explanation
              </button>
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
                {uniqueMistakeQuestionIds.length} questions answered incorrectly in this filter.
              </p>
            </div>

            {uniqueMistakeQuestionIds.length > 0 && (
              <button
                onClick={() => onStartRetest(
                  uniqueMistakeQuestionIds, 
                  filterSubject === 'All' ? undefined : filterSubject, 
                  filterChapter === 'All' ? undefined : filterChapter
                )}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Retest Mistakes
              </button>
            )}
          </div>

          {uniqueMistakeQuestionIds.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center gap-2">
              <h4 className="text-sm font-semibold text-[var(--color-primary)]">
                No mistakes matching this filter.
              </h4>
              <p className="text-xs text-[var(--color-muted)] max-w-sm">
                Keep solving difficult chapter questions to expose hidden blind spots.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mistakeAttempts.slice(0, 10).map((att, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-medium text-[var(--color-primary)] block truncate">
                      {att.chapter || att.topic}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-muted)] block truncate">
                      {att.subject} · {att.topic} · {att.difficulty.replace('_', ' ').toUpperCase()} · {att.timeSpentSeconds}s
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-error-subtle)] text-[var(--color-error)] border border-[var(--color-error)]/30 shrink-0">
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
