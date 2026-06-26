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

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const clamped = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
      const slide = container.children[clamped] as HTMLElement | undefined;
      slide?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      setCurrent(clamped);
    },
    [prefersReducedMotion],
  );

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
    <section
      className="relative h-dvh w-full min-w-0 flex flex-col overflow-x-clip"
      aria-label="Birthday meme reel"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <header
        className="absolute top-0 inset-x-0 z-20 pointer-events-none border-b"
        style={{
          paddingTop: 'max(0.75rem, var(--safe-top))',
          paddingLeft: 'max(1rem, var(--safe-left))',
          paddingRight: 'max(1rem, var(--safe-right))',
          background:
            'linear-gradient(to bottom, var(--color-paper), color-mix(in oklch, var(--color-paper) 88%, transparent))',
          borderColor: 'var(--color-rule)',
        }}
      >
        <div className="px-[clamp(0.25rem,2vw,1rem)] pt-2 pb-3 sm:pb-4">
          <p
            className="text-center font-normal leading-tight mb-2 sm:mb-3 min-w-0 [overflow-wrap:anywhere]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-gallery-title)',
              color: 'var(--color-ink)',
            }}
          >
            nahh Just kidding
          </p>

          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between pointer-events-auto min-w-0">
            <p
              className="font-mono uppercase tracking-[0.12em] sm:tracking-[0.18em] text-center sm:text-left shrink-0"
              style={{ fontSize: 'var(--text-caption)', color: 'var(--color-muted)' }}
            >
              {current < CLOSING_INDEX
                ? `Exhibit ${current + 1} of ${gifs.length}`
                : 'One more thing'}
            </p>

            <nav
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2 min-w-0"
              aria-label="Jump to slide"
            >
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
                  className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 flex items-center justify-center rounded-full transition-[background-color,transform] duration-(--dur-fast) focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 active:scale-95 shrink-0"
                  style={{
                    outlineColor: 'var(--color-focus)',
                    backgroundColor:
                      index === current
                        ? 'var(--color-accent)'
                        : 'var(--color-paper-3)',
                  }}
                >
                  <span
                    className="block rounded-full"
                    style={{
                      width: index === current ? '0.625rem' : '0.375rem',
                      height: index === current ? '0.625rem' : '0.375rem',
                      backgroundColor:
                        index === current ? 'var(--color-ink)' : 'var(--color-muted)',
                    }}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-clip snap-y snap-mandatory overscroll-y-contain"
        style={{ backgroundColor: 'var(--color-paper-2)' }}
      >
        {gifs.map((gif, index) => (
          <article
            key={gif.id}
            data-index={index}
            className="relative h-dvh snap-start snap-always flex items-center justify-center px-[clamp(0.75rem,3vw,2rem)] box-border pt-[var(--gallery-header)] pb-[var(--gallery-footer)]"
          >
            <motion.div
              className="relative w-full min-w-0 max-w-lg rounded-(--radius-md) p-2 sm:p-3"
              style={{ backgroundColor: 'var(--color-paper)' }}
              initial={prefersReducedMotion ? false : { opacity: 0.85 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gif.src}
                alt={gif.alt}
                className="w-full min-w-0 h-auto max-h-[min(58dvh,calc(100dvh-var(--gallery-header)-var(--gallery-footer)-2rem))] object-contain rounded-(--radius-sm)"
                style={{
                  boxShadow: '0 16px 40px -16px var(--color-card-shadow, oklch(55% 0.04 45 / 0.12))',
                }}
              />
            </motion.div>
          </article>
        ))}

        <article
          data-index={CLOSING_INDEX}
          className="relative h-dvh snap-start snap-always flex items-center justify-center px-[clamp(1rem,5vw,3rem)] box-border pt-[var(--gallery-header)] pb-[var(--gallery-footer)]"
          style={{ backgroundColor: 'var(--color-paper)' }}
        >
          <motion.p
            className="text-center leading-relaxed w-full min-w-0 max-w-md [overflow-wrap:anywhere]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.125rem, 2.5vw + 0.65rem, 1.75rem)',
              color: 'var(--color-ink)',
            }}
          >
            Amma did not want to be a part of this so she sends her kisses and
            misses you a lot.
          </motion.p>
        </article>
      </div>

      <footer
        className="absolute bottom-0 inset-x-0 z-20 pointer-events-none border-t"
        style={{
          paddingBottom: 'max(1rem, var(--safe-bottom))',
          paddingLeft: 'max(1rem, var(--safe-left))',
          paddingRight: 'max(1rem, var(--safe-right))',
          background:
            'linear-gradient(to top, var(--color-paper), color-mix(in oklch, var(--color-paper) 85%, transparent))',
          borderColor: 'var(--color-rule)',
        }}
      >
        <p
          className="text-center font-mono uppercase tracking-[0.12em] sm:tracking-[0.14em] px-2 py-4 pointer-events-none"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-muted)',
          }}
        >
          {current < CLOSING_INDEX ? 'Scroll or press ↓' : 'Happy birthday, Ammu'}
        </p>
      </footer>
    </section>
  );
}
