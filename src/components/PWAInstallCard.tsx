/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallCard: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    if (!isInstallable) {
      setShowIOSInstructions(true);
      return;
    }

    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
      }
    } catch (_) {
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled || installedSuccess) {
    return (
      <div className="bg-[#E2EFE7] dark:bg-emerald-950/60 border border-[#23785B]/40 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center gap-4 text-right">
        <div className="w-12 h-12 rounded-2xl bg-[#23785B] text-white flex items-center justify-center shrink-0 shadow-inner text-xl">
          ✅
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#174F3F] dark:text-emerald-300">
            تطبيق «نسمة حياة» مثبت على جهازك
          </h3>
          <p className="text-xs text-[#515B55] dark:text-stone-300 mt-0.5 leading-relaxed">
            أصبح التطبيق يعمل كبرنامج مستقل على شاشتك الرئيسية ويدعم العمل دون إنترنت بكفاءة عالية.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#174F3F] via-[#123E32] to-[#0D2C24] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-xl text-right text-white relative overflow-hidden">
      
      {/* Decorative glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>تطبيق ويب تقدمي (PWA)</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
            ثبّت تطبيق نسمة حياة على جهازك
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            احصل على وصول سريع بنقرة واحدة من شاشتك الرئيسية، مع دعم كامل للعمل دون إنترنت، وتحديث تلقائي دائم لأحدث الميزات.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isInstalling ? 'جارٍ التثبيت...' : 'ثبّت تطبيق نسمة حياة على جهازك'}</span>
          </button>

          <button
            onClick={() => setShowIOSInstructions(!showIOSInstructions)}
            className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>طريقة التثبيت</span>
          </button>
        </div>
      </div>

      {/* Instructions drawer for iOS or manual install */}
      {(showIOSInstructions || isIOS) && (
        <div className="mt-4 pt-4 border-t border-emerald-500/30 text-xs text-emerald-200 space-y-2 animate-fade-in">
          <p className="font-bold text-amber-300">تعليمات التثبيت حسب جهازك:</p>
          <ul className="list-disc list-inside space-y-1 text-emerald-100/90 pr-2">
            <li><strong>أجهزة Android (متصفح Chrome / Edge):</strong> اضغط على زر "ثبّت الآن" بالأعلى، أو افتح قائمة المتصفح (⋮) ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</li>
            <li><strong>أجهزة iPhone / iPad (متصفح Safari):</strong> افتح قائمة المشاركة في سفاري (المربع الذي تخرج منه سهم للأعلى ⎋)، ثم اختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).</li>
            <li><strong>الكمبيوتر (Chrome / Edge):</strong> انقر على أيقونة التثبيت في شريط العنوان أعلى المتصفح.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
