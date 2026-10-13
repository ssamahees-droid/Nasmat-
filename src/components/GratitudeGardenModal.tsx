import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Droplet, 
  Trash2, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  Sun,
  Calendar,
  Volume2,
  VolumeX,
  Award
} from 'lucide-react';
import { storage, GratitudePlant } from '../services/storage';
import { chimeService } from '../services/chimeService';

interface SeedOption {
  type: GratitudePlant['seedType'];
  name: string;
  emoji: string;
  color: string;
  desc: string;
}

const SEED_OPTIONS: SeedOption[] = [
  {
    type: 'small_blessings',
    name: 'برعم النعم اليومية',
    emoji: '🌱',
    color: '#10B981',
    desc: 'لتفاصيل اليوم الصغيرة: فنجان قهوة، شمس الصباح، نوم مريح'
  },
  {
    type: 'peace',
    name: 'زهرة راحة البال',
    emoji: '🌸',
    color: '#EC4899',
    desc: 'للحظات السكينة وهدوء البال والراحة بعد عاصفة'
  },
  {
    type: 'warmth',
    name: 'دوار شمس العلاقات الدافئة',
    emoji: '🌻',
    color: '#F59E0B',
    desc: 'لمكالمة طيبة، ابتسامة من قريب، سند حقيقي من شخص يحبك'
  },
  {
    type: 'achievement',
    name: 'شتلة الإنجاز الصامت',
    emoji: '🌿',
    color: '#06B6D4',
    desc: 'لخطوة قطعتها اليوم برغم التعب، ولمحاولاتك المستمرة'
  },
  {
    type: 'deep_gratitude',
    name: 'شجرة الامتنان العميق',
    emoji: '🌳',
    color: '#8B5CF6',
    desc: 'لنعمة الصحة، النجاة، الأمان، والفرص التي أُتيحت لك'
  }
];

