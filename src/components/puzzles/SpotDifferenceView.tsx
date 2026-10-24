/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#E2EFE7] to-[#D5EADF] dark:from-emerald-950/80 dark:to-stone-900 border-2 border-[#23785B] shadow-xl text-center space-y-4 animate-fade-in">
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
        </div>
      )}

    </div>
  );
};
