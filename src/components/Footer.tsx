/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenEmergencyHelp: () => void;
  onOpenBooklet?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenEmergencyHelp,
  onOpenBooklet
}) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <footer 
      className={`mt-16 border-t-2 border-[#D5DED7] bg-[#FFFFFF] text-[#292F2B] font-tajawal transition-colors ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Initiative Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="text-[14px] text-[#174F3F] font-bold">
              {t('footer.initiative_title', 'مبادرة نسمة حياة · الدعم النفسي الآمن')}
            </div>
            <div className="font-black text-[26px] text-[#174F3F] tracking-tight">
              {t('brand.title', 'نسمة حياة')}
            </div>
            <p className="text-[17px] text-[#515B55] leading-relaxed font-medium">
              {t('footer.initiative_desc', 'مساحة عربية آمنة وهادئة تفهمك وتساندك. أدوات عملية لاستكشاف الذات، تفكيك الضغوط، وبناء المرونة النفسية بكرامة ووضوح دون أحكام مسبقة.')}
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-2.5">
            <div className="text-[15px] text-[#174F3F] font-bold border-b border-[#D5DED7] pb-1">
              {t('footer.self_discovery_section', '// الاستكشاف الذاتي')}
            </div>
            <ul className="space-y-2 text-[16px] font-bold">
              <li>
                <button onClick={() => onNavigate('start')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Start Here & Orientation' : 'جولة في الجنينة (ابدأ من هنا)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('listen-to-yourself')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Listen to Yourself (Inner Dialogue)' : 'اسمع نفسك (الطفل والراشد والأب)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weekly-session')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Weekly Psychological Session' : 'الجلسة الأسبوعية (خزائن النفس)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('self-discovery')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Self-Discovery & Emotion Compass' : 'الفحص الذاتي وبوصلة المشاعر'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Tools & Booklet */}
          <div className="space-y-2.5">
            <div className="text-[15px] text-[#174F3F] font-bold border-b border-[#D5DED7] pb-1">
              {t('footer.tools_section', '// الأدوات والممارسات')}
            </div>
            <ul className="space-y-2 text-[16px] font-bold">
              <li>
                <button onClick={() => onOpenBooklet ? onOpenBooklet() : onNavigate('explore')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Nesmat 12-Chapter Booklet' : 'كتيب نسمة حياة بفصوله الـ 12'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Breathing & Journal Exercises' : 'تمارين التنفس واليوميات والخطط'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rescue')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Crisis Intervention Protocols' : 'خطط التدخل السريع وقت الأزمات'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="min-h-[44px] hover:text-[#23785B] text-[#292F2B] transition-colors cursor-pointer">
                  {language === 'en' ? 'Specialized Care & Support' : 'طلب المساندة والدعم التخصصي'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Urgent SOS Warning & Disclaimer */}
          <div className="space-y-3">
            <div className="text-[15px] text-[#991B1B] font-bold border-b border-[#D5DED7] pb-1">
              {t('footer.sos_section', '// خطوط المساندة العاجلة')}
            </div>
            <div className="bg-[#F8EED8] text-[#292F2B] p-4 rounded-2xl border border-[#B78327]/30 shadow-xs space-y-2.5">
              <div className="font-bold text-[18px] text-[#991B1B]">
                {language === 'en' ? 'Emergency / SOS 🛟' : 'طوارئ / SOS 🛟'}
              </div>
              <p className="leading-relaxed text-[16px] font-medium text-[#292F2B]">
                {t('footer.sos_warning', 'إذا كنت في أزمة حادة أو تراودك أفكار لإيذاء نفسك، اطلب المساندة الفورية الآن.')}
              </p>
              <button
                onClick={onOpenEmergencyHelp}
                className="w-full min-h-[48px] py-2.5 px-3 bg-[#991B1B] hover:bg-[#7f1d1d] text-white rounded-xl text-[16px] font-bold transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                {t('footer.sos_btn', 'أرقام الطوارئ والدعم العاجل')}
              </button>
            </div>
            <p className="text-[14px] text-[#515B55] pt-1 leading-relaxed font-medium">
              {t('footer.disclaimer', '* تنويه: التطبيق للتوعية والدعم الذاتي وليس بديلاً عن التشخيص الطبي المتخصص.')}
            </p>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 border-t border-[#D5DED7] flex flex-col sm:flex-row items-center justify-between gap-3 text-[15px] font-medium">
          <div className="text-[#515B55]">
            {t('brand.copyright', 'حقوق الطبع والنشر 2026 © مبادرة نسمة حياة')}
          </div>
          <div className="text-[#174F3F] font-bold">
            {t('brand.motto', '🌿 رفقاً بالنفس · وخطوة بخطوة نحو السكينة')}
          </div>
        </div>

      </div>
    </footer>
  );
};
