import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MaterialIcon } from "../shared/MaterialIcon";
import { useTheme } from "../theme-provider";
import { DeclareEmergencyModal } from "../modals/DeclareEmergencyModal";
import { useModal } from "../../hooks/useModal";
import { ConfirmDialog } from "../modals/ConfirmDialog";
import { useLogout } from "../../hooks/useApi";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const emergencyModal = useModal();
  const logoutModal = useModal();
  const logout = useLogout();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout.mutateAsync();
    window.location.href = "/login";
  };

  return (
    <>
      <header className="flex justify-between items-center h-16 px-4 w-full bg-m3-surface-container-highest border-b border-m3-outline-variant sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors md:hidden"
          >
            <MaterialIcon icon="menu" size={24} />
          </button>
          <span className="text-display-lg text-m3-primary text-2xl font-bold hidden sm:inline-block">DonorLink</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <MaterialIcon icon={theme === "dark" ? "light_mode" : "dark_mode"} size={22} />
          </button>
          <button
            onClick={() => navigate({ to: "/notifications" })}
            className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors"
            title="Notifications"
          >
            <MaterialIcon icon="notifications" size={22} />
          </button>
          <button
            onClick={() => emergencyModal.open()}
            className="p-2 text-m3-primary hover:bg-m3-surface-variant rounded-full transition-colors"
            title="Declare Emergency"
          >
            <MaterialIcon icon="emergency_home" size={22} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors"
              title="Account"
            >
              <MaterialIcon icon="account_circle" size={22} />
            </button>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl shadow-ambient-lg z-50 py-1">
                  <button onClick={() => { navigate({ to: "/settings" }); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-compact text-m3-on-surface hover:bg-m3-surface-variant transition-colors">
                    <MaterialIcon icon="settings" size={18} /> Settings
                  </button>
                  <button onClick={() => { navigate({ to: "/notifications" }); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-compact text-m3-on-surface hover:bg-m3-surface-variant transition-colors">
                    <MaterialIcon icon="notifications" size={18} /> Notifications
                  </button>
                  <hr className="border-m3-outline-variant my-1" />
                  <button onClick={() => { navigate({ to: "/support" }); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-compact text-m3-on-surface hover:bg-m3-surface-variant transition-colors">
                    <MaterialIcon icon="help" size={18} /> Support
                  </button>
                  <hr className="border-m3-outline-variant my-1" />
                  <button onClick={() => { logoutModal.open(); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-compact text-m3-error hover:bg-m3-error-container/30 transition-colors">
                    <MaterialIcon icon="logout" size={18} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <DeclareEmergencyModal open={emergencyModal.isOpen} onClose={emergencyModal.close} />
      <ConfirmDialog
        open={logoutModal.isOpen}
        onClose={logoutModal.close}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of the DonorLink platform?"
        confirmLabel="Sign Out"
        variant="danger"
        isLoading={logout.isPending}
      />
    </>
  );
}
