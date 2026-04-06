import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = isLogin ? await api.login(form) : await api.signup(form);
      login(response);
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-brand-700 p-8 text-white shadow-card">
          <p className="mb-3 inline-block rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.25em]">
            Student MVP
          </p>
          <h1 className="text-4xl font-bold leading-tight">Report civic issues clearly, track them openly.</h1>
          <p className="mt-4 max-w-xl text-sm text-white/80">
            Citizens can submit geo-tagged complaints, and admins can review, route, and resolve them with lightweight AI support.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-slate-900">{isLogin ? "Login" : "Create account"}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {isLogin ? "Access your dashboard and issue history." : "Register as a citizen or admin for demo use."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>

            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                >
                  <option value="user">Citizen</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-70"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            {isLogin ? "Need an account?" : "Already registered?"}{" "}
            <Link to={isLogin ? "/signup" : "/login"} className="font-semibold text-brand-600">
              {isLogin ? "Sign up" : "Login"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

