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
  Compass,
  Star,
  Flame,
  Heart,
  Gift
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { motion, AnimatePresence } from 'motion/react';

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

// Daily fortune reflections corresponding to winning sections
const FORTUNE_REFLECTIONS: Record<string, string[]> = {
  default: [
    '«كل خطوة صغنونة بتقربك لسلامك الداخلي.. استمر ولا تستعجل.»',
    '«اليوم هو فرصة جديدة لتكون ألطف مع نفسك.»',
    '«أنفاسك الهادئة هي أقوى درع لحماية طاقتك.»'
  ]
};

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
  const [dailyFortune, setDailyFortune] = useState<string>('');
  const [showConfettiEffect, setShowConfettiEffect] = useState(false);

  const tickTimersRef = useRef<NodeJS.Timeout[]>([]);
  const numSections = sections.length;
  const sliceAngle = 360 / numSections;
  const halfAngle = sliceAngle / 2;

  useEffect(() => {
    return () => {
      tickTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const toggleSound = () => {
    const nextMuted = chimeService.toggleMute();
    setIsMuted(nextMuted);
  };

  const getRotationForIndex = (index: number, currentRot: number, minSpins = 6) => {
    const targetNormalized = (360 - (index * sliceAngle)) % 360;
    const currentNormalized = currentRot % 360;
    let forwardDiff = targetNormalized - currentNormalized;
    if (forwardDiff < 0) {
      forwardDiff += 360;
    }
    return currentRot + (minSpins * 360) + forwardDiff;
  };

  const scheduleDeceleratingTicks = (durationMs = 4000) => {
    tickTimersRef.current.forEach(clearTimeout);
    tickTimersRef.current = [];

    let currentDelay = 0;
    let interval = 65;
    const factor = 1.10;

    while (currentDelay + interval < durationMs - 150) {
      currentDelay += interval;
      interval *= factor;
      const delay = currentDelay;
      const pitchFactor = 0.9 + (Math.random() * 0.2);

      const timer = setTimeout(() => {
        chimeService.playWheelTickSound(pitchFactor);
        setIsNeedleTicking(true);
        setTimeout(() => setIsNeedleTicking(false), 90);
      }, delay);

      tickTimersRef.current.push(timer);
    }
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSection(null);
    setViewingDetailSection(null);
    setSelectionSource('spin');
    setShowConfettiEffect(false);

    const targetIndex = Math.floor(Math.random() * numSections);
    const targetSec = sections[targetIndex];

    const newRot = getRotationForIndex(targetIndex, spinRotation, 7);
    setSpinRotation(newRot);

    scheduleDeceleratingTicks(4000);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSection(targetSec);
      setShowConfettiEffect(true);
      
      // Pick a random reflection
      const list = FORTUNE_REFLECTIONS.default;
      setDailyFortune(list[Math.floor(Math.random() * list.length)]);

      try {
        chimeService.playWheelWinSound();
      } catch {}
    }, 4000);
  };

  const handleManualSelect = (sec: WheelSectionItem) => {
    if (isSpinning) return;
    setSelectionSource('manual');
    setShowConfettiEffect(false);
    const index = sections.findIndex(s => s.id === sec.id);
    if (index === -1) return;

    const newRot = getRotationForIndex(index, spinRotation, 2);
    setSpinRotation(newRot);

    scheduleDeceleratingTicks(1400);

    setTimeout(() => {
      setSelectedSection(sec);
      setShowConfettiEffect(true);
      const list = FORTUNE_REFLECTIONS.default;
      setDailyFortune(list[Math.floor(Math.random() * list.length)]);

      try {
        chimeService.playWheelTickSound(1.2);
        chimeService.playStoneDropChime();
      } catch {}
    }, 1400);
  };

  const R = 185;
  const cx = 200;
  const cy = 200;
  const rad1 = ((-90 - halfAngle) * Math.PI) / 180;
  const rad2 = ((-90 + halfAngle) * Math.PI) / 180;
  const x1 = (cx + R * Math.cos(rad1)).toFixed(2);
  const y1 = (cy + R * Math.sin(rad1)).toFixed(2);
  const x2 = (cx + R * Math.cos(rad2)).toFixed(2);
  const y2 = (cy + R * Math.sin(rad2)).toFixed(2);
  const slicePathD = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;

  const rimLights = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const lightR = 193;
    return {
      x: cx + lightR * Math.cos(rad),
      y: cy + lightR * Math.sin(rad),
      key: i
    };
  });

  return (
    <section className={`p-6 sm:p-10 border rounded-[2.5rem] space-y-8 shadow-2xl text-center relative overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0F2218] via-[#09140E] to-[#050A08] border-emerald-500/50 shadow-emerald-950/40' 
        : 'bg-gradient-to-br from-[#FDFBF7] via-[#EAF3EC] to-[#DEEFE3] border-emerald-600/30 shadow-emerald-900/10'
    }`}>
      
      {/* Immersive Background Auras */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

      {!viewingDetailSection ? (
        <>
          {/* Header & Interactive Mode Bar */}
          <div className="space-y-4 relative z-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30 shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>عجلة الحظ والتوجيه النفسي التفاعلية 🎡</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound Toggle */}
                <button
                  onClick={toggleSound}
                  title={isMuted ? 'تفعيل المؤثرات الصوتية' : 'كتم الصوت'}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                    isMuted 
                      ? 'bg-stone-500/10 text-stone-400 border-stone-500/20 hover:bg-stone-500/20' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                بستان نسمة حياة التفاعلي ✨
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                دوّر العجلة ودع الصدفة الهادئة تختار لك تمرينك اليومي، أو انتقل فوراً لأي قسم تفضله بنقرة واحدة.
              </p>
            </div>

            {/* Mode Switcher Tabs & Direct Jump */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-black/25 p-1 rounded-2xl border border-white/10 shadow-inner">
                <button
                  onClick={() => setWheelMode('spin')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    wheelMode === 'spin'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 shadow-lg scale-102 font-black'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>🎡 العجلة الدوارة</span>
                </button>
                <button
                  onClick={() => setWheelMode('grid')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    wheelMode === 'grid'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 shadow-lg scale-102 font-black'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>📋 شبكة الأقسام ({numSections})</span>
                </button>
              </div>

              {/* Direct Jump Selector */}
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
                className={`w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-all border outline-none shadow-sm ${
                  isDark 
                    ? 'bg-[#152A20] text-emerald-200 border-emerald-500/40 hover:border-emerald-400' 
                    : 'bg-white text-emerald-950 border-emerald-600/30 hover:border-emerald-500'
                }`}
              >
                <option value="" disabled>🎯 الانتقال السريع لأي قسم...</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.emoji} {sec.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {wheelMode === 'spin' ? (
            <div className="flex flex-col items-center justify-center space-y-8 relative z-10 py-4 animate-fade-in">
              
              {/* Wheel Container with Pulsing Neon Rim */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                
                {/* Outer Pulsing Halo */}
                <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
                  isSpinning ? 'bg-emerald-400/40 scale-110 animate-pulse' : 'bg-emerald-500/15'
                }`} />

                {/* SVG Wheel Chassis */}
                <div className="relative w-full h-full p-2 rounded-full flex items-center justify-center">
                  <svg 
                    viewBox="0 0 400 400" 
                    className="w-full h-full overflow-visible drop-shadow-2xl select-none"
                  >
                    <defs>
                      {sections.map((sec) => (
                        <radialGradient 
                          key={`grad-${sec.id}`} 
                          id={`grad-${sec.id}`}
                          cx="50%" cy="30%" r="75%"
                        >
                          <stop offset="0%" stopColor={sec.gradientStart} />
                          <stop offset="100%" stopColor={sec.gradientEnd} />
                        </radialGradient>
                      ))}

                      <linearGradient id="outer-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="35%" stopColor="#D5A65A" />
                        <stop offset="70%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>

                      <radialGradient id="center-hub-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="70%" stopColor="#065F46" />
                        <stop offset="100%" stopColor="#022C22" />
                      </radialGradient>
                    </defs>

                    {/* Outer Bezel */}
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="196" 
                      fill="none" 
                      stroke="url(#outer-gold-rim)" 
                      strokeWidth="8"
                      className="drop-shadow-xl"
                    />
                    <circle 
                      cx="200" 
                      cy="200" 
                      r="191" 
                      fill="#08140F" 
                      stroke="#1B4D3E" 
                      strokeWidth="2.5"
                    />

                    {/* Perimeter Glowing Studs */}
                    {rimLights.map((light, i) => (
                      <circle
                        key={light.key}
                        cx={light.x}
                        cy={light.y}
                        r={isSpinning ? 3.8 : 3}
                        fill={isSpinning ? (i % 2 === 0 ? '#FBBF24' : '#6EE7B7') : '#D5A65A'}
                        className={`transition-all duration-300 ${isSpinning ? 'animate-ping' : 'opacity-90'}`}
                        style={{
                          filter: isSpinning ? 'drop-shadow(0 0 6px #34D399)' : undefined,
                          animationDelay: `${(i * 50)}ms`
                        }}
                      />
                    ))}

                    {/* Rotating Wheel Group */}
                    <motion.g 
                      animate={{ rotate: spinRotation }}
                      transition={{ 
                        duration: isSpinning ? 4.0 : 1.2, 
                        ease: [0.12, 0.82, 0.18, 1] 
                      }}
                      style={{ transformOrigin: '200px 200px' }}
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
                            <path
                              d={slicePathD}
                              fill={`url(#grad-${sec.id})`}
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                              strokeOpacity="0.4"
                              className="transition-opacity group-hover:opacity-90 shadow-sm"
                            />

                            <text
                              x="200"
                              y="52"
                              textAnchor="middle"
                              dominantBaseline="central"
                              className="text-2xl select-none filter drop-shadow-lg pointer-events-none"
                            >
                              {sec.emoji}
                            </text>

                            <text
                              x="200"
                              y="86"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#FFFFFF"
                              fontSize="10"
                              fontWeight="900"
                              className="select-none font-cairo pointer-events-none drop-shadow-md"
                              style={{ letterSpacing: '0.2px' }}
                            >
                              {sec.title}
                            </text>
                          </g>
                        );
                      })}
                    </motion.g>

                    {/* Center Hub Core */}
                    <circle
                      cx="200"
                      cy="200"
                      r="42"
                      fill="url(#outer-gold-rim)"
                      className="drop-shadow-2xl"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="36"
                      fill="url(#center-hub-glow)"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeOpacity="0.6"
                      onClick={handleSpinWheel}
                      className="cursor-pointer hover:scale-105 transition-transform"
                    />
                    <text
                      x="200"
                      y="194"
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
                      fontSize="9.5"
                      fontWeight="900"
                      className="select-none font-cairo pointer-events-none"
                    >
                      {isSpinning ? 'تدور...' : 'دوّر!'}
                    </text>

                    {/* Top Pointer Needle */}
                    <g 
                      transform="translate(200, 8)"
                      className={isNeedleTicking ? 'animate-bounce' : ''}
                      style={{ transformOrigin: 'top center' }}
                    >
                      <path
                        d="M -12 -4 L 12 -4 L 0 34 Z"
                        fill="rgba(0, 0, 0, 0.5)"
                        transform="translate(0, 4)"
                      />
                      <path
                        d="M -12 -4 L 12 -4 L 0 34 Z"
                        fill="url(#outer-gold-rim)"
                        stroke="#FFF"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 0 -4 L 12 -4 L 0 34 Z"
                        fill="rgba(255, 255, 255, 0.35)"
                      />
                      <circle cx="0" cy="0" r="5" fill="#EF4444" stroke="#FEF08A" strokeWidth="2" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Quick Section Picker Pills */}
              <div className="w-full max-w-xl mx-auto space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs px-3">
                  <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    <MousePointerClick className="w-4 h-4 text-emerald-400" />
                    <span>تخطي العجلة والانتقال السريع:</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{numSections} أقسام متاحة</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleManualSelect(sec)}
                      disabled={isSpinning}
                      className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shadow-sm ${
                        selectedSection?.id === sec.id
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 border-emerald-300 scale-105 font-black shadow-md'
                          : isDark
                            ? 'bg-[#15251D] border-white/10 text-stone-200 hover:bg-white/10 hover:border-emerald-500/40'
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
                  className={`px-10 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-stone-950 font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3 cursor-pointer text-sm sm:text-base border border-emerald-200/50 ${
                    isSpinning ? 'opacity-70 cursor-not-allowed animate-pulse' : 'hover:scale-105 shadow-emerald-950/50'
                  }`}
                >
                  <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'العجلة تدور الآن باهتمام...' : 'يلا نلف العجلة العشوائية! 🎡'}</span>
                </button>
              ) : (
                /* Gorgeous Winner Result Card */
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 260 }}
                  className={`w-full max-w-lg p-7 rounded-[2rem] border shadow-2xl space-y-5 text-center relative overflow-hidden ${
                    isDark ? 'bg-gradient-to-br from-[#162D22] to-[#0F1E16] border-emerald-400/50 shadow-emerald-950/60' : 'bg-white border-emerald-600/40 shadow-emerald-900/15'
                  }`}
                >
                  {showConfettiEffect && (
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-4xl shadow-xl mx-auto text-white border-2 border-white/20"
                    style={{ backgroundColor: selectedSection.bgHex }}
                  >
                    {selectedSection.emoji}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{selectionSource === 'spin' ? 'الهدية التي اختارتها لك العجلة اليوم 🌿' : 'اختيارك الشخصي ✨'}</span>
                    </div>
                    
                    <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {selectedSection.title}
                    </h3>

                    <p className={`text-xs sm:text-sm leading-relaxed max-w-md mx-auto ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {selectedSection.desc}
                    </p>

                    {dailyFortune && (
                      <div className="p-3 rounded-2xl bg-black/20 border border-white/10 text-xs italic text-amber-300/90 font-tajawal">
                        {dailyFortune}
                      </div>
                    )}
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
                      className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 text-xs sm:text-sm font-black rounded-2xl transition-all shadow-xl flex items-center gap-2.5 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>افتح القسم وابدأ الآن 🌿</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedSection(null);
                        handleSpinWheel();
                      }}
                      className={`px-4 py-3.5 border rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10' 
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                      }`}
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>تدوير مرة أخرى 🎡</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Mode 2: Direct Section Picker Grid Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 py-4 animate-fade-in text-right">
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
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 group shadow-sm hover:scale-102 ${
                    isDark 
                      ? 'bg-[#15251D]/60 border-white/10 hover:border-emerald-500/50 hover:bg-[#15251D]' 
                      : 'bg-white border-emerald-600/15 hover:border-emerald-500/50 hover:bg-emerald-50/40'
                  }`}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 text-white shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: sec.bgHex }}
                  >
                    {sec.emoji}
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-black text-sm truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>{sec.title}</h4>
                      <span className="text-xs font-bold text-emerald-400 group-hover:-translate-x-1 transition-transform">فتح 👈</span>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Dedicated Section Detail View */
        <div className={`p-6 sm:p-10 rounded-[2.5rem] border shadow-2xl animate-fade-in space-y-6 text-right ${
          isDark ? 'bg-[#13241C] border-emerald-500/50 text-white' : 'bg-white border-emerald-600/30 text-stone-900'
        }`}>
          <div className="flex items-center justify-between border-b pb-4 border-white/10">
            <button
              onClick={() => setViewingDetailSection(null)}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
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
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
              <h4 className="font-bold text-base text-emerald-300">عن القسم: {viewingDetailSection.title}</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {viewingDetailSection.desc}
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-black/30 text-center space-y-5">
              <p className="text-xs sm:text-sm text-stone-300">
                اضغط على الزر أدناه للانتقال الفوري إلى محتويات وتمارين هذا القسم وبدء جولتك النفسية:
              </p>
              <button
                onClick={() => viewingDetailSection.action()}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 text-xs sm:text-sm font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>بدء الاستخدام والدخول الفوري 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
