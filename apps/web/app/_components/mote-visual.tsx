const MOTE_STATES = [
  "idle",
  "listening",
  "thinking",
  "working",
  "attention",
  "paused",
  "error",
] as const;

export type MoteVisualState = (typeof MOTE_STATES)[number];

export type MoteVisualProps = {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly decorative?: boolean;
  readonly size?: number | string;
  readonly state?: MoteVisualState;
};

const STATE_LABELS: Record<MoteVisualState, string> = {
  attention: "Mote needs attention",
  error: "Mote encountered an error",
  idle: "Mote is idle",
  listening: "Mote is listening",
  paused: "Mote is paused",
  thinking: "Mote is thinking",
  working: "Mote is working",
};

const MOTE_STYLES = `
  .mote-visual {
    --mote-core: #f2bd68;
    --mote-flare: #ee8e71;
    --mote-cool: #7fc3b4;
    --mote-pale: #ffe4b5;
    --mote-line: #d9b779;
    display: block;
    isolation: isolate;
    overflow: visible;
  }

  .mote-visual .mv-scene,
  .mote-visual .mv-seed,
  .mote-visual .mv-orbit,
  .mote-visual .mv-particle {
    transform-box: view-box;
    transform-origin: 60px 60px;
  }

  .mote-visual .mv-halo {
    animation: mv-halo-breathe 4.8s ease-in-out infinite;
    fill: none;
    opacity: 0.16;
    stroke: var(--mote-line);
    stroke-dasharray: 1 7;
    stroke-linecap: round;
    stroke-width: 1.25;
    transform-box: fill-box;
    transform-origin: center;
  }

  .mote-visual .mv-orbit {
    animation: mv-orbit-cw 12s linear infinite;
  }

  .mote-visual .mv-orbit-b {
    animation-duration: 16s;
    animation-direction: reverse;
  }

  .mote-visual .mv-orbit-c {
    animation: mv-orbit-rock 7s ease-in-out infinite;
  }

  .mote-visual .mv-orbit-line {
    fill: none;
    opacity: 0.25;
    stroke: var(--mote-line);
    stroke-width: 1.15;
    vector-effect: non-scaling-stroke;
  }

  .mote-visual .mv-orbit-a .mv-orbit-line {
    stroke-dasharray: 13 8 2 8;
  }

  .mote-visual .mv-orbit-b .mv-orbit-line {
    stroke-dasharray: 4 7;
  }

  .mote-visual .mv-orbit-c .mv-orbit-line {
    stroke-dasharray: 18 10;
  }

  .mote-visual .mv-particle {
    animation: mv-particle-pulse 2.8s ease-in-out infinite;
    filter: drop-shadow(0 0 3px rgb(242 189 104 / 0.28));
    stroke: rgb(29 22 17 / 0.72);
    stroke-width: 1;
    transform-box: fill-box;
    transform-origin: center;
  }

  .mote-visual .mv-p1,
  .mote-visual .mv-p6,
  .mote-visual .mv-p9 {
    fill: var(--mote-core);
  }

  .mote-visual .mv-p2,
  .mote-visual .mv-p5,
  .mote-visual .mv-p10 {
    fill: var(--mote-flare);
  }

  .mote-visual .mv-p3,
  .mote-visual .mv-p8 {
    fill: var(--mote-cool);
  }

  .mote-visual .mv-p4,
  .mote-visual .mv-p7 {
    fill: var(--mote-pale);
  }

  .mote-visual .mv-p2 { animation-delay: -0.35s; }
  .mote-visual .mv-p3 { animation-delay: -0.7s; }
  .mote-visual .mv-p4 { animation-delay: -1.05s; }
  .mote-visual .mv-p5 { animation-delay: -1.4s; }
  .mote-visual .mv-p6 { animation-delay: -1.75s; }
  .mote-visual .mv-p7 { animation-delay: -2.1s; }
  .mote-visual .mv-p8 { animation-delay: -2.45s; }
  .mote-visual .mv-p9 { animation-delay: -0.9s; }
  .mote-visual .mv-p10 { animation-delay: -1.8s; }

  .mote-visual .mv-seed {
    animation: mv-seed-breathe 3.8s ease-in-out infinite;
    filter: drop-shadow(0 7px 10px rgb(0 0 0 / 0.2));
  }

  .mote-visual .mv-seed-body {
    fill: var(--mote-core);
    stroke: rgb(255 238 201 / 0.48);
    stroke-width: 1.15;
  }

  .mote-visual .mv-seed-shadow {
    fill: rgb(109 57 41 / 0.24);
  }

  .mote-visual .mv-seed-sheen {
    animation: mv-sheen 3.2s ease-in-out infinite;
    fill: rgb(255 250 229 / 0.72);
    transform-box: fill-box;
    transform-origin: center;
  }

  .mote-visual .mv-state-mark,
  .mote-visual .mv-listen-waves,
  .mote-visual .mv-attention-rays,
  .mote-visual .mv-work-thread {
    opacity: 0;
    transition: opacity 180ms ease;
  }

  .mote-visual .mv-listen-waves,
  .mote-visual .mv-attention-rays,
  .mote-visual .mv-work-thread,
  .mote-visual .mv-state-mark {
    fill: none;
    stroke: var(--mote-pale);
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .mote-visual .mv-listen-waves {
    animation: mv-listen 1.55s ease-out infinite;
    stroke-width: 1.8;
    transform-box: fill-box;
    transform-origin: center;
  }

  .mote-visual .mv-work-thread {
    animation: mv-thread-flow 1.15s linear infinite;
    stroke: var(--mote-cool);
    stroke-dasharray: 3 6;
    stroke-width: 1.65;
  }

  .mote-visual .mv-attention-rays {
    animation: mv-rays 1.3s ease-in-out infinite;
    stroke-width: 2.2;
    transform-box: fill-box;
    transform-origin: center;
  }

  .mote-visual .mv-pause-mark {
    fill: rgb(43 31 24 / 0.72);
    stroke: none;
  }

  .mote-visual .mv-error-mark {
    stroke: rgb(69 27 25 / 0.82);
    stroke-width: 2.15;
  }

  .mote-visual[data-state="listening"] {
    --mote-core: #f3cc78;
    --mote-cool: #8bd3c5;
    --mote-line: #8bd3c5;
  }

  .mote-visual[data-state="listening"] .mv-listen-waves {
    opacity: 0.76;
  }

  .mote-visual[data-state="listening"] .mv-halo {
    animation-duration: 1.7s;
    opacity: 0.3;
  }

  .mote-visual[data-state="listening"] .mv-seed {
    animation-duration: 1.9s;
  }

  .mote-visual[data-state="thinking"] {
    --mote-core: #c59ad9;
    --mote-flare: #efa779;
    --mote-cool: #8ccbc0;
    --mote-line: #c8a4d8;
  }

  .mote-visual[data-state="thinking"] .mv-orbit-a {
    animation-duration: 4.2s;
  }

  .mote-visual[data-state="thinking"] .mv-orbit-b {
    animation-duration: 5.8s;
  }

  .mote-visual[data-state="thinking"] .mv-orbit-c {
    animation-duration: 3.6s;
  }

  .mote-visual[data-state="thinking"] .mv-orbit-line {
    opacity: 0.43;
  }

  .mote-visual[data-state="working"] {
    --mote-core: #79c3a9;
    --mote-flare: #edaa68;
    --mote-cool: #a8ded1;
    --mote-line: #79c3a9;
  }

  .mote-visual[data-state="working"] .mv-work-thread {
    opacity: 0.58;
  }

  .mote-visual[data-state="working"] .mv-orbit-a {
    animation-duration: 6.2s;
  }

  .mote-visual[data-state="working"] .mv-orbit-b {
    animation-duration: 8.5s;
  }

  .mote-visual[data-state="working"] .mv-particle {
    animation-duration: 1.45s;
  }

  .mote-visual[data-state="attention"] {
    --mote-core: #ffbb6b;
    --mote-flare: #ff806e;
    --mote-line: #ffbb6b;
  }

  .mote-visual[data-state="attention"] .mv-scene {
    animation: mv-attention-pop 1.3s ease-in-out infinite;
  }

  .mote-visual[data-state="attention"] .mv-attention-rays {
    opacity: 0.82;
  }

  .mote-visual[data-state="attention"] .mv-halo {
    opacity: 0.42;
  }

  .mote-visual[data-state="paused"] {
    --mote-core: #c9ae82;
    --mote-flare: #9f8d78;
    --mote-cool: #91a8a2;
    --mote-line: #a89982;
  }

  .mote-visual[data-state="paused"] * {
    animation-play-state: paused !important;
  }

  .mote-visual[data-state="paused"] .mv-pause-mark {
    opacity: 1;
  }

  .mote-visual[data-state="paused"] .mv-orbit-line,
  .mote-visual[data-state="paused"] .mv-particle {
    opacity: 0.5;
  }

  .mote-visual[data-state="error"] {
    --mote-core: #ef796f;
    --mote-flare: #ffb06f;
    --mote-cool: #cf8e91;
    --mote-line: #ef796f;
  }

  .mote-visual[data-state="error"] .mv-scene {
    animation: mv-error-shiver 0.62s steps(2, end) infinite;
  }

  .mote-visual[data-state="error"] .mv-error-mark {
    opacity: 1;
  }

  .mote-visual[data-state="error"] .mv-orbit-line {
    opacity: 0.15;
    stroke-dasharray: 3 10;
  }

  @keyframes mv-halo-breathe {
    0%, 100% { opacity: 0.12; transform: scale(0.94); }
    50% { opacity: 0.29; transform: scale(1.04); }
  }

  @keyframes mv-orbit-cw {
    to { transform: rotate(360deg); }
  }

  @keyframes mv-orbit-rock {
    0%, 100% { transform: rotate(-7deg); }
    50% { transform: rotate(10deg); }
  }

  @keyframes mv-particle-pulse {
    0%, 100% { opacity: 0.56; transform: scale(0.82); }
    50% { opacity: 1; transform: scale(1.18); }
  }

  @keyframes mv-seed-breathe {
    0%, 100% { transform: rotate(-2deg) scale(0.97); }
    50% { transform: rotate(2deg) scale(1.035); }
  }

  @keyframes mv-sheen {
    0%, 100% { opacity: 0.45; transform: translate(-1px, 1px) scale(0.86); }
    50% { opacity: 0.85; transform: translate(1px, -1px) scale(1.08); }
  }

  @keyframes mv-listen {
    0% { opacity: 0; transform: scale(0.78); }
    35% { opacity: 0.82; }
    100% { opacity: 0; transform: scale(1.16); }
  }

  @keyframes mv-thread-flow {
    to { stroke-dashoffset: -18; }
  }

  @keyframes mv-rays {
    0%, 100% { transform: scale(0.88); }
    50% { transform: scale(1.08); }
  }

  @keyframes mv-attention-pop {
    0%, 72%, 100% { transform: scale(1); }
    80% { transform: scale(1.055); }
    88% { transform: scale(0.985); }
  }

  @keyframes mv-error-shiver {
    0%, 100% { transform: translateX(-1px) rotate(-0.7deg); }
    50% { transform: translateX(1px) rotate(0.7deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .mote-visual *,
    .mote-visual *::before,
    .mote-visual *::after {
      animation: none !important;
      transition: none !important;
    }

    .mote-visual[data-state="listening"] .mv-listen-waves,
    .mote-visual[data-state="working"] .mv-work-thread,
    .mote-visual[data-state="attention"] .mv-attention-rays,
    .mote-visual[data-state="paused"] .mv-pause-mark,
    .mote-visual[data-state="error"] .mv-error-mark {
      opacity: 0.82;
    }
  }
`;

