import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { MistakeItem } from '../types';

const categoryLabel = (category: string) => {
  if (category === 'article') return 'Quán từ';
  if (category === 'grammar') return 'Ngữ pháp';
  if (category === 'sentence_order') return 'Vị trí từ';
  if (category === 'vocabulary') return 'Từ vựng';
  return 'Khác';
};

export const MistakesView: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const loadMistakes = () => setMistakes(storageService.getMistakes());
  useEffect(() => { loadMistakes(); }, []);

  const filteredMistakes = mistakes.filter((mistake) => selectedCategory === 'all' || mistake.category === selectedCategory);

  const handleDelete = (id: string) => {
    storageService.removeMistake(id);
    loadMistakes();
  };

  const handleClearAll = () => {
    storageService.clearAllMistakes();
    loadMistakes();
  };

  const handleStartPractice = () => {
    if (!filteredMistakes.length) return;
    setIsPracticing(true);
    setCurrentIdx(0);
    setPracticeInput('');
    setIsAnswerChecked(false);
    setIsCorrect(null);
  };

  const handleCheckPractice = () => {
    const item = filteredMistakes[currentIdx];
    if (!item || isAnswerChecked) return;
    const correct = practiceInput.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    if (correct) storageService.removeMistake(item.id);
  };

  const handleNextPractice = () => {
    if (currentIdx + 1 < filteredMistakes.length) {
      setCurrentIdx((index) => index + 1);
      setPracticeInput('');
      setIsAnswerChecked(false);
      setIsCorrect(null);
      return;
    }
    setIsPracticing(false);
    loadMistakes();
  };

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'article', label: 'Quán từ' },
    { id: 'grammar', label: 'Ngữ pháp' },
    { id: 'sentence_order', label: 'Vị trí từ' },
    { id: 'vocabulary', label: 'Từ vựng' },
  ];

  if (isPracticing && filteredMistakes[currentIdx]) {
    const item = filteredMistakes[currentIdx];
    return (
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
        <div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-red-600">Luyện lỗi {currentIdx + 1}/{filteredMistakes.length}</p><h1 className="mt-1 text-2xl font-black text-slate-950">Làm lại câu này</h1></div><button onClick={() => { setIsPracticing(false); loadMistakes(); }} className="min-h-10 rounded-xl px-3 text-xs font-black text-slate-400">Thoát</button></div>
        <section className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6"><span className="rounded-lg bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-700">{categoryLabel(item.category)}</span><h2 className="mt-4 text-lg font-black leading-7 text-slate-950">{item.question}</h2><input value={practiceInput} onChange={(e) => setPracticeInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') isAnswerChecked ? handleNextPractice() : handleCheckPractice(); }} disabled={isAnswerChecked} placeholder="Gõ đáp án…" className="mt-5 min-h-12 w-full rounded-xl bg-[#f7f7f5] px-4 text-sm font-bold outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-red-300" />{isAnswerChecked && <div className={`mt-4 rounded-2xl p-4 text-xs leading-5 ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}><p className="flex items-center gap-1.5 font-black">{isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{isCorrect ? 'Đúng rồi' : 'Chưa đúng'}</p><p className="mt-1"><span className="font-black">Đáp án:</span> {item.correctAnswer}</p><p className="mt-1 text-slate-600">{item.explanation}</p></div>}<div className="mt-5 flex justify-end">{!isAnswerChecked ? <button disabled={!practiceInput.trim()} onClick={handleCheckPractice} className="min-h-11 rounded-xl bg-slate-950 px-5 text-xs font-black text-white disabled:opacity-30">Kiểm tra</button> : <button onClick={handleNextPractice} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-black text-white">{currentIdx + 1 < filteredMistakes.length ? 'Câu tiếp' : 'Hoàn tất'}<ArrowRight className="h-4 w-4" /></button>}</div></section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
      <header className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">Sổ lỗi</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Lỗi cần ôn · {mistakes.length}</h1></div>{mistakes.length > 0 && <button onClick={handleStartPractice} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"><RotateCcw className="h-4 w-4" />Luyện lại</button>}</header>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{categories.map((category) => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`min-h-9 shrink-0 rounded-xl px-3 text-xs font-black ${selectedCategory === category.id ? 'bg-red-600 text-white' : 'bg-white text-slate-500 ring-1 ring-black/[0.06]'}`}>{category.label}</button>)}</div>

      {filteredMistakes.length === 0 ? <div className="mt-6 rounded-[24px] border border-dashed border-slate-200 bg-white py-16 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" /><p className="mt-3 text-sm font-black text-slate-700">Không có lỗi trong nhóm này</p><p className="mt-1 text-xs text-slate-400">Lỗi mới sẽ tự xuất hiện sau khi làm bài.</p></div> : <div className="mt-5 space-y-2">{filteredMistakes.map((item) => <article key={item.id} className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-sm"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-black text-red-700">{categoryLabel(item.category)}</span></div><h2 className="mt-2 text-sm font-black leading-6 text-slate-950">{item.question}</h2><div className="mt-3 grid gap-1 text-xs"><p className="text-red-600"><span className="font-black">Sai:</span> {item.userAnswer}</p><p className="text-emerald-700"><span className="font-black">Đúng:</span> {item.correctAnswer}</p><details className="mt-1 text-slate-500"><summary className="cursor-pointer font-bold">Vì sao?</summary><p className="mt-1 leading-5">{item.explanation}</p></details></div></div><button onClick={() => handleDelete(item.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></article>)}</div>}

      {mistakes.length > 0 && <div className="mt-8 flex items-center justify-between rounded-2xl bg-red-50/60 px-4 py-3"><div className="flex items-center gap-2 text-xs font-bold text-red-800"><AlertCircle className="h-4 w-4" />Chỉ xóa toàn bộ khi bạn muốn làm mới sổ lỗi.</div><button onClick={handleClearAll} className="min-h-9 rounded-xl px-3 text-xs font-black text-red-700">Xóa hết</button></div>}
    </div>
  );
};
