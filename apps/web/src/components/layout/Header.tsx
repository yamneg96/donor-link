import { MaterialIcon } from "../shared/MaterialIcon";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="md:hidden flex justify-between items-center h-16 px-4 w-full bg-m3-surface-container-highest border-b border-m3-outline-variant sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors"
        >
          <MaterialIcon icon="menu" size={24} />
        </button>
        <span className="text-display-lg text-m3-primary text-2xl font-bold">DonorLink</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors">
          <MaterialIcon icon="notifications" size={22} />
        </button>
        <button className="p-2 text-m3-primary hover:bg-m3-surface-variant rounded-full transition-colors">
          <MaterialIcon icon="emergency_home" size={22} />
        </button>
        <button className="p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors">
          <MaterialIcon icon="account_circle" size={22} />
        </button>
      </div>
    </header>
  );
}
