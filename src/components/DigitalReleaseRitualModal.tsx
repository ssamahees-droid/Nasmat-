import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Flame, 
  Wind, 
  Droplets, 
  Shield, 
  Lock, 
  Check, 
  Copy, 
  Heart, 
  Volume2, 
  VolumeX, 
  Award,
  Trash2
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

type RitualType = 'water' | 'wind' | 'embers';

interface RitualStyle {
  id: RitualType;
  title: string;
  icon: string;
  desc: string;
  buttonLabel: string;
  particleColor: string;
}

const RITUAL_STYLES: RitualStyle[] = [
  {
    id: 'water',
    title: 'ذوبان الحبر في الماء الصافي',
    icon: '🌊',
    desc: 'يذوب ثقل الكلمات تدريجياً كالحبر في بحيرة صافية هادئة تمحو كل أثر.',
    buttonLabel: 'إذابة الكلمات في الماء 💧',
    particleColor: 'rgba(56, 189, 248, 0.7)'
  },
  {
    id: 'wind',
    title: 'تطاير أوراق الخريف مع النسيم',
    icon: '🍂',
    desc: 'تتفكك الحروف إلى أوراق شجر خريفية ذهبية تذرها الريح بعيداً عن صدرك.',
    buttonLabel: 'إطلاق العبء مع النسيم 🍃',
    particleColor: 'rgba(245, 158, 11, 0.7)'
  },
  {
    id: 'embers',
    title: 'الرماد النوراني وصعود السكينة',
    icon: '🕯️',
    desc: 'تتحول الكلمات الثقيلة إلى قبس نوراني يصعد بهدوء نحو سماء الليل.',
    buttonLabel: 'تحرير العبء إلى نور ✨',
    particleColor: 'rgba(168, 85, 247, 0.7)'
  }
];

export const DigitalReleaseRitualModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedRitual, setSelectedRitual] = useState<RitualType>('water');
  const [burdenText, setBurdenText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());
  const [dissolveParticles, setDissolveParticles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBurdenText('');
      setIsReleasing(false);
      setIsCompleted(false);
      setDissolveParticles([]);
      setIsMuted(chimeService.isMuted());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStyle = RITUAL_STYLES.find(r => r.id === selectedRitual) || RITUAL_STYLES[0];

  const handleStartRelease = () => {
    if (!burdenText.trim() || isReleasing) return;

    setIsReleasing(true);
    chimeService.playDissolveAsmr();

    // Generate floating dispersion characters
    const words = burdenText.trim().split(' ').slice(0, 15);
    const particles = words.map((w, idx) => ({
      id: Date.now() + idx,
      x: 20 + (idx * 15) % 65,
      y: 35 + (idx * 8) % 45,
      char: w
    }));
    setDissolveParticles(particles);

    // Fade out text gradually
    setTimeout(() => {
      chimeService.playSuccessChime();
      setIsReleasing(false);
      setIsCompleted(true);
      setBurdenText(''); // Shredded completely
      setDissolveParticles([]);
    }, 2800);
  };

  const handleReset = () => {
    setBurdenText('');
    setIsReleasing(false);
    setIsCompleted(false);
    setDissolveParticles([]);
  };

  const handleCopyAffirmation = () => {
    const text = `«لقد اعترفت بما في داخلي، ونزعت شوكة الثقل، وأطلقت سراح روحي بسلام ورحمة.»\n\n— طقس التحرر من مرآة الأعماق في تطبيق نسمة حياة 🌿🕊️`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#090E0B] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-slate-900 text-white flex items-center justify-center text-2xl shadow-lg border border-white/10">
              🪞
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «مرآة الأعماق: طقوس التحرر الرقمي»
                </h2>
                <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  تفريغ رمزي وخصوصية مطلقة
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                اكتب ما يثقل روحك في مرآة الأمان، واشهَد تحلله وتلاشيه أمام عينيك كأنه لم يكن 🕊️
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = chimeService.toggleMute();
                setIsMuted(next);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة الطقس"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Privacy Seal Notice */}
        <div className="py-2 px-3.5 my-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300 shrink-0">
          <div className="flex items-center gap-2 font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>ضمان السرية والخصوصية التامة: كلامك لا يُحفظ ولا يُرفع لأي خادم أبداً ويُتلف فورياً.</span>
          </div>
          <span className="text-stone-400 hidden sm:inline">مشفر محلياً 🛡️</span>
        </div>

        {/* Ritual Mode Selector */}
        {!isCompleted && !isReleasing && (
          <div className="grid grid-cols-3 gap-2 mb-2.5 shrink-0">
            {RITUAL_STYLES.map((r) => {
              const isSelected = selectedRitual === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRitual(r.id)}
                  className={`p-2 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/10 border-emerald-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{r.icon}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-bold truncate">{r.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Deep Reflective Mirror Canvas */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] bg-gradient-to-b from-[#0F1612] via-[#090F0C] to-[#050806] rounded-3xl border border-white/10 p-5 overflow-hidden flex flex-col justify-between shadow-inner">
          
          {/* Subtle Ambient Vignette & Mirror Sheen */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black/80" />

          {/* Floating Dissolving Words */}
          {isReleasing && dissolveParticles.map(p => (
            <span
              key={p.id}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute text-sm font-bold text-emerald-200 animate-ping duration-1000 pointer-events-none blur-[0.5px]"
            >
              {p.char}
            </span>
          ))}

          {isCompleted ? (
            /* Catharsis Completion Screen */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in p-4 z-10">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-4xl shadow-xl shadow-emerald-950/60 animate-bounce">
                🕊️
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-tajawal">
                تحرر العبء وتلاشى في العدم 🌿
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md leading-relaxed">
                شجاعتك في تسمية ما يؤلمك هي أول خطوة لنزع قوته عنك. لقد ذاب الكلام وأصبح صدرك الآن أوسع وأخف.
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-emerald-300 italic max-w-sm">
                «أنت لست ما حدث لك.. أنت القوة التي تختار السلام والتحرر في كل لحظة 🤍»
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCopyAffirmation}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ وسام التحرر'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  تحرير عبء آخر 🌿
                </button>
              </div>
            </div>
          ) : isReleasing ? (
            /* Active Dissolution Magic Animation */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 z-10 animate-pulse">
              <span className="text-5xl">{currentStyle.icon}</span>
              <h4 className="text-base font-extrabold text-white">
                جاري إذابة وتفكيك الكلمات في سكون تام...
              </h4>
              <p className="text-xs text-stone-400">
                أغمض عينيك لثوانٍ وازفر الهواء ببطء..
              </p>
            </div>
          ) : (
            /* Input Phase */
            <div className="h-full flex flex-col justify-between z-10 space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-300 block">
                  اكتب هنا ما يثقل قلبك (حزن، غضب، عتب لم يُقال، أو خوف يؤرقك):
                </span>
                <textarea
                  value={burdenText}
                  onChange={(e) => setBurdenText(e.target.value)}
                  placeholder="في داخلي ثقل أريد تركه يرحل..."
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:border-emerald-400/80 transition-colors resize-none leading-relaxed"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <span>{currentStyle.desc}</span>
                <button
                  onClick={handleStartRelease}
                  disabled={!burdenText.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-30 text-black font-black rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{currentStyle.buttonLabel}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
