import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useUsers, useDeleteUser } from "../../hooks/useApi";
import { useModal } from "../../hooks/useModal";
import { CreateUserModal } from "../../components/modals/CreateUserModal";
import { ConfirmDialog } from "../../components/modals/ConfirmDialog";
import { toast } from "sonner";

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const createModal = useModal();
  const deleteModal = useModal<string>();
  const items = Array.isArray(users?.items || users) ? (users?.items || users) : [];

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  const handleDelete = async () => {
    if (!deleteModal.data) return;
    try {
      await deleteUser.mutateAsync(deleteModal.data);
      toast.success("User deleted");
      deleteModal.close();
    } catch { toast.error("Failed to delete user"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Staff Management</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Manage users and role assignments.</p>
        </div>
        <button onClick={() => createModal.open()} className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
          <MaterialIcon icon="person_add" size={18} /> Add Staff
        </button>
      </div>
      {items.length > 0 ? (
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {items.map((u: any) => (
                <tr key={u._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3 text-body-compact font-semibold text-m3-on-surface">{u.firstName} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3"><span className="text-label-caps px-2 py-0.5 rounded bg-m3-secondary-container text-m3-on-secondary-container">{u.role?.replace(/_/g, " ")}</span></td>
                  <td className="p-3"><span className={`w-2 h-2 rounded-full inline-block ${u.status === "active" ? "bg-green-500" : "bg-m3-error"}`} /></td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteModal.open(u._id)} className="text-m3-error hover:underline text-label-caps">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="manage_accounts" title="No users" description="Staff members will appear here." />
      )}
      <CreateUserModal open={createModal.isOpen} onClose={createModal.close} />
      <ConfirmDialog open={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title="Delete User" message="This will permanently remove this staff member's access." confirmLabel="Delete" isLoading={deleteUser.isPending} />
    </div>
  );
}
