import React from 'react';

// Strict type interfaces for structured backend schema maps
interface MetricCard {
  icon: string;
  label: string;
  value: string | number;
  unit: string;
  iconColorClass: string;
  hasBlurBg?: boolean;
}

interface TimelineEvent {
  date: string;
  time: string;
  status: 'TRANSFUSED' | 'PROCESSED' | 'IN TRANSIT';
  title: string;
  description: string;
  tags?: { icon: string; text: string }[];
}

interface RecipientFeedback {
  category: string;
  message: string;
}

const ImpactPage: React.FC = () => {
  // --- Core Backend Data Layer Mock State ---
  const logisticsMetrics: MetricCard[] = [
    {
      icon: 'favorite',
      label: 'Total Lives Impacted',
      value: 24,
      unit: 'Patients',
      iconColorClass: 'text-primary',
      hasBlurBg: true,
    },
    {
      icon: 'water_drop',
      label: 'Volume Donated',
      value: '3.5',
      unit: 'Gallons',
      iconColorClass: 'text-secondary',
    },
    {
      icon: 'event_available',
      label: 'Eligibility Status',
      value: 'Ready to Donate',
      unit: 'Today',
      iconColorClass: 'text-tertiary',
    },
  ];

  const timelineLogs: TimelineEvent[] = [
    {
      date: 'OCT 14, 2023',
      time: '09:30 AM',
      status: 'TRANSFUSED',
      title: 'Whole Blood Donation',
      description: 'Unit #894-A2. Processed and successfully administered at Memorial General Hospital.',
      tags: [
        { icon: 'science', text: 'Screened: Negative' },
        { icon: 'local_shipping', text: 'Transit: 4h 12m' },
      ],
    },
    {
      date: 'JUL 22, 2023',
      time: '14:15 PM',
      status: 'TRANSFUSED',
      title: 'Whole Blood Donation',
      description: 'Unit #412-B7. Utilized in emergency surgery at City Central Trauma Center.',
    },
    {
      date: 'APR 05, 2023',
      time: '10:00 AM',
      status: 'PROCESSED',
      title: 'Power Red (Double Red Cell)',
      description: 'Units #221-C1, #221-C2. Separated into components for pediatric care.',
    },
  ];

  const communityFeedback: RecipientFeedback[] = [
    {
      category: 'Anonymous Patient • Oncology Unit',
      message: '"The treatments leave me completely drained. The transfusions I receive give me the strength to keep fighting and spend another day with my daughters. Thank you for your precision and dedication."',
    },
    {
      category: 'Trauma Surgeon • City Hospital',
      message: '"We received O-negative units from your batch during a critical multi-vehicle incident last night. Immediate availability of fully screened blood was the determining factor in saving a young life."',
    },
  ];

  const handleExportReport = () => {
    // Pipeline link to export handler service or secure API context chunk
    console.log('Initiating encrypted logistics report compilation protocol...');
  };

  return (
    <main className="flex-1 overflow-y-auto p-margin max-w-container-max mx-auto w-full grid grid-cols-12 gap-gutter py-xl bg-background text-on-background font-body-md antialiased">
      
      {/* Header Canvas Section */}
      <div className="col-span-12 mb-sm flex flex-col sm:flex-row justify-between items-start sm:items-end gap-margin">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Your Impact Journey</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">A clinical overview of your contributions and their operational outcomes.</p>
        </div>
        <button 
          onClick={handleExportReport}
          className="flex items-center gap-xs px-lg py-sm bg-primary text-on-primary rounded font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Report
        </button>
      </div>

      {/* Hero Analytics Widgets - Bento Layout */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {logisticsMetrics.map((metric, index) => (
          <div 
            key={index} 
            className="bg-surface rounded-xl border border-outline-variant p-lg flex flex-col justify-between h-32 relative overflow-hidden group"
          >
            {metric.hasBlurBg && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-fixed opacity-50 rounded-full blur-2xl group-hover:bg-primary-container transition-colors duration-500 pointer-events-none"></div>
            )}
            {index === 1 && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed opacity-50 rounded-full blur-2xl pointer-events-none"></div>
            )}
            
            <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
              <span className={`material-symbols-outlined text-[16px] ${metric.iconColorClass}`}>{metric.icon}</span>
              {metric.label}
            </span>

            {index !== 2 ? (
              <div className="font-headline-lg text-headline-lg text-on-surface mt-auto flex items-baseline gap-xs">
                {metric.value}
                <span className="font-data-mono text-data-mono text-on-surface-variant">{metric.unit}</span>
              </div>
            ) : (
              <div className="mt-auto">
                <div className="inline-flex items-center gap-xs px-sm py-xs bg-surface-container-low border border-outline-variant rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-data-mono text-data-mono text-on-surface">{metric.value}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Next eligible date: {metric.unit}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Primary Data Logs: Clinical Timeline Node */}
      <div className="col-span-12 lg:col-span-7 bg-surface rounded-xl border border-outline-variant overflow-hidden flex flex-col h-full">
        <div className="p-lg border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Donation History &amp; Tracking</h2>
          <span className="font-label-caps text-label-caps text-on-surface-variant">Last 12 Months</span>
        </div>
        
        <div className="p-lg flex-grow">
          <div className="relative border-l border-outline-variant ml-sm space-y-lg pb-sm">
            {timelineLogs.map((log, index) => (
              <div key={index} className="relative pl-lg">
                <div className={`absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full border-2 ${
                  index === 0 ? 'bg-primary border-surface' : 'bg-surface border-outline-variant'
                }`}></div>
                
                <div className="flex justify-between items-start mb-xs gap-sm">
                  <div className="font-data-mono text-data-mono text-on-surface-variant uppercase">{log.date} • {log.time}</div>
                  <span className="px-2 py-1 bg-surface-container text-on-surface font-label-caps text-label-caps rounded border border-outline-variant tracking-wider whitespace-nowrap">
                    {log.status}
                  </span>
                </div>
                
                <div className="bg-surface-container-low rounded-lg border border-outline-variant p-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px] text-primary">bloodtype</span>
                    {log.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{log.description}</p>
                  
                  {log.tags && log.tags.length > 0 && (
                    <div className="mt-md flex flex-wrap gap-sm">
                      {log.tags.map((tag, tagIdx) => (
                        <div key={tagIdx} className="px-sm py-xs bg-surface border border-outline-variant rounded-sm font-data-mono text-data-mono text-on-surface-variant flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">{tag.icon}</span>
                          {tag.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-sm border-t border-outline-variant bg-surface-bright text-center">
          <button className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors cursor-pointer bg-transparent border-none">
            View Full Logistics Log
          </button>
        </div>
      </div>

      {/* Right Structural Block: Contextual Visualization & Medical Feedback */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-gutter">
        
        {/* Geographic Distribution Card */}
        <div className="bg-surface rounded-xl border border-outline-variant p-md h-48 relative overflow-hidden flex items-center justify-center">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#004ac6 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          ></div>
          <div className="z-10 text-center">
            <span className="material-symbols-outlined text-[32px] text-primary mb-xs block">share_location</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Distribution Radius</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs leading-relaxed">
              Your donations have supported<br />facilities within a 50-mile radius.
            </p>
          </div>
        </div>

        {/* Patient Recipient Response Channel */}
        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden flex-grow flex flex-col">
          <div className="p-lg border-b border-outline-variant bg-surface-bright flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary">mail</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Recipient Feedback</h2>
          </div>
          
          <div className="p-md space-y-md flex-grow bg-surface-container-low">
            {communityFeedback.map((feedback, index) => (
              <div key={index} className="bg-surface rounded-lg border border-outline-variant p-md relative shadow-sm">
                <span className="material-symbols-outlined absolute top-md right-md text-surface-variant text-[24px] pointer-events-none">
                  format_quote
                </span>
                <div className="font-label-caps text-label-caps text-on-surface-variant mb-sm">{feedback.category}</div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed pr-lg">{feedback.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </main>
  );
};

export default ImpactPage;