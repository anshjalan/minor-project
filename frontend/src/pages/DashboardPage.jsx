import { useEffect, useState } from "react";

import IssueMap from "../components/IssueMap.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api, getAssetUrl } from "../lib/api.js";

const statusOptions = ["", "Pending", "In Progress", "Resolved"];
const categoryOptions = ["", "Garbage", "Road", "Lighting", "Water", "Drainage", "Other"];

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [issueData, statsData] = await Promise.all([
        api.fetchIssues({ token, ...filters }),
        user.role === "admin" ? api.fetchStats({ token }) : Promise.resolve(null)
      ]);
      setIssues(issueData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [filters.status, filters.category]);

  async function handleStatusChange(id, status) {
    try {
      await api.updateIssue({ token, id, payload: { status } });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-card">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            Civic dashboard
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {user.role === "admin" ? "Manage citizen reports" : "Track your submitted issues"}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Each issue stores location, image evidence, AI-generated category, summary, priority, and department routing.
          </p>
        </div>

        {user.role === "admin" && stats ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Total", value: stats.total },
              { label: "Pending", value: stats.pending },
              { label: "In Progress", value: stats.inProgress },
              { label: "Resolved", value: stats.resolved }
            ].map((card) => (
              <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-card">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-brand-700">{card.value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-5 grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Filter by status</span>
              <select
                value={filters.status}
                onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                {statusOptions.map((status) => (
                  <option key={status || "all"} value={status}>
                    {status || "All statuses"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Filter by category</span>
              <select
                value={filters.category}
                onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                {categoryOptions.map((category) => (
                  <option key={category || "all"} value={category}>
                    {category || "All categories"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

          <div className="space-y-5">
            {issues.map((issue) => (
              <article key={issue._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{issue.category}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{issue.title || issue.aiSummary}</h2>
                    <p className="mt-2 text-sm text-slate-500">{issue.description}</p>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Detected issue: {issue.detectedLabel || "unknown"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {issue.priority} priority
                  </span>
                </div>

                {issue.imageUrl ? (
                  <img
                    src={getAssetUrl(issue.imageUrl)}
                    alt={issue.title || issue.category}
                    className="mt-4 h-52 w-full rounded-3xl object-cover"
                  />
                ) : null}

                {issue.xaiOverlayImageUrl ? (
                  <img
                    src={getAssetUrl(issue.xaiOverlayImageUrl)}
                    alt={`${issue.detectedLabel || issue.category} overlay`}
                    className="mt-4 h-52 w-full rounded-3xl border border-slate-200 object-cover"
                  />
                ) : null}

                <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-800">Summary:</span> {issue.aiSummary}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Department:</span> {issue.department}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Explanation:</span> {issue.aiExplanation}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Confidence:</span>{" "}
                    {Math.round((issue.detectionConfidence || 0) * 100)}%
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Location:</span>{" "}
                    {issue.location.addressLabel || `${issue.location.latitude}, ${issue.location.longitude}`}
                  </p>
                  <p className="md:col-span-2">
                    <span className="font-semibold text-slate-800">Visual evidence:</span>{" "}
                    {issue.xaiEvidence || "Not available"}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                    Status: {issue.status}
                  </span>

                  {user.role === "admin" ? (
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      className="rounded-2xl border border-slate-300 px-4 py-2"
                    >
                      {statusOptions
                        .filter(Boolean)
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  ) : null}
                </div>
              </article>
            ))}

            {!issues.length ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No issues found for the current filters.
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <IssueMap issues={issues} />
        </div>
      </section>
    </div>
  );
}

