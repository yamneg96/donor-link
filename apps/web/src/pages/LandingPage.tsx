import { Link } from "@tanstack/react-router";
import {
  Droplets, ArrowRight, Heart, Users, Zap,
  Shield, Lock, ClipboardList, Search, Truck,
  Activity, MapPin, Clock,
} from "lucide-react";

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen font-body text-on-surface antialiased" style={{ backgroundColor: "#f8f9ff" }}>
      {/* ── Top Navigation ──────────────────────────────────────────── */}
      <nav className="bg-white fixed top-0 w-full z-50 font-headline">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-12 h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 primary-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
              <Droplets className="size-4" />
            </div>
            <span className="text-2xl font-black text-on-surface tracking-tight">DonorLink</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 text-sm font-semibold">
            <a href="#platform" className="text-primary border-b-2 border-primary pb-1">Platform</a>
            <a href="#impact" className="text-secondary hover:text-on-surface transition-colors">Impact</a>
            <a href="#how-it-works" className="text-secondary hover:text-on-surface transition-colors">Network</a>
            <a href="#footer" className="text-secondary hover:text-on-surface transition-colors">Resources</a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="hidden lg:block text-secondary hover:text-on-surface font-medium text-sm transition-colors"
            >
              Clinician Portal
            </Link>
            <Link
              to="/register"
              className="primary-gradient text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity btn-glow"
            >
              Register as Donor
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* ── Hero Section ───────────────────────────────────────────── */}
        <section id="platform" className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div className="space-y-8 pr-0 lg:pr-12">
              <div className="inline-flex items-center space-x-2 bg-surface-container-high px-4 py-1.5 rounded-full text-sm font-medium text-tertiary">
                <Activity className="size-4" />
                <span>Rapid Coordination Network</span>
              </div>

              <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface leading-[1.08] tracking-tight">
                Precision matching when every minute matters.
              </h1>

              <p className="text-lg text-on-surface-variant font-body leading-relaxed max-w-lg">
                DonorLink provides an editorial-grade clinical sanctuary for medical professionals
                and donors to coordinate life-saving transfers with absolute clarity and empathy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/register"
                  className="primary-gradient text-white px-8 py-4 rounded-full font-headline font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 btn-glow"
                >
                  <span>Become a Donor</span>
                  <ArrowRight className="size-5" />
                </Link>
                <Link
                  to="/login"
                  className="bg-surface-container-high text-on-surface px-8 py-4 rounded-full font-headline font-semibold text-lg hover:bg-surface-container-highest transition-colors flex items-center justify-center"
                >
                  Request Help
                </Link>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="relative h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden bg-surface-container-low ambient-shadow">
              {/* Abstract gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high opacity-90" />
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-tertiary/10 rounded-full blur-[60px]" />

              {/* Central icon cluster */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center ambient-shadow">
                    <Droplets className="size-16 text-primary" />
                  </div>
                  {/* Orbiting elements */}
                  <div className="absolute -top-6 -right-6 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse-slow">
                    <Heart className="size-6 text-primary" />
                  </div>
                  <div className="absolute -bottom-4 -left-8 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse-slow" style={{ animationDelay: "1s" }}>
                    <MapPin className="size-5 text-tertiary" />
                  </div>
                  <div className="absolute top-1/2 -right-16 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse-slow" style={{ animationDelay: "2s" }}>
                    <Clock className="size-4 text-secondary" />
                  </div>
                </div>
              </div>

              {/* Floating Data Card — glassmorphic */}
              <div className="absolute bottom-8 left-8 right-8 glass-strong p-6 rounded-xl ghost-border flex items-center space-x-6">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <Activity className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant font-body">Current Status</p>
                  <p className="font-headline font-bold text-on-surface text-xl">Network Optimal</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-on-surface-variant font-body">Active Matches</p>
                  <p className="font-headline text-primary font-bold text-xl">2,419</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works (Bento Grid) ─────────────────────────────── */}
        <section id="how-it-works" className="bg-surface-container-low py-32 rounded-t-[3rem]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface">Seamless Coordination</h2>
              <p className="text-on-surface-variant text-lg font-body">
                A streamlined 3-step process designed to remove friction from high-stakes medical logistics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-10 ambient-shadow hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-tertiary mb-8">
                  <ClipboardList className="size-6" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">1. Register Profile</h3>
                <p className="text-on-surface-variant font-body leading-relaxed text-sm">
                  Securely verify your identity via Fayda National ID. Your information is parsed
                  with clinical precision for immediate matching eligibility.
                </p>
              </div>

              {/* Step 2 — elevated */}
              <div className="bg-white rounded-3xl p-10 ambient-shadow hover:-translate-y-1 transition-transform duration-300 md:-translate-y-6">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary mb-8">
                  <Search className="size-6" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">2. Algorithmic Match</h3>
                <p className="text-on-surface-variant font-body leading-relaxed text-sm">
                  Our proprietary system cross-references critical markers, prioritizing urgency
                  and geographical feasibility to suggest optimal pairings.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-10 ambient-shadow hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-tertiary mb-8">
                  <Truck className="size-6" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">3. Rapid Deployment</h3>
                <p className="text-on-surface-variant font-body leading-relaxed text-sm">
                  Once confirmed, logistics are instantly coordinated with medical facilities,
                  establishing a clear, uninterrupted chain of custody.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Impact Statistics ──────────────────────────────────────── */}
        <section id="impact" className="py-32" style={{ backgroundColor: "#f8f9ff" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="max-w-xl space-y-6">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface">Measurable Impact</h2>
              <p className="text-on-surface-variant text-lg font-body leading-relaxed">
                Beyond the numbers, every statistic represents a family kept whole.
                Our network's efficiency directly correlates with positive clinical outcomes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
              <div className="bg-surface-container-low p-8 rounded-3xl min-w-[200px]">
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2 font-body">Lives Impacted</p>
                <p className="font-headline text-5xl font-black text-primary">14,290</p>
              </div>
              <div className="bg-surface-container-low p-8 rounded-3xl min-w-[200px]">
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2 font-body">Active Donors</p>
                <p className="font-headline text-5xl font-black text-tertiary">85.4K</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Fayda Trust Section ────────────────────────────────────── */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface">Verified by Fayda National ID</h2>
              <p className="text-on-surface-variant text-lg font-body">
                Every donor is authenticated through Ethiopia's national identity system,
                ensuring trust, safety, and compliance with Proclamation 1284/2023.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 ambient-shadow text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <Shield className="size-6" />
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Biometric Verification</h3>
                <p className="text-sm text-on-surface-variant font-body">
                  Donors verify identity through fingerprint or iris scan via eSignet.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 ambient-shadow text-center">
                <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mx-auto mb-6">
                  <Lock className="size-6" />
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Privacy by Design</h3>
                <p className="text-sm text-on-surface-variant font-body">
                  Pairwise identifiers prevent cross-sector tracking. No FIN stored.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 ambient-shadow text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <Zap className="size-6" />
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Instant KYC</h3>
                <p className="text-sm text-on-surface-variant font-body">
                  Name, DOB, and gender are fetched directly from verified government records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────────── */}
        <section className="py-24" style={{ backgroundColor: "#f8f9ff" }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-8">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface">
              Every donation saves three lives.
            </h2>
            <p className="text-on-surface-variant text-lg font-body max-w-2xl mx-auto">
              Join Ethiopia's growing network of verified blood donors. Register in under 2 minutes
              using your Fayda National ID.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/register"
                className="primary-gradient text-white px-10 py-4 rounded-full font-headline font-bold text-lg hover:opacity-90 transition-opacity btn-glow inline-flex items-center justify-center gap-2"
              >
                <Heart className="size-5" />
                Register Now
              </Link>
              <Link
                to="/login"
                className="bg-surface-container-high text-on-surface px-10 py-4 rounded-full font-headline font-semibold text-lg hover:bg-surface-container-highest transition-colors inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer id="footer" className="bg-white py-16 border-t border-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-white">
              <Droplets className="size-4" />
            </div>
            <span className="font-headline font-bold text-xl text-on-surface">DonorLink</span>
          </div>

          <div className="flex flex-wrap justify-center space-x-8 text-sm font-medium text-on-surface-variant">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/guidelines" className="hover:text-primary transition-colors">Clinical Guidelines</Link>
          </div>

          <p className="text-xs text-secondary font-body">
            © {new Date().getFullYear()} DonorLink Sanctuary. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}