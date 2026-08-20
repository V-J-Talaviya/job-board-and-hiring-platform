import { Link } from "react-router-dom";
import { Search, Briefcase, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-16 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Find your next role, or your next hire
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">
          A simple, focused job board connecting recruiters with candidates -
          search, apply, and track it all in one place.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/jobs" className="btn-primary bg-white text-brand-700">
            <Search className="h-4 w-4" /> Browse jobs
          </Link>
          <Link
            to="/register"
            className="btn-secondary bg-transparent text-white"
          >
            Get started
          </Link>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card p-6">
          <Search className="h-6 w-6 text-brand-600" />
          <h3 className="mt-3 font-semibold">Search & filter</h3>
          <p className="mt-1 text-sm text-slate-500">
            Find roles by skill, location, and job type with fast server-side
            search.
          </p>
        </div>
        <div className="card p-6">
          <Briefcase className="h-6 w-6 text-brand-600" />
          <h3 className="mt-3 font-semibold">Manage applications</h3>
          <p className="mt-1 text-sm text-slate-500">
            Recruiters track every applicant from applied to hired in one
            dashboard.
          </p>
        </div>
        <div className="card p-6">
          <Users className="h-6 w-6 text-brand-600" />
          <h3 className="mt-3 font-semibold">Built for every role</h3>
          <p className="mt-1 text-sm text-slate-500">
            Dedicated experiences for candidates, recruiters, and admins.
          </p>
        </div>
      </section>
    </div>
  );
}
