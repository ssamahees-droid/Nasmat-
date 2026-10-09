import React from 'react';
import { 
  HeartHandshake, 
  ShieldAlert, 
  Stethoscope, 
  PhoneCall, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle,
  ChevronLeft,
  LifeBuoy
} from 'lucide-react';
import { RESCUE_KIT_PLANS } from '../data/newPhaseData';

interface RescueScreenProps {
  onNavigate: (tab: string) => void;
  onOpenRescueKit: (planId?: string) => void;
  onOpenPsychologicalER: () => void;
  onOpenSpecialistGuide: () => void;
  onOpenEmergencyHelp: () => void;
}

export const RescueScreen: React.FC<RescueScreenProps> = ({
  onNavigate,
  onOpenRescueKit,
  onOpenPsychologicalER,
  onOpenSpecialistGuide,
  onOpenEmergencyHelp
}) => {
  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-fade-in text-right">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-stone-400">
        <button 
          onClick={() => onNavigate('home')} 
          className="hover:text-emerald-400 transition-colors"
        >
          الرئيسية
        </button>
        <span>/</span>
        <span className="text-emerald-300 font-bold">عندما تحتاج إلى مساعدة — خطط المساندة النفسية</span>
      </nav>

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#241717] via-[#1B1414] to-[#120E0E] border border-rose-500/25 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-full text-rose-300 text-xs font-bold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>القسم السادس // حقيبة الإنقاذ وخطط المساندة الميدانية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal">
            شنطة الإسعاف النفسي... طوق نجاة في الأوقات الصعبة 🎒
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            "مش علاج نهائي... لكنها خطوات إنسانية صغيرة تساعدك تعدّي اللحظة الصعبة بسلام". عندما تهب العاصفة وتتزاحم المشاعر، لا تحتاج إلى نظريات معقدة؛ تحتاج فقط إلى خطوات محددة تخبرك ماذا تفعل الآن، وماذا تتجنب، ومتى تطلب المساعدة.
          </p>

          <div className="p-3 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-3 text-xs text-stone-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>إخلاء مسؤولية توعوي:</strong> هذه الخطط للمساندة الذاتية الأولية وليست بديلاً عن العلاج السريري أو الأدوية النفسية الموصوفة.
            </span>
          </div>
        </div>
      </section>

      {/* 7 Rescue Plans Grid */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              خطط المساندة العملية (اختر الخطة المناسبة لحالتك)
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              مقسمة إلى خطوات واضحة (1، 2، 3) ترشدك إلى تهدئة الجسد وحماية نفسك:
            </p>
          </div>
          <button
            onClick={() => onOpenRescueKit()}
            className="text-xs font-bold text-rose-400 hover:underline hidden sm:block"
          >
            تصفح الشنطة كاملة
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {RESCUE_KIT_PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onOpenRescueKit(plan.id)}
              className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1C221E] border border-white/10 hover:border-rose-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="text-3xl p-2 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
                  {plan.emoji}
                </div>
                
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  {plan.title}
                </h3>

                <p className="text-xs text-stone-400 leading-relaxed font-medium">
                  {plan.tagline}
                </p>

                <div className="text-[11px] text-emerald-400/90 font-bold pt-1">
                  ✓ {plan.steps.length} خطوات عملية مجربة
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-rose-300 font-bold">
                <span>فتح الخطة</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Quick Hotline Emergency Card */}
          <div
            onClick={onOpenEmergencyHelp}
            className="cursor-pointer p-5 bg-gradient-to-br from-[#301616] to-[#1E1111] border border-rose-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="text-3xl p-2 rounded-2xl bg-rose-500/20 inline-block group-hover:scale-110 transition-transform">
                🆘
              </div>
              
              <h3 className="text-base font-bold text-rose-200">
                خطوط الطوارئ والدعم الفوري
              </h3>

              <p className="text-xs text-rose-300/80 leading-relaxed font-medium">
                أرقام رسمية ومجانية للدعم والمساعدة النفسية المباشرة في الأوقات الحرجة.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/30 flex items-center justify-between text-xs text-rose-200 font-bold">
              <span>عرض أرقام الطوارئ</span>
              <PhoneCall className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clinical Interactive Support Tools */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tool 1: غرفة الطوارئ النفسية */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-rose-500/15 text-rose-300">🚨</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold">محاكاة عملية</span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              غرفة الطوارئ النفسية (Psychological ER)
            </h3>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> تدريب عملي وتفاعلي على 5 سيناريوهات حرجة (نوبة هلع، ألم عاطفي حاد، انهيار بكاء، رغبة في الانعزال التام، أفكار سوداوية).
              </p>
              <p>
                <strong>ماذا تتعلم منها:</strong> إتقان مهارة: ماذا أفعل فوراً؟ وماذا لا أفعله تحت أي ظرف؟ ومتى تكون استشارة الطبيب حتمية؟
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">٥ سيناريوهات ميدانية</span>
            <button
              onClick={onOpenPsychologicalER}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>بدء المحاكاة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tool 2: أخصائي أم طبيب نفسي؟ */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-teal-500/15 text-teal-300">🩺</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold">دليل بدون وصمة</span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
              دليل استشارة المختص: أخصائي أم طبيب نفسي؟
            </h3>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> توضيح الفروق الجوهرية بين المعالج النفسي (Psychologist) والطبيب النفسي (Psychiatrist) بدون أي وصمة عار.
              </p>
              <p>
                <strong>كيف يفيدك:</strong> يوضح لك أيهما تحتاج بحسب طبيعة الأعراض، وكيف تحضر نفسك للجلسة الأولى، والأسئلة التي يحق لك طرحها.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">دليل مبسط ومطمئن</span>
            <button
              onClick={onOpenSpecialistGuide}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>قراءة الدليل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* Direct Link to Support Ticket */}
      <section className="bg-gradient-to-r from-[#1E2C22] via-[#162019] to-[#141C18] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <HeartHandshake className="w-4 h-4" />
            <span>طلب مساندة شخصية مباشرة</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            هل تحتاج إلى من يسمعك ويوجهك في سرية تامة؟
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            يمكنك إرسال طلب دعم خاص لفريق مبادرة نسمة حياة مع الحفاظ التام على خصوصيتك وسريتك.
          </p>
        </div>

        <button
          onClick={() => onNavigate('support')}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2"
        >
          <span>الانتقال لطلب الدعم</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
