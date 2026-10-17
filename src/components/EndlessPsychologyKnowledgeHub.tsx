import React, { useState } from 'react';
import { Sparkles, Brain, Compass, BookOpen, Gamepad2, Wind, HeartHandshake, RefreshCw, X, ChevronRight, Bookmark } from 'lucide-react';
import { ENDLESS_PSYCHOLOGY_FACTS, PsychologicalFactItem, getFactsByCategory, getRandomFact } from '../data/endlessPsychologyFacts';
import { chimeService } from '../services/chimeService';

interface EndlessPsychologyKnowledgeHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  theme?: 'dark' | 'light' | 'system';
}

const CATEGORIES = [
  { id: 'all', label: 'جميع الأقسام', icon: Sparkles, color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 'exploration', label: 'رحلة الاستكشاف', icon: Compass, color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 'workshops', label: 'ورش العمل', icon: BookOpen, color: 'text-amber-400 bg-amber-500/10' },
  { id: 'games_relief', label: 'ألعاب التهدئة', icon: Gamepad2, color: 'text-pink-400 bg-pink-500/10' },
  { id: 'mind_library', label: 'مكتبة العقل', icon: Brain, color: 'text-indigo-400 bg-indigo-500/10' },
  { id: 'quick_tools', label: 'الأدوات السريعة', icon: Wind, color: 'text-sky-400 bg-sky-500/10' },
  { id: 'companion_support', label: 'رفيقي والدعم', icon: HeartHandshake, color: 'text-emerald-400 bg-emerald-500/10' },
];

export const EndlessPsychologyKnowledgeHub: React.FC<EndlessPsychologyKnowledgeHubProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [currentFact, setCurrentFact] = useState<PsychologicalFactItem>(() => getRandomFact(initialCategory === 'all' ? undefined : initialCategory));
  const [savedFacts, setSavedFacts] = useState<string[]>([]);

  if (!isOpen) return null;

  const filteredFacts = selectedCategory === 'all' 
    ? ENDLESS_PSYCHOLOGY_FACTS 
    : getFactsByCategory(selectedCategory);

  const handleNextRandom = () => {
    chimeService.playReassuranceChime();
    const next = getRandomFact(selectedCategory === 'all' ? undefined : selectedCategory);
    setCurrentFact(next);
  };

  const toggleSave = (id: string) => {
    chimeService.playReassuranceChime();
    if (savedFacts.includes(id)) {
      setSavedFacts(savedFacts.filter(f => f !== id));
    } else {
      setSavedFacts([...savedFacts, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#101E17] border-emerald-500/40 text-white' : 'bg-[#F7F3E9] border-emerald-600/30 text-stone-900'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-emerald-500/20 flex items-center justify-between bg-gradient-to-r from-emerald-600/20 to-teal-600/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المعلومات النفسية اللانهائية حسب الأقسام</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">موسوعة الوعي النفسي</h2>
            </div>
          </div>
          <button 
            onClick={() => { chimeService.playReassuranceChime(); onClose(); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDark ? 'hover:bg-white/10 text-stone-300' : 'hover:bg-stone-200 text-stone-700'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-3 border-b border-emerald-500/20 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  chimeService.playReassuranceChime();
                  setSelectedCategory(cat.id);
                  setCurrentFact(getRandomFact(cat.id === 'all' ? undefined : cat.id));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected 
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105' 
                    : isDark 
                      ? 'bg-black/30 text-stone-300 border-white/10 hover:bg-black/50' 
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Featured / Random Fact Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
            isDark ? 'bg-[#162D22] border-emerald-500/50' : 'bg-white border-emerald-500/30'
          }`}>
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={() => toggleSave(currentFact.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  savedFacts.includes(currentFact.id)
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : isDark ? 'bg-black/40 border-white/10 text-stone-400 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-600'
                }`}
                title="حفظ المعلومة"
              >
                <Bookmark className="w-4 h-4" fill={savedFacts.includes(currentFact.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleNextRandom}
                className="p-2.5 rounded-xl bg-emerald-600 text-white border border-emerald-500 hover:bg-emerald-500 transition-all flex items-center gap-1.5 text-xs font-bold"
                title="معلومة عشوائية أخرى"
              >
                <RefreshCw className="w-4 h-4 animate-spin-hover" />
                <span>معلومة أخرى</span>
              </button>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <span>{currentFact.emoji}</span>
                <span>تصنيف: {CATEGORIES.find(c => c.id === currentFact.category)?.label}</span>
              </div>

              <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                {currentFact.title}
              </h3>

              <p className={`text-sm sm:text-base leading-relaxed font-medium ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                {currentFact.insight}
              </p>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-black/30 border-emerald-500/20' : 'bg-emerald-50/60 border-emerald-600/20'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الأساس العلمي والنفسي:</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  {currentFact.scientificBasis}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-teal-950/40 border-teal-500/30' : 'bg-amber-50/60 border-amber-500/30'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>تطبيق عملي فوري:</span>
                </div>
                <p className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                  {currentFact.practicalTip}
                </p>
              </div>
            </div>
          </div>

          {/* List of all facts in category */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              <span>قائمة المعلومات النفسية المتاحة في هذا القسم ({filteredFacts.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFacts.map((fact) => {
                const isCurrent = fact.id === currentFact.id;
                const isSaved = savedFacts.includes(fact.id);
                return (
                  <div
                    key={fact.id}
                    onClick={() => {
                      chimeService.playReassuranceChime();
                      setCurrentFact(fact);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isCurrent 
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md' 
                        : isDark ? 'bg-black/20 border-white/10 hover:bg-black/40 text-stone-300' : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{fact.emoji}</span>
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold line-clamp-1">{fact.title}</h5>
                        <p className="text-xs opacity-80 line-clamp-2">{fact.insight}</p>
                      </div>
                    </div>
                    {isSaved && <Bookmark className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" />}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-500/20 flex items-center justify-between bg-black/20 text-xs">
          <span className="opacity-70">موسوعة نسمة حياة النفسية — متجددة باستمرار</span>
          <button
            onClick={() => { chimeService.playReassuranceChime(); onClose(); }}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
          >
            إغلاق الموسوعة
          </button>
        </div>

      </div>
    </div>
  );
};
