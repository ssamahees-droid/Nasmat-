import React from 'react';
import { 
  Home, 
  Gamepad2, 
  Wind,
  ShieldAlert, 
  LayoutGrid,
  HeartHandshake,
  LayoutDashboard,
  RotateCw 
} from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  onOpenAllScreens?: () => void;
  onOpenGwayaHekaya?: () => void;
  onOpenFeker?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  onNavigate, 
  userRole,
  onOpenAllScreens
}) => {
  const { t, language } = useLanguage();
  const isAdmin = userRole !== 'user';

  const navItems = [
    { id: 'welcome', label: 'العجلة 🎡', icon: RotateCw, isScreenModal: false },
    { id: 'home', label: t('nav.home', 'الرئيسية'), icon: Home, isScreenModal: false },
    { id: 'all_screens', label: 'الشاشات ١٠', icon: LayoutGrid, isScreenModal: true },
    { id: 'breathe', label: 'التنفس', icon: Wind, isScreenModal: false },
    { id: 'games', label: 'الألعاب', icon: Gamepad2, isScreenModal: false },
    { id: 'rescue', label: 'الطوارئ', icon: ShieldAlert, isScreenModal: false },
    { id: 'support', label: 'الدعم', icon: HeartHandshake, isScreenModal: false }
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3E9]/98 dark:bg-[#0D1914]/98 backdrop-blur-md border-t border-[#174C3C]/15 dark:border-[#A9C5A0]/15 pb-safe shadow-[0_-4px_20px_rgba(23,76,60,0.08)]" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className={`max-w-md mx-auto grid ${isAdmin ? 'grid-cols-8' : 'grid-cols-7'} items-center h-[62px] px-0.5 font-tajawal`}>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isScreenModal && (
            currentTab === item.id || 
            (item.id === 'games' && (currentTab === 'feker' || currentTab === 'content-detail'))
          );

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isScreenModal && onOpenAllScreens) {
                  onOpenAllScreens();
                } else {
                  onNavigate(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer select-none active:scale-95 ${
                isActive 
                  ? 'text-[#174C3C] dark:text-[#A9C5A0] font-bold' 
                  : 'text-[#13251E]/70 dark:text-[#F7F3E9]/70 hover:text-[#174C3C] dark:hover:text-[#A9C5A0]'
              }`}
              aria-label={item.label}
            >
              <div className={`flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? 'bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 rounded-xl px-2 py-0.5' 
                  : item.isScreenModal 
                    ? 'bg-emerald-500/10 dark:bg-emerald-400/10 rounded-xl px-1.5 py-0.5'
                    : 'px-1 py-0.5'
              }`}>
                <Icon size={19} className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
                <span className={`text-[10px] mt-0.5 leading-none tracking-tight text-center ${isActive ? 'font-black' : 'font-semibold'}`}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}

        {/* Tab 7: Admin (if privileged) */}
        {isAdmin && (
          <button
            onClick={() => {
              onNavigate('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer select-none active:scale-95 ${
              currentTab === 'admin' 
                ? 'text-[#174C3C] dark:text-[#A9C5A0] font-bold' 
                : 'text-[#13251E]/65 dark:text-[#F7F3E9]/65 hover:text-[#174C3C]'
            }`}
            aria-label="الإدارة"
          >
            <div className={`flex flex-col items-center justify-center transition-all ${
              currentTab === 'admin' 
                ? 'bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 rounded-xl px-2 py-0.5' 
                : 'px-1 py-0.5'
            }`}>
              <LayoutDashboard size={19} className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] mt-0.5 font-medium leading-none">الإدارة</span>
            </div>
          </button>
        )}

      </div>
    </nav>
  );
};
