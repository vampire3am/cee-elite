'use client';

import React from 'react';
import { 
  Home, 
  Target, 
  FileText, 
  RotateCcw, 
  BarChart3, 
  Settings,
  Flame,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';

export type ActiveTab = 'home' | 'practice' | 'mocks' | 'revision' | 'stats';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  streak: number;
  isOnline: boolean;
  onOpenSettings: () => void;
  onQuickAction?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  streak,
  isOnline,
  onOpenSettings,
  onQuickAction
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'practice', label: 'Practice', icon: <Target size={18} /> },
    { id: 'mocks', label: 'Mocks', icon: <FileText size={18} /> },
    { id: 'revision', label: 'Revision', icon: <RotateCcw size={18} /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 size={18} /> }
  ];

  return (
    <>
      {/* Desktop & Tablet Top/Side Bar */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center font-bold text-xs text-[var(--color-primary)]">
              CE
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-[var(--color-primary)] block leading-none">
                CEE ELITE
              </span>
              <span className="text-[10px] text-[var(--color-muted)] font-mono leading-none tracking-wider">
                NEPAL MBBS/BDS
              </span>
            </div>
          </button>

          <nav className="flex items-center gap-1 ml-4 bg-[var(--color-surface-2)] p-1 rounded-lg border border-[var(--color-border)]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline/Online pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]">
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                <Wifi size={12} className="text-[var(--color-success)]" />
                <span className="hidden lg:inline text-[var(--color-primary)]">AI Ready</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
                <WifiOff size={12} className="text-[var(--color-warning)]" />
                <span className="text-[var(--color-warning)]">Offline Mode</span>
              </>
            )}
          </div>

          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-primary)]">
            <Flame size={13} className="text-[var(--color-warning)] fill-[var(--color-warning)]" />
            <span>{streak}d</span>
          </div>

          {/* Quick Practice button */}
          {onQuickAction && (
            <button
              onClick={onQuickAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Zap size={13} />
              <span>Surprise Me</span>
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)] transition-colors border border-transparent hover:border-[var(--color-border)] cursor-pointer"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Top Status Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center font-bold text-[11px] text-[var(--color-primary)]">
            CE
          </div>
          <div>
            <span className="font-semibold text-xs tracking-tight text-[var(--color-primary)] block leading-none">
              CEE ELITE
            </span>
            <span className="text-[9px] text-[var(--color-muted)] font-mono leading-none">
              LOCAL-FIRST
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-[var(--color-border)] bg-[var(--color-surface-2)]">
            <Flame size={11} className="text-[var(--color-warning)] fill-[var(--color-warning)]" />
            <span>{streak}d</span>
          </div>

          {!isOnline && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-[var(--color-warning)]/40 bg-[var(--color-warning-subtle)] text-[var(--color-warning)]">
              <WifiOff size={10} />
            </div>
          )}

          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-1 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Non-negotiable Hallmark 320px+ compliant) */}
      <nav 
        aria-label="Mobile Navigation"
        className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] px-1 py-1"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
      >
        <div className="grid grid-cols-5 w-full items-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 touch-target rounded-md transition-colors cursor-pointer ${
                  isActive 
                    ? 'text-[var(--color-accent)] font-medium' 
                    : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                <div className={`p-1 rounded-md transition-transform ${isActive ? 'scale-105' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
