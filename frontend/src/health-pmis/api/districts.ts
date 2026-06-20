import { api } from "./client";
import { District } from "../types";

export interface DistrictAggregate {
  totalPopulation: number;
  registeredPatients: number;
  totalHealthFacilities: number;
  ambulancesActive: number;
  hospitalBeds: number;
  doctorsAvailable: number;
  nursingStaff: number;
  avgVaccinationCoverage: number;
}

export async function fetchDistricts(params: { status?: string; program?: string; search?: string }) {
  const res = await api.get<{ data: District[]; aggregate: DistrictAggregate; count: number }>("/districts", {
    params,
  });
  return res.data;
}

export async function fetchDistrict(id: string) {
  const res = await api.get<{ data: District & { projects: any[]; facilities: any[] } }>(`/districts/${id}`);
  return res.data.data;
}

export async function updateDistrict(id: string, payload: Partial<District>) {
  const res = await api.patch<{ data: District }>(`/districts/${id}`, payload);
  return res.data.data;
}
