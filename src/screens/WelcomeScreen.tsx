import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  RotateCw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  X, 
  Leaf, 
  ShieldCheck, 
  Heart,
  Compass
} from 'lucide-react';
import { TEN_SCREENS, TenScreenItem } from '../constants/tenScreens';
import { chimeService } from '../services/chimeService';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip?: () => void;
  onOpenAbout?: () => void;
  onNavigate?: (tab: string) => void;
}

// Mood triggers that rotate the wheel to a tailored destination
const MOOD_SHORTCUTS = [
  { label: 'متوتر وعاوز أهدى', emoji: '🌊', targetId: 'breathe' },
  { label: 'أفكاري زحمة ومخنوق', emoji: '🎈', targetId: 'games' },
  { label: 'عاوز أفهم نفسي', emoji: '🪞', targetId: 'self-discovery' },
  { label: 'محتاج بداية هادية', emoji: '🧭', targetId: 'start' },
  { label: 'في لحظة طارئة وصعبة', emoji: '🛡️', targetId: 'rescue' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart, 
  onSkip, 
  onNavigate 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 corresponds to HomeScreen (١)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(() => chimeService.isMuted());
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [needleBumping, setNeedleBumping] = useState(false);

  const numSlices = TEN_SCREENS.length; // 10 screens
  const sliceAngle = 360 / numSlices; // 36 degrees per slice
  const tickTimersRef = useRef<NodeJS.Timeout[]>([]);

  const activeScreen: TenScreenItem = TEN_SCREENS[selectedIndex] || TEN_SCREENS[0];

  useEffect(() => {
    return () => {
      tickTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const toggleSound = () => {
    const next = chimeService.toggleMute();
    setIsMuted(next);
  };

  const handleNavigateToScreen = (screenId: string) => {
    chimeService.playReassuranceChime();
    if (onNavigate) {
      onNavigate(screenId);
    } else {
      onStart();
    }
  };

  /**
   * Rotates the wheel to a specific slice index smoothly with deceleration
   */
  const rotateToIndex = (targetIndex: number, extraSpins = 4) => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Calculate target angle so pointer at top (270 deg or 0 deg offset) points to target slice
    // Pointer is located at top (0 degrees).
    // Target slice center needs to align with 0 deg.
    const targetSliceCenter = targetIndex * sliceAngle;
    const currentNormalized = ((rotationAngle % 360) + 360) % 360;
    
    // We want: (targetAngle + targetSliceCenter) % 360 === 0
    // => targetAngle = 360 - targetSliceCenter
    const desiredNormalized = (360 - targetSliceCenter) % 360;
    let delta = desiredNormalized - currentNormalized;
    if (delta <= 0) delta += 360;

    const totalRotation = rotationAngle + delta + (extraSpins * 360);
    const spinDuration = 3200; // ms

    // Schedule audio ticks as wheel passes slices
    tickTimersRef.current.forEach(clearTimeout);
    tickTimersRef.current = [];

    let delay = 0;
    let interval = 70;
    const factor = 1.10;

    while (delay + interval < spinDuration - 200) {
      delay += interval;
      interval *= factor;
      const t = setTimeout(() => {
        chimeService.playWheelTickSound(0.9 + Math.random() * 0.2);
        setNeedleBumping(true);
        setTimeout(() => setNeedleBumping(false), 60);
      }, delay);
      tickTimersRef.current.push(t);
    }

    setRotationAngle(totalRotation);

    setTimeout(() => {
      setSelectedIndex(targetIndex);
      setIsSpinning(false);
      chimeService.playWheelWinSound();
    }, spinDuration);
  };

  // Random spin
  const handleRandomSpin = () => {
    if (isSpinning) return;
    // Pick a random target index different from current
    let nextIndex = Math.floor(Math.random() * numSlices);
    if (nextIndex === selectedIndex) {
      nextIndex = (nextIndex + 1) % numSlices;
    }
    rotateToIndex(nextIndex, 5);
  };

  // Step prev / next slice manually
  const handleStep = (direction: 'next' | 'prev') => {
    if (isSpinning) return;
    const nextIdx = direction === 'next' 
      ? (selectedIndex + 1) % numSlices 
      : (selectedIndex - 1 + numSlices) % numSlices;
    rotateToIndex(nextIdx, 1);
  };

  // Color palettes for the 10 slices
  const sliceColors = [
    { fill: '#10B981', darkFill: '#0D4B37', text: '#FFFFFF', num: '١' }, // 1 Home
    { fill: '#14B8A6', darkFill: '#0C443E', text: '#FFFFFF', num: '٢' }, // 2 Start
    { fill: '#0EA5E9', darkFill: '#093E58', text: '#FFFFFF', num: '٣' }, // 3 Breathe
    { fill: '#8B5CF6', darkFill: '#381E6D', text: '#FFFFFF', num: '٤' }, // 4 Self Discovery
    { fill: '#6366F1', darkFill: '#22285E', text: '#FFFFFF', num: '٥' }, // 5 Explore
    { fill: '#EC4899', darkFill: '#5E1B3E', text: '#FFFFFF', num: '٦' }, // 6 Games
    { fill: '#F59E0B', darkFill: '#5C3806', text: '#FFFFFF', num: '٧' }, // 7 Practice
    { fill: '#10B981', darkFill: '#0E4432', text: '#FFFFFF', num: '٨' }, // 8 Journey
    { fill: '#F43F5E', darkFill: '#5C1422', text: '#FFFFFF', num: '٩' }, // 9 Rescue
    { fill: '#0D9488', darkFill: '#0A3B37', text: '#FFFFFF', num: '١٠' } // 10 Support
  ];

  // SVG parameters for rotary wheel
  const wheelRadius = 150;
  const viewBoxSize = 340;
  const center = viewBoxSize / 2;

  // Generate SVG path for a circular pie slice
  const generateSlicePath = (index: number) => {
    const startAngleDeg = index * sliceAngle - sliceAngle / 2 - 90;
    const endAngleDeg = (index + 1) * sliceAngle - sliceAngle / 2 - 90;

    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;

    const x1 = center + wheelRadius * Math.cos(startRad);
    const y1 = center + wheelRadius * Math.sin(startRad);
    const x2 = center + wheelRadius * Math.cos(endRad);
    const y2 = center + wheelRadius * Math.sin(endRad);

    return `M ${center} ${center} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09120D] via-[#0E1A14] to-[#070D0A] text-[#EDE8DF] flex flex-col justify-between p-3 sm:p-6 font-tajawal antialiased text-right selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      
      {/* Ambient background aura (subtle, tranquil, optimized) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pt-1 pb-3 text-xs z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-1 flex items-center justify-center">
            <img src="/logo.jpg" alt="شعار نسمة حياة" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm tracking-tight leading-tight">نسمة حياة</h1>
            <p className="text-[10px] text-emerald-300/80 font-medium">مبادرة الاسترخاء والدعم النفسي</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'تشغيل المؤثرات الصوتية الهادئة' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">عن المبادرة</span>
          </button>

          <button
            onClick={() => handleNavigateToScreen('home')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all cursor-pointer text-xs flex items-center gap-1"
          >
            <span>تخطي للرئيسية</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Main Rotary Centerpiece */}
      <main className="max-w-xl mx-auto w-full my-auto flex flex-col items-center text-center space-y-4 py-2 z-10">
        
        {/* Poetic Greeting & Instructions */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>عجلة نسمة حياة الدوارة السحرية 🎡</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            أهلاً بك.. اختر واحتك المفضلة اليوم
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            أدِر العجلة لاكتشاف محطتك المناسبة، أو اضغط على ما تشعر به ليقودك التطبيق لوجهتك:
          </p>
        </div>

        {/* Quick Mood Direction Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto px-1">
          {MOOD_SHORTCUTS.map((mood) => {
            const targetIndex = TEN_SCREENS.findIndex(s => s.id === mood.targetId);
            return (
              <button
                key={mood.targetId}
                onClick={() => {
                  if (targetIndex !== -1) {
                    rotateToIndex(targetIndex, 2);
                  }
                }}
                disabled={isSpinning}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-stone-200 hover:text-emerald-200 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1"
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Rotary Wheel Area */}
        <div className="relative flex flex-col items-center justify-center my-2">
          
          {/* Top Pointer Needle with tactile bump */}
          <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none">
            <div className={`w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)] transition-transform duration-75 ${needleBumping ? '-rotate-12 scale-110' : 'rotate-0'}`} />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-amber-500 shadow-sm -mt-1" />
          </div>

          {/* SVG Rotating Wheel */}
          <div className="relative p-2 rounded-full border-4 border-emerald-500/30 bg-[#0B1510] shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <svg
              width={viewBoxSize}
              height={viewBoxSize}
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] max-w-full drop-shadow-xl"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning 
                  ? 'transform 3.2s cubic-bezier(0.18, 0.89, 0.32, 1.05)' 
                  : 'transform 0.4s ease-out'
              }}
            >
              <defs>
                <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1B342A" />
                  <stop offset="100%" stopColor="#0B1712" />
                </radialGradient>
              </defs>

              {/* Outer Golden/Emerald Rim */}
              <circle
                cx={center}
                cy={center}
                r={wheelRadius + 4}
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeOpacity="0.4"
                strokeDasharray="4 6"
              />

              {/* 10 Slices */}
              {TEN_SCREENS.map((screen, index) => {
                const color = sliceColors[index] || sliceColors[0];
                const isSelected = selectedIndex === index;

                // Angle to position slice text / icon
                const midAngleDeg = index * sliceAngle - 90;
                const midRad = (midAngleDeg * Math.PI) / 180;
                const textDistance = wheelRadius * 0.72;
                const tx = center + textDistance * Math.cos(midRad);
                const ty = center + textDistance * Math.sin(midRad);

                return (
                  <g 
                    key={screen.id} 
                    onClick={() => rotateToIndex(index, 2)}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                  >
                    <path
                      d={generateSlicePath(index)}
                      fill={color.darkFill}
                      stroke="#142B21"
                      strokeWidth="2"
                    />

                    {/* Arabic Number & Screen Emoji inside slice */}
                    <g transform={`translate(${tx}, ${ty}) rotate(${midAngleDeg + 90})`}>
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        fontSize="14"
                        fontWeight="bold"
                        className="font-tajawal pointer-events-none select-none"
                      >
                        {screen.emoji}
                      </text>
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#A9C5A0"
                        fontSize="10"
                        fontWeight="800"
                        className="font-tajawal pointer-events-none select-none"
                      >
                        {screen.numberArabic}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Center Decorative Disc */}
              <circle
                cx={center}
                cy={center}
                r="46"
                fill="url(#hubGradient)"
                stroke="#10B981"
                strokeWidth="3"
                className="drop-shadow-md"
              />
            </svg>

            {/* Interactive Center Hub Button */}
            <button
              onClick={handleRandomSpin}
              disabled={isSpinning}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 hover:from-emerald-400 hover:to-teal-600 text-stone-950 font-black text-xs flex flex-col items-center justify-center gap-1 shadow-2xl border-2 border-white/40 cursor-pointer active:scale-95 transition-all z-20 disabled:opacity-80"
              title="اضغط لتدوير العجلة"
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span className="text-[11px] leading-tight font-tajawal">
                {isSpinning ? 'تدور...' : 'دوّر العجلة'}
              </span>
            </button>
          </div>

          {/* Stepper buttons (prev / next) */}
          <div className="flex items-center justify-between w-full max-w-[310px] mt-2 px-2 text-xs">
            <button
              onClick={() => handleStep('prev')}
              disabled={isSpinning}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>الواحة السابقة</span>
            </button>

            <span className="text-[11px] text-emerald-400 font-bold">
              {activeScreen.numberArabic} من ١٠
            </span>

            <button
              onClick={() => handleStep('next')}
              disabled={isSpinning}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-40"
            >
              <span>الواحة التالية</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 
          🌟 SINGLE ACTIVE PREVIEW CARD (Strictly One Card, NOT stacked screens underneath)
          "ولا يكون تحتها كل الشاشات"
        */}
        <div className="w-full max-w-md mx-auto">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#12221A] to-[#0A140F] border-2 border-emerald-500/40 text-stone-100 shadow-2xl relative overflow-hidden transition-all duration-300 text-right space-y-3">
            
            {/* Ambient accent strip */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />

            {/* Badge & Title */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {activeScreen.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      الشاشة {activeScreen.numberArabic}
                    </span>
                    <span className="text-[11px] text-stone-400">{activeScreen.badge}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                    {activeScreen.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Tagline / Psychological Benefit */}
            <p className="text-xs text-stone-300 leading-relaxed font-medium">
              {activeScreen.tagline}
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeScreen.features.map((feat, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-emerald-200/90 font-medium"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>

            {/* Primary Action: Direct Entry into this exact selected screen */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleNavigateToScreen(activeScreen.id)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-emerald-950/50 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ادخل {activeScreen.shortTitle} فقط الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {activeScreen.id !== 'home' && (
                <button
                  onClick={() => handleNavigateToScreen('home')}
                  className="py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  title="الذهاب للرئيسية العامة"
                >
                  <span>🏠 الرئيسية (١)</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </main>

      {/* Footer reassurance bar */}
      <footer className="max-w-xl mx-auto w-full text-center pt-3 pb-1 text-[11px] text-stone-500 border-t border-white/10 z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>خصوصية وسرية تامة وبلا أحكام</span>
        </div>
        <span>مبادرة نسمة حياة 🌿</span>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-right">
          <div className="w-full max-w-lg bg-[#12221A] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white font-tajawal">عن مبادرة نسمة حياة</h3>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                <strong>«نسمة حياة»</strong> مبادرة عربية تسعى لنشر الوعي الصحي النفسي وتقديم مساحة هادئة للاسترخاء والفهم الذاتي بعيداً عن التعقيد والوصمة المجتمعية.
              </p>

              <div className="p-3 bg-white/5 rounded-2xl border border-emerald-500/20 space-y-1">
                <strong className="text-emerald-300">نظام الواحات العشر المستقلة:</strong>
                <p className="text-stone-300">
                  تم تقسيم محتوى التطبيق إلى ١٠ شاشات مستقلة تماماً، بحيث يمكنك دخول أي شاشة بمفردها والاستمتاع بتجربتها بتركيز وراحة دون تشتت أو ازدحام.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>أمان وخصوصية:</strong> بياناتك محفوظة محلياً على جهازك ولا نطلب أذونات كاميرا أو جهات اتصال.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>مساندة إنسانية:</strong> مساحة استماع حقيقية وأدلة استرشادية دون تنظير أو أحكام.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
