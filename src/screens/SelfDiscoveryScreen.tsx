/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

import { ScreenBannerHeader } from '../components/ScreenBannerHeader';

interface SelfDiscoveryScreenProps {
  onNavigate: (tab: string) => void;
  onOpenAssessment: () => void;
  onOpenDiscoveryQuiz: () => void;
  onOpenPersonalityTests?: () => void;
  onOpenAnaDelwaqti: () => void;
  onOpenEmotionCompass: () => void;
  onOpenBatteryCheck: () => void;
  onOpenTranslateFeelings: () => void;
  onOpenAllScreens?: () => void;
}

export const SelfDiscoveryScreen: React.FC<SelfDiscoveryScreenProps> = ({
  onNavigate,
  onOpenAssessment,
  onOpenDiscoveryQuiz,
  onOpenPersonalityTests,
  onOpenAnaDelwaqti,
  onOpenEmotionCompass,
  onOpenBatteryCheck,
  onOpenTranslateFeelings,
  onOpenAllScreens
}) => {
  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-fade-in text-right font-tajawal text-[#292F2B]" dir="rtl">
      
      {/* Screen 4 Identifier Header */}
      <ScreenBannerHeader 
        screenId="self-discovery" 
        onNavigate={onNavigate} 
        onOpenAllScreens={onOpenAllScreens} 
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#174F3F] via-[#123E32] to-[#0D2C24] border border-[#23785B]/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-white">
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 border border-white/30 rounded-full text-emerald-100 text-xs font-bold">
            <Compass className="w-4 h-4 text-amber-300" />
            <span>القسم الثاني // استكشاف الذات وترتيب المشاعر</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            افهم نفسك... بدون أحكام ولا تعقيد 🌿
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            كثير من معاناتنا اليومية تنبع من عدم وضوح ما يدور في أعماقنا؛ هل هو إرهاق جسدي؟ أم حزن متراكم؟ أم قلق من المجهول؟ هنا جمعنا لك أدوات عملية واستبيانات موجهة تساعدك على تسمية مشاعرك وتحديد حالتك بدقة وهدوء.
          </p>

          {/* Medical Notice */}
          <div className="p-4 bg-[#F8EED8] border border-[#B78327]/30 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-[#292F2B]">
            <ShieldAlert className="w-5 h-5 text-[#B78327] shrink-0" />
            <span>
              <strong>تنبيه توعوي:</strong> هذه الأدوات استكشافية وتوعوية لمساعدتك على قراءة ذاتك، وليست تقييماً طبياً أو تشخيصاً سريرياً بديلاً عن مقابلة الطبيب المختص.
            </span>
          </div>
        </div>
      </section>

      {/* 🧠 بطاقة بارزة: اختبارات تصنيف الشخصية والأنماط النفسية */}
      <section className="bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden transition-all hover:border-[#23785B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8EED8] border border-[#B78327]/40 rounded-full text-[#B78327] text-xs font-bold">
              <span>🧠</span>
              <span>مركز اختبارات تصنيف الشخصية المتقدمة</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#174F3F] leading-snug">
              اكتشف نمط شخصيتك، نقاط قوتك، وسلوكك تحت الضغط 🧭
            </h2>

            <p className="text-base text-[#515B55] leading-relaxed font-medium">
              ٤ مقاييس سيكولوجية عميقة: اختبار الأنماط الـ ١٦ (MBTI)، مقياس العوامل الخمسة الكبرى (OCEAN)، أنماط التعلّق في العلاقات، وأسلوب مواجهة الضغوط مع توصيات فورية بتمارين وألعاب ملائمة لنمطك.
            </p>
          </div>

          <button
            onClick={() => onOpenPersonalityTests && onOpenPersonalityTests()}
            className="min-h-[48px] px-6 py-3.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>بدء اختبارات تصنيف الشخصية</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Primary Discovery Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tool 1: التقييم الذاتي الأولي ومقياس PHQ-9 */}
        <div className="p-6 sm:p-7 bg-[#FFFFFF] border-2 border-[#D5DED7] hover:border-[#23785B] rounded-3xl transition-all shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2.5 rounded-2xl bg-[#E2EFE7] text-[#174F3F]">📝</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174F3F] font-bold border border-[#23785B]/30">معتمد عالمياً</span>
            </div>

            <h2 className="text-xl font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
              التقييم الذاتي الأولي ومقياس PHQ-9
            </h2>

            <div className="text-base text-[#515B55] space-y-2.5 leading-relaxed font-medium">
              <p>
                <strong>الهدف:</strong> قياس مؤشرات المزاج، ومستوى الضغوط النفسية وأعراض الحزن الشائعة عبر مقياس PHQ-9 العالمي المعتمد في الرعاية الأولية.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> من يشعر بثقل مستمر، فقدان للشغف، أو صعوبة في الاستمتاع بالأنشطة اليومية منذ أكثر من أسبوعين.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D5DED7] flex items-center justify-between">
            <span className="text-xs text-[#515B55] font-semibold">٩ أسئلة قياسية · استجابة فورية</span>
            <button
              onClick={onOpenAssessment}
              className="min-h-[44px] px-5 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>بدء التقييم الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool 2: اختبار الاستكشاف الذاتي السريع */}
        <div className="p-6 sm:p-7 bg-[#FFFFFF] border-2 border-[#D5DED7] hover:border-[#23785B] rounded-3xl transition-all shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2.5 rounded-2xl bg-[#F8EED8] text-[#B78327]">🧭</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#F8EED8] text-[#B78327] font-bold border border-[#B78327]/30">سريع وتفاعلي</span>
            </div>

            <h2 className="text-xl font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
              اختبار الاستكشاف الذاتي: ما حالتك الحالية؟
            </h2>

            <div className="text-base text-[#515B55] space-y-2.5 leading-relaxed font-medium">
              <p>
                <strong>الهدف:</strong> مسح سريع وشامل لمستوى طاقتك، حدة تفكيرك، ومدى سلامة حدودك العاطفية في دقائق معدودة.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> من يحتاج إلى نظرة عامة سريعة دون الدخول في تفاصيل الفحص السريري المسهب.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D5DED7] flex items-center justify-between">
            <span className="text-xs text-[#515B55] font-semibold">٥ أسئلة مركّزة · بطاقة نتيجة فورية</span>
            <button
              onClick={onOpenDiscoveryQuiz}
              className="min-h-[44px] px-5 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>بدء الاختبار</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool 3: بوصلة المشاعر */}
        <div className="p-6 sm:p-7 bg-[#FFFFFF] border-2 border-[#D5DED7] hover:border-[#23785B] rounded-3xl transition-all shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2.5 rounded-2xl bg-[#E2EFE7] text-[#23785B]">🧭</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#E2EFE7] text-[#23785B] font-bold border border-[#23785B]/30">تسمية المشاعر</span>
            </div>

            <h2 className="text-xl font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
              بوصلة المشاعر 🧭
            </h2>

            <div className="text-base text-[#515B55] space-y-2.5 leading-relaxed font-medium">
              <p>
                <strong>الهدف:</strong> تفكيك المشاعر العامة المبهمة (مثل "أنا متضايق") إلى أسماء دقيقة (خيبة أمل، خوف، غيرة، وحدة، خذلان).
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> في علم النفس، مجرد "تسمية المشاعر" يقلل نشاط مركز الخوف بالدماغ بنسبة 40%.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D5DED7] flex items-center justify-between">
            <span className="text-xs text-[#515B55] font-semibold">بوصلة بصرية ملونة</span>
            <button
              onClick={onOpenEmotionCompass}
              className="min-h-[44px] px-5 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>فتح البوصلة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool 4: بطاريتي كام من 10؟ */}
        <div className="p-6 sm:p-7 bg-[#FFFFFF] border-2 border-[#D5DED7] hover:border-[#23785B] rounded-3xl transition-all shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2.5 rounded-2xl bg-[#E2EFE7] text-[#174F3F]">🔋</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174F3F] font-bold border border-[#23785B]/30">قياس الطاقة</span>
            </div>

            <h2 className="text-xl font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
              بطاريتي كام؟ (فحص شحن الطاقة)
            </h2>

            <div className="text-base text-[#515B55] space-y-2.5 leading-relaxed font-medium">
              <p>
                <strong>الهدف:</strong> قياس مخزون الطاقة النفسية والجسدية المتبقية لديك اليوم من 1 إلى 10، لمنع استنزاف البطارية حتى الصفر.
              </p>
              <p>
                <strong>الفئة المناسبة:</strong> العاملون تحت ضغط وكل من يطالب نفسه بإنجازات تفوق طاقته الحالية.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D5DED7] flex items-center justify-between">
            <span className="text-xs text-[#515B55] font-semibold">مقياس شحن ديناميكي</span>
            <button
              onClick={onOpenBatteryCheck}
              className="min-h-[44px] px-5 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>فحص شحن البطارية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool 5: مسار اللحظة الحالية «أنا دلوقتي...» */}
        <div className="p-6 sm:p-7 bg-[#FFFFFF] border-2 border-[#D5DED7] hover:border-[#23785B] rounded-3xl transition-all shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2.5 rounded-2xl bg-[#E2EFE7] text-[#23785B]">🌿</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#E2EFE7] text-[#23785B] font-bold border border-[#23785B]/30">اللحظة الحالية</span>
            </div>

            <h2 className="text-xl font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
              مسار اللحظة الحالية: «أنا دلوقتي...»
            </h2>

            <div className="text-base text-[#515B55] space-y-2.5 leading-relaxed font-medium">
              <p>
                <strong>الهدف:</strong> التوقف عن القفز بين مشاكل الماضي ومخاوف المستقبل، والتركيز على ما يدور داخل جسدك وعقلك الآن.
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> «مش لازم تحل كل حاجة دلوقتي.. خلينا نبدأ من اللي حاصل معاك الآن.»
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D5DED7] flex items-center justify-between">
            <span className="text-xs text-[#515B55] font-semibold">خطوات تهدئة موجهة</span>
            <button
              onClick={onOpenAnaDelwaqti}
              className="min-h-[44px] px-5 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>ابدأ المسار اللحظي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool 6: ترجم اللي جواك */}
        <div className="p-6 sm:p-7 bg-[#FFFFFF] border-2 border-[#D5DED7] hover:border-[#23785B] rounded-3xl transition-all shadow-sm flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2.5 rounded-2xl bg-[#F8EED8] text-[#B78327]">🗣️</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#F8EED8] text-[#B78327] font-bold border border-[#B78327]/30">تفكيك الكلمات</span>
            </div>

            <h2 className="text-xl font-bold text-[#174F3F] group-hover:text-[#23785B] transition-colors">
              ترجم اللي جواك (ما وراء الجمل الشائعة)
            </h2>

            <div className="text-base text-[#515B55] space-y-2.5 leading-relaxed font-medium">
              <p>
                <strong>الهدف:</strong> كشف الرسائل النفسية والاحتياجات الحقيقية المخفية وراء كلمات مثل "أنا عادي"، "كل حاجة بايظة"، أو "مش فارقة".
              </p>
              <p>
                <strong>ماذا تتعلم منه:</strong> تكتشف أن الجمل التي نكررها تلقائياً تخفي أحياناً حاجة ماسة للأمان والتقدير.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D5DED7] flex items-center justify-between">
            <span className="text-xs text-[#515B55] font-semibold">قاموس المعاني الشعورية</span>
            <button
              onClick={onOpenTranslateFeelings}
              className="min-h-[44px] px-5 py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-[17px] font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>اكتشف الترجمة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
