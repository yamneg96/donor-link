/* ================================================================== */
/* FORM MODAL — Reusable dialog wrapper for forms                      */
/* ================================================================== */

import { useEffect, useRef, type ReactNode } from "react";
import { MaterialIcon } from "../shared/MaterialIcon";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Width class override, defaults to max-w-lg */
  width?: string;
}

export function FormModal({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-lg",
}: FormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      // Trap focus
      const firstInput = contentRef.current?.querySelector<HTMLElement>(
        "input, select, textarea, button[type='submit']",
      );
      setTimeout(() => firstInput?.focus(), 50);
    } else {
      dialog.close();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handler);
    return () => dialog.removeEventListener("cancel", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 flex items-center justify-center bg-transparent p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`${width} w-full mx-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl shadow-ambient-lg animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-m3-outline-variant">
          <div>
            <h2 className="text-headline-md text-m3-on-surface">{title}</h2>
            {description && (
              <p className="text-body-compact text-m3-on-surface-variant mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors"
          >
            <MaterialIcon icon="close" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </dialog>
  );
}
