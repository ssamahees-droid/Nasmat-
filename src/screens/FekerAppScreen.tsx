import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Check, 
  FileText
} from 'lucide-react';
import { 
  COGNITIVE_DISTORTIONS, 
  REFRAMING_SCENARIOS, 
  FACT_OR_STORY_QUESTIONS, 
  SavedFekerEntry 
} from '../data/fekerAppData';
import { TextAudioPlayer } from '../components/TextAudioPlayer';

interface FekerAppScreenProps {
  onBackToHome?: () => void;
  initialTab?: 'reframing' | 'game' | 'distortions' | 'archive';
}

export const FekerAppScreen: React.FC<FekerAppScreenProps> = ({ 
  onBackToHome,
  initialTab = 'reframing'
}) => {
  const [activeTab, setActiveTab] = useState<'reframing' | 'game' | 'distortions' | 'archive'>(initialTab);

  // Sync initialTab
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
    <div className="min-h-screen bg-[#F7F3E9] dark:bg-[#0D1914] text-[#13251E] dark:text-[#F7F3E9] pb-24 transition-colors">
      
      {/* Top Banner & Header */}
      <section className="bg-[#E6E8D8]/70 dark:bg-[#14271F] border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 p-6 sm:p-10">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/30 dark:border-[#A9C5A0]/30 flex items-center justify-center text-[#174C3C] dark:text-[#A9C5A0]">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 text-[#174C3C] dark:text-[#A9C5A0] border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
                    تمارين اليقظة الإدراكية
                  </span>
                  <span className="text-[11px] text-[#263830]/70 dark:text-[#D5DFD7]/70 font-bold">
                    CBT Reframing
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#174C3C] dark:text-[#F7F3E9] mt-1">
                  فكّر — استوديو تفكيك الأفكار والمرونة العقلية 🧠
                </h1>
              </div>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="btn-nesma-primary text-xs"
              >
                <span>العودة للرئيسية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="max-w-2xl text-xs sm:text-sm text-[#263830] dark:text-[#D5DFD7] leading-relaxed">
            مساحة واعية لتفكيك الأفكار التلقائية السلبية، كشف التشوهات المعرفية (CBT)، واختبار واقعية أفكارك بلعبة «حقيقة أم حكاية».
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('reframing')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 font-bold ${
                activeTab === 'reframing'
                  ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                  : 'border-[#174C3C]/15 dark:border-white/10 bg-white dark:bg-[#14271F] text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8]'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>استوديو تفكيك الأفكار 💡</span>
            </button>

            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 font-bold ${
                activeTab === 'game'
                  ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                  : 'border-[#174C3C]/15 dark:border-white/10 bg-white dark:bg-[#14271F] text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>لعبة «حقيقة أم حكاية» 🎯</span>
            </button>

            <button
              onClick={() => setActiveTab('distortions')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 font-bold ${
                activeTab === 'distortions'
                  ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                  : 'border-[#174C3C]/15 dark:border-white/10 bg-white dark:bg-[#14271F] text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل أفخاخ التفكير 📚</span>
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all shrink-0 font-bold ${
                activeTab === 'archive'
                  ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                  : 'border-[#174C3C]/15 dark:border-white/10 bg-white dark:bg-[#14271F] text-[#13251E]/70 dark:text-white/70 hover:bg-[#E6E8D8]'
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
          <div className="bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            
            {/* Stepper */}
            <div className="bg-[#E6E8D8]/70 dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 p-4 rounded-2xl flex items-center justify-between text-xs font-bold">
              <div className={`flex items-center gap-2 ${wizardStep >= 1 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 1 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>1</span>
                <span>الموقف والفكرة</span>
              </div>
              <div className="h-[1px] flex-1 mx-2 bg-[#174C3C]/15 dark:bg-white/10" />
              <div className={`flex items-center gap-2 ${wizardStep >= 2 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 2 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>2</span>
                <span>نوع التشويه</span>
              </div>
              <div className="h-[1px] flex-1 mx-2 bg-[#174C3C]/15 dark:bg-white/10" />
              <div className={`flex items-center gap-2 ${wizardStep >= 3 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 3 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>3</span>
                <span>الأسئلة السقراطية</span>
              </div>
              <div className="h-[1px] flex-1 mx-2 bg-[#174C3C]/15 dark:bg-white/10" />
              <div className={`flex items-center gap-2 ${wizardStep >= 4 ? 'text-[#174C3C] dark:text-[#A9C5A0]' : 'text-[#13251E]/40 dark:text-white/40'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${wizardStep >= 4 ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]' : 'border border-[#174C3C]/20 dark:border-white/20'}`}>4</span>
                <span>البديل الحكيم</span>
              </div>
            </div>

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="bg-[#E6E8D8]/50 dark:bg-[#1B342A] border border-[#174C3C]/15 dark:border-white/10 p-4 rounded-2xl">
                  <span className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold block mb-2">اختر موقفاً نموذجياً أو ابدأ بكتابة فكرتك:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSelectScenario('custom')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all font-bold ${
                        selectedScenarioId === 'custom'
                          ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                          : 'bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 text-[#13251E] dark:text-white/80 hover:bg-[#E6E8D8]'
                      }`}
                    >
                      ✍️ كتابة فكرة شخصية حرة
                    </button>
                    {REFRAMING_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(sc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs transition-all font-bold ${
                          selectedScenarioId === sc.id
                            ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                            : 'bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 text-[#13251E] dark:text-white/80 hover:bg-[#E6E8D8]'
                        }`}
                      >
                        {sc.categoryLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9] block mb-1.5">
                      ١. الموقف أو الحدث الظاهري (ما الذي حدث بالفعل؟)
                    </label>
                    <input
                      type="text"
                      value={situationText}
                      onChange={(e) => setSituationText(e.target.value)}
                      placeholder="مثال: لم أحصل على الرد المطلوب في العمل، أو حدث خلاف بسيط مع صديق..."
                      className="w-full p-3.5 rounded-xl bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] text-sm text-[#13251E] dark:text-[#F7F3E9] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9] block mb-1.5">
                      ٢. الفكرة التلقائية التي خطرت في ذهنك فوراً (ماذا قال عقلك؟)
                    </label>
                    <textarea
                      value={automaticThought}
                      onChange={(e) => setAutomaticThought(e.target.value)}
                      rows={3}
                      placeholder="مثال: أنا فاشل ولن يثق بي أحد، وسأفقد وظيفتي أو احترامي..."
                      className="w-full p-3.5 rounded-xl bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] text-sm text-[#13251E] dark:text-[#F7F3E9] outline-hidden"
                    />
                  </div>

                  <div className="p-4 bg-[#E6E8D8]/50 dark:bg-[#1B342A] rounded-xl border border-[#174C3C]/15 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9]">
                        درجة تصديقك لهذه الفكرة السلبية حالياً:
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
                          ? 'bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 border-[#174C3C] dark:border-[#A9C5A0] shadow-sm'
                          : 'bg-[#F7F3E9] dark:bg-[#1B342A] border-[#174C3C]/15 dark:border-white/10 hover:border-[#174C3C]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl">{d.icon}</span>
                        <span className="font-bold text-sm text-[#174C3C] dark:text-white">{d.arabicName}</span>
                      </div>
                      <p className="text-xs text-[#263830] dark:text-white/70 leading-relaxed mb-2">
                        {d.shortDesc}
                      </p>
                      <div className="text-[10px] text-[#174C3C] dark:text-[#A9C5A0] bg-[#E6E8D8] dark:bg-[#0D1914] p-2 rounded-lg font-bold">
                        مثال: {d.example}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-3">
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
                    <span>تطبيق الأسئلة السقراطية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#E6E8D8] dark:bg-[#1B342A] border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
                  <div className="flex items-center gap-2 text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold mb-1">
                    <span>{activeDistortion.icon}</span>
                    <span>ترياق التعامل مع: {activeDistortion.arabicName}</span>
                  </div>
                  <p className="text-xs text-[#13251E] dark:text-white/80 leading-relaxed">
                    {activeDistortion.antidote}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeDistortion.socraticQuestions.map((q, idx) => (
                    <div key={idx} className="p-3.5 bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-white/10 rounded-xl space-y-1.5">
                      <label className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold block">
                        سؤال التحدي {idx + 1}: {q}
                      </label>
                      <input
                        type="text"
                        value={idx === 0 ? socraticAnswer1 : socraticAnswer2}
                        onChange={(e) => idx === 0 ? setSocraticAnswer1(e.target.value) : setSocraticAnswer2(e.target.value)}
                        placeholder="إجابتك الواقعية الهادئة..."
                        className="w-full p-2.5 rounded-lg bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/10 text-xs text-[#13251E] dark:text-[#F7F3E9] focus:border-[#174C3C] dark:focus:border-[#A9C5A0] outline-hidden"
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="text-xs font-bold text-[#13251E] dark:text-white block mb-1.5">
                      الصياغة البديلة الأكثر رحمة وواقعية:
                    </label>
                    <textarea
                      value={rationalAlternative}
                      onChange={(e) => setRationalAlternative(e.target.value)}
                      rows={3}
                      placeholder="اكتب صياغة بديلة عادلة..."
                      className="w-full p-3.5 rounded-xl bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] text-sm text-[#13251E] dark:text-[#F7F3E9] outline-hidden"
                    />
                  </div>

                  <div className="p-4 bg-[#E6E8D8]/50 dark:bg-[#1B342A] rounded-xl border border-[#174C3C]/15 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9]">
                        درجة تصديق الفكرة السلبية القديمة الآن بعد التفكيك:
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
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="btn-nesma-secondary text-xs"
                  >
                    السابق
                  </button>
                  <button
                    onClick={handleSaveEntry}
                    className="btn-nesma-primary text-xs"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
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
                <div className="p-6 rounded-3xl bg-[#E6E8D8]/40 dark:bg-[#1B342A] border-2 border-[#174C3C] dark:border-[#A9C5A0] shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#174C3C] dark:text-[#A9C5A0] px-2.5 py-0.5 rounded-full bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
                      بطاقة فكّر للسلام الذهني 🌿
                    </span>
                    <TextAudioPlayer
                      text={`البديل الواقعي: ${rationalAlternative}. ترياق التعامل: ${activeDistortion.antidote}`}
                      id="feker_screen_card"
                      variant="compact"
                      label="اسمع البديل"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#174C3C] dark:text-white mt-2">
                    تم التفكيك: {activeDistortion.arabicName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#D98F83]/15 border border-[#D98F83]/30">
                      <span className="text-[#A04436] dark:text-[#E2998E] font-bold text-[11px] block">الفكرة القديمة (قبل):</span>
                      <p className="text-[#13251E] dark:text-red-200 mt-1 line-through decoration-[#D98F83]">{automaticThought}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/30 dark:border-[#A9C5A0]/30">
                      <span className="text-[#174C3C] dark:text-[#A9C5A0] font-bold text-[11px] block">البديل الواقعي (الآن):</span>
                      <p className="text-[#174C3C] dark:text-[#A9C5A0] font-bold mt-1">{rationalAlternative}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={handleResetWizard}
                    className="btn-nesma-secondary text-xs"
                  >
                    تفكيك فكرة أخرى
                  </button>
                  <button
                    onClick={() => setActiveTab('archive')}
                    className="btn-nesma-primary text-xs"
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
          <div className="bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto space-y-6 shadow-sm">
            {!gameCompleted ? (
              <>
                <div className="flex justify-between items-center text-xs text-[#263830] dark:text-white/60 pb-3 border-b border-[#174C3C]/10 dark:border-white/10">
                  <span>السؤال {gameIndex + 1} من {FACT_OR_STORY_QUESTIONS.length}</span>
                  <span className="text-[#174C3C] dark:text-[#A9C5A0] font-bold">النقاط: {score}</span>
                </div>

                <div className="text-center space-y-4">
                  <span className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold block">
                    هل هذه الجملة: حقيقة واقعية أم حكاية وتفسير؟
                  </span>

                  <p className="text-lg font-bold text-[#13251E] dark:text-white leading-relaxed">
                    {FACT_OR_STORY_QUESTIONS[gameIndex].statement}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3">
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
                    <div className="p-4 rounded-2xl bg-[#E6E8D8] dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-white/15 text-right space-y-2 mt-4">
                      <p className="text-xs text-[#13251E] dark:text-white/90">
                        {FACT_OR_STORY_QUESTIONS[gameIndex].explanation}
                      </p>
                      <div className="text-[11px] text-[#174C3C] dark:text-[#A9C5A0] font-bold">
                        💡 نصيحة: {FACT_OR_STORY_QUESTIONS[gameIndex].tip}
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextGameQuestion}
                          className="btn-nesma-primary text-xs"
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
                <h3 className="text-xl font-bold text-[#174C3C] dark:text-white">رائع! انتهت الجولة بنجاح</h3>
                <p className="text-xs text-[#263830] dark:text-white/70">
                  حصلت على {score} من {FACT_OR_STORY_QUESTIONS.length} نقاط.
                </p>
                <button
                  onClick={handleRestartGame}
                  className="btn-nesma-primary text-xs"
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
              <div key={d.id} className="p-5 rounded-3xl bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{d.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#174C3C] dark:text-white">{d.arabicName}</h4>
                    <span className="text-[10px] text-[#D5A65A] dark:text-[#E2B66C] font-bold">{d.name}</span>
                  </div>
                </div>
                <p className="text-xs text-[#263830] dark:text-white/70 leading-relaxed">{d.shortDesc}</p>
                <div className="p-2.5 rounded-xl bg-[#D98F83]/15 border border-[#D98F83]/30 text-[11px] text-[#A04436] dark:text-[#E2998E]">
                  <strong>الفخ:</strong> {d.example}
                </div>
                <div className="p-2.5 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 text-[11px] text-[#174C3C] dark:text-[#A9C5A0]">
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
              <div className="text-center py-12 p-8 rounded-3xl bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 space-y-3">
                <div className="text-3xl">📭</div>
                <h4 className="text-sm font-bold text-[#174C3C] dark:text-white">لا توجد بطاقات محفوظة حتى الآن</h4>
                <p className="text-xs text-[#263830] dark:text-white/60">
                  استخدم استوديو تفكيك الأفكار لحفظ أول بطاقة سلام ذهني.
                </p>
              </div>
            ) : (
              savedEntries.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] text-[#263830]/60 dark:text-white/40">{item.timestamp}</span>
                    <span className="badge-nesma-info">
                      {item.distortionName}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-[#D98F83]/15 border border-[#D98F83]/30">
                      <p className="text-[#13251E] dark:text-red-200 line-through decoration-[#D98F83]">{item.automaticThought}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 border border-[#174C3C]/25 dark:border-[#A9C5A0]/30">
                      <p className="text-[#174C3C] dark:text-[#A9C5A0] font-bold">{item.rationalAlternative}</p>
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
