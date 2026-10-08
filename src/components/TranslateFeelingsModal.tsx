import React, { useState } from 'react';
import { X, MessageSquare, Check, Sparkles, RotateCcw, Heart } from 'lucide-react';
import { TRANSLATE_FEELINGS_PROBABILITIES } from '../data/newPhaseData';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface TranslateFeelingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXAMPLE_PHRASES = [
  'أنا مش طايق حد.',
  'مش فارقة معايا أي حاجة خلاص.',
  'تعبت من كل حاجة وعايز أختفي.',
  'محدش حاسس بيا.',
  'مش عارف أعمل إيه في حياتي.'
];

export const TranslateFeelingsModal: React.FC<TranslateFeelingsModalProps> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedProbabilities, setSelectedProbabilities] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleProbability = (prob: string) => {
    setSelectedProbabilities(prev => 
      prev.includes(prob) ? prev.filter(p => p !== prob) : [...prev, prob]
    );
  };

  const handleSaveReflection = () => {
    if (!inputText.trim()) return;
    let note = `🗣️ ترجمة المشاعر:\n`;
    note += `الجملة الأصلية: «${inputText.trim()}»\n`;
    if (selectedProbabilities.length > 0) {
      note += `ما قد يكون خلفها:\n` + selectedProbabilities.map(p => `• ${p}`).join('\n');
    }
    storage.addNote(note);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setInputText('');
    setHasSubmitted(false);
    setSelectedProbabilities([]);
    setSavedSuccess(false);
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
            <span className="text-2xl">🗣️</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                ترجم اللي جواك
              </h2>
              <p className="text-[11px] text-[#52645B]">
                أحيانًا الجملة اللي بنقولها مش هي كل اللي جواها
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
          {/* Step 1: Input text */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#26332D]">
              اكتب اللي نفسك تقوله كما هو (بدون تنقيح أو مجاملة):
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب الجملة هنا، مثلاً: أنا مش طايق حد..."
              className="w-full p-3.5 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs sm:text-sm text-[#26332D] outline-none resize-none leading-relaxed"
            />

            {/* Quick Suggestions Chips */}
            {!hasSubmitted && (
              <div className="pt-1">
                <span className="text-[10px] text-[#7D8F85] block mb-1">أو اختر جملة شائعة لتجربتها:</span>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_PHRASES.map((ph, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputText(ph)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 text-[11px] text-[#52645B] border border-[#E8DDCC] rounded-xl transition-colors"
                    >
                      {ph}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasSubmitted && (
              <button
                type="button"
                disabled={!inputText.trim()}
                onClick={() => setHasSubmitted(true)}
                className="w-full mt-2 py-3 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition-colors shadow-xs"
              >
                تفكيك وترجمة ما وراء الجملة 🔍
              </button>
            )}
          </div>

          {/* Step 2: Probabilities */}
          {hasSubmitted && (
            <div className="space-y-4 animate-fade-in pt-2">
              <div className="p-3.5 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl">
                <div className="text-xs font-bold text-[#355C4A] mb-1">
                  🌿 ممكن يكون وراها:
                </div>
                <p className="text-[11px] text-[#52645B] leading-relaxed">
                  الجمل القاسية والانفعالية غالباً قناع يحمي احتياجاً أو ألماً داخلياً لم يُعترف به بعد.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#26332D]">
                  أي احتمال من هذه أقرب لحالك الآن؟ (يمكن اختيار أكثر من احتمال)
                </div>

                <div className="space-y-2">
                  {TRANSLATE_FEELINGS_PROBABILITIES.map((prob, idx) => {
                    const isSelected = selectedProbabilities.includes(prob);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleProbability(prob)}
                        className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs'
                            : 'bg-white hover:bg-stone-50 text-[#26332D] border-[#E8DDCC]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border text-xs ${
                          isSelected ? 'bg-white text-[#355C4A] border-white' : 'border-stone-300'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                        <span className="text-xs leading-relaxed font-medium">
                          ممكن أكون: {prob}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveReflection}
                  disabled={selectedProbabilities.length === 0}
                  className="flex-1 py-3 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{savedSuccess ? 'تم الحفظ في رحلتي بنجاح ✓' : 'حفظ الفهم الذاتي في رحلتي'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-3 bg-white hover:bg-stone-100 text-stone-600 border border-[#E8DDCC] rounded-2xl text-xs"
                  title="تجربة جملة أخرى"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Takeaway card */}
              <TakeawayResultCard
                quote="«الاعتراف بالاحتياج الحقيقي هو أول خطوة لإنهاء الصراع الداخلي.. لست شريراً لأنك متعب أو ترغب في مساحة»"
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
