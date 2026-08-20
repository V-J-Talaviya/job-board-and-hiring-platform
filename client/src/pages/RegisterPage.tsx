import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerSchema, RegisterValues } from "@/validations/auth.schema";
import { useAuth } from "@/app/providers/AuthProvider";
import { getApiErrorMessage } from "@/services/apiClient";

const roleHome: Record<string, string> = {
  RECRUITER: "/recruiter/dashboard",
  CANDIDATE: "/candidate/dashboard",
};

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CANDIDATE" },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      const user = await registerUser(
        values.name,
        values.email,
        values.password,
        values.role,
      );
      toast.success("Account created successfully");
      navigate(roleHome[user.role], { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not create account"));
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">
        Create an account
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Sign up as a candidate or a recruiter.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div>
          <span className="label">I am a...</span>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 p-3 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="radio" value="CANDIDATE" {...register("role")} />{" "}
              Candidate
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 p-3 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="radio" value="RECRUITER" {...register("role")} />{" "}
              Recruiter
            </label>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input id="name" className="input" {...register("name")} />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>
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
        <div>
          <label className="label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
