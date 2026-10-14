import React from 'react';

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
  return (
    <footer className="mt-16 border-t border-[#174C3C]/15 dark:border-[#A9C5A0]/15 bg-[#E6E8D8]/60 dark:bg-[#0A1410] text-[#13251E] dark:text-[#F7F3E9] font-cairo transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">
          
          {/* Col 1: Initiative Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="font-jetbrains text-[10px] text-[#174C3C] dark:text-[#A9C5A0] uppercase tracking-wider font-bold">
              مبادرة نسمة حياة · الدعم النفسي الآمن
            </div>
            <div className="font-syne font-black text-2xl text-[#174C3C] dark:text-[#F7F3E9] tracking-tight">
              نسمة حياة
            </div>
            <p className="text-xs text-[#13251E]/75 dark:text-[#F7F3E9]/75 leading-relaxed">
              مساحة عربية آمنة وهادئة تفهمك وتساندك. أدوات عملية لاستكشاف الذات، تفكيك الضغوط، وبناء المرونة النفسية بكرامة ووضوح دون أحكام مسبقة.
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-2">
            <div className="font-jetbrains text-[10px] text-[#174C3C] dark:text-[#A9C5A0] uppercase tracking-wider font-bold">
              // الاستكشاف الذاتي
            </div>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('start')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  جولة في الجنينة (ابدأ من هنا)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('listen-to-yourself')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  اسمع نفسك (الطفل والراشد والأب)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weekly-session')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  الجلسة الأسبوعية (خزائن النفس)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('self-discovery')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  الفحص الذاتي وبوصلة المشاعر
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Tools & Booklet */}
          <div className="space-y-2">
            <div className="font-jetbrains text-[10px] text-[#174C3C] dark:text-[#A9C5A0] uppercase tracking-wider font-bold">
              // الأدوات والممارسات
            </div>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => onOpenBooklet ? onOpenBooklet() : onNavigate('explore')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  كتيب نسمة حياة بفصوله الـ 12
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  تمارين التنفس واليوميات والخطط
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rescue')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  خطط التدخل السريع وقت الأزمات
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-[#174C3C] dark:hover:text-[#A9C5A0] transition-colors cursor-pointer">
                  طلب المساندة والدعم التخصصي
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Urgent SOS Warning & Disclaimer */}
          <div className="space-y-2">
            <div className="font-jetbrains text-[10px] text-[#D98F83] uppercase tracking-wider font-bold">
              // خطوط المساندة العاجلة
            </div>
            <div className="bg-[#D98F83] text-white p-4 rounded-2xl border border-[#D98F83]/40 shadow-xs space-y-2">
              <div className="font-syne font-black text-sm">
                طوارئ / SOS
              </div>
              <p className="leading-snug text-[11px] font-medium">
                إذا كنت في أزمة حادة أو تراودك أفكار لإيذاء نفسك، اطلب المساندة الفورية الآن.
              </p>
              <button
                onClick={onOpenEmergencyHelp}
                className="w-full py-2 bg-[#174C3C] text-[#F7F3E9] rounded-xl text-xs font-bold hover:bg-[#123C30] transition-colors cursor-pointer shadow-2xs"
              >
                أرقام الطوارئ والدعم العاجل
              </button>
            </div>
            <p className="text-[10px] text-[#13251E]/60 dark:text-[#F7F3E9]/60 pt-1 leading-relaxed">
              * تنويه: التطبيق للتوعية والدعم الذاتي وليس بديلاً عن التشخيص الطبي المتخصص.
            </p>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-jetbrains">
          <div className="text-[#13251E]/75 dark:text-[#F7F3E9]/75">
            حقوق الطبع والنشر 2026 © مبادرة نسمة حياة
          </div>
          <div className="text-[#174C3C] dark:text-[#A9C5A0] tracking-wider font-semibold">
            🌿 رفقاً بالنفس · وخطوة بخطوة نحو السكينة
          </div>
        </div>

      </div>
    </footer>
  );
};
