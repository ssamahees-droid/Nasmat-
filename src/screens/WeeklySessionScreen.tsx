import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Shield, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Check, 
  RefreshCcw, 
  Lock, 
  HeartHandshake, 
  PhoneCall, 
  XCircle, 
  HelpCircle,
  Key,
  Compass,
  Layers,
  Eye,
  Target,
  Smile,
  Brain,
  Repeat,
  Heart,
  ShieldAlert,
  Users,
  Zap,
  Sliders
} from 'lucide-react';
import { storage } from '../services/storage';
import { TextAudioPlayer } from '../components/TextAudioPlayer';

type SessionState = 
  | 'ready' 
  | 'opening' 
  | 'topic_selection' 
  | 'vaults_hub' 
  | 'vault_exploration' 
  | 'mirror_reflection' 
  | 'weekly_plan' 
  | 'save_consent' 
  | 'completed' 
  | 'safety_support';

interface VaultItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  prompt: string;
  cards: string[];
}

interface WeeklySessionScreenProps {
  onNavigate: (tab: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const WeeklySessionScreen: React.FC<WeeklySessionScreenProps> = ({ 
  onNavigate,
  onOpenEmergencyModal
}) => {
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [moodCheck, setMoodCheck] = useState<string>('مستقر نسبياً');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');

  // Vaults of the Psyche state
  const [activeVaultId, setActiveVaultId] = useState<string>('');
  const [exploredVaults, setExploredVaults] = useState<Record<string, { selectedCards: string[]; freeText: string }>>({});
  
  // Current vault working input
  const [currentVaultCards, setCurrentVaultCards] = useState<string[]>([]);
  const [currentVaultText, setCurrentVaultText] = useState<string>('');

  // Mirror reflection state
  const [userCorrection, setUserCorrection] = useState<string>('');

  // Weekly plan state
  const [actionGoal, setActionGoal] = useState<string>('');
  const [actionStep, setActionStep] = useState<string>('');
  const [consentToSave, setConsentToSave] = useState<boolean>(true);

  // 7 Vaults Definitions
  const vaultsList: VaultItem[] = [
    {
      id: 'emotions',
      title: 'خزانة المشاعر',
      subtitle: 'تحديد الشعور، شدته، والمواقف المرتبطة به',
      icon: Smile,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      prompt: 'ما هي المشاعر الأبرز التي تحوم حول هذا الموضوع وتصعب تسميتها أحياناً؟',
      cards: ['قلق وتوتر متلاحق', 'إرهاق واستنزاف عاطفي', 'حزن ووحدة عميقة', 'غضب محبوس ومكتوم', 'حيرة وتشتت أفكار', 'شعور بالتقصير الدائم']
    },
    {
      id: 'thoughts',
      title: 'خزانة الأفكار والمعاني',
      subtitle: 'التمييز بين ما حدث وما فهمناه وما نخشاه',
      icon: Brain,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      prompt: 'ما الذي حدث فعلاً بموضوعية، وما الذي أضافته أفكارك كمعنى أو توقع؟',
      cards: ['توقع الأسوأ والسيناريو الكارثي', 'لوم الذات على كل تفصيل', 'مقارنة النفس بالآخرين باستمرار', 'الشعور بأن الوقت يداهمنا بلا هدن', 'الاعتقاد بأنني وحدي في المواجهة']
    },
    {
      id: 'patterns',
      title: 'خزانة الأنماط المتكررة',
      subtitle: 'اكتشاف ردود الفعل المتكررة في الضغط والرفض والمقارنة',
      icon: Repeat,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      prompt: 'هل تلاحظ أن رد فعلك تجاه هذا الموقف يتكرر معك في مواقف سابقة مشابهة؟',
      cards: ['الانسحاب والصمت المفاجئ', 'إرضاء الآخرين على حساب راحتي', 'إرهاق النفس في محاولة السيطرة على كل شيء', 'تأجيل المواجهة حتى تنفجر الأمور', 'المقاومة الداخلية الشديدة لأي تغيير']
    },
    {
      id: 'needs',
      title: 'خزانة الاحتياجات',
      subtitle: 'استكشاف الاحتياجات الأساسية (أمان، تقدير، انتماء، استقلال)',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
      prompt: 'ما هو الاحتياج الإنساني العميق الذي تشعر أنه كان محروماً أو منسياً في هذه التجربة؟',
      cards: ['الأمان والاطمئنان الداخلي', 'التقدير والاعتراف بالجهد المبذول', 'المساحة الشخصية والراحة', 'الانتماء والدعم دون شروط', 'الوضوح واليقين في الرؤية']
    },
    {
      id: 'protection',
      title: 'خزانة الحماية',
      subtitle: 'طرق التأقلم والدفاع كمحاولات مفهومة للحماية وليست عيوباً',
      icon: Shield,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
      prompt: 'كيف ترى أن هذا السلوك أو رد الفعل كان يحاول حمايتك من ألم أو صدمة سابقة؟',
      cards: ['بناء جدران صلبة لمنع الاقتراب', 'الانشغال المفرط لإلهاء النفس عن المشاعر', 'الحذر المبالغ فيه لتجنب خيبة الأمل', 'إظهار القوة دائماً وإخفاء الضعف']
    },
    {
      id: 'boundaries',
      title: 'خزانة العلاقات والحدود',
      subtitle: 'صعوبة التعبير عن الاحتياجات وإرضاء الآخرين والخوف من الرفض',
      icon: Users,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      prompt: 'أين تجد صعوبة في وضع حدود صحية أو قول لا دون شعور بالذنب؟',
      cards: ['صعوبة قول لا للطلبات الضاغطة', 'الخوف من غضب الآخرين أو رفضهم', 'تحمل مسؤولية مشاعر الآخرين ومزاجهم', 'نقص التعبير الواضح عن الاحتياجات']
    },
    {
      id: 'strength',
      title: 'خزانة القوة والاختيار',
      subtitle: 'الموارد الشخصية، الاستثناءات الإيجابية، والخطوة الواقعية',
      icon: Zap,
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      prompt: 'ما هي الموارد أو اللحظات التي أثبتت مرونتك الداخلية وقدرتك على الصمود سابقاً؟',
      cards: ['تجارب صعبة عبرتها بنجاح سابقاً', 'لحظات هدوء وتأمل صغيرة قادرة على شحن طاقتي', 'وجود رغبة حقيقية وصادقة في التغيير اللطيف', 'القدرة على طلب الدعم عند الحاجة']
    }
  ];

  // Safety detection check
  const checkSafetyTrigger = (text: string) => {
    const dangerKeywords = ['أذي نفسي', 'انتحار', 'أقتل نفسي', 'موت', 'أرغب في الموت', 'إيذاء نفسي شديد', 'انهي حياتي', 'أؤذي نفسي'];
    const hasDanger = dangerKeywords.some(keyword => text.includes(keyword));
    if (hasDanger) {
      setSessionState('safety_support');
      return true;
    }
    return false;
  };

  const startSession = () => {
    setSessionState('opening');
  };

  const handleOpeningNext = (feeling: string) => {
    setMoodCheck(feeling);
    if (checkSafetyTrigger(feeling)) return;
    setSessionState('topic_selection');
  };

  const handleTopicConfirm = (topic: string) => {
    const finalTopic = topic === 'custom' ? customTopic : topic;
    if (!finalTopic.trim()) return;
    if (checkSafetyTrigger(finalTopic)) return;
    setSelectedTopic(finalTopic);
    setSessionState('vaults_hub');
  };

  const openVault = (vaultId: string) => {
    setActiveVaultId(vaultId);
    const existing = exploredVaults[vaultId] || { selectedCards: [], freeText: '' };
    setCurrentVaultCards(existing.selectedCards);
    setCurrentVaultText(existing.freeText);
    setSessionState('vault_exploration');
  };

  const toggleVaultCard = (card: string) => {
    if (currentVaultCards.includes(card)) {
      setCurrentVaultCards(currentVaultCards.filter(c => c !== card));
    } else {
      setCurrentVaultCards([...currentVaultCards, card]);
    }
  };

  const saveCurrentVaultAndContinue = (goToHub: boolean = true) => {
    if (activeVaultId) {
      if (checkSafetyTrigger(currentVaultText)) return;
      setExploredVaults(prev => ({
        ...prev,
        [activeVaultId]: {
          selectedCards: currentVaultCards,
          freeText: currentVaultText
        }
      }));
    }
    if (goToHub) {
      setSessionState('vaults_hub');
    } else {
      setSessionState('mirror_reflection');
    }
  };

  const handleProceedToMirror = () => {
    setSessionState('mirror_reflection');
  };

  const handleMirrorConfirm = () => {
    if (checkSafetyTrigger(userCorrection)) return;
    setSessionState('weekly_plan');
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionGoal.trim() || !actionStep.trim()) return;
    if (checkSafetyTrigger(actionGoal) || checkSafetyTrigger(actionStep)) return;
    setSessionState('save_consent');
  };

  const handleFinalSave = (agreed: boolean) => {
    setConsentToSave(agreed);
    if (agreed) {
      const exploredSummary = Object.entries(exploredVaults)
        .map(([vId, data]) => {
          const vMeta = vaultsList.find(x => x.id === vId);
          return `${vMeta?.title || vId}: [${data.selectedCards.join(', ')}] ${data.freeText ? `- تعليق: ${data.freeText}` : ''}`;
        })
        .join(' | ');

      storage.addNote(`جلسة خزائن النفس (${selectedTopic}) - الملخص: ${exploredSummary} | الهدف: ${actionGoal} | الخطوة: ${actionStep}`);
    }
    setSessionState('completed');
  };

  const currentVaultMeta = vaultsList.find(v => v.id === activeVaultId);

  // Dynamic Mirror Reflection Text
  const dynamicMirrorText = React.useMemo(() => {
    const cardsCollected = Object.values(exploredVaults).flatMap(v => v.selectedCards);
    const highlightedCards = cardsCollected.slice(0, 4).join('، ') || 'المشاعر المشتركة والتأمل الهادئ';
    return `بناءً على ما شاركتنا به في الموضوع: (${selectedTopic || 'موضوع الجلسة'})، يبدو أنك تختبر ضغطاً أو شعوراً مرتبطاً بالخزائن التي استكشفتها. لاحظنا بروز نقاط مثل: ${highlightedCards}. ممكن أكون فهمت إن هناك حاجة للهدوء والأمان ووضع مساحة لنفسك. هل هذا قريب من تجربتك الدقيقة، ولا فيه جزء مهم أنا مش شايفه أو محتاج تعديله؟`;
  }, [exploredVaults, selectedTopic]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn font-cairo" dir="rtl">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#111113]/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="font-jetbrains text-[10px] uppercase text-amber-600 dark:text-amber-400 font-bold">PILLAR_03 // الجلسة الأسبوعية</span>
            <h1 className="text-xl sm:text-2xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
              الجلسة التفاعلية — «خزائن النفس»
            </h1>
          </div>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl border border-[#111113]/20 dark:border-white/20 text-xs font-bold text-[#111113] dark:text-[#F7F3E9] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>

      {/* 1. STATE: READY / INTRODUCTION */}
      {sessionState === 'ready' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-12 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            {/* Audio Listen Button for Intro */}
            <TextAudioPlayer
              text="مرحباً بك في جلسة خزائن النفس. هذه مساحتك الأسبوعية الهادئة لنفهم معاً مشكلة واحدة أو تحدياً واحداً بعمق، ونبني فهماً مشتركاً ونخرج بخطوة عملية واقعية للأسبوع القادم. النظام لا يقدم تشخيصاً طبياً، بل يمنحك مرآة متكيفة تساعدك على اكتشاف ذاتك بكرامة كاملة."
              id="weekly_intro_audio"
              variant="compact"
              label="اسمع مقدمة الجلسة"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
              مرحباً بك في «خزائن النفس» 🤍
            </h2>
            <p className="text-sm sm:text-base text-[#111113]/80 dark:text-stone-300 leading-relaxed max-w-2xl">
              هذه مساحتك الأسبوعية الهادئة (نحو 30 دقيقة إرشادية) لنفهم معاً مشكلة واحدة أو تحدياً واحداً بعمق، ونبني فهماً مشتركاً ونخرج بخطوة عملية واقعية للأسبوع القادم. 
              النظام لا يقدم تشخيصاً طبياً، بل يمنحك مرآة متكيفة تساعدك على اكتشاف ذاتك بكرامة كاملة.
            </p>
          </div>
          <div className="bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/10 dark:border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-jetbrains font-bold text-amber-600 dark:text-amber-400">
              <Shield className="w-4 h-4" />
              <span>ميثاق الخصوصية والأمان</span>
            </div>
            <p className="text-xs text-[#111113]/70 dark:text-stone-400 leading-relaxed">
              • لا يُحفظ نص المحادثة الكامل أبداً.<br />
              • أنت تختار الخزائن التي تناسبك ولا يشترط فتحها كلها.<br />
              • الحفظ الدائم يتم فقط بموافقتك الصريحة في نهاية الجلسة.
            </p>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              onClick={startSession}
              className="px-8 py-4 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-sm rounded-xl border-[1.5px] border-[#111113] shadow-[3px_3px_0_#174C3C] hover:translate-y-[-1px] transition-all cursor-pointer font-syne flex items-center gap-2"
            >
              <span>ابدأ الجلسة الأسبوعية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STATE: OPENING MOOD CHECK */}
      {sessionState === 'opening' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-jetbrains opacity-60">
            <span>المرحلة 1 من 7: الاستعداد والمزاج الداخلي</span>
            <span>~ 3 دقائق</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
            كيف تستقبل نفسك اليوم؟ اختر الحالة الأقرب لداخلك الآن:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: 'مستقر وهادئ', label: 'مستقر وهادئ نسبياً 🌿' },
              { id: 'مجهد ومنهك', label: 'مجهد وتحت ضغط مستمر 🌧️' },
              { id: 'مشوش ومتشتت الأفكار', label: 'مشوش وأفكاري متلاحقة 🤔' },
              { id: 'حزين أو مخنوق', label: 'أشعر بحمل ثقيل أو خنقة 😔' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleOpeningNext(opt.id)}
                className="p-4 rounded-2xl border-[1.5px] border-[#111113]/20 dark:border-white/10 hover:border-[#111113] dark:hover:border-white bg-[#F8F7F4] dark:bg-[#121214] text-right font-bold text-sm text-[#111113] dark:text-[#F7F3E9] transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{opt.label}</span>
                <ArrowLeft className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. STATE: TOPIC SELECTION */}
      {sessionState === 'topic_selection' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-jetbrains opacity-60">
            <span>المرحلة 2 من 7: تحديد الموضوع الأساسي</span>
            <span>~ 4 دقائق</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
            ما هو الموضوع أو المشكلة الأساسية التي تود فهمها والتعامل معها اليوم؟
          </h2>
          <p className="text-xs text-[#111113]/75 dark:text-stone-400">
            اختر موضوعاً واحداً لنركز عليه بعمق دون تشتت:
          </p>
          <div className="space-y-3">
            {[
              'القلق المستمر وتوقع الأسوأ',
              'التوتر وضغط العمل أو الدراسة',
              'الشعور بالوحدة أو عدم التقدير',
              'صعوبة وضع حدود صحية مع الآخرين',
              'الإرهاق العاطفي ونفاد الطاقة'
            ].map((topic, i) => (
              <button
                key={i}
                onClick={() => handleTopicConfirm(topic)}
                className="w-full p-4 rounded-2xl border-[1.5px] border-[#111113]/20 dark:border-white/10 hover:border-emerald-500 bg-[#F8F7F4] dark:bg-[#121214] text-right font-bold text-sm text-[#111113] dark:text-[#F7F3E9] transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{topic}</span>
                <span className="text-xs font-jetbrains text-emerald-600">اختيار ←</span>
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-[#111113]/10">
            <label className="block text-xs font-bold mb-2 text-[#111113] dark:text-[#F7F3E9]">أو اكتب موضوعاً آخر بكلماتك:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اكتب الموضوع باختصار..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="flex-1 bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/20 dark:border-white/20 rounded-xl px-4 py-3 text-sm text-[#111113] dark:text-[#F7F3E9]"
              />
              <button
                onClick={() => handleTopicConfirm('custom')}
                disabled={!customTopic.trim()}
                className="px-6 py-3 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50"
              >
                متابعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. STATE: VAULTS HUB (خزائن النفس) */}
      {sessionState === 'vaults_hub' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-jetbrains opacity-60">
            <span>المرحلة 3 من 7: خزائن النفس الاستكشافية</span>
            <span>اختر ما يناسبك</span>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">الموضوع المختار: {selectedTopic}</span>
            <h2 className="text-xl sm:text-2xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
              استكشف الخزائن المتفرعة (اختر خزانة أو أكثر للتعمق):
            </h2>
            <p className="text-xs text-[#111113]/75 dark:text-stone-400">
              هذه المسارات اختيارية تماماً وليست إلزامية؛ يمكنك فتح ما تحتاجه للوصول للفهم العميق:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {vaultsList.map(vault => {
              const IconComp = vault.icon;
              const isExplored = exploredVaults[vault.id];
              return (
                <div
                  key={vault.id}
                  onClick={() => openVault(vault.id)}
                  className={`p-5 rounded-2xl border-[1.5px] transition-all cursor-pointer flex items-start justify-between gap-4 bg-[#F8F7F4] dark:bg-[#121214] hover:border-amber-500 group ${
                    isExplored ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[#111113]/20 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${vault.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-syne font-bold text-sm text-[#111113] dark:text-[#F7F3E9] group-hover:text-amber-600">
                          {vault.title}
                        </h3>
                        {isExplored && (
                          <span className="text-[10px] font-jetbrains bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                            تم الاستكشاف ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#111113]/70 dark:text-stone-400 mt-1 leading-relaxed">
                        {vault.subtitle}
                      </p>
                    </div>
                  </div>
                  <Key className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-amber-500 transition-all shrink-0 mt-1" />
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#111113]/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              {Object.keys(exploredVaults).length > 0 ? `استكشفت ${Object.keys(exploredVaults).length} خزانة` : 'لم تستكشف أي خزانة بعد'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleProceedToMirror}
                className="px-8 py-3.5 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-sm rounded-xl border-[1.5px] border-[#111113] shadow-[3px_3px_0_#174C3C] hover:translate-y-[-1px] transition-all cursor-pointer font-syne flex items-center gap-2"
              >
                <span>الانتقال لمرآة النفس والفهم المشترك</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. STATE: VAULT EXPLORATION */}
      {sessionState === 'vault_exploration' && currentVaultMeta && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-jetbrains opacity-60">
            <span>استكشاف الخزانة النشطة</span>
            <span>{currentVaultMeta.title}</span>
          </div>

          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#111113]/10">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${currentVaultMeta.color}`}>
                {React.createElement(currentVaultMeta.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <h2 className="text-xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
                  {currentVaultMeta.title}
                </h2>
                <p className="text-xs text-[#111113]/70 dark:text-stone-400">
                  {currentVaultMeta.prompt}
                </p>
              </div>
            </div>

            {/* Audio Listen for current vault question */}
            <TextAudioPlayer
              text={`${currentVaultMeta.title}. ${currentVaultMeta.prompt}`}
              id={`vault_audio_${currentVaultMeta.id}`}
              variant="compact"
              label="اسمع السؤال"
            />
          </div>

          {/* Interactive Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#111113] dark:text-[#F7F3E9]">اختر البطاقات التي تنطبق عليك (يمكنك اختيار أكثر من واحدة):</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentVaultMeta.cards.map((card, i) => {
                const isSelected = currentVaultCards.includes(card);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleVaultCard(card)}
                    className={`p-3.5 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300' 
                        : 'border-[#111113]/15 dark:border-white/10 bg-[#F8F7F4] dark:bg-[#121214] text-[#111113] dark:text-[#F7F3E9]'
                    }`}
                  >
                    <span>{card}</span>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-400'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Free Text Input */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-[#111113] dark:text-[#F7F3E9]">أو أضف ملاحظاتك أو بصيرتك الخاصة حول هذه الخزانة:</label>
            <textarea
              rows={3}
              value={currentVaultText}
              onChange={(e) => setCurrentVaultText(e.target.value)}
              placeholder="اكتب بكلماتك ما تلاحظه هنا..."
              className="w-full bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/20 dark:border-white/25 rounded-xl p-3 text-sm text-[#111113] dark:text-[#F7F3E9]"
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setSessionState('vaults_hub')}
              className="px-5 py-3 rounded-xl border border-[#111113]/20 dark:border-white/20 text-xs font-bold text-[#111113] dark:text-[#F7F3E9] hover:bg-black/5 transition-all cursor-pointer"
            >
              العودة لقائمة الخزائن
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => saveCurrentVaultAndContinue(true)}
                className="px-6 py-3 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                حفظ والعودة للخزائن
              </button>
              <button
                onClick={() => saveCurrentVaultAndContinue(false)}
                className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>الانتقال للمرآة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. STATE: MIRROR OF THE PSYCHE (مرآة النفس) */}
      {sessionState === 'mirror_reflection' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-jetbrains opacity-60">
            <span>المرحلة 4 من 7: تقنية «مرآة النفس»</span>
            <span>انعكاس وفهم مخصص</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/30">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
                مرآة النفس والتأمل المشترك
              </h2>
            </div>
          </div>

          {/* Detailed Audio Player for Mirror Reflection */}
          <TextAudioPlayer
            text={dynamicMirrorText}
            id="mirror_reflection_full_tts"
            variant="full"
            label="اسمع انعكاس مرآة النفس كاملاً"
          />

          {/* Generated Reflection Box */}
          <div className="bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/15 dark:border-white/10 rounded-2xl p-6 space-y-4 text-right">
            <span className="text-xs font-jetbrains text-emerald-600 dark:text-emerald-400 font-bold block">ما فهمه النظام كفرضية قابلة للتصحيح:</span>
            <p className="text-sm text-[#111113]/90 dark:text-stone-200 leading-relaxed font-cairo">
              {dynamicMirrorText}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111113] dark:text-[#F7F3E9]">تصحيح أو إضافة من طرفك (اختياري):</label>
            <input
              type="text"
              value={userCorrection}
              onChange={(e) => setUserCorrection(e.target.value)}
              placeholder="مثل: الجانب الأهم هو شعوري بالإرهاق وليس الخوف..."
              className="w-full bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/20 dark:border-white/20 rounded-xl px-4 py-3 text-sm text-[#111113] dark:text-[#F7F3E9]"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setSessionState('vaults_hub')}
              className="px-5 py-3 rounded-xl border border-[#111113]/20 dark:border-white/20 text-xs font-bold text-[#111113] dark:text-[#F7F3E9] hover:bg-black/5 cursor-pointer"
            >
              العودة للخزائن للاستزادة
            </button>
            <button
              onClick={handleMirrorConfirm}
              className="px-8 py-3.5 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-sm rounded-xl border-[1.5px] border-[#111113] shadow-[3px_3px_0_#174C3C] hover:translate-y-[-1px] transition-all cursor-pointer font-syne flex items-center gap-2"
            >
              <span>تأكيد والانتقال للخطوة العملية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. STATE: WEEKLY PLAN & ACTION STEP */}
      {sessionState === 'weekly_plan' && (
        <form onSubmit={handlePlanSubmit} className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-jetbrains opacity-60">
            <span>المرحلة 5 من 7: خطوة الأسبوع العملية</span>
            <span>~ 4 دقائق</span>
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">الهدف الأسبوعي المستخلص</span>
            <h2 className="text-xl font-syne font-black text-[#111113] dark:text-[#F7F3E9] mt-1">
              ضع خطوة عملية صغيرة وواقعية للأسبوع القادم:
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-[#111113] dark:text-[#F7F3E9]">1. الهدف الأسبوعي المصغر (ما الذي ترغب في تحقيقه أو تخفيفه؟)</label>
              <input
                type="text"
                required
                value={actionGoal}
                onChange={(e) => setActionGoal(e.target.value)}
                placeholder="مثل: تخفيف حدة التوتر اليومي ومنح نفسي مساحة راحة..."
                className="w-full bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/20 dark:border-white/25 rounded-xl p-3 text-sm text-[#111113] dark:text-[#F7F3E9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-[#111113] dark:text-[#F7F3E9]">2. الخطوة العملية المحددة (متى وأين ستقوم بها؟)</label>
              <input
                type="text"
                required
                value={actionStep}
                onChange={(e) => setActionStep(e.target.value)}
                placeholder="مثل: القيام بتمرين التنفس لمدة 5 دقائق كل ليلة الساعة 10 مساءً..."
                className="w-full bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/20 dark:border-white/25 rounded-xl p-3 text-sm text-[#111113] dark:text-[#F7F3E9]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-sm rounded-xl border-[1.5px] border-[#111113] shadow-[3px_3px_0_#174C3C] hover:translate-y-[-1px] transition-all cursor-pointer font-syne flex items-center gap-2"
            >
              <span>مراجعة الحفظ والإغلاق</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* 8. STATE: SAVE CONSENT */}
      {sessionState === 'save_consent' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-10 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
            المرحلة 6 من 7: موافقة الخصوصية وحفظ الملخص والخطوة
          </h2>
          <p className="text-xs sm:text-sm text-[#111113]/75 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
            هل توافق على حفظ ملخص خزائن النفس والفهم المشترك وهدفك الأسبوعي في سجلك الشخصي على الجهاز؟ (لا يُحفظ نص المحادثة الكامل أبداً).
          </p>

          <div className="my-3 flex justify-center">
            <TextAudioPlayer
              text={`ملخص الجلسة الأسبوعية: موضوع ${selectedTopic}. الهدف هو: ${actionGoal}. والخطوة العملية: ${actionStep}. هل توافق على حفظ هذا الملخص على جهازك؟`}
              id="save_consent_audio"
              variant="compact"
              label="اسمع ملخص الموافقة"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleFinalSave(true)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-[3px_3px_0_#111113] transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>أوافق وحفظ البيانات</span>
            </button>
            <button
              onClick={() => handleFinalSave(false)}
              className="px-6 py-3.5 bg-white dark:bg-[#18181C] text-[#111113] dark:text-[#F7F3E9] font-bold text-sm rounded-xl border border-[#111113]/30 dark:border-white/20 hover:bg-stone-100 transition-all cursor-pointer flex items-center gap-2"
            >
              <XCircle className="w-4 h-4 text-stone-500" />
              <span>عدم الحفظ وإنهاء الجلسة</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. STATE: COMPLETED */}
      {sessionState === 'completed' && (
        <div className="bg-white dark:bg-[#18181C] border-[1.5px] border-[#111113] dark:border-white/20 rounded-3xl p-8 sm:p-12 shadow-[4px_4px_0_#111113] space-y-6 animate-fadeIn text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-syne font-black text-[#111113] dark:text-[#F7F3E9]">
            أتممت جلستك الأسبوعية «خزائن النفس» بنجاح 🌿
          </h2>
          <p className="text-sm text-[#111113]/75 dark:text-stone-400 max-w-md mx-auto">
            {consentToSave ? 'تم حفظ هدفك والخطوة العملية في سجلك الشخصي بنجاح.' : 'انتهت الجلسة دون حفظ أي بيانات بناءً على رغبتك.'}
          </p>
          <div className="bg-[#F8F7F4] dark:bg-[#121214] border border-[#111113]/15 dark:border-white/10 rounded-2xl p-6 max-w-lg mx-auto text-right space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#111113]/10 dark:border-white/10">
              <span className="text-xs font-jetbrains text-emerald-600 font-bold">ملخص إنجاز الجلسة</span>
              <TextAudioPlayer
                text={`أتممت جلستك الأسبوعية بنجاح. الهدف الأسبوعي: ${actionGoal || 'متابعة التنظيم النفسي'}. والخطوة العملية: ${actionStep || 'تنفيذ الخطوة المحددة بعناية'}.`}
                id="session_completed_audio"
                variant="compact"
                label="اسمع الملخص الختامي"
              />
            </div>
            <span className="text-xs font-jetbrains text-emerald-600 font-bold">الهدف الأسبوعي:</span>
            <p className="text-sm font-bold text-[#111113] dark:text-white">{actionGoal || 'متابعة التنظيم النفسي'}</p>
            <span className="text-xs font-jetbrains text-emerald-600 font-bold pt-2 block">الخطوة العملية:</span>
            <p className="text-xs text-[#111113]/70 dark:text-stone-300">{actionStep || 'تنفيذ الخطوة المحددة بعناية'}</p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3.5 bg-[#111113] dark:bg-[#F7F3E9] text-[#F7F3E9] dark:text-[#111113] font-bold text-sm rounded-xl border-[1.5px] border-[#111113] shadow-[3px_3px_0_#174C3C] cursor-pointer font-syne"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      )}

      {/* 10. STATE: SAFETY SUPPORT (Crisis Protocol) */}
      {sessionState === 'safety_support' && (
        <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-500 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 animate-fadeIn text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500 text-white flex items-center justify-center mx-auto shadow-md">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-syne font-black text-red-900 dark:text-red-200">
            ملاحظة أمان عاجلة — نحن هنا لمساندتك
          </h2>
          <p className="text-sm sm:text-base text-red-800 dark:text-red-300 max-w-xl mx-auto leading-relaxed">
            لقد رصدنا كلمات تعبر عن ضغط شديد أو أفكار مؤذية. لا توجد بمفردك، وهناك مختصون مستعدون لتقديم الدعم الفوري بسرية تامة على مدار الساعة:
          </p>
          
          <div className="my-2 flex justify-center">
            <TextAudioPlayer
              text="ملاحظة أمان عاجلة. نحن هنا لمساندتك ولست بمفردك. خطوط الدعم النفسي الرسمية والطوارئ متاحة الآن: الأمانة العامة للصحة النفسية على رقم 08008880700 أو 0220816831، والطوارئ الطبية العاجلة على رقم 123."
              id="safety_support_audio"
              variant="compact"
              label="اسمع رسالة الأمان"
            />
          </div>

          <div className="bg-white dark:bg-[#18181C] border border-red-300 rounded-2xl p-6 max-w-md mx-auto text-right space-y-3">
            <div className="flex items-center gap-3 text-red-700 dark:text-red-300 font-bold">
              <PhoneCall className="w-5 h-5 shrink-0" />
              <span>خطوط الدعم النفسي الرسمية والطوارئ:</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              • الأمانة العامة للصحة النفسية: <strong>08008880700</strong> أو <strong>0220816831</strong><br />
              • الطوارئ الطبية العاجلة: <strong>123</strong>
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                if (onOpenEmergencyModal) onOpenEmergencyModal();
                else onNavigate('support');
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>فتح طوارئ والدعم العاجل (SOS)</span>
            </button>
            <button
              onClick={() => setSessionState('ready')}
              className="px-6 py-3 bg-white dark:bg-[#18181C] text-stone-800 dark:text-stone-200 font-bold text-sm rounded-xl border border-stone-300 cursor-pointer"
            >
              العودة للبداية بأمان
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
