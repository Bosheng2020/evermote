import { defineMemory } from "eve/memory";
import { byPrincipal } from "eve/memory/scope";

import { approvalGatedFileMemory } from "../lib/approval-gated-file-memory";

export default defineMemory({
  description:
    "A compact notebook for explicit, durable, low-sensitivity facts and preferences about the authenticated user. Never store secrets, regulated data, sensitive inferences, or transient chat details.",
  // Production uses a private Vercel Blob store. Provision it with
  // `eve integration setup file-memory`; non-Vercel hosts must supply an
  // explicit backend. Missing storage fails closed instead of becoming an
  // accidental process-local memory.
  provider: approvalGatedFileMemory({ maxCharacters: 4_000 }),
  scope(context) {
    const caller = context.session.auth.current;
    // Never let a service principal collapse several end users into one
    // profile. Local development keeps Eve's documented local-dev behavior.
    if (caller?.principalType !== "user" && caller?.principalType !== "local-dev") {
      return null;
    }
    return byPrincipal(context);
  },
});
