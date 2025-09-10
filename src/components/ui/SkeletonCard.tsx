// src/components/ui/SkeletonCard.tsx
import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md animate-pulse overflow-hidden">
      <div className="w-full aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-300 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
};
