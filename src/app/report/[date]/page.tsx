"use client";

import { use, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TrendCard } from "@/components/trend-card";
import { BreakoutSingleCard } from "@/components/breakout-single-card";
import { CyberPanel } from "@/components/cyber-panel";
import { formatDate, formatNumber } from "@/lib/utils";
import { BarChart3, TrendingUp, Layers, Bell, ArrowLeft, ArrowRight, AlertCircle, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import type { DailyReport } from "@/lib/types";

export default function ReportPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/report?date=${date}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReport(data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [date]);

  const prevDate = new Date(new Date(date + "T12:00:00").getTime() - 86400000).toISOString().split("T")[0];
  const nextDate = new Date(new Date(date + "T12:00:00").getTime() + 86400000).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;
  const isFuture = date > today;

  return (
    <AuthGuard>
      <div className="mx-auto max-w-3xl">
        {loading ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[var(--color-accent)]" />
            <p className="text-xs text-[var(--color-text-muted)]">Loading report...</p>
          </div>
        ) : !report || isFuture ? (
          /* Empty state */
          <div className="flex flex-col items-center py-16 text-center">
            <AlertCircle className="mb-4 h-10 w-10 text-[var(--color-warning)]" />
            <h2 className="mb-2 text-sm font-bold">
              {isFuture ? "This report hasn't been generated yet" : "No report found for this date"}
            </h2>
            <p className="mb-5 text-xs text-[var(--color-text-muted)]">
              {isToday
                ? "Today's report is being prepared. Check back soon."
                : "Try viewing a different date or check the archive."}
            </p>
            <div className="flex gap-3">
              <Link href="/archive" className="cyber-btn text-xs">View Archive</Link>
              <Link href={`/report/${prevDate}`} className="cyber-btn-primary text-xs">Previous Report</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation */}
            <div className="mb-4 flex items-center justify-between">
              <Link href={`/report/${prevDate}`} className="cyber-btn flex items-center gap-1 text-xs">
                <ArrowLeft className="h-3 w-3" /> Previous
              </Link>
              {!isToday && (
                <Link href={`/report/${nextDate}`} className="cyber-btn flex items-center gap-1 text-xs">
                  Next <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {/* Report Header */}
            <div className="mb-6">
              <p className="mb-1 pixel-heading text-[10px] text-[var(--color-accent)]">
                {isToday ? "Today's Report" : "Past Report"}
              </p>
              <p className="mb-2 text-xs text-[var(--color-text-muted)]">{formatDate(report.report_date)}</p>
              <h1 className="mb-4 text-xl font-bold md:text-2xl">
                {report.report_title}
              </h1>

              {/* Stats bar */}
              <div className="cyber-card flex flex-wrap items-center gap-4 p-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <TrendingUp className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  <strong>{report.total_trends_count}</strong>
                  <span className="text-[var(--color-text-muted)]">trends</span>
                </div>
                <div className="h-4 w-px bg-[var(--color-card-border)]" />
                <div className="flex items-center gap-1.5 text-xs">
                  <Layers className="h-3.5 w-3.5 text-[var(--color-blue)]" />
                  <strong>{report.total_breakout_videos_count}</strong>
                  <span className="text-[var(--color-text-muted)]">breakout videos</span>
                </div>
                <div className="h-4 w-px bg-[var(--color-card-border)]" />
                <div className="flex items-center gap-1.5 text-xs">
                  <BarChart3 className="h-3.5 w-3.5 text-[var(--color-warning)]" />
                  <span className="text-[var(--color-text-muted)]">YouTube</span>
                </div>
              </div>
            </div>

            {/* Section 1: Trends */}
            <div className="mb-6">
              <h2 className="pixel-heading mb-4 text-xs text-[var(--color-accent)]">
                <FileText className="mr-1 inline h-4 w-4" />
                Top Trends
              </h2>
              {report.trends.map((trend, i) => (
                <TrendCard key={trend.id} trend={trend} index={i} />
              ))}
            </div>

            {/* Section 2: Breakout Singles */}
            {report.breakout_singles.length > 0 && (
              <div className="mb-6">
                <h2 className="pixel-heading mb-2 text-xs text-[var(--color-accent)]">Breakout Content</h2>
                <p className="mb-3 text-xs text-[var(--color-text-muted)]">
                  Notable viral videos that didn&apos;t cluster into a trend pattern.
                </p>
                <div className="scroll-container -mx-2 flex gap-3 overflow-x-auto px-2 pb-3">
                  {report.breakout_singles.map((single, i) => (
                    <BreakoutSingleCard key={single.id} single={single} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Footer */}
            <CyberPanel className="text-center">
              <p className="text-sm font-semibold">That&apos;s today&apos;s report</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {formatNumber(report.total_breakout_videos_count)} breakout videos analyzed across YouTube.
              </p>
              <div className="mt-3 flex justify-center gap-3">
                <Link href="/settings" className="cyber-btn flex items-center gap-1 text-xs">
                  <Bell className="h-3 w-3" />
                  Connect Telegram
                </Link>
                <Link href="/archive" className="cyber-btn text-xs">
                  Past Reports &rarr;
                </Link>
              </div>
            </CyberPanel>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
