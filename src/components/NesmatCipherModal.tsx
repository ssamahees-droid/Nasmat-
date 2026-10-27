/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Compass, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  Lightbulb, 
  Trophy, 
  Gift, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Flame,
  Shield,
  Star,
  Layers,
  Award
} from 'lucide-react';
import { 
  CIPHER_LEVELS, 
  CIPHER_WORLDS, 
  CIPHER_SECRETS, 
  CipherLevel, 
  SecretItem,
  GRAND_SECRET_SYNTHESIS 
} from '../data/nesmatCipherData';
import { 
  runNesmatCipherGrandStationsTest, 
  runGameJourneyTest,
  runGrandSecretSynthesisTest 
} from '../utils/nesmatCipherTestRunner';
import { CipherSecretModal } from './CipherSecretModal';
import { CipherMap } from './CipherMap';
import { nesmaCipherStorage } from '../utils/nesmaCipherStorage';
import { SequenceOrderBoard } from './cipher/SequenceOrderBoard';
import { CipherWheelStation } from './cipher/CipherWheelStation';
import { LetterTileScramble } from './cipher/LetterTileScramble';
import { LabyrinthPathBoard } from './cipher/LabyrinthPathBoard';
import { MissingPieceBoard } from './cipher/MissingPieceBoard';
import { BurdenEliminationBoard } from './cipher/BurdenEliminationBoard';
import { chimeService } from '../services/chimeService';
import { GameInstructionsModal } from './GameInstructionsModal';
import { GAME_EXPLANATIONS } from '../data/appExplanations';

