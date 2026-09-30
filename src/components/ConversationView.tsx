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

const MODE_CONFIG: Record<
  PracticeMode,
  { label: string; description: string }
> = {
  guided: {
    label: 'Có hướng dẫn',
    description: 'Có dịch, gợi ý và sửa 1 lỗi quan trọng.',
  },
  natural: {
    label: 'Tự nhiên',
    description: 'Ít gợi ý hơn, hội thoại giống đời thật.',
  },
  challenge: {
    label: 'Thử thách',
    description: 'Tự phản xạ trước, chỉ xem trợ giúp khi cần.',
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

export const ConversationView: React.FC<ConversationViewProps> = ({
  currentLevel,
}) => {
  const [selectedScenario, setSelectedScenario] =
    useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('guided');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('recommended');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPhraseBank, setShowPhraseBank] = useState(true);
  const [shownTranslations, setShownTranslations] = useState<Record<string, boolean>>({});
  const [latestFeedback, setLatestFeedback] =
    useState<ConversationResponse['microFeedback']>();
  const [mission, setMission] =
    useState<ConversationResponse['missionProgress']>();
  const [recentSessions, setRecentSessions] =
    useState<SavedConversationSession[]>(() => readSessions());
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
    return CONVERSATION_SCENARIOS.filter(
      (scenario) => scenario.level === levelFilter
    );
  }, [currentLevel, levelFilter]);

  const userTurns = useMemo(
    () => messages.filter((message) => message.sender === 'user').length,
    [messages]
  );

  const correctionCount = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.sender === 'ai' && Boolean(message.correction?.hasMistake)
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
      nextMission: 'Trả lời câu mở đầu của nhân vật.',
      complete: false,
    });
    setShownTranslations({});
    setShowPhraseBank(practiceMode === 'guided');
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
    setMessages([
      {
        id: 'msg_' + Date.now(),
        sender: 'ai',
        text: selectedScenario.starterMessage,
        translationVietnamese: selectedScenario.starterTranslation,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInputText('');
    setLatestFeedback(undefined);
    setMission({
      percent: 0,
      achieved: [],
      nextMission: 'Trả lời câu mở đầu của nhân vật.',
      complete: false,
    });
    setShownTranslations({});
    speechService.speak(
      selectedScenario.starterMessage,
      practiceMode === 'guided' ? 0.82 : 0.95
    );
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
      speechService.speak(
        res.aiReply,
        practiceMode === 'guided' ? 0.82 : 0.95
      );
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

  const toggleTranslation = (messageId: string) => {
    setShownTranslations((current) => ({
      ...current,
      [messageId]: !current[messageId],
    }));
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
              Mỗi phiên có mục tiêu cụ thể. AI giữ đúng vai, chỉ sửa một lỗi quan trọng và dẫn bạn đến khi hoàn thành tình huống.
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
            className="mt-5 flex w-full items-center gap-4 rounded-[24px] bg-slate-950 p-5 text-left text-white shadow-sm"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-slate-950">
              <Play className="h-5 w-5 fill-current" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-300">
                Bắt đầu nhanh · {recommendedScenario.level}
              </span>
              <span className="mt-1 block truncate text-base font-black">
                {recommendedScenario.titleVietnamese}
              </span>
              <span className="mt-1 hidden text-xs leading-5 text-slate-400 sm:block">
                {recommendedScenario.goal}
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
                'shrink-0 rounded-full px-3 py-2 text-xs font-black transition ' +
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
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Tình huống
              </p>
              <h2 className="mt-0.5 text-base font-black text-slate-950">
                Chọn một việc bạn muốn nói được
              </h2>
            </div>
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
                  className="group rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm transition hover:border-amber-200"
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
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold text-slate-400">
                      {scenario.category}
                    </span>
                    <span className="text-[10px] font-black text-amber-700">
                      Luyện ngay →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {recentSessions.length > 0 && (
          <section className="mt-6 rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-black text-slate-950">Phiên gần đây</h2>
            </div>
            <div className="mt-3 divide-y divide-slate-100">
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
                        {session.turns} lượt · tiến độ {session.progress}%
                      </span>
                    </span>
                    <span className="text-[10px] font-black text-amber-700">
                      Luyện lại
                    </span>
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
  const activeMode = MODE_CONFIG[practiceMode];

  return (
    <div className="mx-auto max-w-4xl px-2 pb-[calc(72px+env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-8 sm:pt-5 animate-fadeIn">
      <section
        className="flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-sm sm:rounded-[24px]"
        style={{
          height:
            'calc(100dvh - 142px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
          minHeight: '430px',
        }}
      >
        <header className="shrink-0 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 px-2.5 py-2.5 sm:px-4 sm:py-3">
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
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"
              aria-label="Bắt đầu lại"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3 pb-3 sm:px-4">
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
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: String(missionPercent) + '%' }}
              />
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto border-t border-slate-100 bg-[#fafaf9] px-3 py-2">
            {(Object.keys(MODE_CONFIG) as PracticeMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setPracticeMode(mode);
                  if (mode === 'guided') setShowPhraseBank(true);
                  if (mode === 'challenge') setShowPhraseBank(false);
                }}
                className={
                  'shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black transition ' +
                  (practiceMode === mode
                    ? 'bg-slate-950 text-white'
                    : 'bg-white text-slate-500 ring-1 ring-black/[0.05]')
                }
              >
                {MODE_CONFIG[mode].label}
              </button>
            ))}
            <span className="my-auto hidden text-[10px] font-semibold text-slate-400 sm:inline">
              {activeMode.description}
            </span>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-3 sm:p-4">
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            const showTranslation =
              practiceMode === 'guided' || shownTranslations[message.id];

            return (
              <div
                key={message.id}
                className={'flex flex-col ' + (isUser ? 'items-end' : 'items-start')}
              >
                <div
                  className={
                    'max-w-[90%] rounded-[18px] px-3.5 py-2.5 text-sm leading-6 sm:max-w-[76%] ' +
                    (isUser
                      ? 'rounded-br-md bg-slate-950 text-white'
                      : 'rounded-bl-md bg-[#f7f7f5] text-slate-900')
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

                  {!isUser && message.translationVietnamese && showTranslation && (
                    <p className="mt-2 border-t border-black/[0.06] pt-2 text-xs text-slate-500">
                      {message.translationVietnamese}
                    </p>
                  )}

                  {!isUser &&
                    message.translationVietnamese &&
                    practiceMode !== 'guided' && (
                      <button
                        type="button"
                        onClick={() => toggleTranslation(message.id)}
                        className="mt-2 text-[10px] font-black text-amber-700"
                      >
                        {shownTranslations[message.id] ? 'Ẩn nghĩa' : 'Cần dịch'}
                      </button>
                    )}
                </div>

                {message.correction && (
                  <div className="mt-1.5 max-w-[88%] rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-slate-700 sm:max-w-[78%]">
                    <p className="flex items-center gap-1.5 font-black text-amber-800">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Sửa đúng 1 điểm
                    </p>
                    <p className="mt-1 font-black text-slate-950">
                      {message.correction.better}
                    </p>
                    <p className="mt-0.5 text-slate-600">
                      {message.correction.explanation}
                    </p>
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
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Sau lượt này
              </p>
              {latestFeedback.whatWentWell && (
                <p className="mt-2 text-xs leading-5 text-blue-950">
                  <span className="font-black">Làm được:</span>{' '}
                  {latestFeedback.whatWentWell}
                </p>
              )}
              {latestFeedback.oneFix && (
                <p className="mt-1 text-xs leading-5 text-blue-950">
                  <span className="font-black">Chỉnh 1 điểm:</span>{' '}
                  {latestFeedback.oneFix}
                </p>
              )}
              {latestFeedback.usefulPhrase && (
                <p className="mt-1 text-xs leading-5 text-blue-950">
                  <span className="font-black">Câu mang đi:</span>{' '}
                  {latestFeedback.usefulPhrase}
                </p>
              )}
            </div>
          )}

          {mission?.complete && !isLoading && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <p className="text-sm font-black text-emerald-950">
                  Mục tiêu tình huống đã hoàn thành
                </p>
              </div>
              <p className="mt-1 text-xs leading-5 text-emerald-800">
                Bạn có thể kết thúc để lưu phiên hoặc tiếp tục nói tự do.
              </p>
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
            <div className="px-3 pt-2.5">
              <button
                type="button"
                onClick={() => setShowPhraseBank((value) => !value)}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-500"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                {showPhraseBank ? 'Ẩn gợi ý' : 'Bí thì xem câu gợi ý'}
              </button>

              {showPhraseBank && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {selectedScenario.suggestedPhrases.map((phrase) => (
                    <button
                      key={phrase.german}
                      type="button"
                      onClick={() => handleSendMessage(phrase.german)}
                      disabled={isLoading}
                      className="min-w-[190px] shrink-0 rounded-xl bg-[#f7f7f5] px-3 py-2 text-left ring-1 ring-black/[0.05]"
                    >
                      <span className="block text-xs font-black text-slate-900">
                        {phrase.german}
                      </span>
                      {practiceMode === 'guided' && (
                        <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">
                          {phrase.vietnamese}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <footer className="flex items-center gap-2 p-3">
            <button
              onClick={handleToggleMic}
              className={
                'grid h-11 w-11 shrink-0 place-items-center rounded-xl ' +
                (isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-600')
              }
              aria-label={isListening ? 'Dừng nghe' : 'Nói'}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>

            <input
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
              placeholder={
                practiceMode === 'guided'
                  ? 'Gõ hoặc nói câu tiếng Đức…'
                  : 'Trả lời bằng tiếng Đức…'
              }
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
      </section>
    </div>
  );
};
