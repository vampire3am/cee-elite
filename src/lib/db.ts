import { Question, QuestionAttempt, Flashcard, MockExamResult, UserSettings, ExportDataPayload } from '@/types';
import { INITIAL_QUESTION_BANK } from './questionBank';

const DB_NAME = 'cee_elite_db';
const DB_VERSION = 1;

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  difficultyDistribution: {
    medium: 10,
    hard: 35,
    very_hard: 40,
    elite: 15
  },
  negativeMarkingEnabled: true,
  hapticFeedback: true,
  dailyGoalQuestions: 50
};

class LocalDB {
  private db: IDBDatabase | null = null;
  private isBrowser = typeof window !== 'undefined';

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (!this.isBrowser || !window.indexedDB) {
      throw new Error('IndexedDB not supported or running on server');
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('questions')) {
          db.createObjectStore('questions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('attempts')) {
          const attemptStore = db.createObjectStore('attempts', { keyPath: 'id' });
          attemptStore.createIndex('questionId', 'questionId', { unique: false });
          attemptStore.createIndex('subject', 'subject', { unique: false });
          attemptStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains('flashcards')) {
          const cardStore = db.createObjectStore('flashcards', { keyPath: 'id' });
          cardStore.createIndex('nextReviewDate', 'nextReviewDate', { unique: false });
          cardStore.createIndex('subject', 'subject', { unique: false });
        }
        if (!db.objectStoreNames.contains('mocks')) {
          db.createObjectStore('mocks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // --- INITIALIZE QUESTIONS ---
  public async initQuestions(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      const tx = db.transaction('questions', 'readwrite');
      const store = tx.objectStore('questions');

      INITIAL_QUESTION_BANK.forEach(q => store.put(q));
    } catch {
      // Fallback: save to localStorage if IndexedDB fails
      const stored = localStorage.getItem('cee_questions');
      const existing: Question[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, Question>();
      existing.forEach(q => map.set(q.id, q));
      INITIAL_QUESTION_BANK.forEach(q => map.set(q.id, q));
      localStorage.setItem('cee_questions', JSON.stringify(Array.from(map.values())));
    }
  }

  // --- QUESTIONS ---
  public async getQuestions(): Promise<Question[]> {
    if (!this.isBrowser) return INITIAL_QUESTION_BANK;
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('questions', 'readonly');
        const store = tx.objectStore('questions');
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result as Question[]);
          } else {
            resolve(INITIAL_QUESTION_BANK);
          }
        };
        req.onerror = () => resolve(INITIAL_QUESTION_BANK);
      });
    } catch {
      const stored = localStorage.getItem('cee_questions');
      return stored ? JSON.parse(stored) : INITIAL_QUESTION_BANK;
    }
  }

  public async saveQuestion(question: Question): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      const tx = db.transaction('questions', 'readwrite');
      tx.objectStore('questions').put(question);
    } catch {
      const questions = await this.getQuestions();
      const idx = questions.findIndex(q => q.id === question.id);
      if (idx >= 0) questions[idx] = question;
      else questions.push(question);
      localStorage.setItem('cee_questions', JSON.stringify(questions));
    }
  }

  // --- ATTEMPTS ---
  public async saveAttempt(attempt: QuestionAttempt): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      const tx = db.transaction('attempts', 'readwrite');
      tx.objectStore('attempts').put(attempt);
      this.updateDailyStreak();
    } catch {
      const list = this.getLocalStorageAttempts();
      list.push(attempt);
      localStorage.setItem('cee_attempts', JSON.stringify(list));
      this.updateDailyStreak();
    }
  }

  public async getAttempts(): Promise<QuestionAttempt[]> {
    if (!this.isBrowser) return [];
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('attempts', 'readonly');
        const store = tx.objectStore('attempts');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as QuestionAttempt[]);
        req.onerror = () => resolve(this.getLocalStorageAttempts());
      });
    } catch {
      return this.getLocalStorageAttempts();
    }
  }

  private getLocalStorageAttempts(): QuestionAttempt[] {
    if (!this.isBrowser) return [];
    const stored = localStorage.getItem('cee_attempts');
    return stored ? JSON.parse(stored) : [];
  }

  // --- FLASHCARDS (SPACED REPETITION) ---
  public async getFlashcards(): Promise<Flashcard[]> {
    if (!this.isBrowser) return [];
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('flashcards', 'readonly');
        const req = tx.objectStore('flashcards').getAll();
        req.onsuccess = () => resolve(req.result as Flashcard[]);
        req.onerror = () => resolve([]);
      });
    } catch {
      const stored = localStorage.getItem('cee_flashcards');
      return stored ? JSON.parse(stored) : [];
    }
  }

  public async saveFlashcard(card: Flashcard): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      const tx = db.transaction('flashcards', 'readwrite');
      tx.objectStore('flashcards').put(card);
    } catch {
      const cards = await this.getFlashcards();
      const idx = cards.findIndex(c => c.id === card.id);
      if (idx >= 0) cards[idx] = card;
      else cards.push(card);
      localStorage.setItem('cee_flashcards', JSON.stringify(cards));
    }
  }

  // --- MOCK HISTORY ---
  public async getMockHistory(): Promise<MockExamResult[]> {
    if (!this.isBrowser) return [];
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('mocks', 'readonly');
        const req = tx.objectStore('mocks').getAll();
        req.onsuccess = () => resolve(req.result as MockExamResult[]);
        req.onerror = () => resolve([]);
      });
    } catch {
      const stored = localStorage.getItem('cee_mocks');
      return stored ? JSON.parse(stored) : [];
    }
  }

  public async saveMockResult(result: MockExamResult): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      const tx = db.transaction('mocks', 'readwrite');
      tx.objectStore('mocks').put(result);
    } catch {
      const mocks = await this.getMockHistory();
      mocks.unshift(result);
      localStorage.setItem('cee_mocks', JSON.stringify(mocks));
    }
  }

  // --- SETTINGS ---
  public getSettings(): UserSettings {
    if (!this.isBrowser) return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem('cee_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: UserSettings): void {
    if (!this.isBrowser) return;
    localStorage.setItem('cee_settings', JSON.stringify(settings));
  }

  // --- STREAK & TIME ---
  public getStreak(): { current: number; best: number; lastActiveDate: string } {
    if (!this.isBrowser) return { current: 1, best: 1, lastActiveDate: new Date().toISOString().split('T')[0] };
    const stored = localStorage.getItem('cee_streak');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
    const today = new Date().toISOString().split('T')[0];
    const initial = { current: 1, best: 1, lastActiveDate: today };
    localStorage.setItem('cee_streak', JSON.stringify(initial));
    return initial;
  }

  private updateDailyStreak(): void {
    if (!this.isBrowser) return;
    const today = new Date().toISOString().split('T')[0];
    const streak = this.getStreak();

    if (streak.lastActiveDate === today) return;

    const lastDate = new Date(streak.lastActiveDate);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak.current += 1;
      if (streak.current > streak.best) streak.best = streak.current;
    } else if (diffDays > 1) {
      streak.current = 1;
    }
    streak.lastActiveDate = today;
    localStorage.setItem('cee_streak', JSON.stringify(streak));
  }

  // --- EXPORT / IMPORT ALL DATA ---
  public async exportAllData(): Promise<ExportDataPayload> {
    const attempts = await this.getAttempts();
    const flashcards = await this.getFlashcards();
    const mockHistory = await this.getMockHistory();
    const questions = await this.getQuestions();
    const customQuestions = questions.filter(q => q.sourceType !== 'verified_past');
    const settings = this.getSettings();
    const streak = this.getStreak();

    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      attempts,
      flashcards,
      mockHistory,
      notes: {},
      customQuestions,
      settings,
      streak
    };
  }

  public async importAllData(payload: ExportDataPayload): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      if (payload.settings) this.saveSettings(payload.settings);
      if (payload.streak) localStorage.setItem('cee_streak', JSON.stringify(payload.streak));

      // Import custom questions
      if (payload.customQuestions && Array.isArray(payload.customQuestions)) {
        for (const q of payload.customQuestions) {
          await this.saveQuestion(q);
        }
      }

      // Import attempts
      if (payload.attempts && Array.isArray(payload.attempts)) {
        for (const a of payload.attempts) {
          await this.saveAttempt(a);
        }
      }

      // Import flashcards
      if (payload.flashcards && Array.isArray(payload.flashcards)) {
        for (const f of payload.flashcards) {
          await this.saveFlashcard(f);
        }
      }

      // Import mock history
      if (payload.mockHistory && Array.isArray(payload.mockHistory)) {
        for (const m of payload.mockHistory) {
          await this.saveMockResult(m);
        }
      }

      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  }

  public async clearAllData(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      if (this.db) {
        this.db.close();
        this.db = null;
      }
      window.indexedDB.deleteDatabase(DB_NAME);
      localStorage.clear();
      await this.initQuestions();
    } catch {
      localStorage.clear();
    }
  }
}

export const db = new LocalDB();
