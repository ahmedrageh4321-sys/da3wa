import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface AudioPlayerProps {
  customAudioUrl?: string;
  startSeconds?: number;
  autoPlayTrigger?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  customAudioUrl = '/assets/audio/wedding-song.weba',
  startSeconds = 25,
  autoPlayTrigger = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showZaghrootaToast, setShowZaghrootaToast] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasStartedRef = useRef<boolean>(false);

  // Start playback from 45 seconds
  const startAudioPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      audio.currentTime = startSeconds;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log('Autoplay deferred for gesture:', err);
      });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Keep loop starting from 45 seconds
    const handleEnded = () => {
      audio.currentTime = startSeconds;
      audio.play().catch(() => {});
    };

    // When audio metadata is loaded, set initial position to 45 seconds
    const handleLoadedMetadata = () => {
      if (!hasStartedRef.current) {
        audio.currentTime = startSeconds;
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Global listener for first user touch / click anywhere on the page
    const handleFirstGesture = () => {
      startAudioPlayback();
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [startSeconds]);

  // Handle external trigger (e.g. envelope opened)
  useEffect(() => {
    if (autoPlayTrigger) {
      startAudioPlayback();
    }
  }, [autoPlayTrigger, startSeconds]);

  // Toggle Mute / Unmute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Toggle Play / Pause if user taps speaker
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.currentTime < startSeconds) {
        audio.currentTime = startSeconds;
      }
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Egyptian Zaghroota Celebration Sound
  const playCelebratoryTrill = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);

      mod.frequency.setValueAtTime(18, now);
      modGain.gain.setValueAtTime(160, now);

      mod.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      mod.start(now);
      osc.start(now);
      mod.stop(now + 1.8);
      osc.stop(now + 1.8);

      setShowZaghrootaToast(true);
      setTimeout(() => setShowZaghrootaToast(false), 2500);
    } catch (e) {
      console.warn('Sound effect:', e);
    }
  };

  return (
    <>
      {/* HTML5 Native Audio element playing the local wedding song */}
      <audio
        ref={audioRef}
        src={customAudioUrl}
        preload="auto"
        muted={isMuted}
        playsInline
      />

      {/* Discrete Floating Sound & Zaghroota Controls */}
      <div
        className="fixed top-4 left-4 z-40 flex items-center gap-2"
        role="region"
        aria-label="التحكم بالصوت"
      >
        {/* Subtle Mute / Audio Toggle Button with Equalizer animation */}
        <button
          onClick={toggleMute}
          onDoubleClick={togglePlayPause}
          aria-label={isMuted ? 'إلغاء كتم الموسيقى' : 'كتم الموسيقى'}
          className={`h-9 px-3 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-black/30 transition-all cursor-pointer ${
            isMuted
              ? 'bg-[#1a1d27]/80 border-slate-700 text-slate-400 hover:text-white'
              : 'bg-[#1a1d27]/90 border-[#d4af37]/50 text-[#ffd700] hover:border-[#ffd700]'
          }`}
          title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}

          {/* Equalizer waves */}
          {!isMuted && isPlaying && (
            <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
              <span className="w-0.5 h-2.5 bg-[#ffd700] rounded-full animate-pulse" />
              <span className="w-0.5 h-3.5 bg-[#ffd700] rounded-full animate-bounce" />
              <span className="w-0.5 h-2 bg-[#ffd700] rounded-full animate-pulse" />
            </div>
          )}
        </button>

        {/* Egyptian Zaghroota Celebration Button */}
        <button
          onClick={playCelebratoryTrill}
          title="زغروطة الفرح المصرية"
          aria-label="زغروطة الفرح"
          className="h-9 px-3 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg backdrop-blur-md"
        >
          <Sparkles size={13} className="text-rose-400 animate-spin" />
          <span>زغروطة!</span>
        </button>
      </div>

      {/* Zaghroota Toast */}
      {showZaghrootaToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gradient-to-r from-rose-900/90 to-amber-900/90 backdrop-blur-md border border-rose-400/50 rounded-full text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✨ كلوووولولولولولولويش! ألف مبروك للعروسين 💍💐</span>
        </div>
      )}
    </>
  );
};
