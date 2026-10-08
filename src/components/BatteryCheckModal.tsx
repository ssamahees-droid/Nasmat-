import React, { useState } from 'react';
import { X, BatteryCharging, BatteryWarning, BatteryMedium, BatteryFull, Check, RotateCcw, Sparkles } from 'lucide-react';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface BatteryCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatteryCheckModal: React.FC<BatteryCheckModalProps> = ({ isOpen, onClose }) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [drainedBy, setDrainedBy] = useState('');
  const [boostBy, setBoostBy] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectLevel = (level: number) => {
    setBatteryLevel(level);
  };

  const getAdvice = (level: number) => {
    if (level <= 3) {
      return {
        text: 'النهارده مش يوم البطولات. اختار أهم حاجة واحدة فقط.',
        bg: 'bg-rose-50 border-rose-200 text-rose-900',
        badge: 'طاقة منخفضة ⚠️',
        icon: BatteryWarning
      };
    } else if (level <= 6) {
      return {
        text: 'اختار حاجة مهمة واحدة، وسيب مساحة لنفسك.',
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
        badge: 'طاقة متوسطة ⚡',
        icon: BatteryMedium
      };
    } else {
      return {
        text: 'عندك مساحة كويسة. استغلها بدون ما تستهلك كل طاقتك.',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        badge: 'طاقة متوفرة 🔋',
        icon: BatteryFull
      };
    }
  };

  const handleSaveToNotes = () => {
    if (!batteryLevel) return;
    const advice = getAdvice(batteryLevel);
    let noteText = `🔋 فحص طاقتي اليوم: ${batteryLevel}/10 (${advice.badge})\n`;
    noteText += `💡 التوجيه: ${advice.text}\n`;
    if (drainedBy.trim()) noteText += `🔻 ما سحب طاقتي: ${drainedBy.trim()}\n`;
    if (boostBy.trim()) noteText += `🔺 حاجة ترفع طاقتي 5%: ${boostBy.trim()}`;

    storage.addNote(noteText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setBatteryLevel(null);
    setDrainedBy('');
    setBoostBy('');
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
            <span className="text-2xl">🔋</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                بطاريتي كام؟
              </h2>
              <p className="text-[11px] text-[#52645B]">
                قياس واقعي لطاقتك الحالية لحماية نفسك من الاستنزاف
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
        <div className="overflow-y-auto py-4 space-y-5 flex-1">
          {/* Question 1: Rating 1 to 10 */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-[#26332D]">
              طاقتك دلوقتي كام من 10؟
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = batteryLevel === num;
                // Color scaling
                let activeColor = 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs scale-105';
                if (num <= 3) {
                  activeColor = 'bg-rose-700 text-white border-rose-700 shadow-xs scale-105';
                } else if (num <= 6) {
                  activeColor = 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105';
                }

                return (
                  <button
                    key={num}
                    onClick={() => handleSelectLevel(num)}
                    className={`py-3 rounded-2xl border font-mono font-bold text-sm transition-all text-center ${
                      isSelected
                        ? activeColor
                        : 'bg-white hover:bg-stone-100 text-[#26332D] border-[#E8DDCC]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advice based on level */}
          {batteryLevel !== null && (
            <div className="space-y-4 animate-fade-in">
              {(() => {
                const adv = getAdvice(batteryLevel);
                const IconComponent = adv.icon;
                return (
                  <div className={`p-4 rounded-2xl border ${adv.bg} space-y-1.5 shadow-2xs`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-current/20">
                        {adv.badge}
                      </span>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-extrabold leading-relaxed pt-1">
                      {adv.text}
                    </p>
                  </div>
                );
              })()}

              {/* Reflection Questions */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#26332D]">
                    إيه أكتر حاجة سحبت بطاريتك؟
                  </label>
                  <input
                    type="text"
                    value={drainedBy}
                    onChange={(e) => setDrainedBy(e.target.value)}
                    placeholder="مثال: نقاش طويل، ضغط شغل متواصل، قلة نوم..."
                    className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#26332D]">
                    إيه حاجة صغيرة ممكن تزود طاقتك 5%؟
                  </label>
                  <input
                    type="text"
                    value={boostBy}
                    onChange={(e) => setBoostBy(e.target.value)}
                    placeholder="مثال: رشفة ماء بارد، ركعتين هدوء، الابتعاد عن الشاشة ربع ساعة..."
                    className="w-full p-3 bg-white border border-[#E8DDCC] focus:border-[#355C4A] focus:ring-1 focus:ring-[#355C4A] rounded-2xl text-xs text-[#26332D] outline-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSaveToNotes}
                  className="flex-1 py-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{savedSuccess ? 'تم الحفظ في رحلتي بنجاح ✓' : 'حفظ في سجل رحلتي'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-3 bg-white hover:bg-stone-100 text-stone-600 border border-[#E8DDCC] rounded-2xl text-xs"
                  title="إعادة الفحص"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Takeaway Card */}
              <TakeawayResultCard
                quote="«معرفة مستوى طاقتك والتعامل معها بصدق هو قمة النضج النفسي.. لست آلة لتعمل دائماً بـ 100%»"
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
