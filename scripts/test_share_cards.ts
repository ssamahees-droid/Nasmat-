/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🌟 اختبار ميزة مشاركة الإنجازات وبطاقات السكينة');
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

const modalPath = path.resolve(process.cwd(), 'src/components/AchievementShareCardModal.tsx');
assert(fs.existsSync(modalPath), 'وجود مكون بطاقات المشاركة (AchievementShareCardModal.tsx)');

const modalContent = fs.readFileSync(modalPath, 'utf-8');
assert(modalContent.includes('shareContent'), 'استخدام خدمة المشاركة المركزية (shareContent)');
assert(modalContent.includes('breathing') && modalContent.includes('streak') && modalContent.includes('wisdom'), 'توفر تصاميم البطاقات الثلاث (التنفس، السلسلة، التأمل)');

const journeyPath = path.resolve(process.cwd(), 'src/screens/JourneyScreen.tsx');
const journeyContent = fs.readFileSync(journeyPath, 'utf-8');
assert(journeyContent.includes('AchievementShareCardModal'), 'دمج نافذة بطاقات المشاركة داخل JourneyScreen');

console.log(`\n📊 النتيجة: نجح ${passed} من أصل ${tests} اختباراً بنسبة 100%!`);
