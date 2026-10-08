import React, { useState } from 'react';
import { 
  Brain, 
  ExternalLink, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ArrowLeft, 
  Check 
} from 'lucide-react';
import { 
  COGNITIVE_DISTORTIONS, 
  REFRAMING_SCENARIOS, 
  FACT_OR_STORY_QUESTIONS, 
  SavedFekerEntry 
} from '../data/fekerAppData';

interface FekerAppScreenProps {
  onBackToHome?: () => void;
}

export const FekerAppScreen: React.FC<FekerAppScreenProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'reframing' | 'game' | 'distortions' | 'archive' | 'embed'>('reframing');

  // Wizard state
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

  // Saved Entries
  const [savedEntries, setSavedEntries] = useState<SavedFekerEntry[]>(() => {
    try {
      const stored = localStorage.getItem('nesmat_feker_saved_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Fact vs Story Game
  const [gameIndex, setGameIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const appStudioUrl = 'https://aistudio.google.com/apps/6b9dc7c3-7b9a-4c60-a9f9-b7b8f2ee9985?showPreview=true&showAssistant=true';

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
    }, 1000);
  };

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
    <div className="min-h-screen bg-[#0c0c0e] text-[#e4e4e4] pb-24">
      
      {/* Top Banner & Header */}
      <section className="bg-gradient-to-b from-[#141416] to-[#0c0c0e] border-b border-white/10 p-6 sm:p-10">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c4fb6d]/15 border-2 border-[#c4fb6d] flex items-center justify-center text-[#c4fb6d]">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#c4fb6d]/20 text-[#c4fb6d] font-bold border border-[#c4fb6d]/30">
                    تمارين اليقظة الإدراكية
                  </span>
                  <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-mono">
                    CBT Reframing
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-syne text-white mt-1">
                  فكّر — استوديو تفكيك الأفكار والمرونة العقلية 🧠
                </h1>
              </div>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-4 py-2 bg-[#c4fb6d] hover:bg-[#b2f34f] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <span>العودة للرئيسية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="max-w-2xl text-xs sm:text-sm text-[#e4e4e4]/70 leading-relaxed font-geist">
            مساحة واعية لتفكيك الأفكار التلقائية السلبية، كشف التشوهات المعرفية (CBT)، واختبار واقعية أفكارك بلعبة «حقيقة أم حكاية».
          </p>

          {/* Navigation Pills */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar font-geist text-xs">
            <button
              onClick={() => setActiveTab('reframing')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                activeTab === 'reframing'
                  ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold'
                  : 'border-white/10 bg-[#141416] text-white/70 hover:border-white/30'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>استوديو تفكيك الأفكار 💡</span>
            </button>

            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                activeTab === 'game'
                  ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold'
                  : 'border-white/10 bg-[#141416] text-white/70 hover:border-white/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>لعبة «حقيقة أم حكاية» 🎯</span>
            </button>

            <button
              onClick={() => setActiveTab('distortions')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                activeTab === 'distortions'
                  ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold'
                  : 'border-white/10 bg-[#141416] text-white/70 hover:border-white/30'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل أفخاخ التفكير 📚</span>
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                activeTab === 'archive'
                  ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold'
                  : 'border-white/10 bg-[#141416] text-white/70 hover:border-white/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>سجل أفكاري ({savedEntries.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main View Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">

        {/* 1. REFRAMING STUDIO */}
        {activeTab === 'reframing' && (
          <div className="bg-[#141416] border border-white/10 rounded-3xl p-5 sm:p-8 space-y-6">
            
            {/* Stepper */}
            <div className="bg-[#0c0c0e] border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs font-mono">
              <div className={`flex items-center gap-2 ${wizardStep >= 1 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 1 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>1</span>
                <span>الموقف والفكرة</span>
              </div>
              <div className="h-[1px] flex-1 mx-2 bg-white/10" />
              <div className={`flex items-center gap-2 ${wizardStep >= 2 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 2 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>2</span>
                <span>نوع التشويه</span>
              </div>
              <div className="h-[1px] flex-1 mx-2 bg-white/10" />
              <div className={`flex items-center gap-2 ${wizardStep >= 3 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 3 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>3</span>
                <span>الأسئلة السقراطية</span>
              </div>
              <div className="h-[1px] flex-1 mx-2 bg-white/10" />
              <div className={`flex items-center gap-2 ${wizardStep >= 4 ? 'text-[#c4fb6d]' : 'text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 4 ? 'bg-[#c4fb6d] text-black' : 'border border-white/20'}`}>4</span>
                <span>البديل الحكيم</span>
              </div>
            </div>

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="bg-[#0c0c0e]/80 border border-white/10 p-4 rounded-2xl">
                  <span className="text-xs text-[#c4fb6d] font-mono block mb-2">اختر موقفاً نموذجياً أو ابدأ بكتابة فكرتك:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSelectScenario('custom')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                        selectedScenarioId === 'custom'
                          ? 'bg-[#c4fb6d] text-black font-bold'
                          : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      ✍️ كتابة فكرة شخصية حرة
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

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-[#e4e4e4] block mb-1.5">
                      ١. الموقف أو الحدث الظاهري (ما الذي حدث بالفعل؟)
                    </label>
                    <input
                      type="text"
                      value={situationText}
                      onChange={(e) => setSituationText(e.target.value)}
                      placeholder="مثال: لم أحصل على الرد المطلوب في العمل، أو حدث خلاف بسيط مع صديق..."
                      className="w-full p-3.5 rounded-xl bg-[#0c0c0e] border border-white/15 focus:border-[#c4fb6d] text-sm text-[#e4e4e4] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#e4e4e4] block mb-1.5">
                      ٢. الفكرة التلقائية التي خطرت في ذهنك فوراً (ماذا قال عقلك؟)
                    </label>
                    <textarea
                      value={automaticThought}
                      onChange={(e) => setAutomaticThought(e.target.value)}
                      rows={3}
                      placeholder="مثال: أنا فاشل ولن يثق بي أحد، وسأفقد وظيفتي أو احترامي..."
                      className="w-full p-3.5 rounded-xl bg-[#0c0c0e] border border-white/15 focus:border-[#c4fb6d] text-sm text-[#e4e4e4] outline-hidden"
                    />
                  </div>

                  <div className="p-4 bg-[#0c0c0e] rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#e4e4e4]">
                        درجة تصديقك لهذه الفكرة السلبية حالياً:
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
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={!situationText && !automaticThought}
                    className="px-6 py-3 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span>الانتقال لكشف نوع التشويه</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {COGNITIVE_DISTORTIONS.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDistortionId(d.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedDistortionId === d.id
                          ? 'bg-[#c4fb6d]/10 border-[#c4fb6d] shadow-sm'
                          : 'bg-[#0c0c0e] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl">{d.icon}</span>
                        <span className="font-bold text-sm text-white">{d.arabicName}</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed mb-2">
                        {d.shortDesc}
                      </p>
                      <div className="text-[10px] text-[#c4fb6d] font-mono bg-black/40 p-2 rounded-lg">
                        مثال: {d.example}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2.5 border border-white/20 text-white/80 hover:text-white rounded-xl text-xs font-mono"
                  >
                    الرجوع للسابق
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-2.5 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95"
                  >
                    <span>تطبيق الأسئلة السقراطية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
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
                  {activeDistortion.socraticQuestions.map((q, idx) => (
                    <div key={idx} className="p-3.5 bg-[#0c0c0e] border border-white/10 rounded-xl space-y-1.5">
                      <label className="text-xs text-[#c4fb6d] font-bold block">
                        سؤال التحدي {idx + 1}: {q}
                      </label>
                      <input
                        type="text"
                        value={idx === 0 ? socraticAnswer1 : socraticAnswer2}
                        onChange={(e) => idx === 0 ? setSocraticAnswer1(e.target.value) : setSocraticAnswer2(e.target.value)}
                        placeholder="إجابتك الواقعية الهادئة..."
                        className="w-full p-2.5 rounded-lg bg-[#141416] border border-white/10 text-xs text-[#e4e4e4] focus:border-[#c4fb6d] outline-hidden"
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="text-xs font-bold text-white block mb-1.5">
                      الصياغة البديلة الأكثر رحمة وواقعية:
                    </label>
                    <textarea
                      value={rationalAlternative}
                      onChange={(e) => setRationalAlternative(e.target.value)}
                      rows={3}
                      placeholder="اكتب صياغة بديلة عادلة..."
                      className="w-full p-3.5 rounded-xl bg-[#0c0c0e] border border-white/15 focus:border-[#c4fb6d] text-sm text-[#e4e4e4] outline-hidden"
                    />
                  </div>

                  <div className="p-4 bg-[#0c0c0e] rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#e4e4e4]">
                        درجة تصديق الفكرة السلبية القديمة الآن بعد التفكيك:
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
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 border border-white/20 text-white/80 hover:text-white rounded-xl text-xs font-mono"
                  >
                    السابق
                  </button>
                  <button
                    onClick={handleSaveEntry}
                    className="px-6 py-2.5 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-black" />
                        <span>تم الحفظ!</span>
                      </>
                    ) : (
                      <>
                        <span>حفظ في سجل أفكاري</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {wizardStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b2a1e] via-[#141416] to-[#0c0c0e] border-2 border-[#c4fb6d] shadow-lg">
                  <span className="text-[10px] font-mono uppercase text-[#c4fb6d] px-2.5 py-0.5 rounded-full bg-[#c4fb6d]/15 border border-[#c4fb6d]/30">
                    بطاقة فكّر للسلام الذهني 🌿
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">
                    تم التفكيك: {activeDistortion.arabicName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                      <span className="text-red-400 font-mono text-[10px] block">الفكرة القديمة (قبل):</span>
                      <p className="text-red-200 mt-1 line-through">{automaticThought}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#c4fb6d]/10 border border-[#c4fb6d]/30">
                      <span className="text-[#c4fb6d] font-mono text-[10px] block">البديل الواقعي (الآن):</span>
                      <p className="text-emerald-100 font-bold mt-1">{rationalAlternative}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={handleResetWizard}
                    className="px-4 py-2 border border-white/20 rounded-xl text-xs font-mono"
                  >
                    تفكيك فكرة أخرى
                  </button>
                  <button
                    onClick={() => setActiveTab('archive')}
                    className="px-5 py-2.5 bg-[#c4fb6d] text-black font-bold rounded-xl text-xs"
                  >
                    عرض سجل أفكاري المحفوظة
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 2. GAME TAB */}
        {activeTab === 'game' && (
          <div className="bg-[#141416] border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto space-y-6">
            {!gameCompleted ? (
              <>
                <div className="flex justify-between items-center text-xs font-mono text-white/60 pb-3 border-b border-white/10">
                  <span>السؤال {gameIndex + 1} من {FACT_OR_STORY_QUESTIONS.length}</span>
                  <span className="text-[#c4fb6d] font-bold">النقاط: {score}</span>
                </div>

                <div className="text-center space-y-4">
                  <span className="text-xs text-[#c4fb6d] font-mono block">
                    هل هذه الجملة: حقيقة واقعية أم حكاية وتفسير؟
                  </span>

                  <p className="text-lg font-bold text-white leading-relaxed">
                    {FACT_OR_STORY_QUESTIONS[gameIndex].statement}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3">
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
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/15 text-right space-y-2 mt-4">
                      <p className="text-xs text-white/90">
                        {FACT_OR_STORY_QUESTIONS[gameIndex].explanation}
                      </p>
                      <div className="text-[11px] text-[#c4fb6d]">
                        💡 نصيحة: {FACT_OR_STORY_QUESTIONS[gameIndex].tip}
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextGameQuestion}
                          className="px-4 py-2 bg-[#c4fb6d] text-black font-bold text-xs rounded-xl"
                        >
                          السؤال التالي
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-8">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-black text-white">رائع! انتهت الجولة بنجاح</h3>
                <p className="text-xs text-white/70">
                  حصلت على {score} من {FACT_OR_STORY_QUESTIONS.length} نقاط.
                </p>
                <button
                  onClick={handleRestartGame}
                  className="px-5 py-2.5 bg-[#c4fb6d] text-black font-bold rounded-xl text-xs"
                >
                  إعادة اللعب مجدداً
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. DISTORTIONS TAB */}
        {activeTab === 'distortions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COGNITIVE_DISTORTIONS.map((d) => (
              <div key={d.id} className="p-5 rounded-3xl bg-[#141416] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{d.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{d.arabicName}</h4>
                    <span className="text-[10px] font-mono text-[#c4fb6d]">{d.name}</span>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{d.shortDesc}</p>
                <div className="p-2.5 rounded-xl bg-black/40 text-[11px] text-red-300">
                  <strong>الفخ:</strong> {d.example}
                </div>
                <div className="p-2.5 rounded-xl bg-[#c4fb6d]/10 text-[11px] text-emerald-200">
                  <strong>العلاج:</strong> {d.antidote}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. ARCHIVE TAB */}
        {activeTab === 'archive' && (
          <div className="space-y-4">
            {savedEntries.length === 0 ? (
              <div className="text-center py-12 p-8 rounded-3xl bg-[#141416] border border-white/10 space-y-3">
                <div className="text-3xl">📭</div>
                <h4 className="text-sm font-bold text-white">لا توجد بطاقات محفوظة حتى الآن</h4>
                <p className="text-xs text-white/60">
                  استخدم استوديو تفكيك الأفكار لحفظ أول بطاقة سلام ذهني.
                </p>
              </div>
            ) : (
              savedEntries.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[10px] text-white/40">{item.timestamp}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#c4fb6d]/15 text-[#c4fb6d] text-[10px] font-bold">
                      {item.distortionName}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20">
                      <p className="text-red-200 line-through">{item.automaticThought}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#c4fb6d]/10 border border-[#c4fb6d]/30">
                      <p className="text-emerald-100 font-bold">{item.rationalAlternative}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>

    </div>
  );
};
