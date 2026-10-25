/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { whoDoingWhatMattersBook } from '../src/data/whoDoingWhatMattersData';

console.log('====================================================');
console.log('🔬 اختبار تدقيق عارض الكتاب المصور الأصلي والتبديل النصي');
console.log('====================================================\n');

let total = 0;
let passed = 0;

function check(cond: boolean, desc: string, details?: string) {
  total++;
  if (cond) {
    passed++;
    console.log(`✅ [نجاح]: ${desc}`);
  } else {
    console.error(`❌ [فشل]: ${desc} -> ${details || ''}`);
  }
}

// 1. ملف الـ PDF الأصلي
const pdfPath = path.resolve('public/books/who_doing_what_matters_ar.pdf');
check(fs.existsSync(pdfPath), 'وجود ملف PDF الأصلي داخل public/books/', pdfPath);
const stat = fs.statSync(pdfPath);
check(stat.size === 2927988, 'حجم ملف الـ PDF مطابق للأصل (2,927,988 بايت)', `الحجم: ${stat.size}`);

// 2. فحص بيانات الكتاب في whoDoingWhatMattersData.ts
check(Boolean(whoDoingWhatMattersBook.pdfDownloadUrl), 'ربط مسار ملف الـ PDF في كائن الكتاب', whoDoingWhatMattersBook.pdfDownloadUrl);
check(whoDoingWhatMattersBook.summary.includes('الكتاب المصور الأصلي (PDF)'), 'إيضاح خيار قراءة الكتاب المصور في الملخص');
check(whoDoingWhatMattersBook.summary.includes('قراءة النص المنظم'), 'إيضاح خيار قراءة النص المنظم كمواءمة مساعدة');
check(whoDoingWhatMattersBook.licenseVerificationNotes.includes('وضع قراءة نصياً مساعداً'), 'توضيح أن النص المنظم مواءمة مساعدة في إشعار الترخيص');

// 3. فحص شيفرة FullBookReaderModal.tsx
const modalCode = fs.readFileSync('src/components/FullBookReaderModal.tsx', 'utf-8');

check(modalCode.includes("const [readerMode, setReaderMode] = useState"), 'وجود حالة التبديل بين وضعي القراءة (readerMode)');
check(modalCode.includes("const [pdfPage, setPdfPage] = useState"), 'وجود حالة رقم الصفحة للعارض المصور (pdfPage)');
check(modalCode.includes("const [pdfZoom, setPdfZoom] = useState"), 'وجود حالة التكبير والتصغير (pdfZoom)');

check(modalCode.includes('قراءة النص المنظم (مساعد)'), 'وجود زر خيار قراءة النص المنظم');
check(modalCode.includes('قراءة الكتاب المصوّر الأصلي (PDF)'), 'وجود زر خيار قراءة الكتاب المصور الأصلي');

// 4. أزرار التنقل والصفحات
check(modalCode.includes('setPdfPage(p => Math.max(1, p - 1))'), 'وجود زر الانتقال للصفحة السابقة');
check(modalCode.includes('setPdfPage(p => Math.min(132, p + 1))'), 'وجود زر الانتقال للصفحة التالية');
check(modalCode.includes('setPdfPage(1)'), 'وجود زر الانتقال لأول صفحة (ص 1)');
check(modalCode.includes('setPdfPage(66)'), 'وجود زر الانتقال لمنتصف الكتاب (ص 66)');
check(modalCode.includes('setPdfPage(132)'), 'وجود زر الانتقال لآخر صفحة (ص 132)');
check(modalCode.includes('setPdfPage(5)'), 'وجود زر الانتقال للتصدير (ص 5)');
check(modalCode.includes('setPdfPage(122)'), 'وجود زر الانتقال لملحق الأدوات (ص 122)');

// 5. التكبير والتصغير والمحاذاة
check(modalCode.includes('setPdfZoom(z => Math.min(200, z + 25))'), 'وجود زر التكبير (+25%)');
check(modalCode.includes('setPdfZoom(z => Math.max(75, z - 25))'), 'وجود زر التصغير (-25%)');
check(modalCode.includes('setPdfZoom(100)'), 'وجود زر إعادة ضبط التكبير (100%)');

// 6. تضمين الـ iframe وروابط البدائل
check(modalCode.includes('<iframe'), 'تضمين عنصر العرض الداخلي (iframe)');
check(modalCode.includes('#page=${pdfPage}&zoom=${pdfZoom}'), 'ربط الإطار برقم الصفحة والتكبير عبر معلمات URL');
check(modalCode.includes('فتح في نافذة كاملة'), 'توفير خيار فتح الملف في نافذة كاملة خارجية كبديل آمن');
check(modalCode.includes('download="who_doing_what_matters_ar.pdf"'), 'توفير زر التنزيل المباشر للملف الأصلي');
check(modalCode.includes('وضع قراءة نصي مساعد'), 'توفير تنويه وضع القراءة المساعد في نمط النص المنظم');

console.log('\n====================================================');
console.log(`📊 النتيجة النهائية: ${passed} من أصل ${total} اختبار اجتازت بنجاح!`);
console.log('====================================================');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
