import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Send,
  Heart,
  FileSpreadsheet,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import {
  GuestComment,
  exportCommentsToCsv,
  sendToGoogleSheetWebhook,
  WeddingDetails,
} from '../utils/weddingData.ts';

interface CommentsSectionProps {
  details: WeddingDetails;
  comments: GuestComment[];
  onAddComment: (comment: GuestComment) => void;
  onLikeComment: (commentId: string) => void;
  onOpenSheetsGuide: () => void;
}

const REACTIONS = ['❤️', '💍', '💐', '🥂', '👏', '🧿'];

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  details,
  comments,
  onAddComment,
  onLikeComment,
  onOpenSheetsGuide,
}) => {
  const [authorName, setAuthorName] = useState<string>('');
  const [relation, setRelation] = useState<string>('صديق العائلة');
  const [message, setMessage] = useState<string>('');
  const [selectedReaction, setSelectedReaction] = useState<string>('❤️');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitFeedback('');

    const newComment: GuestComment = {
      id: `comment_${Date.now()}`,
      authorName: authorName.trim(),
      relation: relation.trim(),
      message: message.trim(),
      reaction: selectedReaction,
      createdAt: 'الآن',
      likes: 1,
    };

    onAddComment(newComment);

    // If Google Sheet Webhook is active, dispatch payload
    if (details.googleSheetWebhookUrl) {
      setSubmitFeedback('جاري المزامنة مع Google Sheets...');
      const res = await sendToGoogleSheetWebhook(details.googleSheetWebhookUrl, {
        type: 'COMMENT',
        ...newComment,
      });
      if (res.success) {
        setSubmitFeedback('تمت إضافة التهنئة والمزامنة مع Google Sheets! 📊');
      } else {
        setSubmitFeedback('تمت إضافة التهنئة وحفظها بنجاح!');
      }
    } else {
      setSubmitFeedback('تمت إضافة تهنئتك ومشاركتها مع العروسين! ✨');
    }

    setAuthorName('');
    setMessage('');
    setIsSubmitting(false);

    setTimeout(() => {
      setSubmitFeedback('');
    }, 3500);
  };

  const handleExportCsv = () => {
    const csvData = exportCommentsToCsv(comments, details);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تهاني-زفاف-${details.groomName}-${details.brideName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full luxury-card text-xs text-amber-300 font-medium mb-2">
          <MessageSquareHeart size={13} />
          <span>سجل التهاني والتبريكات</span>
        </div>
        <h2 className="font-calligraphy text-3xl sm:text-4xl font-bold gold-gradient-text">
          كلمة محبة للعروسين
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          شاركونا فرحتنا بكلماتكم الطيبة وتهانيكم القلبية في ليلة العمر
        </p>
      </div>

      {/* Top Integration & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-[#161822]/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <FileSpreadsheet size={16} className="text-emerald-400" />
          <span>إجمالي التهاني المسجلة: <strong className="text-[#ffd700] font-mono tabular-nums">{comments.length}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg luxury-card text-emerald-300 hover:text-white hover:border-emerald-500 font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="تحميل جميع التهاني كملف إكسل"
          >
            <FileSpreadsheet size={13} />
            <span>تصدير إلى Excel / CSV</span>
          </button>

          <button
            onClick={onOpenSheetsGuide}
            className="px-3 py-1.5 rounded-lg luxury-card text-amber-300 hover:text-white hover:border-amber-400 font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="طريقة ربط التعليقات بجدول Google Sheets تلقائياً"
          >
            <LinkIcon size={13} />
            <span>ربط Google Sheets</span>
            <HelpCircle size={12} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Leave a Comment Form */}
      <div className="luxury-card p-5 sm:p-6 rounded-3xl border-[#d4af37]/35 shadow-xl mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="comment-author" className="block text-xs font-semibold text-slate-300 mb-1 text-right">
                اسمك الكريم *
              </label>
              <input
                id="comment-author"
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="مثال: م. كريم عبد العزيز"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="comment-relation" className="block text-xs font-semibold text-slate-300 mb-1 text-right">
                صلة القرابة أو الصداقة
              </label>
              <select
                id="comment-relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
              >
                <option value="صديق العريس">صديق العريس</option>
                <option value="صديقة العروسة">صديقة العروسة</option>
                <option value="أهل وأقارب العريس">أهل وأقارب العريس</option>
                <option value="أهل وأقارب العروسة">أهل وأقارب العروسة</option>
                <option value="زميل عمل">زميل عمل</option>
                <option value="صديق العائلة">صديق العائلة</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="comment-msg" className="block text-xs font-semibold text-slate-300 mb-1 text-right">
              رسالة التهنئة والدعاء للعروسين *
            </label>
            <textarea
              id="comment-msg"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب أطيب أمنياتك ودعواتك للعروسين في ليلتهما السعيدة..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors resize-none"
            />
          </div>

          {/* Reaction Picker */}
          <div>
            <span className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              رمز التهنئة التفاعلي:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReaction(r)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                    selectedReaction === r
                      ? 'bg-amber-500/30 border-[#ffd700] scale-110 shadow-md'
                      : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !authorName.trim() || !message.trim()}
              className="py-3 px-6 rounded-xl gold-shimmer-btn text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send size={15} />
              <span>{isSubmitting ? 'جاري الإرسال...' : 'نشر التهنئة 💌'}</span>
            </button>

            {submitFeedback && (
              <span className="text-xs text-[#ffd700] animate-pulse">
                {submitFeedback}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Comments List Feed */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="luxury-card p-6 rounded-2xl text-center border-slate-800">
            <p className="text-sm text-amber-200/90 font-medium">
              كن أول من يشارك العروسين فرحتهما ويسطر لهما أطيب التمنيات والدعوات 💌✨
            </p>
          </div>
        ) : (
          comments.map((item) => (
            <div
              key={item.id}
              className="luxury-card p-4 sm:p-5 rounded-2xl border-slate-800/90 hover:border-[#d4af37]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3a2f1b] to-[#1c1811] border border-[#d4af37]/40 flex items-center justify-center text-base">
                    {item.reaction}
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-sm text-amber-100">
                      {item.authorName}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {item.relation} · {item.createdAt}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onLikeComment(item.id)}
                  aria-label="تسجيل إعجاب بالتهنئة"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 text-xs transition-colors active:scale-90 cursor-pointer"
                >
                  <Heart size={13} className="fill-rose-500 text-rose-500" />
                  <span className="font-mono tabular-nums text-[11px]">{item.likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-right pr-1">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
