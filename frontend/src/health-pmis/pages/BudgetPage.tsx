import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fetchBudgetOverview } from "../api/budget";
import { fetchWelfarePrograms, createWelfareProgram, updateWelfareProgram, deleteWelfareProgram } from "../api/budget";
import { BudgetOverview, WelfareProgram } from "../types";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { ProgressBar } from "../components/ProgressBar";
import { Modal } from "../components/Modal";
import { useUiStore } from "../store/uiStore";

function barColor(value: number, thresholds: [number, number] = [70, 85]) {
  if (value < thresholds[0]) return "#c0392b";
  if (value < thresholds[1]) return "#b8860b";
  return "#1d7a4c";
}

function WelfareProgramFormModal({
  program,
  onClose,
  onSaved,
}: {
  program?: WelfareProgram;
  onClose: () => void;
  onSaved: () => void;
}) {
  const pushToast = useUiStore((s) => s.pushToast);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: program?.name ?? "",
    beneficiariesLabel: program?.beneficiariesLabel ?? "",
    coveragePct: program?.coveragePct ?? 0,
    budgetAllocatedCr: program?.budgetAllocatedCr ?? 0,
    budgetSpentCr: program?.budgetSpentCr ?? 0,
    progressPct: program?.progressPct ?? 0,
    status: program?.status ?? "ON_TRACK",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (program) {
        await updateWelfareProgram(program.id, form as any);
      } else {
        await createWelfareProgram(form as any);
      }
      onSaved();
    } catch (err: any) {
      pushToast("error", err?.response?.data?.error ?? "Failed to save program.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={program ? `Edit Program — ${program.name}` : "Add Welfare Program"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Program Name</label>
          <input className="gov-input mt-1" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Beneficiaries (label)</label>
            <input
              className="gov-input mt-1"
              placeholder="e.g. 1.2 Cr"
              value={form.beneficiariesLabel}
              onChange={(e) => setForm((f) => ({ ...f, beneficiariesLabel: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Coverage (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="gov-input mt-1"
              value={form.coveragePct}
              onChange={(e) => setForm((f) => ({ ...f, coveragePct: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Budget Allocated (₹ Cr)</label>
            <input
              type="number"
              min={0}
              className="gov-input mt-1"
              value={form.budgetAllocatedCr}
              onChange={(e) => setForm((f) => ({ ...f, budgetAllocatedCr: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Budget Spent (₹ Cr)</label>
            <input
              type="number"
              min={0}
              className="gov-input mt-1"
              value={form.budgetSpentCr}
              onChange={(e) => setForm((f) => ({ ...f, budgetSpentCr: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Progress (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="gov-input mt-1"
              value={form.progressPct}
              onChange={(e) => setForm((f) => ({ ...f, progressPct: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
            <select className="gov-input mt-1" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}>
              <option value="ON_TRACK">On Track</option>
              <option value="NEEDS_ATTENTION">Needs Attention</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="gov-btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="gov-btn-primary">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function BudgetPage() {
  const [overview, setOverview] = useState<BudgetOverview | null>(null);
  const [programs, setPrograms] = useState<WelfareProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [editProgram, setEditProgram] = useState<WelfareProgram | null>(null);
  const pushToast = useUiStore((s) => s.pushToast);

  async function load() {
    setLoading(true);
    try {
      const [b, p] = await Promise.all([fetchBudgetOverview(), fetchWelfarePrograms()]);
      setOverview(b);
      setPrograms(p);
    } catch (e: any) {
      pushToast("error", e?.response?.data?.error ?? "Failed to load budget data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDeleteProgram(id: string) {
    if (!window.confirm("Remove this welfare program from tracking?")) return;
    try {
      await deleteWelfareProgram(id);
      pushToast("success", "Program removed.");
      load();
    } catch {
      pushToast("error", "Failed to remove program.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">Budget &amp; Welfare Program Monitoring</h1>
        <p className="text-sm text-slate-500">Annual Budget Overview and Welfare Scheme Status — {overview?.fiscalYear ?? "…"}</p>
      </div>

      {/* Fund summary */}
      <div>
        <div className="gov-section-title mb-3">FUND SUMMARY — {overview?.fiscalYear ?? "…"}</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Allocated Budget" value={overview ? `₹${overview.allocatedCr.toLocaleString("en-IN")} Cr` : "—"} sub="Annual Sanction" loading={loading} />
          <StatCard label="Released Budget" value={overview ? `₹${overview.releasedCr.toLocaleString("en-IN")} Cr` : "—"} sub={overview ? `${overview.releasedPct}% of Allocated` : ""} loading={loading} />
          <StatCard label="Utilized Budget" value={overview ? `₹${overview.utilizedCr.toLocaleString("en-IN")} Cr` : "—"} sub={overview ? `${overview.utilizationRatePct}% Utilization` : ""} valueColor="text-status-attention" loading={loading} />
          <StatCard label="Remaining Budget" value={overview ? `₹${overview.remainingCr.toLocaleString("en-IN")} Cr` : "—"} sub="Unspent balance" loading={loading} />
          <StatCard
            label="Utilization Rate"
            value={overview ? `${overview.utilizationRatePct}%` : "—"}
            sub={overview ? `Target: ${overview.targetUtilPct}%` : ""}
            valueColor="text-status-good"
            loading={loading}
          />
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gov-card p-4">
          <div className="text-sm font-bold text-navy mb-3">Budget Utilization Trend (Monthly)</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={overview?.monthlyTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[40, 80]} />
              <Tooltip />
              <Line type="monotone" dataKey="utilPct" stroke="#0f1f3d" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="gov-card p-4">
          <div className="text-sm font-bold text-navy mb-3">District-wise Vaccination Coverage</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={overview?.vaccinationByDistrict ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="district" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
              <Tooltip />
              <Bar dataKey="coveragePct" radius={[3, 3, 0, 0]}>
                {(overview?.vaccinationByDistrict ?? []).map((d, i) => (
                  <Cell key={i} fill={barColor(d.coveragePct, [85, 92])} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gov-card p-4">
          <div className="text-sm font-bold text-navy mb-3">District Health Performance Scores</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={overview?.performanceByDistrict ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="district" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} domain={[50, 100]} />
              <Tooltip />
              <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                {(overview?.performanceByDistrict ?? []).map((d, i) => (
                  <Cell key={i} fill={barColor(d.score, [74, 85])} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="gov-card p-4">
          <div className="text-sm font-bold text-navy mb-3">Hospital Bed Occupancy by District</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={overview?.bedOccupancyByDistrict ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="district" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="occupancyPct" radius={[3, 3, 0, 0]}>
                {(overview?.bedOccupancyByDistrict ?? []).map((d, i) => (
                  <Cell key={i} fill={barColor(100 - d.occupancyPct, [10, 25])} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Welfare Program Tracking */}
      <div className="gov-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="gov-section-title">WELFARE PROGRAM TRACKING</div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">{programs.length} Programs</span>
            <button onClick={() => setShowAddProgram(true)} className="gov-btn-primary text-xs px-3 py-1.5">
              + Add Program
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2 pr-4">Program Name</th>
                <th className="py-2 pr-4">Beneficiaries</th>
                <th className="py-2 pr-4">Coverage</th>
                <th className="py-2 pr-4">Budget Allocated</th>
                <th className="py-2 pr-4">Progress</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading programs…
                  </td>
                </tr>
              ) : (
                programs.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{p.beneficiariesLabel}</td>
                    <td className="py-3 pr-4 font-semibold text-status-good">{p.coveragePct}%</td>
                    <td className="py-3 pr-4 text-slate-700">₹{p.budgetAllocatedCr} Cr</td>
                    <td className="py-3 pr-4 w-36">
                      <ProgressBar value={p.progressPct} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditProgram(p)} className="text-xs font-semibold text-navy hover:underline">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProgram(p.id)} className="text-xs font-semibold text-status-critical hover:underline">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddProgram && (
        <WelfareProgramFormModal
          onClose={() => setShowAddProgram(false)}
          onSaved={() => {
            setShowAddProgram(false);
            load();
            pushToast("success", "Welfare program added.");
          }}
        />
      )}
      {editProgram && (
        <WelfareProgramFormModal
          program={editProgram}
          onClose={() => setEditProgram(null)}
          onSaved={() => {
            setEditProgram(null);
            load();
            pushToast("success", "Welfare program updated.");
          }}
        />
      )}
    </div>
  );
}
