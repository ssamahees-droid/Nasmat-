import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { storage } from '../services/storage';
import { AssessmentRecord } from '../types';

interface AssessmentScreenProps {
  onNavigateToContent: () => void;
  onNavigateToSupport: () => void;
  onTriggerSafetyModal: () => void;
}

// 1. Initial Self-Check Questions (Section 10 from Spec)
const INITIAL_CHECK_QUESTIONS = [
  { id: 'q1_mood', label: 'المزاج العام', text: 'كيف تصف حالتك المزاجية على مدار الأيام القليلة الماضية؟', options: [
    { text: 'هادئ ومستقر غالباً', val: 0 },
    { text: 'متقلب بعض الشيء', val: 1 },
    { text: 'يميل للحزن أو الضيق أغلب الوقت', val: 2 },
    { text: 'إحباط شديد مستمر', val: 3 }
  ]},
  { id: 'q2_energy', label: 'مستوى الطاقة', text: 'هل تشعر أن طاقتك الجسدية والنفسية كافية لممارسة يومك؟', options: [
    { text: 'نعم، طاقتي جيدة', val: 0 },
    { text: 'أشعر ببعض الخمول العابر', val: 1 },
    { text: 'أبذل جهداً كبيراً لإتمام المهام العادية', val: 2 },
    { text: 'استنزاف وإنهاك تام', val: 3 }
  ]},
  { id: 'q3_enjoyment', label: 'الاهتمام والاستمتاع', text: 'هل ما زلت تجد متعة أو اهتماماً بالأشياء التي كنت تحب فعلها؟', options: [
    { text: 'نعم، أستمتع بأشيائي المعتادة', val: 0 },
    { text: 'أحياناً يقل استمتاعي', val: 1 },
    { text: 'فقدت المتعة في أغلب الأنشطة', val: 2 },
    { text: 'لا أشعر بأي بهجة على الإطلاق', val: 3 }
  ]},
  { id: 'q4_sleep', label: 'جودة النوم', text: 'كيف هو انتظام نومك في الفترة الأخيرة؟', options: [
    { text: 'نومي مريح ومنتظم', val: 0 },
    { text: 'صعوبة طفيفة في الاستغراق', val: 1 },
    { text: 'استيقاظ متكرر أو نوم مفرط', val: 2 },
    { text: 'أرق شديد ومستمر منذ أيام', val: 3 }
  ]},
  { id: 'q5_focus', label: 'التركيز والذهن', text: 'هل تجد صعوبة في التركيز على دراستك، عملك، أو قراءتك؟', options: [
    { text: 'تركيزي طبيعي ومريح', val: 0 },
    { text: 'تشتت خفيف مع كثرة المهام', val: 1 },
    { text: 'صعوبة واضحة في اتخاذ القرارات', val: 2 },
    { text: 'عجز عن التركيز وتفكير مشوش تماماً', val: 3 }
  ]},
  { id: 'q6_stress', label: 'الضغط والتوتر', text: 'ما مقدار التوتر والضغط الذي تشعر بثقله على كاهلك؟', options: [
    { text: 'طبيعي ومحتمل', val: 0 },
    { text: 'أشعر بضغط متوسط يمكن إدارته', val: 1 },
    { text: 'ضغط متزايد يجعلني سريع الاستثارة', val: 2 },
    { text: 'شعور بالانفجار والتوتر الدائم', val: 3 }
  ]},
  { id: 'q7_relations', label: 'العلاقات والتواصل', text: 'هل تجد رغبة في التواصل مع المحيطين بك أم تفضل العزلة؟', options: [
    { text: 'أتواصل بصورة طبيعية ومريحة', val: 0 },
    { text: 'أميل للهدوء دون قطيعة', val: 1 },
    { text: 'أتجنب الرد ومقابلة الناس', val: 2 },
    { text: 'عزلة تامة وشعور بالغربة عن الكل', val: 3 }
  ]},
  { id: 'q8_daily', label: 'القدرة على المهام اليومية', text: 'كيف ترى قدرتك على تدبير احتياجاتك ومسؤولياتك اليومية؟', options: [
    { text: 'أقوم بها بيسر', val: 0 },
    { text: 'تأخير بسيط في بعض المواعيد', val: 1 },
    { text: 'صعوبة وتراكم للمسؤوليات', val: 2 },
    { text: 'توقف شبه كامل عن العناية بنفسي وبيتي', val: 3 }
  ]}
];

