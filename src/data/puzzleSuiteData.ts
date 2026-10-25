/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Local bundled images for 100% offline reliability
import zenImage from '../assets/images/calm_breathe_zen_1791037470270.jpg';
import natureHeroImage from '../assets/images/nesmat_hero_nature_1791037451436.jpg';
import darkForestImage from '../assets/images/nesma_dark_forest_1792061235071.jpg';
import homeLightImage from '../assets/images/nesma_home_light_1792061219016.jpg';

// ==========================================
// 1. JIGSAW PUZZLE DATA
// ==========================================

export interface JigsawLevel {
  id: string;
  title: string;
  subtitle: string;
  category: 'zen' | 'nature' | 'warmth';
  imageSrc: string;
  gridSizes: (3 | 4 | 5)[];
  defaultGrid: 3 | 4 | 5;
  psychologicalTakeaway: {
    title: string;
    message: string;
  };
}

export const JIGSAW_LEVELS: JigsawLevel[] = [
  {
    id: 'jigsaw_zen',
    title: 'حديقة السكينة وأحجار الاتزان',
    subtitle: 'هدوء الحواس وإعادة ترتيب اللحظة الحاضرة',
    category: 'zen',
    imageSrc: zenImage,
    gridSizes: [3, 4, 5],
    defaultGrid: 3,
    psychologicalTakeaway: {
      title: 'اتزان الحاضر قطرة قطرة',
      message: '«كما تلتقي قطع الصورة لتصنع مشهداً هادئاً، تتجمع لحظات أنفاسك الصغيرة لتصنع سلامك الداخلي اليوم».'
    }
  },
  {
    id: 'jigsaw_nature',
    title: 'أشعة الصباح في بستان الأمل',
    subtitle: 'انفراج الضوء ووضوح الرؤية النفسية',
    category: 'nature',
    imageSrc: natureHeroImage,
    gridSizes: [3, 4, 5],
    defaultGrid: 4,
    psychologicalTakeaway: {
      title: 'النور يتسلل من بين الفروع',
      message: '«الأمور المعقدة تبدو مستحيلة حين ننظر إليها مبعثرة، لكنها تنتظم خطوة بخطوة بالصبر والرفق».'
    }
  },
  {
    id: 'jigsaw_forest',
    title: 'المسار المتوهج في الغابة الهادئة',
    subtitle: 'الثقة في الخطوة القادمة وسط العتمة',
    category: 'nature',
    imageSrc: darkForestImage,
    gridSizes: [3, 4, 5],
    defaultGrid: 4,
    psychologicalTakeaway: {
      title: 'الاطمئنان في المسار',
      message: '«لا تحتاج لرؤية الغابة بأكملها لتبدأ السير؛ يكفيك نور الشمعة أمام خطوتك التالية مباشرة».'
    }
  },
  {
    id: 'jigsaw_warmth',
    title: 'ملاذ الدفء والسكينة المنزلية',
    subtitle: 'العودة الآمنة إلى الذات وصون الطاقة',
    category: 'warmth',
    imageSrc: homeLightImage,
    gridSizes: [3, 4, 5],
    defaultGrid: 3,
    psychologicalTakeaway: {
      title: 'ملاذك الآمن بين يديك',
      message: '«الراحة ليست مكاناً نصل إليه بعد الإجهاد، بل ركنٌ دافئ نصنعه في قلوبنا كلما شعرنا بالثقل».'
    }
  }
];

// ==========================================
// 2. SPOT-THE-DETAIL & DIFFERENCES DATA
// ==========================================

export interface SpotTarget {
  id: string;
  name: string;
  hint: string;
  xPercent: number; // Center X in percentage (0 - 100)
  yPercent: number; // Center Y in percentage (0 - 100)
  radiusPercent: number; // Click detection radius
  explanation: string;
}

export interface SpotChallenge {
  id: string;
  type: 'hidden_objects' | 'spot_differences';
  title: string;
  subtitle: string;
  instructions: string;
  sceneTheme: 'garden_secrets' | 'mind_mirror' | 'crystal_pond';
  targets: SpotTarget[];
  psychologicalTakeaway: {
    title: string;
    message: string;
  };
}

