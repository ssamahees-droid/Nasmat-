// Data and content for «تطبيق فكّر» (Feker / Fakkir App)
// Unified mental health & CBT cognitive reframing system

export interface CognitiveDistortion {
  id: string;
  name: string;
  arabicName: string;
  icon: string;
  shortDesc: string;
  example: string;
  antidote: string;
  socraticQuestions: string[];
}

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    id: 'catastrophizing',
    name: 'Catastrophizing',
    arabicName: 'التفكير الكارثي (توقع الأسوأ دائماً)',
    icon: '⚡',
    shortDesc: 'تضخيم العواقب وتخيل أن أسوأ سيناريو ممكن هو الحتمي والوشيك.',
    example: '«لو تلعثمت في العرض التقديمي، مستقبلي المهني سينتهي تماماً!»',
    antidote: 'ذكّر نفسك: حتى لو حدث خطأ، فالأمر مزعج لكنه ليس نهاية العالم، ويمكن تداركه.',
    socraticQuestions: [
      'ما هي النتيجة الأكثر ترجيحاً ومنطقية للموقف؟',
      'لو حدث أسوأ سيناريو بالفعل، هل لديك مهارات للتعامل معه وتجاوزه؟',
      'كم مرة في الماضي توقعت كارثة ولم تحدث؟'
    ]
  },
  {
    id: 'mind_reading',
    name: 'Mind Reading',
    arabicName: 'قراءة الأفكار (افتراض نوايا الآخرين)',
    icon: '🔮',
    shortDesc: 'الجزم بأنك تعرف ما يفكر فيه الآخرون عنك وعادة ما تفترض أنهم يحكمون عليك بسلبية.',
    example: '«هو لم يبتسم لي اليوم، أكيد أنه يكرهني أو يتحدث عني بسوء.»',
    antidote: 'أنت لست قارئاً للأفكار. هناك ألف سبب لتصرف الشخص الآخر لا علاقة له بك إطلاقاً.',
    socraticQuestions: [
      'هل سألت الشخص مباشرة عما يشعر به؟',
      'ما هي الأسباب الأخرى التي قد تجعله يتصرف هكذا (انشغال، تعب، ضغط شخصي)؟',
      'هل تملك دليلاً قاطعاً أم أنه مجرد حدس وتخمين؟'
    ]
  },
  {
    id: 'all_or_nothing',
    name: 'All-or-Nothing Thinking',
    arabicName: 'أبيض أو أسود (الكل أو لا شيء)',
    icon: '⚖️',
    shortDesc: 'رؤية الأمور في قطبين متطرفين: نجاح تام أو فشل ذريع، دون أي مساحات وسطى.',
    example: '«إذا لم أحصل على الدرجة الكاملة، فأنا فاشل تماماً ولا أصلح لشيء.»',
    antidote: 'الحياة ليست أبيض وأسود، بل درجات رمادية غنية. التقدم غير الكامل يظل تقدماً حقيقياً.',
    socraticQuestions: [
      'هل النقص في جانب معين يلغي كل الإنجازات والجهد المبذول؟',
      'كيف تبدو المنطقة الرمادية الوسطى في هذا الموقف؟',
      'هل تحكم على الآخرين بنفس هذا المعيار المتشدد؟'
    ]
  },
  {
    id: 'emotional_reasoning',
    name: 'Emotional Reasoning',
    arabicName: 'الاستدلال العاطفي (شعوري = الحقيقة)',
    icon: '🌧️',
    shortDesc: 'الاعتقاد بأن الشعور الداخلي يثبت الواقع (أنا أشعر بالخوف، إذن هناك خطر حقيقي).',
    example: '«أشعر أنني غير كفء في وظيفتي، إذن أنا بالفعل غير كفء ولا أستحقها.»',
    antidote: 'المشاعر إشارات داخلية تخبرنا عن حالتنا، وليست حقائق علمية عن العالم الخارجي.',
    socraticQuestions: [
      'هل شعورك ناتج عن التعب أو الضغط الحالي وليس عن حقائق الواقع؟',
      'ما هي الحقائق الموضوعية التي تناقض هذا الشعور؟',
      'هل المشاعر تدوم أم تتغير مع الوقت؟'
    ]
  },
  {
    id: 'should_statements',
    name: 'Should Statements',
    arabicName: 'أحكام الإلزام (لازم والمفروض)',
    icon: '📋',
    shortDesc: 'إلزام النفس والآخرين بقواعد صارمة ومثالية تسبب الإحباط والذنب المستمر.',
    example: '«كان لازم أكون أقوى من كده ومحسش بالضعف أبداً.»',
    antidote: 'استبدل كلمة "لازم" بـ "أفضل لو.. لكن لا بأس إن لم يحدث"، وتقبل بشريتك.',
    socraticQuestions: [
      'من الذي وضع هذه القاعدة الصارمة؟',
      'هل توقعك هذا واقعي في ظل ظروفك وطاقتك الحالية؟',
      'ماذا يحدث لو استبدلت "لازم" بـ "أتمنى أو أحاول"؟'
    ]
  },
  {
    id: 'mental_filter',
    name: 'Mental Filter',
    arabicName: 'التصفية السلبية (التركيز على النقطة السوداء)',
    icon: '🔍',
    shortDesc: 'تجاهل كل الإيجابيات والتركيز الحصري على هفوة أو خطأ واحد وتضخيمه.',
    example: '«حصلت على 9 إشادات وملاحظة نقدية واحدة، إذن يومي وعملي سيئان.»',
    antidote: 'وسّع عدسة رؤيتك لتشمل الصورة الكاملة بما فيها من إيجابيات وجهد مستمر.',
    socraticQuestions: [
      'ما هي الإيجابيات التي تتجاهلها الآن لصالح هذه النقطة السلبية؟',
      'لو رسمت دائرة تمثل كل ما حدث اليوم، ما حجم هذا الموقف بداخلها؟',
      'ما الذي نجحت في تحقيقه اليوم رغم هذه الصعوبة؟'
    ]
  }
];

