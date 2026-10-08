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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#141416] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-right max-h-[94vh] flex flex-col text-[#e4e4e4]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0c0c0e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#c4fb6d] bg-[#c4fb6d]/10 flex items-center justify-center text-[#c4fb6d] font-syne font-bold text-lg">
              <Layers className="w-5 h-5 text-[#c4fb6d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-syne text-white">
                  بوابة التطبيق الثاني // NESMAT ECOSYSTEM
                </h2>
                <span className="text-[10px] bg-[#c4fb6d] text-black font-geist font-bold px-2 py-0.5">
                  MULTI-APP
                </span>
              </div>
              <p className="text-xs text-[#e4e4e4]/60 font-geist mt-0.5">
                دمج وتشغيل مشروعك الآخر داخل منصة نسمة حياة كمنظومة واحدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelper(!showHelper)}
              className="p-1.5 border border-white/10 hover:border-[#c4fb6d] text-xs font-geist flex items-center gap-1 text-[#c4fb6d]"
              title="كيفية الحصول على الرابط المباشر"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">طريقة الربط</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 border border-white/10 hover:border-white text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Helper Guide Accordion */}
        {showHelper && (
          <div className="p-4 bg-[#0c0c0e] border-b border-white/10 text-xs space-y-2 animate-fade-in font-geist">
            <div className="text-[#c4fb6d] font-bold flex items-center gap-1.5">
              <span>💡 خطوتان لربط وتشغيل التطبيق الآخر فوراً:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#e4e4e4]/80 leading-relaxed font-sans">
              <li>
                افتحي مشروعك الآخر في Google AI Studio: انظري لشاشة المعاينة على اليمين واضغطي على أيقونة <strong>السهم المائل ↗️</strong> (فتح المعاينة في تبويب جديد).
              </li>
              <li>
                انسخي الرابط من شريط العنوان (سيكون مثل <code>https://ais-pre-...run.app</code>) والصقيه في الحقل أدناه واضغطي <strong>«توصيل وتشغيل»</strong>.
              </li>
            </ol>
          </div>
        )}

        {/* URL Input Bar */}
        <div className="p-3.5 bg-[#18181b] border-b border-white/10 flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <div className="relative flex-1 w-full">
            <Globe className="absolute right-3 top-3 w-4 h-4 text-[#c4fb6d]" />
            <input
              type="url"
              dir="ltr"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://ais-pre-...europe-west2.run.app"
              className="w-full bg-[#0c0c0e] border border-white/10 focus:border-[#c4fb6d] p-2.5 pr-9 text-xs text-[#e4e4e4] font-geist outline-none transition-colors"
            />
          </div>

          <button
            onClick={handleConnectUrl}
            className="btn-tech-fill py-2.5 px-5 text-xs w-full sm:w-auto shrink-0"
          >
            <span>توصيل وتشغيل</span>
            <Check className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Viewport / Frame Area */}
        <div className="flex-1 overflow-hidden relative bg-[#0c0c0e] flex items-center justify-center min-h-[420px]">
          {activeFrameUrl ? (
            <iframe
              src={activeFrameUrl}
              title="تطبيق نسمة الثاني"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          ) : (
            <div className="p-8 text-center max-w-md space-y-4">
              <div className="w-16 h-16 border-2 border-dashed border-[#c4fb6d]/60 bg-[#c4fb6d]/5 flex items-center justify-center mx-auto text-[#c4fb6d]">
                <Globe className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="font-syne text-lg font-bold text-white">
                بانتظار رابط المعاينة السحابي
              </h3>
              <p className="text-xs text-[#e4e4e4]/70 leading-relaxed font-sans">
                ضعي رابط المعاينة الخاص بمشروعك (الذي يبدأ بـ <code>ais-pre-...run.app</code>) في الحقل بالأعلى لتشغيله مباشرة داخل هذه النافذة كنافذة متصلة!
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => setShowHelper(true)}
                  className="btn-tech text-[11px] py-2 px-4"
                >
                  <span>أرني كيف أحصل على الرابط</span>
                  <ArrowLeft className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0c0c0e] border-t border-white/10 flex items-center justify-between text-[11px] font-geist opacity-70">
          <span>STATUS: STANDBY // PROTOCOL: IFRAME_BRIDGE</span>
          {activeFrameUrl && (
            <a 
              href={activeFrameUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#c4fb6d] hover:underline flex items-center gap-1"
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
