import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Eye, Volume2, Mic, Heart, RefreshCw, ZapOff, Shield, Smile } from 'lucide-react';

export type CompanionExpression = 'welcome' | 'listening' | 'thinking' | 'empathy' | 'encouraging' | 'speaking';
export type CompanionPersona = 'adult' | 'child' | 'father';

export interface CompanionAvatarProps {
  persona: CompanionPersona;
  expression: CompanionExpression;
  isSpeaking: boolean;
  isListening: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onTogglePersona?: () => void;
  allowAnimationToggle?: boolean;
  isAnimated?: boolean;
  onToggleAnimation?: () => void;
  customPhoto?: string | null;
  className?: string;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  persona,
  expression,
  isSpeaking,
  isListening,
  size = 'lg',
  onTogglePersona,
  allowAnimationToggle = false,
  isAnimated = true,
  onToggleAnimation,
  customPhoto,
  className = ''
}) => {
  const [internalAnimatedMode, setInternalAnimatedMode] = useState<boolean>(true);
  const isAnimatedMode = isAnimated !== undefined ? isAnimated : internalAnimatedMode;

  const handleToggleAnimated = () => {
    if (onToggleAnimation) {
      onToggleAnimation();
    } else {
      setInternalAnimatedMode(prev => !prev);
    }
  };

  // Natural Blinking State
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  // Viseme mouth step for true lip sync when speaking
  const [visemeIndex, setVisemeIndex] = useState<number>(0);
  // Idle breathing cycle counter
  const [breathTick, setBreathTick] = useState<number>(0);

  // Natural organic blink loop (every 3 to 6 seconds)
  useEffect(() => {
    if (!isAnimatedMode) return;
    let timer: NodeJS.Timeout;

    const scheduleBlink = () => {
      const nextDelay = 2800 + Math.random() * 3200;
      timer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 130);
      }, nextDelay);
    };

    scheduleBlink();
    return () => clearTimeout(timer);
  }, [isAnimatedMode]);

  // Syllabic Phonetic Lip-Sync when speaking (synced strictly with isSpeaking state)
  useEffect(() => {
    if (!isSpeaking || !isAnimatedMode) {
      setVisemeIndex(0);
      return;
    }

    // Cycles through visemes: 0 (closed/rest), 1 (open A/O), 2 (mid E/H), 3 (wide I/smile), 4 (pursed U/W)
    const visemeInterval = setInterval(() => {
      setVisemeIndex(prev => {
        const next = (prev + 1 + Math.floor(Math.random() * 2)) % 5;
        return next === 0 ? 1 : next;
      });
    }, 115);

    return () => {
      clearInterval(visemeInterval);
      setVisemeIndex(0);
    };
  }, [isSpeaking, isAnimatedMode]);

  // Gentle breathing cycle loop
  useEffect(() => {
    if (!isAnimatedMode) return;
    const interval = setInterval(() => {
      setBreathTick(t => (t + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, [isAnimatedMode]);

  // Effective expression: if speaking, expression visually behaves as 'speaking'
  const effectiveExpression = isSpeaking ? 'speaking' : expression;

  // Head tilt & gaze offset based on state
  const { headTilt, eyeShiftX, eyeShiftY, chestBreathing } = useMemo(() => {
    if (!isAnimatedMode) {
      return { headTilt: 0, eyeShiftX: 0, eyeShiftY: 0, chestBreathing: 0 };
    }

    const sinBreath = Math.sin((breathTick * Math.PI) / 30);
    const chestBreathing = sinBreath * 1.5;

    let headTilt = sinBreath * 0.5;
    let eyeShiftX = 0;
    let eyeShiftY = 0;

    switch (effectiveExpression) {
      case 'listening':
        headTilt = 3.5;
        eyeShiftX = 0;
        eyeShiftY = 1.2;
        break;
      case 'thinking':
        headTilt = -3.2;
        eyeShiftX = -2.5;
        eyeShiftY = -2.5;
        break;
      case 'empathy':
        headTilt = -4.0;
        eyeShiftX = 0;
        eyeShiftY = 0.8;
        break;
      case 'encouraging':
        headTilt = 2.2;
        eyeShiftX = 0;
        eyeShiftY = -0.5;
        break;
      case 'speaking':
        headTilt = Math.sin((breathTick * Math.PI) / 10) * 1.8;
        eyeShiftX = 0;
        eyeShiftY = 0.5;
        break;
      case 'welcome':
      default:
        headTilt = sinBreath * 1.0;
        eyeShiftX = 0;
        eyeShiftY = 0;
        break;
    }

    return { headTilt, eyeShiftX, eyeShiftY, chestBreathing };
  }, [isAnimatedMode, effectiveExpression, breathTick]);

  // Dimensions based on size prop
  const sizeMap = {
    xs: { px: 44, svgSize: 100, classNames: 'w-11 h-11' },
    sm: { px: 64, svgSize: 100, classNames: 'w-16 h-16' },
    md: { px: 96, svgSize: 100, classNames: 'w-24 h-24' },
    lg: { px: 160, svgSize: 100, classNames: 'w-36 h-36 sm:w-44 sm:h-44' },
    xl: { px: 220, svgSize: 100, classNames: 'w-48 h-48 sm:w-56 sm:h-56' }
  };
  const currentSize = sizeMap[size];

  // Persona Palette & Stylings
  const personaTheme = useMemo(() => {
    switch (persona) {
      case 'child':
        return {
          title: 'الطفل الداخلي',
          badge: '🌱 طفلي الداخلي',
          skinTone: '#FDE3C8',
          skinShadow: '#F8CCA5',
          hairColor: '#4A2E18',
          hairHighlight: '#684022',
          clothingMain: '#E88665', // Warm peach terracotta
          clothingAccent: '#8FAF9A',
          blush: '#FF9B9B',
          auraRing: isListening 
            ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-400/30' 
            : isSpeaking 
            ? 'ring-4 ring-[#E88665] shadow-lg shadow-[#E88665]/35' 
            : 'ring-3 ring-[#E88665]/40 shadow-md',
          glowGradient: 'from-amber-400/20 via-rose-300/15 to-emerald-400/20'
        };
      case 'father':
        return {
          title: 'الأب الداخلي',
          badge: '🛡️ الأب الداخلي',
          skinTone: '#EAC3A4',
          skinShadow: '#D8A782',
          hairColor: '#2B3130',
          hairHighlight: '#4B5554',
          clothingMain: '#243C31', // Deep noble pine
          clothingAccent: '#D4AF37', // Subtle warm gold
          blush: '#E59B80',
          auraRing: isListening 
            ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-400/30' 
            : isSpeaking 
            ? 'ring-4 ring-emerald-600 shadow-lg shadow-emerald-600/35' 
            : 'ring-3 ring-emerald-700/40 shadow-md',
          glowGradient: 'from-emerald-600/20 via-amber-500/15 to-stone-700/20'
        };
      case 'adult':
      default:
        return {
          title: 'الراشد المتزن',
          badge: '🌿 الراشد المتزن',
          skinTone: '#F6D5B8',
          skinShadow: '#E6BA95',
          hairColor: '#2C3A33',
          hairHighlight: '#3E5349',
          clothingMain: '#355C4A', // Nesmat signature emerald
          clothingAccent: '#8FAF9A',
          blush: '#EFA694',
          auraRing: isListening 
            ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-400/30' 
            : isSpeaking 
            ? 'ring-4 ring-[#355C4A] shadow-lg shadow-[#355C4A]/35' 
            : 'ring-3 ring-[#355C4A]/40 shadow-md',
          glowGradient: 'from-emerald-500/20 via-teal-400/15 to-amber-300/20'
        };
    }
  }, [persona, isListening, isSpeaking]);

  // Eyebrow geometry based on expression
  const { left: leftBrowPath, right: rightBrowPath } = useMemo(() => {
    switch (effectiveExpression) {
      case 'listening':
        return { left: 'M 32 38 Q 40 33 48 37', right: 'M 52 37 Q 60 33 68 38' };
      case 'thinking':
        return { left: 'M 32 36 Q 40 31 48 35', right: 'M 52 40 Q 60 38 68 41' };
      case 'empathy':
        return { left: 'M 32 39 Q 40 35 48 39', right: 'M 52 39 Q 60 35 68 39' };
      case 'encouraging':
        return { left: 'M 32 36 Q 40 31 48 36', right: 'M 52 36 Q 60 31 68 36' };
      case 'speaking':
        return { left: 'M 32 36 Q 40 32 48 37', right: 'M 52 37 Q 60 32 68 36' };
      case 'welcome':
      default:
        return { left: 'M 32 37 Q 40 34 48 38', right: 'M 52 38 Q 60 34 68 37' };
    }
  }, [effectiveExpression]);

  // Mouth Path Morphing for Viseme Lip-Sync (Pure SVG Paths)
  const mouthPath = useMemo(() => {
    if (isSpeaking) {
      switch (visemeIndex) {
        case 1: // Open A/O
          return 'M 42 66 Q 50 63 58 66 Q 58 75 50 75 Q 42 75 42 66 Z';
        case 2: // Mid E
          return 'M 41 67 Q 50 64 59 67 Q 59 72 50 72 Q 41 72 41 67 Z';
        case 3: // Wide I/smile
          return 'M 39 67 Q 50 65 61 67 Q 58 74 50 74 Q 42 74 39 67 Z';
        case 4: // Round O/U
          return 'M 45 66 Q 50 63 55 66 Q 55 74 50 74 Q 45 74 45 66 Z';
        case 0:
        default: // Soft closed
          return 'M 42 67 Q 50 69 58 67';
      }
    }

    // Static Resting Expression Smiles
    switch (effectiveExpression) {
      case 'encouraging':
        return 'M 40 66 Q 50 76 60 66';
      case 'thinking':
        return 'M 43 68 Q 50 66 57 68';
      case 'listening':
        return 'M 41 67 Q 50 71 59 67';
      case 'empathy':
        return 'M 41 66 Q 50 73 59 66';
      case 'welcome':
      default:
        return 'M 41 66 Q 50 73 59 66';
    }
  }, [isSpeaking, visemeIndex, effectiveExpression]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none group ${className}`}>
      
      {/* Floating Sparkles for Encouraging / Speaking */}
      {isAnimatedMode && (effectiveExpression === 'encouraging' || isSpeaking) && (
        <div className="absolute -top-2.5 -right-1 text-amber-300 animate-bounce pointer-events-none z-20">
          <Sparkles className="w-4 h-4 drop-shadow-md text-amber-400" />
        </div>
      )}

      {/* Main Avatar Character Canvas / Rig */}
      <div 
        className={`relative ${currentSize.classNames} rounded-full overflow-hidden transition-all duration-500 ease-out bg-gradient-to-b from-[#FDFBF7] to-[#F2EFEB] dark:from-[#1C2521] dark:to-[#121A16] ${personaTheme.auraRing}`}
        style={{
          transform: isAnimatedMode ? `rotate(${headTilt}deg) translateY(${chestBreathing}px)` : 'none'
        }}
      >
        {/* Ambient Gradient Glow Background */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${personaTheme.glowGradient} opacity-60 pointer-events-none`} />

        {/* Pure Animated Vector Character Rig (SVG) */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full object-cover transition-transform duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Gradient */}
            <linearGradient id={`skinGrad-${persona}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={personaTheme.skinTone} />
              <stop offset="100%" stopColor={personaTheme.skinShadow} />
            </linearGradient>

            {/* Hair Gradient */}
            <linearGradient id={`hairGrad-${persona}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={personaTheme.hairHighlight} />
              <stop offset="100%" stopColor={personaTheme.hairColor} />
            </linearGradient>

            {/* Clothes Gradient */}
            <linearGradient id={`clothGrad-${persona}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={personaTheme.clothingAccent} />
              <stop offset="40%" stopColor={personaTheme.clothingMain} />
              <stop offset="100%" stopColor="#1B2822" />
            </linearGradient>

            {/* Soft Shadow Filter */}
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Torso / Shoulders with Breathing Animation */}
          <g 
            style={{ 
              transform: isAnimatedMode ? `translateY(${-chestBreathing * 0.8}px)` : 'none',
              transformOrigin: '50% 90%'
            }}
          >
            {/* Base Clothing Torso */}
            <path
              d="M 20 86 C 24 76, 32 72, 42 74 L 50 76 L 58 74 C 68 72, 76 76, 80 86 C 82 92, 82 100, 82 100 L 18 100 C 18 100, 18 92, 20 86 Z"
              fill={`url(#clothGrad-${persona})`}
            />

            {/* Persona Collar / Identity Accents */}
            {persona === 'child' ? (
              // Cute hoodie drawstring / collar
              <path
                d="M 40 76 Q 50 84 60 76"
                stroke="#FFE1D6"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            ) : persona === 'father' ? (
              // Wise protective cloak trim
              <>
                <path
                  d="M 38 75 L 50 88 L 62 75"
                  stroke="#E8C967"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="88" r="2" fill="#E8C967" />
              </>
            ) : (
              // Adult calm balanced modern v-neck collar
              <path
                d="M 42 75 L 50 83 L 58 75"
                stroke="#C5DBCB"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Neck */}
          <path
            d="M 44 64 L 44 76 Q 50 78 56 76 L 56 64 Z"
            fill={personaTheme.skinShadow}
          />

          {/* Head & Face Group */}
          <g>
            {/* Ears */}
            <circle cx="28" cy="51" r="5" fill={personaTheme.skinShadow} />
            <circle cx="72" cy="51" r="5" fill={personaTheme.skinShadow} />

            {/* Face Shape */}
            <path
              d={persona === 'child'
                ? "M 30 46 C 30 33, 40 28, 50 28 C 60 28, 70 33, 70 46 C 70 59, 62 67, 50 67 C 38 67, 30 59, 30 46 Z"
                : "M 31 46 C 31 32, 40 27, 50 27 C 60 27, 69 32, 69 46 C 69 60, 61 68, 50 68 C 39 68, 31 60, 31 46 Z"
              }
              fill={`url(#skinGrad-${persona})`}
              filter="url(#softShadow)"
            />

            {/* Soft Cheeks / Blush */}
            <ellipse cx="37" cy="54" rx="4.5" ry="2.5" fill={personaTheme.blush} opacity={persona === 'child' ? "0.55" : "0.35"} />
            <ellipse cx="63" cy="54" rx="4.5" ry="2.5" fill={personaTheme.blush} opacity={persona === 'child' ? "0.55" : "0.35"} />

            {/* Eyebrows */}
            <path
              d={leftBrowPath}
              stroke={personaTheme.hairColor}
              strokeWidth={persona === 'father' ? "3" : "2.4"}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={rightBrowPath}
              stroke={personaTheme.hairColor}
              strokeWidth={persona === 'father' ? "3" : "2.4"}
              strokeLinecap="round"
              fill="none"
            />

            {/* Eyes & Blinking Animation */}
            {isBlinking ? (
              // Natural Closed Blink Arcs
              <g>
                <path d="M 36 47 Q 41 50 46 47" stroke={personaTheme.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 54 47 Q 59 50 64 47" stroke={personaTheme.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              // Open Living Expressive Eyes
              <g>
                {/* Left Eye */}
                <ellipse cx="41" cy="47" rx={persona === 'child' ? "4.5" : "4"} ry={persona === 'child' ? "5.5" : "4.8"} fill="#FFFFFF" />
                <circle cx={41 + eyeShiftX * 0.4} cy={47 + eyeShiftY * 0.4} r={persona === 'child' ? "3.2" : "2.8"} fill={persona === 'father' ? "#253D32" : "#1B2A22"} />
                {/* Pupil Light Glint */}
                <circle cx={40 + eyeShiftX * 0.3} cy={45 + eyeShiftY * 0.3} r="1.2" fill="#FFFFFF" />
                <circle cx={42.5 + eyeShiftX * 0.3} cy={48 + eyeShiftY * 0.3} r="0.6" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="59" cy="47" rx={persona === 'child' ? "4.5" : "4"} ry={persona === 'child' ? "5.5" : "4.8"} fill="#FFFFFF" />
                <circle cx={59 + eyeShiftX * 0.4} cy={47 + eyeShiftY * 0.4} r={persona === 'child' ? "3.2" : "2.8"} fill={persona === 'father' ? "#253D32" : "#1B2A22"} />
                {/* Pupil Light Glint */}
                <circle cx={58 + eyeShiftX * 0.3} cy={45 + eyeShiftY * 0.3} r="1.2" fill="#FFFFFF" />
                <circle cx={60.5 + eyeShiftX * 0.3} cy={48 + eyeShiftY * 0.3} r="0.6" fill="#FFFFFF" />
              </g>
            )}

            {/* Nose */}
            <path
              d={persona === 'child' ? "M 50 52 Q 51 54 49 55" : "M 50 50 Q 51.5 54 49 55"}
              stroke={personaTheme.skinShadow}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mouth Rig with Syllabic Lip-Sync */}
            <path
              d={mouthPath}
              stroke={isSpeaking ? '#873426' : '#9E5B4B'}
              strokeWidth={isSpeaking ? "1.5" : "2.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={isSpeaking ? (visemeIndex > 0 ? '#B24536' : 'none') : 'none'}
            />

            {/* Persona Hair Styles */}
            {persona === 'child' ? (
              // Child's friendly hair tuft + sprouted green leaf of hope 🌱
              <g>
                <path
                  d="M 28 42 C 26 28, 38 22, 50 22 C 62 22, 74 28, 72 42 C 68 34, 60 30, 50 30 C 40 30, 32 34, 28 42 Z"
                  fill={`url(#hairGrad-${persona})`}
                />
                {/* Cute Sprout 🌱 on head */}
                <g style={{ transform: isAnimatedMode ? `rotate(${Math.sin((breathTick * Math.PI) / 15) * 6}deg)` : 'none', transformOrigin: '50% 22%' }}>
                  <path d="M 50 22 Q 47 16 43 17 Q 44 21 50 22" fill="#52B788" />
                  <path d="M 50 22 Q 53 14 58 16 Q 56 21 50 22" fill="#74C69D" />
                  <line x1="50" y1="22" x2="50" y2="18" stroke="#40916C" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </g>
            ) : persona === 'father' ? (
              // Father's noble distinguished styled hair + wise beard line
              <g>
                <path
                  d="M 27 44 C 26 26, 38 20, 50 20 C 62 20, 74 26, 73 44 C 70 32, 60 26, 50 26 C 40 26, 30 32, 27 44 Z"
                  fill={`url(#hairGrad-${persona})`}
                />
                {/* Sideburns */}
                <path d="M 29 42 L 29 52 Q 31 52 32 46 Z" fill={`url(#hairGrad-${persona})`} />
                <path d="M 71 42 L 71 52 Q 69 52 68 46 Z" fill={`url(#hairGrad-${persona})`} />
                {/* Neat dignified goatee / beard contour */}
                <path d="M 46 68 Q 50 71 54 68" stroke={personaTheme.hairColor} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
              </g>
            ) : (
              // Adult's balanced, serene modern botanical hair
              <g>
                <path
                  d="M 28 42 C 26 28, 38 22, 50 22 C 62 22, 74 28, 72 42 C 67 33, 58 28, 50 28 C 42 28, 33 33, 28 42 Z"
                  fill={`url(#hairGrad-${persona})`}
                />
                {/* Graceful soft lock */}
                <path d="M 33 33 Q 42 36 46 40" stroke={personaTheme.hairHighlight} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
              </g>
            )}
          </g>

          {/* Listening Pulsing Audio Rings inside SVG */}
          {isListening && (
            <circle cx="50" cy="50" r="47" stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0.5" className="animate-ping" />
          )}
        </svg>

        {/* Listening / Speaking Live Atmosphere Overlay */}
        {isAnimatedMode && (
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              isListening ? 'bg-emerald-500/10' :
              isSpeaking ? 'bg-[#355C4A]/10' :
              effectiveExpression === 'empathy' ? 'bg-rose-500/10' :
              effectiveExpression === 'thinking' ? 'bg-amber-500/10' :
              effectiveExpression === 'encouraging' ? 'bg-amber-400/10' :
              'bg-transparent'
            }`}
          />
        )}
      </div>

      {/* Living State Badge (Only shown on md, lg, xl sizes) */}
      {(size === 'md' || size === 'lg' || size === 'xl') && (
        <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#1A231F]/95 border border-[#E8DDCC] dark:border-stone-700 shadow-xs text-xs font-bold text-[#26332D] dark:text-[#E8DDCC] backdrop-blur-xs transition-all">
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300">يستمع لصوتك باهتمام...</span>
            </>
          ) : isSpeaking ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-pulse" />
              <Volume2 className="w-3.5 h-3.5 text-[#355C4A] dark:text-emerald-400" />
              <span className="text-[#355C4A] dark:text-emerald-300">يتحدث معك الآن...</span>
            </>
          ) : effectiveExpression === 'thinking' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="text-amber-700 dark:text-amber-400">يتأمل ويفكر معك...</span>
            </>
          ) : effectiveExpression === 'empathy' ? (
            <>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span className="text-rose-700 dark:text-rose-300">يشعر بك ويحتضن مشاعرك</span>
            </>
          ) : effectiveExpression === 'encouraging' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[#355C4A] dark:text-emerald-300">يشجعك ويساند خطواتك</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[#52645B] dark:text-stone-300">حاضر معك في رحلتك</span>
            </>
          )}
        </div>
      )}

      {/* Persona Switch / Animation Mode Controls */}
      {(size === 'lg' || size === 'xl') && onTogglePersona && (
        <div className="mt-2 flex items-center gap-2 text-[11px] text-[#52645B] dark:text-stone-400">
          <button
            onClick={onTogglePersona}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-stone-800 hover:bg-[#E8DDCC]/50 dark:hover:bg-stone-700 border border-[#E8DDCC] dark:border-stone-700 transition-colors cursor-pointer"
            title="تبديل الجانب النفسي (الراشد / الطفل / الأب)"
          >
            <RefreshCw className="w-3 h-3 text-[#355C4A] dark:text-emerald-400" />
            <span>{personaTheme.badge}</span>
          </button>

          {allowAnimationToggle && (
            <button
              onClick={handleToggleAnimated}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                isAnimatedMode 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' 
                  : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
              }`}
            >
              {isAnimatedMode ? <Eye className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
              <span>{isAnimatedMode ? 'حركة حية' : 'ثابت'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
