'use client';

import { useState } from 'react';
import BirthdayMessage from '@/components/birthday-message';
import GifGallery from '@/components/gif-gallery';
import { MusicProvider } from '@/components/music-provider';

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <MusicProvider>
      <main className="min-h-dvh overflow-x-clip">
        {!showGallery ? (
          <BirthdayMessage onProceed={() => setShowGallery(true)} />
        ) : (
          <GifGallery />
        )}
      </main>
    </MusicProvider>
  );
}
