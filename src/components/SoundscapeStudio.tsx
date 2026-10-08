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
  RotateCcw
} from 'lucide-react';
import { ambientSound } from '../utils/audioSynth';

interface SoundscapeStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundscapeStudio: React.FC<SoundscapeStudioProps> = ({ isOpen, onClose }) => {
  const [channels, setChannels] = useState<{
    rain: number;
    breeze: number;
    waves: number;
    meditation: number;
  }>({
    rain: 0,
    breeze: 0,
    waves: 0,
    meditation: 0.5
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

  const handleChannelChange = (name: 'rain' | 'breeze' | 'waves' | 'meditation', val: number) => {
    setChannels(prev => ({ ...prev, [name]: val }));
    ambientSound.setChannel(name, val);
  };

  const handlePlayChime = () => {
    ambientSound.playSingingBowlChime(432);
  };

  const handleApplyPreset = (preset: 'rain_focus' | 'sleep_waves' | 'pure_zen') => {
    let newChannels = { rain: 0, breeze: 0, waves: 0, meditation: 0 };
    if (preset === 'rain_focus') {
      newChannels = { rain: 0.7, breeze: 0.2, waves: 0, meditation: 0.3 };
    } else if (preset === 'sleep_waves') {
      newChannels = { rain: 0, breeze: 0.3, waves: 0.8, meditation: 0.1 };
    } else if (preset === 'pure_zen') {
      newChannels = { rain: 0, breeze: 0, waves: 0, meditation: 0.8 };
    }

    setChannels(newChannels);
    Object.entries(newChannels).forEach(([key, val]) => {
      ambientSound.setChannel(key as 'rain' | 'breeze' | 'waves' | 'meditation', val);
    });
  };

  const handleMuteAll = () => {
    setChannels({ rain: 0, breeze: 0, waves: 0, meditation: 0 });
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
      <div className="relative w-full max-w-md bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 shadow-2xl text-right overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8FAF9A]/20 text-[#355C4A] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26332D]">استوديو الأجواء المحيطية</h2>
              <p className="text-[11px] text-[#52645B]">امزج أصوات الطبيعة لتناسب مزاجك الحالي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="my-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-[#52645B]">أجواء جاهزة بنقرة واحدة:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleApplyPreset('rain_focus')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A]"
            >
              <div className="text-sm">🌧️</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">مطر وتركيز</div>
            </button>
            <button
              onClick={() => handleApplyPreset('sleep_waves')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A]"
            >
              <div className="text-sm">🌊</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">أمواج للنوم</div>
            </button>
            <button
              onClick={() => handleApplyPreset('pure_zen')}
              className="p-2 bg-white/80 hover:bg-white border border-[#E8DDCC] rounded-xl text-center transition-all hover:border-[#8FAF9A]"
            >
              <div className="text-sm">✨</div>
              <div className="text-[11px] font-bold text-[#26332D] mt-0.5">سكينة 432Hz</div>
            </button>
          </div>
        </div>

        {/* Mixer Sliders */}
        <div className="space-y-3.5 my-4 bg-white/70 p-4 rounded-2xl border border-[#E8DDCC]">
          {/* Rain */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <CloudRain className="w-4 h-4 text-sky-600" />
                <span>مطر هادئ</span>
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

          {/* Breeze */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span>نسيم الرياح وأوراق الشجر</span>
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

          {/* Ocean Waves */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Waves className="w-4 h-4 text-indigo-600" />
                <span>أمواج البحر الرقيقة</span>
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

          {/* Calming Harmonics */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#26332D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Music className="w-4 h-4 text-amber-600" />
                <span>نغمة السكينة العميقة (432Hz)</span>
              </span>
              <span className="font-mono text-[11px] text-[#7D8F85]">{Math.round(channels.meditation * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={channels.meditation}
              onChange={(e) => handleChannelChange('meditation', Number(e.target.value))}
              className="w-full accent-[#355C4A] cursor-pointer"
            />
          </div>
        </div>

        {/* Chime Trigger */}
        <div className="flex items-center justify-between p-3 bg-stone-100/80 rounded-xl mb-4">
          <span className="text-xs text-[#35453E] font-medium flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-[#355C4A]" />
            <span>رنّة الصنج التبتي (لحظة وعي):</span>
          </span>
          <button
            onClick={handlePlayChime}
            className="py-1 px-3 bg-white border border-[#E8DDCC] hover:bg-[#FAF7F0] text-xs font-bold text-[#355C4A] rounded-lg shadow-2xs"
          >
            دق الجرس 🔔
          </button>
        </div>

        {/* Auto Timer */}
        <div className="flex items-center justify-between mb-4 text-xs text-[#52645B]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>مؤقت الإيقاف التلقائي:</span>
          </span>
          <div className="flex gap-1.5">
            {[15, 30, 45].map(m => (
              <button
                key={m}
                onClick={() => handleSetTimer(m)}
                className={`py-1 px-2 rounded-lg text-[11px] font-mono ${
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
              className="py-2.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>إيقاف الأصوات</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors"
          >
            متابعة التصفح مع الصوت الخلفي 🌿
          </button>
        </div>
      </div>
    </div>
  );
};
