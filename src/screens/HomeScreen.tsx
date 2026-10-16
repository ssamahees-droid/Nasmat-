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
  BatteryCharging,
  RotateCw,
  Play
} from 'lucide-react';
import { MoodValue, ContentItem } from '../types';
import { storage } from '../services/storage';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { CompanionHeroSection } from '../components/CompanionHeroSection';
import { NesmatGuideBanner } from '../components/NesmatGuideBanner';
import { useLanguage } from '../context/LanguageContext';

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
  onOpenMoodKitchen?: () => void;
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
  onOpenCompanion?: () => void;
  onOpenInnerBurdens?: () => void;
  onOpenEmotionalBridge?: () => void;
  onOpenGratitudeGarden?: () => void;
  onOpenInnerCompass?: () => void;
  theme?: 'dark' | 'light' | 'system';
}

const MOOD_OPTIONS: { id: MoodValue; label: string; emoji: string; tip: string }[] = [
  { id: 'good', label: 'كويس وراضي', emoji: '😊', tip: 'جميل أن تعيش لحظات الرضا، احتفظ بهذا الشعور في يومك 🌱' },
  { id: 'fair', label: 'مقبول / عادي', emoji: '😐', tip: 'يوم هادئ ومستقر، خذ وقتاً للاعتناء بما تحبه 🍃' },
  { id: 'confused', label: 'مش عارف مالي', emoji: '🤔', tip: 'التشوش طبيعي أحياناً؛ جرب بوصلة المشاعر لترتيب ما يدور بداخلك 🧭' },
  { id: 'not_good', label: 'مش كويس ومضغوط', emoji: '😔', tip: 'نحن معك؛ تمرين التنفس أو تفريغ الأفكار قد يخفف الحمل الآن 🌿' },
  { id: 'exhausted', label: 'طاقتي نفدت', emoji: '😫', tip: 'بطاريتك تحتاج شحناً؛ خذ استراحة فورية دون تأنيب ضمير 🔋' },
];

