// Multi-channel Web Audio API synthesizer for ambient soundscapes & mindful chimes

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private activeTracks: Map<string, { gain: GainNode; source: AudioNode; stop: () => void }> = new Map();
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Play peaceful singing bowl chime (for breath phase transitions or start/finish)
  playSingingBowlChime(freq = 432) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Gentle frequency bend
      osc.frequency.exponentialRampToValueAtTime(freq * 0.998, this.ctx.currentTime + 3.0);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.6);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Layered multi-channel ambient sound generator
  setChannel(channel: 'rain' | 'breeze' | 'waves' | 'meditation' | 'night', volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const existing = this.activeTracks.get(channel);

    if (volume <= 0.01) {
      if (existing) {
        existing.stop();
        this.activeTracks.delete(channel);
      }
      return;
    }

    if (existing) {
      existing.gain.gain.linearRampToValueAtTime(volume * 0.2, this.ctx.currentTime + 0.1);
      return;
    }

    // Create channel
    const chanGain = this.ctx.createGain();
    chanGain.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
    chanGain.connect(this.masterGain);

    if (channel === 'meditation') {
      // Calming binaural 432Hz ambient chord
      const freqs = [108, 162, 216, 324];
      const oscs: OscillatorNode[] = [];
      freqs.forEach(f => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        osc.connect(chanGain);
        osc.start();
        oscs.push(osc);
      });

      this.activeTracks.set(channel, {
        gain: chanGain,
        source: chanGain,
        stop: () => {
          oscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
          chanGain.disconnect();
        }
      });
    } else {
      // Noise buffer based on physical sound models
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = channel === 'rain' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(
        channel === 'rain' ? 850 : channel === 'breeze' ? 400 : 250,
        this.ctx.currentTime
      );
      if (channel === 'rain') filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(chanGain);
      noise.start();

      this.activeTracks.set(channel, {
        gain: chanGain,
        source: noise,
        stop: () => {
          try { noise.stop(); noise.disconnect(); filter.disconnect(); } catch {}
          chanGain.disconnect();
        }
      });
    }
  }

  playAmbient(mode: 'rain' | 'breeze' | 'waves' | 'meditation' = 'meditation', volume = 0.5) {
    this.stop();
    this.setChannel(mode, volume);
    this.isPlaying = true;
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.4, this.ctx.currentTime);
    }
  }

  stop() {
    this.activeTracks.forEach(track => {
      track.stop();
    });
    this.activeTracks.clear();
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.activeTracks.size > 0;
  }

  getActiveChannels() {
    return Array.from(this.activeTracks.keys());
  }
}

export const ambientSound = new AmbientSoundEngine();
