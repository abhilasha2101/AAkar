import React, { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../api/dashboard";
import { DashboardSummary } from "../types";
import { StatCard } from "../components/StatCard";

const SEVERITY_DOT: Record<string, string> = {
  info: "bg-navy",
  warning: "bg-status-attention",
  critical: "bg-status-critical",
};

const PRIORITY_BADGE: Record<string, string> = {
  Critical: "gov-badge-critical",
  High: "gov-badge-attention",
  Medium: "bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold",
  Low: "bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold",
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const summary = await fetchDashboardSummary();
      setData(summary);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000); // auto-refresh every 60s — no manual refresh needed
    return () => clearInterval(interval);
  }, []);

  const banners = data
    ? [data.alertBanners.interventionBanner, data.alertBanners.delayedBanner, data.alertBanners.completionBanner].filter(Boolean)
    : [];
  const bannerTone = ["bg-red-50 border-red-200 text-status-critical", "bg-amber-50 border-amber-200 text-status-attention", "bg-green-50 border-green-200 text-status-good"];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">Department Dashboard</h1>
        <p className="text-sm text-slate-500">
          {data ? `Last Updated: ${new Date(data.lastUpdated).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}` : "Loading…"}
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-status-critical text-sm rounded px-4 py-3">{error}</div>}

      {/* Alert banners */}
      {banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {banners.map((b, i) => (
            <div key={i} className={`rounded-md border px-4 py-3 text-sm font-medium ${bannerTone[i % 3]}`}>
              {b}
            </div>
          ))}
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Health Projects" value={data?.kpis.activeProjects ?? "—"} loading={loading} />
        <StatCard label="Delayed Projects" value={data?.kpis.delayedProjects ?? "—"} valueColor="text-status-critical" loading={loading} />
        <StatCard label="Operational Facilities" value={data?.kpis.operationalFacilities ?? "—"} loading={loading} />
        <StatCard label="Healthcare Personnel" value={data?.kpis.healthcarePersonnel?.toLocaleString("en-IN") ?? "—"} loading={loading} />
        <StatCard label="Budget Utilization" value={data ? `${data.kpis.budgetUtilizationPct}%` : "—"} valueColor="text-status-attention" loading={loading} />
        <StatCard label="Pending Admin Tasks" value={data?.kpis.pendingAdminTasks ?? "—"} loading={loading} />
        <StatCard label="Dept. Performance Score" value={data ? `${data.kpis.deptPerformanceScore}/100` : "—"} valueColor="text-status-good" loading={loading} />
        <StatCard label="Citizen Satisfaction Index" value={data ? `${data.kpis.citizenSatisfactionIndex}%` : "—"} valueColor="text-status-good" loading={loading} />
      </div>

      {/* District Performance Highlights */}
      <div>
        <div className="gov-section-title mb-3">DISTRICT PERFORMANCE HIGHLIGHTS</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="gov-card p-4">
            <div className="gov-stat-label">Best Performing District</div>
            <div className="text-lg font-bold text-navy mt-1">{data?.districtHighlights.bestPerforming?.name ?? "—"}</div>
            {data?.districtHighlights.bestPerforming && (
              <div className="text-xs text-slate-400 mt-1">
                Score: {data.districtHighlights.bestPerforming.performanceScore}/100 · Facilities:{" "}
                {data.districtHighlights.bestPerforming.facilitiesCount} operational
              </div>
            )}
          </div>
          <div className="gov-card p-4">
            <div className="gov-stat-label">Needs Immediate Attention</div>
            <div className="text-lg font-bold text-status-critical mt-1">{data?.districtHighlights.needsAttention?.name ?? "—"}</div>
            {data?.districtHighlights.needsAttention && (
              <div className="text-xs text-slate-400 mt-1">
                Score: {data.districtHighlights.needsAttention.performanceScore}/100 ·{" "}
                {data.districtHighlights.needsAttention.activeProjectsCount} active projects
              </div>
            )}
          </div>
          <div className="gov-card p-4">
            <div className="gov-stat-label">Highest Vaccination Coverage</div>
            <div className="text-lg font-bold text-navy mt-1">{data?.districtHighlights.highestVaccination?.name ?? "—"}</div>
            {data?.districtHighlights.highestVaccination && (
              <div className="text-xs text-slate-400 mt-1">
                Coverage: {data.districtHighlights.highestVaccination.vaccinationCoveragePct}% · Target: 100%
              </div>
            )}
          </div>
          <div className="gov-card p-4">
            <div className="gov-stat-label">Most Improved District</div>
            {data?.districtHighlights.mostImproved ? (
              <>
                <div className="text-lg font-bold text-navy mt-1">{data.districtHighlights.mostImproved.name}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Improvement: +{data.districtHighlights.mostImproved.improvementPct}% this quarter
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-400 mt-2">No quarter-over-quarter data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-navy rounded-md p-5 text-white">
        <div className="text-gold text-xs font-bold tracking-wide mb-4">AI HEALTH DEPARTMENT SUMMARY</div>
        {loading ? (
          <div className="text-sm text-slate-300">Generating insights from live data…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {data?.aiSummary.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm border-b border-navy-light/60 pb-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT[insight.severity]}`} />
                <span className="text-slate-100">{insight.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="gov-card p-5">
        <div className="gov-section-title mb-4">ACTIONABLE RECOMMENDATIONS</div>
        <div className="divide-y divide-slate-100">
          {data?.recommendations.map((rec, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4">
              <span className="text-sm text-slate-700">{rec.text}</span>
              <span className={PRIORITY_BADGE[rec.priority]}>{rec.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
