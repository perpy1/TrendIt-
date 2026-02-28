"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { TrendingUp, Archive, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Trendit</span>
        </Link>

        {user && (
          <>
            {/* Desktop nav */}
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/report"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  pathname.startsWith("/report") ? "text-foreground" : "text-muted"
                }`}
              >
                Today&apos;s Report
              </Link>
              <Link
                href="/archive"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  pathname === "/archive" ? "text-foreground" : "text-muted"
                }`}
              >
                Archive
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href="/settings"
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-card-bg hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-card-bg hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="rounded-lg p-2 text-muted md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}

        {!user && (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Sign up free
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {user && menuOpen && (
        <div className="border-t border-card-border bg-background p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/report"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card-bg hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Today&apos;s Report
            </Link>
            <Link
              href="/archive"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card-bg hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <Archive className="h-4 w-4" /> Archive
              </span>
            </Link>
            <Link
              href="/settings"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card-bg hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </span>
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-card-bg hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Log out
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
