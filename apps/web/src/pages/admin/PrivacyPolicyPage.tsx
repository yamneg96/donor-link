import { Shield, FileText, Database, Lock, EyeOff, KeyRound } from "lucide-react";
import { cn } from "../../lib/utils";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto animate-fade-in pb-16 flex flex-col lg:flex-row gap-12">
      
      {/* ── Sidebar Navigation ────────────────────────────────────────── */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 space-y-8">
          <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10">
            <h4 className="text-xs uppercase tracking-widest font-bold text-primary mb-6">Contents</h4>
            <ul className="space-y-4">
              {[
                { id: "introduction", label: "Introduction" },
                { id: "collection", label: "Data Collection" },
                { id: "usage", label: "How We Use Data" },
                { id: "hipaa", label: "HIPAA Compliance" },
                { id: "storage", label: "Storage & Security" },
                { id: "rights", label: "User Rights" }
              ].map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm font-bold text-on-surface hover:text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-6 bg-primary-container/10 border-l-4 border-primary rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-bold text-on-surface">Precision Security</p>
                <p className="text-xs text-on-surface-variant mt-1">Last updated: October 24, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div className="flex-grow max-w-4xl space-y-24">
        
        {/* Header */}
        <header>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase mb-4 block">Official Documentation</span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-secondary text-lg leading-relaxed max-w-2xl">
            Commitment to integrity, security, and medical confidentiality in donor coordination.
          </p>
        </header>

        {/* Section 1 */}
        <section id="introduction" className="scroll-mt-32">
          <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">1. Introduction</h2>
          <div className="space-y-4 text-secondary leading-relaxed font-body">
            <p>At DonorLink, we recognize that the data we manage is more than just information—it represents the potential for life-saving medical intervention. This Privacy Policy outlines our rigorous standards for the collection, handling, and protection of Protected Health Information (PHI) and personal data within our coordination ecosystem.</p>
            <p>By utilizing the DonorLink platform, you acknowledge and agree to the practices described in this policy, designed to exceed standard clinical sanctuary requirements.</p>
          </div>
        </section>

        {/* Section 2 (Bento) */}
        <section id="collection" className="scroll-mt-32">
          <div className="bg-white rounded-3xl p-10 ambient-shadow border border-outline-variant/10">
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-8 flex items-center gap-3">
              <FileText className="size-6 text-primary" />
              2. Information We Collect
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Medical Data</span>
                <p className="text-sm text-secondary leading-relaxed">Donor blood types, HLA typing results, medical histories, and organ viability assessments required for clinical matching.</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Logistics Data</span>
                <p className="text-sm text-secondary leading-relaxed">Real-time GPS coordination for organ transport teams, facility arrival timestamps, and courier credentials.</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Professional Identity</span>
                <p className="text-sm text-secondary leading-relaxed">NPI numbers, medical licensing verification, and institutional affiliation data for all coordinating physicians.</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Technical Telemetry</span>
                <p className="text-sm text-secondary leading-relaxed">IP addresses, device fingerprinting, and audit logs to ensure non-repudiation of every clinical decision made.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="usage" className="scroll-mt-32">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-8">3. How We Use Data</h2>
          <div className="space-y-6">
            <div className="flex gap-6 p-6 rounded-2xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                <Database className="size-6 text-tertiary" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface mb-2">Algorithmic Matching</h4>
                <p className="text-secondary text-sm leading-relaxed">Utilizing clinical data to calculate compatibility scores and prioritize organ allocation based on UNOS-compliant metrics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="hipaa" className="scroll-mt-32">
          <div className="p-10 bg-on-surface rounded-3xl text-surface relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-3xl font-extrabold mb-6">4. HIPAA Compliance & The Sanctuary Standard</h2>
              <p className="text-surface/80 leading-relaxed mb-8 text-lg">DonorLink operates as a "Covered Entity" under the Health Insurance Portability and Accountability Act (HIPAA). We employ military-grade encryption for all data at rest and in transit.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="border-l-2 border-primary pl-6">
                  <h5 className="font-bold text-white mb-2">Zero-Trust Architecture</h5>
                  <p className="text-surface/70 text-sm">Every access request is verified at every stage, regardless of user location or network origin.</p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h5 className="font-bold text-white mb-2">End-to-End Encryption</h5>
                  <p className="text-surface/70 text-sm">Clinical notes and PHI are encrypted using AES-256 standards with unique key rotation cycles.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="rights" className="scroll-mt-32">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">5. User Rights & Transparency</h2>
          <p className="text-secondary leading-relaxed mb-8">As a participant in the DonorLink network, you maintain the following rights regarding your digital footprint:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-white rounded-2xl ambient-shadow border border-outline-variant/10 hover:-translate-y-1 transition-transform">
              <EyeOff className="size-6 text-primary mb-4" />
              <h5 className="font-bold text-on-surface mb-2">The Right to Redaction</h5>
              <p className="text-xs text-secondary leading-relaxed">Request removal of non-clinical data once coordination obligations and retention periods have expired.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl ambient-shadow border border-outline-variant/10 hover:-translate-y-1 transition-transform">
              <KeyRound className="size-6 text-primary mb-4" />
              <h5 className="font-bold text-on-surface mb-2">The Right to Audit</h5>
              <p className="text-xs text-secondary leading-relaxed">Request a complete log of all entities who have viewed your professional credentials or coordination activity.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
