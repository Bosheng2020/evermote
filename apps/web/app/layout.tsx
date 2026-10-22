import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/app/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: "Evermote — an open-source personal agent",
    template: "%s · Evermote",
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    "personal AI agent",
    "open-source AI agent",
    "self-hosted AI assistant",
    "human in the loop",
    "resumable agent threads",
    "scoped memory",
    "eve",
  ],
  authors: [{ name: "Evermote contributors" }],
  creator: "Evermote contributors",
  category: "technology",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION === undefined
      ? undefined
      : { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#111814",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
