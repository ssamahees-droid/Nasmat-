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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Flower2 className="w-3.5 h-3.5 text-pink-400" />
              <span>رسالة البداية · حديقتك الجميلة</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black font-tajawal text-white leading-relaxed pt-1">
              أهلًا بيك في نسمة حياة 🤍
            </h1>
          </div>

          {/* Emotional Message Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-stone-200 font-medium text-justify">
            
            <p className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-100 leading-loose shadow-inner">
              تخيّل إنك حديقة جميلة، مليانة أزهار بأبدع الألوان، وروائحها في منتهى الروعة…
            </p>

            <p className="leading-loose text-stone-300">
              لكن مع الوقت، ممكن تتشابك بعض الأغصان، وتتراكم الأوراق، وتحتاج بعض الأزهار إلى الرعاية؛ لدرجة إن جمال حديقتك مايبقاش ظاهر زي ما يستحق.
            </p>

            <p className="text-stone-300 font-bold">
              وده مش معناه إن الحديقة فقدت جمالها…
            </p>

            {/* Highlighted Quote Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border-r-4 border-amber-400 border border-emerald-700/60 text-white space-y-1 shadow-lg">
              <p className="font-bold text-xs sm:text-sm leading-relaxed text-amber-200">
                أنت كمان جواك جمال يستحق إنه يظهر، حتى لو الحياة خلتك مش قادر تشوفه دلوقتي.
              </p>
            </div>

            <p className="leading-loose text-stone-300">
              رحلتك معانا مش محاولة نغيّرك لشخص تاني، لكنها رحلة نفهم فيها نفسنا، ونرتّب أفكارنا، ونفهم مشاعرنا، ونتعلم نرعى الأجزاء اللي جوانا واحتاجت لاهتمام.
            </p>

            <p className="leading-loose text-stone-300">
              خطوة بخطوة، هنحاول نساعدك تشوف حديقتك بصورة أوضح، وتكتشف الجمال اللي كان موجود فيها من البداية.
            </p>

            {/* Core Philosophy Highlight Box */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-emerald-500/40 text-center space-y-1 my-2">
              <p className="font-black text-xs sm:text-sm text-emerald-300 leading-relaxed font-tajawal">
                لأن هدفنا مش إننا نصنع منك إنسانًا مختلفًا… لكن إنك تكتشف نفسك، وتدي لنفسك فرصة تزهر. 🌸
              </p>
            </div>

            <p className="text-center font-black text-sm text-amber-300 pt-1">
              أهلًا بيك في رحلتك.
            </p>
          </div>

        </div>

        {/* Footer Action Buttons Bar */}
        <div className="relative z-10 p-5 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <button
            onClick={handleStartJourney}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 group font-tajawal"
          >
            <span>نبدأ رحلتنا 🌿</span>
            <ArrowLeft className="w-4 h-4 text-emerald-200 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleSkipWelcome}
            className="text-xs text-stone-400 hover:text-stone-200 transition-colors py-1 cursor-pointer underline underline-offset-4"
          >
            تخطّي الترحيب والذهاب للشاشة الرئيسية
          </button>

        </div>

      </div>
    </div>
  );
};
