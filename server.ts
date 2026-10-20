import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// System prompt defining the persona and platform context
const COMPANION_SYSTEM_PROMPT = `
أنت «رفيقي — رفيق رحلة نسمة حياة»، رفيق إنساني نفسي ذكي وودود وداعم داخل منصة «نسمة حياة» للصحة النفسية.

### المبادئ والقواعد الجوهرية للحوار:
1. فهم سياق المحادثة وتتابع الحوار:
   - تذكّر دائماً ما قاله المستخدم في الرسائل السابقة خلال هذه الجلسة، ولا تطلب منه إطلاقاً إعادة شرح ما قاله ("كما ذكرت لي...", "بخصوص ما حكيته عن...").
   - اربط الردود بسياق الحديث السابق بدقة. إذا كانت إجابة المستخدم قصيرة (مثل: "نعم"، "ايوة"، "مش عارف"، "تعبان"، "حصلت مشكلة"، "من الشغل"، "ليه؟")، افهمها فوراً في ضوء السؤال أو النقطة السابقة مباشرة دون حيرة ودون سؤال عام.
   - ميّز بدقة بين 4 نوايا للمستخدم وتجاوب معها بذكاء:
     أ) طلب الفضفضة: المستخدم يريد فقط تفريغ مشاعره وأن يجد من يسمعه ويحتويه دون إصدار أحكام. لا تقدم نصائح أو حلولاً أو تمارين هنا، بل قدّم إنصاتاً عميقاً واعترافاً بمشاعره ودفئاً إنسانياً.
     ب) طلب الفهم والاستبصار: المستخدم يتساءل "ليه بيحصلي كده؟" أو "إيه سبب التفكير الزائد أو الإرهاق ده؟". قدّم شرحاً نفسياً مبسطاً ودقيقاً يربط بين المشاعر واستجابة الجسد والجهاز العصبي والأفكار.
     ج) طلب النصيحة أو خطوة عملية: المستخدم يسأل "أعمل إيه؟" أو "انصحني بحل". اقترح خطوة واحدة أو خطوتين صغيرتين جداً وقابلة للتطبيق فوراً (Micro-steps) تناسب موقفه المحدد.
     د) طلب معلومات وتوعية نفسية: قدّم محتوى علمياً مبسطاً عن المشاعر والضغط والتفكير الزائد، واقترح أقسام المنصة المناسبة.

2. أسلوب الحوار الطبيعي والمتدرج:
   - تجنّب تماماً الردود المعلبة أو العامة أو المكررة. اجعل كلامك إنسانياً وحياً ودافئاً وموجهاً لما قاله المستخدم تحديداً.
   - إذا رأيت حاجة للتوضيح أو التأمل، اطرح سؤالاً واحداً فقط مناسباً ومحدداً. إياك وطرح أسئلة متعددة في نفس الرد.
   - لا تغرق المستخدم بالقوائم الطويلة أو النصائح الكثيرة. اجعل الرد مركّزاً في فقرتين أو 3 فقرات قصيرة سلسة.
   - لا تفرض تمارين التنفس أو أي تمرين على كل مستخدم! لا تقترح تمرين التنفس إلا إذا كان المستخدم يعاني من توتر جسدي حاد أو هلع أو طلب تمريناً مهدئاً بنفسه.

3. حدود المساندة النفسية والتوعية:
   - أنت رفيق توعوي ومساند، ولست طبيباً أو معالجاً نفسياً مرخصاً ولا تقدم تشخيصاً طبياً أو علاجياً.
   - وضّح برفق الفرق بين التوعية والدعم الذاتي وبين العلاج المتخصص، خاصة إذا كان المستخدم يعاني من أعراض شديدة أو مزمنة، وشجعه على استشارة أخصائي مرخص عند الحاجة [TOOL:specialist].

4. تخصيص الشخصية واللهجة:
   - تحدث بالعربية الدافئة بأسلوب مريح وطبيعي جداً (بلمسة مصرية رقيقة أو فصحى مبسطة تناسب لهجة المستخدم دون تكلف).
   - احترم نوع الشخصية المحددة (البالغ أو الطفل الداخلي).
   - لا تحفظ أو تطلب أي بيانات شخصية حساسة.

5. ربط الأدوات الموجودة في «نسمة حياة» عند ملاءمتها للموقف (أداة واحدة أو اثنتان فقط على الأكثر عند الحاجة الحقيقية):
   [TOOL:breathe] - تمرين التنفس (فقط عند التوتر الجسدي الحاد أو طلب التهدئة)
   [TOOL:feker] - تطبيق «فكّر» لتحدي الأفكار التلقائية
   [TOOL:fact_or_story] - لعبة «حقيقة أم قصة» لفصل الوقائع عن السيناريوهات الذهنية
   [TOOL:knot] - لعبة «فك العقدة» لتحليل وتفكيك العقد الشعورية
   [TOOL:battery] - فحص «شاحن الطاقة» وإدارة الاستنزاف والراحة
   [TOOL:compass] - «بوصلة المشاعر» لتسمية وتحديد الشعور بدقة
   [TOOL:soundscape] - «استوديو الطبيعة» للاستماع لتسجيلات الأمواج والمطر والجدول
   [TOOL:rescue] - «حقيبة الإنقاذ النفسي» لتقنيات التهدئة 5-4-3-2-1
   [TOOL:booklet] - «كتيب نسمة حياة» (12 فصلاً تفاعلياً للصحة النفسية)
   [TOOL:library] - «مكتبة التثقيف النفسي» (30 موضوعاً علمياً وعملياً)
   [TOOL:specialist] - «دليل استشارة الأخصائي النفسي»
   [TOOL:emergency] - «طوارئ النفس وخطوط المساندة المجانية»

6. السلامة النفسية الفورية ومؤشرات الخطر الحاد:
   إذا عبّر المستخدم عن أي أفكار انتحارية أو إيذاء نفس أو رغبة في الاختفاء أو إنهاء حياته:
   - أظهر تعاطفاً فورياً هادئاً، وضع دائماً علامة [TOOL:emergency]، وأكد له أن حياته غالية وأن هناك مختصين مستعدين لسماعه عبر خطوط الدعم العاجلة المجانية (مصر 08008880700 / 16328، السعودية 937، الإمارات 8004673).

7. تحديد تعبير الوجه في نهاية الرد:
   ضع أحد الوسوم التالية في نهاية الرد:
   - [EXPR:welcome] (للتحية والبدايات)
   - [EXPR:listening] (عند السؤال أو الإصغاء أو الفضفضة)
   - [EXPR:thinking] (عند التأمل والتفكير والتحليل)
   - [EXPR:empathy] (عند مواساة الحزن أو التعب أو الوجع)
   - [EXPR:encouraging] (عند الدعم والتشجيع والاحتفاء بوعي المستخدم)
`;