export interface ReframingScenario {
  id: string;
  category: 'work' | 'relationships' | 'self' | 'future';
  categoryLabel: string;
  trigger: string;
  automaticThought: string;
  distortionId: string;
  rationalAlternative: string;
  actionableStep: string;
}

export const REFRAMING_SCENARIOS: ReframingScenario[] = [
  {
    id: 'ref-1',
    category: 'work',
    categoryLabel: 'العمل والدراسة',
    trigger: 'مديرك لم يرد على رسالتك أو تقريرك منذ الأمس.',
    automaticThought: '«أكيد التقرير لم يعجبه، وربما يفكر في استبدالي أو تهميشي.»',
    distortionId: 'mind_reading',
    rationalAlternative: 'المدير لديه جدول مزدحم وعشرات الرسائل. عدم رده الفوري يعكس انشغاله هو ولا يعني بالضرورة تقييماً سلبياً لعملي.',
    actionableStep: 'انتظر حتى الغد بهدوء، ثم أرسل تذكيراً مهذباً وموجزاً.'
  },
  {
    id: 'ref-2',
    category: 'relationships',
    categoryLabel: 'العلاقات والأصدقاء',
    trigger: 'صديقك اعتذر عن لقاء كنتما قد اتفقتما عليه.',
    automaticThought: '«هو يتهرب مني ولا يهتم بصداقتنا كما أهتم أنا به.»',
    distortionId: 'mind_reading',
    rationalAlternative: 'الاعتذار أمر طبيعي في الحياة عندما تطرأ ظروف طارئة أو نفاد طاقة. هذا لا ينفي محبته أو قيمة الصداقة.',
    actionableStep: 'أرسل له: «أتمنى تكون بخير، نتقابل في وقت يناسبك 🌿» وأعطِ له مساحته.'
  },
  {
    id: 'ref-3',
    category: 'self',
    categoryLabel: 'النظرة للذات',
    trigger: 'ارتكبت خطأ أثناء حديثك في جلسة جماعية.',
    automaticThought: '«أنا أحمق وسأظل دائماً محرجاً أمام الناس، ولن أشارك مجدداً.»',
    distortionId: 'all_or_nothing',
    rationalAlternative: 'جميع البشر يخطئون ويزلون في الكلام. الناس في العادة ينسون الزلة بعد دقائق وينشغلون بأنفسهم.',
    actionableStep: 'ابتسم واعتبرها لحظة بشرية عادية، ولا تدعها تمنعك من التعبير عن رأيك.'
  },
  {
    id: 'ref-4',
    category: 'future',
    categoryLabel: 'القلق من المستقبل',
    trigger: 'أخبار اقتصادية أو تحديات مهنية مقبلة.',
    automaticThought: '«كل شيء سيتدهور ولن أستطيع الصمود أو حماية نفسي.»',
    distortionId: 'catastrophizing',
    rationalAlternative: 'المستقبل مجهول ويحتوي تحديات وفرصاً معاً. كما نجحت في تجاوز عقبات سابقة، أمتلك المرونة للتعامل مع ما يأتي يوماً بيوم.',
    actionableStep: 'ركز على ما تملكه اليوم: تحسين مهاراتك، إدارة نفقاتك، والاهتمام بصحتك النفسية.'
  }
];

