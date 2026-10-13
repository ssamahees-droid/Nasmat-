import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Compass, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Share2, 
  Copy, 
  BookOpen, 
  ShieldCheck, 
  Award,
  Volume2,
  VolumeX,
  Compass as CompassIcon
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

interface CompassQuestion {
  id: number;
  situation: string;
  context: string;
  depletingChoice: {
    label: string;
    desc: string;
    impact: string;
  };
  selfListeningChoice: {
    label: string;
    desc: string;
    impact: string;
  };
}

const COMPASS_QUESTIONS: CompassQuestion[] = [
  {
    id: 1,
    situation: 'استيقظت صباحاً وشعرت بثقل غير مبرر وقائمة مهام متراكمة:',
    context: 'بداية اليوم وتحديد نغمة التعامل مع النفس',
    depletingChoice: {
      label: 'الضغط القاسي على النفس وإجبارها على العمل بأقصى سرعة',
      desc: 'تتجاهل رسائل جسدك، تشرب كافيين مفرط، وتتعامل مع نفسك كآلة يجب أن تنتج مهما كان الثمن.',
      impact: 'استنزاف سريع وانهيار في منتصف اليوم'
    },
    selfListeningChoice: {
      label: 'أخذ دقيقة تنفس عميق، وتقليص المهام إلى الأهم برحمة',
      desc: 'تجلس دقيقة للاستماع لجسدك، تفرز المهام الضرورية فقط وتؤجل الباقي دون جلد للذات.',
      impact: 'حفظ الطاقة وإنجاز مستدام بسلام داخلي'
    }
  },
  {
    id: 2,
    situation: 'شخص وجه إليك نقداً بنبرة غير لبقة أمام زملاء أو أقارب:',
    context: 'حماية القيمة الذاتية عند الاستفزاز الخارجي',
    depletingChoice: {
      label: 'تصديق النقد فوراً أو الدخول في جدال هجومي واجترار الغضب',
      desc: 'تدع الكلمات تجرح صميم قيمتك، وتعيد تمثيل المشهد في رأسك طوال الليل مع تأنيب الضمير.',
      impact: 'فقدان السلام الذهني وتضخيم رأي الآخرين'
    },
    selfListeningChoice: {
      label: 'فصل رأي الآخر عن قيمتي، ووضع مسافة نفسية آمنة',
      desc: 'تتذكر أن أسلوبه يعبر عن نقصه وليس عن حقيقتك، وتأخذ ما يفيد بموضوعية وتترك الباقي خلف ظهرك.',
      impact: 'حصانة نفسية وثبات داخلي عميق'
    }
  },
  {
    id: 3,
    situation: 'طلب منك أحدهم خدمة إضافية بينما طاقتك على وشك النفاد:',
    context: 'اختبار الحدود الشخصية وقول "لا" الصحية',
    depletingChoice: {
      label: 'الموافقة خجلاً وخوفاً من العتاب، ثم الشعور بالحرج والغضب الداخلي',
      desc: 'تضحي بنومك وصحتك لترضي الآخرين وتتجنب نظرة اللوم، مع تراكم الحنق الصامت.',
      impact: 'تآكل الحدود الشخصية وتنامي الشعور بالضحية'
    },
    selfListeningChoice: {
      label: 'الاعتذار بلطف وحزم مع تقدير ظروف طاقتي الإنسانية',
      desc: 'تقول: «أتمنى لو كان بإمكاني، لكن طاقتي اليوم لا تسمح لي بتقديم المساعدة كما ينبغي».',
      impact: 'احترام الذات وبناء علاقات قائمة على الصدق'
    }
  },
  {
    id: 4,
    situation: 'في نهاية اليوم، وجدت أن إنجازك كان أقل بكثير مما خططت له:',
    context: 'ختام اليوم ومحاكمة الذات قبل النوم',
    depletingChoice: {
      label: 'جلد الذات، المقارنة بمن أنجزوا، والنوم بمشاعر الفشل والذنب',
      desc: 'تفتح السوشيال ميديا لترى نجاحات الآخرين وتغرق في لوم نفسك وسرقة حقك في النوم الهادئ.',
      impact: 'تسميم النوم وتكرار دائرة الإحباط في الصباح'
    },
    selfListeningChoice: {
      label: 'الامتنان لما تمكنت من فعله، وتذكير النفس بأنك إنسان ولست آلة',
      desc: 'تحتضن تعبك، وتثمن أنك استمررت في المحاولة، وتغلق اليوم برضا لتستأنف الغد بهدوء.',
      impact: 'نوم عميق وراحة للجهاز العصبي'
    }
  }
];

interface CompassResult {
  title: string;
  direction: 'north' | 'east' | 'west' | 'south';
  directionName: string;
  emoji: string;
  color: string;
  scorePercent: number;
  description: string;
  dailyPrescription: string;
  affirmation: string;
}

