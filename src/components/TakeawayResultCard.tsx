import React from 'react';
import { Sparkles, ArrowRight, RotateCcw, Home } from 'lucide-react';

interface TakeawayResultCardProps {
  quote: string;
  onTryAnother: () => void;
  onBackToHome: () => void;
}

export const TakeawayResultCard: React.FC<TakeawayResultCardProps> = ({
  quote,
  onTryAnother,
  onBackToHome
}) => {
  return (
    <div className="p-6 bg-gradient-to-tr from-[#FAF7F0] via-white to-[#EFEAE0] border border-[#8FAF9A]/50 rounded-3xl space-y-4 text-center animate-fade-in shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-[#8FAF9A]/20 text-[#355C4A] flex items-center justify-center mx-auto text-xl">
        🌱
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-bold text-[#355C4A]">خُد معك لهذه اللحظة</span>
        <blockquote className="text-sm sm:text-base font-bold text-[#26332D] leading-relaxed max-w-md mx-auto">
          {quote}
        </blockquote>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onTryAnother}
          className="flex-1 py-3 px-4 bg-[#FAF7F0] hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>جرّب حاجة تانية</span>
        </button>

        <button
          onClick={onBackToHome}
          className="flex-1 py-3 px-4 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>رجوع للرئيسية</span>
        </button>
      </div>
    </div>
  );
};
