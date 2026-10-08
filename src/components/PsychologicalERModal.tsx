import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, XCircle, PhoneCall, Sparkles, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { ER_SCENARIOS, ERScenario } from '../data/workshopsData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface PsychologicalERModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergencyHelp: () => void;
}

export const PsychologicalERModal: React.FC<PsychologicalERModalProps> = ({
  isOpen,
  onClose,
  onOpenEmergencyHelp
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(ER_SCENARIOS[0].id);

  if (!isOpen) return null;

  const currentScenario = ER_SCENARIOS.find(s => s.id === selectedScenarioId) || ER_SCENARIOS[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_-10px_rgba(58,90,64,0.25)] overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center text-2xl shadow-inner">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  غرفة الطوارئ النفسية
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2 py-0.5 rounded-full font-bold">
                  ورشة محاكاة عملية
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5">
                تدريب على التصرف في المواقف النفسية الصعبة دون تشخيص أو لعب دور الطبيب
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selector Pills */}
        <div className="py-3 shrink-0">
          <label className="block text-xs font-bold text-[#283618] mb-2">
            اختر سيناريو المحاكاة الواقعي:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ER_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`p-2.5 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                  selectedScenarioId === sc.id
                    ? 'bg-[#3A5A40] text-white border-[#3A5A40] font-bold shadow-sm'
                    : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
                }`}
              >
                <span className="text-lg">{sc.emoji}</span>
                <span className="text-xs truncate">{sc.title.split(' ')[0]} {sc.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Scenario Content */}
        <div className="overflow-y-auto py-2 space-y-4 flex-1">
          {/* Scenario Overview */}
          <div className="p-4 bg-white border border-[#E5DACB] rounded-2xl shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentScenario.emoji}</span>
              <h3 className="font-black text-sm text-[#283618]">
                {currentScenario.title}
              </h3>
            </div>
            <p className="text-xs text-[#58645C] leading-relaxed">
              {currentScenario.description}
            </p>
          </div>

          {/* 3 Core Questions Grid */}
          <div className="space-y-3">
            {/* 1. ماذا أفعل الآن؟ */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>ماذا أفعل الآن؟ (خطوات فورية محددة)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950 leading-relaxed pr-5 list-disc">
                {currentScenario.doNow.map((item, idx) => (
                  <li key={idx} className="font-medium">{item}</li>
                ))}
              </ul>
            </div>

            {/* 2. ماذا لا أفعل؟ */}
            <div className="p-4 bg-rose-50/80 border border-rose-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                <XCircle className="w-4 h-4 text-rose-700" />
                <span>ماذا لا أفعل؟ (أخطاء شائعة تزيد الطين بلّة)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-950 leading-relaxed pr-5 list-disc">
                {currentScenario.doNot.map((item, idx) => (
                  <li key={idx} className="font-medium">{item}</li>
                ))}
              </ul>
            </div>

            {/* 3. متى أطلب مساعدة؟ */}
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-800" />
                  <span>متى أطلب مساعدة متخصصة وعاجلة؟</span>
                </div>
                <button
                  onClick={onOpenEmergencyHelp}
                  className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>الخطوط الساخنة</span>
                </button>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed pr-1">
                {currentScenario.whenToSeekHelp}
              </p>
            </div>
          </div>

          <TakeawayResultCard
            quote="«في المواقف الصعبة: لسنا بحاجة لحلول سحرية، بل لخطوة صغيرة تهدئ اللحظة وتحمي السلامة»"
            onTryAnother={() => setSelectedScenarioId(ER_SCENARIOS[(ER_SCENARIOS.findIndex(s => s.id === selectedScenarioId) + 1) % ER_SCENARIOS.length].id)}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
