/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, Lock, CheckCircle2, Shield, Gift } from 'lucide-react';
import { SecretItem } from '../data/nesmatCipherData';

interface CipherSecretModalProps {
  isOpen: boolean;
  secret: SecretItem | null;
  onClose: () => void;
  onSolve: (secretId: string) => void;
  isSolved: boolean;
}

export const CipherSecretModal: React.FC<CipherSecretModalProps> = ({
  isOpen,
  secret,
  onClose,
  onSolve,
  isSolved
}) => {
  const [showHint, setShowHint] = useState(false);
  const [dewOrder, setDewOrder] = useState<number[]>([]);
  const [selectedParchmentIndex, setSelectedParchmentIndex] = useState<number | null>(null);
  const [crystalSequence, setCrystalSequence] = useState<number[]>([]);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  if (!isOpen || !secret) return null;

  const handleReset = () => {
    setShowHint(false);
    setDewOrder([]);
    setSelectedParchmentIndex(null);
    setCrystalSequence([]);
    setFeedbackError(null);
    onClose();
  };

  const handleVerify = () => {
    setFeedbackError(null);
    let valid = false;

    if (secret.puzzleType === 'garden_dew') {
      valid = dewOrder.length === 2 && dewOrder[0] === 0 && dewOrder[1] === 1;
      if (!valid) {
        setFeedbackError('محاولة قريبة! الندى يهطل ليروي المشاعر أولاً، ثم تسترد الروح نضارتها وتتفتح.');
      }
    } else if (secret.puzzleType === 'library_parchment') {
      valid = selectedParchmentIndex === 0;
      if (!valid) {
        setFeedbackError('تأمل جيداً: حماية الطاقة ليست أداة للقطيعة، بل هي سياج لحفظ المودة الحقيقية.');
      }
    } else if (secret.puzzleType === 'cave_sequence') {
      valid = crystalSequence.length === 3 && crystalSequence[0] === 0 && crystalSequence[1] === 1 && crystalSequence[2] === 2;
      if (!valid) {
        setFeedbackError('يبدأ الوعي بالملاحظة المحايدة، ثم عدم الاندماج مع الفكرة، لينتهي باستقرار السكينة.');
      }
    }

    if (valid) {
      onSolve(secret.id);
      handleReset();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A2520] border border-[#D5DED7] dark:border-stone-700 rounded-3xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-inner">
              {secret.icon}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-white">
                {secret.name}
              </h3>
              <span className="text-[11px] font-bold text-[#B78327]">
                {secret.puzzleTitle}
              </span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Solved View */}
        {isSolved ? (
          <div className="p-5 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950/70 border border-[#23785B]/30 space-y-4 text-right animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-black text-[#23785B] dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>سر مكتشف ومحفوظ في مقتنياتك 🌟</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-stone-900/60 rounded-xl border border-emerald-500/20">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block mb-1">
                المقتنى المكتشف:
              </span>
              <p className="text-sm font-extrabold text-[#174F3F] dark:text-white">
                🎁 {secret.collectibleItem}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 leading-relaxed font-medium">
              {secret.storyReveal}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-[#174F3F] text-white text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          /* Unsolved Interactive Puzzle */
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 font-bold leading-relaxed">
              {secret.puzzleInstructions}
            </p>

            {/* Case 1: Garden Dew (Order 2 tokens) */}
            {secret.puzzleType === 'garden_dew' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {secret.clues.map((clue, idx) => {
                    const isSelected = dewOrder.includes(idx);
                    const orderIndex = dewOrder.indexOf(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isSelected) {
                            setDewOrder(dewOrder.filter(i => i !== idx));
                          } else if (dewOrder.length < 2) {
                            setDewOrder([...dewOrder, idx]);
                          }
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-sm'
                            : 'bg-[#F7F5EF] dark:bg-stone-800 text-[#292F2B] dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
                        }`}
                      >
                        <span>{clue}</span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-white text-[#174F3F] text-xs font-black flex items-center justify-center shrink-0">
                            {orderIndex + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {dewOrder.length > 0 && (
                  <div className="text-[11px] font-bold text-[#B78327] bg-[#F8EED8] dark:bg-amber-950/60 p-2.5 rounded-xl text-center">
                    الترتيب المحدد: {dewOrder.map(i => i === 0 ? '💧 تفريغ المشاعر' : '🌸 استعادة الحيوية').join(' ⟵ ')}
                  </div>
                )}
              </div>
            )}

            {/* Case 2: Library Parchment (Select matching piece) */}
            {secret.puzzleType === 'library_parchment' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#F8EED8] dark:bg-stone-800/80 rounded-2xl border border-[#B78327]/30 text-xs font-bold text-[#174F3F] dark:text-amber-200">
                  📜 القصاصة المكتشفة: «قول كلمة "لا" برفق حين تنفد طاقتك...»
                </div>
                <div className="space-y-2">
                  {secret.clues.map((clue, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedParchmentIndex(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedParchmentIndex === idx
                          ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-sm'
                          : 'bg-[#F7F5EF] dark:bg-stone-800 text-[#292F2B] dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
                      }`}
                    >
                      <span>{clue}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedParchmentIndex === idx ? 'bg-white text-[#174F3F]' : 'border-stone-400'
                      }`}>
                        {selectedParchmentIndex === idx && <div className="w-2.5 h-2.5 rounded-full bg-[#174F3F]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Case 3: Cave Sequence (Click 3 symbols) */}
            {secret.puzzleType === 'cave_sequence' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {secret.clues.map((clue, idx) => {
                    const isSelected = crystalSequence.includes(idx);
                    const orderIndex = crystalSequence.indexOf(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isSelected) {
                            setCrystalSequence(crystalSequence.filter(i => i !== idx));
                          } else if (crystalSequence.length < 3) {
                            setCrystalSequence([...crystalSequence, idx]);
                          }
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-sm'
                            : 'bg-[#F7F5EF] dark:bg-stone-800 text-[#292F2B] dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
                        }`}
                      >
                        <span>{clue}</span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-white text-[#174F3F] text-xs font-black flex items-center justify-center shrink-0">
                            {orderIndex + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {crystalSequence.length > 0 && (
                  <div className="text-[11px] font-bold text-[#B78327] bg-[#F8EED8] dark:bg-amber-950/60 p-2.5 rounded-xl text-center">
                    التسلسل المحدد: {crystalSequence.map(i => i === 0 ? '👁️ الرصد' : i === 1 ? '☁️ الغيمة' : '💎 البلورة').join(' ⟵ ')}
                  </div>
                )}
              </div>
            )}

            {/* Error Feedback */}
            {feedbackError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs font-medium animate-fade-in">
                {feedbackError}
              </div>
            )}

            {/* Optional Hint */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-[#B78327] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'إخفاء التلميح' : '💡 طلب تلميح استكشافي'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed animate-fade-in">
                  {secret.optionalHint}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold cursor-pointer hover:bg-stone-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleVerify}
                className="px-5 py-2.5 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white text-xs font-black transition-all cursor-pointer shadow-sm"
              >
                تأكيد فك شفرة السر ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
