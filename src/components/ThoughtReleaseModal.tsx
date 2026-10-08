import React, { useState } from 'react';
import { X, Wind, Sparkles, Droplets, Cloud, HeartHandshake, RotateCcw } from 'lucide-react';
import { ambientSound } from '../utils/audioSynth';

interface ThoughtReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThoughtReleaseModal: React.FC<ThoughtReleaseModalProps> = ({ isOpen, onClose }) => {
  const [thought, setThought] = useState('');
  const [metaphor, setMetaphor] = useState<'stream' | 'cloud' | 'bubble'>('stream');
  const [isReleasing, setIsReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  if (!isOpen) return null;

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim() || isReleasing) return;

    setIsReleasing(true);
    ambientSound.playSingingBowlChime(396); // Solfeggio frequency for releasing guilt and fear

    // 4.5 seconds animation of floating and dissolving
    setTimeout(() => {
      setIsReleasing(false);
      setReleased(true);
    }, 4500);
  };

  const handleReset = () => {
    setThought('');
    setReleased(false);
    setIsReleasing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8FAF9A]/20 text-[#355C4A] flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#26332D]">
                مساحة التفريغ والتحرر 🍃
              </h2>
              <p className="text-[11px] text-[#52645B]">
                تمرين تأملي لفصل نفسك عن الأفكار المزعجة
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

        {/* Releasing Animation Stage */}
        {isReleasing ? (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-6 relative min-h-[300px] overflow-hidden">
            {/* The Floating Element */}
            <div className={`transition-all duration-4500 ease-out transform ${
              metaphor === 'stream'
                ? '-translate-x-48 translate-y-16 opacity-0 scale-75'
                : metaphor === 'cloud'
                ? '-translate-y-36 opacity-0 scale-150'
                : 'scale-200 opacity-0'
            }`}>
              <div className="p-4 bg-white/90 backdrop-blur-sm border border-[#8FAF9A]/60 rounded-3xl shadow-xl max-w-xs mx-auto text-xs text-[#26332D] font-medium leading-relaxed">
                <div className="text-2xl mb-1">
                  {metaphor === 'stream' ? '🍃' : metaphor === 'cloud' ? '☁️' : '🫧'}
                </div>
                «{thought}»
              </div>
            </div>

            <div className="text-xs text-[#52645B] animate-pulse">
              {metaphor === 'stream' && 'ورقة الشجر تطفو برفق على سطح النهر حاملة الفكرة بعيداً...'}
              {metaphor === 'cloud' && 'السحابة تتمدد وتتبدد في سماء الوعي الصافية...'}
              {metaphor === 'bubble' && 'الفقاعة ترتفع بسلام وتتلاشى في الهواء...'}
            </div>
          </div>
        ) : released ? (
          /* Finished State */
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8 text-[#355C4A]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#26332D]">
                أطلقت الفكرة بسلام 🤍
              </h3>
              <p className="text-xs text-[#52645B] max-w-sm mx-auto leading-relaxed">
                تذكر دائماً: «الأفكار ليست حقائق حتمية، بل هي مجرد أحداث عابرة في سماء وعيك، وأنت لست أفكارك».
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-2xl border border-[#E8DDCC] text-[11px] text-[#7D8F85]">
              * لم يتم حفظ أي كلمة كتبتها احتراماً لخصوصيتك وسريتك التامة.
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-[#FAF7F0] hover:bg-stone-100 border border-[#E8DDCC] text-[#355C4A] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تحرير فكرة أخرى</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#355C4A] text-white text-xs font-bold rounded-xl hover:bg-[#264235] transition-colors"
              >
                العودة للتطبيق
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleRelease} className="space-y-5 my-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#26332D]">
                اكتب الفكرة أو الهاجس الذي يثقل بالك الآن:
              </label>
              <textarea
                rows={3}
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="مثال: قلقان من مقابلة العمل.. أو حاسس إني مقصر ومستنزف..."
                required
                className="w-full p-3.5 bg-white border border-[#E8DDCC] rounded-2xl text-xs text-[#26332D] placeholder-[#7D8F85] focus:outline-hidden focus:border-[#355C4A]"
              />
              <p className="text-[10px] text-[#7D8F85]">
                🔒 هذه الخانة آمنة ومؤقتة؛ الكلمات تذوب فوراً ولا تُحفظ في أي مكان.
              </p>
            </div>

            {/* Metaphor Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#26332D]">
                اختر طريقة التحرير:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'stream', icon: '🍃', title: 'ورقة في النهر', desc: 'تطفو بعيداً' },
                  { id: 'cloud', icon: '☁️', title: 'سحابة عابرة', desc: 'تتبدد في السماء' },
                  { id: 'bubble', icon: '🫧', title: 'فقاعة ماء', desc: 'تتلاشى بلطف' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMetaphor(item.id as typeof metaphor)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      metaphor === item.id
                        ? 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs'
                        : 'bg-white/80 text-[#26332D] border-[#E8DDCC] hover:bg-white'
                    }`}
                  >
                    <div className="text-xl mb-0.5">{item.icon}</div>
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className={`text-[10px] ${metaphor === item.id ? 'text-[#E8DDCC]' : 'text-[#7D8F85]'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!thought.trim()}
              className="w-full py-3.5 px-4 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md shadow-[#355C4A]/20 transition-all flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>إطلاق الفكرة والتحرر منها الآن</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
