import { Outlet } from "react-router";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppLayout() {
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
