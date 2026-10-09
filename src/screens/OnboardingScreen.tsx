import React, { useState } from 'react';
import { Check, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { storage } from '../services/storage';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const ONBOARDING_OPTIONS = [
  { id: 'opt1', text: 'حاسس إني مضغوط ومحتاج هدوء' },
  { id: 'opt2', text: 'حاسس إني مش كويس ومش فاهم مالي' },
  { id: 'opt3', text: 'محتاج حد يسمعني بصدق بدون أحكام' },
  { id: 'opt4', text: 'عايز أفهم نفسي وأطور وعيي الذاتي' },
  { id: 'opt5', text: 'عايز أساعد شخص قريب مني بيمر بأزمة' },
  { id: 'opt6', text: 'عايز أتعلم مهارات عملية للصحة النفسية' },
  { id: 'opt7', text: 'مش عارف بالظبط... بس محتاج حاجة تساندني' }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onSkip }) => {
  const userPrefs = storage.getPreferences();
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    userPrefs.onboardingChoices.length > 0 
      ? userPrefs.onboardingChoices 
      : ['حاسس إني مضغوط ومحتاج هدوء']
  );

  const toggleChoice = (text: string) => {
    setSelectedChoices(prev => {
      if (prev.includes(text)) {
        return prev.filter(t => t !== text);
      } else {
        return [...prev, text];
      }
    });
  };

  const handleContinue = () => {
    const currentPrefs = storage.getPreferences();
    currentPrefs.onboardingChoices = selectedChoices;
    storage.savePreferences(currentPrefs);
    storage.setOnboarded(true);
    onComplete();
  };

  const handleSkip = () => {
    storage.setOnboarded(true);
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C120F] via-[#121A16] to-[#0A0E0C] text-[#EDE8DF] flex flex-col justify-between p-4 sm:p-8 font-tajawal antialiased text-right selection:bg-emerald-500 selection:text-black" dir="rtl">
      <div className="max-w-md mx-auto w-full my-auto py-6">
        
        {/* Top bar with Skip button */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خطوة التعارف الأولى</span>
          </div>

          <button
            onClick={handleSkip}
            className="text-xs text-stone-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>تخطي إلى الرئيسية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            خلينا نتعرف عليك 🌿
          </h2>

          <p className="text-base font-bold text-emerald-300">
            إيه اللي جابك لنسمة حياة النهارده؟
          </p>

          <p className="text-xs text-stone-400">
            ممكن تختار أكتر من حاجة، واختيارك يساعدنا في اقتراح التمارين والمسارات الأنسب لك.
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 my-6">
          {ONBOARDING_OPTIONS.map((item, idx) => {
            const isSelected = selectedChoices.includes(item.text);
            return (
              <button
                key={item.id}
                onClick={() => toggleChoice(item.text)}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 min-h-[50px] cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                    : 'bg-[#131C18] text-stone-300 border-white/10 hover:border-emerald-500/30 hover:bg-[#16231d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-500 text-black' : 'bg-white/5 text-stone-400 border border-white/10'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold leading-snug ${isSelected ? 'text-white' : 'text-stone-300'}`}>
                    {item.text}
                  </span>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  isSelected 
                    ? 'bg-emerald-400 text-black border-emerald-400' 
                    : 'border-white/20 bg-transparent'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Privacy & Non-diagnostic guarantee */}
        <div className="p-3 bg-[#131C18] border border-white/10 rounded-2xl flex items-start gap-2.5 text-right mb-6">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-stone-400 leading-relaxed">
            إجاباتك محفوظة بخصوصية تامة على جهازك فقط، ولا تُعد تشخيصاً طبياً، وتُستخدم لتسهيل وصولك للمحتوى المناسب. يمكنك تعديلها في أي وقت من حسابك.
          </p>
        </div>

        {/* Continue Button */}
        <div className="space-y-2">
          <button
            onClick={handleContinue}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <span>متابعة إلى نسمة حياة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
