import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAFloatingInstallBadge: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already installed, or not installable via event yet, or user dismissed, don't show floating badge
  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => setDismissed(true), 3500);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div 
      className="fixed top-20 right-3 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-md transition-all duration-500 ease-out animate-in fade-in slide-in-from-top-3" 
      dir="rtl"
    >
      {/* Ambient Subtle Static Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-400/20 to-emerald-600/30 rounded-2xl blur-sm -z-10" />

      <div className="relative flex items-center gap-3 bg-[#0d2218]/95 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-xl border border-emerald-400/40 backdrop-blur-md ring-1 ring-emerald-400/20">
        
        {/* Glowing Icon & Beacon */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-400/40 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          {/* Subtle Live Beacon Dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-sm" />
          </span>
        </div>

        {/* Text Info */}
        <div className="pr-0.5 select-none min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-tajawal font-bold text-xs sm:text-sm text-emerald-100 whitespace-nowrap">
              {installedSuccess ? 'تم التثبيت بنجاح! 🎉' : 'تثبيت «نسمة حياة»'}
            </p>
            <span className="hidden xs:inline-block text-[9px] px-1.5 py-0.2 bg-emerald-500/25 text-emerald-300 font-semibold rounded-full border border-emerald-400/30">
              PWA
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-200/80 truncate">
            {installedSuccess ? 'أصبح التطبيق على شاشتك الرئيسية' : 'أيقونة سريعة وخاصة على شاشتك'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 mr-auto shrink-0">
          {!installedSuccess ? (
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="group relative px-3 py-1.5 sm:px-3.5 sm:py-1.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-stone-950 font-tajawal font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 overflow-hidden"
              title="تثبيت التطبيق على جهازك الآن"
            >
              <Download className={`w-3.5 h-3.5 text-stone-950 ${isInstalling ? 'animate-bounce' : 'group-hover:translate-y-0.5 transition-transform'}`} />
              <span>{isInstalling ? 'جارٍ...' : 'تثبيت الآن'}</span>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            title="إخفاء مؤقت"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
