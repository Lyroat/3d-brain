/**
 * Converts Brainder.org FreeSurfer OBJ meshes into a single GLB file
 * with named regions for interactive 3D brain visualization.
 *
 * Uses BOTH left and right hemisphere data for anatomically accurate
 * asymmetric brain rendering.
 *
 * Usage: node scripts/build-brain-glb.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CORTICAL_DIR = path.join(ROOT, '.tmp-brain-meshes/pial_DK_obj/pial_DK_obj');
const SUBCORTICAL_DIR = path.join(ROOT, '.tmp-brain-meshes/subcortical_obj/subcortical_obj');
const OUTPUT_PATH = path.join(ROOT, 'public/models/brain-atlas.glb');

// Region map: uses both 'lh.' and 'rh.' parcels for asymmetric rendering
// merge: 'both-sides' = use separate lh + rh OBJs (real asymmetric data)
// merge: 'both' = single mesh used as-is (midline structures)
// merge: 'left' = only left hemisphere (for subcortical that need mirroring)
const REGION_MAP = [
  // === CEREBRAL CORTEX - FRONTAL LOBE ===
  // Prefrontal cortex sub-regions
  { name: 'dlpfc', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.rostralmiddlefrontal', 'lh.caudalmiddlefrontal'], rh: ['rh.rostralmiddlefrontal', 'rh.caudalmiddlefrontal'] } },
  { name: 'medial-prefrontal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.superiorfrontal'], rh: ['rh.superiorfrontal'] } },
  { name: 'orbitofrontal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.medialorbitofrontal', 'lh.lateralorbitofrontal'], rh: ['rh.medialorbitofrontal', 'rh.lateralorbitofrontal'] } },
  { name: 'frontal-pole', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.frontalpole'], rh: ['rh.frontalpole'] } },
  { name: 'vlpfc', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.parsopercularis', 'lh.parsorbitalis', 'lh.parstriangularis'], rh: ['rh.parsopercularis', 'rh.parsorbitalis', 'rh.parstriangularis'] } },
  // Motor cortex sub-regions
  { name: 'primary-motor-cortex', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.precentral'], rh: ['rh.precentral'] } },
  { name: 'premotor-sma', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.paracentral'], rh: ['rh.paracentral'] } },
  // Cingulate
  { name: 'anterior-cingulate', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.caudalanteriorcingulate', 'lh.rostralanteriorcingulate'], rh: ['rh.caudalanteriorcingulate', 'rh.rostralanteriorcingulate'] } },

  // === CEREBRAL CORTEX - PARIETAL LOBE ===
  { name: 'primary-somatosensory', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.postcentral'], rh: ['rh.postcentral'] } },
  { name: 'superior-parietal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.superiorparietal'], rh: ['rh.superiorparietal'] } },
  { name: 'inferior-parietal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.inferiorparietal'], rh: ['rh.inferiorparietal'] } },
  { name: 'supramarginal-gyrus', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.supramarginal'], rh: ['rh.supramarginal'] } },
  { name: 'angular-gyrus', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.bankssts'], rh: ['rh.bankssts'] } },
  { name: 'precuneus', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.precuneus'], rh: ['rh.precuneus'] } },
  { name: 'posterior-cingulate', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.posteriorcingulate', 'lh.isthmuscingulate'], rh: ['rh.posteriorcingulate', 'rh.isthmuscingulate'] } },

  // === CEREBRAL CORTEX - TEMPORAL LOBE ===
  { name: 'superior-temporal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.superiortemporal'], rh: ['rh.superiortemporal'] } },
  { name: 'middle-temporal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.middletemporal'], rh: ['rh.middletemporal'] } },
  { name: 'inferior-temporal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.inferiortemporal'], rh: ['rh.inferiortemporal'] } },
  { name: 'transverse-temporal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.transversetemporal'], rh: ['rh.transversetemporal'] } },
  { name: 'temporal-pole', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.temporalpole'], rh: ['rh.temporalpole'] } },
  { name: 'fusiform-gyrus', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.fusiform'], rh: ['rh.fusiform'] } },
  { name: 'entorhinal-cortex', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.entorhinal'], rh: ['rh.entorhinal'] } },
  { name: 'parahippocampal', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.parahippocampal'], rh: ['rh.parahippocampal'] } },

  // === CEREBRAL CORTEX - OCCIPITAL LOBE ===
  { name: 'lateral-occipital', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.lateraloccipital'], rh: ['rh.lateraloccipital'] } },
  { name: 'cuneus', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.cuneus'], rh: ['rh.cuneus'] } },
  { name: 'pericalcarine', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.pericalcarine'], rh: ['rh.pericalcarine'] } },
  { name: 'lingual-gyrus', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.lingual'], rh: ['rh.lingual'] } },

  // === CEREBRAL CORTEX - INSULAR LOBE ===
  { name: 'insular-cortex', source: 'cortical', merge: 'both-sides', parcels: { lh: ['lh.insula'], rh: ['rh.insula'] } },

  // === BASAL GANGLIA ===
  { name: 'caudate', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Caudate'], rh: ['Right-Caudate'] } },
  { name: 'putamen', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Putamen'], rh: ['Right-Putamen'] } },
  { name: 'pallidum', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Pallidum'], rh: ['Right-Pallidum'] } },
  { name: 'accumbens', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Accumbens-area'], rh: ['Right-Accumbens-area'] } },

  // === LIMBIC STRUCTURES ===
  { name: 'hippocampus', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Hippocampus'], rh: ['Right-Hippocampus'] } },
  { name: 'amygdala', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Amygdala'], rh: ['Right-Amygdala'] } },

  // === DIENCEPHALON ===
  { name: 'thalamus', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Thalamus-Proper'], rh: ['Right-Thalamus-Proper'] } },
  { name: 'hypothalamus', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-VentralDC'], rh: ['Right-VentralDC'] } },

  // === BRAINSTEM ===
  { name: 'brainstem', source: 'subcortical', merge: 'both', parcels: ['Brain-Stem'] },
  { name: 'substantia-nigra', source: 'procedural', merge: 'both', parcels: [] },

  // === CEREBELLUM ===
  { name: 'cerebellum', source: 'subcortical', merge: 'both-separate', parcels: { lh: ['Left-Cerebellum-Cortex'], rh: ['Right-Cerebellum-Cortex'] } },

  // === WHITE MATTER ===
  { name: 'corpus-callosum', source: 'subcortical', merge: 'both', parcels: ['CC_Anterior', 'CC_Central', 'CC_Mid_Anterior', 'CC_Mid_Posterior', 'CC_Posterior'] },
];

// --- OBJ Parser ---
function parseOBJ(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const vertices = [];
  const faces = [];

  for (const line of content.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v') {
      vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (parts[0] === 'f') {
      const indices = parts.slice(1).map(p => parseInt(p.split('/')[0]) - 1);
      for (let i = 1; i < indices.length - 1; i++) {
        faces.push(indices[0], indices[i], indices[i + 1]);
      }
    }
  }

  return { vertices: new Float32Array(vertices), indices: new Uint32Array(faces) };
}

function findObjFile(dir, parcelName) {
  const patterns = [
    `${parcelName}.obj`,
    `lh.pial.DK.${parcelName.replace('lh.', '')}.obj`,
    `rh.pial.DK.${parcelName.replace('rh.', '')}.obj`,
  ];
  for (const pat of patterns) {
    const fp = path.join(dir, pat);
    if (fs.existsSync(fp)) return fp;
  }
  return null;
}

// --- Merge geometries ---
function mergeGeometries(geometries) {
  let totalVerts = 0;
  let totalFaces = 0;
  for (const g of geometries) {
    totalVerts += g.vertices.length / 3;
    totalFaces += g.indices.length;
  }

  const vertices = new Float32Array(totalVerts * 3);
  const indices = new Uint32Array(totalFaces);
  let vertOffset = 0;
  let idxOffset = 0;
  let vertCount = 0;

  for (const g of geometries) {
    vertices.set(g.vertices, vertOffset);
    for (let i = 0; i < g.indices.length; i++) {
      indices[idxOffset + i] = g.indices[i] + vertCount;
    }
    vertOffset += g.vertices.length;
    idxOffset += g.indices.length;
    vertCount += g.vertices.length / 3;
  }

  return { vertices, indices };
}

// Generate ellipsoid for structures not in FreeSurfer
function createEllipsoid(cx, cy, cz, rx, ry, rz, segments = 16) {
  const vertices = [];
  const indices = [];

  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      vertices.push(
        cx + rx * sinTheta * Math.cos(phi),
        cy + ry * sinTheta * Math.sin(phi),
        cz + rz * cosTheta
      );
    }
  }

  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const curr = lat * (segments + 1) + lon;
      const next = curr + segments + 1;
      indices.push(curr, next, curr + 1);
      indices.push(curr + 1, next, next + 1);
    }
  }

  return { vertices: new Float32Array(vertices), indices: new Uint32Array(indices) };
}

// --- Compute normals ---
function computeNormals(vertices, indices) {
  const normals = new Float32Array(vertices.length);

  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i] * 3, i1 = indices[i + 1] * 3, i2 = indices[i + 2] * 3;
    const ax = vertices[i1] - vertices[i0], ay = vertices[i1 + 1] - vertices[i0 + 1], az = vertices[i1 + 2] - vertices[i0 + 2];
    const bx = vertices[i2] - vertices[i0], by = vertices[i2 + 1] - vertices[i0 + 1], bz = vertices[i2 + 2] - vertices[i0 + 2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;

    normals[i0] += nx; normals[i0 + 1] += ny; normals[i0 + 2] += nz;
    normals[i1] += nx; normals[i1 + 1] += ny; normals[i1 + 2] += nz;
    normals[i2] += nx; normals[i2 + 1] += ny; normals[i2 + 2] += nz;
  }

  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.sqrt(normals[i] ** 2 + normals[i + 1] ** 2 + normals[i + 2] ** 2);
    if (len > 0) { normals[i] /= len; normals[i + 1] /= len; normals[i + 2] /= len; }
  }
  return normals;
}

// --- GLB Builder ---
function buildGLB(regions) {
  const meshes = [];
  const accessors = [];
  const bufferViews = [];
  const nodes = [];
  const binParts = [];
  let byteOffset = 0;

  for (const [name, geometry] of Object.entries(regions)) {
    const { vertices, indices } = geometry;
    const normals = computeNormals(vertices, indices);

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < vertices.length; i += 3) {
      minX = Math.min(minX, vertices[i]); maxX = Math.max(maxX, vertices[i]);
      minY = Math.min(minY, vertices[i + 1]); maxY = Math.max(maxY, vertices[i + 1]);
      minZ = Math.min(minZ, vertices[i + 2]); maxZ = Math.max(maxZ, vertices[i + 2]);
    }

    const idxBuf = Buffer.from(indices.buffer);
    const idxBVIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: idxBuf.length, target: 34963 });
    binParts.push(idxBuf); byteOffset += idxBuf.length;
    const idxPad = (4 - (byteOffset % 4)) % 4;
    if (idxPad) { binParts.push(Buffer.alloc(idxPad)); byteOffset += idxPad; }

    const posBuf = Buffer.from(vertices.buffer);
    const posBVIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: posBuf.length, byteStride: 12, target: 34962 });
    binParts.push(posBuf); byteOffset += posBuf.length;
    const posPad = (4 - (byteOffset % 4)) % 4;
    if (posPad) { binParts.push(Buffer.alloc(posPad)); byteOffset += posPad; }

    const normBuf = Buffer.from(normals.buffer);
    const normBVIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: normBuf.length, byteStride: 12, target: 34962 });
    binParts.push(normBuf); byteOffset += normBuf.length;
    const normPad = (4 - (byteOffset % 4)) % 4;
    if (normPad) { binParts.push(Buffer.alloc(normPad)); byteOffset += normPad; }

    const idxAccIdx = accessors.length;
    accessors.push({ bufferView: idxBVIdx, componentType: 5125, count: indices.length, type: 'SCALAR' });
    const posAccIdx = accessors.length;
    accessors.push({ bufferView: posBVIdx, componentType: 5126, count: vertices.length / 3, type: 'VEC3', min: [minX, minY, minZ], max: [maxX, maxY, maxZ] });
    const normAccIdx = accessors.length;
    accessors.push({ bufferView: normBVIdx, componentType: 5126, count: normals.length / 3, type: 'VEC3' });

    const meshIdx = meshes.length;
    meshes.push({ name, primitives: [{ attributes: { POSITION: posAccIdx, NORMAL: normAccIdx }, indices: idxAccIdx }] });
    nodes.push({ name, mesh: meshIdx });
  }

  const gltf = {
    asset: { version: '2.0', generator: '3d-brain-pipeline' },
    scene: 0,
    scenes: [{ nodes: nodes.map((_, i) => i) }],
    nodes, meshes, accessors, bufferViews,
    buffers: [{ byteLength: byteOffset }],
  };

  const jsonStr = JSON.stringify(gltf);
  const jsonBuf = Buffer.from(jsonStr, 'utf-8');
  const jsonPadLen = (4 - (jsonBuf.length % 4)) % 4;
  const jsonPadded = jsonPadLen ? Buffer.concat([jsonBuf, Buffer.alloc(jsonPadLen, 0x20)]) : jsonBuf;
  const binBuffer = Buffer.concat(binParts);
  const totalLength = 12 + 8 + jsonPadded.length + 8 + binBuffer.length;

  const glb = Buffer.alloc(totalLength);
  let offset = 0;
  glb.writeUInt32LE(0x46546C67, offset); offset += 4;
  glb.writeUInt32LE(2, offset); offset += 4;
  glb.writeUInt32LE(totalLength, offset); offset += 4;
  glb.writeUInt32LE(jsonPadded.length, offset); offset += 4;
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4;
  jsonPadded.copy(glb, offset); offset += jsonPadded.length;
  glb.writeUInt32LE(binBuffer.length, offset); offset += 4;
  glb.writeUInt32LE(0x004E4942, offset); offset += 4;
  binBuffer.copy(glb, offset);

  return glb;
}

// --- Main Pipeline ---
function main() {
  console.log('🧠 Brain Atlas GLB Pipeline (Asymmetric)\n');

  const regionGeometries = {};
  const allVertices = [];

  for (const region of REGION_MAP) {
    // Handle procedural geometry
    if (region.source === 'procedural') {
      let merged;
      if (region.name === 'substantia-nigra') {
        // MNI coords: brainstem Y=[-57.6, -18.2] Z=[-63.8, -8.3]
        // SN in ventral midbrain (superior brainstem): Y~-28, Z~-16, small radii for full enclosure
        const left = createEllipsoid(-5, -28, -16, 1.5, 2.5, 1.5, 12);
        const right = createEllipsoid(5, -28, -16, 1.5, 2.5, 1.5, 12);
        merged = mergeGeometries([left, right]);
      }
      if (merged) {
        regionGeometries[region.name] = merged;
        allVertices.push(merged.vertices);
        console.log(`  ✅ ${region.name}: ${merged.indices.length / 3} tris (procedural)`);
      }
      continue;
    }

    const parcelGeometries = [];

    if (region.merge === 'both-sides' || region.merge === 'both-separate') {
      // Use real left + right hemisphere data (asymmetric)
      const parcelsObj = region.parcels;
      const dir = region.source === 'cortical' ? CORTICAL_DIR : SUBCORTICAL_DIR;

      for (const parcel of [...(parcelsObj.lh || []), ...(parcelsObj.rh || [])]) {
        const objFile = findObjFile(dir, parcel);
        if (!objFile) {
          console.warn(`  ⚠️  Missing: ${parcel} for ${region.name}`);
          continue;
        }
        const geo = parseOBJ(objFile);
        if (geo.vertices.length > 0) parcelGeometries.push(geo);
      }
    } else if (region.merge === 'both') {
      // Midline structure, single parcels array
      const dir = region.source === 'cortical' ? CORTICAL_DIR : SUBCORTICAL_DIR;
      for (const parcel of region.parcels) {
        const objFile = findObjFile(dir, parcel);
        if (!objFile) {
          console.warn(`  ⚠️  Missing: ${parcel} for ${region.name}`);
          continue;
        }
        const geo = parseOBJ(objFile);
        if (geo.vertices.length > 0) parcelGeometries.push(geo);
      }
    }

    if (parcelGeometries.length === 0) {
      console.warn(`  ⏭️  Skipped: ${region.name} (no geometry)`);
      continue;
    }

    const merged = parcelGeometries.length === 1 ? parcelGeometries[0] : mergeGeometries(parcelGeometries);
    regionGeometries[region.name] = merged;
    allVertices.push(merged.vertices);

    const triCount = merged.indices.length / 3;
    const vertCount = merged.vertices.length / 3;
    console.log(`  ✅ ${region.name}: ${triCount} tris, ${vertCount} verts`);
  }

  // Global normalization
  console.log('\n📐 Normalizing...');
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const verts of allVertices) {
    for (let i = 0; i < verts.length; i += 3) {
      minX = Math.min(minX, verts[i]); maxX = Math.max(maxX, verts[i]);
      minY = Math.min(minY, verts[i + 1]); maxY = Math.max(maxY, verts[i + 1]);
      minZ = Math.min(minZ, verts[i + 2]); maxZ = Math.max(maxZ, verts[i + 2]);
    }
  }

  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
  const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
  const scale = 6 / maxDim;

  console.log(`  Center: (${cx.toFixed(1)}, ${cy.toFixed(1)}, ${cz.toFixed(1)})`);
  console.log(`  Scale: ${scale.toFixed(4)}`);

  const regionMeta = {};
  for (const [name, geo] of Object.entries(regionGeometries)) {
    let sx = 0, sy = 0, sz = 0;
    const vertCount = geo.vertices.length / 3;
    for (let i = 0; i < geo.vertices.length; i += 3) {
      geo.vertices[i] = (geo.vertices[i] - cx) * scale;
      geo.vertices[i + 1] = (geo.vertices[i + 1] - cy) * scale;
      geo.vertices[i + 2] = (geo.vertices[i + 2] - cz) * scale;
      sx += geo.vertices[i]; sy += geo.vertices[i + 1]; sz += geo.vertices[i + 2];
    }
    regionMeta[name] = {
      centroid: [sx / vertCount, sy / vertCount, sz / vertCount],
      triangles: geo.indices.length / 3,
      vertices: vertCount,
    };
  }

  // Build and write GLB
  console.log('\n📦 Building GLB...');
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  const glb = buildGLB(regionGeometries);
  fs.writeFileSync(OUTPUT_PATH, glb);
  console.log(`  Written: ${OUTPUT_PATH} (${(glb.length / 1024 / 1024).toFixed(2)} MB)`);

  const metaPath = path.join(ROOT, 'public/models/brain-regions.json');
  fs.writeFileSync(metaPath, JSON.stringify(regionMeta, null, 2));
  console.log(`  Metadata: ${metaPath}`);
  console.log(`\n✨ Done! ${Object.keys(regionGeometries).length} regions generated.`);
}

main();
