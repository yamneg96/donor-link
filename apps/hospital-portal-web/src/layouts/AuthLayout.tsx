import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#f9f9f8] relative bg-[radial-gradient(#e6bdb8_0.5px,transparent_0.5px)] bg-[size:24px_24px]">
      
      {/* Persistent Background Lab Graphic */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          alt="Medical lab background" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv8O3Y4GmBl1_SQ2YwLQUgGq41JTGAs45vdeirj8S_8aObT2dgqLCFiLjbmRV3vl0_UsMWRGPPZ7KFBlhrFpnMdcjukctz1QZQSJ99Pvoiah_0sI9Ky7-TfxR69fu9zmO5RD-2J680T5X71y7MAZb1fVAw2DB_fZMBI18DmW_LpHOp20iG4B6B0Tb0sqbAsvydFiQ09PEs7YW4TjfyjpJsteBOBmqN9UxeW_9XSbBGicuLdwXQLXywp_qkcRBo4Ldya2YrULGYIFSD"
        />
      </div>

      {/* Main Form Content Canvas */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[480px] space-y-6">
          
          {/* Constant Branding Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                <Link to='/' className="material-symbols-outlined text-on-primary text-[40px]">clinical_notes</Link>
              </div>
            </div>
            <h1 className="font-headline-lg text-2xl font-extrabold text-primary tracking-tight">DonorLink Hospital Portal</h1>
            <p className="font-body-md text-sm text-on-surface-variant">Secure access for clinical blood logistics</p>
          </div>

          {/* Dynamic Form Content Wrapper */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 md:p-10 border border-outline-variant/30 shadow-[0_4px_20px_rgba(183,0,17,0.04)]">
            <Outlet />
          </div>

          {/* Constant Trust & Compliance Badges */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 opacity-60 pt-2">
            <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
              <span className="material-symbols-outlined text-[18px]">security</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">HIPAA COMPLIANT</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">AABB ACCREDITED</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
              <span className="material-symbols-outlined text-[18px]">shield_lock</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">SOC2 TYPE II</span>
            </div>
          </div>

        </div>
      </main>

      {/* Constant Global Application Footer */}
      <footer className="bg-inverse-surface border-t border-outline-variant z-10 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:items-start items-center">
            <span className="font-headline-md text-lg font-bold text-surface-bright mb-1">DonorLink</span>
            <p className="font-body-md text-xs text-surface-variant text-center md:text-left max-w-[400px]">
              © 2026 DonorLink Healthcare Systems. All rights reserved. Clinical excellence in blood logistics.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a className="text-surface-variant hover:text-primary-fixed-dim text-xs transition-colors" href="#privacy">Privacy Policy</a>
            <a className="text-surface-variant hover:text-primary-fixed-dim text-xs transition-colors" href="#terms">Terms of Service</a>
            <a className="text-surface-variant hover:text-primary-fixed-dim text-xs transition-colors" href="#security">Security Compliance</a>
            <a className="text-surface-variant hover:text-primary-fixed-dim text-xs transition-colors" href="#support">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}