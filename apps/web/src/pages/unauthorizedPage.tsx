import { Link } from "@tanstack/react-router";
import { MaterialIcon } from "../components/shared/MaterialIcon";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-m3-surface p-4">
      <div className="text-center space-y-4">
        <MaterialIcon icon="gpp_bad" className="text-m3-error text-[80px]" />
        <h1 className="text-headline-md text-m3-on-surface">Access Denied</h1>
        <p className="text-body-main text-m3-on-surface-variant max-w-md">You don't have permission to access this resource. Contact your administrator.</p>
        <Link to="/dashboard" className="inline-block bg-m3-primary text-m3-on-primary px-6 py-3 rounded text-title-sm hover:opacity-90">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}