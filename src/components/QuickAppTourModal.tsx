/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QuickAppTourModal.tsx
 * Interactive 3-Step Guided Tour for new users in «نسمة حياة»:
 * 1. الاستكشاف ومكتبة المعرفة (Explore & Psychoeducation)
 * 2. بستان الألعاب والحلول المعرفية (Games & CBT Tools)
 * 3. رفيقي الداعم (Refiqi AI Companion)
 * Includes 'Skip' (تخطي), 'Next' (التالي), 'Previous' (السابق), and direct action navigation.
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Gamepad2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Compass, 
  HeartHandshake, 
  MapPin 
} from 'lucide-react';

interface QuickAppTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenCompanion?: () => void;
}

export const TOUR_STEPS = [
  {
    stepNumber: 1,
    id: 'explore',
    icon: '📖',
    badge: 'الخطوة الأولى من ٣',
    title: 'قسم الاستكشاف ومكتبة المعرفة النفسية',
    shortDesc: 'خريطتك للوعي وفهم الذات عبر محتوى علمي موثوق ومبسط',
    fullDesc: 'يضم هذا القسم أكثر من 30 موضوعاً تثقيفياً موثوقاً، كتب معتمدة مترجمة من منظمة الصحة العالمية (WHO)، مقالات تفاعلية، وتسجيلات صونية مهدئة يمكنك الاستماع إليها في أي وقت.',
    highlightPoints: [
      'أكثر من 30 موضوعاً تثقيفياً مبسطاً',
      'كتيبات منظمة الصحة العالمية (WHO) التفاعلية',
      'مقالات وتسجيلات صونية تعمل بدون إنترنت'
    ],
    actionTab: 'explore',
    actionText: 'استكشف المكتبة الآن 👈'
  },
  {
    stepNumber: 2,
    id: 'games',
    icon: '🧩',
    badge: 'الخطوة الثانية من ٣',
    title: 'بستان الألعاب والحلول المعرفية',
    shortDesc: 'الترويح الذهني التفاعلي واصطياد الأفكار المزعجة (CBT)',
    fullDesc: 'مساحة مبهجة تجمع بين التسلية والتشافي المعرفي السلوكي؛ تشمل استوديو «فكّر» لاصطياد التشوهات الفكرية، لعبة «جوايا حكاية»، شفرة نسمة الكبرى، وألغاز التركيب البصرية.',
    highlightPoints: [
      'تطبيق «فكّر» لإعادة الهيكلة المعرفية',
      'لعبة «جوايا حكاية» وسرد الأحداث',
      'ألغاز تركيب الصور والتفاصيل الخفية'
    ],
    actionTab: 'games',
    actionText: 'جرب الألعاب العلاجية 👈'
  },
  {
    stepNumber: 3,
    id: 'companion',
    icon: '✨',
    badge: 'الخطوة الثالثة من ٣',
    title: 'رفيقي — رفيق رحلتك الذكي الداعم',
    shortDesc: 'مساحتك الخاصة للفضفضة والإنصات الدافئ دون أحكام 24/7',
    fullDesc: 'رفيق تفاعلي يرافقك بإنصات إنساني دافئ، يربط بين أفكارك ومشاعرك، ويقدم لك إرشاداً سقراطياً هادئاً وخطوات صغيرة متدرجة تساعدك على ترتيب روحك.',
    highlightPoints: [
      'إنصات دافئ وفهم عميق للحديث السابق',
      'خالٍ من الأحكام المسبقة وخصوصية مطلقة',
      'توجيه مريح لتمارين التنفس والحلول المناسبة'
    ],
    actionTab: 'companion',
    actionText: 'تحدث مع رفيقي الآن 👈'
  }
];

export const QuickAppTourModal: React.FC<QuickAppTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCompanion
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Mark tour as seen when modal closes
  const handleCloseAndMarkSeen = () => {
    try {
      localStorage.setItem('nesmat_quick_tour_seen', 'true');
    } catch (_) {}
    onClose();
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleCloseAndMarkSeen();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleExecuteAction = () => {
    handleCloseAndMarkSeen();
    if (currentStep.id === 'companion' && onOpenCompanion) {
      onOpenCompanion();
    } else if (currentStep.actionTab) {
      onNavigate(currentStep.actionTab);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-xs animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#F7F5EF] dark:bg-[#121E18] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-[#D5DED7] dark:border-emerald-500/30 text-right">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-white/95 dark:bg-[#182820]/95 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-lg shadow-2xs font-extrabold">
              🗺️
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#174F3F] dark:text-emerald-300 font-tajawal">
                الجولة التعليمية السريعة — «نسمة حياة» 🌿
              </h3>
              <p className="text-[11px] text-[#515B55] dark:text-stone-400">
                تعرّف على أهم 3 محطات مساندة لتجربة مريحة دون حيرة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseAndMarkSeen}
            className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="تخطي الجولة التعريفية"
          >
            <span>تخطي</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 pt-4 flex items-center justify-between gap-2">
          {TOUR_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#174F3F] dark:bg-emerald-400 shadow-2xs' 
                    : isCompleted 
                    ? 'bg-emerald-500/40 dark:bg-emerald-600/50' 
                    : 'bg-stone-200 dark:bg-stone-800'
                }`}
                title={`الذهاب إلى الخطوة ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Step Content Body */}
        <div className="p-6 space-y-5 flex-1">
          
          {/* Step Icon & Badge */}
          <div className="flex items-center justify-between">
            <span className="text-3xl p-3 rounded-2xl bg-white dark:bg-[#192A21] border border-stone-200 dark:border-stone-800 shadow-2xs">
              {currentStep.icon}
            </span>

            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
              {currentStep.badge}
            </span>
          </div>

          {/* Title & Short Description */}
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-black text-[#174F3F] dark:text-emerald-300 font-tajawal">
              {currentStep.title}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-[#515B55] dark:text-stone-300 leading-snug">
              {currentStep.shortDesc}
            </p>
          </div>

          {/* Detailed Explanation Paragraph */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#182820] border border-stone-200 dark:border-stone-800 space-y-3 shadow-2xs">
            <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 leading-relaxed">
              {currentStep.fullDesc}
            </p>

            {/* Highlights List */}
            <div className="space-y-1.5 pt-1">
              {currentStep.highlightPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#174F3F] dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Action Shortcut Button */}
          <button
            type="button"
            onClick={handleExecuteAction}
            className="w-full py-2.5 px-4 bg-[#E2EFE7] hover:bg-[#d2e7da] dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-[#174F3F] dark:text-emerald-200 font-extrabold text-xs rounded-xl border border-[#23785B]/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-2xs"
          >
            <span>{currentStep.actionText}</span>
          </button>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-stone-100 dark:bg-[#0E1712] border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          
          {/* Previous Step Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              isFirstStep
                ? 'opacity-30 cursor-not-allowed text-stone-400'
                : 'bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 shadow-2xs'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          {/* Skip Button (Center text) */}
          <button
            type="button"
            onClick={handleCloseAndMarkSeen}
            className="text-xs text-stone-500 dark:text-stone-400 font-bold hover:underline"
          >
            تخطي الجولة
          </button>

          {/* Next / Finish Button */}
          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-5 bg-[#174F3F] hover:bg-[#123C30] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isLastStep ? 'ابدأ رحلتك الآن 🌿' : 'التالي'}</span>
            {!isLastStep && <ChevronLeft className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </div>
  );
};
