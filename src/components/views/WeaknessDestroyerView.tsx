'use client';

import React, { useState, useEffect } from 'react';
import { Question, QuestionAttempt, TopicStat } from '@/types';
import { getWorstPerformingTopic } from '@/lib/adaptive';
import { db } from '@/lib/db';
import { QuestionCard } from '../QuestionCard';
import { 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';

interface WeaknessDestroyerViewProps {
  attempts: QuestionAttempt[];
  onBack: () => void;
  onAttemptSaved: (attempt: QuestionAttempt) => void;
}

export const WeaknessDestroyerView: React.FC<WeaknessDestroyerViewProps> = ({
  attempts,
  onBack,
  onAttemptSaved
}) => {
  const [targetTopic, setTargetTopic] = useState<TopicStat | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [initialAccuracy, setInitialAccuracy] = useState<number>(50);

  useEffect(() => {
    const worst = getWorstPerformingTopic(attempts);
    setTargetTopic(worst);
    setInitialAccuracy(worst.attempts > 0 ? worst.accuracy : 50);

    // Prepare 20 questions structured as:
    // 5 conceptual (medium) + 5 medium-hard + 5 hard + 5 very hard
    const prepareQuestions = async () => {
      const allQ = await db.getQuestions();
      const topicMatches = allQ.filter(q => 
        q.topic.toLowerCase().includes(worst.topic.toLowerCase()) ||
        q.chapter.toLowerCase().includes(worst.chapter.toLowerCase()) ||
        q.subject === worst.subject
      );

      // Distribute across difficulties
      const mediumQ = topicMatches.filter(q => q.difficulty === 'medium');
      const hardQ = topicMatches.filter(q => q.difficulty === 'hard');
      const veryHardQ = topicMatches.filter(q => q.difficulty === 'very_hard' || q.difficulty === 'elite');

      const set: Question[] = [];
      const pushOrClone = (candidates: Question[], count: number, targetDiff: 'medium' | 'hard' | 'very_hard') => {
        for (let i = 0; i < count; i++) {
          if (candidates.length > i) {
            set.push(candidates[i]);
          } else if (topicMatches.length > 0) {
            // Adapt existing question to fill tier
            const base = topicMatches[i % topicMatches.length];
            set.push({
              ...base,
              id: `weak-drill-${targetDiff}-${i}-${Date.now()}`,
              difficulty: targetDiff
            });
          }
        }
      };

      pushOrClone(mediumQ, 5, 'medium');
      pushOrClone(hardQ, 5, 'medium');
      pushOrClone(hardQ, 5, 'hard');
      pushOrClone(veryHardQ, 5, 'very_hard');

      setQuestions(set);
    };

    prepareQuestions();
  }, [attempts]);

  const currentQ = questions[currentIdx] || null;

  const handleAnswer = async (
    selectedOption: number, 
    isCorrect: boolean, 
    timeSpentSeconds: number, 
    usedHints: number
  ) => {
    if (!currentQ) return;
    if (isCorrect) setCorrectAnswers(prev => prev + 1);

    const attempt: QuestionAttempt = {
      id: `weak-att-${Date.now()}`,
      questionId: currentQ.id,
      selectedOption,
      isCorrect,
      timeSpentSeconds,
      timestamp: Date.now(),
      subject: currentQ.subject,
      topic: currentQ.topic,
      chapter: currentQ.chapter || currentQ.topic,
      difficulty: currentQ.difficulty,
      usedHints
    };

    await db.saveAttempt(attempt);
    onAttemptSaved(attempt);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const finalAccuracy = questions.length > 0 
    ? Math.round((correctAnswers / questions.length) * 100) 
    : 0;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Hub</span>
        </button>

        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-error)] font-bold flex items-center gap-1">
          <ShieldAlert size={12} />
          DESTROY MY WEAKNESS DRILL
        </span>
      </div>

      {targetTopic && (
        <div className="p-4 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-subtle)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-error)] font-semibold block">
              TARGET WEAKNESS CONCEPT
            </span>
            <h2 className="text-base font-bold text-[var(--color-primary)]">
              {targetTopic.topic}
            </h2>
            <span className="text-xs text-[var(--color-muted)]">
              {targetTopic.subject} · {targetTopic.chapter}
            </span>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-[var(--color-muted)] block">Pre-Drill Accuracy</span>
            <span className="text-base font-bold text-[var(--color-error)]">{initialAccuracy}%</span>
          </div>
        </div>
      )}

      {/* Drill Progress Bar (5 Conceptual + 5 Med-Hard + 5 Hard + 5 Very Hard) */}
      {!isCompleted && questions.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
            <span>
              Question {currentIdx + 1} of {questions.length} (
              {currentIdx < 5 ? 'Conceptual Stage' : currentIdx < 10 ? 'Medium-Hard Stage' : currentIdx < 15 ? 'Hard Stage' : 'Very Hard Stage'}
              )
            </span>
            <span>Accuracy: {currentIdx > 0 ? Math.round((correctAnswers / currentIdx) * 100) : 0}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
            <div
              className="h-full bg-[var(--color-error)] transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Question or Completion Screen */}
      {!isCompleted ? (
        currentQ && (
          <QuestionCard
            question={currentQ}
            onAnswer={handleAnswer}
            onNextQuestion={handleNext}
          />
        )
      ) : (
        /* Completion Screen with Before/After stats */
        <div className="p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 flex items-center justify-center text-[var(--color-success)]">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[var(--color-primary)]">
              Weakness Destroyed
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 max-w-md mx-auto">
              Completed 20 progressive conceptual, hard, and very-hard problems on {targetTopic?.topic}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] font-mono text-center">
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">Before Drill</span>
              <span className="text-2xl font-bold text-[var(--color-error)]">{initialAccuracy}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">After Drill</span>
              <span className="text-2xl font-bold text-[var(--color-success)]">{finalAccuracy}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-success)]">
            <TrendingUp size={14} />
            <span>Net Mastery Shift: {finalAccuracy - initialAccuracy > 0 ? `+${finalAccuracy - initialAccuracy}%` : 'Reinforced'}</span>
          </div>

          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 transition-opacity cursor-pointer mt-2"
          >
            Return to Command Center
          </button>
        </div>
      )}
    </div>
  );
};
