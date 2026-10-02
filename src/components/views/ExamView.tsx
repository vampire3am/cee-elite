'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { Question, Subject, MockExamResult, MockExamQuestionState } from '@/types';
import { db } from '@/lib/db';
import { MathRenderer } from '../MathRenderer';
import { 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Award,
  Grid
} from 'lucide-react';

interface ExamViewProps {
  onExamComplete: (result: MockExamResult) => void;
  onExitExam: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ onExamComplete, onExitExam }) => {
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [questionStates, setQuestionStates] = useState<Record<string, MockExamQuestionState>>({});
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(180 * 60); // 3 hours
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [examType, setExamType] = useState<'full_200' | 'rapid_50'>('rapid_50');
  const paletteDialogId = useId();

  // Initialize mock exam questions from database
  const initExam = async (type: 'full_200' | 'rapid_50') => {
    const all = await db.getQuestions();
    const count = type === 'full_200' ? 200 : 50;

    // Distribute according to CEE proportions (Bio: 40%, Phys: 25%, Chem: 25%, MAT: 10%)
    const bioTarget = Math.round(count * 0.40);
    const phyTarget = Math.round(count * 0.25);
    const chemTarget = Math.round(count * 0.25);
    const matTarget = count - (bioTarget + phyTarget + chemTarget);

    const pickForSubject = (subj: Subject, needed: number) => {
      const available = all.filter(q => q.subject === subj);
      const res: Question[] = [];
      for (let i = 0; i < needed; i++) {
        if (available.length > i) {
          res.push(available[i]);
        } else if (available.length > 0) {
          // Clone with unique ID if bank is smaller than 200
          const base = available[i % available.length];
          res.push({
            ...base,
            id: `mock-q-${subj}-${i}-${Date.now()}`
          });
        }
      }
      return res;
    };

    const selected: Question[] = [
      ...pickForSubject('Physics', phyTarget),
      ...pickForSubject('Chemistry', chemTarget),
      ...pickForSubject('Biology', bioTarget),
      ...pickForSubject('MAT', matTarget)
    ];

    const initialStates: Record<string, MockExamQuestionState> = {};
    selected.forEach(q => {
      initialStates[q.id] = {
        questionId: q.id,
        selectedOption: null,
        markedForReview: false,
        timeSpentSeconds: 0,
        visited: false
      };
    });

    setExamQuestions(selected);
    setQuestionStates(initialStates);
    setTimeRemainingSeconds(type === 'full_200' ? 180 * 60 : 45 * 60);
    setIsExamStarted(true);
    setCurrentIdx(0);
  };

  // Timer countdown
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, isExamSubmitted]);

  const currentQ = examQuestions[currentIdx] || null;
  const currentState = currentQ ? questionStates[currentQ.id] : null;

  // Mark current question as visited
  useEffect(() => {
    if (currentQ && !questionStates[currentQ.id]?.visited) {
      setQuestionStates(prev => ({
        ...prev,
        [currentQ.id]: {
          ...prev[currentQ.id],
          visited: true
        }
      }));
    }
  }, [currentIdx, currentQ]);

  const handleSelectOption = (optionIdx: number) => {
    if (!currentQ || isExamSubmitted) return;
    setQuestionStates(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: prev[currentQ.id]?.selectedOption === optionIdx ? null : optionIdx
      }
    }));
  };

  const handleToggleMark = () => {
    if (!currentQ || isExamSubmitted) return;
    setQuestionStates(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        markedForReview: !prev[currentQ.id]?.markedForReview
      }
    }));
  };

  const handleSubmitExam = useCallback(async () => {
    if (isExamSubmitted) return;
    setIsExamSubmitted(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const subjectScores: Record<Subject, { correct: number; incorrect: number; unattempted: number; score: number }> = {
      Physics: { correct: 0, incorrect: 0, unattempted: 0, score: 0 },
      Chemistry: { correct: 0, incorrect: 0, unattempted: 0, score: 0 },
      Biology: { correct: 0, incorrect: 0, unattempted: 0, score: 0 },
      MAT: { correct: 0, incorrect: 0, unattempted: 0, score: 0 }
    };

    const detailedQuestions = examQuestions.map(q => {
      const state = questionStates[q.id];
      const selected = state?.selectedOption ?? null;
      const isCorrect = selected === q.correctAnswer;
      const isUnattempted = selected === null;

      if (isUnattempted) {
        unattemptedCount += 1;
        subjectScores[q.subject].unattempted += 1;
      } else if (isCorrect) {
        correctCount += 1;
        subjectScores[q.subject].correct += 1;
        subjectScores[q.subject].score += 1.0;
      } else {
        incorrectCount += 1;
        subjectScores[q.subject].incorrect += 1;
        subjectScores[q.subject].score -= 0.25;
      }

      return {
        question: q,
        selectedOption: selected,
        isCorrect,
        timeSpentSeconds: state?.timeSpentSeconds || 0
      };
    });

    const netScore = Math.max(0, correctCount * 1.0 - incorrectCount * 0.25);
    const maxScore = examQuestions.length;
    const percentage = Math.round((netScore / maxScore) * 100);

    const result: MockExamResult = {
      id: `mock-res-${Date.now()}`,
      title: examType === 'full_200' ? 'CEE Full Simulation (200 Questions)' : 'CEE Diagnostic Mock (50 Questions)',
      timestamp: Date.now(),
      totalQuestions: examQuestions.length,
      totalAttempted: correctCount + incorrectCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      score: Number(netScore.toFixed(2)),
      maxScore,
      percentage,
      timeTakenSeconds: (examType === 'full_200' ? 180 * 60 : 45 * 60) - timeRemainingSeconds,
      subjectScores,
      questions: detailedQuestions
    };

    await db.saveMockResult(result);
    setExamResult(result);
    onExamComplete(result);
  }, [examQuestions, questionStates, examType, timeRemainingSeconds, isExamSubmitted, onExamComplete]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-exam launch configuration screen
  if (!isExamStarted) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 py-6 pb-24 md:pb-12">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <button
            onClick={onExitExam}
            className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Hub</span>
          </button>
          <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">
            STRICT EXAM SIMULATOR
          </span>
        </div>

        <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
              Nepal CEE Examination Simulator
            </h2>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              Distraction-free environment replicating real MECEE-BL examination conditions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Marking Scheme</span>
              <span className="font-semibold text-[var(--color-success)]">+1.0</span> for correct,{' '}
              <span className="font-semibold text-[var(--color-error)]">-0.25</span> negative penalty
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">AI & Hints</span>
              <span className="font-semibold text-[var(--color-primary)]">Strictly Disabled</span> during exam
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider">
              Select Examination Format
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExamType('rapid_50')}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  examType === 'rapid_50'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                }`}
              >
                <span className="text-xs font-bold text-[var(--color-primary)] block">Diagnostic Mock</span>
                <span className="text-[11px] text-[var(--color-muted)] block mt-0.5">50 Questions · 45 Mins</span>
                <span className="text-[10px] font-mono text-[var(--color-accent)] mt-2 block">High-yield sprint</span>
              </button>

              <button
                onClick={() => setExamType('full_200')}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  examType === 'full_200'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                }`}
              >
                <span className="text-xs font-bold text-[var(--color-primary)] block">Full CEE Mock</span>
                <span className="text-[11px] text-[var(--color-muted)] block mt-0.5">200 Questions · 3 Hours</span>
                <span className="text-[10px] font-mono text-[var(--color-accent)] mt-2 block">Standard MEC Format</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => initExam(examType)}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-sm mt-3"
          >
            Commence Examination
          </button>
        </div>
      </div>
    );
  }

  // Post-Exam Scorecard Report Screen
  if (isExamSubmitted && examResult) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 py-6 pb-24 md:pb-12">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-success)] font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            EXAMINATION REPORT & SCORECARD
          </span>
          <button
            onClick={onExitExam}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer"
          >
            Close Exam
          </button>
        </div>

        <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
                {examResult.title}
              </h2>
              <span className="text-xs font-mono text-[var(--color-muted)]">
                Completed in {Math.floor(examResult.timeTakenSeconds / 60)} minutes
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
              <Award size={24} />
            </div>
          </div>

          {/* Primary Score Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] font-mono text-center">
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">Net Score</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                {examResult.score} <span className="text-xs text-[var(--color-muted)]">/ {examResult.maxScore}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">Correct</span>
              <span className="text-2xl font-bold text-[var(--color-success)]">
                +{examResult.correctCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">Penalty</span>
              <span className="text-2xl font-bold text-[var(--color-error)]">
                -{(examResult.incorrectCount * 0.25).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Subject-Wise Breakdown Table */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
              Subject Breakdown
            </span>
            <div className="border border-[var(--color-border)] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)] font-mono text-[11px] text-[var(--color-muted)]">
                    <th className="p-2.5">Subject</th>
                    <th className="p-2.5 text-center">Correct</th>
                    <th className="p-2.5 text-center">Incorrect</th>
                    <th className="p-2.5 text-right">Net Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {Object.entries(examResult.subjectScores).map(([sub, score]) => (
                    <tr key={sub}>
                      <td className="p-2.5 font-medium text-[var(--color-primary)]">{sub}</td>
                      <td className="p-2.5 text-center text-[var(--color-success)] font-mono">+{score.correct}</td>
                      <td className="p-2.5 text-center text-[var(--color-error)] font-mono">-{score.incorrect}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-[var(--color-primary)]">
                        {score.score.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={onExitExam}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer mt-2"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  // Active Distraction-Free Exam Screen
  const answeredCount = Object.values(questionStates).filter(s => s.selectedOption !== null).length;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 pb-28 md:pb-12">
      {/* Exam Header Controls */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[var(--color-primary)]">
            Q {currentIdx + 1}/{examQuestions.length}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-muted)]">
            {currentQ?.subject}
          </span>
        </div>

        {/* Live Examination Countdown */}
        <div className={`flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded-md border ${
          timeRemainingSeconds < 300 
            ? 'border-[var(--color-error)] text-[var(--color-error)] bg-[var(--color-error-subtle)] animate-pulse'
            : 'border-[var(--color-border)] text-[var(--color-primary)] bg-[var(--color-surface-2)]'
        }`}>
          <Clock size={13} />
          <span>{formatTimer(timeRemainingSeconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPalette(!showPalette)}
            aria-expanded={showPalette}
            aria-controls={paletteDialogId}
            className="p-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer"
            title="Question Palette"
          >
            <Grid size={16} />
          </button>

          <button
            onClick={handleSubmitExam}
            className="px-3 py-1.5 rounded-md bg-[var(--color-error)] text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Question Palette Drawer Modal */}
      {showPalette && (
        <div 
          id={paletteDialogId}
          role="region"
          aria-label="Question Navigation Palette"
          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3 shadow-lg"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
            <span>QUESTION PALETTE ({answeredCount}/{examQuestions.length} Attempted)</span>
            <button onClick={() => setShowPalette(false)} className="hover:text-[var(--color-primary)] cursor-pointer">
              Close
            </button>
          </div>

          <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-1">
            {examQuestions.map((q, idx) => {
              const st = questionStates[q.id];
              let bg = 'bg-[var(--color-surface-2)] text-[var(--color-muted)] border-[var(--color-border)]';

              if (st?.selectedOption !== null) {
                bg = 'bg-[var(--color-success)] text-white border-[var(--color-success)]';
              } else if (st?.markedForReview) {
                bg = 'bg-[var(--color-warning)] text-black border-[var(--color-warning)]';
              } else if (st?.visited) {
                bg = 'bg-[var(--color-surface-3)] text-[var(--color-primary)] border-[var(--color-border)]';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => { setCurrentIdx(idx); setShowPalette(false); }}
                  className={`w-7 h-7 rounded text-[11px] font-mono font-medium border flex items-center justify-center cursor-pointer transition-colors ${bg} ${
                    currentIdx === idx ? 'ring-2 ring-[var(--color-accent)]' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Surface */}
      {currentQ && (
        <div className="p-5 md:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
            <span className="text-xs font-mono text-[var(--color-muted)]">
              {currentQ.subject} · {currentQ.chapter}
            </span>
            <button
              onClick={handleToggleMark}
              className={`flex items-center gap-1 text-xs font-medium cursor-pointer ${
                currentState?.markedForReview ? 'text-[var(--color-warning)]' : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              {currentState?.markedForReview ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              <span>{currentState?.markedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>
          </div>

          <div className="text-base md:text-lg font-medium leading-relaxed text-[var(--color-primary)]">
            <MathRenderer content={currentQ.question} />
          </div>

          {/* 4 Answer Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = currentState?.selectedOption === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full min-h-[48px] p-3.5 rounded-lg border text-left flex items-start gap-3 touch-target cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-primary)] font-medium ring-1 ring-[var(--color-accent)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] bg-[var(--color-surface)]'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  <div className="flex-1 text-sm md:text-base leading-snug pt-0.5">
                    <MathRenderer content={opt} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
              disabled={currentIdx === examQuestions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
