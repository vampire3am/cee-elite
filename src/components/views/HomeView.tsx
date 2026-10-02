'use client';

import React from 'react';
import { 
  Flame, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { QuestionAttempt, Flashcard } from '@/types';
import { getNextBestAction, computeTopicStats } from '@/lib/adaptive';

interface HomeViewProps {
  attempts: QuestionAttempt[];
  flashcards: Flashcard[];
  streak: { current: number; best: number };
  onStartMode: (mode: string, params?: { subject?: string; difficulty?: string; topic?: string }) => void;
  onOpenRevision: () => void;
  onOpenWeaknessDestroyer: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  attempts,
  flashcards,
  streak,
  onStartMode,
  onOpenRevision,
  onOpenWeaknessDestroyer
}) => {
  const nextAction = getNextBestAction(attempts);
  const topicStats = computeTopicStats(attempts);

  // Today's attempts calculation
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  const todayAttempts = attempts.filter(a => a.timestamp >= todayTimestamp);
  const todayTotal = todayAttempts.length;
  const todayCorrect = todayAttempts.filter(a => a.isCorrect).length;
  const todayAccuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;
  
  // Total study time calculation
  const totalSeconds = attempts.reduce((acc, a) => acc + a.timeSpentSeconds, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Daily target progress
  const targetQuestions = 50;
  const progressPercent = Math.min(100, Math.round((todayTotal / targetQuestions) * 100));

  // Weak topics (highest student weakness with at least 1 attempt or highest yield)
  const weakTopics = topicStats
    .filter(t => t.attempts > 0 && t.accuracy < 75)
    .slice(0, 3);

  // Due flashcards
  const now = Date.now();
  const dueCards = flashcards.filter(f => f.nextReviewDate <= now);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning.';
    if (hour < 17) return 'Good afternoon.';
    return 'Good evening.';
  };

  const practicePills = [
    { id: 'hard', label: '🔥 HARD PRACTICE', diff: 'hard' },
    { id: 'high_yield', label: '⚡ HIGH-YIELD', mode: 'high_yield' },
    { id: 'weak_topics', label: '🧠 WEAK TOPICS', mode: 'weak' },
    { id: 'past_questions', label: '📜 PAST QUESTIONS', mode: 'past' },
    { id: 'very_hard', label: '💀 VERY HARD', diff: 'very_hard' },
    { id: 'biology', label: '🧬 BIOLOGY GRIND', subject: 'Biology' },
    { id: 'chemistry', label: '⚗️ CHEMISTRY', subject: 'Chemistry' },
    { id: 'physics', label: '⚛️ PHYSICS', subject: 'Physics' },
    { id: 'mat', label: '⚡ MAT (MENTAL AGILITY)', subject: 'MAT' },
    { id: 'mixed', label: '🎯 MIXED CEE', mode: 'mixed' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 pb-20 md:pb-12">
      {/* Hero Greeting & Status */}
      <div className="flex flex-col gap-1 pt-2">
        <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider">
          {getGreeting()}
        </span>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-primary)]">
            CEE ELITE
          </h1>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Flame size={14} className="text-[var(--color-warning)] fill-[var(--color-warning)]" />
            <span>{streak.current} day streak</span>
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          Hard questions. High-yield preparation. No nonsense.
        </p>
      </div>

      <div className="h-px bg-[var(--color-border)] w-full" />

      {/* Today's Progress Card */}
      <div className="p-4 md:p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--color-muted)] uppercase tracking-wider">Today&apos;s Progress</span>
          <span className="text-[var(--color-primary)] font-semibold">{progressPercent}%</span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)] pt-1">
          <div>
            <span className="text-[var(--color-primary)] font-semibold">{todayTotal}</span> Questions
          </div>
          <div>
            <span className="text-[var(--color-primary)] font-semibold">{todayAccuracy}%</span> Accuracy
          </div>
          <div>
            <span className="text-[var(--color-primary)] font-semibold">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span> Study
          </div>
        </div>
      </div>

      {/* Next Best Action Card (Single Tap to Highest-Yield Study) */}
      <div className="p-5 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-subtle)] relative overflow-hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[var(--color-accent)] flex items-center gap-1.5">
            <Sparkles size={13} />
            NEXT BEST ACTION · ADAPTIVE CEE PRIORITY
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-semibold">
            Yield: {nextAction.yieldScore}
          </span>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--color-primary)]">
            {nextAction.topic}
          </h2>
          <span className="text-xs text-[var(--color-muted)] block mt-0.5">
            {nextAction.subject} · {nextAction.chapter} · {nextAction.recommendedDifficulty.replace('_', ' ').toUpperCase()}
          </span>
          <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
            {nextAction.rationale}
          </p>
        </div>

        <button
          onClick={() => onStartMode('adaptive', { 
            subject: nextAction.subject, 
            topic: nextAction.topic, 
            difficulty: nextAction.recommendedDifficulty 
          })}
          className="mt-1 w-full py-2.5 px-4 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold text-xs tracking-wide uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          <span>Start Recommended Practice</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Special Modes Quick Bar */}
      <div className="grid grid-cols-2 gap-3">
        {/* Destroy My Weakness */}
        <button
          onClick={onOpenWeaknessDestroyer}
          className="p-4 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-subtle)] text-left flex flex-col justify-between gap-3 hover:border-[var(--color-error)]/60 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--color-error)] flex items-center gap-1">
              <ShieldAlert size={13} />
              HARDCORE
            </span>
            <ArrowRight size={14} className="text-[var(--color-error)] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] leading-tight">
              Destroy My Weakness
            </h3>
            <p className="text-[11px] text-[var(--color-muted)] mt-1">
              20 progressive questions targeting your lowest accuracy topic.
            </p>
          </div>
        </button>

        {/* Surprise Me Mode */}
        <button
          onClick={() => onStartMode('surprise')}
          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left flex flex-col justify-between gap-3 hover:border-[var(--color-border-hover)] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--color-warning)] flex items-center gap-1">
              <Zap size={13} />
              UNPREDICTABLE
            </span>
            <ArrowRight size={14} className="text-[var(--color-muted)] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] leading-tight">
              Surprise Me
            </h3>
            <p className="text-[11px] text-[var(--color-muted)] mt-1">
              Blind challenge selected by forgetting score & high-yield balance.
            </p>
          </div>
        </button>
      </div>

      {/* Weak Topics Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
            Weak Topics (App-Derived Priority)
          </span>
          <span className="text-[11px] font-mono text-[var(--color-subtle)]">
            {topicStats.length} syllabus nodes
          </span>
        </div>

        {weakTopics.length > 0 ? (
          <div className="flex flex-col gap-2">
            {weakTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => onStartMode('topic', { subject: topic.subject, topic: topic.topic })}
                className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between hover:border-[var(--color-border-hover)] transition-colors text-left cursor-pointer"
              >
                <div>
                  <span className="text-xs font-medium text-[var(--color-primary)] block">
                    {topic.topic}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-muted)]">
                    {topic.subject} · Yield {topic.yieldScore}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-semibold ${
                    topic.accuracy < 50 ? 'text-[var(--color-error)]' : 'text-[var(--color-warning)]'
                  }`}>
                    {topic.accuracy}%
                  </span>
                  <ArrowRight size={13} className="text-[var(--color-subtle)]" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-muted)] flex items-center justify-between">
            <span>No critical weakness detected yet. Start solving questions to populate priority curves.</span>
          </div>
        )}
      </div>

      {/* Due Revision Section */}
      <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
            <RotateCcw size={16} />
          </div>
          <div>
            <span className="text-xs font-medium text-[var(--color-primary)] block">
              Due Revision
            </span>
            <span className="text-[11px] text-[var(--color-muted)]">
              {dueCards.length > 0 ? `${dueCards.length} flashcards due for review` : 'All flashcards reviewed for today'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenRevision}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
        >
          Review
        </button>
      </div>

      {/* Quick Practice Modes Grid */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
          Targeted Practice Modes
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {practicePills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => onStartMode(pill.mode || pill.id, { 
                subject: pill.subject, 
                difficulty: pill.diff 
              })}
              className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-2)] transition-colors text-left text-xs font-medium text-[var(--color-primary)] cursor-pointer"
            >
              <div className="truncate">{pill.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
