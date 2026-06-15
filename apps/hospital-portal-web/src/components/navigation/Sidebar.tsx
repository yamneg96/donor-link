import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
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

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-outline-variant hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="font-heading text-xl font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>bloodtype</span>
          DonorLink
        </div>
        <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mt-1">Hospital Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="font-label-sm text-outline px-2 mb-2 uppercase tracking-tighter opacity-70">Main Menu</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-label-md group",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-outline-variant">
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">System Health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-on-surface-variant font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
