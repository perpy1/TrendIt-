import { scrapeYouTubeCreator } from "./youtube";
import { scrapeTikTokCreator } from "./tiktok";
import { scrapeInstagramCreator } from "./instagram";
import * as fs from "fs";
import * as path from "path";

interface PlatformResult {
  platform: string;
  creators_scraped: number;
  content_found: number;
  breakouts_detected: number;
}

// Hardcoded creators with YouTube channel IDs — no DB needed
const CREATORS = [
  { id: "1", name: "Alex Hormozi", youtube_channel_id: "UCPr7L-CmPMHJIGEj_kyGnCw", tiktok_handle: "hormozi", instagram_handle: "hormozi" },
  { id: "2", name: "Codie Sanchez", youtube_channel_id: "UCps1KSZG4ZSEFsPveSPaYjg", tiktok_handle: "codiesanchez", instagram_handle: "codiesanchez" },
  { id: "3", name: "Gary Vee", youtube_channel_id: "UCctXZhXmQk4DAMBhnEAUPeg", tiktok_handle: "garyvee", instagram_handle: "garyvee" },
  { id: "4", name: "Sahil Bloom", youtube_channel_id: "UC4MLhIsY6SaqXdSUx0q8nig", tiktok_handle: "sahilbloom", instagram_handle: "sahilbloom" },
  { id: "5", name: "Dan Koe", youtube_channel_id: "UCPCYgVbDFUzUb7o9ijb2cBQ", tiktok_handle: "dankoe", instagram_handle: "dankoe" },
  { id: "6", name: "Ali Abdaal", youtube_channel_id: "UCoOae5nYA7VqaXzerajD0lg", tiktok_handle: "aliabdaal", instagram_handle: "aliabdaal" },
  { id: "7", name: "Iman Gadzhi", youtube_channel_id: "UCljd0ZzJJu-ExOZ7iOaKlwQ", tiktok_handle: "imangadzhi", instagram_handle: "imangadzhi" },
  { id: "8", name: "Leila Hormozi", youtube_channel_id: "UCWyQ_Fxc1QsqymvIrJz6C1A", tiktok_handle: "leilahormozi", instagram_handle: "leilahormozi" },
  { id: "9", name: "Chris Do", youtube_channel_id: "UCnmGIG8eLMOjg1Lmkgti51g", tiktok_handle: "thechrisdo", instagram_handle: "thechrisdo" },
  { id: "10", name: "Mr Beast", youtube_channel_id: "UCX6OQ3DkcsbYNE6H8uQQuVA", tiktok_handle: "mrbeast", instagram_handle: "mrbeast" },
  { id: "11", name: "Steven Bartlett", youtube_channel_id: "UCHnHWAi9URF38v0l-uOAR7w", tiktok_handle: "stevenbartlett", instagram_handle: "steven" },
  { id: "12", name: "Noah Kagan", youtube_channel_id: "UCx5UiKnbOBSqaRcABLKfFIA", tiktok_handle: "noahkagan", instagram_handle: "noahkagan" },
  { id: "13", name: "Pat Flynn", youtube_channel_id: "UCGk1LnaSGlvsRFLnQfKJdcA", tiktok_handle: "patflynn", instagram_handle: "patflynn" },
  { id: "14", name: "Ed Mylett", youtube_channel_id: "UCp3v0nGm7I6OSpRwgr8QCog", tiktok_handle: "edmylett", instagram_handle: "edmylett" },
  { id: "15", name: "Graham Stephan", youtube_channel_id: "UCV6KDgJskWaEckne5aPA0aQ", tiktok_handle: "grahamstephan", instagram_handle: "grahamstephan" },
  { id: "16", name: "Matt Gray", youtube_channel_id: "UChYHKRass0kZvBkVKQuZElQ", tiktok_handle: "realmattgray", instagram_handle: "realmattgray" },
  { id: "17", name: "Alex Garcia", youtube_channel_id: "UCnGOF8GmTnJu-7VsjX1IOHQ", tiktok_handle: null, instagram_handle: "alexgarcia" },
  { id: "18", name: "Oren Meets World", youtube_channel_id: "UC_tSQ6UQy2pROm-I0J7UBoA", tiktok_handle: "orenmeetsworld", instagram_handle: "orenmeetsworld" },
  { id: "19", name: "Tom Noske", youtube_channel_id: "UC0tNbnCRYniecs_n3d7-8dA", tiktok_handle: "tomnoske", instagram_handle: "tomnoske" },
  { id: "20", name: "Caleb Ralston", youtube_channel_id: "UCbc7A6bNtpyybJbGvIi0PNQ", tiktok_handle: "calebralston", instagram_handle: "calebralston" },
  { id: "21", name: "The Futur", youtube_channel_id: "UC-b3c7kxa5vU-bnmaROgvog", tiktok_handle: "thefutur", instagram_handle: "thefutur" },
  { id: "22", name: "Jun Yuh", youtube_channel_id: "UClDcKhHgT3x88I0q7BOT0ow", tiktok_handle: "jun_yuh", instagram_handle: "jun_yuh" },
  { id: "23", name: "Dan Koe Talks", youtube_channel_id: "UCWXYDYv5STLk-zoxMP2I1Lw", tiktok_handle: null, instagram_handle: null },
  { id: "24", name: "Kallaway", youtube_channel_id: "UCg5WjzrwxRRUUDf7WHKPzsA", tiktok_handle: "kallawaymarketing", instagram_handle: "kallawaymarketing" },
  { id: "25", name: "Neil Patel", youtube_channel_id: "UCl-Zrl0QhF66lu1aGXaTbfw", tiktok_handle: "neilpatel", instagram_handle: "neilpatel" },
  { id: "26", name: "Sweat Equity Podcast", youtube_channel_id: "UC3c6jXLSMhDH6XlcoKXGryA", tiktok_handle: null, instagram_handle: "sweatequitypod" },
  { id: "27", name: "Vanessa Lau", youtube_channel_id: "UCbEKLXFrPx-cq3akIw9JA1w", tiktok_handle: "vanessalau.co", instagram_handle: "vanessalau.co" },
  { id: "28", name: "Tim Ferriss", youtube_channel_id: "UCznv7Vf9nBdJYvBagFdAHWw", tiktok_handle: null, instagram_handle: "timferriss" },
  { id: "29", name: "Russell Brunson", youtube_channel_id: "UCww7ov9cP1MNfpLFKW49VBw", tiktok_handle: "russellbrunson", instagram_handle: "russellbrunson" },
  { id: "30", name: "Jay Shetty", youtube_channel_id: "UCbV60AGIHBmyFbKdgMal0Cg", tiktok_handle: "jayshetty", instagram_handle: "jayshetty" },
  { id: "31", name: "Tom Bilyeu", youtube_channel_id: "UCnYMOamNKLGVlJgRUbamveA", tiktok_handle: "tombilyeu", instagram_handle: "tombilyeu" },
  { id: "32", name: "Tina Huang", youtube_channel_id: "UC2UXDak6o7rBm23k3Vv5dww", tiktok_handle: "tinahuang1", instagram_handle: "tinahuang1" },
  { id: "33", name: "Mark Tilbury", youtube_channel_id: "UCzIXh4fzOfEaDhauD6eGZdA", tiktok_handle: "marktilbury", instagram_handle: "marktilbury" },
  { id: "34", name: "Coin Bureau (Guy)", youtube_channel_id: "UCqK_GSMbpiV8spgD3ZGloSw", tiktok_handle: "coinbureau", instagram_handle: "coinbureau" },
  { id: "35", name: "Grant Cardone", youtube_channel_id: "UCJXmf9RQMB9Ei6CwTz7Umhg", tiktok_handle: "grantcardone", instagram_handle: "grantcardone" },
];

