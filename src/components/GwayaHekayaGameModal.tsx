import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Heart, 
  Compass, 
  Lightbulb, 
  Gift, 
  Trophy, 
  Share2, 
  Download,
  Flame,
  Wind
} from 'lucide-react';
import { 
  GWAYA_CHAPTERS, 
  GWAYA_PRESETS, 
  GWAYA_STAGES, 
  getContextualPlan, 
  GameChapter, 
  SituationPreset, 
  StageInfo 
} from '../data/gwayaHekayaData';
import { storage } from '../services/storage';
import { TakeawayResultCard } from './TakeawayResultCard';

interface GwayaHekayaGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GwayaHekayaGameModal: React.FC<GwayaHekayaGameModalProps> = ({ isOpen, onClose }) => {
  // Navigation & selection state
  const [activeChapter, setActiveChapter] = useState<string>('relationships');
  const [currentStageId, setCurrentStageId] = useState<string>('fact');
  const [customSituation, setCustomSituation] = useState<string>('بعت رسالة من بدري… ولسه مفيش رد.');
  
  // Selections made during the journey
  const [selectedThought, setSelectedThought] = useState<'fear' | 'interpretation' | 'neutral' | null>('interpretation');
  const [selectedFeeling, setSelectedFeeling] = useState<string>('قلق');
  const [selectedBodySignal, setSelectedBodySignal] = useState<string>('نَفَسي قصير شوية');
  const [selectedNeed, setSelectedNeed] = useState<string>('وضوح');
  const [completedPractice, setCompletedPractice] = useState<boolean>(false);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  
  // Mystery Box State
  const [isMysteryOpen, setIsMysteryOpen] = useState(false);
  const [mysteryExerciseCompleted, setMysteryExerciseCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStageId('fact');
      setCompletedPractice(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPlan = getContextualPlan(customSituation);
  const currentStageIndex = GWAYA_STAGES.findIndex(s => s.id === currentStageId);
  const currentStageInfo = GWAYA_STAGES[currentStageIndex] || GWAYA_STAGES[0];
  const activeChapterInfo = GWAYA_CHAPTERS.find(c => c.id === activeChapter) || GWAYA_CHAPTERS[0];
  const chapterPresets = GWAYA_PRESETS.filter(p => p.chapter === activeChapter);

  const handleNextStage = () => {
    if (currentStageIndex < GWAYA_STAGES.length - 1) {
      setCurrentStageId(GWAYA_STAGES[currentStageIndex + 1].id);
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageId(GWAYA_STAGES[currentStageIndex - 1].id);
    }
  };

  const handleSurpriseMe = () => {
    const all = GWAYA_PRESETS;
    const random = all[Math.floor(Math.random() * all.length)];
    setActiveChapter(random.chapter);
    setCustomSituation(random.text);
  };

  const handleSaveToJourney = () => {
    storage.addNote(`✨ رحلة «جوايا حكاية»: بدأت بموقف «${customSituation}»، لاحظت الفكرة والشعور، واستقر احتياجي عند: ${selectedNeed}. النظرة الجديدة: ${currentPlan.newStory}`);
    alert('تم حفظ ملخص حكايتك في سجل رحلتك الشخصية بنجاح 🌿');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_-10px_rgba(58,90,64,0.25)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  جوايا حكاية
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2.5 py-0.5 rounded-full font-bold">
                  العالم اللي بيشرح نفسه بنفسه
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5 font-medium">
                رحلة تفاعلية هادئة لتفكيك الموقف وفهم ما يدور بداخلك خطوة بخطوة
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

        {/* Stepper Progress Bar */}
        <div className="py-3 shrink-0 border-b border-[#E5DACB]/60">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {GWAYA_STAGES.map((stg, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <button
                  key={stg.id}
                  onClick={() => setCurrentStageId(stg.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-[#3A5A40] text-white shadow-xs'
                      : isPassed
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300'
                      : 'bg-white text-stone-400 border border-[#E5DACB]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-white/20">
                    {isPassed ? '✓' : idx + 1}
                  </span>
                  <span>{stg.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[#58645C]">
            <span className="font-bold text-[#3A5A40]">{currentStageInfo.eyebrow}</span>
            <span className="font-medium">{currentStageInfo.description}</span>
          </div>
        </div>

        {/* Dynamic Stage Content */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          
          {/* STAGE 1: الموقف (fact) */}
          {currentStageId === 'fact' && (
            <div className="space-y-4 animate-fade-in">
              {/* Chapters tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {GWAYA_CHAPTERS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapter(ch.id)}
                    className={`py-2 px-3.5 rounded-2xl border text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      activeChapter === ch.id
                        ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-[#283618] border-[#E5DACB]'
                    }`}
                  >
                    <span>{ch.emoji}</span>
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>

              {/* Chapter Intro Banner */}
              <div className="p-3.5 bg-white border border-[#E5DACB] rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-black text-xs text-[#283618]">{activeChapterInfo.title}</div>
                  <div className="text-[11px] text-[#58645C] mt-0.5">{activeChapterInfo.intro}</div>
                </div>
                <button
                  onClick={handleSurpriseMe}
                  className="py-1.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold shrink-0 transition-transform active:scale-95"
                >
                  🎲 فاجئني بموقف
                </button>
              </div>

              {/* Situation Presets Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#283618] block">اختاري موقفاً من الفصل أو اكتبي موقفك:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {chapterPresets.map((pr) => (
                    <button
                      key={pr.key}
                      onClick={() => setCustomSituation(pr.text)}
                      className={`p-2.5 rounded-2xl border text-right transition-all text-xs font-bold flex items-center gap-2 ${
                        customSituation === pr.text
                          ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                          : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
                      }`}
                    >
                      <span className="text-base">{pr.emoji}</span>
                      <span className="truncate">{pr.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom situation textarea */}
              <div className="p-4 bg-white border border-[#E5DACB] rounded-3xl space-y-2 shadow-xs">
                <label className="block text-xs font-bold text-[#283618]">
                  الموقف المختار (يمكنك تعديله بكلماتك):
                </label>
                <textarea
                  rows={2}
                  value={customSituation}
                  onChange={(e) => setCustomSituation(e.target.value)}
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E5DACB] focus:border-[#3A5A40] rounded-2xl text-xs text-[#283618] outline-none font-bold resize-none leading-relaxed"
                />
              </div>

              {/* Truth Card: اللي نعرفه فعلًا */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-1 text-xs text-emerald-950">
                <div className="font-black text-sm flex items-center gap-1.5 text-emerald-900">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>اللي نعرفه فعلًا (الحقيقة الملموسة):</span>
                </div>
                <p className="leading-relaxed font-medium">
                  ده أول خيط في موقفك.. هنفصل بعده بين اللي حصل فعلًا في الواقع، وبين القصة والتفسيرات الدرامية اللي العقل بدأ يبنيها جواه.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextStage}
                  className="py-3 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>نثبت الموقف ونشوف اللي جواه</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: الفكرة (thought) */}
          {currentStageId === 'thought' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-white border border-[#E5DACB] rounded-2xl text-xs text-[#283618]">
                <strong>الموقف أمامنا:</strong> «{customSituation}»
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#283618] block">
                  اختار نوع الفكرة أو القصة اللي ظهرت في عقلك في اللحظة دي:
                </span>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedThought('fear')}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                      selectedThought === 'fear'
                        ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-[#E5DACB] text-[#283618]'
                    }`}
                  >
                    <span className="text-xl">⚠️</span>
                    <div>
                      <div className="font-extrabold text-xs text-rose-900">صوت الخوف أو الحكم الجارح:</div>
                      <div className="text-xs mt-0.5">{currentPlan.oldStory}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedThought('interpretation')}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                      selectedThought === 'interpretation'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-[#E5DACB] text-[#283618]'
                    }`}
                  >
                    <span className="text-xl">💡</span>
                    <div>
                      <div className="font-extrabold text-xs text-amber-900">تفسير محتمل بديل:</div>
                      <div className="text-xs mt-0.5">{currentPlan.practice.note}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedThought('neutral')}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                      selectedThought === 'neutral'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-[#E5DACB] text-[#283618]'
                    }`}
                  >
                    <span className="text-xl">🌿</span>
                    <div>
                      <div className="font-extrabold text-xs text-emerald-900">الواقع المجرد بدون سيناريوهات:</div>
                      <div className="text-xs mt-0.5">حدث وقع فقط.. وباقي القصة لم تُكتب بعد.</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handlePrevStage}
                  className="py-2.5 px-4 bg-white border border-[#E5DACB] rounded-2xl text-xs font-bold"
                >
                  رجوع
                </button>
                <button
                  onClick={handleNextStage}
                  className="py-3 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl shadow-xs flex items-center gap-1.5"
                >
                  <span>نسمع نغمة الشعور</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: الشعور (feeling) */}
          {currentStageId === 'feeling' && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="p-5 bg-gradient-to-b from-sky-50 to-white border border-sky-200 rounded-3xl space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-2xl animate-pulse">
                  🌬️
                </div>
                <div className="font-black text-sm text-[#283618]">
                  وقفة تنفّس قصيرة: مش لازم تغيّري الإحساس؛ بس لاحظيه بلطف
                </div>
                <p className="text-xs text-[#58645C] max-w-sm mx-auto">
                  خد شهيق بطيء وعدّ لـ 3.. زفير براحة. ما الشعور الأقرب لما يدور بداخلك الآن؟
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {['قلق ⚡', 'زعل وخذلان 💔', 'حيرة وتشتت 🤔', 'إرهاق وثقل 😴'].map((feel) => (
                    <button
                      key={feel}
                      onClick={() => setSelectedFeeling(feel)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                        selectedFeeling === feel
                          ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-sm scale-105'
                          : 'bg-white hover:bg-stone-50 border-[#E5DACB] text-[#283618]'
                      }`}
                    >
                      {feel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handlePrevStage}
                  className="py-2.5 px-4 bg-white border border-[#E5DACB] rounded-2xl text-xs font-bold"
                >
                  رجوع
                </button>
                <button
                  onClick={handleNextStage}
                  className="py-3 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl shadow-xs flex items-center gap-1.5"
                >
                  <span>نكتشف إشارة الجسم</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: الجسم (body) */}
          {currentStageId === 'body' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-white border border-[#E5DACB] rounded-2xl text-xs text-[#58645C] leading-relaxed">
                💡 <strong>{currentPlan.bodyIntro}</strong>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#283618] block">
                  أين ظهرت إشارة الحكاية في جسمك وعضلاتك؟
                </span>
                <div className="space-y-2">
                  {currentPlan.signals.map((sig) => (
                    <button
                      key={sig.key}
                      onClick={() => setSelectedBodySignal(sig.label)}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between text-xs font-bold ${
                        selectedBodySignal === sig.label
                          ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                          : 'bg-white hover:bg-stone-50 border-[#E5DACB] text-[#283618]'
                      }`}
                    >
                      <span>{sig.label}</span>
                      {selectedBodySignal === sig.label && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handlePrevStage}
                  className="py-2.5 px-4 bg-white border border-[#E5DACB] rounded-2xl text-xs font-bold"
                >
                  رجوع
                </button>
                <button
                  onClick={handleNextStage}
                  className="py-3 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl shadow-xs flex items-center gap-1.5"
                >
                  <span>ما وراء الشعور: الاحتياج</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: الاحتياج (need) */}
          {currentStageId === 'need' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 leading-relaxed">
                🏮 <strong>الاحتياج مش دلع.. الاحتياج هو البوصلة:</strong> وراء كل خوف أو قلق أو زعل، رغبة طبيعية يستحق أن تُسمع.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentPlan.needs.map((nd) => (
                  <button
                    key={nd.key}
                    onClick={() => setSelectedNeed(nd.title)}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[100px] ${
                      selectedNeed === nd.title
                        ? 'bg-amber-800 text-white border-amber-800 shadow-sm scale-102 font-bold'
                        : 'bg-white hover:bg-stone-50 border-[#E5DACB] text-[#283618]'
                    }`}
                  >
                    <div className="font-black text-sm mb-1">{nd.title} 🏮</div>
                    <div className="text-[11px] leading-relaxed opacity-90">{nd.text}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handlePrevStage}
                  className="py-2.5 px-4 bg-white border border-[#E5DACB] rounded-2xl text-xs font-bold"
                >
                  رجوع
                </button>
                <button
                  onClick={handleNextStage}
                  className="py-3 px-6 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl shadow-xs flex items-center gap-1.5"
                >
                  <span>نفتح نافذة لنظرة أوسع</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 6: نظرة أوسع (reframe) */}
          {currentStageId === 'reframe' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-xs text-rose-950">
                  <span className="font-extrabold text-rose-900 block">القصة القديمة (صوت الخوف):</span>
                  <p className="font-bold">{currentPlan.oldStory}</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1 text-xs text-emerald-950">
                  <span className="font-extrabold text-emerald-900 block">الزاوية الأهدى (الأكثر رحمة):</span>
                  <p className="font-bold">{currentPlan.newStory}</p>
                </div>
              </div>

              {/* Practice Mini Task */}
              <div className="p-5 bg-white border border-[#E5DACB] rounded-3xl space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#DDA15E]" />
                  <h4 className="font-black text-sm text-[#283618]">
                    تمرين عملي: {currentPlan.practice.title}
                  </h4>
                </div>
                <p className="text-xs text-[#58645C] leading-relaxed">
                  {currentPlan.practice.prompt}
                </p>

                <input
                  type="text"
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="اكتب خطوتك الصغيرة هنا..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E5DACB] rounded-2xl text-xs text-[#283618] outline-none font-bold"
                />

                <div className="text-[11px] text-[#58645C] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E5DACB]">
                  💡 {currentPlan.practice.note}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handlePrevStage}
                  className="py-2.5 px-4 bg-white border border-[#E5DACB] rounded-2xl text-xs font-bold"
                >
                  رجوع
                </button>
                <button
                  onClick={handleNextStage}
                  className="py-3 px-7 bg-[#3A5A40] hover:bg-[#283618] text-white font-black text-xs rounded-2xl shadow-xs flex items-center gap-1.5"
                >
                  <span>عرض دفتر الرحلة والميدالية 🏅</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 7: الختام ودفتر الرحلة (finish) */}
          {currentStageId === 'finish' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-6 bg-gradient-to-b from-white via-[#FAF7F2] to-white border-2 border-[#3A5A40]/40 rounded-3xl shadow-sm space-y-4 text-right">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DACB]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-inner">
                      🏅
                    </div>
                    <div>
                      <span className="text-[10px] text-[#3A5A40] font-black bg-[#3A5A40]/10 px-2 py-0.5 rounded-md">
                        دفتر الرحلة المكتملة
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-[#283618] mt-0.5">
                        «خيوط صغيرة بتجمع الصورة»
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                    مكتملة ✓
                  </span>
                </div>

                {/* 5 Journey Items */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E5DACB] flex items-center justify-between">
                    <div>
                      <span className="text-[#58645C] block text-[10px]">٠١ الموقف الذي بدأ الحكاية:</span>
                      <strong className="text-[#283618]">{customSituation}</strong>
                    </div>
                    <span className="text-base">📌</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E5DACB] flex items-center justify-between">
                    <div>
                      <span className="text-[#58645C] block text-[10px]">٠٢ الفكرة التي ظهرت:</span>
                      <strong className="text-amber-950">
                        {selectedThought === 'fear' ? currentPlan.oldStory : currentPlan.practice.note}
                      </strong>
                    </div>
                    <span className="text-base">💭</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E5DACB] flex items-center justify-between">
                    <div>
                      <span className="text-[#58645C] block text-[10px]">٠٣ نغمة الشعور وإشارة الجسم:</span>
                      <strong className="text-sky-950">{selectedFeeling} — ({selectedBodySignal})</strong>
                    </div>
                    <span className="text-base">🌬️</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E5DACB] flex items-center justify-between">
                    <div>
                      <span className="text-[#58645C] block text-[10px]">٠٤ الاحتياج الحقيقي المضيء:</span>
                      <strong className="text-[#3A5A40]">{selectedNeed}</strong>
                    </div>
                    <span className="text-base">🏮</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-800 block text-[10px]">٠٥ النظرة الأوسع والخطوة التالية:</span>
                      <strong className="text-emerald-950">{currentPlan.newStory}</strong>
                    </div>
                    <span className="text-base">🌱</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                  «أنا بدأت أفهم إيه اللي بيحصل جوايا.. العقل بيحاول يحميني بسرعة، وأنا بتعلم أدي لنفسي مساحة للتنفس»
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleSaveToJourney}
                  className="flex-1 py-3 px-4 bg-[#3A5A40] hover:bg-[#283618] text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ الحكاية في رحلتي</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentStageId('fact');
                    handleSurpriseMe();
                  }}
                  className="py-3 px-4 bg-white hover:bg-stone-50 border border-[#E5DACB] text-[#283618] font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تفكيك حكاية أخرى</span>
                </button>
              </div>
            </div>
          )}

          <TakeawayResultCard
            quote="«العالم اللي جواك ليس فوضى.. هو حكاية جميلة تنتظر أن تستمع إليها برفق واهتمام»"
            onTryAnother={() => {
              setCurrentStageId('fact');
              handleSurpriseMe();
            }}
            onBackToHome={onClose}
          />
        </div>
      </div>
    </div>
  );
};
