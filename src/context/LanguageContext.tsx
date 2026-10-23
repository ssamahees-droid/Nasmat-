/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { allTranslations, SupportedLanguage } from '../i18n';

export type Language = SupportedLanguage;

interface LanguageContextType {
  language: Language;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  dir: 'rtl',
  isRTL: true,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, def) => def || key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nesma_lang');
        if (saved === 'en' || saved === 'ar') return saved;
      } catch {}
    }
    return 'ar';
  });

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nesma_lang', language);
      } catch {}

      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (document.body) {
        document.body.dir = dir;
      }
      document.documentElement.classList.remove('dir-rtl', 'dir-ltr');
      document.documentElement.classList.add(`dir-${dir}`);
    }
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, defaultText?: string, params?: Record<string, string | number>): string => {
    const langDict = allTranslations[language] || {};
    let translation = langDict[key];

    if (!translation) {
      // Fallback to Arabic if English key missing
      const arDict = allTranslations['ar'] || {};
      translation = arDict[key];
    }

    if (!translation) {
      translation = defaultText !== undefined ? defaultText : key;
    }

    if (params && typeof translation === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return translation;
  };

  const contextValue = useMemo(() => ({
    language,
    dir,
    isRTL,
    setLanguage,
    toggleLanguage,
    t
  }), [language, dir, isRTL]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
