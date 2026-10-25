/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PsychoeducationBook, ValidatedAssessmentScale, PsychoeducationPath } from '../types';

// =========================================================================
// 1. VERIFIED BOOKS & OFFICIAL PSYCHOEDUCATION GUIDELINES (الكتب والمراجع)
// =========================================================================

export const PSYCHOEDUCATION_BOOKS: PsychoeducationBook[] = [
  // ==========================================
  // التصنيف الأول: العلاقات الصحية والتواصل (6 كتب)
  // ==========================================
  {
    id: 'book-hold-me-tight',
    title: 'تمسّك بي بقوة: سبعة محادثات لحياة حب يدوم مدى الحياة',
    originalTitle: 'Hold Me Tight: Seven Conversations for a Lifetime of Love',
    authors: ['د. سو جونسون (Sue Johnson, Ed.D.)'],
    category: 'relationships_comm',
    categoryLabel: 'العلاقات الصحية والتواصل',
    publicationYear: '2008',
    publisher: 'Little, Brown Spark / Hachette Book Group',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'مرجع معتمد في العلاج الأسري المرتكز على العاطفة (EFT)',
    directSourceUrl: 'https://drsuejohnson.com/books/hold-me-tight/',
    summaryArabic: 'مرجع أساسي صادر عن مؤسسة العلاج الأسري المرتكز على العاطفة (EFT). يشرح كيف ينشأ الصراع في العلاقات من الخوف الفطري من الانفصال والجفاء العاطفي، وكيف يبحث الإنسان بطبعه عن الأمان العاطفي مع الشريك. يطرح الكتاب 7 محادثات جوهرية لإعادة ترميم الروابط وتحويل الخلافات الهجومية إلى حوارات أمان دافئة.',
    keyTakeaways: [
      'الأمان العاطفي هو الحاجة البيولوجية الأساسية في العلاقات الشريكة.',
      'حلقة الدوران المفرغة (Demon Dialogues): التمييز بين النقد الهجومي والانسحاب الجليدي.',
      'محادثات الشفافية: التعبير الصريح عن الاحتياج العاطفي بوضوح دون اتهام الشريك.'
    ],
    whoIsThisFor: 'لشركاء الحياة والراغبين في فهم دوائر الصراع العاطفي وتعميق الأمان والتواصل في العلاقات.',
    criticalReadingNote: 'تنبيه تحريري: المبادئ المذكورة تقدم إطاراً توضيحياً لفهم أنماط التواصل العاطفي وليست تشخيصات مرضية أو بديلاً عن الاستشارات الأسرية المتخصصة.',
    relatedTopicIds: ['t3-topic1', 't3-topic2'],
    relatedToolActionIds: ['translate', 'knot'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تحليلي للمبادئ العلمية للدكتورة سو جونسون مع إحالة الرابط الرسمي للمؤلفة.',
    coverColor: 'bg-[#174F3F] text-white',
    icon: '🤝'
  },
  {
    id: 'book-set-boundaries',
    title: 'ضع حدوداً تجد السلام: دليل استعادة نفسك',
    originalTitle: 'Set Boundaries, Find Peace: A Guide to Reclaiming Yourself',
    authors: ['نيدرا غلوفر تواب (Nedra Glover Tawwab)'],
    category: 'relationships_comm',
    categoryLabel: 'العلاقات الصحية والتواصل',
    publicationYear: '2021',
    publisher: 'TarcherPerigee / Penguin Random House',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'SELF_HELP_STANDARD',
    reviewStatusLabel: 'دليل عملي معتمد في رسم الحدود النفسية',
    directSourceUrl: 'https://www.nedratawwab.com/set-boundaries-find-peace',
    summaryArabic: 'دليل عملي شامل يصنف الحدود الشخصية إلى حدود زمنية، عاطفية، مادية، وجسدية. يوضح الكاتب كيف أن غياب الحدود يؤدي حتماً إلى الاحتراق والاستنزاف والاستياء الضمني في العلاقات، ويقدم صيغاً لفظية واضحة للتعبير عن احتياجاتك دون عدوانية أو اعتذار مجاني.',
    keyTakeaways: [
      'أنواع الحدود: حدود صريحة ومباشرة تحمي وقتك وطاقتك النفسية.',
      'التغلب على الذنب: الذنب شعور مؤقت يرافق التعافي من إرضاء الناس السام.',
      'التواصل التوكيدي: التعبير الواضح المباشر بغير قسوة وبغير خجل.'
    ],
    whoIsThisFor: 'من يجد صعوبة في قول "لا"، أو يشعر باستنزاف دائم في علاقاته الأسرية والمهنية.',
    criticalReadingNote: 'تنبيه تحريري: رسم الحدود مهارة متدرجة تتطلب مراعاة السياق الثقافي والأسري، وليست قطيعة غير مبررة.',
    relatedTopicIds: ['t3-topic1', 't3-topic2'],
    relatedToolActionIds: ['knot', 'translate'],
    licenseNotice: 'مرجع توصية خارجي. تحليل تثقيفي لمبادئ الحدود الصريحة والمهارات التواصلية الموضحة في الكتاب.',
    coverColor: 'bg-[#B78327] text-white',
    icon: '🛡️'
  },
  {
    id: 'book-nonviolent-communication',
    title: 'التواصل غير العنيف: لغة الحياة',
    originalTitle: 'Nonviolent Communication: A Language of Life',
    authors: ['د. مارشال ب. روزنبرغ (Marshall B. Rosenberg, Ph.D.)'],
    category: 'relationships_comm',
    categoryLabel: 'العلاقات الصحية والتواصل',
    publicationYear: '2015 (3rd Ed)',
    publisher: 'PuddleDancer Press',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'نموذج عالمي في مهارات التواصل الإنساني والتعاطف',
    directSourceUrl: 'https://www.cnvc.org/store/nonviolent-communication-a-language-of-life-3rd-edition',
    summaryArabic: 'كتاب مؤسس لمهارات التواصل غير العنيف (NVC). يقدم نموذجاً رباعي الأركان: الملاحظة المباشرة دون أحكام، التعرف على المشاعر، تحديد الاحتياجات غير الملباة، وصياغة الطلبات بوضوح ولطف دون اتهام الآخرين.',
    keyTakeaways: [
      'الأركان الأربعة: الملاحظة المجردة، الشعور الداخلي، الاحتياج العميق، والطلب المحدد.',
      'الاستماع التعاطفي: سماع ما يحتاجه الآخر خلف هجومه أو انفعاله.',
      'تحويل الأحكام إلى احتياجات: فهم أن الغضب هو مؤشر على احتياج غير ملبى.'
    ],
    whoIsThisFor: 'لكل من يرغب في تحسين لغة الحوار في الأسرة والعمل وحل الخلافات بالتعاطف والاحترام.',
    criticalReadingNote: 'تنبيه تحريري: نموذج NVC مهارة لغوية وتواصلية تحتاج تدريباً مستمراً وتطبيقاً مرناً بحسب طبيعة المواقف.',
    relatedTopicIds: ['t3-topic1', 't3-topic2'],
    relatedToolActionIds: ['translate', 'knot'],
    licenseNotice: 'مرجع توصية خارجي. استعراض تعليمي للنموذج الرباعي للتواصل غير العنيف مع إحالة المركز المفتوح.',
    coverColor: 'bg-[#174F3F] text-white',
    icon: '🕊️'
  },
  {
    id: 'book-attached-levine',
    title: 'التعلق: العلوم الجديدة للتعلق البشري',
    originalTitle: 'Attached: The New Science of Adult Attachment and How It Can Help You Find Love',
    authors: ['د. أمير ليفين (Amir Levine, M.D.)', 'راشيل هيلر (Rachel S. F. Heller)'],
    category: 'relationships_comm',
    categoryLabel: 'العلاقات الصحية والتواصل',
    publicationYear: '2010',
    publisher: 'Avery / Penguin Random House',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'تطبيق عملي لنظرية التعلق لدى البالغين',
    directSourceUrl: 'https://www.attachedthebook.com/',
    summaryArabic: 'كتاب يستند إلى نظرية التعلق (Attachment Theory)، ويبسط أنماط التعلق الثلاثة الأساسية لدى البالغين: الآمن (Secure)، القلق (Anxious)، والمتحاشي (Avoidant)، لمساعدة القارئ على فهم استجاباته في العلاقات.',
    keyTakeaways: [
      'أنماط التعلق ليست عيوباً شخصية بل أطر استجابة عصبية عاطفية.',
      'دائرة القلق والتجنب: كيف ينجذب النمط القلق للنمط التجنبي ويغذيان توتر بعضهما.',
      'الوصول للتعلق الآمن: التعبير الصريح عن الاحتياجات العاطفية والتواصل مع شركاء آمنين.'
    ],
    whoIsThisFor: 'من يرغب في فهم استجاباته العاطفية والديناميكيات المتكررة في علاقاته.',
    criticalReadingNote: 'تنبيه تحريري علمي: أنماط التعلق هي أطر استرشادية مرنة لفهم الذات وليست تصنيفات طبية ثابتة أو أحكاماً حتمية على الأفراد.',
    relatedTopicIds: ['t3-topic1', 't3-topic2'],
    relatedToolActionIds: ['compass', 'knot'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تحليلي لنظرية التعلق الموضحة في كتاب الدكتور ليفين.',
    coverColor: 'bg-[#23785B] text-white',
    icon: '🔗'
  },
  {
    id: 'book-gottman-seven-principles',
    title: 'المبادئ السبعة لنجاح الزواج',
    originalTitle: 'The Seven Principles for Making Marriage Work',
    authors: ['د. جون غوت مان (John Gottman, Ph.D.)', 'نان سيلفر (Nan Silver)'],
    category: 'relationships_comm',
    categoryLabel: 'العلاقات الصحية والتواصل',
    publicationYear: '2015 (Updated)',
    publisher: 'Harmony / Crown Publishing',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'أبحاث طولية موثقة في معهد غوت مان للزوجين',
    directSourceUrl: 'https://www.gottman.com/product/the-seven-principles-for-making-marriage-work/',
    summaryArabic: 'حصيلة عقود من الأبحاث الميدانية الرائدة في مختبر العلاقات لمعرفة العوامل الفاصلة بين العلاقات المستقرة والعلاقات المضطربة. يقدم المبادئ السبعة لبناء الصداقة والتواصل والتعامل مع الخلافات الزوجية.',
    keyTakeaways: [
      'فرسان الهيكل الأربعة للدمار الزوجي: (النقد الشخصي، الدفاعية، الاحتقار، والانسحاب الجليدي).',
      'بناء الخرائط العاطفية: معرفة عالم الشريك الداخلي واهتماماته وسجل مشاعره.',
      'إدارة الخلافات الدائمة: التمييز بين المشكلات القابلة للحل والمشكلات المستمرة بعطف.'
    ],
    whoIsThisFor: 'المتزوجون والمقبلون على الزواج والراغبون في تعميق الصداقة والتواصل في حياتهم الأسرية.',
    criticalReadingNote: 'تنبيه تحريري: المبادئ المذكورة هي توجيهات أسرية وتثقيفية مبنية على الدراسات الاستقصائية وليست علاجاً للأزمات الحادة مثل العنف الأسري.',
    relatedTopicIds: ['t3-topic1', 't3-topic2'],
    relatedToolActionIds: ['translate', 'knot'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تثقيفي لأبحاث معهد غوت مان مع إحالة الموقع الرسمي للمعهد.',
    coverColor: 'bg-[#B78327] text-white',
    icon: '💍'
  },
  {
    id: 'book-lost-art-listening',
    title: 'فن الاستماع المفقود: كيف يقوي الإنصات العلاقات',
    originalTitle: 'The Lost Art of Listening: How Learning to Listen Can Improve Relationships',
    authors: ['د. مايكل ب. نيكولز (Michael P. Nichols, Ph.D.)'],
    category: 'relationships_comm',
    categoryLabel: 'العلاقات الصحية والتواصل',
    publicationYear: '2021 (3rd Ed)',
    publisher: 'Guilford Press',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'مرجع سريري في مهارات الاستماع والإنصات العميق',
    directSourceUrl: 'https://www.guilford.com/books/The-Lost-Art-of-Listening/Michael-Nichols/9781462545742',
    summaryArabic: 'كتاب نفسي متعمق يتناول لماذا يصعب علينا الاستماع للآخرين دون دفاعية أو رغبة فورية في الرد والإصلاح. يشرح كيف ينشأ سوء الفهم وكيف يرمم الاستماع الصادق شعور الإنسان بالتقدير والأمان.',
    keyTakeaways: [
      'الاستماع ليس مجرد صمت بل هو حضور ذهني كامل واستيعاب لمشاعر المتحدث.',
      'عقبات الإنصات: الدفاعية الفورية، إعطاء النصائح السريعة، وتشتت الانتباه.',
      'إصلاح سوء الفهم: التأكد من فهم القصد الداخلي للمتحدث قبل الرد.'
    ],
    whoIsThisFor: 'لكل من يعاني من تكرار سوء الفهم في الحوارات، ويرغب في تحسين قدرته على الاستماع والتواصل الداعم.',
    criticalReadingNote: 'تنبيه تحريري: تطوير مهارات الاستماع يركز على تحسين حوارات الحياة اليومية وهو أداة تثقيفية لتطوير الذات.',
    relatedTopicIds: ['t3-topic1', 't3-topic2'],
    relatedToolActionIds: ['translate', 'knot'],
    licenseNotice: 'مرجع توصية خارجي. عرض تثقيفي لأدبيات الدكتور نيكولز المنشورة في الناشر الأكاديمي.',
    coverColor: 'bg-[#174F3F] text-white',
    icon: '🎧'
  },

  // ==========================================
  // التصنيف الثاني: فهم النفس والمشاعر (4 كتب)
  // ==========================================
  {
    id: 'book-self-compassion',
    title: 'التعاطف مع الذات: القوة المسبورة للرفق بنفسك',
    originalTitle: 'Self-Compassion: The Proven Power of Being Kind to Yourself',
    authors: ['د. كريستين نيف (Kristin Neff, Ph.D.)'],
    category: 'self_emotions',
    categoryLabel: 'فهم النفس والمشاعر',
    publicationYear: '2011',
    publisher: 'William Morrow / HarperCollins',
    language: 'مترجم للعربية',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'دراسة علمية موثقة حول أدبيات الرفق بالذات',
    directSourceUrl: 'https://self-compassion.org/the-three-elements-of-self-compassion-2/',
    summaryArabic: 'كتاب يؤسس للمفهوم العلمي للتعاطف مع الذات بدلاً من تقدير الذات المشروط بالإنجاز والمقارنة. يستعرض المكونات الثلاثة الأساسية: الرفق بالذات بدلاً من الجلد المعرفي، الإنسانية المشتركة، واليقظة الذهنية.',
    keyTakeaways: [
      'مخاطبة النفس عند الفشل بنفس اللطف الذي تخاطب به صديقاً عزيزاً.',
      'التذكر بأن المعاناة والخطأ أمور يشاركك فيها كل البشر وليست انفصالاً عنهم.',
      'اليقظة المعتدلة: تسمية الألم دون تضخيمه أو الانغمار فيه.'
    ],
    whoIsThisFor: 'من يعاني من الناقد الداخلي القاسي، جلد الذات المستمر، أو الشعور بالذنب عند عدم الوصول للكمال.',
    criticalReadingNote: 'تنبيه تحريري: التعاطف مع الذات أداة نفسية واعية للرفق بالنفس وليس تدليلاً أو تهرباً من المسؤولية الشخصية.',
    relatedTopicIds: ['t5-topic1', 't5-topic2'],
    relatedToolActionIds: ['translate', 'compass'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تحليلي للمفاهيم الأكاديمية للدكتورة كريستين نيف مع إحالة رابطها المفتوح.',
    coverColor: 'bg-[#B78327] text-white',
    icon: '🌸'
  },
  {
    id: 'book-permission-to-feel',
    title: 'الإذن بالدعوة للشعور: إطلاق قوة الذكاء العاطفي',
    originalTitle: 'Permission to Feel: Unlocking the Power of Emotions to Help Yourself & Society Thrive',
    authors: ['د. مارك براكيت (Marc Brackett, Ph.D.)'],
    category: 'self_emotions',
    categoryLabel: 'فهم النفس والمشاعر',
    publicationYear: '2019',
    publisher: 'Celadon Books / Macmillan',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'نموذج RULER للذكاء العاطفي من مركز ييل',
    directSourceUrl: 'https://www.marabrackett.com/permission-to-feel/',
    summaryArabic: 'كتاب يستند إلى أبحاث مركز ييل للذكاء العاطفي، يقدم نموذج RULER الخماسي: التعرف على المشاعر (Recognize)، فهم أسبابها (Understand)، تسميتها بدقة (Label)، التعبير عنها بسلام (Express)، وتنظيم الاستجابة لها (Regulate).',
    keyTakeaways: [
      'كل المشاعر هي معلومات قيمة وليست خيراً أو شراً بحد ذاتها.',
      'تسمية الشعور بدقة (Labeling) يقلل النشاط الزائد في اللوزة الدماغية.',
      'تطوير قاموس المشاعر للتمييز بين القلق والحزن والإحباط والإرهاق.'
    ],
    whoIsThisFor: 'من يجد صعوبة في فهم مشاعره أو يعاني من قمع العواطف والتعبير الانفجاري عنها.',
    criticalReadingNote: 'تنبيه تحريري: الذكاء العاطفي مهارة تثقيفية قابلة للتعلم، وهو أداة للتنظيم الذاتي وليس علاجاً للاضطرابات العاطفية الحادة.',
    relatedTopicIds: ['t1-topic1', 't5-topic1'],
    relatedToolActionIds: ['feker', 'compass'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تعليمي لأبحاث الذكاء العاطفي الصادرة عن المعهد الأكاديمي.',
    coverColor: 'bg-[#174F3F] text-white',
    icon: '🎨'
  },
  {
    id: 'book-adult-children-immature',
    title: 'الأبناء البالغون للوالدين غير النضجاء عاطفياً',
    originalTitle: 'Adult Children of Emotionally Immature Parents',
    authors: ['د. ليندسي جيبسون (Lindsay C. Gibson, Psy.D.)'],
    category: 'self_emotions',
    categoryLabel: 'فهم النفس والمشاعر',
    publicationYear: '2015',
    publisher: 'New Harbinger Publications',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'مرجع سريري في العلاج النفسي الفردي والأسري',
    directSourceUrl: 'https://www.lindsaygibsonpsyd.com/books',
    summaryArabic: 'كتاب نفسي سريري يوضح كيف تؤثر النشأة في بيئة أسرية تفتقر للاستجابة العاطفية أو النضج النفسي على صياغة مفهوم الذات والعلاقات لدى البالغين، وكيف يمكن بناء استقلالية عاطفية صحية دون صراع.',
    keyTakeaways: [
      'أنواع عدم النضج العاطفي: الوالد المندفع، الوالد المائل للكمال، والوالد المنكفئ.',
      'دور الاستيعاب الذاتي: التعرف على نمط الانتحاء الذاتي (Internalizer) والتعبير عن الذات الحقيقية.',
      'تطوير الاستقلالية العاطفية وتقبل حدود الآخرين دون القفز لإصلاحهم.'
    ],
    whoIsThisFor: 'البالغون الراغبون في فهم أثر ديناميكيات نشأتهم الأولى وتطوير حدود وحماية عاطفية متزنة.',
    criticalReadingNote: 'تنبيه تحريري علمي: الكتاب يقدم إطاراً تحليلياً تثقيفياً لوعي الذات ولا يهدف إلى إلقاء اللوم أو وصم الوالدين بأوصاف طبية قطعية.',
    relatedTopicIds: ['t3-topic1', 't5-topic1'],
    relatedToolActionIds: ['knot', 'translate'],
    licenseNotice: 'مرجع توصية خارجي. تحليل تثقيفي للمفاهيم السريرية المنشورة للدكتورة جيبسون.',
    coverColor: 'bg-[#23785B] text-white',
    icon: '🌱'
  },
  {
    id: 'book-gifts-imperfection',
    title: 'عطايا عدم الكمال: التخلي عمن تعتقد أنك يجب أن تكونه',
    originalTitle: 'The Gifts of Imperfection: Let Go of Who You Think You\'re Supposed to Be',
    authors: ['د. برينيه براون (Brené Brown, Ph.D., MSW)'],
    category: 'self_emotions',
    categoryLabel: 'فهم النفس والمشاعر',
    publicationYear: '2010 (10th Anniv Ed 2020)',
    publisher: 'Hazelden Publishing',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'أبحاث موثقة في دراسات الخجل والقيمة الذاتية',
    directSourceUrl: 'https://brenebrown.com/book/the-gifts-of-imperfection/',
    summaryArabic: 'كتاب يعرض نتائج سنوات من الأبحاث 질ية حول القيمة الذاتية، التقبل، وكيفية التغلب على الشعور بالخجل وثقافة المبالغة في المثالية والكمال لعيش حياة قلبيّة متكاملة.',
    keyTakeaways: [
      'التعافي من الكمالية: التمييز بين السعي السوي للإنجاز وبين الكمالية المرهقة لحماية الذات.',
      'المرونة في مواجهة الخجل: تسمية الخجل ومشاركته مع آمنين يضعف سلطته.',
      'ممارسة الامتنان والبهجة كعادات يومية لحماية القلب.'
    ],
    whoIsThisFor: 'من يرهقه التفكير في نظرة الآخرين، ويصارع الرغبة الشديدة في الوصول إلى الكمال.',
    criticalReadingNote: 'تنبيه تحريري: أبحاث القيمة الذاتية هي توجيهات تثقيفية وتطويرية وليست بديلاً عن العلاج السلوكي في حالات الاكتئاب الحاد.',
    relatedTopicIds: ['t5-topic1', 't5-topic2'],
    relatedToolActionIds: ['translate', 'compass'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تحليلي لأدبيات الدكتورة برينيه براون مع إحالة موقعها الأكاديمي.',
    coverColor: 'bg-[#B78327] text-white',
    icon: '💎'
  },

  // ==========================================
  // التصنيف الثالث: الضغط النفسي والتعافي والمرونة (4 كتب)
  // ==========================================
  {
    id: 'book-burnout-nagoski',
    title: 'الاحتراق النفسي: سر إغلاق دورة الضغط النفسي',
    originalTitle: 'Burnout: The Secret to Unlocking the Stress Cycle',
    authors: ['د. إميلي ناغوسكي (Emily Nagoski, Ph.D.)', 'د. أميليا ناغوسكي (Amelia Nagoski, D.M.A.)'],
    category: 'stress_resilience',
    categoryLabel: 'الضغط النفسي والتعافي والمرونة',
    publicationYear: '2019',
    publisher: 'Ballantine Books / Penguin Random House',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'دراسة علمية في فسيولوجيا الضغط والإنهاك العصبي',
    directSourceUrl: 'https://www.burnoutbook.net/',
    summaryArabic: 'كتاب يبين الفرق الجوهري بين إزالة مسبب الضغط (Stressor) وبين إكمال دورة الاستجابة للضغط النفسي في الجسد (Completing the Stress Cycle). يقدم 7 طرق بيولوجية لإبلاغ الجسد بأنه في أمان.',
    keyTakeaways: [
      'إكمال دورة الضغط النفسي: الجسد يحتاج إشارات فيزيولوجية ليخرج من التهديد.',
      'الطرق السبع لإغلاق الدورة: الحركة الجسدية، التنفس البطيء، الضيافة الاجتماعية، الضحك، البكاء، اللمسة الدافئة، والتعبير الإبداعي.',
      'مقاومة عقلية الرعاية الدائمة المستنزفة للطاقة.'
    ],
    whoIsThisFor: 'من يعاني من الإنهاك النفسي والجسدي، ويشعر بالتوتر المتراكم رغم انتهاء مهام العمل.',
    criticalReadingNote: 'تنبيه تحريري: إغلاق دورة الضغط تقنية فسيولوجية ووقائية، والاحتراق المتقدم يستلزم مراجعة بيئة العمل والرعاية الطبية المتخصصة.',
    relatedTopicIds: ['t1-topic1', 't4-topic1'],
    relatedToolActionIds: ['breathe', 'battery'],
    licenseNotice: 'مرجع توصية خارجي. عرض تثقيفي للنموذج الفسيولوجي الموضح في دراسات الشقيقتين ناغوسكي.',
    coverColor: 'bg-[#174F3F] text-white',
    icon: '🔥'
  },
  {
    id: 'book-happiness-trap',
    title: 'مصيدة السعادة: كيف تتوقف عن الصراع وتبدأ العيش',
    originalTitle: 'The Happiness Trap: How to Stop Struggling and Start Living',
    authors: ['د. روس هاريس (Russ Harris)'],
    category: 'stress_resilience',
    categoryLabel: 'الضغط النفسي والتعافي والمرونة',
    publicationYear: '2008 (2nd Ed 2022)',
    publisher: 'Exisle Publishing / Shambhala',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'SELF_HELP_STANDARD',
    reviewStatusLabel: 'دليل مساعدة ذاتية مبني على نموذج ACT المعتمد',
    directSourceUrl: 'https://thehappinesstrap.com/',
    summaryArabic: 'كتاب رائد مبني على العلاج بالقبول والالتزام (ACT). يوضح كيف أن محاولاتنا المستمرة للهروب من المشاعر المؤلمة أو تجنبها هي في الحقيقة ما يوقعنا في مصيدة السعادة المزيفة. يمارس الكتاب فك التشابك المعرفي، القبول، والعيش وفق القيم.',
    keyTakeaways: [
      'الألم النفسي جزء طبيعي من الحياة، والمقاومة تضاعف شدته.',
      'فك التشابك مع الأفكار: النظر "إلى" الأفكار بدلاً من النظر "من خلالها".',
      'تحديد البوصلة الشخصية والتصرف بجرأة وفقاً لقيمك.'
    ],
    whoIsThisFor: 'من يستنزف طاقته في محاربة أفكاره ومصاعبه، ويريد العودة لممارسة حياته بفعالية.',
    criticalReadingNote: 'تنبيه تحريري: أساليب ACT تثقيفية وتعليمية لتطوير المرونة النفسية وليست استبدالاً للعلاج النفسي التخصصي عند الأزمات.',
    relatedTopicIds: ['t2-topic1', 't5-topic2'],
    relatedToolActionIds: ['breathe', 'feker'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تعليمي لأدبيات الدكتور روس هاريس في العلاج بالقبول والالتزام.',
    coverColor: 'bg-[#23785B] text-white',
    icon: '💡'
  },
  {
    id: 'book-mans-search-frankl',
    title: 'الإنسان يبحث عن المعنى: مقدمة في العلاج بالمعنى',
    originalTitle: 'Man\'s Search for Meaning',
    authors: ['د. فيكتور إي. فرانكل (Viktor E. Frankl, M.D., Ph.D.)'],
    category: 'stress_resilience',
    categoryLabel: 'الضغط النفسي والتعافي والمرونة',
    publicationYear: '1946 (Reissued 2006)',
    publisher: 'Beacon Press',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'CLINICALLY_VERIFIED',
    reviewStatusLabel: 'مرجع كلاسيكي عالمي في العلاج بالمعنى (Logotherapy)',
    directSourceUrl: 'https://www.viktorfrankl.org/',
    summaryArabic: 'كتاب سردي وفلسفي ونفسي عميق يصنف ضمن أهم المراجع الإنسانية. يعرض تجربة طبيب الأعصاب والطب النفسي فيكتور فرانكل واكتشافه أن القوة الحقيقية للإنسان تتمثل في إيجاد معنى لحياته ومواجهة المعاناة بشجاعة حرّة.',
    keyTakeaways: [
      'الحرية الإنسانية الأخيرة: اختيار موقفك النفسي الداخلي في أي ظرف كان.',
      'مصادر المعنى الثلاثة: العمل والإبداع، التجربة والحب، والموقف من المعاناة المحتومة.',
      'الفراغ الوجودي: الإحباط ينشأ عند غياب الغاية والهدف الحقيقي.'
    ],
    whoIsThisFor: 'من يمر بأزمات وجودية، أو يتساءل عن غاية معاناته وطريقة صموده النفسي أمام الشدائد.',
    criticalReadingNote: 'تنبيه تحريري: الكتاب أثر سردي وفلسفي تثقيفي ونفسي رفيع، ولا يقدم وصفات علاجية طبية سريعة.',
    relatedTopicIds: ['t2-topic2', 't5-topic2'],
    relatedToolActionIds: ['feker', 'compass'],
    licenseNotice: 'مرجع توصية خارجي. ملخص تحليلي لكلاسيكيات العلاج بالمعنى للدكتور فيكتور فرانكل مع إحالة المعهد الرسمي.',
    coverColor: 'bg-[#B78327] text-white',
    icon: '🕯️'
  },
  {
    id: 'book-maybe-you-should-talk',
    title: 'ربما عليك أن تتحدث إلى أحدهم: معالجة نفسية ومعالجها وحياتنا',
    originalTitle: 'Maybe You Should Talk to Someone: A Therapist, HER Therapist, and Our Lives Revealed',
    authors: ['لوري غوتليب (Lori Gottlieb)'],
    category: 'stress_resilience',
    categoryLabel: 'الضغط النفسي والتعافي والمرونة',
    publicationYear: '2019',
    publisher: 'Houghton Mifflin Harcourt',
    language: 'الإنجليزية (ومترجم للعربية)',
    reviewStatus: 'SELF_HELP_STANDARD',
    reviewStatusLabel: 'عمل سردي تثقيفي يبسط تجربة العلاج النفسي',
    directSourceUrl: 'https://lorigottlieb.com/books/maybe-you-should-talk-to-someone/',
    summaryArabic: 'عمل سردي تثقيفي دافئ ومبسط يكشف كواليس تجربة العلاج النفسي من منظور المعالجة والمرضى على حد سواء. يبدد المفاهيم المغلوطة عن الثيرابي ويشرح بأسلوب سردي ممتع كيف يحدث التغيير الإنساني.',
    keyTakeaways: [
      'المعالجون النفسيون بشر يمرون بالألم والصعوبات مثل جميع مرضاهم.',
      'التغيير النفسي رحلة تدريجية تحتاج إلى الشجاعة والصدق مع الذات.',
      'العلاج النفسي مساحة أمان لإعادة اكتشاف حكايتك وترميمها.'
    ],
    whoIsThisFor: 'الراغبون في فهم ما يحدث داخل جلسات العلاج النفسي، ومن يفكرون في طلب الدعم المتخصص.',
    criticalReadingNote: 'تنبيه تحريري: الكتاب عمل سردي تثقيفي وتجربة إنسانية ملهمة وليس دليلاً علاجياً أو منهجاً تدريبياً.',
    relatedTopicIds: ['t6-topic1', 't6-topic2'],
    relatedToolActionIds: ['emergency', 'translate'],
    licenseNotice: 'مرجع توصية خارجي. عرض تثقيفي للعمل السردي للكاتبة لوري غوتليب مع إحالة موقعها الرسمي.',
    coverColor: 'bg-[#174F3F] text-white',
    icon: '☕'
  }
];

// =========================================================================
// 2. VALIDATED ASSESSMENT SCALES (المقاييس النفسية الموثقة)
// =========================================================================

export const VALIDATED_ASSESSMENT_SCALES: ValidatedAssessmentScale[] = [
  {
    id: 'scale-phq9',
    title: 'مقياس استبيان صحة المريض لتقدير أعراض الاكتئاب (PHQ-9)',
    abbreviation: 'PHQ-9',
    subtitle: 'أداة مسح ذاتي موثوقة عالمياً لمتابعة الأعراض الوجدانية والجسدية خلال الأسبوعين الماضيين',
    purpose: 'تقدير شدة الأعراض المرتبطة باعتلال المزاج وفقدان المتعة، والمساعدة في الانتباه المبكر للتغيرات.',
    clinicalSource: 'Developed by Drs. Robert L. Spitzer, Janet W.B. Williams, Kurt Kroenke and colleagues (Pfizer Inc. Open Domain)',
    estimatedTimeMinutes: 3,
    questions: [
      {
        id: 1,
        text: 'قلة الاهتمام أو المتعة في ممارسة الأشياء التي كنت تستمتع بها عادة؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 2,
        text: 'الشعور بالهبوط النفسي، الإحباط، أو اليأس؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 3,
        text: 'صعوبة في الاستغراق في النوم أو الاستمرار فيه، أو النوم أكثر من المعتاد؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 4,
        text: 'الشعور بالتعب وإجهاد الطاقة المستمر؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 5,
        text: 'ضعف الشهية للطعام أو الأكل بشدة وزيادة عن اللزوم؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 6,
        text: 'الشعور بالسوء تجاه نفسك، أو أنك فاشل أو خيبت أمل أسرتك؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 7,
        text: 'صعوبة التركيز في أشياء مثل قراءة الجريدة أو مشاهدة التلفاز أو التخطيط؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 8,
        text: 'البطء شديد في الحركة أو الكلام لدرجة لاحظها الآخرون، أو العكس: التلملم والحركة الزائدة؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 9,
        text: 'أفكار حول أن من الأفضل لو كنت ميتاً، أو أفكار ملحة حول إيذاء نفسك بطريقة ما؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      }
    ],
    scoringRanges: [
      {
        minScore: 0,
        maxScore: 4,
        levelTitle: 'أعراض طفيفة جداً أو غير موجودة (0 - 4)',
        levelDescription: 'مؤشراتك ضمن النطاق الطبيعي المستقر للتغيرات المزاجية اليومية.',
        recommendation: 'استمر في ممارسة العناية بالذات والأنشطة اللطيفة في بستان الألعاب واليقظة الذهنية.'
      },
      {
        minScore: 5,
        maxScore: 9,
        levelTitle: 'أعراض اكتئابية خفيفة (5 - 9)',
        levelDescription: 'توجد بعض إشارات الإجهاد والمزاج المنخفض التي تستدعي الانتباه والرفق.',
        recommendation: 'يُنصح بقراءة مسار التثقيف النفسي وممارسة التنشيط السلوكي المجدول وتمارين التنفس.'
      },
      {
        minScore: 10,
        maxScore: 14,
        levelTitle: 'أعراض اكتئابية متوسطة (10 - 14)',
        levelDescription: 'الأعراض تؤثر بوضوح على جودة يومك وطاقتك النفسية والجسدية.',
        recommendation: 'يُفضل التحدث مع أخصائي نفسي أو طبيب للحصول على تقييم سريري شامل ومساندة موجهة.'
      },
      {
        minScore: 15,
        maxScore: 27,
        levelTitle: 'أعراض اكتئابية شديدة إلى مرتفعة (15 - 27)',
        levelDescription: 'الأعراض تشكل عبئاً كبيراً على قدرتك على ممارسة الحياة والتواصل.',
        recommendation: 'استشارة أخصائي نفسي أو طبيب هي الخطوة الأكثر أماناً وحماية لسلامتك.',
        requiresProfessionalAttention: true
      }
    ],
    disclaimer: 'تنبيه مهم: هذا المقياس أداة تثقيفية واستسترشادية للمتابعة الذاتية، ولا يُعد تشخيصاً طبياً أو نهائياً. التشخيص الطبي يتطلب تقييماً مباشراً من أخصائي أو طبيب نفسي متخصص.'
  },
  {
    id: 'scale-gad7',
    title: 'مقياس اضطراب القلق العام (GAD-7)',
    abbreviation: 'GAD-7',
    subtitle: 'أداة تقييم ذاتي علمية لرصد مستويات القلق والتوتر الذهني خلال الأسبوعين الأخيرين',
    purpose: 'مساعدة الفرد على رصد مشاعر التوتر التراكمي والتفكير الكارثي والتحقق من شدتها.',
    clinicalSource: 'Developed by Drs. Robert L. Spitzer, Kurt Kroenke, Janet W.B. Williams, and Bernd Löwe',
    estimatedTimeMinutes: 2,
    questions: [
      {
        id: 1,
        text: 'الشعور العصبية، القلق، أو الشد العصبي المتوتر؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 2,
        text: 'عدم القدرة على إيقاف القلق أو السيطرة عليه؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 3,
        text: 'القلق الزائد بشأن أشياء مختلفة ومواقف متنوعة؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 4,
        text: 'صعوبة بالغة في الاسترخاء أو إراحة الجسد والعقل؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 5,
        text: 'الشعور بالتململ وعدم القدرة على الجلوس ساكناً من شدة القلق؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 6,
        text: 'سرعة الانزعاج أو الغضب والاستثارة لأقل الأسباب؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      },
      {
        id: 7,
        text: 'الشعور بالخوف والتوجس كأن شيئاً مروعاً وسيئاً للغاية على وشك الحدوث؟',
        options: [
          { label: 'أبداً (0)', score: 0 },
          { label: 'عدة أيام (1)', score: 1 },
          { label: 'أكثر من نصف الأيام (2)', score: 2 },
          { label: 'تقريباً كل يوم (3)', score: 3 }
        ]
      }
    ],
    scoringRanges: [
      {
        minScore: 0,
        maxScore: 4,
        levelTitle: 'قلق طبيعي خفيف (0 - 4)',
        levelDescription: 'مستويات توترك ضمن الاستجابة الطبيعية للضغوط المعتادة.',
        recommendation: 'استمر في ممارسة تمارين التنفس الهادئ ورعاية السكينة.'
      },
      {
        minScore: 5,
        maxScore: 9,
        levelTitle: 'قلق خفيف إلى متوسط (5 - 9)',
        levelDescription: 'توجد مؤشرات توتر وتفكير متزايد يحتاج لوقفة رفق ومهارات تهدئة الجهاز العصبي.',
        recommendation: 'استخدم تطبيق فكّر وتمرين تفكيك العقد وتمرين التنفس المهدئ.'
      },
      {
        minScore: 10,
        maxScore: 14,
        levelTitle: 'قلق متوسط إلى بارز (10 - 14)',
        levelDescription: 'التوتر والقلق يؤثران على تركيزك ونومك وارتياحك الجسدي.',
        recommendation: 'يُنصح بقراءة مراجع القبول والالتزام والتحدث مع أخصائي نفسي لتلقي توجيه موجه.'
      },
      {
        minScore: 15,
        maxScore: 21,
        levelTitle: 'قلق مرتفع وشديد (15 - 21)',
        levelDescription: 'مستويات التوتر عالية وتجهد الجهاز العصبي بشكل مستمر.',
        recommendation: 'مراجعة أخصائي نفسي توفر لك خطة رعاية متخصصة واستعادة الأمان الداخلي.',
        requiresProfessionalAttention: true
      }
    ],
    disclaimer: 'تنبيه: هذا الاستبيان أداة استرشادية للتثقيف والمتابعة الذاتية، ولا يحل محل التقييم الطبي السريري المباشر.'
  }
];

// =========================================================================
// 3. PSYCHOEDUCATION GUIDED PATHS (المسارات التثقيفية)
// =========================================================================

export const PSYCHOEDUCATION_PATHS: PsychoeducationPath[] = [
  {
    id: 'path-fatigue-joy',
    title: 'مسار فهم الفتور وفقدان المتعة والدافعية',
    description: 'خطوات تثقيفية موجهة لتفكيك شعور "مش فارق معايا"، واكتشاف التنشيط السلوكي واستعادة الشغف بالتدريج.',
    icon: '🥀➡️🌱',
    estimatedMinutes: 15,
    topicIds: ['t1-topic1', 't4-topic1'],
    bookIds: ['book-who-selfhelp', 'book-nice-ng222'],
    assessmentScaleId: 'scale-phq9',
    toolActionId: 'battery'
  },
  {
    id: 'path-stress-overthinking',
    title: 'مسار التعامل مع الضغط النفسي والقلق والتفكير الزائد',
    description: 'دليل متكامل لتثبيت الجسد بالأرض، فك التشابك المعرفي مع سيناريوهات الكارثة، واستعادة جودة النوم.',
    icon: '🌀➡️🍃',
    estimatedMinutes: 20,
    topicIds: ['t2-topic1', 't2-topic2'],
    bookIds: ['book-who-stress', 'book-mind-over-mood', 'book-happiness-trap'],
    assessmentScaleId: 'scale-gad7',
    toolActionId: 'feker'
  },
  {
    id: 'path-self-compassion',
    title: 'مسار بناء التعاطف مع الذات وتفكيك الناقد الداخلي',
    description: 'رحلة تحويل الصوت الداخلي القاسي إلى صديق مساند، والتعامل مع أخطاء الماضي برفق وإنسانية.',
    icon: '🌸➡️🤍',
    estimatedMinutes: 18,
    topicIds: ['t5-topic1', 't5-topic2'],
    bookIds: ['book-self-compassion'],
    toolActionId: 'compass'
  },
  {
    id: 'path-boundaries-relations',
    title: 'مسار رسم الحدود الشخصية وحماية الطاقة',
    description: 'مهارات عملية لقول "لا" دون ذنب، وحماية المساحة الشخصية في العلاقات الأسرية والمهنية.',
    icon: '🤝➡️🛡️',
    estimatedMinutes: 16,
    topicIds: ['t3-topic1', 't3-topic2'],
    bookIds: ['book-set-boundaries'],
    toolActionId: 'knot'
  }
];
