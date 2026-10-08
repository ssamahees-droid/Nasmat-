import React, { useState } from 'react';
import { Compass, X, Sparkles, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storage } from '../services/storage';

interface EmotionCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToJourney?: (note: string) => void;
}

interface EmotionCluster {
  id: string;
  category: string;
  color: string;
  emoji: string;
  nuances: {
    name: string;
    description: string;
    validation: string;
    gentleStep: string;
  }[];
}

const EMOTION_CLUSTERS: EmotionCluster[] = [
  {
    id: 'heavy',
    category: 'مشاعر الثقل والحزن',
    color: 'border-blue-300 bg-blue-50/50',
    emoji: '🌧️',
    nuances: [
      {
        name: 'إنهاك واستنزاف',
        description: 'جسدك ونفسك يعلنان نفاد الطاقة بعد فترة طويلة من المحاولة والتحمل.',
        validation: 'أنت لست فاشلاً أو كسولاً؛ بل كنت قوياً لفترة أطول مما ينبغي دون راحة كافية.',
        gentleStep: 'امنح نفسك إذناً بالتوقف اليوم، وإلغاء مهمة واحدة غير ضرورية.'
      },
      {
        name: 'شعور بالوحدة والغربة',
        description: 'الإحساس بأنك معزول في تجربتك، حتى وأنت محاط بالناس.',
        validation: 'هذا الشعور إنساني جداً، ويخبرك أنك تشتاق لاتصال حقيقي ودفء يفهمك.',
        gentleStep: 'تحدث مع صديق تثق به دون تكلف، أو اكتب خواطرك في مساحتك الخاصة.'
      },
      {
        name: 'خيبة أمل أو فقد',
        description: 'حزن على شيء تمنيته ولم يحدث، أو توقعات لم تتحقق.',
        validation: 'الحزن على ما فات حق مشروع لمشاعرك؛ لا تتعجل في القفز فوق الألم.',
        gentleStep: 'تنفس بعمق وضع يدك على صدرك كإشارة محبة لنفسك.'
      }
    ]
  },
  {
    id: 'restless',
    category: 'مشاعر القلق والتشتت',
    color: 'border-amber-300 bg-amber-50/50',
    emoji: '🌪️',
    nuances: [
      {
        name: 'تفكير متسارع (Overthinking)',
        description: 'العقل يقفز بين احتمالات المستقبل وسيناريوهات "ماذا لو؟".',
        validation: 'دماغك يحاول حمايتك بطريقة مفرطة، وليس دليلاً على وجود خطر حتمي الآن.',
        gentleStep: 'جرّب تمرين التنفس المربع 4×4 لاستعادة الارتكاز في الحاضر.'
      },
      {
        name: 'الخوف من التقصير أو الفشل',
        description: 'صوت داخلي يخبرك بأن ما تفعله ليس كافياً أو أن هناك كارثة قادمة.',
        validation: 'السعي للكمال فخ يستنزف الأرواح، وقيمتك الإنسانية غير مشروطة بالإنجاز الدائم.',
        gentleStep: 'قل لنفسك: "أنا أفعل ما بوسعي اليوم، وهذا يكفي لهذه اللحظة".'
      }
    ]
  },
  {
    id: 'conflict',
    category: 'مشاعر الغضب والضيق',
    color: 'border-rose-300 bg-rose-50/50',
    emoji: '🔥',
    nuances: [
      {
        name: 'انتهاك الحدود الشخصية',
        description: 'شعور بالغضب بعد أن ضغطت على نفسك لإرضاء الآخرين على حساب راحتك.',
        validation: 'غضبك هنا هو جرس إنذار صحي يذكرك بأن كرامتك وطاقتك لهما حرمة تستحق الحماية.',
        gentleStep: 'راجع مقال "الحدود الصحية وفن قول لا" في مكتبة المحتوى.'
      },
      {
        name: 'إحباط وعجز عن التغيير',
        description: 'مواقف خارجة عن إرادتك تشعرك بالغبن والضيق الشديد.',
        validation: 'من الطبيعي أن تشعر بالضيق حين لا تسير الأمور بعدالة، لكن تركيزك على ما تملكه يعيد لك التوازن.',
        gentleStep: 'افصل بين ما تملكه اليوم وما لا تستطيع التحكم فيه.'
      }
    ]
  }
];

export const EmotionCompassModal: React.FC<EmotionCompassModalProps> = ({
  isOpen,
  onClose,
  onSaveToJourney
}) => {
  const [selectedNuance, setSelectedNuance] = useState<EmotionCluster['nuances'][0] | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveToJourney = () => {
    if (!selectedNuance) return;
    const text = `استكشفت مشاعري عبر بوصلة المشاعر: شعرت بـ «${selectedNuance.name}». التذكير اللطيف: ${selectedNuance.validation}`;
    storage.addNote(text);
    if (onSaveToJourney) onSaveToJourney(text);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 shadow-2xl text-right max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8FAF9A]/20 text-[#355C4A] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26332D]">بوصلة المشاعر 🧭</h2>
              <p className="text-[11px] text-[#52645B]">سمّي شعورك بدقة لتهدأ حدّته في داخلك</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {selectedNuance ? (
          /* Detailed Nuance Reflection */
          <div className="my-5 space-y-4 animate-fade-in">
            <button
              onClick={() => setSelectedNuance(null)}
              className="text-xs font-bold text-[#355C4A] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              <span>العودة لخيارات البوصلة</span>
            </button>

            <div className="p-4 bg-white rounded-2xl border border-[#8FAF9A]/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="font-bold text-base text-[#26332D]">{selectedNuance.name}</h3>
              </div>
              <p className="text-xs text-[#52645B] leading-relaxed">
                {selectedNuance.description}
              </p>
            </div>

            {/* Validation */}
            <div className="p-4 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl space-y-1 text-xs text-[#35453E] leading-relaxed">
              <div className="font-bold text-[#355C4A] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#355C4A]" />
                <span>احتواء الشعور دون لوم:</span>
              </div>
              <p>{selectedNuance.validation}</p>
            </div>

            {/* Gentle Step */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl space-y-1 text-xs text-amber-950">
              <div className="font-bold">خطوة لطيفة مقترحة الآن:</div>
              <p>{selectedNuance.gentleStep}</p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleSaveToJourney}
                className="flex-1 py-3 px-4 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>تم الحفظ في رحلتي</span>
                  </>
                ) : (
                  <span>حفظ هذا الوعي في رحلتي</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Clusters List */
          <div className="my-4 space-y-4">
            <p className="text-xs text-[#52645B] leading-relaxed">
              تسمية الشعور بدقة هي أولى خطوات التعافي والهدوء. اختر ما يلامس قلبك الآن:
            </p>

            <div className="space-y-3">
              {EMOTION_CLUSTERS.map(cluster => (
                <div key={cluster.id} className={`p-4 rounded-2xl border ${cluster.color} space-y-2.5`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#26332D]">
                    <span>{cluster.emoji}</span>
                    <span>{cluster.category}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cluster.nuances.map(nuance => (
                      <button
                        key={nuance.name}
                        onClick={() => setSelectedNuance(nuance)}
                        className="py-1.5 px-3 bg-white/90 hover:bg-[#355C4A] hover:text-white border border-[#E8DDCC] rounded-xl text-xs font-medium transition-all text-[#26332D] shadow-2xs"
                      >
                        {nuance.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
