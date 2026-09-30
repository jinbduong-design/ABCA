export type DeepExerciseKind =
  | 'choice'
  | 'input'
  | 'reorder'
  | 'listen'
  | 'correct';

export type DeepSkill =
  | 'vocabulary'
  | 'grammar'
  | 'word_order'
  | 'listening'
  | 'pronunciation'
  | 'translation'
  | 'article'
  | 'production'
  | 'communication';

export interface DeepObjective {
  id: string;
  kind: 'knowledge' | 'production' | 'error_avoidance';
  text: string;
}

export interface DeepExercise {
  id: string;
  kind: DeepExerciseKind;
  skill: DeepSkill;
  prompt: string;
  instruction?: string;
  options?: string[];
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
  audioText?: string;
  words?: string[];
  conceptId?: string;
  difficulty?: 1 | 2 | 3;
}

export interface DeepConcept {
  id: string;
  title: string;
  explanation: string;
  pattern?: string;
  examples: Array<{
    german: string;
    vietnamese: string;
  }>;
  trap?: {
    wrong: string;
    correct: string;
    reason: string;
  };
  checkpoint: DeepExercise[];
}

export interface ProductionTask {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  required: string[];
  modelAnswer: string;
}

export interface DeepSpeakingTask {
  id: string;
  mode: 'shadow' | 'respond';
  prompt: string;
  target: string;
  meaning: string;
  pronunciation?: string;
  minSimilarity?: number;
}

export interface ChallengeTurn {
  id: string;
  partner?: string;
  prompt: string;
  required: string[];
  sampleAnswer: string;
  hint: string;
}

export interface DeepChallenge {
  id: string;
  title: string;
  context: string;
  goal: string;
  turns: ChallengeTurn[];
}

export interface DeepRemediation {
  skill: DeepSkill;
  title: string;
  explanation: string;
  retry: DeepExercise[];
}

export interface DeepLesson {
  version: 2;
  objectives: DeepObjective[];
  warmup: DeepExercise[];
  concepts: DeepConcept[];
  drills: DeepExercise[];
  production: ProductionTask[];
  speaking: DeepSpeakingTask[];
  challenge: DeepChallenge;
  mastery: DeepExercise[];
  remediation: DeepRemediation[];
  recap: {
    learned: string[];
    canDo: string[];
    commonMistakes: string[];
    realGerman?: Array<{
      textbook: string;
      natural: string;
      note: string;
    }>;
    nextLessonId?: string;
  };
}

export interface StageScore {
  correct: number;
  total: number;
}

export interface DeepLessonScoreState {
  drill: StageScore;
  production: StageScore;
  challenge: StageScore;
  mastery: StageScore;
}

export interface DeepLessonMasteryRecord {
  lessonId: string;
  completed: boolean;
  bestScore: number;
  lastScore: number;
  attempts: number;
  strengths: string[];
  weaknesses: string[];
  speakingStatus: 'not_attempted' | 'attempted' | 'developing' | 'good';
  completedAt?: string;
  updatedAt: string;
}
