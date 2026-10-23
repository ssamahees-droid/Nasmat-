import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  Heart, 
  Moon, 
  Sparkles, 
  Activity, 
  Smile,
  ShieldCheck,
  ChevronRight,
  Compass,
  Clock
} from 'lucide-react';
import { INITIAL_BREATHING_SESSIONS } from '../data/initialData';
import { BreathingSession, BreathingPhase } from '../types';
import { ambientSound, SoundChannelId } from '../utils/audioSynth';
import { storage } from '../services/storage';

import { ScreenBannerHeader } from '../components/ScreenBannerHeader';
import { useLanguage } from '../context/LanguageContext';

interface BreatheScreenProps {
  onSessionFinished?: () => void;
  onOpenMusicLounge?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenAllScreens?: () => void;
}

export const BreatheScreen: React.FC<BreatheScreenProps> = ({
  onSessionFinished,
  onOpenMusicLounge,
  onNavigate,
  onOpenAllScreens
}) => {
  const { t, language, isRTL } = useLanguage();
  const sessions = INITIAL_BREATHING_SESSIONS;
  const [selectedSession, setSelectedSession] = useState<BreathingSession>(sessions[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(selectedSession.instructions[0].seconds);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [soundMode, setSoundMode] = useState<SoundChannelId>('waves');
  const [showPostFeedback, setShowPostFeedback] = useState(false);
  const [postFeeling, setPostFeeling] = useState<string | null>(null);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const totalSessionSeconds = selectedSession.durationMinutes * 60;
  const currentInstruction = selectedSession.instructions[currentPhaseIndex];
  const phaseTotalSeconds = currentInstruction.seconds;
  const sessionSecondsRemaining = Math.max(0, totalSessionSeconds - totalSecondsElapsed);
  const sessionProgressPercent = Math.min(100, Math.round((totalSecondsElapsed / totalSessionSeconds) * 100));

  // Track animation trigger for CSS scale transition
  const [orbScaleState, setOrbScaleState] = useState<'idle' | 'inhale' | 'hold' | 'exhale' | 'rest'>('idle');

  // Stop ambient sound on unmount
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  // Reset counters when switching session
  useEffect(() => {
    ambientSound.stop();
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(selectedSession.instructions[0].seconds);
    setTotalSecondsElapsed(0);
    setCyclesCompleted(0);
    setShowPostFeedback(false);
    setPostFeeling(null);
    setOrbScaleState('idle');
  }, [selectedSession]);

  // Synchronize the CSS expansion and contraction with phase change
  useEffect(() => {
    if (!isActive) {
      setOrbScaleState('idle');
      return;
    }

    const phase = currentInstruction.phase;
    setOrbScaleState(phase as any);
  }, [isActive, currentPhaseIndex, currentInstruction.phase]);

  // Breathing loop timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive) {
      timer = setInterval(() => {
        setTotalSecondsElapsed(prev => {
          if (prev + 1 >= totalSessionSeconds) {
            handleCompleteSession();
            return totalSessionSeconds;
          }
          return prev + 1;
        });

        setPhaseSecondsLeft(prevSec => {
          if (prevSec <= 1) {
            // Advance to next breathing phase
            const nextIdx = (currentPhaseIndex + 1) % selectedSession.instructions.length;
            if (nextIdx === 0) {
              setCyclesCompleted(c => c + 1);
            }
            if (chimeEnabled) {
              // Gentle singing bowl chime on transition
              ambientSound.playSingingBowlChime(nextIdx === 0 ? 528 : 432);
            }
            setCurrentPhaseIndex(nextIdx);
            return selectedSession.instructions[nextIdx].seconds;
          }
          return prevSec - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, currentPhaseIndex, selectedSession, totalSessionSeconds, chimeEnabled]);

  const handleToggleActive = () => {
    if (isActive) {
      ambientSound.stop();
      setIsActive(false);
      setOrbScaleState('idle');
    } else {
      ambientSound.playAmbient(soundMode, 0.35);
      setIsActive(true);
      setOrbScaleState(currentInstruction.phase as any);
    }
  };

  const handleCompleteSession = () => {
    ambientSound.stop();
    setIsActive(false);
    setOrbScaleState('idle');
    setShowPostFeedback(true);
  };

  const handlePostFeelingSelect = (feeling: string) => {
    setPostFeeling(feeling);
    storage.addNote(`أتممت تمرين «${selectedSession.title}». شعوري بعد الجلسة: ${feeling}`);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Circular progress timer calculations
  // Radius = 115, Circumference = 2 * PI * 115 ≈ 722.56
  const R = 115;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const progressRatio = isActive ? Math.max(0, Math.min(1, phaseSecondsLeft / phaseTotalSeconds)) : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progressRatio);

  // Dynamic CSS scale styling for smooth expansion and contraction
  const getOrbInlineStyle = (): React.CSSProperties => {
    if (!isActive || orbScaleState === 'idle') {
      return {
        transform: 'scale(1)',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      };
    }

    if (orbScaleState === 'inhale') {
      return {
        transform: 'scale(1.36)',
        transition: `transform ${phaseTotalSeconds}s cubic-bezier(0.4, 0.0, 0.2, 1)`
      };
    }

    if (orbScaleState === 'hold') {
      return {
        transform: 'scale(1.36)',
        transition: 'transform 0.3s ease-out'
      };
    }

    if (orbScaleState === 'exhale') {
      return {
        transform: 'scale(0.85)',
        transition: `transform ${phaseTotalSeconds}s cubic-bezier(0.4, 0.0, 0.2, 1)`
      };
    }

    // rest
    return {
      transform: 'scale(0.88)',
      transition: `transform ${phaseTotalSeconds}s ease-in-out`
    };
  };

  // Phase color theme config
  const getPhaseTheme = () => {
    const isEn = language === 'en';
    switch (currentInstruction.phase) {
      case 'inhale':
        return {
          title: isEn ? 'Inhale ... Expansion & Fill' : 'شهيق ... امتداد وتوسع',
          subtitle: isEn ? 'Fill your lungs gently & softly' : 'املأ رئتيك بهدوء ولطف',
          ringColor: '#10B981',
          bgGradient: 'from-emerald-500/30 via-teal-500/20 to-emerald-700/25',
          glowColor: 'rgba(16, 185, 129, 0.45)',
          badgeBg: 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30',
          icon: '🌬️'
        };
      case 'hold':
        return {
          title: isEn ? 'Hold ... Stillness & Calm' : 'حبس النفس ... ثبات وسكون',
          subtitle: isEn ? 'Retain air and feel serenity' : 'احتفظ بالهواء واستشعر الهدوء',
          ringColor: '#F59E0B',
          bgGradient: 'from-amber-500/30 via-yellow-500/20 to-amber-700/25',
          glowColor: 'rgba(245, 158, 11, 0.45)',
          badgeBg: 'bg-amber-500/20 text-amber-900 border-amber-500/30',
          icon: '🧘'
        };
      case 'exhale':
        return {
          title: isEn ? 'Exhale ... Release & Let Go' : 'زفير ... تحرر وتفريغ',
          subtitle: isEn ? 'Release all tension and burden slowly' : 'أخرج كل التوتر والأثقال ببطء',
          ringColor: '#06B6D4',
          bgGradient: 'from-sky-500/30 via-teal-500/20 to-cyan-700/25',
          glowColor: 'rgba(6, 182, 212, 0.45)',
          badgeBg: 'bg-cyan-500/20 text-cyan-900 border-cyan-500/30',
          icon: '💨'
        };
      case 'rest':
      default:
        return {
          title: isEn ? 'Rest ... Soft Recovery' : 'راحة ... استرخاء وسكينة',
          subtitle: isEn ? 'Relax completely for the next cycle' : 'استرخِ تماماً واستعد للدورة القادمة',
          ringColor: '#A9C5A0',
          bgGradient: 'from-[#A9C5A0]/30 via-[#174C3C]/20 to-[#A9C5A0]/25',
          glowColor: 'rgba(169, 197, 160, 0.35)',
          badgeBg: 'bg-stone-500/15 text-[#174C3C] border-[#A9C5A0]/40',
          icon: '🌿'
        };
    }
  };

  const phaseTheme = getPhaseTheme();

  return (
    <div 
      className={`pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      
      {onNavigate && (
        <ScreenBannerHeader 
          screenId="breathe" 
          onNavigate={onNavigate} 
          onOpenAllScreens={onOpenAllScreens} 
        />
      )}

      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#174C3C]/10 border border-[#174C3C]/20 rounded-full text-xs font-bold text-[#174F3F]">
          <Wind className="w-3.5 h-3.5" />
          <span>
            {language === 'en' 
              ? 'Vagus Nerve Soothing Breathwork' 
              : 'تمرين التنفس البصري المهدئ للعصب الحائر'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174F3F]">
          {language === 'en' ? 'Take a Breath ... 🍃' : 'خد نفس ... 🍃'}
        </h1>
        <p className="text-base font-bold text-[#23785B]">
          {language === 'en' 
            ? 'You do not have to solve everything right now; breathe and let your mind rest.' 
            : 'مش لازم تحل كل حاجة دلوقتي؛ تنفس وسيب عقلك يرتاح.'}
        </p>
      </div>

      {/* Sessions Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sessions.map((sess) => {
          const isSelected = selectedSession.id === sess.id;
          return (
            <button
              key={sess.id}
              onClick={() => setSelectedSession(sess)}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[90px] cursor-pointer ${
                isSelected
                  ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm scale-101'
                  : 'bg-[#F7F3E9] text-[#26332D] border-[#E6E8D8] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg">{sess.icon}</span>
                <span className={`text-[11px] font-mono ${isSelected ? 'text-[#E6E8D8]' : 'text-[#7D8F85]'}`}>
                  {sess.durationMinutes} دقائق
                </span>
              </div>
              <div className="font-bold text-xs mt-2 leading-tight">
                {sess.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Breathing Stage with CSS-Animated Expanding/Contracting Circle */}
      <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
        
        {/* Background Ripple & Atmosphere */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            src="/src/assets/images/calm_breathe_zen_1791037470270.jpg"
            alt="سكينة"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Concentric Ambient Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Ring 1 - Outer Pulsing Halo */}
          <div 
            className={`w-72 h-72 sm:w-84 sm:h-84 rounded-full border border-emerald-500/20 transition-all duration-1000 ${
              isActive && orbScaleState === 'inhale' ? 'scale-125 opacity-40' : 'scale-100 opacity-15'
            }`} 
          />
          {/* Ring 2 - Ripple Wave */}
          <div 
            className={`absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-teal-500/30 transition-all duration-700 ${
              isActive ? 'animate-breathe-ripple' : 'opacity-0'
            }`} 
          />
        </div>

        {/* 🌬️ The Expanding & Contracting Visual Breathing Timer */}
        <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-6 select-none">
          
          {/* SVG Circular Countdown Progress Ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20"
            viewBox="0 0 260 260"
          >
            {/* Background Track Circle */}
            <circle
              cx="130"
              cy="130"
              r={R}
              fill="none"
              stroke="#E6E8D8"
              strokeWidth="5"
              strokeOpacity="0.6"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="130"
              cy="130"
              r={R}
              fill="none"
              stroke={phaseTheme.ringColor}
              strokeWidth="6"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              style={{
                filter: `drop-shadow(0 0 8px ${phaseTheme.glowColor})`
              }}
            />
          </svg>

          {/* Central CSS-Animated Breathing Circle (Expands on Inhale, Holds, Contracts on Exhale) */}
          <div 
            style={getOrbInlineStyle()}
            className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr ${phaseTheme.bgGradient} backdrop-blur-md flex items-center justify-center shadow-2xl relative ${
              !isActive ? 'animate-breathe-idle' : (orbScaleState === 'hold' ? 'animate-breathe-shimmer' : '')
            }`}
          >
            {/* Inner Core Surface */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#F7F3E9]/95 border-2 border-white/80 shadow-inner flex flex-col items-center justify-center text-center p-2.5 transition-colors duration-500">
              
              {/* Phase Badge & Emoji */}
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border mb-0.5 flex items-center gap-1 ${phaseTheme.badgeBg}`}>
                <span>{phaseTheme.icon}</span>
                <span>{isActive ? currentInstruction.label : (language === 'en' ? 'Ready to Start' : 'جاهز للبدء')}</span>
              </span>

              {/* Countdown Numbers for current phase */}
              <span className="font-mono text-3xl sm:text-4xl font-black text-[#26332D] leading-none my-0.5 tracking-tight">
                {isActive ? phaseSecondsLeft : (language === 'en' ? 'Start' : 'ابدأ')}
              </span>

              {/* Subtitle guidance */}
              <span className="text-[9px] sm:text-[10px] text-[#52645B] font-medium leading-tight line-clamp-1 max-w-[125px]">
                {isActive ? phaseTheme.subtitle : (language === 'en' ? 'Tap play below' : 'اضغط زر التشغيل')}
              </span>

              {/* ⏱️ Subtle Session Remaining Timer & Progress Bar inside the breathing circle */}
              <div className="mt-1 pt-1 border-t border-[#E6E8D8]/90 flex flex-col items-center gap-0.5 w-24 sm:w-28">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-[#52645B] leading-none">
                  <Clock className="w-2.5 h-2.5 text-[#7D8F85] shrink-0" />
                  <span className="text-[8.5px] text-[#7D8F85]">
                    {isActive 
                      ? (language === 'en' ? 'Left:' : 'متبقي:') 
                      : (language === 'en' ? 'Total:' : 'المدة:')}
                  </span>
                  <span className="font-bold text-[#174C3C]">
                    {formatTimer(isActive ? sessionSecondsRemaining : totalSessionSeconds)}
                  </span>
                </div>

                {/* Subtle Mini Progress Bar for overall session progress */}
                <div 
                  className="w-full h-1 bg-[#E6E8D8] rounded-full overflow-hidden" 
                  title={`إنجاز الجلسة: ${sessionProgressPercent}%`}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${isActive ? sessionProgressPercent : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Timeline Breadcrumbs */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 mb-4 w-full max-w-md">
          {selectedSession.instructions.map((inst, idx) => {
            const isCurrent = currentPhaseIndex === idx;
            return (
              <div 
                key={idx}
                className={`flex-1 py-1 px-2 rounded-xl border text-center transition-all text-xs font-bold ${
                  isCurrent && isActive
                    ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-xs scale-102 ring-2 ring-emerald-400/40'
                    : 'bg-white/80 text-[#52645B] border-[#E6E8D8]'
                }`}
              >
                <div className="text-[10px] font-mono opacity-80">{inst.seconds}ث</div>
                <div className="text-[11px] truncate">{inst.label.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>

        {/* Session Info */}
        <div className="relative z-10 text-center space-y-1 mb-5">
          <h3 className="font-bold text-base text-[#26332D]">
            {selectedSession.title}
          </h3>
          <p className="text-xs text-[#52645B] max-w-sm mx-auto">
            {selectedSession.description}
          </p>
          <div className="font-mono text-xs text-[#7D8F85] pt-1">
            {formatTimer(totalSecondsElapsed)} / {formatTimer(totalSessionSeconds)}
          </div>
        </div>

        {/* Ambient Sound Selector */}
        <div className="relative z-10 w-full max-w-md mb-5 flex flex-wrap items-center justify-center gap-1.5 p-1 bg-stone-200/60 rounded-xl text-xs">
          {[
            { id: 'waves' as SoundChannelId, label: 'أمواج 🌊' },
            { id: 'rain' as SoundChannelId, label: 'مطر 🌧️' },
            { id: 'stream' as SoundChannelId, label: 'جدول 💧' },
            { id: 'birds' as SoundChannelId, label: 'طيور 🐦' },
            { id: 'forest' as SoundChannelId, label: 'غابة 🌲' },
            { id: 'breeze' as SoundChannelId, label: 'نسيم 🍃' }
          ].map(snd => (
            <button
              key={snd.id}
              onClick={() => {
                setSoundMode(snd.id);
                if (isActive) ambientSound.playAmbient(snd.id, 0.35);
              }}
              className={`py-1 px-2.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                soundMode === snd.id ? 'bg-[#174C3C] text-white shadow-2xs' : 'text-[#52645B] hover:text-[#26332D]'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {/* Omar Khairat Music Bridge */}
        {onOpenMusicLounge && (
          <button
            onClick={onOpenMusicLounge}
            className="relative z-10 mb-4 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <span>🎹 صالون موسيقى عمر خيرت للتهدئة</span>
          </button>
        )}

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              setTotalSecondsElapsed(0);
              setCurrentPhaseIndex(0);
              setCyclesCompleted(0);
              setPhaseSecondsLeft(selectedSession.instructions[0].seconds);
              setOrbScaleState('idle');
            }}
            className="p-3 text-[#52645B] hover:text-[#26332D] bg-white border border-[#E6E8D8] rounded-2xl transition-all cursor-pointer shadow-xs active:scale-95"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleActive}
            className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95 ${
              isActive 
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30' 
                : 'bg-[#174C3C] hover:bg-[#264235] shadow-[#174C3C]/25'
            }`}
            aria-label={isActive ? 'إيقاف مؤقت' : 'بدء التمرين'}
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 translate-x-0.5" />}
          </button>

          <button
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
              chimeEnabled 
                ? 'bg-amber-100/80 border-amber-300 text-amber-900' 
                : 'bg-white border-[#E6E8D8] text-stone-400'
            }`}
            title={chimeEnabled ? 'صوت جرس الانتقال مفعل' : 'صوت جرس الانتقال معطل'}
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        {/* Cycles Completed Counter */}
        {cyclesCompleted > 0 && (
          <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full border border-[#E6E8D8] text-xs font-mono text-[#174C3C] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>أكملت {cyclesCompleted} دورات تنفس كاملة 🌿</span>
          </div>
        )}

        {/* Post Activity Feeling Reflection */}
        {showPostFeedback && (
          <div className="mt-6 w-full max-w-sm p-4 bg-white/95 border border-[#A9C5A0]/50 rounded-2xl animate-fade-in text-center space-y-3 relative z-20 shadow-md">
            <div>
              <div className="font-bold text-sm text-[#26332D]">إيه إحساسك دلوقتي؟</div>
              <div className="text-[11px] text-[#7D8F85]">هذه ليست نتيجة طبية</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'أفضل 🌿', val: 'أفضل' },
                { label: 'زي ما أنا 😐', val: 'زي ما أنا' },
                { label: 'لسه متعب 🌧️', val: 'لسه متعب' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handlePostFeelingSelect(opt.val)}
                  className={`p-2 rounded-xl text-xs border font-medium transition-all cursor-pointer ${
                    postFeeling === opt.val
                      ? 'bg-[#174C3C] text-white border-[#174C3C]'
                      : 'bg-[#F7F3E9] border-[#E6E8D8] text-[#26332D] hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {postFeeling && (
              <div className="text-xs text-emerald-800 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم تسجيل مشاعرك في رحلتك بنجاح</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gentle reassurance */}
      <div className="p-4 bg-white/70 border border-[#E6E8D8] rounded-2xl text-xs text-[#52645B] leading-relaxed flex items-start gap-2.5 shadow-2xs">
        <Sparkles className="w-4 h-4 text-[#A9C5A0] shrink-0 mt-0.5" />
        <div>
          التنفس البطيء ينشط الجهاز العصبي اللاودي (العصب الحائر)، مما يساعد جسمك ودماغك على خفض هرمونات التوتر طبيعياً دون مجهود.
        </div>
      </div>
    </div>
  );
};
