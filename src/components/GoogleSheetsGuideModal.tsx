import React, { useState } from 'react';
import { X, Copy, Check, FileSpreadsheet, ExternalLink } from 'lucide-react';

interface GoogleSheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWebhookUrl?: (url: string) => void;
}

export const GoogleSheetsGuideModal: React.FC<GoogleSheetsGuideModalProps> = ({
  isOpen,
  onClose,
  onApplyWebhookUrl,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [webhookInput, setWebhookInput] = useState<string>('');

  if (!isOpen) return null;

  const appsScriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["التاريخ والوقت", "نوع البيانات", "الاسم", "صلة القرابة / حالة الحضور", "الرسالة / تفاصيل الحضور", "الرمز"]);
  }
  
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter || {};
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  } else {
    data = {
      type: "COMMENT",
      authorName: "تجربة فحص السكربت",
      relation: "فحص",
      message: "تم فحص السكربت بنجاح وتجهيز الشيت!",
      reaction: "🎉"
    };
  }
  
  var now = Utilities.formatDate(new Date(), "Africa/Cairo", "yyyy-MM-dd HH:mm:ss");
  
  if (data.type === "RSVP" || data.type === "rsvp") {
    sheet.appendRow([
      now,
      "تأكيد حضور (RSVP)",
      data.guestName || "غير محدد",
      data.attending === "yes" ? "سأحضر بكل سرور ✨" : "أعتذر بكل ود 🌹",
      "عدد الأفراد: " + (data.guestCount || 1) + (data.dietaryOrNotes ? " - ملاحظات: " + data.dietaryOrNotes : ""),
      "-"
    ]);
  } else {
    sheet.appendRow([
      now,
      "تهنئة للعروسين 💌",
      data.authorName || "فاعل خير",
      data.relation || "صديق العائلة",
      data.message || "",
      data.reaction || "❤️"
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// دالة تجريبية لاختبار الشيت يدوياً عند الضغط على Run
function test() {
  doPost(null);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveUrl = () => {
    if (onApplyWebhookUrl && webhookInput.trim()) {
      onApplyWebhookUrl(webhookInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="luxury-card w-full max-w-xl rounded-3xl border-[#d4af37]/50 p-6 my-8 text-right shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-emerald-400" />
            <h3 className="font-bold text-lg text-white">
              ربط الدعوة بـ Google Sheets تلقائياً
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          يمكنك استقبال كل تأكيدات الحضور (RSVP) وتهاني المعازيم تلقائياً ومباشرة في شيت إكسل على Google Drive الخاص بك!
        </p>

        {/* Quick steps */}
        <div className="space-y-3 mb-5 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-[#ffd700] border border-amber-500/40 flex items-center justify-center font-bold shrink-0">1</span>
            <p>أنشئ ملفاً جديداً على <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-300 underline font-semibold inline-flex items-center gap-1">جوجل شيتس <ExternalLink size={11} /></a></p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-[#ffd700] border border-amber-500/40 flex items-center justify-center font-bold shrink-0">2</span>
            <p>من القائمة اضغط على <strong>Extensions</strong> ثم <strong>Apps Script</strong> والصق الكود التالي:</p>
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">Google Apps Script</span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            >
              {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="text-[11px] font-mono text-emerald-300/90 max-h-40 overflow-y-auto whitespace-pre-wrap text-left dir-ltr p-1">
            {appsScriptCode}
          </pre>
        </div>

        {/* Input for URL */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-amber-200">
            ضع رابط Webhook الناتج بعد النشر (Deploy Web App):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-400 outline-none"
            />
            <button
              onClick={handleSaveUrl}
              disabled={!webhookInput.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
            >
              حفظ الرابط
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            💡 ملاحظة: يمكنك أيضاً دائماً استخدام زر <strong>«تصدير إلى Excel / CSV»</strong> بنقرة واحدة لتحميل كل البيانات فوراً بدون أي إعدادات!
          </p>
        </div>
      </div>
    </div>
  );
};
