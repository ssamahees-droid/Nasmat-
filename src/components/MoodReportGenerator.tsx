import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Smile, 
  BookOpen, 
  Activity, 
  Calendar, 
  Heart, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { storage, ThoughtPost, PersonalNote, MindfulnessRecord } from '../services/storage';
import { DailyCheckin, MoodValue, ScheduledRelaxationSession, WellnessHabit } from '../types';

interface MoodReportGeneratorProps {
  onOpenThoughtJournal?: () => void;
  onOpenMindfulnessStudio?: () => void;
}

export const MoodReportGenerator: React.FC<MoodReportGeneratorProps> = ({
  onOpenThoughtJournal,
  onOpenMindfulnessStudio
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportKey, setReportKey] = useState(0);

  // Generate weekly psychological & mood report text
  const reportData = useMemo(() => {
    const checkins: DailyCheckin[] = storage.getDailyCheckins();
    const thoughtPosts: ThoughtPost[] = storage.getThoughtPosts();
    const notes: PersonalNote[] = storage.getNotes();
    const mindfulnessRecords: MindfulnessRecord[] = storage.getMindfulnessRecords();
    const scheduledSessions: ScheduledRelaxationSession[] = storage.getScheduledRelaxationSessions();
    const habits: WellnessHabit[] = storage.getHabits();

    // Filter past 7 days data
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const startDateStr = sevenDaysAgo.toISOString().split('T')[0];

    const recentCheckins = checkins.filter(c => c.date >= startDateStr);
    const recentThoughts = thoughtPosts.filter(p => p.createdAt && p.createdAt.split('T')[0] >= startDateStr);
    const recentNotes = notes.filter(n => n.date && n.date >= startDateStr);
    const recentMindfulness = mindfulnessRecords.filter(m => m.completedAt && m.completedAt.split('T')[0] >= startDateStr);
    const recentRelaxation = scheduledSessions.filter(s => s.date >= startDateStr && s.completed);

    const totalExercises = recentMindfulness.length + recentRelaxation.length;
    const totalReflections = recentThoughts.length + recentNotes.length;

    // Mood sentiment distribution
    const moodCounts: Record<string, number> = {
      good: 0,
      fair: 0,
      confused: 0,
      not_good: 0,
      exhausted: 0
    };

    recentCheckins.forEach(c => {
      if (moodCounts[c.moodValue] !== undefined) {
        moodCounts[c.moodValue]++;
      }
    });

    recentThoughts.forEach(t => {
      if (t.mood && moodCounts[t.mood] !== undefined) {
        moodCounts[t.mood]++;
      }
    });

    recentNotes.forEach(n => {
      if (n.moodTag && moodCounts[n.moodTag] !== undefined) {
        moodCounts[n.moodTag]++;
      }
    });

    const dominantMood = Object.entries(moodCounts).reduce((a, b) => b[1] > a[1] ? b : a, ['fair', 0])[0];
    const dominantMoodLabel = 
      dominantMood === 'good' ? 'ممتاز ومستقر (😊)' :
      dominantMood === 'fair' ? 'متوازن ومقبول (🌿)' :
      dominantMood === 'confused' ? 'مشوش وبحاجة لتأمل (🤔)' :
      dominantMood === 'not_good' ? 'مجهد وضغط خفيف (😔)' : 'منهك وبحاجة للراحة العميقة (😫)';

    // Date range string
    const endDateStr = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
    const startDateFormatted = sevenDaysAgo.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });

    // Construct professional Arabic psychological summary report
    let summaryText = `تقرير نسمة حياة الأسبوعي للصحة النفسية والعاطفية 🌿\n`;
    summaryText += `الفترة من: ${startDateFormatted} إلى ${endDateStr}\n`;
    summaryText += `--------------------------------------------------\n\n`;

    summaryText += `1. نظرة عامة على الحالة المزاجية:\n`;
    summaryText += `• الطابع الغالب خلال الأسبوع: ${dominantMoodLabel}\n`;
    summaryText += `• عدد مرات تسجيل المشاعر والفحص اليومي: ${recentCheckins.length} مرات.\n\n`;

    summaryText += `2. الأنشطة وجلسات الاسترخاء:\n`;
    summaryText += `• إجمالي تمارين اليقظة والتنفس المنجزة: ${totalExercises} جلسات.\n`;
    summaryText += `• عدد مذكرات وتدوينات التفكير المسجلة: ${totalReflections} تدوينات للوعي الذاتي.\n\n`;

    summaryText += `3. الرؤية النفسية والتوصيات الهادئة:\n`;
    if (totalExercises >= 3 || totalReflections >= 2) {
      summaryText += `• لقد أظهرت استمرارية واعية وجميلة في تخصيص مساحة هادئة لنفسك هذا الأسبوع. تفريغ الأفكار وممارسة جلسات التنفس والاسترخاء ساهمت بشكل ملحوظ في تخفيف حدة التوتر ومنح جهازك العصبي فرصة للتعافي الذاتي.\n`;
    } else {
      summaryText += `• ننصحك خلال الأسبوع القادم بإعطاء نفسك مساحة أضيق وأكثر رفقاً؛ حتى لو كانت دقيقة واحدة من التنفس الواعي أو تدوين سطر واحد، فالخطوات الصغيرة تصنع فارقاً حقيقياً في سلامك الداخلي.\n`;
    }

    summaryText += `\n"تذكر دائماً: مش كل شعور محتاج حل فوري.. أحيانًا محتاج نفهمه الأول." 🍃\n`;
    summaryText += `صدر آلياً من تطبيق نسمة حياة (Nesmat Hayat).`;

    return {
      startDateFormatted,
      endDateStr,
      dominantMoodLabel,
      totalExercises,
      totalReflections,
      recentCheckinsCount: recentCheckins.length,
      summaryText
    };
  }, [reportKey]);

  // Handle Copy Report
  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportData.summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Handle Download / Export Report as .txt file
  const handleDownloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([reportData.summaryText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `تقرير-نسمة-حياة-النفسي-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle Regenerate Report
  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setReportKey(prev => prev + 1);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <section className="bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 text-right transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/25 text-amber-700 dark:text-amber-300 flex items-center justify-center text-base">
              📜
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#174C3C] dark:text-[#F7F3E9] font-syne">
              المولد الذكي للتقرير الأسبوعي (MoodReportGenerator)
            </h2>
          </div>
          <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70 mt-1">
            ملخص نصي احترافي وشامل يحلل حالتك المزاجية وتفاعلاتك مع التمارين خلال الأسبوع الماضي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0] hover:bg-[#174C3C]/5 transition-all flex items-center gap-1 cursor-pointer"
            title="تحديث وتوليد التقرير"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>تحديث التقرير</span>
          </button>
        </div>
      </div>

      {/* Report Preview Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F7F3E9]/80 via-white to-emerald-50/30 dark:from-[#0D1914] dark:via-[#14271F] dark:to-[#172B22] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 font-cairo space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
            <span className="font-bold text-[#174C3C] dark:text-[#A9C5A0]">
              الفترة: من {reportData.startDateFormatted} إلى {reportData.endDateStr}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
            جاهز للاستخدام ✓
          </span>
        </div>

        {/* Formatted Text Content */}
        <div className="bg-white dark:bg-[#0D1914] p-4 rounded-xl border border-black/5 dark:border-white/10 space-y-3 text-xs leading-relaxed text-[#13251E] dark:text-[#F7F3E9] font-mono">
          <div className="font-bold text-sm text-[#174C3C] dark:text-[#A9C5A0] font-cairo border-b pb-2 border-emerald-500/20">
            🌿 تقرير نسمة حياة الأسبوعي للصحة النفسية والعاطفية
          </div>

          <div className="space-y-2 font-cairo">
            <div>
              <strong className="text-[#174C3C] dark:text-[#A9C5A0] block mb-0.5">1. نظرة عامة على الحالة المزاجية:</strong>
              <p className="text-stone-700 dark:text-stone-300 pr-2">
                • الطابع الغالب خلال الأسبوع: <strong className="text-emerald-700 dark:text-emerald-300">{reportData.dominantMoodLabel}</strong><br />
                • عدد مرات تسجيل المشاعر والفحص اليومي: {reportData.recentCheckinsCount} مرات.
              </p>
            </div>

            <div>
              <strong className="text-[#174C3C] dark:text-[#A9C5A0] block mb-0.5">2. الأنشطة وجلسات الاسترخاء:</strong>
              <p className="text-stone-700 dark:text-stone-300 pr-2">
                • إجمالي تمارين اليقظة والتنفس المنجزة: {reportData.totalExercises} جلسات.<br />
                • عدد مذكرات وتدوينات التفكير المسجلة: {reportData.totalReflections} تدوينات للوعي الذاتي.
              </p>
            </div>

            <div>
              <strong className="text-[#174C3C] dark:text-[#A9C5A0] block mb-0.5">3. الرؤية النفسية والتوصيات الهادئة:</strong>
              <p className="text-stone-700 dark:text-stone-300 pr-2 leading-relaxed">
                {reportData.totalExercises >= 3 || reportData.totalReflections >= 2 ? (
                  <>لقد أظهرت استمرارية واعية وجميلة في تخصيص مساحة هادئة لنفسك هذا الأسبوع. تفريغ الأفكار وممارسة جلسات التنفس والاسترخاء ساهمت بشكل ملحوظ في تخفيف حدة التوتر ومنح جهازك العصبي فرصة للتعافي الذاتي.</>
                ) : (
                  <>ننصحك خلال الأسبوع القادم بإعطاء نفسك مساحة أضيق وأكثر رفقاً؛ حتى لو كانت دقيقة واحدة من التنفس الواعي أو تدوين سطر واحد، فالخطوات الصغيرة تصنع فارقاً حقيقياً في سلامك الداخلي.</>
                )}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-black/10 dark:border-white/10 text-[11px] text-emerald-700 dark:text-emerald-300 italic font-cairo">
            «مش كل شعور محتاج حل فوري.. أحيانًا محتاج نفهمه الأول» 🍃
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-white dark:text-[#0D1914]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ التقرير بنجاح ✓' : 'نسخ التقرير النصي 📋'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/30 text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0] hover:bg-black/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل كملف نصي 💾</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            يُحدث تلقائياً مع نشاطك اليومي
          </span>
        </div>

      </div>

    </section>
  );
};