export interface FactOrStoryQuestion {
  id: string;
  statement: string;
  isFact: boolean;
  explanation: string;
  tip: string;
}

export const FACT_OR_STORY_QUESTIONS: FactOrStoryQuestion[] = [
  {
    id: 'q1',
    statement: '«زميلي في العمل لم يلقِ عليّ التحية هذا الصباح.»',
    isFact: true,
    explanation: 'هذه حقيقة واقعية ملموسة تم رصدها بحواسك (حدث يمكن تصويره بكاميرا).',
    tip: 'الحقيقة هي ما حدث فعلاً، دون إضافة أي تفسير لنوايا الشخص.'
  },
  {
    id: 'q2',
    statement: '«زميلي لم يلقِ التحية لأنه يكرهني ويريد إحراجي.»',
    isFact: false,
    explanation: 'هذه حكاية وقصة من نسج العقل! قد يكون منشغلاً أو متوتراً أو لم ينتبه.',
    tip: 'لاحظ دائماً: هل تملك دليلاً موضوعياً، أم أن عقلك ملأ الفراغ بسيناريو سلبي؟'
  },
  {
    id: 'q3',
    statement: '«دقات قلبي متسارعة وأشعر بضيق خفيف في صدري.»',
    isFact: true,
    explanation: 'حقيقة بيولوجية وجسدية ترصدها بدقة.',
    tip: 'الاعتراف بالإحساس الجسدي هو الخطوة الأولى لتنظيم التنفس والتهدئة.'
  },
  {
    id: 'q4',
    statement: '«دقات قلبي متسارعة، إذن أنا على وشك أن أصاب بنوبة قلبية أو جنون.»',
    isFact: false,
    explanation: 'هذه قصة كارثية! تسارع النبض رد فعل طبيعي للأدرينالين والقلق ويزول بالتهدئة.',
    tip: 'فرّق بين الإحساس (النبض السريع) وبين الكارثة التي يؤلفها عقلك حوله.'
  },
  {
    id: 'q5',
    statement: '«حصلت على تقييم 3 من 5 في بند واحد من التقييم السنوي.»',
    isFact: true,
    explanation: 'رقم وواقع ملموس مسجل في وثيقة رسمية.',
    tip: 'الأرقام والحقائق تقبل التحسين والمناقشة بهدوء.'
  },
  {
    id: 'q6',
    statement: '«أنا غير كفء ولن أنجح في هذه الشركة أبداً.»',
    isFact: false,
    explanation: 'هذه حكاية وتشويه (التعميم المطلق). تقييم بند واحد لا يلغي كفاءتك العامة.',
    tip: 'حوّل الحكاية إلى سؤال عملي: ما المهارة المحددة التي يمكنني تطويرها في هذا البند؟'
  }
];

export interface SavedFekerEntry {
  id: string;
  timestamp: string;
  situation: string;
  automaticThought: string;
  distortionName: string;
  beliefBefore: number; // 0 to 100
  rationalAlternative: string;
  beliefAfter: number; // 0 to 100
  moodImprovementScore: number;
}
