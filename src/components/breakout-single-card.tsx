"use client";

import { useState } from "react";
import { BreakoutSingle } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { PlatformIcon } from "./platform-icon";
import { useSound } from "@/lib/use-sound";
import { VistaWindow } from "./vista-window";
import { ExternalLink, FileText } from "lucide-react";

interface BreakoutSingleCardProps {
  single: BreakoutSingle;
  index: number;
}

export function BreakoutSingleCard({ single, index }: BreakoutSingleCardProps) {
  const c = single.content;
  const { playClick, playWindowOpen, playWindowClose } = useSound();
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          playWindowOpen();
          setDetailOpen(true);
        }}
        className="group flex w-56 shrink-0 flex-col rounded border border-[#d0d0d0] bg-white p-3 text-left transition-colors hover:border-blue-400 hover:bg-blue-50"
      >
        <div className="mb-2 flex aspect-video items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
          <PlatformIcon platform={c.platform} size={24} />
        </div>

        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700">
            {c.creator_name.charAt(0)}
          </div>
          <span className="truncate text-[11px] font-semibold text-[#1a1a1a]">{c.creator_name}</span>
          <PlatformIcon platform={c.platform} size={10} />
        </div>

        <p className="mb-1.5 line-clamp-2 font-mono text-[10px] leading-relaxed text-[#444]">
          &ldquo;{c.hook_text}&rdquo;
        </p>

        <span className="text-[10px] text-[#777]">{formatNumber(c.view_count)} views</span>
      </button>

      {/* Detail Popup */}
      {detailOpen && (
        <VistaWindow
          title={`${c.creator_name} — Breakout Content`}
          icon={<FileText className="h-4 w-4 text-white" />}
          width="360px"
          isPopup
          onClose={() => {
            playWindowClose();
            setDetailOpen(false);
          }}
          showMinimize={false}
          showMaximize={false}
        >
          <div className="p-4">
            <div className="mb-3 flex aspect-video items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
              <PlatformIcon platform={c.platform} size={40} />
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#555]">Creator:</span>
                <span className="font-semibold text-[#1a1a1a]">{c.creator_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Platform:</span>
                <span className="flex items-center gap-1 font-semibold text-[#1a1a1a]">
                  <PlatformIcon platform={c.platform} size={12} />
                  {c.platform}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Views:</span>
                <span className="font-semibold text-[#1a1a1a]">{formatNumber(c.view_count)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Likes:</span>
                <span className="font-semibold text-[#1a1a1a]">{formatNumber(c.likes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Breakout Score:</span>
                <span className="font-bold text-[#1a6a1a]">{c.breakout_score.toFixed(1)}</span>
              </div>
            </div>

            {c.hook_text && (
              <div className="vista-groupbox mt-3">
                <span className="vista-groupbox-label">Hook</span>
                <p className="mt-1 font-mono text-[11px] text-[#333]">
                  &ldquo;{c.hook_text}&rdquo;
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <a
                href={c.post_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                className="vista-btn vista-btn-primary flex items-center gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                Watch Video
              </a>
              <button onClick={() => { playClick(); setDetailOpen(false); }} className="vista-btn text-xs">
                Close
              </button>
            </div>
          </div>
        </VistaWindow>
      )}
    </>
  );
}
