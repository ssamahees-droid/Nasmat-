import React, { useState } from 'react';
import { Sparkles, Compass, Heart, Brain, RefreshCw, X, ChevronRight, Volume2, ShieldCheck, Smile } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { chimeService } from '../services/chimeService';
import { TextAudioPlayer } from './TextAudioPlayer';

interface DailyMiracleDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenActivity?: (activityId: string) => void;
  theme?: 'dark' | 'light' | 'system';
}

interface MiracleItem {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  promptAr: string;
  promptEn: string;
  insightAr: string;
  insightEn: string;
  suggestedActionId: string;
  suggestedActionNameAr: string;
}

const MIRACLE_DRAWER_ITEMS: MiracleItem[] = [
  {
    id: 'miracle_1',
    titleAr: 'رسالة الشجرة العميقة',
    titleEn: 'Deep Tree Wisdom',
    categoryAr: 'جذر الثبات',
    categoryEn: 'Rooted Stability',
    promptAr: 'مهما اشتدت العواصف حول الأغصان، تظل الجذور في عمق الأرض آمنة لا تخاف الريح. اعلم أن ما تستند إليه أعمق بكثير مما يظهر للعيان.',
    promptEn: 'No matter how fierce the winds shake the branches, the roots remain anchored and safe underground.',
    insightAr: 'اليوم، اترك محاولات السيطرة على كل تفصيلة خارجية، وعد إلى جذورك: تنفس بعمق وتذكر أن ثباتك ينبع من داخلك لا من الظروف.',
    insightEn: 'Today, release the need to control every external detail and return to your roots.',
    suggestedActionId: 'breathe',
    suggestedActionNameAr: 'دقيقة تنفس هادئة للعصب الحائر'
  },
  {
    id: 'miracle_2',
    titleAr: 'ومضة ضوء في زحمة الأفكار',
    titleEn: 'A Ray of Light in Mental Fog',
    categoryAr: 'صفاء الذهن',
    categoryEn: 'Mental Clarity',
    promptAr: 'السماء صافية بطبيعتها؛ وغيوم القلق والهموم مهما كثفت لا بد أن تنجلي وتترك المكان لنور الشمس.',
    promptEn: 'The sky is inherently clear; clouds of worry, no matter how dense, will always part to reveal the sun.',
    insightAr: 'أفكارك ليست أنت؛ أنت المراقب الهادئ للسماء. اسمح للغيمة بالمرور دون أن تقبض عليها.',
    insightEn: 'Your thoughts are not you; you are the silent observer of the sky.',
    suggestedActionId: 'feker',
    suggestedActionNameAr: 'تطبيق فكّر لإعادة التأطير المعرفي'
  },
  {
    id: 'miracle_3',
    titleAr: 'كأس الشاي الدافئ واللحظة الحاضرة',
    titleEn: 'Warm Tea & The Present Moment',
    categoryAr: 'تيقظ الحواس',
    categoryEn: 'Sensory Presence',
    promptAr: 'حين ترتشف رشفة ماء أو شاي ببطء، يعود عقلك من رحلات الخوف المستقبلي إلى أمان اللحظة الحالية.',
    promptEn: 'When you sip warm water or tea mindfully, your mind returns from future anxiety to the safety of now.',
    insightAr: 'لا تؤجل سكينة اليوم للغد. امنح نفسك خمس دقائق من الحضور الواعي الخالي من الشاشات والمشتتات.',
    insightEn: 'Do not postpone today’s peace for tomorrow. Grant yourself 5 minutes of screen-free presence.',
    suggestedActionId: 'mood_kitchen',
    suggestedActionNameAr: 'مطبخ المزاج وأكسير الهدوء'
  },
  {
    id: 'miracle_4',
    titleAr: 'درع الرحمة بالذات',
    titleEn: 'Shield of Self-Compassion',
    categoryAr: 'الرحمة بالذات',
    categoryEn: 'Self-Compassion',
    promptAr: 'كن لطيفاً مع نفسك اليوم كأنك تواسي صديقاً عزيزاً يمر بأثقل أيامه؛ أنت تستحق هذا الحنو تماماً كغيرك.',
    promptEn: 'Be as gentle with yourself today as you would be comforting a dear friend passing through heavy days.',
    insightAr: 'لا تجلد ذاتك على أخطاء الأمس. كفايتك تكمن في محاولتك الصادقة للوقوف من جديد برفق.',
    insightEn: 'Do not punish yourself for yesterday’s missteps. Your worth lies in your sincere gentle rise.',
    suggestedActionId: 'gratitude_garden',
    suggestedActionNameAr: 'حديقة الامتنان وترسيخ الرضا'
  },
  {
    id: 'miracle_5',
    titleAr: 'بوصلة الاحتياج الحقيقي',
    titleEn: 'True Need Compass',
    categoryAr: 'فهم الاحتياج',
    categoryEn: 'Inner Need',
    promptAr: 'خلف كل غضب أو إرهاق أو رغبة في الانسحاب، يوجد احتياج نقي لم يتم سماعه بعد: إما أمان، أو تقدير، أو راحة.',
    promptEn: 'Behind every irritation, exhaustion, or urge to withdraw lies an unheard pure need: safety, appreciation, or rest.',
    insightAr: 'اسأل نفسك الآن بهدوء: "ما الذي أحتاجه حقاً في هذه اللحظة لأشعر بالسلام؟" وامنحه لنفسك.',
    insightEn: 'Ask yourself quietly right now: "What do I truly need at this moment to feel at peace?"',
    suggestedActionId: 'emotion_compass',
    suggestedActionNameAr: 'بوصلة المشاعر وتسمية الاحتياج'
  }
];

