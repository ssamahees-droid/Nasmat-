import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Heart, 
  Compass, 
  Battery, 
  Brain, 
  ShieldCheck, 
  Smile, 
  BookOpen, 
  Wind,
  Layers
} from 'lucide-react';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface PersonalDiscoveryQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTool?: (toolId: string) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    emoji: string;
    category: 'energy' | 'overthinking' | 'boundaries' | 'balanced';
    score: number;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'كيف تشعر بطاقتك الجسدية والذهنية في أغلب أوقات اليوم؟',
    subtitle: 'راقب جسدك بدون لوم أو مقارنة بالأمس',
    options: [
      { text: 'أشعر باستنزاف وثقل، كأن بطاريتي تنفد بسرعة كبيرة', emoji: '🪫', category: 'energy', score: 3 },
      { text: 'عقلي في حالة عمل وسباق دائم لا يتوقف حتى وقت النوم', emoji: '⚡', category: 'overthinking', score: 3 },
      { text: 'مشتت ومضغوط بسبب مطالب الآخرين وصعوبة الرفض', emoji: '👥', category: 'boundaries', score: 3 },
      { text: 'أشعر باتزان نسبي وقدرة مقبولة على إنجاز مهامي بهدوء', emoji: '🌿', category: 'balanced', score: 1 }
    ]
  },
  {
    id: 2,
    question: 'عندما تواجه فكرة مقلقة أو خبراً مربكاً، ما هو رد فعلك التلقائي؟',
    subtitle: 'أول ما يطرأ على سلوكك وتفكيرك',
    options: [
      { text: 'أصنع سيناريوهات كارثية وأستغرق في تحليل أخطاء الماضي والمستقبل', emoji: '🌪️', category: 'overthinking', score: 3 },
      { text: 'أنسحب تماماً ولا أجد في نفسي طاقة للتفاعل أو التحدث مع أحد', emoji: '🛋️', category: 'energy', score: 3 },
      { text: 'أشعر بالذنب والمسؤولية عن إصلاح كل شيء للجميع', emoji: '🥺', category: 'boundaries', score: 3 },
      { text: 'آخذ نفساً، وأحاول التفرقة بين ما بيدي وما هو خارج إرادتي', emoji: '🍃', category: 'balanced', score: 1 }
    ]
  },
  {
    id: 3,
    question: 'كيف تصف علاقتك بالحدود وقول "لا" في هذه الفترة؟',
    subtitle: 'المساحة الشخصية مع الأهل والأصدقاء والعمل',
    options: [
      { text: 'أوافق على طلبات تفوق طاقتي خجلاً وخوفاً من إفساد العلاقات', emoji: '🛡️', category: 'boundaries', score: 3 },
      { text: 'حتى لو رفضت، يظل صوت تأنيب الضمير يلاحقني لساعات', emoji: '🧠', category: 'overthinking', score: 2 },
      { text: 'طاقتي منهكة لدرجة أنني غير قادر حتى على فتح الرسائل', emoji: '🔋', category: 'energy', score: 3 },
      { text: 'أضع حدوداً واضحة باحترام ورفق، وأحمي مساحتي الشخصية', emoji: '✨', category: 'balanced', score: 1 }
    ]
  },
  {
    id: 4,
    question: 'أين تسكن مشاعرك في جسدك خلال الأيام الأخيرة؟',
    subtitle: 'إشارات الجسد تتحدث قبل الكلمات',
    options: [
      { text: 'شد في الرقبة والأكتاف وصداع ناتج عن كثرة التفكير', emoji: '💆‍♂️', category: 'overthinking', score: 3 },
      { text: 'خمول عام، نَفَس متثاقل، ورغبة ملحة في النوم الطويل', emoji: '🛌', category: 'energy', score: 3 },
      { text: 'انقباض في الصدر أو المعدة بسبب توتر العلاقات والخلافات', emoji: '💔', category: 'boundaries', score: 3 },
      { text: 'استرخاء معتدل ووعي بإيقاع التنفس وحركة الجسد', emoji: '🧘', category: 'balanced', score: 1 }
    ]
  },
  {
    id: 5,
    question: 'ما الذي تحتاجه روحك ونفسك أكثر من أي شيء آخر الآن؟',
    subtitle: 'البوصلة الداخلية لاحتياجك الحقيقي',
    options: [
      { text: 'استراحة حقيقية وإعادة شحن لبطارية الجسد والنفس دون مهام', emoji: '☕', category: 'energy', score: 3 },
      { text: 'هدوء ذهني وفصل أسلاك التفكير والاجترار المستمر', emoji: '🌌', category: 'overthinking', score: 3 },
      { text: 'أمان ومساحة خاصة خالية من الضغط والمطالب الخارجية', emoji: '🏡', category: 'boundaries', score: 3 },
      { text: 'الاستمرار في خطواتي الواعية وتعزيز الامتنان والنمو الداخلي', emoji: '🌱', category: 'balanced', score: 1 }
    ]
  }
];

