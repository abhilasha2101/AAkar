import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../api/system";
import { NotificationItem } from "../types";

const TYPE_ICON: Record<string, string> = {
  PROJECT_CREATED: "✓",
  PROJECT_DELAYED: "⚠",
  BUDGET_EXCEEDED: "₹",
  PROJECT_FLAGGED: "⚑",
  MILESTONE_COMPLETED: "✓",
  OFFICER_CHANGED: "↻",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchNotifications(false);
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    load();
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-1">
            GOVERNMENT OF NCT OF DELHI · HEALTH &amp; FAMILY WELFARE DEPARTMENT
          </div>
          <h1 className="text-2xl font-bold text-navy">Notifications</h1>
          <p className="text-sm text-slate-500">Real-time alerts generated from project, budget, and facility events</p>
        </div>
        <button onClick={handleMarkAll} className="gov-btn-secondary">
          Mark all as read
        </button>
      </div>

      <div className="gov-card divide-y divide-slate-100">
        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading notifications…</div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400">No notifications yet.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-5 py-4 ${n.read ? "opacity-60" : "bg-blue-50/40"}`}
            >
              <span className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-sm flex-shrink-0">
                {TYPE_ICON[n.type] ?? "•"}
              </span>
              <div className="flex-1">
                <p className="text-sm text-slate-800">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
              </div>
              {!n.read && (
                <button onClick={() => handleMarkRead(n.id)} className="text-xs font-semibold text-navy hover:underline flex-shrink-0">
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
