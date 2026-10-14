import React from 'react';
import { RotateCcw, Home } from 'lucide-react';
import { TextAudioPlayer } from './TextAudioPlayer';

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
    <div className="p-6 bg-[#E6E8D8]/50 dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 rounded-3xl space-y-4 text-center animate-fade-in shadow-xs transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-[#A9C5A0]/25 text-[#174C3C] dark:text-[#A9C5A0] flex items-center justify-center mx-auto text-xl border border-[#A9C5A0]/30">
        🌱
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0]">خُذ معك لهذه اللحظة</span>
          <TextAudioPlayer
            text={quote}
            id={`takeaway_${encodeURIComponent(quote.slice(0, 15))}`}
            variant="inline"
            label="اسمع الحكمة"
          />
        </div>
        <blockquote className="text-sm sm:text-base font-bold text-[#13251E] dark:text-[#F7F3E9] leading-relaxed max-w-md mx-auto">
          {quote}
        </blockquote>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onTryAnother}
          className="flex-1 py-3 px-4 bg-[#F7F3E9] dark:bg-[#1B342A] hover:bg-stone-100 dark:hover:bg-[#224235] text-[#174C3C] dark:text-[#F7F3E9] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>جرّب حاجة تانية</span>
        </button>

        <button
          onClick={onBackToHome}
          className="flex-1 py-3 px-4 bg-[#174C3C] hover:bg-[#123C30] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] dark:text-[#0D1914] text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>رجوع للرئيسية</span>
        </button>
      </div>
    </div>
  );
};
