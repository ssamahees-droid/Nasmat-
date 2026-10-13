import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Eye, Volume2, Mic, Heart, RefreshCw, ZapOff, Shield, Smile, 
  Palette, Check, X, Camera, Upload, Trash2, Image as ImageIcon, Lock, User
} from 'lucide-react';
import { AnimeTheme, AnimeAccessory, CompanionPersona, CompanionExpression } from '../types/companion';

export type { CompanionExpression, CompanionPersona, AnimeTheme, AnimeAccessory };

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
}

// Realistic high-resolution human portrait photographs per persona
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
  }
};

// 21 Warm, authentic psychological reassurance whispers (7 per persona)
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

const LOCAL_STORAGE_THEME_KEY = 'nesmat_anime_avatar_theme';
const LOCAL_STORAGE_ACCESSORY_KEY = 'nesmat_anime_avatar_accessory';
export const LOCAL_STORAGE_USER_PHOTO_KEY = 'nesmat_custom_mirror_photo';
export const LOCAL_STORAGE_USE_USER_PHOTO_KEY = 'nesmat_avatar_use_user_photo';

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
  allowCustomization = true
}) => {
  // 1. Personal photo state stored locally (Privacy guaranteed)
  const [localUserPhoto, setLocalUserPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_USER_PHOTO_KEY) || null;
    } catch (_) {
      return null;
    }
  });

  const [useUserPhoto, setUseUserPhoto] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_USE_USER_PHOTO_KEY) === 'true';
    } catch (_) {
      return false;
    }
  });

  // Listen for storage events so changes in any component update immediately
  useEffect(() => {
    const handleSync = () => {
      try {
        const photo = localStorage.getItem(LOCAL_STORAGE_USER_PHOTO_KEY);
        const shouldUse = localStorage.getItem(LOCAL_STORAGE_USE_USER_PHOTO_KEY) === 'true';
        setLocalUserPhoto(photo || null);
        setUseUserPhoto(shouldUse);
      } catch (_) {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('nesmat_avatar_photo_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('nesmat_avatar_photo_changed', handleSync);
    };
  }, []);

  // Determine effective photo to render
  const effectivePhoto = customPhoto !== undefined
    ? customPhoto
    : (useUserPhoto && localUserPhoto ? localUserPhoto : null);

  // 2. Aura theme state with persistence
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

  // 3. Modals and Popovers
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 4. Interactive Reassurance Touch State
  const [activeWhisper, setActiveWhisper] = useState<string | null>(null);
  const [showHeartsBurst, setShowHeartsBurst] = useState<boolean>(false);
  const [isHeartbeating, setIsHeartbeating] = useState<boolean>(false);
  const whisperTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAvatarTouch = () => {
    // Pick reassurance quote from the 21 authentic quotes for active persona
    const quotes = REASSURANCE_WHISPERS[persona];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setActiveWhisper(quote);

    // Trigger sweet heart burst and soft heartbeat animation
    setShowHeartsBurst(true);
    setIsHeartbeating(true);

    if (whisperTimerRef.current) clearTimeout(whisperTimerRef.current);
    whisperTimerRef.current = setTimeout(() => {
      setActiveWhisper(null);
      setShowHeartsBurst(false);
      setIsHeartbeating(false);
    }, 4200);
  };

  // 5. Reduced Motion detection
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

  // 6. Handle Personal Photo Upload & Storage (Strictly local, no server upload)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadFeedback('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadFeedback('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // Compress slightly via canvas to ensure safe localStorage fit
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
            localStorage.setItem(LOCAL_STORAGE_USE_USER_PHOTO_KEY, 'true');
            setLocalUserPhoto(compressedDataUrl);
            setUseUserPhoto(true);
            setUploadFeedback('تم حفظ وتفعيل صورتك الشخصية محلياً بنجاح! 🌿');
            window.dispatchEvent(new Event('nesmat_avatar_photo_changed'));
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
      localStorage.setItem(LOCAL_STORAGE_USE_USER_PHOTO_KEY, 'false');
      setLocalUserPhoto(null);
      setUseUserPhoto(false);
      setUploadFeedback('تم حذف الصورة الشخصية واستعادة الصورة الواقعية للشخصية.');
      window.dispatchEvent(new Event('nesmat_avatar_photo_changed'));
    } catch (_) {}
  };

  const handleToggleUseUserPhoto = (active: boolean) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USE_USER_PHOTO_KEY, active ? 'true' : 'false');
      setUseUserPhoto(active);
      window.dispatchEvent(new Event('nesmat_avatar_photo_changed'));
    } catch (_) {}
  };

  // 7. Sizing Definitions (44px to 224px spectrum)
  const sizeMap = {
    xs: { px: 44, classNames: 'w-11 h-11' },
    sm: { px: 64, classNames: 'w-16 h-16' },
    md: { px: 96, classNames: 'w-24 h-24' },
    lg: { px: 160, classNames: 'w-36 h-36 sm:w-44 sm:h-44' },
    xl: { px: 220, classNames: 'w-48 h-48 sm:w-56 sm:h-56' }
  };
  const currentSize = sizeMap[size];

  // 8. Persona metadata & active theme
  const personaMeta = PERSONA_REALISTIC_PORTRAITS[persona];
  const activeThemeMeta = useMemo(() => {
    return THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];
  }, [currentTheme]);

  // Image source and description
  const activeImageSrc = effectivePhoto || personaMeta.src;
  const activeImageAlt = effectivePhoto ? 'صورتك الشخصية النشطة' : personaMeta.alt;
  const isCustomUserPhotoActive = Boolean(effectivePhoto);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none group ${className}`}>
      
      {/* Floating Reassurance Whisper Bubble */}
      {activeWhisper && (
        <div className="absolute -top-16 z-40 max-w-[240px] sm:max-w-[300px] px-3.5 py-2 bg-white/95 dark:bg-[#1A2520]/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-500/30 text-right animate-in fade-in zoom-in-95 duration-200">
          <p className="text-xs font-semibold text-[#253D32] dark:text-[#E8F1EC] leading-snug">
            {activeWhisper}
          </p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#1A2520] border-r border-b border-emerald-500/30 rotate-45" />
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

      {/* Main Avatar Character Canvas / Rig */}
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
        aria-label={`شخصية ${isCustomUserPhotoActive ? 'صورتي الشخصية' : personaMeta.badge} - اضغط أو انقر للحصول على لمسة طمأنينة`}
        title="انقر هنا أو اضغط Enter للمسة طمأنينة وتفاعل مع الشخصية ✨"
        className={`relative ${currentSize.classNames} rounded-full overflow-hidden transition-all duration-500 ease-out bg-stone-100 dark:bg-stone-900 ring-4 ${personaMeta.ringColor} shadow-md cursor-pointer hover:scale-[1.03] active:scale-[0.98] focus:outline-hidden focus:ring-4 focus:ring-emerald-500/60 ${
          isHeartbeating ? 'scale-105 ring-rose-400 shadow-rose-400/40' : ''
        }`}
      >
        {/* Real Human Photographic Portrait */}
        <img
          src={activeImageSrc}
          alt={activeImageAlt}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isAnimatedMode && isSpeaking ? 'scale-105' : 'scale-100'
          }`}
          loading="eager"
        />

        {/* Ambient Aesthetic Gradient Glow Layer */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${activeThemeMeta.gradient} opacity-40 mix-blend-overlay pointer-events-none`} />

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
        <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#1A231F]/95 border border-[#E8DDCC] dark:border-stone-700 shadow-xs text-xs font-bold text-[#26332D] dark:text-[#E8DDCC] backdrop-blur-xs transition-all">
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300">يستمع لصوتك باهتمام...</span>
            </>
          ) : isSpeaking ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-pulse" />
              <Volume2 className="w-3.5 h-3.5 text-[#355C4A] dark:text-emerald-400" />
              <span className="text-[#355C4A] dark:text-emerald-300">يتحدث معك الآن...</span>
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
              <span className="text-[#355C4A] dark:text-emerald-300">يشجعك ويساند خطواتك</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[#52645B] dark:text-stone-300">
                {isCustomUserPhotoActive ? 'مرآتك الشخصية نشطة' : 'حاضر معك في رحلتك'}
              </span>
            </>
          )}
        </div>
      )}

      {/* Bottom Controls Bar: Persona + Personal Photo + Reassurance + Themes */}
      {(size === 'lg' || size === 'xl') && (
        <div className="mt-2.5 flex items-center flex-wrap justify-center gap-1.5 text-[11px] text-[#52645B] dark:text-stone-400">
          
          {/* Persona Switcher */}
          {onTogglePersona && (
            <button
              onClick={onTogglePersona}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-stone-800 hover:bg-[#E8DDCC]/50 dark:hover:bg-stone-700 border border-[#E8DDCC] dark:border-stone-700 transition-colors cursor-pointer font-medium"
              title="تبديل الجانب النفسي (الراشد / الطفل / الأب)"
            >
              <RefreshCw className="w-3 h-3 text-[#355C4A] dark:text-emerald-400" />
              <span>{personaMeta.badge}</span>
            </button>
          )}

          {/* Quick Reassurance Tap Button */}
          <button
            onClick={handleAvatarTouch}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50 transition-colors cursor-pointer font-medium"
            title="الحصول على كلمة تطمين فورية"
          >
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500/30" />
            <span>لمسة طمأنينة</span>
          </button>

          {/* My Personal Photo Button */}
          <button
            onClick={() => {
              setUploadFeedback(null);
              setShowPhotoModal(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
              isCustomUserPhotoActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-[#FAF7F0] dark:bg-stone-800 hover:bg-emerald-50 text-stone-700 dark:text-stone-300 border-[#E8DDCC] dark:border-stone-700'
            }`}
            title="رفع أو إدارة صورتك الشخصية"
          >
            <Camera className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>صورتي الشخصية</span>
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
              onClick={() => setShowThemeModal(prev => !prev)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border bg-[#FAF7F0] dark:bg-stone-800 hover:bg-amber-50 text-stone-700 dark:text-stone-300 border-[#E8DDCC] dark:border-stone-700 transition-colors cursor-pointer"
              title="تخصيص هالة الأجواء النفسية"
            >
              <Palette className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>هالة الأجواء</span>
            </button>
          )}
        </div>
      )}

      {/* 9. Modal for "صورتي الشخصية" (Upload, Preview, Change, Delete, Privacy Notice) */}
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
                    صورتي الشخصية في «رفيقي»
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    استخدم صورتك كمرآة رقمية للتأمل الذاتي
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
                صورتك تُعالج وتُحفظ محلياً داخل متصفح جهازك فقط. لن يتم رفعها أو إرسالها إلى أي خادم خارجي على الإطلاق دون موافقتك الصريحة.
              </p>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-emerald-500/40 shadow-lg bg-stone-100 dark:bg-stone-800">
                <img
                  src={localUserPhoto || personaMeta.src}
                  alt="معاينة الصورة"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-2 text-xs font-bold text-stone-700 dark:text-stone-300">
                {localUserPhoto 
                  ? (useUserPhoto ? 'صورتك الشخصية نشطة حالياً 🪞' : 'صورتك محفوظة ولكن غير مفعلة')
                  : 'تُعرض حالياً الصورة الواقعية للشخصية'}
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
                className="w-full py-2.5 px-4 rounded-xl bg-[#355C4A] hover:bg-[#2A493B] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{localUserPhoto ? 'تغيير الصورة الشخصية' : 'رفع صورة من جهازي'}</span>
              </button>

              {localUserPhoto && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleUseUserPhoto(!useUserPhoto)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      useUserPhoto 
                        ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    <span>{useUserPhoto ? 'التبديل للشخصية الواقعية' : 'تفعيل صورتي الشخصية'}</span>
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

      {/* 10. Modal for Atmosphere Aura Theme */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#1C2621] rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-700 text-right space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="font-bold text-xs text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>هالة الأجواء النفسية</span>
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
                اختر طابع الهالة المحيطة:
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
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold"
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
