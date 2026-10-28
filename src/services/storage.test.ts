/**
 * Comprehensive test suite for checkReturnModeInactivity logic in storage.ts
 */

const localStorageStore = new Map<string, string>();
const sessionStorageStore = new Map<string, string>();

(globalThis as any).window = {};
(globalThis as any).localStorage = {
  getItem: (key: string) => localStorageStore.get(key) ?? null,
  setItem: (key: string, value: string) => localStorageStore.set(key, value),
  removeItem: (key: string) => localStorageStore.delete(key),
  clear: () => localStorageStore.clear(),
};
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStorageStore.get(key) ?? null,
  setItem: (key: string, value: string) => sessionStorageStore.set(key, value),
  removeItem: (key: string) => sessionStorageStore.delete(key),
  clear: () => sessionStorageStore.clear(),
};

import { storage } from './storage';

function runTests() {
  console.log('=== Running Return Mode Inactivity Boundary Tests ===\n');
  let passed = true;

  // Test 1: New User
  localStorageStore.clear();
  sessionStorageStore.clear();
  const resNewUser = storage.checkReturnModeInactivity(7);
  const test1Pass = resNewUser.isReturnEligible === false && resNewUser.daysAbsent === 0;
  console.log(`Test 1 [New User]: ${test1Pass ? 'PASSED' : 'FAILED'}`);
  console.log(`   Result: isReturnEligible=${resNewUser.isReturnEligible}, daysAbsent=${resNewUser.daysAbsent}`);
  if (!test1Pass) passed = false;

  // Test 2: Exactly 7 Days Absent (7.0 days)
  localStorageStore.clear();
  sessionStorageStore.clear();
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  localStorageStore.set('nesmat_last_visit_timestamp_v1', sevenDaysAgo.toString());
  
  const res7Days = storage.checkReturnModeInactivity(7);
  const test2Pass = res7Days.isReturnEligible === false && res7Days.daysAbsent === 7;
  console.log(`Test 2 [Exactly 7 Days Absent]: ${test2Pass ? 'PASSED' : 'FAILED'}`);
  console.log(`   Result: isReturnEligible=${res7Days.isReturnEligible}, daysAbsent=${res7Days.daysAbsent}`);
  if (!test2Pass) passed = false;

  // Test 3: 7 Days + 23 Hours Absent (7.95 days)
  localStorageStore.clear();
  sessionStorageStore.clear();
  const sevenDays23HoursAgo = now - ((7 * 24 + 23) * 60 * 60 * 1000);
  localStorageStore.set('nesmat_last_visit_timestamp_v1', sevenDays23HoursAgo.toString());

  const res7Days23h = storage.checkReturnModeInactivity(7);
  const test3Pass = res7Days23h.isReturnEligible === false && res7Days23h.daysAbsent === 7;
  console.log(`Test 3 [7 Days + 23 Hours Absent]: ${test3Pass ? 'PASSED' : 'FAILED'}`);
  console.log(`   Result: isReturnEligible=${res7Days23h.isReturnEligible}, daysAbsent=${res7Days23h.daysAbsent}`);
  if (!test3Pass) passed = false;

  // Test 4: Exactly 8 Days Absent (8.0 days full)
  localStorageStore.clear();
  sessionStorageStore.clear();
  const eightDaysAgo = now - (8 * 24 * 60 * 60 * 1000);
  localStorageStore.set('nesmat_last_visit_timestamp_v1', eightDaysAgo.toString());
  
  const res8Days = storage.checkReturnModeInactivity(7);
  const test4Pass = res8Days.isReturnEligible === true && res8Days.daysAbsent === 8;
  console.log(`Test 4 [8 Days Full Absent]: ${test4Pass ? 'PASSED' : 'FAILED'}`);
  console.log(`   Result: isReturnEligible=${res8Days.isReturnEligible}, daysAbsent=${res8Days.daysAbsent}`);
  if (!test4Pass) passed = false;

  console.log('\n=====================================================');
  if (passed) {
    console.log('ALL BOUNDARY TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('SOME TESTS FAILED!');
    process.exit(1);
  }
}

runTests();
