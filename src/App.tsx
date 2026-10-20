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
import { VoiceJournalModal } from './components/VoiceJournalModal';

// Fun, Jokes & Mind Games Hub
import { FunAndGamesHubModal } from './components/FunAndGamesHubModal';
import { GwayaHekayaGameModal } from './components/GwayaHekayaGameModal';
import { InnerBurdensBubbleGameModal } from './components/InnerBurdensBubbleGameModal';
import { EmotionalBridgeGameModal } from './components/EmotionalBridgeGameModal';
import { GratitudeGardenModal } from './components/GratitudeGardenModal';
import { InnerCompassJourneyModal } from './components/InnerCompassJourneyModal';
import { CognitiveReframingPuzzleModal } from './components/CognitiveReframingPuzzleModal';
import { InnerLabyrinthModal } from './components/InnerLabyrinthModal';
import { DigitalReleaseRitualModal } from './components/DigitalReleaseRitualModal';
import { RelationalEnergyMatrixModal } from './components/RelationalEnergyMatrixModal';
import { PersonalDiscoveryQuizModal } from './components/PersonalDiscoveryQuizModal';
import { FekerAppModal } from './components/FekerAppModal';
import { MoodKitchenModal } from './components/MoodKitchenModal';
import { CompanionModal } from './components/CompanionModal';
import { CompanionFloatingButton } from './components/CompanionFloatingButton';
import { EndlessPsychologyKnowledgeHub } from './components/EndlessPsychologyKnowledgeHub';
import { PersonalityTypologyModal } from './components/PersonalityTypologyModal';
import { DailyMiracleDrawerModal } from './components/DailyMiracleDrawerModal';
import { EmotionalOrigamiGardenModal } from './components/EmotionalOrigamiGardenModal';
import { OmarKhairatMusicLoungeModal } from './components/OmarKhairatMusicLoungeModal';
import { MusicPrototypeTester } from './components/MusicPrototypeTester';
import { SampledMusicTester } from './components/SampledMusicTester';
import { AudioEngineComparisonModal } from './components/AudioEngineComparisonModal';
import { PWAFloatingInstallBadge } from './components/PWAFloatingInstallBadge';
import { ActivityRatingModal, ActivityRatingItem } from './components/ActivityRatingModal';
import { localNotificationService } from './services/localNotificationService';
import { Footer } from './components/Footer';
import { initAnonymousAuth } from './services/authService';
import { syncService } from './services/syncService';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { StartScreen } from './screens/StartScreen';
import { SelfDiscoveryScreen } from './screens/SelfDiscoveryScreen';
import { GamesScreen } from './screens/GamesScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { RescueScreen } from './screens/RescueScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ContentDetailScreen } from './screens/ContentDetailScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { SupportScreen } from './screens/SupportScreen';
import { BreatheScreen } from './screens/BreatheScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { FekerAppScreen } from './screens/FekerAppScreen';
import { ListenToYourselfScreen } from './screens/ListenToYourselfScreen';
import { WeeklySessionScreen } from './screens/WeeklySessionScreen';

const VALID_TABS: Record<string, string> = {
  '': 'home',
  'home': 'home',
  'start': 'start',
  'self-discovery': 'self-discovery',
  'games': 'games',
  'explore': 'explore',
  'practice': 'practice',
  'rescue': 'rescue',
  'support': 'support',
  'journey': 'journey',
  'profile': 'profile',
  'account': 'profile',
  'feker': 'feker',
  'admin': 'admin',
  'breathe': 'breathe',
  'assessment': 'assessment',
  'listen-to-yourself': 'listen-to-yourself',
  'listen': 'listen-to-yourself',
  'weekly-session': 'weekly-session',
  'weekly': 'weekly-session'
};

function getRouteFromLocation(): { tab: string; isExplicitDeepLink: boolean } {
  if (typeof window === 'undefined') return { tab: 'home', isExplicitDeepLink: false };
  const path = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0].toLowerCase();
  const segment = path || hash;
  if (segment && VALID_TABS[segment]) {
    return { tab: VALID_TABS[segment], isExplicitDeepLink: segment !== '' && segment !== 'home' };
  }
  return { tab: 'home', isExplicitDeepLink: false };
}

