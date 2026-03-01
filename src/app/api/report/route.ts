import { NextRequest, NextResponse } from "next/server";
import {
  buildReportFromScrapedData,
  getAvailableReportDates,
} from "@/lib/transform-scraped";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const list = searchParams.get("list");
  const date = searchParams.get("date");

  if (list === "true") {
    const dates = getAvailableReportDates();
    return NextResponse.json(dates);
  }

  const report = buildReportFromScrapedData(date || undefined);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function POST() {
  const report = buildReportFromScrapedData();
  return NextResponse.json({
    success: true,
    report,
    message: "Report generation triggered",
  });
}
