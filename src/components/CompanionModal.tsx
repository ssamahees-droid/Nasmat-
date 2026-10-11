import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Heart, 
  PhoneCall, 
  ShieldAlert, 
  ArrowLeft, 
  Info,
  Compass,
  Smile,
  Bot
} from 'lucide-react';
import { CompanionAvatar } from './CompanionAvatar';
import { 
  CompanionMessage, 
  CompanionPersona, 
  CompanionExpression, 
  CompanionAction, 
  CompanionUserSettings 
} from '../types/companion';
import { CompanionEngine } from '../services/companionEngine';
import { voiceService } from '../services/voiceService';

interface CompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenModal: (modalName: string, extraData?: any) => void;
  onOpenAudio: (title: string, category: string, durationMinutes: number) => void;
}

const QUICK_STARTER_PROMPTS = [
  { label: 'حاسس بقلق وتوتر شديد 🌪️', text: 'أنا حاسس بقلق وتوتر ومش عارف أوقفه' },
  { label: 'طاقتي مستنزفة ومخنوق 🔋', text: 'طاقتي مستنزفة تماماً وحاسس بإرهاق كبير' },
  { label: 'دماغي مش بتبطل تفكير 🤯', text: 'عندي زحمة أفكار وتفكير مفرط مش مخليني أرتاح' },
  { label: 'عايز لعبة أو فرفشة تخرجني من المود 🎮', text: 'محتاج لعبة أو حاجة تخرجني من المود وتسليني' },
  { label: 'مش عارف أحدد مشاعري 🧭', text: 'مشاعري متلخبطة ومش عارف أترجم أنا حاسس بإيه' },
  { label: 'محتاج تمرين تنفس مهدئ 🌬️', text: 'محتاج تمرين تنفس يساعدني أهدى شوية' }
];

