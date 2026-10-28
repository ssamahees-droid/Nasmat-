/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ReturnModeModal Component ("وضع العودة")
 * Welcomes users back after an absence of > 7 days with a warm, zero-pressure message,
 * offering 3 clear choices without resetting any progress or data.
 */

import React from 'react';
import { SimpleIconX, SimpleIconSparkles, SimpleIconCheck } from './common/SimpleSvgIcons';

interface ReturnModeModalProps {
  isOpen: boolean;
  daysAbsent: number;
  onClose: () => void;
  onResumeJourney: () => void;
  onSelectGentleDay: () => void;
}

export const ReturnModeModal: React.FC<ReturnModeModalProps> = ({
  isOpen,
  daysAbsent,
  onClose,
  onResumeJourney,
  onSelectGentleDay
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-tajawal animate-fade-in" 
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#E2EFE7] border-b border-[#D5DED7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#23785B]/30 flex items-center justify-center text-2xl shadow-xs shrink-0">
              🌿
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-[#FFFFFF] text-[#174F3F] text-xs font-bold border border-[#23785B]/30 inline-block mb-1">
                وضع العودة الهادئة ✨
              </span>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#174F3F] leading-tight">
                أهلاً بعودتك الدافئة لواحتك 🌸
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#292F2B] border border-[#D5DED7] flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="إغلاق"
          >
            <SimpleIconX size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-right font-tajawal">
          
          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] space-y-2">
            <p className="text-[17px] sm:text-[18px] text-[#292F2B] font-bold leading-relaxed">
              سعداء بوجودك معنا مجدداً {daysAbsent > 0 ? `بعد غياب ${daysAbsent} أيام` : ''} 💚
            </p>
            <p className="text-[15px] sm:text-[16px] text-[#515B55] font-medium leading-relaxed">
              نود تذكيرك بأن رحلتك ملكك تماماً؛ لا توجد سلاسل أيام مكسورة ولا ضغوط. كل تقدمك وإنجازاتك السابقة محفوظة كمرسى أمان لك.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#174F3F] block">
              اختر ما يريح قلبك وذهنك اليوم:
            </span>

            {/* Option 1: Continue Journey */}
            <button
              onClick={onResumeJourney}
              className="w-full p-4 rounded-2xl bg-[#174F3F] hover:bg-[#23785B] text-white font-bold text-[16px] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs active:scale-95 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🚀</span>
                <div className="text-right">
                  <span className="block leading-tight">أكمل مساري</span>
                  <span className="text-xs text-[#E2EFE7] font-normal block">العودة لخريطتك والأنشطة كالمعتاد</span>
                </div>
              </div>
              <SimpleIconSparkles size={18} className="text-[#F8EED8]" />
            </button>

            {/* Option 2: Gentle Day */}
            <button
              onClick={onSelectGentleDay}
              className="w-full p-4 rounded-2xl bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] border border-[#23785B]/40 font-bold text-[16px] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs active:scale-95 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🍃</span>
                <div className="text-right">
                  <span className="block leading-tight">أختار يومًا خفيفًا</span>
                  <span className="text-xs text-[#515B55] font-normal block">جلسة تنفس دقيقة واحدة واستراحة هادئة</span>
                </div>
              </div>
              <SimpleIconCheck size={18} className="text-[#174F3F]" />
            </button>

            {/* Option 3: Not Right Now */}
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#515B55] hover:text-[#292F2B] border border-[#D5DED7] font-bold text-[15px] transition-all cursor-pointer text-center"
            >
              مش دلوقتي
            </button>
          </div>

          <p className="text-center text-xs text-[#515B55] pt-1">
            🌸 خطوة واحدة صغيرة اليوم تكفي لحفظ توازنك
          </p>
        </div>

      </div>
    </div>
  );
};
