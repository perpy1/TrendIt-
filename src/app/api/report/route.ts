import { NextRequest, NextResponse } from "next/server";
import { getReportByDate, todayReport, pastReports } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    const report = getReportByDate(date);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json(report);
  }

  // Return today's report by default
  return NextResponse.json(todayReport);
}

export async function POST() {
  // This endpoint would trigger report generation
  // For MVP, return the mock report
  return NextResponse.json({
    success: true,
    report: todayReport,
    message: "Report generation triggered",
  });
}
