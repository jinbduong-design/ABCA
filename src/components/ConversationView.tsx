import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Coffee,
  Compass,
  Heart,
  Home,
  Lightbulb,
  MessageSquare,
  Mic,
  MicOff,
  Plane,
  Play,
  RefreshCw,
  Send,
  ShoppingBag,
  Smile,
  Sparkles,
  Target,
  Train,
  Utensils,
  Volume2,
} from 'lucide-react';
import { CONVERSATION_SCENARIOS } from '../data/conversationsData';
import { ConversationMessage, ConversationScenario, LevelId } from '../types';
import {
  ConversationResponse,
  sendConversationMessage,
} from '../services/aiTutorService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

const ICON_MAP: Record<string, any> = {
  Coffee,
  ShoppingBag,
  Train,
  Plane,
  Home,
  Compass,
  Activity,
  Briefcase,
  Heart,
  Smile,
  Utensils,
  MessageCircle: MessageSquare,
};

const STARTER_ENGLISH: Record<string, string> = {
  sc_meeting: "Hi! My name is Lukas. What's your name and where are you from?",
  sc_a0_greeting: 'Hi! How are you?',
  sc_a0_phone: "What's your phone number?",
  sc_a0_cafe_simple: 'Hi! What would you like?',
  sc_cafe: 'Hello! What can I get you?',
  sc_restaurant: 'Good evening! Do you have a reservation or would you like a free table?',
  sc_supermarket: 'Hello! Can I help you find something?',
  sc_train_station: 'Hello! Where would you like to travel?',
  sc_airport: 'Good morning! Your passport and flight ticket, please.',
  sc_hotel: 'Good evening! Welcome to the hotel. Do you have a reservation?',
  sc_directions: 'Excuse me, are you looking for something? Can I help you?',
  sc_doctor: "Hello! What's wrong? Where are you in pain?",
  sc_workplace: 'Hi! Do you have a moment? We need to talk about the new project.',
  sc_making_friends: 'Hi! Feel free to sit with us. What do you usually do on weekends?',
  sc_dating: 'Nice to see you! You look great today. How was your day?',
  sc_daily: "Hey, how are you? The weather is really unpleasant today, isn't it?",
};

type PracticeMode = 'guided' | 'natural' | 'challenge';
type LevelFilter = 'recommended' | LevelId;

interface ConversationViewProps {
  currentLevel: LevelId;
}

interface SavedConversationSession {
  id: string;
  scenarioId: string;
  title: string;
  level: LevelId;
  mode: PracticeMode;
  turns: number;
  progress: number;
  corrections: number;
  completedAt: string;
}

const SESSION_KEY = 'deutschstart_conversation_sessions_v1';

const MODE_CONFIG: Record<PracticeMode, { label: string; description: string }> = {
  guided: {
    label: 'Có hướng dẫn',
    description: 'German + English. Có gợi ý khi bí.',
  },
  natural: {
    label: 'Tự nhiên',
    description: 'Ít gợi ý hơn, vẫn có English ở dưới.',
  },
  challenge: {
    label: 'Thử thách',
    description: 'Tự phản xạ trước, hỗ trợ khi cần.',
  },
};

