-- Trendit Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  password_hash TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'twitter')),
  telegram_user_id TEXT,
  telegram_connected BOOLEAN NOT NULL DEFAULT false,
  tg_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  tiktok_handle TEXT,
  instagram_handle TEXT,
  youtube_channel_id TEXT,
  niche_tags TEXT[] DEFAULT '{}',
  baseline_velocity_tiktok DOUBLE PRECISION DEFAULT 0,
  baseline_velocity_instagram DOUBLE PRECISION DEFAULT 0,
  baseline_velocity_youtube DOUBLE PRECISION DEFAULT 0,
  baseline_engagement_rate DOUBLE PRECISION DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Scraped content table
CREATE TABLE scraped_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  post_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  caption_text TEXT DEFAULT '',
  hook_text TEXT DEFAULT '',
  view_count INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  views_per_hour DOUBLE PRECISION DEFAULT 0,
  breakout_score DOUBLE PRECISION DEFAULT 0,
  content_format TEXT DEFAULT 'other' CHECK (content_format IN ('talking_head', 'carousel', 'text_overlay', 'broll', 'screen_recording', 'interview', 'other'))
);

-- Daily reports table
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_date DATE UNIQUE NOT NULL,
  report_title TEXT NOT NULL DEFAULT '',
  total_trends_count INTEGER DEFAULT 0,
  total_breakout_videos_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  report_url_slug TEXT
);

-- Trends table
CREATE TABLE trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_report_id UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  trend_name TEXT NOT NULL,
  trend_summary TEXT DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'emerging' CHECK (stage IN ('emerging', 'peaking')),
  platform_signal_count INTEGER DEFAULT 1,
  platforms_detected_on TEXT[] DEFAULT '{}',
  breakout_score_avg DOUBLE PRECISION DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  first_detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trend hooks table
CREATE TABLE trend_hooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  hook_text TEXT NOT NULL,
  source_content_id UUID REFERENCES scraped_content(id) ON DELETE SET NULL,
  rank INTEGER NOT NULL DEFAULT 1 CHECK (rank BETWEEN 1 AND 5)
);

-- Trend source videos table
CREATE TABLE trend_source_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES scraped_content(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 1 CHECK (display_order BETWEEN 1 AND 3)
);

-- Breakout singles (non-trend viral content)
CREATE TABLE breakout_singles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_report_id UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES scraped_content(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0
);

-- Telegram alerts log
CREATE TABLE tg_alerts_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trend_id UUID REFERENCES trends(id) ON DELETE SET NULL,
  daily_report_id UUID REFERENCES daily_reports(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('breakout_alert', 'daily_report_notification')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_users_notified INTEGER DEFAULT 0
);

-- Unique constraints for upsert deduplication
ALTER TABLE scraped_content ADD CONSTRAINT scraped_content_post_url_unique UNIQUE (post_url);
ALTER TABLE creators ADD CONSTRAINT creators_name_unique UNIQUE (name);

-- Indexes for common queries
CREATE INDEX idx_scraped_content_creator ON scraped_content(creator_id);
CREATE INDEX idx_scraped_content_platform ON scraped_content(platform);
CREATE INDEX idx_scraped_content_published ON scraped_content(published_at DESC);
CREATE INDEX idx_scraped_content_breakout ON scraped_content(breakout_score DESC);
CREATE INDEX idx_trends_report ON trends(daily_report_id);
CREATE INDEX idx_trends_score ON trends(breakout_score_avg DESC);
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date DESC);
CREATE INDEX idx_trend_hooks_trend ON trend_hooks(trend_id);
CREATE INDEX idx_trend_source_videos_trend ON trend_source_videos(trend_id);
CREATE INDEX idx_breakout_singles_report ON breakout_singles(daily_report_id);

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_source_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE breakout_singles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_content ENABLE ROW LEVEL SECURITY;

-- Public read access for reports (authenticated users only)
CREATE POLICY "Authenticated users can read reports" ON daily_reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read trends" ON trends
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read hooks" ON trend_hooks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read source videos" ON trend_source_videos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read breakout singles" ON breakout_singles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read scraped content" ON scraped_content
  FOR SELECT TO authenticated USING (true);

-- Users can only read/update their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated USING (auth.uid() = id);
