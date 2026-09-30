import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Mic,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';
import { Lesson } from '../../types';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { ExerciseRenderer } from './ExerciseRenderer';
import {
  DeepExercise,
  DeepLesson,
  DeepLessonMasteryRecord,
  DeepLessonScoreState,
  DeepSkill,
} from './deepLessonTypes';
import { checkRequiredElements } from './answerUtils';
import {
  getOverallScore,
  getStagePercentages,
  lessonPassed,
} from './lessonScoring';

type StageId =
  | 'goal'
  | 'warmup'
  | 'learn'
  | 'concept'
  | 'drill'
  | 'production'
  | 'speaking'
  | 'challenge'
  | 'mastery'
  | 'remediation'
  | 'review';

interface DeepLessonPlayerProps {
  lesson: Lesson;
  deep: DeepLesson;
  onClose: () => void;
  onFinishLesson: (lessonId: string, score: number) => void;
}

interface SessionSnapshot {
  lessonId: string;
  stage: StageId;
  itemIndex: number;
  subIndex: number;
  scores: DeepLessonScoreState;
  wrongSkills: Record<string, number>;
  skillStats: Record<string, { correct: number; total: number }>;
  updatedAt: string;
}

const SESSION_KEY = 'deutschstart_deep_lesson_session_v2';
const MASTERY_KEY = 'deutschstart_deep_mastery_v2';

const emptyScores = (): DeepLessonScoreState => ({
  drill: { correct: 0, total: 0 },
  production: { correct: 0, total: 0 },
  challenge: { correct: 0, total: 0 },
  mastery: { correct: 0, total: 0 },
});

const macroStages = [
  { label: 'Bắt đầu', ids: ['goal', 'warmup'] },
  { label: 'Làm quen', ids: ['learn', 'concept'] },
  { label: 'Luyện', ids: ['drill'] },
  { label: 'Nói', ids: ['production', 'speaking', 'challenge'] },
  { label: 'Xong', ids: ['mastery', 'remediation', 'review'] },
] as const;

function readSession(lessonId: string): SessionSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionSnapshot;
    if (parsed.lessonId !== lessonId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveMastery(record: DeepLessonMasteryRecord) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(MASTERY_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const previous = map[record.lessonId] as DeepLessonMasteryRecord | undefined;
    map[record.lessonId] = {
      ...record,
      bestScore: Math.max(previous?.bestScore || 0, record.lastScore),
      attempts: (previous?.attempts || 0) + 1,
    };
    localStorage.setItem(MASTERY_KEY, JSON.stringify(map));
    storageService.markExternalChange();
  } catch {
    // Mastery persistence is helpful but must never block the lesson.
  }
}

function getMacroIndex(stage: StageId): number {
  const index = macroStages.findIndex((group) =>
    (group.ids as readonly string[]).includes(stage)
  );
  return Math.max(0, index);
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Rất chắc';
  if (score >= 80) return 'Tốt';
  if (score >= 70) return 'Đạt';
  return 'Cần ôn';
}

function getGraduationDomains(
  stats: Record<string, { correct: number; total: number }>
) {
  return [
    { label: 'Phát âm & nghe', keys: ['pronunciation', 'listening'] },
    { label: 'Từ vựng', keys: ['vocabulary', 'article'] },
    { label: 'Ngữ pháp', keys: ['grammar', 'word_order'] },
    {
      label: 'Giao tiếp',
      keys: ['production', 'communication', 'translation'],
    },
  ].map((domain) => {
    const entries = domain.keys.map((key) => stats[key]).filter(Boolean);
    const correct = entries.reduce((n, entry) => n + entry.correct, 0);
    const total = entries.reduce((n, entry) => n + entry.total, 0);
    return {
      label: domain.label,
      correct,
      total,
      pct: total ? Math.round((correct / total) * 100) : 100,
    };
  });
}

function hasPassedLesson(
  lessonId: string,
  scores: DeepLessonScoreState,
  stats: Record<string, { correct: number; total: number }>
) {
  if (!lessonPassed(scores)) return false;
  if (lessonId !== 'l_a0_10') return true;
  return getGraduationDomains(stats).every(
    (domain) => domain.total === 0 || domain.pct >= 60
  );
}

