import React, { useState } from 'react';
import { CheckCircle2, Lock, Play, Clock, Sparkles, BookOpen, ChevronRight, Award } from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { UserProgress } from '../types';

interface RoadmapViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progress,
  onSelectLesson,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'A0' | 'A1' | 'A2'>(
    progress.currentLevel || 'A0'
  );

  const course = COURSES_DATA[selectedLevel] || COURSES_DATA['A0'];
  const completedList = progress?.completedLessons || [];

  // Calculate Level Stats
  let totalLessons = 0;
  let completedCount = 0;
  course.topics.forEach((t) => {
    t.lessons.forEach((l) => {
      totalLessons++;
      if (completedList.includes(l.id)) completedCount++;
    });
  });

  const completionRate = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Level Tabs Switcher */}
      <div className="flex items-center justify-center p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto border border-slate-200">
        {(['A0', 'A1', 'A2'] as const).map((lvl) => {
          const isActive = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{lvl}</span>
              <span className="text-[11px] font-medium text-slate-400">
                {lvl === 'A0' ? 'Vỡ lòng' : lvl === 'A1' ? 'Căn bản' : 'Nâng cao'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level Overview Header */}
      <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl border border-slate-700 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-md">
              Cấp độ {course.level}
            </span>
            <span className="text-xs text-slate-400">
              {course.topics.length} chủ đề • {totalLessons} bài học
            </span>
          </div>
          <h2 className="text-2xl font-black">{course.title}</h2>
          <p className="text-sm text-slate-300 max-w-xl">{course.description}</p>
        </div>

        {/* Progress Circular Badge */}
        <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shrink-0">
          <div className="text-center">
            <p className="text-2xl font-black text-amber-400">{completionRate}%</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Đã hoàn thành</p>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-xs text-slate-300">
            <p>
              <strong className="text-white">{completedCount}</strong> / {totalLessons} bài
            </p>
            <p className="text-slate-400 text-[11px]">Tiến độ học</p>
          </div>
        </div>
      </div>

      {/* Topics & Lessons Roadmap Path */}
      <div className="space-y-6">
        {course.topics.map((topic, topicIdx) => {
          const topicLessonsCompleted = topic.lessons.filter((l) =>
            completedList.includes(l.id)
          ).length;
          const isTopicFinished = topicLessonsCompleted === topic.lessons.length;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4"
            >
              {/* Topic Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                      isTopicFinished
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {topicIdx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {topic.titleVietnamese}
                    </h3>
                    <p className="text-xs text-slate-400">{topic.title}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  {topicLessonsCompleted} / {topic.lessons.length} bài hoàn thành
                </span>
              </div>

              {/* Lessons List in Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {topic.lessons.map((lesson, lessonIdx) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                          : 'bg-slate-50 border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="space-y-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isCompleted
                                ? 'bg-emerald-200 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            Bài {lessonIdx + 1}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {lesson.estimatedMinutes}p
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                          {lesson.titleVietnamese}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isCompleted ? (
                          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 flex items-center justify-center shadow-sm transition-colors">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
