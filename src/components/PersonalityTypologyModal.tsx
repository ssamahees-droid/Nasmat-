import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Brain, 
  Heart, 
  Compass, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Layers, 
  Users, 
  Zap,
  TrendingUp,
  Share2,
  Check,
  Eye,
  Flame,
  Coffee
} from 'lucide-react';
import { storage } from '../services/storage';
import { chimeService } from '../services/chimeService';
import { TextAudioPlayer } from './TextAudioPlayer';
import { useLanguage } from '../context/LanguageContext';

export interface PersonalityTypologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTestType?: 'mbti16' | 'bigfive' | 'attachment' | 'stress_coping';
  onOpenActivity?: (activityId: string) => void;
  theme?: 'dark' | 'light' | 'system';
}

type TestType = 'mbti16' | 'bigfive' | 'attachment' | 'stress_coping';

interface Question {
  id: number;
  textAr: string;
  textEn: string;
  category: string; // e.g., 'EI', 'SN', 'TF', 'JP' or 'O', 'C', 'E', 'A', 'N'
  reversed?: boolean;
}

// 1. MBTI 16 Personalities Questions (12 Questions, 3 for each dimension)
const MBTI_QUESTIONS: Question[] = [
  // E vs I (Energy Source)
  { id: 1, textAr: 'بعد يوم طويل ومليء بالضغوط، أشعر بأنني أستعيد طاقتي بالبقاء منفرداً في هدوء أكثر من الذهاب للتجمعات.', textEn: 'After a demanding day, I recharge my energy by spending quiet time alone rather than socializing.', category: 'EI', reversed: true },
  { id: 2, textAr: 'في المحادثات والمجموعات، أفضل الاستماع والتأمل قبل مشاركة رأيي بصوت مسموع.', textEn: 'In conversations, I prefer observing and reflecting before speaking out loud.', category: 'EI', reversed: true },
  { id: 3, textAr: 'أشعر بالحيوية والحماس الفوري عندما أكون وسط مجموعة أصدقاء أو ورشة عمل تفاعلية.', textEn: 'I feel energized and stimulated when surrounded by an active group or workshop.', category: 'EI', reversed: false },
  
  // S vs N (Information Processing)
  { id: 4, textAr: 'أميل للتركيز على الوقائع والحقائق العملية الملموسة أكثر من التفكير في النظريات والاحتمالات البعيدة.', textEn: 'I focus on tangible facts and concrete reality rather than distant abstract theories.', category: 'SN', reversed: true },
  { id: 5, textAr: 'كثيراً ما تغرق أفكاري في المعاني العميقة خلف الأحداث وما يمكن أن تحمله في المستقبل.', textEn: 'My thoughts frequently wander into the deeper symbolic meanings and future possibilities.', category: 'SN', reversed: false },
  { id: 6, textAr: 'أفضل التعليمات الواضحة والخطوات المجربة على التجربة العشوائية غير المحددة.', textEn: 'I prefer proven step-by-step methods over open-ended experimentation.', category: 'SN', reversed: true },

  // T vs F (Decision Making)
  { id: 7, textAr: 'عند اتخاذ قرار مهم، أعتمد أولاً على المنطق والعدالة والموضوعية المجردة.', textEn: 'When making an important decision, I rely first on logic, fairness, and objective analysis.', category: 'TF', reversed: true },
  { id: 8, textAr: 'أهتم جداً بمشاعر الأشخاص وتأثير قراراتي على الانسجام والترابط الإنساني قبل القواعد الجافة.', textEn: 'I deeply prioritize how decisions impact human harmony and personal feelings over rigid rules.', category: 'TF', reversed: false },
  { id: 9, textAr: 'يسهل علي تفهم المواقف الإنسانية والتعاطف مع ضعف الآخرين حتى لو أخطأوا.', textEn: 'I find it easy to empathize with human vulnerability and understand others even when they err.', category: 'TF', reversed: false },

  // J vs P (Lifestyle & Structure)
  { id: 10, textAr: 'أشعر براحة وسكينة أكبر عندما يكون يومي ومواعيدي مرتبة ومخططة مسبقاً بدقة.', textEn: 'I feel most at ease when my schedule and responsibilities are planned in advance.', category: 'JP', reversed: true },
  { id: 11, textAr: 'أفضل إبقاء خياراتي مفتوحة، وأتكيف بعفوية ومرونة مع التغييرات والمفاجآت.', textEn: 'I like keeping my options open and adapting spontaneously to unexpected shifts.', category: 'JP', reversed: false },
  { id: 12, textAr: 'إنجاز المهمة وإغلاق ملفها يمنحني شعوراً بالرضا أكثر من البدء في مشروعات جديدة غير مكتملة.', textEn: 'Finalizing a task and bringing closure brings me more satisfaction than starting open-ended tasks.', category: 'JP', reversed: true },
];

// 2. Big Five / OCEAN Questions (10 Questions, 2 per factor)
const BIG_FIVE_QUESTIONS: Question[] = [
  // Openness (O)
  { id: 1, textAr: 'أحب استكشاف أفكار جديدة، وتأمل الفنون، وتجربة أمور غير مألوفة لروحي وعقلي.', textEn: 'I enjoy exploring novel ideas, appreciating art, and experimenting with unfamiliar experiences.', category: 'O', reversed: false },
  { id: 2, textAr: 'أفضل البقاء في حدود الروتين المألوف الذي أعرفه جيداً ولا أحب التغييرات الفكرية المفاجئة.', textEn: 'I prefer sticking to predictable routines and avoid sudden conceptual shifts.', category: 'O', reversed: true },
  // Conscientiousness (C)
  { id: 3, textAr: 'أتحلى بالانضباط الذاتي وأفي بوعودي والتزاماتي حتى عندما أفقد الحماس المؤقت.', textEn: 'I exhibit strong self-discipline and follow through on commitments even when enthusiasm fades.', category: 'C', reversed: false },
  { id: 4, textAr: 'كثيراً ما أؤجل المهام الضرورية حتى اللحظة الأخيرة وأجد صعوبة في الترتيب المستمر.', textEn: 'I often postpone necessary obligations until the last minute and struggle with order.', category: 'C', reversed: true },
  // Extraversion (E)
  { id: 5, textAr: 'أشعر بالحيوية وسرعة الاندماج وتكوين الصداقات في البيئات الجديدة دون تردد.', textEn: 'I feel lively and connect easily with new acquaintances without hesitation.', category: 'E', reversed: false },
  { id: 6, textAr: 'أميل إلى التحفظ والهدوء، وأشعر بالراحة أكثر في الدوائر الضيقة جداً.', textEn: 'I tend to be quiet and reserved, feeling most comfortable within very small circles.', category: 'E', reversed: true },
  // Agreeableness (A)
  { id: 7, textAr: 'أفترض حسن النية في الناس وأميل لمساعدتهم وإشعارهم بالقبول غير المشروط.', textEn: 'I assume good intentions in people and naturally seek to help and offer unconditional acceptance.', category: 'A', reversed: false },
  { id: 8, textAr: 'أميل إلى التشكيك في دوافع الآخرين وأكون حذراً ومتحفزاً قبل الوثوق بأي شخص.', textEn: 'I am cautious about others’ motives and stay guarded before trusting anyone.', category: 'A', reversed: true },
  // Neuroticism / Emotional Sensitivity (N)
  { id: 9, textAr: 'أتأثر سريعاً بالمواقف السلبية وأجد صعوبة في التخلص من التوتر والقلق بعد الخلافات.', textEn: 'I am easily impacted by distress and find it challenging to shake off anxiety after tension.', category: 'N', reversed: false },
  { id: 10, textAr: 'أحتفظ بهدوئي الداخلي وأستعيد توازني العاطفي بسرعة حتى وسط العواصف والمفاجآت.', textEn: 'I maintain inner composure and rebound quickly even amid unexpected crises.', category: 'N', reversed: true },
];

