import { defineAgent } from "eve";

export default defineAgent({
  defaultTools: false,
  description:
    "Read-only public-web researcher for open-ended, current, multi-source, or contested questions. Returns dated evidence, direct source URLs, caveats, and clearly labeled inference; never performs side effects.",
  limits: {
    maxInputTokensPerSession: 60_000,
    maxOutputTokensPerSession: 8_000,
    maxTokenCostUsdPerSession: 0.25,
    sessionTimeoutMs: 60 * 60 * 1_000,
  },
  model: "openai/gpt-6-luna-fast",
  reasoning: "high",
});
