export interface TenScreenItem {
  id: string;
  number: number;
  numberArabic: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  gradientBg: string;
  borderLight: string;
  borderDark: string;
  features: string[];
}

export const TEN_SCREENS: TenScreenItem[] = [
  {
    id: 'home',
    number: 1,
    numberArabic: '١',
    title: 'الرئيسية والواحة الترحيبية',
    shortTitle: 'الرئيسية',
    subtitle: 'واحة البداية الدافئة',
    tagline: 'مدخلك الهادئ والمبهج، تفقد المشاعر، وبواباتك السريعة لجميع أرجاء المنصة',
    emoji: '🏠',
    badge: 'واحة الترحيب 🌿',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    accentColor: '#10B981',
    gradientBg: 'from-emerald-500/15 via-teal-500/10 to-emerald-600/5',
    borderLight: 'border-emerald-200 hover:border-emerald-400',
    borderDark: 'dark:border-emerald-500/30 dark:hover:border-emerald-400',
    features: ['تحية يومية مبهجة', 'تسجيل المزاج بنقرة واحدة', 'مدخل سريع للشاشات العشر']
  },
  {
    id: 'start',
    number: 2,
    numberArabic: '٢',
    title: 'ابدأ من هنا وخريطتك الأولى',
    shortTitle: 'ابدأ هنا',
    subtitle: 'جولة التوجيه والتعريف',
    tagline: 'جولة توجيهية هادئة تعرّفك بالمنصة، ميثاق الأمان والسرية، والكتيب الإرشادي للسلام النفسي',
    emoji: '🧭',
    badge: 'خطوتك الأولى 🌱',
    badgeColor: 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30',
    accentColor: '#14B8A6',
    gradientBg: 'from-teal-500/15 via-cyan-500/10 to-emerald-600/5',
    borderLight: 'border-teal-200 hover:border-teal-400',
    borderDark: 'dark:border-teal-500/30 dark:hover:border-teal-400',
    features: ['خريطة نسمة حياة التفاعلية', 'ميثاق الخصوصية والسرية', 'كتيب الإرشاد النفسي الشامل']
  },
  {
    id: 'breathe',
    number: 3,
    numberArabic: '٣',
    title: 'واحة التنفس والسكينة',
    shortTitle: 'التنفس والسكينة',
    subtitle: 'جلسات تهدئة الجهاز العصبي',
    tagline: 'جلسات تنفس موجهة علمياً (4-7-8 والتنفس الصندوقي) وموجات صوتية مهدئة',
    emoji: '🌊',
    badge: 'تهدئة فورية 🍃',
    badgeColor: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30',
    accentColor: '#0EA5E9',
    gradientBg: 'from-sky-500/15 via-blue-500/10 to-teal-600/5',
    borderLight: 'border-sky-200 hover:border-sky-400',
    borderDark: 'dark:border-sky-500/30 dark:hover:border-sky-400',
    features: ['موجّه التنفس البصري الدائري', 'جلسة 4-7-8 لخفض التوتر', 'خلفيات صوتية استرخائية']
  },
  {
    id: 'self-discovery',
    number: 4,
    numberArabic: '٤',
    title: 'مرآة واستكشاف الذات',
    shortTitle: 'استكشاف الذات',
    subtitle: 'افهم أعماقك وأنماطك',
    tagline: 'اختبارات سيكولوجية عميقة، بوصلة المشاعر، مقياس بطارية الطاقة، وترجمة الأحاسيس',
    emoji: '🪞',
    badge: 'فهم الذات 🧠',
    badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
    accentColor: '#8B5CF6',
    gradientBg: 'from-purple-500/15 via-violet-500/10 to-indigo-600/5',
    borderLight: 'border-purple-200 hover:border-purple-400',
    borderDark: 'dark:border-purple-500/30 dark:hover:border-purple-400',
    features: ['اختبار الأنماط الـ 16 (MBTI)', 'بوصلة المشاعر الذكية', 'فاحص شحن البطارية النفسية']
  },
  {
    id: 'explore',
    number: 5,
    numberArabic: '٥',
    title: 'مكتبة المعرفة والتثقيف',
    shortTitle: 'مكتبة المعرفة',
    subtitle: 'أدلة ومقالات مراجعة علمياً',
    tagline: 'موسوعة غنية تضم أكثر من 30 دليلاً ومقالاً عملياً، وورش عمل، ومطبخ المزاج الغذائي',
    emoji: '📚',
    badge: '30+ دليلاً ميسراً 💡',
    badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
    accentColor: '#6366F1',
    gradientBg: 'from-indigo-500/15 via-blue-500/10 to-teal-600/5',
    borderLight: 'border-indigo-200 hover:border-indigo-400',
    borderDark: 'dark:border-indigo-500/30 dark:hover:border-indigo-400',
    features: ['أدلة الاضطرابات والعلاج المعرفي', 'مطبخ المزاج وصحة الأمعاء', 'ورش عمل تفاعلية تطبيقية']
  },
  {
    id: 'games',
    number: 6,
    numberArabic: '٦',
    title: 'بستان الترويح والألعاب',
    shortTitle: 'بستان الألعاب',
    subtitle: 'بهجة وتفريغ ومرح علاجي',
    tagline: 'ألعاب تفريغ الضغوط النفسية، فرقعة الأعباء، فك العقد المعرفية، النكات اللطيفة وتطبيق فكّر',
    emoji: '🎈',
    badge: 'مرح وتفريغ 🎡',
    badgeColor: 'bg-pink-500/15 text-pink-600 dark:text-pink-300 border-pink-500/30',
    accentColor: '#EC4899',
    gradientBg: 'from-pink-500/15 via-rose-500/10 to-amber-600/5',
    borderLight: 'border-pink-200 hover:border-pink-400',
    borderDark: 'dark:border-pink-500/30 dark:hover:border-pink-400',
    features: ['فرقعة الأعباء والفقاعات النفسية', 'تطبيق فكّر لتفكيك الأفكار', 'عجلة الحظ التوجيهية والنكات']
  },
  {
    id: 'practice',
    number: 7,
    numberArabic: '٧',
    title: 'استوديو التمارين واليقظة',
    shortTitle: 'استوديو التمارين',
    subtitle: 'ممارسات وتطبيقات عملية',
    tagline: 'مفكرة تفريغ الأفكار، استوديو أصوات الطبيعة واليقظة، ميزانية الطاقة، ورسم الحدود',
    emoji: '🧘',
    badge: 'يقظة وسلام 🕊️',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
    accentColor: '#F59E0B',
    gradientBg: 'from-amber-500/15 via-orange-500/10 to-yellow-600/5',
    borderLight: 'border-amber-200 hover:border-amber-400',
    borderDark: 'dark:border-amber-500/30 dark:hover:border-amber-400',
    features: ['دفتر الأفكار والمشاعر الواعية', 'صانع الحدود النفسية الصحية', 'ميزانية الطاقة والجهد اليومي']
  },
  {
    id: 'journey',
    number: 8,
    numberArabic: '٨',
    title: 'مسار التشافي وميزان الطاقة',
    shortTitle: 'مسار التشافي',
    subtitle: 'نمو مستمر وتتبع العادات',
    tagline: 'متابعة مسار تعافيك، روزنامة العادات الإيجابية، تقارير المزاج، وخطتك الشخصية المستمرة',
    emoji: '🌱',
    badge: 'نمو وتعافٍ 📈',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    accentColor: '#10B981',
    gradientBg: 'from-emerald-500/15 via-green-500/10 to-teal-600/5',
    borderLight: 'border-emerald-200 hover:border-emerald-400',
    borderDark: 'dark:border-emerald-500/30 dark:hover:border-emerald-400',
    features: ['سجل وتاريخ الفحوصات والمزاج', 'روزنامة جلسات الاسترخاء', 'خطة التعافي الشخصية']
  },
  {
    id: 'rescue',
    number: 9,
    numberArabic: '٩',
    title: 'حقيبة النجاة والطوارئ',
    shortTitle: 'حقيبة النجاة',
    subtitle: 'إسعاف فوري وأمان نفسي',
    tagline: 'بروتوكولات احتواء نوبات الهلع، خطط الأمان في اللحظات الحرجة، وأرقام الدعم العاجل المجانية',
    emoji: '🛡️',
    badge: 'أمان فوري 🛟',
    badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
    accentColor: '#F43F5E',
    gradientBg: 'from-rose-500/15 via-red-500/10 to-orange-600/5',
    borderLight: 'border-rose-200 hover:border-rose-400',
    borderDark: 'dark:border-rose-500/30 dark:hover:border-rose-400',
    features: ['إسعافات الطوارئ النفسية السريعة', 'خطوات التعامل مع نوبات الهلع', 'أرقام الاستغاثة والخط الساخن']
  },
  {
    id: 'support',
    number: 10,
    numberArabic: '١٠',
    title: 'واحة المساندة والدعم المجتمعي',
    shortTitle: 'الدعم والمساندة',
    subtitle: 'أنت لست وحدك في رحلتك',
    tagline: 'طلب مساندة سرية، دليل المتخصصين المعتمدين، ومساحة دافئة للاستماع والتوجيه الإنساني',
    emoji: '🤝',
    badge: 'مساندة واعية 💚',
    badgeColor: 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30',
    accentColor: '#0D9488',
    gradientBg: 'from-teal-500/15 via-emerald-500/10 to-cyan-600/5',
    borderLight: 'border-teal-200 hover:border-teal-400',
    borderDark: 'dark:border-teal-500/30 dark:hover:border-teal-400',
    features: ['طلب جلسة استماع وتوجيه سري', 'دليل الوصول للمتخصصين المؤهلين', 'مجموعات الدعم والإرشاد']
  }
];
