import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { useLogin } from "../../hooks/useApi";

const ROLES = [
  { key: "SUPER_ADMIN", label: "Super Admin", icon: "verified_user" },
  { key: "NATIONAL_ADMIN", label: "National Admin", icon: "admin_panel_settings" },
  { key: "HOSPITAL_ADMIN", label: "Hospital Admin", icon: "local_hospital" },
  { key: "LAB_STAFF", label: "Field Staff", icon: "badge" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("SUPER_ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login.mutateAsync({ email, password });
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="bg-m3-surface text-m3-on-surface min-h-screen flex items-center justify-center p-4 relative">
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <main className="w-full max-w-md bg-m3-surface-container-lowest rounded-xl border border-m3-outline-variant shadow-sm overflow-hidden flex flex-col relative z-10">
        {/* Header */}
        <header className="bg-m3-surface-container-highest px-6 py-8 border-b border-m3-outline-variant flex flex-col items-center text-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-m3-primary" />
          <div className="w-16 h-16 rounded-full bg-m3-primary-container flex items-center justify-center mb-4 border-[3px] border-m3-surface-container-lowest shadow-sm">
            <MaterialIcon icon="security" filled className="text-m3-on-primary text-[32px]" />
          </div>
          <h1 className="text-headline-md text-m3-primary mb-1">DonorLink</h1>
          <p className="text-body-compact text-m3-on-surface-variant">Secure Staff Access</p>
        </header>

        {/* Form Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-label-caps text-m3-on-surface-variant">OPERATIONAL ROLE</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded text-left text-body-compact transition-colors ${
                    selectedRole === role.key
                      ? "border-m3-primary bg-m3-surface-variant text-m3-primary"
                      : "border-m3-outline-variant bg-m3-surface-container-lowest text-m3-on-surface hover:border-m3-outline hover:bg-m3-surface-container"
                  }`}
                >
                  <MaterialIcon icon={role.icon} size={18} className={selectedRole === role.key ? "" : "text-m3-on-surface-variant"} />
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-m3-outline-variant" />

          {/* Credentials */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-m3-error-container/20 border border-m3-error-container p-3 rounded flex items-center gap-2">
                <MaterialIcon icon="error" size={18} className="text-m3-error" />
                <p className="text-body-compact text-m3-error">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-label-caps text-m3-on-surface-variant" htmlFor="identifier">STAFF ID / EMAIL</label>
              <div className="relative">
                <MaterialIcon icon="badge" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
                <input
                  id="identifier"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@donorlink.et"
                  className="w-full bg-m3-surface-container-lowest border border-m3-outline-variant rounded pl-10 pr-3 py-3 font-mono text-data-mono text-m3-on-surface focus:border-m3-primary focus:ring-1 focus:ring-m3-primary placeholder:text-m3-on-surface-variant/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-label-caps text-m3-on-surface-variant" htmlFor="password">AUTHORIZATION KEY</label>
                <Link to="/forgot-password" className="text-label-caps text-m3-primary hover:underline">Forgot Key?</Link>
              </div>
              <div className="relative">
                <MaterialIcon icon="key" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-m3-surface-container-lowest border border-m3-outline-variant rounded pl-10 pr-10 py-3 font-mono text-data-mono text-m3-on-surface focus:border-m3-primary focus:ring-1 focus:ring-m3-primary placeholder:text-m3-on-surface-variant/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant hover:text-m3-on-surface"
                >
                  <MaterialIcon icon={showPassword ? "visibility" : "visibility_off"} size={20} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="mt-2 w-full bg-m3-primary hover:bg-m3-primary/90 text-m3-on-primary text-title-sm py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-ambient-md"
            >
              {login.isPending ? (
                <span className="animate-spin"><MaterialIcon icon="progress_activity" size={20} /></span>
              ) : (
                <MaterialIcon icon="login" filled size={20} />
              )}
              {login.isPending ? "Authenticating..." : "Authenticate Session"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="bg-m3-error-container/20 border-t border-m3-error-container p-3 flex items-start gap-3">
          <MaterialIcon icon="warning" size={20} className="text-m3-error shrink-0 mt-0.5" />
          <p className="text-body-compact text-m3-on-surface-variant text-[11px] leading-tight">
            Warning: This is a restricted national infrastructure portal. Unauthorized access attempts are monitored and logged by the command center.
          </p>
        </footer>

        {/* Register link */}
        <div className="p-4 text-center border-t border-m3-outline-variant">
          <p className="text-body-compact text-m3-on-surface-variant">
            New staff member?{" "}
            <Link to="/register" className="text-m3-primary font-semibold hover:underline">
              Request Access
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}