import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Layers, 
  RotateCcw, 
  Award, 
  AlertCircle, 
  Trash2, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { UserProgress } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { storageService } from '../services/storageService';

interface ProgressViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onResetProgress,
}) => {
  const [srsDistribution, setSrsDistribution] = useState<{ [box: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    const flashcards = storageService.getFlashcards();
    const dist: { [box: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    flashcards.forEach((c) => {
      const box = c.repetitionBox || 1;
      dist[box] = (dist[box] || 0) + 1;
    });
    setSrsDistribution(dist);
    setMistakesCount(storageService.getMistakes().length);
  }, [progress]);

  // Level Completion
  const levelStats = (['A0', 'A1', 'A2'] as const).map((lvl) => {
    const course = COURSES_DATA[lvl];
    let total = 0;
    let completed = 0;
    const completedList = progress?.completedLessons || [];
    course.topics.forEach((t) => {
      t.lessons.forEach((l) => {
        total++;
        if (completedList.includes(l.id)) completed++;
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { level: lvl, title: course.title, total, completed, pct };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-amber-600" />
          Tiến Độ Học Tập Cá Nhân
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi hành trình chinh phục tiếng Đức từ A0 đến A2 với số liệu chi tiết.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Chuỗi liên tục</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{progress.streakDays}</p>
          <p className="text-[11px] text-slate-500">Ngày học liên tiếp</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Bài hoàn thành</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {(progress?.completedLessons || []).length}
          </p>
          <p className="text-[11px] text-slate-500">Trên tổng 16 bài học</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Từ vựng đã học</span>
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{progress.wordsLearned}</p>
          <p className="text-[11px] text-slate-500">
            Kho {VOCABULARY_LIST.length} từ vựng
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Thời gian học</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {progress.totalStudyMinutes}
          </p>
          <p className="text-[11px] text-slate-500">Phút tập trung</p>
        </div>
      </div>

      {/* Level Completion Bars */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          Tiến độ hoàn thành lộ trình theo cấp độ
        </h3>

        <div className="space-y-4 pt-1">
          {levelStats.map((lvl) => (
            <div key={lvl.level} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Cấp độ {lvl.level}: {lvl.title}
                </span>
                <span className="font-bold text-amber-700">
                  {lvl.completed} / {lvl.total} bài ({lvl.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${lvl.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spaced Repetition Leitner Box Distribution */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            Hệ thống ghi nhớ ngắt quãng (Leitner 5 Hộp)
          </h3>
          <span className="text-xs text-slate-400">
            Đích đến: Hộp 5 (Trí nhớ vĩnh viễn)
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-2 text-center">
          {[1, 2, 3, 4, 5].map((box) => (
            <div
              key={box}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Hộp {box}
              </span>
              <p className="text-xl font-black text-slate-900">
                {srsDistribution[box] || 0}
              </p>
              <p className="text-[10px] text-slate-500">
                {box === 1
                  ? 'Mới / Ôn 1 ngày'
                  : box === 2
                  ? '2 ngày'
                  : box === 3
                  ? '4 ngày'
                  : box === 4
                  ? '7 ngày'
                  : 'Vĩnh viễn'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings & Reset */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Thiết lập lại tiến trình</h4>
          <p className="text-xs text-slate-500">
            Khởi động lại toàn bộ tiến độ về 0 bài học, 0 từ vựng và 0 chuỗi ngày.
          </p>
        </div>
        <button
          onClick={() => {
            if (
              window.confirm(
                'Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học về 0 từ đầu không?'
              )
            ) {
              onResetProgress();
            }
          }}
          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold self-start sm:self-auto flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Đặt lại dữ liệu về 0
        </button>
      </div>
    </div>
  );
};
