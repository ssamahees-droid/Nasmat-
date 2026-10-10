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
    <footer className="mt-16 border-t-[1.5px] border-[#111113] dark:border-white/20 bg-[#F2EFEB] dark:bg-[#121214] text-[#111113] dark:text-[#F2EFEB] font-cairo transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">
          
          {/* Col 1: Initiative Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="font-jetbrains text-[10px] text-[#E36E4D] uppercase tracking-wider font-semibold">
              MOUBADARA_01 · NESMA HAYAT
            </div>
            <div className="font-syne font-black text-2xl tracking-tight">
              نسمة حياة
            </div>
            <p className="text-xs text-[#111113]/70 dark:text-[#F2EFEB]/70 leading-relaxed">
              مساحة عربية آمنة وهادئة تفهمك وتساندك. أدوات عملية لاستكشاف الذات، تفكيك الضغوط، وبناء المرونة النفسية بكرامة ووضوح دون أحكام مسبقة.
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-2">
            <div className="font-jetbrains text-[10px] text-[#E36E4D] uppercase tracking-wider font-bold">
              // DISCOVERY
            </div>
            <ul className="space-y-1.5 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('start')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  جولة في الجنينة (ابدأ من هنا)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('self-discovery')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  الفحص الذاتي وبوصلة المشاعر
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('games')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  ألعاب الاستراحة وتطبيق «فكّر»
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  مكتبة التثقيف النفسي ومقالات الكتيب
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Tools & Booklet */}
          <div className="space-y-2">
            <div className="font-jetbrains text-[10px] text-[#E36E4D] uppercase tracking-wider font-bold">
              // PRACTICAL_TOOLS
            </div>
            <ul className="space-y-1.5 text-xs font-semibold">
              <li>
                <button onClick={() => onOpenBooklet ? onOpenBooklet() : onNavigate('explore')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  كتيب نسمة حياة بفصوله الـ 12
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  تمارين التنفس واليوميات والخطط
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rescue')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  خطط التدخل السريع وقت الأزمات
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-[#E36E4D] transition-colors cursor-pointer">
                  طلب المساندة والدعم التخصصي
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Urgent SOS Warning & Disclaimer */}
          <div className="space-y-2">
            <div className="font-jetbrains text-[10px] text-[#E36E4D] uppercase tracking-wider font-bold">
              // EMERGENCY_SOS
            </div>
            <div className="bg-[#E36E4D] text-white p-3.5 rounded-xl border-[1.5px] border-[#111113] shadow-[3px_3px_0_#111113] text-xs space-y-2">
              <div className="font-syne font-black text-sm">
                طوارئ / SOS
              </div>
              <p className="leading-snug text-[11px] font-bold">
                إذا كنت في أزمة حادة أو تراودك أفكار لإيذاء نفسك، اطلب المساندة الفورية الآن.
              </p>
              <button
                onClick={onOpenEmergencyHelp}
                className="w-full py-1.5 bg-[#111113] text-[#F2EFEB] rounded-full text-xs font-bold hover:bg-white hover:text-[#111113] transition-colors cursor-pointer"
              >
                أرقام الطوارئ والدعم العاجل
              </button>
            </div>
            <p className="text-[10px] text-[#111113]/60 dark:text-[#F2EFEB]/60 pt-1 leading-relaxed">
              * تنويه: التطبيق للتوعية والدعم الذاتي وليس بديلاً عن التشخيص الطبي المتخصص.
            </p>
          </div>

        </div>

        {/* Variation 6 Signature Coordinate Bar */}
        <div className="pt-6 border-t-[1.5px] border-[#111113] dark:border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-jetbrains">
          <div className="text-[#111113]/80 dark:text-[#F2EFEB]/80">
            حقوق الطبع والنشر 2026 © مبادرة نسمة حياة
          </div>
          <div className="text-[#E36E4D] tracking-widest font-semibold">
            42.3601° N, 71.0589° W
          </div>
        </div>

      </div>
    </footer>
  );
};
