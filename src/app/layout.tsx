import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trendit — Daily Creator Trend Intelligence",
  description: "The daily trend report for creators who build in public. We monitor 50+ creators across TikTok, Instagram, and YouTube to detect breakout content and emerging trends.",
  openGraph: {
    title: "Trendit — Daily Creator Trend Intelligence",
    description: "The daily trend report for creators who build in public.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${jetbrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
