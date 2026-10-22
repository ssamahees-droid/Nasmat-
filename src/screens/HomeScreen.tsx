import React, { useState } from 'react';
import { 
  SimpleIconCompass,
  SimpleIconWind,
  SimpleIconSparkles,
  SimpleIconCheck,
  SimpleIconZap,
  SimpleIconShieldCheck,
  SimpleIconChevronLeft,
  SimpleIconMessage,
  SimpleIconBook,
  SimpleIconGamepad
} from '../components/common/SimpleSvgIcons';
import { MoodValue } from '../types';
import { storage } from '../services/storage';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { PWAUpdatePrompt } from '../components/PWAUpdatePrompt';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';
import { TEN_SCREENS, TenScreenItem } from '../constants/tenScreens';
import { GrowthTreeWidget } from '../components/GrowthTreeWidget';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  onOpenContent?: (contentId: string) => void;
  onOpenAudioModal?: (title: string, category: string, durationMinutes: number) => void;
  onOpenThoughtRelease?: () => void;
  onOpenSoundscapeStudio?: () => void;
  onOpenEmotionCompass?: () => void;
  onOpenDailyWisdom?: () => void;
  // Interactive tools
  onOpenAnaDelwaqti?: () => void;
  onOpenRescueKit?: (planId?: string) => void;
  onOpenBatteryCheck?: () => void;
  onOpenTranslateFeelings?: () => void;
  onOpenFactGame?: () => void;
  onOpenUntangleKnot?: () => void;
  onOpenNesmaLaughs?: () => void;
  onOpenEmergencyHelp?: () => void;
  onOpenMoodKitchen?: () => void;
  // Booklet additions
  onOpenBooklet?: () => void;
  onOpenPersonalPlan?: () => void;
  onOpenEnergyBudget?: () => void;
  onOpenBoundaryBuilder?: () => void;
  onOpenSpecialistGuide?: () => void;
  // Workshops
  onOpenWorkshopsHub?: () => void;
  onOpenPsychologicalER?: () => void;
  onOpenConflictWithoutWar?: () => void;
  onOpenHealingJourney?: () => void;
  // Thought Journal & Mindfulness Studio
  onOpenThoughtJournal?: () => void;
  onOpenMindfulnessStudio?: () => void;
  // Fun & Games
  onOpenFunAndGames?: (tab?: 'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory') => void;
  onOpenGwayaHekaya?: () => void;
  onOpenFeker?: () => void;
  onOpenDiscoveryQuiz?: () => void;
  onOpenPersonalityTests?: () => void;
  onOpenCompanion?: () => void;
  onOpenInnerBurdens?: () => void;
  onOpenEmotionalBridge?: () => void;
  onOpenGratitudeGarden?: () => void;
  onOpenInnerCompass?: () => void;
  onOpenDailyMiracle?: () => void;
  onOpenOrigamiGarden?: () => void;
  onOpenMusicLounge?: () => void;
  onOpenEndlessPsychology?: (category: string) => void;
  onOpenAllScreens?: () => void;
  theme?: 'dark' | 'light' | 'system';
  isMobilePerformanceMode?: boolean;
  onToggleMobilePerformanceMode?: () => void;
}

const MOOD_OPTIONS: { id: MoodValue; label: string; emoji: string; tip: string; cheerfulColor: string }[] = [
  { 
    id: 'good', 
    label: 'مبسوط وراضي', 
    emoji: '😊', 
    tip: 'ما شاء الله! احتفظ بهذا الرضا وشاركه بابتسامة لطيفة مع من تحب 🌱✨',
    cheerfulColor: 'text-emerald-500 border-emerald-400 bg-emerald-500/10'
  },
  { 
    id: 'fair', 
    label: 'عادي ومستقر', 
    emoji: '🍃', 
    tip: 'يوم هادئ ومستقر، مساحة ممتازة للقراءة أو ممارسة تمرين تنفس ممتع 🌿',
    cheerfulColor: 'text-teal-500 border-teal-400 bg-teal-500/10'
  },
  { 
    id: 'confused', 
    label: 'مشوش شوية', 
    emoji: '🤔', 
    tip: 'التشوش علامة على الرغبة في الفهم؛ مرآة الذات وبوصلة المشاعر بانتظارك 🧭',
    cheerfulColor: 'text-amber-500 border-amber-400 bg-amber-500/10'
  },
  { 
    id: 'not_good', 
    label: 'مضغوط ومثقل', 
    emoji: '😔', 
    tip: 'سلامتك يا غالي؛ بستان الألعاب وفرقعة الأعباء صُمم خصيصاً لتخفيف هذا الحمل 🎈',
    cheerfulColor: 'text-pink-500 border-pink-400 bg-pink-500/10'
  },
  { 
    id: 'exhausted', 
    label: 'طاقتي خلصت', 
    emoji: '😫', 
    tip: 'أنت مش مطلوب منك تكون بطل طول الوقت؛ خد استراحة دافية في واحة التنفس 🔋',
    cheerfulColor: 'text-rose-500 border-rose-400 bg-rose-500/10'
  },
];

