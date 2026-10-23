import { CompanionMessage, CompanionPersona, CompanionExpression, CompanionAction, CompanionUserSettings } from '../types/companion';

const SETTINGS_KEY = 'nesmat_companion_settings';
const CHAT_HISTORY_KEY = 'nesmat_companion_history';

/**
 * Normalizes Arabic text to handle variations in spelling, hamzas,
 * diacritics, tatweel, and repeated characters without altering the meaning.
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    // 1. Remove Arabic diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // 2. Remove tatweel / kashida
    .replace(/\u0640/g, '')
    // 3. Normalize alefs (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // 4. Normalize alif maqsura and yaa (ى -> ي)
    .replace(/ى/g, 'ي')
    // 5. Normalize taa marbuta to haa (ة -> ه) for flexible keyword matching
    .replace(/ة/g, 'ه')
    // 6. Normalize repeated letters (collapse 2+ identical consecutive letters to 1)
    .replace(/(.)\1+/g, '$1')
    // 7. Lowercase and collapse spaces
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalized crisis keywords for self-harm and suicide prevention
const NORMALIZED_CRISIS_KEYWORDS = [
  'انتحار', 'انتحر', 'فكرت في الانتحار', 'فكره انتحاريه',
  'عايز اموت', 'عاوز اموت', 'بدي اموت', 'نفسي اموت', 
  'انهي حياتي', 'اخلص من حياتي', 'اقتل نفسي', 
  'مش قادر اعيش', 'مش عايز اعيش', 'مش عاوز اعيش', 'مش طايق اعيش',
  'مش قادر اكمل حياتي', 'مش طايق حياتي', 'تعبت من الحياه وعايز اموت',
  'اوذي نفسي', 'اذي نفسي', 'ايذاء النفس', 'اقطع شراييني', 
  'اختفي من الدنيا', 'الموت ارحم', 'مالقتش قيمه لحياتي', 'ماليش قيمه في الدنيا',
  'تعبت وعايز اختفي', 'نفسي انام وما اصحاش', 'نفسي انام ومصحاش',
  'عايز اخلص من كل حاجه وانهي وجعي', 'الدنيا ضلمت ومش طايق اعيش'
];

export const DEFAULT_COMPANION_SETTINGS: CompanionUserSettings = {
  persona: 'adult',
  isAnimated: true,
  isVoiceAutoPlay: false,
  hasSeenIntroduction: false,
  animeTheme: 'ghibli',
  animeAccessory: 'sprout'
};

export interface PersonaDefinition {
  id: CompanionPersona;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  voicePitch: number;
  voiceRate: number;
  systemInstruction: string;
}

export const COMPANION_PERSONAS: Record<CompanionPersona, PersonaDefinition> = {
  child: {
    id: 'child',
    title: 'الطفل الداخلي',
    subtitle: 'أنا عندما كنت طفلاً',
    icon: '🌱',
    description: 'مساحة دافئة للاتصال ببراءتك ومشاعرك العميقة واحتياجك للأمان دون لوم أو أحكام.',
    voicePitch: 1.15,
    voiceRate: 0.98,
    systemInstruction: `أنت «الطفل الداخلي» للمستخدم (أنا عندما كنت طفلاً).
نبرتك: دافئة، بريئة، عفوية، رقيقة، باحثة عن الأمان والاحتواء والقبول غير المشروط.
هدفك الأساسي: إتاحة مساحة تعبير حرة وآمنة تماماً للمشاعر والاحتياجات، مع التركيز الكامل على التعاطف العاطفي الصريح وتجنب أي حلول عملية أو توجيهات جافة.
قاعدة حاسمة: اختم دائماً بسؤال استكشافي واحد فقط عن المشاعر (مثل: "إيه أكتر حاجة وجعتك في الموقف ده؟" أو "كنت محتاج إيه ساعتها؟").`
  },
  adult: {
    id: 'adult',
    title: 'الراشد',
    subtitle: 'أنا في وعيي الحالي',
    icon: '🌿',
    description: 'حوار ناضج ومتزن يربط بين الفكر والمشاعر لفهم الواقع واتخاذ خطوات عملية.',
    voicePitch: 0.98,
    voiceRate: 0.92,
    systemInstruction: `أنت «الراشد المتزن» للمستخدم (أنا في وعيي الحالي هنا والآن).
نبرتك: واعية، هادئة، موضوعية، عملية، تجمع بين الفهم النفسي والاتزان المنطقي.
هدفها الرئيسي: مساعدة المستخدم على الفصل بدقة بين ما حدث فعلاً، وبين ما شعره، وما افترضه أو خافه. تقديم منظور واقعي متزن وتحديد خيارات وخطوات عملية واضحة دون إنكار للمشاعر أو تسرع في الحلول.`
  },
  father: {
    id: 'father',
    title: 'الأب الداخلي',
    subtitle: 'أنا الحكيم الداعم لنفسي',
    icon: '🛡️',
    description: 'صوت الحكمة والأمان والحزم الحنون لوقف جلد الذات وتوفير الحماية والدعم الثابت.',
    voicePitch: 0.92,
    voiceRate: 0.90,
    systemInstruction: `أنت «الداعم والحامي الحكيم» للمستخدم (الأب الداخلي).
نبرتك: حكيمة، راسخة، دافئة بحزم حنون، تمنح قبولاً وأماناً حقيقياً دون توبيخ أو إشعار المستخدم بالضعف والذنب.
قواعد حاسمة: تجنب تماماً العبارات الآلية المحفوظة مثل "أنت قوي" أو "كل شيء سيكون بخير". لا تدّعي أبداً أنك أب حقيقي أو بديل عن العلاقات الإنسانية أو المتخصصين، بل امنح سنداً داخلياً ناضجاً.`
  },
  my_photo: {
    id: 'my_photo',
    title: 'صورتي الشخصية',
    subtitle: 'مرآتي الذاتية الصادقة',
    icon: '🪞',
    description: 'مساحة التأمل الذاتي المباشر وحوار النفس بصدق ورحمة مع نسختك الخاصة.',
    voicePitch: 1.0,
    voiceRate: 0.95,
    systemInstruction: `أنت «المرآة الذاتية الواعية» للمستخدم (أنا أحاور نفسي بصدق واحتواء).
نبرتك: صادقة، متقبلة، دافئة، واقعية، خالية من الأحكام والتوقعات الخارجية.
هدفك: مساعدة المستخدم على رؤية نفسه بإنصاف، والاحتفاء بجهوده، واحتواء مشاعره دون أقنعة أو ضغوط.`
  }
};

interface ResponseOption {
  text: string;
  suggestedActions: CompanionAction[];
  reflectionQuestions?: string[];
}

export class CompanionEngine {
  public static getSettings(): CompanionUserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_COMPANION_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_COMPANION_SETTINGS;
  }

  public static saveSettings(settings: CompanionUserSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }

  public static getHistory(): CompanionMessage[] {
    try {
      const data = localStorage.getItem(CHAT_HISTORY_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }

    // Default welcoming message if fresh start
    const defaultSettings = CompanionEngine.getSettings();
    return [CompanionEngine.getWelcomeMessage(defaultSettings.persona)];
  }

  public static saveHistory(history: CompanionMessage[]): void {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history.slice(-30))); // Keep last 30 messages
    } catch (e) {
      // ignore
    }
  }

  public static clearHistory(persona: CompanionPersona): CompanionMessage[] {
    const welcome = CompanionEngine.getWelcomeMessage(persona);
    const newHistory = [welcome];
    CompanionEngine.saveHistory(newHistory);
    return newHistory;
  }

  public static mapToolToActions(toolName: string): CompanionAction | null {
    switch (toolName) {
      case 'breathe':
        return { id: 'act-breathe', label: 'تمرين التنفس المهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' };
      case 'feker':
        return { id: 'act-feker', label: 'استوديو تفكيك الأفكار (فكّر)', icon: '💡', actionType: 'modal', target: 'feker' };
      case 'fact_or_story':
        return { id: 'act-fact', label: 'لعبة حقيقة أم قصة؟', icon: '⚖️', actionType: 'modal', target: 'fact_game' };
      case 'knot':
        return { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' };
      case 'battery':
        return { id: 'act-battery', label: 'فحص شاحن الطاقة النفسية', icon: '🔋', actionType: 'modal', target: 'battery_check' };
      case 'compass':
        return { id: 'act-compass', label: 'تحديد الشعور (بوصلة المشاعر)', icon: '🧭', actionType: 'modal', target: 'emotion_compass' };
      case 'soundscape':
        return { id: 'act-sound', label: 'استوديو أصوات الطبيعة', icon: '🌊', actionType: 'modal', target: 'soundscape' };
      case 'rescue':
        return { id: 'act-rescue', label: 'حقيبة الإنقاذ النفسي', icon: '🧰', actionType: 'modal', target: 'rescue_kit' };
      case 'booklet':
        return { id: 'act-booklet', label: 'كتيب نسمة حياة التفاعلي', icon: '📖', actionType: 'modal', target: 'booklet' };
      case 'library':
        return { id: 'act-library', label: 'مكتبة التثقيف النفسي', icon: '📚', actionType: 'route', target: 'explore' };
      case 'specialist':
        return { id: 'act-specialist', label: 'دليل استشارة الأخصائي النفسي', icon: '🩺', actionType: 'modal', target: 'specialist_guide' };
      case 'emergency':
        return { id: 'act-emergency', label: 'طوارئ المساندة النفسية العاجلة', icon: '🚨', actionType: 'modal', target: 'emergency_help' };
      default:
        return null;
    }
  }

  public static getWelcomeMessage(persona: CompanionPersona): CompanionMessage {
    if (persona === 'child') {
      return {
        id: 'welcome-init',
        sender: 'companion',
        text: 'أهلاً يا صديقي.. أنا مساحة لطفلك الداخلي 🌱 مكان دافي ومريح، مفيش فيه خوف ولا لوم ولا إحراج. تقدر تعبّر عن أي حاجة حاسس بيها بقلب مطمئن، وإحنا هنا نحتضن كل مشاعرك بحنية. طمني عليك، إيه أكتر حاجة قلبك محتاجها دلوقتي؟',
        timestamp: Date.now(),
        expression: 'welcome',
        suggestedActions: [
          { id: 'act-feelings', label: 'تفريغ المشاعر (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
          { id: 'act-game', label: 'لعبة جوايا حكاية', icon: '🎨', actionType: 'modal', target: 'gwaya_hekaya' },
          { id: 'act-nature', label: 'أصوات الطبيعة والهدوء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
        ],
        reflectionQuestions: [
          'إيه أكتر حاجة قلبك محتاجها عشان يطمن؟'
        ]
      };
    }

    if (persona === 'father') {
      return {
        id: 'welcome-init',
        sender: 'companion',
        text: 'أهلاً بك يا صديقي.. أنا الأب الداخلي 🛡️ صوت الأمان والحزم الحنون والتوجيه المتزن. أنا معاك لنحتضن ما تعيشه ونرتب خطواتك دون قسوة أو لوم مبالغ على الذات. طمني، إيه اللي شاغل بالك وعايزنا نتأمله ونشوف خطوته الصح معاً؟',
        timestamp: Date.now(),
        expression: 'welcome',
        suggestedActions: [
          { id: 'act-knot', label: 'تفكيك فكرة تشغلني (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
          { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
          { id: 'act-rescue', label: 'حقيبة الإنقاذ النفسي', icon: '🧰', actionType: 'modal', target: 'rescue_kit' }
        ],
        reflectionQuestions: [
          'ما هي الخطوة الواقعية المريحة التي يمكننا الاتفاق عليها الآن؟'
        ]
      };
    }

    return {
      id: 'welcome-init',
      sender: 'companion',
      text: 'أهلاً بك يا صديقي في «نسمة حياة» 🌿 أنا هنا بمثابة مساحة هادئة لتكون كما أنت، دون تصنّع أو أحكام مسبقة. ننصت لما تعيشه بالفعل اليوم، لنفهم مشاعرك وضغوطك واحتياجاتك ونخطو خطوات واضحة وواقعية معاً. ما الذي يشغل بالك أو تحب أن تبدأ به؟',
      timestamp: Date.now(),
      expression: 'welcome',
      suggestedActions: [
        { id: 'act-knot', label: 'تفكيك فكرة تشغلني (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
        { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
        { id: 'act-library', label: 'استكشاف التثقيف النفسي', icon: '📚', actionType: 'route', target: 'explore' }
      ],
      reflectionQuestions: [
        'ما الذي يحتاجه ذهنك وجسدك الآن: راحة، تفريغ، أم خطوة عملية؟'
      ]
    };
  }

  /**
   * Evaluates if text contains explicit self-harm or suicide intent,
   * while filtering out benign metaphors and negative expressions.
   */
  public static isCrisisInput(text: string): boolean {
    if (!text) return false;
    const normalized = normalizeArabicText(text);

    // Filter benign metaphors (e.g. dying of laughter, hunger, heat)
    const isBenignMetaphor = 
      /هموت من (الضحك|الجوع|الحر|البرد|الفرح|الكسوف)/.test(normalized) ||
      /مش (عايز|عاوز|بدي|نفسي) (اموت|انتحر|اوذي نفسي)/.test(normalized);

    if (isBenignMetaphor) {
      return false;
    }

    // Direct keyword check on normalized text
    const hasKeyword = NORMALIZED_CRISIS_KEYWORDS.some(kw => normalized.includes(kw));
    if (hasKeyword) {
      return true;
    }

    // Pattern for wanting to die / despair with various prefixes
    const despairPattern = /(عايز|عاوز|نفسي|بدي|حابب) (اموت|انتحر|اخلص من عمري|اختفي من الدنيا)/;
    if (despairPattern.test(normalized)) {
      return true;
    }

    return false;
  }

  /**
   * Selects a response from candidates, avoiding repeating the previous companion response.
   */
  private static pickDiverseResponse(
    candidates: ResponseOption[],
    lastCompanionText?: string
  ): ResponseOption {
    if (!candidates || candidates.length === 0) {
      return {
        text: 'أنا سامعك وفاهم قصدك.. خذ وقتك ومساحتك هنا آمنة ومريحة.',
        suggestedActions: []
      };
    }

    if (candidates.length === 1 || !lastCompanionText) {
      return candidates[0];
    }

    // Filter out candidates that match the start of the previous message
    const freshCandidates = candidates.filter(c => {
      const candidatePrefix = c.text.slice(0, 30);
      return !lastCompanionText.includes(candidatePrefix);
    });

    const pool = freshCandidates.length > 0 ? freshCandidates : candidates;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  public static async generateResponse(
    userText: string,
    persona: CompanionPersona,
    history: CompanionMessage[]
  ): Promise<CompanionMessage> {
    const trimmed = userText.trim();
    const isCrisis = CompanionEngine.isCrisisInput(trimmed);

    // 1. Psychological Safety Intervention (High Priority)
    if (isCrisis) {
      const crisisText = persona === 'child'
        ? `أنا سامع ألمك وحاسس بحملك الثقيل أوي يا غالي.. قلبي معاك، بس أرجوك أرجوك افتكر إنك مش لوحدك، وحياتك غالية ومهمة جداً. الألم ده ممكن يخف، وفيه ناس متخصصة جاهزة تسمعك دلوقتي في اللحظة دي وتمدلك إيدها بأمان وحب كاملين. من فضلك تواصل فوراً مع أحد خطوط المساندة المجانية دي أو اضغط على طوارئ الإسعاف النفسي:`
        : persona === 'father'
        ? `أنا هنا جنبك ومعك كأب داعم وحامٍ لك بكل ثبات ومحبة.. أسمع وجعك وثقل ما تمر به، وأؤكد لك أنك لست وحدك أبداً ولن نتركك. ألمك حقيقي ولكن هناك أمل ومساندة متخصصة متاحة فوراً بلا مقابل، وحياتك أثمن وأغلى من أن تواجه هذا بمفردك. أرجوك اتصل الآن بالخط الساخن أو اطلب الطوارئ لنقف معك خطوة بخطوة:`
        : `أسمعك بكل تعاطف وأدرك مدى الألم والضغط الشديد الذي تشعر به الآن يا صديقي. مشاعرك مسموعة، ولكن أرجوك تذكر أنك لست وحدك، وهناك أمل ومساعدة حقيقية متاحة فوراً. المتخصصون مستعدون لمساندتك على مدار الساعة بأمان وسرية تامة وبلا أي مقابل. أرجوك اتصل الآن بالخط الساخن أو اطلب الطوارئ:`;

      return {
        id: `crisis-${Date.now()}`,
        sender: 'companion',
        text: crisisText,
        timestamp: Date.now(),
        expression: 'empathy',
        isCrisisAlert: true,
        suggestedActions: [
          { id: 'act-er', label: 'طوارئ الإسعاف النفسي بنسمة حياة', icon: '🚨', actionType: 'modal', target: 'emergency_help' },
          { id: 'act-plan', label: 'خطة الأمان النفسي الشخصية', icon: '🛡️', actionType: 'modal', target: 'rescue_kit' },
          { id: 'act-sound', label: 'أصوات الطبيعة لتهدئة النبض', icon: '🌧️', actionType: 'audio', target: 'rain' }
        ]
      };
    }

    // 2. AI Model Integration via Backend Proxy (/api/companion/chat)
    // Passes user text, selected persona, and recent conversation history
    try {
      const historyForApi = history.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const currentLang = (typeof window !== 'undefined' ? localStorage.getItem('nesma_lang') : 'ar') || 'ar';
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmed,
          persona,
          history: historyForApi,
          language: currentLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.reply && !data.reply.includes('تحتاج ضبط مفتاح API')) {
          const suggestedActions: CompanionAction[] = (data.suggestedTools || [])
            .map((tool: string) => CompanionEngine.mapToolToActions(tool))
            .filter(Boolean) as CompanionAction[];

          return {
            id: `comp-${Date.now()}`,
            sender: 'companion',
            text: data.reply,
            timestamp: Date.now(),
            expression: data.expression || 'listening',
            suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined
          };
        }
      }
    } catch {
      // Proceed to deterministic local engine seamlessly if backend is offline or unconfigured
    }

    const currentLang = (typeof window !== 'undefined' ? localStorage.getItem('nesma_lang') : 'ar') || 'ar';
    const isEnglish = currentLang === 'en';

    // 3. Local Contextual Conversation Engine (Fast, privacy-first, deterministic fallback)
    const norm = normalizeArabicText(trimmed);

    // Find the last companion message text for context continuity
    const lastCompanionMsg = [...history].reverse().find(m => m.sender === 'companion');
    const lastCompanionText = lastCompanionMsg?.text || '';

    // Handle short answers and contextual continuity (e.g. user says: اه, لا, مش عارف, تعبان)
    const isShortAffirmation = /^(اه|ايوه|ايوة|نعم|بالظبط|فعلا|حصل|تمام|yes|yeah|sure|ok|okay)$/i.test(trimmed) || /^(اه|ايوه|ايوة|نعم|بالظبط|فعلا|حصل|تمام)$/.test(norm);
    const isShortNegation = /^(لا|مش اوي|مش قوي|ابدا|مظنش|مش حاصل|no|nope|not really)$/i.test(trimmed) || /^(لا|مش اوي|مش قوي|ابدا|مظنش|مش حاصل)$/.test(norm);
    const isShortUncertainty = /^(مش عارف|مش متاكد|محتار|تائه|مش فاهم|مش عارف مالي|i don't know|not sure|confused)$/i.test(trimmed) || /^(مش عارف|مش متاكد|محتار|تائه|مش فاهم|مش عارف مالي)$/.test(norm);
    const isShortExhaustion = /^(تعبان|مرهق|طاقتي خلصت|منهك|زهقان|tired|exhausted|drained)$/i.test(trimmed) || /^(تعبان|مرهق|طاقتي خلصت|منهك|زهقان)$/.test(norm);

    if (isShortAffirmation) {
      return {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: isEnglish
          ? (persona === 'child'
              ? 'I hear you and understand you gently.. Being here and acknowledging what you feel is a brave, beautiful step. Would you like to share a bit more, or just rest for a moment?'
              : persona === 'father'
              ? 'Well done on your honesty and steadiness.. Acknowledging reality is where genuine healing begins. I have your back, and we will take it step by step.'
              : 'Understood and appreciated. Naming your state is half the journey to regaining balance. What small, comfortable step do you feel you need right now?')
          : (persona === 'child'
              ? 'أنا فاهمك وسامعك كويس.. وجودك معايا واعترافك بشعورك ده في حد ذاته أمان وخطوة حلوة أوي. تحب نحكي أكتر عن اللي حاسس بيه دلوقتي، ولا نسيب نفسنا نرتاح شوية؟'
              : persona === 'father'
              ? 'أحسنت في وضوحك وثباتك.. الاعتراف بالواقع هو البداية الحقيقية لأي أمان أو خطوة صحيحة. أنا في ظهرك، وسنرتب كل شيء بهدوء ودون استعجال.'
              : 'مفهوم تماماً ومقدر لوضوحك.. إدراك الشعور وتسميته هو نصف المسافة لاستعادة الاتزان. ما الخطوة البسيطة التي تشعر أنك بحاجة إليها في هذه اللحظة؟'),
        timestamp: Date.now(),
        expression: 'listening',
        suggestedActions: [
          { id: 'act-feelings', label: isEnglish ? 'Name Feeling (Ana Delwaqti)' : 'تحديد الشعور (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
          { id: 'act-knot', label: isEnglish ? 'Deconstruct Thought' : 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' }
        ]
      };
    }

    if (isShortNegation) {
      return {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: persona === 'child'
          ? 'تمام يا غالي، مفيش أي إجبار ولا استعجال هنا خالص. إحنا هنا براحتنا وعلى مهلنا.. إيه اللي تحب تفتحه أو نتكلم فيه؟'
          : persona === 'father'
          ? 'حقك تماماً، ولك كامل المساحة والحرية دون أدنى ضغط. متى ما شعرت أنك مستعد للكلام ستجدني بجانبك وداعماً لك.'
          : 'أفهمك تماماً. لست ملزماً بأي شيء هنا؛ المساحة مساحتك لننصت لما ترغب فيه فقط. كيف تحب أن نسير معاً الآن؟',
        timestamp: Date.now(),
        expression: 'listening'
      };
    }

    if (isShortUncertainty) {
      return {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: persona === 'child'
          ? 'عادي جداً تكون مش عارف، ومش مطلوب منك ترتب كل حاجة في راسك دلوقتي. مجرد وقفتك هنا وإنك بتقول مش عارف ده صدق وجمال. تحب نسكت ونهدى شوية، ولا تحب نلعب لعبة خفيفة؟'
          : persona === 'father'
          ? 'لا تقلق، ليس عليك أن تملك كل الإجابات اليوم يا بني. حتى لحظات التيه لها حكمتها، ووجودك هنا يثبت رغبتك الصادقة في رعاية نفسك. خذ نفساً وسنتدرج خطوة بخطوة.'
          : 'عدم اليقين والتشوش أمر إنساني طبيعي جداً حين تتزاحم الضغوط. لست بحاجة لمعرفة كل الأسباب فوراً. خذ نفساً مريحاً ودعنا نمنح عقلك هدنة دون ضغط للوصول لإجابات.',
        timestamp: Date.now(),
        expression: 'empathy',
        suggestedActions: [
          { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
          { id: 'act-sound', label: 'أصوات الطبيعة والسكينة', icon: '🌊', actionType: 'modal', target: 'soundscape' }
        ]
      };
    }

    if (isShortExhaustion) {
      return {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: persona === 'child'
          ? 'سلامة قلبك وجسمك.. حقك تتعب، والتعب ده بيقول إنك شيلت كتير النهارده. ريّح ضهرك وبلاش تطلب من نفسك أي حاجة زيادة دلوقتي. أنا جنبك ومش هسيبك.'
          : persona === 'father'
          ? 'سلامتك وراحتك أهم من أي واجب الآن. لا تقسُ على نفسك، فالجسد والنفس أمانة تتطلب الرفق. ألقِ حمولك اليوم واسترح في أمان كامل.'
          : 'أشعر بمدى هذا الثقل وأقدره. التعب رسالة ذكية من جسدك تدعوك للتوقف وإلقاء الأحمال مؤقتاً. ليس عليك أن تنجز أي شيء إضافي اليوم. اسمح لنفسك بالراحة التامة.',
        timestamp: Date.now(),
        expression: 'empathy',
        suggestedActions: [
          { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
          { id: 'act-sound', label: 'جلسة أصوات الطبيعة للاسترخاء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
        ]
      };
    }

    // -------------------------------------------------------------
    // Core Conversational Intent Detection
    // -------------------------------------------------------------

    // 1. Seeking Actionable Advice / Practical Micro-Action
    const isSeekingAdvice =
      /(اعمل ايه|ايه العمل|انصحني|نصيحه|ايه الحل|حل للمشكله|ازاي اتصرف|اتصرف ازاي|قولي اعمل ايه|محتاج خطوه|عايز حل|دلني اعمل ايه|ايه الخطوه|ابدا بايه|مش عارف اتصرف)/.test(norm) ||
      (/(مش عارف|مش قادر).*(اعمل ايه|الحل)/.test(norm));

    // 2. Seeking Psychological Insight / Scientific Clarification ("ليه بحس بكده؟")
    const isSeekingInsight =
      /(ليه بحس|هو انا ليه|ليه بيحصلي|ايه السبب|ليه دايما|ليه دايم|ليه متوتر|ليه بخاف|ليه مكسل|ليه مش عارف|عايز افهم ليه|فسرلي|تفسير نفسي|ايه تفسير|ليه دماغي|ليه بيجيلي|ايه سببه)/.test(norm);

    // 3. Pure Venting (No unsolicited advice, pure listening & containment)
    const isVenting =
      /(عايز افضفض|عاوز افضفض|محتاج افضفض|فضفضه|اسمعني بس|مش عايز حل|مش عاوز حل|مش عايز نصيحه|مش عاوز نصيحه|بس عايز احكي|بس عاوز احكي|محدش يقاطعني|محدش يلومني|بفضفض معاك|افضفض وارتاح|بس اسمعني)/.test(norm);

    // 4. Seeking Learning / Psycho-education / Library
    const isSeekingLearn =
      /(اقرا|كتيب|كتاب|معلومات|ثقافه|موضوع|افهم المرض|نفسي اعرف|مكتبه التثقيف|مكتبه)/.test(norm);

    // 5. Fun & Entertainment
    const isSeekingFun =
      /(لعبه|فرفشه|ضحك|نكت|مسليه|سلي نفسي|ملل)/.test(norm);

    // 6. Identity / Introduction
    const isSelfIntroduction =
      /(انت مين|مين انت|عرفني بنفسك|بتعمل ايه|وظيفتك ايه)/.test(norm);

    // 7. Assessments & Quizzes
    const isSeekingQuiz =
      /(اختبار|تقييم|اعرف نفسي|شخصيتي|مكتئب ولا لا|مقياس)/.test(norm);

    // 8. Gratitude & Improvement
    const isSeekingGratitude =
      /(الحمد لله|احسن|مبسوط|فرحان|بشكرك|شكرا|تسلم|مرتاح)/.test(norm);

    // Emotion thematic detections
    const isStudyOrWorkContext = /(مذاكر|اذاكر|اركز|تركيز|مشروع|شغل|تسويف|مهمه|امتحان|امتحانات|واجب|درس)/.test(norm);
    const isAnxiety = /قلق|توتر|خايف|خوف|مرعوب|دقات قلبي|هلع|نوبه|ارتجاف|مش مرتاح/.test(norm);
    const isBurnout = /تعبان|مرهق|مستنزف|مش قادر|طاقتي صفر|زهقت|منهك|فرهده|كسول|مفيش حيل/.test(norm);
    const isSadness = /حزين|زعلان|مكتئب|اكتئاب|دموع|ببكي|مخنوق|خنقه|وحدي|وحيد|محدش حاسس/.test(norm);
    const isAnger = /غضبان|متعصب|متغاظ|مضايق|نرفزه|عصبيه|مخنوق منهم|هفرقع/.test(norm);
    const isOverthinking = /تفكير|دماغي شغاله|افكار|مش عارف انام|زحمه دماغ|وسواس|دوامه|مشوش/.test(norm);
    const isRelationships = /علاقه|خلاف|مشكله مع|اهلي|شريكي|صحابي|مش فاهميني|حدود|بيستغلوني/.test(norm);

    let expression: CompanionExpression = 'empathy';
    let candidates: ResponseOption[] = [];

    // -------------------------------------------------------------
    // Route Based on Intent
    // -------------------------------------------------------------

    // INTENT A: Actionable Advice (Single, concrete micro-step)
    if (isSeekingAdvice) {
      expression = 'thinking';

      if (isStudyOrWorkContext) {
        // Concrete study / focus micro-action
        if (persona === 'child') {
          candidates = [
            {
              text: 'اختار جزءًا صغيرًا من أول مهمة، واضبط مؤقتًا لخمس دقائق وابدأ به فقط. مش مطلوب تخلّص كل حاجة دلوقتي.. خطوة صغننة تكفي وشاطر في كل الأحوال 🌱',
              suggestedActions: [
                { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
                { id: 'act-breathe', label: 'دقيقة تنفس هادئة للتركيز', icon: '🌬️', actionType: 'route', target: 'breathe' }
              ],
              reflectionQuestions: ['إيه أصغر صفحة أو جزئية تقدر تبدأ بيها لمدة 5 دقايق بس؟']
            }
          ];
        } else {
          candidates = [
            {
              text: 'اختار جزءًا صغيرًا من أول مهمة، واضبط مؤقتًا لخمس دقائق وابدأ به فقط. مش مطلوب تخلّص كل حاجة دلوقتي. مجرد البدء الخفيف يكسر مقاومة الدماغ ويستعيد تركيزك تدريجياً.',
              suggestedActions: [
                { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
                { id: 'act-breathe', label: 'تمرين التنفس المهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' }
              ],
              reflectionQuestions: ['ما هي أصغر خطوة تستغرق 5 دقائق فقط يمكنك تنفيذها الآن؟']
            }
          ];
        }
      } else if (isAnxiety) {
        // Concrete stress / anxiety micro-action
        if (persona === 'child') {
          candidates = [
            {
              text: 'خطوة واحدة بسيطة نعملها سوا دلوقتي: اشرب بق مية صغير، وحط إيدك على صدرك وخد نفس بطيء وكبير.. الشهيق بهدوء والزفير أطول. مش مطلوب تفكر في أي حاجة تانية في الدقيقة دي.',
              suggestedActions: [
                { id: 'act-breathe', label: 'تمرين التنفس المهدئ', icon: '🌬️', actionType: 'route', target: 'breathe' },
                { id: 'act-nature', label: 'أصوات الطبيعة والهدوء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'خطوة واحدة عملية وفورية الآن: اشرب رشفة ماء، وضع يدك على صدرك وخذ نفساً بطيئاً (شهيق لـ 4 ثوانٍ، وزفير بطيء لـ 7 ثوانٍ). لا تحاول حل أي موضوع في هذه الدقيقة سوى طمأنة جسدك فسيولوجياً.',
              suggestedActions: [
                { id: 'act-breathe', label: 'تمرين التنفس المهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' },
                { id: 'act-sound', label: 'أصوات الطبيعة للاسترخاء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
              ]
            }
          ];
        }
      } else if (isAnger) {
        // Concrete anger / conflict micro-action
        if (persona === 'child') {
          candidates = [
            {
              text: 'سيب اللي في إيدك وتعال ناخد هدنة.. قوم من المكان فوراً واغسل وشك بمية باردة واشرب مية. مش هنرد على حد ولا هنتخانق دلوقتي، المهم تهدا وتكون في أمان الأول.',
              suggestedActions: [
                { id: 'act-release', label: 'محرر الأفكار والمشاعر الغاضبة', icon: '🔥', actionType: 'modal', target: 'thought_release' },
                { id: 'act-war', label: 'ورشة الخلاف بلا حرب', icon: '🤝', actionType: 'modal', target: 'conflict_without_war' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'خطوة عملية حاسمة الآن: توقف تماماً عن الرد أو إرسال أي رسالة، غيّر مكان جلوسك فوراً واغسل وجهك بماء بارد. امنح عقلك مهلة 15 دقيقة قبل أي نقاش لتفادي قرارات لحظة الاشتعال.',
              suggestedActions: [
                { id: 'act-release', label: 'تفريغ الغضب وحرق الأفكار', icon: '🔥', actionType: 'modal', target: 'thought_release' },
                { id: 'act-war', label: 'ورشة الخلاف بلا حرب', icon: '🤝', actionType: 'modal', target: 'conflict_without_war' }
              ]
            }
          ];
        }
      } else if (isBurnout) {
        // Concrete burnout micro-action
        if (persona === 'child') {
          candidates = [
            {
              text: 'الخطوة الوحيدة دلوقتي: اقفل الشاشة، ريّح ضهرك واغمض عينك 10 دقايق بس. مش مطلوب منك تنجز أي حاجة زيادة النهارده، شحن طاقتك أهم من أي واجب.',
              suggestedActions: [
                { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
                { id: 'act-sound', label: 'جلسة أصوات الطبيعة', icon: '🍃', actionType: 'modal', target: 'soundscape' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'خطوتك الوحيدة لهذه اللحظة: أوقف العمل تماماً، أسند ظهرك أو استلقِ لـ 10 دقائق في مكان هادئ واشرب ماء. تأجيل المهام غير الحرجة اليوم قرار صحي حكيم لاستعادة طاقتك.',
              suggestedActions: [
                { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
                { id: 'act-sound', label: 'أصوات الطبيعة للاسترخاء', icon: '🍃', actionType: 'modal', target: 'soundscape' }
              ]
            }
          ];
        }
      } else {
        // General practical micro-step
        if (persona === 'child') {
          candidates = [
            {
              text: 'خطوتنا الحلوة دلوقتي: قوم اشرب كوباية مية واقعد في مكان مريح وافرد ضهرك. مش مطلوب ترتب كل حاجة في الدنيا دلوقتي، خطوة صغننة تريحك هي البداية 🌱',
              suggestedActions: [
                { id: 'act-feelings', label: 'تحديد الشعور (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
                { id: 'act-breathe', label: 'تمرين تنفس مهدئ', icon: '🌬️', actionType: 'route', target: 'breathe' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'خطوة واحدة عملية وفورية: حدد شيئاً واحداً فقط تحت سيطرتك المباشرة في غرفتك أو أمامك واقضِ دقيقتين فقط في إتمامه (مثل ترتيب مكتبك أو شرب ماء). التركيز على فعل ملموس صغير يعيد للعقل شعور السيطرة.',
              suggestedActions: [
                { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
                { id: 'act-breathe', label: 'تمرين تنفس مهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' }
              ]
            }
          ];
        }
      }
    }

    // INTENT B: Pure Venting (Active listening, deep empathy, NO unsolicited advice)
    else if (isVenting) {
      expression = 'empathy';
      if (persona === 'child') {
        candidates = [
          {
            text: 'أنا جنبك وسامعك بكل حب واهتمام.. مش هقولك تعمل إيه ولا هطلب منك أي حاجة خالص. احكي وفضفض بكل اللي في قلبك وطلع كل اللي مضايقك براحتك، أنا هنا عشان أسمعك وأطمنك وبس 🌱',
            suggestedActions: [
              { id: 'act-feelings', label: 'تفريغ المشاعر (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
              { id: 'act-nature', label: 'أصوات الطبيعة والهدوء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
            ]
          }
        ];
      } else {
        candidates = [
          {
            text: 'أنا معك بكامل الإنصات وبلا أي أحكام أو مقاطعة يا صديقي. مساحتك هنا مفتوحة وآمنة تماماً لتفرغ كل ما يثقل قلبك. لن أقدم لك أي نصائح غير مطلوبة؛ أنا هنا لأستمع إليك فقط. خذ راحتك تماماً وأكمل حديثك، كل ما تقوله مسموع ومقدّر.',
            suggestedActions: [
              { id: 'act-feelings', label: 'تفريغ المشاعر (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
              { id: 'act-journal', label: 'تدوين في اليوميات', icon: '📝', actionType: 'modal', target: 'thought_journal' }
            ]
          }
        ];
      }
    }

    // INTENT C: Psychological Insight & Clarification ("ليه بحس بكده؟")
    else if (isSeekingInsight) {
      expression = 'thinking';
      if (isAnxiety) {
        if (persona === 'child') {
          candidates = [
            {
              text: 'عارف ليه بنحس بالخوف أو التوتر؟ لأن جوانا حارس صغير (المخ) خايف علينا، ولما بنتعب بيشغل جرس الإنذار بصوت عالي عشان يحمينا، حتى لو مفيش خطر حقيقي برة! إحنا بس محتاجين نطمن الحارس ده ونقوله: إحنا بأمان دلوقتي 🌱',
              suggestedActions: [
                { id: 'act-breathe', label: 'تمرين التنفس المهدئ', icon: '🌬️', actionType: 'route', target: 'breathe' },
                { id: 'act-knot', label: 'فك العقدة الذهنية', icon: '🧶', actionType: 'modal', target: 'untangle_knot' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'ما تشعر به هو استجابة فسيولوجية طبيعية من جهازك العصبي؛ حين تتراكم الضغوط دون تفريغ، تظل اللوزة الدماغية (مركز الإنذار) في حالة تأهب قصوى لحمايتك، فيترجم العقل أي منبه عادي كأنه خطر دائم. إدراك أن هذا إنذار كاذب من جسدك هو أول خطوة لتهدئة النبض واستعادة الاتزان.',
              suggestedActions: [
                { id: 'act-breathe', label: 'تمرين التنفس المهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' },
                { id: 'act-library', label: 'مكتبة التثقيف: مسار القلق', icon: '📚', actionType: 'route', target: 'explore' }
              ],
              reflectionQuestions: ['هل تلاحظ أن التوتر يزداد بعد فترات العمل المتواصل دون راحة؟']
            }
          ];
        }
      } else if (isBurnout) {
        if (persona === 'child') {
          candidates = [
            {
              text: 'لما بنحس إن طاقتنا خلصت ومش قادرين نتحرك، ده مش كسل خالص! دي بطارية جسمنا بتقولنا بصوت عالي: كفاية جري كده، أنا محتاجة أرتاح وأشحن بهدوء. حقك تاخد هدنة وتسامح نفسك.',
              suggestedActions: [
                { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
                { id: 'act-nature', label: 'أصوات الطبيعة والهدوء', icon: '🍃', actionType: 'modal', target: 'soundscape' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'فقدان الشغف والتسويف في علم النفس ليسا كسلاً، بل استنزاف في طاقة الإرادة (Ego Depletion) أو آلية دفاعية لحمايتك من متطلبات الكمال الزائف والإرهاق المتراكم. عندما يرى العقل أن المهام تفوق طاقة الاحتمال، يلجأ لتجميد الحركة حمايةً لك.',
              suggestedActions: [
                { id: 'act-battery', label: 'فحص شاحن الطاقة والراحة', icon: '🔋', actionType: 'modal', target: 'battery_check' },
                { id: 'act-library', label: 'مكتبة التثقيف: مسار الاحتراق', icon: '📚', actionType: 'route', target: 'explore' }
              ]
            }
          ];
        }
      } else {
        // General psychological insight
        if (persona === 'child') {
          candidates = [
            {
              text: 'مشاعرنا دي عاملة زي رسايل ملونة جاية تقولنا على حاجة جوانا محتاجة اهتمام.. زي لما نحتاج حضن أو راحة أو أمان. هي مش جاية تضايقنا، جاية تنبهنا بحنية عشان ناخد بالنا من نفسنا 🌱',
              suggestedActions: [
                { id: 'act-compass', label: 'بوصلة المشاعر الدقيقة', icon: '🧭', actionType: 'modal', target: 'emotion_compass' },
                { id: 'act-gwaya', label: 'لعبة جوايا حكاية', icon: '🎨', actionType: 'modal', target: 'gwaya_hekaya' }
              ]
            }
          ];
        } else {
          candidates = [
            {
              text: 'مشاعرنا ليست عشوائية وليست أعداءً لنا؛ كل شعور نمر به هو بمثابة لمبة تحذير في لوحة القيادة تخبرنا بوجود احتياج نفسي غير ملبّى (كالحاجة للأمان، الراحة، التقدير، أو وضع حدود). حين نتجاهل الاحتياج، يرفع الجسد حدة الإشارة لتلتفت لنفسك.',
              suggestedActions: [
                { id: 'act-compass', label: 'تحديد الشعور بدقة (بوصلة المشاعر)', icon: '🧭', actionType: 'modal', target: 'emotion_compass' },
                { id: 'act-library', label: 'استكشاف مكتبة التثقيف النفسي', icon: '📚', actionType: 'route', target: 'explore' }
              ],
              reflectionQuestions: ['ما الاحتياج الأساسي الذي تعتقد أن هذا الشعور يحاول لفت انتباهك إليه؟']
            }
          ];
        }
      }
    }

    // INTENT D: Self Introduction
    else if (isSelfIntroduction) {
      expression = 'welcome';
      if (persona === 'child') {
        candidates = [
          {
            text: 'أنا مساحة طفلك الداخلي في نسمة حياة 🌱.. مهمتي أكون جنبك لما تحس إن العالم قاسي أو متعب، أسمعك بدون ما أحكم عليك، ونفتكر سوا إزاي نكون حنينين على نفسنا ونلعب ونهدى براحتنا.',
            suggestedActions: [
              { id: 'act-feelings', label: 'تحديد الشعور (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
              { id: 'act-game', label: 'لعبة جوايا حكاية', icon: '🎨', actionType: 'modal', target: 'gwaya_hekaya' }
            ],
            reflectionQuestions: ['إيه أكتر حاجة حسيت إنك محتاجها أول ما فتحت مساحتنا؟']
          }
        ];
      } else {
        candidates = [
          {
            text: 'أنا «شخصية نسمة حياة» — الحضور الرقمي التفاعلي المساند داخل المنصة 🌿. أنا هنا لأصغي إليك، وأساعدك على تفكيك المشاعر المضغوطة، ومرافقتك عبر الأدوات العملية والتمارين والألعاب التي تعيد إليك توازنك الذهني بخصوصية تامة.',
            suggestedActions: [
              { id: 'act-library', label: 'استكشاف التثقيف النفسي', icon: '📚', actionType: 'route', target: 'explore' },
              { id: 'act-knot', label: 'فك العقدة الذهنية', icon: '🧶', actionType: 'modal', target: 'untangle_knot' }
            ],
            reflectionQuestions: ['كيف يمكنني مساعدتك في يومك الحالي؟']
          }
        ];
      }
    }

    // INTENT E: Psycho-education & Reading
    else if (isSeekingLearn) {
      expression = 'encouraging';
      candidates = [
        {
          text: 'المعرفة قوة، وفهم طبيعة مشاعرنا هو نصف العلاج. في نسمة حياة ستجد مكتبة التثقيف النفسي الموثوقة التي تحتوي على 6 مسارات رئيسية و 30 موضوعاً علمياً مبسطاً مع تمارين عملية ومراجع معتمدة، بالإضافة لكتيب نسمات الكامل.',
          suggestedActions: [
            { id: 'act-library', label: 'مكتبة التثقيف النفسي (30 موضوع)', icon: '📚', actionType: 'route', target: 'explore' },
            { id: 'act-booklet', label: 'كتيب نسمات الكامل (12 فصلاً)', icon: '📖', actionType: 'modal', target: 'booklet' },
            { id: 'act-wisdom', label: 'حكمة اليوم النفسية الملهمة', icon: '✨', actionType: 'modal', target: 'daily_wisdom' }
          ],
          reflectionQuestions: ['ما هو الموضوع النفسي الذي تود التعمق فيه اليوم؟']
        },
        {
          text: 'خطوة ممتازة أن تبحث وتتعلم عن صحتك النفسية! قراءة المعلومات الموثوقة تبدد المخاوف والأوهام. تفضل بالاطلاع على مكتبة التثقيف والكتيب التفاعلي هنا:',
          suggestedActions: [
            { id: 'act-library', label: 'مكتبة التثقيف النفسي', icon: '📚', actionType: 'route', target: 'explore' },
            { id: 'act-booklet', label: 'تصفح كتيب نسمات', icon: '📖', actionType: 'modal', target: 'booklet' }
          ],
          reflectionQuestions: ['هل يساعدك تلخيص ما تقرأه وتدوين نقاط عملية لتطبيقها؟']
        }
      ];
    }

    // INTENT F: Fun & Lighthearted Relief
    else if (isSeekingFun) {
      expression = 'encouraging';
      if (persona === 'child') {
        candidates = [
          {
            text: 'يا سلام! أحلى حاجة اللعب والفرفشة.. الضحك بيهدي أعصابنا وبيجدد روحنا. تعالى نجرب ألعاب نسمة، فيه نكت، ألعاب ذاكرة، ولعبة فكّر الممتعة!',
            suggestedActions: [
              { id: 'act-feker', label: 'لعبة فكّر الذكية', icon: '💡', actionType: 'modal', target: 'feker' },
              { id: 'act-jokes', label: 'استراحة الضحك والنكت', icon: '🎭', actionType: 'modal', target: 'nesma_laughs' },
              { id: 'act-games-hub', label: 'صالة الألعاب الذهنية', icon: '🎮', actionType: 'modal', target: 'fun_games' }
            ]
          },
          {
            text: 'تعالى نلعب ونغيّر جو فوراً! أحياناً عقلنا بيحتاج لعبة خفيفة تفصلنا عن زحمة اليوم وترجع الضحكة لوشنا:',
            suggestedActions: [
              { id: 'act-jokes', label: 'نكت نسمة الخفيفة', icon: '😄', actionType: 'modal', target: 'nesma_laughs' },
              { id: 'act-feker', label: 'تحدي لعبة فكّر', icon: '💡', actionType: 'modal', target: 'feker' }
            ]
          }
        ];
      } else {
        candidates = [
          {
            text: 'الترويح عن النفس خطوة علاجية أساسية لاستعادة التوازن الذهني. لقد جهزنا قسماً ممتعاً للألعاب الذهنية والنكات الخفيفة لكسر روتين الضغوط.',
            suggestedActions: [
              { id: 'act-feker', label: 'لعبة فكّر الذكية', icon: '💡', actionType: 'modal', target: 'feker' },
              { id: 'act-jokes', label: 'استراحة الضحك والنكت', icon: '🎭', actionType: 'modal', target: 'nesma_laughs' },
              { id: 'act-games-hub', label: 'صالة الألعاب الذهنية', icon: '🎮', actionType: 'modal', target: 'fun_games' }
            ]
          },
          {
            text: 'إعطاء عقلك استراحة ممتعة يعيد شحن تركيزك ونشاطك. اختر ما يناسبك من الأنشطة الترفيهية لتخفيف وطأة الجدية:',
            suggestedActions: [
              { id: 'act-games-hub', label: 'صالة الألعاب الذهنية', icon: '🎮', actionType: 'modal', target: 'fun_games' },
              { id: 'act-feker', label: 'لعبة فكّر', icon: '💡', actionType: 'modal', target: 'feker' }
            ]
          }
        ];
      }
    }

    // INTENT G: Anxiety Emotion Sharing
    else if (isAnxiety) {
      expression = 'empathy';
      if (persona === 'child') {
        candidates = [
          {
            text: `أنا جنبك وماسك إيدك.. القلق والتوتر بيخلوا كل حاجة تبان كبيرة ومخيفة، بس إحنا في أمان هنا دلوقتي. تعالى ناخد نفس عميق وبطيء سوا.. الشهيق بهدوء، والزفير أطول مرتين. فكر فيها: إيه أكتر حاجة مخوفاك في اللحظة دي؟`,
            suggestedActions: [
              { id: 'act-breathe', label: 'تمرين التنفس المهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' },
              { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
              { id: 'act-release', label: 'محرر الأفكار المشتتة', icon: '✨', actionType: 'modal', target: 'thought_release' }
            ],
            reflectionQuestions: [
              'هل تشعر بالتوتر كشد في عضلاتك أو سرعة بالأنفاس؟',
              'ما هي أسوأ فكرة تراودك الآن، وهل هناك احتمال أكثر هدوءاً؟'
            ]
          },
          {
            text: `حقك تحس بالخوف أو التوتر، ومش عيب أبداً إن ضربات قلبك تزيد شوية.. ده جسمك بيحاول يحميك بس بالغلط. تعال نهديه بحنية: ضع إيدك على صدرك، وخد 3 أنفاس عميقة بالراحة. أنا جنبك ومش هسيبك.`,
            suggestedActions: [
              { id: 'act-breathe', label: 'دقيقة تنفس هادئة', icon: '🌬️', actionType: 'route', target: 'breathe' },
              { id: 'act-sound', label: 'صوت أمواج البحر للاسترخاء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
            ],
            reflectionQuestions: ['إيه أكتر مكان بتحس فيه بالأمان لما تكون متوتر؟']
          }
        ];
      } else {
        candidates = [
          {
            text: `أتفهم تماماً ما تمر به؛ القلق استجابة طبيعية لما يشعر جسدك بضغط زائد. تذكر أن الشعور بالقلق لا يعني وجود خطر حقيقي الآن. خطوتنا الأولى هي إعادة جسدك لحالة الأمان عبر التنفس وتفريغ الفكرة على الورق.`,
            suggestedActions: [
              { id: 'act-breathe', label: 'تمرين التنفس المهدئ 4-7-8', icon: '🌬️', actionType: 'route', target: 'breathe' },
              { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
              { id: 'act-release', label: 'محرر الأفكار المشتتة', icon: '✨', actionType: 'modal', target: 'thought_release' }
            ],
            reflectionQuestions: [
              'هل تشعر بالتوتر كشد في عضلاتك أو سرعة بالأنفاس؟',
              'ما هي أسوأ فكرة تراودك الآن، وهل هناك احتمال أكثر هدوءاً؟'
            ]
          },
          {
            text: `مشاعر القلق والهلع شديدة الوطأة، لكن تذكر أنها موجة فسيولوجية تصعد وتبلغ ذروتها ثم تتراجع حتماً. ركز على حواسك الخمس الآن: سمِّ ثلاثة أشياء تراها، واثنين تلمسهما، ثم اسمح لجسدك بالهدوء عبر تمرين التنفس.`,
            suggestedActions: [
              { id: 'act-breathe', label: 'تمرين تنظيم النبض والتنفس', icon: '🌬️', actionType: 'route', target: 'breathe' },
              { id: 'act-sound', label: 'خلفية صوتية طبيعية للسكينة', icon: '🌧️', actionType: 'modal', target: 'soundscape' }
            ],
            reflectionQuestions: ['هل يمكننا فصل الفكرة المسببة للتوتر عن واقع هذه اللحظة؟']
          }
        ];
      }
    }

    // INTENT H: Burnout Emotion Sharing
    else if (isBurnout) {
      expression = 'empathy';
      if (persona === 'child') {
        candidates = [
          {
            text: `حقك ترتاح.. مش لازم تثبت أي حاجة لأي حد دلوقتي. لما بطاريتنا بتفضى، بنحتاج نقف ونحضن نفسنا ونشحن بهدوء. تعالى نشوف ميزانية طاقتك راحت فين النهارده، وبلاش تضغط على نفسك أكتر.`,
            suggestedActions: [
              { id: 'act-energy', label: 'ميزانية الطاقة والاستنزاف', icon: '🔋', actionType: 'modal', target: 'energy_budget' },
              { id: 'act-sound', label: 'جلسة أصوات الطبيعة للاسترخاء', icon: '🍃', actionType: 'modal', target: 'soundscape' },
              { id: 'act-laughs', label: 'ضحكة وفرفشة مع نسمة', icon: '😄', actionType: 'modal', target: 'nesma_laughs' }
            ],
            reflectionQuestions: [
              'ما الشيء الوحيد الذي يمكنك تركه أو تأجيله اليوم لتخفيف الحمل؟',
              'هل شربت ماء أو ارتحت في مكان هادئ خلال الساعات الماضية؟'
            ]
          },
          {
            text: `حاسس بتقل كتافك وتعبك أوي.. لما نكون تعبانين بنحتاج نقول "كفاية كده النهارده" ونسامح نفسنا. مفيش مشكلة تكون طاقتك خلصت، دي مش قلة حيلة، ده جسمك بيطلب هدنة وحب.`,
            suggestedActions: [
              { id: 'act-sound', label: 'أصوات الطبيعة المريحة', icon: '🍃', actionType: 'modal', target: 'soundscape' },
              { id: 'act-energy', label: 'فحص ميزانية الطاقة', icon: '🔋', actionType: 'modal', target: 'energy_budget' }
            ],
            reflectionQuestions: ['إيه أكتر حاجة بسيطة ولطيفة ممكن تعملها لنفسك دلوقتي؟']
          }
        ];
      } else {
        candidates = [
          {
            text: `الاستنزاف إشارة ذكية من جسدك يطلب فيها الهدنة. ليس عليك أن تنجز كل شيء اليوم. الاعتراف بالحاجة للراحة ليس استسلاماً، بل حكمة. دعنا نراجع طاقتك ونمنح نفسك مساحة استرداد الأنفاس.`,
            suggestedActions: [
              { id: 'act-energy', label: 'ميزانية الطاقة والاستنزاف', icon: '🔋', actionType: 'modal', target: 'energy_budget' },
              { id: 'act-sound', label: 'جلسة أصوات الطبيعة للاسترخاء', icon: '🍃', actionType: 'modal', target: 'soundscape' },
              { id: 'act-laughs', label: 'ضحكة وفرفشة مع نسمة', icon: '😄', actionType: 'modal', target: 'nesma_laughs' }
            ],
            reflectionQuestions: [
              'ما الشيء الوحيد الذي يمكنك تركه أو تأجيله اليوم لتخفيف الحمل؟',
              'هل شربت ماء أو ارتحت في مكان هادئ خلال الساعات الماضية؟'
            ]
          },
          {
            text: `الإنهاك النفسي والبدني يتراكم حين نتجاهل إشارات التعب الصغيرة. لست مضطراً لحمل كل المسؤوليات بمفردك الآن. اسمح لنفسك بالتوقف التام لفترة وجيزة لاستعادة شحن بطاريتك.`,
            suggestedActions: [
              { id: 'act-battery', label: 'فحص شحن البطارية النفسية', icon: '🔋', actionType: 'modal', target: 'battery_check' },
              { id: 'act-sound', label: 'جلسة أصوات استرخاء', icon: '🌊', actionType: 'modal', target: 'soundscape' }
            ],
            reflectionQuestions: ['ما هي الحدود التي تحتاج لوضعها لحماية طاقتك غداً؟']
          }
        ];
      }
    }

    // INTENT I: Sadness Emotion Sharing
    else if (isSadness) {
      expression = 'empathy';
      if (persona === 'child') {
        candidates = [
          {
            text: `أنا سامع الوجع اللي في صوتك ومقدره جداً. الحزن مش عيب، ومن حقك تبكي أو تسكت لحد ما تحس بالأمان. أنا قاعد جنبك ومش هسيبك. لما تكون جاهز، تحب نعبّر عن الحكاية اللي جواك؟`,
            suggestedActions: [
              { id: 'act-gwaya', label: 'لعبة جوايا حكاية والتعبير الرمزي', icon: '📖', actionType: 'modal', target: 'gwaya_hekaya' },
              { id: 'act-compass', label: 'بوصلة المشاعر الدقيقة', icon: '🧭', actionType: 'modal', target: 'emotion_compass' },
              { id: 'act-healing', label: 'رحلة التعافي الذاتي', icon: '🌱', actionType: 'modal', target: 'healing_journey' }
            ],
            reflectionQuestions: [
              'لو كان لهذا الحزن شكل أو لون، كيف تراه؟',
              'ما الذي يحتاجه قلبك لكي يشعر بقليل من الدفء والسلوان؟'
            ]
          },
          {
            text: `مشاعرك غالية عليا أوي، ومسموح لك تحزن وتفرغ زعلك كله هنا. إحنا مش هنستعجل الفرح بالعافية، خلينا نحتضن الزعل ده بالراحة سوا لحد ما يخف ببطء.`,
            suggestedActions: [
              { id: 'act-feelings', label: 'تفريغ المشاعر (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
              { id: 'act-healing', label: 'خطوات في رحلة التعافي', icon: '🌱', actionType: 'modal', target: 'healing_journey' }
            ],
            reflectionQuestions: ['إيه الذكرى أو الكلمة اللي محتاج تسمعها لنفسك دلوقتي؟']
          }
        ];
      } else {
        candidates = [
          {
            text: `الحزن ضيف ثقيل، لكنه يحمل رسالة تخبرنا أن هناك أمراً يعنينا بشدة قد تألمنا بسببه. لا داعي لمقاومة الحزن بقسوة؛ تقبّله أول خطوة لتجاوزه. كيف تصف هذا الثقل بكلمات بسيطة؟`,
            suggestedActions: [
              { id: 'act-gwaya', label: 'لعبة جوايا حكاية والتعبير الرمزي', icon: '📖', actionType: 'modal', target: 'gwaya_hekaya' },
              { id: 'act-compass', label: 'بوصلة المشاعر الدقيقة', icon: '🧭', actionType: 'modal', target: 'emotion_compass' },
              { id: 'act-healing', label: 'رحلة التعافي الذاتي', icon: '🌱', actionType: 'modal', target: 'healing_journey' }
            ],
            reflectionQuestions: [
              'لو كان لهذا الحزن شكل أو لون، كيف تراه؟',
              'ما الذي يحتاجه قلبك لكي يشعر بقليل من الدفء والسلوان؟'
            ]
          },
          {
            text: `من الطبيعي أن نشعر بالحزن في منعطفات الحياة؛ محاولة كتمانه تزيد وطأته. التعبير الصادق والكتابة الواعية وتحديد الشعور بدقة يمنح النفس مساحة للتنفس والتعافي التدريجي.`,
            suggestedActions: [
              { id: 'act-compass', label: 'تحديد الشعور بدقة (بوصلة المشاعر)', icon: '🧭', actionType: 'modal', target: 'emotion_compass' },
              { id: 'act-journal', label: 'تدوين وتفريغ الأفكار في اليوميات', icon: '📝', actionType: 'modal', target: 'thought_journal' }
            ],
            reflectionQuestions: ['هل يرتبط هذا الحزن بفقدان، أو خيبة أمل، أم شعور بالوحدة؟']
          }
        ];
      }
    }

    // INTENT J: Anger Emotion Sharing
    else if (isAnger) {
      expression = 'listening';
      candidates = [
        {
          text: persona === 'child'
            ? `الغضب عامل زي البركان الصغير جوانا.. طبيعي نغضب لما نتظلم أو نتضايق! بس تعالى نطلّع الطاقة دي بطريقة تحميك وترتاح بيها. جرب تفرغ الفكرة الغاضبة في محرر الأفكار ونشوفها سوا.`
            : `الغضب طاقة حماية تخبرنا أن حدودنا قد تم تجاوزها أو توقعاتنا خابت. لا بأس بالشعور بالغضب، الأهم هو كيف نتعامل معه دون أن نحرق أنفسنا. ما هو الموقف أو السلوك الذي أشعل هذا الشعور تحديداً؟`,
          suggestedActions: [
            { id: 'act-release', label: 'تفريغ الغضب وحرق الأفكار السلبية', icon: '🔥', actionType: 'modal', target: 'thought_release' },
            { id: 'act-boundary', label: 'بناء الحدود الصحية والحماية', icon: '🛡️', actionType: 'modal', target: 'boundary_builder' },
            { id: 'act-war', label: 'ورشة الخلاف بلا حرب', icon: '🤝', actionType: 'modal', target: 'conflict_without_war' }
          ],
          reflectionQuestions: [
            'ما هو الشعور الأعمق المستتر وراء هذا الغضب (ألم، إحباط، أم خوف)؟',
            'ما هو الحد الصحي الذي تحتاج لوضعه لحماية نفسك مستقبلاً؟'
          ]
        },
        {
          text: persona === 'child'
            ? `أنا سامع إنك متغاظ أوي.. حقك تتضايق لما حاجة تزعلك. تعالى نخرج النار دي في مكان آمن بدل ما تفضل محبوسة في بطنك وراسك.`
            : `عندما يشتعل الغضب، يتسارع النبض ويفقد التفكير مرونته. قبل اتخاذ أي رد فعل سريع، دعنا نمنح هذا الغضب متنفساً آمناً عبر تدوينه وتفكيك أسبابه بموضوعية.`,
          suggestedActions: [
            { id: 'act-release', label: 'محرر الأفكار والمشاعر الغاضبة', icon: '🔥', actionType: 'modal', target: 'thought_release' },
            { id: 'act-war', label: 'ورشة الخلاف بلا حرب', icon: '🤝', actionType: 'modal', target: 'conflict_without_war' }
          ],
          reflectionQuestions: ['ما النتيجة التي ترغب فيها حقاً دون تصعيد مؤذٍ؟']
        }
      ];
    }

    // INTENT K: Overthinking
    else if (isOverthinking) {
      expression = 'thinking';
      candidates = [
        {
          text: persona === 'child'
            ? `دماغك عاملة زي أوضة فيها حاجات كتير متنعكشة؟ تعالى نرتبها واحدة واحدة. مش كل فكرة بتيجي في دماغنا بتكون حقيقة.. فيه أفكار مجرد حكايات بنخترعها من خوفنا. تعال نلعب لعبة «حقيقة أم حكاية»!`
            : `التفكير المفرط محاولة من العقل للسيطرة على المستقبل المجهول. لكن الدوران في نفس الدوائر يستهلك طاقتك دون حلول. الحل يبدأ بنقل الأفكار من رأسك إلى وسيلة خارجية، وفصل الحقائق الواقعية عن الافتراضات.`,
          suggestedActions: [
            { id: 'act-fact', label: 'لعبة حقيقة أم حكاية؟', icon: '⚖️', actionType: 'modal', target: 'fact_game' },
            { id: 'act-knot', label: 'فك العقدة الذهنية', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
            { id: 'act-journal', label: 'يوميات الأفكار الواعية', icon: '📝', actionType: 'modal', target: 'thought_journal' }
          ],
          reflectionQuestions: [
            'هل هذه الفكرة حقيقة مؤكدة بالأدلة، أم مجرد سيناريو يفترضه عقلك؟',
            'ما هو الشيء الوحيد الواقع تحت سيطرتك المباشرة الآن؟'
          ]
        },
        {
          text: persona === 'child'
            ? `الأفكار بتجري ورا بعض زي الملاهي؟ وقف القطر دقيقة، وقول للأفكار: "أنا سامعكم بس هرتاح دلوقتي". تعالى نفك عقدة فكرة واحدة بس منهم!`
            : `زحمة الأفكار تشبه تراكم الملفات المفتوحة في حاسوبك؛ إبطاء وتشتيت. لتفريغ هذا الضغط، اختر الفكرة الأكثر إلحاحاً ودعنا نفككها بهدوء عبر أداة فك العقدة.`,
          suggestedActions: [
            { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' },
            { id: 'act-fact', label: 'لعبة حقيقة أم حكاية؟', icon: '⚖️', actionType: 'modal', target: 'fact_game' }
          ],
          reflectionQuestions: ['لو سألت صديقاً حكيماً عن هذه الفكرة، ماذا سيقول لك؟']
        }
      ];
    }

    // INTENT L: Relationships & Boundaries
    else if (isRelationships) {
      expression = 'empathy';
      candidates = [
        {
          text: persona === 'child'
            ? `العلاقات صعبة أحياناً وبتوجع لما اللي بنحبهم ميفهموناش.. مهم تفتكر إن قيمتك محفوظة وإنك مش مضطر ترضي كل الناس على حساب راحتك وسلامتك.`
            : `العلاقات الإنسانية من أعظم مصادر السعادة لكنها أيضاً أكثر ما يستنزفنا إذا غابت الحدود الواضحة أو حل سوء الفهم. في منصة نسمة حياة جهزنا أدوات عملية لإدارة الخلاف بوعي وبناء حدود تحميك دون قطيعة.`,
          suggestedActions: [
            { id: 'act-boundary', label: 'أداة بناء الحدود الصحية', icon: '🧱', actionType: 'modal', target: 'boundary_builder' },
            { id: 'act-war', label: 'ورشة الخلاف بلا حرب', icon: '🤝', actionType: 'modal', target: 'conflict_without_war' },
            { id: 'act-specialist', label: 'دليل طلب استشارة الأخصائي', icon: '🩺', actionType: 'modal', target: 'specialist_guide' }
          ],
          reflectionQuestions: [
            'أين تكمن الصعوبة الأكبر: في التعبير عن رغبتك، أم في خوفك من رد فعل الطرف الآخر؟',
            'ما هي الكلمة أو الموقف الذي تحتاج أن تقول له «لا» بلطف وحزم؟'
          ]
        }
      ];
    }

    // INTENT M: Self Discovery / Quiz
    else if (isSeekingQuiz) {
      expression = 'thinking';
      candidates = [
        {
          text: `استكشاف الذات خطوة شجاعة لمعرفة أين تقف وكيف تساند نفسك بصورة مدروسة. يمكنك خوض اختبار الاكتشاف الشخصي السريع أو تقييم المزاج المعتمد.`,
          suggestedActions: [
            { id: 'act-quiz', label: 'اختبار اكتشاف الذات والأنماط', icon: '🧭', actionType: 'modal', target: 'discovery_quiz' },
            { id: 'act-assess', label: 'تقييم المزاج الدوري (PHQ-9)', icon: '📊', actionType: 'route', target: 'assessment' },
            { id: 'act-battery', label: 'فحص شحن البطارية النفسية', icon: '🔋', actionType: 'modal', target: 'battery_check' }
          ]
        }
      ];
    }

    // INTENT N: Gratitude
    else if (isSeekingGratitude) {
      expression = 'encouraging';
      candidates = [
        {
          text: persona === 'child'
            ? `يا رب دايماً مرتاح ومبسوط! فرحتك دي بتبسطني جداً وبتنور مساحتنا. مفيش أجمل من لحظة الرضا والسكينة دي.. خليك محتفظ بالشعور ده جواك 🌿`
            : `يسعدني جداً سماع ذلك! الشعور بالامتنان والتحسن ثمرة جميلة لاهتمامك بسلامك الداخلي. حافظ على هذه اللحظات وسجّلها لتتذكر دائماً أن الغيوم تزول دائماً ويأتي بعدها النور.`,
          suggestedActions: [
            { id: 'act-journal', label: 'تدوين لحظة الامتنان في اليوميات', icon: '📝', actionType: 'modal', target: 'thought_journal' },
            { id: 'act-sound', label: 'خلفية صوتية هادئة لمواصلة يومك', icon: '🌊', actionType: 'modal', target: 'soundscape' }
          ]
        },
        {
          text: persona === 'child'
            ? `الحمد لله من كل قلبي! شفت إزاي النور بيرجع تاني؟ أنا فرحان بيك وبراحتك دي جداً 🌱`
            : `الحمد لله، هذه خطوة طيبة تستحق أن تحتفي بها بهدوء. تسجيل مشاعر التعافي والامتنان يعزز مناعتك النفسية في مواجهة أي ضغوط مقبلة.`,
          suggestedActions: [
            { id: 'act-journal', label: 'حفظ لحظة الرضا في اليوميات', icon: '📝', actionType: 'modal', target: 'thought_journal' }
          ]
        }
      ];
    }

    // DEFAULT: General supportive conversational response
    else {
      expression = 'listening';
      candidates = [
        {
          text: persona === 'child'
            ? `أنا سامعك وفاهم قصدك.. حتى لو الكلام ملخبط أو مش عارف ترتبه، أنا مبسوط إنك بتشاركني. تفتكر إيه أكتر حاجة محتاجها دلوقتي في اللحظة دي علشان تحس إنك أحسن ولو بنسبة بسيطة؟`
            : `أشكرك على مشاركتي هذا الحديث يا صديقي. التعبير عن الأفكار أول خطوة لتوضيح الرؤية وتخفيف التوتر الداخلي. خذ وقتك كاملاً، كيف تحب أن نواصل حديثنا، وما الأنسب لك الآن؟`,
          suggestedActions: [
            { id: 'act-feelings', label: 'تحديد الشعور (أنا دلوقتي)', icon: '🧭', actionType: 'modal', target: 'ana_delwaqti' },
            { id: 'act-breathe', label: 'أخذ استراحة تنفس قصيرة', icon: '🌬️', actionType: 'route', target: 'breathe' },
            { id: 'act-sound', label: 'استماع لأصوات طبيعية هادئة', icon: '🌧️', actionType: 'modal', target: 'soundscape' }
          ],
          reflectionQuestions: [
            'ما هو الشيء الأكثر إلحاحاً الذي يشغل تفكيرك الآن؟',
            'هل يساعدك أن نقوم بنشاط مهدئ معاً، أم تفضل مواصلة الحديث؟'
          ]
        },
        {
          text: persona === 'child'
            ? `أنا هنا جنبك وبنصت ليك بكل حب. مفيش أي حاجة مضطر تقولها بالعافية.. حتى لو حابب نسكت شوية ونتنفس سوا أنا معاك.`
            : `مساحتنا هنا تتسع لكل ما ترغب في مشاركته. لا تتردد في طرح أي تساؤل أو فكرة تشغل بالك، وسنبحث معاً عن أدوات نسمة حياة الأنسب لمساندتك.`,
          suggestedActions: [
            { id: 'act-breathe', label: 'تمرين تنفس مهدئ', icon: '🌬️', actionType: 'route', target: 'breathe' },
            { id: 'act-knot', label: 'تفكيك الفكرة (فك العقدة)', icon: '🧶', actionType: 'modal', target: 'untangle_knot' }
          ],
          reflectionQuestions: ['ما الشعور الغالب عليك في هذه الدقيقة تحديداً؟']
        }
      ];
    }

    const chosen = CompanionEngine.pickDiverseResponse(candidates, lastCompanionText);

    return {
      id: `comp-${Date.now()}`,
      sender: 'companion',
      text: chosen.text,
      timestamp: Date.now(),
      expression,
      suggestedActions: chosen.suggestedActions,
      reflectionQuestions: chosen.reflectionQuestions
    };
  }
}
