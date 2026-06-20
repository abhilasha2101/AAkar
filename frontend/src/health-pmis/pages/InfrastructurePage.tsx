import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchInfrastructureOverview, fetchFacilities, updateFacility, InfrastructureOverview } from "../api/infrastructure";
import { Facility } from "../types";
import { useUiStore } from "../store/uiStore";

const DONUT_COLORS = ["#0f1f3d", "#16284d", "#c9a227", "#e0bd4a", "#1d7a4c", "#b8860b", "#c0392b", "#5b7fa6", "#8d99ae"];

function FacilityCard({ row, facility, onSave }: { row: { type: string; label: string; completed: number; ongoing: number }; facility?: Facility; onSave: (completed: number, ongoing: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [completed, setCompleted] = useState(row.completed);
  const [ongoing, setOngoing] = useState(row.ongoing);

  function handleSave() {
    onSave(completed, ongoing);
    setEditing(false);
  }

  return (
    <div className="gov-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="gov-stat-label">{row.label}</div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="text-xs text-navy hover:underline">
            Edit
          </button>
        ) : (
          <button onClick={handleSave} className="text-xs text-status-good font-semibold hover:underline">
            Save
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">Completed</div>
          {editing ? (
            <input
              type="number"
              className="gov-input bg-green-50 text-status-good font-bold"
              value={completed}
              onChange={(e) => setCompleted(Number(e.target.value))}
            />
          ) : (
            <div className="bg-green-50 text-status-good font-bold text-xl rounded px-3 py-1.5">{row.completed.toLocaleString("en-IN")}</div>
          )}
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Ongoing</div>
          {editing ? (
            <input
              type="number"
              className="gov-input bg-slate-50 font-bold"
              value={ongoing}
              onChange={(e) => setOngoing(Number(e.target.value))}
            />
          ) : (
            <div className="bg-slate-50 text-navy font-bold text-xl rounded px-3 py-1.5">{row.ongoing.toLocaleString("en-IN")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InfrastructurePage() {
  const [overview, setOverview] = useState<InfrastructureOverview | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const pushToast = useUiStore((s) => s.pushToast);

  async function load() {
    setLoading(true);
    try {
      const [ov, fac] = await Promise.all([fetchInfrastructureOverview(), fetchFacilities()]);
      setOverview(ov);
      setFacilities(fac);
    } catch (e: any) {
      pushToast("error", e?.response?.data?.error ?? "Failed to load infrastructure data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveFacility(type: string, completed: number, ongoing: number) {
    const facility = facilities.find((f) => f.type === type && !f.districtId);
    if (!facility) {
      pushToast("error", "Facility record not found.");
      return;
    }
    try {
      await updateFacility(facility.id, { completedCount: completed, ongoingCount: ongoing });
      pushToast("success", "Facility counts updated. Dashboard recalculated.");
      load();
    } catch {
      pushToast("error", "Failed to update facility.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">Public Health Infrastructure Monitoring</h1>
        <p className="text-sm text-slate-500">Completed vs. Ongoing Infrastructure across all facility types</p>
      </div>

      <div>
        <div className="gov-section-title mb-3">HEALTHCARE FACILITIES OVERVIEW</div>
        {loading ? (
          <div className="text-slate-400 text-sm">Loading facility data…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overview?.byType.map((row) => (
              <FacilityCard
                key={row.type}
                row={row}
                facility={facilities.find((f) => f.type === row.type)}
                onSave={(c, o) => handleSaveFacility(row.type, c, o)}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="gov-section-title mb-3">INFRASTRUCTURE GROWTH TREND</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gov-card p-4">
            <div className="text-sm font-bold text-navy mb-3">Healthcare Infrastructure Growth (2022–2026)</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overview?.growthTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="mohallaClinics" name="Mohalla Clinics" fill="#0f1f3d" radius={[3, 3, 0, 0]} />
                <Bar dataKey="hospitals" name="Hospitals" fill="#c9a227" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="gov-card p-4">
            <div className="text-sm font-bold text-navy mb-3">Facility Type Completion Rate</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={overview?.completionRateDonut ?? []}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={1}
                >
                  {(overview?.completionRateDonut ?? []).map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString("en-IN")}`, name]} />
                <Legend wrapperStyle={{ fontSize: 11 }} layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
