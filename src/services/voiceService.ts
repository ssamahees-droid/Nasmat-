// Voice Service for speech synthesis (TTS) & speech recognition (STT)

export interface VoiceServiceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onBoundary?: (charIndex: number) => void;
}

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural Arabic voices
    this.preferredVoice = 
      voices.find(v => v.lang.startsWith('ar-EG')) ||
      voices.find(v => v.lang.startsWith('ar-SA')) ||
      voices.find(v => v.lang.startsWith('ar')) ||
      voices.find(v => v.name.toLowerCase().includes('arabic')) ||
      null;
  }

  public speak(
    text: string, 
    callbacks?: VoiceServiceCallbacks,
    options?: { pitch?: number; rate?: number }
  ) {
    if (!this.synth) {
      callbacks?.onError?.('Speech synthesis not supported');
      return;
    }

    this.stop(); // Stop any active speech

    // Clean text from markdown asterisks or special characters for cleaner speech
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-EG'; // default Egyptian Arabic or generic Arabic
      
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      utterance.rate = options?.rate ?? 0.95; // Slightly calmer, gentle pace
      utterance.pitch = options?.pitch ?? 1.0;

      utterance.onstart = () => {
        this.isSpeakingState = true;
        callbacks?.onStart?.();
      };

      utterance.onboundary = (event) => {
        callbacks?.onBoundary?.(event.charIndex);
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        callbacks?.onError?.(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.isSpeakingState = false;
      callbacks?.onError?.(e);
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.isSpeakingState = false;
    this.currentUtterance = null;
  }

  public pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth?.speaking ?? false);
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Speech Recognition (Speech-to-Text)
  public createRecognition(
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: any) => void
  ) {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionClass = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return null;

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ar-EG';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        onResult(transcript);
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.onerror = (event: any) => {
        onError(event);
      };

      return recognition;
    } catch (e) {
      return null;
    }
  }
}

export const voiceService = new VoiceService();
