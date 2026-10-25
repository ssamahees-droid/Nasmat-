/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Footprints, Sparkles, Navigation } from 'lucide-react';
import { CipherLevel } from '../../data/nesmatCipherData';

interface LabyrinthPathBoardProps {
  level: CipherLevel;
  onSolve: (answer: string) => void;
  isSolved: boolean;
  onSound?: (type: 'click' | 'snap' | 'success') => void;
}

export const LabyrinthPathBoard: React.FC<LabyrinthPathBoardProps> = ({
  level,
  onSolve,
  isSolved,
  onSound
}) => {
  const correctAnswer = String(level.puzzleData.correctAnswer);
  const options = level.puzzleData.options || [correctAnswer];

  const [selectedPath, setSelectedPath] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectPath = (path: string) => {
    if (isSolved) return;
    onSound?.('click');
    setSelectedPath(path);
    setFeedback(null);
  };

  const handleWalkPath = () => {
    if (!selectedPath) {
      setFeedback('يرجى اختيار أحد الممرات للمضي فيه أولاً 🌿');
      return;
    }

    const normSel = selectedPath.trim().toLowerCase();
    const normCorrect = correctAnswer.trim().toLowerCase();

    if (normSel === normCorrect || normSel.includes(normCorrect) || normCorrect.includes(normSel)) {
      onSound?.('success');
      setFeedback('ممر مبارك! قادك عبق الهدوء إلى المخرج بسلام وسكينة 🌸');
      onSolve(correctAnswer);
    } else {
      onSound?.('click');
      setFeedback('هذا الممر يحمل شوكاً أو منبهاً حاداً يعيق هدوء النفس. جرب ممر اللافندر والسكينة 🍃');
    }
  };

  return (
    <div className="space-y-5 select-none font-cairo">
      {/* Visual Maze Branching Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#14231C] to-stone-900 border-2 border-emerald-600/30 text-emerald-200 text-center shadow-lg space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          <h4 className="font-black text-sm text-emerald-300">
            🌿 مفترق دروب المتاهة العطرية
          </h4>
        </div>
        <p className="text-[11px] text-stone-300">
          تأمل عبير الممرات الثلاثة واختر المسار الذي يحفظ سكينتك العصبية:
        </p>

        {/* Visual Pathways Diagram */}
        <div className="relative py-2 px-4 max-w-md mx-auto">
          <svg viewBox="0 0 320 110" className="w-full h-auto">
            {/* Start point */}
            <circle cx="160" cy="15" r="9" className="fill-emerald-400 stroke-2 stroke-white" />
            <text x="160" y="19" textAnchor="middle" className="text-[9px] fill-stone-900 font-bold">بداية</text>

            {/* Path 1: Left */}
            <path
              d="M 160 25 Q 110 50 60 90"
              fill="none"
              stroke={selectedPath === options[0] ? '#10B981' : '#475569'}
              strokeWidth={selectedPath === options[0] ? '4' : '2'}
              strokeDasharray={selectedPath === options[0] ? 'none' : '4 3'}
              className="transition-all"
            />
            {/* Path 2: Center */}
            <path
              d="M 160 25 L 160 90"
              fill="none"
              stroke={selectedPath === options[1] ? '#10B981' : '#475569'}
              strokeWidth={selectedPath === options[1] ? '4' : '2'}
              strokeDasharray={selectedPath === options[1] ? 'none' : '4 3'}
              className="transition-all"
            />
            {/* Path 3: Right */}
            <path
              d="M 160 25 Q 210 50 260 90"
              fill="none"
              stroke={selectedPath === options[2] ? '#10B981' : '#475569'}
              strokeWidth={selectedPath === options[2] ? '4' : '2'}
              strokeDasharray={selectedPath === options[2] ? 'none' : '4 3'}
              className="transition-all"
            />

            {/* End Nodes */}
            <circle cx="60" cy="95" r="7" className="fill-stone-700" />
            <circle cx="160" cy="95" r="7" className="fill-stone-700" />
            <circle cx="260" cy="95" r="7" className="fill-stone-700" />
          </svg>
        </div>
      </div>

      {/* Pathways Selection Buttons */}
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt, idx) => {
          const isSelected = selectedPath === opt;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPath(opt)}
              disabled={isSolved}
              className={`p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {idx === 0 ? '🌿' : idx === 1 ? '💜' : '🌵'}
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

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
          feedback.includes('مبارك')
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
        }`}>
          {feedback}
        </div>
      )}

      {!isSolved && (
        <button
          type="button"
          onClick={handleWalkPath}
          disabled={!selectedPath}
          className="w-full py-3 rounded-2xl bg-[#174F3F] hover:bg-[#11382C] text-white text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Footprints className="w-4 h-4 text-emerald-300" />
          <span>السير في هذا الممر الآمن 🚶‍♂️</span>
        </button>
      )}
    </div>
  );
};
