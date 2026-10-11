import { CompanionEngine, normalizeArabicText } from '../src/services/companionEngine';
import { CompanionPersona, CompanionMessage } from '../src/types/companion';

// Polyfill localStorage if needed in Node
const mockStorage: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => { mockStorage[key] = val; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
    failed++;
  }
}

async function runAcceptanceTests() {
  console.log('================================================================');
  console.log('🧪 بدء اختبار قبول رفيقي بعد إعادة تصميم التجربة — نسمة حياة');
  console.log('================================================================\n');

  // ---------------------------------------------------------
  // الاختبار 1: تجربة الدخول (Entry Experience)
  // ---------------------------------------------------------
  console.log('📋 أولًا: تجربة الدخول وواجهة البداية');
  
  // التحقق من ترحيب وضع البالغ
  const adultWelcome = CompanionEngine.getWelcomeMessage('adult');
  assert(!!adultWelcome.text && adultWelcome.text.includes('نسمة حياة'), 'رسالة ترحيب البالغ متوفرة وتذكر نسمة حياة برفق');
  assert(adultWelcome.expression === 'welcome', 'التعبير البصري للبداية هو welcome');
  assert(Array.isArray(adultWelcome.suggestedActions) && adultWelcome.suggestedActions.length > 0, 'وجود خطوات استكشاف مقترحة بالترحيب');

  // التحقق من ترحيب وضع الطفل الداخلي
  const childWelcome = CompanionEngine.getWelcomeMessage('child');
  assert(!!childWelcome.text && childWelcome.text.includes('طفلك الداخلي'), 'رسالة ترحيب الطفل الداخلي دافئة وتوضح مساحة الأمان');

  // ---------------------------------------------------------
  // الاختبار 2: اختيار المنظور والتبديل دون فقدان السياق
  // ---------------------------------------------------------
  console.log('\n📋 ثانيًا: اختيار المنظور وتبديل «صورتي الآن» و«طفلي الداخلي»');
  
  // اختبار استجابة البالغ مقابل استجابة الطفل لنفس المدخل
  const testInput = 'أنا خايف من بكرة ومش عارف أركز';
  const historyBase: CompanionMessage[] = [adultWelcome];
  
  const adultResp = await CompanionEngine.generateResponse(testInput, 'adult', historyBase);
  const childResp = await CompanionEngine.generateResponse(testInput, 'child', historyBase);

  assert(adultResp.text !== childResp.text, 'الردود تتغير موضوعياً وأسلوبياً بين وضعي البالغ والطفل');
  assert(
    adultResp.text.includes('خطوة') || adultResp.text.includes('تفكير') || adultResp.text.includes('نفس') || adultResp.text.includes('طبيعي'),
    'رد البالغ يتسم بالاتزان النفسي وتفكيك الأفكار الواقعية'
  );
  assert(
    childResp.text.includes('جنبك') || childResp.text.includes('حنية') || childResp.text.includes('أمان') || childResp.text.includes('قلب'),
    'رد الطفل الداخلي يتسم بالاحتواء والدفء والحنان العاطفي'
  );

  // اختبار الحفاظ على السياق عند تبديل المنظور
  const ongoingHistory: CompanionMessage[] = [
    adultWelcome,
    { id: 'u1', sender: 'user', text: 'أنا مضغوط جداً في شغلي ومخنوق', timestamp: Date.now() },
    adultResp
  ];
  CompanionEngine.saveHistory(ongoingHistory);
  const retrievedHistory = CompanionEngine.getHistory();
  assert(retrievedHistory.length === 3, 'تاريخ المحادثة محفوظ بدقة دون فقدان');
  assert(retrievedHistory[1].text === 'أنا مضغوط جداً في شغلي ومخنوق', 'نص المستخدم محفوظ في السياق');

  // ---------------------------------------------------------
  // الاختبار 3: فهم الحوار (Conversation Comprehension)
  // ---------------------------------------------------------
  console.log('\n📋 ثالثًا: فهم الحوار وتنوع مقاصد المستخدم');

  // 3.1 إجابات قصيرة بعد رسالة سابقة: «آه»
  const shortYesResp = await CompanionEngine.generateResponse('اه', 'adult', ongoingHistory);
  assert(
    shortYesResp.text.includes('مفهوم') || shortYesResp.text.includes('وضوحك') || shortYesResp.text.includes('المسافة'),
    'استيعاب الإجابة القصيرة التأكيدية «اه» دون طلب إعادة الكلام'
  );

  // 3.2 إجابة قصيرة تفيد عدم اليقين: «مش عارف»
  const shortUncertainResp = await CompanionEngine.generateResponse('مش عارف', 'adult', ongoingHistory);
  assert(
    shortUncertainResp.text.includes('عدم اليقين') || shortUncertainResp.text.includes('التشوش') || shortUncertainResp.text.includes('طبيعي'),
    'استيعاب «مش عارف» باحتواء وعدم فرض ضغوط استجواب'
  );

  // 3.3 إجابة قصيرة تفيد الإرهاق: «تعبان»
  const shortTiredResp = await CompanionEngine.generateResponse('تعبان', 'adult', ongoingHistory);
  assert(
    shortTiredResp.text.includes('الثقل') || shortTiredResp.text.includes('التعب') || shortTiredResp.text.includes('الراحة'),
    'استيعاب «تعبان» كإشارة احتياج للراحة وعدم تحميل أعباء إضافية'
  );

  // 3.4 طلب التثقيف النفسي
  const learnResp = await CompanionEngine.generateResponse('عايز أقرأ وأفهم عن الصحة النفسية والمكتبة', 'adult', ongoingHistory);
  assert(
    learnResp.text.includes('التثقيف') || learnResp.text.includes('مكتبة') || learnResp.text.includes('كتيب'),
    'توجيه المستخدم لمكتبة التثقيف والكتيب عند طلب المعرفة'
  );
  assert(
    !!learnResp.suggestedActions?.some(a => a.target === 'explore' || a.target === 'booklet'),
    'اقتراح أدوات التثقيف في الخطوات السريعة'
  );

  // 3.5 الفرفشة والترويح
  const funResp = await CompanionEngine.generateResponse('عايز أضحك أو ألعب لعبة خفيفة', 'child', ongoingHistory);
  assert(
    !!funResp.suggestedActions?.some(a => a.target === 'feker' || a.target === 'nesma_laughs' || a.target === 'fun_games'),
    'اقتراح ألعاب نسمة واستراحة الضحك عند طلب الترويح'
  );

  // 3.6 طلب النصيحة العملية (المذاكرة / خطوة واحدة محددة)
  const studyAdviceResp = await CompanionEngine.generateResponse('مش عارف أركز في المذاكرة، أعمل إيه دلوقتي؟', 'adult', ongoingHistory);
  assert(
    studyAdviceResp.text.includes('اختار جزءًا صغيرًا من أول مهمة') && studyAdviceResp.text.includes('مؤقتًا لخمس دقائق'),
    'تقديم خطوة واحدة محددة وقابلة للتنفيذ عند السؤال: «مش عارف أركز في المذاكرة، أعمل إيه دلوقتي؟»'
  );
  assert(
    studyAdviceResp.text.includes('مش مطلوب تخلّص كل حاجة دلوقتي'),
    'التأكيد على عدم اشتراط إنهاء كل شيء لكسر مقاومة الدماغ'
  );

  // 3.7 الفضفضة دون نصيحة غير مطلوبة
  const ventingResp = await CompanionEngine.generateResponse('مخنوق وعايز افضفض بس ومحدش يقاطعني ولا ينصحني', 'adult', ongoingHistory);
  assert(
    ventingResp.text.includes('كامل الإنصات') || ventingResp.text.includes('لن أقدم لك أي نصائح غير مطلوبة') || ventingResp.text.includes('أستمع إليك فقط'),
    'استجابة الفضفضة: إنصات كامل واحتواء دون تقديم نصائح غير مطلوبة'
  );

  // 3.8 الفهم والتفسير النفسي المبسط الدقيق («ليه بحس بكده؟»)
  const insightResp = await CompanionEngine.generateResponse('هو أنا ليه دايمًا متوتر وبحس بخوف؟', 'adult', ongoingHistory);
  assert(
    insightResp.text.includes('استجابة فسيولوجية') || insightResp.text.includes('جهازك العصبي') || insightResp.text.includes('اللوزة الدماغية'),
    'تقديم تفسير نفسي وعلمي دقيق لآلية التوتر والجسد دون لوم للمستخدم'
  );

  // 3.9 طلب خطوة عملية في التوتر الحاد
  const stressAdviceResp = await CompanionEngine.generateResponse('أنا متوتر ومش طايق، أعمل إيه دلوقتي؟', 'adult', ongoingHistory);
  assert(
    stressAdviceResp.text.includes('خطوة واحدة عملية') && (stressAdviceResp.text.includes('ماء') || stressAdviceResp.text.includes('نفساً')),
    'تقديم خطوة تهدئة فسيولوجية واحدة محددة وفورية عند طلب نصيحة للتوتر'
  );

  // ---------------------------------------------------------
  // الاختبار 4: السلامة النفسية وأرقام الدعم العاجل
  // ---------------------------------------------------------
  console.log('\n📋 رابعًا: السلامة النفسية والتمييز بين الخطر والتعبير المجازي');

  // 4.1 التمييز: عبارات مجازية لا ينبغي اعتبارها خطر
  const benign1 = CompanionEngine.isCrisisInput('أنا هموت من الضحك هههه');
  const benign2 = CompanionEngine.isCrisisInput('أنا هموت من الجوع النهارده');
  const benign3 = CompanionEngine.isCrisisInput('مش عايز اموت، بس خايف');
  assert(!benign1, 'استبعاد المجاز: «هموت من الضحك» ليست أزمة خطر');
  assert(!benign2, 'استبعاد المجاز: «هموت من الجوع» ليست أزمة خطر');
  assert(!benign3, 'استبعاد النفي: «مش عايز اموت» ليست طلب إيذاء النفس');

  // 4.2 رصد الخطر الحقيقي
  const danger1 = CompanionEngine.isCrisisInput('أنا عايز انتحر واخلص من الدنيا');
  const danger2 = CompanionEngine.isCrisisInput('مش قادر اعيش وعايز انهي حياتي');
  const danger3 = CompanionEngine.isCrisisInput('نفسي انام ومصحاش تاني تعبت من كل حاجة');
  assert(danger1, 'رصد الخطر المباشر: «عايز انتحر واخلص من الدنيا»');
  assert(danger2, 'رصد خطر إنهاء الحياة: «مش قادر اعيش وعايز انهي حياتي»');
  assert(danger3, 'رصد اليأس الشديد: «نفسي انام ومصحاش تاني»');

  // 4.3 استجابة الأزمة الحقيقية
  const crisisResp = await CompanionEngine.generateResponse('عايز انتحر', 'adult', ongoingHistory);
  assert(crisisResp.isCrisisAlert === true, 'تحديد علامة أزمة نفسية عاجلة (isCrisisAlert = true)');
  assert(
    !!crisisResp.suggestedActions?.some(a => a.target === 'emergency_help'),
    'عرض زر طوارئ الإسعاف النفسي بنسمة حياة فوراً'
  );

  // ---------------------------------------------------------
  // النتيجة النهائية
  // ---------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 النتيجة الإجمالية: نجاح ${passed} من أصل ${passed + failed}`);
  if (failed === 0) {
    console.log('🎉 جميع اختبارات قبول رفيقي اجتازت الفحص الفعلي بنجاح 100%!');
  } else {
    console.log(`⚠️ هناك ${failed} اختبار بحاجة إلى مراجعة.`);
  }
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
