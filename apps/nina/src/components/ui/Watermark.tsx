import React from "react";

export function Watermark() {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
      <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2 mix-blend-luminosity opacity-80 transition-opacity hover:opacity-100">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">
          Produced by Skingif1
        </span>
      </div>
    </div>
  );
}
