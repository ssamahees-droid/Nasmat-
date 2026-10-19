import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Clock, 
  Heart, 
  Sparkles, 
  Music, 
  Compass, 
  Waves, 
  Wind, 
  Info, 
  Check, 
  Sliders, 
  Share2, 
  RefreshCw,
  Disc3
} from 'lucide-react';
import { 
  khairatEngine, 
  KHAIRAT_TRACKS, 
  KhairatTrack 
} from '../utils/khairatAudioEngine';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../services/storage';

interface OmarKhairatMusicLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  initialTrackIndex?: number;
}

export const OmarKhairatMusicLoungeModal: React.FC<OmarKhairatMusicLoungeModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialTrackIndex = 0
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [volume, setVolume] = useState(0.65);
  const [ambientVolume, setAmbientVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(false);
  const [tempoMultiplier, setTempoMultiplier] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'all' | 'khairat' | 'alpha' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nesmat_khairat_favorites');
      return saved ? JSON.parse(saved) : ['am-ahmed', 'feeha-haga-helwa', 'dameer-abla-hekmat'];
    } catch {
      return ['am-ahmed', 'feeha-haga-helwa'];
    }
  });

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number | null>(null);
  const [showScientificInsight, setShowScientificInsight] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [postFeeling, setPostFeeling] = useState<string | null>(null);
  const [savedFeedbackMsg, setSavedFeedbackMsg] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentTrack: KhairatTrack = KHAIRAT_TRACKS[currentTrackIndex] || KHAIRAT_TRACKS[0];

  // Sync state changes with engine
  useEffect(() => {
    khairatEngine.setOnStateChange((playing, trackIdx) => {
      setIsPlaying(playing);
      setCurrentTrackIndex(trackIdx);
    });

    khairatEngine.setOnNotePlayed((note) => {
      setCurrentNote(note);
    });

    return () => {
      khairatEngine.setOnStateChange(undefined);
      khairatEngine.setOnNotePlayed(undefined);
    };
  }, []);

  // When modal closes, optionally pause
  useEffect(() => {
    if (!isOpen && isPlaying) {
      khairatEngine.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Relaxation Sleep Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerSecondsRemaining !== null && timerSecondsRemaining > 0 && isPlaying) {
      interval = setInterval(() => {
        setTimerSecondsRemaining(prev => {
          if (prev && prev <= 1) {
            khairatEngine.pause();
            setIsPlaying(false);
            setTimerMinutes(null);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerSecondsRemaining, isPlaying]);

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw soothing golden / emerald wave
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const alpha = isPlaying ? 0.35 - w * 0.08 : 0.12;
        const color = w === 0 ? `rgba(217, 119, 6, ${alpha})` : w === 1 ? `rgba(16, 185, 129, ${alpha})` : `rgba(245, 158, 11, ${alpha})`;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5 - w * 0.5;

        for (let x = 0; x < width; x += 3) {
          const freq = 0.02 + w * 0.01;
          const amp = isPlaying ? 18 - w * 4 : 4;
          const y = centerY + Math.sin(x * freq + phase + w * 1.5) * amp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      if (isPlaying) {
        phase += 0.04;
      } else {
        phase += 0.005;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      khairatEngine.pause();
    } else {
      khairatEngine.playTrack(currentTrackIndex);
    }
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    khairatEngine.playTrack(index);
  };

  const handleNext = () => {
    khairatEngine.nextTrack();
  };

  const handlePrev = () => {
    khairatEngine.prevTrack();
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (!isMuted) {
      khairatEngine.setVolume(newVal);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      khairatEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      khairatEngine.setVolume(0);
    }
  };

  const handleAmbientChange = (newVal: number) => {
    setAmbientVolume(newVal);
    khairatEngine.setAmbientVolume(newVal);
  };

  const handleTempoChange = (speed: number) => {
    setTempoMultiplier(speed);
    khairatEngine.setTempoMultiplier(speed);
  };

  const handleSetTimer = (minutes: number | null) => {
    setTimerMinutes(minutes);
    if (minutes === null) {
      setTimerSecondsRemaining(null);
    } else {
      setTimerSecondsRemaining(minutes * 60);
    }
  };

  const handleToggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId];
      try {
        localStorage.setItem('nesmat_khairat_favorites', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save favorites:', err);
      }
      return next;
    });
  };

  const handleLogFeeling = (feelingText: string) => {
    setPostFeeling(feelingText);
    storage.addNote(`استمعت لمقطوعة «${currentTrack.titleAr}» (${currentTrack.composerAr}): شعرت بـ ${feelingText}`);
    setSavedFeedbackMsg(true);
    setTimeout(() => setSavedFeedbackMsg(false), 3500);
  };

  // Filtered tracks
  const displayedTracks = KHAIRAT_TRACKS.filter((track) => {
    if (activeTab === 'favorites') {
      return favorites.includes(track.id);
    }
    if (activeTab === 'khairat') {
      return track.composerAr.includes('خيرت');
    }
    if (activeTab === 'alpha') {
      return track.id.includes('alpha') || track.id.includes('ney') || track.id.includes('ghoroub');
    }
    return true;
  });

  const formatTimerRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-right"
      dir="rtl"
    >
      <div 
        className="bg-gradient-to-b from-[#18231E] via-[#121A15] to-[#0A100C] border border-amber-500/30 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center shadow-inner">
              <span className="text-2xl">🎹</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-bold font-tajawal text-amber-200">
                  صالون النغم والسكينة
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  روائع عمر خيرت 🎼
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                موسيقى بيانو ووتريات شرقية هادئة لتهدئة الأعصاب، خفض الكورتيزول، وتحفيز موجات ألفا
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScientificInsight(!showScientificInsight)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                showScientificInsight 
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/50' 
                  : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
              }`}
              title="لماذا تهدئنا هذه الموسيقى؟"
            >
              <Info className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">الأثر السيكولوجي</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10 custom-scrollbar">
          
          {/* Scientific Insight Accordion */}
          {showScientificInsight && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2.5 text-xs text-stone-300 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>كيف تسهم ألحان الموسيقار عمر خيرت في الشفاء النفسي وتصفية الذهن؟</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-stone-300">
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1">
                  <div className="text-amber-400 font-bold">1. توليد موجات ألفا (8–12 Hz)</div>
                  <p className="leading-relaxed text-[11px]">
                    التناغم البارع بين رقة البيانو وتدرجات المقامات الشرقية (النهاوند والعجم) يُهبط نشاط الدماغ من التوتر عالي التردد (بيتا) إلى نطاق ألفا التأملي الصافي.
                  </p>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1">
                  <div className="text-emerald-400 font-bold">2. تنشيط العصب الحائر والقلب</div>
                  <p className="leading-relaxed text-[11px]">
                    الإيقاعات البطيئة المنتظمة (60 إلى 76 نبضة/دقيقة) تُحاكي معدل نبض القلب في وضع السكينة وتخفض ضغط الدم وهرمون الكورتيزول.
                  </p>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1">
                  <div className="text-sky-400 font-bold">3. استحضار الدفء والأمل</div>
                  <p className="leading-relaxed text-[11px]">
                    تحرك هذه الألحان النوستالجيا الإيجابية، فتُفرز مراكز المكافأة الدوبامين والأوكسيتوسين، مما يخلق شعوراً بالحماية والاحتواء والسكينة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* HERO PLAYER: Current Track Spotlight */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-black/60 via-stone-950/60 to-black/70 border border-amber-500/30 shadow-2xl relative overflow-hidden">
            
            {/* Background subtle visualizer canvas */}
            <canvas 
              ref={canvasRef} 
              width={700} 
              height={140} 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              
              {/* Rotating Vinyl / Art Disc */}
              <div className="relative flex-shrink-0">
                <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-900 via-stone-900 to-amber-700 border-4 border-amber-500/40 shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-700 ${
                  isPlaying ? 'animate-spin' : ''
                }`} style={{ animationDuration: '10s' }}>
                  {/* Vinyl grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/10" />
                  <div className="absolute inset-5 rounded-full border border-white/10" />
                  <div className="absolute inset-8 rounded-full border border-white/10" />
                  
                  {/* Center Label */}
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 flex flex-col items-center justify-center shadow-lg font-bold">
                    <span className="text-xl">{currentTrack.icon}</span>
                  </div>
                </div>

                {/* Floating Note indicator */}
                {isPlaying && currentNote && (
                  <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black shadow-lg animate-bounce flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    <span>{currentNote}</span>
                  </div>
                )}
              </div>

              {/* Track Details & Mood Description */}
              <div className="flex-1 text-center sm:text-right space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {currentTrack.moodTagAr}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-stone-300 text-xs border border-white/10">
                    مقام: {currentTrack.maqamAr}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs border border-emerald-500/20">
                    الإيقاع: {Math.round(currentTrack.tempoBpm * tempoMultiplier)} BPM
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
                  {currentTrack.titleAr}
                </h3>
                <p className="text-sm text-amber-200/90 font-medium">
                  {currentTrack.composerAr}
                </p>

                <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
                  {currentTrack.therapeuticBenefitAr}
                </p>

                {/* Timer active countdown pill */}
                {timerSecondsRemaining !== null && timerSecondsRemaining > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300 mt-1 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>جلسة الاسترخاء تنتهي بعد: {formatTimerRemaining(timerSecondsRemaining)}</span>
                  </div>
                )}
              </div>

              {/* Favorite Toggle */}
              <button
                onClick={(e) => handleToggleFavorite(currentTrack.id, e)}
                className={`p-3 rounded-2xl border transition-all ${
                  favorites.includes(currentTrack.id)
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-white/5 text-stone-400 border-white/10 hover:text-white'
                }`}
                title={favorites.includes(currentTrack.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                <Heart className={`w-6 h-6 ${favorites.includes(currentTrack.id) ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Playback Controls Bar */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Main Play / Prev / Next Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all active:scale-95"
                  title="المقطوعة السابقة"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>استماع للتهدئة 🌿</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all active:scale-95"
                  title="المقطوعة التالية"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Tempo & Speed Options */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
                <span className="text-stone-400 text-[11px]">السرعة:</span>
                {[
                  { label: '0.8x هادئ', val: 0.8 },
                  { label: '1.0x طبيعي', val: 1.0 },
                  { label: '1.2x منساب', val: 1.2 }
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => handleTempoChange(s.val)}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                      tempoMultiplier === s.val
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Master Volume Controls */}
              <div className="flex items-center gap-2.5 min-w-[180px]">
                <button
                  onClick={handleToggleMute}
                  className="p-2 text-stone-400 hover:text-white transition-colors"
                  title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-stone-700"
                />
                <span className="text-[11px] text-stone-400 w-8 text-left">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>

            {/* Sound Layers & Sleep Timer Row */}
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Layer 1: Ambient Nature Blend */}
              <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-2xl border border-white/5">
                <Waves className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-stone-300 text-[11px] whitespace-nowrap">طبقة نسيم الطبيعة:</span>
                <input
                  type="range"
                  min="0"
                  max="0.6"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleAmbientChange(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1 rounded-lg bg-stone-800"
                />
                <span className="text-[10px] text-stone-400 whitespace-nowrap">
                  {ambientVolume > 0.05 ? 'مفعل 🍃' : 'هادئ'}
                </span>
              </div>

              {/* Layer 2: Sleep & Relax Timer */}
              <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-2xl border border-white/5 overflow-x-auto">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-stone-300 text-[11px] whitespace-nowrap">مؤقت التهدئة:</span>
                {[
                  { label: 'إيقاف', val: null },
                  { label: '5 د', val: 5 },
                  { label: '15 د', val: 15 },
                  { label: '30 د', val: 30 },
                  { label: '45 د', val: 45 }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSetTimer(item.val)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                      timerMinutes === item.val
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PLAYLIST SECTION: Tabs & Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-amber-400" />
                <span>قائمة المقطوعات والألحان المهدئة</span>
                <span className="text-xs text-stone-400 font-normal">
                  ({displayedTracks.length} مقطوعة)
                </span>
              </h4>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/30 border border-white/10 text-xs">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'khairat', label: 'روائع عمر خيرت 🎼' },
                  { id: 'alpha', label: 'موجات ألفا والناي 🌊' },
                  { id: 'favorites', label: `المفضلة ❤️ (${favorites.length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Track Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedTracks.map((track) => {
                const globalIndex = KHAIRAT_TRACKS.findIndex(t => t.id === track.id);
                const isThisPlaying = isPlaying && currentTrackIndex === globalIndex;
                const isThisCurrent = currentTrackIndex === globalIndex;
                const isFav = favorites.includes(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(globalIndex)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden ${
                      isThisCurrent
                        ? 'bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-black/60 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-black/20 hover:bg-black/40 border-white/10 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Play / State Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isThisCurrent) {
                            handleTogglePlay();
                          } else {
                            handleSelectTrack(globalIndex);
                          }
                        }}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0 shadow-sm ${
                          isThisPlaying
                            ? 'bg-amber-500 text-stone-950 scale-105'
                            : 'bg-white/5 group-hover:bg-amber-500/20 text-amber-300 border border-white/10'
                        }`}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className={`text-sm font-bold truncate transition-colors ${
                            isThisCurrent ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                          }`}>
                            {track.titleAr}
                          </h5>
                          {isThisPlaying && (
                            <span className="flex gap-0.5 items-end h-3">
                              <span className="w-1 bg-amber-400 animate-pulse h-full rounded-full" />
                              <span className="w-1 bg-amber-400 animate-pulse h-2 rounded-full" style={{ animationDelay: '0.2s' }} />
                              <span className="w-1 bg-amber-400 animate-pulse h-3 rounded-full" style={{ animationDelay: '0.4s' }} />
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-stone-400 truncate">
                          {track.composerAr} • {track.maqamAr}
                        </p>

                        <p className="text-[10px] text-amber-200/80 truncate">
                          {track.moodTagAr}
                        </p>
                      </div>
                    </div>

                    {/* Right side info and favorite button */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-stone-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                        {track.durationApproxMin} د
                      </span>

                      <button
                        onClick={(e) => handleToggleFavorite(track.id, e)}
                        className={`p-2 rounded-xl transition-all ${
                          isFav 
                            ? 'text-rose-400 bg-rose-500/10' 
                            : 'text-stone-500 hover:text-rose-300 hover:bg-white/5'
                        }`}
                        title={isFav ? 'في المفضلة' : 'إضافة للمفضلة'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POST-LISTENING EMOTIONAL CHECK-IN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> كيف هو حال أعصابك ومشاعرك بعد الاستماع؟
              </span>
              {savedFeedbackMsg && (
                <span className="text-xs text-emerald-300 flex items-center gap-1 animate-fade-in font-bold">
                  <Check className="w-3.5 h-3.5" /> تم تسجيل شعورك في مذكراتك بنجاح 🌱
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'سكينة وهدوء تام 🌿', value: 'سكينة وهدوء تام' },
                { label: 'راحة بال ورضا 🤍', value: 'راحة بال ورضا' },
                { label: 'استرخاء العضلات 🧘', value: 'استرخاء العضلات وخفض الضغط' },
                { label: 'تصفية الذهن وصفاء 💡', value: 'تصفية الذهن وصفاء الفكر' }
              ].map((feeling) => (
                <button
                  key={feeling.value}
                  onClick={() => handleLogFeeling(feeling.value)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                    postFeeling === feeling.value
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400'
                      : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {feeling.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Bridge to other calming tools */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-xs text-stone-400">
            <span>تريد دمج الموسيقى مع تدريب تنفس؟</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('breathe');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all font-bold"
              >
                انتقل لتمارين التنفس 4-7-8 💨
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>نسمة حياة — هندسة صوتية وتأملية نقية 100% بلا إعلانات</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
