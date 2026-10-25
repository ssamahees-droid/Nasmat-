/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { CipherLevel } from '../../data/nesmatCipherData';

interface CipherWheelStationProps {
  level: CipherLevel;
  onSolve: (answer: string) => void;
  isSolved: boolean;
  onSound?: (type: 'click' | 'snap' | 'success') => void;
}

export const CipherWheelStation: React.FC<CipherWheelStationProps> = ({
  level,
  onSolve,
  isSolved,
  onSound
}) => {
  const correctAnswer = String(level.puzzleData.correctAnswer);

  // If level 3 (Breathing seconds) or numbers
  const isLevel3 = level.id === 3;
  const [inhaleSec, setInhaleSec] = useState<number>(2);
  const [exhaleSec, setExhaleSec] = useState<number>(6);

  // General dial values
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLevel3Adjust = (type: 'inhale' | 'exhale', delta: number) => {
    if (isSolved) return;
    onSound?.('click');
    if (type === 'inhale') {
      const next = Math.max(1, Math.min(12, inhaleSec + delta));
      setInhaleSec(next);
    } else {
      const next = Math.max(1, Math.min(12, exhaleSec + delta));
      setExhaleSec(next);
    }
    setFeedback(null);
  };

  const handleVerifyDial = () => {
    if (isLevel3) {
      if (inhaleSec === 4 && exhaleSec === 4) {
        onSound?.('success');
        setFeedback('شفرة التنفس صحيحة تماماً: 4 ثوانٍ شهيق متناسقة مع 4 ثوانٍ زفير! ✨');
        onSolve(correctAnswer);
      } else {
        onSound?.('click');
        setFeedback(`الإيقاع الحالي (${inhaleSec}ث / ${exhaleSec}ث) غير متوازن. ابحث عن إيقاع الهدوء (٤ ثوانٍ و٤ ثوانٍ) 🍃`);
      }
      return;
    }

    if (!selectedOption) {
      setFeedback('يرجى اختيار الرمز أو الإيقاع لفك الشفرة أولاً.');
      return;
    }

    const normSelected = selectedOption.trim().toLowerCase();
    const normCorrect = correctAnswer.trim().toLowerCase();

    if (normSelected === normCorrect || normSelected.includes(normCorrect) || normCorrect.includes(normSelected)) {
      onSound?.('success');
      setFeedback('تم فك الشفرة بنجاح وانفتحت البوابة! 🌟');
      onSolve(correctAnswer);
    } else {
      onSound?.('click');
      setFeedback('الشفرة غير متطابقة. تأمل رمز الهدوء في التلميحات.');
    }
  };

  return (
    <div className="space-y-5 select-none font-cairo">
      {/* Decorative Brass/Emerald Vault Header */}
      <div className="p-4 rounded-3xl bg-stone-900 border-2 border-amber-600/40 text-amber-200 text-center shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-amber-400" />
          <h4 className="font-black text-sm text-amber-300">
            {isLevel3 ? '🎛️ أسطوانة ضبط إيقاع النافورة' : '🔐 محطة فك شفرات الحكمة'}
          </h4>
        </div>
        <p className="text-[11px] text-stone-300 font-medium">
          {isLevel3
            ? 'اضبط ثواني الشهيق والزفير ليعتدل تدفق الماء بانسجام'
            : 'اختر الرمز أو الإيقاع الصحيح لتدوير قرص القفل'}
        </p>

        {/* Level 3 Specific Interactive Dual Dials */}
        {isLevel3 ? (
          <div className="mt-4 flex items-center justify-center gap-6 p-4 bg-stone-950/80 rounded-2xl border border-amber-500/20 max-w-sm mx-auto">
            {/* Inhale Dial */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block">ثواني الشهيق</span>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleLevel3Adjust('inhale', 1)}
                  disabled={isSolved}
                  className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <div className="w-14 h-14 my-1 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-xl font-black text-amber-300 font-mono">
                  {inhaleSec}ث
                </div>
                <button
                  type="button"
                  onClick={() => handleLevel3Adjust('inhale', -1)}
                  disabled={isSolved}
                  className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="text-stone-500 text-2xl font-light">/</div>

            {/* Exhale Dial */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block">ثواني الزفير</span>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleLevel3Adjust('exhale', 1)}
                  disabled={isSolved}
                  className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <div className="w-14 h-14 my-1 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-xl font-black text-amber-300 font-mono">
                  {exhaleSec}ث
                </div>
                <button
                  type="button"
                  onClick={() => handleLevel3Adjust('exhale', -1)}
                  disabled={isSolved}
                  className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* General Cipher Choice Dials */
          level.puzzleData.options && (
            <div className="mt-4 grid grid-cols-1 gap-2.5 max-w-md mx-auto text-right">
              {level.puzzleData.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (isSolved) return;
                    onSound?.('click');
                    setSelectedOption(opt);
                    setFeedback(null);
                  }}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                    selectedOption === opt
                      ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-500/50'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === opt ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                  }`}>
                    {selectedOption === opt && <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
          feedback.includes('صحيحة') || feedback.includes('بنجاح')
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
        }`}>
          {feedback}
        </div>
      )}

      {!isSolved && (
        <button
          type="button"
          onClick={handleVerifyDial}
          className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <Unlock className="w-4 h-4" />
          <span>تدوير القفل وفك الشفرة 🔓</span>
        </button>
      )}
    </div>
  );
};
