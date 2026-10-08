import React from 'react';
import { Phone, HeartHandshake, ShieldAlert, X } from 'lucide-react';

interface SafetyFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyFlagModal: React.FC<SafetyFlagModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-title"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Soft reassuring header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E8DDCC]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="safety-title" className="text-xl font-bold text-[#26332D]">
                سلامتك وأمانك هما الأهم 🤍
              </h2>
              <p className="text-xs text-[#52645B] mt-0.5">
                مسار الأمان النفسي والرعاية المباشرة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Message */}
        <div className="my-5 space-y-4 text-sm leading-relaxed text-[#35453E]">
          <p className="font-medium text-[#26332D]">
            إجابتك أو طلبك يشير إلى أنك قد تمر بلحظات ثقيلة جداً أو تفكير مجهد ومؤلم. نريد أن نؤكد لك أنك لست وحدك، وأن مشاعرك تستحق الرعاية الحقيقية.
          </p>
          
          <div className="p-4 bg-white/80 rounded-2xl border border-[#E8DDCC] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#355C4A]">
              <HeartHandshake className="w-4 h-4 text-[#8FAF9A]" />
              <span>تنبيه هام ومخلص:</span>
            </div>
            <p className="text-xs text-[#52645B] leading-normal">
              تطبيق «نسمة حياة» هو منصة للتوعية والاستكشاف الذاتي الآمن، <strong>ولا يقدم خدمة طوارئ أو تدخلاً طبياً عاجلاً</strong>. إذا كنت تشعر بالخطر على حياتك أو تراودك أفكار لإيذاء نفسك، يرجى التواصل فوراً مع الخطوط المجانية المعتمدة التالية أو التوجه لأقرب مركز صحي:
            </p>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3.5 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#355C4A]" />
                <div>
                  <div className="font-bold text-[#26332D]">خط الأمانة العامة للصحة النفسية (مصر)</div>
                  <div className="text-xs text-[#52645B]">متاح مجاناً للمشورة والدعم النفسي العاجل</div>
                </div>
              </div>
              <a
                href="tel:16328"
                className="px-3.5 py-1.5 bg-[#355C4A] text-white font-mono text-sm font-bold rounded-xl hover:bg-[#264235] transition-colors"
              >
                16328
              </a>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF3E0] border border-[#E8DDCC] rounded-2xl">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8C6D46]" />
                <div>
                  <div className="font-bold text-[#26332D]">الخط الساخن الوطني المجاني</div>
                  <div className="text-xs text-[#52645B]">رقم هاتف مجاني على مدار الساعة</div>
                </div>
              </div>
              <a
                href="tel:08008880700"
                className="px-3.5 py-1.5 bg-[#8C6D46] text-white font-mono text-xs font-bold rounded-xl hover:bg-[#725735] transition-colors"
              >
                08008880700
              </a>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-red-50 border border-red-200/60 rounded-2xl">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-700" />
                <div>
                  <div className="font-bold text-red-950">طوارئ الإسعاف المباشر</div>
                  <div className="text-xs text-red-700">للحالات الطبية الطارئة والتدخل السريع</div>
                </div>
              </div>
              <a
                href="tel:123"
                className="px-3.5 py-1.5 bg-red-700 text-white font-mono text-sm font-bold rounded-xl hover:bg-red-800 transition-colors"
              >
                123
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#E8DDCC] flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[#355C4A] hover:bg-[#264235] text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
          >
            تفهّمت الرسالة وسأطلب الدعم 🤍
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-white hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] font-medium text-sm rounded-xl transition-colors"
          >
            العودة للتطبيق
          </button>
        </div>
      </div>
    </div>
  );
};
