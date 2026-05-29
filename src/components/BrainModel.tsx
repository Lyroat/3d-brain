'use client';

import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useBrainStore, REGION_DATA } from '@/store/brain-store';
import regionCentroids from '../../public/models/brain-regions.json';

// Colors by lobe/group for visual coherence
const COLORS: Record<string, string> = {
  // Frontal lobe - purples/pinks
  'dlpfc': '#6366f1',
  'medial-prefrontal': '#7c3aed',
  'orbitofrontal': '#8b5cf6',
  'frontal-pole': '#a78bfa',
  'vlpfc': '#c084fc',
  'primary-motor-cortex': '#ec4899',
  'premotor-sma': '#f472b6',
  'anterior-cingulate': '#e879f9',
  // Parietal lobe - greens/teals
  'primary-somatosensory': '#14b8a6',
  'superior-parietal': '#10b981',
  'inferior-parietal': '#34d399',
  'supramarginal-gyrus': '#2dd4bf',
  'angular-gyrus': '#5eead4',
  'precuneus': '#6ee7b7',
  'posterior-cingulate': '#a7f3d0',
  // Temporal lobe - blues/cyans
  'superior-temporal': '#06b6d4',
  'middle-temporal': '#0ea5e9',
  'inferior-temporal': '#38bdf8',
  'transverse-temporal': '#22d3ee',
  'temporal-pole': '#67e8f9',
  'fusiform-gyrus': '#0284c7',
  'entorhinal-cortex': '#0369a1',
  'parahippocampal': '#075985',
  // Occipital lobe - deep blues
  'lateral-occipital': '#3b82f6',
  'cuneus': '#2563eb',
  'pericalcarine': '#1d4ed8',
  'lingual-gyrus': '#60a5fa',
  // Insular
  'insular-cortex': '#84cc16',
  // Basal ganglia - warm purples
  'caudate': '#a855f7',
  'putamen': '#d946ef',
  'pallidum': '#fb923c',
  'accumbens': '#f43f5e',
  // Limbic
  'hippocampus': '#f97316',
  'amygdala': '#ef4444',
  // Diencephalon
  'thalamus': '#eab308',
  'hypothalamus': '#fbbf24',
  // Brainstem
  'brainstem': '#78716c',
  'substantia-nigra': '#44403c',
  // Cerebellum
  'cerebellum': '#059669',
  // White matter
  'corpus-callosum': '#e2e8f0',
};

function BrainRegionMesh({ name, geometry }: { name: string; geometry: THREE.BufferGeometry }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectedRegion, hoveredRegion, explodeAmount, setSelectedRegion, setHoveredRegion } = useBrainStore();

  const isSelected = selectedRegion === name;
  const isHovered = hoveredRegion === name;
  const hasSelection = selectedRegion !== null;

  const centroid = useMemo(() => {
    const data = (regionCentroids as Record<string, { centroid: number[] }>)[name];
    if (data) return new THREE.Vector3(...data.centroid);
    return new THREE.Vector3(0, 0, 0);
  }, [name]);

  const color = COLORS[name] || '#888888';

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.1,
      roughness: 0.6,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [color]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Explode animation
    const targetPos = centroid.clone().multiplyScalar(explodeAmount * 0.5);
    meshRef.current.position.lerp(targetPos, 0.08);

    // Opacity & emissive based on selection state
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;

    let targetOpacity = 1;
    if (hasSelection && !isSelected && !isHovered) {
      targetOpacity = 0.15;
    } else if (isHovered && !isSelected) {
      targetOpacity = 0.9;
    }
    mat.opacity += (targetOpacity - mat.opacity) * 0.1;

    if (isSelected) {
      mat.emissive.set(color);
      mat.emissiveIntensity += (0.3 - mat.emissiveIntensity) * 0.1;
    } else if (isHovered) {
      mat.emissive.set(color);
      mat.emissiveIntensity += (0.15 - mat.emissiveIntensity) * 0.1;
    } else {
      mat.emissiveIntensity += (0 - mat.emissiveIntensity) * 0.1;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedRegion(isSelected ? null : name);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredRegion(name);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredRegion(null);
    document.body.style.cursor = 'default';
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

export function BrainModel() {
  const { scene } = useGLTF('/models/brain-atlas.glb');
  const groupRef = useRef<THREE.Group>(null);
  const { setSelectedRegion } = useBrainStore();

  const regions = useMemo(() => {
    const result: { name: string; geometry: THREE.BufferGeometry }[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const name = child.name || child.parent?.name || '';
        if (name && REGION_DATA[name]) {
          result.push({ name, geometry: child.geometry });
        }
      }
    });
    return result;
  }, [scene]);

  const handleMiss = () => {
    setSelectedRegion(null);
  };

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, Math.PI]} onPointerMissed={handleMiss}>
      {regions.map((region) => (
        <BrainRegionMesh key={region.name} name={region.name} geometry={region.geometry} />
      ))}
    </group>
  );
}

useGLTF.preload('/models/brain-atlas.glb');
