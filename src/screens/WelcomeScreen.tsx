import React, { useState } from 'react';
import { Leaf, Info, ShieldCheck, HeartHandshake, ArrowLeft, X, Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip?: () => void;
  onOpenAbout?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSkip }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C120F] via-[#121A16] to-[#0A0E0C] text-[#EDE8DF] flex flex-col justify-between p-4 sm:p-8 font-tajawal antialiased text-right selection:bg-emerald-500 selection:text-black">
      
      {/* Top subtle branding bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-2 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-stone-300">مبادرة نسمة حياة</span>
        </div>
        <div className="flex items-center gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-stone-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              تخطي إلى الرئيسية
            </button>
          )}
          <button
            onClick={() => setShowAboutModal(true)}
            className="text-stone-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>عن المبادرة</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto w-full my-auto flex flex-col items-center text-center py-6 sm:py-10 space-y-6">
        
        {/* Official Logo with Gentle Serene Glow */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl bg-emerald-500/20 blur-xl transition-all group-hover:bg-emerald-500/30" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-[#16211C] p-1.5 shadow-2xl">
            <img 
              src="/logo.jpg" 
              alt="شعار مبادرة نسمة حياة الرسمي" 
              className="w-full h-full object-cover rounded-2xl shadow-inner"
            />
          </div>
        </div>

        {/* Hero Title & Humanity Greeting */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مساحة عربية دافئة وآمنة تفهمك</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            نسمة حياة
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-sm mx-auto font-medium">
            مساحتك الخاصة للاسترخاء، وفهم مشاعرك، وتخفيف أثقال التفكير دون أحكام أو استعجال.
          </p>
        </div>

        {/* Core Reassuring Quote Card */}
        <div className="p-4 bg-[#141E19]/90 border border-emerald-500/20 rounded-2xl max-w-sm mx-auto shadow-lg">
          <p className="text-xs sm:text-sm italic text-emerald-100/90 leading-relaxed">
            «كثيرون يعيشون الحياة... ولكن قليلون يستمتعون بها»
          </p>
          <span className="block text-[11px] text-stone-400 mt-1">
            خذ وقتاً لنفسك، فطلب المساعدة والاعتناء بروحك ليس هزيمة بل بداية تعافٍ.
          </span>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm text-right text-xs">
          <div className="p-3 bg-[#131C18] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-stone-300 font-medium">خصوصية وسرية تامة</span>
          </div>
          <div className="p-3 bg-[#131C18] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-xs">
            <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-stone-300 font-medium">مساندة بلا أحكام</span>
          </div>
        </div>

        {/* Action Button: ابدأ رحلتك */}
        <div className="w-full max-w-sm space-y-3 pt-2">
          <button
            onClick={onStart}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>ابدأ رحلتك</span>
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>تعرف أكثر على المبادرة</span>
          </button>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <footer className="max-w-md mx-auto w-full text-center pt-3 text-[11px] text-stone-500 border-t border-white/10">
        مبادرة «نسمة حياة» للتوعية بالصحة النفسية والاستكشاف الذاتي، وليست بديلاً عن الاستشارة الطبية المتخصصة.
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-right">
          <div className="w-full max-w-lg bg-[#141E19] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white font-tajawal">عن مبادرة نسمة حياة</h3>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                <strong>«نسمة حياة»</strong> مبادرة عربية تسعى لنشر الوعي الصحي النفسي وتقديم مساحة هادئة للاسترخاء والفهم الذاتي بعيداً عن التعقيد والوصمة المجتمعية.
              </p>
              
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl space-y-1 text-xs text-emerald-200">
                <div className="font-bold text-white">المبدأ الأساسي:</div>
                <p>
                  المنصة مساحة توعوية ومساندة ذاتية آمنة، ولا تقدم تشخيصاً طبياً أو بديلاً عن الفحص السريري مع الطبيب النفسي المعتمد.
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-300">
                <div className="font-bold text-white text-sm">ماذا نقدم لك في نسمة حياة؟</div>
                <ul className="list-disc list-inside space-y-1.5 pr-1 text-stone-400">
                  <li>أدوات استكشاف الذات وبوصلة المشاعر وفحص الطاقة.</li>
                  <li>ألعاب تفاعلية لتفكيك التفكير السلبي وممارسة اليقظة الذهنية.</li>
                  <li>تمارين تنفس حركية لتنظيم الجهاز العصبي وتهدئة الهلع.</li>
                  <li>كتيب مبسط للصحة النفسية يضم 12 فصلاً استرشادياً.</li>
                  <li>خطط مساندة وشنطة إسعاف نفسي لأوقات الضيق والاحتراق.</li>
                  <li>إمكانية طلب الدعم والتواصل بسرية تامة.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