export const SPOT_CHALLENGES: SpotChallenge[] = [
  {
    id: 'spot_garden',
    type: 'hidden_objects',
    title: 'أسرار بستان اليقظة الذهنية',
    subtitle: 'درب عينيك على التقاط التفاصيل اللطيفة وسط المشهد الواسع',
    instructions: 'انقري على العناصر الأربعة المخفية في بستان الهدوء:',
    sceneTheme: 'garden_secrets',
    targets: [
      {
        id: 'tgt_butterfly',
        name: 'الفراشة الذهبية المتخفية',
        hint: 'تبحث عن الرحيق قرب زهرة اللوتس في أسفل اليسار',
        xPercent: 24,
        yPercent: 78,
        radiusPercent: 9,
        explanation: 'الفراشة الذهبية ترمز إلى خفة الروح حين تتحرر من أثقال المقارنات.'
      },
      {
        id: 'tgt_dew',
        name: 'قطرة الندى البلورية',
        hint: 'تستقر على حافة الورقة العريضة في أعلى اليمين',
        xPercent: 78,
        yPercent: 32,
        radiusPercent: 8,
        explanation: 'قطرة الندى تذكرنا بأن البدايات الصغيرة النقية تكفي لري يوم بأكمله.'
      },
      {
        id: 'tgt_key',
        name: 'مفتاح السكينة القديم',
        hint: 'مخبأ برفق بين جذور الشجرة المعمرة في الوسط',
        xPercent: 52,
        yPercent: 84,
        radiusPercent: 9,
        explanation: 'المفتاح العتيق يفتح أبواب القبول والتسليم بما لا نملك تغييره.'
      },
      {
        id: 'tgt_lantern',
        name: 'قنديل النور الهادئ',
        hint: 'معلق بين أغصان الشجرة في أعلى اليسار',
        xPercent: 30,
        yPercent: 25,
        radiusPercent: 9,
        explanation: 'القنديل رمز للبصيرة الداخلية التي تنير لنا دروب اتخاذ القرارات برفق.'
      }
    ],
    psychologicalTakeaway: {
      title: 'اليقظة لتفاصيل الجمال',
      message: '«عندما نبطئ خطواتنا ونلاحظ التفاصيل الصغيرة، يتلاشى قلق المستقبل ونسترد طاقة الحاضر».'
    }
  },
  {
    id: 'spot_diff_mirror',
    type: 'spot_differences',
    title: 'مرآة الأفكار: قبل التهدئة وبعدها',
    subtitle: 'قارني بين المشهدين واكتشفي الفروق الأربعة التي تصنع الفرق في المزاج',
    instructions: 'انقري على مواضع الاختلاف الأربعة بين مشهد التشتت ومشهد الصفاء:',
    sceneTheme: 'mind_mirror',
    targets: [
      {
        id: 'diff_sun',
        name: 'قرص الشمس الدافئ',
        hint: 'انظري إلى السماء في الزاوية العلوية؛ غيمة في جهة وشمس مشرقة في الأخرى',
        xPercent: 82,
        yPercent: 18,
        radiusPercent: 9,
        explanation: 'تبدد الغيوم وظهور الشمس يجسد انقشاع التهويل الذهني.'
      },
      {
        id: 'diff_water',
        name: 'سكون سطح النهر',
        hint: 'تموجات مضطربة في المشهد الأول يقابلها سطح مستقر عاكس في الثاني',
        xPercent: 50,
        yPercent: 68,
        radiusPercent: 11,
        explanation: 'هدوء الماء يمثل استقرار ضربات القلب مع التنفس العميق المنظم.'
      },
      {
        id: 'diff_flower',
        name: 'تفتح زهرة الحديقة',
        hint: 'برعم منغلق تحول إلى زهرة متفتحة بلون وردي وضاء في الأسفل',
        xPercent: 22,
        yPercent: 75,
        radiusPercent: 9,
        explanation: 'تفتح الزهرة يرمز لاستعادة الإقبال على الحياة برفق وبلا ضغط.'
      },
      {
        id: 'diff_bird',
        name: 'طائر الأمل المحلق',
        hint: 'طائر يرتفع حراً في سماء المشهد الأيمن بينما هو غائب في الأيسر',
        xPercent: 38,
        yPercent: 22,
        radiusPercent: 8,
        explanation: 'تحليق الطائر يعبر عن خفة النفس حين تضع حمولتها الزائدة جانباً.'
      }
    ],
    psychologicalTakeaway: {
      title: 'قوة التحول الواعي',
      message: '«فروق صغيرة في نظرتك للموقف تصنع فارقاً شاسعاً في راحتك العصبية وسلام يومك».'
    }
  },
  {
    id: 'spot_twilight',
    type: 'hidden_objects',
    title: 'واحة السكينة المسائية ومرآة الغروب',
    subtitle: 'ابحثي عن معالم الأمان والهدوء وسط ألوان الغروب الدافئة',
    instructions: 'انقري على معالم السكينة الأربعة المستقرة في واحة المساء:',
    sceneTheme: 'crystal_pond',
    targets: [
      {
        id: 'tgt_boat',
        name: 'قارب الطمأنينة الراسي',
        hint: 'يرسو بهدوء على ضفة البحيرة في أسفل اليسار',
        xPercent: 28,
        yPercent: 72,
        radiusPercent: 10,
        explanation: 'الرسو الهادئ يعلمنا فضيلة الاستراحة والتوقف عن التجديف المستمر.'
      },
      {
        id: 'tgt_lighthouse',
        name: 'منارة الأمل المتوهجة',
        hint: 'ترتفع في الأفق على التل في أعلى اليمين',
        xPercent: 78,
        yPercent: 28,
        radiusPercent: 9,
        explanation: 'المنارة رمز للثقة الداخلية التي تهدينا حين تظلم الدروب المؤقتة.'
      },
      {
        id: 'tgt_moon_reflect',
        name: 'انعكاس الهلال على الماء',
        hint: 'يتلألأ وسط صفحة الماء الهادئة في منتصف المشهد',
        xPercent: 52,
        yPercent: 62,
        radiusPercent: 8,
        explanation: 'صفاء الماء يعكس النور، تماماً كقلبك حين يهدأ عن صخب المقارنات.'
      },
      {
        id: 'tgt_jasmine',
        name: 'شجيرة الياسمين العطرية',
        hint: 'تفوح أزهارها البيضاء الرقيقة على الحافة اليمنى للبحيرة',
        xPercent: 84,
        yPercent: 76,
        radiusPercent: 9,
        explanation: 'الياسمين يفوح ليلاً ليذكرنا بأن أطيب ما فينا يزهر في أوقات السكينة والتأمل.'
      }
    ],
    psychologicalTakeaway: {
      title: 'استراحة المحارب النفسي',
      message: '«في نهاية اليوم، اغلقي دفاتر العتاب، ودعي هدوء المساء يرمم طاقتك للغد».'
    }
  }
];

