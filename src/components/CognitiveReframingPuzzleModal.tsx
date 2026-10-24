/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  Palette, 
  Copy, 
  BookOpen, 
  Image as ImageIcon,
  Heart,
  Search,
  Brain,
  Volume2,
  VolumeX
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';
import { TextAudioPlayer } from './TextAudioPlayer';
import { JigsawPuzzleView } from './puzzles/JigsawPuzzleView';
import { SpotDifferenceView } from './puzzles/SpotDifferenceView';
import { LogicPuzzlesView } from './puzzles/LogicPuzzlesView';

interface PuzzleChallenge {
  id: string;
  originalDistortedThought: string;
  distortionType: string;
  distortionExplanation: string;
  pieces: {
    id: string;
    text: string;
    isCorrect: boolean;
    slotIndex: number;
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
  initialSection?: 'jigsaw' | 'spot' | 'logic' | 'cbt_art';
}> = ({ isOpen, onClose, initialSection = 'jigsaw' }) => {
  // Master Section Tab
  const [activeSection, setActiveSection] = useState<'jigsaw' | 'spot' | 'logic' | 'cbt_art'>(initialSection);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());

  // CBT Reframing Internal State
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

  const initCbtPuzzle = (idx: number) => {
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
      initCbtPuzzle(activePuzzleIdx);
    }
  }, [isOpen, activePuzzleIdx]);

  if (!isOpen) return null;

  const handlePlacePiece = (piece: { id: string; text: string; isCorrect: boolean }) => {
    const emptyIndex = placedSlots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    if (!piece.isCorrect) {
      chimeService.playBubblePopChime();
      const dist = currentPuzzle.distractorPieces.find(d => d.id === piece.id);
      setErrorFeedback(dist?.explanation || 'هذه القطعة تعيدنا إلى الفكر القديم المشوه.');
      return;
    }

    const expectedPiece = currentPuzzle.pieces[emptyIndex];
    if (expectedPiece.id === piece.id) {
      chimeService.playPuzzleSnapChime();
      setErrorFeedback(null);
      const newSlots = [...placedSlots];
      newSlots[emptyIndex] = piece.text;
      setPlacedSlots(newSlots);

      setAvailablePieces(prev => prev.filter(p => p.id !== piece.id));

      if (emptyIndex === 3) {
        chimeService.playSuccessChime();
        setIsArtworkUnlocked(true);

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

  const handleResetCbtPuzzle = () => {
    initCbtPuzzle(activePuzzleIdx);
  };

  const handleNextCbtPuzzle = () => {
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

  const handleToggleMute = () => {
    const next = chimeService.toggleMute();
    setIsMuted(next);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-md animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[900px] bg-[#F7F5EF] dark:bg-[#141C18] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5DED7] dark:border-stone-700">
        
        {/* Master Header */}
        <div className="px-5 py-3.5 bg-white/95 dark:bg-[#1A2520]/95 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#174F3F]/15 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center text-xl shadow-xs">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-emerald-300 font-tajawal">
                  واحة الألغاز التفاعلية الحقيقية
                </h2>
                <span className="text-[10px] bg-[#23785B]/15 text-[#23785B] dark:bg-emerald-500/20 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  ٤ أنماط متنوعة
                </span>
              </div>
              <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
                ألعاب تركيب صور حقيقية، اكتشاف التفاصيل والفروق، والتفكير المنطقي وترميم الأفكار
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="bg-[#E2EFE7]/60 dark:bg-[#1A2520]/60 py-2.5 px-5 border-b border-[#D5DED7] dark:border-stone-800 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveSection('jigsaw')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'jigsaw'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>١. تركيب الصور (Jigsaw)</span>
          </button>

          <button
            onClick={() => setActiveSection('spot')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'spot'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>٢. اكتشاف التفاصيل والفروق</span>
          </button>

          <button
            onClick={() => setActiveSection('logic')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'logic'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <Brain className="w-4 h-4 text-sky-400" />
            <span>٣. المنطق وأعواد الثقاب</span>
          </button>

          <button
            onClick={() => setActiveSection('cbt_art')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'cbt_art'
                ? 'bg-[#174F3F] text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>٤. صانع الأنماط (CBT)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F5EF] dark:bg-[#141C18]">
          <div className="max-w-4xl mx-auto">
            {activeSection === 'jigsaw' && <JigsawPuzzleView />}
            {activeSection === 'spot' && <SpotDifferenceView />}
            {activeSection === 'logic' && <LogicPuzzlesView />}
            
            {/* Section 4: Classic CBT Reframing Art Pieces */}
            {activeSection === 'cbt_art' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white dark:bg-[#1A2520] p-4 rounded-2xl border border-[#D5DED7] dark:border-stone-700">
                  <div>
                    <h3 className="text-sm font-black text-[#174F3F] dark:text-white">
                      ترميم الأفكار المشوهة بالتعاطف الذاتي (CBT)
                    </h3>
                    <p className="text-xs text-[#515B55] dark:text-stone-400">
                      رتبي قطع البدائل المنطقية لتصنعي لوحة فكرية متزنة
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGalleryView(!showGalleryView)}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>معرض اللوحات ({unlockedGallery.length})</span>
                  </button>
                </div>

                {showGalleryView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                    {PUZZLE_CHALLENGES.map((p) => {
                      const isUnlocked = unlockedGallery.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isUnlocked
                              ? 'bg-white dark:bg-stone-900 border-emerald-500/50 shadow-sm'
                              : 'bg-stone-100 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{isUnlocked ? p.artworkSymbol : '🔒'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                              {isUnlocked ? 'مرممة بنجاح ✨' : 'بانتظار الترميم'}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-[#174F3F] dark:text-white">{p.artworkTitle}</h4>
                          {isUnlocked ? (
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-medium leading-relaxed">
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
                ) : (
                  <div className="space-y-4">
                    {/* Distortion banner */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs space-y-1">
                      <span className="font-bold text-[#B78327] block">
                        التشوه الفكري: {currentPuzzle.distortionType}
                      </span>
                      <p className="text-stone-800 dark:text-amber-100 font-black">
                        «{currentPuzzle.originalDistortedThought}»
                      </p>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                        {currentPuzzle.distortionExplanation}
                      </p>
                    </div>

                    {/* Slots or Unlocked Artwork */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1A2520] border-2 border-emerald-500/30 text-center space-y-4 shadow-sm">
                      {isArtworkUnlocked ? (
                        <div className="space-y-3 animate-fade-in max-w-lg mx-auto">
                          <div className="text-4xl animate-bounce">{currentPuzzle.artworkSymbol}</div>
                          <h4 className="text-base font-black text-[#174F3F] dark:text-emerald-300">{currentPuzzle.artworkTitle}</h4>
                          <p className="text-sm font-bold text-stone-800 dark:text-stone-100 leading-relaxed">
                            {currentPuzzle.restoredMessage}
                          </p>
                          <div className="pt-2 flex justify-center gap-2">
                            <button
                              onClick={handleCopyArtwork}
                              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold hover:bg-stone-200 cursor-pointer"
                            >
                              {copiedSuccess ? 'تم النسخ!' : 'نسخ الفكرة'}
                            </button>
                            <button
                              onClick={handleSaveToJournal}
                              className="px-4 py-2 rounded-xl bg-[#23785B] text-white text-xs font-bold hover:bg-[#174F3F] cursor-pointer"
                            >
                              {savedJournalSuccess ? 'حُفظت 🌿' : 'حفظ في الدفتر'}
                            </button>
                            <button
                              onClick={handleNextCbtPuzzle}
                              className="px-4 py-2 rounded-xl bg-[#174F3F] text-white text-xs font-bold hover:bg-[#11382C] cursor-pointer"
                            >
                              التالي ←
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-stone-500 block">
                            لوحة الترميم — اختاري ٤ قطع بالترتيب الصحيح لتوليد الفكرة البديلة:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            {placedSlots.map((slotText, sIdx) => (
                              <div
                                key={sIdx}
                                className={`min-h-[50px] p-2 rounded-xl border-2 flex items-center justify-center text-center text-xs font-bold ${
                                  slotText
                                    ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-[#174F3F] dark:text-emerald-200'
                                    : 'bg-stone-100 dark:bg-stone-800 border-dashed border-stone-300 dark:border-stone-700 text-stone-400'
                                }`}
                              >
                                {slotText || `قطعة ${sIdx + 1}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {errorFeedback && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs">
                        {errorFeedback}
                      </div>
                    )}

                    {!isArtworkUnlocked && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block">
                          القطع المتاحة — انقري لاختيار القطعة التالية:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {availablePieces.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => handlePlacePiece(p)}
                              className="p-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 border border-stone-200 dark:border-stone-700 text-right text-xs font-bold text-stone-800 dark:text-stone-200 transition-all cursor-pointer shadow-xs"
                            >
                              {p.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
