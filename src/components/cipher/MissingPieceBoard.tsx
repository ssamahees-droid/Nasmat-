/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Check, HelpCircle } from 'lucide-react';
import { CipherLevel } from '../../data/nesmatCipherData';

interface MissingPieceBoardProps {
  level: CipherLevel;
  onSolve: (answer: string) => void;
  isSolved: boolean;
  onSound?: (type: 'click' | 'snap' | 'success') => void;
}

export const MissingPieceBoard: React.FC<MissingPieceBoardProps> = ({
  level,
  onSolve,
  isSolved,
  onSound
}) => {
  const correctAnswer = String(level.puzzleData.correctAnswer);
  const options = level.puzzleData.options || [correctAnswer];

  const [slottedPiece, setSlottedPiece] = useState<string | null>(isSolved ? correctAnswer : null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectPiece = (piece: string) => {
    if (isSolved) return;
    onSound?.('snap');
    setSlottedPiece(piece);
    setFeedback(null);
  };

  const handleVerify = () => {
    if (!slottedPiece) {
      setFeedback('يرجى اختيار قطعة حجرية لتثبيتها في الفراغ أولاً 🍃');
      return;
    }

    const normSel = slottedPiece.trim().toLowerCase();
    const normCorrect = correctAnswer.trim().toLowerCase();

    if (normSel === normCorrect || normSel.includes(normCorrect) || normCorrect.includes(normSel)) {
      onSound?.('success');
      setFeedback('تناغم رائع! استقر الحجر بسلاسة وانفتحت الطريق برفق 🌸');
      onSolve(correctAnswer);
    } else {
      onSound?.('click');
      setFeedback('هذه القطعة غير متسقة مع نعومة الممر وطبيعة الحديقة.. جرب الحجر الأملس المتناغم.');
    }
  };

  return (
    <div className="space-y-5 select-none font-cairo">
      {/* Visual Garden Pathway Mosaic Preview */}
      <div className="p-5 rounded-3xl bg-stone-900 border-2 border-emerald-600/30 text-center space-y-4 shadow-inner">
        <span className="text-[11px] font-bold text-emerald-400 block">
          🌿 ممر الحديقة الحجري (الفراغ الشاغر يحتاج للقطعة المتناسقة):
        </span>

        {/* Mosaic Stone Row with Missing Center */}
        <div className="flex items-center justify-center gap-3 py-2">
          {/* Fixed Stone 1 */}
          <div className="w-16 h-16 rounded-3xl bg-stone-700/80 border border-stone-600 flex flex-col items-center justify-center text-stone-300 text-xs font-bold shadow-md">
            <span>🪨</span>
            <span className="text-[10px]">حجر ثابت</span>
          </div>

          {/* Missing Target Slot */}
          <div
            className={`w-24 h-24 rounded-3xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
              slottedPiece
                ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-md ring-2 ring-emerald-500/40 scale-105'
                : 'border-dashed border-amber-400/80 bg-amber-500/10 text-amber-300 animate-pulse'
            }`}
          >
            {slottedPiece ? (
              <>
                <span className="text-2xl mb-1">✨</span>
                <span className="text-[10px] font-black text-center line-clamp-2">
                  {slottedPiece}
                </span>
              </>
            ) : (
              <>
                <HelpCircle className="w-6 h-6 mb-1 text-amber-400" />
                <span className="text-[10px] font-bold text-center">
                  الموضع الشاغر
                </span>
              </>
            )}
          </div>

          {/* Fixed Stone 2 */}
          <div className="w-16 h-16 rounded-3xl bg-stone-700/80 border border-stone-600 flex flex-col items-center justify-center text-stone-300 text-xs font-bold shadow-md">
            <span>🪨</span>
            <span className="text-[10px]">حجر ثابت</span>
          </div>
        </div>
      </div>

      {/* Candidate Pieces */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-stone-600 dark:text-stone-300 block">
          اختر القطعة الحجرية المناسبة للممر:
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          {options.map((opt, idx) => {
            const isSelected = slottedPiece === opt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPiece(opt)}
                disabled={isSolved}
                className={`p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {opt.includes('دائري') || opt.includes('أملس') ? '⚪' : opt.includes('حاد') ? '🔺' : '⬛'}
                  </span>
                  <span>{opt}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'bg-white text-[#174F3F]' : 'border-stone-400'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#174F3F]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
          feedback.includes('تناغم')
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
        }`}>
          {feedback}
        </div>
      )}

      {!isSolved && (
        <button
          type="button"
          onClick={handleVerify}
          disabled={!slottedPiece}
          className="w-full py-3 rounded-2xl bg-[#174F3F] hover:bg-[#11382C] text-white text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>تثبيت الحجر وتأكيد المسار 🪨</span>
        </button>
      )}
    </div>
  );
};
