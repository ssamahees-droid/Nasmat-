import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & Nav
    'brand.title': 'نسمة حياة',
    'brand.subtitle': 'MOUBADARA_01',
    'nav.home': 'الرئيسية',
    'nav.start': 'ابدأ من هنا',
    'nav.selfDiscovery': 'افهم نفسك',
    'nav.games': 'خذ استراحة',
    'nav.explore': 'تعلّم وطبّق',
    'nav.practice': 'مارس المهارات',
    'nav.rescue': 'خطط المساندة',
    'nav.support': 'اطلب الدعم',
    'nav.feker': 'تطبيق فكر',
    'nav.profile': 'الملف الشخصي',
    'nav.admin': 'الإدارة',
    'nav.update': 'UPDATE_V2026',

    // Common buttons & actions
    'common.startNow': 'ابدأ الآن',
    'common.exploreMore': 'استكشف المزيد',
    'common.save': 'حفظ التعديلات',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.search': 'بحث في المحتوى...',
    'common.loading': 'جاري التحميل...',
    'common.success': 'تم بنجاح',
    'common.error': 'حدث خطأ',
    'common.share': 'مشاركة',
    'common.download': 'تحميل الدليل',
    'common.listen': 'استماع صوتي',
    'common.open': 'فتح',
    'common.start': 'ابدأ التمرين',

    // Home Screen
    'home.hero.badge': 'مبادرة وطنية متكاملة للصحة النفسية',
    'home.hero.title': 'مساحتك الآمنة للسلام الداخلي والدعم النفسي',
    'home.hero.desc': 'منصة رقمية تفاعلية مصممة خصيصاً لمساعدتك على فهم مشاعرك، تخفيف التوتر، وتطوير مرونتك النفسية مع أدوات احترافية وشخصية ذكية.',
    'home.welcome': 'أهلاً بك في نسمة حياة 🌿',
    'home.welcomeDesc': 'هنا مساحتك الهادئة للتعرف على مشاعرك، وتخفيف أثقال اليوم، واكتساب مهارات عملية تدعم سلامك الداخلي بكرامة ووضوح دون تعقيد أو أحكام مسبقة.',
    'home.startTour': 'جولة في المنصة (ابدأ من هنا)',
    'home.breatheMinute': 'دقيقة تنفس هادئة',
    'home.talkCompanion': 'تحدث مع رفيقي 🌿',
    'home.principles': 'مبادئ نسمة حياة الأساسية',
    'home.stats.users': 'مستفيد ومستفيدة',
    'home.stats.tools': 'أداة وتمرين نفسي',
    'home.stats.satisfaction': 'نسبة الرضا والارتياح',

    // Mood & Needs
    'home.mood.title': 'كيف تشعر في هذه اللحظة؟',
    'home.mood.subtitle': 'تسجيل مشاعرك خطوة أولى نحو تفريغ الحمل وفهم احتياجاتك اليومية',
    'home.mood.saved': 'تم حفظ تسجيل مشاعرك لليوم بنجاح',
    'home.mood.good': 'كويس وراضي',
    'home.mood.fair': 'مقبول / عادي',
    'home.mood.confused': 'مش عارف مالي',
    'home.mood.not_good': 'مش كويس ومضغوط',
    'home.mood.exhausted': 'طاقتي نفدت',
    'home.needs.title': 'أنا هنا لأنني...',
    'home.needs.subtitle': 'مسارات موجهة خصيصاً لمساعدتك حسب ما تشعر به الآن',

    // Pillars & Modules
    'home.weeklySession.title': 'الجلسة النفسية الأسبوعية',
    'home.weeklySession.subtitle': 'رحلة خطوة بخطوة للتعافي وإعادة التوازن النفسي',
    'home.weeklySession.btn': 'ابدأ جلسة هذا الأسبوع',
    'home.listenToYourself.title': 'اسمع نفسك — الحوار الداخلي',
    'home.listenToYourself.desc': 'تواصل مع الطفل الداخلي، الراشد المتزن، والأب الداخلي في مساحة آمنة ومستقلة',
    'home.listenToYourself.btn': 'ادخل مساحة اسمع نفسك',
    'home.feker.title': 'استوديو تفكيك الأفكار (فكّر)',
    'home.feker.desc': 'اكتشف التشوهات الإدراكية وأعد صياغة أفكارك علمياً وبمرونة',
    'home.feker.btn': 'افتح تطبيق فكّر',

    // Crisis & Safety
    'home.crisis.title': 'هل تمر بلحظة ضيق أو أزمة طارئة؟',
    'home.crisis.desc': 'لست وحدك؛ خطوط المساندة المجانية والسرية متوفرة على مدار الساعة',
    'home.crisis.btn': 'أرقام الطوارئ والدعم الفوري',

    // Companion / Refiqi
    'companion.title': 'رفيقي النفسي الذكي',
    'companion.subtitle': 'مساعدك الذكي للدعم النفسي والتنظيم العاطفي على مدار الساعة',
    'companion.askPlaceholder': 'اسأل رفيقي عما يشغل بالك...',
    'companion.send': 'إرسال',

    // Theme & Lang
    'theme.dark': 'الوضع الليلي',
    'theme.light': 'الوضع النهاري',
    'lang.switch': 'English',
    'lang.name': 'العربية'
  },
  en: {
    // Brand & Nav
    'brand.title': 'Nesmat Al-Hayat',
    'brand.subtitle': 'MOUBADARA_01',
    'nav.home': 'Home',
    'nav.start': 'Start Here',
    'nav.selfDiscovery': 'Self-Discovery',
    'nav.games': 'Take a Break',
    'nav.explore': 'Learn & Apply',
    'nav.practice': 'Practice Skills',
    'nav.rescue': 'Rescue Plans',
    'nav.support': 'Get Support',
    'nav.feker': 'Feker App',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.update': 'UPDATE_V2026',

    // Common buttons & actions
    'common.startNow': 'Start Now',
    'common.exploreMore': 'Explore More',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.search': 'Search content...',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'An error occurred',
    'common.share': 'Share',
    'common.download': 'Download Guide',
    'common.listen': 'Audio Listen',
    'common.open': 'Open',
    'common.start': 'Start Exercise',

    // Home Screen
    'home.hero.badge': 'Comprehensive National Mental Health Initiative',
    'home.hero.title': 'Your Safe Sanctuary for Inner Peace & Mental Support',
    'home.hero.desc': 'An interactive digital platform designed to help you understand your emotions, relieve stress, and develop psychological resilience with professional tools and smart guidance.',
    'home.welcome': 'Welcome to Nesmat Al-Hayat 🌿',
    'home.welcomeDesc': 'Your serene sanctuary to understand emotions, relieve daily strain, and cultivate practical habits for inner peace with dignity and clarity.',
    'home.startTour': 'Platform Tour (Start Here)',
    'home.breatheMinute': 'Calm Breathing Minute',
    'home.talkCompanion': 'Talk to Refiqi 🌿',
    'home.principles': 'Core Principles of Nesmat Al-Hayat',
    'home.stats.users': 'Beneficiaries',
    'home.stats.tools': 'Tools & Exercises',
    'home.stats.satisfaction': 'Satisfaction Rate',

    // Mood & Needs
    'home.mood.title': 'How are you feeling right now?',
    'home.mood.subtitle': 'Checking in with your feelings is the first step toward self-awareness and relief',
    'home.mood.saved': 'Your daily mood check-in has been saved successfully',
    'home.mood.good': 'Good & Content',
    'home.mood.fair': 'Okay / Normal',
    'home.mood.confused': 'Confused / Unsure',
    'home.mood.not_good': 'Stressed / Not Good',
    'home.mood.exhausted': 'Drained / Exhausted',
    'home.needs.title': 'I am here because...',
    'home.needs.subtitle': 'Curated pathways tailored to what you are experiencing right now',

    // Pillars & Modules
    'home.weeklySession.title': 'Weekly Psychological Session',
    'home.weeklySession.subtitle': 'A step-by-step journey toward healing and inner balance',
    'home.weeklySession.btn': 'Start This Week\'s Session',
    'home.listenToYourself.title': 'Listen to Yourself — Inner Dialogue',
    'home.listenToYourself.desc': 'Connect with the Inner Child, Balanced Adult, and Inner Father in a safe sanctuary',
    'home.listenToYourself.btn': 'Enter Inner Dialogue',
    'home.feker.title': 'Thought Deconstruction Studio (Feker)',
    'home.feker.desc': 'Identify cognitive distortions and reframe your thinking scientifically',
    'home.feker.btn': 'Open Feker App',

    // Crisis & Safety
    'home.crisis.title': 'Going through an acute crisis or distress?',
    'home.crisis.desc': 'You are not alone; free, confidential hotlines are available 24/7',
    'home.crisis.btn': 'Emergency Hotlines & Immediate Support',

    // Companion / Refiqi
    'companion.title': 'Smart Psychological Companion',
    'companion.subtitle': 'Your 24/7 AI companion for emotional support and regulation',
    'companion.askPlaceholder': 'Ask Refiqi what is on your mind...',
    'companion.send': 'Send',

    // Theme & Lang
    'theme.dark': 'Dark Mode',
    'theme.light': 'Light Mode',
    'lang.switch': 'العربية',
    'lang.name': 'English'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, def) => def || key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nesma_lang');
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'ar';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nesma_lang', language);
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (document.body) {
        document.body.dir = dir;
      }
      document.documentElement.classList.remove('dir-rtl', 'dir-ltr');
      document.documentElement.classList.add(`dir-${dir}`);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    const arDict = translations['ar'];
    if (arDict && arDict[key]) {
      return arDict[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
