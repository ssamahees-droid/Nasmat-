// High-quality Audio Engine for authentic recorded nature soundscapes & mindful chimes
// Uses real field recordings from verified Creative Commons / Public Domain sources.

export type SoundChannelId = 
  | 'waves' 
  | 'rain' 
  | 'breeze' 
  | 'stream' 
  | 'birds' 
  | 'forest' 
  | 'fire' 
  | 'meditation' 
  | 'night';

export interface SoundTrackMeta {
  id: SoundChannelId;
  titleAr: string;
  descriptionAr: string;
  src: string;
  attribution: string;
  license: string;
  sourceUrl: string;
}

export const NATURE_SOUND_TRACKS: Record<SoundChannelId, SoundTrackMeta> = {
  waves: {
    id: 'waves',
    titleAr: 'أمواج الشاطئ الهادئة',
    descriptionAr: 'تسجيل حقيقي لتدفق أمواج الماء الهادئة وتراجعها برفق على الشاطئ.',
    src: '/audio/waves.mp3',
    attribution: 'Burkhard Mücke / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Atmo_%E2%80%93_Ufer_Wellen.mp3'
  },
  rain: {
    id: 'rain',
    titleAr: 'صوت المطر الطبيعي',
    descriptionAr: 'تسجيل أصلي حقيقي لهطول المطر المهدئ للأعصاب دون رعد أو أصوات مصطنعة.',
    src: '/audio/rain.mp3',
    attribution: 'ジダネ / Wikimedia Commons',
    license: 'Public Domain (PD-self)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rain.ogg'
  },
  breeze: {
    id: 'breeze',
    titleAr: 'حفيف الأشجار والرياح اللطيفة',
    descriptionAr: 'تسجيل طبيعي لحركة الهواء العليل وأوراق شجر الصنوبر في الغابة.',
    src: '/audio/breeze.mp3',
    attribution: 'W.carter / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wind_in_Swedish_pine_forest_at_25_mps.ogg'
  },
  stream: {
    id: 'stream',
    titleAr: 'خرير جدول ماء عذب',
    descriptionAr: 'تسجيل صوتي نقي لتدفق مياه جدول جبلي صافٍ بين الصخور.',
    src: '/audio/stream.mp3',
    attribution: 'Stephan / PDSounds.org & Wikimedia Commons',
    license: 'Public Domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Welling_rivulet_in_the_woods.ogg'
  },
  birds: {
    id: 'birds',
    titleAr: 'تغريد الطيور النقي في الطبيعة',
    descriptionAr: 'أصوات طيور حقيقية تغرد في هدوء الصباح الباكر.',
    src: '/audio/birds.mp3',
    attribution: 'Burkhard Mücke / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Atmo_%E2%80%93_V%C3%B6gel_klar.mp3'
  },
  forest: {
    id: 'forest',
    titleAr: 'أجواء الغابة الطبيعية',
    descriptionAr: 'بيئة صوتية متكاملة لغابة طبيعية حقيقية تجمع بين النسيم وزقزقة العصافير الهادئة.',
    src: '/audio/forest.mp3',
    attribution: 'Burkhard Mücke / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Atmo_%E2%80%93_Waldatmo_V%C3%B6gel.mp3'
  },
  fire: {
    id: 'fire',
    titleAr: 'صوت نار المخيم الهادئة',
    descriptionAr: 'تسجيل دافئ لطقطقة حطب النار الهادئة للشعور بالأمان والسكينة.',
    src: '/audio/fire.mp3',
    attribution: 'Glaneur de sons / Freesound & Wikimedia Commons',
    license: 'CC BY 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Campfire_sound_ambience.ogg'
  },
  meditation: {
    id: 'meditation',
    titleAr: 'سكينة الغابة والتأمل',
    descriptionAr: 'تسجيل طبيعي غني بأصوات الغابة والرياح المهدئة للتأمل والصفاء الذهني.',
    src: '/audio/forest.mp3',
    attribution: 'Burkhard Mücke / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Atmo_%E2%80%93_Waldatmo_V%C3%B6gel.mp3'
  },
  night: {
    id: 'night',
    titleAr: 'نسيم الليل الهادئ',
    descriptionAr: 'أجواء ليلية ساكنة من صوت حفيف الأشجار اللطيف للمساعدة على الاسترخاء والنوم.',
    src: '/audio/breeze.mp3',
    attribution: 'W.carter / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wind_in_Swedish_pine_forest_at_25_mps.ogg'
  }
};

class AmbientSoundEngine {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private channelVolumes: Map<string, number> = new Map();
  private masterVolume: number = 0.5; // Start at a gentle, comfortable volume
  private chimeAudio: HTMLAudioElement | null = null;
  private currentMode: SoundChannelId | null = null;
  private hasUserInteracted: boolean = false;
  private isMuted: boolean = false;

  constructor() {
    // Lazy-initialized on first user interaction to comply with browser autoplay policies
  }

