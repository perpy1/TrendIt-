import { readFileSync } from "fs";
import { join } from "path";
import type {
  DailyReport,
  Trend,
  BreakoutSingle,
  TrendHook,
  TrendSourceVideo,
  ScrapedContent,
  TrendStage,
} from "./types";

interface RawScrapedVideo {
  creator_id: string;
  creator_name: string;
  platform: "youtube";
  post_url: string;
  view_count: number;
  likes: number;
  comments: number;
  published_at: string;
  views_per_hour: number;
  breakout_score: number;
  hook_text: string;
  transcript_snippet?: string;
  content_format: string;
  scraped_at: string;
}

// Topic categories with keyword lists for clustering
const TOPIC_CATEGORIES: { name: string; keywords: string[] }[] = [
  {
    name: "AI & Technology",
    keywords: ["ai", "chatgpt", "gpt", "artificial intelligence", "tech", "automation", "robot", "machine learning", "software", "app", "code", "futuristic", "algorithm"],
  },
  {
    name: "Business & Money",
    keywords: ["business", "money", "revenue", "profit", "sell", "selling", "pricing", "income", "bank", "invest", "million", "billion", "dollar", "cost", "earning", "mortgage", "payment", "financial"],
  },
  {
    name: "Content & Social Media",
    keywords: ["content", "youtube", "social media", "video", "post", "subscribe", "viral", "audience", "creator", "media", "manager", "writing", "filmed"],
  },
  {
    name: "Personal Brand & Marketing",
    keywords: ["brand", "marketing", "design", "audience", "funnel", "launch", "campaign", "seo", "traffic", "growth", "newsletter"],
  },
  {
    name: "Productivity & Systems",
    keywords: ["productivity", "system", "habit", "routine", "goal", "focus", "time", "efficient", "optimize", "dating", "schedule", "morning"],
  },
  {
    name: "Mindset & Motivation",
    keywords: ["mindset", "motivation", "success", "hard", "struggle", "discipline", "confidence", "fear", "mistake", "wrong", "secret", "truth", "lesson"],
  },
  {
    name: "Entrepreneurship",
    keywords: ["entrepreneur", "startup", "founder", "build", "started", "starting", "company", "scale", "bootstrapped", "side hustle", "quit", "career"],
  },
  {
    name: "Crypto & Finance",
    keywords: ["crypto", "bitcoin", "ethereum", "blockchain", "defi", "token", "coin", "market", "stock", "trading", "economy", "collapse", "losing"],
  },
];

