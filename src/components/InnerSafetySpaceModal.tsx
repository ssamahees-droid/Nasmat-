import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Heart, 
  Sparkles, 
  Brain, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Smile, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Volume2, 
  Bookmark, 
  Calendar, 
  Clock, 
  Lock, 
  Check, 
  PhoneCall, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Feather,
  Info
} from 'lucide-react';
import { storage } from '../services/storage';
import { InnerSafetySummary } from '../types';

interface InnerSafetySpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

const EMOTIONS = [
  { id: 'sadness', label: 'الحزن', emoji: '🌧️', tone: 'يحتاج مواساة واحتواء بلا استعجال للابتسام' },
  { id: 'anxiety', label: 'القلق', emoji: '⚡', tone: 'يحتاج أماناً جسدياً وتهدئة للأفكار المتسارعة' },
  { id: 'anger', label: 'الغضب', emoji: '🔥', tone: 'يحتاج تفريغاً هادئاً وفهماً للحدود التي انتُهكت' },
  { id: 'loneliness', label: 'الوحدة', emoji: '🍂', tone: 'يحتاج اتصالاً رحيماً بالذات ودفء القبول' },
  { id: 'exhaustion', label: 'الإرهاق', emoji: '🔋', tone: 'يحتاج إذناً صريحاً بالتوقف والراحة دون ذنب' },
  { id: 'fear', label: 'الخوف', emoji: '🌑', tone: 'يحتاج طمأنة وتوضيح ما هو حقيقي وما هو متوقع' },
  { id: 'confusion', label: 'التشوش', emoji: '🌀', tone: 'يحتاج تبسيط الأمور وتفكيكها خطوة خطوة' },
  { id: 'emptiness', label: 'الشعور بالفراغ', emoji: '🌫️', tone: 'يحتاج حضوراً لطيفاً مع الذات دون لوم' },
  { id: 'mixed', label: 'مشاعر مختلطة', emoji: '🎭', tone: 'طبيعي أن تشعر بعدة أمور متناقضة في آن واحد' },
  { id: 'unknown', label: 'لا أعرف ما أشعر به', emoji: '❓', tone: 'عدم المعرفة خطوة أولى مشروعة وصادقة' }
];

const ACTION_OPTIONS = [
  { id: 'express_need', label: 'التعبير عن احتياج لم أستطع قوله', emoji: '🗣️' },
  { id: 'set_boundary', label: 'وضع حد مناسب في علاقة أو موقف', emoji: '🛡️' },
  { id: 'postpone_decision', label: 'تأجيل قرار حتى أهدأ وأفكر بوضوح', emoji: '⏳' },
  { id: 'seek_support', label: 'طلب الدعم من شخص أثق به', emoji: '🤝' },
  { id: 'solve_small_task', label: 'معالجة مشكلة صغيرة بدلًا من الاستغراق في التفكير', emoji: '📝' },
  { id: 'meaningful_activity', label: 'القيام بنشاط ذي معنى بالنسبة إليّ', emoji: '🎨' },
  { id: 'choose_rest', label: 'اختيار الراحة عندما أكون مرهقًا', emoji: '🛌' },
  { id: 'custom', label: 'كتابة خطوة أخرى تناسب ظروفي', emoji: '✍️' }
];

const COMPASSION_TEMPLATES = [
  'أنا محبط من اللي حصل، لكن موقف واحد مش بيحدد قيمتي، وأقدر أتعلم منه خطوة خطوة.',
  'طبيعي أحس بالتعب والضغط في الظروف دي، ومش مطلوب مني أكون مثالي في كل ثانية.',
  'مشاعري مش عيب ولا ضعف؛ هي إشارة إني محتاج أهتم بنفسي وأحمي طاقتي.',
  'أنا بتعامل مع الموقف ده بأحسن ما عندي دلوقتي، ومسامح نفسي على أي تقصير غير مقصود.'
];

