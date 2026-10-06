import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  MessageCircle,
  Play,
  RefreshCw,
} from 'lucide-react';
import { UserProgress } from '../types';
import {
  DailyLessonData,
  HomeDailyLesson,
  dailyLessonService,
} from '../services/dailyLessonService';

interface DailyDashboardProps {
  progress: UserProgress;
  onStartLesson: (lessonId: string) => void;
  onStartDailyLesson: (lesson: DailyLessonData) => void;
  onNavigate: (view: any) => void;
  onOpenDailySession: () => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  progress,
  onStartDailyLesson,
  onNavigate,
  onOpenDailySession,
}) => {
  const [homeLesson, setHomeLesson] = useState<HomeDailyLesson | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingLesson(true);

    dailyLessonService.getHomeLesson().then((result) => {
      if (cancelled) return;
      setHomeLesson(result);
      setIsLoadingLesson(false);
    });

    return () => {
      cancelled = true;
    };
  }, [progress.todayMinutes, progress.lastActiveDate]);

  const dailyMinutes = progress.todayMinutes || 0;
  const dailyGoal = progress.dailyGoalMinutes || 15;
  const dailyPct =
    dailyGoal > 0
      ? Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100))
      : 0;

  const chunks = useMemo(
    () => homeLesson?.lesson.core_chunks?.slice(0, 3) || [],
    [homeLesson]
  );

  return (
    <div className="mobile-focus-scroll mx-auto max-w-[1080px] px-3 pb-24 pt-4 sm:px-6 sm:pb-28 sm:pt-8 lg:pb-10 animate-fadeIn">
      <header className="mb-4 sm:mb-6">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">
          Hôm nay
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
          Một bài. Học cho dùng được.
        </h1>
        <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-slate-500 sm:block">
          Nội dung học nằm trong file dữ liệu riêng từng ngày. App chỉ dẫn mày đi qua đúng thứ tự.
        </p>
      </header>

      {isLoadingLesson && (
        <section className="rounded-[26px] bg-slate-950 p-6 text-white">
          <p className="text-sm font-black">Đang lấy bài hôm nay…</p>
        </section>
      )}

      {!isLoadingLesson && homeLesson && (
        <section className="overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-sm">
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-slate-950">
                {homeLesson.isReview
                  ? 'Ôn lại Day ' + homeLesson.lesson.day
                  : 'Day ' + homeLesson.lesson.day}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-slate-300">
                {homeLesson.lesson.learner_profile.session_minutes} phút · {homeLesson.lesson.learner_profile.level.replace('_absolute_beginner', '')}
              </span>
            </div>

            <h2 className="mt-5 text-[28px] font-black leading-tight tracking-[-0.03em] sm:text-[34px]">
              {homeLesson.lesson.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {homeLesson.lesson.outcome.can_do}
            </p>

            <div className="mt-6 space-y-2">
              {chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.06] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white">
                      {chunk.german}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-400">
                      {chunk.english}
                    </p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onStartDailyLesson(homeLesson.lesson)}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-300 sm:w-auto"
            >
              {homeLesson.isReview ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
              {homeLesson.isReview ? 'Ôn lại bài này' : 'Bắt đầu Day ' + homeLesson.lesson.day}
            </button>

            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
              German trước · English ngay dưới · tiếng Việt chỉ mở khi không hiểu · không chấm điểm.
            </p>
          </div>
        </section>
      )}

      {!isLoadingLesson && !homeLesson && (
        <section className="rounded-[24px] border border-black/[0.06] bg-white p-5">
          <p className="text-sm font-black text-slate-950">
            Chưa có file bài học để mở.
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Khi file Day tiếp theo được thêm vào, app sẽ tự nhận mà không cần sửa lesson code.
          </p>
        </section>
      )}

      <section className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            Cách học hôm nay
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-950">
            Học → tự nhớ → dùng thật
          </h2>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              disabled={!homeLesson}
              onClick={() =>
                homeLesson && onStartDailyLesson(homeLesson.lesson)
              }
              className="flex w-full items-center gap-3 rounded-2xl bg-amber-50 p-3.5 text-left ring-1 ring-amber-100 disabled:opacity-40"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">
                1
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-950">
                  Bài dữ liệu hôm nay
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  Chỉ 3 cụm mới. Không học lan man.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-700" />
            </button>

            <div className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-slate-500 ring-1 ring-black/[0.06]">
                2
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">
                  Tự kéo câu ra khỏi trí nhớ
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  Bí mới nhận gợi ý từng tầng.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('conversation')}
              className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3.5 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-slate-500 ring-1 ring-black/[0.06]">
                3
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">
                  Dùng trong hội thoại
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  Sau bài chính mới luyện phản xạ thêm.
                </p>
              </div>
              <MessageCircle className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400">Hôm nay</p>
          <p className="mt-1 text-2xl font-black text-slate-950">
            {dailyMinutes}
            <span className="text-base text-slate-400">/{dailyGoal} phút</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: String(dailyPct) + '%' }}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-[#f7f7f5] p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
              Chuỗi
            </p>
            <p className="mt-1 text-lg font-black">
              {progress.streakDays || 0} ngày
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenDailySession}
            className="mt-3 hidden min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/[0.07] px-3 text-xs font-black text-slate-600 hover:bg-slate-50 sm:inline-flex"
          >
            <Clock3 className="h-4 w-4" />
            Phiên học cũ 20 phút
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={() => onNavigate('learn')}
        className="mt-4 hidden w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-white px-5 py-4 text-left shadow-sm sm:flex"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <BookOpen className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-black">
              Lộ trình cũ
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              Giữ lại để tham khảo; bài chính bây giờ đi theo file Day.
            </span>
          </span>
        </span>
        <ArrowRight className="h-4 w-4 text-slate-300" />
      </button>
    </div>
  );
};
