import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
        isOpen ? onClose() : onClose(); // AppLayout will handle the toggle, but we could bubble an event instead. Better handled via a global store or passing a toggle prop. 
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const links = [
    { name: 'Dashboard', icon: 'dashboard', path: '/app/dashboard' },
    { name: 'Inventory', icon: 'bloodtype', path: '/app/inventory' },
    { name: 'Requests', icon: 'reorder', path: '/app/requests' },
    { name: 'Transfusions', icon: 'emergency_share', path: '/app/transfers' },
    { name: 'Emergency', icon: 'warning', path: '/app/emergency' },
    { name: 'AI Intelligence', icon: 'psychology', path: '/app/intelligence' },
    { name: 'Donors', icon: 'group', path: '/app/donors' },
    { name: 'Staff', icon: 'medical_services', path: '/app/staff' },
    { name: 'Reports', icon: 'analytics', path: '/app/analytics' },
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-32 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-surface border border-outline-variant shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 py-4 border-b border-outline-variant bg-surface-bright">
                <span className="material-symbols-outlined text-outline mr-3">search</span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-body-lg text-on-surface placeholder:text-outline"
                />
                <button onClick={onClose} className="px-2 py-1 text-xs font-semibold bg-surface-container rounded border border-outline-variant text-on-surface-variant ml-2">ESC</button>
              </div>
              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                <div className="font-label-caps text-outline mb-2 px-2 text-xs">Menu Navigation</div>
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-primary-container/10 focus:bg-primary-container/10 text-on-surface hover:text-primary transition-colors group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-outline group-hover:text-primary">{link.icon}</span>
                      <span className="font-label-md">{link.name}</span>
                      <span className="ml-auto material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 turn-right text-sm">chevron_right</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-on-surface-variant font-body-md">
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
