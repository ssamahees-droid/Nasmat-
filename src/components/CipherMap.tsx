/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { CIPHER_WORLDS, CIPHER_LEVELS, CIPHER_SECRETS } from '../data/nesmatCipherData';

export interface CipherMapProps {
  completedLevels: number[];
  currentSelectedLevelId: number;
  selectedWorldId: 1 | 2 | 3;
  onSelectWorld: (worldId: 1 | 2 | 3) => void;
  onSelectLevel: (lvlId: number) => void;
  onOpenSecret?: (secretId: string) => void;
  solvedSecrets: string[];
}

export const CipherMap: React.FC<CipherMapProps> = ({
  completedLevels,
  currentSelectedLevelId,
  selectedWorldId,
  onSelectWorld,
  onSelectLevel,
  onOpenSecret,
  solvedSecrets
}) => {
  const world = CIPHER_WORLDS.find(w => w.id === selectedWorldId) || CIPHER_WORLDS[0];
  const worldLevels = CIPHER_LEVELS.filter(l => l.worldId === world.id);
  const [minL, maxL] = world.levelsRange;
  const worldCompletedCount = completedLevels.filter(id => id >= minL && id <= maxL).length;
  const progressPercent = Math.round((worldCompletedCount / 10) * 100);

  let atmosphereText = '';
  let atmosphereIcon = '🌿';
  if (world.id === 1) {
    atmosphereText = worldCompletedCount === 10 
      ? 'انقشع الضباب تماماً وأشرقت حديقة البدايات بشرفة الإشراق!' 
      : `الضباب يتراجع تدريجياً: ${worldCompletedCount} من 10 زهور متفتحة في الممر.`;
    atmosphereIcon = worldCompletedCount >= 5 ? '🌸' : '🌿';
  } else if (world.id === 2) {
    atmosphereText = worldCompletedCount === 10
      ? 'أضاءت مكتبة الأسرار بالكامل وفتحت قاعة النور أبوابها!'
      : `أروقة المعرفة تضيء خطوة بخطوة: ${worldCompletedCount} من 10 مخطوطات مكتشفة.`;
    atmosphereIcon = '📚';
  } else {
    atmosphereText = worldCompletedCount === 10
      ? 'توهجت بلورات الكهف ووصلت إلى قمة التحرر!'
      : `أنماط الوعي تظهر في العتمة: ${worldCompletedCount} من 10 بلورات متوهجة.`;
    atmosphereIcon = '💎';
  }

  const worldSecret = CIPHER_SECRETS.find(s => s.worldId === world.id);
  const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
  const isSecretUnlocked = worldSecret ? (
    (world.id === 1 && maxCompleted >= 5) ||
    (world.id === 2 && maxCompleted >= 15) ||
    (world.id === 3 && maxCompleted >= 25)
  ) : false;
  const isSecretSolved = worldSecret ? solvedSecrets.includes(worldSecret.id) : false;

  return (
    <div className="space-y-8 max-w-3xl mx-auto font-cairo">
      {/* World selector header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CIPHER_WORLDS.map(w => {
          const [minVal, maxVal] = w.levelsRange;
          const count = completedLevels.filter(id => id >= minVal && id <= maxVal).length;
          return (
            <button
              key={w.id}
              onClick={() => onSelectWorld(w.id)}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedWorldId === w.id
                  ? 'bg-white dark:bg-[#1E2B24] border-[#23785B] shadow-md ring-2 ring-[#23785B]/20'
                  : 'bg-white/60 dark:bg-stone-800/60 border-[#D5DED7] dark:border-stone-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#23785B] dark:text-emerald-400">
                  {w.subtitle}
                </span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  {count} / 10
                </span>
              </div>
              <h3 className="text-base font-black text-[#174F3F] dark:text-white">
                {w.name}
              </h3>
              <p className="text-[11px] text-[#515B55] dark:text-stone-300 mt-1 line-clamp-2">
                {w.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* World Adventure Path & Atmosphere */}
      <div className="bg-white dark:bg-[#1A2520] border border-[#D5DED7] dark:border-stone-700 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-[#D5DED7] dark:border-stone-700 pb-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E2EFE7] dark:bg-emerald-950 text-[#174F3F] dark:text-emerald-300 text-xs font-bold rounded-full">
              <Flame className="w-3.5 h-3.5 text-[#B78327]" />
              <span>نهاية العالم الكبرى: {world.finaleTitle}</span>
            </div>
            <span className="text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
              التقدم: {worldCompletedCount} / 10 ({progressPercent}%)
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[#174F3F] dark:text-white flex items-center gap-2">
              <span>{world.name}</span>
              <span className="text-sm font-medium text-[#515B55] dark:text-stone-300">({world.subtitle})</span>
            </h3>
            <p className="text-xs text-[#515B55] dark:text-stone-300 mt-1 leading-relaxed">
              {world.description}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F5EF] dark:bg-[#121A16] border border-[#D5DED7] dark:border-stone-700 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-lg shrink-0">
              {atmosphereIcon}
            </div>
            <div className="text-xs font-bold text-[#174F3F] dark:text-emerald-300">
              {atmosphereText}
            </div>
          </div>

          {/* Living Secret Signal */}
          {worldSecret && (
            isSecretSolved ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-base">{worldSecret.icon}</span>
                  <span className="font-bold text-[#174F3F] dark:text-emerald-300">
                    مقتنى هذا العالم المكتشف: {worldSecret.collectibleItem} ✨
                  </span>
                </div>
                {onOpenSecret && (
                  <button
                    onClick={() => onOpenSecret(worldSecret.id)}
                    className="text-[11px] font-bold text-[#23785B] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    عرض السر
                  </button>
                )}
              </div>
            ) : isSecretUnlocked ? (
              <div className="p-3.5 rounded-2xl bg-[#F8EED8] dark:bg-amber-950/60 border border-[#B78327]/40 flex items-center justify-between gap-2 animate-fade-in shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl animate-bounce">{worldSecret.icon}</span>
                  <div>
                    <span className="text-xs font-black text-[#174F3F] dark:text-amber-200 block">
                      وميض استكشافي: تراءت لك إشارة سر خفي في أرجاء {world.name}!
                    </span>
                    <span className="text-[11px] text-stone-600 dark:text-stone-300">
                      {worldSecret.puzzleTitle} — انقر لفك شفرة اللغز واكتشافه
                    </span>
                  </div>
                </div>
                {onOpenSecret && (
                  <button
                    onClick={() => onOpenSecret(worldSecret.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#174F3F] hover:bg-[#11382C] text-white text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
                  >
                    ابدأ الاستكشاف 🔍
                  </button>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-stone-900/40 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>سر هذا العالم: {worldSecret.name} (يظهر بعد إكمال {world.id === 1 ? '5 مراحل' : world.id === 2 ? '15 مرحلة' : '25 مرحلة'})</span>
              </div>
            )
          )}
        </div>

        {/* Adventure Serpentine Path */}
        <div className="space-y-4 py-2">
          <div className="text-xs font-bold text-[#515B55] dark:text-stone-400 px-1">
            مسار المغامرة المتعرج — انقر على المحطة المتاحة للبدء:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {worldLevels.map((lvl) => {
              const isCompleted = completedLevels.includes(lvl.id);
              const isUnlocked = lvl.id <= maxCompleted + 1;
              const isNextAvailable = isUnlocked && !isCompleted;

              return (
                <button
                  key={lvl.id}
                  onClick={() => onSelectLevel(lvl.id)}
                  disabled={!isUnlocked}
                  className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer group ${
                    isCompleted
                      ? 'bg-[#E2EFE7]/80 dark:bg-emerald-950/50 border-[#23785B] text-[#174F3F] dark:text-emerald-200 shadow-xs hover:border-[#174F3F]'
                      : isNextAvailable
                      ? 'bg-white dark:bg-[#202C26] border-2 border-[#B78327] ring-4 ring-[#B78327]/15 text-[#174F3F] dark:text-white shadow-md scale-[1.01]'
                      : isUnlocked
                      ? 'bg-white dark:bg-stone-800 border-[#D5DED7] dark:border-stone-700 text-[#292F2B] dark:text-stone-200 hover:border-[#23785B]'
                      : 'bg-stone-100 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isNextAvailable && (
                    <div className="absolute top-0 left-0 bg-[#B78327] text-white text-[10px] font-black px-2.5 py-0.5 rounded-br-xl shadow-xs">
                      المرحلة التالية 🌟
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        isCompleted ? 'bg-[#23785B] text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                      }`}>
                        محطة #{lvl.id}
                      </span>
                      <span className="text-[11px] font-medium text-[#515B55] dark:text-stone-400">
                        {lvl.subtitle}
                      </span>
                    </div>

                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-900 text-[#23785B] dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                    ) : isUnlocked ? (
                      <Sparkles className="w-4 h-4 text-[#B78327] animate-pulse" />
                    ) : (
                      <Lock className="w-4 h-4 text-stone-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-[#174F3F] dark:text-white group-hover:text-[#23785B] transition-colors">
                      {lvl.title}
                    </h4>
                    <p className="text-[11px] text-[#515B55] dark:text-stone-300 mt-1 line-clamp-1">
                      {lvl.storyChapter}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400">
                    <span>{isCompleted ? 'مكتمل بنجاح ✨' : isUnlocked ? 'متاح للعب 🚀' : 'مغلق حتى تكتمل المحطة السابقة 🔒'}</span>
                    <span className="text-[#23785B] dark:text-emerald-400">← تفاصيل المحطة</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
