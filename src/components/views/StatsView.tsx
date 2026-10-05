'use client';

import React, { useState, useRef } from 'react';
import { QuestionAttempt, Subject, MockExamResult, ExportDataPayload } from '@/types';
import { computeTopicStats, computeChapterStats } from '@/lib/adaptive';
import { db } from '@/lib/db';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Target, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  BookOpen
} from 'lucide-react';

interface StatsViewProps {
  attempts: QuestionAttempt[];
  mockHistory: MockExamResult[];
  streak: { current: number; best: number };
  onDataImported: () => void;
  onStartChapterPractice?: (subject: Subject, chapter: string) => void;
  onStartChapterMock?: (subject: Subject, chapter: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  attempts,
  mockHistory,
  streak,
  onDataImported,
  onStartChapterPractice,
  onStartChapterMock
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [chapterFilterSubject, setChapterFilterSubject] = useState<Subject | 'All'>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const topicStats = computeTopicStats(attempts);
  const chapterStats = computeChapterStats(attempts);

  // Overall metrics
  const totalSolved = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const overallAccuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  
  const totalSeconds = attempts.reduce((acc, a) => acc + a.timeSpentSeconds, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  // Difficulties accuracy
  const getDifficultyAccuracy = (diff: string) => {
    const list = attempts.filter(a => a.difficulty === diff);
    if (list.length === 0) return 0;
    const corr = list.filter(a => a.isCorrect).length;
    return Math.round((corr / list.length) * 100);
  };

  const hardAccuracy = getDifficultyAccuracy('hard');
  const veryHardAccuracy = getDifficultyAccuracy('very_hard');
  const eliteAccuracy = getDifficultyAccuracy('elite');

  // Subject accuracy
  const getSubjectStats = (subj: Subject) => {
    const list = attempts.filter(a => a.subject === subj);
    const count = list.length;
    const correct = list.filter(a => a.isCorrect).length;
    const acc = count > 0 ? Math.round((correct / count) * 100) : 0;
    return { count, acc };
  };

  const subjects: Subject[] = ['Physics', 'Chemistry', 'Biology', 'MAT'];

  // Filtered chapters
  const filteredChapterStats = chapterFilterSubject === 'All'
    ? chapterStats
    : chapterStats.filter(c => c.subject === chapterFilterSubject);

  // Export JSON handler
  const handleExport = async () => {
    const data = await db.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cee_elite_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const payload: ExportDataPayload = JSON.parse(text);
      const ok = await db.importAllData(payload);
      if (ok) {
        setImportStatus('Data restored successfully.');
        onDataImported();
      } else {
        setImportStatus('Invalid backup file structure.');
      }
    } catch {
      setImportStatus('Failed to parse JSON file.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
            Performance Analytics
          </h2>
          <span className="text-xs text-[var(--color-muted)] font-mono">
            Ground-Truth Empirical Prep Telemetry
          </span>
        </div>

        {/* Export / Import Controls */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Import JSON data backup"
          >
            <Upload size={13} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Export full data backup"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] text-xs flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="font-mono text-xs">Dismiss</button>
        </div>
      )}

      {/* Top 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="text-[10px] font-mono uppercase text-[var(--color-muted)] block">Accuracy</span>
          <span className="text-2xl font-bold font-mono text-[var(--color-primary)] mt-1 block">
            {overallAccuracy}%
          </span>
          <span className="text-[10px] text-[var(--color-muted)] mt-1 block">
            {totalCorrect} of {totalSolved} correct
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="text-[10px] font-mono uppercase text-[var(--color-muted)] block">Questions</span>
          <span className="text-2xl font-bold font-mono text-[var(--color-primary)] mt-1 block">
            {totalSolved}
          </span>
          <span className="text-[10px] text-[var(--color-muted)] mt-1 block">
            Attempts recorded
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="text-[10px] font-mono uppercase text-[var(--color-muted)] block">Study Time</span>
          <span className="text-2xl font-bold font-mono text-[var(--color-primary)] mt-1 block">
            {totalHours > 0 ? `${totalHours}h ` : ''}{totalMins}m
          </span>
          <span className="text-[10px] text-[var(--color-muted)] mt-1 block">
            Focus duration
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="text-[10px] font-mono uppercase text-[var(--color-muted)] block">Active Streak</span>
          <span className="text-2xl font-bold font-mono text-[var(--color-warning)] mt-1 block flex items-center gap-1">
            <Flame size={20} className="fill-[var(--color-warning)]" />
            {streak.current}d
          </span>
          <span className="text-[10px] text-[var(--color-muted)] mt-1 block">
            Best: {streak.best} days
          </span>
        </div>
      </div>

      {/* Difficulty Discrimination Accuracy */}
      <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
          Accuracy by Question Difficulty Tier
        </span>

        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <span className="text-[10px] uppercase text-amber-400 font-semibold block">Hard</span>
            <span className="text-xl font-bold text-[var(--color-primary)] mt-1 block">{hardAccuracy}%</span>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <span className="text-[10px] uppercase text-red-400 font-semibold block">Very Hard</span>
            <span className="text-xl font-bold text-[var(--color-primary)] mt-1 block">{veryHardAccuracy}%</span>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <span className="text-[10px] uppercase text-purple-400 font-semibold block">Elite</span>
            <span className="text-xl font-bold text-[var(--color-primary)] mt-1 block">{eliteAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
          Subject Mastery & Weighting
        </span>

        <div className="flex flex-col gap-3.5">
          {subjects.map((sub) => {
            const stat = getSubjectStats(sub);
            return (
              <div key={sub} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--color-primary)]">{sub}</span>
                  <div className="font-mono text-xs">
                    <span className="text-[var(--color-muted)] mr-2">{stat.count} solved</span>
                    <span className="font-semibold text-[var(--color-primary)]">{stat.acc}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stat.acc >= 75
                        ? 'bg-[var(--color-success)]'
                        : stat.acc >= 50
                          ? 'bg-[var(--color-warning)]'
                          : 'bg-[var(--color-error)]'
                    }`}
                    style={{ width: `${stat.acc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAPTER MASTERY MATRIX */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--color-accent)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-primary)] font-semibold">
              Chapter Mastery Matrix
            </span>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1">
            {(['All', 'Physics', 'Chemistry', 'Biology', 'MAT'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setChapterFilterSubject(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  chapterFilterSubject === s
                    ? 'bg-[var(--color-primary)] text-[var(--color-bg)] font-bold'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-primary)] bg-[var(--color-surface-2)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs">
          <div className="divide-y divide-[var(--color-border)]">
            {filteredChapterStats.map((ch) => (
              <div
                key={ch.chapter}
                className="p-3.5 bg-[var(--color-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-accent)] font-semibold border border-[var(--color-border)]">
                      {ch.subject} · Yield {ch.yieldScore}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-muted)]">
                      Priority Score {ch.priorityScore}
                    </span>
                  </div>

                  <span className="font-semibold text-sm text-[var(--color-primary)] block mt-1 truncate">
                    {ch.chapter}
                  </span>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--color-muted)] mt-1">
                    <span>{ch.attempts} attempts</span>
                    <span className={ch.accuracy >= 75 ? 'text-[var(--color-success)] font-semibold' : ch.accuracy >= 50 ? 'text-[var(--color-warning)] font-semibold' : 'text-[var(--color-error)] font-semibold'}>
                      {ch.accuracy}% accuracy
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onStartChapterPractice && (
                    <button
                      onClick={() => onStartChapterPractice(ch.subject, ch.chapter)}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)] hover:border-[var(--color-accent)] font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Target size={12} />
                      <span>Practice</span>
                    </button>
                  )}
                  {onStartChapterMock && (
                    <button
                      onClick={() => onStartChapterMock(ch.subject, ch.chapter)}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <Zap size={12} />
                      <span>Mock (20Q)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High-Yield Topic Priority Matrix */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
            High-Yield Topic Priority Matrix
          </span>
          <span className="text-[11px] font-mono text-[var(--color-subtle)]">
            Top Weaknesses
          </span>
        </div>

        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs">
          <div className="divide-y divide-[var(--color-border)]">
            {topicStats.slice(0, 8).map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[var(--color-surface)] flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <span className="font-medium text-[var(--color-primary)] block truncate">
                    {t.topic}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-muted)]">
                    {t.subject} · Yield {t.yieldScore} · {t.attempts} attempts
                  </span>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-xs font-bold text-[var(--color-primary)] block">
                    {t.accuracy}% acc
                  </span>
                  <span className="text-[10px] text-[var(--color-accent)] font-semibold">
                    Priority {t.priorityScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
