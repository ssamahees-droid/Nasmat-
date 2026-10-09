import React from 'react';
import { 
  Wind, 
  Sparkles, 
  BookOpen, 
  Check, 
  Scale, 
  Shield, 
  FileText, 
  ArrowLeft, 
  Calendar,
  Activity,
  HeartHandshake
} from 'lucide-react';

interface PracticeScreenProps {
  onNavigate: (tab: string) => void;
  onOpenBreathe: () => void;
  onOpenMindfulnessStudio: () => void;
  onOpenThoughtJournal: () => void;
  onOpenPersonalPlan: () => void;
  onOpenEnergyBudget: () => void;
  onOpenBoundaryBuilder: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  onNavigate,
  onOpenBreathe,
  onOpenMindfulnessStudio,
  onOpenThoughtJournal,
  onOpenPersonalPlan,
  onOpenEnergyBudget,
  onOpenBoundaryBuilder
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
        <span className="text-emerald-300 font-bold">مارس المهارات — التمارين والتطبيقات العملية</span>
      </nav>

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#18231D] via-[#141C17] to-[#0E1511] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>القسم الخامس // تحويل المعرفة إلى تدريب وممارسة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal">
            مارس المهارات... خطوة صغيرة تصنع فرقاً حقيقياً 🌿
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            المعرفة النفسية وحدها لا تكفي ما لم تتحول إلى عادات وتدريبات يلمسها جسدك وعقلك. هنا جمعنا لك التمارين العملية، وجلسات تنظيم التنفس، واستوديو اليقظة الحركية، وأدوات بناء خطتك الشخصية للسلامة والحدود.
          </p>
        </div>
      </section>

      {/* Primary Practice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Practice 1: تمارين التنفس وتنظيم الجهاز العصبي */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-emerald-500/15 text-emerald-300">💨</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">تهدئة فورية</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              تمارين التنفس وتنظيم الجهاز العصبي
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الغرض:</strong> تفعيل العصب الحائر (Vagus Nerve) وخفض معدل ضربات القلب والأدرينالين خلال دقائق معدودة.
              </p>
              <p>
                <strong>الأنماط المتاحة:</strong> تنفس الصندوق (4-4-4-4) للتركيز والثبات، تقنية 4-7-8 لتهدئة الهلع والنوم، والتنفس الهادئ المتزن مع مؤقت بصري حي.
              </p>
              <p>
                <strong>الوقت التقريبي:</strong> 3 إلى 5 دقائق في أي وقت من اليوم.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">مؤقت تفاعلي نابض</span>
            <button
              onClick={onOpenBreathe}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>بدء جلسة التنفس</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Practice 2: استوديو اليقظة الذهنية والتجذير الحركي */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-amber-500/15 text-amber-300">🧘</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">حضور وتجذر</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              استوديو اليقظة الذهنية والتجذير الحركي
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الغرض:</strong> كسر نوبات الدوران العقلي واستعادة الاتصال الآمن بالجسد والبيئة المحيطة.
              </p>
              <p>
                <strong>التمارين:</strong> تمرين الحواس الخمس 5-4-3-2-1، تمرين نهر الأفكار (تأمل الأوراق الطافية)، وتمرين مسح الجسد الواعي (Body Scan).
              </p>
              <p>
                <strong>ماذا تتعلم:</strong> التواجد في المكان والزمان الحاضر دون خوف من الغد.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">تمارين موجهة بالخطوات</span>
            <button
              onClick={onOpenMindfulnessStudio}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>فتح استوديو اليقظة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Practice 3: مدونة الأفكار والخواطر الواعية */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-sky-500/15 text-sky-300">✍️</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold">تدوين آمن</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              مدونة الأفكار والخواطر الواعية
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الغرض:</strong> تفريغ ذهني حر للأفكار المشوشة وتوثيق المشاعر اليومية مع خيارات إعادة الصياغة الإيجابية.
              </p>
              <p>
                <strong>الميزات:</strong> أسئلة تأملية استرشادية، حفظ آمن محلي وسحابي في حسابك، وحماية كاملة للخصوصية.
              </p>
              <p>
                <strong>كيف يفيدك:</strong> نقل الفكرة من رأسك إلى الشاشة يقلل ثقلها بنسبة النصف فوراً.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">تدوين وملاحظات خاصة</span>
            <button
              onClick={onOpenThoughtJournal}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>فتح مدونة الأفكار</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Practice 4: خطة نسمة حياة الشخصية */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-emerald-500/15 text-emerald-300">📑</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">خطة مكتوبة</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              خطة نسمة حياة الخاصة بي (صفحات 13 و 14)
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الغرض:</strong> بناء ميثاق أمان شخصي مكتوب للرجوع إليه عند اشتداد الأزمات.
              </p>
              <p>
                <strong>البنود:</strong> ما يستنزفني عادة، علامات التدهور المبكرة قبل الانهيار، قائمة ما يساعدني، وأشخاص يمكنني التواصل معهم.
              </p>
              <p>
                <strong>الحفظ:</strong> تحفظ محلياً في جهازك ومزامنة سحابية لحسابك لاسترجاعها في أي لحظة.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">نموذج تفاعلي قابل للتعديل</span>
            <button
              onClick={onOpenPersonalPlan}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>تعديل وتعبئة خطتي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Practice 5: ميزانية الطاقة النفسية */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-teal-500/15 text-teal-300">⚖️</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold">توازن الطاقة</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
              ميزانية الطاقة: أنت لست آلة
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الغرض:</strong> تحديد 5 مستنزفات كبرى لطاقتك، و3 معوضات تشحن روحك، وما يمكنك تقليله أو تفويضه هذا الأسبوع.
              </p>
              <p>
                <strong>الرسالة:</strong> كما تدير أموالك حتى لا تفلس، تحتاج إلى إدارة طاقتك حتى لا تصاب بالاحتراق التام.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">مصفوفة الاستنزاف والتعويض</span>
            <button
              onClick={onOpenEnergyBudget}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>فتح ميزانية الطاقة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Practice 6: بناء الحدود وحماية المساحة */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-rose-500/15 text-rose-300">🛡️</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold">حماية النفس</span>
            </div>

            <h2 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              الحدود ليست قسوة: مهارة الرفض اللبق
            </h2>

            <div className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <p>
                <strong>الغرض:</strong> تعلم كيفية قول "لا" دون شعور مدمر بالذنب، وحماية وقتك وصحتك النفسية من التعدي.
              </p>
              <p>
                <strong>الأدوات:</strong> صيغ عملية جاهزة للرد مثل صيغة «محتاج أفكر وأرد عليك» لحماية مساحتك في العمل والعلاقات.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-stone-400">أمثلة ونماذج تدريبية</span>
            <button
              onClick={onOpenBoundaryBuilder}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>بناء الحدود الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Banner for Journey Screen Tracking */}
      <section className="bg-gradient-to-r from-[#1E2C22] via-[#162019] to-[#141C18] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <Calendar className="w-4 h-4" />
            <span>متابعة التقدم اليومي الشخصي</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            سجل رحلتي وتتبع عادات العافية اليومية
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            اطلع على أيام التزامك، وسجل فحوصاتك المزاجية، وملاحظاتك الشخصية المحفوظة في مساحتك الآمنة.
          </p>
        </div>

        <button
          onClick={() => onNavigate('journey')}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2"
        >
          <span>الانتقال إلى «رحلتي»</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
