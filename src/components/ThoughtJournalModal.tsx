import React, { useState, useEffect } from 'react';
import { 
  X, 
  PenTool, 
  Plus, 
  Trash2, 
  Edit3, 
  Bookmark, 
  Search, 
  Sparkles, 
  Check, 
  Calendar, 
  Heart, 
  Tag, 
  Share2, 
  Download,
  Smile,
  RefreshCw,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { storage, ThoughtPost, ThoughtCategory } from '../services/storage';
import { MoodValue } from '../types';
import { TakeawayResultCard } from './TakeawayResultCard';

interface ThoughtJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_MAP: Record<ThoughtCategory, { label: string; emoji: string; color: string; bg: string }> = {
  awareness: { label: 'وعي باللحظة', emoji: '🌿', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
  gratitude: { label: 'امتنان', emoji: '🍯', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
  reframing: { label: 'إعادة صياغة', emoji: '🔄', color: 'text-teal-800', bg: 'bg-teal-50 border-teal-200' },
  release: { label: 'تحرير وتفريغ', emoji: '🍃', color: 'text-sky-800', bg: 'bg-sky-50 border-sky-200' },
  gentleness: { label: 'رفق بالذات', emoji: '🤍', color: 'text-rose-800', bg: 'bg-rose-50 border-rose-200' }
};

const PROMPTS = [
  'فكرة شاغلة بالي الآن وأحتاج أراقبها بمسافة دون تصديقها...',
  '3 نعم صغيرة أحاطت بي اليوم دون مجهود مني...',
  'ما الذي أود التخلي عن التحكم فيه اليوم لأرتاح؟',
  'رسالة رفق أكتبها لنفسي في هذا الموقف الصعب...',
  'لو أن شخصاً عزيزاً عليّ يمر بهذا، ماذا كنت سأقول له؟',
  'ما الشيء الحقيقي في هذه اللحظة، وما الشيء الذي يضيفه عقلي؟'
];

export const ThoughtJournalModal: React.FC<ThoughtJournalModalProps> = ({ isOpen, onClose }) => {
  const [posts, setPosts] = useState<ThoughtPost[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'new'>('feed');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New entry state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ThoughtCategory>('awareness');
  const [newMood, setNewMood] = useState<MoodValue | undefined>('good');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPosts(storage.getThoughtPosts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const titleToUse = newTitle.trim() || (selectedPrompt ? selectedPrompt.slice(0, 35) + '...' : 'تأمل هادئ');
    const created = storage.addThoughtPost({
      title: titleToUse,
      content: newContent.trim(),
      category: newCategory,
      mood: newMood,
      promptUsed: selectedPrompt || undefined,
      isFavorite: false
    });

    setPosts(storage.getThoughtPosts());
    setNewTitle('');
    setNewContent('');
    setSelectedPrompt('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('feed');
    }, 1500);
  };

  const handleDeletePost = (id: string) => {
    storage.deleteThoughtPost(id);
    setPosts(storage.getThoughtPosts());
  };

  const handleToggleFavorite = (id: string) => {
    storage.toggleThoughtFavorite(id);
    setPosts(storage.getThoughtPosts());
  };

  const handleExportPost = (post: ThoughtPost) => {
    const text = `==============================
مدونة الأفكار — نسمة حياة 🌿
العنوان: ${post.title}
التصنيف: ${CATEGORY_MAP[post.category]?.label || post.category}
التاريخ: ${new Date(post.createdAt).toLocaleDateString('ar-EG')}
${post.promptUsed ? `المحفز: ${post.promptUsed}\n` : ''}
------------------------------
${post.content}
==============================
تذكر: أنت لست أفكارك.. أنت الفضاء الواسع الذي تمر فيه الأفكار بسلام.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تدوينة_فكرة_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategoryFilter === 'all' || post.category === selectedCategoryFilter;
    const matchesSearch = !searchQuery.trim() || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#E5DACB] rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_-10px_rgba(58,90,64,0.25)] overflow-hidden text-right max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DACB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center text-2xl shadow-inner">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#283618]">
                  مدونة الأفكار والخواطر
                </h2>
                <span className="text-[10px] bg-[#3A5A40]/15 text-[#3A5A40] px-2.5 py-0.5 rounded-full font-bold">
                  مساحة تفكير وتفريغ واعي
                </span>
              </div>
              <p className="text-xs text-[#58645C] mt-0.5">
                تأملات، تفريغ للأفكار بمسافة آمنة، وتدريب على إعادة الصياغة والامتنان
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(prev => prev === 'feed' ? 'new' : 'feed')}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-[#3A5A40] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F2ECE3] text-[#3A5A40] border border-[#E5DACB]'
              }`}
            >
              {activeTab === 'new' ? (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>تصفح التدوينات</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>اكتب فكرة جديدة</span>
                </>
              )}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          {activeTab === 'new' ? (
            /* Write New Thought Form */
            <form onSubmit={handleCreatePost} className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 leading-relaxed">
                💡 <strong>قاعدة اليقظة الذهنية مع الأفكار:</strong> لا تحارب الفكرة ولا تصدقها تلقائياً.. ضعها على الورق، وانظر إليها كعابر سبيل.
              </div>

              {/* Prompts Picker */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#283618] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#DDA15E]" />
                  <span>اختر محفزاً للتأمل (اختياري):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PROMPTS.map((pr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPrompt(pr);
                        if (!newTitle) setNewTitle(pr.slice(0, 30) + '...');
                      }}
                      className={`text-[11px] p-2 rounded-xl border text-right transition-all leading-snug ${
                        selectedPrompt === pr
                          ? 'bg-[#3A5A40] text-white border-[#3A5A40] font-bold'
                          : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#283618] block">تصنيف الفكرة:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(CATEGORY_MAP) as ThoughtCategory[]).map((cat) => {
                    const info = CATEGORY_MAP[cat];
                    const isSelected = newCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewCategory(cat)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-xs'
                            : 'bg-white hover:bg-[#F2ECE3] text-[#283618] border-[#E5DACB]'
                        }`}
                      >
                        <span>{info.emoji}</span>
                        <span>{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#283618] mb-1">
                    عنوان الفكرة (اختياري):
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: وقفة مع الصوت الداخلي الناقد..."
                    className="w-full p-3 bg-white border border-[#E5DACB] focus:border-[#3A5A40] rounded-2xl text-xs text-[#283618] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#283618] mb-1">
                    محتوى الفكرة والتأمل:
                  </label>
                  <textarea
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="اكتب أفكارك بحرية تامة وبدون تصحيح أو خجل... ماذا تشعر؟ وماذا يقترح عقلك؟"
                    className="w-full p-3.5 bg-white border border-[#E5DACB] focus:border-[#3A5A40] rounded-2xl text-xs text-[#283618] outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Mood Associated */}
              <div className="flex items-center justify-between p-3 bg-white border border-[#E5DACB] rounded-2xl">
                <span className="text-xs font-bold text-[#283618]">شحنة المشاعر أثناء الكتابة:</span>
                <div className="flex gap-2">
                  {(['good', 'fair', 'confused', 'not_good', 'exhausted'] as MoodValue[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setNewMood(m)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all ${
                        newMood === m ? 'border-[#3A5A40] bg-[#3A5A40]/15 scale-110' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {m === 'good' ? '😊' : m === 'fair' ? '😐' : m === 'confused' ? '🤔' : m === 'not_good' ? '😔' : '😫'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!newContent.trim()}
                className="w-full py-3.5 bg-[#3A5A40] hover:bg-[#283618] disabled:opacity-50 text-white text-xs font-black rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{savedSuccess ? 'تم حفظ التدوينة بنجاح ✓' : 'حفظ الفكرة في مدونتي'}</span>
              </button>
            </form>
          ) : (
            /* Feed / Explore Thoughts */
            <div className="space-y-4 animate-fade-in">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث في الخواطر والتدوينات..."
                    className="w-full py-2.5 pr-10 pl-3 bg-white border border-[#E5DACB] rounded-2xl text-xs text-[#283618] outline-none"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-[#3A5A40] text-white shadow-2xs'
                        : 'bg-white hover:bg-stone-50 text-[#58645C] border border-[#E5DACB]'
                    }`}
                  >
                    الكل ({posts.length})
                  </button>
                  {(Object.keys(CATEGORY_MAP) as ThoughtCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                        selectedCategoryFilter === cat
                          ? 'bg-[#3A5A40] text-white shadow-2xs'
                          : 'bg-white hover:bg-stone-50 text-[#58645C] border border-[#E5DACB]'
                      }`}
                    >
                      <span>{CATEGORY_MAP[cat].emoji}</span>
                      <span>{CATEGORY_MAP[cat].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts Stream */}
              <div className="space-y-3.5">
                {filteredPosts.length === 0 ? (
                  <div className="p-8 bg-white border border-[#E5DACB] rounded-3xl text-center space-y-2">
                    <span className="text-3xl">🍃</span>
                    <h3 className="font-bold text-sm text-[#283618]">لا توجد خواطر مسجلة في هذا القسم</h3>
                    <p className="text-xs text-[#58645C]">ابدأ بكتابة أول فكرة أو تأمل واعي لتهدئة ذهنك.</p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="mt-2 py-2 px-4 bg-[#3A5A40] text-white text-xs font-bold rounded-xl"
                    >
                      كتابة فكرة الآن
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => {
                    const catInfo = CATEGORY_MAP[post.category] || CATEGORY_MAP.awareness;
                    return (
                      <div
                        key={post.id}
                        className="p-5 bg-white border border-[#E5DACB] hover:border-[#3A5A40] rounded-3xl transition-all shadow-xs space-y-3 text-right group"
                      >
                        {/* Meta Top */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${catInfo.bg} ${catInfo.color}`}>
                              {catInfo.emoji} {catInfo.label}
                            </span>
                            <span className="text-[11px] text-[#7D8F85]">
                              {new Date(post.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleFavorite(post.id)}
                              className={`p-1.5 rounded-full transition-colors ${
                                post.isFavorite ? 'text-amber-600 bg-amber-50' : 'text-stone-300 hover:text-stone-600'
                              }`}
                              title="حفظ في المفضلة"
                            >
                              <Bookmark className={`w-4 h-4 ${post.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => handleExportPost(post)}
                              className="p-1.5 text-stone-400 hover:text-[#3A5A40] rounded-full hover:bg-stone-100 transition-colors"
                              title="تصدير وتنزيل التدوينة"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                              title="حذف التدوينة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Content */}
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-[#283618] leading-snug">
                            {post.title}
                          </h3>
                          {post.promptUsed && (
                            <div className="text-[11px] text-[#3A5A40] font-medium mt-1">
                              محفز التأمل: «{post.promptUsed}»
                            </div>
                          )}
                          <p className="text-xs sm:text-sm text-[#38463E] mt-2 leading-relaxed whitespace-pre-wrap font-medium">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <TakeawayResultCard
                quote="«الأفكار مجرد ضيوف تأتي وتذهب.. لست مضطراً لتقديم الشاي لكل فكرة عابرة»"
                onTryAnother={() => setActiveTab('new')}
                onBackToHome={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
