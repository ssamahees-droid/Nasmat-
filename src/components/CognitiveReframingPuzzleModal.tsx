import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Palette, 
  Copy, 
  BookOpen, 
  Award, 
  Layers, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon,
  Heart
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';
import { TextAudioPlayer } from './TextAudioPlayer';

interface PuzzleChallenge {
  id: string;
  originalDistortedThought: string;
  distortionType: string;
  distortionExplanation: string;
  pieces: {
    id: string;
    text: string;
    isCorrect: boolean;
    slotIndex: number; // 0, 1, 2, 3
  }[];
  distractorPieces: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  artworkTitle: string;
  artworkSymbol: string;
  artworkPalette: {
    bgFrom: string;
    bgTo: string;
    accent: string;
    glow: string;
  };
  restoredMessage: string;
}

const PUZZLE_CHALLENGES: PuzzleChallenge[] = [
  {
    id: 'puzzle_1',
    originalDistortedThought: '«أنا دائماً أفشل في وضع حدود للآخرين»',
    distortionType: 'التعميم والكل أو لا شيء (All-or-Nothing)',
    distortionExplanation: 'كلمة "دائماً" تلغي كل محاولاتك السابقة وتزرع شعوراً كاذباً بالعجز المطلق.',
    pieces: [
      { id: 'p1_1', text: 'أنا أتعلم بالتدريج', isCorrect: true, slotIndex: 0 },
      { id: 'p1_2', text: 'كيف أصنع مسافة آمنة', isCorrect: true, slotIndex: 1 },
      { id: 'p1_3', text: 'تحمي طاقتي بلطف', isCorrect: true, slotIndex: 2 },
      { id: 'p1_4', text: 'ودون تأنيب ضمير', isCorrect: true, slotIndex: 3 }
    ],
    distractorPieces: [
      { id: 'p1_d1', text: 'أنا دائماً عاجز', isCorrect: false, explanation: 'هذه قطعة تعميم قاسية تهدم اللوحة.' },
      { id: 'p1_d2', text: 'ولن أنجح أبداً', isCorrect: false, explanation: 'توقع كارثي غير مبني على حقيقة.' }
    ],
    artworkTitle: 'لوحة «درع اللطف والحدود الآمنة»',
    artworkSymbol: '🛡️🌿',
    artworkPalette: {
      bgFrom: '#13281E',
      bgTo: '#0B1711',
      accent: '#10B981',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    restoredMessage: '«أنا أتعلم بالتدريج كيف أصنع مسافة آمنة تحمي طاقتي بلطف ودون تأنيب ضمير 🌿»'
  },
  {
    id: 'puzzle_2',
    originalDistortedThought: '«إذا رفض شخص طلبي فهذا يعني أنني لست كافياً أو محبوباً»',
    distortionType: 'الشخصنة وقراءة النوايا (Personalization)',
    distortionExplanation: 'ربط ردود أفعال الآخرين بقيمتك الجوهرية يجعلك رهينة لتقلبات مزاجهم وظروفهم.',
    pieces: [
      { id: 'p2_1', text: 'رفض شخص ما', isCorrect: true, slotIndex: 0 },
      { id: 'p2_2', text: 'يعبر عن ظروفه هو', isCorrect: true, slotIndex: 1 },
      { id: 'p2_3', text: 'وليس حكماً على قيمتي', isCorrect: true, slotIndex: 2 },
      { id: 'p2_4', text: 'التي تظل كاملة وثابتة', isCorrect: true, slotIndex: 3 }
    ],
    distractorPieces: [
      { id: 'p2_d1', text: 'يثبت أنني مكروه', isCorrect: false, explanation: 'استنتاج وهمي قفز للنتائج.' },
      { id: 'p2_d2', text: 'وعيب في شخصيتي', isCorrect: false, explanation: 'شخصنة غير مبررة للموقف.' }
    ],
    artworkTitle: 'لوحة «مرآة الحقيقة الثابتة»',
    artworkSymbol: '💎✨',
    artworkPalette: {
      bgFrom: '#182430',
      bgTo: '#0C131A',
      accent: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.4)'
    },
    restoredMessage: '«رفض شخص ما يعبر عن ظروفه هو، وليس حكماً على قيمتي التي تظل كاملة وثابتة 💎»'
  },
  {
    id: 'puzzle_3',
    originalDistortedThought: '«يجب أن أكون مثالياً في كل عمل وإلا فأنا فاشل لا أستحق الاحترام»',
    distortionType: 'فخ المثالية المرهقة (Perfectionism Trap)',
    distortionExplanation: 'اشتراط الكمال البشري يخلق شللاً في الإنجاز وتوتراً دائماً في الجهاز العصبي.',
    pieces: [
      { id: 'p3_1', text: 'المحاولة الصادقة', isCorrect: true, slotIndex: 0 },
      { id: 'p3_2', text: 'تكفيني اليوم', isCorrect: true, slotIndex: 1 },
      { id: 'p3_3', text: 'والخطأ محطة إنسانية', isCorrect: true, slotIndex: 2 },
      { id: 'p3_4', text: 'للتعلم والنمو بهدوء', isCorrect: true, slotIndex: 3 }
    ],
    distractorPieces: [
      { id: 'p3_d1', text: 'التقصير عار', isCorrect: false, explanation: 'قسوة غير إنسانية تمنع النمو.' },
      { id: 'p3_d2', text: 'لا مجال للراحة', isCorrect: false, explanation: 'استنزاف يولد الاحتراق النفسي.' }
    ],
    artworkTitle: 'لوحة «فسيفساء النقص الجميل»',
    artworkSymbol: '🏺🌸',
    artworkPalette: {
      bgFrom: '#271E15',
      bgTo: '#140E0A',
      accent: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    restoredMessage: '«المحاولة الصادقة تكفيني اليوم، والخطأ محطة إنسانية للتعلم والنمو بهدوء 🌸»'
  },
  {
    id: 'puzzle_4',
    originalDistortedThought: '«الجميع حولي متقدمون وأنا متأخر وفاتني قطار الحياة»',
    distortionType: 'المقارنة المجحفة وتضييق الأفق',
    distortionExplanation: 'مقارنة خط سيرك الداخلي المعقد بمشاهد خارجية متفرقة للآخرين يظلم مسارك الفريد.',
    pieces: [
      { id: 'p4_1', text: 'لكل روح في هذا الكون', isCorrect: true, slotIndex: 0 },
      { id: 'p4_2', text: 'توقيتها ونضجها الخاص', isCorrect: true, slotIndex: 1 },
      { id: 'p4_3', text: 'ومساري ينبض بالحياة', isCorrect: true, slotIndex: 2 },
      { id: 'p4_4', text: 'بإيقاعي الهادئ المستقل', isCorrect: true, slotIndex: 3 }
    ],
    distractorPieces: [
      { id: 'p4_d1', text: 'فاتني الأوان', isCorrect: false, explanation: 'وهم العجلة وضغط المجتمع.' },
      { id: 'p4_d2', text: 'وأنا أضعفهم', isCorrect: false, explanation: 'مقارنة سامة تهدم الثقة.' }
    ],
    artworkTitle: 'لوحة «مدار الروح الفريد»',
    artworkSymbol: '🌌🪐',
    artworkPalette: {
      bgFrom: '#22162B',
      bgTo: '#110A16',
      accent: '#C084FC',
      glow: 'rgba(192, 132, 252, 0.4)'
    },
    restoredMessage: '«لكل روح في هذا الكون توقيتها ونضجها الخاص، ومساري ينبض بالحياة بإيقاعي الهادئ المستقل 🌌»'
  }
];

export const CognitiveReframingPuzzleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activePuzzleIdx, setActivePuzzleIdx] = useState(0);
  const [placedSlots, setPlacedSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [availablePieces, setAvailablePieces] = useState<{ id: string; text: string; isCorrect: boolean }[]>([]);
  const [isArtworkUnlocked, setIsArtworkUnlocked] = useState(false);
  const [unlockedGallery, setUnlockedGallery] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nesmat_unlocked_puzzles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showGalleryView, setShowGalleryView] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const currentPuzzle = PUZZLE_CHALLENGES[activePuzzleIdx];

  const initPuzzle = (idx: number) => {
    const p = PUZZLE_CHALLENGES[idx];
    const all = [
      ...p.pieces.map(pc => ({ id: pc.id, text: pc.text, isCorrect: true })),
      ...p.distractorPieces.map(dp => ({ id: dp.id, text: dp.text, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    setAvailablePieces(all);
    setPlacedSlots([null, null, null, null]);
    setIsArtworkUnlocked(false);
    setErrorFeedback(null);
  };

  useEffect(() => {
    if (isOpen) {
      initPuzzle(activePuzzleIdx);
    }
  }, [isOpen, activePuzzleIdx]);

  if (!isOpen) return null;

  const handlePlacePiece = (piece: { id: string; text: string; isCorrect: boolean }) => {
    // Find next empty slot
    const emptyIndex = placedSlots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    if (!piece.isCorrect) {
      chimeService.playBubblePopChime();
      const dist = currentPuzzle.distractorPieces.find(d => d.id === piece.id);
      setErrorFeedback(dist?.explanation || 'هذه القطعة تعيدنا إلى الفكر القديم المشوه.');
      return;
    }

    // Check if it fits the current slot order
    const expectedPiece = currentPuzzle.pieces[emptyIndex];
    if (expectedPiece.id === piece.id) {
      chimeService.playPuzzleSnapChime();
      setErrorFeedback(null);
      const newSlots = [...placedSlots];
      newSlots[emptyIndex] = piece.text;
      setPlacedSlots(newSlots);

      // Remove from pool
      setAvailablePieces(prev => prev.filter(p => p.id !== piece.id));

      // If all 4 slots filled
      if (emptyIndex === 3) {
        chimeService.playSuccessChime();
        setIsArtworkUnlocked(true);

        // Save to unlocked gallery
        if (!unlockedGallery.includes(currentPuzzle.id)) {
          const nextGallery = [...unlockedGallery, currentPuzzle.id];
          setUnlockedGallery(nextGallery);
          try {
            localStorage.setItem('nesmat_unlocked_puzzles', JSON.stringify(nextGallery));
          } catch {}
        }
      }
    } else {
      chimeService.playBubblePopChime();
      setErrorFeedback('القطعة صحيحة نفسياً، لكن موضعها في التعبير يحتاج ترتيباً سابقاً ليتحقق المعنى المتزن.');
    }
  };

  const handleResetPuzzle = () => {
    initPuzzle(activePuzzleIdx);
  };

  const handleNextPuzzle = () => {
    const next = (activePuzzleIdx + 1) % PUZZLE_CHALLENGES.length;
    setActivePuzzleIdx(next);
  };

  const handleCopyArtwork = () => {
    const text = `${currentPuzzle.artworkTitle}\n\n«${currentPuzzle.restoredMessage}»\n\n— مرممة في لعبة صانع الأنماط من تطبيق نسمة حياة 🌿🎨`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleSaveToJournal = () => {
    storage.addThoughtPost({
      title: currentPuzzle.artworkTitle,
      content: currentPuzzle.restoredMessage,
      category: 'gentleness',
      mood: 'good',
      promptUsed: `ترميم فكرة سلبية: ${currentPuzzle.originalDistortedThought}`,
      isFavorite: true
    });
    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0F1713] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-950/40">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «صانع الأنماط: فك شفرة الأفكار»
                </h2>
                <span className="text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ترميم فني للأفكار التلقائية (CBT)
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                فكك شفرة الفكرة المشوهة، وركّب قطع التعاطف لتصنع لوحة فكرية متزنة تنير معرضك الداخلي 🎨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGalleryView(!showGalleryView)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                showGalleryView 
                  ? 'bg-purple-500 text-black border-purple-400' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-300'
              }`}
              title="معرض اللوحات المرممة"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">معرض اللوحات ({unlockedGallery.length})</span>
            </button>
            <button 
              onClick={handleResetPuzzle}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة المحاولة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery View Overlay */}
        {showGalleryView ? (
          <div className="flex-1 py-4 overflow-y-auto space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>معرض اللوحات الفكرية المرممة</span>
              </h3>
              <span className="text-xs text-stone-400">
                أنجزت {unlockedGallery.length} من {PUZZLE_CHALLENGES.length} لوحات
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PUZZLE_CHALLENGES.map((p, idx) => {
                const isUnlocked = unlockedGallery.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[#16251E] to-[#0E1712] border-emerald-500/40 shadow-lg'
                        : 'bg-white/5 border-dashed border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{isUnlocked ? p.artworkSymbol : '🔒'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-bold">
                        {isUnlocked ? 'مرممة بنجاح ✨' : 'بانتظار الترميم'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white">{p.artworkTitle}</h4>
                    {isUnlocked ? (
                      <p className="text-xs text-emerald-300 mt-1 font-medium leading-relaxed">
                        {p.restoredMessage}
                      </p>
                    ) : (
                      <p className="text-[11px] text-stone-500 mt-1">
                        فك شفرة لغز «{p.distortionType}» لإضاءة هذه اللوحة.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Main Puzzle Game Experience */
          <div className="flex-1 py-3 flex flex-col justify-between overflow-y-auto space-y-3">
            
            {/* Distortion Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-stone-900 to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-md inline-block">
                  نوع التشوه الفكري: {currentPuzzle.distortionType}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-rose-200">
                  الفكرة المشوهة: {currentPuzzle.originalDistortedThought}
                </h3>
              </div>
              <p className="text-[11px] text-stone-400 max-w-xs leading-relaxed">
                {currentPuzzle.distortionExplanation}
              </p>
            </div>

            {/* Puzzle Canvas: Luminous Board */}
            <div 
              className="relative p-5 sm:p-7 rounded-3xl border-2 transition-all duration-700 flex flex-col items-center justify-center text-center overflow-hidden min-h-[200px]"
              style={{
                background: isArtworkUnlocked 
                  ? `radial-gradient(ellipse at center, ${currentPuzzle.artworkPalette.bgFrom}, ${currentPuzzle.artworkPalette.bgTo})` 
                  : 'radial-gradient(ellipse at center, #141C17, #0B100D)',
                borderColor: isArtworkUnlocked 
                  ? currentPuzzle.artworkPalette.accent 
                  : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isArtworkUnlocked 
                  ? `0 0 40px ${currentPuzzle.artworkPalette.glow}` 
                  : 'none'
              }}
            >
              {isArtworkUnlocked ? (
                /* Unlocked Luminous Artwork Screen */
                <div className="space-y-3 animate-fade-in max-w-lg z-10">
                  <div className="text-4xl sm:text-5xl animate-bounce">
                    {currentPuzzle.artworkSymbol}
                  </div>
                  <span className="text-xs font-black text-amber-300 tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 inline-block">
                    {currentPuzzle.artworkTitle}
                  </span>
                  <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed drop-shadow-md">
                    {currentPuzzle.restoredMessage}
                  </p>
                  <div className="flex items-center justify-center pt-1">
                    <TextAudioPlayer
                      text={currentPuzzle.restoredMessage}
                      id={`puzzle_reframe_${currentPuzzle.id}`}
                      variant="inline"
                      label="اسمع الفكرة المرممة"
                    />
                  </div>
                  <span className="text-[11px] text-emerald-300 block font-bold">
                    ✨ حُفظت اللوحة في معرض إنجازاتك الشخصي!
                  </span>
                </div>
              ) : (
                /* Puzzle Frame Slots */
                <div className="w-full space-y-3 z-10">
                  <span className="text-xs font-bold text-stone-400 block mb-2">
                    لوحة الترميم (رتّب ٤ قطع لتوليد الفكرة البديلة):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {placedSlots.map((slotText, sIdx) => (
                      <div
                        key={sIdx}
                        className={`min-h-[55px] p-2.5 rounded-2xl border-2 flex items-center justify-center text-center text-xs font-bold transition-all duration-300 ${
                          slotText
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-md scale-100'
                            : 'bg-white/5 border-dashed border-white/20 text-stone-600 scale-95'
                        }`}
                      >
                        {slotText ? (
                          <span className="leading-snug">{slotText}</span>
                        ) : (
                          <span className="text-[10px] text-stone-500">قطعة {sIdx + 1} 🧩</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error Feedback */}
            {errorFeedback && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs animate-fade-in flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorFeedback}</span>
              </div>
            )}

            {/* Bottom Actions / Piece Bank */}
            {isArtworkUnlocked ? (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0 animate-fade-in">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyArtwork}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 border border-white/15"
                  >
                    {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ اللوحة'}</span>
                  </button>

                  <button
                    onClick={handleSaveToJournal}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-all flex items-center gap-1.5 border border-purple-500/30"
                  >
                    {savedJournalSuccess ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span>{savedJournalSuccess ? 'حُفظت 🌿' : 'حفظ في الدفتر'}</span>
                  </button>
                </div>

                <button
                  onClick={handleNextPuzzle}
                  className="px-4 py-1.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>اللغز التالي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Pieces Bank */
              <div className="space-y-1.5 shrink-0">
                <span className="text-[11px] font-bold text-stone-300 block">
                  اختر القطعة المناسبة تلو الأخرى لبناء الجملة المتزنة:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availablePieces.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => handlePlacePiece(piece)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-purple-950/40 border border-white/10 hover:border-purple-400/50 text-right text-xs font-bold text-stone-200 transition-all active:scale-95 cursor-pointer flex items-center justify-between"
                    >
                      <span className="leading-snug">{piece.text}</span>
                      <span className="text-stone-500 text-[10px] shrink-0 mr-1">➕</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
