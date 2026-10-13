import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Heart, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  BookOpen, 
  Award,
  Share2,
  Wind,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

interface BurdenBubble {
  id: string;
  text: string;
  category: string;
  color: string;
  glow: string;
  reframing: string;
  size: number; // size in px
  top: number;  // percent
  left: number; // percent
  duration: number; // animation float seconds
  isPopped: boolean;
}

const BURDENS_DATA: Omit<BurdenBubble, 'id' | 'top' | 'left' | 'duration' | 'isPopped'>[] = [
  {
    text: 'الخوف من المستقبل',
    category: 'قلق',
    color: 'from-purple-900/80 to-indigo-950/90 border-purple-400/50 text-purple-100',
    glow: 'rgba(168, 85, 247, 0.4)',
    reframing: 'المستقبل ليس وحشاً ينتظر التهامك.. كل ما تملكه حقاً هو أنفاسك الحالية وقرار لطيف واحد تصنعه اليوم 🌿',
    size: 130
  },
  {
    text: 'تأنيب الضمير المستمر',
    category: 'جلد الذات',
    color: 'from-rose-950/80 to-red-950/90 border-rose-400/50 text-rose-100',
    glow: 'rgba(244, 63, 94, 0.4)',
    reframing: 'أنت إنسان يتعلم بالتجربة والخطأ، ولست آلة مبرمجة على الكمال. سامح نفسك على ما كنت تجهله في الماضي 🤍',
    size: 135
  },
  {
    text: 'إرضاء الآخرين على حسابي',
    category: 'حدود شخصية',
    color: 'from-amber-950/80 to-yellow-950/90 border-amber-400/50 text-amber-100',
    glow: 'rgba(245, 158, 11, 0.4)',
    reframing: 'قول "لا" لما يستنزفك هو أول "نعم" تقولها لصحتك النفسية وكرامتك. قيمتك لا تقاس بكمية التضحيات المرهقة ✨',
    size: 140
  },
  {
    text: 'المثالية المرهقة',
    category: 'تفكير مفرط',
    color: 'from-blue-950/80 to-cyan-950/90 border-cyan-400/50 text-cyan-100',
    glow: 'rgba(6, 182, 212, 0.4)',
    reframing: 'الخطوة الناقصة التي تخطوها اليوم أشرف من المثالية المشلولة التي تنتظرها غداً. 70% برضا خير من 100% بانهيار عصبي 💡',
    size: 125
  },
  {
    text: 'مقارنة نفسي بالآخرين',
    category: 'استنزاف',
    color: 'from-slate-900/80 to-emerald-950/90 border-emerald-400/50 text-emerald-100',
    glow: 'rgba(16, 185, 129, 0.4)',
    reframing: 'أنت تشاهد كواليس حياتك كاملة وتقارنها بمشاهد الآخرين المنتقاة على المسرح. لكل روح توقيتها ومسارها المستقل 🌸',
    size: 135
  },
  {
    text: 'أنا لست كافياً',
    category: 'صورة الذات',
    color: 'from-pink-950/80 to-rose-900/90 border-pink-400/50 text-pink-100',
    glow: 'rgba(236, 72, 153, 0.4)',
    reframing: 'وجودك ومحاولاتك المستمرة كافية جداً. ليس عليك إثبات أهليتك للحياة لأي أحد.. أنت تستحق الحب كما أنت 🌟',
    size: 130
  },
  {
    text: 'ثقل الماضي والندم',
    category: 'ذكريات',
    color: 'from-stone-900/80 to-amber-950/90 border-amber-500/50 text-stone-100',
    glow: 'rgba(217, 119, 6, 0.4)',
    reframing: 'الماضي انتهى ولن يغير الندم حرفاً منه، لكنك اليوم أكثر نضجاً ورحمة بفضل كل ما عشته. دعه يرحل بهدوء 🕊️',
    size: 125
  },
  {
    text: 'الخوف من الفشل',
    category: 'مخاوف',
    color: 'from-teal-950/80 to-slate-900/90 border-teal-400/50 text-teal-100',
    glow: 'rgba(20, 184, 166, 0.4)',
    reframing: 'الفشل ليس نهاية المطاف، بل جزء طبيعي من المشي في طريق الحياة. طالما تحاول، فأنت لم تفشل أبداً 🌱',
    size: 125
  },
  {
    text: 'مسؤولية مشاعر الجميع',
    category: 'أعباء عاطفية',
    color: 'from-indigo-950/80 to-blue-900/90 border-indigo-400/50 text-indigo-100',
    glow: 'rgba(99, 102, 241, 0.4)',
    reframing: 'لست مسؤولاً عن مزاج أي شخص بالغ ولا عن حل مشاكله بدلاً منه. تعاطف بحب، ولكن دون أن تحرق سفينتك ⛵',
    size: 135
  },
  {
    text: 'كبت الحزن والتظاهر بالقوة',
    category: 'إنكار المشاعر',
    color: 'from-zinc-900/80 to-neutral-900/90 border-zinc-400/50 text-zinc-100',
    glow: 'rgba(161, 161, 170, 0.4)',
    reframing: 'البكاء ليس ضعفاً، والتعب ليس عيباً. النخلة تنحني مع الريح كي لا تنكسر.. امنح نفسك رخصة الشعور والأمان 💧',
    size: 140
  }
];

