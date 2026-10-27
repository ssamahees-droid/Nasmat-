/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🗺️ فحص ميزة الجولة التعليمية السريعة (Onboarding Tour)');
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

// 1. Verify QuickAppTourModal.tsx
const modalPath = path.resolve(process.cwd(), 'src/components/QuickAppTourModal.tsx');
assert(fs.existsSync(modalPath), 'وجود مكون الجولة التعليمية السريعة (QuickAppTourModal.tsx)');
const modalCode = fs.readFileSync(modalPath, 'utf-8');
assert(modalCode.includes('TOUR_STEPS'), 'تصدير خطوات الجولة التعليمية السريعة');

// Verify 3 key sections in tour steps
assert(modalCode.includes('الاستكشاف ومكتبة المعرفة') || modalCode.includes('قسم الاستكشاف'), 'الخطوة الأولى: شرح قسم الاستكشاف والمكتبة النفسية');
assert(modalCode.includes('الألعاب والحلول المعرفية') || modalCode.includes('بستان الألعاب'), 'الخطوة الثانية: شرح ألعاب الترويح والحلول المعرفية (CBT)');
assert(modalCode.includes('رفيقي') || modalCode.includes('رفيق رحلتك'), 'الخطوة الثالثة: شرح رفيقي الذكي الداعم للفضفضة والإنصات');

// Verify buttons
assert(modalCode.includes('تخطي') || modalCode.includes('تخطي الجولة'), 'توفير زر «تخطي» لإغلاق الجولة في أي وقت');
assert(modalCode.includes('التالي'), 'توفير زر «التالي» للانتقال بين الخطوات');
assert(modalCode.includes('السابق'), 'توفير زر «السابق» للعودة للخطوة السابقة');
assert(modalCode.includes('ابدأ رحلتك الآن'), 'توفير زر ختامي إنهاء الجولة والبدء');
assert(modalCode.includes('nesmat_quick_tour_seen'), 'حفظ حالة إتمام الجولة في التخزين المحلي لعدم إزعاج المستخدم');

// 2. Verify Integration in HomeScreen.tsx
const homePath = path.resolve(process.cwd(), 'src/screens/HomeScreen.tsx');
const homeCode = fs.readFileSync(homePath, 'utf-8');
assert(homeCode.includes('QuickAppTourModal') && homeCode.includes('isQuickTourOpen'), 'تضمين الجولة السريعة في الشاشة الرئيسية والتفعيل التلقائي للزوار الجدد');

// 3. Verify Integration in ScreenBannerHeader.tsx
const headerPath = path.resolve(process.cwd(), 'src/components/ScreenBannerHeader.tsx');
const headerCode = fs.readFileSync(headerPath, 'utf-8');
assert(headerCode.includes('QuickAppTourModal') && headerCode.includes('جولة'), 'إتاحة زر إعادة إطلاق الجولة السريعة في ترويسة الشاشات الرئيسية ScreenBannerHeader');

console.log(`\n====================================================`);
console.log(`📊 النتيجة الإجمالية: نجح ${passedTests} من أصل ${totalTests} اختباراً بنسبة ${(passedTests / totalTests * 100).toFixed(0)}%! 🎉`);
console.log('====================================================');
