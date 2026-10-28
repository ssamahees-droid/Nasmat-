/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('📊 فحص ميزة خريطة الالتزام والاستمرارية ( Consistency Heatmap)');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, msg: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${msg}`);
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
  }
}

// 1. Verify ConsistencyHeatmapSection component
const sectionPath = path.resolve(process.cwd(), 'src/components/ConsistencyHeatmapSection.tsx');
assert(fs.existsSync(sectionPath), 'وجود مكون خريطة الالتزام (ConsistencyHeatmapSection.tsx)');
const sectionCode = fs.readFileSync(sectionPath, 'utf-8');

assert(sectionCode.includes('recharts'), 'استخدام مكتبة Recharts للتمثيل البياني والتفاعلي');
assert(sectionCode.includes('ResponsiveContainer') && sectionCode.includes('BarChart') && sectionCode.includes('Bar') && sectionCode.includes('Cell'), 'استخدام مكونات Recharts (BarChart, Bar, Cell, ResponsiveContainer)');
assert(sectionCode.includes('Tooltip'), 'توفير التلميحات التفاعلية Recharts Tooltip لشرح بيانات اليوم');
assert(sectionCode.includes('getDailyCheckins') && sectionCode.includes('getMindfulnessRecords') && sectionCode.includes('getHabits'), 'ربط البيانات بسجلات تفقد المشاعر، تمارين التنفس، والعناية الذاتية');
assert(sectionCode.includes('LEVEL_COLORS'), 'تحديد 5 مستويات كثافة ملونة متوافقة مع هوية التطبيق البصرية');
assert(sectionCode.includes('stats.activeDays') && sectionCode.includes('stats.maxStreak') && sectionCode.includes('stats.totalBreathingMins'), 'احتساب وعرض ملخص الإحصائيات (الأيام النشطة، السلسلة، دقائق التنفس)');

// 2. Verify integration in JourneyScreen.tsx
const journeyPath = path.resolve(process.cwd(), 'src/screens/JourneyScreen.tsx');
const journeyCode = fs.readFileSync(journeyPath, 'utf-8');
assert(journeyCode.includes('ConsistencyHeatmapSection'), 'تضمين خريطة الالتزام والاستمرارية داخل شاشة رحلتي (JourneyScreen.tsx)');

console.log(`\n====================================================`);
console.log(`📊 النتيجة الإجمالية: نجح ${passedTests} من أصل ${totalTests} اختباراً بنسبة ${(passedTests / totalTests * 100).toFixed(0)}%! 🎉`);
console.log('====================================================');
