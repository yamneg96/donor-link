import { Outlet } from "@tanstack/react-router";
import { useSyncExternalStore, Suspense } from "react";
import { authStore } from "../../store/authStore";
import { AppLayout } from "./AppLayout";
import { LoadingSkeleton } from "../shared/EmptyState";

export function RootLayout() {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getState);
  const isAuth = !!state.accessToken && !!state.user;

  return (
    <Suspense fallback={<div className="p-8"><LoadingSkeleton rows={10} /></div>}>
      {isAuth ? <AppLayout /> : <Outlet />}
    </Suspense>
  );
}