function loadScrapedData(): RawScrapedVideo[] {
  const filePath = join(process.cwd(), "data", "scraped-content.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function normalizeToScrapedContent(
  raw: RawScrapedVideo,
  index: number
): ScrapedContent {
  return {
    id: `sc-${index}-${raw.post_url.split("v=")[1] || index}`,
    creator_id: raw.creator_id,
    creator_name: raw.creator_name,
    creator_avatar: "",
    platform: raw.platform,
    post_url: raw.post_url,
    thumbnail_url: "",
    caption_text: raw.hook_text,
    hook_text: raw.hook_text,
    view_count: raw.view_count,
    likes: raw.likes,
    comments: raw.comments,
    shares: 0,
    published_at: raw.published_at,
    scraped_at: raw.scraped_at,
    views_per_hour: raw.views_per_hour,
    breakout_score: raw.breakout_score,
    content_format: raw.content_format === "other" ? "talking_head" : (raw.content_format as ScrapedContent["content_format"]),
  };
}

function classifyTopic(hookText: string): string | null {
  const lower = hookText.toLowerCase();
  let bestCategory: string | null = null;
  let bestScore = 0;

  for (const cat of TOPIC_CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (lower.includes(kw)) {
        score += kw.length; // longer keyword matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat.name;
    }
  }

  return bestScore >= 2 ? bestCategory : null;
}

function getVideosForDate(
  allVideos: ScrapedContent[],
  reportDate: string
): ScrapedContent[] {
  const dateEnd = new Date(reportDate + "T23:59:59Z").getTime();
  const dateStart = dateEnd - 48 * 60 * 60 * 1000; // 48 hours before end of report date

  return allVideos.filter((v) => {
    const pubTime = new Date(v.published_at).getTime();
    return pubTime >= dateStart && pubTime <= dateEnd;
  });
}

function buildTrendsFromVideos(
  videos: ScrapedContent[],
  reportId: string
): { trends: Trend[]; usedIds: Set<string> } {
  // Group videos by topic
  const topicGroups: Map<string, ScrapedContent[]> = new Map();

  for (const video of videos) {
    const topic = classifyTopic(video.hook_text);
    if (topic) {
      if (!topicGroups.has(topic)) {
        topicGroups.set(topic, []);
      }
      topicGroups.get(topic)!.push(video);
    }
  }

  const trends: Trend[] = [];
  const usedIds = new Set<string>();
  let displayOrder = 1;

  // Sort topic groups by total breakout score descending
  const sortedTopics = [...topicGroups.entries()]
    .filter(([, vids]) => vids.length >= 2)
    .sort(
      ([, a], [, b]) =>
        b.reduce((s, v) => s + v.breakout_score, 0) -
        a.reduce((s, v) => s + v.breakout_score, 0)
    );

  for (const [topicName, topicVideos] of sortedTopics) {
    const trendId = `trend-${reportId}-${displayOrder}`;

    // Sort videos in this trend by breakout score
    const sorted = [...topicVideos].sort(
      (a, b) => b.breakout_score - a.breakout_score
    );

    const avgScore =
      sorted.reduce((s, v) => s + v.breakout_score, 0) / sorted.length;

    const stage: TrendStage =
      avgScore >= 6 ? "emerging" : avgScore >= 4 ? "peaking" : "emerging";

    // Build hooks from video hook_texts
    const hooks: TrendHook[] = sorted.map((v, i) => ({
      id: `hook-${trendId}-${i + 1}`,
      trend_id: trendId,
      hook_text: v.hook_text,
      source_content_id: v.id,
      rank: i + 1,
    }));

    // Build source videos
    const sourceVideos: TrendSourceVideo[] = sorted.map((v, i) => ({
      id: `sv-${trendId}-${i + 1}`,
      trend_id: trendId,
      content: v,
      display_order: i + 1,
    }));

    // Generate summary
    const topCreators = [
      ...new Set(sorted.slice(0, 3).map((v) => v.creator_name)),
    ];
    const totalViews = sorted.reduce((s, v) => s + v.view_count, 0);
    const viewsStr =
      totalViews >= 1_000_000
        ? `${(totalViews / 1_000_000).toFixed(1)}M`
        : `${(totalViews / 1_000).toFixed(0)}K`;

    const trendSummary = `${sorted.length} creators including ${topCreators.join(", ")} are making content about this topic, generating ${viewsStr}+ views combined.`;

    sorted.forEach((v) => usedIds.add(v.id));

    trends.push({
      id: trendId,
      daily_report_id: reportId,
      trend_name: topicName,
      trend_summary: trendSummary,
      stage,
      platform_signal_count: sorted.length,
      platforms_detected_on: [...new Set(sorted.map((v) => v.platform))],
      breakout_score_avg: Math.round(avgScore * 10) / 10,
      display_order: displayOrder,
      first_detected_at: sorted[sorted.length - 1].published_at,
      hooks,
      source_videos: sourceVideos,
    });

    displayOrder++;
  }

  return { trends, usedIds };
}

export function buildReportFromScrapedData(
  date?: string
): DailyReport | null {
  const rawData = loadScrapedData();
  const allVideos = rawData.map((v, i) => normalizeToScrapedContent(v, i));

  const reportDate = date || new Date().toISOString().split("T")[0];
  let videos = getVideosForDate(allVideos, reportDate);

  // If no videos for 48h window, try a wider 7-day window
  if (videos.length < 3) {
    const dateEnd = new Date(reportDate + "T23:59:59Z").getTime();
    const dateStart = dateEnd - 7 * 24 * 60 * 60 * 1000;
    videos = allVideos.filter((v) => {
      const pubTime = new Date(v.published_at).getTime();
      return pubTime >= dateStart && pubTime <= dateEnd;
    });
  }

  if (videos.length === 0) return null;

  const reportId = `report-${reportDate}`;

  // Identify breakout singles (score >= 7), top 5
  const breakoutCandidates = [...videos]
    .filter((v) => v.breakout_score >= 7)
    .sort((a, b) => b.breakout_score - a.breakout_score)
    .slice(0, 5);

  const breakoutIds = new Set(breakoutCandidates.map((v) => v.id));

  // Cluster remaining videos into trends
  const nonBreakoutVideos = videos.filter((v) => !breakoutIds.has(v.id));
  const { trends } = buildTrendsFromVideos(nonBreakoutVideos, reportId);

  // Build breakout singles
  const breakoutSingles: BreakoutSingle[] = breakoutCandidates.map((v, i) => ({
    id: `breakout-${reportId}-${i + 1}`,
    daily_report_id: reportId,
    content: v,
    display_order: i + 1,
  }));

  // Format report title
  const dateObj = new Date(reportDate + "T12:00:00Z");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const reportTitle = `${monthNames[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()} Creator Trends`;

  return {
    id: reportId,
    report_date: reportDate,
    report_title: reportTitle,
    total_trends_count: trends.length,
    total_breakout_videos_count: breakoutSingles.length,
    published_at: new Date().toISOString(),
    trends,
    breakout_singles: breakoutSingles,
  };
}

export function getAvailableReportDates(): {
  date: string;
  title: string;
  trends: number;
  breakouts: number;
}[] {
  const rawData = loadScrapedData();
  const allVideos = rawData.map((v, i) => normalizeToScrapedContent(v, i));

  // Group videos by published date
  const byDate = new Map<string, ScrapedContent[]>();
  for (const v of allVideos) {
    const d = v.published_at.split("T")[0];
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(v);
  }

  // Only create reports for dates with at least 3 videos
  const dates = [...byDate.keys()]
    .filter((d) => byDate.get(d)!.length >= 3)
    .sort()
    .reverse();

  return dates.map((d) => {
    const report = buildReportFromScrapedData(d);
    return {
      date: d,
      title: report?.report_title || `${d} Report`,
      trends: report?.total_trends_count || 0,
      breakouts: report?.total_breakout_videos_count || 0,
    };
  });
}
