import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Bell, 
  BellRing, 
  Sparkles, 
  Wind, 
  Heart, 
  Moon, 
  Compass, 
  Play, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Repeat,
  Volume2,
  VolumeX,
  ExternalLink
} from 'lucide-react';
import { storage } from '../services/storage';
import { ScheduledRelaxationSession } from '../types';
import { ambientSound } from '../utils/audioSynth';
import { chimeService } from '../services/chimeService';

interface RelaxationCalendarSectionProps {
  onNavigateToBreathe?: () => void;
  onNavigateToListen?: () => void;
}

export const RELAXATION_EXERCISES = [
  { id: 'breathe_478', title: 'تمرين التنفس 4-7-8', duration: 4, icon: '🌬️', desc: 'تهدئة فورية لضربات القلب والجهاز العصبي' },
  { id: 'pmr_relax', title: 'استرخاء العضلات التدريجي', duration: 10, icon: '🧘', desc: 'شد وإرخاء تدريجي للعضلات لتفريغ التوتر' },
  { id: 'one_min_breath', title: 'دقيقة تنفس هادئة', duration: 1, icon: '🌊', desc: 'استراحة سريعة وواعية وسط أعباء اليوم' },
  { id: 'inner_safety', title: 'مساحة أمانك الداخلي', duration: 8, icon: '🛡️', desc: 'احتواء المشاعر والتواصل برفق مع الذات' },
  { id: 'thought_release', title: 'تفريغ الأفكار المزعجة', duration: 7, icon: '🍃', desc: 'تخفيف الزحام الذهني وفكفكة الأفكار المقلقة' },
  { id: 'grounding_54321', title: 'تمرين التثبيت الحسي 5-4-3-2-1', duration: 5, icon: '🧭', desc: 'الخروج من دوامة القلق والعودة للحاضر' },
  { id: 'sleep_calm', title: 'تأمل الاستعداد لنوم هادئ', duration: 12, icon: '🌙', desc: 'تهدئة الجسم والعقل قبل النوم العميق' },
  { id: 'custom', title: 'تمرين مخصص من اختياري', duration: 5, icon: '✍️', desc: 'تمرينك المفضل الخاص' }
];

