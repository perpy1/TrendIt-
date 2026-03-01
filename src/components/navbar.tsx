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

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium transition-all ${
      active
        ? "text-[var(--color-accent)] neon-pulse"
        : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-card-border)] bg-[var(--color-background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center bg-[var(--color-accent)]">
            <TrendingUp className="h-4 w-4 text-black" />
          </div>
          <span className="pixel-heading text-xs text-[var(--color-accent)]">
            Trendit
          </span>
        </Link>

        {user && (
          <>
            {/* Desktop nav */}
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/report"
                className={navLinkClass(pathname.startsWith("/report"))}
              >
                Today&apos;s Report
              </Link>
              <Link
                href="/archive"
                className={navLinkClass(pathname === "/archive")}
              >
                Archive
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href="/settings"
                  className="p-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-danger)]"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <div className="flex h-7 w-7 items-center justify-center bg-[var(--color-accent)] text-xs font-bold text-black">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="p-2 text-[var(--color-text-muted)] md:hidden"
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
              className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="cyber-btn-primary px-4 py-2 text-sm"
            >
              Sign up free
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {user && menuOpen && (
        <div className="border-t border-[var(--color-card-border)] bg-[var(--color-background)] p-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/report"
              className="px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
              onClick={() => setMenuOpen(false)}
            >
              Today&apos;s Report
            </Link>
            <Link
              href="/archive"
              className="px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <Archive className="h-4 w-4" /> Archive
              </span>
            </Link>
            <Link
              href="/settings"
              className="px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
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
              className="px-3 py-2 text-left text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-danger)]"
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
