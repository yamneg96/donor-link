import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-20 border-b border-outline-variant/10">
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 md:px-10 h-full">
          <div className="font-headline-lg text-xl md:text-2xl font-extrabold text-primary tracking-tight select-none">
            DonorLink Hospital Portal
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a className="font-label-md text-sm text-primary font-bold border-b-2 border-primary py-2 transition-all duration-300" href="#solutions">Solutions</a>
            <a className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-300" href="#inventory">Inventory</a>
            <a className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-300" href="#logistics">Logistics</a>
            <a className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-300" href="#partners">Partners</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              Portal Login
            </button>
            <button className="bg-primary hover:bg-secondary text-on-primary font-label-md text-sm px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm font-semibold active:scale-[0.98]">
              Request Demo
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-32 md:pb-40 bg-surface">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10 flex flex-col items-start">
              <span className="inline-block py-1 px-3 bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-semibold rounded-full mb-6">
                Enterprise Infrastructure
              </span>
              <h1 className="font-headline-lg text-4xl md:text-5xl text-on-surface mb-6 leading-tight tracking-tight">
                Blood Logistics for National Healthcare Infrastructure
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                Optimize your hospital's blood bank operations with real-time inventory tracking, ML-powered forecasting, and seamless regional transfers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button className="bg-primary text-on-primary font-label-md text-sm font-semibold px-8 py-4 rounded-lg hover:bg-secondary transition-all shadow-md active:scale-95 text-center">
                  Schedule a Demo
                </button>
                <button className="bg-surface-container-high text-on-surface font-label-md text-sm font-semibold px-8 py-4 rounded-lg hover:bg-surface-container-highest transition-all text-center">
                  View Platform Specs
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="shadow-lg shadow-primary/5 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low">
                <img 
                  alt="Laboratory logistics interface" 
                  className="w-full h-auto object-cover max-h-[420px]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSkeFjJOa88ijU-8-j2qqm0a8I0cKqQ7Nell-yL0-LtlPoLJTE8TG8kdgnTG1CSdxpoMo1j3SkmVRtBfZ9yT4awC1dXoE4GdCUqAuu9i4PP6M0tcNJDQNOHOL5_vXlHR2pn2napNZYcWvNeIchBwWxzCfuI2W3IvrUcX7tTXiJynOnAUOb8e-_PPhay9FcAQQKfVmrdz5tmqM-2kGnccGEduXoAFXeLOmP5BzuX6PoZRHVBuuRSy5VsIrFJj9KwjIe6OD_W5iM0gHu"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Operational Metrics */}
        <section className="bg-surface-container-lowest border-y border-outline-variant/20 py-12">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-outline-variant/30">
              <div className="text-center md:px-8">
                <div className="font-headline-lg text-5xl text-primary font-black mb-1">15%</div>
                <div className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">Reduction in Wastage</div>
              </div>
              <div className="text-center md:px-8">
                <div className="font-headline-lg text-5xl text-primary font-black mb-1">42m</div>
                <div className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg. Fulfill Time</div>
              </div>
              <div className="text-center md:px-8">
                <div className="font-headline-lg text-5xl text-primary font-black mb-1">100%</div>
                <div className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cold Chain Compliance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Solutions Dashboard Hooks */}
        <section id="solutions" className="py-24 bg-surface">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4 tracking-tight font-bold">
                Precision Logistics Solutions
              </h2>
              <p className="font-body-md text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Enterprise-grade tools designed for the critical nature of blood supply chain management.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Solution 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">dashboard</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4">Command Center</h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed flex-grow">
                  Unified visibility into regional stock levels and facility capacity with live data orchestration.
                </p>
                <ul className="space-y-3 pt-2 border-t border-outline-variant/20">
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Multi-facility monitoring
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Capacity forecasting
                  </li>
                </ul>
              </div>

              {/* Solution 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4">Intelligent Forecasting</h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed flex-grow">
                  Predictive analytics to prevent shortages before they occur using hospital-specific usage patterns.
                </p>
                <ul className="space-y-3 pt-2 border-t border-outline-variant/20">
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    ML-driven demand models
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Shortage risk alerts
                  </li>
                </ul>
              </div>

              {/* Solution 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4">Logistics Network</h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed flex-grow">
                  Real-time tracking and temperature monitoring for every unit in transit across your network.
                </p>
                <ul className="space-y-3 pt-2 border-t border-outline-variant/20">
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    IoT temperature sensors
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Live route optimization
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Proof Frame Segment */}
        <section id="partners" className="py-16 bg-surface-container-low overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
            <p className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-12">
              Trusted by National Health Infrastructures
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-3xl">health_and_safety</span>
                <span className="font-headline-md text-lg font-bold text-on-surface">Mayo Clinic</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-3xl">domain</span>
                <span className="font-headline-md text-lg font-bold text-on-surface">NHS England</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-3xl">emergency</span>
                <span className="font-headline-md text-lg font-bold text-on-surface">Mount Sinai</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-3xl">apartment</span>
                <span className="font-headline-md text-lg font-bold text-on-surface">Kaiser Permanente</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Compliance Security Elements */}
        <section id="inventory" className="py-24 bg-surface">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-6 font-bold tracking-tight">
                Security & Clinical Standards
              </h2>
              <p className="font-body-md text-base text-on-surface-variant mb-8 leading-relaxed">
                DonorLink maintains the highest tier of medical data security and clinical regulatory compliance. Our platform is built on zero-trust architecture, ensuring patient privacy and product integrity at every touchpoint.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                  <div>
                    <div className="font-label-md text-sm font-semibold text-on-surface">AABB Certified</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Quality Standards</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-2xl">security</span>
                  <div>
                    <div className="font-label-md text-sm font-semibold text-on-surface">HIPAA & SOC2</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Data Privacy</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="rounded-2xl overflow-hidden border border-outline-variant/10 shadow-xl bg-surface-container-low">
                <img 
                  alt="Server security visualization" 
                  className="w-full h-80 object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGbwyxaHipzDBuk15U2h7qP03JjjtIRiaOW8IcKK52qUZ1OTewGLjqHgCf94exMyet1wKVvtkir2jEv8I0YIvnEq2bWUjEW-W-Y1vYMxQX2MJHuDPijtzyrhQ_SDdyVNAA6HBES5gACZHgmTzESb-64V218WDPdejCqNaphaWYqDeKfLHupX2dV6g6uz4tI_PQ2jQggZxIiM5g7PE0GAb2cDHLqGgyodtoQSjNcreFA0lTp2ifKQxXGgrQPiCc6c41DgJWRWzG-GyQ"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final Outbound CTA Banner */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center relative z-10">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-primary mb-8 font-bold tracking-tight">
              Ready to modernize your blood operations?
            </h2>
            <button className="bg-surface text-primary font-label-md text-sm font-bold px-12 py-5 rounded-lg hover:bg-surface-bright transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]">
              Contact Sales
            </button>
          </div>
        </section>
      </main>

      {/* Global Application Footer */}
      <footer className="bg-inverse-surface text-on-inverse-surface py-12 w-full border-t border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-headline-md text-xl font-bold text-surface-bright mb-2">DonorLink</div>
            <p className="font-body-md text-sm text-surface-variant max-w-sm leading-relaxed">
              &copy; 2026 DonorLink Healthcare Systems. All rights reserved. Clinical excellence in blood logistics.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-body-md text-xs text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Privacy Policy</a>
            <a className="font-body-md text-xs text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Terms of Service</a>
            <a className="font-body-md text-xs text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Security Compliance</a>
            <a className="font-body-md text-xs text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}