import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DailyDashboard } from './components/DailyDashboard';
import { RoadmapView } from './components/RoadmapView';
import { VocabularyView } from './components/VocabularyView';
import { GrammarView } from './components/GrammarView';
import { ConversationView } from './components/ConversationView';
import { AITutorView } from './components/AITutorView';
import { MistakesView } from './components/MistakesView';
import { ProgressView } from './components/ProgressView';
import { LessonPlayer } from './components/LessonPlayer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotesModal } from './components/NotesModal';
import { DailyStudySessionModal } from './components/DailyStudySessionModal';
import { storageService } from './services/storageService';
import { COURSES_DATA } from './data/coursesData';
import { UserProgress, Lesson } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'learn' | 'vocab' | 'grammar' | 'conversation' | 'tutor' | 'mistakes' | 'progress'
  >('home');

  const [progress, setProgress] = useState<UserProgress>(() => storageService.getProgress());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notesTarget, setNotesTarget] = useState<{ id?: string; title?: string }>({});
  const [isDailySessionOpen, setIsDailySessionOpen] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    refreshProgress();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshProgress = () => {
    const p = storageService.getProgress();
    setProgress(p);
    setMistakesCount(storageService.getMistakes().length);
  };

  const handleStartLesson = (lessonId: string) => {
    let found: Lesson | null = null;

    for (const course of Object.values(COURSES_DATA)) {
      for (const topic of course.topics) {
        for (const lesson of topic.lessons) {
          if (lesson.id === lessonId) {
            found = lesson;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }

    if (found) setActiveLesson(found);
  };

  const handleFinishLesson = (_lessonId: string, _score: number) => {
    setActiveLesson(null);
    refreshProgress();
  };

  const handleOpenNotes = (targetId?: string, defaultTitle?: string) => {
    setNotesTarget({ id: targetId, title: defaultTitle });
    setIsNotesOpen(true);
  };

  const handleResetProgress = () => {
    storageService.resetAll();
    refreshProgress();
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-950 font-sans selection:bg-amber-200 selection:text-slate-950">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        progress={progress}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotes={() => handleOpenNotes()}
        onOpenDailySession={() => setIsDailySessionOpen(true)}
      />

      <main className="min-h-[calc(100vh-64px)]">
        {currentView === 'home' && (
          <DailyDashboard
            progress={progress}
            onStartLesson={handleStartLesson}
            onNavigate={setCurrentView}
            onOpenDailySession={() => setIsDailySessionOpen(true)}
          />
        )}

        {currentView === 'learn' && (
          <RoadmapView progress={progress} onSelectLesson={handleStartLesson} />
        )}
        {currentView === 'vocab' && <VocabularyView onOpenNotes={handleOpenNotes} />}
        {currentView === 'grammar' && <GrammarView />}
        {currentView === 'conversation' && <ConversationView />}
        {currentView === 'tutor' && <AITutorView />}
        {currentView === 'mistakes' && <MistakesView />}
        {currentView === 'progress' && (
          <ProgressView progress={progress} onResetProgress={handleResetProgress} />
        )}
      </main>

      <BottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        mistakesCount={mistakesCount}
      />

      {activeLesson && (
        <LessonPlayer
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onFinishLesson={handleFinishLesson}
        />
      )}

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={(lessonId) => {
          setIsSearchOpen(false);
          handleStartLesson(lessonId);
        }}
        onSelectGrammar={() => {
          setIsSearchOpen(false);
          setCurrentView('grammar');
        }}
      />

      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        targetId={notesTarget.id}
        defaultTitle={notesTarget.title}
      />

      <DailyStudySessionModal
        isOpen={isDailySessionOpen}
        onClose={() => setIsDailySessionOpen(false)}
        onCompleted={refreshProgress}
      />
    </div>
  );
}