// ==========================================
// 3. LOGIC & REASONING PUZZLES DATA
// ==========================================

export interface MatchstickPuzzle {
  id: string;
  type: 'matchstick';
  title: string;
  equationString: string; // e.g. "6 + 4 = 4"
  instructions: string;
  prompt: string;
  // Matchsticks representation: list of matchstick states
  sticks: {
    id: number;
    part: 'num1' | 'op' | 'num2' | 'eq' | 'num3';
    segment: string;
    isActive: boolean;
  }[];
  // Target solution: indices of stick to pick up and slot to place
  allowedMoveCount: number;
  hints: string[];
  solutionExplanation: string;
  solutionEquation: string;
  isSolutionValid: (activeStickIds: number[]) => boolean;
  psychologicalTakeaway: {
    title: string;
    message: string;
  };
}

export interface PathTilePuzzle {
  id: string;
  type: 'light_path';
  title: string;
  instructions: string;
  gridSize: 3;
  // 3x3 tiles, each tile has connections: [top, right, bottom, left]
  initialRotations: number[]; // 0, 90, 180, 270 degrees
  solutionRotations: number[][]; // Valid combinations of rotations
  hints: string[];
  psychologicalTakeaway: {
    title: string;
    message: string;
  };
}

export interface MatrixPatternPuzzle {
  id: string;
  type: 'pattern_matrix';
  title: string;
  instructions: string;
  prompt: string;
  // 8 items displayed, 9th is missing
  gridItems: {
    id: number;
    shape: 'circle' | 'square' | 'triangle' | 'diamond';
    color: string;
    dotsCount: number;
    rotation: number;
  }[];
  options: {
    id: number;
    shape: 'circle' | 'square' | 'triangle' | 'diamond';
    color: string;
    dotsCount: number;
    rotation: number;
    explanation: string;
  }[];
  correctOptionId: number;
  hints: string[];
  psychologicalTakeaway: {
    title: string;
    message: string;
  };
}

