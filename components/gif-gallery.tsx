'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GifItem {
  id: number;
  src: string;
  alt: string;
}

const gifs: GifItem[] = [
  {
    id: 1,
    src: '/1.gif',
    alt: 'Me when Ammu brings so much joy once she leaves the room',
  },
  {
    id: 2,
    src: '/2.gif',
    alt: 'Me after July 12 moving into my new bedroom',
  },
  {
    id: 3,
    src: '/3.gif',
    alt: 'Us sad after Ammu leaves',
  },
];

const CLOSING_INDEX = gifs.length;
const TOTAL_SLIDES = gifs.length + 1;

export default function GifGallery() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
    const slide = container.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    setCurrent(clamped);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) setCurrent(index);
          }
        }
      },
      { root: container, threshold: [0.55, 0.75] },
    );

    Array.from(container.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        scrollToIndex(current + 1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(current - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, scrollToIndex]);

  return (
    <section className="relative h-dvh flex flex-col" aria-label="Birthday meme reel">
      <header
        className="absolute top-0 inset-x-0 z-20 px-[clamp(1rem,4vw,2rem)] pt-5 pb-8 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--color-overlay-strong), transparent)',
        }}
      >
        <p
          className="text-center font-normal leading-tight mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw + 0.5rem, 2.25rem)',
            color: 'var(--color-on-photo)',
          }}
        >
          nahh Just kidding
        </p>
        <div className="flex items-center justify-between pointer-events-auto">
          <p
            className="font-mono uppercase tracking-[0.18em]"
            style={{ fontSize: 'var(--text-caption)', color: 'var(--color-on-photo)' }}
          >
            {current < CLOSING_INDEX
              ? `Exhibit ${current + 1} of ${gifs.length}`
              : 'One more thing'}
          </p>
          <nav className="flex gap-2" aria-label="Jump to slide">
            {Array.from({ length: TOTAL_SLIDES }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={
                  index < CLOSING_INDEX
                    ? `Go to meme ${index + 1}`
                    : 'Go to closing message'
                }
                aria-current={index === current ? 'true' : undefined}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-full transition-[background-color,transform] duration-[var(--dur-fast)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 active:scale-95"
                style={{
                  outlineColor: 'var(--color-focus)',
                  backgroundColor:
                    index === current
                      ? 'var(--color-accent)'
                      : 'color-mix(in oklch, var(--color-on-photo) 18%, transparent)',
                }}
              >
                <span
                  className="block rounded-full"
                  style={{
                    width: index === current ? '0.625rem' : '0.375rem',
                    height: index === current ? '0.625rem' : '0.375rem',
                    backgroundColor:
                      index === current ? 'var(--color-ink)' : 'var(--color-on-photo)',
                  }}
                />
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory overscroll-y-contain"
        style={{ backgroundColor: 'var(--color-ink)' }}
      >
        {gifs.map((gif, index) => (
          <article
            key={gif.id}
            data-index={index}
            className="relative h-dvh snap-start snap-always flex items-center justify-center px-[clamp(0.75rem,3vw,2rem)]"
          >
            <motion.div
              className="relative w-full max-w-lg"
              initial={prefersReducedMotion ? false : { opacity: 0.85 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gif.src}
                alt={gif.alt}
                className="w-full h-auto max-h-[78dvh] object-contain rounded-[var(--radius-sm)]"
                style={{
                  boxShadow: '0 24px 48px -20px oklch(0% 0 0 / 0.65)',
                }}
              />
            </motion.div>
          </article>
        ))}

        <article
          data-index={CLOSING_INDEX}
          className="relative h-dvh snap-start snap-always flex items-center justify-center px-[clamp(1.25rem,5vw,3rem)]"
        >
          <motion.p
            className="text-center leading-relaxed max-w-md overflow-wrap-anywhere min-w-0"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.5vw + 0.75rem, 1.75rem)',
              color: 'var(--color-on-photo)',
            }}
          >
            Amma did not want to be a part of this so she sends her kisses and
            misses you a lot.
          </motion.p>
        </article>
      </div>

      <footer
        className="absolute bottom-0 inset-x-0 z-20 px-[clamp(1rem,4vw,2rem)] py-5 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--color-overlay-strong), transparent)',
        }}
      >
        <p
          className="text-center font-mono uppercase tracking-[0.14em] pointer-events-none"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'color-mix(in oklch, var(--color-on-photo) 70%, transparent)',
          }}
        >
          {current < CLOSING_INDEX
            ? 'Scroll or press ↓'
            : 'Happy birthday, Ammu'}
        </p>
      </footer>
    </section>
  );
}
