import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { 
  Droplets, Mail, Lock, Shield, User as UserIcon, 
  ArrowRight, ArrowLeft, ChevronRight, CheckCircle2,
  Loader2, Smartphone
} from "lucide-react";
import { registerWithEmailSchema, type RegisterWithEmailInput } from "@donorlink/validators";
import { useRegisterWithEmail, useFaydaAuthorize } from "../../hooks/useApi";
import { Button, Input, AlertBanner, Divider } from "../../components/ui";
import { getApiError } from "../../lib/utils";
import { UserRole } from "@donorlink/types";

enum RegisterStep {
  ROLE = 0,
  IDENTITY = 1,
  ACCOUNT = 2
}

export function RegisterPage() {
  const navigate = useNavigate();
  const registerEmail = useRegisterWithEmail();
  const faydaAuth = useFaydaAuthorize();
  
  const [step, setStep] = useState<RegisterStep>(RegisterStep.ROLE);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.DONOR);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<RegisterWithEmailInput>({
    resolver: zodResolver(registerWithEmailSchema),
    defaultValues: { role: UserRole.DONOR },
  });

  const handleFaydaRegister = async () => {
    setError("");
    try {
      const data = await faydaAuth.mutateAsync(selectedRole);
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === RegisterStep.IDENTITY) fieldsToValidate = ["firstName", "lastName", "amharicName"];
    
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onEmailSubmit = async (data: RegisterWithEmailInput) => {
    setError("");
    try {
      // Logic sync: we pass onboardingComplete: false as per your controller
      const res = await registerEmail.mutateAsync({ ...data, role: selectedRole });
      const { needsOnboarding } = res.data.data;
      navigate({ to: needsOnboarding ? "/onboarding" : "/dashboard" });
    } catch (err) {
      setError(getApiError(err));
      setStep(RegisterStep.ACCOUNT); // Keep them on the last step to see errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* ── Aesthetics ────────────────────────────────────────────── */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none opacity-40 dark:opacity-100" />

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="w-full z-50 relative">
        <div className="flex justify-between items-center w-full px-6 sm:px-10 py-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight font-headline">
            <div className="w-10 h-10 clinical-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Droplets className="size-5" />
            </div>
            <span>DonorLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Already have an account?</span>
            <Link to="/login" className="bg-secondary text-foreground text-sm font-bold py-2.5 px-6 rounded-full hover:bg-secondary/80 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col items-center justify-center relative w-full pb-12 z-10 px-6">
        <main className="w-full max-w-xl py-8">
          <div className="bg-card rounded-[2.5rem] p-8 sm:p-12 border border-border shadow-2xl backdrop-blur-sm">
            
            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-12 max-w-xs mx-auto">
              {[RegisterStep.ROLE, RegisterStep.IDENTITY, RegisterStep.ACCOUNT].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s ? "clinical-gradient text-white" : "bg-secondary text-muted-foreground"
                  }`}>
                    {step > s ? <CheckCircle2 className="size-5" /> : s + 1}
                  </div>
                  {s < 2 && <div className={`w-12 h-0.5 mx-2 ${step > s ? "bg-primary" : "bg-secondary"}`} />}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6">
                <AlertBanner message={error} onDismiss={() => setError("")} variant="error" />
              </div>
            )}

            <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-8">
              
              {/* STEP 0: ROLE SELECTOR */}
              {step === RegisterStep.ROLE && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">Choose Your Path</h2>
                    <p className="text-muted-foreground">Select how you intend to use the platform.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { value: UserRole.DONOR, label: "Donor", icon: <Droplets />, desc: "I want to save lives by donating blood." },
                      { value: UserRole.HOSPITAL_ADMIN, label: "Clinician", icon: <Shield />, desc: "I manage hospital stock or donor data." }
                    ].map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value as UserRole)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all group ${
                          selectedRole === role.value 
                          ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                          : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                          selectedRole === role.value ? "clinical-gradient text-white" : "bg-secondary text-muted-foreground"
                        }`}>
                          {role.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{role.label}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 space-y-4">
                    <button
                      type="button"
                      onClick={handleFaydaRegister}
                      disabled={faydaAuth.isPending}
                      className="w-full clinical-gradient text-white font-headline font-bold text-base py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      {faydaAuth.isPending ? <Loader2 className="size-5 animate-spin" /> : <Shield className="size-5" />}
                      Register with Fayda ID
                    </button>
                    <Divider label="OR" className="text-[10px] font-black opacity-30" />
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-4 rounded-2xl font-bold text-sm bg-secondary hover:bg-background transition-all flex items-center justify-center gap-2"
                    >
                      Continue with Email <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: IDENTITY */}
              {step === RegisterStep.IDENTITY && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">Tell us about yourself</h2>
                    <p className="text-muted-foreground">This helps hospitals verify your identity.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input {...register("firstName")} label="First Name" placeholder="Abebe" error={errors.firstName?.message} />
                    <Input {...register("lastName")} label="Last Name" placeholder="Kebede" error={errors.lastName?.message} />
                  </div>
                  
                  <Input 
                    {...register("amharicName")} 
                    label="Amharic Name (Optional)" 
                    placeholder="አበበ ከበደ" 
                    error={errors.amharicName?.message} 
                    className="font-amharic"
                  />

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 rounded-2xl py-4 h-auto">
                      <ArrowLeft className="size-4 mr-2" /> Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="flex-[2] rounded-2xl py-4 h-auto">
                      Next Step <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: ACCOUNT SECURITY */}
              {step === RegisterStep.ACCOUNT && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                  <div className="text-center mb-8">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">Secure Your Account</h2>
                    <p className="text-muted-foreground">Finalize your credentials to join the network.</p>
                  </div>

                  <Input 
                    {...register("email")} 
                    label="Email address" 
                    type="email" 
                    leftIcon={<Mail className="size-4" />} 
                    error={errors.email?.message} 
                  />
                  
                  <Input 
                    {...register("phone")} 
                    label="Phone Number" 
                    type="tel" 
                    placeholder="+251..." 
                    leftIcon={<Smartphone className="size-4" />} 
                    error={errors.phone?.message} 
                  />

                  <Input 
                    {...register("password")} 
                    label="Create Password" 
                    type="password" 
                    leftIcon={<Lock className="size-4" />} 
                    error={errors.password?.message} 
                  />

                  <div className="flex gap-4 pt-6">
                    <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 rounded-2xl py-4 h-auto">
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      loading={registerEmail.isPending} 
                      className="flex-[2] rounded-2xl py-4 h-auto"
                    >
                      Complete Registration
                    </Button>
                  </div>
                </div>
              )}

            </form>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed max-w-sm mx-auto">
            By joining, you agree to our <Link to="/terms" className="text-primary font-bold">Terms</Link> and 
            <Link to="/privacy" className="text-primary font-bold"> Privacy Policy</Link>.
          </p>
        </main>
      </div>
    </div>
  );
}