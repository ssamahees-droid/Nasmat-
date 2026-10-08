import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  ClipboardCheck, 
  Wind, 
  BookOpen, 
  Bookmark, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Calendar,
  Volume2,
  Play,
  BatteryCharging,
  MessageSquare,
  HelpCircle,
  Puzzle,
  Smile,
  ShieldAlert,
  ChevronLeft,
  Scale,
  Shield,
  Stethoscope,
  FileText,
  Layers,
  HeartHandshake,
  Gamepad2,
  Brain,
  Lightbulb
} from 'lucide-react';
import { MoodValue, ContentItem } from '../types';
import { storage } from '../services/storage';
import { RESCUE_KIT_PLANS } from '../data/newPhaseData';

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
  // PDF Booklet additions
  onOpenBooklet: () => void;
  onOpenPersonalPlan: () => void;
  onOpenEnergyBudget: () => void;
  onOpenBoundaryBuilder: () => void;
  onOpenSpecialistGuide: () => void;
  // New Workshops from PDF
  onOpenWorkshopsHub: () => void;
  onOpenPsychologicalER: () => void;
  onOpenConflictWithoutWar: () => void;
  onOpenHealingJourney: () => void;
  // Thought Journal & Mindfulness Studio
  onOpenThoughtJournal: () => void;
  onOpenMindfulnessStudio: () => void;
  // Fun, Jokes & Mind Games
  onOpenFunAndGames: (tab?: 'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory') => void;
  // Gwaya Hekaya Interactive Game
  onOpenGwayaHekaya: () => void;
  // Feker App Integration
  onOpenFeker?: () => void;
  // Personal Discovery Quiz
  onOpenDiscoveryQuiz: () => void;
  // Variation Theme
  theme?: 'dark' | 'light';
}

