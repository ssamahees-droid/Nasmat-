import React, { useState } from 'react';
import { 
  Utensils, 
  X, 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  Bookmark, 
  Heart, 
  HelpCircle, 
  ShoppingBag, 
  ShieldAlert,
  Info,
  ChevronRight,
  Flame,
  Clock,
  Check,
  Wand2,
  Coffee,
  Smile,
  Zap,
  Activity,
  Calendar,
  Plus,
  Trash2,
  Leaf,
  MessageSquare,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../services/storage';
import { TextAudioPlayer } from './TextAudioPlayer';
import { chimeService } from '../services/chimeService';

interface MoodKitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Recipe {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'fermented' | 'prebiotic' | 'fats' | 'herbs' | 'elixirs';
  categoryLabelAr: string;
  categoryLabelEn: string;
  prepTimeAr: string;
  prepTimeEn: string;
  availabilityAr: string;
  availabilityEn: string;
  ingredientsAr: string[];
  ingredientsEn: string[];
  stepsAr: string[];
  stepsEn: string[];
  scienceNoteAr: string;
  scienceNoteEn: string;
  moodConnectionAr: string;
  moodConnectionEn: string;
}

export interface MealMoodLogEntry {
  id: string;
  timestamp: string;
  timeFormattedAr: string;
  timeFormattedEn: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  customIngredients: string;
  mood: 'calm' | 'tense' | 'sluggish' | 'moody' | 'energized' | 'bloated';
  digestiveComfort: 'light' | 'moderate' | 'heavy';
  notes?: string;
  advice: {
    titleAr: string;
    titleEn: string;
    gutBrainConnectionAr: string;
    gutBrainConnectionEn: string;
    practicalTipAr: string;
    practicalTipEn: string;
  };
}

const RECIPES: Recipe[] = [
  {
    id: 'rk-1',
    titleAr: 'طبق زبادي بلدي بالخمائر الحية وبذور الكتان العضوية',
    titleEn: 'Egyptian Probiotic Yogurt Bowl with Ground Flaxseeds',
    category: 'fermented',
    categoryLabelAr: 'أطعمة مخمرة (Probiotics)',
    categoryLabelEn: 'Fermented Foods',
    prepTimeAr: '٥ دقائق',
    prepTimeEn: '5 minutes',
    availabilityAr: 'متوفر في كل بقالة ومطبخ مصري',
    availabilityEn: 'Available in every Egyptian home',
    ingredientsAr: [
      'كوب زبادي بلدي طازج (يحتوي على بكتيريا حية نشطة)',
      'ملعقة صغيرة بذور كتان مطحونة حديثاً (ألياف بريبيوتيك)',
      'رشة صغيرة من قرفة العسل أو قطرات عسل أبيض نقي',
      'بضع قطرات من عصير الليمون الطازج'
    ],
    ingredientsEn: [
      '1 cup fresh local Egyptian yogurt (live active cultures)',
      '1 tsp freshly ground flaxseeds (prebiotic fiber)',
      'A small pinch of cinnamon or drops of pure honey',
      'A few drops of fresh lemon juice'
    ],
    stepsAr: [
      'اختر زبادي بلدي طازجاً غنياً بالخمائر الحية.',
      'أضف ملعقة بذور الكتان المطحونة لزيادة تغذية بكتيريا الأمعاء.',
      'قلّب المكونات بلطف حتى تتجانس وتناولها كوجبة خفيفة ومغذية.'
    ],
    stepsEn: [
      'Choose fresh local yogurt rich in live cultures.',
      'Add ground flaxseeds to nourish gut beneficial bacteria.',
      'Stir gently until combined and enjoy as a nourishing snack.'
    ],
    scienceNoteAr: 'الأطعمة المخمرة تمد الأمعاء بسلالات بكتيرية نافعة تدعم التوازن الحيوي للميكروبيوم. تشير الأبحاث العصبية المعوية إلى أن ميكروبيوم الأمعاء يساهم في تنظيم الاستجابة الالتهابية المرتبطة بالتوتر عبر العصب الحائر (Vagus Nerve).',
    scienceNoteEn: 'Fermented foods supply beneficial bacterial strains supporting microbiome balance. Neuro-gastroenterology research shows the gut microbiome helps regulate stress-related inflammatory responses via the vagus nerve.',
    moodConnectionAr: 'يمنح شعوراً بالاستقرار الهضمي والراحة الجسدية، وهو داعم ممتاز للصحة النفسية العامة (ملاحظة علمية: ليس علاجاً طبياً للاكتئاب السريري، بل غذاء داعم للوعي الصحي والعصبي).',
    moodConnectionEn: 'Provides digestive stability and physical comfort, acting as an excellent supporter of general mental wellness (scientific note: not a medical cure for clinical depression, but supportive nutritional care).'
  },
  {
    id: 'rk-2',
    titleAr: 'فول مصري أصيل بالثوم والكمون وزيت الزيتون البكر',
    titleEn: 'Classic Egyptian Baladi Ful Medames with Garlic & Olive Oil',
    category: 'prebiotic',
    categoryLabelAr: 'ألياف بريبيوتيك (Prebiotics)',
    categoryLabelEn: 'Prebiotic Fibers',
    prepTimeAr: '١٠ دقائق',
    prepTimeEn: '10 minutes',
    availabilityAr: 'الطبق الشعبي الأول، متوفر بكل منزل',
    availabilityEn: 'The ultimate Egyptian staple dish',
    ingredientsAr: [
      'كوب فول مدمس مسلوق بعناية',
      'فص ثوم مهروس طازج',
      'نصف ملعقة كمون ناعم وعصير نصف ليمونة',
      'ملعقة كبيرة زيت زيتون بكر ممتاز ورشة بقدونس مفروم'
    ],
    ingredientsEn: [
      '1 cup well-cooked Egyptian fava beans (ful)',
      '1 fresh minced garlic clove',
      '1/2 tsp ground cumin and juice of half a lemon',
      '1 tbsp extra virgin olive oil and chopped parsley'
    ],
    stepsAr: [
      'يُسخن الفول المدمس على نار هادئة حتى يغلي بخفة.',
      'يُضاف الثوم المهروس، الكمون، وعصير الليمون.',
      'يُرفع عن النار ويُغرق بزيت الزيتون البكر ويُزين بالبقدونس.'
    ],
    stepsEn: [
      'Warm the fava beans over low heat until simmering.',
      'Add minced garlic, cumin, and lemon juice.',
      'Remove from heat, drizzle with extra virgin olive oil, and garnish with parsley.'
    ],
    scienceNoteAr: 'الفول غني بالألياف الغذائية القابلة للذوبان وغير القابلة للذوبان (Prebiotic fibers). تستخدم بكتيريا الأمعاء النافعة هذه الألياف لإنتاج أحماض دهنية قصيرة السلسلة (مثل البيوتيرات Butyrate) التي تحمي جدار الأمعاء وتدعم التواصل العصبي المعوي.',
    scienceNoteEn: 'Fava beans are rich in soluble and insoluble prebiotic fibers. Beneficial gut bacteria ferment these fibers to produce short-chain fatty acids (like butyrate) protecting the gut barrier and supporting gut-brain signaling.',
    moodConnectionAr: 'يمنح طاقة مستدامة وثباتاً في مستويات سكر الدم، مما ينعكس إيجاباً على الانتباه والهدوء النفسي طوال اليوم.',
    moodConnectionEn: 'Provides sustainable energy and stable blood sugar levels, positively reflecting on concentration and mental calmness throughout the day.'
  },
  {
    id: 'rk-3',
    titleAr: 'شوربة العدس الأصفر الدافئة بالليمون والكزبرة',
    titleEn: 'Warm Egyptian Yellow Lentil Soup with Lemon & Coriander',
    category: 'prebiotic',
    categoryLabelAr: 'ألياف بريبيوتيك ومعادن',
    categoryLabelEn: 'Prebiotic & Minerals',
    prepTimeAr: '٢٠ دقيقة',
    prepTimeEn: '20 minutes',
    availabilityAr: 'اقتصادية، متوفرة ومثالية للأيام الباردة',
    availabilityEn: 'Economical, available, and ideal for cozy days',
    ingredientsAr: [
      'كوب عدس أصفر مغسول جيداً',
      'بصلة صغيرة، جزرة، وفص ثوم',
      'ملعقة صغيرة كمون وكزبرة مطحونة',
      'ملعقة زيت زيتون أو سمن بلدي صحي'
    ],
    ingredientsEn: [
      '1 cup yellow lentils rinsed well',
      '1 small onion, 1 carrot, and 1 garlic clove',
      '1 tsp ground cumin and coriander',
      '1 tbsp olive oil or healthy ghee'
    ],
    stepsAr: [
      'يُسلق العدس مع البصل والجزر والثوم حتى ينضج تماماً.',
      'يُخفق الخليط بالخلاط حتى يصبح ناعماً وكريمياً.',
      'يُتبل بالكمون والكزبرة ويُقدم دافئاً مع قطرات الليمون.'
    ],
    stepsEn: [
      'Boil lentils with onion, carrot, and garlic until fully tender.',
      'Blend the mixture until smooth and creamy.',
      'Season with cumin and coriander, serving warm with lemon drops.'
    ],
    scienceNoteAr: 'العدس مصدر ممتاز للبروتين النباتي، حمض الفوليك، والمعادن الأساسية التي تدعم إنتاج الناقلات العصبية وصحة خلايا الدماغ.',
    scienceNoteEn: 'Lentils are an excellent source of plant protein, folate, and essential minerals supporting neurotransmitter production and brain cell health.',
    moodConnectionAr: 'يمنح شعوراً دافئاً بالاحتواء والراحة العصبية والجسدية (Comfort Food) دون شعور بالثقل.',
    moodConnectionEn: 'Provides a warm sense of emotional embrace and neural-physical comfort without heaviness.'
  },
  {
    id: 'rk-4',
    titleAr: 'منقوع البابونج والنعناع الأخضر الهادئ',
    titleEn: 'Calming Chamomile & Fresh Mint Infusion',
    category: 'herbs',
    categoryLabelAr: 'أعشاب مهدئة للاسترخاء',
    categoryLabelEn: 'Calming Herbal Teas',
    prepTimeAr: '٥ دقائق',
    prepTimeEn: '5 minutes',
    availabilityAr: 'متوفر في كل مطبخ عطارة مصري',
    availabilityEn: 'Available in every Egyptian herbal shop',
    ingredientsAr: [
      'ملعقة كبيرة زهور بابونج مجففة نقية',
      'أوراق نعناع أخضر طازجة',
      'كوب ماء مغلي حديثاً',
      'ملعقة صغيرة عسل نقي (اختياري)'
    ],
    ingredientsEn: [
      '1 tbsp pure dried chamomile flowers',
      'Fresh green mint leaves',
      '1 cup freshly boiled water',
      '1 tsp pure honey (optional)'
    ],
    stepsAr: [
      'تُوضع زهور البابونج وأوراق النعناع في كوب زجاجي.',
      'يُصب الماء المغلي ويُغطى الكوب لمدة ٥ دقائق للحفاظ على الزيوت الطيارة.',
      'يُصفى ويُشرب ببطء في لحظة هدوء استرخائية.'
    ],
    stepsEn: [
      'Place chamomile flowers and mint leaves in a glass cup.',
      'Pour boiling water and cover for 5 minutes to preserve essential oils.',
      'Strain and sip slowly in a quiet, relaxing moment.'
    ],
    scienceNoteAr: 'البابونج يحتوي على مركبات الفلافونويد (مثل الأبيجينين Apigenin) التي ترتبط بمستقبلات GABA في الدماغ، مما يساهم في تخفيف التوتر الخفيف واسترخاء العضلات والأعصاب.',
    scienceNoteEn: 'Chamomile contains flavonoids (like apigenin) binding to GABA receptors in the brain, helping ease mild tension and relax muscles and nerves.',
    moodConnectionAr: 'يساعد على تهدئة الجهاز العصبي الودي (Sympathetic Nervous System) وإبطاء سرعة الأفكار قبل النوم.',
    moodConnectionEn: 'Helps calm the sympathetic nervous system and slow racing thoughts before sleep.'
  },
  {
    id: 'rk-5',
    titleAr: 'الحليب الذهبي الدافئ بالكركم ورشة قرفة (Golden Milk)',
    titleEn: 'Warm Golden Turmeric & Cinnamon Elixir',
    category: 'elixirs',
    categoryLabelAr: 'مشروبات ذهبية مهدئة',
    categoryLabelEn: 'Calming Golden Elixirs',
    prepTimeAr: '٧ دقائق',
    prepTimeEn: '7 minutes',
    availabilityAr: 'متوفر في كل مطبخ، دافئ ومريح',
    availabilityEn: 'Available, warm, and comforting',
    ingredientsAr: [
      'كوب حليب دافئ (عادي أو نباتي حسب الرغبة)',
      'نصف ملعقة صغيرة كركم مطحون نقي',
      'رشة فلفل أسود صغيرة (تزيد امتصاص الكركم)',
      'رشة قرفة ونصف ملعقة عسل أبيض'
    ],
    ingredientsEn: [
      '1 cup warm milk (dairy or plant-based)',
      '1/2 tsp pure ground turmeric',
      'A tiny pinch of black pepper (enhances absorption)',
      'A pinch of cinnamon and 1/2 tsp white honey'
    ],
    stepsAr: [
      'يُسخن الحليب مع الكركم ورشة الفلفل الأسود على نار هادئة.',
      'يُصب في كوب ويُحلى بالعسل وتُرش القرفة على الوجه.',
      'يُشرب دافئاً ببطء للاسترخاء المسائي.'
    ],
    stepsEn: [
      'Warm milk with turmeric and black pepper on low heat.',
      'Pour into a cup, sweeten with honey, and dust with cinnamon.',
      'Sip slowly in the evening for relaxation.'
    ],
    scienceNoteAr: 'الكركم يحتوي على مادة الكركمين (Curcumin) ذات الخصائص المضادة للأكسدة والمخفضة للالتهابات المرتبطة بالإجهاد العصبي، مما يدعم صفاء الذهن والراحة.',
    scienceNoteEn: 'Turmeric contains curcumin with antioxidant and anti-inflammatory properties linked to stress reduction, supporting mental clarity and comfort.',
    moodConnectionAr: 'يمنح شعوراً عميقاً بالدفء والاحتواء المنزلي، ويُعد طقساً مسائياً ممتازاً لفصل التوتر.',
    moodConnectionEn: 'Provides a deep sense of home warmth and evening comfort ritual to release daily tension.'
  }
];

const MYTHS = [
  {
    id: 'm1',
    mythAr: 'خرافة: تناول قطعة شوكولاتة يفرز الدوبامين مباشرة ويعالج القلق كلياً.',
    mythEn: 'Myth: Eating a piece of chocolate instantly releases dopamine and cures anxiety entirely.',
    factAr: 'حقيقة علمية: الشوكولاتة تمنح متعة مؤقتة وسريعة بسبب السكر والدهون، لكنها لا تُعد علاجاً للقلق ولا تنظم الكيمياء العصبية على المدى الطويل. الأساس هو النظام الغذائي المستقر والغني بالألياف.',
    factEn: 'Scientific Fact: Chocolate gives temporary pleasure due to sugar and fats, but is not a cure for anxiety or long-term neurochemical regulation. A stable, fiber-rich diet is key.'
  },
  {
    id: 'm2',
    mythAr: 'خرافة: الزبادي وحده يكفي للتخلص من نوبات الاكتئاب.',
    mythEn: 'Myth: Yogurt alone is enough to eliminate depression episodes.',
    factAr: 'حقيقة علمية: صحة الأمعاء وثيق الصلة بالمزاج عبر محور الأمعاء–الدماغ، لكن الاكتئاب السريري حالة معقدة تتطلب رعاية نفسية شاملة (العلاج النفسي أو الطبيب المختص) ولا يكتفى بالطعام وحده.',
    factEn: 'Scientific Fact: Gut health is closely linked to mood via the gut-brain axis, but clinical depression is complex requiring comprehensive psychological care (therapy/psychiatrist), not food alone.'
  },
  {
    id: 'm3',
    mythAr: 'خرافة: المكملات الغذائية الباهظة هي الطريقة الوحيدة لدعم الميكروبيوم.',
    mythEn: 'Myth: Expensive supplements are the only way to support the microbiome.',
    factAr: 'حقيقة علمية: الأطعمة البسيطة والاقتصادية المتاحة في البيوت المصرية (كالزبادي البلدي، الفول، العدس، البقوليات، والخضروات) هي المصادر الأغنى والأكثر تنوعاً لتغذية بكتيريا الأمعاء.',
    factEn: 'Scientific Fact: Simple, economical foods available in Egyptian homes (local yogurt, fava beans, lentils, legumes, vegetables) are the richest, most diverse sources for feeding gut bacteria.'
  }
];

const QUICK_INGREDIENT_OPTIONS = [
  { id: 'probiotics', ar: 'زبادي بلدي أو خمائر حية', en: 'Local Yogurt / Probiotics', tag: 'probiotic' },
  { id: 'ful_legumes', ar: 'فول مدمس أو بقوليات', en: 'Fava Beans / Legumes', tag: 'prebiotic' },
  { id: 'lentils_soup', ar: 'عدس أو شوربة دافئة', en: 'Lentils / Warm Soup', tag: 'protein' },
  { id: 'flax_oats', ar: 'بذور كتان أو شوفان', en: 'Flaxseeds / Oats', tag: 'fiber' },
  { id: 'greens_salad', ar: 'خضروات ورقية طازجة', en: 'Leafy Greens / Salad', tag: 'vitamins' },
  { id: 'olive_oil', ar: 'زيت زيتون بكر ممتاز', en: 'Extra Virgin Olive Oil', tag: 'healthy_fat' },
  { id: 'calming_herbs', ar: 'أعشاب مهدئة (بابونج/نعناع)', en: 'Calming Herbs (Chamomile/Mint)', tag: 'herbal' },
  { id: 'caffeine', ar: 'قهوة أو شاي ثقيل (كافيين)', en: 'Coffee / Strong Tea (Caffeine)', tag: 'stimulant' },
  { id: 'high_sugar', ar: 'حلويات أو سكريات سريعة', en: 'Sweets / High Sugars', tag: 'sugar' },
  { id: 'fried_fastfood', ar: 'مقليات أو وجبة سريعة دسمة', en: 'Fried Food / Fast Food', tag: 'heavy_fat' },
  { id: 'white_carbs', ar: 'مخبوزات بيضاء أو معجنات', en: 'White Bread / Pastries', tag: 'refined_carbs' },
  { id: 'fruits_nuts', ar: 'فواكه طازجة أو مكسرات/تمر', en: 'Fresh Fruits / Nuts / Dates', tag: 'antioxidants' }
];

const INITIAL_SAMPLE_LOGS: MealMoodLogEntry[] = [
  {
    id: 'log-sample-1',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    timeFormattedAr: 'اليوم، منذ ٣ ساعات',
    timeFormattedEn: 'Today, 3 hours ago',
    mealType: 'breakfast',
    ingredients: ['زبادي بلدي أو خمائر حية', 'بذور كتان أو شوفان'],
    customIngredients: 'رشة عسل أبيض وقطرات ليمون',
    mood: 'calm',
    digestiveComfort: 'light',
    notes: 'تناولت الإفطار بهدوء بعيداً عن الهاتف',
    advice: {
      titleAr: 'تناغم محوري ممتاز بين الأمعاء والدماغ',
      titleEn: 'Optimal Gut-Brain Axis Harmony',
      gutBrainConnectionAr: 'مزيج الخمائر الحية من الزبادي البلدي مع ألياف بذور الكتان يمنح بكتيريا الأمعاء النافعة وقوداً مثالياً لإنتاج الأحماض الدهنية قصيرة السلسلة (SCFA) التي تُرسل إشارات استرخاء فورية عبر العصب الحائر.',
      gutBrainConnectionEn: 'The synergy of live active cultures and prebiotic flaxseed fiber nourishes gut microbiota to synthesize short-chain fatty acids that communicate calming signals via the vagus nerve.',
      practicalTipAr: 'واصل هذا الطقس الصباحي؛ فهو يحافظ على استقرار مستويات الدوبامين والسيروتونين الطبيعية في الجهاز العصبي المعوي.',
      practicalTipEn: 'Maintain this morning ritual; it sustains baseline dopamine and serotonin signaling in your enteric nervous system.'
    }
  }
];

export const MoodKitchenModal: React.FC<MoodKitchenModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'recipes' | 'log' | 'chef' | 'quiz' | 'science' | 'myths' | 'shopping'>('log');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedRecipes, setSavedRecipes] = useState<string[]>(() => {
    const saved = localStorage.getItem('mood_kitchen_saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [triedRecipes, setTriedRecipes] = useState<string[]>(() => {
    const tried = localStorage.getItem('mood_kitchen_tried');
    return tried ? JSON.parse(tried) : [];
  });
  const [activeRecipeDetail, setActiveRecipeDetail] = useState<Recipe | null>(null);

  // Meal & Mood Log State
  const [mealMoodLogs, setMealMoodLogs] = useState<MealMoodLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nesmat_mood_kitchen_meal_logs');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_LOGS;
    } catch {
      return INITIAL_SAMPLE_LOGS;
    }
  });

  const [inputMealType, setInputMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['زبادي بلدي أو خمائر حية']);
  const [customIngredients, setCustomIngredients] = useState<string>('');
  const [inputMood, setInputMood] = useState<'calm' | 'tense' | 'sluggish' | 'moody' | 'energized' | 'bloated'>('tense');
  const [inputDigestiveComfort, setInputDigestiveComfort] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const [inputNotes, setInputNotes] = useState<string>('');
  const [latestGeneratedAdvice, setLatestGeneratedAdvice] = useState<MealMoodLogEntry['advice'] | null>(null);
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);

  // Interactive Mood Chef State
  const [chefMood, setChefMood] = useState<'stressed' | 'tired' | 'scattered' | 'calm'>('stressed');
  const [chefResult, setChefResult] = useState<{ title: string; desc: string; tip: string } | null>(null);

  // Quiz State
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSave = (id: string) => {
    chimeService.playReassuranceChime();
    const updated = savedRecipes.includes(id) 
      ? savedRecipes.filter(i => i !== id)
      : [...savedRecipes, id];
    setSavedRecipes(updated);
    localStorage.setItem('mood_kitchen_saved', JSON.stringify(updated));
  };

  const markAsTried = (recipe: Recipe) => {
    chimeService.playReassuranceChime();
    if (!triedRecipes.includes(recipe.id)) {
      const updated = [...triedRecipes, recipe.id];
      setTriedRecipes(updated);
      localStorage.setItem('mood_kitchen_tried', JSON.stringify(updated));
      storage.addNote(language === 'ar' 
        ? `جربت اليوم وصفة من مطبخ المزاج: «${recipe.titleAr}». شعرت بالراحة والدعم الهضمي.`
        : `Tried recipe from Mood Kitchen today: «${recipe.titleEn}». Felt nourished and supported.`);
    }
  };

  const toggleIngredientSelection = (name: string) => {
    chimeService.playReassuranceChime();
    setSelectedIngredients(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  // Generate scientific psycho-nutritional advice based on ingredients, mood and comfort
  const generatePsychoNutritionalAdvice = (
    mood: 'calm' | 'tense' | 'sluggish' | 'moody' | 'energized' | 'bloated',
    ingredients: string[],
    customText: string,
    comfort: 'light' | 'moderate' | 'heavy'
  ): MealMoodLogEntry['advice'] => {
    const hasSugar = ingredients.some(i => i.includes('سكريات') || i.includes('Sugar')) || customText.includes('سكر') || customText.includes('شوكولات');
    const hasCaffeine = ingredients.some(i => i.includes('كافيين') || i.includes('قهوة') || i.includes('Caffeine')) || customText.includes('قهوة') || customText.includes('نسكافيه');
    const hasFriedOrFast = ingredients.some(i => i.includes('مقليات') || i.includes('Fried')) || customText.includes('مقلي') || customText.includes('برجر') || customText.includes('شيبس');
    const hasProbiotics = ingredients.some(i => i.includes('زبادي') || i.includes('خمائر') || i.includes('Probiotics')) || customText.includes('زبادي') || customText.includes('لبن رايب');
    const hasHerbs = ingredients.some(i => i.includes('أعشاب') || i.includes('Herbs')) || customText.includes('بابونج') || customText.includes('نعناع') || customText.includes('يانسون');
    const hasFibers = ingredients.some(i => i.includes('فول') || i.includes('عدس') || i.includes('كتان') || i.includes('خضروات'));

    if (mood === 'tense' || mood === 'moody') {
      if (hasSugar || hasCaffeine) {
        return {
          titleAr: 'تأثير تذبذب سكر الدم والكافيين على إشارات القلق العصبية',
          titleEn: 'Blood Sugar & Caffeine Dynamics on Anxiety Signaling',
          gutBrainConnectionAr: 'تناول السكريات السريعة أو الكافيين المرتفع أثناء الشعور بالتوتر يُحدث ارتفاعاً حاداً يليه هبوط سريع في سكر الدم. يفسر الدماغ هذا الهبوط كهبوط طاقة طارئ، فيفرز المزيد من الأدرينالين والكورتيزول مما يزيد من خفقان القلب والشد العضلي.',
          gutBrainConnectionEn: 'Consuming high simple sugars or caffeine during stress induces rapid blood glucose spikes followed by sharp drops. The brain interprets this glucose crash as an emergency, releasing extra adrenaline and cortisol which mimics and exacerbates anxiety.',
          practicalTipAr: 'اشرب فوراً كوباً دافئاً من منقوع البابونج أو النعناع بدون سكر، وقم بـ ٤ دورات تنفس بطيء (شهيق ٤ ثوانٍ وزفير ٦ ثوانٍ) لإعادة تفعيل الجهاز العصبي نظير الودي الهادئ.',
          practicalTipEn: 'Sip a warm unsweetened chamomile or mint tea right now, and take 4 slow breaths (inhale 4s, exhale 6s) to activate your calming parasympathetic rest-and-digest response.'
        };
      }
      if (hasProbiotics || hasHerbs || hasFibers) {
        return {
          titleAr: 'دعم عالي للناقل المهدئ (GABA) عبر الميكروبيوم',
          titleEn: 'Microbiome-Driven GABA Support for Mental Relaxation',
          gutBrainConnectionAr: 'الأطعمة المخمرة والألياف الطبيعية تُغذي بكتيريا الأمعاء الصديقة (مثل اللاكتوباسيلوس). تنتج هذه البكتيريا حمض الغاما-أمينوبيوتيريك (GABA) الذي ينتقل تأثيره المهدئ عبر العصب الحائر ليقلل من فرط نشاط اللوزة الدماغية (مركز الخوف والتوتر).',
          gutBrainConnectionEn: 'Fermented foods and prebiotic fibers nourish beneficial gut strains like Lactobacillus that help stimulate GABA pathways, reducing hyperactivity in the amygdala via the vagus nerve.',
          practicalTipAr: 'واصل تناول وجباتك في بيئة هادئة وببطء؛ فالمضغ الهادئ يزيد من إفراز إنزيمات الهضم ويضاعف امتصاص العناصر المهدئة للأعصاب.',
          practicalTipEn: 'Continue enjoying meals in a peaceful setting; mindful slow chewing boosts digestive enzymes and optimizes neuro-supportive nutrient absorption.'
        };
      }
      return {
        titleAr: 'تهدئة العصب الحائر وإعادة التوازن بعد الوجبة',
        titleEn: 'Vagus Nerve Soothing & Post-Meal Rebalancing',
        gutBrainConnectionAr: 'عندما نكون متوترين، يقوم الجهاز العصبي الودي بسحب تدفق الدم بعيداً عن المعدة والأمعاء نحو الأطراف، مما قد يسبب عسر هضم أو ثقلاً حتى مع وجبات عادية.',
        gutBrainConnectionEn: 'Under tension, sympathetic activation redirects blood flow away from the gut towards peripheral muscles, potentially causing slow transit or heaviness even with standard foods.',
        practicalTipAr: 'ضع يدك على بطنك وخذ ٣ أنفاس بطنية عميقة، وتجنب شرب الماء المثلج مباشرة بعد الوجبة، واستبدله برشفات ماء فاتر مهدئ.',
        practicalTipEn: 'Place your hand over your abdomen, take 3 deep diaphragmatic breaths, and avoid iced water immediately after eating; prefer soothing warm sips.'
      };
    }

    if (mood === 'sluggish' || mood === 'bloated' || comfort === 'heavy') {
      if (hasFriedOrFast || comfort === 'heavy') {
        return {
          titleAr: 'تأثير الإجهاد الهضمي على ضبابية الدماغ (Brain Fog)',
          titleEn: 'Digestive Load & Postprandial Brain Fog Connection',
          gutBrainConnectionAr: 'الوجبات الغنية بالدهون المهدرجة أو المقليات تستهلك طاقة أيضية هائلة وتستدعي كميات كبيرة من الدم لتفكيك الدهون، كما تطلق بروتينات التهابية خفيفة ترسل إشارات إجهاد للدماغ، مما يسبب الإحساس بالثقل والرغبة في النوم.',
          gutBrainConnectionEn: 'Heavily fried or dense meals demand massive metabolic resources and blood redirection for lipid breakdown, releasing mild inflammatory markers that register as sluggishness and cognitive fatigue in the central nervous system.',
          practicalTipAr: 'قم بالمشي البطيء اللطيف في المنزل أو الهواء الطلق لمدة ٨ إلى ١٠ دقائق (دون إجهاد)، واشرب رشفات منقوع كمون دافئ مع قطرة ليمون لتسهيل حركة الغازات المعوية.',
          practicalTipEn: 'Take a gentle, slow walk for 8–10 minutes (no straining), and sip warm cumin water with a drop of lemon to alleviate gastrointestinal pressure and restore mental lightness.'
        };
      }
      return {
        titleAr: 'تخفيف ثقل الأمعاء لإعادة تنشيط التركيز الذهني',
        titleEn: 'Lightening Gut Transit to Reclaim Mental Sharpness',
        gutBrainConnectionAr: 'تحتوي أمعاؤك على أكثر من ١٠٠ مليون خلية عصبية (العقل الثاني). أي بطء في حركة القناة الهضمية يرسل تغذية راجعة حسية تثبط إفراز الدوبامين المسؤول عن الدافع واليقظة.',
        gutBrainConnectionEn: 'Your gut houses over 100 million neurons (the enteric nervous system). Slow transit sends sensory feedback dampening central dopamine pathways responsible for alertness and motivation.',
        practicalTipAr: 'اترك فاصلاً لا يقل عن ٤ ساعات قبل وجبتك التالية، واحرص على شرب كوب ماء فاتر كل ساعة لمساعدة القناة الهضمية على استعادة حيويتها.',
        practicalTipEn: 'Allow at least a 4-hour window before your next meal, and sip warm water hourly to help your digestive tract regain comfortable rhythm.'
      };
    }

    // Default for calm / energized
    return {
      titleAr: 'حالة تناغم وسيروتونين مثالية في محور الأمعاء–الدماغ',
      titleEn: 'Peak Serotonin & Vagal Harmony State',
      gutBrainConnectionAr: 'تنتج خلايا الأمعاء الصماوية أكثر من ٩٠٪ من سيروتونين الجسم بالتعاون مع الميكروبيوم الصحي. شعورك بالهدوء والنشاط بعد هذه الوجبة مؤشر واضح على توازن بكتيريا الأمعاء واستقرار كيمياء الدماغ.',
      gutBrainConnectionEn: 'Enterochromaffin cells in your gut synthesize over 90% of systemic serotonin in tandem with a healthy microbiome. Feeling calm and energized indicates balanced microbial-neuronal signaling.',
      practicalTipAr: 'احفظ مكونات هذه الوجبة في مفضلتك؛ وتناول كوب ماء نقي بعد نصف ساعة للحفاظ على ترطيب الأنسجة العصبية المعوية.',
      practicalTipEn: 'Bookmark these meal ingredients; enjoy a glass of water after 30 minutes to maintain enteric tissue hydration and sustained mood balance.'
    };
  };

  const handleSaveMealLog = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLog(true);

    const advice = generatePsychoNutritionalAdvice(
      inputMood,
      selectedIngredients,
      customIngredients,
      inputDigestiveComfort
    );

    const now = new Date();
    const timeFormattedAr = now.toLocaleDateString('ar-EG', { 
      weekday: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const timeFormattedEn = now.toLocaleDateString('en-US', { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newEntry: MealMoodLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: now.toISOString(),
      timeFormattedAr,
      timeFormattedEn,
      mealType: inputMealType,
      ingredients: selectedIngredients,
      customIngredients: customIngredients.trim(),
      mood: inputMood,
      digestiveComfort: inputDigestiveComfort,
      notes: inputNotes.trim(),
      advice
    };

    const updatedLogs = [newEntry, ...mealMoodLogs];
    setMealMoodLogs(updatedLogs);
    setLatestGeneratedAdvice(advice);
    storage.saveMoodKitchenLogs(updatedLogs);

    // Also register in general storage personal notes for continuity
    const mealTypeNameAr = inputMealType === 'breakfast' ? 'إفطار' : inputMealType === 'lunch' ? 'غداء' : inputMealType === 'dinner' ? 'عشاء' : 'وجبة خفيفة';
    storage.addNote(
      language === 'ar'
        ? `سجلت وجبة (${mealTypeNameAr}) في مطبخ المزاج: مزاجي كان «${inputMood}». نصيحة الأمعاء: ${advice.titleAr}`
        : `Logged meal (${inputMealType}) in Mood Kitchen: mood was «${inputMood}». Insight: ${advice.titleEn}`
    );

    chimeService.playReassuranceChime();
    setIsSubmittingLog(false);
  };

  const handleDeleteLog = (id: string) => {
    chimeService.playReassuranceChime();
    const filtered = mealMoodLogs.filter(log => log.id !== id);
    setMealMoodLogs(filtered);
    storage.saveMoodKitchenLogs(filtered);
  };

  const handleChefGenerate = () => {
    chimeService.playReassuranceChime();
    if (chefMood === 'stressed') {
      setChefResult({
        title: language === 'ar' ? 'مشروب البابونج الدافئ مع قطرات العسل والليمون' : 'Warm Chamomile with Honey & Lemon Drops',
        desc: language === 'ar' ? 'يساعد على تهدئة الجهاز العصبي الودي وتخفيف التوتر العضلي البسيط.' : 'Helps calm the sympathetic nervous system and ease mild muscle tension.',
        tip: language === 'ar' ? 'اشربه ببطء في مكان هادئ مع تنفس عميق لمدة ٥ دقائق.' : 'Sip slowly in a quiet place with deep breathing for 5 minutes.'
      });
    } else if (chefMood === 'tired') {
      setChefResult({
        title: language === 'ar' ? 'طبق فول بلدي أصيل بزيت الزيتون والكمون' : 'Classic Baladi Ful with Olive Oil & Cumin',
        desc: language === 'ar' ? 'يمنح طاقة مستدامة وثباتاً في سكر الدم لدعم النشاط والتركيز الذهني.' : 'Provides sustainable energy and stable blood sugar to support focus and alertness.',
        tip: language === 'ar' ? 'تناوله كوجبة إفطار أو غداء خفيفة ومغذية.' : 'Enjoy as a light, nourishing breakfast or lunch.'
      });
    } else if (chefMood === 'scattered') {
      setChefResult({
        title: language === 'ar' ? 'طبق زبادي طازج ببذور الكتان المطحونة' : 'Fresh Yogurt Bowl with Ground Flaxseeds',
        desc: language === 'ar' ? 'يغذي ميكروبيوم الأمعاء الذي يدعم بدوره الاتزان العصبي وصفاء الأفكار.' : 'Nourishes the gut microbiome which in turn supports neural balance and clarity.',
        tip: language === 'ar' ? 'قلب المكونات بلطف واستمتع بكل ملعقة بوعي.' : 'Stir gently and enjoy each spoonful mindfully.'
      });
    } else {
      setChefResult({
        title: language === 'ar' ? 'الحليب الذهبي بالكركم والـقرفة الدافئة' : 'Golden Turmeric & Cinnamon Warm Milk',
        desc: language === 'ar' ? 'طقس مسائي هادئ يمنح شعوراً بالدفء والاحتواء.' : 'A calming evening ritual offering warmth and comfort.',
        tip: language === 'ar' ? 'تناوله قبل النوم لتصفية الذهن والاستعداد لراحة عميقة.' : 'Have it before bed to clear the mind for deep rest.'
      });
    }
  };

  const filteredRecipes = selectedCategory === 'all' 
    ? RECIPES 
    : RECIPES.filter(r => r.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#F7F3E9] dark:bg-[#14271F] dark:border-[#A9C5A0]/20 dark:text-[#F7F3E9] border border-[#E6E8D8] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E6E8D8]/70 dark:border-[#1F3A2E] bg-white/50 dark:bg-[#1A3328]/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-inner">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  {language === 'ar' ? 'وحدة بحثية متجددة' : 'Research & Wellness Unit'}
                </span>
                <span className="text-[11px] text-[#52645B] dark:text-[#A9C5A0]">
                  {language === 'ar' ? 'محور الأمعاء–الدماغ' : 'Gut-Brain Axis'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#174C3C] dark:text-emerald-300 mt-0.5">
                {language === 'ar' ? 'مطبخ المزاج — غذاء يدعم أمعاءك وعافيتك النفسية' : 'Mood Kitchen — Food Supporting Your Gut & Mental Wellness'}
              </h2>
              <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]/80 italic mt-0.5">
                {language === 'ar' ? '«سجّل وجباتك، وافهم أثر الغذاء على جهازك العصبي، بلا وعود علاجية زائفة»' : '«Log meals, uncover food-nervous system connections, without false medical promises»'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => { chimeService.playReassuranceChime(); onClose(); }}
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-[#26332D] dark:text-white transition-colors"
            aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 p-4 bg-[#EFECE4] dark:bg-[#102018] border-b border-[#E6E8D8] dark:border-[#1F3A2E] no-scrollbar">
          {/* TAB: Meal & Mood Log (The Requested Feature) */}
          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('log'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'log'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'سجل وجبتي ومزاجي' : 'Meal & Mood Log'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-black">
              {language === 'ar' ? 'جديد' : 'NEW'}
            </span>
          </button>

          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('recipes'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'recipes'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <Utensils className="w-4 h-4" />
            {language === 'ar' ? 'مكتبة الوصفات' : 'Recipes'}
          </button>

          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('chef'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'chef'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            {language === 'ar' ? 'شيف المزاج' : 'Mood Chef'}
          </button>

          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('quiz'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <Activity className="w-4 h-4" />
            {language === 'ar' ? 'اختبار التناغم' : 'Synergy Quiz'}
          </button>
          
          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('science'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'science'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {language === 'ar' ? 'العلم والأمعاء' : 'Gut Science'}
          </button>

          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('myths'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'myths'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {language === 'ar' ? 'خرافات وحقائق' : 'Myths'}
          </button>

          <button
            onClick={() => { chimeService.playReassuranceChime(); setActiveTab('shopping'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'shopping'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {language === 'ar' ? 'المشتريات' : 'Shopping'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB: MEAL & MOOD LOG (The User's Requested Feature) */}
          {activeTab === 'log' && (
            <div className="space-y-6">
              
              {/* Introduction Banner */}
              <div className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#174C3C] dark:text-emerald-300">
                        {language === 'ar' ? 'سجل مكونات وجبتك ومزاجك اليومي' : 'Log Your Meal & Mood Tracker'}
                      </h3>
                      <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]">
                        {language === 'ar' 
                          ? 'سجّل ما أكلت وكيف تشعر الآن، وسنحلل لك فوراً الرابط العصبي بين جهازك الهضمي ومزاجك ونقدم نصيحة فورية مخصصة'
                          : 'Log what you ate and how you feel; we instantly reveal the neural gut-brain link and generate psycho-nutritional advice.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Log Form */}
              <form onSubmit={handleSaveMealLog} className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* 1. Meal Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#174C3C] dark:text-emerald-300 block">
                    {language === 'ar' ? '١. نوع الوجبة:' : '1. Meal Type:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'breakfast', ar: '🌅 إفطار', en: 'Breakfast' },
                      { id: 'lunch', ar: '☀️ غداء', en: 'Lunch' },
                      { id: 'dinner', ar: '🌙 عشاء', en: 'Dinner' },
                      { id: 'snack', ar: '🍎 وجبة خفيفة / سناك', en: 'Snack' }
                    ].map(type => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => { chimeService.playReassuranceChime(); setInputMealType(type.id as any); }}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          inputMealType === type.id
                            ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm dark:bg-emerald-600'
                            : 'bg-[#F7F3E9] dark:bg-[#102018] text-[#26332D] dark:text-[#F7F3E9] border-[#E6E8D8] dark:border-[#1F3A2E] hover:border-emerald-500'
                        }`}
                      >
                        {language === 'ar' ? type.ar : type.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Ingredients Quick Select & Free Text */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#174C3C] dark:text-emerald-300 block">
                    {language === 'ar' ? '٢. حدد مكونات الوجبة (انقر لاختيار ما تناولته):' : '2. Select Meal Ingredients (Tap what you ate):'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_INGREDIENT_OPTIONS.map(opt => {
                      const isSelected = selectedIngredients.includes(opt.ar);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => toggleIngredientSelection(opt.ar)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-[#F7F3E9] dark:bg-[#102018] text-[#26332D] dark:text-[#F7F3E9] border-[#E6E8D8] dark:border-[#1F3A2E] hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{language === 'ar' ? opt.ar : opt.en}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <input
                      type="text"
                      value={customIngredients}
                      onChange={(e) => setCustomIngredients(e.target.value)}
                      placeholder={language === 'ar' ? 'أو اكتب مكونات أخرى بالتفصيل (مثال: بيض مسلوق، عيش بلدي، شاي أخضر...)' : 'Or type other ingredients (e.g. boiled eggs, pita bread, green tea...)'}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F7F3E9] dark:bg-[#102018] border border-[#E6E8D8] dark:border-[#1F3A2E] text-xs text-[#26332D] dark:text-[#F7F3E9] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 3. Mood State Associated with the Meal */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#174C3C] dark:text-emerald-300 block">
                    {language === 'ar' ? '٣. كيف تصف مزاجك وحالتك النفسية الحالية بعد أو أثناء الوجبة؟' : '3. Current Mood & Emotional State during/after meal:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'calm', icon: '🌿', ar: 'هدوء وراحة ذهنية', en: 'Calm & Grounded' },
                      { id: 'tense', icon: '⚡', ar: 'توتر أو تسارع أفكار', en: 'Tense or Racing Thoughts' },
                      { id: 'sluggish', icon: '💤', ar: 'خمول وثقل (ضباب دماغي)', en: 'Sluggish / Brain Fog' },
                      { id: 'moody', icon: '🌊', ar: 'تقلب مزاج وعصبية', en: 'Moody / Irritable' },
                      { id: 'energized', icon: '✨', ar: 'طاقة ونشاط متزن', en: 'Balanced Energy' },
                      { id: 'bloated', icon: '🎈', ar: 'انتفاخ وانزعاج هضمي', en: 'Bloated / Gut Distress' }
                    ].map(m => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => { chimeService.playReassuranceChime(); setInputMood(m.id as any); }}
                        className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                          inputMood === m.id
                            ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-md dark:bg-emerald-600'
                            : 'bg-[#F7F3E9] dark:bg-[#102018] text-[#26332D] dark:text-[#F7F3E9] border-[#E6E8D8] dark:border-[#1F3A2E] hover:border-emerald-500'
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-xs font-bold leading-tight">{language === 'ar' ? m.ar : m.en}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Digestive Comfort */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#174C3C] dark:text-emerald-300 block">
                    {language === 'ar' ? '٤. درجة الراحة الهضمية:' : '4. Digestive Comfort:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'light', ar: 'خفيف ومريح جداً 🟢', en: 'Very Light & Easy' },
                      { id: 'moderate', ar: 'معتدل وطبيعي 🟡', en: 'Moderate & Fine' },
                      { id: 'heavy', ar: 'ثقيل ومجهد للمعدة 🔴', en: 'Heavy & Taxing' }
                    ].map(c => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => { chimeService.playReassuranceChime(); setInputDigestiveComfort(c.id as any); }}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          inputDigestiveComfort === c.id
                            ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm dark:bg-emerald-600'
                            : 'bg-[#F7F3E9] dark:bg-[#102018] text-[#26332D] dark:text-[#F7F3E9] border-[#E6E8D8] dark:border-[#1F3A2E]'
                        }`}
                      >
                        {language === 'ar' ? c.ar : c.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#174C3C] dark:text-emerald-300 block">
                    {language === 'ar' ? '٥. ملاحظات إضافية (اختياري، مثلاً: أكلت بسرعة، أثناء العمل، إلخ):' : '5. Additional Context (Optional, e.g. ate in a rush):'}
                  </label>
                  <input
                    type="text"
                    value={inputNotes}
                    onChange={(e) => setInputNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: تناولت الوجبة وأنا مشغول بالموبايل، أو بعد يوم عمل متعب...' : 'e.g. ate quickly while answering emails...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7F3E9] dark:bg-[#102018] border border-[#E6E8D8] dark:border-[#1F3A2E] text-xs text-[#26332D] dark:text-[#F7F3E9] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLog || (selectedIngredients.length === 0 && !customIngredients.trim())}
                    className="px-6 py-3.5 rounded-2xl bg-[#174C3C] hover:bg-[#123b2f] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تحليل العلاقة وإصدار النصيحة الغذائية النفسية الفورية' : 'Analyze & Generate Instant Psycho-Nutritional Advice'}</span>
                  </button>
                </div>
              </form>

              {/* LATEST GENERATED ADVICE HIGHLIGHT BOX */}
              {latestGeneratedAdvice && (
                <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 shadow-md space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                          {language === 'ar' ? 'نصيحة غذائية نفسية فورية مخصصة' : 'Instant Psycho-Nutritional Advice'}
                        </span>
                        <h4 className="text-base font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
                          {language === 'ar' ? latestGeneratedAdvice.titleAr : latestGeneratedAdvice.titleEn}
                        </h4>
                      </div>
                    </div>

                    <TextAudioPlayer
                      text={language === 'ar'
                        ? `${latestGeneratedAdvice.titleAr}. الرابط العصبي المعوي: ${latestGeneratedAdvice.gutBrainConnectionAr}. النصيحة الفورية: ${latestGeneratedAdvice.practicalTipAr}`
                        : `${latestGeneratedAdvice.titleEn}. Gut-Brain mechanism: ${latestGeneratedAdvice.gutBrainConnectionEn}. Immediate tip: ${latestGeneratedAdvice.practicalTipEn}`}
                      id="latest_advice_tts"
                      variant="compact"
                      label={language === 'ar' ? 'استمع للنصيحة' : 'Listen'}
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="p-4 rounded-2xl bg-white/90 dark:bg-black/30 border border-emerald-100 dark:border-emerald-900/60 text-xs leading-relaxed text-[#26332D] dark:text-emerald-100 space-y-1.5">
                      <strong className="block text-emerald-900 dark:text-emerald-200 font-bold">
                        {language === 'ar' ? '🔬 الرابط العلمي بمحور الأمعاء–الدماغ (Gut-Brain Axis):' : '🔬 Gut-Brain Axis Scientific Mechanism:'}
                      </strong>
                      <p>
                        {language === 'ar' ? latestGeneratedAdvice.gutBrainConnectionAr : latestGeneratedAdvice.gutBrainConnectionEn}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-xs leading-relaxed text-emerald-950 dark:text-emerald-100">
                      <strong className="block text-emerald-900 dark:text-emerald-200 font-bold mb-1">
                        {language === 'ar' ? '💡 الخطوة النفسية الغذائية الفورية المقترحة الآن:' : '💡 Immediate Recommended Step:'}
                      </strong>
                      <p>
                        {language === 'ar' ? latestGeneratedAdvice.practicalTipAr : latestGeneratedAdvice.practicalTipEn}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAST LOGS HISTORY */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#174C3C] dark:text-emerald-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{language === 'ar' ? `سجل وجباتك ومزاجك السابقة (${mealMoodLogs.length})` : `Your Logged Meals & Moods (${mealMoodLogs.length})`}</span>
                  </h3>
                </div>

                {mealMoodLogs.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-[#1A3328] rounded-3xl border border-[#E6E8D8] dark:border-[#1F3A2E] text-xs text-[#52645B] dark:text-[#A9C5A0]">
                    {language === 'ar' ? 'لم تقم بتسجيل أي وجبة بعد. ابدأ بتسجيل وجبتك الأولى أعلاه!' : 'No logged meals yet. Start by logging your first meal above!'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mealMoodLogs.map(log => (
                      <div 
                        key={log.id} 
                        className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-5 shadow-sm space-y-3.5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-[#E6E8D8]/70 dark:border-[#1F3A2E] pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                              {log.mealType === 'breakfast' ? (language === 'ar' ? 'إفطار' : 'Breakfast') :
                               log.mealType === 'lunch' ? (language === 'ar' ? 'غداء' : 'Lunch') :
                               log.mealType === 'dinner' ? (language === 'ar' ? 'عشاء' : 'Dinner') : (language === 'ar' ? 'وجبة خفيفة' : 'Snack')}
                            </span>
                            <span className="text-[11px] text-[#52645B] dark:text-[#A9C5A0]">
                              {language === 'ar' ? log.timeFormattedAr : log.timeFormattedEn}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#F7F3E9] dark:bg-[#102018] border border-[#E6E8D8] dark:border-[#1F3A2E] text-[#174C3C] dark:text-emerald-300">
                              {log.mood === 'calm' ? (language === 'ar' ? '🌿 هدوء' : '🌿 Calm') :
                               log.mood === 'tense' ? (language === 'ar' ? '⚡ توتر' : '⚡ Tense') :
                               log.mood === 'sluggish' ? (language === 'ar' ? '💤 خمول' : '💤 Sluggish') :
                               log.mood === 'moody' ? (language === 'ar' ? '🌊 تقلب' : '🌊 Moody') :
                               log.mood === 'energized' ? (language === 'ar' ? '✨ نشاط' : '✨ Energized') : (language === 'ar' ? '🎈 انتفاخ' : '🎈 Bloated')}
                            </span>

                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title={language === 'ar' ? 'حذف من السجل' : 'Delete log'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="text-xs text-[#26332D] dark:text-[#F7F3E9] flex flex-wrap gap-1.5 items-center">
                          <span className="font-bold text-[#174C3C] dark:text-emerald-300">
                            {language === 'ar' ? 'المكونات:' : 'Ingredients:'}
                          </span>
                          {log.ingredients.map((ing, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px]">
                              {ing}
                            </span>
                          ))}
                          {log.customIngredients && (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px]">
                              {log.customIngredients}
                            </span>
                          )}
                        </div>

                        {/* Digestive comfort & notes */}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#52645B] dark:text-[#A9C5A0]">
                          <span>
                            <strong>{language === 'ar' ? 'الراحة الهضمية: ' : 'Digestive comfort: '}</strong>
                            {log.digestiveComfort === 'light' ? (language === 'ar' ? 'خفيف ومريح' : 'Light') :
                             log.digestiveComfort === 'moderate' ? (language === 'ar' ? 'معتدل' : 'Moderate') : (language === 'ar' ? 'ثقيل' : 'Heavy')}
                          </span>
                          {log.notes && (
                            <span>
                              <strong>{language === 'ar' ? 'ملاحظة: ' : 'Note: '}</strong>
                              {log.notes}
                            </span>
                          )}
                        </div>

                        {/* Saved Advice */}
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              {language === 'ar' ? log.advice.titleAr : log.advice.titleEn}
                            </strong>
                            <TextAudioPlayer
                              text={language === 'ar' 
                                ? `${log.advice.titleAr}. ${log.advice.gutBrainConnectionAr} النصيحة: ${log.advice.practicalTipAr}`
                                : `${log.advice.titleEn}. ${log.advice.gutBrainConnectionEn} Tip: ${log.advice.practicalTipEn}`}
                              id={`log_tts_${log.id}`}
                              variant="compact"
                              label={language === 'ar' ? 'استمع' : 'Audio'}
                            />
                          </div>
                          <p className="text-[#26332D]/90 dark:text-[#F7F3E9]/90 text-[11px] leading-relaxed">
                            {language === 'ar' ? log.advice.gutBrainConnectionAr : log.advice.gutBrainConnectionEn}
                          </p>
                          <div className="p-2 rounded-xl bg-white/70 dark:bg-black/20 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                            {language === 'ar' ? `💡 ${log.advice.practicalTipAr}` : `💡 ${log.advice.practicalTipEn}`}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Audio Player for Unit Introduction */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {language === 'ar' ? 'مقدمة صوتية في علاقة الغذاء بالمزاج' : 'Audio Intro on Food & Mood'}
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {language === 'ar' ? 'استمع إلى نبذة علمية حول كيف تدعم أمعاؤك عافيتك النفسية بهدوء.' : 'Listen to a scientific overview on supporting mental wellness through gut health.'}
                </p>
              </div>
            </div>
            <TextAudioPlayer 
              text={language === 'ar' 
                ? 'مرحباً بك في مطبخ المزاج. نحن نؤمن أن الخطوات الصغيرة في الغذاء، مثل تناول الأطعمة المخمرة الغنية بالبروبيوتيك والألياف، تدعم صحة الأمعاء وعلاقتها العصبية بالدماغ عبر العصب الحائر، بلا ادعاءات علاجية زائفة، بل بدعم يومي مستدام.'
                : 'Welcome to Mood Kitchen. Small steps in nutrition like probiotic fermented foods and fibers support gut health and its neural connection to the brain via the vagus nerve.'
              }
              id="mood_kitchen_intro"
              variant="compact"
              label={language === 'ar' ? 'استمع للمقدمة' : 'Listen Intro'}
            />
          </div>

          {/* TAB 1: RECIPES */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', labelAr: 'جميع الوصفات', labelEn: 'All Recipes' },
                  { id: 'fermented', labelAr: 'أطعمة مخمرة', labelEn: 'Fermented' },
                  { id: 'prebiotic', labelAr: 'ألياف بريبيوتيك', labelEn: 'Prebiotics' },
                  { id: 'herbs', labelAr: 'أعشاب مهدئة', labelEn: 'Herbal Teas' },
                  { id: 'elixirs', labelAr: 'مشروبات ذهبية', labelEn: 'Golden Elixirs' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { chimeService.playReassuranceChime(); setSelectedCategory(cat.id); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#174C3C] text-white dark:bg-emerald-600'
                        : 'bg-white dark:bg-[#1A3328] text-[#52645B] dark:text-[#A9C5A0] border border-[#E6E8D8] dark:border-[#1F3A2E]'
                    }`}
                  >
                    {language === 'ar' ? cat.labelAr : cat.labelEn}
                  </button>
                ))}
              </div>

              {/* Recipe Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map(recipe => {
                  const isSaved = savedRecipes.includes(recipe.id);
                  const isTried = triedRecipes.includes(recipe.id);

                  return (
                    <div 
                      key={recipe.id}
                      className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                            {language === 'ar' ? recipe.categoryLabelAr : recipe.categoryLabelEn}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleSave(recipe.id)}
                              className={`p-2 rounded-xl transition-colors ${isSaved ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' : 'text-[#52645B] hover:bg-gray-100 dark:hover:bg-white/10'}`}
                              title={language === 'ar' ? 'حفظ الوصفة' : 'Save recipe'}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-[#174C3C] dark:text-emerald-300 mb-2">
                          {language === 'ar' ? recipe.titleAr : recipe.titleEn}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-[#52645B] dark:text-[#A9C5A0] mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {language === 'ar' ? recipe.prepTimeAr : recipe.prepTimeEn}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {language === 'ar' ? recipe.availabilityAr : recipe.availabilityEn}
                          </span>
                        </div>

                        <p className="text-xs text-[#26332D]/80 dark:text-[#F7F3E9]/80 line-clamp-2 mb-4">
                          {language === 'ar' ? recipe.scienceNoteAr : recipe.scienceNoteEn}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E6E8D8] dark:border-[#1F3A2E] flex items-center justify-between">
                        <button
                          onClick={() => { chimeService.playReassuranceChime(); setActiveRecipeDetail(recipe); }}
                          className="text-xs font-bold text-[#174C3C] dark:text-emerald-300 hover:underline flex items-center gap-1"
                        >
                          {language === 'ar' ? 'عرض الوصفة والخطوات' : 'View Recipe & Steps'}
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => markAsTried(recipe)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isTried 
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' 
                              : 'bg-[#174C3C]/10 dark:bg-emerald-900/30 text-[#174C3C] dark:text-emerald-300 hover:bg-[#174C3C]/20'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {isTried 
                            ? (language === 'ar' ? 'تم التجربة' : 'Tried') 
                            : (language === 'ar' ? 'أنا جربتها اليوم' : 'I Tried This')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE MOOD CHEF */}
          {activeTab === 'chef' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#174C3C] dark:text-emerald-300">
                      {language === 'ar' ? 'شيف المزاج الذكي (اختر شعورك الآن)' : 'Smart Mood Chef (Select Your Mood)'}
                    </h3>
                    <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]">
                      {language === 'ar' ? 'دعنا نقترح عليك الوصفة الأنسب لحالتك المزاجية والجسدية الراهنة' : 'Let us suggest the ideal recipe for your current mood and physical state'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'stressed', ar: 'متوتر ومشدود', en: 'Stressed & Tense', icon: '⚡' },
                    { id: 'tired', ar: 'متعب وبحاجة لطاقة', en: 'Tired & Low Energy', icon: '🔋' },
                    { id: 'scattered', ar: 'مشتت الأفكار', en: 'Scattered Mind', icon: '🌀' },
                    { id: 'calm', ar: 'أبحث عن هدوء مسائي', en: 'Seeking Evening Calm', icon: '🌙' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => { chimeService.playReassuranceChime(); setChefMood(m.id as any); }}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                        chefMood === m.id
                          ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-md dark:bg-emerald-600'
                          : 'bg-[#F7F3E9] dark:bg-[#102018] text-[#26332D] dark:text-[#F7F3E9] border-[#E6E8D8] dark:border-[#1F3A2E] hover:border-emerald-500'
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-xs font-bold">{language === 'ar' ? m.ar : m.en}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleChefGenerate}
                    className="px-6 py-3 rounded-2xl bg-[#174C3C] hover:bg-[#123b2f] dark:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    {language === 'ar' ? 'اكتشف الوصفة المناسبة لحالتي' : 'Discover Ideal Recipe'}
                  </button>
                </div>

                {chefResult && (
                  <div className="mt-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-extrabold text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      {chefResult.title}
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      {chefResult.desc}
                    </p>
                    <div className="p-3 rounded-xl bg-white/80 dark:bg-black/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-[#26332D] dark:text-emerald-100">
                      <strong>{language === 'ar' ? 'نصيحة تطبيقية هادئة: ' : 'Practical Tip: '}</strong>
                      {chefResult.tip}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#174C3C] dark:text-emerald-300">
                      {language === 'ar' ? 'اختبار التناغم العصبي الهضمي السريع' : 'Quick Gut-Brain Synergy Assessment'}
                    </h3>
                    <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]">
                      {language === 'ar' ? 'تعرف على مدى دعم عاداتك اليومية لمحور الأمعاء–الدماغ' : 'Discover how well your daily habits support the gut-brain axis'}
                    </p>
                  </div>
                </div>

                {!quizCompleted ? (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {language === 'ar' ? `السؤال ${quizStep} من ٢` : `Question ${quizStep} of 2`}
                    </div>

                    {quizStep === 1 && (
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-[#26332D] dark:text-[#F7F3E9]">
                          {language === 'ar' 
                            ? 'كم مرة تتناول أطعمة غنية بالألياف الطبيعية أو الأطعمة المخمرة (مثل الزبادي البلدي، الفول، البقوليات) خلال الأسبوع؟' 
                            : 'How often do you consume fiber-rich or fermented foods (local yogurt, fava beans, legumes) during the week?'}
                        </p>
                        <div className="space-y-2">
                          {[
                            { score: 10, ar: 'بانتظام يومياً كجزء من روتيني', en: 'Regularly daily as part of my routine' },
                            { score: 7, ar: 'أحياناً عدة مرات في الأسبوع', en: 'Sometimes several times a week' },
                            { score: 4, ar: 'نادراً أو حسب الصدفة', en: 'Rarely or by chance' }
                          ].map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                chimeService.playReassuranceChime();
                                setQuizScore(s => s + opt.score);
                                setQuizStep(2);
                              }}
                              className="w-full text-right p-3.5 rounded-2xl bg-[#F7F3E9] dark:bg-[#102018] border border-[#E6E8D8] dark:border-[#1F3A2E] text-xs font-medium text-[#26332D] dark:text-[#F7F3E9] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between"
                            >
                              <span>{language === 'ar' ? opt.ar : opt.en}</span>
                              <ChevronRight className="w-4 h-4 text-emerald-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {quizStep === 2 && (
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-[#26332D] dark:text-[#F7F3E9]">
                          {language === 'ar' 
                            ? 'عند تناول وجباتك، هل تحاول الأكل ببطء ومضغ الطعام بعناية مع أخذ أنفاس هادئة؟' 
                            : 'When eating, do you try to eat slowly and chew carefully with calm breaths?'}
                        </p>
                        <div className="space-y-2">
                          {[
                            { score: 10, ar: 'نعم، أحرص على تناول الطعام بوعي وهدوء', en: 'Yes, I strive for mindful, calm eating' },
                            { score: 6, ar: 'أحياناً عندما أكون غير مستعجل', en: 'Sometimes when not rushed' },
                            { score: 3, ar: 'نادراً، غالباً أتناول وجباتي بسرعة', en: 'Rarely, I usually eat quickly' }
                          ].map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                chimeService.playReassuranceChime();
                                setQuizScore(s => s + opt.score);
                                setQuizCompleted(true);
                              }}
                              className="w-full text-right p-3.5 rounded-2xl bg-[#F7F3E9] dark:bg-[#102018] border border-[#E6E8D8] dark:border-[#1F3A2E] text-xs font-medium text-[#26332D] dark:text-[#F7F3E9] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between"
                            >
                              <span>{language === 'ar' ? opt.ar : opt.en}</span>
                              <Check className="w-4 h-4 text-emerald-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                      {language === 'ar' ? 'نتيجة تقييم التناغم العصبي الهضمي' : 'Your Synergy Assessment Result'}
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      {quizScore >= 16 
                        ? (language === 'ar' ? 'ممتاز! عاداتك الغذائية تدعم بشكل رائع صحة أمعاءك ومحورها العصبي مع الدماغ. استمر في هذه الخطوات الواعية.' : 'Excellent! Your dietary habits wonderfully support gut health and its neural axis.')
                        : (language === 'ar' ? 'بداية جيدة! يمكنك إضافة المزيد من الزبادي البلدي والألياف التدريجية لدعم راحتك النفسية والهضمية بخطوات بسيطة.' : 'Good start! You can add more local yogurt and gradual fibers to support wellness.')
                      }
                    </p>
                    <button
                      onClick={() => {
                        chimeService.playReassuranceChime();
                        setQuizStep(1);
                        setQuizScore(0);
                        setQuizCompleted(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#174C3C] text-white text-xs font-bold hover:bg-[#123b2f] transition-all"
                    >
                      {language === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SCIENCE */}
          {activeTab === 'science' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#174C3C] dark:text-emerald-300">
                      {language === 'ar' ? 'ما هو محور الأمعاء–الدماغ؟ (Gut-Brain Axis)' : 'What is the Gut-Brain Axis?'}
                    </h3>
                    <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]">
                      {language === 'ar' ? 'الارتباط العلمي بين ميكروبيوم الأمعاء والصحة النفسية' : 'The scientific link between gut microbiome and mental health'}
                    </p>
                  </div>
                </div>

                <div className="text-xs leading-relaxed text-[#26332D]/90 dark:text-[#F7F3E9]/90 space-y-3">
                  <p>
                    {language === 'ar'
                      ? 'ترتبط الأمعاء والدماغ ببعضهما ارتباطاً وثيقاً عبر شبكة عصبية وهرمونية ضخمة تُعرف باسم «محور الأمعاء–الدماغ» (Gut-Brain Axis). يلعب العصب الحائر (Vagus Nerve) دوراً رئيسياً في نقل الإشارات من أمعائك إلى دماغك والعكس.'
                      : 'The gut and brain are closely connected via a vast neural and hormonal network known as the Gut-Brain Axis. The vagus nerve plays a major role in transmitting signals from your gut to your brain and vice versa.'
                    }
                  </p>
                  <p>
                    {language === 'ar'
                      ? 'ميكروبيوم الأمعاء (البكتيريا النافعة الساكنة في جهازك الهضمي) لا يساعد فقط في هضم الطعام، بل ينتج ناقلات عصبية وأحماضاً دهنية قصيرة السلسلة (مثل البيوتيرات) تؤثر بشكل مباشر على تقليل الالتهابات العصبية ودعم المزاج اليومي.'
                      : 'The gut microbiome (beneficial bacteria residing in your digestive tract) not only aids digestion, but produces neurotransmitters and short-chain fatty acids (like butyrate) directly influencing neuro-inflammation reduction and daily mood.'
                    }
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-1">
                      {language === 'ar' ? 'إخلاء المسؤولية العلمية والطبية الصارمة:' : 'Strict Scientific & Medical Disclaimer:'}
                    </strong>
                    {language === 'ar'
                      ? 'هذه المعلومات تهدف إلى التوعية الغذائية ودعم نمط الحياة الصحي. لا توجد وصفة طعام أو ميكروبيوم تعالج وحدها الاكتئاب السريري أو اضطرابات القلق الحادة. استشر دائماً الطبيب النفسي أو أخصائي الرعاية الصحية عند الحاجة.'
                      : 'This information aims at nutritional education and healthy lifestyle support. No food recipe or microbiome alone cures clinical depression or severe anxiety. Always consult a psychiatrist or healthcare professional when needed.'
                    }
                  </div>
                </div>

                <TextAudioPlayer 
                  text={language === 'ar'
                    ? 'محور الأمعاء والدماغ هو شبكة اتصال ثنائية الاتجاه بين الجهاز الهضمي والجهاز العصبي المركزي. تناول الأطعمة الغنية بالألياف والأطعمة المخمرة يغذي بكتيريا الأمعاء المفيدة التي تنتج أحماضاً داعمة لصحة الأعصاب المزاجية.'
                    : 'The gut-brain axis is a bidirectional communication network between the digestive tract and the central nervous system. Eating fiber-rich and fermented foods nourishes beneficial gut bacteria that produce acids supporting mood nerve health.'
                  }
                  id="science_explanation"
                  label={language === 'ar' ? 'استمع لشرح محور الأمعاء والدماغ' : 'Listen to Science Explanation'}
                />
              </div>
            </div>
          )}

          {/* TAB 5: MYTHS */}
          {activeTab === 'myths' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#174C3C] dark:text-emerald-300">
                {language === 'ar' ? 'خرافات شائعة وحقائق علمية دقيقة' : 'Common Myths & Scientific Facts'}
              </h3>
              
              <div className="space-y-4">
                {MYTHS.map(item => (
                  <div key={item.id} className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-5 shadow-sm space-y-3">
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200 text-xs font-semibold">
                      {language === 'ar' ? item.mythAr : item.mythEn}
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 text-xs">
                      <strong className="block font-bold mb-1">
                        {language === 'ar' ? 'الحقيقة العلمية الدقيقة:' : 'Precise Scientific Fact:'}
                      </strong>
                      {language === 'ar' ? item.factAr : item.factEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SHOPPING LIST */}
          {activeTab === 'shopping' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#1A3328] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#174C3C] dark:text-emerald-300">
                      {language === 'ar' ? 'قائمة المشتريات المنزلية الاقتصادية في مصر' : 'Economical Home Shopping List in Egypt'}
                    </h3>
                    <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]">
                      {language === 'ar' ? 'مكونات بسيطة متوفرة في كل سوق محلي وبقالة' : 'Simple ingredients available in every local market'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { ar: 'زبادي بلدي طازج (خمائر حية)', en: 'Fresh local yogurt (live cultures)' },
                    { ar: 'فول مدمس بلدي', en: 'Baladi fava beans' },
                    { ar: 'عدس أصفر وجبات دافئة', en: 'Yellow lentils' },
                    { ar: 'بذور كتان أو سمسم', en: 'Flaxseeds or sesame' },
                    { ar: 'ثوم وبصل طازج', en: 'Fresh garlic and onions' },
                    { ar: 'زيت زيتون بكر ممتاز', en: 'Extra virgin olive oil' },
                    { ar: 'أعشاب البابونج والنعناع', en: 'Chamomile and mint herbs' },
                    { ar: 'كركم نقي وقرفة', en: 'Pure turmeric and cinnamon' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F3E9] dark:bg-[#102018] border border-[#E6E8D8] dark:border-[#1F3A2E]">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-medium text-[#26332D] dark:text-[#F7F3E9]">
                        {language === 'ar' ? item.ar : item.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Recipe Detail Modal / Overlay if selected */}
        {activeRecipeDetail && (
          <div className="absolute inset-0 z-25 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#14271F] border border-[#E6E8D8] dark:border-[#1F3A2E] rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 text-right">
              <div className="flex items-center justify-between border-b pb-3 border-[#E6E8D8] dark:border-[#1F3A2E]">
                <h3 className="text-lg font-extrabold text-[#174C3C] dark:text-emerald-300">
                  {language === 'ar' ? activeRecipeDetail.titleAr : activeRecipeDetail.titleEn}
                </h3>
                <button 
                  onClick={() => { chimeService.playReassuranceChime(); setActiveRecipeDetail(null); }}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Audio player for recipe */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <TextAudioPlayer 
                  text={language === 'ar'
                    ? `${activeRecipeDetail.titleAr}. المكونات: ${activeRecipeDetail.ingredientsAr.join('، ')}. خطوات التحضير: ${activeRecipeDetail.stepsAr.join(' ')}. الفائدة العلمية: ${activeRecipeDetail.scienceNoteAr}`
                    : `${activeRecipeDetail.titleEn}. Ingredients: ${activeRecipeDetail.ingredientsEn.join(', ')}. Steps: ${activeRecipeDetail.stepsEn.join(' ')}. Science note: ${activeRecipeDetail.scienceNoteEn}`
                  }
                  id={`recipe_${activeRecipeDetail.id}`}
                  label={language === 'ar' ? 'استمع للوصفة كاملة' : 'Listen to Full Recipe'}
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#174C3C] dark:text-emerald-300">
                  {language === 'ar' ? 'المكونات (متوفرة ومناسبة للميزانية المصرية):' : 'Ingredients (Economical & Available):'}
                </h4>
                <ul className="list-disc list-inside text-xs space-y-1 text-[#26332D]/90 dark:text-[#F7F3E9]/90">
                  {(language === 'ar' ? activeRecipeDetail.ingredientsAr : activeRecipeDetail.ingredientsEn).map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#174C3C] dark:text-emerald-300">
                  {language === 'ar' ? 'خطوات التحضير البسيطة:' : 'Simple Preparation Steps:'}
                </h4>
                <ol className="list-decimal list-inside text-xs space-y-1.5 text-[#26332D]/90 dark:text-[#F7F3E9]/90">
                  {(language === 'ar' ? activeRecipeDetail.stepsAr : activeRecipeDetail.stepsEn).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-2">
                <strong className="text-emerald-900 dark:text-emerald-200 block font-bold">
                  {language === 'ar' ? 'ملاحظة علمية ومحور الأمعاء والدماغ:' : 'Scientific Note & Gut-Brain Connection:'}
                </strong>
                <p className="text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                  {language === 'ar' ? activeRecipeDetail.scienceNoteAr : activeRecipeDetail.scienceNoteEn}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                  {language === 'ar' ? activeRecipeDetail.moodConnectionAr : activeRecipeDetail.moodConnectionEn}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => { chimeService.playReassuranceChime(); setActiveRecipeDetail(null); }}
                  className="px-5 py-2.5 rounded-2xl bg-[#174C3C] text-white text-xs font-bold hover:bg-[#123b2f] transition-all"
                >
                  {language === 'ar' ? 'إغلاق التفاصيل' : 'Close Details'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