interface QuizResult {
  title: string;
  stateBadge: string;
  emoji: string;
  description: string;
  insight: string;
  actionSteps: string[];
  recommendedTools: {
    id: string;
    title: string;
    desc: string;
    emoji: string;
  }[];
}

const RESULTS_MAP: Record<string, QuizResult> = {
  energy: {
    title: 'حالة استنزاف الطاقة والبطارية النفسية',
    stateBadge: 'بطارية منخفضة تحتاج شحن',
    emoji: '🪫',
    description: 'تشير إجاباتك إلى أن جهازك العصبي وجسدك يعملان في وضع توفير الطاقة الأخير. هذا ليس كسلاً، بل إشارة صريحة من جسدك يطلب التوقف عن الركض وإعادة شحن الموارد.',
    insight: '«عندما تنفد بطارية هاتفك تضعه على الشاحن دون لوم.. افعل الشيء نفسه مع نفسك اليوم.»',
    actionSteps: [
      'طبّق استراحة مصغّرة لمدة 15 دقيقة خالية تماماً من الشاشات والقرارات.',
      'احذف أو أجّل مهمة واحدة غير عاجلة من جدولك اليوم.',
      'اشرب كوب ماء ببطء، واسمح لنفسك بالنوم مبكراً الليلة نصف ساعة إضافية.'
    ],
    recommendedTools: [
      { id: 'energy-budget', title: 'ميزانية الطاقة الشخصية', desc: 'تحديد مصارف الطاقة ومصادر التعبئة وتوزيع الجهد', emoji: '🔋' },
      { id: 'soundscape', title: 'استوديو البيئات الصوتية', desc: 'أصوات طبيعية هادئة لتهدئة الدماغ والمساعدة على النوم', emoji: '🎧' },
      { id: 'body-scan', title: 'مسح الجسد الواعي', desc: 'تمرين إرخاء العضلات المشدودة وتفريغ الإجهاد', emoji: '✨' }
    ]
  },
  overthinking: {
    title: 'حالة الضجيج الذهني والتفكير الزائد',
    stateBadge: 'تفكير متسارع واجترار',
    emoji: '🌪️',
    description: 'عقلك في حالة يقظة دفاعية مفرطة، يحاول التنبؤ بكل السيناريوهات لحمايتك. المشكلة أن تحليل الأمور المتواصل يستهلك وقودك العاطفي ويصنع أزمات افتراضية.',
    insight: '«الأفكار غيوم عابرة في سماء وعيك، وليست حقائق ثابتة يجب تصديقها والركض وراءها.»',
    actionSteps: [
      'دوّن الأفكار المزعجة في ورقة أو في مدونة الأفكار لتفريغها من رأسك.',
      'اسأل نفسك: هل أستطيع فعل شيء عملي حيال هذا الأمر في الدقائق الـ 10 القادمة؟ إن كان لا، اتركه للحاضر.',
      'جرّب تمرين فرقعة فقاعات التوتر أو أوراق الشجر على النهر.'
    ],
    recommendedTools: [
      { id: 'thought-journal', title: 'مدونة الأفكار والخواطر', desc: 'مساحة لتفكيك الأفكار وإعادة صياغتها بمسافة واعية', emoji: '✍️' },
      { id: 'gwaya-hekay', title: 'لعبة جوايا حكاية', desc: 'فصل ما حدث فعلاً عن السيناريوهات الدرامية للعقل', emoji: '📖' },
      { id: 'fun-games', title: 'واحة البهجة والألعاب', desc: 'فرقعة فقاعات القلق ونكت تخفف حدة التفكير', emoji: '🎈' }
    ]
  },
  boundaries: {
    title: 'حالة إجهاد العلاقات والحدود الشخصية',
    stateBadge: 'تداخل حدود واستنزاف عطاء',
    emoji: '🛡️',
    description: 'أنت تعطي وتستجيب للآخرين على حساب سلامك الداخلي. الخوف من إحباط الناس أو قول "لا" جعلك تحمّل نفسك مسؤوليات ليست ملكك، ما يولّد شعوراً بالثقل والوحدة.',
    insight: '«قول "لا" للآخرين في الوقت المناسب.. يعني قول "نعم" لنفسك وصحتك النفسية.»',
    actionSteps: [
      'تدرّب على جملة رفض لطيفة وصريحة: "يسعدني مساعدتك، لكن وقتي الحالي لا يسمح".',
      'امنح نفسك مهلة قبل الموافقة التلقائية: "سأراجع جدولي وأرد عليك".',
      'تذكّر أن حدودك ليست أنانية، بل هي الجدار الذي يحمي قدرتك على العطاء الحقيقي.'
    ],
    recommendedTools: [
      { id: 'boundary-builder', title: 'باني الحدود الشخصية', desc: 'تمارين عملية لصياغة الحدود دون تأنيب ضمير', emoji: '🧱' },
      { id: 'conflict-without-war', title: 'خلاف بدون معركة', desc: 'الحوار الصحي دون هجوم أو انسحاب وحماية كرامتك', emoji: '🕊️' },
      { id: 'healing-journey', title: 'اتأذيت.. إزاي أتعافى؟', desc: 'تفكيك الخذلان وإعادة بناء الأمان الداخلي', emoji: '🩹' }
    ]
  },
  balanced: {
    title: 'حالة التوازن والوعي المتزن',
    stateBadge: 'اتزان وحضور طيب',
    emoji: '🌿',
    description: 'أنت في مساحة طيبة من الوعي والاتصال باللحظة الحاضرة. تمتلك مرونة نفسية تسمح لك باستيعاب المطبات اليومية دون تهويل، وتعرف كيف تصغي لجسدك وتضع حدودك.',
    insight: '«الاتزان ليس غياب العواصف، بل هو الشجرة العميقة الجذور التي تتمايل مع الرياح دون أن تنكسر.»',
    actionSteps: [
      'سجّل لحظة امتنان لثلاث نعم أحاطت بك اليوم لترسيخ هذا الشعور.',
      'شارك كلمة طيبة أو دعماً هادئاً لشخص قريب قد يكون يمر بيوم صعب.',
      'حافظ على روتين التنفس الواعي والحركة الخفيفة لحماية هذا الاتزان.'
    ],
    recommendedTools: [
      { id: 'mindfulness-studio', title: 'استوديو اليقظة الذهنية', desc: 'تمارين التجذر والحواس الخمس لتعزيز الحضور', emoji: '🧘' },
      { id: 'personal-plan', title: 'خطة نسمة حياة الشخصية', desc: 'بناء روتين وقائي مستدام للشهور القادمة', emoji: '🌱' },
      { id: 'daily-wisdom', title: 'حكمة وتأمل اليوم', desc: 'جرعة يومية ملهمة من البصيرة والسكينة', emoji: '💡' }
    ]
  }
};

