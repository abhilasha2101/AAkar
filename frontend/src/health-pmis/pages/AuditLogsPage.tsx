import React, { useEffect, useState } from "react";
import { fetchAuditLogs } from "../api/system";
import { AuditLogEntry } from "../types";

const ACTION_COLOR: Record<string, string> = {
  CREATE_PROJECT: "text-status-good",
  UPDATE_PROJECT: "text-navy",
  DELETE_PROJECT: "text-status-critical",
  FLAG_PROJECT: "text-status-attention",
  UPDATE_DISTRICT: "text-navy",
  CREATE_FACILITY: "text-status-good",
  UPDATE_FACILITY: "text-navy",
  DELETE_FACILITY: "text-status-critical",
  CREATE_WELFARE_PROGRAM: "text-status-good",
  UPDATE_WELFARE_PROGRAM: "text-navy",
  DELETE_WELFARE_PROGRAM: "text-status-critical",
  UPDATE_FISCAL_YEAR: "text-status-attention",
};

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 30;

  useEffect(() => {
    setLoading(true);
    fetchAuditLogs({ page, pageSize })
      .then((res) => {
        setLogs(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">Audit Logs</h1>
        <p className="text-sm text-slate-500">Complete record of every create, update, and delete action across the platform</p>
      </div>

      <div className="gov-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2 pr-4">Timestamp</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Entity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">Loading audit trail…</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">No actions recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-700">{log.user?.name ?? "System"}</td>
                    <td className={`py-2.5 pr-4 font-semibold text-xs ${ACTION_COLOR[log.action] ?? "text-slate-600"}`}>
                      {log.action.replace(/_/g, " ")}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs">
                      {log.entityType}
                      {log.entityId && <span className="font-mono"> · {log.entityId}</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="gov-btn-secondary disabled:opacity-40">
              Previous
            </button>
            <button
              disabled={page * pageSize >= total}
              onClick={() => setPage((p) => p + 1)}
              className="gov-btn-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
