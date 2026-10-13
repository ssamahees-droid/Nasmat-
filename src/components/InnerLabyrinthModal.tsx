import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Wind, 
  Heart, 
  Volume2, 
  VolumeX, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

interface LabyrinthNode {
  id: number;
  x: number; // percent
  y: number; // percent
  title: string;
  isStressNode?: boolean;
  stressTitle?: string;
  stressDesc?: string;
  cleared: boolean;
}

const INITIAL_NODES: LabyrinthNode[] = [
  { id: 0, x: 10, y: 50, title: 'بوابة البداية والنية الهادئة', cleared: true },
  { id: 1, x: 25, y: 25, title: 'ممر السكون الأول', cleared: false },
  { 
    id: 2, 
    x: 40, 
    y: 30, 
    title: 'بؤرة زحام الأفكار والمهام', 
    isStressNode: true, 
    stressTitle: '🌪️ بؤرة زحام الأفكار', 
    stressDesc: 'عقلك يركض في عدة اتجاهات في نفس اللحظة.. أوقف الحركة وخذ نفساً عميقاً لإعادة الاتصال بجسدك.',
    cleared: false 
  },
  { id: 3, x: 55, y: 18, title: 'رواق الأمان الداخلي', cleared: false },
  { id: 4, x: 75, y: 35, title: 'منعطف التخلي والراحة', cleared: false },
  { 
    id: 5, 
    x: 65, 
    y: 65, 
    title: 'بؤرة تسارع النبض والقلق', 
    isStressNode: true, 
    stressTitle: '⚡ بؤرة التوتر الجسدي', 
    stressDesc: 'عضلات كتفيك مشدودة وتنفسك سطحي.. خفف قبضة يدك وتنفس ببطء ليسترخي جهازك العصبي.',
    cleared: false 
  },
  { id: 6, x: 45, y: 75, title: 'ممشى الرحمة والسكينة', cleared: false },
  { 
    id: 7, 
    x: 30, 
    y: 70, 
    title: 'بؤرة تأنيب الضمير واللوم', 
    isStressNode: true, 
    stressTitle: '🌧️ بؤرة جلد الذات', 
    stressDesc: 'صوت داخلي قاسي يلومك على ما فات.. استقبل هذا الشعور بلطف وازفر اللوم مع النفس الأخير.',
    cleared: false 
  },
  { id: 8, x: 50, y: 50, title: 'مركز السلام الداخلي وبر الأمان', cleared: false }
];

