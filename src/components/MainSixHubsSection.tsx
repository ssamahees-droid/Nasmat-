import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Gamepad2, 
  Brain, 
  Wind, 
  HeartHandshake, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Layers, 
  Flame 
} from 'lucide-react';
import { chimeService } from '../services/chimeService';

interface MainSixHubsSectionProps {
  onNavigate: (tab: string) => void;
  onOpenCompanion: () => void;
  onOpenWorkshopsHub: () => void;
  onOpenThoughtJournal: () => void;
  onOpenMindfulnessStudio: () => void;
  onOpenFunAndGames: (tab?: any) => void;
  onOpenMoodKitchen: () => void;
  onOpenEmotionCompass: () => void;
  onOpenRescueKit: () => void;
  onOpenFeker: () => void;
  onOpenPersonalityTests?: () => void;
  onOpenDailyMiracle?: () => void;
  onOpenOrigamiGarden?: () => void;
  onOpenInnerBurdens?: () => void;
  onOpenGratitudeGarden?: () => void;
  onOpenEmotionalBridge?: () => void;
  onOpenEndlessPsychology: (category: string) => void;
  theme?: 'dark' | 'light' | 'system';
}

export interface HubCategory {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  icon: any;
  items: {
    title: string;
    desc: string;
    action: () => void;
    badge?: string;
  }[];
}

