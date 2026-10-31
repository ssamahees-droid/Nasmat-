/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WelcomeScreen Component
 * Mobile-First, high contrast, large legible typography, and the 10-slice Rotary Wheel system.
 * Full Bilingual (Arabic & English) i18n support with reactive RTL/LTR alignment.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight, 
  ChevronLeft, 
  Info, 
  X, 
  ShieldCheck, 
  Heart,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenScreens, TenScreenItem } from '../constants/tenScreens';
import { chimeService } from '../services/chimeService';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from '../components/LanguageToggle';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip?: () => void;
  onOpenAbout?: () => void;
  onNavigate?: (tab: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart, 
  onNavigate 
}) => {
  const { t, language, isRTL } = useLanguage();
  const screens = useTenScreens();

  const [selectedIndex, setSelectedIndex] = useState(0); // 0 corresponds to HomeScreen (١ / 1)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(() => chimeService.isMuted());
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [needleBumping, setNeedleBumping] = useState(false);

  const numSlices = screens.length; // 10 screens
  const sliceAngle = 360 / numSlices; // 36 degrees per slice
  const tickTimersRef = useRef<NodeJS.Timeout[]>([]);

  const activeScreen: TenScreenItem = screens[selectedIndex] || screens[0];

  // Mood shortcuts with dynamic translations
  const moodShortcuts = [
    { label: t('welcome.mood.tense', 'متوتر وعاوز أهدى'), emoji: '🌊', targetId: 'breathe' },
    { label: t('welcome.mood.overwhelmed', 'أفكاري زحمة ومخنوق'), emoji: '🎈', targetId: 'games' },
    { label: t('welcome.mood.self', 'عاوز أفهم نفسي'), emoji: '🪞', targetId: 'self-discovery' },
    { label: t('welcome.mood.gentle', 'محتاج بداية هادية'), emoji: '🧭', targetId: 'start' },
    { label: t('welcome.mood.emergency', 'في لحظة طارئة وصعبة'), emoji: '🛡️', targetId: 'rescue' },
  ];

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

    const targetSliceCenter = targetIndex * sliceAngle;
    const currentNormalized = ((rotationAngle % 360) + 360) % 360;
    
    const desiredNormalized = (360 - targetSliceCenter) % 360;
    let delta = desiredNormalized - currentNormalized;
    if (delta <= 0) delta += 360;

    const totalRotation = rotationAngle + delta + (extraSpins * 360);
    const spinDuration = 3000; // ms

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

  // Rich slice colors
  const sliceColors = [
    { fill: '#1B6A52' }, // 1 Home
    { fill: '#0E7A6E' }, // 2 Start
    { fill: '#0284C7' }, // 3 Breathe
    { fill: '#7C3AED' }, // 4 Self Discovery
    { fill: '#4F46E5' }, // 5 Explore
    { fill: '#DB2777' }, // 6 Games
    { fill: '#D97706' }, // 7 Practice
    { fill: '#15803D' }, // 8 Journey
    { fill: '#E11D48' }, // 9 Rescue
    { fill: '#0F766E' }  // 10 Support
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

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div 
      className={`min-h-screen bg-[#F7F5EF] text-[#292F2B] flex flex-col justify-between p-4 sm:p-7 font-tajawal antialiased relative overflow-x-hidden selection:bg-[#E2EFE7] selection:text-[#174F3F] ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      
      {/* Top Header Bar */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#D5DED7] z-10 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/30 p-1 flex items-center justify-center shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h1 className="font-bold text-[#174F3F] text-[20px] sm:text-[22px] leading-tight">
              {t('brand.title', 'نسمة حياة')}
            </h1>
            <p className="text-[15px] text-[#515B55] font-medium">
              {t('brand.subtitle', 'مبادرة الاسترخاء والدعم النفسي')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle in Header */}
          <LanguageToggle />

          <button
            onClick={toggleSound}
            className="min-h-[48px] min-w-[48px] p-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#E2EFE7] text-[#174F3F] border border-[#D5DED7] transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            title={isMuted ? t('welcome.sound_toggle_on', 'تشغيل المؤثرات الصوتية الهادئة') : t('welcome.sound_toggle_off', 'كتم الصوت')}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-[#515B55]" /> : <Volume2 className="w-5 h-5 text-[#23785B]" />}
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="min-h-[48px] px-3.5 py-2 rounded-2xl bg-[#FFFFFF] hover:bg-[#E2EFE7] text-[#174F3F] border border-[#D5DED7] transition-colors flex items-center gap-1.5 cursor-pointer text-[16px] font-bold shadow-xs"
          >
            <Info className="w-4 h-4 text-[#23785B]" />
            <span className="hidden xs:inline">{t('welcome.about_initiative', 'عن المبادرة')}</span>
          </button>

          <button
            onClick={() => handleNavigateToScreen('home')}
            className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#174F3F] hover:bg-[#23785B] text-white font-bold transition-all cursor-pointer text-[17px] flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>{t('welcome.skip_to_home', 'تخطي للرئيسية')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Rotary Centerpiece */}
      <main className="max-w-xl mx-auto w-full my-auto flex flex-col items-center text-center space-y-5 py-4 z-10">
        
        {/* Poetic Greeting & Instructions with High Contrast */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E2EFE7] border border-[#23785B]/30 text-[#174F3F] text-[15px] font-bold">
            <Sparkles className="w-4 h-4 text-[#B78327]" />
            <span>{t('welcome.badge', 'عجلة نسمة حياة الدوارة السحرية 🎡')}</span>
          </div>

          <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#174F3F] leading-tight">
            {t('welcome.heading', 'أهلاً بك.. اختر واحتك المفضلة اليوم')}
          </h2>

          <p className="text-[18px] text-[#515B55] leading-relaxed max-w-lg mx-auto font-medium">
            {t('welcome.subheading', 'أدِر العجلة لاكتشاف محطتك المناسبة، أو اضغط على ما تشعر به ليقودك التطبيق لوجهتك:')}
          </p>
        </div>

        {/* Quick Mood Direction Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto px-1">
          {moodShortcuts.map((mood) => {
            const targetIndex = screens.findIndex(s => s.id === mood.targetId);
            return (
              <button
                key={mood.targetId}
                onClick={() => {
                  if (targetIndex !== -1) {
                    rotateToIndex(targetIndex, 2);
                  }
                }}
                disabled={isSpinning}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#E2EFE7] border-2 border-[#D5DED7] text-[#292F2B] hover:text-[#174F3F] text-[16px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                <span className="text-[20px]">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Rotary Wheel Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.82, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 140, 
            damping: 18, 
            mass: 0.9, 
            delay: 0.15 
          }}
          className="relative flex flex-col items-center justify-center my-3"
        >
          
          {/* Top Pointer Needle with tactile bump */}
          <motion.div 
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
            className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className={`w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-t-[24px] border-t-[#B78327] drop-shadow-md transition-transform duration-75 ${needleBumping ? '-rotate-12 scale-110' : 'rotate-0'}`} />
            <div className="w-3.5 h-3.5 rounded-full bg-[#B78327] ring-2 ring-white shadow-sm -mt-1.5" />
          </motion.div>

          {/* SVG Rotating Wheel */}
          <div className="relative p-2 rounded-full border-4 border-[#174F3F]/30 bg-[#FFFFFF] shadow-xl">
            <svg
              width={viewBoxSize}
              height={viewBoxSize}
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              className="w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] max-w-full drop-shadow-md"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning 
                  ? 'transform 3.0s cubic-bezier(0.18, 0.89, 0.32, 1.05)' 
                  : 'transform 0.4s ease-out'
              }}
            >
              {/* Outer Border Rim */}
              <circle
                cx={center}
                cy={center}
                r={wheelRadius + 4}
                fill="none"
                stroke="#174F3F"
                strokeWidth="4"
                strokeOpacity="0.8"
              />

              {/* 10 Slices with Rich Palette */}
              {screens.map((screen, index) => {
                const color = sliceColors[index] || sliceColors[0];

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
                      fill={color.fill}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />

                    {/* Number & Screen Emoji inside slice with drop shadow */}
                    <g transform={`translate(${tx}, ${ty}) rotate(${midAngleDeg + 90})`}>
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        fontSize="17"
                        fontWeight="bold"
                        className="pointer-events-none select-none drop-shadow-sm"
                      >
                        {screen.emoji}
                      </text>
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        fontSize="13"
                        fontWeight="900"
                        className="pointer-events-none select-none font-bold"
                      >
                        {screen.numberArabic}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Center Decorative Border */}
              <circle
                cx={center}
                cy={center}
                r="48"
                fill="#174F3F"
                stroke="#FFFFFF"
                strokeWidth="4"
              />
            </svg>

            {/* Interactive Center Hub Button */}
            <button
              onClick={handleRandomSpin}
              disabled={isSpinning}
              className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#174F3F] hover:bg-[#23785B] text-white font-extrabold text-[16px] flex flex-col items-center justify-center gap-1 shadow-2xl border-3 border-white cursor-pointer active:scale-95 transition-all z-20 disabled:opacity-80"
              title={t('welcome.spin_button', 'اضغط لتدوير العجلة')}
            >
              <RotateCw className={`w-6 h-6 text-white ${isSpinning ? 'animate-spin' : ''}`} />
              <span className="leading-tight text-white drop-shadow-xs">
                {isSpinning ? t('welcome.spinning', 'تدور...') : t('welcome.spin_button', 'دوّر العجلة')}
              </span>
            </button>
          </div>

          {/* Stepper buttons (prev / next) */}
          <div className="flex items-center justify-between w-full max-w-[340px] mt-3 px-1">
            <button
              onClick={() => handleStep('prev')}
              disabled={isSpinning}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#FFFFFF] hover:bg-[#E2EFE7] text-[#174F3F] border border-[#D5DED7] flex items-center gap-1.5 cursor-pointer text-[16px] font-bold transition-colors active:scale-95 disabled:opacity-40 shadow-xs"
            >
              <ChevronRight className="w-4 h-4 text-[#23785B]" />
              <span>{t('welcome.prev_oasis', 'الواحة السابقة')}</span>
            </button>

            <span className="text-[18px] text-[#174F3F] font-bold font-mono px-2">
              {activeScreen.numberArabic} {t('welcome.of_ten', 'من ١٠')}
            </span>

            <button
              onClick={() => handleStep('next')}
              disabled={isSpinning}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#FFFFFF] hover:bg-[#E2EFE7] text-[#174F3F] border border-[#D5DED7] flex items-center gap-1.5 cursor-pointer text-[16px] font-bold transition-colors active:scale-95 disabled:opacity-40 shadow-xs"
            >
              <span>{t('welcome.next_oasis', 'الواحة التالية')}</span>
              <ChevronLeft className="w-4 h-4 text-[#23785B]" />
            </button>
          </div>
        </motion.div>

        {/* 🌟 SINGLE ACTIVE PREVIEW CARD */}
        <div className="w-full max-w-md mx-auto">
          <div className={`p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border-2 border-[#D5DED7] text-[#292F2B] shadow-md transition-all duration-300 space-y-4 ${
            isRTL ? 'text-right' : 'text-left'
          }`}>
            
            {/* Top Indicator */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/30 flex items-center justify-center text-3xl shadow-xs shrink-0">
                  {activeScreen.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-[15px] font-bold bg-[#E2EFE7] text-[#174F3F] border border-[#D5DED7]">
                      {language === 'en' ? `Screen ${activeScreen.numberArabic}` : `الشاشة ${activeScreen.numberArabic}`}
                    </span>
                    <span className="text-[15px] font-bold text-[#515B55]">{activeScreen.badge}</span>
                  </div>
                  
                  <h3 className="text-[24px] sm:text-[26px] font-bold text-[#174F3F] mt-1.5 leading-snug">
                    {activeScreen.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-[18px] text-[#292F2B] leading-relaxed font-medium">
              {activeScreen.tagline}
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeScreen.features.map((feat, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#F7F5EF] border border-[#D5DED7] text-[16px] text-[#292F2B] font-medium flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#23785B] shrink-0" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleNavigateToScreen(activeScreen.id)}
                className="flex-1 min-h-[50px] py-3.5 px-5 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold text-[18px] rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('welcome.enter_screen_now', 'ادخل {screen} فقط الآن', { screen: activeScreen.shortTitle })}</span>
                <ArrowIcon className="w-5 h-5" />
              </button>

              {activeScreen.id !== 'home' && (
                <button
                  onClick={() => handleNavigateToScreen('home')}
                  className="min-h-[50px] py-3.5 px-4 rounded-2xl bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] border border-[#D5DED7] text-[17px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  title="الذهاب للرئيسية العامة"
                >
                  <span>{t('welcome.enter_home_main', '🏠 الرئيسية (١)')}</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </main>

      {/* Footer reassurance bar */}
      <footer className="max-w-xl mx-auto w-full text-center pt-4 pb-2 text-[15px] text-[#515B55] border-t border-[#D5DED7] z-10 flex items-center justify-between font-medium">
        <div className="flex items-center gap-1.5 text-[#174F3F] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#23785B]" />
          <span>{t('brand.confidentiality', 'خصوصية وسرية تامة وبلا أحكام')}</span>
        </div>
        <span>{t('brand.title', 'نسمة حياة')} 🌿</span>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-[#292F2B] ${
            isRTL ? 'text-right' : 'text-left'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#D5DED7]">
              <div className="flex items-center gap-2.5">
                <Heart className="w-6 h-6 text-[#23785B]" />
                <h3 className="font-bold text-[24px] text-[#174F3F]">{t('welcome.about_title', 'عن مبادرة نسمة حياة')}</h3>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#515B55] hover:text-[#174F3F] rounded-xl hover:bg-[#E2EFE7] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-[18px] text-[#292F2B] leading-relaxed font-medium">
              <p>
                {t('welcome.about_p1', '«نسمة حياة» مبادرة عربية تسعى لنشر الوعي الصحي النفسي وتقديم مساحة هادئة للاسترخاء والفهم الذاتي بعيداً عن التعقيد والوصمة المجتمعية.')}
              </p>

              <div className="p-4 bg-[#E2EFE7] rounded-2xl border border-[#D5DED7] space-y-1.5">
                <strong className="text-[18px] text-[#174F3F] block">
                  {t('welcome.about_ten_title', 'نظام الواحات العشر المستقلة:')}
                </strong>
                <p className="text-[17px] text-[#292F2B]">
                  {t('welcome.about_ten_desc', 'تم تقسيم محتوى التطبيق إلى ١٠ شاشات مستقلة تماماً، بحيث يمكنك دخول أي شاشة بمفردها والاستمتاع بتجربتها بتركيز وراحة دون تشتت أو ازدحام.')}
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#23785B] shrink-0 mt-1" />
                  <span>
                    <strong>{t('welcome.about_safety_title', 'أمان وخصوصية:')} </strong>
                    {t('welcome.about_safety_desc', 'بياناتك محفوظة محلياً على جهازك ولا نطلب أذونات كاميرا أو جهات اتصال.')}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Heart className="w-5 h-5 text-[#23785B] shrink-0 mt-1" />
                  <span>
                    <strong>{t('welcome.about_support_title', 'مساندة إنسانية:')} </strong>
                    {t('welcome.about_support_desc', 'مساحة استماع حقيقية وأدلة استرشادية دون تنظير أو أحكام.')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D5DED7]">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full min-h-[48px] py-3 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold text-[18px] rounded-2xl transition cursor-pointer"
              >
                {t('common.understood', 'حسناً، فهمت')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
