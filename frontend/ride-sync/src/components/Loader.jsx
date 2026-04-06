import React from "react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(200,241,53,0.15)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#C8F135",
            borderRightColor: "rgba(200,241,53,0.3)",
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: "rgba(200,241,53,0.06)",
          }}
        />
      </div>
      <p
        className="text-sm"
        style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}
      >
        {message}
      </p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full shimmer" />
        <div>
          <div className="h-3.5 w-24 rounded shimmer mb-1.5" />
          <div className="h-3 w-16 rounded shimmer" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="h-3 w-10 rounded shimmer mb-1.5" />
          <div className="h-4 w-28 rounded shimmer" />
        </div>
        <div className="h-5 w-16 rounded shimmer" />
        <div className="flex-1">
          <div className="h-3 w-10 rounded shimmer mb-1.5 ml-auto" />
          <div className="h-4 w-28 rounded shimmer ml-auto" />
        </div>
      </div>
      <div className="h-px bg-white/5 mb-4" />
      <div className="flex justify-between">
        <div className="h-4 w-20 rounded shimmer" />
        <div className="h-4 w-16 rounded shimmer" />
      </div>
      <div className="h-10 rounded-lg shimmer mt-4" />
    </div>
  );
}