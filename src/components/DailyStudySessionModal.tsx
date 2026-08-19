import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Volume2, ArrowRight, Sparkles, Award, RotateCcw, Mic, MicOff } from 'lucide-react';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { GRAMMAR_LIBRARY } from '../data/grammarData';
import { VocabularyItem, GrammarLesson } from '../types';

interface DailyStudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const DailyStudySessionModal: React.FC<DailyStudySessionModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [step, setStep] = useState<number>(1); // 1: Review, 2: New Vocab, 3: Grammar, 4: Practice, 5: Speak, 6: Summary
  const [vocabToReview, setVocabToReview] = useState<VocabularyItem[]>([]);
  const [newVocab, setNewVocab] = useState<VocabularyItem[]>([]);
  const [grammarRule, setGrammarRule] = useState<GrammarLesson | null>(null);
  
  // Practice Step State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  // Speaking Step State
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Pick 3 words for review (or random if none in review)
      const reviewCards = storageService.getCardsDueForReview();
      const reviewList = reviewCards
        .map((c) => VOCABULARY_LIST.find((v) => v.id === c.vocabId))
        .filter(Boolean) as VocabularyItem[];

      const finalReview = reviewList.length >= 2 
        ? reviewList.slice(0, 3) 
        : VOCABULARY_LIST.slice(0, 3);
      setVocabToReview(finalReview);

      // Pick 3 new words
      setNewVocab(VOCABULARY_LIST.slice(3, 6));

      // Pick a fundamental grammar rule
      setGrammarRule(GRAMMAR_LIBRARY[0]);

      // Reset state
      setStep(1);
      setSelectedAnswer(null);
      setPracticeFeedback(null);
      setSpeechScore(null);
      setRecognizedText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setPracticeFeedback(null);
      setSpeechScore(null);
      setRecognizedText('');
    } else if (step === 5) {
      // Finish session
      storageService.addStudyTime(20);
      storageService.completeDailyStudySession();
      setStep(6);
    }
  };

  const handlePracticeChoice = (option: string, correct: string) => {
    setSelectedAnswer(option);
    const isCorrect = option.toLowerCase() === correct.toLowerCase();
    setPracticeFeedback({
      correct: isCorrect,
      message: isCorrect
        ? 'Xuất sắc! Bạn đã chọn chính xác.'
        : `Chưa đúng. Đáp án chuẩn là: "${correct}".`,
    });
  };

  const handleSpeechRecord = () => {
    if (isListening) {
      speechService.stopSpeechRecognition();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setRecognizedText('Đang lắng nghe...');
    const targetSentence = 'Ich lerne jeden Tag Deutsch.';

    speechService.startSpeechRecognition(
      (text) => {
        setIsListening(false);
        setRecognizedText(text);
        const sim = speechService.calculateSimilarity(text, targetSentence);
        const accuracy = Math.round(sim * 100);
        setSpeechScore(accuracy);
      },
      (error) => {
        setIsListening(false);
        setRecognizedText('Không nhận diện được âm thanh. Hãy thử lại!');
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Phiên học hàng ngày 20 phút
              </h3>
              <p className="text-xs text-slate-500">
                {step === 6
                  ? 'Hoàn thành phiên học!'
                  : `Bước ${step}/5: ${
                      step === 1
                        ? 'Ôn tập từ cũ (Spaced Repetition)'
                        : step === 2
                        ? 'Học từ vựng mới hôm nay'
                        : step === 3
                        ? 'Ngữ pháp thực dụng'
                        : step === 4
                        ? 'Luyện phản xạ bài tập'
                        : 'Luyện phát âm & Nói'
                    }`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step <= 5 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            <div
              className="bg-amber-600 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: REVIEW SPATIAL REPETITION */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  Ôn tập từ vựng ngắt quãng (SRS)
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Não bộ cần nhắc lại từ vựng theo chu kỳ để chuyển từ trí nhớ ngắn hạn sang dài hạn.
                </p>
              </div>

              <div className="space-y-3">
                {vocabToReview.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {item.article && item.article !== 'none' && (
                          <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-700">
                            {item.article}
                          </span>
                        )}
                        <span className="font-bold text-slate-900 text-lg">
                          {item.german}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">
                        {item.vietnamese}
                      </p>
                      {item.exampleSentence && (
                        <p className="text-xs text-slate-500 italic mt-1">
                          VD: {item.exampleSentence}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        speechService.speak(
                          item.article && item.article !== 'none'
                            ? `${item.article} ${item.german}`
                            : item.german
                        )
                      }
                      className="p-3 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-600 rounded-xl border border-slate-200 shadow-sm transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: NEW VOCABULARY */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  Nạp từ vựng mới hôm nay
                </h4>
                <p className="text-xs text-blue-800 mt-1">
                  Luôn ghi nhớ danh từ tiếng Đức cùng quán từ <span className="font-bold">der (xanh) / die (đỏ) / das (xanh lá)</span>.
                </p>
              </div>

              <div className="space-y-3">
                {newVocab.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.article && item.article !== 'none' && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                              item.article === 'der'
                                ? 'bg-blue-100 text-blue-700'
                                : item.article === 'die'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {item.article}
                          </span>
                        )}
                        <span className="font-bold text-slate-900 text-lg">
                          {item.german}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          speechService.speak(
                            item.article && item.article !== 'none'
                              ? `${item.article} ${item.german}`
                              : item.german
                          )
                        }
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.pronunciation}
                      </span>
                      <span className="text-slate-500 font-medium">Nghĩa:</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {item.vietnamese}
                      </span>
                    </div>
                    {item.exampleSentence && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                        💬 "{item.exampleSentence}" – {item.exampleTranslation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: GRAMMAR FOCUS */}
          {step === 3 && grammarRule && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Quy tắc ngữ pháp hôm nay
                </span>
                <h4 className="font-bold text-slate-900 text-base">
                  {grammarRule.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {grammarRule.vietnameseExplanation}
                </p>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs leading-relaxed space-y-1">
                <p className="text-amber-400 font-bold uppercase">⚡ Cấu trúc công thức:</p>
                <p className="text-slate-200">{grammarRule.formula}</p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Câu mẫu minh họa
                </h5>
                {grammarRule.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{ex.german}</p>
                      <p className="text-xs text-slate-600">{ex.vietnamese}</p>
                    </div>
                    <button
                      onClick={() => speechService.speak(ex.german)}
                      className="p-2 text-slate-400 hover:text-amber-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PRACTICE REFLEX */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-sm">
                  Luyện phản xạ nhanh
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Chọn đáp án đúng nhất để hoàn thiện câu sau:
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <p className="font-bold text-slate-900 text-base text-center">
                  "Guten Tag! Wie _______ Sie?"
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {['heißen', 'heißt', 'heiße', 'heißst'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePracticeChoice(opt, 'heißen')}
                      className={`p-3 rounded-xl font-bold text-sm border transition-all ${
                        selectedAnswer === opt
                          ? opt === 'heißen'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-amber-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {practiceFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      practiceFeedback.correct
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {practiceFeedback.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: SPEAKING REFLEX */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 text-sm">
                  Luyện nói & Phát âm chuẩn
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Nhấn vào nút loa để nghe mẫu, sau đó nhấn Micro và đọc to câu tiếng Đức:
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                    [Ikh lehr-nuh yeh-den Tahk Doytsh]
                  </span>
                  <h3 className="font-bold text-slate-900 text-xl">
                    "Ich lerne jeden Tag Deutsch."
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tôi học tiếng Đức mỗi ngày.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => speechService.speak('Ich lerne jeden Tag Deutsch.')}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs"
                  >
                    <Volume2 className="w-4 h-4 text-amber-600" /> Nghe mẫu
                  </button>
                  <button
                    onClick={handleSpeechRecord}
                    className={`px-5 py-2.5 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" /> Đang ghi âm... (Bấm dừng)
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" /> Bấm để đọc
                      </>
                    )}
                  </button>
                </div>

                {recognizedText && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-500">Giọng bạn vừa nói:</p>
                    <p className="font-bold text-slate-800">"{recognizedText}"</p>
                    {speechScore !== null && (
                      <div className="pt-2">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-xs ${
                            speechScore >= 70
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Độ chính xác: {speechScore}%{' '}
                          {speechScore >= 70 ? '🎉 Tuyệt vời!' : '💪 Hãy thử lại!'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: CELEBRATION SUMMARY */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Hoàn thành 20 phút học hôm nay!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Bạn vừa hoàn thành xuất sắc chu kỳ Spaced Repetition, nạp 3 từ mới, củng cố ngữ pháp và luyện phản xạ nói.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-md mx-auto">
                <div>
                  <p className="text-lg font-bold text-amber-600">+20</p>
                  <p className="text-[11px] text-slate-500">Phút học</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">6</p>
                  <p className="text-[11px] text-slate-500">Từ ôn & học</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600">+1 🔥</p>
                  <p className="text-[11px] text-slate-500">Chuỗi ngày</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end gap-2">
          {step <= 5 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              {step === 5 ? 'Hoàn thành phiên học' : 'Tiếp tục bước tiếp'}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (onCompleted) onCompleted();
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              Đóng và quay lại trang chính
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
