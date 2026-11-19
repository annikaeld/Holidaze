import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/authApi";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function RegisterPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      venueManager: false,
    },
  });
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      navigate(
        {
          pathname: "/login",
          search,
        },
        {
          replace: true,
          state: {
            registeredEmail: response.data.email,
          },
        },
      );
    },
  });

  function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data);
  }
  const clearApiError = () => {
    if (registerMutation.isError) {
      registerMutation.reset();
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="mb-6 text-center">Create an account</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearApiError}
        className="space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="name">Username</label>
          <input
            id="name"
            {...register("name")}
            type="text"
            autoComplete="username"
            required
            className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.name && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...register("email")}
            type="email"
            autoComplete="email"
            required
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
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="theme-checkbox"
            {...register("venueManager")}
          />
          I want to list and manage venues
        </label>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={registerMutation.isPending || registerMutation.isSuccess}
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create account"}
        </button>
        {registerMutation.isError && (
          <p role="alert" className="text-sm text-error">
            {registerMutation.error.message}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-foreground">
        Already have an account?{" "}
        <Link
          to={{ pathname: "/login", search }}
          className="font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