export const InnerCompassJourneyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<('depleting' | 'self_listening')[]>([]);
  const [result, setResult] = useState<CompassResult | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());

  if (!isOpen) return null;

  const currentQ = COMPASS_QUESTIONS[currentQuestionIdx];

  const handleSelectChoice = (choice: 'depleting' | 'self_listening') => {
    chimeService.playCompassWhirChime();
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (currentQuestionIdx + 1 < COMPASS_QUESTIONS.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Calculate outcome
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: ('depleting' | 'self_listening')[]) => {
    const selfListeningCount = finalAnswers.filter(a => a === 'self_listening').length;
    const scorePercent = Math.round((selfListeningCount / COMPASS_QUESTIONS.length) * 100);

    chimeService.playSuccessChime();

    if (scorePercent >= 75) {
      setResult({
        title: 'بوصلتك اليوم متجهة نحو شمال الحكمة والاتزان 🧭',
        direction: 'north',
        directionName: 'شمال الحكمة والاتزان (North of Inner Harmony)',
        emoji: '🌿',
        color: '#10B981',
        scorePercent,
        description: 'أنت تتعامل مع نفسك باحترام ناضج ووعي متزن. تصغي لجسدك وتضع حدوداً صحية تحميك دون قسوة.',
        dailyPrescription: 'استمر في هذا التناغم الرائع. كافئ نفسك اليوم بلحظة امتنان صامتة واستمتع بما حققته من سلام داخلي.',
        affirmation: '«أنا أستمع لنداءات روحي بلطف، وأسير في الحياة بإيقاعي الخاص المحمي بالسلام 🤍»'
      });
    } else if (scorePercent >= 50) {
      setResult({
        title: 'بوصلتك اليوم متجهة نحو شرق الهدوء والراحة اللطيفة 🌅',
        direction: 'east',
        directionName: 'شرق الهدوء المحتاج للراحة (East of Gentle Rest)',
        emoji: '🌸',
        color: '#F59E0B',
        scorePercent,
        description: 'أنت تحاول الاستماع لنفسك، لكن هناك بعض المواقف التي تسحبك للاستنزاف أو التضحية الزائدة.',
        dailyPrescription: 'اختر اليوم مهمة واحدة غير عاجلة وأسقطها من قائمتك. امنح نفسك ساعة راحة تامة دون شاشات أو التزامات.',
        affirmation: '«ليس عليّ أن أثبت أهليتي لأحد.. من حقي أن آخذ استراحة دون شعور بالذنب 🌿»'
      });
    } else if (finalAnswers[2] === 'depleting') {
      setResult({
        title: 'بوصلتك اليوم متجهة نحو جنوب الاستنزاف المحتاج لوضع الحدود 🛡️',
        direction: 'south',
        directionName: 'جنوب الاستنزاف المحتاج لوضع الحدود (South of Firm Boundaries)',
        emoji: '🛑',
        color: '#EC4899',
        scorePercent,
        description: 'هناك استنزاف قادم من كثرة إرضاء الآخرين وصعوبة قول "لا" عندما تكون طاقتك مستهلكة.',
        dailyPrescription: 'تدرب اليوم على رفض طلب واحد يستنزفك. تذكر: قول لا للآخرين هو أول نعم تقولها لصحتك النفسية.',
        affirmation: '«حدودي ليست أنانية، بل هي السور الذي يحفظ حديقتي الداخلية خضراء ومزهرة ✨»'
      });
    } else {
      setResult({
        title: 'بوصلتك اليوم متجهة نحو غرب التوتر المحتاج للتنظيم والتهدئة 🌊',
        direction: 'west',
        directionName: 'غرب التوتر المحتاج للتنظيم (West of Mindful Grounding)',
        emoji: '⚓',
        color: '#06B6D4',
        scorePercent,
        description: 'عقلك في حالة تأهب واستعجال، وتميل لجلد الذات عند تعثر الخطط الصغيرة.',
        dailyPrescription: 'قم بتمرين التنفس العميق ٤-٤-٤ لمدة دقيقتين. تذكر أنك إنسان يتعلم، ولست آلة مبرمجة على الكمال.',
        affirmation: '«أنا أتنفس وأسلّم أمري لله.. ما مضى قد فات، وما هو آتٍ سأواجهه برحمة وهدوء 🕊️»'
      });
    }
  };

  const handleReset = () => {
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setResult(null);
  };

  const handleCopyCard = () => {
    if (!result) return;
    const shareText = `نتيجتي في لعبة «رحلة البوصلة الداخلية» من تطبيق نسمة حياة 🧭\n\n• ${result.title}\n• التوجيه اليومي: ${result.dailyPrescription}\n• التوكيد: ${result.affirmation}\n\n— منصة نسمة حياة للصحة النفسية 🌿`;
    navigator.clipboard.writeText(shareText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleSaveToJournal = () => {
    if (!result) return;
    storage.addThoughtPost({
      title: `نتيجة البوصلة النفسية: ${result.directionName}`,
      content: `${result.description}\n\nالوصفة اليومية: ${result.dailyPrescription}\n\nالتوكيد: ${result.affirmation}`,
      category: 'gentleness',
      mood: 'good',
      promptUsed: 'فحص البوصلة النفسية وتناغم الذات',
      isFavorite: true
    });
    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#0F1713] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-cyan-950/40">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «رحلة البوصلة الداخلية»
                </h2>
                <span className="text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  اكتشاف اتجاهك النفسي اليوم
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                ٤ مواقف يومية سريعة تكشف أين تتجه طاقتك النفسية اليوم وما تحتاج إليه روحك 🌿
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
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة الرحلة"
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

        {/* Journey Content */}
        {!result ? (
          <div className="flex-1 py-4 flex flex-col justify-between overflow-y-auto space-y-4">
            
            {/* Progress Indicators */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span>الموقف {currentQ.id} من {COMPASS_QUESTIONS.length}</span>
              <div className="flex gap-1.5">
                {COMPASS_QUESTIONS.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`w-6 h-1.5 rounded-full transition-all ${
                      idx < currentQuestionIdx
                        ? 'bg-emerald-400'
                        : idx === currentQuestionIdx
                        ? 'bg-cyan-400 scale-110'
                        : 'bg-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Situation Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#16251D] via-[#111C16] to-[#0A100C] border border-cyan-500/30 shadow-lg space-y-2">
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-md inline-block">
                {currentQ.context}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
                {currentQ.situation}
              </h3>
              <p className="text-xs text-stone-300">
                لو حدث ذلك معك اليوم، أي المسارين أقرب لتصرفك التلقائي؟
              </p>
            </div>

            {/* Two Divergent Paths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              
              {/* Path 1: Self-Listening Path */}
              <button
                onClick={() => handleSelectChoice('self_listening')}
                className="p-4 rounded-2xl border text-right transition-all cursor-pointer bg-gradient-to-br from-emerald-950/40 to-teal-950/20 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/60 flex flex-col justify-between group shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                      <span>مسار الاستماع للذات والتعاطف 🌿</span>
                    </span>
                    <span className="text-xl group-hover:scale-125 transition-transform">✨</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {currentQ.selfListeningChoice.label}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentQ.selfListeningChoice.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400 font-bold">
                  الأثر: {currentQ.selfListeningChoice.impact}
                </div>
              </button>

              {/* Path 2: Depleting Path */}
              <button
                onClick={() => handleSelectChoice('depleting')}
                className="p-4 rounded-2xl border text-right transition-all cursor-pointer bg-gradient-to-br from-rose-950/30 to-amber-950/20 border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/50 flex flex-col justify-between group shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                      <span>مسار الاستنزاف والضغط القديم 🌪️</span>
                    </span>
                    <span className="text-xl group-hover:scale-125 transition-transform">⚡</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {currentQ.depletingChoice.label}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentQ.depletingChoice.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-rose-500/20 text-[11px] text-rose-300 font-bold">
                  الأثر: {currentQ.depletingChoice.impact}
                </div>
              </button>

            </div>

          </div>
        ) : (
          /* Result Diagnostic Screen */
          <div className="flex-1 py-3 flex flex-col justify-between overflow-y-auto space-y-4 animate-fade-in">
            
            {/* Compass Visual Dial */}
            <div className="relative p-5 rounded-3xl bg-radial from-[#15271E] via-[#0E1A14] to-[#0A100C] border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-3">
              
              {/* Compass Dial */}
              <div className="w-24 h-24 rounded-full border-4 border-emerald-400/40 flex items-center justify-center relative shadow-xl shadow-emerald-950/60 animate-pulse">
                <span className="text-4xl">{result.emoji}</span>
                <span className="absolute top-1 text-[10px] font-black text-emerald-400">ش</span>
                <span className="absolute bottom-1 text-[10px] font-black text-rose-400">ج</span>
                <span className="absolute right-1 text-[10px] font-black text-amber-400">ش</span>
                <span className="absolute left-1 text-[10px] font-black text-cyan-400">غ</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  درجة التناغم مع الذات: {result.scorePercent}%
                </span>
                <h3 className="text-base sm:text-lg font-black text-white font-tajawal">
                  {result.title}
                </h3>
                <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
                  {result.description}
                </p>
              </div>
            </div>

            {/* Daily Prescription Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                <Award className="w-4 h-4" />
                <span>التوصية النفسية المخصصة ليومك:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {result.dailyPrescription}
              </p>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-emerald-300 font-medium italic">
                {result.affirmation}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCard}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ البطاقة'}</span>
                </button>

                <button
                  onClick={handleSaveToJournal}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
                >
                  {savedJournalSuccess ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{savedJournalSuccess ? 'حُفظت في دفتري 🌿' : 'حفظ في دفتر الخواطر'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-stone-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة الرحلة</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition-all cursor-pointer"
                >
                  العودة للمنصة 🌿
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
