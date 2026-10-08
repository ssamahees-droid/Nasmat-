import React, { useState } from 'react';
import { 
  ArrowRight, 
  Bookmark, 
  Volume2, 
  Share2, 
  MessageCircle, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Check,
  Type
} from 'lucide-react';
import { storage } from '../services/storage';
import { ContentItem } from '../types';

interface ContentDetailScreenProps {
  contentId: string;
  onBack: () => void;
  onNavigateToSupport: () => void;
  onOpenAudioModal: (title: string, category: string, durationMinutes: number) => void;
}

export const ContentDetailScreen: React.FC<ContentDetailScreenProps> = ({
  contentId,
  onBack,
  onNavigateToSupport,
  onOpenAudioModal
}) => {
  const item: ContentItem | undefined = storage.getContentById(contentId);
  const [isFav, setIsFav] = useState(storage.isFavorite(contentId));
  const [copiedLink, setCopiedLink] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  if (!item) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-bold text-[#26332D]">المحتوى غير موجود أو تم نقله</h2>
        <button
          onClick={onBack}
          className="py-2 px-4 bg-[#355C4A] text-white text-xs font-semibold rounded-xl"
        >
          العودة للمكتبة
        </button>
      </div>
    );
  }

  const handleToggleFav = () => {
    const updated = storage.toggleFavorite(item.id);
    setIsFav(updated);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const fontSizeClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose'
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      
      {/* Top Bar with Back and Font Sizer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#355C4A] hover:underline"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمكتبة</span>
        </button>

        {/* Font size toggle for accessibility (Section 29) */}
        <div className="flex items-center gap-1 bg-[#FAF7F0] border border-[#E8DDCC] p-1 rounded-xl text-xs">
          <span className="text-[10px] text-[#52645B] px-1 flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
          </span>
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2 py-0.5 rounded-lg ${fontSize === 'normal' ? 'bg-[#355C4A] text-white' : 'text-[#52645B]'}`}
          >
            عادي
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2 py-0.5 rounded-lg ${fontSize === 'large' ? 'bg-[#355C4A] text-white' : 'text-[#52645B]'}`}
          >
            كبير
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-2 py-0.5 rounded-lg ${fontSize === 'xlarge' ? 'bg-[#355C4A] text-white' : 'text-[#52645B]'}`}
          >
            أكبر
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-3 border-b border-[#E8DDCC] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#52645B]">
          <span className="font-bold text-[#355C4A]">{item.subCategory || item.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.duration}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26332D] leading-snug">
          {item.title}
        </h1>

        <p className="text-sm sm:text-base text-[#52645B] leading-relaxed">
          {item.description}
        </p>

        {/* Metadata of Author & Clinical Reviewer (Section 8 Spec) */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#52645B]">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#8FAF9A]" />
            <span>إعداد: <strong>{item.author}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#355C4A]" />
            <span>مراجعة متخصصة: <strong>{item.reviewer}</strong></span>
          </div>
        </div>
      </header>

      {/* Action Buttons Toolbar (Section 8 from Spec: حفظ، استمع، مشاركة، محتاج أتكلم) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={handleToggleFav}
          className={`py-3 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            isFav
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-[#FAF7F0] text-[#35453E] border-[#E8DDCC] hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          <span>{isFav ? 'تم الحفظ' : 'حفظ'}</span>
        </button>

        <button
          onClick={() => onOpenAudioModal(item.title, item.subCategory || item.category, 6)}
          className="py-3 px-3 bg-[#FAF7F0] hover:bg-white text-[#355C4A] border border-[#E8DDCC] rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للمحتوى</span>
        </button>

        <button
          onClick={handleShare}
          className="py-3 px-3 bg-[#FAF7F0] hover:bg-white text-[#35453E] border border-[#E8DDCC] rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة'}</span>
        </button>

        <button
          onClick={onNavigateToSupport}
          className="py-3 px-3 bg-[#8FAF9A]/20 hover:bg-[#8FAF9A]/30 text-[#355C4A] border border-[#8FAF9A]/40 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>محتاج أتكلم</span>
        </button>
      </div>

      {/* Main Body Content */}
      <article className={`bg-white/80 border border-[#E8DDCC] rounded-3xl p-6 sm:p-8 space-y-4 text-[#26332D] shadow-xs ${fontSizeClasses[fontSize]}`}>
        {item.body.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2 key={idx} className="text-xl font-bold text-[#355C4A] pt-3 pb-1 border-b border-[#E8DDCC]/60">
                {paragraph.replace('### ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('- ')) {
            const listItems = paragraph.split('\n').filter(Boolean);
            return (
              <ul key={idx} className="space-y-1.5 list-disc list-inside pr-1 text-[#35453E]">
                {listItems.map((li, lIdx) => (
                  <li key={lIdx}>{li.replace(/^- /, '')}</li>
                ))}
              </ul>
            );
          }
          if (/^\d+\./.test(paragraph)) {
            const numItems = paragraph.split('\n').filter(Boolean);
            return (
              <ol key={idx} className="space-y-1.5 list-decimal list-inside pr-1 text-[#35453E]">
                {numItems.map((ni, nIdx) => (
                  <li key={nIdx}>{ni.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            );
          }
          return (
            <p key={idx} className="leading-relaxed text-[#35453E]">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Strict Ethical Guidelines & Disclaimer Notice (Section 8 & 28 Spec) */}
      <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl space-y-2 text-xs text-[#52645B]">
        <div className="flex items-center gap-2 font-bold text-[#355C4A]">
          <ShieldCheck className="w-4 h-4" />
          <span>محددات المحتوى وأمان الاستخدام:</span>
        </div>
        <p className="leading-relaxed">
          هذا المحتوى مقدم لأغراض التوعية والاسترشاد الذاتي فقط، ولا يمثل تشخيصاً طبياً فردياً، ولا يصف دواءً أو يوصي بإيقافه أو ادعاء علاج مضمون. إذا كنت تعاني من أعراض مستمرة تؤثر على حياتك اليومية، نوصيك بمراجعة طبيب نفسي معتمد.
        </p>
      </div>
    </div>
  );
};
