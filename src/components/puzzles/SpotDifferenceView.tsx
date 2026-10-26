/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Lightbulb, 
  Eye, 
  Compass, 
  Search 
} from 'lucide-react';
import { SPOT_CHALLENGES, SpotChallenge, SpotTarget } from '../../data/puzzleSuiteData';
import { chimeService } from '../../services/chimeService';
import { 
  PuzzleDifficulty, 
  getStoredDifficulty, 
  setStoredDifficulty, 
  DIFFICULTY_OPTIONS 
} from '../../utils/difficultyStorage';
import { DifficultySelector } from './DifficultySelector';

export const SpotDifferenceView: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const challenge: SpotChallenge = SPOT_CHALLENGES[challengeIndex] || SPOT_CHALLENGES[0];

  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>(getStoredDifficulty());
  const diffConfig = DIFFICULTY_OPTIONS[difficulty];

  const [foundTargetIds, setFoundTargetIds] = useState<string[]>([]);
  const [lastClickedPoint, setLastClickedPoint] = useState<{ x: number; y: number; isSuccess: boolean } | null>(null);
  const [activeHintTargetId, setActiveHintTargetId] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleDifficultyChange = (newDiff: PuzzleDifficulty) => {
    setDifficulty(newDiff);
    setStoredDifficulty(newDiff);
    resetChallenge(challengeIndex);
  };

  const resetChallenge = (idx: number) => {
    setFoundTargetIds([]);
    setLastClickedPoint(null);
    setActiveHintTargetId(null);
    setHintsUsed(0);
    setIsCompleted(false);
  };

  const handleNextChallenge = () => {
    const next = (challengeIndex + 1) % SPOT_CHALLENGES.length;
    setChallengeIndex(next);
    resetChallenge(next);
  };

  // Handle click on the visual scene
  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    // Check hit against unfound targets with difficulty multiplier
    let hitTarget: SpotTarget | null = null;

    for (const tgt of challenge.targets) {
      if (foundTargetIds.includes(tgt.id)) continue;

      const dx = clickXPercent - tgt.xPercent;
      const dy = clickYPercent - tgt.yPercent;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const effectiveRadius = tgt.radiusPercent * diffConfig.spotRadiusMultiplier;

      if (distance <= effectiveRadius) {
        hitTarget = tgt;
        break;
      }
    }

    if (hitTarget) {
      // Hit!
      chimeService.playPuzzleSnapChime();
      const updated = [...foundTargetIds, hitTarget.id];
      setFoundTargetIds(updated);
      setLastClickedPoint({ x: clickXPercent, y: clickYPercent, isSuccess: true });
      setActiveHintTargetId(null);

      if (updated.length === challenge.targets.length) {
        setIsCompleted(true);
        chimeService.playSuccessChime();
      }
    } else {
      // Miss
      chimeService.playBubblePopChime();
      setLastClickedPoint({ x: clickXPercent, y: clickYPercent, isSuccess: false });
    }

    setTimeout(() => {
      setLastClickedPoint(null);
    }, 1000);
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
          key={`spot-challenge-${challenge.id}`}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Header Info Bar */}
          <div className="bg-white dark:bg-[#1A2520] p-4 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B78327]/15 text-[#B78327] flex items-center justify-center font-bold text-lg">
            🔍
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#174F3F] dark:text-white">
              {challenge.title}
            </h3>
            <p className="text-[11px] text-[#515B55] dark:text-stone-300">
              {challenge.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            المكتشف: {foundTargetIds.length} من {challenge.targets.length}
          </span>
          <button
            onClick={() => resetChallenge(challengeIndex)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="إعادة المحاولة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Visual Canvas */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1A2520] p-4 sm:p-5 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-[#515B55] dark:text-stone-400 px-1 font-bold">
            <span>{challenge.instructions}</span>
            <span className="text-[11px] text-[#B78327]">انقري مباشرة على موقع العنصر في المشهد</span>
          </div>

          <div 
            onClick={handleSceneClick}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 select-none cursor-crosshair shadow-inner bg-gradient-to-b from-[#132A20] via-[#10221A] to-[#0A1611]"
          >
            {/* SVG Visual Scene for Garden Secrets */}
            {challenge.sceneTheme === 'garden_secrets' && (
              <svg viewBox="0 0 800 600" className="w-full h-full">
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#254336" />
                    <stop offset="60%" stopColor="#173127" />
                    <stop offset="100%" stopColor="#0B1A14" />
                  </linearGradient>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="dewDropGlow" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#67E8F9" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </radialGradient>
                </defs>

                {/* Background Sky & Distant Mountain Ridges */}
                <rect width="800" height="600" fill="url(#skyGrad)" />
                <circle cx="680" cy="140" r="160" fill="url(#sunGlow)" />
                <path d="M-50,380 Q160,280 400,340 T850,320 L850,600 L-50,600 Z" fill="#1B382B" opacity="0.6" />
                <path d="M-50,420 Q200,360 480,410 T850,390 L850,600 L-50,600 Z" fill="#204334" opacity="0.8" />

                {/* Ancient Centered Banyan Tree with Twisted Roots */}
                {/* Trunk */}
                <path d="M380,600 C370,450 360,350 420,250 C460,350 450,450 440,600 Z" fill="#3D291D" />
                <path d="M360,600 C390,520 430,520 460,600 Z" fill="#2B1D14" />
                {/* Large Foliage Canopy */}
                <ellipse cx="410" cy="190" rx="190" ry="110" fill="#1D4C38" />
                <ellipse cx="340" cy="160" rx="140" ry="85" fill="#245F46" />
                <ellipse cx="480" cy="170" rx="130" ry="90" fill="#245F46" />
                <ellipse cx="410" cy="130" rx="110" ry="70" fill="#2E7557" />

                {/* Hidden Detail 4: Hanging Lantern at (x=30%, y=25% -> 240, 150) */}
                <g transform="translate(240, 140)">
                  <line x1="0" y1="-25" x2="0" y2="0" stroke="#78350F" strokeWidth="2.5" />
                  <rect x="-12" y="0" width="24" height="34" rx="5" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                  <circle cx="0" cy="17" r="8" fill="#FDE047" opacity="0.9" filter="drop-shadow(0 0 6px #FBBF24)" />
                  <path d="M-8,34 L8,34 L0,42 Z" fill="#78350F" />
                </g>

                {/* Foreground Grass, Lotus Pond & Leaves */}
                <path d="M0,480 Q250,450 500,470 T800,460 L800,600 L0,600 Z" fill="#17382A" />

                {/* Lotus Pond on Left (x=120 to 280, y=470 to 570) */}
                <ellipse cx="190" cy="510" rx="130" ry="45" fill="#0C2B20" stroke="#1F563E" strokeWidth="3" />
                <ellipse cx="170" cy="505" rx="50" ry="18" fill="#194D37" />
                {/* Lotus Blossom */}
                <circle cx="210" cy="500" r="14" fill="#F472B6" />
                <circle cx="210" cy="500" r="8" fill="#FBCFE8" />

                {/* Hidden Detail 1: Golden Butterfly near Lotus at (x=24%, y=78% -> 192, 468) */}
                <g transform="translate(192, 468)">
                  {/* Butterfly Wings */}
                  <path d="M0,0 C-12,-18 -22,-8 -16,0 C-20,6 -10,12 0,2 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                  <path d="M0,0 C12,-18 22,-8 16,0 C20,6 10,12 0,2 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                  <line x1="0" y1="-6" x2="0" y2="4" stroke="#78350F" strokeWidth="1.5" />
                  <circle cx="0" cy="-2" r="3" fill="#F59E0B" />
                </g>

                {/* Large Leaf on Right with Dewdrop at (x=78%, y=32% -> 624, 192) */}
                <path d="M540,240 C570,180 670,160 690,210 C670,250 590,260 540,240 Z" fill="#1E5C42" stroke="#164531" strokeWidth="2" />
                {/* Hidden Detail 2: Dewdrop */}
                <g transform="translate(624, 192)">
                  <circle cx="0" cy="0" r="11" fill="url(#dewDropGlow)" filter="drop-shadow(0 0 5px #38BDF8)" />
                  <circle cx="-3" cy="-3" r="3.5" fill="#FFFFFF" opacity="0.9" />
                </g>

                {/* Hidden Detail 3: Antique Key among Roots at (x=52%, y=84% -> 416, 504) */}
                <g transform="translate(416, 504) rotate(25)">
                  <circle cx="-14" cy="0" r="9" fill="none" stroke="#D97706" strokeWidth="3.5" />
                  <line x1="-5" y1="0" x2="22" y2="0" stroke="#D97706" strokeWidth="3.5" />
                  <line x1="12" y1="0" x2="12" y2="8" stroke="#D97706" strokeWidth="3.5" />
                  <line x1="19" y1="0" x2="19" y2="7" stroke="#D97706" strokeWidth="3.5" />
                </g>
              </svg>
            )}

            {/* SVG Visual Scene for Mind Mirror (Spot Differences) */}
            {challenge.sceneTheme === 'mind_mirror' && (
              <svg viewBox="0 0 800 600" className="w-full h-full">
                {/* Middle Divider */}
                <rect x="0" y="0" width="398" height="600" fill="#141E19" />
                <rect x="402" y="0" width="398" height="600" fill="#17261F" />
                <line x1="400" y1="0" x2="400" y2="600" stroke="#374151" strokeWidth="3" strokeDasharray="6 6" />

                {/* LEFT: Turbulent state / RIGHT: Calm state */}
                {/* 1. Difference Sun: Left has storm cloud at (82%, 18% on right / mirrored at left) */}
                {/* Left side cloud at (144, 108) */}
                <ellipse cx="140" cy="110" rx="45" ry="24" fill="#4B5563" />
                <ellipse cx="170" cy="100" rx="35" ry="20" fill="#374151" />
                {/* Right side SUN at (656, 108) -> 82%, 18% */}
                <circle cx="656" cy="108" r="32" fill="#F59E0B" filter="drop-shadow(0 0 14px #FBBF24)" />
                <circle cx="656" cy="108" r="22" fill="#FEF08A" />

                {/* 2. Difference Bird: Left has no bird. Right has soaring bird at (x=38%, y=22% -> 304 on left, or on right side) */}
                {/* Bird drawn on right side */}
                <g transform="translate(610, 130)">
                  <path d="M-18,-6 Q-6,-18 0,-4 Q6,-18 18,-6 Q8,-2 0,6 Q-8,-2 -18,-6 Z" fill="#F1F5F9" />
                </g>

                {/* Center River: Left is turbulent waves, Right is smooth water mirror */}
                <path d="M0,380 C150,390 250,420 398,400 L398,550 L0,550 Z" fill="#0E2D22" />
                <path d="M402,400 C550,390 650,410 800,395 L800,550 L402,550 Z" fill="#133D2E" />

                {/* Left waves */}
                <path d="M50,440 Q100,420 150,440 T250,440" stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0.6" />
                <path d="M120,480 Q170,460 220,480 T320,480" stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0.6" />

                {/* Right calm water mirror (Difference 2: x=50%, y=68% -> 400, 408) */}
                <line x1="480" y1="440" x2="720" y2="440" stroke="#34D399" strokeWidth="1.5" opacity="0.8" />
                <line x1="520" y1="470" x2="680" y2="470" stroke="#34D399" strokeWidth="1.5" opacity="0.8" />

                {/* 3. Difference Flower: Left has tight closed green bud, Right has blooming pink lotus (x=22%, y=75% -> 176, 450) */}
                {/* Left side: closed bud */}
                <g transform="translate(176, 450)">
                  <ellipse cx="0" cy="0" rx="9" ry="16" fill="#15803D" />
                </g>
                {/* Right side: blooming flower */}
                <g transform="translate(576, 450)">
                  <circle cx="0" cy="0" r="15" fill="#EC4899" />
                  <circle cx="0" cy="0" r="8" fill="#FDF2F8" />
                </g>
              </svg>
            )}

            {/* SVG Visual Scene for Crystal Pond / Twilight Oasis */}
            {challenge.sceneTheme === 'crystal_pond' && (
              <svg viewBox="0 0 800 600" className="w-full h-full">
                <defs>
                  <linearGradient id="twilightSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E1B4B" />
                    <stop offset="45%" stopColor="#312E81" />
                    <stop offset="70%" stopColor="#831843" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>
                  <linearGradient id="twilightWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#431407" />
                    <stop offset="35%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>

                {/* Sky */}
                <rect x="0" y="0" width="800" height="360" fill="url(#twilightSky)" />

                {/* Twilight Stars */}
                <circle cx="120" cy="60" r="1.5" fill="#FEF08A" opacity="0.8" />
                <circle cx="280" cy="40" r="2" fill="#FEF08A" opacity="0.9" />
                <circle cx="450" cy="70" r="1.5" fill="#FEF08A" opacity="0.7" />
                <circle cx="680" cy="50" r="2" fill="#FEF08A" opacity="0.9" />

                {/* Distant Hills on Horizon */}
                <path d="M0,360 Q180,310 380,340 T800,320 L800,400 L0,400 Z" fill="#18181B" opacity="0.85" />

                {/* Water Body */}
                <rect x="0" y="340" width="800" height="260" fill="url(#twilightWater)" />

                {/* Target 2: Lighthouse on the Hill at (x=78%, y=28% -> 624, 168) */}
                <g transform="translate(624, 168)">
                  {/* Hill mound */}
                  <ellipse cx="0" cy="140" rx="90" ry="30" fill="#09090B" />
                  {/* Tower */}
                  <polygon points="-12,120 12,120 7,20 -7,20" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
                  <rect x="-10" y="45" width="20" height="12" fill="#DC2626" />
                  <rect x="-9" y="85" width="18" height="12" fill="#DC2626" />
                  {/* Lantern Room */}
                  <rect x="-10" y="0" width="20" height="20" rx="3" fill="#F59E0B" filter="drop-shadow(0 0 16px #FDE047)" />
                  <polygon points="-14,0 14,0 0,-15" fill="#0F172A" />
                  {/* Light beam */}
                  <polygon points="10,10 180,-30 180,60" fill="#FEF08A" opacity="0.25" />
                </g>

                {/* Crescent Moon in Sky */}
                <g transform="translate(416, 80)">
                  <circle cx="0" cy="0" r="24" fill="#FEF08A" filter="drop-shadow(0 0 10px #FDE047)" />
                  <circle cx="10" cy="-4" r="20" fill="#312E81" />
                </g>

                {/* Target 3: Moon Reflection on Water at (x=52%, y=62% -> 416, 372) */}
                <g transform="translate(416, 372)">
                  <ellipse cx="0" cy="0" rx="28" ry="7" fill="#FEF08A" opacity="0.6" filter="drop-shadow(0 0 8px #FBBF24)" />
                  <ellipse cx="-5" cy="14" rx="20" ry="5" fill="#FEF08A" opacity="0.45" />
                  <ellipse cx="4" cy="26" rx="14" ry="4" fill="#FEF08A" opacity="0.3" />
                </g>

                {/* Foreground Shorelines */}
                <path d="M0,450 C120,440 260,510 320,600 L0,600 Z" fill="#0C1F17" />
                <path d="M580,600 C640,510 720,480 800,470 L800,600 Z" fill="#0C1F17" />

                {/* Target 1: Resting Wooden Boat on Shore at (x=28%, y=72% -> 224, 432) */}
                <g transform="translate(224, 432) rotate(8)">
                  <path d="M-45,0 Q0,26 45,0 C35,-14 -35,-14 -45,0 Z" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
                  <polygon points="-40,-1 40,-1 30,12 -30,12" fill="#92400E" />
                  <line x1="-15" y1="-8" x2="25" y2="18" stroke="#D97706" strokeWidth="3" />
                  <circle cx="-38" cy="-2" r="3" fill="#FEF08A" />
                </g>

                {/* Target 4: Night Jasmine Bush on Right at (x=84%, y=76% -> 672, 456) */}
                <g transform="translate(672, 456)">
                  <ellipse cx="0" cy="0" rx="42" ry="26" fill="#064E3B" stroke="#047857" strokeWidth="2" />
                  {/* Little white fragrant blossoms */}
                  <circle cx="-16" cy="-8" r="4" fill="#FFFFFF" />
                  <circle cx="-5" cy="6" r="3.5" fill="#FFFFFF" />
                  <circle cx="14" cy="-10" r="4" fill="#FFFFFF" />
                  <circle cx="20" cy="8" r="3" fill="#FFFFFF" />
                  <circle cx="0" cy="-14" r="3" fill="#FEF08A" />
                </g>
              </svg>
            )}

            {/* Found Targets Rings Highlight */}
            {challenge.targets.map(tgt => {
              if (!foundTargetIds.includes(tgt.id)) return null;
              return (
                <div
                  key={tgt.id}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-scale-up"
                  style={{
                    left: `${tgt.xPercent}%`,
                    top: `${tgt.yPercent}%`,
                    width: `${tgt.radiusPercent * 2.2}%`,
                    height: `${tgt.radiusPercent * 2.2}%`
                  }}
                >
                  <div className="w-full h-full rounded-full border-4 border-amber-400 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.8)] flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-black drop-shadow-md">✓</span>
                  </div>
                </div>
              );
            })}

            {/* Temporary Click Feedback Ping */}
            {lastClickedPoint && (
              <div 
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
                style={{
                  left: `${lastClickedPoint.x}%`,
                  top: `${lastClickedPoint.y}%`
                }}
              >
                <div className={`w-8 h-8 rounded-full border-2 ${
                  lastClickedPoint.isSuccess ? 'border-emerald-400 bg-emerald-400/30' : 'border-rose-400 bg-rose-400/30'
                }`} />
              </div>
            )}
          </div>
        </div>

        {/* Right Targets Checklist & Hints */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1A2520] p-4 sm:p-5 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-4">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h4 className="text-xs font-black text-[#174F3F] dark:text-white">
              قائمة العناصر المراد اكتشافها:
            </h4>
            <p className="text-[11px] text-[#515B55] dark:text-stone-400 mt-0.5">
              انقري على زر المصباح لطلب تلميح موقع العنصر
            </p>
          </div>

          <div className="space-y-2.5">
            {challenge.targets.map((tgt, idx) => {
              const isFound = foundTargetIds.includes(tgt.id);
              const isHintActive = activeHintTargetId === tgt.id;

              return (
                <div
                  key={tgt.id}
                  className={`p-3 rounded-2xl border transition-all text-xs space-y-1.5 ${
                    isFound
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : 'bg-[#F7F5EF] dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isFound ? 'bg-emerald-600 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                      }`}>
                        {isFound ? '✓' : idx + 1}
                      </span>
                      <span>{tgt.name}</span>
                    </div>

                    {!isFound && (
                      <button
                        onClick={() => setActiveHintTargetId(isHintActive ? null : tgt.id)}
                        className="p-1 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950 cursor-pointer"
                        title="طلب تلميح"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Hint view if active */}
                  {!isFound && isHintActive && (
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 animate-fade-in">
                      💡 {tgt.hint}
                    </div>
                  )}

                  {/* Solved explanation */}
                  {isFound && (
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                      ✨ {tgt.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  </AnimatePresence>

      {/* Completion Banner */}
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
              🌟
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#174F3F] dark:text-emerald-200">
                ألف مبارك! اكتشفتِ جميع العناصر والتفاصيل بنجاح!
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                قوة الملاحظة واليقظة الذهنية هي مفتاحكِ الدائم لالتقاط مواطن السكينة في يومكِ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-emerald-500/30 max-w-lg mx-auto text-right space-y-1.5">
              <span className="text-[11px] font-bold text-[#B78327] block">
                💡 الرسالة النفسية للتحدي:
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-100 leading-relaxed">
                {challenge.psychologicalTakeaway.message}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => resetChallenge(challengeIndex)}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer shadow-xs"
              >
                إعادة اللغز ↺
              </button>
              <button
                onClick={handleNextChallenge}
                className="px-6 py-2.5 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>اللغز البصري التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
