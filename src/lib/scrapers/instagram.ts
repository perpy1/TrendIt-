import axios from "axios";
import { buildContentRecord } from "./utils";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

interface Creator {
  id: string;
  name: string;
  instagram_handle: string | null;
  baseline_views_per_hour_instagram: number;
}

/**
 * Scrape recent Instagram posts/reels for a single creator via RapidAPI.
 */
export async function scrapeInstagramCreator(creator: Creator) {
  if (!creator.instagram_handle || !RAPIDAPI_KEY) return [];

  try {
    const response = await axios.get(
      "https://instagram-scraper-api2.p.rapidapi.com/v1/posts",
      {
        params: {
          username_or_id_or_url: creator.instagram_handle,
        },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
        },
        timeout: 15000,
      }
    );

    const posts = response.data?.data?.items || [];
    const results = [];

    for (const post of posts.slice(0, 10)) {
      const isReel = post.media_type === 2; // 2 = video/reel
      const viewCount = isReel ? (post.play_count || post.view_count || 0) : (post.like_count || 0);

      const record = buildContentRecord({
        creatorId: creator.id,
        creatorName: creator.name,
        platform: "instagram",
        postUrl: `https://www.instagram.com/p/${post.code}/`,
        viewCount,
        likes: post.like_count || 0,
        comments: post.comment_count || 0,
        publishedAt: new Date((post.taken_at || 0) * 1000).toISOString(),
        transcript: post.caption?.text || null,
        baselineViewsPerHour: creator.baseline_views_per_hour_instagram || 800,
        contentFormat: isReel ? "talking_head" : "carousel",
      });

      results.push(record);
    }

    return results;
  } catch (error) {
    console.error(`[Instagram] Error scraping ${creator.name}:`, error);
    return [];
  }
}
