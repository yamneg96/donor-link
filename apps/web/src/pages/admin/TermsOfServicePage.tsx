import { CheckCircle, Clock, ShieldAlert, Ban, Activity, Scale } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto animate-fade-in pb-20">
      
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <header className="mb-16 max-w-3xl">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Regulatory Document v2.4</span>
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-6 tracking-tight leading-tight">
          Terms of Service
        </h1>
        <p className="text-lg text-secondary leading-relaxed">
          Welcome to DonorLink. These terms govern your professional access to our clinical coordination platform. Please read these medical-legal guidelines with care to ensure compliance and clinical integrity.
        </p>
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-secondary">
          <Clock className="size-4 text-primary" />
          Last Updated: October 24, 2024
        </div>
      </header>

      {/* ── Terms Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
        
        {/* Term 01 */}
        <section className="md:col-span-8 bg-white p-10 rounded-2xl ambient-shadow border border-outline-variant/10">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="text-primary font-headline font-bold text-xl">01</span>
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">User Eligibility & Professional Status</h2>
              <p className="text-secondary mb-6 leading-relaxed text-sm">Access to DonorLink is restricted to verified clinical professionals, organ procurement organizations (OPOs), and transplant center staff. By accessing the platform, you represent that:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary size-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-on-surface">You hold a valid medical license or are an authorized representative of a certified procurement agency.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary size-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-on-surface">You have completed the mandatory HIPAA and data privacy training within your local jurisdiction.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary size-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-on-surface">Your organization maintains an active Service Level Agreement (SLA) with DonorLink.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Contact Card */}
        <section className="md:col-span-4 bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <Activity className="size-10 mb-6 text-white/80" />
            <h3 className="text-xl font-headline font-bold mb-2">Urgent Assistance</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">For immediate clinical navigation support or technical failures during active donation cycles, use the priority channel.</p>
          </div>
          <button className="bg-white text-primary font-bold py-3 px-6 rounded-xl text-sm hover:bg-surface transition-colors shadow-sm">
            Clinical Support 24/7
          </button>
        </section>

        {/* Term 02 */}
        <section className="md:col-span-4 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-primary font-headline font-bold text-xl bg-surface-container-high w-10 h-10 rounded-lg flex items-center justify-center">02</span>
            <h2 className="text-xl font-headline font-bold">Medical Disclaimer</h2>
          </div>
          <p className="text-sm text-secondary leading-relaxed mb-6">DonorLink provides clinical decision support tools, not medical advice. The platform facilitates data exchange and coordination protocols.</p>
          <div className="p-4 bg-primary-container/10 rounded-xl border border-primary/20">
            <p className="text-xs font-bold text-primary flex gap-2">
              <ShieldAlert className="size-4 flex-shrink-0" />
              Clinical judgment of the attending physician shall always supersede platform suggestions.
            </p>
          </div>
        </section>

        {/* Term 03 */}
        <section className="md:col-span-8 bg-white p-10 rounded-2xl ambient-shadow border border-outline-variant/10">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="text-primary font-headline font-bold text-xl">03</span>
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Acceptable Platform Use</h2>
              <p className="text-secondary mb-6 leading-relaxed text-sm">The integrity of the donor registry and coordination logs is paramount. Users are strictly prohibited from:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/5">
                  <Ban className="size-5 text-secondary flex-shrink-0" />
                  <p className="text-xs text-on-surface font-semibold">Exporting de-identified PHI without specific institutional ethics approval.</p>
                </div>
                <div className="flex gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/5">
                  <Ban className="size-5 text-secondary flex-shrink-0" />
                  <p className="text-xs text-on-surface font-semibold">Sharing unique clinical credentials between multiple staff members.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Term 04 & 05 */}
        <section className="md:col-span-6 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-primary font-headline font-bold text-xl bg-surface-container-high w-10 h-10 rounded-lg flex items-center justify-center">04</span>
            <h2 className="text-xl font-headline font-bold">Liability Limits</h2>
          </div>
          <p className="text-secondary text-sm leading-relaxed">DonorLink shall not be held liable for outcomes resulting from clinical delays, logistical failures beyond platform control, or the physiological viability of donor organs. Our liability is limited to the subscription fees paid by the participating institution during the preceding twelve-month period.</p>
        </section>

        <section className="md:col-span-6 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-primary font-headline font-bold text-xl bg-surface-container-high w-10 h-10 rounded-lg flex items-center justify-center">05</span>
            <h2 className="text-xl font-headline font-bold">Dispute Resolution</h2>
          </div>
          <p className="text-secondary text-sm leading-relaxed">Any conflicts arising from these terms shall first be addressed through professional mediation. If mediation fails, disputes shall be settled through binding arbitration in accordance with the American Health Lawyers Association (AHLA) rules, governed by the laws of the State of Delaware.</p>
        </section>

      </div>

      {/* ── Acknowledgment ───────────────────────────────────────────── */}
      <div className="bg-surface-container p-12 rounded-3xl text-center border border-outline-variant/10">
        <Scale className="size-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-headline font-extrabold mb-4 text-on-surface">Acknowledgment of Stewardship</h2>
        <p className="text-secondary max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
          By continuing to use DonorLink, you acknowledge your role as a steward of clinical data and agree to uphold the highest standards of medical ethics and precision.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-gradient-to-br from-primary to-primary-container text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
            Download Legal Copy
          </button>
        </div>
      </div>

    </div>
  );
}
