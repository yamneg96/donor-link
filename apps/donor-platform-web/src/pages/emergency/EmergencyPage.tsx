

export function EmergencyPage() {
  return (
    <div className="flex flex-col gap-xl">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-background mb-xs">Emergency Mobilization Center</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Active critical regional shortages requiring immediate donor deployment.</p>
      </div>

      {/* Urgent Broadcast Banner */}
      <div className="bg-error-container border border-error/20 rounded p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-lg shadow-sm">
        <div className="flex items-start sm:items-center gap-lg">
          <div className="bg-error text-on-error p-sm rounded-full shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-error-container font-bold">Critical Shortage: O-Negative</h2>
            <p className="font-body-md text-body-md text-on-error-container mt-xs">Regional supply below 12 hours. Immediate donations required to stabilize trauma centers.</p>
          </div>
        </div>
        <button type="button" className="bg-error text-on-error font-label-caps text-label-caps uppercase tracking-wider px-xl py-md rounded hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap font-semibold">
          Pledge Now
        </button>
      </div>

      {/* Operations Bento Canvas Grid Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Left Column: Flow Mapping & Facility Status (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          
          {/* Map & Live Logistics Status Bento Module */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col h-[400px] relative group shadow-sm">
            {/* Full-bleed Stylized Digital Map Framework Background */}
            <div 
              className="absolute inset-0 bg-surface-dim z-0" 
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmodY4blIr2zGJL3_nA4WNvXVBqda6JJyU6vtG7zfjypwubFoIm4Ia6wNKhUchdSLzaI7AGc4pNffEyA_dIGAzPUo0Iq-cTf2YuGtW-ttL9Az7ndLqxEouC13XKw83Mdwtf86M18Zsv9qz-qeFCrQHEHjDFw1dnXSpwG66UXlRu_OH4qekopYoRTGSefZnwNLyIPKgSqkoYZIlf53O6ajA-V2AkwFbeiSCwFtXVl2j_mjrNAfKVQGCpp3K2I8WyTNCANCmu2UAOijf')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
            </div>
            
            {/* Map Interaction Controls Hud Overlay */}
            <div className="relative z-10 p-lg flex justify-between items-start pointer-events-none w-full">
              <div className="bg-surface/70 backdrop-blur-md border border-outline-variant/40 px-lg py-sm rounded-full flex items-center gap-sm pointer-events-auto shadow-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">my_location</span>
                <span className="font-data-mono text-data-mono text-on-surface">Seattle Metro Area</span>
              </div>
              <div className="flex flex-col gap-sm pointer-events-auto">
                <button type="button" className="bg-surface/70 backdrop-blur-md border border-outline-variant/40 p-sm rounded-full hover:bg-surface transition-colors text-on-surface shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </button>
                <button type="button" className="bg-surface/70 backdrop-blur-md border border-outline-variant/40 p-sm rounded-full hover:bg-surface transition-colors text-on-surface shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">zoom_out</span>
                </button>
              </div>
            </div>
            
            {/* Live Infrastructure Tracking Feed Footer Panel */}
            <div className="mt-auto relative z-10 p-md w-full">
              <div className="bg-surface/70 backdrop-blur-md border border-outline-variant/40 rounded p-md flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-md">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                  </div>
                  <span className="font-data-mono text-data-mono text-on-surface">Live Routing: Mobile Unit 4 dispatched to Downtown Core</span>
                </div>
                <span className="font-data-mono text-data-mono text-outline text-xs">Just now</span>
              </div>
            </div>
          </div>

          {/* Active Shortages Near You Structured Table List */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-outline text-[20px]">local_hospital</span>
                Active Shortages Near You
              </h3>
              <button type="button" className="font-label-caps text-label-caps text-primary hover:underline uppercase tracking-wide">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="font-label-caps text-label-caps text-on-surface-variant py-sm px-md font-bold uppercase tracking-wider">Facility</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant py-sm px-md font-bold uppercase tracking-wider">Distance</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant py-sm px-md font-bold uppercase tracking-wider">Need Level</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant py-sm px-md font-bold uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-data-mono text-xs text-on-surface divide-y divide-outline-variant/30">
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-md px-md text-on-surface font-medium">Mercy General Hospital</td>
                    <td className="py-md px-md text-on-surface-variant">2.4 mi</td>
                    <td className="py-md px-md">
                      <span className="inline-flex items-center px-sm py-0.5 rounded bg-error/10 text-error font-label-caps text-[10px] font-bold border border-error/20">CRITICAL</span>
                    </td>
                    <td className="py-md px-md text-right">
                      <button type="button" className="border border-outline text-on-surface px-md py-sm rounded text-label-caps uppercase text-[10px] hover:bg-surface-container-low transition-colors font-semibold">Route</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-md px-md text-on-surface font-medium">Northside Trauma Center</td>
                    <td className="py-md px-md text-on-surface-variant">5.1 mi</td>
                    <td className="py-md px-md">
                      <span className="inline-flex items-center px-sm py-0.5 rounded bg-secondary/10 text-on-secondary-container font-label-caps text-[10px] font-bold border border-secondary/20">HIGH</span>
                    </td>
                    <td className="py-md px-md text-right">
                      <button type="button" className="border border-outline text-on-surface px-md py-sm rounded text-label-caps uppercase text-[10px] hover:bg-surface-container-low transition-colors font-semibold">Route</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-md px-md text-on-surface font-medium">Mobile Unit - Westlake</td>
                    <td className="py-md px-md text-on-surface-variant">1.2 mi</td>
                    <td className="py-md px-md">
                      <span className="inline-flex items-center px-sm py-0.5 rounded bg-tertiary/10 text-tertiary font-label-caps text-[10px] font-bold border border-tertiary/20">MODERATE</span>
                    </td>
                    <td className="py-md px-md text-right">
                      <button type="button" className="border border-outline text-on-surface px-md py-sm rounded text-label-caps uppercase text-[10px] hover:bg-surface-container-low transition-colors font-semibold">Route</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Supply Analytical Metrics & Checklist Controls (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter w-full">
          
          {/* Dynamic Regional Supply Deficit Stat Counter Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg flex flex-col justify-center items-center text-center shadow-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase tracking-wider">Regional Supply Deficit</span>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-error font-extrabold tracking-tight">42</span>
              <span className="font-body-md text-body-md text-on-surface-variant font-medium">units</span>
            </div>
            {/* Linear Progress Metric Framework */}
            <div className="w-full bg-surface-container-high h-2 rounded-full mt-md overflow-hidden">
              <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
            </div>
            <span className="font-body-sm text-body-sm text-outline mt-sm font-medium">Target: 200 units safe baseline</span>
          </div>

          {/* Rapid Response Direct Profile Match Engagement Card */}
          <div className="bg-primary text-on-primary rounded p-lg shadow-sm flex flex-col">
            <h3 className="font-headline-sm text-headline-sm mb-sm font-bold">Your Blood Type is Needed</h3>
            <p className="font-body-sm text-body-sm opacity-90 mb-xl leading-relaxed">Based on your profile, your specific donation can directly impact the current shortage at Mercy General.</p>
            <div className="mt-auto flex flex-col gap-md">
              <button type="button" className="w-full bg-on-primary text-primary font-label-caps text-label-caps uppercase tracking-widest py-md rounded hover:bg-surface-container-low transition-colors font-bold active:scale-[0.99]">
                Confirm Availability Now
              </button>
              <button type="button" className="w-full border border-on-primary/30 text-on-primary font-label-caps text-label-caps uppercase tracking-widest py-md rounded hover:bg-on-primary/10 transition-colors font-semibold active:scale-[0.99]">
                Schedule for Later Today
              </button>
            </div>
          </div>

          {/* Mobilization Interactive Preparation Checklist */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm font-bold">
              <span className="material-symbols-outlined text-outline text-[20px]">checklist</span>
              Mobilization Prep
            </h3>
            <ul className="flex flex-col gap-lg">
              <li className="flex items-start gap-md">
                <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer" type="checkbox" id="hydrate" />
                <label htmlFor="hydrate" className="flex flex-col cursor-pointer select-none">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">Hydrate intensely</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Drink 16oz of water before arriving.</span>
                </label>
              </li>
              <li className="flex items-start gap-md">
                <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer" type="checkbox" id="meal" />
                <label htmlFor="meal" className="flex flex-col cursor-pointer select-none">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">Eat a hardy meal</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Focus on iron-rich foods 2 hours prior.</span>
                </label>
              </li>
              <li className="flex items-start gap-md">
                <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer" type="checkbox" id="id-card" />
                <label htmlFor="id-card" className="flex flex-col cursor-pointer select-none">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">Bring Physical ID</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Required for emergency rapid-processing.</span>
                </label>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}