/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SectionExplanationCard.tsx
 * Reusable collapsible guidance card explaining the section's core idea, expected benefit, and how to start.
 */

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SectionExplanation } from '../data/appExplanations';

interface SectionExplanationCardProps {
  explanation: SectionExplanation;
}

export const SectionExplanationCard: React.FC<SectionExplanationCardProps> = ({
  explanation
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#174F3F]/10 via-[#E2EFE7]/50 to-white dark:from-[#14271F] dark:via-[#1B342A] dark:to-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 rounded-2xl p-4 shadow-2xs space-y-2 text-right">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-[#174C3C]/15 dark:bg-[#A9C5A0]/20 text-[#174C3C] dark:text-[#A9C5A0] flex items-center justify-center text-xs shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-[#174C3C] dark:text-[#F7F3E9] group-hover:underline">
            دليل القسم: ما هذا وكيف أستفيد منه؟ 💡
          </span>
        </div>
        <button 
          type="button"
          aria-label={isOpen ? "إخفاء دليل القسم" : "إظهار دليل القسم"}
          className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0] flex items-center gap-1"
        >
          <span>{isOpen ? 'إخفاء الدليل' : 'عرض الدليل'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="pt-3 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 space-y-2.5 text-xs text-[#26332D] dark:text-emerald-100/90 leading-relaxed animate-fade-in">
          <div>
            <span className="font-bold text-[#174C3C] dark:text-emerald-300 block mb-0.5">🌿 فكرة القسم:</span>
            <p>{explanation.coreIdea}</p>
          </div>

          <div>
            <span className="font-bold text-[#174C3C] dark:text-emerald-300 block mb-0.5">🎯 الفائدة المتوقعة:</span>
            <p>{explanation.expectedBenefit}</p>
          </div>

          <div>
            <span className="font-bold text-[#174C3C] dark:text-emerald-300 block mb-0.5">🚀 كيف أبدأ؟</span>
            <p className="font-medium text-[#13251E] dark:text-white bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              {explanation.howToStart}
            </p>
          </div>

          <div className="pt-1 text-[10px] text-stone-500 dark:text-stone-400 italic">
            * هذا القسم أداة مساعدة للتأمل والتعلم، ولا يُعد بديلاً عن الرعاية الطبية المتخصصة.
          </div>
        </div>
      )}
    </div>
  );
};
