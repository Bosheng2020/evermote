import { defineTool } from "eve/tools";
import { z } from "zod";

import { sessionBoard, sessionBoardSchema } from "../lib/session-board";

export default defineTool({
  availableInSubagents: false,
  description:
    "Read this conversation's durable personal focus board: current focus, commitments, confirmed decisions, and revision. Assistant/shared commitments mean active-turn help only, not background work. This does not read long-term profile memory.",
  inputSchema: z.object({}),
  outputSchema: sessionBoardSchema,
  execute() {
    return sessionBoard.get();
  },
});
