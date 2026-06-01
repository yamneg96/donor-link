import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CommandMenu } from "../components/navigation/CommandMenu";

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic mock logout logic since AuthStore isn't built fully for Donor Platform
    localStorage.removeItem('donor-auth-token');
    navigate('/'); // Route back to landing
  };

  return (
    <>
      <CommandMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* TopAppBar */}
      <header className="bg-surface dark:bg-inverse-surface w-full top-0 sticky border-b border-outline-variant dark:border-outline flex items-center justify-between px-margin py-sm z-40">
        <div className="flex items-center gap-md">
          <button 
             onClick={() => setIsMenuOpen(true)}
             className="flex items-center justify-center p-2 rounded hover:bg-surface-container text-on-surface transition-colors"
          >
             <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">Lifeline Donor</span>
        </div>
        
        <div className="flex items-center gap-lg">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded text-on-surface-variant text-body-sm hover:bg-surface-dim transition-colors" onClick={() => setIsMenuOpen(true)}>
             <span className="material-symbols-outlined text-[16px]">search</span> Cmd+K
          </button>
          <button className="text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-high p-xs rounded-full transition-colors duration-200 flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <div className="group relative">
             <button className="block h-8 w-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant focus:outline-none">
               <img alt="Donor profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgghcbPaEW3gE8ZXDpWlwk2c15IyAJg1r7iETolMCmmd0HwhjL0VXEMzM3hljjC4Nq5u3eK5VprfC1LQTk_qgVuM-UAAHbXb9rljOXJXZsv6dua5aUwK0X_Cc6nlRUgYrt1u7ZnT131rMy9Mt9boLxn_vPqEXwq6Fq-fGFhQxU3DqhttIaOBcm72XI5fcHXaUGtIJ4IUZYTxS_9BYGhEn8OfBCQW-TkUaDPvPvSfM3X1Lax24zzE04Fd7OFBqWwsWv8xKhZEWpgSVC" />
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

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin md:px-xl py-xl flex flex-col gap-lg pb-10">
        <Outlet />
      </main>
    </>
  );
}
