import React, { useState } from 'react';
import { TEN_SCREENS, TenScreenItem } from '../constants/tenScreens';
import { SimpleIconChevronLeft, SimpleIconCheck } from './common/SimpleSvgIcons';

interface TenScreensModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onNavigate: (tabId: string) => void;
  theme?: 'dark' | 'light' | 'system';
}

export const TenScreensModal: React.FC<TenScreensModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  theme = 'dark'
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const filteredScreens = TEN_SCREENS.filter(s => 
    s.title.includes(filterQuery) || 
    s.tagline.includes(filterQuery) || 
    s.shortTitle.includes(filterQuery) ||
    s.features.some(f => f.includes(filterQuery))
  );

  const handleSelectScreen = (screenId: string) => {
    onNavigate(screenId);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div 
        className={`w-full max-w-2xl max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl border shadow-2xl overflow-hidden transition-all text-right font-tajawal ${
          isDark 
            ? 'bg-[#0F1E17] border-emerald-500/30 text-stone-100' 
            : 'bg-[#FCFBF8] border-emerald-600/20 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
          isDark ? 'border-white/10 bg-black/20' : 'border-stone-200 bg-emerald-50/50'
        }`}>
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 text-xs font-bold">
              <span>🌿 خريطة المحتوى الشاملة</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 font-extrabold">١٠ شاشات</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold mt-0.5">
              بوابات نسمة حياة العشرة 🌸
            </h2>
          </div>

          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer text-sm font-bold ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-300' 
                : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 shadow-2xs'
            }`}
            aria-label="إغلاق النافذة"
          >
            ✕
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-3 sm:p-4 border-b border-stone-200/50 dark:border-white/5">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="ابحث عن شاشة (تنفس، ألعاب، استكشاف الذات، طوارئ...)"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-tajawal focus:outline-hidden transition-all ${
              isDark 
                ? 'bg-black/30 border-white/10 text-white placeholder-stone-400 focus:border-emerald-400' 
                : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-emerald-500 shadow-2xs'
            }`}
          />
        </div>

        {/* Welcome Screen direct access */}
        <div className="px-3 sm:px-4 pt-2">
          <button
            onClick={() => handleSelectScreen('welcome')}
            className={`w-full p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
              currentTab === 'welcome'
                ? 'bg-emerald-500 text-black border-emerald-400'
                : isDark
                  ? 'bg-emerald-950/40 border-emerald-500/25 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">👋</span>
              <span>شاشة الترحيب المستقلة (رسالة المبادرة والخصوصية)</span>
            </div>
            <span className="text-[11px] font-bold">عرض لوحدها ←</span>
          </button>
        </div>

        {/* Screen list */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-2.5 divide-y divide-transparent">
          {filteredScreens.map((screen) => {
            const isCurrent = currentTab === screen.id;
            return (
              <div
                key={screen.id}
                onClick={() => handleSelectScreen(screen.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none active:scale-[0.99] ${
                  isCurrent
                    ? isDark
                      ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/40'
                      : 'bg-emerald-50 border-emerald-500 shadow-xs'
                    : isDark
                      ? 'bg-black/20 border-white/10 hover:border-emerald-500/40 hover:bg-white/5'
                      : 'bg-white border-stone-200 hover:border-emerald-500/40 hover:bg-emerald-50/30 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-2xs ${
                    isDark ? 'bg-black/30 border border-white/10' : 'bg-emerald-50 border border-emerald-600/15'
                  }`}>
                    {screen.emoji}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isCurrent 
                          ? 'bg-emerald-500 text-black' 
                          : isDark ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
                      }`}>
                        الشاشة {screen.numberArabic}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold truncate">
                        {screen.title}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                          <SimpleIconCheck size={10} className="w-2.5 h-2.5" /> أنت هنا الآن
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] sm:text-xs leading-relaxed line-clamp-2 ${
                      isDark ? 'text-stone-300' : 'text-stone-600'
                    }`}>
                      {screen.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {screen.features.map((feat, idx) => (
                        <span 
                          key={idx}
                          className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md ${
                            isDark ? 'bg-white/5 text-stone-400' : 'bg-stone-50 text-stone-600 border border-stone-200/60'
                          }`}
                        >
                          • {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500 text-black shadow-xs'
                        : isDark
                          ? 'bg-white/10 hover:bg-white/20 text-stone-200'
                          : 'bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span>{isCurrent ? 'الشاشة الحالية' : 'ادخل الشاشة'}</span>
                    <SimpleIconChevronLeft size={14} className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-3 sm:p-4 border-t text-center text-xs ${
          isDark ? 'border-white/10 bg-black/20 text-stone-400' : 'border-stone-200 bg-stone-50 text-stone-600'
        }`}>
          نسمة حياة مساحة حرة ومفتوحة — تنقّل بين الشاشات العشر وفق ما تشعر به في كل لحظة 🌿
        </div>
      </div>
    </div>
  );
};
