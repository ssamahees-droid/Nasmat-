import React from 'react';
import { Home, Compass, Sparkles, User, LayoutDashboard, BookOpen, Brain } from 'lucide-react';
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
  userRole,
  onOpenGwayaHekaya,
  onOpenFeker
}) => {
  const isAdmin = userRole !== 'user';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141416]/95 backdrop-blur-md border-t border-white/10 pb-safe shadow-lg">
      <div className={`max-w-xl mx-auto grid ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} items-center h-16 px-1.5`}>
        {/* Tab 1: Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'home' ? 'text-[#c4fb6d] font-bold scale-105' : 'text-[#e4e4e4]/60 hover:text-[#c4fb6d]'
          }`}
          aria-label="الرئيسية"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-geist tracking-tight mt-1">الرئيسية</span>
          {currentTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4fb6d] mt-0.5" />
          )}
        </button>

        {/* Tab 2: FEKER (App 2) */}
        <button
          onClick={() => onOpenFeker ? onOpenFeker() : onNavigate('feker')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'feker' ? 'text-[#c4fb6d] font-bold scale-105' : 'text-[#c4fb6d]/80 hover:text-[#c4fb6d]'
          }`}
          aria-label="تطبيق فكّر"
          title="فتح تطبيق فكّر لتفكيك الأفكار والمرونة العقلية"
        >
          <div className="w-7 h-7 rounded-full bg-[#c4fb6d]/15 border border-[#c4fb6d] flex items-center justify-center shadow-xs">
            <Brain className="w-4 h-4 text-[#c4fb6d]" />
          </div>
          <span className="text-[10px] font-geist font-bold text-[#c4fb6d] tracking-tight mt-0.5">تطبيق فكّر</span>
          {currentTab === 'feker' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4fb6d] mt-0.5" />
          )}
        </button>

        {/* Tab 3: Explore */}
        <button
          onClick={() => onNavigate('explore')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'explore' || currentTab === 'content-detail' ? 'text-[#c4fb6d] font-bold scale-105' : 'text-[#e4e4e4]/60 hover:text-[#c4fb6d]'
          }`}
          aria-label="اكتشف"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-geist tracking-tight mt-1">اكتشف</span>
          {(currentTab === 'explore' || currentTab === 'content-detail') && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4fb6d] mt-0.5" />
          )}
        </button>

        {/* Tab 4: GWAYA HEKAYA (App 3) */}
        {onOpenGwayaHekaya && (
          <button
            onClick={onOpenGwayaHekaya}
            className="flex flex-col items-center justify-center min-h-[44px] py-1 transition-all text-[#e4e4e4]/70 hover:text-[#c4fb6d] hover:scale-105"
            aria-label="جوايا حكاية"
            title="فتح تطبيق جوايا حكاية التفاعلي"
          >
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/20 hover:border-[#c4fb6d] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-[10px] font-geist font-medium text-emerald-300 tracking-tight mt-0.5">جوايا حكاية</span>
          </button>
        )}

        {/* Tab 5: Journey */}
        <button
          onClick={() => onNavigate('journey')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'journey' ? 'text-[#c4fb6d] font-bold scale-105' : 'text-[#e4e4e4]/60 hover:text-[#c4fb6d]'
          }`}
          aria-label="رحلتي"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-geist tracking-tight mt-1">رحلتي</span>
          {currentTab === 'journey' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4fb6d] mt-0.5" />
          )}
        </button>

        {/* Tab 6: Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'profile' ? 'text-[#c4fb6d] font-bold scale-105' : 'text-[#e4e4e4]/60 hover:text-[#c4fb6d]'
          }`}
          aria-label="حسابي"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-geist tracking-tight mt-1">حسابي</span>
          {currentTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4fb6d] mt-0.5" />
          )}
        </button>

        {/* Tab 7: Admin (Conditional) */}
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
              currentTab === 'admin' ? 'text-amber-400 font-bold scale-105' : 'text-[#e4e4e4]/60 hover:text-amber-400'
            }`}
            aria-label="الإدارة"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-geist tracking-tight mt-1">الإدارة</span>
            {currentTab === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
};