function readSessions(): SavedConversationSession[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function clampProgress(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export const ConversationView: React.FC<ConversationViewProps> = ({ currentLevel }) => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('guided');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('recommended');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPhraseBank, setShowPhraseBank] = useState(true);
  const [shownVietnamese, setShownVietnamese] = useState<Record<string, boolean>>({});
  const [shownPhraseVietnamese, setShownPhraseVietnamese] = useState<Record<string, boolean>>({});
  const [latestFeedback, setLatestFeedback] = useState<ConversationResponse['microFeedback']>();
  const [mission, setMission] = useState<ConversationResponse['missionProgress']>();
  const [recentSessions, setRecentSessions] = useState<SavedConversationSession[]>(() => readSessions());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const recommendedScenario = useMemo(
    () =>
      CONVERSATION_SCENARIOS.find((scenario) => scenario.level === currentLevel) ||
      CONVERSATION_SCENARIOS[0],
    [currentLevel]
  );

  const visibleScenarios = useMemo(() => {
    if (levelFilter === 'recommended') {
      const sameLevel = CONVERSATION_SCENARIOS.filter(
        (scenario) => scenario.level === currentLevel
      );
      return sameLevel.length ? sameLevel : CONVERSATION_SCENARIOS.slice(0, 4);
    }
    return CONVERSATION_SCENARIOS.filter((scenario) => scenario.level === levelFilter);
  }, [currentLevel, levelFilter]);

  const userTurns = useMemo(
    () => messages.filter((message) => message.sender === 'user').length,
    [messages]
  );

  const correctionCount = useMemo(
    () =>
      messages.filter(
        (message) => message.sender === 'ai' && Boolean(message.correction?.hasMistake)
      ).length,
    [messages]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, latestFeedback]);

  const startScenario = (scenario: ConversationScenario) => {
    const initialMessage: ConversationMessage = {
      id: 'msg_' + Date.now(),
      sender: 'ai',
      text: scenario.starterMessage,
      translationEnglish: scenario.starterEnglish || STARTER_ENGLISH[scenario.id],
      translationVietnamese: scenario.starterTranslation,
      timestamp: new Date().toISOString(),
    };

    setSelectedScenario(scenario);
    setMessages([initialMessage]);
    setInputText('');
    setLatestFeedback(undefined);
    setMission({
      percent: 0,
      achieved: [],
      nextMission: 'Trả lời câu mở đầu.',
      complete: false,
    });
    setShownVietnamese({});
    setShownPhraseVietnamese({});
    setShowPhraseBank(practiceMode !== 'challenge');
    speechService.speak(scenario.starterMessage, practiceMode === 'guided' ? 0.82 : 0.95);
  };

  const saveCurrentSession = () => {
    if (!selectedScenario || userTurns === 0) return;

    const next: SavedConversationSession = {
      id: 'session_' + Date.now(),
      scenarioId: selectedScenario.id,
      title: selectedScenario.titleVietnamese,
      level: selectedScenario.level,
      mode: practiceMode,
      turns: userTurns,
      progress: clampProgress(mission?.percent),
      corrections: correctionCount,
      completedAt: new Date().toISOString(),
    };

    const updated = [next, ...recentSessions].slice(0, 12);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    storageService.markExternalChange();
    setRecentSessions(updated);
  };

  const leaveScenario = () => {
    saveCurrentSession();
    speechService.stop();
    speechService.stopSpeechRecognition();
    setIsListening(false);
    setSelectedScenario(null);
    setMessages([]);
    setLatestFeedback(undefined);
    setMission(undefined);
  };

  const resetConversation = () => {
    if (!selectedScenario) return;
    startScenario(selectedScenario);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedScenario || isLoading) return;

    const userMsg: ConversationMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMsg]);
    setInputText('');
    setIsLoading(true);

    const history = messages.map((message) => ({
      sender: message.sender === 'user' ? 'user' : 'model',
      text: message.text,
    }));

    try {
      const res = await sendConversationMessage({
        scenarioTitle: selectedScenario.title,
        scenarioContext: selectedScenario.context,
        scenarioGoal: selectedScenario.goal,
        userLevel: currentLevel,
        practiceMode,
        suggestedPhrases: selectedScenario.suggestedPhrases,
        turnNumber: userTurns + 1,
        userMessage: text,
        history,
      });

      const aiMessage: ConversationMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: res.aiReply,
        translationEnglish: res.aiReplyEnglish,
        translationVietnamese: res.aiReplyTranslation,
        correction: res.correction?.hasMistake ? res.correction : undefined,
        timestamp: new Date().toISOString(),
      };

      setMessages((current) => [...current, aiMessage]);
      setLatestFeedback(res.microFeedback);

      if (res.missionProgress) {
        setMission({
          ...res.missionProgress,
          percent: clampProgress(res.missionProgress.percent),
        });
      }

      speechService.speak(res.aiReply, practiceMode === 'guided' ? 0.82 : 0.95);
      storageService.addStudyTime(1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'AI đang tạm thời không khả dụng. Hãy thử lại sau.';
      setMessages((current) => [
        ...current,
        {
          id: 'ai_error_' + Date.now(),
          sender: 'ai',
          text: message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setLatestFeedback(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopSpeechRecognition();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    speechService.startSpeechRecognition(
      (transcript) => {
        setIsListening(false);
        setInputText(transcript);
      },
      () => setIsListening(false)
    );
  };

  if (!selectedScenario) {
    return (
      <div className="mx-auto max-w-[1080px] px-3 pb-24 pt-4 sm:px-6 sm:pb-10 sm:pt-7 animate-fadeIn">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">
              Hội thoại
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
              Nói trong tình huống thật
            </h1>
            <p className="mt-2 hidden max-w-xl text-sm leading-6 text-slate-500 sm:block">
              Tiếng Đức ở trên, English ở dưới. Chỉ mở tiếng Việt khi thật sự cần.
            </p>
          </div>
          <div className="rounded-xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-black/[0.05]">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
              Trình độ
            </p>
            <p className="text-sm font-black text-slate-950">{currentLevel}</p>
          </div>
        </header>

        {recommendedScenario && (
          <button
            type="button"
            onClick={() => startScenario(recommendedScenario)}
            className="mt-5 flex w-full items-center gap-4 rounded-[22px] bg-slate-950 p-5 text-left text-white"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400 text-slate-950">
              <Play className="h-5 w-5 fill-current" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-300">
                Bắt đầu nhanh · {recommendedScenario.level}
              </span>
              <span className="mt-1 block truncate text-base font-black">
                {recommendedScenario.titleVietnamese}
              </span>
            </span>
            <span className="text-xs font-black text-slate-400">5–8 phút</span>
          </button>
        )}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ['recommended', 'Phù hợp'],
              ['A0', 'A0'],
              ['A1', 'A1'],
              ['A2', 'A2'],
            ] as [LevelFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setLevelFilter(value)}
              className={
                'shrink-0 rounded-full px-3 py-2 text-xs font-black ' +
                (levelFilter === value
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white text-slate-500 ring-1 ring-black/[0.06]')
              }
            >
              {label}
            </button>
          ))}
        </div>

        <section className="mt-4">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-base font-black text-slate-950">
              Chọn một việc bạn muốn nói được
            </h2>
            <span className="text-[10px] font-bold text-slate-400">
              {visibleScenarios.length} bài
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleScenarios.map((scenario) => {
              const Icon = ICON_MAP[scenario.iconName] || MessageSquare;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => startScenario(scenario)}
                  className="rounded-[18px] border border-black/[0.06] bg-white p-4 text-left transition hover:border-amber-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-500">
                      {scenario.level}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-black leading-5 text-slate-950">
                    {scenario.titleVietnamese}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {scenario.goal}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {recentSessions.length > 0 && (
          <section className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-black text-slate-950">Phiên gần đây</h2>
            </div>
            <div className="mt-2 divide-y divide-slate-100">
              {recentSessions.slice(0, 3).map((session) => {
                const scenario = CONVERSATION_SCENARIOS.find(
                  (item) => item.id === session.scenarioId
                );
                return (
                  <button
                    key={session.id}
                    type="button"
                    disabled={!scenario}
                    onClick={() => scenario && startScenario(scenario)}
                    className="flex w-full items-center gap-3 py-3 text-left disabled:opacity-50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-600">
                      {session.level}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-black text-slate-900">
                        {session.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
                        {session.turns} lượt · {session.progress}%
                      </span>
                    </span>
                    <span className="text-[10px] font-black text-amber-700">Luyện lại</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  const missionPercent = clampProgress(mission?.percent);

  return (
    <div className="flex h-[calc(100dvh-116px)] w-full flex-col overflow-hidden bg-white lg:h-[calc(100dvh-64px)] animate-fadeIn">
      <header className="shrink-0 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
          <button
            onClick={leaveScenario}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-950">
              {selectedScenario.titleVietnamese}
            </p>
            <p className="truncate text-[10px] font-semibold text-slate-400">
              {selectedScenario.aiRole} · lượt {userTurns}
            </p>
          </div>

          <button
            onClick={resetConversation}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400"
            aria-label="Bắt đầu lại"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 pb-2.5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-bold text-slate-500">
              <Target className="h-3.5 w-3.5 shrink-0 text-amber-700" />
              <span className="truncate">
                {mission?.nextMission || selectedScenario.goal}
              </span>
            </div>
            <span className="shrink-0 text-[10px] font-black text-slate-400">
              {missionPercent}%
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: String(missionPercent) + '%' }}
            />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto border-t border-slate-100 bg-[#fafaf9] px-3 py-2 sm:px-5">
          {(Object.keys(MODE_CONFIG) as PracticeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setPracticeMode(mode);
                setShowPhraseBank(mode !== 'challenge');
              }}
              className={
                'shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black ' +
                (practiceMode === mode
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-500 ring-1 ring-black/[0.05]')
              }
            >
              {MODE_CONFIG[mode].label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const viOpen = shownVietnamese[message.id];

          return (
            <div
              key={message.id}
              className={'flex flex-col ' + (isUser ? 'items-end' : 'items-start')}
            >
              <div
                className={
                  'max-w-[92%] px-3.5 py-2.5 text-sm leading-6 sm:max-w-[72%] ' +
                  (isUser
                    ? 'rounded-2xl rounded-br-md bg-slate-950 text-white'
                    : 'border-l-2 border-amber-400 pl-3 text-slate-900')
                }
              >
                <div className="flex items-start gap-2.5">
                  <p className="flex-1 font-semibold">{message.text}</p>
                  <button
                    onClick={() =>
                      speechService.speak(
                        message.text,
                        practiceMode === 'guided' ? 0.82 : 0.95
                      )
                    }
                    className="mt-0.5 shrink-0 text-slate-400"
                    aria-label="Nghe câu"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {!isUser && message.translationEnglish && (
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {message.translationEnglish}
                  </p>
                )}

                {!isUser && message.translationVietnamese && (
                  <>
                    {viOpen && (
                      <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-xs leading-5 text-amber-800">
                        {message.translationVietnamese}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShownVietnamese((current) => ({
                          ...current,
                          [message.id]: !current[message.id],
                        }))
                      }
                      className="mt-1.5 text-[10px] font-black text-amber-700"
                    >
                      {viOpen ? 'Ẩn tiếng Việt' : 'Không hiểu? Xem tiếng Việt'}
                    </button>
                  </>
                )}
              </div>

              {message.correction && (
                <div className="mt-2 max-w-[88%] border-l-2 border-blue-300 pl-3 text-xs leading-5 text-slate-600 sm:max-w-[72%]">
                  <p className="flex items-center gap-1.5 font-black text-blue-700">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Sửa 1 điểm
                  </p>
                  <p className="mt-0.5 font-black text-slate-950">
                    {message.correction.better}
                  </p>
                  <p className="mt-0.5">{message.correction.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            {selectedScenario.aiRole} đang trả lời…
          </div>
        )}

        {latestFeedback && !isLoading && (
          <div className="border-t border-slate-100 pt-3">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Sau lượt này
            </p>
            {latestFeedback.whatWentWell && (
              <p className="mt-1.5 text-xs leading-5 text-slate-700">
                <span className="font-black">Làm được:</span> {latestFeedback.whatWentWell}
              </p>
            )}
            {latestFeedback.oneFix && (
              <p className="mt-1 text-xs leading-5 text-slate-700">
                <span className="font-black">Chỉnh:</span> {latestFeedback.oneFix}
              </p>
            )}
            {latestFeedback.usefulPhrase && (
              <p className="mt-1 text-xs leading-5 text-slate-700">
                <span className="font-black">Câu mang đi:</span> {latestFeedback.usefulPhrase}
              </p>
            )}
          </div>
        )}

        {mission?.complete && !isLoading && (
          <div className="border-t border-emerald-100 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <p className="text-sm font-black text-emerald-950">
                Đã hoàn thành mục tiêu tình huống
              </p>
            </div>
            <button
              type="button"
              onClick={leaveScenario}
              className="mt-3 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white"
            >
              Kết thúc & lưu phiên
            </button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-white">
        {practiceMode !== 'challenge' && (
          <div className="px-3 pt-2.5 sm:px-5">
            <button
              type="button"
              onClick={() => setShowPhraseBank((value) => !value)}
              className="flex items-center gap-1.5 text-[10px] font-black text-slate-500"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
              {showPhraseBank ? 'Ẩn gợi ý' : 'Bí thì xem gợi ý'}
            </button>

            {showPhraseBank && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {selectedScenario.suggestedPhrases.map((phrase) => {
                  const viOpen = shownPhraseVietnamese[phrase.german];
                  return (
                    <div
                      key={phrase.german}
                      className="min-w-[185px] shrink-0 rounded-xl bg-[#f7f7f5] px-3 py-2 ring-1 ring-black/[0.05]"
                    >
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSendMessage(phrase.german)}
                        className="block w-full text-left text-xs font-black text-slate-900"
                      >
                        {phrase.german}
                      </button>
                      {phrase.english && (
                        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                          {phrase.english}
                        </p>
                      )}
                      {viOpen && (
                        <p className="mt-1 text-[10px] leading-4 text-amber-800">
                          {phrase.vietnamese}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setShownPhraseVietnamese((current) => ({
                            ...current,
                            [phrase.german]: !current[phrase.german],
                          }))
                        }
                        className="mt-1 text-[9px] font-black text-amber-700"
                      >
                        {viOpen ? 'Ẩn Việt' : 'Việt'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <footer className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
          <button
            onClick={handleToggleMic}
            className={
              'grid h-11 w-11 shrink-0 place-items-center rounded-xl ' +
              (isListening ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600')
            }
            aria-label={isListening ? 'Dừng nghe' : 'Nói'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <input
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSendMessage();
            }}
            disabled={isLoading}
            placeholder="Nói hoặc gõ tiếng Đức…"
            className="min-h-11 min-w-0 flex-1 rounded-xl bg-[#f7f7f5] px-3.5 text-sm font-medium outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500 text-slate-950 disabled:opacity-30"
            aria-label="Gửi"
          >
            <Send className="h-5 w-5" />
          </button>
        </footer>
      </div>
    </div>
  );
};
