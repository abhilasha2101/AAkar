import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  valueColor?: string;
  loading?: boolean;
}

export function StatCard({ label, value, sub, valueColor, loading }: StatCardProps) {
  return (
    <div className="gov-card p-4">
      <div className="gov-stat-label">{label}</div>
      {loading ? (
        <div className="h-7 w-20 bg-slate-100 rounded animate-pulse mt-2" />
      ) : (
        <div className={`text-2xl font-bold mt-1 ${valueColor ?? "text-navy"}`}>{value}</div>
      )}
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
