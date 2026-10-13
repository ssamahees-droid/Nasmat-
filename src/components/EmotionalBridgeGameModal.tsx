import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Volume2, 
  VolumeX, 
  Copy, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  Award
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

interface BridgeStone {
  id: string;
  order: number; // 1 to 4
  stepTitle: string;
  phrase: string;
  isToxic?: boolean;
  toxicFeedback?: string;
  explanation: string;
}

interface BridgeScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  gapLabel: string;
  personA: string;
  personB: string;
  stones: BridgeStone[];
  correctSequence: string[]; // Stone IDs in correct order
  takeawayFormula: string;
}

const BRIDGE_SCENARIOS: BridgeScenario[] = [
  {
    id: 'scenario_1',
    title: 'وضع حد صحي لصديق يطلب الكثير في أوقات متأخرة',
    category: 'حدود العلاقات',
    description: 'صديق مقرب يتصل بك بعد منتصف الليل ويطلب منك مهام ومحادثات طويلة تمنعك من النوم وتهلك طاقتك.',
    gapLabel: 'فجوة بين الرغبة في النوم والخوف من جرح مشاعره',
    personA: 'أنت (مرهق)',
    personB: 'الصديق (غافل عن تعبك)',
    stones: [
      {
        id: 's1_fact',
        order: 1,
        stepTitle: '١. تأكيد المعزة وذكر الواقعة بهدوء',
        phrase: '«أنا أقدّر قربنا جداً وأعتز بمحادثاتنا، لكن في الأيام الماضية رنين الاتصال بعد ١١ مساءً أصبح يوقظني ويقطع نومي.»',
        explanation: 'البدء بتأكيد المودة وذكر الواقعة المحددة دون اتهامات يمنع الطرف الآخر من اتخاذ وضعية الدفاع.'
      },
      {
        id: 's1_feel',
        order: 2,
        stepTitle: '٢. التعبير عن الأثر الذاتي بصيغة الأنا',
        phrase: '«طاقتي الجسدية أصبحت مستنزفة في الصباح ولا أستطيع التركيز في عملي وصحتي.»',
        explanation: 'الحديث عن أثر الموقف على طاقتك أنت يمنع الصدام ويركز على حاجتك الإنسانية للراحة.'
      },
      {
        id: 's1_boundary',
        order: 3,
        stepTitle: '٣. صياغة الحد بوضوح دون تبرير معقد',
        phrase: '«لذا سأبدأ بتفعيل وضع الصامت لهاتفي من العاشرة مساءً، ولن أستطيع الرد على أي مكالمات حتى الصباح.»',
        explanation: 'الحدود الصحية هي إخبار الشخص بما ستفعله أنت لحماية نفسك، وليست محاولة للتحكم فيه.'
      },
      {
        id: 's1_bridge',
        order: 4,
        stepTitle: '٤. فتح بديل دافئ للتواصل',
        phrase: '«يسعدني جداً أن نتحدث في المساء الباكر أو في عطلة نهاية الأسبوع بروقان وهدوء.»',
        explanation: 'تقديم بديل عملي يثبت أنك لا ترفض الشخص بل تعيد ضبط توقيت التواصل بطريقة مستدامة.'
      },
      {
        id: 's1_toxic',
        order: -1,
        stepTitle: '❌ مسار اللوم والانفجار',
        phrase: '«أنت دائماً أناني ولا تحترم مواعيدي ولا تراعي أن عندي حياة وعمل!»',
        isToxic: true,
        toxicFeedback: 'استخدام التعميم ولغة الاتهام («أنت دائماً») يكسر الجسر ويشعل شجاراً دفاعياً ينسف الصداقة.',
        explanation: 'اللغة الاتهامية تثير الدفاع فوراً وتشتت الانتباه عن المشكلة الحقيقية.'
      }
    ],
    correctSequence: ['s1_fact', 's1_feel', 's1_boundary', 's1_bridge'],
    takeawayFormula: 'المعادلة الذهبية: المعزة أولاً + الواقعة المحددة + أثري الذاتي + الحد الواضح + البديل الدافئ 🌉'
  },
  {
    id: 'scenario_2',
    title: 'التعامل مع نقد قاسي وجارح في العمل أو الأسرة',
    category: 'الذكاء العاطفي والحماية',
    description: 'شخص وجه لك نقداً أمام الآخرين بنبرة تقليل وسخرية: "عملك متواضع ولم تتطور أبداً".',
    gapLabel: 'فجوة بين الإهانة والرغبة في الرد العنيف أو الانكسار',
    personA: 'أنت (مستفز)',
    personB: 'الناقد (قاسي)',
    stones: [
      {
        id: 's2_fact',
        order: 1,
        stepTitle: '١. فصل الأسلوب عن المضمون وهدوء الأنفاس',
        phrase: '«أنا مهتم دائماً بتطوير جودة عملي، لكن الطريقة والنبرة التي طُرح بها الكلام الآن غير مقبولة بالنسبة لي.»',
        explanation: 'وضع خط أحمر فوري على الأسلوب الجارح دون إنكار الرغبة في التطور يحميك دون تصعيد.'
      },
      {
        id: 's2_feel',
        order: 2,
        stepTitle: '٢. تسمية الموقف بدقة وثبات',
        phrase: '«الحديث العام المبهم يضيع الفائدة ويخلق توتراً لا داعي له بيننا.»',
        explanation: 'تسمية السلوك كأمر غير بنّاء تنزع منه سلاح الترهيب وتضعه في إطاره المهني السليم.'
      },
      {
        id: 's2_boundary',
        order: 3,
        stepTitle: '٣. طلب الملاحظات المحددة على انفراد',
        phrase: '«إذا كان لديك ملاحظات محددة ونقاط قابلة للتنفيذ، يسعدني مناقشتها معك على انفراد في جلسة هادئة.»',
        explanation: 'نقل النقاش إلى انفراد يسحب الجمهور ويجبر الطرف الآخر على التحول للمنطقية أو الانسحاب.'
      },
      {
        id: 's2_bridge',
        order: 4,
        stepTitle: '٤. تثبيت القيمة الذاتية وإنهاء المشهد بحزم',
        phrase: '«حتى يحين ذلك، سأستمر في مساري وفق المعايير المعتمدة.»',
        explanation: 'إغلاق الموقف بثقة يمنع التمادي ويحفظ كرامتك النفسية كاملة.'
      },
      {
        id: 's2_toxic',
        order: -1,
        stepTitle: '❌ مسار التقليل المتبادل',
        phrase: '«انظر إلى نفسك أولاً قبل أن تتحدث عن غيرك، عملك كله أخطاء وفشل!»',
        isToxic: true,
        toxicFeedback: 'الانزلاق إلى مستوى التقليل المتبادل يسلبك الحق الأخلاقي ويحولك من صاحب حق إلى طرف في مستنقع.',
        explanation: 'الرد بالمثل يشتت القضية ويجعلك تبدو غير ناضج.'
      }
    ],
    correctSequence: ['s2_fact', 's2_feel', 's2_boundary', 's2_bridge'],
    takeawayFormula: 'معادلة الحماية: رفض الأسلوب بحزم + طلب التحديد على انفراد + عدم إعطاء وقود للهجوم 🛡️'
  },
  {
    id: 'scenario_3',
    title: 'التعبير عن الشعور بالإهمال للشريك دون هجوم',
    category: 'التواصل العاطفي',
    description: 'تشعر بأن شريك حياتك غارق في هاتفه ومشاغله ولم يعد يجلس معك أو يسألك عن يومك منذ فترة.',
    gapLabel: 'فجوة الصمت والتراكم الداخلي',
    personA: 'أنت (تشعر بالوحدة)',
    personB: 'الشريك (غارق في المشاغل)',
    stones: [
      {
        id: 's3_fact',
        order: 1,
        stepTitle: '١. التعبير عن الشوق بدلاً من الاتهام',
        phrase: '«أنا أفتقد وقتنا المشترك وحديثنا الدافئ الذي كنا نقضيه معاً.»',
        explanation: 'البدء بالشوق والحب يفتح قلب الطرف الآخر فوراً بدلاً من بدء الحوار بلهجة المحكمة.'
      },
      {
        id: 's3_feel',
        order: 2,
        stepTitle: '٢. مشاركة الضعف الإنساني بأمانة',
        phrase: '«في الفترة الأخيرة، أشعر ببعض الوحدة والمسافة بيننا عندما يمر المساء كاملاً في صمت.»',
        explanation: 'مشاركة مشاعر الضعف الصادقة تستدعي التعاطف والحماية، بينما الهجوم يستدعي الصد.'
      },
      {
        id: 's3_boundary',
        order: 3,
        stepTitle: '٣. تحديد حاجة ملموسة وبسيطة',
        phrase: '«أحتاج منك أن نخصص نصف ساعة يومياً دون شاشات، نتشارك فيها فنجان شاي ونتحدث عن يومنا.»',
        explanation: 'الناس لا تقرأ الأفكار؛ التحديد الدقيق لما تحتاجه يساعد الطرف الآخر على تلبيته بسهولة.'
      },
      {
        id: 's3_bridge',
        order: 4,
        stepTitle: '٤. السؤال عن ظروفه والتعاون المشترك',
        phrase: '«ما رأيك؟ وهل هناك ما يشغلك أو يضغطك تحب أن تشاركني إياه لنساعد بعضنا؟»',
        explanation: 'السؤال عن ظروفه يحول الموقف من طلب إلى شراكة عاطفية حقيقية تقوي الروابط.'
      },
      {
        id: 's3_toxic',
        order: -1,
        stepTitle: '❌ مسار الصمت العقابي أو التلميح',
        phrase: '«أنا لست مهمة عندك أصلاً، الهاتف والناس كلهم أهم مني في حياتك!»',
        isToxic: true,
        toxicFeedback: 'اللوم والتعميم يجعل الطرف الآخر يشعر بالعجز والانسحاب أو الانفجار الدفاعي.',
        explanation: 'التلميح الهجومي يبني جدراناً بدلاً من الجسور.'
      }
    ],
    correctSequence: ['s3_fact', 's3_feel', 's3_boundary', 's3_bridge'],
    takeawayFormula: 'معادلة القرب: مشاركة الشوق + تسمية المشاعر بهشاشة + طلب محدد وقابل للتنفيذ + اهتمام متبادل 🤍'
  }
];

