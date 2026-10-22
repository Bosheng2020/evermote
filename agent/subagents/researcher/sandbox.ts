import { defineParentSandbox } from "eve/sandbox";

// The researcher has only hosted web search and never needs filesystem or
// process access. Reusing the parent's inert portable sandbox avoids a second,
// environment-dependent provider selection during builds.
export default defineParentSandbox();
