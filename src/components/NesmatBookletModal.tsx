import React, { useState } from 'react';
import { X, BookOpen, ChevronRight, ChevronLeft, Sparkles, ArrowLeft, Bookmark, Check, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BOOKLET_CHAPTERS, BookletChapter } from '../data/bookletData';
import { TakeawayResultCard } from './TakeawayResultCard';

interface NesmatBookletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPersonalPlan: () => void;
  onOpenEnergyBudget: () => void;
  onOpenBoundaryBuilder: () => void;
  onOpenSpecialistGuide: () => void;
  onOpenUntangleKnot: () => void;
}

export const NesmatBookletModal: React.FC<NesmatBookletModalProps> = ({
  isOpen,
  onClose,
  onOpenPersonalPlan,
  onOpenEnergyBudget,
  onOpenBoundaryBuilder,
  onOpenSpecialistGuide,
  onOpenUntangleKnot
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showChapterList, setShowChapterList] = useState(false);

  if (!isOpen) return null;

  const currentChapter: BookletChapter = BOOKLET_CHAPTERS[currentChapterIndex];

  const handleNext = () => {
    if (currentChapterIndex < BOOKLET_CHAPTERS.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  const handleAction = (toolName?: string) => {
    if (toolName === 'energy_budget') {
      onOpenEnergyBudget();
    } else if (toolName === 'boundary_builder') {
      onOpenBoundaryBuilder();
    } else if (toolName === 'specialist_guide') {
      onOpenSpecialistGuide();
    } else if (toolName === 'overthinking_tool') {
      onOpenUntangleKnot();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                كتيب «نسمة حياة»
              </h2>
              <p className="text-[11px] text-[#52645B]">
                دليل مبسط للصحة النفسية · نحو مجتمع يهتم بالصحة النفسية كما يهتم بالصحة الجسدية
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowChapterList(prev => !prev)}
              className="py-1 px-3 bg-white hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] text-xs font-bold rounded-xl transition-colors"
            >
              {showChapterList ? 'إغلاق الفهرس' : 'فهرس الفصول 📑'}
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {showChapterList ? (
            /* Chapters Index List */
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#355C4A]">فصول الكتيب الـ 12:</span>
                <span className="text-[11px] text-[#7D8F85]">اضغط على أي فصل للقراءة الفورية</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BOOKLET_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowChapterList(false);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 ${
                      currentChapterIndex === idx
                        ? 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-[#26332D] border-[#E8DDCC]'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {ch.chapterNumber}
                    </span>
                    <div>
                      <div className="font-extrabold text-xs leading-snug">{ch.title}</div>
                      <div className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{ch.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Special Personal Plan Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-100 to-[#FAF7F0] border border-emerald-300 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950">
                    خطة نسمة حياة الخاصة بي (صفحتان للملء الذاتي)
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    مستنزفاتي، علامات التدهور، وما يساعدني وقت الضغوط
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowChapterList(false);
                    onOpenPersonalPlan();
                  }}
                  className="px-3.5 py-2 bg-[#355C4A] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#264235] transition-colors"
                >
                  فتح خطتي
                </button>
              </div>
            </div>
          ) : (
            /* Chapter Reading View */
            <div className="space-y-4 animate-fade-in">
              {/* Chapter Meta */}
              <div className="p-4 bg-white border border-[#E8DDCC] rounded-3xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#7D8F85]">
                  <span className="font-bold text-[#355C4A]">الفصل {currentChapter.chapterNumber} من {BOOKLET_CHAPTERS.length}</span>
                  <span className="text-[11px]">كتيب نسمة حياة</span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-[#26332D]">
                  {currentChapter.title}
                </h3>
                <p className="text-xs text-[#52645B] leading-relaxed">
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Chapter Paragraphs */}
              <div className="p-5 bg-white border border-[#E8DDCC] rounded-3xl space-y-3.5 shadow-xs">
                {currentChapter.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-[#26332D] leading-relaxed font-medium">
                    {p}
                  </p>
                ))}

                {/* Key Quote Callout */}
                {currentChapter.keyQuote && (
                  <div className="p-4 bg-[#8FAF9A]/15 border-r-4 border-[#355C4A] rounded-2xl space-y-1 mt-4">
                    <span className="text-[10px] font-bold text-[#355C4A] block">رسالة للتأمل</span>
                    <blockquote className="text-xs sm:text-sm font-extrabold text-[#26332D] leading-relaxed">
                      {currentChapter.keyQuote}
                    </blockquote>
                  </div>
                )}

                {/* Reflection Question */}
                {currentChapter.reflectionQuestion && (
                  <div className="p-3 bg-[#FAF7F0] border border-[#E8DDCC] rounded-xl text-xs text-[#52645B] leading-relaxed">
                    🤔 <strong>وقفة مع النفس:</strong> {currentChapter.reflectionQuestion}
                  </div>
                )}

                {/* Action tool trigger if linked */}
                {currentChapter.actionTool && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleAction(currentChapter.actionTool)}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#355C4A]" />
                      <span>تطبيق التمرين العملي المرتبط بهذا الفصل الآن</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  disabled={currentChapterIndex === 0}
                  onClick={handlePrev}
                  className="py-2.5 px-4 bg-white hover:bg-stone-100 disabled:opacity-40 border border-[#E8DDCC] text-xs font-bold text-[#26332D] rounded-2xl flex items-center gap-1.5 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الفصل السابق</span>
                </button>

                <button
                  onClick={() => setShowChapterList(true)}
                  className="py-2.5 px-3 bg-[#FAF7F0] hover:bg-stone-100 border border-[#E8DDCC] text-xs text-[#52645B] rounded-2xl font-bold"
                >
                  الفهرس
                </button>

                <button
                  disabled={currentChapterIndex === BOOKLET_CHAPTERS.length - 1}
                  onClick={handleNext}
                  className="py-2.5 px-4 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-40 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>الفصل التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Takeaway Card */}
              <TakeawayResultCard
                quote="«كثيرون يعيشون الحياة... وقليلون يستمتعون بها. خذ وقتاً لنفسك، فطلب المساعدة ليس هزيمة»"
                onTryAnother={handleNext}
                onBackToHome={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
