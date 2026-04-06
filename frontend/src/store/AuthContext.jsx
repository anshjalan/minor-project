import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const STORAGE_KEY = "civic-auth";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: "", user: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const value = {
    token: session.token,
    user: session.user,
    isAuthenticated: Boolean(session.token),
    login: (payload) => setSession(payload),
    logout: () => setSession({ token: "", user: null })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
