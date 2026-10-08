// Data for the interactive psychological game «جوايا حكاية»

export interface GameChapter {
  id: string;
  label: string;
  title: string;
  intro: string;
  emoji: string;
}

export const GWAYA_CHAPTERS: GameChapter[] = [
  {
    id: 'relationships',
    label: 'العلاقات',
    title: 'فصل القرب والمسافة',
    intro: 'نكتشف ما بين الرسائل والحدود والرغبة في أن نكون مفهومين.',
    emoji: '💬'
  },
  {
    id: 'work',
    label: 'العمل',
    title: 'فصل الإنجاز والضغط',
    intro: 'نفرّق بين النتيجة وقيمتنا، ونستعيد خطوة ممكنة وسط الزحمة.',
    emoji: '💼'
  },
  {
    id: 'family',
    label: 'الأسرة',
    title: 'فصل البيت والأمان',
    intro: 'نسمع أثر الكلام القريب ونبني مساحة أهدى للحوار مع أنفسنا والآخرين.',
    emoji: '🏡'
  },
  {
    id: 'study',
    label: 'الدراسة والثقة',
    title: 'فصل التعلّم والشجاعة',
    intro: 'نحوّل الخوف من التقييم إلى خطوات صغيرة تذكّرنا أن التعلّم ليس حكمًا على قيمتنا.',
    emoji: '📚'
  }
];

export interface SituationPreset {
  key: string;
  chapter: string;
  label: string;
  text: string;
  emoji: string;
}

export const GWAYA_PRESETS: SituationPreset[] = [
  // Relationships
  { key: 'no-reply', chapter: 'relationships', label: 'رسالة بلا رد', text: 'بعت رسالة من بدري… ولسه مفيش رد.', emoji: '✉️' },
  { key: 'misunderstood', chapter: 'relationships', label: 'محدش فاهمني', text: 'حاولت أشرح اللي جوايا، بس حسيت إن محدش فاهمني.', emoji: '🗣️' },
  { key: 'rejection', chapter: 'relationships', label: 'اتعرضت لرفض', text: 'قدمت على حاجة مهمة واترفضت، وحسيت إن الباب اتقفل.', emoji: '🚪' },
  { key: 'boundary', chapter: 'relationships', label: 'قلت لأ', text: 'قلت لأ على طلب، وبعدها فضلت حاسس إني أناني ومقصّر.', emoji: '🛡️' },
  
  // Work
  { key: 'criticism', chapter: 'work', label: 'اتعرضت لنقد', text: 'اتعرضت لنقد قدام زمايلي وحسيت إني اتلخبطت.', emoji: '🎯' },
  { key: 'overload', chapter: 'work', label: 'المهام اتراكمت', text: 'المسؤوليات اتراكمت ومش عارف أبدأ منين.', emoji: '📑' },
  { key: 'task-failure', chapter: 'work', label: 'فشلت في مهمة', text: 'حاولت أخلص مهمة مهمة وماعرفتش أعملها زي ما كنت عايز.', emoji: '🌧️' },
  { key: 'comparison', chapter: 'work', label: 'قارنت نفسي', text: 'شفت حد بيتقدم بسرعة وبدأت أقارن نفسي بيه.', emoji: '⚖️' },
  
  // Family
  { key: 'family-talk', chapter: 'family', label: 'كلام في البيت', text: 'اتكلمت مع حد قريب مني وخرجت من الكلام حاسس إني مش مفهوم.', emoji: '👥' },
  { key: 'setback', chapter: 'family', label: 'حاجة ما مشيتش', text: 'حاولت في حاجة مهمة وما مشيتش زي ما كنت متخيل.', emoji: '🧭' },
  { key: 'decision', chapter: 'family', label: 'قرار محيّر', text: 'قدامي قرارين مهمين وكل ما أختار حاجة أخاف أندم.', emoji: '🤔' },
  { key: 'plan-change', chapter: 'family', label: 'الخطة اتغيرت', text: 'خطة كنت مستنيها اتلغت فجأة واضطريت أبدأ من جديد.', emoji: '🔄' },
  
  // Study
  { key: 'exam-anxiety', chapter: 'study', label: 'قبل الامتحان', text: 'عندي امتحان قريب وكل ما أفتح أذاكر أحس إني هنسا كل حاجة.', emoji: '📖' },
  { key: 'study-delay', chapter: 'study', label: 'مش عارف أبدأ', text: 'المذاكرة اتراكمت وبقيت ألوم نفسي بدل ما أبدأ بخطوة صغيرة.', emoji: '⏳' },
  { key: 'presentation', chapter: 'study', label: 'عرض قدام الناس', text: 'مطلوب أتكلم قدام المجموعة وخايف صوتي أو كلامي يبانوا ضعاف.', emoji: '🎤' },
  { key: 'grade-comparison', chapter: 'study', label: 'درجة ومقارنة', text: 'جبت درجة أقل من اللي توقعتها وبدأت أقارن نفسي بزمايلي.', emoji: '📊' }
];

