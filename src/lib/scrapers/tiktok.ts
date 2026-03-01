import axios from "axios";
import { buildContentRecord } from "./utils";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

interface Creator {
  id: string;
  name: string;
  tiktok_handle: string | null;
  baseline_views_per_hour_tiktok: number;
}

/**
 * Scrape recent TikTok videos for a single creator via RapidAPI.
 */
export async function scrapeTikTokCreator(creator: Creator) {
  if (!creator.tiktok_handle || !RAPIDAPI_KEY) return [];

  try {
    const response = await axios.get(
      "https://tiktok-scraper7.p.rapidapi.com/user/posts",
      {
        params: {
          unique_id: creator.tiktok_handle,
          count: 10,
        },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
        },
        timeout: 15000,
      }
    );

    const videos = response.data?.data?.videos || [];
    const results = [];

    for (const video of videos) {
      const record = buildContentRecord({
        creatorId: creator.id,
        creatorName: creator.name,
        platform: "tiktok",
        postUrl: `https://www.tiktok.com/@${creator.tiktok_handle}/video/${video.video_id}`,
        viewCount: video.play_count || 0,
        likes: video.digg_count || 0,
        comments: video.comment_count || 0,
        publishedAt: new Date((video.create_time || 0) * 1000).toISOString(),
        transcript: video.title || null,
        baselineViewsPerHour: creator.baseline_views_per_hour_tiktok || 1000,
      });

      results.push(record);
    }

    return results;
  } catch (error) {
    console.error(`[TikTok] Error scraping ${creator.name}:`, error);
    return [];
  }
}
