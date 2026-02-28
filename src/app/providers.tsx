"use client";

import { AuthProvider } from "@/lib/auth-context";
import { VistaTaskbar } from "@/components/vista-taskbar";
import { VistaDesktop } from "@/components/vista-desktop";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <VistaDesktop>
        {children}
      </VistaDesktop>
      <VistaTaskbar />
    </AuthProvider>
  );
}
