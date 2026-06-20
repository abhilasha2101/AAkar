import React from "react";

function StubPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
      </div>
      <div className="gov-card p-10 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h2 className="font-bold text-navy mb-2">Module Under Development</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{description}</p>
      </div>
    </div>
  );
}

export function PersonnelPage() {
  return (
    <StubPage
      title="Personnel Records"
      description="Staff directory, postings, and HR records management will be available in a future release. This module is intentionally not connected to live data yet."
    />
  );
}

export function ReportsPage() {
  return (
    <StubPage
      title="Reports"
      description="Custom report builder and scheduled report exports will be available in a future release. CSV export is already live on the Project Management page."
    />
  );
}
