/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Grid3X3, 
  Maximize2 
} from 'lucide-react';
import { JIGSAW_LEVELS, JigsawLevel } from '../../data/puzzleSuiteData';
import { chimeService } from '../../services/chimeService';

import { 
  PuzzleDifficulty, 
  getStoredDifficulty, 
  setStoredDifficulty, 
  DIFFICULTY_OPTIONS 
} from '../../utils/difficultyStorage';
import { DifficultySelector } from './DifficultySelector';

interface JigsawPiece {
  id: number; // 0 to N-1
  correctRow: number;
  correctCol: number;
}

export const JigsawPuzzleView: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel: JigsawLevel = JIGSAW_LEVELS[levelIndex] || JIGSAW_LEVELS[0];

  // Difficulty & Grid size management
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>(getStoredDifficulty());
  const diffConfig = DIFFICULTY_OPTIONS[difficulty];

  const [gridSize, setGridSize] = useState<3 | 4 | 5>(diffConfig.jigsawGridSize);
  const totalPieces = gridSize * gridSize;

  const handleDifficultyChange = (newDiff: PuzzleDifficulty) => {
    setDifficulty(newDiff);
    setStoredDifficulty(newDiff);
    const newSize = DIFFICULTY_OPTIONS[newDiff].jigsawGridSize;
    setGridSize(newSize);
    initPuzzle(newSize, currentLevel);
  };

  // Board slots: array of length totalPieces containing piece ID or null
  const [boardSlots, setBoardSlots] = useState<(number | null)[]>([]);
  // Tray / Dock of remaining unplaced pieces
  const [dockPieces, setDockPieces] = useState<number[]>([]);
  
  // Selection state for touch/click interaction
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  
  // Performance & Stats
  const [movesCount, setMovesCount] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());
  const [lastMisplacedSlot, setLastMisplacedSlot] = useState<number | null>(null);

  const timerRef = useRef<any>(null);

  // Initialize or reset puzzle
  const initPuzzle = (size: 3 | 4 | 5, lvl: JigsawLevel) => {
    const total = size * size;
    const pieces: number[] = [];
    for (let i = 0; i < total; i++) {
      pieces.push(i);
    }
    // Shuffle pieces randomly
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);

    setBoardSlots(new Array(total).fill(null));
    setDockPieces(shuffled);
    setSelectedPieceId(null);
    setMovesCount(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setIsTimerRunning(true);
    setLastMisplacedSlot(null);
  };

  useEffect(() => {
    initPuzzle(gridSize, currentLevel);
  }, [levelIndex, gridSize]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && !isCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isCompleted]);

  // Format seconds into mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check if board is complete and correct
  const verifyCompletion = (slots: (number | null)[]) => {
    const allFilled = slots.every(s => s !== null);
    if (!allFilled) return false;

    for (let i = 0; i < slots.length; i++) {
      if (slots[i] !== i) return false;
    }
    return true;
  };

  // Place a piece into a specific board slot
  const handlePlaceIntoSlot = (slotIndex: number) => {
    if (isCompleted) return;
    if (selectedPieceId === null) return;

    setMovesCount(m => m + 1);

    // Is it the correct slot?
    if (selectedPieceId === slotIndex) {
      // Snap into place!
      chimeService.playPuzzleSnapChime();
      const newSlots = [...boardSlots];
      newSlots[slotIndex] = selectedPieceId;
      setBoardSlots(newSlots);

      // Remove piece from dock
      setDockPieces(prev => prev.filter(p => p !== selectedPieceId));
      setSelectedPieceId(null);
      setLastMisplacedSlot(null);

      // Check if finished
      if (verifyCompletion(newSlots)) {
        setIsTimerRunning(false);
        setIsCompleted(true);
        chimeService.playSuccessChime();
      }
    } else {
      // Misplaced
      chimeService.playBubblePopChime();
      setLastMisplacedSlot(slotIndex);
      setTimeout(() => setLastMisplacedSlot(null), 800);
    }
  };

  // Handle Drag & Drop for desktop
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    e.dataTransfer.setData('text/plain', String(pieceId));
    setSelectedPieceId(pieceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData('text/plain');
    const pieceId = parseInt(pieceIdStr, 10);
    if (!isNaN(pieceId)) {
      setSelectedPieceId(pieceId);
      // Execute placement
      setMovesCount(m => m + 1);
      if (pieceId === slotIndex) {
        chimeService.playPuzzleSnapChime();
        const newSlots = [...boardSlots];
        newSlots[slotIndex] = pieceId;
        setBoardSlots(newSlots);
        setDockPieces(prev => prev.filter(p => p !== pieceId));
        setSelectedPieceId(null);
        setLastMisplacedSlot(null);

        if (verifyCompletion(newSlots)) {
          setIsTimerRunning(false);
          setIsCompleted(true);
          chimeService.playSuccessChime();
        }
      } else {
        chimeService.playBubblePopChime();
        setLastMisplacedSlot(slotIndex);
        setTimeout(() => setLastMisplacedSlot(null), 800);
      }
    }
  };

  // Helper to render background slice for a piece
  const getPieceStyle = (pieceIndex: number) => {
    const row = Math.floor(pieceIndex / gridSize);
    const col = pieceIndex % gridSize;
    const posX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
    const posY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

    return {
      backgroundImage: `url(${currentLevel.imageSrc})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundRepeat: 'no-repeat'
    };
  };

  const handleToggleMute = () => {
    const next = chimeService.toggleMute();
    setIsMuted(next);
  };

  const handleNextLevel = () => {
    const next = (levelIndex + 1) % JIGSAW_LEVELS.length;
    setLevelIndex(next);
  };

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      
      {/* Mood & Difficulty Level Selection */}
      <DifficultySelector 
        currentDifficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`jigsaw-level-${currentLevel.id}`}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Top Controls Bar */}
          <div className="bg-white dark:bg-[#1A2520] p-4 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#174F3F]/15 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            🧩
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#174F3F] dark:text-white">
              {currentLevel.title}
            </h3>
            <p className="text-[11px] text-[#515B55] dark:text-stone-300">
              {currentLevel.subtitle}
            </p>
          </div>
        </div>

        {/* Stats & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] dark:bg-stone-800 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-200">
            <Clock className="w-3.5 h-3.5 text-[#B78327]" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] dark:bg-stone-800 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-200">
            <span>الحركات: {movesCount}</span>
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title={showPreview ? 'إخفاء المعاينة' : 'معاينة الصورة الأصلية'}
          >
            {showPreview ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={() => initPuzzle(gridSize, currentLevel)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="إعادة خلط القطع"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid Size Selection */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="font-bold text-[#515B55] dark:text-stone-400">
          مستوى الصعوبة وحجم الشبكة:
        </span>
        <div className="flex items-center gap-2">
          {([3, 4, 5] as const).map(sz => (
            <button
              key={sz}
              onClick={() => setGridSize(sz)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                gridSize === sz
                  ? 'bg-[#174F3F] text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              {sz} × {sz} ({sz === 3 ? 'سهل' : sz === 4 ? 'متوسط' : 'تحدي'})
            </button>
          ))}
        </div>
      </div>

      {/* Preview Box if active */}
      {showPreview && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2520] border-2 border-[#B78327]/40 shadow-md text-center space-y-2 animate-fade-in">
          <span className="text-xs font-black text-[#B78327] block">
            🖼️ المعاينة الكاملة للصورة الأصلية
          </span>
          <div className="max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
            <img 
              src={currentLevel.imageSrc} 
              alt={currentLevel.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Board Area (Target Grid) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1A2520] p-4 sm:p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400 px-1">
            <span>لوحة التجميع ({totalPieces - dockPieces.length} / {totalPieces} قطعة مكتملة)</span>
            {selectedPieceId !== null && (
              <span className="text-amber-600 dark:text-amber-400 animate-pulse">
                انقري على الموضع الصحيح لتثبيت القطعة المحددة 🎯
              </span>
            )}
          </div>

          <div 
            className="w-full max-w-[420px] mx-auto aspect-square bg-stone-100 dark:bg-stone-900 rounded-2xl p-2 border-2 border-stone-300 dark:border-stone-700 shadow-inner grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
            }}
          >
            {boardSlots.map((placedPieceId, slotIndex) => {
              const isFilled = placedPieceId !== null;
              const isMisplaced = lastMisplacedSlot === slotIndex;

              return (
                <div
                  key={slotIndex}
                  onClick={() => handlePlaceIntoSlot(slotIndex)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, slotIndex)}
                  className={`relative rounded-xl overflow-hidden transition-all flex items-center justify-center cursor-pointer select-none ${
                    isFilled
                      ? 'border-2 border-emerald-500 shadow-xs'
                      : isMisplaced
                      ? 'bg-rose-100 dark:bg-rose-950/60 border-2 border-rose-500 animate-shake'
                      : selectedPieceId !== null
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-2 border-dashed border-amber-400 hover:bg-amber-100'
                      : 'bg-stone-200/50 dark:bg-stone-800/60 border border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-400'
                  }`}
                >
                  {isFilled ? (
                    <div 
                      className="w-full h-full animate-fade-in"
                      style={getPieceStyle(placedPieceId)}
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-stone-400 opacity-50">
                      {slotIndex + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pieces Dock (Remaining Pieces to Place) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1A2520] p-4 sm:p-5 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <span className="text-xs font-black text-[#174F3F] dark:text-white">
              قطع الأحجية المتبقية ({dockPieces.length})
            </span>
            <span className="text-[11px] text-[#515B55] dark:text-stone-400">
              انقري لتحديد القطعة أو اسحبيها
            </span>
          </div>

          {dockPieces.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto p-1">
              {dockPieces.map((pieceId) => {
                const isSelected = selectedPieceId === pieceId;

                return (
                  <div
                    key={pieceId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, pieceId)}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPieceId(null);
                      } else {
                        setSelectedPieceId(pieceId);
                        chimeService.playBubblePopChime();
                      }
                    }}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 select-none active:scale-95 shadow-xs ${
                      isSelected
                        ? 'border-amber-500 ring-4 ring-amber-400/30 scale-105 z-10'
                        : 'border-stone-200 dark:border-stone-700 hover:border-[#23785B]'
                    }`}
                    title="انقري للاختيار أو اسحبي للوحة"
                  >
                    <div 
                      className="w-full h-full"
                      style={getPieceStyle(pieceId)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold space-y-1">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <span>تم وضع جميع القطع بنجاح تام! 🌟</span>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  </AnimatePresence>

      {/* Completion Modal / Card */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#E2EFE7] to-[#D5EADF] dark:from-emerald-950/80 dark:to-stone-900 border-2 border-[#23785B] shadow-xl text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#174F3F] dark:text-emerald-200">
                ألف مبارك! اكتملت لوحة «{currentLevel.title}» بنجاح!
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                أتممتِ اللوحة في زمن قدره <strong className="text-[#174F3F] dark:text-white">{formatTime(secondsElapsed)}</strong> وبإجمالي <strong className="text-[#174F3F] dark:text-white">{movesCount}</strong> حركة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-emerald-500/30 max-w-lg mx-auto text-right space-y-1.5">
              <span className="text-[11px] font-bold text-[#B78327] block">
                💡 الخلاصة النفسية للأحجية:
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-100 leading-relaxed">
                {currentLevel.psychologicalTakeaway.message}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => initPuzzle(gridSize, currentLevel)}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer shadow-xs"
              >
                إعادة اللعب ↺
              </button>
              <button
                onClick={handleNextLevel}
                className="px-6 py-2.5 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>الصورة التالية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
