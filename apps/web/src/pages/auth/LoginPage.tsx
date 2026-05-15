import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { 
  Droplets, Mail, Lock, Fingerprint, Shield, 
  ChevronDown, HelpCircle, Loader2 
} from "lucide-react";
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* ── Background Aesthetics ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 dark:opacity-100" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="w-full z-50 relative">
        <div className="flex justify-between items-center w-full px-6 sm:px-10 py-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight font-headline">
            <div className="w-10 h-10 clinical-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Droplets className="size-5" />
            </div>
            <span className="text-foreground">DonorLink</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/help" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <HelpCircle className="size-4" />
              <span className="hidden sm:inline">Help Center</span>
            </Link>
            <Link to="/register" className="clinical-gradient text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col items-center justify-center relative w-full px-6 z-10">
        <main className="w-full max-w-md py-12">
          <div className="bg-card rounded-[2.5rem] p-8 sm:p-10 border border-border shadow-2xl backdrop-blur-sm">
            {/* Branding Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="bg-primary/10 p-4 rounded-2xl mb-4">
                <Droplets className="size-8 text-primary" />
              </div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                Secure clinical portal for donor coordination.
              </p>
            </div>

            {error && (
              <div className="mb-6">
                <AlertBanner message={error} onDismiss={() => setError("")} variant="error" />
              </div>
            )}

            {/* ── Role Selector ────────────────────────────────────────── */}
            <div className="flex bg-secondary/50 rounded-2xl p-1.5 mb-8">
              {(["donor", "hospital_admin"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold font-headline transition-all duration-200 ${
                    selectedRole === role
                      ? "bg-card text-foreground shadow-md ring-1 ring-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {role === "donor" ? "Donor" : "Clinician"}
                </button>
              ))}
            </div>

            {/* ── Primary Action: Fayda Login ─────────────────────────── */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleFaydaLogin}
                disabled={faydaAuth.isPending}
                className="w-full clinical-gradient text-white font-headline font-bold text-base py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {faydaAuth.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <Shield className="size-5" />
                    Sign in with Fayda ID
                  </>
                )}
              </button>

              {selectedRole === "donor" && (
                <button
                  type="button"
                  onClick={handleFaydaLogin}
                  className="w-full bg-secondary border border-border text-foreground font-headline font-semibold text-sm py-4 rounded-2xl hover:bg-background transition-all flex justify-center items-center gap-3 active:scale-[0.98]"
                >
                  <Fingerprint className="size-5 text-primary" />
                  <span>Use Biometric Login</span>
                </button>
              )}
            </div>

            <div className="my-8">
              <Divider label="Or continue with" className="text-muted-foreground/50 uppercase tracking-widest text-[10px] font-bold" />
            </div>

            {/* ── Expandable Traditional Form ──────────────────────────── */}
            {!showEmailForm ? (
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full text-sm text-muted-foreground font-semibold hover:text-primary transition-colors flex items-center justify-center gap-2 group"
              >
                Sign in with email credentials
                <ChevronDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            ) : (
              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <Input
                  {...register("email")}
                  label="Clinical Email"
                  placeholder="dr.smith@hospital.org"
                  type="email"
                  leftIcon={<Mail className="size-4" />}
                  error={errors.email?.message}
                  className="bg-secondary/30 border-border focus:ring-primary/20"
                />
                
                <div className="space-y-1">
                  <Input
                    {...register("password")}
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="size-4" />}
                    error={errors.password?.message}
                    className="bg-secondary/30 border-border focus:ring-primary/20"
                  />
                  <div className="flex justify-end">
                    <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  loading={loginEmail.isPending} 
                  className="w-full py-4 rounded-2xl font-headline font-bold"
                  size="lg"
                >
                  Confirm Identity
                </Button>
              </form>
            )}

            <div className="mt-10 text-center text-sm text-muted-foreground">
              New to the sanctuary?{" "}
              <Link to="/register" className="font-bold text-primary hover:underline underline-offset-4">
                Register now
              </Link>
            </div>
          </div>

          {/* ── Footer Trust Marks ───────────────────────────────────── */}
          <div className="mt-8 flex justify-center items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <Shield className="size-3.5 text-primary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Lock className="size-3.5" />
              <span>AES-256 Encrypted</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}