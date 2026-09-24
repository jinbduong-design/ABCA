import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { GRAMMAR_LIBRARY } from '../data/grammarData';
import { Exercise, GrammarLesson } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

const difficultyLabel = {
  easy: 'Nền tảng',
  medium: 'Cốt lõi',
  hard: 'Nâng cao',
};

export const GrammarView: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [testQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const filteredGrammar = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return GRAMMAR_LIBRARY.filter((lesson) => {
      if (query && !`${lesson.title} ${lesson.germanTitle} ${lesson.vietnameseExplanation}`.toLowerCase().includes(query)) return false;
      if (selectedDifficulty !== 'all' && lesson.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [searchQuery, selectedDifficulty]);

  const grouped = useMemo(() => (['A0', 'A1', 'A2'] as const).map((level) => ({
    level,
    lessons: filteredGrammar.filter((lesson) => lesson.level === level),
  })).filter((group) => group.lessons.length > 0), [filteredGrammar]);

  const handleSelectGrammar = (lesson: GrammarLesson) => {
    setSelectedLesson(lesson);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
  };

  const answerText = (answer: string | string[]) => Array.isArray(answer) ? answer[0] || '' : answer;

  const handleCheckGrammarQuestion = (correctAnswer: string | string[], question: Exercise) => {
    if (!selectedOption || isAnswerSubmitted) return;
    const correct = answerText(correctAnswer);
    const ok = selectedOption.toLowerCase().trim() === correct.toLowerCase().trim();
    setIsAnswerCorrect(ok);
    setIsAnswerSubmitted(true);
    if (!ok) {
      storageService.saveMistake({
        questionId: question.id,
        category: 'grammar',
        question: question.question,
        userAnswer: selectedOption,
        correctAnswer: correct,
        explanation: question.explanation || 'Xem lại quy tắc ngữ pháp tương ứng.',
        lessonId: selectedLesson?.id,
      });
    }
  };

  if (selectedLesson) {
    const question = selectedLesson.practiceQuestions?.[testQuestionIdx];
    const correctAnswer = question ? answerText(question.correctAnswer) : '';

    return (
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
        <button onClick={() => setSelectedLesson(null)} className="mb-5 inline-flex min-h-10 items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-950"><ArrowLeft className="h-4 w-4" />Tất cả ngữ pháp</button>

        <section className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800">{selectedLesson.level}</span><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">{difficultyLabel[selectedLesson.difficulty]}</span></div>
          <h1 className="mt-4 text-2xl font-black tracking-[-0.025em] text-slate-950 sm:text-3xl">{selectedLesson.title}</h1>
          <p className="mt-1 text-sm font-bold text-slate-400">{selectedLesson.germanTitle}</p>
          <p className="mt-5 text-sm leading-6 text-slate-600">{selectedLesson.vietnameseExplanation}</p>

          {selectedLesson.formula && <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm font-bold leading-6 text-white"><p className="mb-1 text-[10px] font-black uppercase tracking-[0.15em] text-amber-400">Công thức</p><pre className="whitespace-pre-wrap font-sans">{selectedLesson.formula}</pre></div>}

          <div className="mt-6"><p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Ví dụ</p><div className="mt-2 space-y-2">{selectedLesson.examples.map((example, index) => <div key={index} className="flex items-center gap-3 rounded-2xl bg-[#f7f7f5] px-4 py-3"><div className="min-w-0 flex-1"><p className="text-sm font-black text-slate-900">{example.german}</p><p className="mt-0.5 text-xs text-slate-500">{example.vietnamese}</p></div><button onClick={() => speechService.speak(example.german)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500"><Volume2 className="h-4 w-4" /></button></div>)}</div></div>

          {selectedLesson.commonMistakes?.length > 0 && <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/60 p-4"><p className="flex items-center gap-2 text-xs font-black text-red-800"><AlertTriangle className="h-4 w-4" />Lỗi hay gặp</p><div className="mt-3 space-y-3">{selectedLesson.commonMistakes.map((mistake, index) => <div key={index} className="text-xs leading-5"><p className="text-red-600 line-through">{mistake.wrong}</p><p className="font-black text-emerald-700">{mistake.correct}</p><p className="text-slate-500">{mistake.reason}</p></div>)}</div></div>}
        </section>

        {question && <section className="mt-4 rounded-[24px] border border-amber-100 bg-amber-50/50 p-5 sm:p-6"><div className="flex items-center gap-2 text-xs font-black text-amber-800"><Sparkles className="h-4 w-4" />Luyện ngay</div><h2 className="mt-3 text-base font-black text-slate-950">{question.question}</h2>{question.options && <div className="mt-4 grid gap-2 sm:grid-cols-2">{question.options.map((option) => { const selected = selectedOption === option; const right = isAnswerSubmitted && option.toLowerCase().trim() === correctAnswer.toLowerCase().trim(); const wrong = isAnswerSubmitted && selected && !right; return <button key={option} disabled={isAnswerSubmitted} onClick={() => setSelectedOption(option)} className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-left text-xs font-black transition ${right ? 'border-emerald-500 bg-emerald-500 text-white' : wrong ? 'border-red-500 bg-red-500 text-white' : selected ? 'border-slate-950 bg-slate-950 text-white' : 'border-black/[0.06] bg-white text-slate-700'}`}>{option}{right && <Check className="h-4 w-4" />}</button>; })}</div>}{isAnswerSubmitted && <div className={`mt-3 rounded-xl p-3 text-xs leading-5 ${isAnswerCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}><p className="font-black">{isAnswerCorrect ? 'Chính xác' : 'Chưa đúng'}</p><p>{question.explanation}</p></div>}<div className="mt-4 flex justify-end">{!isAnswerSubmitted ? <button disabled={!selectedOption} onClick={() => handleCheckGrammarQuestion(question.correctAnswer, question)} className="min-h-10 rounded-xl bg-slate-950 px-5 text-xs font-black text-white disabled:opacity-30">Kiểm tra</button> : <button onClick={() => { setSelectedOption(null); setIsAnswerSubmitted(false); setIsAnswerCorrect(null); }} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-black text-white"><RotateCcw className="h-3.5 w-3.5" />Làm lại</button>}</div></section>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
      <header><p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Ngữ pháp</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Học theo quy tắc, không theo bức tường chữ</h1></header>

      <section className="mt-5 rounded-[22px] border border-black/[0.06] bg-white p-3 shadow-sm sm:p-4"><div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm: Dativ, động từ, vị trí từ..." className="min-h-11 w-full rounded-xl bg-[#f7f7f5] pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400" /></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{(['all', 'easy', 'medium', 'hard'] as const).map((value) => <button key={value} onClick={() => setSelectedDifficulty(value)} className={`min-h-9 shrink-0 rounded-xl px-3 text-xs font-black ${selectedDifficulty === value ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>{value === 'all' ? 'Tất cả' : difficultyLabel[value]}</button>)}</div></section>

      <div className="mt-6 space-y-7">{grouped.map((group) => <section key={group.level}><div className="mb-3 flex items-end justify-between px-1"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Cấp độ</p><h2 className="text-lg font-black text-slate-950">{group.level}</h2></div><span className="text-xs font-bold text-slate-400">{group.lessons.length} chủ điểm</span></div><div className="grid gap-2 sm:grid-cols-2">{group.lessons.map((lesson, index) => <button key={lesson.id} onClick={() => handleSelectGrammar(lesson)} className="flex min-h-[92px] items-start gap-3 rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm transition hover:border-amber-200"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-50 text-[11px] font-black text-amber-800">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-black text-slate-950">{lesson.title}</p></div><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{lesson.germanTitle} · {difficultyLabel[lesson.difficulty]}</p></div></button>)}</div></section>)}</div>

      {filteredGrammar.length === 0 && <div className="mt-6 rounded-[22px] border border-dashed border-slate-200 bg-white py-14 text-center text-sm font-bold text-slate-400"><BookOpen className="mx-auto mb-2 h-6 w-6" />Không tìm thấy chủ điểm phù hợp.</div>}
    </div>
  );
};
