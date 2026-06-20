import { api } from "./client";
import { BudgetOverview, WelfareProgram, WelfareProgramStatus } from "../types";

export async function fetchBudgetOverview() {
  const res = await api.get<{ data: BudgetOverview }>("/budget");
  return res.data.data;
}

export async function updateFiscalYear(payload: {
  allocatedCr?: number;
  releasedCr?: number;
  utilizedCr?: number;
  targetUtilPct?: number;
}) {
  const res = await api.patch("/budget/fiscal-year", payload);
  return res.data.data;
}

export async function fetchWelfarePrograms() {
  const res = await api.get<{ data: WelfareProgram[]; count: number }>("/budget/welfare-programs");
  return res.data.data;
}

export interface WelfareProgramPayload {
  name: string;
  beneficiariesLabel: string;
  beneficiariesRaw?: number;
  coveragePct: number;
  budgetAllocatedCr: number;
  budgetSpentCr?: number;
  progressPct: number;
  status?: WelfareProgramStatus;
}

export async function createWelfareProgram(payload: WelfareProgramPayload) {
  const res = await api.post<{ data: WelfareProgram }>("/budget/welfare-programs", payload);
  return res.data.data;
}

export async function updateWelfareProgram(id: string, payload: Partial<WelfareProgramPayload>) {
  const res = await api.patch<{ data: WelfareProgram }>(`/budget/welfare-programs/${id}`, payload);
  return res.data.data;
}

export async function deleteWelfareProgram(id: string) {
  const res = await api.delete(`/budget/welfare-programs/${id}`);
  return res.data.data;
}
