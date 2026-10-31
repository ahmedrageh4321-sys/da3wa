import React, { useState } from 'react';
import { Heart, Sparkles, MailOpen } from 'lucide-react';
import { WeddingDetails } from '../utils/weddingData.ts';

interface EnvelopeScreenProps {
  details: WeddingDetails;
  onOpenInvitation: () => void;
}

export const EnvelopeScreen: React.FC<EnvelopeScreenProps> = ({
  details,
  onOpenInvitation,
}) => {
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Audio chime effect on opening
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch {
      // Audio fallback silent
    }

    // After animation finishes, switch to main screen
    setTimeout(() => {
      onOpenInvitation();
    }, 1100);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#0b0d13] via-[#12151f] to-[#0a0c12]">
      {/* Ambient background glow & stars */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Arabic Welcome */}
      <div className="text-center mb-6 sm:mb-8 z-20 animate-[fadeIn_0.8s_ease-out]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#1a1d27]/70 text-[#f7df94] text-xs sm:text-sm font-medium mb-3 shadow-md backdrop-blur-sm">
          <Sparkles size={14} className="text-[#ffd700]" />
          <span>دعوة زفاف خاصة وملكية</span>
          <Sparkles size={14} className="text-[#ffd700]" />
        </div>
        <p className="font-calligraphy text-2xl sm:text-3xl text-amber-100 font-bold tracking-wide">
          بسم الله الرحمن الرحيم
        </p>
      </div>

      {/* Main Envelope Presentation Container */}
      <div className="relative w-full max-w-md sm:max-w-lg z-20">
        <div
          className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-[#d4af37]/40 bg-[#161822] transition-all duration-1000 ${
            isOpening ? 'scale-105 -translate-y-6 opacity-0' : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          {/* Envelope Photorealistic Artwork with Gold Frame */}
          <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
            <img
              src="/src/assets/images/wedding_envelope_seal_1793439620009.jpg"
              alt="ظرف الدعوة الملكية مختوم بالشمع الذهبي"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161822] via-transparent to-black/30" />

            {/* Couple names on envelope label */}
            <div className="absolute bottom-4 inset-x-4 text-center p-3 rounded-2xl bg-[#0e1017]/85 backdrop-blur-md border border-[#d4af37]/30">
              <span className="text-[11px] text-amber-200/80 tracking-wider">
                زفاف الغاليين
              </span>
              <h2 className="font-calligraphy text-3xl sm:text-4xl font-bold gold-gradient-text mt-0.5">
                {details.groomName} & {details.brideName}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {details.hallName}
              </p>
            </div>
          </div>

          {/* Interactive Opening Section */}
          <div className="p-6 text-center space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              تكتمل بهجتنا وسرورنا بوجودكم معنا في ليلة العمر، اضغطوا لفض الختم وفتح بطاقة الدعوة
            </p>

            {/* Big Wax Seal / Button */}
            <button
              onClick={handleOpenClick}
              disabled={isOpening}
              aria-label="افتح بطاقة الدعوة الملكية"
              className="w-full py-3.5 px-6 rounded-2xl text-slate-950 font-bold text-base flex items-center justify-center gap-3 gold-shimmer-btn shadow-lg shadow-[#d4af37]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <MailOpen size={20} className="text-slate-950 group-hover:scale-110 transition-transform" />
              <span>{isOpening ? 'جاري فتح الدعوة الملكية...' : 'افتح الدعوة الملكية 💌'}</span>
              <Heart size={18} className="text-rose-700 fill-rose-700 animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Opening Flash Overlay */}
      {isOpening && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1a1710] to-[#0c0d12] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700">
          <div className="text-center space-y-4 p-6 animate-pulse">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#d4af37] to-[#ffd700] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.7)] animate-bounce">
              <Heart size={32} className="text-rose-900 fill-rose-900" />
            </div>
            <h3 className="font-calligraphy text-3xl font-bold gold-gradient-text">
              أهلاً بكم في ليلة العمر
            </h3>
            <p className="text-sm text-amber-200/80">
              الليلة دي.. أجمل ليالي العمر ✨
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
