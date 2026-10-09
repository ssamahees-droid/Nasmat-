import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { storage } from '../services/storage';
import { SupportRequest, SupportRequestType, SupportStatus } from '../types';

interface SupportScreenProps {
  onOpenSafetyModal: () => void;
  onNavigate?: (tab: string) => void;
}

const NEED_TYPES: { id: SupportRequestType; label: string; desc: string; icon: string }[] = [
  { id: 'listener', label: 'حد يسمعني', desc: 'مشاركة ما بداخلي دون تلقي أحكام أو لوم', icon: '👂' },
  { id: 'guidance', label: 'محتاج توجيه', desc: 'أفكار وخطوات عملية تساعدني في موقفي الحالي', icon: '🧭' },
  { id: 'specialist', label: 'محتاج أوصل لمتخصص', desc: 'المساعدة في معرفة التخصص المناسب لحالتي', icon: '🩺' },
  { id: 'confused', label: 'مش عارف أعمل إيه', desc: 'مشوش وأحتاج مساحة للمساعدة في ترتيب أفكاري', icon: '💭' },
];

const STATUS_LABELS: Record<SupportStatus, { label: string; color: string }> = {
  new: { label: 'جديد', color: 'bg-stone-200 text-stone-800' },
  received: { label: 'تم الاستلام', color: 'bg-sky-100 text-sky-800' },
  in_review: { label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800' },
  contacted: { label: 'تم التواصل', color: 'bg-emerald-100 text-emerald-800' },
  referred: { label: 'تمت الإحالة', color: 'bg-purple-100 text-purple-800' },
  closed: { label: 'مغلق', color: 'bg-stone-300 text-stone-600' }
};

export const SupportScreen: React.FC<SupportScreenProps> = ({ onOpenSafetyModal, onNavigate }) => {
  const [selectedType, setSelectedType] = useState<SupportRequestType>('listener');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(storage.getUser().name || '');
  const [contact, setContact] = useState(storage.getUser().emailOrPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<SupportRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'new_request' | 'my_tickets'>('new_request');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // User's tickets
  const myTickets = storage.getSupportRequests().filter(r => r.userId === storage.getUser().id);

  // Word count helper (max 500 words as per spec)
  const wordCount = message.trim().length > 0 ? message.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isOverWordLimit) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = storage.createSupportRequest({
        userName: name,
        userContact: contact,
        requestType: selectedType,
        message
      });
      setSubmittedRequest(newReq);
      setMessage('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      
      {/* Breadcrumb Navigation */}
      {onNavigate && (
        <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-stone-400">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-emerald-400 transition-colors"
          >
            الرئيسية
          </button>
          <span>/</span>
          <span className="text-emerald-400 font-bold">اطلب الدعم</span>
        </nav>
      )}

      {/* Header */}
      <div className="space-y-1.5 text-right">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26332D]">
          محتاج أتكلم؟ 💬
        </h1>
        <p className="text-base font-bold text-[#355C4A]">
          مش لازم تعرف تقول كل حاجة. ابدأ بس من اللي حاسس بيه.
        </p>
      </div>

      {/* Tabs: New Request vs My Previous Tickets */}
      <div className="flex items-center gap-2 p-1 bg-[#FAF7F0] border border-[#E8DDCC] rounded-2xl">
        <button
          onClick={() => {
            setActiveTab('new_request');
            setSubmittedRequest(null);
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'new_request'
              ? 'bg-[#355C4A] text-white shadow-xs'
              : 'text-[#52645B] hover:text-[#26332D]'
          }`}
        >
          طلب دعم جديد
        </button>
        <button
          onClick={() => setActiveTab('my_tickets')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'my_tickets'
              ? 'bg-[#355C4A] text-white shadow-xs'
              : 'text-[#52645B] hover:text-[#26332D]'
          }`}
        >
          <span>متابعة طلباتي</span>
          {myTickets.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#8FAF9A]/30 text-[#355C4A] text-[10px] font-bold flex items-center justify-center">
              {myTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* View 1: New Support Request */}
      {activeTab === 'new_request' && (
        <>
          {submittedRequest ? (
            /* Success confirmation card with Ticket ID */
            <div className="bg-[#FAF7F0] border border-[#8FAF9A]/50 rounded-3xl p-6 sm:p-8 space-y-5 animate-fade-in shadow-xs text-right">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-[#26332D]">
                  تم استلام طلبك بنجاح
                </h3>
                <p className="text-xs text-[#52645B]">
                  رقم طلب المساعدة الخاص بك:
                </p>
                <div className="inline-block font-mono text-2xl font-bold text-[#355C4A] px-4 py-1 bg-white rounded-xl border border-[#E8DDCC] mt-2">
                  {submittedRequest.id}
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-4 bg-white/80 rounded-2xl border border-[#E8DDCC] space-y-2 text-xs text-[#52645B] leading-relaxed">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#26332D]">حالة الطلب الآن:</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold ${STATUS_LABELS[submittedRequest.status].color}`}>
                    {STATUS_LABELS[submittedRequest.status].label}
                  </span>
                </div>
                <p>
                  طلبك محفوظ في قاعدة بيانات التطبيق الآمنة وسيصل لفريق الدعم لمراجعته وتوجيهك. يمكنك متابعة التحديثات عبر تبويب «متابعة طلباتي».
                </p>
              </div>

              {/* Proposed Policy Statement (Section 13) */}
              <div className="p-3 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-2xl text-[11px] text-[#355C4A] leading-relaxed">
                «سيتم التعامل مع طلبك وفق آلية الدعم المتاحة حالياً وسياسة الخصوصية الخاصة بنسمة حياة».
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setActiveTab('my_tickets')}
                  className="flex-1 py-3 px-4 bg-[#355C4A] text-white font-bold text-xs rounded-xl hover:bg-[#264235] transition-colors"
                >
                  عرض في قائمة طلباتي
                </button>
                <button
                  onClick={() => setSubmittedRequest(null)}
                  className="py-3 px-4 bg-white border border-[#E8DDCC] text-[#52645B] text-xs font-semibold rounded-xl hover:bg-stone-50"
                >
                  كتابة طلب آخر
                </button>
              </div>
            </div>
          ) : (
            /* Support Request Form */
            <form onSubmit={handleSubmit} className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 sm:p-7 space-y-6 shadow-xs text-right">
              
              {/* Question: ماذا تحتاج؟ */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#26332D]">
                  ماذا تحتاج؟
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {NEED_TYPES.map(need => {
                    const isSelected = selectedType === need.id;
                    return (
                      <button
                        type="button"
                        key={need.id}
                        onClick={() => setSelectedType(need.id)}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 min-h-[58px] ${
                          isSelected
                            ? 'bg-[#355C4A] text-white border-[#355C4A] shadow-xs'
                            : 'bg-white/80 text-[#26332D] border-[#E8DDCC] hover:bg-white'
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{need.icon}</span>
                        <div>
                          <div className="font-bold text-xs">{need.label}</div>
                          <div className={`text-[11px] mt-0.5 leading-snug ${
                            isSelected ? 'text-[#E8DDCC]' : 'text-[#7D8F85]'
                          }`}>
                            {need.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Area for Message (Page 15) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#52645B]">
                  <label htmlFor="support-message" className="font-bold text-[#26332D]">
                    الرسالة
                  </label>
                  <span className={`font-mono text-[11px] ${isOverWordLimit ? 'text-rose-600 font-bold' : ''}`}>
                    {wordCount} / 500 كلمة
                  </span>
                </div>

                <textarea
                  id="support-message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="احكيلنا براحتك... ما الذي يشغل بالك أو تشعر به مؤخراً؟"
                  required
                  className={`w-full p-4 bg-white/90 border rounded-2xl text-sm text-[#26332D] placeholder-[#7D8F85] focus:outline-hidden focus:bg-white transition-all ${
                    isOverWordLimit ? 'border-rose-400 focus:border-rose-500' : 'border-[#E8DDCC] focus:border-[#355C4A]'
                  }`}
                />
                {isOverWordLimit && (
                  <p className="text-xs text-rose-600">
                    لقد تجاوزت الحد الأقصى المبدئي (500 كلمة). يرجى اختصار الرسالة.
                  </p>
                )}
              </div>

              {/* Minimal Contact Info (Section 18 Spec) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E8DDCC]/70">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#52645B]">
                    الاسم أو الاسم المستعار (اختياري)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد"
                    className="w-full py-2.5 px-3.5 bg-white border border-[#E8DDCC] rounded-xl text-xs focus:outline-hidden focus:border-[#355C4A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#52645B]">
                    البريد الإلكتروني أو رقم الهاتف للمتابعة
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="name@example.com أو 01xxxxxxxxx"
                    required
                    className="w-full py-2.5 px-3.5 bg-white border border-[#E8DDCC] rounded-xl text-xs focus:outline-hidden focus:border-[#355C4A]"
                  />
                </div>
              </div>

              {/* Crucial Ethical Policy Statement (Section 13 & 16) */}
              <div className="p-3.5 bg-white/70 border border-[#E8DDCC] rounded-2xl space-y-2 text-xs text-[#52645B] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-[#355C4A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>مبدأ الأمانة والشفافية:</span>
                </div>
                <p>
                  «سيتم التعامل مع طلبك وفق آلية الدعم المتاحة حالياً وسياسة الخصوصية الخاصة بنسمة حياة». لا نعد بالرد الفوري، والتطبيق ليس غرفة طوارئ أو إسعاف عاجل.
                </p>
                <div className="pt-1">
                  إذا كنت في خطر فوري أو أزمة حادة، يرجى التوجه لـ <button type="button" onClick={onOpenSafetyModal} className="underline font-bold text-amber-800">مسار الأمان وخطوط الطوارئ</button>.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim() || isOverWordLimit}
                className="w-full py-4 px-6 bg-[#355C4A] hover:bg-[#264235] disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md shadow-[#355C4A]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Send className="w-4 h-4 ml-1" />
                <span>{isSubmitting ? 'جارٍ الإرسال...' : 'إرسال طلب المساعدة'}</span>
              </button>
            </form>
          )}
        </>
      )}

      {/* View 2: My Support Tickets Tracker */}
      {activeTab === 'my_tickets' && (
        <div className="space-y-3 animate-fade-in">
          {myTickets.length === 0 ? (
            <div className="p-10 text-center bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl space-y-3">
              <FileText className="w-8 h-8 text-[#7D8F85] mx-auto" />
              <h3 className="font-bold text-sm text-[#26332D]">لا توجد طلبات سابقة</h3>
              <p className="text-xs text-[#52645B]">
                عند إرسال أي طلب دعم، ستتمكن من متابعة مراحله ورسائل الفريق هنا.
              </p>
              <button
                onClick={() => setActiveTab('new_request')}
                className="py-2 px-4 bg-[#355C4A] text-white text-xs font-semibold rounded-xl"
              >
                كتابة طلب دعم جديد
              </button>
            </div>
          ) : (
            myTickets.map(req => {
              const isExpanded = expandedRequestId === req.id;
              const statusCfg = STATUS_LABELS[req.status];
              return (
                <div
                  key={req.id}
                  className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 space-y-3 transition-all text-right"
                >
                  <div 
                    onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#355C4A]">
                        {req.id}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#52645B]">
                      <span>{new Date(req.createdAt).toLocaleDateString('ar-EG')}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  <p className="text-xs text-[#35453E] line-clamp-2 leading-relaxed">
                    {req.message}
                  </p>

                  {isExpanded && (
                    <div className="pt-3 border-t border-[#E8DDCC] space-y-3 animate-fade-in">
                      <div className="text-xs text-[#52645B] space-y-1">
                        <div><strong>نوع الطلب:</strong> {NEED_TYPES.find(n => n.id === req.requestType)?.label || req.requestType}</div>
                        <div><strong>نص الرسالة كاملاً:</strong></div>
                        <div className="p-3 bg-white rounded-xl border border-[#E8DDCC] text-[#26332D]">
                          {req.message}
                        </div>
                      </div>

                      {/* Messages thread */}
                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-bold text-[#355C4A]">ردود وتحديثات الفريق:</div>
                        {req.messages.length === 0 ? (
                          <div className="p-3 bg-white/60 rounded-xl text-xs text-[#7D8F85]">
                            طلبك مسجل وقيد المتابعة مع الفريق المختص.
                          </div>
                        ) : (
                          req.messages.map(msg => (
                            <div key={msg.id} className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-950 space-y-1">
                              <div className="flex items-center justify-between font-bold">
                                <span>{msg.senderName} ({msg.senderRole})</span>
                                <span className="font-mono text-[10px] text-emerald-800">
                                  {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                                </span>
                              </div>
                              <p className="leading-relaxed">{msg.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
