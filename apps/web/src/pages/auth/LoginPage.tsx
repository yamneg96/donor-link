import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { Droplets, Mail, Lock, Fingerprint, ArrowRight, Shield, ChevronDown } from "lucide-react";
import { loginWithEmailSchema, type LoginWithEmailInput } from "@donorlink/validators";
import { useLoginWithEmail, useFaydaAuthorize } from "../../hooks/useApi";
import { Button, Input, AlertBanner, Divider } from "../../components/ui";
import { getApiError } from "../../lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const loginEmail = useLoginWithEmail();
  const faydaAuth = useFaydaAuthorize();
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"donor" | "hospital_admin">("donor");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginWithEmailInput>({
    resolver: zodResolver(loginWithEmailSchema),
  });

  const handleFaydaLogin = async () => {
    setError("");
    try {
      const data = await faydaAuth.mutateAsync(selectedRole);
      // Redirect to Fayda eSignet
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const onEmailSubmit = async (data: LoginWithEmailInput) => {
    setError("");
    try {
      const res = await loginEmail.mutateAsync(data);
      const { needsOnboarding } = res.data.data;
      navigate({ to: needsOnboarding ? "/onboarding" : "/dashboard" });
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: "#f8f9ff" }}>
      {/* ── Decorative Background Blobs ──────────────────────────────── */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pulse/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="w-full z-50 relative">
        <div className="flex justify-between items-center w-full px-6 sm:px-10 py-6 max-w-[1440px] mx-auto">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-midnight tracking-tight font-headline">
            <div className="w-9 h-9 primary-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
              <Droplets className="size-4" />
            </div>
            <span>DonorLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/register" className="primary-gradient text-white font-body text-sm font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-opacity btn-glow">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col items-center justify-center relative w-full">
        <main className="w-full max-w-md px-6 py-12 relative z-10">
          <div className="bg-white rounded-3xl ambient-shadow p-8 sm:p-10" style={{ border: "1px solid rgba(230, 189, 184, 0.15)" }}>
            {/* Branding Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="bg-pulse/10 p-3 rounded-full mb-4">
                <Droplets className="size-7 text-pulse" />
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-midnight mb-2 tracking-tight">Welcome Back</h1>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                Sign in to coordinate and manage critical medical data securely.
              </p>
            </div>

            {error && (
              <div className="mb-5">
                <AlertBanner message={error} onDismiss={() => setError("")} />
              </div>
            )}

            {/* ── Role Selector ────────────────────────────────────────── */}
            <div className="flex bg-surface-container-low rounded-xl p-1 mb-6">
              {([
                { value: "donor", label: "Donor" },
                { value: "hospital_admin", label: "Clinician" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-headline transition-all ${
                    selectedRole === value
                      ? "bg-white text-midnight shadow-sm"
                      : "text-secondary hover:text-midnight"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Primary: Fayda Login ─────────────────────────────────── */}
            <button
              type="button"
              onClick={handleFaydaLogin}
              disabled={faydaAuth.isPending}
              className="w-full primary-gradient text-white font-headline font-bold text-base py-3.5 rounded-xl btn-glow hover:opacity-95 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {faydaAuth.isPending ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <Shield className="size-5" />
                  Sign in with Fayda National ID
                </>
              )}
            </button>

            {/* ── Biometric Option ─────────────────────────────────────── */}
            {selectedRole === "donor" && (
              <button
                type="button"
                onClick={handleFaydaLogin}
                className="w-full mt-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-midnight font-headline font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 flex justify-center items-center gap-2"
              >
                <Fingerprint className="size-5 text-tertiary" />
                <span>Use Biometric Login</span>
              </button>
            )}

            {/* ── Divider ──────────────────────────────────────────────── */}
            <div className="my-6">
              <Divider label="Or" />
            </div>

            {/* ── Expandable Email/Password Form ──────────────────────── */}
            {!showEmailForm ? (
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full text-sm text-secondary font-semibold font-body hover:text-midnight transition-colors flex items-center justify-center gap-1"
              >
                Sign in with email & password
                <ChevronDown className="size-4" />
              </button>
            ) : (
              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4 animate-fade-in">
                <Input
                  {...register("email")}
                  label="Email address"
                  placeholder="you@hospital.org"
                  type="email"
                  leftIcon={<Mail className="size-4" />}
                  error={errors.email?.message}
                  autoComplete="email"
                />
                <div>
                  <Input
                    {...register("password")}
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="size-4" />}
                    error={errors.password?.message}
                    autoComplete="current-password"
                  />
                  <div className="text-right mt-1.5">
                    <a className="font-body text-xs font-semibold text-pulse hover:text-pulse-deep transition-colors" href="#">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <Button type="submit" loading={loginEmail.isPending} className="w-full" size="lg">
                  <Mail className="size-4" />
                  Sign In with Email
                </Button>
              </form>
            )}

            {/* ── Register Link ────────────────────────────────────────── */}
            <div className="mt-8 text-center font-body text-sm text-on-surface-variant">
              New to DonorLink?{" "}
              <Link to="/register" className="font-semibold text-pulse hover:text-pulse-deep transition-colors">
                Register now
              </Link>
            </div>
          </div>

          {/* ── Trust Signals ──────────────────────────────────────────── */}
          <div className="mt-8 flex justify-center items-center gap-6 text-xs font-body text-secondary">
            <div className="flex items-center gap-1.5">
              <Shield className="size-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-outline-variant" />
            <div className="flex items-center gap-1.5">
              <Lock className="size-4" />
              <span>Encrypted</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}