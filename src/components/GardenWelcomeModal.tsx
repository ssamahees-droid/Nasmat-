/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GardenWelcomeModal Component («حديقتك الجميلة» 🌿)
 * Emotional, high-contrast, beautiful opening welcome modal for Nesmat Al-Hayat.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, ArrowLeft, X, Compass, Flower2 } from 'lucide-react';
import gardenBgImage from '../assets/images/nesmat_garden_welcome_bg_1792856968155.jpg';

interface GardenWelcomeModalProps {
  isOpen: boolean;
  onStart: () => void;
  onSkip?: () => void;
  onClose?: () => void;
}

export const GardenWelcomeModal: React.FC<GardenWelcomeModalProps> = ({
  isOpen,
  onStart,
  onSkip,
  onClose
}) => {
  if (!isOpen) return null;

  const handleStartJourney = () => {
    try {
      localStorage.setItem('nesma_welcome_seen', 'true');
    } catch (e) {
      console.warn('Storage error saving welcome state:', e);
    }
    onStart();
  };

  const handleSkipWelcome = () => {
    try {
      localStorage.setItem('nesma_welcome_seen', 'true');
    } catch (e) {
      console.warn('Storage error saving welcome state:', e);
    }
    if (onSkip) {
      onSkip();
    } else {
      onStart();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-lg font-cairo animate-fade-in overflow-y-auto"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl my-auto bg-stone-900 text-stone-100 rounded-3xl shadow-2xl overflow-hidden border border-emerald-500/30 flex flex-col">
        
        {/* Background Image Overlay with Gradient Mask for Maximum Legibility */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={gardenBgImage} 
            alt="حديقتك الجميلة" 
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-10000 ease-linear animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-900/95 to-stone-950/98" />
        </div>

        {/* Decorative Floating Petals */}
        <div className="absolute top-4 left-6 text-2xl opacity-40 animate-bounce pointer-events-none">🌸</div>
        <div className="absolute bottom-12 right-6 text-2xl opacity-40 animate-pulse pointer-events-none">🌿</div>

        {/* Header Bar */}
        <div className="relative px-6 py-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">🌿</span>
            <span className="font-tajawal text-sm">نسمة حياة — مش كل وجع بيبان</span>
          </div>

          <button
            onClick={handleSkipWelcome}
            className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            title="تخطّي الترحيب والدخول المباشر"
          >
            <span>تخطّي الترحيب</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="relative z-10 flex-1 p-6 sm:p-10 overflow-y-auto space-y-6 text-stone-100 max-h-[75vh]">
          
          {/* Welcome Title */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-black font-tajawal text-white leading-relaxed pt-1">
              حديقتك الجميلة 🌸
            </h1>
            <div className="text-xs sm:text-sm font-bold text-emerald-300 font-tajawal">
              نسمة حياة — مش كل وجع بيبان
            </div>
          </div>

          {/* Emotional Message Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-stone-200 font-medium text-justify font-cairo">
            
            <p className="p-5 rounded-2xl bg-[#174F3F]/50 border border-[#174F3F] text-[#E2EFE7] leading-loose shadow-inner font-tajawal">
              تخيّل أنك حديقة جميلة مليانة أزهار ملونة بأبدع الألوان وروائحها في منتهى الروعة، ولكن تسود فيها بعض من الفوضى مما يجعل حديقتك تظهر غير جميلة من الخارج؛ فكل رحلتك معنا هي محاولة لإعادة ترتيب هذه الحديقة ليظهر جمالها.
            </p>

            {/* Added Phrase Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#174F3F] to-[#205746] border-2 border-[#B78327]/60 text-white space-y-2 shadow-lg">
              <p className="font-black text-sm sm:text-base leading-relaxed text-amber-200 font-tajawal text-center">
                أنت لست بحاجة لأن تصبح شخصًا آخر... فقط امنح نفسك فرصة لاكتشاف جمالك من جديد. ✨
              </p>
            </div>
          </div>

        </div>

        {/* Footer Action Buttons Bar */}
        <div className="relative z-10 p-5 bg-[#F7F5EF] border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <button
            onClick={handleStartJourney}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#174F3F] hover:bg-[#205746] text-white text-base font-black transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 group font-tajawal"
          >
            <span>ابدأ رحلتك 🌱</span>
            <ArrowLeft className="w-4 h-4 text-[#E2EFE7] group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleSkipWelcome}
            className="text-xs text-stone-600 hover:text-stone-900 transition-colors py-1 cursor-pointer underline underline-offset-4 font-bold"
          >
            الدخول إلى الشاشة الرئيسية مباشرة
          </button>

        </div>

      </div>
    </div>
  );
};
