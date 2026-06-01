import { useQuery } from '@tanstack/react-query';
import { donorApi } from '../../api/donor';

export default function AppointmentsPage() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['donor', 'history'],
    queryFn: donorApi.getHistory,
  });

  return (
    <div className="flex flex-col gap-xl">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-background mb-xs">Schedule Donation</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Select a center and time to book your appointment.</p>
      </div>

      {/* Bento Grid Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Left Column: Flow Canvas Panels */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          
          {/* Step 1: Center Selector Frame */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
            <div className="p-lg border-b border-outline-variant bg-surface flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] fill">location_on</span>
                <h2 className="font-headline-sm text-headline-sm text-on-background">1. Select Center</h2>
              </div>
              <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded">Required</span>
            </div>
            
            <div className="p-0 grid grid-cols-1 md:grid-cols-2">
              {/* Interactive Embedded Map Module Placeholder */}
              <div className="h-48 md:h-auto border-b md:border-b-0 md:border-r border-outline-variant relative bg-surface-dim min-h-[260px]">
                <img 
                  alt="Map showing donation center locations" 
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzbE9-MHGrFZco_PgoOXxb83OaPJ0PZ0Je-6iahxtZmR8lW8TB-dCTFOhse1Gf9GeHEq_3Od3CcjVI2adoak6PnATJIiT7Vh_aIClWbM7NXsmQeCYAso1uEdy7TzzNcHFEzyj1_5-809paYEWd-s0VxaPJtB0lw52ibkLblk8GFgiXvbdoiuMNDXnXLAOq5GRCPFZKjTsf2zy4Ew2URAcTX00UjtjWV2j--CvqQcEqtqJDD-guHjohzOS-FWuEZT4RFlbxKidqW9cp"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/50 to-transparent"></div>
              </div>

              {/* Center List Interactive Group Selection */}
              <div className="p-md flex flex-col gap-sm max-h-[320px] overflow-y-auto">
                {/* Center Item Card Option 1 (Default Sample Focus View) */}
                <label className="flex items-start gap-md p-md rounded border-2 border-primary bg-primary-fixed/20 cursor-pointer transition-colors">
                  <input defaultChecked className="mt-1 text-primary focus:ring-primary" name="center" type="radio" />
                  <div className="flex flex-col">
                    <span className="font-data-mono text-data-mono text-on-background">Downtown Medical Hub</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">1200 4th Ave, Suite 200</span>
                    <div className="flex items-center gap-xs mt-sm">
                      <span className="font-label-caps text-[10px] bg-secondary-fixed text-on-secondary-fixed px-xs py-[2px] rounded">0.8 mi</span>
                      <span className="font-label-caps text-[10px] bg-surface-container-high text-on-surface-variant px-xs py-[2px] rounded flex items-center gap-[2px]">
                        <span className="material-symbols-outlined text-[12px]">local_parking</span> Validated
                      </span>
                    </div>
                  </div>
                </label>

                {/* Center Item Card Option 2 */}
                <label className="flex items-start gap-md p-md rounded border border-outline-variant hover:bg-surface cursor-pointer transition-colors">
                  <input className="mt-1 text-primary focus:ring-primary" name="center" type="radio" />
                  <div className="flex flex-col">
                    <span className="font-data-mono text-data-mono text-on-background">Northside Blood Center</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">850 NE 45th St</span>
                    <div className="flex items-center gap-xs mt-sm">
                      <span className="font-label-caps text-[10px] bg-surface-container-high text-on-surface-variant px-xs py-[2px] rounded">3.2 mi</span>
                    </div>
                  </div>
                </label>

                {/* Center Item Card Option 3 (Disabled state layout configuration) */}
                <label className="flex items-start gap-md p-md rounded border border-outline-variant hover:bg-surface cursor-pointer transition-colors opacity-70">
                  <input disabled className="mt-1 text-primary focus:ring-primary" name="center" type="radio" />
                  <div className="flex flex-col">
                    <span className="font-data-mono text-data-mono text-on-surface-variant">West Seattle Clinic</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Temporarily Closed</span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Step 2: Date & Time Strip Grid Canvas */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
            <div className="p-lg border-b border-outline-variant bg-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px] fill">calendar_month</span>
              <h2 className="font-headline-sm text-headline-sm text-on-background">2. Select Date &amp; Time</h2>
            </div>
            
            <div className="p-lg flex flex-col gap-lg">
              {/* Horizontal Date Slide Layout */}
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">June 2026</h3>
                <div className="flex gap-sm overflow-x-auto hide-scrollbar pb-xs">
                  <button type="button" className="flex-shrink-0 w-16 flex flex-col items-center p-sm rounded border border-outline-variant hover:bg-surface-container-low transition-colors">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Wed</span>
                    <span className="font-headline-md text-headline-md text-on-background">03</span>
                  </button>
                  <button type="button" className="flex-shrink-0 w-16 flex flex-col items-center p-sm rounded border-2 border-primary bg-primary-fixed/20 transition-colors">
                    <span className="font-body-sm text-body-sm text-primary">Thu</span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">04</span>
                  </button>
                  <button type="button" className="flex-shrink-0 w-16 flex flex-col items-center p-sm rounded border border-outline-variant hover:bg-surface-container-low transition-colors">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Fri</span>
                    <span className="font-headline-md text-headline-md text-on-background">05</span>
                  </button>
                  <button type="button" className="flex-shrink-0 w-16 flex flex-col items-center p-sm rounded border border-outline-variant bg-surface-container-high opacity-50 cursor-not-allowed">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Sat</span>
                    <span className="font-headline-md text-headline-md text-on-surface-variant">06</span>
                  </button>
                  <button type="button" className="flex-shrink-0 w-16 flex flex-col items-center p-sm rounded border border-outline-variant hover:bg-surface-container-low transition-colors">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Sun</span>
                    <span className="font-headline-md text-headline-md text-on-background">07</span>
                  </button>
                </div>
              </div>

              {/* Matrix Time Slots Module Framework */}
              <div>
                <div className="flex items-center justify-between mb-sm">
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Available Slots</h3>
                  <span className="font-body-sm text-body-sm text-secondary flex items-center gap-[4px]">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> Fast Track Eligible
                  </span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-sm">
                  <button type="button" className="py-sm px-xs text-center border border-outline-variant rounded font-data-mono text-data-mono text-on-background hover:border-primary hover:text-primary transition-colors">08:00 AM</button>
                  <button type="button" className="py-sm px-xs text-center border border-outline-variant rounded font-data-mono text-data-mono text-on-background hover:border-primary hover:text-primary transition-colors">08:30 AM</button>
                  <button type="button" disabled className="py-sm px-xs text-center border border-outline-variant rounded font-data-mono text-data-mono text-on-surface-variant bg-surface-container-high opacity-50 cursor-not-allowed line-through">09:00 AM</button>
                  <button type="button" className="py-sm px-xs text-center border-2 border-primary bg-primary text-on-primary rounded font-data-mono text-data-mono transition-colors shadow-sm relative">
                    09:30 AM
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary-fixed rounded-full"></span>
                  </button>
                  <button type="button" className="py-sm px-xs text-center border border-outline-variant rounded font-data-mono text-data-mono text-on-background hover:border-primary hover:text-primary transition-colors">10:00 AM</button>
                  <button type="button" className="py-sm px-xs text-center border border-outline-variant rounded font-data-mono text-data-mono text-on-background hover:border-primary hover:text-primary transition-colors">10:30 AM</button>
                </div>
              </div>
            </div>
          </section>

          {/* Location Permission Alert Module Box */}
          <div className="bg-surface border border-outline-variant rounded shadow-sm overflow-hidden mt-md">
            <div className="px-md py-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Live Blood Drives Nearby</h3>
              <span className="material-symbols-outlined text-outline">map</span>
            </div>
            <div className="bg-surface-container-low/40 p-4 flex flex-col items-center justify-center text-on-surface-variant text-center">
              <span className="material-symbols-outlined text-6xl mb-4 text-outline/40">location_off</span>
              <p className="font-body-sm">Location services are currently disabled. Grant permission to see live blood centers and drives near your area.</p>
              <button type="button" className="mt-4 px-6 py-2 border border-outline rounded text-label-caps font-semibold bg-surface-container-lowest hover:bg-surface-container transition-colors tracking-wide text-xs">
                Enable Location Services
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Summary Panel Container */}
        <div className="lg:col-span-4 w-full">
          <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm sticky top-[24px] flex flex-col">
            <div className="p-lg border-b border-outline-variant bg-surface">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-background">Appointment Summary</h2>
            </div>
            
            <div className="p-lg flex flex-col gap-lg">
              {/* Dynamic Information Metric Rows */}
              <div className="flex flex-col gap-md">
                <div className="flex items-start gap-md">
                  <div className="mt-[2px] w-4 flex justify-center">
                    <span className="material-symbols-outlined text-outline text-[16px]">location_on</span>
                  </div>
                  <div>
                    <p className="font-data-mono text-data-mono text-on-background">Downtown Medical Hub</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">1200 4th Ave, Suite 200</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-md">
                  <div className="mt-[2px] w-4 flex justify-center">
                    <span className="material-symbols-outlined text-outline text-[16px]">schedule</span>
                  </div>
                  <div>
                    <p className="font-data-mono text-data-mono text-on-background">Thursday, June 04</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">09:30 AM - 10:15 AM (Est.)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-md">
                  <div className="mt-[2px] w-4 flex justify-center">
                    <span className="material-symbols-outlined text-outline text-[16px]">vaccines</span>
                  </div>
                  <div>
                    <p className="font-data-mono text-data-mono text-on-background">Whole Blood</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Standard Donation</p>
                  </div>
                </div>
              </div>
              
              <hr className="border-outline-variant border-t" />
              
              {/* Express QR Widget Info Module */}
              <div className="bg-surface-container flex items-center p-md rounded gap-md border border-outline-variant border-dashed">
                <span className="material-symbols-outlined text-primary text-[32px]">qr_code_scanner</span>
                <div className="flex flex-col text-left">
                  <span className="font-data-mono text-data-mono text-on-background font-bold">Express Check-in</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">A QR code will be generated upon confirmation for zero-contact entry.</span>
                </div>
              </div>
              
              {/* Dispatch Submission Action Primary Hook Trigger */}
              <button type="button" className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest py-md rounded transition-all hover:bg-surface-tint shadow-sm flex justify-center items-center gap-xs font-semibold active:scale-[0.99]">
                Confirm Booking
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                By confirming, you agree to our <a className="text-primary underline hover:text-surface-tint" href="#">donor guidelines</a>.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Full History Records Ledger Processing Stream Table */}
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden mt-xl shadow-sm">
        <div className="px-md py-md border-b border-outline-variant bg-surface-bright flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Full History Records</h3>
          <span className="font-data-mono text-xs text-outline font-medium uppercase tracking-wider">Immutable Logs</span>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-xl text-center text-on-surface-variant font-body-sm flex items-center justify-center gap-sm">
              <span className="animate-spin material-symbols-outlined text-primary text-[20px]">progress_activity</span>
              Fetching immutable donation history...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant text-[11px] font-bold tracking-wider uppercase">
                  <th className="px-md py-sm">Date</th>
                  <th className="px-md py-sm">Location</th>
                  <th className="px-md py-sm">Type</th>
                  <th className="px-md py-sm">Status / Reward</th>
                </tr>
              </thead>
              <tbody className="font-data-mono text-data-mono text-on-surface divide-y divide-outline-variant/50 text-xs">
                {history?.map((record: any, i: number) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-md py-sm whitespace-nowrap font-medium text-on-surface-variant">{record.date}</td>
                    <td className="px-md py-sm whitespace-nowrap text-body-sm font-body-sm font-semibold">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                        {record.location}
                      </div>
                    </td>
                    <td className="px-md py-sm whitespace-nowrap text-body-sm font-body-sm text-on-surface-variant">{record.type}</td>
                    <td className="px-md py-sm whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary border border-secondary/20 text-[10px] font-label-caps uppercase tracking-wider font-bold">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}