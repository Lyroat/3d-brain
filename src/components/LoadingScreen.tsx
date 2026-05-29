'use client';

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a1a] z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-white/50">加载脑模型中...</p>
      </div>
    </div>
  );
}
