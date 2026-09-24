import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Coffee,
  Compass,
  Heart,
  Home,
  Lightbulb,
  MessageSquare,
  Mic,
  MicOff,
  Plane,
  RefreshCw,
  Send,
  ShoppingBag,
  Smile,
  Train,
  Utensils,
  Volume2,
  Activity,
} from 'lucide-react';
import { CONVERSATION_SCENARIOS } from '../data/conversationsData';
import { ConversationMessage, ConversationScenario } from '../types';
import { sendConversationMessage } from '../services/aiTutorService';
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

export const ConversationView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedScenario) return;
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
  }, [selectedScenario]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resetConversation = () => {
    if (!selectedScenario) return;
    setMessages([{ id: `msg_${Date.now()}`, sender: 'ai', text: selectedScenario.starterMessage, translationVietnamese: selectedScenario.starterTranslation, timestamp: new Date().toISOString() }]);
    setActiveHint(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedScenario || isLoading) return;
    const userMsg: ConversationMessage = { id: `user_${Date.now()}`, sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages((current) => [...current, userMsg]);
    setInputText('');
    setIsLoading(true);
    const history = messages.map((message) => ({ sender: message.sender === 'user' ? 'user' : 'model', text: message.text }));
    try {
      const res = await sendConversationMessage({ scenarioTitle: selectedScenario.title, scenarioContext: selectedScenario.context, userMessage: text, history });
      setMessages((current) => [...current, {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.aiReply,
        translationVietnamese: res.aiReplyTranslation,
        correction: res.correction?.hasMistake ? res.correction : undefined,
        timestamp: new Date().toISOString(),
      }]);
      speechService.speak(res.aiReply);
      if (res.vietnameseHint) setActiveHint(res.vietnameseHint);
      storageService.addStudyTime(2);
    } catch (error) {
      console.error(error);
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
      (transcript) => { setIsListening(false); setInputText(transcript); },
      () => setIsListening(false)
    );
  };

  if (!selectedScenario) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
        <header><p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Hội thoại</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Tình huống thực tế</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Mỗi tình huống có mục tiêu rõ ràng. AI sửa câu nhẹ nhàng trong lúc bạn hội thoại.</p></header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONVERSATION_SCENARIOS.map((scenario) => {
            const Icon = ICON_MAP[scenario.iconName] || MessageSquare;
            return (
              <button key={scenario.id} type="button" onClick={() => setSelectedScenario(scenario)} className="group flex min-h-[150px] flex-col justify-between rounded-[22px] border border-black/[0.06] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200">
                <div><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700"><Icon className="h-5 w-5" /></span><span className="text-[10px] font-black text-slate-400">{scenario.level}</span></div><h2 className="mt-4 text-sm font-black text-slate-950">{scenario.titleVietnamese}</h2><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{scenario.context}</p></div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-black text-slate-400"><span>{scenario.category}</span><span className="text-amber-700">Bắt đầu →</span></div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-3 pb-24 pt-3 sm:px-6 sm:pt-6 lg:pb-8 animate-fadeIn">
      <section className="flex h-[calc(100vh-112px)] min-h-[580px] flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-sm lg:h-[82vh]">
        <header className="flex items-center gap-3 border-b border-slate-100 px-3 py-3 sm:px-4">
          <button onClick={() => setSelectedScenario(null)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"><ArrowLeft className="h-4 w-4" /></button>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-slate-950">{selectedScenario.titleVietnamese}</p><p className="truncate text-[11px] font-medium text-slate-400">{selectedScenario.aiRole} · {selectedScenario.location}</p></div>
          <button onClick={resetConversation} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"><RefreshCw className="h-4 w-4" /></button>
        </header>

        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-900"><span className="font-black">Mục tiêu:</span> {selectedScenario.goal}</div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[88%] rounded-[20px] px-4 py-3 text-sm leading-6 sm:max-w-[76%] ${message.sender === 'user' ? 'rounded-br-md bg-slate-950 text-white' : 'rounded-bl-md bg-[#f7f7f5] text-slate-900'}`}>
                <div className="flex items-start gap-3"><p className="flex-1 font-semibold">{message.text}</p><button onClick={() => speechService.speak(message.text)} className={`mt-0.5 shrink-0 ${message.sender === 'user' ? 'text-slate-400' : 'text-slate-400 hover:text-amber-700'}`}><Volume2 className="h-3.5 w-3.5" /></button></div>
                {message.translationVietnamese && <p className={`mt-2 border-t pt-2 text-xs ${message.sender === 'user' ? 'border-white/10 text-slate-300' : 'border-black/[0.06] text-slate-500'}`}>{message.translationVietnamese}</p>}
              </div>
              {message.correction && <div className="mt-1.5 max-w-[82%] rounded-2xl border border-red-100 bg-red-50 px-3.5 py-3 text-xs leading-5 text-slate-600"><p className="flex items-center gap-1.5 font-black text-red-700"><AlertCircle className="h-3.5 w-3.5" />Sửa câu</p><p className="mt-1"><span className="font-black text-emerald-700">{message.correction.better}</span></p><p>{message.correction.explanation}</p></div>}
            </div>
          ))}
          {isLoading && <div className="text-xs font-semibold text-slate-400">{selectedScenario.aiRole} đang trả lời…</div>}
          <div ref={chatEndRef} />
        </div>

        {selectedScenario.suggestedPhrases?.length > 0 && <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-[#fafaf9] px-3 py-2.5"><span className="my-auto shrink-0 text-[10px] font-black uppercase text-slate-400">Gợi ý</span>{selectedScenario.suggestedPhrases.map((phrase, index) => <button key={index} onClick={() => handleSendMessage(phrase.german)} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-black/[0.06]">{phrase.german}</button>)}</div>}
        {activeHint && <div className="flex items-center justify-between gap-2 border-t border-blue-100 bg-blue-50 px-4 py-2.5 text-xs text-blue-800"><span className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" />{activeHint}</span><button onClick={() => setActiveHint(null)} className="font-black">×</button></div>}

        <footer className="flex items-center gap-2 border-t border-slate-100 p-3">
          <button onClick={handleToggleMic} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isListening ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button>
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} disabled={isLoading} placeholder="Nói hoặc gõ tiếng Đức…" className="min-h-11 min-w-0 flex-1 rounded-xl bg-[#f7f7f5] px-4 text-sm font-medium outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400" />
          <button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isLoading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500 text-slate-950 disabled:opacity-30"><Send className="h-5 w-5" /></button>
        </footer>
      </section>
    </div>
  );
};
