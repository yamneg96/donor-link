import { Link, useLocation } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { cn } from "../../lib/utils";
import { MaterialIcon } from "../shared/MaterialIcon";
import { authStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useApi";
import { UserRole, ADMIN_ROLES } from "../../types";
import { useTheme } from "../theme-provider";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: UserRole[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Command Center", path: "/dashboard", icon: "dashboard", roles: [...ADMIN_ROLES, UserRole.NATIONAL_ANALYST, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF] },
  { label: "Inventory", path: "/inventory", icon: "inventory_2", roles: [...ADMIN_ROLES, UserRole.NATIONAL_ANALYST, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF] },
  { label: "Unit Tracking", path: "/inventory/tracking", icon: "qr_code_scanner", roles: [...ADMIN_ROLES, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF] },
  { label: "Marketplace", path: "/transfers/marketplace", icon: "swap_horiz", roles: [...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN] },
  { label: "Operations", path: "/transfers/operations", icon: "local_shipping", roles: [...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DISPATCHER] },
  { label: "Expiry Risk", path: "/inventory/expiry", icon: "warning", roles: [...ADMIN_ROLES, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF] },
  { label: "Donor Management", path: "/donors", icon: "group", roles: [...ADMIN_ROLES, UserRole.NATIONAL_ANALYST, UserRole.DONOR_COORDINATOR] },
  { label: "Emergency", path: "/emergency", icon: "emergency", roles: [...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN] },
  { label: "Analytics", path: "/analytics", icon: "analytics", roles: [...ADMIN_ROLES, UserRole.NATIONAL_ANALYST] },
  { label: "Campaigns", path: "/campaigns", icon: "campaign", roles: [...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.DONOR_COORDINATOR] },
  { label: "Alerts", path: "/alerts", icon: "notifications_active", roles: [...ADMIN_ROLES, UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN] },
  { label: "Organizations", path: "/organizations", icon: "account_balance", roles: ADMIN_ROLES },
  { label: "Users", path: "/users", icon: "manage_accounts", roles: ADMIN_ROLES },
  { label: "Roles", path: "/settings/roles", icon: "admin_panel_settings", roles: [UserRole.SUPER_ADMIN] },
  { label: "Audit Log", path: "/audit", icon: "history", roles: ADMIN_ROLES },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", path: "/settings", icon: "settings" },
  { label: "Support", path: "/support", icon: "help" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const state = useSyncExternalStore(authStore.subscribe, authStore.getState);
  const user = state.user;
  const location = useLocation();
  const logout = useLogout();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && authStore.hasRole(...item.roles))
  );

  const handleLogout = async () => {
    await logout.mutateAsync();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-sidebar-width flex flex-col py-4 px-3 bg-m3-surface-container border-r border-m3-outline-variant transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-m3-primary-container flex items-center justify-center shrink-0">
              <MaterialIcon icon="admin_panel_settings" className="text-m3-on-primary-container" filled />
            </div>
            <div className="min-w-0">
              <h1 className="text-headline-md font-bold text-m3-primary truncate text-lg leading-tight">National Portal</h1>
              <p className="text-body-compact text-m3-on-surface-variant truncate text-[11px]">Ethiopia Blood Services</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full md:hidden"
          >
            <MaterialIcon icon="close" size={20} />
          </button>
        </div>

        {/* Emergency CTA */}
        <button className="w-full bg-m3-primary text-m3-on-primary text-title-sm rounded-lg py-3 px-4 flex items-center justify-center gap-2 mb-4 shadow-sm hover:opacity-90 transition-opacity">
          <MaterialIcon icon="add_alert" size={20} />
          <span className="truncate">New Emergency Alert</span>
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-m3-primary-container text-m3-on-primary-container font-bold"
                    : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"
                )}
              >
                <MaterialIcon
                  icon={item.icon}
                  filled={isActive}
                  size={20}
                  className={cn(
                    isActive ? "text-m3-on-primary-container" : "text-m3-on-surface-variant",
                    item.icon === "emergency" && !isActive && "text-m3-primary"
                  )}
                />
                <span className="text-body-compact truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-4 border-t border-m3-outline-variant space-y-0.5">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-m3-on-surface-variant hover:bg-m3-surface-container-high transition-colors"
          >
            <MaterialIcon icon={theme === "dark" ? "light_mode" : "dark_mode"} size={20} />
            <span className="text-body-compact">Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
          </button>

          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-m3-on-surface-variant hover:bg-m3-surface-container-high transition-colors"
            >
              <MaterialIcon icon={item.icon} size={20} />
              <span className="text-body-compact">{item.label}</span>
            </Link>
          ))}

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mt-2 bg-m3-surface-container-high rounded-xl border border-m3-outline-variant/50">
              <div className="w-9 h-9 rounded-full bg-m3-primary text-m3-on-primary flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-compact font-semibold text-m3-on-surface truncate leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-data-mono text-m3-primary uppercase tracking-wider truncate">
                  {user.role?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-m3-on-surface-variant hover:bg-m3-error-container/30 hover:text-m3-on-error-container transition-colors mt-1"
          >
            <MaterialIcon icon="logout" size={20} />
            <span className="text-body-compact">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
