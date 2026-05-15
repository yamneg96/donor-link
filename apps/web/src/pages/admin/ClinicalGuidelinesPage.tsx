import { CheckCircle, Microscope, Truck, ShieldCheck, HeartPulse, Stethoscope, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ClinicalGuidelinesPage() {
  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto animate-fade-in pb-16 flex flex-col lg:flex-row gap-12">
      
      {/* ── Sidebar Navigation ────────────────────────────────────────── */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 space-y-2">
          <h3 className="font-headline font-extrabold text-on-surface text-xs uppercase tracking-[0.2em] mb-6 px-4">Documentation</h3>
          <nav className="space-y-1">
            {[
              { id: "eligibility", icon: ShieldCheck, label: "Donor Eligibility" },
              { id: "matching", icon: Microscope, label: "Cross-Matching" },
              { id: "logistics", icon: Truck, label: "Transport Logistics" },
            ].map((item, idx) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group",
                  idx === 0 ? "bg-surface-container-low text-primary" : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <item.icon className={cn("size-5 transition-colors", idx === 0 ? "text-primary" : "text-secondary group-hover:text-primary")} />
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
          
          <div className="mt-12 p-6 rounded-xl bg-surface-container-high border border-outline-variant/10">
            <p className="text-xs text-secondary leading-relaxed">
              Last Updated: <span className="font-bold text-on-surface">October 24, 2024</span><br/>
              Revision v4.12.0
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div className="flex-grow max-w-4xl space-y-24">
        
        {/* Header */}
        <header>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase mb-4 block">Professional Resource</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
            Clinical Coordination & Procurement Guidelines
          </h1>
          <p className="text-secondary text-lg leading-relaxed max-w-2xl">
            Our comprehensive medical standards designed to ensure patient safety, biological viability, and ethical excellence throughout the transplant and transfusion journey.
          </p>
        </header>

        {/* Hero Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-white ambient-shadow border border-outline-variant/10">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-6">
              <Stethoscope className="size-6" />
            </div>
            <h3 className="font-headline font-bold text-xl mb-3">Critical Intervention Protocol</h3>
            <p className="text-secondary text-sm leading-relaxed">Immediate steps required when a potential donor is identified in a Level 1 Trauma Center.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white ambient-shadow border border-outline-variant/10">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-6">
              <HeartPulse className="size-6" />
            </div>
            <h3 className="font-headline font-bold text-xl mb-3">Real-time Viability Monitoring</h3>
            <p className="text-secondary text-sm leading-relaxed">Guidelines for data analysis and continuous viability assessment during transit.</p>
          </div>
        </div>

        {/* Content Section 1 */}
        <section id="eligibility" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface whitespace-nowrap">1. Donor Eligibility Criteria</h2>
            <div className="h-px bg-outline-variant/30 flex-grow" />
          </div>
          <div className="bg-white rounded-2xl p-8 md:p-10 ambient-shadow border border-outline-variant/10">
            <h4 className="font-headline font-bold text-primary text-sm tracking-widest uppercase mb-6">Primary Inclusion Rules</h4>
            <ul className="space-y-6 mb-8">
              <li className="flex gap-4">
                <CheckCircle className="size-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-on-surface text-lg">Standard Blood Donation</p>
                  <p className="text-sm text-secondary leading-relaxed mt-1">Age 17-65, weight ≥50kg, normal hemoglobin levels, no active infections, and cleared medical history.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle className="size-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-on-surface text-lg">Platelet/Plasma Apheresis</p>
                  <p className="text-sm text-secondary leading-relaxed mt-1">Platelet count &gt;150,000/µL, no aspirin in the last 48 hours, suitable venous access.</p>
                </div>
              </li>
            </ul>
            <div className="pt-6 border-t border-surface-container">
              <h4 className="font-headline font-bold text-error text-sm tracking-widest uppercase mb-4">Contraindications</h4>
              <p className="text-sm text-secondary italic">Untreated systemic sepsis, active transmissible viral infections (HIV, Hepatitis B/C), and certain malignancies are absolute exclusion criteria.</p>
            </div>
          </div>
        </section>

        {/* Content Section 2 */}
        <section id="matching" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface whitespace-nowrap">2. Cross-Matching Protocols</h2>
            <div className="h-px bg-outline-variant/30 flex-grow" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <Microscope className="size-6 text-tertiary" />
                <h4 className="font-bold text-lg">Antibody Screening</h4>
              </div>
              <p className="text-sm text-secondary leading-relaxed mb-6">
                Standardized molecular typing and antibody screening. All testing must be performed in approved clinical laboratories.
              </p>
              <div className="bg-surface-container p-4 rounded-xl">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                  <span>Test Reliability</span>
                  <span className="text-primary">99.9% Accuracy</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="w-[99.9%] h-full bg-gradient-to-r from-primary to-primary-container" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <HeartPulse className="size-6 text-tertiary" />
                <h4 className="font-bold text-lg">ABO Verification</h4>
              </div>
              <p className="text-sm text-secondary leading-relaxed mb-6">
                Double-blinded verification of blood groups. The primary coordinator must verify the ABO match before issuing components.
              </p>
              <div className="bg-surface-container p-4 rounded-xl">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                  <span>Verification</span>
                  <span className="text-tertiary">3-Step Check</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="w-full h-full bg-tertiary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section 3 */}
        <section id="logistics" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface whitespace-nowrap">3. Transport Logistics</h2>
            <div className="h-px bg-outline-variant/30 flex-grow" />
          </div>
          <div className="bg-white rounded-2xl p-8 md:p-10 ambient-shadow border border-outline-variant/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Time Constraint</p>
                <p className="text-2xl font-headline font-extrabold">Cold Chain</p>
                <p className="text-sm text-secondary leading-relaxed mt-2">Whole Blood: 21-35 days<br/>Platelets: 5-7 days (agitated)<br/>Plasma: 1 year (frozen)</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Temperature</p>
                <p className="text-2xl font-headline font-extrabold">Thermostability</p>
                <p className="text-sm text-secondary leading-relaxed mt-2">Continuous monitoring between 2°C and 6°C for red cells using validated digital loggers.</p>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-error-container/10 border border-error/20 flex gap-4">
              <AlertTriangle className="size-6 text-error flex-shrink-0" />
              <div>
                <h5 className="font-bold text-error text-sm mb-1">Deviation Protocol</h5>
                <p className="text-sm text-secondary leading-relaxed">
                  Any temperature deviation outside of the 2-6°C range lasting longer than 30 minutes requires immediate quarantine of the blood products and notification to the blood bank director.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
