import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  PenTool,
  Search,
  Send,
  Volume2,
  Wand2,
} from 'lucide-react';
import {
  askAITutor,
  analyzeGermanSentence,
  correctGermanWriting,
  WritingCorrectionResponse,
} from '../services/aiTutorService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

const TUTOR_MODES = [
  { id: 'general', label: 'Hỏi nhanh', icon: HelpCircle, promptHint: 'Hỏi từ vựng hoặc ngữ pháp…' },
  { id: 'conversation', label: 'Nói chuyện', icon: MessageSquare, promptHint: 'Bắt đầu một cuộc trò chuyện tiếng Đức…' },
  { id: 'correct_mistakes', label: 'Sửa câu', icon: Wand2, promptHint: 'Dán câu tiếng Đức cần sửa…' },
  { id: 'grammar_explainer', label: 'Giải thích', icon: FileText, promptHint: 'Ví dụ: Akkusativ khác Dativ thế nào?' },
];

const WRITING_TOPIC_TEMPLATES = [
  { id: 'arzt_termin', title: 'Hẹn khám bác sĩ', level: 'A1', prompt: 'Bạn bị sốt và đau họng. Viết email xin hẹn khám vào 10h sáng ngày mai, giới thiệu tình trạng và xin phản hồi sớm.', sampleOpening: 'Sehr geehrte Damen und Herren,' },
  { id: 'geburtstag_einladung', title: 'Mời sinh nhật', level: 'A1', prompt: 'Viết thư mời bạn đến sinh nhật lúc 19:00 thứ Bảy, nhờ mang đồ uống nếu có thể và báo lại trước thứ Năm.', sampleOpening: 'Lieber Thomas,' },
  { id: 'urlaub_anfrage', title: 'Báo nghỉ ốm', level: 'A2', prompt: 'Viết email trang trọng báo nghỉ hôm nay và ngày mai, nói sẽ gửi giấy bác sĩ và chào kết thư phù hợp.', sampleOpening: 'Sehr geehrte Frau Müller,' },
  { id: 'hotel_buchung', title: 'Đặt khách sạn', level: 'A2', prompt: 'Hỏi đặt phòng đôi 10–15 tháng sau, hỏi giá có gồm ăn sáng và xin xác nhận qua email.', sampleOpening: 'Sehr geehrte Damen und Herren,' },
];

