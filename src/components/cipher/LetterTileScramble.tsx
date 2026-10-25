/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Delete, Shuffle, Sparkles, Check } from 'lucide-react';
import { CipherLevel } from '../../data/nesmatCipherData';

interface LetterTileScrambleProps {
  level: CipherLevel;
  onSolve: (answer: string) => void;
  isSolved: boolean;
  onSound?: (type: 'click' | 'snap' | 'success') => void;
}

export const LetterTileScramble: React.FC<LetterTileScrambleProps> = ({
  level,
  onSolve,
  isSolved,
  onSound
}) => {
  const correctAnswer = String(level.puzzleData.correctAnswer);

  // Normalize target word: e.g. "المرونة والتقبل" -> "المرونة" or full string
  const cleanAnswer = correctAnswer.replace(/[\s\-_]/g, '');

  // Extract letter pool: from correctAnswer or prompt
  const getInitialLetters = () => {
    // If it's "المرونة والتقبل", take key word "المرونة" or full letters
    const letters = (cleanAnswer.length > 12 ? 'المرونة' : cleanAnswer).split('');
    return letters.sort(() => 0.5 - Math.random());
  };

  const [availableTiles, setAvailableTiles] = useState<{ id: number; letter: string; used: boolean }[]>(() => {
    const letters = getInitialLetters();
    return letters.map((l, i) => ({ id: i, letter: l, used: false }));
  });

  const [slottedTiles, setSlottedTiles] = useState<{ id: number; letter: string }[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const letters = getInitialLetters();
    setAvailableTiles(letters.map((l, i) => ({ id: i, letter: l, used: false })));
    setSlottedTiles([]);
    setFeedback(null);
  }, [level.id]);

  const handleTileClick = (tileId: number) => {
    if (isSolved) return;
    const tile = availableTiles.find(t => t.id === tileId);
    if (!tile || tile.used) return;

    onSound?.('click');
    setAvailableTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setSlottedTiles(prev => [...prev, { id: tile.id, letter: tile.letter }]);
    setFeedback(null);
  };

  const handleRemoveSlotted = (slottedIndex: number) => {
    if (isSolved) return;
    onSound?.('click');
    const removed = slottedTiles[slottedIndex];
    setSlottedTiles(prev => prev.filter((_, idx) => idx !== slottedIndex));
    setAvailableTiles(prev => prev.map(t => t.id === removed.id ? { ...t, used: false } : t));
    setFeedback(null);
  };

  const handleBackspace = () => {
    if (isSolved || slottedTiles.length === 0) return;
    handleRemoveSlotted(slottedTiles.length - 1);
  };

  const handleShuffle = () => {
    if (isSolved) return;
    onSound?.('click');
    const unused = availableTiles.filter(t => !t.used);
    const shuffled = [...unused].sort(() => 0.5 - Math.random());
    setAvailableTiles(prev => prev.map(t => {
      if (t.used) return t;
      return shuffled.shift() || t;
    }));
  };

  const handleVerify = () => {
    const assembled = slottedTiles.map(t => t.letter).join('');
    const target = cleanAnswer.length > 12 ? 'المرونة' : cleanAnswer;

    if (assembled === target || cleanAnswer.includes(assembled) || assembled.includes('مرونة')) {
      onSound?.('success');
      setFeedback('أحسنتِ! الكلمة المكتشفة صحيحة تماماً 🌟');
      onSolve(correctAnswer);
    } else {
      onSound?.('click');
      setFeedback('حاولي مرة أخرى.. تأملي حروف كلمة المرونة والتقبل 🍃');
    }
  };

  return (
    <div className="space-y-5 select-none font-cairo">
      {/* Solved Assembled Slot Box */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border-2 border-dashed border-[#23785B]/40 text-center space-y-3">
        <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block">
          الحروف المركبة (انقري على حرف لإعادته):
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[52px]">
          {slottedTiles.length === 0 ? (
            <span className="text-xs text-stone-400 italic">
              انقري على الحجارة أدناه لتركيب الكلمة...
            </span>
          ) : (
            slottedTiles.map((tile, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRemoveSlotted(idx)}
                className="w-10 h-10 rounded-xl bg-[#174F3F] text-white text-base font-black shadow-sm flex items-center justify-center hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {tile.letter}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available Letter Stones */}
      <div className="p-4 bg-stone-100 dark:bg-stone-800/80 rounded-3xl border border-[#D5DED7] dark:border-stone-700 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
          <span>حجارة الحروف المتاحة:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              disabled={isSolved}
              className="p-1.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="خلط الحجارة"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>خلط</span>
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              disabled={isSolved || slottedTiles.length === 0}
              className="p-1.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="حذف آخر حرف"
            >
              <Delete className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {availableTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={tile.used || isSolved}
              onClick={() => handleTileClick(tile.id)}
              className={`w-11 h-11 rounded-2xl text-base font-black transition-all cursor-pointer flex items-center justify-center ${
                tile.used
                  ? 'opacity-20 scale-95 bg-stone-300 dark:bg-stone-700 cursor-not-allowed'
                  : 'bg-white dark:bg-stone-700 text-[#174F3F] dark:text-emerald-300 border-2 border-stone-300 dark:border-stone-600 shadow-sm hover:border-[#23785B] hover:scale-105'
              }`}
            >
              {tile.letter}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
          feedback.includes('أحسنت')
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
          disabled={slottedTiles.length === 0}
          className="w-full py-3 rounded-2xl bg-[#174F3F] hover:bg-[#11382C] text-white text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>تأكيد الكلمة المركبة ✨</span>
        </button>
      )}
    </div>
  );
};
