import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Mic, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface PhoneticsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoundGuide {
  id: string;
  symbol: string;
  name: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  mouthPlacement: string;
  vietnameseApproximation: string;
  examples: {
    german: string;
    vietnamese: string;
    pronunciation: string;
  }[];
  mistakeAlert: string;
}

const GERMAN_SOUNDS: SoundGuide[] = [
  {
    id: 'ch_soft',
    symbol: 'ch (ich-Laut)',
    name: 'Âm "ch" mềm (Sau e, i, ä, ö, ü, eu)',
    difficulty: 'Trung bình',
    mouthPlacement: 'Mép môi hơi hé như đang cười mỉm. Lưng lưỡi nâng cao chạm nhẹ vào vòm họng cứng (phía trước). Đẩy luồng hơi nhẹ qua khe hở giữa lưỡi và vòm họng. Không khạc!',
    vietnameseApproximation: 'Gần giống tiếng "xì" gió nhẹ lai giữa [x] và [h] trong tiếng Việt.',
    examples: [
      { german: 'ich', vietnamese: 'tôi', pronunciation: '[ikh / i-xì]' },
      { german: 'nicht', vietnamese: 'không', pronunciation: '[nikht]' },
      { german: 'Mädchen', vietnamese: 'cô bé', pronunciation: '[mêt-khen]' },
      { german: 'Bücher', vietnamese: 'những cuốn sách', pronunciation: '[byy-khờ]' },
    ],
    mistakeAlert: 'Người Việt hay đọc nhầm thành "ích" (như tiếng Việt) hoặc âm "k" (ik). Hãy nhớ đẩy hơi nhẹ nhàng.',
  },
  {
    id: 'ch_hard',
    symbol: 'ch (ach-Laut)',
    name: 'Âm "ch" cứng (Sau a, o, u, au)',
    difficulty: 'Trung bình',
    mouthPlacement: 'Cuống lưỡi rụt về phía sau, nâng chạm vào vòm họng mềm (lưỡi gà). Thổi hơi cọ xát tạo tiếng khạc nhẹ ở sâu trong cuống họng.',
    vietnameseApproximation: 'Giống như tiếng khạc nhẹ chuẩn bị nhổ bọt hoặc âm [kh] rất sâu.',
    examples: [
      { german: 'Buch', vietnamese: 'cuốn sách', pronunciation: '[buukh]' },
      { german: 'Nacht', vietnamese: 'đêm', pronunciation: '[nakht]' },
      { german: 'auch', vietnamese: 'cũng', pronunciation: '[aukh]' },
      { german: 'Kuchen', vietnamese: 'bánh ngọt', pronunciation: '[kuu-khơn]' },
    ],
    mistakeAlert: 'Đừng phát âm thành âm "ch" tiếng Việt (Bút/Nách). Phải có độ ma sát sâu trong họng.',
  },
  {
    id: 'r_sound',
    symbol: 'r / R',
    name: 'Âm "R" tiếng Đức (Rung cuống họng / Rung lưỡi gà)',
    difficulty: 'Khó',
    mouthPlacement: 'Mở miệng tự nhiên, thả lỏng đầu lưỡi ở hàm dưới. Dùng luồng hơi làm rung nhẹ lưỡi gà (cuống họng) như khi súc miệng bằng nước.',
    vietnameseApproximation: 'Tương tự như tiếng súc họng khò nước buổi sáng [gh/r-họng]. Cuối từ đọc nhẹ thành âm [ờ] (Vater -> Pha-tờ).',
    examples: [
      { german: 'rot', vietnamese: 'màu đỏ', pronunciation: '[roht / ghoht]' },
      { german: 'Reis', vietnamese: 'cơm/gạo', pronunciation: '[rais]' },
      { german: 'Wasser', vietnamese: 'nước', pronunciation: '[va-sờ]' },
      { german: 'Bruder', vietnamese: 'anh/em trai', pronunciation: '[bruu-đờ]' },
    ],
    mistakeAlert: 'Không cần uốn cong lưỡi kiểu "r" miền Nam. Khi chữ "er" ở cuối từ (như Mutter, Vater), đọc lướt thành âm [ờ] nhẹ.',
  },
  {
    id: 'umlaut_ue',
    symbol: 'ü / Ü',
    name: 'Nguyên âm biến âm Ü (U-Umlaut)',
    difficulty: 'Khó',
    mouthPlacement: 'Đặt lưỡi ở vị trí phát âm chữ [i] trong tiếng Việt, nhưng đồng thời CHU TRÒN MÔI như khi thổi sáo hoặc huýt sáo.',
    vietnameseApproximation: 'Lai giữa [uy] và [i] (chu tròn môi phát âm chữ i).',
    examples: [
      { german: 'über', vietnamese: 'bên trên, về', pronunciation: '[uy-bờ]' },
      { german: 'Tschüss', vietnamese: 'tạm biệt', pronunciation: '[t-shuy-ss]' },
      { german: 'fünf', vietnamese: 'số 5', pronunciation: '[fynf]' },
      { german: 'München', vietnamese: 'thành phố Munich', pronunciation: '[Myn-khen]' },
    ],
    mistakeAlert: 'Không đọc thành chữ [u] đơn thuần. Nếu môi không chu tròn, người Đức sẽ nghe nhầm thành từ khác.',
  },
  {
    id: 'umlaut_oe',
    symbol: 'ö / Ö',
    name: 'Nguyên âm biến âm Ö (O-Umlaut)',
    difficulty: 'Trung bình',
    mouthPlacement: 'Đặt khẩu hình lưỡi phát âm chữ [ê], nhưng mở tròn môi như chữ [ô]. Giữ nguyên môi tròn và phát âm.',
    vietnameseApproximation: 'Lai giữa [ơ] và [uê], môi hơi tròn mở vừa phải.',
    examples: [
      { german: 'schön', vietnamese: 'đẹp, tuyệt', pronunciation: '[shơn / shuên]' },
      { german: 'Österreich', vietnamese: 'nước Áo', pronunciation: '[Ơ-stơ-raikh]' },
      { german: 'hören', vietnamese: 'nghe', pronunciation: '[hơ-rơn]' },
      { german: 'König', vietnamese: 'vua', pronunciation: '[kơ-nikh]' },
    ],
    mistakeAlert: 'Đừng nhầm với chữ "ô" hay "o". Giữ chặt cơ môi khi phát âm.',
  },
  {
    id: 'umlaut_ae',
    symbol: 'ä / Ä',
    name: 'Nguyên âm biến âm Ä (A-Umlaut)',
    difficulty: 'Dễ',
    mouthPlacement: 'Mở rộng miệng sang hai bên, phát âm âm [e] bẹt hoặc lai [e] và [a].',
    vietnameseApproximation: 'Giống chữ [e] bẹt hoặc [ae] trong tiếng Anh (như cat).',
    examples: [
      { german: 'Äpfel', vietnamese: 'những quả táo', pronunciation: '[ep-fồ]' },
      { german: 'Käse', vietnamese: 'phô mai', pronunciation: '[ke-zơ]' },
      { german: 'März', vietnamese: 'tháng 3', pronunciation: '[merts]' },
    ],
    mistakeAlert: 'Khá dễ với người Việt, chỉ cần nhớ phát âm giống âm "e".',
  },
  {
    id: 'eszett',
    symbol: 'ß (Eszett / Scharfes S)',
    name: 'Ký tự ß (S sắc / s kéo dài)',
    difficulty: 'Dễ',
    mouthPlacement: 'Hai hàm răng khép hờ, mép môi hé nhẹ. Thổi luồng hơi gió sắc nét như chữ "s" kéo dài.',
    vietnameseApproximation: 'Phát âm hoàn toàn tương đương cụm [ss] (chữ s không bao giờ rung).',
    examples: [
      { german: 'heißen', vietnamese: 'tên là', pronunciation: '[hai-sơn]' },
      { german: 'groß', vietnamese: 'to lớn', pronunciation: '[groh-ss]' },
      { german: 'Straße', vietnamese: 'con đường', pronunciation: '[straa-sơ]' },
    ],
    mistakeAlert: 'Ký tự ß không phải chữ "B" (Bê)! Đây là chữ tượng trưng cho âm [ss] sau nguyên âm dài hoặc nguyên âm đôi.',
  },
  {
    id: 'sp_st',
    symbol: 'sp / st (Đầu từ)',
    name: 'Cụm "sp" và "st" đứng đầu từ',
    difficulty: 'Dễ',
    mouthPlacement: 'Khi "sp" hoặc "st" đứng đầu một từ hoặc một âm tiết gốc, chữ "s" sẽ tự động biến thành âm [sh] (s nặng / uốn lưỡi).',
    vietnameseApproximation: 'Đọc là [shp] và [sht].',
    examples: [
      { german: 'Sport', vietnamese: 'thể thao', pronunciation: '[Shpô-t]' },
      { german: 'sprechen', vietnamese: 'nói', pronunciation: '[shpre-khơn]' },
      { german: 'Stadt', vietnamese: 'thành phố', pronunciation: '[Shtaat]' },
      { german: 'Student', vietnamese: 'sinh viên', pronunciation: '[Shtu-dent]' },
    ],
    mistakeAlert: 'Người quen tiếng Anh hay đọc là "s-port", "s-tudent". Trong tiếng Đức bắt buộc phải đọc là "Shport", "Shtudent"!',
  },
  {
    id: 'ei_ie',
    symbol: 'ei vs. ie',
    name: 'Cặp dễ nhầm lẫn: "ei" [ai] và "ie" [i dài]',
    difficulty: 'Dễ',
    mouthPlacement: 'Mẹo vàng: Nhìn chữ cái đứng sau! Có chữ "i" phía sau -> [ai]. Có chữ "e" phía sau -> [i dài].',
    vietnameseApproximation: '"ei" đọc là [ai] (Mein = Main), "ie" đọc là [i:] (Sie = Zii).',
    examples: [
      { german: 'mein', vietnamese: 'của tôi', pronunciation: '[main]' },
      { german: 'drei', vietnamese: 'số 3', pronunciation: '[drai]' },
      { german: 'sie', vietnamese: 'cô ấy / họ', pronunciation: '[zii]' },
      { german: 'lieben', vietnamese: 'yêu', pronunciation: '[lii-bơn]' },
    ],
    mistakeAlert: 'Quy tắc phản xạ 1 giây: Gặp "ei" là "ai", gặp "ie" là "i"!',
  },
];

