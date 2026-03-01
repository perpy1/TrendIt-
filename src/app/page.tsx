"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { CyberPanel } from "@/components/cyber-panel";
import { CyberModal } from "@/components/cyber-modal";
import { TrendingUp, Mail, ArrowRight } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { useState } from "react";

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
  const [showSample, setShowSample] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribeState("success");
        setEmail("");
      } else {
        setSubscribeState("error");
      }
    } catch {
      setSubscribeState("error");
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center bg-[var(--color-accent)]">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
        </div>
        <h1 className="pixel-heading mb-3 text-lg text-[var(--color-accent)] neon-pulse md:text-xl">
          Trendit
        </h1>
        <p className="mx-auto max-w-md text-sm text-[var(--color-text-muted)]">
          The daily trend report for creators who build in public. We monitor{" "}
          <span className="text-[var(--color-accent)]">50+ top creators</span> across
          TikTok, Instagram, and YouTube.
        </p>
      </div>

      {/* Email Signup */}
      <div className="mx-auto mb-8 w-full max-w-lg">
        <CyberPanel>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-4 w-4 text-[var(--color-accent)]" />
            <span className="pixel-heading text-[10px] text-[var(--color-accent)]">
              Get daily reports in your inbox
            </span>
          </div>

          {subscribeState === "success" ? (
            <div className="cyber-card border-[var(--color-accent)] bg-[var(--color-accent-dim)] p-3 text-center">
              <p className="text-sm font-semibold text-[var(--color-accent)]">You&apos;re in!</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                We&apos;ll send you daily trend reports straight to your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="cyber-input flex-1"
                required
              />
              <button
                type="submit"
                disabled={subscribeState === "loading"}
                className="cyber-btn-primary flex shrink-0 items-center gap-1 whitespace-nowrap"
              >
                {subscribeState === "loading" ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </form>
          )}

          {subscribeState === "error" && (
            <p className="mt-2 text-xs text-[var(--color-danger)]">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="mt-3 text-[10px] text-[var(--color-text-dim)]">
            Free daily reports. No spam. Unsubscribe anytime.
          </p>
        </CyberPanel>
      </div>

      {/* How it works */}
      <CyberPanel className="mx-auto w-full max-w-lg">
        <div className="cyber-panel-header">How it works</div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--color-accent)] text-xs font-bold text-black">
              1
            </span>
            <span>We monitor 50+ creators across 3 platforms every 2-4 hours</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--color-accent)] text-xs font-bold text-black">
              2
            </span>
            <span>Our velocity engine detects content performing 3x+ above baseline</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--color-accent)] text-xs font-bold text-black">
              3
            </span>
            <span>You get a daily report with trends, hooks, and breakout content</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push(user ? "/report" : "/signup")}
            className="cyber-btn-primary"
          >
            {user ? "View Today's Report" : "Sign Up Free"}
          </button>
          <button
            onClick={() => setShowSample(true)}
            className="cyber-btn"
          >
            View Sample Trend
          </button>
          {!user && (
            <button
              onClick={() => router.push("/login")}
              className="cyber-btn"
            >
              Log In
            </button>
          )}
        </div>
      </CyberPanel>

      {/* Sample Trend Modal */}
      {showSample && (
        <CyberModal
          title="Sample Trend — Preview"
          onClose={() => setShowSample(false)}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="cyber-badge-emerging">Emerging</span>
            <div className="flex items-center gap-2">
              <PlatformIcon platform="tiktok" size={14} />
              <PlatformIcon platform="instagram" size={14} />
              <PlatformIcon platform="youtube" size={14} />
            </div>
          </div>

          <h3 className="mb-2 text-sm font-bold text-[var(--color-text)]">
            The &ldquo;Build in Public&rdquo; Documentary Style
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Creators are filming raw footage of their daily building process as
            mini-documentaries. Velocity spiked 4.2x across 3 platforms in 8 hours.
          </p>

          <div className="cyber-groupbox mb-4">
            <span className="cyber-groupbox-label">Top 5 Hooks</span>
            <ol className="mt-2 space-y-2">
              {sampleHooks.map((hook, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[var(--color-accent-dim)] text-[9px] font-bold text-[var(--color-accent)]">
                    {i + 1}
                  </span>
                  <span>&ldquo;{hook}&rdquo;</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">Breakout Score:</span>
            <div className="cyber-progress flex-1">
              <div className="cyber-progress-bar" style={{ width: "86%" }} />
            </div>
            <span className="text-xs font-bold text-[var(--color-accent)]">8.6/10</span>
          </div>
        </CyberModal>
      )}
    </div>
  );
}
