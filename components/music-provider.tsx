'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;

    const autoplay = async () => {
      if (startedRef.current) return;

      try {
        audio.muted = false;
        await audio.play();
        startedRef.current = true;
        return;
      } catch {
        // Fall through to muted autoplay, then unmute
      }

      try {
        audio.muted = true;
        await audio.play();
        audio.muted = false;
        startedRef.current = true;
      } catch {
        // Browser blocked autoplay entirely
      }
    };

    void autoplay();
    audio.addEventListener('canplaythrough', autoplay);

    return () => {
      audio.removeEventListener('canplaythrough', autoplay);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        autoPlay
        preload="auto"
        playsInline
        aria-hidden
      />
      {children}
    </>
  );
}
