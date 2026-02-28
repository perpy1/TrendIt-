"use client";

import { useState } from "react";
import { Trend } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { PlatformIcon } from "./platform-icon";
import { useSound } from "@/lib/use-sound";
import { VistaWindow } from "./vista-window";
import { ExternalLink, FileText } from "lucide-react";

interface TrendCardProps {
  trend: Trend;
  index: number;
}

export function TrendCard({ trend, index }: TrendCardProps) {
  const [hooksOpen, setHooksOpen] = useState(false);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);
  const { playClick, playExpand, playCollapse, playWindowOpen, playWindowClose } = useSound();

  const stageClass = trend.stage === "emerging" ? "vista-badge-emerging" : "vista-badge-peaking";
  const stageEmoji = trend.stage === "emerging" ? "\uD83D\uDFE2" : "\uD83D\uDFE1";
  const scoreWidth = (trend.breakout_score_avg / 10) * 100;

  return (
    <>
      <div className="vista-panel mb-3">
        {/* Panel Header */}
        <div className="vista-panel-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={stageClass}>{stageEmoji} {trend.stage === "emerging" ? "Emerging" : "Peaking"}</span>
            <span className="font-bold text-[#1a3a5a]">{trend.trend_name}</span>
          </div>
          <div className="flex items-center gap-2">
            {trend.platforms_detected_on.map((p) => (
              <PlatformIcon key={p} platform={p} size={13} />
            ))}
          </div>
        </div>

        {/* Panel Body */}
        <div className="p-3">
          <p className="mb-3 text-[12px] leading-relaxed text-[#444]">
            {trend.trend_summary}
          </p>

          {/* Action buttons row */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (hooksOpen) {
                  playCollapse();
                } else {
                  playExpand();
                }
                setHooksOpen(!hooksOpen);
              }}
              className="vista-btn text-xs"
            >
              {hooksOpen ? "▾ Hide Hooks" : "▸ View Top 5 Hooks"}
            </button>
          </div>

          {/* Hooks expanded inline */}
          {hooksOpen && (
            <div className="vista-groupbox mb-3">
              <span className="vista-groupbox-label">Top 5 Hooks</span>
              <ol className="mt-1 space-y-1.5">
                {trend.hooks.map((hook) => (
                  <li key={hook.id} className="flex items-start gap-2 text-[12px] text-[#333]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-50 text-[9px] font-bold text-blue-700">
                      {hook.rank}
                    </span>
                    <span className="font-mono">&ldquo;{hook.hook_text}&rdquo;</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Source Videos */}
          <div className="mb-3">
            <p className="mb-2 text-[11px] font-semibold text-[#555]">Source Videos:</p>
            <div className="grid grid-cols-3 gap-2">
              {trend.source_videos.map((sv) => (
                <button
                  key={sv.id}
                  onClick={() => {
                    playWindowOpen();
                    setVideoPopup(sv.id);
                  }}
                  className="group rounded border border-[#d0d0d0] bg-white p-2 text-left transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="mb-1.5 flex aspect-video items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
                    <PlatformIcon platform={sv.content.platform} size={20} />
                  </div>
                  <p className="truncate text-[10px] font-semibold text-[#333]">
                    @{sv.content.creator_name.toLowerCase().replace(/\s/g, "")}
                  </p>
                  <p className="text-[10px] text-[#777]">{formatNumber(sv.content.view_count)} views</p>
                </button>
              ))}
            </div>
          </div>

          {/* Breakout Score */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#555]">Breakout Score:</span>
            <div className="vista-progress flex-1">
              <div className="vista-progress-bar" style={{ width: `${scoreWidth}%` }} />
            </div>
            <span className="text-xs font-bold text-[#1a6a1a]">{trend.breakout_score_avg.toFixed(1)}/10</span>
          </div>
        </div>
      </div>

      {/* Video Detail Popup */}
      {videoPopup && (() => {
        const sv = trend.source_videos.find((v) => v.id === videoPopup);
        if (!sv) return null;
        return (
          <VistaWindow
            title={`${sv.content.creator_name} — ${sv.content.platform}`}
            icon={<FileText className="h-4 w-4 text-white" />}
            width="360px"
            isPopup
            onClose={() => {
              playWindowClose();
              setVideoPopup(null);
            }}
            showMinimize={false}
            showMaximize={false}
          >
            <div className="p-4">
              <div className="mb-3 flex aspect-video items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
                <PlatformIcon platform={sv.content.platform} size={40} />
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#555]">Creator:</span>
                  <span className="font-semibold text-[#1a1a1a]">{sv.content.creator_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Platform:</span>
                  <span className="flex items-center gap-1 font-semibold text-[#1a1a1a]">
                    <PlatformIcon platform={sv.content.platform} size={12} />
                    {sv.content.platform}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Views:</span>
                  <span className="font-semibold text-[#1a1a1a]">{formatNumber(sv.content.view_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Likes:</span>
                  <span className="font-semibold text-[#1a1a1a]">{formatNumber(sv.content.likes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Comments:</span>
                  <span className="font-semibold text-[#1a1a1a]">{formatNumber(sv.content.comments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Breakout Score:</span>
                  <span className="font-bold text-[#1a6a1a]">{sv.content.breakout_score.toFixed(1)}</span>
                </div>
              </div>

              {sv.content.hook_text && (
                <div className="vista-groupbox mt-3">
                  <span className="vista-groupbox-label">Hook</span>
                  <p className="mt-1 font-mono text-[11px] text-[#333]">
                    &ldquo;{sv.content.hook_text}&rdquo;
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <a
                  href={sv.content.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  className="vista-btn vista-btn-primary flex items-center gap-1 text-xs"
                >
                  <ExternalLink className="h-3 w-3" />
                  Watch Video
                </a>
                <button onClick={() => { playClick(); setVideoPopup(null); }} className="vista-btn text-xs">
                  Close
                </button>
              </div>
            </div>
          </VistaWindow>
        );
      })()}
    </>
  );
}
