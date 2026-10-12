import React from 'react';
import { CompanionInteractiveWidget } from './CompanionInteractiveWidget';

interface CompanionFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenModalByName?: (name: string, data?: any) => void;
}

export const CompanionFloatingButton: React.FC<CompanionFloatingButtonProps> = ({
  onClick,
  isOpen,
  currentTab = 'home',
  onNavigate,
  onOpenModalByName
}) => {
  return (
    <CompanionInteractiveWidget
      currentTab={currentTab}
      onOpenFullModal={onClick}
      isFullModalOpen={isOpen}
      onNavigate={onNavigate}
      onOpenModalByName={onOpenModalByName}
    />
  );
};