const DAILY_CHEERFUL_QUOTES = [
  { quote: 'كل خطوة صغيرة تخطوها نحو نفسك هي انتصار حقيقي.', author: 'نسمة حياة 🌿' },
  { quote: 'السكينة ليست غياب العواصف، بل السلام الذي تبنيه في أعماقك.', author: 'واحة الوعي 🌸' },
  { quote: 'أنت تستحق مساحة تفهمك بلا أحكام وتمنحك دفء الاحتواء.', author: 'رفيق الرحلة ✨' },
  { quote: 'خذ نفساً عميقاً، أرخِ كتفيك، وتذكر أن اللحظة الحالية ملكك.', author: 'همسة اليوم 🍃' }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenCompanion,
  onOpenEmergencyHelp,
  onOpenAllScreens,
  onOpenGratitudeGarden,
  theme = 'dark',
  isMobilePerformanceMode = false,
  onToggleMobilePerformanceMode
}) => {
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = storage.getDailyCheckins().find(c => c.date === today);
    return todayCheckin ? todayCheckin.moodValue : null;
  });
  const [justSavedCheckin, setJustSavedCheckin] = useState(false);

  // Pick quote based on day
  const todayDayIndex = new Date().getDate() % DAILY_CHEERFUL_QUOTES.length;
  const todayQuote = DAILY_CHEERFUL_QUOTES[todayDayIndex];

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    storage.addDailyCheckin(mood);
    setJustSavedCheckin(true);
    setTimeout(() => setJustSavedCheckin(false), 4000);
  };

  const activeMoodObj = MOOD_OPTIONS.find(m => m.id === selectedMood);

  // The 9 destination content screens (Screens 2 to 10)
  const destinationScreens = TEN_SCREENS.filter(s => s.id !== 'home');

  return (
    <div className="space-y-6 sm:space-y-10 pb-28 px-3 sm:px-4 max-w-6xl mx-auto animate-fade-in text-right font-tajawal">

      {/* 🌳 شجرة نمو الوعي والسكينة (تنمو بتفاعل المستخدم وتمارين اليوم) */}
      <GrowthTreeWidget 
        onNavigate={onNavigate} 
        onOpenGratitudeGarden={onOpenGratitudeGarden} 
      />

      {/* 🎡 بانر شاشة الترحيب وعجلة نسمة حياة الدوارة السحرية */}
      <section className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-400/30">
        <div className="flex items-center gap-3 text-right">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🎡
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-extrabold">
              <span>شاشة الترحيب الجديدة 🌸</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
              عجلة نسمة حياة الدوارة السحرية (الواحات العشر)
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-100/80 font-medium">
              أدِر العجلة لاكتشاف محطتك المناسبة وتحديد مشاعرك بلمسة واحدة
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('welcome')}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-stone-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>دخول شاشة الترحيب والعجلة 🎡</span>
          <SimpleIconChevronLeft size={14} className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 🌸 الشاشة الأولى (الرئيسية) — واحة الترحيب المبهجة والدافئة */}
      <section className={`relative overflow-hidden p-5 sm:p-9 rounded-3xl sm:rounded-4xl border shadow-lg transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-[#132A20] via-[#0F2018] to-[#0A1610] border-emerald-500/30' 
          : 'bg-gradient-to-br from-[#F5F9F6] via-[#EDF5F0] to-[#E5F0E8] border-emerald-600/20 shadow-emerald-900/5'
      }`}>
        {/* Joyful Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 max-w-2xl w-full">
            
            {/* Joyful Badge Lockup */}
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-black shadow-xs flex items-center gap-1.5">
                <span>🌸</span>
                <span>الشاشة الأولى • الرئيسية</span>
              </span>
              <span className={`text-xs font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                مبادرة نسمة حياة للصحة النفسية
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-xs ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              أهلاً بك في واحتك الدافية 🌿✨
            </h1>

            <p className={`text-xs sm:text-base leading-relaxed max-w-xl font-medium ${
              isDark ? 'text-stone-200' : 'text-stone-700'
            }`}>
              مساحتك العربية الآمنة والمبهجة؛ قسّمنا لك كل المحتوى على <strong className="text-emerald-500 dark:text-emerald-300">عشر شاشات مستقلة</strong> لتتنقل بينها بكل حرية وسكينة دون تشتت.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('start')}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <span>🧭</span>
                <span>ابدأ رحلتك (الشاشة ٢)</span>
              </button>

              <button
                onClick={() => onNavigate('breathe')}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[46px] ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/15 text-white border-white/15' 
                    : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-600/25 shadow-xs'
                }`}
              >
                <span>🌊</span>
                <span>دقيقة تنفس هادئة</span>
              </button>

              <button
                onClick={() => onNavigate('games')}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[46px] ${
                  isDark 
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border-amber-500/30' 
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                }`}
              >
                <span>🎈</span>
                <span>ألعاب التهدئة والمرح</span>
              </button>

              {onOpenCompanion && (
                <button
                  onClick={onOpenCompanion}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                >
                  <SimpleIconSparkles size={16} className="w-4 h-4 text-amber-300" />
                  <span>تحدث مع رفيقي</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('welcome')}
                className={`px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 min-h-[46px] ${
                  isDark 
                    ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/30' 
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-600/25 shadow-xs'
                }`}
                title="عرض شاشة الترحيب المستقلة"
              >
                <span>👋</span>
                <span>شاشة الترحيب</span>
              </button>
            </div>
          </div>

          {/* Welcoming Card with Daily Cheerful Quote */}
          <div className={`w-full md:w-72 shrink-0 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border text-right space-y-2.5 ${
            isDark 
              ? 'bg-black/35 border-emerald-500/30 text-stone-200' 
              : 'bg-white/85 border-emerald-600/20 text-stone-800 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold border-b pb-2 border-stone-200/50 dark:border-white/10">
              <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
                <span>✨</span>
                <span>همسة طمأنينة لقلبك</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15">يومياً</span>
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed italic font-serif">
              "{todayQuote.quote}"
            </p>

            <div className="text-[11px] font-bold text-stone-400 pt-1 text-left">
              — {todayQuote.author}
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 تفقد المشاعر اليومية — تصميم مرح ومبهج وسريع */}
      <section className={`p-4 sm:p-7 border rounded-3xl sm:rounded-4xl space-y-3 sm:space-y-4 shadow-sm transition-all ${
        isDark ? 'bg-[#12221A] border-emerald-500/25' : 'bg-white border-emerald-600/20'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 dark:text-emerald-400">
              <span>🌱 رادار اللحظة الحالية</span>
            </div>
            <h2 className={`text-base sm:text-xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
              كيف حال قلبك ومشاعرك اليوم؟ 💖
            </h2>
          </div>

          {justSavedCheckin && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500 text-black font-extrabold animate-bounce flex items-center gap-1 shadow-xs">
              <SimpleIconCheck size={14} className="w-3.5 h-3.5" /> تم تسجيل مشاعرك بكل حب 🌱
            </span>
          )}
        </div>

        {/* 5 Joyful Mood Buttons */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {MOOD_OPTIONS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`py-3 px-1 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[72px] sm:min-h-[86px] select-none active:scale-95 ${
                  isSelected 
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md ring-2 ring-emerald-400/50 scale-[1.02]' 
                    : isDark 
                      ? 'bg-black/25 border-white/10 text-stone-200 hover:border-emerald-500/40 hover:bg-white/5' 
                      : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-emerald-500/40 hover:bg-emerald-50/40'
                }`}
                title={m.label}
              >
                <span className="text-2xl sm:text-3xl leading-none transition-transform hover:scale-110">
                  {m.emoji}
                </span>
                <span className="text-[10px] sm:text-xs font-bold block truncate max-w-full leading-tight">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tip */}
        {activeMoodObj && (
          <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 animate-fade-in ${
            isDark ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-100' : 'bg-emerald-50 border-emerald-600/25 text-emerald-950'
          }`}>
            <span className="text-xl sm:text-2xl shrink-0">💌</span>
            <p className="font-semibold leading-relaxed">{activeMoodObj.tip}</p>
          </div>
        )}
      </section>

      {/* 🚀 وضع أداء الهاتف السريع */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
        isDark ? 'bg-[#0E1C15] border-emerald-500/20 text-emerald-200' : 'bg-emerald-50/70 border-emerald-600/20 text-emerald-950'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <SimpleIconZap size={16} className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs sm:text-sm block truncate">
              {isMobilePerformanceMode ? 'وضع أداء الهاتف (مُفعّل لمنع الوميض)' : 'الوضع الرسومي التفاعلي'}
            </span>
            <span className={`text-[10px] sm:text-xs block truncate ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              {isMobilePerformanceMode 
                ? 'استجابة فائقة وخفيفة ومثالية لشاشات الموبايل' 
                : 'التأثيرات الجمالية والرسومية نشطة'}
            </span>
          </div>
        </div>

        {onToggleMobilePerformanceMode && (
          <button
            onClick={onToggleMobilePerformanceMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
              isDark 
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/30' 
                : 'bg-white hover:bg-emerald-100 text-emerald-900 border-emerald-600/30'
            }`}
          >
            {isMobilePerformanceMode ? 'العرض الكامل' : 'تسريع الهاتف'}
          </button>
        )}
      </div>

      {/* 🌟 بوابات شاشات المحتوى التسع الأخرى (شاشات ٢ إلى ١٠) */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-3 border-stone-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-500 dark:text-emerald-400">
              <span>🌸 المحتوى مقسّم بعناية</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15">كل شاشة تفتح لوحدها</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black mt-0.5 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              بوابات نسمة حياة التسع 🏛️
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              اختر الشاشة التي تود الدخول إليها، لتفتح لك كاملة بمحتواها وأدواتها المتخصصة:
            </p>
          </div>

          {onOpenAllScreens && (
            <button
              onClick={onOpenAllScreens}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 text-emerald-300 border-white/10' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-600/25'
              }`}
            >
              <span>📑 عرض كفهرس سريع</span>
              <SimpleIconChevronLeft size={14} className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* The 9 Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {destinationScreens.map((screen) => {
            return (
              <div
                key={screen.id}
                className={`group p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-4 text-right shadow-sm hover:shadow-md ${
                  isDark 
                    ? `bg-[#102018] ${screen.borderDark} hover:bg-[#13261D]` 
                    : `bg-white ${screen.borderLight} hover:bg-emerald-50/20`
                }`}
              >
                {/* Header of Card */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${screen.badgeColor}`}>
                      <span>الشاشة {screen.numberArabic}</span>
                      <span>•</span>
                      <span>{screen.badge}</span>
                    </span>

                    <span className="text-2xl sm:text-3xl p-1.5 rounded-2xl bg-black/10 dark:bg-white/5">
                      {screen.emoji}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-base sm:text-lg font-black group-hover:text-emerald-500 transition-colors ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}>
                      {screen.title}
                    </h3>
                    <p className={`text-xs leading-relaxed mt-1 line-clamp-2 ${
                      isDark ? 'text-stone-300' : 'text-stone-600'
                    }`}>
                      {screen.tagline}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-1 pt-1 border-t border-stone-200/50 dark:border-white/5">
                    {screen.features.map((feature, fIdx) => (
                      <div 
                        key={fIdx} 
                        className={`text-[11px] flex items-center gap-1.5 ${
                          isDark ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        <span className="text-emerald-500 font-bold">•</span>
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enter Screen Action */}
                <button
                  onClick={() => {
                    onNavigate(screen.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 hover:text-black dark:text-emerald-300 dark:hover:text-black text-xs font-extrabold border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[42px]"
                >
                  <span>ادخل الشاشة {screen.numberArabic}</span>
                  <SimpleIconChevronLeft size={14} className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛡️ شريط الطوارئ والمساعدة الفورية */}
      {onOpenEmergencyHelp && (
        <section className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'bg-rose-950/25 border-rose-500/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-950 shadow-xs'
        }`}>
          <div className="flex items-center gap-3 text-right">
            <span className="text-2xl sm:text-3xl shrink-0">🛟</span>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400">
                هل تمر بلحظة صعبة أو ضغط طارئ الآن؟
              </h4>
              <p className="text-[11px] sm:text-xs opacity-90">
                حقيبة النجاة (الشاشة ٩) والخطوط الساخنة المجانية متاحة على مدار الساعة لحمايتك.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEmergencyHelp}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 min-h-[40px]"
          >
            فتح خطة الطوارئ 🛡️
          </button>
        </section>
      )}

      {/* 📱 PWA Install & Update Section */}
      <div className="pt-2 px-2 max-w-xl mx-auto w-full space-y-3">
        <PWAInstallButton variant="banner" />
        <div className="flex justify-center">
          <PWAInstallButton variant="full" />
        </div>
        <PWAUpdatePrompt />
      </div>

    </div>
  );
};
