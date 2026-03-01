"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CyberPanel } from "@/components/cyber-panel";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push("/report");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/report");
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <CyberPanel className="w-full max-w-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[var(--color-accent)]">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="pixel-heading text-xs text-[var(--color-accent)]">Welcome back</h2>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Sign in to access your daily trend reports</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="cyber-card border-[var(--color-danger)] bg-[rgba(255,51,51,0.1)] p-3 text-xs text-[var(--color-danger)]">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--color-text-muted)]">Email address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--color-text-muted)]">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input"
              placeholder="Enter password"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={loading} className="cyber-btn-primary">
              {loading ? "Signing in..." : "Log On"}
            </button>
            <button type="button" onClick={() => router.push("/")} className="cyber-btn">
              Cancel
            </button>
          </div>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-card-border)]" />
          <span className="text-[10px] text-[var(--color-text-dim)]">or sign in with</span>
          <div className="h-px flex-1 bg-[var(--color-card-border)]" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => login("google@demo.com", "").then(() => router.push("/report"))}
            className="cyber-btn flex flex-1 items-center justify-center gap-1.5 text-xs"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button
            onClick={() => login("twitter@demo.com", "").then(() => router.push("/report"))}
            className="cyber-btn flex flex-1 items-center justify-center gap-1.5 text-xs"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X (Twitter)
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="cyber-link">
            Sign up free
          </Link>
        </p>
      </CyberPanel>
    </div>
  );
}
