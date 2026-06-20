import React from "react";

type Tone = "good" | "attention" | "critical" | "neutral";

const STATUS_TO_TONE: Record<string, Tone> = {
  GOOD: "good",
  ON_TRACK: "good",
  COMPLETED: "good",
  NEEDS_ATTENTION: "attention",
  DELAYED: "attention",
  CRITICAL: "critical",
};

const TONE_CLASS: Record<Tone, string> = {
  good: "gov-badge-good",
  attention: "gov-badge-attention",
  critical: "gov-badge-critical",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold",
};

const LABEL_OVERRIDE: Record<string, string> = {
  ON_TRACK: "ON TRACK",
  NEEDS_ATTENTION: "NEEDS ATTENTION",
  DELAYED: "DELAYED",
  CRITICAL: "CRITICAL",
  COMPLETED: "COMPLETED",
  GOOD: "GOOD",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TO_TONE[status] ?? "neutral";
  const label = LABEL_OVERRIDE[status] ?? status.replace(/_/g, " ");
  return <span className={TONE_CLASS[tone]}>{label}</span>;
}