interface GratitudeGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GratitudeGardenModal: React.FC<GratitudeGardenModalProps> = ({
  isOpen,
  onClose
}) => {
  const [plants, setPlants] = useState<GratitudePlant[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<SeedOption>(SEED_OPTIONS[0]);
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [isPlantingMode, setIsPlantingMode] = useState(false);
  const [inspectedPlant, setInspectedPlant] = useState<GratitudePlant | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isMuted, setIsMuted] = useState(chimeService.isMuted());
  const [waterEffectId, setWaterEffectId] = useState<string | null>(null);

  const loadPlants = () => {
    const list = storage.getGratitudePlants();
    setPlants(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadPlants();
      setIsMuted(chimeService.isMuted());
      setIsPlantingMode(false);
      setInspectedPlant(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlantSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeInput.trim()) return;

    chimeService.playFlowerBloomChime();

    const created = storage.addGratitudePlant({
      text: gratitudeInput.trim(),
      seedType: selectedSeed.type,
      plantName: selectedSeed.name,
      emoji: selectedSeed.emoji,
      flowerColor: selectedSeed.color
    });

    setGratitudeInput('');
    setIsPlantingMode(false);
    loadPlants();
    setInspectedPlant(created);
  };

  const handleWaterPlant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chimeService.playWaterDropChime();
    setWaterEffectId(id);
    setTimeout(() => setWaterEffectId(null), 1000);

    const updated = storage.waterGratitudePlant(id);
    if (updated) {
      loadPlants();
      if (inspectedPlant?.id === id) {
        setInspectedPlant(updated);
      }
    }
  };

  const handleDeletePlant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteGratitudePlant(id);
    loadPlants();
    if (inspectedPlant?.id === id) {
      setInspectedPlant(null);
    }
  };

  const handleShareGarden = () => {
    const text = `حديقتي للامتنان اليومي في تطبيق نسمة حياة 🌸🌿\n• زرعت ${plants.length} نبتة امتنان حتى الآن.\n«الامتنان ليس مجرد شعور، بل عدسة ترى بها النعم المنسية في روتين الحياة.»\n\n— انضم إلي في منصة نسمة حياة 🌿`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const bloomCount = plants.filter(p => p.stage >= 3).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0F1712] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_15px_50px_rgba(16,185,129,0.2)] overflow-hidden text-right max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/40">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-tajawal">
                  لعبة «حديقة الامتنان اليومية»
                </h2>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  واحة تنمو مع كل نعمة
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                اكتب امتناناً بسيطاً لتزرع نبتة جديدة واسقها بالاهتمام لتزهر في حديقتك الافتراضية 🌸
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = chimeService.toggleMute();
                setIsMuted(next);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShareGarden}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all"
              title="مشاركة إنجاز الحديقة"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Garden Stats Bar */}
        <div className="py-2.5 px-4 my-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-stone-300">
              إجمالي النباتات: <strong className="text-emerald-400 font-black">{plants.length}</strong>
            </span>
            <span className="text-stone-300">
              أزهار مكتملة التفتح: <strong className="text-amber-400 font-black">{bloomCount}</strong>
            </span>
          </div>

          <button
            onClick={() => setIsPlantingMode(!isPlantingMode)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isPlantingMode ? 'إلغاء الزرع' : 'زرع امتنان جديد 🌱'}</span>
          </button>
        </div>

        {/* Planting Form Modal Drawer */}
        {isPlantingMode && (
          <form onSubmit={handlePlantSeed} className="p-4 mb-3 rounded-2xl bg-[#16251D] border border-emerald-500/40 shadow-xl space-y-3 shrink-0 animate-fade-in">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white block">
                اختر نوع البذرة التي تعبر عن امتنانك الآن:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {SEED_OPTIONS.map((seed) => {
                  const isSelected = selectedSeed.type === seed.type;
                  return (
                    <button
                      type="button"
                      key={seed.type}
                      onClick={() => setSelectedSeed(seed)}
                      className={`p-2 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{seed.emoji}</span>
                      <span className="text-[11px] font-bold truncate">{seed.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300 block">
                اكتب ما أنت ممتن له في هذه اللحظة (حتى لو كان فنجان قهوة هادئ أو مكالمة قصيرة):
              </label>
              <textarea
                value={gratitudeInput}
                onChange={(e) => setGratitudeInput(e.target.value)}
                placeholder="أنا ممتن اليوم لـ..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsPlantingMode(false)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!gratitudeInput.trim()}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>غرس البذرة وسقيها 🌸</span>
              </button>
            </div>
          </form>
        )}

        {/* Botanical Garden Plot Grid */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[350px] bg-gradient-to-b from-[#14231A] via-[#0E1812] to-[#0A100C] rounded-3xl border border-emerald-500/20 p-4 overflow-y-auto">
          
          {/* Subtle Sun & Garden Ambience */}
          <div className="absolute top-3 left-4 flex items-center gap-1 text-[11px] text-amber-300/80 font-bold pointer-events-none">
            <Sun className="w-4 h-4 text-amber-400 animate-spin duration-1000" />
            <span>شمس الحديقة الدافئة ☀️</span>
          </div>

          {plants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <span className="text-5xl">🪴</span>
              <p className="text-sm font-bold text-stone-300">حديقتك جاهزة للبذار الأولى!</p>
              <button
                onClick={() => setIsPlantingMode(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl cursor-pointer"
              >
                ازرع بذرة امتنان الآن 🌱
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-6">
              {plants.map((plant) => {
                const isInspected = inspectedPlant?.id === plant.id;
                const isWatering = waterEffectId === plant.id;

                // Visual plant icon based on stage
                let stageIcon = plant.emoji;
                let stageLabel = 'زهرة مكتملة 🌸';
                if (plant.stage === 1) {
                  stageIcon = '🌱';
                  stageLabel = 'برعم صغير';
                } else if (plant.stage === 2) {
                  stageIcon = '🌿';
                  stageLabel = 'نبتة نامية';
                }

                return (
                  <div
                    key={plant.id}
                    onClick={() => setInspectedPlant(plant)}
                    className={`relative p-3 rounded-2xl border text-right cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                      isInspected
                        ? 'bg-emerald-950/70 border-emerald-400 shadow-lg shadow-emerald-900/50 scale-[1.02]'
                        : 'bg-white/5 hover:bg-emerald-950/30 border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    {/* Water drop animation */}
                    {isWatering && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-ping pointer-events-none">
                        💧
                      </span>
                    )}

                    {/* Plant Graphic & Stage */}
                    <div className="flex flex-col items-center py-2 relative">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                        {stageIcon}
                      </div>

                      <span className="text-[10px] mt-1.5 px-2 py-0.5 rounded-full bg-black/40 text-stone-300 border border-white/10 font-bold">
                        {stageLabel}
                      </span>
                    </div>

                    {/* Text Preview */}
                    <div className="mt-1 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold block truncate">
                        {plant.plantName}
                      </span>
                      <p className="text-xs text-stone-200 line-clamp-2 leading-tight">
                        {plant.text}
                      </p>
                    </div>

                    {/* Water Action Button */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">
                        سُقيت: {plant.waterCount} مرات
                      </span>

                      <button
                        onClick={(e) => handleWaterPlant(plant.id, e)}
                        className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 text-[10px] font-bold border border-sky-500/30 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        title="اسقِ هذه النبتة"
                      >
                        <Droplet className="w-3 h-3 text-sky-400" />
                        <span>سقاية 💧</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Plant Detail Drawer */}
        {inspectedPlant && (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-[#17271E] via-[#1C2C22] to-[#121F17] border border-emerald-500/40 shadow-xl animate-fade-in shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{inspectedPlant.emoji}</span>
                  <span className="text-xs font-black text-emerald-300">{inspectedPlant.plantName}</span>
                  <span className="text-[10px] text-stone-400">
                    غُرست بتاريخ: {new Date(inspectedPlant.plantedAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  «{inspectedPlant.text}»
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleWaterPlant(inspectedPlant.id, e)}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-sky-500 hover:bg-sky-400 text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>اسقِ النبتة لتنمو 💧</span>
                </button>

                <button
                  onClick={(e) => handleDeletePlant(inspectedPlant.id, e)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-950/40 text-stone-400 hover:text-rose-300 transition-colors"
                  title="حذف من الحديقة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