export const InnerLabyrinthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [nodes, setNodes] = useState<LabyrinthNode[]>(INITIAL_NODES);
  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(10);
  const [isCenterReached, setIsCenterReached] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initLabyrinth = () => {
    setNodes(INITIAL_NODES.map(n => ({ ...n, cleared: n.id === 0 })));
    setCurrentNodeIdx(0);
    setIsBreathingActive(false);
    setIsCenterReached(false);
    setBreathCountdown(10);
  };

  useEffect(() => {
    if (isOpen) {
      initLabyrinth();
      setIsMuted(chimeService.isMuted());
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentNode = nodes[currentNodeIdx];
  const nextNode = nodes[currentNodeIdx + 1];

  // Advance orb to next node
  const handleAdvanceOrb = () => {
    if (!nextNode) return;

    if (nextNode.isStressNode && !nextNode.cleared) {
      // Trigger 10-second breath ritual
      startBreathRitual();
    } else {
      // Normal advance
      chimeService.playBubblePopChime();
      const updated = nodes.map(n => n.id === nextNode.id ? { ...n, cleared: true } : n);
      setNodes(updated);
      setCurrentNodeIdx(nextNode.id);

      if (nextNode.id === 8) {
        chimeService.playSuccessChime();
        setIsCenterReached(true);
      }
    }
  };

  const startBreathRitual = () => {
    setIsBreathingActive(true);
    setBreathCountdown(10);
    setBreathPhase('inhale');
    chimeService.playBreathCue('inhale');

    let seconds = 10;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      seconds -= 1;
      setBreathCountdown(seconds);

      if (seconds > 6) {
        setBreathPhase('inhale');
      } else if (seconds > 4) {
        setBreathPhase('hold');
      } else if (seconds > 0) {
        setBreathPhase('exhale');
        if (seconds === 4) chimeService.playBreathCue('exhale');
      } else {
        // Finished 10s
        if (timerRef.current) clearInterval(timerRef.current);
        chimeService.playFlowerBloomChime();
        setIsBreathingActive(false);

        // Clear stress node and advance
        const targetNode = nodes[currentNodeIdx + 1];
        if (targetNode) {
          const updated = nodes.map(n => n.id === targetNode.id ? { ...n, cleared: true } : n);
          setNodes(updated);
          setCurrentNodeIdx(targetNode.id);

          if (targetNode.id === 8) {
            chimeService.playSuccessChime();
            setIsCenterReached(true);
          }
        }
      }
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0C1510] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-teal-950/40">
              🌀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «متاهة الهدوء التفاعلية»
                </h2>
                <span className="text-[11px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  رحلة تأملية وتفريغ التوتر بالتنفس
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                حرّك كرة النور عبر المتاهة، وعند كل بقعة توتر تنفس بعمق لتتلاشى العوائق ويضيء مسار السلام 🕊️
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = chimeService.toggleMute();
                setIsMuted(next);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={initLabyrinth}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة بدء المتاهة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Labyrinth Visual Canvas */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] bg-radial from-[#122218] via-[#0B150F] to-[#070E0A] rounded-3xl border border-emerald-500/20 overflow-hidden my-3 p-4 flex flex-col justify-between">
          
          {/* Subtle Sacred Geometry Concentric Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-80 h-80 rounded-full border border-emerald-400/40 animate-pulse" />
            <div className="w-56 h-56 rounded-full border border-emerald-400/30 absolute" />
            <div className="w-32 h-32 rounded-full border border-teal-300/40 absolute" />
          </div>

          {/* SVG Labyrinth Connecting Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node, i) => {
              const next = nodes[i + 1];
              if (!next) return null;
              const isPathActive = node.cleared && next.cleared;
              return (
                <line
                  key={`line_${node.id}_${next.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke={isPathActive ? '#10B981' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isPathActive ? '4' : '2'}
                  strokeDasharray={isPathActive ? 'none' : '4 4'}
                  className="transition-all duration-700"
                />
              );
            })}
          </svg>

          {/* Nodes Render */}
          {nodes.map((node) => {
            const isCurrent = currentNodeIdx === node.id;
            const isNext = currentNodeIdx + 1 === node.id;
            const isCenter = node.id === 8;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                onClick={() => {
                  if (isNext) handleAdvanceOrb();
                }}
              >
                {/* Node Orb */}
                <div 
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-300 to-emerald-400 text-black border-white shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-125 animate-pulse'
                      : isCenter
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-lg'
                      : node.cleared
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-400/80 shadow-md'
                      : node.isStressNode
                      ? 'bg-rose-950/70 text-rose-300 border-rose-500/60 animate-bounce'
                      : 'bg-stone-900 text-stone-500 border-white/20'
                  }`}
                >
                  {isCurrent ? '🌟' : isCenter ? '🕊️' : node.isStressNode ? '🌪️' : node.cleared ? '✨' : '⚪'}
                </div>

                {/* Node Label Tooltip */}
                <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-bold whitespace-nowrap backdrop-blur-md border ${
                  isCurrent
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400/50'
                    : 'bg-black/60 text-stone-400 border-white/10 opacity-70'
                }`}>
                  {node.title}
                </span>
              </div>
            );
          })}

          {/* Center Reached Victory Overlay */}
          {isCenterReached && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-md animate-fade-in space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-4xl shadow-xl shadow-emerald-950/60 animate-pulse">
                🕊️
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-tajawal">
                وصلت إلى مركز السلام الداخلي بنجاح 🤍
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md leading-relaxed">
                تجاوزت عواصف التفكير بالأنفاس الواعية ووصلت إلى النقطة الثابتة داخل نفسك التي لا تهزها الرياح. هذا السلام حقك في أي وقت من يومك.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={initLabyrinth}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تكرار المسار التأملي</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  العودة للمنصة 🌿
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Breathing Ritual Overlay Drawer */}
        {isBreathingActive && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/90 via-emerald-950/90 to-cyan-950/90 border border-teal-400/50 shadow-2xl flex flex-col items-center text-center space-y-3 shrink-0 animate-fade-in">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-black">
              <Wind className="w-4 h-4 animate-spin duration-1000" />
              <span>تمرين تنفس واعي لإذابة بقعة التوتر (١٠ ثوانٍ)</span>
            </div>

            {/* Breathing Animation Halo */}
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                  breathPhase === 'inhale' 
                    ? 'border-emerald-400 scale-125 bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.6)]' 
                    : breathPhase === 'hold'
                    ? 'border-cyan-400 scale-125 bg-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                    : 'border-teal-400 scale-90 bg-teal-500/10'
                }`}
              >
                <span className="text-xl font-black text-white">{breathCountdown}s</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-white">
                {breathPhase === 'inhale' && 'شهيق عميق من الأنف.. املأ رئتيك بهدوء 🌿'}
                {breathPhase === 'hold' && 'احبس الهواء بلطف.. استشعر سكونك الداخلي ✨'}
                {breathPhase === 'exhale' && 'زفير بطيء من الفم.. حرر كل شد وثقل 💨'}
              </h4>
              <p className="text-[11px] text-stone-300">
                بقعة التوتر تتلاشى تدريجياً مع أنفاسك..
              </p>
            </div>
          </div>
        )}

        {/* Next Step Control Toolbar */}
        {!isBreathingActive && !isCenterReached && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shrink-0">
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400 font-bold block">الموقع الحالي:</span>
              <span className="text-xs font-black text-emerald-300">{currentNode.title}</span>
            </div>

            <button
              onClick={handleAdvanceOrb}
              disabled={!nextNode}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40"
            >
              <span>{nextNode?.isStressNode ? 'مواجهة العائق بالتنفس 🌪️' : 'التقدم للخطوة التالية 🌟'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
