/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Search, 
  Brain, 
  Trophy, 
  Layers, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { JigsawPuzzleView } from './puzzles/JigsawPuzzleView';
import { SpotDifferenceView } from './puzzles/SpotDifferenceView';
import { LogicPuzzlesView } from './puzzles/LogicPuzzlesView';
import { chimeService } from '../services/chimeService';

interface RealPuzzlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'jigsaw' | 'spot' | 'logic';
}

export const RealPuzzlesModal: React.FC<RealPuzzlesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'jigsaw'
}) => {
  const [activeTab, setActiveTab] = useState<'jigsaw' | 'spot' | 'logic'>(initialTab);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const next = chimeService.toggleMute();
    setIsMuted(next);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/75 backdrop-blur-md animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[900px] bg-[#F7F5EF] dark:bg-[#141C18] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5DED7] dark:border-stone-700">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-white/95 dark:bg-[#1A2520]/95 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#174F3F]/15 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center text-xl shadow-xs">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-emerald-300 font-tajawal">
                  واحة الألغاز الحقيقية — تشغيل العقل وتهدئة الروح
                </h2>
                <span className="text-[10px] bg-[#23785B]/15 text-[#23785B] dark:bg-emerald-500/20 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  ٣ أنماط تفاعلية
                </span>
              </div>
              <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
                ألعاب تركيب صور حقيقية، اكتشاف التفاصيل، وتحديات التفكير المنطقي بأسلوب هادئ وممتع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#E2EFE7]/60 dark:bg-[#1A2520]/60 py-2.5 px-5 border-b border-[#D5DED7] dark:border-stone-800 flex items-center gap-2.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('jigsaw')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'jigsaw'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>١. تركيب الصور (Jigsaw Puzzle)</span>
          </button>

          <button
            onClick={() => setActiveTab('spot')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'spot'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>٢. اكتشاف التفاصيل والفروق</span>
          </button>

          <button
            onClick={() => setActiveTab('logic')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'logic'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <Brain className="w-4 h-4 text-sky-400" />
            <span>٣. التفكير المنطقي وأعواد الثقاب</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F5EF] dark:bg-[#141C18]">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'jigsaw' && (
                <motion.div
                  key="tab-jigsaw"
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JigsawPuzzleView />
                </motion.div>
              )}
              {activeTab === 'spot' && (
                <motion.div
                  key="tab-spot"
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SpotDifferenceView />
                </motion.div>
              )}
              {activeTab === 'logic' && (
                <motion.div
                  key="tab-logic"
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <LogicPuzzlesView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};
