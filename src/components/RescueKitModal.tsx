import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Sparkles, BookOpen, Wind, Compass } from 'lucide-react';
import { RESCUE_KIT_PLANS, RescuePlan } from '../data/newPhaseData';
import { TakeawayResultCard } from './TakeawayResultCard';
import { TextAudioPlayer } from './TextAudioPlayer';

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
      <div className="relative w-full max-w-xl bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]/70 shrink-0">
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
                className="text-xs font-bold text-[#174C3C] hover:underline flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لخيارات الشنطة</span>
              </button>

              <div className="p-4 bg-white rounded-2xl border border-[#A9C5A0]/50 flex items-center gap-3">
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
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[#174C3C] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>خطوات الإنقاذ السريعة ({selectedPlan.steps.length} خطوات):</span>
                  </div>
                  <TextAudioPlayer
                    text={`${selectedPlan.title}. ${selectedPlan.steps.map(s => `${s.title}: ${s.action}`).join('. ')}`}
                    id={`rescue_${selectedPlan.id}`}
                    variant="compact"
                    label="اسمع الخطوات"
                  />
                </div>

                {selectedPlan.steps.map((step) => (
                  <div 
                    key={step.number}
                    className="p-3.5 bg-white rounded-2xl border border-[#E6E8D8] space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#174C3C] text-white text-xs font-bold flex items-center justify-center shrink-0">
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
                <div className="p-3 bg-[#A9C5A0]/15 border border-[#A9C5A0]/30 rounded-2xl flex items-center justify-between">
                  <div className="text-xs text-[#26332D]">
                    <span className="font-bold">مقال داعم:</span> اقرأ بالتفصيل عن هذا الموضوع
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenContent(selectedPlan.relatedArticleId!);
                    }}
                    className="px-3 py-1.5 bg-white text-[#174C3C] font-bold text-xs rounded-xl border border-[#A9C5A0]/40 flex items-center gap-1 hover:bg-[#174C3C] hover:text-white transition-colors"
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
                    className="p-3.5 bg-white hover:bg-[#F7F3E9] border border-[#E6E8D8] hover:border-[#174C3C] rounded-2xl text-right transition-all group flex items-start gap-3 shadow-2xs hover:shadow-xs active:scale-[0.99]"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{plan.emoji}</span>
                    <div className="flex-1">
                      <div className="font-extrabold text-xs sm:text-sm text-[#26332D] group-hover:text-[#174C3C] transition-colors">
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
