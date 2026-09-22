import React, { useState } from 'react';
import { 
  X, 
  Table, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Volume2 
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface AdjektivAndPrepositionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'wechselpraepositionen' | 'kasus' | 'adjektivdeklination';

export const AdjektivAndPrepositionMatrixModal: React.FC<AdjektivAndPrepositionMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('wechselpraepositionen');
  const [caseFilter, setCaseFilter] = useState<'all' | 'dativ' | 'akkusativ'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg">
              📐
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Ma Trận Ngữ Pháp Trực Quan A1 – A2
              </h2>
              <p className="text-xs text-slate-500">
                Làm chủ Giới từ 2 cách, Bảng 4 cách (Kasus) và Đuôi tính từ không sợ nhầm lẫn
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

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('wechselpraepositionen')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'wechselpraepositionen'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📍 9 Giới từ 2 cách (Wechselpräpositionen)
          </button>
          <button
            onClick={() => setActiveTab('kasus')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'kasus'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📊 Bảng Biến Đổi 4 Cách (Kasus)
          </button>
          <button
            onClick={() => setActiveTab('adjektivdeklination')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'adjektivdeklination'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎨 Chia Đuôi Tính Từ (Adjektivdeklination)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WECHSELPRÄPOSITIONEN */}
          {activeTab === 'wechselpraepositionen' && (
            <div className="space-y-5">
              {/* Golden Rule Formula Box */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 space-y-3">
                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Quy Tắc Vàng 1 Giây: "Wo?" vs "Wohin?"
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-1">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      WO? (Ở đâu? - Vị trí tĩnh) ➡️ DATIV
                    </span>
                    <p className="text-xs text-slate-600">
                      Hành động đứng yên, không đổi vị trí. <em>(stehen, liegen, sitzen, sein)</em>
                    </p>
                    <p className="text-xs font-semibold text-slate-900 pt-1">
                      👉 Das Buch liegt <strong>auf dem</strong> Tisch. (Cuốn sách đang nằm trên bàn).
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-1">
                    <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      WOHIN? (Đi đâu? - Phương hướng) ➡️ AKKUSATIV
                    </span>
                    <p className="text-xs text-slate-600">
                      Hành động di chuyển hoặc tác động làm đổi vị trí. <em>(stellen, legen, setzen, gehen)</em>
                    </p>
                    <p className="text-xs font-semibold text-slate-900 pt-1">
                      👉 Ich lege das Buch <strong>auf den</strong> Tisch. (Tôi đặt sách lên bàn).
                    </p>
                  </div>
                </div>
              </div>

              {/* 9 Prepositions Interactive Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Danh sách 9 Giới từ 2 cách kèm ví dụ so sánh
                  </h4>
                  <div className="flex gap-1 text-xs">
                    <button
                      onClick={() => setCaseFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${
                        caseFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setCaseFilter('dativ')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${
                        caseFilter === 'dativ' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      Wo? (Dativ)
                    </button>
                    <button
                      onClick={() => setCaseFilter('akkusativ')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${
                        caseFilter === 'akkusativ' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      Wohin? (Akk)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { prep: 'an', meaning: 'sát bên cạnh, gắn trên', dativ: 'Das Bild hängt an der Wand.', akk: 'Ich hänge das Bild an die Wand.' },
                    { prep: 'auf', meaning: 'ở phía trên bề mặt', dativ: 'Die Tasse steht auf dem Tisch.', akk: 'Ich stelle die Tasse auf den Tisch.' },
                    { prep: 'hinter', meaning: 'phía sau', dativ: 'Das Auto steht hinter dem Haus.', akk: 'Er fährt das Auto hinter das Haus.' },
                    { prep: 'in', meaning: 'bên trong', dativ: 'Ich bin in der Schule.', akk: 'Ich gehe in die Schule.' },
                    { prep: 'neben', meaning: 'ngay cạnh', dativ: 'Er sitzt neben meiner Schwester.', akk: 'Er setzt sich neben meine Schwester.' },
                    { prep: 'über', meaning: 'phía trên (không chạm)', dativ: 'Die Lampe hängt über dem Tisch.', akk: 'Wir hängen die Lampe über den Tisch.' },
                    { prep: 'unter', meaning: 'ở dưới', dativ: 'Der Hund schläft unter dem Bett.', akk: 'Der Hund läuft unter das Bett.' },
                    { prep: 'vor', meaning: 'ở đằng trước', dativ: 'Wir warten vor dem Bahnhof.', akk: 'Kommen Sie vor die Tür!' },
                    { prep: 'zwischen', meaning: 'ở giữa hai vật', dativ: 'Der Stuhl steht zwischen den Tischen.', akk: 'Ich stelle den Stuhl zwischen die Tische.' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-amber-700 font-mono">
                          {item.prep}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.meaning}
                        </span>
                      </div>
                      {(caseFilter === 'all' || caseFilter === 'dativ') && (
                        <div className="p-2 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs space-y-0.5">
                          <span className="font-bold text-emerald-800 text-[10px] uppercase">Dativ (Wo?):</span>
                          <p className="text-slate-800 font-medium">{item.dativ}</p>
                          <button
                            onClick={() => speechService.speak(item.dativ)}
                            className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1 pt-0.5"
                          >
                            <Volume2 className="w-3 h-3" /> Nghe câu
                          </button>
                        </div>
                      )}
                      {(caseFilter === 'all' || caseFilter === 'akkusativ') && (
                        <div className="p-2 bg-indigo-50/70 border border-indigo-200/60 rounded-xl text-xs space-y-0.5">
                          <span className="font-bold text-indigo-800 text-[10px] uppercase">Akkusativ (Wohin?):</span>
                          <p className="text-slate-800 font-medium">{item.akk}</p>
                          <button
                            onClick={() => speechService.speak(item.akk)}
                            className="text-[10px] text-indigo-700 hover:underline flex items-center gap-1 pt-0.5"
                          >
                            <Volume2 className="w-3 h-3" /> Nghe câu
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KASUS */}
          {activeTab === 'kasus' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Cách (Kasus)</th>
                      <th className="p-3 text-blue-700 bg-blue-50/50">Maskulin (Giống đực)</th>
                      <th className="p-3 text-red-700 bg-red-50/50">Feminin (Giống cái)</th>
                      <th className="p-3 text-emerald-700 bg-emerald-50/50">Neutral (Giống trung)</th>
                      <th className="p-3 text-amber-700 bg-amber-50/50">Plural (Số nhiều)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">
                        Nominativ<br/><span className="text-[10px] font-normal text-slate-400">Chủ ngữ (Ai?)</span>
                      </td>
                      <td className="p-3 font-bold text-blue-700 bg-blue-50/20">der / ein / kein</td>
                      <td className="p-3 font-bold text-red-700 bg-red-50/20">die / eine / keine</td>
                      <td className="p-3 font-bold text-emerald-700 bg-emerald-50/20">das / ein / kein</td>
                      <td className="p-3 font-bold text-amber-700 bg-amber-50/20">die / - / keine</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">
                        Akkusativ<br/><span className="text-[10px] font-normal text-slate-400">Tân ngữ trực tiếp (Cái gì?)</span>
                      </td>
                      <td className="p-3 font-black text-blue-900 bg-blue-100/50 border border-blue-300 rounded">
                        den / einen / keinen ⚡
                      </td>
                      <td className="p-3 font-bold text-red-700 bg-red-50/20">die / eine / keine</td>
                      <td className="p-3 font-bold text-emerald-700 bg-emerald-50/20">das / ein / kein</td>
                      <td className="p-3 font-bold text-amber-700 bg-amber-50/20">die / - / keine</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">
                        Dativ<br/><span className="text-[10px] font-normal text-slate-400">Tân ngữ gián tiếp (Cho ai?)</span>
                      </td>
                      <td className="p-3 font-bold text-blue-800 bg-blue-50/20">dem / einem / keinem</td>
                      <td className="p-3 font-bold text-red-800 bg-red-50/20">der / einer / keiner</td>
                      <td className="p-3 font-bold text-emerald-800 bg-emerald-50/20">dem / einem / keinem</td>
                      <td className="p-3 font-bold text-amber-800 bg-amber-50/20">den (+n) / - / keinen (+n)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900">
                        Genitiv<br/><span className="text-[10px] font-normal text-slate-400">Sở hữu (Của ai?)</span>
                      </td>
                      <td className="p-3 font-bold text-blue-800 bg-blue-50/20">des (+s/es) / eines</td>
                      <td className="p-3 font-bold text-red-800 bg-red-50/20">der / einer</td>
                      <td className="p-3 font-bold text-emerald-800 bg-emerald-50/20">des (+s/es) / eines</td>
                      <td className="p-3 font-bold text-amber-800 bg-amber-50/20">der / - / keiner</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                💡 <strong>Mẹo nhớ siêu nhanh:</strong> Ở cách Akkusativ, <em>chỉ có duy nhất giống đực (Maskulin) bị đổi thành "den/einen"</em>. Giống cái, giống trung và số nhiều giữ nguyên y hệt như Nominativ!
              </div>
            </div>
          )}

          {/* TAB 3: ADJEKTIVDEKLINATION */}
          {activeTab === 'adjektivdeklination' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Quy Tắc Đuôi Tính Từ Sau Quán Từ Xác Định (der / die / das)
                </h3>
                <p className="text-xs text-slate-600">
                  Ở Nominativ: Giống đực, cái, trung thêm đuôi <strong>-e</strong>. Số nhiều luôn thêm đuôi <strong>-en</strong>.
                  <br />
                  Ở Dativ & Genitiv: TẤT CẢ các giống đều thêm đuôi <strong>-en</strong>!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    Sau "der/die/das" (Xác định)
                  </span>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>• der neu<strong>e</strong> Tisch (cái bàn mới)</li>
                    <li>• die schön<strong>e</strong> Frau (người phụ nữ đẹp)</li>
                    <li>• das klein<strong>e</strong> Kind (đứa trẻ nhỏ)</li>
                    <li>• die alt<strong>en</strong> Bücher (những cuốn sách cũ)</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    Sau "ein/eine/kein" (Không xác định)
                  </span>
                  <ul className="space-y-1.5 text-slate-700">
                    <li>• ein neu<strong>er</strong> Tisch (một cái bàn mới)</li>
                    <li>• eine schön<strong>e</strong> Frau (một người phụ nữ đẹp)</li>
                    <li>• ein klein<strong>es</strong> Kind (một đứa trẻ nhỏ)</li>
                    <li>• keine neu<strong>en</strong> Autos (không có chiếc xe mới nào)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 hidden sm:block">
            Mẹo: Xem lại bảng này mỗi khi làm bài tập chia mạo từ để không bị bối rối.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
