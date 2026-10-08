import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { UNTANGLE_DOMAINS, UntangleDomain } from '../data/newPhaseData';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface UntangleKnotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UntangleKnotModal: React.FC<UntangleKnotModalProps> = ({ isOpen, onClose }) => {
  const [bigThought, setBigThought] = useState('');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDomain, setSelectedDomain] = useState<UntangleDomain | null>(null);
  const [microAction, setMicroAction] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bigThought.trim()) return;
    setCurrentStep(2);
  };

  const handleDomainSelect = (domain: UntangleDomain) => {
    setSelectedDomain(domain);
    setCurrentStep(3);
  };

  const handleSaveKnot = () => {
    if (!bigThought.trim()) return;
    let note = `🧩 فك العقدة:\n`;
    note += `• الجملة الكبيرة: «${bigThought.trim()}»\n`;
    if (selectedDomain) {
      note += `• المجال المحدد: ${selectedDomain.emoji} ${selectedDomain.title}\n`;
    }
    if (microAction.trim()) {
      note += `• الخطوة الصغرى في 15 دقيقة: ${microAction.trim()}\n`;
    }
    storage.addNote(note);
    setSavedSuccess(true);
    setCurrentStep(4);
  };

  const handleReset = () => {
    setBigThought('');
    setSelectedDomain(null);
    setMicroAction('');
    setSavedSuccess(false);
    setCurrentStep(1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧩</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                فك العقدة
              </h2>
              <p className="text-[11px] text-[#52645B]">
                لما كل حاجة تبان بايظة، خلينا نفكها واحدة واحدة
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

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* Step 1: Input Big Overwhelming Thought */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-3 animate-fade-in">
              <label className="block text-xs sm:text-sm font-bold text-[#26332D]">
                اكتب الجملة اللي بتدور في دماغك ومحسساك بالثقل:
              </label>
              
              <textarea
                rows={3}
                value={bigThought}
                onChange={(e) => setBigThought(e.target.value)}
                placeholder="مثال: حياتي كلها بايظة، ومش عارف ألحق أي حاجة..."
                className="w-full p-3.5 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs sm:text-sm text-[#26332D] outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-[#7D8F85]">
                <span>💡</span>
                <span>اكتبها بصراحة تامة، عقلك بيضخم الأمور لما تكون حبيسة الرأس.</span>
              </div>

              <button
                type="submit"
                disabled={!bigThought.trim()}
                className="w-full py-3 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition-colors shadow-xs"
              >
                خلينا نصغرها ونفككها 👈
              </button>
            </form>
          )}

          {/* Step 2: "خلينا نصغرها" - Select Domain */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-white rounded-2xl border border-[#E8DDCC] text-xs text-[#52645B] flex items-center justify-between">
                <span>الجملة: «{bigThought}»</span>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-[#355C4A] font-bold text-[11px] hover:underline"
                >
                  تعديل
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-extrabold text-[#355C4A]">
                  خلينا نصغرها.. 🌱
                </div>
                <p className="text-xs text-[#26332D] font-bold">
                  ما الجزء الأكثر إزعاجًا لك الآن تحديداً؟
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {UNTANGLE_DOMAINS.map((dom) => (
                  <button
                    key={dom.id}
                    onClick={() => handleDomainSelect(dom)}
                    className="p-3.5 bg-white hover:bg-[#FAF7F0] border border-[#E8DDCC] hover:border-[#355C4A] rounded-2xl text-right transition-all flex items-center gap-2.5 group active:scale-98"
                  >
                    <span className="text-2xl shrink-0">{dom.emoji}</span>
                    <span className="text-xs font-bold text-[#26332D] group-hover:text-[#355C4A] transition-colors">
                      {dom.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Define 15-minute micro action */}
          {currentStep === 3 && selectedDomain && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#355C4A]">
                  <span>{selectedDomain.emoji}</span>
                  <span>المجال المستهدف: {selectedDomain.title}</span>
                </div>
                <p className="text-[11px] text-[#52645B]">
                  بدل حل الموضوع كله، هنختار خطوة واحدة ميكروسكوبية الآن.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#26332D]">
                  إيه أصغر حاجة واحدة ملموسة تحت سيطرتك تقدر تعملها في الـ 15 دقيقة الجاية بخصوص ده؟
                </label>

                <textarea
                  rows={2}
                  value={microAction}
                  onChange={(e) => setMicroAction(e.target.value)}
                  placeholder="مثال: هفتح الملف وأكتب سطرين فقط، أو هتصل أسأل عن معلومة..."
                  className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none resize-none leading-relaxed"
                />

                {/* Micro Examples */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#7D8F85] block mb-1">أمثلة لخطوات صغيرة وسهلة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDomain.microExamples.map((ex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMicroAction(ex)}
                        className="px-2.5 py-1 bg-white hover:bg-stone-100 text-[11px] text-[#355C4A] border border-[#E8DDCC] rounded-xl transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveKnot}
                  disabled={!microAction.trim()}
                  className="flex-1 py-3 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد هذه الخطوة وحفظها</span>
                </button>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="p-3 bg-white hover:bg-stone-100 text-stone-600 border border-[#E8DDCC] rounded-2xl text-xs"
                >
                  رجوع
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Summary & Takeaway Card */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-2 text-emerald-950">
                <div className="font-extrabold text-sm flex items-center gap-2 text-emerald-800">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>تم تفكيك العقدة وتصغيرها بنجاح!</span>
                </div>
                <div className="text-xs space-y-1 leading-relaxed pr-2">
                  <p><strong>من:</strong> «{bigThought}»</p>
                  <p><strong>إلى:</strong> خطوة 15 دقيقة: «{microAction}»</p>
                </div>
              </div>

              {/* Takeaway Card */}
              <TakeawayResultCard
                quote="«العقدة الكبيرة لا تُحل كلها بضربة واحدة.. بل تُفكك خيطاً صغيراً في كل مرة»"
                onTryAnother={handleReset}
                onBackToHome={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
