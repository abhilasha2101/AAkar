import React from "react";
import { useAuthStore } from "../store/authStore";

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
          GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
        </div>
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
      </div>

      <div className="gov-card p-5 max-w-lg">
        <div className="gov-section-title mb-4">ACCOUNT</div>
        <dl className="text-sm space-y-3">
          <div className="flex justify-between"><dt className="text-slate-500">Name</dt><dd className="font-medium">{user?.name}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd className="font-medium">{user?.email}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Employee Code</dt><dd className="font-medium font-mono">{user?.employeeCode}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Role</dt><dd className="font-medium">{user?.role}</dd></div>
        </dl>
      </div>
    </div>
  );
}
