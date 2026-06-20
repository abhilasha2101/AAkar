import { api } from "./client";
import { AuditLogEntry, NotificationItem } from "../types";

export async function fetchAuditLogs(params: { page?: number; pageSize?: number; entityType?: string }) {
  const res = await api.get<{ data: AuditLogEntry[]; total: number; page: number; pageSize: number }>(
    "/audit-logs",
    { params }
  );
  return res.data;
}

export async function fetchNotifications(unreadOnly = false) {
  const res = await api.get<{ data: NotificationItem[]; unreadCount: number }>("/notifications", {
    params: { unreadOnly },
  });
  return res.data;
}

export async function markNotificationRead(id: string) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data.data;
}

export async function markAllNotificationsRead() {
  const res = await api.patch("/notifications/read-all");
  return res.data.data;
}
