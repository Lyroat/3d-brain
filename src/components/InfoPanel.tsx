'use client';

import { useBrainStore, useSelectedRegions, REGION_DATA, BRAIN_TREE, findNodeById, getDescendantRegions, type TreeNode } from '@/store/brain-store';

function findPathToNode(tree: TreeNode[], targetId: string): string[] {
  for (const node of tree) {
    if (node.id === targetId) return [node.label];
    if (node.children) {
      const path = findPathToNode(node.children, targetId);
      if (path.length > 0) return [node.label, ...path];
    }
  }
  return [];
}

export function InfoPanel() {
  const { selectedNodeId, hoveredRegion } = useBrainStore();
  const selectedRegions = useSelectedRegions();

  const selectedNode = selectedNodeId ? findNodeById(BRAIN_TREE, selectedNodeId) : null;

  // If hovering a single region, show that region's info
  const hoverInfo = hoveredRegion ? REGION_DATA[hoveredRegion] : null;

  // If nothing selected and not hovering, show default
  if (!selectedNode && !hoverInfo) {
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

  // Hover takes priority for display
  if (hoverInfo && (!selectedNode || !selectedRegions.has(hoveredRegion!))) {
    const breadcrumb = findPathToNode(BRAIN_TREE, `r-${hoveredRegion}`);
    return (
      <div className="absolute top-6 right-6 w-80 rounded-2xl bg-[#111128]/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
        {breadcrumb.length > 1 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {breadcrumb.slice(0, -1).map((seg, i) => (
              <span key={i} className="text-[10px] text-white/40">
                {seg}{i < breadcrumb.length - 2 ? ' ›' : ''}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-xl font-bold text-white mb-1">{hoverInfo.label}</h2>
        <p className="text-xs text-white/40 font-mono mb-3">{hoverInfo.name}</p>
        <p className="text-sm text-white/70 leading-relaxed mb-4">{hoverInfo.description}</p>
        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">主要功能</h3>
          <div className="flex flex-wrap gap-1.5">
            {hoverInfo.functions.map((fn) => (
              <span key={fn} className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10">{fn}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Selected node info
  if (!selectedNode) return null;

  const breadcrumb = findPathToNode(BRAIN_TREE, selectedNodeId!);
  const hasChildren = selectedNode.children && selectedNode.children.length > 0;
  const selfInfo = selectedNode.regionName ? REGION_DATA[selectedNode.regionName] : null;

  // Pure leaf node (no children): show single region detail
  if (!hasChildren && selfInfo) {
    return (
      <div className="absolute top-6 right-6 w-80 rounded-2xl bg-[#111128]/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
        {breadcrumb.length > 1 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {breadcrumb.slice(0, -1).map((seg, i) => (
              <span key={i} className="text-[10px] text-white/40">
                {seg}{i < breadcrumb.length - 2 ? ' ›' : ''}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-xl font-bold text-white mb-1">{selfInfo.label}</h2>
        <p className="text-xs text-white/40 font-mono mb-3">{selfInfo.name}</p>
        <p className="text-sm text-white/70 leading-relaxed mb-4">{selfInfo.description}</p>
        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">主要功能</h3>
          <div className="flex flex-wrap gap-1.5">
            {selfInfo.functions.map((fn) => (
              <span key={fn} className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10">{fn}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Parent node (with or without own regionName): show self info + child list
  const childRegionNames = getDescendantRegions(selectedNode);
  // Exclude self from child list if it has its own regionName
  const childInfos = childRegionNames
    .filter(r => r !== selectedNode.regionName)
    .map(r => REGION_DATA[r])
    .filter(Boolean);

  return (
    <div className="absolute top-6 right-6 w-80 rounded-2xl bg-[#111128]/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin">
      {breadcrumb.length > 1 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {breadcrumb.slice(0, -1).map((seg, i) => (
            <span key={i} className="text-[10px] text-white/40">
              {seg}{i < breadcrumb.length - 2 ? ' ›' : ''}
            </span>
          ))}
        </div>
      )}

      {/* Self info if the node has its own region data */}
      {selfInfo ? (
        <>
          <h2 className="text-xl font-bold text-white mb-1">{selfInfo.label}</h2>
          <p className="text-sm text-white/70 leading-relaxed mb-4">{selfInfo.description}</p>
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {selfInfo.functions.map((fn) => (
                <span key={fn} className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70 border border-white/10">{fn}</span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <h2 className="text-xl font-bold text-white mb-3">{selectedNode.label}</h2>
      )}

      {/* Child structures */}
      {childInfos.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            包含结构（{childInfos.length}）
          </h3>
          <div className="space-y-2.5">
            {childInfos.map((info) => (
              <div key={info.name} className="rounded-lg bg-white/5 border border-white/5 p-3">
                <h4 className="text-sm font-medium text-white/85 mb-1">{info.label}</h4>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{info.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
