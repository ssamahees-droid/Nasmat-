/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KindnessWhispersModal Component
 * An interactive virtual Tree of Anonymous Kindness & Support Notes.
 * Users can pick golden leaves to read uplifting messages or plant their own leaf.
 */

import React, { useState, useEffect } from 'react';
import { SimpleIconX, SimpleIconCheck, SimpleIconSparkles } from './common/SimpleSvgIcons';

interface KindnessWhispersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WhisperNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

const DEFAULT_WHISPERS: WhisperNote[] = [
  {
    id: 'w_1',
    author: 'مسافر في واحة السكينة 🌸',
    content: 'يا صديقي المجهول، لا بأس إن تعبت اليوم، فالعاصفة تعبر والسكينة تعود دائماً لقلبك الطاهر.',
    createdAt: '2026-10-28',
    likes: 24
  },
  {
    id: 'w_2',
    author: 'قلب مطئن 🍃',
    content: 'خذ نفساً عميقاً... أنت تملك قوة بداخلك تضاهي كل المخاوف الصغيرة التي تؤرقك.',
    createdAt: '2026-10-27',
    likes: 19
  },
  {
    id: 'w_3',
    author: 'رفيق الرحلة ✨',
    content: 'لا تقارن فصلك الأول بفصل شخص آخر المائة، رحلتك فريدة وتستحق أن تمشيها ببطء وحب.',
    createdAt: '2026-10-26',
    likes: 31
  },
  {
    id: 'w_4',
    author: 'نسمة أمل 🌿',
    content: 'ابتسم؛ فالغيوم لا تبقى للابد في السماء، ونورك الداخلي سينشر دفأه قريباً.',
    createdAt: '2026-10-25',
    likes: 15
  }
];

const STORAGE_KEY = 'nesmat_kindness_whispers_v1';

export const KindnessWhispersModal: React.FC<KindnessWhispersModalProps> = ({ isOpen, onClose }) => {
  const [whispers, setWhispers] = useState<WhisperNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<WhisperNote | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [authorAlias, setAuthorAlias] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setWhispers(JSON.parse(stored));
        } else {
          setWhispers(DEFAULT_WHISPERS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WHISPERS));
        }
      } catch (_) {
        setWhispers(DEFAULT_WHISPERS);
      }
    }
  }, [isOpen]);

  const handlePlantLeaf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newWhisper: WhisperNote = {
      id: `w_${Date.now()}`,
      author: authorAlias.trim() || 'صديق مجهول 🍃',
      content: newNoteContent.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1
    };

    const updated = [newWhisper, ...whispers];
    setWhispers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setNewNoteContent('');
      setAuthorAlias('');
      setIsAdding(false);
      setSelectedNote(newWhisper);
    }, 1200);
  };

  const handleLike = (id: string) => {
    const updated = whispers.map((w) => w.id === id ? { ...w, likes: w.likes + 1 } : w);
    setWhispers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, likes: selectedNote.likes + 1 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-tajawal animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#D5DED7] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#E2EFE7] border-b border-[#D5DED7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#23785B]/30 flex items-center justify-center text-2xl shadow-xs">
              🌳
            </div>
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#174F3F] leading-tight">
                شجرة الهمسات المجهولة اللطيفة
              </h2>
              <p className="text-[14px] text-[#515B55] font-medium">
                اقتطف ورقة ذهبية أو اترك رسالة دعم لإخوانك في واحة نسمة حياة 🌸
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">

          {/* Plant new leaf view */}
          {isAdding ? (
            <form onSubmit={handlePlantLeaf} className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3 border-[#D5DED7]">
                <h3 className="text-lg font-bold text-[#174F3F] flex items-center gap-2">
                  <span>🍃</span>
                  <span>زرع ورقة همسة جديدة في الشجرة</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs font-bold text-[#515B55] hover:underline"
                >
                  إلغاء
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#174F3F]">
                  اسمك المستعار (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: رفيق السكينة، عابر أمل..."
                  value={authorAlias}
                  onChange={(e) => setAuthorAlias(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#D5DED7] focus:border-[#174F3F] outline-none text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#174F3F]">
                  رسالة الدعم والهمسة اللطيفة 💌
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب عبارة مشجعة ومطمئنة يستفيد منها كل من يقف عند هذه الشجرة..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#D5DED7] focus:border-[#174F3F] outline-none text-[16px] font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#174F3F] hover:bg-[#23785B] text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitted ? (
                  <>
                    <SimpleIconCheck size={18} />
                    <span>تم غرس همستك بنجاح 🍃</span>
                  </>
                ) : (
                  <>
                    <SimpleIconSparkles size={18} />
                    <span>اغرس الورقة في الشجرة الآن 🌳</span>
                  </>
                )}
              </button>
            </form>
          ) : selectedNote ? (
            /* Selected Note Detail */
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setSelectedNote(null)}
                className="text-xs font-bold text-[#174F3F] hover:underline"
              >
                ← العودة لاقتطاف ورقة أخرى
              </button>

              <div className="p-6 rounded-3xl bg-[#F8EED8] border-2 border-[#B78327]/30 text-[#292F2B] space-y-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-[#B78327]">
                  <span className="flex items-center gap-1">
                    <span>🍂</span>
                    <span>همسة مقتطعة من شجرة العرفان</span>
                  </span>
                  <span>{selectedNote.createdAt}</span>
                </div>

                <p className="text-[19px] leading-relaxed font-bold text-[#292F2B]">
                  "{selectedNote.content}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#B78327]/20">
                  <span className="text-xs font-bold text-[#515B55]">
                    — {selectedNote.author}
                  </span>

                  <button
                    onClick={() => handleLike(selectedNote.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#B78327]/40 text-[#174F3F] text-xs font-bold hover:bg-[#E2EFE7] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>❤️</span>
                    <span>امتنان ({selectedNote.likes})</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Leaves Grid View */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#515B55]">
                  انقر على أي ورقة لاقتطاف همسة طمأنينة 🍃
                </span>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 bg-[#174F3F] hover:bg-[#23785B] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>✨</span>
                  <span>اترك همستك المجهولة</span>
                </button>
              </div>

              {/* Tree Visual Banner with floating leaf cards */}
              <div className="p-6 rounded-3xl bg-[#E2EFE7] border-2 border-[#D5DED7] text-center relative overflow-hidden space-y-4">
                <div className="text-5xl animate-bounce">🌳</div>
                <h3 className="text-lg font-bold text-[#174F3F]">
                  شجرة السكينة تظللنا جميعاً
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {whispers.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedNote(w)}
                      className="p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F5EF] border border-[#D5DED7] hover:border-[#23785B] transition-all text-right cursor-pointer shadow-2xs space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#174F3F]">
                        <span className="flex items-center gap-1">
                          <span>🍃</span>
                          <span>{w.author}</span>
                        </span>
                        <span className="text-[#515B55]">❤️ {w.likes}</span>
                      </div>
                      <p className="text-sm font-medium text-[#292F2B] line-clamp-2 leading-snug">
                        "{w.content}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
