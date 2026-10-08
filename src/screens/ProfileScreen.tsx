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
  RotateCcw
} from 'lucide-react';
import { storage } from '../services/storage';
import { User, UserPreferences } from '../types';

interface ProfileScreenProps {
  onNavigate: (tab: string) => void;
  onOpenContent: (contentId: string) => void;
  onRestartOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  onOpenContent,
  onRestartOnboarding
}) => {
  const [user, setUser] = useState<User>(storage.getUser());
  const [prefs, setPrefs] = useState<UserPreferences>(storage.getPreferences());
  const [activeModal, setActiveModal] = useState<
    'privacy' | 'about' | 'faq' | 'saved' | 'notifications' | 'edit_profile' | null
  >(null);
  const [exportNotice, setExportNotice] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Edit profile state
  const [tempName, setTempName] = useState(user.name);
  const [tempContact, setTempContact] = useState(user.emailOrPhone);

  const savedContentIds = storage.getFavorites();
  const savedItems = storage.getContent().filter(c => savedContentIds.includes(c.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateUserProfile(tempName, tempContact);
    setUser(storage.getUser());
    setActiveModal(null);
  };

  const handleExportData = () => {
    const jsonStr = storage.exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nesmat_alhayat_data_${new Date().toISOString().split('T')[0]}.json`;
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
      <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#355C4A] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {user.name ? user.name[0] : 'ن'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#26332D]">
              {user.name || 'مرحباً بك'}
            </h1>
            <p className="text-xs text-[#52645B] font-mono mt-0.5">
              {user.emailOrPhone}
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#355C4A] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8FAF9A]" />
              <span>حساب نشط ومحمي</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveModal('edit_profile')}
          className="py-1.5 px-3 bg-white hover:bg-stone-100 text-[#355C4A] border border-[#E8DDCC] rounded-xl text-xs font-semibold transition-colors"
        >
          تعديل
        </button>
      </div>

      {/* Profile Menu Items (According to Spec page 20) */}
      <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl overflow-hidden shadow-xs divide-y divide-[#E8DDCC]/70">
        
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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
                الإشعارات
              </div>
              <div className="text-[11px] text-[#7D8F85]">
                تذكيرات هادئة دون لوم أو ضغط
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#7D8F85]" />
        </button>

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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
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
              <div className="text-sm font-bold text-[#26332D] group-hover:text-[#355C4A]">
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
      <div className="p-5 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#26332D]">اختياراتك في شاشة التعارف:</span>
          <button
            onClick={onRestartOnboarding}
            className="text-xs font-semibold text-[#355C4A] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التعارف</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {prefs.onboardingChoices.map(c => (
            <span key={c} className="text-xs px-2.5 py-1 bg-white border border-[#E8DDCC] rounded-xl text-[#35453E]">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Data Export & Privacy Actions (Section 23, 24, 28) */}
      <div className="p-5 bg-white/80 border border-[#E8DDCC] rounded-3xl space-y-4">
        <div className="text-xs font-bold text-[#26332D]">إدارة البيانات والامتثال:</div>
        
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleExportData}
            className="flex-1 py-3 px-3 bg-[#FAF7F0] hover:bg-stone-100 border border-[#E8DDCC] rounded-xl text-xs font-semibold text-[#355C4A] flex items-center justify-center gap-2 transition-colors"
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
          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
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

            <div className="pt-3 border-t border-[#E8DDCC]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
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
          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
              <h3 className="font-bold text-base text-[#26332D]">إعدادات الإشعارات</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <p className="text-xs text-[#52645B]">
              إشعارات نسمة حياة اختيارية، وهادئة، ولا تستخدم إطلاقاً لغة لوم أو ضغط مثل: «أنت نسيت تمرينك!» أو «فينك؟».
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E8DDCC]">
                <div>
                  <div className="text-xs font-bold text-[#26332D]">تذكير الهدوء اليومي 🌿</div>
                  <div className="text-[11px] text-[#52645B]">«حابب تاخد دقيقتين لنفسك النهارده؟»</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.notificationPreferences.dailyReminder}
                  onChange={handleToggleDailyReminder}
                  className="w-4 h-4 accent-[#355C4A]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E8DDCC]">
                <div>
                  <div className="text-xs font-bold text-[#26332D]">محتوى جديد قد يهمك 📖</div>
                  <div className="text-[11px] text-[#52645B]">إشعار عند نشر مقالات وتمارين جديدة</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.notificationPreferences.newContent}
                  onChange={handleToggleNewContent}
                  className="w-4 h-4 accent-[#355C4A]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DDCC]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
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
          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
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
                    className="p-3.5 bg-white hover:bg-stone-50 border border-[#E8DDCC] rounded-2xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#52645B] mb-1">
                      <span className="font-bold text-[#355C4A]">{item.subCategory || item.category}</span>
                      <span>{item.duration}</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#26332D]">{item.title}</h4>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#E8DDCC]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
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
          <form onSubmit={handleSaveProfile} className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
              <h3 className="font-bold text-base text-[#26332D]">تعديل بيانات الحساب</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#26332D] mb-1">الاسم أو اللقب</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332D] mb-1">البريد الإلكتروني أو الهاتف</label>
                <input
                  type="text"
                  value={tempContact}
                  onChange={(e) => setTempContact(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DDCC] flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
              >
                حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 bg-white text-stone-600 border border-[#E8DDCC] text-xs font-semibold rounded-xl"
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
          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
              <h3 className="font-bold text-base text-[#26332D]">الأسئلة الشائعة والمساعدة (FAQ)</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs text-[#35453E] leading-relaxed">
              <div className="p-3 bg-white rounded-xl border border-[#E8DDCC] space-y-1">
                <div className="font-bold text-[#26332D]">هل يقدم تطبيق نسمة الحياة تشخيصاً طبياً؟</div>
                <p className="text-[#52645B]">كلا، التطبيق للتوعية والاستكشاف الذاتي الآمن فقط، وليس بديلاً عن الطبيب النفسي أو المرشد المعتمد.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8DDCC] space-y-1">
                <div className="font-bold text-[#26332D]">هل يمكنني حذف بياناتي وملاحظاتي في أي وقت؟</div>
                <p className="text-[#52645B]">نعم بكل سهولة، من خلال زر «طلب حذف بياناتي» في شاشة حسابي، يتم محو كل السجلات فوراً.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8DDCC] space-y-1">
                <div className="font-bold text-[#26332D]">كيف يمكنني طلب التحدث مع مختص؟</div>
                <p className="text-[#52645B]">من خلال قسم «محتاج أتكلم»، يمكنك إرسال رسالتك وسيتواصل معك الفريق بحسب آلية الدعم المتاحة.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DDCC]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
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
          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-6 max-w-md w-full space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
              <h3 className="font-bold text-base text-[#26332D]">عن تطبيق نسمة حياة</h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-500 hover:text-stone-800 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs text-[#35453E] leading-relaxed">
              <p>
                <strong>«نسمة حياة» (Nesmat Hayat)</strong> منصة نفسية عربية تسعى لنشر الوعي الصحي النفسي وتقديم مساحة هادئة للاسترخاء والفهم الذاتي بعيداً عن التعقيد والوصمة.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E8DDCC]">
                <strong>الهدف الأساسي:</strong>
                <p className="mt-1 text-[#52645B]">التوعية + الاستكشاف + الدعم + التوجيه إلى الخطوة المناسبة.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DDCC]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
