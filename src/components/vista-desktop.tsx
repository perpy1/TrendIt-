"use client";

import { ReactNode } from "react";

interface VistaDesktopProps {
  children: ReactNode;
}

export function VistaDesktop({ children }: VistaDesktopProps) {
  return (
    <div className="vista-desktop relative min-h-screen overflow-hidden pb-10">
      {/* Desktop content area */}
      <div className="relative z-10 min-h-[calc(100vh-2.5rem)]">
        {children}
      </div>
    </div>
  );
}
