/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  Building,
  Calendar,
  FileText
} from 'lucide-react';
import { ScientificReference } from '../types';

interface ScientificReferenceModalProps {
  reference: ScientificReference | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullBookReader?: (bookId: string) => void;
}

export const ScientificReferenceModal: React.FC<ScientificReferenceModalProps> = ({
  reference,
  isOpen,
  onClose,
  onOpenFullBookReader
}) => {
  if (!isOpen || !reference) return null;

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
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xl shadow-xs shrink-0 border border-emerald-300/40">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-emerald-800 text-white px-2.5 py-0.5 rounded-full font-bold">
                  مرجع سريري وعلمي معتمد
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {reference.publicationYear}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black font-tajawal text-[#174F3F] dark:text-[#F7F5EF] line-clamp-1 mt-0.5">
                {reference.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            aria-label="إغلاق نافذة المرجع"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Metadata Grid */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F5EF] dark:bg-stone-900/60 border border-[#D5DED7] dark:border-stone-800 text-xs space-y-3">
            <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
              {reference.title}
            </div>
            <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 dir-ltr text-right">
              {reference.originalTitle}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#D5DED7] dark:border-stone-800 text-[11px]">
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300">الجهة المصدرة:</span>{' '}
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{reference.organization}</span>
              </div>
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300">التصنيف:</span>{' '}
                <span className="text-stone-600 dark:text-stone-400">{reference.categoryLabel}</span>
              </div>
              {reference.isbn && (
                <div>
                  <span className="font-bold text-stone-700 dark:text-stone-300">رقم المعيار الدولي (ISBN):</span>{' '}
                  <span className="font-mono text-stone-600 dark:text-stone-400">{reference.isbn}</span>
                </div>
              )}
              {reference.irisIdentifier && (
                <div>
                  <span className="font-bold text-stone-700 dark:text-stone-300">معرّف مستودع IRIS:</span>{' '}
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{reference.irisIdentifier}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#D5DED7] dark:border-stone-800 text-[11px]">
              <span className="font-bold text-stone-700 dark:text-stone-300">الترخيص المعتمد:</span>{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{reference.licenseLabel}</span>
            </div>
          </div>

          {/* Scope and Relevance */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>نطاق المرجع وصلته بمحتوى «نسمة حياة»:</span>
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 font-medium p-4 rounded-2xl bg-white dark:bg-[#1C3329] border border-stone-200 dark:border-stone-800">
              {reference.scopeAndRelevance}
            </p>
          </div>

          {/* Key Clinical Findings */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>أهم المبادئ والخلاصات السريرية المعتمدة:</span>
            </h3>
            <div className="space-y-2">
              {reference.keyClinicalFindings.map((finding, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#E2EFE7]/50 dark:bg-stone-900/50 border border-emerald-200/60 dark:border-emerald-950 flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-stone-800 dark:text-stone-200">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* App Integration Areas */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>مواضع تطبيق هذا المرجع داخل «نسمة حياة»:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {reference.appIntegrationAreas.map((area, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 text-xs text-sky-900 dark:text-sky-200 font-medium flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Limitations and Safety */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>الحدود السريرية وضوابط الأمان والإحالة المتخصصة:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-300 leading-relaxed font-medium">
              {reference.limitationsAndSafety}
            </p>
          </div>

          {/* Action Links */}
          <div className="p-4 rounded-2xl bg-[#F7F5EF] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-stone-700 dark:text-stone-300">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>حالة توفر الملف:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                reference.fileAvailability === 'available_local_pdf' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
              }`}>
                {reference.fileAvailability === 'available_local_pdf' ? 'ملف PDF أصلي متاح محلياً' : 'موثق عبر مستودع WHO IRIS الرسمي'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {reference.localPdfPath && (
                <a
                  href={reference.localPdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تنزيل ملف PDF الرسمي</span>
                </a>
              )}

              {reference.officialUrl && (
                <a
                  href={reference.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>زيارة المستودع الرسمي (WHO)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#F7F5EF] dark:bg-[#1C3329] border-t border-[#D5DED7] dark:border-stone-800 flex items-center justify-between z-10 shrink-0 text-xs">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold">
            الجمهور المستهدف: {reference.targetAudience}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-300 dark:bg-stone-800 hover:bg-stone-400 dark:hover:bg-stone-700 font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