export const PhoneticsGuideModal: React.FC<PhoneticsGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSoundId, setSelectedSoundId] = useState<string>(GERMAN_SOUNDS[0].id);

  if (!isOpen) return null;

  const currentSound = GERMAN_SOUNDS.find((s) => s.id === selectedSoundId) || GERMAN_SOUNDS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              🗣️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Cẩm Nang Khẩu Hình & Phát Âm Chuẩn Đức
              </h2>
              <p className="text-xs text-slate-500">
                Bí quyết làm chủ các âm khó nhất (ch, r, ö, ü, ä, sp, st) cho người Việt
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

        {/* Sound Selector Horizontal Scroll */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {GERMAN_SOUNDS.map((s) => {
            const isSelected = s.id === selectedSoundId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSoundId(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{s.symbol}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    s.difficulty === 'Khó'
                      ? 'bg-red-500 text-white'
                      : s.difficulty === 'Trung bình'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {s.difficulty}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Main Sound Info Card */}
          <div className="p-5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-3xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-900 font-mono">
                {currentSound.symbol}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Độ khó: {currentSound.difficulty}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {currentSound.name}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              💡 <strong>Gần giống tiếng Việt:</strong> {currentSound.vietnameseApproximation}
            </p>
          </div>

          {/* Mouth & Tongue Placement */}
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Info className="w-4 h-4 text-blue-600" />
              Hướng dẫn đặt môi & lưỡi (Khẩu hình chuẩn):
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {currentSound.mouthPlacement}
            </p>
          </div>

          {/* Examples with Native Audio */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Từ vựng mẫu & Luyện phát âm
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentSound.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:border-amber-400 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 text-sm">{ex.german}</p>
                    <p className="text-xs text-slate-500">{ex.vietnamese}</p>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
                      {ex.pronunciation}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      speechService.speak(ex.german);
                      speechService.playSuccessSound();
                    }}
                    className="p-2.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-xl transition-all shadow-xs"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mistake Alert Box */}
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              ⚠️ Lỗi người Việt thường mắc phải:
            </p>
            <p className="text-red-800 text-[11px] leading-relaxed">
              {currentSound.mistakeAlert}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 hidden sm:block">
            Mẹo: Nghe và lặp lại 3-5 lần mỗi từ để cơ miệng tạo thành phản xạ.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all"
          >
            Đã hiểu & Tiếp tục học
          </button>
        </div>
      </div>
    </div>
  );
};
