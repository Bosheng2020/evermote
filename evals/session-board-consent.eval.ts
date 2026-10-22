import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "A requested personal commitment is proposed against the current revision and waits for exact human approval.",
  async test(t) {
    const turn = await t.send(
      "Track this on this conversation's board: I will send the proposal by Friday. Owner: user. Success means the proposal is emailed. Do not save it as long-term profile memory.",
    );

    turn.calledTool("get_session_board");
    turn.calledTool("update_session_board", {
      status: "pending",
      input: {
        action: "add_commitment",
        expectedRevision: 0,
        owner: "user",
      },
    });
    turn.session.requireInputRequest({
      toolName: "update_session_board",
      prompt: /revision 0.*add commitment/is,
    });
    turn.notCalledTool("profile__save_memory");
  },
});
