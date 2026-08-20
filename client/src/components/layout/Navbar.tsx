import { Link, NavLink } from "react-router-dom";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";

const roleHome: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  RECRUITER: "/recruiter/dashboard",
  CANDIDATE: "/candidate/dashboard",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-slate-900"
        >
          <Briefcase className="h-5 w-5 text-brand-600" />
          Job Board & Hiring Platform
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive ? "text-brand-600" : "hover:text-slate-900"
            }
          >
            Browse Jobs
          </NavLink>
          {user && (
            <NavLink
              to={roleHome[user.role]}
              className={({ isActive }) =>
                isActive ? "text-brand-600" : "hover:text-slate-900"
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-slate-500">
                {user.name} <span className="text-slate-300">·</span>{" "}
                {user.role.toLowerCase()}
              </span>
              <button className="btn-secondary" onClick={logout}>
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 md:hidden">
          <Link to="/jobs" onClick={() => setMobileOpen(false)}>
            Browse Jobs
          </Link>
          {user ? (
            <>
              <Link
                to={roleHome[user.role]}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button className="text-left" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
