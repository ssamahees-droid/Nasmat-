import React, { useState } from 'react';
import { Sparkles, X, Heart, Share2, Volume2, Bookmark, Check } from 'lucide-react';
import { ambientSound } from '../utils/audioSynth';
import { storage } from '../services/storage';

interface DailyWisdomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WISDOM_CARDS = [
  {
    id: 'w1',
    quote: '«لستَ مطالباً بأن تكون كل شيء لكل الناس، ولا بأن تصلح كل ما انكسر في يوم واحد. يكفي أن تكون رحيماً بقلبك الآن.»',
    author: 'من تأملات الرفق بالذات',
    theme: 'الرفق بالذات والحدود'
  },
  {
    id: 'w2',
    quote: '«كما تسكن مياه النهر العكر حين تُترك بهدوء، كذلك يصفو عقلك المزدحم حين تكف عن لوم نفسك على كل فكرة عابرة.»',
    author: 'الحكمة النفسية التأملية',
    theme: 'سكون العقل'
  },
  {
    id: 'w3',
    quote: '«الضعف الإنساني ليس عيباً يُخجل منه، بل هو المساحة التي يتنفس فيها الرجاء وتكتمل بها إنسانيتنا المشتركة.»',
    author: 'نسمة سكينة',
    theme: 'تقبل الضعف البشري'
  }
];

export const DailyWisdomModal: React.FC<DailyWisdomModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const currentCard = WISDOM_CARDS[currentIdx];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % WISDOM_CARDS.length);
    setIsSaved(false);
  };

  const handlePlayChime = () => {
    ambientSound.playSingingBowlChime(528); // 528Hz love & harmony chime
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentCard.quote}\n— ${currentCard.author} (نسمة حياة)`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    storage.addNote(`حفظت بطاقة سكينة: ${currentCard.quote}`);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 shadow-2xl text-right overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8FAF9A]/20 text-[#355C4A] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26332D]">بطاقة السكينة اليومية</h2>
              <p className="text-[11px] text-[#52645B]">{currentCard.theme}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Artistic Card View */}
        <div className="my-6 p-6 sm:p-8 bg-gradient-to-tr from-[#FAF7F0] via-white to-[#EFEAE0] rounded-3xl border border-[#8FAF9A]/40 shadow-sm relative overflow-hidden text-center">
          <div className="text-3xl mb-3 text-[#355C4A]">🌿</div>
          <blockquote className="text-sm sm:text-base font-medium text-[#26332D] leading-loose italic">
            {currentCard.quote}
          </blockquote>
          <div className="mt-4 pt-3 border-t border-[#E8DDCC]/50 text-xs font-bold text-[#355C4A]">
            — {currentCard.author}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8DDCC]">
          <button
            onClick={handlePlayChime}
            className="p-2.5 text-[#355C4A] hover:bg-[#8FAF9A]/20 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="رنّة الصفاء"
          >
            <Volume2 className="w-4 h-4" />
            <span>نغمة السكينة</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 text-[#52645B] hover:text-[#26332D] hover:bg-stone-200/50 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'تم النسخ' : 'مشاركة'}</span>
          </button>

          <button
            onClick={handleSaveToNotes}
            className="p-2.5 text-[#52645B] hover:text-[#355C4A] hover:bg-stone-200/50 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'تم الحفظ في رحلتي' : 'حفظ'}</span>
          </button>

          <button
            onClick={handleNext}
            className="py-2 px-3 bg-[#355C4A] text-white font-bold text-xs rounded-xl hover:bg-[#264235] transition-colors"
          >
            بطاقة أخرى ←
          </button>
        </div>
      </div>
    </div>
  );
};
