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
  { id: 'home', label: 'Học', icon: Home },
  { id: 'learn', label: 'Lộ trình', icon: BookOpen },
  { id: 'conversation', label: 'Hội thoại', icon: MessageSquare },
  { id: 'vocab', label: 'Ôn từ', icon: Layers },
];

const moreTabs = [
  { id: 'tutor', label: 'AI Tutor', icon: Bot },
  { id: 'grammar', label: 'Ngữ pháp', icon: BookOpen },
  { id: 'mistakes', label: 'Lỗi sai', icon: AlertCircle },
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
            aria-label="Đóng menu"
            className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]"
            onClick={() => setMoreOpen(false)}
          />

          <section
            className="absolute inset-x-3 rounded-[22px] border border-black/[0.08] bg-white p-3 shadow-2xl"
            style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-black text-slate-950">Thêm</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500"
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
                    className={`relative flex min-h-[58px] items-center gap-2.5 rounded-xl px-3 text-left transition ${
                      active
                        ? 'bg-amber-50 text-slate-950 ring-1 ring-amber-200'
                        : 'bg-[#f7f7f5] text-slate-700'
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                        active ? 'bg-amber-500 text-white' : 'bg-white text-slate-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate text-xs font-extrabold">{item.label}</span>
                    {item.id === 'mistakes' && mistakesCount > 0 && (
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/[0.97] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid h-[60px] max-w-lg grid-cols-5 px-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigate(tab.id)}
                className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[9px] font-bold transition ${
                  active ? 'text-slate-950' : 'text-slate-400'
                }`}
              >
                <span
                  className={`grid h-8 w-10 place-items-center rounded-xl transition ${
                    active ? 'bg-amber-100 text-amber-700' : ''
                  }`}
                >
                  <Icon className="h-[17px] w-[17px]" />
                </span>
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen((value) => !value)}
            className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[9px] font-bold transition ${
              moreActive || moreOpen ? 'text-slate-950' : 'text-slate-400'
            }`}
          >
            <span
              className={`relative grid h-8 w-10 place-items-center rounded-xl transition ${
                moreActive || moreOpen ? 'bg-amber-100 text-amber-700' : ''
              }`}
            >
              <MoreHorizontal className="h-[18px] w-[18px]" />
              {mistakesCount > 0 && (
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </span>
            Thêm
          </button>
        </div>
      </nav>
    </>
  );
};
