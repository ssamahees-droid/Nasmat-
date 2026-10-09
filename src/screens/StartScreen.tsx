import React from 'react';
import { 
  Compass, 
  Heart, 
  Sparkles, 
  BookOpen, 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  HelpCircle, 
  Flame, 
  Smile, 
  MessageCircle, 
  Wind,
  CheckCircle2
} from 'lucide-react';

interface StartScreenProps {
  onNavigate: (tab: string) => void;
  onOpenBooklet: () => void;
  onOpenEmergencyHelp: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onNavigate,
  onOpenBooklet,
  onOpenEmergencyHelp
}) => {
  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-fade-in text-right">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-stone-400">
        <button 
          onClick={() => onNavigate('home')} 
          className="hover:text-emerald-400 transition-colors"
        >
          الرئيسية
        </button>
        <span>/</span>
        <span className="text-emerald-300 font-bold">ابدأ من هنا — التعرف على نسمة حياة</span>
      </nav>

      {/* Hero Welcome Card */}
      <section className="bg-gradient-to-br from-[#18231D] via-[#141C17] to-[#0E1511] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>دليلك الترحيبي الأول // مساحة آمنة تفهمك</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal">
            أهلاً بك في مبادرة «نسمة حياة» 🌿
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            «نسمة حياة» هي منصة عربية إنسانية مخصصة للاهتمام بالصحة النفسية ونشر الوعي السليم، وتقديم مساحة هادئة لكل من يعاني من ضغط نفسي، أو حزن عميق، أو تشتت داخلي. لسنا هنا لنحكم عليك، بل لنمسك بيدك ونقدم لك مهارات وخطوات بسيطة تدعم يومك.
          </p>

          {/* Ethics Note */}
          <div className="p-3.5 bg-black/40 border border-white/10 rounded-2xl flex items-start gap-3 text-xs text-stone-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">تأكيد طبي وأخلاقي أساسي:</strong>
              محتوى وأدوات نسمة حياة صُممت للتوعية والاستكشاف والمساندة الذاتية المبكرة، وليست بديلاً عن التشخيص الطبي أو مراجعة الطبيب النفسي المعتمد في الحالات السريرية.
            </div>
          </div>
        </div>
      </section>

      {/* Guide: How to Start based on your current state */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>كيف تبدأ الآن؟ (اختر ما تشعر به في هذه اللحظة)</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            لا داعي للحيرة أو محاولة قراءة كل شيء دفعة واحدة؛ حدد شعورك الآن لنرشدك إلى القسم الأنسب:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Pathway 1 */}
          <div 
            onClick={() => onNavigate('practice')}
            className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-2xl mb-2">💨</div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                أشعر بضغط أو تسارع في ضربات قلبي
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                انتقل مباشرة إلى تمارين التنفس 4-7-8 وتنظيم الجهاز العصبي حركياً لتهدئة جسدك خلال 3 دقائق.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>تمارين التنفس والمهارات</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 2 */}
          <div 
            onClick={() => onNavigate('self-discovery')}
            className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-2xl mb-2">🧭</div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                مش عارف مالي.. محتاج أفهم نفسي
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                ابدأ ببوصلة المشاعر، واختبار الاستكشاف الذاتي، أو الفحص الذاتي الأولي لترتيب فوضى أفكارك.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>قسم افهم نفسك</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 3 */}
          <div 
            onClick={() => onNavigate('games')}
            className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                تعبان وعايز أروّق وأفصل دماغي
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                خذ استراحة مع تطبيق «فكّر»، لعبة «جوايا حكاية»، أو واحة الضحك وفقاعات التهدئة والموسيقى الطبيعية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>قسم خذ استراحة والألعاب</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 4 */}
          <div 
            onClick={() => onNavigate('explore')}
            className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                عاوز أقرأ وأتعلم بهدوء وعمق
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                تصفح مقالات التثقيف النفسي، وجلسات الاستماع الصوتية، وكتيب نسمة حياة المكوّن من 12 فصلاً مبسطاً.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>قسم تعلّم وطبّق</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 5 */}
          <div 
            onClick={() => onNavigate('rescue')}
            className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-2xl mb-2">🎒</div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                أمر بأزمة حزن، غضب، أو إرهاق شديد
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                افتح شنطة الإسعاف النفسي واطلع على الخطط العملية المجهزة لحالات الهلع والفقد والخلافات.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>خطط المساندة النفسية</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pathway 6 */}
          <div 
            onClick={() => onNavigate('support')}
            className="cursor-pointer p-5 bg-[#141C18] hover:bg-[#1A2520] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                محتاج حد يسمعني في سرية تامة
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                أرسل طلب دعم خاص لفريق المساندة، أو اطلع على أرقام الخطوط الساخنة المعتمدة للمساعدة الفورية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>طلب الدعم والتواصل</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Overview of The 7 Ecosystem Sections */}
      <section className="space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            خريطة أقسام «نسمة حياة» الكاملة
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            صُمم الموقع في تسلسل منطقي يبدأ من التعرف على نفسك ويمر بالمهارات والأنشطة حتى خطط المساندة:
          </p>
        </div>

        <div className="space-y-3">
          {/* Section 1 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">01</span>
                <h3 className="font-bold text-white text-sm sm:text-base">ابدأ من هنا — التعرف على نسمة حياة</h3>
              </div>
              <p className="text-xs text-stone-400">دليلك التعريفي الأول لفهم المنصة، وكيفية استخدام الأدوات، وتوجيه نفسك بدون تشخيص طبي.</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold shrink-0">أنت هنا الآن ✓</span>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">02</span>
                <h3 className="font-bold text-white text-sm sm:text-base">افهم نفسك — الوعي النفسي واستكشاف الذات</h3>
              </div>
              <p className="text-xs text-stone-400">الفحص الذاتي الأولي، مقياس PHQ-9 المعتمد، بوصلة المشاعر، فحص طاقة البطارية، وترجم اللي جواك.</p>
            </div>
            <button 
              onClick={() => onNavigate('self-discovery')}
              className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              استكشف القسم ←
            </button>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">03</span>
                <h3 className="font-bold text-white text-sm sm:text-base">خذ استراحة — الألعاب والأنشطة النفسية التفاعلية</h3>
              </div>
              <p className="text-xs text-stone-400">لعبة جوايا حكاية، تطبيق فكّر، لعبة الحقيقة والحدوتة، فك العقدة، أصوات الطبيعة، وواحة الضحك والبهجة.</p>
            </div>
            <button 
              onClick={() => onNavigate('games')}
              className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              استكشف القسم ←
            </button>
          </div>

          {/* Section 4 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">04</span>
                <h3 className="font-bold text-white text-sm sm:text-base">تعلّم وطبّق — المقالات والتثقيف النفسي</h3>
              </div>
              <p className="text-xs text-stone-400">مكتبة المقالات الكاملة المصنفة، مشغل الجلسات الصوتية، كتيب نسمة حياة، واستوديو الورش التطبيقية.</p>
            </div>
            <button 
              onClick={() => onNavigate('explore')}
              className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              استكشف القسم ←
            </button>
          </div>

          {/* Section 5 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">05</span>
                <h3 className="font-bold text-white text-sm sm:text-base">مارس المهارات — التمارين والتطبيقات العملية</h3>
              </div>
              <p className="text-xs text-stone-400">تمارين التنفس الصندوقي، استوديو اليقظة 5-4-3-2-1، مدونة الأفكار، خطة السلامة، وبناء الحدود وميزانية الطاقة.</p>
            </div>
            <button 
              onClick={() => onNavigate('practice')}
              className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              استكشف القسم ←
            </button>
          </div>

          {/* Section 6 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">06</span>
                <h3 className="font-bold text-white text-sm sm:text-base">عندما تحتاج إلى مساعدة — خطط المساندة النفسية</h3>
              </div>
              <p className="text-xs text-stone-400">شنطة الإسعاف النفسي (خطط الحزن، الهلع، الغضب، الاحتراق)، محاكاة غرفة الطوارئ، ودليل استشارة الطبيب.</p>
            </div>
            <button 
              onClick={() => onNavigate('rescue')}
              className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              استكشف القسم ←
            </button>
          </div>

          {/* Section 7 */}
          <div className="p-4 bg-[#141C18] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">07</span>
                <h3 className="font-bold text-white text-sm sm:text-base">اطلب الدعم — التواصل والمتابعة</h3>
              </div>
              <p className="text-xs text-stone-400">نموذج طلب الدعم النفسي السري المباشر، متابعة التذاكر السابقة، والخطوط الساخنة للطوارئ النفسية.</p>
            </div>
            <button 
              onClick={() => onNavigate('support')}
              className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              استكشف القسم ←
            </button>
          </div>
        </div>
      </section>

      {/* Featured Booklet Card */}
      <section className="bg-gradient-to-r from-[#213027] via-[#1A251F] to-[#141C18] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>إصدار مبادرة نسمة حياة الرسمي</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            كتيب «نسمة حياة» (12 فصلاً تفاعلياً مبسطاً)
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            «كثيرون يعيشون الحياة... وقليلون يستمتعون بها». مرجع مبسط يشرح المشاعر، وضغوط اليوم، وكيف تضع حدوداً صحية ومتى تطلب المساعدة.
          </p>
        </div>

        <button
          onClick={onOpenBooklet}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>تصفح الكتيب كاملاً 📖</span>
        </button>
      </section>

    </div>
  );
};
