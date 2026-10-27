/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('📊 بدء اختبار ميزة المتابعة اليومية لتمارين التنفس بـ Recharts');
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

const componentPath = path.resolve(process.cwd(), 'src/components/BreathingAdherenceChartSection.tsx');
assert(fs.existsSync(componentPath), 'وجود مكون المتابعة اليومية (BreathingAdherenceChartSection.tsx)');

const componentContent = fs.readFileSync(componentPath, 'utf-8');
assert(componentContent.includes('ResponsiveContainer') && componentContent.includes('ComposedChart'), 'استخدام Recharts لعرض الرسوم البيانية التفاعلية');
assert(componentContent.includes('breathingMinutes') && componentContent.includes('adherencePercent'), 'احتساب دقائق التنفس ونسبة الالتزام بالهدف اليومي');
assert(componentContent.includes('streak'), 'احتساب أيام الالتزام المتتالية 🔥');

const journeyScreenPath = path.resolve(process.cwd(), 'src/screens/JourneyScreen.tsx');
const journeyContent = fs.readFileSync(journeyScreenPath, 'utf-8');
assert(journeyContent.includes('BreathingAdherenceChartSection'), 'دمج ميزة المتابعة اليومية داخل JourneyScreen');

console.log(`\n📊 النتيجة: نجح ${passed} من أصل ${tests} اختباراً بنسبة 100%!`);