export const RelaxationCalendarSection: React.FC<RelaxationCalendarSectionProps> = ({
  onNavigateToBreathe,
  onNavigateToListen
}) => {
  // Calendar View State: Current Year & Month
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Sessions and reminders
  const [sessions, setSessions] = useState<ScheduledRelaxationSession[]>([]);
  const [reminderConfig, setReminderConfig] = useState(() => storage.getRelaxationReminderSettings());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testNotificationToast, setTestNotificationToast] = useState<string | null>(null);

  // Active in-app reminder alert when trigger time is met
  const [activeAlarm, setActiveAlarm] = useState<{
    id: string;
    exerciseTitle: string;
    exerciseIcon: string;
    durationMinutes: number;
    exerciseId: string;
    time: string;
  } | null>(null);

  // Notification Permission state
  const [permStatus, setPermStatus] = useState<NotificationPermission | 'unsupported'>('default');

  // Form State for new session
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('breathe_478');
  const [customExerciseTitle, setCustomExerciseTitle] = useState('');
  const [sessionTime, setSessionTime] = useState('21:00');
  const [sessionDate, setSessionDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [enableSessionReminder, setEnableSessionReminder] = useState(true);
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Keep track of triggered notifications today to avoid repeat alarms during the same minute
  const triggeredCacheRef = useRef<Set<string>>(new Set());

  // Load sessions from storage
  const reloadSessions = () => {
    setSessions(storage.getScheduledRelaxationSessions());
  };

  useEffect(() => {
    reloadSessions();
    if ('Notification' in window) {
      setPermStatus(Notification.permission);
    } else {
      setPermStatus('unsupported');
    }
  }, []);

  // Request browser permission
  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      setTestNotificationToast('المتصفح الحالي لا يدعم إشعارات سطح المكتب، سيتم التنبيه داخل التطبيق 🌿');
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setPermStatus(res);
      if (res === 'granted') {
        setTestNotificationToast('تم تفعيل إشعارات المتصفح بنجاح! ستصلك التذكيرات في موعدها 🌿');
      } else {
        setTestNotificationToast('تم رفض إذن الإشعارات في المتصفح. يمكنك تفعيلها من إعدادات الموقع.');
      }
    } catch {
      setPermStatus('denied');
    }
  };

  // Sound chime player helper
  const playReminderChime = () => {
    try {
      ambientSound.playSingingBowlChime(432);
    } catch {}
    try {
      chimeService.playSuccessChime();
    } catch {}
  };

  // Local notification dispatcher
  const triggerLocalNotification = (title: string, body: string, session?: ScheduledRelaxationSession) => {
    // 1. Play calming chime
    playReminderChime();

    // 2. Native browser Notification if supported & granted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/logo.jpg',
          badge: '/logo.jpg'
        });
      } catch (err) {
        console.warn('Native notification trigger failed:', err);
      }
    }

    // 3. In-app storage notification center
    storage.addNotification({
      title,
      body,
      type: 'reminder'
    });

    // 4. In-app active alert popup
    if (session) {
      setActiveAlarm({
        id: session.id,
        exerciseTitle: session.exerciseTitle,
        exerciseIcon: session.exerciseIcon,
        durationMinutes: session.durationMinutes,
        exerciseId: session.exerciseId,
        time: session.time
      });
    } else {
      setActiveAlarm({
        id: 'global_daily',
        exerciseTitle: 'جلسة استرخاء وتجديد طاقة',
        exerciseIcon: '🌿',
        durationMinutes: 5,
        exerciseId: 'breathe_478',
        time: reminderConfig.preferredTime
      });
    }
  };

  // Active Background Interval Checker (every 25 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      const todayDate = now.toISOString().split('T')[0];

      // A. Check scheduled sessions for today (or sessions with repeatDaily = true)
      sessions.forEach(sess => {
        if (!sess.reminderEnabled) return;
        
        const isScheduledToday = sess.date === todayDate || sess.repeatDaily;
        if (!isScheduledToday) return;

        if (sess.time === currentTime) {
          const cacheKey = `sess_${sess.id}_${todayDate}_${currentTime}`;
          if (!triggeredCacheRef.current.has(cacheKey)) {
            triggeredCacheRef.current.add(cacheKey);
            triggerLocalNotification(
              `نسمة حياة 🌿 — موعد تمرينك: ${sess.exerciseTitle}`,
              `حان موعد جلسة الاسترخاء (${sess.durationMinutes} دقيقة) لتفريغ التوتر واستعادة هدوئك وسلامك الداخلي.`,
              sess
            );
          }
        }
      });

      // B. Check Global Preferred Daily Reminder
      if (reminderConfig.enabled && reminderConfig.preferredTime === currentTime) {
        const globalCacheKey = `global_${todayDate}_${currentTime}`;
        if (!triggeredCacheRef.current.has(globalCacheKey)) {
          triggeredCacheRef.current.add(globalCacheKey);
          triggerLocalNotification(
            'نسمة حياة 🌿 — تذكيرك اليومي للاسترخاء',
            'خذ نفساً عميقاً، خصص 5 دقائق لنفسك الآن لتهدئة جهازك العصبي وتجديد طاقتك.'
          );
        }
      }
    }, 25000);

    return () => clearInterval(intervalId);
  }, [sessions, reminderConfig]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (dayNum: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedDateStr(formatted);
    setSessionDate(formatted);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter sessions for selected date (including daily recurring sessions)
  const sessionsOnSelectedDay = sessions.filter(s => s.date === selectedDateStr || s.repeatDaily);

  // Group sessions by date for calendar indicators
  const sessionDatesMap = new Map<string, ScheduledRelaxationSession[]>();
  sessions.forEach(s => {
    if (s.repeatDaily) {
      // mark all days in current month
      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const list = sessionDatesMap.get(dStr) || [];
        if (!list.some(item => item.id === s.id)) {
          list.push(s);
          sessionDatesMap.set(dStr, list);
        }
      }
    } else {
      const list = sessionDatesMap.get(s.date) || [];
      list.push(s);
      sessionDatesMap.set(s.date, list);
    }
  });

  // Handle Save Session
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const exercise = RELAXATION_EXERCISES.find(ex => ex.id === selectedExerciseId);
    if (!exercise) return;

    const title = selectedExerciseId === 'custom' 
      ? (customExerciseTitle.trim() || 'تمرين استرخاء خاص') 
      : exercise.title;

    storage.addScheduledRelaxationSession({
      exerciseId: selectedExerciseId,
      exerciseTitle: title,
      exerciseIcon: exercise.icon,
      durationMinutes: exercise.duration,
      date: sessionDate,
      time: sessionTime,
      reminderEnabled: enableSessionReminder,
      repeatDaily: repeatDaily,
      notes: sessionNotes.trim() || undefined
    });

    reloadSessions();
    setIsAddModalOpen(false);
    setSelectedDateStr(sessionDate);
    setSessionNotes('');
    setCustomExerciseTitle('');
    setRepeatDaily(false);

    // If reminder enabled, ensure browser permission requested
    if (enableSessionReminder && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(setPermStatus).catch(() => {});
    }

    setTestNotificationToast(`تمت جدولة تمرين «${title}» في موعد ${sessionTime} بنجاح 🌿`);
    setTimeout(() => setTestNotificationToast(null), 4000);
  };

  // Toggle Complete
  const handleToggleComplete = (id: string) => {
    storage.toggleScheduledRelaxationCompletion(id);
    reloadSessions();
  };

  // Delete
  const handleDeleteSession = (id: string) => {
    storage.deleteScheduledRelaxationSession(id);
    reloadSessions();
  };

  // Toggle Global Daily Reminder
  const handleToggleGlobalReminder = () => {
    const next = { ...reminderConfig, enabled: !reminderConfig.enabled };
    setReminderConfig(next);
    storage.setRelaxationReminderSettings(next);

    if (next.enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(setPermStatus).catch(() => {});
    }
  };

  // Update Preferred Time
  const handleUpdatePreferredTime = (newTime: string) => {
    const next = { ...reminderConfig, preferredTime: newTime };
    setReminderConfig(next);
    storage.setRelaxationReminderSettings(next);
  };

  // Test Reminder Trigger (Audio + Notification + In-app)
  const handleTestReminder = () => {
    const message = 'تذكير تجريبي من نسمة حياة: حان وقت جلسة الاسترخاء اليومية لتجديد طاقتك وسلامك الداخلي 🌿.';

    triggerLocalNotification('نسمة حياة 🌿 — تذكير الاسترخاء التجريبي', message);

    setTestNotificationToast('تم إرسال إشعار التذكير وتشغيل جرس الاسترخاء بنجاح! تفقد الشاشة والإشعارات 🔔');
    setTimeout(() => {
      setTestNotificationToast(null);
    }, 4500);
  };

  return (
    <section className="bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 text-right transition-colors relative">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 text-[#174C3C] dark:text-[#A9C5A0] flex items-center justify-center text-base">
              📅
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#174C3C] dark:text-[#F7F3E9] font-syne">
              تقويم الاسترخاء والتذكيرات اليومية
            </h2>
          </div>
          <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70 mt-1">
            جدول تمارينك النفسية المفضلة مع تنبيهات محلية صوتية وإشعارات يومية منتظمة.
          </p>
        </div>

        <button
          onClick={() => {
            setSessionDate(selectedDateStr);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-white dark:text-[#0D1914] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>جدولة تمرين استرخاء</span>
        </button>
      </div>

      {/* Daily Reminders Quick Settings Bar */}
      <div className="p-4 rounded-2xl bg-[#F7F3E9] dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              reminderConfig.enabled 
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                : 'bg-black/5 dark:bg-white/5 text-stone-400'
            }`}>
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#174C3C] dark:text-[#F7F3E9] block">
                  التذكير اليومي التلقائي بالاسترخاء
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  reminderConfig.enabled
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                }`}>
                  {reminderConfig.enabled ? 'مفعل يومياً ✓' : 'متوقف'}
                </span>
              </div>
              <span className="text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60">
                يرسل إشعاراً ويشغل جرساً هادئاً لتذكيرك بأخذ استراحة واعية.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Preferred Time Picker */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#14271F] px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300">الموعد:</span>
              <input
                type="time"
                value={reminderConfig.preferredTime}
                onChange={e => handleUpdatePreferredTime(e.target.value)}
                className="bg-transparent font-mono font-bold text-xs focus:outline-hidden text-[#174C3C] dark:text-[#A9C5A0]"
                title="تعديل وقت التذكير اليومي"
              />
            </div>

            {/* Test Trigger Button */}
            <button
              onClick={handleTestReminder}
              className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/30 border border-black/10 dark:border-white/10 hover:bg-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="إرسال إشعار تجريبي فوري واختبار الصوت"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>تجربة إشعار وصوت 🔔</span>
            </button>

            {/* Main Toggle */}
            <button
              onClick={handleToggleGlobalReminder}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reminderConfig.enabled
                  ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
              }`}
            >
              {reminderConfig.enabled ? 'إيقاف' : 'تشغيل'}
            </button>
          </div>
        </div>

        {/* Browser Permission Status Note */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60 pt-2 border-t border-black/5 dark:border-white/5 gap-2">
          <div className="flex items-center gap-1.5">
            <span>حالة إشعارات المتصفح:</span>
            {permStatus === 'granted' ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>مفعلة وتعمل مباشرة على هذا الجهاز ✓</span>
              </span>
            ) : permStatus === 'denied' ? (
              <span className="text-rose-600 font-bold">
                محظورة من المتصفح (تُعرض التنبيهات داخل التطبيق فقط)
              </span>
            ) : (
              <span className="text-amber-600 font-bold">
                بانتظار منح الإذن لتظهر خارج المتصفح
              </span>
            )}
          </div>

          {permStatus === 'default' && (
            <button
              onClick={handleRequestPermission}
              className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold underline cursor-pointer hover:opacity-80"
            >
              انقر لمنح إذن الإشعارات 🔔
            </button>
          )}
        </div>
      </div>

      {testNotificationToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testNotificationToast}</span>
        </div>
      )}

      {/* Calendar Month Header & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-syne font-black text-base text-[#174C3C] dark:text-[#A9C5A0]">
              {monthNamesArabic[month]} {year}
            </span>
            {selectedDateStr === todayStr && (
              <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                اليوم
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:bg-[#174C3C]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="الشهر السابق"
            >
              <ChevronRight className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
            </button>
            <button
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDateStr(now.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:bg-[#174C3C]/5 transition-colors cursor-pointer"
            >
              هذا الشهر
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:bg-[#174C3C]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="الشهر التالي"
            >
              <ChevronLeft className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#13251E]/60 dark:text-[#F7F3E9]/60 pb-1 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/10">
          {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid of Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Empty cells before first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;
            const daySessions = sessionDatesMap.get(dateStr) || [];

            return (
              <button
                key={dateStr}
                onClick={() => handleSelectDay(dayNum)}
                className={`h-11 sm:h-13 rounded-2xl border text-center flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-[#174C3C] dark:border-[#A9C5A0] shadow-sm font-bold scale-102'
                    : isToday
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'bg-white/70 dark:bg-[#0D1914]/70 border-[#174C3C]/10 dark:border-[#A9C5A0]/15 text-[#13251E] dark:text-[#F7F3E9] hover:border-[#174C3C]/40'
                }`}
              >
                <span className="text-xs sm:text-sm font-jetbrains leading-none mt-0.5">
                  {dayNum}
                </span>

                {/* Session Dot Badges */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {daySessions.slice(0, 3).map((sess, sIdx) => (
                    <span 
                      key={sIdx} 
                      className={`w-1.5 h-1.5 rounded-full ${
                        sess.completed 
                          ? (isSelected ? 'bg-amber-300' : 'bg-emerald-500') 
                          : (isSelected ? 'bg-white' : 'bg-amber-500')
                      }`} 
                    />
                  ))}
                  {daySessions.length > 3 && (
                    <span className="text-[8px] leading-none opacity-80">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda & Scheduled Exercises */}
      <div className="pt-4 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0]">
              تمارين اليوم المحدد ({selectedDateStr}):
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono">
              {sessionsOnSelectedDay.length} {sessionsOnSelectedDay.length === 1 ? 'تمرين' : 'تمارين'}
            </span>
          </div>

          <button
            onClick={() => {
              setSessionDate(selectedDateStr);
              setIsAddModalOpen(true);
            }}
            className="text-xs text-[#174C3C] dark:text-[#A9C5A0] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة تمرين لهذا اليوم</span>
          </button>
        </div>

        {sessionsOnSelectedDay.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#F7F3E9]/50 dark:bg-[#0D1914]/50 border border-dashed border-[#174C3C]/20 dark:border-[#A9C5A0]/20 text-center space-y-2">
            <span className="text-2xl block">🍃</span>
            <p className="text-xs text-[#13251E]/60 dark:text-[#F7F3E9]/60">
              لا توجد تمارين مجدولة لهذا اليوم حتى الآن.
            </p>
            <button
              onClick={() => {
                setSessionDate(selectedDateStr);
                setIsAddModalOpen(true);
              }}
              className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0] hover:underline cursor-pointer"
            >
              اضغط هنا لاختيار تمرين استرخاء وجدولته 👈
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessionsOnSelectedDay.map(sess => (
              <div
                key={sess.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  sess.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-white dark:bg-[#0D1914] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleComplete(sess.id)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      sess.completed
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'border-[#174C3C]/30 hover:border-[#174C3C] text-transparent'
                    }`}
                    title={sess.completed ? 'اضغط لإلغاء الإنجاز' : 'اضغط للتحديد كمنجز'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sess.exerciseIcon}</span>
                      <h4 className={`text-sm font-bold ${sess.completed ? 'line-through text-stone-500' : 'text-[#174C3C] dark:text-[#F7F3E9]'}`}>
                        {sess.exerciseTitle}
                      </h4>
                      {sess.repeatDaily && (
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>يومي</span>
                        </span>
                      )}
                      {sess.completed && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                          تم بنجاح ✓
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#13251E]/60 dark:text-[#F7F3E9]/60 mt-1">
                      <span className="flex items-center gap-1 font-jetbrains font-bold">
                        <Clock className="w-3 h-3 text-[#174C3C] dark:text-[#A9C5A0]" />
                        <span>{sess.time}</span>
                      </span>
                      <span>•</span>
                      <span>{sess.durationMinutes} دقيقة</span>
                      {sess.reminderEnabled && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <Bell className="w-3 h-3" />
                            <span>تذكير مفعّل</span>
                          </span>
                        </>
                      )}
                      {sess.notes && (
                        <>
                          <span>•</span>
                          <span className="italic">{sess.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Quick Launch Exercise */}
                  {!sess.completed && (
                    <button
                      onClick={() => {
                        if (sess.exerciseId === 'breathe_478' || sess.exerciseId === 'one_min_breath') {
                          onNavigateToBreathe?.();
                        } else if (sess.exerciseId === 'inner_safety') {
                          onNavigateToListen?.();
                        } else {
                          handleToggleComplete(sess.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 hover:bg-[#174C3C] hover:text-white dark:hover:bg-[#A9C5A0] dark:hover:text-[#0D1914] text-[#174C3C] dark:text-[#A9C5A0] rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>بدء التمرين الآن</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteSession(sess.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="حذف هذا الموعد"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Active In-App Alarm Banner (when alarm is triggered) */}
      {activeAlarm && (
        <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto z-50 bg-[#174C3C] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-[#A9C5A0]/40 flex items-center justify-between gap-3 animate-bounce-subtle font-cairo">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">{activeAlarm.exerciseIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full">
                  حان الموعد الآن 🔔
                </span>
                <span className="text-xs font-mono opacity-80">{activeAlarm.time}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeAlarm.exerciseTitle}</h4>
              <p className="text-[11px] text-[#A9C5A0]">
                جلسة استرخاء لمدة {activeAlarm.durationMinutes} دقائق لتجديد سلامك الداخلي.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveAlarm(null);
                if (activeAlarm.exerciseId === 'breathe_478' || activeAlarm.exerciseId === 'one_min_breath') {
                  onNavigateToBreathe?.();
                } else if (activeAlarm.exerciseId === 'inner_safety') {
                  onNavigateToListen?.();
                }
              }}
              className="px-3.5 py-2 bg-[#A9C5A0] hover:bg-[#BFD9B6] text-[#0D1914] text-xs font-bold rounded-xl flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>ابدأ الآن</span>
            </button>
            <button
              onClick={() => setActiveAlarm(null)}
              className="p-2 text-white/70 hover:text-white cursor-pointer"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-cairo">
          <div 
            className="bg-[#F7F3E9] dark:bg-[#14271F] p-6 sm:p-7 rounded-3xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 max-w-lg w-full space-y-5 text-right shadow-2xl overflow-y-auto max-h-[90vh]"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#174C3C] dark:text-[#F7F3E9]">
                <CalendarIcon className="w-5 h-5 text-[#174C3C] dark:text-[#A9C5A0]" />
                <span>جدولة تمرين استرخاء جديد</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-black/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              
              {/* Exercise Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold block text-[#174C3C] dark:text-[#F7F3E9]">
                  اختر تمرين الاسترخاء المفضل لديك:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RELAXATION_EXERCISES.map(ex => {
                    const isSelected = selectedExerciseId === ex.id;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => setSelectedExerciseId(ex.id)}
                        className={`p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#174C3C] text-white dark:bg-[#A9C5A0] dark:text-[#0D1914] border-transparent shadow-xs'
                            : 'bg-white dark:bg-[#0D1914] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-[#13251E] dark:text-[#F7F3E9] hover:border-[#174C3C]/40'
                        }`}
                      >
                        <span className="text-xl">{ex.icon}</span>
                        <div>
                          <span className="font-bold text-xs block">{ex.title}</span>
                          <span className={`text-[10px] block mt-0.5 ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
                            {ex.duration} دقائق • {ex.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Title if custom chosen */}
              {selectedExerciseId === 'custom' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-xs font-bold block">اسم التمرين المخصص:</label>
                  <input
                    type="text"
                    value={customExerciseTitle}
                    onChange={e => setCustomExerciseTitle(e.target.value)}
                    placeholder="مثال: الاستماع لصوت المطر، المشي الهادئ..."
                    className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl"
                  />
                </div>
              )}

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold block">التاريخ:</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={e => setSessionDate(e.target.value)}
                    required
                    className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl text-center font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold block">وقت الجلسة:</label>
                  <input
                    type="time"
                    value={sessionTime}
                    onChange={e => setSessionTime(e.target.value)}
                    required
                    className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl text-center font-mono"
                  />
                </div>
              </div>

              {/* Repeat Daily Option */}
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-xs font-bold text-[#174C3C] dark:text-[#F7F3E9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={repeatDaily}
                  onChange={e => setRepeatDaily(e.target.checked)}
                  className="w-4 h-4 rounded text-[#174C3C] accent-[#174C3C]"
                />
                <Repeat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>تكرار التذكير بهذا التمرين يومياً في نفس الموعد 🔁</span>
              </label>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold block">ملاحظة شخصية (اختياري):</label>
                <input
                  type="text"
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  placeholder="مثال: قبل النوم، بعد العمل، في الغرفة الهادئة..."
                  className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl"
                />
              </div>

              {/* Reminder Toggle */}
              <label className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-800 dark:text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSessionReminder}
                  onChange={e => setEnableSessionReminder(e.target.checked)}
                  className="w-4 h-4 rounded text-[#174C3C] accent-[#174C3C]"
                />
                <Bell className="w-4 h-4 text-amber-600" />
                <span>تفعيل التنبيه الصوتي والإشعار المحلي لهذا الموعد 🔔</span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-white dark:text-[#0D1914] text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  حفظ في التقويم 📅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
