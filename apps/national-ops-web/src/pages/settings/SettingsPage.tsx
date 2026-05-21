import { useState } from "react";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { useTheme } from "../../components/theme-provider";
import { toast } from "sonner";

const TABS = ["Profile", "Notifications", "Security", "Appearance"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  const { theme, setTheme } = useTheme();

  const ic = "w-full px-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary";
  const lc = "block text-label-caps text-m3-on-surface-variant mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Settings</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Manage your account preferences and platform settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-m3-surface-container rounded-xl p-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 px-4 rounded-lg text-title-sm text-sm transition-all ${tab === t ? "bg-m3-primary text-m3-on-primary shadow-sm" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
        {tab === "Profile" && (
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="space-y-4 max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-m3-primary text-m3-on-primary flex items-center justify-center text-xl font-bold">YN</div>
              <div><p className="text-title-sm text-m3-on-surface">Your Profile</p><p className="text-body-compact text-m3-on-surface-variant">Update your personal information</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lc}>First Name</label><input className={ic} defaultValue="" placeholder="First name" /></div>
              <div><label className={lc}>Last Name</label><input className={ic} defaultValue="" placeholder="Last name" /></div>
            </div>
            <div><label className={lc}>Email</label><input type="email" className={ic} defaultValue="" placeholder="Email" /></div>
            <div><label className={lc}>Phone</label><input className={ic} defaultValue="" placeholder="+251..." /></div>
            <button type="submit" className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90">Save Changes</button>
          </form>
        )}

        {tab === "Notifications" && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-title-sm text-m3-on-surface mb-4">Notification Preferences</h3>
            {[
              { label: "Email Notifications", desc: "Receive alerts and updates via email", icon: "email" },
              { label: "SMS Alerts", desc: "Critical alerts sent via SMS", icon: "sms" },
              { label: "Push Notifications", desc: "Browser push notifications", icon: "notifications" },
              { label: "Emergency Alerts", desc: "Always receive emergency declarations", icon: "emergency" },
              { label: "Transfer Updates", desc: "Notifications when transfers are dispatched", icon: "local_shipping" },
              { label: "Inventory Warnings", desc: "Low stock and expiry warnings", icon: "warning" },
            ].map((pref) => (
              <label key={pref.label} className="flex items-center justify-between p-3 rounded-lg border border-m3-outline-variant hover:bg-m3-surface-container cursor-pointer">
                <div className="flex items-center gap-3">
                  <MaterialIcon icon={pref.icon} size={20} className="text-m3-secondary" />
                  <div><p className="text-body-compact text-m3-on-surface font-medium">{pref.label}</p><p className="text-xs text-m3-on-surface-variant">{pref.desc}</p></div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-m3-primary rounded" />
              </label>
            ))}
            <button onClick={() => toast.success("Preferences saved")} className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 mt-2">Save Preferences</button>
          </div>
        )}

        {tab === "Security" && (
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }} className="space-y-4 max-w-lg">
            <h3 className="text-title-sm text-m3-on-surface mb-4">Change Password</h3>
            <div><label className={lc}>Current Password</label><input type="password" className={ic} placeholder="••••••••" /></div>
            <div><label className={lc}>New Password</label><input type="password" className={ic} placeholder="Min 8 characters" /></div>
            <div><label className={lc}>Confirm New Password</label><input type="password" className={ic} placeholder="Repeat password" /></div>
            <button type="submit" className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90">Update Password</button>
            <hr className="border-m3-outline-variant my-6" />
            <h3 className="text-title-sm text-m3-on-surface mb-2">Active Sessions</h3>
            <div className="p-3 border border-m3-outline-variant rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MaterialIcon icon="computer" className="text-m3-secondary" />
                <div><p className="text-body-compact text-m3-on-surface">Current Session</p><p className="text-xs text-m3-on-surface-variant">Windows • Chrome • Active now</p></div>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </form>
        )}

        {tab === "Appearance" && (
          <div className="space-y-6 max-w-lg">
            <h3 className="text-title-sm text-m3-on-surface mb-4">Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              {(["light", "dark"] as const).map((t) => (
                <button key={t} onClick={() => { setTheme(t); toast.success(`Switched to ${t} mode`); }}
                  className={`p-4 rounded-xl border-2 transition-all ${theme === t ? "border-m3-primary bg-m3-primary-container" : "border-m3-outline-variant hover:border-m3-secondary"}`}>
                  <MaterialIcon icon={t === "dark" ? "dark_mode" : "light_mode"} size={32} className={theme === t ? "text-m3-on-primary-container" : "text-m3-on-surface-variant"} />
                  <p className={`text-title-sm mt-2 ${theme === t ? "text-m3-on-primary-container" : "text-m3-on-surface-variant"}`}>{t === "dark" ? "Dark" : "Light"} Mode</p>
                </button>
              ))}
            </div>
            <hr className="border-m3-outline-variant" />
            <h3 className="text-title-sm text-m3-on-surface mb-2">Display Density</h3>
            <div className="flex gap-3">
              {["Comfortable", "Compact"].map((d) => (
                <button key={d} className="px-4 py-2 border border-m3-outline-variant rounded-lg text-body-compact hover:bg-m3-surface-variant transition-colors">{d}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