interface EmotionalBridgeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmotionalBridgeGameModal: React.FC<EmotionalBridgeGameModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedStoneIds, setSelectedStoneIds] = useState<string[]>([]);
  const [feedbackError, setFeedbackError] = useState<{ message: string; explanation: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());

  if (!isOpen) return null;

  const currentScenario = BRIDGE_SCENARIOS[activeScenarioIdx];

  const handleSelectStone = (stone: BridgeStone) => {
    if (selectedStoneIds.includes(stone.id)) return;

    if (stone.isToxic) {
      // Audio or vibration cue
      chimeService.playBubblePopChime();
      setFeedbackError({
        message: stone.toxicFeedback || 'هذا الخيار يزيد من اتساع الفجوة بدلاً من بناء الجسر.',
        explanation: stone.explanation
      });
      return;
    }

    // Check if selecting in correct sequence
    const nextExpectedIndex = selectedStoneIds.length;
    const expectedStoneId = currentScenario.correctSequence[nextExpectedIndex];

    if (stone.id === expectedStoneId) {
      // Correct stone placed
      chimeService.playStoneDropChime();
      setFeedbackError(null);
      const nextSequence = [...selectedStoneIds, stone.id];
      setSelectedStoneIds(nextSequence);

      if (nextSequence.length === currentScenario.correctSequence.length) {
        // Complete bridge
        chimeService.playSuccessChime();
        setIsCompleted(true);
      }
    } else {
      // Stone belongs to bridge but placed out of logical pedagogical sequence
      setFeedbackError({
        message: 'هذه خطوة صحيحة، لكن ترتيبها في بناء الجسر يحتاج تمهيداً سابقاً أولاً.',
        explanation: 'ابنِ الجسر بالتسلسل: ابدأ بالتأسيس ثم التعبير عن الأثر ثم وضع الحاجة ثم بناء الشراكة.'
      });
    }
  };

  const handleResetCurrentScenario = () => {
    setSelectedStoneIds([]);
    setFeedbackError(null);
    setIsCompleted(false);
  };

  const handleNextScenario = () => {
    const next = (activeScenarioIdx + 1) % BRIDGE_SCENARIOS.length;
    setActiveScenarioIdx(next);
    setSelectedStoneIds([]);
    setFeedbackError(null);
    setIsCompleted(false);
  };

  const handleCopyFormula = () => {
    const text = `${currentScenario.takeawayFormula}\n\n— درس من لعبة بناء الجسر العاطفي في تطبيق نسمة حياة 🌿🌉`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleSaveToJournal = () => {
    storage.addThoughtPost({
      title: `قاعدة تواصل: ${currentScenario.title}`,
      content: currentScenario.takeawayFormula,
      category: 'gentleness',
      mood: 'good',
      promptUsed: 'حكمة بناء الجسور العاطفية والتواصل الصحي',
      isFavorite: true
    });
    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 2500);
  };

  const bridgeProgress = (selectedStoneIds.length / currentScenario.correctSequence.length) * 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#111A15] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-950/40">
              🌉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «بناء الجسر العاطفي»
                </h2>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ذكاء عاطفي وتواصل صحي
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                رتّب حجارة التواصل الحكيمة لبناء جسر آمن يعبر فوق فجوة الخلاف وسوء الفهم 🤝
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = chimeService.toggleMute();
                setIsMuted(next);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleResetCurrentScenario}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة بناء الجسر"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 border-b border-white/5">
          {BRIDGE_SCENARIOS.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => {
                setActiveScenarioIdx(idx);
                handleResetCurrentScenario();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeScenarioIdx === idx
                  ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-300'
                  : 'bg-white/5 border-white/5 text-stone-400 hover:text-white'
              }`}
            >
              <span>سيناريو {idx + 1}:</span>
              <span>{scen.category}</span>
            </button>
          ))}
        </div>

        {/* Current Scenario Card */}
        <div className="my-2.5 p-3.5 bg-white/5 border border-white/10 rounded-2xl shrink-0 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-white text-sm">{currentScenario.title}</span>
            <span className="text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded-md">
              {currentScenario.gapLabel}
            </span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {currentScenario.description}
          </p>
        </div>

        {/* Visual Bridge Canyon Canvas */}
        <div className="relative flex-1 min-h-[220px] sm:min-h-[260px] bg-gradient-to-b from-[#132018] via-[#0E1712] to-[#0A100C] rounded-2xl border border-emerald-500/20 p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Top Cliffs and Characters */}
          <div className="flex items-center justify-between relative z-10">
            {/* Person A Cliff */}
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center shadow-lg w-28 sm:w-36">
              <span className="text-2xl sm:text-3xl block mb-1">🧍</span>
              <span className="text-xs font-black text-emerald-300 block">{currentScenario.personA}</span>
              <span className="text-[10px] text-stone-400">الضفة الأولى</span>
            </div>

            {/* Central Bridge Arc & Blocks */}
            <div className="flex-1 mx-3 sm:mx-6 flex flex-col items-center">
              <span className="text-[11px] font-bold text-stone-400 mb-2">
                تقدم بناء الجسر: {selectedStoneIds.length} من {currentScenario.correctSequence.length} خطوات
              </span>

              {/* Graphical Bridge Pathway */}
              <div className="w-full flex items-center justify-between gap-1.5 p-2 bg-stone-900/60 rounded-xl border border-white/10 relative">
                {currentScenario.correctSequence.map((stoneId, sIdx) => {
                  const isPlaced = selectedStoneIds.includes(stoneId);
                  return (
                    <div
                      key={stoneId}
                      className={`flex-1 h-9 rounded-lg flex items-center justify-center font-black text-xs transition-all duration-500 border ${
                        isPlaced
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black border-emerald-300 shadow-md shadow-emerald-900/50 scale-100'
                          : 'bg-white/5 border-dashed border-white/20 text-stone-600 scale-95'
                      }`}
                    >
                      {isPlaced ? `حجر ${sIdx + 1} 🧱` : `...`}
                    </div>
                  );
                })}
              </div>

              {/* Completion Banner */}
              {isCompleted && (
                <div className="mt-2 text-xs font-black text-emerald-300 animate-bounce flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>اكتمل الجسر والتقى الطرفان بسلام وتفاهم! 🎉</span>
                </div>
              )}
            </div>

            {/* Person B Cliff */}
            <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-center shadow-lg w-28 sm:w-36">
              <span className="text-2xl sm:text-3xl block mb-1">👤</span>
              <span className="text-xs font-black text-amber-300 block">{currentScenario.personB}</span>
              <span className="text-[10px] text-stone-400">الضفة المقابلة</span>
            </div>
          </div>

          {/* Deep Canyon Bottom */}
          <div className="text-center text-[11px] text-stone-500 pt-3 border-t border-white/5">
            «الحدود الواضحة المحمية باللطف تصنع علاقات عميقة تدوم لسنوات»
          </div>
        </div>

        {/* Feedback / Educational Alert */}
        {feedbackError && (
          <div className="mt-2.5 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-rose-100">{feedbackError.message}</p>
              <p className="text-stone-300 text-[11px] leading-relaxed">{feedbackError.explanation}</p>
            </div>
          </div>
        )}

        {/* Complete Takeaway Card */}
        {isCompleted ? (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-[#17271E] via-[#1C2C22] to-[#121F17] border border-emerald-500/50 shadow-xl animate-fade-in shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    🏆 اكتمل بناء الجسر بنجاح!
                  </span>
                  <span className="text-xs text-stone-300 font-bold">خلاصة الدرس:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  {currentScenario.takeawayFormula}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyFormula}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-white/10 hover:bg-white/20 text-stone-200 border-white/15"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ المعادلة'}</span>
                </button>

                <button
                  onClick={handleSaveToJournal}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30"
                >
                  {savedJournalSuccess ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{savedJournalSuccess ? 'حُفظت 🌿' : 'حفظ في الدفتر'}</span>
                </button>

                <button
                  onClick={handleNextScenario}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-black shadow-md"
                >
                  <span>السيناريو التالي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Available Stones Selection */
          <div className="mt-3 space-y-2 shrink-0">
            <span className="text-xs font-bold text-stone-300 block">
              اختر حجر التواصل التالي لوضعه في الجسر:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentScenario.stones.map((stone) => {
                const isSelected = selectedStoneIds.includes(stone.id);
                return (
                  <button
                    key={stone.id}
                    disabled={isSelected}
                    onClick={() => handleSelectStone(stone)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'opacity-40 bg-emerald-950/40 border-emerald-500/30 text-stone-400 cursor-not-allowed'
                        : stone.isToxic
                        ? 'bg-white/5 hover:bg-rose-950/30 border-white/10 hover:border-rose-500/40 text-stone-200'
                        : 'bg-white/5 hover:bg-emerald-950/30 border-white/10 hover:border-emerald-500/40 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-extrabold text-emerald-300">
                        {stone.stepTitle}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> تم وضعه
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-300 font-medium leading-relaxed">
                      {stone.phrase}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
