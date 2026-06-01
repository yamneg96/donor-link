import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CommandMenu } from "../components/navigation/CommandMenu";
import { useTheme } from "@/components/theme-provider";

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Handle standard shortcut toggle behavior cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    // Basic mock logout logic since AuthStore isn't built fully for Donor Platform
    localStorage.removeItem("donor-auth-token");
    navigate("/"); // Route back to landing
  };

  const toggleTheme = () => {
    // Cycles clearly between light and dark variants
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface transition-colors duration-200">
      {/* Universal Command Center Palette Component */}
      <CommandMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Modern High-Aesthetic Sticky Top Navigation App Bar */}
      <header className="bg-surface dark:bg-inverse-surface w-full top-0 sticky border-b border-outline-variant/60 dark:border-outline flex items-center justify-between px-4 sm:px-6 py-3 z-40 transition-all duration-200 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center justify-center p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all active:scale-95"
            aria-label="Open Command Menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <span className="font-headline-md text-lg sm:text-xl font-black text-primary dark:text-primary-fixed-dim tracking-tight select-none">
            Lifeline Donor
          </span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Spotlight Search Launcher Micro-Widget Accent */}
          <button 
            className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 bg-surface-container border border-outline-variant/30 rounded-xl text-outline text-xs font-semibold hover:bg-surface-container-high hover:border-outline-variant transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/20"
            onClick={() => setIsMenuOpen(true)}
          >
            <div className="flex items-center gap-1.5 text-on-surface-variant/80">
              <span className="material-symbols-outlined text-[16px] stroke-[2px]">search</span> 
              <span>Search platform...</span>
            </div>
            <kbd className="font-sans text-[10px] bg-surface-bright border border-outline-variant/60 px-1.5 py-0.5 rounded shadow-sm opacity-80 text-on-surface-variant/70">
              ⌘K
            </kbd>
          </button>

          {/* Theme Dynamic Controller Micro-Action Accent Button */}
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-high p-2 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-95 hover:text-primary"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Actionable Notification Button Trigger */}
          <button className="relative text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-high p-2 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-95 hover:text-primary">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {/* Live Indicator Pulse Accent Dot */}
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
            </span>
          </button>
          
          {/* Avatar Profile Dropdown Action Target Frame */}
          <div className="group relative">
            <button className="block h-9 w-9 rounded-full bg-surface-container overflow-hidden border border-outline-variant/80 hover:border-primary focus:border-primary transition-all focus:outline-none cursor-pointer p-0.5">
              <img 
                alt="Donor profile portrait picture avatar" 
                className="w-full h-full object-cover rounded-full" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgghcbPaEW3gE8ZXDpWlwk2c15IyAJg1r7iETolMCmmd0HwhjL0VXEMzM3hljjC4Nq5u3eK5VprfC1LQTk_qgVuM-UAAHbXb9rljOXJXZsv6dua5aUwK0X_Cc6nlRUgYrt1u7ZnT131rMy9Mt9boLxn_vPqEXwq6Fq-fGFhQxU3DqhttIaOBcm72XI5fcHXaUGtIJ4IUZYTxS_9BYGhEn8OfBCQW-TkUaDPvPvSfM3X1Lax24zzE04Fd7OFBqWwsWv8xKhZEWpgSVC" 
              />
            </button>
            
            {/* Dropdown Menu Node overlay element */}
            <div className="absolute right-0 top-full mt-2 w-48 origin-top-right bg-surface border border-outline-variant/60 rounded-xl shadow-xl opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200 z-50 p-1.5">
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-error/5 text-error flex items-center gap-3 font-label-md text-xs font-bold tracking-wide transition-colors focus:outline-none focus:bg-error/5"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> 
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Content Inner Frame Routing Router Output Element */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-24 transition-all duration-200">
        <Outlet />
      </main>
    </div>
  );
}