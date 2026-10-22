import React from 'react';

export const ScreenLoader: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        <span className="absolute text-sm">🌱</span>
      </div>
      <p className="mt-3 text-xs text-stone-600 dark:text-stone-300 font-medium">لحظة لسلامك النفسي...</p>
    </div>
  );
};
