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
  Wand2,
  PenTool,
  Award,
  AlertTriangle,
  Lightbulb,
  Search
} from 'lucide-react';
import { 
  askAITutor, 
  analyzeGermanSentence, 
  correctGermanWriting,
  WritingCorrectionResponse 
} from '../services/aiTutorService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

const TUTOR_MODES = [
  { id: 'general', label: 'Hỏi đáp ngữ pháp & từ', icon: HelpCircle, promptHint: 'Ví dụ: Khi nào dùng "kein" và khi nào dùng "nicht"?' },
  { id: 'conversation', label: 'Luyện đàm thoại tự do', icon: MessageSquare, promptHint: 'Ví dụ: Hãy đóng vai bạn người Đức và trò chuyện về cuối tuần với mình.' },
  { id: 'correct_mistakes', label: 'Sửa lỗi câu & viết chuẩn', icon: Wand2, promptHint: 'Ví dụ: Sửa giúp mình câu này: "Gestern ich habe nach Berlin fahren."' },
  { id: 'grammar_explainer', label: 'Giải thích ngữ pháp tiếng Việt', icon: FileText, promptHint: 'Ví dụ: Giải thích sự khác nhau giữa Akkusativ và Dativ một cách dễ hiểu nhất.' },
];

const WRITING_TOPIC_TEMPLATES = [
  {
    id: 'arzt_termin',
    title: 'Hẹn lịch khám bác sĩ (Arzttermin)',
    level: 'A1',
    prompt: `Bạn bị sốt và đau họng từ hôm qua. Hãy viết email xin hẹn khám bác sĩ (Termin vereinbaren) gồm các ý:
1. Giới thiệu tên và nói bạn bị ốm.
2. Hỏi xem ngày mai lúc 10h sáng có thể đến khám không.
3. Xin phản hồi sớm và chào kết thư.`,
    sampleOpening: 'Sehr geehrte Damen und Herren,',
  },
  {
    id: 'geburtstag_einladung',
    title: 'Mời bạn bè dự sinh nhật (Geburtstagseinladung)',
    level: 'A1',
    prompt: `Sắp tới sinh nhật bạn vào thứ Bảy. Hãy viết thư mời bạn người Đức (Liebe/Lieber...) gồm:
1. Mời bạn đến nhà lúc 19:00.
2. Bảo bạn mang theo đồ uống nếu có thể.
3. Nhờ bạn báo lại trước thứ Năm.`,
    sampleOpening: 'Lieber Thomas,',
  },
  {
    id: 'urlaub_anfrage',
    title: 'Xin nghỉ phép / Báo nghỉ ốm với sếp',
    level: 'A2',
    prompt: `Hãy viết email trang trọng gửi công ty/trường học:
1. Báo bạn bị ốm (krank) không thể đến lớp/công ty hôm nay và ngày mai.
2. Bạn sẽ gửi giấy chứng nhận của bác sĩ (Attest).
3. Chúc đồng nghiệp/thầy cô một ngày làm việc tốt.`,
    sampleOpening: 'Sehr geehrte Frau Müller,',
  },
  {
    id: 'hotel_buchung',
    title: 'Đặt phòng khách sạn tại Berlin',
    level: 'A2',
    prompt: `Viết thư gửi khách sạn hỏi đặt phòng:
1. Bạn muốn đặt 1 phòng đôi (Doppelzimmer) từ ngày 10 đến 15 tháng sau.
2. Hỏi giá phòng đã bao gồm ăn sáng (Frühstück) chưa.
3. Xin xác nhận qua email.`,
    sampleOpening: 'Sehr geehrte Damen und Herren,',
  },
];