  private getOrCreateAudio(channel: SoundChannelId): HTMLAudioElement {
    if (typeof window === 'undefined') {
      return {} as HTMLAudioElement;
    }

    if (!this.audioElements.has(channel)) {
      const meta = NATURE_SOUND_TRACKS[channel] || NATURE_SOUND_TRACKS.meditation;
      const audio = new Audio(meta.src);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
      
      // Handle loading errors gracefully without whistling or disruption
      audio.addEventListener('error', () => {
        console.warn(`[NesmatHayat Audio] Audio file for ${channel} could not be loaded (${meta.src}).`);
      });

      this.audioElements.set(channel, audio);
    }

    return this.audioElements.get(channel)!;
  }

  private getOrCreateChime(): HTMLAudioElement {
    if (typeof window === 'undefined') {
      return {} as HTMLAudioElement;
    }

    if (!this.chimeAudio) {
      this.chimeAudio = new Audio('/audio/chime.mp3');
      this.chimeAudio.preload = 'auto';
      this.chimeAudio.volume = Math.min(1, this.masterVolume * 0.9);
      this.chimeAudio.addEventListener('error', () => {
        console.warn('[NesmatHayat Audio] Chime sound could not be loaded.');
      });
    }

    return this.chimeAudio;
  }

  // Play peaceful authentic Tibetan singing bowl chime (acoustic recording, NOT a sine wave oscillator)
  playSingingBowlChime(_freq?: number) {
    if (typeof window === 'undefined') return;
    this.hasUserInteracted = true;
    try {
      const chime = this.getOrCreateChime();
      chime.currentTime = 0;
      chime.volume = this.isMuted ? 0 : Math.min(1, Math.max(0.1, this.masterVolume * 0.9));
      const playPromise = chime.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[NesmatHayat Audio] Chime playback paused or blocked:', err);
        });
      }
    } catch (e) {
      console.warn('[NesmatHayat Audio] Error playing chime:', e);
    }
  }

  // Multi-channel mixer for Soundscape Studio
  setChannel(channel: SoundChannelId, volume: number) {
    if (typeof window === 'undefined') return;
    this.hasUserInteracted = true;

    const clamped = Math.max(0, Math.min(1, volume));
    this.channelVolumes.set(channel, clamped);

    const audio = this.getOrCreateAudio(channel);

    if (clamped <= 0.01 || this.isMuted) {
      audio.volume = 0;
      if (!audio.paused) {
        audio.pause();
      }
      return;
    }

    // Apply calculated effective volume
    const effectiveVolume = clamped * this.masterVolume;
    audio.volume = Math.max(0, Math.min(1, effectiveVolume));

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[NesmatHayat Audio] Auto-playback deferred for channel ${channel}:`, err);
        });
      }
    }
  }

  // Play a single ambient soundscape track (for AudioPlayerModal & BreatheScreen)
  playAmbient(mode: SoundChannelId = 'meditation', volume = 0.5) {
    if (typeof window === 'undefined') return;
    this.hasUserInteracted = true;

    // Stop existing channels to prevent unintended overlapping noise
    this.stop();

    this.currentMode = mode;
    this.masterVolume = Math.max(0.05, Math.min(1, volume));

    this.setChannel(mode, 1.0);
  }

  // Master volume control
  setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterVolume = clamped;
    
    // Update all active channels proportionally
    this.channelVolumes.forEach((channelVol, channelKey) => {
      const audio = this.audioElements.get(channelKey);
      if (audio && !audio.paused) {
        const effective = this.isMuted ? 0 : channelVol * clamped;
        audio.volume = Math.max(0, Math.min(1, effective));
      }
    });

    if (this.chimeAudio) {
      this.chimeAudio.volume = this.isMuted ? 0 : Math.min(1, clamped * 0.9);
    }
  }

  getVolume(): number {
    return this.masterVolume;
  }

  // Pause all playing channels (can be resumed)
  pause() {
    this.audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }

  // Resume all channels with positive volume
  resume() {
    this.channelVolumes.forEach((vol, channelKey) => {
      if (vol > 0.01) {
        const audio = this.getOrCreateAudio(channelKey as SoundChannelId);
        audio.volume = this.isMuted ? 0 : Math.max(0, Math.min(1, vol * this.masterVolume));
        if (audio.paused) {
          audio.play().catch(() => {});
        }
      }
    });
  }

  // Complete stop and reset
  stop() {
    this.audioElements.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      } catch {}
    });
    this.channelVolumes.clear();
    this.currentMode = null;
  }

  getIsPlaying(): boolean {
    let playing = false;
    this.audioElements.forEach(audio => {
      if (!audio.paused && audio.volume > 0.01) {
        playing = true;
      }
    });
    return playing;
  }

  getActiveChannels(): SoundChannelId[] {
    const active: SoundChannelId[] = [];
    this.channelVolumes.forEach((vol, ch) => {
      if (vol > 0.01) {
        active.push(ch as SoundChannelId);
      }
    });
    return active;
  }

  getCurrentMode(): SoundChannelId | null {
    return this.currentMode;
  }

  getTracksMeta(): SoundTrackMeta[] {
    return Object.values(NATURE_SOUND_TRACKS);
  }
}

export const ambientSound = new AmbientSoundEngine();

