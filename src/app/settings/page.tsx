"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth-context";
import { Settings, User, MessageCircle, Bell, LogOut, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [tgAlerts, setTgAlerts] = useState(user?.tg_alerts_enabled ?? true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "telegram" | "notifications">("profile");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl">
        <h1 className="pixel-heading mb-6 text-sm text-[var(--color-accent)]">
          <Settings className="mr-2 inline h-4 w-4" />
          Settings
        </h1>

        <div className="flex min-h-[400px] flex-col border border-[var(--color-card-border)] sm:flex-row">
          {/* Side Panel */}
          <div className="shrink-0 border-b border-[var(--color-card-border)] bg-[var(--color-surface)] p-3 sm:w-48 sm:border-b-0 sm:border-r">
            <p className="mb-2 px-2 pixel-heading text-[8px] text-[var(--color-text-dim)]">
              Categories
            </p>
            {[
              { id: "profile" as const, label: "User Profile", icon: <User className="h-4 w-4" /> },
              { id: "telegram" as const, label: "Telegram", icon: <MessageCircle className="h-4 w-4" /> },
              { id: "notifications" as const, label: "Notifications", icon: <Bell className="h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2 px-2 py-2 text-left text-xs transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--color-accent-dim)] text-[var(--color-accent)] font-semibold"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            <div className="my-2 h-px bg-[var(--color-card-border)]" />

            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-2 py-2 text-left text-xs text-[var(--color-danger)] hover:bg-[rgba(255,51,51,0.1)]"
            >
              <LogOut className="h-4 w-4" />
              Log Off
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-5">
            {activeTab === "profile" && (
              <div>
                <h2 className="pixel-heading mb-4 text-xs text-[var(--color-accent)]">
                  <User className="mr-1 inline h-4 w-4" />
                  User Profile
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--color-text-muted)]">Display name:</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="cyber-input max-w-xs"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--color-text-muted)]">Email address:</label>
                    <div className="cyber-input max-w-xs cursor-not-allowed opacity-50">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--color-text-muted)]">Auth provider:</label>
                    <p className="text-xs capitalize">{user?.auth_provider}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSave} className="cyber-btn-primary text-xs">
                      {saved ? "\u2713 Saved!" : "Save Changes"}
                    </button>
                    <button className="cyber-btn flex items-center gap-1 text-xs text-[var(--color-danger)]">
                      <Trash2 className="h-3 w-3" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "telegram" && (
              <div>
                <h2 className="pixel-heading mb-4 text-xs text-[var(--color-accent)]">
                  <MessageCircle className="mr-1 inline h-4 w-4" />
                  Telegram Connection
                </h2>

                {user?.telegram_connected ? (
                  <div className="cyber-groupbox">
                    <span className="cyber-groupbox-label">Status</span>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-2 bg-[var(--color-accent)]" />
                      <span className="text-xs font-semibold text-[var(--color-accent)]">Connected</span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                      Your Telegram account is connected. You&apos;ll receive alerts when major breakouts are detected.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="cyber-card mb-4 flex items-start gap-3">
                      <MessageCircle className="h-4 w-4 shrink-0 text-[var(--color-blue)]" />
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Connect your Telegram to receive real-time push alerts when major trend breakouts are detected.
                      </p>
                    </div>
                    <button className="cyber-btn-primary flex items-center gap-1 text-xs">
                      <MessageCircle className="h-3 w-3" />
                      Connect Telegram
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="pixel-heading mb-4 text-xs text-[var(--color-accent)]">
                  <Bell className="mr-1 inline h-4 w-4" />
                  Notification Preferences
                </h2>

                <div className="cyber-groupbox">
                  <span className="cyber-groupbox-label">Telegram Alerts</span>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold">Breakout alerts</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">Receive push notifications for major breakouts</p>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tgAlerts}
                        onChange={() => setTgAlerts(!tgAlerts)}
                        className="cyber-checkbox"
                      />
                      <span className="text-xs">{tgAlerts ? "Enabled" : "Disabled"}</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={handleSave} className="cyber-btn-primary text-xs">
                    {saved ? "\u2713 Saved!" : "Apply"}
                  </button>
                  <button className="cyber-btn text-xs">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
