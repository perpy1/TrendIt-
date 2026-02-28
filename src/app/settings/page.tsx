"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { VistaWindow } from "@/components/vista-window";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/use-sound";
import { Settings, User, MessageCircle, Bell, LogOut, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { playClick, playError } = useSound();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [tgAlerts, setTgAlerts] = useState(user?.tg_alerts_enabled ?? true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "telegram" | "notifications">("profile");

  const handleSave = () => {
    playClick();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-2.5rem)] items-start justify-center p-4 md:p-6">
        <VistaWindow
          title="Control Panel — Trendit Settings"
          icon={<Settings className="h-4 w-4 text-white" />}
          width="100%"
          className="max-w-2xl"
          bodyClassName="max-h-[calc(100vh-6rem)] overflow-y-auto"
          showMinimize
          showMaximize
        >
          <div className="flex min-h-[400px] flex-col sm:flex-row">
            {/* Side Panel — Category List */}
            <div className="shrink-0 border-b border-[#d0d0d0] bg-white p-2 sm:w-48 sm:border-b-0 sm:border-r">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#888]">
                Categories
              </p>
              {[
                { id: "profile" as const, label: "User Profile", icon: <User className="h-4 w-4" /> },
                { id: "telegram" as const, label: "Telegram", icon: <MessageCircle className="h-4 w-4" /> },
                { id: "notifications" as const, label: "Notifications", icon: <Bell className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { playClick(); setActiveTab(tab.id); }}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#cce8ff] font-semibold text-[#1a1a1a]"
                      : "text-[#333] hover:bg-[#e8e8e8]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}

              <div className="my-2 h-px bg-[#e0e0e0]" />

              <button
                onClick={() => { playClick(); logout(); }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log Off
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4">
              {activeTab === "profile" && (
                <div>
                  <h2 className="mb-4 text-sm font-bold text-[#1a3a5a]">
                    <User className="mr-1 inline h-4 w-4" />
                    User Profile
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-[#333]">Display name:</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onClick={playClick}
                        className="vista-input w-full max-w-xs"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-[#333]">Email address:</label>
                      <div className="vista-input w-full max-w-xs cursor-not-allowed bg-[#f4f4f4] text-[#888]">
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-[#333]">Auth provider:</label>
                      <p className="text-xs capitalize text-[#555]">{user?.auth_provider}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button onClick={handleSave} className="vista-btn vista-btn-primary text-xs">
                        {saved ? "\u2713 Saved!" : "Save Changes"}
                      </button>
                      <button
                        onClick={() => { playError(); }}
                        className="vista-btn flex items-center gap-1 text-xs text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "telegram" && (
                <div>
                  <h2 className="mb-4 text-sm font-bold text-[#1a3a5a]">
                    <MessageCircle className="mr-1 inline h-4 w-4" />
                    Telegram Connection
                  </h2>

                  {user?.telegram_connected ? (
                    <div className="vista-groupbox">
                      <span className="vista-groupbox-label">Status</span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs font-semibold text-green-700">Connected</span>
                      </div>
                      <p className="mt-2 text-[11px] text-[#555]">
                        Your Telegram account is connected. You&apos;ll receive alerts when major breakouts are detected.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="vista-infobar mb-4">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                        <p className="text-[11px] text-[#555]">
                          Connect your Telegram to receive real-time push alerts when major trend breakouts are detected.
                        </p>
                      </div>
                      <button onClick={playClick} className="vista-btn vista-btn-primary flex items-center gap-1 text-xs">
                        <MessageCircle className="h-3 w-3" />
                        Connect Telegram
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="mb-4 text-sm font-bold text-[#1a3a5a]">
                    <Bell className="mr-1 inline h-4 w-4" />
                    Notification Preferences
                  </h2>

                  <div className="vista-groupbox">
                    <span className="vista-groupbox-label">Telegram Alerts</span>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#1a1a1a]">Breakout alerts</p>
                        <p className="text-[10px] text-[#555]">Receive push notifications for major breakouts</p>
                      </div>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tgAlerts}
                          onChange={() => { playClick(); setTgAlerts(!tgAlerts); }}
                          className="vista-checkbox"
                        />
                        <span className="text-[11px] text-[#333]">{tgAlerts ? "Enabled" : "Disabled"}</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={handleSave} className="vista-btn vista-btn-primary text-xs">
                      {saved ? "\u2713 Saved!" : "Apply"}
                    </button>
                    <button onClick={playClick} className="vista-btn text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </VistaWindow>
      </div>
    </AuthGuard>
  );
}
