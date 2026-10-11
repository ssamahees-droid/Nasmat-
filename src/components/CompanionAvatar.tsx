import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Volume2, Mic, Heart, RefreshCw, ZapOff, Compass } from 'lucide-react';

export type CompanionExpression = 'welcome' | 'listening' | 'thinking' | 'empathy' | 'encouraging' | 'speaking';
export type CompanionPersona = 'adult' | 'child' | 'father';

interface CompanionAvatarProps {
  persona: CompanionPersona;
  expression: CompanionExpression;
  isSpeaking: boolean;
  isListening: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onTogglePersona?: () => void;
  allowAnimationToggle?: boolean;
  isAnimated?: boolean;
  onToggleAnimation?: () => void;
  customPhoto?: string | null;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  persona,
  expression,
  isSpeaking,
  isListening,
  size = 'lg',
  onTogglePersona,
  allowAnimationToggle = true,
  isAnimated,
  onToggleAnimation,
  customPhoto
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

  const [mouthOpen, setMouthOpen] = useState<number>(0);
  const [blink, setBlink] = useState<boolean>(false);
  const [headTilt, setHeadTilt] = useState<number>(0);
  const [imgLoadError, setImgLoadError] = useState<boolean>(false);

  // Reset img error on persona change
  useEffect(() => {
    setImgLoadError(false);
  }, [persona]);

