/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ConsistencyHeatmapSection.tsx
 * 30-Day Consistency Heatmap Section using Recharts for «نسمة حياة».
 * Visualizes daily check-ins, calming exercises, and wellness habit completions.
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Wind, 
  Zap, 
  Award,
  Activity,
  ArrowLeft,
  Info
} from 'lucide-react';
import { storage, MindfulnessRecord } from '../services/storage';
import { DailyCheckin, WellnessHabit } from '../types';

interface ConsistencyHeatmapSectionProps {
  onNavigateToBreathe?: () => void;
  onNavigateToPractice?: () => void;
  onOpenCheckin?: () => void;
}

export interface DayHeatmapData {
  dateStr: string;        // YYYY-MM-DD
  dayNum: number;         // 1..30
  dayName: string;        // e.g. الأحد
  dateShort: string;      // e.g. 12 أكت
  fullDate: string;       // e.g. الأحد، 12 أكتوبر
  
  // Data Points
  hasCheckin: boolean;
  moodValue?: string;
  moodLabel?: string;
  moodEmoji?: string;
  
  breathingMinutes: number;
  breathingSessionsCount: number;
  
  completedHabitsCount: number;
  totalHabitsCount: number;
  
  // Scoring
  score: number;          // 0 to 100
  level: 0 | 1 | 2 | 3 | 4; // Intensity Level
  levelLabel: string;
  color: string;
  darkColor: string;
}

const LEVEL_COLORS = {
  0: { light: '#E2EFE7', dark: '#1B342A', label: 'بدون نشاط ☕', text: 'text-stone-500' },
  1: { light: '#A9C5A0', dark: '#26493B', label: 'التزام خفيف 🍃', text: 'text-emerald-700 dark:text-emerald-300' },
  2: { light: '#23785B', dark: '#174F3F', label: 'التزام متوسط 🌿', text: 'text-emerald-800 dark:text-emerald-200' },
  3: { light: '#174F3F', dark: '#23785B', label: 'استمرارية ممتازة 🌟', text: 'text-emerald-900 dark:text-emerald-100' },
  4: { light: '#B78327', dark: '#E2B66C', label: 'إنجاز يومي مثالي 👑', text: 'text-amber-800 dark:text-amber-200' }
};

