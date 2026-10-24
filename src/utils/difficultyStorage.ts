/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyOption {
  id: PuzzleDifficulty;
  title: string;
  shortTitle: string;
  subtitle: string;
  moodTag: string;
  icon: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    activeRing: string;
    activeBg: string;
  };
  jigsawGridSize: 3 | 4 | 5;
  jigsawAllowAutoSnap: boolean;
  spotRadiusMultiplier: number;
  spotFreeHints: number;
  logicMaxMovesLeeway: number;
}

export const DIFFICULTY_OPTIONS: Record<PuzzleDifficulty, DifficultyOption> = {
  easy: {
    id: 'easy',
    title: 'سهل (استرخاء وهدوء)',
    shortTitle: 'سهل',
    subtitle: 'مناسب لحالات الإرهاق والرغبة في استراحة هادئة بقطع كبيرة ومساعدة مستمرة',
    moodTag: 'استرخاء وراحة',
    icon: '🌱',
    colorTheme: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/30',
      border: 'border-emerald-300 dark:border-emerald-700',
      text: 'text-emerald-800 dark:text-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
      activeRing: 'ring-2 ring-emerald-500',
      activeBg: 'bg-emerald-600 text-white dark:bg-emerald-600'
    },
    jigsawGridSize: 3, // 3x3 (9 pieces)
    jigsawAllowAutoSnap: true,
    spotRadiusMultiplier: 1.4, // 40% larger touch area
    spotFreeHints: 99, // unlimited hints
    logicMaxMovesLeeway: 3
  },
  medium: {
    id: 'medium',
    title: 'متوسط (تركيز متوازن)',
    shortTitle: 'متوسط',
    subtitle: 'مناسب لتنشيط الذهن المعتدل والاستمتاع بحل متوازن وممتع',
    moodTag: 'تركيز متوازن',
    icon: '🌿',
    colorTheme: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/30',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-800 dark:text-amber-300',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
      activeRing: 'ring-2 ring-amber-500',
      activeBg: 'bg-amber-600 text-white dark:bg-amber-600'
    },
    jigsawGridSize: 4, // 4x4 (16 pieces)
    jigsawAllowAutoSnap: false,
    spotRadiusMultiplier: 1.0, // standard area
    spotFreeHints: 3, // 3 hints per puzzle
    logicMaxMovesLeeway: 1
  },
  hard: {
    id: 'hard',
    title: 'صعب (تحدٍّ وذكاء)',
    shortTitle: 'صعب',
    subtitle: 'مناسب لشحذ البصيرة واختبار مهارات الملاحظة والمنطق بشغف عميق',
    moodTag: 'تحدٍّ وذكاء',
    icon: '🔥',
    colorTheme: {
      bg: 'bg-rose-50/80 dark:bg-rose-950/30',
      border: 'border-rose-300 dark:border-rose-700',
      text: 'text-rose-800 dark:text-rose-300',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
      activeRing: 'ring-2 ring-rose-500',
      activeBg: 'bg-rose-600 text-white dark:bg-rose-600'
    },
    jigsawGridSize: 5, // 5x5 (25 pieces)
    jigsawAllowAutoSnap: false,
    spotRadiusMultiplier: 0.75, // precise touch required
    spotFreeHints: 1, // 1 hint max
    logicMaxMovesLeeway: 0
  }
};

const STORAGE_KEY = 'nesma_puzzle_difficulty';

export const getStoredDifficulty = (): PuzzleDifficulty => {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'easy' || val === 'medium' || val === 'hard') {
      return val;
    }
  } catch (e) {
    console.error('Failed reading difficulty from localStorage', e);
  }
  return 'easy';
};

export const setStoredDifficulty = (diff: PuzzleDifficulty): void => {
  try {
    localStorage.setItem(STORAGE_KEY, diff);
  } catch (e) {
    console.error('Failed writing difficulty to localStorage', e);
  }
};
