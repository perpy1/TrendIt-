// Standalone scraper script — no API keys needed for YouTube
// Run with: npx tsx scripts/scrape.ts

import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SCRAPED_FILE = path.join(DATA_DIR, "scraped-content.json");

const CREATORS = [
  { id: "1", name: "Alex Hormozi", youtube_channel_id: "UCrvchO1h6lWZAuGaa1LqX9Q" },
  { id: "2", name: "Codie Sanchez", youtube_channel_id: "UCJZ8lEnZmzQ5qOqF9joxIxQ" },
  { id: "3", name: "Gary Vee", youtube_channel_id: "UChjfv8-vAA1CZA84f-h5X_Q" },
  { id: "4", name: "Sahil Bloom", youtube_channel_id: "UC0vZSXQHRGPNZMFAKPLJcww" },
  { id: "5", name: "Dan Koe", youtube_channel_id: "UCWXYDYv5STLk-zoxMP2I1Lw" },
  { id: "6", name: "Ali Abdaal", youtube_channel_id: "UCoOae5nYA7VqaXzerajD0lg" },
  { id: "7", name: "Iman Gadzhi", youtube_channel_id: "UC-l4IawN1e_eHns1NmkoKTg" },
  { id: "8", name: "Leila Hormozi", youtube_channel_id: "UCZuY75gOI808Rqyr6LgxVww" },
  { id: "9", name: "Chris Do", youtube_channel_id: "UC-b3c7kxa5vU-bnmaROgvog" },
  { id: "10", name: "Mr Beast", youtube_channel_id: "UCX6OQ3DkcsbYNE6H8uQQuVA" },
  { id: "11", name: "Steven Bartlett", youtube_channel_id: "UCGq-a57w-aPwyi3pW7XLiHw" },
  { id: "12", name: "Noah Kagan", youtube_channel_id: "UCXC3etwvNkMBGrc6tcwu5oQ" },
  { id: "13", name: "Pat Flynn", youtube_channel_id: "UCSApI9wlWUEJMToyFvyIRKQ" },
  { id: "14", name: "Ed Mylett", youtube_channel_id: "UCIprGZAdzn3ZqgLmDuibYcw" },
  { id: "15", name: "Graham Stephan", youtube_channel_id: "UCV6KDgJskWaEckne5aPA0aQ" },
  { id: "16", name: "Matt Gray", youtube_channel_id: "UChYHKRass0kZvBkVKQuZElQ" },
  { id: "17", name: "Alex Garcia", youtube_channel_id: "UCnGOF8GmTnJu-7VsjX1IOHQ" },
  { id: "18", name: "Oren Meets World", youtube_channel_id: "UC_tSQ6UQy2pROm-I0J7UBoA" },
  { id: "19", name: "Tom Noske", youtube_channel_id: "UC0tNbnCRYniecs_n3d7-8dA" },
  { id: "20", name: "Caleb Ralston", youtube_channel_id: "UCbc7A6bNtpyybJbGvIi0PNQ" },
  { id: "21", name: "The Futur", youtube_channel_id: "UC-b3c7kxa5vU-bnmaROgvog" },
  { id: "22", name: "Jun Yuh", youtube_channel_id: "UClDcKhHgT3x88I0q7BOT0ow" },
  { id: "23", name: "Dan Koe Talks", youtube_channel_id: "UCWXYDYv5STLk-zoxMP2I1Lw" },
  { id: "24", name: "Kallaway", youtube_channel_id: "UCg5WjzrwxRRUUDf7WHKPzsA" },
  { id: "25", name: "Neil Patel", youtube_channel_id: "UCl-Zrl0QhF66lu1aGXaTbfw" },
  { id: "26", name: "Sweat Equity Podcast", youtube_channel_id: "UC3c6jXLSMhDH6XlcoKXGryA" },
  { id: "27", name: "Vanessa Lau", youtube_channel_id: "UCdOPzgbosSnbfwd9-iXP2NA" },
  { id: "28", name: "Tim Ferriss", youtube_channel_id: "UCznv7Vf9nBdJYvBagFdAHWw" },
  { id: "29", name: "Russell Brunson", youtube_channel_id: "UC2qUDKqTsz00csykCYgdLuA" },
  { id: "30", name: "Jay Shetty", youtube_channel_id: "UCbk_QsfaFZG6PdQeCvaYXJQ" },
  { id: "31", name: "Tom Bilyeu", youtube_channel_id: "UCnYMOamNKLGVlJgRUbamveA" },
  { id: "32", name: "Tina Huang", youtube_channel_id: "UC2UXDak6o7rBm23k3Vv5dww" },
  { id: "33", name: "Mark Tilbury", youtube_channel_id: "UCxgAuX3XZROujMmGphN_scA" },
  { id: "34", name: "Coin Bureau (Guy)", youtube_channel_id: "UCqK_GSMbpiV8spgD3ZGloSw" },
  { id: "35", name: "Grant Cardone", youtube_channel_id: "UCdlNK1xcy-Sn8liq7feNxWw" },
];

