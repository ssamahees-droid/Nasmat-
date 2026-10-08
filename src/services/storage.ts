import { 
  User, 
  UserPreferences, 
  ContentItem, 
  Category, 
  DailyCheckin, 
  AssessmentRecord, 
  SupportRequest, 
  Favorite, 
  NotificationItem, 
  AuditLog, 
  UserRole,
  ReviewStatus,
  SupportStatus,
  MoodValue,
  WellnessHabit
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_CONTENT, 
  INITIAL_DAILY_CHECKINS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_SUPPORT_REQUESTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

const KEYS = {
  USER: 'nesmat_user_v1',
  PREFERENCES: 'nesmat_prefs_v1',
  CONTENT: 'nesmat_content_v1',
  CATEGORIES: 'nesmat_categories_v1',
  CHECKINS: 'nesmat_checkins_v1',
  HABITS: 'nesmat_habits_v1',
  NOTES: 'nesmat_notes_v1',
  ASSESSMENTS: 'nesmat_assessments_v1',
  SUPPORT: 'nesmat_support_v1',
  FAVORITES: 'nesmat_favorites_v1',
  NOTIFICATIONS: 'nesmat_notifications_v1',
  AUDIT_LOGS: 'nesmat_audit_logs_v1',
  ONBOARDED: 'nesmat_has_onboarded_v1',
  PERSONAL_PLAN: 'nesmat_personal_plan_v1',
  ENERGY_BUDGET: 'nesmat_energy_budget_v1',
  SLEEP_LOGS: 'nesmat_sleep_logs_v1',
  THOUGHT_POSTS: 'nesmat_thought_posts_v1',
  MINDFULNESS_SESSIONS: 'nesmat_mindfulness_sessions_v1'
};

export interface PersonalNote {
  id: string;
  userId: string;
  text: string;
  date: string;
  moodTag?: MoodValue;
  version?: number;
  updatedAt?: string;
}

export type ThoughtCategory = 'awareness' | 'gratitude' | 'reframing' | 'release' | 'gentleness';

export interface ThoughtPost {
  id: string;
  title: string;
  content: string;
  category: ThoughtCategory;
  mood?: MoodValue;
  createdAt: string;
  promptUsed?: string;
  isFavorite?: boolean;
}

export interface MindfulnessRecord {
  id: string;
  exerciseId: string;
  title: string;
  durationSeconds: number;
  completedAt: string;
  feelingAfter?: string;
}

export const INITIAL_THOUGHT_POSTS: ThoughtPost[] = [
  {
    id: 'post_1',
    title: 'أنت لست أفكارك.. أنت الفضاء الذي تمر فيه',
    content: 'عندما تدور في عقلك فكرة مثل: "أنا فاشل" أو "كل شيء سيفسد"، تذكّر أن هناك فرقاً شاسعاً بين أن "تكون الفكرة" وبين أن "تلاحظ الفكرة". يمكنك أن تقول لنفسك بهدوء: "أنا ألاحظ أن عقلي يقترح الآن فكرة أنني فاشل". هذه المسافة البسيطة بينك وبين الفكرة تمنحك حرية التنفس وعدم الانجراف.',
    category: 'awareness',
    mood: 'good',
    createdAt: '2026-10-04T09:30:00Z',
    promptUsed: 'ملاحظة فكرة متكررة دون تصديقها تلقائياً',
    isFavorite: true
  },
  {
    id: 'post_2',
    title: 'امتنان لأشياء صغيرة لم نطلب منها أن تحدث',
    content: 'كوب شاي دافئ في الصباح، نسمة هواء باردة تلامس وجهك عند فتح النافذة، وسرير آمن بعد يوم طويل. السعادة الحقيقية ليست في غياب التحديات، بل في تدريب العين على رؤية النعم اليومية البسيطة وسط زحام الحياة.',
    category: 'gratitude',
    mood: 'fair',
    createdAt: '2026-10-03T18:15:00Z',
    promptUsed: '3 نعم صغيرة أحاطت بي اليوم دون مجهود مني',
    isFavorite: false
  },
  {
    id: 'post_3',
    title: 'الرفق بالذات في الأيام الثقيلة',
    content: 'في بعض الأيام، إنجازك الأكبر هو أنك استيقظت، وأخذت أنفاسك، وتجاوزت الساعات بصبر. لا تعاقب نفسك عندما تكون بطاريتك 2 من 10 لأنك لم تنجز كأنك في 10 من 10. الرفق بالذات ليس استسلاماً، بل احترام صادق لطاقتك الإنسانية.',
    category: 'gentleness',
    mood: 'confused',
    createdAt: '2026-10-02T14:00:00Z',
    promptUsed: 'ما الكلمات التي أحتاج أن أسمعها من شخص يحبني دون شروط؟',
    isFavorite: true
  }
];

// Initial default user
export const DEFAULT_USER: User = {
  id: 'u_demo',
  emailOrPhone: 'user@nesmatalhayat.org',
  name: 'أحمد',
  createdAt: '2026-09-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  consentVersion: 'v1.0-2026',
  accountStatus: 'active',
  role: 'user'
};

class StorageService {
  private favoriteListeners: ((contentId: string, isFavorited: boolean) => void)[] = [];
  private noteListeners: ((note: PersonalNote, operation: 'upsert' | 'delete') => void)[] = [];
  private checkinListeners: ((checkin: DailyCheckin, operation: 'upsert' | 'delete') => void)[] = [];
  private habitListeners: ((habit: WellnessHabit, operation: 'upsert' | 'delete') => void)[] = [];
  private assessmentListeners: ((assessment: AssessmentRecord, operation: 'upsert' | 'delete') => void)[] = [];

  onFavoriteChanged(listener: (contentId: string, isFavorited: boolean) => void): () => void {
    this.favoriteListeners.push(listener);
    return () => {
      this.favoriteListeners = this.favoriteListeners.filter(l => l !== listener);
    };
  }

  onNoteChanged(listener: (note: PersonalNote, operation: 'upsert' | 'delete') => void): () => void {
    this.noteListeners.push(listener);
    return () => {
      this.noteListeners = this.noteListeners.filter(l => l !== listener);
    };
  }

  onCheckinChanged(listener: (checkin: DailyCheckin, operation: 'upsert' | 'delete') => void): () => void {
    this.checkinListeners.push(listener);
    return () => {
      this.checkinListeners = this.checkinListeners.filter(l => l !== listener);
    };
  }

  onHabitChanged(listener: (habit: WellnessHabit, operation: 'upsert' | 'delete') => void): () => void {
    this.habitListeners.push(listener);
    return () => {
      this.habitListeners = this.habitListeners.filter(l => l !== listener);
    };
  }

  onAssessmentChanged(listener: (assessment: AssessmentRecord, operation: 'upsert' | 'delete') => void): () => void {
    this.assessmentListeners.push(listener);
    return () => {
      this.assessmentListeners = this.assessmentListeners.filter(l => l !== listener);
    };
  }

  // --- User & Auth ---
  getUser(): User {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) {
      this.setUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USER;
    }
  }

  setUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  updateUserRole(role: UserRole): void {
    const user = this.getUser();
    user.role = role;
    this.setUser(user);
    this.logAction(user.id, user.name, 'UPDATE_ROLE', 'User', user.id);
  }

  updateUserProfile(name: string, emailOrPhone: string): void {
    const user = this.getUser();
    user.name = name;
    user.emailOrPhone = emailOrPhone;
    this.setUser(user);
  }

  hasCompletedOnboarding(): boolean {
    return localStorage.getItem(KEYS.ONBOARDED) === 'true';
  }

  setOnboarded(completed: boolean): void {
    localStorage.setItem(KEYS.ONBOARDED, completed ? 'true' : 'false');
  }

  // --- Preferences ---
  getPreferences(): UserPreferences {
    const raw = localStorage.getItem(KEYS.PREFERENCES);
    if (!raw) {
      const initial: UserPreferences = {
        userId: 'u_demo',
        onboardingChoices: ['حاسس إني مضغوط', 'عايز أفهم نفسي أكتر'],
        notificationPreferences: {
          dailyReminder: true,
          newContent: true,
          preferredTime: '20:00'
        },
        contentPreferences: ['anxiety_stress', 'know_myself']
      };
      this.savePreferences(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        userId: 'u_demo',
        onboardingChoices: [],
        notificationPreferences: { dailyReminder: true, newContent: true, preferredTime: '20:00' },
        contentPreferences: []
      };
    }
  }

  savePreferences(prefs: UserPreferences): void {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
  }

  // --- Categories ---
  getCategories(): Category[] {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    const user = this.getUser();
    this.logAction(user.id, user.name, 'CREATE_CATEGORY', 'Category', category.id);
  }

  // --- Content ---
  getContent(): ContentItem[] {
    const raw = localStorage.getItem(KEYS.CONTENT);
    if (!raw) {
      localStorage.setItem(KEYS.CONTENT, JSON.stringify(INITIAL_CONTENT));
      return INITIAL_CONTENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONTENT;
    }
  }

  getContentById(id: string): ContentItem | undefined {
    return this.getContent().find(c => c.id === id);
  }

  saveContentItem(item: ContentItem): void {
    const content = this.getContent();
    const index = content.findIndex(c => c.id === item.id);
    const user = this.getUser();
    if (index >= 0) {
      content[index] = item;
      this.logAction(user.id, user.name, 'UPDATE_CONTENT', 'Content', item.id);
    } else {
      content.unshift(item);
      this.logAction(user.id, user.name, 'CREATE_CONTENT', 'Content', item.id);
    }
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(content));
  }

  updateContentStatus(id: string, status: ReviewStatus): void {
    const content = this.getContent();
    const item = content.find(c => c.id === id);
    if (item) {
      item.reviewStatus = status;
      item.updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.CONTENT, JSON.stringify(content));
      const user = this.getUser();
      this.logAction(user.id, user.name, `UPDATE_STATUS_${status.toUpperCase()}`, 'Content', id);
    }
  }

  deleteContentItem(id: string): void {
    const content = this.getContent().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(content));
    const user = this.getUser();
    this.logAction(user.id, user.name, 'DELETE_CONTENT', 'Content', id);
  }

  // --- Favorites ---
  getFavorites(): string[] {
    const raw = localStorage.getItem(KEYS.FAVORITES);
    if (!raw) return ['c1', 'c2'];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  toggleFavorite(contentId: string): boolean {
    const favs = this.getFavorites();
    const exists = favs.includes(contentId);
    let updated: string[];
    if (exists) {
      updated = favs.filter(id => id !== contentId);
    } else {
      updated = [...favs, contentId];
    }
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
    const newState = !exists;
    this.favoriteListeners.forEach(fn => {
      try { fn(contentId, newState); } catch {}
    });
    return newState;
  }

  isFavorite(contentId: string): boolean {
    return this.getFavorites().includes(contentId);
  }

  // --- Daily Check-ins ---
  getDailyCheckins(): DailyCheckin[] {
    const raw = localStorage.getItem(KEYS.CHECKINS);
    if (!raw) {
      localStorage.setItem(KEYS.CHECKINS, JSON.stringify(INITIAL_DAILY_CHECKINS));
      return INITIAL_DAILY_CHECKINS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DAILY_CHECKINS;
    }
  }

  addDailyCheckin(moodValue: MoodValue, optionalNote?: string): DailyCheckin {
    const checkins = this.getDailyCheckins();
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = checkins.findIndex(c => c.date === today);
    const existing = existingIndex >= 0 ? checkins[existingIndex] : undefined;
    const nowIso = new Date().toISOString();

    const newEntry: DailyCheckin = {
      id: existing ? existing.id : 'dc_' + Date.now(),
      userId: this.getUser().id,
      moodValue,
      date: today,
      optionalNote,
      timestamp: nowIso,
      version: existing ? (existing.version || 1) + 1 : 1,
      updatedAt: nowIso
    };

    if (existingIndex >= 0) {
      checkins[existingIndex] = newEntry;
    } else {
      checkins.unshift(newEntry);
    }
    localStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkins));
    this.checkinListeners.forEach(fn => {
      try { fn(newEntry, 'upsert'); } catch {}
    });
    return newEntry;
  }

  deleteDailyCheckin(id: string): void {
    const existing = this.getDailyCheckins().find(c => c.id === id);
    const checkins = this.getDailyCheckins().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkins));
    if (existing) {
      const deletedEntry: DailyCheckin = {
        ...existing,
        version: (existing.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        deleted: true
      };
      this.checkinListeners.forEach(fn => {
        try { fn(deletedEntry, 'delete'); } catch {}
      });
    }
  }

  // --- Wellness Habits ---
  getHabits(): WellnessHabit[] {
    const raw = localStorage.getItem(KEYS.HABITS);
    if (!raw) {
      const defaults: WellnessHabit[] = [
        {
          id: 'habit_mindful_breathing',
          userId: this.getUser().id,
          title: 'تمرين التنفس الهادئ (3 دقائق)',
          category: 'mindfulness',
          frequency: 'daily',
          targetDaysPerWeek: 7,
          completedDates: [],
          createdAt: '2026-10-01T00:00:00.000Z',
          version: 1,
          updatedAt: '2026-10-01T00:00:00.000Z'
        },
        {
          id: 'habit_water_hydration',
          userId: this.getUser().id,
          title: 'شرب كوب ماء فور الاستيقاظ',
          category: 'physical',
          frequency: 'daily',
          targetDaysPerWeek: 7,
          completedDates: [],
          createdAt: '2026-10-01T00:00:00.000Z',
          version: 1,
          updatedAt: '2026-10-01T00:00:00.000Z'
        }
      ];
      localStorage.setItem(KEYS.HABITS, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addHabit(data: Omit<WellnessHabit, 'id' | 'userId' | 'createdAt' | 'completedDates' | 'version' | 'updatedAt'>): WellnessHabit {
    const habits = this.getHabits();
    const nowIso = new Date().toISOString();
    const newHabit: WellnessHabit = {
      ...data,
      id: 'habit_' + Date.now(),
      userId: this.getUser().id,
      completedDates: [],
      createdAt: nowIso,
      version: 1,
      updatedAt: nowIso
    };
    habits.unshift(newHabit);
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    this.habitListeners.forEach(fn => {
      try { fn(newHabit, 'upsert'); } catch {}
    });
    return newHabit;
  }

  updateHabit(id: string, updates: Partial<WellnessHabit>): WellnessHabit | null {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index === -1) return null;
    const nowIso = new Date().toISOString();
    const current = habits[index];
    const updatedHabit: WellnessHabit = {
      ...current,
      ...updates,
      id: current.id,
      userId: current.userId,
      version: (current.version || 1) + 1,
      updatedAt: nowIso
    };
    habits[index] = updatedHabit;
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    this.habitListeners.forEach(fn => {
      try { fn(updatedHabit, 'upsert'); } catch {}
    });
    return updatedHabit;
  }

  toggleHabitCompletion(id: string, date = new Date().toISOString().split('T')[0]): WellnessHabit | null {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index === -1) return null;
    const current = habits[index];
    const completedSet = new Set(current.completedDates || []);
    const wasCompleted = completedSet.has(date);
    const nowIso = new Date().toISOString();

    if (wasCompleted) {
      completedSet.delete(date);
    } else {
      completedSet.add(date);
    }

    const log = { ...(current.completionLog || {}) };
    const prevDateRecord = log[date];
    log[date] = {
      completed: !wasCompleted,
      version: prevDateRecord ? (prevDateRecord.version || 1) + 1 : 1,
      updatedAt: nowIso
    };

    const updatedHabit: WellnessHabit = {
      ...current,
      completedDates: Array.from(completedSet),
      completionLog: log,
      version: (current.version || 1) + 1,
      updatedAt: nowIso
    };
    habits[index] = updatedHabit;
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    this.habitListeners.forEach(fn => {
      try { fn(updatedHabit, 'upsert'); } catch {}
    });
    return updatedHabit;
  }

  deleteHabit(id: string): void {
    const existing = this.getHabits().find(h => h.id === id);
    const habits = this.getHabits().filter(h => h.id !== id);
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    if (existing) {
      const deletedHabit: WellnessHabit = {
        ...existing,
        version: (existing.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        deleted: true
      };
      this.habitListeners.forEach(fn => {
        try { fn(deletedHabit, 'delete'); } catch {}
      });
    }
  }

  // --- Personal Notes in Journey ---
  getNotes(): PersonalNote[] {
    const raw = localStorage.getItem(KEYS.NOTES);
    if (!raw) {
      const initial: PersonalNote[] = [
        {
          id: 'note_1',
          userId: 'u_demo',
          text: 'اليوم قررت أن أمنح نفسي 15 دقيقة هدوء بدون النظر في الهاتف فور الاستيقاظ، وفرق معي جداً في مستوى التركيز.',
          date: '2026-10-02',
          moodTag: 'good'
        }
      ];
      localStorage.setItem(KEYS.NOTES, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addNote(text: string, moodTag?: MoodValue): PersonalNote {
    const notes = this.getNotes();
    const nowIso = new Date().toISOString();
    const newNote: PersonalNote = {
      id: 'note_' + Date.now(),
      userId: this.getUser().id,
      text,
      date: nowIso.split('T')[0],
      moodTag,
      version: 1,
      updatedAt: nowIso
    };
    notes.unshift(newNote);
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    this.noteListeners.forEach(fn => {
      try { fn(newNote, 'upsert'); } catch {}
    });
    return newNote;
  }

  updateNote(id: string, text: string, moodTag?: MoodValue): PersonalNote | null {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    const nowIso = new Date().toISOString();
    const current = notes[index];
    const updatedNote: PersonalNote = {
      ...current,
      text,
      moodTag: moodTag !== undefined ? moodTag : current.moodTag,
      version: (current.version || 1) + 1,
      updatedAt: nowIso
    };
    notes[index] = updatedNote;
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    this.noteListeners.forEach(fn => {
      try { fn(updatedNote, 'upsert'); } catch {}
    });
    return updatedNote;
  }

  deleteNote(id: string): void {
    const existing = this.getNotes().find(n => n.id === id);
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    if (existing) {
      const deletedNote: PersonalNote = {
        ...existing,
        version: (existing.version || 1) + 1,
        updatedAt: new Date().toISOString()
      };
      this.noteListeners.forEach(fn => {
        try { fn(deletedNote, 'delete'); } catch {}
      });
    }
  }

  // --- Assessments ---
  getAssessments(): AssessmentRecord[] {
    const raw = localStorage.getItem(KEYS.ASSESSMENTS);
    if (!raw) {
      localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
      return INITIAL_ASSESSMENTS;
    }
    try {
      const parsed: AssessmentRecord[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(a => !a.deleted) : INITIAL_ASSESSMENTS;
    } catch {
      return INITIAL_ASSESSMENTS;
    }
  }

  saveAssessment(record: AssessmentRecord): AssessmentRecord {
    const assessments = this.getAssessments();
    const nowIso = new Date().toISOString();
    const existingIndex = assessments.findIndex(a => a.id === record.id);
    const existing = existingIndex >= 0 ? assessments[existingIndex] : undefined;

    const savedRecord: AssessmentRecord = {
      ...record,
      version: existing ? (existing.version || 1) + 1 : (record.version || 1),
      updatedAt: nowIso
    };

    if (existingIndex >= 0) {
      assessments[existingIndex] = savedRecord;
    } else {
      assessments.unshift(savedRecord);
    }
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(assessments));
    this.assessmentListeners.forEach(fn => {
      try { fn(savedRecord, 'upsert'); } catch {}
    });
    return savedRecord;
  }

  deleteAssessment(id: string): void {
    const existing = this.getAssessments().find(a => a.id === id);
    const assessments = this.getAssessments().filter(a => a.id !== id);
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(assessments));
    if (existing) {
      const deletedRecord: AssessmentRecord = {
        ...existing,
        version: (existing.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        deleted: true
      };
      this.assessmentListeners.forEach(fn => {
        try { fn(deletedRecord, 'delete'); } catch {}
      });
    }
  }

  // --- Support Requests ---
  getSupportRequests(): SupportRequest[] {
    const raw = localStorage.getItem(KEYS.SUPPORT);
    if (!raw) {
      localStorage.setItem(KEYS.SUPPORT, JSON.stringify(INITIAL_SUPPORT_REQUESTS));
      return INITIAL_SUPPORT_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUPPORT_REQUESTS;
    }
  }

  createSupportRequest(data: {
    userName: string;
    userContact: string;
    requestType: SupportRequest['requestType'];
    message: string;
  }): SupportRequest {
    const requests = this.getSupportRequests();
    // generate ID like #1025
    const nextNum = 1024 + requests.length + 1;
    const newReq: SupportRequest = {
      id: `#${nextNum}`,
      userId: this.getUser().id,
      userName: data.userName || this.getUser().name,
      userContact: data.userContact || this.getUser().emailOrPhone,
      requestType: data.requestType,
      message: data.message,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    requests.unshift(newReq);
    localStorage.setItem(KEYS.SUPPORT, JSON.stringify(requests));
    
    // Add audit log
    const user = this.getUser();
    this.logAction(user.id, user.name, 'CREATE_SUPPORT_REQUEST', 'SupportRequest', newReq.id);
    return newReq;
  }

  updateSupportStatus(id: string, status: SupportStatus, assignedTo?: string): void {
    const requests = this.getSupportRequests();
    const req = requests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (assignedTo) req.assignedTo = assignedTo;
      req.updatedAt = new Date().toISOString();
      if (status === 'closed') {
        req.closedAt = new Date().toISOString();
      }
      localStorage.setItem(KEYS.SUPPORT, JSON.stringify(requests));
      const user = this.getUser();
      this.logAction(user.id, user.name, `UPDATE_SUPPORT_STATUS_${status.toUpperCase()}`, 'SupportRequest', id);
    }
  }

  addSupportMessage(requestId: string, text: string, senderName: string, senderRole: string): void {
    const requests = this.getSupportRequests();
    const req = requests.find(r => r.id === requestId);
    if (req) {
      req.messages.push({
        id: 'msg_' + Date.now(),
        requestId,
        senderId: this.getUser().id,
        senderName,
        senderRole,
        message: text,
        createdAt: new Date().toISOString()
      });
      req.updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.SUPPORT, JSON.stringify(requests));
    }
  }

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const item = notifs.find(n => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(KEYS.AUDIT_LOGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  logAction(actorId: string, actorName: string, action: string, entity: string, entityId: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log_' + Date.now(),
      actorId,
      actorName,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString()
    });
    // Keep max 100 logs
    if (logs.length > 100) logs.length = 100;
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  // --- Booklet & Self-Discovery Plan (Pages 1-15) ---
  getPersonalPlan(): any {
    const raw = localStorage.getItem(KEYS.PERSONAL_PLAN);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  savePersonalPlan(plan: any): void {
    localStorage.setItem(KEYS.PERSONAL_PLAN, JSON.stringify({
      ...plan,
      lastUpdated: new Date().toISOString()
    }));
  }

  getEnergyBudget(): any {
    const raw = localStorage.getItem(KEYS.ENERGY_BUDGET);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  saveEnergyBudget(budget: any): void {
    localStorage.setItem(KEYS.ENERGY_BUDGET, JSON.stringify({
      ...budget,
      lastUpdated: new Date().toISOString()
    }));
  }

  getSleepLogs(): any[] {
    const raw = localStorage.getItem(KEYS.SLEEP_LOGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addSleepLog(log: any): void {
    const logs = this.getSleepLogs();
    logs.unshift({
      id: 'sleep_' + Date.now(),
      ...log,
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem(KEYS.SLEEP_LOGS, JSON.stringify(logs.slice(0, 14)));
  }

  // --- Thought Journal / مدونة الأفكار والخواطر ---
  getThoughtPosts(): ThoughtPost[] {
    const raw = localStorage.getItem(KEYS.THOUGHT_POSTS);
    if (!raw) {
      this.saveThoughtPosts(INITIAL_THOUGHT_POSTS);
      return INITIAL_THOUGHT_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_THOUGHT_POSTS;
    }
  }

  saveThoughtPosts(posts: ThoughtPost[]): void {
    localStorage.setItem(KEYS.THOUGHT_POSTS, JSON.stringify(posts));
  }

  addThoughtPost(post: Omit<ThoughtPost, 'id' | 'createdAt'>): ThoughtPost {
    const posts = this.getThoughtPosts();
    const newPost: ThoughtPost = {
      ...post,
      id: 'thought_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    this.saveThoughtPosts(posts);
    return newPost;
  }

  updateThoughtPost(id: string, updates: Partial<ThoughtPost>): void {
    const posts = this.getThoughtPosts().map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveThoughtPosts(posts);
  }

  deleteThoughtPost(id: string): void {
    const posts = this.getThoughtPosts().filter(p => p.id !== id);
    this.saveThoughtPosts(posts);
  }

  toggleThoughtFavorite(id: string): void {
    const posts = this.getThoughtPosts().map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
    this.saveThoughtPosts(posts);
  }

  // --- Mindfulness Sessions / سجل جلسات اليقظة الذهنية ---
  getMindfulnessRecords(): MindfulnessRecord[] {
    const raw = localStorage.getItem(KEYS.MINDFULNESS_SESSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addMindfulnessRecord(record: Omit<MindfulnessRecord, 'id' | 'completedAt'>): MindfulnessRecord {
    const records = this.getMindfulnessRecords();
    const newRecord: MindfulnessRecord = {
      ...record,
      id: 'mindful_' + Date.now(),
      completedAt: new Date().toISOString()
    };
    records.unshift(newRecord);
    localStorage.setItem(KEYS.MINDFULNESS_SESSIONS, JSON.stringify(records.slice(0, 30)));
    return newRecord;
  }

  // --- Privacy & Egyptian Data Law 151 / 2020 Compliance ---
  exportAllUserData(): string {
    const data = {
      exportDate: new Date().toISOString(),
      disclaimer: 'تطبيق نسمة حياة - تصدير البيانات الشخصية وفق قانون حماية البيانات رقم 151 لسنة 2020',
      user: this.getUser(),
      preferences: this.getPreferences(),
      checkins: this.getDailyCheckins(),
      notes: this.getNotes(),
      assessments: this.getAssessments(),
      supportRequests: this.getSupportRequests().filter(r => r.userId === this.getUser().id),
      favorites: this.getFavorites()
    };
    return JSON.stringify(data, null, 2);
  }

  deleteAllUserData(): void {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.PREFERENCES);
    localStorage.removeItem(KEYS.CHECKINS);
    localStorage.removeItem(KEYS.NOTES);
    localStorage.removeItem(KEYS.ASSESSMENTS);
    localStorage.removeItem(KEYS.FAVORITES);
    localStorage.removeItem(KEYS.ONBOARDED);
  }

  resetAllToFactoryDemo(): void {
    localStorage.clear();
  }
}

export const storage = new StorageService();
