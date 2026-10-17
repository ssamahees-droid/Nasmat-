import React, { useState } from 'react';
import { Star, Heart, Check, Sparkles, MessageSquare } from 'lucide-react';
import { storage } from '../services/storage';
import { chimeService } from '../services/chimeService';

export interface ActivityRatingItem {
  activityId: string;
  activityTitle: string;
  category: string;
}

interface ActivityRatingModalProps {
  isOpen: boolean;
  activity: ActivityRatingItem | null;
  onClose: () => void;
  onSubmitted?: (rating: number) => void;
  theme?: 'dark' | 'light' | 'system';
}

export const ActivityRatingModal: React.FC<ActivityRatingModalProps> = ({
  isOpen,
  activity,
  onClose,
  onSubmitted,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      storage.addActivityRating({
        activityId: activity.activityId,
        activityTitle: activity.activityTitle,
        category: activity.category,
        rating,
        feedback: feedback.trim()
      });
      chimeService.playSuccessChime();
    } catch {}

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      setRating(5);
      if (onSubmitted) onSubmitted(rating);
      onClose();
    }, 1600);
  };

  const ratingLabels: Record<number, string> = {
    1: 'يحتاج لتحسين وتطوير 🍃',
    2: 'مقبول، أدى غرضاً مؤقتاً 🌿',
    3: 'جيد ومفيد 🌟',
    4: 'مفيد جداً وأراحني كثيراً ✨',
    5: 'رائع للغاية وأحدث فرقاً عميقاً في نفسي 💚'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 text-right relative overflow-hidden ${
        isDark ? 'bg-[#14271F] border-emerald-500/40 text-white' : 'bg-white border-emerald-600/30 text-stone-900'
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 text-2xl mx-auto shadow-inner">
                🌟
              </div>
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                كيف وجدت هذا التمرين؟
              </h3>
              <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                قيم تجربتك في <span className="font-bold text-emerald-400">«{activity.activityTitle}»</span> لنساعدك على تطوير الأفضل دوماً.
              </p>
            </div>

            {/* Stars Selector */}
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="flex items-center gap-2" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        setRating(star);
                        try { chimeService.playBubblePopChime(); } catch {}
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          active 
                            ? 'fill-amber-400 text-amber-400 drop-shadow' 
                            : isDark ? 'text-stone-700' : 'text-stone-300'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-emerald-400 h-5">
                {ratingLabels[hoverRating || rating]}
              </span>
            </div>

            {/* Optional Feedback Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1.5 text-stone-300">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>ملاحظات إضافية (اختياري):</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="اكتب ما فادك أو ما تود تحسينه..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/20 border border-white/10 focus:border-emerald-500 focus:outline-none text-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                تخطي
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>حفظ التقييم 💚</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg animate-bounce">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">شكراً لتقييمك الصادق 🌿</h4>
              <p className="text-xs text-stone-300">تم تسجيل رأيك بنجاح لدعم رحلة نموك النفسي.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
