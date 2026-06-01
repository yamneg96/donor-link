import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background clinical-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-4">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hospital Portal</h1>
          <p className="text-primary-foreground/80 mt-2">DonorLink Logistics & Operations</p>
        </div>
        
        <div className="bg-card glass-card rounded-2xl shadow-2xl p-8 border border-border/40 relative overflow-hidden">
          <Outlet />
        </div>
        
        <p className="text-center text-sm text-primary-foreground/60 mt-8">
          Secured by Ethiopian National Blood Bank Infrastructure
        </p>
      </div>
    </div>
  );
}
