/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GameInstructionsModal.tsx
 * Reusable instructions modal explaining game rules, controls, hints, and objectives.
 */

import React from 'react';
import { X, Sparkles, HelpCircle, Target, Award, Play } from 'lucide-react';
import { GameExplanation } from '../data/appExplanations';

interface GameInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: GameExplanation;
}

export const GameInstructionsModal: React.FC<GameInstructionsModalProps> = ({
  isOpen,
  onClose,
  explanation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
      <div className="bg-[#18261E] border border-emerald-500/30 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-right text-white relative space-y-4">
        
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between bg-[#121D17]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              🎮
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              طريقة اللعب والإرشادات: {explanation.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-emerald-100/90 leading-relaxed max-h-[70vh] overflow-y-auto">
          
          <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-emerald-300 block">🎯 فكرة اللعبة وهدفها:</span>
            <p>{explanation.idea}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-teal-300 block">🕹️ طريقة اللعب والتحكم:</span>
            <p>{explanation.controls}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-amber-300 block">🏆 شروط الفوز وإكمال المرحلة:</span>
            <p>{explanation.winningCondition}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-purple-300 block">💡 التلميحات والدعم:</span>
            <p>{explanation.hintsGuide}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-rose-300 block">🚪 الخروج والتقدم:</span>
            <p>{explanation.howToExit}</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121D17] border-t border-emerald-500/20 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>فهمت، ابدأ اللعب 🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
};
