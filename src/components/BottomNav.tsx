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
  const isAdmin = userRole !== 'user';

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'start', label: 'ابدأ من هنا', icon: Compass },
    { id: 'explore', label: 'تعلّم وطبّق', icon: BookOpen },
    { id: 'games', label: 'خذ استراحة', icon: Gamepad2 },
    { id: 'rescue', label: 'خطط المساندة', icon: ShieldAlert },
    { id: 'support', label: 'اطلب الدعم', icon: MessageCircle }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F2EFEB]/98 dark:bg-[#121214]/98 backdrop-blur-md border-t-[1.5px] border-[#111113] dark:border-white/20 pb-safe shadow-[0_-4px_12px_rgba(17,17,19,0.08)]" dir="rtl">
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
                isActive ? 'text-[#E36E4D] font-black' : 'text-[#111113]/70 dark:text-[#F2EFEB]/70 hover:text-[#111113]'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[50px] leading-tight text-center">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E36E4D] mt-0.5 shadow-xs" />
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
              currentTab === 'admin' ? 'text-[#E36E4D] font-black' : 'text-[#111113]/70 dark:text-[#F2EFEB]/70'
            }`}
            aria-label="الإدارة"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">الإدارة</span>
            {currentTab === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#E36E4D] mt-0.5" />
            )}
          </button>
        )}

      </div>
    </nav>
  );
};
