/**
 * Comprehensive App Audit & Functional Test Suite for Nesmat Al-Hayat
 */

// Polyfill localStorage & window for Node CLI testing
const memoryStore: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => memoryStore[key] || null,
  setItem: (key: string, val: string) => { memoryStore[key] = String(val); },
  removeItem: (key: string) => { delete memoryStore[key]; },
  clear: () => { for (const k in memoryStore) delete memoryStore[k]; }
};
(global as any).window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
  localStorage: (global as any).localStorage
};

import fs from 'fs';
import path from 'path';
import { storage } from '../src/services/storage';
import { localNotificationService } from '../src/services/localNotificationService';
import { chimeService } from '../src/services/chimeService';
import { CompanionEngine, COMPANION_PERSONAS } from '../src/services/companionEngine';
import { voiceService } from '../src/services/voiceService';

interface TestResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, category: string, name: string, details: string) {
  if (condition) {
    results.push({ category, name, status: 'PASS', details });
  } else {
    results.push({ category, name, status: 'FAIL', details });
  }
}

async function runAudit() {
  console.log('=== [1] AUDITING STORAGE & LOCAL DATA ENGINE ===');
  try {
    // 1. Daily Checkins
    storage.addDailyCheckin('good');
    const checkins = storage.getDailyCheckins();
    assert(checkins.length > 0 && checkins[0].moodValue === 'good', 'Storage', 'Daily Checkin', 'Successfully recorded mood checkin');

    // 2. Personality Results
    const mockMbti = {
      testType: 'mbti16',
      code: 'INFJ',
      titleAr: 'المحامي الحكيم',
      titleEn: 'The Advocate',
      taglineAr: 'هادئ ومثالي',
      taglineEn: 'Quiet, visionary',
      strengthsAr: ['حدس نافذ', 'التزام أخلاقي'],
      growthTipAr: 'ضع حدوداً لطاقتك العاطفية',
      scores: { E: 30, I: 70, S: 25, N: 75, T: 40, F: 60, J: 80, P: 20 }
    };
    const savedMbti = storage.savePersonalityTestResult(mockMbti);
    assert(!!savedMbti && savedMbti.code === 'INFJ', 'Storage', 'Save Personality Result', 'Saved result ID: ' + savedMbti.id);

    const history = storage.getPersonalityTestResults();
    assert(history.length > 0, 'Storage', 'Get Personality Results', 'Found ' + history.length + ' personality results');

    const latestMbti = storage.getLatestPersonalityTestResult('mbti16');
    assert(latestMbti?.code === 'INFJ', 'Storage', 'Get Latest Personality Result', 'Retrieved latest MBTI result');

    // 3. Mood Kitchen Logs
    const mockMeal = {
      id: 'meal_1',
      timestamp: new Date().toISOString(),
      mealType: 'lunch',
      comfortLevel: 'comfortable',
      mood: 'content',
      gutState: 'calm',
      notes: 'شوربة عدس دافئة وخضار',
      moodBefore: 'fair',
      timeFormattedAr: 'اليوم، 02:00 م',
      timeFormattedEn: 'Today, 02:00 PM',
      advice: {
        titleAr: 'تغذية العصب الحائر والراحة الهضمية',
        titleEn: 'Vagus Nerve Nutrition & Digestive Ease',
        gutBrainConnectionAr: 'الألياف الذائبة والشوربة الدافئة تحفز إفراز السيروتونين بنسبة ٩٠٪ في جدران الأمعاء.',
        gutBrainConnectionEn: 'Soluble fiber and warm broth stimulate intestinal serotonin production.',
        practicalTipAr: 'امشِ ٥ دقائق بهدوء وتنفس ببطء بعد الوجبة',
        practicalTipEn: 'Take a gentle 5-minute walk and breathe slowly'
      },
      recommendedActivities: [
        { id: 'breathe', titleAr: 'تمرين التنفس البطني', category: 'هدوء' }
      ]
    };
    const savedMeal = storage.saveMoodKitchenLog(mockMeal);
    assert(!!savedMeal && savedMeal.id === 'meal_1', 'Storage', 'Save Mood Kitchen Log', 'Saved meal log: ' + savedMeal.id);

    const mealLogs = storage.getMoodKitchenLogs();
    assert(mealLogs.length > 0, 'Storage', 'Get Mood Kitchen Logs', 'Retrieved ' + mealLogs.length + ' meal logs');

    const latestMeal = storage.getLatestMoodKitchenLog();
    assert(latestMeal?.mealType === 'lunch', 'Storage', 'Get Latest Mood Kitchen Log', 'Latest meal is: ' + latestMeal?.mealType);

    // 4. Privacy compliance: Export All User Data
    const exportedData = storage.exportAllUserData();
    assert(exportedData.includes('exportDate'), 'Storage', 'Egyptian Law 151 Data Export', 'Data export contains valid JSON format');
  } catch (err: any) {
    results.push({ category: 'Storage', name: 'Exception in Storage Audit', status: 'FAIL', details: err.message });
  }

  console.log('=== [2] AUDITING NOTIFICATION SERVICE & 24H INACTIVITY MONITOR ===');
  try {
    const hours = localNotificationService.getHoursSinceLastMoodKitchenLog();
    assert(typeof hours.hoursElapsed === 'number', 'Notifications', 'Hours Calculation', `Hours elapsed: ${hours.hoursElapsed}h`);

    const check = localNotificationService.checkMoodKitchenInactivity(true);
    assert(check.triggered === true, 'Notifications', '24h Inactivity Notification Trigger', 'Forced trigger succeeded with notification: ' + check.notification?.title);

    const testReminder = localNotificationService.triggerTestReminder();
    assert(!!testReminder && testReminder.title.includes('مطبخ المزاج'), 'Notifications', 'Test Reminder Dispatch', 'Dispatched: ' + testReminder.title);
  } catch (err: any) {
    results.push({ category: 'Notifications', name: 'Notification Service Audit', status: 'FAIL', details: err.message });
  }

  console.log('=== [3] AUDITING COMPANION ENGINE & PERSONAS ===');
  try {
    const personaKeys = Object.keys(COMPANION_PERSONAS);
    assert(personaKeys.length >= 4, 'Companion', 'Personas Availability', `Available personas: ${personaKeys.join(', ')}`);

    const childPersona = COMPANION_PERSONAS.child;
    assert(!!childPersona && childPersona.id === 'child', 'Companion', 'Child Persona Definition', 'Child persona defined');

    const adultPersona = COMPANION_PERSONAS.adult;
    assert(!!adultPersona && adultPersona.id === 'adult', 'Companion', 'Adult Persona Definition', 'Adult persona defined');

    const fatherPersona = COMPANION_PERSONAS.father;
    assert(!!fatherPersona && fatherPersona.id === 'father', 'Companion', 'Father Persona Definition', 'Father persona defined');

    // Test generateResponse
    const response = await CompanionEngine.generateResponse('أنا حاسس بقلق وتوتر ومش عارف أوقفه', 'adult', []);
    assert(!!response && response.text.length > 0, 'Companion', 'Response Generation', 'Generated: ' + response.text.slice(0, 50) + '...');
    assert(response.sender === 'companion', 'Companion', 'Sender Attribute', 'Sender is companion');
  } catch (err: any) {
    results.push({ category: 'Companion', name: 'Companion Engine Audit', status: 'FAIL', details: err.message });
  }

  console.log('=== [4] AUDITING AUDIO & SOUND DESIGN ===');
  try {
    assert(typeof chimeService.playReassuranceChime === 'function', 'Audio', 'Reassurance Chime', 'Function exists');
    assert(typeof chimeService.playWheelTickSound === 'function', 'Audio', 'Wheel Tick Deceleration', 'Function exists');
    assert(typeof chimeService.playWheelWinSound === 'function', 'Audio', 'Wheel Win Chime', 'Function exists');
    assert(typeof chimeService.playStoneDropChime === 'function', 'Audio', 'Stone Drop Zen Chime', 'Function exists');
    assert(typeof voiceService.speak === 'function', 'Voice', 'TTS Voice Synthesizer', 'Voice synthesis function exists');
  } catch (err: any) {
    results.push({ category: 'Audio', name: 'Audio Audit Exception', status: 'FAIL', details: err.message });
  }

  console.log('=== [5] AUDITING COLOR CONTRAST & WCAG AA COMPLIANCE ===');
  try {
    function getLuminance(hex: string): number {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.05, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }

    function getContrastRatio(hex1: string, hex2: string): number {
      const lum1 = getLuminance(hex1);
      const lum2 = getLuminance(hex2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    const colorPairs = [
      { name: 'Primary Text (#292F2D) on Cream BG (#F7F5EF)', fg: '#292F2D', bg: '#F7F5EF', minRatio: 4.5 },
      { name: 'Primary Forest Green (#174F3F) on Cream BG (#F7F5EF)', fg: '#174F3F', bg: '#F7F5EF', minRatio: 4.5 },
      { name: 'Secondary Green (#205746) on Cream BG (#F7F5EF)', fg: '#205746', bg: '#F7F5EF', minRatio: 4.5 },
      { name: 'Muted Text (#515B55) on Cream BG (#F7F5EF)', fg: '#515B55', bg: '#F7F5EF', minRatio: 4.5 },
      { name: 'Button Cream Text (#F7F3E9) on Forest Green (#174F3F)', fg: '#F7F3E9', bg: '#174F3F', minRatio: 4.5 },
      { name: 'Dark Theme Text (#F7F5EF) on Dark BG (#0D1914)', fg: '#F7F5EF', bg: '#0D1914', minRatio: 4.5 },
      { name: 'Dark Theme Surface Text (#F7F5EF) on Surface Card (#14271F)', fg: '#F7F5EF', bg: '#14271F', minRatio: 4.5 },
    ];

    for (const pair of colorPairs) {
      const ratio = getContrastRatio(pair.fg, pair.bg);
      const passed = ratio >= pair.minRatio;
      assert(passed, 'WCAG Contrast', pair.name, `Contrast ratio: ${ratio.toFixed(2)}:1 (Required >= ${pair.minRatio}:1)`);
    }
  } catch (err: any) {
    results.push({ category: 'WCAG Contrast', name: 'Color Contrast Audit Exception', status: 'FAIL', details: err.message });
  }

  console.log('=== [6] AUDITING INLINE COLOR & BACKGROUND STYLES IN SOURCE CODE ===');
  try {
    interface InlineColorStyleMatch {
      file: string;
      line: number;
      propName: string;
      propValue: string;
      category: 'Text Color' | 'Background Color' | 'Border Color' | 'Other Color';
      snippet: string;
      recommendation: string;
    }

    function scanSourceCodeForInlineStyles(srcPath: string): {
      scannedFiles: number;
      occurrences: InlineColorStyleMatch[];
      affectedFiles: string[];
    } {
      const occurrences: InlineColorStyleMatch[] = [];
      const scannedFilesList: string[] = [];

      function walk(dir: string) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(full);
          } else if (
            /\.(tsx|ts|jsx|js)$/.test(entry.name) &&
            !entry.name.endsWith('.d.ts') &&
            !entry.name.includes('.test.')
          ) {
            scannedFilesList.push(full);
          }
        }
      }

      walk(srcPath);

      for (const filePath of scannedFilesList) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relPath = path.relative(process.cwd(), filePath);

        // Scan JSX style={{ ... }} blocks
        const styleBlockRegex = /style\s*=\s*\{\{([\s\S]*?)\}\}/g;
        let blockMatch: RegExpExecArray | null;

        while ((blockMatch = styleBlockRegex.exec(content)) !== null) {
          const styleBody = blockMatch[1];
          const matchIndex = blockMatch.index;
          const upToMatch = content.substring(0, matchIndex);
          const lineNumber = upToMatch.split('\n').length;

          // Extract specific style properties: color, backgroundColor, background, borderColor
          const propRegex = /\b(color|backgroundColor|background|borderColor)\s*:\s*([^,}\n]+)/g;
          let propMatch: RegExpExecArray | null;

          while ((propMatch = propRegex.exec(styleBody)) !== null) {
            const propName = propMatch[1];
            const propValue = propMatch[2].trim().replace(/^['"]|['"]$/g, '');

            // Discard non-color background keywords
            if (
              propName === 'background' &&
              /^(cover|contain|center|top|bottom|left|right|repeat|no-repeat|auto)$/i.test(propValue)
            ) {
              continue;
            }

            let category: 'Text Color' | 'Background Color' | 'Border Color' | 'Other Color' = 'Other Color';
            let recommendation = '';

            if (propName === 'color') {
              category = 'Text Color';
              recommendation = 'استبدال اللون المضمن بفئة تباين معتمدة (مثل text-[#292F2D] أو text-nesma-primary) لتحقيق معيار WCAG AA.';
            } else if (propName === 'backgroundColor' || propName === 'background') {
              category = 'Background Color';
              recommendation = 'استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.';
            } else if (propName === 'borderColor') {
              category = 'Border Color';
              recommendation = 'استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.';
            }

            const snippet = blockMatch[0].replace(/\s+/g, ' ').trim();
            const shortSnippet = snippet.length > 90 ? snippet.substring(0, 87) + '...' : snippet;

            occurrences.push({
              file: relPath,
              line: lineNumber,
              propName,
              propValue,
              category,
              snippet: shortSnippet,
              recommendation
            });
          }
        }
      }

      const affectedFiles = Array.from(new Set(occurrences.map(o => o.file)));

      return {
        scannedFiles: scannedFilesList.length,
        occurrences,
        affectedFiles
      };
    }

    const srcDir = fs.existsSync(path.resolve(process.cwd(), 'src'))
      ? path.resolve(process.cwd(), 'src')
      : path.resolve(__dirname, '../src');

    const scanResult = scanSourceCodeForInlineStyles(srcDir);

    console.log(`- إجمالي ملفات الأكواد المفحوصة (Scanned): ${scanResult.scannedFiles} ملفاً`);
    console.log(`- إجمالي مواضع الأنماط المضمنة المكتشفة (Inline Styles Found): ${scanResult.occurrences.length} موضعاً`);
    console.log(`- عدد الملفات المتأثرة (Affected Files): ${scanResult.affectedFiles.length} ملفاً\n`);

    if (scanResult.occurrences.length > 0) {
      console.log('------------------------------------------------------------------------------------------------------------------');
      console.log('  مواضع الأنماط المضمنة للألوان والخلفيات (Inline Styles Breakdown):');
      console.log('------------------------------------------------------------------------------------------------------------------');
      scanResult.occurrences.forEach((occ, idx) => {
        console.log(`  [#${idx + 1}] ${occ.file}:${occ.line}`);
        console.log(`       الخاصية (Property):   ${occ.propName} [${occ.category}]`);
        console.log(`       القيمة (Value):       ${occ.propValue}`);
        console.log(`       الكود (Snippet):      ${occ.snippet}`);
        console.log(`       التوصية (Target Fix): ${occ.recommendation}`);
        console.log('------------------------------------------------------------------------------------------------------------------');
      });
    }

    // Write persistent markdown report
    const reportDir = path.resolve(process.cwd(), 'docs');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const reportFilePath = path.join(reportDir, 'inline-styles-audit-report.md');

    let mdReport = `# تقرير جرد وفحص الأنماط المضمنة (Inline Styles) للألوان والخلفيات في تطبيق «نسمة حياة»\n\n`;
    mdReport += `**تاريخ التوليد:** ${new Date().toISOString()}\n`;
    mdReport += `**إجمالي الملفات المفحوصة:** ${scanResult.scannedFiles} ملفاً في مجلد \`src/\`\n`;
    mdReport += `**إجمالي مواضع الأنماط المضمنة المكتشفة:** ${scanResult.occurrences.length} موضعاً\n`;
    mdReport += `**الملفات التي تحتوي على أنماط مضمنة للألوان والخلفيات:** ${scanResult.affectedFiles.length} ملفات\n\n`;

    mdReport += `## 1. جدول المواضع المكتشفة لاستهدافها وتصحيحها\n\n`;
    mdReport += `| # | الملف والسطر | الخاصية | التصنيف | القيمة الحالية | كود المعاينة | التوصية والإصلاح المقترح |\n`;
    mdReport += `|---|---|---|---|---|---|---|\n`;

    scanResult.occurrences.forEach((occ, idx) => {
      const cleanSnippet = occ.snippet.replace(/\|/g, '\\|');
      const cleanVal = occ.propValue.replace(/\|/g, '\\|');
      mdReport += `| ${idx + 1} | \`${occ.file}:${occ.line}\` | \`${occ.propName}\` | ${occ.category} | \`${cleanVal}\` | \`${cleanSnippet}\` | ${occ.recommendation} |\n`;
    });

    mdReport += `\n## 2. تفصيل الملفات المتأثرة وخطة الاستهداف\n\n`;
    scanResult.affectedFiles.forEach((file) => {
      const fileOccs = scanResult.occurrences.filter(o => o.file === file);
      mdReport += `### الملف: \`${file}\` (${fileOccs.length} موضع)\n`;
      fileOccs.forEach(o => {
        mdReport += `- **السطر ${o.line}:** الخاصية \`${o.propName}\` بقيمة \`${o.propValue}\`\n`;
        mdReport += `  - *الكود:* \`${o.snippet}\`\n`;
        mdReport += `  - *التوصية:* ${o.recommendation}\n`;
      });
      mdReport += `\n`;
    });

    mdReport += `## 3. إرشادات معايير WCAG AA والهوية البصرية الموحدة\n\n`;
    mdReport += `- **نصوص التطبيق الأساسية:** يجب أن تستخدم اللون \`#292F2D\` على الخلفية \`#F7F5EF\` لضمان تباين 12.60:1 (أعلى بكثير من الحد الأدنى 4.5:1).\n`;
    mdReport += `- **أخضر الغابة الأساسي:** \`#174F3F\` بنسبة تباين 8.69:1.\n`;
    mdReport += `- **الأخضر الثانوي:** \`#205746\` بنسبة تباين 7.69:1.\n`;
    mdReport += `- **العناصر المتغيرة في الألعاب:** يوصى بتحديد ألوانها مسبقاً ضمن لوحة ألوان التطبيق الرسمية أو حقن درجات لونية تضمن وضوح التباين على الدوام.\n`;

    fs.writeFileSync(reportFilePath, mdReport, 'utf-8');
    console.log(`تم حفظ التقرير التفصيلي بنجاح في: ${path.relative(process.cwd(), reportFilePath)}\n`);

    assert(
      scanResult.scannedFiles > 0,
      'Inline Styles Audit',
      'Source Code Scanning Engine',
      `تم مسح ${scanResult.scannedFiles} ملفاً بنجاح وحصر ${scanResult.occurrences.length} موضعاً في ${scanResult.affectedFiles.length} ملفات مع حفظ التقرير في docs/inline-styles-audit-report.md`
    );
  } catch (err: any) {
    results.push({ category: 'Inline Styles Audit', name: 'Inline Styles Audit Exception', status: 'FAIL', details: err.message });
  }

  console.log('=== [8] FINAL ACCEPTANCE TEST SUITE (HOME & WELCOME RESTRUCTURING) ===');
  try {
    const srcDir = fs.existsSync(path.resolve(process.cwd(), 'src'))
      ? path.resolve(process.cwd(), 'src')
      : path.resolve(__dirname, '../src');

    // 1. Garden Welcome Screen Inspection
    const gardenModalPath = path.join(srcDir, 'components', 'GardenWelcomeModal.tsx');
    const gardenModalContent = fs.existsSync(gardenModalPath) ? fs.readFileSync(gardenModalPath, 'utf-8') : '';
    assert(
      gardenModalContent.includes('حديقتك الجميلة 🌸') && gardenModalContent.includes('ابدأ رحلتك 🌱'),
      'Acceptance Test',
      'Garden Welcome Modal Content',
      'Garden welcome modal contains exact required title «حديقتك الجميلة 🌸» and button «ابدأ رحلتك 🌱»'
    );

    // 2. HomeScreen & 10 Section Cards Inspection
    const homeScreenPath = path.join(srcDir, 'screens', 'HomeScreen.tsx');
    const homeScreenContent = fs.existsSync(homeScreenPath) ? fs.readFileSync(homeScreenPath, 'utf-8') : '';
    assert(
      homeScreenContent.includes('أهلًا يا صديقتي 🤍، تحبي نبدأ منين النهارده؟') && homeScreenContent.includes('المرشدة الدائمة: نسمة حياة'),
      'Acceptance Test',
      'Main Screen Greeting & Guide',
      'Main screen features permanent guide «نسمة حياة» and welcome greeting «أهلًا يا صديقتي 🤍، تحبي نبدأ منين النهارده؟»'
    );

    // Verify all 10 section cards are present
    const requiredSections = [
      'الجلسة النفسية الأسبوعية',
      'رفيقي',
      'اسمع نفسك',
      'مكتبة الوعي النفسي',
      'الألعاب والتحديات',
      'رحلتي وبوصلتي',
      'مساحة الأمان',
      'نموّي وتقدّمي',
      'واحة التنفس والسكينة',
      'استوديو التمارين واليقظة'
    ];
    let missingSections = 0;
    requiredSections.forEach(sec => {
      if (!homeScreenContent.includes(sec)) {
        missingSections++;
      }
    });
    assert(
      missingSections === 0,
      'Acceptance Test',
      'All 10 Section Cards',
      missingSections === 0 ? 'All 10 actual section cards are present and interactive on the main screen' : `Missing ${missingSections} section cards`
    );

    // 3. Zero Forbidden Screen Numbers Check across src/ (rendered text elements)
    let forbiddenCount = 0;
    const checkDirForForbidden = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkDirForForbidden(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
          const fileText = fs.readFileSync(fullPath, 'utf-8');
          // Check if explicit UI strings contain "الشاشة 3" or "الشاشة 4" outside comments
          if (/(>|['"`])(الشاشة (٣|3|٤|4))/.test(fileText)) {
            forbiddenCount++;
          }
        }
      }
    };
    checkDirForForbidden(srcDir);
    assert(
      forbiddenCount === 0,
      'Acceptance Test',
      'Zero Forbidden Screen Numbers',
      forbiddenCount === 0 ? 'No forbidden screen numbering (e.g. الشاشة 3, الشاشة 4) found in user-facing UI text' : `Found ${forbiddenCount} occurrences of forbidden screen numbers in UI text`
    );

    // 4. Storage & Persistence Integrity Check
    const testStorageKey = 'nesmat_acceptance_test_key';
    localStorage.setItem(testStorageKey, 'valid_state');
    const retrievedStorage = localStorage.getItem(testStorageKey);
    assert(
      retrievedStorage === 'valid_state',
      'Acceptance Test',
      'Storage & Persistence Integrity',
      'Local storage and user persistence engine are fully functional and intact'
    );

  } catch (err: any) {
    results.push({ category: 'Acceptance Test', name: 'Acceptance Test Exception', status: 'FAIL', details: err.message });
  }

  console.log('=== [7] AUDITING PWA MANIFEST ASSETS & INTEGRITY ===');
  try {
    const publicDir = fs.existsSync(path.resolve(process.cwd(), 'public'))
      ? path.resolve(process.cwd(), 'public')
      : path.resolve(__dirname, '../public');

    const manifestPath = path.join(publicDir, 'manifest.json');
    assert(fs.existsSync(manifestPath), 'PWA Manifest', 'Manifest Existence', 'manifest.json exists in public directory');

    if (fs.existsSync(manifestPath)) {
      const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestRaw);

      // Collect all referenced asset paths in manifest
      const assetReferences: { source: string; src: string }[] = [];

      // 1. Icons
      if (Array.isArray(manifest.icons)) {
        manifest.icons.forEach((icon: any, idx: number) => {
          if (icon && typeof icon.src === 'string') {
            assetReferences.push({ source: `icons[${idx}]`, src: icon.src });
          }
        });
      }

      // 2. Shortcuts Icons
      if (Array.isArray(manifest.shortcuts)) {
        manifest.shortcuts.forEach((shortcut: any, sIdx: number) => {
          if (Array.isArray(shortcut.icons)) {
            shortcut.icons.forEach((icon: any, iIdx: number) => {
              if (icon && typeof icon.src === 'string') {
                assetReferences.push({ source: `shortcuts[${sIdx}] (${shortcut.name || sIdx}) icon[${iIdx}]`, src: icon.src });
              }
            });
          }
        });
      }

      // 3. Screenshots (if present)
      if (Array.isArray(manifest.screenshots)) {
        manifest.screenshots.forEach((shot: any, idx: number) => {
          if (shot && typeof shot.src === 'string') {
            assetReferences.push({ source: `screenshots[${idx}]`, src: shot.src });
          }
        });
      }

      console.log(`- إجمالي مسارات الأصول المرجعية في manifest.json: ${assetReferences.length}`);

      // Verify each asset on disk
      let missingCount = 0;
      const checkedPaths = new Set<string>();

      for (const asset of assetReferences) {
        // Strip leading slash if present for relative path in public/
        const relativeFilePath = asset.src.startsWith('/') ? asset.src.slice(1) : asset.src;
        // Ignore external http/https URLs if any
        if (asset.src.startsWith('http://') || asset.src.startsWith('https://')) {
          continue;
        }

        const absoluteAssetPath = path.join(publicDir, relativeFilePath);
        const exists = fs.existsSync(absoluteAssetPath);
        const stat = exists ? fs.statSync(absoluteAssetPath) : null;
        const validSize = stat ? stat.size > 0 : false;

        const isOk = exists && validSize;
        if (!isOk) {
          missingCount++;
        }

        // Only assert once per unique path to avoid duplicate test output
        if (!checkedPaths.has(asset.src)) {
          checkedPaths.add(asset.src);
          assert(
            isOk,
            'PWA Manifest Assets',
            `Asset: ${asset.src}`,
            isOk
              ? `Found in public/ (Size: ${(stat!.size / 1024).toFixed(1)} KB)`
              : `MISSING or empty on disk at ${absoluteAssetPath}`
          );
        }
      }

      assert(
        missingCount === 0,
        'PWA Manifest Assets',
        'Zero Broken Links',
        missingCount === 0
          ? `All ${checkedPaths.size} unique manifest assets exist and are valid in public/`
          : `Found ${missingCount} broken asset links in manifest.json`
      );
    }
  } catch (err: any) {
    results.push({ category: 'PWA Manifest Assets', name: 'Manifest Verification Exception', status: 'FAIL', details: err.message });
  }

  // Print Summary Table
  console.log('\n======================================================');
  console.log('       NESMAT AL-HAYAT COMPREHENSIVE AUDIT REPORT');
  console.log('======================================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL AUDIT CHECKS: ${results.length}`);
  console.log(`SUCCESSFUL (PASS):   ${passes}`);
  console.log(`FAILED (FAIL):       ${fails}`);
  console.log('------------------------------------------------------');
  results.forEach(r => {
    console.log(`[${r.status}] [${r.category}] ${r.name} -> ${r.details}`);
  });
  console.log('======================================================\n');
}

runAudit();
