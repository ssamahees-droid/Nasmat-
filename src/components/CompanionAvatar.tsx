import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Eye, Volume2, VolumeX, Mic, Heart, RefreshCw, ZapOff, Shield, Smile, 
  Palette, Check, X, Camera, Upload, Trash2, Image as ImageIcon, Lock, User,
  Sparkle, Copy, BookOpen, Wind
} from 'lucide-react';
import { AnimeTheme, AnimeAccessory, CompanionPersona, CompanionExpression } from '../types/companion';
import { CompanionAnimeRig } from './CompanionAnimeRig';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

export type { CompanionExpression, CompanionPersona, AnimeTheme, AnimeAccessory };
export type CompanionVisualStyle = 'anime' | 'realistic' | 'photo';

export interface CompanionAvatarProps {
  persona: CompanionPersona;
  expression: CompanionExpression;
  isSpeaking: boolean;
  isListening: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onTogglePersona?: () => void;
  allowAnimationToggle?: boolean;
  isAnimated?: boolean;
  onToggleAnimation?: () => void;
  customPhoto?: string | null;
  className?: string;
  theme?: AnimeTheme;
  accessory?: AnimeAccessory;
  onThemeChange?: (theme: AnimeTheme) => void;
  onAccessoryChange?: (accessory: AnimeAccessory) => void;
  allowCustomization?: boolean;
  visualStyle?: CompanionVisualStyle;
  onVisualStyleChange?: (style: CompanionVisualStyle) => void;
}

// 1. Realistic Photographic Human Portraits
export const PERSONA_REALISTIC_PORTRAITS: Record<CompanionPersona, {
  src: string;
  alt: string;
  label: string;
  badge: string;
  subtitle: string;
  ringColor: string;
}> = {
  child: {
    src: '/src/assets/images/companion_child_portrait_1791644396286.jpg',
    alt: 'بورتريه بشري واقعي للطفل الداخلي - براءة وعفوية وأمان عاطفي',
    label: 'الطفل الداخلي',
    badge: '🌱 الطفل الداخلي',
    subtitle: 'براءة، عفوية، واحتواء عاطفي دافئ',
    ringColor: 'ring-amber-400/50 dark:ring-amber-400/40'
  },
  adult: {
    src: '/src/assets/images/companion_adult_portrait_1791644375469.jpg',
    alt: 'بورتريه بشري واقعي للراشد المتزن - سكينة ووعي وسلام داخلي',
    label: 'الراشد المتزن',
    badge: '🌿 الراشد المتزن',
    subtitle: 'سكينة، وعي حاضر، واتزان نفسي',
    ringColor: 'ring-emerald-500/50 dark:ring-emerald-400/40'
  },
  father: {
    src: '/src/assets/images/companion_father_portrait_1791879032939.jpg',
    alt: 'بورتريه بشري واقعي للأب الداخلي - حكمة ووقار وحماية مطمئنة',
    label: 'الأب الداخلي',
    badge: '🛡️ الأب الداخلي',
    subtitle: 'حكمة، وقار، وحزم حنون يحمي حدودك',
    ringColor: 'ring-blue-500/50 dark:ring-blue-400/40'
  },
  my_photo: {
    src: '/src/assets/images/companion_adult_portrait_1791644375469.jpg',
    alt: 'صورتي الشخصية أو رفيقي المخصص',
    label: 'صورتي الشخصية',
    badge: '👤 صورتي الشخصية',
    subtitle: 'رفيقك الخاص المميز',
    ringColor: 'ring-emerald-500/50 dark:ring-emerald-400/40'
  }
};

