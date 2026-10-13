/**
 * ChimeService - Web Audio API Synthetic Singing Bowl & Calming Sound Effects
 * Generates organic, calming, harmonic tones for reassurance touches and breathing sync.
 * Zero external network requests, zero latency, runs offline, 100% accessible.
 */

class ChimeService {
  private audioCtx: AudioContext | null = null;
  private isMutedState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nesmat_chime_muted');
        this.isMutedState = saved === 'true';
      } catch (_) {}
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch (_) {
      return null;
    }
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public setMuted(muted: boolean) {
    this.isMutedState = muted;
    try {
      localStorage.setItem('nesmat_chime_muted', String(muted));
    } catch (_) {}
  }

  public toggleMute(): boolean {
    const next = !this.isMutedState;
    this.setMuted(next);
    return next;
  }

  /**
   * Plays a warm, soothing Tibetan singing bowl tone (432Hz fundamental with natural overtones)
   * Designed for psychological reassurance, heart-rate slowing, and relaxation.
   */
  public playReassuranceChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      masterGain.connect(ctx.destination);

      // Fundamental frequency: 432Hz (Calming natural tuning)
      const fundamental = ctx.createOscillator();
      fundamental.type = 'sine';
      fundamental.frequency.setValueAtTime(432, now);
      fundamental.frequency.exponentialRampToValueAtTime(430, now + 2.2);

      // 2nd Harmonic: 864Hz (Soft clarity overtone)
      const harmonic1 = ctx.createOscillator();
      const h1Gain = ctx.createGain();
      harmonic1.type = 'sine';
      harmonic1.frequency.setValueAtTime(864, now);
      h1Gain.gain.setValueAtTime(0.08, now);
      h1Gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      harmonic1.connect(h1Gain);
      h1Gain.connect(masterGain);

      // 3rd Harmonic: 1296Hz (Subtle shimmer)
      const harmonic2 = ctx.createOscillator();
      const h2Gain = ctx.createGain();
      harmonic2.type = 'sine';
      harmonic2.frequency.setValueAtTime(1296, now);
      h2Gain.gain.setValueAtTime(0.03, now);
      h2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      harmonic2.connect(h2Gain);
      h2Gain.connect(masterGain);

      fundamental.connect(masterGain);

      fundamental.start(now);
      harmonic1.start(now);
      harmonic2.start(now);

      fundamental.stop(now + 2.5);
      harmonic1.stop(now + 1.8);
      harmonic2.stop(now + 1.2);
    } catch (_) {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Plays a subtle low-pitched breath cue chime (e.g. for inhale/exhale guidance)
   */
  public playBreathCue(type: 'inhale' | 'exhale') {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'inhale') {
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(390, now + 1.2);
      } else {
        osc.frequency.setValueAtTime(390, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 1.2);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.4);
    } catch (_) {}
  }

  /**
   * Plays a crisp, satisfying water-drop / bubble pop tone
   */
  public playBubblePopChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Quick upward pitch bend resembling a droplet/pop
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_) {}
  }

  /**
   * Plays a grounded harmonic stone placement chime for building the bridge
   */
  public playStoneDropChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.15);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (_) {}
  }

  /**
   * Plays a delicate ascending sparkle chord for flowers blooming in the garden
   */
  public playFlowerBloomChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.8);
      });
    } catch (_) {}
  }

  /**
   * Plays a gentle water drop ripple sound
   */
  public playWaterDropChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (_) {}
  }

  /**
   * Plays a compass needle sweep tone
   */
  public playCompassWhirChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(660, now + 0.25);
      osc.frequency.linearRampToValueAtTime(550, now + 0.5);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (_) {}
  }

  /**
   * Plays a warm victory/completion harmonic chord
   */
  public playSuccessChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4 - C#5 - E5 - A5
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.8);
      });
    } catch (_) {}
  }

  /**
   * Plays a gentle ASMR breeze / rippling dissipation sound for the Digital Release Ritual
   */
  public playDissolveAsmr() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // White noise buffer for gentle whispery wind
      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.05;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter for soft ocean/wind breath
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 1.8);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 2.0);
    } catch (_) {}
  }

  /**
   * Plays a crisp wooden/glass snap chime when puzzle pieces fit
   */
  public playPuzzleSnapChime() {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (_) {}
  }

  /**
   * Plays a subtle celestial tone when adjusting relational orbit distance
   */
  public playOrbitAdjustChime(distance: number) {
    if (this.isMutedState) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Higher frequency for closer orbits, deeper for distant safe boundaries
      const freq = Math.max(220, 600 - distance * 1.5);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (_) {}
  }
}

export const chimeService = new ChimeService();

