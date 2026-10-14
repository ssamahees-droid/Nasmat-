import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Check, 
  Globe, 
  ShieldCheck, 
  HelpCircle,
  Copy,
  ArrowLeft
} from 'lucide-react';

interface NesmaAppPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NesmaAppPortalModal: React.FC<NesmaAppPortalModalProps> = ({ isOpen, onClose }) => {
  const [appUrl, setAppUrl] = useState<string>(() => {
    return localStorage.getItem('nesmat_second_app_url') || '';
  });
  const [activeFrameUrl, setActiveFrameUrl] = useState<string>(() => {
    return localStorage.getItem('nesmat_second_app_url') || '';
  });
  const [showHelper, setShowHelper] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConnectUrl = () => {
    if (!appUrl.trim()) return;
    let validUrl = appUrl.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }
    setActiveFrameUrl(validUrl);
    localStorage.setItem('nesmat_second_app_url', validUrl);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#F7F3E9] dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 rounded-3xl shadow-2xl overflow-hidden text-right max-h-[94vh] flex flex-col text-[#13251E] dark:text-[#F7F3E9]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 bg-[#E6E8D8]/70 dark:bg-[#0D1914] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl border border-[#174C3C]/25 dark:border-[#A9C5A0]/30 bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 flex items-center justify-center text-[#174C3C] dark:text-[#A9C5A0]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#174C3C] dark:text-[#F7F3E9]">
                  بوابة الربط والتكامل مع التطبيق المساعد
                </h2>
                <span className="text-[11px] bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] font-bold px-2.5 py-0.5 rounded-full">
                  تكامل
                </span>
              </div>
              <p className="text-xs text-[#263830] dark:text-[#D5DFD7] mt-0.5">
                دمج وتشغيل مشروعك الآخر داخل منصة «نسمة حياة» كمنظومة متكاملة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelper(!showHelper)}
              className="px-3 py-1.5 rounded-xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 text-xs flex items-center gap-1.5 text-[#174C3C] dark:text-[#A9C5A0] hover:bg-[#174C3C]/5 dark:hover:bg-[#A9C5A0]/10 transition-colors"
              title="كيفية الحصول على الرابط المباشر"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">طريقة الربط</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl border border-[#174C3C]/15 dark:border-white/10 hover:bg-[#174C3C]/10 dark:hover:bg-white/10 text-[#13251E] dark:text-stone-300 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Helper Guide Accordion */}
        {showHelper && (
          <div className="p-4 bg-[#E6E8D8] dark:bg-[#1B342A] border-b border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-xs space-y-2 animate-fadeIn">
            <div className="text-[#174C3C] dark:text-[#A9C5A0] font-bold flex items-center gap-1.5">
              <span>💡 خطوتان لربط وتشغيل التطبيق الآخر فوراً:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[#13251E]/80 dark:text-[#F7F3E9]/80 leading-relaxed">
              <li>
                افتح مشروعك الآخر في Google AI Studio: انظر لشاشة المعاينة على اليمين واضغط على أيقونة <strong>السهم المائل ↗️</strong> (فتح المعاينة في تبويب جديد).
              </li>
              <li>
                انسخ الرابط من شريط العنوان (سيكون مثل <code>https://ais-pre-...run.app</code>) والصقه في الحقل أدناه واضغط <strong>«توصيل وتشغيل»</strong>.
              </li>
            </ol>
          </div>
        )}

        {/* URL Input Bar */}
        <div className="p-3.5 bg-white dark:bg-[#12241D] border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <div className="relative flex-1 w-full">
            <Globe className="absolute right-3.5 top-3 w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
            <input
              type="url"
              dir="ltr"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://ais-pre-...europe-west2.run.app"
              className="w-full bg-[#F7F3E9] dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 focus:border-[#174C3C] dark:focus:border-[#A9C5A0] p-2.5 pr-10 text-xs text-[#13251E] dark:text-[#F7F3E9] rounded-xl outline-hidden transition-colors"
            />
          </div>

          <button
            onClick={handleConnectUrl}
            className="btn-nesma-primary py-2.5 px-5 text-xs w-full sm:w-auto shrink-0"
          >
            <span>توصيل وتشغيل</span>
            <Check className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Viewport / Frame Area */}
        <div className="flex-1 overflow-hidden relative bg-[#F7F3E9]/50 dark:bg-[#0D1914] flex items-center justify-center min-h-[420px]">
          {activeFrameUrl ? (
            <iframe
              src={activeFrameUrl}
              title="تطبيق نسمة الثاني"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          ) : (
            <div className="p-8 text-center max-w-md space-y-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#174C3C]/40 dark:border-[#A9C5A0]/40 bg-[#174C3C]/5 dark:bg-[#A9C5A0]/10 flex items-center justify-center mx-auto text-[#174C3C] dark:text-[#A9C5A0]">
                <Globe className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#174C3C] dark:text-[#F7F3E9]">
                بانتظار رابط المعاينة السحابي
              </h3>
              <p className="text-xs text-[#263830] dark:text-[#D5DFD7] leading-relaxed">
                ضع رابط المعاينة الخاص بمشروعك (الذي يبدأ بـ <code>ais-pre-...run.app</code>) في الحقل بالأعلى لتشغيله مباشرة داخل هذه النافذة كنافذة متصلة!
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => setShowHelper(true)}
                  className="btn-nesma-secondary text-xs py-2 px-4"
                >
                  <span>أرني كيف أحصل على الرابط</span>
                  <ArrowLeft className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#E6E8D8]/60 dark:bg-[#0D1914] border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 flex items-center justify-between text-[11px] text-[#263830] dark:text-[#D5DFD7]">
          <span>الحالة: جاهز للاتصال // بروتوكول IFrame الآمن</span>
          {activeFrameUrl && (
            <a 
              href={activeFrameUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#174C3C] dark:text-[#A9C5A0] font-bold hover:underline flex items-center gap-1"
            >
              <span>فتح في نافذة كاملة</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
