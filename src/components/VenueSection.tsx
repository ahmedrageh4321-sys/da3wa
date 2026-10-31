import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Car } from 'lucide-react';
import { WeddingDetails } from '../utils/weddingData.ts';

interface VenueSectionProps {
  details: WeddingDetails;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ details }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${details.hallName} - ${details.hallAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full luxury-card text-xs text-amber-300 font-medium mb-2">
          <MapPin size={13} />
          <span>مواقع الاحتفال والوصول</span>
        </div>
        <h2 className="font-calligraphy text-3xl sm:text-4xl font-bold gold-gradient-text">
          مكان الحنة والقاعة واللوكيشن
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          يسعدنا تشريفكم لنا في ليلة الحنة ويوم الزفاف المبارك
        </p>
      </div>

      {/* Henna Location Special Card */}
      <div className="luxury-card p-5 sm:p-6 rounded-3xl border-rose-500/40 mb-6 bg-gradient-to-r from-rose-950/20 via-[#161822] to-amber-950/20 shadow-xl text-right">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold mb-2">
              ✨ ليلة الحنة المباركة: {details.hennaDay || 'يوم الأربعاء'}
            </span>
            <h3 className="text-xl font-bold text-white">
              {details.hennaLocation || 'أمام منزل والد العريس'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {details.hennaDescription || 'أجواء الحنة الشعبية والموسيقى والدي جي مع الأهل والأحباب'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <MapPin size={24} />
          </div>
        </div>
      </div>

      <div className="luxury-card rounded-3xl overflow-hidden shadow-2xl border-[#d4af37]/35">
        {/* Venue Grand Photo */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src="/assets/images/juliana_hall_real.jpeg"
            alt={details.hallName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161822] via-[#161822]/30 to-transparent" />

          <div className="absolute bottom-4 right-4 left-4 text-right">
            <span className="text-[11px] text-amber-300 font-semibold tracking-wider">
              قاعة الحفل الفاخرة
            </span>
            <h3 className="font-calligraphy text-2xl sm:text-3xl font-bold text-white mt-1">
              {details.hallName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-rose-400 shrink-0" />
              <span>{details.hallAddress}</span>
            </p>
          </div>
        </div>

        {/* Interactive Map Iframe Container */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-slate-700/80 aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-900 shadow-inner">
            <iframe
              title="موقع قاعة الزفاف على خرائط جوجل"
              src="https://maps.google.com/maps?q=30.3856805,31.2613040&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter contrast-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Navigation & Directions Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href={details.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl gold-shimmer-btn text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Navigation size={16} />
              <span>الاتجاهات عبر Google Maps</span>
            </a>

            <a
              href={details.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl luxury-card text-sky-300 hover:text-white hover:border-sky-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ExternalLink size={16} />
              <span>فتح عبر Waze</span>
            </a>

            <a
              href={details.uberUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl luxury-card text-emerald-300 hover:text-white hover:border-emerald-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Car size={16} />
              <span>طلب Uber للقاعة</span>
            </a>

            <button
              onClick={handleCopyAddress}
              className="py-3 px-4 rounded-xl luxury-card text-slate-300 hover:text-white hover:border-amber-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span className="text-emerald-400">تم نسخ العنوان!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>نسخ العنوان</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
