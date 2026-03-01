"use client";

import { AuthProvider } from "@/lib/auth-context";
import { CyberLayout } from "@/components/cyber-layout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CyberLayout>{children}</CyberLayout>
    </AuthProvider>
  );
}
