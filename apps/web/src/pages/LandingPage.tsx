import { Link } from '@tanstack/react-router';
import React from 'react';

const LandingPage = () => {
  return (
    <div className="selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-background/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-border shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-10 py-6">
          <div className="text-2xl font-extrabold tracking-tighter text-foreground font-headline">
            DonorLink
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary border-b-2 border-primary pb-1 font-headline font-bold tracking-tight text-sm uppercase" href="#">Process</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors font-headline font-bold tracking-tight text-sm uppercase" href="#">Impact</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors font-headline font-bold tracking-tight text-sm uppercase" href="#">Testimonials</a>
            <a className="text-muted-foreground hover:text-foreground transition-colors font-headline font-bold tracking-tight text-sm uppercase" href="#">Network</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to='/login' className="text-muted-foreground hover:text-foreground font-headline font-bold tracking-tight text-sm uppercase transition-all active:scale-95">Login</Link>
            <Link to='/register' className="clinical-gradient px-6 py-3 rounded-full text-white font-headline font-bold tracking-tight text-sm uppercase shadow-lg shadow-primary/20 transition-all active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 md:px-10">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-20 grayscale" 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80" 
              alt="Medical facility"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              Real-Time Coordination
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight mb-8 tracking-tighter font-headline">
              Precision matching when <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">every minute matters.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light">
              The world's most advanced donor-recipient ecosystem. Leveraging high-fidelity clinical data and algorithmic speed to bridge the gap between need and hope.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="clinical-gradient px-10 py-5 rounded-xl text-white font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                Become a Donor
              </button>
              <button className="bg-secondary px-10 py-5 rounded-xl text-foreground font-bold text-lg border border-border hover:bg-background/80 transition-all active:scale-95">
                Request Help
              </button>
            </div>
          </div>
        </section>

        {/* Measurable Impact Section (Stats) */}
        <section className="py-24 px-6 md:px-10 bg-secondary/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'volunteer_activism', val: '14,290', label: 'Lives Impacted' },
              { icon: 'groups', val: '85.4K', label: 'Active Donors' },
              { icon: 'speed', val: '2.4m', label: 'Avg. Match Time' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-10 rounded-2xl relative group transition-all duration-300">
                <span className="material-symbols-outlined text-4xl text-primary mb-4 block">{stat.icon}</span>
                <div className="text-4xl font-extrabold text-foreground mb-2 font-headline">{stat.val}</div>
                <div className="text-muted-foreground font-medium tracking-wide uppercase text-xs">{stat.label}</div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Seamless Coordination Section */}
        <section className="py-32 px-6 md:px-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight font-headline">Seamless Coordination</h2>
              <p className="text-muted-foreground max-w-xl text-lg">Efficiency is our primary directive. Our three-stage deployment model ensures zero friction.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: '01', title: 'Register Profile', desc: 'Comprehensive clinical data integration. We build a precise biological profile.' },
                { num: '02', title: 'Algorithmic Match', desc: 'Our proprietary engine analyzes thousands of variables in milliseconds.' },
                { num: '03', title: 'Rapid Deployment', desc: 'Immediate mobilization of logistics and medical personnel. Our sanctuary handles it.' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col h-full group">
                  <div className="text-8xl font-black text-foreground/5 mb-[-2.5rem] z-0 font-headline">{step.num}</div>
                  <div className="glass-card p-10 rounded-2xl z-10 flex-grow border-t-4 border-t-primary shadow-xl">
                    <h3 className="text-xl font-bold text-foreground mb-4 font-headline">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        </section>

        {/* Testimonials */}
        <section className="py-32 px-6 md:px-10 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-foreground mb-4 font-headline">Voices from the Sanctuary</h2>
              <p className="text-muted-foreground">Trusted by the world's leading medical practitioners.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Dr. Julian Vane', role: 'Chief of Surgery', img: '1', text: '"The speed of DonorLink saves hours we used to lose to administrative lag."' },
                { name: 'Sarah Jenkins', role: 'Coordinator', img: '2', text: '"The clarity of the interface provides a calm sanctuary in a chaotic environment."' },
                { name: 'Marcus Chen', role: 'Administrator', img: '3', text: '"The most secure and ethical coordination tool we have ever deployed."' }
              ].map((item, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border border-border hover:border-primary/40 transition-all shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/20" />
                    <div>
                      <div className="text-foreground font-bold font-headline">{item.name}</div>
                      <div className="text-muted-foreground text-[10px] uppercase tracking-tighter">{item.role}</div>
                    </div>
                  </div>
                  <p className="text-foreground/80 italic font-light leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-6 md:px-10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto bg-card border border-border rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
            <h2 className="text-4xl font-extrabold text-foreground mb-6 font-headline">Ready to make an impact?</h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto">Join the largest network of clinicians and donors working together.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="clinical-gradient px-12 py-5 rounded-full text-white font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">Join the Network</button>
              <button className="bg-secondary hover:bg-background px-12 py-5 rounded-full text-foreground font-bold text-lg border border-border active:scale-95 transition-all">Contact Us</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-border px-6 md:px-10 bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-lg font-bold text-foreground font-headline">DonorLink Clinical Sanctuary</div>
            <div className="text-xs leading-relaxed text-muted-foreground mt-2">© 2024 DonorLink. All rights reserved.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'HIPAA'].map((item) => (
              <a key={item} className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest" href="#">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;