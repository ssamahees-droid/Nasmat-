/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SafetyFlagModal } from './components/SafetyFlagModal';
import { AudioPlayerModal } from './components/AudioPlayerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ThoughtReleaseModal } from './components/ThoughtReleaseModal';
import { SoundscapeStudio } from './components/SoundscapeStudio';
import { EmotionCompassModal } from './components/EmotionCompassModal';
import { DailyWisdomModal } from './components/DailyWisdomModal';

// Interactive Phase Modals
import { AnaDelwaqtiModal } from './components/AnaDelwaqtiModal';
import { RescueKitModal } from './components/RescueKitModal';
import { BatteryCheckModal } from './components/BatteryCheckModal';
import { TranslateFeelingsModal } from './components/TranslateFeelingsModal';
import { FactOrStoryGameModal } from './components/FactOrStoryGameModal';
import { UntangleKnotModal } from './components/UntangleKnotModal';
import { NesmaLaughsModal } from './components/NesmaLaughsModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';

// PDF Booklet & Guided Plan Modals
import { NesmatBookletModal } from './components/NesmatBookletModal';
import { PersonalPlanModal } from './components/PersonalPlanModal';
import { EnergyBudgetModal } from './components/EnergyBudgetModal';
import { BoundaryBuilderModal } from './components/BoundaryBuilderModal';
import { SpecialistGuideModal } from './components/SpecialistGuideModal';

// Practical Workshops from PDF
import { WorkshopsHubModal } from './components/WorkshopsHubModal';
import { PsychologicalERModal } from './components/PsychologicalERModal';
import { ConflictWithoutWarModal } from './components/ConflictWithoutWarModal';
import { HealingJourneyModal } from './components/HealingJourneyModal';

// Mindful Thoughts Journal & Mindfulness Studio
import { ThoughtJournalModal } from './components/ThoughtJournalModal';
import { MindfulnessStudioModal } from './components/MindfulnessStudioModal';

