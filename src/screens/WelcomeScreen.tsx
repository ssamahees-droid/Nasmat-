import React, { useState } from 'react';
import { Leaf, Info, ShieldCheck, HeartHandshake, ArrowLeft, X } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenAbout?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#e4e4e4] flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Background Graphic Accent */}
      <div className="max-w-md mx-auto w-full my-auto flex flex-col items-center text-center py-8">
        
        {/* Visual Hero Banner */}
        <div className="w-full relative mb-6 border-2 border-[#c4fb6d] bg-[#141416] overflow-hidden aspect-16/9">
          <img
            src="/src/assets/images/nesmat_hero_nature_1791037451436.jpg"
            alt="طبيعة هادئة وسكينة في نسمة حياة"
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent flex items-end justify-center p-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/80 border border-[#c4fb6d] text-[11px] font-geist text-[#c4fb6d]">
              <span>[01] SYSTEM READY // مساحة عربية آمنة</span>
            </div>
          </div>
        </div>

        {/* Title & Taglines */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden border border-emerald-500/40 bg-white/5 p-1 shadow-md">
            <img src="/logo.jpg" alt="شعار مبادرة نسمة حياة" className="w-full h-full object-cover rounded-xl" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-syne text-white tracking-tight uppercase">
            نسمة حياة
          </h1>

          <p className="text-sm font-geist text-[#c4fb6d]">
            // مساحة آمنة تفهمك وتساندك
          </p>

          {/* Core Quote */}
          <div className="p-3.5 bg-[#141416] border border-white/10 max-w-sm mx-auto">
            <p className="text-xs italic text-[#e4e4e4]/80 leading-relaxed font-sans">
              «كثيرون يعيشون الحياة... ولكن قليلون يستمتعون بها»
            </p>
          </div>
        </div>

        {/* Trust Points */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 w-full max-w-sm text-right">
          <div className="p-3 bg-[#141416] border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c4fb6d] shrink-0" />
            <span className="text-xs text-[#e4e4e4]/80 font-medium">خصوصية وسرية تامة</span>
          </div>
          <div className="p-3 bg-[#141416] border border-white/10 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#c4fb6d] shrink-0" />
            <span className="text-xs text-[#e4e4e4]/80 font-medium">غير تشخيصي ومساند</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 w-full max-w-sm space-y-2.5">
          <button
            onClick={onStart}
            className="btn-tech-fill w-full py-3.5 text-sm"
          >
            <span>ابدأ رحلتك</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="btn-tech w-full py-2.5 text-xs"
          >
            <Info className="w-3.5 h-3.5" />
            <span>عن نسمة حياة</span>
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="max-w-md mx-auto w-full text-center pt-3 text-[10px] font-geist text-[#e4e4e4]/50 border-t border-white/10">
        تطبيق نسمة حياة للتوعية بالصحة النفسية والاستكشاف الذاتي، وليس بديلاً عن التشخيص الطبي.
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#355C4A]" />
                <h3 className="font-bold text-lg text-[#26332D]">عن نسمة حياة</h3>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#35453E] leading-relaxed">
              <p>
                <strong>«نسمة حياة»</strong> تطبيق عربي للتوعية بالصحة النفسية، ومساعدة المستخدم على فهم نفسه ومشاعره، والتعرف على العلامات التي تستحق الانتباه، واستخدام أدوات بسيطة للاسترخاء والتأمل ومتابعة رحلته الشخصية.
              </p>
              
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1.5 text-xs text-amber-950">
                <div className="font-bold">المبدأ الأساسي:</div>
                <p>
                  التطبيق ليس بديلاً عن الطبيب أو المعالج النفسي، ولا يقوم بالتشخيص الطبي أو وصف الأدوية. هدفنا الأساسي: <strong>التوعية + الاستكشاف + الدعم + التوجيه إلى الخطوة المناسبة</strong>.
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#52645B]">
                <div className="font-bold text-[#26332D] text-sm">أهدافنا معكم:</div>
                <ul className="list-disc list-inside space-y-1 pr-1">
                  <li>الوصول إلى محتوى نفسي توعوي موثوق ومراجع.</li>
                  <li>تمارين تنفس واسترخاء خفيفة لتخفيف التوتر.</li>
                  <li>تسجيل الملاحظات ومتابعة الحالة اليومية دون أحكام أو لوم.</li>
                  <li>تسهيل طلب الدعم والتوجيه عند توفر الخدمة.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DDCC]">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl hover:bg-[#264235] transition-colors"
              >
                فهمت، شكراً لكم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
