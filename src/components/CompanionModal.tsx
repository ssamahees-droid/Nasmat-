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
  Bot,
  User,
  Camera,
  Upload,
  CheckCircle2,
  Lock,
  Eye,
  ZapOff,
  Square,
  Play
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

const MIRROR_REFLECTION_JOURNEYS = [
  {
    id: 'listen',
    title: 'اسمع نفسك',
    icon: '🧭',
    desc: 'تفريغ ما يدور في الذهن والقلب دون مقاطعة أو أحكام.',
    prompt: 'أريد أن أقف أمام مرآتي الرقمية الآن لأسمع نفسي بصدق.. ماذا يحدث في داخلي اليوم؟'
  },
  {
    id: 'critic',
    title: 'راجع كلامك لنفسك',
    icon: '💡',
    desc: 'فحص النقد الذاتي القاسي واختبار مدى دقته برحمة.',
    prompt: 'ألاحظ أنني قاسي على نفسي وأنتقدها كثيراً.. ساعدني أراجع هذا الحكم دون جلد ذات.'
  },
  {
    id: 'contain',
    title: 'احتوِ نفسك',
    icon: '🫂',
    desc: 'مساحة احتواء واطمئنان عند التعب والضغط الشديد.',
    prompt: 'أنا متعب وأحتاج أن أحتوي نفسي وأمنحها الأمان والدعم قبل أي شيء.'
  },
  {
    id: 'pattern',
    title: 'افهم نمطك',
    icon: '🔍',
    desc: 'استكشاف نمط متكرر في ردود أفعالك أو طريقة تعاملك مع المواقف.',
    prompt: 'أريد أن أفهم نمطاً متكرراً يزعجني في تفكيري أو ردود أفعالي لنتأمله معاً بهدوء.'
  },
  {
    id: 'child',
    title: 'الطفل الداخلي',
    icon: '🌱',
    desc: 'التواصل مع الجزء الصغير بداخلي والتعرف على احتياجاته القديمة.',
    prompt: 'أريد أن أفتح مساحة لطفلي الداخلي لأطمئنه وأستمع لما يحتاجه.'
  },
  {
    id: 'step',
    title: 'خطوة أقدر أعملها',
    icon: '✨',
    desc: 'تحديد خطوة عملية واحدة صغيرة ومريحة تبدأ بها الآن.',
    prompt: 'بعد أن تأملت ما أعيشه، ما هي أبسط خطوة عملية مريحة يمكنني فعلها الآن؟'
  }
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

  // Digital Mirror ("قابل نفسك — مرآتي الرقمية") state
  const [modalViewTab, setModalViewTab] = useState<'chat' | 'mirror'>('chat');
  const [customUserPhoto, setCustomUserPhoto] = useState<string | null>(() => {
    return localStorage.getItem('nesmat_custom_mirror_photo') || null;
  });
  const [privacyConsentGiven, setPrivacyConsentGiven] = useState<boolean>(() => {
    return localStorage.getItem('nesmat_mirror_consent') === 'true';
  });

  // "صوتي أنا" (Personal Voice Cloning) state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(() => {
    return localStorage.getItem('nesmat_custom_voice_url') || null;
  });
  const [voiceConsentGiven, setVoiceConsentGiven] = useState<boolean>(() => {
    return localStorage.getItem('nesmat_voice_consent') === 'true';
  });
  const [voiceStatus, setVoiceStatus] = useState<'none' | 'recording' | 'processing' | 'ready'>(() => {
    return localStorage.getItem('nesmat_custom_voice_url') ? 'ready' : 'none';
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sampleAudioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-hide toast after 4.5 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Escape key handling
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
  }, [messages, isThinking, modalViewTab]);

  // Handle photo upload for Digital Mirror
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!privacyConsentGiven) {
      setToastMessage('يرجى تأكيد موافقة خصوصية معالجة الصورة محلياً على جهازك أولاً.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setCustomUserPhoto(result);
        localStorage.setItem('nesmat_custom_mirror_photo', result);
        setToastMessage('تم إنشاء مرآتك الرقمية بنجاح 🪞.. أصبحت نسختك جاهزة للتأمل والحوار.');
        setModalViewTab('chat');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCustomPhoto = () => {
    setCustomUserPhoto(null);
    localStorage.removeItem('nesmat_custom_mirror_photo');
    setToastMessage('تمت العودة للرفيق الافتراضي بنجاح.');
  };

  const handleConsentToggle = () => {
    const next = !privacyConsentGiven;
    setPrivacyConsentGiven(next);
    localStorage.setItem('nesmat_mirror_consent', next ? 'true' : 'false');
  };

  const handleVoiceConsentToggle = () => {
    const next = !voiceConsentGiven;
    setVoiceConsentGiven(next);
    localStorage.setItem('nesmat_voice_consent', next ? 'true' : 'false');
  };

  // Voice recording handlers for "صوتي أنا"
  const handleStartRecording = async () => {
    if (!voiceConsentGiven) {
      setToastMessage('يرجى تأكيد موافقة خصوصية استساخ الصوت أولاً.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setVoiceStatus('processing');
        localStorage.setItem('nesmat_custom_voice_url', audioUrl);
        setTimeout(() => {
          setVoiceStatus('ready');
          setToastMessage('تم تجهيز وصقل عينة الصوت الشخصي بنجاح 🎙️!');
        }, 1200);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setVoiceStatus('recording');
      setToastMessage('جارِ التسجيل.. تحدث بصوت واضح لمدة 10 ثوانٍ على الأقل.');
    } catch (err) {
      console.warn('Microphone error:', err);
      setToastMessage('تعذر الوصول إلى الميكروفون، يرجى السماح بالصلاحيات.');
      setVoiceStatus('none');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  const handleClearVoice = () => {
    setRecordedAudioUrl(null);
    setVoiceStatus('none');
    localStorage.removeItem('nesmat_custom_voice_url');
    setToastMessage('تمت إزالة العينة الصوتية الشخصية.');
  };

  // Handle switching personas
  const handleSelectPersona = (targetPersona: CompanionPersona) => {
    if (settings.persona === targetPersona) return;

    voiceService.stop();
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);

    const updated = { ...settings, persona: targetPersona };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);

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

  const handleToggleAnimation = () => {
    const updated = { ...settings, isAnimated: !settings.isAnimated };
    setSettings(updated);
    CompanionEngine.saveSettings(updated);
  };

  const handleClearHistory = () => {
    voiceService.stop();
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);
    const refreshed = CompanionEngine.clearHistory(settings.persona);
    setMessages(refreshed);
    setCurrentExpression('welcome');
  };

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
      onBoundary: () => {
        // Syllabic pulse matching speech boundary
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

  const handleTriggerAction = (action: CompanionAction) => {
    onClose();
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
                <span>رفيقي — مرآتي الرقمية وصوتي</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#355C4A]/10 text-[#355C4A] dark:bg-emerald-500/20 dark:text-emerald-300">
                  {customUserPhoto ? 'نسختك الشخصية 🪞' : (settings.persona === 'child' ? 'طفلي الداخلي 🌱' : 'صورتي الآن 🌿')}
                </span>
              </h3>
              <p className="text-[11px] text-[#52645B] dark:text-stone-400">
                مساحتك الآمنة لتتأمل نفسك، وتحتوي مشاعرك، وتسمع صوتك برحمة
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

        {/* View Tabs: Chat vs Digital Mirror ("قابل نفسك وصوتي أنا") */}
        <div className="bg-linear-to-b from-white to-[#FAF7F0] dark:from-[#141C19] dark:to-[#1A231F] py-2 px-4 border-b border-[#E8DDCC]/70 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setModalViewTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                modalViewTab === 'chat'
                  ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>محادثة رفيقي</span>
            </button>
            <button
              onClick={() => setModalViewTab('mirror')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                modalViewTab === 'mirror'
                  ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span>قابل نفسك وصوتي أنا 🪞🎙️</span>
            </button>
          </div>

          {modalViewTab === 'chat' && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => handleSelectPersona('adult')}
                className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  settings.persona === 'adult'
                    ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                الراشد 🌿
              </button>
              <button
                onClick={() => handleSelectPersona('child')}
                className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  settings.persona === 'child'
                    ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                الطفل 🌱
              </button>
              <button
                onClick={() => handleSelectPersona('father')}
                className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  settings.persona === 'father'
                    ? 'bg-white dark:bg-[#355C4A] text-[#355C4A] dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                الأب الداخلي 🛡️
              </button>
            </div>
          )}
        </div>

        {/* Conditional Main Body: Chat Stream vs Digital Mirror & Voice Cloning Setup */}
        {modalViewTab === 'mirror' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm leading-relaxed bg-[#FAF7F0] dark:bg-[#1A231F]">
            
            {/* Intro Header */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#202C27] border border-[#E8DDCC] dark:border-stone-700 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-base">
                <span>🪞🎙️ وضع «قابل نفسك — مرآتي الرقمية وصوتي أنا»</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                هنا تقف أمام مرآتك الرقمية لتتحدث وتسمع ردودًا بصوت مستوحى من بصمتك الصوتية الصادقة، بالإضافة لتخصيص صورتك الشخصية ومسارات التأمل النفسي الواعية.
              </p>
            </div>

            {/* Custom Photo Upload Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202C27] border border-[#E8DDCC] dark:border-stone-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#355C4A]" />
                  <span>1. تخصيص صورتك الشخصية:</span>
                </h4>
                {customUserPhoto && (
                  <button
                    onClick={handleClearCustomPhoto}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    إزالة الصورة والعودة للافتراضي
                  </button>
                )}
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs">
                <input
                  type="checkbox"
                  id="privacy-consent"
                  checked={privacyConsentGiven}
                  onChange={handleConsentToggle}
                  className="mt-0.5 w-4 h-4 text-[#355C4A] rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="privacy-consent" className="text-stone-700 dark:text-stone-300 leading-relaxed cursor-pointer">
                  <strong className="text-stone-900 dark:text-white block mb-0.5">موافقة الخصوصية للصورة:</strong>
                  أوافق على معالجة صورتي محلياً في متصفحي لإنشاء مرآتي الرقمية دون إرسالها لخادم خارجي.
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!privacyConsentGiven) {
                      setToastMessage('يرجى تأكيد موافقة الخصوصية أولاً.');
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#355C4A] hover:bg-[#2A493B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{customUserPhoto ? 'تغيير الصورة الشخصية' : 'رفع صورتي الشخصية 🪞'}</span>
                </button>

                {customUserPhoto && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم تفعيل صورتك</span>
                  </span>
                )}
              </div>
            </div>

            {/* "صوتي أنا" (My Voice Cloning Setup) Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202C27] border border-[#E8DDCC] dark:border-stone-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span>2. ميزة «صوتي أنا» (استنساخ البصمة الصوتية):</span>
                </h4>
                {voiceStatus === 'ready' && (
                  <button
                    onClick={handleClearVoice}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    إزالة الصوت وإعادة التسجيل
                  </button>
                )}
              </div>

              {/* Voice Consent Checkbox */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs">
                <input
                  type="checkbox"
                  id="voice-consent"
                  checked={voiceConsentGiven}
                  onChange={handleVoiceConsentToggle}
                  className="mt-0.5 w-4 h-4 text-[#355C4A] rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="voice-consent" className="text-stone-700 dark:text-stone-300 leading-relaxed cursor-pointer">
                  <strong className="text-stone-900 dark:text-white block mb-0.5">موافقة صريحة على استخدام الصوت:</strong>
                  أوافق على تسجيل عينة صوتية واستخدامها لتوليد نبرة صوتية رقمية لمساعدتي في التأمل الذاتي داخل رفيقي حصرياً.
                </label>
              </div>

              {/* Recording instructions & status */}
              <div className="space-y-2">
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  سجل عينة صوتية واضحة لمدة 10 ثوانٍ في مكان هادئ (مثال: «أهلاً، أنا أتأمل وأسمع نفسي بصدق وهدوء اليوم»).
                </p>

                <div className="flex items-center gap-3 pt-1">
                  {!isRecordingVoice ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>{voiceStatus === 'ready' ? 'إعادة تسجيل عينة الصوت' : 'بدء تسجيل عينة الصوت 🎙️'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer animate-bounce"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>إيقاف التسجيل</span>
                    </button>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {voiceStatus === 'none' && <span className="text-stone-500">لم يُضف صوت بعد</span>}
                    {voiceStatus === 'recording' && <span className="text-rose-600 animate-pulse">جارٍ التسجيل الآن...</span>}
                    {voiceStatus === 'processing' && <span className="text-amber-600 animate-pulse">جارٍ تجهيز وصقل البصمة الصوتية...</span>}
                    {voiceStatus === 'ready' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>الصوت الشخصي جاهز ومفعّل</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Sample Playback Preview */}
                {recordedAudioUrl && voiceStatus === 'ready' && (
                  <div className="pt-2 flex items-center gap-3">
                    <audio ref={sampleAudioRef} src={recordedAudioUrl} controls className="h-9 w-full max-w-xs" />
                  </div>
                )}
              </div>
            </div>

            {/* Preview of Digital Mirror Avatar */}
            <div className="flex flex-col items-center justify-center py-4 bg-white/60 dark:bg-stone-900/40 rounded-2xl border border-dashed border-[#E8DDCC] dark:border-stone-700">
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#355C4A]/30 shadow-lg">
                <CompanionAvatar
                  persona={settings.persona}
                  expression={currentExpression}
                  isSpeaking={isSpeaking}
                  isListening={isListeningMic}
                  size="md"
                  isAnimated={settings.isAnimated}
                  allowAnimationToggle={false}
                  customPhoto={customUserPhoto}
                />
              </div>
              <span className="mt-2 text-xs font-bold text-stone-700 dark:text-stone-300">
                {customUserPhoto ? 'مرآتك الرقمية الشخصية نشطة' : 'المرآة الافتراضية نشطة'}
              </span>
            </div>

            {/* 6 Guided Self-Reflection Journeys */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>اختر مساراً للتأمل الذاتي مع مرآتك وصوتك:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MIRROR_REFLECTION_JOURNEYS.map((journey) => (
                  <button
                    key={journey.id}
                    onClick={() => {
                      setModalViewTab('chat');
                      handleSendMessage(journey.prompt);
                    }}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#202C27] hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 border border-[#E8DDCC] dark:border-stone-700 text-right transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span>{journey.icon}</span>
                          <span>{journey.title}</span>
                        </span>
                        <ArrowLeft className="w-3.5 h-3.5 text-stone-400 group-hover:-translate-x-1 transition-transform" />
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                        {journey.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Chat Stream Container */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm leading-relaxed">
            <div className="flex flex-col items-center justify-center py-2 bg-stone-100/50 dark:bg-stone-900/30 rounded-2xl mb-2">
              <CompanionAvatar
                persona={settings.persona}
                expression={currentExpression}
                isSpeaking={isSpeaking}
                isListening={isListeningMic}
                size="md"
                isAnimated={settings.isAnimated}
                allowAnimationToggle={true}
                onToggleAnimation={handleToggleAnimation}
                customPhoto={customUserPhoto}
              />
            </div>
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
                    {!isUser && (
                      <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-stone-100 dark:border-stone-700/60">
                        <span className="text-[11px] font-bold text-[#355C4A] dark:text-emerald-400 flex items-center gap-1">
                          {customUserPhoto ? '🪞 مرآتك الرقمية' : (settings.persona === 'child' ? '🌱 رفيق الطفل الداخلي' : '🌿 الرفيق البشري')}
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

                    <p className="whitespace-pre-wrap leading-relaxed text-[13px] sm:text-[14px]">
                      {msg.text}
                    </p>

                    {msg.isCrisisAlert && (
                      <div className="mt-3 p-3 rounded-xl bg-white dark:bg-stone-900 border border-rose-300 dark:border-rose-700 shadow-sm text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-black text-rose-700 dark:text-rose-400">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>خطوط المساندة المجانية العاجلة (متاحة الآن):</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
                          <a href="tel:16328" className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 hover:bg-rose-100 font-bold border border-rose-200">
                            <span>🇪🇬 مصر: 16328</span>
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                          <a href="tel:08008880700" className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 hover:bg-rose-100 font-bold border border-rose-200">
                            <span>🇪🇬 مجاني: 08008880700</span>
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                          <a href="tel:920033360" className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 font-bold border border-emerald-200">
                            <span>🇸🇦 السعودية: 920033360</span>
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                          <a href="tel:8004673" className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 font-bold border border-emerald-200">
                            <span>🇦🇪 الإمارات: 8004673</span>
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}

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

                    {msg.reflectionQuestions && msg.reflectionQuestions.length > 0 && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-[#FAF7F0]/80 dark:bg-stone-800/60 border border-[#E8DDCC]/50 dark:border-stone-700 text-xs text-[#52645B] dark:text-stone-300 space-y-1">
                        <span className="font-bold text-[#355C4A] dark:text-emerald-400 block text-[11px]">
                          💡 للتأمل بهدوء أمام مرآتك:
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

            {isThinking && (
              <div className="flex items-center gap-2 mr-auto bg-white dark:bg-[#202C27] border border-[#E8DDCC] dark:border-stone-700 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#355C4A] animate-bounce" />
                <span className="text-xs text-[#52645B] dark:text-stone-400 mr-2">مرآتك الرقمية تتأمل وتفكر معك...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Quick Starter Chips */}
        {modalViewTab === 'chat' && (
          <div className="px-4 py-2 bg-stone-50 dark:bg-[#141C19] border-t border-[#E8DDCC]/60 dark:border-stone-800 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#52645B] dark:text-stone-400 shrink-0">
              بدايات سريعة:
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
        )}

        {/* Toast Notification */}
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
        {modalViewTab === 'chat' && (
          <div className="p-3 sm:p-4 bg-white dark:bg-[#141C19] border-t border-[#E8DDCC] dark:border-stone-800">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
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
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListeningMic 
                    ? 'مرآتك الرقمية تستمع لصوتك الآن.. تحدث براحتك...' 
                    : settings.persona === 'child'
                    ? 'اكتب لرفيق طفلك الداخلي.. احكيله اللي في قلبك...'
                    : 'شارك مرآتك الرقمية بما تشعر به أو تساءل عنه...'
                }
                className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-[#E8DDCC] dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#355C4A] dark:focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                disabled={isThinking}
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-3 rounded-2xl bg-[#355C4A] hover:bg-[#2A493B] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                aria-label="إرسال"
              >
                <Send className="w-5 h-5 rtl:rotate-180" />
              </button>
            </form>

            <div className="mt-2 text-center">
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                «مرآتي الرقمية وصوتي» وسيلة للتأمل الذاتي والوعي النفسي، وليست بديلاً عن العلاج النفسي الطبي المتخصص.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
