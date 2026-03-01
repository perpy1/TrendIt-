import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { buildContentRecord } from "./utils";

interface Creator {
  id: string;
  name: string;
  youtube_channel_id: string | null;
  baseline_views_per_hour_youtube?: number;
}

interface RSSVideo {
  videoId: string;
  title: string;
  publishedAt: string;
}

/**
 * Fetch recent videos from a YouTube channel via public RSS feed (no API key needed).
 */
async function fetchRecentVideosRSS(channelId: string): Promise<RSSVideo[]> {
  try {
    const { data: xml } = await axios.get(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { timeout: 10000 }
    );

    const videos: RSSVideo[] = [];
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

    for (const entry of entries.slice(0, 10)) {
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

      if (videoIdMatch && titleMatch && publishedMatch) {
        videos.push({
          videoId: videoIdMatch[1],
          title: titleMatch[1],
          publishedAt: publishedMatch[1],
        });
      }
    }

    return videos;
  } catch (error) {
    console.error(`[YouTube RSS] Failed for channel ${channelId}:`, error);
    return [];
  }
}

/**
 * Scrape view count, likes, etc. from a YouTube video page (no API key needed).
 */
async function scrapeVideoStats(videoId: string): Promise<{
  viewCount: number;
  likes: number;
}> {
  try {
    const { data: html } = await axios.get(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    // Extract view count from meta tag or JSON
    let viewCount = 0;
    const viewMatch =
      html.match(/"viewCount":"(\d+)"/) ||
      html.match(/<meta itemprop="interactionCount" content="(\d+)"/) ||
      html.match(/"views":.*?"simpleText":"([\d,]+)\s/);

    if (viewMatch) {
      viewCount = parseInt(viewMatch[1].replace(/,/g, ""));
    }

    // Extract likes from JSON data
    let likes = 0;
    const likesMatch = html.match(/"label":"([\d,]+) likes"/);
    if (likesMatch) {
      likes = parseInt(likesMatch[1].replace(/,/g, ""));
    }

    return { viewCount, likes };
  } catch {
    return { viewCount: 0, likes: 0 };
  }
}

/**
 * Scrape recent videos for a single YouTube creator — fully API-key-free.
 * Uses RSS feed + page scraping + youtube-transcript.
 */
export async function scrapeYouTubeCreator(creator: Creator) {
  if (!creator.youtube_channel_id) return [];

  try {
    // 1. Get recent videos via RSS
    const videos = await fetchRecentVideosRSS(creator.youtube_channel_id);
    if (videos.length === 0) return [];

    console.log(`[YouTube] ${creator.name}: found ${videos.length} videos via RSS`);

    const results = [];

    for (const video of videos) {
      // 2. Get view count from page
      const stats = await scrapeVideoStats(video.videoId);

      // 3. Try to get transcript
      let transcript: string | null = null;
      try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(video.videoId);
        transcript = transcriptData.map((t) => t.text).join(" ");
      } catch {
        // Transcript not available — use video title as hook fallback
        transcript = video.title;
      }

      const record = buildContentRecord({
        creatorId: creator.id,
        creatorName: creator.name,
        platform: "youtube",
        postUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        viewCount: stats.viewCount,
        likes: stats.likes,
        comments: 0,
        publishedAt: video.publishedAt,
        transcript,
        baselineViewsPerHour: creator.baseline_views_per_hour_youtube || 500,
      });

      results.push(record);

      // Small delay to be respectful
      await new Promise((r) => setTimeout(r, 300));
    }

    return results;
  } catch (error) {
    console.error(`[YouTube] Error scraping ${creator.name}:`, error);
    return [];
  }
}
