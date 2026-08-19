import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Volume2, 
  Mic, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  RotateCcw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Lesson, Exercise } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
  onFinishLesson: (lessonId: string, score: number) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  onClose,
  onFinishLesson,
}) => {
  // Step 1: Learn, 2: Understand, 3: Practice, 4: Speak, 5: Mini Test, 6: Completion
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Normalizing lesson data safely
  const vocabItems = useMemo(() => {
    return lesson.stepLearn?.vocabItems || (lesson as any).vocabulary || [];
  }, [lesson]);

  const practiceExercises: Exercise[] = useMemo(() => {
    return lesson.stepPractice || (lesson as any).exercises || [];
  }, [lesson]);

  const speakSentences = useMemo(() => {
    const s = lesson.stepSpeak || (lesson as any).speakingSentences || [];
    return Array.isArray(s) ? s : [];
  }, [lesson]);

  const miniTestExercises: Exercise[] = useMemo(() => {
    return lesson.stepMiniTest || (lesson as any).miniTest || practiceExercises;
  }, [lesson, practiceExercises]);

  // Step 1 - Active vocab index
  const [activeVocabIdx, setActiveVocabIdx] = useState(0);

  // Step 3 & 5 - Practice / Test Exercise State
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillBlankInput, setFillBlankInput] = useState('');
  const [reorderSelectedWords, setReorderSelectedWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<{ [de: string]: string }>({});
  const [selectedLeftPair, setSelectedLeftPair] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [testScore, setTestScore] = useState(0);

  // Step 4 - Speaking State
  const [speakingSentenceIdx, setSpeakingSentenceIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recordedSpeech, setRecordedSpeech] = useState('');
  const [speechAccuracy, setSpeechAccuracy] = useState<number | null>(null);

  // Pool of mini-test questions (uses lesson's miniTest or exercises)
  const currentExercises = useMemo(() => {
    if (currentStep === 3) return practiceExercises;
    if (currentStep === 5) return miniTestExercises;
    return [];
  }, [currentStep, practiceExercises, miniTestExercises]);

  const currentExercise: Exercise | undefined = currentExercises[exerciseIndex];

  // Auto speech on vocab flip
  useEffect(() => {
    if (currentStep === 1 && vocabItems[activeVocabIdx]) {
      const v = vocabItems[activeVocabIdx];
      const textToSpeak = v.article && v.article !== 'none' ? `${v.article} ${v.german}` : v.german;
      speechService.speak(textToSpeak);
    }
  }, [currentStep, activeVocabIdx, vocabItems]);

  // Reset exercise state when exercise index changes
  useEffect(() => {
    setSelectedOption(null);
    setFillBlankInput('');
    setReorderSelectedWords([]);
    setSelectedLeftPair(null);
    setMatchedPairs({});
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
  }, [exerciseIndex, currentStep]);

  // Handle Practice/Test submission
  const handleCheckAnswer = () => {
    if (!currentExercise || isAnswerSubmitted) return;

    let correct = false;
    const correctAnsStr = Array.isArray(currentExercise.correctAnswer)
      ? currentExercise.correctAnswer[0] || ''
      : currentExercise.correctAnswer || '';

    if (
      currentExercise.type === 'multiple_choice' ||
      currentExercise.type === 'choose_article' ||
      currentExercise.type === 'translation' ||
      currentExercise.type === 'listen_select' ||
      currentExercise.type === 'translate_to_de' ||
      currentExercise.type === 'translate_to_vn'
    ) {
      correct = selectedOption?.toLowerCase().trim() === correctAnsStr.toLowerCase().trim();
    } else if (currentExercise.type === 'fill_blank') {
      correct = fillBlankInput.toLowerCase().trim() === correctAnsStr.toLowerCase().trim();
    } else if (currentExercise.type === 'reorder') {
      const sentence = reorderSelectedWords.join(' ').trim();
      const clean1 = sentence.replace(/[.,!?]/g, '').toLowerCase().trim();
      const clean2 = correctAnsStr.replace(/[.,!?]/g, '').toLowerCase().trim();
      correct = clean1 === clean2;
    } else if (currentExercise.type === 'match_pairs' || currentExercise.type === 'match') {
      const pairs = currentExercise.pairs || [];
      const allMatched = pairs.length > 0 && pairs.every((p) => matchedPairs[p.german] === p.vietnamese);
      correct = allMatched;
    }

    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      if (currentStep === 5) setTestScore((prev) => prev + 1);
    } else {
      // Save mistake to Mistakes Log
      const userWrong = selectedOption || fillBlankInput || reorderSelectedWords.join(' ') || 'Sai';
      storageService.saveMistake({
        questionId: currentExercise.id,
        category: currentExercise.category || 'grammar',
        question: currentExercise.question,
        userAnswer: userWrong,
        correctAnswer: correctAnsStr,
        explanation: currentExercise.explanation || 'Hãy chú ý quy tắc ngữ pháp của bài học.',
        lessonId: lesson.id,
      });
    }
  };

  const handleNextExercise = () => {
    if (exerciseIndex + 1 < currentExercises.length) {
      setExerciseIndex((prev) => prev + 1);
    } else {
      // Step complete! Move to next step in lesson
      if (currentStep === 3) {
        // From Practice to Speaking
        setCurrentStep(4);
        setSpeakingSentenceIdx(0);
      } else if (currentStep === 5) {
        // From Mini Test to Completion
        storageService.completeLesson(lesson.id, testScore);
        storageService.addStudyTime(lesson.estimatedMinutes || 15);
        setCurrentStep(6);
      }
    }
  };

  // Reorder exercise helper
  const handleToggleReorderWord = (word: string, isAdded: boolean) => {
    if (isAnswerSubmitted) return;
    if (isAdded) {
      setReorderSelectedWords((prev) => prev.filter((w, idx) => !(w === word && idx === prev.lastIndexOf(word))));
    } else {
      setReorderSelectedWords((prev) => [...prev, word]);
    }
  };

  // Speaking mic handler
  const handleStartSpeaking = (targetText: string) => {
    if (isListening) {
      speechService.stopSpeechRecognition();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setRecordedSpeech('Đang lắng nghe giọng bạn...');

    speechService.startSpeechRecognition(
      (transcript) => {
        setIsListening(false);
        setRecordedSpeech(transcript);
        const sim = speechService.calculateSimilarity(transcript, targetText);
        const scorePct = Math.round(sim * 100);
        setSpeechAccuracy(scorePct);
      },
      () => {
        setIsListening(false);
        setRecordedSpeech('Không thu được âm thanh. Bạn vui lòng thử lại nhé!');
      }
    );
  };

  const stepTitles = [
    '1. Học từ vựng',
    '2. Hiểu cấu trúc',
    '3. Luyện phản xạ',
    '4. Luyện nói & Âm',
    '5. Mini Test',
  ];

  const currentVocab = vocabItems[activeVocabIdx];
  const currentSentence = speakSentences[speakingSentenceIdx];

  // Grammar metadata
  const grammarTitle = 
    lesson.stepUnderstand?.title || 
    (lesson as any).grammarRule?.title || 
    lesson.stepLearn?.grammarConcept?.title || 
    'Quy tắc ngữ pháp';

  const grammarContent = 
    lesson.stepUnderstand?.contentVietnamese || 
    (lesson as any).grammarRule?.vietnameseExplanation || 
    lesson.stepLearn?.grammarConcept?.summary || 
    '';

  const grammarFormula = 
    lesson.stepUnderstand?.ruleTip || 
    (lesson as any).grammarRule?.formula || 
    lesson.stepLearn?.grammarConcept?.rule || 
    '';

  const grammarBullets = 
    lesson.stepUnderstand?.bulletPoints || 
    (lesson as any).grammarRule?.vietnameseTips || 
    [];

  const grammarExamples = 
    lesson.stepLearn?.grammarConcept?.examples || 
    (lesson as any).grammarRule?.examples || 
    [];

  const commonMistakes = (lesson as any).grammarRule?.commonMistakes || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-amber-100 text-amber-900 uppercase">
              {lesson.level}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                {lesson.titleVietnamese}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {stepTitles[currentStep - 1] || 'Hoàn thành'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Segmented Progress Bar */}
        {currentStep <= 5 && (
          <div className="grid grid-cols-5 gap-1 px-5 pt-3 bg-white">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= s ? 'bg-amber-600' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Dynamic Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* ========================================================================= */}
          {/* STEP 1: LEARN (Vocabulary Cards with der/die/das colors) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Từ vựng {vocabItems.length > 0 ? activeVocabIdx + 1 : 0} / {vocabItems.length}
                </span>
                <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded">
                  Quy tắc: Nhớ màu mạo từ
                </span>
              </div>

              {currentVocab ? (
                <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm relative">
                  {/* Article Badge */}
                  {currentVocab.article && currentVocab.article !== 'none' && (
                    <div className="flex justify-center">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm ${
                          currentVocab.article === 'der'
                            ? 'bg-blue-600 text-white'
                            : currentVocab.article === 'die'
                            ? 'bg-red-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {currentVocab.article === 'der'
                          ? 'der (Giống Đực)'
                          : currentVocab.article === 'die'
                          ? 'die (Giống Cái)'
                          : 'das (Giống Trung)'}
                      </span>
                    </div>
                  )}

                  {/* German Word */}
                  <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {currentVocab.german}
                    </h2>
                    {currentVocab.plural && (
                      <p className="text-xs text-slate-400 font-medium">
                        Số nhiều (Plural):{' '}
                        <strong className="text-slate-600">
                          {currentVocab.plural}
                        </strong>
                      </p>
                    )}
                  </div>

                  {/* Pronunciation & Meaning */}
                  <div className="space-y-1">
                    {currentVocab.pronunciation && (
                      <span className="text-sm font-mono text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full inline-block">
                        Phát âm: {currentVocab.pronunciation}
                      </span>
                    )}
                    <p className="text-xl font-bold text-slate-800 pt-2">
                      {currentVocab.vietnamese}
                    </p>
                    {currentVocab.english && (
                      <p className="text-xs text-slate-400">
                        ({currentVocab.english})
                      </p>
                    )}
                  </div>

                  {/* Example Sentence */}
                  {currentVocab.exampleSentence && (
                    <div className="p-3 bg-slate-100/70 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
                      <p className="font-bold text-slate-900">
                        💬 {currentVocab.exampleSentence}
                      </p>
                      {currentVocab.exampleTranslation && (
                        <p className="text-slate-500">
                          {currentVocab.exampleTranslation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Audio Listen Button */}
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() =>
                        speechService.speak(
                          currentVocab.article && currentVocab.article !== 'none'
                            ? `${currentVocab.article} ${currentVocab.german}`
                            : currentVocab.german
                        )
                      }
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-sm flex items-center gap-2 text-xs transition-colors"
                    >
                      <Volume2 className="w-4 h-4" /> Nghe phát âm chuẩn
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-3xl">
                  Chưa có từ vựng cho bài học này.
                </div>
              )}

              {/* Vocab Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={activeVocabIdx === 0}
                  onClick={() => setActiveVocabIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Từ trước
                </button>

                {activeVocabIdx + 1 < vocabItems.length ? (
                  <button
                    onClick={() => setActiveVocabIdx((p) => p + 1)}
                    className="px-5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 shadow-sm"
                  >
                    Từ tiếp theo <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm"
                  >
                    Bước 2: Hiểu cấu trúc <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: UNDERSTAND (Vietnamese clear explanation) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                  Quy tắc cốt lõi
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {grammarTitle}
                </h4>
                {grammarContent && (
                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {grammarContent}
                  </p>
                )}
              </div>

              {/* Bullet Points */}
              {grammarBullets.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    📌 Điểm mấu chốt:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {grammarBullets.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formula Structure Box */}
              {grammarFormula && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-1.5 border border-slate-800">
                  <p className="text-amber-400 font-bold uppercase tracking-wider">
                    ⚡ Cấu trúc & Mẹo ghi nhớ:
                  </p>
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {grammarFormula}
                  </p>
                </div>
              )}

              {/* Examples in rule */}
              {grammarExamples.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ví dụ thực tế
                  </h5>
                  {grammarExamples.map((ex: any, idx: number) => (
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
              )}

              {/* Common Mistakes to Avoid */}
              {commonMistakes.length > 0 && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 uppercase">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Lỗi sai người Việt hay mắc phải:
                  </div>
                  {commonMistakes.map((m: any, idx: number) => (
                    <div key={idx} className="text-xs text-red-800 space-y-0.5">
                      <p>
                        ❌ <del>{m.wrong}</del>
                      </p>
                      <p>
                        👉 <strong className="text-emerald-700">{m.correct}</strong>
                      </p>
                      {m.reason && <p className="text-[11px] text-red-700 italic">{m.reason}</p>}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    setExerciseIndex(0);
                  }}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 shadow-sm flex items-center gap-2"
                >
                  Bước 3: Luyện tập phản xạ <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 (Practice) & STEP 5 (Mini Test) EXERCISE ENGINE */}
          {/* ========================================================================= */}
          {(currentStep === 3 || currentStep === 5) && currentExercise && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentStep === 3 ? 'Luyện tập' : 'Mini Test'} {exerciseIndex + 1} /{' '}
                  {currentExercises.length}
                </span>
                {currentStep === 5 && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Điểm: {testScore} / {currentExercises.length}
                  </span>
                )}
              </div>

              {/* Question card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                    {currentExercise.instruction || 'Chọn đáp án chính xác'}
                  </span>
                  <button
                    onClick={() => speechService.speak((currentExercise as any).sentence || currentExercise.question)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-200"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                  {currentExercise.question}
                </h4>
              </div>

              {/* TYPE 1: MULTIPLE CHOICE & ARTICLE CHOICE */}
              {(currentExercise.type === 'multiple_choice' ||
                currentExercise.type === 'choose_article' ||
                currentExercise.type === 'translation' ||
                currentExercise.type === 'listen_select' ||
                currentExercise.type === 'translate_to_de' ||
                currentExercise.type === 'translate_to_vn') &&
                currentExercise.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentExercise.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      const correctAns = Array.isArray(currentExercise.correctAnswer)
                        ? currentExercise.correctAnswer[0]
                        : currentExercise.correctAnswer;
                      const isOptionCorrect = opt.toLowerCase() === correctAns?.toLowerCase();

                      let btnStyle = 'border-slate-200 hover:border-amber-400 bg-white text-slate-800';
                      if (isSelected) {
                        btnStyle = 'border-amber-600 bg-amber-50 text-amber-900 font-bold';
                      }
                      if (isAnswerSubmitted) {
                        if (isOptionCorrect) {
                          btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isSelected && !isAnswerCorrect) {
                          btnStyle = 'border-red-600 bg-red-50 text-red-900 font-bold';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerSubmitted}
                          onClick={() => setSelectedOption(opt)}
                          className={`p-3.5 rounded-2xl border text-left text-sm transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isAnswerCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

              {/* TYPE 2: FILL IN THE BLANK */}
              {currentExercise.type === 'fill_blank' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={isAnswerSubmitted}
                    value={fillBlankInput}
                    onChange={(e) => setFillBlankInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    placeholder="Nhập câu trả lời bằng tiếng Đức..."
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              )}

              {/* TYPE 3: REORDER WORDS */}
              {currentExercise.type === 'reorder' && currentExercise.wordsToReorder && (
                <div className="space-y-4">
                  {/* Selected Words Tray */}
                  <div className="min-h-[56px] p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-wrap gap-2 items-center">
                    {reorderSelectedWords.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        Bấm vào các từ bên dưới để xếp thành câu hoàn chỉnh
                      </span>
                    ) : (
                      reorderSelectedWords.map((w, i) => (
                        <button
                          key={i}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleToggleReorderWord(w, true)}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm"
                        >
                          {w}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Word Pool */}
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.wordsToReorder.map((word, idx) => {
                      const countInSelected = reorderSelectedWords.filter((w) => w === word).length;
                      const countInPool = currentExercise.wordsToReorder!.filter((w) => w === word).length;
                      const isFullyUsed = countInSelected >= countInPool;

                      return (
                        <button
                          key={idx}
                          disabled={isFullyUsed || isAnswerSubmitted}
                          onClick={() => handleToggleReorderWord(word, false)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                            isFullyUsed
                              ? 'opacity-30 border-slate-200 bg-slate-100 text-slate-400'
                              : 'border-slate-300 bg-white hover:border-amber-500 text-slate-800'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPE 4: MATCH PAIRS */}
              {(currentExercise.type === 'match_pairs' || currentExercise.type === 'match') &&
                currentExercise.pairs && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      Bấm vào từ tiếng Đức ở cột trái rồi bấm nghĩa tiếng Việt ở cột phải:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Left Column (German) */}
                      <div className="space-y-2">
                        {currentExercise.pairs.map((p, idx) => {
                          const isMatched = !!matchedPairs[p.german];
                          const isSelected = selectedLeftPair === p.german;

                          return (
                            <button
                              key={idx}
                              disabled={isMatched || isAnswerSubmitted}
                              onClick={() => setSelectedLeftPair(p.german)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                                isMatched
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                                  : isSelected
                                  ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
                              }`}
                            >
                              {p.german} {isMatched && <Check className="w-3.5 h-3.5 inline ml-1" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Column (Vietnamese) */}
                      <div className="space-y-2">
                        {currentExercise.pairs.map((p, idx) => {
                          const matchedGerman = Object.keys(matchedPairs).find(
                            (k) => matchedPairs[k] === p.vietnamese
                          );
                          const isMatched = !!matchedGerman;

                          return (
                            <button
                              key={idx}
                              disabled={isMatched || isAnswerSubmitted || !selectedLeftPair}
                              onClick={() => {
                                if (selectedLeftPair) {
                                  setMatchedPairs((prev) => ({
                                    ...prev,
                                    [selectedLeftPair]: p.vietnamese,
                                  }));
                                  setSelectedLeftPair(null);
                                }
                              }}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                                isMatched
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 font-medium'
                                  : selectedLeftPair
                                  ? 'bg-amber-50/60 border-amber-300 text-amber-900 hover:bg-amber-100 font-medium cursor-pointer'
                                  : 'bg-slate-50 border-slate-200 text-slate-500'
                              }`}
                            >
                              {p.vietnamese} {isMatched && <Check className="w-3.5 h-3.5 inline ml-1" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              {/* Submit & Explanation Footer */}
              <div className="pt-3 space-y-3">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={
                      (currentExercise.type === 'multiple_choice' ||
                        currentExercise.type === 'choose_article' ||
                        currentExercise.type === 'translation' ||
                        currentExercise.type === 'listen_select' ||
                        currentExercise.type === 'translate_to_de' ||
                        currentExercise.type === 'translate_to_vn')
                        ? !selectedOption
                        : currentExercise.type === 'fill_blank'
                        ? !fillBlankInput.trim()
                        : currentExercise.type === 'reorder'
                        ? reorderSelectedWords.length === 0
                        : Object.keys(matchedPairs).length !== (currentExercise.pairs || []).length
                    }
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-4 rounded-2xl border ${
                        isAnswerCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {isAnswerCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Chính xác! Tuyệt vời!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span>Chưa chính xác (Đã lưu vào Sổ tay lỗi sai)</span>
                          </>
                        )}
                      </div>

                      {currentExercise.explanation && (
                        <p className="text-xs text-slate-700 mt-2">
                          💡 <strong>Giải thích:</strong> {currentExercise.explanation}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleNextExercise}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      {exerciseIndex + 1 < currentExercises.length
                        ? 'Câu tiếp theo'
                        : currentStep === 3
                        ? 'Chuyển sang Bước 4: Luyện nói'
                        : 'Xem kết quả bài học'}{' '}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: SPEAK (Pronunciation & Speaking AI Coach) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Luyện nói {speakSentences.length > 0 ? speakingSentenceIdx + 1 : 0} / {speakSentences.length}
                </span>
                <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded">
                  Nhận diện giọng nói AI
                </span>
              </div>

              {currentSentence ? (
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Mẫu câu thực hành:
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {currentSentence.sentence}
                    </h3>
                    <p className="text-sm font-medium text-slate-600">
                      {currentSentence.vietnameseMeaning}
                    </p>
                    {currentSentence.pronunciationGuide && (
                      <p className="text-xs font-mono text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full inline-block mt-1">
                        Phiên âm: {currentSentence.pronunciationGuide}
                      </p>
                    )}
                  </div>

                  {/* Audio Listen */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => speechService.speak(currentSentence.sentence)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" /> Nghe giọng mẫu
                    </button>
                  </div>

                  {/* Mic Recorder */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col items-center space-y-3">
                    <button
                      onClick={() => handleStartSpeaking(currentSentence.sentence)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isListening
                          ? 'bg-red-600 text-white animate-pulse scale-110'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                    <span className="text-xs font-bold text-slate-600">
                      {isListening ? 'Đang ghi âm... Hãy nói to rõ ràng!' : 'Bấm mic để nói câu trên'}
                    </span>
                  </div>

                  {/* Recognition Transcript & Accuracy */}
                  {recordedSpeech && (
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs space-y-1 text-left">
                      <p className="text-slate-500 font-medium">Giọng nói nhận diện:</p>
                      <p className="font-bold text-slate-900 text-sm">"{recordedSpeech}"</p>
                      {speechAccuracy !== null && (
                        <div className="pt-1">
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-xs ${
                              speechAccuracy >= 70
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Độ chính xác: {speechAccuracy}%{' '}
                            {speechAccuracy >= 70 ? '🎉 Tuyệt vời!' : '💪 Cần luyện thêm!'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-3xl">
                  Chưa có câu luyện nói cho bài học này.
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-medium">
                  Câu {speakSentences.length > 0 ? speakingSentenceIdx + 1 : 0} / {speakSentences.length}
                </span>

                {speakingSentenceIdx + 1 < speakSentences.length ? (
                  <button
                    onClick={() => {
                      setSpeakingSentenceIdx((p) => p + 1);
                      setRecordedSpeech('');
                      setSpeechAccuracy(null);
                    }}
                    className="px-5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 shadow-sm"
                  >
                    Câu tiếp theo <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentStep(5);
                      setExerciseIndex(0);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-2"
                  >
                    Bước 5: Làm Mini Test <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: COMPLETION CELEBRATION */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Chúc mừng bạn!
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Hoàn thành bài học: {lesson.titleVietnamese}
                </h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Bạn đã nắm vững từ vựng, quy tắc mạo từ, luyện phản xạ và hoàn thành Mini Test.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-md mx-auto">
                <div>
                  <p className="text-xl font-black text-amber-600">
                    +{lesson.estimatedMinutes || 10}
                  </p>
                  <p className="text-[11px] text-slate-400">Phút học</p>
                </div>
                <div>
                  <p className="text-xl font-black text-blue-600">
                    +{vocabItems.length}
                  </p>
                  <p className="text-[11px] text-slate-400">Từ vựng mới</p>
                </div>
                <div>
                  <p className="text-xl font-black text-emerald-600">
                    {testScore} / {miniTestExercises.length || 1}
                  </p>
                  <p className="text-[11px] text-slate-400">Điểm kiểm tra</p>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onFinishLesson(lesson.id, testScore)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all text-sm"
                >
                  Hoàn tất & Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
