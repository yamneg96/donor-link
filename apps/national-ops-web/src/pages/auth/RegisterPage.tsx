import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { useRegister } from "../../hooks/useApi";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const register = useRegister();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    try {
      await register.mutateAsync({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone, role: form.role || undefined });
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-m3-surface text-m3-on-surface min-h-screen flex flex-col justify-center items-center p-4">
      <main className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 bg-m3-surface-container-lowest border border-m3-outline-variant shadow-sm rounded-xl overflow-hidden">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-m3-surface-container-high p-8 border-r border-m3-outline-variant relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <MaterialIcon icon="medical_services" className="text-[300px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="bloodtype" className="text-m3-primary text-[32px]" />
              <h1 className="text-display-lg text-m3-primary">DonorLink</h1>
            </div>
            <h2 className="text-headline-md text-m3-on-surface mb-4">National Blood Infrastructure</h2>
            <p className="text-body-main text-m3-on-surface-variant">
              Secure staff onboarding for the Ethiopian Blood Services operational network.
            </p>
          </div>
          <div className="relative z-10 bg-m3-surface-container p-6 rounded-lg border border-m3-outline-variant">
            <div className="flex items-center gap-3 mb-2">
              <MaterialIcon icon="security" filled className="text-m3-secondary" />
              <span className="text-title-sm text-m3-on-surface">Secure Registration</span>
            </div>
            <p className="text-body-compact text-m3-on-surface-variant">
              All access is logged and verified against the national operational registry.
            </p>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-headline-md text-m3-on-surface">Staff Initialization</h2>
            <p className="text-body-compact text-m3-on-surface-variant mt-1">Step {step} of 2: {step === 1 ? "Personnel Details" : "Security Setup"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-m3-primary" : "bg-m3-surface-container-highest"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-m3-primary" : "bg-m3-surface-container-highest"}`} />
            </div>

            {error && (
              <div className="bg-m3-error-container/20 border border-m3-error p-3 rounded flex items-center gap-2">
                <MaterialIcon icon="error" size={18} className="text-m3-error" />
                <p className="text-body-compact text-m3-error">{error}</p>
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-caps text-m3-on-surface-variant mb-1">First Name</label>
                    <div className="relative">
                      <MaterialIcon icon="person" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-outline" />
                      <input value={form.firstName} onChange={set("firstName")} required placeholder="Abebe" className="w-full pl-10 pr-3 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-caps text-m3-on-surface-variant mb-1">Last Name</label>
                    <input value={form.lastName} onChange={set("lastName")} required placeholder="Kebede" className="w-full px-3 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-label-caps text-m3-on-surface-variant mb-1">Official Email</label>
                  <div className="relative">
                    <MaterialIcon icon="mail" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-outline" />
                    <input value={form.email} onChange={set("email")} required type="email" placeholder="name@ebs.gov.et" className="w-full pl-10 pr-3 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-label-caps text-m3-on-surface-variant mb-1">Phone (Optional)</label>
                  <input value={form.phone} onChange={set("phone")} placeholder="+251 9XX XXX XXXX" className="w-full px-3 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main transition-colors" />
                </div>
                <div>
                  <label className="block text-label-caps text-m3-on-surface-variant mb-1">Operational Role</label>
                  <div className="relative">
                    <MaterialIcon icon="admin_panel_settings" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-outline" />
                    <select value={form.role} onChange={set("role")} className="w-full pl-10 pr-8 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main appearance-none transition-colors">
                      <option value="">Select assigned role...</option>
                      <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                      <option value="LAB_STAFF">Lab Staff</option>
                      <option value="DISPATCHER">Dispatcher</option>
                      <option value="DONOR_COORDINATOR">Donor Coordinator</option>
                    </select>
                    <MaterialIcon icon="arrow_drop_down" className="absolute right-3 top-1/2 -translate-y-1/2 text-m3-outline pointer-events-none" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-2">
                  <Link to="/login" className="text-body-compact text-m3-secondary hover:text-m3-on-surface transition-colors flex items-center gap-1">
                    <MaterialIcon icon="arrow_back" size={16} />
                    <span>Cancel</span>
                  </Link>
                  <button type="button" onClick={() => setStep(2)} className="bg-m3-primary text-m3-on-primary text-title-sm py-3 px-8 rounded hover:opacity-90 transition-opacity flex items-center gap-2">
                    <span>Continue</span>
                    <MaterialIcon icon="arrow_forward" size={18} />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-label-caps text-m3-on-surface-variant mb-1">Password</label>
                  <div className="relative">
                    <MaterialIcon icon="key" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-primary" />
                    <input value={form.password} onChange={set("password")} required type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" className="w-full pl-10 pr-3 py-3 bg-m3-surface-container-highest border border-m3-primary rounded focus:ring-2 focus:ring-m3-primary font-mono text-data-mono tracking-widest transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-label-caps text-m3-on-surface-variant mb-1">Confirm Password</label>
                  <div className="relative">
                    <MaterialIcon icon="key" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-primary" />
                    <input value={form.confirmPassword} onChange={set("confirmPassword")} required type="password" placeholder="Re-enter password" className="w-full pl-10 pr-3 py-3 bg-m3-surface-container-highest border border-m3-primary rounded focus:ring-2 focus:ring-m3-primary font-mono text-data-mono tracking-widest transition-colors" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="text-body-compact text-m3-secondary hover:text-m3-on-surface transition-colors flex items-center gap-1">
                    <MaterialIcon icon="arrow_back" size={16} /><span>Back</span>
                  </button>
                  <button type="submit" disabled={register.isPending} className="bg-m3-primary text-m3-on-primary text-title-sm py-3 px-8 rounded hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
                    {register.isPending ? "Creating..." : "Create Account"}
                    <MaterialIcon icon="arrow_forward" size={18} />
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>

      <footer className="mt-8 text-center">
        <p className="text-label-caps text-m3-on-surface-variant">
          © 2024 DonorLink Ethiopia National Blood Infrastructure. In partnership with WHO & Ethiopia Red Cross.
        </p>
      </footer>
    </div>
  );
}