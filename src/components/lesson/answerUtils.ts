import { DeepExercise } from './deepLessonTypes';

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('de-DE')
    .replace(/[“”„"'`´]/g, '')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

export function isAnswerCorrect(exercise: DeepExercise, value: string): boolean {
  const candidate = normalizeAnswer(value);
  const answers = [exercise.answer, ...(exercise.acceptedAnswers || [])]
    .map(normalizeAnswer);

  return answers.includes(candidate);
}

export function checkRequiredElements(
  value: string,
  required: string[]
): { score: number; missing: string[] } {
  const normalized = normalizeAnswer(value);
  const missing = required.filter(
    (item) => !normalized.includes(normalizeAnswer(item))
  );
  const score =
    required.length === 0
      ? Number(Boolean(normalized))
      : (required.length - missing.length) / required.length;

  return { score, missing };
}
