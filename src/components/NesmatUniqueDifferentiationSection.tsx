import React, { useState } from 'react';
import { Sparkles, Heart, Compass, ShieldCheck, ArrowUpRight, Flame, Brain, BookOpen, Volume2, MessageSquare, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { chimeService } from '../services/chimeService';

interface NesmatUniqueDifferentiationSectionProps {
  onOpenCompanion: () => void;
  onOpenMoodKitchen: () => void;
  onOpenPersonalityTests?: () => void;
  onNavigate: (tab: string) => void;
  theme?: 'dark' | 'light' | 'system';
}

export const NesmatUniqueDifferentiationSection: React.FC<NesmatUniqueDifferentiationSectionProps> = ({
  onOpenCompanion,
  onOpenMoodKitchen,
  onOpenPersonalityTests,
  onNavigate,
  theme = 'dark'
}) => {
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const UNIQUE_PILLARS = [
    {
      id: 'cultural_arabic',
      titleAr: 'هوية عربية مصرية أصيلة واحتواء دافئ',
      titleEn: 'Authentic Arab & Cultural Resonance',
      descAr: 'ليس مجرد تطبيق مترجم؛ بل بيئة نفسية مصممة بنبض الثقافة والبيت العربي ومفرداته المطمئنة بعيداً عن التغريب أو التكلف الأكاديمي.',
      descEn: 'Tailored specifically for the Arabic psyche with warm cultural idioms and compassionate local resonance.',
      icon: Heart,
      badge: 'ثقافة وبيئة واعية',
      actionTextAr: 'تحدث مع رفيقي بلهجتك 🌿',
      action: onOpenCompanion
    },
    {
      id: 'gut_brain',
      titleAr: 'محور الأمعاء–الدماغ «مطبخ المزاج»',
      titleEn: 'Gut-Brain Axis & Mood Kitchen',
      descAr: 'الربط الفريد بين ما نتناوله من طعام بسيط (كالزبادي، الفول، البابونج، والحليب الذهبي) وبين الكيمياء العصبية واستقرار المزاج علمياً.',
      descEn: 'Groundbreaking integration of nutrition science with mental resilience via the gut-brain axis.',
      icon: Sparkles,
      badge: 'العلم والتغذية النفسية',
      actionTextAr: 'افتح مطبخ المزاج والتوصيات 🍳',
      action: onOpenMoodKitchen
    },
    {
      id: 'personality_tests',
      titleAr: 'أربعة مقاييس سيكولوجية معتمدة',
      titleEn: '4 Validated Personality Typologies',
      descAr: 'اختبار الأنماط الـ ١٦ (MBTI)، مقياس العوامل الخمسة الكبرى (OCEAN)، أنماط التعلّق، وأسلوب مواجهة الضغوط مع توصيات مخصصة لنمطك.',
      descEn: 'Comprehensive diagnostics including MBTI, Big Five, Attachment, and Stress Coping profiles.',
      icon: Brain,
      badge: 'تشخيص وتوجيه علمي',
      actionTextAr: 'ابدأ اختبارات الشخصية 🧠',
      action: () => onOpenPersonalityTests ? onOpenPersonalityTests() : onNavigate('self-discovery')
    },
    {
      id: 'dignity_privacy',
      titleAr: 'خصوصية تامة وقانون حماية بيانات مصري ١٥١',
      titleEn: 'Total Privacy & Egyptian Law 151 Compliant',
      descAr: 'تشفير كامل لكافة ملاحظاتك ومذكراتك محلياً مع التزام قانوني صارم بالسرية ورفض تام لأي إعلانات أو تتبع تجاري.',
      descEn: 'Complete local encryption compliant with data privacy laws, free of ads or tracking.',
      icon: ShieldCheck,
      badge: 'أمان وموثوقية مطلقة',
      actionTextAr: 'تصفح كراسة الحماية 🛡️',
      action: () => onNavigate('start')
    }
  ];

  const currentPillar = UNIQUE_PILLARS[activeFeatureIndex];

  return (
    <section className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
      isDark 
        ? 'bg-gradient-to-br from-[#15271E] via-[#111E18] to-[#0A130F] border-emerald-500/35' 
        : 'bg-gradient-to-br from-[#f2f9f4] via-[#e5f4ea] to-[#d8ede0] border-emerald-600/20'
    }`}>
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'ما الذي يجعل «نسمة حياة» مختلفاً كلياً عن أي تطبيق نفسي؟' : 'What Makes Nesmat Al-Hayat Unique?'}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-extrabold font-tajawal ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {language === 'ar' ? 'أربعة أعمدة تبتكر معياراً جديداً للصحة النفسية والعربية 🌿' : 'Four Pillars Redefining Arab Mental Wellbeing'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-2xl border border-white/10 self-start md:self-center">
            {UNIQUE_PILLARS.map((pillar, idx) => {
              const isActive = activeFeatureIndex === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => {
                    chimeService.playReassuranceChime();
                    setActiveFeatureIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500 text-black shadow-md scale-102' 
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlighted Pillar Card */}
        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
          isDark ? 'bg-black/35 border-emerald-500/30' : 'bg-white/80 border-emerald-600/20 shadow-sm'
        }`}>
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-block">
              {currentPillar.badge}
            </span>

            <h3 className={`text-lg sm:text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {language === 'ar' ? currentPillar.titleAr : currentPillar.titleEn}
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              {language === 'ar' ? currentPillar.descAr : currentPillar.descEn}
            </p>
          </div>

          <button
            onClick={() => {
              chimeService.playReassuranceChime();
              currentPillar.action();
            }}
            className="w-full md:w-auto px-5 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-emerald-400/40"
          >
            <span>{language === 'ar' ? currentPillar.actionTextAr : 'Explore Now'}</span>
            <ArrowUpRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Quick Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {UNIQUE_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = activeFeatureIndex === idx;
            return (
              <div
                key={p.id}
                onClick={() => {
                  chimeService.playReassuranceChime();
                  setActiveFeatureIndex(idx);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected 
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md' 
                    : isDark 
                      ? 'bg-black/20 border-white/10 text-stone-400 hover:border-emerald-500/30 hover:text-stone-200' 
                      : 'bg-white/60 border-stone-200 text-stone-600 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-black' : 'bg-emerald-500/15 text-emerald-300'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono opacity-60">0{idx + 1}</span>
                </div>
                <span className={`text-xs font-bold line-clamp-1 ${isSelected ? (isDark ? 'text-white' : 'text-stone-900') : ''}`}>
                  {language === 'ar' ? p.titleAr : p.titleEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
