import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Try Supabase insert if configured, otherwise store locally
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, serviceKey);

      const { error } = await supabase
        .from("email_subscribers")
        .upsert({ email }, { onConflict: "email" });

      if (error) {
        console.error("[Subscribe] Supabase error:", error.message);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
      }
    } else {
      // Log to console when Supabase isn't configured
      console.log(`[Subscribe] New email subscriber: ${email}`);
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
