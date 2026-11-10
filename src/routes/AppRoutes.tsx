import { Route, Routes } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { VenuesPage } from "@/features/venues/pages/VenuesPage";
import { HomePage } from "@/features/venues/pages/HomePage";
import { VenueDetailsPage } from "@/features/venues/pages/VenueDetailsPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="venues" element={<VenuesPage />} />
        <Route path="venues/:id" element={<VenueDetailsPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