export const MainSixHubsSection: React.FC<MainSixHubsSectionProps> = ({
  onNavigate,
  onOpenCompanion,
  onOpenWorkshopsHub,
  onOpenThoughtJournal,
  onOpenMindfulnessStudio,
  onOpenFunAndGames,
  onOpenMoodKitchen,
  onOpenEmotionCompass,
  onOpenRescueKit,
  onOpenFeker,
  onOpenPersonalityTests,
  onOpenDailyMiracle,
  onOpenOrigamiGarden,
  onOpenInnerBurdens,
  onOpenGratitudeGarden,
  onOpenEmotionalBridge,
  onOpenEndlessPsychology,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [activeHubId, setActiveHubId] = useState<string | null>(null);

  const hubs: HubCategory[] = [
    {
      id: 'exploration',
      title: 'رحلة الاستكشاف والبدايات',
      subtitle: 'اكتشف ذاتك وابدأ رحلتك النفسية',
      desc: 'دليل شامل للتعرف على التطبيق وفهم أبعادك النفسية والبدء بثقة.',
      emoji: '🧭',
      bgGradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      icon: Compass,
      items: [
        { title: 'ابدأ من هنا (خطوتك الأولى)', desc: 'نظرة عامة على واحة الأمان وكيفية الاستفادة', action: () => onNavigate('start') },
        { title: 'افهم نفسك واكتشف عمقك', desc: 'استبيانات واكتشافات ذاتية لفهم حالتك النفسية', action: () => onNavigate('self-discovery') },
        { title: 'اختبارات تصنيف الشخصية (MBTI & Big Five)', desc: 'تحليل الأنماط الـ ١٦، العوامل الخمسة، وأنماط التعلّق', action: () => onOpenPersonalityTests ? onOpenPersonalityTests() : onNavigate('self-discovery'), badge: 'جديد 🧠' },
        { title: 'الكتيب التوجيهي الشامل', desc: 'مكتبة المقالات والإرشادات المعتمدة علمياً', action: () => onNavigate('explore') }
      ]
    },
    {
      id: 'workshops',
      title: 'ورش العمل وبرامج النمو',
      subtitle: 'برامج عملية وتفاعلية متقدمة',
      desc: 'ورش ومسارات إرشادية لتفكيك الأفكار السامة والتعامل مع الأزمات.',
      emoji: '📚',
      bgGradient: 'from-amber-600/20 via-yellow-600/10 to-transparent',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      icon: BookOpen,
      items: [
        { title: 'الورش العملية الشاملة', desc: 'ورش للتأمل وإعادة بناء السلام الداخلي', action: () => onOpenWorkshopsHub() },
        { title: 'تطبيق فكّر (تفكيك الأفكار السامة)', desc: 'كشف أفخاخ التفكير والتخلص من الأفكار المقلقة', action: () => onOpenFeker(), badge: 'تفكير 💡' },
        { title: 'رحلة التعافي والنمو', desc: 'مسار متكامل للتعافي النفسي التدريجي', action: () => onNavigate('journey') }
      ]
    },
    {
      id: 'games_relief',
      title: 'ألعاب التهدئة والترويح',
      subtitle: 'مساحة اللعب الهادئ والتفريغ',
      desc: 'ألعاب تفاعلية لفرقعة الأعباء، الأوريغامي الشعوري، وحديقة الامتنان.',
      emoji: '🎈',
      bgGradient: 'from-pink-600/20 via-rose-600/10 to-transparent',
      borderColor: 'border-pink-500/30',
      textColor: 'text-pink-400',
      icon: Gamepad2,
      items: [
        { title: 'حديقة الأوريغامي الشعوري (طي المشاعر)', desc: 'تحويل الأفكار الثقيلة إلى طيور ورقية محلقة للسكينة', action: () => onOpenOrigamiGarden ? onOpenOrigamiGarden() : onOpenFunAndGames('wheel'), badge: 'فني 🕊️' },
        { title: 'فرقعة الأعباء النفسية وتفريغ التوتر', desc: 'فرقعة الفقاعات لإفراغ شحنات القلق والأدرينالين', action: () => onOpenInnerBurdens ? onOpenInnerBurdens() : onOpenFunAndGames('bubbles'), badge: 'مهدئ 🫧' },
        { title: 'حديقة الامتنان وبناء الجسور العاطفية', desc: 'ازرع ورود الرضا وعزز ترابطك العاطفي المتزن', action: () => onOpenGratitudeGarden ? onOpenGratitudeGarden() : onOpenFunAndGames('bubbles'), badge: 'امتنان 🌸' },
        { title: 'دولاب الفوازير والضحكات النفسية', desc: 'ابتسامات خفيفة وفوازير ذكية لإنعاش المزاج', action: () => onOpenFunAndGames('jokes') }
      ]
    },
    {
      id: 'mind_library',
      title: 'مكتبة العقل والجلسات',
      subtitle: 'تأملات، مذكرات، وجلسات أسبوعية',
      desc: 'مساحات مخصصة للتأمل العميق، درج المعجزات، ومراجعة الأسبوع.',
      emoji: '🧠',
      bgGradient: 'from-indigo-600/20 via-purple-600/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      icon: Brain,
      items: [
        { title: 'درج المعجزات الصغيرة اليومية', desc: 'رسائل تأملية حكيمة تلتقط السكينة من وسط زحمة اليوم', action: () => onOpenDailyMiracle ? onOpenDailyMiracle() : onNavigate('listen-to-yourself'), badge: 'إبداع ✨' },
        { title: 'اسمع نفسك وأمانك الداخلي', desc: 'مساحة لاحتواء الذات والحوار المتزن مع النفس', action: () => onNavigate('listen-to-yourself') },
        { title: 'الجلسة الأسبوعية التأملية والمذكرات', desc: 'مراجعة وتأمل شامل لنموك خلال الأسبوع الماضي', action: () => onNavigate('weekly-session') },
        { title: 'موسوعة المعلومات النفسية اللانهائية', desc: 'معارف واستكشافات سيكولوجية عميقة لا نهائية', action: () => onOpenEndlessPsychology('all'), badge: 'موسوعة 📚' }
      ]
    },
    {
      id: 'quick_tools',
      title: 'الأدوات السريعة والاسترخاء',
      subtitle: 'إسعافات فورية وتنفس ومطبخ المزاج',
      desc: 'أدوات فورية لتعديل المزاج، التنفس العميق 4-7-8، ومحور الأمعاء والدماغ.',
      emoji: '🌊',
      bgGradient: 'from-sky-600/20 via-blue-600/10 to-transparent',
      borderColor: 'border-sky-500/30',
      textColor: 'text-sky-400',
      icon: Wind,
      items: [
        { title: 'مطبخ المزاج ومحور الأمعاء–الدماغ', desc: 'أغذية تدعم عافيتك النفسية وطاقتك وتوازن العصب الحائر', action: () => onOpenMoodKitchen(), badge: 'تغذية 🍳' },
        { title: 'التنفس الهادئ (4-7-8)', desc: 'تمرين تنفس فوري لتهدئة الجهاز العصبي والتوتر', action: () => onNavigate('breathe') },
        { title: 'بوصلة المشاعر الدقيقة وتسمية الاحتياج', desc: 'تسمية وترتيب مشاعرك الحالية للوصول للوضوح الداخلي', action: () => onOpenEmotionCompass() }
      ]
    },
    {
      id: 'companion_support',
      title: 'التواصل مع رفيقي والدعم',
      subtitle: 'مرافقة ذكية وطوارئ آمنة',
      desc: 'رفيقك الرقمي الدائم للمساندة وخطة الطوارئ السريعة وقت الأزمات.',
      emoji: '🌿',
      bgGradient: 'from-emerald-600/20 via-green-600/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      icon: HeartHandshake,
      items: [
        { title: 'رفيقي (شخصية نسمة حياة)', desc: 'مرشدتك النفسية الذكية للحوار والاحتواء الفوري بلهجة دافئة', action: () => onOpenCompanion() },
        { title: 'إسعافات الطوارئ والضيق', desc: 'خطة إنقاذ سريعة وقت الضيق الشديد والهلع', action: () => onOpenRescueKit() },
        { title: 'طلب الدعم البشري والاحتواء', desc: 'تواصل مع فريق الدعم المتخصص بسرية تامة', action: () => onNavigate('support') }
      ]
    }
  ];

  return (
    <section className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
      isDark ? 'bg-[#12221A]/90 border-emerald-500/30' : 'bg-[#F7F3E9] border-emerald-600/20'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-emerald-500/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>التصنيفات الرئيسية الستة — نسمة حياة 🌿</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
            واحة الأقسام والأنشطة المرتبة 🧭
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            تم دمج كافة أقسام التطبيق في 6 تصنيفات رئيسية منطقية لتسهيل الوصول المباشر لكل ما تحتاجه.
          </p>
        </div>
      </div>

      {/* Grid of 6 Main Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hubs.map((hub) => {
          const IconComp = hub.icon;
          const isExpanded = activeHubId === hub.id;
          return (
            <div
              key={hub.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br ${hub.bgGradient} ${hub.borderColor} ${
                isDark ? 'bg-black/30 hover:bg-black/40' : 'bg-white hover:bg-emerald-50/40 shadow-xs'
              }`}
            >
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                    isDark ? 'bg-black/40 border border-white/10' : 'bg-white border border-stone-200'
                  }`}>
                    {hub.emoji}
                  </div>
                  <button
                    onClick={() => {
                      chimeService.playReassuranceChime();
                      onOpenEndlessPsychology(hub.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer shadow-xs"
                    title="المعلومات النفسية اللانهائية لهذا القسم"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>معلومات نفسية</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {hub.title}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {hub.desc}
                  </p>
                </div>

                {/* Sub-items accordion or list */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {hub.items.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        try { chimeService.playBubblePopChime(); } catch {}
                        sub.action();
                      }}
                      className={`w-full text-right p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/sub cursor-pointer border ${
                        isDark 
                          ? 'bg-black/20 border-white/5 text-stone-200 hover:bg-emerald-500/20 hover:border-emerald-500/40' 
                          : 'bg-white/85 border-stone-200/60 text-stone-800 hover:bg-emerald-50 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{sub.title}</span>
                      </div>
                      <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 group-hover/sub:-translate-x-1 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
