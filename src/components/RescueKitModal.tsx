import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Sparkles, BookOpen, Wind, Compass } from 'lucide-react';
import { RESCUE_KIT_PLANS, RescuePlan } from '../data/newPhaseData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface RescueKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  onNavigateTab: (tab: string) => void;
  onOpenContent: (contentId: string) => void;
}

export const RescueKitModal: React.FC<RescueKitModalProps> = ({
  isOpen,
  onClose,
  initialPlanId,
  onNavigateTab,
  onOpenContent
}) => {
  const [selectedPlan, setSelectedPlan] = useState<RescuePlan | null>(() => {
    if (initialPlanId) {
      return RESCUE_KIT_PLANS.find(p => p.id === initialPlanId) || null;
    }
    return null;
  });

  // Update selected plan if initialPlanId changes
  React.useEffect(() => {
    if (initialPlanId) {
      const plan = RESCUE_KIT_PLANS.find(p => p.id === initialPlanId);
      if (plan) setSelectedPlan(plan);
    }
  }, [initialPlanId]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎒</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                شنطة الإسعاف النفسي
              </h2>
              <p className="text-[11px] text-[#52645B]">
                مش علاج... لكنها خطوات صغيرة تساعدك تعدّي اللحظة الصعبة
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {selectedPlan ? (
            /* Selected Plan: 3 to 5 Steps */
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-xs font-bold text-[#355C4A] hover:underline flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لخيارات الشنطة</span>
              </button>

              <div className="p-4 bg-white rounded-2xl border border-[#8FAF9A]/50 flex items-center gap-3">
                <span className="text-3xl">{selectedPlan.emoji}</span>
                <div>
                  <h3 className="font-extrabold text-base text-[#26332D]">
                    {selectedPlan.title}
                  </h3>
                  <p className="text-xs text-[#52645B] mt-0.5">
                    {selectedPlan.tagline}
                  </p>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#355C4A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>خطوات الإنقاذ السريعة ({selectedPlan.steps.length} خطوات):</span>
                </div>

                {selectedPlan.steps.map((step) => (
                  <div 
                    key={step.number}
                    className="p-3.5 bg-white rounded-2xl border border-[#E8DDCC] space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#355C4A] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.number}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-[#26332D]">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#35453E] leading-relaxed pr-8">
                      {step.action}
                    </p>
                    <div className="pr-8 pt-1 text-[11px] text-[#7D8F85] italic">
                      💡 {step.tip}
                    </div>
                  </div>
                ))}
              </div>

              {/* Optional related quick action */}
              {selectedPlan.relatedArticleId && (
                <div className="p-3 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl flex items-center justify-between">
                  <div className="text-xs text-[#26332D]">
                    <span className="font-bold">مقال داعم:</span> اقرأ بالتفصيل عن هذا الموضوع
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenContent(selectedPlan.relatedArticleId!);
                    }}
                    className="px-3 py-1.5 bg-white text-[#355C4A] font-bold text-xs rounded-xl border border-[#8FAF9A]/40 flex items-center gap-1 hover:bg-[#355C4A] hover:text-white transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>فتح المقال</span>
                  </button>
                </div>
              )}

              {/* Takeaway Card */}
              <TakeawayResultCard
                quote="«مش مطلوب منك تحارب العاصفة.. المطلوب بس تثبت مكانك وماتخليهاش تجرفك»"
                onTryAnother={() => setSelectedPlan(null)}
                onBackToHome={onClose}
              />
            </div>
          ) : (
            /* Cards List */
            <div className="space-y-3">
              <div className="text-right">
                <h3 className="text-sm font-bold text-[#26332D]">
                  اختر الموقف الطارئ الآن:
                </h3>
                <p className="text-xs text-[#52645B] mt-0.5">
                  خطط عملية مكثفة ترشدك للخطوات الآمنة بالترتيب
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RESCUE_KIT_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="p-3.5 bg-white hover:bg-[#FAF7F0] border border-[#E8DDCC] hover:border-[#355C4A] rounded-2xl text-right transition-all group flex items-start gap-3 shadow-2xs hover:shadow-xs active:scale-[0.99]"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{plan.emoji}</span>
                    <div className="flex-1">
                      <div className="font-extrabold text-xs sm:text-sm text-[#26332D] group-hover:text-[#355C4A] transition-colors">
                        {plan.title}
                      </div>
                      <div className="text-[11px] text-[#7D8F85] mt-0.5 line-clamp-1">
                        {plan.tagline}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
