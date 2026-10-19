// Prototype Advanced Web Audio Engine for "صالون النغم والسكينة" - نسمة حياة
// Independent experimental prototype file - Does not replace khairatAudioEngine.ts

export interface PrototypeTrack {
  id: string;
  titleAr: string;
  durationSec: number;
  descriptionAr: string;
}

export const PROTOTYPE_TRACK: PrototypeTrack = {
  id: 'sakina-prototype',
  titleAr: 'سكون النغم — نموذج أولي احترافي (55 ثانية)',
  durationSec: 55,
  descriptionAr: 'معزوفات بيانو مترابطة مع أربيجيو غني، وتريات خلفية دافئة، وتطور هارموني طبيعي.'
};

export class KhairatAudioPrototypePlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private activeNodes: AudioNode[] = [];
  private onProgressCb?: (progress: number) => void;
  private onEndCb?: () => void;
  private startTime = 0;
  private duration = 55;

  constructor(onProgress?: (p: number) => void, onEnd?: () => void) {
    this.onProgressCb = onProgress;
    this.onEndCb = onEnd;
  }

  public async start() {
    if (this.isPlaying) return;
    
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.startTime = this.audioCtx.currentTime;

    // Start playback sequence loop or scheduled master timeline
    this.schedulePrototypeMasterTimeline();

    // Progress updater loop
    const updateInterval = 100;
    const checkProgress = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const elapsed = this.audioCtx.currentTime - this.startTime;
      const progress = Math.min(1, elapsed / this.duration);
      if (this.onProgressCb) {
        this.onProgressCb(progress);
      }
      if (elapsed >= this.duration) {
        this.stop();
        if (this.onEndCb) this.onEndCb();
      } else {
        this.timerId = window.setTimeout(checkProgress, updateInterval);
      }
    };
    checkProgress();
  }

  private schedulePrototypeMasterTimeline() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 2); // Smooth Fade-in
    masterGain.connect(ctx.destination);
    this.activeNodes.push(masterGain);

    // Master Reverb/Delay simulation
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.25;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);
    this.activeNodes.push(delay, feedback);

    // String Pad continuous warm chord (D minor / G minor / A major progression)
    this.playStringPad(ctx, masterGain);

    // Piano Arpeggio & Melody Timeline (55 seconds divided into 4 phrases)
    // Phrase 1: Intro (0s - 12s) - Gentle Dm arpeggio & calm melody
    // Phrase 2: Development (12s - 28s) - G minor & Bb major harmony
    // Phrase 3: Climax (28s - 42s) - Emotional peak with richer voicing
    // Phrase 4: Resolution & Fade (42s - 55s) - Soft closing notes & fade out

    const events = this.getCompositionEvents();
    events.forEach(ev => {
      const time = this.startTime + ev.time;
      if (ev.type === 'note') {
        this.playPianoNote(ctx, masterGain, ev.freq, time, ev.dur, ev.velocity || 0.7);
      } else if (ev.type === 'arp') {
        this.playPianoNote(ctx, masterGain, ev.freq, time, ev.dur, ev.velocity || 0.45);
      }
    });

    // Schedule fade out at end
    masterGain.gain.setValueAtTime(0.35, this.startTime + 52);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, this.startTime + 55);
  }

  private playStringPad(ctx: AudioContext, destination: GainNode) {
    // Warm string pad chords using lowpass filtered sawtooth oscillators
    const chords = [
      { freqs: [293.66, 349.23, 440.00], start: 0, dur: 14 },   // Dm (D, F, A)
      { freqs: [246.94, 329.63, 392.00], start: 14, dur: 14 },  // Gm / Bdim
      { freqs: [220.00, 261.63, 329.63], start: 28, dur: 14 },  // Am / F
      { freqs: [293.66, 349.23, 440.00], start: 42, dur: 13 },  // Dm resolution
    ];

    chords.forEach(chord => {
      const startTime = this.startTime + chord.start;
      const chordGain = ctx.createGain();
      chordGain.gain.setValueAtTime(0.001, startTime);
      chordGain.gain.linearRampToValueAtTime(0.08, startTime + 2);
      chordGain.gain.setValueAtTime(0.08, startTime + chord.dur - 2);
      chordGain.gain.linearRampToValueAtTime(0.0001, startTime + chord.dur);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;

      chord.freqs.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        osc.connect(filter);
        osc.start(startTime);
        osc.stop(startTime + chord.dur);
        this.activeNodes.push(osc);
      });

      filter.connect(chordGain);
      chordGain.connect(destination);
      this.activeNodes.push(chordGain, filter);
    });
  }

  private playPianoNote(ctx: AudioContext, destination: GainNode, freq: number, time: number, dur: number, velocity: number) {
    if (freq <= 0) return;

    // Dual oscillator for rich piano hammer overtones (Fundamental + Octave/Harmonic)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2, time); // Octave overtone for brightness

    // ADSR Envelope for piano hammer strike and natural decay
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.3, time + 0.03); // Quick hammer attack
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.08, time + dur * 0.5); // Natural sustain decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + dur); // Release

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);

    this.activeNodes.push(osc1, osc2, filter, noteGain);
  }

  private getCompositionEvents() {
    // Frequencies mapping for Dm scale / Nahawand
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const Bb4 = 466.16;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;

    const events: Array<{ type: 'note' | 'arp'; freq: number; time: number; dur: number; velocity?: number }> = [];

    // Arpeggio pattern generator helper
    const addArp = (startTime: number, chordFreqs: number[], count: number, step: number) => {
      for (let i = 0; i < count; i++) {
        const f = chordFreqs[i % chordFreqs.length];
        events.push({ type: 'arp', freq: f, time: startTime + i * step, dur: step * 1.5, velocity: 0.35 });
      }
    };

    // --- Phrase 1: Intro (0s - 13s) ---
    // Gentle Dm arpeggio background
    addArp(0, [D4, F4, A4, D5, A4, F4], 12, 1.0);
    // Melody Phrase 1
    events.push(
      { type: 'note', freq: A4, time: 2.0, dur: 2.5, velocity: 0.65 },
      { type: 'note', freq: Bb4, time: 4.5, dur: 1.5, velocity: 0.6 },
      { type: 'note', freq: A4, time: 6.5, dur: 2.0, velocity: 0.6 },
      { type: 'note', freq: G4, time: 9.0, dur: 3.0, velocity: 0.55 },
      { type: 'note', freq: F4, time: 12.0, dur: 1.5, velocity: 0.5 }
    );

    // --- Phrase 2: Development (13s - 28s) ---
    addArp(13, [C5, A4, F4, C5, A4, F4], 12, 1.0);
    events.push(
      { type: 'note', freq: F4, time: 14.0, dur: 2.0, velocity: 0.7 },
      { type: 'note', freq: G4, time: 16.5, dur: 1.5, velocity: 0.65 },
      { type: 'note', freq: A4, time: 18.5, dur: 2.5, velocity: 0.75 },
      { type: 'note', freq: C5, time: 21.5, dur: 2.0, velocity: 0.7 },
      { type: 'note', freq: Bb4, time: 24.0, dur: 2.0, velocity: 0.65 },
      { type: 'note', freq: A4, time: 26.5, dur: 1.5, velocity: 0.6 }
    );

    // --- Phrase 3: Climax (28s - 42s) ---
    addArp(28, [D5, A4, F4, D5, C5, A4], 12, 1.0);
    events.push(
      { type: 'note', freq: D5, time: 29.0, dur: 2.5, velocity: 0.8 },
      { type: 'note', freq: E5, time: 32.0, dur: 1.5, velocity: 0.75 },
      { type: 'note', freq: F5, time: 34.0, dur: 3.0, velocity: 0.85 },
      { type: 'note', freq: E5, time: 37.5, dur: 1.5, velocity: 0.7 },
      { type: 'note', freq: D5, time: 39.5, dur: 2.5, velocity: 0.65 }
    );

    // --- Phrase 4: Resolution & Fade (42s - 55s) ---
    addArp(42, [A4, F4, D4, A4, F4, D4], 10, 1.2);
    events.push(
      { type: 'note', freq: C5, time: 43.0, dur: 2.5, velocity: 0.6 },
      { type: 'note', freq: Bb4, time: 46.0, dur: 2.5, velocity: 0.5 },
      { type: 'note', freq: A4, time: 49.0, dur: 3.0, velocity: 0.4 },
      { type: 'note', freq: D4, time: 52.5, dur: 3.0, velocity: 0.3 }
    );

    return events;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioNode & { stop: () => void }).stop === 'function') {
          (node as AudioNode & { stop: () => void }).stop();
        }
        node.disconnect();
      } catch {
        // ignore already disconnected nodes
      }
    });
    this.activeNodes = [];
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}
