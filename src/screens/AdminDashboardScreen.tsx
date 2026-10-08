import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Eye, 
  ShieldCheck, 
  Filter,
  Check,
  X,
  History,
  FolderPlus
} from 'lucide-react';
import { storage } from '../services/storage';
import { 
  UserRole, 
  ContentItem, 
  SupportRequest, 
  ReviewStatus, 
  SupportStatus,
  ContentType
} from '../types';

interface AdminDashboardScreenProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateToUserApp: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  currentRole,
  onRoleChange,
  onNavigateToUserApp
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'support' | 'audit'>('overview');
  const [contentList, setContentList] = useState<ContentItem[]>(storage.getContent());
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(storage.getSupportRequests());
  const [categories, setCategories] = useState(storage.getCategories());
  const auditLogs = storage.getAuditLogs();

  // Content form state
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [contentForm, setContentForm] = useState<{
    title: string;
    description: string;
    body: string;
    category: string;
    subCategory: string;
    contentType: ContentType;
    duration: string;
    author: string;
    reviewer: string;
    reviewStatus: ReviewStatus;
    isSuggested: boolean;
  }>({
    title: '',
    description: '',
    body: '',
    category: 'anxiety_stress',
    subCategory: 'الضغط النفسي',
    contentType: 'article',
    duration: '5 دقائق قراءة',
    author: 'فريق التوعية',
    reviewer: 'د. سارة المنشاوي',
    reviewStatus: 'draft',
    isSuggested: false
  });

  // Ticket reply modal/expanded
  const [activeTicket, setActiveTicket] = useState<SupportRequest | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Role permissions check (Section 22)
  const canManageContent = currentRole === 'super_admin' || currentRole === 'content_manager';
  const canReviewContent = currentRole === 'super_admin' || currentRole === 'specialist' || currentRole === 'content_manager';
  const canManageSupport = currentRole === 'super_admin' || currentRole === 'support_supervisor';
  const canViewSupport = currentRole === 'super_admin' || currentRole === 'support_supervisor' || currentRole === 'support_member';

  // Metrics for overview (Page 26 Specification)
  const publishedContentCount = contentList.filter(c => c.reviewStatus === 'published').length;
  const inReviewContentCount = contentList.filter(c => c.reviewStatus === 'review').length;
  const openSupportCount = supportRequests.filter(s => s.status !== 'closed').length;
  const newSupportCount = supportRequests.filter(s => s.status === 'new').length;

  // Filter support requests if support member (only assigned)
  const filteredTickets = supportRequests.filter(req => {
    if (currentRole === 'support_member') {
      return req.assignedTo?.includes(storage.getUser().name) || !req.assignedTo;
    }
    return true;
  });

  // Handle Save Content
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const item: ContentItem = {
      id: editingContentId || 'c_' + Date.now(),
      ...contentForm,
      publishedAt: contentForm.reviewStatus === 'published' ? now.split('T')[0] : '',
      updatedAt: now
    };
    storage.saveContentItem(item);
    setContentList(storage.getContent());
    setIsAddingContent(false);
    setEditingContentId(null);
  };

  const handleEditContent = (item: ContentItem) => {
    setContentForm({
      title: item.title,
      description: item.description,
      body: item.body,
      category: item.category,
      subCategory: item.subCategory || '',
      contentType: item.contentType,
      duration: item.duration,
      author: item.author,
      reviewer: item.reviewer,
      reviewStatus: item.reviewStatus,
      isSuggested: !!item.isSuggested
    });
    setEditingContentId(item.id);
    setIsAddingContent(true);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
      storage.deleteContentItem(id);
      setContentList(storage.getContent());
    }
  };

  const handleWorkflowTransition = (id: string, nextStatus: ReviewStatus) => {
    storage.updateContentStatus(id, nextStatus);
    setContentList(storage.getContent());
  };

  // Ticket actions
  const handleUpdateTicketStatus = (id: string, newStatus: SupportStatus, assignedTo?: string) => {
    storage.updateSupportStatus(id, newStatus, assignedTo);
    setSupportRequests(storage.getSupportRequests());
    if (activeTicket && activeTicket.id === id) {
      setActiveTicket({ ...activeTicket, status: newStatus, assignedTo: assignedTo || activeTicket.assignedTo });
    }
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !ticketReplyText.trim()) return;
    storage.addSupportMessage(
      activeTicket.id,
      ticketReplyText.trim(),
      storage.getUser().name,
      currentRole
    );
    // Automatically transition to contacted or in_review
    storage.updateSupportStatus(activeTicket.id, 'contacted', storage.getUser().name);
    setSupportRequests(storage.getSupportRequests());
    setActiveTicket(storage.getSupportRequests().find(r => r.id === activeTicket.id) || null);
    setTicketReplyText('');
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 text-right">
      
      {/* Top Banner with Role Switcher & Back to User View */}
      <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#26332D]">
              لوحة التحكم والإدارة (Admin Dashboard)
            </h1>
          </div>
          <p className="text-xs text-[#52645B] mt-0.5">
            نظام الصلاحيات وإدارة المحتوى ومتابعة طلبات الدعم وفق مواصفات النسخة 1.0
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Active Role Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E8DDCC] px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#355C4A]">
            <ShieldCheck className="w-4 h-4 text-[#8FAF9A]" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent focus:outline-hidden font-bold cursor-pointer"
            >
              <option value="super_admin">Super Admin (صلاحيات كاملة)</option>
              <option value="content_manager">Content Manager (المحتوى)</option>
              <option value="support_supervisor">Support Supervisor (المشرف)</option>
              <option value="support_member">Support Member (عضو الدعم)</option>
              <option value="specialist">Reviewer / Specialist (المختص)</option>
            </select>
          </div>

          <button
            onClick={onNavigateToUserApp}
            className="py-1.5 px-3 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            تصفح كتطبيق المستخدم ←
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DDCC] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3.5 rounded-xl transition-colors ${
            activeTab === 'overview' ? 'bg-[#355C4A] text-white' : 'text-[#52645B] hover:bg-stone-200/50'
          }`}
        >
          نظرة عامة والإحصائيات
        </button>

        {canReviewContent && (
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-3.5 rounded-xl transition-colors ${
              activeTab === 'content' ? 'bg-[#355C4A] text-white' : 'text-[#52645B] hover:bg-stone-200/50'
            }`}
          >
            إدارة المحتوى والمراجعة ({contentList.length})
          </button>
        )}

        {canViewSupport && (
          <button
            onClick={() => setActiveTab('support')}
            className={`py-2 px-3.5 rounded-xl transition-colors ${
              activeTab === 'support' ? 'bg-[#355C4A] text-white' : 'text-[#52645B] hover:bg-stone-200/50'
            }`}
          >
            طلبات الدعم ({openSupportCount} مفتوحة)
          </button>
        )}

        {currentRole === 'super_admin' && (
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-3.5 rounded-xl transition-colors ${
              activeTab === 'audit' ? 'bg-[#355C4A] text-white' : 'text-[#52645B] hover:bg-stone-200/50'
            }`}
          >
            سجل العمليات (Audit Logs)
          </button>
        )}
      </div>

      {/* --- TAB 1: OVERVIEW & STATS (Section 20 Spec) --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl">
              <div className="text-xs text-[#52645B]">المحتوى المنشور</div>
              <div className="text-2xl font-extrabold font-mono text-[#355C4A] mt-1">
                {publishedContentCount}
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl">
              <div className="text-xs text-[#52645B]">المحتوى قيد المراجعة</div>
              <div className="text-2xl font-extrabold font-mono text-amber-700 mt-1">
                {inReviewContentCount}
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl">
              <div className="text-xs text-[#52645B]">طلبات الدعم المفتوحة</div>
              <div className="text-2xl font-extrabold font-mono text-sky-700 mt-1">
                {openSupportCount}
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl">
              <div className="text-xs text-[#52645B]">الطلبات الجديدة</div>
              <div className="text-2xl font-extrabold font-mono text-rose-700 mt-1">
                {newSupportCount}
              </div>
            </div>
          </div>

          {/* Privacy Note from Spec Page 26 */}
          <div className="p-3.5 bg-stone-100/80 border border-stone-200 rounded-2xl text-xs text-[#52645B] leading-relaxed">
            * <strong>ضابط الخصوصية:</strong> «لا نعرض بيانات نفسية حساسة في الإحصائيات العامة إذا لم تكن ضرورية».
          </div>

          {/* Workflow Schema Illustration (Section 21) */}
          <div className="p-5 bg-white/80 border border-[#E8DDCC] rounded-3xl space-y-3">
            <h3 className="font-bold text-sm text-[#26332D]">
              سلسلة اعتماد المحتوى النفسي (Workflow):
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-stone-100 rounded-xl font-mono text-stone-700">1. Draft (مسودة)</span>
              <span>←</span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl font-mono">2. Review (مراجعة المختص)</span>
              <span>←</span>
              <span className="px-3 py-1.5 bg-sky-100 text-sky-800 rounded-xl font-mono">3. Approved (معتمد)</span>
              <span>←</span>
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl font-mono font-bold">4. Published (منشور للجمهور)</span>
              <span>←</span>
              <span className="px-3 py-1.5 bg-stone-200 text-stone-600 rounded-xl font-mono">5. Archived (مؤرشف)</span>
            </div>
            <p className="text-[11px] text-[#7D8F85]">
              «ولا يستطيع أي مستخدم عادي نشر محتوى نفسي مباشرة لضمان سلامة الرسائل ومطابقتها للمعايير».
            </p>
          </div>
        </div>
      )}

      {/* --- TAB 2: CONTENT MANAGEMENT & WORKFLOW (Section 21 Spec) --- */}
      {activeTab === 'content' && canReviewContent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#26332D]">
              قائمة المحتوى وسلسلة النشر
            </h2>
            {canManageContent && !isAddingContent && (
              <button
                onClick={() => {
                  setEditingContentId(null);
                  setContentForm({
                    title: '',
                    description: '',
                    body: '',
                    category: 'anxiety_stress',
                    subCategory: 'الضغط النفسي',
                    contentType: 'article',
                    duration: '5 دقائق قراءة',
                    author: 'فريق التوعية',
                    reviewer: 'د. سارة المنشاوي',
                    reviewStatus: 'draft',
                    isSuggested: false
                  });
                  setIsAddingContent(true);
                }}
                className="py-2 px-3.5 bg-[#355C4A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#264235]"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة محتوى جديد</span>
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {isAddingContent && (
            <form onSubmit={handleSaveContent} className="p-5 bg-[#FAF7F0] border border-[#355C4A]/40 rounded-3xl space-y-4 animate-fade-in shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCC]">
                <h3 className="font-bold text-sm text-[#26332D]">
                  {editingContentId ? 'تعديل المحتوى' : 'إضافة مقال أو صوت جديد'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingContent(false)}
                  className="text-stone-500 hover:text-stone-800 text-xs"
                >
                  إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">العنوان</label>
                  <input
                    type="text"
                    required
                    value={contentForm.title}
                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">نوع المحتوى</label>
                  <select
                    value={contentForm.contentType}
                    onChange={(e) => setContentForm({ ...contentForm, contentType: e.target.value as ContentType })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  >
                    <option value="article">مقال (Article)</option>
                    <option value="audio">صوت (Audio)</option>
                    <option value="exercise">تمرين (Short exercise)</option>
                    <option value="video">فيديو (Video)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">التصنيف</label>
                  <select
                    value={contentForm.category}
                    onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">التصنيف الفرعي</label>
                  <input
                    type="text"
                    value={contentForm.subCategory}
                    onChange={(e) => setContentForm({ ...contentForm, subCategory: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">المدة التقريبية</label>
                  <input
                    type="text"
                    value={contentForm.duration}
                    onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332D] mb-1">الوصف القصير</label>
                <textarea
                  rows={2}
                  value={contentForm.description}
                  onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332D] mb-1">نص المحتوى (Markdown)</label>
                <textarea
                  rows={5}
                  value={contentForm.body}
                  onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">الكاتب</label>
                  <input
                    type="text"
                    value={contentForm.author}
                    onChange={(e) => setContentForm({ ...contentForm, author: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">المراجع النفسي</label>
                  <input
                    type="text"
                    value={contentForm.reviewer}
                    onChange={(e) => setContentForm({ ...contentForm, reviewer: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26332D] mb-1">حالة النشر (Workflow)</label>
                  <select
                    value={contentForm.reviewStatus}
                    onChange={(e) => setContentForm({ ...contentForm, reviewStatus: e.target.value as ReviewStatus })}
                    className="w-full p-2.5 bg-white border border-[#E8DDCC] rounded-xl text-xs font-bold"
                  >
                    <option value="draft">Draft (مسودة)</option>
                    <option value="review">Review (قيد المراجعة)</option>
                    <option value="approved">Approved (معتمد)</option>
                    <option value="published">Published (منشور)</option>
                    <option value="archived">Archived (مؤرشف)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSuggested"
                  checked={contentForm.isSuggested}
                  onChange={(e) => setContentForm({ ...contentForm, isSuggested: e.target.checked })}
                  className="w-4 h-4 accent-[#355C4A]"
                />
                <label htmlFor="isSuggested" className="text-xs font-bold text-[#26332D]">
                  عرض كمحتوى مقترح في الشاشة الرئيسية («ممكن يهمك 🌱»)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#355C4A] text-white font-bold text-xs rounded-xl"
                >
                  حفظ المحتوى
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingContent(false)}
                  className="py-2.5 px-4 bg-white border border-[#E8DDCC] text-stone-600 text-xs rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {/* Content List Table */}
          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl overflow-hidden shadow-xs">
            <div className="divide-y divide-[#E8DDCC]/70">
              {contentList.map(item => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#26332D]">{item.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        item.reviewStatus === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        item.reviewStatus === 'review' ? 'bg-amber-100 text-amber-800' :
                        item.reviewStatus === 'approved' ? 'bg-sky-100 text-sky-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {item.reviewStatus}
                      </span>
                      {item.isSuggested && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#8FAF9A]/20 text-[#355C4A] rounded-lg">
                          مقترح
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#52645B] flex items-center gap-3">
                      <span>النوع: {item.contentType}</span>
                      <span>·</span>
                      <span>القسم: {item.subCategory || item.category}</span>
                      <span>·</span>
                      <span>المراجع: {item.reviewer}</span>
                    </div>
                  </div>

                  {/* Actions according to Role */}
                  <div className="flex items-center gap-2">
                    {/* Workflow status quick buttons */}
                    {canReviewContent && item.reviewStatus === 'review' && (
                      <button
                        onClick={() => handleWorkflowTransition(item.id, 'approved')}
                        className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg"
                      >
                        اعتماد المختص
                      </button>
                    )}

                    {canManageContent && item.reviewStatus === 'approved' && (
                      <button
                        onClick={() => handleWorkflowTransition(item.id, 'published')}
                        className="py-1 px-2.5 bg-[#355C4A] hover:bg-[#264235] text-white text-[11px] font-bold rounded-lg"
                      >
                        نشر الآن
                      </button>
                    )}

                    {canManageContent && (
                      <>
                        <button
                          onClick={() => handleEditContent(item)}
                          className="p-1.5 text-stone-500 hover:text-[#355C4A]"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: SUPPORT REQUESTS TICKETING (Section 22 Spec) --- */}
      {activeTab === 'support' && canViewSupport && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#26332D]">
              طلبات الدعم الواردة ({filteredTickets.length})
            </h2>
            <span className="text-xs text-[#52645B]">
              الدور الحالي: {currentRole}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl p-5 space-y-3 shadow-xs hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#355C4A]">
                      {ticket.id}
                    </span>
                    <span className="text-xs font-bold text-[#26332D]">
                      {ticket.userName} ({ticket.userContact})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-stone-200 text-stone-800">
                      {ticket.requestType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status updater for supervisor or member */}
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value as SupportStatus)}
                      className="text-xs font-bold p-1 bg-white border border-[#E8DDCC] rounded-lg"
                    >
                      <option value="new">جديد</option>
                      <option value="received">تم الاستلام</option>
                      <option value="in_review">قيد المراجعة</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="referred">تمت الإحالة</option>
                      <option value="closed">مغلق</option>
                    </select>

                    <button
                      onClick={() => setActiveTicket(activeTicket?.id === ticket.id ? null : ticket)}
                      className="py-1 px-3 bg-[#355C4A] text-white text-xs font-bold rounded-lg"
                    >
                      {activeTicket?.id === ticket.id ? 'إخفاء' : 'الرد والمتابعة'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#35453E] p-3 bg-white/80 rounded-2xl border border-[#E8DDCC] leading-relaxed">
                  {ticket.message}
                </p>

                {/* Expanded Reply Box */}
                {activeTicket?.id === ticket.id && (
                  <div className="pt-3 border-t border-[#E8DDCC] space-y-3 animate-fade-in">
                    {/* Previous messages */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#52645B]">سجل المراسلات:</div>
                      {ticket.messages.length === 0 ? (
                        <div className="text-xs text-[#7D8F85] italic">لا توجد رسائل سابقة.</div>
                      ) : (
                        ticket.messages.map(msg => (
                          <div key={msg.id} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                            <div className="font-bold text-emerald-950 flex justify-between">
                              <span>{msg.senderName} ({msg.senderRole})</span>
                              <span className="font-mono text-[10px] text-emerald-700">{new Date(msg.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <p>{msg.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Reply form */}
                    <form onSubmit={handleSendTicketReply} className="space-y-2">
                      <textarea
                        rows={3}
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        placeholder="اكتب ردك أو التوجيه المناسب للمستخدم هنا بعناية وهدوء..."
                        required
                        className="w-full p-3 bg-white border border-[#E8DDCC] rounded-xl text-xs"
                      />
                      <button
                        type="submit"
                        className="py-2 px-4 bg-[#355C4A] hover:bg-[#264235] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال الرد للمستخدم</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: AUDIT LOGS (Section 23 & 25 Spec) --- */}
      {activeTab === 'audit' && currentRole === 'super_admin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#26332D]">
              سجل العمليات والأمان (Audit Logs)
            </h2>
            <span className="text-xs text-[#52645B]">
              حماية البيانات وعدم تسجيل المعلومات الحساسة
            </span>
          </div>

          <div className="bg-[#FAF7F0] border border-[#E8DDCC] rounded-3xl overflow-hidden shadow-xs divide-y divide-[#E8DDCC]/70">
            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#7D8F85]">
                لا توجد سجلات بعد. سيتم تسجيل كل إجراء يقوم به المشرفون هنا.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {log.action}
                    </span>
                    <span className="text-[#26332D] font-medium">
                      بواسطة: {log.actorName} ({log.entity}: {log.entityId})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#7D8F85]">
                    {new Date(log.timestamp).toLocaleTimeString('ar-EG')} - {new Date(log.timestamp).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
