import React, { useState } from 'react';
import { X, Github, Rocket, Check, Copy, ExternalLink, Globe } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Royal Wedding Invitation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="luxury-card w-full max-w-xl rounded-3xl border-[#d4af37]/50 p-6 my-8 text-right shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Rocket size={20} className="text-[#ffd700]" />
            <h3 className="font-bold text-lg text-white">
              رفع المشروع على GitHub وعمل Deploy
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          خطوات سريعة لرفع كود الدعوة على GitHub ونشرها أونلاين على رابط دائم ومجاني خلال دقيقتين:
        </p>

        <div className="space-y-4 text-xs text-slate-200">
          {/* Step 1: GitHub */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#ffd700] flex items-center gap-1.5">
                <Github size={15} />
                <span>الخطوة 1: الرفع على GitHub</span>
              </span>
              <button
                onClick={() => copyText(gitCommands, 'git')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
              >
                {copiedStep === 'git' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedStep === 'git' ? 'تم النسخ' : 'نسخ الأوامر'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-amber-200/90 bg-slate-950 p-2.5 rounded-xl whitespace-pre-wrap text-left dir-ltr">
              {gitCommands}
            </pre>
          </div>

          {/* Step 2: Vercel / Netlify 1-Click Deploy */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <Globe size={15} />
              <span>الخطوة 2: النشر المجاني في ثوانٍ (Vercel أو Netlify)</span>
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
              <li>افتح موقع <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-300 underline font-semibold">Vercel.com</a> أو Netlify.</li>
              <li>اضغط <strong>Add New Project</strong> واختر مستودع GitHub الذي أنشأته.</li>
              <li>اترك الإعدادات الافتراضية واضغط <strong>Deploy</strong>.</li>
              <li>سيصبح لديك رابط سريع متاح لجميع المعازيم حول العالم ويمكنك ربط دومين خاص به (مثل: <code className="text-amber-200 font-mono">ahmed-sara.com</code>)!</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl gold-shimmer-btn text-slate-950 font-bold text-xs"
          >
            فهمت، شكراً لك!
          </button>
        </div>
      </div>
    </div>
  );
};
