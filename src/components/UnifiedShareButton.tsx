/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * UnifiedShareButton.tsx
 * Unified Share Button for main screens in «نسمة حياة»:
 * - Uses Web Share API (navigator.share) when supported to share the app intro message and public URL.
 * - When unsupported, opens the ShareFallbackModal containing the shortened URL, a 'Copy' button, and visual confirmation.
 */

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { ShareFallbackModal } from './ShareFallbackModal';

export interface UnifiedShareButtonProps {
  variant?: 'navbar' | 'compact' | 'standard' | 'banner' | 'pill';
  className?: string;
  customTitle?: string;
  customText?: string;
  customUrl?: string;
  label?: string;
  showIcon?: boolean;
}

export const UnifiedShareButton: React.FC<UnifiedShareButtonProps> = ({
  variant = 'standard',
  className = '',
  customTitle = 'تطبيق «نسمة حياة» 🌿',
  customText = '🌿 تعرّف على تطبيق «نسمة حياة»: مساحة عربية آمنة للاهتمام بنفسك، وفهم مشاعرك، وممارسة تمارين السكينة واليقظة الذهنية.',
  customUrl,
  label,
  showIcon = true
}) => {
  const [isFallbackOpen, setIsFallbackOpen] = useState(false);

  // Determine official public app URL
  const appUrl = customUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app');

  const handleShareClick = async () => {
    const shareData = {
      title: customTitle,
      text: customText,
      url: appUrl
    };

    // Check if Web Share API is genuinely supported
    const isWebShareSupported = 
      typeof navigator !== 'undefined' && 
      typeof navigator.share === 'function' && 
      navigator.canShare && 
      navigator.canShare(shareData);

    if (isWebShareSupported) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        // If user cancelled, do not open fallback modal
        if (err && err.name === 'AbortError') {
          return;
        }
        // If sharing threw an error (permission or browser limitation), show fallback
        setIsFallbackOpen(true);
      }
    } else {
      // Not supported -> Open Fallback Modal
      setIsFallbackOpen(true);
    }
  };

  // Render variant styles
  let buttonContent = null;

  if (variant === 'navbar') {
    buttonContent = (
      <button
        type="button"
        onClick={handleShareClick}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/50 dark:hover:bg-[#1B342A] transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0 ${className}`}
        title="مشاركة التطبيق"
        aria-label="مشاركة التطبيق"
      >
        <Share2 className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
      </button>
    );
  } else if (variant === 'compact') {
    buttonContent = (
      <button
        type="button"
        onClick={handleShareClick}
        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold font-tajawal transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-[#174F3F] dark:text-emerald-300 border-[#174F3F]/20 dark:border-emerald-500/30 shadow-2xs ${className}`}
        title="مشاركة التطبيق"
      >
        {showIcon && <Share2 className="w-3.5 h-3.5" />}
        <span>{label || 'مشاركة'}</span>
      </button>
    );
  } else if (variant === 'banner') {
    buttonContent = (
      <button
        type="button"
        onClick={handleShareClick}
        className={`px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0 ${className}`}
        title="مشاركة التطبيق"
      >
        {showIcon && <Share2 className="w-4 h-4" />}
        <span>{label || 'شارك التطبيق الآن'}</span>
      </button>
    );
  } else if (variant === 'pill') {
    buttonContent = (
      <button
        type="button"
        onClick={handleShareClick}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs active:scale-95 ${className}`}
      >
        {showIcon && <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
        <span>{label || 'مشاركة التطبيق'}</span>
      </button>
    );
  } else {
    // Standard button
    buttonContent = (
      <button
        type="button"
        onClick={handleShareClick}
        className={`py-2.5 px-4 bg-[#174F3F] hover:bg-[#123C30] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${className}`}
      >
        {showIcon && <Share2 className="w-4 h-4 text-amber-300" />}
        <span>{label || 'مشاركة تطبيق نسمة حياة 🌿'}</span>
      </button>
    );
  }

  return (
    <>
      {buttonContent}

      {/* Fallback Modal when navigator.share is unsupported */}
      <ShareFallbackModal
        isOpen={isFallbackOpen}
        onClose={() => setIsFallbackOpen(false)}
        title={customTitle}
        text={customText}
        url={appUrl}
      />
    </>
  );
};
