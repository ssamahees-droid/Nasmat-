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
    <header className="sticky top-0 z-40 bg-[#121815]/95 backdrop-blur-md border-b border-white/10 text-stone-200 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Official Brand Logo & Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-right group focus:outline-hidden shrink-0"
          title="نسمة حياة — الصفحة الرئيسية"
        >
          <img
            src="/logo.jpg"
            alt="شعار مبادرة نسمة حياة"
            className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-emerald-500/30 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-right">
            <span className="font-tajawal text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors leading-tight">
              نسمة حياة
            </span>
            <span className="text-[10px] text-stone-400 font-medium -mt-0.5">
              للصحة النفسية
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id || (link.id === 'explore' && currentTab === 'content-detail');
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1.5 rounded-xl transition-all font-semibold ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Emergency Safety Protocol Button */}
          <button
            onClick={onOpenSafetyModal}
            className="py-1 px-3 border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            title="أرقام الطوارئ والدعم النفسي العاجل"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">طوارئ</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl border border-white/10 hover:border-emerald-500/40 bg-white/5 text-stone-200 transition-colors"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4 text-emerald-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#121815]" />
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-bold rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-stone-200 transition-colors"
              title="تبديل الصلاحية"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[85px] sm:max-w-none truncate text-[11px]">
                {currentRole === 'user' ? 'مستخدم' : currentRole}
              </span>
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-[#141C18] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-right"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 border-b border-white/10 flex items-center justify-between">
                  <span>تبديل الصلاحية (للمشرفين)</span>
                  <button onClick={() => setShowRoleMenu(false)} className="text-stone-400 hover:text-white">
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
                      className={`w-full p-2 rounded-xl text-xs text-right transition-colors flex items-center justify-between ${
                        currentRole === r.id 
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                          : 'hover:bg-white/5 text-stone-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-[10px] text-stone-400">{r.desc}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl border border-white/10 hover:border-emerald-500/40 bg-white/5 text-stone-200 transition-colors"
            aria-label="القائمة الرئيسية"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-white/10 bg-[#121815] px-4 py-4 space-y-2 animate-fade-in text-right">
          <div className="text-xs font-bold text-stone-400 px-2 pb-1 border-b border-white/5">
            أقسام مبادرة نسمة حياة:
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleMobileNav(link.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-right transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <button
              onClick={() => handleMobileNav('journey')}
              className="text-emerald-400 hover:underline font-semibold"
            >
              سجل رحلتي وعاداتي ←
            </button>
            <button
              onClick={() => handleMobileNav('profile')}
              className="text-stone-300 hover:underline"
            >
              حسابي والأسئلة الشائعة
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
