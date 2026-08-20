import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-slate-200">404</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        The page you're looking for doesn't exist or you don't have access to
        it.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
