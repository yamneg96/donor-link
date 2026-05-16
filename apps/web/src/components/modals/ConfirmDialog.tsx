/* ================================================================== */
/* CONFIRM DIALOG — Destructive action confirmation                    */
/* ================================================================== */

import { FormModal } from "./FormModal";
import { MaterialIcon } from "../shared/MaterialIcon";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const iconMap = {
    danger: "error",
    warning: "warning",
    default: "help",
  };

  const colorMap = {
    danger: "bg-m3-error text-m3-on-error hover:opacity-90",
    warning: "bg-yellow-500 text-white hover:opacity-90",
    default: "bg-m3-primary text-m3-on-primary hover:opacity-90",
  };

  return (
    <FormModal open={open} onClose={onClose} title={title} width="max-w-md">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-16 h-16 rounded-full bg-m3-error-container flex items-center justify-center mb-4">
          <MaterialIcon
            icon={iconMap[variant]}
            size={32}
            className="text-m3-on-error-container"
          />
        </div>

        <p className="text-body-main text-m3-on-surface-variant mb-6">
          {message}
        </p>

        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-title-sm hover:bg-m3-surface-variant transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-lg text-title-sm transition-opacity text-sm ${colorMap[variant]} disabled:opacity-50`}
          >
            {isLoading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </FormModal>
  );
}
