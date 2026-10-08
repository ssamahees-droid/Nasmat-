import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, HeartHandshake, Check, Download, Sparkles, Printer, User, Phone, ArrowLeft, RefreshCw } from 'lucide-react';
import { storage } from '../services/storage';
import { PersonalNesmatPlan, DEFAULT_PERSONAL_PLAN } from '../data/bookletData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface PersonalPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalPlanModal: React.FC<PersonalPlanModalProps> = ({ isOpen, onClose }) => {
  const [plan, setPlan] = useState<PersonalNesmatPlan>(() => {
    return storage.getPersonalPlan() || DEFAULT_PERSONAL_PLAN;
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'card'>('edit');

  useEffect(() => {
    if (isOpen) {
      const saved = storage.getPersonalPlan();
      if (saved) setPlan(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof PersonalNesmatPlan, val: string) => {
    setPlan(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    storage.savePersonalPlan(plan);
    storage.addNote(`📑 قمت بتحديث «خطة نسمة حياة الخاصة بي» لحماية استقراري النفسي.`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setViewMode('card');
  };

  const handleDownloadPlan = () => {
    const text = `==============================
خطة نسمة حياة الخاصة بي 🌱
(تطبيق نسمة حياة - خطة الأمان والتعافي الشخصية)
==============================
تاريخ التحديث: ${new Date().toLocaleDateString('ar-EG')}

1. عندما أبدأ في التدهور، ألاحظ أنني:
${plan.deteriorationSigns || 'لم يُحدد بعد'}

2. أكثر الأشياء التي تستنزفني:
${plan.majorDrains || 'لم يُحدد بعد'}

3. الأشياء التي تساعدني عادةً:
${plan.helpfulThings || 'لم يُحدد بعد'}

4. الشخص الذي أستطيع التحدث معه:
${plan.trustedPerson || 'لم يُحدد بعد'}

5. المختص أو الجهة التي يمكنني طلب المساعدة منها:
${plan.specialistOrHelpline || 'الخط الساخن للأمانة العامة للصحة النفسية: 16328'}

6. الخطوة التي سأقوم بها إذا شعرت أنني لم أعد قادراً على التعامل وحدي:
${plan.crisisStep || 'التواصل فوراً مع شخص آمن أو الاتصال بالخط الساخن'}
==============================
تذكر دائماً: طلب المساعدة ليس هزيمة.. أحياناً يكون أول خطوة في طريق العودة إلى الحياة.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `خطة_نسمة_حياة_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
            <span className="text-2xl">📑</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                خطة نسمة حياة الخاصة بي
              </h2>
              <p className="text-[11px] text-[#52645B]">
                صفحتان تملؤهما بنفسك لتكون مرجعك الآمن وقت التعب والضغوط
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(prev => prev === 'edit' ? 'card' : 'edit')}
              className="py-1 px-3 bg-white hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] text-xs font-bold rounded-xl transition-colors"
            >
              {viewMode === 'edit' ? 'معاينة كارت الخطة 📋' : 'تعديل الخطة ✏️'}
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {viewMode === 'edit' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl text-xs text-emerald-950 leading-relaxed">
                💡 <strong>فكرة الخطة:</strong> أن تحدد مسبقاً مؤشراتك وملاذك الآمن وأنت في حالة هدوء، حتى لا تضطر للتفكير في الحلول وأنت في ذروة التعب.
              </div>

              {/* Field 1: العلامات المبكرة */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#26332D]">
                  1. عندما أبدأ في التدهور، ألاحظ أنني:
                </label>
                <textarea
                  rows={2}
                  value={plan.deteriorationSigns}
                  onChange={(e) => handleChange('deteriorationSigns', e.target.value)}
                  placeholder="مثال: أنعزل عن الناس، يضطرب نومي، أنفعل بسرعة، أهمل أكلي، تتسارع أفكاري..."
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Field 2: أكثر الأشياء المستنزفة */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#26332D]">
                  2. أكثر الأشياء التي تستنزفني:
                </label>
                <textarea
                  rows={2}
                  value={plan.majorDrains}
                  onChange={(e) => handleChange('majorDrains', e.target.value)}
                  placeholder="مثال: نقاشات المقارنة، العمل المتواصل دون راحة، قلة النوم، محاولة إرضاء الجميع..."
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Field 3: الأشياء المساعدة */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#26332D]">
                  3. الأشياء التي تساعدني عادةً:
                </label>
                <textarea
                  rows={2}
                  value={plan.helpfulThings}
                  onChange={(e) => handleChange('helpfulThings', e.target.value)}
                  placeholder="مثال: المشي في الهواء، الصلاة والهدوء، أخذ حمام دافئ، تمارين التنفس، الاستماع لأصوات مهدئة..."
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Field 4: الشخص الآمن */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#26332D]">
                  4. الشخص الذي أستطيع التحدث معه (شخص آمن لا يلوم ولا ينصح بقسوة):
                </label>
                <input
                  type="text"
                  value={plan.trustedPerson}
                  onChange={(e) => handleChange('trustedPerson', e.target.value)}
                  placeholder="اسم الشخص أو صلته (مثال: أختي، صديقي فلان، والدتي...)"
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none"
                />
              </div>

              {/* Field 5: المختص أو الجهة */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#26332D]">
                  5. المختص أو الجهة التي يمكنني طلب المساعدة منها:
                </label>
                <input
                  type="text"
                  value={plan.specialistOrHelpline}
                  onChange={(e) => handleChange('specialistOrHelpline', e.target.value)}
                  placeholder="اسم طبيب أو عيادة أو الخط الساخن (16328)"
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none"
                />
              </div>

              {/* Field 6: الخطوة الطارئة */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#26332D]">
                  6. الخطوة التي سأقوم بها إذا شعرت أنني لم أعد قادراً على التعامل وحدي:
                </label>
                <textarea
                  rows={2}
                  value={plan.crisisStep}
                  onChange={(e) => handleChange('crisisStep', e.target.value)}
                  placeholder="مثال: سأتصل فوراً بـ (فلان) أو سأتوجه فوراً للمستشفى أو أتصل بخط الدعم النفسي 16328 ولن أبقى وحدي..."
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{savedSuccess ? 'تم حفظ الخطة بنجاح ✓' : 'حفظ الخطة في رحلتي الآمنة'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Summary Card View */
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 sm:p-6 bg-white border-2 border-[#8FAF9A]/60 rounded-3xl space-y-4 shadow-sm text-right">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#26332D]">
                        بطاقة نسمة حياة للأمان النفسي
                      </h3>
                      <span className="text-[10px] text-[#7D8F85]">
                        خطة شخصية معتمدة لحمايتك ورعايتك
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadPlan}
                    className="p-2 bg-[#FAF7F0] hover:bg-stone-100 text-[#355C4A] rounded-xl border border-[#E8DDCC] text-xs flex items-center gap-1 font-bold"
                    title="تنزيل الخطة كملف نصي"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DDCC]/70 space-y-1">
                    <span className="font-bold text-[#355C4A] block">1. علامات التدهور المبكرة:</span>
                    <p className="text-[#35453E] leading-relaxed">{plan.deteriorationSigns || 'لم تُسجل بعد'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DDCC]/70 space-y-1">
                    <span className="font-bold text-rose-800 block">2. أكبر المستنزفات:</span>
                    <p className="text-[#35453E] leading-relaxed">{plan.majorDrains || 'لم تُسجل بعد'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DDCC]/70 space-y-1">
                    <span className="font-bold text-emerald-800 block">3. أشياء تساعدني عادةً:</span>
                    <p className="text-[#35453E] leading-relaxed">{plan.helpfulThings || 'لم تُسجل بعد'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DDCC]/70 space-y-1">
                    <span className="font-bold text-sky-800 block">4. شخصي الآمن:</span>
                    <p className="text-[#35453E] leading-relaxed font-bold">{plan.trustedPerson || 'لم يُحدد بعد'}</p>
                  </div>

                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DDCC]/70 space-y-1 sm:col-span-2">
                    <span className="font-bold text-[#355C4A] block">5. المختص أو جهة المساعدة:</span>
                    <p className="text-[#35453E] leading-relaxed">{plan.specialistOrHelpline}</p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 sm:col-span-2">
                    <span className="font-bold text-amber-900 block">6. خطوتي عند صعوبة التعامل وحدي:</span>
                    <p className="text-amber-950 font-bold leading-relaxed">{plan.crisisStep || 'طلب الدعم فوراً والتواصل مع المختصين وعدم البقاء وحيداً.'}</p>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-[#52645B] italic border-t border-[#E8DDCC]/60">
                  «طلب المساعدة ليس هزيمة.. أحياناً يكون أول خطوة في طريق العودة إلى الحياة»
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('edit')}
                  className="flex-1 py-3 bg-[#FAF7F0] hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تعديل البنود</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl transition-colors shadow-xs"
                >
                  العودة للتطبيق 🤍
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
