import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { UserRole } from "../../types";

const PERMISSIONS = [
  "View Dashboard", "Manage Inventory", "Create Transfers", "Approve Transfers",
  "Manage Users", "View Analytics", "Declare Emergency", "Manage Campaigns",
  "View Alerts", "Manage Organizations", "View Audit Log", "System Settings",
];

const ROLES = Object.values(UserRole).filter((r) => r !== UserRole.DONOR);

const MATRIX: Record<string, string[]> = {
  SUPER_ADMIN: PERMISSIONS,
  NATIONAL_ADMIN: PERMISSIONS.filter((p) => p !== "System Settings"),
  NATIONAL_ANALYST: ["View Dashboard", "View Analytics", "View Alerts"],
  REGIONAL_ADMIN: ["View Dashboard", "Manage Inventory", "Create Transfers", "Approve Transfers", "View Analytics", "Declare Emergency", "View Alerts"],
  HOSPITAL_ADMIN: ["View Dashboard", "Manage Inventory", "Create Transfers", "Approve Transfers", "View Alerts"],
  LAB_STAFF: ["View Dashboard", "Manage Inventory"],
  DISPATCHER: ["View Dashboard", "Create Transfers"],
  DONOR_COORDINATOR: ["View Dashboard", "Manage Campaigns"],
};

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Role & Permission Management</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Configure access control for all staff roles.</p>
      </div>
      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-x-auto shadow-ambient-md">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
            <tr>
              <th className="p-3 sticky left-0 bg-m3-surface-container-low z-10">Permission</th>
              {ROLES.map((r) => (
                <th key={r} className="p-3 text-center whitespace-nowrap">{r.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-m3-outline-variant">
            {PERMISSIONS.map((perm) => (
              <tr key={perm} className="hover:bg-m3-surface-container-low">
                <td className="p-3 text-body-compact text-m3-on-surface sticky left-0 bg-m3-surface-container-lowest">{perm}</td>
                {ROLES.map((r) => (
                  <td key={r} className="p-3 text-center">
                    {MATRIX[r]?.includes(perm) ? (
                      <MaterialIcon icon="check_circle" filled size={18} className="text-green-600" />
                    ) : (
                      <MaterialIcon icon="cancel" size={18} className="text-m3-outline/30" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
