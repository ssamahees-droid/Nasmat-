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
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../services/storage';
import { TextAudioPlayer } from './TextAudioPlayer';

interface MoodKitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Recipe {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'fermented' | 'prebiotic' | 'fats' | 'herbs';
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

export const MoodKitchenModal: React.FC<MoodKitchenModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'recipes' | 'science' | 'myths' | 'shopping'>('recipes');
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

  if (!isOpen) return null;

  const toggleSave = (id: string) => {
    const updated = savedRecipes.includes(id) 
      ? savedRecipes.filter(i => i !== id)
      : [...savedRecipes, id];
    setSavedRecipes(updated);
    localStorage.setItem('mood_kitchen_saved', JSON.stringify(updated));
  };

  const markAsTried = (recipe: Recipe) => {
    if (!triedRecipes.includes(recipe.id)) {
      const updated = [...triedRecipes, recipe.id];
      setTriedRecipes(updated);
      localStorage.setItem('mood_kitchen_tried', JSON.stringify(updated));
      storage.addNote(language === 'ar' 
        ? `جربت اليوم وصفة من مطبخ المزاج: «${recipe.titleAr}». شعرت بالراحة والدعم الهضمي.`
        : `Tried recipe from Mood Kitchen today: «${recipe.titleEn}». Felt nourished and supported.`);
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
                  {language === 'ar' ? 'وحدة بحثية جديدة' : 'New Research Unit'}
                </span>
                <span className="text-[11px] text-[#52645B] dark:text-[#A9C5A0]">
                  {language === 'ar' ? 'محور الأمعاء–الدماغ' : 'Gut-Brain Axis'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#174C3C] dark:text-emerald-300 mt-0.5">
                {language === 'ar' ? 'مطبخ المزاج — غذاء يدعم أمعاءك وعافيتك النفسية' : 'Mood Kitchen — Food Supporting Your Gut & Mental Wellness'}
              </h2>
              <p className="text-xs text-[#52645B] dark:text-[#A9C5A0]/80 italic mt-0.5">
                {language === 'ar' ? '«خطوات صغيرة لجسمك ومزاجك، بلا وعود علاجية زائفة»' : '«Small steps for your body and mood, without false medical promises»'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-[#26332D] dark:text-white transition-colors"
            aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 p-4 bg-[#EFECE4] dark:bg-[#102018] border-b border-[#E6E8D8] dark:border-[#1F3A2E] no-scrollbar">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'recipes'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <Utensils className="w-4 h-4" />
            {language === 'ar' ? 'مكتبة الوصفات المنزلية' : 'Home Recipes Library'}
          </button>
          
          <button
            onClick={() => setActiveTab('science')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'science'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {language === 'ar' ? 'علم الأمعاء والدماغ' : 'Gut-Brain Science'}
          </button>

          <button
            onClick={() => setActiveTab('myths')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'myths'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {language === 'ar' ? 'خرافات وحقائق علمية' : 'Myths vs Facts'}
          </button>

          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'shopping'
                ? 'bg-[#174C3C] text-white shadow-md dark:bg-emerald-600'
                : 'bg-white dark:bg-[#1A3328] text-[#26332D] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {language === 'ar' ? 'قائمة المشتريات المنزلية' : 'Shopping List'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
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
                  { id: 'herbs', labelAr: 'أعشاب مهدئة', labelEn: 'Herbal Teas' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
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
                          onClick={() => setActiveRecipeDetail(recipe)}
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

          {/* TAB 2: SCIENCE */}
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

          {/* TAB 3: MYTHS */}
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

          {/* TAB 4: SHOPPING LIST */}
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
                    { ar: 'ليمون طازج وبقدونس', en: 'Fresh lemons and parsley' }
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
                  onClick={() => setActiveRecipeDetail(null)}
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
                  onClick={() => setActiveRecipeDetail(null)}
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
