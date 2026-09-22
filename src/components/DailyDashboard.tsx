import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Flame, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Bot, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  Target,
  Trophy,
  Layers,
  Award,
  PenTool
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
  // Modals state
  const [isPhoneticsOpen, setIsPhoneticsOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);

  // Determine Next Logical Lesson
  const nextLessonInfo = useMemo(() => {
    let next: Lesson | null = null;
    let topicTitle = '';
    let levelId: 'A0' | 'A1' | 'A2' = progress?.currentLevel || 'A0';
    const completedList = progress?.completedLessons || [];

    // First search in current level
    const currentCourse = COURSES_DATA[levelId] || COURSES_DATA['A0'];
    if (currentCourse) {
      for (const topic of currentCourse.topics) {
        for (const lesson of topic.lessons) {
          if (!completedList.includes(lesson.id)) {
            next = lesson;
            topicTitle = topic.titleVietnamese;
            break;
          }
        }
        if (next) break;
      }
    }

    // If current level completed, check subsequent levels
    if (!next) {
      const levels: ('A0' | 'A1' | 'A2')[] = ['A0', 'A1', 'A2'];
      for (const lvl of levels) {
        const course = COURSES_DATA[lvl];
        for (const topic of course.topics) {
          for (const lesson of topic.lessons) {
            if (!completedList.includes(lesson.id)) {
              next = lesson;
              topicTitle = topic.titleVietnamese;
              levelId = lvl;
              break;
            }
          }
          if (next) break;
        }
        if (next) break;
      }
    }

    // Default to very first lesson if all done or fresh
    if (!next) {
      next = COURSES_DATA['A0'].topics[0].lessons[0];
      topicTitle = COURSES_DATA['A0'].topics[0].titleVietnamese;
      levelId = 'A0';
    }

    return { lesson: next, topicTitle, levelId };
  }, [progress]);

  // Review Due Words
  const reviewCards = useMemo(() => {
    return storageService.getCardsDueForReview();
  }, [progress]);

  // Mistakes count
  const mistakesCount = useMemo(() => {
    return storageService.getMistakes().length;
  }, [progress]);

  // Word of the Day (random seeded by date)
  const wordOfTheDay = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % VOCABULARY_LIST.length;
    return VOCABULARY_LIST[idx] || VOCABULARY_LIST[0];
  }, []);

  // Level completion stats
  const levelStats = useMemo(() => {
    const calc = (lvl: 'A0' | 'A1' | 'A2') => {
      const course = COURSES_DATA[lvl];
      let total = 0;
      let completed = 0;
      course.topics.forEach((t) => {
        t.lessons.forEach((l) => {
          total++;
          if (progress?.completedLessons?.includes(l.id)) {
            completed++;
          }
        });
      });
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, pct };
    };

    return {
      A0: calc('A0'),
      A1: calc('A1'),
      A2: calc('A2'),
    };
  }, [progress]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* 1. DAILY STREAK & SUMMARY HERO */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chương trình tối ưu cho người Việt (A0 ➔ A2)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Chào bạn! Sẵn sàng nâng cấp vốn tiếng Đức hôm nay?
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              Duy trì 20–30 phút mỗi ngày với phương pháp <strong>Nghe - Nói phản xạ - Đọc - Hiểu ngữ pháp</strong>. 
              Bạn đang có chuỗi học tập <span className="text-amber-300 font-black">{progress?.streakDays || 1} ngày</span> liên tiếp!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-100">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Hôm nay: <strong>{progress?.dailyMinutesSpent || 0} / 25 phút</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-100">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>Tổng điểm kinh nghiệm: <strong>{progress?.totalXP || 0} XP</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Button on Hero */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenDailySession}
              className="px-6 py-4 bg-white hover:bg-amber-50 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
              <span>Bắt đầu Phiên học 20 phút</span>
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem toàn bộ lộ trình A0-A2</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE NEW SPECIALIZED TOOLS: EXAM, PHONETICS, GRAMMAR MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Mock Exam Button */}
        <button
          onClick={() => setIsMockExamOpen(true)}
          className="p-4 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 hover:from-amber-500/25 border border-amber-300/80 rounded-3xl text-left transition-all hover:shadow-md group flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-amber-600 text-white rounded-xl shadow-xs">
                <Trophy className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                10 Phút
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">
              Thi thử Mini-Exam A1
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Làm quen cấu trúc đề thi Goethe/Telc: Nghe đàm thoại, Đọc hiểu & Ngữ pháp.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 pt-3 flex items-center gap-1">
            Bắt đầu làm bài <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Phonetics Guide */}
        <button
          onClick={() => setIsPhoneticsOpen(true)}
          className="p-4 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 hover:from-emerald-500/25 border border-emerald-300/80 rounded-3xl text-left transition-all hover:shadow-md group flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Volume2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                Khẩu hình
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
              Cẩm Nang Phát Âm & Khẩu Hình
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Chữa lỗi phát âm kinh điển của người Việt: ch mềm/cứng, r cuống họng, ö, ü, ä.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 pt-3 flex items-center gap-1">
            Mở cẩm nang <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Grammar Matrix Modal */}
        <button
          onClick={() => setIsMatrixOpen(true)}
          className="p-4 bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-blue-500/5 hover:from-blue-500/25 border border-blue-300/80 rounded-3xl text-left transition-all hover:shadow-md group flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-900">
                Tra cứu nhanh
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
              Ma Trận Giới Từ & Đuôi Tính Từ
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Bảng tra cứu tương tác 9 Wechselpräpositionen (Wohin/Wo) & 4 Kasus.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 pt-3 flex items-center gap-1">
            Mở bảng tra cứu <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* 3. NEXT SUGGESTED LESSON CARD */}
      {nextLessonInfo.lesson && (
        <div className="p-6 bg-white rounded-3xl border-2 border-amber-400/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md">
                Bài học tiếp theo
              </span>
              <span className="text-xs font-bold text-slate-500">
                {nextLessonInfo.levelId} • {nextLessonInfo.topicTitle}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {nextLessonInfo.lesson.titleVietnamese}
            </h3>

            <p className="text-xs text-slate-500 max-w-xl font-medium">
              {nextLessonInfo.lesson.titleGerman} — {nextLessonInfo.lesson.estimatedMinutes} phút luyện tập đầy đủ 5 bước.
            </p>
          </div>

          <button
            onClick={() => onStartLesson(nextLessonInfo.lesson.id)}
            className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Học ngay bài này</span>
          </button>
        </div>
      )}

      {/* 4. LEVEL PROGRESS TRACKER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            Tiến độ hoàn thành các cấp độ
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Chuẩn khung tham chiếu Châu Âu (CEFR)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'A0',
              title: 'Cấp độ A0: Nhập môn & Phát âm',
              desc: 'Bảng chữ cái, số đếm, phát âm tiếng Đức, chào hỏi',
              pct: levelStats.A0.pct,
              color: 'from-amber-500 to-amber-600',
            },
            {
              id: 'A1',
              title: 'Cấp độ A1: Giao tiếp Căn bản',
              desc: 'Quán từ der/die/das, Akkusativ, Dativ, chia động từ, mua sắm',
              pct: levelStats.A1.pct,
              color: 'from-blue-500 to-blue-600',
            },
            {
              id: 'A2',
              title: 'Cấp độ A2: Nâng cao & Phản xạ',
              desc: 'Quá khứ Perfekt, Modalverben, mệnh đề phụ weil/dass, viết thư',
              pct: levelStats.A2.pct,
              color: 'from-emerald-500 to-emerald-600',
            },
          ].map((lvl) => (
            <div
              key={lvl.id}
              onClick={() => onNavigate('learn')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer space-y-2 bg-slate-50/50"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-700">{lvl.id}</span>
                <span className="font-bold text-amber-700">{lvl.pct}%</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{lvl.title}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{lvl.desc}</p>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${lvl.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${lvl.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. QUICK LEARNING MODULES (SRS Reviews, Mistakes, Word of the day, AI Coach) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Spaced Repetition Card */}
        <div
          onClick={() => onNavigate('vocab')}
          className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-3xl border border-blue-200/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
                <RotateCcw className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full">
                SRS Leitner
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              Ôn tập từ vựng ngắt quãng
            </h4>
            <p className="text-xs text-slate-600">
              {reviewCards.length > 0
                ? `Bạn có ${reviewCards.length} từ cần ôn tập hôm nay để khắc sâu vào trí nhớ dài hạn.`
                : 'Bạn đã ôn tập hết các từ đến hạn. Tuyệt vời! Bấm vào để luyện thêm Flashcards.'}
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-blue-700 gap-1">
            <span>Mở Flashcards ({VOCABULARY_LIST.length} từ vựng)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Sổ tay Lỗi sai (Mistakes Notebook) */}
        <div
          onClick={() => onNavigate('mistakes')}
          className="p-5 bg-gradient-to-br from-red-50 to-orange-50/40 rounded-3xl border border-red-200/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-red-200 text-red-900 rounded-full">
                {mistakesCount} lỗi cần sửa
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              Sổ tay Lỗi sai Cá nhân
            </h4>
            <p className="text-xs text-slate-600">
              Tự động lưu các câu làm sai (quán từ der/die/das, vị trí từ, ngữ pháp) kèm giải thích tiếng Việt để bạn làm lại đến khi thành thạo.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-red-700 gap-1">
            <span>Luyện tập lại lỗi sai ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Word of the Day */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Từ vựng của ngày
            </span>
            <button
              onClick={() =>
                speechService.speak(
                  wordOfTheDay.article && wordOfTheDay.article !== 'none'
                    ? `${wordOfTheDay.article} ${wordOfTheDay.german}`
                    : wordOfTheDay.german
                )
              }
              className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg transition-colors"
              title="Phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {wordOfTheDay.article && wordOfTheDay.article !== 'none' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                    wordOfTheDay.article === 'der'
                      ? 'bg-blue-100 text-blue-700'
                      : wordOfTheDay.article === 'die'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {wordOfTheDay.article}
                </span>
              )}
              <span className="text-xl font-black text-slate-900">
                {wordOfTheDay.german}
              </span>
              <span className="text-xs font-mono text-amber-700">
                {wordOfTheDay.pronunciation}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              {wordOfTheDay.vietnamese}
            </p>
            {wordOfTheDay.exampleSentence && (
              <p className="text-xs text-slate-500 italic mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                💬 {wordOfTheDay.exampleSentence}
              </p>
            )}
          </div>
        </div>

        {/* AI German Tutor & Writing Corrector */}
        <div
          onClick={() => onNavigate('tutor')}
          className="p-5 bg-gradient-to-br from-purple-50 to-pink-50/40 rounded-3xl border border-purple-200/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-purple-600 text-white rounded-xl shadow-sm">
                <Bot className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full">
                AI Chữa Bài Viết & Gia sư
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              Gia sư & Chấm bài viết thư AI
            </h4>
            <p className="text-xs text-slate-600">
              Chấm điểm email/thư A1-A2, sửa từng câu chuẩn bản xứ và giải thích ngữ pháp 4 cách (Kasus).
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-purple-700 gap-1">
            <span>Mở Gia sư & Chữa bài viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* MODALS */}
      <PhoneticsGuideModal
        isOpen={isPhoneticsOpen}
        onClose={() => setIsPhoneticsOpen(false)}
      />

      <AdjektivAndPrepositionMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />

      <MockExamModal
        isOpen={isMockExamOpen}
        onClose={() => setIsMockExamOpen(false)}
      />
    </div>
  );
};
