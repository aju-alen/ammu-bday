'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audibleRef = useRef(false);
  const bootingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;
    audio.loop = true;

    const tryStartAudible = async () => {
      try {
        audio.muted = false;
        await audio.play();
        audibleRef.current = true;
        return true;
      } catch {
        return false;
      }
    };

    const tryStartMuted = async () => {
      try {
        audio.muted = true;
        await audio.play();
        return true;
      } catch {
        return false;
      }
    };

    const tryUnmute = async () => {
      if (audibleRef.current) return true;

      audio.muted = false;

      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          audio.muted = true;
          return false;
        }
      }

      audibleRef.current = true;
      return true;
    };

    const bootstrap = async () => {
      if (audibleRef.current || bootingRef.current) return;
      bootingRef.current = true;

      try {
        if (await tryStartAudible()) return;

        if (!(await tryStartMuted())) return;

        await tryUnmute();
      } finally {
        bootingRef.current = false;
      }
    };

    const onUserGesture = () => {
      void bootstrap();
    };

    void bootstrap();

    const mediaEvents = ['loadeddata', 'canplay', 'canplaythrough'] as const;
    mediaEvents.forEach((event) => audio.addEventListener(event, onUserGesture));

    const gestureEvents = ['pointerdown', 'touchstart', 'keydown', 'click', 'scroll', 'wheel'] as const;
    gestureEvents.forEach((event) =>
      document.addEventListener(event, onUserGesture, { passive: true }),
    );

    return () => {
      mediaEvents.forEach((event) => audio.removeEventListener(event, onUserGesture));
      gestureEvents.forEach((event) =>
        document.removeEventListener(event, onUserGesture),
      );
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        autoPlay
        muted
        preload="auto"
        playsInline
        aria-hidden
      />
      {children}
    </>
  );
}
