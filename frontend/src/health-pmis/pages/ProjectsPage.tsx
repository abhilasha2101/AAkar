import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, fetchProjectCategories, exportProjectsCsvUrl, ProjectQuery } from "../api/projects";
import { fetchDistricts } from "../api/districts";
import { Project, ProjectListSummary, District } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";
import { ProjectFormModal } from "../components/ProjectFormModal";
import { FlagModal } from "../components/FlagModal";
import { useUiStore } from "../store/uiStore";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<ProjectListSummary | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [flagProjectId, setFlagProjectId] = useState<string | null>(null);

  const pushToast = useUiStore((s) => s.pushToast);

  async function load() {
    setLoading(true);
    try {
      const query: ProjectQuery = {
        district: districtFilter !== "All Districts" ? districtFilter : undefined,
        category: categoryFilter !== "All Categories" ? categoryFilter : undefined,
        status: statusFilter !== "All Statuses" ? (statusFilter as any) : undefined,
        search: search || undefined,
        pageSize: 100,
      };
      const res = await fetchProjects(query);
      setProjects(res.data);
      setSummary(res.summary);
    } catch (e: any) {
      pushToast("error", e?.response?.data?.error ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjectCategories().then(setCategories).catch(() => {});
    fetchDistricts({}).then((r) => setDistricts(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtFilter, categoryFilter, statusFilter, search]);

  function handleExport() {
    const url = exportProjectsCsvUrl({
      district: districtFilter !== "All Districts" ? districtFilter : undefined,
      category: categoryFilter !== "All Categories" ? categoryFilter : undefined,
      status: statusFilter !== "All Statuses" ? (statusFilter as any) : undefined,
      search: search || undefined,
    });
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
            GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
          </div>
          <h1 className="text-2xl font-bold text-navy">Health Project Management</h1>
          <p className="text-sm text-slate-500">All Active, Delayed, and Completed Health Projects across Delhi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="gov-btn-secondary">
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="gov-card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">District</label>
          <select className="gov-input mt-1" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
            <option>All Districts</option>
            {districts.map((d) => (
              <option key={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Project Category</label>
          <select className="gov-input mt-1" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option>All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
          <select className="gov-input mt-1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Statuses</option>
            <option value="ON_TRACK">On Track</option>
            <option value="NEEDS_ATTENTION">Needs Attention</option>
            <option value="DELAYED">Delayed</option>
            <option value="CRITICAL">Critical</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-xs font-semibold text-slate-500 uppercase">Search Projects</label>
          <input
            className="gov-input mt-1"
            placeholder="Search by name, ID, officer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Calculated summary */}
      <div>
        <div className="gov-section-title mb-3">PROJECT SUMMARY (CALCULATED)</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total Projects" value={summary?.total ?? "—"} loading={loading} />
          <StatCard label="Active Projects" value={summary?.active ?? "—"} loading={loading} />
          <StatCard label="Completed Projects" value={summary?.completed ?? "—"} loading={loading} />
          <StatCard label="Delayed Projects" value={summary?.delayed ?? "—"} valueColor="text-status-critical" loading={loading} />
          <StatCard label="Critical Projects" value={summary?.critical ?? "—"} valueColor="text-status-critical" loading={loading} />
        </div>
      </div>

      {/* Project details table */}
      <div className="gov-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="gov-section-title">PROJECT DETAILS</div>
          <button onClick={() => setShowAddModal(true)} className="gov-btn-primary">
            + Add Project
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2 pr-4">Project ID</th>
                <th className="py-2 pr-4">Project Name</th>
                <th className="py-2 pr-4">District</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Budget</th>
                <th className="py-2 pr-4">Progress</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading projects…
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No projects match the current filters.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                    <td className="py-3 pr-4 font-mono text-xs font-bold text-navy">{p.id}</td>
                    <td className="py-3 pr-4 max-w-[220px]">
                      <div className="font-semibold text-slate-800">{p.name}</div>
                      {p.officer && <div className="text-xs text-slate-400 mt-0.5">{p.officer}</div>}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{p.district?.name ?? p.districtLabel ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{p.category}</span>
                    </td>
                    <td className="py-3 pr-4 text-slate-700 font-semibold">₹{p.budgetCr} Cr</td>
                    <td className="py-3 pr-4 w-32">
                      <ProgressBar value={p.progressPct} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <Link to={`/projects/${p.id}`} className="text-xs font-semibold text-navy hover:underline">
                          View
                        </Link>
                        <button onClick={() => setEditProject(p)} className="text-xs font-semibold text-slate-500 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => setFlagProjectId(p.id)} className="text-xs font-semibold text-status-attention hover:underline">
                          Flag
                        </button>
                        <Link to={`/projects/${p.id}?tab=track`} className="text-xs font-semibold text-slate-500 hover:underline">
                          Track
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <ProjectFormModal
          mode="create"
          districts={districts}
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            load();
            pushToast("success", "Project created successfully.");
          }}
        />
      )}
      {editProject && (
        <ProjectFormModal
          mode="edit"
          project={editProject}
          districts={districts}
          onClose={() => setEditProject(null)}
          onSaved={() => {
            setEditProject(null);
            load();
            pushToast("success", "Project updated successfully.");
          }}
        />
      )}
      {flagProjectId && (
        <FlagModal
          projectId={flagProjectId}
          onClose={() => setFlagProjectId(null)}
          onFlagged={() => {
            setFlagProjectId(null);
            load();
            pushToast("warning", "Flag raised. Administrators notified.");
          }}
        />
      )}
    </div>
  );
}
