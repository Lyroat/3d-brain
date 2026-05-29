'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { InfoPanel } from '@/components/InfoPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { LoadingScreen } from '@/components/LoadingScreen';

const BrainScene = dynamic(
  () => import('@/components/BrainScene').then((mod) => ({ default: mod.BrainScene })),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a1a]">
      <Suspense fallback={<LoadingScreen />}>
        <BrainScene />
      </Suspense>

      <InfoPanel />
      <ControlPanel />

      {/* Title */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-lg font-light text-white/30 tracking-widest">
          3D BRAIN EXPLORER
        </h1>
      </div>
    </main>
  );
}
