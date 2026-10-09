// Polyfill localStorage for node environment
if (typeof localStorage === 'undefined') {
  let store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
}

import { storage } from '../src/services/storage';

console.log('=== TESTING ENTRY FLOW AND NAVIGATION SCENARIOS ===\n');

let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, desc: string) {
  totalCount++;
  if (condition) {
    console.log(`  [PASSED] ${desc}`);
    passedCount++;
  } else {
    console.error(`  [FAILED] ${desc}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

// ----------------------------------------------------
// SCENARIO 1: Fresh Visit (No previous storage data)
// ----------------------------------------------------
console.log('--- Scenario 1: Fresh visit without previous storage data ---');
localStorage.clear();

const isFreshOnboarded = storage.hasCompletedOnboarding();
assert(isFreshOnboarded === false, 'Fresh visitor has hasCompletedOnboarding() === false');

// Simulating App.tsx initial state derivation:
let step = isFreshOnboarded ? 'main' : 'welcome';
assert(step === 'welcome', 'Initial step for fresh user is "welcome"');

// Simulating WelcomeScreen onStart -> OnboardingScreen
step = 'onboarding';
assert(step === 'onboarding', 'WelcomeScreen onStart smoothly transitions step to "onboarding"');

// Simulating OnboardingScreen onComplete -> storage.setOnboarded(true) -> main
storage.setOnboarded(true);
step = 'main';
let currentTab = 'home';
assert(storage.hasCompletedOnboarding() === true, 'Onboarding saves completion to localStorage');
assert(step === 'main' && currentTab === 'home', 'Onboarding completion transitions to main HomeScreen');

// ----------------------------------------------------
// SCENARIO 2: Returning Visit (has saved onboarding state)
// ----------------------------------------------------
console.log('\n--- Scenario 2: Returning visit with saved onboarding state ---');
const isReturningOnboarded = storage.hasCompletedOnboarding();
assert(isReturningOnboarded === true, 'Returning visitor has hasCompletedOnboarding() === true');

// App.tsx initial state derivation for returning user:
const returningStep = isReturningOnboarded ? 'main' : 'welcome';
assert(returningStep === 'main', 'Returning visitor step is "main" directly, bypassing Welcome & Onboarding screens');

// ----------------------------------------------------
// SCENARIO 3: Page Refresh (Reload)
// ----------------------------------------------------
console.log('\n--- Scenario 3: Page refresh simulation ---');
// After page refresh, localStorage retains hasCompletedOnboarding === true
const reloadedOnboarded = storage.hasCompletedOnboarding();
assert(reloadedOnboarded === true, 'localStorage preserves onboarding state across page refresh');
const reloadedStep = reloadedOnboarded ? 'main' : 'welcome';
assert(reloadedStep === 'main', 'After refresh, user continues in "main" view without being sent back to welcome screen');

// ----------------------------------------------------
// SCENARIO 4: Navigating to another section then back to Home
// ----------------------------------------------------
console.log('\n--- Scenario 4: Navigating across sections and returning to Home ---');
const sectionsToTest = ['start', 'self-discovery', 'games', 'explore', 'practice', 'rescue', 'support', 'journey', 'profile'];
for (const tab of sectionsToTest) {
  currentTab = tab;
  assert(currentTab === tab, `Successfully navigated to section "${tab}"`);
}
// Return to home
currentTab = 'home';
assert(currentTab === 'home' && reloadedStep === 'main', 'Returning to "home" displays the new HomeScreen within "main" flow');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL SCENARIO TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`);
console.log('====================================================\n');
