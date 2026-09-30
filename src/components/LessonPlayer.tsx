import React from 'react';
import { Lesson } from '../types';
import { getDeepA0Lesson } from '../data/a0DeepLessons';
import { DeepLessonPlayer } from './lesson/DeepLessonPlayer';
import { LegacyLessonPlayer } from './lesson/LegacyLessonPlayer';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
  onFinishLesson: (lessonId: string, score: number) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = (props) => {
  const deep = getDeepA0Lesson(props.lesson.id);

  if (deep) {
    return <DeepLessonPlayer {...props} deep={deep} />;
  }

  return <LegacyLessonPlayer {...props} />;
};
