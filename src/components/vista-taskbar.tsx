"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/use-sound";
import { TrendingUp, Archive, Settings, LogOut, User, Globe, Shield } from "lucide-react";

interface TaskbarItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
}

export function VistaTaskbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { playStartMenu, playClick, playNavigate } = useSound();
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close start menu on outside click
  useEffect(() => {
    if (!startOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".vista-start-menu") && !target.closest(".vista-start-btn")) {
        setStartOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [startOpen]);

  const taskbarItems: TaskbarItem[] = user
    ? [
        { id: "report", title: "Today's Report", icon: <TrendingUp className="h-3.5 w-3.5" />, href: "/report" },
        { id: "archive", title: "Archive", icon: <Archive className="h-3.5 w-3.5" />, href: "/archive" },
        { id: "settings", title: "Settings", icon: <Settings className="h-3.5 w-3.5" />, href: "/settings" },
      ]
    : [];

  const isActive = (href: string) => pathname.startsWith(href);

  const navigate = (href: string) => {
    playNavigate();
    router.push(href);
    setStartOpen(false);
  };

  return (
    <>
      {/* Start Menu */}
      {startOpen && (
        <div className="vista-start-menu fixed bottom-10 left-0 z-[100] w-72 overflow-hidden rounded-t-lg shadow-2xl">
          {/* Header */}
          <div className="vista-start-header flex items-center gap-3 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {user?.display_name || "Guest"}
            </span>
          </div>

          {/* Menu Items */}
          <div className="vista-start-body grid grid-cols-1 gap-0 bg-white p-1">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/report")}
                  className="flex items-center gap-3 rounded px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#3a8ecd] hover:text-white"
                >
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Today&apos;s Report</div>
                    <div className="text-xs text-gray-500">View latest trend intelligence</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate("/archive")}
                  className="flex items-center gap-3 rounded px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#3a8ecd] hover:text-white"
                >
                  <Archive className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-semibold">Archive</div>
                    <div className="text-xs text-gray-500">Browse past reports</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-3 rounded px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#3a8ecd] hover:text-white"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">Control Panel</div>
                    <div className="text-xs text-gray-500">Settings & Telegram</div>
                  </div>
                </button>
                <div className="my-1 h-px bg-gray-200" />
                <button
                  onClick={() => { playClick(); logout(); setStartOpen(false); }}
                  className="flex items-center gap-3 rounded px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#3a8ecd] hover:text-white"
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                  <div className="font-semibold">Log Off</div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-3 rounded px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#3a8ecd] hover:text-white"
                >
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className="font-semibold">Log In</div>
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-3 rounded px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#3a8ecd] hover:text-white"
                >
                  <Globe className="h-5 w-5 text-green-600" />
                  <div className="font-semibold">Sign Up Free</div>
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="vista-start-footer flex items-center justify-between px-3 py-2">
            <span className="text-[10px] text-white/60">Trendit v1.0</span>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="vista-taskbar fixed bottom-0 left-0 right-0 z-[99] flex h-10 items-center">
        {/* Start Button */}
        <button
          className="vista-start-btn relative z-[101] flex h-full items-center gap-1.5 px-3 text-white"
          onClick={(e) => {
            e.stopPropagation();
            playStartMenu();
            setStartOpen(!startOpen);
          }}
        >
          <div className="vista-orb flex h-6 w-6 items-center justify-center rounded-full">
            <TrendingUp className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">Start</span>
        </button>

        {/* Quick Launch Separator */}
        <div className="mx-1 h-6 w-px bg-white/20" />

        {/* Open Windows */}
        <div className="flex flex-1 items-center gap-0.5 overflow-hidden px-1">
          {taskbarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.href)}
              className={`vista-taskbar-item flex h-7 items-center gap-1.5 rounded px-3 text-xs font-medium text-white transition-all ${
                isActive(item.href)
                  ? "vista-taskbar-item-active"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span className="hidden truncate sm:inline">{item.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="vista-systray flex h-full items-center gap-2 px-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" title="Connected" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            {clock}
          </span>
        </div>
      </div>
    </>
  );
}
