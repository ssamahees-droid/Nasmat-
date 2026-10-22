import React, { memo, useEffect, useRef } from 'react';

interface MobileAppShellProps {
  currentTab: string;
  children: React.ReactNode;
  isMobilePerformanceMode?: boolean;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = memo(({
  currentTab,
  children,
  isMobilePerformanceMode = false
}) => {
  const prevTabRef = useRef(currentTab);
  const isLowPerf = isMobilePerformanceMode;

  // Ensure scroll resets immediately to top on every screen change so new screen starts clean
  useEffect(() => {
    if (prevTabRef.current !== currentTab) {
      prevTabRef.current = currentTab;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [currentTab]);

  return (
    <div 
      className="w-full min-h-screen flex flex-col relative"
      id="nesma-mobile-app-shell"
    >
      {/* 
        Keyed screen isolation container:
        Guarantees that each screen is completely isolated in the DOM, 
        and never renders stacked or trailing after one another ('مش ورا بعض').
      */}
      <div
        key={currentTab}
        className={`w-full flex-1 flex flex-col ${isLowPerf ? '' : 'animate-fade-in'}`}
      >
        {children}
      </div>
    </div>
  );
});

MobileAppShell.displayName = 'MobileAppShell';
