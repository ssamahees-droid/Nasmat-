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
  avatarUrl?: string;
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

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface BreathingSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  type: 'quick_calm' | 'stress_relief' | 'sleep' | 'busy_mind' | 'spiritual';
  icon: string;
  instructions: {
    phase: BreathingPhase;
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
  type: 'reminder' | 'content' | 'support' | 'system' | 'mood_kitchen';
  read: boolean;
  createdAt: string;
  actionType?: 'mood_kitchen' | 'breathe' | 'game' | 'content';
  actionPayload?: string;
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

// ==========================================
// Verified Psychological Books & References (الكتب والمراجع المعتمدة)
// ==========================================

export type BookReviewBadge = 
  | 'WHO_GUIDELINE' 
  | 'NICE_GUIDELINE' 
  | 'CLINICALLY_VERIFIED' 
  | 'SELF_HELP_STANDARD';

export interface PsychoeducationBook {
  id: string;
  title: string;
  originalTitle?: string;
  authors: string[];
  category: 'relationships_comm' | 'self_emotions' | 'stress_resilience' | 'anxiety_stress' | 'depression_mood' | 'trauma' | 'boundaries' | 'mindfulness_act' | 'self_compassion' | 'general_psychoeducation';
  categoryLabel: string;
  publicationYear: string;
  publisher: string;
  language: string;
  reviewStatus: BookReviewBadge;
  reviewStatusLabel: string;
  directSourceUrl?: string; // Direct Publisher / Author legal link
  summaryArabic: string;
  keyTakeaways: string[];
  whoIsThisFor: string;
  criticalReadingNote?: string; // Scientific & critical reading notes
  relatedTopicIds: string[];
  relatedToolActionIds?: ('breathe' | 'feker' | 'battery' | 'compass' | 'knot' | 'translate' | 'rescue' | 'emergency')[];
  licenseNotice: string;
  coverColor: string;
  icon: string;
}

// ==========================================
// Validated Assessment Scales (المقاييس النفسية الموثقة)
// ==========================================

export interface ValidatedAssessmentScale {
  id: string;
  title: string;
  abbreviation: 'PHQ-9' | 'GAD-7' | 'PSS-10' | 'QOLI';
  subtitle: string;
  purpose: string;
  clinicalSource: string;
  estimatedTimeMinutes: number;
  questions: {
    id: number;
    text: string;
    options: { label: string; score: number }[];
  }[];
  scoringRanges: {
    minScore: number;
    maxScore: number;
    levelTitle: string;
    levelDescription: string;
    recommendation: string;
    requiresProfessionalAttention?: boolean;
  }[];
  disclaimer: string;
}

// ==========================================
// Psychoeducation Guided Paths (المسارات التثقيفية)
// ==========================================

export interface PsychoeducationPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  topicIds: string[];
  bookIds: string[];
  assessmentScaleId?: string;
  toolActionId?: 'breathe' | 'feker' | 'battery' | 'compass' | 'knot' | 'translate' | 'rescue' | 'emergency';
}

// ==========================================
// Inner Safety Space Types (مساحة أمانك الداخلي)
// ==========================================
export interface InnerSafetySummary {
  id: string;
  userId: string;
  createdAt: string;
  identifiedEmotion: string;
  emotionTrigger?: string;
  underlyingThought?: string;
  identifiedNeed?: string;
  compassionateRephrase?: string;
  observationFocus?: string;
  actionStep: string;
  actionStepNotes?: string;
  reviewDate?: string;
}

// ==========================================
// Scheduled Relaxation Calendar Types (تقويم الاسترخاء)
// ==========================================
export interface ScheduledRelaxationSession {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseTitle: string;
  exerciseIcon: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reminderEnabled: boolean;
  repeatDaily?: boolean;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

// ==========================================
// Full-Text Psychological Books (مكتبة الكتب النفسية الكاملة)
// ==========================================

export interface FullBookSection {
  heading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  calloutBox?: {
    title?: string;
    content: string;
    type?: 'info' | 'exercise' | 'warning' | 'quote';
  };
}

export interface FullBookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  readingTimeMinutes: number;
  sections: FullBookSection[];
}

export interface FullTextPsychoeducationBook {
  id: string;
  title: string;
  originalTitle?: string;
  authors: string[];
  translator?: string;
  publisher: string;
  publicationYear: string;
  edition?: string;
  language: 'ar' | 'ar_translated';
  category: 'anxiety_stress' | 'depression_mood' | 'trauma' | 'boundaries' | 'mindfulness_act' | 'self_compassion' | 'general_psychoeducation';
  categoryLabel: string;
  
  // Strict Licensing & Rights Verification
  licenseType: 'PUBLIC_DOMAIN' | 'CC_BY_NC_SA_3_0_IGO' | 'CC_BY_4_0' | 'WHO_OPEN_ACCESS' | 'OPEN_EDUCATIONAL_RESOURCE';
  licenseLabel: string;
  licenseUrl?: string;
  licenseVerificationNotes: string;
  sourceUrl: string;
  attributionText: string;
  
  summary: string;
  whoIsThisFor: string;
  coverGradient: string;
  icon: string;
  
  isFullTextVerified: boolean;
  totalChaptersCount: number;
  totalReadingTimeMinutes: number;
  pdfDownloadUrl?: string;
  contentTier?: 'full_book' | 'psychoeducation_summary' | 'scientific_reference';
  chapters: FullBookChapter[];
}

export interface ScientificReference {
  id: string;
  title: string;
  originalTitle: string;
  organization: string;
  publicationYear: string;
  category: string;
  categoryLabel: string;
  officialUrl: string;
  irisIdentifier?: string;
  isbn?: string;
  licenseType: string;
  licenseLabel: string;
  tier: 'scientific_reference';
  scopeAndRelevance: string;
  keyClinicalFindings: string[];
  appIntegrationAreas: string[];
  limitationsAndSafety: string;
  fileAvailability: 'available_local_pdf' | 'official_who_repository_link';
  localPdfPath?: string;
  targetAudience: string;
}


