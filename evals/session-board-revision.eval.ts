import { defineEval } from "eve/evals";
import { equals, includes } from "eve/evals/expect";

import { createInitialSessionBoard } from "../agent/lib/session-board";
import { applySessionBoardUpdate } from "../agent/tools/update_session_board";

export default defineEval({
  description:
    "An approved board change cannot be replayed against a newer revision than the user reviewed.",
  test(t) {
    const first = applySessionBoardUpdate(createInitialSessionBoard(), {
      action: "set_focus",
      expectedRevision: 0,
      summary: "Prepare the proposal",
    });
    const second = applySessionBoardUpdate(first.board, {
      action: "add_commitment",
      expectedRevision: 1,
      title: "Help draft the proposal in this turn",
      owner: "assistant",
    });

    let staleError = "";
    try {
      applySessionBoardUpdate(second.board, {
        action: "clear_focus",
        expectedRevision: 0,
      });
    } catch (error) {
      staleError = error instanceof Error ? error.message : String(error);
    }

    t.check(second.board.revision, equals(2));
    t.check(second.board.focus?.summary, equals("Prepare the proposal"));
    t.check(second.board.commitments[0]?.assistantScope, equals("active-turn-only"));
    t.check(staleError, includes("Stale session-board update"));
  },
});
