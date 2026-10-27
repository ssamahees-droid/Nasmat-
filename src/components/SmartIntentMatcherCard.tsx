/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SmartIntentMatcherCard.tsx
 * Smart Intent Matcher & Daily Guided Step for «نسمة حياة»:
 * - Simplifies navigation for anxious or overwhelmed users (Zero Cognitive Fatigue).
 * - 1-Tap navigation based on immediate emotional state.
 * - Single daily focused micro-step recommendation.
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Wind, 
  Sparkles, 
  Brain, 
  Heart, 
  ArrowLeft, 
  ShieldAlert, 
  Volume2, 
  CheckCircle2, 
  Smile, 
  Coffee 
} from 'lucide-react';

interface SmartIntentMatcherCardProps {
  onNavigate: (tab: string) => void;
  onOpenCompanion?: () => void;
  onOpenBreathingModal?: () => void;
  onOpenFekerModal?: () => void;
  onOpenRescueModal?: () => void;
  onOpenGratitudeGardenModal?: () => void;
}

export const SmartIntentMatcherCard: React.FC<SmartIntentMatcherCardProps> = ({
  onNavigate,
  onOpenCompanion,
  onOpenBreathingModal,
  onOpenFekerModal,
  onOpenRescueModal,
  onOpenGratitudeGardenModal
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const INTENTS = [
    {
      id: 'anxiety',
      icon: '⚡',
      label: 'توتر أو ضيقة بالصدر',
      desc: 'حاجة مهدئة سريعة للتنفس والاسترخاء',
      actionText: 'بدء تمرين التنفس',
      color: 'from-amber-500/15 via-emerald-600/20 to-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200',
      handler: () => {
        if (onOpenBreathingModal) onOpenBreathingModal();
        else onNavigate('breathe');
      }
    },
    {
      id: 'sadness',
      icon: '🌧️',
      label: 'حزن أو إحباط عميق',
      desc: 'مساحة فضفضة واحتواء دون أحكام',
      actionText: 'تحدث مع رفيقي',
      color: 'from-sky-500/15 via-emerald-600/20 to-sky-500/10 border-sky-500/40 text-sky-900 dark:text-sky-200',
      handler: () => {
        if (onOpenCompanion) onOpenCompanion();
        else onNavigate('support');
      }
    },
    {
      id: 'overthinking',
      icon: '🌀',
      label: 'تفكير زائد وسيناريوهات',
      desc: 'تفكيك الأفكار واصطياد التشوهات',
      actionText: 'استوديو فكّر المعرفي',
      color: 'from-purple-500/15 via-emerald-600/20 to-purple-500/10 border-purple-500/40 text-purple-900 dark:text-purple-200',
      handler: () => {
        if (onOpenFekerModal) onOpenFekerModal();
        else onNavigate('games');
      }
    },
    {
      id: 'seeking_calm',
      icon: '☕',
      label: 'محتاج أهدي ونفسي ترتاح',
      desc: 'أصوات طبيعة وامتنان مريح ليومك',
      actionText: 'حديقة الامتنان والسكينة',
      color: 'from-emerald-500/15 via-teal-600/20 to-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200',
      handler: () => {
        if (onOpenGratitudeGardenModal) onOpenGratitudeGardenModal();
        else onNavigate('practice');
      }
    }
  ];

  return (
    <section className="bg-[#FFFFFF] dark:bg-[#14271F] border-2 border-[#D5DED7] dark:border-emerald-500/25 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 text-right font-tajawal">
      
      {/* Card Header */}
      <div className="flex items-center justify-between border-b pb-3 border-[#D5DED7] dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-300 flex items-center justify-center text-xl shadow-2xs">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-[#174F3F] dark:text-emerald-300">
                حاسس بإيه دلوقتي؟ (توجيه سريع وبسيط) 🌿
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                ضغطة واحدة ✨
              </span>
            </div>
            <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
              حدد شعورك الحقيقي في هذه اللحظة لنرشدك فوراً للواحة الأنسب دون حيرة أو تشتت
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Intent Cards (1-Tap Solution) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INTENTS.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedState(item.id);
              item.handler();
            }}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-98 bg-gradient-to-br ${item.color} flex items-center justify-between shadow-2xs group`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform shrink-0">
                {item.icon}
              </span>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs sm:text-sm leading-snug">
                  {item.label}
                </h4>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-white/80 dark:bg-black/40 border border-current/20 shrink-0 flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
              <span>{item.actionText}</span>
              <ArrowLeft className="w-3 h-3" />
            </span>
          </div>
        ))}
      </div>

      {/* Daily Guided Step Box (Single Micro-Step Recommendation) */}
      <div className="p-3.5 rounded-2xl bg-[#E2EFE7]/80 dark:bg-[#1A3329] border border-[#23785B]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#174F3F] text-white flex items-center justify-center text-sm font-bold shrink-0">
            🎯
          </div>
          <div>
            <span className="font-extrabold text-[#174F3F] dark:text-emerald-300 block">
              خطوتك البسيطة اليوم:
            </span>
            <span className="text-[#292F2B] dark:text-stone-200">
              دقيقتين تنفس مربع مهدئ + تسجيل انطباعك الشعوري
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenBreathingModal) onOpenBreathingModal();
            else onNavigate('breathe');
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold rounded-xl transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>ابدأ خطوة اليوم</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

    </section>
  );
};
