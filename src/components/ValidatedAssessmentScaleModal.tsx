/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles,
  Award
} from 'lucide-react';
import { ValidatedAssessmentScale } from '../types';
import { storage } from '../services/storage';

interface ValidatedAssessmentScaleModalProps {
  scale: ValidatedAssessmentScale | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergencyHelp?: () => void;
}

export const ValidatedAssessmentScaleModal: React.FC<ValidatedAssessmentScaleModalProps> = ({
  scale,
  isOpen,
  onClose,
  onOpenEmergencyHelp
}) => {
  if (!isOpen || !scale) return null;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectAnswer = (qId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const isAllAnswered = scale.questions.every(q => answers[q.id] !== undefined);

  const calculateTotalScore = () => {
    return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  };

  const totalScore = calculateTotalScore();
  const maxPossibleScore = scale.questions.length * 3;

  const getResultRange = (score: number) => {
    return scale.scoringRanges.find(r => score >= r.minScore && score <= r.maxScore) || scale.scoringRanges[0];
  };

  const resultRange = getResultRange(totalScore);

  const handleCompleteAssessment = () => {
    if (!isAllAnswered) return;
    setIsCompleted(true);

    // Save to storage
    try {
      const currentUser = storage.getUser();
      storage.saveAssessment({
        id: `assess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: currentUser.id,
        assessmentType: scale.abbreviation === 'PHQ-9' ? 'phq9' : 'initial_check',
        assessmentTitle: scale.title,
        instrumentVersion: scale.abbreviation,
        answers: answers,
        score: totalScore,
        maxScore: maxPossibleScore,
        resultTitle: resultRange.levelTitle,
        resultText: resultRange.levelDescription,
        recommendation: resultRange.recommendation,
        createdAt: new Date().toISOString(),
        safetyFlagTriggered: resultRange.requiresProfessionalAttention
      });
    } catch (e) {
      console.warn('Error saving assessment record:', e);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setIsCompleted(false);
  };

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
            <div className="w-10 h-10 rounded-2xl bg-[#174F3F]/15 dark:bg-emerald-500/20 text-[#174F3F] dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#174F3F] text-white px-2.5 py-0.5 rounded-full font-bold">
                  {scale.abbreviation}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  مقياس موثق عالمياً
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#174F3F] dark:text-emerald-300 font-tajawal mt-0.5">
                {scale.title}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Purpose & Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-[#E2EFE7]/60 dark:bg-stone-800/60 border border-[#D5DED7] dark:border-stone-700 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#174F3F] dark:text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>الغرض والمصدر السريري:</span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {scale.purpose}
            </p>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[10.5px] text-stone-500 dark:text-stone-400">
              المصدر السريري: {scale.clinicalSource}
            </div>
          </div>

          {!isCompleted ? (
            /* Questions Flow */
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-[#174F3F] dark:text-emerald-400 border-b pb-2 border-stone-200 dark:border-stone-800">
                <span>الأسئلة الاسترشادية ({Object.keys(answers).length} من {scale.questions.length} مكتمل)</span>
                <span className="text-stone-500">اختر الخيار الأقرب لوصف حالتك خلال الأسبوعين الأخيرين</span>
              </div>

              <div className="space-y-5">
                {scale.questions.map((q) => {
                  const selectedScore = answers[q.id];

                  return (
                    <div 
                      key={q.id}
                      className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                        {q.id}. {q.text}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = selectedScore === opt.score;

                          return (
                            <button
                              key={opt.score}
                              onClick={() => handleSelectAnswer(q.id, opt.score)}
                              className={`p-3 rounded-xl text-xs font-bold text-right transition-all cursor-pointer border flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#23785B]'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Item 9 Immediate Safety Trigger Banner for PHQ-9 */}
                      {scale.abbreviation === 'PHQ-9' && q.id === 9 && selectedScore !== undefined && selectedScore > 0 && (
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-700 space-y-2 text-rose-950 dark:text-rose-100 animate-fade-in mt-2">
                          <div className="flex items-center gap-2 font-bold text-xs text-rose-800 dark:text-rose-200">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>تنبيه سلامة وإرشاد عاجل (السؤال التاسع):</span>
                          </div>
                          <p className="text-xs leading-relaxed font-medium">
                            سلامتك هي أولويتنا الغالية والتامة. أظهرت إجابتك وجود أفكار ملحة حول الموت أو إيذاء النفس. يرجى ألا تبقى وحدك مع هذا الخوف، والتواصل فوراً مع خطوط الدعم المتخصصة المجانية أو الاتصال بالرقم <strong>16328</strong> (الأمانة العامة للصحة النفسية بمصر - متاح 24 ساعة).
                          </p>
                          {onOpenEmergencyHelp && (
                            <button
                              type="button"
                              onClick={onOpenEmergencyHelp}
                              className="mt-1 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              فتح خطوط الدعم والسلامة العاجلة 🆘
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Action */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs text-stone-500">
                  {isAllAnswered ? 'اكتملت جميع الإجابات جاهز لعرض النتيجة ✨' : 'يرجى الإجابة على جميع الأسئلة لتحديد المؤشر'}
                </span>

                <button
                  disabled={!isAllAnswered}
                  onClick={handleCompleteAssessment}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                    isAllAnswered
                      ? 'bg-[#174F3F] hover:bg-[#23785B] text-white'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <span>عرض النتيجة والمؤشرات</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#E2EFE7] to-[#D5EADF] dark:from-emerald-950/80 dark:to-stone-900 border-2 border-[#23785B] shadow-lg text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#174F3F] text-white mx-auto flex items-center justify-center font-black text-lg shadow-inner">
                  {totalScore}
                </div>

                <div>
                  <span className="text-xs font-bold text-[#23785B] block">
                    النتيجة الكلية للمقياس: {totalScore} من {maxPossibleScore}
                  </span>
                  <h3 className="text-lg font-black text-[#174F3F] dark:text-emerald-200 mt-1">
                    {resultRange.levelTitle}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium max-w-xl mx-auto">
                  {resultRange.levelDescription}
                </p>
              </div>

              {/* Recommendation Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-black text-[#B78327] block">
                  💡 التوجيهات والاستراتيجيات المقترحة:
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#174F3F] dark:text-emerald-100 leading-relaxed">
                  {resultRange.recommendation}
                </p>
              </div>

              {/* Professional Attention Alert if applicable */}
              {resultRange.requiresProfessionalAttention && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>توصية بالمساندة المتخصصة:</span>
                  </div>
                  <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                    تشير النتائج إلى وجود عبء نفسي مرتفع. التواصل مع أخصائي أو طبيب نفسي يضمن لك الحصول على خطة متخصصة واستعادة السكينة والأمان.
                  </p>
                  {onOpenEmergencyHelp && (
                    <button
                      onClick={onOpenEmergencyHelp}
                      className="mt-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      طلب خطوط الدعم العاجل والإرشاد
                    </button>
                  )}
                </div>
              )}

              {/* Clinical Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                <strong>تنبيه هائم:</strong> {scale.disclaimer}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة إجراء المقياس</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 bg-[#F7F5EF] dark:bg-[#1C3329] border-t border-[#D5DED7] dark:border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            مقياس موثق استرشادي — مبادرة نسمة حياة
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#174F3F] hover:bg-[#23785B] text-white text-xs font-black transition-all cursor-pointer shadow-xs"
          >
            إغلاق المقياس
          </button>
        </div>

      </div>
    </div>
  );
};
