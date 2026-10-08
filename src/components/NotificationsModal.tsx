import React from 'react';
import { Bell, Check, X, Sparkles, BookOpen } from 'lucide-react';
import { storage } from '../services/storage';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContent?: () => void;
  onNavigateToBreathe?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToContent,
  onNavigateToBreathe
}) => {
  const notifs = storage.getNotifications();

  if (!isOpen) return null;

  const handleMarkRead = (id: string) => {
    storage.markNotificationAsRead(id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#355C4A]" />
            <h3 className="font-bold text-base text-[#26332D]">الإشعارات والتذكيرات</h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-[#52645B] leading-relaxed">
          إشعارات «نسمة حياة» مصممة دائماً لتكون لطيفة وغير ضاغطة على وقتك أو سلامك الداخلي.
        </p>

        <div className="space-y-2.5">
          {notifs.map(item => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                item.read 
                  ? 'bg-white/60 border-[#E8DDCC] text-stone-700' 
                  : 'bg-white border-[#8FAF9A]/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#26332D]">
                  {!item.read && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  <span>{item.title}</span>
                </div>
                <span className="font-mono text-[10px] text-[#7D8F85]">
                  {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>

              <p className="text-xs text-[#52645B] leading-relaxed">
                {item.body}
              </p>

              <div className="mt-2.5 pt-2 border-t border-[#E8DDCC]/50 flex items-center justify-between text-[11px]">
                {item.type === 'reminder' && onNavigateToBreathe && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateToBreathe();
                    }}
                    className="text-[#355C4A] font-bold hover:underline"
                  >
                    بدء التمرين الآن ←
                  </button>
                )}
                {item.type === 'content' && onNavigateToContent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateToContent();
                    }}
                    className="text-[#355C4A] font-bold hover:underline"
                  >
                    تصفح المحتوى ←
                  </button>
                )}
                <span className="text-[10px] text-stone-400">
                  {item.read ? 'تمت القراءة' : 'اضغط للتعليم كمقروء'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#E8DDCC]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl hover:bg-[#264235] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
