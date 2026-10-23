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
    { id: 'welcome', label: t('nav.wheel', 'العجلة 🎡'), icon: RotateCw, isScreenModal: false },
    { id: 'home', label: t('nav.home', 'الرئيسية'), icon: Home, isScreenModal: false },
    { id: 'all_screens', label: t('nav.all_screens', 'الشاشات ١٠'), icon: LayoutGrid, isScreenModal: true },
    { id: 'breathe', label: t('nav.breathe', 'التنفس'), icon: Wind, isScreenModal: false },
    { id: 'games', label: t('nav.games', 'الألعاب'), icon: Gamepad2, isScreenModal: false },
    { id: 'rescue', label: t('nav.rescue', 'الطوارئ'), icon: ShieldAlert, isScreenModal: false },
    { id: 'support', label: t('nav.support', 'الدعم'), icon: HeartHandshake, isScreenModal: false }
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t-2 border-[#D5DED7] pb-safe shadow-[0_-4px_20px_rgba(23,79,63,0.12)]" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className={`max-w-lg mx-auto grid ${isAdmin ? 'grid-cols-8' : 'grid-cols-7'} items-center h-[68px] px-1 font-tajawal`}>
        
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
                  ? 'text-[#174F3F] font-bold' 
                  : 'text-[#292F2B] hover:text-[#174F3F]'
              }`}
              aria-label={item.label}
            >
              <div className={`flex flex-col items-center justify-center transition-all min-h-[48px] justify-center ${
                isActive 
                  ? 'bg-[#E2EFE7] rounded-xl px-2.5 py-1 text-[#174F3F] border border-[#23785B]/30' 
                  : item.isScreenModal 
                    ? 'bg-[#F7F5EF] rounded-xl px-2 py-1 text-[#174F3F] border border-[#D5DED7]'
                    : 'px-1.5 py-1'
              }`}>
                <Icon size={21} className={`w-5.5 h-5.5 transition-transform ${isActive ? 'stroke-[2.5] scale-105 text-[#174F3F]' : 'stroke-[2] text-[#292F2B]'}`} />
                <span className={`text-[12px] mt-1 leading-tight tracking-tight text-center ${isActive ? 'font-black text-[#174F3F]' : 'font-bold text-[#292F2B]'}`}>
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
                ? 'text-[#174F3F] font-bold' 
                : 'text-[#292F2B] hover:text-[#174F3F]'
            }`}
            aria-label={t('nav.admin', 'الإدارة')}
          >
            <div className={`flex flex-col items-center justify-center transition-all min-h-[48px] ${
              currentTab === 'admin' 
                ? 'bg-[#E2EFE7] rounded-xl px-2.5 py-1 border border-[#23785B]/30' 
                : 'px-1.5 py-1'
            }`}>
              <LayoutDashboard size={21} className="w-5.5 h-5.5 stroke-[2] text-[#292F2B]" />
              <span className="text-[12px] mt-1 font-bold leading-tight">{t('nav.admin', 'الإدارة')}</span>
            </div>
          </button>
        )}

      </div>
    </nav>
  );
};
