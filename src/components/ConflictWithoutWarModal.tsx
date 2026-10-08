import React, { useState } from 'react';
import { X, HeartHandshake, Shield, MessageSquare, AlertTriangle, Check, VolumeX, Sparkles, Copy } from 'lucide-react';
import { CONFLICT_SCENARIOS, ConflictScenario } from '../data/workshopsData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface ConflictWithoutWarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConflictWithoutWarModal: React.FC<ConflictWithoutWarModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<'attack' | 'withdraw' | 'healthy'>('healthy');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentScenario: ConflictScenario = CONFLICT_SCENARIOS[selectedScenarioIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  خلاف بدون معركة
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2 py-0.5 rounded-full font-bold">
                  للأزواج والأسرة
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5">
                تطبيق 3 طرق للتواصل على مشكلة واحدة للوصول لحوار صحي فوري
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

        {/* Topic Toggle */}
        <div className="py-3 shrink-0 flex items-center gap-2">
          {CONFLICT_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`flex-1 p-2.5 rounded-2xl border text-xs font-bold transition-all text-center ${
                selectedScenarioIndex === idx
                  ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                  : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
              }`}
            >
              {sc.topic}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-2 space-y-4 flex-1">
          {/* Situation Card */}
          <div className="p-4 bg-white border border-[#E5DACB] rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#3A5A40]">المشكلة محل النقاش:</span>
            <p className="text-xs text-[#283618] leading-relaxed font-medium">
              {currentScenario.situation}
            </p>
          </div>

          {/* 3 Methods Tabs */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#283618] block">اختر أسلوب التعامل للمقارنة:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedMethod('attack')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'attack'
                    ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                    : 'bg-white hover:bg-rose-50 text-rose-800 border-[#E5DACB]'
                }`}
              >
                <span>❌ أسلوب الهجوم</span>
                <span className="text-[10px] opacity-80">لوم وعتاب حاد</span>
              </button>

              <button
                onClick={() => setSelectedMethod('withdraw')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'withdraw'
                    ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                    : 'bg-white hover:bg-amber-50 text-amber-800 border-[#E5DACB]'
                }`}
              >
                <span>❌ أسلوب الانسحاب</span>
                <span className="text-[10px] opacity-80">صمت وتجاهل</span>
              </button>

              <button
                onClick={() => setSelectedMethod('healthy')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'healthy'
                    ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-sm'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border-[#E5DACB]'
                }`}
              >
                <span>✅ حوار صحي</span>
                <span className="text-[10px] opacity-80">احتياج واتفاق</span>
              </button>
            </div>
          </div>

          {/* Active Method Analysis */}
          {selectedMethod === 'attack' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs text-rose-950 animate-fade-in">
              <div className="font-extrabold text-rose-900 flex items-center justify-between">
                <span>ما يقال في أسلوب الهجوم:</span>
                <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded-full font-bold">طريق مسدود</span>
              </div>
              <p className="font-bold text-sm text-rose-950 p-3 bg-white rounded-xl border border-rose-200">
                {currentScenario.attackMethod.dialogue}
              </p>
              <p className="text-[11px] leading-relaxed pt-1">
                <strong>النتيجة والخلل:</strong> {currentScenario.attackMethod.effect}
              </p>
            </div>
          )}

          {selectedMethod === 'withdraw' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950 animate-fade-in">
              <div className="font-extrabold text-amber-900 flex items-center justify-between">
                <span>ما يحدث في أسلوب الانسحاب (الخرس الزواجي):</span>
                <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-bold">تراكم الغضب</span>
              </div>
              <p className="font-bold text-sm text-amber-950 p-3 bg-white rounded-xl border border-amber-200">
                {currentScenario.withdrawMethod.dialogue}
              </p>
              <p className="text-[11px] leading-relaxed pt-1">
                <strong>النتيجة والخلل:</strong> {currentScenario.withdrawMethod.effect}
              </p>
            </div>
          )}

          {selectedMethod === 'healthy' && (
            <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-3 text-xs text-emerald-950 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-emerald-950">صيغة الحوار الصحي البديلة:</span>
                <button
                  onClick={() => handleCopy(currentScenario.healthyMethod.dialogue)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'تم النسخ ✓' : 'نسخ العبارة'}</span>
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-300 font-extrabold text-sm text-[#283618] leading-relaxed shadow-xs">
                {currentScenario.healthyMethod.dialogue}
              </div>

              {/* 4 Interactive Healthy Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-[#3A5A40] block mb-0.5">1. التعبير عن الاحتياج:</span>
                  <p className="text-[#334237] text-[11px]">{currentScenario.healthyMethod.steps.need}</p>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-[#3A5A40] block mb-0.5">2. الاستماع الحقيقي:</span>
                  <p className="text-[#334237] text-[11px]">{currentScenario.healthyMethod.steps.listen}</p>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-[#3A5A40] block mb-0.5">3. وضع الحدود:</span>
                  <p className="text-[#334237] text-[11px]">{currentScenario.healthyMethod.steps.boundary}</p>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200">
                  <span className="font-bold text-[#3A5A40] block mb-0.5">4. الوصول إلى اتفاق:</span>
                  <p className="text-[#334237] text-[11px]">{currentScenario.healthyMethod.steps.agreement}</p>
                </div>
              </div>
            </div>
          )}

          <TakeawayResultCard
            quote="«الهدف من الحوار في البيت ليس أن تكسب معركة ضد شريكك.. بل أن تكسبا معاً معركة ضد المشكلة»"
            onTryAnother={() => setSelectedScenarioIndex((selectedScenarioIndex + 1) % CONFLICT_SCENARIOS.length)}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
