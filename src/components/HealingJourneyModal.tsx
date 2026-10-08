import React, { useState } from 'react';
import { X, Heart, Shield, Check, RefreshCw, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface HealingJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealingJourneyModal: React.FC<HealingJourneyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    whatHappened: '',
    impactOnMe: '',
    stillCarrying: '',
    canChangeNow: '',
    mustAcceptAndLiveWith: ''
  });
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      storage.addNote(`🌱 أكملت ورشة «اتأذيت... إزاي أتعافى؟» وحولت التجربة من ألم أعيش داخله إلى وعي أتعامل معه.`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAnswers({
      whatHappened: '',
      impactOnMe: '',
      stillCarrying: '',
      canChangeNow: '',
      mustAcceptAndLiveWith: ''
    });
    setIsCompleted(false);
  };

  const stepsInfo = [
    {
      step: 1,
      title: 'ما الذي حدث؟',
      subtitle: 'اكتب الموقف أو التجربة بحيادية وبدون جلد للذات',
      placeholder: 'مثال: تعرضت لخذلان في العمل أو صدمة من صديق مقرب...',
      field: 'whatHappened' as const,
      hint: 'الهدف أن تضع الحدث أمامك كحدث وقع في الماضي وليس كهويتك الحالية.'
    },
    {
      step: 2,
      title: 'ما الأثر الذي تركه فيّ؟',
      subtitle: 'كيف غيرتك التجربة؟ ما المشاعر أو المخاوف التي ولدتها؟',
      placeholder: 'مثال: أصبحت قلقاً، قللت ثقتي بالناس، أشعر بالخوف من التعبير...',
      field: 'impactOnMe' as const,
      hint: 'الاعتراف بالأثر هو أول خطوة لفك التصاقه بحياتك اليومية.'
    },
    {
      step: 3,
      title: 'ماذا ما زلت أحمله؟',
      subtitle: 'ما الثقل أو المرارة أو الذنب الذي لا زلت تجره معك كل يوم؟',
      placeholder: 'مثال: أحمل رغبة في العتاب، أحمل غضباً صامتاً، ألوم نفسي لأني صدقت...',
      field: 'stillCarrying' as const,
      hint: 'ما زلت تحمله لأنك تحاول حماية نفسك.. لكن هل الثقل ما زال ينفعك؟'
    },
    {
      step: 4,
      title: 'ما الذي أستطيع تغييره الآن؟',
      subtitle: 'قراراتك، حدودك، وعلاقاتك في الحاضر التي بيدك التحكم فيها',
      placeholder: 'مثال: وضع حدود صارمة، تقليل التواصل مع مصدر الأذى، العناية بنومي...',
      field: 'canChangeNow' as const,
      hint: 'ركز على مساحة قدرتك اليوم مهما بدت صغيرة.'
    },
    {
      step: 5,
      title: 'ما الذي يجب أن أتعلم التعايش معه؟',
      subtitle: 'حقائق الماضي التي وقعت ولا يمكن إعادة كتابتها',
      placeholder: 'مثال: أن هذا الشخص لن يعتذر، أن الماضي مضى وانتهى...',
      field: 'mustAcceptAndLiveWith' as const,
      hint: 'التعايش ليس ضعفاً، بل تحرير لطاقتك من حرب خاسرة مع الماضي.'
    }
  ];

  const currentStepData = stepsInfo[currentStep - 1];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_-10px_rgba(58,90,64,0.25)] overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center text-2xl shadow-inner">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  اتأذيت... إزاي أتعافى؟
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2 py-0.5 rounded-full font-bold">
                  تفكيك الأثر النفسي
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5">
                تحويل التجربة من شيء تعيش داخله إلى شيء تفهم أثره وتتعامل معه
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

        {/* Content Body */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          {!isCompleted ? (
            <div className="space-y-4 animate-fade-in">
              {/* Progress Steps Indicator */}
              <div className="flex items-center justify-between text-xs text-[#58645C] pb-1">
                <span className="font-bold text-[#3A5A40]">الخطوة {currentStep} من 5</span>
                <span className="text-[11px]">مراحل فك قيد التجربة</span>
              </div>
              <div className="w-full bg-[#E5DACB] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#3A5A40] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>

              {/* Step Card */}
              <div className="p-5 bg-white border border-[#E5DACB] rounded-3xl space-y-3 shadow-xs">
                <h3 className="text-base font-black text-[#283618]">
                  {currentStepData.title}
                </h3>
                <p className="text-xs text-[#58645C] leading-relaxed">
                  {currentStepData.subtitle}
                </p>

                <textarea
                  rows={4}
                  value={answers[currentStepData.field]}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentStepData.field]: e.target.value }))}
                  placeholder={currentStepData.placeholder}
                  className="w-full p-3.5 bg-[#FAF7F2] border border-[#E5DACB] focus:border-[#3A5A40] rounded-2xl text-xs text-[#283618] outline-none resize-none leading-relaxed"
                />

                <div className="p-3 bg-[#E9DFD4]/50 border border-[#E5DACB] rounded-xl text-[11px] text-[#58645C] leading-relaxed">
                  💡 {currentStepData.hint}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  disabled={currentStep === 1}
                  onClick={handlePrev}
                  className="py-2.5 px-4 bg-white hover:bg-stone-50 disabled:opacity-40 text-[#283618] border border-[#E5DACB] text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  onClick={handleNext}
                  className="py-2.5 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white text-xs font-extrabold rounded-2xl flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{currentStep === 5 ? 'عرض خلاصة التعافي ✨' : 'الخطوة التالية'}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Summary Report */
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 bg-white border-2 border-[#588157]/60 rounded-3xl space-y-4 shadow-sm text-right">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DACB]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <h3 className="font-black text-sm sm:text-base text-[#283618]">
                        خلاصة فك قيد التجربة المؤلمة
                      </h3>
                      <span className="text-[10px] text-[#58645C]">
                        لقد حولت الألم من سجن إلى وعي مدروس
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                    مكتملة ومحفوظة ✓
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DACB]">
                    <span className="font-bold text-[#3A5A40] block">1. ما الذي حدث:</span>
                    <p className="text-[#283618] mt-0.5">{answers.whatHappened || 'لم يُحدد'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DACB]">
                    <span className="font-bold text-amber-900 block">2. الأثر الذي تركه:</span>
                    <p className="text-[#283618] mt-0.5">{answers.impactOnMe || 'لم يُحدد'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DACB]">
                    <span className="font-bold text-rose-900 block">3. ما زلت أحمله وأحتاج لتركه:</span>
                    <p className="text-[#283618] mt-0.5">{answers.stillCarrying || 'لم يُحدد'}</p>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">4. ما أستطيع تغييره اليوم:</span>
                    <p className="text-emerald-950 font-bold mt-0.5">{answers.canChangeNow || 'لم يُحدد'}</p>
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                    <span className="font-bold text-sky-900 block">5. ما أتعلم التعايش معه بسلام:</span>
                    <p className="text-sky-950 font-bold mt-0.5">{answers.mustAcceptAndLiveWith || 'لم يُحدد'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-[#FAF7F2] hover:bg-stone-100 text-[#3A5A40] border border-[#E5DACB] text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تفكيك تجربة أخرى</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#3A5A40] hover:bg-[#283618] text-white text-xs font-bold rounded-2xl transition-colors shadow-xs"
                >
                  العودة للرئيسية 🤍
                </button>
              </div>
            </div>
          )}

          <TakeawayResultCard
            quote="«تحويل التجربة من شيء تعيش داخله إلى شيء تفهم أثره وتتعامل معه هو جوهر التعافي»"
            onTryAnother={handleReset}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
