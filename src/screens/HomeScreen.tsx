import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Wind, 
  BookOpen, 
  Bookmark, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Volume2, 
  Gamepad2, 
  Brain, 
  ShieldCheck, 
  Compass, 
  Activity, 
  LifeBuoy, 
  PhoneCall, 
  ChevronLeft,
  Calendar,
  FileText
} from 'lucide-react';
import { MoodValue, ContentItem } from '../types';
import { storage } from '../services/storage';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  onOpenContent: (contentId: string) => void;
  onOpenAudioModal: (title: string, category: string, durationMinutes: number) => void;
  onOpenThoughtRelease: () => void;
  onOpenSoundscapeStudio: () => void;
  onOpenEmotionCompass: () => void;
  onOpenDailyWisdom: () => void;
  // Interactive tools
  onOpenAnaDelwaqti: () => void;
  onOpenRescueKit: (planId?: string) => void;
  onOpenBatteryCheck: () => void;
  onOpenTranslateFeelings: () => void;
  onOpenFactGame: () => void;
  onOpenUntangleKnot: () => void;
  onOpenNesmaLaughs: () => void;
  onOpenEmergencyHelp: () => void;
  // Booklet additions
  onOpenBooklet: () => void;
  onOpenPersonalPlan: () => void;
  onOpenEnergyBudget: () => void;
  onOpenBoundaryBuilder: () => void;
  onOpenSpecialistGuide: () => void;
  // Workshops
  onOpenWorkshopsHub: () => void;
  onOpenPsychologicalER: () => void;
  onOpenConflictWithoutWar: () => void;
  onOpenHealingJourney: () => void;
  // Thought Journal & Mindfulness Studio
  onOpenThoughtJournal: () => void;
  onOpenMindfulnessStudio: () => void;
  // Fun & Games
  onOpenFunAndGames: (tab?: 'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory') => void;
  onOpenGwayaHekaya: () => void;
  onOpenFeker?: () => void;
  onOpenDiscoveryQuiz: () => void;
  theme?: 'dark' | 'light';
}