export const AITutorView: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'writing' | 'analyzer'>('chat');

  // --- TAB 1: CHAT STATE ---
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
      speechService.playSuccessSound();
      storageService.addStudyTime(1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAB 2: WRITING CORRECTOR STATE ---
  const [selectedTopicId, setSelectedTopicId] = useState(WRITING_TOPIC_TEMPLATES[0].id);
  const [customTopicTitle, setCustomTopicTitle] = useState('');
  const [userWritingText, setUserWritingText] = useState('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false);
  const [writingResult, setWritingResult] = useState<WritingCorrectionResponse | null>(null);

  const currentTopic = WRITING_TOPIC_TEMPLATES.find((t) => t.id === selectedTopicId) || WRITING_TOPIC_TEMPLATES[0];

  const handleEvaluateWriting = async () => {
    if (!userWritingText.trim() || isEvaluatingWriting) return;

    setIsEvaluatingWriting(true);
    try {
      const topicTitle = customTopicTitle.trim() || currentTopic.title;
      const res = await correctGermanWriting({
        promptTopic: `${topicTitle} - ${currentTopic.prompt}`,
        userText: userWritingText,
        level: currentTopic.level,
      });
      setWritingResult(res);
      speechService.playLevelUpSound();
      storageService.addStudyTime(5);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingWriting(false);
    }
  };

  // --- TAB 3: SENTENCE ANALYZER STATE ---
  const [sentenceToAnalyze, setSentenceToAnalyze] = useState('');
  const [isAnalyzingSentence, setIsAnalyzingSentence] = useState(false);
  const [sentenceAnalysisResult, setSentenceAnalysisResult] = useState<any>(null);

  const handleAnalyzeSentence = async () => {
    if (!sentenceToAnalyze.trim() || isAnalyzingSentence) return;
    setIsAnalyzingSentence(true);
    try {
      const res = await analyzeGermanSentence(sentenceToAnalyze);
      setSentenceAnalysisResult(res);
      speechService.playSuccessSound();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingSentence(false);
    }
  };

  const currentModeObj = TUTOR_MODES.find((m) => m.id === selectedMode) || TUTOR_MODES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-amber-600" />
            Gia Sư & Luyện Viết AI 24/7
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hỏi đáp ngữ pháp, chấm chữa bài viết thư/email A1-A2 và phân tích cấu trúc câu chuẩn bản xứ.
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveMainTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeMainTab === 'chat'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Hỏi đáp AI
          </button>
          <button
            onClick={() => setActiveMainTab('writing')}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeMainTab === 'writing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Chữa bài viết thư
          </button>
          <button
            onClick={() => setActiveMainTab('analyzer')}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeMainTab === 'analyzer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Phân tích câu
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: AI TUTOR CHAT */}
      {/* ======================================================================= */}
      {activeMainTab === 'chat' && (
        <div className="space-y-4">
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
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[62vh]">
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
      )}

      {/* ======================================================================= */}
      {/* TAB 2: WRITING CORRECTOR (Brief / Email A1-A2) */}
      {/* ======================================================================= */}
      {activeMainTab === 'writing' && (
        <div className="space-y-6">
          {/* Topic Selection */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-amber-600" />
              1. Chọn đề bài viết thư mẫu (Hoặc tự nhập đề của bạn):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WRITING_TOPIC_TEMPLATES.map((topic) => {
                const isSelected = selectedTopicId === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setCustomTopicTitle('');
                      setWritingResult(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{topic.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {topic.level}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Prompt Prompt Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Yêu cầu đề bài:
              </span>
              <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                {currentTopic.prompt}
              </p>
              <div className="pt-1 text-[11px] text-amber-700">
                💡 <em>Gợi ý mở đầu: {currentTopic.sampleOpening}</em>
              </div>
            </div>
          </div>

          {/* User Writing Input Textarea */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              2. Soạn thảo bài viết tiếng Đức của bạn:
            </h3>
            <textarea
              rows={6}
              value={userWritingText}
              onChange={(e) => setUserWritingText(e.target.value)}
              placeholder={`Viết bài thư / email tiếng Đức của bạn ở đây...\nVí dụ:\nSehr geehrte Damen und Herren,\nich bin krank und kann morgen nicht kommen...\nViele Grüße,\nMinh`}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                Số từ: {userWritingText.trim() ? userWritingText.trim().split(/\s+/).length : 0} từ
              </span>
              <button
                onClick={handleEvaluateWriting}
                disabled={!userWritingText.trim() || isEvaluatingWriting}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2"
              >
                {isEvaluatingWriting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Đang Chấm & Sửa Bài...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Chấm điểm & Sửa lỗi chi tiết
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Writing Result Card */}
          {writingResult && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
              {/* Score Header */}
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Kết Quả Chấm Điểm AI (Chuẩn {writingResult.cefrLevel})
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    {writingResult.overallFeedback}
                  </p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-2xl border border-amber-300 shadow-xs">
                  <span className="text-2xl font-black text-amber-700">
                    {writingResult.score}
                  </span>
                  <span className="text-[10px] block text-slate-400">/ 100 điểm</span>
                </div>
              </div>

              {/* Corrected Version */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ✨ Bản viết hoàn chỉnh chuẩn bản xứ:
                  </h4>
                  <button
                    onClick={() => speechService.speak(writingResult.correctedVersion)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs"
                  >
                    <Volume2 className="w-4 h-4" /> Nghe đọc cả bài
                  </button>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs font-mono text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {writingResult.correctedVersion}
                </div>
              </div>

              {/* Sentence-by-sentence Corrections */}
              {writingResult.sentenceCorrections && writingResult.sentenceCorrections.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🔍 Chi tiết từng câu sửa:
                  </h4>
                  <div className="space-y-2.5">
                    {writingResult.sentenceCorrections.map((sc, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                          sc.hasError ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p className="text-slate-500 line-through text-[11px]">
                          Câu của bạn: {sc.original}
                        </p>
                        <p className="font-bold text-slate-900">
                          👉 Câu chuẩn: {sc.corrected}
                        </p>
                        <p className="text-[11px] text-slate-600 italic">
                          💡 {sc.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Tips */}
              {writingResult.keyTips && writingResult.keyTips.length > 0 && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1.5">
                  <p className="font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    Mẹo vàng đạt điểm tối đa bài viết A1/A2:
                  </p>
                  <ul className="space-y-1 text-blue-800 text-[11px]">
                    {writingResult.keyTips.map((tip, idx) => (
                      <li key={idx}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: SENTENCE ANALYZER */}
      {/* ======================================================================= */}
      {activeMainTab === 'analyzer' && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Nhập bất kỳ câu tiếng Đức nào để phân tích ngữ pháp & phiên âm:
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={sentenceToAnalyze}
                onChange={(e) => setSentenceToAnalyze(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyzeSentence();
                }}
                placeholder="Ví dụ: Ich trinke jeden Morgen eine Tasse Kaffee mit Milch."
                className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
              <button
                onClick={handleAnalyzeSentence}
                disabled={!sentenceToAnalyze.trim() || isAnalyzingSentence}
                className="px-5 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-2xl text-xs font-bold transition-colors"
              >
                {isAnalyzingSentence ? 'Đang phân tích...' : 'Phân tích'}
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
                Câu mẫu:
              </span>
              {[
                'Heute fahre ich mit dem Zug nach Berlin.',
                'Das Buch liegt auf dem Tisch.',
                'Ich habe gestern meine Hausaufgaben gemacht.',
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSentenceToAnalyze(s);
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-full text-xs shrink-0 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {sentenceAnalysisResult && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {sentenceAnalysisResult.corrected || sentenceAnalysisResult.original}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {sentenceAnalysisResult.vietnameseTranslation}
                  </p>
                </div>
                <button
                  onClick={() => speechService.speak(sentenceAnalysisResult.corrected || sentenceAnalysisResult.original)}
                  className="p-2.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-2xl transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {sentenceAnalysisResult.pronunciationGuide && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs font-mono text-amber-900">
                  🗣️ Phiên âm tiếng Việt: <strong>{sentenceAnalysisResult.pronunciationGuide}</strong>
                </div>
              )}

              {/* Grammar Breakdown List */}
              {sentenceAnalysisResult.grammarBreakdown && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Phân tích thành phần ngữ pháp:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sentenceAnalysisResult.grammarBreakdown.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-amber-700">{item.component}</span>
                        <p className="font-semibold text-slate-800 text-[11px]">{item.role}</p>
                        <p className="text-slate-500 text-[11px]">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
