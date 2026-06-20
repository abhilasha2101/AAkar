import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("admin@hfw.delhi.gov.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await loginRequest(email, password);
      setAuth(token, user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-sm overflow-hidden">
        <div className="bg-navy px-6 py-5 border-b-4 border-gold">
          <div className="text-gold text-xs font-bold tracking-wide">HEALTH &amp; FAMILY WELFARE DEPARTMENT</div>
          <div className="text-slate-300 text-xs">Government of NCT of Delhi</div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h1 className="text-lg font-bold text-navy">Admin Portal Sign In</h1>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
            <input
              type="email"
              required
              className="gov-input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
            <input
              type="password"
              required
              className="gov-input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-status-critical text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          <button type="submit" disabled={loading} className="gov-btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