const MOOD_OPTIONS: { id: MoodValue; label: string; emoji: string }[] = [
  { id: 'good', label: 'كويس وراضي', emoji: '😊' },
  { id: 'fair', label: 'مقبول / عادي', emoji: '😐' },
  { id: 'confused', label: 'مش عارف مالي', emoji: '🤔' },
  { id: 'not_good', label: 'مش كويس ومضغوط', emoji: '😔' },
  { id: 'exhausted', label: 'طاقتي نفدت', emoji: '😫' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenContent,
  onOpenAudioModal,
  onOpenThoughtRelease,
  onOpenSoundscapeStudio,
  onOpenEmotionCompass,
  onOpenDailyWisdom,
  onOpenAnaDelwaqti,
  onOpenRescueKit,
  onOpenBatteryCheck,
  onOpenTranslateFeelings,
  onOpenFactGame,
  onOpenUntangleKnot,
  onOpenNesmaLaughs,
  onOpenEmergencyHelp,
  onOpenBooklet,
  onOpenPersonalPlan,
  onOpenEnergyBudget,
  onOpenBoundaryBuilder,
  onOpenSpecialistGuide,
  onOpenWorkshopsHub,
  onOpenPsychologicalER,
  onOpenConflictWithoutWar,
  onOpenHealingJourney,
  onOpenThoughtJournal,
  onOpenMindfulnessStudio,
  onOpenFunAndGames,
  onOpenGwayaHekaya,
  onOpenFeker,
  onOpenDiscoveryQuiz,
  theme = 'dark'
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = storage.getDailyCheckins().find(c => c.date === today);
    return todayCheckin ? todayCheckin.moodValue : null;
  });
  const [justSavedCheckin, setJustSavedCheckin] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState<string[]>(storage.getFavorites());
  const [selectedNeedId, setSelectedNeedId] = useState<string>('stressed');

  const NEED_BASED_PATHS = [
    {
      id: 'stressed',
      title: 'متوتر أو قلقان',
      desc: 'نبضك سريع أو أفكارك متلاحقة؟ ابدأ بتهدئة جهازك العصبي فوراً دون تعقيد.',
      emoji: '🌊',
      actionLabel: 'تمرين التنفس 4-7-8',
      action: () => onNavigate('breathe'),
      secondaryActionLabel: 'خطة وقت الانفعال',
      secondaryAction: () => onNavigate('rescue')
    },
    {
      id: 'scattered',
      title: 'مشتت وتائه في الأفكار',
      desc: 'عقلك ينسج سيناريوهات مقلقة؟ افرز الأفكار المنطقية عن المخاوف الافتراضية.',
      emoji: '🌀',
      actionLabel: 'استوديو تفكيك الأفكار (فكّر)',
      action: () => onOpenFeker ? onOpenFeker() : onNavigate('games'),
      secondaryActionLabel: 'فك عقدة المشاعر',
      secondaryAction: () => onOpenUntangleKnot()
    },
    {
      id: 'heavy',
      title: 'مخنوق أو حزين',
      desc: 'حاسس بحمل تقيل على صدرك؟ امنح نفسك مساحة تفريغ آمنة دون لوم أو أحكام.',
      emoji: '🌧️',
      actionLabel: 'تفريغ وفكفكة المشاعر',
      action: () => onOpenTranslateFeelings(),
      secondaryActionLabel: 'خطة وقت الضيق والخنقة',
      secondaryAction: () => onNavigate('rescue')
    },
    {
      id: 'exhausted',
      title: 'منهك وبطاريتي فارغة',
      desc: 'طاقتك في الحضيض ولا تستطيع التركيز؟ اعرف ما يستنزف طاقتك وكيف تشحنها.',
      emoji: '🔋',
      actionLabel: 'فحص شاحن الطاقة النفسية',
      action: () => onOpenBatteryCheck(),
      secondaryActionLabel: 'ميزانية الطاقة والحدود',
      secondaryAction: () => onOpenEnergyBudget()
    },
    {
      id: 'curious',
      title: 'أبحث عن فهم ذاتي وتطوير',
      desc: 'تريد استكشاف محركات سلوكك، بوصلة مشاعرك، وبناء خطة مرونة حقيقية؟',
      emoji: '🧭',
      actionLabel: 'الفحص الذاتي الشامل',
      action: () => onNavigate('self-discovery'),
      secondaryActionLabel: 'لعبة جوايا حكاية',
      secondaryAction: () => onOpenGwayaHekaya()
    }
  ];

  const activeNeed = NEED_BASED_PATHS.find(n => n.id === selectedNeedId) || NEED_BASED_PATHS[0];

  const suggestedContent: ContentItem[] = storage.getContent()
    .filter(c => c.isSuggested || c.reviewStatus === 'published')
    .slice(0, 3);

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    storage.addDailyCheckin(mood);
    setJustSavedCheckin(true);
    setTimeout(() => setJustSavedCheckin(false), 3000);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    storage.toggleFavorite(id);
    setSavedFavorites(storage.getFavorites());
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-9 animate-fade-in text-right">
      
      {/* 1. Welcoming Hero Banner */}
      <section className="bg-gradient-to-br from-[#1A261F] via-[#141C18] to-[#0E1511] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            {/* Official Logo & Badge */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="شعار مبادرة نسمة حياة الرسمي" 
                className="w-12 h-12 rounded-2xl object-cover shadow-md border border-emerald-500/30"
              />
              <div>
                <span className="text-xs font-bold text-emerald-400 block font-tajawal">
                  مبادرة نسمة حياة للصحة النفسية
                </span>
                <span className="text-[11px] text-stone-400">
                  مساحة عربية آمنة تفهمك وتساندك
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal">
              أهلاً بك في نسمة حياة 🌿
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              خذ لحظة هدوء مع نفسك... هنا مساحتك الخاصة للتعرف على مشاعرك، وتخفيف الضغوط اليومية، واكتساب مهارات عملية تدعم سلامك الداخلي بعيداً عن التعقيد أو الأحكام المسبقة.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('start')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>ابدأ من هنا (دليل المبادرة)</span>
              </button>
              
              <button
                onClick={() => onNavigate('breathe')}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>جلسة تنفس هادئة</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-2 shrink-0 bg-black/30 border border-white/10 p-4 rounded-2xl text-xs text-stone-300 min-w-[220px]">
            <div className="font-bold text-white text-xs border-b border-white/10 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>مبادئ مبادرة نسمة حياة</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-stone-400 pt-1">
              <div>✓ خصوصية وسرية تامة</div>
              <div>✓ محتوى موثوق ومراجع نفسياً</div>
              <div>✓ استكشاف ذاتي بلا أحكام</div>
              <div>✓ دعم ومساندة حقيقية</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emotional Mood Check-in: إنت عامل إيه النهارده؟ */}
      <section className="p-5 sm:p-6 bg-[#141C18] border border-white/10 rounded-3xl space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>إنت عامل إيه النهارده؟</span>
              {justSavedCheckin && (
                <span className="text-xs text-emerald-400 font-bold animate-fade-in flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  تم الحفظ في رحلتك ✓
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-400">
              تسجيل شعورك اليومي خطوة أولى لملاحظة نمط مشاعرك واحتياجاتك
            </p>
          </div>

          <button
            onClick={onOpenEmotionCompass}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>بوصلة المشاعر 🧭</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold shadow-sm'
                    : 'border-white/10 hover:border-emerald-500/40 bg-[#0E1411] text-stone-300'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-white/5">
          <span>يتم حفظ مشاعرك مشفرة ومحمية في حسابك الشخصي</span>
          <button 
            onClick={() => onNavigate('journey')}
            className="text-emerald-400 hover:underline font-semibold"
          >
            سجل أيامي وملاحظاتي ←
          </button>
        </div>
      </section>

      {/* 2.5 Start Here According to Your Need: ابدأ بحسب حالتك واحتياجك الآن */}
      <section className="p-5 sm:p-6 bg-gradient-to-br from-[#121B16] to-[#0D1511] border border-emerald-500/20 rounded-3xl space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>ابدأ من هنا</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              ما الذي يصف ما تمر به في هذه اللحظة؟
            </h2>
            <p className="text-xs text-stone-400">
              اختر حالتك لنقترح عليك الخطوة الأنسب فوراً دون حيرة
            </p>
          </div>
          <button
            onClick={() => onNavigate('start')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
          >
            <span>دليل البدء الكامل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* State Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {NEED_BASED_PATHS.map((item) => {
            const isSelected = selectedNeedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedNeedId(item.id)}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-[#0a100d] border-white/10 hover:border-white/20 text-stone-300'
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-stone-300'}`}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Need Tailored Guidance Card */}
        {activeNeed && (
          <div className="p-4 bg-[#0a100d] border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span>{activeNeed.emoji}</span>
                <span>المسار الموصى به لـ: {activeNeed.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeNeed.desc}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={activeNeed.action}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>{activeNeed.actionLabel}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={activeNeed.secondaryAction}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-semibold rounded-xl transition-colors"
              >
                <span>{activeNeed.secondaryActionLabel}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. Section Overview Cards: اكتشف أقسام نسمة حياة */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>اكتشف أقسام «نسمة حياة»</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              رحلة متسلسلة من التعرف على نفسك واكتساب المهارات حتى خطط المساندة والدعم
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          {/* Card 1 */}
          <div className="p-5 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-emerald-500/15 text-emerald-300">🧭</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-semibold">01</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                ابدأ من هنا — التعرف على نسمة حياة
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                دليل تعريفي مبسط لرسالة المبادرة، وكيفية استخدام الموارد والأنشطة، وتوجيه الزائر دون تشخيص طبي.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('start')}
                className="w-full py-2 bg-white/5 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>اكتشف القسم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-amber-500/15 text-amber-300">📝</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-semibold">02</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                افهم نفسك — الوعي واستكشاف الذات
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                مقياس PHQ-9 المعتمد، الفحص الذاتي الأولي، بوصلة المشاعر، فحص مستوى الطاقة «بطاريتي كام؟»، وترجم مشاعرك.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('self-discovery')}
                className="w-full py-2 bg-white/5 hover:bg-amber-500 hover:text-black text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>اكتشف القسم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-purple-500/15 text-purple-300">🎮</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-semibold">03</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                خذ استراحة — الألعاب والأنشطة النفسية
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                لعبة جوايا حكاية، استوديو فكّر (CBT)، لعبة الحقيقة والحدوتة، فك العقدة، أصوات الطبيعة، وتفريغ الأفكار.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('games')}
                className="w-full py-2 bg-white/5 hover:bg-purple-500 hover:text-black text-purple-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>اكتشف القسم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-emerald-500/15 text-emerald-300">📖</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-semibold">04</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                تعلّم وطبّق — المقالات والتثقيف النفسي
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                مكتبة المقالات الكاملة الموثوقة، الجلسات الصوتية، كتيب نسمة حياة (12 فصلاً)، واستوديو الورش التطبيقية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('explore')}
                className="w-full py-2 bg-white/5 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>اكتشف القسم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-5 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-sky-500/15 text-sky-300">🧘</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-semibold">05</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                مارس المهارات — التمارين والتطبيقات
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                تمارين التنفس 4-7-8، استوديو اليقظة والتجذير 5-4-3-2-1، مدونة الأفكار، خطة السلامة، وبناء الحدود وميزانية الطاقة.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('practice')}
                className="w-full py-2 bg-white/5 hover:bg-sky-500 hover:text-black text-sky-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>اكتشف القسم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-5 bg-[#141C18] border border-white/10 hover:border-rose-500/50 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-rose-500/15 text-rose-300">🎒</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-stone-400 font-semibold">06</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                عندما تحتاج مساعدة — خطط المساندة
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                شنطة الإسعاف النفسي (الحزن، الهلع، الغضب، الاحتراق)، محاكاة غرفة الطوارئ، ودليل استشارة الطبيب.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('rescue')}
                className="w-full py-2 bg-white/5 hover:bg-rose-500 hover:text-black text-rose-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>اكتشف القسم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Featured Flagship Duo: تطبيق فكّر & لعبة جوايا حكاية */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Feker App Highlight */}
        <div className="p-6 bg-gradient-to-br from-[#1C2519] to-[#121A11] border border-lime-500/30 rounded-3xl space-y-3 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-300 font-bold">
                💡 استوديو تفكيك الأفكار
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              تطبيق «فكّر» — المرونة العقلية وتصحيح التفكير
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              فكك أفكارك السامة التلقائية واكشف أفخاخ التفكير، والعب تحدي «حقيقة أم حكاية»، وصغ بدائل منطقية متزنة.
            </p>
          </div>

          <button
            onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
            className="mt-4 py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-black text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 self-start"
          >
            <Brain className="w-4 h-4" />
            <span>فتح تطبيق فكّر 💡</span>
          </button>
        </div>

        {/* Gwaya Hekaya Highlight */}
        <div className="p-6 bg-gradient-to-br from-[#202E25] to-[#131E17] border border-emerald-500/30 rounded-3xl space-y-3 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">
                🪄 لعبة الاستكشاف الذاتي الكبرى
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              «جوايا حكاية» — العالم الذي يشرح نفسه
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              ٤ فصول واقعية و٦ محطات لاستكشاف ما يدور بداخلك وفصل الحقيقة الملموسة عن القصة القديمة، مع بطاقة الإنجاز.
            </p>
          </div>

          <button
            onClick={onOpenGwayaHekaya}
            className="mt-4 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 self-start"
          >
            <BookOpen className="w-4 h-4" />
            <span>بدء اللعبة التفاعلية ✨</span>
          </button>
        </div>

      </section>

      {/* 5. Suggested Readings: ممكن يهمك */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>ممكن يهمك الآن 🌱</span>
            </h2>
            <p className="text-xs text-stone-400">مقالات وتأملات هادئة تدعم يومك</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>مكتبة المقالات كاملة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestedContent.map((item) => {
            const isFav = savedFavorites.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onOpenContent(item.id)}
                className="cursor-pointer bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                    <span className="font-bold text-emerald-400">
                      {item.subCategory || item.category}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, item.id)}
                      className={`p-1 rounded-full transition-colors ${
                        isFav ? 'text-rose-500' : 'text-stone-500 hover:text-stone-300'
                      }`}
                      aria-label="حفظ في المفضلة"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{item.duration}</span>
                  {item.contentType === 'audio' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAudioModal(item.title, item.category, 5);
                      }}
                      className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استمع الآن</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold group-hover:underline">
                      قراءة المقال ←
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Booklet Feature Callout */}
      <section className="bg-gradient-to-r from-[#1E2B22] via-[#16221A] to-[#121A15] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>إصدار مبادرة نسمة حياة التفاعلي</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            كتيب «نسمة حياة» · دليل مبسط للصحة النفسية
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            «كثيرون يعيشون الحياة... وقليلون يستمتعون بها» — 12 فصلاً صغيراً تفاعلياً يساعدك على فهم ما يحدث لك، واكتشاف العلامات المبكرة، ومتى تحتاج إلى مختص.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={onOpenBooklet}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>تصفح الكتيب كاملاً 📖</span>
          </button>
          <button
            onClick={onOpenPersonalPlan}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>خطتي الخاصة 📑</span>
          </button>
        </div>
      </section>

      {/* 7. Comprehensive Humane Footer */}
      <footer className="border-t border-white/10 pt-8 pb-4 text-stone-400 space-y-6 text-right">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="شعار نسمة حياة" className="w-8 h-8 rounded-xl object-cover" />
              <span className="font-bold text-white text-sm">نسمة حياة</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              مبادرة عربية إنسانية لنشر الوعي بالصحة النفسية ومساندة الأفراد في رحلة استكشاف الذات والتعافي بكرامة وأمان.
            </p>
            <div className="pt-1">
              <PWAInstallButton variant="compact" />
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="font-bold text-white block text-xs">أقسام ومسارات سريعة</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button onClick={() => onNavigate('start')} className="text-right hover:text-emerald-400">ابدأ من هنا</button>
              <button onClick={() => onNavigate('self-discovery')} className="text-right hover:text-emerald-400">افهم نفسك</button>
              <button onClick={() => onNavigate('games')} className="text-right hover:text-emerald-400">خذ استراحة</button>
              <button onClick={() => onNavigate('explore')} className="text-right hover:text-emerald-400">تعلّم وطبّق</button>
              <button onClick={() => onNavigate('practice')} className="text-right hover:text-emerald-400">مارس المهارات</button>
              <button onClick={() => onNavigate('rescue')} className="text-right hover:text-emerald-400">خطط المساندة</button>
              <button onClick={() => onNavigate('support')} className="text-right hover:text-emerald-400">اطلب الدعم</button>
              <button onClick={() => onNavigate('profile')} className="text-right hover:text-emerald-400">حسابي والأسئلة</button>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="font-bold text-white block text-xs">طوارئ ومساندة عاجلة</span>
            <p className="text-[11px] leading-relaxed text-stone-400">
              إن كنت تمر بأزمة حادة أو أفكار مؤذية، لا تبقَ وحدك. تواصل فوراً مع خطوط المساعدة المجانية الرسمية:
            </p>
            <button
              onClick={onOpenEmergencyHelp}
              className="py-1.5 px-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-bold hover:bg-rose-500/25 transition-colors inline-flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>أرقام الطوارئ والمساعدة الفورية</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} مبادرة «نسمة حياة» للصحة النفسية.
          </div>
          <div className="text-stone-400">
            المحتوى للتوعية والمساندة الذاتية ولا يغني عن التشخيص أو العلاج المتخصص.
          </div>
        </div>
      </footer>

    </div>
  );
};
