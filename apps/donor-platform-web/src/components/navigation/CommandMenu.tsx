import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const [searchValue, setSearchValue] = useState('');

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const links = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Emergency', icon: 'warning', path: '/emergency' },
    { name: 'Impact & Reports', icon: 'query_stats', path: '/impact' },
    { name: 'Campaigns', icon: 'campaign', path: '/campaign' },
    { name: 'Donate/Book', icon: 'water_drop', path: '/donate' },
    { name: 'Donation Centers', icon: 'location_on', path: '/centers' },
    { name: 'Eligibility Check', icon: 'checklist', path: '/eligible' },
    { name: 'Community Impact', icon: 'groups', path: '/community' },
    { name: 'Profile Settings', icon: 'person', path: '/profile' },
  ];

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-xl z-[100] transition-all duration-300"
          />
          
          {/* Menu Wrapper Positioning Container */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center p-4 pt-[10vh] md:pt-[15vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface border border-outline-variant shadow-2xl rounded-2xl w-full overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Search Bar Block */}
              <div className="flex items-center px-5 py-4 border-b border-outline-variant/60 bg-surface-bright gap-3 relative">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0 select-none">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Where do you want to go?"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-headline-sm text-base font-medium text-on-surface placeholder:text-outline/60"
                />
                
                {/* Visual Keyboard Command Micro-Indicator */}
                <div className="hidden sm:flex items-center gap-1 shrink-0 bg-surface-container border border-outline-variant/40 px-2 py-1 rounded-md text-[10px] font-semibold text-outline tracking-wider select-none uppercase">
                  <span>ESC</span>
                </div>
                
                <button 
                  onClick={onClose} 
                  className="text-on-surface-variant hover:text-error hover:bg-error/5 transition-all flex items-center justify-center p-1.5 rounded-lg shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Dynamic Content Body Area */}
              <div className="max-h-[50vh] overflow-y-auto p-3 custom-scrollbar">
                <div className="font-label-caps text-outline tracking-widest px-3 py-2 text-[10px] font-bold uppercase select-none">
                  Quick Navigation
                </div>
                
                {filteredLinks.length > 0 ? (
                  <div className="flex flex-col gap-1 mt-1">
                    {filteredLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.path}
                        className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-outline-variant/40 hover:bg-surface-container-low text-on-surface transition-all duration-150 group cursor-pointer focus:outline-none focus:bg-surface-container-low focus:border-outline-variant/40"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container border border-outline-variant/20 text-outline transition-colors group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20">
                            <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-105">
                              {link.icon}
                            </span>
                          </div>
                          <span className="text-sm font-semibold tracking-tight text-on-surface/90 group-hover:text-on-surface">
                            {link.name}
                          </span>
                        </div>
                        
                        {/* Dynamic Row Arrow indicator */}
                        <span className="material-symbols-outlined text-[18px] text-outline opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                          chevron_right
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-on-surface-variant/70 text-sm font-medium flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-outline/40">search_off</span>
                    <p>No results found for "{searchValue}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}