const DATA_DIR = path.join(process.cwd(), "data");
const SCRAPED_FILE = path.join(DATA_DIR, "scraped-content.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadExistingData(): Record<string, unknown>[] {
  try {
    if (fs.existsSync(SCRAPED_FILE)) {
      return JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf-8"));
    }
  } catch {
    // corrupt file, start fresh
  }
  return [];
}

function saveData(records: Record<string, unknown>[]) {
  ensureDataDir();
  // Deduplicate by post_url
  const byUrl = new Map<string, Record<string, unknown>>();
  for (const r of records) {
    byUrl.set(r.post_url as string, r);
  }
  fs.writeFileSync(SCRAPED_FILE, JSON.stringify([...byUrl.values()], null, 2));
}

/**
 * Run the full scraping pipeline.
 * Scrapes YouTube via RSS + transcript (no API keys needed).
 * TikTok/Instagram only run if RAPIDAPI_KEY is set.
 */
export async function runScrapingPipeline() {
  console.log("[Pipeline] Starting scraping pipeline...");
  console.log(`[Pipeline] ${CREATORS.length} creators to scrape`);

  const platformResults: PlatformResult[] = [
    { platform: "youtube", creators_scraped: 0, content_found: 0, breakouts_detected: 0 },
    { platform: "tiktok", creators_scraped: 0, content_found: 0, breakouts_detected: 0 },
    { platform: "instagram", creators_scraped: 0, content_found: 0, breakouts_detected: 0 },
  ];

  const allContent = loadExistingData();

  for (const creator of CREATORS) {
    // YouTube (no API key needed)
    if (creator.youtube_channel_id) {
      try {
        const videos = await scrapeYouTubeCreator({
          id: creator.id,
          name: creator.name,
          youtube_channel_id: creator.youtube_channel_id,
        });
        if (videos.length > 0) {
          allContent.push(...videos);
          platformResults[0].creators_scraped++;
          platformResults[0].content_found += videos.length;
          platformResults[0].breakouts_detected += videos.filter((v) => v.breakout_score >= 7).length;
          console.log(`[Pipeline] ${creator.name}: ${videos.length} YouTube videos scraped`);
        }
      } catch (error) {
        console.error(`[Pipeline] YouTube error for ${creator.name}:`, error);
      }
    }

    // TikTok (only if RAPIDAPI_KEY is set)
    if (creator.tiktok_handle && process.env.RAPIDAPI_KEY) {
      try {
        const videos = await scrapeTikTokCreator({
          id: creator.id,
          name: creator.name,
          tiktok_handle: creator.tiktok_handle,
          baseline_views_per_hour_tiktok: 1000,
        });
        if (videos.length > 0) {
          allContent.push(...videos);
          platformResults[1].creators_scraped++;
          platformResults[1].content_found += videos.length;
          platformResults[1].breakouts_detected += videos.filter((v) => v.breakout_score >= 7).length;
        }
      } catch (error) {
        console.error(`[Pipeline] TikTok error for ${creator.name}:`, error);
      }
    }

    // Instagram (only if RAPIDAPI_KEY is set)
    if (creator.instagram_handle && process.env.RAPIDAPI_KEY) {
      try {
        const videos = await scrapeInstagramCreator({
          id: creator.id,
          name: creator.name,
          instagram_handle: creator.instagram_handle,
          baseline_views_per_hour_instagram: 800,
        });
        if (videos.length > 0) {
          allContent.push(...videos);
          platformResults[2].creators_scraped++;
          platformResults[2].content_found += videos.length;
          platformResults[2].breakouts_detected += videos.filter((v) => v.breakout_score >= 7).length;
        }
      } catch (error) {
        console.error(`[Pipeline] Instagram error for ${creator.name}:`, error);
      }
    }
  }

  // Save to local JSON file
  saveData(allContent);
  console.log(`[Pipeline] Saved ${allContent.length} total records to ${SCRAPED_FILE}`);

  // Also try Supabase if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from("scraped_content")
        .upsert(allContent, { onConflict: "post_url" });
      if (error) {
        console.error("[Pipeline] Supabase upsert error:", error.message);
      } else {
        console.log("[Pipeline] Also saved to Supabase");
      }
    } catch (error) {
      console.error("[Pipeline] Supabase save failed:", error);
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