export const DailyMiracleDrawerModal: React.FC<DailyMiracleDrawerModalProps> = ({
  isOpen,
  onClose,
  onOpenActivity,
  theme = 'dark'
}) => {
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * MIRACLE_DRAWER_ITEMS.length));
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isOpen) return null;

  const currentItem = MIRACLE_DRAWER_ITEMS[currentIndex];

  const handleDrawNew = () => {
    chimeService.playReassuranceChime();
    setIsRevealed(false);
    setTimeout(() => {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * MIRACLE_DRAWER_ITEMS.length);
      } while (nextIdx === currentIndex && MIRACLE_DRAWER_ITEMS.length > 1);
      setCurrentIndex(nextIdx);
      setIsRevealed(true);
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className={`border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-right shadow-2xl transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-[#162920] via-[#121F19] to-[#0D1511] border-emerald-500/35 text-[#F7F3E9]' 
          : 'bg-gradient-to-br from-[#f5fbf6] via-[#ecf7ef] to-[#e2f1e6] border-emerald-600/25 text-[#13251E]'
      }`}>
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <span className="text-[10px] font-bold text-amber-400 block font-tajawal">
                {language === 'ar' ? 'إبداع نسمة حياة الحصري' : 'Exclusive Innovation'}
              </span>
              <h3 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-stone-900'}`}>
                {language === 'ar' ? 'درج المعجزات الصغيرة اليومية 🌿' : 'Daily Miracle Drawer'}
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white cursor-pointer rounded-xl bg-black/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content */}
        <div className={`p-6 sm:p-7 rounded-2xl border text-center space-y-4 transition-all shadow-inner ${
          isDark ? 'bg-black/30 border-emerald-500/25' : 'bg-white/80 border-emerald-600/15'
        }`}>
          <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
            {language === 'ar' ? currentItem.categoryAr : currentItem.categoryEn}
          </span>

          <h4 className={`text-lg sm:text-xl font-bold font-tajawal ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {language === 'ar' ? currentItem.titleAr : currentItem.titleEn}
          </h4>

          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
            «{language === 'ar' ? currentItem.promptAr : currentItem.promptEn}»
          </p>

          <div className="pt-3 border-t border-white/10 text-xs space-y-1.5 text-emerald-300 font-medium">
            <p>{language === 'ar' ? currentItem.insightAr : currentItem.insightEn}</p>
          </div>
        </div>

        {/* Audio Player for the Miracle */}
        <div className="pt-1">
          <TextAudioPlayer
            text={language === 'ar' 
              ? `${currentItem.titleAr}. ${currentItem.promptAr} ${currentItem.insightAr}` 
              : `${currentItem.titleEn}. ${currentItem.promptEn}`}
            label={language === 'ar' ? 'استمع لرسالة المعجزة اليومية' : 'Listen to Daily Miracle'}
            variant="compact"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-500/15">
          <button
            onClick={handleDrawNew}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'اسحب رسالة أخرى ✨' : 'Draw Another'}</span>
          </button>

          <button
            onClick={() => {
              chimeService.playReassuranceChime();
              onClose();
              if (onOpenActivity) onOpenActivity(currentItem.suggestedActionId);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{language === 'ar' ? currentItem.suggestedActionNameAr : 'Start Activity'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
