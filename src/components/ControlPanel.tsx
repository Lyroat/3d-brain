'use client';

import { useBrainStore, BRAIN_TREE, type TreeNode } from '@/store/brain-store';

export function ControlPanel() {
  const { explodeAmount, setExplodeAmount } = useBrainStore();

  return (
    <div className="absolute top-6 left-6 w-72 rounded-2xl bg-[#111128]/85 backdrop-blur-xl border border-white/10 p-5 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin">
      <h2 className="text-sm font-semibold text-white/90 mb-4">脑结构导航</h2>

      {/* Explode slider */}
      <div className="mb-5 pb-4 border-b border-white/5">
        <label className="text-xs text-white/50 block mb-1.5">爆炸视图</label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.05}
          value={explodeAmount}
          onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-indigo-400
            [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>

      {/* Tree navigation */}
      <div className="space-y-0.5">
        {BRAIN_TREE.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const { expandedNodes, toggleNode, selectedNodeId, setSelectedNodeId } = useBrainStore();
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  const handleClick = () => {
    setSelectedNodeId(isSelected ? null : node.id);
    if (hasChildren && !isExpanded) {
      toggleNode(node.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNode(node.id);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full text-left flex items-center gap-1.5 rounded-lg transition-colors
          ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/70 hover:text-white hover:bg-white/5'}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px`, paddingRight: '8px', paddingTop: '5px', paddingBottom: '5px' }}
      >
        {hasChildren ? (
          <span
            onClick={handleToggle}
            className={`text-[10px] text-white/40 transition-transform inline-block w-3 cursor-pointer hover:text-white/70 ${isExpanded ? 'rotate-90' : ''}`}
          >
            ▶
          </span>
        ) : (
          <span className="w-3 inline-block text-center text-white/20 text-[8px]">●</span>
        )}

        <span className={`text-xs ${hasChildren && !node.regionName ? 'font-medium' : ''}`}>
          {node.label}
        </span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
