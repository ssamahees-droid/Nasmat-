import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen, 
  Check, 
  Lightbulb, 
  FileText
} from 'lucide-react';
import { 
  COGNITIVE_DISTORTIONS, 
  REFRAMING_SCENARIOS, 
  FACT_OR_STORY_QUESTIONS, 
  SavedFekerEntry 
} from '../data/fekerAppData';
import { TextAudioPlayer } from './TextAudioPlayer';

interface FekerAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'reframing' | 'game' | 'distortions' | 'archive';
}

export const FekerAppModal: React.FC<FekerAppModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'reframing'
}) => {
  const [activeTab, setActiveTab] = useState<'reframing' | 'game' | 'distortions' | 'archive'>(initialTab);

  // Sync initial tab when changed
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Reframing Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('custom');
  const [situationText, setSituationText] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [selectedDistortionId, setSelectedDistortionId] = useState<string>('catastrophizing');
  const [socraticAnswer1, setSocraticAnswer1] = useState('');
  const [socraticAnswer2, setSocraticAnswer2] = useState('');
  const [rationalAlternative, setRationalAlternative] = useState('');
  const [beliefBefore, setBeliefBefore] = useState<number>(85);
  const [beliefAfter, setBeliefAfter] = useState<number>(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Saved Entries State
  const [savedEntries, setSavedEntries] = useState<SavedFekerEntry[]>(() => {
    try {
      const stored = localStorage.getItem('nesmat_feker_saved_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Fact vs Story Game State
  const [gameIndex, setGameIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  if (!isOpen) return null;

  // Handle Scenario preset selection
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    if (id === 'custom') {
      setSituationText('');
      setAutomaticThought('');
      setSelectedDistortionId('catastrophizing');
      setRationalAlternative('');
    } else {
      const scenario = REFRAMING_SCENARIOS.find(s => s.id === id);
      if (scenario) {
        setSituationText(scenario.trigger);
        setAutomaticThought(scenario.automaticThought);
        setSelectedDistortionId(scenario.distortionId);
        const distortion = COGNITIVE_DISTORTIONS.find(d => d.id === scenario.distortionId);
        if (distortion) {
          setRationalAlternative(distortion.antidote);
        }
      }
    }
  };

  // Save Entry to LocalStorage
  const handleSaveEntry = () => {
    const distortion = COGNITIVE_DISTORTIONS.find(d => d.id === selectedDistortionId);
    const newEntry: SavedFekerEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      situation: situationText || 'موقف غير محدد',
      automaticThought: automaticThought || 'فكرة مقلقة',
      distortionName: distortion ? distortion.arabicName : 'تشويه إدراكي',
      rationalAlternative: rationalAlternative || 'فكرة بديلة واقعية ومتوازنة',
      beliefBefore,
      beliefAfter,
      moodImprovementScore: Math.max(10, beliefBefore - beliefAfter)
    };

    const updated = [newEntry, ...savedEntries];
    setSavedEntries(updated);
    try {
      localStorage.setItem('nesmat_feker_saved_entries', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setWizardStep(4);
      setSavedSuccess(false);
    }, 600);
  };

  // Reset Wizard
  const handleResetWizard = () => {
    setWizardStep(1);
    setSelectedScenarioId('custom');
    setSituationText('');
    setAutomaticThought('');
    setSelectedDistortionId('catastrophizing');
    setSocraticAnswer1('');
    setSocraticAnswer2('');
    setRationalAlternative('');
    setBeliefBefore(85);
    setBeliefAfter(30);
  };

  // Fact vs Story Game Handlers
  const handleAnswerGame = (userThinksFact: boolean) => {
    if (showExplanation) return;
    const currentQ = FACT_OR_STORY_QUESTIONS[gameIndex];
    setSelectedAnswer(userThinksFact);
    setShowExplanation(true);
    if (userThinksFact === currentQ.isFact) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextGameQuestion = () => {
    if (gameIndex + 1 < FACT_OR_STORY_QUESTIONS.length) {
      setGameIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
    }
  };

  const handleRestartGame = () => {
    setGameIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameCompleted(false);
  };

  const activeDistortion = COGNITIVE_DISTORTIONS.find(d => d.id === selectedDistortionId) || COGNITIVE_DISTORTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#F7F3E9] dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 rounded-3xl shadow-2xl text-[#13251E] dark:text-[#F7F3E9] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 bg-[#E6E8D8]/70 dark:bg-[#0D1914]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/25 dark:border-[#A9C5A0]/30 flex items-center justify-center text-[#174C3C] dark:text-[#A9C5A0]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 text-[#174C3C] dark:text-[#A9C5A0] border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
                  تمارين اليقظة الإدراكية
                </span>
                <span className="text-[11px] text-[#263830]/70 dark:text-[#D5DFD7]/70 hidden sm:inline-block">
                  CBT Reframing & Mind Games
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#174C3C] dark:text-[#F7F3E9] flex items-center gap-2">
                <span>فكّر — تفكيك الأفكار والمرونة العقلية</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#13251E]/60 dark:text-white/60 hover:text-[#13251E] dark:hover:text-white hover:bg-[#174C3C]/10 dark:hover:bg-white/10 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 pt-3 pb-2 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 bg-[#F7F3E9] dark:bg-[#14271F] overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('reframing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 font-bold ${
              activeTab === 'reframing'
                ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                : 'border-[#174C3C]/15 dark:border-white/10 text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>استوديو تفكيك الأفكار 💡</span>
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 font-bold ${
              activeTab === 'game'
                ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                : 'border-[#174C3C]/15 dark:border-white/10 text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>لعبة «حقيقة أم حكاية» 🎯</span>
          </button>

          <button
            onClick={() => setActiveTab('distortions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 font-bold ${
              activeTab === 'distortions'
                ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                : 'border-[#174C3C]/15 dark:border-white/10 text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>دليل أفخاخ التفكير 📚</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 font-bold ${
              activeTab === 'archive'
                ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                : 'border-[#174C3C]/15 dark:border-white/10 text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>سجل أفكاري ({savedEntries.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: COGNITIVE REFRAMING STUDIO */}
          {activeTab === 'reframing' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Wizard Progress Stepper */}
              <div className="bg-[#E6E8D8]/70 dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 p-3 sm:p-4 rounded-2xl flex items-center justify-between text-xs font-bold">
                <div className={`flex items-center gap-2 ${wizardStep >= 1 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 1 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>1</span>
                  <span className="hidden sm:inline">الموقف والفكرة</span>
                </div>
                <div className="h-[1px] flex-1 mx-2 bg-[#174C3C]/15 dark:bg-white/10" />
                <div className={`flex items-center gap-2 ${wizardStep >= 2 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 2 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>2</span>
                  <span className="hidden sm:inline">نوع التشويه</span>
                </div>
                <div className="h-[1px] flex-1 mx-2 bg-[#174C3C]/15 dark:bg-white/10" />
                <div className={`flex items-center gap-2 ${wizardStep >= 3 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 3 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>3</span>
                  <span className="hidden sm:inline">تفكيك وسؤال</span>
                </div>
                <div className="h-[1px] flex-1 mx-2 bg-[#174C3C]/15 dark:bg-white/10" />
                <div className={`flex items-center gap-2 ${wizardStep >= 4 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 4 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>4</span>
                  <span className="hidden sm:inline">البديل والنتيجة</span>
                </div>
              </div>

              {/* STEP 1: Situation & Automatic Thought */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 p-4 rounded-2xl">
                    <span className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold block mb-1">اختر سيناريو جاهز أو اكتب موقفك الخاص:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => handleSelectScenario('custom')}
                        className={`px-3 py-1.5 rounded-xl text-xs transition-all font-bold ${
                          selectedScenarioId === 'custom'
                            ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                            : 'bg-[#E6E8D8] dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 text-[#13251E] dark:text-white/80 hover:bg-[#dedfc9]'
                        }`}
                      >
                        ✍️ كتابة فكرة شخصية جديدة
                      </button>
                      {REFRAMING_SCENARIOS.map(sc => (
                        <button
                          key={sc.id}
                          onClick={() => handleSelectScenario(sc.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs transition-all font-bold ${
                            selectedScenarioId === sc.id
                              ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                              : 'bg-[#E6E8D8] dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 text-[#13251E] dark:text-white/80 hover:bg-[#dedfc9]'
                          }`}
                        >
                          {sc.categoryLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9] block mb-1.5">
                        ١. ما هو الموقف أو المحفز الخارجي الذي حدث؟ (الحقيقة المجردة)
                      </label>
                      <input
                        type="text"
                        value={situationText}
                        onChange={(e) => setSituationText(e.target.value)}
                        placeholder="مثال: زميلي لم يرد على رسالتي / تلقيت ملاحظة في الاجتماع..."
                        className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] text-sm text-[#13251E] dark:text-[#F7F3E9] outline-hidden transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9] block mb-1.5">
                        ٢. ما هي الفكرة التلقائية السلبية التي قفزت إلى عقلك فوراً؟
                      </label>
                      <textarea
                        value={automaticThought}
                        onChange={(e) => setAutomaticThought(e.target.value)}
                        rows={3}
                        placeholder="مثال: أكيد يكرهني ولا يطيقني، ومستقبلي في الفريق انتهى..."
                        className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] text-sm text-[#13251E] dark:text-[#F7F3E9] outline-hidden transition-colors"
                      />
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1B342A] rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9]">
                          ما مدى تصديقك واقتناعك بهذه الفكرة حالياً؟
                        </label>
                        <span className="text-sm font-bold text-[#D98F83]">{beliefBefore}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={beliefBefore}
                        onChange={(e) => setBeliefBefore(Number(e.target.value))}
                        className="w-full accent-[#174C3C] dark:accent-[#A9C5A0]"
                      />
                      <div className="flex justify-between text-[11px] text-[#263830]/60 dark:text-white/40 mt-1">
                        <span>غير مقتنع تماماً (0%)</span>
                        <span>شديد الاقتناع بها (100%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setWizardStep(2)}
                      disabled={!situationText && !automaticThought}
                      className="btn-nesma-primary text-xs"
                    >
                      <span>الانتقال لكشف نوع التشويه</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Identify Distortion */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#174C3C] dark:text-[#F7F3E9] mb-1">
                      ما هو الفخ الفكري أو التشويه الإدراكي في هذه الفكرة؟
                    </h3>
                    <p className="text-xs text-[#263830] dark:text-[#D5DFD7]">
                      العقل يميل إلى استخدام اختصارات سلبية تجعلنا نشعر بالذعر. حدد الفخ الأقرب لفكرتك:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COGNITIVE_DISTORTIONS.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDistortionId(d.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedDistortionId === d.id
                            ? 'bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 border-[#174C3C] dark:border-[#A9C5A0] shadow-sm'
                            : 'bg-white dark:bg-[#1B342A] border-[#174C3C]/15 dark:border-white/10 hover:border-[#174C3C]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{d.icon}</span>
                          <span className="font-bold text-xs text-[#174C3C] dark:text-[#F7F3E9]">{d.arabicName}</span>
                        </div>
                        <p className="text-[11px] text-[#263830] dark:text-white/80 leading-relaxed mb-2">
                          {d.shortDesc}
                        </p>
                        <div className="text-[10px] text-[#174C3C] dark:text-[#A9C5A0] bg-[#E6E8D8] dark:bg-[#0D1914] p-1.5 rounded-lg">
                          مثال: {d.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="btn-nesma-secondary text-xs"
                    >
                      الرجوع للسابق
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="btn-nesma-primary text-xs"
                    >
                      <span>تطبيق الأسئلة السقراطية والتفكيك</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Socratic Dialogue & Disputation */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#E6E8D8] dark:bg-[#1B342A] border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
                    <div className="flex items-center gap-2 text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold mb-1">
                      <span>{activeDistortion.icon}</span>
                      <span>ترياق التعامل مع: {activeDistortion.arabicName}</span>
                    </div>
                    <p className="text-xs text-[#13251E] dark:text-white/90 leading-relaxed">
                      {activeDistortion.antidote}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#174C3C] dark:text-[#F7F3E9]">الأسئلة السقراطية للطعن في صحة الفكرة:</h4>
                    
                    {activeDistortion.socraticQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-white/10 rounded-xl space-y-1.5">
                        <label className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold block">
                          سؤال {idx + 1}: {q}
                        </label>
                        <input
                          type="text"
                          value={idx === 0 ? socraticAnswer1 : socraticAnswer2}
                          onChange={(e) => idx === 0 ? setSocraticAnswer1(e.target.value) : setSocraticAnswer2(e.target.value)}
                          placeholder="اكتب إجابتك الواقعية هنا باختصار..."
                          className="w-full p-2.5 rounded-lg bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-white/10 text-xs text-[#13251E] dark:text-[#F7F3E9] focus:border-[#174C3C] dark:focus:border-[#A9C5A0] outline-hidden"
                        />
                      </div>
                    ))}

                    <div className="pt-2">
                      <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9] block mb-1.5">
                        الآن، كيف تصيغ الفكرة البديلة الأكثر حكمة وواقعية؟
                      </label>
                      <textarea
                        value={rationalAlternative}
                        onChange={(e) => setRationalAlternative(e.target.value)}
                        rows={3}
                        placeholder="اكتب بديلاً عادلاً ومطمئناً لا يضخم الأمور..."
                        className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] text-sm text-[#13251E] dark:text-[#F7F3E9] outline-hidden"
                      />
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1B342A] rounded-xl border border-[#174C3C]/15 dark:border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9]">
                          ما مدى تصديقك للفكرة السلبية القديمة الآن بعد التفكيك؟
                        </label>
                        <span className="text-sm font-bold text-[#174C3C] dark:text-[#A9C5A0]">{beliefAfter}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={beliefAfter}
                        onChange={(e) => setBeliefAfter(Number(e.target.value))}
                        className="w-full accent-[#174C3C] dark:accent-[#A9C5A0]"
                      />
                      <div className="flex justify-between text-[11px] text-[#263830]/60 dark:text-white/40 mt-1">
                        <span>انخفضت تماماً (0%)</span>
                        <span>ما زالت قوية (100%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="btn-nesma-secondary text-xs"
                    >
                      الرجوع للسابق
                    </button>
                    <button
                      onClick={handleSaveEntry}
                      className="btn-nesma-primary text-xs"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>تم الحفظ بنجاح!</span>
                        </>
                      ) : (
                        <>
                          <span>حفظ البطاقة وإنهاء التفكيك</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Summary Card */}
              {wizardStep === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1B342A] border-2 border-[#174C3C] dark:border-[#A9C5A0] shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[11px] font-bold text-[#174C3C] dark:text-[#A9C5A0] px-2.5 py-0.5 rounded-full bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
                          بطاقة فكّر للسلام الداخلي ✓
                        </span>
                        <h3 className="text-lg font-bold text-[#174C3C] dark:text-[#F7F3E9] mt-1.5">
                          تحرير العقل من: {activeDistortion.arabicName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <TextAudioPlayer
                          text={`الفكرة البديلة الأكثر توازناً: ${rationalAlternative || 'فكرة متوازنة'}. ترياق التعامل: ${activeDistortion.antidote}`}
                          id={`feker_${selectedDistortionId}`}
                          variant="compact"
                          label="اسمع الفكرة البديلة"
                        />
                        <span className="text-3xl">{activeDistortion.icon}</span>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#E6E8D8]/60 dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-white/10">
                        <span className="text-[11px] text-[#263830] dark:text-white/60 block font-bold">الموقف الأصلي:</span>
                        <p className="text-[#13251E] dark:text-white/90 font-medium mt-0.5">{situationText || 'موقف حياتي'}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-[#D98F83]/15 border border-[#D98F83]/30">
                          <span className="text-[11px] text-[#A04436] dark:text-[#E2998E] block font-bold">الفكرة التلقائية السامة (قبل):</span>
                          <p className="text-[#13251E] dark:text-red-200 mt-0.5 line-through decoration-[#D98F83]">{automaticThought || 'فكرة مقلقة'}</p>
                          <span className="text-[10px] text-[#263830]/70 dark:text-red-300/70 mt-1 block">اقتناع سابق: {beliefBefore}%</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/30 dark:border-[#A9C5A0]/30">
                          <span className="text-[11px] text-[#174C3C] dark:text-[#A9C5A0] block font-bold">الفكرة البديلة الواقعية (الآن):</span>
                          <p className="text-[#174C3C] dark:text-[#A9C5A0] font-bold mt-0.5">{rationalAlternative || 'فكرة متوازنة'}</p>
                          <span className="text-[10px] text-[#263830]/80 dark:text-[#A9C5A0]/80 mt-1 block">اقتناع جديد: {beliefAfter}% (انخفاض التوتر)</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#D5A65A]/15 border border-[#D5A65A]/30 flex items-center justify-between">
                        <span className="text-[#13251E] dark:text-[#F7F3E9] font-bold">مستوى التحسن النفسي المستعاد:</span>
                        <span className="font-bold text-sm text-[#8C6219] dark:text-[#F3CA85]">+{Math.max(10, beliefBefore - beliefAfter)}% صفاء ذهني</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleResetWizard}
                      className="btn-nesma-secondary text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>تفكيك فكرة أخرى</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('archive')}
                        className="btn-nesma-secondary text-xs"
                      >
                        عرض سجل أفكاري المحفوظة
                      </button>
                      <button
                        onClick={onClose}
                        className="btn-nesma-primary text-xs"
                      >
                        العودة للتطبيق
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: FACT OR STORY GAME */}
          {activeTab === 'game' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
              {!gameCompleted ? (
                <>
                  <div className="flex justify-between items-center text-xs text-[#263830] dark:text-white/60 pb-2 border-b border-[#174C3C]/10 dark:border-white/10">
                    <span>الجولة {gameIndex + 1} من {FACT_OR_STORY_QUESTIONS.length}</span>
                    <span className="text-[#174C3C] dark:text-[#A9C5A0] font-bold">النقاط: {score}</span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-white/15 shadow-md space-y-4 text-center">
                    <span className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold block">هل هذه الجملة: حقيقة واقعية أم حكاية من نسج العقل؟</span>
                    
                    <p className="text-base sm:text-lg font-bold text-[#13251E] dark:text-white leading-relaxed py-3">
                      {FACT_OR_STORY_QUESTIONS[gameIndex].statement}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleAnswerGame(true)}
                        disabled={showExplanation}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                          selectedAnswer === true
                            ? FACT_OR_STORY_QUESTIONS[gameIndex].isFact
                              ? 'bg-[#174C3C]/15 border-[#174C3C] text-[#174C3C] dark:bg-[#A9C5A0]/20 dark:border-[#A9C5A0] dark:text-[#A9C5A0]'
                              : 'bg-[#D98F83]/20 border-[#D98F83] text-[#A04436] dark:text-[#E2998E]'
                            : 'bg-[#F7F3E9] dark:bg-[#14271F] border-[#174C3C]/20 dark:border-white/15 text-[#13251E] dark:text-white hover:bg-[#E6E8D8]'
                        }`}
                      >
                        🔍 حقيقة واقعية
                      </button>

                      <button
                        onClick={() => handleAnswerGame(false)}
                        disabled={showExplanation}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                          selectedAnswer === false
                            ? !FACT_OR_STORY_QUESTIONS[gameIndex].isFact
                              ? 'bg-[#174C3C]/15 border-[#174C3C] text-[#174C3C] dark:bg-[#A9C5A0]/20 dark:border-[#A9C5A0] dark:text-[#A9C5A0]'
                              : 'bg-[#D98F83]/20 border-[#D98F83] text-[#A04436] dark:text-[#E2998E]'
                            : 'bg-[#F7F3E9] dark:bg-[#14271F] border-[#174C3C]/20 dark:border-white/15 text-[#13251E] dark:text-white hover:bg-[#E6E8D8]'
                        }`}
                      >
                        📖 حكاية وتفسير
                      </button>
                    </div>

                    {showExplanation && (
                      <div className="p-4 rounded-2xl bg-[#E6E8D8] dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-white/15 text-right space-y-2 animate-fadeIn mt-4">
                        <div className="flex items-center gap-2">
                          {selectedAnswer === FACT_OR_STORY_QUESTIONS[gameIndex].isFact ? (
                            <span className="text-[#174C3C] dark:text-[#A9C5A0] font-bold text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              إجابة ممتازة وواعية!
                            </span>
                          ) : (
                            <span className="text-[#D5A65A] dark:text-[#E2B66C] font-bold text-xs flex items-center gap-1">
                              <HelpCircle className="w-4 h-4" />
                              التمييز الدقيق يحتاج تدريباً:
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#13251E] dark:text-white/90 leading-relaxed">
                          {FACT_OR_STORY_QUESTIONS[gameIndex].explanation}
                        </p>
                        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-[#174C3C]/15 dark:border-white/10 text-[11px] text-[#174C3C] dark:text-[#A9C5A0] font-bold">
                          💡 نصيحة فكّر: {FACT_OR_STORY_QUESTIONS[gameIndex].tip}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleNextGameQuestion}
                            className="btn-nesma-primary text-xs"
                          >
                            <span>السؤال التالي</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 rounded-3xl bg-white dark:bg-[#1B342A] border-2 border-[#174C3C] dark:border-[#A9C5A0] text-center space-y-4 animate-fadeIn">
                  <div className="text-4xl">🎉</div>
                  <h3 className="text-xl font-bold text-[#174C3C] dark:text-white">
                    أكملت جولة لعبة «حقيقة أم حكاية» بنجاح!
                  </h3>
                  <p className="text-xs text-[#263830] dark:text-white/70 max-w-md mx-auto">
                    حققت {score} من {FACT_OR_STORY_QUESTIONS.length} إجابات صحيحة. كلما ميّزت بين ما حدث فعلاً وبين قصص العقل، تمتعت بسلام نفسي أعمق.
                  </p>
                  <div className="pt-3 flex justify-center gap-3">
                    <button
                      onClick={handleRestartGame}
                      className="btn-nesma-secondary text-xs"
                    >
                      إعادة اللعب مجدداً
                    </button>
                    <button
                      onClick={() => setActiveTab('reframing')}
                      className="btn-nesma-primary text-xs"
                    >
                      الانتقال لتفكيك فكرة خاصة
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISTORTIONS ENCYCLOPEDIA */}
          {activeTab === 'distortions' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-[#174C3C]/10 dark:border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[#174C3C] dark:text-white">دليل أفخاخ التفكير والتشوهات الإدراكية</h3>
                <p className="text-xs text-[#263830] dark:text-white/60">
                  فهمك لطريقة عمل هذه الأفخاخ ينزع منها قوتها الخادعة تلقائياً:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COGNITIVE_DISTORTIONS.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-white dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{d.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-[#174C3C] dark:text-white">{d.arabicName}</h4>
                          <span className="text-[10px] text-[#D5A65A] dark:text-[#E2B66C] font-bold">{d.name}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#263830] dark:text-white/70 leading-relaxed">
                      {d.shortDesc}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#D98F83]/15 border border-[#D98F83]/30 text-[11px] text-[#A04436] dark:text-[#E2998E]">
                      <strong>فخ الفكرة:</strong> {d.example}
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 text-[11px] text-[#174C3C] dark:text-[#A9C5A0]">
                      <strong>العلاج الواعي:</strong> {d.antidote}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARCHIVE */}
          {activeTab === 'archive' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-[#174C3C]/10 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#174C3C] dark:text-white">سجل أفكاري المفككة</h3>
                  <p className="text-xs text-[#263830] dark:text-white/60">الأفكار والبطاقات المحفوظة على جهازك بخصوصية تامة:</p>
                </div>
                <span className="badge-nesma-info">{savedEntries.length} بطاقة</span>
              </div>

              {savedEntries.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-white/10 space-y-3">
                  <div className="text-3xl">📭</div>
                  <h4 className="text-sm font-bold text-[#174C3C] dark:text-white">لم تحفظ أي فكرة مفككة بعد</h4>
                  <p className="text-xs text-[#263830] dark:text-white/60 max-w-sm mx-auto">
                    استخدم استوديو تفكيك الأفكار لتحويل أفكارك المقلقة إلى بطاقات حكمة واستعادة هدوئك.
                  </p>
                  <button
                    onClick={() => setActiveTab('reframing')}
                    className="btn-nesma-primary text-xs"
                  >
                    ابدأ تفكيك فكرتك الأولى
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedEntries.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-white/10 space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-[10px] text-[#263830]/60 dark:text-white/40">{item.timestamp}</span>
                        <span className="badge-nesma-info">
                          {item.distortionName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#263830]/70 dark:text-white/50 block font-bold">الموقف:</span>
                        <p className="text-xs text-[#13251E] dark:text-white/90">{item.situation}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-[#D98F83]/15 border border-[#D98F83]/30">
                          <span className="text-[10px] text-[#A04436] dark:text-[#E2998E] block font-bold">الفكرة القديمة:</span>
                          <p className="text-[#13251E] dark:text-red-200 line-through decoration-[#D98F83]">{item.automaticThought}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/25 dark:border-[#A9C5A0]/30">
                          <span className="text-[10px] text-[#174C3C] dark:text-[#A9C5A0] block font-bold">البديل الواقعي:</span>
                          <p className="text-[#174C3C] dark:text-[#A9C5A0] font-bold">{item.rationalAlternative}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 bg-[#E6E8D8]/70 dark:bg-[#0D1914] flex items-center justify-between text-xs text-[#263830] dark:text-white/60">
          <div className="flex items-center gap-2">
            <span className="text-[#174C3C] dark:text-[#A9C5A0]">●</span>
            <span>نسمة حياة — تمارين اليقظة وتفكيك الأفكار</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#174C3C]/20 dark:border-white/20 text-[#13251E] dark:text-white/80 hover:bg-[#174C3C]/5"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
