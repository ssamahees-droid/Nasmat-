import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  ClipboardCheck, 
  BookOpen, 
  Check, 
  Heart,
  BarChart2,
  Smile,
  ShieldCheck
} from 'lucide-react';
import { storage, PersonalNote } from '../services/storage';
import { DailyCheckin, MoodValue, AssessmentRecord, WellnessHabit, HabitCategory } from '../types';
import { RelaxationCalendarSection } from '../components/RelaxationCalendarSection';
import { MoodJourneyChartSection } from '../components/MoodJourneyChartSection';
import { MoodReportGenerator } from '../components/MoodReportGenerator';

import { ScreenBannerHeader } from '../components/ScreenBannerHeader';

interface JourneyScreenProps {
  onOpenAssessment: () => void;
  onNavigateToContent: () => void;
  onOpenPersonalPlan?: () => void;
  onOpenThoughtJournal?: () => void;
  onOpenMindfulnessStudio?: () => void;
  onOpenVoiceJournal?: () => void;
  onNavigateToBreathe?: () => void;
  onNavigateToListen?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenAllScreens?: () => void;
}

const MOOD_MAP: Record<MoodValue, { label: string; emoji: string; color: string }> = {
  good: { label: 'كويس', emoji: '😊', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  fair: { label: 'مقبول', emoji: '😐', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  confused: { label: 'مش عارف', emoji: '🤔', color: 'text-stone-700 bg-stone-100 border-stone-200' },
  not_good: { label: 'مش كويس', emoji: '😔', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  exhausted: { label: 'متعب جداً', emoji: '😫', color: 'text-rose-700 bg-rose-50 border-rose-200' }
};

export const JourneyScreen: React.FC<JourneyScreenProps> = ({
  onOpenAssessment,
  onNavigateToContent,
  onOpenPersonalPlan,
  onOpenThoughtJournal,
  onOpenMindfulnessStudio,
  onOpenVoiceJournal,
  onNavigateToBreathe,
  onNavigateToListen,
  onNavigate,
  onOpenAllScreens
}) => {
  const [checkins, setCheckins] = useState<DailyCheckin[]>(storage.getDailyCheckins());
  const [notes, setNotes] = useState<PersonalNote[]>(storage.getNotes());
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(storage.getAssessments());
  const [habits, setHabits] = useState<WellnessHabit[]>(storage.getHabits());
  
  const hasSavedPlan = !!storage.getPersonalPlan();
  const thoughtPostsCount = storage.getThoughtPosts().length;
  const mindfulnessSessionsCount = storage.getMindfulnessRecords().length;
  
  // Note writing state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedNoteMood, setSelectedNoteMood] = useState<MoodValue | undefined>(undefined);

  // Habit writing state
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>('mindfulness');

  // Deleting check-in handler (as per spec page 7 & 18)
  const handleDeleteCheckin = (id: string) => {
    storage.deleteDailyCheckin(id);
    setCheckins(storage.getDailyCheckins());
  };

  // Note actions
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    storage.addNote(newNoteText.trim(), selectedNoteMood);
    setNotes(storage.getNotes());
    setNewNoteText('');
    setSelectedNoteMood(undefined);
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    storage.deleteNote(id);
    setNotes(storage.getNotes());
  };

  const handleDeleteAssessment = (id: string) => {
    storage.deleteAssessment(id);
    setAssessments(storage.getAssessments());
  };

  // Habit actions
  const handleToggleHabit = (habitId: string, dateStr: string) => {
    storage.toggleHabitCompletion(habitId, dateStr);
    setHabits(storage.getHabits());
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    storage.addHabit({
      title: newHabitTitle.trim(),
      category: newHabitCategory,
      frequency: 'daily',
      targetDaysPerWeek: 7
    });
    setHabits(storage.getHabits());
    setNewHabitTitle('');
    setIsAddingHabit(false);
  };

  const handleDeleteHabit = (id: string) => {
    storage.deleteHabit(id);
    setHabits(storage.getHabits());
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('ar-EG', { weekday: 'narrow' });
      dates.push({ dateStr, dayLabel, dayNum: d.getDate() });
    }
    return dates;
  };
  const weekDays = getLast7Days();

  // Strictly Descriptive Statistics (Section 15 & 19 from Spec)
  // e.g., "سجلت حالتك 5 أيام هذا الأسبوع" rather than medical claims like "اكتئابك انخفض 40%"
  const daysRecordedCount = checkins.length;
  const notesCount = notes.length;
  const assessmentsCount = assessments.length;

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 text-right">
      
      {/* Screen 8 Identifier Header */}
      {onNavigate && (
        <ScreenBannerHeader 
          screenId="journey" 
          onNavigate={onNavigate} 
          onOpenAllScreens={onOpenAllScreens} 
        />
      )}

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26332D]">
          رحلتي 🌱
        </h1>
        <p className="text-sm font-semibold text-[#174C3C]">
          «خطوة صغيرة كل يوم ممكن تعمل فرقاً»
        </p>
      </div>

      {/* خطة نسمة حياة الخاصة بي (Pages 13 & 14 from PDF) */}
      {onOpenPersonalPlan && (
        <section 
          onClick={onOpenPersonalPlan}
          className="cursor-pointer bg-gradient-to-r from-emerald-50 via-white to-[#F7F3E9] border border-[#A9C5A0]/60 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-[#174C3C] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              📑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#26332D]">
                  خطة نسمة حياة الخاصة بي
                </h3>
                {hasSavedPlan && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    مكتملة ومحفوظة ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-[#52645B] mt-0.5">
                مستنزفاتي، علامات التدهور، وما يساعدني وقت الضغوط
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#174C3C] group-hover:-translate-x-1 transition-transform">
            فتح الخطة 👈
          </span>
        </section>
      )}

      {/* مساحات الوعي والتأمل في الرحلة */}
      <div className="grid grid-cols-2 gap-2.5">
        {onOpenThoughtJournal && (
          <div
            onClick={onOpenThoughtJournal}
            className="cursor-pointer p-3.5 bg-white hover:bg-[#F7F3E9] border border-[#E6E8D8] hover:border-[#3A5A40] rounded-2xl transition-all shadow-2xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl group-hover:scale-105 transition-transform">✍️</span>
              <div>
                <div className="font-black text-xs text-[#283618]">مدونة الأفكار</div>
                <div className="text-[10px] text-[#58645C] mt-0.5">{thoughtPostsCount} تدوينة مسجلة</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#3A5A40] group-hover:-translate-x-1 transition-transform">فتح 👈</span>
          </div>
        )}

        {onOpenMindfulnessStudio && (
          <div
            onClick={onOpenMindfulnessStudio}
            className="cursor-pointer p-3.5 bg-white hover:bg-[#F7F3E9] border border-[#E6E8D8] hover:border-[#3A5A40] rounded-2xl transition-all shadow-2xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl group-hover:scale-105 transition-transform">🧘</span>
              <div>
                <div className="font-black text-xs text-[#283618]">تمارين اليقظة</div>
                <div className="text-[10px] text-[#58645C] mt-0.5">{mindfulnessSessionsCount} جلسة منجزة</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#3A5A40] group-hover:-translate-x-1 transition-transform">بدء 👈</span>
          </div>
        )}
      </div>

      {/* المذكرة الصوتية الواعية */}
      {onOpenVoiceJournal && (
        <div
          onClick={onOpenVoiceJournal}
          className="cursor-pointer p-4 bg-gradient-to-r from-rose-50 via-white to-[#F7F3E9] border border-rose-500/30 hover:border-rose-600 rounded-3xl transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-[#26332D]">
                  المذكرة الصوتية الواعية (تسجيل كلام إلى نص)
                </h3>
                <span className="text-[10px] bg-rose-500/15 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  جديد 🎙️
                </span>
              </div>
              <p className="text-xs text-[#52645B] mt-0.5">
                سجل مشاعرك بصوتك، وسيقوم النظام بتحويله وحفظه في مذكراتك فورياً
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 group-hover:-translate-x-1 transition-transform">
            ابدأ التسجيل 👈
          </span>
        </div>
      )}

      {/* الرسوم البيانية لتطور الحالة المزاجية والتقدم النفسي بواسطة recharts */}
      <MoodJourneyChartSection
        onOpenThoughtJournal={onOpenThoughtJournal}
        onOpenMindfulnessStudio={onOpenMindfulnessStudio}
      />

      {/* المولد الذكي للتقرير الأسبوعي */}
      <MoodReportGenerator
        onOpenThoughtJournal={onOpenThoughtJournal}
        onOpenMindfulnessStudio={onOpenMindfulnessStudio}
      />

      {/* تقويم الاسترخاء والتذكيرات اليومية */}
      <RelaxationCalendarSection
        onNavigateToBreathe={onNavigateToBreathe}
        onNavigateToListen={onNavigateToListen}
      />

      {/* Wellness Habits & Weekly Consistency Tracker */}
      <section className="bg-gradient-to-br from-[#F7F3E9] via-white to-emerald-50/40 border border-[#E6E8D8] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-[#26332D] flex items-center gap-2">
              <Check className="w-5 h-5 text-[#174C3C]" />
              <span>عادات الصحة النفسية اليومية</span>
            </h2>
            <p className="text-xs text-[#52645B]">
              «الاستمرارية الهادئة تصنع فارقاً حقيقياً»
            </p>
          </div>
          {!isAddingHabit && (
            <button
              onClick={() => setIsAddingHabit(true)}
              className="py-1.5 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#264235] transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة عادة</span>
            </button>
          )}
        </div>

        {/* Add Habit Form */}
        {isAddingHabit && (
          <form onSubmit={handleSaveHabit} className="p-4 bg-white border border-[#174C3C]/40 rounded-2xl space-y-3 animate-fade-in shadow-xs">
            <input
              type="text"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="مثال: تمرين التنفس العميق، المشي 10 دقائق، شرب الماء بوعي..."
              required
              className="w-full p-3 text-xs bg-[#F7F3E9] border border-[#E6E8D8] rounded-xl focus:outline-hidden focus:bg-white text-[#26332D]"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#52645B]">
                <span>التصنيف:</span>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as HabitCategory)}
                  className="p-1.5 text-xs bg-[#F7F3E9] border border-[#E6E8D8] rounded-xl text-[#26332D]"
                >
                  <option value="mindfulness">يقظة واسترخاء 🧘</option>
                  <option value="physical">صحة جسدية 💧</option>
                  <option value="routine">روتين يومي ☀️</option>
                  <option value="sleep">نوم واسترخاء 🌙</option>
                  <option value="social">تواصل إيجابي 🌱</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingHabit(false)}
                  className="py-1.5 px-3 text-xs text-[#52645B] hover:text-[#26332D]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
                >
                  حفظ العادة
                </button>
              </div>
            </div>
          </form>
        )}

        {habits.length === 0 ? (
          <div className="p-6 bg-white/70 border border-[#E6E8D8] rounded-2xl text-center text-xs text-[#7D8F85]">
            لم تقم بإضافة أي عادات بعد. أضف عادتك الأولى لتبدأ تتبع رحلتك اليومية.
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => {
              const completedDatesSet = new Set(habit.completedDates || []);
              const weeklyCompletedCount = weekDays.filter(d => completedDatesSet.has(d.dateStr)).length;
              const habitIcon = 
                habit.category === 'mindfulness' ? '🧘' :
                habit.category === 'physical' ? '💧' :
                habit.category === 'sleep' ? '🌙' :
                habit.category === 'social' ? '🌱' : '☀️';

              return (
                <div key={habit.id} className="p-4 bg-white/90 border border-[#E6E8D8] rounded-2xl space-y-3 shadow-2xs hover:border-[#174C3C]/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{habitIcon}</span>
                      <div>
                        <h3 className="font-bold text-xs text-[#26332D]">{habit.title}</h3>
                        <span className="text-[10px] text-[#52645B] font-medium">
                          إنجاز هذا الأسبوع: <strong className="text-[#174C3C]">{weeklyCompletedCount}</strong> من 7 أيام
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                      title="حذف العادة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 7-Day Consistency Visualization & Toggle Grid */}
                  <div className="pt-2 border-t border-[#E6E8D8]/60">
                    <div className="text-[11px] text-[#52645B] mb-2 font-medium">متابعة الأيام الـ 7 الأخيرة (اضغط لتحديد اليوم):</div>
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {weekDays.map(day => {
                        const isDone = completedDatesSet.has(day.dateStr);
                        const isToday = day.dateStr === new Date().toISOString().split('T')[0];

                        return (
                          <button
                            key={day.dateStr}
                            onClick={() => handleToggleHabit(habit.id, day.dateStr)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                              isDone
                                ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-xs'
                                : 'bg-[#F7F3E9] text-[#52645B] border-[#E6E8D8] hover:border-[#174C3C]'
                            } ${isToday && !isDone ? 'ring-2 ring-[#174C3C]/40' : ''}`}
                            title={`${day.dateStr}: ${isDone ? 'مكتملة (اضغط للإلغاء)' : 'غير مكتملة (اضغط للإنجاز)'}`}
                          >
                            <span className="text-[10px] font-bold">{day.dayLabel}</span>
                            <span className="text-xs font-mono font-extrabold mt-0.5">{day.dayNum}</span>
                            <span className="text-[10px] mt-1">
                              {isDone ? '✓' : '·'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Descriptive Statistics Card (Page 19) */}
      <section className="bg-gradient-to-r from-[#F7F3E9] to-[#EFEAE0] border border-[#E6E8D8] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-[#52645B]">
          <span className="font-bold text-[#26332D] flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#174C3C]" />
            <span>نشاطك ومتابعتك</span>
          </span>
          <span className="text-[11px] text-[#7D8F85]">إحصائيات وصفية دون أحكام</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-white/80 rounded-2xl border border-[#E6E8D8] text-center">
            <div className="font-mono text-xl font-extrabold text-[#174C3C]">
              {daysRecordedCount}
            </div>
            <div className="text-[11px] text-[#52645B] mt-0.5 font-medium">
              أيام تسجيل الحالة
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-[#E6E8D8] text-center">
            <div className="font-mono text-xl font-extrabold text-[#174C3C]">
              {notesCount}
            </div>
            <div className="text-[11px] text-[#52645B] mt-0.5 font-medium">
              ملاحظة شخصية
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-[#E6E8D8] text-center">
            <div className="font-mono text-xl font-extrabold text-[#174C3C]">
              {assessmentsCount}
            </div>
            <div className="text-[11px] text-[#52645B] mt-0.5 font-medium">
              استكشافات ذاتية
            </div>
          </div>
        </div>

        {/* Visual Mood Flow Wave */}
        {checkins.length > 0 && (
          <div className="p-4 bg-white/80 rounded-2xl border border-[#E6E8D8] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#52645B]">
              <span className="font-bold text-[#26332D]">موجة انسياب المشاعر (التسجيلات الأخيرة):</span>
              <span className="text-[10px] text-[#7D8F85]">كل شعور له قيمته</span>
            </div>
            
            <div className="flex items-end justify-between gap-2 pt-4 pb-2 px-2 h-20 border-b border-[#E6E8D8]">
              {checkins.slice(0, 7).reverse().map((chk, idx) => {
                const heightPercent = 
                  chk.moodValue === 'good' ? 95 :
                  chk.moodValue === 'fair' ? 70 :
                  chk.moodValue === 'confused' ? 50 :
                  chk.moodValue === 'not_good' ? 35 : 20;

                const moodEmoji = MOOD_MAP[chk.moodValue]?.emoji || '😐';
                return (
                  <div key={chk.id || idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="text-xs transition-transform group-hover:scale-125">{moodEmoji}</span>
                    <div 
                      className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#A9C5A0] to-[#174C3C] transition-all duration-500 opacity-80 group-hover:opacity-100"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] font-mono text-[#7D8F85] mt-1 truncate">
                      {new Date(chk.date).toLocaleDateString('ar-EG', { weekday: 'narrow' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-[#52645B] leading-relaxed pt-1">
          سجلت حالتك <strong>{daysRecordedCount} أيام</strong> مؤخراً. كل لحظة تخصصها لملاحظة نفسك تمنحك وعياً أكبر باحتياجاتك الحقيقية.
        </p>
      </section>

      {/* Daily Check-in Timeline (Page 18) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#26332D] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#174C3C]" />
            <span>سجل الأيام (Daily Check-in)</span>
          </h2>
          <span className="text-xs text-[#7D8F85]">يمكنك حذف أي يوم</span>
        </div>

        {checkins.length === 0 ? (
          <div className="p-6 bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl text-center text-xs text-[#7D8F85]">
            لم تقم بتسجيل حالتك بعد. يمكنك الضغط على أحد أوجه المشاعر في الشاشة الرئيسية.
          </div>
        ) : (
          <div className="space-y-2">
            {checkins.map(chk => {
              const moodInfo = MOOD_MAP[chk.moodValue] || MOOD_MAP.fair;
              const dateObj = new Date(chk.date);
              const formattedDate = dateObj.toLocaleDateString('ar-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'short'
              });

              return (
                <div
                  key={chk.id}
                  className="p-3.5 bg-[#F7F3E9] border border-[#E6E8D8] rounded-2xl flex items-center justify-between gap-3 hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodInfo.emoji}</span>
                    <div>
                      <div className="font-bold text-xs text-[#26332D]">
                        {formattedDate} — <span className="text-[#174C3C]">{moodInfo.label}</span>
                      </div>
                      {chk.optionalNote && (
                        <p className="text-[11px] text-[#52645B] mt-0.5 line-clamp-1">
                          {chk.optionalNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCheckin(chk.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-200/50 transition-colors"
                    title="حذف هذا الإدخال"
                    aria-label="حذف إدخال اليوم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Personal Notes (ملاحظاتي from Spec page 18) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#26332D] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#174C3C]" />
            <span>ملاحظاتي الخاصة</span>
          </h2>
          {!isAddingNote && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="py-1 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#264235] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ملاحظة</span>
            </button>
          )}
        </div>

        {/* Note editor form */}
        {isAddingNote && (
          <form onSubmit={handleSaveNote} className="p-4 bg-white border border-[#174C3C]/40 rounded-2xl space-y-3 animate-fade-in shadow-xs">
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="اكتب ما يدور في خاطرك اليوم، فكرة لاحظتها، أو إنجاز صغير تشكر نفسك عليه..."
              required
              className="w-full p-3 text-xs bg-[#F7F3E9] border border-[#E6E8D8] rounded-xl focus:outline-hidden focus:bg-white"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#52645B]">
                <span>المزاج:</span>
                {(['good', 'fair', 'not_good'] as MoodValue[]).map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setSelectedNoteMood(selectedNoteMood === m ? undefined : m)}
                    className={`p-1 text-base rounded-lg border ${
                      selectedNoteMood === m ? 'border-[#174C3C] bg-[#A9C5A0]/20' : 'border-[#E6E8D8]'
                    }`}
                  >
                    {MOOD_MAP[m].emoji}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="py-1.5 px-3 text-xs text-[#52645B] hover:text-[#26332D]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
                >
                  حفظ
                </button>
              </div>
            </div>
          </form>
        )}

        {notes.length === 0 ? (
          <div className="p-6 bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl text-center text-xs text-[#7D8F85]">
            لا توجد ملاحظات مسجلة بعد. استخدم الملاحظات كدفتر يوميات خفيف لتدوين خواطرك.
          </div>
        ) : (
          <div className="space-y-2.5">
            {notes.map(note => (
              <div
                key={note.id}
                className="p-4 bg-[#F7F3E9] border border-[#E6E8D8] rounded-2xl space-y-2 hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-[#52645B]">
                  <span className="font-mono">{new Date(note.date).toLocaleDateString('ar-EG')}</span>
                  <div className="flex items-center gap-2">
                    {note.moodTag && (
                      <span>{MOOD_MAP[note.moodTag]?.emoji}</span>
                    )}
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#26332D] leading-relaxed whitespace-pre-wrap">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Previous Assessments (التقييمات السابقة from Spec page 18 & 19) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#26332D] flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-[#174C3C]" />
            <span>التقييمات السابقة</span>
          </h2>
          <button
            onClick={onOpenAssessment}
            className="text-xs font-bold text-[#174C3C] hover:underline"
          >
            إجراء تقييم جديد
          </button>
        </div>

        {assessments.length === 0 ? (
          <div className="p-6 bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl text-center text-xs text-[#7D8F85]">
            لم تقم بإجراء أي تقييم ذاتي بعد.
          </div>
        ) : (
          <div className="space-y-2.5">
            {assessments.map(item => (
              <div
                key={item.id}
                className="p-4 bg-[#F7F3E9] border border-[#E6E8D8] rounded-2xl space-y-2 hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#26332D]">
                      {item.assessmentTitle}
                    </span>
                    <span className="text-[11px] text-[#7D8F85] mr-2">
                      ({new Date(item.createdAt).toLocaleDateString('ar-EG')})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-[#E6E8D8] rounded-lg">
                      {item.score} / {item.maxScore}
                    </span>
                    <button
                      onClick={() => handleDeleteAssessment(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="حذف سجل التقييم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold text-[#174C3C]">
                  {item.resultTitle}
                </div>

                <p className="text-xs text-[#52645B] leading-relaxed">
                  {item.resultText}
                </p>

                <div className="pt-1 text-[11px] text-[#7D8F85] flex items-center justify-between">
                  <span>* لا يمثل هذا التقييم تشخيصاً طبياً.</span>
                  <button
                    onClick={onNavigateToContent}
                    className="text-[#174C3C] hover:underline font-bold"
                  >
                    استكشف المحتوى المناسب ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
