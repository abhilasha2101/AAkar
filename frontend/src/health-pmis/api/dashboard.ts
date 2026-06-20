import { api } from "./client";
import { DashboardSummary } from "../types";

export async function fetchDashboardSummary() {
  const res = await api.get<{ data: DashboardSummary }>("/dashboard/summary");
  return res.data.data;
}
