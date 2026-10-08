import React from 'react';
import { X, Layers, ArrowLeft, ShieldAlert, HeartHandshake, Compass, Brain, Heart, Sparkles, UserCheck } from 'lucide-react';

interface WorkshopsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPsychologicalER: () => void;
  onOpenConflictWithoutWar: () => void;
  onOpenHealingJourney: () => void;
  onOpenPersonalPlan: () => void;
  onOpenEnergyBudget: () => void;
  onOpenBoundaryBuilder: () => void;
  onOpenUntangleKnot: () => void;
  onOpenTranslateFeelings: () => void;
  onOpenFactGame: () => void;
  onOpenSpecialistGuide: () => void;
}

export const WorkshopsHubModal: React.FC<WorkshopsHubModalProps> = ({
  isOpen,
  onClose,
  onOpenPsychologicalER,
  onOpenConflictWithoutWar,
  onOpenHealingJourney,
  onOpenPersonalPlan,
  onOpenEnergyBudget,
  onOpenBoundaryBuilder,
  onOpenUntangleKnot,
  onOpenTranslateFeelings,
  onOpenFactGame,
  onOpenSpecialistGuide
}) => {
  if (!isOpen) return null;

  const workshopsList = [
    {
      id: 'er',
      title: 'تحت الضغط: غرفة الطوارئ النفسية 🚨',
      tag: 'محاكاة تفاعلية',
      tagColor: 'bg-rose-100 text-rose-800',
      description: 'محاكاة 5 سيناريوهات: ماذا أفعل الآن؟ ماذا لا أفعل؟ ومتى أطلب مساعدة؟ دون لعب دور الطبيب.',
      action: onOpenPsychologicalER,
      btnLabel: 'دخول المحاكاة'
    },
    {
      id: 'conflict',
      title: 'خلاف بدون معركة 🤝',
      tag: 'للأزواج والأسرة',
      tagColor: 'bg-emerald-100 text-emerald-800',
      description: 'مقارنة حية بين الهجوم ❌، الانسحاب ❌، والحوار الصحي ✅ مع تدريب التعبير عن الاحتياج والاتفاق.',
      action: onOpenConflictWithoutWar,
      btnLabel: 'بدء التدريب'
    },
    {
      id: 'healing',
      title: 'اتأذيت... إزاي أتعافى؟ 🌱',
      tag: 'تفكيك الصدمة والخذلان',
      tagColor: 'bg-sky-100 text-sky-800',
      description: 'تحويل التجربة المؤلمة من سجن تعيش داخله إلى وعي تفهم أثره وتتعامل معه عبر 5 خطوات.',
      action: onOpenHealingJourney,
      btnLabel: 'بدء التمرين'
    },
    {
      id: 'rescue_plan',
      title: 'خطة إنقاذي والعودة لنفسي 📑',
      tag: 'ورشة ختام البرنامج',
      tagColor: 'bg-amber-100 text-amber-800',
      description: 'ما يستنزفني ← علامات تدهوري ← ما يساعدني ← الأشخاص الآمنون ← خطة الرعاية الشخصية القابلة للتطبيق.',
      action: onOpenPersonalPlan,
      btnLabel: 'بناء خطتي'
    },
    {
      id: 'burnout',
      title: 'أنا تعبت... ماذا يحدث لي؟ ⚖️',
      tag: 'ميزانية الطاقة',
      tagColor: 'bg-teal-100 text-teal-800',
      description: 'التفرقة بين التعب الجسدي والنفسي، خريطة الاستنزاف الشخصية، وما يمكنك تقليله هذا الأسبوع.',
      action: onOpenEnergyBudget,
      btnLabel: 'ضبط الميزانية'
    },
    {
      id: 'boundaries',
      title: 'أقول "لا" من غير ما أحس بالذنب 🛡️',
      tag: 'الحدود الشخصية',
      tagColor: 'bg-indigo-100 text-indigo-800',
      description: 'التدرب على الرفض وصيغة «محتاج أفكر وأرد عليك» لحماية نفسك بدون عدوان وبدون جلد للذات.',
      action: onOpenBoundaryBuilder,
      btnLabel: 'مختبر الحدود'
    },
    {
      id: 'overthinking',
      title: 'لما دماغي ما تسكتش 🧩',
      tag: 'التفكير الزائد والاجترار',
      tagColor: 'bg-purple-100 text-purple-800',
      description: 'تطبيق عملي للفصل بين: الحدث ← الفكرة ← الشعور ← رد الفعل، وتصغير العقدة.',
      action: onOpenUntangleKnot,
      btnLabel: 'فك العقدة'
    },
    {
      id: 'emotions',
      title: 'أنا مشاعري مش أعدائي 🗣️',
      tag: 'أشعر ← أفهم ← أعبّر',
      tagColor: 'bg-orange-100 text-orange-800',
      description: 'التعامل مع الغضب والحزن والخذلان، والتعبير عنها بوضوح بدون كبت وبدون انفجار.',
      action: onOpenTranslateFeelings,
      btnLabel: 'ترجمة المشاعر'
    },
    {
      id: 'fact_story',
      title: 'لعبة الحقيقة ولا الحكاية؟ 🎮',
      tag: 'تمييز الواقع عن التفسير',
      tagColor: 'bg-stone-200 text-stone-800',
      description: 'تدريب تفاعلي لفرز ما حدث بالفعل عن الحكاية والأحكام التي أضافها عقلك في اللحظة.',
      action: onOpenFactGame,
      btnLabel: 'بدء الجولة'
    },
    {
      id: 'specialist',
      title: 'أخصائي أم طبيب نفسي؟ 🩺',
      tag: 'التوجيه والإحالة',
      tagColor: 'bg-rose-100 text-rose-800',
      description: 'شرح بسيط للفرق بين الأدوار بدون تخويف أو وصمة، ومتى تكون المسألة طارئة.',
      action: onOpenSpecialistGuide,
      btnLabel: 'دليل التوجيه'
    }
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
              🛠️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  استوديو الورش التطبيقية
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2.5 py-0.5 rounded-full font-bold">
                  برنامج نسمة حياة
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5">
                ورش وتطبيقات عملية لبناء صندوق أدواتك النفسية والتعامل مع الأيام الصعبة
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

        {/* Workshops Grid */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workshopsList.map((ws) => (
              <div
                key={ws.id}
                className="p-4 bg-white border border-[#E5DACB] hover:border-[#3A5A40] rounded-2xl transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${ws.tagColor}`}>
                      {ws.tag}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-[#283618] group-hover:text-[#3A5A40] transition-colors">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-[#58645C] mt-1.5 leading-relaxed line-clamp-2 font-medium">
                    {ws.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5DACB]/60 flex items-center justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      ws.action();
                    }}
                    className="py-1.5 px-3.5 bg-[#FAF7F2] hover:bg-[#3A5A40] text-[#3A5A40] hover:text-white border border-[#E5DACB] hover:border-[#3A5A40] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{ws.btnLabel}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
