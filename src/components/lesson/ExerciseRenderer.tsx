import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { DeepExercise } from './deepLessonTypes';
import { isAnswerCorrect } from './answerUtils';

interface ExerciseRendererProps {
  exercise: DeepExercise;
  onResolved: (correct: boolean, answer: string) => void;
  compact?: boolean;
  beginnerHelp?: boolean;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  onResolved,
  compact = false,
  beginnerHelp = false,
}) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pickedWords, setPickedWords] = useState<string[]>([]);

  const value = exercise.kind === 'reorder' ? pickedWords.join(' ') : answer;
  const canSubmit = Boolean(value.trim());

  const remainingWords = useMemo(() => {
    if (exercise.kind !== 'reorder') return [];
    const source = [...(exercise.words || [])];
    pickedWords.forEach((word) => {
      const idx = source.indexOf(word);
      if (idx >= 0) source.splice(idx, 1);
    });
    return source;
  }, [exercise, pickedWords]);

  const submit = () => {
    if (!canSubmit || submitted) return;
    const ok = isAnswerCorrect(exercise, value);
    setCorrect(ok);
    setSubmitted(true);
    if (ok) speechService.playSuccessSound();
    else speechService.playErrorSound();
    onResolved(ok, value);
  };

  const revealAnswer = () => {
    if (submitted) return;
    setRevealed(true);
    setCorrect(false);
    setSubmitted(true);
    onResolved(false, '');
  };

  return (
    <div className={`space-y-4 ${compact ? '' : 'py-1'}`}>
      <div className="space-y-1.5">
        {exercise.instruction ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {exercise.instruction}
          </p>
        ) : null}
        <h3 className={`${compact ? 'text-base' : 'text-lg sm:text-xl'} font-extrabold text-slate-950 leading-snug`}>
          {exercise.prompt}
        </h3>
      </div>

      {exercise.kind === 'listen' && exercise.audioText ? (
        <button
          type="button"
          onClick={() => speechService.speak(exercise.audioText || '')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-amber-300 hover:bg-amber-50"
        >
          <Volume2 className="h-4 w-4" />
          Nghe lại
        </button>
      ) : null}

      {(exercise.kind === 'choice' || (exercise.kind === 'listen' && exercise.options?.length)) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {(exercise.options || []).map((option) => {
            const selected = answer === option;
            const optionIsCorrect =
              submitted &&
              isAnswerCorrect(exercise, option);
            const wrongSelected = submitted && selected && !optionIsCorrect;

            return (
              <button
                type="button"
                key={option}
                disabled={submitted}
                onClick={() => setAnswer(option)}
                className={[
                  'rounded-xl border px-4 py-3 text-left text-sm font-semibold transition',
                  optionIsCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : wrongSelected
                    ? 'border-rose-300 bg-rose-50 text-rose-900'
                    : selected
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400',
                ].join(' ')}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {(exercise.kind === 'input' || exercise.kind === 'correct' || (exercise.kind === 'listen' && !exercise.options?.length)) && (
        <input
          autoFocus
          disabled={submitted}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder={
            exercise.kind === 'correct'
              ? 'Viết câu đã sửa...'
              : 'Nhập câu trả lời...'
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-semibold text-slate-950 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
        />
      )}

      {exercise.kind === 'reorder' && (
        <div className="space-y-3">
          <div className="min-h-14 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <div className="flex flex-wrap gap-2">
              {pickedWords.map((word, idx) => (
                <button
                  type="button"
                  key={`${word}-${idx}`}
                  disabled={submitted}
                  onClick={() =>
                    setPickedWords((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {remainingWords.map((word, idx) => (
              <button
                type="button"
                key={`${word}-remaining-${idx}`}
                disabled={submitted}
                onClick={() => setPickedWords((prev) => [...prev, word])}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-amber-300"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {submitted ? (
        <div
          className={`rounded-xl border p-4 ${
            correct
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-rose-200 bg-rose-50'
          }`}
        >
          <div className="flex items-start gap-2">
            {correct ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            )}
            <div className="space-y-1">
              <p className={`text-sm font-extrabold ${correct ? 'text-emerald-900' : revealed ? 'text-amber-900' : 'text-rose-900'}`}>
                {correct
                  ? 'Đúng.'
                  : revealed
                  ? `Không sao. Đáp án mẫu: ${exercise.answer}`
                  : `Chưa đúng. Đáp án: ${exercise.answer}`}
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                {exercise.explanation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
          >
            Kiểm tra
          </button>
          {beginnerHelp ? (
            <button
              type="button"
              onClick={revealAnswer}
              className="w-full rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-extrabold text-amber-900 sm:w-auto"
            >
              Chưa biết · xem đáp án
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
