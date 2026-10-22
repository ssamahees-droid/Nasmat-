/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GrowthTreeWidget
 * Interactive virtual tree that grows based on user activities (mindfulness sessions, 
 * gratitude plants, completed habits, and daily check-ins).
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Leaf, Award, Droplet, Sun, Heart, ArrowLeft, Trophy } from 'lucide-react';
import { storage, GratitudePlant } from '../services/storage';
import { chimeService } from '../services/chimeService';

interface GrowthTreeWidgetProps {
  onNavigate: (tab: string) => void;
  onOpenGratitudeGarden?: () => void;
}

export const GrowthTreeWidget: React.FC<GrowthTreeWidgetProps> = ({
  onNavigate,
  onOpenGratitudeGarden
}) => {
  const [totalScore, setTotalScore] = useState(0);
  const [treeLevel, setTreeLevel] = useState(1);
  const [stageName, setStageName] = useState('بذرة نائمة في التربة');
  const [stats, setStats] = useState({
    mindfulnessCount: 0,
    plantsCount: 0,
    checkinsCount: 0,
    habitsCount: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateGrowth = () => {
    try {
      const mindfulness = storage.getMindfulnessRecords().length;
      const plants = storage.getGratitudePlants().length;
      const checkins = storage.getDailyCheckins().length;
      const habits = storage.getHabits().reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);

      // Score formula: each mindfulness session = 15 pts, gratitude plant = 20 pts, check-in = 5 pts, habit = 10 pts
      const score = (mindfulness * 15) + (plants * 20) + (checkins * 5) + (habits * 10) + 30; // +30 bonus base so it starts at a sprouting seedling

      setStats({
        mindfulnessCount: mindfulness,
        plantsCount: plants,
        checkinsCount: checkins,
        habitsCount: habits
      });
      setTotalScore(score);

      // Determine tree level (1 to 5)
      if (score < 60) {
        setTreeLevel(1);
        setStageName('🌱 بذرة الأمل والبدايات');
      } else if (score < 140) {
        setTreeLevel(2);
        setStageName('🌿 شتلة فتية تتفتح بالأوراق');
      } else if (score < 260) {
        setTreeLevel(3);
        setStageName('🌳 شجرة مزهرة بالسلام الداخلي');
      } else if (score < 450) {
        setTreeLevel(4);
        setStageName('🌲 شجرة وافرة الظلال والسكينة');
      } else {
        setTreeLevel(5);
        setStageName('✨ شجرة الحكمة واليقظة المضيئة');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    calculateGrowth();
  }, []);

  const handleWaterTree = () => {
    chimeService.playFlowerBloomChime();
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  // Tree Visual based on level
  const renderTreeVisual = () => {
    switch (treeLevel) {
      case 1:
        return (
          <div className="relative flex flex-col items-center justify-center py-2 animate-bounce-slow">
            <div className="text-4xl sm:text-5xl filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.4)]">🌱</div>
            <div className="w-16 h-3 bg-amber-900/60 rounded-full mt-1 blur-2xs" />
          </div>
        );
      case 2:
        return (
          <div className="relative flex flex-col items-center justify-center py-2 animate-pulse">
            <div className="text-5xl sm:text-6xl filter drop-shadow-[0_6px_16px_rgba(16,185,129,0.5)]">🌿</div>
            <div className="w-20 h-3.5 bg-amber-900/70 rounded-full mt-1" />
          </div>
        );
      case 3:
        return (
          <div className="relative flex flex-col items-center justify-center py-1">
            <div className="text-6xl sm:text-7xl filter drop-shadow-[0_8px_20px_rgba(16,185,129,0.6)] animate-float">🌳</div>
            <div className="w-24 h-4 bg-amber-950/80 rounded-full mt-1" />
          </div>
        );
      case 4:
        return (
          <div className="relative flex flex-col items-center justify-center py-1">
            <div className="text-6xl sm:text-7xl filter drop-shadow-[0_10px_25px_rgba(245,158,11,0.5)] animate-float">🌸🌲</div>
            <div className="w-28 h-4.5 bg-amber-950/90 rounded-full mt-1" />
          </div>
        );
      case 5:
      default:
        return (
          <div className="relative flex flex-col items-center justify-center py-1">
            <div className="text-6xl sm:text-7xl filter drop-shadow-[0_12px_30px_rgba(16,185,129,0.8)] animate-float">✨🌳✨</div>
            <div className="w-32 h-5 bg-amber-950 rounded-full mt-1" />
          </div>
        );
    }
  };

  // Next level threshold
  const nextLevelThreshold = treeLevel === 1 ? 60 : treeLevel === 2 ? 140 : treeLevel === 3 ? 260 : treeLevel === 4 ? 450 : 600;
  const prevThreshold = treeLevel === 1 ? 0 : treeLevel === 2 ? 60 : treeLevel === 3 ? 140 : treeLevel === 4 ? 260 : 450;
  const progressPercent = Math.min(100, Math.max(0, ((totalScore - prevThreshold) / (nextLevelThreshold - prevThreshold)) * 100));

  return (
    <section className="relative overflow-hidden p-5 sm:p-7 rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#10251B] via-[#0C1B14] to-[#07100B] border border-emerald-500/30 text-white shadow-xl space-y-4 text-right">
      
      {/* Ambient background aura */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🌳
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>شجرة نمو الوعي والسكينة</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              {stageName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleWaterTree}
            className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="اسقِ شجرتك بالامتنان والاهتمام"
          >
            <Droplet className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>اسقِ شجرتك 💧</span>
          </button>

          {onOpenGratitudeGarden && (
            <button
              onClick={onOpenGratitudeGarden}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>حديقة الامتنان 🌸</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Center Interactive Tree Display & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-black/30 p-4 rounded-2xl border border-white/10 relative z-10">
        
        {/* Visual Tree */}
        <div className="flex flex-col items-center justify-center p-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/20">
          {renderTreeVisual()}
          <span className="text-[11px] text-emerald-300 font-bold mt-2">
            مستوى الشجرة: {treeLevel} من 5 ✨
          </span>
        </div>

        {/* Growth Progress Bar & Details */}
        <div className="md:col-span-2 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-300">معدل نمو الوعي والتفاعل:</span>
              <span className="text-emerald-400 font-jetbrains">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-400">
              كلما أتممت جلسة تنفس، أو زرعت نبتة امتنان، أو سجلت مزاجك اليومي، أو طورت عاداتك.. كلما ازدهرت شجرتك وأشرقت!
            </p>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-black text-emerald-400 font-jetbrains">{stats.mindfulnessCount}</div>
              <div className="text-[10px] text-stone-300">جلسات تنفس</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-black text-amber-400 font-jetbrains">{stats.plantsCount}</div>
              <div className="text-[10px] text-stone-300">نباتات امتنان</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-black text-cyan-400 font-jetbrains">{stats.checkinsCount}</div>
              <div className="text-[10px] text-stone-300">تفقدات مشاعر</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm font-black text-pink-400 font-jetbrains">{stats.habitsCount}</div>
              <div className="text-[10px] text-stone-300">عادات مُنجزة</div>
            </div>
          </div>
        </div>

      </div>

      {/* Celebration Toast Modal */}
      {showCelebration && (
        <div className="absolute inset-0 z-30 bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-center">
          <div className="space-y-2">
            <div className="text-4xl animate-bounce">💧✨🌸</div>
            <h4 className="font-black text-base text-white">ارتوت شجرتك بنجاح!</h4>
            <p className="text-xs text-emerald-200">استمر في رعاية روحك، فكل خطوة صغنونة تصنع فرقاً كبيراً.</p>
          </div>
        </div>
      )}

    </section>
  );
};
