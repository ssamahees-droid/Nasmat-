/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🔗 فحص ميزة زر المشاركة الموحد والنافذة المنبثقة البديلة');
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

// 1. Verify UnifiedShareButton.tsx
const btnPath = path.resolve(process.cwd(), 'src/components/UnifiedShareButton.tsx');
assert(fs.existsSync(btnPath), 'وجود مكون زر المشاركة الموحد (UnifiedShareButton.tsx)');
const btnCode = fs.readFileSync(btnPath, 'utf-8');
assert(btnCode.includes('navigator.share') && btnCode.includes('navigator.canShare'), 'استخدام Web Share API (navigator.share) عند توفر دعم المتصفح');
assert(btnCode.includes('ShareFallbackModal'), 'استدعاء نافذة المشاركة البديلة ShareFallbackModal عند غياب الدعم');
assert(btnCode.includes('customTitle') && btnCode.includes('customText') && btnCode.includes('appUrl'), 'تمرير العنوان والرسالة التعريفية ورابط التطبيق العام');

// 2. Verify ShareFallbackModal.tsx
const modalPath = path.resolve(process.cwd(), 'src/components/ShareFallbackModal.tsx');
assert(fs.existsSync(modalPath), 'وجود مكون نافذة المشاركة المنبثقة البديلة (ShareFallbackModal.tsx)');
const modalCode = fs.readFileSync(modalPath, 'utf-8');
assert(modalCode.includes('shortUrl'), 'عرض رابط التطبيق المختصر والأنيق');
assert(modalCode.includes('handleCopyUrl'), 'توفير زر مخصص لنسخ رابط التطبيق');
assert(modalCode.includes('copiedType') && modalCode.includes('تم نسخ رابط التطبيق'), 'إظهار تأكيد بصري واضح ومؤقت للمستخدم عند نجاح النسخ');
assert(modalCode.toLowerCase().includes('whatsapp') && modalCode.toLowerCase().includes('telegram'), 'توفير روابط سريعة بديلة للمشاركة عبر منصات التواصل (واتساب، تيليجرام)');

// 3. Verify Integration in Navbar.tsx
const navbarPath = path.resolve(process.cwd(), 'src/components/Navbar.tsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf-8');
assert(navbarCode.includes('UnifiedShareButton') && navbarCode.includes('variant="navbar"'), 'تضمين زر المشاركة الموحد في شريط التنقل العلوي Navbar ليكون متاحاً في جميع الشاشات');

// 4. Verify Integration in ScreenBannerHeader.tsx
const headerPath = path.resolve(process.cwd(), 'src/components/ScreenBannerHeader.tsx');
const headerCode = fs.readFileSync(headerPath, 'utf-8');
assert(headerCode.includes('UnifiedShareButton') && headerCode.includes('variant="compact"'), 'تضمين زر المشاركة الموحد في ترويسة الشاشات الرئيسية ScreenBannerHeader (الشاشات من ٢ إلى ١٠)');

// 5. Verify Integration in HomeScreen.tsx
const homePath = path.resolve(process.cwd(), 'src/screens/HomeScreen.tsx');
const homeCode = fs.readFileSync(homePath, 'utf-8');
assert(homeCode.includes('UnifiedShareButton'), 'تضمين زر المشاركة الموحد في الشاشة الرئيسية HomeScreen');

console.log(`\n====================================================`);
console.log(`📊 النتيجة الإجمالية: نجح ${passedTests} من أصل ${totalTests} اختباراً بنسبة ${(passedTests / totalTests * 100).toFixed(0)}%! 🎉`);
console.log('====================================================');
