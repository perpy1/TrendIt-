"use client";

import { useState } from "react";
import { BreakoutSingle } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { PlatformIcon } from "./platform-icon";
import { CyberModal } from "./cyber-modal";
import { ExternalLink } from "lucide-react";

interface BreakoutSingleCardProps {
  single: BreakoutSingle;
  index: number;
}

export function BreakoutSingleCard({ single }: BreakoutSingleCardProps) {
  const c = single.content;
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setDetailOpen(true)}
        className="group flex w-56 shrink-0 flex-col border border-[var(--color-card-border)] bg-[var(--color-surface)] p-3 text-left transition-colors hover:border-[var(--color-accent)]"
      >
        <div className="mb-2 flex aspect-video items-center justify-center bg-black/30">
          <PlatformIcon platform={c.platform} size={24} />
        </div>

        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center bg-[var(--color-accent)] text-[9px] font-bold text-black">
            {c.creator_name.charAt(0)}
          </div>
          <span className="truncate text-[11px] font-semibold">{c.creator_name}</span>
          <PlatformIcon platform={c.platform} size={10} />
        </div>

        <p className="mb-1.5 line-clamp-2 text-[10px] leading-relaxed text-[var(--color-text-muted)]">
          &ldquo;{c.hook_text}&rdquo;
        </p>

        <span className="text-[10px] text-[var(--color-text-dim)]">{formatNumber(c.view_count)} views</span>
      </button>

      {/* Detail Modal */}
      {detailOpen && (
        <CyberModal
          title={`${c.creator_name} — Breakout Content`}
          onClose={() => setDetailOpen(false)}
        >
          <div className="mb-3 flex aspect-video items-center justify-center bg-black/30">
            <PlatformIcon platform={c.platform} size={40} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Creator:</span>
              <span className="font-semibold">{c.creator_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Platform:</span>
              <span className="flex items-center gap-1 font-semibold">
                <PlatformIcon platform={c.platform} size={12} />
                {c.platform}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Views:</span>
              <span className="font-semibold">{formatNumber(c.view_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Likes:</span>
              <span className="font-semibold">{formatNumber(c.likes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Breakout Score:</span>
              <span className="font-bold text-[var(--color-accent)]">{c.breakout_score.toFixed(1)}</span>
            </div>
          </div>

          {c.hook_text && (
            <div className="cyber-groupbox mt-3">
              <span className="cyber-groupbox-label">Hook</span>
              <p className="mt-2 text-xs">
                &ldquo;{c.hook_text}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <a
              href={c.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-primary flex items-center gap-1 text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              Watch Video
            </a>
            <button onClick={() => setDetailOpen(false)} className="cyber-btn text-xs">
              Close
            </button>
          </div>
        </CyberModal>
      )}
    </>
  );
}
