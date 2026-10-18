import React, { useState } from 'react';
import { X, Sparkles, Feather, Heart, Volume2, RefreshCw, ChevronRight, BookOpen, Compass, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { chimeService } from '../services/chimeService';
import { TextAudioPlayer } from './TextAudioPlayer';
import { storage } from '../services/storage';

interface EmotionalOrigamiGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenActivity?: (activityId: string) => void;
  theme?: 'dark' | 'light' | 'system';
}

interface OrigamiLeaf {
  id: string;
  shapeNameAr: string;
  shapeNameEn: string;
  emoji: string;
  colorClass: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
}

const ORIGAMI_GARDEN_ITEMS: OrigamiLeaf[] = [
  {
    id: 'origami_1',
    shapeNameAr: 'ورقة اللوتس للسلام',
    shapeNameEn: 'Lotus Leaf of Peace',
    emoji: '🪷',
    colorClass: 'from-emerald-500/30 to-teal-600/20 border-emerald-500/40 text-emerald-300',
    titleAr: 'الطفو فوق أمواج الأفكار المتسارعة',
    titleEn: 'Floating Above Racing Thoughts',
    messageAr: 'مثل زهرة اللوتس التي تنبت طاهرة من أعماق الطين؛ أفكارك المزعجة اليوم هي مجرد طين تمر فوقه وتتفتح فوقه بسلام.',
    messageEn: 'Like the lotus rising pure from muddy waters, your worries are temporary mud beneath your blossoming peace.'
  },
  {
    id: 'origami_2',
    shapeNameAr: 'طائر الطمأنينة الورقي',
    shapeNameEn: 'Paper Crane of Serenity',
    emoji: '🕊️',
    colorClass: 'from-sky-500/30 to-blue-600/20 border-sky-500/40 text-sky-300',
    titleAr: 'تحليق خفيف بعيداً عن أثقال التوقعات',
    titleEn: 'Soaring High Above Heavy Expectations',
    messageAr: 'اطوِ خاوفك على شكل طائر ورقي وأطلقه في سماء التسليم؛ لست مجبراً على حمل أثقال الكون وحدك اليوم.',
    messageEn: 'Fold your fears into a paper crane and release them into the sky; you don’t have to carry the universe alone.'
  },
  {
    id: 'origami_3',
    shapeNameAr: 'شمعة اليقظة الدافئة',
    shapeNameEn: 'Candle of Mindfulness',
    emoji: '🕯️',
    colorClass: 'from-amber-500/30 to-yellow-600/20 border-amber-500/40 text-amber-300',
    titleAr: 'إنارة عتمة القلق بنور اللحظة',
    titleEn: 'Lighting Mental Darkness with Presence',
    messageAr: 'يكفي شمعة واحدة صغيرة لتضيء غرفة مظلمة بالكامل؛ تنفس بعمق ودع نور الحضور يتبدد ظلام التوتر.',
    messageEn: 'A single candle can illuminate a dark room; breathe deeply and let presence dispel tension.'
  },
  {
    id: 'origami_4',
    shapeNameAr: 'ورقة الخريف والتحرر',
    shapeNameEn: 'Autumn Leaf of Release',
    emoji: '🍂',
    colorClass: 'from-orange-500/30 to-amber-700/20 border-orange-500/40 text-orange-300',
    titleAr: 'السماح للماضي بالرحيل الطبيعي',
    titleEn: 'Allowing the Past to Fall Away Naturally',
    messageAr: 'الأشجار لا تحزن لسقوط أوراقها القديمة في الخريف، بل تجهز نفسها لربيع أخضر جديد. دع ما مضى يمضي.',
    messageEn: 'Trees do not mourn fallen autumn leaves; they prepare for fresh green spring. Let what passed go.'
  }
];

