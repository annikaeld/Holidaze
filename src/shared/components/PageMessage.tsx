import type { ReactNode } from "react";

interface PageMessageProps {
  children: ReactNode;
  isError?: boolean;
}

export function PageMessage({ children, isError = false }: PageMessageProps) {
  return (
    <main className="flex min-h-64 items-center justify-center px-4 py-8">
      <p
        role={isError ? "alert" : "status"}
        className={`text-center ${
          isError ? "text-error" : "text-muted-foreground"
        }`}
      >
        {children}
      </p>
    </main>
  );
}
