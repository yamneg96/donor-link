import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { authStore } from "../store/authStore";
import { RootLayout } from "../components/layout/RootLayout";
import { lazy } from "react";

// ─── Lazy Page Imports ────────────────────────────────────────────────────────
const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const UnauthorizedPage = lazy(() => import("../pages/unauthorizedPage"));
const CommandCenterPage = lazy(() => import("../pages/dashboard/CommandCenterPage"));
const InventoryPage = lazy(() => import("../pages/inventory/InventoryPage"));
const UnitTrackingPage = lazy(() => import("../pages/inventory/UnitTrackingPage"));
const ExpiryRiskPage = lazy(() => import("../pages/inventory/ExpiryRiskPage"));
const MarketplacePage = lazy(() => import("../pages/transfers/MarketplacePage"));
const OperationsPage = lazy(() => import("../pages/transfers/OperationsPage"));
const DonorManagementPage = lazy(() => import("../pages/donors/DonorManagementPage"));
const CampaignsPage = lazy(() => import("../pages/campaigns/CampaignsPage"));
const EmergencyPage = lazy(() => import("../pages/emergency/EmergencyPage"));
const AlertCenterPage = lazy(() => import("../pages/alerts/AlertCenterPage"));
const AnalyticsPage = lazy(() => import("../pages/analytics/AnalyticsPage"));
const OrganizationsPage = lazy(() => import("../pages/organizations/OrganizationsPage"));
const UsersPage = lazy(() => import("../pages/users/UsersPage"));
const RolesPage = lazy(() => import("../pages/settings/RolesPage"));
const NotificationsPage = lazy(() => import("../pages/notifications/NotificationsPage"));
const AuditLogPage = lazy(() => import("../pages/audit/AuditLogPage"));

// ─── Guard helpers ────────────────────────────────────────────────────────────
function requireAuth() {
  if (!authStore.isAuthenticated()) throw redirect({ to: "/login" });
}

function requireGuest() {
  if (authStore.isAuthenticated()) throw redirect({ to: "/dashboard" });
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

// ─── Public Routes ────────────────────────────────────────────────────────────
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: requireGuest,
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: requireGuest,
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  beforeLoad: requireGuest,
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unauthorized",
  component: UnauthorizedPage,
});

// ─── Authenticated Routes ─────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireAuth,
  component: CommandCenterPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory",
  beforeLoad: requireAuth,
  component: InventoryPage,
});

const unitTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory/tracking",
  beforeLoad: requireAuth,
  component: UnitTrackingPage,
});

const expiryRiskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory/expiry",
  beforeLoad: requireAuth,
  component: ExpiryRiskPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transfers/marketplace",
  beforeLoad: requireAuth,
  component: MarketplacePage,
});

const operationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transfers/operations",
  beforeLoad: requireAuth,
  component: OperationsPage,
});

const donorManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donors",
  beforeLoad: requireAuth,
  component: DonorManagementPage,
});

const campaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaigns",
  beforeLoad: requireAuth,
  component: CampaignsPage,
});

const emergencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emergency",
  beforeLoad: requireAuth,
  component: EmergencyPage,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  beforeLoad: requireAuth,
  component: AlertCenterPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  beforeLoad: requireAuth,
  component: AnalyticsPage,
});

const organizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations",
  beforeLoad: requireAuth,
  component: OrganizationsPage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  beforeLoad: requireAuth,
  component: UsersPage,
});

const rolesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/roles",
  beforeLoad: requireAuth,
  component: RolesPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  beforeLoad: requireAuth,
  component: NotificationsPage,
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit",
  beforeLoad: requireAuth,
  component: AuditLogPage,
});

// ─── Route Tree ───────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  unauthorizedRoute,
  dashboardRoute,
  inventoryRoute,
  unitTrackingRoute,
  expiryRiskRoute,
  marketplaceRoute,
  operationsRoute,
  donorManagementRoute,
  campaignsRoute,
  emergencyRoute,
  alertsRoute,
  analyticsRoute,
  organizationsRoute,
  usersRoute,
  rolesRoute,
  notificationsRoute,
  auditRoute,
]);

// ─── Router Instance ──────────────────────────────────────────────────────────
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Type registration for TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}