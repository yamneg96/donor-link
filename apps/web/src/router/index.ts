import { 
  createRouter, 
  createRoute, 
  createRootRoute, 
  redirect, 
  lazyRouteComponent 
} from "@tanstack/react-router";
import { RootLayout } from "../components/layout/RootLayout";
import { authStore } from "../store/authStore";
import { UserRole } from "@donorlink/types";

// ─── Root ─────────────────────────────────────────────────────────────────────
export const rootRoute = createRootRoute({ component: RootLayout });

// ─── Auth guard helpers ───────────────────────────────────────────────────────
function requireAuth() {
  if (!authStore.isAuthenticated()) throw redirect({ to: "/login" });
}

function requireRole(...roles: UserRole[]) {
  requireAuth();
  if (!authStore.hasRole(...roles)) throw redirect({ to: "/unauthorized" });
}

function requireGuest() {
  if (authStore.isAuthenticated()) throw redirect({ to: "/dashboard" });
}

// ─── Public routes ────────────────────────────────────────────────────────────
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (authStore.isAuthenticated()) throw redirect({ to: "/dashboard" });
  },
  component: lazyRouteComponent(() => import("../pages/LandingPage"), "default"),
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: requireGuest,
  component: lazyRouteComponent(() => import("../pages/auth/LoginPage"), "LoginPage"),
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: requireGuest,
  component: lazyRouteComponent(() => import("../pages/auth/RegisterPage"), "RegisterPage"),
});

export const respondRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/respond/$requestId",
  component: lazyRouteComponent(() => import("../pages/RespondPage"), "default"),
});

export const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unauthorized",
  component: lazyRouteComponent(() => import("../pages/unauthorizedPage"), "default"),
});

// ─── Donor routes ─────────────────────────────────────────────────────────────
export const donorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireAuth,
  component: lazyRouteComponent(() => import("../pages/donor/DashboardPage"), "DashboardPage"),
});

export const donorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  beforeLoad: requireAuth,
  component: lazyRouteComponent(() => import("../pages/donor/ProfilePage"), "default"),
});

export const donorDonationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donations",
  beforeLoad: requireAuth,
  component: lazyRouteComponent(() => import("../pages/donor/DonationsPage"), "default"),
});

export const donorAlertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  beforeLoad: requireAuth,
  component: lazyRouteComponent(() => import("../pages/donor/AlertsPage"), "default"),
});

// ─── Hospital routes ──────────────────────────────────────────────────────────
export const hospitalDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospital",
  beforeLoad: () => requireRole(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/hospital/HospitalDashboard"), "HospitalDashboard"),
});

export const hospitalRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospital/requests",
  beforeLoad: () => requireRole(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/hospital/RequestsPage"), "RequestsPage"),
});

export const newRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospital/requests/new",
  beforeLoad: () => requireRole(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/hospital/NewRequestPage"), "NewRequestPage"),
});

export const hospitalInventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospital/inventory",
  beforeLoad: () => requireRole(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/hospital/InventoryPage"), "default"),
});

// ─── MoH / Admin routes ───────────────────────────────────────────────────────
export const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  beforeLoad: () => requireRole(UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/admin/AnalyticsPage"), "AnalyticsPage"),
});

export const adminDonorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/donors",
  beforeLoad: () => requireRole(UserRole.BLOOD_BANK_ADMIN, UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/admin/DonorPage"), "default"),
});

export const adminHospitalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/hospitals",
  beforeLoad: () => requireRole(UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  component: lazyRouteComponent(() => import("../pages/admin/HospitalsPage"), "default"),
});

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  respondRoute,
  unauthorizedRoute,
  donorDashboardRoute,
  donorProfileRoute,
  donorDonationsRoute,
  donorAlertsRoute,
  hospitalDashboardRoute,
  hospitalRequestsRoute,
  newRequestRoute,
  hospitalInventoryRoute,
  adminAnalyticsRoute,
  adminDonorsRoute,
  adminHospitalsRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}