export const AITutorView: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'writing' | 'analyzer'>('chat');
  const [selectedMode, setSelectedMode] = useState('general');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hallo! Gửi câu hỏi, câu cần sửa hoặc bắt đầu nói chuyện với mình.' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedTopicId, setSelectedTopicId] = useState(WRITING_TOPIC_TEMPLATES[0].id);
  const [userWritingText, setUserWritingText] = useState('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false);
  const [writingResult, setWritingResult] = useState<WritingCorrectionResponse | null>(null);

  const [sentenceToAnalyze, setSentenceToAnalyze] = useState('');
  const [isAnalyzingSentence, setIsAnalyzingSentence] = useState(false);
  const [sentenceAnalysisResult, setSentenceAnalysisResult] = useState<any>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const currentMode = TUTOR_MODES.find((mode) => mode.id === selectedMode) || TUTOR_MODES[0];
  const currentTopic = WRITING_TOPIC_TEMPLATES.find((topic) => topic.id === selectedTopicId) || WRITING_TOPIC_TEMPLATES[0];

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isLoading) return;
    setMessages((current) => [...current, { sender: 'user', text }]);
    setInputText('');
    setIsLoading(true);
    const history = messages.map((message) => ({ sender: message.sender === 'user' ? 'user' : 'model', text: message.text }));
    try {
      const response = await askAITutor({ message: text, mode: selectedMode, history });
      setMessages((current) => [...current, { sender: 'ai', text: response.reply }]);
      speechService.playSuccessSound();
      storageService.addStudyTime(1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateWriting = async () => {
    if (!userWritingText.trim() || isEvaluatingWriting) return;
    setIsEvaluatingWriting(true);
    try {
      const response = await correctGermanWriting({ promptTopic: `${currentTopic.title} - ${currentTopic.prompt}`, userText: userWritingText, level: currentTopic.level });
      setWritingResult(response);
      speechService.playLevelUpSound();
      storageService.addStudyTime(5);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEvaluatingWriting(false);
    }
  };

  const handleAnalyzeSentence = async () => {
    if (!sentenceToAnalyze.trim() || isAnalyzingSentence) return;
    setIsAnalyzingSentence(true);
    try {
      const response = await analyzeGermanSentence(sentenceToAnalyze);
      setSentenceAnalysisResult(response);
      speechService.playSuccessSound();
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzingSentence(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">AI Tutor</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Hỏi, sửa và luyện ngay</h1></div>
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-black">
          <button onClick={() => setActiveMainTab('chat')} className={`min-h-10 rounded-lg px-3 ${activeMainTab === 'chat' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Chat</button>
          <button onClick={() => setActiveMainTab('writing')} className={`min-h-10 rounded-lg px-3 ${activeMainTab === 'writing' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Viết</button>
          <button onClick={() => setActiveMainTab('analyzer')} className={`min-h-10 rounded-lg px-3 ${activeMainTab === 'analyzer' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Phân tích</button>
        </div>
      </header>

      {activeMainTab === 'chat' && <section className="mt-5">
        <div className="mb-3 grid grid-cols-4 gap-2">{TUTOR_MODES.map((mode) => { const Icon = mode.icon; const active = selectedMode === mode.id; return <button key={mode.id} onClick={() => setSelectedMode(mode.id)} className={`min-h-[66px] rounded-2xl border px-2 text-center text-[10px] font-black transition ${active ? 'border-slate-950 bg-slate-950 text-white' : 'border-black/[0.06] bg-white text-slate-600'}`}><Icon className="mx-auto mb-1 h-4 w-4" />{mode.label}</button>; })}</div>
        <div className="flex h-[65vh] min-h-[520px] flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-sm">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">{messages.map((message, index) => <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-[20px] px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${message.sender === 'user' ? 'rounded-br-md bg-slate-950 text-white' : 'rounded-bl-md bg-[#f7f7f5] text-slate-900'}`}><div className="whitespace-pre-wrap">{message.text}</div>{message.sender === 'ai' && <button onClick={() => speechService.speak(message.text)} className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-slate-400"><Volume2 className="h-3 w-3" />Nghe</button>}</div></div>)}{isLoading && <p className="text-xs font-semibold text-slate-400">AI đang trả lời…</p>}<div ref={messagesEndRef} /></div>
          <div className="border-t border-slate-100 p-3"><div className="mb-2 flex gap-2 overflow-x-auto">{['Sửa câu này giúp mình', 'Giải thích Dativ', 'Luyện nói A1'].map((chip) => <button key={chip} onClick={() => handleSendMessage(chip)} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">{chip}</button>)}</div><div className="flex gap-2"><input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} placeholder={currentMode.promptHint} className="min-h-11 min-w-0 flex-1 rounded-xl bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400" /><button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isLoading} className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500 text-slate-950 disabled:opacity-30"><Send className="h-5 w-5" /></button></div></div>
        </div>
      </section>}

      {activeMainTab === 'writing' && <section className="mt-5 space-y-4">
        <div className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5"><p className="text-xs font-black text-slate-400">Chọn đề</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{WRITING_TOPIC_TEMPLATES.map((topic) => <button key={topic.id} onClick={() => { setSelectedTopicId(topic.id); setWritingResult(null); }} className={`rounded-2xl border p-3.5 text-left ${selectedTopicId === topic.id ? 'border-amber-300 bg-amber-50' : 'border-black/[0.06] bg-[#f7f7f5]'}`}><div className="flex items-center justify-between"><span className="text-xs font-black text-slate-900">{topic.title}</span><span className="text-[10px] font-black text-slate-400">{topic.level}</span></div></button>)}</div><div className="mt-3 rounded-2xl bg-[#f7f7f5] p-4 text-xs leading-5 text-slate-600"><p className="font-black text-slate-800">Đề bài</p><p className="mt-1">{currentTopic.prompt}</p><p className="mt-2 font-medium text-amber-700">Mở đầu: {currentTopic.sampleOpening}</p></div></div>
        <div className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5"><textarea rows={7} value={userWritingText} onChange={(e) => setUserWritingText(e.target.value)} placeholder="Viết email/thư tiếng Đức ở đây…" className="w-full rounded-2xl bg-[#f7f7f5] p-4 text-sm leading-6 outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400" /><div className="mt-3 flex items-center justify-between"><span className="text-xs font-bold text-slate-400">{userWritingText.trim() ? userWritingText.trim().split(/\s+/).length : 0} từ</span><button onClick={handleEvaluateWriting} disabled={!userWritingText.trim() || isEvaluatingWriting} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white disabled:opacity-30"><PenTool className="h-4 w-4" />{isEvaluatingWriting ? 'Đang chấm…' : 'Chấm & sửa'}</button></div></div>
        {writingResult && <div className="rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Kết quả {writingResult.cefrLevel}</p><p className="mt-1 text-sm leading-6 text-slate-600">{writingResult.overallFeedback}</p></div><span className="text-3xl font-black text-slate-950">{writingResult.score}</span></div><div className="mt-5"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-400">Bản sửa</p><button onClick={() => speechService.speak(writingResult.correctedVersion)} className="text-slate-400"><Volume2 className="h-4 w-4" /></button></div><div className="mt-2 whitespace-pre-wrap rounded-2xl bg-emerald-50 p-4 text-xs leading-6 text-slate-800">{writingResult.correctedVersion}</div></div>{writingResult.sentenceCorrections?.length > 0 && <div className="mt-5 space-y-2">{writingResult.sentenceCorrections.map((item, index) => <div key={index} className="rounded-2xl bg-[#f7f7f5] p-3 text-xs leading-5"><p className="line-through text-slate-400">{item.original}</p><p className="font-black text-slate-900">{item.corrected}</p><p className="text-slate-500">{item.explanation}</p></div>)}</div>}{writingResult.keyTips?.length > 0 && <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-xs text-blue-900"><p className="flex items-center gap-1.5 font-black"><Lightbulb className="h-4 w-4" />Mẹo cần nhớ</p><ul className="mt-2 space-y-1">{writingResult.keyTips.map((tip, index) => <li key={index}>• {tip}</li>)}</ul></div>}</div>}
      </section>}

      {activeMainTab === 'analyzer' && <section className="mt-5 space-y-4">
        <div className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5"><p className="text-xs font-black text-slate-400">Phân tích một câu tiếng Đức</p><div className="mt-3 flex gap-2"><input value={sentenceToAnalyze} onChange={(e) => setSentenceToAnalyze(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyzeSentence(); }} placeholder="Ich habe gestern meine Hausaufgaben gemacht." className="min-h-11 min-w-0 flex-1 rounded-xl bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400" /><button onClick={handleAnalyzeSentence} disabled={!sentenceToAnalyze.trim() || isAnalyzingSentence} className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white disabled:opacity-30"><Search className="h-4 w-4" /></button></div></div>
        {sentenceAnalysisResult && <div className="rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-black text-slate-950">{sentenceAnalysisResult.corrected || sentenceAnalysisResult.original}</h2><p className="mt-1 text-xs text-slate-500">{sentenceAnalysisResult.vietnameseTranslation}</p></div><button onClick={() => speechService.speak(sentenceAnalysisResult.corrected || sentenceAnalysisResult.original)} className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Volume2 className="h-4 w-4" /></button></div>{sentenceAnalysisResult.pronunciationGuide && <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-mono text-amber-900">{sentenceAnalysisResult.pronunciationGuide}</p>}{sentenceAnalysisResult.grammarBreakdown && <div className="mt-5 grid gap-2 sm:grid-cols-2">{sentenceAnalysisResult.grammarBreakdown.map((item: any, index: number) => <div key={index} className="rounded-2xl bg-[#f7f7f5] p-3 text-xs leading-5"><p className="font-black text-amber-700">{item.component}</p><p className="font-bold text-slate-800">{item.role}</p><p className="text-slate-500">{item.explanation}</p></div>)}</div>}</div>}
      </section>}
    </div>
  );
};
