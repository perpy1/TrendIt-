"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { formatDate } from "@/lib/utils";
import { Calendar, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

interface ReportSummary {
  date: string;
  title: string;
  trends: number;
  breakouts: number;
}

export default function ArchivePage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/report?list=true")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl">
        <h1 className="pixel-heading mb-6 text-sm text-[var(--color-accent)]">
          Report Archive
        </h1>

        {loading ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-[var(--color-accent)]" />
            <p className="text-xs text-[var(--color-text-muted)]">Loading reports...</p>
          </div>
        ) : (
          <>
            {/* Terminal-style list */}
            <div className="border border-[var(--color-card-border)]">
              {/* Column headers */}
              <div className="flex items-center gap-3 border-b border-[var(--color-card-border)] bg-[var(--color-surface)] px-4 py-2 text-[10px] pixel-heading text-[var(--color-text-muted)]">
                <span className="w-5" />
                <span className="flex-1">Report Title</span>
                <span className="hidden w-32 sm:block">Date</span>
                <span className="w-14 text-center">Trends</span>
                <span className="w-14 text-center">Videos</span>
              </div>

              {/* Rows */}
              {reports.map((report) => (
                <Link
                  key={report.date}
                  href={`/report/${report.date}`}
                  className="flex items-center gap-3 border-b border-[var(--color-card-border)] px-4 py-3 text-sm transition-colors hover:bg-[var(--color-accent-dim)]"
                >
                  <Calendar className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <span className="flex-1 font-medium">
                    {report.title}
                  </span>
                  <span className="hidden w-32 text-xs text-[var(--color-text-muted)] sm:block">
                    {formatDate(report.date)}
                  </span>
                  <span className="flex w-14 items-center justify-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <TrendingUp className="h-3 w-3" />
                    {report.trends}
                  </span>
                  <span className="w-14 text-center text-xs text-[var(--color-text-muted)]">
                    {report.breakouts}
                  </span>
                </Link>
              ))}

              {reports.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                  <Calendar className="mb-3 h-10 w-10 text-[var(--color-text-dim)]" />
                  <p className="text-sm font-semibold">No reports yet</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Reports are generated daily. Check back tomorrow.</p>
                </div>
              )}
            </div>

            {/* Status bar */}
            <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--color-text-dim)]">
              <span>{reports.length} item(s)</span>
              <span>Trendit Report Archive</span>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
