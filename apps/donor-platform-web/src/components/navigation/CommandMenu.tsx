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
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Emergency', icon: 'warning', path: '/emergency' },
    { name: 'Impact & Reports', icon: 'query_stats', path: '/impact' },
    { name: 'Donate/Book', icon: 'water_drop', path: '/donate' },
    { name: 'Donation Centers', icon: 'location_on', path: '/centers' },
    { name: 'Profile Settings', icon: 'person', path: '/profile' },
  ];

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, type: "spring", bounce: 0.25 }}
              className="bg-surface border border-outline-variant shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-6 py-5 border-b border-outline-variant bg-surface-bright">
                <span className="material-symbols-outlined text-primary mr-4 text-[28px]">search</span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Where do you want to go?"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-headline-md text-on-surface placeholder:text-outline-variant"
                />
                <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
                <div className="font-label-caps text-outline tracking-wider mb-4 px-2 text-[11px] uppercase">Quick Links</div>
                {filteredLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredLinks.map((link, i) => (
                      <a
                        key={link.name}
                        href={link.path}
                        className="flex flex-col gap-2 p-4 rounded-xl border border-outline-variant/30 hover:border-primary hover:bg-primary-container/5 focus:bg-primary-container/10 hover:shadow-sm text-on-surface transition-all group cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">{link.icon}</span>
                        <span className="font-headline-sm">{link.name}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-on-surface-variant font-body-md">
                    No results found for "{searchValue}"
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