export const PersonalDiscoveryQuizModal: React.FC<PersonalDiscoveryQuizModalProps> = ({
  isOpen,
  onClose,
  onOpenTool
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, { category: string; score: number }>>({});
  const [showResult, setShowResult] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQ = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (category: string, score: number) => {
    const updatedAnswers = { ...answers, [currentStep]: { category, score } };
    setAnswers(updatedAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, { category: string; score: number }>) => {
    const categoryTotals: Record<string, number> = {
      energy: 0,
      overthinking: 0,
      boundaries: 0,
      balanced: 0
    };

    Object.values(finalAnswers).forEach(ans => {
      categoryTotals[ans.category] = (categoryTotals[ans.category] || 0) + ans.score;
    });

    let topCategory = 'balanced';
    let maxScore = -1;

    // Prioritize non-balanced first if they have high scores
    (['energy', 'overthinking', 'boundaries', 'balanced'] as const).forEach(cat => {
      if (categoryTotals[cat] > maxScore) {
        maxScore = categoryTotals[cat];
        topCategory = cat;
      }
    });

    // Save result to journey log
    const res = RESULTS_MAP[topCategory];
    storage.addNote(`🧭 اختبار الاستكشاف الذاتي: نتيجتي الحالية هي «${res.title}». نصيحة نسمة: ${res.insight}`);

    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  // Determine result category
  const getDominantCategory = (): string => {
    const categoryTotals: Record<string, number> = {
      energy: 0,
      overthinking: 0,
      boundaries: 0,
      balanced: 0
    };
    Object.values(answers).forEach(ans => {
      categoryTotals[ans.category] = (categoryTotals[ans.category] || 0) + ans.score;
    });
    let top = 'balanced';
    let max = -1;
    (['energy', 'overthinking', 'boundaries', 'balanced'] as const).forEach(cat => {
      if (categoryTotals[cat] > max) {
        max = categoryTotals[cat];
        top = cat;
      }
    });
    return top;
  };

  const currentResult = RESULTS_MAP[getDominantCategory()] || RESULTS_MAP.energy;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_12px_45px_-10px_rgba(58,90,64,0.3)] overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-inner animate-pulse">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  اختبار الاستكشاف الذاتي
                </h2>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  تشخيص نفسي دافئ
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5 font-medium">
                ٥ أسئلة سريعة وبسيطة لفهم حالتك النفسية الحالية وتوجيهك لما تحتاجه بدقة
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          
          {!showResult ? (
            <div className="space-y-4 animate-fade-in">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-[#58645C]">
                <span className="font-bold text-[#3A5A40]">سؤال {currentStep + 1} من {totalQuestions}</span>
                <span className="font-mono">{Math.round(((currentStep + 1) / totalQuestions) * 100)}%</span>
              </div>
              
              <div className="w-full bg-[#E5DACB]/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#3A5A40] h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="p-5 bg-white border border-[#E5DACB] rounded-3xl shadow-2xs space-y-2">
                <h3 className="text-base sm:text-lg font-black text-[#283618] leading-relaxed">
                  {currentQ.question}
                </h3>
                <p className="text-xs text-[#58645C] font-medium">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.category, opt.score)}
                    className="w-full p-4 rounded-2xl border border-[#E5DACB] hover:border-[#3A5A40] bg-white hover:bg-[#F2ECE3] text-right transition-all flex items-center justify-between group shadow-2xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {opt.emoji}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#283618] group-hover:text-[#3A5A40] transition-colors leading-relaxed">
                        {opt.text}
                      </span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-[#3A5A40] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* Back navigation if needed */}
              {currentStep > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="py-1.5 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    ← السؤال السابق
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* RESULTS VIEW */
            <div className="space-y-5 animate-fade-in">
              {/* Primary Result Banner */}
              <div className="p-6 bg-gradient-to-b from-white via-[#FAF7F2] to-white border-2 border-[#3A5A40]/40 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5DACB] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{currentResult.emoji}</span>
                    <div>
                      <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] font-black px-2.5 py-0.5 rounded-full">
                        {currentResult.stateBadge}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-[#283618] mt-1">
                        {currentResult.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#283618] font-medium leading-relaxed">
                  {currentResult.description}
                </p>

                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs font-bold text-amber-950 leading-relaxed shadow-2xs">
                  {currentResult.insight}
                </div>
              </div>

              {/* 3 Practical Action Steps */}
              <div className="p-5 bg-white border border-[#E5DACB] rounded-3xl space-y-3 shadow-2xs">
                <h4 className="font-black text-sm text-[#283618] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#DDA15E]" />
                  <span>خطواتك العلاجية الموصى بها اليوم:</span>
                </h4>
                <div className="space-y-2">
                  {currentResult.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#283618] font-bold">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tools with Direct Links */}
              <div className="space-y-2.5">
                <h4 className="font-black text-xs text-[#283618]">
                  أدوات نسمة المقترحة لحالتك خصيصاً:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {currentResult.recommendedTools.map((tool) => (
                    <div 
                      key={tool.id}
                      className="p-3.5 bg-white border border-[#E5DACB] hover:border-[#3A5A40] rounded-2xl text-right transition-all group flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <span className="text-2xl block mb-1 group-hover:scale-105 transition-transform">{tool.emoji}</span>
                        <div className="font-black text-xs text-[#283618] group-hover:text-[#3A5A40] transition-colors">{tool.title}</div>
                        <div className="text-[10px] text-[#58645C] mt-1 leading-snug">{tool.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="py-2.5 px-4 bg-white hover:bg-stone-50 border border-[#E5DACB] text-[#283618] font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-3 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl shadow-xs transition-transform active:scale-95"
                >
                  تم، ابدأ تطبيق التوصيات 🌿
                </button>
              </div>
            </div>
          )}

          <TakeawayResultCard
            quote="«أعظم خطوة نحو الشفاء.. هي الشجاعة في الاعتراف بما تحتاجه روحك الآن دون قناع»"
            onTryAnother={handleRestart}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
