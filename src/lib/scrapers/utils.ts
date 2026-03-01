import type { ScrapedContent } from "@/lib/types";

/**
 * Calculate breakout score (0-10) based on velocity metrics.
 * A video "breaks out" when it accumulates views much faster than baseline.
 */
export function calculateBreakoutScore({
  viewCount,
  hoursLive,
  baselineViewsPerHour,
}: {
  viewCount: number;
  hoursLive: number;
  baselineViewsPerHour: number;
}): number {
  if (hoursLive <= 0 || baselineViewsPerHour <= 0) return 0;

  const viewsPerHour = viewCount / hoursLive;
  const velocityMultiple = viewsPerHour / baselineViewsPerHour;

  // Map velocity multiple to 0-10 score
  // 1x = baseline (score ~1), 3x = notable (score ~5), 10x+ = viral (score ~9-10)
  const score = Math.min(10, Math.log2(velocityMultiple + 1) * 2.5);
  return Math.round(score * 10) / 10;
}

/**
 * Extract the opening hook from a transcript or caption.
 * Takes the first 1-2 sentences (up to ~200 chars).
 */
export function extractHook(transcript: string | null): string {
  if (!transcript) return "";

  const cleaned = transcript.trim().replace(/\s+/g, " ");

  // Take first 200 chars, then trim to last sentence boundary
  const snippet = cleaned.slice(0, 200);
  const sentenceEnd = snippet.search(/[.!?]\s/);

  if (sentenceEnd > 20) {
    return snippet.slice(0, sentenceEnd + 1);
  }

  // If no sentence boundary, just take the snippet
  return snippet.length < cleaned.length ? snippet + "..." : snippet;
}

/**
 * Calculate how many hours a piece of content has been live.
 */
export function hoursLive(publishedAt: string): number {
  const published = new Date(publishedAt).getTime();
  const now = Date.now();
  return Math.max(0.1, (now - published) / (1000 * 60 * 60));
}

/**
 * Build a partial ScrapedContent record ready for DB insert.
 */
export function buildContentRecord({
  creatorId,
  creatorName,
  platform,
  postUrl,
  viewCount,
  likes,
  comments,
  publishedAt,
  transcript,
  baselineViewsPerHour,
  contentFormat = "other",
}: {
  creatorId: string;
  creatorName: string;
  platform: ScrapedContent["platform"];
  postUrl: string;
  viewCount: number;
  likes: number;
  comments: number;
  publishedAt: string;
  transcript: string | null;
  baselineViewsPerHour: number;
  contentFormat?: ScrapedContent["content_format"];
}) {
  const hours = hoursLive(publishedAt);
  const viewsPerHour = viewCount / hours;

  return {
    creator_id: creatorId,
    creator_name: creatorName,
    platform,
    post_url: postUrl,
    view_count: viewCount,
    likes,
    comments,
    published_at: publishedAt,
    views_per_hour: Math.round(viewsPerHour),
    breakout_score: calculateBreakoutScore({
      viewCount,
      hoursLive: hours,
      baselineViewsPerHour,
    }),
    hook_text: extractHook(transcript),
    transcript_snippet: transcript?.slice(0, 500) || null,
    content_format: contentFormat,
  };
}
