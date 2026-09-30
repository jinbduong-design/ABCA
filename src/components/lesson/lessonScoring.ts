import { DeepLessonScoreState } from './deepLessonTypes';

const pct = (correct: number, total: number) =>
  total <= 0 ? 100 : Math.round((correct / total) * 100);

export function getStagePercentages(scores: DeepLessonScoreState) {
  return {
    drill: pct(scores.drill.correct, scores.drill.total),
    production: pct(scores.production.correct, scores.production.total),
    challenge: pct(scores.challenge.correct, scores.challenge.total),
    mastery: pct(scores.mastery.correct, scores.mastery.total),
  };
}

export function getOverallScore(scores: DeepLessonScoreState): number {
  const p = getStagePercentages(scores);
  return Math.round(
    p.drill * 0.3 +
      p.production * 0.2 +
      p.challenge * 0.2 +
      p.mastery * 0.3
  );
}

export function lessonPassed(scores: DeepLessonScoreState): boolean {
  const p = getStagePercentages(scores);
  const overall = getOverallScore(scores);
  return (
    p.drill >= 70 &&
    p.mastery >= 70 &&
    scores.production.total > 0 &&
    scores.challenge.total > 0 &&
    overall >= 70
  );
}
