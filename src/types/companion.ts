export type CompanionPersona = 'adult' | 'child';

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

export interface CompanionUserSettings {
  persona: CompanionPersona;
  isAnimated: boolean;
  isVoiceAutoPlay: boolean;
  hasSeenIntroduction: boolean;
}
