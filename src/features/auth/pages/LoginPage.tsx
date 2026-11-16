import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { loginUser, getHolidazeProfile } from "../services/authApi";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const { search, state } = useLocation();

  const registeredEmail =
    typeof state?.registeredEmail === "string" ? state.registeredEmail : "";
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: registeredEmail,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await loginUser(data);

      const profile = await getHolidazeProfile(
        response.data.name,
        response.data.accessToken,
      );

      return {
        ...response.data,
        venueManager: profile.venueManager,
      };
    },
    onSuccess: (user) => {
      login(user);

      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";

      navigate(destination, { replace: true });
    },
  });

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="mb-6 text-center">Log in</h1>
      {registeredEmail && (
        <p role="status" className="mb-6 text-center text-sm text-foreground">
          {redirect
            ? "Your account is ready. Log in to continue your booking."
            : "Your account is ready. Log in with the password you just created."}
        </p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          if (loginMutation.isError) loginMutation.reset();
        }}
        className="space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 pr-12 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="password"
              className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>

        {loginMutation.isError && (
          <p role="alert" className="text-sm text-error">
            {loginMutation.error.message}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-foreground">
        Don't have an account?{" "}
        <Link
          to={{ pathname: "/register", search }}
          className="font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          Create an account
        </Link>
      </p>
    </main>
  );
}
