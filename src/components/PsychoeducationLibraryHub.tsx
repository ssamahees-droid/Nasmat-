/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  X,
  ExternalLink,
  Award,
  Layers,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { 
  getPsychoeducationTracks, 
  getPsychoeducationTopics, 
  searchPsychoeducationTopics 
} from '../data/psychoeducationLibraryData';
import { 
  PSYCHOEDUCATION_BOOKS, 
  VALIDATED_ASSESSMENT_SCALES, 
  PSYCHOEDUCATION_PATHS 
} from '../data/psychoeducationBooksData';
import { FULL_TEXT_BOOKS } from '../data/fullTextBooksData';
import { SCIENTIFIC_REFERENCES } from '../data/scientificReferencesData';
import { 
  PsychoeducationTopic, 
  PsychoeducationTrack, 
  PsychoeducationBook, 
  ValidatedAssessmentScale, 
  PsychoeducationPath,
  FullTextPsychoeducationBook,
  ScientificReference
} from '../types';
import { PsychoeducationTopicModal } from './PsychoeducationTopicModal';
import { PsychoeducationBookModal } from './PsychoeducationBookModal';
import { ValidatedAssessmentScaleModal } from './ValidatedAssessmentScaleModal';
import { FullBookReaderModal } from './FullBookReaderModal';
import { ScientificReferenceModal } from './ScientificReferenceModal';

interface PsychoeducationLibraryHubProps {
  onNavigateToTool?: (toolId: string) => void;
  onOpenEmergencyHelp?: () => void;
  className?: string;
}

