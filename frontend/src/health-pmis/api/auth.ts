import { api } from "./client";
import { User } from "../types";

export async function loginRequest(email: string, password: string) {
  const res = await api.post<{ token: string; user: User }>("/auth/login", { email, password });
  return res.data;
}

export async function meRequest() {
  const res = await api.get<{ user: User }>("/auth/me");
  return res.data.user;
}
