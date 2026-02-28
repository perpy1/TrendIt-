import { NextRequest, NextResponse } from "next/server";

// Telegram Bot Webhook Handler
// Set webhook URL in Telegram: https://api.telegram.org/bot<TOKEN>/setWebhook?url=<APP_URL>/api/telegram

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trendit.app";

interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name: string; username?: string };
  chat: { id: number; type: string };
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

async function sendMessage(chatId: number, text: string, parseMode = "HTML") {
  if (!BOT_TOKEN) return;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  });
}

function handleCommand(command: string, chatId: number, userId: number) {
  switch (command) {
    case "/start":
      return sendMessage(
        chatId,
        `🚀 <b>Welcome to Trendit Alerts!</b>\n\n` +
        `This bot sends you real-time notifications when major creator trends break out.\n\n` +
        `It's a companion to the Trendit web app — your daily trend intelligence report.\n\n` +
        `👉 <a href="${APP_URL}">Sign up at ${APP_URL}</a> to get started\n\n` +
        `Then connect your Telegram in Settings to start receiving alerts.`
      );

    case "/latest":
      const today = new Date().toISOString().split("T")[0];
      return sendMessage(
        chatId,
        `📊 <b>Latest Trend Report</b>\n\n` +
        `👉 <a href="${APP_URL}/report/${today}">View today's report</a>`
      );

    case "/help":
      return sendMessage(
        chatId,
        `ℹ️ <b>Trendit Alerts Bot</b>\n\n` +
        `This bot sends push notifications for major trend breakouts.\n\n` +
        `<b>Commands:</b>\n` +
        `/start — Welcome message\n` +
        `/latest — Link to latest report\n` +
        `/help — This help message\n\n` +
        `For the full experience, visit:\n` +
        `👉 <a href="${APP_URL}">${APP_URL}</a>`
      );

    default:
      return sendMessage(
        chatId,
        `I'm the Trendit Alerts bot. I send notifications for major creator trend breakouts.\n\n` +
        `Use /help to see available commands.`
      );
  }
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    if (update.message?.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;

      if (text.startsWith("/")) {
        await handleCommand(text.split(" ")[0], chatId, userId);
      } else {
        await handleCommand("default", chatId, userId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// Endpoint to send alerts programmatically
export async function PUT(request: NextRequest) {
  try {
    const { type, trendName, summary, platforms, reportUrl } = await request.json();

    // In production, this would fetch all connected TG users from the database
    // and send them the alert
    const alertMessage = type === "breakout"
      ? `🚨 <b>Trend Alert: ${trendName}</b>\n\n` +
        `${summary}\n\n` +
        `🟢 Emerging | ${platforms} platforms confirmed\n\n` +
        `👉 <a href="${reportUrl}">View full report</a>`
      : `📊 <b>Today's Trend Report is live</b>\n\n` +
        `${summary}\n\n` +
        `👉 <a href="${reportUrl}">Read the full report</a>`;

    return NextResponse.json({
      success: true,
      message: alertMessage,
      users_notified: 0, // Would be actual count in production
    });
  } catch (error) {
    console.error("Alert send error:", error);
    return NextResponse.json({ error: "Failed to send alert" }, { status: 500 });
  }
}
