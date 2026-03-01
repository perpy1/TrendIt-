import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { scrapeYouTubeCreator } from "./youtube";
import { scrapeTikTokCreator } from "./tiktok";
import { scrapeInstagramCreator } from "./instagram";

interface PlatformResult {
  platform: string;
  creators_scraped: number;
  content_found: number;
  breakouts_detected: number;
}

/**
 * Run the full scraping pipeline:
 * 1. Fetch all creators from DB
 * 2. Scrape each creator across all platforms
 * 3. Upsert results into scraped_content table
 */
export async function runScrapingPipeline() {
  console.log("[Pipeline] Starting scraping pipeline...");

  // 1. Fetch creators from DB
  const { data: creators, error: creatorsError } = await getSupabaseAdmin()
    .from("creators")
    .select("*");

  if (creatorsError || !creators) {
    throw new Error(`Failed to fetch creators: ${creatorsError?.message}`);
  }

  console.log(`[Pipeline] Found ${creators.length} creators to scrape`);

  const platformResults: PlatformResult[] = [
    { platform: "youtube", creators_scraped: 0, content_found: 0, breakouts_detected: 0 },
    { platform: "tiktok", creators_scraped: 0, content_found: 0, breakouts_detected: 0 },
    { platform: "instagram", creators_scraped: 0, content_found: 0, breakouts_detected: 0 },
  ];

  // 2. Scrape each creator
  for (const creator of creators) {
    // YouTube
    if (creator.youtube_channel_id) {
      try {
        const videos = await scrapeYouTubeCreator({
          id: creator.id,
          name: creator.name,
          youtube_channel_id: creator.youtube_channel_id,
          baseline_views_per_hour_youtube: creator.baseline_views_per_hour_youtube || 500,
        });
        if (videos.length > 0) {
          await upsertContent(videos);
          platformResults[0].creators_scraped++;
          platformResults[0].content_found += videos.length;
          platformResults[0].breakouts_detected += videos.filter((v) => v.breakout_score >= 7).length;
        }
      } catch (error) {
        console.error(`[Pipeline] YouTube error for ${creator.name}:`, error);
      }
    }

    // TikTok
    if (creator.tiktok_handle) {
      try {
        const videos = await scrapeTikTokCreator({
          id: creator.id,
          name: creator.name,
          tiktok_handle: creator.tiktok_handle,
          baseline_views_per_hour_tiktok: creator.baseline_views_per_hour_tiktok || 1000,
        });
        if (videos.length > 0) {
          await upsertContent(videos);
          platformResults[1].creators_scraped++;
          platformResults[1].content_found += videos.length;
          platformResults[1].breakouts_detected += videos.filter((v) => v.breakout_score >= 7).length;
        }
      } catch (error) {
        console.error(`[Pipeline] TikTok error for ${creator.name}:`, error);
      }
    }

    // Instagram
    if (creator.instagram_handle) {
      try {
        const videos = await scrapeInstagramCreator({
          id: creator.id,
          name: creator.name,
          instagram_handle: creator.instagram_handle,
          baseline_views_per_hour_instagram: creator.baseline_views_per_hour_instagram || 800,
        });
        if (videos.length > 0) {
          await upsertContent(videos);
          platformResults[2].creators_scraped++;
          platformResults[2].content_found += videos.length;
          platformResults[2].breakouts_detected += videos.filter((v) => v.breakout_score >= 7).length;
        }
      } catch (error) {
        console.error(`[Pipeline] Instagram error for ${creator.name}:`, error);
      }
    }
  }

  const totalBreakouts = platformResults.reduce((sum, r) => sum + r.breakouts_detected, 0);
  console.log(`[Pipeline] Complete. ${totalBreakouts} breakouts detected.`);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    results: platformResults,
    total_breakouts: totalBreakouts,
    message: "Scraping pipeline completed successfully",
  };
}

/**
 * Upsert scraped content into DB, deduplicating by post_url.
 */
async function upsertContent(records: Record<string, unknown>[]) {
  const { error } = await getSupabaseAdmin()
    .from("scraped_content")
    .upsert(records, { onConflict: "post_url" });

  if (error) {
    console.error("[Pipeline] Upsert error:", error.message);
  }
}
