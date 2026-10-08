import React, { useState } from 'react';
import { Leaf, Bell, Shield, UserCheck, X, Check, Moon, Sun } from 'lucide-react';
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
  const isDark = theme === 'dark';

  const rolesList: { id: UserRole; title: string; desc: string }[] = [
    { id: 'user', title: 'مستخدم عادي', desc: 'تجربة التطبيق العامة' },
    { id: 'super_admin', title: 'Super Admin', desc: 'صلاحيات كاملة للمنظومة' },
    { id: 'content_manager', title: 'Content Manager', desc: 'إدارة المحتوى والنشر' },
    { id: 'support_supervisor', title: 'Support Supervisor', desc: 'إدارة وتوجيه طلبات الدعم' },
    { id: 'support_member', title: 'Support Member', desc: 'رؤية ومتابعة الطلبات المسندة' },
    { id: 'specialist', title: 'Reviewer / Specialist', desc: 'مراجعة المحتوى النفسي' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#141416] border-b border-white/10 text-[#e4e4e4] transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo & Title */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-right group focus:outline-hidden"
          title="نسمة حياة"
        >
          <img
            src="/favicon.svg"
            alt="شعار نسمة حياة"
            className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-right">
            <span className="font-tajawal text-base sm:text-lg font-black tracking-tight text-[#c4fb6d] leading-tight">
              نسمة حياة
            </span>
            <span className="text-[10px] text-[#e4e4e4]/60 font-medium -mt-0.5">
              للصحة النفسية
            </span>
          </div>
        </button>

        {/* Telemetry / Tech Badge */}
        <div className="hidden lg:flex items-center gap-2 font-geist text-[11px] text-[#e4e4e4]/70 border border-white/10 px-3 py-1 bg-[#0c0c0e]">
          <span><strong className="text-[#c4fb6d]">STATUS:</strong> ACTIVE</span>
          <span className="text-white/20">//</span>
          <span><strong className="text-[#c4fb6d]">GRID:</strong> V6.0</span>
          <span className="text-white/20">//</span>
          <span><strong className="text-[#c4fb6d]">ID:</strong> SUP_001</span>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-geist">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 border transition-all ${
              currentTab === 'home' 
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold' 
                : 'border-white/10 hover:border-[#c4fb6d] text-[#e4e4e4]/80'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`px-3 py-1.5 border transition-all ${
              currentTab === 'explore' 
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold' 
                : 'border-white/10 hover:border-[#c4fb6d] text-[#e4e4e4]/80'
            }`}
          >
            أفهم نفسي
          </button>
          <button
            onClick={() => onNavigate('breathe')}
            className={`px-3 py-1.5 border transition-all ${
              currentTab === 'breathe' 
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold' 
                : 'border-white/10 hover:border-[#c4fb6d] text-[#e4e4e4]/80'
            }`}
          >
            خد نفس
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            className={`px-3 py-1.5 border transition-all ${
              currentTab === 'assessment' 
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold' 
                : 'border-white/10 hover:border-[#c4fb6d] text-[#e4e4e4]/80'
            }`}
          >
            قيّم حالتك
          </button>
          <button
            onClick={() => onNavigate('journey')}
            className={`px-3 py-1.5 border transition-all ${
              currentTab === 'journey' 
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold' 
                : 'border-white/10 hover:border-[#c4fb6d] text-[#e4e4e4]/80'
            }`}
          >
            رحلتي
          </button>
          <button
            onClick={() => onNavigate('feker')}
            className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
              currentTab === 'feker' 
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d] font-bold shadow-xs' 
                : 'border-[#c4fb6d]/40 hover:border-[#c4fb6d] text-[#c4fb6d] bg-[#c4fb6d]/10'
            }`}
            title="تطبيق فكّر المدمج لتفكيك الأفكار والمرونة العقلية"
          >
            <span>💡 تطبيق فكّر</span>
            <span className="text-[9px] bg-[#c4fb6d] text-black px-1 rounded-sm font-bold">جديد</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Feker Mobile Pill */}
          <button
            onClick={() => onNavigate('feker')}
            className={`md:hidden py-1 px-2.5 border text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
              currentTab === 'feker'
                ? 'bg-[#c4fb6d] text-black border-[#c4fb6d]'
                : 'border-[#c4fb6d]/40 text-[#c4fb6d] bg-[#c4fb6d]/10'
            }`}
            title="تطبيق فكّر"
          >
            <span>💡 فكّر</span>
          </button>

          {/* Emergency Safety Protocol Button */}
          <button
            onClick={onOpenSafetyModal}
            className="py-1 px-3 border border-[#ff4d4d] bg-[#4b1a1a]/80 text-[#ffbaba] font-geist text-[11px] font-bold tracking-wider uppercase transition-colors"
            title="أرقام الطوارئ والدعم النفسي العاجل"
          >
            <span>🆘 طوارئ</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 border border-white/10 hover:border-[#c4fb6d] bg-[#0c0c0e] text-[#e4e4e4] transition-colors"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4 text-[#c4fb6d]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#c4fb6d] ring-1 ring-black" />
            )}
          </button>

          {/* Role Switcher Pill for Admin Dashboard Navigation */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 py-1 px-2.5 text-xs font-bold rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-[#588157]/20 hover:bg-[#588157]/30 text-[#F8F7F4] border-[#588157]/40' 
                  : 'bg-[#3A5A40]/15 hover:bg-[#3A5A40]/25 text-[#3A5A40] border-[#3A5A40]/30'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#588157]" />
              <span className="max-w-[85px] sm:max-w-none truncate">
                {currentRole === 'user' ? 'مستخدم' : currentRole}
              </span>
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleMenu && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-white border border-[#E5DACB] rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-right"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#58645C] border-b border-[#E5DACB] flex items-center justify-between">
                  <span>تبديل الصلاحية (للتجربة والتقييم)</span>
                  <button onClick={() => setShowRoleMenu(false)} className="text-stone-400 hover:text-stone-700">
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
                          ? 'bg-[#3A5A40]/15 text-[#3A5A40] font-bold' 
                          : 'hover:bg-[#FAF7F2] text-[#283618]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-[10px] text-[#58645C]">{r.desc}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-[#3A5A40]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
