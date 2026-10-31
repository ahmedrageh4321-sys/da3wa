import React, { useEffect, useState } from 'react';
import { Calendar, Share2, Heart, Clock, Download, Sparkles, Mail } from 'lucide-react';
import {
  WeddingDetails,
  calculateCountdown,
  CountdownState,
  formatWeddingDateArabic,
  generateGoogleCalendarUrl,
  generateIcsContent,
  generateWhatsAppShareUrl,
} from '../utils/weddingData.ts';

interface HeroSectionProps {
  details: WeddingDetails;
  onReopenEnvelope: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  onReopenEnvelope,
}) => {
  const [countdown, setCountdown] = useState<CountdownState>(() =>
    calculateCountdown(details.weddingDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(details.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [details.weddingDate]);

  const handleDownloadIcs = () => {
    const content = generateIcsContent(details);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wedding-${details.groomName}-${details.brideName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 px-4 max-w-4xl mx-auto text-center">
      {/* Top Quranic Verse */}
      <div className="space-y-3 mb-6">
        <p className="font-calligraphy text-2xl sm:text-3xl text-amber-200/90 font-bold">
          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </p>
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#1a1d27]/60 border border-[#d4af37]/25 backdrop-blur-md">
          <p className="font-calligraphy text-base sm:text-lg text-amber-100/90 leading-loose">
            «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»
          </p>
        </div>
      </div>

      {/* Families Invitation Banner */}
      <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-300 mb-6">
        <span>{details.groomFamily}</span>
        <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
        <span>{details.brideFamily}</span>
      </div>

      <p className="text-xs sm:text-sm text-amber-300 font-medium tracking-widest uppercase mb-2">
        يتشرفون بدعوتكم لحضور حفل زفاف
      </p>

      {/* Main Couple Names */}
      <div className="my-4 sm:my-6">
        <h1 className="font-calligraphy text-5xl sm:text-7xl font-extrabold tracking-wide gold-gradient-text drop-shadow-md">
          {details.groomName} <span className="text-rose-400 font-sans text-3xl sm:text-5xl">&</span> {details.brideName}
        </h1>
      </div>

      {/* Celebration Occasions Badges: Henna & Wedding */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto mb-8">
        <div className="w-full sm:w-auto flex-1 luxury-card px-4 py-3 rounded-2xl border-rose-500/30 text-right">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs mb-1">
            <Sparkles size={14} className="text-rose-400" />
            <span>ليلة الحنة الشعبية: {details.hennaDay || 'يوم الأربعاء'}</span>
          </div>
          <p className="text-xs text-slate-300">
            {details.hennaLocation || 'أمام منزل والد العريس'}
          </p>
        </div>

        <div className="w-full sm:w-auto flex-1 luxury-card px-4 py-3 rounded-2xl border-amber-500/30 text-right">
          <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs mb-1">
            <Calendar size={14} className="text-[#ffd700]" />
            <span>حفل الزفاف المبارك: {details.weddingDay || 'يوم الخميس'}</span>
          </div>
          <p className="text-xs text-slate-300">
            {details.hallName}
          </p>
        </div>
      </div>

      {/* Wedding Rings Featured Visual */}
      <div className="relative max-w-md mx-auto mb-10 rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-xl group">
        <img
          src="/src/assets/images/wedding_rings_gold_1793439620106.jpg"
          alt="دبل الزفاف والورود"
          referrerPolicy="no-referrer"
          className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-black/20" />
        <div className="absolute bottom-3 inset-x-3 text-center">
          <p className="text-xs text-amber-200 font-medium">
            {details.customMessage}
          </p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold text-amber-300">
          <Clock size={16} />
          <span>المتبقي على ليلة العمر:</span>
        </div>

        {countdown.isPast ? (
          <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold text-lg">
            🎉 تم بحمد الله وتوفيقه زفاف العروسين.. دامت دياركم عامرة بالأفراح!
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            <div className="luxury-card p-3 rounded-2xl text-center border-amber-500/20">
              <span className="block text-2xl sm:text-4xl font-bold font-mono tabular-nums text-[#ffd700]">
                {countdown.days}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300">يوم</span>
            </div>
            <div className="luxury-card p-3 rounded-2xl text-center border-amber-500/20">
              <span className="block text-2xl sm:text-4xl font-bold font-mono tabular-nums text-[#ffd700]">
                {countdown.hours}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300">ساعة</span>
            </div>
            <div className="luxury-card p-3 rounded-2xl text-center border-amber-500/20">
              <span className="block text-2xl sm:text-4xl font-bold font-mono tabular-nums text-[#ffd700]">
                {countdown.minutes}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300">دقيقة</span>
            </div>
            <div className="luxury-card p-3 rounded-2xl text-center border-amber-500/20">
              <span className="block text-2xl sm:text-4xl font-bold font-mono tabular-nums text-rose-400">
                {countdown.seconds}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300">ثانية</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
        <a
          href={generateGoogleCalendarUrl(details)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl luxury-card text-xs sm:text-sm font-semibold text-amber-200 hover:text-white hover:border-[#ffd700] flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Calendar size={16} className="text-[#ffd700]" />
          <span>إضافة لتقويم Google</span>
        </a>

        <button
          onClick={handleDownloadIcs}
          className="py-2.5 px-3 rounded-xl luxury-card text-xs font-semibold text-slate-300 hover:text-white hover:border-[#ffd700] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          title="تحميل ملف التقويم (Apple / Outlook)"
        >
          <Download size={15} />
          <span>ملف iCal</span>
        </button>

        <a
          href={generateWhatsAppShareUrl(details, currentAppUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-200 hover:bg-emerald-600/40 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Share2 size={16} />
          <span>مشاركة عبر واتساب</span>
        </a>
      </div>

      {/* Discreet Secondary Bar: Re-open envelope */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center text-xs text-slate-400">
        <button
          onClick={onReopenEnvelope}
          className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Mail size={14} />
          <span>إعادة فتح الظرف الملكي</span>
        </button>
      </div>
    </section>
  );
};