const MOOD_OPTIONS: { id: MoodValue; label: string; emoji: string; color: string }[] = [
  { id: 'good', label: 'كويس', emoji: '😊', color: 'hover:border-emerald-600' },
  { id: 'fair', label: 'مقبول', emoji: '😐', color: 'hover:border-[#DDA15E]' },
  { id: 'confused', label: 'مش عارف', emoji: '🤔', color: 'hover:border-stone-400' },
  { id: 'not_good', label: 'مش كويس', emoji: '😔', color: 'hover:border-[#BC6C25]' },
  { id: 'exhausted', label: 'متعب جداً', emoji: '😫', color: 'hover:border-rose-600' },
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
  const [homeMode, setHomeMode] = useState<'reading' | 'games'>('reading');
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = storage.getDailyCheckins().find(c => c.date === today);
    return todayCheckin ? todayCheckin.moodValue : null;
  });
  const [justSavedCheckin, setJustSavedCheckin] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState<string[]>(storage.getFavorites());

  const suggestedContent: ContentItem[] = storage.getContent().filter(c => c.isSuggested || c.reviewStatus === 'published').slice(0, 3);

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
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-7">
      
      {/* Variation 6: Hero Banner (Bordered Tech Grid) */}
      <section className="hero-banner-tech p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-xl">
          <span className="meta-label font-geist">ID: DAILY_GREETING_001</span>
          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold uppercase leading-none tracking-tight text-white">
            أهلاً بك في <br />نسمة حياة 🌿
          </h1>
          <p className="text-xs sm:text-sm text-[#e4e4e4]/70 max-w-md leading-relaxed pt-1">
            خد لحظة هدوء مع نفسك... مساحتك الدافئة للتنفس وفهم ما يدور بداخلك.
          </p>
        </div>

        <div className="flex flex-col sm:flex-col gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={() => onNavigate('breathe')}
            className="btn-tech-fill w-full sm:w-auto"
          >
            <span>تنفس الآن</span>
            <Wind className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={onOpenSoundscapeStudio}
            className="btn-tech w-full sm:w-auto"
          >
            <span>أصوات هادئة</span>
            <Volume2 className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>

      {/* Variation 6: Data Strip (Stats & Evaluation Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Psych-Evaluation Box */}
        <div className="data-box-tech cell p-5 sm:p-6 sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="meta-label font-geist">PSYCH-EVALUATION / تقييم الحالة</span>
            <button
              onClick={onOpenEmotionCompass}
              className="text-[11px] font-geist text-[#c4fb6d] hover:underline flex items-center gap-1"
            >
              <span>بوصلة المشاعر 🧭</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold font-syne text-white">
              إنت عامل إيه النهارده؟
            </h2>
            {justSavedCheckin && (
              <span className="text-xs text-[#c4fb6d] font-geist font-bold animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                RECORDED // تم التسجيل
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`p-3 text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'border-[#c4fb6d] bg-[#c4fb6d]/15 text-[#c4fb6d] font-bold shadow-sm'
                      : 'border-white/10 hover:border-[#c4fb6d]/60 bg-[#0c0c0e]/80 text-[#e4e4e4]'
                  }`}
                  aria-label={mood.label}
                >
                  <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-geist">{mood.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 text-[10px] font-geist opacity-60">
            <span>// CHECK-IN ENCRYPTED LOCAL STORAGE</span>
            <button onClick={() => onNavigate('journey')} className="text-[#c4fb6d] underline">
              سجل الأيام →
            </button>
          </div>
        </div>

        {/* Workshop 01 Box */}
        <div className="data-box-tech cell p-5 flex flex-col justify-between">
          <div>
            <span className="meta-label font-geist">Workshop 01 / الورشة 01</span>
            <h3 className="font-syne text-base sm:text-lg font-bold text-white mt-1">
              غرفة الطوارئ النفسية
            </h3>
            <p className="text-xs text-[#e4e4e4]/60 mt-1 leading-relaxed">
              تدريب عملي على 5 سيناريوهات حرجة وفصل الحقيقة عن الخوف.
            </p>
          </div>
          <button
            onClick={onOpenPsychologicalER}
            className="btn-tech mt-4 self-start text-[11px]"
          >
            <span>بدء المحاكاة</span>
            <ChevronLeft className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Workshop 02 Box */}
        <div className="data-box-tech cell p-5 flex flex-col justify-between">
          <div>
            <span className="meta-label font-geist">Workshop 02 / الورشة 02</span>
            <h3 className="font-syne text-base sm:text-lg font-bold text-white mt-1">
              خلاف بدون معركة
            </h3>
            <p className="text-xs text-[#e4e4e4]/60 mt-1 leading-relaxed">
              مهارة تواصل عملية للأزواج والأسرة دون هجوم أو انسحاب.
            </p>
          </div>
          <button
            onClick={onOpenConflictWithoutWar}
            className="btn-tech mt-4 self-start text-[11px]"
          >
            <span>تجربة الأساليب</span>
            <ChevronLeft className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </section>

      {/* FEATURE CARD 1: تطبيق فكّر المدمج (Feker App - AI Studio 6b9dc7c3) */}
      <section className="border-2 border-[#c4fb6d] bg-gradient-to-r from-[#141416] via-[#1a2216] to-[#141416] rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_4px_30px_rgba(196,251,109,0.15)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] bg-[#c4fb6d] text-black px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                💡 تطبيق فكّر مدمج داخل نسمة حياة
              </span>
              <span className="font-mono text-[10px] text-[#c4fb6d] border border-[#c4fb6d]/40 px-2 py-0.5 rounded-full">
                AI Studio: 6b9dc7c3-7b9a-4c60-a9f9-b7b8f2ee9985
              </span>
            </div>
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>تطبيق «فكّر» — استوديو تفكيك الأفكار والمرونة الذهنية</span>
              <span className="text-2xl animate-pulse">🧠</span>
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-[#e4e4e4]/80 leading-relaxed font-geist">
              تم دمج تطبيق «فكّر» بالكامل ليصبح تطبيقين في مشروع واحد! فكك أفكارك السامة التلقائية، واكشف أفخاخ التفكير، والعب تحدي «حقيقة أم حكاية»، أو اعرض شاشة AI Studio المباشرة.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
              className="px-6 py-3 bg-[#c4fb6d] hover:bg-[#b2f34f] text-black font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>فتح تطبيق فكّر الآن 💡</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
              className="px-4 py-2 border border-white/20 hover:border-[#c4fb6d] text-[#e4e4e4] hover:text-[#c4fb6d] font-mono text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>المعاينة التفاعلية المباشرة 🌐</span>
            </button>
          </div>
        </div>

        {/* 3 Quick features chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs">
          <div 
            onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
            className="cursor-pointer p-3 rounded-xl bg-black/40 border border-white/5 hover:border-[#c4fb6d]/40 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">⚡</span>
            <div>
              <strong className="text-white block text-[11px]">استوديو التفكيك (CBT)</strong>
              <span className="text-white/60 text-[10px]">كشف التشوهات وصياغة البدائل</span>
            </div>
          </div>
          <div 
            onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
            className="cursor-pointer p-3 rounded-xl bg-black/40 border border-white/5 hover:border-[#c4fb6d]/40 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">🎯</span>
            <div>
              <strong className="text-white block text-[11px]">لعبة «حقيقة أم حكاية»</strong>
              <span className="text-white/60 text-[10px]">فصل الواقع عن سيناريوهات الخيال</span>
            </div>
          </div>
          <div 
            onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
            className="cursor-pointer p-3 rounded-xl bg-black/40 border border-white/5 hover:border-[#c4fb6d]/40 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">📑</span>
            <div>
              <strong className="text-white block text-[11px]">سجل أفكاري المحفوظة</strong>
              <span className="text-white/60 text-[10px]">بطاقات السلام الذهني المحفوظة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Variation 6: Big Feature Card (جوايا حكاية) */}
      <section className="big-card-tech cell p-6 sm:p-8 space-y-3">
        <span className="meta-label bg-[#c4fb6d] text-black px-2.5 py-0.5 inline-block font-bold">
          FEATURE / الميزة الكبرى
        </span>
        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#c4fb6d] tracking-tight">
          «جوايا حكاية» — العالم الذي يشرح نفسه 🪄
        </h2>
        <p className="max-w-xl text-xs sm:text-sm text-[#e4e4e4]/70 leading-relaxed">
          ٤ فصول واقعية و٦ محطات لاستكشاف ما يدور بداخلك وفصل الحقيقة عن القصة القديمة، تليها بطاقة الإنجاز وحفظ الخيوط.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenGwayaHekaya}
            className="btn-tech-fill px-6 py-2.5"
          >
            <span>ابدأ اللعبة</span>
            <ArrowLeft className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>

      {/* 2. CARD: "🌿 أنا دلوقتي..." (Hero Compass Card) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#2D4434] text-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_-6px_rgba(40,54,24,0.3)]">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#588157]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-bold border border-white/15">
              <span>🌿 مسار اللحظة الحالية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              🌿 أنا دلوقتي...
            </h2>
            <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed font-medium">
              "مش لازم تحل كل حاجة دلوقتي... خلينا نبدأ من اللي حاصل معاك الآن."
            </p>
          </div>

          <button
            onClick={onOpenAnaDelwaqti}
            className="self-start sm:self-center px-8 py-3.5 bg-[#FAF7F2] hover:bg-white text-[#283618] font-black text-sm rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center gap-2 shrink-0 group"
          >
            <span>ابدأ الآن</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#3A5A40]" />
          </button>
        </div>
      </section>

      {/* 🧭 اختبار الاستكشاف الذاتي السريع */}
      <section 
        onClick={onOpenDiscoveryQuiz}
        className="cursor-pointer bg-gradient-to-r from-amber-50/90 via-white to-amber-50/60 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-inner shrink-0">
            🧭
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-200/80 text-amber-950 font-black px-2.5 py-0.5 rounded-full">
                جديد · اختبار تفاعلي سريع
              </span>
              <span className="text-xs text-[#58645C] font-semibold">٥ أسئلة دقيقة</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#283618] group-hover:text-amber-900 transition-colors">
              اختبار الاستكشاف الذاتي: ما هي حالتك النفسية الحالية؟
            </h3>
            <p className="text-xs text-[#58645C] font-medium leading-relaxed">
              شخّص مستوى طاقتك، حدة تفكيرك، وحدودك العاطفية، واحصل على خطة وتوصيات مخصصة تناسب لحظتك الحالية
            </p>
          </div>
        </div>

        <div className="self-end sm:self-center py-2.5 px-5 bg-amber-800 hover:bg-amber-900 text-white rounded-2xl text-xs font-black shadow-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95">
          <span>بدء الاختبار</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </div>
      </section>

      {/* 3. 🛠️ استوديو الورش التطبيقية (From the new PDF) */}
      <section className={`border rounded-3xl p-5 sm:p-7 space-y-4 transition-all ${
        isDark 
          ? 'bg-white/3 border-white/10 shadow-none' 
          : 'bg-white border-[#E5DACB] shadow-[0_4px_20px_-2px_rgba(58,90,64,0.06)]'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${isDark ? 'border-white/10' : 'border-[#E5DACB]'}`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              <h2 className="text-lg sm:text-xl font-bold font-cormorant">
                استوديو الورش التطبيقية
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-[#58645C]'}`}>
              مجموعات عمل ومحاكاة عملية للتعامل مع الأيام الصعبة وخلافات البيت دون لعب دور الطبيب
            </p>
          </div>
          <button
            onClick={onOpenWorkshopsHub}
            className={`self-start sm:self-center text-xs font-bold hover:underline flex items-center gap-1 ${isDark ? 'text-[#588157]' : 'text-[#3A5A40]'}`}
          >
            <span>تصفح كل الورش الـ 10</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Featured Workshop Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Workshop 1: غرفة الطوارئ النفسية */}
          <div 
            onClick={onOpenPsychologicalER}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
              isDark 
                ? 'bg-white/4 hover:bg-white/8 border-white/10 hover:border-white/20' 
                : 'bg-[#FAF7F2] hover:bg-white border-[#E5DACB] hover:border-[#3A5A40] shadow-2xs hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🚨</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md">محاكاة عملية</span>
              </div>
              <h3 className="font-bold text-sm transition-colors group-hover:text-[#588157]">
                غرفة الطوارئ النفسية
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-stone-400' : 'text-[#58645C]'}`}>
                ماذا أفعل الآن؟ وماذا لا أفعل؟ ومتى أطلب مساعدة؟ تدريب على 5 سيناريوهات حرجة.
              </p>
            </div>
            <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-bold ${
              isDark ? 'border-white/10 text-[#588157]' : 'border-[#E5DACB]/60 text-[#3A5A40]'
            }`}>
              <span>بدء المحاكاة</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Workshop 2: خلاف بدون معركة */}
          <div 
            onClick={onOpenConflictWithoutWar}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
              isDark 
                ? 'bg-white/4 hover:bg-white/8 border-white/10 hover:border-white/20' 
                : 'bg-[#FAF7F2] hover:bg-white border-[#E5DACB] hover:border-[#3A5A40] shadow-2xs hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🤝</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">للأزواج والأسرة</span>
              </div>
              <h3 className="font-bold text-sm transition-colors group-hover:text-[#588157]">
                خلاف بدون معركة
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-stone-400' : 'text-[#58645C]'}`}>
                هجوم ❌ vs انسحاب ❌ vs حوار صحي ✅. مهارة تواصل عملية يمكن استخدامها في البيت فوراً.
              </p>
            </div>
            <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-bold ${
              isDark ? 'border-white/10 text-[#588157]' : 'border-[#E5DACB]/60 text-[#3A5A40]'
            }`}>
              <span>تجربة الأساليب</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Workshop 3: اتأذيت... إزاي أتعافى؟ */}
          <div 
            onClick={onOpenHealingJourney}
            className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
              isDark 
                ? 'bg-white/4 hover:bg-white/8 border-white/10 hover:border-white/20' 
                : 'bg-[#FAF7F2] hover:bg-white border-[#E5DACB] hover:border-[#3A5A40] shadow-2xs hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🌱</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded-md">تفكيك الأثر</span>
              </div>
              <h3 className="font-bold text-sm transition-colors group-hover:text-[#588157]">
                اتأذيت... إزاي أتعافى؟
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-stone-400' : 'text-[#58645C]'}`}>
                عن الأذى النفسي والخذلان: تحويل التجربة من سجن تعيش داخله إلى وعي تفهم أثره وتتعامل معه.
              </p>
            </div>
            <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-bold ${
              isDark ? 'border-white/10 text-[#588157]' : 'border-[#E5DACB]/60 text-[#3A5A40]'
            }`}>
              <span>بدء التمرين</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. 📖 كتيب «نسمة حياة» - دليل مبسط للصحة النفسية */}
      <section className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#F4ECE3] border-2 border-[#588157]/40 rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_-2px_rgba(58,90,64,0.06)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-xs font-bold text-[#3A5A40] bg-[#3A5A40]/15 px-3 py-0.5 rounded-full">
                إصدار مميز من نسمة حياة
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#283618]">
              كتيب «نسمة حياة» · دليل مبسط للصحة النفسية
            </h2>
            <p className="text-xs text-[#58645C] leading-relaxed font-medium">
              «كثيرون يعيشون الحياة... وقليلون يستمتعون بها» — 12 فصلاً صغيراً تفاعلياً يساعدك على فهم ما يحدث لك، واكتشاف العلامات المبكرة، ومتى تحتاج إلى مختص.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenBooklet}
              className="flex-1 sm:flex-none py-3 px-5 bg-[#3A5A40] hover:bg-[#283618] text-white text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>تصفح الكتيب</span>
            </button>

            <button
              onClick={onOpenPersonalPlan}
              className="flex-1 sm:flex-none py-3 px-4 bg-white hover:bg-stone-50 text-[#3A5A40] border border-[#E5DACB] text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileText className="w-4 h-4 text-[#3A5A40]" />
              <span>خطتي الخاصة 📑</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. CARD: "🎒 شنطة الإسعاف النفسي" (Rescue Kit Section) */}
      <section className="bg-white border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_-2px_rgba(58,90,64,0.06)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5DACB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              <h2 className="text-lg sm:text-xl font-black text-[#283618]">
                شنطة الإسعاف النفسي
              </h2>
            </div>
            <p className="text-xs text-[#58645C] mt-1 font-medium">
              "مش علاج... لكنها خطوات صغيرة تساعدك تعدّي اللحظة الصعبة."
            </p>
          </div>
          <button
            onClick={() => onOpenRescueKit()}
            className="self-start sm:self-center text-xs font-bold text-[#3A5A40] hover:underline flex items-center gap-1"
          >
            <span>فتح الشنطة كاملة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Rescue Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {RESCUE_KIT_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onOpenRescueKit(plan.id)}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E5DACB] hover:border-[#588157] text-right transition-all group flex flex-col justify-between min-h-[100px] active:scale-[0.98] shadow-2xs hover:shadow-xs"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {plan.emoji}
              </div>
              <div className="mt-2">
                <div className="font-black text-xs sm:text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors leading-tight">
                  {plan.title}
                </div>
                <div className="text-[10px] text-[#58645C] mt-0.5 line-clamp-1 font-medium">
                  {plan.tagline}
                </div>
              </div>
            </button>
          ))}

          {/* Quick Safety Help button */}
          <button
            onClick={onOpenEmergencyHelp}
            className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-right transition-all group flex flex-col justify-between min-h-[100px] active:scale-[0.98]"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">
              🆘
            </div>
            <div className="mt-2">
              <div className="font-black text-xs sm:text-sm text-amber-950 leading-tight">
                محتاج مساعدة؟
              </div>
              <div className="text-[10px] text-amber-800/90 mt-0.5 line-clamp-1 font-medium">
                طوارئ وخطوط الدعم
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* 6. Interactive Mental Health Tools Grid */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#283618]">
              أدوات التفكيك والوعي اللحظي 🌱
            </h2>
            <p className="text-xs text-[#58645C] font-medium">تمارين وتطبيقات عملية مأخوذة من الكتيب ومرحلة المشروع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Tool 1: بطاريتي كام؟ */}
          <div
            onClick={onOpenBatteryCheck}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🔋
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                بطاريتي كام؟
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                طاقتك دلوقتي كام من 10؟ اعرف حدود طاقتك واحمِ نفسك من الإنهاك.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 2: ميزانية الطاقة */}
          <div
            onClick={onOpenEnergyBudget}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              ⚖️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                ميزانية الطاقة
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                أنت لست آلة.. 5 مستنزفات و3 معوضات، وما يمكنك تقليله هذا الأسبوع.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 3: الحدود ليست قسوة */}
          <div
            onClick={onOpenBoundaryBuilder}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🛡️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                الحدود ليست قسوة
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                فن الرفض اللبق وصيغة «محتاج أفكر وأرد عليك» لحماية مساحتك.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 4: أخصائي أم طبيب نفسي؟ */}
          <div
            onClick={onOpenSpecialistGuide}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🩺
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                أخصائي أم طبيب نفسي؟
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                دليل توجيه هادئ بدون وصمة يساعدك تعرف أيهما تحتاج وأين تبدأ.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 5: ترجم اللي جواك */}
          <div
            onClick={onOpenTranslateFeelings}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🗣️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                ترجم اللي جواك
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                أحيانًا الجملة اللي بنقولها مش هي كل اللي جواها.. اكتشف ما وراء الكلمات.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 6: الحقيقة ولا الحكاية؟ */}
          <div
            onClick={onOpenFactGame}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🎮
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                الحقيقة ولا الحكاية؟
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                لعبة تفاعلية للتمييز بين الحدث الواقعي والقصة اللي عقلك بيبنيها.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 7: فك العقدة */}
          <div
            onClick={onOpenUntangleKnot}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🧩
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                فك العقدة
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                لما كل حاجة تبان بايظة، خلينا نصغرها ونفكها خيط بخيط.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 8: نسمة تضحك */}
          <div
            onClick={onOpenNesmaLaughs}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              😂
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                نسمة تضحك
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                مواقف نفسية طريفة تبتسم منها وتكتشف ألاعيب عقلك اللطيفة.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>

          {/* Tool 9: تفريغ وتحرير الأفكار */}
          <div
            onClick={onOpenThoughtRelease}
            className="cursor-pointer p-4 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all hover:shadow-md flex items-start gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🍃
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                تفريغ وتحرير الأفكار
              </h3>
              <p className="text-xs text-[#58645C] mt-0.5 leading-snug font-medium">
                اترك الفكرة تطفو كغيمة أو ورقة في النهر وتتلاشى بسلام.
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] transition-colors mt-1" />
          </div>
        </div>
      </section>

      {/* 7. Creative Mindful Sanctuaries (مساحات مهدئة ومبتكرة) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Sanctuary 1: بطاقة السكينة اليومية */}
        <div 
          onClick={onOpenDailyWisdom}
          className="cursor-pointer p-5 bg-gradient-to-r from-amber-50/80 via-[#FAF7F2] to-amber-50/60 border border-amber-200/80 rounded-3xl hover:border-[#3A5A40] transition-all hover:shadow-md flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-2xs">
              ✨
            </div>
            <div>
              <div className="font-bold text-xs text-amber-900">تأمل هادئ</div>
              <h3 className="font-black text-sm text-[#283618]">بطاقة السكينة والرفق بالذات</h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 font-medium">رسائل تطمئن قلبك مع نغمات التأمل الهادئة</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-amber-800 group-hover:-translate-x-1 transition-transform" />
        </div>

        {/* Sanctuary 2: أصوات الطبيعة */}
        <div 
          onClick={onOpenSoundscapeStudio}
          className="cursor-pointer p-5 bg-gradient-to-r from-emerald-50/80 via-[#FAF7F2] to-emerald-50/60 border border-[#588157]/40 rounded-3xl hover:border-[#3A5A40] transition-all hover:shadow-md flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-2xs">
              🌊
            </div>
            <div>
              <div className="font-bold text-xs text-[#3A5A40]">استوديو الأجواء</div>
              <h3 className="font-black text-sm text-[#283618]">مزج أصوات الطبيعة</h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 font-medium">أمواج، مطر، ورياح هادئة لتهدئة الأعصاب</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-[#3A5A40] group-hover:-translate-x-1 transition-transform" />
        </div>
      </section>

      {/* 8. 🌿 مساحة مدونة الأفكار واليقظة الذهنية */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: مدونة الأفكار والخواطر */}
        <div 
          onClick={onOpenThoughtJournal}
          className="cursor-pointer p-5 bg-gradient-to-r from-emerald-50/90 via-[#FAF7F2] to-emerald-50/60 border border-[#588157]/40 rounded-3xl hover:border-[#3A5A40] transition-all hover:shadow-md flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-2xs">
              ✍️
            </div>
            <div>
              <div className="font-bold text-xs text-[#3A5A40]">تدوين واعي</div>
              <h3 className="font-black text-sm text-[#283618]">مدونة الأفكار والخواطر</h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 font-medium">مساحة لتفريغ الأفكار وتأمل النعم وإعادة الصياغة</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-[#3A5A40] group-hover:-translate-x-1 transition-transform" />
        </div>

        {/* Card 2: استوديو اليقظة الذهنية */}
        <div 
          onClick={onOpenMindfulnessStudio}
          className="cursor-pointer p-5 bg-gradient-to-r from-amber-50/90 via-[#FAF7F2] to-amber-50/60 border border-[#DDA15E]/40 rounded-3xl hover:border-[#3A5A40] transition-all hover:shadow-md flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-2xs">
              🧘
            </div>
            <div>
              <div className="font-bold text-xs text-[#BC6C25]">حضور وتجذر</div>
              <h3 className="font-black text-sm text-[#283618]">تمارين اليقظة الذهنية</h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 font-medium">الحواس الخمس 5-4-3-2-1، نهر الأفكار، ومسح الجسد</p>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-[#BC6C25] group-hover:-translate-x-1 transition-transform" />
        </div>
      </section>

      {/* 9. 🎈 واحة البهجة والضحك والألعاب (فك التكشيرة) */}
      <section className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/60 border-2 border-amber-200/90 rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(221,161,94,0.15)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🎈</span>
              <h2 className="text-lg sm:text-xl font-black text-[#283618]">
                واحة البهجة والضحك والألعاب
              </h2>
              <span className="text-[10px] bg-amber-200/80 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full">
                فك التكشيرة وروّق 😊
              </span>
            </div>
            <p className="text-xs text-[#58645C] font-medium">
              الضحك تمرين نفسي حقيقي يخفض هرمون التوتر ويمنحك مرونة وخفة لمواجهة ضغوط اليوم
            </p>
          </div>

          <button
            onClick={() => onOpenFunAndGames('jokes')}
            className="self-start sm:self-center py-2 px-4 bg-[#3A5A40] hover:bg-[#283618] text-white rounded-2xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>فتح واحة البهجة كاملة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Creative Activity Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: مسرح النكت والقفشات */}
          <button
            onClick={() => onOpenFunAndGames('jokes')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-amber-50/60 border border-amber-200 text-right transition-all group flex flex-col justify-between min-h-[110px] shadow-2xs hover:shadow-sm"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">
              😂
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm text-[#283618] group-hover:text-amber-900 transition-colors">
                مسرح النكت والقفشات
              </div>
              <div className="text-[10px] text-[#58645C] mt-0.5 font-medium">
                طرائف التفكير واليوميات
              </div>
            </div>
          </button>

          {/* Card 2: فرقعة فقاعات القلق */}
          <button
            onClick={() => onOpenFunAndGames('bubbles')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-sky-50/60 border border-sky-200 text-right transition-all group flex flex-col justify-between min-h-[110px] shadow-2xs hover:shadow-sm"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">
              🫧
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm text-[#283618] group-hover:text-sky-900 transition-colors">
                فرقعة فقاعات القلق
              </div>
              <div className="text-[10px] text-[#58645C] mt-0.5 font-medium">
                فرقع همومك لتتلاشى
              </div>
            </div>
          </button>

          {/* Card 3: فوازير وألغاز للترويق */}
          <button
            onClick={() => onOpenFunAndGames('riddles')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-emerald-50/60 border border-emerald-200 text-right transition-all group flex flex-col justify-between min-h-[110px] shadow-2xs hover:shadow-sm"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">
              🧩
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm text-[#283618] group-hover:text-emerald-900 transition-colors">
                ألغاز وفوازير ذكية
              </div>
              <div className="text-[10px] text-[#58645C] mt-0.5 font-medium">
                شغّل مخك واكشف الحل
              </div>
            </div>
          </button>

          {/* Card 4: عجلة وتحدي الذاكرة */}
          <button
            onClick={() => onOpenFunAndGames('wheel')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-purple-50/60 border border-purple-200 text-right transition-all group flex flex-col justify-between min-h-[110px] shadow-2xs hover:shadow-sm"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">
              🎡
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm text-[#283618] group-hover:text-purple-900 transition-colors">
                عجلة الحظ والألعاب
              </div>
              <div className="text-[10px] text-[#58645C] mt-0.5 font-medium">
                تحديات مبهجة وبطاقات
              </div>
            </div>
          </button>
        </div>

        {/* Featured Special Game Card: جوايا حكاية */}
        <div 
          onClick={onOpenGwayaHekaya}
          className="cursor-pointer p-4 sm:p-5 bg-gradient-to-r from-[#3A5A40] via-[#2D4434] to-[#1E3024] text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-transform hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  لعبة الاستكشاف الذاتي الكبرى
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white mt-1">
                «جوايا حكاية» — العالم اللي بيشرح نفسه بنفسه ✨
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5 font-medium">
                ٤ فصول واقعية و٦ محطات لاستكشاف ما يدور بداخلك وفصل الحقيقة عن القصة القديمة
              </p>
            </div>
          </div>

          <div className="self-end sm:self-center px-4 py-2 bg-white text-[#283618] hover:bg-emerald-50 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 shrink-0">
            <span>ابدأ اللعبة الآن</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 10. 4 Main Core Sections */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#283618]">
            الأقسام الرئيسية
          </h2>
          <span className="text-xs text-[#58645C] font-medium">خطوات بسيطة تدعم يومك</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: أفهم نفسي */}
          <button
            onClick={() => onNavigate('explore')}
            className="group p-4 bg-[#FAF7F2] hover:bg-white border border-[#E5DACB] rounded-3xl text-right transition-all hover:shadow-md hover:border-[#588157] flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-100/70 text-rose-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-2xs">
              🌸
            </div>
            <div className="mt-3">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                أفهم نفسي
              </h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 leading-snug font-medium">
                مكتبة المحتوى والمقالات الموثوقة
              </p>
            </div>
          </button>

          {/* Card 2: محتاج أتكلم */}
          <button
            onClick={() => onNavigate('support')}
            className="group p-4 bg-[#FAF7F2] hover:bg-white border border-[#E5DACB] rounded-3xl text-right transition-all hover:shadow-md hover:border-[#588157] flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-100/70 text-sky-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-2xs">
              💬
            </div>
            <div className="mt-3">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                محتاج أتكلم
              </h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 leading-snug font-medium">
                طلب دعم وتوجيه في مساحة آمنة
              </p>
            </div>
          </button>

          {/* Card 3: قيّم حالتك */}
          <button
            onClick={() => onNavigate('assessment')}
            className="group p-4 bg-[#FAF7F2] hover:bg-white border border-[#E5DACB] rounded-3xl text-right transition-all hover:shadow-md hover:border-[#588157] flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-2xs">
              📝
            </div>
            <div className="mt-3">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                قيّم حالتك
              </h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 leading-snug font-medium">
                فحص واستكشاف ذاتي غير تشخيصي
              </p>
            </div>
          </button>

          {/* Card 4: خد نفس */}
          <button
            onClick={() => onNavigate('breathe')}
            className="group p-4 bg-[#FAF7F2] hover:bg-white border border-[#E5DACB] rounded-3xl text-right transition-all hover:shadow-md hover:border-[#588157] flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-2xs">
              🍃
            </div>
            <div className="mt-3">
              <h3 className="font-bold text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                خد نفس
              </h3>
              <p className="text-[11px] text-[#58645C] mt-0.5 leading-snug font-medium">
                تمارين التهدئة والتنفس الموجه
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 9. Suggested Content Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#283618]">
              ممكن يهمك 🌱
            </h2>
            <span className="text-xs text-[#58645C] font-medium">· مقترحات هادئة تناسب يومك</span>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold text-[#3A5A40] hover:underline flex items-center gap-1"
          >
            <span>عرض الكل</span>
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
                className="cursor-pointer bg-[#FAF7F2] hover:bg-white border border-[#E5DACB] rounded-3xl p-5 transition-all hover:shadow-md hover:border-[#588157] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#58645C] mb-2">
                    <span className="font-bold text-[#3A5A40]">
                      {item.subCategory || item.category}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, item.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isFav ? 'text-rose-600 bg-rose-50' : 'text-stone-400 hover:text-stone-700'
                      }`}
                      aria-label="حفظ في المفضلة"
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-black text-sm text-[#283618] leading-snug line-clamp-2 mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#58645C] line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5DACB] flex items-center justify-between text-[11px] text-[#58645C]">
                  <span>{item.duration}</span>
                  {item.contentType === 'audio' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAudioModal(item.title, item.category, 5);
                      }}
                      className="inline-flex items-center gap-1 text-[#3A5A40] font-bold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استمع الآن</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#3A5A40] font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>قراءة</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Final Inspiring Quote from PDF */}
      <section className="p-6 bg-gradient-to-r from-[#588157]/15 via-[#FAF7F2] to-[#588157]/15 border border-[#588157]/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#3A5A40] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-[#E5DACB]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3A5A40]">برنامج «نسمة حياة»</div>
            <p className="text-sm font-black text-[#283618] mt-0.5">
              «كثيرون يعيشون الحياة... وقليلون يستمتعون بها»
            </p>
            <p className="text-xs text-[#58645C] mt-0.5 font-medium">
              نحو مجتمع يهتم بالصحة النفسية كما يهتم بالصحة الجسدية
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBooklet}
          className="px-5 py-2.5 bg-white hover:bg-stone-50 text-[#3A5A40] border border-[#588157] text-xs font-black rounded-xl transition-colors shrink-0 shadow-2xs"
        >
          قراءة الكتيب كاملاً 📖
        </button>
      </section>

      {/* Variation 6: Technical Grid Telemetry Footer */}
      <footer className="cell p-4 border border-white/10 bg-[#141416] flex flex-wrap items-center justify-between gap-3 text-[11px] font-geist text-[#e4e4e4]/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c4fb6d] animate-pulse" />
          <span>NETWORK: SECURE // ENCRYPTION: ACTIVE</span>
        </div>
        <div>STABILITY_INDEX: 98.4% // PROTOCOL: NESMAT_V6</div>
        <div>COORD: 30.0444° N, 31.2357° E</div>
      </footer>
    </div>
  );
};
