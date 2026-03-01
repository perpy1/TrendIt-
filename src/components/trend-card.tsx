"use client";

import { useState } from "react";
import { Trend } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { PlatformIcon } from "./platform-icon";
import { CyberModal } from "./cyber-modal";
import { ExternalLink } from "lucide-react";

interface TrendCardProps {
  trend: Trend;
  index: number;
}

export function TrendCard({ trend }: TrendCardProps) {
  const [hooksOpen, setHooksOpen] = useState(false);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);

  const stageClass = trend.stage === "emerging" ? "cyber-badge-emerging" : "cyber-badge-peaking";
  const scoreWidth = (trend.breakout_score_avg / 10) * 100;

  return (
    <>
      <div className="cyber-card mb-3">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={stageClass}>
              {trend.stage === "emerging" ? "Emerging" : "Peaking"}
            </span>
            <span className="text-sm font-bold">{trend.trend_name}</span>
          </div>
          <div className="flex items-center gap-2">
            {trend.platforms_detected_on.map((p) => (
              <PlatformIcon key={p} platform={p} size={13} />
            ))}
          </div>
        </div>

        {/* Body */}
        <p className="mb-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {trend.trend_summary}
        </p>

        {/* Toggle hooks */}
        <div className="mb-3">
          <button
            onClick={() => setHooksOpen(!hooksOpen)}
            className="cyber-btn text-xs"
          >
            {hooksOpen ? "- Hide Hooks" : "+ View Top 5 Hooks"}
          </button>
        </div>

        {/* Hooks expanded */}
        {hooksOpen && (
          <div className="cyber-groupbox mb-3">
            <span className="cyber-groupbox-label">Top 5 Hooks</span>
            <ol className="mt-2 space-y-2">
              {trend.hooks.map((hook) => (
                <li key={hook.id} className="flex items-start gap-2 text-xs">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[var(--color-accent-dim)] text-[9px] font-bold text-[var(--color-accent)]">
                    {hook.rank}
                  </span>
                  <span>&ldquo;{hook.hook_text}&rdquo;</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Source Videos */}
        <div className="mb-3">
          <p className="mb-2 text-[11px] font-semibold text-[var(--color-text-muted)]">Source Videos:</p>
          <div className="grid grid-cols-3 gap-2">
            {trend.source_videos.map((sv) => (
              <button
                key={sv.id}
                onClick={() => setVideoPopup(sv.id)}
                className="group border border-[var(--color-card-border)] bg-[var(--color-surface)] p-2 text-left transition-colors hover:border-[var(--color-accent)]"
              >
                <div className="mb-1.5 flex aspect-video items-center justify-center bg-black/30">
                  <PlatformIcon platform={sv.content.platform} size={20} />
                </div>
                <p className="truncate text-[10px] font-semibold">
                  @{sv.content.creator_name.toLowerCase().replace(/\s/g, "")}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{formatNumber(sv.content.view_count)} views</p>
              </button>
            ))}
          </div>
        </div>

        {/* Breakout Score */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">Breakout Score:</span>
          <div className="cyber-progress flex-1">
            <div className="cyber-progress-bar" style={{ width: `${scoreWidth}%` }} />
          </div>
          <span className="text-xs font-bold text-[var(--color-accent)]">{trend.breakout_score_avg.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Video Detail Modal */}
      {videoPopup && (() => {
        const sv = trend.source_videos.find((v) => v.id === videoPopup);
        if (!sv) return null;
        return (
          <CyberModal
            title={`${sv.content.creator_name} — ${sv.content.platform}`}
            onClose={() => setVideoPopup(null)}
          >
            <div className="mb-3 flex aspect-video items-center justify-center bg-black/30">
              <PlatformIcon platform={sv.content.platform} size={40} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Creator:</span>
                <span className="font-semibold">{sv.content.creator_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Platform:</span>
                <span className="flex items-center gap-1 font-semibold">
                  <PlatformIcon platform={sv.content.platform} size={12} />
                  {sv.content.platform}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Views:</span>
                <span className="font-semibold">{formatNumber(sv.content.view_count)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Likes:</span>
                <span className="font-semibold">{formatNumber(sv.content.likes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Comments:</span>
                <span className="font-semibold">{formatNumber(sv.content.comments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Breakout Score:</span>
                <span className="font-bold text-[var(--color-accent)]">{sv.content.breakout_score.toFixed(1)}</span>
              </div>
            </div>

            {sv.content.hook_text && (
              <div className="cyber-groupbox mt-3">
                <span className="cyber-groupbox-label">Hook</span>
                <p className="mt-2 text-xs">
                  &ldquo;{sv.content.hook_text}&rdquo;
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <a
                href={sv.content.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary flex items-center gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                Watch Video
              </a>
              <button onClick={() => setVideoPopup(null)} className="cyber-btn text-xs">
                Close
              </button>
            </div>
          </CyberModal>
        );
      })()}
    </>
  );
}
