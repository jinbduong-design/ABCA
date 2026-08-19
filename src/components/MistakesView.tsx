import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  Layers,
  BookOpen,
  Filter
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { MistakeItem } from '../types';
import { speechService } from '../services/speechService';

export const MistakesView: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Practice Mode State
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = () => {
    setMistakes(storageService.getMistakes());
  };

  const handleDelete = (id: string) => {
    storageService.removeMistake(id);
    loadMistakes();
  };

  const handleClearAll = () => {
    storageService.clearAllMistakes();
    loadMistakes();
  };

  const filteredMistakes = (mistakes || []).filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const handleStartPractice = () => {
    if (filteredMistakes.length === 0) return;
    setIsPracticing(true);
    setCurrentIdx(0);
    setPracticeInput('');
    setIsAnswerChecked(false);
    setIsCorrect(null);
  };

  const handleCheckPractice = () => {
    const item = filteredMistakes[currentIdx];
    if (!item || isAnswerChecked) return;

    const cleanInput = practiceInput.trim().toLowerCase();
    const cleanCorrect = item.correctAnswer.trim().toLowerCase();

    const correct = cleanInput === cleanCorrect;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      // Remove from mistakes since mastered
      storageService.removeMistake(item.id);
    }
  };

  const handleNextPractice = () => {
    if (currentIdx + 1 < filteredMistakes.length) {
      setCurrentIdx((p) => p + 1);
      setPracticeInput('');
      setIsAnswerChecked(false);
      setIsCorrect(null);
    } else {
      setIsPracticing(false);
      loadMistakes();
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'article', label: 'Quán từ der/die/das' },
    { id: 'grammar', label: 'Ngữ pháp' },
    { id: 'sentence_order', label: 'Vị trí từ' },
    { id: 'vocabulary', label: 'Từ vựng' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <AlertCircle className="w-7 h-7 text-red-600" />
            Sổ Tay Lỗi Sai (Mistakes Notebook)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi lại mọi câu làm chưa đúng để phân tích nguyên nhân và luyện tập lại đến khi thành thạo.
          </p>
        </div>

        {mistakes.length > 0 && !isPracticing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartPractice}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Luyện tập lại ngay ({filteredMistakes.length})
            </button>
            <button
              onClick={handleClearAll}
              className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors border border-slate-200"
              title="Xóa tất cả lỗi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      {!isPracticing && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* ======================================================================= */}
      {/* PRACTICE MODE */}
      {/* ======================================================================= */}
      {isPracticing && filteredMistakes[currentIdx] ? (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Luyện lại câu sai {currentIdx + 1} / {filteredMistakes.length}
            </span>
            <button
              onClick={() => {
                setIsPracticing(false);
                loadMistakes();
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Thoát luyện tập ✕
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {filteredMistakes[currentIdx].question}
            </h3>

            <input
              type="text"
              placeholder="Gõ đáp án chính xác vào đây..."
              disabled={isAnswerChecked}
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!isAnswerChecked) handleCheckPractice();
                  else handleNextPractice();
                }
              }}
              className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {isAnswerChecked && (
            <div
              className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Xuất sắc! Bạn đã sửa đúng lỗi này.
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" /> Vẫn chưa đúng rồi.
                  </>
                )}
              </div>
              <p className="font-semibold text-slate-800">
                Đáp án chuẩn:{' '}
                <strong className="text-emerald-700">
                  {filteredMistakes[currentIdx].correctAnswer}
                </strong>
              </p>
              <p className="text-slate-600">
                {filteredMistakes[currentIdx].explanation}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            {!isAnswerChecked ? (
              <button
                disabled={!practiceInput.trim()}
                onClick={handleCheckPractice}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Kiểm tra lại
              </button>
            ) : (
              <button
                onClick={handleNextPractice}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
              >
                {currentIdx + 1 < filteredMistakes.length ? 'Câu tiếp theo' : 'Hoàn tất'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* ======================================================================= */}
      {/* MISTAKES LIST VIEW */}
      {/* ======================================================================= */}
      {!isPracticing && (
        <div className="space-y-3">
          {filteredMistakes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="font-bold text-slate-700 text-base">
                Sổ tay sạch bóng lỗi sai!
              </p>
              <p className="text-xs">
                Khi bạn làm bài tập hoặc mini test, nếu có câu nào chưa đúng sẽ được tự động lưu vào đây để ôn luyện.
              </p>
            </div>
          ) : (
            filteredMistakes.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      {item.category === 'article'
                        ? 'Quán từ der/die/das'
                        : item.category === 'sentence_order'
                        ? 'Vị trí từ'
                        : item.category === 'vocabulary'
                        ? 'Từ vựng'
                        : 'Ngữ pháp'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">
                      {item.question}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Xóa lỗi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <p className="text-red-700">
                    ❌ Bạn đã chọn: <del className="font-semibold">{item.userAnswer}</del>
                  </p>
                  <p className="text-emerald-700 font-bold">
                    👉 Đáp án đúng: {item.correctAnswer}
                  </p>
                  <p className="text-slate-600 italic pt-1">{item.explanation}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
