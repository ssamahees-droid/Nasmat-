/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * shareService.ts - Robust Web Share API utility with Clipboard Fallback
 */

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export async function shareContent(options: ShareOptions): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const title = options.title || 'نسمة حياة | Nesma Hayat';
  const text = options.text || 'منصة عربية تفاعلية للصحة النفسية والاستكشاف الذاتي الآمن، وتمارين الاسترخاء والتهدئة.';
  const url = options.url || (typeof window !== 'undefined' ? window.location.href : 'https://nesmat-alhayat.web.app');

  const shareData = { title, text, url };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled share dialog
        return { success: false, method: 'native' };
      }
    }
  }

  // Fallback to Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      const fullText = `${title}\n${text}\n${url}`;
      await navigator.clipboard.writeText(fullText);
      return { success: true, method: 'clipboard' };
    } catch (_) {}
  }

  // Final fallback
  try {
    prompt('انسخ رابط المحتوى والمشاركة:', `${title} - ${url}`);
    return { success: true, method: 'clipboard' };
  } catch (_) {
    return { success: false, method: 'clipboard' };
  }
}
