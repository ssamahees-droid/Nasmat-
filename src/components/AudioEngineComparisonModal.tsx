import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Sparkles, 
  Music, 
  CheckCircle2, 
  Volume2, 
  Activity, 
  Radio, 
  Layers, 
  HelpCircle,
  ArrowRightLeft,
  ThumbsUp,
  Sliders,
  Flame,
  Award
} from 'lucide-react';
import { 
  AudioComparisonEngine, 
  COMPARISON_DURATION_SEC, 
  MELODY_SEQUENCE 
} from '../utils/audioComparisonEngine';

interface AudioEngineComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioEngineComparisonModal: React.FC<AudioEngineComparisonModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [activeEngine, setActiveEngine] = useState<'oscillator' | 'sampled' | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [statusText, setStatusText] = useState('جاهز للمقارنة');
  const [samplesLoading, setSamplesLoading] = useState(false);
  const [userPreference, setUserPreference] = useState<'sampled' | 'oscillator' | null>(() => {
    return (localStorage.getItem('nesma_audio_pref') as 'sampled' | 'oscillator' | null) || null;
  });

  const engineRef = useRef<AudioComparisonEngine | null>(null);

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new AudioComparisonEngine(
        (p, s) => {
          setProgress(p);
          setElapsedSec(s);
        },
        (status) => setStatusText(status),
        () => {
          setActiveEngine(null);
          setProgress(1.0);
          setElapsedSec(COMPARISON_DURATION_SEC);
          setStatusText('انتهت العينة (15 ثانية)');
        }
      );
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  // Stop when closing
  useEffect(() => {
    if (!isOpen && engineRef.current) {
      engineRef.current.stop();
      setActiveEngine(null);
      setProgress(0);
      setElapsedSec(0);
    }
  }, [isOpen]);

  const handlePlayOscillator = () => {
    if (!engineRef.current) return;

    if (activeEngine === 'oscillator') {
      engineRef.current.stop();
      setActiveEngine(null);
      setStatusText('تم إيقاف محرك المذبذبات');
    } else {
      engineRef.current.playOscillatorEngine(0);
      setActiveEngine('oscillator');
      setStatusText('تشغيل عينة المذبذبات الحالية (15 ثانية)...');
    }
  };

  const handlePlaySampled = async () => {
    if (!engineRef.current) return;

    if (activeEngine === 'sampled') {
      engineRef.current.stop();
      setActiveEngine(null);
      setStatusText('تم إيقاف عينات البيانو الحقيقي');
    } else {
      setSamplesLoading(true);
      setStatusText('جاري تحضير عينات البيانو الأكوستيك الحقيقي...');
      await engineRef.current.playSampledEngine(0);
      setSamplesLoading(false);
      setActiveEngine('sampled');
      setStatusText('تشغيل عينة البيانو الحقيقي (15 ثانية)...');
    }
  };

  const handleQuickSwitch = async (target: 'oscillator' | 'sampled') => {
    if (!engineRef.current) return;
    const currentSecond = elapsedSec >= COMPARISON_DURATION_SEC ? 0 : elapsedSec;

    if (target === 'oscillator') {
      engineRef.current.playOscillatorEngine(currentSecond);
      setActiveEngine('oscillator');
      setStatusText(`التبديل إلى المذبذبات عند الثانية ${currentSecond.toFixed(1)}s`);
    } else {
      setSamplesLoading(true);
      await engineRef.current.playSampledEngine(currentSecond);
      setSamplesLoading(false);
      setActiveEngine('sampled');
      setStatusText(`التبديل إلى البيانو الحقيقي عند الثانية ${currentSecond.toFixed(1)}s`);
    }
  };

  const handleStopAll = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setActiveEngine(null);
    setProgress(0);
    setElapsedSec(0);
    setStatusText('تم الإيقاف وإعادة المؤشر إلى البداية (0:00)');
  };

  const handleVote = (choice: 'sampled' | 'oscillator') => {
    setUserPreference(choice);
    localStorage.setItem('nesma_audio_pref', choice);
  };

  if (!isOpen) return null;

  const currentNoteIndex = Math.min(
    MELODY_SEQUENCE.length - 1,
    Math.max(
      0,
      MELODY_SEQUENCE.findIndex((n, idx) => {
        const next = MELODY_SEQUENCE[idx + 1];
        return elapsedSec >= n.time && (!next || elapsedSec < next.time);
      })
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-5 md:p-8 text-stone-100 my-auto overflow-hidden">
        
        {/* Ambient Top Glows */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  اختبار مقارنة سمعية (A / B Testing)
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  عينة موحدة: 15 ثانية بالضبط
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-stone-100 mt-1">
                مقارنة واقعية الصوت: المذبذبات الحالية مقابل البيانو الحقيقي
              </h2>
            </div>
          </div>
          <button 
            onClick={() => {
              handleStopAll();
              onClose();
            }}
            className="p-2.5 text-stone-400 hover:text-white rounded-2xl hover:bg-stone-800 transition-colors"
            title="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Note Sequence Banner */}
        <div className="my-5 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>التتابع النغمي المشترك:</strong> مقام نهاوند (D Minor) — لحن شرقي دافئ ومتطابق نوتة بنوتة في كلا المحركين.
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
            {MELODY_SEQUENCE.map((item, idx) => (
              <span
                key={idx}
                className={`px-1.5 py-0.5 rounded transition-all duration-150 ${
                  activeEngine && idx === currentNoteIndex
                    ? 'bg-amber-500 text-stone-950 font-bold scale-110 shadow-sm'
                    : 'bg-stone-800/80 text-stone-400'
                }`}
              >
                {item.note}
              </span>
            ))}
          </div>
        </div>

        {/* Global Progress & Timeline Bar */}
        <div className="p-4 rounded-2xl bg-stone-950/50 border border-stone-800/80 mb-6">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="font-mono text-emerald-400 font-bold">
              00:{elapsedSec < 10 ? `0${Math.floor(elapsedSec)}` : Math.floor(elapsedSec)} / 00:{COMPARISON_DURATION_SEC}
            </span>
            <span className="text-xs text-stone-300 font-medium">{statusText}</span>
            <button
              onClick={handleStopAll}
              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة للصفر</span>
            </button>
          </div>

          <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-100 ${
                activeEngine === 'sampled'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/50'
                  : activeEngine === 'oscillator'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-amber-500/50'
                  : 'bg-stone-700'
              }`}
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>

          {/* Quick Real-Time Switcher during playback */}
          {activeEngine && (
            <div className="mt-3.5 flex items-center justify-center gap-3 pt-3 border-t border-stone-800/60">
              <span className="text-xs text-stone-400">التبديل اللحظي المباشر أثناء العزف:</span>
              <button
                onClick={() => handleQuickSwitch('oscillator')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeEngine === 'oscillator'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-2 ring-amber-500/20'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                تحويل إلى المذبذبات (A)
              </button>
              <button
                onClick={() => handleQuickSwitch('sampled')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeEngine === 'sampled'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ring-2 ring-emerald-500/20'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                تحويل إلى البيانو الحقيقي (B)
              </button>
            </div>
          )}
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          
          {/* Card A: Current Oscillator Engine */}
          <div className={`p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
            activeEngine === 'oscillator'
              ? 'bg-amber-950/20 border-amber-500/50 shadow-xl shadow-amber-950/30 ring-1 ring-amber-500/30'
              : 'bg-stone-950/40 border-stone-800 hover:border-stone-700'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  المحرك (أ) — المذبذبات الحالية
                </span>
                <span className="text-[11px] text-stone-400">توليف رقمي رياضي</span>
              </div>

              <h3 className="text-lg font-bold text-stone-100 mb-1">
                محرك التوليد الرقمي (Oscillators)
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                توليد النوتات عبر معادلات رياضية لموجات المثلث (<code className="text-amber-300 font-mono">Triangle</code>) والساين (<code className="text-amber-300 font-mono">Sine</code>) داخل المتصفح.
              </p>

              {/* Animated Wave Bars */}
              <div className="h-10 bg-stone-900/80 rounded-xl p-2 flex items-center justify-center gap-1 mb-4 border border-stone-800">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    style={{ 
                      height: activeEngine === 'oscillator' ? `${Math.max(20, (Math.sin(elapsedSec * 6 + i) + 1.2) * 40)}%` : '15%' 
                    }}
                    className={`w-1.5 rounded-full transition-all duration-100 ${
                      activeEngine === 'oscillator' ? 'bg-amber-400' : 'bg-stone-700'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Technical Specifications */}
              <ul className="text-[11px] text-stone-300 space-y-1.5 mb-5 border-t border-stone-800/80 pt-3">
                <li className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-amber-400">•</span>
                  <span><strong>نقرة المطرقة:</strong> غير موجودة (موجة ناعمة فورية).</span>
                </li>
                <li className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-amber-400">•</span>
                  <span><strong>التوافقيات:</strong> 3 موجات جيبية فقط (مسطحة).</span>
                </li>
                <li className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-amber-400">•</span>
                  <span><strong>رنين الخشب:</strong> غائب تماماً (صوت جاف شبيه بألعاب الفيديو القديمة).</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handlePlayOscillator}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                activeEngine === 'oscillator'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30 ring-2 ring-amber-400/40'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30'
              }`}
            >
              {activeEngine === 'oscillator' ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>إيقاف المذبذبات</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>استماع لعينة المذبذبات (15 ثانية)</span>
                </>
              )}
            </button>
          </div>

          {/* Card B: Real Sampled Acoustic Grand Piano */}
          <div className={`p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
            activeEngine === 'sampled'
              ? 'bg-emerald-950/20 border-emerald-500/50 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/30'
              : 'bg-stone-950/40 border-stone-800 hover:border-stone-700'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  المحرك (ب) — البيانو الحقيقي المسجل
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  واقعي 100%
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-100 mb-1">
                عينات بيانو كلاسيكي أصلية (Sampled)
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                تسجيلات استوديو حقيقية لأوتار ومطرقة بيانو صوتي حقيقي (مرخصة <code className="text-emerald-300 font-mono">CC0 Public Domain</code> مجاناً).
              </p>

              {/* Animated Wave Bars */}
              <div className="h-10 bg-stone-900/80 rounded-xl p-2 flex items-center justify-center gap-1 mb-4 border border-stone-800">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    style={{ 
                      height: activeEngine === 'sampled' ? `${Math.max(25, (Math.sin(elapsedSec * 8 + i * 1.5) + 1.3) * 45)}%` : '15%' 
                    }}
                    className={`w-1.5 rounded-full transition-all duration-100 ${
                      activeEngine === 'sampled' ? 'bg-gradient-to-t from-emerald-500 to-teal-300' : 'bg-stone-700'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Technical Specifications */}
              <ul className="text-[11px] text-stone-300 space-y-1.5 mb-5 border-t border-stone-800/80 pt-3">
                <li className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-emerald-400">•</span>
                  <span><strong>نقرة المطرقة:</strong> حقيقية بدقة (Physical Felt Hammer Attack).</span>
                </li>
                <li className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-emerald-400">•</span>
                  <span><strong>التوافقيات:</strong> طيف توافقي غني وديناميكي كامل.</span>
                </li>
                <li className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-emerald-400">•</span>
                  <span><strong>رنين الخشب:</strong> صدى الصندوق الصوتي وامتداد طبيعي (Natural Decay).</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handlePlaySampled}
              disabled={samplesLoading}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                activeEngine === 'sampled'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 ring-2 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black'
              }`}
            >
              {samplesLoading ? (
                <span>جاري تحميل العينات الصوتية...</span>
              ) : activeEngine === 'sampled' ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>إيقاف البيانو الحقيقي</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>استماع لعينة البيانو الحقيقي (15 ثانية)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Diagnostic Comparison Table */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 mb-6 text-xs text-stone-300">
          <h4 className="font-bold text-stone-200 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>جدول الفروق السمعية العملية بين الخيارين:</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 text-[11px]">
                  <th className="py-2 px-3">المعيار الفني</th>
                  <th className="py-2 px-3 text-amber-400">المحرك الحالي (المذبذبات)</th>
                  <th className="py-2 px-3 text-emerald-400">المحرك المقترح (البيانو الحقيقي)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-300">الدفء والراحة النفسية</td>
                  <td className="py-2 px-3 text-stone-400">جاف ورقمي يسبب إجهادًا سمعيًا سريعًا</td>
                  <td className="py-2 px-3 text-emerald-300 font-medium">مريح وعضوي يساعد على الاسترخاء والتهدئة</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-300">الواقعية والعمق</td>
                  <td className="py-2 px-3 text-stone-400">أقرب إلى نغمات الهاتف أو صندوق الموسيقى الآلي</td>
                  <td className="py-2 px-3 text-emerald-300 font-medium">صوت بيانو كلاسيكي سيمفوني حقيقي في استوديو</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-300">الحجم والأداء</td>
                  <td className="py-2 px-3 text-stone-400">صفر كيلوبايت (توليف فوري)</td>
                  <td className="py-2 px-3 text-emerald-300 font-medium">~1 ميغابايت لمرة واحدة ثم يعمل دون اتصال بالإنترنت</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-stone-300">الترخيص والمصدر</td>
                  <td className="py-2 px-3 text-stone-400">كود برمجي داخلي</td>
                  <td className="py-2 px-3 text-emerald-300 font-medium">نطاق عام مجاني ومفتوح بالكامل (CC0 / Public Domain)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Voting / Decision Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-300">
            <p className="font-bold text-stone-100 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-amber-400" />
              <span>ما هو تقييمكم بعد الاستماع لكلا العينتين؟</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              اختياركم سيحدد ما إذا كنا سنعتمد عينات البيانو الحقيقية للصالون بالكامل أم نبقي على المذبذبات.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote('sampled')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                userPreference === 'sampled'
                  ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-300'
                  : 'bg-stone-800 text-emerald-300 hover:bg-stone-700 border border-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>أفضّل البيانو الحقيقي (معتمد)</span>
            </button>

            <button
              onClick={() => handleVote('oscillator')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                userPreference === 'oscillator'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              <span>أفضّل المذبذبات</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
