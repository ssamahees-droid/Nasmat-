/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AchievementShareCardModal.tsx
 * Comprehensive Sharing & Branded Card Hub for «نسمة حياة»:
 * - Share App itself with official introductory Arabic message.
 * - Copy App link with confirmation.
 * - Generate and share/download App introductory cards & daily achievement cards.
 */

import React, { useState } from 'react';
import { X, Share2, Sparkles, Download, CheckCircle2, Wind, Flame, Smartphone, Copy, QrCode, Palette } from 'lucide-react';
import { storage } from '../services/storage';
import { shareContent } from '../services/shareService';
import { renderIdentityCardToCanvas, downloadCanvasAsPng, shareCanvasImage } from '../services/cardCanvasGenerator';
import { BrandedIdentityCardModal } from './BrandedIdentityCardModal';

interface AchievementShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementShareCardModal: React.FC<AchievementShareCardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'app_share' | 'app_intro_card' | 'breathing' | 'streak' | 'wisdom'>('app_share');
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customIntroText, setCustomIntroText] = useState(
    '🌿 تعرّف على نسمة حياة\nمساحة عربية للاهتمام بنفسك، وفهم مشاعرك، واكتشاف تمارين وألعاب وأدوات تساعدك على العناية بصحتك النفسية.\nجرّب التطبيق وشاركه مع من تحب 🤍'
  );

  if (!isOpen) return null;

  // Official public app URL
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app';

  // Gather stats for achievement cards
  const checkins = storage.getDailyCheckins();
  const mindfulness = storage.getMindfulnessRecords();
  const totalMinutes = mindfulness.reduce((acc, m) => acc + Math.round((m.durationSeconds || 180) / 60), 12);
  const streakDays = Math.max(3, checkins.length);

  const handleShareApp = async () => {
    const fullText = `${customIntroText}\n\n${appUrl}`;
    const res = await shareContent({
      title: 'تطبيق نسمة حياة | Nesma Hayat',
      text: fullText,
      url: appUrl
    });

    if (res.success) {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 3500);
    }
  };

  const handleShareBrandedCard = async () => {
    try {
      setIsGenerating(true);
      const canvas = await renderIdentityCardToCanvas({
        theme: 'emerald',
        tagline: 'مساحة عربية للاهتمام بنفسك، وفهم مشاعرك، والعناية بصحتك النفسية برفق ووعي.',
        appUrl,
        logoUrl: '/logo.jpg'
      });
      const res = await shareCanvasImage(
        canvas,
        'تطبيق نسمة حياة | Nesma Hayat',
        `🌿 مساحة عربية للاهتمام بنفسك، وفهم مشاعرك، والعناية بصحتك النفسية برفق ووعي.\n${appUrl}`,
        appUrl
      );
      if (res.success) {
        setCopiedStatus(true);
        setTimeout(() => setCopiedStatus(false), 3500);
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 3500);
    } catch (_) {
      prompt('نسخ رابط التطبيق:', appUrl);
    }
  };

  const handleDownloadCard = async () => {
    try {
      setIsGenerating(true);
      const canvas = await renderIdentityCardToCanvas({
        theme: 'emerald',
        tagline: 'مساحة عربية للاهتمام بنفسك، وفهم مشاعرك، والعناية بصحتك النفسية برفق ووعي.',
        appUrl,
        logoUrl: '/logo.jpg'
      });
      downloadCanvasAsPng(canvas, 'nesmat-alhayat-identity-card.png');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
      <div className="bg-[#18261E] border border-emerald-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden text-right text-white relative">
        
        {/* Top Header */}
        <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between bg-[#121D17]">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              🌿
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                مركز مشاركة التطبيق وبطاقات السكينة
              </h3>
              <p className="text-[11px] text-emerald-200/70">
                شارك تطبيق «نسمة حياة» وإنجازاتك اليومية مع من تحب بلمسة واحدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="p-3 bg-[#14201A] border-b border-emerald-500/20 flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('app_share')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'app_share'
                ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>شارك التطبيق</span>
          </button>

          <button
            onClick={() => setActiveTab('app_intro_card')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'app_intro_card'
                ? 'bg-emerald-500 text-stone-950 font-black shadow-md'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>بطاقة التطبيق</span>
          </button>

          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'breathing'
                ? 'bg-teal-400 text-stone-950 font-black shadow-md'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>بطاقة التنفس</span>
          </button>

          <button
            onClick={() => setActiveTab('streak')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'streak'
                ? 'bg-purple-400 text-stone-950 font-black shadow-md'
                : 'bg-white/10 text-stone-300 hover:bg-white/15'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>بطاقة السلسلة</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Tab 1: Share App Directly */}
          {activeTab === 'app_share' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-3">
                <label className="text-xs font-bold text-emerald-300 block">
                  الرسالة التعريفية القابلة للتعديل قبل المشاركة:
                </label>
                <textarea
                  value={customIntroText}
                  onChange={(e) => setCustomIntroText(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-xs text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#121D17] border border-emerald-500/20 flex items-center justify-between gap-3">
                <div className="truncate text-xs font-mono text-emerald-300">
                  🔗 {appUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                  <span>نسخ الرابط</span>
                </button>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleShareApp}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>شارك تطبيق نسمة حياة الآن 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: App Introductory Card */}
          {activeTab === 'app_intro_card' && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#174F3F] via-[#123E32] to-[#0D2C24] border-2 border-emerald-400/40 p-6 sm:p-7 text-center space-y-5 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-2xl mx-auto shadow-lg font-black">
                  🌿
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xl font-black text-white">نسمة حياة | Nesma Hayat</h4>
                  <p className="text-xs text-emerald-200">منصة عربية تفاعلية للصحة النفسية والاستكشاف الذاتي الآمن</p>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-sm mx-auto">
                  «مساحة آمنة تمنحك أدوات التهدئة، التنفس، ومتابعة الرحلة بوعي ورفق.»
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                  <span>{appUrl}</span>
                  <span className="flex items-center gap-1"><QrCode className="w-4 h-4" /> رابط معتمد</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleShareBrandedCard}
                    disabled={isGenerating}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة البطاقة التعريفية</span>
                  </button>
                  <button
                    onClick={handleDownloadCard}
                    disabled={isGenerating}
                    className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-white/20 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{downloadSuccess ? 'تم التنزيل ✓' : 'تنزيل (PNG)'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-emerald-400/30"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-300" />
                  <span>تخصيص البطاقة بالكامل (الألوان، الشعار، الإهداء) 🎨</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Breathing Achievement Card */}
          {activeTab === 'breathing' && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#174F3F] via-[#123E32] to-[#0D2C24] border-2 border-teal-400/40 p-6 text-center space-y-5 shadow-2xl">
                <div className="text-4xl">🫁✨</div>
                <h4 className="text-lg font-black text-white leading-tight">
                  إنجازي اليومي: سكون واعي ودقائق تنفس أعادت ترتيب الروح 🌿
                </h4>
                <p className="text-xs text-emerald-100/90 max-w-xs mx-auto">
                  «الاستراحة ضرورة لراحة جهازك العصبي ومنح قلبك مساحة للسلام.»
                </p>
                <div className="pt-2 text-xs font-mono text-teal-300">
                  ⏱️ إجمالي {totalMinutes} دقيقة تنفس ويقظة
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleShareApp}
                  className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-stone-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة بطاقة التنفس</span>
                </button>
                <button
                  onClick={handleDownloadCard}
                  className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-white/20"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>تنزيل</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Streak Achievement Card */}
          {activeTab === 'streak' && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B2E] via-[#1E1220] to-[#120B13] border-2 border-purple-400/40 p-6 text-center space-y-5 shadow-2xl">
                <div className="text-4xl">🔥</div>
                <h4 className="text-lg font-black text-purple-200 leading-tight">
                  {streakDays} أيام متتالية من الاستمرارية الهادئة والرفق بالذات ☕
                </h4>
                <p className="text-xs text-purple-100/80 max-w-xs mx-auto">
                  «الخطوات الصغيرة المنتظمة تصنع استقراراً وسلاماً مستداماً.»
                </p>
                <div className="pt-2 text-xs font-mono text-purple-300">
                  ⭐ التزام واعي ومتراكم عبر نسمة حياة
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleShareApp}
                  className="flex-1 py-3 bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة بطاقة السلسلة</span>
                </button>
                <button
                  onClick={handleDownloadCard}
                  className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-white/20"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>تنزيل</span>
                </button>
              </div>
            </div>
          )}

          {/* Toast Status */}
          {(copiedStatus || downloadSuccess) && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-xs text-emerald-200 text-center font-bold animate-fade-in">
              {copiedStatus ? '✅ تم نسخ الرابط والرسالة بنجاح وجاهزة للمشاركة!' : '✅ تم بدء تنزيل البطاقة بصيغة PNG بنجاح!'}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121D17] border-t border-emerald-500/20 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-mono">نسمة حياة v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>

      {/* Full Visual Identity Card Customizer Modal */}
      <BrandedIdentityCardModal 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
      />
    </div>
  );
};