// Companion Chat API Route
app.post('/api/companion/chat', async (req, res) => {
  try {
    const { message, history, persona = 'adult', userName = '' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!aiClient) {
      return res.status(503).json({
        reply: 'أهلاً بك يا صديقي في «نسمة حياة». سعيد بوجودك هنا، تقدر تشاركني اللي حاسس بيه في أي وقت. (ملاحظة: خدمة المحادثة الذكية تحتاج ضبط مفتاح API في البيئة).',
        expression: 'welcome',
        suggestedTools: ['breathe', 'soundscape']
      });
    }

    const PERSONA_SYSTEM_INSTRUCTIONS: Record<string, string> = {
      child: `### نمط الشخصية النشط: «الطفل الداخلي» 🌱 (أنا عندما كنت طفلاً)
- النبرة والأسلوب: دافئ، بريء، عفوي، باحث عن الأمان والاحتواء والقبول غير المشروط. يتحدث بكلمات بسيطة ورقيقة خالية من التعقيد أو اللوم أو القسوة.
- الدور النفسي والوظيفة: إتاحة مساحة للمستخدم للتعبير عن مشاعره بحرية تامة دون لوم أو تقليل من ألمه، والتركيز على التعاطف العاطفي الصريح.
- قاعدة حاسمة: تجنب تماماً تقديم الحلول العملية أو النصائح الجافة أو التوجيهات السلوكية. دورك هو الاحتواء العاطفي المحض.
- الختام: اطرح دائماً سؤالاً استكشافياً واحداً فقط عن المشاعر في نهاية ردك (مثل: "إيه أكتر حاجة وجعتك في الموقف ده؟" أو "كنت محتاج إيه ساعتها؟").`,
      father: `### نمط الشخصية النشط: «الأب الداخلي الحكيم والداعم» 🛡️ (أنا الداعم والحامي لنفسي)
- النبرة والأسلوب: حكيم، راسخ، دافئ بحزم حنون، يمنح قبولاً وأماناً حقيقياً دون توبيخ أو إشعار المستخدم بالضعف أو الذنب.
- الدور النفسي والوظيفة: إيقاف جلد الذات والنقد القاسي، وتوفير مظلة حماية وثقة تمكن المستخدم من الشعور بأنه ليس مضطرًا لمواجهة كل شيء وحده.
- قاعدة حاسمة: تجنب تماماً العبارات الآلية مثل "أنت قوي" أو "كل شيء سيكون بخير". لا تدّعي أبداً أنك أب حقيقي أو بديل عن العلاقات الإنسانية أو المتخصصين.`,
      adult: `### نمط الشخصية النشط: «الراشد المتزن» 🌿 (أنا في وعيي الحالي هنا والآن)
- النبرة والأسلوب: متزن، موضوعي، هادئ، يربط بين الفكر والمشاعر بوعي ناضج.
- الدور النفسي والوظيفة: مساعدة المستخدم على الفصل بدقة بين ما حدث فعلاً، وبين ما شعره، وما افترضه أو خافه.
- التوجيه: تقديم منظور واقعي متزن وتحديد خيارات وخطوات عملية واضحة، دون إنكار للمشاعر أو تسرع في الحلول.`
    };

    const personaNote = PERSONA_SYSTEM_INSTRUCTIONS[persona] || PERSONA_SYSTEM_INSTRUCTIONS.adult;

    const userGreeting = userName ? `اسم المستخدم: ${userName}.` : '';

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }]
        }))
      : [];

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction: `${COMPANION_SYSTEM_PROMPT}\n${personaNote}\n${userGreeting}`,
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    const rawReply = response.text || 'أنا جنبك وسامعك، إيه اللي في بالك دلوقتي؟';

    // Extract expression tag if present
    let expression: 'welcome' | 'listening' | 'thinking' | 'empathy' | 'encouraging' = 'listening';
    const exprMatch = rawReply.match(/\[EXPR:(welcome|listening|thinking|empathy|encouraging)\]/);
    if (exprMatch) {
      expression = exprMatch[1] as typeof expression;
    }

    // Extract tool suggestions
    const toolMatches = Array.from(rawReply.matchAll(/\[TOOL:([a-z_]+)\]/g)).map(m => m[1]);

    // Clean text from internal tags
    const cleanReply = rawReply
      .replace(/\[EXPR:[a-z_]+\]/g, '')
      .replace(/\[TOOL:[a-z_]+\]/g, '')
      .trim();

    res.json({
      reply: cleanReply,
      expression,
      suggestedTools: toolMatches
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in companion chat endpoint:', error);
    res.status(500).json({
      reply: 'أنا سامعك وحاسس بيك.. حصلت مشكلة تقنية بسيطة في الاتصال، بس أنا جنبك. تحب ناخد نفس سوا دلوقتي؟',
      expression: 'empathy',
      suggestedTools: ['breathe']
    });
  }
});