export const CompanionModal: React.FC<CompanionModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenModal,
  onOpenAudio
}) => {
  const [settings, setSettings] = useState<CompanionUserSettings>(() => CompanionEngine.getSettings());
  const [messages, setMessages] = useState<CompanionMessage[]>(() => CompanionEngine.getHistory());
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<CompanionExpression>('welcome');
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-hide toast after 4.5 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Escape key handling with clean listener cleanup
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Auto-scroll when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    } else {
      voiceService.stop();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListeningMic(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Handle switching personas (the two mirrors of self)
  const handleSelectPersona = (targetPersona: CompanionPersona) => {
    if (settings.persona === targetPersona) return;

    voiceService.stop();
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);

    const updated = { ...settings, persona: targetPersona };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);

    // Switch message history welcome or append personality notice
    const switchedMsg: CompanionMessage = {
      id: `switch-${Date.now()}`,
      sender: 'companion',
      text: targetPersona === 'child'
        ? 'أنا مساحة لطفلك الداخلي الآن 🌱.. مساحة دافئة للاحتواء والأمان العاطفي، دون لوم أو إحراج. طمني يا غالي، إيه أكتر حاجة قلبك محتاجها دلوقتي؟'
        : 'أنا معك الآن بوضع «صورتي الآن — أنا كما أنا اليوم» 🌿.. مساحة متزنة لفهم واقعك الحالي، مشاعرك، ضغوطك، واحتياجاتك، لنخطو معاً خطوات واضحة وواقعية.',
      timestamp: Date.now(),
      expression: 'welcome'
    };
    const nextList = [...messages, switchedMsg];
    setMessages(nextList);
    CompanionEngine.saveHistory(nextList);
    setCurrentExpression('welcome');

    if (settings.isVoiceAutoPlay) {
      handleSpeakMessage(switchedMsg);
    }
  };

  const handleTogglePersona = () => {
    handleSelectPersona(settings.persona === 'adult' ? 'child' : 'adult');
  };

  // Toggle voice auto-play
  const handleToggleVoiceAutoPlay = () => {
    const updated = { ...settings, isVoiceAutoPlay: !settings.isVoiceAutoPlay };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);
    if (!updated.isVoiceAutoPlay) {
      voiceService.stop();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    }
  };

  // Toggle animation setting (unified source of truth)
  const handleToggleAnimation = () => {
    const updated = { ...settings, isAnimated: !settings.isAnimated };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);
  };

  // Clear chat history
  const handleClearHistory = () => {
    voiceService.stop();
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);
    const refreshed = CompanionEngine.clearHistory(settings.persona);
    setMessages(refreshed);
    setCurrentExpression('welcome');
  };

  // Speak a message aloud
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

  // Microphone Speech Input Toggle
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
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
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
          setToastMessage('لم يتم منح إذن الميكروفون، يمكنك كتابة رسالتك في المربع أدناه.');
        } else {
          setToastMessage('تعذر التقاط الصوت، يمكنك كتابة رسالتك في المربع أدناه.');
        }
      }
    );

    if (rec) {
      recognitionRef.current = rec;
      try {
        rec.start();
        setIsListeningMic(true);
        setCurrentExpression('listening');
      } catch (e) {
        setIsListeningMic(false);
      }
    } else {
      setToastMessage('التعرف الصوتي غير مدعوم في هذا المتصفح، يمكنك الكتابة في المربع أدناه.');
    }
  };

  // Send message
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
      // Simulate gentle realistic human thinking pause (450ms - 900ms)
      await new Promise(r => setTimeout(r, 650));

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
    } catch (e) {
      setIsThinking(false);
      setCurrentExpression('welcome');
    }
  };

  // Action button click handler
  const handleTriggerAction = (action: CompanionAction) => {
    onClose(); // Close companion to view tool
    if (action.actionType === 'modal') {
      onOpenModal(action.target, action.extraData);
    } else if (action.actionType === 'route') {
      onNavigate(action.target);
    } else if (action.actionType === 'audio') {
      onOpenAudio('أصوات السكينة والطبيعة', 'طبيعة', 10);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-md transition-all duration-300 animate-fadeIn" 
      dir="rtl"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl h-[92vh] max-h-[820px] bg-[#FAF7F0] dark:bg-[#1A231F] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8DDCC] dark:border-stone-700 font-cairo"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-white/95 dark:bg-[#141C19]/95 border-b border-[#E8DDCC] dark:border-stone-800 flex items-center justify-between z-10 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#355C4A]/10 dark:bg-emerald-500/20 flex items-center justify-center text-[#355C4A] dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#26332D] dark:text-[#E8DDCC] leading-tight flex items-center gap-2">
                <span>رفيقي</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#355C4A]/10 text-[#355C4A] dark:bg-emerald-500/20 dark:text-emerald-300">
                  {settings.persona === 'child' ? 'طفلي الداخلي 🌱' : 'صورتي الآن 🌿'}
                </span>
              </h3>
              <p className="text-[11px] text-[#52645B] dark:text-stone-400">
                مساحتك الآمنة لتكون كما أنت، دون تصنّع أو أحكام مسبقة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Voice auto-play toggle */}
            <button
              onClick={handleToggleVoiceAutoPlay}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                settings.isVoiceAutoPlay
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-stone-100 text-stone-500 border-transparent dark:bg-stone-800 dark:text-stone-400'
              }`}
              title={settings.isVoiceAutoPlay ? 'تعطيل نطق الردود تلقائياً' : 'تفعيل نطق الردود صوتياً'}
              aria-label="تبديل النطق الصوتي"
            >
              {settings.isVoiceAutoPlay ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear History */}
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="بدء جلسة جديدة ومسح المحادثة السابقة"
              aria-label="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Compact Companion Presence Avatar Banner & Mirror Selector */}
        <div className="bg-linear-to-b from-white to-[#FAF7F0] dark:from-[#141C19] dark:to-[#1A231F] py-2.5 px-4 border-b border-[#E8DDCC]/70 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="scale-90 origin-center">
              <CompanionAvatar
                persona={settings.persona}
                expression={currentExpression}
                isSpeaking={isSpeaking}
                isListening={isListeningMic}
                size="sm"
                isAnimated={settings.isAnimated}
                onToggleAnimation={handleToggleAnimation}
                allowAnimationToggle={true}
              />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                {settings.persona === 'child' ? 'مرآة طفلي الداخلي 🌱' : 'مرآة صورتي الآن 🌿'}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {settings.persona === 'child' ? 'مساحة الأمان العاطفي والاحتواء' : 'البالغ المتزن | لفهم واقعك وخطواتك'}
              </span>
            </div>
          </div>

          {/* Dual Mirror Perspective Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => handleSelectPersona('adult')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.persona === 'adult'
                  ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              صورتي الآن 🌿
            </button>
            <button
              onClick={() => handleSelectPersona('child')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settings.persona === 'child'
                  ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              طفلي الداخلي 🌱
            </button>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm leading-relaxed">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isMsgSpeaking = activeSpeakingMsgId === msg.id && isSpeaking;

            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[94%] sm:max-w-[85%] ${
                  isUser ? 'mr-auto' : 'ml-auto'
                }`}
              >
                <div
                  className={`relative p-3.5 sm:p-4 rounded-2xl shadow-xs transition-all duration-200 ${
                    isUser
                      ? 'bg-[#355C4A] text-white rounded-br-xs'
                      : msg.isCrisisAlert
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-stone-800 dark:text-stone-100 rounded-bl-xs'
                      : 'bg-white dark:bg-[#202C27] text-stone-800 dark:text-stone-100 border border-[#E8DDCC] dark:border-stone-700 rounded-bl-xs'
                  }`}
                >
                  {/* Sender title & Audio TTS button */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-stone-100 dark:border-stone-700/60">
                      <span className="text-[11px] font-bold text-[#355C4A] dark:text-emerald-400 flex items-center gap-1">
                        {settings.persona === 'child' ? '🌱 رفيق الطفل الداخلي' : '🌿 الرفيق البشري'}
                      </span>
                      <button
                        onClick={() => handleSpeakMessage(msg)}
                        className={`p-1 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          isMsgSpeaking
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                        }`}
                        title={isMsgSpeaking ? 'إيقاف الصوت' : 'الاستماع بصوت مسموع'}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isMsgSpeaking ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px]">{isMsgSpeaking ? 'جارِ النطق...' : 'استمع'}</span>
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  <p className="whitespace-pre-wrap leading-relaxed text-[13px] sm:text-[14px]">
                    {msg.text}
                  </p>

                  {/* Crisis Emergency Hotlines Banner */}
                  {msg.isCrisisAlert && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-stone-900 border border-rose-300 dark:border-rose-700 shadow-sm text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-black text-rose-700 dark:text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>خطوط المساندة المجانية العاجلة (متاحة الآن):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
                        <a 
                          href="tel:16328" 
                          className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 hover:bg-rose-100 font-bold border border-rose-200"
                        >
                          <span>🇪🇬 مصر: 16328</span>
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href="tel:08008880700" 
                          className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 hover:bg-rose-100 font-bold border border-rose-200"
                        >
                          <span>🇪🇬 مجاني: 08008880700</span>
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href="tel:920033360" 
                          className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 font-bold border border-emerald-200"
                        >
                          <span>🇸🇦 السعودية: 920033360</span>
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href="tel:8004673" 
                          className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 font-bold border border-emerald-200"
                        >
                          <span>🇦🇪 الإمارات: 8004673</span>
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Suggested Interactive Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-700/60 space-y-1.5">
                      <span className="text-[11px] font-bold text-[#52645B] dark:text-stone-300 block">
                        نشاط أو أداة مساندة مقترحة في «نسمة حياة»:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((act) => (
                          <button
                            key={act.id}
                            onClick={() => handleTriggerAction(act)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#E8DDCC] dark:bg-stone-800 dark:hover:bg-stone-700 text-[#355C4A] dark:text-emerald-300 border border-[#E8DDCC] dark:border-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer hover:scale-102"
                          >
                            <span>{act.icon || '🌿'}</span>
                            <span>{act.label}</span>
                            <ArrowLeft className="w-3 h-3 opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reflection Questions Chips */}
                  {msg.reflectionQuestions && msg.reflectionQuestions.length > 0 && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#FAF7F0]/80 dark:bg-stone-800/60 border border-[#E8DDCC]/50 dark:border-stone-700 text-xs text-[#52645B] dark:text-stone-300 space-y-1">
                      <span className="font-bold text-[#355C4A] dark:text-emerald-400 block text-[11px]">
                        💡 للتأمل بهدوء:
                      </span>
                      {msg.reflectionQuestions.map((q, idx) => (
                        <p key={idx} className="italic text-[12px]">
                          • {q}
                        </p>
                      ))}
                    </div>
                  )}

                  <span className="block text-[10px] text-stone-400 mt-1 text-left">
                    {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Thinking / Typing Indicator */}
          {isThinking && (
            <div className="flex items-center gap-2 mr-auto bg-white dark:bg-[#202C27] border border-[#E8DDCC] dark:border-stone-700 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-bounce" />
              <span className="text-xs text-[#52645B] dark:text-stone-400 mr-2">رفيقي يتأمل ويفكر معك...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Chips */}
        <div className="px-4 py-2 bg-stone-50 dark:bg-[#141C19] border-t border-[#E8DDCC]/60 dark:border-stone-800 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#52645B] dark:text-stone-400 shrink-0">
            اقتراحات سريعة:
          </span>
          {QUICK_STARTER_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              disabled={isThinking}
              className="inline-block px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 hover:bg-[#FAF7F0] dark:hover:bg-stone-700 text-[#26332D] dark:text-stone-200 border border-[#E8DDCC] dark:border-stone-700 text-xs font-medium transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Toast / Notification Banner */}
        {toastMessage && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/80 border-t border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200 animate-fadeIn font-medium">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-md cursor-pointer text-amber-700 dark:text-amber-300"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom Input Form */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#141C19] border-t border-[#E8DDCC] dark:border-stone-800">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Speech to text microphone button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isListeningMic
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30 ring-2 ring-rose-400'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#355C4A] dark:text-emerald-400'
              }`}
              title={isListeningMic ? 'جارِ الاستماع لصوتك.. اضغط للإيقاف' : 'تحدث بصوتك مباشرة'}
              aria-label="تسجيل صوتي"
            >
              {isListeningMic ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListeningMic 
                  ? 'رفيقي يستمع لصوتك الآن.. تحدث براحتك...' 
                  : settings.persona === 'child'
                  ? 'اكتب لرفيق طفلك الداخلي.. احكيله اللي في قلبك...'
                  : 'شارك رفيقك بما تشعر به أو تساءل عنه...'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-[#E8DDCC] dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#355C4A] dark:focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              disabled={isThinking}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="p-3 rounded-2xl bg-[#355C4A] hover:bg-[#2A493B] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              aria-label="إرسال"
            >
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>

          {/* Psychological Disclaimer */}
          <div className="mt-2 text-center">
            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
              «رفيقي» رفيق مساند ومصغٍ لك، ومساحتك هنا خاصة وآمنة. رفيقي ليس بديلاً عن الطبيب أو المعالج النفسي المرخص.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