interface WheelSectionItem {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  bgHex: string;
  textColor: string;
  action: () => void;
}

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
  onOpenMoodKitchen,
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
  onOpenCompanion,
  onOpenInnerBurdens,
  onOpenEmotionalBridge,
  onOpenGratitudeGarden,
  onOpenInnerCompass,
  theme = 'dark'
}) => {
  const { t, language } = useLanguage();
  const isDark = theme === 'dark';
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = storage.getDailyCheckins().find(c => c.date === today);
    return todayCheckin ? todayCheckin.moodValue : null;
  });
  const [justSavedCheckin, setJustSavedCheckin] = useState(false);

  // Spin Wheel Sections with dynamic brand-aligned color coding matching each section's emotional tone
  const WHEEL_SECTIONS: WheelSectionItem[] = [
    {
      id: 'mood_kitchen',
      title: 'مطبخ المزاج',
      desc: 'غذاء يدعم أمعاءك وعافيتك النفسية بوصفات منزلية بسيطة',
      emoji: '🍲',
      bgHex: '#059669', // Emerald - Gut & Nourishment
      textColor: 'text-emerald-100',
      action: () => onOpenMoodKitchen ? onOpenMoodKitchen() : onNavigate('explore')
    },
    {
      id: 'feker',
      title: 'تطبيق فكّر',
      desc: 'فكك أفكارك السامة التلقائية واكشف أفخاخ التفكير',
      emoji: '💡',
      bgHex: '#65a30d', // Lime Green - Mental Clarity & Growth
      textColor: 'text-lime-100',
      action: () => onOpenFeker ? onOpenFeker() : onNavigate('games')
    },
    {
      id: 'gwaya_hekaya',
      title: 'جوايا حكاية',
      desc: 'العالم الذي يشرح نفسه واستكشاف ما يدور بداخلك',
      emoji: '📖',
      bgHex: '#0d9488', // Teal - Self Discovery
      textColor: 'text-teal-100',
      action: () => onOpenGwayaHekaya()
    },
    {
      id: 'breathe',
      title: 'التنفس الهادئ',
      desc: 'تمرين 4-7-8 لتهدئة الجهاز العصبي فوراً',
      emoji: '🌊',
      bgHex: '#0284c7', // Sky Blue - Calming Nervous System
      textColor: 'text-sky-100',
      action: () => onNavigate('breathe')
    },
    {
      id: 'emotion_compass',
      title: 'بوصلة المشاعر',
      desc: 'استكشاف وتسمية ما تشعر به بدقة وترتيبه',
      emoji: '🧭',
      bgHex: '#d97706', // Warm Amber - Emotional Navigation
      textColor: 'text-amber-100',
      action: () => onOpenEmotionCompass()
    },
    {
      id: 'rescue',
      title: 'إسعافات الطوارئ',
      desc: 'خطة سريعة وقت الضيق الشديد والتوتر الحاد',
      emoji: '🆘',
      bgHex: '#e11d48', // Rose / Red - Crisis Relief
      textColor: 'text-rose-100',
      action: () => onNavigate('rescue')
    },
    {
      id: 'battery_check',
      title: 'شاحن الطاقة',
      desc: 'معرفة ما يستنزف طاقتك النفسية وكيف تشحنها',
      emoji: '🔋',
      bgHex: '#7c3aed', // Purple - Energy & Balance
      textColor: 'text-purple-100',
      action: () => onOpenBatteryCheck()
    },
    {
      id: 'games',
      title: 'الألعاب النفسية',
      desc: 'فرقعة الأعباء، الجسر العاطفي، وحديقة الامتنان',
      emoji: '🎈',
      bgHex: '#db2777', // Pink - Playful Relief
      textColor: 'text-pink-100',
      action: () => onNavigate('games')
    },
    {
      id: 'explore',
      title: 'الكتيب والورش',
      desc: 'مكتبة التثقيف النفسي الشاملة والورش التفاعلية',
      emoji: '📚',
      bgHex: '#b45309', // Deep Amber - Knowledge & Wisdom
      textColor: 'text-amber-100',
      action: () => onNavigate('explore')
    },
    {
      id: 'weekly',
      title: 'الجلسة الأسبوعية',
      desc: 'التأمل والمراجعة الأسبوعية الشاملة للنمو',
      emoji: '📅',
      bgHex: '#047857', // Forest Green - Weekly Reflection
      textColor: 'text-emerald-100',
      action: () => onNavigate('weekly')
    },
    {
      id: 'listen_safety',
      title: 'اسمع نفسك وأمانك',
      desc: 'مساحة أمانك الداخلي، احتواء الذات، والحوار المتزن',
      emoji: '🛡️',
      bgHex: '#0f766e', // Deep Teal - Inner Safety & Containment
      textColor: 'text-teal-100',
      action: () => onNavigate('listen-to-yourself')
    }
  ];

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [selectedSection, setSelectedSection] = useState<WheelSectionItem | null>(null);
  const [viewingDetailSection, setViewingDetailSection] = useState<WheelSectionItem | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSection(null);
    setViewingDetailSection(null);

    const randomExtra = 1800 + Math.floor(Math.random() * 1080);
    const newRotation = spinRotation + randomExtra;
    setSpinRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * WHEEL_SECTIONS.length);
      setSelectedSection(WHEEL_SECTIONS[randomIndex]);
    }, 2000);
  };

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    storage.addDailyCheckin(mood);
    setJustSavedCheckin(true);
    setTimeout(() => setJustSavedCheckin(false), 4000);
  };

  const activeMoodObj = MOOD_OPTIONS.find(m => m.id === selectedMood);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-fade-in">
      {/* 1. Welcome & Greeting Banner */}
      <section className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border shadow-lg ${
        isDark 
          ? 'bg-gradient-to-br from-[#12221A] via-[#111B17] to-[#0A120E] border-emerald-500/30' 
          : 'bg-gradient-to-br from-[#f0f7f2] via-[#e8f2eb] to-[#e0ede4] border-emerald-600/15'
      }`}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
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
              {t('home.welcome', 'أهلاً بك في نسمة حياة 🌿')}
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              {t('home.welcomeDesc', 'هنا جنينتك الهادئة... مساحة مخصصة للتعرف على مشاعرك، وتخفيف أثقال اليوم، واكتساب مهارات عملية تدعم سلامك الداخلي بكرامة ووضوح دون تعقيد أو أحكام مسبقة.')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('start')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{t('home.startTour', 'جولة في الجنينة (ابدأ من هنا)')}</span>
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
                <span>{t('home.breatheMinute', 'دقيقة تنفس هادئة')}</span>
              </button>

              {onOpenCompanion && (
                <button
                  onClick={onOpenCompanion}
                  className="px-4 py-2.5 bg-linear-to-r from-[#174C3C] to-[#254234] hover:from-[#2A493B] hover:to-[#1B3126] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer border border-emerald-400/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('home.talkCompanion', 'تحدث مع رفيقي 🌿')}</span>
                </button>
              )}
            </div>
          </div>

          <div className={`hidden lg:flex flex-col gap-2 shrink-0 border p-4 rounded-2xl text-xs min-w-[220px] ${
            isDark 
              ? 'bg-black/30 border-white/10 text-stone-300' 
              : 'bg-white/60 border-emerald-600/15 text-stone-800 shadow-xs'
          }`}>
            <div className={`font-bold text-xs border-b pb-2 flex items-center gap-1.5 ${isDark ? 'text-white border-white/10' : 'text-stone-900 border-emerald-600/15'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('home.principles', 'مبادئ نسمة حياة الأساسية')}</span>
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

      {/* 🌿 Daily Mood Check-In */}
      <section className={`p-6 border rounded-3xl space-y-4 shadow-sm ${
        isDark ? 'bg-[#14221A] border-emerald-500/20' : 'bg-white border-emerald-600/15'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">مساحة تفقد المشاعر اليومية</span>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>كيف حال مشاعرك في هذه اللحظة؟</h3>
          </div>
          {justSavedCheckin && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> تم تسجيل حالتك اليومية 🌱
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {MOOD_OPTIONS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isSelected 
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md scale-102' 
                    : isDark 
                      ? 'bg-black/20 border-white/10 text-stone-300 hover:border-emerald-500/40' 
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-500/40'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-bold block">{m.label}</span>
              </button>
            );
          })}
        </div>

        {activeMoodObj && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 animate-fade-in ${
            isDark ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-600/20 text-emerald-900'
          }`}>
            <span className="text-lg">🌿</span>
            <p className="font-medium leading-relaxed">{activeMoodObj.tip}</p>
          </div>
        )}
      </section>

      {/* 🎡 عجلة الحظ التفاعلية — مطابقة ديناميكياً للهوية البصرية */}
      <section className={`p-6 sm:p-8 border rounded-3xl space-y-6 shadow-md text-center relative overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-[#122018] via-[#101914] to-[#0A100C] border-emerald-500/30' : 'bg-gradient-to-br from-[#f4faf5] to-[#eaf4ed] border-emerald-600/20'
      }`}>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {!viewingDetailSection ? (
          <>
            <div className="space-y-2 relative z-10 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>عجلة الحظ التفاعلية ذات الألوان الشعورية المتناسقة</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                دكّن العجلة... ودعنا نقترح عليك القسم الأنسب لخطوتك اليوم 🎡
              </h2>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                كل قطاع يعكس بطابع هادئ وألوان متناسقة طابع القسم وهدفه النفسي.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 relative z-10 py-4">
              <div className="relative w-68 h-68 sm:w-80 sm:h-80 rounded-full border-4 border-emerald-500/40 p-2 shadow-2xl bg-black/30 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-1 z-30 w-6 h-8 bg-amber-400 shadow-md" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />

                <div 
                  className="w-full h-full rounded-full relative transition-transform duration-2500 ease-out flex items-center justify-center shadow-inner"
                  style={{ transform: `rotate(${spinRotation}deg)` }}
                >
                  {WHEEL_SECTIONS.map((sec, idx) => {
                    const angle = (idx * 360) / WHEEL_SECTIONS.length;
                    return (
                      <div 
                        key={sec.id}
                        className="absolute inset-0 flex items-start justify-center pt-2"
                        style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}
                      >
                        <div 
                          className="flex flex-col items-center text-center px-1.5 py-1 rounded-xl shadow-xs"
                          style={{ backgroundColor: sec.bgHex, minWidth: '50px' }}
                        >
                          <span className="text-lg drop-shadow-sm">{sec.emoji}</span>
                          <span className="text-[9px] font-black text-white truncate max-w-[55px]">{sec.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="absolute z-20 w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 border-4 border-white/25 shadow-xl flex items-center justify-center text-white font-black text-xs">
                  🌿
                </div>
              </div>

              {!selectedSection ? (
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className={`px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer text-sm ${
                    isSpinning ? 'opacity-70 cursor-not-allowed animate-pulse' : ''
                  }`}
                >
                  <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'جاري دوران العجلة...' : 'يلا نلف العجلة! 🎡'}</span>
                </button>
              ) : (
                <div className={`w-full max-w-md p-6 rounded-3xl border shadow-xl animate-fade-in space-y-4 text-center ${
                  isDark ? 'bg-[#182c21] border-emerald-500/40' : 'bg-white border-emerald-600/30'
                }`}>
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl shadow-md mx-auto text-white"
                    style={{ backgroundColor: selectedSection.bgHex }}
                  >
                    {selectedSection.emoji}
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">النتيجة التي اختارتها العجلة لك اليوم</span>
                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {selectedSection.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {selectedSection.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setViewingDetailSection(selectedSection);
                      }}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>افتح القسم 🌿</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSection(null);
                        handleSpinWheel();
                      }}
                      className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isDark ? 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10' : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>إعادة اللف 🎡</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Dedicated Section Independent View with Back Button */
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl animate-fade-in space-y-6 text-right ${
            isDark ? 'bg-[#15251d] border-emerald-500/40 text-white' : 'bg-white border-emerald-600/30 text-stone-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-white/10">
              <button
                onClick={() => setViewingDetailSection(null)}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة إلى عجلة الحظ 🎡</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{viewingDetailSection.emoji}</span>
                <span className="text-sm font-black">{viewingDetailSection.title}</span>
              </div>
            </div>

            <div className="space-y-4 py-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <h4 className="font-bold text-base text-emerald-400">عن القسم: {viewingDetailSection.title}</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-300">
                  {viewingDetailSection.desc}
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/20 text-center space-y-4">
                <p className="text-xs text-stone-400">
                  اضغط على الزر أدناه لبدء وتفعيل هذا القسم والانتقال إلى محتوياته الكاملة بالكامل:
                </p>
                <button
                  onClick={() => viewingDetailSection.action()}
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>بدء الاستخدام والدخول الفوري 🚀</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🌿 شخصية نسمة حياة — المرشدة الدائمة */}
      <NesmatGuideBanner 
        theme={theme} 
        onNavigate={onNavigate} 
        onOpenCompanion={() => onOpenCompanion && onOpenCompanion()} 
      />

      {/* Footer PWA Install */}
      <div className="flex justify-center pt-4">
        <PWAInstallButton />
      </div>
    </div>
  );
};
