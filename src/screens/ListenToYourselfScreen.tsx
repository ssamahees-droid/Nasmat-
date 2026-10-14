import React, { useState } from 'react';
import { 
  Heart, 
  Brain, 
  Shield, 
  Sparkles, 
  MessageCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Smile,
  BookOpen
} from 'lucide-react';
import { storage } from '../services/storage';
import { TextAudioPlayer } from '../components/TextAudioPlayer';

interface ListenToYourselfScreenProps {
  onNavigate: (tab: string) => void;
  onOpenCompanionPersona?: (persona: 'child' | 'adult' | 'father') => void;
}

export const ListenToYourselfScreen: React.FC<ListenToYourselfScreenProps> = ({
  onNavigate
}) => {
  const [activePerspective, setActivePerspective] = useState<'child' | 'adult' | 'father'>('adult');
  const [userInput, setUserInput] = useState('');
  const [dialogueLog, setDialogueLog] = useState<{ sender: 'user' | 'perspective'; text: string; time: string }[]>([
    {
      sender: 'perspective',
      text: 'مرحباً بك في مساحة «اسمع نفسك». هنا يمكنك استكشاف ما يدور بداخلك من خلال ثلاثة أصوات داخلية متوازنة: الطفل الداخلي (للتعبير عن المشاعر والاحتياجات بأمان)، الراشد المتزن (لفهم الواقع والأفكار بموضوعية)، والأب الداخلي (لتقديم الاحتواء والحماية بحنان). اختر المنظور الذي تحتاجه الآن.',
      time: 'الآن'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newText = userInput.trim();
    const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    let responseText = '';
    if (activePerspective === 'child') {
      responseText = `يا حبيبي، أنا سامعك وحاسس بوجعك أو خوفك تماماً. مش لوحدك، وعادي جداً تحس كده. تعال نبكي أو نهدى مع بعض من غير لوم ولا خجل 🤍.`;
    } else if (activePerspective === 'adult') {
      responseText = `دعنا نتأمل الموقف بموضوعية وهدوء: ما الذي حدث بالضبط؟ ما هي الحقائق وما هي المخاوف الافتراضية؟ لدينا القدرة على التعامل مع هذا الموقف بخطوات عملية هادئة 🌿.`;
    } else {
      responseText = `يا بني/يا بنتي، أنت غالي عليّ جداً وأنا فخور بكل خطوة تخطوها. الأمور ستتحسن، وأنا هنا لأحميك وأحتويك مهما كانت الظروف دون قسوة أو جلد ذات 🛡️.`;
    }

    setDialogueLog(prev => [
      ...prev,
      { sender: 'user', text: newText, time: timeStr },
      { sender: 'perspective', text: responseText, time: timeStr }
    ]);

    storage.addNote(`حوار في «اسمع نفسك» (${activePerspective}): ${newText}`);
    setUserInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 animate-fadeIn font-cairo">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 rounded-3xl p-6 sm:p-8 shadow-xs mb-8 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#A9C5A0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 bg-[#174C3C]/10 dark:bg-[#A9C5A0]/15 text-[#174C3C] dark:text-[#A9C5A0] font-jetbrains text-xs font-bold rounded-full border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
            الركيزة الثانية // الحوار الداخلي الواعي
          </span>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-1.5 rounded-xl border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 text-xs font-bold text-[#174C3C] dark:text-[#F7F3E9] hover:bg-[#E6E8D8] dark:hover:bg-[#1B342A] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
        <h1 className="text-2xl sm:text-4xl font-syne font-black text-[#174C3C] dark:text-[#F7F3E9] mb-3">
          اسمع نفسك — الطفل والراشد والأب
        </h1>
        <p className="text-[#13251E]/75 dark:text-[#F7F3E9]/75 text-sm sm:text-base max-w-3xl leading-relaxed">
          مساحة مستقلة لفهم مشاعرك واحتياجاتك العميقة عبر ثلاثة أصوات أو منظورات داخلية متوازنة تساعدك على احتواء ألمك، ترتيب أفكارك، واستعادة الأمان الداخلي.
        </p>
      </div>

      {/* Perspective Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Child Perspective Card */}
        <button
          onClick={() => setActivePerspective('child')}
          className={`text-right p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activePerspective === 'child'
              ? 'bg-[#D98F83]/15 dark:bg-[#D98F83]/20 border-[#D98F83] shadow-xs'
              : 'bg-white dark:bg-[#14271F] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:border-[#D98F83]/50'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#D98F83]/20 text-[#D98F83] flex items-center justify-center mb-4 border border-[#D98F83]/30">
              <Smile className="w-6 h-6" />
            </div>
            <span className="font-jetbrains text-[10px] uppercase tracking-widest text-[#D98F83] font-bold">المنظور الأول</span>
            <h3 className="text-xl font-syne font-black text-[#174C3C] dark:text-[#F7F3E9] mt-1 mb-2">الطفل الداخلي</h3>
            <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/75 leading-relaxed">
              مساحة للتعبير عن المشاعر العفوية، الخوف، التعب، والاحتياجات العاطفية الدفينة بلا أحكام.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#D98F83]">
            <span>تفعيل منظور الطفل</span>
            <CheckCircle2 className={`w-4 h-4 ${activePerspective === 'child' ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </button>

        {/* Adult Perspective Card */}
        <button
          onClick={() => setActivePerspective('adult')}
          className={`text-right p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activePerspective === 'adult'
              ? 'bg-[#A9C5A0]/20 dark:bg-[#193127] border-[#174C3C] dark:border-[#A9C5A0] shadow-xs'
              : 'bg-white dark:bg-[#14271F] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:border-[#174C3C]'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#174C3C]/10 dark:bg-[#A9C5A0]/20 text-[#174C3C] dark:text-[#A9C5A0] flex items-center justify-center mb-4 border border-[#174C3C]/20 dark:border-[#A9C5A0]/30">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-jetbrains text-[10px] uppercase tracking-widest text-[#174C3C] dark:text-[#A9C5A0] font-bold">المنظور الثاني</span>
            <h3 className="text-xl font-syne font-black text-[#174C3C] dark:text-[#F7F3E9] mt-1 mb-2">الراشد المتزن</h3>
            <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/75 leading-relaxed">
              مساحة لفهم المواقف بموضوعية، التمييز بين الحقائق والأفكار، واكتشاف الخيارات والحلول العملية.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#174C3C] dark:text-[#A9C5A0]">
            <span>تفعيل منظور الراشد</span>
            <CheckCircle2 className={`w-4 h-4 ${activePerspective === 'adult' ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </button>

        {/* Father Perspective Card */}
        <button
          onClick={() => setActivePerspective('father')}
          className={`text-right p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activePerspective === 'father'
              ? 'bg-[#D5A65A]/20 dark:bg-[#D5A65A]/20 border-[#D5A65A] shadow-xs'
              : 'bg-white dark:bg-[#14271F] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 hover:border-[#D5A65A]/50'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#D5A65A]/20 text-[#D5A65A] flex items-center justify-center mb-4 border border-[#D5A65A]/30">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-jetbrains text-[10px] uppercase tracking-widest text-[#D5A65A] font-bold">المنظور الثالث</span>
            <h3 className="text-xl font-syne font-black text-[#174C3C] dark:text-[#F7F3E9] mt-1 mb-2">الأب الداخلي</h3>
            <p className="text-xs text-[#13251E]/70 dark:text-[#F7F3E9]/75 leading-relaxed">
              منظور حواري أبوي حنون يقدم الاحتواء، التفهم، الحماية، والتوجيه الإيجابي غير الحُكمي.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#D5A65A]">
            <span>تفعيل منظور الأب</span>
            <CheckCircle2 className={`w-4 h-4 ${activePerspective === 'father' ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </button>

      </div>

      {/* Interactive Dialogue Box */}
      <div className="bg-white dark:bg-[#14271F] border border-[#174C3C]/15 dark:border-[#A9C5A0]/20 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#174C3C]/10 dark:border-[#A9C5A0]/15 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#174C3C] dark:bg-[#A9C5A0] animate-pulse" />
            <span className="font-syne font-bold text-sm sm:text-base text-[#174C3C] dark:text-[#F7F3E9]">
              حوار مباشر مع المنظور الحالي: {activePerspective === 'child' ? 'الطفل الداخلي 🧸' : activePerspective === 'adult' ? 'الراشد المتزن 🧠' : 'الأب الداخلي 🛡️'}
            </span>
          </div>
          <span className="font-jetbrains text-xs text-[#13251E]/50 dark:text-[#F7F3E9]/50">حوار آمن وخاص</span>
        </div>

        {/* Message Log */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
          {dialogueLog.map((msg, index) => (
            <div 
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
            >
              <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-[#174C3C] text-[#F7F3E9] border-[#174C3C] shadow-2xs'
                  : 'bg-[#E6E8D8]/50 dark:bg-[#193127] border-[#174C3C]/15 dark:border-[#A9C5A0]/20 text-[#13251E] dark:text-[#F7F3E9]'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2 text-[10px] font-jetbrains opacity-80">
                    <span className="font-bold">{msg.sender === 'user' ? 'أنت' : activePerspective === 'child' ? 'الطفل الداخلي' : activePerspective === 'adult' ? 'الراشد المتزن' : 'الأب الداخلي'}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>
                  {msg.sender !== 'user' && (
                    <TextAudioPlayer 
                      text={msg.text} 
                      id={`listen_msg_${index}`} 
                      variant="inline" 
                      label="اسمع الرد" 
                    />
                  )}
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              activePerspective === 'child'
                ? 'شارك شعورك أو ما تحتاجه كطفل داخلي...'
                : activePerspective === 'adult'
                ? 'اطرح الموقف أو المشكلة لنناقشها بموضوعية...'
                : 'اطلب النصيحة أو الاحتواء من الأب الداخلي...'
            }
            className="flex-1 bg-[#F7F3E9] dark:bg-[#12241D] border border-[#174C3C]/20 dark:border-[#A9C5A0]/25 rounded-xl px-4 py-3 text-sm text-[#13251E] dark:text-[#F7F3E9] focus:outline-none focus:ring-2 focus:ring-[#174C3C] dark:focus:ring-[#A9C5A0] font-cairo placeholder:text-[#13251E]/40 dark:placeholder:text-[#F7F3E9]/40"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#174C3C] hover:bg-[#123C30] dark:bg-[#A9C5A0] dark:hover:bg-[#BFD9B6] text-[#F7F3E9] dark:text-[#0D1914] font-bold text-sm rounded-xl border border-transparent shadow-xs hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>إرسال</span>
          </button>
        </form>
      </div>

      {/* Quick Navigation Footer */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-sm font-bold text-[#174C3C] dark:text-[#A9C5A0] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
      </div>

    </div>
  );
};
