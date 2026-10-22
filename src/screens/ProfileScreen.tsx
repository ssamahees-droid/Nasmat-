import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Sparkles, 
  MessageCircle, 
  Bookmark, 
  Bell, 
  ShieldCheck, 
  Info, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  Download, 
  Trash2, 
  Check, 
  Lock, 
  Mail, 
  Phone,
  FileCheck,
  RotateCcw,
  Smartphone,
  Zap
} from 'lucide-react';
import { storage } from '../services/storage';
import { User, UserPreferences } from '../types';

interface ProfileScreenProps {
  onNavigate: (tab: string) => void;
  onOpenContent: (contentId: string) => void;
  onRestartOnboarding: () => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (t: 'dark' | 'light' | 'system') => void;
  fontSize: 'normal' | 'large' | 'extralarge';
  setFontSize: (f: 'normal' | 'large' | 'extralarge') => void;
  isMobilePerformanceMode?: boolean;
  onToggleMobilePerformanceMode?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  onOpenContent,
  onRestartOnboarding,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  isMobilePerformanceMode,
  onToggleMobilePerformanceMode
}) => {
  const [user, setUser] = useState<User>(storage.getUser());
  const [prefs, setPrefs] = useState<UserPreferences>(storage.getPreferences());
  const [activeModal, setActiveModal] = useState<
    'privacy' | 'about' | 'faq' | 'saved' | 'notifications' | 'edit_profile' | 'appearance' | null
  >(null);
  const [exportNotice, setExportNotice] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Mobile Performance Mode state & persistence
  const [internalPerfMode, setInternalPerfMode] = useState<boolean>(() => {
    if (typeof isMobilePerformanceMode === 'boolean') return isMobilePerformanceMode;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nesmat_mobile_perf_mode');
      if (saved !== null) return saved === 'true';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return isMobile || window.innerWidth < 768;
    }
    return false;
  });

  const effectivePerfMode = typeof isMobilePerformanceMode === 'boolean' ? isMobilePerformanceMode : internalPerfMode;

  const handleTogglePerfMode = () => {
    if (onToggleMobilePerformanceMode) {
      onToggleMobilePerformanceMode();
    } else {
      const next = !effectivePerfMode;
      setInternalPerfMode(next);
      localStorage.setItem('nesmat_mobile_perf_mode', String(next));
      if (next) {
        document.documentElement.classList.add('mobile-low-perf');
      } else {
        document.documentElement.classList.remove('mobile-low-perf');
      }
    }
  };

  // Edit profile state
  const [tempName, setTempName] = useState(user.name);
  const [tempContact, setTempContact] = useState(user.emailOrPhone);
  const [tempAvatar, setTempAvatar] = useState(user.avatarUrl || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateUserProfile(tempName, tempContact, tempAvatar);
    setUser(storage.getUser());
    setActiveModal(null);
  };

  const savedContentIds = storage.getFavorites();
  const savedItems = storage.getContent().filter(c => savedContentIds.includes(c.id));

  const handleExportData = () => {
    const jsonStr = storage.exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nesma_hayat_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleDeleteAllData = () => {
    storage.deleteAllUserData();
    alert('تم حذف جميع بياناتك الشخصية بنجاح وفق قانون حماية البيانات 151 لسنة 2020.');
    window.location.reload();
  };

  const handleToggleDailyReminder = () => {
    const updated = {
      ...prefs,
      notificationPreferences: {
        ...prefs.notificationPreferences,
        dailyReminder: !prefs.notificationPreferences.dailyReminder
      }
    };
    storage.savePreferences(updated);
    setPrefs(updated);
  };

  const handleToggleNewContent = () => {
    const updated = {
      ...prefs,
      notificationPreferences: {
        ...prefs.notificationPreferences,
        newContent: !prefs.notificationPreferences.newContent
      }
    };
    storage.savePreferences(updated);
    setPrefs(updated);
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6 text-right">
      
      {/* Profile Header */}
      <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#174C3C] text-white flex items-center justify-center font-bold text-xl shadow-xs overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="صورة البروفيل" className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name[0] : 'ن'
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#26332D]">
              {user.name || 'مرحباً بك'}
            </h1>
            <p className="text-xs text-[#52645B] font-mono mt-0.5">
              {user.emailOrPhone}
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#174C3C] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A9C5A0]" />
              <span>حساب نشط ومحمي</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveModal('edit_profile')}
          className="py-1.5 px-3 bg-white hover:bg-stone-100 text-[#174C3C] border border-[#E6E8D8] rounded-xl text-xs font-semibold transition-colors"
        >
          تعديل
        </button>
      </div>

      {/* Profile Menu Items (According to Spec page 20) */}
      <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl overflow-hidden shadow-xs divide-y divide-[#E6E8D8]/70">
        
        {/* 1. رحلتي */}
        <button
          onClick={() => onNavigate('journey')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/60 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                رحلتي
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                سجل الأيام، الملاحظات والتقييمات
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* 2. طلبات الدعم */}
        <button
          onClick={() => onNavigate('support')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100/60 text-sky-800 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                طلبات الدعم
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                متابعة التذاكر وتوجيهات الفريق
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* 3. المحفوظات */}
        <button
          onClick={() => setActiveModal('saved')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100/60 text-rose-800 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                المحفوظات
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                المقالات والتمارين المفضلة لديك ({savedItems.length})
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* 4. الإشعارات */}
        <button
          onClick={() => setActiveModal('notifications')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                الإشعارات
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                تذكيرات هادئة دون لوم أو ضغط
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* إعدادات المظهر وإمكانية القراءة */}
        <button
          onClick={() => setActiveModal('appearance')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100/60 text-violet-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                إعدادات المظهر وإمكانية القراءة
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                الوضع الفاتح والداكن، وحجم الخط
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* وضع أداء الهاتف (Mobile Performance Mode) */}
        <div className="w-full p-4 flex items-center justify-between hover:bg-white/80 transition-colors">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              effectivePerfMode 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-stone-200/60 text-stone-600'
            }`}>
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-right min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#26332D]">وضع أداء الهاتف</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  effectivePerfMode 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-stone-200 text-stone-600 border border-stone-300'
                }`}>
                  {effectivePerfMode ? 'مُفعّل' : 'معطّل'}
                </span>
              </div>
              <div className="text-[11px] text-[#7D8F85] line-clamp-1">
                تعطيل التأثيرات والرسوميات الثقيلة لتسريع الهاتف ومنع الوميض
              </div>
            </div>
          </div>
          <button
            type="button"
            dir="ltr"
            role="switch"
            aria-checked={effectivePerfMode}
            aria-label="تبديل وضع أداء الهاتف"
            onClick={handleTogglePerfMode}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#174C3C] focus:ring-offset-1 ${
              effectivePerfMode ? 'bg-[#174C3C]' : 'bg-stone-300'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                effectivePerfMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 5. الخصوصية */}
        <button
          onClick={() => setActiveModal('privacy')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100/60 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                الخصوصية والبيانات
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                حقوق المستخدم وفق قانون 151 لسنة 2020 وتصدير البيانات
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* 6. عن نسمة حياة */}
        <button
          onClick={() => setActiveModal('about')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-200/70 text-stone-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                عن نسمة حياة
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                الرؤية، الأهداف، والمحددات الطبية
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

        {/* 7. المساعدة والأسئلة الشائعة */}
        <button
          onClick={() => setActiveModal('faq')}
          className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100/60 text-indigo-800 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#174C3C]">
                المساعدة (FAQ / Help)
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                إجابات على أكثر الأسئلة شيوعاً
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>
      </div>

      {/* Onboarding choices review */}
      <div className="p-5 bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#26332D]">اختياراتك في شاشة التعارف:</span>
          <button
            onClick={onRestartOnboarding}
            className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التعارف</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {prefs.onboardingChoices.map(c => (
            <span key={c} className="text-xs px-2.5 py-1 bg-white border border-[#E6E8D8] rounded-xl text-[#35453E]">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Data Export & Privacy Actions (Section 23, 24, 28) */}
      <div className="p-5 bg-white/80 border border-[#E6E8D8] rounded-3xl space-y-4">
        <div className="text-xs font-bold text-[#26332D]">إدارة البيانات والامتثال:</div>
        
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleExportData}
            className="flex-1 py-3 px-3 bg-[#F7F3E9] hover:bg-stone-100 border border-[#E6E8D8] rounded-xl text-xs font-semibold text-[#174C3C] flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير بياناتي (JSON)</span>
          </button>

          <button
            onClick={() => setDeleteConfirm(true)}
            className="py-3 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>طلب حذف بياناتي</span>
          </button>
        </div>

        {exportNotice && (
          <p className="text-xs text-emerald-700 animate-fade-in">
            تم تنزيل ملف البيانات بنجاح!
          </p>
        )}

        {deleteConfirm && (
          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-3 animate-fade-in">
            <p className="text-xs text-rose-900 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف كافة بياناتك (الملاحظات، التقييمات، سجل الأيام) من جهازك؟ هذا الإجراء فوري ولا يمكن التراجع عنه.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAllData}
                className="py-2 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl"
              >
                تأكيد الحذف النهائي
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="py-2 px-3 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Modals for Section Details --- */}

      {/* Modal: Privacy Policy (Section 24 Specifications) */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">الخصوصية وسرية البيانات داخل التطبيق</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs text-[#35453E] leading-relaxed">
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-950 font-medium">
                «لا نكتب للمستخدم: بياناتك سرية 100% إلا بعد وجود بنية قانونية وتقنية تضمن هذا الوعد، وملتزمون بالشفافية الكاملة».
              </div>

              <div className="space-y-2">
                <p><strong>1. ما البيانات التي نجمعها:</strong> فقط ما تدخله باختيارك (الاسم المستعار، البريد/الهاتف، اختيارات التقييم والملاحظات اليومية). لا نطلب الموقع الجغرافي، جهات الاتصال، الكاميرا، الميكروفون، أو أي صلاحيات غير ضرورية.</p>
                <p><strong>2. لماذا نجمعها:</strong> لتمكينك من تتبع رحلتك الشخصية وتوجيهك للمحتوى الملائم وتسهيل التواصل عند طلب الدعم.</p>
                <p><strong>3. أين يتم تخزينها:</strong> يتم تخزين بياناتك محلياً في جهازك أو في قاعدة بيانات مشفرة بأعلى معايير الحماية والأمان.</p>
                <p><strong>4. من يستطيع الوصول إليها:</strong> أنت فقط، بالإضافة إلى مشرف الدعم في حال أرسلت طلب دعم محدد لمراجعته.</p>
                <p><strong>5. مشاركة البيانات مع طرف ثالث:</strong> لن يتم بيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض إعلانية على الإطلاق.</p>
                <p><strong>6. حقوقك وفق القانون المصري رقم 151 لسنة 2020:</strong> حق معرفة البيانات، تصحيحها، سحب الموافقة، وحق المحو الكامل والنسيان بنقرة واحدة.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E8D8]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Notifications (Section 26) */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">إعدادات الإشعارات</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <p className="text-xs text-[#52645B]">
              إشعارات نسمة حياة اختيارية، وهادئة، ولا تستخدم إطلاقاً لغة لوم أو ضغط مثل: «أنت نسيت تمرينك!» أو «فينك؟».
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E6E8D8]">
                <div>
                  <div className="text-xs font-bold text-[#26332D]">تذكير الهدوء اليومي 🌿</div>
                  <div className="text-[11px] text-[#52645B]">«حابب تاخد دقيقتين لنفسك النهارده؟»</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.notificationPreferences.dailyReminder}
                  onChange={handleToggleDailyReminder}
                  className="w-4 h-4 accent-[#174C3C]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E6E8D8]">
                <div>
                  <div className="text-xs font-bold text-[#26332D]">محتوى جديد قد يهمك 📖</div>
                  <div className="text-[11px] text-[#52645B]">إشعار عند نشر مقالات وتمارين جديدة</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.notificationPreferences.newContent}
                  onChange={handleToggleNewContent}
                  className="w-4 h-4 accent-[#174C3C]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E8D8]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Saved Content (المحفوظات) */}
      {activeModal === 'saved' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">المحتوى المحفوظ ({savedItems.length})</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            {savedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7D8F85]">
                لم تقم بحفظ أي مقالات أو تمارين بعد. يمكنك الضغط على علامة الحفظ في أي بطاقة بالمكتبة.
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveModal(null);
                      onOpenContent(item.id);
                    }}
                    className="p-3.5 bg-white hover:bg-stone-50 border border-[#E6E8D8] rounded-2xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#52645B] mb-1">
                      <span className="font-bold text-[#174C3C]">{item.subCategory || item.category}</span>
                      <span>{item.duration}</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#26332D]">{item.title}</h4>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#E6E8D8]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      {activeModal === 'edit_profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveProfile} className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">تعديل بيانات الحساب</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-4">
              {/* Avatar Preview & Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-2xl bg-[#174C3C] text-white flex items-center justify-center font-bold text-2xl shadow-sm overflow-hidden border-2 border-[#E6E8D8]">
                  {tempAvatar ? (
                    <img src={tempAvatar} alt="معاينة البروفيل" className="w-full h-full object-cover" />
                  ) : (
                    tempName ? tempName[0] : 'ن'
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <label className="cursor-pointer py-1.5 px-3 bg-white hover:bg-stone-100 text-[#174C3C] border border-[#E6E8D8] rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5">
                    <span>اختر صورة بروفيل جديدة</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setTempAvatar('/logo.jpg')}
                    className="text-[11px] text-[#174C3C] hover:underline"
                  >
                    استخدام شعار نسمة حياة 🌿
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332D] mb-1">الاسم أو اللقب</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E6E8D8] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332D] mb-1">البريد الإلكتروني أو الهاتف</label>
                <input
                  type="text"
                  value={tempContact}
                  onChange={(e) => setTempContact(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E6E8D8] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E8D8] flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 bg-white text-stone-600 border border-[#E6E8D8] text-xs font-semibold rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: FAQ / Help */}
      {activeModal === 'faq' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">الأسئلة الشائعة والمساعدة (FAQ)</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs text-[#35453E] leading-relaxed">
              <div className="p-3 bg-white rounded-xl border border-[#E6E8D8] space-y-1">
                <div className="font-bold text-[#26332D]">هل يقدم تطبيق نسمة حياة تشخيصاً طبياً؟</div>
                <p className="text-[#52645B]">كلا، التطبيق للتوعية والاستكشاف الذاتي الآمن فقط، وليس بديلاً عن الطبيب النفسي أو المرشد المعتمد.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E6E8D8] space-y-1">
                <div className="font-bold text-[#26332D]">هل يمكنني حذف بياناتي وملاحظاتي في أي وقت؟</div>
                <p className="text-[#52645B]">نعم بكل سهولة، من خلال زر «طلب حذف بياناتي» في شاشة حسابي، يتم محو كل السجلات فوراً.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E6E8D8] space-y-1">
                <div className="font-bold text-[#26332D]">كيف يمكنني طلب التحدث مع مختص؟</div>
                <p className="text-[#52645B]">من خلال قسم «محتاج أتكلم»، يمكنك إرسال رسالتك وسيتواصل معك الفريق بحسب آلية الدعم المتاحة.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E8D8]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: About */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">عن تطبيق نسمة حياة</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs text-[#35453E] leading-relaxed">
              <p>
                <strong>«نسمة حياة» (Nesmat Hayat)</strong> منصة نفسية عربية تسعى لنشر الوعي الصحي النفسي وتقديم مساحة هادئة للاسترخاء والفهم الذاتي بعيداً عن التعقيد والوصمة.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E6E8D8]">
                <strong>الهدف الأساسي:</strong>
                <p className="mt-1 text-[#52645B]">التوعية + الاستكشاف + الدعم + التوجيه إلى الخطوة المناسبة.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E8D8]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Appearance & Readability */}
      {activeModal === 'appearance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F3E9] border border-[#E6E8D8] rounded-3xl p-6 max-w-md w-full space-y-5 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8D8]">
              <h3 className="font-bold text-base text-[#26332D]">إعدادات المظهر وإمكانية القراءة</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            {/* Theme Section */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-[#26332D]">المظهر العام:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-stone-700 border-[#E6E8D8] hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">☀️</span>
                  <span>الوضع الفاتح</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    theme === 'dark'
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-stone-700 border-[#E6E8D8] hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">🌙</span>
                  <span>الوضع الداكن</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    theme === 'system'
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-stone-700 border-[#E6E8D8] hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">⚙️</span>
                  <span>حسب الجهاز</span>
                </button>
              </div>
            </div>

            {/* Font Size Section */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-[#26332D]">حجم الخط وإمكانية القراءة:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    fontSize === 'normal'
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-stone-700 border-[#E6E8D8] hover:bg-stone-50'
                  }`}
                >
                  <span className="text-sm font-normal">عادي</span>
                  <span className="text-[10px] opacity-80">16px</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    fontSize === 'large'
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-stone-700 border-[#E6E8D8] hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base font-semibold">كبير</span>
                  <span className="text-[10px] opacity-80">18px</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFontSize('extralarge')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    fontSize === 'extralarge'
                      ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-sm'
                      : 'bg-white text-stone-700 border-[#E6E8D8] hover:bg-stone-50'
                  }`}
                >
                  <span className="text-lg font-bold">كبير جداً</span>
                  <span className="text-[10px] opacity-80">20px</span>
                </button>
              </div>
            </div>

            {/* Mobile Performance Mode Section in Modal */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#E6E8D8] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    effectivePerfMode ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#26332D]">وضع أداء الهاتف (منع الوميض)</span>
                    <span className={`mr-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      effectivePerfMode ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {effectivePerfMode ? 'مُفعّل' : 'معطّل'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  dir="ltr"
                  role="switch"
                  aria-checked={effectivePerfMode}
                  aria-label="تبديل وضع أداء الهاتف"
                  onClick={handleTogglePerfMode}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#174C3C] ${
                    effectivePerfMode ? 'bg-[#174C3C]' : 'bg-stone-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      effectivePerfMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-[#52645B] leading-relaxed">
                يقوم بتعطيل الفلاتر المعقدة والظلال المركبة والتأثيرات الثقيلة لمنع وميض الشاشة وإعادة التحميل المتكررة على متصفح الهواتف.
              </p>
            </div>

            {/* Live Preview Sample */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#E6E8D8] space-y-1">
              <div className="text-[11px] text-stone-500 font-semibold">معاينة نصية فورية:</div>
              <p className="text-xs text-[#26332D] leading-relaxed">
                «هذا النص يوضح شكل الخط والمظهر المختار في تطبيق نسمة حياة لتجربة مريحة وآمنة.»
              </p>
            </div>

            <div className="pt-3 border-t border-[#E6E8D8]">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
