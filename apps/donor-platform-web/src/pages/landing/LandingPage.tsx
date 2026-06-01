import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col pb-16 md:pb-0">
      
      {/* Emergency Banner */}
      <div className="bg-error-container text-on-error-container px-margin py-sm flex items-center justify-center border-b border-error/20 text-center w-full">
        <div className="max-w-container-max mx-auto flex items-center justify-center gap-sm px-sm w-full">
          <span className="material-symbols-outlined filled text-[20px] text-error flex-shrink-0">warning</span>
          <span className="font-body-md font-semibold text-sm md:text-base leading-normal whitespace-normal tracking-normal text-left sm:text-center">
            Critical Shortage: O-Negative blood is urgently needed in your area.{' '}
            <button onClick={() => navigate('/centers')} className="underline font-bold hover:text-error transition-colors inline">
              Schedule now.
            </button>
          </span>
        </div>
      </div>

      {/* TopAppBar */}
      <header className="bg-surface w-full top-0 sticky border-b border-outline-variant flex items-center justify-between px-margin py-sm z-50 backdrop-blur-md bg-surface/90">
        <div className="flex items-center gap-sm min-w-0 flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-[24px] flex-shrink-0">bloodtype</span>
          <span className="font-headline-md text-headline-md font-bold text-primary truncate whitespace-nowrap">Lifeline Donor</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-lg items-center min-w-0">
          <a className="text-primary font-body-lg flex items-center gap-xs hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded whitespace-nowrap" href="#">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Home
          </a>
          <a className="text-on-surface-variant font-body-lg flex items-center gap-xs hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded whitespace-nowrap" href="#">
            <span className="material-symbols-outlined text-[18px]">query_stats</span>
            Impact
          </a>
          <button onClick={() => navigate('/dashboard')} className="text-on-surface-variant font-body-lg flex items-center gap-xs hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">water_drop</span>
            Donate
          </button>
          <button onClick={() => navigate('/centers')} className="text-on-surface-variant font-body-lg flex items-center gap-xs hover:bg-surface-container-low transition-colors duration-200 px-sm py-xs rounded whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            Centers
          </button>
        </nav>

        {/* Actions / Auth tokens */}
        <div className="flex items-center gap-sm flex-shrink-0">
          <button className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors duration-200 flex-shrink-0">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button onClick={() => navigate('/login')} className="font-label-caps text-on-surface-variant hover:text-primary transition-colors text-sm px-2 py-1 whitespace-nowrap flex-shrink-0">
            Login
          </button>
        </div>
      </header>

      <main className="flex-grow w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img 
            className="absolute inset-0 w-full h-full object-cover z-0" 
            alt="Medical professional holding patient hand during a blood transfusion process" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJy6gFmjt1WT__C7JXE4M6Vs8GCteX2Oltyddv0L7kcRK6W8VB0gBSrrM9krz9dr4rMUC-9UXEfvTgL1ZSRb-Yxl0dIl9UP2n31ZokTdjNYiYPUuTTGKRVZP_yx3GEB1dapElZbZPQCWYAW1KXJT8Gp-aC2V25hyfSNgzDOTgUtOQYL_z2Mxz8OQKRcpHI21r2A2Yp69yVMJX94Ai6VEvZ0XUPNoYRQvXUC5vqu2V7t4iem0k-Au6jz8MpNCVsKJwGob478RhU5qO8"
          />
          
          <div className="relative z-20 text-center px-margin max-w-3xl flex flex-col items-center w-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full tibeb-overlay z-0 opacity-[0.03] pointer-events-none"></div>
            
            <h1 className="font-headline-lg text-3xl md:text-headline-lg text-on-primary mb-lg tracking-tight relative z-10 w-full whitespace-normal px-2">
              Your Blood Has the Power to <span className="italic text-primary-fixed block sm:inline">Save Lives</span>
            </h1>
            <p className="font-body-lg text-sm md:text-body-lg text-on-primary/90 mb-xl relative z-10 w-full whitespace-normal px-2 leading-relaxed">
              Join thousands of heroes locally managing national blood drives, receiving critical push notifications for severe shortages, and tracking their lifetime gallo-impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 relative z-10 justify-center">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-on-primary font-headline-sm px-xl py-md rounded-lg transition-all duration-300 shadow-sm border border-primary-fixed-dim/20 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              >
                Start My Journey
              </button>
              <button 
                onClick={() => navigate('/centers')} 
                className="w-full sm:w-auto bg-surface-container-high/20 backdrop-blur-sm text-on-primary border border-outline-variant rounded-lg px-xl py-md text-base font-headline-sm hover:bg-surface-container-high/40 transition-all duration-300 whitespace-nowrap"
              >
                Find Local Drives
              </button>
            </div>
          </div>
        </section>

        {/* Global Wrapper for layout containment */}
        <div className="max-w-container-max mx-auto px-margin py-xl flex flex-col gap-xl w-full">
          
          {/* Impact Metrics Bento Grid */}
          <section className="py-4 w-full">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg border-b border-outline-variant pb-xs w-full whitespace-normal">
              Community Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter w-full">
              {/* Metric 1 */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col items-start justify-between shadow-sm min-h-[140px] w-full min-w-0">
                <div className="w-full flex justify-between items-center mb-md gap-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase truncate">Active Donors</span>
                  <span className="material-symbols-outlined text-secondary flex-shrink-0">groups</span>
                </div>
                <div className="font-headline-lg text-4xl md:text-[48px] leading-none text-primary font-bold tracking-tight py-2 whitespace-nowrap w-full overflow-hidden">45k+</div>
                <div className="font-body-sm text-on-surface-variant mt-sm flex items-center gap-xs w-full whitespace-normal">
                  <span className="material-symbols-outlined text-[16px] text-secondary flex-shrink-0">check_circle</span>
                  <span className="truncate">Registered in network</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col items-start justify-between shadow-sm min-h-[140px] w-full min-w-0">
                <div className="w-full flex justify-between items-center mb-md gap-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase truncate">Cold-Chain Reliability</span>
                  <span className="material-symbols-outlined text-secondary flex-shrink-0">ac_unit</span>
                </div>
                <div className="font-headline-lg text-4xl md:text-[48px] leading-none text-primary font-bold tracking-tight py-2 whitespace-nowrap w-full overflow-hidden">99.8%</div>
                <div className="font-body-sm text-on-surface-variant mt-sm flex items-center gap-xs w-full whitespace-normal">
                  <span className="material-symbols-outlined text-[16px] text-secondary flex-shrink-0">trending_up</span>
                  <span className="truncate">Optimal logistics safety</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col items-start justify-between shadow-sm min-h-[140px] w-full min-w-0">
                <div className="w-full flex justify-between items-center mb-md gap-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase truncate">Avg SOS Response Time</span>
                  <span className="material-symbols-outlined text-secondary flex-shrink-0">speed</span>
                </div>
                <div className="font-headline-lg text-4xl md:text-[48px] leading-none text-primary font-bold tracking-tight py-2 whitespace-nowrap w-full overflow-hidden">72h</div>
                <div className="font-body-sm text-on-surface-variant mt-sm flex items-center gap-xs w-full whitespace-normal">
                  <span className="material-symbols-outlined text-[16px] text-error flex-shrink-0">priority_high</span>
                  <span className="truncate">Critical window turnaround</span>
                </div>
              </div>
            </div>
          </section>

          {/* Center Finder Segment */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-lg w-full">
            <div className="lg:col-span-5 flex flex-col justify-center bg-surface-container p-xl rounded-xl border border-outline-variant shadow-sm w-full min-w-0">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md whitespace-normal">Locate a Center</h2>
              <p className="font-body-md text-on-surface-variant mb-lg whitespace-normal leading-relaxed">
                Find the nearest donation center or upcoming mobile drive. Walk-ins are welcome, but appointments help us save more lives faster.
              </p>
              <div className="space-y-md w-full">
                <div className="flex flex-col gap-xs w-full">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">Zip Code or City</label>
                  <div className="relative w-full">
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded p-sm font-data-mono text-data-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" 
                      placeholder="Enter location..." 
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant flex-shrink-0">search</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-sm pt-2 w-full">
                  <button 
                    onClick={() => navigate('/centers')} 
                    className="flex-1 bg-primary text-on-primary font-headline-sm py-sm rounded-lg border border-transparent hover:bg-primary/90 transition-colors text-center text-sm font-medium whitespace-nowrap"
                  >
                    Search Centers
                  </button>
                  <button className="flex-1 bg-surface border border-outline text-on-surface font-headline-sm py-sm rounded-lg hover:bg-surface-container-low transition-colors text-center text-sm font-medium whitespace-nowrap">
                    View Map
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 h-[280px] sm:h-[350px] lg:h-auto rounded-xl border border-outline-variant overflow-hidden relative shadow-sm w-full">
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Digital map layout indicating regional system demands" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALqxLBbJ4On6AseTiRzW4jqpf4UMDtC_FPdQ28iSMJJjIYw3gyhQR6py5EtD91ujLOKMBOYhyVKyqBQKWiNTJmpflw3PeaVuvT0u8eBACRtui6tOxuWtUv7mqQDPHjL1s2M4qCkflGWHkzIGoDBEh2nOSOQTriwni9uPSdNulixzFY52gFifMe8r0l2qqrTTe_R7d-RRoVaBKBDzoUSrpq07Rqhad5h4CYUYU3h05YJgofe9K0fQBFrnlqN-V_oeUy-wwKER3zcQtq"
              />
              <div className="absolute bottom-sm right-sm bg-surface/90 backdrop-blur-sm border border-outline-variant p-sm rounded shadow-sm flex items-center gap-xs z-20">
                <span className="w-3 h-3 rounded-full bg-error block flex-shrink-0"></span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase whitespace-nowrap">High Demand</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-high py-10 mt-auto border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left w-full">
          <div className="font-headline-sm text-on-surface-variant font-bold text-lg whitespace-nowrap">Lifeline Donor</div>
          <p className="font-body-sm text-outline whitespace-normal">An initiative within the DonorLink National Blood Logistics network.</p>
        </div>
      </footer>
    </div>
  );
}