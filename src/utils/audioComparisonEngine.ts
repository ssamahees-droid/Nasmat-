// Exact 15-second A/B Audio Comparison Engine for "نسمة حياة"
// Plays the EXACT same 15-second melodic & harmonic sequence using:
// Engine A: Current Web Audio Oscillator Synthesis (Triangle/Sine/Sawtooth as in khairatAudioEngine.ts)
// Engine B: High-Quality Real Sampled Acoustic Grand Piano (FluidR3_GM CC0 Open Source Samples)

export interface NoteEvent {
  note: string; // e.g., 'D4', 'A4'
  freq: number;
  time: number; // in seconds from start (0.0 to 15.0)
  dur: number;  // duration in seconds
  velocity?: number;
  isChord?: boolean;
}

export interface ChordEvent {
  rootFreq: number;
  type: 'min' | 'maj';
  time: number;
  dur: number;
  notes: string[]; // for sampled engine
}

// Exact 15-Second Composition (Nahawand / D Minor - Calm Oriental Piano Theme)
export const COMPARISON_DURATION_SEC = 15;

// Exact Note Frequencies (A4 = 440Hz)
export const NOTE_FREQUENCIES: Record<string, number> = {
  'D3': 146.83,
  'F3': 174.61,
  'G3': 196.00,
  'A3': 220.00,
  'Bb3': 233.08,
  'C#4': 277.18,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'Bb4': 466.16,
  'C5': 523.25,
  'D5': 587.33
};

// Exact same 15-second melody sequence
export const MELODY_SEQUENCE: NoteEvent[] = [
  { note: 'D4', freq: 293.66, time: 0.0, dur: 1.0, velocity: 0.8 },
  { note: 'F4', freq: 349.23, time: 1.0, dur: 1.0, velocity: 0.8 },
  { note: 'A4', freq: 440.00, time: 2.0, dur: 1.4, velocity: 0.85 },
  { note: 'G4', freq: 392.00, time: 3.5, dur: 0.5, velocity: 0.75 },
  { note: 'F4', freq: 349.23, time: 4.0, dur: 1.0, velocity: 0.8 },
  { note: 'E4', freq: 329.63, time: 5.0, dur: 1.0, velocity: 0.75 },
  { note: 'D4', freq: 293.66, time: 6.0, dur: 2.0, velocity: 0.8 },
  { note: 'F4', freq: 349.23, time: 8.0, dur: 1.0, velocity: 0.8 },
  { note: 'A4', freq: 440.00, time: 9.0, dur: 1.0, velocity: 0.85 },
  { note: 'D5', freq: 587.33, time: 10.0, dur: 1.4, velocity: 0.9 },
  { note: 'C5', freq: 523.25, time: 11.5, dur: 0.5, velocity: 0.75 },
  { note: 'Bb4', freq: 466.16, time: 12.0, dur: 1.0, velocity: 0.8 },
  { note: 'A4', freq: 440.00, time: 13.0, dur: 2.0, velocity: 0.85 }
];

// Exact same 15-second harmonic backing chords
export const CHORD_SEQUENCE: ChordEvent[] = [
  { rootFreq: 146.83, type: 'min', time: 0.0, dur: 4.0, notes: ['D3', 'F3', 'A3'] },
  { rootFreq: 196.00, type: 'min', time: 4.0, dur: 4.0, notes: ['G3', 'Bb3', 'D4'] },
  { rootFreq: 146.83, type: 'min', time: 8.0, dur: 4.0, notes: ['D3', 'F3', 'A3'] },
  { rootFreq: 220.00, type: 'maj', time: 12.0, dur: 3.0, notes: ['A3', 'C#4', 'E4'] }
];

// Mapping to Soundfont sample names on CDN
const NOTE_FILE_NAMES: Record<string, string> = {
  'D3': 'D3',
  'F3': 'F3',
  'G3': 'G3',
  'A3': 'A3',
  'Bb3': 'As3',
  'C#4': 'Cs4',
  'D4': 'D4',
  'E4': 'E4',
  'F4': 'F4',
  'G4': 'G4',
  'A4': 'A4',
  'Bb4': 'As4',
  'C5': 'C5',
  'D5': 'D5'
};

