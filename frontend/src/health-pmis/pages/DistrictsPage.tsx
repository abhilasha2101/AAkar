import React, { useEffect, useState } from "react";
import { fetchDistricts, DistrictAggregate } from "../api/districts";
import { District } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";

const DISTRICT_NAMES = [
  "All Districts", "Central Delhi", "East Delhi", "North Delhi", "North East Delhi", "North West Delhi",
  "New Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi",
];
const STATUSES = ["All Statuses", "GOOD", "NEEDS_ATTENTION", "CRITICAL"];
const PROGRAMS = [
  "All Programs", "Aam Aadmi Mohalla Clinics", "Delhi Polyclinic Scheme", "Janani Suraksha Programme",
  "NEEV Project", "PALAAN 1000", "Immunization Mission Delhi", "Maternal Health Outreach",
  "National TB Elimination Program", "Digital Health Records Initiative", "School Health Program",
];

function fmtIndianShort(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)} L`;
  return n.toLocaleString("en-IN");
}

export function DistrictsPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [aggregate, setAggregate] = useState<DistrictAggregate | null>(null);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [programFilter, setProgramFilter] = useState("All Programs");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetchDistricts({
        status: statusFilter !== "All Statuses" ? statusFilter : undefined,
        program: programFilter !== "All Programs" ? programFilter : undefined,
        search: search || undefined,
      });
      const filtered =
        districtFilter !== "All Districts" ? res.data.filter((d) => d.name === districtFilter) : res.data;
      setDistricts(filtered);
      setAggregate(res.aggregate);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtFilter, statusFilter, programFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">District Health Management</h1>
        <p className="text-sm text-slate-500">All 11 Revenue Districts — Health Performance Overview</p>
      </div>

      {/* Filters */}
      <div className="gov-card p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">District</label>
          <select className="gov-input mt-1" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
            {DISTRICT_NAMES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Status Filter</label>
          <select className="gov-input mt-1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Program Filter</label>
          <select className="gov-input mt-1" value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
            {PROGRAMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Search</label>
          <input
            className="gov-input mt-1"
            placeholder="Search district, facility, program…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Aggregate stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Population" value={aggregate ? fmtIndianShort(aggregate.totalPopulation) : "—"} loading={loading} />
        <StatCard label="Registered Patients" value={aggregate ? fmtIndianShort(aggregate.registeredPatients) : "—"} loading={loading} />
        <StatCard label="Total Health Facilities" value={aggregate?.totalHealthFacilities ?? "—"} loading={loading} />
        <StatCard label="Ambulances Active" value={aggregate?.ambulancesActive ?? "—"} loading={loading} />
        <StatCard label="Hospital Beds" value={aggregate ? aggregate.hospitalBeds.toLocaleString("en-IN") : "—"} loading={loading} />
        <StatCard label="Doctors Available" value={aggregate ? aggregate.doctorsAvailable.toLocaleString("en-IN") : "—"} loading={loading} />
        <StatCard label="Nursing Staff" value={aggregate ? aggregate.nursingStaff.toLocaleString("en-IN") : "—"} loading={loading} />
        <StatCard
          label="Avg. Vaccination Coverage"
          value={aggregate ? `${aggregate.avgVaccinationCoverage.toFixed(1)}%` : "—"}
          valueColor="text-status-good"
          loading={loading}
        />
      </div>

      {/* District table */}
      <div className="gov-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="gov-section-title">DISTRICT-WISE PERFORMANCE TABLE</div>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
            {districts.length} District{districts.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2 pr-4">District</th>
                <th className="py-2 pr-4">Performance Score</th>
                <th className="py-2 pr-4">Population</th>
                <th className="py-2 pr-4">Facilities</th>
                <th className="py-2 pr-4">Active Projects</th>
                <th className="py-2 pr-4">Budget Utilization</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading districts…
                  </td>
                </tr>
              ) : districts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No districts match the current filters.
                  </td>
                </tr>
              ) : (
                districts.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4 font-semibold text-navy">{d.name}</td>
                    <td className="py-3 pr-4 w-40">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{d.performanceScore}</span>
                        <span className="text-xs text-slate-400">/100</span>
                        <div className="flex-1 max-w-[80px]">
                          <ProgressBar value={d.performanceScore} showLabel={false} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{fmtIndianShort(Number(d.population))}</td>
                    <td className="py-3 pr-4 text-slate-600">{d.facilitiesCount}</td>
                    <td className="py-3 pr-4 text-slate-600">{d.activeProjectsCount}</td>
                    <td className="py-3 pr-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar value={d.budgetUtilizationPct} showLabel={false} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 w-9">{d.budgetUtilizationPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={d.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