// 2. Standard PHQ-9 (Patient Health Questionnaire - 9) Validated Scale (Section 11)
const PHQ9_QUESTIONS = [
  'قلة الاهتمام أو المتعة في القيام بالأشياء المعتادة',
  'الشعور بالإحباط، الاكتئاب، أو اليأس',
  'صعوبة في النوم، الاستيقاظ المتكرر، أو الإفراط في النوم',
  'الشعور بالتعب والافتقار إلى الطاقة الكافية',
  'ضعف الشهية أو الإفراط في تناول الطعام',
  'الشعور بالسوء تجاه نفسك، أو أنك فاشل أو خذلت نفسك أو عائلتك',
  'صعوبة في التركيز على أشياء مثل قراءة الجريدة أو مشاهدة التلفاز',
  'التحرك أو التحدث ببطء ملحوظ للآخرين، أو العكس (التململ الشديد والحركة المستمرة)',
  'تراودك أفكار بأنك تفضل أن تكون ميتاً، أو أفكار لإيذاء نفسك بأي شكل من الأشكال'
];

const PHQ9_OPTIONS = [
  { text: 'أبداً (0)', val: 0 },
  { text: 'عدة أيام (1)', val: 1 },
  { text: 'أكثر من نصف الأيام (2)', val: 2 },
  { text: 'تقريباً كل يوم (3)', val: 3 }
];

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  onNavigateToContent,
  onNavigateToSupport,
  onTriggerSafetyModal
}) => {
  const [activeMode, setActiveMode] = useState<'picker' | 'initial_check' | 'phq9' | 'result'>('picker');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [latestResult, setLatestResult] = useState<AssessmentRecord | null>(null);

  // Start Initial Check
  const handleStartInitial = () => {
    setActiveMode('initial_check');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  // Start PHQ-9
  const handleStartPHQ9 = () => {
    setActiveMode('phq9');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  // Handle answering Initial check
  const handleAnswerInitial = (questionId: string, val: number) => {
    const updated = { ...answers, [questionId]: val };
    setAnswers(updated);

    if (currentQuestionIndex + 1 < INITIAL_CHECK_QUESTIONS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finish initial check
      calculateInitialResult(updated);
    }
  };

  const calculateInitialResult = (allAnswers: Record<string, number>) => {
    const totalScore = Object.values(allAnswers).reduce((a, b) => a + b, 0);
    const maxScore = INITIAL_CHECK_QUESTIONS.length * 3;

    let resultTitle = 'حالة مستقرة ومتوازنة';
    let resultText = 'إجاباتك تشير إلى أنك تتمتع بمرونة جيدة في التعامل مع ضغوطك اليومية. استمر في الاهتمام بنفسك والحفاظ على عاداتك الإيجابية.';
    let recommendation = 'يمكنك الاستمتاع بمقالات التعرف على الذات والتأمل الهادئ لتعزيز هذا التوازن.';

    if (totalScore >= 12) {
      resultTitle = 'مؤشرات تستحق الانتباه والرعاية الذاتية';
      resultText = '«إجاباتك تشير إلى وجود بعض الأمور التي قد تستحق مزيداً من الانتباه. يمكنك استكشاف المحتوى المناسب أو التفكير في طلب دعم متخصص إذا استمر الأمر أو أثّر على حياتك».';
      recommendation = 'ننصحك بممارسة تمارين التنفس وتخفيف التوتر، والاطلاع على مقالات إدارة الضغوط، والتحدث مع شخص موثوق أو طلب توجيه.';
    } else if (totalScore >= 6) {
      resultTitle = 'بعض التغيرات الطفيفة';
      resultText = 'يبدو أنك تمر ببعض الضغوط العابرة التي تشعر بها من حين لآخر. هذا أمر طبيعي يمر به الجميع.';
      recommendation = 'جرّب جلسات التنفس السريعة ونيل قسط وافر من النوم لاستعادة نشاطك وراحتك.';
    }

    const record: AssessmentRecord = {
      id: 'as_' + Date.now(),
      userId: storage.getUser().id,
      assessmentType: 'initial_check',
      assessmentTitle: 'التقييم المبدئي الخاص بنسمة حياة',
      instrumentVersion: 'v1.0-MVP',
      answers: allAnswers,
      score: totalScore,
      maxScore,
      resultTitle,
      resultText,
      recommendation,
      createdAt: new Date().toISOString()
    };

    storage.saveAssessment(record);
    setLatestResult(record);
    setActiveMode('result');
  };

  // Handle answering PHQ-9
  const handleAnswerPHQ9 = (index: number, val: number) => {
    const qKey = `phq9_q${index + 1}`;
    const updated = { ...answers, [qKey]: val };
    setAnswers(updated);

    // CRITICAL SAFETY CHECK: Question 9 (index 8) is thoughts of death/self-harm
    if (index === 8 && val > 0) {
      // Trigger immediate safety flag! (Section 27)
      onTriggerSafetyModal();
    }

    if (currentQuestionIndex + 1 < PHQ9_QUESTIONS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculatePHQ9Result(updated);
    }
  };

  const calculatePHQ9Result = (allAnswers: Record<string, number>) => {
    const totalScore = Object.values(allAnswers).reduce((a, b) => a + b, 0);
    const maxScore = 27;
    const hasSelfHarmThoughts = (allAnswers['phq9_q9'] || 0) > 0;

    let resultTitle = 'أعراض طفيفة جداً أو غير موجودة (0-4)';
    let resultText = 'تشير الدرجة إلى غياب أعراض الاكتئاب الملحوظة أو أنها في أدنى مستوياتها الطبيعية.';
    let recommendation = 'واصل العناية بصحتك النفسية واستكشاف محتويات الاسترخاء وبناء العادات.';

    if (totalScore >= 20) {
      resultTitle = 'أعراض شديدة (20-27)';
      resultText = 'تشير إجاباتك إلى وجود أعراض شديدة قد تؤثر بدرجة كبيرة على صحتك ونشاطك اليومي. الفحص ليس تشخيصاً طبياً، والنتيجة تدعو لطلب استشارة متخصصة فورية.';
      recommendation = 'نوصيك بشدة بمراجعة طبيب نفسي أو اختصاصي عيادي لتقييم حالتك ووضع خطة علاجية مخصصة ومريحة لك.';
    } else if (totalScore >= 15) {
      resultTitle = 'أعراض متوسطة الشدة إلى مرتفعة (15-19)';
      resultText = 'تشير إجاباتك إلى أعراض واضحة تستحق الاهتمام والمتابعة الجادة ولا ينبغي إهمالها.';
      recommendation = 'يُفضل التواصل مع مختص في الدعم النفسي، واستخدام أدوات التهدئة وتنظيم الروتين.';
    } else if (totalScore >= 10) {
      resultTitle = 'أعراض معتدلة (10-14)';
      resultText = 'هناك علامات ملحوظة للإجهاد النفسي والمزاج المنخفض التي قد تستفيد من التدخل التوعوي أو المشورة.';
      recommendation = 'اطلع على مقالات فهم المشاعر وجدول وقتاً منتظماً للراحة، وفكر في مناقشة الأمر مع مرشد نفسي.';
    } else if (totalScore >= 5) {
      resultTitle = 'أعراض خفيفة (5-9)';
      resultText = 'توجد بعض الأعراض الخفيفة الشائعة مع ضغوط الحياة وتغيرات الفصول أو العمل.';
      recommendation = 'التمارين اليومية، تنظيم النوم، ومشاركة الحديث مع المقربين قد تكون كافية لتجاوز هذه الفترة.';
    }

    const record: AssessmentRecord = {
      id: 'as_' + Date.now(),
      userId: storage.getUser().id,
      assessmentType: 'phq9',
      assessmentTitle: 'فحص أعراض الاكتئاب (PHQ-9)',
      instrumentVersion: 'PHQ-9 Standard Arabic',
      answers: allAnswers,
      score: totalScore,
      maxScore,
      resultTitle,
      resultText,
      recommendation,
      createdAt: new Date().toISOString(),
      safetyFlagTriggered: hasSelfHarmThoughts
    };

    storage.saveAssessment(record);
    setLatestResult(record);
    setActiveMode('result');
  };

  // --- Render Mode: Picker ---
  if (activeMode === 'picker') {
    return (
      <div className="pb-24 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1.5 text-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26332D]">
            قيّم حالتك 📝
          </h1>
          <p className="text-base font-bold text-[#355C4A]">
            خد خطوة لفهم نفسك
          </p>
          <p className="text-xs text-[#52645B]">
            اختار التقييم المناسب ليك من الأدوات المعتمدة بالأسفل:
          </p>
        </div>

        {/* Option 1: Initial Check (التقييم المبدئي) */}
        <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-6 transition-all hover:border-[#8FAF9A] hover:shadow-md space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <h3 className="font-bold text-lg text-[#26332D]">
                  التقييم المبدئي لنسمة حياة
                </h3>
              </div>
              <p className="text-xs text-[#52645B] leading-relaxed">
                أسئلة قصيرة تساعدك تلاحظ حالتك النفسية وطاقتك ونومك بشكل عام دون تعقيد.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#8FAF9A]/20 text-[#355C4A] rounded-xl shrink-0">
              8 أسئلة
            </span>
          </div>

          <div className="p-3 bg-white/70 rounded-2xl border border-[#E8DDCC] text-xs text-[#7D8F85]">
            * ملاحظة هامة: هذا التقييم <strong>ليس تشخيصاً طبياً</strong> وهو مصمم لزيادة الوعي الذاتي فقط.
          </div>

          <button
            onClick={handleStartInitial}
            className="w-full py-3.5 px-4 bg-[#355C4A] hover:bg-[#264235] text-white font-bold text-sm rounded-2xl shadow-xs transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>بدء التقييم المبدئي</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>

        {/* Option 2: PHQ-9 (فحص أعراض الاكتئاب) */}
        <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-6 transition-all hover:border-[#8FAF9A] hover:shadow-md space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌸</span>
                <h3 className="font-bold text-lg text-[#26332D]">
                  فحص أعراض الاكتئاب (PHQ-9)
                </h3>
              </div>
              <p className="text-xs text-[#52645B] leading-relaxed">
                استبيان معتمد عالمياً لفحص أعراض الاكتئاب وشدتها على مدار الأسبوعين الماضيين.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl shrink-0">
              مقياس عالمي 9
            </span>
          </div>

          <div className="p-3 bg-white/70 rounded-2xl border border-[#E8DDCC] text-xs text-[#7D8F85]">
            * ملاحظة: الفحص ليس تشخيصاً، والنتيجة تحتاج إلى تفسير مناسب ولا تغني عن التقييم المتخصص.
          </div>

          <button
            onClick={handleStartPHQ9}
            className="w-full py-3.5 px-4 bg-[#FAF7F0] hover:bg-[#E8DDCC]/50 text-[#355C4A] border border-[#355C4A]/40 font-bold text-sm rounded-2xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>بدء فحص PHQ-9</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>

        {/* Safety Note */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>تذكير بالأمان:</strong> إذا كنت تشعر بأفكار لإيذاء نفسك أو يمر أحد المقربين بحالة حرجة، يمكنك الانتقال فوراً إلى <button onClick={onTriggerSafetyModal} className="underline font-bold text-amber-900 hover:text-black">مسار الأمان وخطوط الطوارئ</button>.
          </div>
        </div>
      </div>
    );
  }

  // --- Render Mode: Initial Check Questions ---
  if (activeMode === 'initial_check') {
    const q = INITIAL_CHECK_QUESTIONS[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / INITIAL_CHECK_QUESTIONS.length) * 100);

    return (
      <div className="pb-24 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
          <button
            onClick={() => setActiveMode('picker')}
            className="text-xs font-bold text-[#52645B] hover:text-[#26332D] flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            <span>إلغاء التقييم</span>
          </button>
          <span className="text-xs font-semibold text-[#355C4A]">
            سؤال {currentQuestionIndex + 1} من {INITIAL_CHECK_QUESTIONS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#E8DDCC]/50 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#355C4A] h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Box */}
        <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#355C4A]">محور {q.label}</span>
            <h2 className="text-lg sm:text-xl font-bold text-[#26332D] leading-snug">
              {q.text}
            </h2>
          </div>

          <div className="space-y-2.5 pt-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswerInitial(q.id, opt.val)}
                className="w-full p-4 bg-white/90 hover:bg-[#355C4A] hover:text-white border border-[#E8DDCC] rounded-2xl text-right transition-all text-sm font-medium leading-relaxed flex items-center justify-between group active:scale-[0.99]"
              >
                <span>{opt.text}</span>
                <span className="w-6 h-6 rounded-full border border-[#D5CEBE] group-hover:border-white flex items-center justify-center text-xs opacity-60">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Render Mode: PHQ-9 Questions ---
  if (activeMode === 'phq9') {
    const qText = PHQ9_QUESTIONS[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / PHQ9_QUESTIONS.length) * 100);
    const isCrisisQuestion = currentQuestionIndex === 8;

    return (
      <div className="pb-24 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
          <button
            onClick={() => setActiveMode('picker')}
            className="text-xs font-bold text-[#52645B] hover:text-[#26332D] flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            <span>إلغاء الفحص</span>
          </button>
          <span className="text-xs font-semibold text-[#355C4A]">
            سؤال {currentQuestionIndex + 1} من {PHQ9_QUESTIONS.length}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full bg-[#E8DDCC]/50 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#355C4A] h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Box */}
        <div className={`border rounded-3xl p-6 sm:p-8 space-y-5 ${
          isCrisisQuestion ? 'bg-amber-50/60 border-amber-200' : 'bg-[#FAF7F0] border-[#E8DDCC]'
        }`}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#355C4A]">
              خلال الأسبوعين الماضيين، كم مرة شعرت بـ:
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#26332D] leading-snug">
              «{qText}»
            </h2>
          </div>

          <div className="space-y-2.5 pt-2">
            {PHQ9_OPTIONS.map((opt) => (
              <button
                key={opt.val}
                onClick={() => handleAnswerPHQ9(currentQuestionIndex, opt.val)}
                className="w-full p-4 bg-white/90 hover:bg-[#355C4A] hover:text-white border border-[#E8DDCC] rounded-2xl text-right transition-all text-sm font-medium leading-relaxed flex items-center justify-between group active:scale-[0.99]"
              >
                <span>{opt.text}</span>
                <span className="w-6 h-6 rounded-full border border-[#D5CEBE] group-hover:border-white flex items-center justify-center text-xs opacity-60">
                  {opt.val}
                </span>
              </button>
            ))}
          </div>

          {isCrisisQuestion && (
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-900 leading-normal">
              إذا كنت تواجه أفكاراً صعبة أو رغبة في إنهاء حياتك، يُرجى التحدث فوراً مع أحد المقربين أو طلب المساعدة الطبية دون تردد.
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Render Mode: Result View ---
  if (activeMode === 'result' && latestResult) {
    return (
      <div className="pb-24 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
          <button
            onClick={() => setActiveMode('picker')}
            className="text-xs font-bold text-[#355C4A] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إجراء تقييم آخر</span>
          </button>
          <span className="text-xs text-[#52645B] font-mono">
            {new Date(latestResult.createdAt).toLocaleDateString('ar-EG')}
          </span>
        </div>

        {/* Result Card */}
        <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 bg-[#8FAF9A]/20 text-[#355C4A] rounded-xl">
              {latestResult.assessmentTitle}
            </span>
            <div className="text-sm font-mono font-bold text-[#26332D]">
              النتيجة: {latestResult.score} / {latestResult.maxScore}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#26332D]">
              {latestResult.resultTitle}
            </h2>
            <div className="p-4 bg-white/80 rounded-2xl border border-[#E8DDCC] text-sm text-[#35453E] leading-relaxed">
              {latestResult.resultText}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#355C4A]">الخطوة المقترحة:</div>
            <p className="text-xs text-[#52645B] leading-relaxed">
              {latestResult.recommendation}
            </p>
          </div>

          {/* Strict non-diagnostic disclaimer */}
          <div className="p-3.5 bg-stone-100/80 rounded-2xl text-[11px] text-[#7D8F85] leading-relaxed">
            * هذا التقييم أداة للاسترشاد والملاحظة الذاتية ولا يُعتبر تشخيصاً طبياً أو نفسياً معتمداً. تم حفظ هذه النتيجة في شاشة «رحلتي» ويمكنك حذفها في أي وقت.
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateToContent}
              className="flex-1 py-3.5 px-4 bg-[#355C4A] hover:bg-[#264235] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>استكشف المحتوى المناسب</span>
            </button>

            <button
              onClick={onNavigateToSupport}
              className="py-3.5 px-4 bg-white hover:bg-stone-50 text-[#355C4A] border border-[#E8DDCC] font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>طلب دعم أو توجيه</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
