import { Component, type ReactNode } from "react";

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <h1>Something went wrong</h1>
          <div className="mt-6 rounded-lg border border-border bg-card p-6">
            <p className="text-muted-foreground">
              Try reloading the page or going back to home
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="btn-primary btn-primary-compact"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
              <a href="/" className="text-heading underline">
                Back to home
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