/**
 * An original, procedural status character made entirely from SVG geometry.
 * Its ten motes and three orbital paths remain legible without animation.
 */
export function MoteVisual({
  ariaLabel,
  className,
  decorative = false,
  size = 96,
  state = "idle",
}: MoteVisualProps) {
  const label = ariaLabel ?? STATE_LABELS[state];
  const classes = className ? `mote-visual ${className}` : "mote-visual";

  return (
    <svg
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      className={classes}
      data-state={state}
      focusable="false"
      height={size}
      role={decorative ? undefined : "img"}
      shapeRendering="geometricPrecision"
      viewBox="0 0 120 120"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {decorative ? null : <title>{label}</title>}
      <style>{MOTE_STYLES}</style>

      <g className="mv-scene">
        <circle className="mv-halo" cx="60" cy="60" r="50" />

        <g className="mv-orbit mv-orbit-a">
          <ellipse
            className="mv-orbit-line"
            cx="60"
            cy="60"
            rx="44"
            ry="20"
            transform="rotate(-17 60 60)"
          />
          <circle className="mv-particle mv-p1" cx="101" cy="47" r="3.8" />
          <circle className="mv-particle mv-p2" cx="19" cy="73" r="2.45" />
        </g>

        <g className="mv-orbit mv-orbit-b">
          <ellipse
            className="mv-orbit-line"
            cx="60"
            cy="60"
            rx="26"
            ry="43"
            transform="rotate(27 60 60)"
          />
          <circle className="mv-particle mv-p3" cx="38" cy="24" r="3.15" />
          <circle className="mv-particle mv-p4" cx="82" cy="96" r="2.25" />
        </g>

        <g className="mv-orbit mv-orbit-c">
          <path
            className="mv-orbit-line"
            d="M24 41C40 15 87 17 99 49C108 74 88 101 55 100C30 99 14 84 17 64"
          />
          <circle className="mv-particle mv-p5" cx="26" cy="38" r="2.7" />
          <circle className="mv-particle mv-p6" cx="98" cy="50" r="3.25" />
        </g>

        <path className="mv-work-thread" d="M29 34L50 26L91 31L104 67L85 94L49 104L18 73Z" />

        <circle className="mv-particle mv-p7" cx="50" cy="25" r="2.15" />
        <circle className="mv-particle mv-p8" cx="91" cy="31" r="2.6" />
        <circle className="mv-particle mv-p9" cx="104" cy="67" r="3" />
        <circle className="mv-particle mv-p10" cx="49" cy="104" r="2.7" />

        <g className="mv-listen-waves" aria-hidden="true">
          <path d="M32 48C26 54 26 66 32 72" />
          <path d="M88 48C94 54 94 66 88 72" />
          <path d="M25 42C15 52 15 68 25 78" opacity="0.55" />
          <path d="M95 42C105 52 105 68 95 78" opacity="0.55" />
        </g>

        <g className="mv-attention-rays" aria-hidden="true">
          <path d="M60 7V15" />
          <path d="M60 105V113" />
          <path d="M7 60H15" />
          <path d="M105 60H113" />
          <path d="M22.5 22.5L28 28" />
          <path d="M92 92L97.5 97.5" />
          <path d="M97.5 22.5L92 28" />
          <path d="M28 92L22.5 97.5" />
        </g>

        <g className="mv-seed">
          <path
            className="mv-seed-body"
            d="M60 36C70 36 79 41 81 50C83 58 78 63 80 69C82 77 76 85 68 88C57 92 45 87 40 78C36 71 40 64 38 58C35 50 41 42 49 38C52 37 56 36 60 36Z"
          />
          <path
            className="mv-seed-shadow"
            d="M80 57C76 64 80 69 77 76C73 84 63 88 54 85C64 84 69 80 71 74C73 68 69 63 72 57C75 51 72 43 68 39C76 42 81 48 80 57Z"
          />
          <ellipse className="mv-seed-sheen" cx="50.5" cy="49" rx="5.4" ry="8" transform="rotate(35 50.5 49)" />

          <g className="mv-state-mark mv-pause-mark" aria-hidden="true">
            <rect x="53" y="54" width="4" height="13" rx="2" />
            <rect x="63" y="54" width="4" height="13" rx="2" />
          </g>
          <path className="mv-state-mark mv-error-mark" d="M60 47L56 57L63 62L58 73" aria-hidden="true" />
        </g>
      </g>
    </svg>
  );
}