export const EmotionalOrigamiGardenModal: React.FC<EmotionalOrigamiGardenModalProps> = ({
  isOpen,
  onClose,
  onOpenActivity,
  theme = 'dark'
}) => {
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const [selectedLeaf, setSelectedLeaf] = useState<OrigamiLeaf>(ORIGAMI_GARDEN_ITEMS[0]);
  const [isFolded, setIsFolded] = useState(true);

  if (!isOpen) return null;

  const handleSelectLeaf = (leaf: OrigamiLeaf) => {
    chimeService.playReassuranceChime();
    setIsFolded(false);
    setSelectedLeaf(leaf);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className={`border rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 text-right shadow-2xl transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-[#13221B] via-[#0F1A15] to-[#0A120E] border-emerald-500/35 text-[#F7F3E9]' 
          : 'bg-gradient-to-br from-[#f2faf4] via-[#e5f5ea] text-[#13251E]'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕊️</span>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 block font-tajawal">
                {language === 'ar' ? 'إبداع فني وتربوي حصري' : 'Artistic & Therapeutic Innovation'}
              </span>
              <h3 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-stone-900'}`}>
                {language === 'ar' ? 'حديقة الأوريغامي الشعوري (طي المشاعر)' : 'Emotional Origami Garden'}
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white cursor-pointer rounded-xl bg-black/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
          {language === 'ar'
            ? 'في الفن الياباني، تشكيل الورق (الأوريغامي) يمنح العقل مهلة للتأمل. اختر شكلاً ورقياً الآن لتطوي أثقالك وتستعيد خفة روحك وسكينتك:'
            : 'In Japanese art, paper folding grants the mind a soothing pause. Choose an origami shape to fold your heavy feelings:'}
        </p>

        {/* Origami Shapes Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ORIGAMI_GARDEN_ITEMS.map((leaf) => {
            const isSelected = selectedLeaf.id === leaf.id;
            return (
              <button
                key={leaf.id}
                onClick={() => handleSelectLeaf(leaf)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected 
                    ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-md scale-102 ring-2 ring-emerald-400/50' 
                    : isDark 
                      ? 'bg-white/5 border-white/10 hover:border-emerald-500/40 text-stone-300' 
                      : 'bg-white border-stone-200 text-stone-700'
                }`}
              >
                <span className="text-2xl">{leaf.emoji}</span>
                <span className="text-[11px] font-bold block">{language === 'ar' ? leaf.shapeNameAr : leaf.shapeNameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Origami Reveal Card */}
        <div className={`p-6 rounded-2xl border space-y-4 shadow-inner ${selectedLeaf.colorClass}`}>
          <div className="flex items-center justify-between">
            <span className="text-3xl">{selectedLeaf.emoji}</span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-black/20 text-white backdrop-blur-xs">
              {language === 'ar' ? selectedLeaf.shapeNameAr : selectedLeaf.shapeNameEn}
            </span>
          </div>

          <h4 className={`text-base sm:text-lg font-bold font-tajawal ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {language === 'ar' ? selectedLeaf.titleAr : selectedLeaf.titleEn}
          </h4>

          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
            {language === 'ar' ? selectedLeaf.messageAr : selectedLeaf.messageEn}
          </p>
        </div>

        {/* Audio Player */}
        <div className="pt-1">
          <TextAudioPlayer
            text={language === 'ar' 
              ? `${selectedLeaf.titleAr}. ${selectedLeaf.messageAr}` 
              : `${selectedLeaf.titleEn}. ${selectedLeaf.messageEn}`}
            label={language === 'ar' ? 'استمع لرسالة التأمل الورقي' : 'Listen to Origami Reflection'}
            variant="compact"
          />
        </div>

        {/* Action footer */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-500/15">
          <button
            onClick={() => {
              chimeService.playReassuranceChime();
              onClose();
              if (onOpenActivity) onOpenActivity('breathe');
            }}
            className="text-emerald-400 hover:text-emerald-300 text-xs font-bold underline cursor-pointer"
          >
            {language === 'ar' ? 'الانتقال لتمرين التنفس المهدئ 🌬️' : 'Go to Breathing Exercise'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {language === 'ar' ? 'حفظ السكينة وإغلاق' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
