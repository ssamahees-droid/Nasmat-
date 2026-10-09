import React from 'react';
import { 
  Compass, 
  BatteryCharging, 
  ClipboardCheck, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft, 
  ShieldAlert, 
  ChevronLeft, 
  MessageSquare,
  Activity,
  Heart
} from 'lucide-react';

interface SelfDiscoveryScreenProps {
  onNavigate: (tab: string) => void;
  onOpenAssessment: () => void;
  onOpenDiscoveryQuiz: () => void;
  onOpenAnaDelwaqti: () => void;
  onOpenEmotionCompass: () => void;
  onOpenBatteryCheck: () => void;
  onOpenTranslateFeelings: () => void;
}

export const SelfDiscoveryScreen: React.FC<SelfDiscoveryScreenProps> = ({
  onNavigate,
  onOpenAssessment,
  onOpenDiscoveryQuiz,
  onOpenAnaDelwaqti,
  onOpenEmotionCompass,
  onOpenBatteryCheck,
  onOpenTranslateFeelings
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
        <span className="text-emerald-300 font-bold">افهم نفسك — الوعي النفسي واستكشاف الذات</span>
      </nav>

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#18231D] via-[#141C17] to-[#0E1511] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>القسم الثاني // استكشاف الذات وترتيب المشاعر</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal">
            افهم نفسك... بدون أحكام ولا تعقيد 🌿
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            كثير من معاناتنا اليومية تنبع من عدم وضوح ما يدور في أعماقنا؛ هل هو إرهاق جسدي؟ أم حزن متراكم؟ أم قلق من المجهول؟ هنا جمعنا لك أدوات عملية واستبيانات موجهة تساعدك على تسمية مشاعرك وتحديد حالتك بدقة وهدوء.
          </p>

          {/* Medical Notice */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>تنبيه توعوي:</strong> هذه الأدوات استكشافية وتوعوية لمساعدتك على قراءة ذاتك، وليست تقييماً طبياً أو تشخيصاً سريرياً بديلاً عن مقابلة الطبيب المختص.
            </span>
          </div>
        </div>
      </section>

      {/* Primary Discovery Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tool 1: التقييم الذاتي الأولي ومقياس PHQ-9 */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-emerald-500/15 text-emerald-300">📝</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">معتمد عالمياً</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              التقييم الذاتي الأولي ومقياس PHQ-9
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> قياس مؤشرات المزاج، ومستوى الضغوط النفسية وأعراض الحزن الشائعة عبر مقياس PHQ-9 العالمي المعتمد في الرعاية الأولية.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> من يشعر بثقل مستمر، فقدان للشغف، أو صعوبة في الاستمتاع بالأنشطة اليومية منذ أكثر من أسبوعين.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> يعطيك قراءة رقمية واضحة ومستوى إرشادي لشدة الأعراض (طفيفة، متوسطة، شديدة) مع توجيه واقعي للخطوة القادمة.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">٩ أسئلة قياسية · استجابة فورية</span>
            <button
              onClick={onOpenAssessment}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>بدء التقييم الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tool 2: اختبار الاستكشاف الذاتي السريع */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-amber-500/15 text-amber-300">🧭</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">سريع وتفاعلي</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              اختبار الاستكشاف الذاتي: ما حالتك الحالية؟
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> مسح سريع وشامل لمستوى طاقتك، حدة تفكيرك، ومدى سلامة حدودك العاطفية في دقائق معدودة.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> من يحتاج إلى نظرة عامة سريعة دون الدخول في تفاصيل الفحص السريري المسهب.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> يمنحك بطاقة تشخيصية للحالة الحالية مع توصيات مخصصة بالأنشطة والتمارين الأكثر ملاءمة لك اليوم.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">٥ أسئلة مركّزة · بطاقة نتيجة فورية</span>
            <button
              onClick={onOpenDiscoveryQuiz}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>بدء الاختبار</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tool 3: بوصلة المشاعر */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-sky-500/15 text-sky-300">🧭</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold">تسمية المشاعر</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              بوصلة المشاعر 🧭
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> تفكيك المشاعر العامة المبهمة (مثل "أنا متضايق") إلى أسماء دقيقة (خيبة أمل، خوف، غيرة، وحدة، خذلان).
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> من يشعر بانزعاج داخلي ولا يستطيع التعبير عما يحدث بداخله بالكلمات.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> في علم النفس، مجرد "تسمية المشاعر" (Name It to Tame It) يقلل نشاط مركز الخوف بالدماغ (اللوزة الدماغية) بنسبة 40%.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">بوصلة بصرية ملونة</span>
            <button
              onClick={onOpenEmotionCompass}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>فتح البوصلة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tool 4: بطاريتي كام من 10؟ */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-emerald-500/15 text-emerald-300">🔋</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">قياس الطاقة</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              بطاريتي كام؟ (فحص شحن الطاقة)
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> قياس مخزون الطاقة النفسية والجسدية المتبقية لديك اليوم من 1 إلى 10، لمنع استنزاف البطارية حتى الصفر.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> العاملون تحت ضغط، والطلاب، وكل من يطالب نفسه بإنجازات تفوق طاقته الحالية.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> إدراك أن طاقتك ليست ثابتة، وأن الاعتراف بانخفاض الشحن هو الخطوة الأولى لتحديد أولوياتك بحكمة.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">مقياس شحن ديناميكي</span>
            <button
              onClick={onOpenBatteryCheck}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>فحص شحن البطارية</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tool 5: مسار اللحظة الحالية «أنا دلوقتي...» */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-purple-500/15 text-purple-300">🌿</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">اللحظة الحالية</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              مسار اللحظة الحالية: «أنا دلوقتي...»
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> التوقف عن القفز بين مشاكل الماضي ومخاوف المستقبل، والتركيز على ما يدور داخل جسدك وعقلك الآن.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> عند الشعور بالتشتت الشديد، ازدحام الأفكار، أو الهلع المفاجئ.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> "مش لازم تحل كل حاجة دلوقتي.. خلينا نبدأ من اللي حاصل معاك الآن."
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">خطوات تهدئة موجهة</span>
            <button
              onClick={onOpenAnaDelwaqti}
              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>ابدأ المسار اللحظي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tool 6: ترجم اللي جواك */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-rose-500/15 text-rose-300">🗣️</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold">تفكيك الكلمات</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              ترجم اللي جواك (ما وراء الجمل الشائعة)
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الهدف:</strong> كشف الرسائل النفسية والاحتياجات الحقيقية المخفية وراء كلمات مثل "أنا عادي"، "كل حاجة بايظة"، أو "مش فارقة".
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> من يجد صعوبة في التعبير الصريح عن مشاعره لنفسه أو للآخرين.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> تكتشف أن الجمل التي نكررها تلقائياً تخفي أحياناً حاجة ماسة للأمان، التقدير، أو الراحة.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">قاموس المعاني الشعورية</span>
            <button
              onClick={onOpenTranslateFeelings}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>اكتشف الترجمة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
