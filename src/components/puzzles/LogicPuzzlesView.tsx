/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  Lightbulb, 
  Sparkles, 
  ArrowLeft, 
  Brain, 
  HelpCircle, 
  Zap, 
  Check 
} from 'lucide-react';
import { LOGIC_PUZZLES, LogicPuzzle, MatchstickPuzzle, PathTilePuzzle, MatrixPatternPuzzle } from '../../data/puzzleSuiteData';
import { chimeService } from '../../services/chimeService';
import { 
  PuzzleDifficulty, 
  getStoredDifficulty, 
  setStoredDifficulty, 
  DIFFICULTY_OPTIONS 
} from '../../utils/difficultyStorage';
import { DifficultySelector } from './DifficultySelector';

export const LogicPuzzlesView: React.FC = () => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle: LogicPuzzle = LOGIC_PUZZLES[puzzleIndex] || LOGIC_PUZZLES[0];

  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>(getStoredDifficulty());
  const diffConfig = DIFFICULTY_OPTIONS[difficulty];

  const handleDifficultyChange = (newDiff: PuzzleDifficulty) => {
    setDifficulty(newDiff);
    setStoredDifficulty(newDiff);
    handleSelectPuzzle(puzzleIndex);
  };

  // ==========================================
  // Mode 1: Matchstick State
  // ==========================================
  const matchPuzzle = currentPuzzle.type === 'matchstick' ? (currentPuzzle as MatchstickPuzzle) : null;
  const [activeStickIds, setActiveStickIds] = useState<number[]>(() => {
    return matchPuzzle ? matchPuzzle.sticks.filter(s => s.isActive).map(s => s.id) : [];
  });
  const [pickedStickId, setPickedStickId] = useState<number | null>(null);
  const [matchstickFeedback, setMatchstickFeedback] = useState<string | null>(null);

  // ==========================================
  // Mode 2: Light Path Maze State (3x3 Rotations)
  // ==========================================
  const pathPuzzle = currentPuzzle.type === 'light_path' ? (currentPuzzle as PathTilePuzzle) : null;
  const [tileRotations, setTileRotations] = useState<number[]>(() => {
    return pathPuzzle ? [...pathPuzzle.initialRotations] : [0, 0, 0, 0, 0, 0, 0, 0, 0];
  });

  // ==========================================
  // Mode 3: Matrix Pattern State
  // ==========================================
  const matrixPuzzle = currentPuzzle.type === 'pattern_matrix' ? (currentPuzzle as MatrixPatternPuzzle) : null;
  const [selectedMatrixOptionId, setSelectedMatrixOptionId] = useState<number | null>(null);
  const [matrixFeedback, setMatrixFeedback] = useState<string | null>(null);

  // General Progression State
  const [hintStep, setHintStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset logic when switching puzzle
  const handleSelectPuzzle = (idx: number) => {
    setPuzzleIndex(idx);
    setHintStep(0);
    setIsCompleted(false);
    const pz = LOGIC_PUZZLES[idx];

    if (pz.type === 'matchstick') {
      const mp = pz as MatchstickPuzzle;
      setActiveStickIds(mp.sticks.filter(s => s.isActive).map(s => s.id));
      setPickedStickId(null);
      setMatchstickFeedback(null);
    } else if (pz.type === 'light_path') {
      const lp = pz as PathTilePuzzle;
      setTileRotations([...lp.initialRotations]);
    } else if (pz.type === 'pattern_matrix') {
      setSelectedMatrixOptionId(null);
      setMatrixFeedback(null);
    }
  };

  // Matchstick click handler
  const handleMatchstickClick = (stickId: number, isCurrentlyActive: boolean) => {
    if (isCompleted || !matchPuzzle) return;
    setMatchstickFeedback(null);

    if (pickedStickId === null) {
      // Trying to pick up an active stick
      if (isCurrentlyActive) {
        setPickedStickId(stickId);
        chimeService.playBubblePopChime();
      }
    } else {
      // Trying to place picked stick into a slot
      if (pickedStickId === stickId) {
        // Deselect
        setPickedStickId(null);
      } else if (!isCurrentlyActive) {
        // Place here!
        chimeService.playPuzzleSnapChime();
        const updated = activeStickIds.filter(id => id !== pickedStickId).concat(stickId);
        setActiveStickIds(updated);
        setPickedStickId(null);

        // Verify equation
        if (matchPuzzle.isSolutionValid(updated)) {
          chimeService.playSuccessChime();
          setIsCompleted(true);
        } else {
          setMatchstickFeedback('تم نقل عود الثقاب؛ لكن المعادلة لا تزال غير صحيحة رياضياً. تأملي من جديد أو اضغطي تلميحاً 💡');
        }
      }
    }
  };

  // Light path tile rotation click
  const handleRotateTile = (tileIndex: number) => {
    if (isCompleted || !pathPuzzle) return;

    chimeService.playBubblePopChime();
    const newRotations = [...tileRotations];
    newRotations[tileIndex] = (newRotations[tileIndex] + 90) % 360;
    setTileRotations(newRotations);

    // Check if configuration matches any valid solution
    const isMatching = pathPuzzle.solutionRotations.some(sol => 
      sol.every((rot, i) => rot === newRotations[i] || (rot + 180) % 360 === newRotations[i])
    );

    if (isMatching) {
      chimeService.playSuccessChime();
      setIsCompleted(true);
    }
  };

  // Matrix option verification
  const handleSelectMatrixOption = (optionId: number) => {
    if (isCompleted || !matrixPuzzle) return;

    setSelectedMatrixOptionId(optionId);
    if (optionId === matrixPuzzle.correctOptionId) {
      chimeService.playSuccessChime();
      setIsCompleted(true);
      setMatrixFeedback(null);
    } else {
      chimeService.playBubblePopChime();
      const opt = matrixPuzzle.options.find(o => o.id === optionId);
      setMatrixFeedback(opt?.explanation || 'خيار غير متسق مع قواعد النمط.');
    }
  };

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      
      {/* Mood & Difficulty Level Selection */}
      <DifficultySelector 
        currentDifficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />

      {/* Puzzles Mode Selector Bar */}
      <div className="bg-white dark:bg-[#1A2520] p-4 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {LOGIC_PUZZLES.map((pz, idx) => (
            <button
              key={pz.id}
              onClick={() => handleSelectPuzzle(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                puzzleIndex === idx
                  ? 'bg-[#174F3F] text-white shadow-xs'
                  : 'bg-[#F7F5EF] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{idx === 0 ? '🔥 أعواد الثقاب' : idx === 1 ? '⚡ مسار النور' : '📐 مصفوفة الأنماط'}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectPuzzle(puzzleIndex)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="إعادة ضبط اللغز"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-6">
        
        {/* Title & Instructions */}
        <div className="border-b border-stone-100 dark:border-stone-800 pb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
            <Brain className="w-3.5 h-3.5" />
            <span>تحدي التفكير المنطقي #{puzzleIndex + 1}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-white">
            {currentPuzzle.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#515B55] dark:text-stone-300 leading-relaxed font-medium">
            {currentPuzzle.instructions}
          </p>
        </div>

        {/* ============================================================== */}
        {/* PUZZLE TYPE 1: MATCHSTICK EQUATION */}
        {/* ============================================================== */}
        {currentPuzzle.type === 'matchstick' && matchPuzzle && (
          <div className="space-y-6">
            <div className="text-center font-bold text-sm text-[#B78327] bg-[#F8EED8] dark:bg-amber-950/60 p-3 rounded-2xl max-w-lg mx-auto">
              {matchPuzzle.prompt}
            </div>

            {/* Matchstick Interactive Display Box */}
            <div className="p-6 bg-stone-900 rounded-3xl border-2 border-stone-700 max-w-xl mx-auto shadow-inner text-center select-none space-y-4">
              <div className="text-[11px] font-bold text-stone-400">
                {pickedStickId !== null 
                  ? 'تم حمل عود ثقاب باليد 🤏 — انقري على الفراغ الذي تريدين وضعه فيه' 
                  : 'انقري على عود ثقاب لرفعه'}
              </div>

              {/* Matchstick SVG Equation Canvas */}
              <svg viewBox="0 0 600 220" className="w-full max-h-[220px]">
                {/* Digit 1 (Initial 6, can become 0 or 8): (x: 40) */}
                {/* top */}
                <line 
                  x1="70" y1="30" x2="130" y2="30" 
                  onClick={() => handleMatchstickClick(1, activeStickIds.includes(1))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(1) ? (pickedStickId === 1 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />
                {/* top-left */}
                <line 
                  x1="60" y1="40" x2="60" y2="100" 
                  onClick={() => handleMatchstickClick(2, activeStickIds.includes(2))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(2) ? (pickedStickId === 2 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />
                {/* top-right (slot for 0 or 8) */}
                <line 
                  x1="140" y1="40" x2="140" y2="100" 
                  onClick={() => handleMatchstickClick(3, activeStickIds.includes(3))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(3) ? (pickedStickId === 3 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />
                {/* middle (the key stick in 6!) */}
                <line 
                  x1="70" y1="110" x2="130" y2="110" 
                  onClick={() => handleMatchstickClick(4, activeStickIds.includes(4))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(4) ? (pickedStickId === 4 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />
                {/* bottom-left */}
                <line 
                  x1="60" y1="120" x2="60" y2="180" 
                  onClick={() => handleMatchstickClick(5, activeStickIds.includes(5))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(5) ? (pickedStickId === 5 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />
                {/* bottom-right */}
                <line 
                  x1="140" y1="120" x2="140" y2="180" 
                  onClick={() => handleMatchstickClick(6, activeStickIds.includes(6))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(6) ? (pickedStickId === 6 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />
                {/* bottom */}
                <line 
                  x1="70" y1="190" x2="130" y2="190" 
                  onClick={() => handleMatchstickClick(7, activeStickIds.includes(7))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(7) ? (pickedStickId === 7 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6] hover:stroke-amber-300') : 'stroke-stone-700 stroke-[4] stroke-dashed hover:stroke-stone-500'}`} 
                />

                {/* Operator (+) at x: 200 */}
                {/* horizontal */}
                <line 
                  x1="190" y1="110" x2="230" y2="110" 
                  onClick={() => handleMatchstickClick(8, activeStickIds.includes(8))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(8) ? 'stroke-amber-500 stroke-[6]' : 'stroke-stone-700 stroke-[4] stroke-dashed'}`} 
                />
                {/* vertical */}
                <line 
                  x1="210" y1="90" x2="210" y2="130" 
                  onClick={() => handleMatchstickClick(9, activeStickIds.includes(9))}
                  className={`cursor-pointer transition-all ${activeStickIds.includes(9) ? (pickedStickId === 9 ? 'stroke-amber-400 stroke-[8]' : 'stroke-amber-500 stroke-[6]') : 'stroke-stone-700 stroke-[4] stroke-dashed'}`} 
                />

                {/* Digit 2 (4): (x: 270) */}
                <line x1="280" y1="40" x2="280" y2="100" stroke="#F59E0B" strokeWidth="6" />
                <line x1="340" y1="40" x2="340" y2="100" stroke="#F59E0B" strokeWidth="6" />
                <line x1="290" y1="110" x2="330" y2="110" stroke="#F59E0B" strokeWidth="6" />
                <line x1="340" y1="120" x2="340" y2="180" stroke="#F59E0B" strokeWidth="6" />

                {/* Equal sign (=): (x: 390) */}
                <line x1="390" y1="95" x2="430" y2="95" stroke="#F59E0B" strokeWidth="6" />
                <line x1="390" y1="125" x2="430" y2="125" stroke="#F59E0B" strokeWidth="6" />

                {/* Digit 3 (4): (x: 470) */}
                <line x1="480" y1="40" x2="480" y2="100" stroke="#F59E0B" strokeWidth="6" />
                <line x1="540" y1="40" x2="540" y2="100" stroke="#F59E0B" strokeWidth="6" />
                <line x1="490" y1="110" x2="530" y2="110" stroke="#F59E0B" strokeWidth="6" />
                <line x1="540" y1="120" x2="540" y2="180" stroke="#F59E0B" strokeWidth="6" />
              </svg>
            </div>

            {matchstickFeedback && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs text-center font-medium animate-fade-in">
                {matchstickFeedback}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PUZZLE TYPE 2: LIGHT PATH ROTATION MAZE */}
        {/* ============================================================== */}
        {currentPuzzle.type === 'light_path' && pathPuzzle && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-300">
              <span className="flex items-center gap-1">
                <span>🌟 منبع النور:</span>
                <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded-lg">أعلى اليمين</span>
              </span>
              <span className="flex items-center gap-1">
                <span>💎 بلورة السكينة:</span>
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg">أسفل اليسار</span>
              </span>
            </div>

            {/* 3x3 Tile Grid */}
            <div className="max-w-[360px] mx-auto aspect-square bg-stone-900 rounded-3xl p-3 border-2 border-stone-700 shadow-inner grid grid-cols-3 gap-2">
              {tileRotations.map((rot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRotateTile(idx)}
                  className="aspect-square bg-stone-800 hover:bg-stone-700 rounded-2xl p-2 relative flex items-center justify-center cursor-pointer transition-transform duration-300 border border-stone-600 shadow-xs active:scale-95"
                  style={{ transform: `rotate(${rot}deg)` }}
                >
                  {/* Pipe / Light Path SVG Inside Tile */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Corner / Elbow pipe or Straight line based on index */}
                    {idx % 2 === 0 ? (
                      <path 
                        d="M50,0 L50,50 L100,50" 
                        fill="none" 
                        stroke={isCompleted ? '#10B981' : '#F59E0B'} 
                        strokeWidth="14" 
                        strokeLinecap="round" 
                      />
                    ) : (
                      <line 
                        x1="0" y1="50" x2="100" y2="50" 
                        stroke={isCompleted ? '#10B981' : '#38BDF8'} 
                        strokeWidth="14" 
                        strokeLinecap="round" 
                      />
                    )}
                    <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
                  </svg>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-stone-500 dark:text-stone-400">
              انقري على أي مربع لتدوير مساره بمقدار 90 درجة حتى تتصل القنوات بالكامل ⚡
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* PUZZLE TYPE 3: PATTERN MATRIX PROGRESSION */}
        {/* ============================================================== */}
        {currentPuzzle.type === 'pattern_matrix' && matrixPuzzle && (
          <div className="space-y-6">
            <div className="text-center font-bold text-sm text-[#B78327]">
              {matrixPuzzle.prompt}
            </div>

            {/* 3x3 Matrix Grid (8 items + 1 question mark) */}
            <div className="max-w-[340px] mx-auto aspect-square bg-stone-900 rounded-3xl p-3 border-2 border-stone-700 shadow-inner grid grid-cols-3 gap-2 text-center">
              {matrixPuzzle.gridItems.map((item) => (
                <div key={item.id} className="aspect-square bg-stone-800 rounded-2xl flex flex-col items-center justify-center p-2 border border-stone-700">
                  <div 
                    className="w-10 h-10 flex items-center justify-center transition-transform"
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                  >
                    {item.shape === 'circle' && (
                      <div className="w-8 h-8 rounded-full border-3 flex items-center justify-center gap-0.5" style={{ borderColor: item.color }}>
                        {Array.from({ length: item.dotsCount }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        ))}
                      </div>
                    )}
                    {item.shape === 'square' && (
                      <div className="w-8 h-8 rounded-lg border-3 flex items-center justify-center gap-0.5" style={{ borderColor: item.color }}>
                        {Array.from({ length: item.dotsCount }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        ))}
                      </div>
                    )}
                    {item.shape === 'diamond' && (
                      <div className="w-7 h-7 rotate-45 border-3 flex items-center justify-center gap-0.5" style={{ borderColor: item.color }}>
                        {Array.from({ length: item.dotsCount }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 9th Cell: Missing (?) */}
              <div className="aspect-square bg-amber-500/10 border-2 border-dashed border-amber-400 rounded-2xl flex items-center justify-center text-2xl font-black text-amber-400 animate-pulse">
                ؟
              </div>
            </div>

            {/* Candidate Options Selection */}
            <div className="space-y-3">
              <span className="text-xs font-black text-[#174F3F] dark:text-emerald-300 block">
                اختاري الشكل المكمل من الخيارات التالية:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matrixPuzzle.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectMatrixOption(opt.id)}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedMatrixOptionId === opt.id
                        ? opt.id === matrixPuzzle.correctOptionId
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                          : 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800'
                        : 'bg-[#F7F5EF] dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 flex items-center justify-center"
                      style={{ transform: `rotate(${opt.rotation}deg)` }}
                    >
                      {opt.shape === 'diamond' ? (
                        <div className="w-7 h-7 rotate-45 border-3 flex items-center justify-center gap-0.5" style={{ borderColor: opt.color }}>
                          {Array.from({ length: opt.dotsCount }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }} />
                          ))}
                        </div>
                      ) : opt.shape === 'circle' ? (
                        <div className="w-8 h-8 rounded-full border-3 flex items-center justify-center gap-0.5" style={{ borderColor: opt.color }}>
                          {Array.from({ length: opt.dotsCount }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }} />
                          ))}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg border-3 flex items-center justify-center gap-0.5" style={{ borderColor: opt.color }}>
                          {Array.from({ length: opt.dotsCount }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {matrixFeedback && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs text-center font-medium animate-fade-in">
                {matrixFeedback}
              </div>
            )}
          </div>
        )}

        {/* Progressive Hints Section */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setHintStep(prev => (prev < currentPuzzle.hints.length ? prev + 1 : prev))}
              disabled={hintStep >= currentPuzzle.hints.length}
              className="text-xs font-bold text-[#B78327] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>طلب تلميح متدرج ({hintStep}/{currentPuzzle.hints.length})</span>
            </button>
          </div>

          {hintStep > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-fade-in">
              <span className="font-bold text-[11px] block">💡 تلميح رقم {hintStep}:</span>
              <p className="leading-relaxed">
                {currentPuzzle.hints[hintStep - 1]}
              </p>
            </div>
          )}
        </div>

        {/* Completion Result Card */}
        {isCompleted && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#E2EFE7] to-[#D5EADF] dark:from-emerald-950/80 dark:to-stone-900 border-2 border-[#23785B] shadow-xl text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🧠
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#174F3F] dark:text-emerald-200">
                أحسنتِ صنعاً! تم حل اللغز المنطقي ببراعة!
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                المرونة الذهنية تفكك أصعب العقد وتعيد توجيه الطاقة نحو الحلول المتزنة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-emerald-500/30 max-w-lg mx-auto text-right space-y-1.5">
              <span className="text-[11px] font-bold text-[#B78327] block">
                💡 الأثر النفسي للتحدي:
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-100 leading-relaxed">
                {currentPuzzle.psychologicalTakeaway.message}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => handleSelectPuzzle(puzzleIndex)}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer shadow-xs"
              >
                إعادة المحاولة ↺
              </button>
              <button
                onClick={() => handleSelectPuzzle((puzzleIndex + 1) % LOGIC_PUZZLES.length)}
                className="px-6 py-2.5 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>اللغز المنطقي التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
