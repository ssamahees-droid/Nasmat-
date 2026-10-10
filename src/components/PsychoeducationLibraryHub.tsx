import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  Filter, 
  Check, 
  Heart,
  SlidersHorizontal,
  Compass,
  X
} from 'lucide-react';
import { 
  getPsychoeducationTracks, 
  getPsychoeducationTopics, 
  searchPsychoeducationTopics 
} from '../data/psychoeducationLibraryData';
import { PsychoeducationTopic, PsychoeducationTrack } from '../types';
import { PsychoeducationTopicModal } from './PsychoeducationTopicModal';

interface PsychoeducationLibraryHubProps {
  onNavigateToTool?: (toolId: string) => void;
  className?: string;
}

export const PsychoeducationLibraryHub: React.FC<PsychoeducationLibraryHubProps> = ({
  onNavigateToTool,
  className = ''
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<PsychoeducationTopic | null>(null);

  // Bookmarks from localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nesma_library_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const tracks = useMemo(() => getPsychoeducationTracks(), []);
  const allTopics = useMemo(() => getPsychoeducationTopics(), []);

  // Filter topics
  const filteredTopics = useMemo(() => {
    let result = allTopics;

    // Bookmarks only filter
    if (showBookmarksOnly) {
      result = result.filter(t => bookmarks.includes(t.id));
    }

    // Track filter
    if (selectedTrackId !== 'all') {
      result = result.filter(t => t.trackId === selectedTrackId);
    }

    // Tag filter
    if (selectedTag !== 'all') {
      result = result.filter(t => t.tags.includes(selectedTag));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.introduction.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.scientificExplanation.summary.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allTopics, selectedTrackId, selectedTag, searchQuery, showBookmarksOnly, bookmarks]);

  const toggleBookmark = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    try {
      const exists = bookmarks.includes(topicId);
      const updated = exists ? bookmarks.filter(id => id !== topicId) : [...bookmarks, topicId];
      setBookmarks(updated);
      localStorage.setItem('nesma_library_bookmarks', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving bookmark:', err);
    }
  };

  // Common emotional status tags
  const POPULAR_TAGS = [
    'المشاعر', 
    'القلق', 
    'الغضب', 
    'الحدود الشخصية', 
    'الاحتراق النفسي', 
    'التعاطف مع الذات', 
    'أنماط التعلق', 
    'الأدوية النفسية', 
    'طوارئ نفسية'
  ];

  const handleOpenNext = () => {
    if (!activeTopic) return;
    const currentIndex = allTopics.findIndex(t => t.id === activeTopic.id);
    if (currentIndex >= 0 && currentIndex < allTopics.length - 1) {
      setActiveTopic(allTopics[currentIndex + 1]);
    }
  };

  const handleOpenPrev = () => {
    if (!activeTopic) return;
    const currentIndex = allTopics.findIndex(t => t.id === activeTopic.id);
    if (currentIndex > 0) {
      setActiveTopic(allTopics[currentIndex - 1]);
    }
  };

  return (
    <section className={`space-y-6 text-right font-cairo ${className}`}>
      
      {/* Library Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F2EFEB] dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 shadow-[6px_6px_0_#111113] relative overflow-hidden">
        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <div className="font-jetbrains text-[10px] sm:text-xs font-bold text-[#E36E4D] uppercase tracking-wider">
            MOUBADARA_01 · PSYCHOEDUCATION_LIBRARY
          </div>
          <h2 className="font-cairo font-black text-2xl sm:text-4xl text-[#111113] dark:text-[#F2EFEB] leading-tight">
            مكتبة التثقيف النفسي المتكاملة 🌿
          </h2>
          <p className="text-xs sm:text-sm text-[#111113]/80 dark:text-[#F2EFEB]/80 leading-relaxed">
            ٣٠ موضوعاً أصلياً وموثقاً في ٦ مسارات إنسانية؛ لشرح ما يجري بداخلك بتبسيط دقيق، وتفكيك التشوهات الفكرية، واكتساب مهارات عملية وبدائل مرنة تناسب وتيرتك دون أحكام.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-jetbrains text-[#111113]/70 dark:text-[#F2EFEB]/70">
            <span className="flex items-center gap-1 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#E36E4D]" />
              <span>30 موضوعاً مكتملاً</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-bold">
              <Compass className="w-3.5 h-3.5 text-[#E36E4D]" />
              <span>6 مسارات متدرجة</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مراجع علمية معتمدة (WHO, APA, NICE)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في موضوعات المكتبة (مثال: نوبات الهلع، الاحتراق، التفكير الكارثي، الأدوية، الحدود)..."
            className="w-full py-3.5 pr-11 pl-10 bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-2xl text-xs sm:text-sm text-[#111113] dark:text-[#F2EFEB] placeholder-[#111113]/40 dark:placeholder-white/40 focus:outline-hidden focus:shadow-[3px_3px_0_#E36E4D] transition-all"
          />
          <Search className="w-5 h-5 text-[#E36E4D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#111113]/60 hover:text-[#111113] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Six Tracks Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => {
              setSelectedTrackId('all');
              setShowBookmarksOnly(false);
            }}
            className={`px-3.5 py-2 rounded-xl border-[1.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrackId === 'all' && !showBookmarksOnly
                ? 'bg-[#111113] text-white border-[#111113] shadow-[2px_2px_0_#E36E4D]'
                : 'bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] border-[#111113]/20 hover:border-[#111113]'
            }`}
          >
            جميع المسارات ({allTopics.length})
          </button>

          {tracks.map((track) => {
            const isSelected = selectedTrackId === track.id && !showBookmarksOnly;
            return (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrackId(track.id);
                  setShowBookmarksOnly(false);
                }}
                className={`px-3.5 py-2 rounded-xl border-[1.5px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#111113] text-white border-[#111113] shadow-[2px_2px_0_#E36E4D]'
                    : 'bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] border-[#111113]/20 hover:border-[#111113]'
                }`}
              >
                <span>{track.icon}</span>
                <span>{track.title}</span>
                <span className="font-jetbrains text-[10px] opacity-70">({track.topicsCount})</span>
              </button>
            );
          })}

          {/* Bookmarks Filter */}
          <button
            onClick={() => setShowBookmarksOnly(true)}
            className={`px-3.5 py-2 rounded-xl border-[1.5px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              showBookmarksOnly
                ? 'bg-[#E36E4D] text-white border-[#111113] shadow-[2px_2px_0_#111113]'
                : 'bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] border-[#111113]/20 hover:border-[#111113]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>المحفوظات ({bookmarks.length})</span>
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-[#111113]/50 dark:text-[#F2EFEB]/50 font-bold shrink-0">وسوم سريعة:</span>
          {POPULAR_TAGS.map((tag) => {
            const isTagSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagSelected ? 'all' : tag)}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  isTagSelected
                    ? 'bg-[#E36E4D] text-white border-[#111113] font-bold'
                    : 'bg-white/80 dark:bg-[#202026] text-[#111113]/70 dark:text-[#F2EFEB]/70 border-[#111113]/15 hover:border-[#111113]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

      </div>

      {/* Topics Counter Bar */}
      <div className="flex items-center justify-between text-xs text-[#111113]/70 dark:text-[#F2EFEB]/70 pt-2 border-t border-[#111113]/10">
        <div>
          <span>الموضوعات المعروضة: </span>
          <span className="font-jetbrains font-bold text-[#E36E4D]">{filteredTopics.length}</span>
          <span> من أصل 30 موضوعاً</span>
        </div>
        {(selectedTrackId !== 'all' || selectedTag !== 'all' || searchQuery || showBookmarksOnly) && (
          <button
            onClick={() => {
              setSelectedTrackId('all');
              setSelectedTag('all');
              setSearchQuery('');
              setShowBookmarksOnly(false);
            }}
            className="text-[#E36E4D] hover:underline font-bold cursor-pointer"
          >
            إعادة تعيين الفلاتر ↺
          </button>
        )}
      </div>

      {/* Grid of Topics (Cards in Variation 6 style) */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredTopics.map((topic) => {
            const isFav = bookmarks.includes(topic.id);
            return (
              <article
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-2xl p-5 shadow-[4px_4px_0_#111113] dark:shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#111113] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  
                  {/* Track kicker & Bookmark */}
                  <div className="flex items-center justify-between">
                    <span className="font-jetbrains text-[10px] text-[#E36E4D] font-bold tracking-wider uppercase">
                      المسار {topic.trackNumber} · الموضوع {topic.topicNumber}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(e, topic.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isFav 
                          ? 'bg-[#E36E4D] text-white border-[#111113]' 
                          : 'bg-[#F2EFEB] dark:bg-[#202026] text-[#111113]/50 border-transparent hover:border-[#111113]'
                      }`}
                      title={isFav ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-cairo font-bold text-base sm:text-lg text-[#111113] dark:text-[#F2EFEB] group-hover:text-[#E36E4D] transition-colors leading-snug">
                    {topic.title}
                  </h3>

                  {/* Subtitle / Teaser */}
                  <p className="text-xs text-[#111113]/70 dark:text-[#F2EFEB]/70 line-clamp-2 leading-relaxed">
                    {topic.subtitle}
                  </p>

                  {/* Exercise Teaser */}
                  <div className="p-2.5 rounded-xl bg-[#F2EFEB] dark:bg-[#202026] border border-[#111113]/10 text-[11px] text-[#111113]/80 dark:text-[#F2EFEB]/80">
                    <span className="font-bold text-[#E36E4D]">تمرين عملي: </span>
                    <span>{topic.practicalExercise.title}</span>
                  </div>

                </div>

                {/* Card Footer: Metadata & Read button */}
                <div className="pt-4 mt-4 border-t border-[#111113]/10 flex items-center justify-between text-xs">
                  <span className="font-jetbrains text-[11px] text-[#111113]/60 dark:text-[#F2EFEB]/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E36E4D]" />
                    <span>{topic.estimatedReadTimeMinutes} د قراءة</span>
                  </span>

                  <span className="font-bold text-xs text-[#111113] dark:text-white group-hover:text-[#E36E4D] flex items-center gap-1 transition-colors">
                    <span>قراءة الموضوع</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>

              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <h4 className="font-bold text-base">لم نعثر على موضوع يطابق بحثك</h4>
          <p className="text-xs text-[#111113]/60 dark:text-[#F2EFEB]/60">
            جرب كلمات بحث أخرى أو أعد تعيين الفلاتر لتصفح موضوعات المكتبة الـ 30.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTrackId('all');
              setSelectedTag('all');
              setShowBookmarksOnly(false);
            }}
            className="px-4 py-2 bg-[#111113] text-white rounded-full text-xs font-bold"
          >
            عرض كل الموضوعات
          </button>
        </div>
      )}

      {/* Reader Modal */}
      <PsychoeducationTopicModal
        topic={activeTopic}
        isOpen={!!activeTopic}
        onClose={() => setActiveTopic(null)}
        onNavigateToTool={onNavigateToTool}
        onOpenNextTopic={handleOpenNext}
        onOpenPrevTopic={handleOpenPrev}
      />

    </section>
  );
};
