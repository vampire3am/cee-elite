'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, ActiveTab } from '@/components/Navigation';
import { HomeView } from '@/components/views/HomeView';
import { PracticeView } from '@/components/views/PracticeView';
import { ExamView } from '@/components/views/ExamView';
import { RevisionView } from '@/components/views/RevisionView';
import { StatsView } from '@/components/views/StatsView';
import { WeaknessDestroyerView } from '@/components/views/WeaknessDestroyerView';
import { SettingsModal } from '@/components/views/SettingsModal';
import { QuestionAttempt, Flashcard, MockExamResult, Subject, Difficulty } from '@/types';
import { db } from '@/lib/db';
import { 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Database,
  Cpu
} from 'lucide-react';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isWeaknessDestroyerActive, setIsWeaknessDestroyerActive] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // App State
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mockHistory, setMockHistory] = useState<MockExamResult[]>([]);
  const [streak, setStreak] = useState<{ current: number; best: number }>({ current: 1, best: 1 });
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Practice View dynamic parameters
  const [practiceParams, setPracticeParams] = useState<{
    subject?: Subject;
    difficulty?: Difficulty;
    topic?: string;
    mode?: string;
  }>({});

  // Initialize DB, settings, online status
  useEffect(() => {
    // Check if user has already used the app previously
    const hasPrevious = localStorage.getItem('cee_has_started');
    if (hasPrevious === 'true') {
      setHasStarted(true);
    }

    // Set online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check Theme
      const settings = db.getSettings();
      if (settings.theme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }

      // Initialize DB data
      db.initQuestions().then(() => {
        refreshAppData();
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const refreshAppData = useCallback(async () => {
    const atts = await db.getAttempts();
    const cards = await db.getFlashcards();
    const mocks = await db.getMockHistory();
    const str = db.getStreak();

    setAttempts(atts);
    setFlashcards(cards);
    setMockHistory(mocks);
    setStreak({ current: str.current, best: str.best });
  }, []);

  const handleStartPracticing = () => {
    localStorage.setItem('cee_has_started', 'true');
    setHasStarted(true);
    setActiveTab('practice');
  };

  const handleStartMode = (mode: string, params?: { subject?: string; difficulty?: string; topic?: string }) => {
    setIsWeaknessDestroyerActive(false);

    if (mode === 'weakness_destroyer') {
      setIsWeaknessDestroyerActive(true);
      return;
    }

    setPracticeParams({
      subject: params?.subject as Subject,
      difficulty: params?.difficulty as Difficulty,
      topic: params?.topic,
      mode
    });
    setActiveTab('practice');
  };

  const handleThemeChanged = (theme: 'dark' | 'light' | 'system') => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  };

  // Minimalist No-Auth Landing View
  if (!hasStarted) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)] flex flex-col justify-between p-6 md:p-12 max-w-4xl mx-auto">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center font-mono font-bold text-xs text-[var(--color-primary)]">
              CE
            </div>
            <span className="font-semibold text-sm tracking-tight text-[var(--color-primary)]">
              CEE ELITE
            </span>
          </div>
          <span className="text-[11px] font-mono text-[var(--color-muted)]">
            NEPAL MECEE-BL OPERATING SYSTEM
          </span>
        </div>

        {/* Hero Block (Strictly Minimal per Section 23/24) */}
        <div className="my-auto py-12 flex flex-col gap-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] w-fit">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span>NO LOGIN · 100% FREE · LOCAL-FIRST</span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-primary)] leading-[1.08]">
              Prepare harder.
            </h1>
            <p className="text-base md:text-lg text-[var(--color-muted)] leading-relaxed font-normal">
              AI-powered CEE practice built around high-yield concepts, difficult questions, and verified past questions.
            </p>
          </div>

          {/* Direct One-Tap Entry */}
          <div className="pt-2">
            <button
              onClick={handleStartPracticing}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              <span>Start Practicing</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Restrained Feature Matrix Bar */}
          <div className="pt-8 border-t border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-[var(--color-muted)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-semibold">✓</span>
              <span>Hard Mode Default</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-semibold">✓</span>
              <span>High-Yield Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-semibold">✓</span>
              <span>Verified Past Papers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-semibold">✓</span>
              <span>PAST → HARD Variations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-semibold">✓</span>
              <span>Deep Local Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-semibold">✓</span>
              <span>No Signup Required</span>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="text-xs text-[var(--color-subtle)] font-mono flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
          <span>CEE ELITE · 2080/2081 SYLLABUS ALIGNED</span>
          <span>AUTONOMOUS STUDY OS</span>
        </footer>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)] flex flex-col">
      {/* Navigation Header / Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsWeaknessDestroyerActive(false);
          setActiveTab(tab);
        }}
        streak={streak.current}
        isOnline={isOnline}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onQuickAction={() => handleStartMode('surprise')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-3 sm:px-6 pt-4 sm:pt-6 pb-24 md:pb-12 max-w-4xl mx-auto">
        {isWeaknessDestroyerActive ? (
          <WeaknessDestroyerView
            attempts={attempts}
            onBack={() => setIsWeaknessDestroyerActive(false)}
            onAttemptSaved={refreshAppData}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                attempts={attempts}
                flashcards={flashcards}
                streak={streak}
                onStartMode={handleStartMode}
                onOpenRevision={() => setActiveTab('revision')}
                onOpenWeaknessDestroyer={() => setIsWeaknessDestroyerActive(true)}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeView
                initialSubject={practiceParams.subject}
                initialDifficulty={practiceParams.difficulty}
                initialTopic={practiceParams.topic}
                initialMode={practiceParams.mode}
                onAttemptSaved={refreshAppData}
                onFlashcardCreated={refreshAppData}
              />
            )}

            {activeTab === 'mocks' && (
              <ExamView
                onExamComplete={refreshAppData}
                onExitExam={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'revision' && (
              <RevisionView
                onStartRetest={(ids) => {
                  setPracticeParams({ mode: 'retest' });
                  setActiveTab('practice');
                }}
              />
            )}

            {activeTab === 'stats' && (
              <StatsView
                attempts={attempts}
                mockHistory={mockHistory}
                streak={streak}
                onDataImported={refreshAppData}
              />
            )}
          </>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsChanged={refreshAppData}
        onThemeChanged={handleThemeChanged}
      />
    </div>
  );
}
