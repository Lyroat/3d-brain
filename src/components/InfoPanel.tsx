'use client';

import { useBrainStore, REGION_DATA, BRAIN_TREE, type TreeNode } from '@/store/brain-store';

function findPathInTree(tree: TreeNode[], regionName: string): string[] {
  for (const node of tree) {
    if (node.regionName === regionName) return [node.label];
    if (node.children) {
      const path = findPathInTree(node.children, regionName);
      if (path.length > 0) return [node.label, ...path];
    }
  }
  return [];
}

export function InfoPanel() {
  const { selectedRegion, hoveredRegion } = useBrainStore();

  const activeRegion = selectedRegion || hoveredRegion;
  const info = activeRegion ? REGION_DATA[activeRegion] : null;

  if (!info) {
    return (
      <div className="absolute top-6 right-6 w-80 rounded-2xl bg-[#111128]/80 backdrop-blur-xl border border-white/10 p-6 pointer-events-none">
        <h2 className="text-lg font-semibold text-white/90 mb-2">3D 脑探索</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          点击或悬停在脑区上查看详细信息。
          <br />
          拖动旋转，滚轮缩放。
          <br />
          使用左侧目录快速定位脑区。
        </p>
      </div>
    );
  }

  const breadcrumb = findPathInTree(BRAIN_TREE, activeRegion!);

  return (
    <div className="absolute top-6 right-6 w-80 rounded-2xl bg-[#111128]/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
      {/* Breadcrumb */}
      {breadcrumb.length > 1 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {breadcrumb.slice(0, -1).map((seg, i) => (
            <span key={i} className="text-[10px] text-white/40">
              {seg}{i < breadcrumb.length - 2 ? ' ›' : ''}
            </span>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-white mb-1">{info.label}</h2>
      <p className="text-xs text-white/40 font-mono mb-3">{info.name}</p>

      <p className="text-sm text-white/70 leading-relaxed mb-4">
        {info.description}
      </p>

      <div>
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          主要功能
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {info.functions.map((fn) => (
            <span
              key={fn}
              className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10"
            >
              {fn}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
