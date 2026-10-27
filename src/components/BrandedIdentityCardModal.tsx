/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BrandedIdentityCardModal.tsx
 * Visual interface to design, preview, download, and share high-resolution branded identity cards for «نسمة حياة».
 * Fully aligned with the app's visual identity (Emerald #174F3F, Warm Cream #F7F5EF, Gold #B78327).
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Sparkles, 
  Copy, 
  Check, 
  Palette, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  ExternalLink,
  QrCode,
  Image as ImageIcon
} from 'lucide-react';
import { 
  CardThemeId, 
  CARD_THEMES, 
  renderIdentityCardToCanvas, 
  downloadCanvasAsPng, 
  shareCanvasImage 
} from '../services/cardCanvasGenerator';
import { storage } from '../services/storage';

interface BrandedIdentityCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSenderName?: string;
}

const PRESET_TAGLINES = [
  'مساحة عربية للاهتمام بنفسك، وفهم مشاعرك، واكتشاف تمارين وأدوات تدعم صحتك النفسية برفق ووعي.',
  'توقف قليلاً، خذ نفساً عميقاً، وتذكر أنك تستحق السكينة واللطف مع نفسك 🌿',
  'رحلتك نحو السلام الداخلي تبدأ بخطوة صغيرة وبسيطة كل يوم 🕊️',
  'أنت مش لوحدك؛ نسمة حياة صُممت لتكون رفيقك الهادئ في أصعب أوقاتك 🤍'
];

