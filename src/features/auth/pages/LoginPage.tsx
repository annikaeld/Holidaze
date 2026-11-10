import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { loginUser } from "../services/authApi";
import { useAuth } from "../context/useAuth";
import { useNavigate, useSearchParams } from "react-router";

export function LoginPage() {
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
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      login(response.data);

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
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
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
    </main>
  );
}
