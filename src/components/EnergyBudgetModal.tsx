import React, { useState, useEffect } from 'react';
import { X, BatteryWarning, Check, RotateCcw, Sparkles, TrendingDown, TrendingUp, HelpCircle } from 'lucide-react';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface EnergyBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnergyBudgetModal: React.FC<EnergyBudgetModalProps> = ({ isOpen, onClose }) => {
  const [drains, setDrains] = useState<string[]>(['', '', '', '', '']);
  const [rechargers, setRechargers] = useState<string[]>(['', '', '']);
  const [reduceThisWeek, setReduceThisWeek] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = storage.getEnergyBudget();
      if (saved) {
        if (saved.drains) setDrains(saved.drains);
        if (saved.rechargers) setRechargers(saved.rechargers);
        if (saved.reduceThisWeek) setReduceThisWeek(saved.reduceThisWeek);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrainChange = (index: number, val: string) => {
    const next = [...drains];
    next[index] = val;
    setDrains(next);
  };

  const handleRechargerChange = (index: number, val: string) => {
    const next = [...rechargers];
    next[index] = val;
    setRechargers(next);
  };

  const handleSave = () => {
    const budgetData = {
      drains: drains.filter(d => d.trim()),
      rechargers: rechargers.filter(r => r.trim()),
      reduceThisWeek
    };
    storage.saveEnergyBudget(budgetData);
    storage.addNote(`⚖️ ميزانية الطاقة: قررت تقليل «${reduceThisWeek}» هذا الأسبوع لحماية طاقتي.`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setDrains(['', '', '', '', '']);
    setRechargers(['', '', '']);
    setReduceThisWeek('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚖️</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                تمرين «ميزانية الطاقة»
              </h2>
              <p className="text-[11px] text-[#52645B]">
                أنت لست آلة.. إدارة طاقتك قبل أن تصل إلى مرحلة الانهيار
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
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-950 leading-relaxed">
            «أحياناً نعيش وكأن المطلوب منا أن نكون متاحين طوال الوقت: نعمل، نساعد، نرد، ننجز، نلبي احتياجات الآخرين.. ثم نتساءل: <strong>أنا ليه خلصت؟</strong> لأن الإنسان له طاقة محدودة.»
          </div>

          {/* Part 1: 5 Drains */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
              <TrendingDown className="w-4 h-4" />
              <span>اكتب خمسة أشياء تستنزف طاقتك:</span>
            </div>
            <div className="space-y-1.5">
              {drains.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={d}
                    onChange={(e) => handleDrainChange(i, e.target.value)}
                    placeholder={`مستنزف ${i + 1} (مثال: محادثات متوترة، عمل إضافي، قلة نوم...)`}
                    className="flex-1 p-2.5 bg-white border border-[#E8DDCC] focus:border-rose-400 rounded-xl text-xs text-[#26332D] outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Part 2: 3 Rechargers */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <TrendingUp className="w-4 h-4" />
              <span>اكتب ثلاثة أشياء تساعدك على استعادة بعض طاقتك:</span>
            </div>
            <div className="space-y-1.5">
              {rechargers.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => handleRechargerChange(i, e.target.value)}
                    placeholder={`معوّض ${i + 1} (مثال: مشي هادئ، نوم كافي، قراءة ممتعة...)`}
                    className="flex-1 p-2.5 bg-white border border-[#E8DDCC] focus:border-emerald-500 rounded-xl text-xs text-[#26332D] outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Part 3: The Critical Question */}
          <div className="p-4 bg-white border-2 border-[#8FAF9A]/60 rounded-2xl space-y-2">
            <label className="block text-xs font-extrabold text-[#26332D]">
              السؤال المهم: ما الشيء الذي يمكنني تقليله هذا الأسبوع؟
            </label>
            <textarea
              rows={2}
              value={reduceThisWeek}
              onChange={(e) => setReduceThisWeek(e.target.value)}
              placeholder="اكتب التزاماً واحداً محدداً تنوي تقليله أو الاعتذار عنه هذا الأسبوع..."
              className="w-full p-3 bg-[#FAF7F0] border border-[#E8DDCC] focus:border-[#355C4A] rounded-xl text-xs text-[#26332D] outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{savedSuccess ? 'تم حفظ ميزانية الطاقة بنجاح ✓' : 'حفظ الميزانية والالتزام بها'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 bg-white hover:bg-stone-100 text-stone-600 border border-[#E8DDCC] rounded-2xl text-xs"
              title="إعادة تعيين"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <TakeawayResultCard
            quote="«العناية بالنفس ليست أن تهرب من مسؤولياتك، وإنما أن تتعلم إدارة طاقتك قبل أن تصل إلى مرحلة الانهيار»"
            onTryAnother={handleReset}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
