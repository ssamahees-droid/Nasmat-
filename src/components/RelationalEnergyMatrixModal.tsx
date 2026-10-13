import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Shield, 
  Heart, 
  Copy, 
  Check, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Award,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Sun,
  Flame,
  Zap
} from 'lucide-react';
import { chimeService } from '../services/chimeService';
import { storage } from '../services/storage';

interface RelationalNode {
  id: string;
  name: string;
  category: string;
  emoji: string;
  orbit: 'close' | 'middle' | 'outer'; // 1, 2, 3
  impact: 'nourishing' | 'neutral' | 'draining';
  hasShield: boolean;
}

const INITIAL_NODES: RelationalNode[] = [
  {
    id: 'rel_family',
    name: 'الأسرة والبيت',
    category: 'عائلة',
    emoji: '🏡',
    orbit: 'close',
    impact: 'nourishing',
    hasShield: false
  },
  {
    id: 'rel_friends',
    name: 'الأصدقاء المقربون الداعمون',
    category: 'صداقة',
    emoji: '🤝',
    orbit: 'close',
    impact: 'nourishing',
    hasShield: false
  },
  {
    id: 'rel_work',
    name: 'بيئة العمل والزملاء',
    category: 'عمل',
    emoji: '💼',
    orbit: 'middle',
    impact: 'neutral',
    hasShield: true
  },
  {
    id: 'rel_demanding',
    name: 'علاقات كثيرة المتطلبات والانتقاد',
    category: 'علاقات ضاغطة',
    emoji: '⚡',
    orbit: 'outer',
    impact: 'draining',
    hasShield: true
  },
  {
    id: 'rel_social_media',
    name: 'السوشيال ميديا ومتابعة الناس',
    category: 'عالم رقمي',
    emoji: '📱',
    orbit: 'middle',
    impact: 'draining',
    hasShield: false
  }
];

export const RelationalEnergyMatrixModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [nodes, setNodes] = useState<RelationalNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(INITIAL_NODES[0].id);
  const [showReport, setShowReport] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());

  useEffect(() => {
    if (isOpen) {
      setNodes(INITIAL_NODES);
      setSelectedNodeId(INITIAL_NODES[0].id);
      setShowReport(false);
      setIsMuted(chimeService.isMuted());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleUpdateOrbit = (id: string, orbit: 'close' | 'middle' | 'outer') => {
    const distNum = orbit === 'close' ? 100 : orbit === 'middle' ? 200 : 300;
    chimeService.playOrbitAdjustChime(distNum);
    setNodes(prev => prev.map(n => n.id === id ? { ...n, orbit } : n));
  };

  const handleUpdateImpact = (id: string, impact: 'nourishing' | 'neutral' | 'draining') => {
    chimeService.playBubblePopChime();
    setNodes(prev => prev.map(n => n.id === id ? { ...n, impact } : n));
  };

  const handleToggleShield = (id: string) => {
    chimeService.playStoneDropChime();
    setNodes(prev => prev.map(n => n.id === id ? { ...n, hasShield: !n.hasShield } : n));
  };

  // Compute metrics
  const nourishingCount = nodes.filter(n => n.impact === 'nourishing').length;
  const drainingCount = nodes.filter(n => n.impact === 'draining').length;
  const unshieldedDraining = nodes.filter(n => n.impact === 'draining' && !n.hasShield && n.orbit !== 'outer').length;

  const equilibriumScore = Math.max(10, Math.min(100, Math.round(
    100 - (unshieldedDraining * 25) - (drainingCount * 10) + (nourishingCount * 15)
  )));

  const handleCopyReport = () => {
    const reportText = `تقرير خريطة طاقة الروابط — تطبيق نسمة حياة 🪐\n\n• مؤشر حماية الطاقة: ${equilibriumScore}%\n• الروابط المغذية: ${nourishingCount}\n• الروابط المستنزفة: ${drainingCount}\n\n«حماية طاقتك تبدأ بوضع المسافات الصحيحة والأسوار الرحيمة حول ذاتك 🛡️»`;
    navigator.clipboard.writeText(reportText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleSaveToJournal = () => {
    storage.addThoughtPost({
      title: `خريطة طاقة الروابط والحدود (${equilibriumScore}%)`,
      content: `تقرير فحص العلاقات والحدود الشخصية.\nمؤشر الاتزان: ${equilibriumScore}%\nالروابط المغذية: ${nourishingCount}\nالمستنزفة المحمية بسياج: ${nodes.filter(n => n.impact === 'draining' && n.hasShield).length}`,
      category: 'gentleness',
      mood: 'good',
      promptUsed: 'تحليل ميزانية الطاقة في شبكة العلاقات',
      isFavorite: true
    });
    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0C1511] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-950/40">
              🪐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «حصاد طاقة الروابط»
                </h2>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  محاكاة كوكبية لميزانية العلاقات
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                اضبط مدارات الأشخاص حول ذاتك، وحصّن العلاقات المستنزفة بأسوار حدودية لتحفظ سلامك 🛡️
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
              onClick={() => setNodes(INITIAL_NODES)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="إعادة ضبط المدارات"
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

        {/* Energy Status Bar */}
        <div className="py-2 px-4 my-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-stone-300">
              مؤشر حماية طاقتك: <strong className="text-emerald-400 font-black text-sm">{equilibriumScore}%</strong>
            </span>
            <span className="text-stone-400 hidden sm:inline">
              روابط مغذية: <strong className="text-amber-300">{nourishingCount}</strong> · مستنزفة: <strong className="text-rose-400">{drainingCount}</strong>
            </span>
          </div>

          <button
            onClick={() => setShowReport(!showReport)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            {showReport ? 'العودة للمحاكاة 🪐' : 'عرض تقرير الخريطة 📊'}
          </button>
        </div>

        {showReport ? (
          /* Report View */
          <div className="flex-1 py-3 overflow-y-auto space-y-4 animate-fade-in">
            <div className="p-5 rounded-3xl bg-radial from-[#15271E] via-[#0E1A14] to-[#0A100C] border border-emerald-500/30 text-center space-y-2">
              <span className="text-3xl">🛡️🪐</span>
              <h3 className="text-base font-black text-white">تقرير خريطة طاقة الروابط</h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                {equilibriumScore >= 75
                  ? 'توزيع مداراتك متزن وواعٍ؛ وضعت حدوداً آمنة تمنع الاستنزاف وتحفظ للمقربين مكانتهم الدافئة.'
                  : 'هناك تسرب في طاقتك بسبب علاقات مستنزفة متواجدة في المدار القريب دون سور حماية حدودي.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nodes.map(node => (
                <div key={node.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>{node.emoji}</span>
                      <span>{node.name}</span>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      node.impact === 'nourishing'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : node.impact === 'neutral'
                        ? 'bg-stone-500/20 text-stone-300 border-stone-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {node.impact === 'nourishing' ? 'مغذي ☀️' : node.impact === 'neutral' ? 'محايد ⚖️' : 'مستنزف 🌪️'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    المدار: {node.orbit === 'close' ? 'القريب' : node.orbit === 'middle' ? 'المتوسط' : 'الخارجي'} · {node.hasShield ? 'محمي بسور حدودي 🛡️' : 'مفتوح دون حماية'}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={handleCopyReport}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSuccess ? 'تم النسخ!' : 'نسخ التقرير'}</span>
              </button>

              <button
                onClick={handleSaveToJournal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
              >
                {savedJournalSuccess ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <BookOpen className="w-3.5 h-3.5" />}
                <span>{savedJournalSuccess ? 'حُفظ في الدفتر 🌿' : 'حفظ في دفتري'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Planetary Orbital Canvas */
          <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-[380px]">
            
            {/* Visual Orbit Map */}
            <div className="relative flex-1 bg-gradient-to-b from-[#111F18] via-[#0B1510] to-[#060D0A] rounded-3xl border border-emerald-500/20 p-4 flex items-center justify-center overflow-hidden min-h-[260px]">
              
              {/* Concentric Gravitational Orbit Rings */}
              {/* Outer Orbit (300px) */}
              <div className="absolute w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-emerald-500/20 flex items-center justify-center pointer-events-none">
                <span className="absolute top-1 text-[9px] text-stone-500 font-bold">المدار الخارجي (حدود وقائية)</span>
              </div>

              {/* Middle Orbit (200px) */}
              <div className="absolute w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] rounded-full border border-dashed border-emerald-500/30 flex items-center justify-center pointer-events-none">
                <span className="absolute top-1 text-[9px] text-stone-500 font-bold">المدار المتوسط (زمالة)</span>
              </div>

              {/* Close Orbit (110px) */}
              <div className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border border-emerald-400/40 flex items-center justify-center pointer-events-none">
                <span className="absolute top-1 text-[9px] text-stone-400 font-bold">المدار القريب</span>
              </div>

              {/* Center Self Sun / Core */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 text-black flex flex-col items-center justify-center text-xs font-black shadow-[0_0_25px_rgba(250,204,21,0.7)] animate-pulse">
                <span>☀️</span>
                <span className="text-[9px] font-black">الذات</span>
              </div>

              {/* Orbiting Relationship Nodes */}
              {nodes.map((node, idx) => {
                const isSelected = node.id === selectedNodeId;
                
                // Calculate position on circumference based on orbit
                const radius = node.orbit === 'close' ? 55 : node.orbit === 'middle' ? 100 : 145;
                const angle = (idx * (360 / nodes.length)) * (Math.PI / 180);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`
                    }}
                    className={`absolute z-20 p-1.5 rounded-full transition-all duration-500 flex items-center gap-1 cursor-pointer border-2 shadow-lg ${
                      isSelected
                        ? 'scale-125 z-30 border-white bg-white/20 shadow-white/50 ring-2 ring-emerald-400'
                        : 'scale-100 bg-stone-900/90 border-white/20 hover:scale-110'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{node.emoji}</span>
                    {node.hasShield && (
                      <span className="text-[10px] text-emerald-400 font-black">🛡️</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Node Control Panel */}
            <div className="w-full md:w-72 p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between shrink-0 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedNode.emoji}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">{selectedNode.name}</h4>
                      <span className="text-[10px] text-stone-400">{selectedNode.category}</span>
                    </div>
                  </div>
                </div>

                {/* Orbit Distance Selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-300 block">المسافة والمدار:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'close', label: 'قريب جداً' },
                      { id: 'middle', label: 'متوسط' },
                      { id: 'outer', label: 'حدود بعيدة' }
                    ].map(orb => (
                      <button
                        key={orb.id}
                        onClick={() => handleUpdateOrbit(selectedNode.id, orb.id as any)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedNode.orbit === orb.id
                            ? 'bg-emerald-500 text-black border-emerald-400'
                            : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                        }`}
                      >
                        {orb.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Impact Type Selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-300 block">نوع الأثر الطاقي:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'nourishing', label: 'مغذي ☀️' },
                      { id: 'neutral', label: 'محايد ⚖️' },
                      { id: 'draining', label: 'مستنزف 🌪️' }
                    ].map(imp => (
                      <button
                        key={imp.id}
                        onClick={() => handleUpdateImpact(selectedNode.id, imp.id as any)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          selectedNode.impact === imp.id
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                        }`}
                      >
                        {imp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shield Toggle */}
                <div className="pt-1">
                  <button
                    onClick={() => handleToggleShield(selectedNode.id)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedNode.hasShield
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>سور الحماية والحدود 🛡️</span>
                    <span>{selectedNode.hasShield ? 'مفعّل ✅' : 'غير مفعّل'}</span>
                  </button>
                </div>
              </div>

              {/* Educational Context Note */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-stone-400 leading-relaxed">
                «الحدود ليست مقاطعة للشخص، بل هي السور الذي يحفظ طاقتك لتعامله بأفضل ما عندك دون احتراق داخلي.»
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
