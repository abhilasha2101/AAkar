import { api } from "./client";
import { Facility, FacilityOverviewRow, FacilityType } from "../types";

export interface InfrastructureOverview {
  byType: FacilityOverviewRow[];
  completionRateDonut: { label: string; value: number; pct: number }[];
  growthTrend: { year: number; mohallaClinics: number; hospitals: number }[];
}

export async function fetchInfrastructureOverview() {
  const res = await api.get<{ data: InfrastructureOverview }>("/infrastructure");
  return res.data.data;
}

export async function fetchFacilities() {
  const res = await api.get<{ data: Facility[] }>("/infrastructure/facilities");
  return res.data.data;
}

export interface FacilityPayload {
  type: FacilityType;
  districtId?: string | null;
  name?: string | null;
  completedCount: number;
  ongoingCount: number;
}

export async function createFacility(payload: FacilityPayload) {
  const res = await api.post<{ data: Facility }>("/infrastructure/facilities", payload);
  return res.data.data;
}

export async function updateFacility(id: string, payload: Partial<FacilityPayload>) {
  const res = await api.patch<{ data: Facility }>(`/infrastructure/facilities/${id}`, payload);
  return res.data.data;
}

export async function deleteFacility(id: string) {
  const res = await api.delete(`/infrastructure/facilities/${id}`);
  return res.data.data;
}
