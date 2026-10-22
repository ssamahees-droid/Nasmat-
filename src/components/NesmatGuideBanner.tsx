import React, { useState } from 'react';
import { SimpleIconSparkles } from './common/SimpleSvgIcons';

interface NesmatGuideBannerProps {
  theme?: 'dark' | 'light' | 'system';
  onNavigate: (route: string) => void;
  onOpenCompanion: () => void;
}

const GREETINGS = [
  "أهلًا يا صديقتي 🤍، تحبي نبدأ منين النهارده؟",
  "مساء أو صباح السكينة 🌿.. أنا هنا لأرشدك لِما يحتاجه قلبك الآن.",
  "أهلاً بكِ في مساحتك الآمنة 🍃.. اختاري المساحة التي تناسب طاقتك اليوم.",
  "كل خطوة صغيرة تصنع فرقاً في سلامك الداخلي 🤍.. كيف أساعدك اليوم؟"
];

export const NesmatGuideBanner: React.FC<NesmatGuideBannerProps> = ({
  theme = 'dark',
  onNavigate,
  onOpenCompanion
}) => {
  const isDark = theme === 'dark';
  const [greetingIndex] = useState(() => Math.floor(Math.random() * GREETINGS.length));
  const currentGreeting = GREETINGS[greetingIndex];

  return (
    <section className={`p-4 sm:p-8 border rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-xs transition-all ${
      isDark 
        ? 'bg-gradient-to-br from-[#162D24] via-[#12241D] to-[#0D1914] border-[#A9C5A0]/25' 
        : 'bg-gradient-to-br from-[#F7F3E9] via-[#E6E8D8] to-[#DFE5D5] border-[#174C3C]/15'
    }`}>
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#A9C5A0]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10 text-right">
        
        {/* Guide Avatar & Identity */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="relative shrink-0">
            <img 
              src="/src/assets/images/nesma_hayat_official_logo_1791445448383.jpg" 
              alt="نسمة حياة — المرشدة الدائمة" 
              width="96"
              height="96"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover border-2 border-[#174C3C] dark:border-[#A9C5A0] shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#174C3C] dark:bg-[#A9C5A0] text-white dark:text-[#0D1914] rounded-full border-2 border-white dark:border-[#0D1914] flex items-center justify-center text-[10px] sm:text-xs shadow-xs">
              🌿
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 text-[#174C3C] dark:text-[#A9C5A0] font-jetbrains text-[10px] uppercase font-bold rounded-full border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
              <span>المرشدة الدائمة</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-syne font-black text-[#174C3C] dark:text-[#F7F3E9] leading-snug">
              {currentGreeting}
            </h2>
            <p className="text-xs sm:text-sm text-[#13251E]/75 dark:text-[#F7F3E9]/75 max-w-xl leading-relaxed">
              أنا نسمة حياة، مرشدتك في هذه المنصة. هدفي هو تيسير وصولك إلى المساحة النفسية التي تحتاجينها بكل دفء وأمان دون أي ضغط أو أحكام.
            </p>
          </div>
        </div>

        {/* Quick Guide Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={() => onNavigate('listen-to-yourself')}
            className="w-full sm:w-auto px-5 py-3 bg-white dark:bg-[#1B342A] text-[#174C3C] dark:text-[#F7F3E9] font-bold text-xs rounded-xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/30 shadow-xs hover:bg-[#F7F3E9] dark:hover:bg-[#224235] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2 font-cairo"
          >
            <span>🧠 اسمع نفسك</span>
          </button>

          <button
            onClick={onOpenCompanion}
            className="w-full sm:w-auto px-5 py-3 bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-[#F7F3E9] dark:text-[#0D1914] font-bold text-xs rounded-xl border border-transparent shadow-xs hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2 font-cairo"
          >
            <SimpleIconSparkles size={14} className="w-3.5 h-3.5 text-[#D5A65A] dark:text-[#174C3C]" />
            <span>🌿 افتح رفيقي</span>
          </button>
        </div>

      </div>
    </section>
  );
};
