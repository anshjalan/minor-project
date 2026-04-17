import { useEffect, useState } from "react";

import IssueMap from "../components/IssueMap.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api, getAssetUrl } from "../lib/api.js";

const statusOptions = ["", "Pending", "In Progress", "Resolved"];
const categoryOptions = ["", "Damaged Concrete Structures", "Damaged Electric Poles", "Damaged Road Signs", "Dead Animal Pollution", "Fallen Trees", "Garbage", "Graffiti", "Pothole", "Road Crack", "Other"];
const departmentOptions = ["", "Structural Maintenance Department", "Electrical Department", "Traffic and Transport Department", "Sanitation Department", "Parks and Forestry Department", "Public Works Department", "Road Maintenance Department", "General Civic Department"];

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: "", category: "", department: "" });
  const [selectedIssueId, setSelectedIssueId] = useState(null);
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
  }, [filters.status, filters.category, filters.department]);

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
      <header className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="flex-1 rounded-[2rem] bg-white p-8 shadow-card border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
              Civic dashboard
            </p>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {user.role === "admin" ? "Internal Management" : "Your Activity Feed"}
          </h1>
          <p className="mt-3 text-slate-500 leading-relaxed max-w-xl">
            Real-time monitoring of civic infrastructure reports. All issues are categorized and prioritized using autonomous AI vision systems.
          </p>
        </div>

        {user.role === "admin" && stats ? (
          <div className="grid grid-cols-2 gap-4 lg:w-[400px]">
            {[
              { label: "Pending", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "In Progress", value: stats.inProgress, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Resolved", value: stats.resolved, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Total", value: stats.total, color: "text-slate-900", bg: "bg-slate-50" }
            ].map((card) => (
              <div key={card.label} className={`rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between`}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                <p className={`mt-1 text-2xl font-black ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </header>

      <section className="mt-8 flex flex-col gap-8">
        <div>
          <IssueMap issues={issues} selectedIssueId={selectedIssueId} />
        </div>

        <div>
          <div className="mb-5 grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2 lg:grid-cols-3">
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

            {user.role === "admin" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Filter by department</span>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters((current) => ({ ...current, department: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  {departmentOptions.map((dept) => (
                    <option key={dept || "all"} value={dept}>
                      {dept || "All departments"}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {issues.map((issue) => (
              <article key={issue._id} className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{issue.category}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{issue.title || issue.aiSummary}</h2>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">{issue.description}</p>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Detected issue: <span className="font-semibold text-brand-600">{issue.detectedLabel || "unknown"}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                    issue.priority === "High" ? "bg-red-50 text-red-700" :
                    issue.priority === "Medium" ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {issue.priority} priority
                  </span>
                </div>

                <div className={`mt-5 grid gap-3 ${issue.imageUrl && issue.xaiOverlayImageUrl ? "grid-cols-2" : "grid-cols-1"}`}>
                  {issue.imageUrl ? (
                    <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-slate-100 border border-slate-200">
                      <img
                        src={getAssetUrl(issue.imageUrl)}
                        alt={issue.title || issue.category}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-bold uppercase tracking-tight">Original</div>
                    </div>
                  ) : null}

                  {issue.xaiOverlayImageUrl ? (
                    <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-slate-100 border-2 border-brand-500/20 shadow-inner">
                      <img
                        src={getAssetUrl(issue.xaiOverlayImageUrl)}
                        alt={`${issue.detectedLabel || issue.category} overlay`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-brand-600/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-bold uppercase tracking-tight">AI Vision Overlay</div>
                    </div>
                  ) : null}
                </div>

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

                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                      Status: {issue.status}
                    </span>
                    
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => {
                          setSelectedIssueId(issue._id);
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                        className="rounded-2xl bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-200 transition-colors"
                      >
                        View Map
                      </button>

                      {user.role === "admin" ? (
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium"
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
                  </div>
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
      </section>
    </div>
  );
}