interface NesmatCipherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NesmatCipherModal: React.FC<NesmatCipherModalProps> = ({ isOpen, onClose }) => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  // Game progression & storage state
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    return nesmaCipherStorage.getCompletedLevels();
  });

  const [currentSelectedLevelId, setCurrentSelectedLevelId] = useState<number>(() => {
    const saved = nesmaCipherStorage.getCompletedLevels();
    if (saved.length > 0) {
      const next = Math.max(...saved) + 1;
      return next <= 30 ? next : 30;
    }
    return 1;
  });

  const [unlockedSecrets, setUnlockedSecrets] = useState<string[]>(() => {
    const list: string[] = [];
    const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
    if (maxCompleted >= 5) list.push('secret_1');
    if (maxCompleted >= 15) list.push('secret_2');
    if (maxCompleted >= 25) list.push('secret_3');
    return list;
  });

  const [solvedSecrets, setSolvedSecrets] = useState<string[]>(() => {
    return nesmaCipherStorage.getSolvedSecrets();
  });

  const [grandSecretSolved, setGrandSecretSolved] = useState<boolean>(() => {
    return nesmaCipherStorage.isGrandSecretSolved();
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return nesmaCipherStorage.isSoundEnabled();
  });

  // Active view tab: 'map' | 'level' | 'secrets' | 'cabinet' | 'grand_secret'
  const [activeTab, setActiveTab] = useState<'map' | 'level' | 'secrets' | 'cabinet' | 'grand_secret'>('map');
  const [selectedWorldId, setSelectedWorldId] = useState<1 | 2 | 3>(1);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testModalTab, setTestModalTab] = useState<'stations' | 'grand' | 'journey'>('stations');

  // Level play state
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [hintTier, setHintTier] = useState<number>(0);
  const [levelStatus, setLevelStatus] = useState<'playing' | 'success' | 'retry'>('playing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [interactiveMode, setInteractiveMode] = useState<boolean>(true);

  const handleSound = (type: 'click' | 'snap' | 'success') => {
    if (!soundEnabled) return;
    if (type === 'click') chimeService.playBubblePopChime();
    else if (type === 'snap') chimeService.playPuzzleSnapChime();
    else if (type === 'success') chimeService.playSuccessChime();
  };

  const handleInteractiveSolve = (answer: string) => {
    setUserAnswer(answer);
    setLevelStatus('success');
    if (!completedLevels.includes(activeLevel.id)) {
      const updated = [...completedLevels, activeLevel.id];
      setCompletedLevels(updated);
    }
    setToastMessage('إجابة صحيحة وموفقة جداً! 🌟');
  };

  // Secret Discovery Modal state
  const [selectedSecretForModal, setSelectedSecretForModal] = useState<SecretItem | null>(null);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState<boolean>(false);

  // Grand Secret Synthesis State
  const [selectedGrandOption, setSelectedGrandOption] = useState<number | null>(null);
  const [grandFeedbackError, setGrandFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    nesmaCipherStorage.saveCompletedLevels(completedLevels);
    const maxC = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
    const newSecrets: string[] = [];
    if (maxC >= 5) newSecrets.push('secret_1');
    if (maxC >= 15) newSecrets.push('secret_2');
    if (maxC >= 25) newSecrets.push('secret_3');
    setUnlockedSecrets(newSecrets);
  }, [completedLevels]);

  useEffect(() => {
    nesmaCipherStorage.saveSolvedSecrets(solvedSecrets);
  }, [solvedSecrets]);

  useEffect(() => {
    nesmaCipherStorage.setGrandSecretSolved(grandSecretSolved);
  }, [grandSecretSolved]);

  useEffect(() => {
    nesmaCipherStorage.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  if (!isOpen) return null;

  const activeLevel: CipherLevel = CIPHER_LEVELS.find(l => l.id === currentSelectedLevelId) || CIPHER_LEVELS[0];
  const activeWorld = CIPHER_WORLDS.find(w => w.id === activeLevel.worldId) || CIPHER_WORLDS[0];
  const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
  const isGameFinished = maxCompleted >= 30;

  const handleSelectLevel = (lvlId: number) => {
    if (lvlId <= maxCompleted + 1) {
      setCurrentSelectedLevelId(lvlId);
      setUserAnswer('');
      setHintTier(0);
      setLevelStatus('playing');
      setActiveTab('level');
    } else {
      setToastMessage('أكملي المراحل السابقة أولاً لتفتحي هذه المحطة 🔒');
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      setToastMessage('يرجى كتابة أو اختيار الإجابة أولاً.');
      return;
    }

    const correct = String(activeLevel.puzzleData.correctAnswer).trim().toLowerCase();
    const given = userAnswer.trim().toLowerCase();

    if (given === correct || given.includes(correct) || correct.includes(given)) {
      handleSound('success');
      setLevelStatus('success');
      if (!completedLevels.includes(activeLevel.id)) {
        const updated = [...completedLevels, activeLevel.id];
        setCompletedLevels(updated);
      }
      setToastMessage('إجابة صحيحة وموفقة جداً! 🌟');
    } else {
      handleSound('click');
      setLevelStatus('retry');
      setToastMessage('محاولة دافئة.. فكري مجدداً أو استعيني بتلميحات بوصلة نسمة 🍃');
    }
  };

  const handleNextLevel = () => {
    handleSound('snap');
    if (currentSelectedLevelId < 30) {
      const nextId = currentSelectedLevelId + 1;
      setCurrentSelectedLevelId(nextId);
      setUserAnswer('');
      setHintTier(0);
      setLevelStatus('playing');
    } else {
      setActiveTab('map');
      setToastMessage('لقد أكملتِ جميع مراحل شفرة نسمة بنجاح تام! 🎉');
    }
  };

  const handleOpenSecret = (secretId: string) => {
    const sec = CIPHER_SECRETS.find(s => s.id === secretId);
    if (sec) {
      setSelectedSecretForModal(sec);
      setIsSecretModalOpen(true);
    }
  };

  const handleCloseSecret = () => {
    setIsSecretModalOpen(false);
    setSelectedSecretForModal(null);
  };

  const handleSolveSecret = (secretId: string) => {
    if (!solvedSecrets.includes(secretId)) {
      const updated = [...solvedSecrets, secretId];
      setSolvedSecrets(updated);
      const sec = CIPHER_SECRETS.find(s => s.id === secretId);
      setToastMessage(`تهانينا! لقد اكتشفتِ سر «${sec?.name || secretId}» وحصلتِ على مقتناه وشظيته ✨`);
    }
  };

  const handleVerifyGrandSecret = () => {
    setGrandFeedbackError(null);
    if (selectedGrandOption === null) {
      setGrandFeedbackError('يرجى اختيار العبارة التي تجسد تركيب المعاني الثلاثة أولاً.');
      return;
    }

    if (selectedGrandOption === GRAND_SECRET_SYNTHESIS.correctAnswerIndex) {
      setGrandSecretSolved(true);
      setToastMessage('🎉 مبارك! لقد جمعتِ الخيوط الثلاثة واكتملت لديكِ تميمة السكينة الجامعة!');
    } else {
      setGrandFeedbackError('محاولة دافئة.. تأملي كيف يجتمع الرفق وصون الحدود والمراقبة الهادئة معاً لصنع سلام الحاضر.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[880px] bg-[#F7F5EF] dark:bg-[#141C18] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5DED7] dark:border-stone-700">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-white/95 dark:bg-[#1A2520]/95 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#174F3F]/15 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center text-xl shadow-xs">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-emerald-300">
                  شفرة نسمة — حلّ اللغز واكتشف اللي جواك
                </h2>
                <span className="text-[10px] bg-[#23785B]/15 text-[#23785B] dark:bg-emerald-500/20 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  {completedLevels.length} / 30 مرحلة
                </span>
                {solvedSecrets.length > 0 && (
                  <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                    {solvedSecrets.length} / 3 أسرار
                  </span>
                )}
              </div>
              <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
                مغامرة تفاعلية هادئة لتفكيك الأفكار واكتشاف المعاني النفسية بوعي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstructionsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/30"
              title="طريقة اللعب وقواعد شفرة نسمة"
            >
              <span>طريقة اللعب</span>
              <span>💡</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="إغلاق اللعبة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#E2EFE7]/50 dark:bg-[#1A2520]/60 py-2 px-5 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-[#174F3F] text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>خريطة العوالم</span>
            </button>

            {completedLevels.length > 0 && (
              <button
                onClick={() => setActiveTab('level')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'level'
                    ? 'bg-[#174F3F] text-white shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>المرحلة الحالية ({currentSelectedLevelId})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('secrets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'secrets'
                  ? 'bg-[#174F3F] text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>الأسرار المخفية ({solvedSecrets.length}/3)</span>
            </button>

            <button
              onClick={() => setActiveTab('cabinet')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cabinet'
                  ? 'bg-[#174F3F] text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-[#515B55] dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>خزانة المعاني</span>
            </button>

            {isGameFinished && (
              <button
                onClick={() => setActiveTab('grand_secret')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'grand_secret'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>السر الأعظم 🌟</span>
              </button>
            )}

            <button
              onClick={() => setShowTestModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>🧪 اختبار القبول</span>
            </button>
          </div>
        </div>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="bg-[#F8EED8] dark:bg-amber-950 border-b border-[#B78327]/30 px-5 py-2.5 flex items-center justify-between text-xs text-[#292F2B] dark:text-amber-200 font-bold shrink-0 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B78327]" />
              <span>{toastMessage}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F5EF] dark:bg-[#141C18]">
          <AnimatePresence mode="wait">
            {/* TAB 1: MAP VIEW */}
            {activeTab === 'map' && (
              <motion.div
                key="cipher-tab-map"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 max-w-3xl mx-auto"
              >
              <CipherMap
                completedLevels={completedLevels}
                currentSelectedLevelId={currentSelectedLevelId}
                selectedWorldId={selectedWorldId}
                onSelectWorld={setSelectedWorldId}
                onSelectLevel={handleSelectLevel}
                onOpenSecret={handleOpenSecret}
                solvedSecrets={solvedSecrets}
              />

              {/* End game notification banners */}
              {isGameFinished && (
                solvedSecrets.length === 3 ? (
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-amber-500/20 border-2 border-amber-400/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        🌟
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-[#174F3F] dark:text-amber-300">
                          اكتملت الشظايا الثلاث (3 / 3) — السر الأعظم بانتظارك!
                        </h4>
                        <p className="text-xs text-[#515B55] dark:text-stone-300 mt-0.5">
                          لقد عثرتِ على ندى البدايات ومخطوطة الحدود وبلورة المراقب. حان وقت تركيب المعنى الشامل.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('grand_secret')}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all cursor-pointer shadow-md shrink-0 animate-pulse"
                    >
                      تركيب السر الأعظم 🔓
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#E2EFE7]/80 dark:bg-emerald-950/60 border border-[#23785B]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fade-in">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🌿</span>
                      <div>
                        <span className="font-extrabold text-[#174F3F] dark:text-emerald-300 block">
                          أتممتِ مسار المراحل الثلاثين بنجاح وسلام!
                        </span>
                        <span className="text-stone-600 dark:text-stone-300 text-[11px]">
                          تذكري أن هناك أسراراً اختيارية في العوالم السابقة ({solvedSecrets.length} من 3). يمكنك العودة إليها متى رغبتِ في اكتشافها برفق.
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('secrets')}
                      className="px-4 py-2 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white font-bold shrink-0 cursor-pointer text-xs"
                    >
                      استعراض الأسرار ({solvedSecrets.length}/3)
                    </button>
                  </div>
                )
              )}
            </motion.div>
          )}

            {/* TAB 2: LEVEL PLAY VIEW */}
            {activeTab === 'level' && activeLevel && (
              <motion.div
                key={`cipher-tab-level-${activeLevel.id}`}
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl mx-auto space-y-6"
              >
              
              {/* Header */}
              <div className="flex items-center justify-between bg-white dark:bg-[#1A2520] p-4 rounded-2xl border border-[#D5DED7] dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#174F3F] text-white px-2.5 py-1 rounded-xl">
                    المرحلة {activeLevel.id} من 30
                  </span>
                  <span className="text-xs text-[#515B55] dark:text-stone-300 font-medium">
                    {activeWorld.name}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-xs font-bold text-[#23785B] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  ← العودة للخريطة
                </button>
              </div>

              {/* Story & Companion Card */}
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E2EFE7] dark:bg-emerald-950 text-[#174F3F] dark:text-emerald-300 flex items-center justify-center font-black shrink-0 text-lg shadow-inner">
                    🌿
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#B78327]">
                      بوصلة نسمة — المرشد المرافق
                    </span>
                    <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 leading-relaxed font-medium">
                      {activeLevel.companionIntro}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] dark:bg-[#121A16] border border-[#D5DED7] dark:border-stone-700 text-xs text-[#515B55] dark:text-stone-300 leading-relaxed space-y-2">
                  <div>
                    <span className="font-bold text-[#174F3F] dark:text-emerald-400 block mb-1">
                      📖 الفصل القصصي:
                    </span>
                    {activeLevel.storyChapter}
                  </div>
                  {activeLevel.narrativeIntro && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 italic font-medium">
                      ✨ {activeLevel.narrativeIntro}
                    </div>
                  )}
                </div>
              </div>

              {/* Puzzle Card */}
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border-2 border-[#23785B]/30 shadow-md space-y-5">
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 bg-[#23785B]/15 text-[#23785B] dark:bg-emerald-500/20 dark:text-emerald-300 rounded-full">
                      تحدي اللغز #{activeLevel.id}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      {activeLevel.puzzleType === 'logical_sequence' || activeLevel.puzzleType === 'event_ordering'
                        ? '🔄 ترتيب متسلسل'
                        : activeLevel.puzzleType === 'cipher_decode'
                        ? '🔐 فك شفرة'
                        : activeLevel.puzzleType === 'word_scramble'
                        ? '🔤 تجميع حروف'
                        : activeLevel.puzzleType === 'maze_path'
                        ? '🌿 متاهة ومسار'
                        : activeLevel.puzzleType === 'missing_piece' || activeLevel.puzzleType === 'visual_pattern'
                        ? '🧩 القطعة الناقصة'
                        : '⚖️ تخفيف الأعباء'}
                    </span>
                  </div>

                  {/* Mode switch */}
                  <button
                    type="button"
                    onClick={() => {
                      setInteractiveMode(!interactiveMode);
                      handleSound('click');
                    }}
                    className="text-xs font-bold text-[#23785B] dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{interactiveMode ? '⚡ النمط المساعد' : '🎮 اللوحة التفاعلية'}</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-white mt-1">
                    {activeLevel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 mt-1 leading-relaxed">
                    {activeLevel.puzzleData.prompt}
                  </p>
                </div>

                {/* Interactive Boards Dispatch */}
                {interactiveMode && levelStatus !== 'success' ? (
                  <div className="pt-2">
                    {(activeLevel.puzzleType === 'logical_sequence' || activeLevel.puzzleType === 'event_ordering') && (
                      <SequenceOrderBoard
                        level={activeLevel}
                        onSolve={handleInteractiveSolve}
                        isSolved={false}
                        onSound={handleSound}
                      />
                    )}
                    {activeLevel.puzzleType === 'cipher_decode' && (
                      <CipherWheelStation
                        level={activeLevel}
                        onSolve={handleInteractiveSolve}
                        isSolved={false}
                        onSound={handleSound}
                      />
                    )}
                    {activeLevel.puzzleType === 'word_scramble' && (
                      <LetterTileScramble
                        level={activeLevel}
                        onSolve={handleInteractiveSolve}
                        isSolved={false}
                        onSound={handleSound}
                      />
                    )}
                    {activeLevel.puzzleType === 'maze_path' && (
                      <LabyrinthPathBoard
                        level={activeLevel}
                        onSolve={handleInteractiveSolve}
                        isSolved={false}
                        onSound={handleSound}
                      />
                    )}
                    {(activeLevel.puzzleType === 'missing_piece' || activeLevel.puzzleType === 'visual_pattern') && (
                      <MissingPieceBoard
                        level={activeLevel}
                        onSolve={handleInteractiveSolve}
                        isSolved={false}
                        onSound={handleSound}
                      />
                    )}
                    {(activeLevel.puzzleType === 'probability_elimination' || activeLevel.puzzleType === 'composite_challenge' || activeLevel.puzzleType === 'hidden_clues') && (
                      <BurdenEliminationBoard
                        level={activeLevel}
                        onSolve={handleInteractiveSolve}
                        isSolved={false}
                        onSound={handleSound}
                      />
                    )}
                  </div>
                ) : (
                  /* Classic Accessible Mode */
                  <div className="space-y-4">
                    {activeLevel.puzzleData.options ? (
                      <div className="space-y-2.5">
                        {activeLevel.puzzleData.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleSound('click');
                              setUserAnswer(opt);
                            }}
                            className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                              userAnswer === opt
                                ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-sm'
                                : 'bg-[#F7F5EF] dark:bg-stone-800 text-[#292F2B] dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-[#23785B]'
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${userAnswer === opt ? 'bg-white text-[#174F3F]' : 'border-stone-400'}`}>
                              {userAnswer === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#174F3F]" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="اكتبي إجابتك هنا..."
                          className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] dark:bg-stone-800 border border-[#D5DED7] dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#23785B]"
                        />
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!userAnswer.trim() || levelStatus === 'success'}
                        className="px-6 py-3 rounded-2xl bg-[#174F3F] hover:bg-[#11382C] text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        تحقق من الحل 🔍
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-stone-500 font-medium">
                    {levelStatus === 'playing' ? 'تأملي عناصر اللغز بهدوء...' : ''}
                  </div>

                  <button
                    onClick={() => {
                      handleSound('click');
                      setHintTier(prev => (prev < 3 ? prev + 1 : prev));
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>تلميح بوصلة نسمة ({hintTier}/3)</span>
                  </button>
                </div>

                {hintTier > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-fade-in">
                    <span className="font-bold block text-[11px] text-amber-700 dark:text-amber-400">
                      💡 تلميح رقم {hintTier} ({hintTier === 1 ? 'توجيه عام' : hintTier === 2 ? 'فكرة كاشفة' : 'كشف الحل المباشر'}):
                    </span>
                    <p className="leading-relaxed">
                      {activeLevel.puzzleData.hints[hintTier - 1]}
                    </p>
                  </div>
                )}

                {/* Level Success Card */}
                <AnimatePresence>
                  {levelStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -12 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="p-5 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950/80 border border-[#23785B]/40 text-[#174F3F] dark:text-emerald-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-[#B78327]" />
                          <h4 className="font-extrabold text-base">
                            {activeLevel.psychologicalTakeaway.title}
                          </h4>
                        </div>
                        
                        {/* Stars badge */}
                        <div className="flex items-center gap-1 text-amber-500 bg-white/70 dark:bg-stone-800/70 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs">
                          <Star className={`w-3.5 h-3.5 ${hintTier <= 2 ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`} />
                          <Star className={`w-3.5 h-3.5 ${hintTier <= 1 ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`} />
                          <Star className={`w-3.5 h-3.5 ${hintTier === 0 ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`} />
                          <span className="text-[10px] text-stone-700 dark:text-stone-200 mr-1">
                            {hintTier === 0 ? '٣ نجوم' : hintTier <= 2 ? 'نجمتان' : 'نجمة واحدة'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed font-medium">
                        {activeLevel.psychologicalTakeaway.message}
                      </p>
                      {activeLevel.narrativeOutro && (
                        <p className="text-xs text-[#174F3F] dark:text-emerald-300 pt-2 border-t border-emerald-500/20 italic font-medium">
                          🌿 {activeLevel.narrativeOutro}
                        </p>
                      )}

                      {/* Stage 30 Special Synthesis or Gentle Guide */}
                      {activeLevel.id === 30 ? (
                        solvedSecrets.length === 3 ? (
                          <div className="mt-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-400 text-amber-950 dark:text-amber-200 space-y-2">
                            <div className="flex items-center gap-2 font-black text-xs text-amber-800 dark:text-amber-300">
                              <Sparkles className="w-4 h-4" />
                              <span>اكتملت شظايا الأسرار الثلاثة!</span>
                            </div>
                            <p className="text-xs leading-relaxed">
                              لقد جمعتِ ندى البدايات ومخطوطة الحدود وبلورة المراقب. تحدي «السر الأعظم» متاح لكِ الآن لتركيب المعنى الشامل لسكينتكِ.
                            </p>
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => setActiveTab('grand_secret')}
                                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                              >
                                الانتقال إلى السر الأعظم 🌟
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 p-4 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 space-y-2">
                            <p className="text-xs leading-relaxed font-medium">
                              🌿 مبارك إتمام الرحلة الأساسية لشفرة نسمة بنجاح تام! تذكري أن عوالم الحديقة والمكتبة والكهف تحتفظ بأسرار دافئة ({solvedSecrets.length} من 3). يمكنكِ العودة للخريطة متى رغبتِ في اكتشافها برفق وبلا أي استعجال.
                            </p>
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => setActiveTab('map')}
                                className="px-4 py-2 rounded-xl bg-[#174F3F] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                              >
                                العودة لخريطة العوالم 🗺️
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="pt-2 flex items-center justify-end">
                          <button
                            onClick={handleNextLevel}
                            className="px-5 py-2.5 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <span>المرحلة التالية</span>
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {levelStatus === 'retry' && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs font-medium animate-fade-in">
                    محاولة دافئة! اقرئي التلميح أعلى أو جربي خياراً آخر برفق.
                  </div>
                )}

              </div>

            </motion.div>
          )}

          {/* TAB 3: SECRETS VIEW */}
          {activeTab === 'secrets' && (
            <motion.div
              key="cipher-tab-secrets"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#174F3F] dark:text-white flex items-center gap-2">
                    <span>🎁 الأسرار الثلاثة المخفية في رحلة نسمة</span>
                  </h3>
                  <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-3 py-1 rounded-full">
                    المكتشف: {solvedSecrets.length} / 3
                  </span>
                </div>
                <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed">
                  تُفتح هذه الأسرار تدريجياً في عوالم الحديقة والمكتبة والكهف. تفاعلي مع لغز الاكتشاف لكل سر لتجمعي شظايا السكينة وتفتحي السر الأعظم.
                </p>
              </div>

              <div className="space-y-4">
                {CIPHER_SECRETS.map(sec => {
                  const isUnlocked = unlockedSecrets.includes(sec.id);
                  const isSolved = solvedSecrets.includes(sec.id);

                  return (
                    <div 
                      key={sec.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isSolved
                          ? 'bg-[#E2EFE7]/50 dark:bg-emerald-950/30 border-[#23785B] shadow-sm'
                          : isUnlocked 
                          ? 'bg-white dark:bg-[#1A2520] border-amber-400/70 shadow-sm' 
                          : 'bg-stone-100 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
                            {sec.icon}
                          </div>
                          <div>
                            <h4 className="text-base font-black text-[#174F3F] dark:text-white">
                              {sec.name}
                            </h4>
                            <span className="text-[11px] font-bold text-[#B78327] block">
                              {sec.puzzleTitle}
                            </span>
                            <p className="text-xs text-[#515B55] dark:text-stone-300 mt-1 leading-relaxed">
                              {sec.description}
                            </p>
                          </div>
                        </div>

                        {isSolved ? (
                          <span className="text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-full shrink-0">
                            مكتشف ومتأمل ✨
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded-full shrink-0 animate-pulse">
                            متاح للاكتشاف 🌟
                          </span>
                        ) : (
                          <span className="text-xs px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold rounded-full flex items-center gap-1 shrink-0">
                            <Lock className="w-3.5 h-3.5" /> مقفل
                          </span>
                        )}
                      </div>

                      {/* Solved collectible card */}
                      {isSolved && (
                        <div className="mt-4 p-3.5 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-emerald-500/20 space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 font-bold text-[#174F3F] dark:text-emerald-300">
                            <span>🎁 المقتنى: {sec.collectibleItem}</span>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px]">
                            {sec.keystonePiece}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
                        {isUnlocked && (
                          <button
                            onClick={() => handleOpenSecret(sec.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                              isSolved
                                ? 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200'
                                : 'bg-[#174F3F] hover:bg-[#11382C] text-white shadow-sm'
                            }`}
                          >
                            {isSolved ? 'عرض تفاصيل السر 🔍' : 'ابدأ لغز الاكتشاف 🔍'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grand Secret Status Link */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#1A2520] border border-[#D5DED7] dark:border-stone-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl shrink-0">
                    🌟
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#174F3F] dark:text-white">
                      شظايا السر الأعظم ({solvedSecrets.length} / 3)
                    </h4>
                    <p className="text-xs text-[#515B55] dark:text-stone-300">
                      {solvedSecrets.length === 3 
                        ? 'اكتملت الشظايا الثلاث! يمكنكِ الآن تركيب السر الأعظم.' 
                        : 'اكتشفي أسرار العوالم الثلاثة لتفتحي السر الأعظم في نهاية الرحلة.'}
                    </p>
                  </div>
                </div>

                {isGameFinished && solvedSecrets.length === 3 && (
                  <button
                    onClick={() => setActiveTab('grand_secret')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    الانتقال للسر الأعظم 🌟
                  </button>
                )}
              </div>
            </motion.div>
          )}

            {/* TAB 4: CABINET VIEW */}
            {activeTab === 'cabinet' && (
              <motion.div
                key="cipher-tab-cabinet"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl mx-auto space-y-6"
              >
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-2">
                <h3 className="text-lg font-black text-[#174F3F] dark:text-white flex items-center gap-2">
                  <span>📖 خزانة المعاني والمقتنيات النفسية</span>
                </h3>
                <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed">
                  كل مرحلة وسر أكملتِه أضاف درساً ومقتنى فريداً إلى خزانتكِ ليظل رفيقاً لسلامكِ الداخلي.
                </p>
              </div>

              {/* Discovered Secrets Showcase */}
              {solvedSecrets.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 p-5 rounded-3xl border border-amber-300 dark:border-amber-800 space-y-3">
                  <div className="flex items-center gap-2 font-black text-xs text-[#174F3F] dark:text-amber-300">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>مقتنيات الأسرار وشظايا السكينة المكتشفة ({solvedSecrets.length} / 3)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CIPHER_SECRETS.filter(s => solvedSecrets.includes(s.id)).map(sec => (
                      <div key={sec.id} className="p-3 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-1 text-center">
                        <span className="text-2xl block">{sec.icon}</span>
                        <h5 className="text-xs font-bold text-[#174F3F] dark:text-white">
                          {sec.collectibleItem}
                        </h5>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400">
                          {sec.keystoneMeaning}
                        </p>
                      </div>
                    ))}
                  </div>

                  {grandSecretSolved && (
                    <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-center space-y-1.5 animate-fade-in mt-3">
                      <span className="text-xs font-black text-amber-800 dark:text-amber-200 block">
                        👑 {GRAND_SECRET_SYNTHESIS.finalRevelation.amuletName}
                      </span>
                      <p className="text-xs text-amber-900 dark:text-amber-100 font-bold">
                        {GRAND_SECRET_SYNTHESIS.finalRevelation.goldenMotto}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Levels Takeaways Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CIPHER_LEVELS.filter(l => completedLevels.includes(l.id)).map(lvl => (
                  <div key={lvl.id} className="bg-white dark:bg-[#1A2520] p-5 rounded-2xl border border-[#D5DED7] dark:border-stone-700 space-y-2 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#23785B] dark:text-emerald-400">
                        محطة #{lvl.id} · {lvl.title}
                      </span>
                      <h4 className="text-sm font-black text-[#174F3F] dark:text-white mt-1">
                        {lvl.psychologicalTakeaway.title}
                      </h4>
                      <p className="text-xs text-[#515B55] dark:text-stone-300 mt-2 leading-relaxed">
                        {lvl.psychologicalTakeaway.message}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
                      <span>مكتسب بنجاح ✨</span>
                      <span>نسمة حياة</span>
                    </div>
                  </div>
                ))}

                {completedLevels.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-stone-500 text-sm">
                    لم تكملي أي مرحلة بعد. ابدئي اللعب من الخريطة لتتجمع اقتباساتك هنا! 🌿
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 5: GRAND SECRET (Phase 8 Synthesis) */}
          {activeTab === 'grand_secret' && (
            <motion.div
              key="cipher-tab-grand-secret"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto space-y-6"
            >
              
              {/* Header Lore */}
              <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-[#121A16] p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 text-white shadow-xl space-y-5 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl shadow-inner">
                  🌟
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-amber-300">
                    {GRAND_SECRET_SYNTHESIS.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-400/80">
                    {GRAND_SECRET_SYNTHESIS.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto pt-2">
                    {GRAND_SECRET_SYNTHESIS.lore}
                  </p>
                </div>

                {/* 3 Keystones Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-right">
                  {CIPHER_SECRETS.map(sec => {
                    const isCollected = solvedSecrets.includes(sec.id);
                    return (
                      <div 
                        key={sec.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                          isCollected
                            ? 'bg-amber-500/20 border-amber-400/70 text-amber-100'
                            : 'bg-stone-800/50 border-stone-700 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{sec.icon}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCollected ? 'bg-amber-400/30 text-amber-300' : 'bg-stone-700 text-stone-400'
                          }`}>
                            {isCollected ? 'مكتشفة ✓' : 'مفقودة'}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-white">
                          {sec.collectibleItem}
                        </h5>
                        <p className="text-[10px] leading-relaxed line-clamp-2">
                          {isCollected ? sec.keystonePiece : sec.discoveryHint}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Synthesis Challenge OR Missing Secrets Guidance */}
              {solvedSecrets.length === 3 ? (
                !grandSecretSolved ? (
                  <div className="bg-white dark:bg-[#1A2520] p-6 sm:p-7 rounded-3xl border-2 border-amber-400 shadow-md space-y-5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">
                        تحدي التركيب الختامي:
                      </span>
                      <h4 className="text-base font-extrabold text-[#174F3F] dark:text-white">
                        {GRAND_SECRET_SYNTHESIS.prompt}
                      </h4>
                      <p className="text-xs text-[#515B55] dark:text-stone-300">
                        اجمعي الخيوط الثلاثة باختيار العبارة التي تعبر عن التناغم الكامل لرحلتك:
                      </p>
                    </div>

                    <div className="space-y-3">
                      {GRAND_SECRET_SYNTHESIS.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGrandOption(idx)}
                          className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                            selectedGrandOption === idx
                              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                              : 'bg-[#F7F5EF] dark:bg-stone-800 text-[#292F2B] dark:text-stone-200 border-[#D5DED7] dark:border-stone-700 hover:border-amber-500'
                          }`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 ${
                            selectedGrandOption === idx ? 'bg-white text-amber-600' : 'border-stone-400'
                          }`}>
                            {selectedGrandOption === idx && <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {grandFeedbackError && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-medium animate-fade-in">
                        {grandFeedbackError}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleVerifyGrandSecret}
                        className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all cursor-pointer shadow-md"
                      >
                        تركيب شفرة السر الأعظم 🔓
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Grand Finale Scene when solved */
                  <div className="bg-gradient-to-br from-amber-900/90 via-stone-900 to-[#141816] p-7 rounded-3xl border-2 border-amber-400/80 text-white shadow-2xl space-y-6 animate-fade-in text-center">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 mx-auto flex items-center justify-center text-4xl shadow-inner">
                      👑
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                        اكتمل التحام الخيوط الثلاثة
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-amber-200">
                        {GRAND_SECRET_SYNTHESIS.finalRevelation.amuletName}
                      </h4>
                      <p className="text-xs text-stone-300">
                        {GRAND_SECRET_SYNTHESIS.finalRevelation.amuletDescription}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-amber-500/40 text-right space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Sparkles className="w-4 h-4" />
                        <span>رسالة بوصلة نسمة الختامية:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                        {GRAND_SECRET_SYNTHESIS.finalRevelation.narrativeEpilogue}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-500/20 border-2 border-amber-400/80 text-center space-y-2">
                      <span className="text-[11px] font-bold text-amber-300 block">
                        الرسالة الجامعة لرحلة «نسمة حياة»:
                      </span>
                      <p className="text-sm sm:text-base font-extrabold text-amber-100 leading-relaxed">
                        {GRAND_SECRET_SYNTHESIS.finalRevelation.goldenMotto}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={() => setActiveTab('cabinet')}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black cursor-pointer shadow-md"
                      >
                        عرض في خزانة المعاني 📖
                      </button>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold cursor-pointer"
                      >
                        العودة للخريطة 🗺️
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Gentle Guidance when < 3 secrets found */
                <div className="bg-white dark:bg-[#1A2520] p-6 sm:p-7 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950 text-[#174F3F] dark:text-emerald-300 flex items-center justify-center text-xl shrink-0">
                      🌿
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#174F3F] dark:text-white">
                        رحلتكِ الأساسية مكتملة بسلام!
                      </h4>
                      <p className="text-xs text-[#515B55] dark:text-stone-300 mt-0.5">
                        لقد أنجزتِ جميع مراحل اللعبة الأساسية الثلاثين.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 leading-relaxed font-medium">
                    «السر الأعظم» هو خاتمة تأملية اختيارية تلتحم فيها أسرار العوالم الثلاثة: ندى البدايات (الحديقة)، ومخطوطة الحدود (المكتبة)، وبلورة المراقب (الكهف). يمكنكِ العودة لخريطة العوالم في أي وقت لاستكشاف الأسرار المتبقية برفق ودون أي استعجال.
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab('map')}
                      className="px-5 py-2.5 rounded-xl bg-[#174F3F] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      العودة لخريطة العوالم 🗺️
                    </button>
                  </div>
                </div>
              )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Discovery Puzzle Modal for Secrets */}
      <CipherSecretModal
        isOpen={isSecretModalOpen}
        secret={selectedSecretForModal}
        onClose={handleCloseSecret}
        onSolve={handleSolveSecret}
        isSolved={selectedSecretForModal ? solvedSecrets.includes(selectedSecretForModal.id) : false}
      />

      {/* Comprehensive Test Report Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-cairo" dir="rtl">
          <div className="bg-white dark:bg-[#1A2520] border border-[#D5DED7] dark:border-stone-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B78327]" />
                <h3 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-white">
                  لوحة اختبار القبول والتحقق الداخلي
                </h3>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Test Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3 text-xs font-bold">
              <button
                onClick={() => setTestModalTab('stations')}
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  testModalTab === 'stations' ? 'bg-[#174F3F] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                المحطات الكبرى (10، 20، 30)
              </button>
              <button
                onClick={() => setTestModalTab('grand')}
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  testModalTab === 'grand' ? 'bg-[#174F3F] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                السر الأعظم (مسارا النهاية)
              </button>
              <button
                onClick={() => setTestModalTab('journey')}
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  testModalTab === 'journey' ? 'bg-[#174F3F] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                محاكاة رحلة المرحلة 10
              </button>
            </div>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {/* Tab 1: Grand Stations */}
              {testModalTab === 'stations' && (
                <div className="space-y-3">
                  {runNesmatCipherGrandStationsTest().map(res => (
                    <div key={res.levelId} className="p-4 rounded-2xl bg-[#F7F5EF] dark:bg-[#121A16] border border-[#D5DED7] dark:border-stone-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#174F3F] text-white">
                          المحطة الكبرى #{res.levelId} ({res.title})
                        </span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {res.passed ? '✅ اجتاز الاختبار بنجاح' : '❌ يحتاج مراجعة'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300">
                        <strong>الإجابة:</strong> {res.expectedAnswer}
                      </p>
                      <p className="text-xs text-stone-700 dark:text-stone-300">
                        <strong>المقولة النفسية:</strong> «{res.takeawayTitle}»: {res.takeawayMessage}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Grand Secret & End Paths */}
              {testModalTab === 'grand' && (() => {
                const grandRes = runGrandSecretSynthesisTest();
                return (
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950/70 border border-[#23785B]/40 space-y-2">
                      <div className="flex items-center justify-between font-black text-[#174F3F] dark:text-emerald-300">
                        <span>المسار (أ): إكمال 30 مرحلة مع جميع الأسرار الثلاثة</span>
                        <span>{grandRes.pathA_fullSecrets.passed ? '✅ ناجح' : '❌'}</span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {grandRes.pathA_fullSecrets.details}
                      </p>
                      <div className="text-[11px] text-[#23785B] dark:text-emerald-400 font-bold space-y-0.5">
                        <div>✓ جمع الشظايا الثلاث: متاح</div>
                        <div>✓ تحدي تركيب السر الأعظم: فعال مع التحقق المنطقي</div>
                        <div>✓ إظهار تميمة السكينة والخاتمة الجامعة دون تكرار للنجوم أو النِقاط</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8EED8] dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 space-y-2">
                      <div className="flex items-center justify-between font-black text-amber-900 dark:text-amber-200">
                        <span>المسار (ب): إكمال 30 مرحلة دون جمع كافة الأسرار</span>
                        <span>{grandRes.pathB_partialSecrets.passed ? '✅ ناجح' : '❌'}</span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {grandRes.pathB_partialSecrets.details}
                      </p>
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold space-y-0.5">
                        <div>✓ إتمام اللعبة الأساسية بنجاح تام</div>
                        <div>✓ ظهور رسالة توجيهية دافئة للاستكشاف دون إشعار بالنقص</div>
                        <div>✓ إبقاء الخريطة مفتوحة للتنقل والعودة لأسرار العوالم السابقة</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 3: Journey Test Level 10 */}
              {testModalTab === 'journey' && (() => {
                const journeyRes = runGameJourneyTest(10);
                return (
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-[#F7F5EF] dark:bg-[#121A16] border border-[#D5DED7] dark:border-stone-700 space-y-2">
                      <div className="flex items-center justify-between font-black text-[#174F3F] dark:text-emerald-300">
                        <span>محاكاة رحلة المرحلة 10</span>
                        <span>{journeyRes.success ? '✅ ناجحة' : '❌'}</span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300">
                        {journeyRes.summary}
                      </p>
                      <div className="space-y-1 pt-1">
                        {journeyRes.steps.map((st, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
                            <span>{st.stepName}: {st.description}</span>
                            <span className="font-bold text-emerald-600">{st.passed ? '✓' : '✗'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#174F3F] text-white text-xs font-bold cursor-pointer"
              >
                إغلاق التقرير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Instructions & Rules Modal */}
      <GameInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        explanation={GAME_EXPLANATIONS.nesmat_cipher}
      />
    </div>
  );
};
