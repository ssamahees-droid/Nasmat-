import { storage } from './storage';
import { chimeService } from './chimeService';
import { NotificationItem } from '../types';

export interface LocalNotificationSettings {
  moodKitchenReminderEnabled: boolean;
  hoursThreshold: number; // default 24
  soundEnabled: boolean;
}

const SETTINGS_KEY = 'nesmat_local_notifications_settings_v1';
const LAST_NOTIFIED_KEY = 'nesmat_mood_kitchen_last_notified_timestamp';

class LocalNotificationService {
  private checkIntervalId: any = null;

  // Get user notification preferences
  getSettings(): LocalNotificationSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return {
      moodKitchenReminderEnabled: true,
      hoursThreshold: 24,
      soundEnabled: true
    };
  }

  saveSettings(settings: Partial<LocalNotificationSettings>): LocalNotificationSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  // Web Notification API status
  isNativeSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getNativePermission(): NotificationPermission | 'unsupported' {
    if (!this.isNativeSupported()) return 'unsupported';
    return Notification.permission;
  }

  async requestNativePermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isNativeSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return Notification.permission;
    }
  }

  // Calculate hours since last Mood Kitchen log
  getHoursSinceLastMoodKitchenLog(): { hoursElapsed: number; lastLogDate: Date | null } {
    const latest = storage.getLatestMoodKitchenLog();
    if (!latest || !latest.timestamp) {
      return { hoursElapsed: 999, lastLogDate: null };
    }
    const logTime = new Date(latest.timestamp).getTime();
    if (isNaN(logTime)) {
      return { hoursElapsed: 999, lastLogDate: null };
    }
    const elapsedMs = Math.max(0, Date.now() - logTime);
    const hoursElapsed = Math.floor(elapsedMs / (1000 * 60 * 60));
    return { hoursElapsed, lastLogDate: new Date(logTime) };
  }

  // Check and trigger notification if > 24 hours of inactivity
  checkMoodKitchenInactivity(force = false): {
    triggered: boolean;
    hoursElapsed: number;
    notification?: NotificationItem;
    reason?: string;
  } {
    const settings = this.getSettings();
    if (!settings.moodKitchenReminderEnabled && !force) {
      return { triggered: false, hoursElapsed: 0, reason: 'reminders_disabled' };
    }

    const { hoursElapsed, lastLogDate } = this.getHoursSinceLastMoodKitchenLog();
    const threshold = settings.hoursThreshold || 24;

    // Check if 24 hours elapsed or forced
    if (hoursElapsed < threshold && !force) {
      return { triggered: false, hoursElapsed, reason: 'within_threshold' };
    }

    // Anti-spam check: prevent firing more than once every 20 hours unless forced
    const lastNotifiedRaw = localStorage.getItem(LAST_NOTIFIED_KEY);
    if (lastNotifiedRaw && !force) {
      const lastNotifiedTime = parseInt(lastNotifiedRaw, 10);
      const hoursSinceLastNotification = (Date.now() - lastNotifiedTime) / (1000 * 60 * 60);
      if (hoursSinceLastNotification < 20) {
        return { triggered: false, hoursElapsed, reason: 'already_notified_recently' };
      }
    }

    // Determine tailored notification text
    const latestLog = storage.getLatestMoodKitchenLog();
    let bodyAr = 'مرّت أكثر من ٢٤ ساعة منذ آخر تسجيل في مطبخ المزاج. تفقّد محور الأمعاء–الدماغ واكتشف الأنشطة والتمارين المقترحة لصفاء ذهنك وراحتك الآن 🌱';
    let suggestedActivity = 'دقيقة تنفس هادئة أو لعبة فرقعة الأعباء';

    if (latestLog?.mood === 'tense') {
      bodyAr = 'مرّت ٢٤ ساعة منذ آخر تسجيل في مطبخ المزاج؛ هل لا زلت تشعر بالتوتر؟ نوصيك بدقيقة تنفس للعصب الحائر ولعبة فرقعة الأعباء لاستعادة التوازن 🌱';
      suggestedActivity = 'فرقعة الأعباء النفسية وتمرين التنفس البطني';
    } else if (latestLog?.mood === 'sluggish') {
      bodyAr = 'مرّت ٢٤ ساعة دون تسجيل وجبتك ومزاجك؛ لتجاوز الخمول الذهني نوصيك بحركة خفيفة وتطبيق فكّر لإيقاظ التركيز 💡';
      suggestedActivity = 'تطبيق فكّر واستوديو التيقظ الواعي';
    } else if (latestLog?.mood === 'bloated') {
      bodyAr = 'تذكير مطبخ المزاج: كيف تشعر بعد وجبات اليوم؟ نوصيك بمغلي الكمون الدافئ وتمرين إرخاء الحجاب الحاجز لراحة أمعائك 🌿';
      suggestedActivity = 'إرخاء الحجاب الحاجز وحديقة الامتنان';
    }

    // 1. Add in-app notification to storage
    const newNotif = storage.addNotification({
      title: '🍳 تذكير مطبخ المزاج • نشاط موصى به',
      body: bodyAr,
      type: 'mood_kitchen',
      actionType: 'mood_kitchen'
    });

    // 2. Play subtle chime if enabled
    if (settings.soundEnabled) {
      chimeService.playReassuranceChime();
    }

    // 3. Web Notification API (Browser notification)
    if (this.isNativeSupported() && Notification.permission === 'granted') {
      try {
        const native = new Notification('🍳 تذكير مطبخ المزاج • نسمة حياة', {
          body: `${bodyAr} (مقترح الآن: ${suggestedActivity})`,
          icon: '/favicon.ico',
          tag: 'nesmat-mood-kitchen-reminder'
        });

        native.onclick = () => {
          window.focus();
          window.dispatchEvent(new CustomEvent('nesmat_open_mood_kitchen'));
          native.close();
        };
      } catch (err) {
        console.warn('Could not fire native notification:', err);
      }
    }

    // Save timestamp of notification to prevent spamming
    localStorage.setItem(LAST_NOTIFIED_KEY, Date.now().toString());

    // Dispatch global event for in-app toasts/badges
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nesmat_notification_dispatched', {
        detail: { notification: newNotif, hoursElapsed }
      }));
    }

    return {
      triggered: true,
      hoursElapsed,
      notification: newNotif
    };
  }

  // Simulation / Test trigger for UI testing
  triggerTestReminder(): NotificationItem {
    const result = this.checkMoodKitchenInactivity(true);
    return result.notification!;
  }

  // Start periodic monitor (checks on start and every 15 minutes)
  startAutoMonitor(intervalMinutes = 15): () => void {
    if (typeof window === 'undefined') return () => {};

    // Initial check after short delay on mount
    const initialTimeout = setTimeout(() => {
      this.checkMoodKitchenInactivity();
    }, 4000);

    // Periodic interval
    const intervalMs = intervalMinutes * 60 * 1000;
    this.checkIntervalId = setInterval(() => {
      this.checkMoodKitchenInactivity();
    }, intervalMs);

    return () => {
      clearTimeout(initialTimeout);
      if (this.checkIntervalId) {
        clearInterval(this.checkIntervalId);
        this.checkIntervalId = null;
      }
    };
  }
}

export const localNotificationService = new LocalNotificationService();
