/**
 * Comprehensive App Audit & Functional Test Suite for Nesmat Al-Hayat
 */

// Polyfill localStorage & window for Node CLI testing
const memoryStore: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => memoryStore[key] || null,
  setItem: (key: string, val: string) => { memoryStore[key] = String(val); },
  removeItem: (key: string) => { delete memoryStore[key]; },
  clear: () => { for (const k in memoryStore) delete memoryStore[k]; }
};
(global as any).window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
  localStorage: (global as any).localStorage
};

import { storage } from '../src/services/storage';
import { localNotificationService } from '../src/services/localNotificationService';
import { chimeService } from '../src/services/chimeService';
import { CompanionEngine, COMPANION_PERSONAS } from '../src/services/companionEngine';
import { voiceService } from '../src/services/voiceService';

interface TestResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, category: string, name: string, details: string) {
  if (condition) {
    results.push({ category, name, status: 'PASS', details });
  } else {
    results.push({ category, name, status: 'FAIL', details });
  }
}

async function runAudit() {
  console.log('=== [1] AUDITING STORAGE & LOCAL DATA ENGINE ===');
  try {
    // 1. Daily Checkins
    storage.addDailyCheckin('good');
    const checkins = storage.getDailyCheckins();
    assert(checkins.length > 0 && checkins[0].moodValue === 'good', 'Storage', 'Daily Checkin', 'Successfully recorded mood checkin');

    // 2. Personality Results
    const mockMbti = {
      testType: 'mbti16',
      code: 'INFJ',
      titleAr: 'المحامي الحكيم',
      titleEn: 'The Advocate',
      taglineAr: 'هادئ ومثالي',
      taglineEn: 'Quiet, visionary',
      strengthsAr: ['حدس نافذ', 'التزام أخلاقي'],
      growthTipAr: 'ضع حدوداً لطاقتك العاطفية',
      scores: { E: 30, I: 70, S: 25, N: 75, T: 40, F: 60, J: 80, P: 20 }
    };
    const savedMbti = storage.savePersonalityTestResult(mockMbti);
    assert(!!savedMbti && savedMbti.code === 'INFJ', 'Storage', 'Save Personality Result', 'Saved result ID: ' + savedMbti.id);

    const history = storage.getPersonalityTestResults();
    assert(history.length > 0, 'Storage', 'Get Personality Results', 'Found ' + history.length + ' personality results');

    const latestMbti = storage.getLatestPersonalityTestResult('mbti16');
    assert(latestMbti?.code === 'INFJ', 'Storage', 'Get Latest Personality Result', 'Retrieved latest MBTI result');

    // 3. Mood Kitchen Logs
    const mockMeal = {
      id: 'meal_1',
      timestamp: new Date().toISOString(),
      mealType: 'lunch',
      comfortLevel: 'comfortable',
      mood: 'content',
      gutState: 'calm',
      notes: 'شوربة عدس دافئة وخضار',
      moodBefore: 'fair',
      timeFormattedAr: 'اليوم، 02:00 م',
      timeFormattedEn: 'Today, 02:00 PM',
      advice: {
        titleAr: 'تغذية العصب الحائر والراحة الهضمية',
        titleEn: 'Vagus Nerve Nutrition & Digestive Ease',
        gutBrainConnectionAr: 'الألياف الذائبة والشوربة الدافئة تحفز إفراز السيروتونين بنسبة ٩٠٪ في جدران الأمعاء.',
        gutBrainConnectionEn: 'Soluble fiber and warm broth stimulate intestinal serotonin production.',
        practicalTipAr: 'امشِ ٥ دقائق بهدوء وتنفس ببطء بعد الوجبة',
        practicalTipEn: 'Take a gentle 5-minute walk and breathe slowly'
      },
      recommendedActivities: [
        { id: 'breathe', titleAr: 'تمرين التنفس البطني', category: 'هدوء' }
      ]
    };
    const savedMeal = storage.saveMoodKitchenLog(mockMeal);
    assert(!!savedMeal && savedMeal.id === 'meal_1', 'Storage', 'Save Mood Kitchen Log', 'Saved meal log: ' + savedMeal.id);

    const mealLogs = storage.getMoodKitchenLogs();
    assert(mealLogs.length > 0, 'Storage', 'Get Mood Kitchen Logs', 'Retrieved ' + mealLogs.length + ' meal logs');

    const latestMeal = storage.getLatestMoodKitchenLog();
    assert(latestMeal?.mealType === 'lunch', 'Storage', 'Get Latest Mood Kitchen Log', 'Latest meal is: ' + latestMeal?.mealType);

    // 4. Privacy compliance: Export All User Data
    const exportedData = storage.exportAllUserData();
    assert(exportedData.includes('exportDate'), 'Storage', 'Egyptian Law 151 Data Export', 'Data export contains valid JSON format');
  } catch (err: any) {
    results.push({ category: 'Storage', name: 'Exception in Storage Audit', status: 'FAIL', details: err.message });
  }

  console.log('=== [2] AUDITING NOTIFICATION SERVICE & 24H INACTIVITY MONITOR ===');
  try {
    const hours = localNotificationService.getHoursSinceLastMoodKitchenLog();
    assert(typeof hours.hoursElapsed === 'number', 'Notifications', 'Hours Calculation', `Hours elapsed: ${hours.hoursElapsed}h`);

    const check = localNotificationService.checkMoodKitchenInactivity(true);
    assert(check.triggered === true, 'Notifications', '24h Inactivity Notification Trigger', 'Forced trigger succeeded with notification: ' + check.notification?.title);

    const testReminder = localNotificationService.triggerTestReminder();
    assert(!!testReminder && testReminder.title.includes('مطبخ المزاج'), 'Notifications', 'Test Reminder Dispatch', 'Dispatched: ' + testReminder.title);
  } catch (err: any) {
    results.push({ category: 'Notifications', name: 'Notification Service Audit', status: 'FAIL', details: err.message });
  }

  console.log('=== [3] AUDITING COMPANION ENGINE & PERSONAS ===');
  try {
    const personaKeys = Object.keys(COMPANION_PERSONAS);
    assert(personaKeys.length >= 4, 'Companion', 'Personas Availability', `Available personas: ${personaKeys.join(', ')}`);

    const childPersona = COMPANION_PERSONAS.child;
    assert(!!childPersona && childPersona.id === 'child', 'Companion', 'Child Persona Definition', 'Child persona defined');

    const adultPersona = COMPANION_PERSONAS.adult;
    assert(!!adultPersona && adultPersona.id === 'adult', 'Companion', 'Adult Persona Definition', 'Adult persona defined');

    const fatherPersona = COMPANION_PERSONAS.father;
    assert(!!fatherPersona && fatherPersona.id === 'father', 'Companion', 'Father Persona Definition', 'Father persona defined');

    // Test generateResponse
    const response = await CompanionEngine.generateResponse('أنا حاسس بقلق وتوتر ومش عارف أوقفه', 'adult', []);
    assert(!!response && response.text.length > 0, 'Companion', 'Response Generation', 'Generated: ' + response.text.slice(0, 50) + '...');
    assert(response.sender === 'companion', 'Companion', 'Sender Attribute', 'Sender is companion');
  } catch (err: any) {
    results.push({ category: 'Companion', name: 'Companion Engine Audit', status: 'FAIL', details: err.message });
  }

  console.log('=== [4] AUDITING AUDIO & SOUND DESIGN ===');
  try {
    assert(typeof chimeService.playReassuranceChime === 'function', 'Audio', 'Reassurance Chime', 'Function exists');
    assert(typeof chimeService.playWheelTickSound === 'function', 'Audio', 'Wheel Tick Deceleration', 'Function exists');
    assert(typeof chimeService.playWheelWinSound === 'function', 'Audio', 'Wheel Win Chime', 'Function exists');
    assert(typeof chimeService.playStoneDropChime === 'function', 'Audio', 'Stone Drop Zen Chime', 'Function exists');
    assert(typeof voiceService.speak === 'function', 'Voice', 'TTS Voice Synthesizer', 'Voice synthesis function exists');
  } catch (err: any) {
    results.push({ category: 'Audio', name: 'Audio Audit Exception', status: 'FAIL', details: err.message });
  }

  // Print Summary Table
  console.log('\n======================================================');
  console.log('       NESMAT AL-HAYAT COMPREHENSIVE AUDIT REPORT');
  console.log('======================================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL AUDIT CHECKS: ${results.length}`);
  console.log(`SUCCESSFUL (PASS):   ${passes}`);
  console.log(`FAILED (FAIL):       ${fails}`);
  console.log('------------------------------------------------------');
  results.forEach(r => {
    console.log(`[${r.status}] [${r.category}] ${r.name} -> ${r.details}`);
  });
  console.log('======================================================\n');
}

runAudit();
