/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PWAInstallCard.tsx
 * A prominent, clear message and 1-click action card on HomeScreen for:
 * 1. Automatic 1-click app installation (without lengthy manual guides)
 * 2. 1-click update check and instant refresh
 * 3. 1-click app sharing (Web Share API with fallback modal)
 */

import React, { useState } from 'react';
import { Download, RefreshCw, Share2, CheckCircle2, Smartphone, Sparkles, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ShareFallbackModal } from './ShareFallbackModal';
import { PWAInstallGuideModal } from './PWAInstallGuideModal';

export const PWAInstallCard: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installNotice, setInstallNotice] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateNotice, setUpdateNotice] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // 1. Automatic 1-Click Install
  const handleAutoInstall = async () => {
    if (isInstalled) {
      setInstallNotice('تطبيق «نسمة حياة» مثبت ومتاح بالفعل على شاشتك الرئيسية ✅');
      setTimeout(() => setInstallNotice(null), 4000);
      return;
    }

    setIsInstalling(true);
    setInstallNotice(null);

    try {
      const success = await install();
      if (success) {
        setInstallNotice('تم تثبيت التطبيق بنجاح على جهازك! 🎉');
      } else {
        // If the browser doesn't expose deferred prompt (e.g. running in an embedded WebView or unsupported mode)
        if (!isInstallable) {
          setInstallNotice('التطبيق جاهز وسريع كبرنامج ويب فوري؛ يمكنك استخدامه ومشاركته مباشرة 🌿');
        }
      }
    } catch (_) {
      setInstallNotice('التطبيق جاهز للاستخدام مباشرة دون قيود 🌿');
    } finally {
      setIsInstalling(false);
      setTimeout(() => setInstallNotice(null), 5000);
    }
  };

  // 2. 1-Click Update
  const handleCheckUpdate = async () => {
    setIsUpdating(true);
    setUpdateNotice(null);

    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.update();
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
          return;
        }
      }
      setUpdateNotice('أنت تستخدم أحدث إصدار من «نسمة حياة» ✨');
    } catch (_) {
      setUpdateNotice('تطبيقك محدث وجاهز دائماً للعمل 🌿');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateNotice(null), 4000);
    }
  };

  // 3. 1-Click Share
  const handleShareApp = async () => {
    const shareData = {
      title: 'تطبيق «نسمة حياة» 🌿',
      text: '🌿 تعرّف على تطبيق «نسمة حياة»: مساحة عربية آمنة للصحة النفسية، تمارين السكينة، والألعاب التأملية الهادئة.',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app'
    };

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err && err.name !== 'AbortError') {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  return (
    <>
      <section 
        className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#174F3F]/30 shadow-sm transition-all text-right font-tajawal"
        aria-label="خيارات التطبيق السريعة"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Main Informative Message */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-[#E2EFE7] text-[#174F3F] border border-[#23785B]/30 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#174F3F]" />
                <span>تطبيق خفيف ومستقل (PWA)</span>
              </span>

              {isInstalled && (
                <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>مُثبت على جهازك</span>
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#174F3F] leading-snug">
              {isInstalled 
                ? '«نسمة حياة» مثبت ويعمل كبرنامج كامل على جهازك' 
                : 'تثبيت وتحديث ومشاركة تطبيق «نسمة حياة»'}
            </h3>

            <p className="text-base sm:text-lg text-[#292F2D] leading-relaxed font-normal">
              ثبّت التطبيق تلقائياً بنقرة واحدة لفتحه بسرعة من شاشتك والعمل دون إنترنت، أو شاركه مع من تحب وتأكد من حصولك على أحدث تحديث فوراً.
            </p>

            {/* Quick Link to Dedicated Visual Guide Modal */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#174F3F] hover:text-[#205746] underline underline-offset-4 cursor-pointer transition-colors active:scale-95"
              >
                <span>💡</span>
                <span>اعرف كيف تثبت التطبيق</span>
              </button>
            </div>

            {/* Dynamic Feedback Notices */}
            {installNotice && (
              <div className="p-3 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/40 text-[#174F3F] text-sm font-bold animate-fade-in flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-[#23785B]" />
                <span>{installNotice}</span>
              </div>
            )}

            {updateNotice && (
              <div className="p-3 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/40 text-[#174F3F] text-sm font-bold animate-fade-in flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-[#23785B]" />
                <span>{updateNotice}</span>
              </div>
            )}
          </div>

          {/* 3 Prominent One-Click Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            
            {/* 1. Install Button */}
            <button
              type="button"
              onClick={handleAutoInstall}
              disabled={isInstalling}
              className={`min-h-[50px] px-5 py-3.5 rounded-2xl text-[16px] sm:text-[17px] font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-60 ${
                isInstalled 
                  ? 'bg-[#E2EFE7] hover:bg-[#d4e7db] text-[#174F3F] border border-[#23785B]/40' 
                  : 'bg-[#174F3F] hover:bg-[#205746] text-white shadow-md'
              }`}
              title="تثبيت التطبيق تلقائياً على جهازك"
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#23785B]" />
                  <span>التطبيق مثبت بالفعل</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-amber-300" />
                  <span>{isInstalling ? 'جارٍ التثبيت...' : 'تثبيت التطبيق تلقائياً'}</span>
                </>
              )}
            </button>

            {/* 2. Update Button */}
            <button
              type="button"
              onClick={handleCheckUpdate}
              disabled={isUpdating}
              className="min-h-[50px] px-4 py-3.5 rounded-2xl text-[16px] font-bold bg-[#F7F5EF] hover:bg-[#EAE5D9] text-[#174F3F] border border-[#D5DED7] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
              title="التحقق من وجود تحديث جديد"
            >
              <RefreshCw className={`w-4 h-4 text-[#174F3F] ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'جارٍ الفحص...' : 'تحديث التطبيق'}</span>
            </button>

            {/* 3. Share Button */}
            <button
              type="button"
              onClick={handleShareApp}
              className="min-h-[50px] px-4 py-3.5 rounded-2xl text-[16px] font-bold bg-[#E2EFE7] hover:bg-[#d4e7db] text-[#174F3F] border border-[#23785B]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
              title="مشاركة التطبيق"
            >
              <Share2 className="w-4 h-4 text-[#205746]" />
              <span>مشاركة التطبيق</span>
            </button>

          </div>

        </div>
      </section>

      {/* Share Fallback Modal when navigator.share is unavailable */}
      <ShareFallbackModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      {/* Dedicated Step-by-Step Animated Install Guide Modal */}
      <PWAInstallGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </>
  );
};
