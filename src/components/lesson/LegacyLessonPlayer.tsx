import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mic,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';
import { Exercise, Lesson } from '../../types';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';

interface LegacyLessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
  onFinishLesson: (lessonId: string, score: number) => void;
}

export const LegacyLessonPlayer: React.FC<LegacyLessonPlayerProps> = ({
  lesson,
  onClose,
  onFinishLesson,
}) => {
  const [step, setStep] = useState(1);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState('');
  const [reordered, setReordered] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [testCorrect, setTestCorrect] = useState(0);
  const [testTotal, setTestTotal] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  const vocab = lesson.stepLearn?.vocabItems || [];
  const practice = lesson.stepPractice || [];
  const speaking = lesson.stepSpeak || [];
  const miniTest = lesson.stepMiniTest || [];

  const exercises = step === 3 ? practice : miniTest;
  const exercise: Exercise | undefined = exercises[index];

  const resetQuestion = () => {
    setAnswer('');
    setSelected('');
    setReordered([]);
    setSubmitted(false);
    setCorrect(null);
  };

  const getValue = () => {
    if (exercise?.type === 'reorder') return reordered.join(' ');
    return selected || answer;
  };

  const check = () => {
    if (!exercise || submitted) return;
    const expected = Array.isArray(exercise.correctAnswer)
      ? exercise.correctAnswer[0] || ''
      : exercise.correctAnswer || '';
    const clean = (v: string) =>
      v
        .toLocaleLowerCase('de-DE')
        .replace(/[.,!?]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    let ok = false;
    if (exercise.type === 'match' || exercise.type === 'match_pairs') {
      ok = true;
    } else {
      ok = clean(getValue()) === clean(expected);
    }

    setCorrect(ok);
    setSubmitted(true);
    if (ok) speechService.playSuccessSound();
    else {
      speechService.playErrorSound();
      storageService.saveMistake({
        questionId: exercise.id,
        category: exercise.category || 'grammar',
        question: exercise.question,
        userAnswer: getValue() || 'Không trả lời',
        correctAnswer: expected,
        explanation: exercise.explanation || '',
        lessonId: lesson.id,
      });
    }

    if (step === 5) {
      setTestTotal((n) => n + 1);
      if (ok) setTestCorrect((n) => n + 1);
    }
  };

  const nextExercise = () => {
    if (index + 1 < exercises.length) {
      setIndex((n) => n + 1);
      resetQuestion();
      return;
    }
    if (step === 3) {
      setStep(4);
      setIndex(0);
      resetQuestion();
      return;
    }
    const score =
      testTotal + 1 > 0
        ? Math.round(
            ((testCorrect + (correct ? 0 : 0)) /
              Math.max(1, testTotal)) *
              100
          )
        : 100;
    storageService.completeLesson(lesson.id, score);
    setStep(6);
  };

  const currentVocab = vocab[index];
  const currentSpeaking = speaking[index];

  return (
    <div className="lesson-screen-safe fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/75 backdrop-blur-sm">
      <div className="lesson-screen-panel flex w-full max-w-2xl flex-col overflow-hidden bg-[#f8f8f6] sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl">
        <header className="shrink-0 border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                {lesson.level} · Bài {lesson.lessonNumber}
              </p>
              <h2 className="mt-1 text-base font-extrabold text-slate-950">
                {lesson.titleVietnamese}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-200"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {step <= 5 ? (
            <div className="mt-3 grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 rounded-full ${
                    n <= step ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Từ vựng · {vocab.length ? index + 1 : 0}/{vocab.length}
                </p>
                <h3 className="mt-2 text-xl font-black text-slate-950">
                  Học từ và mẫu câu
                </h3>
              </div>
              {currentVocab ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                  <h4 className="text-3xl font-black text-slate-950">
                    {currentVocab.article &&
                    currentVocab.article !== 'none'
                      ? `${currentVocab.article} `
                      : ''}
                    {currentVocab.german}
                  </h4>
                  <p className="mt-2 text-lg font-bold text-slate-700">
                    {currentVocab.vietnamese}
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    {currentVocab.exampleSentence}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      speechService.speak(
                        currentVocab.article &&
                          currentVocab.article !== 'none'
                          ? `${currentVocab.article} ${currentVocab.german}`
                          : currentVocab.german
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
                  >
                    <Volume2 className="h-4 w-4" /> Nghe
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                  Bài này không có thẻ từ riêng.
                </div>
              )}
              <div className="flex gap-2">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => setIndex((n) => n - 1)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
                  >
                    <ArrowLeft className="mr-1 inline h-4 w-4" /> Trước
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    if (index + 1 < vocab.length) setIndex((n) => n + 1);
                    else {
                      setStep(2);
                      setIndex(0);
                    }
                  }}
                  className="flex-1 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Hiểu
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">
                  {lesson.stepUnderstand?.title ||
                    lesson.stepLearn?.grammarConcept?.title ||
                    'Quy tắc chính'}
                </h3>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm leading-7 text-slate-700">
                  {lesson.stepUnderstand?.contentVietnamese ||
                    lesson.stepLearn?.grammarConcept?.summary}
                </p>
                {lesson.stepUnderstand?.ruleTip ? (
                  <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-sm text-white">
                    {lesson.stepUnderstand.ruleTip}
                  </div>
                ) : null}
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {(lesson.stepUnderstand?.bulletPoints || []).map(
                    (point, i) => (
                      <li key={i}>• {point}</li>
                    )
                  )}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  setIndex(0);
                  resetQuestion();
                }}
                className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
              >
                Luyện tập <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          )}

          {(step === 3 || step === 5) && exercise && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {step === 3 ? 'Luyện' : 'Mini test'} · {index + 1}/
                  {exercises.length}
                </p>
                <h3 className="mt-2 text-xl font-black text-slate-950">
                  {exercise.question}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                {exercise.audioText ? (
                  <button
                    type="button"
                    onClick={() =>
                      speechService.speak(exercise.audioText || '')
                    }
                    className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"
                  >
                    <Volume2 className="h-4 w-4" /> Nghe
                  </button>
                ) : null}

                {exercise.options?.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {exercise.options.map((option) => (
                      <button
                        type="button"
                        key={option}
                        disabled={submitted}
                        onClick={() => setSelected(option)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                          selected === option
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : exercise.type === 'reorder' ? (
                  <div className="space-y-3">
                    <div className="min-h-14 rounded-xl bg-slate-50 p-3">
                      <div className="flex flex-wrap gap-2">
                        {reordered.map((word, i) => (
                          <button
                            type="button"
                            key={`${word}-${i}`}
                            onClick={() =>
                              setReordered((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(exercise.wordsToReorder || [])
                        .filter(
                          (word) =>
                            reordered.filter((x) => x === word).length <
                            (exercise.wordsToReorder || []).filter(
                              (x) => x === word
                            ).length
                        )
                        .map((word, i) => (
                          <button
                            type="button"
                            key={`${word}-source-${i}`}
                            onClick={() =>
                              setReordered((prev) => [...prev, word])
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
                          >
                            {word}
                          </button>
                        ))}
                    </div>
                  </div>
                ) : exercise.type === 'match' ||
                  exercise.type === 'match_pairs' ? (
                  <div className="space-y-2">
                    {(exercise.pairs || []).map((pair) => (
                      <div
                        key={pair.german}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
                      >
                        <strong>{pair.german}</strong>
                        <span className="text-slate-500">
                          {pair.vietnamese}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-slate-400">
                      Đọc các cặp rồi bấm Kiểm tra để tiếp tục.
                    </p>
                  </div>
                ) : (
                  <input
                    value={answer}
                    disabled={submitted}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') check();
                    }}
                    placeholder="Nhập đáp án..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold outline-none focus:border-amber-400"
                  />
                )}

                {!submitted ? (
                  <button
                    type="button"
                    onClick={check}
                    className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                  >
                    Kiểm tra
                  </button>
                ) : (
                  <div
                    className={`mt-4 rounded-xl p-4 ${
                      correct ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {correct ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-600" />
                      )}
                      <div>
                        <p className="text-sm font-extrabold text-slate-950">
                          {correct ? 'Đúng.' : 'Chưa đúng.'}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {exercise.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {submitted ? (
                <button
                  type="button"
                  onClick={nextExercise}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {step === 4 && currentSpeaking && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Nói · {index + 1}/{speaking.length}
                </p>
                <h3 className="mt-2 text-xl font-black text-slate-950">
                  Nghe rồi nhại lại
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <p className="text-xl font-black text-slate-950">
                  {currentSpeaking.sentence}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {currentSpeaking.vietnameseMeaning}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      speechService.speak(currentSpeaking.sentence)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
                  >
                    <Volume2 className="mr-1 inline h-4 w-4" /> Nghe
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      speechService.startSpeechRecognition(
                        (transcript) => {
                          setSpeechText(transcript);
                          setSpeechScore(
                            speechService.calculateSimilarity(
                              transcript,
                              currentSpeaking.sentence
                            )
                          );
                        },
                        (error) => setSpeechText(error)
                      )
                    }
                    className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-extrabold text-slate-950"
                  >
                    <Mic className="mr-1 inline h-4 w-4" /> Nói thử
                  </button>
                </div>
                {speechText ? (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left text-sm">
                    <p>{speechText}</p>
                    {speechScore !== null ? (
                      <strong className="mt-1 block text-amber-700">
                        Độ khớp: {speechScore}%
                      </strong>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSpeechText('');
                  setSpeechScore(null);
                  if (index + 1 < speaking.length) setIndex((n) => n + 1);
                  else {
                    setStep(5);
                    setIndex(0);
                    resetQuestion();
                  }
                }}
                className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
              >
                Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          )}

          {step === 4 && !currentSpeaking && (
            <button
              type="button"
              onClick={() => {
                setStep(5);
                setIndex(0);
              }}
              className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
            >
              Sang Mini Test
            </button>
          )}

          {step === 6 && (
            <div className="mx-auto max-w-xl py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
              <h3 className="mt-4 text-2xl font-black text-slate-950">
                Hoàn thành bài học
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Bài A1/A2 vẫn đang dùng lesson flow cũ để đảm bảo tương thích.
              </p>
              <button
                type="button"
                onClick={() => {
                  const score = testTotal
                    ? Math.round((testCorrect / testTotal) * 100)
                    : 100;
                  onFinishLesson(lesson.id, score);
                  onClose();
                }}
                className="mt-5 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-white"
              >
                Đóng bài
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
