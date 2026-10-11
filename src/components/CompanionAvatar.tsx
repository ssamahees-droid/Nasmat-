import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Volume2, Mic, Bot, Heart, RefreshCw, ZapOff } from 'lucide-react';

export type CompanionExpression = 'welcome' | 'listening' | 'thinking' | 'empathy' | 'encouraging' | 'speaking';
export type CompanionPersona = 'adult' | 'child';

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
  onToggleAnimation
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

  // Natural blink loop
  useEffect(() => {
    if (!isAnimatedMode) return;
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isAnimatedMode]);

  // Mouth movement synchronization when speaking
  useEffect(() => {
    if (!isSpeaking || !isAnimatedMode) {
      setMouthOpen(0);
      return;
    }

    const mouthInterval = setInterval(() => {
      // Natural speech syllabic mouth rhythm
      const targetMouth = Math.random() > 0.3 ? 0.3 + Math.random() * 0.7 : 0.1;
      setMouthOpen(targetMouth);
    }, 120);

    return () => {
      clearInterval(mouthInterval);
      setMouthOpen(0);
    };
  }, [isSpeaking, isAnimatedMode]);

  // Expression-based subtle head tilt & motion
  useEffect(() => {
    if (!isAnimatedMode) {
      setHeadTilt(0);
      return;
    }

    if (expression === 'listening') {
      setHeadTilt(3); // slight inquisitive tilt
    } else if (expression === 'empathy') {
      setHeadTilt(-4); // comforting tilt
    } else if (expression === 'thinking') {
      setHeadTilt(-2);
    } else {
      setHeadTilt(0);
    }
  }, [expression, isAnimatedMode]);

  const avatarSrc = persona === 'child' 
    ? '/images/companion_child.jpg' 
    : '/images/companion_adult.jpg';

  const avatarName = persona === 'child'
    ? 'رفيق الطفل الداخلي'
    : 'الرفيق البشري';

  // Dimension classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    xl: 'w-48 h-48 sm:w-56 sm:h-56'
  }[size];

  // Halo glowing border based on state
  const getGlowBorder = () => {
    if (isListening) return 'ring-4 ring-emerald-500/60 shadow-lg shadow-emerald-500/20 animate-pulse';
    if (isSpeaking) return 'ring-4 ring-[#355C4A]/80 shadow-lg shadow-[#355C4A]/25';
    if (expression === 'thinking') return 'ring-4 ring-amber-400/60 shadow-lg shadow-amber-400/20';
    if (expression === 'empathy') return 'ring-4 ring-rose-400/50 shadow-lg shadow-rose-400/20';
    if (expression === 'encouraging') return 'ring-4 ring-[#8FAF9A] shadow-lg shadow-[#8FAF9A]/30';
    return 'ring-2 ring-[#E8DDCC]';
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer Glow Halo Ring */}
      <div 
        className={`relative ${sizeClasses} rounded-full overflow-hidden transition-all duration-700 ease-out bg-[#FAF7F0] ${getGlowBorder()}`}
        style={{
          transform: isAnimatedMode ? `rotate(${headTilt}deg)` : 'none'
        }}
      >
        {/* Base Photorealistic Character Image or Fallback */}
        {!imgLoadError ? (
          <img
            src={avatarSrc}
            alt={avatarName}
            onError={() => setImgLoadError(true)}
            className={`w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 ${
              isAnimatedMode && isSpeaking ? 'scale-105' : 'scale-100'
            } ${isAnimatedMode && isListening ? 'scale-102' : ''}`}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-b from-[#8FAF9A]/30 to-[#355C4A]/20 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl">{persona === 'child' ? '🌱' : '🌿'}</span>
            <span className="text-xs font-bold text-[#355C4A] mt-1">{avatarName}</span>
          </div>
        )}

        {/* Breathing / Ambient Light Shimmer Overlay */}
        {isAnimatedMode && (
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              isListening ? 'bg-emerald-500/10' :
              isSpeaking ? 'bg-[#355C4A]/10' :
              expression === 'empathy' ? 'bg-rose-500/10' :
              expression === 'thinking' ? 'bg-amber-500/10' :
              'bg-transparent'
            }`}
          />
        )}

        {/* Natural Blink Overlay (Smooth darkening of eyelids) */}
        {isAnimatedMode && blink && (
          <div className="absolute inset-0 bg-stone-900/40 pointer-events-none transition-all duration-100 backdrop-blur-[0.5px]" />
        )}

        {/* Mouth speaking indicator (Organic acoustic lip-sync micro-shimmer) */}
        {isAnimatedMode && isSpeaking && mouthOpen > 0.1 && (
          <div 
            className="absolute bottom-[23%] left-[44%] right-[44%] h-[7%] rounded-full bg-stone-800/60 pointer-events-none blur-[0.6px] transition-all duration-100"
            style={{
              transform: `scaleY(${1 + mouthOpen * 1.5}) scaleX(${1 + mouthOpen * 0.4})`,
              opacity: 0.55 + mouthOpen * 0.35
            }}
          />
        )}

        {/* Listening micro-radar waves */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30 pointer-events-none" />
        )}
      </div>

      {/* Floating State Badge */}
      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8DDCC] shadow-xs text-xs font-medium text-[#26332D]">
        {isListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">يستمع إليك الآن...</span>
          </>
        ) : isSpeaking ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-pulse" />
            <Volume2 className="w-3.5 h-3.5 text-[#355C4A]" />
            <span className="text-[#355C4A] font-bold">يتحدث معك...</span>
          </>
        ) : expression === 'thinking' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
            <span className="text-amber-700 font-medium">يفكر بتمعن...</span>
          </>
        ) : expression === 'empathy' ? (
          <>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span className="text-rose-700 font-medium">يشعر بك ويتعاطف معك</span>
          </>
        ) : expression === 'encouraging' ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[#355C4A] font-medium">يشجعك ويساندك</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[#52645B]">جاهز للإنصات والحديث</span>
          </>
        )}
      </div>

      {/* Compact Controls: Persona Switch & Animation Toggle */}
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[#52645B]">
        {onTogglePersona && (
          <button
            onClick={onTogglePersona}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F0] hover:bg-[#E8DDCC]/50 border border-[#E8DDCC] transition-colors cursor-pointer"
            title="التبديل بين رفيق الطفل الداخلي والرفيق البشري"
          >
            <RefreshCw className="w-3 h-3 text-[#355C4A]" />
            <span>{persona === 'child' ? 'التبديل للرفيق البالغ' : 'التبديل لرفيق الطفل الداخلي'}</span>
          </button>
        )}

        {allowAnimationToggle && (
          <button
            onClick={handleToggleAnimated}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
              isAnimatedMode 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
            title={isAnimatedMode ? 'تعطيل الحركة (وضع الصورة الثابتة الخفيف)' : 'تفعيل الحركة الحية'}
          >
            {isAnimatedMode ? (
              <>
                <Eye className="w-3 h-3" />
                <span>حركة تفاعلية</span>
              </>
            ) : (
              <>
                <ZapOff className="w-3 h-3" />
                <span>صورة ثابتة</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
