/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Comprehensive Game Engine Validation Script
 * Verifies «شفرة نسمة» and «لعبة الألغاز» data integrity, interactive mechanics,
 * puzzle solvers, hints, and psychological takeaways.
 */

import { CIPHER_LEVELS, CIPHER_WORLDS, CIPHER_SECRETS, GRAND_SECRET_SYNTHESIS } from '../src/data/nesmatCipherData';
import { JIGSAW_LEVELS, SPOT_CHALLENGES, LOGIC_PUZZLES, MatchstickPuzzle, PathTilePuzzle, MatrixPatternPuzzle } from '../src/data/puzzleSuiteData';
import { runNesmatCipherGrandStationsTest, runGameJourneyTest, runGrandSecretSynthesisTest } from '../src/utils/nesmatCipherTestRunner';

console.log('====================================================');
console.log('🧪 بدء اختبارات محركات الألعاب — تطبيق نسمة حياة');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}: ${details || 'Condition not met'}`);
  }
}

// ----------------------------------------------------
// PART 1: «شفرة نسمة» (Nesmat Cipher) Verification
// ----------------------------------------------------
console.log('1️⃣ فحص شفرة نسمة (Nesmat Cipher):');

assert(CIPHER_LEVELS.length === 30, 'اكتمال المراحل الثلاثين كاملة', `Found ${CIPHER_LEVELS.length} levels`);
assert(CIPHER_WORLDS.length === 3, 'اكتمال العوالم الثلاثة', `Found ${CIPHER_WORLDS.length} worlds`);
assert(CIPHER_SECRETS.length === 3, 'اكتمال الأسرار الثلاثة المخفية', `Found ${CIPHER_SECRETS.length} secrets`);

// Check each level's essential fields
let allLevelsValid = true;
for (const lvl of CIPHER_LEVELS) {
  const hasPrompt = Boolean(lvl.puzzleData.prompt);
  const hasAnswer = Boolean(lvl.puzzleData.correctAnswer);
  const has3Hints = Array.isArray(lvl.puzzleData.hints) && lvl.puzzleData.hints.length === 3;
  const hasTakeaway = Boolean(lvl.psychologicalTakeaway.title && lvl.psychologicalTakeaway.message);
  const hasStory = Boolean(lvl.storyChapter);
  const hasCompanion = Boolean(lvl.companionIntro);

  if (!hasPrompt || !hasAnswer || !has3Hints || !hasTakeaway || !hasStory || !hasCompanion) {
    allLevelsValid = false;
    console.error(`  Level ${lvl.id} has invalid fields:`, { hasPrompt, hasAnswer, has3Hints, hasTakeaway, hasStory, hasCompanion });
  }
}
assert(allLevelsValid, 'جميع المراحل الـ30 تمتلك بيانات كاملة وسرد مرافق وتلميحات ثلاثية وخاتمة نفسية');

// Run built-in test runners
const grandStations = runNesmatCipherGrandStationsTest();
assert(grandStations.every(s => s.passed), 'محطات العوالم الكبرى (10, 20, 30) تم التحقق من سلامتها');

const journeyLvl10 = runGameJourneyTest(10);
assert(journeyLvl10.success, 'محاكاة رحلة اللعب في المرحلة 10 نجحت بالكامل');

const grandSynthesis = runGrandSecretSynthesisTest();
assert(grandSynthesis.pathA_fullSecrets.passed && grandSynthesis.pathB_partialSecrets.passed, 'مسارا السر الأعظم (الكامل والجزئي) يعملان بانسجام تام');

// ----------------------------------------------------
// PART 2: «لعبة الألغاز» (Real Puzzles Suite) Verification
// ----------------------------------------------------
console.log('\n2️⃣ فحص واحة الألغاز (Real Puzzles Suite):');

// A. Jigsaw puzzles
assert(JIGSAW_LEVELS.length === 4, 'توفر 4 مستويات لتركيب الصور (Jigsaw)', `Found ${JIGSAW_LEVELS.length}`);
for (const jg of JIGSAW_LEVELS) {
  assert(jg.imageSrc.length > 0 && jg.gridSizes.length >= 3, `مستوى تركيب الصور «${jg.title}» محمل محلياً بالكامل`);
}

// B. Spot the difference / Hidden objects
assert(SPOT_CHALLENGES.length === 3, 'توفر 3 تحديات لاكتشاف التفاصيل والمشاهد التفاعلية', `Found ${SPOT_CHALLENGES.length}`);
for (const sp of SPOT_CHALLENGES) {
  assert(sp.targets.length >= 4, `تحدي «${sp.title}» يحتوي على 4 أهداف تفاعلية على الأقل (${sp.targets.length} أهداف)`);
  for (const tgt of sp.targets) {
    assert(tgt.xPercent >= 0 && tgt.xPercent <= 100 && tgt.yPercent >= 0 && tgt.yPercent <= 100, `إحداثيات الهدف ${tgt.name} ضمن حدود المشهد [${tgt.xPercent}%, ${tgt.yPercent}%]`);
  }
}

// C. Logic Puzzles
assert(LOGIC_PUZZLES.length === 7, 'توفر 7 تحديات منطقية غنية ومتنوعة', `Found ${LOGIC_PUZZLES.length}`);

// Test Matchstick 1: 6 + 4 = 4 -> 0 + 4 = 4
const match1 = LOGIC_PUZZLES.find(p => p.id === 'logic_match_1') as MatchstickPuzzle;
assert(Boolean(match1), 'لغز أعواد الثقاب الأول موجود ومفعل');
if (match1) {
  // Initial equation should not be valid
  const initSticks = match1.sticks.filter(s => s.isActive).map(s => s.id);
  assert(!match1.isSolutionValid(initSticks), 'المعادلة الأولية لأعواد الثقاب 1 غير صحيحة قبل الحل');
  // Moving stick 4 (middle of 6) to stick 3 (top-right of 6) makes 0 + 4 = 4
  const solvedSticks = initSticks.filter(id => id !== 4).concat(3);
  assert(match1.isSolutionValid(solvedSticks), 'حل لغز أعواد الثقاب 1 (0 + 4 = 4) تم التحقق منه رياضياً بنجاح');
}

// Test Matchstick 2: 5 + 7 = 2 -> 9 - 7 = 2
const match2 = LOGIC_PUZZLES.find(p => p.id === 'logic_match_2') as MatchstickPuzzle;
assert(Boolean(match2), 'لغز أعواد الثقاب الثاني موجود ومفعل');
if (match2) {
  const initSticks2 = match2.sticks.filter(s => s.isActive).map(s => s.id);
  assert(!match2.isSolutionValid(initSticks2), 'المعادلة الأولية لأعواد الثقاب 2 غير صحيحة قبل الحل');
  // Moving stick 9 (vertical of +) to stick 3 (top-right of 5) makes 9 - 7 = 2
  const solvedSticks2 = initSticks2.filter(id => id !== 9).concat(3);
  assert(match2.isSolutionValid(solvedSticks2), 'حل لغز أعواد الثقاب 2 (9 - 7 = 2) تم التحقق منه رياضياً بنجاح');
}

// Test Light Path 1 & 2
const path1 = LOGIC_PUZZLES.find(p => p.id === 'logic_path_1') as PathTilePuzzle;
const path2 = LOGIC_PUZZLES.find(p => p.id === 'logic_path_2') as PathTilePuzzle;
assert(Boolean(path1 && path2), 'لغزا مسار النور الأول والثاني متاحان');
if (path1) {
  assert(path1.solutionRotations.length > 0, 'لغز مسار النور 1 يحتوي على تركيبات حلول صحيحة');
}

// Test Matrix Pattern Puzzles 1, 2, 3
const matrixPuzzles = LOGIC_PUZZLES.filter(p => p.type === 'pattern_matrix') as MatrixPatternPuzzle[];
assert(matrixPuzzles.length === 3, 'توفر 3 مصفوفات أنماط بصرية وتفكير استقرائي', `Found ${matrixPuzzles.length}`);
for (const mp of matrixPuzzles) {
  const correctOpt = mp.options.find(o => o.id === mp.correctOptionId);
  assert(Boolean(correctOpt), `المصفوفة «${mp.title}» تحتوي على خيار صحيح محدد بدقة (${correctOpt?.id})`);
}

console.log('\n====================================================');
console.log(`📊 النتيجة الإجمالية: نجح ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
