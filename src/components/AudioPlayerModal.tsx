import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw, Heart, CheckCircle2, Info } from 'lucide-react';
import { ambientSound, SoundChannelId, NATURE_SOUND_TRACKS } from '../utils/audioSynth';

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  durationMinutes: number;
  onFinishCheckin?: (moodResult: 'better' | 'same' | 'tired') => void;
}

const AVAILABLE_NATURE_TRACKS: { id: SoundChannelId; label: string; icon: string }[] = [
  { id: 'waves', label: 'أمواج البحر', icon: '🌊' },
  { id: 'rain', label: 'مطر طبيعي', icon: '🌧️' },
  { id: 'stream', label: 'خرير الجدول', icon: '💧' },
  { id: 'birds', label: 'تغريد الطيور', icon: '🐦' },
  { id: 'forest', label: 'أجواء الغابة', icon: '🌲' },
  { id: 'breeze', label: 'حفيف الأشجار', icon: '🍃' },
  { id: 'fire', label: 'نار هادئة', icon: '🔥' },
  { id: 'meditation', label: 'سكينة التأمل', icon: '✨' }
];

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  durationMinutes,
  onFinishCheckin
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [volume, setVolume] = useState(0.5); // Comfortable starting volume
  const [isMuted, setIsMuted] = useState(false);
  const [soundMode, setSoundMode] = useState<SoundChannelId>('waves');
  const [showPostCheckin, setShowPostCheckin] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<'better' | 'same' | 'tired' | null>(null);

  const totalSeconds = durationMinutes * 60;

  useEffect(() => {
    if (!isOpen) {
      ambientSound.stop();
      setIsPlaying(false);
      setSecondsElapsed(0);
      setShowPostCheckin(false);
      setSelectedFeeling(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => {
          if (prev + 1 >= totalSeconds) {
            handleCompleteSession();
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSeconds]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      ambientSound.pause();
      setIsPlaying(false);
    } else {
      ambientSound.playAmbient(soundMode, isMuted ? 0 : volume);
      setIsPlaying(true);
    }
  };

  const handleSoundModeChange = (mode: SoundChannelId) => {
    setSoundMode(mode);
    if (isPlaying) {
      ambientSound.playAmbient(mode, isMuted ? 0 : volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (!isMuted) {
      ambientSound.setVolume(newVol);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    ambientSound.setVolume(nextMuted ? 0 : volume);
  };

  const handleResetSession = () => {
    ambientSound.stop();
    setIsPlaying(false);
    setSecondsElapsed(0);
  };

  const handleCompleteSession = () => {
    ambientSound.stop();
    setIsPlaying(false);
    setShowPostCheckin(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTrackMeta = NATURE_SOUND_TRACKS[soundMode];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 shadow-2xl overflow-hidden text-right">
        {/* Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]/70">
          <div className="text-xs text-[#52645B] font-medium">
            مشغل الجلسات الصوتية · {category}
          </div>
          <button
            onClick={() => {
              ambientSound.stop();
              onClose();
            }}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/40 transition-colors"
            aria-label="إغلاق المشغل"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Pulse / Art */}
        <div className="relative flex flex-col items-center justify-center my-4 py-3">
          <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#8FAF9A]/30 to-[#355C4A]/20 flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'scale-105 shadow-lg shadow-[#8FAF9A]/20' : 'scale-100'}`}>
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#8FAF9A]/40 flex items-center justify-center transition-all ${isPlaying ? 'animate-breathe' : ''}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#355C4A] text-white flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-[#E8DDCC]" />
              </div>
            </div>
          </div>

          <h3 className="mt-4 text-base sm:text-lg font-bold text-[#26332D] text-center px-4">
            {title}
          </h3>
          <p className="text-xs text-[#52645B] mt-1 text-center">
            {isPlaying 
              ? `تستمع الآن إلى: ${currentTrackMeta.titleAr} (تسجيل طبيعي حقيقي)`
              : 'اختر صوت الطبيعة واضغط على زر التشغيل لبدء جلستك'}
          </p>
        </div>

        {/* Nature Sound Track Selector */}
        <div className="mb-4">
          <div className="text-xs text-[#52645B] mb-2 font-medium flex items-center justify-between">
            <span>اختر صوت الطبيعة المرافق:</span>
            <span className="text-[11px] text-[#355C4A] font-bold">تسجيلات حقيقية دون موسيقى</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-200/50 rounded-xl">
            {AVAILABLE_NATURE_TRACKS.map(item => (
              <button
                key={item.id}
                onClick={() => handleSoundModeChange(item.id)}
                className={`py-1.5 px-1 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  soundMode === item.id 
                    ? 'bg-[#355C4A] text-white shadow-xs' 
                    : 'text-[#35453E] hover:text-[#26332D]'
                }`}
                title={item.label}
              >
                <span className="text-xs">{item.icon}</span>
                <span className="text-[11px] truncate">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Attribution badge */}
          {currentTrackMeta && (
            <div className="mt-2 text-[10px] text-[#7D8F85] flex items-center gap-1 justify-center">
              <Info className="w-3 h-3 text-[#355C4A]" />
              <span>المصدر: {currentTrackMeta.attribution} ({currentTrackMeta.license})</span>
            </div>
          )}
        </div>

        {/* Progress Bar & Timers */}
        <div className="space-y-1 mb-4">
          <input
            type="range"
            min="0"
            max={totalSeconds}
            value={secondsElapsed}
            onChange={(e) => setSecondsElapsed(Number(e.target.value))}
            className="w-full accent-[#355C4A] cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-[#52645B]">
            <span>{formatTime(secondsElapsed)}</span>
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>

        {/* Controls: Play/Pause, Rewind, Volume */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#E8DDCC]/70">
          <button
            onClick={handleResetSession}
            className="p-2.5 text-[#52645B] hover:text-[#26332D] hover:bg-stone-200/40 rounded-xl transition-colors"
            title="إعادة من البداية وإيقاف"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-14 h-14 rounded-2xl bg-[#355C4A] hover:bg-[#264235] text-white flex items-center justify-center shadow-lg shadow-[#355C4A]/25 transition-transform active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 translate-x-0.5" />}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className="p-2 text-[#52645B] hover:text-[#26332D] rounded-xl transition-colors"
              title={isMuted ? 'إلغاء الكتم' : 'كتم'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-600" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-16 accent-[#355C4A] cursor-pointer"
            />
          </div>
        </div>

        {/* Finish Button */}
        {!showPostCheckin && (
          <div className="mt-3 pt-2">
            <button
              onClick={handleCompleteSession}
              className="w-full py-2.5 text-xs font-medium text-[#355C4A] hover:bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-xl transition-colors cursor-pointer"
            >
              إنهاء الجلسة وتسجيل الشعور الآن
            </button>
          </div>
        )}

        {/* Post-Session Check-in */}
        {showPostCheckin && (
          <div className="mt-4 p-4 bg-white/90 border border-[#8FAF9A]/40 rounded-2xl animate-fade-in space-y-3">
            <div className="text-center">
              <div className="text-sm font-bold text-[#26332D]">إيه إحساسك دلوقتي؟</div>
              <div className="text-[11px] text-[#52645B] mt-0.5">هذه ليست نتيجة طبية</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'better', label: 'أفضل 🌿', mood: 'better' },
                { id: 'same', label: 'زي ما أنا 😐', mood: 'same' },
                { id: 'tired', label: 'لسه متعب 🌧️', mood: 'tired' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedFeeling(opt.mood as 'better' | 'same' | 'tired')}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                    selectedFeeling === opt.mood
                      ? 'bg-[#355C4A] text-white border-[#355C4A]'
                      : 'bg-[#FAF7F0] text-[#26332D] border-[#E8DDCC] hover:bg-[#E8DDCC]/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {selectedFeeling && (
              <button
                onClick={() => {
                  if (onFinishCheckin && selectedFeeling) {
                    onFinishCheckin(selectedFeeling);
                  }
                  onClose();
                }}
                className="w-full py-2.5 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                حفظ وإنهاء
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
