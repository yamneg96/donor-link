import React, { useState } from 'react';

// Define strict types for the dashboard states
interface OrganizationRow {
  rank: number;
  name: string;
  unitsYTD: number;
  trend: 'up' | 'down' | 'stable';
  status: 'Platinum' | 'Gold' | 'Silver';
}

interface RegionalHub {
  name: string;
  capacity: number;
  variant: 'primary' | 'secondary' | 'error';
}

type TabType = 'corporate' | 'university' | 'platinum';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('corporate');

  // --- Core Backend Data Hooks Placeholder / State ---
  const kpiMetrics = {
    totalUnits: 14208,
    growthPercent: '+12%',
    livesImpacted: 42624,
    activeDrives: { total: 84, corporate: 32, university: 52 },
    criticalShortage: 'O- Neg'
  };

  const leaderboardData: Record<TabType, OrganizationRow[]> = {
    corporate: [
      { rank: 1, name: 'Acme Healthcare Systems', unitsYTD: 1240, trend: 'up', status: 'Platinum' },
      { rank: 2, name: 'Global Logistics Corp', unitsYTD: 985, trend: 'up', status: 'Gold' },
      { rank: 3, name: 'TechFrontier Solutions', unitsYTD: 820, trend: 'stable', status: 'Gold' },
      { rank: 4, name: 'National Bank Co.', unitsYTD: 650, trend: 'down', status: 'Silver' },
      { rank: 5, name: 'Apex Manufacturing', unitsYTD: 540, trend: 'up', status: 'Silver' },
    ],
    university: [
      { rank: 1, name: 'State University Central', unitsYTD: 1450, trend: 'up', status: 'Platinum' },
      { rank: 2, name: 'City Tech College', unitsYTD: 1100, trend: 'stable', status: 'Gold' },
    ],
    platinum: [
      { rank: 1, name: 'State University Central', unitsYTD: 1450, trend: 'up', status: 'Platinum' },
      { rank: 2, name: 'Acme Healthcare Systems', unitsYTD: 1240, trend: 'up', status: 'Platinum' },
    ]
  };

  const regionalHubs: RegionalHub[] = [
    { name: 'Northeast Hub', capacity: 88, variant: 'primary' },
    { name: 'Midwest Sector', capacity: 64, variant: 'secondary' },
    { name: 'Pacific Northwest', capacity: 95, variant: 'error' }
  ];

  const renderTrendIcon = (trend: OrganizationRow['trend']) => {
    switch (trend) {
      case 'up':
        return <span className="material-symbols-outlined text-sm align-middle text-secondary">arrow_upward</span>;
      case 'down':
        return <span className="material-symbols-outlined text-sm align-middle text-error">arrow_downward</span>;
      case 'stable':
        return <span className="material-symbols-outlined text-sm align-middle text-on-surface-variant">horizontal_rule</span>;
    }
  };

  const getProgressBarColor = (variant: RegionalHub['variant']) => {
    switch (variant) {
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-secondary';
      case 'error': return 'bg-error';
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen w-full font-body-md transition-colors duration-200">
      {/* Main Content Canvas */}
      <main className="w-full max-w-container-max mx-auto px-margin py-xl grid grid-cols-12 gap-margin items-start">
        {/* Title Block */}
        <div className="col-span-12 flex flex-col sm:flex-row sm:items-end justify-between gap-sm mb-sm">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background">Community Impact</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Live metrics and leaderboard data for current regional drives.</p>
          </div>
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container border border-outline-variant rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-caps text-label-caps text-on-surface">LIVE DATA</span>
            </div>
            <button className="px-4 py-2 border border-outline-variant text-on-surface font-label-caps text-label-caps rounded flex items-center gap-2 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-sm">download</span>
              EXPORT REPORT
            </button>
          </div>
        </div>

        {/* KPI Section */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-margin">
          {/* Total Units */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4">Total Units Collected</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-primary">{kpiMetrics.totalUnits.toLocaleString()}</span>
              <span className="font-data-mono text-data-mono text-secondary">{kpiMetrics.growthPercent}</span>
            </div>
            <div className="w-full bg-surface-container h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]"></div>
            </div>
          </div>

          {/* Lives Impacted */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4">Estimated Lives Impacted</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-primary">{kpiMetrics.livesImpacted.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Regional goal trending ahead</span>
            </div>
          </div>

          {/* Active Drives */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4">Active Drives</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-primary">{kpiMetrics.activeDrives.total}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="px-2 py-0.5 bg-primary-container text-on-primary-container font-label-caps text-label-caps rounded-sm">{kpiMetrics.activeDrives.corporate} CORP</span>
              <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-sm">{kpiMetrics.activeDrives.university} UNIV</span>
            </div>
          </div>

          {/* Critical Shortages */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4">Critical Shortages</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-error">{kpiMetrics.criticalShortage}</span>
            </div>
            <button className="mt-4 w-full bg-primary text-on-primary font-label-caps text-label-caps py-1.5 rounded hover:bg-surface-tint transition-colors text-center">
              PRIORITY DISPATCH
            </button>
          </div>
        </div>

        {/* Splits Matrix */}
        {/* Leaderboard Table Container */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-margin h-full">
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col h-full">
            
            {/* Tabs Trigger Switch */}
            <div className="flex border-b border-outline-variant bg-surface-container-lowest">
              {(['corporate', 'university', 'platinum'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 font-label-caps text-label-caps capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-surface'
                      : 'text-on-surface-variant border-b-2 border-transparent hover:bg-surface-container-low'
                  }`}
                >
                  {tab === 'corporate' ? 'Corporate Teams' : tab === 'university' ? 'University Drives' : 'Platinum Donors'}
                </button>
              ))}
            </div>

            {/* Dynamic Rendering Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="font-label-caps text-label-caps text-on-surface-variant p-sm pl-lg border-b border-outline-variant w-16">Rank</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant">Organization</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant">Units (YTD)</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant">Trend</th>
                    <th className="font-label-caps text-label-caps text-on-surface-variant p-sm pr-lg border-b border-outline-variant text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-data-mono text-on-surface">
                  {leaderboardData[activeTab].map((row, index) => (
                    <tr
                      key={row.rank}
                      className={`h-10 hover:bg-surface-container-low transition-colors border-b border-outline-variant border-opacity-50 ${
                        index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-[#F8FAFC]'
                      }`}
                    >
                      <td className="p-sm pl-lg">
                        {row.rank <= 3 ? (
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold ${
                            row.rank === 1 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'
                          }`}>
                            {row.rank}
                          </div>
                        ) : (
                          <span className="text-on-surface-variant pl-[6px]">{row.rank}</span>
                        )}
                      </td>
                      <td className="p-sm font-body-md text-body-md font-medium">{row.name}</td>
                      <td className="p-sm">{row.unitsYTD.toLocaleString()}</td>
                      <td className="p-sm">{renderTrendIcon(row.trend)}</td>
                      <td className="p-sm pr-lg text-right">
                        <span className="inline-block px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-sm text-[10px] tracking-wider uppercase">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-auto p-sm border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Showing 1-{leaderboardData[activeTab].length} of {activeTab === 'corporate' ? 42 : leaderboardData[activeTab].length} organizations
              </span>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Logistics Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-margin h-full">
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-lg border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-background">Regional Logistics</h2>
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full h-48 bg-surface-container-high border-b border-outline-variant">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWgJtbc-Kz0he2VopqNw1ECKrLZcT_NIkXtfp68NbwYTjkupqhiPZbol0jKur0GCC4xbV74YhIu58YmxqsV0sl-r_UzhLK_fR7iw5sjYdv8bsKNVbbw6MMuMcQ-6FbVzTNTpJ7eahVN2iDO0iM2uRCb0PAB0g8HnXH_P7R6OeTTvM57tVF6fGvIh-kM-QzN9JvKy0aSfkyIaY2qmOS0SVx8_6WvUAqT6fS3vqCQ1RLreZBY4mVbZjFBYWaR0TkTP_NzDZlPh1U2h_o"
                alt="Operational Distribution Interface Map"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full ring-4 ring-primary-fixed-dim ring-opacity-50 shadow-[0_0_8px_rgba(0,74,198,0.6)]"></div>
              <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-secondary rounded-full ring-2 ring-secondary-fixed shadow-[0_0_4px_rgba(0,103,128,0.6)]"></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-primary rounded-full animate-pulse flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Distribution metrics */}
            <div className="p-lg flex flex-col gap-4">
              {regionalHubs.map((hub) => (
                <div key={hub.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-caps text-label-caps text-on-surface">{hub.name}</span>
                    <span className={`font-data-mono text-data-mono ${hub.variant === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>
                      {hub.capacity}% Capacity
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${getProgressBarColor(hub.variant)}`} style={{ width: `${hub.capacity}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto p-4 bg-surface-container-low border-t border-outline-variant">
              <button className="w-full text-center font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors">
                VIEW DETAILED ROUTING
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;