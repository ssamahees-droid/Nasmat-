/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ShareFallbackModal.tsx
 * Modal fallback displayed when Web Share API (navigator.share) is not supported by the browser.
 * Features:
 * - Shows the introductory message.
 * - Displays the shortened public application URL.
 * - Provides a clear 'Copy' button with visual success confirmation.
 * - One-click quick sharing links (WhatsApp, Telegram, X/Twitter, Email).
 */

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Globe, 
  MessageCircle, 
  Send, 
  Mail, 
  Sparkles 
} from 'lucide-react';

interface ShareFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
}

export const ShareFallbackModal: React.FC<ShareFallbackModalProps> = ({
  isOpen,
  onClose,
  title = 'تطبيق «نسمة حياة» 🌿',
  text = '🌿 تعرّف على تطبيق «نسمة حياة»: مساحة عربية آمنة للاهتمام بنفسك، وفهم مشاعرك، وممارسة تمارين السكينة واليقظة الذهنية.',
  url
}) => {
  const [copiedType, setCopiedType] = useState<'url' | 'all' | null>(null);

  if (!isOpen) return null;

  // Resolve application URL (prefers shared public URL or current origin)
  const appUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app');
  const shortUrl = appUrl.replace(/^https?:\/\//, '');

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedType('url');
      setTimeout(() => setCopiedType(null), 3500);
    } catch (_) {
      prompt('انسخ رابط التطبيق:', appUrl);
      setCopiedType('url');
      setTimeout(() => setCopiedType(null), 3500);
    }
  };

  const handleCopyFullMessage = async () => {
    const fullText = `${text}\n\n🔗 ${appUrl}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedType('all');
      setTimeout(() => setCopiedType(null), 3500);
    } catch (_) {
      prompt('انسخ الرسالة كاملة:', fullText);
      setCopiedType('all');
      setTimeout(() => setCopiedType(null), 3500);
    }
  };

  const encodedText = encodeURIComponent(`${text}\n\n${appUrl}`);
  const encodedUrl = encodeURIComponent(appUrl);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#F7F5EF] dark:bg-[#14211A] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5DED7] dark:border-stone-800 text-right">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-white/95 dark:bg-[#192B22]/95 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#174F3F]/15 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center text-lg shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#174F3F] dark:text-emerald-300 font-tajawal">
                مشاركة تطبيق «نسمة حياة» 🌿
              </h3>
              <p className="text-xs text-[#515B55] dark:text-stone-400">
                شارك الرابط العام والرسالة التعريفية مع من تحب
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Introductory Message Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18261F] border border-stone-200 dark:border-stone-800 space-y-2 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174F3F] dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>الرسالة التعريفية للتطبيق:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#292F2B] dark:text-stone-200 leading-relaxed">
              «{text}»
            </p>
          </div>

          {/* Shortened URL with Prominent Copy Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600 dark:text-stone-300 block">
              الرابط العام المعتمد للتطبيق:
            </label>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#18261F] border-2 border-[#174F3F]/30 dark:border-emerald-500/40 shadow-xs">
              <div className="p-2 rounded-xl bg-[#E2EFE7] dark:bg-emerald-950/60 text-[#174F3F] dark:text-emerald-400 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0 px-1">
                <div className="font-mono text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-300 truncate" dir="ltr">
                  {shortUrl}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="py-2.5 px-4 bg-[#174F3F] hover:bg-[#123C30] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedType === 'url' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>تم النسخ ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-300" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual Confirmation Banner upon Success */}
          {copiedType && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                {copiedType === 'url' 
                  ? 'تم نسخ رابط التطبيق إلى الحافظة بنجاح! جاهز للصق والمشاركة.'
                  : 'تم نسخ الرسالة التعريفية كاملة مع الرابط بنجاح!'}
              </span>
            </div>
          )}

          {/* Additional Action: Copy Full Message */}
          <button
            type="button"
            onClick={handleCopyFullMessage}
            className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-amber-500" />
            <span>نسخ الرسالة التعريفية كاملة مع الرابط 📋</span>
          </button>

          {/* Quick Direct Sharing Links (Fallbacks) */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block text-center">
              أو شارك مباشرة عبر تطبيقات التواصل:
            </span>

            <div className="grid grid-cols-4 gap-2 text-center">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex flex-col items-center gap-1 border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[10px]">واتساب</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold flex flex-col items-center gap-1 border border-sky-200 dark:border-sky-800 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span className="text-[10px]">تيليجرام</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex flex-col items-center gap-1 border border-stone-300 dark:border-stone-700 transition-colors"
              >
                <span className="text-xs font-black">𝕏</span>
                <span className="text-[10px]">تويتر</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex flex-col items-center gap-1 border border-amber-200 dark:border-amber-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-[10px]">بريد</span>
              </a>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-stone-100 dark:bg-[#121B15] border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
            نسمة حياة · مجاني وآمن 100%
          </span>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-200 rounded-xl border border-stone-300 dark:border-stone-700 font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
