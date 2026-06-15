import { useState } from 'react';

interface BloodCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  waitTime: string;
  statusType: 'urgent' | 'fast-track' | 'closed';
  statusLabel: string;
  isOpen: boolean;
  openTimeText?: string;
  amenities: {
    parking: boolean;
    accessible: boolean;
    wifi: boolean;
  };
  coords: { top: string; left: string };
}

// Strictly using actual data matching the dashboard state layout
const INITIAL_CENTERS: BloodCenter[] = [
  {
    id: 'downtown-hub',
    name: 'Downtown Medical Hub',
    address: '1200 Westlake Ave, Suite 200',
    distance: '0.8 mi',
    waitTime: '10 mins',
    statusType: 'urgent',
    statusLabel: 'Urgent Need for O-',
    isOpen: true,
    amenities: { parking: true, accessible: true, wifi: true },
    coords: { top: '45%', left: '45%' },
  },
  {
    id: 'northside-center',
    name: 'Northside Blood Center',
    address: '4500 N Broadway St',
    distance: '2.4 mi',
    waitTime: '25 mins',
    statusType: 'fast-track',
    statusLabel: 'Fast Track Available',
    isOpen: true,
    amenities: { parking: true, accessible: false, wifi: true },
    coords: { top: '30%', left: '60%' },
  },
  {
    id: 'east-valley',
    name: 'East Valley Clinic',
    address: '880 E Valley Blvd',
    distance: '6.2 mi',
    waitTime: '--',
    statusType: 'closed',
    statusLabel: 'Closed',
    isOpen: false,
    openTimeText: 'Opens tomorrow at 8:00 AM',
    amenities: { parking: true, accessible: true, wifi: false },
    coords: { top: '70%', left: '35%' },
  },
];

