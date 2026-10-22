import { defineEval } from "eve/evals";
import { equals } from "eve/evals/expect";
import type { MemoryToolsContext } from "eve/memory";
import { fileMemory } from "eve/memory/file";

import { gateFileMemoryTools } from "../agent/lib/approval-gated-file-memory";

const context = {
  channel: {},
  memory: {
    scope: {
      key: "evermote-eval/profile/user-1",
      namespace: "evermote-eval/profile",
      value: "user-1",
    },
    slot: "profile",
  },
  messages: [],
  model: null,
  session: {
    auth: {},
    id: "memory-tool-contract",
  },
  turn: {
    id: "turn-0",
    input: [],
    sequence: 0,
  },
} as unknown as MemoryToolsContext;

export default defineEval({
  description:
    "Approval gating preserves fileMemory's replayable executors and schemas instead of wrapping them in non-durable callbacks.",
  async test(t) {
    const original = await fileMemory({ maxCharacters: 4_000 }).tools?.(context);
    const gated = original ? gateFileMemoryTools(original) : null;

    if (!original || !gated) throw new Error("Expected file-memory tools.");

    for (const name of ["save_memory", "remove_memory"] as const) {
      t.check(gated[name]?.execute === original[name]?.execute, equals(true));
      t.check(gated[name]?.inputSchema === original[name]?.inputSchema, equals(true));
      t.check(typeof gated[name]?.approval, equals("function"));
    }
  },
});
