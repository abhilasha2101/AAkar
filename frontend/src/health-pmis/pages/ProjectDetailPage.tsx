import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { fetchProject, toggleMilestone, addProjectComment, deleteProject } from "../api/projects";
import { Project } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";
import { useUiStore } from "../store/uiStore";
import { useNavigate } from "react-router-dom";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [tab, setTab] = useState<"overview" | "track">(searchParams.get("tab") === "track" ? "track" : "overview");
  const pushToast = useUiStore((s) => s.pushToast);
  const navigate = useNavigate();

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const p = await fetchProject(id);
      setProject(p);
    } catch (e: any) {
      pushToast("error", e?.response?.data?.error ?? "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleToggleMilestone(milestoneId: string, done: boolean) {
    if (!id) return;
    try {
      await toggleMilestone(id, milestoneId, !done);
      load();
    } catch (e: any) {
      pushToast("error", "Failed to update milestone.");
    }
  }

  async function handleAddComment() {
    if (!id || !commentText.trim()) return;
    try {
      await addProjectComment(id, commentText);
      setCommentText("");
      load();
    } catch {
      pushToast("error", "Failed to add comment.");
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm("Delete this project permanently? This cannot be undone.")) return;
    try {
      await deleteProject(id);
      pushToast("success", "Project deleted.");
      navigate("/projects");
    } catch {
      pushToast("error", "Failed to delete project.");
    }
  }

  if (loading) return <div className="text-slate-400 py-12 text-center">Loading project…</div>;
  if (!project) return <div className="text-slate-400 py-12 text-center">Project not found.</div>;

  const utilPct = project.budgetCr > 0 ? Math.round((project.spentCr / project.budgetCr) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link to="/projects" className="text-sm text-navy hover:underline">
            ← Back to Project Management
          </Link>
          <h1 className="text-2xl font-bold text-navy mt-2">{project.name}</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span className="font-mono">{project.id}</span>
            <span>·</span>
            <span>{project.district?.name ?? project.districtLabel}</span>
            <span>·</span>
            <StatusBadge status={project.status} />
          </div>
        </div>
        <button onClick={handleDelete} className="text-sm text-status-critical hover:underline">
          Delete Project
        </button>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {(["overview", "track"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${
              tab === t ? "border-navy text-navy" : "border-transparent text-slate-400"
            }`}
          >
            {t === "overview" ? "Overview" : "Tracking & Milestones"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Budget Allocated" value={`₹${project.budgetCr} Cr`} />
            <StatCard label="Amount Spent" value={`₹${project.spentCr} Cr`} valueColor={utilPct > 90 ? "text-status-critical" : "text-navy"} />
            <StatCard label="Budget Utilization" value={`${utilPct}%`} valueColor={utilPct > 90 ? "text-status-critical" : "text-status-good"} />
            <StatCard label="Progress" value={`${project.progressPct}%`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="gov-card p-5">
              <div className="gov-section-title mb-4">PROJECT INFORMATION</div>
              <dl className="text-sm space-y-2.5">
                <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-medium text-slate-800">{project.category}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Program</dt><dd className="font-medium text-slate-800">{project.program ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Priority</dt><dd className="font-medium text-slate-800">{project.priority}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Project Officer</dt><dd className="font-medium text-slate-800">{project.officer ?? "Unassigned"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Deadline</dt><dd className="font-medium text-slate-800">{project.deadline ? new Date(project.deadline).toLocaleDateString("en-IN") : "—"}</dd></div>
              </dl>
              {project.description && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</div>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
              )}
            </div>

            <div className="gov-card p-5">
              <div className="gov-section-title mb-4">STATUS HISTORY</div>
              <div className="space-y-3">
                {project.statusHistory.length === 0 && <p className="text-sm text-slate-400">No status changes recorded.</p>}
                {project.statusHistory.map((h) => (
                  <div key={h.id} className="flex items-start justify-between text-sm border-b border-slate-50 pb-2">
                    <div>
                      <StatusBadge status={h.status} />
                      {h.note && <p className="text-slate-500 text-xs mt-1">{h.note}</p>}
                    </div>
                    <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {project.flags.length > 0 && (
            <div className="gov-card p-5">
              <div className="gov-section-title mb-4">FLAGGED ISSUES</div>
              <div className="space-y-2">
                {project.flags.map((f) => (
                  <div key={f.id} className="flex items-start justify-between bg-amber-50 border border-amber-200 rounded px-3 py-2 text-sm">
                    <div>
                      <span className="font-semibold text-status-attention">{f.type.replace(/_/g, " ")}</span>
                      {f.note && <p className="text-slate-600 text-xs mt-0.5">{f.note}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">Raised by {f.raisedBy ?? "Unknown"}</p>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(f.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="gov-card p-5">
            <div className="gov-section-title mb-4">COMMENTS &amp; ACTIVITY</div>
            <div className="flex gap-2 mb-4">
              <input
                className="gov-input"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button onClick={handleAddComment} className="gov-btn-primary whitespace-nowrap">
                Post
              </button>
            </div>
            <div className="space-y-3">
              {project.comments.length === 0 && <p className="text-sm text-slate-400">No comments yet.</p>}
              {project.comments.map((c) => (
                <div key={c.id} className="text-sm border-b border-slate-50 pb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">{c.author?.name ?? "Officer"}</span>
                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "track" && (
        <div className="gov-card p-5">
          <div className="gov-section-title mb-4">MILESTONES &amp; PROGRESS</div>
          <div className="mb-5">
            <ProgressBar value={project.progressPct} />
          </div>
          <div className="space-y-2">
            {project.milestones.length === 0 && <p className="text-sm text-slate-400">No milestones defined for this project.</p>}
            {project.milestones
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((m) => (
                <label key={m.id} className="flex items-center gap-3 py-2 border-b border-slate-50 cursor-pointer">
                  <input type="checkbox" checked={m.done} onChange={() => handleToggleMilestone(m.id, m.done)} className="w-4 h-4 accent-navy" />
                  <span className={`text-sm flex-1 ${m.done ? "line-through text-slate-400" : "text-slate-700"}`}>{m.title}</span>
                  {m.dueDate && <span className="text-xs text-slate-400">{new Date(m.dueDate).toLocaleDateString("en-IN")}</span>}
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