export interface StageInfo {
  id: 'fact' | 'thought' | 'feeling' | 'body' | 'need' | 'reframe' | 'finish';
  label: string;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
}

export const GWAYA_STAGES: StageInfo[] = [
  {
    id: 'fact',
    label: 'الموقف',
    short: 'حصل إيه؟',
    eyebrow: 'المحطة ٠١ · نبدأ من الأرض',
    title: 'نمسك اللي حصل… من غير ما نزوده',
    description: 'في العالم اللي جواك، أول خيط دايمًا هو الحقيقة الصغيرة اللي نقدر نشوفها سوا دون سيناريوهات إضافية.'
  },
  {
    id: 'thought',
    label: 'الفكرة',
    short: 'قال إيه؟',
    eyebrow: 'المحطة ٠٢ · حديقة الأفكار',
    title: 'الأفكار بتظهر بسرعة… بس مش كلها حقائق',
    description: 'اختار فكرة واحدة لمستك. مش مطلوب تحكم عليها أو تلوم نفسك، بس نشوف نوعها بهدوء.'
  },
  {
    id: 'feeling',
    label: 'الشعور',
    short: 'حسيت بإيه؟',
    eyebrow: 'المحطة ٠٣ · نغمة الشعور',
    title: 'لو الشعور له لون وصوت، هيبقى إيه؟',
    description: 'الشعور مش مشكلة لازم تختفي فوراً؛ هو رسالة بتحاول تقول لك حاجة.'
  },
  {
    id: 'body',
    label: 'الجسم',
    short: 'بان فين؟',
    eyebrow: 'المحطة ٠٤ · إشارات الجسم',
    title: 'الجسم كان بيحكي إيه؟',
    description: 'قبل ما نسمي كل حاجة، نلاحظ: فين ظهرت الحكاية في جسمك وعضلاتك؟'
  },
  {
    id: 'need',
    label: 'الاحتياج',
    short: 'محتاج إيه؟',
    eyebrow: 'المحطة ٠٥ · ما وراء الشعور',
    title: 'وراء كل شعور… احتياج يستاهل يتسمع',
    description: 'اختار الفانوس الأقرب لك دلوقتي. الاحتياج مش دلع، هو بوصلة.'
  },
  {
    id: 'reframe',
    label: 'نظرة أوسع',
    short: 'ممكن أشوف؟',
    eyebrow: 'المحطة ٠٦ · نافذة جديدة',
    title: 'نفتح شباكًا صغيرًا لاحتمال تاني',
    description: 'مش لازم نكذّب إحساسنا؛ نجرب بس نوسّع الصورة سنة ونلاقي خطوة مقدورة.'
  },
  {
    id: 'finish',
    label: 'الختام',
    short: 'دفتر الرحلة',
    eyebrow: 'اكتملت الرحلة · خيط جديد في إيدك',
    title: 'أنت بدأت تسمع الحكاية من جوّا',
    description: 'مش لازم تخرج بإجابة نهائية. يكفي إنك بقيت قادر تلاحظ.'
  }
];

export interface ContextualPlan {
  bodyIntro: string;
  signals: { key: string; label: string }[];
  needs: { key: string; title: string; text: string }[];
  practice: { title: string; prompt: string; action: string; note: string };
  oldStory: string;
  newStory: string;
  reframeNote: string;
}

