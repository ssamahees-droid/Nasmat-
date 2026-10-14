import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Gauge, 
  Sparkles 
} from 'lucide-react';
import { voiceService, AudioPlaybackState } from '../services/voiceService';

export interface TextAudioPlayerProps {
  text: string;
  id?: string;
  variant?: 'compact' | 'full' | 'inline';
  label?: string;
  className?: string;
  showSpeedControl?: boolean;
}

const SPEED_OPTIONS = [0.8, 1.0, 1.25, 1.5];

export const TextAudioPlayer: React.FC<TextAudioPlayerProps> = ({
  text,
  id,
  variant = 'compact',
  label = 'استمع صوتياً',
  className = '',
  showSpeedControl = true
}) => {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(voiceService.getState());
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Generate deterministic ID from text if not provided
  const audioId = id || `tts_${text.slice(0, 20).replace(/\s+/g, '_')}`;

  useEffect(() => {
    const unsubscribe = voiceService.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isCurrentAudio = playbackState.activeId === audioId;
  const isPlaying = isCurrentAudio && playbackState.isPlaying;
  const isPaused = isCurrentAudio && playbackState.isPaused;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      voiceService.pause();
    } else if (isPaused) {
      voiceService.resume();
    } else {
      voiceService.play(audioId, text, { rate: playbackState.rate });
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    voiceService.stop();
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    voiceService.play(audioId, text, { rate: playbackState.rate });
  };

  const handleSpeedSelect = (speed: number, e: React.MouseEvent) => {
    e.stopPropagation();
    voiceService.setRate(speed);
    setShowSpeedMenu(false);
  };

  // 1. INLINE VARIANT (Compact for chat bubble headers)
  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`} dir="rtl">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-[#174C3C] dark:bg-[#A9C5A0] text-[#F7F3E9] dark:text-[#0D1914] shadow-xs'
              : isPaused
              ? 'bg-[#D5A65A]/25 text-[#174C3C] dark:text-[#D5A65A]'
              : 'bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 text-[#174C3C] dark:text-[#A9C5A0] hover:bg-[#174C3C]/20 dark:hover:bg-[#A9C5A0]/25'
          }`}
          title={isPlaying ? 'إيقاف مؤقت' : isPaused ? 'استكمال الاستماع' : label}
          aria-label={label}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">إيقاف مؤقت</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">استكمال</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{label}</span>
            </>
          )}
        </button>

        {isCurrentAudio && (isPlaying || isPaused) && (
          <div className="flex items-center gap-1 animate-fadeIn">
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-lg text-[#13251E]/60 hover:text-[#D98F83] dark:text-[#F7F3E9]/60 dark:hover:text-[#D98F83] bg-black/5 dark:bg-white/5 cursor-pointer"
              title="إيقاف نهائي"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleReplay}
              className="p-1.5 rounded-lg text-[#13251E]/60 hover:text-[#174C3C] dark:text-[#F7F3E9]/60 dark:hover:text-[#A9C5A0] bg-black/5 dark:bg-white/5 cursor-pointer"
              title="إعادة الاستماع من البداية"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. FULL VARIANT (Detailed player bar for long reflections and weekly session)
  if (variant === 'full') {
    return (
      <div 
        className={`p-3 sm:p-4 rounded-2xl border transition-all ${
          isCurrentAudio && (isPlaying || isPaused)
            ? 'bg-[#E6E8D8]/70 dark:bg-[#14271F] border-[#174C3C]/30 dark:border-[#A9C5A0]/40 shadow-xs'
            : 'bg-[#F7F3E9] dark:bg-[#12241D] border-[#174C3C]/15 dark:border-[#A9C5A0]/20'
        } ${className}`}
        dir="rtl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Action and Title */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePlayToggle}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isPlaying
                  ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                  : isPaused
                  ? 'bg-[#D5A65A] text-[#13251E]'
                  : 'bg-[#174C3C] dark:bg-[#A9C5A0] text-[#F7F3E9] dark:text-[#0D1914]'
              }`}
              aria-label={isPlaying ? 'إيقاف مؤقت' : isPaused ? 'استكمال' : label}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-[-0.5px]" />}
            </button>

            <div>
              <span className="text-xs font-bold text-[#13251E] dark:text-[#F7F3E9] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#174C3C] dark:text-[#A9C5A0]" />
                <span>{label}</span>
              </span>
              <p className="text-[10px] text-[#13251E]/60 dark:text-[#F7F3E9]/60">
                {isPlaying 
                  ? (playbackState.totalChunks > 1 
                      ? `جارِ القراءة (الفقرة ${playbackState.currentChunkIndex + 1} من ${playbackState.totalChunks})` 
                      : 'جارِ القراءة بصوت عربي مسموع...') 
                  : isPaused 
                  ? 'متوقف مؤقتاً — انقر للاستكمال' 
                  : 'انقر للاستماع للرد كاملاً بصوت واضح'}
              </p>
            </div>
          </div>

          {/* Soundwave animation if active */}
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-[#A9C5A0]/20 rounded-full text-[#174C3C] dark:text-[#A9C5A0]">
              <span className="w-1 h-3 bg-[#174C3C] dark:bg-[#A9C5A0] animate-pulse rounded-full" />
              <span className="w-1 h-4 bg-[#174C3C] dark:bg-[#A9C5A0] animate-pulse delay-75 rounded-full" />
              <span className="w-1 h-2 bg-[#174C3C] dark:bg-[#A9C5A0] animate-pulse delay-150 rounded-full" />
              <span className="text-[10px] font-jetbrains font-bold mr-1">صوت نشط</span>
            </div>
          )}

          {/* Controls: Stop, Replay, Speed */}
          <div className="flex items-center gap-1.5">
            {isCurrentAudio && (isPlaying || isPaused) && (
              <>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="px-2.5 py-1.5 rounded-lg border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-xs text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A] transition-all cursor-pointer flex items-center gap-1"
                  title="إعادة القراءة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden md:inline">إعادة</span>
                </button>
                <button
                  type="button"
                  onClick={handleStop}
                  className="px-2.5 py-1.5 rounded-lg border border-[#D98F83]/40 text-xs text-[#D98F83] hover:bg-[#D98F83]/10 transition-all cursor-pointer flex items-center gap-1"
                  title="إيقاف"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden md:inline">إيقاف</span>
                </button>
              </>
            )}

            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-[11px] font-jetbrains font-bold text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A] transition-all cursor-pointer flex items-center gap-1"
                title="سرعة القراءة"
              >
                <Gauge className="w-3 h-3 text-[#174C3C] dark:text-[#A9C5A0]" />
                <span>{playbackState.rate}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute left-0 bottom-full mb-1.5 bg-[#F7F3E9] dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl shadow-lg p-1.5 z-30 min-w-[75px] flex flex-col gap-1">
                  {SPEED_OPTIONS.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={(e) => handleSpeedSelect(spd, e)}
                      className={`px-2 py-1 text-center rounded-lg text-xs font-jetbrains font-bold transition-colors cursor-pointer ${
                        playbackState.rate === spd
                          ? 'bg-[#174C3C] dark:bg-[#A9C5A0] text-[#F7F3E9] dark:text-[#0D1914]'
                          : 'hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A] text-[#13251E] dark:text-[#F7F3E9]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. COMPACT VARIANT (Default: Sleek pill button suitable anywhere)
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} dir="rtl">
      <div className="inline-flex items-center rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-[#E6E8D8]/50 dark:bg-[#14271F] p-1 shadow-2xs transition-colors">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-[#174C3C] dark:bg-[#A9C5A0] text-[#F7F3E9] dark:text-[#0D1914] shadow-2xs'
              : isPaused
              ? 'bg-[#D5A65A] text-[#13251E] shadow-2xs'
              : 'hover:bg-[#174C3C]/10 dark:hover:bg-[#A9C5A0]/15 text-[#13251E] dark:text-[#F7F3E9]'
          }`}
          title={isPlaying ? 'إيقاف مؤقت' : isPaused ? 'استكمال' : label}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>إيقاف مؤقت</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>استكمال</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#174C3C] dark:text-[#A9C5A0]" />
              <span>{label}</span>
            </>
          )}
        </button>

        {/* Extended controls if current audio is active */}
        {isCurrentAudio && (isPlaying || isPaused) && (
          <div className="flex items-center gap-1 mr-1 border-r border-[#174C3C]/10 dark:border-[#A9C5A0]/15 pr-1 animate-fadeIn">
            {/* Stop */}
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-md text-[#13251E]/60 hover:text-[#D98F83] dark:text-[#F7F3E9]/60 dark:hover:text-[#D98F83] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="إيقاف"
            >
              <Square className="w-3 h-3" />
            </button>
            {/* Replay */}
            <button
              type="button"
              onClick={handleReplay}
              className="p-1.5 rounded-md text-[#13251E]/60 hover:text-[#174C3C] dark:text-[#F7F3E9]/60 dark:hover:text-[#A9C5A0] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="إعادة التشغيل"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            {/* Quick Speed Switcher */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const nextSpeed = playbackState.rate === 1.0 ? 1.25 : playbackState.rate === 1.25 ? 1.5 : playbackState.rate === 1.5 ? 0.8 : 1.0;
                voiceService.setRate(nextSpeed);
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-jetbrains font-bold bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 text-[#174C3C] dark:text-[#A9C5A0] hover:bg-[#174C3C]/20 cursor-pointer"
              title="تغيير سرعة القراءة"
            >
              {playbackState.rate}x
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
