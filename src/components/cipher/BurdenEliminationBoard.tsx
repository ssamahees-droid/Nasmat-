/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Feather, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CipherLevel } from '../../data/nesmatCipherData';

interface BurdenEliminationBoardProps {
  level: CipherLevel;
  onSolve: (answer: string) => void;
  isSolved: boolean;
  onSound?: (type: 'click' | 'snap' | 'success') => void;
}

export const BurdenEliminationBoard: React.FC<BurdenEliminationBoardProps> = ({
  level,
  onSolve,
  isSolved,
  onSound
}) => {
  const correctAnswer = String(level.puzzleData.correctAnswer);
  const options = level.puzzleData.options || [correctAnswer];

  const [selectedBurden, setSelectedBurden] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (isSolved) return;
    onSound?.('click');
    setSelectedBurden(opt);
    setFeedback(null);
  };

  const handleRelease = () => {
    if (!selectedBurden) {
      setFeedback('يرجى تحديد الغرض أو الثقل الذي ترغبين في استبعاده 🍃');
      return;
    }

    const normSel = selectedBurden.trim().toLowerCase();
    const normCorrect = correctAnswer.trim().toLowerCase();

    if (normSel === normCorrect || normSel.includes(normCorrect) || normCorrect.includes(normSel)) {
      onSound?.('success');
      setFeedback('خيار حكيم! بإسقاط ثقل المقارنة الزائف، خفّت الخطوة وأصبح عبور الجسر آمناً وسهلاً 🕊️');
      onSolve(correctAnswer);
    } else {
      onSound?.('click');
      setFeedback('هذا الغرض ضروري لسلامتك (كالماء أو النور)! ابحثي عن الثقل النفسي غير المفيد.');
    }
  };

  return (
    <div className="space-y-5 select-none font-cairo">
      {/* Visual Bridge Scale / Release Zone */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-stone-900 via-[#1C2420] to-stone-900 border-2 border-amber-600/30 text-center shadow-lg space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Feather className="w-5 h-5 text-amber-400" />
          <h4 className="font-black text-sm text-amber-300">
            ⚖️ منصة تخفيف الأحمال على الجسر المعلق
          </h4>
        </div>
        <p className="text-[11px] text-stone-300">
          حددي الحمولة الزائدة التي تثقل القلب دون فائدة حقيقية لتفريغها برفق:
        </p>

        {/* Visual baggage cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          {options.map((opt, idx) => {
            const isSelected = selectedBurden === opt;
            const isTargetBurden = opt.includes('حجار') || opt.includes('مقارنة') || opt.includes('أعباء');
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={isSolved}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/50 scale-102'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-500/40'
                }`}
              >
                <span className="text-2xl">
                  {idx === 0 ? '💧' : idx === 1 ? '🏮' : '🪨'}
                </span>
                <span className="text-xs font-bold leading-tight line-clamp-3">
                  {opt}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}>
                  {isSelected ? 'محدد للاستبعاد' : 'فحص'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
          feedback.includes('خيار حكيم')
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
        }`}>
          {feedback}
        </div>
      )}

      {!isSolved && (
        <button
          type="button"
          onClick={handleRelease}
          disabled={!selectedBurden}
          className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Feather className="w-4 h-4 text-amber-200" />
          <span>إسقاط هذا الثقل وتخفيف الحمل 🕊️</span>
        </button>
      )}
    </div>
  );
};
