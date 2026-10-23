/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Compass, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Lightbulb, 
  Trophy, 
  Gift, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Flame,
  Shield,
  Star
} from 'lucide-react';
import { CIPHER_LEVELS, CIPHER_WORLDS, CIPHER_SECRETS, CipherLevel } from '../data/nesmatCipherData';

interface NesmatCipherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NesmatCipherModal: React.FC<NesmatCipherModalProps> = ({ isOpen, onClose }) => {
  // Storage keys
  const PROGRESS_KEY = 'nesma_cipher_progress_v1';
  const SOUND_KEY = 'nesma_cipher_sound_enabled';

  // Game state
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  const [currentSelectedLevelId, setCurrentSelectedLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const next = Math.max(...parsed) + 1;
          return next <= 30 ? next : 30;
        }
      }
    } catch (_) {}
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

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem(SOUND_KEY) !== 'false';
  });

  // Active view tab inside game: 'map' | 'level' | 'secrets' | 'cabinet' | 'grand_secret'
  const [activeTab, setActiveTab] = useState<'map' | 'level' | 'secrets' | 'cabinet' | 'grand_secret'>('map');
  const [selectedWorldId, setSelectedWorldId] = useState<1 | 2 | 3>(1);

  // Level play state
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [hintTier, setHintTier] = useState<number>(0); // 0: none, 1: direction, 2: thought process, 3: clear help
  const [levelStatus, setLevelStatus] = useState<'playing' | 'success' | 'retry'>('playing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Secret solve modal state
  const [activeSecretId, setActiveSecretId] = useState<string | null>(null);
  const [secretAnswerInput, setSecretAnswerInput] = useState<string>('');

  // Grand secret input state
  const [grandSecretInput, setGrandSecretInput] = useState<string>('');
  const [grandSecretSolved, setGrandSecretSolved] = useState<boolean>(() => {
    return localStorage.getItem('nesma_cipher_grand_solved') === 'true';
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedLevels));
    // Update unlocked secrets dynamically
    const maxC = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
    const newSecrets: string[] = [];
    if (maxC >= 5) newSecrets.push('secret_1');
    if (maxC >= 15) newSecrets.push('secret_2');
    if (maxC >= 25) newSecrets.push('secret_3');
    setUnlockedSecrets(newSecrets);
  }, [completedLevels]);

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  if (!isOpen) return null;

  const activeLevel: CipherLevel = CIPHER_LEVELS.find(l => l.id === currentSelectedLevelId) || CIPHER_LEVELS[0];
  const activeWorld = CIPHER_WORLDS.find(w => w.id === activeLevel.worldId) || CIPHER_WORLDS[0];

  const handleSelectLevel = (lvlId: number) => {
    // Can play if it's completed, current, or previous completed + 1
    const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
    if (lvlId <= maxCompleted + 1) {
      setCurrentSelectedLevelId(lvlId);
      setUserAnswer('');
      setHintTier(0);
      setLevelStatus('playing');
      setActiveTab('level');
    } else {
      setToastMessage('أكمل المراحل السابقة أولاً لتفتح هذه المرحلة 🔒');
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      setToastMessage('يرجى كتابة أو اختيار الإجابة أولاً.');
      return;
    }

    const correct = String(activeLevel.puzzleData.correctAnswer).trim().toLowerCase();
    const given = userAnswer.trim().toLowerCase();

    // Flexible matching
    if (given === correct || given.includes(correct) || correct.includes(given)) {
      setLevelStatus('success');
      if (!completedLevels.includes(activeLevel.id)) {
        const updated = [...completedLevels, activeLevel.id];
        setCompletedLevels(updated);
      }
      setToastMessage('إجابة صحيحة وموفقة جداً! 🌟');
    } else {
      setLevelStatus('retry');
      setToastMessage('محاولة دافئة.. فكر مجدداً أو استعن بتلميحات بوصلة نسمة 🍃');
    }
  };

  const handleNextLevel = () => {
    if (currentSelectedLevelId < 30) {
      const nextId = currentSelectedLevelId + 1;
      setCurrentSelectedLevelId(nextId);
      setUserAnswer('');
      setHintTier(0);
      setLevelStatus('playing');
    } else {
      setActiveTab('map');
      setToastMessage('لقد أكملت جميع مراحل شفرة نسمة بنجاح تام! 🎉');
    }
  };

  const handleSolveSecret = (secretId: string) => {
    const sec = CIPHER_SECRETS.find(s => s.id === secretId);
    if (!sec) return;
    if (secretAnswerInput.trim().toLowerCase() === sec.secretAnswer.trim().toLowerCase()) {
      setToastMessage(`تهانينا! لقد اكتشفت ${sec.name} بنجاح ✨`);
      setActiveSecretId(null);
      setSecretAnswerInput('');
    } else {
      setToastMessage('الإجابة غير دقيقة.. تأمل السؤال وتأمل معنى السر مجدداً.');
    }
  };

  const handleSolveGrandSecret = () => {
    if (grandSecretInput.includes('الرفق') || grandSecretInput.includes('الحدود') || grandSecretInput.includes('سلام')) {
      setGrandSecretSolved(true);
      localStorage.setItem('nesma_cipher_grand_solved', 'true');
      setToastMessage('🎉 لقد فتحت «السر الأكبر» وحققت السكينة التامة في نسمة حياة!');
    } else {
      setToastMessage('حاول ربط المعاني الثلاثة الكبرى: الرفق بالذات، صون الحدود، ومراقبة الأفكار.');
    }
  };

  const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
  const isGameFinished = maxCompleted >= 30;

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
                  {completedLevels.length} / 30 مرحلة مكتملة
                </span>
              </div>
              <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
                مغامرة تفاعلية هادئة لتفكيك الأفكار واكتشاف المعاني النفسية بوعي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              <span>خريطة العوالم والمراحل</span>
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
              <span>الأسرار المخفية ({unlockedSecrets.length}/3)</span>
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
              <span>خزانة المعاني والرسائل</span>
            </button>

            {isGameFinished && (
              <button
                onClick={() => setActiveTab('grand_secret')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'grand_secret'
                    ? 'bg-amber-600 text-white shadow-sm animate-pulse'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>السر الأكبر 🌟</span>
              </button>
            )}
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
          
          {/* TAB 1: MAP VIEW */}
          {activeTab === 'map' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              
              {/* World selector header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CIPHER_WORLDS.map(world => {
                  const isCurrentWorld = activeWorld.id === world.id;
                  const [minL, maxL] = world.levelsRange;
                  const worldCompletedCount = completedLevels.filter(id => id >= minL && id <= maxL).length;
                  return (
                    <button
                      key={world.id}
                      onClick={() => setSelectedWorldId(world.id)}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                        selectedWorldId === world.id
                          ? 'bg-white dark:bg-[#1E2B24] border-[#23785B] shadow-md ring-2 ring-[#23785B]/20'
                          : 'bg-white/60 dark:bg-stone-800/60 border-[#D5DED7] dark:border-stone-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#23785B] dark:text-emerald-400">
                          {world.subtitle}
                        </span>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          {worldCompletedCount} / 10
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#174F3F] dark:text-white">
                        {world.name}
                      </h3>
                      <p className="text-[11px] text-[#515B55] dark:text-stone-300 mt-1 line-clamp-2">
                        {world.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Active World Details & Levels Grid */}
              {(() => {
                const world = CIPHER_WORLDS.find(w => w.id === selectedWorldId) || CIPHER_WORLDS[0];
                const worldLevels = CIPHER_LEVELS.filter(l => l.worldId === world.id);
                return (
                  <div className="bg-white dark:bg-[#1A2520] border border-[#D5DED7] dark:border-stone-700 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="border-b border-[#D5DED7] dark:border-stone-700 pb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E2EFE7] dark:bg-emerald-950 text-[#174F3F] dark:text-emerald-300 text-xs font-bold rounded-full mb-2">
                        <Flame className="w-3.5 h-3.5 text-[#B78327]" />
                        <span>نهاية العالم: {world.finaleTitle}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#174F3F] dark:text-white">
                        {world.name} — خريطة المراحل
                      </h3>
                      <p className="text-xs text-[#515B55] dark:text-stone-300 mt-1">
                        اضغط على أي مرحلة مفتوحة لبدء التحدي واستكشاف المعنى النفسي.
                      </p>
                    </div>

                    {/* Levels Serpentine Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                      {worldLevels.map(lvl => {
                        const isCompleted = completedLevels.includes(lvl.id);
                        const maxC = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
                        const isUnlocked = lvl.id <= maxC + 1;
                        const isCurrent = lvl.id === currentSelectedLevelId;

                        return (
                          <button
                            key={lvl.id}
                            onClick={() => handleSelectLevel(lvl.id)}
                            disabled={!isUnlocked}
                            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[110px] cursor-pointer ${
                              isCompleted
                                ? 'bg-[#E2EFE7] dark:bg-emerald-950/60 border-[#23785B] text-[#174F3F] dark:text-emerald-200 shadow-xs'
                                : isCurrent
                                ? 'bg-white dark:bg-[#202C26] border-[#B78327] ring-2 ring-[#B78327]/30 text-[#174F3F] dark:text-white shadow-md'
                                : isUnlocked
                                ? 'bg-white dark:bg-stone-800 border-[#D5DED7] dark:border-stone-700 text-[#292F2B] dark:text-stone-200 hover:border-[#23785B]'
                                : 'bg-stone-100 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                                #{lvl.id}
                              </span>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-[#23785B]" />
                              ) : isUnlocked ? (
                                <Sparkles className="w-4 h-4 text-[#B78327]" />
                              ) : (
                                <Lock className="w-4 h-4 text-stone-400" />
                              )}
                            </div>

                            <div className="mt-2">
                              <h4 className="text-xs font-bold leading-tight line-clamp-2">
                                {lvl.title}
                              </h4>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>
          )}

          {/* TAB 2: LEVEL PLAY VIEW */}
          {activeTab === 'level' && activeLevel && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Breadcrumb / Header */}
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

              {/* Story & Companion Intro Card */}
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

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] dark:bg-[#121A16] border border-[#D5DED7] dark:border-stone-700 text-xs text-[#515B55] dark:text-stone-300 leading-relaxed">
                  <span className="font-bold text-[#174F3F] dark:text-emerald-400 block mb-1">
                    📖 الفصل القصصي:
                  </span>
                  {activeLevel.storyChapter}
                </div>
              </div>

              {/* Puzzle Interaction Card */}
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border-2 border-[#23785B]/30 shadow-md space-y-5">
                <div>
                  <span className="text-[11px] font-bold px-3 py-1 bg-[#23785B]/15 text-[#23785B] dark:bg-emerald-500/20 dark:text-emerald-300 rounded-full">
                    تحدي اللغز #{activeLevel.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-white mt-2">
                    {activeLevel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 mt-1 leading-relaxed">
                    {activeLevel.puzzleData.prompt}
                  </p>
                </div>

                {/* Multiple choice options if available */}
                {activeLevel.puzzleData.options ? (
                  <div className="space-y-2.5">
                    {activeLevel.puzzleData.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserAnswer(opt)}
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
                      placeholder="اكتب إجابتك هنا..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#F7F5EF] dark:bg-stone-800 border border-[#D5DED7] dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#23785B]"
                    />
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || levelStatus === 'success'}
                    className="px-6 py-3 rounded-2xl bg-[#174F3F] hover:bg-[#11382C] text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    تحقق من الحل 🔍
                  </button>

                  {/* Progressive Hint Button */}
                  <button
                    onClick={() => setHintTier(prev => (prev < 3 ? prev + 1 : prev))}
                    className="px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>تلميح بوصلة نسمة ({hintTier}/3)</span>
                  </button>
                </div>

                {/* Display Hints if requested */}
                {hintTier > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-fade-in">
                    <span className="font-bold block text-[11px] text-amber-700 dark:text-amber-400">
                      💡 تلميح رقم {hintTier}:
                    </span>
                    <p className="leading-relaxed">
                      {activeLevel.puzzleData.hints[hintTier - 1]}
                    </p>
                  </div>
                )}

                {/* Success Banner & Psychological Takeaway */}
                {levelStatus === 'success' && (
                  <div className="p-5 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950/80 border border-[#23785B]/40 text-[#174F3F] dark:text-emerald-200 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#B78327]" />
                      <h4 className="font-extrabold text-base">
                        {activeLevel.psychologicalTakeaway.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      {activeLevel.psychologicalTakeaway.message}
                    </p>
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={handleNextLevel}
                        className="px-5 py-2.5 rounded-xl bg-[#23785B] hover:bg-[#174F3F] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <span>المرحلة التالية</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {levelStatus === 'retry' && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs font-medium animate-fade-in">
                    محاولة دافئة! اقرأ التلميح أعلى أو جرب خياراً آخر برفق.
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: SECRETS VIEW */}
          {activeTab === 'secrets' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-2">
                <h3 className="text-lg font-black text-[#174F3F] dark:text-white flex items-center gap-2">
                  <span>🎁 الأسرار الثلاثة المخفية في رحلة نسمة</span>
                </h3>
                <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed">
                  تُفتح هذه الأسرار كلما تقدمت في عوالم شفرة نسمة. أجب عن التحدي الخاص بكل سر لاكتشافه نهائياً.
                </p>
              </div>

              <div className="space-y-4">
                {CIPHER_SECRETS.map(sec => {
                  const isUnlocked = unlockedSecrets.includes(sec.id);
                  return (
                    <div 
                      key={sec.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isUnlocked 
                          ? 'bg-white dark:bg-[#1A2520] border-[#23785B] shadow-sm' 
                          : 'bg-stone-100 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-inner">
                            {sec.icon}
                          </div>
                          <div>
                            <h4 className="text-base font-black text-[#174F3F] dark:text-white">
                              {sec.name}
                            </h4>
                            <p className="text-xs text-[#515B55] dark:text-stone-300 mt-1 leading-relaxed">
                              {sec.description}
                            </p>
                          </div>
                        </div>

                        {isUnlocked ? (
                          <span className="text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-full">
                            مكتشف ✨
                          </span>
                        ) : (
                          <span className="text-xs px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold rounded-full flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> مقفل
                          </span>
                        )}
                      </div>

                      {isUnlocked && activeSecretId !== sec.id && (
                        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                          <button
                            onClick={() => setActiveSecretId(sec.id)}
                            className="px-4 py-2 rounded-xl bg-[#174F3F] text-white text-xs font-bold cursor-pointer"
                          >
                            تأمل السر وحله 🔍
                          </button>
                        </div>
                      )}

                      {isUnlocked && activeSecretId === sec.id && (
                        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 space-y-3 animate-fade-in">
                          <p className="text-xs font-bold text-[#174F3F] dark:text-emerald-300">
                            سؤال التأمل: {sec.secretPrompt}
                          </p>
                          <input
                            type="text"
                            value={secretAnswerInput}
                            onChange={(e) => setSecretAnswerInput(e.target.value)}
                            placeholder="اكتب إجابتك هنا..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setActiveSecretId(null)}
                              className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-xs font-bold cursor-pointer"
                            >
                              إلغاء
                            </button>
                            <button
                              onClick={() => handleSolveSecret(sec.id)}
                              className="px-4 py-1.5 rounded-xl bg-[#23785B] text-white text-xs font-bold cursor-pointer"
                            >
                              تأكيد الحل
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CABINET OF QUOTATIONS */}
          {activeTab === 'cabinet' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-[#1A2520] p-6 rounded-3xl border border-[#D5DED7] dark:border-stone-700 shadow-sm space-y-2">
                <h3 className="text-lg font-black text-[#174F3F] dark:text-white flex items-center gap-2">
                  <span>📖 خزانة المقتنيات والاقتباسات النفسية</span>
                </h3>
                <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed">
                  كل مرحلة أكملتها أضافت درساً عميقاً إلى خزانتك. هذه الاقتباسات مراجعك الدائمة لسلام الحاضر.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CIPHER_LEVELS.filter(l => completedLevels.includes(l.id)).map(lvl => (
                  <div key={lvl.id} className="bg-white dark:bg-[#1A2520] p-5 rounded-2xl border border-[#D5DED7] dark:border-stone-700 space-y-2 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#23785B] dark:text-emerald-400">
                        مرحلة #{lvl.id} · {lvl.title}
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
                    لم تكمل أي مرحلة بعد. ابدأ اللعب من الخريطة لتتجمع اقتباساتك هنا! 🌿
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GRAND SECRET */}
          {activeTab === 'grand_secret' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-amber-900/90 via-stone-900 to-[#141816] p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 text-white shadow-xl space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl shadow-inner">
                    🌟
                  </div>
                  <h3 className="text-2xl font-black text-amber-300">
                    السر الأكبر — شفرة نسمة الكبرى
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
                    لقد طوّفت في حديقة البدايات ومكتبة الأسرار وكهف التفكير. اربط المعاني الثلاثة الكبرى في جملة واحدة واكتبها أدناه لتتوج بالخاتمة الكبرى.
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={grandSecretInput}
                    onChange={(e) => setGrandSecretInput(e.target.value)}
                    placeholder="مثال: الرفق بالذات، وصون الحدود، ومراقبة الأفكار..."
                    className="w-full px-4 py-3 rounded-2xl bg-stone-800 border border-stone-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={handleSolveGrandSecret}
                    className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-black transition-all cursor-pointer shadow-md"
                  >
                    تأكيد السر الأكبر واكتشاف النهاية 🔓
                  </button>
                </div>

                {grandSecretSolved && (
                  <div className="p-6 rounded-2xl bg-black/50 border border-amber-500/50 space-y-4 text-center animate-fade-in">
                    <span className="text-xs font-bold text-amber-400 block">
                      📜 خاتمة «نسمة حياة» الكبرى:
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-amber-100 leading-relaxed">
                      «الرفق بالذات في خطواتك الصغيرة، وصون حدودك الشخصية بوعي، والمراقبة الهادئة لأفكارك العابرة... تصنع معًا سلام الحاضر وسكينة الروح».
                    </p>
                    <p className="text-xs text-stone-300">
                      ألف مبارك لك هذا الإنجاز الوعي العظيم! 🌿✨
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
