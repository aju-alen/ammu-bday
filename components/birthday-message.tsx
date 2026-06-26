'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface BirthdayMessageProps {
  onProceed: () => void;
}

export default function BirthdayMessage({ onProceed }: BirthdayMessageProps) {
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.15 : 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const rise = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      className="relative min-h-dvh w-full min-w-0 flex flex-col justify-end"
      aria-label="Birthday greeting for Ammu"
    >
      <Image
        src="/ammu-bday.jpeg"
        alt="Ammu"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_20%] sm:object-[center_25%]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, oklch(12% 0.02 40 / 0.72) 0%, oklch(18% 0.02 45 / 0.35) 38%, transparent 72%)',
        }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 w-full min-w-0 max-w-2xl px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(4.5rem,12vh,6rem)] pb-[max(1.5rem,calc(1.25rem+var(--safe-bottom)))]"
        initial="hidden"
        animate={isReady ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 } },
        }}
      >
        <motion.p
          variants={fade}
          className="font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] mb-3"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'color-mix(in oklch, var(--color-on-photo) 72%, transparent)',
          }}
        >
          June 26
        </motion.p>

        <motion.h1
          variants={rise}
          className="font-normal leading-[1.05] mb-4 overflow-wrap-anywhere min-w-0 [overflow-wrap:anywhere]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-display)',
            color: 'var(--color-on-photo)',
          }}
        >
          Happy Birthday, Ammu
        </motion.h1>

        <motion.div
          variants={rise}
          className="leading-relaxed w-full min-w-0 max-w-md mb-6 sm:mb-8 space-y-3 sm:space-y-4"
          style={{
            fontSize: 'var(--text-lede)',
            color: 'color-mix(in oklch, var(--color-on-photo) 88%, transparent)',
          }}
        >
          <p className="min-w-0 [overflow-wrap:anywhere]">
            You make every room louder, warmer, and a little more chaotic in the
            best way.
          </p>
          <p className="min-w-0 [overflow-wrap:anywhere]">God bless you, uwu ummmmmmmma</p>
          <p className="min-w-0 [overflow-wrap:anywhere]">
            Ente sneham kand nee karayum in the next slide. Click below
          </p>
        </motion.div>

        <motion.div
          variants={rise}
          className="flex justify-start mb-1"
          aria-hidden
        >
          <motion.span
            className="text-2xl sm:text-3xl select-none"
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, 10, 0] }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            👇
          </motion.span>
        </motion.div>

        <motion.div variants={rise}>
          <button
            type="button"
            onClick={onProceed}
            className="group inline-flex items-center gap-2 font-medium whitespace-nowrap rounded-sm px-1 py-2 min-h-12 min-w-12 transition-opacity duration-(--dur-fast) hover:opacity-80 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 active:opacity-70"
            style={{
              color: 'var(--color-on-photo)',
              outlineColor: 'var(--color-focus)',
            }}
          >
            <span
              className="border-b pb-0.5 transition-[border-color] duration-(--dur-fast) group-hover:border-(--color-accent)"
              style={{ borderColor: 'color-mix(in oklch, var(--color-on-photo) 45%, transparent)' }}
            >
              See the evidence
            </span>
            <span
              aria-hidden
              className="transition-transform duration-(--dur-fast) group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
