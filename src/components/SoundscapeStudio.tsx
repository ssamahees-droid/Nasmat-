import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  X, 
  Clock, 
  CloudRain, 
  Wind, 
  Waves, 
  Music, 
  BellRing,
  RotateCcw,
  Flame,
  Droplets,
  Bird,
  Trees,
  Info
} from 'lucide-react';
import { ambientSound, SoundChannelId } from '../utils/audioSynth';

interface SoundscapeStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

type StudioChannels = {
  rain: number;
  waves: number;
  breeze: number;
  stream: number;
  birds: number;
  forest: number;
  fire: number;
};

export const SoundscapeStudio: React.FC<SoundscapeStudioProps> = ({ isOpen, onClose }) => {
  const [channels, setChannels] = useState<StudioChannels>({
    rain: 0,
    waves: 0,
    breeze: 0,
    stream: 0,
    birds: 0,
    forest: 0,
    fire: 0
  });

  const [activeTimerMinutes, setActiveTimerMinutes] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);

  // Auto-off timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev && prev <= 1) {
            handleMuteAll();
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerSecondsLeft]);

  const handleChannelChange = (name: keyof StudioChannels, val: number) => {
    setChannels(prev => ({ ...prev, [name]: val }));
    ambientSound.setChannel(name as SoundChannelId, val);
  };

  const handlePlayChime = () => {
    ambientSound.playSingingBowlChime();
  };

  const handleApplyPreset = (preset: 'rain_stream' | 'ocean_breeze' | 'forest_birds' | 'cozy_fire') => {
    const newChannels: StudioChannels = {
      rain: 0,
      waves: 0,
      breeze: 0,
      stream: 0,
      birds: 0,
      forest: 0,
      fire: 0
    };

    if (preset === 'rain_stream') {
      newChannels.rain = 0.6;
      newChannels.stream = 0.4;
    } else if (preset === 'ocean_breeze') {
      newChannels.waves = 0.7;
      newChannels.breeze = 0.3;
    } else if (preset === 'forest_birds') {
      newChannels.forest = 0.5;
      newChannels.birds = 0.6;
      newChannels.breeze = 0.2;
    } else if (preset === 'cozy_fire') {
      newChannels.fire = 0.7;
      newChannels.rain = 0.3;
    }

    setChannels(newChannels);
    Object.entries(newChannels).forEach(([key, val]) => {
      ambientSound.setChannel(key as SoundChannelId, val);
    });
  };

  const handleMuteAll = () => {
    setChannels({
      rain: 0,
      waves: 0,
      breeze: 0,
      stream: 0,
      birds: 0,
      forest: 0,
      fire: 0
    });
    ambientSound.stop();
    setTimerSecondsLeft(null);
    setActiveTimerMinutes(null);
  };

  const handleSetTimer = (mins: number) => {
    if (activeTimerMinutes === mins) {
      setActiveTimerMinutes(null);
      setTimerSecondsLeft(null);
    } else {
      setActiveTimerMinutes(mins);
      setTimerSecondsLeft(mins * 60);
    }
  };

  const isAnyPlaying = Object.values(channels).some(v => v > 0);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-6 shadow-2xl text-right overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8FAF9A]/20 text-[#355C4A] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26332D]">استوديو الأجواء الطبيعية الحقيقية</h2>
              <p className="text-[11px] text-[#52645B]">تسجيلات ميدانية خالية من الكلام والموسيقى والتشويش</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="my-3 space-y-1.5">
          <div className="text-[11px] font-semibold text-[#52645B]">أجواء طبيعية جاهزة بنقرة واحدة:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleApplyPreset('rain_stream')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A] cursor-pointer"
            >
              <div className="text-sm">🌧️💧</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">مطر وجدول ماء</div>
            </button>
            <button
              onClick={() => handleApplyPreset('ocean_breeze')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A] cursor-pointer"
            >
              <div className="text-sm">🌊🍃</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">أمواج الشاطئ</div>
            </button>
            <button
              onClick={() => handleApplyPreset('forest_birds')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A] cursor-pointer"
            >
              <div className="text-sm">🌲🐦</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">غابة وعصافير</div>
            </button>
            <button
              onClick={() => handleApplyPreset('cozy_fire')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A] cursor-pointer"
            >
              <div className="text-sm">🔥☕</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">دفء ونار هادئة</div>
            </button>
          </div>
        </div>

        {/* Mixer Sliders */}
        <div className="space-y-3 my-3 bg-white/70 p-3.5 sm:p-4 rounded-2xl border border-[#E8DDCC]">
          
          {/* Waves */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Waves className="w-4 h-4 text-sky-600" />
                <span>أمواج الشاطئ الهادئة</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.waves * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.waves}
              onChange={(e) => handleChannelChange('waves', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>

          {/* Rain */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <CloudRain className="w-4 h-4 text-blue-600" />
                <span>صوت المطر الطبيعي</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.rain * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.rain}
              onChange={(e) => handleChannelChange('rain', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>

          {/* Stream */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span>خرير جدول ماء عذب</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.stream * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.stream}
              onChange={(e) => handleChannelChange('stream', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>

          {/* Birds */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Bird className="w-4 h-4 text-amber-600" />
                <span>تغريد الطيور في الصباح</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.birds * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.birds}
              onChange={(e) => handleChannelChange('birds', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>

          {/* Forest Atmosphere */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Trees className="w-4 h-4 text-emerald-700" />
                <span>أجواء الغابة وسكون الطبيعة</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.forest * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.forest}
              onChange={(e) => handleChannelChange('forest', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>

          {/* Breeze / Wind */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span>حفيف الأشجار والرياح اللطيفة</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.breeze * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.breeze}
              onChange={(e) => handleChannelChange('breeze', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>

          {/* Fire */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>صوت نار المخيم الهادئة</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.fire * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.fire}
              onChange={(e) => handleChannelChange('fire', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>
        </div>

        {/* Chime Trigger */}
        <div className="flex items-center justify-between p-3 bg-stone-100/80 rounded-xl mb-3 border border-[#E8DDCC]/60">
          <span className="text-xs text-[#35453E] font-medium flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-[#355C4A]" />
            <span>رنين وعاء السكينة الحقيقي (لحظة وعي):</span>
          </span>
          <button
            onClick={handlePlayChime}
            className="py-1 px-3 bg-white border border-[#E8DDCC] hover:bg-[#FAF7F0] text-xs font-bold text-[#355C4A] rounded-lg shadow-2xs cursor-pointer"
          >
            دق الجرس 🔔
          </button>
        </div>

        {/* Auto Timer */}
        <div className="flex items-center justify-between mb-3 text-xs text-[#52645B]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>مؤقت الإيقاف التلقائي:</span>
          </span>
          <div className="flex gap-1.5">
            {[15, 30, 45].map(m => (
              <button
                key={m}
                onClick={() => handleSetTimer(m)}
                className={`py-1 px-2.5 rounded-lg text-[11px] font-mono cursor-pointer ${
                  activeTimerMinutes === m
                    ? 'bg-[#355C4A] text-white'
                    : 'bg-white border border-[#E8DDCC] text-stone-600'
                }`}
              >
                {m} د
              </button>
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="pt-2 border-t border-[#E8DDCC] flex gap-2">
          {isAnyPlaying && (
            <button
              onClick={handleMuteAll}
              className="py-2.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>إيقاف الكل</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
          >
            {isAnyPlaying ? 'متابعة التصفح مع الصوت في الخلفية 🌿' : 'إغلاق الاستوديو'}
          </button>
        </div>
      </div>
    </div>
  );
};
