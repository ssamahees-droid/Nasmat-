import React from 'react';
import { Home, Compass, Gamepad2, Sparkles, MessageCircle, LayoutDashboard } from 'lucide-react';
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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121815]/95 backdrop-blur-md border-t border-white/10 pb-safe shadow-lg">
      <div className={`max-w-md mx-auto grid ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} items-center h-16 px-1`}>
        
        {/* Tab 1: Home */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'home' ? 'text-emerald-300 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-label="الرئيسية"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-tajawal mt-1">الرئيسية</span>
          {currentTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Tab 2: Self-Discovery */}
        <button
          onClick={() => {
            onNavigate('self-discovery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'self-discovery' || currentTab === 'assessment' ? 'text-emerald-300 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-label="افهم نفسك"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-tajawal mt-1">افهم نفسك</span>
          {(currentTab === 'self-discovery' || currentTab === 'assessment') && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Tab 3: Games & Rest */}
        <button
          onClick={() => {
            onNavigate('games');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'games' || currentTab === 'feker' ? 'text-emerald-300 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-label="استراحة وألعاب"
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] font-tajawal mt-1">خذ استراحة</span>
          {(currentTab === 'games' || currentTab === 'feker') && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Tab 4: Journey */}
        <button
          onClick={() => {
            onNavigate('journey');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'journey' ? 'text-emerald-300 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-label="رحلتي"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-tajawal mt-1">رحلتي</span>
          {currentTab === 'journey' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Tab 5: Support */}
        <button
          onClick={() => {
            onNavigate('support');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
            currentTab === 'support' ? 'text-emerald-300 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
          aria-label="اطلب الدعم"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-tajawal mt-1">اطلب الدعم</span>
          {currentTab === 'support' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* Tab 6: Admin (if privileged) */}
        {isAdmin && (
          <button
            onClick={() => {
              onNavigate('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
              currentTab === 'admin' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-amber-300'
            }`}
            aria-label="الإدارة"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-tajawal mt-1">الإدارة</span>
            {currentTab === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        )}

      </div>
    </nav>
  );
};
