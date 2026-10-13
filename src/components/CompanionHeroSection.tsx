import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  User, 
  Heart, 
  RotateCcw,
  ZapOff,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  PhoneCall
} from 'lucide-react';
import { CompanionAvatar, CompanionExpression } from './CompanionAvatar';
import { CompanionEngine } from '../services/companionEngine';
import { voiceService } from '../services/voiceService';
import { CompanionPersona, CompanionMessage, CompanionUserSettings, CompanionAction } from '../types/companion';

interface CompanionHeroSectionProps {
  theme?: 'dark' | 'light' | 'system';
  onOpenFullCompanion: () => void;
  onOpenModalByName: (modalName: string, extraData?: any) => void;
  onNavigate: (route: string) => void;
  onOpenAudioModal: (title: string, category: string, durationMinutes: number) => void;
}

export const CompanionHeroSection: React.FC<CompanionHeroSectionProps> = ({
  theme = 'dark',
  onOpenFullCompanion,
  onOpenModalByName,
  onNavigate,
  onOpenAudioModal
}) => {
  const effectiveTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : (theme || 'dark');
  const isDark = effectiveTheme === 'dark';

  // Load user settings and chat history from engine
  const [settings, setSettings] = useState<CompanionUserSettings>(() => CompanionEngine.getSettings());
  const [messages, setMessages] = useState<CompanionMessage[]>(() => CompanionEngine.getHistory());
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const [currentExpression, setCurrentExpression] = useState<CompanionExpression>('welcome');
  const [showHistoryInline, setShowHistoryInline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sync settings when external updates occur
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(CompanionEngine.getSettings());
      setMessages(CompanionEngine.getHistory());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle switching personas (the two mirrors of self)
  const handleSelectPersona = (targetPersona: CompanionPersona) => {
    if (settings.persona === targetPersona) return;

    voiceService.stop();
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);

    const updated = { ...settings, persona: targetPersona };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);

    // Provide warm transition message without wiping context
    const switchNotice: CompanionMessage = {
      id: `switch-${Date.now()}`,
      sender: 'companion',
      text: targetPersona === 'child'
        ? 'أنا مساحة لطفلك الداخلي الآن 🌱.. مساحة دافئة للاحتواء والأمان العاطفي، دون لوم أو إحراج. طمني يا غالي، إيه أكتر حاجة قلبك محتاجها دلوقتي؟'
        : targetPersona === 'father'
        ? 'أنا معك الآن بوضع «الأب الداخلي الحكيم والداعم» 🛡️.. صوت الأمان والحزم الحنون والتوجيه الراسخ دون قسوة أو جلد ذات. كيف أستطيع مساندتك وحماية سلامك الداخلي اليوم؟'
        : 'أنا معك الآن بوضع «الراشد المتزن» 🌿.. مساحة واعية لفهم واقعك الحالي، مشاعرك، ضغوطك، واحتياجاتك، لنخطو معاً خطوات واضحة وواقعية.',
      timestamp: Date.now(),
      expression: 'welcome'
    };

    const nextList = [...messages, switchNotice];
    setMessages(nextList);
    CompanionEngine.saveHistory(nextList);
    setCurrentExpression('welcome');

    if (settings.isVoiceAutoPlay) {
      handleSpeakMessage(switchNotice);
    }
  };

  // Toggle animation setting
  const handleToggleAnimation = () => {
    const updated = { ...settings, isAnimated: !settings.isAnimated };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);
  };

  // Toggle through personas: adult -> child -> father -> adult
  const handleTogglePersona = () => {
    const nextPersona: CompanionPersona = 
      settings.persona === 'adult' ? 'child' :
      settings.persona === 'child' ? 'father' : 'adult';
    handleSelectPersona(nextPersona);
  };

  // Toggle voice auto-play
  const handleToggleVoiceAutoPlay = () => {
    const nextState = !settings.isVoiceAutoPlay;
    const updated = { ...settings, isVoiceAutoPlay: nextState };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);
    if (!nextState) {
      voiceService.stop();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    }
  };

  // Read message aloud via TTS
  const handleSpeakMessage = (msg: CompanionMessage) => {
    if (activeSpeakingMsgId === msg.id && isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
      setCurrentExpression('welcome');
      return;
    }

    voiceService.stop();
    setActiveSpeakingMsgId(msg.id);
    setIsSpeaking(true);
    setCurrentExpression('speaking');

    voiceService.speak(msg.text, {
      onStart: () => {
        setIsSpeaking(true);
        setCurrentExpression('speaking');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeakingMsgId(null);
        setCurrentExpression('welcome');
      },
      onError: () => {
        setIsSpeaking(false);
        setActiveSpeakingMsgId(null);
        setCurrentExpression('welcome');
      }
    }, {
      pitch: settings.persona === 'child' ? 1.15 : 0.98,
      rate: settings.persona === 'child' ? 0.98 : 0.92
    });
  };

  // Microphone toggle
  const handleToggleMic = () => {
    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningMic(false);
      setCurrentExpression('welcome');
      return;
    }

    voiceService.stop();
    setIsSpeaking(false);

    const rec = voiceService.createRecognition(
      (transcript) => {
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningMic(false);
        setCurrentExpression('welcome');
      },
      () => {
        setIsListeningMic(false);
        setCurrentExpression('welcome');
      },
      (err) => {
        console.warn('Recognition error:', err);
        setIsListeningMic(false);
        setCurrentExpression('welcome');
        if (err?.error === 'not-allowed') {
          setToastMessage('يرجى منح إذن الميكروفون للتحدث صوتياً');
        } else {
          setToastMessage('تعذر التقاط الصوت، يمكنك الكتابة في المربع أدناه');
        }
      }
    );

    if (rec) {
      recognitionRef.current = rec;
      try {
        rec.start();
        setIsListeningMic(true);
        setCurrentExpression('listening');
      } catch {
        setIsListeningMic(false);
      }
    } else {
      setToastMessage('التعرف الصوتي غير مدعوم في هذا المتصفح');
    }
  };

  // Send message inline
  const handleSendMessage = async (textToSend?: string) => {
    const raw = textToSend || inputText;
    const text = raw.trim();
    if (!text || isThinking) return;

    setInputText('');
    voiceService.stop();
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);

    const userMsg: CompanionMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    CompanionEngine.saveHistory(newHistory);

    setIsThinking(true);
    setCurrentExpression('thinking');

    try {
      // Simulate gentle human reflection pause
      await new Promise(r => setTimeout(r, 600));

      const companionResponse = await CompanionEngine.generateResponse(
        text,
        settings.persona,
        newHistory
      );

      setIsThinking(false);
      setCurrentExpression(companionResponse.expression || 'welcome');

      const updatedHistory = [...newHistory, companionResponse];
      setMessages(updatedHistory);
      CompanionEngine.saveHistory(updatedHistory);

      if (settings.isVoiceAutoPlay) {
        handleSpeakMessage(companionResponse);
      }
    } catch {
      setIsThinking(false);
      setCurrentExpression('welcome');
    }
  };

  // Trigger recommended micro-action
  const handleActionClick = (action: CompanionAction) => {
    if (action.actionType === 'modal') {
      onOpenModalByName(action.target, action.extraData);
    } else if (action.actionType === 'route') {
      onNavigate(action.target);
    } else if (action.actionType === 'audio') {
      onOpenAudioModal('أصوات الطبيعة والسكينة', 'طبيعة', 10);
    }
  };

  // Get the most recent companion message
  const lastCompanionMessage = [...messages].reverse().find(m => m.sender === 'companion') || messages[0];

  return (
    <section 
      className={`border rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden transition-all text-right font-tajawal ${
        isDark 
          ? 'bg-gradient-to-br from-[#142019] via-[#0f1713] to-[#0a100d] border-emerald-500/25' 
          : 'bg-gradient-to-br from-[#f2f8f4] via-[#e9f3ec] to-[#e1eee6] border-emerald-600/20'
      }`}
      dir="rtl"
    >
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#355C4A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-stone-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-fadeIn flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar: Presence title + Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-emerald-500/15 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shadow-xs border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white font-tajawal tracking-tight">
                شخصية نسمة حياة
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                حاضر معك 🌿
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              مساحة هادئة لتكون كما أنت، دون تصنّع، ودون افتراضات مسبقة
            </p>
          </div>
        </div>

        {/* Accessibility & View Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Toggle Animation */}
          <button
            onClick={handleToggleAnimation}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              settings.isAnimated
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-black/20 border-white/10 text-stone-400'
            }`}
            title={settings.isAnimated ? 'الوضع التفاعلي مفعل (انقر لتعطيل الحركة)' : 'الوضع الثابت مفعل (انقر لتفعيل الحركة)'}
          >
            {settings.isAnimated ? <Zap className="w-3.5 h-3.5 text-amber-300" /> : <ZapOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{settings.isAnimated ? 'حركة طبيعية' : 'وضع ثابت'}</span>
          </button>

          {/* Voice Audio Toggle */}
          <button
            onClick={handleToggleVoiceAutoPlay}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              settings.isVoiceAutoPlay
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-black/20 border-white/10 text-stone-400'
            }`}
            title={settings.isVoiceAutoPlay ? 'النطق الصوتي التلقائي مفعّل' : 'تفعيل النطق الصوتي التلقائي'}
          >
            {settings.isVoiceAutoPlay ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{settings.isVoiceAutoPlay ? 'صوت مفعّل' : 'صوت صامت'}</span>
          </button>

          {/* Expand to Fullscreen Companion Dialog */}
          <button
            onClick={onOpenFullCompanion}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="فتح نافذة الحوار الكاملة والموسعة"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>مساحة الحوار الكاملة</span>
          </button>
        </div>
      </div>

      {/* Main Body: Avatar + Dual Mirror Perspective Selector + Interactive Space */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-start relative z-10">
        
        {/* Right Column: Visual Avatar Representation */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center justify-center gap-3">
          <div className="relative group p-2 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-xs shadow-inner">
            <CompanionAvatar
              persona={settings.persona}
              expression={currentExpression}
              isSpeaking={isSpeaking}
              isListening={isListeningMic}
              size="lg"
              isAnimated={settings.isAnimated}
              onToggleAnimation={handleToggleAnimation}
              allowAnimationToggle={true}
              onTogglePersona={handleTogglePersona}
              theme={settings.animeTheme}
              accessory={settings.animeAccessory}
              onThemeChange={(newTheme) => {
                const updated = { ...settings, animeTheme: newTheme };
                setSettings(updated);
                CompanionEngine.saveSettings(updated);
              }}
              onAccessoryChange={(newAcc) => {
                const updated = { ...settings, animeAccessory: newAcc };
                setSettings(updated);
                CompanionEngine.saveSettings(updated);
              }}
            />
          </div>

          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              {settings.persona === 'child' ? '🌱 طفلي الداخلي' : settings.persona === 'father' ? '🛡️ الأب الداخلي' : settings.persona === 'my_photo' ? '🪞 صورتي الشخصية' : '🌿 الراشد المتزن'}
            </span>
            <p className="text-[11px] text-stone-400 max-w-[200px]">
              {settings.persona === 'child' 
                ? 'مرآة لطفولتك وأمانك العاطفي' 
                : settings.persona === 'father'
                ? 'مرآة لحكمتك وحمايتك لنفسك'
                : settings.persona === 'my_photo'
                ? 'مرآة ذاتية لتأمل نفسك الصادقة'
                : 'مرآة لواقعك كشخص بالغ اليوم'}
            </p>
            <p className="text-[10px] text-emerald-400/80 font-medium pt-0.5">
              ✨ انقر على الشخصية للمسة طمأنينة وتفاعل
            </p>
          </div>
        </div>

        {/* Left Column: Mirror Selector & Conversation Stream */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          
          {/* 1. Mirror Perspective Selector (الاختيار بين الشخصيات الثلاث) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
              <span>اختر الجانب النفسي الذي تريد أن ترى نفسك من خلاله اليوم:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Option 1: الراشد */}
              <button
                onClick={() => handleSelectPersona('adult')}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  settings.persona === 'adult'
                    ? 'bg-linear-to-r from-emerald-950/80 to-[#1e342a]/80 border-emerald-400/60 shadow-md ring-2 ring-emerald-500/25'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>الراشد 🌿</span>
                  </div>
                  {settings.persona === 'adult' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  حوار متزن لفهم واقعك الحالي وضغوطك واتخاذ خطوات واقعية.
                </p>
              </button>

              {/* Option 2: طفلي الداخلي */}
              <button
                onClick={() => handleSelectPersona('child')}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  settings.persona === 'child'
                    ? 'bg-linear-to-r from-emerald-950/80 to-[#1e342a]/80 border-emerald-400/60 shadow-md ring-2 ring-emerald-500/25'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>الطفل الداخلي 🌱</span>
                  </div>
                  {settings.persona === 'child' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  حوار لطيف للتعبير عن الخوف والاحتياج العاطفي بأمان وحب.
                </p>
              </button>

              {/* Option 3: الأب الداخلي */}
              <button
                onClick={() => handleSelectPersona('father')}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  settings.persona === 'father'
                    ? 'bg-linear-to-r from-emerald-950/80 to-[#1e342a]/80 border-emerald-400/60 shadow-md ring-2 ring-emerald-500/25'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>الأب الداخلي 🛡️</span>
                  </div>
                  {settings.persona === 'father' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  حكمة وحزم حنون لوقف جلد الذات وتوفير أمان وحماية راسخة.
                </p>
              </button>

              {/* Option 4: صورتي الشخصية */}
              <button
                onClick={() => handleSelectPersona('my_photo')}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  settings.persona === 'my_photo'
                    ? 'bg-linear-to-r from-teal-950/80 to-[#1b3430]/80 border-teal-400/60 shadow-md ring-2 ring-teal-500/25'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <Camera className="w-4 h-4 text-teal-400" />
                    <span>صورتي الشخصية 🪞</span>
                  </div>
                  {settings.persona === 'my_photo' && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  مرآتك الذاتية الخاصة للتأمل الصادق ومحادثة نفسك برحمة واعتزاز.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Current Message Bubble & Interaction */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  {settings.persona === 'child' ? '🌱 الطفل الداخلي' : settings.persona === 'father' ? '🛡️ الأب الداخلي' : '🌿 شخصية نسمة حياة'}
                </span>
                {isThinking && (
                  <span className="text-[11px] text-amber-300 animate-pulse flex items-center gap-1">
                    <span>يفكر بإنصات...</span>
                  </span>
                )}
              </div>

              {lastCompanionMessage && (
                <button
                  onClick={() => handleSpeakMessage(lastCompanionMessage)}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    activeSpeakingMsgId === lastCompanionMessage.id && isSpeaking
                      ? 'bg-emerald-500 text-stone-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                  title={activeSpeakingMsgId === lastCompanionMessage.id && isSpeaking ? 'إيقاف الصوت' : 'استماع صوتي'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">
                    {activeSpeakingMsgId === lastCompanionMessage.id && isSpeaking ? 'إيقاف' : 'استماع'}
                  </span>
                </button>
              )}
            </div>

            {/* Response Text */}
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed whitespace-pre-line">
              {lastCompanionMessage?.text}
            </p>

            {/* Emergency Hotlines Banner (shown during crisis) */}
            {lastCompanionMessage?.isCrisisAlert && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2 mt-2">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>خطوط المساندة المجانية العاجلة (متاحة الآن على مدار الساعة):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
                  <a 
                    href="tel:16328" 
                    className="flex items-center justify-between p-2 rounded-lg bg-rose-900/40 text-rose-200 hover:bg-rose-900 font-bold border border-rose-700/50"
                  >
                    <span>🇪🇬 مصر: 16328</span>
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="tel:08008880700" 
                    className="flex items-center justify-between p-2 rounded-lg bg-rose-900/40 text-rose-200 hover:bg-rose-900 font-bold border border-rose-700/50"
                  >
                    <span>🇪🇬 مجاني: 08008880700</span>
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="tel:920033360" 
                    className="flex items-center justify-between p-2 rounded-lg bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900 font-bold border border-emerald-700/50"
                  >
                    <span>🇸🇦 السعودية: 920033360</span>
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="tel:8004673" 
                    className="flex items-center justify-between p-2 rounded-lg bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900 font-bold border border-emerald-700/50"
                  >
                    <span>🇦🇪 الإمارات: 8004673</span>
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Suggested Micro-Actions if present */}
            {lastCompanionMessage?.suggestedActions && lastCompanionMessage.suggestedActions.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-stone-400">خطوات مقترحة تناسب حديثك:</span>
                {lastCompanionMessage.suggestedActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{action.icon || '✨'}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Toggle Previous Conversation History */}
            {messages.length > 2 && (
              <div className="pt-1 border-t border-white/5">
                <button
                  onClick={() => setShowHistoryInline(!showHistoryInline)}
                  className="text-[11px] text-stone-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {showHistoryInline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showHistoryInline ? 'إخفاء الحوار السابق' : `عرض الحوار السابق (${messages.length - 1} رسائل)`}</span>
                </button>

                {showHistoryInline && (
                  <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/5 text-xs">
                    {messages.slice(0, -1).map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-2.5 rounded-xl ${
                          msg.sender === 'user' 
                            ? 'bg-emerald-950/40 text-stone-200 border border-emerald-500/20 mr-4' 
                            : 'bg-white/5 text-stone-300 border border-white/5 ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-stone-400">
                          <span className="font-bold">
                            {msg.sender === 'user' ? 'أنت' : (settings.persona === 'child' ? 'الطفل الداخلي' : settings.persona === 'father' ? 'الأب الداخلي' : 'شخصية نسمة حياة')}
                          </span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Thought Starters (Simple, Unforced) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-stone-400">بدايات بسيطة للتواصل:</span>
            {[
              'حابب أحكي عن اللي في بالي',
              'أفكاري زحمة وعايز أرتبها',
              'عايز لحظة هدوء مع نفسي',
              'بس بتطمن على حالي'
            ].map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(starter)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-[11px] border border-white/10 transition-all cursor-pointer active:scale-95"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* 4. Inline Chat Input Field */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  settings.persona === 'child'
                    ? 'احكي لطفلك الداخلي أي فكرة أو شعور في قلبك...'
                    : 'شاركني فكرة، شعور، أو ما يشغل بالك الآن...'
                }
                disabled={isThinking}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/15 focus:border-emerald-400 focus:outline-hidden text-xs sm:text-sm text-white placeholder-stone-400 transition-colors"
              />
              <button
                onClick={handleToggleMic}
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isListeningMic
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={isListeningMic ? 'إيقاف التسجيل الصوتي' : 'تحدث بالصوت'}
              >
                {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isThinking}
              className="px-4 py-2.5 rounded-xl bg-[#355C4A] hover:bg-[#2A493B] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
              <span className="hidden sm:inline">إرسال</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
