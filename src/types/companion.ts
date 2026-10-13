export type CompanionPersona = 'adult' | 'child' | 'father' | 'my_photo';

export type CompanionExpression = 
  | 'welcome' 
  | 'listening' 
  | 'thinking' 
  | 'empathy' 
  | 'encouraging' 
  | 'speaking';

export interface CompanionAction {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  actionType: 'modal' | 'route' | 'audio';
  target: string; // modal name, route name, or audio track
  extraData?: any;
}

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: number;
  expression?: CompanionExpression;
  isCrisisAlert?: boolean;
  suggestedActions?: CompanionAction[];
  reflectionQuestions?: string[];
  audioPlayed?: boolean;
}

// Deprecated anime themes preserved as optional for backward compatibility
export type AnimeTheme = 'ghibli' | 'sakura' | 'starlight' | 'ocean';
export type AnimeAccessory = 'none' | 'sprout' | 'sakura' | 'crescent' | 'glasses';

export interface CompanionUserSettings {
  persona: CompanionPersona;
  isAnimated: boolean;
  isVoiceAutoPlay: boolean;
  hasSeenIntroduction: boolean;
  customPhoto?: string | null;
  animeTheme?: AnimeTheme;
  animeAccessory?: AnimeAccessory;
}

