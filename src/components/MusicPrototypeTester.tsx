import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Sparkles, Music, Waves, CheckCircle2, Volume2 } from 'lucide-react';
import { KhairatAudioPrototypePlayer, PROTOTYPE_TRACK } from '../utils/khairatAudioEnginePrototype';

interface MusicPrototypeTesterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicPrototypeTester: React.FC<MusicPrototypeTesterProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<KhairatAudioPrototypePlayer | null>(null);

  useEffect(() => {
    if (!isOpen && playerRef.current) {
      playerRef.current.stop();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isOpen]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (playerRef.current) {
        playerRef.current.stop();
      }
      setIsPlaying(false);
    } else {
      const player = new KhairatAudioPrototypePlayer(
        (p) => setProgress(p),
        () => {
          setIsPlaying(false);
          setProgress(1);
        }
      );
      playerRef.current = player;
      await player.start();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  if (!isOpen) return null;

  const elapsedSeconds = Math.floor(progress * PROTOTYPE_TRACK.durationSec);
  const remainingSeconds = PROTOTYPE_TRACK.durationSec - elapsedSeconds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-stone-100 overflow-hidden">
        
        {/* Decorative Ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                اختبار تجريبي مستقل
              </span>
              <h2 className="text-lg font-bold text-stone-100 mt-1">اختبار النموذج الموسيقي الاحترافي</h2>
            </div>
          </div>
          <button 
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Card */}
        <div className="my-6 p-5 rounded-2xl bg-stone-950/60 border border-stone-800 flex flex-col items-center text-center relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600/30 via-stone-800 to-emerald-600/30 flex items-center justify-center border border-amber-500/30 shadow-inner mb-4 relative">
            <Music className={`w-8 h-8 text-amber-400 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping pointer-events-none"></div>
            )}
          </div>

          <h3 className="text-xl font-bold text-stone-100 mb-1">{PROTOTYPE_TRACK.titleAr}</h3>
          <p className="text-sm text-stone-300 max-w-md leading-relaxed">{PROTOTYPE_TRACK.descriptionAr}</p>

          {/* Visualizer Wave Simulation */}
          <div className="w-full flex items-center justify-center gap-1 h-10 mt-5">
            {[...Array(24)].map((_, i) => {
              const heightFactor = isPlaying ? Math.sin((Date.now() / 150) + i) * 0.5 + 0.6 : 0.15;
              return (
                <div 
                  key={i} 
                  style={{ height: `${Math.max(15, heightFactor * 100)}%` }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${isPlaying ? 'bg-gradient-to-t from-amber-500 to-emerald-400' : 'bg-stone-700'}`}
                ></div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-stone-400 mb-1.5 font-mono">
              <span>0:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}</span>
              <span>0:{PROTOTYPE_TRACK.durationSec}</span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-200"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors shadow-md"
            title="إعادة من البداية"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 shadow-lg transition-all transform active:scale-95 ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30' 
                : 'bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-stone-950 font-extrabold shadow-emerald-900/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{progress > 0 ? 'استئناف العزف' : 'استماع للنموذج الأولي'}</span>
              </>
            )}
          </button>
        </div>

        {/* Technical & Design Notes */}
        <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800/80 text-xs text-stone-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ملخص التقنيات المستخدمة في هذا النموذج:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-stone-300 pr-2">
            <li><strong>توليف متقدم بمذبذبات مزدوجة:</strong> دمج موجات المثلث والساين مع فلتر ترددات لتوليد صوت بيانو يحاكي الرنين والمطرقة.</li>
            <li><strong>أربيجيو هارموني متطور:</strong> تتابع نغمي موزع على 4 أقسام زمنية (مقدمة، تطور، ذروة، خاتمة).</li>
            <li><strong>طبقة وتريات دافئة (String Pad):</strong> خلفية أوركسترالية مستمرة بفلتر منخفض الترددات.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
