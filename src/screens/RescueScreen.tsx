import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  PhoneCall, 
  Wind, 
  Brain, 
  Flame, 
  BatteryCharging, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import { RESCUE_KIT_PLANS, RescuePlan } from '../data/newPhaseData';

interface RescueScreenProps {
  onNavigate: (tab: string) => void;
  onOpenArticle?: (id: string) => void;
  onOpenEmergencyModal?: () => void;
  onOpenRescueKit?: (planId?: string) => void;
  onOpenPsychologicalER?: () => void;
  onOpenSpecialistGuide?: () => void;
  onOpenEmergencyHelp?: () => void;
  onOpenUntangleKnot?: () => void;
  onOpenBatteryCheck?: () => void;
}

export const RescueScreen: React.FC<RescueScreenProps> = ({
  onNavigate,
  onOpenArticle,
  onOpenEmergencyModal,
  onOpenRescueKit,
  onOpenPsychologicalER,
  onOpenSpecialistGuide,
  onOpenEmergencyHelp,
  onOpenUntangleKnot,
  onOpenBatteryCheck
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(RESCUE_KIT_PLANS[0]?.id || 'distress');
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });

  const activePlan = RESCUE_KIT_PLANS.find(p => p.id === selectedPlanId) || RESCUE_KIT_PLANS[0];

  const toggleStep = (stepNum: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  return (
    <div className="min-h-screen bg-[#070b09] text-[#e8f2ec] pb-24 font-sans selection:bg-[#355C4A]/40" dir="rtl">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[#1b2f25]/80 bg-[#0c1410]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#7aa892]">
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              الرئيسية
            </button>
            <span>/</span>
            <span className="text-[#d8f0e2] font-medium">خطط المساندة</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenEmergencyModal ? onOpenEmergencyModal() : onNavigate('support')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-bold hover:bg-rose-500/25 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>خط ساخن للطوارئ</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#213a2e] text-[#a4c9b6] hover:bg-[#13221b] text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>عودة</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>القسم الخامس: خطط المساندة والإنقاذ النفسي السريع</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#f2f9f5] tracking-tight leading-snug mb-3">
            خطط مساندة عملية للحظات الصعبة
          </h1>
          <p className="text-sm md:text-base text-[#9abfb0] leading-relaxed">
            عندما يفور الانفعال أو تضيق الأنفاس أو تشتتك الحيرة، لا تحتاج إلى نصائح فلسفية عامة، بل خطوات محددة بالترتيب: ماذا تفعل بجسدك الآن، وكيف تهدئ عقلك خطوة بخطوة.
          </p>
        </div>

        {/* Plan Selector Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#8eb5a2] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>اختر الحالة التي تصف ما تمر به الآن:</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {RESCUE_KIT_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <button
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setExpandedSteps({ 1: true, 2: true, 3: true, 4: true });
                  }}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-[#0f1914] border-[#1b2f25] hover:border-[#2d4e3e] text-[#a4c9b6]'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{plan.emoji}</div>
                  <div>
                    <h3 className={`text-xs md:text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-[#d8ece1]'}`}>
                      {plan.title.replace('خطة وقت ', '')}
                    </h3>
                    <span className="text-[10px] text-[#709583] line-clamp-1 mt-0.5">
                      {plan.steps.length} خطوات عملية
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Plan Detail Card */}
        {activePlan && (
          <div className="bg-[#0e1813] border border-[#213a2e] rounded-2xl p-5 md:p-8 mb-10 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1b2f25]">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#14241c] border border-[#264434] flex items-center justify-center text-3xl">
                  {activePlan.emoji}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    <span>{activePlan.title}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-[#9ec4b3] mt-1">
                    {activePlan.tagline}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {activePlan.relatedToolTab && (
                  <button
                    onClick={() => onNavigate(activePlan.relatedToolTab!)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>تمرين متصل بهذه الخطة</span>
                  </button>
                )}
                {activePlan.relatedArticleId && onOpenArticle && (
                  <button
                    onClick={() => onOpenArticle(activePlan.relatedArticleId!)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#13221b] hover:bg-[#1a3026] border border-[#284838] text-[#c2dfd1] text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>قراءة المقال المرتبط</span>
                  </button>
                )}
              </div>
            </div>

            {/* Steps Container */}
            <div className="pt-6 space-y-4">
              <h4 className="text-sm font-bold text-[#b5dac7] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>الخطوات الموصى بها بالترتيب:</span>
              </h4>

              <div className="space-y-3.5">
                {activePlan.steps.map((step) => {
                  const isExpanded = expandedSteps[step.number] ?? true;
                  return (
                    <div 
                      key={step.number}
                      className="border border-[#1f372b] rounded-xl bg-[#09110d] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleStep(step.number)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-right hover:bg-[#0d1813] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center">
                            {step.number}
                          </span>
                          <span className="text-sm md:text-base font-bold text-white">
                            {step.title}
                          </span>
                        </div>
                        <div className="text-[#6d9480]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#16271e] text-xs md:text-sm space-y-3">
                          <p className="text-[#cae4d6] leading-relaxed bg-[#0e1b15] p-3 rounded-lg border border-[#1d3528]">
                            {step.action}
                          </p>
                          <div className="flex items-start gap-2 text-[#8eb7a3] bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              <span className="font-semibold text-amber-300">نصيحة أخصائي: </span>
                              {step.tip}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Immediate Mental First Aid & Hotline Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Emergency Helplines */}
          <div className="bg-gradient-to-br from-[#121b16] to-[#0d1611] border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  الخطوط الساخنة المجانية للمساندة النفسية
                </h3>
                <p className="text-xs text-[#a3c9b7] leading-relaxed mb-4">
                  إذا كنت في خطر فوري أو تشعر بأنك عاجز تماماً عن السيطرة على أفكارك، لا تتردد في الاتصال المباشر بالمختصين مجاناً:
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#09110d] border border-[#213a2e] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-200">الأمانة العامة للصحة النفسية (مصر)</div>
                      <div className="text-[11px] text-[#7da391]">خدمة مجانية على مدار 24 ساعة</div>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-300 font-mono" dir="ltr">16328 / 08008880700</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#09110d] border border-[#213a2e] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-200">خط نجدة الطفل والإرشاد الأسري</div>
                      <div className="text-[11px] text-[#7da391]">دعم نفسي واستشارات متخصصة</div>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-300 font-mono" dir="ltr">16000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Rescue Tools */}
          <div className="bg-[#0d1612] border border-[#20372b] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    أدوات تهدئة فورية داخل نسمة حياة
                  </h3>
                  <p className="text-xs text-[#8ab19e]">
                    جرب تمرين تفريغ أو تنفس مخصص قبل اتخاذ أي قرار
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#a0c5b3] leading-relaxed mb-4">
                جميع هذه الأدوات متاحة بدون تسجيل، تحفظ بياناتك على جهازك فقط وتوفر لك مساحة آمنة لتنظيم نبضات قلبك وأفكارك.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('breathe')}
                className="p-2.5 rounded-xl bg-[#122019] hover:bg-[#182c22] border border-[#274536] text-right transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-0.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>تنفس 4-7-8</span>
                </div>
                <div className="text-[10px] text-[#7fa693]">لتهدئة ضربات القلب</div>
              </button>

              <button
                onClick={() => onOpenUntangleKnot ? onOpenUntangleKnot() : onNavigate('games')}
                className="p-2.5 rounded-xl bg-[#122019] hover:bg-[#182c22] border border-[#274536] text-right transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-0.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>فكفكة المشاعر</span>
                </div>
                <div className="text-[10px] text-[#7fa693]">تسمية وفصل الأفكار</div>
              </button>

              <button
                onClick={() => onOpenBatteryCheck ? onOpenBatteryCheck() : onNavigate('self-discovery')}
                className="p-2.5 rounded-xl bg-[#122019] hover:bg-[#182c22] border border-[#274536] text-right transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-0.5">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span>شاحن الطاقة</span>
                </div>
                <div className="text-[10px] text-[#7fa693]">فحص طاقتك وتوزيعها</div>
              </button>

              <button
                onClick={() => onNavigate('support')}
                className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-right transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 mb-0.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>طلب استشارة</span>
                </div>
                <div className="text-[10px] text-[#86ac98]">تواصل مباشر بسرية</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
