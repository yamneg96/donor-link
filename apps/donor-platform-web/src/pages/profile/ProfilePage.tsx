import React, { useState } from 'react';

// Strict type interfaces for backend data structuring
interface VitalRecord {
  label: string;
  value: string;
  unit?: string;
}

interface DonationRecord {
  date: string;
  location: string;
  type: string;
  status: 'Completed' | 'Deferred';
  volume: string;
}

interface PreparationTip {
  icon: string;
  title: string;
  description: string;
}

const ProfilePage: React.FC = () => {
  // --- Core Backend Data Hooks / States ---
  const donorIdentity = {
    name: 'Alex Mercer',
    id: 'DNLK-8842-A',
    bloodType: 'O- Negative',
    tier: 'Silver Tier',
    totalDonations: 24,
    livesImpacted: 72,
    nextEligibleDate: 'Dec 07, 2023',
    daysRemaining: 'In 14 Days',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3jZDiNffBmqrlpoTukKp8S5LeRsWUEf5aj3xsYWXyb6B_fAwla3iv-vb-24GIrSzU0pDKBQdp_3Y3Phko_eIvIitRJadf5aSPV1Ni-ub3jNMPTWtRk5OLFPByll9OoWnr9t-FlXYDoXfsJTK1hT2ZGeOz5c-FyaR5h4STSNf9ppId2QBvIEkViuopBkdtP89eQsay0UQIFGYGEfUvpgIJjG6Xs1WYHy2-bgqkJkVGYsRQMA0hx4NWp4uYaKiF9_SrZ3W3zLJNvtvm'
  };

  const vitals: VitalRecord[] = [
    { label: 'Hemoglobin', value: '15.2', unit: 'g/dL' },
    { label: 'Blood Pressure', value: '118/76' },
    { label: 'Pulse', value: '68', unit: 'bpm' },
    { label: 'Temperature', value: '98.4', unit: '°F' },
  ];

  const donationHistory: DonationRecord[] = [
    { date: 'Oct 12, 2023', location: 'Central Blood Bank', type: 'Whole Blood', status: 'Completed', volume: '500ml' },
    { date: 'Aug 05, 2023', location: 'Mobile Drive - City Hall', type: 'Whole Blood', status: 'Completed', volume: '500ml' },
    { date: 'Jun 01, 2023', location: 'Central Blood Bank', type: 'Power Red', status: 'Completed', volume: '500ml' },
    { date: 'Feb 14, 2023', location: 'Westside Clinic', type: 'Whole Blood', status: 'Deferred', volume: '--' },
  ];

  const preparationTips: PreparationTip[] = [
    { icon: 'water_drop', title: 'Hydrate Extra', description: 'Drink an extra 16 oz of water before your appointment to ensure optimal blood flow.' },
    { icon: 'set_meal', title: 'Iron-Rich Diet', description: 'Consume spinach, red meat, or fortified cereals a few days prior to boost hemoglobin.' },
    { icon: 'bed', title: 'Rest Well', description: 'Aim for 8 hours of sleep the night before your scheduled donation.' }
  ];

  // Form State Handlers
  const [criticalShortageAlerts, setCriticalShortageAlerts] = useState<boolean>(true);
  const [onCallVolunteer, setOnCallVolunteer] = useState<boolean>(false);
  
  const [appointmentReminders, setAppointmentReminders] = useState<boolean>(false);
  const [impactReports, setImpactReports] = useState<boolean>(true);
  const [localCenterUpdates, setLocalCenterUpdates] = useState<boolean>(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch states directly to backend context or service layer here
    console.log({
      criticalShortageAlerts,
      onCallVolunteer,
      appointmentReminders,
      impactReports,
      localCenterUpdates
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-margin md:p-xl scroll-smooth bg-background text-on-surface font-body-md">
      <div className="max-w-container-max mx-auto space-y-xl">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-margin">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Donor Profile &amp; Wellness Hub</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your donor identity, track vitals, and prepare for your next visit.</p>
          </div>
        </div>

        {/* Top Row: Identity & Readiness Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-margin">
          
          {/* 1. Donor Identity & Stats Card */}
          <div className="md:col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-margin flex flex-col md:flex-row gap-lg items-center md:items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <img 
              alt={`${donorIdentity.name} Profile`} 
              className="w-24 h-24 rounded-full border-2 border-surface object-cover shadow-sm z-10 shrink-0" 
              src={donorIdentity.avatarUrl}
            />
            <div className="flex-1 text-center md:text-left z-10">
              <h3 className="font-headline-md text-headline-md text-on-surface">{donorIdentity.name}</h3>
              <p className="font-data-mono text-data-mono text-on-surface-variant mb-md">ID: {donorIdentity.id}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-sm mb-margin">
                <span className="inline-flex items-center gap-xs px-sm py-xs bg-error-container text-on-error-container rounded font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px]">bloodtype</span>
                  {donorIdentity.bloodType}
                </span>
                <span className="inline-flex items-center gap-xs px-sm py-xs bg-surface-container-high text-on-surface rounded border border-outline-variant font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px] text-outline">workspace_premium</span>
                  {donorIdentity.tier}
                </span>
              </div>
              
              <div className="pt-sm border-t border-outline-variant flex justify-around md:justify-start md:gap-xl">
                <div>
                  <p className="font-label-caps text-label-caps text-outline mb-xs">Total Donations</p>
                  <p className="font-headline-lg text-headline-lg text-primary">{donorIdentity.totalDonations}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-outline mb-xs">Lives Impacted</p>
                  <p className="font-headline-lg text-headline-lg text-secondary">~{donorIdentity.livesImpacted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Wellness & Readiness */}
          <div className="md:col-span-6 lg:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-margin flex flex-col justify-between relative">
            <div className="flex items-start justify-between mb-margin">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary">event_available</span>
                  Next Eligible Date
                </h3>
                <p className="font-body-sm text-body-sm text-outline mt-xs">Whole Blood Donation</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant">info</span>
            </div>
            <div className="text-center my-md">
              <p className="font-headline-lg text-headline-lg text-on-surface mb-xs">{donorIdentity.nextEligibleDate}</p>
              <span className="inline-block px-sm py-xs bg-secondary-container text-on-secondary-container rounded font-label-caps text-label-caps">{donorIdentity.daysRemaining}</span>
            </div>
            <button className="w-full bg-primary text-on-primary rounded font-label-caps text-label-caps py-sm px-md hover:bg-on-primary-fixed-variant transition-colors mt-auto">
              Schedule Appointment
            </button>
          </div>

          {/* 3. Health Snapshot / Latest Vitals */}
          <div className="md:col-span-6 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-margin flex flex-col">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-tertiary">monitor_heart</span>
                Latest Vitals
              </h3>
              <span className="font-body-sm text-body-sm text-outline">Oct 12, 2023</span>
            </div>
            <div className="grid grid-cols-2 gap-sm flex-1">
              {vitals.map((vital) => (
                <div key={vital.label} className="bg-surface p-sm rounded border border-outline-variant flex flex-col justify-center">
                  <p className="font-label-caps text-label-caps text-outline mb-xs">{vital.label}</p>
                  <div className="flex items-baseline gap-xs">
                    <span className="font-headline-md text-headline-md text-on-surface">{vital.value}</span>
                    {vital.unit && <span className="font-data-mono text-data-mono text-outline">{vital.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Middle Row: History & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-margin">
          
          {/* Recent Donations History Table */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
            <div className="p-margin border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Donations</h3>
              <button className="text-primary font-label-caps text-label-caps hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface font-label-caps text-label-caps text-outline border-b border-outline-variant">
                  <tr>
                    <th className="py-sm px-margin font-medium">Date</th>
                    <th className="py-sm px-margin font-medium">Location</th>
                    <th className="py-sm px-margin font-medium hidden sm:table-cell">Type</th>
                    <th className="py-sm px-margin font-medium">Status</th>
                    <th className="py-sm px-margin font-medium text-right">Volume</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-data-mono text-on-surface divide-y divide-outline-variant">
                  {donationHistory.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-surface-container-low transition-colors ${index % 2 === 1 ? 'bg-surface-bright' : ''}`}
                    >
                      <td className={`py-md px-margin ${row.status === 'Deferred' ? 'text-outline' : ''}`}>{row.date}</td>
                      <td className={`py-md px-margin ${row.status === 'Deferred' ? 'text-outline' : ''}`}>{row.location}</td>
                      <td className={`py-md px-margin hidden sm:table-cell ${row.status === 'Deferred' ? 'text-outline' : ''}`}>{row.type}</td>
                      <td className="py-md px-margin">
                        <span className={`inline-flex items-center px-sm py-xs rounded text-[10px] uppercase font-bold tracking-wider ${
                          row.status === 'Completed' ? 'bg-surface-container-high text-on-surface' : 'bg-surface-variant text-outline'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className={`py-md px-margin text-right ${row.status === 'Deferred' ? 'text-outline' : ''}`}>{row.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nutrition & Preparation Tips */}
          <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-margin flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-margin flex items-center gap-xs">
              <span className="material-symbols-outlined text-tertiary-container">restaurant_menu</span>
              Preparation Tips
            </h3>
            <div className="space-y-md flex-1">
              {preparationTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-md">
                  <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface text-[18px]">{tip.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-data-mono text-data-mono text-on-surface mb-xs">{tip.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Row: Settings & Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-margin">
          
          {/* Emergency Readiness Settings */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-margin">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-outline-variant pb-sm">Emergency Readiness</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-margin">Control how you participate in rapid response initiatives for critical shortages.</p>
            <div className="space-y-margin">
              
              {/* Toggle Item 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-data-mono text-data-mono text-on-surface">Critical Shortage Alerts</p>
                  <p className="font-body-sm text-body-sm text-outline mt-xs">Receive immediate SMS when O- is critically low in your area.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-md">
                  <input 
                    type="checkbox" 
                    checked={criticalShortageAlerts}
                    onChange={(e) => setCriticalShortageAlerts(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Toggle Item 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-data-mono text-data-mono text-on-surface">On-Call Volunteer List</p>
                  <p className="font-body-sm text-body-sm text-outline mt-xs">Allow centers to contact you directly for emergency specific-type needs.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-md">
                  <input 
                    type="checkbox" 
                    checked={onCallVolunteer}
                    onChange={(e) => setOnCallVolunteer(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-margin">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-outline-variant pb-sm">Communication Preferences</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-margin">Manage how DonorLink contacts you for routine updates.</p>
            <form onSubmit={handleSavePreferences} className="space-y-md">
              
              {/* Checkbox Group 1 */}
              <label className="flex items-start gap-md cursor-pointer group">
                <div className="relative flex items-center justify-center shrink-0 mt-xs">
                  <input 
                    type="checkbox"
                    checked={appointmentReminders}
                    onChange={(e) => setAppointmentReminders(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border border-outline rounded bg-surface checked:bg-primary checked:border-primary transition-colors focus:ring-2 focus:ring-primary-fixed focus:ring-offset-1 focus:ring-offset-surface" 
                  />
                  <span className="material-symbols-outlined absolute text-on-primary text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <div>
                  <span className="font-data-mono text-data-mono text-on-surface block mb-xs">Appointment Reminders</span>
                  <span className="font-body-sm text-body-sm text-outline block">Email and SMS reminders 48 hours before appointments.</span>
                </div>
              </label>

              {/* Checkbox Group 2 */}
              <label className="flex items-start gap-md cursor-pointer group">
                <div className="relative flex items-center justify-center shrink-0 mt-xs">
                  <input 
                    type="checkbox"
                    checked={impactReports}
                    onChange={(e) => setImpactReports(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border border-outline rounded bg-surface checked:bg-primary checked:border-primary transition-colors focus:ring-2 focus:ring-primary-fixed focus:ring-offset-1 focus:ring-offset-surface" 
                  />
                  <span className="material-symbols-outlined absolute text-on-primary text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <div>
                  <span className="font-data-mono text-data-mono text-on-surface block mb-xs">Impact Reports</span>
                  <span className="font-body-sm text-body-sm text-outline block">Monthly summaries of how your donations are helping the community.</span>
                </div>
              </label>

              {/* Checkbox Group 3 */}
              <label className="flex items-start gap-md cursor-pointer group">
                <div className="relative flex items-center justify-center shrink-0 mt-xs">
                  <input 
                    type="checkbox"
                    checked={localCenterUpdates}
                    onChange={(e) => setLocalCenterUpdates(e.target.checked)}
                    className="peer appearance-none w-4 h-4 border border-outline rounded bg-surface checked:bg-primary checked:border-primary transition-colors focus:ring-2 focus:ring-primary-fixed focus:ring-offset-1 focus:ring-offset-surface" 
                  />
                  <span className="material-symbols-outlined absolute text-on-primary text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <div>
                  <span className="font-data-mono text-data-mono text-on-surface block mb-xs">Local Center Updates</span>
                  <span className="font-body-sm text-body-sm text-outline block">News regarding hours, locations, and mobile drives near you.</span>
                </div>
              </label>

              <div className="pt-sm mt-md border-t border-outline-variant flex justify-end">
                <button 
                  type="submit"
                  className="bg-surface text-on-surface border border-outline-variant rounded font-label-caps text-label-caps py-sm px-lg hover:bg-surface-container-low transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProfilePage;