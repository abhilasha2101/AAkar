import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  color?: "green" | "amber" | "red" | "navy";
  showLabel?: boolean;
}

const COLOR_CLASS: Record<string, string> = {
  green: "bg-status-good",
  amber: "bg-status-attention",
  red: "bg-status-critical",
  navy: "bg-navy",
};

export function ProgressBar({ value, color = "navy", showLabel = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const autoColor = color === "navy" ? (clamped < 60 ? "amber" : clamped < 80 ? "green" : "green") : color;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden min-w-[60px]">
        <div
          className={`h-full rounded-full transition-all ${COLOR_CLASS[autoColor]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-slate-600 w-9 text-right">{clamped}%</span>}
    </div>
  );
}
