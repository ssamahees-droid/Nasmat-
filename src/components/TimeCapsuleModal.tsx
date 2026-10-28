/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TimeCapsuleModal Component
 * Allows users to seal a message to their future self with a countdown timer,
 * unlock notification, and inspiring warm prompts.
 */

import React, { useState, useEffect } from 'react';
import { SimpleIconX, SimpleIconCheck, SimpleIconSparkles } from './common/SimpleSvgIcons';

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CapsuleItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  unlockAt: string;
  category: 'hope' | 'gratitude' | 'advice' | 'dream';
  isOpened: boolean;
}

const CAPSULES_STORAGE_KEY = 'nesmat_time_capsules_v1';

export const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({ isOpen, onClose }) => {
  const [capsules, setCapsules] = useState<CapsuleItem[]>([]);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'hope' | 'gratitude' | 'advice' | 'dream'>('hope');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleItem | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCapsules();
    }
  }, [isOpen]);

  const loadCapsules = () => {
    try {
      const stored = localStorage.getItem(CAPSULES_STORAGE_KEY);
      if (stored) {
        setCapsules(JSON.parse(stored));
      } else {
        // Sample default welcome capsule
        const initialCapsule: CapsuleItem = {
          id: 'cap_welcome',
          title: 'رسالة ترحيبية من واحة نسمة حياة 🌸',
          content: 'تذكر دائماً أنك أقوى مما تعتقد، وأن كل لحظة ضيق تحمل في طياتها بداية جديدة وفرصة لاكتشاف سكونك الداخلي.',
          createdAt: new Date().toISOString(),
          unlockAt: new Date().toISOString(), // Already unlocked
          category: 'hope',
          isOpened: false
        };
        setCapsules([initialCapsule]);
        localStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify([initialCapsule]));
      }
    } catch (_) {}
  };

  const handleCreateCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const now = new Date();
    const unlockDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const newCapsule: CapsuleItem = {
      id: `cap_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      createdAt: now.toISOString(),
      unlockAt: unlockDate.toISOString(),
      category,
      isOpened: false
    };

    const updated = [newCapsule, ...capsules];
    setCapsules(updated);
    try {
      localStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setTitle('');
      setContent('');
      setView('list');
    }, 1500);
  };

  const isUnlocked = (capsule: CapsuleItem) => {
    return new Date(capsule.unlockAt).getTime() <= new Date().getTime();
  };

  const getTimeRemaining = (unlockAt: string) => {
    const diff = new Date(unlockAt).getTime() - new Date().getTime();
    if (diff <= 0) return 'جاهزة للفتح الآن ✨';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `متبقي ${days} يوم و ${hours} ساعة`;
    return `متبقي ${hours} ساعة فقط`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-tajawal animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#E2EFE7] border-b border-[#D5DED7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#23785B]/30 flex items-center justify-center text-2xl shadow-xs">
              ⏳
            </div>
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#174F3F] leading-tight">
                كبسولة الزمن والسكينة
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#515B55] font-medium">
                رسائل موثقة لنسختك المستقبليّة تتفتح في الوقت الموعود ✨
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#292F2B] border border-[#D5DED7] flex items-center justify-center transition-all cursor-pointer"
          >
            <SimpleIconX size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-[#D5DED7] flex items-center gap-3 bg-[#F7F5EF] shrink-0">
          <button
            onClick={() => { setView('list'); setSelectedCapsule(null); }}
            className={`px-4 py-2.5 font-bold text-[15px] rounded-t-xl transition-all cursor-pointer border-b-2 ${
              view === 'list' 
                ? 'border-[#174F3F] text-[#174F3F] bg-[#FFFFFF]' 
                : 'border-transparent text-[#515B55] hover:text-[#174F3F]'
            }`}
          >
            كبسولاتي المحفوظة ({capsules.length})
          </button>
          <button
            onClick={() => { setView('create'); setSelectedCapsule(null); }}
            className={`px-4 py-2.5 font-bold text-[15px] rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              view === 'create' 
                ? 'border-[#174F3F] text-[#174F3F] bg-[#FFFFFF]' 
                : 'border-transparent text-[#515B55] hover:text-[#174F3F]'
            }`}
          >
            <span>✨</span>
            <span>صياغة كبسولة جديدة</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">

          {/* View Single Capsule Detail */}
          {selectedCapsule ? (
            <div className="space-y-5 animate-fade-in">
              <button
                onClick={() => setSelectedCapsule(null)}
                className="text-[14px] font-bold text-[#174F3F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← العودة إلى قائمة الكبسولات
              </button>

              <div className="p-6 rounded-3xl bg-[#F7F5EF] border-2 border-[#D5DED7] space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-[#D5DED7]">
                  <span className="px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174F3F] text-xs font-bold border border-[#23785B]/30">
                    {selectedCapsule.category === 'hope' && '🌸 أمل وطمأنينة'}
                    {selectedCapsule.category === 'gratitude' && '✨ امتنان وعرفان'}
                    {selectedCapsule.category === 'advice' && '🍃 نصيحة للذات'}
                    {selectedCapsule.category === 'dream' && '⭐ حلم وأمنية'}
                  </span>
                  <span className="text-xs text-[#515B55] font-bold">
                    تاريخ الإنشاء: {new Date(selectedCapsule.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <h3 className="text-[20px] font-bold text-[#174F3F]">
                  {selectedCapsule.title}
                </h3>

                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D5DED7] text-[#292F2B] text-[17px] leading-relaxed whitespace-pre-wrap font-medium">
                  "{selectedCapsule.content}"
                </div>

                <div className="text-center pt-2 text-xs text-[#515B55]">
                  رسالتك هذه شمعة أضاءت طريقك في الماضي وتدفئ قلبك الآن 🌸
                </div>
              </div>
            </div>
          ) : view === 'list' ? (
            /* List View */
            <div className="space-y-4">
              {capsules.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <span className="text-4xl">🔐</span>
                  <p className="text-[#515B55] font-bold">لم تقم بصياغة أي كبسولة زَمنيّة بعد.</p>
                  <button
                    onClick={() => setView('create')}
                    className="px-5 py-2.5 bg-[#174F3F] text-white font-bold rounded-xl text-sm hover:bg-[#23785B] cursor-pointer"
                  >
                    أغلق أول كبسولة الآن ⏳
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {capsules.map((cap) => {
                    const unlocked = isUnlocked(cap);
                    return (
                      <div
                        key={cap.id}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                          unlocked 
                            ? 'bg-[#E2EFE7] border-[#23785B] shadow-xs' 
                            : 'bg-[#F7F5EF] border-[#D5DED7] opacity-90'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className={`px-2.5 py-1 rounded-full ${unlocked ? 'bg-[#174F3F] text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                              {unlocked ? '🔓 مفتوحة للسياد' : '🔒 مقفلة في كبسولة'}
                            </span>
                            <span className="text-[#515B55]">
                              {getTimeRemaining(cap.unlockAt)}
                            </span>
                          </div>

                          <h4 className="font-bold text-[17px] text-[#174F3F] line-clamp-2">
                            {cap.title}
                          </h4>
                        </div>

                        <div>
                          {unlocked ? (
                            <button
                              onClick={() => setSelectedCapsule(cap)}
                              className="w-full py-2.5 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>اقرأ الرسالة الآن</span>
                              <SimpleIconSparkles size={16} />
                            </button>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5DED7] text-center text-xs text-[#515B55] font-bold">
                              الرسالة محفوظة بأمان وسوف تتفتح في الموعد الموعود ⏳
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Create View */
            <form onSubmit={handleCreateCapsule} className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#E2EFE7] border border-[#23785B]/30 text-[#174F3F] text-sm font-medium leading-relaxed">
                💡 **همسة إلهام**: اكتب كلمات طيبة ومطمئنة تشكر فيها نفسك أو تنصحها بها عندما تمر بأوقات انقضاء أو تحديات.
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#174F3F]">
                  عنوان الكبسولة 📌
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رسالة طمأنينة عند اجتياز الامتحانات..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#D5DED7] focus:border-[#174F3F] outline-none text-[16px] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-[#174F3F] mb-1">
                    تصنيف الرسالة 🏷️
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#D5DED7] focus:border-[#174F3F] outline-none text-sm font-bold bg-[#FFFFFF]"
                  >
                    <option value="hope">🌸 أمل وطمأنينة</option>
                    <option value="gratitude">✨ امتنان وعرفان</option>
                    <option value="advice">🍃 نصيحة للذات</option>
                    <option value="dream">⭐ حلم وأمنية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#174F3F] mb-1">
                    موعد الفتح ⏳
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#D5DED7] focus:border-[#174F3F] outline-none text-sm font-bold bg-[#FFFFFF]"
                  >
                    <option value={3}>بعد ٣ أيام</option>
                    <option value={7}>بعد أسبوع (٧ أيام)</option>
                    <option value={14}>بعد أسبوعين (١٤ يوماً)</option>
                    <option value={30}>بعد شهر (٣٠ يوماً)</option>
                    <option value={90}>بعد ٣ أشهر</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#174F3F]">
                  مضمون الرسالة ✍️
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب رسالتك لنسختك المستقبليّة..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#D5DED7] focus:border-[#174F3F] outline-none text-[16px] font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-5 py-3 rounded-xl border border-[#D5DED7] text-[#515B55] font-bold text-sm hover:bg-[#F7F5EF]"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  {savedSuccess ? (
                    <>
                      <SimpleIconCheck size={18} />
                      <span>تم القفل بنجاح 🔒</span>
                    </>
                  ) : (
                    <>
                      <span>أغلق الكبسولة الآن 🔒</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
