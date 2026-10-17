import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, 
  Play, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowLeft,
  MousePointerClick,
  Compass
} from 'lucide-react';
import { chimeService } from '../services/chimeService';

export interface WheelSectionItem {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  bgHex: string;
  gradientStart: string;
  gradientEnd: string;
  textColor: string;
  badge?: string;
  action: () => void;
}

interface NesmatLuckyWheelProps {
  sections: WheelSectionItem[];
  theme?: 'dark' | 'light' | 'system';
  onSectionOpen?: (section: WheelSectionItem) => void;
}

export const NesmatLuckyWheel: React.FC<NesmatLuckyWheelProps> = ({
  sections,
  theme = 'dark',
  onSectionOpen
}) => {
  const isDark = theme === 'dark';
  const [wheelMode, setWheelMode] = useState<'spin' | 'grid'>('spin');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [selectedSection, setSelectedSection] = useState<WheelSectionItem | null>(null);
  const [viewingDetailSection, setViewingDetailSection] = useState<WheelSectionItem | null>(null);
  const [isMuted, setIsMuted] = useState(() => chimeService.isMuted());
  const [isNeedleTicking, setIsNeedleTicking] = useState(false);
  const [selectionSource, setSelectionSource] = useState<'spin' | 'manual'>('spin');

  const tickTimersRef = useRef<NodeJS.Timeout[]>([]);
  const numSections = sections.length;
  const sliceAngle = 360 / numSections;
  const halfAngle = sliceAngle / 2;

  // Cleanup tick timers on unmount
  useEffect(() => {
    return () => {
      tickTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const toggleSound = () => {
    const nextMuted = chimeService.toggleMute();
    setIsMuted(nextMuted);
  };

  /**
   * Calculates the rotation angle required to bring the given section index to 12 o'clock (the needle).
   * Slice 0 is centered at 12 o'clock (0°).
   * Clockwise rotation brings slices in reverse order under the pointer.
   */
  const getRotationForIndex = (index: number, currentRot: number, minSpins = 5) => {
    // Target normalized angle under needle is index * sliceAngle
    const targetNormalized = (360 - (index * sliceAngle)) % 360;
    const currentNormalized = currentRot % 360;
    let forwardDiff = targetNormalized - currentNormalized;
    if (forwardDiff < 0) {
      forwardDiff += 360;
    }
    // Add full rotations for visual excitement
    return currentRot + (minSpins * 360) + forwardDiff;
  };

  /**
   * Triggers the realistic decelerating audio clicks & needle wobbles.
   */
  const scheduleDeceleratingTicks = (durationMs = 3800) => {
    // Clear previous
    tickTimersRef.current.forEach(clearTimeout);
    tickTimersRef.current = [];

    // Schedule ticks with increasing intervals (exponential deceleration)
    let currentDelay = 0;
    let interval = 70; // starts fast: 70ms
    const factor = 1.09; // slows down smoothly

    while (currentDelay + interval < durationMs - 150) {
      currentDelay += interval;
      interval *= factor;
      const delay = currentDelay;
      const pitchFactor = 0.95 + (Math.random() * 0.15);

      const timer = setTimeout(() => {
        chimeService.playWheelTickSound(pitchFactor);
        // Needle wobble
        setIsNeedleTicking(true);
        setTimeout(() => setIsNeedleTicking(false), 90);
      }, delay);

      tickTimersRef.current.push(timer);
    }
  };

  /**
   * Spins the wheel to a random section with authentic physics and sound.
   */
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSection(null);
    setViewingDetailSection(null);
    setSelectionSource('spin');

    // Pick random winning section
    const targetIndex = Math.floor(Math.random() * numSections);
    const targetSec = sections[targetIndex];

    // Compute target rotation
    const newRot = getRotationForIndex(targetIndex, spinRotation, 6);
    setSpinRotation(newRot);

    // Audio & needle ticks
    scheduleDeceleratingTicks(3800);

    // Conclude after 3.8s
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSection(targetSec);
      try {
        chimeService.playWheelWinSound();
      } catch {}
    }, 3800);
  };

  /**
   * Allows the user to choose a section manually by clicking its slice on the wheel or quick pill.
   */
  const handleManualSelect = (sec: WheelSectionItem) => {
    if (isSpinning) return;
    setSelectionSource('manual');
    const index = sections.findIndex(s => s.id === sec.id);
    if (index === -1) return;

    // Smoothly rotate the wheel to point at this section with 1-2 spins
    const newRot = getRotationForIndex(index, spinRotation, 1);
    setSpinRotation(newRot);

    scheduleDeceleratingTicks(1200);

    setTimeout(() => {
      setSelectedSection(sec);
      try {
        chimeService.playWheelTickSound(1.2);
        chimeService.playStoneDropChime();
      } catch {}
    }, 1200);
  };

  // SVG Geometry for Slices
  // Radius = 188, Center = (200, 200)
  // Each slice is centered around 12 o'clock (-90°), spanning from (-90 - halfAngle) to (-90 + halfAngle)
  const R = 188;
  const cx = 200;
  const cy = 200;
  const rad1 = ((-90 - halfAngle) * Math.PI) / 180;
  const rad2 = ((-90 + halfAngle) * Math.PI) / 180;
  const x1 = (cx + R * Math.cos(rad1)).toFixed(2);
  const y1 = (cy + R * Math.sin(rad1)).toFixed(2);
  const x2 = (cx + R * Math.cos(rad2)).toFixed(2);
  const y2 = (cy + R * Math.sin(rad2)).toFixed(2);
  const slicePathD = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;

  // Perimeter rim lights (22 glowing studs)
  const rimLights = Array.from({ length: 22 }).map((_, i) => {
    const angle = (i * 360) / 22;
    const rad = (angle * Math.PI) / 180;
    const lightR = 194;
    return {
      x: cx + lightR * Math.cos(rad),
      y: cy + lightR * Math.sin(rad),
      key: i
    };
  });

  return (
    <section className={`p-6 sm:p-8 border rounded-3xl space-y-6 shadow-xl text-center relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#12221A] via-[#101914] to-[#0A120E] border-emerald-500/40' 
        : 'bg-gradient-to-br from-[#F7F3E9] via-[#EBF3ED] to-[#E2EDE5] border-emerald-600/25'
    }`}>
      {/* Background Decorative Auras */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {!viewingDetailSection ? (
        <>
          {/* Header & Mode Switcher */}
          <div className="space-y-3 relative z-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>عجلة الحظ التفاعلية — نسمة حياة 🌿</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                title={isMuted ? 'تفعيل الصوت الهادئ' : 'كتم الصوت'}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isMuted 
                    ? 'bg-stone-500/10 text-stone-400 border-stone-500/20 hover:bg-stone-500/20' 
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
              جنينة نسمة حياة التفاعلية 🎡
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              اختر طريقتك المفضلة: دوّر العجلة ودع الصدفة اللطيفة ترشدك، أو انقر على القسم الذي تحتاجه بنفسك الآن.
            </p>

            {/* Mode Switcher Tabs & Direct Section Jump Dropdown */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWheelMode('spin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    wheelMode === 'spin'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black scale-102 shadow-md'
                      : isDark ? 'bg-white/5 text-stone-300 hover:bg-white/10' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>🎡 العجلة العشوائية</span>
                </button>
                <button
                  onClick={() => setWheelMode('grid')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    wheelMode === 'grid'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black scale-102 shadow-md'
                      : isDark ? 'bg-white/5 text-stone-300 hover:bg-white/10' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>📋 شبكة الأقسام ({numSections})</span>
                </button>
              </div>

              {/* Direct Section Jump Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  onChange={(e) => {
                    const secId = e.target.value;
                    if (!secId) return;
                    const found = sections.find(s => s.id === secId);
                    if (found) {
                      if (onSectionOpen) {
                        onSectionOpen(found);
                      } else {
                        setViewingDetailSection(found);
                      }
                    }
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border outline-none ${
                    isDark 
                      ? 'bg-[#182C21] text-emerald-300 border-emerald-500/40 hover:border-emerald-400' 
                      : 'bg-white text-emerald-950 border-emerald-600/30 hover:border-emerald-500'
                  }`}
                >
                  <option value="" disabled>🎯 الانتقال المباشر للقسم...</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.emoji} {sec.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {wheelMode === 'spin' ? (
            <div className="flex flex-col items-center justify-center space-y-6 relative z-10 py-2 animate-fade-in">
              {/* Wheel Container with Rim Lighting */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Outer Glow Halo */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 pointer-events-none ${
                  isSpinning ? 'bg-emerald-400/30 scale-105' : 'bg-emerald-500/10'
                }`} />

                {/* SVG Wheel Chassis */}
                <div className="relative w-full h-full p-2 rounded-full flex items-center justify-center">
                  <svg 
                    viewBox="0 0 400 400" 
                    className="w-full h-full overflow-visible drop-shadow-2xl select-none"
                  >
                    <defs>
                      {/* Brand Gradients for each slice */}
                      {sections.map((sec) => (
                        <radialGradient 
                          key={`grad-${sec.id}`} 
                          id={`grad-${sec.id}`}
                          cx="50%" cy="25%" r="75%"
                        >
                          <stop offset="0%" stopColor={sec.gradientStart} />
                          <stop offset="100%" stopColor={sec.gradientEnd} />
                        </radialGradient>
                      ))}

                      {/* Golden Outer Bezel */}
                      <linearGradient id="outer-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="35%" stopColor="#D5A65A" />
                        <stop offset="70%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>

                      {/* Center Hub Metallic Rim */}
                      <radialGradient id="center-hub-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="60%" stopColor="#174C3C" />
                        <stop offset="100%" stopColor="#0B2019" />
                      </radialGradient>
                    </defs>

                    {/* Outer Decorative Ring */}
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="196" 
                      fill="none" 
                      stroke="url(#outer-gold-rim)" 
                      strokeWidth="8"
                      className="drop-shadow-lg"
                    />
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="191" 
                      fill="#0C1B14" 
                      stroke="#174C3C" 
                      strokeWidth="2"
                    />

                    {/* Perimeter Glowing Studs / Rivets */}
                    {rimLights.map((light, i) => (
                      <circle
                        key={light.key}
                        cx={light.x}
                        cy={light.y}
                        r={isSpinning ? 3.5 : 2.8}
                        fill={isSpinning ? (i % 2 === 0 ? '#FBBF24' : '#34D399') : '#D5A65A'}
                        className={`transition-all duration-300 ${isSpinning ? 'animate-pulse' : 'opacity-80'}`}
                        style={{
                          filter: isSpinning ? 'drop-shadow(0 0 4px #FBBF24)' : undefined,
                          animationDelay: `${(i * 70)}ms`
                        }}
                      />
                    ))}

                    {/* Rotating Wheel Group with cubic-bezier deceleration */}
                    <g 
                      transform={`rotate(${spinRotation}, 200, 200)`}
                      style={{
                        transition: isSpinning 
                          ? 'transform 3.8s cubic-bezier(0.12, 0.82, 0.18, 1)' 
                          : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {sections.map((sec, idx) => {
                        const sliceRot = idx * sliceAngle;
                        return (
                          <g 
                            key={sec.id}
                            transform={`rotate(${sliceRot}, 200, 200)`}
                            onClick={() => handleManualSelect(sec)}
                            className="cursor-pointer group"
                          >
                            <title>{`قسم ${sec.title} — انقر للاختيار المباشر`}</title>
                            {/* Slice Path */}
                            <path
                              d={slicePathD}
                              fill={`url(#grad-${sec.id})`}
                              stroke="#FFFFFF"
                              strokeWidth="1.25"
                              strokeOpacity="0.35"
                              className="transition-opacity group-hover:opacity-90"
                            />

                            {/* Slice Content (Emoji & Title) */}
                            <text
                              x="200"
                              y="52"
                              textAnchor="middle"
                              dominantBaseline="central"
                              className="text-2xl select-none filter drop-shadow-md pointer-events-none"
                            >
                              {sec.emoji}
                            </text>

                            <text
                              x="200"
                              y="86"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#FFFFFF"
                              fontSize="9.5"
                              fontWeight="900"
                              className="select-none font-cairo pointer-events-none drop-shadow"
                              style={{ letterSpacing: '0.2px' }}
                            >
                              {sec.title}
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    {/* Center Hub Core */}
                    <circle
                      cx="200"
                      cy="200"
                      r="40"
                      fill="url(#outer-gold-rim)"
                      className="drop-shadow-xl"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="34"
                      fill="url(#center-hub-glow)"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeOpacity="0.4"
                      onClick={handleSpinWheel}
                      className="cursor-pointer hover:scale-102 transition-transform"
                    />
                    <text
                      x="200"
                      y="195"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-lg select-none pointer-events-none"
                    >
                      🌿
                    </text>
                    <text
                      x="200"
                      y="214"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#F7F3E9"
                      fontSize="9"
                      fontWeight="900"
                      className="select-none font-cairo pointer-events-none"
                    >
                      {isSpinning ? 'دور...' : 'دوّر!'}
                    </text>

                    {/* Top Pointer Needle with Realistic Mechanical Peg Recoil */}
                    <g 
                      transform="translate(200, 10)"
                      className={isNeedleTicking ? 'animate-needle-tick' : ''}
                      style={{ transformOrigin: 'top center' }}
                    >
                      {/* Needle Shadow */}
                      <path
                        d="M -11 -4 L 11 -4 L 0 32 Z"
                        fill="rgba(0, 0, 0, 0.45)"
                        transform="translate(0, 3)"
                      />
                      {/* Needle Body */}
                      <path
                        d="M -11 -4 L 11 -4 L 0 32 Z"
                        fill="url(#outer-gold-rim)"
                        stroke="#FFF"
                        strokeWidth="1"
                      />
                      {/* Needle Facet Highlight */}
                      <path
                        d="M 0 -4 L 11 -4 L 0 32 Z"
                        fill="rgba(255, 255, 255, 0.28)"
                      />
                      {/* Needle Pivot Pin */}
                      <circle cx="0" cy="0" r="4.5" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Quick Section Picker Pills (Direct Selection under the Wheel) */}
              <div className="w-full max-w-xl mx-auto space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs px-2">
                  <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
                    <span>أو انقر مباشرة على أي قسم من هنا:</span>
                  </span>
                  <span className="text-[11px] text-emerald-500 font-bold">11 قسماً متاحاً</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none px-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleManualSelect(sec)}
                      disabled={isSpinning}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                        selectedSection?.id === sec.id
                          ? 'bg-emerald-500 text-black border-emerald-400 scale-102 font-black'
                          : isDark
                            ? 'bg-black/30 border-white/10 text-stone-200 hover:bg-white/10 hover:border-emerald-500/40'
                            : 'bg-white border-emerald-600/15 text-stone-800 hover:bg-emerald-50 hover:border-emerald-500/40'
                      }`}
                    >
                      <span>{sec.emoji}</span>
                      <span>{sec.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spin Trigger Button */}
              {!selectedSection ? (
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className={`px-8 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-black font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-sm ${
                    isSpinning ? 'opacity-70 cursor-not-allowed animate-pulse' : 'hover:scale-102'
                  }`}
                >
                  <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'العجلة تدور الآن برقة...' : 'يلا نلف العجلة! 🎡'}</span>
                </button>
              ) : (
                /* Selected Result Card */
                <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-won-card space-y-4 text-center ${
                  isDark ? 'bg-[#182C21] border-emerald-500/60' : 'bg-white border-emerald-600/35'
                }`}>
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl shadow-lg mx-auto text-white"
                    style={{ backgroundColor: selectedSection.bgHex }}
                  >
                    {selectedSection.emoji}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectionSource === 'spin' ? 'النتيجة المختارة لك اليوم 🌿' : 'اختيارك الشخصي المباشر ✨'}</span>
                    </div>
                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {selectedSection.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {selectedSection.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (onSectionOpen) {
                          onSectionOpen(selectedSection);
                        } else {
                          setViewingDetailSection(selectedSection);
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>افتح القسم الآن 🌿</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSection(null);
                        handleSpinWheel();
                      }}
                      className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10' 
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>إعادة التدوير 🎡</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Direct Section Picker Grid Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 relative z-10 py-4 animate-fade-in text-right">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => {
                    if (onSectionOpen) {
                      onSectionOpen(sec);
                    } else {
                      setViewingDetailSection(sec);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group shadow-xs hover:scale-101 ${
                    isDark 
                      ? 'bg-black/30 border-white/10 hover:border-emerald-500/50 hover:bg-black/40' 
                      : 'bg-white border-emerald-600/15 hover:border-emerald-500/50 hover:bg-emerald-50/40'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 text-white shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: sec.bgHex }}
                  >
                    {sec.emoji}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-black text-xs truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>{sec.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-500 group-hover:-translate-x-1 transition-transform">فتح 👈</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Dedicated Section Detail View */
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl animate-fade-in space-y-6 text-right ${
          isDark ? 'bg-[#15251D] border-emerald-500/40 text-white' : 'bg-white border-emerald-600/30 text-stone-900'
        }`}>
          <div className="flex items-center justify-between border-b pb-4 border-white/10">
            <button
              onClick={() => setViewingDetailSection(null)}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للعجلة 🎡</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{viewingDetailSection.emoji}</span>
              <span className="text-sm font-black">{viewingDetailSection.title}</span>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 className="font-bold text-base text-emerald-400">عن القسم: {viewingDetailSection.title}</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {viewingDetailSection.desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-black/20 text-center space-y-4">
              <p className="text-xs text-stone-400">
                اضغط على الزر أدناه للانتقال إلى محتويات وتمارين هذا القسم مباشرة:
              </p>
              <button
                onClick={() => viewingDetailSection.action()}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>بدء الاستخدام والدخول الفوري 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
