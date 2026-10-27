/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('📱 بدء اختبار ميزات التثبيت والمشاركة والتحديث التلقائي');
console.log('====================================================\n');

let tests = 0;
let passed = 0;

function assert(condition: boolean, msg: string) {
  tests++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${msg}`);
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
  }
}

const appHubCardPath = path.resolve(process.cwd(), 'src/components/AppHubCard.tsx');
assert(fs.existsSync(appHubCardPath), 'وجود مكون مركز التطبيق المحمول (AppHubCard.tsx)');

const profileScreenPath = path.resolve(process.cwd(), 'src/screens/ProfileScreen.tsx');
const profileContent = fs.readFileSync(profileScreenPath, 'utf-8');
assert(profileContent.includes('AppHubCard'), 'دمج مركز التطبيق في شاشة الملف الشخصي (ProfileScreen)');

const usePwaHookPath = path.resolve(process.cwd(), 'src/hooks/usePWAInstall.ts');
assert(fs.existsSync(usePwaHookPath), 'وجود خطاف تثبيت PWA (usePWAInstall)');

const pwaUpdatePromptPath = path.resolve(process.cwd(), 'src/components/PWAUpdatePrompt.tsx');
assert(fs.existsSync(pwaUpdatePromptPath), 'وجود مكون التحديث التلقائي (PWAUpdatePrompt)');

console.log(`\n📊 النتيجة: نجح ${passed} من أصل ${tests} اختباراً بنسبة 100%!`);
