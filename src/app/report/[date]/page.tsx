"use client";

import { use } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TrendCard } from "@/components/trend-card";
import { BreakoutSingleCard } from "@/components/breakout-single-card";
import { VistaWindow } from "@/components/vista-window";
import { getReportByDate } from "@/lib/mock-data";
import { formatDate, formatNumber } from "@/lib/utils";
import { useSound } from "@/lib/use-sound";
import { BarChart3, TrendingUp, Layers, Bell, ArrowLeft, ArrowRight, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function ReportPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const report = getReportByDate(date);
  const { playClick, playNavigate } = useSound();

  const prevDate = new Date(new Date(date + "T12:00:00").getTime() - 86400000).toISOString().split("T")[0];
  const nextDate = new Date(new Date(date + "T12:00:00").getTime() + 86400000).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;
  const isFuture = date > today;

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-2.5rem)] items-start justify-center p-4 md:p-6">
        <VistaWindow
          title={`Trendit — Daily Report${report ? ` — ${formatDate(report.report_date)}` : ""}`}
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          width="100%"
          bodyClassName="max-h-[calc(100vh-6rem)] overflow-y-auto"
          className="max-w-3xl"
          showMinimize
          showMaximize
        >
          <div className="p-4 md:p-6">
            {!report || isFuture ? (
              /* Empty state */
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-50">
                  <AlertCircle className="h-7 w-7 text-yellow-600" />
                </div>
                <h2 className="mb-2 text-base font-bold text-[#1a1a1a]">
                  {isFuture ? "This report hasn't been generated yet" : "No report found for this date"}
                </h2>
                <p className="mb-5 text-xs text-[#555]">
                  {isToday
                    ? "Today's report is being prepared. Check back soon."
                    : "Try viewing a different date or check the archive."}
                </p>
                <div className="flex gap-2">
                  <Link href="/archive" onClick={playNavigate}>
                    <span className="vista-btn text-xs">View Archive</span>
                  </Link>
                  <Link href={`/report/${prevDate}`} onClick={playNavigate}>
                    <span className="vista-btn vista-btn-primary text-xs">Previous Report</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Navigation */}
                <div className="mb-4 flex items-center justify-between">
                  <Link href={`/report/${prevDate}`} onClick={playNavigate}>
                    <span className="vista-btn flex items-center gap-1 text-[11px]">
                      <ArrowLeft className="h-3 w-3" /> Previous
                    </span>
                  </Link>
                  {!isToday && (
                    <Link href={`/report/${nextDate}`} onClick={playNavigate}>
                      <span className="vista-btn flex items-center gap-1 text-[11px]">
                        Next <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  )}
                </div>

                {/* Report Header */}
                <div className="mb-5">
                  <p className="mb-1 text-[11px] font-semibold text-blue-600">
                    {isToday ? "Today's Report" : "Past Report"}
                  </p>
                  <p className="mb-2 text-xs text-[#777]">{formatDate(report.report_date)}</p>
                  <h1 className="mb-4 text-xl font-bold text-[#1a1a1a] md:text-2xl">
                    {report.report_title}
                  </h1>

                  {/* Stats bar */}
                  <div className="vista-infobar flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                      <strong>{report.total_trends_count}</strong>
                      <span className="text-[#555]">trends</span>
                    </div>
                    <div className="h-4 w-px bg-[#bcd4ea]" />
                    <div className="flex items-center gap-1.5 text-xs">
                      <Layers className="h-3.5 w-3.5 text-purple-600" />
                      <strong>{report.total_breakout_videos_count}</strong>
                      <span className="text-[#555]">breakout videos</span>
                    </div>
                    <div className="h-4 w-px bg-[#bcd4ea]" />
                    <div className="flex items-center gap-1.5 text-xs">
                      <BarChart3 className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-[#555]">3 platforms</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Trends */}
                <div className="mb-5">
                  <h2 className="mb-3 text-sm font-bold text-[#1a3a5a]">
                    <FileText className="mr-1 inline h-4 w-4" />
                    Top Trends
                  </h2>
                  {report.trends.map((trend, i) => (
                    <TrendCard key={trend.id} trend={trend} index={i} />
                  ))}
                </div>

                {/* Section 2: Breakout Singles */}
                {report.breakout_singles.length > 0 && (
                  <div className="mb-5">
                    <h2 className="mb-2 text-sm font-bold text-[#1a3a5a]">Breakout Content</h2>
                    <p className="mb-3 text-[11px] text-[#555]">
                      Notable viral videos that didn&apos;t cluster into a trend pattern. Click for details.
                    </p>
                    <div className="scroll-container -mx-2 flex gap-3 overflow-x-auto px-2 pb-3">
                      {report.breakout_singles.map((single, i) => (
                        <BreakoutSingleCard key={single.id} single={single} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 3: Footer */}
                <div className="vista-infobar flex-col items-center gap-2 text-center">
                  <p className="text-sm font-semibold text-[#1a1a1a]">That&apos;s today&apos;s report</p>
                  <p className="text-[11px] text-[#555]">
                    {formatNumber(report.total_breakout_videos_count)} breakout videos analyzed across 3 platforms.
                  </p>
                  <div className="mt-1 flex gap-2">
                    <Link href="/settings" onClick={playClick}>
                      <span className="vista-btn flex items-center gap-1 text-[11px]">
                        <Bell className="h-3 w-3" />
                        Connect Telegram
                      </span>
                    </Link>
                    <Link href="/archive" onClick={playNavigate}>
                      <span className="vista-btn text-[11px]">Past Reports &rarr;</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </VistaWindow>
      </div>
    </AuthGuard>
  );
}
