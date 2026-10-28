/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MicroResetDialModal Component
 * A 30-second tactile interactive emergency dial for quick grounding
 * using 4-7-8 tactile rhythm, fog-wiping, and comforting grounding prompts.
 */

import React, { useState, useEffect } from 'react';
import { SimpleIconX, SimpleIconCheck, SimpleIconSparkles } from './common/SimpleSvgIcons';

interface MicroResetDialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MicroResetDialModal: React.FC<MicroResetDialModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [wipedFogPercent, setWipedFogPercent] = useState(0);

  // 30-second countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setCompletedSessions((prev) => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isOpen, isActive, secondsLeft]);

  // Breathing rhythm loop (4s inhale, 4s hold, 6s exhale)
  useEffect(() => {
    let rhythmTimer: any = null;
    if (isOpen && isActive) {
      let step = 0;
      const cycle = () => {
        if (step % 3 === 0) setPhase('inhale');
        else if (step % 3 === 1) setPhase('hold');
        else setPhase('exhale');
        step++;
      };
      cycle();
      rhythmTimer = setInterval(cycle, 4000);
    }
    return () => clearInterval(rhythmTimer);
  }, [isOpen, isActive]);

  const handleStart = () => {
    setSecondsLeft(30);
    setWipedFogPercent(0);
    setIsActive(true);
  };

  const handleWipeFog = () => {
    if (!isActive) return;
    setWipedFogPercent((prev) => Math.min(100, prev + 10));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-tajawal animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#E2EFE7] border-b border-[#D5DED7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFFFFF] border border-[#23785B]/30 flex items-center justify-center text-2xl shadow-xs">
              ⏱️
            </div>
            <div>
              <h2 className="text-[19px] sm:text-[21px] font-bold text-[#174F3F] leading-tight">
                قرص التهدئة الخاطف (٣٠ ثانية)
              </h2>
              <p className="text-[13px] text-[#515B55] font-medium">
                إعادة ضبط حافة التوتر وإعادة الاتصال باللحظة الحالية ✨
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#292F2B] border border-[#D5DED7] flex items-center justify-center transition-all cursor-pointer"
          >
            <SimpleIconX size={20} />
          </button>
        </div>

        {/* Dial Body */}
        <div className="p-6 text-center space-y-6 flex flex-col items-center">

          {/* Interactive Dial Animation */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            
            {/* Outer Pulsing Ring */}
            <div 
              className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                phase === 'inhale' 
                  ? 'border-[#23785B] scale-105 bg-[#E2EFE7]/50' 
                  : phase === 'hold' 
                    ? 'border-amber-500 scale-100 bg-amber-50/40' 
                    : 'border-[#174F3F] scale-95 bg-[#F7F5EF]'
              }`}
            />

            {/* Inner Interactive Circle */}
            <button
              onClick={handleWipeFog}
              disabled={!isActive}
              className={`relative z-10 w-44 h-44 rounded-full bg-[#FFFFFF] border-4 border-[#174F3F] shadow-lg flex flex-col items-center justify-center p-4 transition-all cursor-pointer active:scale-95 ${
                isActive ? 'ring-4 ring-[#23785B]/20' : ''
              }`}
            >
              {isActive ? (
                <div className="space-y-1 select-none">
                  <span className="text-3xl block animate-pulse">
                    {phase === 'inhale' ? '🌬️' : phase === 'hold' ? '🧘' : '🍃'}
                  </span>
                  <span className="text-2xl font-black text-[#174F3F] block">
                    {secondsLeft}s
                  </span>
                  <span className="text-xs font-bold text-[#515B55] block">
                    {phase === 'inhale' && 'شهيق عميق...'}
                    {phase === 'hold' && 'حبس ومراقبة...'}
                    {phase === 'exhale' && 'زفير بطيء...'}
                  </span>
                  <span className="text-[11px] text-[#23785B] font-bold block pt-1">
                    (انقر لتصفية الشاشة)
                  </span>
                </div>
              ) : secondsLeft === 0 ? (
                <div className="space-y-1">
                  <span className="text-3xl block">✨</span>
                  <span className="text-base font-bold text-[#174F3F] block">تمت التهدئة!</span>
                  <span className="text-xs text-[#515B55] block">قلبك الآن في سلام</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-3xl block">🍃</span>
                  <span className="text-base font-bold text-[#174F3F] block">اضغط للبدء</span>
                  <span className="text-xs text-[#515B55] block">٣٠ ثانية فقط</span>
                </div>
              )}
            </button>
          </div>

          {/* Fog wiping progress bar */}
          {isActive && (
            <div className="w-full max-w-xs space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#515B55]">
                <span>تصفية التشتت والصفاء الحسي</span>
                <span>{wipedFogPercent}%</span>
              </div>
              <div className="h-3 rounded-full bg-[#D5DED7] overflow-hidden">
                <div 
                  className="h-full bg-[#174F3F] transition-all duration-300 rounded-full"
                  style={{ width: `${wipedFogPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Comfort Message */}
          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] text-[#292F2B] text-sm font-medium leading-relaxed max-w-md">
            {isActive ? (
              <p>🌱 "أنفاسك هي مرساتك؛ لا تطلب من عقلك شيئاً الآن، فقط راقب خروج ودخول الهواء."</p>
            ) : secondsLeft === 0 ? (
              <p>🌸 "أحسنت! أرحتَ جسدك وذهنك في ٣٠ ثانية. خذ لحظة وابتسم لنفسك."</p>
            ) : (
              <p>🕊️ "عندما تشعر بالانقضاء أو زحمة الأفكار، هذا القرص صُمم ليعيدك لاتزانك فوراً."</p>
            )}
          </div>

          {/* Action Button */}
          {!isActive && (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold text-[16px] rounded-2xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <SimpleIconSparkles size={18} />
              <span>{secondsLeft === 0 ? 'إعادة التهدئة مرة أخرى ⏱️' : 'ابدأ التهدئة الخاطفة الآن ⏱️'}</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
