import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Bot,
  Clock3,
  Flame,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
} from 'lucide-react';
import { UserProgress, Lesson } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { PhoneticsGuideModal } from './PhoneticsGuideModal';
import { AdjektivAndPrepositionMatrixModal } from './AdjektivAndPrepositionMatrixModal';
import { MockExamModal } from './MockExamModal';

interface DailyDashboardProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
  onNavigate: (view: any) => void;
  onOpenDailySession: () => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  progress,
  onStartLesson,
  onNavigate,
  onOpenDailySession,
}) => {
  const [isPhoneticsOpen, setIsPhoneticsOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);

  const nextLessonInfo = useMemo(() => {
    let next: Lesson | null = null;
    let topicTitle = '';
    let levelId: 'A0' | 'A1' | 'A2' = progress.currentLevel || 'A0';
    const completed = progress.completedLessons || [];

    const levels: ('A0' | 'A1' | 'A2')[] = [levelId, ...(['A0', 'A1', 'A2'] as const).filter((l) => l !== levelId)];
    for (const level of levels) {
      const course = COURSES_DATA[level];
      for (const topic of course.topics) {
        const found = topic.lessons.find((lesson) => !completed.includes(lesson.id));
        if (found) {
          next = found;
          topicTitle = topic.titleVietnamese;
          levelId = level;
          break;
        }
      }
      if (next) break;
    }

    if (!next) {
      next = COURSES_DATA.A0.topics[0]?.lessons[0] || null;
      topicTitle = COURSES_DATA.A0.topics[0]?.titleVietnamese || '';
      levelId = 'A0';
    }

    return { lesson: next, topicTitle, levelId };
  }, [progress]);

  const reviewCards = useMemo(() => storageService.getCardsDueForReview(), [progress]);
  const mistakesCount = useMemo(() => storageService.getMistakes().length, [progress]);

  const wordOfTheDay = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i += 1) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    return VOCABULARY_LIST[Math.abs(hash) % VOCABULARY_LIST.length] || VOCABULARY_LIST[0];
  }, []);

  const levelProgress = useMemo(() => {
    const level = progress.currentLevel || 'A0';
    const lessons = COURSES_DATA[level].topics.flatMap((topic) => topic.lessons);
    const done = lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
    return {
      level,
      done,
      total: lessons.length,
      pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    };
  }, [progress]);

  const dailyMinutes = progress.todayMinutes || 0;
  const dailyGoal = progress.dailyGoalMinutes || 25;
  const dailyPct = dailyGoal > 0 ? Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100)) : 0;

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-28 pt-5 sm:px-6 sm:pt-8 lg:pb-10 animate-fadeIn">
      <header className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Hôm nay</p>
          <h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Tiếp tục từ chỗ bạn đang học</h1>
        </div>
        <button onClick={onOpenDailySession} className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white sm:inline-flex sm:items-center sm:gap-2">
          <Play className="h-3.5 w-3.5 fill-current" /> Phiên 20 phút
        </button>
      </header>

      <section className="grid gap-3 lg:grid-cols-[1.55fr_0.8fr]">
        {nextLessonInfo.lesson && (
          <button
            type="button"
            onClick={() => onStartLesson(nextLessonInfo.lesson!.id)}
            className="group rounded-[26px] bg-slate-950 p-5 text-left text-white shadow-sm transition hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex rounded-lg bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-slate-950">Bài tiếp theo</span>
                <p className="mt-4 text-xs font-bold text-slate-400">{nextLessonInfo.levelId} · {nextLessonInfo.topicTitle}</p>
                <h2 className="mt-1.5 text-2xl font-black leading-tight tracking-[-0.025em] sm:text-[30px]">{nextLessonInfo.lesson.titleVietnamese}</h2>
                <p className="mt-2 text-sm font-medium text-slate-400">{nextLessonInfo.lesson.estimatedMinutes} phút · 5 bước học</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-slate-950 transition group-hover:scale-105">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </div>
          </button>
        )}

        <div className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400">Mục tiêu ngày</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{dailyMinutes}<span className="text-base text-slate-400">/{dailyGoal} phút</span></p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700"><Clock3 className="h-5 w-5" /></span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${dailyPct}%` }} /></div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#f7f7f5] p-3.5"><p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />Chuỗi</p><p className="mt-1 text-lg font-black">{progress.streakDays || 0} ngày</p></div>
            <div className="rounded-2xl bg-[#f7f7f5] p-3.5"><p className="text-[11px] font-bold text-slate-500">Cấp hiện tại</p><p className="mt-1 text-lg font-black">{levelProgress.level} · {levelProgress.pct}%</p></div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Ưu tiên hôm nay</p><h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Học → Ôn → Sửa lỗi</h2></div>
        <div className="grid gap-3 md:grid-cols-3">
          <button onClick={() => onNavigate('vocab')} className="rounded-[22px] border border-black/[0.06] bg-white p-5 text-left shadow-sm transition hover:border-amber-200">
            <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700"><RotateCcw className="h-5 w-5" /></span><span className="text-2xl font-black text-slate-950">{reviewCards.length}</span></div>
            <h3 className="mt-4 text-sm font-black text-slate-950">Ôn từ</h3><p className="mt-1 text-xs leading-5 text-slate-500">Từ đến hạn hôm nay</p>
          </button>
          <button onClick={() => onNavigate('mistakes')} className="rounded-[22px] border border-black/[0.06] bg-white p-5 text-left shadow-sm transition hover:border-red-200">
            <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertCircle className="h-5 w-5" /></span><span className="text-2xl font-black text-slate-950">{mistakesCount}</span></div>
            <h3 className="mt-4 text-sm font-black text-slate-950">Sửa lỗi</h3><p className="mt-1 text-xs leading-5 text-slate-500">Câu cần làm lại</p>
          </button>
          <button onClick={() => onNavigate('tutor')} className="rounded-[22px] border border-black/[0.06] bg-white p-5 text-left shadow-sm transition hover:border-amber-200">
            <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700"><Bot className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-slate-300" /></div>
            <h3 className="mt-4 text-sm font-black text-slate-950">Hỏi AI Tutor</h3><p className="mt-1 text-xs leading-5 text-slate-500">Sửa câu hoặc hỏi ngữ pháp</p>
          </button>
        </div>
      </section>

      <section className="mt-7 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Từ hôm nay</p><div className="mt-2 flex items-center gap-2">{wordOfTheDay.article && wordOfTheDay.article !== 'none' && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-black">{wordOfTheDay.article}</span>}<span className="text-xl font-black">{wordOfTheDay.german}</span></div><p className="mt-1 text-sm font-semibold text-slate-500">{wordOfTheDay.vietnamese}</p></div><button onClick={() => speechService.speak(wordOfTheDay.article && wordOfTheDay.article !== 'none' ? `${wordOfTheDay.article} ${wordOfTheDay.german}` : wordOfTheDay.german)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><Volume2 className="h-4 w-4" /></button></div>
        </div>

        <div className="rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Công cụ nhanh</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button onClick={() => setIsPhoneticsOpen(true)} className="rounded-2xl bg-[#f7f7f5] p-3 text-left"><Volume2 className="h-4 w-4 text-amber-700" /><p className="mt-2 text-xs font-black">Phát âm</p></button>
            <button onClick={() => setIsMatrixOpen(true)} className="rounded-2xl bg-[#f7f7f5] p-3 text-left"><Layers className="h-4 w-4 text-amber-700" /><p className="mt-2 text-xs font-black">Tra cứu</p></button>
            <button onClick={() => setIsMockExamOpen(true)} className="rounded-2xl bg-[#f7f7f5] p-3 text-left"><Trophy className="h-4 w-4 text-amber-700" /><p className="mt-2 text-xs font-black">Thi thử</p></button>
          </div>
        </div>
      </section>

      <button onClick={() => onNavigate('learn')} className="mt-4 flex w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-white px-5 py-4 text-left shadow-sm"><span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700"><BookOpen className="h-4 w-4" /></span><span><span className="block text-sm font-black">Xem lộ trình {levelProgress.level}</span><span className="block text-[11px] font-medium text-slate-400">{levelProgress.done}/{levelProgress.total} bài đã xong</span></span></span><ArrowRight className="h-4 w-4 text-slate-300" /></button>

      <PhoneticsGuideModal isOpen={isPhoneticsOpen} onClose={() => setIsPhoneticsOpen(false)} />
      <AdjektivAndPrepositionMatrixModal isOpen={isMatrixOpen} onClose={() => setIsMatrixOpen(false)} />
      <MockExamModal isOpen={isMockExamOpen} onClose={() => setIsMockExamOpen(false)} />
    </div>
  );
};
