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
import { NesmatLuckyWheel, WheelSectionItem } from '../components/NesmatLuckyWheel';
import { MainSixHubsSection } from '../components/MainSixHubsSection';
import { MoodKitchenRecommendations } from '../components/MoodKitchenRecommendations';
import { useLanguage } from '../context/LanguageContext';
import { chimeService } from '../services/chimeService';

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
  onOpenPersonalityTests?: () => void;
  onOpenCompanion?: () => void;
  onOpenInnerBurdens?: () => void;
  onOpenEmotionalBridge?: () => void;
  onOpenGratitudeGarden?: () => void;
  onOpenInnerCompass?: () => void;
  onOpenEndlessPsychology?: (category: string) => void;
  theme?: 'dark' | 'light' | 'system';
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
  onOpenPersonalityTests,
  onOpenCompanion,
  onOpenInnerBurdens,
  onOpenEmotionalBridge,
  onOpenGratitudeGarden,
  onOpenInnerCompass,
  onOpenEndlessPsychology,
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

  // Spin Wheel Sections aligned with the 6 core main categories
  const WHEEL_SECTIONS: WheelSectionItem[] = [
    {
      id: 'exploration',
      title: 'رحلة الاستكشاف',
      desc: 'ابدأ رحلتك النفسية واكتشف ذاتك والكتيب التوجيهي الشامل',
      emoji: '🧭',
      bgHex: '#059669',
      gradientStart: '#10B981',
      gradientEnd: '#065F46',
      textColor: 'text-emerald-100',
      action: () => onNavigate('start')
    },
    {
      id: 'workshops',
      title: 'ورش العمل',
      desc: 'ورش عملية، تطبيق فكّر لتفكيك الأفكار السامة، ورحلة التعافي',
      emoji: '📚',
      bgHex: '#b45309',
      gradientStart: '#D97706',
      gradientEnd: '#78350F',
      textColor: 'text-amber-100',
      action: () => onOpenWorkshopsHub()
    },
    {
      id: 'games_relief',
      title: 'ألعاب التهدئة',
      desc: 'فرقعة الأعباء، حديقة الامتنان، والجسر العاطفي للبهجة والتفريغ',
      emoji: '🎈',
      bgHex: '#db2777',
      gradientStart: '#EC4899',
      gradientEnd: '#9D174D',
      textColor: 'text-pink-100',
      action: () => onOpenFunAndGames('wheel')
    },
    {
      id: 'mind_library',
      title: 'مكتبة العقل',
      desc: 'اسمع نفسك وأمانك الداخلي، والجلسة الأسبوعية التأملية والمذكرات',
      emoji: '🧠',
      bgHex: '#4f46e5',
      gradientStart: '#6366F1',
      gradientEnd: '#312E81',
      textColor: 'text-indigo-100',
      action: () => onNavigate('listen-to-yourself')
    },
    {
      id: 'quick_tools',
      title: 'الأدوات السريعة',
      desc: 'التنفس الهادئ 4-7-8، بوصلة المشاعر، ومطبخ المزاج وشاحن الطاقة',
      emoji: '🌊',
      bgHex: '#0284c7',
      gradientStart: '#38BDF8',
      gradientEnd: '#075985',
      textColor: 'text-sky-100',
      action: () => onNavigate('breathe')
    },
    {
      id: 'companion_support',
      title: 'التواصل مع رفيقي',
      desc: 'رفيقي الذكي لاحتواء مشاعرك، إسعافات الطوارئ، والدعم المتخصص',
      emoji: '🌿',
      bgHex: '#0d9488',
      gradientStart: '#14B8A6',
      gradientEnd: '#115E59',
      textColor: 'text-teal-100',
      action: () => onOpenCompanion ? onOpenCompanion() : onNavigate('support')
    }
  ];

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

      {/* 🍳 قسم ربط بيانات مطبخ المزاج بالتوصيات النفسية والأنشطة المخصصة */}
      <MoodKitchenRecommendations 
        onOpenMoodKitchen={() => onOpenMoodKitchen ? onOpenMoodKitchen() : onNavigate('explore')}
        onNavigate={onNavigate}
        onOpenInnerBurdens={onOpenInnerBurdens}
        onOpenEmotionalBridge={onOpenEmotionalBridge}
        onOpenGratitudeGarden={onOpenGratitudeGarden}
        onOpenEmotionCompass={onOpenEmotionCompass}
        onOpenMindfulnessStudio={onOpenMindfulnessStudio}
        onOpenSoundscapeStudio={onOpenSoundscapeStudio}
        onOpenThoughtRelease={onOpenThoughtRelease}
        onOpenFeker={onOpenFeker}
        onOpenWorkshopsHub={onOpenWorkshopsHub}
        onOpenThoughtJournal={onOpenThoughtJournal}
        onOpenEndlessPsychology={onOpenEndlessPsychology}
        onOpenCompanion={onOpenCompanion}
        onOpenFunAndGames={onOpenFunAndGames}
        theme={theme}
      />

      {/* 🎡 عجلة الحظ التفاعلية الفاخرة — هوية نسمة حياة الرسمية واختيار الأقسام المباشر */}
      <NesmatLuckyWheel 
        sections={WHEEL_SECTIONS}
        theme={theme}
      />

      {/* 🧭 التصنيفات الستة الرئيسية المدمجة */}
      <MainSixHubsSection 
        onNavigate={onNavigate}
        onOpenCompanion={() => onOpenCompanion && onOpenCompanion()}
        onOpenWorkshopsHub={onOpenWorkshopsHub}
        onOpenThoughtJournal={onOpenThoughtJournal}
        onOpenMindfulnessStudio={onOpenMindfulnessStudio}
        onOpenFunAndGames={onOpenFunAndGames}
        onOpenMoodKitchen={() => onOpenMoodKitchen ? onOpenMoodKitchen() : onNavigate('explore')}
        onOpenEmotionCompass={onOpenEmotionCompass}
        onOpenRescueKit={onOpenRescueKit}
        onOpenFeker={() => onOpenFeker ? onOpenFeker() : onNavigate('games')}
        onOpenPersonalityTests={onOpenPersonalityTests}
        onOpenEndlessPsychology={(cat) => onOpenEndlessPsychology && onOpenEndlessPsychology(cat)}
        theme={theme}
      />

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
