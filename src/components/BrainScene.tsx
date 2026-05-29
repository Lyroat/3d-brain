'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { BrainModel } from './BrainModel';

export function BrainScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#818cf8" />

      <Suspense fallback={null}>
        <BrainModel />
        <Environment preset="city" environmentIntensity={0.2} />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        enablePan
      />
    </Canvas>
  );
}