// Fun, Jokes & Mind Games Hub
import { FunAndGamesHubModal } from './components/FunAndGamesHubModal';
import { GwayaHekayaGameModal } from './components/GwayaHekayaGameModal';
import { PersonalDiscoveryQuizModal } from './components/PersonalDiscoveryQuizModal';
import { FekerAppModal } from './components/FekerAppModal';
import { initAnonymousAuth } from './services/authService';
import { syncService } from './services/syncService';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ContentDetailScreen } from './screens/ContentDetailScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { SupportScreen } from './screens/SupportScreen';
import { BreatheScreen } from './screens/BreatheScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { FekerAppScreen } from './screens/FekerAppScreen';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => storage.hasCompletedOnboarding());
  const [currentStep, setCurrentStep] = useState<'welcome' | 'onboarding' | 'main'>(
    storage.hasCompletedOnboarding() ? 'main' : 'welcome'
  );
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => storage.getUser().role);
  const [selectedContentId, setSelectedContentId] = useState<string>('c1');

  // Theme state: Variation 1 (Dark Zen Obsidian) vs Warm Light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('nesmat_theme') as 'dark' | 'light') || 'dark';
  });

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nesmat_theme', next);
      return next;
    });
  };

  // Background Anonymous-First Authentication & Pilot Sync (Zero UI change)
  useEffect(() => {
    initAnonymousAuth()
      .then(() => {
        syncService.syncNow().catch(() => {});
      })
      .catch((err) => {
        console.warn('[Auth] Anonymous session init status:', err);
      });
  }, []);

  // Universal and Creative Modals state
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isThoughtReleaseOpen, setIsThoughtReleaseOpen] = useState(false);
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState(false);
  const [isEmotionCompassOpen, setIsEmotionCompassOpen] = useState(false);
  const [isDailyWisdomOpen, setIsDailyWisdomOpen] = useState(false);

  // Interactive Tools state
  const [isAnaDelwaqtiOpen, setIsAnaDelwaqtiOpen] = useState(false);
  const [isRescueKitOpen, setIsRescueKitOpen] = useState(false);
  const [selectedRescuePlanId, setSelectedRescuePlanId] = useState<string | undefined>(undefined);
  const [isBatteryCheckOpen, setIsBatteryCheckOpen] = useState(false);
  const [isTranslateFeelingsOpen, setIsTranslateFeelingsOpen] = useState(false);
  const [isFactGameOpen, setIsFactGameOpen] = useState(false);
  const [isUntangleKnotOpen, setIsUntangleKnotOpen] = useState(false);
  const [isNesmaLaughsOpen, setIsNesmaLaughsOpen] = useState(false);
  const [isEmergencyHelpOpen, setIsEmergencyHelpOpen] = useState(false);

  // PDF Booklet additions state
  const [isBookletOpen, setIsBookletOpen] = useState(false);
  const [isPersonalPlanOpen, setIsPersonalPlanOpen] = useState(false);
  const [isEnergyBudgetOpen, setIsEnergyBudgetOpen] = useState(false);
  const [isBoundaryBuilderOpen, setIsBoundaryBuilderOpen] = useState(false);
  const [isSpecialistGuideOpen, setIsSpecialistGuideOpen] = useState(false);

  // Practical Workshops Modals state
  const [isWorkshopsHubOpen, setIsWorkshopsHubOpen] = useState(false);
  const [isPsychologicalEROpen, setIsPsychologicalEROpen] = useState(false);
  const [isConflictWithoutWarOpen, setIsConflictWithoutWarOpen] = useState(false);
  const [isHealingJourneyOpen, setIsHealingJourneyOpen] = useState(false);

  // Mindful Thoughts Journal & Mindfulness Studio state
  const [isThoughtJournalOpen, setIsThoughtJournalOpen] = useState(false);
  const [isMindfulnessStudioOpen, setIsMindfulnessStudioOpen] = useState(false);

  // Fun, Jokes & Mind Games state
  const [funAndGamesState, setFunAndGamesState] = useState<{
    isOpen: boolean;
    tab: 'jokes' | 'bubbles' | 'riddles' | 'wheel' | 'memory';
  }>({
    isOpen: false,
    tab: 'jokes'
  });

  const [isGwayaHekayaOpen, setIsGwayaHekayaOpen] = useState(false);
  const [isDiscoveryQuizOpen, setIsDiscoveryQuizOpen] = useState(false);
  const [isFekerModalOpen, setIsFekerModalOpen] = useState(false);

  const [audioModalState, setAudioModalState] = useState<{
    isOpen: boolean;
    title: string;
    category: string;
    durationMinutes: number;
  }>({
    isOpen: false,
    title: '',
    category: '',
    durationMinutes: 5
  });

  const unreadNotifs = storage.getNotifications().filter(n => !n.read).length;

  const handleOpenContent = (id: string) => {
    setSelectedContentId(id);
    setCurrentTab('content-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAudio = (title: string, category: string, durationMinutes: number) => {
    setAudioModalState({
      isOpen: true,
      title,
      category,
      durationMinutes
    });
  };

  const handleFinishAudioCheckin = (moodResult: 'better' | 'same' | 'tired') => {
    const arabicFeeling = moodResult === 'better' ? 'أفضل 🌿' : moodResult === 'same' ? 'زي ما أنا 😐' : 'لسه متعب 🌧️';
    storage.addNote(`استمعت لجلسة «${audioModalState.title}». شعوري بعدها: ${arabicFeeling}`);
  };

  const handleRestartOnboarding = () => {
    storage.setOnboarded(false);
    setHasOnboarded(false);
    setCurrentStep('onboarding');
  };

  const handleOpenRescueKitWithPlan = (planId?: string) => {
    setSelectedRescuePlanId(planId);
    setIsRescueKitOpen(true);
  };

  // 1. Initial Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() => setCurrentStep('onboarding')}
      />
    );
  }

  // 2. Onboarding Screen
  if (currentStep === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => {
          setHasOnboarded(true);
          setCurrentStep('main');
          setCurrentTab('home');
        }}
      />
    );
  }

  // 3. Main Application Flow
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0c0c0e] text-[#e4e4e4] selection:bg-[#c4fb6d] selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        unreadNotificationsCount={unreadNotifs}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSafetyModal={() => setIsEmergencyHelpOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeScreen
            theme={theme}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenContent={handleOpenContent}
            onOpenAudioModal={handleOpenAudio}
            onOpenThoughtRelease={() => setIsThoughtReleaseOpen(true)}
            onOpenSoundscapeStudio={() => setIsSoundscapeOpen(true)}
            onOpenEmotionCompass={() => setIsEmotionCompassOpen(true)}
            onOpenDailyWisdom={() => setIsDailyWisdomOpen(true)}
            // Interactive Tools
            onOpenAnaDelwaqti={() => setIsAnaDelwaqtiOpen(true)}
            onOpenRescueKit={handleOpenRescueKitWithPlan}
            onOpenBatteryCheck={() => setIsBatteryCheckOpen(true)}
            onOpenTranslateFeelings={() => setIsTranslateFeelingsOpen(true)}
            onOpenFactGame={() => setIsFactGameOpen(true)}
            onOpenUntangleKnot={() => setIsUntangleKnotOpen(true)}
            onOpenNesmaLaughs={() => setIsNesmaLaughsOpen(true)}
            onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
            // PDF Booklet additions
            onOpenBooklet={() => setIsBookletOpen(true)}
            onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
            onOpenEnergyBudget={() => setIsEnergyBudgetOpen(true)}
            onOpenBoundaryBuilder={() => setIsBoundaryBuilderOpen(true)}
            onOpenSpecialistGuide={() => setIsSpecialistGuideOpen(true)}
            // PDF Workshops
            onOpenWorkshopsHub={() => setIsWorkshopsHubOpen(true)}
            onOpenPsychologicalER={() => setIsPsychologicalEROpen(true)}
            onOpenConflictWithoutWar={() => setIsConflictWithoutWarOpen(true)}
            onOpenHealingJourney={() => setIsHealingJourneyOpen(true)}
            // Thoughts Journal & Mindfulness Studio
            onOpenThoughtJournal={() => setIsThoughtJournalOpen(true)}
            onOpenMindfulnessStudio={() => setIsMindfulnessStudioOpen(true)}
            // Fun, Jokes & Mind Games
            onOpenFunAndGames={(tab = 'jokes') => setFunAndGamesState({ isOpen: true, tab })}
            // Gwaya Hekaya Interactive Game
            onOpenGwayaHekaya={() => setIsGwayaHekayaOpen(true)}
            // Feker App Integration
            onOpenFeker={() => setIsFekerModalOpen(true)}
            // Personal Discovery Quiz
            onOpenDiscoveryQuiz={() => setIsDiscoveryQuizOpen(true)}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            onOpenContent={handleOpenContent}
            onOpenAudioModal={handleOpenAudio}
            onOpenBooklet={() => setIsBookletOpen(true)}
          />
        )}

        {currentTab === 'content-detail' && (
          <ContentDetailScreen
            contentId={selectedContentId}
            onBack={() => setCurrentTab('explore')}
            onNavigateToSupport={() => setCurrentTab('support')}
            onOpenAudioModal={handleOpenAudio}
          />
        )}

        {currentTab === 'breathe' && (
          <BreatheScreen />
        )}

        {currentTab === 'assessment' && (
          <AssessmentScreen
            onNavigateToContent={() => setCurrentTab('explore')}
            onNavigateToSupport={() => setCurrentTab('support')}
            onTriggerSafetyModal={() => setIsEmergencyHelpOpen(true)}
          />
        )}

        {currentTab === 'support' && (
          <SupportScreen
            onOpenSafetyModal={() => setIsEmergencyHelpOpen(true)}
          />
        )}

        {currentTab === 'journey' && (
          <JourneyScreen
            onOpenAssessment={() => setCurrentTab('assessment')}
            onNavigateToContent={() => setCurrentTab('explore')}
            onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
            onOpenThoughtJournal={() => setIsThoughtJournalOpen(true)}
            onOpenMindfulnessStudio={() => setIsMindfulnessStudioOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenContent={handleOpenContent}
            onRestartOnboarding={handleRestartOnboarding}
          />
        )}

        {currentTab === 'feker' && (
          <FekerAppScreen
            onBackToHome={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardScreen
            currentRole={currentRole}
            onRoleChange={(role) => setCurrentRole(role)}
            onNavigateToUserApp={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Bottom Ergonomic Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={currentRole}
        onOpenGwayaHekaya={() => setIsGwayaHekayaOpen(true)}
        onOpenFeker={() => setIsFekerModalOpen(true)}
      />

      {/* ✍️ Mindful Thoughts Journal */}
      <ThoughtJournalModal
        isOpen={isThoughtJournalOpen}
        onClose={() => setIsThoughtJournalOpen(false)}
      />

      {/* 🧘 Mindfulness Studio */}
      <MindfulnessStudioModal
        isOpen={isMindfulnessStudioOpen}
        onClose={() => setIsMindfulnessStudioOpen(false)}
      />

      {/* 🎈 Fun, Jokes & Mind Games Hub */}
      <FunAndGamesHubModal
        isOpen={funAndGamesState.isOpen}
        initialTab={funAndGamesState.tab}
        onClose={() => setFunAndGamesState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 📖 Gwaya Hekaya Interactive Game */}
      <GwayaHekayaGameModal
        isOpen={isGwayaHekayaOpen}
        onClose={() => setIsGwayaHekayaOpen(false)}
      />

      {/* 🧭 Personal Discovery Quiz */}
      <PersonalDiscoveryQuizModal
        isOpen={isDiscoveryQuizOpen}
        onClose={() => setIsDiscoveryQuizOpen(false)}
      />

      {/* 💡 تطبيق فكّر المدمج (Feker App - AI Studio 6b9dc7c3) */}
      <FekerAppModal
        isOpen={isFekerModalOpen}
        onClose={() => setIsFekerModalOpen(false)}
      />

      {/* 🛠️ PDF Practical Workshops Modals */}
      <WorkshopsHubModal
        isOpen={isWorkshopsHubOpen}
        onClose={() => setIsWorkshopsHubOpen(false)}
        onOpenPsychologicalER={() => setIsPsychologicalEROpen(true)}
        onOpenConflictWithoutWar={() => setIsConflictWithoutWarOpen(true)}
        onOpenHealingJourney={() => setIsHealingJourneyOpen(true)}
        onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
        onOpenEnergyBudget={() => setIsEnergyBudgetOpen(true)}
        onOpenBoundaryBuilder={() => setIsBoundaryBuilderOpen(true)}
        onOpenUntangleKnot={() => setIsUntangleKnotOpen(true)}
        onOpenTranslateFeelings={() => setIsTranslateFeelingsOpen(true)}
        onOpenFactGame={() => setIsFactGameOpen(true)}
        onOpenSpecialistGuide={() => setIsSpecialistGuideOpen(true)}
      />

      <PsychologicalERModal
        isOpen={isPsychologicalEROpen}
        onClose={() => setIsPsychologicalEROpen(false)}
        onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
      />

      <ConflictWithoutWarModal
        isOpen={isConflictWithoutWarOpen}
        onClose={() => setIsConflictWithoutWarOpen(false)}
      />

      <HealingJourneyModal
        isOpen={isHealingJourneyOpen}
        onClose={() => setIsHealingJourneyOpen(false)}
      />

      {/* 📖 PDF Booklet & Personal Plan Modals */}
      <NesmatBookletModal
        isOpen={isBookletOpen}
        onClose={() => setIsBookletOpen(false)}
        onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
        onOpenEnergyBudget={() => setIsEnergyBudgetOpen(true)}
        onOpenBoundaryBuilder={() => setIsBoundaryBuilderOpen(true)}
        onOpenSpecialistGuide={() => setIsSpecialistGuideOpen(true)}
        onOpenUntangleKnot={() => setIsUntangleKnotOpen(true)}
      />

      <PersonalPlanModal
        isOpen={isPersonalPlanOpen}
        onClose={() => setIsPersonalPlanOpen(false)}
      />

      <EnergyBudgetModal
        isOpen={isEnergyBudgetOpen}
        onClose={() => setIsEnergyBudgetOpen(false)}
      />

      <BoundaryBuilderModal
        isOpen={isBoundaryBuilderOpen}
        onClose={() => setIsBoundaryBuilderOpen(false)}
      />

      <SpecialistGuideModal
        isOpen={isSpecialistGuideOpen}
        onClose={() => setIsSpecialistGuideOpen(false)}
        onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
        onNavigateToSupport={() => {
          setCurrentTab('support');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 🌿 Interactive Phase Modals */}
      <AnaDelwaqtiModal
        isOpen={isAnaDelwaqtiOpen}
        onClose={() => setIsAnaDelwaqtiOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
        onOpenUntangle={() => setIsUntangleKnotOpen(true)}
        onOpenTranslate={() => setIsTranslateFeelingsOpen(true)}
        onOpenBattery={() => setIsBatteryCheckOpen(true)}
        onOpenLaughs={() => setIsNesmaLaughsOpen(true)}
      />

      <RescueKitModal
        isOpen={isRescueKitOpen}
        onClose={() => setIsRescueKitOpen(false)}
        initialPlanId={selectedRescuePlanId}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContent={handleOpenContent}
      />

      <BatteryCheckModal
        isOpen={isBatteryCheckOpen}
        onClose={() => setIsBatteryCheckOpen(false)}
      />

      <TranslateFeelingsModal
        isOpen={isTranslateFeelingsOpen}
        onClose={() => setIsTranslateFeelingsOpen(false)}
      />

      <FactOrStoryGameModal
        isOpen={isFactGameOpen}
        onClose={() => setIsFactGameOpen(false)}
      />

      <UntangleKnotModal
        isOpen={isUntangleKnotOpen}
        onClose={() => setIsUntangleKnotOpen(false)}
      />

      <NesmaLaughsModal
        isOpen={isNesmaLaughsOpen}
        onClose={() => setIsNesmaLaughsOpen(false)}
      />

      <EmergencyHelpModal
        isOpen={isEmergencyHelpOpen}
        onClose={() => setIsEmergencyHelpOpen(false)}
      />

      {/* Universal Audio & Notification Modals */}
      <SafetyFlagModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <AudioPlayerModal
        isOpen={audioModalState.isOpen}
        onClose={() => setAudioModalState(prev => ({ ...prev, isOpen: false }))}
        title={audioModalState.title}
        category={audioModalState.category}
        durationMinutes={audioModalState.durationMinutes}
        onFinishCheckin={handleFinishAudioCheckin}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToContent={() => setCurrentTab('explore')}
        onNavigateToBreathe={() => setCurrentTab('breathe')}
      />

      <ThoughtReleaseModal
        isOpen={isThoughtReleaseOpen}
        onClose={() => setIsThoughtReleaseOpen(false)}
      />

      <SoundscapeStudio
        isOpen={isSoundscapeOpen}
        onClose={() => setIsSoundscapeOpen(false)}
      />

      <EmotionCompassModal
        isOpen={isEmotionCompassOpen}
        onClose={() => setIsEmotionCompassOpen(false)}
      />

      <DailyWisdomModal
        isOpen={isDailyWisdomOpen}
        onClose={() => setIsDailyWisdomOpen(false)}
      />
    </div>
  );
}
