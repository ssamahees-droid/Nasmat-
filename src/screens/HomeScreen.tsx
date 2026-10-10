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
  FileText,
  SlidersHorizontal,
  Flame,
  BatteryCharging
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

const MOOD_OPTIONS: { id: MoodValue; label: string; emoji: string; tip: string }[] = [
  { id: 'good', label: 'كويس وراضي', emoji: '😊', tip: 'جميل أن تعيش لحظات الرضا، احتفظ بهذا الشعور في يومك 🌱' },
  { id: 'fair', label: 'مقبول / عادي', emoji: '😐', tip: 'يوم هادئ ومستقر، خذ وقتاً للاعتناء بما تحبه 🍃' },
  { id: 'confused', label: 'مش عارف مالي', emoji: '🤔', tip: 'التشوش طبيعي أحياناً؛ جرب بوصلة المشاعر لترتيب ما يدور بداخلك 🧭' },
  { id: 'not_good', label: 'مش كويس ومضغوط', emoji: '😔', tip: 'نحن معك؛ تمرين التنفس أو تفريغ الأفكار قد يخفف الحمل الآن 🌿' },
  { id: 'exhausted', label: 'طاقتي نفدت', emoji: '😫', tip: 'بطاريتك تحتاج شحناً؛ خذ استراحة فورية دون تأنيب ضمير 🔋' },
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
  const isDark = theme === 'dark';

  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = storage.getDailyCheckins().find(c => c.date === today);
    return todayCheckin ? todayCheckin.moodValue : null;
  });
  const [justSavedCheckin, setJustSavedCheckin] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState<string[]>(storage.getFavorites());
  const [activeShelf, setActiveShelf] = useState<'featured' | 'needs' | 'readings'>('featured');
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
  const activeMoodObj = MOOD_OPTIONS.find(m => m.id === selectedMood);

  const suggestedContent: ContentItem[] = storage.getContent()
    .filter(c => c.isSuggested || c.reviewStatus === 'published')
    .slice(0, 3);

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    storage.addDailyCheckin(mood);
    setJustSavedCheckin(true);
    setTimeout(() => setJustSavedCheckin(false), 4000);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    storage.toggleFavorite(id);
    setSavedFavorites(storage.getFavorites());
  };

  return (
    <div className={`pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-10 animate-fade-in text-right ${isDark ? 'text-[#e8ede9]' : 'text-[#1a2920]'}`}>
      
      {/* 1. Welcoming Hero: بهو الجنينة والترحيب الهادئ */}
      <section className={`border rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-[#16231b] via-[#101914] to-[#0b100d] border-emerald-500/20' 
          : 'bg-gradient-to-br from-[#f0f7f2] via-[#e8f2eb] to-[#e0ede4] border-emerald-600/15'
      }`}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            {/* Initiative Logo & Identity */}
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
                <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  مساحة عربية آمنة تفهمك وتساندك
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal drop-shadow-xs">
              أهلاً بك في نسمة حياة 🌿
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              هنا جنينتك الهادئة... مساحة مخصصة للتعرف على مشاعرك، وتخفيف أثقال اليوم، واكتساب مهارات عملية تدعم سلامك الداخلي بكرامة ووضوح دون تعقيد أو أحكام مسبقة.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('start')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>جولة في الجنينة (ابدأ من هنا)</span>
              </button>
              
              <button
                onClick={() => onNavigate('breathe')}
                className={`px-4 py-2.5 border rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10' 
                    : 'bg-white/80 hover:bg-white text-stone-800 border-emerald-600/20 shadow-xs'
                }`}
              >
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>دقيقة تنفس هادئة</span>
              </button>
            </div>
          </div>

          {/* Calming Principles Box */}
          <div className={`hidden lg:flex flex-col gap-2 shrink-0 border p-4 rounded-2xl text-xs min-w-[220px] ${
            isDark 
              ? 'bg-black/30 border-white/10 text-stone-300' 
              : 'bg-white/60 border-emerald-600/15 text-stone-800 shadow-xs'
          }`}>
            <div className={`font-bold text-xs border-b pb-2 flex items-center gap-1.5 ${isDark ? 'text-white border-white/10' : 'text-stone-900 border-emerald-600/15'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>مبادئ نسمة حياة الأساسية</span>
            </div>
            <div className={`space-y-1.5 text-[11px] pt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              <div>✓ خصوصية وسرية تامة</div>
              <div>✓ محتوى موثوق ومراجع نفسياً</div>
              <div>✓ استكشاف ذاتي بلا أحكام</div>
              <div>✓ مساندة حقيقية بكرامة</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emotional Mood Check-in & Daily Oasis: ركن الاطمئنان اليومي */}
      <section className={`p-5 sm:p-6 border rounded-3xl space-y-4 shadow-md transition-all ${
        isDark 
          ? 'bg-[#121a15] border-white/10' 
          : 'bg-white border-emerald-600/15 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              <span>إنت عامل إيه النهارده؟</span>
              {justSavedCheckin && (
                <span className="text-xs text-emerald-400 font-bold animate-fade-in flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  تم الحفظ في رحلتك ✓
                </span>
              )}
            </h2>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              تسجيل شعورك اليومي خطوة أولى لملاحظة نمط مشاعرك واحتياجاتك
            </p>
          </div>

          {/* Quick Oasis Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenDailyWisdom}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-emerald-300' 
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}
            >
              <span>حكمة اليوم 📜</span>
            </button>
            <button
              onClick={onOpenSoundscapeStudio}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-emerald-300' 
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}
            >
              <span>أصوات الطبيعة 🎧</span>
            </button>
            <button
              onClick={onOpenEmotionCompass}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-emerald-300' 
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}
            >
              <span>بوصلة المشاعر 🧭</span>
            </button>
          </div>
        </div>

        {/* 5 Calming Mood Emojis */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold shadow-sm'
                      : 'border-emerald-600 bg-emerald-100 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-500/30'
                    : isDark
                      ? 'border-white/10 hover:border-emerald-500/40 bg-[#0e1411] text-stone-300'
                      : 'border-stone-200 hover:border-emerald-500/40 bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tailored Tip Whisper if Mood Selected */}
        {activeMoodObj && (
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            isDark 
              ? 'bg-[#0a100d] border-emerald-500/20 text-emerald-300/90' 
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          }`}>
            <span className="leading-relaxed">💡 {activeMoodObj.tip}</span>
            <button 
              onClick={() => onNavigate('journey')}
              className="text-emerald-400 hover:underline font-bold shrink-0 text-[11px] cursor-pointer"
            >
              دفتر رحلتي ←
            </button>
          </div>
        )}
      </section>

      {/* 3. The 6 Garden Gates: بوابات الجنينة الست الرئيسية */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-1">
              <span>مسارات الجنينة المنظمة</span>
            </div>
            <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              <span>بوابات «نسمة حياة» الست</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              كل قسم يمثل ركناً مستقلاً هادئاً يمنحك تجربة متكاملة دون تشتيت
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Gate 1: ابدأ من هنا */}
          <div className={`p-5 border rounded-2xl transition-all shadow-md flex flex-col justify-between group ${
            isDark ? 'bg-[#121a15] border-white/10 hover:border-emerald-500/50' : 'bg-white border-stone-200 hover:border-emerald-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-emerald-500/15 text-emerald-300">🌱</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-emerald-400 font-bold">بوابة 01</span>
              </div>
              <h3 className={`text-base font-bold transition-colors group-hover:text-emerald-400 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                ابدأ من هنا — التعرف على المبادرة
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                دليلك الترحيبي الأول لفهم رسالة المبادرة، وميثاق الأمان، وكيفية الاستفادة من الموارد دون أي تعقيد.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('start')}
                className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>دخول الرواق</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gate 2: افهم نفسك */}
          <div className={`p-5 border rounded-2xl transition-all shadow-md flex flex-col justify-between group ${
            isDark ? 'bg-[#121a15] border-white/10 hover:border-amber-500/50' : 'bg-white border-stone-200 hover:border-amber-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-amber-500/15 text-amber-300">🧭</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-amber-400 font-bold">بوابة 02</span>
              </div>
              <h3 className={`text-base font-bold transition-colors group-hover:text-amber-300 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                افهم نفسك — الوعي واستكشاف الذات
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                مقياس PHQ-9 المعتمد، الفحص الذاتي الأولي، بوصلة المشاعر، فحص مستوى الطاقة «بطاريتي كام؟»، وترجم مشاعرك.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('self-discovery')}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>دخول المحراب</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gate 3: خذ استراحة */}
          <div className={`p-5 border rounded-2xl transition-all shadow-md flex flex-col justify-between group ${
            isDark ? 'bg-[#121a15] border-white/10 hover:border-purple-500/50' : 'bg-white border-stone-200 hover:border-purple-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-purple-500/15 text-purple-300">🎈</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-purple-400 font-bold">بوابة 03</span>
              </div>
              <h3 className={`text-base font-bold transition-colors group-hover:text-purple-300 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                خذ استراحة — الألعاب والأنشطة النفسية
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                لعبة جوايا حكاية، استوديو فكّر (CBT)، لعبة الحقيقة والحدوتة، فك العقدة، أصوات الطبيعة، وتفريغ الأفكار.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('games')}
                className="w-full py-2 bg-purple-500/10 hover:bg-purple-500 hover:text-black text-purple-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>دخول الواحة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gate 4: تعلّم وطبّق */}
          <div className={`p-5 border rounded-2xl transition-all shadow-md flex flex-col justify-between group ${
            isDark ? 'bg-[#121a15] border-white/10 hover:border-emerald-500/50' : 'bg-white border-stone-200 hover:border-emerald-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-emerald-500/15 text-emerald-300">📖</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-emerald-400 font-bold">بوابة 04</span>
              </div>
              <h3 className={`text-base font-bold transition-colors group-hover:text-emerald-300 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                تعلّم وطبّق — الكتيب والمقالات والورش
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                كتيب نسمة حياة (12 فصلاً تفاعلياً)، مكتبة المقالات الموثوقة، الجلسات الصوتية، واستوديو الورش التطبيقية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('explore')}
                className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>دخول البستان</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gate 5: مارس المهارات */}
          <div className={`p-5 border rounded-2xl transition-all shadow-md flex flex-col justify-between group ${
            isDark ? 'bg-[#121a15] border-white/10 hover:border-sky-500/50' : 'bg-white border-stone-200 hover:border-sky-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-sky-500/15 text-sky-300">🧘</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-sky-400 font-bold">بوابة 05</span>
              </div>
              <h3 className={`text-base font-bold transition-colors group-hover:text-sky-300 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                مارس المهارات — التمارين والتطبيقات
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                تمارين التنفس 4-7-8، استوديو اليقظة والتجذير 5-4-3-2-1، مدونة الأفكار، خطة السلامة، وبناء الحدود.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('practice')}
                className="w-full py-2 bg-sky-500/10 hover:bg-sky-500 hover:text-black text-sky-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>دخول الميدان</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gate 6: خطط المساندة */}
          <div className={`p-5 border rounded-2xl transition-all shadow-md flex flex-col justify-between group ${
            isDark ? 'bg-[#121a15] border-white/10 hover:border-rose-500/50' : 'bg-white border-stone-200 hover:border-rose-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-rose-500/15 text-rose-300">🛡️</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-rose-400 font-bold">بوابة 06</span>
              </div>
              <h3 className={`text-base font-bold transition-colors group-hover:text-rose-300 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                عندما تحتاج مساعدة — خطط المساندة
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                شنطة الإسعاف النفسي (الحزن، الهلع، الاحتراق، الغضب)، محاكاة غرفة الطوارئ، وتذاكر الدعم السري.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigate('rescue')}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500 hover:text-black text-rose-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>دخول الملاذ</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Organized Perspective Shelves: أركان الجنينة المنظمة عبر تبويبات ذكية */}
      <section className="space-y-5">
        
        {/* Shelf Tabs Control */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div>
            <span className="text-xs text-emerald-400 font-bold block">استكشف بمستوى تركيز هادئ</span>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              أركان الجنينة التفاعلية
            </h3>
          </div>

          <div className={`flex items-center p-1 rounded-xl border text-xs ${
            isDark ? 'bg-[#0e1411] border-white/10' : 'bg-stone-100 border-stone-200'
          }`}>
            <button
              onClick={() => setActiveShelf('featured')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeShelf === 'featured'
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ⭐ الإصدارات والألعاب الكبرى
            </button>
            <button
              onClick={() => setActiveShelf('needs')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeShelf === 'needs'
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🧭 حسب احتياجك اللحظي
            </button>
            <button
              onClick={() => setActiveShelf('readings')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                activeShelf === 'readings'
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌱 قراءات وتأملات هادئة
            </button>
          </div>
        </div>

        {/* Shelf 1: Major Releases & Flagship Tools */}
        {activeShelf === 'featured' && (
          <div className="space-y-5 animate-fade-in">
            {/* Booklet Banner */}
            <div className={`border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-md ${
              isDark 
                ? 'bg-gradient-to-r from-[#1b281f] via-[#141f18] to-[#0e1612] border-emerald-500/30' 
                : 'bg-gradient-to-r from-[#eef7f1] via-[#e6f3eb] to-[#dff0e5] border-emerald-600/20 shadow-xs'
            }`}>
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <BookOpen className="w-4 h-4" />
                  <span>إصدار مبادرة نسمة حياة التفاعلي</span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  كتيب «نسمة حياة» · دليل مبسط للصحة النفسية
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  «كثيرون يعيشون الحياة... وقليلون يستمتعون بها» — 12 فصلاً صغيراً تفاعلياً يساعدك على فهم ما يحدث لك، واكتشاف العلامات المبكرة، ومتى تحتاج إلى مختص.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  onClick={onOpenBooklet}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>تصفح الكتيب كاملاً 📖</span>
                </button>
                <button
                  onClick={onOpenPersonalPlan}
                  className={`px-4 py-2.5 border rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10' 
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-emerald-600/20 shadow-xs'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>خطتي الخاصة 📑</span>
                </button>
              </div>
            </div>

            {/* Flagship Duo: Feker & Gwaya Hekaya */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Feker App Highlight */}
              <div className={`p-6 border rounded-3xl space-y-3 shadow-md flex flex-col justify-between ${
                isDark 
                  ? 'bg-gradient-to-br from-[#192416] to-[#10180e] border-lime-500/30' 
                  : 'bg-gradient-to-br from-[#f2f8ed] to-[#e7f3dd] border-lime-600/25'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-bold">
                      💡 استوديو تفكيك الأفكار
                    </span>
                  </div>
                  <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    تطبيق «فكّر» — المرونة العقلية وتصحيح التفكير
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    فكك أفكارك السامة التلقائية واكشف أفخاخ التفكير، والعب تحدي «حقيقة أم حكاية»، وصغ بدائل منطقية متزنة.
                  </p>
                </div>

                <button
                  onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
                  className="mt-4 py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-black text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 self-start cursor-pointer shadow-xs"
                >
                  <Brain className="w-4 h-4" />
                  <span>فتح تطبيق فكّر 💡</span>
                </button>
              </div>

              {/* Gwaya Hekaya Highlight */}
              <div className={`p-6 border rounded-3xl space-y-3 shadow-md flex flex-col justify-between ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1c2921] to-[#121c16] border-emerald-500/30' 
                  : 'bg-gradient-to-br from-[#eaf5ee] to-[#ddede2] border-emerald-600/25'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 font-bold">
                      🪄 لعبة الاستكشاف الذاتي الكبرى
                    </span>
                  </div>
                  <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    «جوايا حكاية» — العالم الذي يشرح نفسه
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    ٤ فصول واقعية و٦ محطات لاستكشاف ما يدور بداخلك وفصل الحقيقة الملموسة عن القصة القديمة، مع بطاقة الإنجاز.
                  </p>
                </div>

                <button
                  onClick={onOpenGwayaHekaya}
                  className="mt-4 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 self-start cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>بدء اللعبة التفاعلية ✨</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Shelf 2: Need-Based Paths */}
        {activeShelf === 'needs' && (
          <div className={`p-5 sm:p-6 border rounded-3xl space-y-4 shadow-md animate-fade-in ${
            isDark ? 'bg-[#121a15] border-emerald-500/20' : 'bg-white border-emerald-600/15'
          }`}>
            <div className="border-b border-white/10 pb-3">
              <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                ما الذي يصف ما تمر به في هذه اللحظة؟
              </h4>
              <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                اختر حالتك لنقترح عليك الخطوة الأنسب فوراً دون حيرة
              </p>
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
                        ? isDark
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/30'
                          : 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                        : isDark
                          ? 'bg-[#0a100d] border-white/10 hover:border-white/20 text-stone-300'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : ''}`}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Need Tailored Guidance Card */}
            {activeNeed && (
              <div className={`p-4 border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDark ? 'bg-[#0a100d] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <span>{activeNeed.emoji}</span>
                    <span>المسار الموصى به لـ: {activeNeed.title}</span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    {activeNeed.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={activeNeed.action}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{activeNeed.actionLabel}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={activeNeed.secondaryAction}
                    className={`px-3 py-2 border text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-300' 
                        : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-800'
                    }`}
                  >
                    <span>{activeNeed.secondaryActionLabel}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shelf 3: Suggested Readings */}
        {activeShelf === 'readings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestedContent.map((item) => {
                const isFav = savedFavorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => onOpenContent(item.id)}
                    className={`cursor-pointer border rounded-2xl p-4 transition-all shadow-sm flex flex-col justify-between group ${
                      isDark 
                        ? 'bg-[#121a15] hover:bg-[#18241d] border-white/10 hover:border-emerald-500/40' 
                        : 'bg-white hover:bg-emerald-50/30 border-stone-200 hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="font-bold text-emerald-400">
                          {item.subCategory || item.category}
                        </span>
                        <button
                          onClick={(e) => handleToggleFavorite(e, item.id)}
                          className={`p-1 rounded-full transition-colors cursor-pointer ${
                            isFav ? 'text-rose-500' : 'text-stone-500 hover:text-stone-300'
                          }`}
                          aria-label="حفظ في المفضلة"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <h4 className={`font-bold text-sm group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-1.5 ${
                        isDark ? 'text-white' : 'text-stone-900'
                      }`}>
                        {item.title}
                      </h4>

                      <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
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
                          className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline cursor-pointer"
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

            <div className="text-center pt-2">
              <button
                onClick={() => onNavigate('explore')}
                className={`text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer`}
              >
                <span>تصفح مكتبة المقالات والجلسات الصوتية كاملة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </section>

      {/* 5. Humane Footer & Dignified Safety Haven: خاتمة الجنينة وملاذ الأمان */}
      <footer className="border-t border-white/10 pt-8 pb-4 text-stone-400 space-y-6 text-right">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          
          {/* Col 1: Brand & PWA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="شعار نسمة حياة" className="w-8 h-8 rounded-xl object-cover" />
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-stone-900'}`}>نسمة حياة</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              مبادرة عربية إنسانية لنشر الوعي بالصحة النفسية ومساندة الأفراد في رحلة استكشاف الذات والتعافي بكرامة وأمان.
            </p>
            <div className="pt-1">
              <PWAInstallButton variant="compact" />
            </div>
          </div>

          {/* Col 2: Garden Pathways Navigation */}
          <div className="space-y-2">
            <span className={`font-bold block text-xs ${isDark ? 'text-white' : 'text-stone-900'}`}>أقسام الجنينة ومساراتها</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button onClick={() => onNavigate('start')} className="text-right hover:text-emerald-400 cursor-pointer">ابدأ من هنا</button>
              <button onClick={() => onNavigate('self-discovery')} className="text-right hover:text-emerald-400 cursor-pointer">افهم نفسك</button>
              <button onClick={() => onNavigate('games')} className="text-right hover:text-emerald-400 cursor-pointer">خذ استراحة</button>
              <button onClick={() => onNavigate('explore')} className="text-right hover:text-emerald-400 cursor-pointer">تعلّم وطبّق</button>
              <button onClick={() => onNavigate('practice')} className="text-right hover:text-emerald-400 cursor-pointer">مارس المهارات</button>
              <button onClick={() => onNavigate('rescue')} className="text-right hover:text-emerald-400 cursor-pointer">خطط المساندة</button>
              <button onClick={() => onNavigate('support')} className="text-right hover:text-emerald-400 cursor-pointer">اطلب الدعم</button>
              <button onClick={() => onNavigate('profile')} className="text-right hover:text-emerald-400 cursor-pointer">حسابي والأسئلة</button>
            </div>
          </div>

          {/* Col 3: Emergency & Urgent Care */}
          <div className="space-y-2">
            <span className={`font-bold block text-xs ${isDark ? 'text-white' : 'text-stone-900'}`}>طوارئ ومساندة عاجلة</span>
            <p className="text-[11px] leading-relaxed text-stone-400">
              إن كنت تمر بأزمة حادة أو أفكار مؤذية، لا تبقَ وحدك. تواصل فوراً مع خطوط المساعدة المجانية الرسمية:
            </p>
            <button
              onClick={onOpenEmergencyHelp}
              className="py-1.5 px-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-bold hover:bg-rose-500/25 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
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
