import React, { useMemo } from 'react';
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
  Layers
} from 'lucide-react';
import { UserProgress, Lesson } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

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
    const dayIndex = new Date().getDate() % VOCABULARY_LIST.length;
    return VOCABULARY_LIST[dayIndex] || VOCABULARY_LIST[0];
  }, []);

  // Level Completion Percentages
  const levelStats = useMemo(() => {
    const stats = { A0: 0, A1: 0, A2: 0 };
    const completedList = progress?.completedLessons || [];
    (['A0', 'A1', 'A2'] as const).forEach((lvl) => {
      const course = COURSES_DATA[lvl];
      let total = 0;
      let completed = 0;
      course.topics.forEach((t) => {
        t.lessons.forEach((l) => {
          total++;
          if (completedList.includes(l.id)) completed++;
        });
      });
      stats[lvl] = total > 0 ? Math.round((completed / total) * 100) : 0;
    });
    return stats;
  }, [progress]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Welcome & Motivational Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 p-6 rounded-3xl border border-amber-200/80 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
              Lộ trình chuẩn A0 → A2
            </span>
            <span className="text-xs font-semibold">Trình độ hiện tại: {progress?.currentLevel || 'A0'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Guten Tag! Chào bạn 👋
          </h1>
          <p className="text-sm text-slate-600">
            Hôm nay bạn đã sẵn sàng nạp thêm tiếng Đức chưa? Hãy duy trì chuỗi học mỗi ngày!
          </p>
        </div>

        {/* 20-Minute Focus Session Button */}
        <button
          onClick={onOpenDailySession}
          className="shrink-0 px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>Phiên học 20 phút hôm nay</span>
        </button>
      </div>

      {/* PRIMARY CTA: CONTINUE LEARNING NEXT LOGICAL LESSON */}
      <div className="relative overflow-hidden bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-xs uppercase rounded-md tracking-wider">
                Bài học tiếp theo
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {nextLessonInfo.topicTitle} • Cấp độ {nextLessonInfo.levelId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {nextLessonInfo.lesson.titleVietnamese}
            </h2>
            <p className="text-sm text-slate-300 line-clamp-2">
              {nextLessonInfo.lesson.title} – {nextLessonInfo.lesson.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span>⏱️ {nextLessonInfo.lesson.estimatedMinutes || 15} phút</span>
              <span>•</span>
              <span>📚 {nextLessonInfo.lesson.stepLearn?.vocabItems?.length || 0} từ vựng</span>
              <span>•</span>
              <span>✍️ {nextLessonInfo.lesson.stepPractice?.length || 0} bài tập</span>
            </div>
          </div>

          <button
            onClick={() => onStartLesson(nextLessonInfo.lesson.id)}
            className="px-7 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>TIẾP TỤC HỌC BÀI NÀY</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Streak */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Chuỗi học</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {progress?.streakDays || 0} <span className="text-xs font-normal text-slate-400">ngày</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Học đều mỗi ngày 🔥</p>
        </div>

        {/* Lessons Completed */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Đã hoàn thành</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {(progress?.completedLessons || []).length}{' '}
            <span className="text-xs font-normal text-slate-400">bài</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Lộ trình bài bản</p>
        </div>

        {/* Words Mastered */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Từ vựng</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {progress?.wordsLearned || 0}{' '}
            <span className="text-xs font-normal text-slate-400">từ</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Kèm mạo từ & âm chuẩn</p>
        </div>

        {/* Study Time */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Thời gian học</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {progress?.totalStudyMinutes || 0}{' '}
            <span className="text-xs font-normal text-slate-400">phút</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Mục tiêu 15-20p/ngày</p>
        </div>
      </div>

      {/* ROADMAP PROGRESS AT A GLANCE (A0, A1, A2) */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Tiến độ theo cấp độ (A0 - A1 - A2)</h3>
            <p className="text-xs text-slate-400">Từng bước vững chắc từ vỡ lòng đến giao tiếp</p>
          </div>
          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Xem lộ trình <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              level: 'A0',
              title: 'Vỡ lòng cơ bản',
              desc: 'Chữ cái, phát âm, số đếm, chào hỏi, sein & haben',
              pct: levelStats['A0'],
              color: 'from-blue-500 to-cyan-500',
              bg: 'bg-blue-50 text-blue-800',
            },
            {
              level: 'A1',
              title: 'Giao tiếp hàng ngày',
              desc: 'Gia đình, mua sắm, ăn uống, đi lại, Akkusativ, Dativ',
              pct: levelStats['A1'],
              color: 'from-amber-500 to-orange-500',
              bg: 'bg-amber-50 text-amber-800',
            },
            {
              level: 'A2',
              title: 'Độc lập & Thực chiến',
              desc: 'Quá khứ Perfekt, Modalverben, công sở, bác sĩ',
              pct: levelStats['A2'],
              color: 'from-emerald-500 to-teal-500',
              bg: 'bg-emerald-50 text-emerald-800',
            },
          ].map((lvl) => (
            <div
              key={lvl.level}
              onClick={() => onNavigate('learn')}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded font-black uppercase ${lvl.bg}`}>
                  Cấp độ {lvl.level}
                </span>
                <span className="text-xs font-bold text-slate-700">{lvl.pct}%</span>
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

      {/* QUICK LEARNING MODULES (SRS Reviews, Mistakes, Word of the day, AI Coach) */}
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

        {/* AI German Tutor Assistant */}
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
                AI Coach 24/7
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              Gia sư AI Tiếng Đức thông minh
            </h4>
            <p className="text-xs text-slate-600">
              Hỏi đáp mọi thắc mắc ngữ pháp, phân tích lỗi sai trong câu viết, luyện đàm thoại theo chủ đề thực tế.
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-purple-700 gap-1">
            <span>Trò chuyện với Gia sư AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
