import { Outlet } from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LoadingSkeleton } from "../shared/EmptyState";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-m3-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-400 mx-auto">
            <Suspense fallback={<LoadingSkeleton rows={10} />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