// 3. Attachment Styles Questions (8 Questions)
const ATTACHMENT_QUESTIONS: Question[] = [
  { id: 1, textAr: 'أشعر بالراحة في التقارب العاطفي والاعتماد المتبادل مع أحبائي دون خوف مفرط من الفقدان.', textEn: 'I feel comfortable with emotional closeness and mutual dependency without excessive fear of loss.', category: 'secure' },
  { id: 2, textAr: 'كثيراً ما يقلقني أن الشريك أو الأصدقاء لا يحبونني بنفس القدر أو قد يبتعدون عني فجأة.', textEn: 'I frequently worry that loved ones do not care for me as much or might abruptly abandon me.', category: 'anxious' },
  { id: 3, textAr: 'أفضل الاعتماد الكامل على نفسي فقط، وأشعر بعدم الارتياح عندما يصبح شخص ما قريباً جداً مني.', textEn: 'I prefer complete self-reliance and feel uncomfortable when someone gets overly close emotionally.', category: 'avoidant' },
  { id: 4, textAr: 'أرغب بشدة في القرب والأمان، لكنني أخاف أن أتعرض للأذى إذا وثقت وفتحت قلبي.', textEn: 'I crave intimacy deeply, yet dread getting hurt whenever I open my heart.', category: 'fearful' },
  { id: 5, textAr: 'أستطيع التعبير عن احتياجاتي ومشاعري بوضوح وهدوء أثناء الخلافات دون لوم أو هروب.', textEn: 'I can express my emotional needs calmly during disagreements without blaming or fleeing.', category: 'secure' },
  { id: 6, textAr: 'عندما يتأخر شخص عزيز في الرد، تبدأ نوبات القلق والسيناريوهات المزعجة في عقلي.', textEn: 'When someone dear delays responding, intense worry and worst-case scenarios hijack my mind.', category: 'anxious' },
  { id: 7, textAr: 'عندما تشتد المشاعر أو الصراعات، أنسحب تماماً داخل قوقعتي وأحتاج وقتاً طويلاً بمفردي.', textEn: 'When emotional conflict escalates, I shut down into my shell and withdraw.', category: 'avoidant' },
  { id: 8, textAr: 'مشاعري في العلاقات متذبذبة؛ أقترب بشغف ثم أنفر فجأة خوفاً من فقدان السيطرة.', textEn: 'My feelings in relationships swing between intense yearning and sudden retreat.', category: 'fearful' }
];

// 4. Stress Coping Typology Questions (8 Questions)
const STRESS_COPING_QUESTIONS: Question[] = [
  { id: 1, textAr: 'عند مواجهة أزمة، أبدأ فوراً في تقسيم المشكلة إلى خطوات عملية ووضع خطة منطقية لحلها.', textEn: 'During a crisis, I immediately break the problem into practical steps and formulate a plan.', category: 'problem_focused' },
  { id: 2, textAr: 'أحتاج أولاً إلى تفريغ مشاعري والتنفس والتحدث عما يدور بداخلي قبل التفكير في الحلول.', textEn: 'I first need to vent my feelings, breathe, and process emotions before tackling solutions.', category: 'emotion_focused' },
  { id: 3, textAr: 'أميل إلى الانغماس في عمل آخر، النوم، أو الابتعاد المؤقت عن مصدر الضغط حتى أهدأ.', textEn: 'I tend to distract myself with work, sleep, or stepping away until my stress subsides.', category: 'avoidant_protective' },
  { id: 4, textAr: 'أول ما أفعله عند اشتداد الضغط هو الاتصال بصديق مقرب أو طلب المشورة من شخص أثق به.', textEn: 'My first instinct under severe pressure is reaching out to a close friend or trusted mentor.', category: 'support_seeking' },
  { id: 5, textAr: 'كتابة المشكلة والبحث عن أسبابها الجذرية هو طريقتي الأضمن لاستعادة السيطرة.', textEn: 'Writing the issue down and analyzing root causes is my most reliable way to regain agency.', category: 'problem_focused' },
  { id: 6, textAr: 'أستخدم الصلاة، التأمل، تمارين التنفس، أو الاستماع للأصوات الهادئة لتسكين جهازي العصبي.', textEn: 'I use prayer, meditation, breathing exercises, or calming sounds to regulate my nervous system.', category: 'emotion_focused' },
  { id: 7, textAr: 'أؤجل مواجهة الخلافات المعقدة قدر المستطاع لحماية سلامي الداخلي من التوتر الزائد.', textEn: 'I postpone tackling complicated conflicts to shield my inner peace from overload.', category: 'avoidant_protective' },
  { id: 8, textAr: 'أشعر بالقوة والاطمئنان حين أشارك همومي مع من يفهمني دون أحكام أو نصائح جافة.', textEn: 'I draw strength and reassurance from sharing burdens with someone who listens without judgment.', category: 'support_seeking' }
];

