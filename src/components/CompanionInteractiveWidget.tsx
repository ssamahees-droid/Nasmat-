import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Maximize2, 
  Minimize2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Send,
  MessageCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { CompanionAvatar, CompanionExpression, CompanionPersona } from './CompanionAvatar';
import { CompanionEngine } from '../services/companionEngine';
import { voiceService } from '../services/voiceService';
import { CompanionUserSettings, CompanionMessage } from '../types/companion';

interface CompanionInteractiveWidgetProps {
  currentTab: string;
  onOpenFullModal: () => void;
  isFullModalOpen: boolean;
  onNavigate?: (tab: string) => void;
  onOpenModalByName?: (name: string, data?: any) => void;
}

export const CompanionInteractiveWidget: React.FC<CompanionInteractiveWidgetProps> = ({
  currentTab,
  onOpenFullModal,
  isFullModalOpen,
  onNavigate,
  onOpenModalByName
}) => {
  // Widget display mode: 'docked' (floating character), 'card' (interactive companion box), 'hidden' (discreet corner tab)
  const [widgetMode, setWidgetMode] = useState<'docked' | 'card' | 'hidden'>(() => {
    const saved = localStorage.getItem('nesmat_character_widget_mode');
    return (saved as 'docked' | 'card' | 'hidden') || 'docked';
  });

  const [settings, setSettings] = useState<CompanionUserSettings>(() => CompanionEngine.getSettings());
  const [expression, setExpression] = useState<CompanionExpression>('welcome');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Active dialogue line
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Sync settings when changed elsewhere
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(CompanionEngine.getSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update contextual greeting based on current tab when navigating across the platform
  useEffect(() => {
    // If speaking, do not interrupt
    if (voiceService.isSpeaking()) return;

    let contextualText = '';
    let targetExpression: CompanionExpression = 'welcome';

    switch (currentTab) {
      case 'breathe':
        contextualText = 'أنا حاضر معك في جلسة التنفس.. خذ شهيقاً عميقاً واستعد توازنك وسكينتك 🌿';
        targetExpression = 'empathy';
        break;

      case 'games':
        contextualText = 'ألعاب الاسترخاء وسيلة علمية لتخفيف نشاط مركز التوتر وتجديد طاقتك الذهنية 🎮';
        targetExpression = 'encouraging';
        break;

      case 'rescue':
        contextualText = 'أنا بجانبك في مساحة الإنقاذ.. أنت في أمان تام الآن، خذ نفساً والحلول موجودة 🛡️';
        targetExpression = 'empathy';
        break;

      case 'explore':
        contextualText = 'المعرفة النفسية الواعية تزيل ضباب الحيرة والخوف من المشاعر 📚';
        targetExpression = 'listening';
        break;

      case 'journey':
        contextualText = 'كل يوم تسجل فيه مشاعرك ووعيك هو خطوة راسخة في تعافيك 📈';
        targetExpression = 'encouraging';
        break;

      case 'self-discovery':
        contextualText = 'فهم ذاتك واكتشاف أعماقك هو أعظم استثمار لسلامك النفسي 🧭';
        targetExpression = 'thinking';
        break;

      case 'practice':
        contextualText = 'الممارسة الهادئة والتدريب اليومي هما ما يبني مرونتك النفسية 🍃';
        targetExpression = 'encouraging';
        break;

      case 'support':
        contextualText = 'طلب المساندة قوة وشجاعة، ولست مضطراً لحمل كل شيء بمفردك 🤝';
        targetExpression = 'empathy';
        break;

      default:
        contextualText = 'مرحباً بك في نسمة حياة.. أنا رفيقي، حاضر معك لأسمعك وأساند خطواتك 🌿';
        targetExpression = 'welcome';
        break;
    }

    setActiveSpeechText(contextualText);
    setExpression(targetExpression);
  }, [currentTab]);

  // Persist display mode
  const handleChangeWidgetMode = (mode: 'docked' | 'card' | 'hidden') => {
    setWidgetMode(mode);
    localStorage.setItem('nesmat_character_widget_mode', mode);
  };

  // Speak current text with Web Speech API
  const handleSpeakCurrent = () => {
    if (isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
      return;
    }

    if (!activeSpeechText) return;

    setIsSpeaking(true);
    setExpression('speaking');

    const personaConfig = settings.persona === 'child'
      ? { pitch: 1.18, rate: 0.96 }
      : settings.persona === 'father'
      ? { pitch: 0.90, rate: 0.90 }
      : { pitch: 0.98, rate: 0.92 };

    voiceService.speak(activeSpeechText, {
      onEnd: () => {
        setIsSpeaking(false);
        setExpression('welcome');
      },
      onError: () => {
        setIsSpeaking(false);
        setExpression('welcome');
      }
    }, personaConfig);
  };

  // Mic speech recognition
  const handleToggleMic = () => {
    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningMic(false);
      setExpression('welcome');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('التعرف على الصوت غير مدعوم في هذا المتصفح.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-EG';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningMic(true);
        setExpression('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
        setExpression('welcome');
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListeningMic(false);
      setExpression('welcome');
    }
  };

  // Send message to local/AI engine
  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isThinking) return;

    setInputText('');
    setIsThinking(true);
    setExpression('thinking');

    try {
      const history = CompanionEngine.getHistory();
      const userMsg: CompanionMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: textToSend,
        timestamp: Date.now()
      };
      const updatedHistory = [...history, userMsg];
      CompanionEngine.saveHistory(updatedHistory);

      const response = await CompanionEngine.generateResponse(
        textToSend,
        settings.persona,
        updatedHistory
      );

      const finalHistory = [...updatedHistory, response];
      CompanionEngine.saveHistory(finalHistory);

      setActiveSpeechText(response.text);
      setExpression(response.expression || 'welcome');

      // Auto-speak if enabled or user asked by voice
      if (settings.isVoiceAutoPlay || isListeningMic) {
        setIsSpeaking(true);
        voiceService.speak(response.text, {
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false)
        });
      }
    } catch (err) {
      console.warn('Companion query error:', err);
      setActiveSpeechText('أنا معك وأسمعك دائماً.. ما الذي يثقل بالك في هذه اللحظة؟');
      setExpression('welcome');
    } finally {
      setIsThinking(false);
    }
  };

  // If the full modal is currently open, hide the floating widget to avoid visual duplication
  if (isFullModalOpen) {
    return null;
  }

  // 1. HIDDEN MODE: Minimized unobtrusive floating pill
  if (widgetMode === 'hidden') {
    return (
      <div 
        className="fixed bottom-20 lg:bottom-5 left-4 z-40 select-none font-cairo transition-transform animate-fade-in"
        dir="rtl"
      >
        <button
          onClick={() => handleChangeWidgetMode('docked')}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1C2822]/90 hover:bg-[#25382F] text-[#F7F3E9] border border-emerald-500/40 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-xs font-bold"
          title="إظهار شخصية نسمة حياة"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>شخصية نسمة حياة 🌿</span>
          <Eye className="w-3.5 h-3.5 text-emerald-300" />
        </button>
      </div>
    );
  }

  // 2. DOCKED MODE: Floating character with speech bubble preview
  if (widgetMode === 'docked') {
    return (
      <div 
        className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6 z-40 select-none font-cairo max-w-[280px] sm:max-w-[340px]"
        dir="rtl"
      >
        <div className="flex items-end gap-2.5">
          {/* Main Animated Character Avatar (Click to expand) */}
          <div className="relative group shrink-0">
            {/* Quick close/hide button on hover/tap */}
            <button
              onClick={() => handleChangeWidgetMode('hidden')}
              className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-stone-900/80 text-stone-300 hover:text-white flex items-center justify-center text-[10px] z-30 opacity-70 hover:opacity-100 transition-opacity border border-white/20 cursor-pointer"
              title="إخفاء مؤقت"
            >
              <EyeOff className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleChangeWidgetMode('card')}
              className="relative block rounded-full focus:outline-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="تحدث مع شخصية نسمة حياة"
            >
              <CompanionAvatar
                persona={settings.persona}
                expression={expression}
                isSpeaking={isSpeaking}
                isListening={isListeningMic}
                size="sm"
                isAnimated={true}
              />
            </button>
          </div>

          {/* Interactive Speech Bubble */}
          <div className="bg-white/95 dark:bg-[#1C2822]/95 backdrop-blur-md p-3 rounded-2xl rounded-bl-xs border border-[#E6E8D8] dark:border-stone-700 shadow-xl shadow-black/10 text-right space-y-2 max-w-[240px] sm:max-w-[270px]">
            {/* Header info */}
            <div className="flex items-center justify-between gap-1 text-[11px] text-[#52645B] dark:text-stone-300 border-b border-[#E6E8D8]/60 dark:border-stone-700/60 pb-1.5">
              <span className="font-bold text-[#174C3C] dark:text-emerald-400">
                شخصية نسمة حياة
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSpeakCurrent}
                  className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-[#174C3C] dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  title={isSpeaking ? 'إيقاف الصوت' : 'استمع بصوت الشخصية'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleChangeWidgetMode('card')}
                  className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-[#174C3C] dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  title="توسيع للوحة التفاعل"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Context message text */}
            <p className="text-xs text-[#26332D] dark:text-[#EDE8DF] leading-relaxed line-clamp-3">
              {activeSpeechText}
            </p>

            {/* Quick interactive buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <button
                onClick={() => handleChangeWidgetMode('card')}
                className="text-[11px] font-bold text-[#174C3C] dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3 h-3" />
                <span>تفاعل وتحدث</span>
              </button>

              <button
                onClick={onOpenFullModal}
                className="text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                title="فتح الجلسة الكاملة"
              >
                جلسة كاملة ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CARD MODE: Comprehensive Floating Companion Card (Responsive, non-modal, interactive)
  return (
    <div 
      className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6 z-40 select-none font-cairo w-[320px] sm:w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#1A2520] border-2 border-[#174C3C]/30 dark:border-emerald-500/30 rounded-3xl shadow-2xl shadow-black/25 backdrop-blur-xl overflow-hidden transition-all duration-300 animate-scale-up"
      dir="rtl"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#174C3C] to-[#254234] text-white">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black tracking-wide">رفيقي النفسي الذكي</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
            🌿 المرشد المرافق
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Audio speech trigger */}
          <button
            onClick={handleSpeakCurrent}
            className={`p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer ${isSpeaking ? 'text-emerald-300' : 'text-white/90 hover:text-white'}`}
            title={isSpeaking ? 'إيقاف الصوت' : 'استماع للرسالة'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Full modal */}
          <button
            onClick={onOpenFullModal}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="فتح نافذة الجلسة الكاملة"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Minimize to docked */}
          <button
            onClick={() => handleChangeWidgetMode('docked')}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="تصغير"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* Hide completely */}
          <button
            onClick={() => handleChangeWidgetMode('hidden')}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="إخفاء مؤقت"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: Animated Character + Living Speech Box */}
      <div className="p-4 space-y-3.5">
        <div className="flex items-center gap-4">
          {/* Animated Rig (Medium Size) */}
          <div className="shrink-0">
            <CompanionAvatar
              persona={settings.persona}
              expression={expression}
              isSpeaking={isSpeaking}
              isListening={isListeningMic}
              size="md"
              isAnimated={true}
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

          {/* Character Speech Bubble */}
          <div className="flex-1 bg-[#F7F3E9] dark:bg-[#121A16] p-3 rounded-2xl border border-[#E6E8D8] dark:border-stone-700 text-right space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#52645B] dark:text-stone-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {isThinking ? 'يفكر ويتأمل معك...' : isSpeaking ? 'يتحدث معك الآن...' : 'حاضر معك...'}
              </span>
              <button
                onClick={handleSpeakCurrent}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:text-emerald-600 transition-colors cursor-pointer"
                title={isSpeaking ? 'إيقاف الصوت' : 'استمع للصوت'}
              >
                {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-500" /> : <Volume2 className="w-3 h-3" />}
                <span>{isSpeaking ? 'إيقاف' : 'استمع'}</span>
              </button>
            </div>

            <p className="text-xs text-[#26332D] dark:text-[#EDE8DF] leading-relaxed max-h-[85px] overflow-y-auto pr-1">
              {activeSpeechText}
            </p>
          </div>
        </div>

        {/* Quick Feeling Tap Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => handleSendQuery('حاسس بضغط وتوتر ومحتاج أهدى')}
            className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-[#174C3C] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-medium transition-colors cursor-pointer"
          >
            🌬️ حاسس بتوتر
          </button>
          <button
            onClick={() => handleSendQuery('عايز أفضفض بكل اللي في قلبي بدون أحكام')}
            className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-[11px] font-medium transition-colors cursor-pointer"
          >
            💭 عايز أفضفض
          </button>
          <button
            onClick={() => handleSendQuery('إيه أحسن خطوة أعملها دلوقتي لاستعادة طاقتي؟')}
            className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[11px] font-medium transition-colors cursor-pointer"
          >
            ⚡ محتاج خطوة عملية
          </button>
        </div>

        {/* Quick Input Bar with Mic & Send */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#E6E8D8]/70 dark:border-stone-700/70">
          <button
            onClick={handleToggleMic}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isListeningMic 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700'
            }`}
            title={isListeningMic ? 'إيقاف المايكروفون' : 'تحدث بالصوت'}
          >
            {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendQuery();
              }
            }}
            placeholder="اكتب لشخصية نسمة حياة..."
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-[#121A16] border border-[#E6E8D8] dark:border-stone-700 text-[#26332D] dark:text-[#EDE8DF] focus:outline-hidden focus:border-[#174C3C] dark:focus:border-emerald-500"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!inputText.trim() || isThinking}
            className="p-2 rounded-xl bg-[#174C3C] hover:bg-[#2A493B] disabled:opacity-40 text-white transition-colors cursor-pointer"
            title="إرسال"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
