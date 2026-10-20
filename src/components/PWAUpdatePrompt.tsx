import React, { useEffect, useState } from 'react';
import { RefreshCw, Download, Smartphone, CheckCircle, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAUpdatePrompt: React.FC = () => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Check for service worker updates
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              }
            };
          }
        };
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
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
      {updateAvailable && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-400/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-emerald-300 animate-spin shrink-0" />
            <div>
              <p className="font-tajawal font-bold text-xs">تحديث جديد متوفر لـ «نسمة حياة»</p>
              <p className="text-[10px] text-emerald-200/80">انقر لتحديث التطبيق واستمتع بأحدث الميزات والأمان.</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-tajawal font-bold text-xs rounded-xl transition shadow cursor-pointer shrink-0"
          >
            تحديث الآن
          </button>
        </div>
      )}

      {/* Persistent Mobile Install / Update Hub floating trigger or menu */}
      <div className="mt-4 p-4 rounded-2xl bg-stone-900/80 border border-emerald-500/20 text-stone-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-tajawal font-bold text-xs text-stone-100">تثبيت وتحديث التطبيق على هاتفك</h5>
              <p className="text-[11px] text-stone-400">يعمل بدون إنترنت، ويبقى محدثاً باستمرار على أندرويد و iOS.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-tajawal font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت</span>
              </button>
            )}

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-stone-200 rounded-xl font-tajawal font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>طريقة التثبيت</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Installation & Update Guide Modal */}
      {showGuideModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#141a16] border border-emerald-500/30 p-6 shadow-2xl text-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-emerald-300 font-tajawal font-bold text-base">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>دليل تثبيت وتحديث «نسمة حياة»</span>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <RefreshCw className="w-5 h-5 hidden" />
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed text-stone-300">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                <p className="font-bold text-emerald-300 mb-1">لماذا تثبيت التطبيق؟</p>
                <p className="text-stone-300">يمنحك أيقونة مستقلة على شاشة هاتفك، تشغيلًا كاملاً بشاشة كاملة دون أشرطة المتصفح، وعملًا مستقراً حتى دون اتصال بالإنترنت.</p>
              </div>

              <div className="space-y-2.5 pt-1">
                <p className="font-bold text-stone-100">📱 لأجهزة أندرويد (Android / Chrome):</p>
                <ol className="list-decimal list-inside space-y-1 pr-2 text-stone-300">
                  <li>افتح التطبيق من متصفح كروم (Chrome).</li>
                  <li>اضغط على قائمة الخيارات (النقاط الثلاث أعلى اليمين).</li>
                  <li>اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
                </ol>
              </div>

              <div className="space-y-2.5 pt-1">
                <p className="font-bold text-stone-100">🍏 لأجهزة آيفون و آيباد (iOS / Safari):</p>
                <ol className="list-decimal list-inside space-y-1 pr-2 text-stone-300">
                  <li>افتح التطبيق من متصفح سفاري (Safari).</li>
                  <li>اضغط على زر <strong>المشاركة (Share)</strong> في أسفل الشاشة.</li>
                  <li>اختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-emerald-300">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>التحديثات تتم تلقائياً في الخلفية لضمان عمل أحدث إصدار للأمان والميزات.</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tajawal font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
