import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  Volume2, 
  RotateCcw, 
  Save, 
  Smile, 
  BookOpen, 
  ShieldCheck,
  AlertCircle,
  Radio,
  FileText
} from 'lucide-react';
import { storage, ThoughtCategory } from '../services/storage';
import { MoodValue } from '../types';

interface VoiceJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_MAP: Record<ThoughtCategory, { label: string; emoji: string }> = {
  awareness: { label: 'وعي باللحظة', emoji: '🌿' },
  gratitude: { label: 'امتنان', emoji: '🍯' },
  reframing: { label: 'إعادة صياغة', emoji: '🔄' },
  release: { label: 'تحرير وتفريغ', emoji: '🍃' },
  gentleness: { label: 'رفق بالذات', emoji: '🤍' }
};

export const VoiceJournalModal: React.FC<VoiceJournalModalProps> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ThoughtCategory>('awareness');
  const [mood, setMood] = useState<MoodValue>('good');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      stopRecording();
      setTranscript('');
      setInterimTranscript('');
      setTitle('');
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const startRecording = () => {
    setErrorMessage(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('متصفحك الحالي لا يدعم تحويل الكلام الصوتي إلى نص مباشرة. يمكنك كتابة النص أدناه أو استخدام وضع المحاكاة الصوتية.');
      // Fallback simulation mode
      setIsRecording(true);
      simulateSpeechInput();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalSegment += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalSegment) {
          setTranscript(prev => (prev ? prev + ' ' + finalSegment.trim() : finalSegment.trim()));
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('تم رفض إذن استخدام الميكروفون من المتصفح. يرجى السماح بالميكروفون لتسجيل صوتك.');
        } else {
          setErrorMessage('حدث خطأ أثناء التقاط الصوت. يลอง المحاولة مرة أخرى.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setErrorMessage('تعذر بدء التعرف على الصوت في هذا البيئة. يمكنك إملاء خواطرك يدوياً.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Fallback simulator if speech recognition API is unavailable in sandbox
  const simulateSpeechInput = () => {
    const samples = [
      'أشعر اليوم برغبة في الهدوء وأخذ قسط من الراحة بعيداً عن زحام المهام...',
      'تراودني فكرة أنني أتحمل فوق طاقتني، ولكني قررت اليوم أن أتعامل مع نفسي برفق أكبر.',
      'أنا ممتن للسكينة التي شعرت بها أثناء تمرين التنفس العميق هذا الصباح 🌿.'
    ];
    const chosen = samples[Math.floor(Math.random() * samples.length)];
    let index = 0;
    const interval = setInterval(() => {
      setTranscript(chosen.substring(0, index + 1));
      index++;
      if (index >= chosen.length) {
        clearInterval(interval);
        setIsRecording(false);
      }
    }, 50);
  };

  if (!isOpen) return null;

  const handleSaveVoiceNote = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = (transcript + ' ' + interimTranscript).trim();
    if (!finalContent) {
      setErrorMessage('لا يوجد نص مسجل للحفظ. يرجى التحدث أو كتابة خواطرك أولاً.');
      return;
    }

    const finalTitle = title.trim() || 'مذكرة صوتية واعية 🎙️';

    // Save to thought posts
    storage.addThoughtPost({
      title: finalTitle,
      content: finalContent,
      category: category,
      mood: mood,
      promptUsed: 'تسجيل صوتي مباشر — مذكرة وعي',
      isFavorite: false
    });

    // Also save to personal notes
    storage.addNote(finalContent, mood);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-cairo">
      <div 
        className="bg-[#F7F3E9] dark:bg-[#14271F] p-6 sm:p-7 rounded-3xl border border-[#174C3C]/25 dark:border-[#A9C5A0]/30 max-w-lg w-full space-y-5 text-right shadow-2xl overflow-y-auto max-h-[90vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-[#174C3C] dark:text-[#F7F3E9]">
            <span className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 flex items-center justify-center text-base">
              🎙️
            </span>
            <span>المذكرة الصوتية الواعية</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:bg-black/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveSuccess ? (
          <div className="p-8 text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-base font-bold text-[#174C3C] dark:text-[#F7F3E9]">
              تم حفظ مذكرتك الصوتية بنجاح 🌿
            </h3>
            <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/70">
              تم تحويل كلامك إلى نص وحفظه في مذكراتك اليومية وتدوينات الوعي.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSaveVoiceNote} className="space-y-4">
            
            {/* Instruction description */}
            <p className="text-xs text-[#13251E]/80 dark:text-[#F7F3E9]/80 leading-relaxed">
              تحدث بحرية عما يدور في ذهنك وعاطفتك الآن. سيقوم نظام تحويل الكلام إلى نص (Speech-to-Text) بتدوين كلماتك لحظة بلحظة.
            </p>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Recording Animation & Button */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1914] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                {isRecording && (
                  <div className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
                )}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-600 hover:bg-rose-700 scale-105' 
                      : 'bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:text-[#0D1914]'
                  }`}
                  title={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل الصوتي'}
                >
                  {isRecording ? <MicOff className="w-7 h-7 animate-pulse" /> : <Mic className="w-7 h-7" />}
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-[#174C3C] dark:text-[#F7F3E9] block">
                  {isRecording ? 'جاري الاستماع والتسجيل الصوتي... 🎙️' : 'اضغط للميكروفون وابدأ بالتحدث'}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 block">
                  {isRecording ? 'تحدث ببطء ووضوح باللغة العربية' : 'أو انقر للتسجيل التلقائي'}
                </span>
              </div>
            </div>

            {/* Live Transcription Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-[#174C3C] dark:text-[#F7F3E9] flex items-center justify-between">
                <span>النص المحول (الكلام إلى نص):</span>
                {transcript && (
                  <button
                    type="button"
                    onClick={() => { setTranscript(''); setInterimTranscript(''); }}
                    className="text-[10px] text-rose-600 hover:underline"
                  >
                    مسح النص
                  </button>
                )}
              </label>
              <textarea
                value={transcript + (interimTranscript ? ' ' + interimTranscript : '')}
                onChange={e => setTranscript(e.target.value)}
                rows={4}
                placeholder="سيظهر النص هنا تلقائياً أثناء حديثك، أو يمكنك كتابة خواطرك يدوياً هنا..."
                required
                className="w-full p-3 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-2xl focus:outline-hidden text-[#13251E] dark:text-[#F7F3E9] leading-relaxed"
              />
            </div>

            {/* Note Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold block text-[#174C3C] dark:text-[#F7F3E9]">عنوان المذكرة (اختياري):</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: خواطر الصباح، تأمل هادئ..."
                className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl text-[#13251E] dark:text-[#F7F3E9]"
              />
            </div>

            {/* Mood & Category selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold block text-[#174C3C] dark:text-[#F7F3E9]">الحالة الشعورية:</label>
                <select
                  value={mood}
                  onChange={e => setMood(e.target.value as MoodValue)}
                  className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl text-[#13251E] dark:text-[#F7F3E9]"
                >
                  <option value="good">كويس ومنتعش 😊</option>
                  <option value="fair">مقبول ومتوازن 🌿</option>
                  <option value="confused">مشوش التفكير 🤔</option>
                  <option value="not_good">مجهد ومضغوط 😔</option>
                  <option value="exhausted">منهك جداً 😫</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold block text-[#174C3C] dark:text-[#F7F3E9]">تصنيف التدوينة:</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ThoughtCategory)}
                  className="w-full p-2.5 text-xs bg-white dark:bg-[#0D1914] border border-[#174C3C]/20 dark:border-[#A9C5A0]/20 rounded-xl text-[#13251E] dark:text-[#F7F3E9]"
                >
                  {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.emoji} {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#174C3C]/10 dark:border-[#A9C5A0]/15">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-white dark:text-[#0D1914] text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>حفظ في المذكرات 📝</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