export const BrandedIdentityCardModal: React.FC<BrandedIdentityCardModalProps> = ({
  isOpen,
  onClose,
  defaultSenderName
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CardThemeId>('emerald');
  const [tagline, setTagline] = useState<string>(PRESET_TAGLINES[0]);
  const [senderName, setSenderName] = useState<string>(() => {
    return defaultSenderName || storage.getUser().name || '';
  });
  const [includeSender, setIncludeSender] = useState<boolean>(true);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Official public app URL
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app';
  const displayUrl = appUrl.replace(/^https?:\/\//, '');

  if (!isOpen) return null;

  const currentTheme = CARD_THEMES[selectedTheme];

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const canvas = await renderIdentityCardToCanvas({
        theme: selectedTheme,
        tagline,
        senderName: includeSender ? senderName : undefined,
        appUrl,
        logoUrl: '/logo.jpg'
      });
      downloadCanvasAsPng(canvas, `nesmat-alhayat-${selectedTheme}-card.png`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to generate identity card for download:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      const canvas = await renderIdentityCardToCanvas({
        theme: selectedTheme,
        tagline,
        senderName: includeSender ? senderName : undefined,
        appUrl,
        logoUrl: '/logo.jpg'
      });
      const res = await shareCanvasImage(
        canvas,
        'تطبيق نسمة حياة | Nesma Hayat',
        `🌿 ${tagline}\n\nجرّب التطبيق المعتمد عبر الرابط:\n${appUrl}`,
        appUrl
      );
      if (res.success) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to share identity card:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${tagline}\n\n${appUrl}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (_) {
      prompt('نسخ الرابط والرسالة:', `${tagline}\n\n${appUrl}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-sm animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-[#F7F5EF] dark:bg-[#121B16] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5DED7] dark:border-stone-800 text-right">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-white/95 dark:bg-[#16221C]/95 border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#174F3F]/15 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center text-xl shadow-xs">
              🖼️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-emerald-300 font-tajawal">
                  مُنشئ البطاقة التعريفية البصرية — «نسمة حياة» 🌿
                </h2>
                <span className="text-[10px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                  PNG عالي الدقة ✨
                </span>
              </div>
              <p className="text-xs text-[#515B55] dark:text-stone-400 mt-0.5">
                صمم بطاقة أنيقة بهوية التطبيق الرسمية، حمّلها بصيغة صورة أو شاركها مباشرة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split into Controls & Live Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls Column (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#174F3F] dark:text-emerald-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>اختر الطابع اللوني للبطاقة:</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CARD_THEMES) as CardThemeId[]).map((themeKey) => {
                  const t = CARD_THEMES[themeKey];
                  const isSelected = selectedTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setSelectedTheme(themeKey)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#174F3F] dark:border-emerald-400 bg-white dark:bg-[#1A2821] shadow-sm scale-102 ring-2 ring-[#174F3F]/20'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-[11px] leading-tight text-center">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Tagline Selector & Customizer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#174F3F] dark:text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>العبارة التعريفية والرسالة:</span>
              </label>

              <div className="space-y-1.5">
                {PRESET_TAGLINES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTagline(preset)}
                    className={`w-full text-right p-2.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                      tagline === preset
                        ? 'border-[#174F3F] dark:border-emerald-500 bg-emerald-500/10 text-[#174F3F] dark:text-emerald-200 font-bold'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#16221C] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    «{preset}»
                  </button>
                ))}
              </div>

              {/* Custom Textarea */}
              <div className="pt-1">
                <textarea
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#16221C] text-xs text-[#292F2B] dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#174F3F]"
                  placeholder="أو اكتب عبارتك المخصصة هنا..."
                />
              </div>
            </div>

            {/* 3. Personalized Dedication */}
            <div className="p-3.5 bg-white dark:bg-[#16221C] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#292F2B] dark:text-stone-200 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSender}
                    onChange={(e) => setIncludeSender(e.target.checked)}
                    className="w-4 h-4 rounded text-[#174F3F] focus:ring-[#174F3F]"
                  />
                  <span>إضافة اسمك كإهداء على البطاقة</span>
                </label>
                <User className="w-3.5 h-3.5 text-stone-400" />
              </div>

              {includeSender && (
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="مثال: صديقك المحب، أو اسمك"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-[#292F2B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#174F3F]"
                />
              )}
            </div>

            {/* 4. Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="py-3 px-4 bg-[#174F3F] hover:bg-[#123C30] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>{downloadSuccess ? 'تم التنزيل بنجاح ✓' : 'تنزيل البطاقة (PNG)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isGenerating}
                  className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{shareSuccess ? 'تمت المشاركة ✓' : 'مشاركة البطاقة'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 bg-white dark:bg-[#16221C] hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
                <span>{copiedLink ? 'تم نسخ الرابط والرسالة بنجاح!' : 'نسخ رابط التطبيق والرسالة التعريفية'}</span>
              </button>
            </div>

          </div>

          {/* Live Preview Column (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5 self-start">
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>معاينة حية ومطابقة لصورة التصدير (1080 × 1350):</span>
            </div>

            {/* Visual Card Mockup (Tailwind representation matching Canvas Output) */}
            <div 
              ref={previewContainerRef}
              className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-7 border-4 shadow-2xl relative overflow-hidden transition-all text-center space-y-4 ${
                selectedTheme === 'emerald'
                  ? 'bg-gradient-to-b from-[#143D32] to-[#092119] border-[#D4AF37] text-white shadow-emerald-950/40'
                  : selectedTheme === 'cream'
                  ? 'bg-gradient-to-b from-[#FAF7F0] to-[#ECE7D8] border-[#174F3F] text-[#292F2B] shadow-stone-400/40'
                  : 'bg-gradient-to-b from-[#101B15] to-[#060B08] border-[#38BDF8] text-white shadow-cyan-950/40'
              }`}
            >
              {/* Inner Decorative Border */}
              <div className={`absolute inset-2 rounded-2xl border pointer-events-none ${
                selectedTheme === 'emerald'
                  ? 'border-[#D4AF37]/40'
                  : selectedTheme === 'cream'
                  ? 'border-[#B78327]/50'
                  : 'border-[#38BDF8]/40'
              }`} />

              {/* Corner Accents */}
              <div className="absolute top-4 right-4 text-xs">✦</div>
              <div className="absolute top-4 left-4 text-xs">✦</div>
              <div className="absolute bottom-4 right-4 text-xs">✦</div>
              <div className="absolute bottom-4 left-4 text-xs">✦</div>

              {/* Logo Section */}
              <div className="pt-2 relative z-10 flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-xl mx-auto bg-[#174F3F]">
                    <img 
                      src="/logo.jpg" 
                      alt="شعار نسمة حياة" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black shadow-sm">
                    🌿
                  </span>
                </div>

                <h3 className={`text-2xl font-black mt-3 font-tajawal tracking-wide ${
                  selectedTheme === 'cream' ? 'text-[#174F3F]' : 'text-white'
                }`}>
                  نَسْمَةُ حَيَاة
                </h3>

                <p className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase mt-0.5">
                  NESMAT AL-HAYAT · MENTAL WELLNESS
                </p>

                {/* Verification Pill */}
                <div className={`mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1.5 ${
                  selectedTheme === 'cream'
                    ? 'bg-white border-[#D5DED7] text-[#174F3F]'
                    : 'bg-white/10 border-white/15 text-emerald-200'
                }`}>
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>مبادرة عربية إنسانية للتوعية بالصحة النفسية</span>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-2 py-1 opacity-70">
                <span className="h-[1px] w-12 bg-current" />
                <span className="text-amber-400 text-xs">◆</span>
                <span className="h-[1px] w-12 bg-current" />
              </div>

              {/* Main Tagline Message */}
              <div className="space-y-1.5 relative z-10">
                <p className="text-xs sm:text-sm font-bold leading-relaxed px-2">
                  «{tagline}»
                </p>

                {includeSender && senderName.trim() && (
                  <p className="text-[11px] font-semibold text-amber-400 italic">
                    إهداء بكل محبة ومساندة من: {senderName.trim()}
                  </p>
                )}
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="grid grid-cols-2 gap-2 text-right relative z-10 pt-1">
                <div className={`p-2 rounded-xl border text-[10px] space-y-0.5 ${
                  selectedTheme === 'cream' ? 'bg-white/80 border-[#D5DED7]' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="font-extrabold flex items-center gap-1 text-emerald-500">
                    <span>🍃</span>
                    <span>واحة التنفس</span>
                  </div>
                  <p className="text-[9px] opacity-75">تمارين 432Hz للهدوء</p>
                </div>

                <div className={`p-2 rounded-xl border text-[10px] space-y-0.5 ${
                  selectedTheme === 'cream' ? 'bg-white/80 border-[#D5DED7]' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="font-extrabold flex items-center gap-1 text-amber-500">
                    <span>🧠</span>
                    <span>استوديو الأفكار</span>
                  </div>
                  <p className="text-[9px] opacity-75">تفكيك التشوهات (CBT)</p>
                </div>

                <div className={`p-2 rounded-xl border text-[10px] space-y-0.5 ${
                  selectedTheme === 'cream' ? 'bg-white/80 border-[#D5DED7]' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="font-extrabold flex items-center gap-1 text-sky-400">
                    <span>📖</span>
                    <span>مكتبة المعرفة</span>
                  </div>
                  <p className="text-[9px] opacity-75">كتب معتمدة من WHO</p>
                </div>

                <div className={`p-2 rounded-xl border text-[10px] space-y-0.5 ${
                  selectedTheme === 'cream' ? 'bg-white/80 border-[#D5DED7]' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="font-extrabold flex items-center gap-1 text-purple-400">
                    <span>🧩</span>
                    <span>بستان الألعاب</span>
                  </div>
                  <p className="text-[9px] opacity-75">شفرة نسمة والألغاز</p>
                </div>
              </div>

              {/* Official App URL Badge */}
              <div className={`p-2.5 rounded-xl border relative z-10 flex items-center justify-between text-[10px] font-mono ${
                selectedTheme === 'cream'
                  ? 'bg-emerald-50 border-[#174F3F]/30 text-[#174F3F]'
                  : 'bg-black/40 border-amber-500/30 text-amber-300'
              }`}>
                <span className="truncate max-w-[220px] font-bold">🔗 {displayUrl}</span>
                <span className="flex items-center gap-1 shrink-0 text-[9px] font-sans font-bold">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>معتمد</span>
                </span>
              </div>

              {/* Bottom Guarantee Signature */}
              <div className="text-[9px] opacity-75 relative z-10 pt-1">
                🌿 تطبيق عربي آمن ومجاني 100% · يعمل دون إنترنت
              </div>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 text-center">
              💡 اضغط على زر <strong>«تنزيل البطاقة»</strong> لحفظ الصورة بدقة 1080p لمشاركتها على واتساب، إنستغرام أو تويتر.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