export const PersonalityTypologyModal: React.FC<PersonalityTypologyModalProps> = ({
  isOpen,
  onClose,
  initialTestType = 'mbti16',
  onOpenActivity,
  theme = 'dark'
}) => {
  const { language } = useLanguage();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'tests_menu' | 'taking_test' | 'result' | 'history'>('tests_menu');
  const [selectedTestType, setSelectedTestType] = useState<TestType>(initialTestType);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [calculatedResult, setCalculatedResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const getQuestionsForTest = (type: TestType): Question[] => {
    switch (type) {
      case 'mbti16': return MBTI_QUESTIONS;
      case 'bigfive': return BIG_FIVE_QUESTIONS;
      case 'attachment': return ATTACHMENT_QUESTIONS;
      case 'stress_coping': return STRESS_COPING_QUESTIONS;
    }
  };

  const currentQuestions = getQuestionsForTest(selectedTestType);
  const totalQuestions = currentQuestions.length;
  const currentQ = currentQuestions[currentQuestionIndex];

  // Options for Likert Scale (1 to 5)
  const LIKERT_OPTIONS = [
    { score: 1, labelAr: 'لا ينطبق عليّ إطلاقاً', labelEn: 'Strongly Disagree', emoji: '⚪' },
    { score: 2, labelAr: 'ينطبق قليلاً', labelEn: 'Disagree', emoji: '◽' },
    { score: 3, labelAr: 'بين هذا وذاك (محايد)', labelEn: 'Neutral', emoji: '🔘' },
    { score: 4, labelAr: 'ينطبق عليّ غالباً', labelEn: 'Agree', emoji: '🔹' },
    { score: 5, labelAr: 'ينطبق عليّ تماماً', labelEn: 'Strongly Agree', emoji: '🔷' },
  ];

  const handleStartTest = (type: TestType) => {
    chimeService.playReassuranceChime();
    setSelectedTestType(type);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCalculatedResult(null);
    setActiveTab('taking_test');
  };

  const handleAnswer = (score: number) => {
    chimeService.playReassuranceChime();
    const updatedAnswers = { ...answers, [currentQ.id]: score };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final result
      computeResult(selectedTestType, updatedAnswers);
    }
  };

  const computeResult = (type: TestType, allAnswers: Record<number, number>) => {
    let resultPayload: any = {};

    if (type === 'mbti16') {
      // Dimensions: EI, SN, TF, JP
      let eScore = 0, iScore = 0;
      let sScore = 0, nScore = 0;
      let tScore = 0, fScore = 0;
      let jScore = 0, pScore = 0;

      MBTI_QUESTIONS.forEach(q => {
        const val = allAnswers[q.id] || 3;
        if (q.category === 'EI') {
          if (q.reversed) { iScore += val; eScore += (6 - val); }
          else { eScore += val; iScore += (6 - val); }
        } else if (q.category === 'SN') {
          if (q.reversed) { sScore += val; nScore += (6 - val); }
          else { nScore += val; sScore += (6 - val); }
        } else if (q.category === 'TF') {
          if (q.reversed) { tScore += val; fScore += (6 - val); }
          else { fScore += val; tScore += (6 - val); }
        } else if (q.category === 'JP') {
          if (q.reversed) { jScore += val; pScore += (6 - val); }
          else { pScore += val; jScore += (6 - val); }
        }
      });

      const dimE = eScore >= iScore ? 'E' : 'I';
      const dimS = sScore >= nScore ? 'S' : 'N';
      const dimT = tScore >= fScore ? 'T' : 'F';
      const dimJ = jScore >= pScore ? 'J' : 'P';
      const mbtiCode = `${dimE}${dimS}${dimT}${dimJ}`;

      // Profiles dictionary
      const MBTI_PROFILES: Record<string, any> = {
        INFJ: {
          titleAr: 'المحامي الحكيم — صاحب البصيرة الإنسانية',
          titleEn: 'The Advocate (INFJ)',
          taglineAr: 'هادئ ومثالي، تحركك المبادئ العميقة والاهتمام الصادق بنمو الآخرين وسلامهم الداخلي.',
          taglineEn: 'Quiet, visionary, guided by deep principles and compassionate growth for others.',
          strengthsAr: ['حدس نافذ في قراءة مشاعر الناس', 'التزام أخلاقي راسخ', 'إبداع في الحلول النفسية', 'إخلاص وهدوء عميق'],
          stressReactionAr: 'تحت الضغط الشديد، تميل للاجترار والانسحاب المفرط في التفكير المثالي، وتلوم نفسك على آلام الآخرين.',
          growthTipAr: 'ضع حدوداً لطاقتك العاطفية؛ ليس دورك إصلاح كل العالم. امنح نفسك نفس الرعاية التي تهبها للجميع.',
          recommendedActivities: [
            { id: 'mindfulness', nameAr: 'استوديو التيقظ الواعي والتأمل', icon: Heart },
            { id: 'thought_journal', nameAr: 'مذكرة الأفكار والتعافي', icon: BookOpen },
            { id: 'gratitude_garden', nameAr: 'لعبة حديقة الامتنان', icon: Sparkles }
          ]
        },
        ENFP: {
          titleAr: 'البطل الملهم — روح الشغف والإبداع',
          titleEn: 'The Campaigner (ENFP)',
          taglineAr: 'حيوي وعفوي، ترى الاحتمالات المشرقة في كل مكان وتبث الدفء والأمل لمن حولك.',
          taglineEn: 'Enthusiastic and creative, seeing bright possibilities and inspiring genuine hope.',
          strengthsAr: ['حماس معدٍ وطاقة محفزة', 'ذكاء عاطفي وتواصل فوري', 'مرونة عالية أمام المتغيرات', 'رؤية إيجابية متجددة'],
          stressReactionAr: 'تحت الضغط، تشعر بالتشتت الحاد وإرهاق التركيز، وتفقد الحماس للمهام اليومية الروتينية.',
          growthTipAr: 'ركز على إنهاء خطوة واحدة قبل القفز لفكرة جديدة. استعن بتمارين التنفس لتهدئة تسارع عقلك.',
          recommendedActivities: [
            { id: 'emotion_compass', nameAr: 'بوصلة المشاعر لترتيب الداخل', icon: Compass },
            { id: 'feker', nameAr: 'تطبيق فكّر لتفكيك الأفكار المتسارعة', icon: Brain },
            { id: 'inner_burdens', nameAr: 'لعبة فرقعة الأعباء النفسية', icon: Sparkles }
          ]
        },
        INTJ: {
          titleAr: 'العقل المدبر — الاستراتيجي المتبصر',
          titleEn: 'The Architect (INTJ)',
          taglineAr: 'مستقل وتحليلي، تسعى دائماً لتحسين الأنظمة وفهم القوانين العميقة للأشياء بكفاءة ودقة.',
          taglineEn: 'Independent and analytical, seeking systematic improvement and profound understanding.',
          strengthsAr: ['تفكير استراتيجي بعيد المدى', 'استقلالية عقلية عالية', 'ثقة مستندة للمعرفة', 'تنظيم صارم للأهداف'],
          stressReactionAr: 'تحت الضغط، قد تنفصل عن مشاعرك وتصبح شديد الانتقاد لنفسك ولمن حولك عند تعطل الخطط.',
          growthTipAr: 'تذكر أن المشاعر ليست عيباً منطقياً بل بوصلة حيوية. اسمح لنفسك بالراحة دون الحاجة لإثبات الإنتاجية.',
          recommendedActivities: [
            { id: 'personal_plan', nameAr: 'بناء خطة النمو الشخصية المتكاملة', icon: Award },
            { id: 'feker', nameAr: 'تطبيق فكّر لتفكيك المثالية المفرطة', icon: Brain },
            { id: 'breathe', nameAr: 'دقيقة تنفس هادئة لفك التشنج الذهني', icon: Activity }
          ]
        },
        ISFJ: {
          titleAr: 'المدافع الأمين — السند الوفي والملجأ الآمن',
          titleEn: 'The Defender (ISFJ)',
          taglineAr: 'مخلص ومتفانٍ، تحمي من تحبهم وتهتم بأدق تفاصيل راحتهم بقلب مفعم بالدفء والمسؤولية.',
          taglineEn: 'Dedicated and caring, protecting loved ones with a steady, warm sense of responsibility.',
          strengthsAr: ['أمانة ووفاء لا يتزعزع', 'ذاكرة حية لما يسعد الآخرين', 'صبر وتفانٍ في الواجبات', 'استقرار واحتواء هادئ'],
          stressReactionAr: 'تحت الضغط، تكبت احتياجاتك الخاصة خوفاً من إزعاج أحد، ثم تنفجر بمشاعر الإنهاك الصامت.',
          growthTipAr: 'تعلم قول "لا" كشكل من أشكال العناية الذاتية. سلامك الداخلي ليس رفاهية بل أساس قدرتك على العطاء.',
          recommendedActivities: [
            { id: 'boundary_builder', nameAr: 'أداة بناء الحدود النفسية الواعية', icon: ShieldCheck },
            { id: 'gratitude_garden', nameAr: 'حديقة الامتنان لرعاية نفسك', icon: Heart },
            { id: 'mood_kitchen', nameAr: 'مطبخ المزاج وأكسير الراحة الدافئ', icon: Coffee }
          ]
        },
        INFP: {
          titleAr: 'الوسيط الحالم — حارس القيم والصفاء',
          titleEn: 'The Mediator (INFP)',
          taglineAr: 'حساس وأصيل، تبحث عن المعنى الصادق وتعيش بعالم داخلي غني بالجمال والتعاطف.',
          taglineEn: 'Idealistic and authentic, guided by deep values and a rich inner landscape.',
          strengthsAr: ['صدق عاطفي وعمق إنساني', 'إبداع فني وتعبيري فريد', 'تقبل حقيقي لاختلافات الناس', 'قدرة استثنائية على الشفاء النفسي'],
          stressReactionAr: 'تحت الضغط، تصاب بالانعزال التام وجَلد الذات والشعور بأن العالم الخارجي قاسٍ أو غير مفهوم.',
          growthTipAr: 'ترجم أحلامك إلى أفعال صغيرة ملموسة في الواقع اليومي؛ ولا تجعل الحزن يتحول لهوية دائمة.',
          recommendedActivities: [
            { id: 'thought_journal', nameAr: 'مذكرة الأفكار والتفريغ الوجداني', icon: BookOpen },
            { id: 'emotional_bridge', nameAr: 'لعبة الجسر العاطفي للاتزان', icon: Layers },
            { id: 'soundscape', nameAr: 'استوديو الأصوات والمشاهد الهادئة', icon: Sparkles }
          ]
        },
        ENTP: {
          titleAr: 'المحاور المبتكر — متسائل الآفاق الفكرية',
          titleEn: 'The Visionary (ENTP)',
          taglineAr: 'سريع البديهة وذكي، تعشق تفكيك الأفكار واكتشاف مسارات غير مسبوقة بجرأة وفكاهة.',
          taglineEn: 'Quick-witted and bold, loving intellectual exploration and novel pathways.',
          strengthsAr: ['تفكير جانبي فائق الذكاء', 'شجاعة في تحدي المسلمات', 'قدرة عالية على التكيف', 'حضور وجاذبية ذهنية'],
          stressReactionAr: 'تحت الضغط، تجد صعوبة في الاستقرار العاطفي وتتحول إلى النقاش الدفاعي أو الملل الحاد.',
          growthTipAr: 'تدرب على الاستقرار في اللحظة الحاضرة والاعتراف بمشاعرك العميقة بدلاً من معالجتها فكرياً فقط.',
          recommendedActivities: [
            { id: 'feker', nameAr: 'تطبيق فكّر لإعادة التأطير المعرفي', icon: Brain },
            { id: 'energy_budget', nameAr: 'ميزانية الطاقة لمنع الاستنزاف', icon: Activity },
            { id: 'mindfulness', nameAr: 'استوديو التيقظ لترسيخ الحضور', icon: Heart }
          ]
        }
      };

      const fallbackProfile = {
        titleAr: `النمط المتزن (${mbtiCode})`,
        titleEn: `The Balanced Personality (${mbtiCode})`,
        taglineAr: `تجمع بين خصائص ${dimE === 'E' ? 'الانبساطية' : 'الانطوائية'} و${dimT === 'T' ? 'التفكير المنطقي' : 'القيم والمشاعر الإنسانية'}.`,
        taglineEn: `A unique blend of ${dimE === 'E' ? 'Extraversion' : 'Introversion'} and balanced cognition.`,
        strengthsAr: ['مرونة في التعامل مع المتغيرات', 'قدرة على التفكير والتعاطف', 'استقلالية متزنة'],
        stressReactionAr: 'عند اشتداد الضغط، تحتاج لمساحة هادئة لمراجعة أولوياتك وإعادة التوازن.',
        growthTipAr: 'استمر في استكشاف نقاط قوتك وممارسة تقنيات التهدئة والتنفس عند الشعور بالثقل.',
        recommendedActivities: [
          { id: 'breathe', nameAr: 'دقيقة تنفس هادئة', icon: Activity },
          { id: 'thought_journal', nameAr: 'مذكرة الأفكار', icon: BookOpen },
          { id: 'mood_kitchen', nameAr: 'مطبخ المزاج', icon: Coffee }
        ]
      };

      const profile = MBTI_PROFILES[mbtiCode] || fallbackProfile;

      resultPayload = {
        testType: 'mbti16',
        code: mbtiCode,
        titleAr: profile.titleAr,
        titleEn: profile.titleEn,
        taglineAr: profile.taglineAr,
        taglineEn: profile.taglineEn,
        strengthsAr: profile.strengthsAr,
        stressReactionAr: profile.stressReactionAr,
        growthTipAr: profile.growthTipAr,
        scores: {
          E: Math.round((eScore / (eScore + iScore)) * 100),
          I: Math.round((iScore / (eScore + iScore)) * 100),
          S: Math.round((sScore / (sScore + nScore)) * 100),
          N: Math.round((nScore / (sScore + nScore)) * 100),
          T: Math.round((tScore / (tScore + fScore)) * 100),
          F: Math.round((fScore / (tScore + fScore)) * 100),
          J: Math.round((jScore / (jScore + pScore)) * 100),
          P: Math.round((pScore / (jScore + pScore)) * 100),
        },
        recommendedActivities: profile.recommendedActivities
      };
    } else if (type === 'bigfive') {
      let oScore = 0, cScore = 0, eScore = 0, aScore = 0, nScore = 0;

      BIG_FIVE_QUESTIONS.forEach(q => {
        const val = allAnswers[q.id] || 3;
        const actualVal = q.reversed ? (6 - val) : val;
        if (q.category === 'O') oScore += actualVal;
        if (q.category === 'C') cScore += actualVal;
        if (q.category === 'E') eScore += actualVal;
        if (q.category === 'A') aScore += actualVal;
        if (q.category === 'N') nScore += actualVal;
      });

      // Max score per factor is 10 (2 questions * 5)
      const oPct = Math.round((oScore / 10) * 100);
      const cPct = Math.round((cScore / 10) * 100);
      const ePct = Math.round((eScore / 10) * 100);
      const aPct = Math.round((aScore / 10) * 100);
      const nPct = Math.round((nScore / 10) * 100);

      resultPayload = {
        testType: 'bigfive',
        titleAr: 'خارطة العوامل الخمسة الكبرى (OCEAN)',
        titleEn: 'Big Five Personality Profile',
        taglineAr: 'النموذج العلمي الأدق والأكثر موثوقية عالمياً لتوصيف أبعاد السلوك والاستجابة العاطفية.',
        taglineEn: 'The globally validated standard framework for human personality and behavior.',
        scores: {
          openness: oPct,
          conscientiousness: cPct,
          extraversion: ePct,
          agreeableness: aPct,
          neuroticism: nPct,
        },
        strengthsAr: [
          `الانفتاح الفكري (${oPct}٪): ${oPct >= 60 ? 'فضول معرفي عالي وخيال خصب' : 'واقعية عملية وثبات في العادات'}`,
          `يقظة الضمير (${cPct}٪): ${cPct >= 60 ? 'انضباط والتزام ممتاز بالمسؤوليات' : 'مرونة وعفوية تكيفية عالية'}`,
          `الانبساطية (${ePct}٪): ${ePct >= 60 ? 'حيوية وتفاعل اجتماعي نشط' : 'هدوء واكتفاء بالمساحات الخاصة'}`,
          `الوفاق (${aPct}٪): ${aPct >= 60 ? 'تعاطف عميق وسعي للانسجام والتراحم' : 'حزم وموضوعية واستقلالية في الرأي'}`,
          `الاتزان الانفعالي (${100 - nPct}٪): ${nPct <= 45 ? 'مرونة عالية وهدوء تحت الضغط' : 'حساسية وجدانية عميقة تتطلب رعاية دورية'}`
        ],
        growthTipAr: nPct > 50 
          ? 'تظهر النتائج حساسية عاطفية عالية تجاه الضغوط؛ تدرب على تمارين تهدئة الجهاز العصبي والابتعاد عن استهلاك الأخبار السلبية.'
          : 'تتمتع بمرونة نفسية جيدة؛ استثمر هذا الاستقرار في دعم من حولك والمضي قدماً في مشروعاتك طويلة الأجل.',
        recommendedActivities: [
          { id: 'breathe', nameAr: 'دقيقة تنفس هادئة لضبط التوتر', icon: Activity },
          { id: 'feker', nameAr: 'تطبيق فكّر لتنظيم الأفكار', icon: Brain },
          { id: 'gratitude_garden', nameAr: 'حديقة الامتنان لتعزيز الوفاق', icon: Sparkles }
        ]
      };
    } else if (type === 'attachment') {
      let secureScore = 0, anxiousScore = 0, avoidantScore = 0, fearfulScore = 0;

      ATTACHMENT_QUESTIONS.forEach(q => {
        const val = allAnswers[q.id] || 3;
        if (q.category === 'secure') secureScore += val;
        if (q.category === 'anxious') anxiousScore += val;
        if (q.category === 'avoidant') avoidantScore += val;
        if (q.category === 'fearful') fearfulScore += val;
      });

      const maxScore = Math.max(secureScore, anxiousScore, avoidantScore, fearfulScore);
      let style = 'secure';
      if (maxScore === anxiousScore) style = 'anxious';
      else if (maxScore === avoidantScore) style = 'avoidant';
      else if (maxScore === fearfulScore) style = 'fearful';

      const ATTACHMENT_DATA: Record<string, any> = {
        secure: {
          titleAr: 'نمط التعلّق الآمن (Secure Attachment)',
          taglineAr: 'تتمتع بأساس متين من الثقة بالنفس والآخرين، وترى القرب والاعتماد المتبادل كفرصة للنمو والسكينة.',
          strengthsAr: ['تواصل عاطفي واضح وصريح', 'مرونة عالية في حل الخلافات', 'لا تخشى القرب ولا تخاف الوحدة'],
          growthTipAr: 'حافظ على هذا النمط الصحي، وكن ملجأً داعماً لشركائك وأصدقائك الذين قد يحملون جراح تعلّق غير آمن.',
        },
        anxious: {
          titleAr: 'نمط التعلّق القلق (Anxious Attachment)',
          taglineAr: 'قلبك كبير وتبحث عن الأمان العميق، لكنك تخشى الفقدان وتبحث دائماً عن تطمينات تؤكد لك أنك محبوب.',
          strengthsAr: ['إخلاص وحساسية شديدة لمشاعر الشريك', 'رغبة صادقة في بناء روابط متينة', 'كرم عاطفي متدفق'],
          growthTipAr: 'تعلم مهارة التهدئة الذاتية؛ أمانك يبدأ من تقديرك لذاتك، وتأخر الرد في الرسائل لا يعني انعدام الحب.',
        },
        avoidant: {
          titleAr: 'نمط التعلّق التجنبي (Avoidant Attachment)',
          taglineAr: 'تقدّر استقلاليتك بقوة، لكنك تميل للانسحاب وإقامة الأسوار العالية عندما تقترب المشاعر وتصبح معقدة.',
          strengthsAr: ['اعتماد ذاتي واستقلالية مذهلة', 'هدوء في إدارة الأزمات الخارجية', 'عقلانية وتماسك'],
          growthTipAr: 'اسمح لنفسك بالتعبير عن الضعف الإنساني؛ الاحتياج للآخرين ليس عيباً، والضعف الواعي هو شجاعة حقيقية.',
        },
        fearful: {
          titleAr: 'نمط التعلّق المتذبذب / الخائف (Fearful-Avoidant)',
          taglineAr: 'تتأرجح بين الرغبة الشديدة في الاحتواء والخوف المربك من التعرض للأذى أو الخذلان.',
          strengthsAr: ['فهم عميق للتناقضات الإنسانية', 'حساسية وبصيرة نافذة', 'قدرة عظيمة على التعافي التراكمي'],
          growthTipAr: 'امنح نفسك وقتاً لبناء الأمان بالتدريج؛ لست مضطراً للقفز في العلاقات أو الهروب الكامل منها.',
        }
      };

      const info = ATTACHMENT_DATA[style];
      resultPayload = {
        testType: 'attachment',
        style,
        titleAr: info.titleAr,
        titleEn: style.toUpperCase() + ' Attachment',
        taglineAr: info.taglineAr,
        taglineEn: 'Relational & Attachment Blueprint',
        strengthsAr: info.strengthsAr,
        growthTipAr: info.growthTipAr,
        scores: {
          secure: Math.round((secureScore / 10) * 100),
          anxious: Math.round((anxiousScore / 10) * 100),
          avoidant: Math.round((avoidantScore / 10) * 100),
          fearful: Math.round((fearfulScore / 10) * 100),
        },
        recommendedActivities: [
          { id: 'boundary_builder', nameAr: 'أداة بناء الحدود والآمان العاطفي', icon: ShieldCheck },
          { id: 'companion', nameAr: 'جلسة فضفضة آمنة مع رفيقي', icon: Heart },
          { id: 'emotional_bridge', nameAr: 'لعبة الجسر العاطفي', icon: Layers }
        ]
      };
    } else if (type === 'stress_coping') {
      let pScore = 0, eScore = 0, aScore = 0, sScore = 0;

      STRESS_COPING_QUESTIONS.forEach(q => {
        const val = allAnswers[q.id] || 3;
        if (q.category === 'problem_focused') pScore += val;
        if (q.category === 'emotion_focused') eScore += val;
        if (q.category === 'avoidant_protective') aScore += val;
        if (q.category === 'support_seeking') sScore += val;
      });

      const maxScore = Math.max(pScore, eScore, aScore, sScore);
      let dominant = 'problem_focused';
      if (maxScore === eScore) dominant = 'emotion_focused';
      else if (maxScore === aScore) dominant = 'avoidant_protective';
      else if (maxScore === sScore) dominant = 'support_seeking';

      const COPING_DATA: Record<string, any> = {
        problem_focused: {
          titleAr: 'المواجه التحليلي (Problem-Focused Coping)',
          taglineAr: 'تتعامل مع الضغوط كمعادلة تحتاج إلى تفكيك وحلول عملية وخطط ملموسة.',
          strengthsAr: ['كفاءة عالية في حل المشكلات', 'تقليل الفوضى بالخطوات العملية', 'تركيز على ما يمكن التحكم به'],
          growthTipAr: 'تذكر أن بعض آلام الحياة تحتاج لاحتواء وتفريغ المشاعر أولاً قبل القفز المباشر للحلول.',
        },
        emotion_focused: {
          titleAr: 'المعالج الوجداني (Emotion-Focused Coping)',
          taglineAr: 'تركز على تهدئة جهازك العصبي وتنظيم مشاعرك عبر التنفس والتأمل واليقظة قبل اتخاذ أي خطوة.',
          strengthsAr: ['ذكاء جسدي ووعي بإشارات التوتر', 'قدرة على الاسترخاء الذاتي', 'حماية الجهاز الهضمي والقلب من الشد'],
          growthTipAr: 'بعد أن يهدأ جهازك العصبي، لا تتأخر في اتخاذ الخطوة العملية المباشرة لحسم ما يقلقك.',
        },
        avoidant_protective: {
          titleAr: 'المنسحب لحماية الذات (Protective Retreat)',
          taglineAr: 'تميل لأخذ خطوة للوراء والابتعاد عن بيئة التوتر حتى تعيد شحن بطاريتك بهدوء.',
          strengthsAr: ['حماية النفس من الصدامات غير المجدية', 'معرفة متى تحتاج للاستراحة', 'هدوء ظاهري يحمي من التهور'],
          growthTipAr: 'الانعزال المؤقت صحي، لكن تجنب التسويف الطويل حتى لا تتراكم المشكلات ككرة ثلجية.',
        },
        support_seeking: {
          titleAr: 'المستند للدعم الاجتماعي (Support-Seeking)',
          taglineAr: 'تجد في مشاركة الحمل مع الأصدقاء والأحباء أسرع طريق لاستعادة الأمان والقوة.',
          strengthsAr: ['شجاعة في طلب المساعدة والمشورة', 'بناء شبكة دعم دافئة', 'تخفيف ثقل المعاناة بالمشاركة'],
          growthTipAr: 'احرص على تنمية مساحتك الخاصة للتهدئة الذاتية حتى لا يعتمد سلامك النفسي كلياً على وجود الآخرين.',
        }
      };

      const info = COPING_DATA[dominant];
      resultPayload = {
        testType: 'stress_coping',
        style: dominant,
        titleAr: info.titleAr,
        titleEn: dominant.toUpperCase() + ' Coping',
        taglineAr: info.taglineAr,
        taglineEn: 'Stress Response Blueprint',
        strengthsAr: info.strengthsAr,
        growthTipAr: info.growthTipAr,
        scores: {
          problem: Math.round((pScore / 10) * 100),
          emotion: Math.round((eScore / 10) * 100),
          avoidant: Math.round((aScore / 10) * 100),
          support: Math.round((sScore / 10) * 100),
        },
        recommendedActivities: [
          { id: 'rescue_kit', nameAr: 'حقيبة النجاة النفسية الفورية', icon: Award },
          { id: 'feker', nameAr: 'تطبيق فكّر لتفكيك الضغوط', icon: Brain },
          { id: 'inner_burdens', nameAr: 'لعبة فرقعة الأعباء النفسية', icon: Sparkles }
        ]
      };
    }

    // Save to storage
    storage.savePersonalityTestResult(resultPayload);

    setCalculatedResult(resultPayload);
    setActiveTab('result');
  };

  const savedHistory = storage.getPersonalityTestResults();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className={`border rounded-3xl p-5 sm:p-7 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-6 text-right shadow-2xl transition-all ${
        isDark ? 'bg-[#121E18] border-emerald-500/25 text-[#F7F3E9]' : 'bg-[#FAF8F5] border-emerald-700/15 text-[#182620]'
      }`}>
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {language === 'ar' ? 'استكشاف الذات وعلم النفس التطبيقي' : 'Applied Self-Discovery & Psychology'}
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                {language === 'ar' ? 'اختبارات تصنيف الشخصية والأنماط النفسية 🧠' : 'Personality Typology & Psychology Assessments'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'tests_menu' && (
              <button
                onClick={() => {
                  chimeService.playReassuranceChime();
                  setActiveTab('tests_menu');
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-300' : 'bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                {language === 'ar' ? 'قائمة الاختبارات' : 'Tests Menu'}
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10 text-stone-400 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-black'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b pb-3 border-emerald-500/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tests_menu')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tests_menu' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {language === 'ar' ? 'الاختبارات المتوفرة (٤ مقاييس)' : 'Available Tests'}
          </button>

          {calculatedResult && (
            <button
              onClick={() => setActiveTab('result')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'result' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {language === 'ar' ? 'النتيجة الحالية ✨' : 'Current Result ✨'}
            </button>
          )}

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>{language === 'ar' ? `نتائجي السابقة (${savedHistory.length})` : `History (${savedHistory.length})`}</span>
          </button>
        </div>

        {/* TAB 1: TESTS MENU */}
        {activeTab === 'tests_menu' && (
          <div className="space-y-4">
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              {language === 'ar'
                ? 'اختر المقياس النفسي الذي ترغب في استكشافه اليوم. جميع الأسئلة مصممة بأسلوب راقٍ وخالٍ من الأحكام المسبقة لتمنحك خارطة طريق عملية لسلامك الداخلي ونقاط قوتك الفطرية:'
                : 'Select the psychological assessment you wish to explore today. All items are crafted without bias to guide your inner growth:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Test 1: MBTI 16 Personalities */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 group hover:border-emerald-400/50 hover:shadow-lg ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200 shadow-xs'
              }`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-2xl bg-emerald-500/15 text-emerald-300">🧭</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ١٢ سؤال • ٤ دقائق
                    </span>
                  </div>
                  <h4 className={`text-base font-bold group-hover:text-emerald-300 transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {language === 'ar' ? 'اختبار الأنماط الـ ١٦ (MBTI)' : '16 Personalities Typology'}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {language === 'ar'
                      ? 'يكتشف أبعاد شخصيتك الأربعة (الانطوائية/الانبساطية، الحدس/الحس، المنطق/المشاعر، والتخطيط/العفوية) ويحدد لقب شخصيتك وسلوكها تحت الضغط.'
                      : 'Uncovers your 4 core cognitive dimensions, archetype title, and behavior under stress.'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartTest('mbti16')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'ابدأ اختبار الأنماط الـ ١٦ 🧭' : 'Start 16 Personalities'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              {/* Test 2: Big Five (OCEAN) */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 group hover:border-emerald-400/50 hover:shadow-lg ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200 shadow-xs'
              }`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-2xl bg-teal-500/15 text-teal-300">📊</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      المعيار الأكاديمي العالمي
                    </span>
                  </div>
                  <h4 className={`text-base font-bold group-hover:text-teal-300 transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {language === 'ar' ? 'مقياس العوامل الخمسة الكبرى (OCEAN)' : 'Big Five Traits (OCEAN)'}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {language === 'ar'
                      ? 'يقيس الانفتاح الذهني، يقظة الضمير، الانبساط، الوفاق الإنساني، والمرونة النفسية بنسب مئوية دقيقة وتوصيات عصبية.'
                      : 'Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability.'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartTest('bigfive')}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'ابدأ مقياس العوامل الخمسة 📊' : 'Start Big Five'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              {/* Test 3: Attachment Styles */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 group hover:border-emerald-400/50 hover:shadow-lg ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200 shadow-xs'
              }`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-2xl bg-purple-500/15 text-purple-300">❤️</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      العلاقات والأمان الوجداني
                    </span>
                  </div>
                  <h4 className={`text-base font-bold group-hover:text-purple-300 transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {language === 'ar' ? 'مقياس أنماط التعلّق في العلاقات' : 'Attachment Styles Assessment'}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {language === 'ar'
                      ? 'يكتشف نمط تعاملك مع القرب العاطفي والخوف من الفقدان (آمن، قلق، تجنبي، أو متذبذب) مع خارطة للأمان الذاتي.'
                      : 'Discovers your relational attachment style (Secure, Anxious, Avoidant, or Fearful) and self-soothing cues.'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartTest('attachment')}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'ابدأ مقياس أنماط التعلّق ❤️' : 'Start Attachment Test'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              {/* Test 4: Stress Coping Typology */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 group hover:border-emerald-400/50 hover:shadow-lg ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200 shadow-xs'
              }`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-2xl bg-amber-500/15 text-amber-300">⚡</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      إدارة الضغوط والمواقف الصعبة
                    </span>
                  </div>
                  <h4 className={`text-base font-bold group-hover:text-amber-300 transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {language === 'ar' ? 'مقياس أسلوب مواجهة الضغوط' : 'Stress Coping Typology'}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {language === 'ar'
                      ? 'يحدد أسلوبك الدفاعي التلقائي عند اشتداد الأزمات (تحليلي، وجداني، منسحب للحماية، أو مستند للدعم الاجتماعي).'
                      : 'Identifies your innate stress defense strategy (Problem-Solver, Emotional, Protective Retreat, or Relational).'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartTest('stress_coping')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'ابدأ مقياس أسلوب الضغوط ⚡' : 'Start Stress Coping'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: TAKING TEST RUNNER */}
        {activeTab === 'taking_test' && currentQ && (
          <div className="space-y-6 animate-fade-in">
            {/* Progress Bar & Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                <span>
                  {language === 'ar' 
                    ? `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}` 
                    : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
                </span>
                <span className="text-emerald-400">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-700/30 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 shadow-sm ${
              isDark ? 'bg-black/25 border-emerald-500/25' : 'bg-white border-emerald-600/15'
            }`}>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 inline-block">
                {language === 'ar' ? 'تأمل الموقف بصدق ورفق مع ذاتك' : 'Reflect honestly on your true instinct'}
              </span>

              <h3 className={`text-base sm:text-xl font-bold leading-relaxed max-w-xl mx-auto ${isDark ? 'text-white' : 'text-stone-900'}`}>
                {language === 'ar' ? currentQ.textAr : currentQ.textEn}
              </h3>
            </div>

            {/* Likert Scale Options */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-stone-400 block px-1">
                {language === 'ar' ? 'اختر مدى انطباق العبارة على سلوكك المعتاد:' : 'Select how much this reflects your behavior:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      onClick={() => handleAnswer(opt.score)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-md scale-102 ring-2 ring-emerald-400/50'
                          : isDark
                            ? 'bg-white/5 border-white/10 hover:border-emerald-500/40 text-stone-300 hover:bg-white/10'
                            : 'bg-white border-stone-200 hover:border-emerald-500/40 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-lg">{opt.emoji}</span>
                      <span className="text-xs font-bold block">{language === 'ar' ? opt.labelAr : opt.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Back & Skip navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  chimeService.playReassuranceChime();
                  setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  currentQuestionIndex === 0 
                    ? 'opacity-40 cursor-not-allowed border-transparent text-stone-500' 
                    : 'cursor-pointer hover:bg-white/10 text-stone-300 border-white/10'
                }`}
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
              </button>

              <button
                onClick={() => handleAnswer(3)} // Neutral fallback
                className="text-stone-400 hover:text-stone-200 text-xs font-medium cursor-pointer"
              >
                {language === 'ar' ? 'تخطي بمحايد' : 'Skip Neutral'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RESULT DASHBOARD */}
        {activeTab === 'result' && calculatedResult && (
          <div className="space-y-6 animate-fade-in">
            {/* Primary Archetype Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-emerald-950/60 via-[#162720] to-[#121E18] border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'تحليل الشخصية والنمط النفسي المكتمل' : 'Completed Personality Analysis'}</span>
                </span>

                {calculatedResult.code && (
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                    {calculatedResult.code}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight font-tajawal">
                  {language === 'ar' ? calculatedResult.titleAr : calculatedResult.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                  {language === 'ar' ? calculatedResult.taglineAr : calculatedResult.taglineEn}
                </p>
              </div>

              {/* Audio explanation for the personality reading */}
              <div className="pt-2">
                <TextAudioPlayer
                  text={language === 'ar' 
                    ? `${calculatedResult.titleAr}. ${calculatedResult.taglineAr} نقاط قوتك: ${calculatedResult.strengthsAr.join('، ')}. نصيحة النمو: ${calculatedResult.growthTipAr}` 
                    : `${calculatedResult.titleEn}. ${calculatedResult.taglineEn}`}
                  label={language === 'ar' ? 'استمع للتحليل النفسي الصوتي لشخصيتك' : 'Listen to Personality Voice Reading'}
                  variant="compact"
                />
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Strengths Card */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200'
              }`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'نقاط قوتك النفسية الفطرية:' : 'Inherent Strengths:'}</span>
                </div>
                <div className="space-y-2 text-xs text-stone-300">
                  {calculatedResult.strengthsAr?.map((st: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stress Reaction / Growth Tip Card */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-amber-950/20 border-amber-500/25' : 'bg-amber-50/70 border-amber-300'
              }`}>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'شخصيتك تحت الضغط ونقطة التطور:' : 'Under Stress & Growth Area:'}</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-amber-100/90' : 'text-amber-950'}`}>
                  {calculatedResult.stressReactionAr || calculatedResult.growthTipAr}
                </p>
                {calculatedResult.stressReactionAr && (
                  <p className={`text-xs leading-relaxed pt-1 border-t border-amber-500/20 font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    <span className="font-bold text-emerald-400">{language === 'ar' ? 'نصيحة ذهبية: ' : 'Golden Tip: '}</span>
                    {calculatedResult.growthTipAr}
                  </p>
                )}
              </div>

            </div>

            {/* Tailored App Recommendations Matching Personality */}
            {calculatedResult.recommendedActivities && calculatedResult.recommendedActivities.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-300 px-1">
                  <span>{language === 'ar' ? 'أنشطة في «نسمة حياة» موصى بها خصيصاً لشخصيتك:' : 'Tailored App Activities for Your Type:'}</span>
                  <span className="text-[11px] text-emerald-400">
                    {language === 'ar' ? 'ابدأ الآن' : 'Start now'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {calculatedResult.recommendedActivities.map((act: any, idx: number) => {
                    const Icon = act.icon || Sparkles;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          chimeService.playReassuranceChime();
                          onClose();
                          if (onOpenActivity) onOpenActivity(act.id);
                        }}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                          isDark ? 'bg-white/5 hover:bg-emerald-500/15 border-white/10 hover:border-emerald-500/40' : 'bg-white hover:bg-emerald-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs font-bold group-hover:text-emerald-300 transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}>
                            {act.nameAr}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-400 rtl:rotate-180" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-500/15">
              <button
                onClick={() => handleStartTest(selectedTestType)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDark ? 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة الاختبار' : 'Retake Test'}</span>
              </button>

              <button
                onClick={() => setActiveTab('tests_menu')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'ar' ? 'تجربة مقياس آخر 🧠' : 'Try Another Test'}</span>
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {language === 'ar' ? 'سجل نتائج اختباراتك السابقة:' : 'Your Previous Personality Results:'}
            </h4>

            {savedHistory.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border space-y-3 ${
                isDark ? 'bg-white/5 border-white/10 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}>
                <Brain className="w-8 h-8 mx-auto opacity-40 text-emerald-400" />
                <p className="text-xs">
                  {language === 'ar' ? 'لم تقم بإجراء أي اختبار بعد؛ اختر مقياساً من القائمة وابدأ رحلة استكشاف نمطك الآن.' : 'No tests taken yet. Pick one from the menu to discover your personality profile.'}
                </p>
                <button
                  onClick={() => setActiveTab('tests_menu')}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {language === 'ar' ? 'عرض الاختبارات المتوفرة' : 'View Available Tests'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-emerald-300">
                          {item.titleAr || item.titleEn}
                        </span>
                        {item.code && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                            {item.code}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-1">
                        {item.taglineAr || item.taglineEn}
                      </p>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        chimeService.playReassuranceChime();
                        setCalculatedResult(item);
                        setActiveTab('result');
                      }}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                    >
                      {language === 'ar' ? 'عرض التحليل الكامل' : 'View Analysis'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
