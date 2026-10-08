import React, { useState } from 'react';
import { Check, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { storage } from '../services/storage';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ONBOARDING_OPTIONS = [
  { id: 'opt1', text: 'حاسس إني مضغوط' },
  { id: 'opt2', text: 'حاسس إني مش كويس ومش فاهم مالي' },
  { id: 'opt3', text: 'محتاج حد يسمعني' },
  { id: 'opt4', text: 'عايز أفهم نفسي أكتر' },
  { id: 'opt5', text: 'عايز أساعد شخص قريب مني' },
  { id: 'opt6', text: 'عايز أتعلم عن الصحة النفسية' },
  { id: 'opt7', text: 'مش عارف... بس محتاج حاجة تساعدني' }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const userPrefs = storage.getPreferences();
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    userPrefs.onboardingChoices.length > 0 
      ? userPrefs.onboardingChoices 
      : ['حاسس إني مضغوط']
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
    // Save choices to user preferences
    const currentPrefs = storage.getPreferences();
    currentPrefs.onboardingChoices = selectedChoices;
    storage.savePreferences(currentPrefs);
    storage.setOnboarded(true);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#26332D] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-md mx-auto w-full my-auto py-6">
        
        {/* Header */}
        <div className="space-y-3 mb-6 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8FAF9A]/20 text-[#355C4A] text-xs font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خطوة التعارف الأولى</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26332D]">
            خلينا نتعرف عليك
          </h2>

          <p className="text-lg font-bold text-[#355C4A]">
            إيه اللي جابك لنسمة حياة النهارده؟
          </p>

          <p className="text-xs text-[#52645B]">
            ممكن تختار أكتر من حاجة، و«مش عارف» لا تلغي بقية الاختيارات.
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
                className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 min-h-[52px] ${
                  isSelected
                    ? 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs'
                    : 'bg-[#FAF7F0] text-[#26332D] border-[#E8DDCC] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-[#52645B]'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug">
                    {item.text}
                  </span>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  isSelected 
                    ? 'bg-white text-[#355C4A] border-white' 
                    : 'border-[#D5CEBE] bg-transparent'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Privacy & Non-diagnostic guarantee */}
        <div className="p-3 bg-white/60 border border-[#E8DDCC] rounded-2xl flex items-start gap-2.5 text-right mb-6">
          <Shield className="w-4 h-4 text-[#8FAF9A] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#52645B] leading-relaxed">
            اختياراتك لا تُعد تشخيصاً طبياً، وتُستخدم فقط لتوجيهك للمحتوى والتمارين المناسبة. يمكنك تعديلها أو حذفها في أي وقت من ملفك الشخصي.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 bg-[#355C4A] hover:bg-[#264235] text-white font-bold text-base rounded-2xl shadow-md shadow-[#355C4A]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>متابعة</span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </button>
      </div>
    </div>
  );
};
