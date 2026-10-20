import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAFloatingInstallBadge: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed, or not installable via event yet, or user dismissed, don't show floating badge
  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce duration-1000" dir="rtl">
      <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-300/40 backdrop-blur-md">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>

        <div className="pr-1">
          <p className="font-tajawal font-bold text-xs">تثبيت «نسمة حياة» فوراً</p>
          <p className="text-[10px] text-emerald-100/90">أيقونة سريعة على شاشتك الرئيسية</p>
        </div>

        <div className="flex items-center gap-1.5 mr-2">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="px-3 py-1.5 bg-white text-emerald-950 hover:bg-emerald-50 font-tajawal font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalling ? 'جارٍ...' : 'تثبيت الآن'}</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            title="إخفاء مؤقت"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
