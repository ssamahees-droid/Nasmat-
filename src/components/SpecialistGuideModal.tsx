import React, { useState } from 'react';
import { X, UserCheck, Stethoscope, ShieldAlert, CheckCircle2, ArrowLeft, Phone, HeartHandshake } from 'lucide-react';
import { TakeawayResultCard } from './TakeawayResultCard';

interface SpecialistGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergencyHelp: () => void;
  onNavigateToSupport: () => void;
}

export const SpecialistGuideModal: React.FC<SpecialistGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenEmergencyHelp,
  onNavigateToSupport
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'when_to_seek' | 'quiz'>('comparison');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleConcern = (id: string) => {
    setSelectedConcerns(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getRecommendation = () => {
    const hasSevereOrSomatic = selectedConcerns.includes('panic') || selectedConcerns.includes('severe_insomnia') || selectedConcerns.includes('hallucinations');
    const hasTalkTherapy = selectedConcerns.includes('relationships') || selectedConcerns.includes('overthinking') || selectedConcerns.includes('grief');

    if (hasSevereOrSomatic && hasTalkTherapy) {
      return {
        title: 'استشارة مشتركة (طبيب نفسي + أخصائي نفسي)',
        desc: 'أعراضك تجمع بين التأثير الجسدي/الفسيولوجي وضغوط التفكير والعلاقات. من الأفضل إجراء تقييم طبي مبدئي مع المتابعة في جلسات علاج نفسي.',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-950'
      };
    } else if (hasSevereOrSomatic) {
      return {
        title: 'البدء مع طبيب نفسي (Psychiatrist)',
        desc: 'نظراً لوجود أعراض فسيولوجية حادة أو اضطراب نوم شديد، الطبيب النفسي يستطيع فحص الأسباب العضوية وتقييم الحاجة لعلاج دوائي مهدئ عند اللزوم.',
        color: 'bg-sky-50 border-sky-200 text-sky-950'
      };
    } else {
      return {
        title: 'البدء مع أخصائي نفسي (Psychologist / Therapist)',
        desc: 'الأخصائي النفسي خيار ممتاز للبدء في جلسات استكشاف المشاعر وتعديل أنماط التفكير وتفريغ ضغوط العلاقات دون أدوية.',
        color: 'bg-[#8FAF9A]/20 border-[#8FAF9A]/50 text-[#26332D]'
      };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🩺</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                أخصائي نفسي أم طبيب نفسي؟
              </h2>
              <p className="text-[11px] text-[#52645B]">
                دليل توجيه مبسط بدون تخويف أو وصمة (أذهب لمَن؟)
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

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-[#E8DDCC]/40 p-1 rounded-2xl shrink-0 mt-3 text-xs">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
              activeTab === 'comparison'
                ? 'bg-white text-[#355C4A] shadow-xs'
                : 'text-[#52645B] hover:text-[#26332D]'
            }`}
          >
            الفرق بين الدورين
          </button>
          <button
            onClick={() => setActiveTab('when_to_seek')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
              activeTab === 'when_to_seek'
                ? 'bg-white text-[#355C4A] shadow-xs'
                : 'text-[#52645B] hover:text-[#26332D]'
            }`}
          >
            متى أطلب المساعدة؟
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
              activeTab === 'quiz'
                ? 'bg-white text-[#355C4A] shadow-xs'
                : 'text-[#52645B] hover:text-[#26332D]'
            }`}
          >
            فحص توجيهي سريع
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {activeTab === 'comparison' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Psychologist Card */}
                <div className="p-4 bg-white border border-[#8FAF9A]/60 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[#355C4A]">
                    <UserCheck className="w-5 h-5" />
                    <h3 className="font-extrabold text-sm">الأخصائي النفسي (Psychologist)</h3>
                  </div>
                  <ul className="text-xs text-[#35453E] space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>متخصص حاصل على دراسات عليا في علم النفس العيادي.</li>
                    <li>يقدم <strong>التقييم النفسي وجلسات العلاج بالكلام</strong> (العلاج المعرفي السلوكي وغيره).</li>
                    <li>يساعدك على فهم أفكارك ومشاعرك وتغيير سلوكياتك.</li>
                    <li><strong>لا يصف أدوية طبية</strong>.</li>
                  </ul>
                </div>

                {/* Psychiatrist Card */}
                <div className="p-4 bg-white border border-sky-300 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-sky-800">
                    <Stethoscope className="w-5 h-5" />
                    <h3 className="font-extrabold text-sm">الطبيب النفسي (Psychiatrist)</h3>
                  </div>
                  <ul className="text-xs text-[#35453E] space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>طبيب بشري تخصص في الطب النفسي والصحة النفسية.</li>
                    <li>يقوم بالتشخيص الطبي وفحص التأثيرات الجسدية والعصبية.</li>
                    <li><strong>يصف العلاج الدوائي عند الحاجة</strong> ويتابع الجرعات.</li>
                    <li>قد يقدم أيضاً استشارات وعلاجاً نفسياً.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950 leading-relaxed">
                <div className="font-bold flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-800" />
                  <span>ليس المطلوب منك أن تعرف وحدك أيهما تحتاج:</span>
                </div>
                <p>
                  يمكن أن تبدأ بطلب تقييم من مختص مؤهل (سواء أخصائي أو طبيب)، وهو بدوره يوجهك للخطوة المناسبة، وكثير من الحالات تستفيد جداً من التعاون المشترك بينهما.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E8DDCC] rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#26332D] block">هل تحتاج استشارة توجيهية؟</span>
                  <span className="text-[#7D8F85] text-[11px]">يمكنك إرسال طلب في قسم «محتاج أتكلم»</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToSupport();
                  }}
                  className="px-3 py-1.5 bg-[#355C4A] hover:bg-[#264235] text-white font-bold rounded-xl text-xs transition-colors"
                >
                  طلب توجيه
                </button>
              </div>
            </div>
          )}

          {activeTab === 'when_to_seek' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-[#26332D]">
                  ليس من الضروري أن تصل إلى أسوأ مرحلة حتى تطلب المساعدة:
                </h3>
                <p className="text-xs text-[#52645B]">
                  فكر في طلب المساعدة عندما تلاحظ الآتي:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'تستمر الأعراض لأكثر من أسبوعين ولا تتحسن.',
                  'تبدأ في التأثير بوضوح على عملك أو دراستك.',
                  'تتأثر علاقاتك بالأشخاص المقربين بشكل سلبي.',
                  'تصبح غير قادر على القيام بمهامك اليومية البسيطة.',
                  'تشعر أن محاولاتك الذاتية وحدها لم تعد كافية.',
                  'أو ببساطة تشعر بحاجة لشخص متخصص يفهم ما تمر به بإنصات آمن.'
                ].map((sign, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#E8DDCC] rounded-xl flex items-start gap-2 text-[#35453E]">
                    <CheckCircle2 className="w-4 h-4 text-[#355C4A] shrink-0 mt-0.5" />
                    <span>{sign}</span>
                  </div>
                ))}
              </div>

              {/* Emergency Warning */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-rose-950">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>متى تصبح المسألة طارئة وتستدعي تدخلاً فورياً؟</span>
                </div>
                <p className="text-xs leading-relaxed">
                  إذا كان الشخص معرضاً لخطر فوري، أو لديه أفكار لإيذاء نفسه أو غيره، أو أصبح غير قادر على الحفاظ على سلامته: <strong>لا تتركه وحده وتوجه فوراً إلى أقرب مستشفى أو اتصل بالطوارئ (123 أو 16328)</strong>.
                </p>
                <button
                  onClick={onOpenEmergencyHelp}
                  className="py-2 px-3 bg-rose-700 text-white font-bold text-xs rounded-xl hover:bg-rose-800 transition-colors"
                >
                  فتح دليل الطوارئ والخطوط الساخنة 🆘
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#26332D]">
                  ما الأعراض الأكثر إزعاجاً لك في الوقت الحالي؟
                </h3>
                <p className="text-xs text-[#52645B]">
                  حدد الأعراض التي تعاني منها للحصول على توجيه عام مبدئي:
                </p>
              </div>

              <div className="space-y-1.5">
                {[
                  { id: 'relationships', label: 'مشاكل في العلاقات أو صعوبة في التواصل والتعبير' },
                  { id: 'overthinking', label: 'كثرة التفكير، القلق العام، وجلد الذات المستمر' },
                  { id: 'grief', label: 'حزن ناتج عن فقدان شخص، صدمة، أو خذلان' },
                  { id: 'panic', label: 'نوبات هلع، تسارع نبض مفاجئ، وخوف من الموت دون سبب عضوي' },
                  { id: 'severe_insomnia', label: 'أرق مستمر لأسابيع أو صعوبة شديدة في النوم' },
                  { id: 'hallucinations', label: 'سماع أو رؤية أشياء لا يراها الآخرون أو شكوك مفرطة' }
                ].map((item) => {
                  const isChecked = selectedConcerns.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleConcern(item.id)}
                      className={`w-full p-3 rounded-xl border text-right text-xs transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#355C4A] text-white border-[#355C4A] font-bold'
                          : 'bg-white hover:bg-stone-50 text-[#26332D] border-[#E8DDCC]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-white text-[#355C4A] border-white' : 'border-stone-300'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedConcerns.length > 0 && (
                <div className={`p-4 rounded-2xl border ${getRecommendation().color} space-y-1.5 animate-fade-in`}>
                  <div className="font-extrabold text-xs">
                    💡 التوجيه المقترح: {getRecommendation().title}
                  </div>
                  <p className="text-xs leading-relaxed">
                    {getRecommendation().desc}
                  </p>
                </div>
              )}
            </div>
          )}

          <TakeawayResultCard
            quote="«طلب المساعدة ليس حكماً على شخصيتك.. إنه قرار بأنك لا تريد أن تظل عالقاً في الألم»"
            onTryAnother={() => setActiveTab('comparison')}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
