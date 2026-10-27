/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('📖 فحص شامل لميزات سهولة القراءة وتكبير الخط وشروح الأقسام والألعاب');
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

// 1. Check index.css font configurations & classes
const cssPath = path.resolve(process.cwd(), 'src/index.css');
assert(fs.existsSync(cssPath), 'وجود ملف الأنماط العام index.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');
assert(cssContent.includes("font-family: 'Cairo', 'Tajawal'"), 'اعتماد خطوط كيرو وتجوال العربية القياسية في index.css');
assert(cssContent.includes('html.font-normal') && cssContent.includes('font-size: 17px'), 'توفير نمط الخط العادي المريح (17px)');
assert(cssContent.includes('html.font-large') && cssContent.includes('font-size: 19px'), 'توفير نمط الخط الكبير الواضح (19px)');
assert(cssContent.includes('html.font-extralarge') && cssContent.includes('font-size: 21px'), 'توفير نمط الخط الأكبر (21px)');

// 2. Check appExplanations data
const expPath = path.resolve(process.cwd(), 'src/data/appExplanations.ts');
assert(fs.existsSync(expPath), 'وجود ملف بيانات شروح الأقسام والألعاب appExplanations.ts');
const expContent = fs.readFileSync(expPath, 'utf-8');
const requiredSections = ['home', 'start', 'breathe', 'self_discovery', 'explore', 'games', 'practice', 'journey', 'rescue', 'support'];
for (const s of requiredSections) {
  assert(expContent.includes(`id: '${s}'`), `تضمين شرح القسم: ${s}`);
}
const requiredGames = ['nesmat_cipher', 'real_puzzles', 'feker_app', 'inner_burdens', 'untangle_knot', 'fact_or_story', 'gratitude_garden'];
for (const g of requiredGames) {
  assert(expContent.includes(`id: '${g}'`), `تضمين دليل اللعبة: ${g}`);
}

// 3. Check reusable components
const cardCompPath = path.resolve(process.cwd(), 'src/components/SectionExplanationCard.tsx');
assert(fs.existsSync(cardCompPath), 'وجود مكون بطاقة شرح القسم المنسدلة SectionExplanationCard.tsx');
const cardContent = fs.readFileSync(cardCompPath, 'utf-8');
assert(cardContent.includes('coreIdea') && cardContent.includes('expectedBenefit') && cardContent.includes('howToStart'), 'بطاقة شرح القسم تغطي الفكرة والفائدة وكيف تبدأ');
assert(cardContent.includes('تنبيه وقائي') || cardContent.includes('طبي'), 'تضمين التنويه الطبي الوقائي في بطاقة الشرح');

const gameGuideCompPath = path.resolve(process.cwd(), 'src/components/GameInstructionsModal.tsx');
assert(fs.existsSync(gameGuideCompPath), 'وجود نافذة دليل طريقة اللعب المنبثقة GameInstructionsModal.tsx');
const gameGuideContent = fs.readFileSync(gameGuideCompPath, 'utf-8');
assert(gameGuideContent.includes('idea') && gameGuideContent.includes('controls') && gameGuideContent.includes('winningCondition'), 'دليل اللعبة يغطي الفكرة وطريقة التحكم وشروط الفوز والتلميحات');

// 4. Verify main screens contain SectionExplanationCard
const screensToCheck = [
  'src/screens/HomeScreen.tsx',
  'src/screens/StartScreen.tsx',
  'src/screens/BreatheScreen.tsx',
  'src/screens/SelfDiscoveryScreen.tsx',
  'src/screens/ExploreScreen.tsx',
  'src/screens/GamesScreen.tsx',
  'src/screens/PracticeScreen.tsx',
  'src/screens/JourneyScreen.tsx',
  'src/screens/RescueScreen.tsx',
  'src/screens/SupportScreen.tsx',
  'src/screens/AssessmentScreen.tsx'
];

for (const screenPath of screensToCheck) {
  const fullPath = path.resolve(process.cwd(), screenPath);
  assert(fs.existsSync(fullPath), `وجود ملف الشاشة: ${screenPath}`);
  const content = fs.readFileSync(fullPath, 'utf-8');
  assert(content.includes('SectionExplanationCard'), `تضمين بطاقة شرح القسم في ${path.basename(screenPath)}`);
}

// 5. Verify game instruction integration in game modals
const cipherPath = path.resolve(process.cwd(), 'src/components/NesmatCipherModal.tsx');
const cipherContent = fs.readFileSync(cipherPath, 'utf-8');
assert(cipherContent.includes('GameInstructionsModal') && cipherContent.includes('طريقة اللعب'), 'تضمين زر ودليل طريقة اللعب في شفرة نسمة الكبرى');

const puzzlesPath = path.resolve(process.cwd(), 'src/components/RealPuzzlesModal.tsx');
const puzzlesContent = fs.readFileSync(puzzlesPath, 'utf-8');
assert(puzzlesContent.includes('GameInstructionsModal') && puzzlesContent.includes('طريقة اللعب'), 'تضمين زر ودليل طريقة اللعب في واحة الألغاز');

const fekerModalPath = path.resolve(process.cwd(), 'src/components/FekerAppModal.tsx');
const fekerContent = fs.readFileSync(fekerModalPath, 'utf-8');
assert(fekerContent.includes('GameInstructionsModal') && fekerContent.includes('طريقة اللعب'), 'تضمين زر ودليل طريقة اللعب في تطبيق فكّر المدمج');

// 6. Verify font size controls in ProfileScreen
const profilePath = path.resolve(process.cwd(), 'src/screens/ProfileScreen.tsx');
const profileContent = fs.readFileSync(profilePath, 'utf-8');
assert(profileContent.includes('17px (مريح)') && profileContent.includes('19px (واضح)') && profileContent.includes('21px (أكبر)'), 'توافق إعدادات الخط في الملف الشخصي مع المقاسات المعايرة');

console.log(`\n====================================================`);
console.log(`📊 النتيجة الإجمالية: نجح ${passedTests} من أصل ${totalTests} اختباراً بنسبة ${(passedTests / totalTests * 100).toFixed(0)}%! 🎉`);
console.log('====================================================');
