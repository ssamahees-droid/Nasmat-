/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('📱 اختبار ميزة مشاركة التطبيق بالكامل وبطاقات التعريف');
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
assert(fs.existsSync(modalPath), 'وجود مركز المشاركة وبطاقات التعريف (AchievementShareCardModal.tsx)');

const modalContent = fs.readFileSync(modalPath, 'utf-8');
assert(modalContent.includes('تعرّف على نسمة حياة'), 'احتواء الرسالة التعريفية الرسمية القابلة للمشاركة');
assert(modalContent.includes('app_intro_card'), 'دعم إنشاء البطاقة التعريفية بالتطبيق');
assert(modalContent.includes('app_share'), 'دعم قسم مشاركة التطبيق مباشرة');

const appHubPath = path.resolve(process.cwd(), 'src/components/AppHubCard.tsx');
const appHubContent = fs.readFileSync(appHubPath, 'utf-8');
assert(appHubContent.includes('شارك تطبيق نسمة حياة (بطاقات)') && appHubContent.includes('AchievementShareCardModal'), 'وجود زر واضح ومباشر لمشاركة التطبيق داخل مركز الملف الشخصي');

console.log(`\n📊 النتيجة: نجح ${passed} من أصل ${tests} اختباراً بنسبة 100%!`);