export const PsychoeducationLibraryHub: React.FC<PsychoeducationLibraryHubProps> = ({
  onNavigateToTool,
  onOpenEmergencyHelp,
  className = ''
}) => {
  // Main Sub-Tab: 'full_books' | 'books' | 'scientific_refs' | 'topics' | 'scales' | 'paths'
  const [activeSubTab, setActiveSubTab] = useState<'full_books' | 'books' | 'scientific_refs' | 'topics' | 'scales' | 'paths'>('full_books');

  const [selectedTrackId, setSelectedTrackId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Modals state
  const [activeTopic, setActiveTopic] = useState<PsychoeducationTopic | null>(null);
  const [selectedBook, setSelectedBook] = useState<PsychoeducationBook | null>(null);
  const [selectedFullBook, setSelectedFullBook] = useState<FullTextPsychoeducationBook | null>(null);
  const [selectedScale, setSelectedScale] = useState<ValidatedAssessmentScale | null>(null);
  const [selectedScientificRef, setSelectedScientificRef] = useState<ScientificReference | null>(null);


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
  const allBooks = PSYCHOEDUCATION_BOOKS;
  const allScales = VALIDATED_ASSESSMENT_SCALES;
  const allPaths = PSYCHOEDUCATION_PATHS;

  // Filter topics
  const filteredTopics = useMemo(() => {
    let result = allTopics;

    if (showBookmarksOnly) {
      result = result.filter(t => bookmarks.includes(t.id));
    }

    if (selectedTrackId !== 'all') {
      result = result.filter(t => t.trackId === selectedTrackId);
    }

    if (selectedTag !== 'all') {
      result = result.filter(t => t.tags.includes(selectedTag));
    }

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

  const allFullBooks = FULL_TEXT_BOOKS;

  // Filter full-text books
  const filteredFullBooks = useMemo(() => {
    let result = allFullBooks;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        (b.originalTitle && b.originalTitle.toLowerCase().includes(q)) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.summary.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allFullBooks, searchQuery]);

  const allScientificRefs = SCIENTIFIC_REFERENCES;

  // Filter scientific references
  const filteredScientificRefs = useMemo(() => {
    let result = allScientificRefs;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.originalTitle.toLowerCase().includes(q) ||
        r.organization.toLowerCase().includes(q) ||
        r.scopeAndRelevance.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q) ||
        r.keyClinicalFindings.some(f => f.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allScientificRefs, searchQuery]);

  const [selectedBookCategory, setSelectedBookCategory] = useState<string>('all');

  // Filter reference books
  const filteredBooks = useMemo(() => {
    let result = allBooks;

    if (selectedBookCategory !== 'all') {
      result = result.filter(b => b.category === selectedBookCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        (b.originalTitle && b.originalTitle.toLowerCase().includes(q)) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.summaryArabic.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allBooks, selectedBookCategory, searchQuery]);

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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F3E9] dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <div className="font-jetbrains text-[10px] sm:text-xs font-bold text-[#D98F83] uppercase tracking-wider">
            MOUBADARA_01 · PSYCHOEDUCATION_LIBRARY_V2
          </div>
          <h2 className="font-cairo font-black text-2xl sm:text-4xl text-[#13251E] dark:text-[#F7F3E9] leading-tight">
            مكتبة الكتب والتثقيف النفسي المعتمدة 📚🌿
          </h2>
          <p className="text-xs sm:text-sm text-[#13251E]/80 dark:text-[#F7F3E9]/80 leading-relaxed">
            قسم متكامل يضم كتباً كاملة مع قارئ متطور داخلي، أدلة منظمة الصحة العالمية (WHO)، وإرشادات NICE السريرية، ومراجع CBT، ومقاييس PHQ-9 و GAD-7 الموثقة.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-jetbrains text-[#13251E]/70 dark:text-[#F7F3E9]/70">
            <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{allFullBooks.length} كتب كاملة مع قارئ متطور</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{allScientificRefs.length} مراجع علمية وسريرية معتمدة</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#D98F83]" />
              <span>{allBooks.length} ملخصات ومواد تثقيفية</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sub-Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#E2EFE7]/80 dark:bg-stone-800/60 rounded-2xl border border-[#D5DED7] dark:border-stone-700 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('full_books')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeSubTab === 'full_books'
              ? 'bg-[#174F3F] text-white shadow-xs'
              : 'text-[#515B55] dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>الكتب الكاملة للقراءة ({allFullBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scientific_refs')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeSubTab === 'scientific_refs'
              ? 'bg-[#174F3F] text-white shadow-xs'
              : 'text-[#515B55] dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>المراجع العلمية والسريرية ({allScientificRefs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('books')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeSubTab === 'books'
              ? 'bg-[#174F3F] text-white shadow-xs'
              : 'text-[#515B55] dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#D98F83]" />
          <span>الملخصات والمواد التثقيفية ({allBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('topics')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeSubTab === 'topics'
              ? 'bg-[#174F3F] text-white shadow-xs'
              : 'text-[#515B55] dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/60'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-400" />
          <span>المقالات والمواضيع ({allTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scales')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeSubTab === 'scales'
              ? 'bg-[#174F3F] text-white shadow-xs'
              : 'text-[#515B55] dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>المقاييس الموثقة (PHQ-9 / GAD-7)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('paths')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
            activeSubTab === 'paths'
              ? 'bg-[#174F3F] text-white shadow-xs'
              : 'text-[#515B55] dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/60'
          }`}
        >
          <Compass className="w-4 h-4 text-rose-400" />
          <span>المسارات التثقيفية الموجهة</span>
        </button>
      </div>


      {/* Global Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في الكتب والمراجع والمقالات (مثال: منظمة الصحة العالمية، NICE، الاكتئاب، الحدود، PHQ-9)..."
          className="w-full py-3.5 pr-11 pl-10 bg-white dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-white/20 rounded-2xl text-xs sm:text-sm text-[#13251E] dark:text-[#F7F5EF] placeholder-[#13251E]/40 dark:placeholder-white/40 focus:outline-hidden focus:shadow-xs transition-all"
        />
        <Search className="w-5 h-5 text-[#D98F83] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#13251E]/60 hover:text-[#13251E] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* =========================================================================
         TAB 0: FULL-TEXT READABLE BOOKS (مكتبة الكتب الكاملة للقراءة)
         ========================================================================= */}
      {activeSubTab === 'full_books' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>مكتبة الكتب النفسية الكاملة (قراءة شاملة كاملة داخل التطبيق)</span>
            </div>
            <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              نصوص كاملة حقيقية موثقة ومجتازة لفحص الترخيص المفتوح
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredFullBooks.map((fBook) => (
              <div
                key={fBook.id}
                onClick={() => setSelectedFullBook(fBook)}
                className="p-6 rounded-3xl bg-white dark:bg-[#14271F] border-2 border-[#D5DED7] dark:border-stone-700/80 shadow-md hover:border-[#174F3F] dark:hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between space-y-5 group relative overflow-hidden"
              >
                {/* Decorative Top Bar */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${fBook.coverGradient} absolute top-0 inset-x-0`} />

                <div className="space-y-3 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#E2EFE7] dark:bg-emerald-950 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {fBook.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {fBook.isFullTextVerified ? (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          دليل رسمي موثق (WHO)
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                          ⏳ قيد التوثيق المكتبي المستقل
                        </span>
                      )}
                      <span className="text-[10px] text-stone-500 font-bold">
                        {fBook.totalChaptersCount} فصول · {fBook.totalReadingTimeMinutes} دقيقة
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-[#23785B] dark:text-emerald-400 block mb-1 uppercase tracking-wider">
                      {fBook.categoryLabel}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-white group-hover:text-[#23785B] transition-colors leading-snug font-tajawal">
                      {fBook.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      بقلم: {fBook.authors.join('، ')} ({fBook.publisher} - {fBook.publicationYear})
                    </p>
                  </div>

                  <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed line-clamp-3 font-medium">
                    {fBook.summary}
                  </p>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-[11px] space-y-1">
                    <div className="font-bold text-stone-700 dark:text-stone-300">من ينفعهم هذا الكتاب؟</div>
                    <div className="text-stone-500 dark:text-stone-400 line-clamp-2">{fBook.whoIsThisFor}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#174F3F] dark:text-emerald-400">
                  <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>افتح القارئ المتقدم وابدأ القراءة الآن 📖</span>
                  </span>
                  
                  {fBook.pdfDownloadUrl && (
                    <a
                      href={fBook.pdfDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors text-[10px] font-bold flex items-center gap-1"
                      title="فتح أو تنزيل ملف PDF العربي الرسمي الأصلي (132 صفحة)"
                    >
                      <span>PDF الأصلي</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB: SCIENTIFIC & CLINICAL REFERENCES (المراجع العلمية والسريرية المعتمدة)
         ========================================================================= */}
      {activeSubTab === 'scientific_refs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5 text-emerald-950 dark:text-emerald-200 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="block font-black text-sm">أدلة منظمة الصحة العالمية (WHO) والمراجع السريرية المعتمدة</span>
                <span className="text-[11px] font-medium opacity-90">
                  مراجع علمية وأدلة توجيهية تم الاستناد إليها في تدقيق التمارين والتدخلات النفسية داخل نسمة حياة، مع الروابط الرسمية بمستودع WHO IRIS.
                </span>
              </div>
            </div>
          </div>

          {/* Scientific References Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredScientificRefs.map((ref) => (
              <div
                key={ref.id}
                onClick={() => setSelectedScientificRef(ref)}
                className="p-6 rounded-3xl bg-white dark:bg-[#14271F] border-2 border-[#D5DED7] dark:border-stone-700/80 shadow-md hover:border-emerald-600 dark:hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Header Row */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shadow-xs shrink-0 border border-emerald-300/40">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                        ref.fileAvailability === 'available_local_pdf'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                      }`}>
                        {ref.fileAvailability === 'available_local_pdf' ? 'ملف PDF أصلي متاح محلياً' : 'موثق بمستودع WHO IRIS'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-bold">
                        {ref.organization} · {ref.publicationYear}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 block mb-1 uppercase tracking-wider">
                      {ref.categoryLabel}
                    </span>
                    <h3 className="text-base font-black text-[#174F3F] dark:text-white group-hover:text-emerald-600 transition-colors leading-snug font-tajawal">
                      {ref.title}
                    </h3>
                    <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 mt-0.5 dir-ltr text-right line-clamp-1">
                      {ref.originalTitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed line-clamp-3 font-medium">
                    {ref.scopeAndRelevance}
                  </p>

                  {/* App Integration Badges */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 block">
                      مواضع الاستفادة داخل التطبيق:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ref.appIntegrationAreas.slice(0, 3).map((area, aIdx) => (
                        <span 
                          key={aIdx} 
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 font-medium"
                        >
                          {area}
                        </span>
                      ))}
                      {ref.appIntegrationAreas.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold">
                          +{ref.appIntegrationAreas.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>استعراض بيانات المرجع والأدلة السريرية</span>
                  </span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 1: VERIFIED BOOKS & OFFICIAL GUIDELINES (الكتب والمراجع)
         ========================================================================= */}
      {activeSubTab === 'books' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Category Filter Pills for Reference Books */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedBookCategory('all')}
              className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBookCategory === 'all'
                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                  : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              جميع المراجع الموصى بها ({allBooks.length})
            </button>
            <button
              onClick={() => setSelectedBookCategory('relationships_comm')}
              className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBookCategory === 'relationships_comm'
                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                  : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              <span>🤝</span>
              <span>العلاقات والتواصل (6)</span>
            </button>
            <button
              onClick={() => setSelectedBookCategory('self_emotions')}
              className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBookCategory === 'self_emotions'
                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                  : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              <span>🧠</span>
              <span>فهم النفس والمشاعر (4)</span>
            </button>
            <button
              onClick={() => setSelectedBookCategory('stress_resilience')}
              className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBookCategory === 'stress_resilience'
                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                  : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              <span>🛡️</span>
              <span>الضغط والتعافي والمرونة (4)</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400 px-1">
            <span>كتب ومراجع حقيقية موصى بقراءتها ({filteredBooks.length})</span>
            <span className="text-stone-500">يتضمن إحالة حصرية للمصادر الرسمية والناشرين</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="p-5 rounded-3xl bg-white dark:bg-[#14271F] border border-[#D5DED7] dark:border-stone-700/80 shadow-xs hover:border-[#174F3F] dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0 ${book.coverColor}`}>
                      {book.icon}
                    </div>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {book.reviewStatusLabel}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#23785B] dark:text-emerald-400 block mb-1">
                      {book.categoryLabel}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-[#174F3F] dark:text-white group-hover:text-[#23785B] transition-colors leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      بقلم: {book.authors.join(', ')} ({book.publicationYear})
                    </p>
                  </div>

                  <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed line-clamp-3">
                    {book.summaryArabic}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>اقرأ الملخص والمفاهيم 📖</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 2: ARTICLES & TRACKS (المقالات والمواضيع)
         ========================================================================= */}
      {activeSubTab === 'topics' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Tracks Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => {
                setSelectedTrackId('all');
                setShowBookmarksOnly(false);
              }}
              className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTrackId === 'all' && !showBookmarksOnly
                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                  : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
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
                  className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                      : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <span>{track.icon}</span>
                  <span>{track.title}</span>
                </button>
              );
            })}

            <button
              onClick={() => setShowBookmarksOnly(true)}
              className={`px-3.5 py-2 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                showBookmarksOnly
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-[#14271F] text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>المحفوظات ({bookmarks.length})</span>
            </button>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <span className="text-stone-500 font-bold shrink-0">وسوم شائعة:</span>
            {POPULAR_TAGS.map((tag) => {
              const isTagSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isTagSelected ? 'all' : tag)}
                  className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    isTagSelected
                      ? 'bg-[#B78327] text-white border-[#B78327] font-bold'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredTopics.map((topic) => {
              const isBookmarked = bookmarks.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className="p-5 rounded-3xl bg-white dark:bg-[#14271F] border border-[#D5DED7] dark:border-stone-700/80 shadow-xs hover:border-[#174F3F] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E2EFE7] text-[#174F3F] dark:bg-emerald-950 dark:text-emerald-300">
                        مسار {topic.trackNumber} · موضوع {topic.topicNumber}
                      </span>

                      <button
                        onClick={(e) => toggleBookmark(e, topic.id)}
                        className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                        title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ الموضوع'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-[#174F3F] dark:text-white group-hover:text-[#23785B] transition-colors leading-snug line-clamp-2">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed line-clamp-3">
                      {topic.introduction}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400">
                    <span className="flex items-center gap-1 text-[11px] text-stone-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>قراءة {topic.estimatedReadTimeMinutes} دقائق</span>
                    </span>

                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>اقرأ الموضوع</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 3: VALIDATED ASSESSMENT SCALES (المقاييس النفسية)
         ========================================================================= */}
      {activeSubTab === 'scales' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400 px-1">
            <span>المقاييس النفسية الموثقة علمياً ({allScales.length})</span>
            <span className="text-stone-500">للمتابعة والاسترشاد الذاتي دون إعطاء تشخيص نهائي</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allScales.map((scale) => (
              <div
                key={scale.id}
                onClick={() => setSelectedScale(scale)}
                className="p-6 rounded-3xl bg-white dark:bg-[#14271F] border border-[#D5DED7] dark:border-stone-700/80 shadow-xs hover:border-[#174F3F] transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                    {scale.abbreviation}
                  </div>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                    مقياس عالمي موثق
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-[#174F3F] dark:text-white group-hover:text-[#23785B] transition-colors leading-snug">
                    {scale.title}
                  </h3>
                  <p className="text-xs text-[#515B55] dark:text-stone-300 mt-1 leading-relaxed">
                    {scale.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400">
                  <span>بدء التقييم الاسترشادي ({scale.estimatedTimeMinutes} دقائق)</span>
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 4: PSYCHOEDUCATION PATHS (المسارات الموجهة)
         ========================================================================= */}
      {activeSubTab === 'paths' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400 px-1">
            <span>المسارات التثقيفية الموجهة ({allPaths.length})</span>
            <span className="text-stone-500">تسلسل متكامل يربط المراجع والمقالات والمقاييس والتمارين</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allPaths.map((path) => (
              <div
                key={path.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#14271F] border border-[#D5DED7] dark:border-stone-700/80 shadow-xs space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-[#E2EFE7] dark:bg-stone-800">{path.icon}</span>
                  <div>
                    <h3 className="text-base font-black text-[#174F3F] dark:text-white leading-snug">
                      {path.title}
                    </h3>
                    <span className="text-[11px] text-stone-500">مدورة تقريبية: {path.estimatedMinutes} دقيقة</span>
                  </div>
                </div>

                <p className="text-xs text-[#515B55] dark:text-stone-300 leading-relaxed font-medium">
                  {path.description}
                </p>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-2">
                  {path.topicIds.length > 0 && (
                    <button
                      onClick={() => {
                        const t = allTopics.find(x => x.id === path.topicIds[0]);
                        if (t) setActiveTopic(t);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#174F3F] text-white text-xs font-bold hover:bg-[#23785B] transition-all cursor-pointer shadow-xs"
                    >
                      بدء مقالات المسار 📖
                    </button>
                  )}

                  {path.bookIds.length > 0 && (
                    <button
                      onClick={() => {
                        const b = allBooks.find(x => x.id === path.bookIds[0]);
                        if (b) setSelectedBook(b);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      استعراض مرجع المسار 📚
                    </button>
                  )}

                  {path.assessmentScaleId && (
                    <button
                      onClick={() => {
                        const s = allScales.find(x => x.id === path.assessmentScaleId);
                        if (s) setSelectedScale(s);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      إجراء مقياس المسار 📊
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {activeTopic && (
        <PsychoeducationTopicModal
          topic={activeTopic}
          isOpen={Boolean(activeTopic)}
          onClose={() => setActiveTopic(null)}
          onOpenNextTopic={handleOpenNext}
          onOpenPrevTopic={handleOpenPrev}
          onNavigateToTool={onNavigateToTool}
        />
      )}

      {selectedBook && (
        <PsychoeducationBookModal
          book={selectedBook}
          isOpen={Boolean(selectedBook)}
          onClose={() => setSelectedBook(null)}
          onOpenTopicById={(topicId) => {
            setSelectedBook(null);
            const topic = allTopics.find(t => t.id === topicId);
            if (topic) setActiveTopic(topic);
          }}
          onNavigateToTool={onNavigateToTool}
        />
      )}

      {selectedScale && (
        <ValidatedAssessmentScaleModal
          scale={selectedScale}
          isOpen={Boolean(selectedScale)}
          onClose={() => setSelectedScale(null)}
          onOpenEmergencyHelp={onOpenEmergencyHelp}
        />
      )}

      {selectedFullBook && (
        <FullBookReaderModal
          book={selectedFullBook}
          isOpen={Boolean(selectedFullBook)}
          onClose={() => setSelectedFullBook(null)}
          onOpenEmergencyHelp={onOpenEmergencyHelp}
        />
      )}

      {selectedScientificRef && (
        <ScientificReferenceModal
          reference={selectedScientificRef}
          isOpen={Boolean(selectedScientificRef)}
          onClose={() => setSelectedScientificRef(null)}
          onOpenFullBookReader={(bookId) => {
            const fBook = allFullBooks.find(b => b.id === bookId);
            if (fBook) {
              setSelectedScientificRef(null);
              setSelectedFullBook(fBook);
            }
          }}
        />
      )}

    </section>
  );
};

