/* ================================================================== */
/* TOAST — Sonner Toaster pre-configured with M3 theme                 */
/* ================================================================== */

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "'Inter', sans-serif",
        },
      }}
    />
  );
}
