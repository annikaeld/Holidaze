import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

const pageTitles: Record<string, string> = {
  "/venues": "Venues",
  "/register": "Create an account",
  "/login": "Log in",
  "/booking/summary": "Booking summary",
  "/booking/success": "Booking confirmed",
  "/my-bookings": "My bookings",
  "/profile": "My profile",
  "/list-venue": "Become a venue manager",
  "/my-venues": "My venues",
  "/my-venues/create": "Create venue",
  "/my-venues/bookings": "Guest bookings",
};

export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, "");
    if (/^\/venues\/[^/]+$/.test(path)) return;
    const title =
      pageTitles[path] ??
      (/^\/my-venues\/[^/]+\/edit$/.test(path) ? "Edit venue" : undefined);
    document.title = title ? `${title} | Holidaze` : "Holidaze";
  }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="w-full flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}
