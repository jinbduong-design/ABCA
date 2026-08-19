import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  MessageSquare,
  Wand2
} from 'lucide-react';
import { askAITutor, analyzeGermanSentence } from '../services/aiTutorService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

const TUTOR_MODES = [
  { id: 'general', label: 'Hỏi đáp ngữ pháp & từ', icon: HelpCircle, promptHint: 'Ví dụ: Khi nào dùng "kein" và khi nào dùng "nicht"?' },
  { id: 'conversation', label: 'Luyện đàm thoại tự do', icon: MessageSquare, promptHint: 'Ví dụ: Hãy đóng vai bạn người Đức và trò chuyện về cuối tuần với mình.' },
  { id: 'correct_mistakes', label: 'Sửa lỗi câu & viết chuẩn', icon: Wand2, promptHint: 'Ví dụ: Sửa giúp mình câu này: "Gestern ich habe nach Berlin fahren."' },
  { id: 'grammar_explainer', label: 'Giải thích ngữ pháp tiếng Việt', icon: FileText, promptHint: 'Ví dụ: Giải thích sự khác nhau giữa Akkusativ và Dativ một cách dễ hiểu nhất.' },
];

export const AITutorView: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState('general');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `🇩🇪 Hallo! Mình là Gia sư Tiếng Đức AI của bạn. 
Bạn có thể hỏi mình bất kỳ điều gì: Giải thích ngữ pháp (der/die/das, Akkusativ, Dativ...), sửa câu bạn vừa viết, hoặc luyện đàm thoại theo tình huống. Hãy đặt câu hỏi nhé!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isLoading) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const history = messages.map((m) => ({
      sender: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    try {
      const res = await askAITutor({
        message: text,
        mode: selectedMode,
        history,
      });

      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
      storageService.addStudyTime(1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const currentModeObj = TUTOR_MODES.find((m) => m.id === selectedMode) || TUTOR_MODES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Bot className="w-7 h-7 text-amber-600" />
          Gia Sư AI Tiếng Đức Cá Nhân 24/7
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hỗ trợ phân tích câu, giải thích ngữ pháp bằng tiếng Việt giản dị, phát hiện lỗi sai và chỉnh sửa câu viết chuẩn người bản xứ.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TUTOR_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[65vh]">
        {/* Messages Stream */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-3xl shadow-sm text-sm space-y-2 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-br-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.sender === 'ai' && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Gia sư tiếng Đức
                    </span>
                    <button
                      onClick={() => speechService.speak(msg.text)}
                      className="p-1 text-slate-400 hover:text-amber-600 rounded"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
              <span>Gia sư AI đang soạn phản hồi chi tiết...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          {/* Quick Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
              Gợi ý hỏi:
            </span>
            {[
              'Cách nhớ giống der/die/das?',
              'Khi nào dùng Akkusativ?',
              'Quy tắc chia động từ sein & haben?',
              'Sửa câu: "Ich trinke der Kaffee"',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-full text-xs shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={currentModeObj.promptHint}
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
      </div>
    </div>
  );
};
