import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Check
} from 'lucide-react';
import { PsychoeducationTopic } from '../types';

interface PsychoeducationTopicModalProps {
  topic: PsychoeducationTopic | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTool?: (toolId: string) => void;
  onOpenNextTopic?: () => void;
  onOpenPrevTopic?: () => void;
}

export const PsychoeducationTopicModal: React.FC<PsychoeducationTopicModalProps> = ({
  topic,
  isOpen,
  onClose,
  onNavigateToTool,
  onOpenNextTopic,
  onOpenPrevTopic
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (!topic) return false;
    try {
      const saved = JSON.parse(localStorage.getItem('nesma_library_bookmarks') || '[]');
      return saved.includes(topic.id);
    } catch {
      return false;
    }
  });

  if (!isOpen || !topic) return null;

  const toggleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('nesma_library_bookmarks') || '[]');
      const exists = saved.includes(topic.id);
      let updated: string[];
      if (exists) {
        updated = saved.filter(id => id !== topic.id);
        setIsBookmarked(false);
      } else {
        updated = [...saved, topic.id];
        setIsBookmarked(true);
      }
      localStorage.setItem('nesma_library_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.warn('Bookmark error:', e);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: topic.title,
      text: `${topic.title} — مكتبة التثقيف النفسي | مبادرة نسمة حياة`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${topic.title}\n${window.location.href}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } catch {
        // Ignore
      }
    }
  };

  const fontClass = 
    fontSize === 'xlarge' ? 'text-lg sm:text-xl leading-relaxed' :
    fontSize === 'large' ? 'text-base sm:text-lg leading-relaxed' :
    'text-sm sm:text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-right font-cairo">
      <div 
        className="bg-[#F2EFEB] dark:bg-[#151518] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[8px_8px_0_#111113] dark:shadow-[8px_8px_0_rgba(255,255,255,0.1)] overflow-hidden"
        role="dialog"
        aria-labelledby="topic-title"
      >
        
        {/* Sticky Header Bar */}
        <header className="px-5 py-4 border-b-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#18181C] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-jetbrains text-[10px] sm:text-xs text-[#E36E4D] font-bold uppercase tracking-wider">
              المسار {topic.trackNumber} · الموضوع {topic.topicNumber}
            </span>
            <span className="hidden sm:inline text-xs text-[#111113]/40 dark:text-[#F2EFEB]/40">|</span>
            <span className="hidden sm:inline text-xs font-semibold text-[#111113]/80 dark:text-[#F2EFEB]/80">
              {topic.trackTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Size Adjuster */}
            <div className="flex items-center bg-[#F2EFEB] dark:bg-[#202026] border border-[#111113]/20 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${fontSize === 'normal' ? 'bg-[#111113] text-white' : 'text-[#111113]/70 dark:text-[#F2EFEB]/70'}`}
                title="حجم خط عادي"
              >
                أ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${fontSize === 'large' ? 'bg-[#111113] text-white' : 'text-[#111113]/70 dark:text-[#F2EFEB]/70'}`}
                title="حجم خط متوسط"
              >
                أ+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${fontSize === 'xlarge' ? 'bg-[#111113] text-white' : 'text-[#111113]/70 dark:text-[#F2EFEB]/70'}`}
                title="حجم خط كبير"
              >
                أ++
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 transition-all cursor-pointer ${
                isBookmarked 
                  ? 'bg-[#E36E4D] text-white shadow-[2px_2px_0_#111113]' 
                  : 'bg-white dark:bg-[#202026] text-[#111113] dark:text-[#F2EFEB] hover:bg-[#F2EFEB]'
              }`}
              title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#202026] text-[#111113] dark:text-[#F2EFEB] hover:shadow-[2px_2px_0_#111113] transition-all cursor-pointer relative"
              title="مشاركة الموضوع"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111113] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  تم النسخ ✓
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#202026] text-[#111113] dark:text-[#F2EFEB] hover:bg-[#E36E4D] hover:text-white transition-all cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Reader Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 text-[#111113] dark:text-[#F2EFEB]">
          
          {/* Title Area */}
          <section className="space-y-3 pb-6 border-b-[1.5px] border-[#111113]/15">
            <h1 id="topic-title" className="font-cairo font-black text-2xl sm:text-4xl text-[#111113] dark:text-[#F2EFEB] leading-tight">
              {topic.title}
            </h1>
            <p className="text-sm sm:text-base text-[#111113]/80 dark:text-[#F2EFEB]/80 font-semibold leading-relaxed">
              {topic.subtitle}
            </p>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-jetbrains text-[#111113]/60 dark:text-[#F2EFEB]/60">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E36E4D]" />
                <span>{topic.estimatedReadTimeMinutes} دقائق قراءة</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E36E4D]" />
                <span>آخر مراجعة سريرية: {topic.lastReviewedDate}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{topic.clinicalReviewer}</span>
              </span>
            </div>
          </section>

          {/* 1. Introduction (واقع المشكلة) */}
          <section className="space-y-2.5">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 01. THE_REALITY · كيف نعيش المشكلة في واقعنا؟
            </div>
            <div className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C22] border-[1.5px] border-[#111113] dark:border-white/20 shadow-[3px_3px_0_#111113] ${fontClass}`}>
              <p className="leading-relaxed">
                {topic.introduction}
              </p>
            </div>
          </section>

          {/* 2. Scientific Explanation (التفسير العلمي المبسط) */}
          <section className="space-y-3">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 02. SCIENTIFIC_GROUNDING · التفسير النفسي والعصبي المبسط
            </div>
            <div className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C22] border-[1.5px] border-[#111113] dark:border-white/20 space-y-3 shadow-[3px_3px_0_#111113] ${fontClass}`}>
              <p className="font-semibold text-[#111113] dark:text-white">
                {topic.scientificExplanation.summary}
              </p>
              <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-[#111113]/85 dark:text-[#F2EFEB]/85">
                {topic.scientificExplanation.details.map((detail, idx) => (
                  <li key={idx} className="leading-relaxed">{detail}</li>
                ))}
              </ul>
              {topic.scientificExplanation.cautions && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{topic.scientificExplanation.cautions}</span>
                </div>
              )}
            </div>
          </section>

          {/* 3. Real Life Examples (أمثلة من الحياة اليومية) */}
          <section className="space-y-3">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 03. CASE_STUDIES · نماذج وأمثلة واقعية
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.realLifeExamples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#1C1C22] border-[1.5px] border-[#111113] dark:border-white/20 space-y-2 shadow-[2px_2px_0_#111113]">
                  <div className="font-bold text-xs text-[#E36E4D]">حالة واقعية ({idx + 1}):</div>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#111113]/90 dark:text-[#F2EFEB]/90">
                    «{ex.scenario}»
                  </p>
                  <div className="pt-2 border-t border-[#111113]/10 text-[11px] sm:text-xs text-[#111113]/70 dark:text-[#F2EFEB]/70">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">التحليل النفسي: </span>
                    {ex.analysis}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. What Helps vs What Aggravates (ما يساعد وما يزيد المشكلة) */}
          <section className="space-y-3">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 04. PRACTICAL_GUIDANCE · ما الذي يساعد وما الذي يزيد العبء؟
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What Helps */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border-[1.5px] border-emerald-700/30 space-y-2.5">
                <div className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>خطوات وسلوكيات تساعد:</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#111113]/85 dark:text-[#F2EFEB]/85">
                  {topic.whatHelps.map((help, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{help}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Aggravates */}
              <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border-[1.5px] border-rose-700/30 space-y-2.5">
                <div className="font-bold text-xs sm:text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>سلوكيات قد تفاقم المشكلة:</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#111113]/85 dark:text-[#F2EFEB]/85">
                  {topic.whatAggravates.map((agg, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>{agg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Practical Exercise & Optional Alternative (التمرين العملي والبديل) */}
          <section className="space-y-3">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 05. PRACTICAL_SKILL · تمرين عملي وبديل اختياري
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C22] border-[1.5px] border-[#111113] dark:border-white/20 space-y-4 shadow-[4px_4px_0_#111113]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base sm:text-lg text-[#111113] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E36E4D]" />
                  <span>{topic.practicalExercise.title}</span>
                </h3>
                {topic.practicalExercise.durationMinutes && (
                  <span className="font-jetbrains text-xs bg-[#F2EFEB] dark:bg-[#202026] px-2.5 py-1 rounded-full border border-[#111113]/20">
                    ⏱ {topic.practicalExercise.durationMinutes} دقائق
                  </span>
                )}
              </div>
              
              <p className="text-xs sm:text-sm text-[#111113]/80 dark:text-[#F2EFEB]/80">
                {topic.practicalExercise.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#111113]/10">
                {topic.practicalExercise.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#111113] text-white dark:bg-[#F2EFEB] dark:text-[#111113] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Optional Alternative */}
              {topic.practicalExercise.optionalAlternative && (
                <div className="mt-4 p-3.5 rounded-xl bg-[#F2EFEB] dark:bg-[#25252D] border border-[#111113]/20 space-y-1">
                  <div className="font-bold text-xs text-[#E36E4D] flex items-center gap-1.5">
                    <span>💡 {topic.practicalExercise.optionalAlternative.title}</span>
                  </div>
                  <p className="text-xs text-[#111113]/80 dark:text-[#F2EFEB]/80 leading-relaxed">
                    {topic.practicalExercise.optionalAlternative.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 6. Self-Reflection Questions (أسئلة للتأمل الذاتي - ليست للتشخيص) */}
          <section className="space-y-3">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 06. SELF_REFLECTION · أسئلة للتأمل الذاتي (ليست للتشخيص)
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C22] border-[1.5px] border-[#111113] dark:border-white/20 space-y-3 shadow-[2px_2px_0_#111113]">
              <div className="text-xs text-[#111113]/60 dark:text-[#F2EFEB]/60 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#E36E4D]" />
                <span>هذه الأسئلة لتعميق فهمك الذاتي، ولا تُستخدم كأداة تشخيص طبي أو سريري:</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {topic.reflectionQuestions.map((q, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-[#F2EFEB] dark:bg-[#202026] text-[#111113] dark:text-[#F2EFEB] font-medium leading-relaxed">
                    ❓ {q}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 7. When to Seek Help & Red Flags (متى تطلب المساعدة الطارئة والمختصة) */}
          <section className="space-y-3">
            <div className="font-jetbrains text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
              // 07. CLINICAL_RED_FLAGS · متى ينبغي طلب المساعدة المتخصصة؟
            </div>
            <div className="p-5 rounded-2xl bg-rose-500/10 dark:bg-rose-950/30 border-[1.5px] border-rose-600/40 space-y-3 shadow-[3px_3px_0_#E36E4D]">
              <div className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>علامات تستدعي استشارة متخصصة عاجلة:</span>
              </div>

              <ul className="space-y-1.5 text-xs sm:text-sm text-[#111113]/90 dark:text-[#F2EFEB]/90 list-disc list-inside">
                {topic.whenToSeekHelp.redFlags.map((flag, idx) => (
                  <li key={idx} className="leading-relaxed">{flag}</li>
                ))}
              </ul>

              <p className="text-xs text-[#111113]/80 dark:text-[#F2EFEB]/80 pt-1 leading-relaxed">
                {topic.whenToSeekHelp.guidance}
              </p>

              {/* Hotlines if present */}
              {topic.whenToSeekHelp.urgentHotlines && topic.whenToSeekHelp.urgentHotlines.length > 0 && (
                <div className="mt-3 pt-3 border-t border-rose-600/20 space-y-2">
                  <div className="font-bold text-xs text-rose-800 dark:text-rose-300">
                    أرقام الطوارئ والدعم النفسي الرسمي المعتمد:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {topic.whenToSeekHelp.urgentHotlines.map((hl, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white dark:bg-black/40 border border-rose-500/30 flex items-center justify-between">
                        <div>
                          <div className="font-bold">{hl.country}</div>
                          <div className="text-[10px] text-stone-500">{hl.service}</div>
                        </div>
                        <div className="font-jetbrains font-bold text-[#E36E4D] dir-ltr text-xs">
                          {hl.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 8. Verified Scientific References (المراجع العلمية الموثوقة) */}
          <section className="space-y-2.5 pt-4 border-t border-[#111113]/15">
            <div className="font-jetbrains text-xs font-bold text-[#111113]/60 dark:text-[#F2EFEB]/60 uppercase tracking-wider">
              // 08. VERIFIED_REFERENCES · المراجع العلمية المعتمدة
            </div>
            <ul className="space-y-1.5 text-xs text-[#111113]/70 dark:text-[#F2EFEB]/70">
              {topic.references.map((ref, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#E36E4D] font-bold">[{idx + 1}]</span>
                  <span>
                    <strong className="text-[#111113] dark:text-[#F2EFEB]">{ref.title}</strong> — {ref.source} ({ref.year})
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Related Tools Quick Links (الربط بالأدوات الداخلية المتاحة) */}
          {topic.relatedInternalTools && topic.relatedInternalTools.length > 0 && (
            <section className="p-4 rounded-2xl bg-white dark:bg-[#1C1C22] border-[1.5px] border-[#111113] dark:border-white/20 space-y-2.5 shadow-[2px_2px_0_#111113]">
              <div className="font-bold text-xs text-[#E36E4D]">أدوات عملية مقترحة في نسمة حياة لهذا الموضوع:</div>
              <div className="flex flex-wrap gap-2">
                {topic.relatedInternalTools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onNavigateToTool) {
                        onNavigateToTool(tool.toolActionId);
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 bg-[#F2EFEB] dark:bg-[#25252D] hover:bg-[#111113] hover:text-white dark:hover:bg-white dark:hover:text-[#111113] border border-[#111113]/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{tool.label}</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <footer className="px-5 py-3 border-t-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#18181C] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenPrevTopic && (
              <button
                onClick={onOpenPrevTopic}
                className="px-3 py-1.5 rounded-xl border border-[#111113]/30 text-xs font-bold hover:bg-[#111113] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>الموضوع السابق</span>
              </button>
            )}
            {onOpenNextTopic && (
              <button
                onClick={onOpenNextTopic}
                className="px-3 py-1.5 rounded-xl border border-[#111113]/30 text-xs font-bold hover:bg-[#111113] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>الموضوع التالي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#111113] text-white dark:bg-[#F2EFEB] dark:text-[#111113] rounded-full text-xs font-bold hover:bg-[#E36E4D] hover:text-white transition-colors cursor-pointer"
          >
            إغلاق القراءة
          </button>
        </footer>

      </div>
    </div>
  );
};
