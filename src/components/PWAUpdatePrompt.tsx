import React, { useEffect, useState } from 'react';
import { RefreshCw, Download, Smartphone, CheckCircle, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAUpdatePrompt: React.FC = () => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let active = true;

      // Auto check updates on online event / page focus
      const checkForUpdates = () => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update().catch(() => {});
        }).catch(() => {});
      };

      window.addEventListener('online', checkForUpdates);
      window.addEventListener('focus', checkForUpdates);

      navigator.serviceWorker.ready.then((reg) => {
        if (!active) return;
        setRegistration(reg);

        // Auto trigger update when new worker is found
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available -> apply immediately without requiring manual click
                  if (installingWorker) {
                    installingWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                  setUpdateAvailable(true);
                  // Refresh automatically to apply latest features instantly
                  setTimeout(() => {
                    window.location.reload();
                  }, 1200);
                }
              }
            };
          }
        };
      }).catch(() => {});

      return () => {
        active = false;
        window.removeEventListener('online', checkForUpdates);
        window.removeEventListener('focus', checkForUpdates);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  return (
    <>
      {/* Update Available Banner */}
      {/* Update Available Banner */}
      {updateAvailable && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#174F3F] border border-[#23785B] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-emerald-300 animate-spin shrink-0" />
            <div>
              <p className="font-tajawal font-bold text-xs">تحديث جديد متوفر لـ «نسمة حياة»</p>
              <p className="text-[10px] text-emerald-200/90">انقر لتحديث التطبيق واستمتع بأحدث الميزات والأمان.</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-tajawal font-bold text-xs rounded-xl transition shadow cursor-pointer shrink-0"
          >
            تحديث الآن
          </button>
        </div>
      )}
    </>
  );
};
