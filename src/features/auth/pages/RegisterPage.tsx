import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/authApi";

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      venueManager: false,
    },
  });
  const registerMutation = useMutation({
    mutationFn: registerUser,
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
          <input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.password && (
            <p role="alert" className="mt-1 text-sm text-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("venueManager")} />I want to list
          and manage venues
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

        {registerMutation.isSuccess && (
          <p role="status" className="text-sm text-foreground">
            Account created successfully! You can now log in.
          </p>
        )}
      </form>
    </main>
  );
}
