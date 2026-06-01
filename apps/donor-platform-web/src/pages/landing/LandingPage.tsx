import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-body-md text-on-surface">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-margin md:px-xl py-lg sticky top-0 bg-surface/90 backdrop-blur-md z-40 border-b border-outline-variant">
        <div className="font-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_1</span>
            Lifeline Donor
        </div>
        <div className="flex gap-4">
           <button onClick={() => navigate('/login')} className="font-label-caps text-on-surface-variant hover:text-primary transition-colors">Login</button>
           <button onClick={() => navigate('/dashboard')} className="font-label-caps bg-primary text-on-primary px-4 py-2 rounded shadow hover:bg-surface-tint transition-colors">Join the Cause</button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-container-max mx-auto px-margin md:px-xl py-xl flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-20 flex flex-col items-center text-center max-w-3xl relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full tibeb-overlay z-0 opacity-[0.03]"></div>
           <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface leading-tight mb-6 relative z-10">
             Your Blood Has the Power to <span className="text-primary italic">Save Lives</span>
           </h1>
           <p className="font-body-lg text-on-surface-variant mb-10 relative z-10">
             Join thousands of heroes locally managing national blood drives, receiving critical push notifications for severe shortages, and tracking their lifetime gallo-impact directly from their profile.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 relative z-10">
             <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-primary text-on-primary rounded text-lg font-headline-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
               Start My Journey
             </button>
             <button onClick={() => navigate('/centers')} className="px-8 py-3 bg-surface-container-high text-on-surface-variant border border-outline-variant rounded text-lg font-headline-sm hover:bg-surface-dim transition-all duration-300">
               Find Local Drives
             </button>
           </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
               <div className="flex flex-col gap-2 p-6">
                  <span className="font-display-lg text-primary text-5xl">45k+</span>
                  <span className="font-label-md text-outline uppercase tracking-wider">Active Donors</span>
               </div>
               <div className="flex flex-col gap-2 p-6 border-y md:border-y-0 md:border-x border-outline-variant">
                  <span className="font-display-lg text-primary text-5xl">99.8%</span>
                  <span className="font-label-md text-outline uppercase tracking-wider">Cold-Chain Reliability</span>
               </div>
               <div className="flex flex-col gap-2 p-6">
                  <span className="font-display-lg text-primary text-5xl">72h</span>
                  <span className="font-label-md text-outline uppercase tracking-wider">Avg SOS Response Time</span>
               </div>
            </div>
        </section>
      </main>

      <footer className="w-full bg-surface-container-high py-10 mt-auto">
        <div className="max-w-container-max mx-auto px-margin md:px-xl flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="font-headline-sm text-on-surface-variant font-bold text-lg">Lifeline Donor</div>
           <p className="font-body-sm text-outline">An initiative within the DonorLink National Blood Logistics network.</p>
        </div>
      </footer>
    </div>
  );
}
