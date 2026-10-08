import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Sliders, 
  Share2, 
  Download, 
  Maximize2, 
  Layers, 
  Check, 
  Lightbulb, 
  Compass,
  FileText
} from 'lucide-react';
import { 
  COGNITIVE_DISTORTIONS, 
  REFRAMING_SCENARIOS, 
  FACT_OR_STORY_QUESTIONS, 
  SavedFekerEntry 
} from '../data/fekerAppData';

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

  // Iframe state
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const appStudioUrl = 'https://aistudio.google.com/apps/6b9dc7c3-7b9a-4c60-a9f9-b7b8f2ee9985?showPreview=true&showAssistant=true';

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
        setRationalAlternative(scenario.rationalAlternative);
      }
    }
  };

  // Save entry
  const handleSaveEntry = () => {
    const distortion = COGNITIVE_DISTORTIONS.find(d => d.id === selectedDistortionId);
    const newEntry: SavedFekerEntry = {
      id: 'feker-' + Date.now(),
      timestamp: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      situation: situationText || 'موقف شخصي',
      automaticThought: automaticThought || 'فكرة مقلقة',
      distortionName: distortion ? distortion.arabicName : 'تشويه فكري',
      beliefBefore,
      rationalAlternative: rationalAlternative || 'فكرة بديلة واقعية',
      beliefAfter,
      moodImprovementScore: Math.max(10, beliefBefore - beliefAfter)
    };

    const updated = [newEntry, ...savedEntries];
    setSavedEntries(updated);
    try {
      localStorage.setItem('nesmat_feker_saved_entries', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setWizardStep(4);
    }, 1200);
  };

  // Reset wizard
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

  // Answer Fact or Story
  const handleAnswerGame = (userChoiceIsFact: boolean) => {
    if (showExplanation) return;
    const currentQ = FACT_OR_STORY_QUESTIONS[gameIndex];
    setSelectedAnswer(userChoiceIsFact);
    setShowExplanation(true);
    if (userChoiceIsFact === currentQ.isFact) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#141416] border border-[#c4fb6d]/40 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] text-[#e4e4e4] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0c0c0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c4fb6d]/15 border border-[#c4fb6d] flex items-center justify-center text-[#c4fb6d]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c4fb6d]/10 text-[#c4fb6d] font-bold border border-[#c4fb6d]/20">
                  تمارين اليقظة الإدراكية
                </span>
                <span className="text-[10px] text-white/50 hidden sm:inline-block">
                  CBT Reframing & Mind Games
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-syne text-white flex items-center gap-2">
                <span>فكّر — تفكيك الأفكار والمرونة العقلية</span>
                <span className="text-xs font-normal text-[#c4fb6d] font-geist">Feker Studio</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-[#141416] overflow-x-auto no-scrollbar font-geist text-xs">
          <button
            onClick={() => setActiveTab('reframing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 ${
              activeTab === 'reframing'
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold shadow-xs'
                : 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>استوديو تفكيك الأفكار 💡</span>
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 ${
              activeTab === 'game'
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold shadow-xs'
                : 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>لعبة «حقيقة أم حكاية» 🎯</span>
          </button>

          <button
            onClick={() => setActiveTab('distortions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 ${
              activeTab === 'distortions'
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold shadow-xs'
                : 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>دليل أفخاخ التفكير 📚</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all shrink-0 ${
              activeTab === 'archive'
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold shadow-xs'
                : 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
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
              <div className="bg-[#0c0c0e] border border-white/10 p-3 sm:p-4 rounded-2xl flex items-center justify-between text-xs font-mono">
                <div className={`flex items-center gap-2 ${wizardStep >= 1 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 1 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>1</span>
                  <span className="hidden sm:inline">الموقف والفكرة</span>
                </div>
                <div className="h-[1px] flex-1 mx-2 bg-white/10" />
                <div className={`flex items-center gap-2 ${wizardStep >= 2 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 2 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>2</span>
                  <span className="hidden sm:inline">نوع التشويه</span>
                </div>
                <div className="h-[1px] flex-1 mx-2 bg-white/10" />
                <div className={`flex items-center gap-2 ${wizardStep >= 3 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 3 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>3</span>
                  <span className="hidden sm:inline">تفكيك وسؤال</span>
                </div>
                <div className="h-[1px] flex-1 mx-2 bg-white/10" />
                <div className={`flex items-center gap-2 ${wizardStep >= 4 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 4 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>4</span>
                  <span className="hidden sm:inline">البديل والنتيجة</span>
                </div>
              </div>

              {/* STEP 1: Situation & Automatic Thought */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-[#0c0c0e]/60 border border-white/10 p-4 rounded-2xl">
                    <span className="text-xs text-[#c4fb6d] font-mono block mb-1">اختر سيناريو جاهز أو اكتب موقفك الخاص:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => handleSelectScenario('custom')}
                        className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                          selectedScenarioId === 'custom'
                            ? 'bg-[#c4fb6d] text-black font-bold'
                            : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        ✍️ كتابة فكرة شخصية جديدة
                      </button>
                      {REFRAMING_SCENARIOS.map(sc => (
                        <button
                          key={sc.id}
                          onClick={() => handleSelectScenario(sc.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                            selectedScenarioId === sc.id
                              ? 'bg-[#c4fb6d] text-black font-bold'
                              : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                          }`}
                        >
                          {sc.categoryLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#e4e4e4] block mb-1.5">
                        ١. ما هو الموقف أو المحفز الخارجي الذي حدث؟ (الحقيقة المجردة)
                      </label>
                      <input
                        type="text"
                        value={situationText}
                        onChange={(e) => setSituationText(e.target.value)}
                        placeholder="مثال: زميلي لم يرد على رسالتي / تلقيت ملاحظة في الاجتماع..."
                        className="w-full p-3.5 rounded-xl bg-[#0c0c0e] border border-white/15 focus:border-[#c4fb6d] text-sm text-[#e4e4e4] outline-hidden transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#e4e4e4] block mb-1.5">
                        ٢. ما هي الفكرة التلقائية السلبية التي قفزت إلى عقلك فوراً؟
                      </label>
                      <textarea
                        value={automaticThought}
                        onChange={(e) => setAutomaticThought(e.target.value)}
                        rows={3}
                        placeholder="مثال: أكيد يكرهني ولا يطيقني، ومستقبلي في الفريق انتهى..."
                        className="w-full p-3.5 rounded-xl bg-[#0c0c0e] border border-white/15 focus:border-[#c4fb6d] text-sm text-[#e4e4e4] outline-hidden transition-colors"
                      />
                    </div>

                    <div className="p-4 bg-[#0c0c0e] rounded-xl border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-[#e4e4e4]">
                          ما مدى تصديقك واقتناعك بهذه الفكرة حالياً؟
                        </label>
                        <span className="text-sm font-mono font-bold text-[#c4fb6d]">{beliefBefore}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={beliefBefore}
                        onChange={(e) => setBeliefBefore(Number(e.target.value))}
                        className="w-full accent-[#c4fb6d]"
                      />
                      <div className="flex justify-between text-[10px] text-white/40 mt-1">
                        <span>غير مقتنع تماماً (0%)</span>
                        <span>شديد الاقتناع بها (100%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setWizardStep(2)}
                      disabled={!situationText && !automaticThought}
                      className="px-5 py-2.5 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                    <h3 className="text-sm font-bold text-white mb-1">
                      ما هو الفخ الفكري أو التشويه الإدراكي في هذه الفكرة؟
                    </h3>
                    <p className="text-xs text-white/60">
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
                            ? 'bg-[#c4fb6d]/10 border-[#c4fb6d] shadow-sm'
                            : 'bg-[#0c0c0e] border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{d.icon}</span>
                          <span className="font-bold text-xs text-white">{d.arabicName}</span>
                        </div>
                        <p className="text-[11px] text-white/70 leading-relaxed mb-2">
                          {d.shortDesc}
                        </p>
                        <div className="text-[10px] text-[#c4fb6d] font-mono bg-black/40 p-1.5 rounded-lg">
                          مثال: {d.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 border border-white/20 text-white/80 hover:text-white rounded-xl text-xs font-mono"
                    >
                      الرجوع للسابق
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="px-5 py-2.5 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95"
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
                  <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-[#c4fb6d]/30">
                    <div className="flex items-center gap-2 text-xs text-[#c4fb6d] font-bold mb-1">
                      <span>{activeDistortion.icon}</span>
                      <span>ترياق التعامل مع: {activeDistortion.arabicName}</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {activeDistortion.antidote}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white">الأسئلة السقراطية للطعن في صحة الفكرة:</h4>
                    
                    {activeDistortion.socraticQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-[#0c0c0e] border border-white/10 rounded-xl space-y-1.5">
                        <label className="text-xs text-[#c4fb6d] font-bold block">
                          سؤال {idx + 1}: {q}
                        </label>
                        <input
                          type="text"
                          value={idx === 0 ? socraticAnswer1 : socraticAnswer2}
                          onChange={(e) => idx === 0 ? setSocraticAnswer1(e.target.value) : setSocraticAnswer2(e.target.value)}
                          placeholder="اكتب إجابتك الواقعية هنا باختصار..."
                          className="w-full p-2.5 rounded-lg bg-[#141416] border border-white/10 text-xs text-[#e4e4e4] focus:border-[#c4fb6d] outline-hidden"
                        />
                      </div>
                    ))}

                    <div className="pt-2">
                      <label className="text-xs font-bold text-white block mb-1.5">
                        الآن، كيف تصيغ الفكرة البديلة الأكثر حكمة وواقعية؟
                      </label>
                      <textarea
                        value={rationalAlternative}
                        onChange={(e) => setRationalAlternative(e.target.value)}
                        rows={3}
                        placeholder="اكتب بديلاً عادلاً ومطمئناً لا يضخم الأمور..."
                        className="w-full p-3.5 rounded-xl bg-[#0c0c0e] border border-white/15 focus:border-[#c4fb6d] text-sm text-[#e4e4e4] outline-hidden"
                      />
                    </div>

                    <div className="p-4 bg-[#0c0c0e] rounded-xl border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-[#e4e4e4]">
                          ما مدى تصديقك للفكرة السلبية القديمة الآن بعد التفكيك؟
                        </label>
                        <span className="text-sm font-mono font-bold text-[#c4fb6d]">{beliefAfter}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={beliefAfter}
                        onChange={(e) => setBeliefAfter(Number(e.target.value))}
                        className="w-full accent-[#c4fb6d]"
                      />
                      <div className="flex justify-between text-[10px] text-white/40 mt-1">
                        <span>انخفضت تماماً (0%)</span>
                        <span>ما زالت قوية (100%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 border border-white/20 text-white/80 hover:text-white rounded-xl text-xs font-mono"
                    >
                      الرجوع للسابق
                    </button>
                    <button
                      onClick={handleSaveEntry}
                      className="px-5 py-2.5 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95 shadow-md"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-black" />
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
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b2a1e] via-[#141416] to-[#0c0c0e] border-2 border-[#c4fb6d] shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#c4fb6d] px-2 py-0.5 rounded-full bg-[#c4fb6d]/10 border border-[#c4fb6d]/20">
                          بطاقة فكّر للسلام الداخلي ✓
                        </span>
                        <h3 className="text-lg font-black text-white mt-1">
                          تحرير العقل من: {activeDistortion.arabicName}
                        </h3>
                      </div>
                      <span className="text-3xl">{activeDistortion.icon}</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-[10px] text-white/50 block font-mono">الموقف الأصلي:</span>
                        <p className="text-white/90 font-medium mt-0.5">{situationText || 'موقف حياتي'}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                          <span className="text-[10px] text-red-400 block font-mono">الفكرة التلقائية السامة (قبل):</span>
                          <p className="text-red-200 mt-0.5 line-through decoration-red-400">{automaticThought || 'فكرة مقلقة'}</p>
                          <span className="text-[10px] text-red-300/70 mt-1 block">اقتناع سابق: {beliefBefore}%</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#c4fb6d]/10 border border-[#c4fb6d]/30">
                          <span className="text-[10px] text-[#c4fb6d] block font-mono">الفكرة البديلة الواقعية (الآن):</span>
                          <p className="text-emerald-100 font-bold mt-0.5">{rationalAlternative || 'فكرة متوازنة'}</p>
                          <span className="text-[10px] text-[#c4fb6d]/80 mt-1 block">اقتناع جديد: {beliefAfter}% (انخفاض التوتر)</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="text-white/70">مستوى التحسن النفسي المستعاد:</span>
                        <span className="font-mono font-bold text-sm text-[#c4fb6d]">+{Math.max(10, beliefBefore - beliefAfter)}% صفاء ذهني</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleResetWizard}
                      className="px-4 py-2 border border-white/20 hover:border-[#c4fb6d] text-white/80 hover:text-white rounded-xl text-xs font-mono flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>تفكيك فكرة أخرى</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('archive')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono"
                      >
                        عرض سجل أفكاري المحفوظة
                      </button>
                      <button
                        onClick={onClose}
                        className="px-5 py-2 bg-[#c4fb6d] text-black font-bold rounded-xl text-xs"
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
                  <div className="flex justify-between items-center text-xs font-mono text-white/60 pb-2 border-b border-white/10">
                    <span>الجولة {gameIndex + 1} من {FACT_OR_STORY_QUESTIONS.length}</span>
                    <span className="text-[#c4fb6d] font-bold">النقاط: {score}</span>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#0c0c0e] border border-white/15 shadow-md space-y-4 text-center">
                    <span className="text-xs text-[#c4fb6d] font-mono block">هل هذه الجملة: حقيقة واقعية أم حكاية من نسج العقل؟</span>
                    
                    <p className="text-base sm:text-lg font-bold text-white leading-relaxed py-3">
                      {FACT_OR_STORY_QUESTIONS[gameIndex].statement}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleAnswerGame(true)}
                        disabled={showExplanation}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                          selectedAnswer === true
                            ? FACT_OR_STORY_QUESTIONS[gameIndex].isFact
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-red-500/20 border-red-400 text-red-300'
                            : 'bg-white/5 border-white/15 hover:border-[#c4fb6d] text-white hover:bg-white/10'
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
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-red-500/20 border-red-400 text-red-300'
                            : 'bg-white/5 border-white/15 hover:border-[#c4fb6d] text-white hover:bg-white/10'
                        }`}
                      >
                        📖 حكاية وتفسير
                      </button>
                    </div>

                    {showExplanation && (
                      <div className="p-4 rounded-2xl bg-black/60 border border-white/15 text-right space-y-2 animate-fadeIn mt-4">
                        <div className="flex items-center gap-2">
                          {selectedAnswer === FACT_OR_STORY_QUESTIONS[gameIndex].isFact ? (
                            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              إجابة ممتازة وواعية!
                            </span>
                          ) : (
                            <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                              <HelpCircle className="w-4 h-4" />
                              التمييز الدقيق يحتاج تدريباً:
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed">
                          {FACT_OR_STORY_QUESTIONS[gameIndex].explanation}
                        </p>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#c4fb6d]">
                          💡 نصيحة فكّر: {FACT_OR_STORY_QUESTIONS[gameIndex].tip}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleNextGameQuestion}
                            className="px-4 py-2 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-1.5"
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
                <div className="p-8 rounded-3xl bg-[#0c0c0e] border-2 border-[#c4fb6d] text-center space-y-4 animate-fadeIn">
                  <div className="text-4xl">🎉</div>
                  <h3 className="text-xl font-black text-white">
                    أكملت جولة لعبة «حقيقة أم حكاية» بنجاح!
                  </h3>
                  <p className="text-xs text-white/70 max-w-md mx-auto">
                    حققت {score} من {FACT_OR_STORY_QUESTIONS.length} إجابات صحيحة. كلما ميّزت بين ما حدث فعلاً وبين قصص العقل، تمتعت بسلام نفسي أعمق.
                  </p>
                  <div className="pt-3 flex justify-center gap-3">
                    <button
                      onClick={handleRestartGame}
                      className="px-5 py-2.5 border border-white/20 hover:border-[#c4fb6d] rounded-xl text-xs font-mono"
                    >
                      إعادة اللعب مجدداً
                    </button>
                    <button
                      onClick={() => setActiveTab('reframing')}
                      className="px-5 py-2.5 bg-[#c4fb6d] text-black font-bold rounded-xl text-xs"
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
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">دليل أفخاخ التفكير والتشوهات الإدراكية</h3>
                <p className="text-xs text-white/60">
                  فهمك لطريقة عمل هذه الأفخاخ ينزع منها قوتها الخادعة تلقائياً:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COGNITIVE_DISTORTIONS.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-[#0c0c0e] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{d.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-white">{d.arabicName}</h4>
                          <span className="text-[10px] font-mono text-[#c4fb6d]">{d.name}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed">
                      {d.shortDesc}
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-red-300">
                      <strong>فخ الفكرة:</strong> {d.example}
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#c4fb6d]/10 border border-[#c4fb6d]/20 text-[11px] text-emerald-200">
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
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">سجل أفكاري المفككة</h3>
                  <p className="text-xs text-white/60">الأفكار والبطاقات المحفوظة على جهازك بخصوصية تامة:</p>
                </div>
                <span className="text-xs font-mono text-[#c4fb6d]">{savedEntries.length} بطاقة</span>
              </div>

              {savedEntries.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-3xl bg-[#0c0c0e] border border-white/10 space-y-3">
                  <div className="text-3xl">📭</div>
                  <h4 className="text-sm font-bold text-white">لم تحفظ أي فكرة مفككة بعد</h4>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    استخدم استوديو تفكيك الأفكار لتحويل أفكارك المقلقة إلى بطاقات حكمة واستعادة هدوئك.
                  </p>
                  <button
                    onClick={() => setActiveTab('reframing')}
                    className="mt-2 px-4 py-2 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl"
                  >
                    ابدأ تفكيك فكرتك الأولى
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedEntries.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-[#0c0c0e] border border-white/10 space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-mono text-[10px] text-white/40">{item.timestamp}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#c4fb6d]/15 text-[#c4fb6d] text-[10px] font-bold">
                          {item.distortionName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-white/50 block font-mono">الموقف:</span>
                        <p className="text-xs text-white/90">{item.situation}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20">
                          <span className="text-[10px] text-red-400 block font-mono">الفكرة القديمة:</span>
                          <p className="text-red-200 line-through decoration-red-400">{item.automaticThought}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#c4fb6d]/10 border border-[#c4fb6d]/30">
                          <span className="text-[10px] text-[#c4fb6d] block font-mono">البديل الواقعي:</span>
                          <p className="text-emerald-100 font-bold">{item.rationalAlternative}</p>
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
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0c0c0e] flex items-center justify-between text-xs text-white/60 font-geist">
          <div className="flex items-center gap-2">
            <span className="text-[#c4fb6d]">●</span>
            <span>نسمة حياة — تمارين اليقظة وتفكيك الأفكار</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-white/20 text-white/80 hover:text-white"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
