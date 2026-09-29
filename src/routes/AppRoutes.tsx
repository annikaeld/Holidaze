import { Route, Routes } from "react-router";
import { VenuesPage } from "@/features/venues/pages/VenuesPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<VenuesPage />} />
    </Routes>
  );
}
