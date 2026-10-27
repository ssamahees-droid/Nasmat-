/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AppHubCard - Unified Mobile App Installation, Sharing & Auto-Update Hub
 */

import React, { useState } from 'react';
import { Smartphone, Share2, RefreshCw, Download, CheckCircle2, Copy, Sparkles, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { shareContent } from '../services/shareService';
import { AchievementShareCardModal } from './AchievementShareCardModal';
import { BrandedIdentityCardModal } from './BrandedIdentityCardModal';

export const AppHubCard: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBrandedCardOpen, setIsBrandedCardOpen] = useState(false);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!isInstallable) {
      setShowIOSGuide(true);
      return;
    }

    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
      }
    } catch (_) {
    } finally {
      setIsInstalling(false);
    }
  };

  const handleShare = async () => {
    const res = await shareContent({
      title: 'نسمة حياة | Nesma Hayat',
      text: 'منصة عربية تفاعلية للصحة النفسية والاستكشاف الذاتي الآمن، وتمارين الاسترخاء والتهدئة.',
      url: window.location.origin
    });
    if (res.success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCheckForUpdates = async () => {
    setIsUpdating(true);
    setUpdateMessage('جارٍ فحص التحديثات...');
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.update();
        if (reg.waiting || reg.installing) {
          setUpdateMessage('✨ تم العثور على تحديث جديد! جاري تطبيق الإصدار الأحدث...');
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }
      }
      setUpdateMessage('✅ تطبيقك محدث لأحدث إصدار بالكامل!');
      setTimeout(() => setUpdateMessage(null), 3500);
    } catch (_) {
      setUpdateMessage('⚠️ يعمل التطبيق بأحدث نسخة متوفرة لديك أوفلاين.');
      setTimeout(() => setUpdateMessage(null), 3500);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#174F3F] via-[#123E32] to-[#0D2C24] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-xl text-right text-white relative overflow-hidden space-y-5">
      
      {/* Decorative glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>مركز التطبيق المحمول (PWA & المشاركة)</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            تثبيت، مشاركة، وتحديث تلقائي
          </h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            ثبّت التطبيق كبرنامج مستقل على هاتفك، شارك الهدوء مع أحبابك، وتأكد من حصولك على أحدث تحسينات الأمان والسكينة.
          </p>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        
        {/* 1. Install Button */}
        <button
          onClick={handleInstall}
          disabled={isInstalling || isInstalled || installSuccess}
          className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-xs transition-all cursor-pointer shadow-md ${
            isInstalled || installSuccess
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95'
          }`}
        >
          {isInstalled || installSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>التطبيق مثبت ✓</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{isInstalling ? 'جارٍ التثبيت...' : 'تثبيت على الشاشة'}</span>
            </>
          )}
        </button>

        {/* 2. Share Button */}
        <button
          onClick={handleShare}
          className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          {copiedLink ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تم نسخ الرابط 📋</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>نسخ رابط التطبيق</span>
            </>
          )}
        </button>

        {/* 3. Share App Cards Button */}
        <button
          onClick={() => setIsCardModalOpen(true)}
          className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>شارك تطبيق نسمة حياة (بطاقات)</span>
        </button>

        {/* 4. Auto-Update Check Button */}
        <button
          onClick={handleCheckForUpdates}
          disabled={isUpdating}
          className="p-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${isUpdating ? 'animate-spin' : ''}`} />
          <span>{isUpdating ? 'جارٍ الفحص...' : 'فحص التحديثات'}</span>
        </button>

        {/* 5. Visual Branded Card Generator */}
        <button
          onClick={() => setIsBrandedCardOpen(true)}
          className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-600/30 to-amber-500/20 border border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>مُنشئ البطاقة التعريفية البصرية الرسمية (PNG) 🎨</span>
        </button>

      </div>

      {/* Achievement / App Share Card Modal */}
      <AchievementShareCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />

      {/* Standalone Branded Identity Card Modal */}
      <BrandedIdentityCardModal
        isOpen={isBrandedCardOpen}
        onClose={() => setIsBrandedCardOpen(false)}
      />

      {/* Status or Update Toast */}
      {updateMessage && (
        <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/40 text-xs text-emerald-200 text-center font-bold animate-fade-in">
          {updateMessage}
        </div>
      )}

      {/* iOS or Manual Install Guide */}
      {(showIOSGuide || isIOS) && (
        <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/30 text-xs text-emerald-100 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <HelpCircle className="w-4 h-4" />
            <span>خطوات التثبيت على نظام آبل (iOS / iPhone):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-emerald-200 pr-2">
            <li>اضغط على زر المشاركة <span className="font-bold text-white">Share (مشاركة)</span> في متصفح سفاري.</li>
            <li>اختر من القائمة <span className="font-bold text-white">«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</span>.</li>
            <li>اضغط على <span className="font-bold text-white">«إضافة» (Add)</span> ليتثبت التطبيق فوراً كبرنامج مستقل.</li>
          </ol>
        </div>
      )}

    </div>
  );
};
