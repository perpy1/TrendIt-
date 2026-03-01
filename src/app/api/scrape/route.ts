import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Scraping pipeline endpoint
// Called by a cron job every 2-4 hours
// Authenticated via CRON_SECRET bearer token

export async function POST(request: NextRequest) {
  // Verify auth
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { runScrapingPipeline } = await import("@/lib/scrapers/pipeline");
    const result = await runScrapingPipeline();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Scrape API] Pipeline failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Pipeline failed",
      },
      { status: 500 }
    );
  }
}

// Health check for the scraping service
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    last_scrape: new Date().toISOString(),
    next_scrape: new Date(Date.now() + 2 * 3600000).toISOString(),
    platforms: ["youtube", "tiktok", "instagram"],
    creators_monitored: 50,
  });
}
