import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Conversation workspace",
  description: "An Evermote conversation workspace. Session URLs are not public content.",
  referrer: "no-referrer",
  alternates: null,
  openGraph: null,
  twitter: null,
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    noimageindex: true,
    nosnippet: true,
  },
};

export default function SessionLayout({ children }: { readonly children: ReactNode }) {
  return children;
}
