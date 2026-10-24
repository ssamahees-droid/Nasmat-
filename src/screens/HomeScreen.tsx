/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HomeScreen Component
 * Mobile-First, high contrast, large legible typography, and 9 portal cards.
 * Full bilingual (Arabic & English) i18n support.
 */

import React, { useState } from 'react';
import { MoodValue } from '../types';
import { storage } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { useTenScreens } from '../constants/tenScreens';
import { GrowthTree } from '../components/GrowthTree';
import { 
  SimpleIconSparkles, 
  SimpleIconCheck, 
  SimpleIconChevronLeft,
  SimpleIconChevronRight,
  SimpleIconZap 
} from '../components/common/SimpleSvgIcons';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { PWAUpdatePrompt } from '../components/PWAUpdatePrompt';
import { PWAInstallCard } from '../components/PWAInstallCard';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  onOpenCompanion?: () => void;
  onOpenEmergencyHelp?: () => void;
  onOpenAllScreens?: () => void;
  onOpenGratitudeGarden?: () => void;
  onOpenContent?: (id: string) => void;
  onOpenAudioModal?: (opts: { title: string; category: string; durationMinutes?: number }) => void;
  onOpenThoughtRelease?: () => void;
  onOpenSoundscapeStudio?: () => void;
  onOpenEmotionCompass?: () => void;
  onOpenDailyWisdom?: () => void;
  onOpenAnaDelwaqti?: () => void;
  onOpenRescueKit?: () => void;
  onOpenBatteryCheck?: () => void;
  onOpenTranslateFeelings?: () => void;
  onOpenFactGame?: () => void;
  onOpenUntangleKnot?: () => void;
  onOpenNesmaLaughs?: () => void;
  onOpenBooklet?: () => void;
  onOpenPersonalPlan?: () => void;
  onOpenEnergyBudget?: () => void;
  onOpenBoundaryBuilder?: () => void;
  onOpenSpecialistGuide?: () => void;
  onOpenWorkshopsHub?: () => void;
  onOpenPsychologicalER?: () => void;
  onOpenConflictWithoutWar?: () => void;
  onOpenHealingJourney?: () => void;
  onOpenThoughtJournal?: () => void;
  onOpenMindfulnessStudio?: () => void;
  onOpenFunAndGames?: (tab?: string) => void;
  onOpenGwayaHekaya?: () => void;
  onOpenFeker?: () => void;
  onOpenDiscoveryQuiz?: () => void;
  onOpenPersonalityTests?: () => void;
  onOpenMoodKitchen?: () => void;
  onOpenInnerBurdens?: () => void;
  onOpenEmotionalBridge?: () => void;
  onOpenDailyMiracle?: () => void;
  onOpenOrigamiGarden?: () => void;
  onOpenMusicLounge?: () => void;
  onOpenEndlessPsychology?: (cat?: string) => void;
  theme?: 'dark' | 'light' | 'system';
  isMobilePerformanceMode?: boolean;
  onToggleMobilePerformanceMode?: () => void;
}

