import React, { useState } from "react";
import { Modal } from "./Modal";
import { FlagType } from "../types";
import { flagProject } from "../api/projects";
import { useUiStore } from "../store/uiStore";

const FLAG_OPTIONS: { value: FlagType; label: string }[] = [
  { value: "DELAYED", label: "Delayed" },
  { value: "RISK", label: "Risk" },
  { value: "BUDGET_ISSUE", label: "Budget Issue" },
  { value: "STAFF_SHORTAGE", label: "Staff Shortage" },
  { value: "COMPLIANCE_ISSUE", label: "Compliance Issue" },
  { value: "OTHER", label: "Other" },
];

export function FlagModal({
  projectId,
  onClose,
  onFlagged,
}: {
  projectId: string;
  onClose: () => void;
  onFlagged: () => void;
}) {
  const [type, setType] = useState<FlagType>("DELAYED");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pushToast = useUiStore((s) => s.pushToast);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await flagProject(projectId, { type, note });
      onFlagged();
    } catch (err: any) {
      pushToast("error", err?.response?.data?.error ?? "Failed to raise flag.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Flag Issue — ${projectId}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Issue Type</label>
          <select className="gov-input mt-1" value={type} onChange={(e) => setType(e.target.value as FlagType)}>
            {FLAG_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Notes</label>
          <textarea className="gov-input mt-1" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe the issue…" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="gov-btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="bg-status-attention text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50">
            {submitting ? "Submitting…" : "Raise Flag"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
