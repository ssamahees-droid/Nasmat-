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

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSafetyModal: () => void;
  theme?: 'dark' | 'light';
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
  theme = 'dark',
  onToggleTheme
}) => {
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
    { id: 'home', label: 'الرئيسية' },
    { id: 'start', label: 'ابدأ من هنا' },
    { id: 'self-discovery', label: 'افهم نفسك' },
    { id: 'games', label: 'خذ استراحة' },
    { id: 'explore', label: 'تعلّم وطبّق' },
    { id: 'practice', label: 'مارس المهارات' },
    { id: 'rescue', label: 'خطط المساندة' },
    { id: 'support', label: 'اطلب الدعم' },
  ];

  const handleMobileNav = (tabId: string) => {
    onNavigate(tabId);
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F2EFEB] dark:bg-[#121214] border-b-[1.5px] border-[#111113] dark:border-white/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Zone 1: Variation 6 Brand Lockup */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-right group focus:outline-hidden shrink-0 cursor-pointer"
          title="نسمة حياة — الصفحة الرئيسية"
        >
          <img
            src="/logo.jpg"
            alt="شعار مبادرة نسمة حياة"
            className="w-10 h-10 rounded-xl object-cover border-[1.5px] border-[#111113] shadow-[2px_2px_0_#111113] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-right leading-none">
            <span className="font-jetbrains text-[9px] sm:text-[10px] font-semibold text-[#E36E4D] tracking-widest uppercase">
              MOUBADARA_01
            </span>
            <span className="font-syne font-black text-lg sm:text-2xl text-[#111113] dark:text-[#F2EFEB] tracking-tight mt-0.5">
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
                    ? 'bg-[#111113] text-[#F2EFEB] dark:bg-[#F2EFEB] dark:text-[#111113] shadow-[2px_2px_0_#E36E4D]'
                    : 'text-[#111113]/80 dark:text-[#F2EFEB]/80 hover:text-[#111113] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & System Info */}
        <div className="flex items-center gap-2.5">
          
          <div className="hidden xl:block font-jetbrains text-[10px] text-[#111113]/50 dark:text-[#F2EFEB]/50 uppercase tracking-widest px-2">
            UPDATE_V2026
          </div>

          {/* PWA Install Button (Desktop & Compact) */}
          <PWAInstallButton variant="compact" className="hidden md:flex" />

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] hover:shadow-[2px_2px_0_#111113] transition-all cursor-pointer"
              title={isDark ? 'التبديل إلى الوضع النهاري (Variation 6)' : 'التبديل إلى الوضع الليلي'}
              aria-label="تبديل المظهر"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FF7E5B]" /> : <Moon className="w-4 h-4 text-[#111113]" />}
            </button>
          )}

          {/* Emergency Safety Protocol Button */}
          <button
            onClick={onOpenSafetyModal}
            className="py-1.5 px-3.5 bg-[#E36E4D] text-white text-xs font-bold rounded-full border-[1.5px] border-[#111113] shadow-[3px_3px_0_#111113] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer font-cairo"
            title="أرقام الطوارئ والدعم النفسي العاجل"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-syne">طوارئ / SOS</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] hover:shadow-[2px_2px_0_#111113] transition-all cursor-pointer"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4 text-[#E36E4D]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E36E4D] rounded-full ring-2 ring-white dark:ring-black" />
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 text-xs font-bold rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] hover:shadow-[2px_2px_0_#111113] transition-all cursor-pointer font-jetbrains"
              title="تبديل الصلاحية"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#E36E4D]" />
              <span className="max-w-[75px] sm:max-w-none truncate text-[11px]">
                {currentRole === 'user' ? 'USER' : currentRole.toUpperCase()}
              </span>
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-[#F2EFEB] dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-2xl shadow-[6px_6px_0_#111113] p-2 z-50 animate-fade-in text-right font-cairo"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#111113]/70 dark:text-[#F2EFEB]/70 border-b border-[#111113]/15 flex items-center justify-between">
                  <span>تبديل الصلاحية (للمشرفين)</span>
                  <button onClick={() => setShowRoleMenu(false)} className="text-[#111113] hover:text-[#E36E4D]">
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
                          ? 'bg-[#111113] text-white dark:bg-[#F2EFEB] dark:text-[#111113] font-bold shadow-xs' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#111113] dark:text-[#F2EFEB]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-[10px] opacity-70">{r.desc}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-[#E36E4D]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl border-[1.5px] border-[#111113] dark:border-white/20 bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F2EFEB] transition-all cursor-pointer"
            aria-label="القائمة الرئيسية"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden border-t-[1.5px] border-[#111113] dark:border-white/20 bg-[#F2EFEB] dark:bg-[#18181C] px-4 py-4 space-y-2 animate-fade-in text-right font-cairo">
          <div className="text-xs font-bold text-[#E36E4D] px-2 pb-1 border-b border-[#111113]/10 font-jetbrains uppercase">
            // SECTIONS_NAVIGATION
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleMobileNav(link.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-right transition-all flex items-center justify-between border-[1.5px] cursor-pointer ${
                    isActive
                      ? 'bg-[#111113] text-white border-[#111113] shadow-[2px_2px_0_#E36E4D]'
                      : 'bg-white dark:bg-[#121214] text-[#111113] dark:text-[#F2EFEB] border-[#111113]/30 hover:border-[#111113]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E36E4D]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <PWAInstallButton variant="full" />
          </div>

          <div className="pt-2 border-t border-[#111113]/10 flex items-center justify-between text-xs">
            <button
              onClick={() => handleMobileNav('journey')}
              className="text-[#E36E4D] hover:underline font-bold"
            >
              سجل رحلتي وعاداتي ←
            </button>
            <button
              onClick={() => handleMobileNav('profile')}
              className="text-[#111113] dark:text-[#F2EFEB] hover:underline"
            >
              حسابي والأسئلة الشائعة
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
