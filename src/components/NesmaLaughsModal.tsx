import React, { useState } from 'react';
import { X, Smile, Sparkles, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { NESMA_LAUGHS_ITEMS, LaughItem } from '../data/newPhaseData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface NesmaLaughsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NesmaLaughsModal: React.FC<NesmaLaughsModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentItem: LaughItem = NESMA_LAUGHS_ITEMS[currentIndex];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % NESMA_LAUGHS_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + NESMA_LAUGHS_ITEMS.length) % NESMA_LAUGHS_ITEMS.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-amber-200 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">😂</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                نسمة تضحك
              </h2>
              <p className="text-[11px] text-[#52645B]">
                جرعة ضحك خفيفة لكسر التوتر وفهم ألاعيب عقلنا اللطيفة
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs text-[#7D8F85]">
            <span>موقف {currentIndex + 1} من {NESMA_LAUGHS_ITEMS.length}</span>
            <span>ابتسم.. الضغط مش نهاية العالم 😊</span>
          </div>

          {/* Situation Card */}
          <div className="p-5 bg-white border border-[#E8DDCC] rounded-3xl space-y-3 text-right shadow-2xs">
            <div className="text-3xl text-center">{currentItem.memeEmoji}</div>
            
            <div className="text-xs sm:text-sm text-[#26332D] whitespace-pre-line leading-relaxed font-medium">
              {currentItem.situation}
            </div>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-2xl text-xs sm:text-sm text-amber-950 font-bold whitespace-pre-line leading-relaxed">
              {currentItem.punchline}
            </div>
          </div>

          {/* Psychology Fact Behind the Joke */}
          <div className="p-4 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl space-y-1">
            <div className="text-xs font-bold text-[#355C4A] flex items-center gap-1.5">
              <span>🧠</span>
              <span>الحقيقة النفسية وراء الموقف:</span>
            </div>
            <p className="text-xs text-[#26332D] leading-relaxed">
              {currentItem.psychFact}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handlePrev}
              className="py-2.5 px-4 bg-white hover:bg-stone-100 border border-[#E8DDCC] text-xs font-bold text-[#26332D] rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>موقف تاني مضحك</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Takeaway Card */}
          <TakeawayResultCard
            quote="«القدرة على الضحك من أنفسنا ومن حيل عقولنا هي أعلى درجات التعافي والمرونة النفسية»"
            onTryAnother={handleNext}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
