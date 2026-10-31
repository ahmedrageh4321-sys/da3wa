import React from 'react';
import { Clock, Sparkles, BookOpen, Crown, Utensils, HeartHandshake } from 'lucide-react';
import { TimelineItem } from '../utils/weddingData.ts';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles size={18} className="text-[#ffd700]" />;
    case 'BookOpen':
      return <BookOpen size={18} className="text-[#ffd700]" />;
    case 'Crown':
      return <Crown size={18} className="text-amber-400" />;
    case 'Utensils':
      return <Utensils size={18} className="text-[#ffd700]" />;
    case 'HeartHandshake':
      return <HeartHandshake size={18} className="text-rose-400" />;
    default:
      return <Sparkles size={18} className="text-[#ffd700]" />;
  }
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full luxury-card text-xs text-amber-300 font-medium mb-2">
          <Clock size={13} />
          <span>مواعيد وفقرات الحفل</span>
        </div>
        <h2 className="font-calligraphy text-3xl sm:text-4xl font-bold gold-gradient-text">
          برنامج ليلة العمر
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          يسعدنا مشاركتكم كل لحظة جميلة في هذه الليلة الاستثنائية
        </p>
      </div>

      <div className="relative border-r-2 border-[#d4af37]/30 pr-6 mr-3 sm:mr-6 space-y-8">
        {timeline.map((item) => (
          <div
            key={item.id}
            className="relative transition-all duration-300 hover:translate-x-1"
          >
            {/* Timeline Node Dot */}
            <div className="absolute -right-[35px] top-1.5 w-6 h-6 rounded-full bg-[#161822] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.4)]">
              <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
            </div>

            <div className="luxury-card p-4 sm:p-5 rounded-2xl luxury-card-glow transition-all">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ffd700] bg-[#2a2415] px-2.5 py-1 rounded-lg border border-[#d4af37]/30 font-mono">
                  {item.time}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center">
                  {getIconComponent(item.iconName)}
                </div>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-amber-100">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