export default function CenterPage() {
  const [centers] = useState<BloodCenter[]>(INITIAL_CENTERS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'open'>('all');
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>('downtown-hub');

  const filteredCenters = centers.filter((center) => {
    if (activeFilter === 'urgent') return center.statusType === 'urgent';
    if (activeFilter === 'open') return center.isOpen;
    return true;
  });

  const activeCenterForPopup = centers.find((c) => c.id === selectedCenterId);

  return (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative w-full h-full">
      
      {/* List View Pane (Left Column) */}
      <div className="w-full md:w-[400px] lg:w-[480px] bg-surface flex flex-col h-full border-r border-outline-variant shrink-0 relative z-10 md:shadow-[4px_0_12px_rgba(0,0,0,0.05)]">
        
        {/* Sticky Control Header Filters */}
        <div className="p-lg border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">Find Centers</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
            Showing {filteredCenters.length} locations near you
          </p>
          
          <div className="flex gap-sm overflow-x-auto no-scrollbar pb-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-md py-xs rounded-full border font-label-caps text-label-caps whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-outline text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              All Centers
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('urgent')}
              className={`px-md py-xs rounded-full border font-label-caps text-label-caps whitespace-nowrap transition-colors ${
                activeFilter === 'urgent'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-outline text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              Urgent Need
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('open')}
              className={`px-md py-xs rounded-full border font-label-caps text-label-caps whitespace-nowrap transition-colors ${
                activeFilter === 'open'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-outline text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              Open Now
            </button>
          </div>
        </div>

        {/* Scrollable Center Location List Cards Container */}
        <div className="flex-1 overflow-y-auto p-md space-y-md bg-surface-container-low no-scrollbar">
          {filteredCenters.map((center) => {
            const isSelected = selectedCenterId === center.id;
            
            return (
              <div
                key={center.id}
                onClick={() => center.isOpen && setSelectedCenterId(center.id)}
                className={`bg-surface border p-lg rounded-xl relative shadow-sm transition-all ${
                  !center.isOpen ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                } ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-outline-variant hover:border-primary/50'}`}
              >
                {/* Urgent Callout Accent Tag Strip */}
                {center.statusType === 'urgent' && (
                  <div className="absolute top-0 right-0 w-1 h-full bg-error rounded-r-xl" />
                )}

                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <div className="flex items-center gap-xs mb-xs">
                      <span
                        className={`px-sm py-[2px] font-label-caps text-[10px] uppercase rounded-sm border font-bold tracking-wider ${
                          center.statusType === 'urgent'
                            ? 'bg-error/10 text-error border-error/20'
                            : center.statusType === 'fast-track'
                            ? 'bg-secondary/10 text-secondary border-secondary/20'
                            : 'bg-surface-container-high text-on-surface-variant border-outline-variant'
                        }`}
                      >
                        {center.statusLabel}
                      </span>
                    </div>
                    <h2 className={`font-headline-md text-headline-md text-on-surface font-semibold transition-colors ${isSelected ? 'text-primary' : ''}`}>
                      {center.name}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{center.address}</p>
                  </div>
                </div>

                {/* Operations Key-Value Metric Ribbon Box */}
                {center.isOpen ? (
                  <>
                    <div className="flex items-center gap-lg mt-md mb-md p-sm bg-surface-container-low rounded border border-outline-variant/50">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs">Distance</span>
                        <span className="font-data-mono text-data-mono text-on-surface">{center.distance}</span>
                      </div>
                      <div className="w-px h-6 bg-outline-variant" />
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs">Wait Time</span>
                        <span className={`font-data-mono text-data-mono font-semibold flex items-center gap-xs ${center.statusType === 'urgent' ? 'text-error' : 'text-secondary'}`}>
                          <span className={`w-2 h-2 rounded-full ${center.statusType === 'urgent' ? 'bg-error' : 'bg-secondary'}`} />
                          {center.waitTime}
                        </span>
                      </div>
                    </div>

                    {/* Meta Features Indicators */}
                    <div className="flex items-center gap-sm text-on-surface-variant mb-md">
                      {center.amenities.parking && <span className="material-symbols-outlined text-[16px]" title="Parking Available">local_parking</span>}
                      {center.amenities.accessible && <span className="material-symbols-outlined text-[16px]" title="Wheelchair Accessible">accessible</span>}
                      {center.amenities.wifi && <span className="material-symbols-outlined text-[16px]" title="Wi-Fi">wifi</span>}
                    </div>

                    {/* Action Hub Strip */}
                    <div className="flex gap-sm">
                      <button type="button" className="flex-1 bg-primary text-on-primary font-headline-sm text-[14px] py-sm rounded hover:bg-primary-container transition-colors text-center font-semibold">
                        Schedule Now
                      </button>
                      <button type="button" className="px-sm py-sm border border-outline text-on-surface rounded hover:bg-surface-container transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">directions</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-sm">
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">{center.openTimeText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Schematic Map Pane (Right Side Viewport - Hidden on Mobile Screen) */}
      <div className="flex-1 relative bg-surface-container-high h-full hidden md:block select-none">
        {/* Custom Core Map Vector Landscape Mesh Layout */}
        <div className="absolute inset-0 bg-[#e5e7eb] z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          {/* Faux Urban Road Infrastructure Traces */}
          <div className="absolute top-[20%] left-[-10%] w-[120%] h-8 bg-white/40 rotate-[12deg]" />
          <div className="absolute top-[60%] left-[-10%] w-[120%] h-12 bg-white/40 rotate-[-8deg]" />
          <div className="absolute left-[30%] top-[-10%] w-16 h-[120%] bg-white/30 rotate-[5deg]" />
          
          {/* User Geolocation Radius Ring Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-primary/20 bg-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/30 z-10" />
        </div>

        {/* Map UI Navigation Overlay HUD Controls Controls */}
        <div className="absolute top-md right-md z-20 flex flex-col gap-sm">
          <button type="button" className="w-10 h-10 bg-surface rounded shadow-sm border border-outline-variant flex items-center justify-center text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[22px]">add</span>
          </button>
          <button type="button" className="w-10 h-10 bg-surface rounded shadow-sm border border-outline-variant flex items-center justify-center text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[22px]">remove</span>
          </button>
          <button type="button" className="w-10 h-10 mt-md bg-surface rounded shadow-sm border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container transition-colors" title="My Location">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
          </button>
        </div>

        {/* Reactive Map Location Pins Layer */}
        {centers.map((center) => {
          const isSelected = selectedCenterId === center.id;
          
          return (
            <div
              key={`pin-${center.id}`}
              style={{ top: center.coords.top, left: center.coords.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
                center.isOpen ? 'z-20' : 'z-10 opacity-60'
              }`}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => center.isOpen && setSelectedCenterId(center.id)}
                  className={`flex flex-col items-center justify-center transition-transform ${
                    center.isOpen ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[36px] drop-shadow-md ${
                      center.statusType === 'urgent'
                        ? 'text-error'
                        : center.statusType === 'fast-track'
                        ? 'text-primary'
                        : 'text-outline'
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                </button>
                {/* Active Pulsing Ring Effect for Urgent Priority */}
                {center.statusType === 'urgent' && (
                  <div className="absolute top-0 left-0 w-9 h-9 animate-ping rounded-full bg-error/30 -z-10 pointer-events-none" />
                )}
              </div>

              {/* Absolute Popover Display Context Model Layer (Anchored to Marker Pin) */}
              {isSelected && activeCenterForPopup && activeCenterForPopup.id === center.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-surface rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-outline-variant p-md pointer-events-auto">
                  <div className="flex justify-between items-start mb-xs gap-xs">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                      {activeCenterForPopup.name}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCenterId(null);
                      }}
                      className="text-on-surface-variant hover:text-on-surface shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-md truncate">
                    {activeCenterForPopup.address}
                  </p>
                  <div className="flex items-center justify-between mb-sm">
                    <span className={`font-data-mono text-data-mono font-semibold flex items-center gap-xs text-xs ${activeCenterForPopup.statusType === 'urgent' ? 'text-error' : 'text-secondary'}`}>
                      <span className={`w-2 h-2 rounded-full ${activeCenterForPopup.statusType === 'urgent' ? 'bg-error' : 'bg-secondary'}`} />
                      {activeCenterForPopup.waitTime} Wait
                    </span>
                    <span className="font-data-mono text-data-mono text-on-surface text-xs font-medium">
                      {activeCenterForPopup.distance}
                    </span>
                  </div>
                  <button type="button" className="w-full bg-surface-container text-primary font-headline-sm text-[12px] py-xs rounded hover:bg-surface-container-high transition-colors text-center border border-primary/20 font-semibold">
                    Get Directions
                  </button>
                  {/* Decorative Anchor Pointer Bracket Box */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-b border-r border-outline-variant rotate-45 pointer-events-none" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}