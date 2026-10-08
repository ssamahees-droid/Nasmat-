import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Eye, 
  Hand, 
  Volume2, 
  Wind, 
  Coffee, 
  Check, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Waves, 
  Heart,
  ChevronRight,
  ChevronLeft,
  Compass
} from 'lucide-react';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface MindfulnessStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExerciseType = 'grounding_54321' | 'leaves_stream' | 'body_scan' | 'anchor_breath' | 'mindful_savoring';

export const MindfulnessStudioModal: React.FC<MindfulnessStudioModalProps> = ({ isOpen, onClose }) => {
  const [activeExercise, setActiveExercise] = useState<ExerciseType>('grounding_54321');
  
  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(1);
  const [groundingInput, setGroundingInput] = useState('');
  const [groundingItems, setGroundingItems] = useState<{ [key: number]: string[] }>({
    1: [], 2: [], 3: [], 4: [], 5: []
  });

  // Leaves on a Stream state
  const [floatingThought, setFloatingThought] = useState('');
  const [streamLeaves, setStreamLeaves] = useState<{ id: string; text: string; x: number }[]>([]);

  // Body Scan state
  const [bodyScanStep, setBodyScanStep] = useState(0);
  const [isBodyScanPlaying, setIsBodyScanPlaying] = useState(false);

  // Anchor Breath state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathCounter, setBreathCounter] = useState(4);
  const [isBreathActive, setIsBreathActive] = useState(false);

  // Exercise completed notice
  const [completedNotice, setCompletedNotice] = useState(false);

  // Anchor Breath Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathActive) {
      timer = setInterval(() => {
        setBreathCounter(prev => {
          if (prev > 1) return prev - 1;
          // Phase transition
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 4;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 4;
          } else if (breathPhase === 'exhale') {
            setBreathPhase('rest');
            return 2;
          } else {
            setBreathPhase('inhale');
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathActive, breathPhase]);

  // Body scan auto-advance timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBodyScanPlaying) {
      interval = setInterval(() => {
        setBodyScanStep(prev => {
          if (prev < BODY_PARTS.length - 1) {
            return prev + 1;
          } else {
            setIsBodyScanPlaying(false);
            setCompletedNotice(true);
            storage.addMindfulnessRecord({
              exerciseId: 'body_scan',
              title: 'مسح الجسد الواعي',
              durationSeconds: 120,
              feelingAfter: 'ارتخاء ووعي بالجسد'
            });
            return prev;
          }
        });
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isBodyScanPlaying]);

  if (!isOpen) return null;

  // Grounding configuration
  const GROUNDING_CONFIG = [
    {
      step: 1,
      targetCount: 5,
      title: '5 أشياء تراها بعينيك الآن 👀',
      desc: 'انظر حولك ولاحظ 5 تفاصيل بصرية دقيقة (ألوان، ظلال، أنماط في الجدار، كتاب، شجرة...)',
      placeholder: 'اكتب شيئاً تراه الآن...',
      icon: <Eye className="w-5 h-5 text-emerald-800" />
    },
    {
      step: 2,
      targetCount: 4,
      title: '4 أشياء تلمسها وتشعر بملمسها ✋',
      desc: 'المس قماش ملابسك، سطح الطاولة، ملمس شاشة هاتفك، أو باطن قدميك على الأرض.',
      placeholder: 'اكتب إحساساً ملموساً...',
      icon: <Hand className="w-5 h-5 text-teal-800" />
    },
    {
      step: 3,
      targetCount: 3,
      title: '3 أصوات تلتقطها أذناك 👂',
      desc: 'أغمض عينيك لثوانٍ وأنصت: صوت حركة هواء، تنفسك، صوت سيارات بعيدة، دقات ساعة...',
      placeholder: 'اكتب صوتاً تسمعه...',
      icon: <Volume2 className="w-5 h-5 text-sky-800" />
    },
    {
      step: 4,
      targetCount: 2,
      title: '2 رائحتين تستنشقهما في الهواء 👃',
      desc: 'رائحة قهوة، نسمة هواء نقي، عطرك، أو مجرد استنشاق عميق لجو الغرفة.',
      placeholder: 'اكتب رائحة تلاحظها...',
      icon: <Wind className="w-5 h-5 text-amber-800" />
    },
    {
      step: 5,
      targetCount: 1,
      title: '1 طعم في فمك أو نفس عميق تعود به لقلبك 🍵',
      desc: 'تذوق طعم رشفة ماء، أو خذ نفساً بطيئاً عميقاً واستشعر عودتك الكاملة للحظة الحالية.',
      placeholder: 'ما الذي تشعر به الآن في جسدك؟',
      icon: <Coffee className="w-5 h-5 text-rose-800" />
    }
  ];

  const handleAddGroundingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundingInput.trim()) return;

    const currentList = groundingItems[groundingStep] || [];
    const updatedList = [...currentList, groundingInput.trim()];
    setGroundingItems(prev => ({ ...prev, [groundingStep]: updatedList }));
    setGroundingInput('');

    const target = GROUNDING_CONFIG[groundingStep - 1].targetCount;
    if (updatedList.length >= target) {
      if (groundingStep < 5) {
        setGroundingStep(prev => prev + 1);
      } else {
        setCompletedNotice(true);
        storage.addMindfulnessRecord({
          exerciseId: 'grounding_54321',
          title: 'تمرين الحواس الخمس 5-4-3-2-1',
          durationSeconds: 180,
          feelingAfter: 'حضور ذهني واستقرار'
        });
      }
    }
  };

  const handleAddLeafToStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!floatingThought.trim()) return;

    const newLeaf = {
      id: 'leaf_' + Date.now(),
      text: floatingThought.trim(),
      x: 0
    };
    setStreamLeaves(prev => [newLeaf, ...prev.slice(0, 4)]);
    setFloatingThought('');

    // Animate leaf floating away
    setTimeout(() => {
      setStreamLeaves(prev => prev.filter(l => l.id !== newLeaf.id));
    }, 7000);
  };

  const BODY_PARTS = [
    { part: 'الرأس والجبين', instruction: 'لاحظ أي شد أو تجعيد في جبينك.. أرخِ عضلات وجهك تماماً، واسمح لجبينك بأن ينبسط بهدوء.' },
    { part: 'العينين والفكين', instruction: 'أرخِ فكك السفلي.. اترك أسنانك تبتعد عن بعضها، وتخلص من الضغط المتراكم في الفم.' },
    { part: 'الرقبة والأكتاف', instruction: 'دع كتفيك يهبطان بعيداً عن أذنيك.. تنفس ببطء واستشعر ثقل الجاذبية المريح.' },
    { part: 'الصدر والقلب', instruction: 'لاحظ حركة صعود وهبوط صدرك مع الأنفاس.. قلبك يعمل بحب وأمان في هذه اللحظة.' },
    { part: 'البطن والتنفس', instruction: 'أرخِ عضلات بطنك.. دع التنفس يملأ بطنك براحة كالبالون دون أي توتر.' },
    { part: 'اليدين والذراعين', instruction: 'افتح راحتَي يديك.. تخلص من أي قبضة، واستشعر الدفء في أطراف أصابعك.' },
    { part: 'القدمين والتجذر', instruction: 'اشعر باتصال قدميك بالأرض.. الأرض تدعمك بالكامل، أنت آمن ومستقر هنا والآن.' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_-10px_rgba(58,90,64,0.25)] overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center text-2xl shadow-inner">
              🧘
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  استوديو اليقظة الذهنية
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2.5 py-0.5 rounded-full font-bold">
                  حضور ذهني وتجذر
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5">
                تمارين تفاعلية لإعادة تثبيت انتباهك في اللحظة الحالية وتخفيف اجترار الأفكار
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

        {/* Exercise Selector Tabs */}
        <div className="py-3 shrink-0 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'grounding_54321', label: 'الحواس الخمس 5-4-3-2-1', emoji: '🖐️' },
            { id: 'leaves_stream', label: 'أوراق الشجر على النهر', emoji: '🍃' },
            { id: 'body_scan', label: 'مسح الجسد الواعي', emoji: '✨' },
            { id: 'anchor_breath', label: 'مرساة التنفس', emoji: '⚓' },
            { id: 'mindful_savoring', label: 'التذوق والعيش بوعي', emoji: '🍵' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveExercise(tab.id as ExerciseType);
                setCompletedNotice(false);
              }}
              className={`py-2 px-3.5 rounded-2xl border text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                activeExercise === tab.id
                  ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                  : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Exercise Body */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          {/* 1. Grounding 5-4-3-2-1 */}
          {activeExercise === 'grounding_54321' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-white border border-[#E5DACB] rounded-3xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {GROUNDING_CONFIG[groundingStep - 1].icon}
                    <h3 className="font-black text-sm text-[#283618]">
                      {GROUNDING_CONFIG[groundingStep - 1].title}
                    </h3>
                  </div>
                  <span className="text-xs bg-[#3A5A40]/15 text-[#3A5A40] font-bold px-2.5 py-0.5 rounded-full">
                    المرحلة {groundingStep} من 5
                  </span>
                </div>

                <p className="text-xs text-[#58645C] leading-relaxed font-medium">
                  {GROUNDING_CONFIG[groundingStep - 1].desc}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#E5DACB] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#3A5A40] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(groundingStep / 5) * 100}%` }}
                  />
                </div>

                {/* Form to log items */}
                <form onSubmit={handleAddGroundingItem} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={groundingInput}
                    onChange={(e) => setGroundingInput(e.target.value)}
                    placeholder={GROUNDING_CONFIG[groundingStep - 1].placeholder}
                    className="flex-1 p-3 bg-[#FAF7F2] border border-[#E5DACB] focus:border-[#3A5A40] rounded-2xl text-xs text-[#283618] outline-none font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!groundingInput.trim()}
                    className="py-3 px-5 bg-[#3A5A40] hover:bg-[#283618] disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition-all shadow-xs"
                  >
                    تسجيل
                  </button>
                </form>

                {/* Logged tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(groundingItems[groundingStep] || []).map((item, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-medium animate-fade-in"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {completedNotice && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 animate-fade-in">
                  <span className="text-2xl">🌱</span>
                  <div className="font-black text-sm text-emerald-950">
                    أحسنت! أعدت عقلك وحواسك بالكامل إلى هنا والآن.
                  </div>
                  <p className="text-xs text-emerald-800">
                    تم توثيق جلسة اليقظة في رحلتك الشخصية.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. Leaves on a Stream (ACT Meditation) */}
          {activeExercise === 'leaves_stream' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 leading-relaxed">
                🍃 <strong>فكرة التمرين:</strong> تخيل أنك تجلس بجوار نهر هادئ تطفو فوقه أوراق شجر. كلما طرأت فكرة، ضعها على ورقة شجر، وشاهدها تعبر وتطفو مع التيار دون محاربتها أو محاولة إيقافها.
              </div>

              {/* Stream Visual Sandbox */}
              <div className="relative h-44 bg-gradient-to-b from-[#E2EFF2] via-[#C9E5EC] to-[#9EC9D4] rounded-3xl border border-sky-300 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-sky-900 font-bold opacity-75">
                  <span>🌊 تيار النهر الهادئ</span>
                  <span>راقِب دون أن تقفز في الماء</span>
                </div>

                {/* Floating Leaves */}
                <div className="space-y-2 overflow-hidden py-2">
                  {streamLeaves.length === 0 ? (
                    <div className="text-center text-xs text-sky-800/80 italic py-4">
                      اكتب فكرة تشغلك في الأسفل لتدعها تطفو على النهر بسلام...
                    </div>
                  ) : (
                    streamLeaves.map((leaf) => (
                      <div 
                        key={leaf.id}
                        className="p-2.5 bg-gradient-to-r from-emerald-100 to-emerald-200/90 border border-emerald-400 text-emerald-950 rounded-2xl text-xs font-bold shadow-md animate-fade-in flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span>🍃</span>
                          <span>{leaf.text}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 italic">تعبر بسلام...</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="text-right text-[10px] text-sky-800">
                  «أنت ضفة النهر الثابتة، وأفكارك هي الماء والأوراق العابرة»
                </div>
              </div>

              {/* Input for thought */}
              <form onSubmit={handleAddLeafToStream} className="flex gap-2">
                <input
                  type="text"
                  value={floatingThought}
                  onChange={(e) => setFloatingThought(e.target.value)}
                  placeholder="ما الفكرة التي تشغل بالك الآن؟ (مثال: خايف من بكرة، فلان زعلان مني...)"
                  className="flex-1 p-3 bg-white border border-[#E5DACB] focus:border-[#3A5A40] rounded-2xl text-xs text-[#283618] outline-none"
                />
                <button
                  type="submit"
                  disabled={!floatingThought.trim()}
                  className="py-3 px-5 bg-[#3A5A40] hover:bg-[#283618] disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>أطلقها في النهر</span>
                  <Wind className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* 3. Body Scan Meditation */}
          {activeExercise === 'body_scan' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 bg-white border border-[#E5DACB] rounded-3xl shadow-xs space-y-4 text-center">
                <div className="flex items-center justify-between text-xs text-[#58645C] border-b border-[#E5DACB] pb-2">
                  <span className="font-bold text-[#3A5A40]">منطقة التركيز: {BODY_PARTS[bodyScanStep].part}</span>
                  <span>{bodyScanStep + 1} من {BODY_PARTS.length}</span>
                </div>

                <div className="py-6 space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#3A5A40]/10 border-2 border-[#3A5A40] flex items-center justify-center text-3xl animate-pulse">
                    ✨
                  </div>
                  <h3 className="text-lg font-black text-[#283618]">
                    {BODY_PARTS[bodyScanStep].part}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#38463E] max-w-md mx-auto leading-relaxed font-medium">
                    {BODY_PARTS[bodyScanStep].instruction}
                  </p>
                </div>

                {/* Progress Controls */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    disabled={bodyScanStep === 0}
                    onClick={() => setBodyScanStep(prev => Math.max(0, prev - 1))}
                    className="p-2.5 bg-[#FAF7F2] hover:bg-stone-100 disabled:opacity-40 rounded-xl border border-[#E5DACB] text-xs font-bold"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsBodyScanPlaying(!isBodyScanPlaying)}
                    className="py-2.5 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    {isBodyScanPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>إيقاف مؤقت</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>تشغيل المرشد التلقائي (8 ثوانٍ لكل منطقة)</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={bodyScanStep === BODY_PARTS.length - 1}
                    onClick={() => setBodyScanStep(prev => Math.min(BODY_PARTS.length - 1, prev + 1))}
                    className="p-2.5 bg-[#FAF7F2] hover:bg-stone-100 disabled:opacity-40 rounded-xl border border-[#E5DACB] text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Anchor Breath */}
          {activeExercise === 'anchor_breath' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="p-6 bg-white border border-[#E5DACB] rounded-3xl shadow-xs space-y-4">
                <span className="text-xs font-bold text-[#3A5A40] bg-[#3A5A40]/10 px-3 py-1 rounded-full">
                  مرساة الحضور: تنفس واعي
                </span>

                {/* Animated Breathing Circle */}
                <div className="py-6 flex flex-col items-center justify-center">
                  <div 
                    className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-md ${
                      breathPhase === 'inhale'
                        ? 'bg-emerald-100 scale-125 border-4 border-emerald-500'
                        : breathPhase === 'hold'
                        ? 'bg-amber-100 scale-120 border-4 border-amber-500'
                        : breathPhase === 'exhale'
                        ? 'bg-sky-100 scale-95 border-4 border-sky-400'
                        : 'bg-stone-100 scale-90 border-2 border-stone-300'
                    }`}
                  >
                    <span className="text-base font-black text-[#283618]">
                      {breathPhase === 'inhale' ? 'شهيق عميق' : breathPhase === 'hold' ? 'احتباس هادئ' : breathPhase === 'exhale' ? 'زفير تحرير' : 'راحة واسترخاء'}
                    </span>
                    <span className="font-mono text-2xl font-black text-[#3A5A40] mt-1">
                      {breathCounter}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsBreathActive(!isBreathActive)}
                    className="py-3 px-8 bg-[#3A5A40] hover:bg-[#283618] text-white rounded-2xl text-xs font-black transition-all shadow-xs flex items-center gap-2"
                  >
                    {isBreathActive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>إيقاف المؤقت</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>بدء دورة التنفس اليقظ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Mindful Savoring */}
          {activeExercise === 'mindful_savoring' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-4 bg-white border border-[#E5DACB] rounded-3xl shadow-xs space-y-3">
                <h3 className="font-black text-sm text-[#283618]">
                  كيف تمارس اليقظة في روتينك اليومي؟ (التذوق والمشي)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DACB] space-y-1.5">
                    <span className="font-bold text-[#3A5A40] flex items-center gap-1.5">
                      <Coffee className="w-4 h-4" />
                      <span>تناول طعام أو شراب بوعي (Mindful Eating):</span>
                    </span>
                    <p className="text-[#38463E] leading-relaxed">
                      قبل أن تأكل، انظر لشكل طعامك، اشتم رائحته، امضغ أول لقمتين ببطء شديد ولاحظ النكهات المختلفة بدل الأكل التلقائي وأنت تتصفح هاتفك.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DACB] space-y-1.5">
                    <span className="font-bold text-[#3A5A40] flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      <span>المشي الواعي (Mindful Walking):</span>
                    </span>
                    <p className="text-[#38463E] leading-relaxed">
                      امشِ لمدة 5 دقائق دون سماعات أو انشغال.. انتبه لملامسة كعبيك للأرض، حركة ذراعيك، ونسمات الهواء على عنقك. المشي ليس فقط للوصول، بل لعيش الخطوة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <TakeawayResultCard
            quote="«اليقظة الذهنية ليست أن تفرغ عقلك من الأفكار، بل أن تعرف أين يقف انتباهك في هذه اللحظة»"
            onTryAnother={() => setActiveExercise('grounding_54321')}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
