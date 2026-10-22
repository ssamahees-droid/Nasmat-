import React from 'react';
import { TEN_SCREENS } from '../constants/tenScreens';
import { SimpleIconChevronLeft } from './common/SimpleSvgIcons';

interface ScreenBannerHeaderProps {
  screenId: string;
  onNavigate: (tab: string) => void;
  onOpenAllScreens?: () => void;
  theme?: 'dark' | 'light' | 'system';
}

export const ScreenBannerHeader: React.FC<ScreenBannerHeaderProps> = ({
  screenId,
  onNavigate,
  onOpenAllScreens,
  theme = 'dark'
}) => {
  const currentScreen = TEN_SCREENS.find(s => s.id === screenId);
  if (!currentScreen) return null;

  const isDark = theme === 'dark';

  return (
    <div className={`w-full mb-6 p-3 sm:p-4 rounded-2xl border transition-all ${
      isDark 
        ? 'bg-[#12221A]/80 border-emerald-500/20 text-stone-200' 
        : 'bg-emerald-50/60 border-emerald-600/15 text-stone-800'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Screen Identifier */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold font-tajawal transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isDark 
                ? 'bg-black/30 hover:bg-black/50 text-emerald-300 border-emerald-500/30' 
                : 'bg-white hover:bg-emerald-100/60 text-emerald-800 border-emerald-600/20 shadow-2xs'
            }`}
            title="الرجوع إلى الشاشة الرئيسية"
          >
            <span>🏠</span>
            <span>الرئيسية</span>
          </button>

          <span className="text-stone-400 text-xs font-light">/</span>

          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-extrabold font-tajawal ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-600/15 text-emerald-900'
            }`}>
              الشاشة {currentScreen.numberArabic} من ١٠
            </span>
            <span className="text-xs sm:text-sm font-bold font-tajawal truncate max-w-[140px] sm:max-w-none">
              {currentScreen.emoji} {currentScreen.shortTitle}
            </span>
          </div>
        </div>

        {/* Quick Screen Switcher button */}
        {onOpenAllScreens && (
          <button
            onClick={onOpenAllScreens}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isDark 
                ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border-emerald-500/30' 
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-600/20 shadow-2xs'
            }`}
          >
            <span>📑</span>
            <span>الشاشات العشر</span>
            <SimpleIconChevronLeft size={12} className="w-3 h-3" />
          </button>
        )}

      </div>
    </div>
  );
};
