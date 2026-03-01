import { google } from "googleapis";
import { YoutubeTranscript } from "youtube-transcript";
import { buildContentRecord } from "./utils";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

interface Creator {
  id: string;
  name: string;
  youtube_channel_id: string | null;
  baseline_views_per_hour_youtube: number;
}

/**
 * Scrape recent videos for a single YouTube creator.
 */
export async function scrapeYouTubeCreator(creator: Creator) {
  if (!creator.youtube_channel_id) return [];

  try {
    // 1. Get uploads playlist ID
    const channelRes = await youtube.channels.list({
      id: [creator.youtube_channel_id],
      part: ["contentDetails"],
    });

    const uploadsPlaylistId =
      channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return [];

    // 2. Fetch recent videos (last 10)
    const playlistRes = await youtube.playlistItems.list({
      playlistId: uploadsPlaylistId,
      part: ["snippet"],
      maxResults: 10,
    });

    const videoIds = (playlistRes.data.items || [])
      .map((item) => item.snippet?.resourceId?.videoId)
      .filter(Boolean) as string[];

    if (videoIds.length === 0) return [];

    // 3. Get video stats
    const statsRes = await youtube.videos.list({
      id: videoIds,
      part: ["statistics", "snippet"],
    });

    const results = [];

    for (const video of statsRes.data.items || []) {
      const videoId = video.id!;
      const stats = video.statistics!;
      const snippet = video.snippet!;

      // 4. Try to get transcript
      let transcript: string | null = null;
      try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        transcript = transcriptData.map((t) => t.text).join(" ");
      } catch {
        // Transcript not available — that's fine
      }

      const record = buildContentRecord({
        creatorId: creator.id,
        creatorName: creator.name,
        platform: "youtube",
        postUrl: `https://www.youtube.com/watch?v=${videoId}`,
        viewCount: parseInt(stats.viewCount || "0"),
        likes: parseInt(stats.likeCount || "0"),
        comments: parseInt(stats.commentCount || "0"),
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        transcript,
        baselineViewsPerHour: creator.baseline_views_per_hour_youtube || 500,
      });

      results.push(record);
    }

    return results;
  } catch (error) {
    console.error(`[YouTube] Error scraping ${creator.name}:`, error);
    return [];
  }
}
