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
const DispatchPage = lazy(() => import("../pages/dispatches/DispatchPage"));
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
const HospitalDetailPage = lazy(() => import("../pages/organizations/HospitalDetailPage"));
const UsersPage = lazy(() => import("../pages/users/UsersPage"));
const RolesPage = lazy(() => import("../pages/settings/RolesPage"));
const NotificationsPage = lazy(() => import("../pages/notifications/NotificationsPage"));
const AuditLogPage = lazy(() => import("../pages/audit/AuditLogPage"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
const SupportPage = lazy(() => import("../pages/support/SupportPage"));
const ContactPage = lazy(() => import("../pages/contact/ContactPage"));
const NationalForecastPage = lazy(() => import("../pages/intelligence/NationalForecastPage"));
const RedistributionAIPage = lazy(() => import("../pages/intelligence/RedistributionAIPage"));


import { UserRole, ADMIN_ROLES, STAFF_ROLES } from "../types";

// ─── Guard helpers ────────────────────────────────────────────────────────────
function requireAuth() {
  if (!authStore.isAuthenticated()) throw redirect({ to: "/" });
}

function requireRoles(...roles: UserRole[]) {
  requireAuth();
  if (!authStore.hasRole(...roles)) throw redirect({ to: "/unauthorized" });
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
  beforeLoad: () => {
    if (authStore.isAuthenticated()) throw redirect({ to: "/dashboard" });
  },
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
  beforeLoad: () => requireRoles(...STAFF_ROLES),
  component: CommandCenterPage,
});

const dispatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dispatches",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.REGIONAL_ADMIN),
  component: DispatchPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory",
  beforeLoad: () => requireRoles(...STAFF_ROLES),
  component: InventoryPage,
});

const unitTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory/tracking",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF),
  component: UnitTrackingPage,
});

const expiryRiskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory/expiry",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF),
  component: ExpiryRiskPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transfers/marketplace",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN),
  component: MarketplacePage,
});

const operationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transfers/operations",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DISPATCHER),
  component: OperationsPage,
});

const donorManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donors",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.NATIONAL_ANALYST, UserRole.DONOR_COORDINATOR),
  component: DonorManagementPage,
});

const campaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaigns",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.DONOR_COORDINATOR),
  component: CampaignsPage,
});

const emergencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emergency",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN),
  component: EmergencyPage,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN),
  component: AlertCenterPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.NATIONAL_ANALYST),
  component: AnalyticsPage,
});

const organizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations",
  beforeLoad: () => requireRoles(...ADMIN_ROLES),
  component: OrganizationsPage,
});

const hospitalDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations/$id",
  beforeLoad: () => requireRoles(...ADMIN_ROLES),
  component: HospitalDetailPage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  beforeLoad: () => requireRoles(...ADMIN_ROLES),
  component: UsersPage,
});

const rolesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/roles",
  beforeLoad: () => requireRoles(UserRole.SUPER_ADMIN),
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
  beforeLoad: () => requireRoles(...ADMIN_ROLES),
  component: AuditLogPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: requireAuth,
  component: SettingsPage,
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  beforeLoad: requireAuth,
  component: SupportPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const nationalForecastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/intelligence/forecast",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.NATIONAL_ANALYST),
  component: NationalForecastPage,
});

const redistributionAIRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/intelligence/redistribution",
  beforeLoad: () => requireRoles(...ADMIN_ROLES, UserRole.NATIONAL_ANALYST, UserRole.REGIONAL_ADMIN),
  component: RedistributionAIPage,
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
  dispatchRoute,
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
  hospitalDetailRoute,
  usersRoute,
  rolesRoute,
  notificationsRoute,
  auditRoute,
  settingsRoute,
  supportRoute,
  contactRoute,
  nationalForecastRoute,
  redistributionAIRoute,
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