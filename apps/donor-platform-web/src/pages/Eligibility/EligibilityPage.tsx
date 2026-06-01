import React, { useState } from 'react';

type StepStatus = 'CLEARED' | 'IN PROGRESS' | 'PENDING';

interface StepMetadata {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

const WIZARD_STEPS: StepMetadata[] = [
  { id: 1, title: 'Demographics', subtitle: 'Basic Profile', icon: 'person' },
  { id: 2, title: 'Travel & Exposure', subtitle: 'Risk Areas', icon: 'flight_takeoff' },
  { id: 3, title: 'Medical History', subtitle: 'Health Baseline', icon: 'medical_information' },
  { id: 4, title: 'Lifestyle Screening', subtitle: 'Vital Metrics', icon: 'ecg' },
  { id: 5, title: 'Review & Sign', subtitle: 'Final Consent', icon: 'assignment_turned_in' },
];

export default function EligibilityPage() {
  const [activeStep, setActiveStep] = useState<number>(2);
  
  // Section 2 Interactive Questionnaire State
  const [hasTraveled, setHasTraveled] = useState<'yes' | 'no' | null>('yes');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  // Handle explicit step status logic based on user's progress trajectory
  const getStepStatus = (stepId: number): StepStatus => {
    if (stepId < activeStep) return 'CLEARED';
    if (stepId === activeStep) return 'IN PROGRESS';
    return 'PENDING';
  };

  const handleNext = () => {
    if (activeStep < WIZARD_STEPS.length) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container w-full">
      
      {/* Focused Task Header */}
      <header className="flex items-center justify-between px-xl py-md bg-surface border-b border-outline-variant sticky top-0 z-50">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
            Lifeline Donor
          </span>
          <div className="h-5 w-px bg-outline-variant mx-sm"></div>
          <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">
            Eligibility Screening
          </span>
        </div>
        <button 
          type="button"
          className="flex items-center gap-xs px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
          <span className="font-label-caps text-label-caps">Save &amp; Exit</span>
        </button>
      </header>

      {/* Main Content Canvas Layout */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto p-xl md:p-[32px] flex flex-col gap-[32px]">
        
        {/* 5-Step Tab Dynamic Stepper Segment */}
        <div className="w-full bg-surface border border-outline-variant rounded-lg p-md overflow-x-auto no-scrollbar shadow-sm">
          <div className="flex items-center justify-between min-w-[840px] w-full divide-x divide-outline-variant/60">
            {WIZARD_STEPS.map((step) => {
              const status = getStepStatus(step.id);
              const isActive = step.id === activeStep;
              const isCleared = status === 'CLEARED';
              
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => status !== 'PENDING' && setActiveStep(step.id)}
                  disabled={status === 'PENDING'}
                  className={`flex-1 flex items-center gap-md px-lg py-sm text-left transition-all relative ${
                    isActive ? 'bg-surface-container-low font-medium' : 'hover:bg-surface-container-lowest'
                  } ${status === 'PENDING' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Decorative Active Accent Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
                  )}

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isCleared 
                      ? 'bg-primary-fixed border-transparent text-primary' 
                      : isActive 
                      ? 'bg-primary text-on-primary border-primary' 
                      : 'bg-surface border-outline-variant text-on-surface-variant'
                  }`}>
                    {isCleared ? (
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-xs">
                      <span className="font-label-caps text-[10px] tracking-wider text-on-surface-variant uppercase">
                        Step 0{step.id}
                      </span>
                    </div>
                    <h4 className={`font-headline-sm text-[14px] leading-tight transition-colors ${isActive ? 'text-primary font-bold' : 'text-on-surface'}`}>
                      {step.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Inner Panel Hub */}
        <div className="flex flex-col lg:flex-row gap-[32px] items-start justify-center w-full">
          
          {/* Left Block View: Panel Question Cards container */}
          <div className="w-full lg:max-w-[800px] flex flex-col gap-xl flex-grow">
            
            {/* Context Step Summary Progress Metric */}
            <div className="bg-surface rounded-lg border border-outline-variant p-lg flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
                  Active Area: {WIZARD_STEPS[activeStep - 1].title}
                </span>
                <span className="font-data-mono text-data-mono text-on-surface-variant">
                  Step {activeStep} of 5
                </span>
              </div>
              <div className="w-full h-[6px] bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(activeStep / WIZARD_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 2 Panel Implementation Workspace */}
            {activeStep === 2 ? (
              <div className="bg-surface rounded-lg border border-outline-variant shadow-sm p-xl lg:p-[40px] relative overflow-hidden w-full animate-fadeIn">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-sm mb-lg">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      flight_takeoff
                    </span>
                    <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">
                      Question 04
                    </span>
                  </div>
                  
                  <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md font-bold">
                    Have you traveled outside the United States or Canada in the past 3 years?
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-[32px]">
                    Certain travel destinations carry a risk of exposure to malaria or other transfusion-transmitted infections. Please provide an accurate history.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg mb-[40px]">
                    <button
                      type="button"
                      onClick={() => setHasTraveled('yes')}
                      className={`relative flex items-center justify-start p-xl rounded-lg border-[2px] bg-surface transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        hasTraveled === 'yes'
                          ? 'border-primary text-on-surface'
                          : 'border-outline-variant text-on-surface-variant hover:border-outline hover:bg-surface-container-lowest'
                      }`}
                    >
                      <span 
                        className={`material-symbols-outlined absolute left-lg ${hasTraveled === 'yes' ? 'text-primary' : 'text-outline'}`}
                        style={{ fontVariationSettings: hasTraveled === 'yes' ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {hasTraveled === 'yes' ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                      <span className="font-headline-sm text-headline-sm ml-[32px] font-semibold">Yes, I have</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setHasTraveled('no');
                        setSelectedRegion('');
                      }}
                      className={`relative flex items-center justify-start p-xl rounded-lg border bg-surface transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        hasTraveled === 'no'
                          ? 'border-primary border-[2px] text-on-surface'
                          : 'border-outline-variant text-on-surface-variant hover:border-outline hover:bg-surface-container-lowest'
                      }`}
                    >
                      <span 
                        className={`material-symbols-outlined absolute left-lg ${hasTraveled === 'no' ? 'text-primary' : 'text-outline'}`}
                        style={{ fontVariationSettings: hasTraveled === 'no' ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {hasTraveled === 'no' ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                      <span className="font-headline-sm text-headline-sm ml-[32px] font-semibold">No, I have not</span>
                    </button>
                  </div>

                  {hasTraveled === 'yes' && (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-[40px] border-l-4 border-l-secondary animate-fadeIn">
                      <label htmlFor="region-select" className="block font-label-caps text-label-caps text-on-surface mb-sm font-semibold">
                        Please select the regions visited
                      </label>
                      <select
                        id="region-select"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded px-md py-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none h-[40px]"
                      >
                        <option value="">Select a region...</option>
                        <option value="europe">Europe</option>
                        <option value="asia">Asia</option>
                        <option value="africa">Africa</option>
                        <option value="south-america">South America</option>
                        <option value="central-america">Central America / Caribbean</option>
                        <option value="oceania">Oceania</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-xl border-t border-outline-variant">
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="px-xl py-sm rounded-lg border border-outline text-on-surface font-headline-sm text-headline-sm hover:bg-surface-container transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="px-[32px] py-[12px] rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-surface-tint shadow-sm transition-all flex items-center gap-sm font-semibold"
                    >
                      Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Alternate Step Placeholder Frame Layout */
              <div className="bg-surface rounded-lg border border-outline-variant shadow-sm p-xl lg:p-[40px] text-center py-[80px] w-full animate-fadeIn">
                <span className="material-symbols-outlined text-outline text-[48px] mb-md">
                  {WIZARD_STEPS[activeStep - 1].icon}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">
                  {WIZARD_STEPS[activeStep - 1].title} Content Workspace
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mx-auto mb-xl">
                  This segment manages original live system records for {WIZARD_STEPS[activeStep - 1].subtitle.toLowerCase()}.
                </p>
                <div className="flex items-center justify-center gap-md pt-xl border-t border-outline-variant max-w-xs mx-auto">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="px-xl py-sm rounded-lg border border-outline text-on-surface font-headline-sm text-headline-sm hover:bg-surface-container transition-colors font-semibold flex-1"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleNext}
                    disabled={activeStep === 5}
                    className="px-xl py-sm rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-surface-tint shadow-sm transition-all font-semibold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeStep === 5 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column Context Widgets Panel */}
          <div className="hidden lg:flex w-[340px] flex-col gap-xl shrink-0">
            {/* Pre-Donation Medical Protocol Recommendations Box Widget */}
            <div className="bg-surface rounded-lg border border-outline-variant p-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] w-full">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm font-bold">
                <span className="material-symbols-outlined text-secondary text-[20px]">vital_signs</span> 
                Pre-Donation Protocol
              </h3>
              
              <div className="flex flex-col gap-lg">
                <div className="flex gap-md items-start">
                  <div className="w-[32px] h-[32px] rounded bg-secondary-fixed-dim flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-[18px]">water_drop</span>
                  </div>
                  <div>
                    <div className="font-body-md text-body-md font-bold text-on-surface leading-tight mb-xs">Hydrate Extensively</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Consume an additional 16 oz of water or fluids prior to arrival.</div>
                  </div>
                </div>

                <div className="flex gap-md items-start">
                  <div className="w-[32px] h-[32px] rounded bg-tertiary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-tertiary-fixed text-[18px]">restaurant</span>
                  </div>
                  <div>
                    <div className="font-body-md text-body-md font-bold text-on-surface leading-tight mb-xs">Iron-Rich Meal</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Eat a healthy meal, avoiding high-fat foods, within 2-3 hours.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}