import React from 'react';
import { Sparkles, MessageCircleHeart } from 'lucide-react';

interface CompanionFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const CompanionFloatingButton: React.FC<CompanionFloatingButtonProps> = ({
  onClick,
  isOpen
}) => {
  if (isOpen) return null;

  return (
    <div 
      className="fixed bottom-20 lg:bottom-6 left-5 z-40 flex items-center gap-2 group select-none animate-bounce-subtle"
      dir="rtl"
    >
      <button
        onClick={onClick}
        className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-[#355C4A] to-[#254234] hover:from-[#2A493B] hover:to-[#1B3126] text-white shadow-lg shadow-[#355C4A]/30 border-2 border-white/40 dark:border-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="تحدث مع رفيقي"
        title="تحدث مع رفيقي — رفيق رحلة نسمة حياة"
      >
        {/* Glow Ping Pulse */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
        </span>

        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <div className="flex flex-col text-right leading-none font-cairo">
          <span className="text-xs font-black tracking-wide">رفيقي</span>
          <span className="text-[9px] text-white/80 font-normal">أنا هنا لأسمعك 🌿</span>
        </div>
      </button>
    </div>
  );
};
