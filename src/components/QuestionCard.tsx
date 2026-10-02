'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { MathRenderer } from './MathRenderer';
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Brain,
  Plus
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  basePastQuestion?: Question | null;
  onAnswer: (selectedOption: number, isCorrect: boolean, timeSpentSeconds: number, usedHints: number) => void;
  onNextQuestion: () => void;
  onCreateFlashcard?: (question: Question) => void;
  onGenerateHarderVariation?: (question: Question) => void;
  isGeneratingVariation?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  basePastQuestion,
  onAnswer,
  onNextQuestion,
  onCreateFlashcard,
  onGenerateHarderVariation,
  isGeneratingVariation = false
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [cardAdded, setCardAdded] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Reset state on question change
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setActiveHintIndex(-1);
    setCardAdded(false);
    setElapsedSeconds(0);
  }, [question.id]);

  // Elapsed time counter
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    const isCorrect = selectedOption === question.correctAnswer;
    setIsSubmitted(true);
    onAnswer(selectedOption, isCorrect, elapsedSeconds, activeHintIndex + 1);
  };

  const handleRevealNextHint = () => {
    if (activeHintIndex < 2) {
      setActiveHintIndex(prev => prev + 1);
    }
  };

  const handleAddFlashcard = () => {
    if (onCreateFlashcard) {
      onCreateFlashcard(question);
      setCardAdded(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'elite':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">ELITE</span>;
      case 'very_hard':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/30">VERY HARD</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">HARD</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">MEDIUM</span>;
    }
  };

  const getSourceBadge = () => {
    if (question.sourceType === 'verified_past' && question.source) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium tracking-tight bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          VERIFIED PAST QUESTION · {question.source}
        </span>
      );
    } else if (question.sourceType === 'ai_variation') {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium tracking-tight bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          <Sparkles size={11} />
          PAST → HARD VARIATION
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium tracking-tight bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Sparkles size={11} />
          AI GENERATED HIGH-YIELD
        </span>
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* If this is an AI variation of a verified past question, show the side-by-side concept bridge */}
      {question.sourceType === 'ai_variation' && basePastQuestion && (
        <div className="p-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs text-[var(--color-muted)]">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)] mb-2">
            <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider font-semibold">
              SOURCE CONCEPT: {question.topic}
            </span>
            <span className="text-[10px] font-mono text-[var(--color-subtle)]">
              Original: {basePastQuestion.source || 'CEE Past Exam'}
            </span>
          </div>
          <div className="text-[11px] text-[var(--color-muted)] line-clamp-2">
            <span className="font-semibold text-[var(--color-primary)]">Original: </span>
            <MathRenderer content={basePastQuestion.question} />
          </div>
        </div>
      )}

      {/* Main Question Surface Card */}
      <div className="p-5 md:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        {/* Card Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-[var(--color-border)] mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {getSourceBadge()}
            {getDifficultyBadge(question.difficulty)}
            <span className="text-xs font-mono text-[var(--color-muted)]">
              {question.subject} · {question.chapter}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live timer */}
            <div className={`flex items-center gap-1 font-mono text-xs ${
              elapsedSeconds > (question.estimatedTimeSeconds || 90)
                ? 'text-[var(--color-warning)]'
                : 'text-[var(--color-muted)]'
            }`}>
              <Clock size={13} />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark question"
              className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer"
            >
              {isBookmarked ? (
                <BookmarkCheck size={16} className="text-[var(--color-accent)]" />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Question Statement */}
        <div className="text-base md:text-lg text-[var(--color-primary)] font-medium leading-relaxed mb-6">
          <MathRenderer content={question.question} />
        </div>

        {/* 4 Large Touch-Friendly Options */}
        <div className="grid grid-cols-1 gap-2.5 mb-6">
          {question.options.map((option, index) => {
            const isChosen = selectedOption === index;
            const isCorrect = index === question.correctAnswer;
            
            let optionStyles = 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-3)]';

            if (!isSubmitted) {
              if (isChosen) {
                optionStyles = 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-primary)] ring-1 ring-[var(--color-accent)]';
              }
            } else {
              if (isCorrect) {
                optionStyles = 'border-[var(--color-success)] bg-[var(--color-success-subtle)] text-[var(--color-primary)] font-medium ring-1 ring-[var(--color-success)]';
              } else if (isChosen && !isCorrect) {
                optionStyles = 'border-[var(--color-error)] bg-[var(--color-error-subtle)] text-[var(--color-primary)] ring-1 ring-[var(--color-error)]';
              } else {
                optionStyles = 'border-[var(--color-border)] bg-[var(--color-surface-2)] opacity-50 text-[var(--color-muted)]';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isSubmitted}
                className={`w-full min-h-[48px] p-3.5 rounded-lg border text-left transition-all flex items-start gap-3 touch-target cursor-pointer ${optionStyles}`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 border ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                      : isChosen
                        ? 'bg-[var(--color-error)] border-[var(--color-error)] text-white'
                        : 'border-[var(--color-border)] text-[var(--color-muted)]'
                    : isChosen
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] bg-[var(--color-surface)]'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>

                <div className="flex-1 text-sm md:text-base leading-snug pt-0.5">
                  <MathRenderer content={option} />
                </div>

                {isSubmitted && isCorrect && (
                  <CheckCircle2 size={18} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                )}
                {isSubmitted && isChosen && !isCorrect && (
                  <XCircle size={18} className="text-[var(--color-error)] shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            {/* Hint System Button */}
            {!isSubmitted && (
              <button
                onClick={handleRevealNextHint}
                disabled={activeHintIndex >= 2}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer disabled:opacity-50 flex-1 sm:flex-none"
              >
                <Lightbulb size={14} className={activeHintIndex >= 0 ? 'text-[var(--color-warning)]' : ''} />
                <span>
                  {activeHintIndex === -1 
                    ? 'Get Hint 1' 
                    : activeHintIndex === 0 
                      ? 'Get Hint 2' 
                      : activeHintIndex === 1 
                        ? 'Get Hint 3' 
                        : 'All Hints Active'}
                </span>
              </button>
            )}

            {/* Topic tag */}
            <span className="hidden sm:inline-block text-[11px] font-mono text-[var(--color-subtle)]">
              Topic: {question.topic}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm text-center"
              >
                Submit Answer
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {/* Generate Harder Variation button for verified questions */}
                {question.sourceType === 'verified_past' && onGenerateHarderVariation && (
                  <button
                    onClick={() => onGenerateHarderVariation(question)}
                    disabled={isGeneratingVariation}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} className={isGeneratingVariation ? 'animate-spin' : ''} />
                    <span>{isGeneratingVariation ? 'Generating...' : 'PAST → HARD Mode'}</span>
                  </button>
                )}

                <button
                  onClick={onNextQuestion}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 transition-all cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3-Tier Progressive Hint Drawer */}
        {activeHintIndex >= 0 && (
          <div className="mt-5 p-4 rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning-subtle)] flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-warning)]">
              <Lightbulb size={14} />
              <span>PROGRESSIVE REASONING HINTS ({activeHintIndex + 1}/3)</span>
            </div>

            {question.hints && (
              <div className="flex flex-col gap-2 text-xs leading-relaxed text-[var(--color-primary)]">
                {activeHintIndex >= 0 && question.hints[0] && (
                  <div className="p-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase block mb-0.5">Hint 1 · Conceptual Direction</span>
                    <MathRenderer content={question.hints[0]} />
                  </div>
                )}
                {activeHintIndex >= 1 && question.hints[1] && (
                  <div className="p-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase block mb-0.5">Hint 2 · Governing Formula / Fact</span>
                    <MathRenderer content={question.hints[1]} />
                  </div>
                )}
                {activeHintIndex >= 2 && question.hints[2] && (
                  <div className="p-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase block mb-0.5">Hint 3 · Near-Solution</span>
                    <MathRenderer content={question.hints[2]} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post-Submission Deep AI Explanation Panel */}
      {isSubmitted && (
        <div className="p-5 md:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              {selectedOption === question.correctAnswer ? (
                <div className="flex items-center gap-1.5 text-[var(--color-success)] text-sm font-semibold">
                  <CheckCircle2 size={18} />
                  <span>Correct</span>
                  <span className="text-xs font-mono text-[var(--color-muted)]">({elapsedSeconds}s)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[var(--color-error)] text-sm font-semibold">
                  <XCircle size={18} />
                  <span>Incorrect</span>
                  <span className="text-xs font-mono text-[var(--color-muted)]">
                    (Correct answer is {String.fromCharCode(65 + question.correctAnswer)})
                  </span>
                </div>
              )}
            </div>

            {/* Quick add to Flashcards */}
            {onCreateFlashcard && (
              <button
                onClick={handleAddFlashcard}
                disabled={cardAdded}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-60"
              >
                <Plus size={13} />
                <span>{cardAdded ? 'Saved to Cards' : 'Save as Flashcard'}</span>
              </button>
            )}
          </div>

          {/* Explanation Section */}
          <div className="space-y-3 text-sm leading-relaxed text-[var(--color-primary)]">
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Why this is correct
              </h4>
              <MathRenderer content={question.explanation} />
            </div>

            {/* Detailed Step-by-Step Solution if separate */}
            {question.solution && question.solution !== question.explanation && (
              <div className="pt-2 border-t border-[var(--color-border)]">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-muted)] mb-1">
                  Step-by-Step Derivation
                </h4>
                <div className="p-3 rounded-lg bg-[var(--color-surface-2)] text-xs">
                  <MathRenderer content={question.solution} />
                </div>
              </div>
            )}

            {/* Expert Shortcut / Insight */}
            {question.shortcut && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-blue-400 mb-1">
                  <TrendingUp size={14} />
                  <span>SHORTCUT / EXAM INSIGHT</span>
                </div>
                <MathRenderer content={question.shortcut} />
              </div>
            )}

            {/* Common Trap */}
            {question.commonTrap && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
                  <AlertTriangle size={14} />
                  <span>COMMON CEE TRAP</span>
                </div>
                <MathRenderer content={question.commonTrap} />
              </div>
            )}

            {/* Expert Reasoning */}
            {question.expertReasoning && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-purple-400 mb-1">
                  <Brain size={14} />
                  <span>EXPERT REASONING (SHORTEST DEDUCTION)</span>
                </div>
                <MathRenderer content={question.expertReasoning} />
              </div>
            )}

            {/* Concepts tags */}
            {question.concepts && question.concepts.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] font-mono text-[var(--color-subtle)] uppercase">Concepts:</span>
                {question.concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-muted)] font-mono"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