// 2. 21 Warm, authentic psychological reassurance whispers (7 per persona)
export const REASSURANCE_WHISPERS: Record<CompanionPersona, string[]> = {
  child: [
    'كل شيء سيكون بخير، ابتسم! أنا هنا جنبك دايماً 🌱',
    'مشاعرك نقية وغالية.. خذ نفس عميق وافتكر إنك في أمان 🌸',
    'يلا نبتسم سوا! وجودك في الدنيا بيضيف نور وبهجة ✨',
    'مش لازم تكون مثالي دايماً، كفاية إنك بتحاول وتتعلم من قلبك 🎈',
    'قلبك يستاهل كل الحنان واللطف.. خفف عن نفسك شوية 🤍',
    'أنت محبوب كما أنت، وكل يوم خطوة صغيرة بتنوّر طريقك 🌟',
    'مشاعرك دي طبيعية ومفهومة جداً.. خد وقتك على مهلك 🍃'
  ],
  adult: [
    'تنفس بهدوء.. كل خطوة واعية تخطوها اليوم تصنع فارقاً حقيقياً 🌿',
    'وازن بين واجباتك وحق روحك في السكينة والراحة والتقدير ⚖️',
    'أنت لست أفكارك المتسارعة، أنت الوعي الهادئ الذي يراقبها 🕊️',
    'مهما تراكمت الضغوط، خذ الأمر خطوة بخطوة وستنجزها بثبات 🍃',
    'سلامك النفسي أولوية حقيقية وليس رفاهية.. ركّز على ما تملك تغييره 🎯',
    'قبول الواقع بمرونة هو بداية كل تغيير حقيقي ومتزن 🧭',
    'قوتك تكمن في قدرتك على التوقف والاستماع لنفسك بإنصاف 💎'
  ],
  father: [
    'أنا فخور بيك وبصبرك.. مهما كانت الصعوبات، قوتك كافية لتجاوزها 🛡️',
    'أنت في حماية حكمتك.. لن تترك نفسك للضياع بعد اليوم 🧭',
    'استند على قوتك الداخلية وثق في قراراتك، الخطأ مجرد درس للنمو 🌲',
    'لا تقسُ على ذاتك.. الحزم الحنون هو طريق الرجولة والنضج الحقيقي 🌟',
    'اطمئن، ظهرك محمي وإرادتك راسخة.. أكمل طريقك بجبين مرفوع 🦅',
    'لكل عاصفة نهاية مؤكدة، وثباتك الواعي الآن هو رأس مالك غداً ⚓',
    'أنت قادر على حماية حدودك النفسية ورسم مسارك بكرامة واطمئنان 🏔️'
  ],
  my_photo: [
    'أنا هنا معك في كل لحظة، نتقدم بخطوات واثقة وثابتة نحو السلام الداخلي 💫',
    'كل تحدٍ تجتازه يصنع منك نسخة أكثر حكمة وسلاماً 🌿',
    'كن لطيفاً مع نفسك اليوم، فأنت تستحق كل خير واطمئنان 🤍'
  ]
};

export const THEME_OPTIONS: { id: AnimeTheme; label: string; icon: string; desc: string; gradient: string }[] = [
  { id: 'ghibli', label: 'طبيعة جيبلي', icon: '🍃', desc: 'نسائم خضراء ودفء شروق الشمس', gradient: 'from-emerald-500/25 via-teal-400/20 to-amber-300/20' },
  { id: 'sakura', label: 'نسيم الساكورا', icon: '🌸', desc: 'أزهار كرز وردية وسكينة ربيعية', gradient: 'from-rose-400/30 via-pink-300/20 to-amber-200/20' },
  { id: 'starlight', label: 'أفق الشهب', icon: '✨', desc: 'سماء ليلية لامعة ونجوم هادئة', gradient: 'from-indigo-600/30 via-purple-500/25 to-amber-300/20' },
  { id: 'ocean', label: 'سكينة البحر', icon: '🌊', desc: 'أمواج فيروزية وتأمل عميق', gradient: 'from-cyan-500/30 via-blue-400/25 to-teal-300/20' }
];

export const ACCESSORY_OPTIONS: { id: AnimeAccessory; label: string; icon: string }[] = [
  { id: 'sprout', label: 'نبتة الأمل', icon: '🌱' },
  { id: 'sakura', label: 'زهرة السلام', icon: '🌸' },
  { id: 'crescent', label: 'هلال السكينة', icon: '🌙' },
  { id: 'glasses', label: 'نظارات الحكمة', icon: '👓' },
  { id: 'none', label: 'طبيعي بدون زينة', icon: '✨' }
];

