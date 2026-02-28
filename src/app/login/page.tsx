"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/use-sound";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VistaWindow } from "@/components/vista-window";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const { playClick, playWindowOpen, playError } = useSound();
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
    playClick();
    if (!email || !password) {
      playError();
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      playWindowOpen();
      router.push("/report");
    } catch {
      playError();
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center p-6">
      <VistaWindow
        title="Log On to Trendit"
        icon={<Shield className="h-4 w-4 text-white" />}
        width="380px"
        showMinimize={false}
        showMaximize={false}
        onClose={() => { playClick(); router.push("/"); }}
      >
        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a]">Welcome back</h2>
              <p className="text-[11px] text-[#555]">Sign in to access your daily trend reports</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="vista-infobar border-red-300 bg-red-50 text-xs text-red-700">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#333]">Email address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClick={playClick}
                className="vista-input w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#333]">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onClick={playClick}
                className="vista-input w-full"
                placeholder="Enter password"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button type="submit" disabled={loading} className="vista-btn vista-btn-primary">
                {loading ? "Signing in..." : "Log On"}
              </button>
              <button type="button" onClick={() => { playClick(); router.push("/"); }} className="vista-btn">
                Cancel
              </button>
            </div>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d0d0d0]" />
            <span className="text-[10px] text-[#888]">or sign in with</span>
            <div className="h-px flex-1 bg-[#d0d0d0]" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { playClick(); login("google@demo.com", "").then(() => { playWindowOpen(); router.push("/report"); }); }}
              className="vista-btn flex flex-1 items-center justify-center gap-1.5 text-xs"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              onClick={() => { playClick(); login("twitter@demo.com", "").then(() => { playWindowOpen(); router.push("/report"); }); }}
              className="vista-btn flex flex-1 items-center justify-center gap-1.5 text-xs"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#333"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X (Twitter)
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] text-[#555]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="vista-link" onClick={playClick}>
              Sign up free
            </Link>
          </p>
        </div>
      </VistaWindow>
    </div>
  );
}
