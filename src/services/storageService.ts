import { 
  UserProgress, 
  MistakeItem, 
  UserNote, 
  FlashcardItem, 
  VocabStatus,
  MistakeCategory
} from '../types';
import { VOCABULARY_LIST } from '../data/vocabularyData';

const STORAGE_KEYS = {
  PROGRESS: 'deutschstart_progress_v2',
  MISTAKES: 'deutschstart_mistakes_v2',
  NOTES: 'deutschstart_notes_v2',
  FLASHCARDS: 'deutschstart_flashcards_v2',
};

const DEFAULT_PROGRESS: UserProgress = {
  userId: 'user_local_1',
  currentLevel: 'A0',
  streak: 0,
  streakDays: 0,
  lastActiveDate: '',
  totalStudyTimeMinutes: 0,
  totalStudyMinutes: 0,
  completedLessons: [],
  completedLessonIds: [],
  completedExerciseIds: [],
  wordsLearned: 0,
  totalCorrectAnswers: 0,
  totalIncorrectAnswers: 0,
  dailyGoalMinutes: 15,
  dailyGoalLessons: 1,
  todayMinutes: 0,
  todayLessonsCompleted: 0,
  studyLogs: [],
  favoriteVocabIds: [],
  vocabStatusMap: {},
};

class StorageService {
  private progress: UserProgress;
  private mistakes: MistakeItem[] = [];
  private notes: UserNote[] = [];
  private flashcards: FlashcardItem[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.progress = this.loadProgress();
    this.mistakes = this.loadMistakes();
    this.notes = this.loadNotes();
    this.flashcards = this.loadFlashcards();
    this.checkDailyStreak();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  private loadProgress(): UserProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          streakDays: parsed.streakDays ?? parsed.streak ?? 0,
          totalStudyMinutes: parsed.totalStudyMinutes ?? parsed.totalStudyTimeMinutes ?? 0,
          completedLessons: parsed.completedLessons ?? parsed.completedLessonIds ?? [],
        };
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
    return { ...DEFAULT_PROGRESS };
  }

  private saveProgress() {
    try {
      this.progress.streak = this.progress.streakDays;
      this.progress.totalStudyTimeMinutes = this.progress.totalStudyMinutes;
      this.progress.completedLessonIds = this.progress.completedLessons;
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(this.progress));
      this.notify();
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }

  private loadMistakes(): MistakeItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load mistakes', e);
    }
    return [];
  }

  private saveMistakes() {
    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(this.mistakes || []));
      this.notify();
    } catch (e) {
      console.error('Failed to save mistakes', e);
    }
  }

  private loadNotes(): UserNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
    return [];
  }

  private saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.notes || []));
      this.notify();
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }

  private loadFlashcards(): FlashcardItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load flashcards', e);
    }

    // Initialize initial cards from vocabulary data
    const initialCards: FlashcardItem[] = VOCABULARY_LIST.map((v) => ({
      id: `fc_${v.id}`,
      vocabId: v.id,
      german: v.german,
      article: v.article,
      vietnamese: v.vietnamese,
      repetitionBox: 1,
      nextReviewDate: new Date().toISOString(),
      intervalDays: 1,
    }));
    return initialCards;
  }

  private saveFlashcards() {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(this.flashcards));
      this.notify();
    } catch (e) {
      console.error('Failed to save flashcards', e);
    }
  }

  private checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = this.progress.lastActiveDate;

    if (!lastActive) return;
    if (lastActive === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive !== yesterday) {
      this.progress.streakDays = 0;
      this.progress.streak = 0;
      this.progress.todayMinutes = 0;
      this.progress.todayLessonsCompleted = 0;
      this.saveProgress();
    }
  }

  public getProgress(): UserProgress {
    return { ...this.progress };
  }

  public addStudyTime(minutes: number = 1) {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = this.progress.lastActiveDate;

    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastActive === yesterday || !lastActive) {
        this.progress.streakDays = (this.progress.streakDays || 0) + 1;
      } else {
        this.progress.streakDays = 1;
      }
      this.progress.lastActiveDate = today;
      this.progress.todayMinutes = 0;
      this.progress.todayLessonsCompleted = 0;
    }

    this.progress.totalStudyMinutes += minutes;
    this.progress.totalStudyTimeMinutes = this.progress.totalStudyMinutes;
    this.progress.todayMinutes += minutes;
    this.saveProgress();
  }

  public completeLesson(lessonId: string, score: number = 100) {
    this.addStudyTime(5);
    if (!this.progress.completedLessons.includes(lessonId)) {
      this.progress.completedLessons.push(lessonId);
      this.progress.todayLessonsCompleted += 1;
      this.progress.wordsLearned += 5;
    }
    this.saveProgress();
  }

  public completeDailyStudySession() {
    this.addStudyTime(20);
    this.progress.wordsLearned += 8;
    this.saveProgress();
  }

  // Mistakes methods
  public getMistakes(): MistakeItem[] {
    return Array.isArray(this.mistakes) ? [...this.mistakes] : [];
  }

  public saveMistake(mistake: Omit<MistakeItem, 'id' | 'timestamp'>) {
    if (!Array.isArray(this.mistakes)) this.mistakes = [];
    const existingIdx = this.mistakes.findIndex((m) => m.question === mistake.question);
    const newEntry: MistakeItem = {
      ...mistake,
      id: 'mistake_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      this.mistakes[existingIdx] = newEntry;
    } else {
      this.mistakes.unshift(newEntry);
    }
    this.saveMistakes();
  }

  public removeMistake(id: string) {
    if (!Array.isArray(this.mistakes)) {
      this.mistakes = [];
      return;
    }
    this.mistakes = this.mistakes.filter((m) => m.id !== id);
    this.saveMistakes();
  }

  public clearAllMistakes() {
    this.mistakes = [];
    this.saveMistakes();
  }

  // Notes methods
  public getNotes(): UserNote[] {
    return Array.isArray(this.notes) ? [...this.notes] : [];
  }

  public saveNote(note: Omit<UserNote, 'id' | 'updatedAt'>) {
    if (!Array.isArray(this.notes)) this.notes = [];
    const newNote: UserNote = {
      ...note,
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      updatedAt: new Date().toISOString(),
    };
    this.notes.unshift(newNote);
    this.saveNotes();
    return newNote;
  }

  public deleteNote(id: string) {
    if (!Array.isArray(this.notes)) {
      this.notes = [];
      return;
    }
    this.notes = this.notes.filter((n) => n.id !== id);
    this.saveNotes();
  }

  // Flashcard SRS methods
  public getFlashcards(): FlashcardItem[] {
    return Array.isArray(this.flashcards) ? [...this.flashcards] : [];
  }

  public getCardsDueForReview(): FlashcardItem[] {
    const now = new Date();
    const list = Array.isArray(this.flashcards) ? this.flashcards : [];
    return list.filter((c) => new Date(c.nextReviewDate) <= now);
  }

  public updateFlashcardReview(vocabId: string, rating: 1 | 2 | 3 | 4) {
    // Leitner intervals: rating 1 (1 day), rating 2 (2 days), rating 3 (4 days), rating 4 (7 days)
    const card = this.flashcards.find((c) => c.vocabId === vocabId);
    const INTERVAL_DAYS = { 1: 1, 2: 2, 3: 4, 4: 7 };
    const days = INTERVAL_DAYS[rating];

    if (card) {
      if (rating === 1) {
        card.repetitionBox = 1;
      } else {
        card.repetitionBox = Math.min(5, card.repetitionBox + 1);
      }
      card.intervalDays = days;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      card.nextReviewDate = nextDate.toISOString();
      card.lastReviewedDate = new Date().toISOString();
    } else {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      this.flashcards.push({
        id: `fc_${vocabId}`,
        vocabId,
        german: vocabId,
        vietnamese: '',
        repetitionBox: rating === 1 ? 1 : 2,
        intervalDays: days,
        nextReviewDate: nextDate.toISOString(),
        lastReviewedDate: new Date().toISOString(),
      });
    }

    this.saveFlashcards();
  }

  public resetAll() {
    this.progress = { ...DEFAULT_PROGRESS };
    this.mistakes = [];
    this.notes = [];
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.MISTAKES);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
    this.flashcards = this.loadFlashcards();
    this.notify();
  }
}

export const storageService = new StorageService();
