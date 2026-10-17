import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Wind, 
  Gamepad2, 
  Compass, 
  Heart, 
  Brain, 
  ChevronRight, 
  Clock, 
  Activity, 
  Volume2, 
  RefreshCw, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Coffee,
  Leaf,
  Bell
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../services/storage';
import { MealMoodLogEntry } from './MoodKitchenModal';
import { TextAudioPlayer } from './TextAudioPlayer';
import { chimeService } from '../services/chimeService';
import { localNotificationService } from '../services/localNotificationService';

interface MoodKitchenRecommendationsProps {
  onOpenMoodKitchen?: () => void;
  onNavigate: (tab: any) => void;
  onOpenInnerBurdens?: () => void;
  onOpenEmotionalBridge?: () => void;
  onOpenGratitudeGarden?: () => void;
  onOpenEmotionCompass?: () => void;
  onOpenMindfulnessStudio?: () => void;
  onOpenSoundscapeStudio?: () => void;
  onOpenThoughtRelease?: () => void;
  onOpenFeker?: () => void;
  onOpenWorkshopsHub?: () => void;
  onOpenThoughtJournal?: () => void;
  onOpenEndlessPsychology?: (category: string) => void;
  onOpenCompanion?: () => void;
  onOpenFunAndGames?: () => void;
  theme?: 'dark' | 'light' | 'system';
}

interface RecommendedActivity {
  id: string;
  titleAr: string;
  titleEn: string;
  typeAr: 'لعبة تهدئة' | 'تمرين عصبي' | 'تفريغ وتعبير' | 'طقس غذائي';
  typeEn: 'Calming Game' | 'Somatic Exercise' | 'Release & Express' | 'Gut Ritual';
  descAr: string;
  descEn: string;
  icon: any;
  buttonTextAr: string;
  buttonTextEn: string;
  badgeAr: string;
  badgeEn: string;
  accentColor: string;
  onClick: () => void;
}

