// Voice Service for speech synthesis (TTS) & speech recognition (STT)
// Comprehensive Arabic TTS with long-text chunking, pause/resume/replay, speed control, and state management.

export interface VoiceServiceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onBoundary?: (charIndex: number) => void;
}

export interface AudioPlaybackState {
  activeId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  pitch: number;
  currentChunkIndex: number;
  totalChunks: number;
  currentText: string;
}

export type PlaybackListener = (state: AudioPlaybackState) => void;

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<PlaybackListener> = new Set();
  
  // Chunking and playback queue
  private chunks: string[] = [];
  private currentChunkIndex: number = 0;
  private keepAliveInterval: any = null;
  private currentCallbacks: VoiceServiceCallbacks | null = null;

  private state: AudioPlaybackState = {
    activeId: null,
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    pitch: 1.0,
    currentChunkIndex: 0,
    totalChunks: 0,
    currentText: ''
  };

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
    try {
      const voices = this.synth.getVoices();
      // Prioritize natural Arabic voices (e.g. Arabic Egypt, Saudi, generic Arabic)
      this.preferredVoice = 
        voices.find(v => v.lang.startsWith('ar-EG')) ||
        voices.find(v => v.lang.startsWith('ar-SA')) ||
        voices.find(v => v.lang.startsWith('ar')) ||
        voices.find(v => v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('tarik') || v.name.toLowerCase().includes('laila') || v.name.toLowerCase().includes('maged') || v.name.toLowerCase().includes('zeina')) ||
        null;
    } catch (e) {
      // ignore
    }
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach(l => {
      try {
        l(currentState);
      } catch (e) {
        // ignore
      }
    });
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  /**
   * Cleans text for natural Arabic speech:
   * Strips emojis, markdown syntax, symbols, bullets, brackets, and extra whitespace.
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      // Remove URLs and markdown links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      // Remove markdown formatting
      .replace(/[*#_~`>]/g, '')
      .replace(/^[\s-•*]+/gm, '')
      // Remove emojis and decorative symbols
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[🌿🤍🌱🛡️🧠💡✨🌧️🤔😔🌪️🔋🤯🎮🧭🌬️🪞🎙️🎨🌊🧰📖📚🩺🚨]/g, '')
      // Normalize whitespace and duplicate punctuation
      .replace(/\s+/g, ' ')
      .replace(/([.،؟!,;])\1+/g, '$1')
      .trim();
  }

  /**
   * Splits long text into natural chunks (sentences/phrases)
   * to prevent SpeechSynthesis from silently dying on long utterances.
   */
  private splitIntoChunks(cleanText: string, maxChunkLength: number = 140): string[] {
    if (!cleanText) return [];
    
    // Split primarily on full stops, question marks, exclamation marks, or newlines
    const rawSegments = cleanText.split(/([.؟!\n]+|،\s*|;\s*)/g);
    const result: string[] = [];
    let currentChunk = '';

    for (const segment of rawSegments) {
      if (!segment) continue;
      if (currentChunk.length + segment.length <= maxChunkLength) {
        currentChunk += segment;
      } else {
        if (currentChunk.trim()) {
          result.push(currentChunk.trim());
        }
        if (segment.length > maxChunkLength) {
          // Fallback split by words
          const words = segment.split(' ');
          let temp = '';
          for (const w of words) {
            if (temp.length + w.length + 1 <= maxChunkLength) {
              temp += (temp ? ' ' : '') + w;
            } else {
              if (temp.trim()) result.push(temp.trim());
              temp = w;
            }
          }
          currentChunk = temp;
        } else {
          currentChunk = segment;
        }
      }
    }

    if (currentChunk.trim()) {
      result.push(currentChunk.trim());
    }

    return result.filter(c => c.trim().length > 0);
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    // Chrome bug workaround: periodic pause/resume every 9s prevents synthesis stall
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.state.isPlaying && !this.state.isPaused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 9000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Main playback method for listening to any answer or text
   */
  public play(
    id: string,
    rawText: string,
    options?: { rate?: number; pitch?: number; callbacks?: VoiceServiceCallbacks }
  ) {
    if (!this.synth) {
      options?.callbacks?.onError?.('Speech synthesis not supported');
      return;
    }

    // Stop previous playback
    this.stop(false);

    const cleanText = this.cleanTextForSpeech(rawText);
    if (!cleanText) {
      options?.callbacks?.onError?.('No text to speak');
      return;
    }

    this.chunks = this.splitIntoChunks(cleanText);
    if (this.chunks.length === 0) return;

    this.currentChunkIndex = 0;
    this.currentCallbacks = options?.callbacks || null;

    const rate = options?.rate ?? this.state.rate ?? 1.0;
    const pitch = options?.pitch ?? this.state.pitch ?? 1.0;

    this.state = {
      activeId: id,
      isPlaying: true,
      isPaused: false,
      rate,
      pitch,
      currentChunkIndex: 0,
      totalChunks: this.chunks.length,
      currentText: rawText
    };

    this.notify();
    this.startKeepAlive();
    this.currentCallbacks?.onStart?.();

    this.speakCurrentChunk();
  }

  private speakCurrentChunk() {
    if (!this.synth || !this.state.isPlaying) return;

    if (this.currentChunkIndex >= this.chunks.length) {
      // Completed all chunks
      this.finishPlayback();
      return;
    }

    const chunkText = this.chunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = 'ar-EG';

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    } else {
      // Try reloading voices if first time
      this.loadVoices();
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
    }

    utterance.rate = this.state.rate;
    utterance.pitch = this.state.pitch;

    utterance.onend = () => {
      this.currentChunkIndex++;
      this.state.currentChunkIndex = this.currentChunkIndex;
      this.notify();
      this.speakCurrentChunk();
    };

    utterance.onerror = (e) => {
      // If canceled due to user stop, ignore
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('SpeechSynthesis error on chunk:', e);
      // Try next chunk or finish
      this.currentChunkIndex++;
      this.state.currentChunkIndex = this.currentChunkIndex;
      this.notify();
      this.speakCurrentChunk();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private finishPlayback() {
    this.stopKeepAlive();
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.activeId = null;
    this.state.currentChunkIndex = 0;
    this.notify();
    this.currentCallbacks?.onEnd?.();
    this.currentCallbacks = null;
  }

  public pause() {
    if (this.synth && this.state.isPlaying && !this.state.isPaused) {
      try {
        this.synth.pause();
        this.state.isPaused = true;
        this.notify();
      } catch (e) {
        // ignore
      }
    }
  }

  public resume() {
    if (this.synth && this.state.isPlaying && this.state.isPaused) {
      try {
        this.synth.resume();
        this.state.isPaused = false;
        this.notify();
      } catch (e) {
        // ignore
      }
    }
  }

  public togglePlayPause(id: string, text: string, options?: { rate?: number }) {
    if (this.state.activeId === id) {
      if (this.state.isPlaying && !this.state.isPaused) {
        this.pause();
      } else if (this.state.isPaused) {
        this.resume();
      } else {
        this.play(id, text, options);
      }
    } else {
      this.play(id, text, options);
    }
  }

  public replay() {
    if (this.state.currentText && this.state.activeId) {
      const activeId = this.state.activeId;
      const text = this.state.currentText;
      const rate = this.state.rate;
      this.play(activeId, text, { rate });
    }
  }

  public setRate(newRate: number) {
    this.state.rate = Math.max(0.6, Math.min(2.0, newRate));
    this.notify();
    // If currently playing, restart chunk with new rate
    if (this.state.isPlaying && !this.state.isPaused && this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
      this.speakCurrentChunk();
    }
  }

  public stop(notifyState: boolean = true) {
    this.stopKeepAlive();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.currentUtterance = null;
    this.chunks = [];
    this.currentChunkIndex = 0;

    if (notifyState) {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.activeId = null;
      this.state.currentChunkIndex = 0;
      this.notify();
      this.currentCallbacks?.onEnd?.();
      this.currentCallbacks = null;
    }
  }

  // Backward compatibility for existing code calling speak()
  public speak(
    text: string, 
    callbacks?: VoiceServiceCallbacks,
    options?: { pitch?: number; rate?: number }
  ) {
    this.play('legacy_' + Date.now(), text, {
      rate: options?.rate ?? 0.95,
      pitch: options?.pitch ?? 1.0,
      callbacks
    });
  }

  public isSpeaking(): boolean {
    return this.state.isPlaying || (this.synth?.speaking ?? false);
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
