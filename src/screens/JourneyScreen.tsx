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
import { DailyCheckin, MoodValue, AssessmentRecord } from '../types';

interface JourneyScreenProps {
  onOpenAssessment: () => void;
  onNavigateToContent: () => void;
  onOpenPersonalPlan?: () => void;
  onOpenThoughtJournal?: () => void;
  onOpenMindfulnessStudio?: () => void;
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
  onOpenMindfulnessStudio
}) => {
  const [checkins, setCheckins] = useState<DailyCheckin[]>(storage.getDailyCheckins());
  const [notes, setNotes] = useState<PersonalNote[]>(storage.getNotes());
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(storage.getAssessments());
  const hasSavedPlan = !!storage.getPersonalPlan();
  const thoughtPostsCount = storage.getThoughtPosts().length;
  const mindfulnessSessionsCount = storage.getMindfulnessRecords().length;
  
  // Note writing state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedNoteMood, setSelectedNoteMood] = useState<MoodValue | undefined>(undefined);

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

  // Strictly Descriptive Statistics (Section 15 & 19 from Spec)
  // e.g., "سجلت حالتك 5 أيام هذا الأسبوع" rather than medical claims like "اكتئابك انخفض 40%"
  const daysRecordedCount = checkins.length;
  const notesCount = notes.length;
  const assessmentsCount = assessments.length;

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26332D]">
          رحلتي 🌱
        </h1>
        <p className="text-sm font-semibold text-[#355C4A]">
          «خطوة صغيرة كل يوم ممكن تعمل فرقاً»
        </p>
      </div>

      {/* خطة نسمة حياة الخاصة بي (Pages 13 & 14 from PDF) */}
      {onOpenPersonalPlan && (
        <section 
          onClick={onOpenPersonalPlan}
          className="cursor-pointer bg-gradient-to-r from-emerald-50 via-white to-[#FAF7F0] border border-[#8FAF9A]/60 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-[#355C4A] transition-all flex items-center justify-between group"
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
          <span className="text-xs font-bold text-[#355C4A] group-hover:-translate-x-1 transition-transform">
            فتح الخطة 👈
          </span>
        </section>
      )}

      {/* مساحات الوعي والتأمل في الرحلة */}
      <div className="grid grid-cols-2 gap-2.5">
        {onOpenThoughtJournal && (
          <div
            onClick={onOpenThoughtJournal}
            className="cursor-pointer p-3.5 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-2xl transition-all shadow-2xs flex items-center justify-between group"
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
            className="cursor-pointer p-3.5 bg-white hover:bg-[#FAF7F2] border border-[#E5DACB] hover:border-[#3A5A40] rounded-2xl transition-all shadow-2xs flex items-center justify-between group"
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

      {/* Descriptive Statistics Card (Page 19) */}
      <section className="bg-gradient-to-r from-[#FAF7F0] to-[#EFEAE0] border border-[#E8DDCC] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-[#52645B]">
          <span className="font-bold text-[#26332D] flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#355C4A]" />
            <span>نشاطك ومتابعتك</span>
          </span>
          <span className="text-[11px] text-[#7D8F85]">إحصائيات وصفية دون أحكام</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-white/80 rounded-2xl border border-[#E8DDCC] text-center">
            <div className="font-mono text-xl font-extrabold text-[#355C4A]">
              {daysRecordedCount}
            </div>
            <div className="text-[11px] text-[#52645B] mt-0.5 font-medium">
              أيام تسجيل الحالة
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-[#E8DDCC] text-center">
            <div className="font-mono text-xl font-extrabold text-[#355C4A]">
              {notesCount}
            </div>
            <div className="text-[11px] text-[#52645B] mt-0.5 font-medium">
              ملاحظة شخصية
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-[#E8DDCC] text-center">
            <div className="font-mono text-xl font-extrabold text-[#355C4A]">
              {assessmentsCount}
            </div>
            <div className="text-[11px] text-[#52645B] mt-0.5 font-medium">
              استكشافات ذاتية
            </div>
          </div>
        </div>

        {/* Visual Mood Flow Wave */}
        {checkins.length > 0 && (
          <div className="p-4 bg-white/80 rounded-2xl border border-[#E8DDCC] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#52645B]">
              <span className="font-bold text-[#26332D]">موجة انسياب المشاعر (التسجيلات الأخيرة):</span>
              <span className="text-[10px] text-[#7D8F85]">كل شعور له قيمته</span>
            </div>
            
            <div className="flex items-end justify-between gap-2 pt-4 pb-2 px-2 h-20 border-b border-[#E8DDCC]">
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
                      className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#8FAF9A] to-[#355C4A] transition-all duration-500 opacity-80 group-hover:opacity-100"
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
            <Calendar className="w-4 h-4 text-[#355C4A]" />
            <span>سجل الأيام (Daily Check-in)</span>
          </h2>
          <span className="text-xs text-[#7D8F85]">يمكنك حذف أي يوم</span>
        </div>

        {checkins.length === 0 ? (
          <div className="p-6 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl text-center text-xs text-[#7D8F85]">
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
                  className="p-3.5 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl flex items-center justify-between gap-3 hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodInfo.emoji}</span>
                    <div>
                      <div className="font-bold text-xs text-[#26332D]">
                        {formattedDate} — <span className="text-[#355C4A]">{moodInfo.label}</span>
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
            <Edit3 className="w-4 h-4 text-[#355C4A]" />
            <span>ملاحظاتي الخاصة</span>
          </h2>
          {!isAddingNote && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="py-1 px-3 bg-[#355C4A] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#264235] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ملاحظة</span>
            </button>
          )}
        </div>

        {/* Note editor form */}
        {isAddingNote && (
          <form onSubmit={handleSaveNote} className="p-4 bg-white border border-[#355C4A]/40 rounded-2xl space-y-3 animate-fade-in shadow-xs">
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="اكتب ما يدور في خاطرك اليوم، فكرة لاحظتها، أو إنجاز صغير تشكر نفسك عليه..."
              required
              className="w-full p-3 text-xs bg-[#FAF7F0] border border-[#E8DDCC] rounded-xl focus:outline-hidden focus:bg-white"
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
                      selectedNoteMood === m ? 'border-[#355C4A] bg-[#8FAF9A]/20' : 'border-[#E8DDCC]'
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
                  className="py-1.5 px-4 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
                >
                  حفظ
                </button>
              </div>
            </div>
          </form>
        )}

        {notes.length === 0 ? (
          <div className="p-6 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl text-center text-xs text-[#7D8F85]">
            لا توجد ملاحظات مسجلة بعد. استخدم الملاحظات كدفتر يوميات خفيف لتدوين خواطرك.
          </div>
        ) : (
          <div className="space-y-2.5">
            {notes.map(note => (
              <div
                key={note.id}
                className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl space-y-2 hover:bg-white transition-all"
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
            <ClipboardCheck className="w-4 h-4 text-[#355C4A]" />
            <span>التقييمات السابقة</span>
          </h2>
          <button
            onClick={onOpenAssessment}
            className="text-xs font-bold text-[#355C4A] hover:underline"
          >
            إجراء تقييم جديد
          </button>
        </div>

        {assessments.length === 0 ? (
          <div className="p-6 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl text-center text-xs text-[#7D8F85]">
            لم تقم بإجراء أي تقييم ذاتي بعد.
          </div>
        ) : (
          <div className="space-y-2.5">
            {assessments.map(item => (
              <div
                key={item.id}
                className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl space-y-2 hover:bg-white transition-all"
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
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-[#E8DDCC] rounded-lg">
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

                <div className="text-xs font-semibold text-[#355C4A]">
                  {item.resultTitle}
                </div>

                <p className="text-xs text-[#52645B] leading-relaxed">
                  {item.resultText}
                </p>

                <div className="pt-1 text-[11px] text-[#7D8F85] flex items-center justify-between">
                  <span>* لا يمثل هذا التقييم تشخيصاً طبياً.</span>
                  <button
                    onClick={onNavigateToContent}
                    className="text-[#355C4A] hover:underline font-bold"
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
