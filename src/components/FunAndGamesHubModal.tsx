import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smile, 
  Sparkles, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Dice5, 
  HelpCircle, 
  Heart, 
  Flame, 
  Award, 
  Volume2, 
  ChevronRight, 
  ChevronLeft,
  Trophy
} from 'lucide-react';
import { 
  JOKES_COLLECTION, 
  RIDDLES_COLLECTION, 
  JOY_CHALLENGES, 
  BUBBLES_LIST, 
  JokeItem, 
  RiddleItem 
} from '../data/funAndGamesData';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface FunAndGamesHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory';
}

export const FunAndGamesHubModal: React.FC<FunAndGamesHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'jokes'
}) => {
  const [activeTab, setActiveTab] = useState<'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory'>(initialTab);

  // Jokes State
  const [jokeFilter, setJokeFilter] = useState<string>('all');
  const [activeJokeIndex, setActiveJokeIndex] = useState(0);
  const [laughCount, setLaughCount] = useState<Record<string, number>>({});
  const [copiedJoke, setCopiedJoke] = useState(false);
  const [floatingSmiles, setFloatingSmiles] = useState<{ id: number; emoji: string }[]>([]);

  // Bubble Popper State
  const [activeBubbles, setActiveBubbles] = useState<string[]>(BUBBLES_LIST);
  const [poppedCount, setPoppedCount] = useState(0);

  // Riddles State
  const [activeRiddleIndex, setActiveRiddleIndex] = useState(0);
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);

  // Wheel of Joy State
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<typeof JOY_CHALLENGES[0] | null>(null);

  // Memory Cards Game State
  const MEMORY_ICONS = ['☀️', '☕', '🌸', '🌱', '🦋', '🎈'];
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);

  // Initialize Memory Game
  const initMemoryGame = () => {
    const paired = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, flipped: false, matched: false }));
    setCards(paired);
    setFlippedCards([]);
    setMoves(0);
    setMatchesFound(0);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      initMemoryGame();
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Jokes functions
  const filteredJokes = JOKES_COLLECTION.filter(j => jokeFilter === 'all' || j.category === jokeFilter);
  const currentJoke = filteredJokes[activeJokeIndex % filteredJokes.length] || JOKES_COLLECTION[0];

  const handleNextJoke = () => {
    setActiveJokeIndex(prev => (prev + 1) % filteredJokes.length);
  };

  const handlePrevJoke = () => {
    setActiveJokeIndex(prev => (prev - 1 + filteredJokes.length) % filteredJokes.length);
  };

  const handleRandomJoke = () => {
    const rand = Math.floor(Math.random() * filteredJokes.length);
    setActiveJokeIndex(rand);
    triggerLaughReaction();
  };

  const triggerLaughReaction = () => {
    const currentJId = currentJoke.id;
    setLaughCount(prev => ({ ...prev, [currentJId]: (prev[currentJId] || 0) + 1 }));

    // Generate floating emojis
    const id = Date.now();
    const emojis = ['😂', '🤣', '✨', '💛', '🎈'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setFloatingSmiles(prev => [...prev, { id, emoji: randomEmoji }]);
    setTimeout(() => {
      setFloatingSmiles(prev => prev.filter(s => s.id !== id));
    }, 1500);
  };

  const handleCopyJoke = () => {
    const text = `${currentJoke.joke}\n${currentJoke.punchline || ''}\n\n— من ركن البهجة والضحك في تطبيق نسمة حياة 🌿😂`;
    navigator.clipboard.writeText(text);
    setCopiedJoke(true);
    setTimeout(() => setCopiedJoke(false), 2000);
  };

  // Bubble Pop Function
  const handlePopBubble = (bubbleText: string) => {
    setActiveBubbles(prev => prev.filter(b => b !== bubbleText));
    setPoppedCount(prev => prev + 1);

    // Audio or visual effect
    const id = Date.now();
    setFloatingSmiles(prev => [...prev, { id, emoji: '💨' }]);
    setTimeout(() => {
      setFloatingSmiles(prev => prev.filter(s => s.id !== id));
    }, 1000);
  };

  const handleResetBubbles = () => {
    setActiveBubbles(BUBBLES_LIST);
  };

  // Wheel of Joy Spin Function
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedChallenge(null);

    let counter = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * JOY_CHALLENGES.length);
      setSelectedChallenge(JOY_CHALLENGES[rand]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  // Memory Game Card Flip
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    const newFlipped = [...flippedCards, id];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      if (cards[firstId].icon === cards[secondId].icon) {
        setTimeout(() => {
          newCards[firstId].matched = true;
          newCards[secondId].matched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setMatchesFound(prev => prev + 1);
        }, 500);
      } else {
        setTimeout(() => {
          newCards[firstId].flipped = false;
          newCards[secondId].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_-10px_rgba(58,90,64,0.25)] overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Floating animated smiles */}
        <div className="absolute top-12 left-10 pointer-events-none z-50 flex flex-col items-center gap-1">
          {floatingSmiles.map(s => (
            <span key={s.id} className="text-3xl animate-bounce">
              {s.emoji}
            </span>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-inner animate-pulse">
              🎈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  واحة البهجة والضحك والألعاب
                </h2>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  جرعة فرفشة وترويق
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5 font-medium">
                «الضحك تمرين نفسي حقيقي يخفض هرمون الكورتيزول ويفكك عقد التفكير الزائد»
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="py-3 shrink-0 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'jokes', label: 'مسرح النكت والقفشات', emoji: '😂' },
            { id: 'bubbles', label: 'فرقعة فقاعات القلق', emoji: '🫧' },
            { id: 'riddles', label: 'ألغاز وفوازير للترويق', emoji: '🧩' },
            { id: 'wheel', label: 'عجلة الحظ للبهجة', emoji: '🎡' },
            { id: 'memory', label: 'تحدي الذاكرة الهادئة', emoji: '🃏' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-2xl border text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                  : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-2 space-y-4 flex-1">
          
          {/* TAB 1: مسرح النكت والقفشات */}
          {activeTab === 'jokes' && (
            <div className="space-y-4 animate-fade-in">
              {/* Category selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'جميع النكت' },
                  { id: 'overthinking', label: '🧠 التفكير الزائد' },
                  { id: 'work', label: '💼 الشغل والمنبه' },
                  { id: 'relationships', label: '🍲 العلاقات والبيت' },
                  { id: 'life', label: '🔋 مواقف يومية' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setJokeFilter(f.id);
                      setActiveJokeIndex(0);
                    }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      jokeFilter === f.id
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white text-[#58645C] border border-[#E5DACB] hover:bg-stone-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Main Joke Card */}
              <div className="relative p-6 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50 border-2 border-amber-200/80 rounded-3xl shadow-sm space-y-4 text-center">
                <div className="flex items-center justify-between text-xs text-[#58645C] border-b border-amber-200/60 pb-2">
                  <span className="font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    {currentJoke.categoryLabel} {currentJoke.emoji}
                  </span>
                  <span>نكتة {((activeJokeIndex % filteredJokes.length) + 1)} من {filteredJokes.length}</span>
                </div>

                <div className="py-4 space-y-3 max-w-md mx-auto">
                  <p className="text-sm sm:text-base font-bold text-[#283618] leading-relaxed">
                    {currentJoke.joke}
                  </p>
                  {currentJoke.punchline && (
                    <div className="p-4 bg-white/90 rounded-2xl border border-amber-200 text-sm sm:text-base font-black text-amber-950 leading-relaxed shadow-2xs">
                      {currentJoke.punchline}
                    </div>
                  )}
                </div>

                {/* Reaction & Action Controls */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={triggerLaughReaction}
                      className="py-2 px-3.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-transform active:scale-95 shadow-2xs"
                    >
                      <span>ضحكتني 😂</span>
                      <span className="font-mono bg-white/80 px-1.5 py-0.5 rounded-md text-[11px]">
                        {laughCount[currentJoke.id] || 0}
                      </span>
                    </button>

                    <button
                      onClick={handleCopyJoke}
                      className="p-2 bg-white hover:bg-stone-100 border border-[#E5DACB] rounded-xl text-stone-600 transition-colors"
                      title="نسخ النكتة"
                    >
                      {copiedJoke ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevJoke}
                      className="p-2 bg-white hover:bg-stone-100 border border-[#E5DACB] rounded-xl text-stone-600 transition-colors"
                      title="النكتة السابقة"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleRandomJoke}
                      className="py-2 px-3.5 bg-[#3A5A40] hover:bg-[#283618] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      title="نكتة عشوائية"
                    >
                      <Dice5 className="w-4 h-4" />
                      <span>فرفشني بنكتة عشوائية 🎲</span>
                    </button>

                    <button
                      onClick={handleNextJoke}
                      className="p-2 bg-white hover:bg-stone-100 border border-[#E5DACB] rounded-xl text-stone-600 transition-colors"
                      title="النكتة التالية"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: فرقعة فقاعات القلق */}
          {activeTab === 'bubbles' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-950 flex items-center justify-between">
                <div className="space-y-0.5 text-right">
                  <div className="font-extrabold text-sm text-sky-900">
                    🫧 فرقع كل فقاعة قلق وتخلص من ثقلها!
                  </div>
                  <p className="text-[11px] text-sky-800">
                    اضغط على الفقاعة لتفرقع وتتلاشى من رأسك فوراً.
                  </p>
                </div>
                <div className="text-left font-mono text-xs bg-white px-3 py-1.5 rounded-xl border border-sky-300 font-bold text-sky-900">
                  فرقعت: {poppedCount} 💥
                </div>
              </div>

              {/* Bubbles Sandbox */}
              {activeBubbles.length > 0 ? (
                <div className="p-6 bg-gradient-to-b from-[#EFF8FA] to-[#E3F2F6] border border-sky-200 rounded-3xl min-h-[260px] flex flex-wrap items-center justify-center gap-3">
                  {activeBubbles.map((bubble, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePopBubble(bubble)}
                      className="p-3.5 bg-white/95 hover:bg-sky-100 border-2 border-sky-300 hover:border-sky-500 text-sky-950 font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-75 flex items-center gap-1.5 animate-pulse"
                    >
                      <span>{bubble}</span>
                      <span className="text-sky-500 font-black">×</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-3 animate-fade-in text-center">
                  <div className="text-4xl animate-bounce">🎉</div>
                  <h3 className="text-base font-black text-emerald-950">
                    عظيم جداً! فرقعت كل فقاعات القلق!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto font-medium">
                    عقلك الآن في مساحة هدوء وسلام.. لا تسمح لأي فكرة عابرة أن تسجنك داخلها.
                  </p>
                  <button
                    onClick={handleResetBubbles}
                    className="py-2.5 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>توليد فقاعات جديدة للفرقعة</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ألغاز وفوازير للترويق */}
          {activeTab === 'riddles' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-6 bg-white border border-[#E5DACB] rounded-3xl shadow-xs space-y-4 text-center">
                <div className="flex items-center justify-between text-xs text-[#58645C] border-b border-[#E5DACB] pb-2">
                  <span className="font-bold text-[#3A5A40] flex items-center gap-1">
                    <span>🧩 فزورة لتشتيت التفكير</span>
                  </span>
                  <span>{activeRiddleIndex + 1} من {RIDDLES_COLLECTION.length}</span>
                </div>

                <div className="py-4 space-y-3 max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-3xl shadow-inner">
                    {RIDDLES_COLLECTION[activeRiddleIndex].emoji}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#283618] leading-relaxed">
                    {RIDDLES_COLLECTION[activeRiddleIndex].question}
                  </h3>
                  <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    💡 تلميح: {RIDDLES_COLLECTION[activeRiddleIndex].hint}
                  </div>
                </div>

                {showRiddleAnswer ? (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl animate-fade-in max-w-md mx-auto">
                    <span className="text-xs font-bold text-emerald-900 block mb-1">الإجابة الصحيحة هي:</span>
                    <span className="text-base font-black text-emerald-950">
                      {RIDDLES_COLLECTION[activeRiddleIndex].answer}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRiddleAnswer(true)}
                    className="py-2.5 px-6 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span>اكشف الحل 💡</span>
                  </button>
                )}

                <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#E5DACB]">
                  <button
                    disabled={activeRiddleIndex === 0}
                    onClick={() => {
                      setActiveRiddleIndex(prev => prev - 1);
                      setShowRiddleAnswer(false);
                    }}
                    className="py-2 px-4 bg-[#FAF7F2] hover:bg-stone-100 disabled:opacity-40 rounded-xl border border-[#E5DACB] text-xs font-bold"
                  >
                    الفزورة السابقة
                  </button>

                  <button
                    onClick={() => {
                      setActiveRiddleIndex(prev => (prev + 1) % RIDDLES_COLLECTION.length);
                      setShowRiddleAnswer(false);
                    }}
                    className="py-2 px-5 bg-[#3A5A40] hover:bg-[#283618] text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    الفزورة التالية 👈
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: عجلة الحظ للبهجة */}
          {activeTab === 'wheel' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="p-6 bg-white border border-[#E5DACB] rounded-3xl shadow-xs space-y-4">
                <div className="text-xs font-bold text-[#3A5A40] bg-[#3A5A40]/10 px-3 py-1 rounded-full inline-block">
                  🎡 دولاب البهجة اليومي
                </div>

                <div className="py-4">
                  <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-[#3A5A40] p-1.5 shadow-lg flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl shadow-inner">
                      {isSpinning ? '🎲' : (selectedChallenge?.emoji || '🎡')}
                    </div>
                  </div>
                </div>

                {selectedChallenge ? (
                  <div className="p-5 bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-300 rounded-3xl max-w-md mx-auto space-y-2 animate-fade-in">
                    <span className="text-xs font-bold text-amber-900 block">تحدي البهجة المختار لك الآن:</span>
                    <p className="text-sm font-black text-[#283618] leading-relaxed">
                      {selectedChallenge.text}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#58645C] max-w-sm mx-auto">
                    اضغط على الزر لتدوير العجلة والحصول على مهمة لطيفة تزرع ابتسامة على وجهك فوراً!
                  </p>
                )}

                <div className="pt-2">
                  <button
                    disabled={isSpinning}
                    onClick={handleSpinWheel}
                    className="py-3 px-8 bg-[#3A5A40] hover:bg-[#283618] disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                  >
                    <Dice5 className="w-4 h-4" />
                    <span>{isSpinning ? 'جارٍ السحب...' : 'دوّر العجلة الآن! ✨'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: تحدي الذاكرة الهادئة */}
          {activeTab === 'memory' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="p-4 bg-white border border-[#E5DACB] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🃏</span>
                  <span className="font-bold text-[#283618]">طابق الأيقونات المتشابهة</span>
                </div>
                <div className="flex items-center gap-3 font-mono font-bold text-[#58645C]">
                  <span>الحركات: {moves}</span>
                  <span className="text-emerald-700">المتطابق: {matchesFound} / 6</span>
                </div>
              </div>

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 p-4 bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`h-20 sm:h-24 rounded-2xl border-2 text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 font-bold ${
                      card.flipped || card.matched
                        ? 'bg-white border-[#3A5A40] scale-100 shadow-sm'
                        : 'bg-emerald-800/10 hover:bg-emerald-800/20 border-emerald-300 text-transparent scale-95'
                    } ${card.matched ? 'opacity-80 bg-emerald-50 border-emerald-400' : ''}`}
                  >
                    {(card.flipped || card.matched) ? card.icon : '❓'}
                  </button>
                ))}
              </div>

              {matchesFound === 6 && (
                <div className="p-4 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-2xl space-y-1 animate-fade-in">
                  <div className="font-black text-sm">🎉 مبروك! أنهيت التحدي في {moves} حركة!</div>
                  <button
                    onClick={initMemoryGame}
                    className="py-1.5 px-4 bg-emerald-800 text-white rounded-xl text-xs font-bold mt-1"
                  >
                    لعب جولة جديدة
                  </button>
                </div>
              )}
            </div>
          )}

          <TakeawayResultCard
            quote="«أقصر مسافة بين مشكلة وحلها.. ابتسامة صادقة تعيد لعقلك هدوءه ومرونته»"
            onTryAnother={() => setActiveTab('jokes')}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
