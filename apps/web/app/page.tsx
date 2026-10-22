import type { Metadata } from "next";
import { AgentChat } from "@/app/_components/agent-chat";
import { StructuredData } from "@/app/_components/structured-data";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_IMAGE_ALT,
  absoluteUrl,
  softwareSourceCodeJsonLd,
  webApplicationJsonLd,
} from "@/app/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: {
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Evermote — an open-source personal agent",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SOCIAL_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evermote — an open-source personal agent",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: SOCIAL_IMAGE_ALT }],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${absoluteUrl("/")}#website`,
        "@type": "WebSite",
        description: SITE_DESCRIPTION,
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
      webApplicationJsonLd(),
      softwareSourceCodeJsonLd(),
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <AgentChat />
    </>
  );
}
