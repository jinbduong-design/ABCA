import React from 'react';
import { Search, StickyNote, Flame, Sparkles, BookOpen, Layers, MessageSquare, AlertCircle, BarChart3, Bot } from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  progress: UserProgress;
  onOpenSearch: () => void;
  onOpenNotes: () => void;
  onOpenDailySession: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  progress,
  onOpenSearch,
  onOpenNotes,
  onOpenDailySession,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            🇩🇪
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                Deutsch<span className="text-amber-600">Start</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                A0-A2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Học tiếng Đức từ số 0 cho người Việt
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { id: 'home', label: 'Trang chủ', icon: Sparkles },
            { id: 'learn', label: 'Lộ trình', icon: BookOpen },
            { id: 'vocab', label: 'Từ vựng', icon: Layers },
            { id: 'grammar', label: 'Ngữ pháp', icon: BookOpen },
            { id: 'conversation', label: 'Hội thoại', icon: MessageSquare },
            { id: 'tutor', label: 'Gia sư AI', icon: Bot },
            { id: 'mistakes', label: 'Sổ lỗi sai', icon: AlertCircle },
            { id: 'progress', label: 'Tiến độ', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Stats & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick 20-min daily study button */}
          <button
            onClick={onOpenDailySession}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phiên 20 phút</span>
          </button>

          {/* Streak Counter */}
          <div
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200/80 rounded-lg text-orange-700 text-xs font-bold cursor-pointer hover:bg-orange-100/80 transition-colors"
            title="Chuỗi ngày học liên tục"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
            <span>{progress.streakDays}</span>
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/80"
            title="Tìm kiếm từ vựng / ngữ pháp"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notes Button */}
          <button
            onClick={onOpenNotes}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/80"
            title="Sổ tay ghi chú cá nhân"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
