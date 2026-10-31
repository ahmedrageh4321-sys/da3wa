import React, { useState, useEffect } from 'react';
import { PetalBackground } from './components/PetalBackground.tsx';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { EnvelopeScreen } from './components/EnvelopeScreen.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { TimelineSection } from './components/TimelineSection.tsx';
import { VenueSection } from './components/VenueSection.tsx';
import { RsvpSection } from './components/RsvpSection.tsx';
import { CommentsSection } from './components/CommentsSection.tsx';
import { GoogleSheetsGuideModal } from './components/GoogleSheetsGuideModal.tsx';
import { DeployGuideModal } from './components/DeployGuideModal.tsx';
import {
  WeddingDetails,
  DEFAULT_WEDDING_DETAILS,
  DEFAULT_TIMELINE,
  INITIAL_COMMENTS,
  GuestComment,
  GuestRsvp,
} from './utils/weddingData.ts';
import { Github, Heart, MessageSquareHeart, MapPin, UserCheck } from 'lucide-react';

export default function App() {
  // Check if opened via URL query parameter
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const autostart = searchParams?.get('autostart') === '1' || searchParams?.get('opened') === '1';

  const [isOpened, setIsOpened] = useState<boolean>(autostart);
  const [details, setDetails] = useState<WeddingDetails>(() => {
    try {
      const saved = localStorage.getItem('wedding_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.groomName && parsed.groomName !== 'أحمد') {
          return {
            ...DEFAULT_WEDDING_DETAILS,
            ...parsed,
            groomFamily: DEFAULT_WEDDING_DETAILS.groomFamily,
            brideFamily: DEFAULT_WEDDING_DETAILS.brideFamily,
            googleMapsUrl: DEFAULT_WEDDING_DETAILS.googleMapsUrl,
            wazeUrl: DEFAULT_WEDDING_DETAILS.wazeUrl,
            uberUrl: DEFAULT_WEDDING_DETAILS.uberUrl,
            songUrl: DEFAULT_WEDDING_DETAILS.songUrl,
            songStartSeconds: 25,
            googleSheetWebhookUrl: DEFAULT_WEDDING_DETAILS.googleSheetWebhookUrl,
          };
        }
      }
      return DEFAULT_WEDDING_DETAILS;
    } catch {
      return DEFAULT_WEDDING_DETAILS;
    }
  });

  const [comments, setComments] = useState<GuestComment[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_comments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only real user comments, ignore fake sample comments
          return parsed.filter((c) => !['c1', 'c2', 'c3'].includes(c.id));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isSheetsGuideOpen, setIsSheetsGuideOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [shouldAutoPlayMusic, setShouldAutoPlayMusic] = useState<boolean>(false);

  // Save changes to localStorage
  const handleSaveDetails = (updated: WeddingDetails) => {
    setDetails(updated);
    try {
      localStorage.setItem('wedding_details', JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save:', e);
    }
  };

  const handleAddComment = (newComment: GuestComment) => {
    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem('wedding_comments', JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save:', e);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updated);
    try {
      localStorage.setItem('wedding_comments', JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save:', e);
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    setShouldAutoPlayMusic(true);
  };

  const handleReopenEnvelope = () => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0f15] text-[#f8f9fa] relative overflow-x-hidden flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#ffd700]">
      {/* Animated Floating Rose Petals and Shimmer Stars */}
      <PetalBackground />

      {/* Background Audio Controller ("الليلة دي" - عمرو دياب من 0:25) */}
      <AudioPlayer
        customAudioUrl={details.songUrl}
        startSeconds={details.songStartSeconds || 25}
        autoPlayTrigger={shouldAutoPlayMusic}
      />

      {/* Top Floating Deployment Guide button */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsDeployGuideOpen(true)}
          title="دليل الرفع على GitHub والنشر أونلاين"
          className="p-2 rounded-full bg-[#1a1d27]/90 backdrop-blur-md border border-slate-700 hover:border-slate-400 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
          aria-label="دليل الرفع على GitHub"
        >
          <Github size={16} />
        </button>
      </div>

      {/* SCREEN 1: Envelope Opening Screen */}
      {!isOpened ? (
        <EnvelopeScreen
          details={details}
          onOpenInvitation={handleOpenEnvelope}
        />
      ) : (
        /* SCREEN 2: The Full Royal Wedding Invitation */
        <main className="relative flex-1 z-20 pb-24">
          {/* Hero & Countdown */}
          <HeroSection
            details={details}
            onReopenEnvelope={handleReopenEnvelope}
          />

          {/* Wedding Day Schedule / Timeline */}
          <TimelineSection timeline={DEFAULT_TIMELINE} />

          {/* Hall Venue & Map Location */}
          <VenueSection details={details} />

          {/* RSVP Attendance Confirmation */}
          <RsvpSection details={details} />

          {/* Guest Congratulations & Comments Wall with Excel Export & Sheets Link */}
          <CommentsSection
            details={details}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onOpenSheetsGuide={() => setIsSheetsGuideOpen(true)}
          />

          {/* Romantic Royal Footer */}
          <footer className="pt-12 pb-16 px-4 text-center border-t border-slate-800/80 bg-gradient-to-t from-black to-transparent">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-rose-500">
              <Heart size={20} className="fill-rose-500 animate-pulse" />
            </div>
            <h3 className="font-calligraphy text-2xl font-bold gold-gradient-text mb-1">
              {details.groomName} & {details.brideName}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              فرحتنا تكتمل بوجودكم بيننا.. دامت أيامكم عامرة بالأفراح والمحبة والمسرات ✨
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>{details.hallName}</span>
              <span>·</span>
              <button
                onClick={() => setIsDeployGuideOpen(true)}
                className="hover:text-amber-400 underline transition-colors"
              >
                دليل رفع الدعوة على GitHub و Deploy
              </button>
            </div>
          </footer>

          {/* Mobile Bottom Thumb Navigation Bar */}
          <nav
            aria-label="التنقل السريع"
            className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-[#12151e]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around"
          >
            <a
              href="#guest-name"
              className="flex flex-col items-center gap-0.5 text-[10px] text-amber-200 hover:text-white"
            >
              <UserCheck size={18} className="text-[#ffd700]" />
              <span>تأكيد الحضور</span>
            </a>
            <button
              onClick={() => {
                const el = document.querySelector('iframe');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-0.5 text-[10px] text-slate-300 hover:text-white"
            >
              <MapPin size={18} className="text-rose-400" />
              <span>موقع القاعة</span>
            </button>
            <a
              href="#comment-author"
              className="flex flex-col items-center gap-0.5 text-[10px] text-slate-300 hover:text-white"
            >
              <MessageSquareHeart size={18} className="text-emerald-400" />
              <span>سجل التهاني</span>
            </a>
          </nav>
        </main>
      )}

      {/* Google Sheets Step-by-Step Connection Modal */}
      <GoogleSheetsGuideModal
        isOpen={isSheetsGuideOpen}
        onClose={() => setIsSheetsGuideOpen(false)}
        onApplyWebhookUrl={(url) => {
          handleSaveDetails({ ...details, googleSheetWebhookUrl: url });
        }}
      />

      {/* GitHub & Deployment Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
