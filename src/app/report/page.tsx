"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReportRedirect() {
  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    router.replace(`/report/${today}`);
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}
