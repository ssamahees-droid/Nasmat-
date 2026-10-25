/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, Sparkles, RefreshCw } from 'lucide-react';
import { CipherLevel } from '../../data/nesmatCipherData';

interface SequenceOrderBoardProps {
  level: CipherLevel;
  onSolve: (answer: string) => void;
  isSolved: boolean;
  onSound?: (type: 'click' | 'snap' | 'success') => void;
}

export const SequenceOrderBoard: React.FC<SequenceOrderBoardProps> = ({
  level,
  onSolve,
  isSolved,
  onSound
}) => {
  // Extract items from correctAnswer if it contains arrows or separators
  const correctRaw = String(level.puzzleData.correctAnswer);
  
  const parseItems = (): string[] => {
    if (correctRaw.includes('←')) {
      return correctRaw.split('←').map(s => s.trim()).filter(Boolean);
    }
    if (correctRaw.includes('->')) {
      return correctRaw.split('->').map(s => s.trim()).filter(Boolean);
    }
    if (correctRaw.includes('،')) {
      return correctRaw.split('،').map(s => s.trim()).filter(Boolean);
    }
    // Fallback: If options exist, extract parts or use options as draggable items
    if (level.puzzleData.options && level.puzzleData.options.length > 1) {
      return [...level.puzzleData.options];
    }
    return [correctRaw];
  };

  const correctSteps = parseItems();

  // Create initial shuffled state
  const [currentSteps, setCurrentSteps] = useState<string[]>(() => {
    if (correctSteps.length <= 1) return correctSteps;
    // Reverse or deterministic rotation so it's not pre-solved
    const reversed = [...correctSteps].reverse();
    return reversed.join('←') === correctSteps.join('←') 
      ? [...correctSteps].sort(() => 0.5 - Math.random()) 
      : reversed;
  });

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const steps = parseItems();
    if (steps.length > 1) {
      const reversed = [...steps].reverse();
      setCurrentSteps(reversed.join('←') === steps.join('←') ? [...steps].sort(() => 0.5 - Math.random()) : reversed);
    } else {
      setCurrentSteps(steps);
    }
    setSelectedIdx(null);
    setFeedback(null);
  }, [level.id]);

  const handleMove = (fromIndex: number, direction: 'up' | 'down') => {
    if (isSolved) return;
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= currentSteps.length) return;

    onSound?.('click');
    const updated = [...currentSteps];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;
    setCurrentSteps(updated);
    setSelectedIdx(toIndex);
    setFeedback(null);
  };

  const handleCardClick = (idx: number) => {
    if (isSolved) return;
    onSound?.('click');
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      // Swap two cards
      onSound?.('snap');
      const updated = [...currentSteps];
      const temp = updated[selectedIdx];
      updated[selectedIdx] = updated[idx];
      updated[idx] = temp;
      setCurrentSteps(updated);
      setSelectedIdx(null);
      setFeedback(null);
    }
  };

  const handleVerify = () => {
    const currentJoined = currentSteps.join(' ← ');
    const isExact = currentSteps.every((step, i) => step === correctSteps[i]);

    if (isExact || currentJoined === correctRaw || currentJoined.includes(correctRaw)) {
      onSound?.('success');
      setFeedback('ترتيب متسق وسليم تماماً! 🌟');
      onSolve(correctRaw);
    } else {
      onSound?.('click');
      setFeedback('الترتيب بحاجة لمراجعة هادئة.. تأمل البداية الطبيعية وكيف ينمو الأمر خطوة بخطوة 🍃');
    }
  };

  const handleReset = () => {
    onSound?.('click');
    const steps = parseItems();
    setCurrentSteps([...steps].reverse());
    setSelectedIdx(null);
    setFeedback(null);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="p-3 bg-[#E2EFE7]/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-500/20 text-xs text-[#174F3F] dark:text-emerald-300 font-bold flex items-center justify-between">
        <span>🔄 لوحة الترتيب التفاعلي: انقر على خطوتين للتبديل بينهما، أو استخدم الأسهم:</span>
        <button
          onClick={handleReset}
          className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 text-stone-600 dark:text-stone-300 transition-colors"
          title="إعادة خلط الخطوات"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {currentSteps.map((step, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectPosition = isSolved || step === correctSteps[idx];

          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                  : isSolved
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/40'
                  : 'bg-white dark:bg-stone-800 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isSolved
                    ? 'bg-emerald-600 text-white'
                    : isSelected
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#174F3F]/10 dark:bg-stone-700 text-[#174F3F] dark:text-emerald-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#292F2B] dark:text-stone-200">
                  {step}
                </span>
              </div>

              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0 || isSolved}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-30 transition-colors cursor-pointer"
                  title="تحريك لأعلى"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === currentSteps.length - 1 || isSolved}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-30 transition-colors cursor-pointer"
                  title="تحريك لأسفل"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
          feedback.includes('سليم')
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
        }`}>
          {feedback}
        </div>
      )}

      {!isSolved && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleVerify}
            className="w-full py-3 rounded-2xl bg-[#174F3F] hover:bg-[#11382C] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>تأكيد الترتيب المنطقي 🌿</span>
          </button>
        </div>
      )}
    </div>
  );
};