export const DeepLessonPlayer: React.FC<DeepLessonPlayerProps> = ({
  lesson,
  deep,
  onClose,
  onFinishLesson,
}) => {
  const learnerProgress = storageService.getProgress();
  const beginnerGuided =
    lesson.level === 'A0' &&
    (lesson.lessonNumber <= 3 || (learnerProgress.completedLessons || []).length < 3);

  const guidedWarmup = beginnerGuided ? [] : deep.warmup;
  const easyDrills = deep.drills.filter((exercise) => (exercise.difficulty || 1) === 1);
  const guidedDrills = beginnerGuided
    ? (easyDrills.length ? easyDrills : deep.drills).slice(0, 4)
    : deep.drills;
  const guidedProduction = beginnerGuided ? deep.production.slice(0, 1) : deep.production;
  const guidedSpeaking = beginnerGuided ? deep.speaking.slice(0, 1) : deep.speaking;
  const easyMastery = deep.mastery.filter((exercise) => (exercise.difficulty || 1) === 1);
  const guidedMastery = beginnerGuided
    ? (easyMastery.length ? easyMastery : deep.mastery).slice(0, 3)
    : deep.mastery;

  const resume = useMemo(() => readSession(lesson.id), [lesson.id]);
  const initialStage: StageId =
    beginnerGuided && resume?.stage === 'warmup'
      ? 'learn'
      : resume?.stage || 'goal';
  const [stage, setStage] = useState<StageId>(initialStage);
  const [itemIndex, setItemIndex] = useState(resume?.itemIndex || 0);
  const [subIndex, setSubIndex] = useState(resume?.subIndex || 0);
  const [scores, setScores] = useState<DeepLessonScoreState>(
    resume?.scores || emptyScores()
  );
  const [wrongSkills, setWrongSkills] = useState<Record<string, number>>(
    resume?.wrongSkills || {}
  );
  const [skillStats, setSkillStats] = useState<
    Record<string, { correct: number; total: number }>
  >(resume?.skillStats || {});
  const [resolved, setResolved] = useState(false);
  const [showMeaning, setShowMeaning] = useState(beginnerGuided);
  const [productionText, setProductionText] = useState('');
  const [productionFeedback, setProductionFeedback] = useState<{
    ok: boolean;
    missing: string[];
  } | null>(null);
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingAttempts, setSpeakingAttempts] = useState<number[]>([]);
  const [challengeText, setChallengeText] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState<{
    ok: boolean;
    missing: string[];
  } | null>(null);
  const [masterySaved, setMasterySaved] = useState(false);

  const vocab = lesson.stepLearn?.vocabItems || [];
  const activeMacro = getMacroIndex(stage);

  const persist = (
    nextStage = stage,
    nextItem = itemIndex,
    nextSub = subIndex,
    nextScores = scores,
    nextWrong = wrongSkills,
    nextSkillStats = skillStats
  ) => {
    if (typeof window === 'undefined') return;
    const snapshot: SessionSnapshot = {
      lessonId: lesson.id,
      stage: nextStage,
      itemIndex: nextItem,
      subIndex: nextSub,
      scores: nextScores,
      wrongSkills: nextWrong,
      skillStats: nextSkillStats,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
  };

  const resetTransient = () => {
    setResolved(false);
    setShowMeaning(beginnerGuided);
    setProductionText('');
    setProductionFeedback(null);
    setSpeakingTranscript('');
    setSpeakingScore(null);
    setIsListening(false);
    setChallengeText('');
    setChallengeFeedback(null);
  };

  const move = (next: StageId, nextItem = 0, nextSub = 0) => {
    resetTransient();
    setStage(next);
    setItemIndex(nextItem);
    setSubIndex(nextSub);
    persist(next, nextItem, nextSub);
  };

  const trackSkill = (
    skill: DeepSkill,
    correct: boolean,
    nextWrongSkills?: Record<string, number>
  ) => {
    const updatedStats = {
      ...skillStats,
      [skill]: {
        correct: (skillStats[skill]?.correct || 0) + (correct ? 1 : 0),
        total: (skillStats[skill]?.total || 0) + 1,
      },
    };
    setSkillStats(updatedStats);

    const updatedWrong =
      nextWrongSkills ||
      (correct
        ? wrongSkills
        : {
            ...wrongSkills,
            [skill]: (wrongSkills[skill] || 0) + 1,
          });
    if (!correct && !nextWrongSkills) setWrongSkills(updatedWrong);
    return { updatedStats, updatedWrong };
  };

  const resolveScoredExercise = (
    exercise: DeepExercise,
    correct: boolean,
    bucket: 'drill' | 'mastery'
  ) => {
    const nextWrong = correct
      ? wrongSkills
      : {
          ...wrongSkills,
          [exercise.skill]: (wrongSkills[exercise.skill] || 0) + 1,
        };
    const nextScores = {
      ...scores,
      [bucket]: {
        correct: scores[bucket].correct + (correct ? 1 : 0),
        total: scores[bucket].total + 1,
      },
    };
    const { updatedStats } = trackSkill(exercise.skill, correct, nextWrong);
    if (!correct) setWrongSkills(nextWrong);
    setScores(nextScores);
    setResolved(true);
    persist(stage, itemIndex, subIndex, nextScores, nextWrong, updatedStats);
  };

  const finishUnscoredExercise = (exercise: DeepExercise, correct: boolean) => {
    const nextWrong = correct
      ? wrongSkills
      : {
          ...wrongSkills,
          [exercise.skill]: (wrongSkills[exercise.skill] || 0) + 1,
        };
    const { updatedStats } = trackSkill(exercise.skill, correct, nextWrong);
    if (!correct) setWrongSkills(nextWrong);
    setResolved(true);
    persist(stage, itemIndex, subIndex, scores, nextWrong, updatedStats);
  };

  const currentConcept = deep.concepts[itemIndex];
  const currentCheckpoint = currentConcept?.checkpoint[subIndex];
  const currentDrill = guidedDrills[itemIndex];
  const currentProduction = guidedProduction[itemIndex];
  const currentSpeaking = guidedSpeaking[itemIndex];
  const currentTurn = deep.challenge.turns[itemIndex];
  const currentMastery = guidedMastery[itemIndex];

  const applicableRemediation = useMemo(() => {
    const weakSkills = Object.entries(wrongSkills)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill);

    const rules = deep.remediation.filter((rule) =>
      weakSkills.includes(rule.skill)
    );
    return rules.length ? rules : deep.remediation.slice(0, 1);
  }, [deep.remediation, wrongSkills]);

  const remediationExercises = useMemo(
    () => applicableRemediation.flatMap((rule) => rule.retry),
    [applicableRemediation]
  );
  const currentRemediation = remediationExercises[itemIndex];

  const getCurrentOverallScore = (scoreState: DeepLessonScoreState) => {
    if (!beginnerGuided) return getOverallScore(scoreState);
    const pct = getStagePercentages(scoreState);
    const values = [pct.drill, pct.mastery];
    if (scoreState.production.total > 0) values.push(pct.production);
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  const passesCurrentLesson = (
    scoreState: DeepLessonScoreState,
    stats: Record<string, { correct: number; total: number }>
  ) => {
    if (!beginnerGuided) return hasPassedLesson(lesson.id, scoreState, stats);
    return (
      scoreState.drill.total > 0 &&
      scoreState.mastery.total > 0 &&
      scoreState.production.total > 0
    );
  };

  const recordProduction = () => {
    if (!currentProduction || !productionText.trim()) return;
    const result = checkRequiredElements(
      productionText,
      currentProduction.required
    );
    const ok = result.score >= 0.66;
    const nextScores = {
      ...scores,
      production: {
        correct: scores.production.correct + (ok ? 1 : 0),
        total: scores.production.total + 1,
      },
    };
    const nextWrong = ok
      ? wrongSkills
      : {
          ...wrongSkills,
          production: (wrongSkills.production || 0) + 1,
        };
    const { updatedStats } = trackSkill('production', ok, nextWrong);
    setScores(nextScores);
    if (!ok) setWrongSkills(nextWrong);
    setProductionFeedback({ ok, missing: result.missing });
    persist(stage, itemIndex, subIndex, nextScores, nextWrong, updatedStats);
  };

  const recordChallenge = () => {
    if (!currentTurn || !challengeText.trim()) return;
    const result = checkRequiredElements(challengeText, currentTurn.required);
    const ok = result.score >= 0.66;
    const nextScores = {
      ...scores,
      challenge: {
        correct: scores.challenge.correct + (ok ? 1 : 0),
        total: scores.challenge.total + 1,
      },
    };
    const nextWrong = ok
      ? wrongSkills
      : {
          ...wrongSkills,
          communication: (wrongSkills.communication || 0) + 1,
        };
    const { updatedStats } = trackSkill('communication', ok, nextWrong);
    setScores(nextScores);
    if (!ok) setWrongSkills(nextWrong);
    setChallengeFeedback({ ok, missing: result.missing });
    persist(stage, itemIndex, subIndex, nextScores, nextWrong, updatedStats);
  };

  const startSpeaking = () => {
    if (!currentSpeaking || isListening) return;
    if (!speechService.isRecognitionSupported()) {
      setSpeakingTranscript(
        'Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Bạn có thể nghe và shadow thủ công rồi tiếp tục.'
      );
      setSpeakingScore(null);
      return;
    }

    setIsListening(true);
    setSpeakingTranscript('Đang nghe...');
    speechService.startSpeechRecognition(
      (transcript) => {
        setIsListening(false);
        setSpeakingTranscript(transcript);
        const score = speechService.calculateSimilarity(
          transcript,
          currentSpeaking.target
        );
        setSpeakingScore(score);
        setSpeakingAttempts((prev) => [...prev, score]);
      },
      (error) => {
        setIsListening(false);
        setSpeakingTranscript(
          error || 'Không dùng được micro. Bạn vẫn có thể tiếp tục bài học.'
        );
        setSpeakingScore(null);
      }
    );
  };

  const finalizeLesson = () => {
    const overall = getCurrentOverallScore(scores);
    const passed = passesCurrentLesson(scores, skillStats);
    const sortedSkills = Object.entries(skillStats)
      .filter(([, stat]) => stat.total > 0)
      .map(([skill, stat]) => ({
        skill,
        pct: Math.round((stat.correct / stat.total) * 100),
      }))
      .sort((a, b) => b.pct - a.pct);

    const strengths = sortedSkills
      .filter((s) => s.pct >= 80)
      .slice(0, 3)
      .map((s) => s.skill);
    const weaknesses = sortedSkills
      .filter((s) => s.pct < 70)
      .slice(0, 3)
      .map((s) => s.skill);

    const speakingAverage =
      speakingAttempts.length > 0
        ? Math.round(
            speakingAttempts.reduce((sum, n) => sum + n, 0) /
              speakingAttempts.length
          )
        : null;

    const speakingStatus: DeepLessonMasteryRecord['speakingStatus'] =
      speakingAverage === null
        ? 'not_attempted'
        : speakingAverage >= 80
        ? 'good'
        : speakingAverage >= 55
        ? 'developing'
        : 'attempted';

    saveMastery({
      lessonId: lesson.id,
      completed: passed,
      bestScore: overall,
      lastScore: overall,
      attempts: 0,
      strengths,
      weaknesses,
      speakingStatus,
      completedAt: passed ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });

    if (passed && !masterySaved) {
      storageService.completeLesson(lesson.id, overall);
      setMasterySaved(true);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  const goToReview = () => {
    finalizeLesson();
    move('review');
  };

  const macroProgress = macroStages.map((_, index) =>
    index < activeMacro ? 'done' : index === activeMacro ? 'active' : 'future'
  );

  const panelClass =
    'rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-0 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-screen w-full max-w-3xl flex-col bg-[#f8f8f6] sm:min-h-0 sm:max-h-[94vh] sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-[#f8f8f6]/95 px-4 py-3 backdrop-blur sm:rounded-t-3xl sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                  {lesson.level} · Bài {lesson.lessonNumber}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  ~{Math.max(12, lesson.estimatedMinutes || 12)} phút
                </span>
              </div>
              <h2 className="mt-1 truncate text-sm font-extrabold text-slate-950 sm:text-base">
                {lesson.titleVietnamese}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng bài học"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {macroStages.map((group, index) => (
              <div key={group.label} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full ${
                    macroProgress[index] === 'done'
                      ? 'bg-emerald-500'
                      : macroProgress[index] === 'active'
                      ? 'bg-amber-500'
                      : 'bg-slate-200'
                  }`}
                />
                <p
                  className={`hidden text-center text-[9px] font-bold sm:block ${
                    macroProgress[index] === 'active'
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {group.label}
                </p>
              </div>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {stage === 'goal' && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                  {beginnerGuided ? 'Dành cho người mới' : 'Mục tiêu bài học'}
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {beginnerGuided
                    ? 'Không cần biết gì trước. Cứ làm từng bước.'
                    : 'Sau bài này, bạn thực sự làm được gì?'}
                </h1>
              </div>

              <div className={panelClass}>
                {beginnerGuided ? (
                  <div className="space-y-3">
                    {[
                      'Nghe mẫu trước.',
                      'Nhìn nghĩa và quy tắc thật ngắn.',
                      'Thử vài câu. Không biết thì bấm xem đáp án.',
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-black text-amber-800">
                          {index + 1}
                        </span>
                        <p className="text-sm font-bold text-slate-800">{item}</p>
                      </div>
                    ))}
                    <p className="pt-1 text-xs leading-5 text-slate-500">
                      Không cần học thuộc ngay. Mục tiêu đầu tiên là nghe quen và hiểu ý.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deep.objectives.map((objective) => (
                      <div key={objective.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                          <Target className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-semibold leading-relaxed text-slate-800">
                          {objective.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {resume && resume.stage !== 'goal' ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                  <strong>Có phiên học chưa hoàn thành.</strong> Bạn có thể tiếp tục đúng phần đã dừng.
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => move(guidedWarmup.length ? 'warmup' : 'learn')}
                className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-slate-800"
              >
                {resume && resume.stage !== 'goal'
                  ? 'Bắt đầu lại từ đầu'
                  : beginnerGuided
                  ? 'Bắt đầu chậm từng bước'
                  : 'Bắt đầu bài học'}
              </button>
            </div>
          )}

          {stage === 'warmup' && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Khởi động · {itemIndex + 1}/{guidedWarmup.length}
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  Gọi lại kiến thức cũ
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Phần này không tính điểm. Nó chỉ giúp não bật đúng “ngăn kéo” trước khi học mới.
                </p>
              </div>

              <div className={panelClass}>
                <ExerciseRenderer
                  key={guidedWarmup[itemIndex]?.id}
                  exercise={guidedWarmup[itemIndex]}
                  onResolved={(ok) =>
                    finishUnscoredExercise(guidedWarmup[itemIndex], ok)
                  }
                />
              </div>

              {resolved ? (
                <button
                  type="button"
                  onClick={() => {
                    if (itemIndex + 1 < guidedWarmup.length) {
                      resetTransient();
                      setItemIndex((p) => p + 1);
                      persist('warmup', itemIndex + 1, 0);
                    } else {
                      move('learn');
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'learn' && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Học từ & mẫu · {vocab.length ? itemIndex + 1 : 0}/{vocab.length}
                  </p>
                  <h2 className="mt-2 text-xl font-black text-slate-950">
                    {beginnerGuided ? 'Nghe → nhìn nghĩa → đọc theo' : 'Nhìn → nghe → tự nhớ'}
                  </h2>
                </div>
              </div>

              {vocab.length ? (
                <div className={panelClass}>
                  <div className="text-center">
                    {vocab[itemIndex]?.article &&
                    vocab[itemIndex]?.article !== 'none' ? (
                      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-600">
                        {vocab[itemIndex].article}
                      </span>
                    ) : null}

                    <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                      {vocab[itemIndex]?.german}
                    </h3>

                    {vocab[itemIndex]?.pronunciation ? (
                      <p className="mt-2 font-mono text-sm font-semibold text-amber-700">
                        {vocab[itemIndex].pronunciation}
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          speechService.speak(
                            vocab[itemIndex]?.article &&
                              vocab[itemIndex]?.article !== 'none'
                              ? `${vocab[itemIndex].article} ${vocab[itemIndex].german}`
                              : vocab[itemIndex]?.german || ''
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800"
                      >
                        <Volume2 className="h-4 w-4" />
                        Nghe
                      </button>
                      {beginnerGuided ? (
                        <button
                          type="button"
                          onClick={() =>
                            speechService.speak(
                              vocab[itemIndex]?.article &&
                                vocab[itemIndex]?.article !== 'none'
                                ? `${vocab[itemIndex].article} ${vocab[itemIndex].german}`
                                : vocab[itemIndex]?.german || '',
                              0.65
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-900"
                        >
                          <Volume2 className="h-4 w-4" />
                          Nghe chậm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowMeaning((p) => !p)}
                          className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-extrabold text-slate-950"
                        >
                          {showMeaning ? 'Ẩn nghĩa' : 'Tự nhớ rồi xem nghĩa'}
                        </button>
                      )}
                    </div>

                    {showMeaning ? (
                      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left">
                        <p className="text-lg font-extrabold text-slate-900">
                          {vocab[itemIndex]?.vietnamese}
                        </p>
                        {vocab[itemIndex]?.exampleSentence ? (
                          <div className="mt-3 border-t border-slate-200 pt-3">
                            <p className="text-sm font-bold text-slate-900">
                              {vocab[itemIndex].exampleSentence}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {vocab[itemIndex].exampleTranslation}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className={panelClass}>
                  <p className="text-sm text-slate-600">
                    Bài này không có thẻ từ riêng; chuyển sang quy tắc và mẫu câu.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {itemIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMeaning(beginnerGuided);
                      setItemIndex((p) => p - 1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <ArrowLeft className="mr-1 inline h-4 w-4" /> Trước
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={vocab.length > 0 && !showMeaning}
                  onClick={() => {
                    if (vocab.length && itemIndex + 1 < vocab.length) {
                      setShowMeaning(beginnerGuided);
                      setItemIndex((p) => p + 1);
                      persist('learn', itemIndex + 1, 0);
                    } else {
                      move('concept');
                    }
                  }}
                  className="flex-1 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-35"
                >
                  {vocab.length && itemIndex + 1 < vocab.length
                    ? 'Từ tiếp theo'
                    : 'Sang phần hiểu'}
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {stage === 'concept' && currentConcept && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Quy tắc · {itemIndex + 1}/{deep.concepts.length}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {currentConcept.title}
                </h2>
              </div>

              <div className={panelClass}>
                <p className="text-sm leading-7 text-slate-700">
                  {currentConcept.explanation}
                </p>

                {currentConcept.pattern ? (
                  <div className="mt-4 rounded-xl bg-slate-950 px-4 py-4 font-mono text-sm font-bold leading-7 text-white">
                    {currentConcept.pattern}
                  </div>
                ) : null}

                <div className="mt-4 space-y-2">
                  {currentConcept.examples.map((example, idx) => (
                    <div
                      key={`${example.german}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-950">{example.german}</p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {example.vietnamese}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => speechService.speak(example.german, beginnerGuided ? 0.72 : 0.9)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-black/[0.05]"
                        aria-label={`Nghe ${example.german}`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {!beginnerGuided && currentConcept.trap ? (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-rose-700">
                      Bẫy dễ sai
                    </p>
                    <p className="mt-2 text-sm text-rose-900">
                      <span className="line-through">
                        {currentConcept.trap.wrong}
                      </span>
                      {'  →  '}
                      <strong>{currentConcept.trap.correct}</strong>
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {currentConcept.trap.reason}
                    </p>
                  </div>
                ) : null}
              </div>

              {currentCheckpoint ? (
                <div className={panelClass}>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                    {beginnerGuided ? 'Thử 1 câu · không biết cũng không sao' : 'Kiểm tra ngay'}
                  </p>
                  <ExerciseRenderer
                    key={currentCheckpoint.id}
                    exercise={currentCheckpoint}
                    beginnerHelp={beginnerGuided}
                    onResolved={(ok) =>
                      finishUnscoredExercise(currentCheckpoint, ok)
                    }
                  />
                </div>
              ) : null}

              {resolved || !currentCheckpoint ? (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      currentConcept.checkpoint &&
                      subIndex + 1 < currentConcept.checkpoint.length
                    ) {
                      resetTransient();
                      setSubIndex((p) => p + 1);
                      persist('concept', itemIndex, subIndex + 1);
                    } else if (itemIndex + 1 < deep.concepts.length) {
                      move('concept', itemIndex + 1, 0);
                    } else {
                      move('drill');
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'drill' && currentDrill && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Luyện · {itemIndex + 1}/{guidedDrills.length}
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  {beginnerGuided ? 'Thử vài câu rất ngắn' : 'Không chỉ nhận ra — phải tự nhớ'}
                </h2>
              </div>
              <div className={panelClass}>
                <ExerciseRenderer
                  key={currentDrill.id}
                  exercise={currentDrill}
                  beginnerHelp={beginnerGuided}
                  onResolved={(ok) =>
                    resolveScoredExercise(currentDrill, ok, 'drill')
                  }
                />
              </div>
              {resolved ? (
                <button
                  type="button"
                  onClick={() => {
                    if (itemIndex + 1 < guidedDrills.length) {
                      move('drill', itemIndex + 1);
                    } else {
                      move('production');
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  {itemIndex + 1 < guidedDrills.length
                    ? 'Câu tiếp theo'
                    : 'Sang phần tự dùng'}
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'production' && currentProduction && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {beginnerGuided ? 'Viết theo mẫu' : 'Tự tạo câu'} · {itemIndex + 1}/{guidedProduction.length}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {currentProduction.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {currentProduction.prompt}
                </p>
              </div>

              <div className={panelClass}>
                {beginnerGuided ? (
                  <div className="mb-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-950">
                    <span className="font-black">Nhìn mẫu trước:</span> {currentProduction.modelAnswer}
                  </div>
                ) : null}
                <textarea
                  rows={beginnerGuided ? 3 : 5}
                  disabled={Boolean(productionFeedback)}
                  value={productionText}
                  onChange={(e) => setProductionText(e.target.value)}
                  placeholder={beginnerGuided ? 'Viết lại theo mẫu...' : 'Tự viết câu của bạn ở đây...'}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-base font-semibold text-slate-950 outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{currentProduction.hint}</span>
                </div>

                {!productionFeedback ? (
                  <button
                    type="button"
                    disabled={!productionText.trim()}
                    onClick={recordProduction}
                    className="mt-4 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-35"
                  >
                    Kiểm tra câu của tôi
                  </button>
                ) : (
                  <div
                    className={`mt-4 rounded-xl border p-4 ${
                      productionFeedback.ok
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <p className="text-sm font-extrabold text-slate-950">
                      {productionFeedback.ok
                        ? 'Câu đã chứa đủ ý bắt buộc.'
                        : 'Câu còn thiếu vài thành phần quan trọng.'}
                    </p>
                    {productionFeedback.missing.length ? (
                      <p className="mt-1 text-sm text-slate-600">
                        Thiếu: {productionFeedback.missing.join(', ')}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">
                      Câu mẫu
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {currentProduction.modelAnswer}
                    </p>
                  </div>
                )}
              </div>

              {productionFeedback ? (
                <button
                  type="button"
                  onClick={() => {
                    if (itemIndex + 1 < guidedProduction.length) {
                      move('production', itemIndex + 1);
                    } else {
                      move('speaking');
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'speaking' && currentSpeaking && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Nghe & nói · {itemIndex + 1}/{guidedSpeaking.length}
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  {beginnerGuided
                    ? 'Nghe rồi nói theo'
                    : currentSpeaking.mode === 'respond'
                    ? 'Tự trả lời bằng tiếng Đức'
                    : 'Nghe rồi shadow'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {currentSpeaking.prompt}
                </p>
              </div>

              <div className={panelClass}>
                <div className="rounded-2xl bg-slate-950 p-5 text-center text-white">
                  <p className="text-xl font-black">
                    {currentSpeaking.target}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {currentSpeaking.meaning}
                  </p>
                  {currentSpeaking.pronunciation ? (
                    <p className="mt-2 font-mono text-xs text-amber-300">
                      {currentSpeaking.pronunciation}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => speechService.speak(currentSpeaking.target, 0.82)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800"
                  >
                    <Volume2 className="h-4 w-4" /> Nghe mẫu
                  </button>
                  <button
                    type="button"
                    onClick={startSpeaking}
                    disabled={isListening}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-extrabold text-slate-950 disabled:opacity-50"
                  >
                    <Mic className="h-4 w-4" />
                    {isListening ? 'Đang nghe...' : 'Nói thử'}
                  </button>
                </div>

                {speakingTranscript ? (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Máy nghe được
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {speakingTranscript}
                    </p>
                    {speakingScore !== null ? (
                      <p className="mt-2 text-sm font-extrabold text-amber-700">
                        Độ khớp: {speakingScore}%
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (itemIndex + 1 < guidedSpeaking.length) {
                    move('speaking', itemIndex + 1);
                  } else {
                    move(beginnerGuided ? 'mastery' : 'challenge');
                  }
                }}
                className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
              >
                {speakingTranscript ? 'Tiếp tục' : 'Tiếp tục không dùng mic'}
                <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          )}

          {stage === 'challenge' && currentTurn && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Tình huống thật · {itemIndex + 1}/{deep.challenge.turns.length}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {deep.challenge.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {deep.challenge.context}
                </p>
              </div>

              <div className={panelClass}>
                {currentTurn.partner ? (
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-amber-700">
                    {currentTurn.partner}
                  </p>
                ) : null}
                <p className="text-lg font-extrabold leading-relaxed text-slate-950">
                  {currentTurn.prompt}
                </p>
                <textarea
                  rows={3}
                  disabled={Boolean(challengeFeedback)}
                  value={challengeText}
                  onChange={(e) => setChallengeText(e.target.value)}
                  placeholder="Phản hồi bằng tiếng Đức..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-base font-semibold outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />

                {!challengeFeedback ? (
                  <>
                    <p className="mt-2 text-sm text-slate-500">
                      Gợi ý: {currentTurn.hint}
                    </p>
                    <button
                      type="button"
                      disabled={!challengeText.trim()}
                      onClick={recordChallenge}
                      className="mt-4 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-35"
                    >
                      Gửi câu trả lời
                    </button>
                  </>
                ) : (
                  <div
                    className={`mt-4 rounded-xl border p-4 ${
                      challengeFeedback.ok
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <p className="text-sm font-extrabold text-slate-950">
                      {challengeFeedback.ok
                        ? 'Đủ ý cho tình huống này.'
                        : 'Chưa đủ ý, xem mẫu rồi nhớ lại.'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      Mẫu: {currentTurn.sampleAnswer}
                    </p>
                  </div>
                )}
              </div>

              {challengeFeedback ? (
                <button
                  type="button"
                  onClick={() => {
                    if (itemIndex + 1 < deep.challenge.turns.length) {
                      move('challenge', itemIndex + 1);
                    } else {
                      move('mastery');
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Tiếp tục <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'mastery' && currentMastery && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                  {beginnerGuided ? 'Ôn nhanh cuối bài' : 'Mastery check'} · {itemIndex + 1}/{guidedMastery.length}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {beginnerGuided
                    ? 'Chỉ cần thử. Sai thì app sẽ chỉ lại.'
                    : 'Không nhìn lại bài. Tự nhớ và dùng.'}
                </h2>
              </div>
              <div className={panelClass}>
                <ExerciseRenderer
                  key={currentMastery.id}
                  exercise={currentMastery}
                  beginnerHelp={beginnerGuided}
                  onResolved={(ok) =>
                    resolveScoredExercise(currentMastery, ok, 'mastery')
                  }
                />
              </div>

              {resolved ? (
                <button
                  type="button"
                  onClick={() => {
                    if (itemIndex + 1 < guidedMastery.length) {
                      move('mastery', itemIndex + 1);
                      return;
                    }

                    const nextScores = scores;
                    const passed = passesCurrentLesson(nextScores, skillStats);
                    if (!passed && remediationExercises.length) {
                      move('remediation');
                    } else {
                      goToReview();
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  {itemIndex + 1 < guidedMastery.length
                    ? 'Câu tiếp theo'
                    : 'Xem kết quả'}
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'remediation' && (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-600">
                  Ôn đúng điểm yếu
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Chưa cần học lại cả bài.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Hệ thống lấy chính nhóm lỗi bạn vừa mắc và cho một lượt sửa ngắn trước khi kiểm tra lại.
                </p>
              </div>

              {itemIndex === 0 ? (
                <div className="space-y-3">
                  {applicableRemediation.map((rule) => (
                    <div key={rule.skill} className={panelClass}>
                      <p className="text-sm font-extrabold text-slate-950">
                        {rule.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {rule.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {currentRemediation ? (
                <div className={panelClass}>
                  <ExerciseRenderer
                    key={currentRemediation.id}
                    exercise={currentRemediation}
                    onResolved={(ok) =>
                      finishUnscoredExercise(currentRemediation, ok)
                    }
                  />
                </div>
              ) : null}

              {resolved ? (
                <button
                  type="button"
                  onClick={() => {
                    if (itemIndex + 1 < remediationExercises.length) {
                      move('remediation', itemIndex + 1);
                    } else {
                      const nextScores = {
                        ...scores,
                        mastery: { correct: 0, total: 0 },
                      };
                      setScores(nextScores);
                      setResolved(false);
                      setItemIndex(0);
                      persist(
                        'mastery',
                        0,
                        0,
                        nextScores,
                        wrongSkills,
                        skillStats
                      );
                      setStage('mastery');
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                >
                  {itemIndex + 1 < remediationExercises.length
                    ? 'Câu ôn tiếp theo'
                    : 'Kiểm tra lại phần cuối'}
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}

          {stage === 'review' && (() => {
            const stagePct = getStagePercentages(scores);
            const overall = getCurrentOverallScore(scores);
            const passed = passesCurrentLesson(scores, skillStats);
            const sortedSkills = Object.entries(skillStats)
              .filter(([, stat]) => stat.total > 0)
              .map(([skill, stat]) => ({
                skill,
                pct: Math.round((stat.correct / stat.total) * 100),
              }))
              .sort((a, b) => b.pct - a.pct);
            const strengths = sortedSkills.filter((s) => s.pct >= 80).slice(0, 3);
            const weak = sortedSkills.filter((s) => s.pct < 70).slice(0, 3);

            const graduationDomains =
              lesson.id === 'l_a0_10'
                ? getGraduationDomains(skillStats)
                : [];

            return (
              <div className="mx-auto max-w-2xl space-y-5">
                <div className="text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                      passed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {passed ? (
                      <Trophy className="h-8 w-8" />
                    ) : (
                      <RotateCcw className="h-8 w-8" />
                    )}
                  </div>
                  <h2 className="mt-4 text-3xl font-black text-slate-950">
                    {beginnerGuided
                      ? 'Hoàn thành lượt học đầu tiên'
                      : `${overall}% · ${scoreLabel(overall)}`}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {passed
                      ? beginnerGuided
                        ? 'Xong rồi. Bạn đã đủ để sang bài tiếp theo.'
                        : 'Bạn đã vượt mastery gate của bài này.'
                      : beginnerGuided
                      ? 'Không sao. App sẽ cho ôn lại đúng phần bạn vừa vướng.'
                      : 'Bạn đã đi hết bài nhưng còn vài điểm cần củng cố trước khi tính là thành thạo.'}
                  </p>
                </div>

                {beginnerGuided ? (
                  <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                    Lượt đầu chỉ cần <strong>nghe, hiểu và thử</strong>. Những câu bạn chưa biết đã được ghi lại để ôn sau — không cần đạt điểm cao ngay.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ['Luyện', stagePct.drill],
                      ['Tự dùng', stagePct.production],
                      ['Tình huống', stagePct.challenge],
                      ['Kiểm tra', stagePct.mastery],
                    ].map(([label, value]) => (
                      <div key={String(label)} className={panelClass}>
                        <p className="text-xs font-bold text-slate-400">
                          {String(label)}
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-950">
                          {Number(value)}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {graduationDomains.length ? (
                  <div className={panelClass}>
                    <h3 className="text-sm font-extrabold text-slate-950">
                      Hồ sơ tốt nghiệp A0
                    </h3>
                    <div className="mt-4 space-y-3">
                      {graduationDomains.map((domain) => (
                        <div key={domain.label}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-700">
                              {domain.label}
                            </span>
                            <strong className="text-slate-950">
                              {domain.pct}%
                            </strong>
                          </div>
                          <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-amber-500"
                              style={{ width: `${domain.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className={panelClass}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">
                        Bạn đã học
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {deep.recap.learned.map((item) => (
                          <li key={item} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">
                        Bạn có thể làm
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {deep.recap.canDo.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {strengths.length || weak.length ? (
                  <div className={panelClass}>
                    {strengths.length ? (
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                          Điểm chắc
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {strengths
                            .map((item) => `${item.skill} ${item.pct}%`)
                            .join(' · ')}
                        </p>
                      </div>
                    ) : null}
                    {weak.length ? (
                      <div className={strengths.length ? 'mt-4' : ''}>
                        <p className="text-xs font-black uppercase tracking-wide text-rose-600">
                          Nên ôn tiếp
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {weak
                            .map((item) => `${item.skill} ${item.pct}%`)
                            .join(' · ')}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {deep.recap.realGerman?.length ? (
                  <div className={panelClass}>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                      Real German
                    </p>
                    {deep.recap.realGerman.map((item, idx) => (
                      <div key={idx} className="mt-3">
                        <p className="text-sm text-slate-500">
                          Sách: {item.textbook}
                        </p>
                        <p className="mt-1 text-base font-extrabold text-slate-950">
                          Đời thường: {item.natural}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.note}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="grid gap-2 sm:grid-cols-2">
                  {!passed ? (
                    <button
                      type="button"
                      onClick={() => move('remediation')}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold text-slate-800"
                    >
                      <RotateCcw className="mr-1 inline h-4 w-4" />
                      Ôn đúng điểm yếu
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      if (passed) {
                        onFinishLesson(lesson.id, overall);
                      }
                      onClose();
                    }}
                    className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white"
                  >
                    {passed ? 'Hoàn tất bài' : 'Đóng và học lại sau'}
                  </button>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
};
