import React, { useState } from 'react';
import { UserCheck, Send, CheckCircle2, HeartHandshake, Users } from 'lucide-react';
import { GuestRsvp, sendToGoogleSheetWebhook, WeddingDetails } from '../utils/weddingData.ts';

interface RsvpSectionProps {
  details: WeddingDetails;
  onRsvpSubmitted?: (rsvp: GuestRsvp) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ details, onRsvpSubmitted }) => {
  const [guestName, setGuestName] = useState<string>('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    setSyncStatus('');

    const newRsvp: GuestRsvp = {
      id: `rsvp_${Date.now()}`,
      guestName: guestName.trim(),
      attending,
      guestCount: attending === 'yes' ? guestCount : 0,
      dietaryOrNotes: notes.trim(),
      submittedAt: new Date().toLocaleString('ar-EG'),
    };

    // Save in LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      existing.push(newRsvp);
      localStorage.setItem('wedding_rsvps', JSON.stringify(existing));
    } catch {
      // LocalStorage fallback
    }

    // Send to Google Sheets Webhook if configured
    if (details.googleSheetWebhookUrl) {
      setSyncStatus('جاري إرسال البيانات إلى Google Sheets...');
      const res = await sendToGoogleSheetWebhook(details.googleSheetWebhookUrl, {
        type: 'RSVP',
        ...newRsvp,
      });
      if (res.success) {
        setSyncStatus('تم تسجيل الرد وإرساله مباشرة إلى Google Sheets بنجاح! 📊');
      } else {
        setSyncStatus('تم حفظ ردك محلياً!');
      }
    }

    if (onRsvpSubmitted) {
      onRsvpSubmitted(newRsvp);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="py-12 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full luxury-card text-xs text-amber-300 font-medium mb-2">
          <UserCheck size={13} />
          <span>تأكيد الحضور (RSVP)</span>
        </div>
        <h2 className="font-calligraphy text-3xl sm:text-4xl font-bold gold-gradient-text">
          نتشرف بتأكيد حضوركم
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          يسعدنا تأكيد حضوركم لترتيب مقاعدكم وضيافتكم الكريمة
        </p>
      </div>

      <div className="luxury-card p-6 sm:p-8 rounded-3xl border-[#d4af37]/35 shadow-xl">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-white">
              شكراً جزيلاً، {guestName}!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {attending === 'yes'
                ? `تم تأكيد حضورك (${guestCount} فرد). في انتظارك تنورنا في أجمل ليالي العمر!`
                : 'يؤسفنا عدم استطاعتك الحضور، وسعدنا بمشاركتك تمنياتك الطيبة.'}
            </p>
            {syncStatus && (
              <p className="text-xs text-[#ffd700] bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
                {syncStatus}
              </p>
            )}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setGuestName('');
                setNotes('');
              }}
              className="mt-4 px-5 py-2 text-xs font-semibold text-amber-300 hover:text-white transition-colors cursor-pointer"
            >
              تعديل أو إرسال رد آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="guest-name" className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
                الاسم الكريم *
              </label>
              <input
                id="guest-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثال: أحمد مصطفى وعائلته الكريمة"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
              />
            </div>

            {/* Attendance Toggle */}
            <div>
              <span className="block text-xs font-semibold text-slate-300 mb-2 text-right">
                هل ستشرفنا بالحضور؟ *
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'yes'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <HeartHandshake size={16} />
                  <span>سأحضر بكل سرور ✨</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'no'
                      ? 'bg-rose-900/40 border-rose-500 text-rose-200'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span>أعتذر بكل ود 🌹</span>
                </button>
              </div>
            </div>

            {/* Guest Count (if attending) */}
            {attending === 'yes' && (
              <div>
                <label htmlFor="guest-count" className="block text-xs font-semibold text-slate-300 mb-1.5 text-right flex items-center gap-1.5">
                  <Users size={14} className="text-[#ffd700]" />
                  <span>عدد الأفراد (بما فيهم أنت)</span>
                </label>
                <select
                  id="guest-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
                >
                  <option value={1}>1 فرد (أنا فقط)</option>
                  <option value={2}>2 أفراد</option>
                  <option value={3}>3 أفراد</option>
                  <option value={4}>4 أفراد</option>
                  <option value={5}>5 أفراد أو أكثر</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="guest-notes" className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
                ملاحظات أو تهنئة خاصة (اختياري)
              </label>
              <textarea
                id="guest-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظة أو كلمة لطيفة للعروسين..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !guestName.trim()}
              className="w-full py-3.5 px-6 rounded-xl gold-shimmer-btn text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send size={16} />
              <span>{isSubmitting ? 'جاري تأكيد الحضور...' : 'تأكيد الحضور الآن 💌'}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
