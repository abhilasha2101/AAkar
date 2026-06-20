import { api } from "./client";
import { Project, ProjectListSummary, FlagType } from "../types";

export interface ProjectQuery {
  district?: string;
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function fetchProjects(params: ProjectQuery) {
  const res = await api.get<{ data: Project[]; total: number; page: number; pageSize: number; summary: ProjectListSummary }>(
    "/projects",
    { params }
  );
  return res.data;
}

export async function fetchProject(id: string) {
  const res = await api.get<{ data: Project }>(`/projects/${id}`);
  return res.data.data;
}

export async function fetchProjectCategories() {
  const res = await api.get<{ data: string[] }>("/projects/categories");
  return res.data.data;
}

export interface CreateProjectPayload {
  name: string;
  districtId?: string | null;
  districtLabel?: string | null;
  category: string;
  program?: string | null;
  budgetCr: number;
  spentCr?: number;
  status?: Project["status"];
  priority?: Project["priority"];
  progressPct?: number;
  officer?: string | null;
  description?: string | null;
  deadline?: string | null;
}

export async function createProject(payload: CreateProjectPayload) {
  const res = await api.post<{ data: Project }>("/projects", payload);
  return res.data.data;
}

export async function updateProject(id: string, payload: Partial<CreateProjectPayload>) {
  const res = await api.patch<{ data: Project }>(`/projects/${id}`, payload);
  return res.data.data;
}

export async function deleteProject(id: string) {
  const res = await api.delete<{ data: { id: string; deleted: boolean } }>(`/projects/${id}`);
  return res.data.data;
}

export async function flagProject(id: string, payload: { type: FlagType; note?: string }) {
  const res = await api.post(`/projects/${id}/flag`, payload);
  return res.data.data;
}

export async function addProjectComment(id: string, text: string) {
  const res = await api.post(`/projects/${id}/comments`, { text });
  return res.data.data;
}

export async function toggleMilestone(projectId: string, milestoneId: string, done: boolean) {
  const res = await api.patch(`/projects/${projectId}/milestones/${milestoneId}`, { done });
  return res.data.data;
}

export function exportProjectsCsvUrl(params: ProjectQuery) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return `${api.defaults.baseURL}/projects/export.csv?${qs}`;
}