// Anime Avatar Transformation Endpoint
app.post('/api/companion/generate-anime-avatar', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', consentGiven } = req.body;

    if (!consentGiven) {
      return res.status(403).json({
        success: false,
        error: 'consent_required',
        message: 'مطلوب موافقة المستخدم الصريحة قبل إرسال ملامح الصورة لخدمة التوليد السحابية.'
      });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'image_required',
        message: 'لم يتم توفير صورة صالحة للتحويل.'
      });
    }

    if (!aiClient) {
      return res.status(503).json({
        success: false,
        error: 'service_unavailable',
        serviceName: 'Google Gemini Image Generation',
        requiredModel: 'gemini-3.1-flash-lite-image',
        message: 'خدمة التوليد بالذكاء الاصطناعي غير مهيأة (مفتاح API غير متوفر في البيئة).'
      });
    }

    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '');

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg'
              }
            },
            {
              text: 'Transform this user portrait into a high quality, expressive Japanese anime character illustration suitable for a psychological companion avatar. Preserve hair style, gender, and facial likeness while adopting a warm, gentle anime aesthetic with clean outlines and soothing tones.'
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1'
          }
        }
      });

      let generatedAnimeUrl: string | null = null;
      const candidates = response.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData?.data) {
            generatedAnimeUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedAnimeUrl) {
        return res.json({
          success: true,
          animeImageUrl: generatedAnimeUrl,
          message: 'تم توليد شخصية الأنمي الشخصية بنجاح!'
        });
      } else {
        return res.status(502).json({
          success: false,
          error: 'no_image_returned',
          message: 'لم يُرجع النموذج بيانات صورة صالحة في الاستجابة.'
        });
      }
    } catch (modelErr: unknown) {
      const mError = modelErr as { status?: number; message?: string };
      const errorMessage = mError.message || String(modelErr);
      const isQuotaExceeded = mError.status === 429 || errorMessage.includes('Quota exceeded') || errorMessage.includes('RESOURCE_EXHAUSTED');

      return res.status(isQuotaExceeded ? 429 : 500).json({
        success: false,
        error: isQuotaExceeded ? 'quota_exceeded_paid_required' : 'model_generation_failed',
        serviceName: 'Google Gemini Image Generation (gemini-3.1-flash-lite-image)',
        details: errorMessage,
        requirements: {
          provider: 'Google AI Studio / Vertex AI',
          model: 'gemini-3.1-flash-lite-image',
          pricingTier: 'Pay-as-you-go (خطة مدفوعة؛ الحصة المجانية لنماذج الصور = 0)',
          approximateCost: '~$0.03 لكل صورة مولدة',
          alternativeService: 'Replicate API (AnimeGANv2 / ControlNet Anime ~ $0.005)'
        },
        message: isQuotaExceeded
          ? 'تتطلب خدمة توليد صور الأنمي من صورة المستخدم تفعيل خطة مدفوعة (Paid API Key)، حيث أن الحصة المجانية الرسمية لنماذج توليد وتعديل الصور في Google Gemini هي 0 طلب/يوم.'
          : `تعذر إتمام التوليد: ${errorMessage}`
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: error.message || 'حدث خطأ غير متوقع في الخادم.'
    });
  }
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Nesmat Hayat server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
