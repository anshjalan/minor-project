import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-brand-700">
          Civic Issue Reporter
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {isAuthenticated && (
            <>
              <NavLink to="/" className="hover:text-brand-600">
                Dashboard
              </NavLink>
              <NavLink to="/report" className="hover:text-brand-600">
                Report Issue
              </NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="hover:text-brand-600">
                Login
              </NavLink>
              <NavLink to="/signup" className="rounded-full bg-brand-500 px-4 py-2 text-white">
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <span>{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-4 py-2 hover:border-brand-500 hover:text-brand-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