export function getContextualPlan(situation: string): ContextualPlan {
  const text = situation.trim().toLowerCase();

  // Study & Exams
  if (/امتحان|اختبار|مذاكرة|ذاكر|الدراسة|دراسة|جامعة|مدرسة|عرض|أتكلم قدام|درجة|زمايلي|زملائي|ثقة/.test(text)) {
    return {
      bodyIntro: 'قبل التقييم، الجسم قد يرفع صوته كأنه ينبهك؛ نسمعه من غير ما نعتبره نبوءة.',
      signals: [
        { key: 'chest', label: 'نفسي سريع قبل البداية' },
        { key: 'head', label: 'دماغي مليانة سيناريوهات' },
        { key: 'stomach', label: 'بطني بتتقل' }
      ],
      needs: [
        { key: 'space', title: 'خطوة صغيرة', text: 'أبدأ بجزء يمكن إنجازه الآن' },
        { key: 'safety', title: 'ثقة لطيفة', text: 'أسمح لنفسي أتعلم وأغلط' },
        { key: 'clarity', title: 'خطة واضحة', text: 'أعرف ماذا أراجع أو أتمرّن عليه' }
      ],
      practice: {
        title: 'جزّئيها الآن',
        prompt: 'اختاري أصغر خطوة دراسية يمكن تنفيذها خلال 10 دقائق.',
        action: 'أحدد أول 10 دقائق',
        note: 'افتحي الصفحة أو اكتبي سؤالًا واحدًا فقط، ثم ابدئي بدون انتظار المزاج المثالي.'
      },
      oldStory: '«لو ما طلعتش ممتاز… يبقى أنا مش شاطر.»',
      newStory: '«أنا بتعلم مهارة، وممكن أظهر بالتدريج حتى مع وجود رهبة.»',
      reframeNote: 'أقسّم المطلوب، أتدرّب على جزء واحد، وأقيس تقدمي بالمحاولة لا بالمقارنة.'
    };
  }

  // Rejection & Setbacks
  if (/رفض|اترفض|فشل|فشلت|ما مشيت|اتلغت|إلغاء|الغاء|الخطة|ابدأ من جديد|تغيرت|اتغيرت/.test(text)) {
    return {
      bodyIntro: 'لما الخطة تقع، الجسم يدور على أرض ثابتة قبل ما العقل يخطط من جديد.',
      signals: [
        { key: 'stomach', label: 'معدتي اتقبضت' },
        { key: 'shoulders', label: 'جسمي اتقل فجأة' },
        { key: 'chest', label: 'نفسي وقف لحظة' }
      ],
      needs: [
        { key: 'safety', title: 'أمان', text: 'أفتكر إن النتيجة لا تساوي قيمتي' },
        { key: 'space', title: 'مساحة', text: 'أحزن على الخطة قبل ما أبدأ غيرها' },
        { key: 'clarity', title: 'خطوة تالية', text: 'أعرف أول حركة صغيرة ممكنة' }
      ],
      practice: {
        title: 'خطة بديلة صغيرة',
        prompt: 'اكتبي خطوة واحدة ما زالت ممكنة رغم تغيّر الخطة.',
        action: 'أختار بديلًا واحدًا',
        note: 'لا نحتاج حل كل شيء اليوم؛ نحتاج حركة واحدة تعيد لك الإحساس بالقدرة.'
      },
      oldStory: '«الباب اتقفل… يبقى الحكاية خلصت.»',
      newStory: '«الخطة اتغيّرت، لكن خبرتي ولسه في خطوة أقدر أختارها.»',
      reframeNote: 'أسمّي الخسارة، أستعيد نفسي، ثم أختار بداية صغيرة قابلة للتجربة.'
    };
  }

  // Boundaries & Saying No
  if (/قلت لأ|قولت لأ|حدود|أناني|اناني|مقصّر|مقصر|طلب/.test(text)) {
    return {
      bodyIntro: 'الجسم يلاحظ لحظة حماية المساحة قبل ما يقتنع العقل إن كلمة لا مسموحة.',
      signals: [
        { key: 'chest', label: 'قلبي بيجري من الذنب' },
        { key: 'shoulders', label: 'كتافي شايلة رضا الكل' },
        { key: 'stomach', label: 'بطني بتشد' }
      ],
      needs: [
        { key: 'space', title: 'مساحة', text: 'وقت من غير تبرير مستمر' },
        { key: 'safety', title: 'أمان', text: 'أقول لا من غير ما أخسر نفسي' },
        { key: 'clarity', title: 'وضوح', text: 'أعرف إيه أقدر عليه فعلًا' }
      ],
      practice: {
        title: 'جملة حدود جاهزة',
        prompt: 'درّبي نفسك على جملة قصيرة تبدأ بـ: «أقدر أساعدك في… لكن لا أقدر…»',
        action: 'أبني جملة حدود',
        note: 'الحد الواضح لا يحتاج شرحًا طويلًا حتى يكون محترمًا.'
      },
      oldStory: '«لو قلت لأ… يبقى أنا أناني.»',
      newStory: '«حدودي بتخليني أكون حاضرًا بصدق، مش متاحًا طول الوقت.»',
      reframeNote: 'أقدر أرفض الطلب وأحافظ على العلاقة بكلام واضح ومساحة محترمة.'
    };
  }

  // Decisions & Hesitation
  if (/قرار|قرارين|أختار|اختار|أندم|ندم|محتار|حيرة/.test(text)) {
    return {
      bodyIntro: 'الحيرة تسكن أحيانًا في الرأس والكتفين؛ نلاحظها قبل أن نجبر أنفسنا على يقين كامل.',
      signals: [
        { key: 'head', label: 'دماغي مش بتسكت' },
        { key: 'shoulders', label: 'كتافي متحفّزة' },
        { key: 'stomach', label: 'بطني بتتقل' }
      ],
      needs: [
        { key: 'clarity', title: 'معلومة', text: 'أسأل عن شيء ناقص بدل التخمين' },
        { key: 'space', title: 'وقت', text: 'أسمح لنفسي بالتفكير بلا استعجال' },
        { key: 'safety', title: 'ثقة', text: 'أعرف أني أقدر أراجع قراري' }
      ],
      practice: {
        title: 'ورقة قرار سريعة',
        prompt: 'اكتبي ميزة واحدة ومخاطرة واحدة لكل اختيار، ثم حددي معلومة ناقصة.',
        action: 'أعمل مقارنة صغيرة',
        note: 'القرار يصبح أخف عندما يتحول من دوامة في الرأس إلى خيوط مكتوبة.'
      },
      oldStory: '«لازم أختار صح من أول مرة.»',
      newStory: '«أختار بأفضل ما أعرف الآن، وأترك لنفسي حق المراجعة.»',
      reframeNote: 'البداية بقرار تجريبي صغير أسهل من البحث عن خيار مثالي بلا مخاطرة.'
    };
  }

  // Default: Relationships & Unanswered message
  return {
    bodyIntro: 'الجسم بيلتقط الإشارة قبل الكلام أحيانًا.',
    signals: [
      { key: 'chest', label: 'نَفَسي قصير شوية' },
      { key: 'shoulders', label: 'كتافي مشدودة' },
      { key: 'stomach', label: 'معدتي متكتفة' }
    ],
    needs: [
      { key: 'clarity', title: 'وضوح', text: 'أحب أعرف إحنا واقفين فين' },
      { key: 'safety', title: 'أمان', text: 'أحتاج أفتكر إن قيمتي ثابتة' },
      { key: 'space', title: 'مساحة', text: 'أدي لنفسي وقت قبل ما أستنتج' }
    ],
    practice: {
      title: 'مسافة قبل الاستنتاج',
      prompt: 'قبل ما تكمّل القصة، اكتب تفسيرين محتملين لعدم الرد.',
      action: 'أكتب احتمالين',
      note: 'مثلًا: مشغول، أو لم يرَ الرسالة بعد. الاحتمال ليس حقيقة.'
    },
    oldStory: '«أكيد أنا مش مهم.»',
    newStory: '«أنا متضايق عشان الموقف مهم لي… ولسه في احتمالات كتير.»',
    reframeNote: 'أقدر أستنى، أسأل بوضوح، أو أرجع لنفسي دلوقتي.'
  };
}
