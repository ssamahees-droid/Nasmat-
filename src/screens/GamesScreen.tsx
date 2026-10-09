import React from 'react';
import { 
  Gamepad2, 
  Brain, 
  Sparkles, 
  Volume2, 
  Smile, 
  Puzzle, 
  ArrowLeft, 
  BookOpen, 
  Wind,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface GamesScreenProps {
  onNavigate: (tab: string) => void;
  onOpenGwayaHekaya: () => void;
  onOpenFeker: () => void;
  onOpenFactGame: () => void;
  onOpenUntangleKnot: () => void;
  onOpenSoundscapeStudio: () => void;
  onOpenThoughtRelease: () => void;
  onOpenFunAndGames: (tab?: 'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory') => void;
  onOpenNesmaLaughs: () => void;
}

export const GamesScreen: React.FC<GamesScreenProps> = ({
  onNavigate,
  onOpenGwayaHekaya,
  onOpenFeker,
  onOpenFactGame,
  onOpenUntangleKnot,
  onOpenSoundscapeStudio,
  onOpenThoughtRelease,
  onOpenFunAndGames,
  onOpenNesmaLaughs
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
        <span className="text-emerald-300 font-bold">خذ استراحة — الألعاب والأنشطة النفسية التفاعلية</span>
      </nav>

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#18231D] via-[#141C17] to-[#0E1511] border border-emerald-500/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>القسم الثالث // استراحة واعية وترويح نفسي</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-tajawal">
            اللعب والمرح... علاج نفسي يخفف أثقال اليوم 🎈
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            الاستراحة ليست إضاعة للوقت، بل ضرورة بيولوجية لراحة جهازك العصبي. هنا تجد ألعاباً تفاعلية حقيقية صُممت بمبادئ علم النفس الإدراكي والسلوكي، لمساعدتك على فك التفكير المفرط، التمييز بين الحقائق والأوهام، والضحك اللطيف مع نفسك.
          </p>
        </div>
      </section>

      {/* Flagship Game 1: جوايا حكاية */}
      <section className="bg-gradient-to-r from-[#213227] via-[#1B2820] to-[#141C18] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ⭐ اللعبة النفسية الكبرى
              </span>
              <span className="text-xs text-stone-400">٤ فصول واقعية · ٦ محطات ذاتية</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              لعبة «جوايا حكاية» — العالم الذي يشرح نفسه بنفسه 🪄
            </h2>

            <div className="text-xs sm:text-sm text-stone-300 space-y-1.5 leading-relaxed">
              <p>
                <strong>الهدف:</strong> رحلة تفاعلية تأخذك عبر 4 محطات لاكتشاف السرديات الداخلية التي تبنيها دون وعي عن نفسك وقيمتك.
              </p>
              <p>
                <strong>كيف تلعب:</strong> تختار سيناريوهات حية، وتحدد رد فعلك العاطفي، وتفكك الرابط بين الحدث الخارجي والتفسير القديم، وتحصل في النهاية على بطاقة إنجاز خاصة.
              </p>
              <p>
                <strong>ماذا تتعلم منها:</strong> أن الحكاية التي يرويها عقلك ليست بالضرورة الحقيقة المطلقة.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGwayaHekaya}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-2xl transition-all shadow-lg active:scale-95 shrink-0 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>ابدأ لعبة «جوايا حكاية» الآن</span>
          </button>
        </div>
      </section>

      {/* Flagship Game 2: تطبيق فكّر المدمج */}
      <section className="bg-gradient-to-r from-[#1F271B] via-[#1A2217] to-[#141C18] border-2 border-lime-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-0.5 rounded-full bg-lime-500/20 text-lime-300 font-bold border border-lime-500/30">
                💡 استوديو تفكيك الأفكار (CBT)
              </span>
              <span className="text-xs text-stone-400">تطبيق مدمج متكامل</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              تطبيق «فكّر» — استوديو تفكيك الأفكار والمرونة الذهنية 🧠
            </h2>

            <div className="text-xs sm:text-sm text-stone-300 space-y-1.5 leading-relaxed">
              <p>
                <strong>الهدف:</strong> تطبيق عملي متكامل قائم على العلاج المعرفي السلوكي لاصطياد التشوهات الفكرية (التعميم، التهويل، القراءة الخاطئة للغيب).
              </p>
              <p>
                <strong>كيف تلعب:</strong> تكتب فكرتك التلقائية، يكشف التطبيق نوع التشوه الفكري، ويساعدك خطوة بخطوة على صياغة فكرة بديلة متزنة وحفظها في بطاقات السلام الذهني.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> ترويض الأفكار السامة وتحويل التفكير الكارثي إلى نظرة واقعية رحيمة.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenFeker}
            className="px-6 py-3.5 bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm rounded-2xl transition-all shadow-lg active:scale-95 shrink-0 flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            <span>فتح تطبيق فكّر 💡</span>
          </button>
        </div>
      </section>

      {/* Games & Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Game 3: الحقيقة ولا الحكاية؟ */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="text-3xl p-2 rounded-2xl bg-purple-500/15 text-purple-300 inline-block">🎮</div>
            
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              الحقيقة ولا الحكاية؟ (Fact or Story)
            </h3>

            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p><strong>الهدف:</strong> لعبة ذكاء سريع لتدريب الدماغ على التفريق بين "الحدث الذي حدث بالفعل" و"القصة التفسيرية التي اخترعها عقلك".</p>
              <p><strong>الفئة:</strong> من يميل لتفسير تصرفات الناس بصورة سلبية أو تضخيم المواقف العابرة.</p>
              <p><strong>الخطوات:</strong> تعرض عليك مواقف حياتية، وعليك تمييز الحقيقة الملموسة من القصة الافتراضية.</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={onOpenFactGame}
              className="w-full py-2.5 bg-purple-500 hover:bg-purple-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>بدء اللعبة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 4: فك العقدة */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="text-3xl p-2 rounded-2xl bg-emerald-500/15 text-emerald-300 inline-block">🧩</div>
            
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              تمرين «فك العقدة» (Untangle Knot)
            </h3>

            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p><strong>الهدف:</strong> عندما تتراكم المشاكل وتشعر أن كل شيء مسدود، يساعدك هذا التمرين على تفكيك المشكلة الكبيرة إلى خيوط صغيرة يمكن حلها.</p>
              <p><strong>الفئة:</strong> من يشعر بالعجز والشلل عن اتخاذ القرار بسبب ضخامة المهام.</p>
              <p><strong>الخطوات:</strong> تحديد العقدة المركزية، فصل ما بيدك عما ليس بيدك، ثم اختيار أصغر خطوة يمكن البدء بها اليوم.</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={onOpenUntangleKnot}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>بدء فك العقدة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 5: استوديو مزج أصوات الطبيعة */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="text-3xl p-2 rounded-2xl bg-sky-500/15 text-sky-300 inline-block">🌊</div>
            
            <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
              استوديو أصوات الطبيعة المهدئة
            </h3>

            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p><strong>الهدف:</strong> خلاط صوتي تفاعلي يتيح لك مزج أصوات أمواج البحر، قطرات المطر، حفيف الرياح، وموسيقى التأمل لتخفيض الإجهاد.</p>
              <p><strong>الفئة:</strong> للتركيز أثناء العمل أو الدراسة، أو للاسترخاء والتهدئة قبل النوم.</p>
              <p><strong>الخطوات:</strong> اختر الأصوات التي تحبها، واضبط درجة الصوت لكل منها لتصنع ملاذك الصوتي الخاص.</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={onOpenSoundscapeStudio}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>فتح الاستوديو الصوتي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 6: تفريغ وتحرير الأفكار */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="text-3xl p-2 rounded-2xl bg-amber-500/15 text-amber-300 inline-block">🍃</div>
            
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              تفريغ وتحرير الأفكار (Thought Release)
            </h3>

            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p><strong>الهدف:</strong> ممارسة رمزية لتفريغ التفكير الاجتراري والتسليم بأن الأفكار ليست حقائق يجب التمسك بها.</p>
              <p><strong>الفئة:</strong> من يعاني من تكرار فكرة مزعجة في رأسه لا تتركه لحاله.</p>
              <p><strong>الخطوات:</strong> اكتب الفكرة المؤرقة، ثم شاهدها وهي تطفو كغيمة في السماء أو ورقة شجر في النهر تتلاشى بهدوء.</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={onOpenThoughtRelease}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>بدء تفريغ الأفكار</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 7: واحة البهجة والضحك (نسمة تضحك) */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="text-3xl p-2 rounded-2xl bg-rose-500/15 text-rose-300 inline-block">😂</div>
            
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
              واحة البهجة والضحك «نسمة تضحك»
            </h3>

            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p><strong>الهدف:</strong> مساحة لطيفة للترويح والابتسامة، تضم مسرح النكت الذكية، فرقعة فقاعات القلق، فوازير ذكية، وعجلة التحديات.</p>
              <p><strong>الفئة:</strong> من قضى يوماً ثقيلاً ويحتاج إلى ابتسامة تنزل هرمونات الكورتيزول وتنعش روحه.</p>
              <p><strong>ماذا تتعلم:</strong> الضحك الخفيف تمرين نفسي يعيد المرونة لجهازك العصبي دون تكلف.</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={() => onOpenFunAndGames('jokes')}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>دخول واحة البهجة والضحك</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game 8: نسمة تضحك - مواقف طريفة */}
        <div className="p-6 bg-[#141C18] border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all shadow-md flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="text-3xl p-2 rounded-2xl bg-teal-500/15 text-teal-300 inline-block">✨</div>
            
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
              مواقف نفسية طريفة (ألاعيب العقل)
            </h3>

            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p><strong>الهدف:</strong> مواقف ويوميات ساخرة تسلط الضوء على الحيل الغريبة التي يفعلها الدماغ عندما يقلق بدون سبب.</p>
              <p><strong>الفئة:</strong> من يأخذ نفسه بجدية مفرطة ويحتاج أن يتعلم كيف يبتسم لأفكاره القلقة.</p>
              <p><strong>ماذا تتعلم:</strong> عندما نرى مواقفنا السخيفة من الخارج ونضحك عليها، تنكسر شوكة القلق تماماً.</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              onClick={onOpenNesmaLaughs}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>مشاهدة المواقف الطريفة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
