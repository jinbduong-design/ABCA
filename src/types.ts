export type LevelId = 'A0' | 'A1' | 'A2';

export type ArticleType = 'der' | 'die' | 'das' | 'none' | 'plural-die';

export type WordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'phrase'
  | 'number';

export type VocabStatus = 'new' | 'learning' | 'mastered' | 'review_due';

export type MistakeCategory =
  | 'vocabulary'
  | 'grammar'
  | 'article'
  | 'sentence_order'
  | 'translation'
  | 'listening';

export interface VocabularyItem {
  id: string;
  german: string;
  article?: ArticleType;
  plural?: string;
  vietnamese: string;
  english: string;
  exampleSentence: string;
  exampleTranslation: string;
  pronunciation: string; // Vietnamese approximation / IPA
  wordType: WordType;
  topicId?: string;
  topic?: string;
  level: LevelId;
  status?: VocabStatus;
  mistakesCount?: number;
  lastReviewed?: string; // ISO date
  nextReviewDate?: string; // ISO date
  srsIntervalDays?: number; // 0, 1, 3, 7, 14, 30
  isFavorite?: boolean;
  conjugations?: {
    ich?: string;
    du?: string;
    er_sie_es?: string;
    wir?: string;
    ihr?: string;
    sie_Sie?: string;
  };
}

export interface FlashcardItem {
  id: string;
  vocabId: string;
  german: string;
  article?: ArticleType;
  vietnamese: string;
  repetitionBox: number; // 1 to 5
  nextReviewDate: string; // ISO date
  lastReviewedDate?: string;
  intervalDays: number;
}

export interface GrammarLesson {
  id: string;
  level: LevelId;
  order: number;
  title: string;
  germanTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  vietnameseExplanation: string;
  formula?: string;
  examples: {
    german: string;
    vietnamese: string;
    highlight?: string;
  }[];
  commonMistakes: {
    wrong: string;
    correct: string;
    reason: string;
  }[];
  practiceQuestions: Exercise[];
}

export type ExerciseType =
  | 'multiple_choice'
  | 'match'
  | 'match_pairs'
  | 'fill_blank'
  | 'reorder'
  | 'choose_article'
  | 'listen_select'
  | 'translate_to_de'
  | 'translate_to_vn'
  | 'translation';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  instruction: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string | string[];
  pairs?: { german: string; vietnamese: string }[];
  wordsToReorder?: string[];
  explanation: string;
  category: MistakeCategory;
  hint?: string;
}

export interface SpeakingItem {
  id: string;
  sentence: string;
  vietnameseMeaning: string;
  pronunciationGuide: string;
  audioSlow?: boolean;
  tips?: string;
}

export interface LessonStepLearn {
  vocabItems: VocabularyItem[];
  grammarConcept?: {
    title: string;
    summary: string;
    rule: string;
    examples: { german: string; vietnamese: string }[];
  };
}

export interface LessonStepUnderstand {
  title: string;
  contentVietnamese: string;
  bulletPoints: string[];
  ruleTip?: string;
  contrastWithVietnamese?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  level: LevelId;
  lessonNumber: number;
  title: string;
  titleVietnamese: string;
  estimatedMinutes: number;
  description: string;
  stepLearn: LessonStepLearn;
  stepUnderstand: LessonStepUnderstand;
  stepPractice: Exercise[];
  stepSpeak: SpeakingItem[];
  stepMiniTest: Exercise[]; // 5 questions
}

export interface Topic {
  id: string;
  level: LevelId;
  order: number;
  title: string;
  titleVietnamese: string;
  iconName: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  level: LevelId;
  title: string;
  description: string;
  topics: Topic[];
}

export interface MistakeItem {
  id: string;
  questionId?: string;
  category: MistakeCategory | string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  lessonId?: string;
  timestamp?: string;
}

export interface MistakeEntry {
  id: string;
  exerciseId: string;
  category: MistakeCategory;
  questionText: string;
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: string;
  reviewedTimes: number;
  mastered: boolean;
}

export interface UserNote {
  id: string;
  targetId?: string;
  targetType?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  updatedAt: string;
}

export interface PersonalNote {
  id: string;
  targetType: 'vocabulary' | 'grammar' | 'lesson' | 'custom';
  targetId?: string;
  targetTitle: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId?: string;
  currentLevel?: LevelId;
  streak?: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalStudyTimeMinutes: number;
  totalStudyMinutes: number;
  completedLessons: string[];
  completedLessonIds?: string[];
  completedExerciseIds?: string[];
  wordsLearned: number;
  totalCorrectAnswers?: number;
  totalIncorrectAnswers?: number;
  dailyGoalMinutes: number;
  dailyGoalLessons: number;
  todayMinutes: number;
  todayLessonsCompleted: number;
  studyLogs?: any[];
  favoriteVocabIds?: string[];
  vocabStatusMap?: Record<
    string,
    {
      status: VocabStatus;
      mistakes: number;
      interval: number;
      nextReviewDate: string;
    }
  >;
}

export interface ConversationScenario {
  id: string;
  title: string;
  titleVietnamese: string;
  level: LevelId;
  category: string;
  iconName: string;
  location: string;
  context: string;
  aiRole: string;
  userRole?: string;
  starterMessage: string;
  starterTranslation: string;
  goal: string;
  suggestedPhrases: { german: string; vietnamese: string }[];
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  translationVietnamese?: string;
  translation?: string;
  correction?: {
    hasMistake: boolean;
    better: string;
    explanation: string;
  };
  timestamp: string;
}

export type ChatMessage = ConversationMessage;
