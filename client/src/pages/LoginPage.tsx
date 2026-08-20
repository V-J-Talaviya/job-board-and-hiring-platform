import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema, LoginValues } from "@/validations/auth.schema";
import { useAuth } from "@/app/providers/AuthProvider";
import { getApiErrorMessage } from "@/services/apiClient";

const roleHome: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  RECRUITER: "/recruiter/dashboard",
  CANDIDATE: "/candidate/dashboard",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      const redirectTo =
        (location.state as { from?: Location })?.from?.pathname ||
        roleHome[user.role];
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Invalid email or password"));
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Log in</h1>
      <p className="mb-6 text-sm text-slate-500">
        Welcome back. Enter your details to continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            {...register("email")}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            {...register("password")}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-brand-600 hover:underline"
        >
          Sign up
        </Link>
      </p>

      <div className="mt-6 rounded-lg bg-slate-100 p-4 text-xs text-slate-500">
        <p className="mb-1 font-medium text-slate-600">Demo credentials</p>
        <p>Admin: admin@example.com / Admin@12345</p>
        <p>Recruiter: recruiter1@example.com / Recruiter@123</p>
        <p>Candidate: candidate1@example.com / Candidate@123</p>
      </div>
    </div>
  );
}
