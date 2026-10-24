/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, SlidersHorizontal, Heart, Zap, Flame } from 'lucide-react';
import { 
  PuzzleDifficulty, 
  DIFFICULTY_OPTIONS, 
  DifficultyOption 
} from '../../utils/difficultyStorage';

interface DifficultySelectorProps {
  currentDifficulty: PuzzleDifficulty;
  onDifficultyChange: (diff: PuzzleDifficulty) => void;
  compact?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
  compact = false
}) => {
  const currentConfig = DIFFICULTY_OPTIONS[currentDifficulty];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
        {(Object.keys(DIFFICULTY_OPTIONS) as PuzzleDifficulty[]).map((key) => {
          const option = DIFFICULTY_OPTIONS[key];
          const isSelected = currentDifficulty === key;
          return (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? option.colorTheme.activeBg
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title={option.subtitle}
            >
              <span>{option.icon}</span>
              <span>{option.shortTitle}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-[#1C2822]/90 backdrop-blur-md rounded-2xl p-3.5 border border-[#D5DED7] dark:border-stone-700/80 shadow-xs mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#174F3F]/10 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-[#174F3F] dark:text-emerald-300 flex items-center gap-1.5">
              <span>مستوى التحدي والرغبة المزاجية</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-[#515B55] dark:text-stone-400">
              اختر درجة التحدي المناسبة لطاقتك وروحك اليوم
            </p>
          </div>
        </div>

        {/* Current Mood Pill Badge */}
        <div className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${currentConfig.colorTheme.badgeBg}`}>
          <span>{currentConfig.icon}</span>
          <span>الحالة الحالية: {currentConfig.moodTag}</span>
        </div>
      </div>

      {/* Difficulty Selector Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {(Object.keys(DIFFICULTY_OPTIONS) as PuzzleDifficulty[]).map((key) => {
          const option = DIFFICULTY_OPTIONS[key];
          const isSelected = currentDifficulty === key;

          return (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? `${option.colorTheme.bg} ${option.colorTheme.border} ${option.colorTheme.activeRing} shadow-sm`
                  : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{option.icon}</span>
                  <span className={`text-xs font-black ${isSelected ? option.colorTheme.text : 'text-stone-800 dark:text-stone-200'}`}>
                    {option.title}
                  </span>
                </div>

                {isSelected && (
                  <span className={`w-2 h-2 rounded-full ${key === 'easy' ? 'bg-emerald-500' : key === 'medium' ? 'bg-amber-500' : 'bg-rose-500'} animate-ping`} />
                )}
              </div>

              <p className="text-[10.5px] text-stone-600 dark:text-stone-400 leading-relaxed mt-1">
                {option.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
