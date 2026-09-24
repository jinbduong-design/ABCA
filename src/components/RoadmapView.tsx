import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Play,
  Target,
} from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { Lesson, UserProgress } from '../types';

interface RoadmapViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

type Level = 'A0' | 'A1' | 'A2';

const shortLevelNames: Record<Level, string> = {
  A0: 'Khởi đầu',
  A1: 'Căn bản',
  A2: 'Phản xạ',
};

const skillLabel = (lesson: Lesson) => {
  const value = `${lesson.titleVietnamese} ${lesson.description}`.toLowerCase();
  if (/phát âm|âm |bảng chữ|pronunciation|alphabet/.test(value)) return 'Phát âm';
  if (/ngữ pháp|akkusativ|dativ|động từ|quán từ|câu|perfekt|modal/.test(value)) return 'Ngữ pháp';
  if (/từ vựng|số đếm|gia đình|đồ ăn|mua sắm|nhà cửa/.test(value)) return 'Từ vựng';
  if (/hội thoại|chào hỏi|giới thiệu|giao tiếp|nói|đặt phòng|hỏi đường/.test(value)) return 'Giao tiếp';
  return 'Tổng hợp';
};

const objectiveForTopic = (topicTitle: string, description: string) => {
  const clean = description.trim().replace(/\.$/, '');
  if (clean.length > 0 && clean.length <= 105) return clean;
  return `Nắm chắc ${topicTitle.toLowerCase()} và dùng được trong bài tập cơ bản`;
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({ progress, onSelectLesson }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(progress.currentLevel || 'A0');
  const course = COURSES_DATA[selectedLevel] || COURSES_DATA.A0;
  const completedLessons = progress.completedLessons || [];

  const summary = useMemo(() => {
    const allLessons = course.topics.flatMap((topic) => topic.lessons);
    const completed = allLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
    const next = allLessons.find((lesson) => !completedLessons.includes(lesson.id)) || null;
    const nextTopic = next ? course.topics.find((topic) => topic.id === next.topicId) || null : null;
    return {
      total: allLessons.length,
      completed,
      percent: allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0,
      next,
      nextTopic,
    };
  }, [course, completedLessons]);

  const [expandedTopics, setExpandedTopics] = useState<string[]>(() => {
    const firstPending = course.topics.find((topic) => topic.lessons.some((lesson) => !completedLessons.includes(lesson.id)));
    return firstPending ? [firstPending.id] : course.topics[0] ? [course.topics[0].id] : [];
  });

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((current) => current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId]);
  };

  const selectLevel = (level: Level) => {
    setSelectedLevel(level);
    const targetCourse = COURSES_DATA[level];
    const pending = targetCourse.topics.find((topic) => topic.lessons.some((lesson) => !completedLessons.includes(lesson.id)));
    setExpandedTopics(pending ? [pending.id] : targetCourse.topics[0] ? [targetCourse.topics[0].id] : []);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
      <header className="mb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Lộ trình</p>
        <h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Biết mình đang ở đâu và học gì tiếp theo</h1>
      </header>

      <div className="mb-4 grid grid-cols-3 rounded-2xl bg-slate-100 p-1">
        {(['A0', 'A1', 'A2'] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => selectLevel(level)}
            className={`min-h-11 rounded-xl px-2 text-sm font-black transition ${selectedLevel === level ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
          >
            {level}<span className="ml-1 hidden text-[10px] font-bold text-slate-400 min-[390px]:inline">{shortLevelNames[level]}</span>
          </button>
        ))}
      </div>

      <section className="rounded-[26px] bg-slate-950 p-5 text-white shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">{selectedLevel} · {shortLevelNames[selectedLevel]}</p>
            <h2 className="mt-1.5 text-2xl font-black leading-tight tracking-[-0.025em]">{course.title.replace(/^A[0-2]\s*[–—-]\s*/i, '')}</h2>
            {summary.next && (
              <p className="mt-3 text-xs font-semibold text-slate-300">Bạn đang ở: <span className="text-white">{summary.nextTopic?.titleVietnamese} · {summary.next.titleVietnamese}</span></p>
            )}
          </div>
          <div className="shrink-0 text-right"><p className="text-2xl font-black text-amber-400">{summary.percent}%</p><p className="text-[11px] font-bold text-slate-400">{summary.completed}/{summary.total} bài</p></div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${summary.percent}%` }} /></div>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-white/[0.06] px-4 py-3">
          <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">Tiếp theo</p><p className="mt-0.5 truncate text-sm font-bold text-white">{summary.next ? summary.next.titleVietnamese : 'Đã hoàn thành cấp độ'}</p></div>
          {summary.next && <button onClick={() => onSelectLesson(summary.next!.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-950"><Play className="ml-0.5 h-3.5 w-3.5 fill-current" /></button>}
        </div>
      </section>

      <div className="mt-7 space-y-3">
        {course.topics.map((topic, topicIndex) => {
          const done = topic.lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
          const complete = done === topic.lessons.length;
          const expanded = expandedTopics.includes(topic.id);
          const nextInTopic = topic.lessons.find((lesson) => !completedLessons.includes(lesson.id));
          const isCurrentTopic = summary.nextTopic?.id === topic.id;

          return (
            <section key={topic.id} className={`overflow-hidden rounded-[22px] border bg-white shadow-sm ${isCurrentTopic ? 'border-amber-200' : 'border-black/[0.06]'}`}>
              <button type="button" onClick={() => toggleTopic(topic.id)} className="flex w-full items-start gap-3 p-4 text-left sm:p-5">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black ${complete ? 'bg-emerald-50 text-emerald-700' : isCurrentTopic ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{complete ? <Check className="h-4 w-4" /> : String(topicIndex + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-black text-slate-950 sm:text-[15px]">{topic.titleVietnamese}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500"><span className="font-bold text-slate-400">Mục tiêu:</span> {objectiveForTopic(topic.titleVietnamese, topic.description)}</p></div><span className="shrink-0 text-xs font-black text-slate-400">{done}/{topic.lessons.length}</span></div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${complete ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${topic.lessons.length ? (done / topic.lessons.length) * 100 : 0}%` }} /></div>
                </div>
                <span className="mt-0.5 text-slate-300">{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</span>
              </button>

              {expanded && (
                <div className="border-t border-slate-100 px-3 pb-3 sm:px-4 sm:pb-4">
                  {topic.lessons.map((lesson, lessonIndex) => {
                    const completed = completedLessons.includes(lesson.id);
                    const current = summary.next?.id === lesson.id;
                    const skill = skillLabel(lesson);
                    return (
                      <button key={lesson.id} type="button" onClick={() => onSelectLesson(lesson.id)} className={`mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition sm:px-4 ${current ? 'bg-amber-50 ring-1 ring-amber-100' : 'hover:bg-slate-50'}`}>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-black ${completed ? 'bg-emerald-50 text-emerald-700' : current ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>{completed ? <Check className="h-3.5 w-3.5" /> : lessonIndex + 1}</span>
                        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className={`truncate text-sm font-bold ${completed ? 'text-slate-500' : 'text-slate-900'}`}>{lesson.titleVietnamese}</p>{current && <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase text-amber-700 min-[420px]:inline">Tiếp theo</span>}</div><div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-400"><span>{skill}</span><span>·</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{lesson.estimatedMinutes}p</span></div></div>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${completed ? 'bg-emerald-50 text-emerald-600' : current ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>{completed ? <Check className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3 w-3 fill-current" />}</span>
                      </button>
                    );
                  })}
                  {nextInTopic && !isCurrentTopic && done > 0 && <div className="mt-2 flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-400"><Target className="h-3.5 w-3.5" />Mốc tiếp theo: {nextInTopic.titleVietnamese}</div>}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
