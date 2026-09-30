import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Layers,
  MessageCircle,
  Play,
  RotateCcw,
  Sparkles,
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

const orderedLevels = ['A0', 'A1', 'A2'] as const;

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  progress,
  onStartLesson,
  onNavigate,
  onOpenDailySession,
}) => {
  const [isPhoneticsOpen, setIsPhoneticsOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);

  const learningPath = useMemo(
    () =>
      orderedLevels.flatMap((level) =>
        COURSES_DATA[level].topics.flatMap((topic) =>
          topic.lessons.map((lesson) => ({
            lesson,
            level,
            topicTitle: topic.titleVietnamese,
          }))
        )
      ),
    []
  );

  const completedLessons = progress.completedLessons || [];

  const nextLessonInfo = useMemo(() => {
    const next =
      learningPath.find((item) => !completedLessons.includes(item.lesson.id)) ||
      learningPath[learningPath.length - 1] ||
      null;

    if (!next) return null;

    const index = learningPath.findIndex((item) => item.lesson.id === next.lesson.id);

    return {
      ...next,
      pathIndex: Math.max(0, index),
      lessonNumber: Math.max(1, index + 1),
    };
  }, [completedLessons, learningPath]);

  const reviewCards = useMemo(() => storageService.getCardsDueForReview(), [progress]);
  const mistakesCount = useMemo(() => storageService.getMistakes().length, [progress]);
  const isBrandNew = completedLessons.length === 0;

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
    const done = lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
    return {
      level,
      done,
      total: lessons.length,
      pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    };
  }, [completedLessons, progress.currentLevel]);

  const dailyMinutes = progress.todayMinutes || 0;
  const dailyGoal = progress.dailyGoalMinutes || 15;
  const dailyPct = dailyGoal > 0 ? Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100)) : 0;

  const primaryLesson: Lesson | null = nextLessonInfo?.lesson || null;

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-28 pt-5 sm:px-6 sm:pt-8 lg:pb-10 animate-fadeIn">
      <header className="mb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">
          {isBrandNew ? 'Bắt đầu từ đây' : 'Hôm nay'}
        </p>
        <h1 className="mt-1 max-w-2xl text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
          {isBrandNew
            ? 'Mới học tiếng Đức? Bạn chỉ cần bắt đầu bài đầu tiên.'
            : 'Học tiếp đúng bài của bạn — không cần tự chọn nội dung.'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {isBrandNew
            ? 'DeutschStart sẽ tự dẫn theo thứ tự A0 → A1 → A2. Từ vựng, ngữ pháp, luyện tập và nói đều nằm trong từng bài.'
            : 'App tự chọn bài tiếp theo dựa trên tiến độ. Các tab khác chỉ là công cụ hỗ trợ khi bạn cần.'}
        </p>
      </header>

      {primaryLesson && (
        <section className="overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-sm">
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-slate-950">
                {isBrandNew ? 'Bài đầu tiên' : 'Bài tiếp theo'}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-slate-300">
                {nextLessonInfo?.level} · Bài {nextLessonInfo?.lessonNumber}/{learningPath.length}
              </span>
            </div>

            <p className="mt-5 text-xs font-bold text-slate-400">
              {nextLessonInfo?.topicTitle}
            </p>
            <h2 className="mt-1.5 max-w-2xl text-2xl font-black leading-tight tracking-[-0.025em] sm:text-[32px]">
              {primaryLesson.titleVietnamese}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              {primaryLesson.description}
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.06] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">01 · Học</p>
                <p className="mt-1 text-xs font-bold text-white">Từ mới + kiến thức chính</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">02 · Luyện</p>
                <p className="mt-1 text-xs font-bold text-white">Bài tập có giải thích</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">03 · Nói</p>
                <p className="mt-1 text-xs font-bold text-white">Đọc và phản xạ câu thật</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartLesson(primaryLesson.id)}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-300 sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" />
              {isBrandNew ? 'Bắt đầu bài đầu tiên' : 'Tiếp tục học'}
              <span className="font-bold opacity-60">· {primaryLesson.estimatedMinutes} phút</span>
            </button>

            {isBrandNew && (
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Không cần vào Từ vựng hay Ngữ pháp trước. Cứ hoàn thành bài này theo thứ tự.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="mt-5 grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-amber-700" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Kế hoạch hôm nay</p>
              <h2 className="mt-0.5 text-lg font-black text-slate-950">Chỉ làm theo 3 bước này</h2>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => primaryLesson && onStartLesson(primaryLesson.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-amber-50 p-3.5 text-left ring-1 ring-amber-100"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">1</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-950">Học bài chính</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                  {primaryLesson?.titleVietnamese || 'Bài tiếp theo'} · khoảng {primaryLesson?.estimatedMinutes || 10} phút
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-700" />
            </button>

            <button
              onClick={() => onNavigate('vocab')}
              className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3.5 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-slate-500 ring-1 ring-black/[0.06]">2</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">Ôn từ</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {reviewCards.length > 0
                    ? reviewCards.length + ' từ đang đến hạn · khoảng 3 phút'
                    : isBrandNew
                    ? 'Chưa cần ôn — học bài đầu tiên trước'
                    : 'Không có từ đến hạn hôm nay'}
                </p>
              </div>
              {reviewCards.length > 0 && <RotateCcw className="h-4 w-4 text-blue-600" />}
            </button>

            <button
              onClick={() => onNavigate('conversation')}
              className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3.5 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-slate-500 ring-1 ring-black/[0.06]">3</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">Nói lại một chút</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">Luyện phản xạ khoảng 2 phút sau khi học</p>
              </div>
              <MessageCircle className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400">Mục tiêu ngày</p>
          <p className="mt-1 text-2xl font-black text-slate-950">
            {dailyMinutes}
            <span className="text-base text-slate-400">/{dailyGoal} phút</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-amber-500" style={{ width: String(dailyPct) + '%' }} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#f7f7f5] p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />Chuỗi
              </p>
              <p className="mt-1 text-lg font-black">{progress.streakDays || 0} ngày</p>
            </div>
            <div className="rounded-2xl bg-[#f7f7f5] p-3.5">
              <p className="text-[11px] font-bold text-slate-500">Cấp hiện tại</p>
              <p className="mt-1 text-lg font-black">{levelProgress.level} · {levelProgress.pct}%</p>
            </div>
          </div>

          <button
            onClick={onOpenDailySession}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/[0.07] px-3 text-xs font-black text-slate-600 hover:bg-slate-50"
          >
            <Clock3 className="h-4 w-4" />Phiên học 20 phút
          </button>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Công cụ phụ</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">Chỉ dùng khi cần</h2>
          </div>
          <button onClick={() => onNavigate('learn')} className="text-xs font-black text-amber-700">
            Xem toàn bộ lộ trình
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button onClick={() => onNavigate('tutor')} className="rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm">
            <Bot className="h-4 w-4 text-amber-700" />
            <p className="mt-3 text-sm font-black">AI Tutor</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Hỏi khi chưa hiểu bài.</p>
          </button>
          <button onClick={() => setIsPhoneticsOpen(true)} className="rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <p className="mt-3 text-sm font-black">Phát âm</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Tra cứu cách đọc âm.</p>
          </button>
          <button onClick={() => onNavigate('mistakes')} className="rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-red-600" />
            <p className="mt-3 text-sm font-black">Lỗi sai</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{mistakesCount} câu cần xem lại.</p>
          </button>
          <button onClick={() => setIsMatrixOpen(true)} className="rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm">
            <Layers className="h-4 w-4 text-emerald-600" />
            <p className="mt-3 text-sm font-black">Tra cứu</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Bảng nhanh khi cần.</p>
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />Từ hôm nay
            </p>
            <div className="mt-2 flex items-center gap-2">
              {wordOfTheDay.article && wordOfTheDay.article !== 'none' && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-black">{wordOfTheDay.article}</span>
              )}
              <span className="text-xl font-black">{wordOfTheDay.german}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-500">{wordOfTheDay.vietnamese}</p>
          </div>
          <button
            onClick={() =>
              speechService.speak(
                wordOfTheDay.article && wordOfTheDay.article !== 'none'
                  ? wordOfTheDay.article + ' ' + wordOfTheDay.german
                  : wordOfTheDay.german
              )
            }
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </section>

      <button
        onClick={() => onNavigate('learn')}
        className="mt-4 flex w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-white px-5 py-4 text-left shadow-sm"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <BookOpen className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-black">Lộ trình học theo thứ tự</span>
            <span className="block text-[11px] font-medium text-slate-400">
              {completedLessons.length}/{learningPath.length} bài đã hoàn thành
            </span>
          </span>
        </span>
        <ArrowRight className="h-4 w-4 text-slate-300" />
      </button>

      <PhoneticsGuideModal isOpen={isPhoneticsOpen} onClose={() => setIsPhoneticsOpen(false)} />
      <AdjektivAndPrepositionMatrixModal isOpen={isMatrixOpen} onClose={() => setIsMatrixOpen(false)} />
      <MockExamModal isOpen={isMockExamOpen} onClose={() => setIsMockExamOpen(false)} />
    </div>
  );
};
