/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  Info,
  Calendar,
  Building,
  Languages,
  Award
} from 'lucide-react';
import { PsychoeducationBook } from '../types';

interface PsychoeducationBookModalProps {
  book: PsychoeducationBook | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTopicById?: (topicId: string) => void;
  onNavigateToTool?: (toolId: string) => void;
}

export const PsychoeducationBookModal: React.FC<PsychoeducationBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenTopicById,
  onNavigateToTool
}) => {
  if (!isOpen || !book) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-md animate-fade-in font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl h-[92vh] max-h-[850px] bg-white dark:bg-[#14271F] text-[#292F2B] dark:text-[#F7F5EF] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5DED7] dark:border-stone-700">
        
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#F7F5EF] dark:bg-[#1C3329] border-b border-[#D5DED7] dark:border-stone-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${book.coverColor}`}>
              {book.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-[#174F3F] text-white px-2.5 py-0.5 rounded-full font-bold">
                  {book.categoryLabel}
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{book.reviewStatusLabel}</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-emerald-300 font-tajawal mt-0.5">
                {book.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Original Title & Metadata Card */}
          <div className="p-4 rounded-2xl bg-[#E2EFE7]/60 dark:bg-stone-800/60 border border-[#D5DED7] dark:border-stone-700 space-y-3">
            {book.originalTitle && (
              <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <span className="font-bold text-[#174F3F] dark:text-emerald-400">العنوان الأصلي:</span>
                <span className="italic">{book.originalTitle}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#B78327]" />
                <div>
                  <span className="block text-[10px] text-stone-500 dark:text-stone-400">الناشر/المؤلف</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{book.authors.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#23785B]" />
                <div>
                  <span className="block text-[10px] text-stone-500 dark:text-stone-400">سنة النشر</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{book.publicationYear}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-sky-600" />
                <div>
                  <span className="block text-[10px] text-stone-500 dark:text-stone-400">اللغة التحريرية</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{book.language}</span>
                </div>
              </div>
            </div>

            {/* Direct Official Legal Source Link */}
            {book.directSourceUrl && (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                  رابط الوصول القانوني المباشر للمصدر الرسمي والناشر:
                </span>
                <a
                  href={book.directSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-[#174F3F] hover:bg-[#23785B] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>فتح المصدر الأصلي</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Arabic Comprehensive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-[#174F3F] dark:text-emerald-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B78327]" />
              <span>الملخص التثقيفي الأصلي باللغة العربية:</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
              {book.summaryArabic}
            </p>
          </div>

          {/* Key Clinical & Self-Help Takeaways */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-[#174F3F] dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>أبرز المفاهيم والتطبيقات العملية في هذا المرجع:</span>
            </h3>

            <div className="space-y-2">
              {book.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience Guidance */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
            <span className="text-xs font-black text-amber-900 dark:text-amber-300 block">
              🎯 لمن هذا المرجع؟
            </span>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
              {book.whoIsThisFor}
            </p>
          </div>

          {/* Scientific & Critical Reading Disclaimer */}
          {book.criticalReadingNote && (
            <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 space-y-1 text-xs">
              <span className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>تنبيه تحريري وقراءة نقدية:</span>
              </span>
              <p className="text-sky-800 dark:text-sky-300 leading-relaxed font-medium">
                {book.criticalReadingNote}
              </p>
            </div>
          )}

          {/* Copyright & Legal Compliance Notice */}
          <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed border border-stone-200 dark:border-stone-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-stone-700 dark:text-stone-300">حقوق النشر والوصول القانوني:</span>
              <span>{book.licenseNotice}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 bg-[#F7F5EF] dark:bg-[#1C3329] border-t border-[#D5DED7] dark:border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            مبادرة «نسمة حياة» — التثقيف النفسي الموثوق
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#174F3F] hover:bg-[#23785B] text-white text-xs font-black transition-all cursor-pointer shadow-xs"
          >
            إغلاق المرجع
          </button>
        </div>

      </div>
    </div>
  );
};