export const InnerSafetySpaceModal: React.FC<InnerSafetySpaceModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  // Stepper: 1: Emotion, 2: Compassionate Voice, 3: Inner Space, 4: Small Step, 5: Summary & Consent
  const [step, setStep] = useState<number>(1);
  const [localFontSize, setLocalFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Form State
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionTrigger, setEmotionTrigger] = useState<string>('');
  const [underlyingThought, setUnderlyingThought] = useState<string>('');
  const [identifiedNeed, setIdentifiedNeed] = useState<string>('');
  const [emotionIntention, setEmotionIntention] = useState<string>('فهم الشعور');

  // Stage 2: Gentle Voice
  const [harshPhrase, setHarshPhrase] = useState<string>('');
  const [lovedOneWords, setLovedOneWords] = useState<string>('');
  const [compassionatePhrase, setCompassionatePhrase] = useState<string>('');

  // Stage 3: Inner Space / Observation
  const [groundingMode, setGroundingMode] = useState<'inner' | 'external'>('inner');
  const [bodyObservation, setBodyObservation] = useState<string>('');
  const [isThoughtFactOrIdea, setIsThoughtFactOrIdea] = useState<'fact' | 'interpretation' | null>(null);
  const [currentChoiceNow, setCurrentChoiceNow] = useState<string>('');
  const [groundingSensoryStep, setGroundingSensoryStep] = useState<number>(1);

  // Stage 4: Small Step
  const [selectedActionId, setSelectedActionId] = useState<string>('');
  const [customActionText, setCustomActionText] = useState<string>('');
  const [actionNotes, setActionNotes] = useState<string>('');
  const [reviewDateChoice, setReviewDateChoice] = useState<string>('بدون موعد محدد');

  // Stage 5: Summary & Privacy Consent
  const [consentToSave, setConsentToSave] = useState<boolean>(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<boolean>(false);

  if (!isOpen) return null;

  // Font size classes
  const fontMultiplierClass = 
    localFontSize === 'xlarge' ? 'text-lg sm:text-xl' :
    localFontSize === 'large' ? 'text-base sm:text-lg' :
    'text-sm sm:text-base';

  const fontSmallClass = 
    localFontSize === 'xlarge' ? 'text-sm sm:text-base' :
    localFontSize === 'large' ? 'text-xs sm:text-sm' :
    'text-xs';

  const currentEmotionObj = EMOTIONS.find(e => e.id === selectedEmotion);
  const currentActionObj = ACTION_OPTIONS.find(a => a.id === selectedActionId);

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinishWithoutSaving = () => {
    onClose();
    resetState();
  };

  const handleSaveAndFinish = () => {
    if (!consentToSave) return;

    const chosenActionTitle = selectedActionId === 'custom' 
      ? (customActionText.trim() || 'خطوة شخصية خاصة') 
      : (currentActionObj?.label || 'خطوة صغيرة للذات');

    storage.addInnerSafetySummary({
      identifiedEmotion: currentEmotionObj ? `${currentEmotionObj.emoji} ${currentEmotionObj.label}` : 'غير محدد',
      emotionTrigger: emotionTrigger.trim() || undefined,
      underlyingThought: underlyingThought.trim() || undefined,
      identifiedNeed: identifiedNeed.trim() || undefined,
      compassionateRephrase: compassionatePhrase.trim() || undefined,
      observationFocus: groundingMode === 'inner' ? bodyObservation.trim() : 'تثبيت حسي خارجي 5-4-3-2-1',
      actionStep: chosenActionTitle,
      actionStepNotes: actionNotes.trim() || undefined,
      reviewDate: reviewDateChoice
    });

    setIsSavedSuccessfully(true);
    setTimeout(() => {
      onClose();
      resetState();
    }, 1800);
  };

  const resetState = () => {
    setStep(1);
    setSelectedEmotion('');
    setEmotionTrigger('');
    setUnderlyingThought('');
    setIdentifiedNeed('');
    setEmotionIntention('فهم الشعور');
    setHarshPhrase('');
    setLovedOneWords('');
    setCompassionatePhrase('');
    setGroundingMode('inner');
    setBodyObservation('');
    setIsThoughtFactOrIdea(null);
    setCurrentChoiceNow('');
    setSelectedActionId('');
    setCustomActionText('');
    setActionNotes('');
    setReviewDateChoice('بدون موعد محدد');
    setConsentToSave(false);
    setIsSavedSuccessfully(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in font-cairo">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-[#F7F3E9] dark:bg-[#0D1914] text-[#13251E] dark:text-[#F7F3E9] rounded-3xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 shadow-2xl flex flex-col overflow-hidden transition-all"
        dir="rtl"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 bg-white/70 dark:bg-[#14271F]/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 text-[#174C3C] dark:text-[#A9C5A0] flex items-center justify-center border border-[#174C3C]/20 dark:border-[#A9C5A0]/30 shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 text-[#174C3C] dark:text-[#A9C5A0]">
                  اسمع نفسك // مساحة الأمان
                </span>
                <span className="text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60 font-semibold hidden md:inline">
                  المرحلة {step} من 5
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold font-syne text-[#174C3C] dark:text-[#F7F3E9]">
                مساحة أمانك الداخلي
              </h2>
            </div>
          </div>

          {/* Controls: Font Size, Emergency Info, Close */}
          <div className="flex items-center gap-2">
            {/* Font Adjuster */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs">
              <button
                onClick={() => setLocalFontSize('normal')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${localFontSize === 'normal' ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] font-bold' : 'opacity-70'}`}
                title="حجم خط عادي"
              >
                A
              </button>
              <button
                onClick={() => setLocalFontSize('large')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${localFontSize === 'large' ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] font-bold' : 'opacity-70'}`}
                title="حجم خط كبير"
              >
                A+
              </button>
              <button
                onClick={() => setLocalFontSize('xlarge')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${localFontSize === 'xlarge' ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] font-bold' : 'opacity-70'}`}
                title="حجم خط كبير جداً"
              >
                A++
              </button>
            </div>

            {/* Emergency Hotline Quick Access */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="خطوط الدعم والطوارئ المصرية"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مساندة فورية</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (step > 1 && !isSavedSuccessfully) {
                  setShowExitConfirm(true);
                } else {
                  onClose();
                }
              }}
              className="p-2 rounded-xl text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Motto Banner */}
        <div className="bg-[#174C3C]/5 dark:bg-[#A9C5A0]/10 px-4 sm:px-6 py-2.5 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 flex items-center justify-between text-xs text-[#174C3C] dark:text-[#A9C5A0] font-medium">
          <div className="flex items-center gap-2">
            <Feather className="w-3.5 h-3.5" />
            <span>«مش كل شعور محتاج حل فوري… أحيانًا محتاج نفهمه الأول»</span>
          </div>
          <span className="hidden sm:inline text-[11px] opacity-80">
            أداة استكشاف ومساندة ذاتية وليست بديلاً عن العلاج الطبي المتخصص
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white/40 dark:bg-black/20 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/10">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
            {[
              { num: 1, title: 'مرآة المشاعر' },
              { num: 2, title: 'صوتي الحنون' },
              { num: 3, title: 'مساحتي الداخلية' },
              { num: 4, title: 'خطوة صغيرة' },
              { num: 5, title: 'ملخص رحلتي' }
            ].map(item => (
              <button
                key={item.num}
                onClick={() => setStep(item.num)}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  step === item.num 
                    ? 'text-[#174C3C] dark:text-[#A9C5A0] font-bold' 
                    : step > item.num 
                      ? 'text-[#174C3C]/70 dark:text-[#A9C5A0]/70' 
                      : 'opacity-40'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === item.num 
                    ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] shadow-xs' 
                    : step > item.num 
                      ? 'bg-[#174C3C]/20 text-[#174C3C] dark:bg-[#A9C5A0]/20 dark:text-[#A9C5A0]' 
                      : 'bg-black/10 dark:bg-white/10'
                }`}>
                  {step > item.num ? '✓' : item.num}
                </div>
                <span className="text-[10px] sm:text-xs truncate max-w-[70px] sm:max-w-none">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

          {/* ======================================================== */}
          {/* STAGE 1: مرآة المشاعر — أفهم ما بداخلي */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 text-[#174C3C] dark:text-[#A9C5A0] text-xs font-bold">
                  <span>المرحلة الأولى</span>
                  <span>•</span>
                  <span>مرآة المشاعر</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-syne text-[#174C3C] dark:text-[#F7F3E9]">
                  ما هو الشعور الأقرب إلى قلبك الآن؟
                </h3>
                <p className={`text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed ${fontMultiplierClass}`}>
                  لا نفترض مشاعرك ولا نشخص حالتك؛ اختر ببساطة ما يصف خبرتك الحالية دون الحاجة لتبريره أو الخجل منه.
                </p>
              </div>

              {/* Emotions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {EMOTIONS.map(emo => {
                  const isSelected = selectedEmotion === emo.id;
                  return (
                    <button
                      key={emo.id}
                      onClick={() => setSelectedEmotion(emo.id)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-[#174C3C] dark:border-[#A9C5A0] shadow-md scale-102' 
                          : 'bg-white/80 dark:bg-[#14271F] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:border-[#174C3C]/40 text-[#13251E] dark:text-[#F7F3E9]'
                      }`}
                    >
                      <span className="text-2xl">{emo.emoji}</span>
                      <div>
                        <span className="font-bold text-sm block">{emo.label}</span>
                        <span className={`text-[10px] leading-tight block mt-1 line-clamp-2 ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
                          {emo.tone}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progressive Questions After Selection */}
              {selectedEmotion && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#14271F]/70 border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-sm sm:text-base text-[#174C3C] dark:text-[#F7F3E9]">
                      أسئلة لطيفة لاستكشاف هذا الشعور (كلها اختيارية)
                    </h4>
                  </div>

                  {/* Question 1: What happened before? */}
                  <div className="space-y-2">
                    <label className={`font-semibold block ${fontSmallClass}`}>
                      1. ماذا حدث قبل أن يظهر هذا الشعور؟
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        'موقف في الشغل أو الدراسة',
                        'خلاف أو عتاب مع شخص قريب',
                        'تراكم أعباء ومسؤوليات',
                        'خبر أو رسالة غير متوقعة',
                        'بدون سبب خارجي محدد'
                      ].map(triggerChip => (
                        <button
                          key={triggerChip}
                          type="button"
                          onClick={() => setEmotionTrigger(triggerChip)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            emotionTrigger === triggerChip
                              ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                              : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10'
                          }`}
                        >
                          {triggerChip}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={emotionTrigger}
                      onChange={e => setEmotionTrigger(e.target.value)}
                      placeholder="أو اكتب بكلماتك ما حدث باختصار (اختياري)..."
                      className="w-full bg-[#F7F3E9]/80 dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0] resize-none h-18"
                    />
                  </div>

                  {/* Question 2: What thought is in mind? */}
                  <div className="space-y-2">
                    <label className={`font-semibold block ${fontSmallClass}`}>
                      2. ما الفكرة التي تدور في ذهنك بالتوازي مع هذا الشعور؟
                    </label>
                    <input
                      type="text"
                      value={underlyingThought}
                      onChange={e => setUnderlyingThought(e.target.value)}
                      placeholder="مثلاً: «خايف الأمور تفلت مني»، «حاسس إني لوحدي»، «مش قادر أكمل بالضغط ده»..."
                      className="w-full bg-[#F7F3E9]/80 dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0]"
                    />
                  </div>

                  {/* Question 3: What do you need right now? */}
                  <div className="space-y-2">
                    <label className={`font-semibold block ${fontSmallClass}`}>
                      3. ما الذي تحتاج إليه في هذه اللحظة بالذات؟
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        'مساحة هدوء وعزلة لطيفة',
                        'استراحة دون تأنيب ضمير',
                        'شخص يسمعني ويفهمني',
                        'وضوح وترتيب للأولويات',
                        'أفرغ الضغط بالبكاء أو المشي'
                      ].map(needChip => (
                        <button
                          key={needChip}
                          type="button"
                          onClick={() => setIdentifiedNeed(needChip)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            identifiedNeed === needChip
                              ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                              : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10'
                          }`}
                        >
                          {needChip}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={identifiedNeed}
                      onChange={e => setIdentifiedNeed(e.target.value)}
                      placeholder="أو صف احتياجك الحقيقي بكلماتك..."
                      className="w-full bg-[#F7F3E9]/80 dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0]"
                    />
                  </div>

                  {/* Question 4: Intention */}
                  <div className="space-y-2">
                    <label className={`font-semibold block ${fontSmallClass}`}>
                      4. في هذه الجلسة، ما هو مسارك المفضل؟
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'فهم الشعور', label: 'فهم واستيعاب ما وراء الشعور' },
                        { id: 'التعبير والاحتواء', label: 'التعبير عنه برفق واحتواء' },
                        { id: 'خطوة عملية', label: 'التفكير في خطوة عملية متزنة' }
                      ].map(intent => (
                        <button
                          key={intent.id}
                          type="button"
                          onClick={() => setEmotionIntention(intent.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            emotionIntention === intent.id
                              ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent'
                              : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                          }`}
                        >
                          {intent.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: صوتي الحنون — أتعلم أن أحتوي نفسي */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <span>المرحلة الثانية</span>
                  <span>•</span>
                  <span>صوتي الحنون</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-syne text-[#174C3C] dark:text-[#F7F3E9]">
                  أتعلم أن أحتوي نفسي بدل جلدها
                </h3>
                <p className={`text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed ${fontMultiplierClass}`}>
                  كثيرًا ما نتحدث مع أنفسنا بلهجة قاسية لا نرضاها لأحد نحبه. الهدف هنا ليس تزييف الواقع بعبارات وردية زائفة، بل إيجاد صوت حكيم ورحيم يجمع بين التفهم والمسؤولية.
                </p>
              </div>

              {/* Step 1: Harsh Phrase Input */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#14271F]/70 border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">الخطوة الأولى</span>
                  <label className={`font-bold block ${fontSmallClass}`}>
                    اكتب جملة قاسية أو ناقدة تجد نفسك ترددها لنفسك وقت الشدة:
                  </label>
                  <p className="text-xs text-[#13251E]/60 dark:text-[#F7F3E9]/60">
                    مثل: «أنا دايماً بفشل»، «أنا السبب في كل مشكلة»، «المفروض أكون أحسن من كده».
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    'أنا فاشل ومش بعرف أتصرف صح',
                    'المفروض أكون أقوى وأستحمل أكتر',
                    'دايماً ببوّظ الحاجات المهمة في حياتي',
                    'أنا عبء على كل اللي حوالي'
                  ].map(quickHarsh => (
                    <button
                      key={quickHarsh}
                      type="button"
                      onClick={() => setHarshPhrase(quickHarsh)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      {quickHarsh}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={harshPhrase}
                  onChange={e => setHarshPhrase(e.target.value)}
                  placeholder="اكتب جملتك الناقدة هنا..."
                  className="w-full bg-[#F7F3E9]/80 dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0]"
                />
              </div>

              {/* Step 2: Perspective shift - Loved one */}
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/25 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">الخطوة الثانية // انتقال المنظور</span>
                  <label className={`font-bold block ${fontSmallClass}`}>
                    لو شخص قريب منك وبتحبه جداً بيمر بنفس الموقف الصعب، كنت هتقوله إيه؟
                  </label>
                </div>

                <textarea
                  value={lovedOneWords}
                  onChange={e => setLovedOneWords(e.target.value)}
                  placeholder="مثلاً: كنت هقوله إني فخور بسعيه، وإنه مش لوحده، وإن الغلط طبيعي والأهم صحته وسلامه النفسي..."
                  className="w-full bg-white/80 dark:bg-[#0D1914] border border-amber-500/30 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-20"
                />
              </div>

              {/* Step 3: Rephrase to Compassionate Alternative */}
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/25 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">الخطوة الثالثة // صياغة صوتك الحنون</span>
                  <label className={`font-bold block ${fontSmallClass}`}>
                    أعد صياغة الجملة لتكون رحيمة وواقعية ومسؤولة (أنت تستحق نفس هذا اللطف):
                  </label>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold opacity-75">صيغ مقترحة للاسترشاد (اضغط للاختيار والتعديل):</span>
                  <div className="space-y-2">
                    {COMPASSION_TEMPLATES.map(tpl => (
                      <button
                        key={tpl}
                        type="button"
                        onClick={() => setCompassionatePhrase(tpl)}
                        className="w-full p-3 text-right rounded-xl bg-white/70 dark:bg-[#14271F] border border-emerald-500/20 text-xs hover:border-emerald-500/50 transition-all flex items-start gap-2 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{tpl}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold block mb-1.5 text-emerald-800 dark:text-emerald-200">
                    جملتك الرحيمة المعتمدة:
                  </label>
                  <input
                    type="text"
                    value={compassionatePhrase}
                    onChange={e => setCompassionatePhrase(e.target.value)}
                    placeholder="اكتب هنا جملة الاحتواء التي اخترتها بنفسك لتتذكرها..."
                    className="w-full bg-white dark:bg-[#0D1914] border border-emerald-500/40 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: مساحتي الداخلية — ألاحظ دون أن أغرق */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold">
                  <span>المرحلة الثالثة</span>
                  <span>•</span>
                  <span>مساحتي الداخلية</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-syne text-[#174C3C] dark:text-[#F7F3E9]">
                  ألاحظ الخبرة الداخلية دون أن أغرق فيها
                </h3>
                <p className={`text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed ${fontMultiplierClass}`}>
                  التدرب على ملاحظة الأفكار والمشاعر والإحساس الجسدي بهدوء، والتمييز بين الفكرة كاحتمال عابر وبين الحقيقة المؤكدة.
                </p>
              </div>

              {/* Grounding Safety Switcher */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="text-xs text-sky-900 dark:text-sky-200 font-medium">
                    لو شعرت أن التركيز في المشاعر الداخلية يزيد توترك أو يرهقك، يمكنك التبديل فوراً لتمرين التثبيت الحسي الخارجي:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-white/60 dark:bg-black/30 rounded-xl text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setGroundingMode('inner')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      groundingMode === 'inner' ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'opacity-70'
                    }`}
                  >
                    ملاحظة الداخل
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroundingMode('external')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      groundingMode === 'external' ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'opacity-70'
                    }`}
                  >
                    تثبيت حسي خارجي (5-4-3-2-1)
                  </button>
                </div>
              </div>

              {groundingMode === 'inner' ? (
                /* Inner Observation Track */
                <div className="space-y-5 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#14271F]/70 border border-[#174C3C]/15 dark:border-[#A9C5A0]/20">
                  {/* Step A: Bodily Sensation */}
                  <div className="space-y-2">
                    <label className={`font-bold block ${fontSmallClass}`}>
                      1. ماذا ألاحظ في جسدي الآن في هذه اللحظة؟
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'توتر في الرقبة أو الكتفين',
                        'ثقل في الصدر',
                        'نبضات قلب سريعة',
                        'تنفس سطحي متقطع',
                        'ارتخاء نسبي وهدوء',
                        'تعب ورغبة في النوم'
                      ].map(bodyChip => (
                        <button
                          key={bodyChip}
                          type="button"
                          onClick={() => setBodyObservation(bodyChip)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            bodyObservation === bodyChip
                              ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                              : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10'
                          }`}
                        >
                          {bodyChip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step B: Fact vs Interpretation */}
                  <div className="space-y-3 pt-3 border-t border-black/10 dark:border-white/10">
                    <label className={`font-bold block ${fontSmallClass}`}>
                      2. الفكرة التي تمر في عقلي الآن: هل هي حقيقة مؤكدة بالدليل، أم تفسير محتمل؟
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsThoughtFactOrIdea('fact')}
                        className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                          isThoughtFactOrIdea === 'fact'
                            ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent'
                            : 'bg-white/60 dark:bg-[#0D1914] border-black/10 dark:border-white/10'
                        }`}
                      >
                        <span className="font-bold text-sm block">حقيقة ملموسة وواقع مثبت</span>
                        <span className="text-xs opacity-75 block mt-1">شيء واقعي حدث بالفعل ومثبت يمكن قياسه.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsThoughtFactOrIdea('interpretation')}
                        className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                          isThoughtFactOrIdea === 'interpretation'
                            ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent'
                            : 'bg-white/60 dark:bg-[#0D1914] border-black/10 dark:border-white/10'
                        }`}
                      >
                        <span className="font-bold text-sm block">تفسير أو سيناريو ذهني متوقع</span>
                        <span className="text-xs opacity-75 block mt-1">توقع أو فكرة صاغها عقلي تحت ضغط الخوف أو الإجهاد.</span>
                      </button>
                    </div>
                  </div>

                  {/* Step C: What can I choose right now? */}
                  <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
                    <label className={`font-bold block ${fontSmallClass}`}>
                      3. ما الذي أستطيع اختياره الآن؟
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'أتنفس بهدوء وأترك الفكرة تمر كغيمة',
                        'أشرب كوب ماء وأمدد جسمي',
                        'أعطي نفسي 10 دقائق بدون شاشات',
                        'أكتب ما يشغلني في ورقة وأغلقها مؤقتاً'
                      ].map(choiceChip => (
                        <button
                          key={choiceChip}
                          type="button"
                          onClick={() => setCurrentChoiceNow(choiceChip)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            currentChoiceNow === choiceChip
                              ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                              : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10'
                          }`}
                        >
                          {choiceChip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* External Grounding 5-4-3-2-1 Track */
                <div className="p-6 rounded-3xl bg-sky-500/10 border border-sky-500/25 space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <h4 className="font-bold text-base text-sky-900 dark:text-sky-200">
                      تمرين التثبيت الحسي الخارجي (العودة إلى أرض الواقع هنا والآن)
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#14271F] border border-sky-500/20 space-y-1">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400">👀 5 أشياء تراها بعينيك:</span>
                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        التفت حولك في الغرفة وسمِّ 5 أشياء تراها (مثل: قلم، كوب، ستارة، كتاب، ساعة...).
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#14271F] border border-sky-500/20 space-y-1">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400">🖐️ 4 أشياء تلمس ملمسها:</span>
                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        المس ملمس ملابسك، سطح الطاولة، برودة شاشة الهاتف، أو ملمس الأرض تحت قدميك.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#14271F] border border-sky-500/20 space-y-1">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400">👂 3 أصوات تسمعها الآن:</span>
                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        صوت المروحة، حركة السيارات في الشارع، أو صوت تنفسك الخاص.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#14271F] border border-sky-500/20 space-y-1">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400">🌬️ نَفَسان هادئان + رشفة ماء:</span>
                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        شهيق عميق من الأنف في 4 ثوانٍ، وزفير بطيء من الفم في 6 ثوانٍ، مع شرب القليل من الماء.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 4: من الاحتواء إلى الحياة — خطوة صغيرة لنفسي */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  <span>المرحلة الرابعة</span>
                  <span>•</span>
                  <span>خطوة صغيرة لنفسي</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-syne text-[#174C3C] dark:text-[#F7F3E9]">
                  تحويل الوعي إلى فعل واقعي هادئ
                </h3>
                <p className={`text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed ${fontMultiplierClass}`}>
                  الوعي بالمشاعر يكتمل عندما نترجمه إلى خطوة صغيرة لطيفة في الواقع، بلا إلزام ولا تأنيب.
                </p>
              </div>

              {/* Action Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACTION_OPTIONS.map(act => {
                  const isSelected = selectedActionId === act.id;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setSelectedActionId(act.id)}
                      className={`p-4 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-md'
                          : 'bg-white/80 dark:bg-[#14271F] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:border-[#174C3C]/40 text-[#13251E] dark:text-[#F7F3E9]'
                      }`}
                    >
                      <span className="text-2xl">{act.emoji}</span>
                      <span className="font-bold text-xs sm:text-sm">{act.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Action Input if custom chosen */}
              {selectedActionId === 'custom' && (
                <div className="space-y-2 animate-fade-in">
                  <label className={`font-bold block ${fontSmallClass}`}>
                    اكتب خطوتك الصغيرة المخصصة:
                  </label>
                  <input
                    type="text"
                    value={customActionText}
                    onChange={e => setCustomActionText(e.target.value)}
                    placeholder="مثلاً: هكلم فلان أقوله بوضوح إني محتاج مساعدة في كذا..."
                    className="w-full bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0]"
                  />
                </div>
              )}

              {/* Action Notes & Optional Review */}
              {selectedActionId && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#14271F]/70 border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className={`font-semibold block ${fontSmallClass}`}>
                      تفاصيل أو ملاحظات إضافية لتسهيل الخطوة (اختياري):
                    </label>
                    <textarea
                      value={actionNotes}
                      onChange={e => setActionNotes(e.target.value)}
                      placeholder="متى؟ أين؟ أو ما الشيء الصغير الذي يعينك على البدء؟"
                      className="w-full bg-[#F7F3E9]/80 dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0] resize-none h-18"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`font-semibold block ${fontSmallClass}`}>
                      موعد اختياري لمراجعة نفسك مع هذه الخطوة:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'اليوم قبل النوم',
                        'غداً صباحاً',
                        'بعد يومين',
                        'نهاية الأسبوع',
                        'بدون موعد محدد'
                      ].map(dOption => (
                        <button
                          key={dOption}
                          type="button"
                          onClick={() => setReviewDateChoice(dOption)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            reviewDateChoice === dOption
                              ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                              : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10'
                          }`}
                        >
                          {dOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 5: ملخص الرحلة والخصوصية الصريحة */}
          {/* ======================================================== */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <span>المرحلة الختامية</span>
                  <span>•</span>
                  <span>دفتر اكتشاف الذات والخصوصية</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-syne text-[#174C3C] dark:text-[#F7F3E9]">
                  ملخص رحلتك في مساحة الأمان الداخلي
                </h3>
                <p className={`text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed ${fontMultiplierClass}`}>
                  إليك ما استكشفته اليوم برفق وصدق مع نفسك:
                </p>
              </div>

              {/* Structured Summary Cards */}
              <div className="space-y-3">
                {/* 1. Emotion */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                    🌧️
                  </div>
                  <div>
                    <span className="text-xs font-bold opacity-60 block">الشعور الذي تم تمييزه:</span>
                    <span className="font-bold text-sm sm:text-base">
                      {currentEmotionObj ? `${currentEmotionObj.emoji} ${currentEmotionObj.label}` : 'لم يتم تحديد شعور محدد'}
                    </span>
                    {emotionTrigger && (
                      <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70 mt-0.5">
                        السياق: {emotionTrigger}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Need */}
                {identifiedNeed && (
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center shrink-0">
                      💡
                    </div>
                    <div>
                      <span className="text-xs font-bold opacity-60 block">الاحتياج المكتشف:</span>
                      <span className="font-bold text-sm sm:text-base">{identifiedNeed}</span>
                    </div>
                  </div>
                )}

                {/* 3. Compassionate Voice */}
                {compassionatePhrase && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                      💚
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">صوتك الحنون الداخلي:</span>
                      <span className="font-bold text-sm sm:text-base text-[#13251E] dark:text-[#F7F3E9]">
                        «{compassionatePhrase}»
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Small Step */}
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0">
                    🌱
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">خطوتك الصغيرة للواقع:</span>
                    <span className="font-bold text-sm sm:text-base text-[#13251E] dark:text-[#F7F3E9]">
                      {selectedActionId === 'custom' 
                        ? (customActionText || 'خطوة مخصصة')
                        : (currentActionObj?.label || 'أخذ قسط من الراحة والهدوء')}
                    </span>
                    {actionNotes && (
                      <p className="text-xs opacity-75 mt-0.5">ملاحظة: {actionNotes}</p>
                    )}
                    <span className="text-[11px] block text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                      الموعد المقترح: {reviewDateChoice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Session Link */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">📅</span>
                  <span className="text-[#13251E]/80 dark:text-[#F7F3E9]/80">
                    هل ترغب في استكشاف أعمق على مدار الأسبوع؟ تفضل بالاطلاع على «الجلسة الأسبوعية» كمسار تأمل مستقل.
                  </span>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('weekly-session');
                    }}
                    className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0] hover:underline shrink-0 cursor-pointer"
                  >
                    استكشف الجلسة الأسبوعية ←
                  </button>
                )}
              </div>

              {/* Privacy Consent Box */}
              <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                    ميثاق الخصوصية وحفظ البيانات (القرار بيدك 100%):
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#13251E]/80 dark:text-[#F7F3E9]/80">
                  نحن لا نحفظ تفاصيل كتاباتك الحساسة أو إجاباتك المطولة. إذا اخترت الحفظ، فسيُخزن فقط هذا الملخص المختصر في متصفحك محلياً، ولا يستطيع أي مستخدم آخر الوصول إليه، ويمكنك حذفه متى شئت. إذا لم توافق، ستنتهي الرحلة دون ترك أي أثر دائم.
                </p>

                <label className="flex items-center gap-3 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentToSave}
                    onChange={e => setConsentToSave(e.target.checked)}
                    className="w-4 h-4 rounded text-[#174C3C] focus:ring-[#174C3C] accent-[#174C3C] dark:accent-[#A9C5A0]"
                  />
                  <span className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0]">
                    أوافق صراحةً على حفظ ملخص رحلتي في دفتري الآمن.
                  </span>
                </label>
              </div>

              {isSavedSuccessfully && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم حفظ ملخص رحلتك في دفترك الآمن بنجاح 🌱... جاري الإغلاق.</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 bg-white/70 dark:bg-[#14271F]/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {step > 1 && step < 5 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 5 ? (
              <>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-[#13251E]/60 dark:text-[#F7F3E9]/60 hover:text-[#13251E] cursor-pointer"
                >
                  تخطي السؤال
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-white dark:text-[#0D1914] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Step 5 Finish Buttons */
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleFinishWithoutSaving}
                  className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  إنهاء دون حفظ
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndFinish}
                  disabled={!consentToSave || isSavedSuccessfully}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    consentToSave && !isSavedSuccessfully
                      ? 'bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-white dark:text-[#0D1914] shadow-md'
                      : 'bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>الاحتفاظ بالملخص وإنهاء الرحلة 🌱</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation on Exit */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-cairo">
          <div className="bg-[#F7F3E9] dark:bg-[#14271F] p-6 rounded-3xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 max-w-sm w-full space-y-4 text-right shadow-2xl">
            <h4 className="font-bold text-base text-[#174C3C] dark:text-[#F7F3E9]">
              هل ترغب في مغادرة مساحة الأمان؟
            </h4>
            <p className="text-xs text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed">
              إذا غادرت الآن لن يتم حفظ تقدمك في هذه الجلسة، ويمكنك العودة وبدء رحلة جديدة في أي وقت.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold cursor-pointer"
              >
                متابعة الرحلة
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose();
                  resetState();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                نعم، خروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Hotlines Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-cairo">
          <div className="bg-[#F7F3E9] dark:bg-[#14271F] p-6 sm:p-8 rounded-3xl border border-rose-500/30 max-w-md w-full space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                <AlertCircle className="w-5 h-5" />
                <span>خطوط الدعم والطوارئ المعتمدة في مصر</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1 rounded-lg text-black/50 dark:text-white/50 hover:bg-black/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-[#13251E]/80 dark:text-[#F7F3E9]/80">
              سلامتك هي الأولوية القصوى دائماً. إذا كنت تمر بأزمة نفسية شديدة، أو أفكار ملحة حول إيذاء النفس، فالرجاء عدم التردد في التواصل فوراً مع الخطوط المجانية المعتمدة رسمياً في مصر:
            </p>

            <div className="space-y-2.5">
              <a 
                href="tel:16328"
                className="p-3 rounded-2xl bg-white dark:bg-[#0D1914] border border-rose-500/20 hover:border-rose-500/50 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="font-bold text-sm block">الأمانة العامة للصحة النفسية وعلاج الإدمان</span>
                  <span className="text-[11px] text-stone-500">مجانياً على مدار 24 ساعة</span>
                </div>
                <span className="font-jetbrains font-black text-rose-600 text-base">16328</span>
              </a>

              <a 
                href="tel:08008880700"
                className="p-3 rounded-2xl bg-white dark:bg-[#0D1914] border border-rose-500/20 hover:border-rose-500/50 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="font-bold text-sm block">الخط الساخن للاستشارات النفسية (أرضي)</span>
                  <span className="text-[11px] text-stone-500">رقم مجاني لجميع المحافظات</span>
                </div>
                <span className="font-jetbrains font-black text-rose-600 text-sm">08008880700</span>
              </a>

              <a 
                href="tel:16000"
                className="p-3 rounded-2xl bg-white dark:bg-[#0D1914] border border-rose-500/20 hover:border-rose-500/50 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="font-bold text-sm block">خط نجدة الطفل والمراهقين</span>
                  <span className="text-[11px] text-stone-500">المجلس القومي للطفولة والأمومة</span>
                </div>
                <span className="font-jetbrains font-black text-rose-600 text-base">16000</span>
              </a>

              <a 
                href="tel:123"
                className="p-3 rounded-2xl bg-white dark:bg-[#0D1914] border border-rose-500/20 hover:border-rose-500/50 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="font-bold text-sm block">هيئة الإسعاف المصرية</span>
                  <span className="text-[11px] text-stone-500">للطوارئ الطبية الفورية</span>
                </div>
                <span className="font-jetbrains font-black text-rose-600 text-base">123</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2.5 bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] rounded-xl text-xs font-bold cursor-pointer"
              >
                العودة إلى مساحة الأمان
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
