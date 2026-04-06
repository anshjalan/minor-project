const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getAssetUrl(path) {
  return path ? `${BACKEND_URL}${path}` : "";
}

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  fetchIssues: ({ token, status, category }) => {
    const search = new URLSearchParams();
    if (status) search.set("status", status);
    if (category) search.set("category", category);

    return request(`/issues?${search.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  fetchStats: ({ token }) =>
    request("/issues/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  createIssue: ({ token, formData }) =>
    request("/issues", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }),
  updateIssue: ({ token, id, payload }) =>
    request(`/issues/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
};

