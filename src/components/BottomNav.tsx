import React from 'react';
import { Home, BookOpen, Layers, MessageSquare, Bot, AlertCircle } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: any) => void;
  mistakesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  mistakesCount = 0,
}) => {
  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'learn', label: 'Lộ trình', icon: BookOpen },
    { id: 'vocab', label: 'Từ vựng', icon: Layers },
    { id: 'conversation', label: 'Hội thoại', icon: MessageSquare },
    { id: 'tutor', label: 'Gia sư AI', icon: Bot },
    { id: 'mistakes', label: 'Sổ lỗi', icon: AlertCircle, badge: mistakesCount },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-amber-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