const DAILY_CHEERFUL_QUOTES = {
  ar: [
    { quote: 'كل خطوة صغيرة تخطوها نحو نفسك هي انتصار حقيقي.', author: 'نسمة حياة 🌿' },
    { quote: 'السكينة ليست غياب العواصف، بل السلام الذي تبنيه في أعماقك.', author: 'واحة الوعي 🌸' },
    { quote: 'أنت تستحق مساحة تفهمك بلا أحكام وتمنحك دفء الاحتواء.', author: 'رفيق الرحلة ✨' },
    { quote: 'خذ نفساً عميقاً، أرخِ كتفيك، وتذكر أن اللحظة الحالية ملكك.', author: 'همسة اليوم 🍃' }
  ],
  en: [
    { quote: 'Every small step you take towards yourself is a genuine victory.', author: 'Nesmat Al-Hayat 🌿' },
    { quote: 'Serenity is not the absence of storms, but the peace you cultivate within.', author: 'Sanctuary of Peace 🌸' },
    { quote: 'You deserve a space that validates you without judgment and embraces you warmly.', author: 'Mindful Companion ✨' },
    { quote: 'Take a deep breath, soften your shoulders, and remember this moment is yours.', author: 'Daily Whisper 🍃' }
  ]
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenCompanion,
  onOpenEmergencyHelp,
  onOpenAllScreens,
  onOpenGratitudeGarden,
  isMobilePerformanceMode = false,
  onToggleMobilePerformanceMode
}) => {
  const { t, language, isRTL } = useLanguage();
  const screens = useTenScreens();

  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = storage.getDailyCheckins().find(c => c.date === today);
    return todayCheckin ? todayCheckin.moodValue : null;
  });
  const [justSavedCheckin, setJustSavedCheckin] = useState(false);

  const moodOptions: { id: MoodValue; label: string; emoji: string; tip: string }[] = [
    { 
      id: 'good', 
      label: t('home.mood.good', 'مرتاح ومبسوط'), 
      emoji: '😊', 
      tip: t('home.mood.tip_good', 'يا رب دايماً في رضا وسلام! شارك امتنانك في حديقة الامتنان لتدوم البهجة 🌸')
    },
    { 
      id: 'fair', 
      label: t('home.mood.fair', 'هادي ومستقر'), 
      emoji: '🍃', 
      tip: t('home.mood.tip_fair', 'الهدوء نعمة جميلة؛ دقيقة تنفس عميق كفيلة بتثبيت هذا السلام في يومك 🍃')
    },
    { 
      id: 'confused', 
      label: t('home.mood.confused', 'مشوش شوية'), 
      emoji: '🤔', 
      tip: t('home.mood.tip_confused', 'التشوش علامة على الرغبة في الفهم؛ مرآة الذات وبوصلة المشاعر بانتظارك 🧭')
    },
    { 
      id: 'not_good', 
      label: t('home.mood.not_good', 'مضغوط ومثقل'), 
      emoji: '😔', 
      tip: t('home.mood.tip_not_good', 'سلامتك يا غالي؛ بستان الألعاب وفرقعة الأعباء صُمم خصيصاً لتخفيف هذا الحمل 🎈')
    },
    { 
      id: 'exhausted', 
      label: t('home.mood.exhausted', 'طاقتي خلصت'), 
      emoji: '😫', 
      tip: t('home.mood.tip_exhausted', 'أنت مش مطلوب منك تكون بطل طول الوقت؛ خذ استراحة دافية في واحة التنفس 🔋')
    },
  ];

  // Pick quote based on day and language
  const quotesList = DAILY_CHEERFUL_QUOTES[language] || DAILY_CHEERFUL_QUOTES.ar;
  const todayDayIndex = new Date().getDate() % quotesList.length;
  const todayQuote = quotesList[todayDayIndex];

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    storage.addDailyCheckin(mood);
    setJustSavedCheckin(true);
    setTimeout(() => setJustSavedCheckin(false), 4000);
  };

  const activeMoodObj = moodOptions.find(m => m.id === selectedMood);

  // The 9 destination content screens (Screens 2 to 10)
  const destinationScreens = screens.filter(s => s.id !== 'home');

  const ChevronIcon = isRTL ? SimpleIconChevronLeft : SimpleIconChevronRight;

  return (
    <div 
      className={`space-y-6 sm:space-y-10 pb-28 px-3 sm:px-4 max-w-6xl mx-auto animate-fade-in font-tajawal ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >

      {/* 🌳 شجرة نمو الوعي والسكينة */}
      <GrowthTree 
        onNavigate={onNavigate} 
        onOpenGratitudeGarden={onOpenGratitudeGarden} 
      />

      {/* 📱 PWA Install Card */}
      <PWAInstallCard />

      {/* ⚡ Mobile Speed Booster Notice */}
      {onToggleMobilePerformanceMode && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span>
              {isMobilePerformanceMode 
                ? 'وضع السرعة الخفيفة للهواتف مفعل (خالي من الضبابية والأعباء) 🚀'
                : 'هل تشعر ببطء على هاتفك؟ اضغطي هنا لتفعيل وضع السرعة الفائقة للهواتف'}
            </span>
          </div>
          <button
            onClick={onToggleMobilePerformanceMode}
            className="px-3 py-1.5 rounded-xl bg-[#174F3F] hover:bg-[#23785B] text-white font-black text-xs transition-all cursor-pointer shadow-xs shrink-0"
          >
            {isMobilePerformanceMode ? 'تعديل ⚡' : 'تسريع الآن ⚡'}
          </button>
        </div>
      )}

      {/* 🎡 بانر شاشة الترحيب وعجلة نسمة حياة الدوارة السحرية */}
      <section className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-[#E2EFE7] text-[#292F2B] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#D5DED7]">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-[#FFFFFF] border border-[#23785B]/30 flex items-center justify-center text-3xl shadow-xs shrink-0">
            🎡
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#174F3F] border border-[#D5DED7] text-[15px] font-bold">
              <span>{t('home.wheel_banner.badge', 'شاشة الترحيب الجديدة 🌸')}</span>
            </div>
            <h3 className="text-[22px] sm:text-[24px] font-bold text-[#174F3F] mt-1 leading-snug">
              {t('home.wheel_banner.title', 'عجلة نسمة حياة الدوارة السحرية (الواحات العشر)')}
            </h3>
            <p className="text-[16px] text-[#515B55] font-medium mt-0.5 leading-relaxed">
              {t('home.wheel_banner.desc', 'أدِر العجلة لاكتشاف محطتك المناسبة وتحديد مشاعرك بلمسة واحدة')}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('welcome')}
          className="min-h-[48px] w-full sm:w-auto px-5 py-3 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold text-[17px] rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>{t('home.wheel_banner.button', 'دخول شاشة الترحيب والعجلة 🎡')}</span>
          <ChevronIcon size={16} className="w-4 h-4" />
        </button>
      </section>

      {/* 🌸 الشاشة الأولى (الرئيسية) — واحة الترحيب المبهجة والدافئة */}
      <section className="relative overflow-hidden p-6 sm:p-9 rounded-3xl sm:rounded-4xl bg-[#FFFFFF] border-2 border-[#D5DED7] text-[#292F2B] shadow-sm transition-all">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl w-full">
            
            {/* Joyful Badge Lockup */}
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full text-[15px] font-bold bg-[#E2EFE7] text-[#174F3F] border border-[#23785B]/30 flex items-center gap-1.5 shadow-xs">
                <span>🌸</span>
                <span>{t('home.hero.badge', 'الشاشة الأولى • الرئيسية')}</span>
              </span>
              <span className="text-[15px] font-bold text-[#515B55]">
                {t('home.hero.sub_badge', 'مبادرة نسمة حياة للصحة النفسية')}
              </span>
            </div>

            <h1 className="text-[28px] sm:text-[36px] font-black leading-tight text-[#174F3F]">
              {t('home.hero.title', 'أهلاً بك في واحتك الدافية 🌿✨')}
            </h1>

            <p className="text-[18px] leading-relaxed max-w-xl font-medium text-[#292F2B]">
              {t('home.hero.desc', 'مساحتك العربية الآمنة والمبهجة؛ قسّمنا لك كل المحتوى على عشر شاشات مستقلة لتتنقل بينها بكل حرية وسكينة دون تشتت.')}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('start')}
                className="min-h-[48px] px-5 py-3 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-bold rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🧭</span>
                <span>{t('home.hero.start_journey', 'ابدأ رحلتك (الشاشة ٢)')}</span>
              </button>

              <button
                onClick={() => onNavigate('breathe')}
                className="min-h-[48px] px-5 py-3 rounded-2xl text-[17px] font-bold bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] border border-[#D5DED7] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              >
                <span>🌊</span>
                <span>{t('home.hero.breathe_button', 'دقيقة تنفس هادئة')}</span>
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="min-h-[48px] px-5 py-3 rounded-2xl text-[17px] font-bold bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#292F2B] border-2 border-[#D5DED7] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              >
                <span>🎈</span>
                <span>{t('home.hero.games_button', 'ألعاب التهدئة والمرح')}</span>
              </button>

              {onOpenCompanion && (
                <button
                  onClick={onOpenCompanion}
                  className="min-h-[48px] px-5 py-3 bg-[#23785B] hover:bg-[#174F3F] text-white text-[17px] font-bold rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SimpleIconSparkles size={18} className="w-4.5 h-4.5 text-[#F8EED8]" />
                  <span>{t('home.hero.companion_button', 'تحدث مع رفيقي')}</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('welcome')}
                className="min-h-[48px] px-4 py-3 rounded-2xl text-[17px] font-bold bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] border border-[#23785B]/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                title={t('home.hero.welcome_screen_button', 'شاشة الترحيب')}
              >
                <span>👋</span>
                <span>{t('home.hero.welcome_screen_button', 'شاشة الترحيب')}</span>
              </button>
            </div>
          </div>

          {/* Welcoming Card with Daily Cheerful Quote */}
          <div className="w-full md:w-80 shrink-0 p-5 rounded-3xl bg-[#F7F5EF] border border-[#D5DED7] space-y-3">
            <div className="flex items-center justify-between text-[15px] font-bold border-b pb-2 border-[#D5DED7]">
              <span className="text-[#174F3F] flex items-center gap-1.5">
                <span>✨</span>
                <span>{t('home.daily_whisper', 'همسة طمأنينة لقلبك')}</span>
              </span>
              <span className="text-[13px] px-2.5 py-0.5 rounded-full bg-[#E2EFE7] text-[#174F3F] font-bold">
                {t('common.daily', 'يومياً')}
              </span>
            </div>
            
            <p className="text-[18px] leading-relaxed italic text-[#292F2B] font-medium">
              "{todayQuote.quote}"
            </p>

            <div className={`text-[15px] font-bold text-[#515B55] pt-1 ${isRTL ? 'text-left' : 'text-right'}`}>
              — {todayQuote.author}
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 تفقد المشاعر اليومية */}
      <section className="p-5 sm:p-7 border-2 border-[#D5DED7] rounded-3xl sm:rounded-4xl space-y-4 shadow-sm bg-[#FFFFFF] text-[#292F2B]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D5DED7] pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174F3F] text-[15px] font-bold">
              <span>{t('home.mood.radar_badge', '🌱 رادار اللحظة الحالية')}</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#174F3F] mt-1">
              {t('home.mood.question', 'كيف حال قلبك ومشاعرك اليوم؟ 💖')}
            </h2>
          </div>

          {justSavedCheckin && (
            <span className="text-[15px] px-3.5 py-2 rounded-full bg-[#E2EFE7] text-[#174F3F] border border-[#23785B]/40 font-bold animate-bounce flex items-center gap-1.5 shadow-xs">
              <SimpleIconCheck size={16} className="w-4 h-4 text-[#23785B]" /> 
              <span>{t('home.mood.saved_toast', 'تم تسجيل مشاعرك بكل حب 🌱')}</span>
            </span>
          )}
        </div>

        {/* 5 Joyful Mood Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {moodOptions.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[82px] select-none active:scale-95 ${
                  isSelected 
                    ? 'bg-[#E2EFE7] border-[#174F3F] text-[#174F3F] shadow-sm ring-2 ring-[#174F3F]/30 scale-[1.02]' 
                    : 'bg-[#F7F5EF] border-[#D5DED7] text-[#292F2B] hover:border-[#23785B] hover:bg-[#FFFFFF]'
                }`}
                title={m.label}
              >
                <span className="text-3xl sm:text-4xl leading-none transition-transform hover:scale-110">
                  {m.emoji}
                </span>
                <span className="text-[16px] sm:text-[17px] font-bold block truncate max-w-full leading-tight">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tip */}
        {activeMoodObj && (
          <div className="p-4 rounded-2xl border border-[#B78327]/30 bg-[#F8EED8] text-[#292F2B] flex items-center gap-3 animate-fade-in shadow-xs">
            <span className="text-2xl sm:text-3xl shrink-0">💌</span>
            <p className="font-medium text-[17px] sm:text-[18px] leading-relaxed">{activeMoodObj.tip}</p>
          </div>
        )}
      </section>

      {/* 🚀 وضع أداء الهاتف السريع */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#D5DED7] bg-[#FFFFFF] text-[#292F2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#E2EFE7] text-[#174F3F] border border-[#23785B]/30 flex items-center justify-center shrink-0">
            <SimpleIconZap size={20} className="w-5 h-5 text-[#174F3F]" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-[18px] text-[#174F3F] block truncate">
              {isMobilePerformanceMode ? t('home.perf.active_title', 'وضع أداء الهاتف (مُفعّل لمنع الوميض)') : t('home.perf.inactive_title', 'الوضع الرسومي التفاعلي')}
            </span>
            <span className="text-[16px] text-[#515B55] block">
              {isMobilePerformanceMode 
                ? t('home.perf.active_desc', 'استجابة فائقة وخفيفة ومثالية لشاشات الموبايل') 
                : t('home.perf.inactive_desc', 'التأثيرات الجمالية والرسومية نشطة')}
            </span>
          </div>
        </div>

        {onToggleMobilePerformanceMode && (
          <button
            onClick={onToggleMobilePerformanceMode}
            className="min-h-[48px] px-5 py-2.5 rounded-xl text-[16px] font-bold border-2 border-[#174F3F] bg-[#E2EFE7] hover:bg-[#174F3F] text-[#174F3F] hover:text-white shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isMobilePerformanceMode ? t('home.perf.btn_full', 'العرض الكامل 🎨') : t('home.perf.btn_speed', 'تسريع الهاتف ⚡')}
          </button>
        )}
      </div>

      {/* 🌟 بوابات شاشات المحتوى التسع الأخرى (شاشات ٢ إلى ١٠) */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 pb-4 border-[#D5DED7]">
          <div>
            <div className="inline-flex items-center gap-2 text-[15px] font-bold text-[#174F3F] bg-[#E2EFE7] px-3.5 py-1 rounded-full border border-[#23785B]/25">
              <span>{t('home.portals.badge', '🌸 المحتوى مقسّم بعناية')}</span>
              <span>•</span>
              <span>{t('home.portals.badge_sub', 'كل شاشة تفتح مستقلة')}</span>
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-black text-[#174F3F] mt-2">
              {t('home.portals.title', 'بوابات نسمة حياة التسع 🏛️')}
            </h2>
            <p className="text-[18px] text-[#515B55] font-medium leading-relaxed mt-1">
              {t('home.portals.desc', 'اختر الشاشة التي تود الدخول إليها، لتفتح لك كاملة بمحتواها وأدواتها المتخصصة:')}
            </p>
          </div>

          {onOpenAllScreens && (
            <button
              onClick={onOpenAllScreens}
              className="min-h-[48px] px-4 py-2.5 rounded-xl text-[16px] font-bold border-2 border-[#D5DED7] bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#174F3F] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <span>{t('home.portals.quick_index', '📑 عرض كفهرس سريع')}</span>
              <ChevronIcon size={16} className="w-4 h-4 text-[#174F3F]" />
            </button>
          )}
        </div>

        {/* The 9 Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {destinationScreens.map((screen) => {
            return (
              <div
                key={screen.id}
                className="group p-5 sm:p-6 rounded-3xl border-2 border-[#D5DED7] hover:border-[#23785B] bg-[#FFFFFF] transition-all duration-200 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md"
              >
                {/* Header of Card */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold px-3 py-1.5 rounded-xl border border-[#23785B]/25 bg-[#E2EFE7] text-[#174F3F] flex items-center gap-1.5">
                      <span>{language === 'en' ? `Screen ${screen.numberArabic}` : `الشاشة ${screen.numberArabic}`}</span>
                      <span>•</span>
                      <span>{screen.badge}</span>
                    </span>

                    <span className="text-3xl p-2 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7]">
                      {screen.emoji}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[22px] sm:text-[24px] font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
                      {screen.title}
                    </h3>
                    <p className="text-[17px] sm:text-[18px] text-[#292F2B] font-medium leading-relaxed mt-1.5 line-clamp-2">
                      {screen.tagline}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-[#D5DED7]">
                    {screen.features.map((feature, fIdx) => (
                      <div 
                        key={fIdx} 
                        className="text-[16px] text-[#515B55] flex items-center gap-2 font-medium"
                      >
                        <span className="text-[#23785B] font-bold text-lg">•</span>
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
                  className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>{t('home.portals.enter', 'ادخل الشاشة {num}', { num: screen.numberArabic })}</span>
                  <ChevronIcon size={16} className={`w-4 h-4 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛡️ شريط الطوارئ والمساعدة الفورية */}
      {onOpenEmergencyHelp && (
        <section className="p-5 sm:p-6 rounded-3xl border-2 border-[#B78327]/30 bg-[#F8EED8] text-[#292F2B] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl sm:text-4xl shrink-0">🛟</span>
            <div>
              <h4 className="text-[19px] sm:text-[21px] font-bold text-[#991B1B]">
                {t('home.sos.title', 'هل تمر بلحظة صعبة أو ضغط طارئ الآن؟')}
              </h4>
              <p className="text-[16px] sm:text-[17px] text-[#292F2B] font-medium mt-1 leading-relaxed">
                {t('home.sos.desc', 'حقيبة النجاة (الشاشة ٩) والخطوط الساخنة المجانية متاحة على مدار الساعة لحمايتك.')}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEmergencyHelp}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-[#991B1B] hover:bg-[#7f1d1d] text-white text-[17px] font-bold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            {t('home.sos.button', 'فتح خطة الطوارئ 🛡️')}
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
