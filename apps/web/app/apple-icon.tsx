import { ImageResponse } from "next/og";

export const size = {
  height: 180,
  width: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <svg fill="none" viewBox="0 0 102 102" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#101512" height="102" rx="24" width="102" />
      <circle
        cx="51"
        cy="51"
        r="35"
        stroke="#C9F27C"
        strokeDasharray="2 7"
        strokeOpacity=".22"
      />
      <path
        d="M51 28C62 28 72 36 72 49C72 64 63 74 50 74C37 74 29 65 29 52C29 39 38 28 51 28Z"
        fill="#F2BD68"
      />
      <path
        d="M41 39C45 34 51 33 56 35"
        opacity=".72"
        stroke="#FFF1CC"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="24" cy="44" fill="#7FC3B4" r="4" />
      <circle cx="78" cy="34" fill="#EF8E71" r="3.5" />
      <circle cx="77" cy="70" fill="#C9F27C" r="4.5" />
      <circle cx="32" cy="78" fill="#FFE4B5" r="3" />
    </svg>,
    size,
  );
}
