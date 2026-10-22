import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  BookOpen, 
  Volume2, 
  Activity, 
  Video, 
  Check, 
  Sparkles,
  SlidersHorizontal,
  Compass,
  Layers
} from 'lucide-react';
import { storage } from '../services/storage';
import { ContentItem, ContentType } from '../types';
import { PsychoeducationLibraryHub } from '../components/PsychoeducationLibraryHub';

import { ScreenBannerHeader } from '../components/ScreenBannerHeader';

interface ExploreScreenProps {
  onOpenContent: (contentId: string) => void;
  onOpenAudioModal: (title: string, category: string, durationMinutes: number) => void;
  onOpenBooklet?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenAllScreens?: () => void;
  onOpenWorkshopsHub?: () => void;
  onOpenPsychologicalER?: () => void;
  onOpenConflictWithoutWar?: () => void;
  onOpenHealingJourney?: () => void;
  onOpenFeker?: () => void;
  onOpenBatteryCheck?: () => void;
  onOpenEmotionCompass?: () => void;
  onOpenUntangleKnot?: () => void;
  onOpenTranslateFeelings?: () => void;
  onOpenEmergencyHelp?: () => void;
  onOpenMoodKitchen?: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onOpenContent,
  onOpenAudioModal,
  onOpenBooklet,
  onNavigate,
  onOpenWorkshopsHub,
  onOpenPsychologicalER,
  onOpenConflictWithoutWar,
  onOpenHealingJourney,
  onOpenFeker,
  onOpenBatteryCheck,
  onOpenEmotionCompass,
  onOpenUntangleKnot,
  onOpenTranslateFeelings,
  onOpenEmergencyHelp,
  onOpenMoodKitchen,
  onOpenAllScreens
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'booklet_and_workshops'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(storage.getFavorites());

  const categories = storage.getCategories();
  const allContent = storage.getContent().filter(c => c.reviewStatus === 'published');

