"use client";

import { AuthGuard } from "@/components/auth-guard";
import { VistaWindow } from "@/components/vista-window";
import { pastReports } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useSound } from "@/lib/use-sound";
import { Calendar, TrendingUp, Folder } from "lucide-react";
import Link from "next/link";

export default function ArchivePage() {
  const { playClick, playNavigate } = useSound();

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-2.5rem)] items-start justify-center p-4 md:p-6">
        <VistaWindow
          title="Trendit — Report Archive"
          icon={<Folder className="h-4 w-4 text-white" />}
          width="100%"
          className="max-w-2xl"
          bodyClassName="max-h-[calc(100vh-6rem)] overflow-y-auto"
          showMinimize
          showMaximize
        >
          <div className="p-4">
            {/* Address bar style header */}
            <div className="vista-infobar mb-4">
              <Folder className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-[#555]">Archive &gt; All Reports</span>
            </div>

            {/* Explorer-style file list */}
            <div className="overflow-hidden rounded border border-[#d0d0d0]">
              {/* Column headers */}
              <div className="flex items-center gap-3 border-b border-[#d0d0d0] bg-gradient-to-b from-white to-[#f4f4f4] px-3 py-1.5 text-[11px] font-semibold text-[#555]">
                <span className="w-6" />
                <span className="flex-1">Report Title</span>
                <span className="hidden w-32 sm:block">Date</span>
                <span className="w-16 text-center">Trends</span>
                <span className="w-16 text-center">Videos</span>
              </div>

              {/* File rows */}
              {pastReports.map((report, i) => (
                <Link
                  key={report.id}
                  href={`/report/${report.report_date}`}
                  onClick={playNavigate}
                  className={`flex items-center gap-3 border-b border-[#ececec] px-3 py-2 text-[12px] transition-colors hover:bg-[#cce8ff] ${
                    i % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"
                  }`}
                >
                  <Calendar className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="flex-1 font-semibold text-[#1a1a1a]">
                    {report.report_title}
                  </span>
                  <span className="hidden w-32 text-[#555] sm:block">
                    {formatDate(report.report_date)}
                  </span>
                  <span className="flex w-16 items-center justify-center gap-1 text-[#555]">
                    <TrendingUp className="h-3 w-3" />
                    {report.total_trends_count}
                  </span>
                  <span className="w-16 text-center text-[#555]">
                    {report.total_breakout_videos_count}
                  </span>
                </Link>
              ))}

              {pastReports.length === 0 && (
                <div className="flex flex-col items-center py-10 text-center">
                  <Calendar className="mb-3 h-10 w-10 text-[#ccc]" />
                  <p className="text-sm font-semibold text-[#555]">No reports yet</p>
                  <p className="text-[11px] text-[#888]">Reports are generated daily. Check back tomorrow.</p>
                </div>
              )}
            </div>

            {/* Status bar */}
            <div className="mt-2 flex items-center justify-between text-[10px] text-[#888]">
              <span>{pastReports.length} item(s)</span>
              <span>Trendit Report Archive</span>
            </div>
          </div>
        </VistaWindow>
      </div>
    </AuthGuard>
  );
}
