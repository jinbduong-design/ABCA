import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Play,
  Check,
  RotateCcw
} from 'lucide-react';
import { GRAMMAR_LIBRARY } from '../data/grammarData';
import { GrammarLesson, Exercise } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

export const GrammarView: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Test mode inside selected grammar lesson
  const [testQuestionIdx, setTestQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const filteredGrammar = GRAMMAR_LIBRARY.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    if (q && !g.title.toLowerCase().includes(q) && !g.vietnameseExplanation.toLowerCase().includes(q) && !g.germanTitle.toLowerCase().includes(q)) {
      return false;
    }
    if (selectedDifficulty !== 'all' && g.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const handleSelectGrammar = (lesson: GrammarLesson) => {
    setSelectedLesson(lesson);
    setTestQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
  };

  const handleCheckGrammarQuestion = (correctAnswer: string | string[], question: Exercise) => {
    if (!selectedOption || isAnswerSubmitted) return;

    const correctAnsStr = Array.isArray(correctAnswer) ? correctAnswer[0] || '' : correctAnswer;
    const isCorrect = selectedOption.toLowerCase().trim() === correctAnsStr.toLowerCase().trim();
    setIsAnswerCorrect(isCorrect);
    setIsAnswerSubmitted(true);

    if (!isCorrect) {
      storageService.saveMistake({
        questionId: question.id,
        category: 'grammar',
        question: question.question,
        userAnswer: selectedOption,
        correctAnswer: correctAnsStr,
        explanation: question.explanation || 'Xem lại quy tắc ngữ pháp tương ứng.',
        lessonId: selectedLesson?.id,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-purple-600" />
          Thư Viện Ngữ Pháp (A0 → A2)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          18 bài giảng ngữ pháp cốt lõi, giải thích súc tích bằng tiếng Việt, tránh thuật ngữ phức tạp, kèm bẫy lỗi sai thực tế.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm quy tắc (sein, Akkusativ, Vị trí 2...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              selectedDifficulty === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả (18)
          </button>
          <button
            onClick={() => setSelectedDifficulty('easy')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              selectedDifficulty === 'easy'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dễ (A0)
          </button>
          <button
            onClick={() => setSelectedDifficulty('medium')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              selectedDifficulty === 'medium'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Trung bình (A1)
          </button>
          <button
            onClick={() => setSelectedDifficulty('hard')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              selectedDifficulty === 'hard'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nâng cao (A2)
          </button>
        </div>
      </div>

      {/* Grammar Cards Grid */}
      {!selectedLesson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGrammar.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleSelectGrammar(item)}
              className="p-5 bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                      {item.level}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.difficulty === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.difficulty === 'easy'
                      ? 'Dễ hiểu'
                      : item.difficulty === 'medium'
                      ? 'Quan trọng'
                      : 'Cần chú ý'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.vietnameseExplanation}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-bold text-purple-700">
                <span>Xem giải thích & bài tập</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* DETAIL VIEW OF SELECTED GRAMMAR LESSON */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setSelectedLesson(null)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              ← Quay lại danh sách ngữ pháp
            </button>
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded">
              Cấp độ {selectedLesson.level}
            </span>
          </div>

          {/* Title & Meaning */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {selectedLesson.title}
            </h2>
            <p className="text-sm font-semibold text-slate-600">
              {selectedLesson.germanTitle}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed pt-2">
              {selectedLesson.vietnameseExplanation}
            </p>
          </div>

          {/* Formula Box */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-2">
            <p className="text-amber-400 font-bold uppercase tracking-wider">
              ⚡ Công thức & Cấu trúc ngữ pháp:
            </p>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {selectedLesson.formula}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ví dụ mẫu thực tế
            </h4>
            <div className="space-y-2">
              {selectedLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{ex.german}</p>
                    <p className="text-xs text-slate-600">{ex.vietnamese}</p>
                  </div>
                  <button
                    onClick={() => speechService.speak(ex.german)}
                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          {selectedLesson.commonMistakes && selectedLesson.commonMistakes.length > 0 && (
            <div className="p-5 bg-red-50 rounded-2xl border border-red-200 space-y-2">
              <h4 className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Lỗi sai phổ biến người Việt hay mắc phải:
              </h4>
              {selectedLesson.commonMistakes.map((m, idx) => (
                <div key={idx} className="text-xs text-red-800 space-y-1 pt-1">
                  <p>
                    ❌ <del>{m.wrong}</del>
                  </p>
                  <p>
                    👉 <strong className="text-emerald-700">{m.correct}</strong>
                  </p>
                  <p className="text-[11px] text-red-700 italic">{m.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Practice Questions for this Rule */}
          {selectedLesson.practiceQuestions && selectedLesson.practiceQuestions.length > 0 && (
            <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Luyện tập ngay quy tắc này
              </h4>

              {(() => {
                const q = selectedLesson.practiceQuestions[testQuestionIdx];
                if (!q) return null;

                return (
                  <div className="space-y-4">
                    <p className="font-bold text-slate-900 text-sm sm:text-base">
                      {q.question}
                    </p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = selectedOption === opt;
                          let style =
                            'bg-white border-slate-200 text-slate-800 hover:border-purple-400';

                          if (isAnswerSubmitted) {
                            if (opt.toLowerCase() === q.correctAnswer.toLowerCase()) {
                              style = 'bg-emerald-600 text-white border-emerald-600';
                            } else if (isSelected) {
                              style = 'bg-red-600 text-white border-red-600';
                            } else {
                              style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                            }
                          } else if (isSelected) {
                            style = 'bg-purple-600 text-white border-purple-600';
                          }

                          return (
                            <button
                              key={opt}
                              disabled={isAnswerSubmitted}
                              onClick={() => setSelectedOption(opt)}
                              className={`p-3 rounded-xl font-bold text-xs border text-left flex items-center justify-between transition-all ${style}`}
                            >
                              <span>{opt}</span>
                              {isAnswerSubmitted &&
                                opt.toLowerCase() === q.correctAnswer.toLowerCase() && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {isAnswerSubmitted && (
                      <div
                        className={`p-3.5 rounded-xl text-xs space-y-1 ${
                          isAnswerCorrect
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        <p className="font-bold">
                          {isAnswerCorrect ? '🎉 Chính xác!' : '❌ Chưa đúng.'}
                        </p>
                        <p>{q.explanation}</p>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      {!isAnswerSubmitted ? (
                        <button
                          disabled={!selectedOption}
                          onClick={() => handleCheckGrammarQuestion(q.correctAnswer, q)}
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-40"
                        >
                          Kiểm tra đáp án
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOption(null);
                            setIsAnswerSubmitted(false);
                            setIsAnswerCorrect(null);
                          }}
                          className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Thử làm lại
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
