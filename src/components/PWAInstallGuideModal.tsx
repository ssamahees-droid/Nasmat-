/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PWAInstallGuideModal.tsx
 * Dedicated modal providing simple, animated, step-by-step visual instructions
 * for adding the app to the home screen on iOS Safari, Android Chrome, and Desktop,
 * automatically tailored to the device detected via navigator.userAgent.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Download, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  ChevronLeft,
  ArrowDown,
  Layers,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export type DeviceType = 'ios' | 'android' | 'desktop';

interface PWAInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDevice?: DeviceType;
}

export function detectUserDevice(): DeviceType {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'android';
  const ua = navigator.userAgent.toLowerCase();
  
  // iOS detection (iPhone, iPad, iPod, or iPadOS simulating MacIntel with touch points)
  const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS) return 'ios';

  // Android detection
  if (/android/.test(ua)) return 'android';

  // Fallback to Desktop
  return 'desktop';
}

export const PWAInstallGuideModal: React.FC<PWAInstallGuideModalProps> = ({
  isOpen,
  onClose,
  defaultDevice
}) => {
  const detectedDevice = detectUserDevice();
  const [selectedTab, setSelectedTab] = useState<DeviceType>(defaultDevice || detectedDevice);
  const { isInstallable, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);

  // Sync tab whenever modal opens or defaultDevice changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTab(defaultDevice || detectUserDevice());
    }
  }, [isOpen, defaultDevice]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAutoInstallFromModal = async () => {
    setIsInstalling(true);
    try {
      const ok = await install();
      if (ok) {
        onClose();
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-guide-title"
      >
        {/* Backdrop click dismiss */}
        <motion.div 
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div 
          className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl border-2 border-[#174F3F]/30 shadow-2xl p-6 sm:p-7 text-right text-[#292F2D] z-10 max-h-[90vh] flex flex-col font-tajawal overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D5DED7] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/30 flex items-center justify-center text-[#174F3F] text-xl shadow-xs">
                📲
              </div>
              <div>
                <h2 id="pwa-guide-title" className="text-lg sm:text-xl font-bold text-[#174F3F] leading-tight">
                  كيف تثبت تطبيق «نسمة حياة»؟
                </h2>
                <p className="text-xs text-[#515B55] mt-0.5">
                  خطوات سريعة ومصورة لإضافة التطبيق لشاشتك
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-[#F7F5EF] hover:bg-[#EAE5D9] text-[#515B55] hover:text-[#174F3F] border border-[#D5DED7] transition-all cursor-pointer active:scale-95"
              title="إغلاق"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Device Tabs Selector */}
          <div className="pt-4 pb-2 shrink-0">
            <div className="flex rounded-2xl bg-[#F7F5EF] p-1.5 border border-[#D5DED7] gap-1">
              
              {/* iOS Safari Tab */}
              <button
                type="button"
                onClick={() => setSelectedTab('ios')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  selectedTab === 'ios'
                    ? 'bg-[#174F3F] text-white shadow-sm'
                    : 'text-[#515B55] hover:text-[#174F3F] hover:bg-white/60'
                }`}
              >
                <span>🍏 آيفون / آيباد</span>
                {detectedDevice === 'ios' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedTab === 'ios' ? 'bg-amber-400 text-stone-950' : 'bg-[#E2EFE7] text-[#174F3F]'
                  }`}>
                    جهازك
                  </span>
                )}
              </button>

              {/* Android Chrome Tab */}
              <button
                type="button"
                onClick={() => setSelectedTab('android')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  selectedTab === 'android'
                    ? 'bg-[#174F3F] text-white shadow-sm'
                    : 'text-[#515B55] hover:text-[#174F3F] hover:bg-white/60'
                }`}
              >
                <span>🤖 أندرويد</span>
                {detectedDevice === 'android' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedTab === 'android' ? 'bg-amber-400 text-stone-950' : 'bg-[#E2EFE7] text-[#174F3F]'
                  }`}>
                    جهازك
                  </span>
                )}
              </button>

              {/* Desktop Chrome Tab */}
              <button
                type="button"
                onClick={() => setSelectedTab('desktop')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  selectedTab === 'desktop'
                    ? 'bg-[#174F3F] text-white shadow-sm'
                    : 'text-[#515B55] hover:text-[#174F3F] hover:bg-white/60'
                }`}
              >
                <span>💻 كمبيوتر</span>
                {detectedDevice === 'desktop' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedTab === 'desktop' ? 'bg-amber-400 text-stone-950' : 'bg-[#E2EFE7] text-[#174F3F]'
                  }`}>
                    جهازك
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* Scrollable Step-by-Step Instructions Container */}
          <div className="overflow-y-auto pr-1 pl-1 py-2 space-y-3.5 flex-1">
            
            {/* iOS Safari Steps */}
            {selectedTab === 'ios' && (
              <motion.div 
                key="ios"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                <div className="p-3.5 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFFFFF] flex items-center justify-center text-lg shrink-0">
                    🧭
                  </div>
                  <p className="text-xs sm:text-sm text-[#174F3F] font-bold leading-relaxed">
                    تأكد من فتح الرابط في متصفح <strong>Safari</strong> الأصلي للاستفادة من ميزة التثبيت على شاشة الآيفون.
                  </p>
                </div>

                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اضغط على زر المشاركة (Share)
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      في أسفل شاشة متصفح سفاري، اضغط على أيقونة المربع الذي يخرج منه سهم للأعلى:
                    </p>
                    
                    {/* Visual Simulated Button */}
                    <div className="pt-1 flex items-center gap-2">
                      <motion.div 
                        animate={{ scale: [1, 1.08, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border-2 border-blue-500 text-blue-600 font-bold text-xs shadow-xs"
                      >
                        <Share className="w-4 h-4 text-blue-600" />
                        <span>زر المشاركة ⎋</span>
                      </motion.div>
                      <span className="text-[11px] text-[#515B55]">(في أسفل المتصفح)</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اختر «إضافة إلى الشاشة الرئيسية»
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      مرر قائمة الخيارات للأسفل حتى تجد خيار <strong>Add to Home Screen</strong>:
                    </p>

                    {/* Visual Simulated Row */}
                    <div className="pt-1">
                      <motion.div 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5DED7] text-[#292F2D] font-bold text-xs shadow-xs"
                      >
                        <PlusSquare className="w-4 h-4 text-[#174F3F]" />
                        <span>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اضغط على «إضافة» (Add)
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      في أعلى الزاوية، اضغط <strong>«إضافة»</strong> وستظهر أيقونة التطبيق الخضراء الجميلة فوراً على شاشة هاتفك!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Android Chrome Steps */}
            {selectedTab === 'android' && (
              <motion.div 
                key="android"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                {/* 1-Click Install CTA if ready */}
                {isInstallable && (
                  <div className="p-4 rounded-2xl bg-[#E2EFE7] border-2 border-[#23785B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#23785B] shrink-0" />
                      <p className="text-xs sm:text-sm font-bold text-[#174F3F]">
                        متصفحك يدعم التثبيت الفوري التلقائي الآن!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoInstallFromModal}
                      disabled={isInstalling}
                      className="w-full sm:w-auto px-4 py-2 bg-[#174F3F] hover:bg-[#205746] text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                    >
                      {isInstalling ? 'جارٍ التثبيت...' : 'تثبيت بنقرة واحدة 📲'}
                    </button>
                  </div>
                )}

                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اضغط على قائمة المتصفح (نقاط القائمة الثلاث)
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      في أعلى شاشة متصفح Chrome، اضغط على أيقونة النقاط الثلاث (⋮):
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5DED7] font-bold text-xs text-[#292F2D] shadow-xs"
                      >
                        <MoreVertical className="w-4 h-4 text-[#174F3F]" />
                        <span>زر القائمة (⋮)</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      ستجد خيار <strong>Install App</strong> أو <strong>Add to Home screen</strong>:
                    </p>

                    <div className="pt-1">
                      <motion.div 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#D5DED7] font-bold text-xs text-[#174F3F] shadow-xs"
                      >
                        <Download className="w-4 h-4 text-[#23785B]" />
                        <span>تثبيت التطبيق (Install App)</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اضغط على «تثبيت» (Install)
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      سيتم تثبيت التطبيق تلقائياً في ثوانٍ، ويعمل كبرنامج كامل دون الحاجة لفتح المتصفح في كل مرة!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Desktop Chrome / Edge Steps */}
            {selectedTab === 'desktop' && (
              <motion.div 
                key="desktop"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                {/* 1-Click Install CTA if ready */}
                {isInstallable && (
                  <div className="p-4 rounded-2xl bg-[#E2EFE7] border-2 border-[#23785B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#23785B] shrink-0" />
                      <p className="text-xs sm:text-sm font-bold text-[#174F3F]">
                        متصفحك يدعم التثبيت المباشر على الكمبيوتر الآن!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoInstallFromModal}
                      disabled={isInstalling}
                      className="w-full sm:w-auto px-4 py-2 bg-[#174F3F] hover:bg-[#205746] text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                    >
                      {isInstalling ? 'جارٍ التثبيت...' : 'تثبيت على الكمبيوتر 🖥️'}
                    </button>
                  </div>
                )}

                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      انقر على أيقونة التثبيت في شريط العنوان
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      في أعلى نافذة المتصفح بجانب رابط الموقع، ستجد أيقونة شاشة كمبيوتر صغيرة أو رمز التثبيت (⊕):
                    </p>

                    <div className="pt-1">
                      <motion.div 
                        animate={{ scale: [1, 1.06, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#D5DED7] font-bold text-xs text-[#174F3F] shadow-xs"
                      >
                        <Download className="w-4 h-4 text-[#23785B]" />
                        <span>أيقونة تثبيت التطبيق في شريط الروابط</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] flex items-start gap-3.5 transition-all hover:border-[#174F3F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#174F3F] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#174F3F]">
                      اضغط على «تثبيت» (Install)
                    </h4>
                    <p className="text-xs sm:text-sm text-[#292F2D] leading-relaxed">
                      سيتم فتح التطبيق كنافذة مكتبية سريعة وخفيفة على سطح المكتب مع أيقونة خاصة به في شريط المهام.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Common Benefits Card */}
            <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#D5DED7] text-xs space-y-1 text-[#515B55]">
              <div className="flex items-center gap-1.5 text-[#174F3F] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#23785B]" />
                <span>مميزات التثبيت:</span>
              </div>
              <p className="pr-5 leading-relaxed">
                تشغيل بشاشة كاملة دون أشرطة متصفح، عمل سريع وموثوق دون اتصال بالإنترنت، وحفظ دائم وآمن لبياناتك وتقدمك.
              </p>
            </div>

          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-[#D5DED7] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-[#174F3F] hover:bg-[#205746] text-white font-bold text-sm sm:text-base transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>فهمت، شكراً</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
