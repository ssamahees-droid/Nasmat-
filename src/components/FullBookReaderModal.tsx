/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  BookOpen, 
  List, 
  ChevronRight, 
  ChevronLeft, 
  Type, 
  Moon, 
  Sun, 
  Bookmark, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Info, 
  Share2, 
  Check, 
  Sparkles,
  Award,
  AlertCircle,
  Clock,
  RotateCcw,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { FullTextPsychoeducationBook, FullBookChapter } from '../types';

interface FullBookReaderModalProps {
  book: FullTextPsychoeducationBook | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergencyHelp?: () => void;
}

export const FullBookReaderModal: React.FC<FullBookReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenEmergencyHelp
}) => {
  if (!isOpen || !book) return null;

  // Saved Reading Progress Key: nesma_book_progress_<bookId>
  const progressKey = `nesma_book_progress_${book.id}`;
  const bookmarksKey = `nesma_book_bookmarks_${book.id}`;

  // Reader Settings State
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chapterIndex === 'number' && parsed.chapterIndex < book.chapters.length) {
          return parsed.chapterIndex;
        }
      }
    } catch {
      // fallback
    }
    return 0;
  });

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark' | 'emerald'>('emerald');
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showLicenseInfo, setShowLicenseInfo] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Reader Mode State: 'structured_text' | 'illustrated_pdf'
  const [readerMode, setReaderMode] = useState<'structured_text' | 'illustrated_pdf'>('structured_text');
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [pdfZoom, setPdfZoom] = useState<number>(100);

  // Chapter Bookmarks State
  const [bookmarkedChapters, setBookmarkedChapters] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(bookmarksKey) || '[]');
    } catch {
      return [];
    }
  });

  // Save progress when active chapter changes
  useEffect(() => {
    try {
      localStorage.setItem(progressKey, JSON.stringify({
        chapterIndex: activeChapterIndex,
        chapterId: book.chapters[activeChapterIndex]?.id,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Error saving book reading progress:', e);
    }
  }, [activeChapterIndex, book.id, progressKey]);

  // Toggle Bookmark
  const toggleBookmarkCurrentChapter = () => {
    try {
      const isBookmarked = bookmarkedChapters.includes(activeChapterIndex);
      const updated = isBookmarked
        ? bookmarkedChapters.filter(idx => idx !== activeChapterIndex)
        : [...bookmarkedChapters, activeChapterIndex];
      setBookmarkedChapters(updated);
      localStorage.setItem(bookmarksKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating bookmarks:', e);
    }
  };

  const currentChapter: FullBookChapter | undefined = book.chapters[activeChapterIndex];

  // Theme Styling Map
  const themeClasses = {
    light: {
      bg: 'bg-stone-50 text-stone-900',
      headerBg: 'bg-white border-stone-200',
      cardBg: 'bg-white border-stone-200',
      calloutInfo: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      calloutExercise: 'bg-teal-50 border-teal-300 text-teal-950',
      calloutWarning: 'bg-amber-50 border-amber-300 text-amber-950',
      calloutQuote: 'bg-stone-100 border-stone-300 text-stone-900 italic',
      accentText: 'text-emerald-800',
      buttonBg: 'bg-stone-200 text-stone-800 hover:bg-stone-300'
    },
    sepia: {
      bg: 'bg-[#F9F3E5] text-[#3D2E1E]',
      headerBg: 'bg-[#F2E8D5] border-[#E2D2B5]',
      cardBg: 'bg-[#F2E8D5] border-[#E2D2B5]',
      calloutInfo: 'bg-[#EAE0CD] border-[#C8B898] text-[#2C2014]',
      calloutExercise: 'bg-[#E5D7BF] border-[#C5AF89] text-[#2C2014]',
      calloutWarning: 'bg-[#F0DFBD] border-[#D0B880] text-[#322005]',
      calloutQuote: 'bg-[#ECE0C8] border-[#CAA870] text-[#3D2E1E] italic',
      accentText: 'text-[#8C521F]',
      buttonBg: 'bg-[#E8D9BF] text-[#3D2E1E] hover:bg-[#DDCB20]'
    },
    dark: {
      bg: 'bg-[#121214] text-[#E4E4E7]',
      headerBg: 'bg-[#18181B] border-stone-800',
      cardBg: 'bg-[#18181B] border-stone-800',
      calloutInfo: 'bg-emerald-950/70 border-emerald-800 text-emerald-100',
      calloutExercise: 'bg-teal-950/70 border-teal-800 text-teal-100',
      calloutWarning: 'bg-amber-950/70 border-amber-800 text-amber-100',
      calloutQuote: 'bg-stone-900 border-stone-700 text-stone-200 italic',
      accentText: 'text-emerald-400',
      buttonBg: 'bg-stone-800 text-stone-200 hover:bg-stone-700'
    },
    emerald: {
      bg: 'bg-[#0A1813] text-[#F3F8F5]',
      headerBg: 'bg-[#122A21] border-[#1C4234]',
      cardBg: 'bg-[#122A21] border-[#1C4234]',
      calloutInfo: 'bg-[#163D30] border-[#225C48] text-emerald-100',
      calloutExercise: 'bg-[#17483B] border-[#276B58] text-teal-100',
      calloutWarning: 'bg-[#3A2D14] border-[#634C21] text-amber-100',
      calloutQuote: 'bg-[#132E24] border-[#255745] text-emerald-200 italic',
      accentText: 'text-emerald-300',
      buttonBg: 'bg-[#173D30] text-emerald-100 hover:bg-[#1E4F3E]'
    }
  }[themeMode];

  // Font Size Map
  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-loose',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  }[fontSize];

  // Search results within book text
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    const results: { chapterIndex: number; chapterTitle: string; snippet: string }[] = [];

    book.chapters.forEach((chap, idx) => {
      chap.sections.forEach(sec => {
        sec.paragraphs.forEach(p => {
          if (p.toLowerCase().includes(q)) {
            const startIdx = Math.max(0, p.toLowerCase().indexOf(q) - 30);
            const snippet = p.substring(startIdx, startIdx + 120) + '...';
            results.push({
              chapterIndex: idx,
              chapterTitle: chap.title,
              snippet
            });
          }
        });
      });
    });

    return results;
  }, [searchQuery, book.chapters]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in font-cairo transition-colors duration-200`}
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className={`relative w-full h-full sm:h-[94vh] sm:max-h-[900px] sm:max-w-4xl ${themeClasses.bg} sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-700/50`}>
        
        {/* ================= Header Bar ================= */}
        <div className={`px-4 py-3 sm:px-6 sm:py-4 ${themeClasses.headerBg} border-b flex items-center justify-between z-20 shrink-0 gap-2`}>
          
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <button
              onClick={() => setShowToc(!showToc)}
              className={`p-2 rounded-xl ${themeClasses.buttonBg} transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold`}
              title="فهرس الفصول"
            >
              <List className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">الفهرس</span>
            </button>

            <div className="truncate">
              <div className="flex items-center gap-1.5 text-[11px] font-bold opacity-80">
                <span className="truncate">{book.authors.join('، ')}</span>
                <span>•</span>
                <span className="text-emerald-400 font-extrabold">{book.categoryLabel}</span>
              </div>
              <h2 className="text-xs sm:text-sm font-black truncate font-tajawal">
                {book.title}
              </h2>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* PDF Original File Trigger */}
            {book.pdfDownloadUrl && (
              <a
                href={book.pdfDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl ${themeClasses.buttonBg} transition-colors cursor-pointer text-xs font-bold flex items-center gap-1`}
                title="عرض أو تنزيل ملف PDF الأصلي الصادر عن منظمة الصحة العالمية"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline text-[11px]">نسخة PDF الأصلية</span>
              </a>
            )}

            {/* License & Verification Info Trigger */}
            <button
              onClick={() => setShowLicenseInfo(!showLicenseInfo)}
              className={`p-2 rounded-xl ${showLicenseInfo ? 'bg-emerald-600 text-white' : themeClasses.buttonBg} transition-colors cursor-pointer text-xs font-bold flex items-center gap-1`}
              title="بيانات الترخيص المعتمد وحقوق النشر"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline text-[11px]">الترخيص والحقوق</span>
            </button>

            {/* Bookmark Current Chapter */}
            <button
              onClick={toggleBookmarkCurrentChapter}
              className={`p-2 rounded-xl ${bookmarkedChapters.includes(activeChapterIndex) ? 'bg-amber-500 text-white' : themeClasses.buttonBg} transition-colors cursor-pointer`}
              title="إضافة إشارة مرجعية للفصل"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Toggle Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl ${showSearch ? 'bg-emerald-600 text-white' : themeClasses.buttonBg} transition-colors cursor-pointer`}
              title="البحث داخل الكتاب"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer mr-1"
              aria-label="إغلاق قارئ الكتب"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= Reader Mode Switcher Bar (when PDF is available) ================= */}
        {book.pdfDownloadUrl && (
          <div className="px-4 py-2 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-20">
            <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800">
              <button
                onClick={() => setReaderMode('structured_text')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  readerMode === 'structured_text'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>قراءة النص المنظم (مساعد)</span>
              </button>

              <button
                onClick={() => setReaderMode('illustrated_pdf')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  readerMode === 'illustrated_pdf'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>قراءة الكتاب المصوّر الأصلي (PDF)</span>
              </button>
            </div>

            {readerMode === 'illustrated_pdf' && (
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <a
                  href={`${book.pdfDownloadUrl}#page=${pdfPage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                  title="فتح في نافذة كاملة جديدة"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">نافذة كاملة</span>
                </a>
                <a
                  href={book.pdfDownloadUrl}
                  download="who_doing_what_matters_ar.pdf"
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-1 shadow-xs"
                  title="تنزيل ملف PDF الأصلي (2.9 MB)"
                >
                  <FileText className="w-3 h-3" />
                  <span>تنزيل PDF (132 صفحة)</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* ================= Sub-Toolbar: Structured Text (Themes & Font Controls) ================= */}
        {readerMode === 'structured_text' && (
          <div className={`px-4 py-2 ${themeClasses.headerBg} border-b border-stone-800/40 flex items-center justify-between text-xs overflow-x-auto gap-3 shrink-0`}>
            
            {/* Theme Selector */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] font-bold opacity-75 ml-1">الوضع:</span>
              <button
                onClick={() => setThemeMode('emerald')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${themeMode === 'emerald' ? 'bg-[#1C4234] text-emerald-300 ring-1 ring-emerald-400' : 'opacity-70 hover:opacity-100'}`}
              >
                زمردي
              </button>
              <button
                onClick={() => setThemeMode('sepia')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${themeMode === 'sepia' ? 'bg-[#E2D2B5] text-[#3D2E1E] ring-1 ring-[#8C521F]' : 'opacity-70 hover:opacity-100'}`}
              >
                ورقي
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${themeMode === 'dark' ? 'bg-stone-800 text-stone-200 ring-1 ring-stone-600' : 'opacity-70 hover:opacity-100'}`}
              >
                ليلي
              </button>
              <button
                onClick={() => setThemeMode('light')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${themeMode === 'light' ? 'bg-stone-200 text-stone-900 ring-1 ring-stone-400' : 'opacity-70 hover:opacity-100'}`}
              >
                فاتح
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] font-bold opacity-75 ml-1">حجم الخط:</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${fontSize === 'sm' ? 'bg-emerald-600 text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                صغير
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${fontSize === 'md' ? 'bg-emerald-600 text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                متوسط
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${fontSize === 'lg' ? 'bg-emerald-600 text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                كبير
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${fontSize === 'xl' ? 'bg-emerald-600 text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                كبير جداً
              </button>
            </div>
          </div>
        )}

        {/* ================= Sub-Toolbar: Illustrated PDF Mode (Page Stepper & Zoom) ================= */}
        {readerMode === 'illustrated_pdf' && book.pdfDownloadUrl && (
          <div className="px-3 py-2 sm:px-5 sm:py-2 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs overflow-x-auto shrink-0 z-10">
            {/* Page Stepper */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                disabled={pdfPage <= 1}
                className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] hidden sm:inline">السابقة</span>
              </button>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-bold">
                <span>صفحة</span>
                <input
                  type="number"
                  min={1}
                  max={132}
                  value={pdfPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= 132) {
                      setPdfPage(val);
                    }
                  }}
                  className="w-12 text-center bg-stone-900 border border-stone-700 rounded-lg py-0.5 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <span className="text-stone-400">من 132</span>
              </div>

              <button
                onClick={() => setPdfPage(p => Math.min(132, p + 1))}
                disabled={pdfPage >= 132}
                className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="الصفحة التالية"
              >
                <span className="text-[11px] hidden sm:inline">التالية</span>
                <ChevronLeft className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Quick Jumps to Chapters */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar text-[10px] font-bold shrink-0">
              <span className="text-stone-400 ml-1 hidden lg:inline">انتقال:</span>
              <button
                onClick={() => setPdfPage(1)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 1 (البداية)
              </button>
              <button
                onClick={() => setPdfPage(5)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 5 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 5 (التصدير)
              </button>
              <button
                onClick={() => setPdfPage(11)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 11 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 11 (ف 1)
              </button>
              <button
                onClick={() => setPdfPage(52)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 52 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 52 (ف 2)
              </button>
              <button
                onClick={() => setPdfPage(66)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 66 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 66 (المنتصف)
              </button>
              <button
                onClick={() => setPdfPage(79)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 79 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 79 (ف 3)
              </button>
              <button
                onClick={() => setPdfPage(99)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 99 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 99 (ف 4)
              </button>
              <button
                onClick={() => setPdfPage(107)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 107 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 107 (ف 5)
              </button>
              <button
                onClick={() => setPdfPage(122)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 122 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 122 (الأدوات)
              </button>
              <button
                onClick={() => setPdfPage(132)}
                className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  pdfPage === 132 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                ص 132 (النهاية)
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setPdfZoom(z => Math.min(200, z + 25))}
                className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-stone-400 w-8 text-center">
                {pdfZoom}%
              </span>
              <button
                onClick={() => setPdfZoom(z => Math.max(75, z - 25))}
                className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPdfZoom(100)}
                className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer text-[10px]"
                title="إعادة ضبط الحجم"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ================= Main Content Container ================= */}
        <div className="relative flex-1 overflow-hidden flex">

          {/* 1. TOC Drawer / Sidebar */}
          {showToc && (
            <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-80 bg-stone-900 text-stone-100 shadow-2xl border-l border-stone-800 flex flex-col animate-slide-in-right">
              <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm font-tajawal">فهرس فصول الكتاب</h3>
                </div>
                <button
                  onClick={() => setShowToc(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {book.chapters.map((chap, idx) => {
                  const isActive = idx === activeChapterIndex;
                  const isBookmarked = bookmarkedChapters.includes(idx);

                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setShowToc(false);
                      }}
                      className={`w-full text-right p-3 rounded-2xl transition-all cursor-pointer border flex flex-col gap-1 ${
                        isActive
                          ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold shadow-md'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                          الفصل {chap.chapterNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          <span className="text-[10px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {chap.readingTimeMinutes} د
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold leading-snug mt-1">
                        {chap.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. License & Legal Rights Verification Overlay */}
          {showLicenseInfo && (
            <div className="absolute inset-0 z-30 bg-stone-950/95 p-5 sm:p-7 overflow-y-auto text-stone-100 font-cairo space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-base font-black font-tajawal">التوثيق القانوني والترخيص وحقوق النشر</h3>
                </div>
                <button
                  onClick={() => setShowLicenseInfo(false)}
                  className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5 text-stone-300" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <div className="text-emerald-400 font-bold text-sm">{book.title}</div>
                  {book.originalTitle && (
                    <div className="text-stone-400 font-mono text-[11px]">{book.originalTitle}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-800 text-stone-300">
                    <div><strong>المؤلفون:</strong> {book.authors.join('، ')}</div>
                    {book.translator && <div><strong>المترجم:</strong> {book.translator}</div>}
                    <div><strong>الناشر:</strong> {book.publisher} ({book.publicationYear})</div>
                    <div><strong>نوع الترخيص:</strong> <span className="text-emerald-300 font-bold">{book.licenseLabel}</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
                  <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    بيان التحقق من الأهلية للادراج النصي الكامل:
                  </h4>
                  <p className="text-stone-300 leading-relaxed">
                    {book.licenseVerificationNotes}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-200">الإسناد المطلوب ورابط المصدر الأصلي:</h4>
                  <p className="text-stone-400">{book.attributionText}</p>
                  {book.sourceUrl && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={book.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-bold"
                      >
                        <span>زيارة مستودع منظمة الصحة العالمية الرسمي (WHO IRIS)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {book.pdfDownloadUrl && (
                        <a
                          href={book.pdfDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold hover:bg-amber-500/30 transition-colors text-[11px]"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>تنزيل ملف PDF العربي الرسمي الكامل (132 صفحة)</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. Search Bar Dropdown Overlay */}
          {showSearch && (
            <div className="absolute top-0 inset-x-0 z-20 p-4 bg-stone-900/95 border-b border-stone-800 space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute right-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن كلمة أو فكرة داخل نص الكتاب كامل..."
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => setShowSearch(false)}
                  className="px-3 py-2 text-xs bg-stone-800 text-stone-300 rounded-xl hover:bg-stone-700 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="max-h-60 overflow-y-auto space-y-2 pt-2">
                  {searchResults.length === 0 ? (
                    <div className="text-xs text-stone-400 text-center py-3">
                      لم يتم العثور على نتائج تطابق "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map((res, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => {
                          setActiveChapterIndex(res.chapterIndex);
                          setShowSearch(false);
                        }}
                        className="w-full text-right p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs space-y-1 cursor-pointer block"
                      >
                        <div className="text-emerald-400 font-bold text-[11px]">
                          {res.chapterTitle}
                        </div>
                        <div className="text-stone-300 text-[11px] leading-snug">
                          {res.snippet}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. Reading Workspace: Illustrated PDF Mode VS Structured Text Mode */}
          {readerMode === 'illustrated_pdf' && book.pdfDownloadUrl ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-950 text-stone-100">
              
              {/* PDF Embedded Viewport */}
              <div className="relative flex-1 w-full h-full bg-[#1e1e20] flex flex-col overflow-hidden">
                <iframe
                  key={`pdf-viewport-${pdfPage}-${pdfZoom}`}
                  src={`${book.pdfDownloadUrl}#page=${pdfPage}&zoom=${pdfZoom}&toolbar=1&navpanes=0`}
                  className="w-full h-full flex-1 border-0 bg-stone-900"
                  title="عارض كتاب منظمة الصحة العالمية المصور الأصلي"
                />

                {/* Mobile / Direct Action Helper Bar */}
                <div className="px-4 py-2.5 bg-stone-900/95 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 shrink-0">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>الكتاب المصور الأصلي الكامل (132 صفحة) · منظمة الصحة العالمية</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`${book.pdfDownloadUrl}#page=${pdfPage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>عرض الصفحة في نافذة كاملة</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span>·</span>
                    <button
                      onClick={() => setReaderMode('structured_text')}
                      className="text-amber-300 hover:underline font-bold cursor-pointer"
                    >
                      التبديل للنص المنظم
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* 4. Active Chapter Reading Body (Structured Text Mode) */
            <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-8 scroll-smooth">
              
              {currentChapter ? (
                <article className="max-w-2xl mx-auto space-y-8">
                  
                  {/* Assistive Text Notice Banner (only when PDF is available) */}
                  {book.pdfDownloadUrl && (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 text-stone-200">
                        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                        <div>
                          <span className="font-bold text-emerald-300 block text-xs">وضع قراءة نصي مساعد</span>
                          <span className="text-[11px] text-stone-300 leading-relaxed font-medium">
                            يعرض هذا الوضع مواءمة نصية سريعة ومنظمة للأفكار والتمارين مع دعم البحث وتكبير الخط. لمشاهدة الرسوم والقصص المصورة الأصلية (132 صفحة)، يمكنك التبديل إلى{' '}
                            <button
                              onClick={() => setReaderMode('illustrated_pdf')}
                              className="text-amber-300 underline font-bold hover:text-amber-200 cursor-pointer"
                            >
                              «قراءة الكتاب المصوّر الأصلي (PDF)»
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chapter Header */}
                  <header className="space-y-3 pb-6 border-b border-stone-700/30">
                  <div className="flex items-center justify-between text-xs font-bold opacity-80">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      الفصل {currentChapter.chapterNumber} من {book.chapters.length}
                    </span>
                    <span className="flex items-center gap-1 text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      زمن القراءة التقديري: {currentChapter.readingTimeMinutes} دقائق
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black font-tajawal leading-tight text-emerald-300">
                    {currentChapter.title}
                  </h1>

                  {currentChapter.subtitle && (
                    <p className="text-sm font-medium opacity-85 leading-relaxed">
                      {currentChapter.subtitle}
                    </p>
                  )}
                </header>

                {/* Chapter Sections */}
                <div className={`space-y-7 ${fontSizeClasses}`}>
                  {currentChapter.sections.map((sec, sIdx) => (
                    <section key={sIdx} className="space-y-4">
                      
                      {sec.heading && (
                        <h3 className="text-base sm:text-lg font-black font-tajawal border-r-4 border-emerald-500 pr-3 my-4 text-emerald-400">
                          {sec.heading}
                        </h3>
                      )}

                      {/* Paragraphs */}
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-justify font-medium leading-relaxed opacity-95">
                          {p}
                        </p>
                      ))}

                      {/* Bullet Points */}
                      {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                        <ul className="space-y-2 my-3 pl-2 pr-4 list-disc marker:text-emerald-500">
                          {sec.bulletPoints.map((bp, bIdx) => (
                            <li key={bIdx} className="font-medium text-justify">
                              {bp}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Callout Box */}
                      {sec.calloutBox && (
                        <div className={`p-4 sm:p-5 rounded-2xl border my-5 space-y-2 ${
                          sec.calloutBox.type === 'exercise' ? themeClasses.calloutExercise :
                          sec.calloutBox.type === 'warning' ? themeClasses.calloutWarning :
                          sec.calloutBox.type === 'quote' ? themeClasses.calloutQuote :
                          themeClasses.calloutInfo
                        }`}>
                          {sec.calloutBox.title && (
                            <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>{sec.calloutBox.title}</span>
                            </div>
                          )}
                          <p className="text-xs sm:text-sm leading-relaxed font-medium">
                            {sec.calloutBox.content}
                          </p>
                        </div>
                      )}
                    </section>
                  ))}
                </div>

                {/* Chapter Navigation Footer */}
                <nav className="pt-8 border-t border-stone-700/30 flex items-center justify-between gap-3 text-xs font-bold">
                  {/* Previous Chapter */}
                  {activeChapterIndex > 0 ? (
                    <button
                      onClick={() => {
                        setActiveChapterIndex(prev => prev - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-4 py-3 rounded-2xl ${themeClasses.buttonBg} transition-all cursor-pointer flex items-center gap-2 font-tajawal`}
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                      <div className="text-right">
                        <div className="text-[10px] opacity-70">الفصل السابق</div>
                        <div className="truncate max-w-[130px] font-bold">{book.chapters[activeChapterIndex - 1].title}</div>
                      </div>
                    </button>
                  ) : <div />}

                  {/* Next Chapter */}
                  {activeChapterIndex < book.chapters.length - 1 ? (
                    <button
                      onClick={() => {
                        setActiveChapterIndex(prev => prev + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer flex items-center gap-2 font-tajawal mr-auto"
                    >
                      <div className="text-left">
                        <div className="text-[10px] opacity-80">الفصل التالي</div>
                        <div className="truncate max-w-[130px] font-bold">{book.chapters[activeChapterIndex + 1].title}</div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-emerald-950/60 text-emerald-300 text-center font-bold text-xs border border-emerald-800/50">
                      🎉 وصلت لنهاية الكتاب! نتمنى لك رحلة تثقيفية ممتعة.
                    </div>
                  )}
                </nav>

              </article>
            ) : (
              /* Fallback Error State */
              <div className="py-16 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold">عذراً، تعذر تحميل هذا الفصل من الكتاب.</h3>
                <p className="text-xs text-stone-400">يرجى اختيار فصل آخر من الفهرس.</p>
                <button
                  onClick={() => setActiveChapterIndex(0)}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs rounded-xl cursor-pointer"
                >
                  العودة للفصل الأول
                </button>
              </div>
            )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