export const MoodKitchenRecommendations: React.FC<MoodKitchenRecommendationsProps> = ({
  onOpenMoodKitchen,
  onNavigate,
  onOpenInnerBurdens,
  onOpenEmotionalBridge,
  onOpenGratitudeGarden,
  onOpenEmotionCompass,
  onOpenMindfulnessStudio,
  onOpenSoundscapeStudio,
  onOpenThoughtRelease,
  onOpenFeker,
  onOpenWorkshopsHub,
  onOpenThoughtJournal,
  onOpenEndlessPsychology,
  onOpenCompanion,
  onOpenFunAndGames,
  theme = 'dark'
}) => {
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const [latestLog, setLatestLog] = useState<MealMoodLogEntry | null>(() => {
    return storage.getLatestMoodKitchenLog();
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { hoursElapsed } = localNotificationService.getHoursSinceLastMoodKitchenLog();
  const isOverdue = hoursElapsed >= 24;

  // Sync state whenever storage logs change
  useEffect(() => {
    const handleUpdate = () => {
      setLatestLog(storage.getLatestMoodKitchenLog());
    };
    window.addEventListener('nesmat_mood_kitchen_updated', handleUpdate);
    return () => window.removeEventListener('nesmat_mood_kitchen_updated', handleUpdate);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    chimeService.playReassuranceChime();
    setTimeout(() => {
      setLatestLog(storage.getLatestMoodKitchenLog());
      setIsRefreshing(false);
    }, 300);
  };

  // If no logs recorded yet, render an inviting onboarding card
  if (!latestLog) {
    return (
      <section className={`p-5 sm:p-6 border rounded-3xl relative overflow-hidden transition-all shadow-md ${
        isDark ? 'bg-[#15231B] border-emerald-500/25' : 'bg-white border-emerald-600/15'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'توصيات مطبخ المزاج ومحور الأمعاء–الدماغ' : 'Mood Kitchen & Gut-Brain Recommendations'}</span>
            </div>
            <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {language === 'ar' 
                ? 'كيف تؤثر وجبتك الأخيرة على هدوئك وتفكيرك الآن؟' 
                : 'How does your last meal affect your calm and focus right now?'}
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              {language === 'ar'
                ? 'سجل مكونات وجبتك وشعورك الحالي في مطبخ المزاج لتحصل فوراً على أنشطة مخصصة (ألعاب تفريغ التوتر، تمارين تنفس العصب الحائر، ونصائح ميكروبيوم فورية).'
                : 'Log your meal ingredients and current feelings in Mood Kitchen to get instant personalized calming games, vagus breathing exercises, and microbiome insights.'}
            </p>
          </div>

          <button
            onClick={() => {
              chimeService.playReassuranceChime();
              if (onOpenMoodKitchen) onOpenMoodKitchen();
              else onNavigate('explore');
            }}
            className="w-full sm:w-auto px-5 py-3 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-emerald-400/30"
          >
            <Utensils className="w-4 h-4 text-emerald-200" />
            <span>{language === 'ar' ? 'سجل وجبتك الأولى في مطبخ المزاج' : 'Log Your First Meal & Mood'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </section>
    );
  }

  // Map mood label & emoji
  const moodMeta: Record<MealMoodLogEntry['mood'], { ar: string; en: string; emoji: string; badgeColor: string }> = {
    calm: { ar: 'هادئ ومستقر', en: 'Calm & Grounded', emoji: '🌿', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    tense: { ar: 'مشدود أو متوتر', en: 'Tense or Anxious', emoji: '⚡', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    sluggish: { ar: 'خامل / ثقل فكري', en: 'Sluggish / Brain Fog', emoji: '😴', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    moody: { ar: 'متقلب / سريع الانفعال', en: 'Moody / Irritable', emoji: '🌊', badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    energized: { ar: 'طاقتي عالية وحيوية', en: 'Energized & Vibrant', emoji: '✨', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    bloated: { ar: 'انتفاخ / ثقل هضمي', en: 'Bloated / Discomfort', emoji: '🫧', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
  };

  const mealTypeMeta: Record<MealMoodLogEntry['mealType'], { ar: string; en: string }> = {
    breakfast: { ar: 'إفطار', en: 'Breakfast' },
    lunch: { ar: 'غداء', en: 'Lunch' },
    dinner: { ar: 'عشاء', en: 'Dinner' },
    snack: { ar: 'وجبة خفيفة', en: 'Snack' }
  };

  const comfortMeta: Record<MealMoodLogEntry['digestiveComfort'], { ar: string; en: string }> = {
    light: { ar: 'هضم مريح وخفيف', en: 'Light & Comfortable' },
    moderate: { ar: 'هضم معتدل ومقبول', en: 'Moderate Digestion' },
    heavy: { ar: 'هضم ثقيل ومزعج', en: 'Heavy / Sluggish Digestion' }
  };

  const currentMoodMeta = moodMeta[latestLog.mood] || moodMeta.calm;
  const currentMealType = mealTypeMeta[latestLog.mealType] || mealTypeMeta.lunch;
  const currentComfort = comfortMeta[latestLog.digestiveComfort] || comfortMeta.moderate;

  // Generate activities tailored specifically to the user's latest meal & mood
  const getTailoredActivities = (): RecommendedActivity[] => {
    switch (latestLog.mood) {
      case 'tense':
        return [
          {
            id: 'inner_burdens_calm',
            titleAr: 'لعبة فرقعة الأعباء النفسية',
            titleEn: 'Pop The Inner Burdens Game',
            typeAr: 'لعبة تهدئة',
            typeEn: 'Calming Game',
            descAr: 'فرقعة الفقاعات النفسية تُحفّز مراكز المكافأة وتفرغ شحنات الأدرينالين والتوتر المتراكمة في جهازك العصبي.',
            descEn: 'Popping burdens releases nervous tension and signals your brain to lower stress hormones.',
            icon: Sparkles,
            buttonTextAr: 'ابدأ اللعبة وفرقع التوتر 🫧',
            buttonTextEn: 'Play Burdens Game 🫧',
            badgeAr: 'تفريغ فوري للقلق',
            badgeEn: 'Instant Relief',
            accentColor: 'from-rose-600/30 to-amber-600/20 border-rose-500/30 text-rose-300',
            onClick: () => onOpenInnerBurdens ? onOpenInnerBurdens() : onNavigate('games')
          },
          {
            id: 'vagus_breathing',
            titleAr: 'دقيقة تنفس هادئة للعصب الحائر',
            titleEn: 'Calm Vagus Nerve Breathing',
            typeAr: 'تمرين عصبي',
            typeEn: 'Somatic Exercise',
            descAr: 'الزفير البطيء يرخي الشد العضلي في جدار المعدة والحجاب الحاجز ويُرسل إشارات أمان مباشرة للأمعاء.',
            descEn: 'Slow exhales soothe the diaphragm and signal your enteric nervous system to relax.',
            icon: Wind,
            buttonTextAr: 'بدء دقيقة التنفس 🍃',
            buttonTextEn: 'Start Breathing 🍃',
            badgeAr: 'تحفيز العصب الحائر',
            badgeEn: 'Vagal Tone',
            accentColor: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-300',
            onClick: () => onNavigate('breathe')
          },
          {
            id: 'calm_chamomile_ritual',
            titleAr: 'طقس البابونج والأصوات الدافئة',
            titleEn: 'Chamomile & Soundscape Ritual',
            typeAr: 'طقس غذائي',
            typeEn: 'Gut Ritual',
            descAr: 'اشرب رشفات بابونج دافئ أو نعناع بلدي مع الاستماع لمؤثرات أمواج البحر أو رذاذ المطر لخفض هرمون الكورتيزول.',
            descEn: 'Sip warm chamomile while listening to rain or sea sounds to regulate cortisol.',
            icon: Coffee,
            buttonTextAr: 'استوديو الأصوات الطبيعية 🎧',
            buttonTextEn: 'Soundscape Studio 🎧',
            badgeAr: 'تهدئة معوية ونفسية',
            badgeEn: 'Dual Soothing',
            accentColor: 'from-amber-600/30 to-yellow-600/20 border-amber-500/30 text-amber-300',
            onClick: () => onOpenSoundscapeStudio ? onOpenSoundscapeStudio() : onNavigate('mind')
          }
        ];

      case 'sluggish':
        return [
          {
            id: 'feker_puzzle',
            titleAr: 'تطبيق فكّر ولغز إعادة التأطير الذهني',
            titleEn: 'Feker Cognitive Reframing',
            typeAr: 'لعبة تهدئة',
            typeEn: 'Calming Game',
            descAr: 'تفكيك فكرة واحدة سريعة ينشط القشرة الجبهية في الدماغ ويوقظ التركيز من خمول ما بعد الوجبة.',
            descEn: 'Deconstructing a thought gently reactivates prefrontal focus after post-meal sluggishness.',
            icon: Brain,
            buttonTextAr: 'ابدأ تطبيق فكّر 💡',
            buttonTextEn: 'Open Feker App 💡',
            badgeAr: 'إيقاظ التركيز واليقظة',
            badgeEn: 'Mental Spark',
            accentColor: 'from-amber-600/30 to-orange-600/20 border-amber-500/30 text-amber-300',
            onClick: () => onOpenFeker ? onOpenFeker() : onNavigate('games')
          },
          {
            id: 'mindful_walk',
            titleAr: 'استوديو التيقظ والحركة الذهنية الخفيفة',
            titleEn: 'Mindful Light Movement Studio',
            typeAr: 'تمرين عصبي',
            typeEn: 'Somatic Exercise',
            descAr: 'المشي البطيء أو التمدد الواعي لمدة ٥ دقائق يعيد توزيع الدورة الدموية من الجهاز الهضمي إلى العضلات والدماغ.',
            descEn: 'A 5-minute gentle stretch or slow walk redistributes blood flow to revive alertness.',
            icon: Activity,
            buttonTextAr: 'استوديو التيقظ 🧘',
            buttonTextEn: 'Mindfulness Studio 🧘',
            badgeAr: 'تنشيط الأيض والدورة',
            badgeEn: 'Metabolic Boost',
            accentColor: 'from-teal-600/30 to-emerald-600/20 border-teal-500/30 text-teal-300',
            onClick: () => onOpenMindfulnessStudio ? onOpenMindfulnessStudio() : onNavigate('mind')
          },
          {
            id: 'water_lemon_ritual',
            titleAr: 'إنعاش الأمعاء بماء الليمون الفاتر',
            titleEn: 'Hydration & Lemon Refreshment',
            typeAr: 'طقس غذائي',
            typeEn: 'Gut Ritual',
            descAr: 'تناول كوب ماء فاتر مع قطرات ليمون لتنشيط إنزيمات الكبد وتجنب الحلويات السريعة التي تزيد هبوط السكر.',
            descEn: 'Drink warm lemon water to awaken enzymes without sugar crash spikes.',
            icon: Leaf,
            buttonTextAr: 'وصفات مطبخ المزاج 🍳',
            buttonTextEn: 'Mood Kitchen Recipes 🍳',
            badgeAr: 'صفاء فكري فوري',
            badgeEn: 'Mental Clarity',
            accentColor: 'from-emerald-600/30 to-cyan-600/20 border-emerald-500/30 text-emerald-300',
            onClick: () => onOpenMoodKitchen ? onOpenMoodKitchen() : onNavigate('explore')
          }
        ];

      case 'bloated':
        return [
          {
            id: 'gratitude_garden_distract',
            titleAr: 'حديقة الامتنان ونقل الانتباه الحسي',
            titleEn: 'Gratitude Garden Sensory Shift',
            typeAr: 'لعبة تهدئة',
            typeEn: 'Calming Game',
            descAr: 'زراعة أزهار الامتنان تكسر دوامة الانزعاج الجسدي وتوجه مسارات الدماغ العصبية نحو الارتياح والسكينة.',
            descEn: 'Planting gratitude flowers diverts attention away from gut heaviness toward peace.',
            icon: Heart,
            buttonTextAr: 'ازرع زهرة في حديقتك 🌸',
            buttonTextEn: 'Plant Gratitude Flower 🌸',
            badgeAr: 'تحويل الانتباه الواعي',
            badgeEn: 'Gentle Focus',
            accentColor: 'from-purple-600/30 to-pink-600/20 border-purple-500/30 text-purple-300',
            onClick: () => onOpenGratitudeGarden ? onOpenGratitudeGarden() : onNavigate('games')
          },
          {
            id: 'diaphragm_release',
            titleAr: 'إرخاء الحجاب الحاجز وتنفس التخفيف',
            titleEn: 'Diaphragmatic Relaxation Breath',
            typeAr: 'تمرين عصبي',
            typeEn: 'Somatic Exercise',
            descAr: 'الانتفاخ يضغط على الحجاب الحاجز؛ التنفس البطني العميق مع إسناد الظهر يُفرغ ضغط الغازات ويُريح الأحشاء.',
            descEn: 'Diaphragm breath eases visceral tension and restores smooth airflow.',
            icon: Wind,
            buttonTextAr: 'ابدأ تنفس التخفيف 🍃',
            buttonTextEn: 'Start Gentle Breath 🍃',
            badgeAr: 'تخفيف الضغط الحشوي',
            badgeEn: 'Visceral Ease',
            accentColor: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-300',
            onClick: () => onNavigate('breathe')
          },
          {
            id: 'cumin_mint_tea',
            titleAr: 'مغلي الكمون والنعناع البلدي الدافئ',
            titleEn: 'Warm Cumin & Mint Elixir',
            typeAr: 'طقس غذائي',
            typeEn: 'Gut Ritual',
            descAr: 'كوب دافئ من الكمون والنعناع البلدي يرخي عضلات الأمعاء الدقيقة ويطرد الغازات دون أي منبهات عصبية.',
            descEn: 'Warm cumin and baladi mint tea naturally calms smooth gut muscles.',
            icon: Coffee,
            buttonTextAr: 'تفاصيل مطبخ المزاج 🍳',
            buttonTextEn: 'Open Mood Kitchen 🍳',
            badgeAr: 'راحة هضمية سريعة',
            badgeEn: 'Digestive Relief',
            accentColor: 'from-purple-600/30 to-emerald-600/20 border-purple-500/30 text-purple-300',
            onClick: () => onOpenMoodKitchen ? onOpenMoodKitchen() : onNavigate('explore')
          }
        ];

      case 'moody':
        return [
          {
            id: 'emotion_compass_clarity',
            titleAr: 'بوصلة المشاعر وتسمية الانفعال بدقة',
            titleEn: 'Emotion Compass Exploration',
            typeAr: 'تفريغ وتعبير',
            typeEn: 'Release & Express',
            descAr: 'عندما تتقلب كيمياء الهضم تتشابك المشاعر؛ حدد شعورك الدقيق الآن عبر البوصلة لتستعيد السيطرة.',
            descEn: 'Digestive shifts can spark moodiness; name your exact feeling with the compass.',
            icon: Compass,
            buttonTextAr: 'افتح بوصلة المشاعر 🧭',
            buttonTextEn: 'Open Emotion Compass 🧭',
            badgeAr: 'التسمية تروّض المشاعر',
            badgeEn: 'Name It To Tame It',
            accentColor: 'from-orange-600/30 to-amber-600/20 border-orange-500/30 text-orange-300',
            onClick: () => onOpenEmotionCompass ? onOpenEmotionCompass() : onNavigate('explore')
          },
          {
            id: 'emotional_bridge_game',
            titleAr: 'لعبة الجسر العاطفي وموازنة ردود الفعل',
            titleEn: 'Emotional Bridge Balancing Game',
            typeAr: 'لعبة تهدئة',
            typeEn: 'Calming Game',
            descAr: 'بناء الجسر النفسي بين الانفعال العاصف والتصرف الحكيم يمنحك مهلة ذهبية قبل إطلاق الأحكام.',
            descEn: 'Build the bridge between raw impulses and wise balanced responses.',
            icon: Gamepad2,
            buttonTextAr: 'العب الجسر العاطفي 🌉',
            buttonTextEn: 'Play Bridge Game 🌉',
            badgeAr: 'تنظيم الاستجابة الانفعالية',
            badgeEn: 'Emotional Regulation',
            accentColor: 'from-teal-600/30 to-blue-600/20 border-teal-500/30 text-teal-300',
            onClick: () => onOpenEmotionalBridge ? onOpenEmotionalBridge() : onNavigate('games')
          },
          {
            id: 'companion_talk',
            titleAr: 'محادثة آمنة مع رفيقي للتفريغ',
            titleEn: 'Supportive Chat with Companion',
            typeAr: 'تفريغ وتعبير',
            typeEn: 'Release & Express',
            descAr: 'تحدث مع رفيقك المتفهم بكلمات بسيطة لتهدئة العاصفة النفسية واستعادة الاتزان بهدوء وبلا أحكام.',
            descEn: 'Talk to your compassionate companion to vent and regain internal equilibrium.',
            icon: Sparkles,
            buttonTextAr: 'تحدث مع رفيقي 🌿',
            buttonTextEn: 'Chat with Companion 🌿',
            badgeAr: 'مساحة فضفضة آمنة',
            badgeEn: 'Safe Space',
            accentColor: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-300',
            onClick: () => onOpenCompanion ? onOpenCompanion() : onNavigate('explore')
          }
        ];

      case 'energized':
        return [
          {
            id: 'workshops_hub_action',
            titleAr: 'ورش العمل وبناء الخطة الشخصية المتكاملة',
            titleEn: 'Workshops & Personal Growth Plan',
            typeAr: 'تفريغ وتعبير',
            typeEn: 'Release & Express',
            descAr: 'استثمر هذه الحيوية العصبية المتدفقة في إتقان مهارة نفسية جديدة أو وضع خطة حدود واعية ليومك.',
            descEn: 'Channel this vibrant mental energy into mastering psychological coping skills.',
            icon: Activity,
            buttonTextAr: 'استكشف ورش العمل 📚',
            buttonTextEn: 'Explore Workshops 📚',
            badgeAr: 'استثمار الحيوية الذهنية',
            badgeEn: 'Growth Momentum',
            accentColor: 'from-teal-600/30 to-emerald-600/20 border-teal-500/30 text-teal-300',
            onClick: () => onOpenWorkshopsHub ? onOpenWorkshopsHub() : onNavigate('workshops')
          },
          {
            id: 'thought_journal_document',
            titleAr: 'مذكرة الأفكار وتوثيق لحظات القوة',
            titleEn: 'Thought Journal & Strength Log',
            typeAr: 'تفريغ وتعبير',
            typeEn: 'Release & Express',
            descAr: 'اكتب ما ساعدك على الشعور بالنشاط اليوم؛ التوثيق يحفظ المسار العصبي الإيجابي للعودة إليه وقت الإرهاق.',
            descEn: 'Record what supported your vitality today to anchor this neural pattern.',
            icon: Heart,
            buttonTextAr: 'افتح مذكرة الأفكار ✍️',
            buttonTextEn: 'Open Journal ✍️',
            badgeAr: 'ترسيخ العادات الإيجابية',
            badgeEn: 'Anchor Habit',
            accentColor: 'from-amber-600/30 to-teal-600/20 border-amber-500/30 text-amber-300',
            onClick: () => onOpenThoughtJournal ? onOpenThoughtJournal() : onNavigate('mind')
          },
          {
            id: 'endless_knowledge_dive',
            titleAr: 'موسوعة المعلومات النفسية اللانهائية',
            titleEn: 'Endless Psychology Knowledge Dive',
            typeAr: 'تمرين عصبي',
            typeEn: 'Somatic Exercise',
            descAr: 'اكتشف حقائق علم الأعصاب ومحور الأمعاء–الدماغ لتغذية عقلك بحلول عملية مبنية على أحدث الأبحاث.',
            descEn: 'Learn practical neuroscience insights to sustain long-term resilience.',
            icon: Brain,
            buttonTextAr: 'تصفح الموسوعة 🧠',
            buttonTextEn: 'Browse Knowledge Hub 🧠',
            badgeAr: 'علم أعصاب تطبيقي',
            badgeEn: 'Applied Neuroscience',
            accentColor: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-300',
            onClick: () => onOpenEndlessPsychology ? onOpenEndlessPsychology('mind_library') : onNavigate('explore')
          }
        ];

      case 'calm':
      default:
        return [
          {
            id: 'gratitude_garden_calm',
            titleAr: 'لعبة حديقة الامتنان وترسيخ الرضا',
            titleEn: 'Gratitude Garden Grounding',
            typeAr: 'لعبة تهدئة',
            typeEn: 'Calming Game',
            descAr: 'في حالات الهدوء، تكون الأمعاء والدماغ في حالة ترميم؛ زراعة ورود الامتنان ترسخ هذا الاستقرار العصبي.',
            descEn: 'When calm, your nervous system is in restorative balance; cultivate flowers of gratitude.',
            icon: Heart,
            buttonTextAr: 'ازرع في حديقة الامتنان 🌸',
            buttonTextEn: 'Plant Gratitude Flower 🌸',
            badgeAr: 'ترسيخ السكينة العصبية',
            badgeEn: 'Rest & Digest',
            accentColor: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-300',
            onClick: () => onOpenGratitudeGarden ? onOpenGratitudeGarden() : onNavigate('games')
          },
          {
            id: 'soundscape_deep_peace',
            titleAr: 'استوديو الأصوات والمشاهد الهادئة',
            titleEn: 'Calm Nature Soundscape Studio',
            typeAr: 'تمرين عصبي',
            typeEn: 'Somatic Exercise',
            descAr: 'استمع إلى صوت أمواج نيل أسوان أو حفيف الأشجار لتعميق موجات ألفا الدماغية والحفاظ على صفائك.',
            descEn: 'Immerse in soothing Nile waves or gentle rain to deepen alpha brainwaves.',
            icon: Volume2,
            buttonTextAr: 'افتح استوديو الأصوات 🎧',
            buttonTextEn: 'Open Soundscape 🎧',
            badgeAr: 'استدامة التوازن',
            badgeEn: 'Sustained Equilibrium',
            accentColor: 'from-teal-600/30 to-cyan-600/20 border-teal-500/30 text-teal-300',
            onClick: () => onOpenSoundscapeStudio ? onOpenSoundscapeStudio() : onNavigate('mind')
          },
          {
            id: 'golden_milk_ritual',
            titleAr: 'أكسير السكينة والحليب الذهبي',
            titleEn: 'Golden Elixir Evening Ritual',
            typeAr: 'طقس غذائي',
            typeEn: 'Gut Ritual',
            descAr: 'استكشف وصفة الحليب الذهبي بالكركم والقرفة في مطبخ المزاج لدعم مضادات الالتهاب العصبية.',
            descEn: 'Explore turmeric golden elixir recipe to support neural anti-inflammatory benefits.',
            icon: Coffee,
            buttonTextAr: 'وصفات مطبخ المزاج 🍳',
            buttonTextEn: 'Mood Kitchen Recipes 🍳',
            badgeAr: 'حماية الميكروبيوم',
            badgeEn: 'Microbiome Shield',
            accentColor: 'from-amber-600/30 to-emerald-600/20 border-amber-500/30 text-amber-300',
            onClick: () => onOpenMoodKitchen ? onOpenMoodKitchen() : onNavigate('explore')
          }
        ];
    }
  };

  const tailoredActivities = getTailoredActivities();

  return (
    <section className={`p-5 sm:p-6 border rounded-3xl relative overflow-hidden transition-all shadow-md space-y-5 ${
      isDark ? 'bg-[#132219] border-emerald-500/25' : 'bg-white border-emerald-600/15'
    }`}>
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 border-emerald-500/15">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'توصيات ذكية مستندة لـ «مطبخ المزاج»' : 'Mood Kitchen Smart Recommendations'}</span>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentMoodMeta.badgeColor}`}>
              <span>{currentMoodMeta.emoji}</span>
              <span>{language === 'ar' ? `المزاج الأخير: ${currentMoodMeta.ar}` : `Last Mood: ${currentMoodMeta.en}`}</span>
            </span>
          </div>

          <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <span>{language === 'ar' ? 'أنشطة مقترحة لحالتك النفسية والهضمية الآن' : 'Activities Tailored to Your Digestive & Mind State'}</span>
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => {
              chimeService.playReassuranceChime();
              localNotificationService.triggerTestReminder();
            }}
            title={language === 'ar' ? 'اختبار تذكير الـ ٢٤ ساعة محلياً' : 'Test 24h Local Reminder'}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              isDark 
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30' 
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold">{language === 'ar' ? 'فحص التنبيه 🔔' : 'Test 24h'}</span>
          </button>

          <button
            onClick={handleManualRefresh}
            title={language === 'ar' ? 'تحديث التوصيات' : 'Refresh Recommendations'}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              isDark 
                ? 'bg-black/20 hover:bg-black/40 text-stone-300 border-white/10' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              chimeService.playReassuranceChime();
              if (onOpenMoodKitchen) onOpenMoodKitchen();
              else onNavigate('explore');
            }}
            className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'سجل وجبة جديدة' : 'Log New Meal'}</span>
          </button>
        </div>
      </div>

      {/* Latest Evaluation Status Card */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
        isDark ? 'bg-black/25 border-emerald-500/20' : 'bg-emerald-50/60 border-emerald-600/15'
      }`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? latestLog.timeFormattedAr : latestLog.timeFormattedEn}</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-emerald-300">
              {language === 'ar' ? `وجبة: ${currentMealType.ar}` : `Meal: ${currentMealType.en}`}
            </span>
            <span>•</span>
            <span className="text-stone-300">
              {language === 'ar' ? currentComfort.ar : currentComfort.en}
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>
            <span className="font-bold text-amber-300">{language === 'ar' ? 'رؤية محور الأمعاء–الدماغ: ' : 'Gut-Brain Insight: '}</span>
            {language === 'ar' ? latestLog.advice.gutBrainConnectionAr : latestLog.advice.gutBrainConnectionEn}
          </p>
        </div>

        {/* Audio Player for the advice */}
        <div className="shrink-0 pt-1 md:pt-0">
          <TextAudioPlayer
            text={language === 'ar' ? `${latestLog.advice.titleAr}. ${latestLog.advice.gutBrainConnectionAr} ${latestLog.advice.practicalTipAr}` : `${latestLog.advice.titleEn}. ${latestLog.advice.gutBrainConnectionEn}`}
            label={language === 'ar' ? 'استمع للرؤية النفسية' : 'Listen to Insight'}
            variant="compact"
          />
        </div>
      </div>

      {/* Recommended Activities Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-400 px-1">
          <span>{language === 'ar' ? 'أنشطة موصى بها مخصصة لحالتك الآن:' : 'Recommended Activities for Your State:'}</span>
          <span className="text-[11px] text-emerald-400 font-normal">
            {language === 'ar' ? 'اضغط للبدء المباشر' : 'Tap to start directly'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tailoredActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 group hover:border-emerald-400/50 hover:shadow-lg ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/25">
                      {language === 'ar' ? act.typeAr : act.typeEn}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {language === 'ar' ? act.badgeAr : act.badgeEn}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold leading-snug group-hover:text-emerald-300 transition-colors ${
                        isDark ? 'text-white' : 'text-stone-900'
                      }`}>
                        {language === 'ar' ? act.titleAr : act.titleEn}
                      </h4>
                    </div>
                  </div>

                  <p className={`text-[11px] leading-relaxed line-clamp-3 ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {language === 'ar' ? act.descAr : act.descEn}
                  </p>
                </div>

                <button
                  onClick={() => {
                    chimeService.playReassuranceChime();
                    act.onClick();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 ${
                    isDark 
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{language === 'ar' ? act.buttonTextAr : act.buttonTextEn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Microbiome & Vagus Quick Note */}
      <div className={`p-3 rounded-2xl border text-[11px] flex items-center gap-2.5 ${
        isDark ? 'bg-amber-950/20 border-amber-500/25 text-amber-200' : 'bg-amber-50 border-amber-600/20 text-amber-900'
      }`}>
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="leading-relaxed">
          <span className="font-bold">{language === 'ar' ? 'نصيحة تطبيقية: ' : 'Actionable Tip: '}</span>
          {language === 'ar' ? latestLog.advice.practicalTipAr : latestLog.advice.practicalTipEn}
        </p>
      </div>
    </section>
  );
};
