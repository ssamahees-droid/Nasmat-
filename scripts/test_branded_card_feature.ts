/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🎨 فحص واجهة إنشاء البطاقة التعريفية البصرية ومشاركتها');
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

// 1. Verify cardCanvasGenerator service
const generatorPath = path.resolve(process.cwd(), 'src/services/cardCanvasGenerator.ts');
assert(fs.existsSync(generatorPath), 'وجود محرك توليد البطاقات البصرية (cardCanvasGenerator.ts)');
const generatorCode = fs.readFileSync(generatorPath, 'utf-8');
assert(generatorCode.includes('renderIdentityCardToCanvas'), 'تصدير دالة رسم وتوليد البطاقة بدقة عالية على الكانفاس (renderIdentityCardToCanvas)');
assert(generatorCode.includes('downloadCanvasAsPng'), 'تصدير دالة تنزيل الصورة بصيغة PNG (downloadCanvasAsPng)');
assert(generatorCode.includes('shareCanvasImage'), 'تصدير دالة المشاركة المباشرة عبر Web Share API بالملف الفعلي (shareCanvasImage)');
assert(generatorCode.includes('emerald') && generatorCode.includes('cream') && generatorCode.includes('night'), 'توفير الطوابع اللونية الثلاثة المتوافقة مع هوية التطبيق (زمردي، سكينة الفجر، ليل السكينة)');
assert(generatorCode.includes('wrapText'), 'توفير معالجة والتفاف نصوص اللغة العربية تلقائياً على الكانفاس');
assert(generatorCode.includes('/logo.jpg'), 'اعتماد مسار شعار التطبيق الرسمي في بطاقة الكانفاس');

// 2. Verify BrandedIdentityCardModal component
const modalPath = path.resolve(process.cwd(), 'src/components/BrandedIdentityCardModal.tsx');
assert(fs.existsSync(modalPath), 'وجود مكون واجهة إنشاء البطاقة (BrandedIdentityCardModal.tsx)');
const modalCode = fs.readFileSync(modalPath, 'utf-8');
assert(modalCode.includes('CARD_THEMES') && modalCode.includes('renderIdentityCardToCanvas'), 'ربط الواجهة بمحرك الكانفاس الحقيقي');
assert(modalCode.includes('PRESET_TAGLINES'), 'توفير عبارات تعريفية هادفة جاهزة للاختيار');
assert(modalCode.includes('/logo.jpg'), 'عرض شعار التطبيق في المعاينة الحية للبطاقة');
assert(modalCode.includes('نَسْمَةُ حَيَاة'), 'ظهور اسم التطبيق الرسمي بتشكيل راقٍ وتصميم جذاب');
assert(modalCode.includes('handleDownload'), 'تنفيذ وظيفة التنزيل الفعلي بصيغة PNG');
assert(modalCode.includes('handleShare'), 'تنفيذ وظيفة المشاركة الفورية عبر Web Share API');
assert(modalCode.includes('senderName'), 'إتاحة تخصيص اسم المُهدي أو كاتب العبارة');

// 3. Verify Integration in AchievementShareCardModal
const shareModalPath = path.resolve(process.cwd(), 'src/components/AchievementShareCardModal.tsx');
const shareModalCode = fs.readFileSync(shareModalPath, 'utf-8');
assert(shareModalCode.includes('BrandedIdentityCardModal'), 'تضمين مُنشئ البطاقات داخل مركز المشاركة العام');
assert(shareModalCode.includes('renderIdentityCardToCanvas') && shareModalCode.includes('downloadCanvasAsPng'), 'تفعيل التنزيل الفعلي للبطاقة من مركز المشاركة');

// 4. Verify Integration in Hub and Journey Screens
const appHubPath = path.resolve(process.cwd(), 'src/components/AppHubCard.tsx');
const appHubCode = fs.readFileSync(appHubPath, 'utf-8');
assert(appHubCode.includes('BrandedIdentityCardModal') && appHubCode.includes('مُنشئ البطاقة التعريفية البصرية الرسمية'), 'إتاحة زر مباشر لإنشاء البطاقة من مركز الملف الشخصي AppHubCard');

const journeyPath = path.resolve(process.cwd(), 'src/screens/JourneyScreen.tsx');
const journeyCode = fs.readFileSync(journeyPath, 'utf-8');
assert(journeyCode.includes('BrandedIdentityCardModal') && journeyCode.includes('بطاقة نسمة حياة البصرية'), 'إتاحة بطاقة وصول مباشر لإنشاء وتحميل البطاقة من شاشة رحلتي');

console.log(`\n====================================================`);
console.log(`📊 النتيجة الإجمالية: نجح ${passedTests} من أصل ${totalTests} اختباراً بنسبة ${(passedTests / totalTests * 100).toFixed(0)}%! 🎉`);
console.log('====================================================');
