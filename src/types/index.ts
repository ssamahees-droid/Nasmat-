export type UserRole = 
  | 'user' 
  | 'super_admin' 
  | 'content_manager' 
  | 'support_supervisor' 
  | 'support_member' 
  | 'specialist';

export interface User {
  id: string;
  emailOrPhone: string;
  name: string;
  createdAt: string;
  lastLogin: string;
  consentVersion: string;
  accountStatus: 'active' | 'suspended';
  role: UserRole;
}

export interface UserPreferences {
  userId: string;
  onboardingChoices: string[];
  notificationPreferences: {
    dailyReminder: boolean;
    newContent: boolean;
    preferredTime: string;
  };
  contentPreferences: string[];
}

export type ContentType = 'article' | 'video' | 'audio' | 'exercise';
export type ReviewStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  subCategory?: string;
  contentType: ContentType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  author: string;
  reviewer: string;
  reviewStatus: ReviewStatus;
  publishedAt: string;
  updatedAt: string;
  isSuggested?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
  active: boolean;
  subcategories: string[];
}

export interface Favorite {
  id: string;
  userId: string;
  contentId: string;
  createdAt: string;
}

export type MoodValue = 'good' | 'fair' | 'confused' | 'not_good' | 'exhausted';

export interface DailyCheckin {
  id: string;
  userId: string;
  moodValue: MoodValue;
  date: string; // YYYY-MM-DD
  optionalNote?: string;
  timestamp: string;
  version?: number;
  updatedAt?: string;
  deleted?: boolean;
}

export type HabitCategory = 'physical' | 'mindfulness' | 'social' | 'sleep' | 'routine';

export interface HabitDateRecord {
  completed: boolean;
  version: number;
  updatedAt: string;
}

export interface WellnessHabit {
  id: string;
  userId: string;
  title: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD
  completionLog?: Record<string, HabitDateRecord>;
  createdAt: string;
  version?: number;
  updatedAt?: string;
  deleted?: boolean;
}

export type AssessmentType = 'initial_check' | 'phq9';

export interface AssessmentRecord {
  id: string;
  userId: string;
  assessmentType: AssessmentType;
  assessmentTitle: string;
  instrumentVersion: string;
  answers: Record<string, number | string>;
  score: number;
  maxScore: number;
  resultTitle: string;
  resultText: string;
  recommendation: string;
  createdAt: string;
  safetyFlagTriggered?: boolean;
  version?: number;
  updatedAt?: string;
  deleted?: boolean;
}

export type SupportRequestType = 
  | 'listener' 
  | 'guidance' 
  | 'specialist' 
  | 'confused';

export type SupportStatus = 
  | 'new' 
  | 'received' 
  | 'in_review' 
  | 'contacted' 
  | 'referred' 
  | 'closed';

export interface SupportRequest {
  id: string; // e.g. '#1024'
  userId: string;
  userName: string;
  userContact: string;
  requestType: SupportRequestType;
  message: string;
  status: SupportStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export interface BreathingSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  type: 'quick_calm' | 'stress_relief' | 'sleep' | 'busy_mind' | 'spiritual';
  icon: string;
  instructions: {
    phase: 'inhale' | 'hold' | 'exhale' | 'rest';
    seconds: number;
    label: string;
  }[];
  ambientSounds: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'reminder' | 'content' | 'support' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
}

// ==========================================
// Psychoeducation Library Types (المكتبة النفسية)
// ==========================================

export interface VerifiedReference {
  title: string;
  source: string;
  url?: string;
  year?: string;
  note?: string;
}

export interface PracticalExercise {
  title: string;
  description: string;
  steps: string[];
  durationMinutes?: number;
  optionalAlternative: {
    title: string;
    description: string;
  };
}

export interface UrgentHotline {
  country: string;
  service: string;
  number: string;
}

export interface PsychoeducationTopic {
  id: string;
  trackId: string;
  trackTitle: string;
  trackNumber: number;
  topicNumber: number;
  title: string;
  subtitle: string;
  estimatedReadTimeMinutes: number;
  lastReviewedDate: string;
  clinicalReviewer: string;
  introduction: string;
  scientificExplanation: {
    summary: string;
    details: string[];
    cautions?: string;
  };
  realLifeExamples: {
    scenario: string;
    analysis: string;
  }[];
  whatHelps: string[];
  whatAggravates: string[];
  practicalExercise: PracticalExercise;
  reflectionQuestions: string[];
  whenToSeekHelp: {
    redFlags: string[];
    guidance: string;
    urgentHotlines?: UrgentHotline[];
  };
  references: VerifiedReference[];
  relatedInternalTools?: {
    label: string;
    toolActionId: 'breathe' | 'feker' | 'battery' | 'compass' | 'knot' | 'translate' | 'rescue' | 'emergency';
  }[];
  tags: string[];
}

export interface PsychoeducationTrack {
  id: string;
  order: number;
  title: string;
  shortDescription: string;
  icon: string;
  topicsCount: number;
}

