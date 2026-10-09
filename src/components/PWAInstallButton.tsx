import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed, hide the install UI
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If neither installable event nor iOS, provide manual guide modal on click
  const showManualFallback = !isInstallable && !isIOS;

  return (
    <>
      {variant === 'compact' && (
        <button
          onClick={() => {
            if (isInstallable) handleInstallClick();
            else setShowIOSGuide(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tajawal font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-sm cursor-pointer ${className}`}
          title="تثبيت نسمة حياة كتطبيق مستقل على جهازك"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>تثبيت التطبيق</span>
        </button>
      )}

      {variant === 'full' && (
        <button
          onClick={() => {
            if (isInstallable) handleInstallClick();
            else setShowIOSGuide(true);
          }}
          disabled={isInstalling}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-tajawal font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/20 transition-all cursor-pointer ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{isInstalling ? 'جارٍ التثبيت...' : 'تثبيت نسمة حياة على هاتفك'}</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-4 rounded-2xl bg-gradient-to-br from-[#121c17] to-[#0d1410] border border-emerald-500/20 text-stone-200 shadow-xl ${className}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-tajawal font-bold text-sm text-emerald-200">ثبّت «نسمة حياة» كتطبيق مستقل</h4>
                <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                  وصول سريع وخاص بلمسة واحدة من شاشة هاتفك الرئيسية، مع حماية تامة لخصوصيتك وبياناتك.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                if (isInstallable) handleInstallClick();
                else setShowIOSGuide(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-tajawal font-bold text-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* iOS & Manual Installation Modal Guide */}
      {showIOSGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="w-full max-w-sm rounded-2xl bg-[#141a16] border border-emerald-500/30 p-5 shadow-2xl text-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-300 font-tajawal font-bold text-base">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>كيفية تثبيت نسمة حياة</span>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-stone-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold text-stone-100">اضغط على زر المشاركة</p>
                  <p className="text-stone-400 mt-0.5">في شريط متصفح سفاري (Safari) بالأسفل اضغط على أيقونة <Share className="inline w-3.5 h-3.5 text-blue-400 mx-1" /></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold text-stone-100">اختر «إضافة إلى الشاشة الرئيسية»</p>
                  <p className="text-stone-400 mt-0.5">مرر القائمة لأسفل ثم اضغط على <PlusSquare className="inline w-3.5 h-3.5 text-emerald-400 mx-1" /> «Add to Home Screen»</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold text-stone-100">تأكيد الإضافة</p>
                  <p className="text-stone-400 mt-0.5">اضغط على «إضافة» (Add) في الزاوية العلوية لتظهر أيقونة نسمة حياة على شاشتك الرئيسية فوراً.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tajawal font-bold text-xs transition cursor-pointer"
              >
                فهمت، شكراً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
