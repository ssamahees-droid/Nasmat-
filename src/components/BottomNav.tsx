import React from 'react';
import { 
  Home, 
  Compass, 
  Gamepad2, 
  BookOpen, 
  ShieldAlert, 
  MessageCircle,
  LayoutDashboard 
} from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  onOpenGwayaHekaya?: () => void;
  onOpenFeker?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  onNavigate, 
  userRole
}) => {
  const { t, language } = useLanguage();
  const isAdmin = userRole !== 'user';

  const navItems = [
    { id: 'home', label: t('nav.home', 'الرئيسية'), icon: Home },
    { id: 'start', label: t('nav.start', 'ابدأ من هنا'), icon: Compass },
    { id: 'explore', label: t('nav.explore', 'تعلّم وطبّق'), icon: BookOpen },
    { id: 'games', label: t('nav.games', 'خذ استراحة'), icon: Gamepad2 },
    { id: 'rescue', label: t('nav.rescue', 'خطط المساندة'), icon: ShieldAlert },
    { id: 'support', label: t('nav.support', 'اطلب الدعم'), icon: MessageCircle }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3E9]/98 dark:bg-[#0D1914]/98 backdrop-blur-md border-t border-[#174C3C]/15 dark:border-[#A9C5A0]/15 pb-safe shadow-[0_-4px_16px_rgba(23,76,60,0.06)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`max-w-md mx-auto grid ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} items-center h-16 px-1 font-cairo`}>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || 
            (item.id === 'explore' && currentTab === 'content-detail') ||
            (item.id === 'games' && currentTab === 'feker');

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#174C3C] dark:text-[#A9C5A0] font-black' 
                  : 'text-[#13251E]/65 dark:text-[#F7F3E9]/65 hover:text-[#174C3C] dark:hover:text-[#A9C5A0]'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[50px] leading-tight text-center">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C] dark:bg-[#A9C5A0] mt-0.5 shadow-2xs" />
              )}
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
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all cursor-pointer ${
              currentTab === 'admin' 
                ? 'text-[#174C3C] dark:text-[#A9C5A0] font-black' 
                : 'text-[#13251E]/65 dark:text-[#F7F3E9]/65 hover:text-[#174C3C]'
            }`}
            aria-label="الإدارة"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">الإدارة</span>
            {currentTab === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C] dark:bg-[#A9C5A0] mt-0.5" />
            )}
          </button>
        )}

      </div>
    </nav>
  );
};
