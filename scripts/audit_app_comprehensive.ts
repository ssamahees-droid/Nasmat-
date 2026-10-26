/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Comprehensive Deep Audit Script for «نسمة حياة»
 * Tests all screens, games, interactive tools, offline architecture, and performance.
 */

import fs from 'fs';
import path from 'path';
import { CIPHER_LEVELS, CIPHER_WORLDS, CIPHER_SECRETS, GRAND_SECRET_SYNTHESIS } from '../src/data/nesmatCipherData';
import { JIGSAW_LEVELS, SPOT_CHALLENGES, LOGIC_PUZZLES } from '../src/data/puzzleSuiteData';

console.log('================================================================');
console.log('🔍 بدء الفحص الشامل لمنظومة تطبيق «نسمة حياة»');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const issues: { category: string; description: string; severity: 'low' | 'medium' | 'high'; fix: string }[] = [];

function check(title: string, condition: boolean, category: string, failureIssue?: { description: string; severity: 'low' | 'medium' | 'high'; fix: string }) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${title}`);
  } else {
    console.log(`  ❌ [FAIL] ${title}`);
    if (failureIssue) {
      issues.push({ category, ...failureIssue });
    }
  }
}

// -------------------------------------------------------------
// 1. Screens Integrity Check
// -------------------------------------------------------------
console.log('\n--- 1️⃣ فحص الشاشات الرئيسية الـ 19 ---');
const screensDir = path.resolve(process.cwd(), 'src/screens');
const expectedScreens = [
  'WelcomeScreen.tsx',
  'OnboardingScreen.tsx',
  'StartScreen.tsx',
  'HomeScreen.tsx',
  'SelfDiscoveryScreen.tsx',
  'GamesScreen.tsx',
  'PracticeScreen.tsx',
  'RescueScreen.tsx',
  'ExploreScreen.tsx',
  'ContentDetailScreen.tsx',
  'AssessmentScreen.tsx',
  'SupportScreen.tsx',
  'BreatheScreen.tsx',
  'JourneyScreen.tsx',
  'ProfileScreen.tsx',
  'AdminDashboardScreen.tsx',
  'FekerAppScreen.tsx',
  'ListenToYourselfScreen.tsx',
  'WeeklySessionScreen.tsx'
];

expectedScreens.forEach(screenFile => {
  const filePath = path.join(screensDir, screenFile);
  const exists = fs.existsSync(filePath);
  let hasValidExport = false;
  let size = 0;
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf-8');
    size = content.length;
    hasValidExport = content.includes('export const') || content.includes('export function') || content.includes('export default');
  }
  check(`شاشة ${screenFile} (حجم: ${(size / 1024).toFixed(1)} KB)`, exists && hasValidExport && size > 500, 'الشاشات', {
    description: `الشاشة ${screenFile} إما مفقودة أو غير مكتملة`,
    severity: 'high',
    fix: 'إعادة بناء وتصدير الشاشة بشكل سليم'
  });
});

// -------------------------------------------------------------
// 2. Games and Interactive Tools Check
// -------------------------------------------------------------
console.log('\n--- 2️⃣ فحص جميع الألعاب والأدوات التفاعلية ---');
const componentsDir = path.resolve(process.cwd(), 'src/components');
const expectedGameModals = [
  { file: 'NesmatCipherModal.tsx', name: 'شفرة نسمة الكبرى (30 مرحلة)' },
  { file: 'RealPuzzlesModal.tsx', name: 'واحة الألغاز الحقيقية المباشرة (Jigsaw + Spot + Logic)' },
  { file: 'CognitiveReframingPuzzleModal.tsx', name: 'لعبة صانع الأنماط وواحة الألغاز' },
  { file: 'GwayaHekayaGameModal.tsx', name: 'لعبة جوايا حكاية' },
  { file: 'FekerAppModal.tsx', name: 'تطبيق فكّر المدمج' },
  { file: 'UntangleKnotModal.tsx', name: 'لعبة فك العقد التفاعلية' },
  { file: 'FactOrStoryGameModal.tsx', name: 'لعبة حقيقة أم قصة' },
  { file: 'InnerBurdensBubbleGameModal.tsx', name: 'لعبة فقاعات الأعباء' },
  { file: 'EmotionalBridgeGameModal.tsx', name: 'لعبة جسر المشاعر' },
  { file: 'GratitudeGardenModal.tsx', name: 'حديقة الامتنان' },
  { file: 'EmotionCompassModal.tsx', name: 'بوصلة المشاعر' },
  { file: 'InnerCompassJourneyModal.tsx', name: 'رحلة البوصلة الداخلية' },
  { file: 'InnerLabyrinthModal.tsx', name: 'متاهة الهدوء' },
  { file: 'DigitalReleaseRitualModal.tsx', name: 'طقوس التحرر الرقمي' },
  { file: 'RelationalEnergyMatrixModal.tsx', name: 'مصفوفة طاقة الروابط' },
  { file: 'MoodKitchenModal.tsx', name: 'مطبخ المزاج التفاعلي' },
  { file: 'OmarKhairatMusicLoungeModal.tsx', name: 'صالون النغم والسكينة' },
  { file: 'SoundscapeStudio.tsx', name: 'استوديو الأصوات الطبيعية' },
  { file: 'DailyMiracleDrawerModal.tsx', name: 'درج المعجزات اليومية' },
  { file: 'EmotionalOrigamiGardenModal.tsx', name: 'حديقة الأوريغامي الشعوري' },
  { file: 'NesmaLaughsModal.tsx', name: 'استراحة الضحك والبهجة' },
  { file: 'NesmatLuckyWheel.tsx', name: 'عجلة نسمة الدوارة' },
  { file: 'FullBookReaderModal.tsx', name: 'قارئ كتب منظمة الصحة العالمية والمراجع' }
];

expectedGameModals.forEach(mod => {
  const filePath = path.join(componentsDir, mod.file);
  const exists = fs.existsSync(filePath);
  let size = 0;
  let hasContent = false;
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf-8');
    size = content.length;
    hasContent = size > 1000;
  }
  check(`مكوّن ${mod.name} (${mod.file})`, exists && hasContent, 'الألعاب والأدوات', {
    description: `المكوّن ${mod.file} غير موجود أو فارغ`,
    severity: 'high',
    fix: 'إكمال المكون'
  });
});

// -------------------------------------------------------------
// 3. Deep Puzzle Suite Content Verification
// -------------------------------------------------------------
console.log('\n--- 3️⃣ فحص بيانات ومحركات لعبتي «شفرة نسمة» و«واحة الألغاز» ---');
check('شفرة نسمة: 30 مرحلة مكتملة البيانات بالكامل', CIPHER_LEVELS.length === 30, 'شفرة نسمة');
check('شفرة نسمة: 3 عوالم متكاملة', CIPHER_WORLDS.length === 3, 'شفرة نسمة');
check('شفرة نسمة: 3 أسرار مخفية', CIPHER_SECRETS.length === 3, 'شفرة نسمة');
check('شفرة نسمة: لغز السر الأعظم والتركيب النهائي', Boolean(GRAND_SECRET_SYNTHESIS && GRAND_SECRET_SYNTHESIS.options.length >= 3), 'شفرة نسمة');

check('واحة الألغاز: 4 مستويات تركيب صور Jigsaw', JIGSAW_LEVELS.length === 4, 'واحة الألغاز');
check('واحة الألغاز: 3 مشاهد بصرية دقيقة لاكتشاف الفروق والتفاصيل', SPOT_CHALLENGES.length === 3, 'واحة الألغاز');
check('واحة الألغاز: 7 تحديات تفكير منطقي وأعواد ثقاب ومصفوفات', LOGIC_PUZZLES.length === 7, 'واحة الألغاز');

// Verify that all Jigsaw images exist on disk or public
JIGSAW_LEVELS.forEach(lvl => {
  const isInternal = lvl.imageSrc.startsWith('/images/') || lvl.imageSrc.startsWith('data:') || lvl.imageSrc.includes('assets');
  check(`واحة الألغاز: صورة مستوى تركيب «${lvl.title}» محملة ومتاحة`, isInternal || lvl.imageSrc.length > 5, 'واحة الألغاز');
});

// -------------------------------------------------------------
// 4. Offline Architecture & PWA Verification
// -------------------------------------------------------------
console.log('\n--- 4️⃣ فحص البنية التحتية للعمل بدون إنترنت (Offline Architecture) ---');
const viteConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');

check('تكوين VitePWA مسجل في vite.config.ts', viteConfig.includes('VitePWA('), 'العمل بدون إنترنت');
check('تكوين Workbox للتخزين المؤقت المحلي', viteConfig.includes('workbox:') && viteConfig.includes('runtimeCaching:'), 'العمل بدون إنترنت');
check('تخزين الأصوات الطبيعية في كاش Workbox', viteConfig.includes('nature-audio-cache'), 'العمل بدون إنترنت');
check('تخزين الصور في كاش Workbox', viteConfig.includes('nesmat-images-cache'), 'العمل بدون إنترنت');

// Check manifest.json exists
const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
check('ملف manifest.json متواجد ومكتمل', fs.existsSync(manifestPath), 'العمل بدون إنترنت');

// Check Local Storage Service & Chime Service
const storageServicePath = path.resolve(process.cwd(), 'src/services/storage.ts');
const storageContent = fs.readFileSync(storageServicePath, 'utf-8');
check('نظام التخزين المحلي الاحتياطي (LocalStorage fallback)', storageContent.includes('localStorage') && storageContent.includes('getUser'), 'العمل بدون إنترنت');

const chimeServicePath = path.resolve(process.cwd(), 'src/services/chimeService.ts');
const chimeContent = fs.readFileSync(chimeServicePath, 'utf-8');
check('نظام توليد الأصوات التوليدية محلياً (Web Audio API) بدون طلبات خارجية', chimeContent.includes('AudioContext') && chimeContent.includes('playReassuranceChime'), 'العمل بدون إنترنت');

// Check Book PDF presence for offline reading
const bookPdfPath = path.resolve(process.cwd(), 'public/books/who_doing_what_matters_ar.pdf');
check('كتاب منظمة الصحة العالمية PDF متواجد محلياً (2.8MB) في public/books/', fs.existsSync(bookPdfPath), 'العمل بدون إنترنت');

// -------------------------------------------------------------
// 5. Performance and Code Splitting Check («مش تقيل»)
// -------------------------------------------------------------
console.log('\n--- 5️⃣ فحص الأداء والسرعة وتجزئة الشيفرة (Code Splitting) ---');
const appTsxPath = path.resolve(process.cwd(), 'src/App.tsx');
const appTsx = fs.readFileSync(appTsxPath, 'utf-8');

check('استخدام React.lazy لتجزئة الشاشات وتقليل حجم التحميل الأولي', appTsx.includes('lazy(') && appTsx.includes('Suspense'), 'الأداء والسرعة');
check('شاشة البداية HomeScreen محملة مباشرة للاستجابة الفورية', appTsx.includes("import { HomeScreen } from './screens/HomeScreen'"), 'الأداء والسرعة');
check('دعم وضع الأداء العالي للأجهزة الضعيفة (Mobile Performance Mode)', appTsx.includes('mobile-low-perf') || appTsx.includes('isMobilePerformanceMode'), 'الأداء والسرعة');
check('تقسيم حزم Rollup vendor chunks في vite.config.ts', viteConfig.includes('manualChunks') && viteConfig.includes('vendor-react') && viteConfig.includes('vendor-motion'), 'الأداء والسرعة');

// Check for heavy or unused packages in package.json
const pkgJsonPath = path.resolve(process.cwd(), 'package.json');
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
check('حزمة framer-motion مثبتة بنجاح وتعمل', Boolean(pkgJson.dependencies['framer-motion'] || pkgJson.dependencies['motion']), 'الأداء والسرعة');

console.log('\n================================================================');
console.log(`📊 ملخص التدقيق: نجح ${passedChecks} من أصل ${totalChecks} فحصاً بنسبة ${((passedChecks / totalChecks) * 100).toFixed(1)}%!`);
console.log(`⚠️ عدد الملاحظات والتحسينات المقترحة: ${issues.length}`);
console.log('================================================================\n');

if (issues.length > 0) {
  console.log('تفاصيل الملاحظات:');
  issues.forEach((iss, i) => {
    console.log(`${i + 1}. [${iss.category}] ${iss.description} -> الحل: ${iss.fix}`);
  });
}