  // Natural blink loop (anime style gentle blink)
  useEffect(() => {
    if (!isAnimatedMode) return;
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3600 + Math.random() * 2200);

    return () => clearInterval(blinkInterval);
  }, [isAnimatedMode]);

  // Mouth movement synchronization when speaking (syllabic anime lip-sync)
  useEffect(() => {
    if (!isSpeaking || !isAnimatedMode) {
      setMouthOpen(0);
      return;
    }

    const mouthInterval = setInterval(() => {
      const targetMouth = Math.random() > 0.25 ? 0.35 + Math.random() * 0.65 : 0.1;
      setMouthOpen(targetMouth);
    }, 110);

    return () => {
      clearInterval(mouthInterval);
      setMouthOpen(0);
    };
  }, [isSpeaking, isAnimatedMode]);

  // Expression-based head tilt & micro-gestures
  useEffect(() => {
    if (!isAnimatedMode) {
      setHeadTilt(0);
      return;
    }

    if (expression === 'listening') {
      setHeadTilt(3.5); // Inquisitive attentive tilt
    } else if (expression === 'empathy') {
      setHeadTilt(-4.5); // Comforting compassionate tilt
    } else if (expression === 'thinking') {
      setHeadTilt(-2.5); // Thoughtful pondering tilt
    } else if (expression === 'encouraging') {
      setHeadTilt(2); // Uplifting tilt
    } else {
      setHeadTilt(0);
    }
  }, [expression, isAnimatedMode]);

  const avatarSrc = customPhoto || (persona === 'child' 
    ? '/images/companion_child.jpg' 
    : persona === 'father'
    ? '/assets/images/companion_adult_portrait_1791644375469.jpg'
    : '/images/companion_adult.jpg');

  const avatarName = persona === 'child'
    ? 'رفيق الطفل الداخلي'
    : persona === 'father'
    ? 'الأب الداخلي'
    : 'الرفيق البشري';

  // Dimension classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    xl: 'w-48 h-48 sm:w-56 sm:h-56'
  }[size];

  // Dynamic Aura Halo Border based on state & expression
  const getGlowBorder = () => {
    if (isListening) return 'ring-4 ring-emerald-500/70 shadow-xl shadow-emerald-500/25 animate-pulse';
    if (isSpeaking) return 'ring-4 ring-[#355C4A]/90 shadow-xl shadow-[#355C4A]/30';
    if (expression === 'thinking') return 'ring-4 ring-amber-400/70 shadow-xl shadow-amber-400/25';
    if (expression === 'empathy') return 'ring-4 ring-rose-400/60 shadow-xl shadow-rose-400/25';
    if (expression === 'encouraging') return 'ring-4 ring-[#8FAF9A] shadow-xl shadow-[#8FAF9A]/35';
    return 'ring-2 ring-[#E8DDCC] shadow-md';
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      
      {/* Floating Anime Sparkle Accents */}
      {isAnimatedMode && (expression === 'encouraging' || expression === 'empathy' || isSpeaking) && (
        <div className="absolute -top-3 -right-2 text-amber-300 animate-bounce pointer-events-none z-20">
          <Sparkles className="w-5 h-5 drop-shadow-md" />
        </div>
      )}

      {/* Main Avatar Halo Container */}
      <div 
        className={`relative ${sizeClasses} rounded-full overflow-hidden transition-all duration-700 ease-out bg-[#FAF7F0] ${getGlowBorder()}`}
        style={{
          transform: isAnimatedMode ? `rotate(${headTilt}deg) translateY(${isSpeaking ? '-2px' : '0px'})` : 'none'
        }}
      >
        {/* Avatar Image with Breathing & Motion Scaling */}
        {!imgLoadError ? (
          <img
            src={avatarSrc}
            alt={avatarName}
            onError={() => setImgLoadError(true)}
            className={`w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 ${
              isAnimatedMode && isSpeaking ? 'scale-108' : 
              isAnimatedMode && isListening ? 'scale-104' : 
              'scale-100 hover:scale-103'
            }`}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#8FAF9A]/30 to-[#355C4A]/20 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl">{persona === 'child' ? '🌱' : '🌿'}</span>
            <span className="text-xs font-bold text-[#355C4A] mt-1">{avatarName}</span>
          </div>
        )}

        {/* Dynamic Atmosphere Shimmer Overlay */}
        {isAnimatedMode && (
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              isListening ? 'bg-emerald-500/12' :
              isSpeaking ? 'bg-[#355C4A]/12' :
              expression === 'empathy' ? 'bg-rose-500/12' :
              expression === 'thinking' ? 'bg-amber-500/12' :
              expression === 'encouraging' ? 'bg-amber-400/10' :
              'bg-transparent'
            }`}
          />
        )}

        {/* Natural Anime Blink Shutter */}
        {isAnimatedMode && blink && (
          <div className="absolute inset-0 bg-stone-950/45 pointer-events-none transition-all duration-75 backdrop-blur-[0.75px]" />
        )}

        {/* Organic Lip-Sync Mouth Simulation */}
        {isAnimatedMode && isSpeaking && mouthOpen > 0.08 && (
          <div 
            className="absolute bottom-[22%] left-[43%] right-[43%] h-[8%] rounded-full bg-stone-900/65 pointer-events-none blur-[0.5px] transition-all duration-100"
            style={{
              transform: `scaleY(${1 + mouthOpen * 1.8}) scaleX(${1 + mouthOpen * 0.45})`,
              opacity: 0.6 + mouthOpen * 0.35
            }}
          />
        )}

        {/* Listening Radar Pulse Waves */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-40 pointer-events-none" />
        )}
      </div>

      {/* Living State Badge */}
      <div className="mt-3 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 dark:bg-[#1A231F]/95 border border-[#E8DDCC] dark:border-stone-700 shadow-xs text-xs font-bold text-[#26332D] dark:text-[#E8DDCC] backdrop-blur-xs">
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
        ) : expression === 'thinking' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
            <span className="text-amber-700 dark:text-amber-400">يتأمل ويفكر معك...</span>
          </>
        ) : expression === 'empathy' ? (
          <>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span className="text-rose-700 dark:text-rose-300">يشعر بك ويحتضن همومك</span>
          </>
        ) : expression === 'encouraging' ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[#355C4A] dark:text-emerald-300">يشجعك على الخطوة التالية</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[#52645B] dark:text-stone-300">حاضر معك ومصغٍ إليك</span>
          </>
        )}
      </div>

      {/* Controls: Persona Switch & Animation Toggle */}
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[#52645B] dark:text-stone-400">
        {onTogglePersona && (
          <button
            onClick={onTogglePersona}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-stone-800 hover:bg-[#E8DDCC]/50 dark:hover:bg-stone-700 border border-[#E8DDCC] dark:border-stone-700 transition-colors cursor-pointer"
            title="التبديل بين رفيق الطفل الداخلي والرفيق البشري"
          >
            <RefreshCw className="w-3 h-3 text-[#355C4A] dark:text-emerald-400" />
            <span>{persona === 'child' ? 'التبديل للرفيق البالغ' : 'التبديل لرفيق الطفل الداخلي'}</span>
          </button>
        )}

        {allowAnimationToggle && (
          <button
            onClick={handleToggleAnimated}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              isAnimatedMode 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' 
                : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
            }`}
            title={isAnimatedMode ? 'تعطيل الحركة الحية' : 'تفعيل الحركة الحية والتفاعل'}
          >
            {isAnimatedMode ? (
              <>
                <Eye className="w-3 h-3" />
                <span>حركة تفاعلية</span>
              </>
            ) : (
              <>
                <ZapOff className="w-3 h-3" />
                <span>وضع ثابت</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
