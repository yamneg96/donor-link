import { Link } from "@tanstack/react-router";
import { MaterialIcon } from "../components/shared/MaterialIcon";
import { usePublicStats } from "../hooks/useApi";

const LIFECYCLE = [
  { icon: "favorite", label: "Donor", desc: "Generous individuals give life.", color: "bg-m3-primary-fixed text-m3-primary" },
  { icon: "bloodtype", label: "Blood Bank", desc: "Processing and secure storage.", color: "bg-m3-secondary-fixed text-m3-secondary" },
  { icon: "inventory_2", label: "Inventory", desc: "National real-time tracking.", color: "bg-m3-tertiary-fixed text-m3-tertiary" },
  { icon: "local_hospital", label: "Hospital", desc: "Strategic redistribution.", color: "bg-m3-secondary-fixed text-m3-secondary" },
  { icon: "personal_injury", label: "Patient", desc: "Life-saving transfusion.", color: "bg-m3-primary-fixed text-m3-primary" },
];

export default function LandingPage() {
  const { data: stats } = usePublicStats();

  const STATS = [
    { 
      label: "National Blood Units", 
      value: stats?.totalUnits?.toLocaleString() ?? "0", 
      icon: "water_drop", 
      status: stats?.totalUnits > 5000 ? "STABLE INVENTORY" : "LOW INVENTORY", 
      statusColor: stats?.totalUnits > 5000 ? "bg-green-500" : "bg-orange-500" 
    },
    { 
      label: "Active Transfers", 
      value: stats?.activeTransfers?.toLocaleString() ?? "0", 
      icon: "local_shipping", 
      status: "EN ROUTE", 
      statusColor: "bg-blue-500 animate-pulse" 
    },
    { 
      label: "Critical Shortages", 
      value: stats?.criticalShortages?.toLocaleString() ?? "0", 
      icon: "warning", 
      status: stats?.criticalShortages > 0 ? "ACTION REQUIRED" : "NO CRITICAL ALERTS", 
      statusColor: stats?.criticalShortages > 0 ? "bg-m3-on-primary-container" : "bg-green-500", 
      isAlert: stats?.criticalShortages > 0 
    },
  ];
  return (
    <div className="min-h-screen bg-m3-surface flex flex-col">
      {/* TopNavBar */}
      <header className="bg-m3-surface-container-highest border-b border-m3-outline-variant sticky top-0 z-50 flex justify-between items-center h-16 px-6">
        <span className="text-display-lg text-m3-primary text-2xl">DonorLink</span>
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#mission" className="text-body-main text-m3-primary font-bold border-b-2 border-m3-primary py-2">Mission</a>
          <a href="#stats" className="text-body-main text-m3-on-surface-variant hover:bg-m3-surface-variant transition-colors py-2 px-2 rounded">Stats</a>
          <a href="#flow" className="text-body-main text-m3-on-surface-variant hover:bg-m3-surface-variant transition-colors py-2 px-2 rounded">Flow</a>
          <a href="#partners" className="text-body-main text-m3-on-surface-variant hover:bg-m3-surface-variant transition-colors py-2 px-2 rounded">Partners</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="bg-m3-primary text-m3-on-primary text-title-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold"
          >
            Staff Portal
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero */}
        <section id="mission" className="relative w-full overflow-hidden bg-m3-surface-container-low min-h-[500px] flex items-center justify-center py-8 px-4">
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{
            backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-display-lg text-m3-on-surface">Intelligent Blood Infrastructure for Ethiopia</h1>
            <p className="text-headline-md text-m3-on-surface-variant max-w-2xl mx-auto text-xl">
              Coordinating supply, anticipating shortages, and directing life-saving resources where they are needed most.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link to="/register" className="bg-m3-primary text-m3-on-primary text-title-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
                Join the Mission
              </Link>
              <a href="#stats" className="bg-transparent border-2 border-m3-secondary text-m3-secondary text-title-sm px-8 py-3 rounded-lg hover:bg-m3-surface-variant transition-colors">
                Explore Network
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="py-8 px-4 max-w-[1440px] mx-auto">
          <div className="mb-6">
            <h2 className="text-headline-md text-m3-on-surface">National Real-Time Status</h2>
            <p className="text-body-main text-m3-on-surface-variant">Live operational metrics from the national blood supply chain.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-6 shadow-ambient-md flex flex-col justify-between h-[180px] ${
                  stat.isAlert
                    ? "bg-m3-primary-container border border-m3-primary"
                    : "bg-m3-surface-container-lowest border border-m3-outline-variant"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-title-sm ${stat.isAlert ? "text-m3-on-primary-container" : "text-m3-on-surface-variant"}`}>{stat.label}</span>
                  <MaterialIcon icon={stat.icon} filled className={stat.isAlert ? "text-m3-on-primary-container" : "text-m3-primary"} />
                </div>
                <div>
                  <div className={`text-display-lg ${stat.isAlert ? "text-m3-on-primary-container" : "text-m3-on-surface"}`}>{stat.value}</div>
                  <div className={`text-label-caps mt-1 flex items-center gap-1 ${stat.isAlert ? "text-m3-on-primary-container" : "text-m3-secondary"}`}>
                    <span className={`w-2 h-2 rounded-full ${stat.statusColor}`} />
                    {stat.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lifecycle */}
        <section id="flow" className="py-8 px-4 max-w-[1440px] mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-headline-md text-m3-on-surface">The Lifeblood Lifecycle</h2>
            <p className="text-body-main text-m3-on-surface-variant max-w-2xl mx-auto">
              From the moment of donation to the critical point of care, we track and optimize every step.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-m3-outline-variant -translate-y-1/2 z-0" />
            {LIFECYCLE.map((step) => (
              <div key={step.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-4 shadow-sm z-10 w-full md:w-1/5 text-center flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color.split(" ")[0]}`}>
                  <MaterialIcon icon={step.icon} className={step.color.split(" ")[1]} size={28} />
                </div>
                <h3 className="text-title-sm text-m3-on-surface">{step.label}</h3>
                <p className="text-body-compact text-m3-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-4 max-w-[1440px] mx-auto">
          <div className="bg-m3-primary-container text-center rounded-xl py-12 px-8 shadow-md">
            <h2 className="text-headline-md text-m3-on-primary-container mb-3">Your Donation Saves Lives</h2>
            <p className="text-body-main text-m3-on-primary-container opacity-90 max-w-2xl mx-auto mb-6">
              Join the thousands of heroes across Ethiopia who are making a difference every day.
            </p>
            <Link to="/register" className="bg-m3-on-primary-container text-m3-primary-container text-title-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-block">
              Become a Donor Today
            </Link>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-8 px-4 max-w-[1440px] mx-auto text-center">
          <h2 className="text-headline-md text-m3-on-surface mb-2">Trusted by National Partners</h2>
          <p className="text-body-main text-m3-on-surface-variant mb-6">A collaborative effort to strengthen healthcare infrastructure.</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {[
              { icon: "account_balance", label: "Ministry of Health" },
              { icon: "health_and_safety", label: "WHO" },
              { icon: "medication", label: "Ethiopian Red Cross" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-title-sm text-m3-on-surface">
                <MaterialIcon icon={p.icon} />
                {p.label}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-m3-surface-dim border-t border-m3-outline-variant flex flex-col items-center py-6 px-8 gap-4 mt-auto">
        <div className="text-title-sm text-m3-on-surface">DonorLink</div>
        <div className="flex flex-wrap justify-center gap-4">
          {["Privacy Policy", "Operational Standards", "Contact Command Center", "Regional Directories"].map((link) => (
            <a key={link} href="#" className="text-label-caps text-m3-on-surface-variant hover:text-m3-primary transition-opacity">{link}</a>
          ))}
        </div>
        <p className="text-label-caps text-m3-secondary text-center max-w-2xl">
          © 2024 DonorLink Ethiopia National Blood Infrastructure. In partnership with WHO & Ethiopia Red Cross.
        </p>
      </footer>
    </div>
  );
}