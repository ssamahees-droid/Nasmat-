/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Sparkles } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      setTimeout(() => setShowReconnectedToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnectedToast) return null;

  if (showReconnectedToast) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-[#174F3F] text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in font-tajawal" dir="rtl">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
          <Wifi className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-xs">تمت استعادة الاتصال بالإنترنت 🌐</p>
          <p className="text-[10px] text-emerald-200">التطبيق متصل الآن وجاهز للمزامنة.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#18231D] border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs font-tajawal flex items-center justify-between gap-2 shadow-sm z-40 relative" dir="rtl">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>أنت تعمل في وضع عدم الاتصال (Offline) — لعبة «شفرة نسمة»، التمارين النفسية، والمحتوى المخزن متاحة لك بالكامل على جهازك 🌿</span>
      </div>
      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold shrink-0">
        يعمل بدون إنترنت
      </span>
    </div>
  );
};
