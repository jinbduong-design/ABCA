import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Clock, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight, 
  FileCheck 
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExamQuestion {
  id: string;
  section: 'Hörverstehen' | 'Leseverstehen' | 'Grammatik';
  audioText?: string;
  readingPassage?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const A1_MOCK_QUESTIONS: ExamQuestion[] = [
  // Section 1: Hörverstehen (Listening)
  {
    id: 'h1',
    section: 'Hörverstehen',
    audioText: 'Achtung an Gleis drei! Der Intercity-Express nach München über Frankfurt fährt heute um 14 Uhr 15 ab.',
    question: 'Wann fährt der Zug nach München ab? (Khi nào tàu đi München khởi hành?)',
    options: ['Um 14:15 Uhr', 'Um 14:50 Uhr', 'Um 13:15 Uhr', 'Um 15:14 Uhr'],
    correctIndex: 0,
    explanation: 'Trong thông báo: "um 14 Uhr 15" (14 giờ 15 phút).',
  },
  {
    id: 'h2',
    section: 'Hörverstehen',
    audioText: 'Guten Tag, Praxis Dr. Weber. Unsere Praxis ist heute wegen Fortbildung geschlossen. Bitte rufen Sie morgen ab 8 Uhr wieder an.',
    question: 'Warum ist die Praxis geschlossen? (Tại sao phòng khám đóng cửa?)',
    options: [
      'Wegen Urlaub (Nghỉ phép)',
      'Wegen Fortbildung (Đi tập huấn/đào tạo)',
      'Wegen Krankheit (Bị ốm)',
      'Es ist Wochenende (Cuối tuần)',
    ],
    correctIndex: 1,
    explanation: 'Băng ghi âm nói rõ: "wegen Fortbildung geschlossen" (đóng cửa vì tập huấn chuyên môn).',
  },
  // Section 2: Leseverstehen (Reading)
  {
    id: 'l1',
    section: 'Leseverstehen',
    readingPassage: `Hallo Maria,
ich mache am Samstag ab 19 Uhr eine Party in meinem Garten. Es gibt Grillfleisch, Salate und Getränke. Kannst du einen Kuchen mitbringen? Bitte gib mir bis Donnerstag Bescheid.
Liebe Grüße, Thomas`,
    question: 'Was soll Maria zur Party mitbringen? (Maria nên mang món gì đến bữa tiệc?)',
    options: ['Grillfleisch (Thịt nướng)', 'Getränke (Đồ uống)', 'Einen Kuchen (Một chiếc bánh ngọt)', 'Salate (Món salad)'],
    correctIndex: 2,
    explanation: 'Trong thư Thomas hỏi: "Kannst du einen Kuchen mitbringen?"',
  },
  {
    id: 'l2',
    section: 'Leseverstehen',
    readingPassage: `Supermarkt Müller:
Sonderangebot nur heute: Frische Äpfel aus Deutschland – 1 Kilo nur 1,99 Euro!
Öffnungszeiten: Montag bis Samstag von 7:00 bis 20:00 Uhr.`,
    question: 'Was kostet ein Kilo Äpfel heute?',
    options: ['0,99 Euro', '1,99 Euro', '2,99 Euro', '7,00 Euro'],
    correctIndex: 1,
    explanation: 'Thông báo nêu giá: "1 Kilo nur 1,99 Euro".',
  },
  // Section 3: Grammatik & Wortschatz
  {
    id: 'g1',
    section: 'Grammatik',
    question: 'Ich trinke morgens gerne ______ Kaffee mit Milch.',
    options: ['den (Akkusativ)', 'einen (Akkusativ)', 'der (Nominativ)', 'ein (Neutral)'],
    correctIndex: 1,
    explanation: 'Kaffee là giống đực (der Kaffee). Khi là tân ngữ của trinken (Akkusativ) đi với quán từ không xác định -> "einen Kaffee".',
  },
  {
    id: 'g2',
    section: 'Grammatik',
    question: 'Wohin gehst du? – Ich gehe jetzt ______ Schule.',
    options: ['in der (Dativ)', 'in die (Akkusativ)', 'an dem', 'zu die'],
    correctIndex: 1,
    explanation: 'Câu hỏi "Wohin?" (Đi đâu - chỉ hướng di chuyển) + giống cái die Schule -> "in die Schule" (Akkusativ).',
  },
  {
    id: 'g3',
    section: 'Grammatik',
    question: 'Gestern ______ wir im Kino einen sehr interessanten Film gesehen.',
    options: ['haben', 'sind', 'waren', 'hatten'],
    correctIndex: 0,
    explanation: 'Động từ "sehen" trong thì quá khứ Perfekt đi với trợ động từ "haben" -> "wir haben ... gesehen".',
  },
];

export const MockExamModal: React.FC<MockExamModalProps> = ({ isOpen, onClose }) => {
  const [examState, setExamState] = useState<'intro' | 'testing' | 'finished'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s)
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (examState === 'testing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setExamState('finished');
            speechService.playLevelUpSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  if (!isOpen) return null;

  const currentQ = A1_MOCK_QUESTIONS[currentIdx];

  const handleStartExam = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setTimeLeft(600);
    setExamState('testing');
  };

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < A1_MOCK_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setExamState('finished');
      speechService.playLevelUpSound();
      storageService.addStudyTime(10);
    }
  };

  // Calculate Results
  let correctCount = 0;
  A1_MOCK_QUESTIONS.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctIndex) {
      correctCount += 1;
    }
  });
  const scorePercent = Math.round((correctCount / A1_MOCK_QUESTIONS.length) * 100);
  const isPassed = scorePercent >= 60;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              🏆
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Thi Thử Tổng Hợp A1 (Goethe-Zertifikat Mini-Mock)
              </h2>
              <p className="text-xs text-slate-500">
                Đánh giá toàn diện Kỹ năng Nghe hiểu, Đọc hiểu & Ngữ pháp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STATE 1: INTRO */}
        {examState === 'intro' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <span className="text-4xl">📝</span>
              <h3 className="text-xl font-black text-slate-900">
                Sẵn Sàng Cho Bài Kiểm Tra Trình Độ A1?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bài thi gồm <strong>{A1_MOCK_QUESTIONS.length} câu hỏi chuẩn hóa</strong> theo cấu trúc bài thi Goethe A1. Thời gian làm bài: <strong>10 phút</strong>. Điểm đỗ: <strong>≥ 60%</strong>.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-left">
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-blue-900 block">🎧 Nghe hiểu</span>
                <p className="text-blue-700 text-[11px]">Thông báo tàu xe, tin nhắn thoại</p>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900 block">📖 Đọc hiểu</span>
                <p className="text-emerald-700 text-[11px]">Đoạn email ngắn, biển quảng cáo</p>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 block">⚡ Ngữ pháp</span>
                <p className="text-amber-700 text-[11px]">Mạo từ, thì quá khứ, giới từ</p>
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md text-sm transition-all"
            >
              Bắt đầu làm bài thi ngay
            </button>
          </div>
        )}

        {/* STATE 2: TESTING */}
        {examState === 'testing' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Top Bar with Timer & Progress */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Câu {currentIdx + 1} / {A1_MOCK_QUESTIONS.length} ({currentQ.section})
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Audio Box for Listening Section */}
            {currentQ.section === 'Hörverstehen' && currentQ.audioText && (
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    🎧 Đoạn băng nghe thông báo:
                  </span>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Nhấn nút loa bên phải để nghe đoạn audio (có thể nghe lại nếu cần).
                  </p>
                </div>
                <button
                  onClick={() => {
                    speechService.speak(currentQ.audioText!, 0.85);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Volume2 className="w-4 h-4" /> Nghe audio
                </button>
              </div>
            )}

            {/* Reading Passage */}
            {currentQ.section === 'Leseverstehen' && currentQ.readingPassage && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed font-mono whitespace-pre-line text-slate-800">
                {currentQ.readingPassage}
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                {currentQ.question}
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-600 text-amber-900 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                        isSelected
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30"
              >
                ← Câu trước
              </button>
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQ.id] === undefined}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-1.5"
              >
                {currentIdx < A1_MOCK_QUESTIONS.length - 1 ? 'Câu tiếp theo →' : 'Nộp bài & Xem kết quả'}
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: FINISHED & CERTIFICATE */}
        {examState === 'finished' && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {/* Score Banner */}
            <div className={`p-6 rounded-3xl border text-center space-y-2 ${
              isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              <span className="text-4xl">{isPassed ? '🎉' : '📚'}</span>
              <h3 className="text-xl font-black text-slate-900">
                {isPassed ? 'Chúc Mừng! Bạn Đã Đạt Chuẩn Goethe A1' : 'Cần Ôn Tập Thêm Để Đạt Chuẩn A1'}
              </h3>
              <p className="text-xs text-slate-600">
                Điểm số của bạn: <strong className="text-base text-slate-900">{correctCount} / {A1_MOCK_QUESTIONS.length} ({scorePercent}%)</strong>
              </p>
            </div>

            {/* Electronic Certificate Preview if passed */}
            {isPassed && (
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border-2 border-dashed border-amber-300 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-widest">
                  <Award className="w-5 h-5 text-amber-600" />
                  DeutschStart Certificate of Achievement
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  CHỨNG CHỈ HOÀN THÀNH MINI-EXAM A1
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Chứng nhận học viên đã hoàn thành xuất sắc các phần kiểm tra Nghe hiểu, Đọc hiểu và Ngữ pháp A1 cơ bản.
                </p>
                <div className="pt-2 text-[10px] text-slate-400">
                  Ngày cấp: {new Date().toLocaleDateString('vi-VN')} • Mã chứng chỉ: DS-A1-{(Date.now() % 100000).toString().padStart(6, '0')}
                </div>
              </div>
            )}

            {/* Detailed Answer Key Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Chi tiết đáp án & Giải thích
              </h4>
              <div className="space-y-2.5">
                {A1_MOCK_QUESTIONS.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                        isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">Câu {idx + 1}: {q.question}</span>
                        <span className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>
                          {isCorrect ? '✓ Đúng' : '✗ Sai'}
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Đáp án đúng: <strong>{q.options[q.correctIndex]}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        💡 {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleStartExam}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all"
              >
                Làm lại bài thi
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
