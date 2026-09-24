import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Clock3,
  Flame,
  Layers,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { UserProgress } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { storageService } from '../services/storageService';

interface ProgressViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ progress, onResetProgress }) => {
  const [srsDistribution, setSrsDistribution] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  useEffect(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    storageService.getFlashcards().forEach((card) => {
      const box = card.repetitionBox || 1;
      dist[box] = (dist[box] || 0) + 1;
    });
    setSrsDistribution(dist);
  }, [progress]);

  const levelStats = useMemo(() => (['A0', 'A1', 'A2'] as const).map((level) => {
    const lessons = COURSES_DATA[level].topics.flatMap((topic) => topic.lessons);
    const completed = lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
    return {
      level,
      title: COURSES_DATA[level].title.replace(/^A[0-2]\s*[–—-]\s*/i, ''),
      total: lessons.length,
      completed,
      pct: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    };
  }), [progress]);

  const currentLevel = progress.currentLevel || 'A0';
  const current = levelStats.find((item) => item.level === currentLevel) || levelStats[0];
  const maxSrs = Math.max(1, ...(Object.values(srsDistribution) as number[]));

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
      <header><p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Tiến độ</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Nhìn nhanh xem mình đã đi tới đâu</h1></header>

      <section className="mt-5 rounded-[26px] bg-slate-950 p-5 text-white shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-400">Cấp hiện tại</p><h2 className="mt-1 text-3xl font-black">{current.level}</h2><p className="mt-1 text-sm font-semibold text-slate-400">{current.title}</p></div><div className="text-right"><p className="text-3xl font-black text-amber-400">{current.pct}%</p><p className="text-[11px] font-bold text-slate-400">{current.completed}/{current.total} bài</p></div></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-400" style={{ width: `${current.pct}%` }} /></div>
      </section>

      <section className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-sm"><Flame className="h-4 w-4 fill-orange-400 text-orange-400" /><p className="mt-3 text-xl font-black text-slate-950">{progress.streakDays || 0}</p><p className="mt-0.5 text-[10px] font-bold text-slate-400">ngày liên tiếp</p></div>
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-sm"><Clock3 className="h-4 w-4 text-blue-600" /><p className="mt-3 text-xl font-black text-slate-950">{progress.totalStudyMinutes || 0}</p><p className="mt-0.5 text-[10px] font-bold text-slate-400">phút đã học</p></div>
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-sm"><Layers className="h-4 w-4 text-emerald-600" /><p className="mt-3 text-xl font-black text-slate-950">{progress.wordsLearned || 0}</p><p className="mt-0.5 text-[10px] font-bold text-slate-400">từ đã học</p></div>
      </section>

      <section className="mt-7 rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-700" /><h2 className="text-sm font-black text-slate-950">Lộ trình A0 → A2</h2></div><div className="mt-5 space-y-5">{levelStats.map((level) => <div key={level.level}><div className="flex items-center justify-between gap-3 text-xs"><div><span className="font-black text-slate-950">{level.level}</span><span className="ml-2 font-semibold text-slate-400">{level.title}</span></div><span className="font-black text-slate-500">{level.completed}/{level.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${level.pct}%` }} /></div></div>)}</div></section>

      <section className="mt-4 rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-blue-600" /><h2 className="text-sm font-black text-slate-950">Ghi nhớ từ vựng</h2></div><span className="text-[10px] font-bold text-slate-400">Leitner 1 → 5</span></div><div className="mt-5 grid grid-cols-5 gap-2">{[1,2,3,4,5].map((box) => { const count = srsDistribution[box] || 0; const pct = (count / maxSrs) * 100; return <div key={box} className="flex flex-col items-center"><div className="flex h-24 w-full items-end justify-center rounded-xl bg-slate-50 px-2 pb-2"><div className="w-full rounded-lg bg-blue-500/80" style={{ height: `${Math.max(count ? 10 : 2, pct)}%` }} /></div><p className="mt-2 text-sm font-black text-slate-900">{count}</p><p className="text-[9px] font-black uppercase text-slate-400">Hộp {box}</p></div>; })}</div></section>

      <section className="mt-8 flex flex-col gap-3 rounded-[20px] border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black text-slate-900">Đặt lại toàn bộ tiến độ</p><p className="mt-0.5 text-xs text-slate-500">Xóa bài đã học, từ vựng và chuỗi ngày.</p></div><button onClick={() => { if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ tiến độ học?')) onResetProgress(); }} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black text-red-700 hover:bg-red-100"><Trash2 className="h-4 w-4" />Đặt lại</button></section>
    </div>
  );
};
