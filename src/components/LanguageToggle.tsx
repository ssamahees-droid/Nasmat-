/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { language, setLanguage } = useLanguage();
  const isArabic = language === 'ar';

  const handleToggle = () => {
    const nextLang = isArabic ? 'en' : 'ar';
    const nextDir = nextLang === 'ar' ? 'rtl' : 'ltr';
    
    // Explicitly update HTML and Body root attributes
    document.documentElement.dir = nextDir;
    document.documentElement.lang = nextLang;
    if (document.body) {
      document.body.dir = nextDir;
    }
    
    // Persist and update context state
    try {
      localStorage.setItem('nesma_lang', nextLang);
    } catch {}
    setLanguage(nextLang);
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#D5DED7] bg-white text-[#174F3F] hover:bg-[#E2EFE7] text-[16px] font-bold transition-all shadow-xs cursor-pointer min-h-[48px] ${className}`}
        aria-label={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
        title={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
      >
        <Globe className="w-5 h-5 text-[#23785B]" />
        <span>{isArabic ? 'English (EN)' : 'العربية (AR)'}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-1 rounded-full border-2 border-[#D5DED7] bg-[#F7F5EF] ${className}`}>
        <button
          onClick={() => {
            if (language !== 'ar') {
              document.documentElement.dir = 'rtl';
              document.documentElement.lang = 'ar';
              if (document.body) document.body.dir = 'rtl';
              try {
                localStorage.setItem('nesma_lang', 'ar');
              } catch {}
              setLanguage('ar');
            }
          }}
          className={`px-3.5 py-1.5 rounded-full text-[14px] font-bold transition-all cursor-pointer min-h-[38px] ${
            isArabic 
              ? 'bg-[#174F3F] text-white shadow-xs' 
              : 'text-[#515B55] hover:text-[#174F3F]'
          }`}
        >
          عربي
        </button>
        <button
          onClick={() => {
            if (language !== 'en') {
              document.documentElement.dir = 'ltr';
              document.documentElement.lang = 'en';
              if (document.body) document.body.dir = 'ltr';
              try {
                localStorage.setItem('nesma_lang', 'en');
              } catch {}
              setLanguage('en');
            }
          }}
          className={`px-3.5 py-1.5 rounded-full text-[14px] font-bold transition-all cursor-pointer min-h-[38px] ${
            !isArabic 
              ? 'bg-[#174F3F] text-white shadow-xs' 
              : 'text-[#515B55] hover:text-[#174F3F]'
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  // Compact default variant (used in Navbar header & Welcome screen)
  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D5DED7] bg-white text-[#174F3F] hover:bg-[#E2EFE7] transition-all cursor-pointer text-[15px] font-bold shadow-2xs min-h-[44px] ${className}`}
      aria-label={isArabic ? 'Switch interface to English' : 'تحويل الواجهة إلى العربية'}
      title={isArabic ? 'Switch interface to English' : 'تحويل الواجهة إلى العربية'}
    >
      <Globe className="w-4 h-4 text-[#23785B]" />
      <span>{isArabic ? 'English' : 'عربي'}</span>
    </button>
  );
};