export default function App() {
  const initialRoute = getRouteFromLocation();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => storage.hasCompletedOnboarding());
  const [currentStep, setCurrentStep] = useState<'welcome' | 'onboarding' | 'main'>(() => {
    if (storage.hasCompletedOnboarding()) {
      return 'main';
    }
    // If a visitor directly opened a specific section (e.g. /rescue, /support),
    // enter directly so urgent help isn't blocked by onboarding
    if (initialRoute.isExplicitDeepLink) {
      return 'main';
    }
    return 'welcome';
  });
  const [currentTab, setCurrentTab] = useState<string>(initialRoute.tab);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => storage.getUser().role);
  const [selectedContentId, setSelectedContentId] = useState<string>('c1');

  const handleNavigate = (tab: string, pushHistory: boolean = true) => {
    const resolvedTab = tab === 'listen' ? 'listen-to-yourself' : tab === 'weekly' ? 'weekly-session' : tab;
    setCurrentTab(resolvedTab);
    if (pushHistory && typeof window !== 'undefined') {
      const targetUrl = resolvedTab === 'home' ? '/' : `/${resolvedTab}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ tab: resolvedTab }, '', targetUrl);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const { tab } = getRouteFromLocation();
      setCurrentTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme state: light, dark, system
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('nesmat_theme') as 'dark' | 'light' | 'system') || 'light';
  });

  // Font size state: normal, large, extralarge
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extralarge'>(() => {
    return (localStorage.getItem('nesmat_fontsize') as 'normal' | 'large' | 'extralarge') || 'normal';
  });

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const applyTheme = (t: 'dark' | 'light' | 'system') => {
      localStorage.setItem('nesmat_theme', t);
      let effectiveTheme: 'dark' | 'light' = 'light';
      if (t === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = prefersDark ? 'dark' : 'light';
      } else {
        effectiveTheme = t;
      }

      if (effectiveTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nesmat_fontsize', fontSize);
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-extralarge');
    document.documentElement.classList.add(`font-${fontSize}`);
  }, [fontSize]);

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

  // 🔔 Local Notification Monitor for 24-hour Mood Kitchen inactivity
  const [notificationToast, setNotificationToast] = useState<{
    id: string;
    title: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    const stopMonitor = localNotificationService.startAutoMonitor(15);

    const handleOpenMoodKitchenEvent = () => {
      setIsMoodKitchenOpen(true);
    };

    const handleNotificationDispatched = (e: any) => {
      const notif = e.detail?.notification;
      if (notif) {
        setNotificationToast({
          id: notif.id,
          title: notif.title,
          body: notif.body
        });
      }
    };

    window.addEventListener('nesmat_open_mood_kitchen', handleOpenMoodKitchenEvent);
    window.addEventListener('nesmat_notification_dispatched', handleNotificationDispatched);

    return () => {
      stopMonitor();
      window.removeEventListener('nesmat_open_mood_kitchen', handleOpenMoodKitchenEvent);
      window.removeEventListener('nesmat_notification_dispatched', handleNotificationDispatched);
    };
  }, []);

  // Universal and Creative Modals state
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isThoughtReleaseOpen, setIsThoughtReleaseOpen] = useState(false);
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState(false);
  const [isEmotionCompassOpen, setIsEmotionCompassOpen] = useState(false);
  const [isDailyWisdomOpen, setIsDailyWisdomOpen] = useState(false);
  const [endlessPsychologyState, setEndlessPsychologyState] = useState<{ isOpen: boolean; category: string }>({
    isOpen: false,
    category: 'all'
  });
  const [activityRatingState, setActivityRatingState] = useState<{
    isOpen: boolean;
    activity: ActivityRatingItem | null;
  }>({
    isOpen: false,
    activity: null
  });
  const [personalityTypologyState, setPersonalityTypologyState] = useState<{
    isOpen: boolean;
    initialType: 'mbti16' | 'bigfive' | 'attachment' | 'stress_coping';
  }>({
    isOpen: false,
    initialType: 'mbti16'
  });
  const [isDailyMiracleOpen, setIsDailyMiracleOpen] = useState(false);
  const [isOrigamiGardenOpen, setIsOrigamiGardenOpen] = useState(false);
  const [isMusicLoungeOpen, setIsMusicLoungeOpen] = useState(false);
  const [isMusicPrototypeTesterOpen, setIsMusicPrototypeTesterOpen] = useState(false);
  const [isSampledMusicTesterOpen, setIsSampledMusicTesterOpen] = useState(false);
  const [isAudioComparisonOpen, setIsAudioComparisonOpen] = useState(false);

  const triggerActivityRating = (activityId: string, activityTitle: string, category: string) => {
    setActivityRatingState({
      isOpen: true,
      activity: { activityId, activityTitle, category }
    });
  };

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
  const [isVoiceJournalOpen, setIsVoiceJournalOpen] = useState(false);

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
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  // Creative Psychological Games
  const [isInnerBurdensOpen, setIsInnerBurdensOpen] = useState(false);
  const [isEmotionalBridgeOpen, setIsEmotionalBridgeOpen] = useState(false);
  const [isGratitudeGardenOpen, setIsGratitudeGardenOpen] = useState(false);
  const [isInnerCompassOpen, setIsInnerCompassOpen] = useState(false);
  const [isReframingPuzzleOpen, setIsReframingPuzzleOpen] = useState(false);
  const [isInnerLabyrinthOpen, setIsInnerLabyrinthOpen] = useState(false);
  const [isDigitalReleaseOpen, setIsDigitalReleaseOpen] = useState(false);
  const [isRelationalEnergyOpen, setIsRelationalEnergyOpen] = useState(false);
  const [isMoodKitchenOpen, setIsMoodKitchenOpen] = useState(false);

  const handleOpenModalByName = (modalName: string, extraData?: any) => {
    switch (modalName) {
      case 'mood_kitchen':
        setIsMoodKitchenOpen(true);
        break;
      case 'inner_burdens':
        setIsInnerBurdensOpen(true);
        break;
      case 'music_lounge':
      case 'omar_khairat':
        setIsMusicLoungeOpen(true);
        break;
      case 'emotional_bridge':
        setIsEmotionalBridgeOpen(true);
        break;
      case 'gratitude_garden':
        setIsGratitudeGardenOpen(true);
        break;
      case 'inner_compass':
        setIsInnerCompassOpen(true);
        break;
      case 'reframing_puzzle':
        setIsReframingPuzzleOpen(true);
        break;
      case 'inner_labyrinth':
        setIsInnerLabyrinthOpen(true);
        break;
      case 'digital_release':
        setIsDigitalReleaseOpen(true);
        break;
      case 'relational_energy':
        setIsRelationalEnergyOpen(true);
        break;
      case 'ana_delwaqti':
        setIsAnaDelwaqtiOpen(true);
        break;
      case 'untangle_knot':
        setIsUntangleKnotOpen(true);
        break;
      case 'thought_release':
        setIsThoughtReleaseOpen(true);
        break;
      case 'gwaya_hekaya':
        setIsGwayaHekayaOpen(true);
        break;
      case 'soundscape':
        setIsSoundscapeOpen(true);
        break;
      case 'emotion_compass':
        setIsEmotionCompassOpen(true);
        break;
      case 'daily_wisdom':
        setIsDailyWisdomOpen(true);
        break;
      case 'energy_budget':
        setIsEnergyBudgetOpen(true);
        break;
      case 'boundary_builder':
        setIsBoundaryBuilderOpen(true);
        break;
      case 'specialist_guide':
        setIsSpecialistGuideOpen(true);
        break;
      case 'booklet':
        setIsBookletOpen(true);
        break;
      case 'emergency_help':
        setIsEmergencyHelpOpen(true);
        break;
      case 'rescue_kit':
        setIsRescueKitOpen(true);
        break;
      case 'battery_check':
        setIsBatteryCheckOpen(true);
        break;
      case 'translate_feelings':
        setIsTranslateFeelingsOpen(true);
        break;
      case 'fact_game':
        setIsFactGameOpen(true);
        break;
      case 'nesma_laughs':
        setIsNesmaLaughsOpen(true);
        break;
      case 'feker':
        setIsFekerModalOpen(true);
        break;
      case 'discovery_quiz':
        setIsDiscoveryQuizOpen(true);
        break;
      case 'personality_tests':
      case 'personality':
      case 'personality_typology':
      case 'mbti':
        setPersonalityTypologyState({ isOpen: true, initialType: 'mbti16' });
        break;
      case 'bigfive':
        setPersonalityTypologyState({ isOpen: true, initialType: 'bigfive' });
        break;
      case 'attachment':
        setPersonalityTypologyState({ isOpen: true, initialType: 'attachment' });
        break;
      case 'stress_coping':
        setPersonalityTypologyState({ isOpen: true, initialType: 'stress_coping' });
        break;
      case 'workshops_hub':
        setIsWorkshopsHubOpen(true);
        break;
      case 'psychological_er':
        setIsPsychologicalEROpen(true);
        break;
      case 'conflict_without_war':
        setIsConflictWithoutWarOpen(true);
        break;
      case 'healing_journey':
        setIsHealingJourneyOpen(true);
        break;
      case 'thought_journal':
        setIsThoughtJournalOpen(true);
        break;
      case 'mindfulness_studio':
        setIsMindfulnessStudioOpen(true);
        break;
      case 'fun_games':
        setFunAndGamesState({ isOpen: true, tab: 'jokes' });
        break;
      default:
        console.warn('Unknown modal name:', modalName);
    }
  };

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
    handleNavigate('content-detail');
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
        onSkip={() => {
          setHasOnboarded(true);
          storage.setOnboarded(true);
          setCurrentStep('main');
          handleNavigate('home');
        }}
      />
    );
  }

  // 2. Onboarding Screen
  if (currentStep === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => {
          setHasOnboarded(true);
          storage.setOnboarded(true);
          setCurrentStep('main');
          handleNavigate('home');
        }}
        onSkip={() => {
          setHasOnboarded(true);
          storage.setOnboarded(true);
          setCurrentStep('main');
          handleNavigate('home');
        }}
      />
    );
  }

  // 3. Main Application Flow
  return (
    <div className={`min-h-screen flex flex-col font-cairo transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0D1914] text-[#F7F3E9] selection:bg-[#A9C5A0] selection:text-[#0D1914]' 
        : 'bg-[#F7F3E9] text-[#13251E] selection:bg-[#A9C5A0] selection:text-[#174C3C]'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        unreadNotificationsCount={unreadNotifs}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSafetyModal={() => setIsEmergencyHelpOpen(true)}
        onOpenCompanion={() => setIsCompanionOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeScreen
            theme={theme}
            onNavigate={handleNavigate}
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
            onOpenPersonalityTests={() => setPersonalityTypologyState({ isOpen: true, initialType: 'mbti16' })}
            onOpenCompanion={() => setIsCompanionOpen(true)}
            onOpenMoodKitchen={() => setIsMoodKitchenOpen(true)}
            onOpenInnerBurdens={() => setIsInnerBurdensOpen(true)}
            onOpenEmotionalBridge={() => setIsEmotionalBridgeOpen(true)}
            onOpenGratitudeGarden={() => setIsGratitudeGardenOpen(true)}
            onOpenDailyMiracle={() => setIsDailyMiracleOpen(true)}
            onOpenOrigamiGarden={() => setIsOrigamiGardenOpen(true)}
            onOpenMusicLounge={() => setIsMusicLoungeOpen(true)}
            onOpenEndlessPsychology={(cat) => setEndlessPsychologyState({ isOpen: true, category: cat })}
          />
        )}

        {currentTab === 'start' && (
          <StartScreen
            onNavigate={handleNavigate}
            onOpenBooklet={() => setIsBookletOpen(true)}
            onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
          />
        )}

        {currentTab === 'self-discovery' && (
          <SelfDiscoveryScreen
            onNavigate={handleNavigate}
            onOpenAssessment={() => handleNavigate('assessment')}
            onOpenDiscoveryQuiz={() => setIsDiscoveryQuizOpen(true)}
            onOpenPersonalityTests={() => setPersonalityTypologyState({ isOpen: true, initialType: 'mbti16' })}
            onOpenAnaDelwaqti={() => setIsAnaDelwaqtiOpen(true)}
            onOpenEmotionCompass={() => setIsEmotionCompassOpen(true)}
            onOpenBatteryCheck={() => setIsBatteryCheckOpen(true)}
            onOpenTranslateFeelings={() => setIsTranslateFeelingsOpen(true)}
          />
        )}

        {currentTab === 'games' && (
          <GamesScreen
            onNavigate={handleNavigate}
            onOpenGwayaHekaya={() => setIsGwayaHekayaOpen(true)}
            onOpenFeker={() => setIsFekerModalOpen(true)}
            onOpenFactGame={() => setIsFactGameOpen(true)}
            onOpenUntangleKnot={() => setIsUntangleKnotOpen(true)}
            onOpenSoundscapeStudio={() => setIsSoundscapeOpen(true)}
            onOpenThoughtRelease={() => setIsThoughtReleaseOpen(true)}
            onOpenFunAndGames={(tab = 'jokes') => setFunAndGamesState({ isOpen: true, tab })}
            onOpenNesmaLaughs={() => setIsNesmaLaughsOpen(true)}
            onOpenInnerBurdens={() => setIsInnerBurdensOpen(true)}
            onOpenEmotionalBridge={() => setIsEmotionalBridgeOpen(true)}
            onOpenGratitudeGarden={() => setIsGratitudeGardenOpen(true)}
            onOpenInnerCompass={() => setIsInnerCompassOpen(true)}
            onOpenReframingPuzzle={() => setIsReframingPuzzleOpen(true)}
            onOpenInnerLabyrinth={() => setIsInnerLabyrinthOpen(true)}
            onOpenDigitalRelease={() => setIsDigitalReleaseOpen(true)}
            onOpenRelationalEnergy={() => setIsRelationalEnergyOpen(true)}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeScreen
            onNavigate={handleNavigate}
            onOpenBreathe={() => handleNavigate('breathe')}
            onOpenMindfulnessStudio={() => setIsMindfulnessStudioOpen(true)}
            onOpenThoughtJournal={() => setIsThoughtJournalOpen(true)}
            onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
            onOpenEnergyBudget={() => setIsEnergyBudgetOpen(true)}
            onOpenBoundaryBuilder={() => setIsBoundaryBuilderOpen(true)}
            onOpenMusicLounge={() => setIsMusicLoungeOpen(true)}
          />
        )}

        {currentTab === 'rescue' && (
          <RescueScreen
            onNavigate={handleNavigate}
            onOpenRescueKit={handleOpenRescueKitWithPlan}
            onOpenPsychologicalER={() => setIsPsychologicalEROpen(true)}
            onOpenSpecialistGuide={() => setIsSpecialistGuideOpen(true)}
            onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
            onOpenUntangleKnot={() => setIsUntangleKnotOpen(true)}
            onOpenBatteryCheck={() => setIsBatteryCheckOpen(true)}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            onOpenContent={handleOpenContent}
            onOpenAudioModal={handleOpenAudio}
            onOpenBooklet={() => setIsBookletOpen(true)}
            onNavigate={handleNavigate}
            onOpenWorkshopsHub={() => setIsWorkshopsHubOpen(true)}
            onOpenPsychologicalER={() => setIsPsychologicalEROpen(true)}
            onOpenConflictWithoutWar={() => setIsConflictWithoutWarOpen(true)}
            onOpenHealingJourney={() => setIsHealingJourneyOpen(true)}
            onOpenMoodKitchen={() => setIsMoodKitchenOpen(true)}
          />
        )}

        {currentTab === 'listen-to-yourself' && (
          <ListenToYourselfScreen 
            onNavigate={handleNavigate} 
            onOpenMusicLounge={() => setIsMusicLoungeOpen(true)}
          />
        )}

        {currentTab === 'weekly-session' && (
          <WeeklySessionScreen onNavigate={handleNavigate} />
        )}

        {currentTab === 'content-detail' && (
          <ContentDetailScreen
            contentId={selectedContentId}
            onBack={() => handleNavigate('explore')}
            onNavigateToSupport={() => handleNavigate('support')}
            onOpenAudioModal={handleOpenAudio}
          />
        )}

        {currentTab === 'breathe' && (
          <BreatheScreen onOpenMusicLounge={() => setIsMusicLoungeOpen(true)} />
        )}

        {currentTab === 'assessment' && (
          <AssessmentScreen
            onNavigateToContent={() => handleNavigate('explore')}
            onNavigateToSupport={() => handleNavigate('support')}
            onTriggerSafetyModal={() => setIsEmergencyHelpOpen(true)}
          />
        )}

        {currentTab === 'support' && (
          <SupportScreen
            onOpenSafetyModal={() => setIsEmergencyHelpOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'journey' && (
          <JourneyScreen
            onOpenAssessment={() => handleNavigate('assessment')}
            onNavigateToContent={() => handleNavigate('explore')}
            onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
            onOpenThoughtJournal={() => setIsThoughtJournalOpen(true)}
            onOpenMindfulnessStudio={() => setIsMindfulnessStudioOpen(true)}
            onOpenVoiceJournal={() => setIsVoiceJournalOpen(true)}
            onNavigateToBreathe={() => handleNavigate('breathe')}
            onNavigateToListen={() => handleNavigate('listen')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onNavigate={handleNavigate}
            onOpenContent={handleOpenContent}
            onRestartOnboarding={handleRestartOnboarding}
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        )}

        {currentTab === 'feker' && (
          <FekerAppScreen
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardScreen
            currentRole={currentRole}
            onRoleChange={(role) => setCurrentRole(role)}
            onNavigateToUserApp={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Variation 6 Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
        onOpenBooklet={() => setIsBookletOpen(true)}
      />

      {/* Bottom Ergonomic Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
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

      {/* 🫧 1. لعبة فرقعة الفقاعات النفسية (Pop the Inner Burdens) */}
      <InnerBurdensBubbleGameModal
        isOpen={isInnerBurdensOpen}
        onClose={() => {
          setIsInnerBurdensOpen(false);
          triggerActivityRating('inner_burdens', 'لعبة فرقعة الأعباء النفسية', 'ألعاب التهدئة');
        }}
      />

      {/* 🌉 2. لعبة بناء الجسر العاطفي (Build the Bridge) */}
      <EmotionalBridgeGameModal
        isOpen={isEmotionalBridgeOpen}
        onClose={() => {
          setIsEmotionalBridgeOpen(false);
          triggerActivityRating('emotional_bridge', 'لعبة بناء الجسر العاطفي', 'ألعاب التهدئة');
        }}
      />

      {/* 🌸 3. لعبة حديقة الامتنان اليومية (The Daily Gratitude Garden) */}
      <GratitudeGardenModal
        isOpen={isGratitudeGardenOpen}
        onClose={() => {
          setIsGratitudeGardenOpen(false);
          triggerActivityRating('gratitude_garden', 'حديقة الامتنان اليومية', 'ألعاب التهدئة');
        }}
      />

      {/* 🧭 4. لعبة رحلة البوصلة الداخلية (Inner Compass Journey) */}
      <InnerCompassJourneyModal
        isOpen={isInnerCompassOpen}
        onClose={() => {
          setIsInnerCompassOpen(false);
          triggerActivityRating('inner_compass', 'رحلة البوصلة الداخلية', 'رحلة الاستكشاف');
        }}
      />

      {/* 🧩 5. لعبة صانع الأنماط: فك شفرة الأفكار (Cognitive Reframing Puzzle) */}
      <CognitiveReframingPuzzleModal
        isOpen={isReframingPuzzleOpen}
        onClose={() => {
          setIsReframingPuzzleOpen(false);
          triggerActivityRating('reframing_puzzle', 'لعبة فك شفرة الأفكار', 'ألعاب التهدئة');
        }}
      />

      {/* 🌀 6. لعبة متاهة الهدوء التفاعلية (The Inner Labyrinth) */}
      <InnerLabyrinthModal
        isOpen={isInnerLabyrinthOpen}
        onClose={() => {
          setIsInnerLabyrinthOpen(false);
          triggerActivityRating('inner_labyrinth', 'متاهة الهدوء التفاعلية', 'ألعاب التهدئة');
        }}
      />

      {/* 🪞 7. لعبة مرآة الأعماق: طقوس التحرر الرقمي (Digital Release Ritual) */}
      <DigitalReleaseRitualModal
        isOpen={isDigitalReleaseOpen}
        onClose={() => {
          setIsDigitalReleaseOpen(false);
          triggerActivityRating('digital_release', 'مرآة الأعماق وطقوس التحرر', 'ألعاب التهدئة');
        }}
      />

      {/* 🪐 8. لعبة حصاد طاقة الروابط (The Relational Energy Matrix) */}
      <RelationalEnergyMatrixModal
        isOpen={isRelationalEnergyOpen}
        onClose={() => {
          setIsRelationalEnergyOpen(false);
          triggerActivityRating('relational_matrix', 'مصفوفة طاقة الروابط', 'ألعاب التهدئة');
        }}
      />

      {/* 🧭 Personal Discovery Quiz */}
      <PersonalDiscoveryQuizModal
        isOpen={isDiscoveryQuizOpen}
        onClose={() => {
          setIsDiscoveryQuizOpen(false);
          triggerActivityRating('discovery_quiz', 'اختبار الاستكشاف الشخصي', 'رحلة الاستكشاف');
        }}
      />

      {/* 💡 تطبيق فكّر المدمج (Feker App - AI Studio 6b9dc7c3) */}
      <FekerAppModal
        isOpen={isFekerModalOpen}
        onClose={() => {
          setIsFekerModalOpen(false);
          triggerActivityRating('feker_app', 'تطبيق فكّر لتفكيك الأفكار', 'ورش العمل');
        }}
      />

      {/* 🍲 مطبخ المزاج — غذاء يدعم أمعاءك وعافيتك النفسية */}
      <MoodKitchenModal
        isOpen={isMoodKitchenOpen}
        onClose={() => setIsMoodKitchenOpen(false)}
      />

      {/* ⭐ تقييم الأنشطة والألعاب (5 نجوم) لتقييم الفائدة والتأثير */}
      <ActivityRatingModal
        isOpen={activityRatingState.isOpen}
        activity={activityRatingState.activity}
        onClose={() => setActivityRatingState({ isOpen: false, activity: null })}
        theme={theme}
      />

      {/* 🧠 موسوعة المعلومات النفسية اللانهائية */}
      <EndlessPsychologyKnowledgeHub
        isOpen={endlessPsychologyState.isOpen}
        initialCategory={endlessPsychologyState.category}
        onClose={() => setEndlessPsychologyState(prev => ({ ...prev, isOpen: false }))}
        theme={theme}
      />

      {/* 🧭 اختبارات تصنيف الشخصية والأنماط النفسية المتقدمة */}
      <PersonalityTypologyModal
        isOpen={personalityTypologyState.isOpen}
        initialTestType={personalityTypologyState.initialType}
        onClose={() => {
          setPersonalityTypologyState(prev => ({ ...prev, isOpen: false }));
          triggerActivityRating('personality_typology', 'اختبارات تصنيف الشخصية والأنماط', 'رحلة الاستكشاف');
        }}
        onOpenActivity={(activityId) => handleOpenModalByName(activityId)}
        theme={theme}
      />

      {/* ✨ درج المعجزات الصغيرة اليومية (Daily Miracle Drawer) */}
      <DailyMiracleDrawerModal
        isOpen={isDailyMiracleOpen}
        onClose={() => setIsDailyMiracleOpen(false)}
        onOpenActivity={(activityId) => handleOpenModalByName(activityId)}
        theme={theme}
      />

      {/* 🕊️ حديقة الأوريغامي الشعوري (Emotional Origami Garden) */}
      <EmotionalOrigamiGardenModal
        isOpen={isOrigamiGardenOpen}
        onClose={() => setIsOrigamiGardenOpen(false)}
        onOpenActivity={(activityId) => handleOpenModalByName(activityId)}
        theme={theme}
      />

      {/* 🎹 صالون النغم والسكينة (موسيقى عمر خيرت والموسيقى الهادئة) */}
      <OmarKhairatMusicLoungeModal
        isOpen={isMusicLoungeOpen}
        onClose={() => {
          setIsMusicLoungeOpen(false);
          triggerActivityRating('omar_khairat_music', 'صالون النغم والسكينة (عمر خيرت)', 'جلسات الاسترخاء');
        }}
        onNavigate={handleNavigate}
      />

      {/* 🧪 نافذة اختبار النموذج الأولي الموسيقي الاحترافي */}
      <MusicPrototypeTester
        isOpen={isMusicPrototypeTesterOpen}
        onClose={() => setIsMusicPrototypeTesterOpen(false)}
      />

      {/* 🎹 نافذة اختبار عينات البيانو الحقيقية */}
      <SampledMusicTester
        isOpen={isSampledMusicTesterOpen}
        onClose={() => setIsSampledMusicTesterOpen(false)}
      />

      {/* 🎧 صفحة المقارنة الصوتية التفاعلية (15 ثانية A/B Test) */}
      <AudioEngineComparisonModal
        isOpen={isAudioComparisonOpen}
        onClose={() => setIsAudioComparisonOpen(false)}
      />

      {/* 📱 شارة تثبيت التطبيق المخصصة عند توفر حدث التثبيت */}
      <PWAFloatingInstallBadge />

      {/* أزرار عائمة لاختبار النماذج والمقارنة التفاعلية */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setIsAudioComparisonOpen(true)}
          className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-500 hover:from-amber-400 hover:via-emerald-500 hover:to-teal-400 text-stone-950 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black border border-white/30 transition-all transform hover:scale-105 active:scale-95 ring-2 ring-emerald-400/50"
          title="مقارنة صوتية تفاعلية: عينة 15 ثانية متطابقة النغمات"
        >
          <span className="text-lg">🎧</span>
          <span className="flex flex-col text-right leading-tight">
            <span>مقارنة صوتية تفاعلية (A/B Test)</span>
            <span className="text-[10px] font-normal text-stone-900/80">عينة 15 ثانية متطابقة النغمات</span>
          </span>
        </button>
      </div>

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
        onOpenMoodKitchen={() => setIsMoodKitchenOpen(true)}
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

      <VoiceJournalModal
        isOpen={isVoiceJournalOpen}
        onClose={() => setIsVoiceJournalOpen(false)}
      />

      {/* 🌿 شخصية نسمة حياة — الحضور التفاعلي الدائم عبر كامل أقسام المنصة */}
      <CompanionFloatingButton
        onClick={() => setIsCompanionOpen(true)}
        isOpen={isCompanionOpen}
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenModalByName={handleOpenModalByName}
      />

      <CompanionModal
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        onNavigate={handleNavigate}
        onOpenModal={handleOpenModalByName}
        onOpenAudio={handleOpenAudio}
      />

      {/* 🔔 Floating In-App Reminder Toast for Mood Kitchen & Calming Activities */}
      {notificationToast && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#14271F] border border-emerald-500/40 text-white p-4 rounded-3xl shadow-2xl animate-fade-in flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍳</span>
              <h4 className="font-bold text-xs sm:text-sm text-emerald-300">{notificationToast.title}</h4>
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-stone-400 hover:text-white p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {notificationToast.body}
          </p>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
            <button
              onClick={() => {
                setNotificationToast(null);
                setIsNotificationsOpen(true);
              }}
              className="text-stone-400 hover:text-stone-200 text-[11px] underline cursor-pointer"
            >
              عرض الإشعارات
            </button>
            <button
              onClick={() => {
                setNotificationToast(null);
                setIsMoodKitchenOpen(true);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              فتح مطبخ المزاج والأنشطة 🍳
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