export type LogicPuzzle = MatchstickPuzzle | PathTilePuzzle | MatrixPatternPuzzle;

export const LOGIC_PUZZLES: LogicPuzzle[] = [
  // 1. Matchstick Equation: 6 + 4 = 4  --> Move 1 stick from 6 to make 0 + 4 = 4
  {
    id: 'logic_match_1',
    type: 'matchstick',
    title: 'لغز أعواد الثقاب — تصحيح معادلة الهدوء',
    equationString: '6 + 4 = 4',
    prompt: 'المعادلة الحالية غير صحيحة: [ ٦ + ٤ = ٤ ]. حركي عود ثقاب واحداً فقط لتصبح المعادلة صحيحة رياضياً:',
    instructions: 'انقري على عود الثقاب الذي تريدين رفعه، ثم انقري على الموضع الشاغر لوضعه.',
    allowedMoveCount: 1,
    sticks: [
      // Digit 1 (6): 6 segments active (a, c, d, e, f, g)
      { id: 1, part: 'num1', segment: 'top', isActive: true },
      { id: 2, part: 'num1', segment: 'top-left', isActive: true },
      { id: 3, part: 'num1', segment: 'top-right', isActive: false }, // slot for 8 or 0
      { id: 4, part: 'num1', segment: 'middle', isActive: true },      // removable to make 0!
      { id: 5, part: 'num1', segment: 'bottom-left', isActive: true },
      { id: 6, part: 'num1', segment: 'bottom-right', isActive: true },
      { id: 7, part: 'num1', segment: 'bottom', isActive: true },

      // Operator (+): 2 sticks
      { id: 8, part: 'op', segment: 'horizontal', isActive: true },
      { id: 9, part: 'op', segment: 'vertical', isActive: true },

      // Digit 2 (4):
      { id: 10, part: 'num2', segment: 'top-left', isActive: true },
      { id: 11, part: 'num2', segment: 'top-right', isActive: true },
      { id: 12, part: 'num2', segment: 'middle', isActive: true },
      { id: 13, part: 'num2', segment: 'bottom-right', isActive: true },

      // Equal sign (=): 2 sticks
      { id: 14, part: 'eq', segment: 'eq-top', isActive: true },
      { id: 15, part: 'eq', segment: 'eq-bottom', isActive: true },

      // Digit 3 (4):
      { id: 16, part: 'num3', segment: 'top-left', isActive: true },
      { id: 17, part: 'num3', segment: 'top-right', isActive: true },
      { id: 18, part: 'num3', segment: 'middle', isActive: true },
      { id: 19, part: 'num3', segment: 'bottom-right', isActive: true }
    ],
    hints: [
      'ركزي على الرقم الأول (6) في بداية المعادلة.',
      'إذا رفعتِ العود الأوسط في الرقم 6، فماذا يصبح؟',
      'ضعي العود المرفوع في الفراغ العلوي الأيمن ليتحول الرقم 6 إلى 0، فتصبح: 0 + 4 = 4!'
    ],
    solutionEquation: '0 + 4 = 4  (أو  8 - 4 = 4)',
    solutionExplanation: 'بنقل عود الثقاب من وسط الرقم 6 إلى جانبه الأيمن، يتحول إلى الرقم 0، فتتحقق المعادلة بدقة: 0 + 4 = 4.',
    isSolutionValid: (activeStickIds: number[]) => {
      // Solution A: middle of 6 (id 4) is removed, and top-right of 6 (id 3) is filled!
      const solA = !activeStickIds.includes(4) && activeStickIds.includes(3) && activeStickIds.includes(9);
      // Solution B: vertical stick of + (id 9) moved to 6 to make 8: 8 - 4 = 4!
      const solB = !activeStickIds.includes(9) && activeStickIds.includes(3) && activeStickIds.includes(4);
      return solA || solB;
    },
    psychologicalTakeaway: {
      title: 'مرونة تغيير الزاوية',
      message: '«أحياناً لا نحتاج إلى تغيير المشكلة كلها؛ مجرد إعادة ترتيب فكرة واحدة صغيرة كفيل بجعل كل شيء منطقياً ومريحاً».'
    }
  },

  // 2. Path Rotation Tile Puzzle (3x3 grid connecting Source at Top-Left to Destination at Bottom-Right)
  {
    id: 'logic_path_1',
    type: 'light_path',
    title: 'لغز مسار النور — توصيل شعاع الوعي',
    instructions: 'انقري على مربعات المسار لتدويرها 90 درجة، حتى يتدفق شعاع النور من منبع البداية (أعلى اليمين) إلى بلورة السكينة (أسفل اليسار) بلا انقطاع.',
    gridSize: 3,
    // Rotations: 0, 90, 180, 270 deg
    initialRotations: [90, 180, 0, 270, 90, 180, 0, 270, 90],
    solutionRotations: [
      // Solution A: smooth continuous flow through the tiles
      [0, 90, 180, 270, 0, 90, 180, 270, 0],
      [180, 90, 180, 0, 90, 180, 0, 90, 180]
    ],
    hints: [
      'ابدئي من المربع الأول وتتبعي المسار خطوة بخطوة.',
      'تأكدي من أن أطراف الأنابيب تتقابل مباشرة عند الحدود الفاصلة.',
      'المربع الأوسط يحتاج مساراً يربط اليمين باليسار أو الأعلى بالأسفل.'
    ],
    psychologicalTakeaway: {
      title: 'اتصال المسارات الداخلية',
      message: '«الأفكار المشوشة تصنع انقطاعاً في طاقتك، لكن بمجرد محاذاة قيمك واحتياجاتك برفق، يتدفق السلام دون عوائق».'
    }
  },

  // 3. Matrix Pattern Logic (Visual Raven-style progression)
  {
    id: 'logic_matrix_1',
    type: 'pattern_matrix',
    title: 'لغز مصفوفة الأنماط الفكرية — الشكل المتمم',
    instructions: 'تأملي حركة الأشكال وعدد النقاط وتغير الألوان عبر الصفوف والأعمدة، ثم اختاري الشكل المتمم الصحيح لموضع علامة الاستفهام (؟):',
    prompt: 'ما هو الشكل المنطقي الذي يكمل النمط في المربع الأخير؟',
    gridItems: [
      // Row 1: Circles with increasing dots (1 -> 2 -> 3)
      { id: 1, shape: 'circle', color: '#10B981', dotsCount: 1, rotation: 0 },
      { id: 2, shape: 'circle', color: '#10B981', dotsCount: 2, rotation: 45 },
      { id: 3, shape: 'circle', color: '#10B981', dotsCount: 3, rotation: 90 },

      // Row 2: Squares with increasing dots (1 -> 2 -> 3)
      { id: 4, shape: 'square', color: '#38BDF8', dotsCount: 1, rotation: 0 },
      { id: 5, shape: 'square', color: '#38BDF8', dotsCount: 2, rotation: 45 },
      { id: 6, shape: 'square', color: '#38BDF8', dotsCount: 3, rotation: 90 },

      // Row 3: Diamonds with increasing dots (1 -> 2 -> ?)
      { id: 7, shape: 'diamond', color: '#F59E0B', dotsCount: 1, rotation: 0 },
      { id: 8, shape: 'diamond', color: '#F59E0B', dotsCount: 2, rotation: 45 }
      // 9 is missing!
    ],
    options: [
      {
        id: 101,
        shape: 'diamond',
        color: '#F59E0B',
        dotsCount: 3,
        rotation: 90,
        explanation: 'الشكل الصحيح: معين بلون عنبري، يحمل 3 نقاط ومستدير بزاوية 90 درجة ليكمل النمط المتسق.'
      },
      {
        id: 102,
        shape: 'circle',
        color: '#F59E0B',
        dotsCount: 3,
        rotation: 90,
        explanation: 'غير صحيح؛ فالصف الثالث يختص بأشكال المعين وليس الدوائر.'
      },
      {
        id: 103,
        shape: 'diamond',
        color: '#38BDF8',
        dotsCount: 2,
        rotation: 45,
        explanation: 'غير صحيح؛ اللون يجب أن يكون عنبرياً، والنقاط يجب أن تتصاعد إلى 3.'
      },
      {
        id: 104,
        shape: 'square',
        color: '#10B981',
        dotsCount: 1,
        rotation: 0,
        explanation: 'غير صحيح؛ هذا الشكل لا ينسجم مع قاعدة الصف الثالث.'
      }
    ],
    correctOptionId: 101,
    hints: [
      'لاحظي نوع الشكل في كل صف: الصف الأول دوائر، الثاني مربعات، والثالث معينات.',
      'لاحظي عدد النقاط في كل عمود: العمود الأول نقطة، الثاني نقطتان، فماذا عن الثالث؟',
      'الخيار الصحيح معين عنبري يحمل 3 نقاط ومستدير بزاوية 90 درجة!'
    ],
    psychologicalTakeaway: {
      title: 'استقراء الأنماط بوعي',
      message: '«حين ندرك الأنماط المتكررة في ردود أفعالنا، نكتسب القدرة الهادئة على اختيار الاستجابة الأنسب لمواقفنا».'
    }
  },

  // 4. Matchstick Equation 2: 5 + 7 = 2  --> Move 1 stick from + to make 9 - 7 = 2
  {
    id: 'logic_match_2',
    type: 'matchstick',
    title: 'لغز أعواد الثقاب ٢ — تحويل الزيادة إلى اتزان',
    equationString: '5 + 7 = 2',
    prompt: 'المعادلة الحالية غير صحيحة: [ ٥ + ٧ = ٢ ]. انقلي عود ثقاب واحداً فقط لتصبح المعادلة صحيحة رياضياً:',
    instructions: 'انقري على عود الثقاب الذي تريدين رفعه، ثم انقري على الموضع الشاغر لوضعه.',
    allowedMoveCount: 1,
    sticks: [
      // Digit 1 (5):
      { id: 1, part: 'num1', segment: 'top', isActive: true },
      { id: 2, part: 'num1', segment: 'top-left', isActive: true },
      { id: 3, part: 'num1', segment: 'top-right', isActive: false }, // slot to make 9!
      { id: 4, part: 'num1', segment: 'middle', isActive: true },
      { id: 5, part: 'num1', segment: 'bottom-left', isActive: false },
      { id: 6, part: 'num1', segment: 'bottom-right', isActive: true },
      { id: 7, part: 'num1', segment: 'bottom', isActive: true },

      // Operator (+): 2 sticks
      { id: 8, part: 'op', segment: 'horizontal', isActive: true },
      { id: 9, part: 'op', segment: 'vertical', isActive: true },

      // Digit 2 (7):
      { id: 10, part: 'num2', segment: 'top-left', isActive: true },
      { id: 11, part: 'num2', segment: 'top-right', isActive: true },
      { id: 12, part: 'num2', segment: 'middle', isActive: false },
      { id: 13, part: 'num2', segment: 'bottom-right', isActive: true },

      // Equal sign (=): 2 sticks
      { id: 14, part: 'eq', segment: 'eq-top', isActive: true },
      { id: 15, part: 'eq', segment: 'eq-bottom', isActive: true },

      // Digit 3 (2):
      { id: 16, part: 'num3', segment: 'top-left', isActive: true },
      { id: 17, part: 'num3', segment: 'top-right', isActive: true },
      { id: 18, part: 'num3', segment: 'middle', isActive: true },
      { id: 19, part: 'num3', segment: 'bottom-right', isActive: true }
    ],
    hints: [
      'ركزي على علامة الجمع (+) في المعادلة.',
      'إذا رفعتِ العود العمودي من علامة الجمع (+)، تصبح علامة طرح (-).',
      'ضعي هذا العود في الموضع العلوي الأيمن للرقم 5 ليتحول إلى 9، فتصبح: 9 - 7 = 2!'
    ],
    solutionEquation: '9 - 7 = 2',
    solutionExplanation: 'بنقل العود الرأسي من علامة (+) إلى الفراغ العلوي الأيمن في الرقم 5، تصبح المعادلة: 9 - 7 = 2 بدقة تامة.',
    isSolutionValid: (activeStickIds: number[]) => {
      return !activeStickIds.includes(9) && activeStickIds.includes(3) && activeStickIds.includes(8);
    },
    psychologicalTakeaway: {
      title: 'تحويل العبء إلى تخفيف',
      message: '«أحياناً يكون الحل ليس في إضافة المزيد من الجهد، بل في تحويل الجمع المرهق إلى طرح وتخفيف هادئ».'
    }
  },

  // 5. Path Rotation Tile Puzzle 2 (Serpentine Flow)
  {
    id: 'logic_path_2',
    type: 'light_path',
    title: 'لغز مسار النور ٢ — التدفق اللولبي المتناغم',
    instructions: 'دوري مربعات المسار التسعة لربط منبع الحكمة في أعلى الوسط بالينبوع في أسفل الوسط بمسار متصل.',
    gridSize: 3,
    initialRotations: [180, 270, 90, 0, 180, 270, 90, 0, 180],
    solutionRotations: [
      [90, 180, 270, 0, 90, 180, 270, 0, 90],
      [270, 0, 90, 180, 270, 0, 90, 180, 270]
    ],
    hints: [
      'ابدئي من الصف الأوسط وتأكدي من تدفق المسار من الأعلى إلى الأسفل.',
      'المربعات في الزوايا تعمل كمنعطفات توجيهية.',
      'دوري المربع الأوسط حتى يلتقي طرفاه مع المربعين المجاورين.'
    ],
    psychologicalTakeaway: {
      title: 'انسيابية التدفق',
      message: '«الأمور المعقدة لا تُحل بالاصطدام المباشر، بل بالتدفق المرن حول العوائق حتى نصل إلى صفاء النية».'
    }
  },

  // 6. Matrix Pattern Logic 2 (Wisdom Symbols: Lotus, Moon, Sun)
  {
    id: 'logic_matrix_2',
    type: 'pattern_matrix',
    title: 'لغز مصفوفة فصول الوعي — الشكل المتمم',
    instructions: 'تأملي حركة الشمس والقمر وزهرة اللوتس مع تزايد البصيرة، ثم اختاري الشكل المتمم لموضع علامة الاستفهام (؟):',
    prompt: 'ما هو الشكل المتمم الصحيح لمنظومة الوعي في الصف الأخير؟',
    gridItems: [
      // Row 1: Lotus blossoms (Emerald) with rotations: 0, 45, 90
      { id: 1, shape: 'triangle', color: '#10B981', dotsCount: 1, rotation: 0 },
      { id: 2, shape: 'triangle', color: '#10B981', dotsCount: 2, rotation: 45 },
      { id: 3, shape: 'triangle', color: '#10B981', dotsCount: 3, rotation: 90 },

      // Row 2: Crescent Moons (Sky Blue) with rotations: 0, 45, 90
      { id: 4, shape: 'circle', color: '#38BDF8', dotsCount: 1, rotation: 0 },
      { id: 5, shape: 'circle', color: '#38BDF8', dotsCount: 2, rotation: 45 },
      { id: 6, shape: 'circle', color: '#38BDF8', dotsCount: 3, rotation: 90 },

      // Row 3: Golden Suns (Amber) with rotations: 0, 45, ?
      { id: 7, shape: 'diamond', color: '#F59E0B', dotsCount: 2, rotation: 0 },
      { id: 8, shape: 'diamond', color: '#F59E0B', dotsCount: 4, rotation: 45 }
    ],
    options: [
      {
        id: 201,
        shape: 'diamond',
        color: '#F59E0B',
        dotsCount: 6,
        rotation: 90,
        explanation: 'الشكل الصحيح: معين عنبري يحمل 6 نقاط ومستدير بزاوية 90 درجة (تسلسل مضاعف: 2 -> 4 -> 6).'
      },
      {
        id: 202,
        shape: 'circle',
        color: '#F59E0B',
        dotsCount: 6,
        rotation: 90,
        explanation: 'غير صحيح؛ الصف الثالث خاص بأشكال المعين وليس الدوائر.'
      },
      {
        id: 203,
        shape: 'diamond',
        color: '#38BDF8',
        dotsCount: 5,
        rotation: 45,
        explanation: 'غير صحيح؛ اللون يجب أن يكون عنبرياً، والنقاط تتزايد بمقدار 2.'
      },
      {
        id: 204,
        shape: 'triangle',
        color: '#10B981',
        dotsCount: 3,
        rotation: 0,
        explanation: 'غير صحيح؛ هذا الشكل ينتمي للصف الأول.'
      }
    ],
    correctOptionId: 201,
    hints: [
      'الصف الثالث يتبع أشكال المعين العنبرية.',
      'لاحظي تزايد النقاط في الصف الثالث: 2 ثم 4.. فما هي الخطوة التالية؟',
      'الخيار الصحيح هو معين عنبري يحمل 6 نقاط ومستدير بزاوية 90 درجة.'
    ],
    psychologicalTakeaway: {
      title: 'استقراء التدرج الهادئ',
      message: '«البصيرة تنمو كالأشعة الذهبية، تتضاعف بالتدريج كلما منحنا أنفسنا وقتاً للتأمل الهادئ».'
    }
  },

  // 7. Matrix Pattern Logic 3 (Color & Shape Latin Square)
  {
    id: 'logic_matrix_3',
    type: 'pattern_matrix',
    title: 'لغز مصفوفة ميزان التناغم النفسي',
    instructions: 'استقرئي توزيع الأشكال (دائرة، مربع، معين) وتناوب الألوان الثلاثة عبر الصفوف والأعمدة دون تكرار:',
    prompt: 'ما هو الشكل واللون الصحيح الذي يكمل اتزان المصفوفة في موضع علامة الاستفهام؟',
    gridItems: [
      // Row 1: Circle (Emerald), Square (Sky), Diamond (Amber)
      { id: 1, shape: 'circle', color: '#10B981', dotsCount: 1, rotation: 0 },
      { id: 2, shape: 'square', color: '#38BDF8', dotsCount: 2, rotation: 0 },
      { id: 3, shape: 'diamond', color: '#F59E0B', dotsCount: 3, rotation: 0 },

      // Row 2: Square (Sky), Diamond (Amber), Circle (Emerald)
      { id: 4, shape: 'square', color: '#38BDF8', dotsCount: 2, rotation: 0 },
      { id: 5, shape: 'diamond', color: '#F59E0B', dotsCount: 3, rotation: 0 },
      { id: 6, shape: 'circle', color: '#10B981', dotsCount: 1, rotation: 0 },

      // Row 3: Diamond (Amber), Circle (Emerald), ?
      { id: 7, shape: 'diamond', color: '#F59E0B', dotsCount: 3, rotation: 0 },
      { id: 8, shape: 'circle', color: '#10B981', dotsCount: 1, rotation: 0 }
    ],
    options: [
      {
        id: 301,
        shape: 'square',
        color: '#38BDF8',
        dotsCount: 2,
        rotation: 0,
        explanation: 'الشكل الصحيح: مربع أزرق سماوي يحمل نقطتين، ليكتمل في الصف والعمود الأخير الأشكال الثلاثة والألوان الثلاثة بلا تكرار.'
      },
      {
        id: 302,
        shape: 'circle',
        color: '#10B981',
        dotsCount: 1,
        rotation: 0,
        explanation: 'غير صحيح؛ الدائرة الخضراء موجودة بالفعل في هذا الصف.'
      },
      {
        id: 303,
        shape: 'diamond',
        color: '#F59E0B',
        dotsCount: 3,
        rotation: 0,
        explanation: 'غير صحيح؛ المعين العنبري مكرر في بداية الصف.'
      },
      {
        id: 304,
        shape: 'square',
        color: '#F59E0B',
        dotsCount: 1,
        rotation: 0,
        explanation: 'غير صحيح؛ اللون يجب أن يكون أزرق سماوياً ليكمل التناوب الثلاثي.'
      }
    ],
    correctOptionId: 301,
    hints: [
      'تأكدي من أن كل صف يحتوي على دائرة ومربع ومعين.',
      'ما هو الشكل الناقص في الصف الثالث والعمود الثالث؟',
      'الشكل الناقص هو المربع الأزرق السماوي بنقطتين!'
    ],
    psychologicalTakeaway: {
      title: 'اكتمال التوازن الداخلي',
      message: '«حين تتكامل عواطفنا وأفكارنا وسلوكياتنا دون طغيان جانب على آخر، يستقر ميزان السكينة الداخلي».'
    }
  }
];
