import React, { useState } from 'react';
import { 
  Bell, 
  UserCheck, 
  X, 
  Check, 
  Menu, 
  PhoneCall, 
  Compass, 
  Moon, 
  Sun,
  Gamepad2,
  BookOpen,
  Activity,
  LifeBuoy,
  MessageCircle,
  Home,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { storage } from '../services/storage';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageToggle } from './LanguageToggle';
import { UnifiedShareButton } from './UnifiedShareButton';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSafetyModal: () => void;
  onOpenCompanion?: () => void;
  onOpenGardenWelcome?: () => void;
  theme?: 'dark' | 'light' | 'system';
  onToggleTheme?: () => void;
  isMobilePerformanceMode?: boolean;
  onToggleMobilePerformanceMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentRole,
  onRoleChange,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenSafetyModal,
  onOpenCompanion,
  onOpenGardenWelcome,
  theme = 'dark',
  onToggleTheme,
  isMobilePerformanceMode = false,
  onToggleMobilePerformanceMode
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isDark = theme === 'dark';

  const rolesList: { id: UserRole; title: string; desc: string }[] = [
    { id: 'user', title: 'مستخدم عادي', desc: 'تجربة التطبيق العامة' },
    { id: 'super_admin', title: 'Super Admin', desc: 'صلاحيات كاملة للمنظومة' },
    { id: 'content_manager', title: 'Content Manager', desc: 'إدارة المحتوى والنشر' },
    { id: 'support_supervisor', title: 'Support Supervisor', desc: 'إدارة وتوجيه طلبات الدعم' },
    { id: 'support_member', title: 'Support Member', desc: 'رؤية ومتابعة الطلبات المسندة' },
    { id: 'specialist', title: 'Reviewer / Specialist', desc: 'مراجعة المحتوى النفسي' }
  ];

  const navLinks = [
    { id: 'welcome', label: t('nav.wheel', '🎡 العجلة الترحيبية') },
    { id: 'home', label: language === 'en' ? '1. Home' : '١. الرئيسية' },
    { id: 'start', label: language === 'en' ? '2. Start Here' : '٢. ابدأ هنا' },
    { id: 'breathe', label: language === 'en' ? '3. Breathe' : '٣. التنفس' },
    { id: 'self-discovery', label: language === 'en' ? '4. Self-Discovery' : '٤. استكشاف الذات' },
    { id: 'explore', label: language === 'en' ? '5. Knowledge' : '٥. مكتبة المعرفة' },
    { id: 'games', label: language === 'en' ? '6. Games' : '٦. بستان الألعاب' },
    { id: 'practice', label: language === 'en' ? '7. Exercises' : '٧. التمارين' },
    { id: 'journey', label: language === 'en' ? '8. Healing Path' : '٨. مسار التشافي' },
    { id: 'rescue', label: language === 'en' ? '9. Emergency' : '٩. حقيبة النجاة' },
    { id: 'support', label: language === 'en' ? '10. Support' : '١٠. الدعم' },
  ];

  const handleMobileNav = (tabId: string) => {
    onNavigate(tabId);
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b-2 border-[#D5DED7] transition-colors shadow-xs" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Lockup */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-3 group focus:outline-hidden shrink-0 cursor-pointer ${
            language === 'ar' ? 'text-right' : 'text-left'
          }`}
          title={t('brand.title', 'نسمة حياة')}
        >
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-xl object-cover border border-[#174F3F]/20 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span className="font-jetbrains text-[10px] font-bold text-[#174F3F] tracking-widest uppercase">
              {t('brand.subtitle', 'مبادرة نسمة حياة')}
            </span>
            <span className="font-syne font-black text-lg sm:text-2xl text-[#174F3F] tracking-tight mt-0.5">
              {t('brand.title', 'نسمة حياة')}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-cairo">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id || (link.id === 'explore' && currentTab === 'content-detail');
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-full transition-all font-bold cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] shadow-xs'
                    : 'text-[#13251E]/80 dark:text-[#F7F3E9]/80 hover:text-[#174C3C] dark:hover:text-[#A9C5A0] hover:bg-[#174C3C]/5 dark:hover:bg-[#A9C5A0]/10'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Quick Access */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <div className="hidden xl:block font-jetbrains text-[11px] text-[#174F3F] font-bold uppercase tracking-widest px-1">
            🌿 {t('brand.oasis', 'واحة الأمان')}
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" className="hidden md:flex" />

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#D5DED7] bg-white text-[#292F2B] hover:bg-[#E2EFE7] transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
              title={isDark ? 'التبديل إلى الوضع النهاري الهادئ' : 'التبديل إلى الوضع الليلي الغابي'}
              aria-label="تبديل المظهر"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#B78327]" /> : <Moon className="w-4 h-4 text-[#174F3F]" />}
            </button>
          )}

          {/* Unified Language Toggle (Desktop/Tablet) */}
          <div className="hidden xs:block shrink-0">
            <LanguageToggle />
          </div>

          {/* Digital Character Button (رفيقي) - Tablet/Desktop only */}
          {onOpenCompanion && (
            <button
              onClick={onOpenCompanion}
              className="hidden sm:flex py-2 px-3.5 bg-[#174F3F] hover:bg-[#23785B] text-white text-xs font-bold rounded-full border border-[#174F3F]/30 shadow-xs hover:translate-y-[-1px] active:translate-y-0.5 transition-all items-center gap-1.5 cursor-pointer font-tajawal shrink-0"
              title={t('companion.talk_to_refiqi', 'تحدث مع رفيقي')}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F8EED8]" />
              <span>{t('companion.talk_to_refiqi', 'رفيقي')}</span>
            </button>
          )}

          {/* Emergency Safety Protocol Button */}
          <button
            onClick={onOpenSafetyModal}
            className="h-9 px-3 bg-[#991B1B] hover:bg-[#7f1d1d] text-white text-xs font-bold rounded-xl border border-[#991B1B]/40 shadow-xs hover:translate-y-[-1px] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer font-tajawal shrink-0"
            title={t('nav.rescue', 'أرقام الطوارئ والدعم النفسي العاجل')}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-bold text-[12px]">{t('nav.rescue', 'طوارئ')}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/50 dark:hover:bg-[#1B342A] transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D98F83] rounded-full ring-2 ring-white dark:ring-[#14271F]" />
            )}
          </button>

          {/* Unified Share App Button */}
          <UnifiedShareButton variant="navbar" />

          {/* Role Switcher (Hidden on small mobile headers to prevent overflow) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 text-xs font-bold rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/50 dark:hover:bg-[#1B342A] transition-all cursor-pointer font-jetbrains shadow-2xs"
              title="تبديل الصلاحية"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#174C3C] dark:text-[#A9C5A0]" />
              <span className="max-w-[75px] sm:max-w-none truncate text-[11px]">
                {currentRole === 'user' ? 'USER' : currentRole.toUpperCase()}
              </span>
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-[#F7F3E9] dark:bg-[#14271F] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-right font-cairo"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#174C3C] dark:text-[#A9C5A0] border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 flex items-center justify-between">
                  <span>تبديل الصلاحية (للمشرفين)</span>
                  <button onClick={() => setShowRoleMenu(false)} className="text-[#13251E] dark:text-[#F7F3E9] hover:text-[#D98F83]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-1 space-y-1">
                  {rolesList.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        storage.updateUserRole(r.id);
                        setShowRoleMenu(false);
                        if (r.id !== 'user') onNavigate('admin');
                      }}
                      className={`w-full p-2 rounded-xl text-xs text-right transition-all flex items-center justify-between cursor-pointer ${
                        currentRole === r.id 
                          ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] font-bold shadow-xs' 
                          : 'hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A] text-[#13251E] dark:text-[#F7F3E9]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-[10px] opacity-75">{r.desc}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-[#D5A65A] dark:text-[#0D1914]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
            aria-label="القائمة الرئيسية"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden border-t-2 border-[#D5DED7] bg-[#FFFFFF] px-4 py-4 space-y-3 animate-fade-in text-right font-tajawal shadow-lg">
          <div className="text-[15px] font-bold text-[#174F3F] px-2 pb-1 border-b border-[#D5DED7]">
            // تصفح أقسام المنصة
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleMobileNav(link.id)}
                  className={`p-3 rounded-xl text-[16px] font-bold text-right transition-all flex items-center justify-between border-2 cursor-pointer min-h-[48px] ${
                    isActive
                      ? 'bg-[#174F3F] text-white border-[#174F3F] shadow-xs'
                      : 'bg-[#F7F5EF] text-[#292F2B] border-[#D5DED7] hover:border-[#174F3F]'
                  }`}
                >
                  <span className="truncate">{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#B78327]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 space-y-2.5">
            {onOpenGardenWelcome && (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenGardenWelcome();
                }}
                className="w-full p-3 rounded-xl text-[15px] font-bold text-right transition-all flex items-center justify-between border-2 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 hover:border-emerald-600 cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <span>رسالة الترحيب الوجدانية («حديقتك الجميلة»)</span>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            )}

            {onToggleMobilePerformanceMode && (
              <button
                onClick={onToggleMobilePerformanceMode}
                className={`w-full p-3 rounded-xl text-[15px] font-bold text-right transition-all flex items-center justify-between border-2 cursor-pointer ${
                  isMobilePerformanceMode
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400'
                    : 'bg-[#F7F5EF] dark:bg-stone-800 text-[#292F2B] dark:text-stone-200 border-[#D5DED7] dark:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span>وضع تسريع الموبايل (Speed Boost)</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-black bg-white dark:bg-stone-900 text-[#174F3F] dark:text-emerald-300 shadow-xs">
                  {isMobilePerformanceMode ? 'مفعل ⚡' : 'تشغيل'}
                </span>
              </button>
            )}

            {onOpenCompanion && (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenCompanion();
                }}
                className="w-full min-h-[48px] py-3 px-4 bg-[#174F3F] text-white text-[16px] font-bold rounded-xl border border-[#174F3F] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4.5 h-4.5 text-[#F8EED8]" />
                <span>تحدث مع رفيقي — المرشد المرافق 🤍</span>
              </button>
            )}
            <PWAInstallButton variant="full" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[15px] font-bold text-[#515B55] dark:text-stone-300">اللغة / Language:</span>
              <LanguageToggle variant="pill" />
            </div>
          </div>

          <div className="pt-2 border-t border-[#D5DED7] flex items-center justify-between text-[15px]">
            <button
              onClick={() => handleMobileNav('welcome')}
              className="text-[#174F3F] hover:underline font-bold flex items-center gap-1"
            >
              <span>👋</span>
              <span>شاشة الترحيب</span>
            </button>
            <button
              onClick={() => handleMobileNav('journey')}
              className="text-[#174F3F] hover:underline font-bold"
            >
              سجل رحلتي ←
            </button>
            <button
              onClick={() => handleMobileNav('profile')}
              className="text-[#515B55] hover:underline font-bold"
            >
              حسابي
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
