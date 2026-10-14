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
  theme?: 'dark' | 'light' | 'system';
  onToggleTheme?: () => void;
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
  theme = 'dark',
  onToggleTheme
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
    { id: 'home', label: t('nav.home', 'الرئيسية') },
    { id: 'listen-to-yourself', label: '🧠 اسمع نفسك' },
    { id: 'weekly-session', label: '📅 الجلسة الأسبوعية' },
    { id: 'start', label: t('nav.start', 'ابدأ من هنا') },
    { id: 'self-discovery', label: t('nav.selfDiscovery', 'افهم نفسك') },
    { id: 'games', label: t('nav.games', 'خذ استراحة') },
    { id: 'explore', label: t('nav.explore', 'تعلّم وطبّق') },
    { id: 'practice', label: t('nav.practice', 'مارس المهارات') },
    { id: 'rescue', label: t('nav.rescue', 'خطط المساندة') },
    { id: 'support', label: t('nav.support', 'اطلب الدعم') },
  ];

  const handleMobileNav = (tabId: string) => {
    onNavigate(tabId);
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F3E9]/95 dark:bg-[#0D1914]/95 backdrop-blur-md border-b border-[#174C3C]/15 dark:border-[#A9C5A0]/15 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Lockup */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-right group focus:outline-hidden shrink-0 cursor-pointer"
          title="نسمة حياة — الصفحة الرئيسية"
        >
          <img
            src="/logo.jpg"
            alt="شعار مبادرة نسمة حياة"
            className="w-10 h-10 rounded-xl object-cover border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-right leading-none">
            <span className="font-jetbrains text-[9px] sm:text-[10px] font-bold text-[#174C3C] dark:text-[#A9C5A0] tracking-widest uppercase">
              مبادرة نسمة حياة
            </span>
            <span className="font-syne font-black text-lg sm:text-2xl text-[#174C3C] dark:text-[#F7F3E9] tracking-tight mt-0.5">
              نسمة حياة
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
        <div className="flex items-center gap-2">
          
          <div className="hidden xl:block font-jetbrains text-[10px] text-[#174C3C]/60 dark:text-[#A9C5A0]/60 uppercase tracking-widest px-1">
            🌿 واحة الأمان
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" className="hidden md:flex" />

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/50 dark:hover:bg-[#1B342A] transition-all cursor-pointer shadow-2xs"
              title={isDark ? 'التبديل إلى الوضع النهاري الهادئ' : 'التبديل إلى الوضع الليلي الغابي'}
              aria-label="تبديل المظهر"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#D5A65A]" /> : <Moon className="w-4 h-4 text-[#174C3C]" />}
            </button>
          )}

          {/* Language Switch Button */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/50 dark:hover:bg-[#1B342A] transition-all cursor-pointer font-jetbrains text-xs font-bold shadow-2xs"
            title="تبديل اللغة / Switch Language"
            aria-label="تبديل اللغة"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Digital Character Button (رفيقي) */}
          {onOpenCompanion && (
            <button
              onClick={onOpenCompanion}
              className="py-1.5 px-3 bg-[#174C3C] hover:bg-[#123C30] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] dark:text-[#0D1914] text-xs font-bold rounded-full border border-[#174C3C]/30 shadow-xs hover:translate-y-[-1px] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer font-cairo"
              title="تحدث مع رفيقي — المرشد المرافق"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D5A65A] dark:text-[#174C3C]" />
              <span>رفيقي</span>
            </button>
          )}

          {/* Emergency Safety Protocol Button */}
          <button
            onClick={onOpenSafetyModal}
            className="py-1.5 px-3 bg-[#D98F83] hover:bg-[#C97F73] text-white text-xs font-bold rounded-full border border-[#D98F83]/40 shadow-xs hover:translate-y-[-1px] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer font-cairo"
            title="أرقام الطوارئ والدعم النفسي العاجل"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-syne">طوارئ / SOS</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] hover:bg-[#E6E8D8]/50 dark:hover:bg-[#1B342A] transition-all cursor-pointer shadow-2xs"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4 text-[#174C3C] dark:text-[#A9C5A0]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D98F83] rounded-full ring-2 ring-white dark:ring-[#14271F]" />
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
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
            className="lg:hidden p-2 rounded-xl border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-white dark:bg-[#14271F] text-[#13251E] dark:text-[#F7F3E9] transition-all cursor-pointer shadow-2xs"
            aria-label="القائمة الرئيسية"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-[#174C3C]/15 dark:border-[#A9C5A0]/20 bg-[#F7F3E9] dark:bg-[#14271F] px-4 py-4 space-y-2 animate-fade-in text-right font-cairo shadow-lg">
          <div className="text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0] px-2 pb-1 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 font-jetbrains uppercase">
            // تصفح أقسام المنصة
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleMobileNav(link.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-right transition-all flex items-center justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-[#174C3C] text-[#F7F3E9] dark:bg-[#A9C5A0] dark:text-[#0D1914] border-[#174C3C] shadow-xs'
                      : 'bg-white dark:bg-[#193127] text-[#13251E] dark:text-[#F7F3E9] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:border-[#174C3C]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D5A65A]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 space-y-2">
            {onOpenCompanion && (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenCompanion();
                }}
                className="w-full py-2.5 px-3 bg-[#174C3C] dark:bg-[#A9C5A0] text-[#F7F3E9] dark:text-[#0D1914] text-xs font-bold rounded-xl border border-[#174C3C]/20 flex items-center justify-center gap-2 cursor-pointer font-cairo shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#D5A65A] dark:text-[#174C3C]" />
                <span>تحدث مع رفيقي — المرشد المرافق 🤍</span>
              </button>
            )}
            <PWAInstallButton variant="full" />
          </div>

          <div className="pt-2 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15 flex items-center justify-between text-xs">
            <button
              onClick={() => handleMobileNav('journey')}
              className="text-[#174C3C] dark:text-[#A9C5A0] hover:underline font-bold"
            >
              سجل رحلتي وعاداتي ←
            </button>
            <button
              onClick={() => handleMobileNav('profile')}
              className="text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:underline"
            >
              حسابي والأسئلة الشائعة
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
