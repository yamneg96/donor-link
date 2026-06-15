import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CommandMenu } from "../components/navigation/CommandMenu";
import { Sidebar } from "../components/navigation/Sidebar";
import { useAuthStore } from "../app/store/authStore";
import { toast } from "sonner";

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out Successfully.', {duration: 3000})
    navigate('/login');
  };

  return (
    <div className="text-on-surface bg-background flex min-h-screen">
      <Sidebar />
      <CommandMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-6 w-full z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-sm h-16 sticky top-0 border-b border-outline-variant/30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden px-3 py-2 bg-primary-container/10 text-primary hover:bg-primary-container/20 rounded-md transition-colors flex items-center gap-2 font-label-md"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="lg:hidden font-headline-md text-headline-md font-extrabold text-primary ml-2">DonorLink</div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="group relative">
               <button className="flex items-center gap-2 hover:bg-surface-container py-1 px-2 rounded transition-colors focus:bg-surface-container focus:outline-none">
                 <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-surface-variant">
                   <img alt="Coordinator Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6mNgIqSsqZfJH5qgBKW4hc8UCeWEk4aJlf9cj4ZZuGe2NWiXzBC9vPz4dHDR0HnJZaCoFBmeIFiqVFAIlY3ELOp6kEEIWDqYc-8K8cEBktAQ5YiDGh_52K0SzqxdJ7sTtcEyYPPDK_zGP2OgWi4oBrn6nISl7I15TZ4Mk2sRwxda4W0r0vSImQkxFclAo_rcVYquGknvdM0I7elnrkcxJSx_rU7kTKvULArOAzBI_9UximHFnQB66csYWYngslZN9K11jXjeENFJ1" />
                 </div>
               </button>
               {/* Dropdown Logout */}
               <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline-variant rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
                   <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-error-container/20 text-error flex items-center gap-2 font-label-md transition-colors">
                      <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                   </button>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-container-padding-mobile md:p-container-padding-desktop space-y-stack-md">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="flex justify-between items-center px-container-padding-desktop w-full py-8 mt-auto bg-surface-container dark:bg-surface-container-highest">
          <div className="font-label-md text-label-md font-semibold text-primary">
            DonorLink Ops
          </div>
          <div className="text-on-surface-variant dark:text-surface-variant font-label-sm text-label-sm">
            © 2024 DonorLink Health Systems. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
