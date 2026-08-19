import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  ArrowLeft,
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
  RefreshCw
} from 'lucide-react';
import { CONVERSATION_SCENARIOS } from '../data/conversationsData';
import { ConversationScenario, ConversationMessage } from '../types';
import { sendConversationMessage } from '../services/aiTutorService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

const ICON_MAP: { [key: string]: any } = {
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

export const ConversationView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when scenario selected
  useEffect(() => {
    if (selectedScenario) {
      const initialMessage: ConversationMessage = {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: selectedScenario.starterMessage,
        translationVietnamese: selectedScenario.starterTranslation,
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      speechService.speak(selectedScenario.starterMessage);
      setActiveHint(null);
    }
  }, [selectedScenario]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedScenario || isLoading) return;

    const userMsg: ConversationMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const history = messages.map((m) => ({
      sender: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    try {
      const res = await sendConversationMessage({
        scenarioTitle: selectedScenario.title,
        scenarioContext: selectedScenario.context,
        userMessage: text,
        history,
      });

      const aiMsg: ConversationMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.aiReply,
        translationVietnamese: res.aiReplyTranslation,
        correction: res.correction?.hasMistake ? res.correction : undefined,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speechService.speak(res.aiReply);

      if (res.vietnameseHint) {
        setActiveHint(res.vietnameseHint);
      }

      // Add study time & experience
      storageService.addStudyTime(2);
    } catch (e) {
      console.error(e);
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
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      {!selectedScenario ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <MessageSquare className="w-7 h-7 text-amber-600" />
              Luyện Hội Thoại Tình Huống Thực Tế
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              13 kịch bản giao tiếp đời sống ở Đức. Đối thoại cùng AI bản xứ, được sửa lỗi ngữ pháp và nhận gợi ý câu tiếng Việt ngay khi bí từ.
            </p>
          </div>

          {/* Scenario Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CONVERSATION_SCENARIOS.map((sc) => {
              const Icon = ICON_MAP[sc.iconName] || MessageSquare;

              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className="p-5 bg-white rounded-3xl border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {sc.level} • {sc.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                      {sc.titleVietnamese}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {sc.context}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>Bắt đầu nói chuyện</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ACTIVE SCENARIO CHAT ROOM */
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col h-[78vh]">
          {/* Room Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedScenario(null)}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                  {selectedScenario.titleVietnamese}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Đối tác AI: <strong className="text-slate-800">{selectedScenario.aiRole}</strong> • Địa điểm: {selectedScenario.location}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const init: ConversationMessage = {
                  id: `msg_${Date.now()}`,
                  sender: 'ai',
                  text: selectedScenario.starterMessage,
                  translationVietnamese: selectedScenario.starterTranslation,
                  timestamp: new Date().toISOString(),
                };
                setMessages([init]);
              }}
              className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 text-xs flex items-center gap-1"
              title="Bắt đầu lại"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Goal Banner */}
          <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Mục tiêu:</strong> {selectedScenario.goal}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-1`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl shadow-sm text-sm space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-base leading-relaxed">{msg.text}</p>
                    <button
                      onClick={() => speechService.speak(msg.text)}
                      className={`p-1 rounded-lg shrink-0 ${
                        msg.sender === 'user'
                          ? 'text-amber-200 hover:text-white'
                          : 'text-slate-400 hover:text-amber-600'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {msg.translationVietnamese && (
                    <p
                      className={`text-xs italic pt-1 border-t ${
                        msg.sender === 'user'
                          ? 'text-amber-100 border-amber-500'
                          : 'text-slate-500 border-slate-200'
                      }`}
                    >
                      {msg.translationVietnamese}
                    </p>
                  )}
                </div>

                {/* AI Gentle Grammar Correction Bubble */}
                {msg.correction && (
                  <div className="max-w-[80%] p-3 bg-red-50 rounded-2xl border border-red-200 text-xs space-y-1 text-red-900 animate-fadeIn">
                    <p className="font-bold flex items-center gap-1 text-red-700">
                      <AlertCircle className="w-3.5 h-3.5" /> Góp ý sửa câu cho tự nhiên hơn:
                    </p>
                    <p>
                      👉 Nên nói:{' '}
                      <strong className="text-emerald-700">{msg.correction.better}</strong>
                    </p>
                    <p className="text-[11px] text-slate-600 italic">
                      {msg.correction.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span>{selectedScenario.aiRole} đang trả lời...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested quick phrases */}
          {selectedScenario.suggestedPhrases && (
            <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">
                Gợi ý:
              </span>
              {selectedScenario.suggestedPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(phrase.german)}
                  className="px-3 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-full border border-slate-200 text-xs shrink-0 transition-colors shadow-2xs font-medium"
                >
                  {phrase.german}
                </button>
              ))}
            </div>
          )}

          {/* Hint alert if active */}
          {activeHint && (
            <div className="px-4 py-2 bg-blue-50 text-blue-900 text-xs border-t border-blue-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                {activeHint}
              </span>
              <button
                onClick={() => setActiveHint(null)}
                className="text-blue-500 hover:text-blue-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={handleToggleMic}
              className={`p-3 rounded-2xl transition-colors ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Nhấn để nói tiếng Đức"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder="Gõ hoặc nói câu tiếng Đức của bạn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
