import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Heart, 
  Moon, 
  Sparkles, 
  Activity, 
  Smile,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_BREATHING_SESSIONS } from '../data/initialData';
import { BreathingSession } from '../types';
import { ambientSound, SoundChannelId } from '../utils/audioSynth';
import { storage } from '../services/storage';

interface BreatheScreenProps {
  onSessionFinished?: () => void;
}

export const BreatheScreen: React.FC<BreatheScreenProps> = () => {
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

  // Stop sound on unmount or session switch
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  useEffect(() => {
    // Reset counters when switching session
    ambientSound.stop();
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(selectedSession.instructions[0].seconds);
    setTotalSecondsElapsed(0);
    setCyclesCompleted(0);
    setShowPostFeedback(false);
    setPostFeeling(null);
  }, [selectedSession]);

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
              // Gentle chime sound on each breathing transition
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
    } else {
      ambientSound.playAmbient(soundMode, 0.4);
      setIsActive(true);
    }
  };

  const handleCompleteSession = () => {
    ambientSound.stop();
    setIsActive(false);
    setShowPostFeedback(true);
  };

  const handlePostFeelingSelect = (feeling: string) => {
    setPostFeeling(feeling);
    // Add note to journey
    storage.addNote(`أتممت تمرين «${selectedSession.title}». شعوري بعد الجلسة: ${feeling}`);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Phase scale animation
  const getOrbScale = () => {
    if (!isActive) return 'scale-100';
    if (currentInstruction.phase === 'inhale') return 'scale-130 transition-transform duration-4000 ease-out';
    if (currentInstruction.phase === 'hold') return 'scale-130 transition-transform duration-1000';
    if (currentInstruction.phase === 'exhale') return 'scale-90 transition-transform duration-4000 ease-in';
    return 'scale-95 transition-transform duration-2000';
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      
      {/* Header (Section 14 Spec) */}
      <div className="space-y-1 text-right">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26332D]">
          خد نفس ... 🍃
        </h1>
        <p className="text-base font-bold text-[#355C4A]">
          مش لازم تحل كل حاجة دلوقتي.
        </p>
      </div>

      {/* Sessions Selector (Section 14 & 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sessions.map((sess) => {
          const isSelected = selectedSession.id === sess.id;
          return (
            <button
              key={sess.id}
              onClick={() => setSelectedSession(sess)}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs'
                  : 'bg-[#FAF7F0] text-[#26332D] border-[#E8DDCC] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg">{sess.icon}</span>
                <span className={`text-[11px] font-mono ${isSelected ? 'text-[#E8DDCC]' : 'text-[#7D8F85]'}`}>
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

      {/* Main Breathing Orb Stage */}
      <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
        
        {/* Background Ambient Ripple Art */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src="/src/assets/images/calm_breathe_zen_1791037470270.jpg"
            alt="سكينة"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Breathing Orb */}
        <div className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center my-4">
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full border-2 border-[#8FAF9A]/30 ${isActive ? 'animate-ping opacity-25' : ''}`} />
          
          {/* Dynamic pulsing circle */}
          <div className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-[#8FAF9A]/40 to-[#355C4A]/30 backdrop-blur-xs flex items-center justify-center shadow-lg shadow-[#8FAF9A]/20 ${getOrbScale()}`}>
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#FAF7F0]/90 border border-white/60 flex flex-col items-center justify-center text-center p-3">
              <span className="text-xs font-bold text-[#355C4A] mb-1">
                {isActive ? currentInstruction.label : 'جاهز للتنفس'}
              </span>
              <span className="font-mono text-3xl font-extrabold text-[#26332D]">
                {isActive ? phaseSecondsLeft : 'ابدأ'}
              </span>
            </div>
          </div>
        </div>

        {/* Session Progress Info */}
        <div className="relative z-10 text-center space-y-1 mb-6">
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

        {/* Sound Ambience Selector */}
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
                if (isActive) ambientSound.playAmbient(snd.id, 0.4);
              }}
              className={`py-1 px-2.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                soundMode === snd.id ? 'bg-[#355C4A] text-white shadow-2xs' : 'text-[#52645B] hover:text-[#26332D]'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              setTotalSecondsElapsed(0);
              setCurrentPhaseIndex(0);
              setCyclesCompleted(0);
              setPhaseSecondsLeft(selectedSession.instructions[0].seconds);
            }}
            className="p-3 text-[#52645B] hover:text-[#26332D] bg-white border border-[#E8DDCC] rounded-2xl transition-colors"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleActive}
            className="w-16 h-16 rounded-2xl bg-[#355C4A] hover:bg-[#264235] text-white flex items-center justify-center shadow-lg shadow-[#355C4A]/25 transition-transform active:scale-95"
            aria-label={isActive ? 'إيقاف مؤقت' : 'بدء التمرين'}
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 translate-x-0.5" />}
          </button>

          <button
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`p-3 rounded-2xl border transition-colors ${
              chimeEnabled 
                ? 'bg-amber-100/80 border-amber-300 text-amber-900' 
                : 'bg-white border-[#E8DDCC] text-stone-400'
            }`}
            title={chimeEnabled ? 'صوت جرس الانتقال مفعل' : 'صوت جرس الانتقال معطل'}
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        {cyclesCompleted > 0 && (
          <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-[#E8DDCC] text-xs font-mono text-[#355C4A]">
            <span>أكملت {cyclesCompleted} دورات تنفس كاملة 🌿</span>
          </div>
        )}

        {/* Post Activity Feeling (Section 17 from Spec) */}
        {showPostFeedback && (
          <div className="mt-6 w-full max-w-sm p-4 bg-white/95 border border-[#8FAF9A]/50 rounded-2xl animate-fade-in text-center space-y-3 relative z-20">
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
                  className={`p-2 rounded-xl text-xs border font-medium transition-all ${
                    postFeeling === opt.val
                      ? 'bg-[#355C4A] text-white border-[#355C4A]'
                      : 'bg-[#FAF7F0] border-[#E8DDCC] text-[#26332D] hover:bg-stone-100'
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
      <div className="p-4 bg-white/70 border border-[#E8DDCC] rounded-2xl text-xs text-[#52645B] leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#8FAF9A] shrink-0 mt-0.5" />
        <div>
          التنفس البطيء ينشط الجهاز العصبي اللاودي (العصب الحائر)، مما يساعد جسمك ودماغك على خفض هرمونات التوتر طبيعياً دون مجهود.
        </div>
      </div>
    </div>
  );
};
