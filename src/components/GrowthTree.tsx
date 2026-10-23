/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GrowthTree Component
 * Interactive SVG tree that dynamically grows branches, leaves, and blossoms
 * based on completed exercises, readings, and reflections stored in localStorage.
 * Full bilingual (Arabic & English) i18n support.
 */

import React, { useState, useEffect, useId } from 'react';
import { Sparkles, Droplet, BookOpen, Wind, CheckCircle2, Award } from 'lucide-react';
import { storage } from '../services/storage';
import { chimeService } from '../services/chimeService';
import { useLanguage } from '../context/LanguageContext';

interface GrowthTreeProps {
  onNavigate?: (tab: string) => void;
  onOpenGratitudeGarden?: () => void;
}

interface TreeStats {
  exercisesCount: number;
  readingsCount: number;
  checkinsCount: number;
  habitsCount: number;
  totalActivities: number;
}

export const GrowthTree: React.FC<GrowthTreeProps> = ({ onNavigate, onOpenGratitudeGarden }) => {
  const gradientId = useId();
  const { t, language, isRTL } = useLanguage();

  const [stats, setStats] = useState<TreeStats>({
    exercisesCount: 0,
    readingsCount: 0,
    checkinsCount: 0,
    habitsCount: 0,
    totalActivities: 0
  });

  const [treeStage, setTreeStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [waterBonus, setWaterBonus] = useState(() => {
    try {
      return parseInt(localStorage.getItem('nesma_tree_water_bonus') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [isWatering, setIsWatering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const calculateTreeGrowth = () => {
    try {
      // 1. Exercises: mindfulness sessions + breathing records
      const mindful = storage.getMindfulnessRecords().length;
      
      // 2. Readings: favorites marked + notes written
      const favorites = storage.getFavorites().length;
      const notes = storage.getNotes().length;
      const readings = favorites + notes;

      // 3. Daily check-ins
      const checkins = storage.getDailyCheckins().length;

      // 4. Completed habits
      const habits = storage.getHabits().reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);

      // 5. Gratitude plants
      const plants = storage.getGratitudePlants().length;

      const baseScore = mindful * 2 + readings + checkins + habits + plants;
      const total = baseScore + waterBonus;

      setStats({
        exercisesCount: mindful,
        readingsCount: readings,
        checkinsCount: checkins,
        habitsCount: habits + plants,
        totalActivities: total
      });

      if (total < 6) {
        setTreeStage(1);
      } else if (total < 14) {
        setTreeStage(2);
      } else if (total < 24) {
        setTreeStage(3);
      } else if (total < 38) {
        setTreeStage(4);
      } else {
        setTreeStage(5);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    calculateTreeGrowth();
  }, [waterBonus]);

  const stageTitles: Record<number, string> = {
    1: t('tree.stage1', 'شتلة البداية الواعدة 🌱'),
    2: t('tree.stage2', 'غصن فتي يورق بالعطاء 🌿'),
    3: t('tree.stage3', 'شجرة السكينة النامية 🌳'),
    4: t('tree.stage4', 'واحة مزهرة وافرة الظلال 🌸🌳'),
    5: t('tree.stage5', 'شجرة الحكمة والسلام التام ✨🌳')
  };

  const stageTitle = stageTitles[treeStage] || stageTitles[1];

  const handleWaterTree = () => {
    if (isWatering) return;
    setIsWatering(true);
    chimeService.playFlowerBloomChime();

    const nextBonus = waterBonus + 1;
    setWaterBonus(nextBonus);
    try {
      localStorage.setItem('nesma_tree_water_bonus', String(nextBonus));
    } catch {}

    setMessage(t('tree.watered_message', 'رويت شجرتك بالاهتمام والرفق! 💧 تزداد أوراقها خضرة وسكينة.'));
    setTimeout(() => {
      setIsWatering(false);
      setTimeout(() => setMessage(null), 3000);
    }, 1200);
  };

  const maxScore = treeStage === 1 ? 6 : treeStage === 2 ? 14 : treeStage === 3 ? 24 : treeStage === 4 ? 38 : 50;
  const minScore = treeStage === 1 ? 0 : treeStage === 2 ? 6 : treeStage === 3 ? 14 : treeStage === 4 ? 24 : 38;
  const progressPercent = Math.min(100, Math.max(10, Math.round(((stats.totalActivities - minScore) / (maxScore - minScore)) * 100)));

  return (
    <section 
      className={`w-full bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 transition-all ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label="Daily Mindful Growth Tree"
    >
      {/* Header with High-Contrast Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5DED7]/80 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/30 flex items-center justify-center text-3xl shadow-xs shrink-0">
            🌳
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174F3F] text-[15px] font-bold">
              <Sparkles className="w-4 h-4 text-[#B78327]" />
              <span>{t('tree.badge', 'شجرة نمو الوعي اليومي')}</span>
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[#174F3F] mt-1 leading-snug">
              {stageTitle}
            </h2>
          </div>
        </div>

        {/* Action button with minimum 48px touch target */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleWaterTree}
            disabled={isWatering}
            className="min-h-[48px] px-4 py-2.5 bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] border border-[#23785B]/40 rounded-2xl text-[17px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
            title={t('tree.water_button', 'سقي الشجرة')}
          >
            <Droplet className={`w-5 h-5 text-[#23785B] ${isWatering ? 'animate-bounce' : ''}`} />
            <span>{t('tree.water_button', 'اسقِ شجرتك 💧')}</span>
          </button>

          {onOpenGratitudeGarden && (
            <button
              onClick={onOpenGratitudeGarden}
              className="min-h-[48px] px-4 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white rounded-2xl text-[17px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>{t('tree.gratitude_button', 'حديقة الامتنان 🌸')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Encouragement Banner */}
      {message && (
        <div className="p-3.5 rounded-2xl bg-[#F8EED8] border border-[#B78327]/40 text-[#292F2B] text-[16px] font-medium animate-fade-in flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span>{message}</span>
        </div>
      )}

      {/* SVG Interactive Growth Canvas & Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* SVG Interactive Tree Graphic */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#F7F5EF] border border-[#D5DED7] rounded-3xl relative overflow-hidden">
          
          <svg
            viewBox="0 0 320 320"
            className="w-full max-w-[280px] h-[260px] sm:h-[280px] transition-transform duration-700"
            role="img"
            aria-label={`Growth Tree Stage ${treeStage}`}
          >
            <defs>
              <linearGradient id={`trunkGrad_${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A2E18" />
                <stop offset="50%" stopColor="#6D4321" />
                <stop offset="100%" stopColor="#4A2E18" />
              </linearGradient>

              <radialGradient id={`leafGrad_${gradientId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34A870" />
                <stop offset="70%" stopColor="#23785B" />
                <stop offset="100%" stopColor="#174F3F" />
              </radialGradient>

              <radialGradient id={`flowerGrad_${gradientId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD1DC" />
                <stop offset="100%" stopColor="#E2998E" />
              </radialGradient>

              <radialGradient id={`fruitGrad_${gradientId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F5D061" />
                <stop offset="100%" stopColor="#B78327" />
              </radialGradient>
            </defs>

            {/* Calming Earthy Soil Mound */}
            <ellipse cx="160" cy="285" rx="100" ry="24" fill="#E2EFE7" stroke="#D5DED7" strokeWidth="2" />
            <ellipse cx="160" cy="283" rx="75" ry="16" fill="#D5DED7" opacity="0.6" />

            {/* Stage 1: Seedling */}
            {treeStage === 1 && (
              <g className="animate-fade-in">
                <path d="M 160 282 C 160 250, 158 220, 160 190" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 160 220 C 145 200, 130 205, 125 195" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 160 205 C 175 190, 190 195, 195 185" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="4" strokeLinecap="round" fill="none" />
                <ellipse cx="123" cy="193" rx="12" ry="7" transform="rotate(-20 123 193)" fill={`url(#leafGrad_${gradientId})`} />
                <ellipse cx="197" cy="183" rx="12" ry="7" transform="rotate(25 197 183)" fill={`url(#leafGrad_${gradientId})`} />
                <ellipse cx="160" cy="185" rx="14" ry="9" transform="rotate(-10 160 185)" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="160" cy="175" r="5" fill={`url(#flowerGrad_${gradientId})`} />
              </g>
            )}

            {/* Stage 2: Young Branching Tree */}
            {treeStage === 2 && (
              <g className="animate-fade-in">
                <path d="M 160 282 Q 158 230, 160 160" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M 160 230 Q 135 200, 115 175" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 160 210 Q 185 180, 205 160" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 160 170 Q 145 140, 135 125" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 160 160 Q 175 135, 185 120" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="5" strokeLinecap="round" fill="none" />
                
                <ellipse cx="112" cy="173" rx="15" ry="9" transform="rotate(-30 112 173)" fill={`url(#leafGrad_${gradientId})`} />
                <ellipse cx="208" cy="158" rx="15" ry="9" transform="rotate(30 208 158)" fill={`url(#leafGrad_${gradientId})`} />
                <ellipse cx="132" cy="122" rx="16" ry="10" transform="rotate(-20 132 122)" fill={`url(#leafGrad_${gradientId})`} />
                <ellipse cx="188" cy="118" rx="16" ry="10" transform="rotate(20 188 118)" fill={`url(#leafGrad_${gradientId})`} />
                <ellipse cx="160" cy="140" rx="18" ry="12" fill={`url(#leafGrad_${gradientId})`} />

                <circle cx="132" cy="115" r="5" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="190" cy="112" r="5" fill={`url(#flowerGrad_${gradientId})`} />
              </g>
            )}

            {/* Stage 3: Serenity Tree */}
            {treeStage === 3 && (
              <g className="animate-fade-in">
                <path d="M 160 282 C 157 240, 155 190, 160 130" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M 159 220 C 130 190, 95 180, 80 150" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 160 200 C 190 170, 225 160, 240 130" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 160 150 C 140 120, 120 100, 110 80" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 160 140 C 180 110, 200 95, 210 75" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="6" strokeLinecap="round" fill="none" />

                <circle cx="80" cy="145" r="28" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="240" cy="125" r="28" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="110" cy="75" r="30" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="210" cy="70" r="30" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="160" cy="100" r="42" fill={`url(#leafGrad_${gradientId})`} />

                <circle cx="95" cy="140" r="6" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="225" cy="120" r="6" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="155" cy="85" r="7" fill={`url(#flowerGrad_${gradientId})`} />
              </g>
            )}

            {/* Stage 4: Blossoming Oasis Tree */}
            {treeStage === 4 && (
              <g className="animate-fade-in">
                <path d="M 160 282 C 155 240, 154 180, 160 120" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="22" strokeLinecap="round" fill="none" />
                <path d="M 158 210 C 120 180, 85 165, 65 130" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 160 190 C 200 160, 235 150, 255 115" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="10" strokeLinecap="round" fill="none" />
                
                <circle cx="65" cy="125" r="34" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="255" cy="110" r="34" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="105" cy="65" r="38" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="215" cy="60" r="38" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="160" cy="85" r="50" fill={`url(#leafGrad_${gradientId})`} />

                {/* Delicate Blossoms */}
                <circle cx="75" cy="120" r="7" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="245" cy="105" r="7" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="110" cy="55" r="8" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="210" cy="50" r="8" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="160" cy="70" r="9" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="175" cy="95" r="6" fill={`url(#fruitGrad_${gradientId})`} />
              </g>
            )}

            {/* Stage 5: Grand Majestic Tree of Wisdom */}
            {treeStage === 5 && (
              <g className="animate-fade-in">
                {/* Aura of inner peace */}
                <circle cx="160" cy="115" r="105" fill="#E2EFE7" opacity="0.45" />

                <path d="M 160 282 C 153 235, 153 170, 160 110" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="26" strokeLinecap="round" fill="none" />
                <path d="M 158 210 C 115 175, 75 160, 50 120" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M 160 190 C 205 155, 245 140, 270 100" stroke={`url(#trunkGrad_${gradientId})`} strokeWidth="12" strokeLinecap="round" fill="none" />

                <circle cx="50" cy="115" r="40" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="270" cy="95" r="40" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="95" cy="55" r="44" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="225" cy="50" r="44" fill={`url(#leafGrad_${gradientId})`} />
                <circle cx="160" cy="75" r="58" fill={`url(#leafGrad_${gradientId})`} />

                {/* Golden Wisdom Fruits & Blossoms */}
                <circle cx="60" cy="110" r="8" fill={`url(#fruitGrad_${gradientId})`} />
                <circle cx="260" cy="90" r="8" fill={`url(#fruitGrad_${gradientId})`} />
                <circle cx="100" cy="45" r="9" fill={`url(#fruitGrad_${gradientId})`} />
                <circle cx="220" cy="40" r="9" fill={`url(#fruitGrad_${gradientId})`} />
                <circle cx="160" cy="55" r="10" fill={`url(#fruitGrad_${gradientId})`} />

                <circle cx="75" cy="130" r="6" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="245" cy="110" r="6" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="145" cy="90" r="7" fill={`url(#flowerGrad_${gradientId})`} />
                <circle cx="175" cy="85" r="7" fill={`url(#flowerGrad_${gradientId})`} />
              </g>
            )}
          </svg>

          {/* Water bonus pill */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D5DED7] text-[14px] text-[#515B55] font-bold shadow-2xs">
            <span>💧 {language === 'en' ? 'Mindful Waters:' : 'ريات الاهتمام:'}</span>
            <span className="text-[#174F3F] font-black">{waterBonus}</span>
          </div>
        </div>

        {/* Tree Details & Metric Cards */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Progress bar toward next stage */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[15px] font-bold text-[#515B55]">
              <span>{t('tree.progress_label', 'اكتمال نمو المرحلة الحالية')}</span>
              <span className="text-[#174F3F] font-mono text-[16px]">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#E2EFE7] overflow-hidden border border-[#D5DED7]">
              <div 
                className="h-full bg-linear-to-r from-[#23785B] to-[#174F3F] transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <p className="text-[16px] text-[#515B55] leading-relaxed">
              {t('tree.growth_tip', 'كل نشاط تقوم به في التطبيق يروي شجرتك ويزيد من فروعها وأزهارها.')}
            </p>
          </div>

          {/* 4 Large Clean Activity Metric Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7]">
              <div className="flex items-center gap-2 text-[#174F3F]">
                <Wind className="w-5 h-5 text-[#23785B]" />
                <span className="text-[16px] font-bold">{language === 'en' ? 'Mindful Sessions' : 'تمارين السكينة'}</span>
              </div>
              <div className="text-[24px] font-bold text-[#174F3F] mt-1">
                {stats.exercisesCount}
              </div>
              <div className="text-[14px] text-[#515B55]">{t('tree.stat_exercises', 'جلسات تنفس ويقظة')}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7]">
              <div className="flex items-center gap-2 text-[#174F3F]">
                <BookOpen className="w-5 h-5 text-[#23785B]" />
                <span className="text-[16px] font-bold">{language === 'en' ? 'Readings & Notes' : 'القراءات والفوائد'}</span>
              </div>
              <div className="text-[24px] font-bold text-[#174F3F] mt-1">
                {stats.readingsCount}
              </div>
              <div className="text-[14px] text-[#515B55]">{t('tree.stat_readings', 'ملاحظات ومفضلات')}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7]">
              <div className="flex items-center gap-2 text-[#174F3F]">
                <CheckCircle2 className="w-5 h-5 text-[#23785B]" />
                <span className="text-[16px] font-bold">{language === 'en' ? 'Emotional Check-ins' : 'تفقد المشاعر'}</span>
              </div>
              <div className="text-[24px] font-bold text-[#174F3F] mt-1">
                {stats.checkinsCount}
              </div>
              <div className="text-[14px] text-[#515B55]">{t('tree.stat_checkins', 'تسجيلات مزاج واعية')}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7]">
              <div className="flex items-center gap-2 text-[#174F3F]">
                <Award className="w-5 h-5 text-[#B78327]" />
                <span className="text-[16px] font-bold">{language === 'en' ? 'Gratitude Habits' : 'عادات الامتنان'}</span>
              </div>
              <div className="text-[24px] font-bold text-[#174F3F] mt-1">
                {stats.habitsCount}
              </div>
              <div className="text-[14px] text-[#515B55]">{t('tree.stat_habits', 'نباتات وعادات مزهرة')}</div>
            </div>
          </div>

          {/* Direct CTA to Exercises & Reading */}
          {onNavigate && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => onNavigate('breathe')}
                className="flex-1 min-h-[48px] px-4 py-2 bg-[#23785B] hover:bg-[#174F3F] text-white text-[17px] font-bold rounded-2xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🌊 {language === 'en' ? 'Start Breathing Session' : 'ابدأ تمرين تنفس الآن'}</span>
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className="flex-1 min-h-[48px] px-4 py-2 bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] text-[17px] font-bold border border-[#D5DED7] rounded-2xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
              >
                <span>📚 {language === 'en' ? 'Explore Guides to Grow Tree' : 'اقرأ دليلاً لتغذية الشجرة'}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
