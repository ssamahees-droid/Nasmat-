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
  const { language, setLanguage, toggleLanguage } = useLanguage();
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
    localStorage.setItem('nesma_lang', nextLang);
    setLanguage(nextLang);
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 bg-white/90 dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A] text-xs font-bold transition-all shadow-xs cursor-pointer ${className}`}
        aria-label={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
        title={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
      >
        <Globe className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
        <span>{isArabic ? 'English (EN)' : 'العربية (AR)'}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-1 rounded-full border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 bg-[#E6E8D8]/70 dark:bg-[#14271F] ${className}`}>
        <button
          onClick={() => {
            if (language !== 'ar') {
              document.documentElement.dir = 'rtl';
              document.documentElement.lang = 'ar';
              if (document.body) document.body.dir = 'rtl';
              localStorage.setItem('nesma_lang', 'ar');
              setLanguage('ar');
            }
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isArabic 
              ? 'bg-[#174C3C] text-[#F7F3E9] shadow-xs' 
              : 'text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:text-[#174C3C] dark:hover:text-[#A9C5A0]'
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
              localStorage.setItem('nesma_lang', 'en');
              setLanguage('en');
            }
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            !isArabic 
              ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] shadow-xs' 
              : 'text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:text-[#174C3C] dark:hover:text-[#A9C5A0]'
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  // Compact default variant (used in Navbar header)
  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/60 dark:hover:bg-[#1B342A] transition-all cursor-pointer text-xs font-bold shadow-2xs ${className}`}
      aria-label={isArabic ? 'Switch interface to English' : 'تحويل الواجهة إلى العربية'}
      title={isArabic ? 'Switch interface to English' : 'تحويل الواجهة إلى العربية'}
    >
      <Globe className="w-3.5 h-3.5 text-[#174C3C] dark:text-[#A9C5A0]" />
      <span>{isArabic ? 'EN' : 'عربي'}</span>
    </button>
  );
};
