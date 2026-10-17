import React, { useState } from 'react';
import { Bell, Check, X, Sparkles, BookOpen, Utensils, ShieldCheck, RefreshCw } from 'lucide-react';
import { storage } from '../services/storage';
import { NotificationItem } from '../types';
import { localNotificationService } from '../services/localNotificationService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContent?: () => void;
  onNavigateToBreathe?: () => void;
  onOpenMoodKitchen?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToContent,
  onNavigateToBreathe,
  onOpenMoodKitchen
}) => {
  const [notifs, setNotifs] = useState<NotificationItem[]>(() => storage.getNotifications());
  const [permissionState, setPermissionState] = useState<string>(() => localNotificationService.getNativePermission());

  if (!isOpen) return null;

  const handleMarkRead = (id: string) => {
    storage.markNotificationAsRead(id);
    setNotifs(storage.getNotifications());
  };

  const handleRequestPermission = async () => {
    const res = await localNotificationService.requestNativePermission();
    setPermissionState(res);
  };

  const handleTestReminder = () => {
    const item = localNotificationService.triggerTestReminder();
    setNotifs(storage.getNotifications());
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#F7F3E9] dark:bg-[#14271F] dark:border-[#A9C5A0]/20 dark:text-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#174C3C] dark:text-emerald-400" />
            <h3 className="font-bold text-base text-[#26332D] dark:text-white">الإشعارات والتذكيرات المحلية</h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 24-Hour Mood Kitchen Reminder Status & Tester */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span>تذكير مطبخ المزاج (كل ٢٤ ساعة)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
              مفعّل تلقائياً
            </span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
            يُرسل النظام تنبيهاً ذكياً بأنشطة مهدئة وتذكير بفتح مطبخ المزاج إذا مرت أكثر من ٢٤ ساعة دون تسجيل وجبتك وحالتك النفسية.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleTestReminder}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تجربة التنبيه الآن 🔔</span>
            </button>

            {permissionState !== 'granted' && permissionState !== 'unsupported' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
              >
                تفعيل إشعارات المتصفح
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#52645B] dark:text-stone-400 leading-relaxed">
          إشعارات «نسمة حياة» مصممة دائماً لتكون لطيفة وغير ضاغطة على وقتك أو سلامك الداخلي.
        </p>

        <div className="space-y-2.5">
          {notifs.map(item => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                item.read 
                  ? 'bg-white/60 dark:bg-white/5 border-[#E6E8D8] dark:border-white/10 text-stone-700 dark:text-stone-300' 
                  : 'bg-white dark:bg-emerald-950/20 border-[#A9C5A0]/60 dark:border-emerald-500/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#26332D] dark:text-white">
                  {!item.read && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  <span>{item.title}</span>
                </div>
                <span className="font-mono text-[10px] text-[#7D8F85] dark:text-stone-400">
                  {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>

              <p className="text-xs text-[#52645B] dark:text-stone-300 leading-relaxed">
                {item.body}
              </p>

              <div className="mt-2.5 pt-2 border-t border-[#E6E8D8]/50 dark:border-white/10 flex items-center justify-between text-[11px]">
                {item.type === 'mood_kitchen' && onOpenMoodKitchen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onOpenMoodKitchen();
                    }}
                    className="text-amber-700 dark:text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>فتح مطبخ المزاج والأنشطة 🍳 ←</span>
                  </button>
                )}

                {item.type === 'reminder' && onNavigateToBreathe && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onNavigateToBreathe();
                    }}
                    className="text-[#174C3C] dark:text-emerald-400 font-bold hover:underline"
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
                    className="text-[#174C3C] dark:text-emerald-400 font-bold hover:underline"
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

        <div className="pt-2 border-t border-[#E6E8D8] dark:border-white/10">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#174C3C] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
