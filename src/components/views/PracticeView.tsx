'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question, Subject, Difficulty, QuestionAttempt } from '@/types';
import { QuestionCard } from '../QuestionCard';
import { db } from '@/lib/db';
import { getChaptersForSubject, getAllChapters, CEE_SYLLABUS } from '@/lib/syllabus';
import { computeChapterStats } from '@/lib/adaptive';
import { 
  Sparkles, 
  RotateCcw, 
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Award,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

interface PracticeViewProps {
  initialSubject?: Subject;
  initialChapter?: string;
  initialDifficulty?: Difficulty;
  initialTopic?: string;
  initialMode?: string;
  onAttemptSaved: (attempt: QuestionAttempt) => void;
  onFlashcardCreated: () => void;
  onLaunchChapterMock?: (subject: Subject, chapter: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialSubject,
  initialChapter,
  initialDifficulty,
  initialTopic,
  initialMode,
  onAttemptSaved,
  onFlashcardCreated,
  onLaunchChapterMock
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>(initialSubject || 'All');
  const [selectedChapter, setSelectedChapter] = useState<string | 'All'>(initialChapter || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>(initialDifficulty || 'All');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isGeneratingVariation, setIsGeneratingVariation] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionTotal, setSessionTotal] = useState<number>(0);
  const [activeVariationBase, setActiveVariationBase] = useState<Question | null>(null);
  
  // Chapter stats & bank counts for the chapter explorer
  const [allBankQuestions, setAllBankQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [viewMode, setViewMode] = useState<'practice' | 'chapters'>(initialChapter ? 'practice' : 'practice');

  // Update when initialChapter changes externally
  useEffect(() => {
    if (initialChapter) {
      setSelectedChapter(initialChapter);
      setViewMode('practice');
    }
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialChapter, initialSubject]);

  // Load question counts and student attempts
  const loadMetadata = useCallback(async () => {
    const list = await db.getQuestions();
    const atts = await db.getAttempts();
    setAllBankQuestions(list);
    setAttempts(atts);
  }, []);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Load questions filtered by subject, chapter, difficulty
  const loadLocalQuestions = useCallback(async () => {
    const list = await db.getQuestions();
    
    let filtered = list;
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    if (selectedChapter !== 'All') {
      filtered = filtered.filter(q => q.chapter === selectedChapter);
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
  }, [selectedSubject, selectedChapter, selectedDifficulty, initialTopic, initialMode]);

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
      chapter: currentQuestion.chapter,
      difficulty: currentQuestion.difficulty,
      usedHints
    };

    await db.saveAttempt(attempt);
    setAttempts(prev => [attempt, ...prev]);
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
    const targetChapter = selectedChapter === 'All' ? undefined : selectedChapter;
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
          chapter: targetChapter,
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
        setAllBankQuestions(prev => [data.question, ...prev]);
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
        setAllBankQuestions(prev => [data.question, ...prev]);
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

  // Compute chapter-wise statistics from attempts
  const chapterStats = computeChapterStats(attempts);

  // Get displayed chapters for chapter explorer
  const displayedChapters = selectedSubject === 'All' 
    ? getAllChapters() 
    : getChaptersForSubject(selectedSubject).map(c => ({ ...c, subject: selectedSubject }));

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 pb-24 md:pb-12">
      {/* Subject Filter Tabs Bar */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          {(['All', 'Physics', 'Chemistry', 'Biology', 'MAT'] as const).map(subj => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubject(subj);
                if (subj !== 'All' && selectedChapter !== 'All') {
                  const subjectChapters = getChaptersForSubject(subj).map(c => c.name);
                  if (!subjectChapters.includes(selectedChapter)) {
                    setSelectedChapter('All');
                  }
                }
              }}
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

        {/* View Mode Toggle: Question Practice vs Chapter Directory */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'chapters' ? 'practice' : 'chapters')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              viewMode === 'chapters'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)]'
            }`}
          >
            <BookOpen size={13} />
            <span>{viewMode === 'chapters' ? 'Back to Questions' : 'Browse Chapters'}</span>
          </button>
        </div>
      </div>

      {/* Chapter Explorer Grid View */}
      {viewMode === 'chapters' ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
              {selectedSubject === 'All' ? 'All Official Syllabus Chapters' : `${selectedSubject} Chapters`}
            </span>
            <span className="text-[11px] font-mono text-[var(--color-subtle)]">
              {displayedChapters.length} Chapters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayedChapters.map((ch) => {
              const stat = chapterStats.find(s => s.chapter === ch.name);
              const qCount = allBankQuestions.filter(q => q.chapter === ch.name).length;
              const chSubject = 'subject' in ch ? (ch as any).subject as Subject : selectedSubject === 'All' ? 'Physics' : selectedSubject;

              return (
                <div
                  key={ch.name}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    selectedChapter === ch.name
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-accent)] border border-[var(--color-border)]">
                        Yield {ch.yieldScore}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--color-muted)]">
                        ~{ch.weightageMarks ?? Math.round(ch.yieldScore / 10)} Marks
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[var(--color-primary)] line-clamp-2 mt-1">
                      {ch.name}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--color-muted)] mt-1">
                      <span>{qCount} Questions in Bank</span>
                      {stat && stat.attempts > 0 && (
                        <span className={stat.accuracy >= 75 ? 'text-[var(--color-success)]' : stat.accuracy >= 50 ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]'}>
                          {stat.accuracy}% Acc ({stat.attempts} solved)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => {
                        setSelectedChapter(ch.name);
                        if (selectedSubject === 'All' && 'subject' in ch) {
                          setSelectedSubject((ch as any).subject);
                        }
                        setViewMode('practice');
                      }}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center gap-1 hover:opacity-90 transition-opacity cursor-pointer text-center"
                    >
                      <Target size={12} />
                      <span>Practice</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onLaunchChapterMock) {
                          onLaunchChapterMock(chSubject, ch.name);
                        }
                      }}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] hover:border-[var(--color-accent)] transition-colors flex items-center justify-center gap-1 cursor-pointer text-center"
                    >
                      <Zap size={12} className="text-[var(--color-warning)]" />
                      <span>Mock (20Q)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Active Chapter Breadcrumb Bar */}
          {selectedChapter !== 'All' ? (
            <div className="p-3.5 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setSelectedChapter('All')}
                  className="p-1 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer shrink-0"
                  title="Clear Chapter Filter"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    {selectedSubject !== 'All' ? selectedSubject : 'Chapter Focused Practice'}
                  </span>
                  <span className="text-sm font-bold text-[var(--color-primary)] truncate block">
                    {selectedChapter}
                  </span>
                </div>
              </div>

              {onLaunchChapterMock && (
                <button
                  onClick={() => onLaunchChapterMock(selectedSubject === 'All' ? 'Physics' : selectedSubject, selectedChapter)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--color-accent)]/60 bg-[var(--color-surface)] text-[var(--color-primary)] hover:border-[var(--color-accent)] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                >
                  <Zap size={13} className="text-[var(--color-warning)]" />
                  <span>Start Mock (20Q)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)] font-mono">
                Showing all chapters for {selectedSubject}. Want to focus on a single chapter?
              </span>
              <button
                onClick={() => setViewMode('chapters')}
                className="text-[var(--color-accent)] font-semibold hover:underline cursor-pointer ml-2"
              >
                Select Chapter →
              </button>
            </div>
          )}

          {/* Difficulty & AI Generation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[var(--color-muted)]">Difficulty:</span>
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
            </div>

            <button
              onClick={() => handleGenerateAiQuestion(selectedDifficulty === 'All' ? 'hard' : selectedDifficulty)}
              disabled={isGeneratingAi}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
            >
              <Sparkles size={13} className={isGeneratingAi ? 'animate-spin' : ''} />
              <span>{isGeneratingAi ? 'Synthesizing...' : `AI Generate ${selectedChapter !== 'All' ? 'for Chapter' : ''}`}</span>
            </button>
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
                  onClick={() => { setSelectedSubject('All'); setSelectedChapter('All'); setSelectedDifficulty('All'); }}
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
        </>
      )}
    </div>
  );
};
