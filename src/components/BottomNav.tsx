import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Layers,
  Bot,
  BarChart3,
  MoreHorizontal,
  MessageSquare,
  AlertCircle,
  X,
} from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: any) => void;
  mistakesCount?: number;
}

const primaryTabs = [
  { id: 'home', label: 'Hôm nay', icon: Home },
  { id: 'learn', label: 'Lộ trình', icon: BookOpen },
  { id: 'vocab', label: 'Từ vựng', icon: Layers },
  { id: 'tutor', label: 'AI Tutor', icon: Bot },
];

const moreTabs = [
  { id: 'grammar', label: 'Ngữ pháp', icon: BookOpen },
  { id: 'conversation', label: 'Hội thoại', icon: MessageSquare },
  { id: 'mistakes', label: 'Sổ lỗi', icon: AlertCircle },
  { id: 'progress', label: 'Tiến độ', icon: BarChart3 },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  mistakesCount = 0,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreTabs.some((item) => item.id === currentView);

  const navigate = (view: string) => {
    setMoreOpen(false);
    onNavigate(view);
  };

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu học thêm"
            className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]"
            onClick={() => setMoreOpen(false)}
          />
          <section className="absolute inset-x-3 bottom-[78px] rounded-[24px] border border-black/[0.08] bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <div>
                <p className="text-sm font-black text-slate-950">Học thêm</p>
                <p className="text-[11px] font-medium text-slate-400">Các khu vực dùng ít thường xuyên hơn</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`relative flex min-h-[72px] items-center gap-3 rounded-2xl px-4 text-left transition ${
                      active ? 'bg-amber-50 text-slate-950 ring-1 ring-amber-200' : 'bg-[#f7f7f5] text-slate-700'
                    }`}
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? 'bg-amber-500 text-white' : 'bg-white text-slate-500'}`}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold">{item.label}</span>
                      {item.id === 'mistakes' && mistakesCount > 0 && (
                        <span className="mt-0.5 block text-[11px] font-bold text-red-600">{mistakesCount} lỗi cần ôn</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-[68px] max-w-lg grid-cols-5 px-2">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition ${active ? 'text-slate-950' : 'text-slate-400'}`}
              >
                <span className={`grid h-8 w-10 place-items-center rounded-xl transition ${active ? 'bg-amber-100 text-amber-700' : ''}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen((value) => !value)}
            className={`relative flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition ${moreActive || moreOpen ? 'text-slate-950' : 'text-slate-400'}`}
          >
            <span className={`relative grid h-8 w-10 place-items-center rounded-xl transition ${moreActive || moreOpen ? 'bg-amber-100 text-amber-700' : ''}`}>
              <MoreHorizontal className="h-[19px] w-[19px]" />
              {mistakesCount > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
            </span>
            Thêm
          </button>
        </div>
      </nav>
    </>
  );
};
