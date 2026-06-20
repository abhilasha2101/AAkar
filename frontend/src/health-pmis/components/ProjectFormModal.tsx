import React, { useState } from "react";
import { Modal } from "./Modal";
import { Project, District, ProjectStatus, ProjectPriority } from "../types";
import { createProject, updateProject, CreateProjectPayload } from "../api/projects";
import { useUiStore } from "../store/uiStore";

interface Props {
  mode: "create" | "edit";
  project?: Project;
  districts: District[];
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORY_OPTIONS = [
  "Primary Healthcare", "Healthcare Infrastructure", "Hospital Infrastructure", "Public Health",
  "Digital Health", "Maternal Health", "Digital Transformation", "Disease Control", "Preventive Health",
];

export function ProjectFormModal({ mode, project, districts, onClose, onSaved }: Props) {
  const pushToast = useUiStore((s) => s.pushToast);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateProjectPayload>({
    name: project?.name ?? "",
    districtId: project?.districtId ?? null,
    districtLabel: project?.districtLabel ?? (project ? null : "All Districts"),
    category: project?.category ?? CATEGORY_OPTIONS[0],
    program: project?.program ?? "",
    budgetCr: project?.budgetCr ?? 0,
    spentCr: project?.spentCr ?? 0,
    status: project?.status ?? "ON_TRACK",
    priority: project?.priority ?? "MEDIUM",
    progressPct: project?.progressPct ?? 0,
    officer: project?.officer ?? "",
    description: project?.description ?? "",
    deadline: project?.deadline ? project.deadline.slice(0, 10) : "",
  });

  function set<K extends keyof CreateProjectPayload>(key: K, value: CreateProjectPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      pushToast("error", "Project name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload: CreateProjectPayload = {
        ...form,
        districtId: form.districtId || null,
        districtLabel: form.districtId ? null : form.districtLabel || "All Districts",
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      };
      if (mode === "create") {
        await createProject(payload);
      } else if (project) {
        await updateProject(project.id, payload);
      }
      onSaved();
    } catch (err: any) {
      pushToast("error", err?.response?.data?.error ?? "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={mode === "create" ? "Add New Project" : `Edit Project — ${project?.id}`} onClose={onClose} widthClass="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Project Name *</label>
          <input className="gov-input mt-1" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">District</label>
            <select
              className="gov-input mt-1"
              value={form.districtId ?? ""}
              onChange={(e) => set("districtId", e.target.value || null)}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
            <select className="gov-input mt-1" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Program (optional)</label>
            <input className="gov-input mt-1" value={form.program ?? ""} onChange={(e) => set("program", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Officer</label>
            <input className="gov-input mt-1" value={form.officer ?? ""} onChange={(e) => set("officer", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Budget (₹ Cr)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              className="gov-input mt-1"
              value={form.budgetCr}
              onChange={(e) => set("budgetCr", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Spent (₹ Cr)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              className="gov-input mt-1"
              value={form.spentCr}
              onChange={(e) => set("spentCr", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Progress (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="gov-input mt-1"
              value={form.progressPct}
              onChange={(e) => set("progressPct", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
            <select className="gov-input mt-1" value={form.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
              <option value="ON_TRACK">On Track</option>
              <option value="NEEDS_ATTENTION">Needs Attention</option>
              <option value="DELAYED">Delayed</option>
              <option value="CRITICAL">Critical</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
            <select className="gov-input mt-1" value={form.priority} onChange={(e) => set("priority", e.target.value as ProjectPriority)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Deadline</label>
            <input
              type="date"
              className="gov-input mt-1"
              value={form.deadline ?? ""}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
          <textarea
            className="gov-input mt-1"
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="gov-btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="gov-btn-primary">
            {saving ? "Saving…" : mode === "create" ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
