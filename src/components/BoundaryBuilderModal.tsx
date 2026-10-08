import React, { useState } from 'react';
import { X, Shield, Copy, Check, Sparkles, MessageCircle, Heart } from 'lucide-react';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface BoundaryBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BoundaryScenario {
  id: string;
  category: string;
  situation: string;
  automaticBadHabit: string;
  healthyResponse: string;
  explanation: string;
}

const BOUNDARY_SCENARIOS: BoundaryScenario[] = [
  {
    id: 'b1',
    category: 'الرد التلقائي المفاجئ',
    situation: 'طلب منك شخص معروف مهمة أو مشوار فوري، وأنت متعب أو لا يناسبك الوقت.',
    automaticBadHabit: 'الموافقة الفورية بالإحراج: "ماشي حاضر من عيوني"، ثم تندم وتتعصب.',
    healthyResponse: '«محتاج أفكر في جدولي وأرد عليك بالليل.»',
    explanation: 'أعطِ نفسك حق تأجيل القرار 10 دقائق لتقييم طاقتك الحقيقية دون إحراج.'
  },
  {
    id: 'b2',
    category: 'الضغط المتكرر في العمل أو المهام',
    situation: 'مدير أو زميل يلقي عليك مهام إضافية فوق طاقتك بحجة أنك "شاطر وبتنجز".',
    automaticBadHabit: 'الهجوم أو التذمر العقيم: "أنت دائماً بتضغط عليّ وكل الشغل فوق دماغي!"',
    healthyResponse: '«أنا لا أستطيع القيام بهذا الآن بجودة كافية، وأحتاج لتأجيله أو تسليمه لزميل آخر لأن طاقتي مركزة في المهمة الفلانية.»',
    explanation: 'توضيح حدود الطاقة بموضوعية ومهنية دون الدخول في جدال شخصي حاد.'
  },
  {
    id: 'b3',
    category: 'التدخل في الخصوصيات والأسئلة المحرجة',
    situation: 'شخص يسألك سؤالاً شخصياً جداً ومحرجاً (في مناسبة عائلية أو تجمع).',
    automaticBadHabit: 'الارتباك وتقديم تبريرات وإجابات لا ترغب في مشاركتها.',
    healthyResponse: '«مفضّل ما أتكلمش في الموضوع ده دلوقتي، بس طمني عليك أنت أخبارك إيه؟»',
    explanation: 'وضع خط أحمر هادئ ثم تحويل مجرى الحديث دون عداء.'
  },
  {
    id: 'b4',
    category: 'مكالمات ورسائل الاستنزاف المتأخرة',
    situation: 'اتصال أو رسالة عمل أو طلب غير عاجل بعد ساعات راحتك أو في عطلتك.',
    automaticBadHabit: 'الرد الفوري بدافع القلق والشعور بالذنب.',
    healthyResponse: '«مساء الخير، قرأت رسالتك.. هشوف الموضوع أول ما أبدأ بكرة الصبح إن شاء الله وأرد عليك بالتفصيل.»',
    explanation: 'إعادة تدريب الآخرين بلطف على احترام ساعات راحتك ونومك.'
  }
];

export const BoundaryBuilderModal: React.FC<BoundaryBuilderModalProps> = ({ isOpen, onClose }) => {
  const [selectedScenario, setSelectedScenario] = useState<BoundaryScenario>(BOUNDARY_SCENARIOS[0]);
  const [copied, setCopied] = useState(false);
  const [customNeed, setCustomNeed] = useState('');
  const [customResponse, setCustomResponse] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateCustom = () => {
    if (!customNeed.trim()) return;
    const generated = `«أنا لا أستطيع القيام بهذا الآن، وأحتاج إلى ${customNeed.trim()}.»`;
    setCustomResponse(generated);
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
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                الحدود ليست قسوة
              </h2>
              <p className="text-[11px] text-[#52645B]">
                تعلم فن الرفض اللبق وحماية طاقتك دون خسارة العلاقات
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
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl text-xs text-emerald-950 leading-relaxed">
            «وضع الحدود لا يعني أن تصبح قاسياً.. يعني أن تعرف: <strong>ما الذي أقبله؟ وما الذي لا أقبله؟ وما الذي أستطيع تحمله؟</strong>»
          </div>

          {/* Scenario Picker */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#26332D] block">اختر موقفاً شائعاً للتدرب على الرد السليم:</span>
            <div className="grid grid-cols-2 gap-2">
              {BOUNDARY_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`p-2.5 rounded-xl border text-right text-xs transition-all ${
                    selectedScenario.id === sc.id
                      ? 'bg-[#355C4A] text-white border-[#355C4A] font-bold shadow-2xs'
                      : 'bg-white hover:bg-stone-50 text-[#26332D] border-[#E8DDCC]'
                  }`}
                >
                  {sc.category}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Details */}
          <div className="p-4 bg-white border border-[#E8DDCC] rounded-2xl space-y-3">
            <div className="text-xs text-[#52645B] leading-relaxed">
              <strong className="text-[#26332D]">الموقف:</strong> {selectedScenario.situation}
            </div>

            <div className="p-2.5 bg-rose-50 border border-rose-200/70 rounded-xl text-xs text-rose-950 leading-relaxed">
              <strong>❌ العادة التلقائية المرهقة:</strong> {selectedScenario.automaticBadHabit}
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-950">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">✅ الصيغة الصحية البديلة:</span>
                <button
                  onClick={() => handleCopy(selectedScenario.healthyResponse)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 text-emerald-900 font-bold rounded-lg border border-emerald-300 flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'تم النسخ ✓' : 'نسخ الصيغة'}</span>
                </button>
              </div>
              <p className="font-extrabold text-sm text-[#26332D] pt-1">
                {selectedScenario.healthyResponse}
              </p>
              <p className="text-[11px] text-emerald-800/80 pt-1">
                💡 {selectedScenario.explanation}
              </p>
            </div>
          </div>

          {/* Custom Formula Builder */}
          <div className="p-4 bg-[#FAF7F0] border border-[#8FAF9A]/50 rounded-2xl space-y-2.5">
            <div className="text-xs font-bold text-[#355C4A]">
              🛠️ اصنع صيغة حدود خاصة بك الآن:
            </div>
            <p className="text-[11px] text-[#52645B]">
              الصيغة الذهبية من الكتيب: «أنا لا أستطيع القيام بهذا الآن، وأحتاج إلى [احتياجك الحالي]».
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={customNeed}
                onChange={(e) => setCustomNeed(e.target.value)}
                placeholder="اكتب ما تحتاجه (مثال: راحة ساعتين، تأجيل القرار للغد، إنهاء عمل عاجل...)"
                className="flex-1 p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs text-[#26332D] outline-none"
              />
              <button
                onClick={handleGenerateCustom}
                disabled={!customNeed.trim()}
                className="py-2.5 px-4 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors"
              >
                تركيب الجملة
              </button>
            </div>

            {customResponse && (
              <div className="p-3 bg-white border border-[#8FAF9A] rounded-xl flex items-center justify-between text-xs animate-fade-in">
                <span className="font-extrabold text-[#26332D]">{customResponse}</span>
                <button
                  onClick={() => handleCopy(customResponse)}
                  className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-bold text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'تم النسخ ✓' : 'نسخ'}</span>
                </button>
              </div>
            )}
          </div>

          <TakeawayResultCard
            quote="«أحياناً تكون جملة: \'محتاج أفكر وأرد عليك\' بداية استعادة السيطرة الحقيقية على حياتك»"
            onTryAnother={() => setSelectedScenario(BOUNDARY_SCENARIOS[1])}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