interface InnerBurdensBubbleGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InnerBurdensBubbleGameModal: React.FC<InnerBurdensBubbleGameModalProps> = ({
  isOpen,
  onClose
}) => {
  const [bubbles, setBubbles] = useState<BurdenBubble[]>([]);
  const [activeReframing, setActiveReframing] = useState<{ text: string; originalBurden: string } | null>(null);
  const [poppedCount, setPoppedCount] = useState(0);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  // Initialize randomized layout
  const initGame = () => {
    // Generate scattered positions across grid to avoid overlaps
    const positions = [
      { top: 12, left: 10 },
      { top: 18, left: 42 },
      { top: 14, left: 74 },
      { top: 40, left: 8 },
      { top: 42, left: 38 },
      { top: 38, left: 72 },
      { top: 68, left: 14 },
      { top: 72, left: 44 },
      { top: 66, left: 75 },
      { top: 84, left: 30 }
    ];

    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

    const generated: BurdenBubble[] = BURDENS_DATA.map((item, idx) => ({
      ...item,
      id: `bubble_${idx}_${Date.now()}`,
      top: shuffledPositions[idx]?.top ?? (10 + (idx * 8) % 75),
      left: shuffledPositions[idx]?.left ?? (10 + (idx * 25) % 80),
      duration: 3.5 + (idx % 4) * 0.8,
      isPopped: false
    }));

    setBubbles(generated);
    setPoppedCount(0);
    setActiveReframing(null);
  };

  useEffect(() => {
    if (isOpen) {
      initGame();
      setIsMuted(chimeService.isMuted());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePopBubble = (bubble: BurdenBubble, e: React.MouseEvent) => {
    if (bubble.isPopped) return;

    // Audio cue
    chimeService.playBubblePopChime();

    // Spawn burst particles at click location
    const rect = e.currentTarget.getBoundingClientRect();
    const burstId = Date.now();
    const burstEmojis = ['✨', '🕊️', '💨', '🌿', '🤍'];
    const newParticles = burstEmojis.map((emoji, i) => ({
      id: burstId + i,
      x: rect.left + rect.width / 2 + (Math.random() * 60 - 30),
      y: rect.top + rect.height / 2 + (Math.random() * 60 - 30),
      emoji
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1200);

    // Update bubble state
    setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, isPopped: true } : b));
    setPoppedCount(prev => prev + 1);

    // Display reassurance card
    setActiveReframing({
      text: bubble.reframing,
      originalBurden: bubble.text
    });
    setCopiedSuccess(false);
    setSavedJournalSuccess(false);
  };

  const handleCopyReframing = () => {
    if (!activeReframing) return;
    const shareText = `«${activeReframing.text}»\n\n— رسالة طمأنينة بعد تحرير عبء «${activeReframing.originalBurden}» من تطبيق نسمة حياة 🌿🫧`;
    navigator.clipboard.writeText(shareText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleSaveToJournal = () => {
    if (!activeReframing) return;
    storage.addThoughtPost({
      title: `تحرير عبء: ${activeReframing.originalBurden}`,
      content: activeReframing.text,
      category: 'gentleness',
      mood: 'fair',
      promptUsed: 'توكيد نفسي بعد فرقعة الأعباء الذهنية',
      isFavorite: true
    });
    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 2500);
  };

  const handleToggleMute = () => {
    const next = chimeService.toggleMute();
    setIsMuted(next);
  };

  const remainingCount = bubbles.filter(b => !b.isPopped).length;
  const isAllPopped = bubbles.length > 0 && remainingCount === 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0F1713] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Floating Particles Burst Effect */}
        {particles.map(p => (
          <span 
            key={p.id} 
            className="fixed pointer-events-none z-50 text-2xl animate-ping duration-700"
            style={{ left: p.x, top: p.y }}
          >
            {p.emoji}
          </span>
        ))}

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/60 animate-pulse">
              🫧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «فرقعة الفقاعات النفسية»
                </h2>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  تفريغ بصري ولمسي لحظي
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                اضغط على أي فقاعة تمثل عبئاً ثقيلاً لتفرقعها وتحولها إلى رسالة طمأنينة وتوكيد بديل 🌿
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-white' 
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              }`}
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={initGame}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة تعيين الفقاعات"
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

        {/* Status Tracker */}
        <div className="py-2.5 px-4 my-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-stone-300">
              الأعباء المفرّغة: <strong className="text-emerald-400 text-sm font-black">{poppedCount}</strong> من {bubbles.length}
            </span>
            <div className="w-24 sm:w-36 h-2 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${(poppedCount / (bubbles.length || 1)) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-stone-400 hidden sm:inline">
            {remainingCount > 0 ? `المتبقي ${remainingCount} أعباء` : '✨ تم تحرير كل الأعباء بنجاح!'}
          </span>
        </div>

        {/* Main Interactive Bubble Field */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] bg-radial from-[#15241C] via-[#0D1612] to-[#0A100D] rounded-3xl border border-emerald-500/15 overflow-hidden p-3 select-none">
          
          {/* Subtle Ambient Floating Dust / Rays */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />

          {/* All Popped Complete Screen */}
          {isAllPopped && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-sm animate-fade-in space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-4xl shadow-xl animate-bounce">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-tajawal">
                رائع! فرقعت كل الأعباء الذهنية وحررت مساحتك الداخلية 🕊️
              </h3>
              <p className="text-sm text-stone-300 max-w-md leading-relaxed">
                تذكر دائماً: الأفكار المؤلمة مجرد فقاعات عابرة في سماء وعيك، وليست حقائق ثابتة تلزمك بحملها. خذ نفساً عميقاً واستشعر خفة صدرك الآن.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={initGame}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>توليد فقاعات جديدة للتفريغ</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  العودة للمنصة 🌿
                </button>
              </div>
            </div>
          )}

          {/* Bubbles Render */}
          {bubbles.map((bubble) => {
            if (bubble.isPopped) return null;

            return (
              <button
                key={bubble.id}
                onClick={(e) => handlePopBubble(bubble, e)}
                style={{
                  top: `${bubble.top}%`,
                  left: `${bubble.left}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  animationDuration: `${bubble.duration}s`
                }}
                className={`absolute rounded-full border-2 p-3 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95 animate-bounce backdrop-blur-md bg-gradient-to-br ${bubble.color}`}
              >
                {/* Bubble Shimmer Reflection */}
                <div className="absolute top-2 left-4 w-5 h-2.5 bg-white/40 rounded-full -rotate-45 pointer-events-none blur-[0.5px]" />
                
                <span className="text-[10px] opacity-75 font-bold mb-1 tracking-wider uppercase">
                  {bubble.category}
                </span>
                <span className="text-xs font-black leading-tight text-white drop-shadow-sm px-1">
                  {bubble.text}
                </span>
                <span className="text-[10px] mt-1 text-emerald-300 font-medium opacity-90">
                  فرقع الآن 💥
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Reassurance / Reframing Popover Card */}
        {activeReframing && (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-[#17271E] via-[#1C2C22] to-[#121F17] border border-emerald-500/40 shadow-xl animate-fade-in shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    توكيد تحرير: {activeReframing.originalBurden}
                  </span>
                  <span className="text-[11px] text-stone-400">✨ بديل نفسي واعي</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  «{activeReframing.text}»
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyReframing}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    copiedSuccess 
                      ? 'bg-emerald-500 text-black border-emerald-400' 
                      : 'bg-white/10 hover:bg-white/20 text-stone-200 border-white/15'
                  }`}
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ التوكيد'}</span>
                </button>

                <button
                  onClick={handleSaveToJournal}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    savedJournalSuccess 
                      ? 'bg-teal-500 text-black border-teal-400' 
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {savedJournalSuccess ? <Check className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{savedJournalSuccess ? 'حُفظ في الدفتر 🌿' : 'حفظ في دفتري'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
