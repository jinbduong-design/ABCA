import { APP_VERSION } from '../version';
import { storageService } from './storageService';

export interface DailyLessonChunk {
  id: string;
  german: string;
  english: string;
  vietnamese: string;
  audio_speed?: number;
  pronunciation_note_vi?: string;
}

export interface DailyLessonData {
  schema_version: string;
  lesson_id: string;
  day: number;
  published_date?: string;
  title: string;
  learner_profile: {
    level: string;
    assumption: string;
    session_minutes: number;
    max_new_chunks: number;
    primary_translation: string;
    secondary_translation: string;
    show_scores: boolean;
    show_grammar_terms: boolean;
  };
  outcome: {
    can_do: string;
    real_world_scene: string;
  };
  ui_rules: Record<string, unknown>;
  core_chunks: DailyLessonChunk[];
  flow: Array<Record<string, any>>;
  adaptive_rules?: Record<string, any>;
  review_schedule?: Array<Record<string, any>>;
  completion_rule?: Record<string, any>;
  next_day_seed?: Record<string, any>;
}

interface DailyLessonRecord {
  completedAt: string;
  helpUsed: number;
  learnerName?: string;
  sessionMinutes: number;
}

interface DailyLessonProgress {
  completedDays: number[];
  records: Record<string, DailyLessonRecord>;
  learnerName?: string;
}

export interface HomeDailyLesson {
  lesson: DailyLessonData;
  isReview: boolean;
}

const STORAGE_KEY = 'deutschstart_daily_lessons_v1';

function emptyProgress(): DailyLessonProgress {
  return {
    completedDays: [],
    records: {},
  };
}

function fileName(day: number) {
  return 'day' + String(day).padStart(3, '0') + '.json';
}

class DailyLessonService {
  getProgress(): DailyLessonProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyProgress();
      const parsed = JSON.parse(raw);
      return {
        ...emptyProgress(),
        ...parsed,
        completedDays: Array.isArray(parsed.completedDays)
          ? parsed.completedDays
          : [],
        records:
          parsed.records && typeof parsed.records === 'object'
            ? parsed.records
            : {},
      };
    } catch {
      return emptyProgress();
    }
  }

  getLearnerName(): string {
    return this.getProgress().learnerName || '';
  }

  isCompleted(day: number): boolean {
    return this.getProgress().completedDays.includes(day);
  }

  getNextDay(): number {
    const completed = new Set(this.getProgress().completedDays);
    let day = 1;
    while (completed.has(day)) day += 1;
    return day;
  }

  async loadLesson(day: number): Promise<DailyLessonData | null> {
    try {
      const response = await fetch(
        '/daily-lessons/' + fileName(day) + '?v=' + encodeURIComponent(APP_VERSION),
        { cache: 'no-store' }
      );

      if (!response.ok) return null;
      const lesson = await response.json();
      if (!lesson || Number(lesson.day) !== day || !Array.isArray(lesson.flow)) {
        return null;
      }

      return lesson as DailyLessonData;
    } catch {
      return null;
    }
  }

  async getHomeLesson(): Promise<HomeDailyLesson | null> {
    const progress = this.getProgress();
    const nextDay = this.getNextDay();
    const next = await this.loadLesson(nextDay);

    if (next) {
      return { lesson: next, isReview: false };
    }

    const latestCompleted = [...progress.completedDays]
      .sort((a, b) => b - a)[0];

    if (latestCompleted) {
      const review = await this.loadLesson(latestCompleted);
      if (review) return { lesson: review, isReview: true };
    }

    const first = await this.loadLesson(1);
    return first ? { lesson: first, isReview: false } : null;
  }

  completeDay(
    lesson: DailyLessonData,
    helpUsed: number,
    learnerName?: string
  ) {
    const progress = this.getProgress();
    const completedDays = Array.from(
      new Set([...progress.completedDays, lesson.day])
    ).sort((a, b) => a - b);

    const updated: DailyLessonProgress = {
      ...progress,
      completedDays,
      learnerName: learnerName || progress.learnerName,
      records: {
        ...progress.records,
        [String(lesson.day)]: {
          completedAt: new Date().toISOString(),
          helpUsed,
          learnerName: learnerName || progress.learnerName,
          sessionMinutes: lesson.learner_profile.session_minutes,
        },
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    storageService.markExternalChange();
  }
}

export const dailyLessonService = new DailyLessonService();
