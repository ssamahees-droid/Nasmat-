import React, { useState } from 'react';
import { X, ArrowRight, ShieldAlert, HeartHandshake, CheckCircle2, MessageSquare, Wind, Compass } from 'lucide-react';
import { ANA_DELWAQTI_STATES, AnaDelwaqtiState } from '../data/newPhaseData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface AnaDelwaqtiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenEmergencyHelp: () => void;
  onOpenUntangle: () => void;
  onOpenTranslate: () => void;
  onOpenBattery: () => void;
  onOpenLaughs: () => void;
}

export const AnaDelwaqtiModal: React.FC<AnaDelwaqtiModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenEmergencyHelp,
  onOpenUntangle,
  onOpenTranslate,
  onOpenBattery,
  onOpenLaughs
}) => {
  const [selectedState, setSelectedState] = useState<AnaDelwaqtiState | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (state: AnaDelwaqtiState) => {
    setSelectedState(state);
  };

  const handleActionClick = (state: AnaDelwaqtiState) => {
    if (state.talk.targetTab === 'support') {
      onClose();
      onNavigateTab('support');
    } else if (state.talk.targetTab === 'breathe') {
      onClose();
      onNavigateTab('breathe');
    } else if (state.talk.targetTab === 'untangle') {
      onClose();
      onOpenUntangle();
    } else if (state.talk.targetTab === 'battery') {
      onClose();
      onOpenBattery();
    } else if (state.talk.targetTab === 'translate') {
      onClose();
      onOpenTranslate();
    } else if (state.talk.targetTab === 'laughs') {
      onClose();
      onOpenLaughs();
    } else if (state.talk.targetTab === 'safety') {
      onOpenEmergencyHelp();
    } else if (state.talk.targetTab === 'copy_msg') {
      navigator.clipboard.writeText(state.talk.suggestedText);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                أنا دلوقتي...
              </h2>
              <p className="text-[11px] text-[#52645B]">
                مش لازم تحل كل حاجة دلوقتي.. خلينا نبدأ من اللي حاصل معاك الآن
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenEmergencyHelp}
              className="py-1 px-2.5 bg-amber-100/90 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              title="طلب مساعدة عاجلة"
            >
              <span>🆘</span>
              <span className="hidden sm:inline">محتاج مساعدة؟</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {selectedState ? (
            /* Selected State Detail: افهم + جرّب + اتكلم + خُد معك */
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setSelectedState(null)}
                className="text-xs font-bold text-[#355C4A] hover:underline flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>اختيار حالة تانية</span>
              </button>

              {/* Title Header */}
              <div className="p-4 bg-white rounded-2xl border border-[#8FAF9A]/50 flex items-center gap-3">
                <span className="text-3xl">{selectedState.emoji}</span>
                <div>
                  <h3 className="font-extrabold text-base text-[#26332D]">
                    {selectedState.title}
                  </h3>
                  <p className="text-xs text-[#52645B] mt-0.5">
                    {selectedState.shortDesc}
                  </p>
                </div>
              </div>

              {/* 1. 🌱 افهم */}
              <div className="p-4 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#355C4A]">
                  <span>🌱</span>
                  <span>افهم: {selectedState.understand.title}</span>
                </div>
                <p className="text-xs text-[#26332D] leading-relaxed">
                  {selectedState.understand.text}
                </p>
              </div>

              {/* 2. 🧩 جرّب */}
              <div className="p-4 bg-white border border-[#E8DDCC] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#355C4A] font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>🧩</span>
                    <span>جرّب: {selectedState.tryExercise.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#7D8F85] px-2 py-0.5 bg-[#FAF7F0] rounded-md">
                    {selectedState.tryExercise.duration}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#35453E] pr-2 list-disc list-inside">
                  {selectedState.tryExercise.steps.map((st, sIdx) => (
                    <li key={sIdx} className="leading-relaxed">{st}</li>
                  ))}
                </ul>
              </div>

              {/* 3. 🤝 اتكلم */}
              <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#26332D]">
                  <span>🤝</span>
                  <span>اتكلم: {selectedState.talk.title}</span>
                </div>
                
                <div className="p-3 bg-white rounded-xl border border-[#E8DDCC] text-xs text-[#52645B] italic">
                  «{selectedState.talk.suggestedText}»
                </div>

                <button
                  onClick={() => handleActionClick(selectedState)}
                  className="w-full py-2.5 px-4 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{copiedMsg ? 'تم نسخ الرسالة بنجاح ✓' : selectedState.talk.actionLabel}</span>
                </button>
              </div>

              {/* Takeaway Result Card */}
              <TakeawayResultCard
                quote={selectedState.takeaway}
                onTryAnother={() => setSelectedState(null)}
                onBackToHome={onClose}
              />
            </div>
          ) : (
            /* 10 Big Cards Picker */
            <div className="space-y-3">
              <div className="text-right">
                <h3 className="text-sm font-bold text-[#26332D]">
                  إنت محتاج إيه دلوقتي؟
                </h3>
                <p className="text-xs text-[#52645B] mt-0.5">
                  اضغط على الحالة الأقرب لشعورك الحالي لنبدأ خطوة صغيرة:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ANA_DELWAQTI_STATES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelect(st)}
                    className="p-3.5 bg-white/90 hover:bg-[#355C4A] hover:text-white border border-[#E8DDCC] rounded-2xl text-right transition-all group flex items-start gap-3 shadow-2xs hover:shadow-xs hover:border-[#355C4A] active:scale-[0.99]"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{st.emoji}</span>
                    <div>
                      <div className="font-extrabold text-sm text-[#26332D] group-hover:text-white transition-colors">
                        {st.title}
                      </div>
                      <div className="text-[11px] text-[#7D8F85] group-hover:text-[#E8DDCC] transition-colors mt-0.5 line-clamp-1">
                        {st.shortDesc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
