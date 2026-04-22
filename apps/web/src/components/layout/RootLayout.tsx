import { Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import {
  Droplets, LayoutDashboard, Heart, Bell, ClipboardList,
  Package, BarChart3, Users, Building2, LogOut, Menu,
  ChevronRight, Search, User, HelpCircle, AlertTriangle,
  UserPlus, Shield, FileText, BookOpen, Plus, X,
} from "lucide-react";
import { useState, useEffect, useSyncExternalStore } from "react";
import { cn } from "../../lib/utils";
import { authStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useApi";
import { UserRole } from "@donorlink/types";

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV: { label: string; path: string; icon: React.ReactNode; roles?: UserRole[]; section?: string }[] = [
  // Donor
  { label: "Dashboard",    path: "/dashboard",           icon: <LayoutDashboard className="size-[18px]" />, roles: [UserRole.DONOR], section: "donor" },
  { label: "My Donations", path: "/donations",           icon: <Heart className="size-[18px]" />,           roles: [UserRole.DONOR], section: "donor" },
  { label: "Alerts",       path: "/alerts",              icon: <Bell className="size-[18px]" />,            roles: [UserRole.DONOR], section: "donor" },
  // Hospital
  { label: "Overview",     path: "/hospital",            icon: <LayoutDashboard className="size-[18px]" />, roles: [UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN], section: "hospital" },
  { label: "Requests",     path: "/hospital/requests",   icon: <ClipboardList className="size-[18px]" />,   roles: [UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN], section: "hospital" },
  { label: "Inventory",    path: "/hospital/inventory",  icon: <Package className="size-[18px]" />,         roles: [UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN], section: "hospital" },
  { label: "Recipients",   path: "/hospital/recipients", icon: <UserPlus className="size-[18px]" />,        roles: [UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN], section: "hospital" },
  { label: "Matching",     path: "/hospital/matching",   icon: <Search className="size-[18px]" />,          roles: [UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN], section: "hospital" },
  // Admin
  { label: "Analytics",    path: "/admin/analytics",     icon: <BarChart3 className="size-[18px]" />,       roles: [UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN], section: "admin" },
  { label: "Donors",       path: "/admin/donors",        icon: <Users className="size-[18px]" />,           roles: [UserRole.BLOOD_BANK_ADMIN, UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN], section: "admin" },
  { label: "Hospitals",    path: "/admin/hospitals",     icon: <Building2 className="size-[18px]" />,       roles: [UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN], section: "admin" },
  // Static pages (all roles)
  { label: "Guidelines",   path: "/guidelines",          icon: <BookOpen className="size-[18px]" />,        section: "resources" },
  { label: "Privacy",      path: "/privacy",             icon: <Shield className="size-[18px]" />,          section: "resources" },
  { label: "Terms",        path: "/terms",               icon: <FileText className="size-[18px]" />,        section: "resources" },
];

// ─── Root Layout ──────────────────────────────────────────────────────────────

export function RootLayout() {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getState);
  const isAuth = !!state.accessToken && !!state.user;
  const user = state.user;
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();

  // Close mobile sidebar on navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Public pages render without any shell
  if (!isAuth) return <Outlet />;

  const items = NAV.filter(i => !i.roles || authStore.hasRole(...i.roles));

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f8f9ff" }}>
      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-on-surface/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0",
        "bg-surface-container-low border-r-0 shadow-none",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-7 mb-2">
          <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg">
            <Droplets className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-on-surface font-headline">DonorLink</h1>
            <p className="text-xs text-secondary uppercase tracking-wider font-body">Clinical Sanctuary</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {items.filter(i => i.section !== "resources").map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ease-in-out",
                "hover:translate-x-0.5 active:scale-[0.98]"
              )}
              activeProps={{
                className: "bg-surface-container text-primary font-bold"
              }}
              inactiveProps={{
                className: "text-secondary hover:bg-surface-container/50"
              }}
            >
              {({ isActive }) => (
                <>
                  <span className={cn(isActive ? "text-primary" : "text-secondary")}>{item.icon}</span>
                  <span className="font-headline">{item.label}</span>
                  {isActive && <ChevronRight className="size-3.5 ml-auto opacity-60" />}
                </>
              )}
            </Link>
          ))}

          {/* Resources section — separated */}
          {items.filter(i => i.section === "resources").length > 0 && (
            <>
              <div className="pt-6 pb-2 px-4">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Resources</p>
              </div>
              {items.filter(i => i.section === "resources").map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-container/50 transition-all font-semibold font-headline"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Bottom: New Request CTA + Profile */}
        <div className="px-3 pb-4 pt-2 mt-auto">
          <button
            onClick={() => navigate({ to: "/hospital/requests/new" })}
            className="w-full py-3 px-4 bg-white rounded-xl flex items-center justify-center gap-2 text-on-surface font-bold font-headline shadow-sm hover:shadow-md transition-all duration-200 border border-surface-container-low mb-4"
          >
            <Plus className="size-4 text-primary" />
            New Request
          </button>

          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 text-sm font-bold text-on-surface font-headline">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate font-headline">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary truncate">
                {user?.role?.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 mt-3 rounded-xl text-sm font-semibold text-secondary hover:bg-error-container/30 hover:text-on-error-container transition-colors font-headline"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top App Bar ─────────────────────────────────────────────── */}
        <header className={cn(
          "flex justify-between items-center px-6 lg:px-10 py-4 w-full z-10",
          "bg-white/80 backdrop-blur-xl shadow-ambient-sm sticky top-0",
          "font-headline text-sm"
        )}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-container text-secondary mr-3"
          >
            <Menu className="size-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-secondary" />
              <input
                className="w-full pl-12 pr-4 py-2.5 bg-surface rounded-xl text-on-surface placeholder-secondary border-none focus:ring-0 transition-all font-body"
                placeholder="Search clinical records, donors..."
                type="text"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-secondary hover:text-primary transition-colors p-1">
              <Bell className="size-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border border-white" />
            </button>

            <button className="text-secondary hover:text-primary transition-colors p-1">
              <HelpCircle className="size-5" />
            </button>

            <div className="h-6 w-px bg-surface-container-high mx-1 hidden sm:block" />

            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-error-container text-on-error-container rounded-lg font-bold font-headline hover:bg-error-container/80 transition-colors text-xs">
              <AlertTriangle className="size-4" />
              Emergency Alert
            </button>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#f8f9ff" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}