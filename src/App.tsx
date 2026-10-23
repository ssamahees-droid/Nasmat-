/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { storage } from './services/storage';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PWAFloatingInstallBadge } from './components/PWAFloatingInstallBadge';
import { OfflineBanner } from './components/OfflineBanner';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { CompanionFloatingButton } from './components/CompanionFloatingButton';
import { ScreenLoader } from './components/ScreenLoader';
import { localNotificationService } from './services/localNotificationService';
import { initAnonymousAuth } from './services/authService';
import { syncService } from './services/syncService';
import type { ActivityRatingItem } from './components/ActivityRatingModal';
import { TenScreensModal } from './components/TenScreensModal';
import { MobileAppShell } from './components/MobileAppShell';

// Keep HomeScreen statically imported so the first paint on mobile is instant
import { HomeScreen } from './screens/HomeScreen';

// Lazy-load other screens on demand
const WelcomeScreen = lazy(() => import('./screens/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const StartScreen = lazy(() => import('./screens/StartScreen').then(m => ({ default: m.StartScreen })));
const SelfDiscoveryScreen = lazy(() => import('./screens/SelfDiscoveryScreen').then(m => ({ default: m.SelfDiscoveryScreen })));
const GamesScreen = lazy(() => import('./screens/GamesScreen').then(m => ({ default: m.GamesScreen })));
const PracticeScreen = lazy(() => import('./screens/PracticeScreen').then(m => ({ default: m.PracticeScreen })));
const RescueScreen = lazy(() => import('./screens/RescueScreen').then(m => ({ default: m.RescueScreen })));
const ExploreScreen = lazy(() => import('./screens/ExploreScreen').then(m => ({ default: m.ExploreScreen })));
const ContentDetailScreen = lazy(() => import('./screens/ContentDetailScreen').then(m => ({ default: m.ContentDetailScreen })));
const AssessmentScreen = lazy(() => import('./screens/AssessmentScreen').then(m => ({ default: m.AssessmentScreen })));
const SupportScreen = lazy(() => import('./screens/SupportScreen').then(m => ({ default: m.SupportScreen })));
const BreatheScreen = lazy(() => import('./screens/BreatheScreen').then(m => ({ default: m.BreatheScreen })));
const JourneyScreen = lazy(() => import('./screens/JourneyScreen').then(m => ({ default: m.JourneyScreen })));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const AdminDashboardScreen = lazy(() => import('./screens/AdminDashboardScreen').then(m => ({ default: m.AdminDashboardScreen })));
const FekerAppScreen = lazy(() => import('./screens/FekerAppScreen').then(m => ({ default: m.FekerAppScreen })));
const ListenToYourselfScreen = lazy(() => import('./screens/ListenToYourselfScreen').then(m => ({ default: m.ListenToYourselfScreen })));
const WeeklySessionScreen = lazy(() => import('./screens/WeeklySessionScreen').then(m => ({ default: m.WeeklySessionScreen })));

// Lazy-load all interactive tools, games & workshop modals
const SafetyFlagModal = lazy(() => import('./components/SafetyFlagModal').then(m => ({ default: m.SafetyFlagModal })));
const AudioPlayerModal = lazy(() => import('./components/AudioPlayerModal').then(m => ({ default: m.AudioPlayerModal })));
const NotificationsModal = lazy(() => import('./components/NotificationsModal').then(m => ({ default: m.NotificationsModal })));
const ThoughtReleaseModal = lazy(() => import('./components/ThoughtReleaseModal').then(m => ({ default: m.ThoughtReleaseModal })));
const SoundscapeStudio = lazy(() => import('./components/SoundscapeStudio').then(m => ({ default: m.SoundscapeStudio })));
const EmotionCompassModal = lazy(() => import('./components/EmotionCompassModal').then(m => ({ default: m.EmotionCompassModal })));
const DailyWisdomModal = lazy(() => import('./components/DailyWisdomModal').then(m => ({ default: m.DailyWisdomModal })));
const AnaDelwaqtiModal = lazy(() => import('./components/AnaDelwaqtiModal').then(m => ({ default: m.AnaDelwaqtiModal })));
const RescueKitModal = lazy(() => import('./components/RescueKitModal').then(m => ({ default: m.RescueKitModal })));
const BatteryCheckModal = lazy(() => import('./components/BatteryCheckModal').then(m => ({ default: m.BatteryCheckModal })));
const TranslateFeelingsModal = lazy(() => import('./components/TranslateFeelingsModal').then(m => ({ default: m.TranslateFeelingsModal })));
const FactOrStoryGameModal = lazy(() => import('./components/FactOrStoryGameModal').then(m => ({ default: m.FactOrStoryGameModal })));
const UntangleKnotModal = lazy(() => import('./components/UntangleKnotModal').then(m => ({ default: m.UntangleKnotModal })));
const NesmaLaughsModal = lazy(() => import('./components/NesmaLaughsModal').then(m => ({ default: m.NesmaLaughsModal })));
const EmergencyHelpModal = lazy(() => import('./components/EmergencyHelpModal').then(m => ({ default: m.EmergencyHelpModal })));
const NesmatBookletModal = lazy(() => import('./components/NesmatBookletModal').then(m => ({ default: m.NesmatBookletModal })));
const PersonalPlanModal = lazy(() => import('./components/PersonalPlanModal').then(m => ({ default: m.PersonalPlanModal })));
const EnergyBudgetModal = lazy(() => import('./components/EnergyBudgetModal').then(m => ({ default: m.EnergyBudgetModal })));
const BoundaryBuilderModal = lazy(() => import('./components/BoundaryBuilderModal').then(m => ({ default: m.BoundaryBuilderModal })));
const SpecialistGuideModal = lazy(() => import('./components/SpecialistGuideModal').then(m => ({ default: m.SpecialistGuideModal })));
const WorkshopsHubModal = lazy(() => import('./components/WorkshopsHubModal').then(m => ({ default: m.WorkshopsHubModal })));
const PsychologicalERModal = lazy(() => import('./components/PsychologicalERModal').then(m => ({ default: m.PsychologicalERModal })));
const ConflictWithoutWarModal = lazy(() => import('./components/ConflictWithoutWarModal').then(m => ({ default: m.ConflictWithoutWarModal })));
const HealingJourneyModal = lazy(() => import('./components/HealingJourneyModal').then(m => ({ default: m.HealingJourneyModal })));
const ThoughtJournalModal = lazy(() => import('./components/ThoughtJournalModal').then(m => ({ default: m.ThoughtJournalModal })));
const MindfulnessStudioModal = lazy(() => import('./components/MindfulnessStudioModal').then(m => ({ default: m.MindfulnessStudioModal })));
const VoiceJournalModal = lazy(() => import('./components/VoiceJournalModal').then(m => ({ default: m.VoiceJournalModal })));
const FunAndGamesHubModal = lazy(() => import('./components/FunAndGamesHubModal').then(m => ({ default: m.FunAndGamesHubModal })));
const GwayaHekayaGameModal = lazy(() => import('./components/GwayaHekayaGameModal').then(m => ({ default: m.GwayaHekayaGameModal })));
const InnerBurdensBubbleGameModal = lazy(() => import('./components/InnerBurdensBubbleGameModal').then(m => ({ default: m.InnerBurdensBubbleGameModal })));
const EmotionalBridgeGameModal = lazy(() => import('./components/EmotionalBridgeGameModal').then(m => ({ default: m.EmotionalBridgeGameModal })));
const GratitudeGardenModal = lazy(() => import('./components/GratitudeGardenModal').then(m => ({ default: m.GratitudeGardenModal })));
const InnerCompassJourneyModal = lazy(() => import('./components/InnerCompassJourneyModal').then(m => ({ default: m.InnerCompassJourneyModal })));
const CognitiveReframingPuzzleModal = lazy(() => import('./components/CognitiveReframingPuzzleModal').then(m => ({ default: m.CognitiveReframingPuzzleModal })));
const InnerLabyrinthModal = lazy(() => import('./components/InnerLabyrinthModal').then(m => ({ default: m.InnerLabyrinthModal })));
const DigitalReleaseRitualModal = lazy(() => import('./components/DigitalReleaseRitualModal').then(m => ({ default: m.DigitalReleaseRitualModal })));
const RelationalEnergyMatrixModal = lazy(() => import('./components/RelationalEnergyMatrixModal').then(m => ({ default: m.RelationalEnergyMatrixModal })));
const PersonalDiscoveryQuizModal = lazy(() => import('./components/PersonalDiscoveryQuizModal').then(m => ({ default: m.PersonalDiscoveryQuizModal })));
const FekerAppModal = lazy(() => import('./components/FekerAppModal').then(m => ({ default: m.FekerAppModal })));
const MoodKitchenModal = lazy(() => import('./components/MoodKitchenModal').then(m => ({ default: m.MoodKitchenModal })));
const CompanionModal = lazy(() => import('./components/CompanionModal').then(m => ({ default: m.CompanionModal })));
const EndlessPsychologyKnowledgeHub = lazy(() => import('./components/EndlessPsychologyKnowledgeHub').then(m => ({ default: m.EndlessPsychologyKnowledgeHub })));
const PersonalityTypologyModal = lazy(() => import('./components/PersonalityTypologyModal').then(m => ({ default: m.PersonalityTypologyModal })));
const DailyMiracleDrawerModal = lazy(() => import('./components/DailyMiracleDrawerModal').then(m => ({ default: m.DailyMiracleDrawerModal })));
const EmotionalOrigamiGardenModal = lazy(() => import('./components/EmotionalOrigamiGardenModal').then(m => ({ default: m.EmotionalOrigamiGardenModal })));
const OmarKhairatMusicLoungeModal = lazy(() => import('./components/OmarKhairatMusicLoungeModal').then(m => ({ default: m.OmarKhairatMusicLoungeModal })));
const MusicPrototypeTester = lazy(() => import('./components/MusicPrototypeTester').then(m => ({ default: m.MusicPrototypeTester })));
const SampledMusicTester = lazy(() => import('./components/SampledMusicTester').then(m => ({ default: m.SampledMusicTester })));
const AudioEngineComparisonModal = lazy(() => import('./components/AudioEngineComparisonModal').then(m => ({ default: m.AudioEngineComparisonModal })));
const ActivityRatingModal = lazy(() => import('./components/ActivityRatingModal').then(m => ({ default: m.ActivityRatingModal })));
const NesmatCipherModal = lazy(() => import('./components/NesmatCipherModal').then(m => ({ default: m.NesmatCipherModal })));

const VALID_TABS: Record<string, string> = {
  '': 'welcome',
  'welcome': 'welcome',
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
  if (typeof window === 'undefined') return { tab: 'welcome', isExplicitDeepLink: false };
  const path = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0].toLowerCase();
  const segment = path || hash;
  if (segment && VALID_TABS[segment]) {
    return { tab: VALID_TABS[segment], isExplicitDeepLink: segment !== '' && segment !== 'welcome' };
  }
  return { tab: 'welcome', isExplicitDeepLink: false };
}

export default function App() {
  const initialRoute = getRouteFromLocation();
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => storage.hasCompletedOnboarding());
  const [currentStep, setCurrentStep] = useState<'welcome' | 'onboarding' | 'main'>(() => {
    // If user opened an explicit non-welcome deep link (e.g. /rescue, /games, /breathe, /home)
    if (initialRoute.isExplicitDeepLink) {
      return 'main';
    }
    // Default to the creative welcome screen so the user experiences the rotary wheel immediately
    return 'welcome';
  });
  const [currentTab, setCurrentTab] = useState<string>(initialRoute.tab);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => storage.getUser().role);
  const [selectedContentId, setSelectedContentId] = useState<string>('c1');

  const handleNavigate = (tab: string, pushHistory: boolean = true) => {
    const resolvedTab = tab === 'listen' ? 'listen-to-yourself' : tab === 'weekly' ? 'weekly-session' : tab;
    setCurrentTab(resolvedTab);
    if (resolvedTab === 'welcome') {
      setCurrentStep('welcome');
    } else {
      setCurrentStep('main');
    }
    if (pushHistory && typeof window !== 'undefined') {
      const targetUrl = resolvedTab === 'welcome' ? '/' : `/${resolvedTab}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ tab: resolvedTab }, '', targetUrl);
      }
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      const { tab } = getRouteFromLocation();
      setCurrentTab(tab);
      if (tab === 'welcome') {
        setCurrentStep('welcome');
      } else {
        setCurrentStep('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme state: light, dark, system (aligned with system preference on first boot to eliminate flicker)
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    const saved = localStorage.getItem('nesmat_theme');
    if (saved && ['dark', 'light', 'system'].includes(saved)) {
      return saved as 'dark' | 'light' | 'system';
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Mobile Performance Mode: automatic device detection with user persistence
  const [isMobilePerformanceMode, setIsMobilePerformanceMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('nesmat_mobile_perf_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Auto-detect mobile devices
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    return Boolean(isMobileUserAgent || (isSmallScreen && isTouchDevice));
  });

  const handleToggleMobilePerformanceMode = () => {
    setIsMobilePerformanceMode(prev => {
      const next = !prev;
      localStorage.setItem('nesmat_mobile_perf_mode', String(next));
      return next;
    });
  };

  // Automatically apply 'mobile-low-perf' class to the root element when Mobile Performance Mode is active
  useEffect(() => {
    if (isMobilePerformanceMode) {
      document.documentElement.classList.add('mobile-low-perf');
    } else {
      document.documentElement.classList.remove('mobile-low-perf');
    }
  }, [isMobilePerformanceMode]);

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

  // ⌨️ Global Keyboard Shortcuts (h: home, e: emergency, n: notifications)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing inside input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target && 
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'h') {
        e.preventDefault();
        handleNavigate('home');
      } else if (key === 'e') {
        e.preventDefault();
        setIsEmergencyHelpOpen(true);
      } else if (key === 'n') {
        e.preventDefault();
        setIsNotificationsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
  const [isTenScreensModalOpen, setIsTenScreensModalOpen] = useState(false);

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
  const [isNesmatCipherOpen, setIsNesmatCipherOpen] = useState(false);
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

  // 1. Initial Welcome Screen (Presented on its own)
  if (currentStep === 'welcome') {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <WelcomeScreen
          onStart={() => setCurrentStep('onboarding')}
          onSkip={() => {
            setHasOnboarded(true);
            storage.setOnboarded(true);
            setCurrentStep('main');
            handleNavigate('home');
          }}
          onNavigate={(targetTab) => {
            setHasOnboarded(true);
            storage.setOnboarded(true);
            setCurrentStep('main');
            handleNavigate(targetTab);
          }}
        />
      </Suspense>
    );
  }

  // 2. Onboarding Screen
  if (currentStep === 'onboarding') {
    return (
      <Suspense fallback={<ScreenLoader />}>
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
      </Suspense>
    );
  }

  // 3. Main Application Flow
  return (
    <div className={`min-h-screen flex flex-col font-cairo transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0D1914] text-[#F7F5EF] selection:bg-[#23785B] selection:text-[#FFFFFF]' 
        : 'bg-[#F7F5EF] text-[#292F2B] selection:bg-[#E2EFE7] selection:text-[#174F3F]'
    }`}>
      <OfflineBanner />
      <PWAUpdatePrompt />
      
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
      <main className="flex-1 pb-16 lg:pb-6">
        <MobileAppShell currentTab={currentTab} isMobilePerformanceMode={isMobilePerformanceMode}>
          <Suspense fallback={<ScreenLoader />}>
          {currentTab === 'welcome' && (
            <WelcomeScreen
              onStart={() => handleNavigate('home')}
              onSkip={() => handleNavigate('home')}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'home' && (
            <HomeScreen
              theme={theme}
              isMobilePerformanceMode={isMobilePerformanceMode}
              onToggleMobilePerformanceMode={handleToggleMobilePerformanceMode}
              onNavigate={handleNavigate}
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
              onOpenContent={handleOpenContent}
              onOpenAudioModal={({ title, category, durationMinutes }) => handleOpenAudio(title, category, durationMinutes || 5)}
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
              onOpenFunAndGames={(tab = 'jokes') => setFunAndGamesState({ isOpen: true, tab: (tab as any) || 'jokes' })}
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
              onOpenEndlessPsychology={(cat) => setEndlessPsychologyState({ isOpen: true, category: cat || 'all' })}
            />
          )}

          {currentTab === 'start' && (
            <StartScreen
              onNavigate={handleNavigate}
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
              onOpenBooklet={() => setIsBookletOpen(true)}
              onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
            />
          )}

          {currentTab === 'self-discovery' && (
            <SelfDiscoveryScreen
              onNavigate={handleNavigate}
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
              onOpenNesmatCipher={() => setIsNesmatCipherOpen(true)}
            />
          )}

          {currentTab === 'practice' && (
            <PracticeScreen
              onNavigate={handleNavigate}
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
            <BreatheScreen 
              onNavigate={handleNavigate}
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
              onOpenMusicLounge={() => setIsMusicLoungeOpen(true)} 
            />
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
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
              onNavigate={handleNavigate}
              onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
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
              isMobilePerformanceMode={isMobilePerformanceMode}
              onToggleMobilePerformanceMode={handleToggleMobilePerformanceMode}
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
          </Suspense>
        </MobileAppShell>
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
        onOpenAllScreens={() => setIsTenScreensModalOpen(true)}
        onOpenGwayaHekaya={() => setIsGwayaHekayaOpen(true)}
        onOpenFeker={() => setIsFekerModalOpen(true)}
      />

      {/* On-Demand & Conditionally Rendered Interactive Modals */}
      <Suspense fallback={null}>
        {/* ✍️ Mindful Thoughts Journal */}
        {isThoughtJournalOpen && (
          <ThoughtJournalModal
            isOpen={isThoughtJournalOpen}
            onClose={() => setIsThoughtJournalOpen(false)}
          />
        )}

        {/* 🧘 Mindfulness Studio */}
        {isMindfulnessStudioOpen && (
          <MindfulnessStudioModal
            isOpen={isMindfulnessStudioOpen}
            onClose={() => setIsMindfulnessStudioOpen(false)}
          />
        )}

        {/* 🎈 Fun, Jokes & Mind Games Hub */}
        {funAndGamesState.isOpen && (
          <FunAndGamesHubModal
            isOpen={funAndGamesState.isOpen}
            initialTab={funAndGamesState.tab}
            onClose={() => setFunAndGamesState(prev => ({ ...prev, isOpen: false }))}
          />
        )}

        {/* 📖 Gwaya Hekaya Interactive Game */}
        {isGwayaHekayaOpen && (
          <GwayaHekayaGameModal
            isOpen={isGwayaHekayaOpen}
            onClose={() => setIsGwayaHekayaOpen(false)}
          />
        )}

        {/* 🫧 1. لعبة فرقعة الفقاعات النفسية (Pop the Inner Burdens) */}
        {isInnerBurdensOpen && (
          <InnerBurdensBubbleGameModal
            isOpen={isInnerBurdensOpen}
            onClose={() => {
              setIsInnerBurdensOpen(false);
              triggerActivityRating('inner_burdens', 'لعبة فرقعة الأعباء النفسية', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🌉 2. لعبة بناء الجسر العاطفي (Build the Bridge) */}
        {isEmotionalBridgeOpen && (
          <EmotionalBridgeGameModal
            isOpen={isEmotionalBridgeOpen}
            onClose={() => {
              setIsEmotionalBridgeOpen(false);
              triggerActivityRating('emotional_bridge', 'لعبة بناء الجسر العاطفي', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🌸 3. لعبة حديقة الامتنان اليومية (The Daily Gratitude Garden) */}
        {isGratitudeGardenOpen && (
          <GratitudeGardenModal
            isOpen={isGratitudeGardenOpen}
            onClose={() => {
              setIsGratitudeGardenOpen(false);
              triggerActivityRating('gratitude_garden', 'حديقة الامتنان اليومية', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🧭 4. لعبة رحلة البوصلة الداخلية (Inner Compass Journey) */}
        {isInnerCompassOpen && (
          <InnerCompassJourneyModal
            isOpen={isInnerCompassOpen}
            onClose={() => {
              setIsInnerCompassOpen(false);
              triggerActivityRating('inner_compass', 'رحلة البوصلة الداخلية', 'رحلة الاستكشاف');
            }}
          />
        )}

        {/* 🧩 5. لعبة صانع الأنماط: فك شفرة الأفكار (Cognitive Reframing Puzzle) */}
        {isReframingPuzzleOpen && (
          <CognitiveReframingPuzzleModal
            isOpen={isReframingPuzzleOpen}
            onClose={() => {
              setIsReframingPuzzleOpen(false);
              triggerActivityRating('reframing_puzzle', 'لعبة فك شفرة الأفكار', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🌀 6. لعبة متاهة الهدوء التفاعلية (The Inner Labyrinth) */}
        {isInnerLabyrinthOpen && (
          <InnerLabyrinthModal
            isOpen={isInnerLabyrinthOpen}
            onClose={() => {
              setIsInnerLabyrinthOpen(false);
              triggerActivityRating('inner_labyrinth', 'متاهة الهدوء التفاعلية', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🪞 7. لعبة مرآة الأعماق: طقوس التحرر الرقمي (Digital Release Ritual) */}
        {isDigitalReleaseOpen && (
          <DigitalReleaseRitualModal
            isOpen={isDigitalReleaseOpen}
            onClose={() => {
              setIsDigitalReleaseOpen(false);
              triggerActivityRating('digital_release', 'مرآة الأعماق وطقوس التحرر', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🪐 8. لعبة حصاد طاقة الروابط (The Relational Energy Matrix) */}
        {isRelationalEnergyOpen && (
          <RelationalEnergyMatrixModal
            isOpen={isRelationalEnergyOpen}
            onClose={() => {
              setIsRelationalEnergyOpen(false);
              triggerActivityRating('relational_matrix', 'مصفوفة طاقة الروابط', 'ألعاب التهدئة');
            }}
          />
        )}

        {/* 🧭 Personal Discovery Quiz */}
        {isDiscoveryQuizOpen && (
          <PersonalDiscoveryQuizModal
            isOpen={isDiscoveryQuizOpen}
            onClose={() => {
              setIsDiscoveryQuizOpen(false);
              triggerActivityRating('discovery_quiz', 'اختبار الاستكشاف الشخصي', 'رحلة الاستكشاف');
            }}
          />
        )}

        {/* 💡 تطبيق فكّر المدمج (Feker App) */}
        {isFekerModalOpen && (
          <FekerAppModal
            isOpen={isFekerModalOpen}
            onClose={() => {
              setIsFekerModalOpen(false);
              triggerActivityRating('feker_app', 'تطبيق فكّر لتفكيك الأفكار', 'ورش العمل');
            }}
          />
        )}

        {/* 🍲 مطبخ المزاج */}
        {isMoodKitchenOpen && (
          <MoodKitchenModal
            isOpen={isMoodKitchenOpen}
            onClose={() => setIsMoodKitchenOpen(false)}
          />
        )}

        {/* ⭐ تقييم الأنشطة والألعاب */}
        {activityRatingState.isOpen && (
          <ActivityRatingModal
            isOpen={activityRatingState.isOpen}
            activity={activityRatingState.activity}
            onClose={() => setActivityRatingState({ isOpen: false, activity: null })}
            theme={theme}
          />
        )}

        {/* 🧠 موسوعة المعلومات النفسية اللانهائية */}
        {endlessPsychologyState.isOpen && (
          <EndlessPsychologyKnowledgeHub
            isOpen={endlessPsychologyState.isOpen}
            initialCategory={endlessPsychologyState.category}
            onClose={() => setEndlessPsychologyState(prev => ({ ...prev, isOpen: false }))}
            theme={theme}
          />
        )}

        {/* 🧭 اختبارات تصنيف الشخصية والأنماط النفسية المتقدمة */}
        {personalityTypologyState.isOpen && (
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
        )}

        {/* ✨ درج المعجزات الصغيرة اليومية */}
        {isDailyMiracleOpen && (
          <DailyMiracleDrawerModal
            isOpen={isDailyMiracleOpen}
            onClose={() => setIsDailyMiracleOpen(false)}
            onOpenActivity={(activityId) => handleOpenModalByName(activityId)}
            theme={theme}
          />
        )}

        {/* 🕊️ حديقة الأوريغامي الشعوري */}
        {isOrigamiGardenOpen && (
          <EmotionalOrigamiGardenModal
            isOpen={isOrigamiGardenOpen}
            onClose={() => setIsOrigamiGardenOpen(false)}
            onOpenActivity={(activityId) => handleOpenModalByName(activityId)}
            theme={theme}
          />
        )}

        {/* 🎹 صالون النغم والسكينة */}
        {isMusicLoungeOpen && (
          <OmarKhairatMusicLoungeModal
            isOpen={isMusicLoungeOpen}
            onClose={() => {
              setIsMusicLoungeOpen(false);
              triggerActivityRating('omar_khairat_music', 'صالون النغم والسكينة (عمر خيرت)', 'جلسات الاسترخاء');
            }}
            onNavigate={handleNavigate}
            onOpenComparison={() => setIsAudioComparisonOpen(true)}
          />
        )}

        {/* 🧪 نافذة اختبار النموذج الأولي الموسيقي */}
        {isMusicPrototypeTesterOpen && (
          <MusicPrototypeTester
            isOpen={isMusicPrototypeTesterOpen}
            onClose={() => setIsMusicPrototypeTesterOpen(false)}
          />
        )}

        {/* 🎹 نافذة اختبار عينات البيانو الحقيقية */}
        {isSampledMusicTesterOpen && (
          <SampledMusicTester
            isOpen={isSampledMusicTesterOpen}
            onClose={() => setIsSampledMusicTesterOpen(false)}
          />
        )}

        {/* 🎧 صفحة المقارنة الصوتية التفاعلية */}
        {isAudioComparisonOpen && (
          <AudioEngineComparisonModal
            isOpen={isAudioComparisonOpen}
            onClose={() => setIsAudioComparisonOpen(false)}
          />
        )}

        {/* 🛠️ PDF Practical Workshops Modals */}
        {isWorkshopsHubOpen && (
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
        )}

        {isPsychologicalEROpen && (
          <PsychologicalERModal
            isOpen={isPsychologicalEROpen}
            onClose={() => setIsPsychologicalEROpen(false)}
            onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
          />
        )}

        {isConflictWithoutWarOpen && (
          <ConflictWithoutWarModal
            isOpen={isConflictWithoutWarOpen}
            onClose={() => setIsConflictWithoutWarOpen(false)}
          />
        )}

        {isHealingJourneyOpen && (
          <HealingJourneyModal
            isOpen={isHealingJourneyOpen}
            onClose={() => setIsHealingJourneyOpen(false)}
          />
        )}

        {/* 📖 PDF Booklet & Personal Plan Modals */}
        {isBookletOpen && (
          <NesmatBookletModal
            isOpen={isBookletOpen}
            onClose={() => setIsBookletOpen(false)}
            onOpenPersonalPlan={() => setIsPersonalPlanOpen(true)}
            onOpenEnergyBudget={() => setIsEnergyBudgetOpen(true)}
            onOpenBoundaryBuilder={() => setIsBoundaryBuilderOpen(true)}
            onOpenSpecialistGuide={() => setIsSpecialistGuideOpen(true)}
            onOpenUntangleKnot={() => setIsUntangleKnotOpen(true)}
          />
        )}

        {isPersonalPlanOpen && (
          <PersonalPlanModal
            isOpen={isPersonalPlanOpen}
            onClose={() => setIsPersonalPlanOpen(false)}
          />
        )}

        {isEnergyBudgetOpen && (
          <EnergyBudgetModal
            isOpen={isEnergyBudgetOpen}
            onClose={() => setIsEnergyBudgetOpen(false)}
          />
        )}

        {isBoundaryBuilderOpen && (
          <BoundaryBuilderModal
            isOpen={isBoundaryBuilderOpen}
            onClose={() => setIsBoundaryBuilderOpen(false)}
          />
        )}

        {isSpecialistGuideOpen && (
          <SpecialistGuideModal
            isOpen={isSpecialistGuideOpen}
            onClose={() => setIsSpecialistGuideOpen(false)}
            onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
            onNavigateToSupport={() => {
              handleNavigate('support');
            }}
          />
        )}

        {/* 🌿 Interactive Phase Modals */}
        {isAnaDelwaqtiOpen && (
          <AnaDelwaqtiModal
            isOpen={isAnaDelwaqtiOpen}
            onClose={() => setIsAnaDelwaqtiOpen(false)}
            onNavigateTab={(tab) => {
              handleNavigate(tab);
            }}
            onOpenEmergencyHelp={() => setIsEmergencyHelpOpen(true)}
            onOpenUntangle={() => setIsUntangleKnotOpen(true)}
            onOpenTranslate={() => setIsTranslateFeelingsOpen(true)}
            onOpenBattery={() => setIsBatteryCheckOpen(true)}
            onOpenLaughs={() => setIsNesmaLaughsOpen(true)}
          />
        )}

        {isRescueKitOpen && (
          <RescueKitModal
            isOpen={isRescueKitOpen}
            onClose={() => setIsRescueKitOpen(false)}
            initialPlanId={selectedRescuePlanId}
            onNavigateTab={(tab) => {
              handleNavigate(tab);
            }}
            onOpenContent={handleOpenContent}
          />
        )}

        {isBatteryCheckOpen && (
          <BatteryCheckModal
            isOpen={isBatteryCheckOpen}
            onClose={() => setIsBatteryCheckOpen(false)}
          />
        )}

        {isTranslateFeelingsOpen && (
          <TranslateFeelingsModal
            isOpen={isTranslateFeelingsOpen}
            onClose={() => setIsTranslateFeelingsOpen(false)}
          />
        )}

        {isFactGameOpen && (
          <FactOrStoryGameModal
            isOpen={isFactGameOpen}
            onClose={() => setIsFactGameOpen(false)}
          />
        )}

        {isUntangleKnotOpen && (
          <UntangleKnotModal
            isOpen={isUntangleKnotOpen}
            onClose={() => setIsUntangleKnotOpen(false)}
          />
        )}

        {isNesmaLaughsOpen && (
          <NesmaLaughsModal
            isOpen={isNesmaLaughsOpen}
            onClose={() => setIsNesmaLaughsOpen(false)}
          />
        )}

        {isEmergencyHelpOpen && (
          <EmergencyHelpModal
            isOpen={isEmergencyHelpOpen}
            onClose={() => setIsEmergencyHelpOpen(false)}
          />
        )}

        {/* Universal Audio & Notification Modals */}
        {isSafetyModalOpen && (
          <SafetyFlagModal
            isOpen={isSafetyModalOpen}
            onClose={() => setIsSafetyModalOpen(false)}
          />
        )}

        {audioModalState.isOpen && (
          <AudioPlayerModal
            isOpen={audioModalState.isOpen}
            onClose={() => setAudioModalState(prev => ({ ...prev, isOpen: false }))}
            title={audioModalState.title}
            category={audioModalState.category}
            durationMinutes={audioModalState.durationMinutes}
            onFinishCheckin={handleFinishAudioCheckin}
          />
        )}

        {isNotificationsOpen && (
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNavigateToContent={() => handleNavigate('explore')}
            onNavigateToBreathe={() => handleNavigate('breathe')}
            onOpenMoodKitchen={() => setIsMoodKitchenOpen(true)}
          />
        )}

        {isThoughtReleaseOpen && (
          <ThoughtReleaseModal
            isOpen={isThoughtReleaseOpen}
            onClose={() => setIsThoughtReleaseOpen(false)}
          />
        )}

        {isSoundscapeOpen && (
          <SoundscapeStudio
            isOpen={isSoundscapeOpen}
            onClose={() => setIsSoundscapeOpen(false)}
          />
        )}

        {isEmotionCompassOpen && (
          <EmotionCompassModal
            isOpen={isEmotionCompassOpen}
            onClose={() => setIsEmotionCompassOpen(false)}
          />
        )}

        {isDailyWisdomOpen && (
          <DailyWisdomModal
            isOpen={isDailyWisdomOpen}
            onClose={() => setIsDailyWisdomOpen(false)}
          />
        )}

        {isVoiceJournalOpen && (
          <VoiceJournalModal
            isOpen={isVoiceJournalOpen}
            onClose={() => setIsVoiceJournalOpen(false)}
          />
        )}

        {isCompanionOpen && (
          <CompanionModal
            isOpen={isCompanionOpen}
            onClose={() => setIsCompanionOpen(false)}
            onNavigate={handleNavigate}
            onOpenModal={handleOpenModalByName}
            onOpenAudio={handleOpenAudio}
          />
        )}

        {/* 🧩 Nesmat Cipher Game Modal */}
        {isNesmatCipherOpen && (
          <NesmatCipherModal
            isOpen={isNesmatCipherOpen}
            onClose={() => setIsNesmatCipherOpen(false)}
          />
        )}

        {/* 📑 Ten Screens Global Navigation Modal */}
        {isTenScreensModalOpen && (
          <TenScreensModal
            isOpen={isTenScreensModalOpen}
            onClose={() => setIsTenScreensModalOpen(false)}
            currentTab={currentTab}
            onNavigate={handleNavigate}
            theme={theme}
          />
        )}
      </Suspense>

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
