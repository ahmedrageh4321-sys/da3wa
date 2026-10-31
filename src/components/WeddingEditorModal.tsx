import React, { useState } from 'react';
import { X, Save, RotateCcw, Sparkles } from 'lucide-react';
import { WeddingDetails, DEFAULT_WEDDING_DETAILS } from '../utils/weddingData.ts';

interface WeddingEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: WeddingDetails;
  onSave: (updated: WeddingDetails) => void;
}

export const WeddingEditorModal: React.FC<WeddingEditorModalProps> = ({
  isOpen,
  onClose,
  details,
  onSave,
}) => {
  const [form, setForm] = useState<WeddingDetails>(details);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('هل تريد استعادة البيانات الافتراضية؟')) {
      setForm(DEFAULT_WEDDING_DETAILS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="luxury-card w-full max-w-xl rounded-3xl border-[#d4af37]/50 p-6 my-8 text-right shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#ffd700]" />
            <h3 className="font-bold text-lg text-white">
              تخصيص بيانات حفل الزفاف
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق نافذة التعديل"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-6">
          يمكنك تغيير كافة الأسماء وموعد الفرح والقاعة ومصدر الصوت ورابط جوجل شيتس بكل سهولة:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم العريس *
              </label>
              <input
                type="text"
                required
                value={form.groomName}
                onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم العروسة *
              </label>
              <input
                type="text"
                required
                value={form.brideName}
                onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                عائلة العريس
              </label>
              <input
                type="text"
                value={form.groomFamily}
                onChange={(e) => setForm({ ...form, groomFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                عائلة العروسة
              </label>
              <input
                type="text"
                value={form.brideFamily}
                onChange={(e) => setForm({ ...form, brideFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-300 mb-1">
                موعد ليلة الحنة
              </label>
              <input
                type="text"
                value={form.hennaDay}
                onChange={(e) => setForm({ ...form, hennaDay: e.target.value })}
                placeholder="يوم الأربعاء"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-300 mb-1">
                مكان ليلة الحنة
              </label>
              <input
                type="text"
                value={form.hennaLocation}
                onChange={(e) => setForm({ ...form, hennaLocation: e.target.value })}
                placeholder="أمام منزل والد العريس"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                يوم حفل الزفاف
              </label>
              <input
                type="text"
                value={form.weddingDay}
                onChange={(e) => setForm({ ...form, weddingDay: e.target.value })}
                placeholder="يوم الخميس"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                تاريخ وموعد حفل الزفاف *
              </label>
              <input
                type="datetime-local"
                required
                value={form.weddingDate ? form.weddingDate.slice(0, 16) : ''}
                onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم القاعة أو الفندق *
            </label>
            <input
              type="text"
              required
              value={form.hallName}
              onChange={(e) => setForm({ ...form, hallName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان القاعة بالتفصيل
            </label>
            <input
              type="text"
              value={form.hallAddress}
              onChange={(e) => setForm({ ...form, hallAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              رابط الموقع على خرائط جوجل (Google Maps URL)
            </label>
            <input
              type="url"
              value={form.googleMapsUrl}
              onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم الأغنية
              </label>
              <input
                type="text"
                value={form.songTitle}
                onChange={(e) => setForm({ ...form, songTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المطرب / الفنان
              </label>
              <input
                type="text"
                value={form.songArtist}
                onChange={(e) => setForm({ ...form, songArtist: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                رابط الأغنية (YouTube أو ملف MP3)
              </label>
              <input
                type="url"
                value={form.songUrl}
                onChange={(e) => setForm({ ...form, songUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=eCoVcDogvVg"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">
                بدء التشغيل من ثانية:
              </label>
              <input
                type="number"
                min={0}
                value={form.songStartSeconds ?? 45}
                onChange={(e) => setForm({ ...form, songStartSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-300 mb-1">
              رابط Google Sheets Webhook (اختياري لتسجيل الردود تلقائياً في شيت)
            </label>
            <input
              type="url"
              value={form.googleSheetWebhookUrl}
              onChange={(e) => setForm({ ...form, googleSheetWebhookUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-emerald-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              رسالة ترحيبية مخصصة
            </label>
            <textarea
              rows={2}
              value={form.customMessage}
              onChange={(e) => setForm({ ...form, customMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#ffd700] outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} />
              <span>استعادة الافتراضي</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-shimmer-btn text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
