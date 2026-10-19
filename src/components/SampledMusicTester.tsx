import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Sparkles, Music, CheckCircle2, Volume2, DownloadCloud } from 'lucide-react';
import { SampledAudioEnginePrototype, SAMPLED_TRACK } from '../utils/sampledAudioEnginePrototype';

interface SampledMusicTesterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampledMusicTester: React.FC<SampledMusicTesterProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('جاهز للتحميل والعزف بالعينات الحقيقية');
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);
  const playerRef = useRef<SampledAudioEnginePrototype | null>(null);

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
      setIsLoadingSamples(true);
      const player = new SampledAudioEnginePrototype(
        (p) => setProgress(p),
        (s) => setStatusMessage(s),
        () => {
          setIsPlaying(false);
          setProgress(1);
          setStatusMessage('انتهت المقطوعة');
        }
      );
      playerRef.current = player;
      await player.start();
      setIsLoadingSamples(false);
      setIsPlaying(player.getIsPlaying());
    }
  };

  const handleReset = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
    setIsPlaying(false);
    setProgress(0);
    setStatusMessage('تم الإيقاف والإعادة');
  };

  if (!isOpen) return null;

  const elapsedSeconds = Math.floor(progress * SAMPLED_TRACK.durationSec);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-stone-900 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-stone-100 overflow-hidden">
        
        {/* Decorative Ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                نموذج البيانو العيني (Sample-based)
              </span>
              <h2 className="text-lg font-bold text-stone-100 mt-1">اختبار عينات البيانو الحقيقية</h2>
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
        <div className="my-6 p-5 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col items-center text-center relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600/30 via-stone-800 to-amber-600/30 flex items-center justify-center border border-emerald-500/30 shadow-inner mb-4 relative">
            <Music className={`w-8 h-8 text-emerald-400 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping pointer-events-none"></div>
            )}
          </div>

          <h3 className="text-xl font-bold text-stone-100 mb-1">{SAMPLED_TRACK.titleAr}</h3>
          <p className="text-sm text-stone-300 max-w-md leading-relaxed">{SAMPLED_TRACK.descriptionAr}</p>

          <div className="mt-3 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-emerald-300 font-mono">
            {statusMessage}
          </div>

          {/* Visualizer Wave Simulation */}
          <div className="w-full flex items-center justify-center gap-1 h-10 mt-4">
            {[...Array(24)].map((_, i) => {
              const heightFactor = isPlaying ? Math.sin((Date.now() / 140) + i) * 0.5 + 0.6 : 0.15;
              return (
                <div 
                  key={i} 
                  style={{ height: `${Math.max(15, heightFactor * 100)}%` }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${isPlaying ? 'bg-gradient-to-t from-emerald-500 to-amber-400' : 'bg-stone-700'}`}
                ></div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-stone-400 mb-1.5 font-mono">
              <span>0:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}</span>
              <span>0:{SAMPLED_TRACK.durationSec}</span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-200"
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
            disabled={isLoadingSamples}
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 shadow-lg transition-all transform active:scale-95 ${
              isLoadingSamples 
                ? 'bg-stone-700 text-stone-400 cursor-wait'
                : isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30' 
                  : 'bg-gradient-to-r from-emerald-500 to-amber-600 hover:from-emerald-400 hover:to-amber-500 text-stone-950 font-extrabold shadow-emerald-900/30'
            }`}
          >
            {isLoadingSamples ? (
              <span>جاري تحميل عينات الصوت...</span>
            ) : isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{progress > 0 ? 'استئناف العزف' : 'تحميل واستماع لعينات البيانو الحقيقي'}</span>
              </>
            )}
          </button>
        </div>

        {/* Technical & Licensing Notes */}
        <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800/80 text-xs text-stone-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>مميزات هذا الحل العيني الحقيقي:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-stone-300 pr-2">
            <li><strong>عينات أكوستيك حقيقية (Sample-based):</strong> تسجيلات صوتية حقيقية لبيانو كلاسيكي مرخصة CC0 من مصادر مفتوحة.</li>
            <li><strong>جودة استماع واقعية:</strong> القضاء التام على الصوت الرقمي للمذبذبات الرياضية.</li>
            <li><strong>تحميل لمرة واحدة:</strong> تخزين مؤقت في المتصفح للعمل بكفاءة عالية.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
