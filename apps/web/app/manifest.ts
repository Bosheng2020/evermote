import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/app/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — open-source personal agent`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#111814",
    theme_color: "#111814",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
