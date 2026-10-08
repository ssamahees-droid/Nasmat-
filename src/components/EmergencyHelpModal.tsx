import React from 'react';
import { X, ShieldAlert, Phone, HeartHandshake } from 'lucide-react';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#26332D]">
                محتاج مساعدة؟ 🆘
              </h2>
              <p className="text-[11px] text-[#52645B]">
                إرشادات السلامة والدعم العاجل
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

        {/* Core Message (Section 11) */}
        <div className="my-5 space-y-4 text-xs sm:text-sm text-[#35453E] leading-relaxed">
          <div className="p-4 bg-white rounded-2xl border border-amber-200/70 space-y-2">
            <div className="font-bold text-[#26332D] flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#355C4A]" />
              <span>تنبيه أمان أساسي:</span>
            </div>
            <p className="text-xs text-[#52645B] leading-relaxed">
              <strong>«نسمة حياة» محتوى تثقيفي وتمارين للمساعدة الذاتية، وليست بديلاً عن الطبيب أو المعالج النفسي.</strong>
            </p>
          </div>

          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-2 text-rose-950">
            <div className="font-bold text-xs">إذا كنت في خطر فوري أو تراودك أفكار لإيذاء نفسك أو شخص آخر:</div>
            <p className="text-xs leading-relaxed">
              <strong>أرجوك لا تعتمد على التطبيق وحده.</strong> تواصل فوراً مع شخص مقرب تثق به، أو اتصل بخدمات الطوارئ أو توجّه لأقرب مستشفى أو قسم طوارئ، <strong>ولا تبقَ وحدك مع الخطر</strong>.
            </p>
          </div>

          {/* Quick Helplines */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8DDCC]">
              <div>
                <div className="font-bold text-xs text-[#26332D]">خط الأمانة العامة للصحة النفسية (مصر)</div>
                <div className="text-[10px] text-[#52645B]">دعم نفسي ومجاني</div>
              </div>
              <a href="tel:16328" className="px-3 py-1.5 bg-[#355C4A] text-white font-mono font-bold text-xs rounded-xl">
                16328
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8DDCC]">
              <div>
                <div className="font-bold text-xs text-[#26332D]">الخط الساخن الوطني المجاني</div>
                <div className="text-[10px] text-[#52645B]">متاح على مدار الساعة</div>
              </div>
              <a href="tel:08008880700" className="px-3 py-1.5 bg-[#8C6D46] text-white font-mono font-bold text-xs rounded-xl">
                08008880700
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8DDCC]">
              <div>
                <div className="font-bold text-xs text-red-900">طوارئ الإسعاف</div>
                <div className="text-[10px] text-red-700">للحالات الحرجة والتدخل الفوري</div>
              </div>
              <a href="tel:123" className="px-3 py-1.5 bg-red-700 text-white font-mono font-bold text-xs rounded-xl">
                123
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8DDCC]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl transition-colors"
          >
            تفهّمت الرسالة وسأطلب الرعاية اللازمة 🤍
          </button>
        </div>
      </div>
    </div>
  );
};