export const LOCAL_STORAGE_THEME_KEY = 'nesmat_anime_avatar_theme';
export const LOCAL_STORAGE_ACCESSORY_KEY = 'nesmat_anime_avatar_accessory';
export const LOCAL_STORAGE_USER_PHOTO_KEY = 'nesmat_custom_mirror_photo';
export const LOCAL_STORAGE_VISUAL_STYLE_KEY = 'nesmat_companion_visual_style';

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  persona,
  expression,
  isSpeaking,
  isListening,
  size = 'lg',
  onTogglePersona,
  allowAnimationToggle = false,
  isAnimated = true,
  onToggleAnimation,
  customPhoto,
  className = '',
  theme: controlledTheme,
  accessory: controlledAccessory,
  onThemeChange,
  onAccessoryChange,
  allowCustomization = true,
  visualStyle: controlledStyle,
  onVisualStyleChange
}) => {
  // 1. Visual Style State: 'anime' | 'realistic' | 'photo'
  const [internalStyle, setInternalStyle] = useState<CompanionVisualStyle>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VISUAL_STYLE_KEY);
      if (saved && ['anime', 'realistic', 'photo'].includes(saved)) {
        return saved as CompanionVisualStyle;
      }
    } catch (_) {}
    return 'realistic';
  });

  const currentStyle = controlledStyle || internalStyle;

  const handleSelectStyle = (newStyle: CompanionVisualStyle) => {
    setInternalStyle(newStyle);
    try {
      localStorage.setItem(LOCAL_STORAGE_VISUAL_STYLE_KEY, newStyle);
      window.dispatchEvent(new Event('nesmat_avatar_style_changed'));
    } catch (_) {}
    if (onVisualStyleChange) onVisualStyleChange(newStyle);
  };

  // 2. Personal Photo State
  const [localUserPhoto, setLocalUserPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_USER_PHOTO_KEY) || null;
    } catch (_) {
      return null;
    }
  });

  // Listen for storage events to synchronize style & photos across instances
  useEffect(() => {
    const handleSync = () => {
      try {
        const photo = localStorage.getItem(LOCAL_STORAGE_USER_PHOTO_KEY);
        setLocalUserPhoto(photo || null);
        const style = localStorage.getItem(LOCAL_STORAGE_VISUAL_STYLE_KEY);
        if (style && ['anime', 'realistic', 'photo'].includes(style)) {
          setInternalStyle(style as CompanionVisualStyle);
        }
      } catch (_) {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('nesmat_avatar_style_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('nesmat_avatar_style_changed', handleSync);
    };
  }, []);

  // 3. Aura Theme & Accessory State
  const [internalTheme, setInternalTheme] = useState<AnimeTheme>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (saved && ['ghibli', 'sakura', 'starlight', 'ocean'].includes(saved)) {
        return saved as AnimeTheme;
      }
    } catch (_) {}
    return 'ghibli';
  });

  const [internalAccessory, setInternalAccessory] = useState<AnimeAccessory>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ACCESSORY_KEY);
      if (saved && ['none', 'sprout', 'sakura', 'crescent', 'glasses'].includes(saved)) {
        return saved as AnimeAccessory;
      }
    } catch (_) {}
    return 'sprout';
  });

  const currentTheme = controlledTheme || internalTheme;
  const currentAccessory = controlledAccessory || internalAccessory;

  const handleSelectTheme = (t: AnimeTheme) => {
    setInternalTheme(t);
    try { localStorage.setItem(LOCAL_STORAGE_THEME_KEY, t); } catch (_) {}
    if (onThemeChange) onThemeChange(t);
  };

  const handleSelectAccessory = (a: AnimeAccessory) => {
    setInternalAccessory(a);
    try { localStorage.setItem(LOCAL_STORAGE_ACCESSORY_KEY, a); } catch (_) {}
    if (onAccessoryChange) onAccessoryChange(a);
  };

  const handleResetDefaults = () => {
    handleSelectTheme('ghibli');
    handleSelectAccessory('sprout');
    try {
      localStorage.removeItem(LOCAL_STORAGE_THEME_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ACCESSORY_KEY);
    } catch (_) {}
  };

  // 4. Modals and Popovers
  const [showStyleModal, setShowStyleModal] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5. Interactive Reassurance Touch & Chime State
  const [activeWhisper, setActiveWhisper] = useState<string | null>(null);
  const [showHeartsBurst, setShowHeartsBurst] = useState<boolean>(false);
  const [isWinking, setIsWinking] = useState<boolean>(false);
  const [hasCopiedWhisper, setHasCopiedWhisper] = useState<boolean>(false);
  const [hasSavedWhisper, setHasSavedWhisper] = useState<boolean>(false);
  const [isChimeMuted, setIsChimeMuted] = useState<boolean>(() => chimeService.isMuted());
  const whisperTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronized Breathing Session State with Companion
  const [isBreathingSync, setIsBreathingSync] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState<number>(4);

  // Breathing Cycle Loop
  useEffect(() => {
    if (!isBreathingSync) return;

    let seconds = 0;
    // Play initial inhale cue
    chimeService.playBreathCue('inhale');

    const interval = setInterval(() => {
      seconds = (seconds + 1) % 12; // 4s inhale, 4s hold, 4s exhale
      if (seconds < 4) {
        setBreathPhase('inhale');
        setBreathCount(4 - seconds);
        if (seconds === 0) chimeService.playBreathCue('inhale');
      } else if (seconds < 8) {
        setBreathPhase('hold');
        setBreathCount(8 - seconds);
      } else {
        setBreathPhase('exhale');
        setBreathCount(12 - seconds);
        if (seconds === 8) chimeService.playBreathCue('exhale');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingSync]);

  const handleToggleBreathingSync = () => {
    setIsBreathingSync(prev => !prev);
  };

  const handleToggleChimeMute = () => {
    const muted = chimeService.toggleMute();
    setIsChimeMuted(muted);
  };

  const handleAvatarTouch = () => {
    const quotes = REASSURANCE_WHISPERS[persona];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setActiveWhisper(quote);

    setShowHeartsBurst(true);
    setIsWinking(true);
    setHasCopiedWhisper(false);
    setHasSavedWhisper(false);

    // Play soothing singing-bowl chime
    chimeService.playReassuranceChime();

    if (whisperTimerRef.current) clearTimeout(whisperTimerRef.current);
    whisperTimerRef.current = setTimeout(() => {
      setActiveWhisper(null);
      setShowHeartsBurst(false);
      setIsWinking(false);
    }, 5500);
  };

  const handleCopyWhisper = async () => {
    if (!activeWhisper) return;
    try {
      await navigator.clipboard.writeText(activeWhisper);
      setHasCopiedWhisper(true);
      setTimeout(() => setHasCopiedWhisper(false), 3000);
    } catch (_) {}
  };

  const handleSaveWhisperToJournal = () => {
    if (!activeWhisper) return;
    try {
      const personaLabels: Record<CompanionPersona, string> = {
        child: 'الطفل الداخلي',
        adult: 'الراشد المتزن',
        father: 'الأب الداخلي',
        my_photo: 'صورتي الشخصية'
      };
      storage.addThoughtPost({
        title: `همسة طمأنينة من ${personaLabels[persona]} ✨`,
        content: activeWhisper,
        category: 'gentleness',
        mood: 'peaceful' as any,
        promptUsed: 'لمسة طمأنينة وتواصل مع رفيقي',
        isFavorite: true
      });
      setHasSavedWhisper(true);
      setTimeout(() => setHasSavedWhisper(false), 3500);
    } catch (_) {}
  };

  // 6. Reduced Motion Detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  });

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } catch (_) {}
  }, []);

  const [internalAnimatedMode, setInternalAnimatedMode] = useState<boolean>(false);
  const isAnimatedMode = (isAnimated !== undefined ? isAnimated : internalAnimatedMode) && !prefersReducedMotion;

  const handleToggleAnimated = () => {
    if (onToggleAnimation) {
      onToggleAnimation();
    } else {
      setInternalAnimatedMode(prev => !prev);
    }
  };

  // 7. Blinking, Visemes, and Breathing cycles
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [visemeIndex, setVisemeIndex] = useState<number>(0);
  const [breathTick, setBreathTick] = useState<number>(0);

  // Natural blink loop for anime rig
  useEffect(() => {
    if (!isAnimatedMode || currentStyle !== 'anime') return;
    let timer: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      const delay = 3200 + Math.random() * 2800;
      timer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 180);
      }, delay);
    };
    scheduleNextBlink();
    return () => clearTimeout(timer);
  }, [isAnimatedMode, currentStyle]);

  // Speaking mouth movement for anime rig
  useEffect(() => {
    if (!isSpeaking || !isAnimatedMode || currentStyle !== 'anime') {
      setVisemeIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setVisemeIndex(prev => (prev + 1) % 5);
    }, 120);
    return () => {
      clearInterval(interval);
      setVisemeIndex(0);
    };
  }, [isSpeaking, isAnimatedMode, currentStyle]);

  // Gentle breath loop
  useEffect(() => {
    if (!isAnimatedMode) return;
    const interval = setInterval(() => {
      setBreathTick(t => (t + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, [isAnimatedMode]);

  // 8. Personal Photo File Upload (Client-side only)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadFeedback('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadFeedback('حجم الصورة كبير، يرجى اختيار صورة أقل من 8 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 640;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

          try {
            localStorage.setItem(LOCAL_STORAGE_USER_PHOTO_KEY, compressedDataUrl);
            setLocalUserPhoto(compressedDataUrl);
            handleSelectStyle('photo');
            setUploadFeedback('تم حفظ صورتك الشخصية محلياً وتفعيلها بنجاح! 🌿');
          } catch (_) {
            setUploadFeedback('تعذر حفظ الصورة محلياً؛ قد تكون مساحة التخزين ممتلئة.');
          }
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteUserPhoto = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_PHOTO_KEY);
      setLocalUserPhoto(null);
      handleSelectStyle('realistic');
      setUploadFeedback('تم حذف الصورة الشخصية واستعادة المظهر الواقعي.');
    } catch (_) {}
  };

  // 9. Sizing Definitions (44px to 224px spectrum)
  const sizeMap = {
    xs: { px: 44, classNames: 'w-11 h-11' },
    sm: { px: 64, classNames: 'w-16 h-16' },
    md: { px: 96, classNames: 'w-24 h-24' },
    lg: { px: 160, classNames: 'w-36 h-36 sm:w-44 sm:h-44' },
    xl: { px: 220, classNames: 'w-48 h-48 sm:w-56 sm:h-56' }
  };
  const currentSize = sizeMap[size];

  // Persona metadata
  const personaMeta = PERSONA_REALISTIC_PORTRAITS[persona];
  const activeThemeMeta = useMemo(() => {
    return THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];
  }, [currentTheme]);

  // Determine what to display
  const effectiveUserPhoto = customPhoto || localUserPhoto;
  const isDisplayingUserPhoto = currentStyle === 'photo' && Boolean(effectiveUserPhoto);
  const isDisplayingAnime = currentStyle === 'anime';
  const isDisplayingRealistic = currentStyle === 'realistic' || (!isDisplayingAnime && !isDisplayingUserPhoto);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none group ${className}`}>
      
      {/* Floating Synchronized Breathing HUD */}
      {isBreathingSync && (
        <div className="absolute -top-14 z-40 px-3.5 py-1.5 bg-teal-950/90 text-teal-100 backdrop-blur-md rounded-full shadow-lg border border-teal-500/40 text-xs font-bold flex items-center gap-2 animate-pulse">
          <Wind className="w-3.5 h-3.5 text-teal-400 animate-spin" />
          <span>
            {breathPhase === 'inhale' ? 'شهيق عميق... (امتلئ بالسكينة)' : breathPhase === 'hold' ? 'حبس هادئ... (استشعر الاتزان)' : 'زفير لطيف... (أخرج كل توتر)'}
          </span>
          <span className="w-5 h-5 rounded-full bg-teal-800 text-teal-200 flex items-center justify-center text-[10px]">
            {breathCount}
          </span>
        </div>
      )}

      {/* Floating Reassurance Whisper Bubble */}
      {activeWhisper && !isBreathingSync && (
        <div className="absolute -top-20 z-40 max-w-[260px] sm:max-w-[320px] px-3.5 py-2.5 bg-white/95 dark:bg-[#1A2520]/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-500/40 text-right animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-1">
              <span>✨</span>
              <span>{personaMeta.badge} - همسة طمأنينة</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyWhisper();
                }}
                className="p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-stone-800 text-stone-500 hover:text-emerald-600 transition-colors cursor-pointer"
                title="نسخ الهمسة"
              >
                {hasCopiedWhisper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveWhisperToJournal();
                }}
                className="p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-stone-800 text-stone-500 hover:text-emerald-600 transition-colors cursor-pointer"
                title="حفظ في مفكرة أفكاري"
              >
                {hasSavedWhisper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookOpen className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <p className="text-xs font-semibold text-[#253D32] dark:text-[#E8F1EC] leading-snug">
            {activeWhisper}
          </p>
          {(hasCopiedWhisper || hasSavedWhisper) && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              {hasCopiedWhisper ? 'تم نسخ الهمسة إلى الحافظة ✨' : 'تم حفظ الهمسة في مفكرة أفكارك 📖'}
            </p>
          )}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#1A2520] border-r border-b border-emerald-500/40 rotate-45" />
        </div>
      )}

      {/* Floating Hearts / Sparkles Burst on Touch */}
      {showHeartsBurst && (
        <div className="absolute -top-6 inset-x-0 flex items-center justify-center gap-3 pointer-events-none z-30 animate-bounce">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-ping" />
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-md" />
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
        </div>
      )}

      {/* Floating Sparkles for Encouraging / Speaking */}
      {isAnimatedMode && (expression === 'encouraging' || isSpeaking) && !showHeartsBurst && (
        <div className="absolute -top-2.5 -right-1 text-amber-300 animate-bounce pointer-events-none z-20">
          <Sparkles className="w-4 h-4 drop-shadow-md text-amber-400" />
        </div>
      )}

      {/* Main Avatar Canvas / Frame */}
      <div 
        onClick={handleAvatarTouch}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAvatarTouch();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`شخصية ${
          isDisplayingUserPhoto ? 'صورتي الشخصية' :
          isDisplayingAnime ? `أنمي ${personaMeta.badge}` :
          `واقعي ${personaMeta.badge}`
        } - اضغط أو انقر للحصول على لمسة طمأنينة`}
        title="انقر هنا أو اضغط Enter للمسة طمأنينة وتفاعل مع الشخصية ✨"
        className={`relative ${currentSize.classNames} rounded-full overflow-hidden transition-all duration-700 ease-out bg-stone-100 dark:bg-stone-900 ring-4 ${
          isBreathingSync 
            ? breathPhase === 'inhale' 
              ? 'ring-8 ring-teal-400 scale-105 shadow-xl shadow-teal-500/30' 
              : breathPhase === 'hold'
              ? 'ring-6 ring-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
              : 'ring-4 ring-teal-300 scale-95 shadow-xs'
            : personaMeta.ringColor
        } shadow-md cursor-pointer hover:scale-[1.03] active:scale-[0.98] focus:outline-hidden focus:ring-4 focus:ring-emerald-500/60`}
      >
        {/* Render Mode A: Anime Character Rig (Vector SVG) */}
        {isDisplayingAnime && (
          <CompanionAnimeRig
            persona={persona}
            expression={expression}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isAnimatedMode={isAnimatedMode}
            breathTick={breathTick}
            isBlinking={isBlinking}
            isWinking={isWinking}
            visemeIndex={visemeIndex}
            accessory={currentAccessory}
            theme={currentTheme}
          />
        )}

        {/* Render Mode B: Realistic Human Photographic Portrait */}
        {isDisplayingRealistic && (
          <img
            src={personaMeta.src}
            alt={personaMeta.alt}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isAnimatedMode && isSpeaking ? 'scale-105' : 'scale-100'
            }`}
            loading="eager"
          />
        )}

        {/* Render Mode C: My Personal Photo */}
        {isDisplayingUserPhoto && (
          <img
            src={effectiveUserPhoto!}
            alt="صورتك الشخصية النشطة"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isAnimatedMode && isSpeaking ? 'scale-105' : 'scale-100'
            }`}
            loading="eager"
          />
        )}

        {/* If Photo mode selected but no photo exists yet */}
        {currentStyle === 'photo' && !effectiveUserPhoto && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setShowPhotoModal(true);
            }}
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
          >
            <Camera className="w-6 h-6 mb-1 text-emerald-600" />
            <span className="text-[10px] font-bold">ارفع صورتك</span>
          </div>
        )}

        {/* Ambient Aesthetic Gradient Glow Layer */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${activeThemeMeta.gradient} opacity-35 mix-blend-overlay pointer-events-none`} />

        {/* Floating Atmospheric Particles */}
        {isAnimatedMode && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {currentTheme === 'sakura' && (
              <div className="absolute top-2 left-2 text-rose-300/80 text-[10px] animate-pulse">🌸</div>
            )}
            {currentTheme === 'ghibli' && (
              <div className="absolute top-2 right-2 text-emerald-400/80 text-[10px] animate-bounce">🍃</div>
            )}
            {currentTheme === 'starlight' && (
              <div className="absolute top-2 left-3 text-amber-300/90 text-[10px] animate-pulse">✨</div>
            )}
            {currentTheme === 'ocean' && (
              <div className="absolute bottom-2 right-2 text-cyan-300/80 text-[10px] animate-pulse">🫧</div>
            )}
          </div>
        )}

        {/* Listening Pulsing Audio Rings */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-75 pointer-events-none" />
        )}

        {/* Speaking Soft Aura Glow */}
        {isSpeaking && isAnimatedMode && (
          <div className="absolute inset-0 bg-emerald-500/15 pointer-events-none transition-opacity" />
        )}
      </div>

      {/* Living State Badge (Only shown on md, lg, xl sizes) */}
      {(size === 'md' || size === 'lg' || size === 'xl') && (
        <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#1A231F]/95 border border-[#E6E8D8] dark:border-stone-700 shadow-xs text-xs font-bold text-[#26332D] dark:text-[#E6E8D8] backdrop-blur-xs transition-all">
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300">يستمع لصوتك باهتمام...</span>
            </>
          ) : isSpeaking ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#174C3C] animate-pulse" />
              <Volume2 className="w-3.5 h-3.5 text-[#174C3C] dark:text-emerald-400" />
              <span className="text-[#174C3C] dark:text-emerald-300">يتحدث معك الآن...</span>
            </>
          ) : expression === 'thinking' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="text-amber-700 dark:text-amber-400">يتأمل ويفكر معك...</span>
            </>
          ) : expression === 'empathy' ? (
            <>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span className="text-rose-700 dark:text-rose-300">يشعر بك ويحتضن مشاعرك</span>
            </>
          ) : expression === 'encouraging' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[#174C3C] dark:text-emerald-300">يشجعك ويساند خطواتك</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[#52645B] dark:text-stone-300">
                {isDisplayingUserPhoto ? 'مرآتك الشخصية نشطة 🪞' : isDisplayingAnime ? 'شخصية الأنمي نشطة 🎨' : 'شخصية بشرية واقعية 🌿'}
              </span>
            </>
          )}
        </div>
      )}

      {/* Bottom Controls Bar */}
      {(size === 'lg' || size === 'xl') && (
        <div className="mt-2.5 flex items-center flex-wrap justify-center gap-1.5 text-[11px] text-[#52645B] dark:text-stone-400">
          
          {/* 3-Way Style Quick Segmented Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-inner">
            <button
              onClick={() => handleSelectStyle('anime')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currentStyle === 'anime'
                  ? 'bg-white dark:bg-stone-900 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="عرض شخصية الأنمي الكرتونية"
            >
              <span>🎨 أنمي</span>
            </button>

            <button
              onClick={() => handleSelectStyle('realistic')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currentStyle === 'realistic'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="عرض الصور البشرية الواقعية"
            >
              <span>👤 واقعي</span>
            </button>

            <button
              onClick={() => {
                if (!effectiveUserPhoto) {
                  setShowPhotoModal(true);
                } else {
                  handleSelectStyle('photo');
                }
              }}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currentStyle === 'photo'
                  ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="عرض صورتي الشخصية"
            >
              <span>🪞 صورتي</span>
            </button>
          </div>

          {/* Persona Switcher */}
          {onTogglePersona && (
            <button
              onClick={onTogglePersona}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F3E9] dark:bg-stone-800 hover:bg-[#E6E8D8]/50 dark:hover:bg-stone-700 border border-[#E6E8D8] dark:border-stone-700 transition-colors cursor-pointer font-medium"
              title="تبديل الجانب النفسي (الراشد / الطفل / الأب)"
            >
              <RefreshCw className="w-3 h-3 text-[#174C3C] dark:text-emerald-400" />
              <span>{personaMeta.badge}</span>
            </button>
          )}

          {/* Quick Reassurance Tap Button */}
          <button
            onClick={handleAvatarTouch}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50 transition-colors cursor-pointer font-medium"
            title="الحصول على كلمة تطمين فورية ورنين السكينة"
          >
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500/30" />
            <span>لمسة طمأنينة</span>
          </button>

          {/* Synchronized Breathing Mode Toggle */}
          <button
            onClick={handleToggleBreathingSync}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
              isBreathingSync 
                ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-500/25 animate-pulse' 
                : 'bg-[#F7F3E9] dark:bg-stone-800 text-teal-800 dark:text-teal-300 border-[#E6E8D8] dark:border-stone-700 hover:bg-teal-50 dark:hover:bg-stone-700'
            }`}
            title="جلسة تنفس واسترخاء متزامن مع رفيقي"
          >
            <Wind className={`w-3 h-3 ${isBreathingSync ? 'animate-spin' : ''}`} />
            <span>{isBreathingSync ? 'إيقاف التنفس' : 'تنفس مع رفيقي'}</span>
          </button>

          {/* Animation Toggle */}
          {allowAnimationToggle && (
            <button
              onClick={handleToggleAnimated}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                isAnimatedMode 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' 
                  : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
              }`}
            >
              {isAnimatedMode ? <Eye className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
              <span>{isAnimatedMode ? 'حركة حية' : 'ثابت'}</span>
            </button>
          )}

          {/* Atmosphere Theme Selector Toggle */}
          {allowCustomization && (
            <button
              onClick={() => setShowThemeModal(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border bg-[#F7F3E9] dark:bg-stone-800 hover:bg-amber-50 text-stone-700 dark:text-stone-300 border-[#E6E8D8] dark:border-stone-700 transition-colors cursor-pointer"
              title="تخصيص هالة الأجواء والزينة"
            >
              <Palette className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>الهالة والزينة</span>
            </button>
          )}

          {/* Reassurance Chime Sound Toggle */}
          <button
            onClick={handleToggleChimeMute}
            className={`p-1 rounded-lg border transition-colors cursor-pointer ${
              !isChimeMuted 
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
            }`}
            title={!isChimeMuted ? 'رنين السكينة مفعّل (انقر للكتم)' : 'رنين السكينة صامت (انقر للتشغيل)'}
          >
            {!isChimeMuted ? <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {/* Manage Personal Photo Button */}
          <button
            onClick={() => {
              setUploadFeedback(null);
              setShowPhotoModal(true);
            }}
            className="p-1 rounded-lg border bg-[#F7F3E9] dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-50 border-[#E6E8D8] dark:border-stone-700 transition-colors cursor-pointer"
            title="إدارة صورتي الشخصية"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>
      )}

      {/* Modal 1: Personal Photo Manager */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C2621] rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-right space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    إدارة «صورتي الشخصية»
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    مرآتك الرقمية للتأمل والتواصل مع ذاتك
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPhotoModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Guarantee Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>خصوصيتك محمية 100%</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                صورتك الشخصية تُعالج وتُحفظ محلياً فقط في ذاكرة متصفح جهازك. لن يتم رفعها أو مشاركتها مع أي خادم خارجي دون إذنك.
              </p>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-emerald-500/40 shadow-lg bg-stone-100 dark:bg-stone-800">
                {localUserPhoto ? (
                  <img
                    src={localUserPhoto}
                    alt="معاينة صورتك الشخصية"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <User className="w-10 h-10 mb-1" />
                    <span className="text-[10px]">لا توجد صورة بعد</span>
                  </div>
                )}
              </div>
              <span className="mt-2 text-xs font-bold text-stone-700 dark:text-stone-300">
                {localUserPhoto 
                  ? (currentStyle === 'photo' ? 'صورتك الشخصية نشطة حالياً 🪞' : 'صورتك محفوظة ومتاحة للاختيار')
                  : 'يمكنك رفع صورتك الآن لمرآة التأمل'}
              </span>
            </div>

            {/* Feedback message */}
            {uploadFeedback && (
              <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs text-center">
                {uploadFeedback}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#174C3C] hover:bg-[#2A493B] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{localUserPhoto ? 'تغيير الصورة الشخصية' : 'رفع صورة من جهازي'}</span>
              </button>

              {localUserPhoto && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectStyle('photo');
                      setShowPhotoModal(false);
                    }}
                    className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تفعيل صورتي الآن</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteUserPhoto}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف صورتي</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs text-stone-700 dark:text-stone-300 transition-colors font-medium"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Aura Themes & Anime Accessories */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#1C2621] rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-700 text-right space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="font-bold text-xs text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>هالة الأجواء والزينة النفسية</span>
              </span>
              <button 
                onClick={() => setShowThemeModal(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Themes Grid */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                1. هالة الأجواء المحيطة:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {THEME_OPTIONS.map(themeItem => {
                  const isSelected = currentTheme === themeItem.id;
                  return (
                    <button
                      key={themeItem.id}
                      onClick={() => handleSelectTheme(themeItem.id)}
                      className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col gap-1 text-[11px] cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base">{themeItem.icon}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="font-bold">{themeItem.label}</span>
                      <span className="text-[9px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {themeItem.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessories Grid (for Anime mode) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                2. الزينة النفسية لشخصية الأنمي:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {ACCESSORY_OPTIONS.map(accItem => {
                  const isSelected = currentAccessory === accItem.id;
                  return (
                    <button
                      key={accItem.id}
                      onClick={() => handleSelectAccessory(accItem.id)}
                      className={`p-1.5 rounded-xl border text-center transition-all text-[10px] cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 font-bold shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-sm mb-0.5">{accItem.icon}</div>
                      <div className="truncate">{accItem.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer with Reset */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>استعادة الافتراضي</span>
              </button>
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-3.5 py-1 rounded-xl bg-emerald-600 text-white font-bold"
              >
                تم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
