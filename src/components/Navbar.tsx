import React from 'react';
import {
  Search,
  StickyNote,
  Flame,
  Sparkles,
  BookOpen,
  Layers,
  MessageSquare,
  AlertCircle,
  BarChart3,
  Bot,
} from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  progress: UserProgress;
  onOpenSearch: () => void;
  onOpenNotes: () => void;
  onOpenDailySession: () => void;
}

const navItems = [
  { id: 'home', label: 'Hôm nay', icon: Sparkles },
  { id: 'learn', label: 'Lộ trình', icon: BookOpen },
  { id: 'vocab', label: 'Từ vựng', icon: Layers },
  { id: 'grammar', label: 'Ngữ pháp', icon: BookOpen },
  { id: 'conversation', label: 'Hội thoại', icon: MessageSquare },
  { id: 'tutor', label: 'AI Tutor', icon: Bot },
  { id: 'mistakes', label: 'Lỗi sai', icon: AlertCircle },
  { id: 'progress', label: 'Tiến độ', icon: BarChart3 },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  progress,
  onOpenSearch,
  onOpenNotes,
  onOpenDailySession,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f7f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex shrink-0 items-center gap-3 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Về trang chủ"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-[11px] font-black tracking-[0.12em] text-white shadow-sm">
            DE
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black tracking-tight text-slate-950">DeutschStart</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              A0 → A2
            </span>
          </span>
        </button>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12px] font-semibold transition-all ${
                  active
                    ? 'bg-white text-slate-950 shadow-sm ring-1 ring-black/[0.06]'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-950'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-amber-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenDailySession}
            className="hidden items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 md:flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Học 20 phút
          </button>

          <button
            onClick={() => onNavigate('progress')}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.06] bg-white px-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-amber-200 hover:text-amber-700"
            title="Chuỗi ngày học"
          >
            <Flame className="h-4 w-4 fill-orange-400 text-orange-400" />
            {progress.streakDays || 0}
          </button>

          <button
            onClick={onOpenSearch}
            className="grid h-9 w-9 place-items-center rounded-xl border border-black/[0.06] bg-white text-slate-500 shadow-sm transition hover:text-slate-950"
            title="Tìm kiếm — Ctrl/⌘ K"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenNotes}
            className="hidden h-9 w-9 place-items-center rounded-xl border border-black/[0.06] bg-white text-slate-500 shadow-sm transition hover:text-slate-950 sm:grid"
            title="Ghi chú"
          >
            <StickyNote className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
