import React, { useState } from 'react';
import { X, Award, RotateCcw, CheckCircle2, AlertCircle, ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { FACT_OR_STORY_QUESTIONS, GameQuestion } from '../data/newPhaseData';

interface FactOrStoryGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryType = 'fact' | 'story' | 'feeling' | 'need';

const CATEGORY_CARDS: { id: CategoryType; label: string; emoji: string; desc: string }[] = [
  { id: 'fact', label: 'حدث حقيقي', emoji: '📌', desc: 'واقع ملموس بالكاميرا بدون تأويل' },
  { id: 'story', label: 'تفسير / فكرة', emoji: '💡', desc: 'سيناريو أو استنتاج داخل العقل' },
  { id: 'feeling', label: 'شعور / عاطفة', emoji: '💓', desc: 'استجابة جسدية وعاطفية محسوسة' },
  { id: 'need', label: 'احتياج إنساني', emoji: '🌱', desc: 'رغبة في أمان أو تقدير أو راحة' },
];

export const FactOrStoryGameModal: React.FC<FactOrStoryGameModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<CategoryType | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ: GameQuestion = FACT_OR_STORY_QUESTIONS[currentIndex];

  const handleSelect = (choice: CategoryType) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentQ.correctCategory;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < FACT_OR_STORY_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-right max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎮</span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#26332D]">
                الحقيقة ولا الحكاية؟
              </h2>
              <p className="text-[11px] text-[#52645B]">
                ميّز بين ما حدث فعلاً وما نسجه عقلك من سيناريوهات
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
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {!isCompleted ? (
            <div className="space-y-4 animate-fade-in">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-[#7D8F85]">
                <span>الجولة {currentIndex + 1} من {FACT_OR_STORY_QUESTIONS.length}</span>
                <span className="font-mono font-bold text-[#355C4A]">النقاط: {score}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#E8DDCC] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#355C4A] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / FACT_OR_STORY_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* The Statement Card */}
              <div className="p-5 sm:p-6 bg-white border border-[#8FAF9A]/50 rounded-3xl text-center space-y-2 shadow-xs">
                <span className="text-[11px] font-bold text-[#355C4A] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E8DDCC]">
                  صنّف هذه العبارة في مكانها الصحيح:
                </span>
                <div className="text-base sm:text-xl font-extrabold text-[#26332D] leading-relaxed pt-2">
                  {currentQ.statement}
                </div>
              </div>

              {/* The Category Choice Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORY_CARDS.map((cat) => {
                  const isSelected = selectedAnswer === cat.id;
                  const isCorrectTarget = currentQ.correctCategory === cat.id;
                  
                  let btnStyle = 'bg-white hover:bg-stone-50 border-[#E8DDCC] text-[#26332D]';
                  if (isAnswered) {
                    if (isCorrectTarget) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400';
                    } else if (isSelected && !isCorrectTarget) {
                      btnStyle = 'bg-rose-600 text-white border-rose-600';
                    } else {
                      btnStyle = 'bg-stone-100/60 opacity-40 border-[#E8DDCC] text-stone-500';
                    }
                  }

                  return (
                    <button
                      key={cat.id}
                      disabled={isAnswered}
                      onClick={() => handleSelect(cat.id)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${btnStyle} active:scale-98`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{cat.emoji}</span>
                        {isAnswered && isCorrectTarget && (
                          <span className="text-xs bg-white text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                            الصحيح ✓
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm">{cat.label}</div>
                        <div className="text-[10px] mt-0.5 opacity-80 line-clamp-1">{cat.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {isAnswered && (
                <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-2">
                    {selectedAnswer === currentQ.correctCategory ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>رائع! تصنيف دقيق وملهم</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>ليست كذلك.. الإجابة الصحيحة هي: {currentQ.categoryLabel}</span>
                      </div>
                    )}
                  </div>

                  {/* Core Educational Insight specified by prompt */}
                  <div className="p-3 bg-white rounded-xl border border-[#8FAF9A]/30 text-xs text-[#26332D] space-y-1">
                    <p className="font-bold text-[#355C4A]">
                      «اللي حصل حاجة... والتفسير اللي دماغنا قالته عن اللي حصل حاجة تانية.»
                    </p>
                    <p className="text-[11px] text-[#52645B] leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{currentIndex + 1 === FACT_OR_STORY_QUESTIONS.length ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Completed Screen */
            <div className="p-6 bg-white border border-[#8FAF9A]/40 rounded-3xl text-center space-y-5 animate-fade-in shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#355C4A]">انتهت جولات اللعبة!</span>
                <h3 className="text-2xl font-extrabold text-[#26332D]">
                  نتيجتك: {score} من {FACT_OR_STORY_QUESTIONS.length} إجابات صحيحة
                </h3>
              </div>

              {/* Exact user prompt requirement message */}
              <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl max-w-md mx-auto text-xs text-[#355C4A] leading-relaxed font-bold">
                «مش الهدف إنك تكسب... الهدف إنك تبدأ تلاحظ الفرق بين الحدث وبين الحكاية اللي عقلك بيبنيها.»
              </div>

              <p className="text-xs text-[#52645B] max-w-sm mx-auto leading-relaxed">
                في كل مرة يمر عليك موقف مقلق، اسأل نفسك فوراً:
                <br />
                <span className="font-bold text-[#26332D]">"هل هذه حقيقة موضوعية.. أم قصة ألّفها خوفي الآن؟"</span>
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 px-4 bg-[#FAF7F0] hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>العب مرة تانية</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-2xl transition-colors shadow-xs"
                >
                  <span>العودة للرئيسية</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
