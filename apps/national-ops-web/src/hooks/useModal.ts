/* ================================================================== */
/* useModal — Reusable hook for modal open/close state                 */
/* ================================================================== */

import { useState, useCallback } from "react";

export function useModal<T = undefined>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  const open = useCallback((payload?: T) => {
    setData(payload);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data so exit animations can use it
    setTimeout(() => setData(undefined), 300);
  }, []);

  return { isOpen, data, open, close };
}
