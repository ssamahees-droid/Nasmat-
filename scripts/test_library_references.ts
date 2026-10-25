/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_TEXT_BOOKS } from '../src/data/fullTextBooksData';
import { SCIENTIFIC_REFERENCES } from '../src/data/scientificReferencesData';
import { PSYCHOEDUCATION_BOOKS } from '../src/data/psychoeducationBooksData';

console.log('====================================================');
console.log('🔬 اختبار تدقيق مكتبة المراجع والكتب الكاملة — نسمة حياة');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [نجاح]: ${testName}`);
  } else {
    failedTests++;
    console.error(`❌ [فشل]: ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

// 1. اختبار الكتب الكاملة
console.log('--- 1. اختبار فئة الكتب الكاملة (Full Text Books) ---');
assert(FULL_TEXT_BOOKS.length >= 2, 'توفر كتب كاملة موثقة في النظام', `العدد: ${FULL_TEXT_BOOKS.length}`);

const whoBook = FULL_TEXT_BOOKS.find(b => b.id === 'fullbook_doing_what_matters');
assert(Boolean(whoBook), 'وجود كتاب منظمة الصحة العالمية (Doing What Matters)');

if (whoBook) {
  assert(whoBook.chapters.length >= 6, 'اكتمال فصول كتاب منظمة الصحة العالمية (6 فصول)', `الفصول: ${whoBook.chapters.length}`);
  
  const ch0 = whoBook.chapters.find(c => c.id === 'who_chap_0');
  assert(Boolean(ch0), 'وجود الفصل التمهيدي (التصدير وكلمات الشكر والعرفان)');
  
  if (ch0) {
    const hasForeword = ch0.sections.some(s => s.heading?.includes('تصدير') || s.paragraphs.some(p => p.includes('ديفورا كيستل')));
    assert(hasForeword, 'إدراج التصدير الرسمي المعتمد بقلم ديفورا كيستل');
    
    const hasAcks = ch0.sections.some(s => s.heading?.includes('الشكر والعرفان'));
    assert(hasAcks, 'إدراج كلمات الشكر والعرفان الرسمية وأسماء فريق العمل والميدان');
  }

  const ch5 = whoBook.chapters.find(c => c.id === 'who_chap_5');
  assert(Boolean(ch5), 'وجود الفصل الخامس والملحق المرجعي للأدوات الخمس');
  if (ch5) {
    const hasQuickTools = ch5.sections.some(s => s.heading?.includes('الأداة الأولى') || s.heading?.includes('بطاقة'));
    assert(hasQuickTools, 'إدراج بطاقات الأدوات الخمس السريعة المعتمدة');
  }

  assert(Boolean(whoBook.pdfDownloadUrl), 'ربط ملف PDF الرسمي المعتمد محلياً', `المسار: ${whoBook.pdfDownloadUrl}`);
  assert(whoBook.licenseType === 'CC_BY_NC_SA_3_0_IGO', 'صحة تصنيف الترخيص CC BY-NC-SA 3.0 IGO');
  assert(whoBook.attributionText.includes('World Health Organization'), 'وجود نص الإسناد الرسمي');
  assert(whoBook.licenseVerificationNotes.includes('تنويه وإخلاء مسؤولية'), 'وجود إخلاء المسؤولية المعتمد لمنظمة الصحة العالمية');
}

// 2. اختبار المراجع العلمية والسريرية المعتمدة
console.log('\n--- 2. اختبار المراجع العلمية والسريرية (Scientific References) ---');
assert(SCIENTIFIC_REFERENCES.length >= 5, 'توفر المراجع الخمسة الأساسية المطلوبة', `العدد: ${SCIENTIFIC_REFERENCES.length}`);

const targetRefIds = [
  'ref-who-doing-what-matters',
  'ref-who-self-help-interventions-2026',
  'ref-who-step-by-step',
  'ref-who-world-mental-health-report',
  'ref-who-self-care-interventions'
];

targetRefIds.forEach(refId => {
  const ref = SCIENTIFIC_REFERENCES.find(r => r.id === refId);
  assert(Boolean(ref), `تحقق وجود المرجع الأساسي [${refId}]`, ref?.title);
  if (ref) {
    assert(ref.keyClinicalFindings.length >= 3, `وجود خلاصات سريرية وافية للمرجع [${refId}]`, `العدد: ${ref.keyClinicalFindings.length}`);
    assert(ref.appIntegrationAreas.length >= 2, `تحديد مواضع التكامل داخل التطبيق [${refId}]`, `المواضع: ${ref.appIntegrationAreas.join(', ')}`);
    assert(Boolean(ref.limitationsAndSafety), `توثيق الحدود السريرية وضوابط الأمان [${refId}]`);
    assert(Boolean(ref.officialUrl), `توفر رابط المصنع الرسمي WHO IRIS [${refId}]`);
  }
});

// 3. اختبار الملخصات والمواد التثقيفية المركبة
console.log('\n--- 3. اختبار الملخصات والمواد التثقيفية (Psychoeducation Summaries) ---');
assert(PSYCHOEDUCATION_BOOKS.length >= 14, 'حفظ جميع ملخصات الكتب التثقيفية الـ 14 كاملة', `العدد: ${PSYCHOEDUCATION_BOOKS.length}`);
const allHaveSummaries = PSYCHOEDUCATION_BOOKS.every(b => b.summaryArabic && b.summaryArabic.length > 50);
assert(allHaveSummaries, 'سلامة جميع الملخصات العربية وخلوها من الإفراغ');

// 4. فحص خلو النصوص من المحارف التالفة
console.log('\n--- 4. فحص جودة وسلامة المحارف العربية ---');
let hasCorruptUnicode = false;
FULL_TEXT_BOOKS.forEach(b => {
  b.chapters.forEach(c => {
    c.sections.forEach(s => {
      s.paragraphs.forEach(p => {
        if (p.includes('\ufffd')) hasCorruptUnicode = true;
      });
    });
  });
});
assert(!hasCorruptUnicode, 'خلو نصوص الكتب الكاملة من محارف الاستبدال التالفة (\\ufffd)');

console.log('\n====================================================');
console.log(`📊 النتيجة النهائية: ${passedTests} من أصل ${totalTests} اختبار اجتازت بنجاح (فشل: ${failedTests})`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
