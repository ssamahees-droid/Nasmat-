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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121815]/95 backdrop-blur-md border-t border-white/10 pb-safe shadow-lg" dir="rtl">
      <div className={`max-w-md mx-auto grid ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} items-center h-16 px-1`}>
        
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
                isActive ? 'text-emerald-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-tajawal mt-1 truncate max-w-[50px] leading-tight text-center">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
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
              currentTab === 'admin' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-amber-300'
            }`}
            aria-label="الإدارة"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px] font-tajawal mt-1">الإدارة</span>
            {currentTab === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        )}

      </div>
    </nav>
  );
};