export const ConsistencyHeatmapSection: React.FC<ConsistencyHeatmapSectionProps> = ({
  onNavigateToBreathe,
  onNavigateToPractice,
  onOpenCheckin
}) => {
  const [activeMetric, setActiveMetric] = useState<'overall' | 'breathing' | 'checkins'>('overall');
  const [selectedDay, setSelectedDay] = useState<DayHeatmapData | null>(null);

  // Calculate 30-day heatmap dataset
  const heatmapData = useMemo(() => {
    const checkins = storage.getDailyCheckins();
    const mindfulness = storage.getMindfulnessRecords();
    const habits = storage.getHabits();

    // Map check-ins by date
    const checkinsByDate = new Map<string, DailyCheckin>();
    checkins.forEach(c => checkinsByDate.set(c.date, c));

    // Map mindfulness duration by date
    const mindfulnessByDate = new Map<string, { minutes: number; count: number }>();
    mindfulness.forEach(m => {
      const rawDate = m.completedAt || '';
      const dateKey = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '';
      if (dateKey) {
        const current = mindfulnessByDate.get(dateKey) || { minutes: 0, count: 0 };
        mindfulnessByDate.set(dateKey, {
          minutes: current.minutes + Math.round((m.durationSeconds || 180) / 60),
          count: current.count + 1
        });
      }
    });

    const days: DayHeatmapData[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayName = d.toLocaleDateString('ar-EG', { weekday: 'short' });
      const dateShort = d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
      const fullDate = d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

      const checkin = checkinsByDate.get(dateStr);
      const hasCheckin = !!checkin;

      const mindData = mindfulnessByDate.get(dateStr) || { minutes: 0, count: 0 };
      const breathingMinutes = mindData.minutes;
      const breathingSessionsCount = mindData.count;

      // Habit completion count for this date
      let completedHabitsCount = 0;
      habits.forEach(h => {
        if (h.completedDates && h.completedDates.includes(dateStr)) {
          completedHabitsCount++;
        }
      });

      // Calculate score (0 to 100)
      let score = 0;
      if (hasCheckin) score += 30;
      score += Math.min(40, breathingMinutes * 8); // Up to 40 pts for breathing
      score += Math.min(30, completedHabitsCount * 15); // Up to 30 pts for habits

      score = Math.min(100, Math.max(0, score));

      // Level allocation
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (score > 80) level = 4;
      else if (score > 55) level = 3;
      else if (score > 25) level = 2;
      else if (score > 0) level = 1;

      const levelInfo = LEVEL_COLORS[level];

      days.push({
        dateStr,
        dayNum: 30 - i,
        dayName,
        dateShort,
        fullDate,
        hasCheckin,
        moodValue: checkin?.moodValue,
        moodLabel: checkin ? getMoodLabel(checkin.moodValue) : undefined,
        moodEmoji: checkin ? getMoodEmoji(checkin.moodValue) : undefined,
        breathingMinutes,
        breathingSessionsCount,
        completedHabitsCount,
        totalHabitsCount: habits.length,
        score,
        level,
        levelLabel: levelInfo.label,
        color: levelInfo.light,
        darkColor: levelInfo.dark
      });
    }

    return days;
  }, []);

  // Summary Metrics Computation
  const stats = useMemo(() => {
    const activeDays = heatmapData.filter(d => d.score > 0).length;
    const activeRate = Math.round((activeDays / 30) * 100);
    const totalBreathingMins = heatmapData.reduce((acc, d) => acc + d.breathingMinutes, 0);
    const totalCheckins = heatmapData.filter(d => d.hasCheckin).length;

    // Consecutive active streak in last 30 days
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < heatmapData.length; i++) {
      if (heatmapData[i].score > 0) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Current active streak from today backwards
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].score > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      activeDays,
      activeRate,
      totalBreathingMins,
      totalCheckins,
      currentStreak,
      maxStreak
    };
  }, [heatmapData]);

  // Default selected day to today
  const selectedDayInfo = selectedDay || heatmapData[heatmapData.length - 1];

  return (
    <section className="bg-[#FFFFFF] dark:bg-[#14271F] border-2 border-[#D5DED7] dark:border-emerald-500/25 rounded-3xl sm:rounded-4xl p-5 sm:p-7 shadow-sm space-y-6 text-right font-tajawal">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-[#D5DED7] dark:border-stone-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-300 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
            🗓️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-[#174F3F] dark:text-emerald-300">
                خريطة الالتزام والاستمرارية (٣٠ يوماً) 🌿
              </h3>
              <span className="text-[10px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                مخطط Recharts ✨
              </span>
            </div>
            <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
              تتبع بصرّي دقيق لانتظامك في تفقد المشاعر، تمارين التنفس، والعناية بذاتك
            </p>
          </div>
        </div>

        {/* View Metric Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F7F5EF] dark:bg-[#1A3329] border border-[#D5DED7] dark:border-stone-800 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMetric('overall')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMetric === 'overall'
                ? 'bg-[#174F3F] text-white shadow-xs'
                : 'text-[#515B55] dark:text-stone-300 hover:bg-stone-200/50'
            }`}
          >
            📊 الشامل
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('breathing')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMetric === 'breathing'
                ? 'bg-[#23785B] text-white shadow-xs'
                : 'text-[#515B55] dark:text-stone-300 hover:bg-stone-200/50'
            }`}
          >
            🫁 دقائق التهدئة
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('checkins')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMetric === 'checkins'
                ? 'bg-[#B78327] text-white shadow-xs'
                : 'text-[#515B55] dark:text-stone-300 hover:bg-stone-200/50'
            }`}
          >
            💖 المشاعر
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F7F5EF] dark:bg-[#1A3329] border border-[#D5DED7] dark:border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#515B55] dark:text-stone-400 font-bold">
            <span>الأيام النشطة</span>
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#174F3F] dark:text-emerald-200">
            {stats.activeDays} <span className="text-xs font-normal text-stone-500">/ 30 يوماً</span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            معدل استمرار {stats.activeRate}%
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F7F5EF] dark:bg-[#1A3329] border border-[#D5DED7] dark:border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#515B55] dark:text-stone-400 font-bold">
            <span>أطول سلسلة استمرار</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300">
            {stats.maxStreak} <span className="text-xs font-normal text-stone-500">أيام متتالية</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
            السلسلة الحالية: {stats.currentStreak} يوم 🔥
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F7F5EF] dark:bg-[#1A3329] border border-[#D5DED7] dark:border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#515B55] dark:text-stone-400 font-bold">
            <span>إجمالي دقائق التهدئة</span>
            <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-teal-800 dark:text-teal-200">
            {stats.totalBreathingMins} <span className="text-xs font-normal text-stone-500">دقيقة</span>
          </div>
          <p className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold">
            تمارين تنفس ويقظة 🫁
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F7F5EF] dark:bg-[#1A3329] border border-[#D5DED7] dark:border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#515B55] dark:text-stone-400 font-bold">
            <span>تفقدات المشاعر</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-800 dark:text-rose-300">
            {stats.totalCheckins} <span className="text-xs font-normal text-stone-500">تسجيلاً</span>
          </div>
          <p className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold">
            وعي بالرادار اليومي 💖
          </p>
        </div>
      </div>

      {/* Main Recharts BarChart Heatmap Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#515B55] dark:text-stone-400">
          <span>مخطط خريطة الاستمرارية عبر الـ ٣٠ يوماً الأخيرة:</span>
          <span>منذ ٣٠ يوماً ← اليوم</span>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2 bg-[#F7F5EF]/60 dark:bg-[#172B22]/60 rounded-2xl border border-[#D5DED7] dark:border-stone-800 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={heatmapData}
              margin={{ top: 15, right: 10, left: -20, bottom: 25 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  setSelectedDay(state.activePayload[0].payload as DayHeatmapData);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(213,222,215,0.4)" />
              <XAxis 
                dataKey="dateShort" 
                tick={{ fontSize: 10, fill: '#515B55' }}
                interval={2}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#515B55' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomRechartsHeatmapTooltip />} 
                cursor={{ fill: 'rgba(23,79,63,0.08)' }}
              />
              <ReferenceLine y={50} stroke="#B78327" strokeDasharray="3 3" label={{ value: 'معدل جيد', fill: '#B78327', fontSize: 10, position: 'right' }} />
              
              <Bar 
                dataKey={activeMetric === 'breathing' ? 'breathingMinutes' : activeMetric === 'checkins' ? 'hasCheckin' : 'score'} 
                radius={[6, 6, 0, 0]}
              >
                {heatmapData.map((entry, index) => {
                  let fillColor = entry.color;
                  if (entry.level === 4) fillColor = '#B78327'; // Gold
                  else if (entry.level === 3) fillColor = '#174F3F'; // Deep emerald
                  else if (entry.level === 2) fillColor = '#23785B'; // Interactive green
                  else if (entry.level === 1) fillColor = '#A9C5A0'; // Sage
                  else fillColor = '#CBD5E1'; // Neutral

                  return <Cell key={`cell-${index}`} fill={fillColor} className="cursor-pointer hover:opacity-85 transition-opacity" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 30-Day Grid Square Matrix (Visual Calendar Heatmap Tiles) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-300">
          <span>شبكة الأيام الثلاثين (انقر على أي يوم لمعاينة التفاصيل):</span>
          
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
            <span>أقل</span>
            <span className="w-3 h-3 rounded-xs bg-[#CBD5E1] dark:bg-stone-800" />
            <span className="w-3 h-3 rounded-xs bg-[#A9C5A0]" />
            <span className="w-3 h-3 rounded-xs bg-[#23785B]" />
            <span className="w-3 h-3 rounded-xs bg-[#174F3F]" />
            <span className="w-3 h-3 rounded-xs bg-[#B78327]" />
            <span>أعلى ⭐</span>
          </div>
        </div>

        {/* 30 Tiles Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {heatmapData.map((day) => {
            const isSelected = selectedDayInfo.dateStr === day.dateStr;
            
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                  isSelected 
                    ? 'ring-2 ring-[#174F3F] dark:ring-emerald-400 scale-105 shadow-md z-10' 
                    : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: day.color,
                  borderColor: day.level > 0 ? 'rgba(23,79,63,0.3)' : 'rgba(213,222,215,0.6)'
                }}
                title={`${day.fullDate}: ${day.levelLabel}`}
              >
                <span className="text-[10px] font-bold text-stone-900 leading-tight">
                  {day.dateShort.split(' ')[0]}
                </span>

                <span className="text-xs">
                  {day.moodEmoji || (day.breathingMinutes > 0 ? '🫁' : day.level > 0 ? '🌿' : '☕')}
                </span>

                {day.level === 4 && (
                  <span className="absolute -top-1 -right-1 text-[9px]">⭐</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDayInfo && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F5EF] dark:bg-[#1A3329] border border-[#D5DED7] dark:border-emerald-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-2 border-[#D5DED7] dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">🗓️</span>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#174F3F] dark:text-emerald-300">
                  تفاصيل يوم {selectedDayInfo.fullDate}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  مستوى الالتزام: <strong className={LEVEL_COLORS[selectedDayInfo.level].text}>{selectedDayInfo.levelLabel}</strong>
                </p>
              </div>
            </div>

            <span className="text-xs font-black px-3 py-1 rounded-full bg-white dark:bg-black/40 border border-stone-200 dark:border-stone-800 text-[#174F3F] dark:text-emerald-300">
              درجة الاستمرارية: {selectedDayInfo.score}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Checkin Status */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#14231C] border border-stone-200 dark:border-stone-800 space-y-1">
              <div className="font-bold text-stone-500 flex items-center justify-between">
                <span>تفقد المشاعر:</span>
                <Heart className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="font-extrabold text-sm text-[#174F3F] dark:text-emerald-200">
                {selectedDayInfo.hasCheckin ? (
                  <span className="flex items-center gap-1">
                    <span>{selectedDayInfo.moodEmoji}</span>
                    <span>{selectedDayInfo.moodLabel}</span>
                  </span>
                ) : (
                  <span className="text-stone-400 font-normal">لم يتم التسجيل</span>
                )}
              </div>
            </div>

            {/* Breathing Status */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#14231C] border border-stone-200 dark:border-stone-800 space-y-1">
              <div className="font-bold text-stone-500 flex items-center justify-between">
                <span>دقائق التهدئة:</span>
                <Wind className="w-3.5 h-3.5 text-teal-500" />
              </div>
              <div className="font-extrabold text-sm text-[#174F3F] dark:text-emerald-200">
                {selectedDayInfo.breathingMinutes > 0 ? (
                  <span>{selectedDayInfo.breathingMinutes} دقيقة ({selectedDayInfo.breathingSessionsCount} جلسات)</span>
                ) : (
                  <span className="text-stone-400 font-normal">لا توجد تمارين</span>
                )}
              </div>
            </div>

            {/* Habits Status */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#14231C] border border-stone-200 dark:border-stone-800 space-y-1">
              <div className="font-bold text-stone-500 flex items-center justify-between">
                <span>العادات الصحية:</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="font-extrabold text-sm text-[#174F3F] dark:text-emerald-200">
                {selectedDayInfo.completedHabitsCount > 0 ? (
                  <span>مُكتمل {selectedDayInfo.completedHabitsCount} عادات</span>
                ) : (
                  <span className="text-stone-400 font-normal">لم تُسجل عادات</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Trigger */}
          <div className="pt-1 flex flex-wrap items-center justify-end gap-2">
            {onOpenCheckin && (
              <button
                type="button"
                onClick={onOpenCheckin}
                className="px-3.5 py-2 bg-[#174F3F] hover:bg-[#123C30] text-white font-bold text-xs rounded-xl shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>تسجيل تفقد اليوم ✍️</span>
              </button>
            )}

            {onNavigateToBreathe && (
              <button
                type="button"
                onClick={onNavigateToBreathe}
                className="px-3.5 py-2 bg-[#E2EFE7] hover:bg-[#d0e5d8] text-[#174F3F] font-bold text-xs rounded-xl border border-[#23785B]/30 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>دقيقة تنفس هادئة 🌊</span>
              </button>
            )}
          </div>
        </div>
      )}

    </section>
  );
};

/**
 * Recharts Custom Tooltip for Heatmap Bar Chart
 */
const CustomRechartsHeatmapTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data: DayHeatmapData = payload[0].payload;
    return (
      <div className="p-3 bg-[#12221A] text-white rounded-xl shadow-xl border border-emerald-500/40 text-right space-y-1 font-cairo text-xs max-w-xs" dir="rtl">
        <div className="font-extrabold text-amber-300 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
          <span>{data.fullDate}</span>
          <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-200">
            {data.score}% استمرارية
          </span>
        </div>

        <p className="text-[11px] text-emerald-100 font-semibold">
          المستوى: {data.levelLabel}
        </p>

        <div className="space-y-0.5 pt-1 text-[11px] text-stone-200">
          <div>💖 الشعور: {data.hasCheckin ? `${data.moodEmoji} ${data.moodLabel}` : 'لم يُسجل'}</div>
          <div>🫁 التهدئة والتنفس: {data.breathingMinutes > 0 ? `${data.breathingMinutes} دقيقة` : 'لا يوجد'}</div>
          <div>✅ العادات المكتملة: {data.completedHabitsCount} عادات</div>
        </div>
      </div>
    );
  }
  return null;
};

function getMoodLabel(val?: string): string {
  switch (val) {
    case 'good': return 'مرتاح ومبسوط';
    case 'fair': return 'هادي ومستقر';
    case 'anxious': return 'متوتر ومضطرب';
    case 'sad': return 'حزين ومحبط';
    case 'angry': return 'منزعج وغاضب';
    default: return 'تفقد يومي';
  }
}

function getMoodEmoji(val?: string): string {
  switch (val) {
    case 'good': return '😊';
    case 'fair': return '🍃';
    case 'anxious': return '⚡';
    case 'sad': return '🌧️';
    case 'angry': return '🔥';
    default: return '💖';
  }
}
