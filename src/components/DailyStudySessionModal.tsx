import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Volume2, ArrowRight, Sparkles, Award, RotateCcw, Mic, MicOff } from 'lucide-react';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { GRAMMAR_LIBRARY } from '../data/grammarData';
import { VocabularyItem, GrammarLesson, Exercise, LevelId } from '../types';

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
  const [sessionLevel, setSessionLevel] = useState<LevelId>('A0');
  const [reviewedCount, setReviewedCount] = useState(0);
  
  // Practice Step State
  const [practiceQuestion, setPracticeQuestion] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  // Speaking Step State
  const [speakingTarget, setSpeakingTarget] = useState<{ sentence: string; translation: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const progress = storageService.getProgress();
      const currentLevel = progress.currentLevel || 'A0';
      const dailySeed = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
      setSessionLevel(currentLevel);

      // Review words follow the real SRS queue, including older levels.
      const reviewCards = storageService.getCardsDueForReview();
      const reviewList = reviewCards
        .map((c) => VOCABULARY_LIST.find((v) => v.id === c.vocabId))
        .filter(Boolean) as VocabularyItem[];
      setVocabToReview(reviewList.slice(0, 3));

      // New words come from the learner's current level and exclude words already in SRS.
      const scheduledIds = new Set(storageService.getFlashcards().map((card) => card.vocabId));
      const unseenLevelVocab = VOCABULARY_LIST.filter(
        (item) => item.level === currentLevel && !scheduledIds.has(item.id)
      );
      const newWords = unseenLevelVocab.length
        ? unseenLevelVocab
            .map((_, index) => unseenLevelVocab[(dailySeed + index) % unseenLevelVocab.length])
            .slice(0, 3)
        : [];
      setNewVocab(newWords);

      // Grammar and the practice question rotate daily inside the current CEFR level.
      const levelGrammar = GRAMMAR_LIBRARY
        .filter((rule) => rule.level === currentLevel)
        .sort((a, b) => a.order - b.order);
      const selectedGrammar = levelGrammar.length
        ? levelGrammar[dailySeed % levelGrammar.length]
        : GRAMMAR_LIBRARY[0] || null;
      setGrammarRule(selectedGrammar);

      const selectedPractice =
        selectedGrammar?.practiceQuestions.find(
          (question) => Array.isArray(question.options) && question.options.length > 0
        ) || null;
      setPracticeQuestion(selectedPractice);

      const grammarExample = selectedGrammar?.examples?.[0];
      const vocabExample = newWords.find((item) => item.exampleSentence);
      setSpeakingTarget(
        grammarExample
          ? { sentence: grammarExample.german, translation: grammarExample.vietnamese }
          : vocabExample
          ? { sentence: vocabExample.exampleSentence, translation: vocabExample.exampleTranslation }
          : { sentence: 'Ich lerne jeden Tag Deutsch.', translation: 'Tôi học tiếng Đức mỗi ngày.' }
      );

      // Reset session-only state.
      setStep(1);
      setReviewedCount(0);
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
      // Newly learned words enter SRS and become due again tomorrow.
      newVocab.forEach((item) => storageService.updateFlashcardReview(item.id, 1));
      storageService.completeDailyStudySession(newVocab.length);
      setStep(6);
    }
  };

  const handleReviewRating = (vocabId: string, rating: 1 | 2 | 3 | 4) => {
    storageService.updateFlashcardReview(vocabId, rating);
    setVocabToReview((current) => current.filter((item) => item.id !== vocabId));
    setReviewedCount((count) => count + 1);
  };

  const handlePracticeChoice = (option: string, correct: string, explanation?: string) => {
    setSelectedAnswer(option);
    const isCorrect = option.toLowerCase() === correct.toLowerCase();
    const detail = explanation ? ` ${explanation}` : '';
    setPracticeFeedback({
      correct: isCorrect,
      message: isCorrect
        ? `Chính xác!${detail}`
        : `Chưa đúng. Đáp án chuẩn là: "${correct}".${detail}`,
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
    const targetSentence = speakingTarget?.sentence || 'Ich lerne jeden Tag Deutsch.';

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
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Phiên học hàng ngày 20 phút
                </h3>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black text-amber-700 ring-1 ring-amber-200">
                  {sessionLevel}
                </span>
              </div>
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
                {vocabToReview.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm font-bold text-slate-700">
                      {reviewedCount > 0 ? 'Đã ôn xong các từ đến hạn.' : 'Hôm nay chưa có từ nào đến hạn ôn.'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {reviewedCount > 0
                        ? 'Lịch ôn tiếp theo đã được cập nhật theo mức độ bạn vừa chọn.'
                        : 'Các từ đã học sẽ tự xuất hiện ở đây khi đến lịch ôn.'}
                    </p>
                  </div>
                )}
                {vocabToReview.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between gap-3">
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
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button onClick={() => handleReviewRating(item.id, 1)} className="rounded-lg bg-red-50 px-2 py-2 text-[11px] font-bold text-red-700 hover:bg-red-100">Khó · 1 ngày</button>
                      <button onClick={() => handleReviewRating(item.id, 3)} className="rounded-lg bg-amber-50 px-2 py-2 text-[11px] font-bold text-amber-700 hover:bg-amber-100">Ổn · 4 ngày</button>
                      <button onClick={() => handleReviewRating(item.id, 4)} className="rounded-lg bg-emerald-50 px-2 py-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100">Dễ · 7 ngày</button>
                    </div>
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
                {newVocab.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm font-bold text-slate-700">Không còn từ mới ở {sessionLevel} trong danh sách hiện tại.</p>
                    <p className="mt-1 text-xs text-slate-500">Phiên hôm nay sẽ tập trung vào ôn tập, ngữ pháp và luyện nói.</p>
                  </div>
                )}
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
                  Luyện phản xạ nhanh · {sessionLevel}
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Bài tập lấy trực tiếp từ quy tắc ngữ pháp của phiên hôm nay.
                </p>
              </div>

              {practiceQuestion ? (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <p className="font-bold text-slate-900 text-base text-center">
                    {practiceQuestion.question}
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(practiceQuestion.options || []).map((opt) => {
                      const correct = String(practiceQuestion.correctAnswer);
                      return (
                        <button
                          key={opt}
                          onClick={() => handlePracticeChoice(opt, correct, practiceQuestion.explanation)}
                          className={`p-3 rounded-xl font-bold text-sm border transition-all ${
                            selectedAnswer === opt
                              ? opt.toLowerCase() === correct.toLowerCase()
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-500'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
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
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-semibold text-slate-500">
                  Chưa có bài trắc nghiệm phù hợp cho quy tắc hôm nay.
                </div>
              )}
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
                    {sessionLevel} · câu luyện theo nội dung hôm nay
                  </span>
                  <h3 className="font-bold text-slate-900 text-xl">
                    "{speakingTarget?.sentence || 'Ich lerne jeden Tag Deutsch.'}"
                  </h3>
                  <p className="text-sm text-slate-600">
                    {speakingTarget?.translation || 'Tôi học tiếng Đức mỗi ngày.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => speechService.speak(speakingTarget?.sentence || 'Ich lerne jeden Tag Deutsch.')}
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
                  Bạn vừa hoàn thành phiên {sessionLevel}: ôn {reviewedCount} từ đến hạn, nạp {newVocab.length} từ mới, củng cố ngữ pháp và luyện phản xạ nói.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-md mx-auto">
                <div>
                  <p className="text-lg font-bold text-amber-600">+20</p>
                  <p className="text-[11px] text-slate-500">Phút học</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{reviewedCount + newVocab.length}</p>
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
