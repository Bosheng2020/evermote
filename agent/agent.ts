import { defineAgent } from "eve";

export default defineAgent({
  defaultTools: false,
  limits: {
    maxInputTokensPerSession: 200_000,
    maxOutputTokensPerSession: 30_000,
    maxTokenCostUsdPerSession: 1.5,
    sessionTimeoutMs: 30 * 24 * 60 * 60 * 1_000,
  },
  model: "openai/gpt-6-luna-fast",
  reasoning: "high",
  // Evermote delegates research only to its deliberately read-only specialist.
  // Disabling the root-copy tool prevents a child from inheriting mutating tools.
  tool: false,
});
