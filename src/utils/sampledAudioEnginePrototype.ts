// Sampled Acoustic Piano Audio Engine Prototype for "صالون النغم والسكينة" - نسمة حياة
// Uses real acoustic grand piano soundfont samples (FluidR3_GM CC0/Open source samples)

export interface SampledTrack {
  id: string;
  titleAr: string;
  durationSec: number;
  descriptionAr: string;
}

export const SAMPLED_TRACK: SampledTrack = {
  id: 'sampled-piano-protomodel',
  titleAr: 'سكون النغم — بيانو حقيقي مسجل (نموذج عيني)',
  durationSec: 50,
  descriptionAr: 'معزوفة أصلية هادئة تعزفها عينات صوتية حقيقية لبيانو أكوستيك مع صدى طبيعي وتدرج ناعم.'
};

// Note to MIDI note number mapping for sample URL fetching
// Using FluidR3_GM acoustic grand piano mp3 soundfonts from public CDN
const NOTE_TO_NAME: Record<string, string> = {
  'C4': 'C4',
  'Db4': 'Cs4',
  'D4': 'D4',
  'Eb4': 'Ds4',
  'E4': 'E4',
  'F4': 'F4',
  'F#4': 'Fs4',
  'G4': 'G4',
  'Ab4': 'Gs4',
  'A4': 'A4',
  'Bb4': 'As4',
  'B4': 'B4',
  'C5': 'C5',
  'D5': 'D5',
  'E5': 'E5'
};

export class SampledAudioEnginePrototype {
  private audioCtx: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private isPlaying = false;
  private timerId: number | null = null;
  private activeSources: AudioNode[] = [];
  private onProgressCb?: (progress: number) => void;
  private onStatusCb?: (status: string) => void;
  private onEndCb?: () => void;
  private startTime = 0;
  private duration = 50;

  constructor(
    onProgress?: (p: number) => void,
    onStatus?: (s: string) => void,
    onEnd?: () => void
  ) {
    this.onProgressCb = onProgress;
    this.onStatusCb = onStatus;
    this.onEndCb = onEnd;
  }

  public async loadSamples() {
    if (this.buffers.size > 0) return true;
    if (this.onStatusCb) this.onStatusCb('جاري تحميل عينات البيانو الحقيقية (حوالي 1 ميغابايت)...');

    const notesToLoad = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }

    try {
      const promises = notesToLoad.map(async (note) => {
        const sampleName = NOTE_TO_NAME[note] || 'C4';
        const url = `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@master/FluidR3_GM/acoustic_grand_piano-mp3/${sampleName}.mp3`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load sample for ${note}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx!.decodeAudioData(arrayBuffer);
        this.buffers.set(note, audioBuffer);
      });

      await Promise.all(promises);
      if (this.onStatusCb) this.onStatusCb('تم تحميل عينات البيانو الحقيقية بنجاح.');
      return true;
    } catch (err) {
      console.error('Failed to load real piano soundfont samples:', err);
      if (this.onStatusCb) this.onStatusCb('تعذر تحميل العينات عبر الشبكة. يرجى التحقق من الاتصال.');
      return false;
    }
  }

  public async start() {
    if (this.isPlaying) return;

    const loaded = await this.loadSamples();
    if (!loaded) return;

    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.startTime = this.audioCtx.currentTime;

    if (this.onStatusCb) this.onStatusCb('جاري العزف بالعينات الحقيقية...');

    this.scheduleMasterTimeline();

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

  private scheduleMasterTimeline() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1.5); // Smooth fade in
    masterGain.connect(ctx.destination);
    this.activeSources.push(masterGain);

    // Composition schedule: D minor / C major progression with arpeggios and melody
    const events = this.getSampledCompositionEvents();

    events.forEach(ev => {
      const time = this.startTime + ev.time;
      this.playSampledNote(ctx, masterGain, ev.note, time, ev.velocity || 0.7);
    });

    // Schedule Fade out at end
    masterGain.gain.setValueAtTime(0.8, this.startTime + 47);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, this.startTime + 50);
  }

  private playSampledNote(ctx: AudioContext, destination: GainNode, note: string, time: number, velocity: number) {
    const buffer = this.buffers.get(note) || this.buffers.get('C4');
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(velocity, time);

    // Reverb / Convolver or Delay simulation node for acoustic space
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 4000; // Warm acoustic tone

    source.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(destination);

    source.start(time);
    this.activeSources.push(source, noteGain, filter);
  }

  private getSampledCompositionEvents() {
    // Composition events sequence (Time in seconds, Note name, Velocity)
    const events: Array<{ time: number; note: string; velocity: number }> = [];

    // Helper to add Arpeggio
    const addArp = (startTime: number, notes: string[], count: number, step: number) => {
      for (let i = 0; i < count; i++) {
        const n = notes[i % notes.length];
        events.push({ time: startTime + i * step, note: n, velocity: 0.5 });
      }
    };

    // Phrase 1: Intro (0s - 12s)
    addArp(0.0, ['D4', 'F4', 'A4', 'C5', 'A4', 'F4'], 12, 0.8);
    events.push(
      { time: 1.0, note: 'A4', velocity: 0.75 },
      { time: 3.5, note: 'C5', velocity: 0.7 },
      { time: 6.0, note: 'D5', velocity: 0.8 },
      { time: 9.0, note: 'A4', velocity: 0.65 }
    );

    // Phrase 2: Development (12s - 26s)
    addArp(12.0, ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'], 14, 0.8);
    events.push(
      { time: 13.0, note: 'E4', velocity: 0.7 },
      { time: 16.0, note: 'G4', velocity: 0.75 },
      { time: 19.0, note: 'C5', velocity: 0.85 },
      { time: 22.5, note: 'B4', velocity: 0.7 }
    );

    // Phrase 3: Climax (26s - 38s)
    addArp(26.0, ['D4', 'F4', 'A4', 'D5', 'C5', 'A4'], 12, 0.75);
    events.push(
      { time: 27.0, note: 'D5', velocity: 0.9 },
      { time: 30.0, note: 'E5', velocity: 0.85 },
      { time: 33.0, note: 'F5' in NOTE_TO_NAME ? 'F5' : 'E5', velocity: 0.9 },
      { time: 36.0, note: 'D5', velocity: 0.8 }
    );

    // Phrase 4: Resolution (38s - 50s)
    addArp(38.0, ['A4', 'F4', 'D4', 'A4'], 10, 1.0);
    events.push(
      { time: 39.0, note: 'C5', velocity: 0.65 },
      { time: 43.0, note: 'A4', velocity: 0.55 },
      { time: 47.0, note: 'D4', velocity: 0.4 }
    );

    return events;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.activeSources.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioNode & { stop: () => void }).stop === 'function') {
          (node as AudioNode & { stop: () => void }).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeSources = [];
    if (this.onStatusCb) this.onStatusCb('متوقف');
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}
