import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/features/venues/pages/HomePage";
import { PageMessage } from "@/shared/components/PageMessage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

const VenuesPage = lazy(() =>
  import("@/features/venues/pages/VenuesPage").then((module) => ({
    default: module.VenuesPage,
  })),
);

const VenueDetailsPage = lazy(() =>
  import("@/features/venues/pages/VenueDetailsPage").then((module) => ({
    default: module.VenueDetailsPage,
  })),
);

const CreateVenuePage = lazy(() =>
  import("@/features/venues/pages/CreateVenuePage").then((module) => ({
    default: module.CreateVenuePage,
  })),
);

const EditVenuePage = lazy(() =>
  import("@/features/venues/pages/EditVenuePage").then((module) => ({
    default: module.EditVenuePage,
  })),
);

const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);

const BookingSummaryPage = lazy(() =>
  import("@/features/venues/pages/BookingSummaryPage").then((module) => ({
    default: module.BookingSummaryPage,
  })),
);

const BookingSuccessPage = lazy(() =>
  import("@/features/venues/pages/BookingSuccessPage").then((module) => ({
    default: module.BookingSuccessPage,
  })),
);

const MyBookingsPage = lazy(() =>
  import("@/features/venues/pages/MyBookingsPage").then((module) => ({
    default: module.MyBookingsPage,
  })),
);

const GuestBookingsPage = lazy(() =>
  import("@/features/venues/pages/GuestBookingsPage").then((module) => ({
    default: module.GuestBookingsPage,
  })),
);

const MyProfilePage = lazy(() =>
  import("@/features/auth/pages/MyProfilePage").then((module) => ({
    default: module.MyProfilePage,
  })),
);

const BecomeVenueManagerPage = lazy(() =>
  import("@/features/auth/pages/BecomeVenueManagerPage").then((module) => ({
    default: module.BecomeVenueManagerPage,
  })),
);

const MyVenuesPage = lazy(() =>
  import("@/features/venues/pages/MyVenuesPage").then((module) => ({
    default: module.MyVenuesPage,
  })),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="venues"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <VenuesPage />
            </Suspense>
          }
        />
        <Route
          path="venues/:id"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <VenueDetailsPage />
            </Suspense>
          }
        />
        <Route
          path="register"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="login"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="booking/summary"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <BookingSummaryPage />
            </Suspense>
          }
        />
        <Route
          path="/booking/success"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <BookingSuccessPage />
            </Suspense>
          }
        />
        <Route
          path="my-bookings"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <MyBookingsPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <MyProfilePage />
            </Suspense>
          }
        />
        <Route
          path="list-venue"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <BecomeVenueManagerPage />
            </Suspense>
          }
        />
        <Route
          path="my-venues"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <MyVenuesPage />
            </Suspense>
          }
        />
        <Route
          path="my-venues/create"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <CreateVenuePage />
            </Suspense>
          }
        />
        <Route
          path="my-venues/:id/edit"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <EditVenuePage />
            </Suspense>
          }
        />
        <Route
          path="my-venues/bookings"
          element={
            <Suspense fallback={<PageMessage>Loading page...</PageMessage>}>
              <GuestBookingsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}