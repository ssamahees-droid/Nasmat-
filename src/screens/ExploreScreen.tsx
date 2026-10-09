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
  SlidersHorizontal
} from 'lucide-react';
import { storage } from '../services/storage';
import { ContentItem, ContentType } from '../types';

interface ExploreScreenProps {
  onOpenContent: (contentId: string) => void;
  onOpenAudioModal: (title: string, category: string, durationMinutes: number) => void;
  onOpenBooklet?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenWorkshopsHub?: () => void;
  onOpenPsychologicalER?: () => void;
  onOpenConflictWithoutWar?: () => void;
  onOpenHealingJourney?: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onOpenContent,
  onOpenAudioModal,
  onOpenBooklet,
  onNavigate,
  onOpenWorkshopsHub,
  onOpenPsychologicalER,
  onOpenConflictWithoutWar,
  onOpenHealingJourney
}) => {
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

  const contentTypeBadges: Record<ContentType, { label: string; icon: React.ReactNode }> = {
    article: { label: 'مقال', icon: <BookOpen className="w-3.5 h-3.5" /> },
    audio: { label: 'صوتيات', icon: <Volume2 className="w-3.5 h-3.5" /> },
    exercise: { label: 'تمرين', icon: <Activity className="w-3.5 h-3.5" /> },
    video: { label: 'فيديو', icon: <Video className="w-3.5 h-3.5" /> }
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 animate-fade-in text-right">
      
      {/* Breadcrumb Navigation */}
      {onNavigate && (
        <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-stone-400">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-emerald-400 transition-colors"
          >
            الرئيسية
          </button>
          <span>/</span>
          <span className="text-emerald-400 font-bold">تعلّم وطبّق — المقالات والتثقيف النفسي</span>
        </nav>
      )}

      {/* Header */}
      <div className="space-y-1.5 text-right">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
          تعلّم وطبّق — المعرفة النفسية الموثوقة 🌸
        </h1>
        <p className="text-xs sm:text-sm text-stone-300">
          مكتبة مقالات «نسمة حياة»، الجلسات الصوتية الإرشادية، والورش التطبيقية المبسطة
        </p>
      </div>

      {/* Featured Booklet Card */}
      {onOpenBooklet && (
        <section 
          onClick={onOpenBooklet}
          className="cursor-pointer bg-gradient-to-r from-[#1E2B22] via-[#17221A] to-[#121A15] border border-emerald-500/30 rounded-3xl p-5 shadow-sm hover:border-emerald-400 transition-all flex items-center justify-between group text-right"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
              📖
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400">دليل مبسط للصحة النفسية</div>
              <h2 className="font-extrabold text-sm sm:text-base text-white">
                كتيب «نسمة حياة» (12 فصلاً تفاعلياً)
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                «كثيرون يعيشون الحياة... وقليلون يستمتعون بها»
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold shrink-0 transition-colors">
            تصفح الكتيب
          </button>
        </section>
      )}

      {/* Workshops Section */}
      {onOpenWorkshopsHub && (
        <section className="bg-[#141C18] border border-white/10 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>🛠️ استوديو الورش التطبيقية (10 ورش عمل تفاعلية)</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">محاكاة عملية لمواجهة أزمات الحياة الزوجية والشخصية</p>
            </div>
            <button
              onClick={onOpenWorkshopsHub}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              عرض الكل ←
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {onOpenPsychologicalER && (
              <div
                onClick={onOpenPsychologicalER}
                className="cursor-pointer p-3 bg-black/30 hover:bg-black/50 border border-white/5 hover:border-emerald-500/40 rounded-2xl transition-all"
              >
                <span className="text-xl">🚨</span>
                <div className="text-xs font-bold text-white mt-1">غرفة الطوارئ النفسية</div>
                <div className="text-[11px] text-stone-400">تدريب عملي على 5 سيناريوهات حرجة</div>
              </div>
            )}
            {onOpenConflictWithoutWar && (
              <div
                onClick={onOpenConflictWithoutWar}
                className="cursor-pointer p-3 bg-black/30 hover:bg-black/50 border border-white/5 hover:border-emerald-500/40 rounded-2xl transition-all"
              >
                <span className="text-xl">🤝</span>
                <div className="text-xs font-bold text-white mt-1">خلاف بدون معركة</div>
                <div className="text-[11px] text-stone-400">مهارة تواصل أسرية دون هجوم أو انسحاب</div>
              </div>
            )}
            {onOpenHealingJourney && (
              <div
                onClick={onOpenHealingJourney}
                className="cursor-pointer p-3 bg-black/30 hover:bg-black/50 border border-white/5 hover:border-emerald-500/40 rounded-2xl transition-all"
              >
                <span className="text-xl">🌱</span>
                <div className="text-xs font-bold text-white mt-1">اتأذيت... إزاي أتعافى؟</div>
                <div className="text-[11px] text-stone-400">تحويل الأذى من سجن إلى وعي متزن</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Search Input (Page 8 Specification) */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن موضوع..."
          className="w-full py-3.5 pr-11 pl-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl text-sm focus:outline-hidden focus:border-[#355C4A] focus:bg-white transition-all shadow-xs"
        />
        <Search className="w-5 h-5 text-[#7D8F85] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#7D8F85] hover:text-[#26332D] bg-stone-200 px-2 py-0.5 rounded-full"
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
            className={`py-2 px-3.5 font-medium rounded-xl whitespace-nowrap transition-colors min-h-[38px] ${
              selectedType === type.id
                ? 'bg-[#355C4A] text-white shadow-xs'
                : 'bg-[#FAF7F0] text-[#52645B] border border-[#E8DDCC] hover:bg-white'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Categories Horizontal Scroller (Pages 8-10 Specification) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#52645B]">
          <span className="font-semibold text-[#26332D]">التصنيفات الرئيسية:</span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className="text-[#355C4A] hover:underline"
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
                  if (isSelected) {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  } else {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategory('all');
                  }
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#8FAF9A]/20 border-[#355C4A] text-[#355C4A] font-bold shadow-xs'
                    : 'bg-[#FAF7F0] border-[#E8DDCC] text-[#26332D] hover:bg-white'
                }`}
              >
                <span className="text-xl shrink-0">{cat.icon}</span>
                <span className="text-xs truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories (if category selected) */}
      {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
        <div className="p-3 bg-white/70 border border-[#E8DDCC] rounded-2xl animate-fade-in space-y-2">
          <div className="text-[11px] font-semibold text-[#52645B]">
            موضوعات فرعية في «{activeCategoryObj.name}»:
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`py-1 px-3 text-xs rounded-xl transition-colors ${
                selectedSubcategory === 'all'
                  ? 'bg-[#355C4A] text-white'
                  : 'bg-[#FAF7F0] text-[#52645B] border border-[#E8DDCC] hover:bg-white'
              }`}
            >
              الكل
            </button>
            {activeCategoryObj.subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`py-1 px-3 text-xs rounded-xl transition-colors ${
                  selectedSubcategory === sub
                    ? 'bg-[#355C4A] text-white font-medium'
                    : 'bg-[#FAF7F0] text-[#52645B] border border-[#E8DDCC] hover:bg-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Items Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#52645B]">
          <span>المواد المتاحة ({filteredContent.length})</span>
          <span>محتوى مراجع نفسياً</span>
        </div>

        {filteredContent.length === 0 ? (
          /* Empty state as specified on Page 33 */
          <div className="p-12 text-center bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl space-y-3">
            <div className="text-4xl">🌱</div>
            <h3 className="text-base font-bold text-[#26332D]">
              لسه بنجهز محتوى جديد ليك
            </h3>
            <p className="text-xs text-[#52645B] max-w-sm mx-auto">
              جرب تغيير عبارة البحث أو اختيار تصنيف آخر للاطلاع على المقالات والتمارين المتوفرة.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSelectedType('all');
              }}
              className="py-2 px-4 bg-[#355C4A] text-white text-xs font-semibold rounded-xl hover:bg-[#264235] transition-colors"
            >
              عرض جميع المحتويات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredContent.map(item => {
              const isFav = savedFavorites.includes(item.id);
              const badge = contentTypeBadges[item.contentType] || contentTypeBadges.article;
              return (
                <article
                  key={item.id}
                  onClick={() => onOpenContent(item.id)}
                  className="cursor-pointer bg-[#FAF7F0] hover:bg-white border border-[#E8DDCC] rounded-3xl p-5 transition-all hover:shadow-md hover:border-[#8FAF9A]/60 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top unboxed metadata line */}
                    <div className="flex items-center justify-between text-xs text-[#52645B] mb-2.5">
                      <div className="flex items-center gap-1.5 text-[#355C4A] font-semibold">
                        {badge.icon}
                        <span>{badge.label}</span>
                        <span aria-hidden="true" className="text-[#D5CEBE]">·</span>
                        <span className="text-[#52645B] font-normal">{item.subCategory || item.category}</span>
                      </div>
                      
                      <button
                        onClick={(e) => handleToggleFavorite(e, item.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isFav ? 'text-rose-600 bg-rose-50' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        aria-label="حفظ في المحفوظات"
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <h2 className="text-base font-bold text-[#26332D] group-hover:text-[#355C4A] transition-colors leading-snug mb-2">
                      {item.title}
                    </h2>

                    <p className="text-xs text-[#52645B] leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8DDCC]/70 flex items-center justify-between text-xs text-[#7D8F85]">
                    <span>{item.duration}</span>
                    {item.contentType === 'audio' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAudioModal(item.title, item.category, 5);
                        }}
                        className="inline-flex items-center gap-1 text-[#355C4A] font-bold hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع</span>
                      </button>
                    ) : (
                      <span className="text-[#355C4A] font-medium group-hover:underline">
                        قراءة المقال ←
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
