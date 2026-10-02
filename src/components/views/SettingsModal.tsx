'use client';

import React, { useState } from 'react';
import { UserSettings } from '@/types';
import { db } from '@/lib/db';
import { 
  X, 
  Moon, 
  Sun, 
  Key, 
  Trash2, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChanged: () => void;
  onThemeChanged: (theme: 'dark' | 'light' | 'system') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsChanged,
  onThemeChanged
}) => {
  const [settings, setSettings] = useState<UserSettings>(() => db.getSettings());
  const [apiKey, setApiKey] = useState<string>(settings.customGeminiApiKey || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserSettings = {
      ...settings,
      customGeminiApiKey: apiKey.trim() || undefined
    };
    db.saveSettings(updated);
    setSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onSettingsChanged();
  };

  const handleTheme = (theme: 'dark' | 'light' | 'system') => {
    const updated: UserSettings = { ...settings, theme };
    db.saveSettings(updated);
    setSettings(updated);
    onThemeChanged(theme);
  };

  const handleClearData = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await db.clearAllData();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[var(--color-accent)]" />
            <h3 className="text-base font-bold text-[var(--color-primary)]">
              Settings & Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-primary)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
            Appearance
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTheme('dark')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                settings.theme === 'dark'
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-primary)] font-semibold'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]'
              }`}
            >
              <Moon size={15} />
              <span>Dark Mode (Default)</span>
            </button>
            <button
              onClick={() => handleTheme('light')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-colors ${
                settings.theme === 'light'
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-primary)] font-semibold'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]'
              }`}
            >
              <Sun size={15} />
              <span>Light Mode</span>
            </button>
          </div>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1.5">
              <Key size={13} />
              Google Gemini API Key
            </label>
            <span className="text-[10px] text-[var(--color-muted)]">Optional</span>
          </div>
          <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
            By default, questions use the built-in verified bank and server proxy. You may provide a personal Gemini API key to utilize dedicated quota for unlimited real-time generation.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs text-[var(--color-primary)] font-mono focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        {/* Difficulty Distribution Information */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase text-[var(--color-muted)] font-semibold">
            CEE Difficulty Engine Distribution
          </span>
          <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px] pt-1">
            <div className="p-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-muted)] block text-[10px]">Medium</span>
              <span className="font-bold text-[var(--color-primary)]">10%</span>
            </div>
            <div className="p-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="text-amber-400 block text-[10px]">Hard</span>
              <span className="font-bold text-[var(--color-primary)]">35%</span>
            </div>
            <div className="p-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="text-red-400 block text-[10px]">V. Hard</span>
              <span className="font-bold text-[var(--color-primary)]">40%</span>
            </div>
            <div className="p-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="text-purple-400 block text-[10px]">Elite</span>
              <span className="font-bold text-[var(--color-primary)]">15%</span>
            </div>
          </div>
        </div>

        {/* Local Storage Privacy Guarantee */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-surface-2)] text-[11px] text-[var(--color-muted)]">
          <ShieldCheck size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
          <span>
            Zero authentication. All attempts, bookmarks, notes, and flashcards remain 100% on this device in local IndexedDB.
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          {isSaved ? <Check size={14} /> : null}
          <span>{isSaved ? 'Preferences Saved' : 'Save Preferences'}</span>
        </button>

        {/* Danger Zone: Reset Data */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-xs text-[var(--color-error)]">Reset All Local Data</span>
          <button
            onClick={handleClearData}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
              confirmDelete
                ? 'bg-[var(--color-error)] text-white border-[var(--color-error)]'
                : 'border-[var(--color-error)]/30 text-[var(--color-error)] bg-[var(--color-error-subtle)] hover:bg-[var(--color-error)]/20'
            }`}
          >
            {confirmDelete ? 'Confirm Permanent Reset' : 'Clear Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
