'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { Question, Subject, MockExamResult, MockExamQuestionState } from '@/types';
import { db } from '@/lib/db';
import { CEE_SYLLABUS } from '@/lib/syllabus';
import { generateDynamicQuestion } from '@/lib/proceduralGenerator';
import { MathRenderer } from '../MathRenderer';
import { 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Grid,
  Zap,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface ExamViewProps {
  initialExamType?: 'full_200' | 'rapid_50' | 'chapter';
  initialSubject?: Subject;
  initialChapter?: string;
  onExamComplete: (result: MockExamResult) => void;
  onExitExam: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ 
  initialExamType,
  initialSubject,
  initialChapter,
  onExamComplete, 
  onExitExam 
}) => {
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [questionStates, setQuestionStates] = useState<Record<string, MockExamQuestionState>>({});
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(180 * 60); // 3 hours
  const [allocatedTotalSeconds, setAllocatedTotalSeconds] = useState<number>(180 * 60);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  
  // Format state: 'chapter' | 'rapid_50' | 'full_200'
  const [examType, setExamType] = useState<'full_200' | 'rapid_50' | 'chapter'>(initialExamType || 'chapter');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(initialSubject || 'Physics');
  const [selectedChapter, setSelectedChapter] = useState<string>(
    initialChapter || (CEE_SYLLABUS[initialSubject || 'Physics']?.[0]?.name || 'Electrostatics & Capacitance')
  );
  
  const paletteDialogId = useId();

  // Update selectedChapter if subject changes
  const handleSubjectChange = (subj: Subject) => {
    setSelectedSubject(subj);
    const firstChap = CEE_SYLLABUS[subj]?.[0]?.name || '';
    setSelectedChapter(firstChap);
  };

  // Auto-launch if initialChapter was explicitly provided
  useEffect(() => {
    if (initialExamType === 'chapter' && initialChapter) {
      initExam('chapter', initialSubject || 'Physics', initialChapter);
    }
  }, []);

  // Initialize mock exam questions from database
  const initExam = async (
    type: 'full_200' | 'rapid_50' | 'chapter',
    customSubject?: Subject,
    customChapter?: string
  ) => {
    const all = await db.getQuestions();
    const targetSubj = customSubject || selectedSubject;
    const targetChap = customChapter || selectedChapter;

    let selected: Question[] = [];
    let seconds = 45 * 60;

    if (type === 'chapter') {
      const count = 20;
      seconds = 20 * 60; // 20 minutes for 20 questions

      const chapterMatches = all.filter(q => 
        q.subject === targetSubj && q.chapter.toLowerCase() === targetChap.toLowerCase()
      );

      const res: Question[] = [];
      for (let i = 0; i < count; i++) {
        if (chapterMatches.length > i) {
          res.push(chapterMatches[i]);
        } else if (chapterMatches.length > 0) {
          // Clone with unique ID and procedural variation
          const base = chapterMatches[i % chapterMatches.length];
          const dyn = generateDynamicQuestion(targetSubj, targetChap, undefined, 'hard', true, base);
          res.push({
            ...dyn,
            id: `mock-chap-q-${i}-${Date.now()}`
          });
        } else {
          // Procedural generation fallback
          const dyn = generateDynamicQuestion(targetSubj, targetChap, undefined, 'hard');
          res.push({
            ...dyn,
            id: `mock-chap-q-${i}-${Date.now()}`
          });
        }
      }
      selected = res;
    } else {
      const count = type === 'full_200' ? 200 : 50;
      seconds = type === 'full_200' ? 180 * 60 : 45 * 60;

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
            const base = available[i % available.length];
            res.push({
              ...base,
              id: `mock-q-${subj}-${i}-${Date.now()}`
            });
          }
        }
        return res;
      };

      selected = [
        ...pickForSubject('Physics', phyTarget),
        ...pickForSubject('Chemistry', chemTarget),
        ...pickForSubject('Biology', bioTarget),
        ...pickForSubject('MAT', matTarget)
      ];
    }

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
    setTimeRemainingSeconds(seconds);
    setAllocatedTotalSeconds(seconds);
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

    const title = examType === 'chapter'
      ? `Chapter Mock: ${selectedChapter}`
      : examType === 'full_200'
        ? 'CEE Full Simulation (200 Questions)'
        : 'CEE Diagnostic Sprint (50 Questions)';

    const result: MockExamResult = {
      id: `mock-res-${Date.now()}`,
      title,
      timestamp: Date.now(),
      examMode: examType,
      targetSubject: examType === 'chapter' ? selectedSubject : undefined,
      targetChapter: examType === 'chapter' ? selectedChapter : undefined,
      totalQuestions: examQuestions.length,
      totalAttempted: correctCount + incorrectCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      score: Number(netScore.toFixed(2)),
      maxScore,
      percentage,
      timeTakenSeconds: allocatedTotalSeconds - timeRemainingSeconds,
      subjectScores,
      questions: detailedQuestions
    };

    await db.saveMockResult(result);
    setExamResult(result);
    onExamComplete(result);
  }, [examQuestions, questionStates, examType, timeRemainingSeconds, allocatedTotalSeconds, selectedChapter, selectedSubject, isExamSubmitted, onExamComplete]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-Exam Setup & Chapter Selection Screen
  if (!isExamStarted) {
    const availableChapters = CEE_SYLLABUS[selectedSubject] || [];

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
            OFFICIAL CEE MOCK ENGINE
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
              Nepal CEE Examination Simulator
            </h2>
            <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
              Strict MECEE-BL examination conditions with countdown timers, +1.0 / -0.25 marking, and zero hints.
            </p>
          </div>

          {/* Marking Rules */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Marking Scheme</span>
              <span className="font-semibold text-[var(--color-success)]">+1.0</span> for correct,{' '}
              <span className="font-semibold text-[var(--color-error)]">-0.25</span> penalty
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">AI & Hints</span>
              <span className="font-semibold text-[var(--color-primary)]">Strictly Disabled</span> during exam
            </div>
          </div>

          {/* Format Selection Tabs */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider">
              Step 1: Choose Mock Format
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => setExamType('chapter')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  examType === 'chapter'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                }`}
              >
                <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[var(--color-accent)]" />
                  Chapter Mock
                </span>
                <span className="text-[11px] text-[var(--color-muted)] block mt-0.5">20 Qs · 20 Mins</span>
                <span className="text-[10px] font-mono text-[var(--color-accent)] mt-1.5 block">Chapter-focused</span>
              </button>

              <button
                onClick={() => setExamType('rapid_50')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  examType === 'rapid_50'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                }`}
              >
                <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                  <Zap size={13} className="text-[var(--color-warning)]" />
                  Diagnostic Sprint
                </span>
                <span className="text-[11px] text-[var(--color-muted)] block mt-0.5">50 Qs · 45 Mins</span>
                <span className="text-[10px] font-mono text-[var(--color-warning)] mt-1.5 block">High-yield sprint</span>
              </button>

              <button
                onClick={() => setExamType('full_200')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  examType === 'full_200'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                }`}
              >
                <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                  <Award size={13} className="text-[var(--color-success)]" />
                  Full CEE Mock
                </span>
                <span className="text-[11px] text-[var(--color-muted)] block mt-0.5">200 Qs · 3 Hours</span>
                <span className="text-[10px] font-mono text-[var(--color-success)] mt-1.5 block">Official MECEE-BL</span>
              </button>
            </div>
          </div>

          {/* If Chapter Mock is selected: Subject & Chapter Selectors */}
          {examType === 'chapter' && (
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <div>
                <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider block mb-2">
                  Step 2: Select Subject
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Physics', 'Chemistry', 'Biology', 'MAT'] as const).map(subj => (
                    <button
                      key={subj}
                      onClick={() => handleSubjectChange(subj)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer border ${
                        selectedSubject === subj
                          ? 'bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold border-transparent'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider block mb-2">
                  Step 3: Select Chapter for Mock Test
                </span>
                <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                  {availableChapters.map(chap => {
                    const isSelected = selectedChapter === chap.name;
                    return (
                      <button
                        key={chap.name}
                        onClick={() => setSelectedChapter(chap.name)}
                        className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-primary)] ring-1 ring-[var(--color-accent)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className={`text-xs block font-medium truncate ${isSelected ? 'text-[var(--color-primary)] font-semibold' : ''}`}>
                            {chap.name}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--color-subtle)]">
                            {chap.topics.length} core topics
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] shrink-0 font-semibold text-[var(--color-warning)]">
                          Yield {chap.yieldScore}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => initExam(examType, selectedSubject, selectedChapter)}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-sm mt-1"
          >
            {examType === 'chapter' 
              ? `Commence ${selectedChapter} Mock (20 Qs)`
              : examType === 'rapid_50'
                ? 'Commence Diagnostic Sprint (50 Qs)'
                : 'Commence Full CEE Simulation (200 Qs)'}
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
                Completed in {Math.floor(examResult.timeTakenSeconds / 60)}m {examResult.timeTakenSeconds % 60}s
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
                -{examResult.incorrectCount * 0.25}
              </span>
            </div>
          </div>

          {/* Subject Breakdown if multi-subject */}
          {examType !== 'chapter' && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider">
                Subject Breakdown
              </span>
              <div className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)] text-[10px] font-mono uppercase text-[var(--color-muted)]">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-center">Correct</th>
                      <th className="p-2.5 text-center">Wrong</th>
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
          )}

          {/* Question-by-Question Review Drawer */}
          <div className="flex flex-col gap-3 pt-2">
            <span className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-wider">
              Question Review ({examResult.questions.length} Items)
            </span>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {examResult.questions.map((item, qIdx) => (
                <div 
                  key={qIdx}
                  className={`p-4 rounded-xl border text-xs flex flex-col gap-2.5 ${
                    item.isCorrect 
                      ? 'border-[var(--color-success)]/30 bg-[var(--color-success-subtle)]/40' 
                      : item.selectedOption === null 
                        ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]' 
                        : 'border-[var(--color-error)]/30 bg-[var(--color-error-subtle)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-semibold text-[var(--color-primary)]">Q{qIdx + 1} · {item.question.chapter}</span>
                    <span className={item.isCorrect ? 'text-[var(--color-success)] font-bold' : item.selectedOption === null ? 'text-[var(--color-muted)]' : 'text-[var(--color-error)] font-bold'}>
                      {item.isCorrect ? '+1.0 MARK' : item.selectedOption === null ? '0.0 (SKIPPED)' : '-0.25 PENALTY'}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-[var(--color-primary)]">
                    <MathRenderer content={item.question.question} />
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] leading-relaxed">
                    <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase block mb-1">Correct Answer & Explanation:</span>
                    <span className="font-semibold text-[var(--color-success)] block mb-1">
                      Option {String.fromCharCode(65 + item.question.correctAnswer)}: {item.question.options[item.question.correctAnswer]}
                    </span>
                    <MathRenderer content={item.question.explanation} />
                  </div>
                </div>
              ))}
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

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-1">
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
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-primary)] ring-1 ring-[var(--color-accent)]'
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
