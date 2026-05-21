import { Link } from "@tanstack/react-router";
import { MaterialIcon } from "../components/shared/MaterialIcon";
import { usePublicStats } from "../hooks/useApi";
import { useTheme } from "../components/theme-provider";
import { cn } from "../lib/utils";
import { useState } from "react";

const LIFECYCLE = [
  { icon: "favorite", label: "Donor", desc: "Generous individuals give life.", color: "bg-m3-primary-container text-m3-on-primary-container" },
  { icon: "bloodtype", label: "Blood Bank", desc: "Processing and secure storage.", color: "bg-m3-secondary-container text-m3-on-secondary-container" },
  { icon: "inventory_2", label: "Inventory", desc: "National real-time tracking.", color: "bg-m3-tertiary-container text-m3-on-tertiary-container" },
  { icon: "local_hospital", label: "Hospital", desc: "Strategic redistribution.", color: "bg-m3-secondary-container text-m3-on-secondary-container" },
  { icon: "personal_injury", label: "Patient", desc: "Life-saving transfusion.", color: "bg-m3-primary-container text-m3-on-primary-container" },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const { data: stats } = usePublicStats();
  const [activeNav, setActiveNav] = useState('mission');

  const navLinks = [
    { id: 'mission', label: 'Mission' },
    { id: 'stats', label: 'Stats' },
    { id: 'flow', label: 'Flow' },
    { id: 'partners', label: 'Partners' },
  ];

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
    <div className="min-h-screen bg-m3-surface flex flex-col transition-colors duration-300">
      {/* TopNavBar */}
      <header className="bg-m3-surface-container-highest border-b border-m3-outline-variant sticky top-0 z-50 flex justify-between items-center h-16 px-4 md:px-6">
        <span className="font-heading text-xl md:text-2xl font-bold text-m3-primary tracking-tight">DonorLink</span>
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveNav(link.id)}
                className={`
                  text-body-main py-2 transition-all 
                  ${isActive 
                    ? 'text-m3-primary font-bold border-b-2 border-m3-primary' 
                    : 'text-m3-on-surface-variant hover:bg-m3-surface-variant px-3 rounded-lg'
                  }
                `}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors flex items-center justify-center"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <MaterialIcon icon={theme === "dark" ? "light_mode" : "dark_mode"} size={22} />
          </button>
          <Link
            to="/login"
            className="bg-m3-primary text-m3-on-primary rounded-lg hover:opacity-90 transition-opacity text-xs md:text-sm font-semibold shadow-sm px-3 py-2 md:px-4 md:py-2 flex items-center gap-1.5 whitespace-nowrap"
          >
            <MaterialIcon icon="login" size={16} />
            <span className="hidden sm:inline">Staff Portal</span>
            <span className="inline sm:hidden">Staff</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero */}
        <section id="mission" className="relative w-full overflow-hidden bg-m3-surface-container-low min-h-[600px] flex items-center justify-center py-8 px-4">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              alt="National Blood Coordination Map" 
              className="w-full h-full object-cover opacity-20 mix-blend-multiply" 
              data-alt="A highly professional and clean top-down view of a modern logistics and medical coordination center map. The visual is abstract yet clearly operational, showing glowing red routing lines connecting various regional hubs across a stylized map of Ethiopia. The aesthetic is corporate modern, using a light, clinical palette of crisp whites and subtle grays, sharply contrasted by intense, deep blood red indicators and routing vectors. The mood conveys precision, authority, and life-saving urgency."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfybez_hLdsWE4zyLITF-DZyC-5XhbT6xaPG4kFDvalQl2gMJkqLiwosxup7vy0f-wdWyrvvCcm84kWtM_JrsdJJInQxdBnsJGYnPBUnRmJ7YFppg7nmq29iIaUEmvUUpZ3cCEYs7MF1Q7I5LcWso52zcjrKfrfPjLYDDL1O-8TvWHN2RDqbBBhMc4iXM8lvSYEdq6NfnikFUXslDz_-2fz66DnIymdGdjuBxFkcV0_kK3EMhufFJ8PSqcvc9Z1CRK8mQ2Z85EAPA"
            />
          </div>
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
              <div key={step.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-sm z-10 w-full md:w-1/5 text-center flex flex-col items-center gap-3 transition-transform hover:scale-105">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-sm", step.color.split(" ")[0])}>
                  <MaterialIcon icon={step.icon} className={step.color.split(" ")[1]} size={32} />
                </div>
                <h3 className="text-title-sm text-m3-on-surface font-bold">{step.label}</h3>
                <p className="text-body-compact text-m3-on-surface-variant text-sm">{step.desc}</p>
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
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/support" className="text-label-caps text-m3-on-surface-variant hover:text-m3-primary transition-colors">Operational Standards</Link>
          <Link to="/support" className="text-label-caps text-m3-on-surface-variant hover:text-m3-primary transition-colors">Regional Directories</Link>
          <Link to="/contact" className="text-label-caps text-m3-on-surface-variant hover:text-m3-primary transition-colors font-bold">Contact Command Center</Link>
          <a href="#" className="text-label-caps text-m3-on-surface-variant hover:text-m3-primary transition-colors">Privacy Policy</a>
        </div>
        <p className="text-label-caps text-m3-secondary text-center max-w-2xl">
          © 2024 DonorLink Ethiopia National Blood Infrastructure. In partnership with WHO & Ethiopia Red Cross.
        </p>
      </footer>
    </div>
  );
}