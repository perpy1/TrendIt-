export interface Creator {
  id: string;
  name: string;
  avatar_url: string;
  tiktok_handle: string | null;
  instagram_handle: string | null;
  youtube_channel_id: string | null;
  niche_tags: string[];
  baseline_velocity_tiktok: number;
  baseline_velocity_instagram: number;
  baseline_velocity_youtube: number;
  baseline_engagement_rate: number;
}

export type Platform = "tiktok" | "instagram" | "youtube";
export type ContentFormat = "talking_head" | "carousel" | "text_overlay" | "broll" | "screen_recording" | "interview" | "other";
export type TrendStage = "emerging" | "peaking";

export interface ScrapedContent {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  platform: Platform;
  post_url: string;
  thumbnail_url: string;
  caption_text: string;
  hook_text: string;
  view_count: number;
  likes: number;
  comments: number;
  shares: number;
  published_at: string;
  scraped_at: string;
  views_per_hour: number;
  breakout_score: number;
  content_format: ContentFormat;
}

export interface TrendHook {
  id: string;
  trend_id: string;
  hook_text: string;
  source_content_id: string;
  rank: number;
}

export interface TrendSourceVideo {
  id: string;
  trend_id: string;
  content: ScrapedContent;
  display_order: number;
}

export interface Trend {
  id: string;
  daily_report_id: string;
  trend_name: string;
  trend_summary: string;
  stage: TrendStage;
  platform_signal_count: number;
  platforms_detected_on: Platform[];
  breakout_score_avg: number;
  display_order: number;
  first_detected_at: string;
  hooks: TrendHook[];
  source_videos: TrendSourceVideo[];
}

export interface BreakoutSingle {
  id: string;
  daily_report_id: string;
  content: ScrapedContent;
  display_order: number;
}

export interface DailyReport {
  id: string;
  report_date: string;
  report_title: string;
  total_trends_count: number;
  total_breakout_videos_count: number;
  published_at: string;
  trends: Trend[];
  breakout_singles: BreakoutSingle[];
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  auth_provider: "email" | "google" | "twitter";
  telegram_user_id: string | null;
  telegram_connected: boolean;
  tg_alerts_enabled: boolean;
}