export class AudioComparisonEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private sampleBuffers: Map<string, AudioBuffer> = new Map();
  private isEnginePlaying = false;
  private currentMode: 'oscillator' | 'sampled' | null = null;
  private startTime = 0;
  private timerId: number | null = null;
  private onProgressCb?: (progress: number, elapsedSec: number) => void;
  private onStatusCb?: (status: string) => void;
  private onEndCb?: () => void;

  constructor(
    onProgress?: (progress: number, elapsedSec: number) => void,
    onStatus?: (status: string) => void,
    onEnd?: () => void
  ) {
    this.onProgressCb = onProgress;
    this.onStatusCb = onStatus;
    this.onEndCb = onEnd;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Preload real piano soundfont samples into memory
  public async preloadSampledAudio(onProgress?: (loaded: number, total: number) => void): Promise<boolean> {
    this.initContext();
    if (!this.ctx) return false;

    const notesToLoad = Object.keys(NOTE_FILE_NAMES);
    let loadedCount = 0;
    const total = notesToLoad.length;

    try {
      const promises = notesToLoad.map(async (note) => {
        if (this.sampleBuffers.has(note)) {
          loadedCount++;
          if (onProgress) onProgress(loadedCount, total);
          return;
        }

        const fileName = NOTE_FILE_NAMES[note];
        const url = `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/${fileName}.mp3`;
        
        try {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const arrayBuffer = await resp.arrayBuffer();
          const decoded = await this.ctx!.decodeAudioData(arrayBuffer);
          this.sampleBuffers.set(note, decoded);
        } catch (fetchErr) {
          console.warn(`Could not load note ${note}, will use pitch shift fallback:`, fetchErr);
        }

        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
      });

      await Promise.all(promises);
      return this.sampleBuffers.size > 0;
    } catch (err) {
      console.error('Error preloading samples:', err);
      return false;
    }
  }

  // Play Engine A (Current Oscillators)
  public async playOscillatorEngine(startFromSec = 0) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentMode = 'oscillator';
    this.isEnginePlaying = true;
    this.startTime = this.ctx.currentTime - startFromSec;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.push(masterGain);

    // Schedule Exact Melody using the current Oscillator implementation from khairatAudioEngine.ts
    MELODY_SEQUENCE.forEach(ev => {
      if (ev.time >= startFromSec) {
        const scheduleTime = this.startTime + ev.time;
        this.synthesizeOscillatorPianoNote(ev.freq, scheduleTime, ev.dur, ev.velocity || 0.8, masterGain);
      }
    });

    // Schedule Exact Strings Chords using current sawtooth synthesis
    CHORD_SEQUENCE.forEach(ch => {
      if (ch.time + ch.dur > startFromSec) {
        const scheduleTime = this.startTime + Math.max(ch.time, startFromSec);
        const remainingDur = ch.dur - Math.max(0, startFromSec - ch.time);
        this.synthesizeOscillatorStringsPad(ch.rootFreq, ch.type, scheduleTime, remainingDur, masterGain);
      }
    });

    this.startProgressTicker(startFromSec);
  }

  // Play Engine B (Real Sampled Piano)
  public async playSampledEngine(startFromSec = 0) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    // Ensure samples are loaded
    if (this.sampleBuffers.size < 4) {
      if (this.onStatusCb) this.onStatusCb('جاري تحميل العينات الصوتية عالية الجودة...');
      await this.preloadSampledAudio();
    }

    this.currentMode = 'sampled';
    this.isEnginePlaying = true;
    this.startTime = this.ctx.currentTime - startFromSec;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.push(masterGain);

    // Schedule Melody using Real Acoustic Piano AudioBuffers
    MELODY_SEQUENCE.forEach(ev => {
      if (ev.time >= startFromSec) {
        const scheduleTime = this.startTime + ev.time;
        this.playSampledPianoNote(ev.note, scheduleTime, ev.dur, (ev.velocity || 0.8) * 1.1, masterGain);
      }
    });

    // Schedule Chords using Real Acoustic Piano Harmonies
    CHORD_SEQUENCE.forEach(ch => {
      ch.notes.forEach(noteName => {
        if (ch.time >= startFromSec) {
          const scheduleTime = this.startTime + ch.time;
          this.playSampledPianoNote(noteName, scheduleTime, ch.dur, 0.45, masterGain);
        }
      });
    });

    this.startProgressTicker(startFromSec);
  }

  // --- Engine A Synthesis Helpers (Exact copy of current khairatAudioEngine.ts) ---
  private synthesizeOscillatorPianoNote(freq: number, time: number, durationSec: number, velocity: number, destination: GainNode) {
    if (!this.ctx || freq <= 0) return;

    const noteGain = this.ctx.createGain();
    noteGain.connect(destination);

    // Fundamental tone (Triangle wave)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    // 2nd Harmonic (Sine wave)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);

    // 3rd Harmonic
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, time);

    // Hammer strike filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(3500, freq * 4.5), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.5), time + durationSec);

    // ADSR Envelope
    const peakVol = Math.max(0.01, velocity * 0.35);
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(peakVol, time + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(peakVol * 0.45, time + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec * 1.25);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(noteGain);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);

    osc1.stop(time + durationSec * 1.3);
    osc2.stop(time + durationSec * 1.3);
    osc3.stop(time + durationSec * 1.3);

    this.activeNodes.push(osc1, osc2, osc3, filter, noteGain);
  }

  private synthesizeOscillatorStringsPad(rootFreq: number, type: 'min' | 'maj', time: number, durationSec: number, destination: GainNode) {
    if (!this.ctx || rootFreq <= 0) return;

    const chordGain = this.ctx.createGain();
    chordGain.connect(destination);

    const thirdOffset = type === 'min' ? 3 : 4;
    const fifthOffset = 7;

    const f1 = rootFreq;
    const f2 = rootFreq * Math.pow(2, thirdOffset / 12);
    const f3 = rootFreq * Math.pow(2, fifthOffset / 12);
    const f4 = rootFreq * 2;

    const freqs = [f1, f2, f3, f4];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, time);

    chordGain.gain.setValueAtTime(0.0001, time);
    chordGain.gain.linearRampToValueAtTime(0.08, time + 0.4);
    chordGain.gain.setValueAtTime(0.07, time + Math.max(0.4, durationSec - 0.3));
    chordGain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec + 0.3);

    freqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, time);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, time);

      osc.connect(filter);
      osc.start(time);
      osc.stop(time + durationSec + 0.4);
      this.activeNodes.push(osc);
    });

    filter.connect(chordGain);
    this.activeNodes.push(filter, chordGain);
  }

  // --- Engine B Sampled Piano Helpers ---
  private playSampledPianoNote(noteName: string, time: number, durationSec: number, velocity: number, destination: GainNode) {
    if (!this.ctx) return;

    // Find direct buffer or nearest note with pitch shift fallback
    let buffer = this.sampleBuffers.get(noteName);
    let playbackRate = 1.0;

    if (!buffer) {
      // Find any loaded buffer
      const keys = Array.from(this.sampleBuffers.keys());
      if (keys.length > 0) {
        const fallbackNote = keys[0];
        buffer = this.sampleBuffers.get(fallbackNote);
        const targetFreq = NOTE_FREQUENCIES[noteName] || 440;
        const sourceFreq = NOTE_FREQUENCIES[fallbackNote] || 440;
        playbackRate = targetFreq / sourceFreq;
      }
    }

    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(playbackRate, time);

    const gain = this.ctx.createGain();
    // Warm natural velocity gain
    gain.gain.setValueAtTime(Math.min(1.0, velocity), time);

    // Warm natural piano tail release
    const releaseStart = time + Math.max(0.5, durationSec);
    gain.gain.setValueAtTime(velocity, releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, releaseStart + 1.2);

    // Acoustic wooden resonance enhancement filter
    const bodyFilter = this.ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(5500, time);

    source.connect(bodyFilter);
    bodyFilter.connect(gain);
    gain.connect(destination);

    source.start(time);
    source.stop(releaseStart + 1.3);

    this.activeNodes.push(source, bodyFilter, gain);
  }

  private startProgressTicker(startFromSec: number) {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.isEnginePlaying) {
        this.stop();
        return;
      }

      const elapsed = this.ctx.currentTime - this.startTime;
      const progress = Math.min(1.0, elapsed / COMPARISON_DURATION_SEC);

      if (this.onProgressCb) {
        this.onProgressCb(progress, Math.min(COMPARISON_DURATION_SEC, Math.max(0, elapsed)));
      }

      if (elapsed >= COMPARISON_DURATION_SEC) {
        this.stop();
        if (this.onEndCb) this.onEndCb();
      }
    }, 50);
  }

  public stop() {
    this.isEnginePlaying = false;
    this.currentMode = null;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioNode & { stop: () => void }).stop === 'function') {
          (node as AudioNode & { stop: () => void }).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public getIsPlaying() {
    return this.isEnginePlaying;
  }

  public getCurrentMode() {
    return this.currentMode;
  }

  public hasSampleBuffers() {
    return this.sampleBuffers.size > 0;
  }
}
