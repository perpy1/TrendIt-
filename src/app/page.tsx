"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/use-sound";
import { VistaWindow } from "@/components/vista-window";
import { TrendingUp, Archive, Settings, FileText, Globe, Shield } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { useEffect, useState } from "react";

const sampleHooks = [
  "I filmed every minute of building my app for 30 days",
  "Nobody talks about the ugly middle of building",
  "Day 1 vs Day 30 of building in public",
  "Raw footage, no script, just building",
  "What building a product actually looks like",
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { playClick, playWindowOpen, playStartup } = useSound();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSample, setShowSample] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
      playStartup();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDesktopIcon = (href: string) => {
    playClick();
    playWindowOpen();
    router.push(href);
  };

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-col items-center p-6">
      {/* Desktop Icons */}
      <div className="mb-6 flex flex-wrap gap-4 self-start">
        {user ? (
          <>
            <button className="vista-desktop-icon" onClick={() => handleDesktopIcon("/report")} onDoubleClick={() => handleDesktopIcon("/report")}>
              <div className="vista-desktop-icon-img">
                <TrendingUp className="h-10 w-10 text-blue-300" />
              </div>
              <span className="vista-desktop-icon-label">Today&apos;s Report</span>
            </button>
            <button className="vista-desktop-icon" onClick={() => handleDesktopIcon("/archive")} onDoubleClick={() => handleDesktopIcon("/archive")}>
              <div className="vista-desktop-icon-img">
                <Archive className="h-10 w-10 text-yellow-300" />
              </div>
              <span className="vista-desktop-icon-label">Archive</span>
            </button>
            <button className="vista-desktop-icon" onClick={() => handleDesktopIcon("/settings")} onDoubleClick={() => handleDesktopIcon("/settings")}>
              <div className="vista-desktop-icon-img">
                <Settings className="h-10 w-10 text-gray-300" />
              </div>
              <span className="vista-desktop-icon-label">Control Panel</span>
            </button>
          </>
        ) : (
          <>
            <button className="vista-desktop-icon" onClick={() => handleDesktopIcon("/signup")}>
              <div className="vista-desktop-icon-img">
                <Globe className="h-10 w-10 text-green-300" />
              </div>
              <span className="vista-desktop-icon-label">Sign Up</span>
            </button>
            <button className="vista-desktop-icon" onClick={() => handleDesktopIcon("/login")}>
              <div className="vista-desktop-icon-img">
                <Shield className="h-10 w-10 text-blue-300" />
              </div>
              <span className="vista-desktop-icon-label">Log In</span>
            </button>
          </>
        )}
      </div>

      {/* Welcome Window */}
      {showWelcome && (
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <VistaWindow
            title="Welcome to Trendit"
            icon={<TrendingUp className="h-4 w-4 text-white" />}
            width="480px"
            onClose={() => setShowWelcome(false)}
            showMinimize={false}
            showMaximize={false}
          >
            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1a1a1a]">Trendit</h2>
                  <p className="text-xs text-[#555]">Daily Creator Trend Intelligence</p>
                </div>
              </div>

              <p className="mb-4 text-[13px] leading-relaxed text-[#333]">
                The daily trend report for creators who build in public. We monitor <strong>50+ top creators</strong> across TikTok, Instagram, and YouTube to detect breakout content and emerging trends.
              </p>

              <div className="vista-groupbox mb-4">
                <span className="vista-groupbox-label">How it works</span>
                <div className="mt-1 space-y-2 text-[12px] text-[#333]">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700">1</span>
                    <span>We monitor 50+ creators across 3 platforms every 2-4 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700">2</span>
                    <span>Our velocity engine detects content performing 3x+ above baseline</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700">3</span>
                    <span>You get a beautifully designed daily report with trends & hooks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClick();
                    router.push(user ? "/report" : "/signup");
                  }}
                  className="vista-btn vista-btn-primary"
                >
                  {user ? "View Today's Report" : "Sign Up Free"}
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setShowSample(true);
                  }}
                  className="vista-btn"
                >
                  View Sample Trend
                </button>
                {!user && (
                  <button
                    onClick={() => {
                      playClick();
                      router.push("/login");
                    }}
                    className="vista-btn"
                  >
                    Log In
                  </button>
                )}
              </div>
            </div>
          </VistaWindow>

          {/* Sample Trend Window */}
          {showSample && (
            <VistaWindow
              title="Sample Trend — Preview"
              icon={<FileText className="h-4 w-4 text-white" />}
              width="420px"
              isPopup
              onClose={() => {
                setShowSample(false);
              }}
              showMinimize={false}
              showMaximize={false}
            >
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="vista-badge-emerging">{"\uD83D\uDFE2"} Emerging</span>
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform="tiktok" size={14} />
                    <PlatformIcon platform="instagram" size={14} />
                    <PlatformIcon platform="youtube" size={14} />
                  </div>
                </div>

                <h3 className="mb-2 text-sm font-bold text-[#1a1a1a]">
                  The &ldquo;Build in Public&rdquo; Documentary Style
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-[#555]">
                  Creators are filming raw footage of their daily building process as mini-documentaries. Velocity spiked 4.2x across 3 platforms in 8 hours.
                </p>

                <div className="vista-groupbox mb-3">
                  <span className="vista-groupbox-label">Top 5 Hooks</span>
                  <ol className="mt-1 space-y-1.5">
                    {sampleHooks.map((hook, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#333]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-50 text-[9px] font-bold text-blue-700">
                          {i + 1}
                        </span>
                        <span className="font-mono">&ldquo;{hook}&rdquo;</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#555]">Breakout Score:</span>
                  <div className="vista-progress flex-1">
                    <div className="vista-progress-bar" style={{ width: "86%" }} />
                  </div>
                  <span className="text-xs font-bold text-[#1a6a1a]">8.6/10</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={() => { playClick(); setShowSample(false); }} className="vista-btn">
                    Close
                  </button>
                </div>
              </div>
            </VistaWindow>
          )}
        </div>
      )}
    </div>
  );
}