function calculateBreakoutScore(viewCount: number, hoursLive: number, baseline: number): number {
  if (hoursLive <= 0 || baseline <= 0) return 0;
  const viewsPerHour = viewCount / hoursLive;
  const velocityMultiple = viewsPerHour / baseline;
  return Math.round(Math.min(10, Math.log2(velocityMultiple + 1) * 2.5) * 10) / 10;
}

function extractHook(text: string | null): string {
  if (!text) return "";
  const cleaned = text.trim().replace(/\s+/g, " ");
  const snippet = cleaned.slice(0, 200);
  const sentenceEnd = snippet.search(/[.!?]\s/);
  if (sentenceEnd > 20) return snippet.slice(0, sentenceEnd + 1);
  return snippet.length < cleaned.length ? snippet + "..." : snippet;
}

async function fetchRSS(channelId: string) {
  try {
    const { data: xml } = await axios.get(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { timeout: 10000 }
    );
    const videos: { videoId: string; title: string; publishedAt: string }[] = [];
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    for (const entry of entries.slice(0, 10)) {
      const vid = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const title = entry.match(/<title>([^<]+)<\/title>/);
      const pub = entry.match(/<published>([^<]+)<\/published>/);
      if (vid && title && pub) videos.push({ videoId: vid[1], title: title[1], publishedAt: pub[1] });
    }
    return videos;
  } catch { return []; }
}

async function getVideoStats(videoId: string) {
  try {
    const { data: html } = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept-Language": "en-US,en;q=0.9" },
    });
    let viewCount = 0;
    const vm = html.match(/"viewCount":"(\d+)"/) || html.match(/<meta itemprop="interactionCount" content="(\d+)"/);
    if (vm) viewCount = parseInt(vm[1]);
    let likes = 0;
    const lm = html.match(/"label":"([\d,]+) likes"/);
    if (lm) likes = parseInt(lm[1].replace(/,/g, ""));
    return { viewCount, likes };
  } catch { return { viewCount: 0, likes: 0 }; }
}

async function main() {
  console.log(`\n=== TRENDIT SCRAPER ===`);
  console.log(`Scraping ${CREATORS.length} creators (YouTube RSS + transcripts, no API keys)\n`);

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const allContent: Record<string, unknown>[] = [];
  let totalVideos = 0;
  let totalBreakouts = 0;

  for (const creator of CREATORS) {
    process.stdout.write(`[${creator.name}] Fetching RSS...`);
    const videos = await fetchRSS(creator.youtube_channel_id);
    if (videos.length === 0) { console.log(" no videos found"); continue; }
    console.log(` ${videos.length} videos`);

    for (const video of videos) {
      // Stats
      const stats = await getVideoStats(video.videoId);

      // Transcript
      let transcript: string | null = null;
      try {
        const td = await YoutubeTranscript.fetchTranscript(video.videoId);
        transcript = td.map((t) => t.text).join(" ");
      } catch {
        transcript = video.title;
      }

      const hoursLive = Math.max(0.1, (Date.now() - new Date(video.publishedAt).getTime()) / 3600000);
      const viewsPerHour = stats.viewCount / hoursLive;
      const breakoutScore = calculateBreakoutScore(stats.viewCount, hoursLive, 500);

      allContent.push({
        creator_id: creator.id,
        creator_name: creator.name,
        platform: "youtube",
        post_url: `https://www.youtube.com/watch?v=${video.videoId}`,
        view_count: stats.viewCount,
        likes: stats.likes,
        comments: 0,
        published_at: video.publishedAt,
        views_per_hour: Math.round(viewsPerHour),
        breakout_score: breakoutScore,
        hook_text: extractHook(transcript),
        transcript_snippet: transcript?.slice(0, 500) || null,
        content_format: "other",
        scraped_at: new Date().toISOString(),
      });

      totalVideos++;
      if (breakoutScore >= 7) totalBreakouts++;

      // Small delay
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Deduplicate & save
  const byUrl = new Map<string, Record<string, unknown>>();
  for (const r of allContent) byUrl.set(r.post_url as string, r);
  const deduplicated = [...byUrl.values()];

  fs.writeFileSync(SCRAPED_FILE, JSON.stringify(deduplicated, null, 2));

  console.log(`\n=== DONE ===`);
  console.log(`Total videos scraped: ${totalVideos}`);
  console.log(`Unique videos saved: ${deduplicated.length}`);
  console.log(`Breakouts detected (score >= 7): ${totalBreakouts}`);
  console.log(`Saved to: ${SCRAPED_FILE}\n`);
}

main().catch(console.error);