  const activeCategoryObj = useMemo(() => {
    return categories.find(c => c.id === selectedCategory);
  }, [categories, selectedCategory]);

  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Subcategory filter
      if (selectedSubcategory !== 'all' && item.subCategory !== selectedSubcategory) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && item.contentType !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSub = item.subCategory ? item.subCategory.toLowerCase().includes(q) : false;
        return matchesTitle || matchesDesc || matchesSub;
      }
      return true;
    });
  }, [allContent, selectedCategory, selectedSubcategory, selectedType, searchQuery]);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    storage.toggleFavorite(id);
    setSavedFavorites(storage.getFavorites());
  };

  const handleNavigateToTool = (toolId: string) => {
    switch (toolId) {
      case 'breathe':
        if (onNavigate) onNavigate('breathe');
        break;
      case 'feker':
        if (onOpenFeker) onOpenFeker();
        else if (onNavigate) onNavigate('feker');
        break;
      case 'battery':
        if (onOpenBatteryCheck) onOpenBatteryCheck();
        break;
      case 'compass':
        if (onOpenEmotionCompass) onOpenEmotionCompass();
        break;
      case 'knot':
        if (onOpenUntangleKnot) onOpenUntangleKnot();
        break;
      case 'translate':
        if (onOpenTranslateFeelings) onOpenTranslateFeelings();
        break;
      case 'rescue':
        if (onNavigate) onNavigate('rescue');
        break;
      case 'emergency':
        if (onOpenEmergencyHelp) onOpenEmergencyHelp();
        break;
      default:
        break;
    }
  };

  const contentTypeBadges: Record<ContentType, { label: string; icon: React.ReactNode }> = {
    article: { label: 'مقال', icon: <BookOpen className="w-3.5 h-3.5" /> },
    audio: { label: 'صوتيات', icon: <Volume2 className="w-3.5 h-3.5" /> },
    exercise: { label: 'تمرين', icon: <Activity className="w-3.5 h-3.5" /> },
    video: { label: 'فيديو', icon: <Video className="w-3.5 h-3.5" /> }
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-fade-in text-right font-cairo">
      
      {/* Screen 5 Identifier Header */}
      {onNavigate && (
        <ScreenBannerHeader 
          screenId="explore" 
          onNavigate={onNavigate} 
          onOpenAllScreens={onOpenAllScreens} 
        />
      )}

      {/* Top Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[1.5px] border-[#13251E]/15 pb-5">
        <div className="space-y-1">
          <div className="font-jetbrains text-[10px] text-[#D98F83] uppercase tracking-wider font-bold">
            // EXPLORE_AND_LEARN
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#13251E] dark:text-[#F7F3E9]">
            تعلّم وطبّق — المعرفة النفسية الموثوقة 🌸
          </h1>
          <p className="text-xs sm:text-sm text-[#13251E]/70 dark:text-[#F7F3E9]/70">
            مكتبة التثقيف النفسي المتكاملة، فصول كتيب نسمة حياة، واستوديو الورش التطبيقية
          </p>
        </div>

        {/* Dual Hub Segmented Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-[#1C1C22] border border-[#174C3C]/20 dark:border-white/20 shadow-sm text-xs font-bold shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-[#13251E] text-white dark:bg-[#F7F3E9] dark:text-[#13251E] shadow-xs'
                : 'text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:text-[#13251E]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>مكتبة التثقيف النفسي (30)</span>
          </button>
          <button
            onClick={() => setActiveTab('booklet_and_workshops')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'booklet_and_workshops'
                ? 'bg-[#13251E] text-white dark:bg-[#F7F3E9] dark:text-[#13251E] shadow-xs'
                : 'text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:text-[#13251E]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الكتيب والورش (12+10)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Full Psychoeducation Library (30 Topics, 6 Tracks) */}
      {activeTab === 'library' && (
        <PsychoeducationLibraryHub 
          onNavigateToTool={handleNavigateToTool}
        />
      )}

      {/* Tab 2: Existing Booklet, Workshops, and Articles Archive */}
      {activeTab === 'booklet_and_workshops' && (
        <div className="space-y-8 animate-fade-in">

          {/* Mood Kitchen Featured Unit Card */}
          {onOpenMoodKitchen && (
            <section 
              onClick={onOpenMoodKitchen}
              className="cursor-pointer bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-500/30 rounded-3xl p-6 shadow-sm hover:translate-y-[-2px] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shrink-0">
                  🍲
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">وحدة بحثية جديدة كلياً</div>
                  <h2 className="font-black text-base sm:text-lg text-[#13251E] dark:text-[#F7F3E9]">
                    مطبخ المزاج — غذاء يدعم أمعاءك وعافيتك النفسية
                  </h2>
                  <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70 mt-0.5">
                    «خطوات صغيرة لجسمك ومزاجك، بلا وعود علاجية زائفة»
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-sm">
                استكشف مطبخ المزاج 🍲
              </button>
            </section>
          )}
          
          {/* Featured Booklet Card */}
          {onOpenBooklet && (
            <section 
              onClick={onOpenBooklet}
              className="cursor-pointer bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/20 rounded-3xl p-6 shadow-sm hover:translate-y-[-2px] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#D98F83]/15 text-[#D98F83] border border-[#174C3C]/20 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shrink-0">
                  📖
                </div>
                <div>
                  <div className="text-xs font-bold text-[#D98F83]">إصدار المبادرة التفاعلي الرسمي</div>
                  <h2 className="font-black text-base sm:text-lg text-[#13251E] dark:text-[#F7F3E9]">
                    كتيب «نسمة حياة» — 12 فصلاً تفاعلياً للصحة النفسية
                  </h2>
                  <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70 mt-0.5">
                    «كثيرون يعيشون الحياة... وقليلون يستمتعون بها»
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-[#13251E] text-white dark:bg-[#F7F3E9] dark:text-[#13251E] rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border border-[#13251E]">
                تصفح الكتيب كاملاً 📖
              </button>
            </section>
          )}

          {/* Workshops Section */}
          {onOpenWorkshopsHub && (
            <section className="bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/20 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#13251E]/10">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#13251E] dark:text-[#F7F3E9] flex items-center gap-2">
                    <span>🛠️ استوديو الورش التطبيقية (10 ورش عمل تفاعلية)</span>
                  </h2>
                  <p className="text-xs text-[#13251E]/60 dark:text-[#F7F3E9]/60 mt-0.5">محاكاة عملية لمواجهة أزمات الحياة الزوجية والشخصية</p>
                </div>
                <button
                  onClick={onOpenWorkshopsHub}
                  className="text-xs font-bold text-[#D98F83] hover:underline cursor-pointer"
                >
                  عرض كافة الورش الـ 10 ←
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {onOpenPsychologicalER && (
                  <div
                    onClick={onOpenPsychologicalER}
                    className="cursor-pointer p-4 bg-[#F7F3E9] dark:bg-[#1B342A] border border-[#174C3C]/20/20 hover:border-[#13251E] rounded-2xl transition-all space-y-1.5"
                  >
                    <span className="text-2xl">🚨</span>
                    <div className="text-xs font-bold text-[#13251E] dark:text-white">غرفة الطوارئ النفسية</div>
                    <div className="text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60">تدريب عملي على 5 سيناريوهات حرجة</div>
                  </div>
                )}
                {onOpenConflictWithoutWar && (
                  <div
                    onClick={onOpenConflictWithoutWar}
                    className="cursor-pointer p-4 bg-[#F7F3E9] dark:bg-[#1B342A] border border-[#174C3C]/20/20 hover:border-[#13251E] rounded-2xl transition-all space-y-1.5"
                  >
                    <span className="text-2xl">🤝</span>
                    <div className="text-xs font-bold text-[#13251E] dark:text-white">خلاف بدون معركة</div>
                    <div className="text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60">مهارة تواصل أسرية دون هجوم أو انسحاب</div>
                  </div>
                )}
                {onOpenHealingJourney && (
                  <div
                    onClick={onOpenHealingJourney}
                    className="cursor-pointer p-4 bg-[#F7F3E9] dark:bg-[#1B342A] border border-[#174C3C]/20/20 hover:border-[#13251E] rounded-2xl transition-all space-y-1.5"
                  >
                    <span className="text-2xl">🌱</span>
                    <div className="text-xs font-bold text-[#13251E] dark:text-white">اتأذيت... إزاي أتعافى؟</div>
                    <div className="text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60">تحويل الأذى من سجن إلى وعي متزن</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المقالات والجلسات الصوتية..."
              className="w-full py-3.5 pr-11 pl-4 bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/20 rounded-2xl text-xs sm:text-sm text-[#13251E] dark:text-[#F7F3E9] focus:outline-hidden focus:shadow-xs transition-all"
            />
            <Search className="w-5 h-5 text-[#D98F83] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-900 bg-stone-200 px-2 py-0.5 rounded-full"
              >
                مسح
              </button>
            )}
          </div>

          {/* Content Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'article', label: 'مقالات 📖' },
              { id: 'audio', label: 'صوتيات 🎧' },
              { id: 'exercise', label: 'تمارين 🧘' },
              { id: 'video', label: 'فيديوهات 🎬' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`py-2 px-3.5 font-bold rounded-xl whitespace-nowrap transition-colors min-h-[38px] border-[1.5px] cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-[#13251E] text-white border-[#13251E]'
                    : 'bg-white dark:bg-[#14271F] text-[#13251E]/70 dark:text-[#F7F3E9]/70 border-[#13251E]/20 hover:border-[#13251E]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Categories Horizontal Scroller */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70">
              <span className="font-bold">التصنيفات الرئيسية:</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  className="text-[#D98F83] hover:underline font-bold"
                >
                  إلغاء التحديد
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(isSelected ? 'all' : cat.id);
                      setSelectedSubcategory('all');
                    }}
                    className={`p-3 rounded-2xl border-[1.5px] transition-all text-right flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#13251E] text-white border-[#13251E] shadow-xs'
                        : 'bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] border-[#13251E]/20 hover:border-[#13251E]'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-xs font-bold truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if category selected) */}
          {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-stone-400 font-bold shrink-0">تصنيف فرعي:</span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`py-1 px-3 rounded-full text-[11px] font-bold ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#D98F83] text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                الكل
              </button>
              {activeCategoryObj.subcategories.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`py-1 px-3 rounded-full text-[11px] font-bold ${
                    selectedSubcategory === sub
                      ? 'bg-[#D98F83] text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Content Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70">
              <span>المحتوى المتاح ({filteredContent.length})</span>
            </div>

            {filteredContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContent.map((item) => {
                  const isFav = savedFavorites.includes(item.id);
                  const badge = contentTypeBadges[item.contentType] || contentTypeBadges.article;

                  return (
                    <article
                      key={item.id}
                      onClick={() => onOpenContent(item.id)}
                      className="p-5 rounded-2xl bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/20 shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col justify-between group space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#D98F83] flex items-center gap-1">
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                          <button
                            onClick={(e) => handleToggleFavorite(e, item.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFav ? 'bg-[#D98F83] text-white border-[#13251E]' : 'bg-[#F7F3E9] text-stone-400 border-transparent hover:border-[#13251E]'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                          </button>
                        </div>

                        <h3 className="font-bold text-base text-[#13251E] dark:text-white group-hover:text-[#D98F83] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#13251E]/10 flex items-center justify-between text-[11px] text-[#13251E]/60 dark:text-[#F7F3E9]/60">
                        <span>⏱ {item.duration}</span>
                        <span className="font-bold text-[#13251E] dark:text-white group-hover:text-[#D98F83]">فتح المحتوى ←</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#14271F] border border-[#174C3C]/20 text-center space-y-2">
                <div className="text-2xl">🌱</div>
                <div className="font-bold text-sm">لا توجد نتائج مطابقة لبحثك</div>
                <div className="text-xs text-stone-500">جرب البحث بكلمات أخرى أو تصفح موضوعات مكتبة التثقيف النفسي الـ 30.</div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

