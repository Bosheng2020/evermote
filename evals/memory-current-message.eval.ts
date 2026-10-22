import { defineEval } from "eve/evals";
import { equals } from "eve/evals/expect";

export default defineEval({
  description:
    "Profile writes require approval, and a current request overrides an approved durable style preference.",
  async test(t) {
    const proposed = await t.send(
      "Please remember for future conversations that I usually prefer detailed, expansive answers.",
    );

    proposed.session.requireInputRequest({
      toolName: "profile__save_memory",
    });
    proposed.calledTool("profile__save_memory", { status: "pending" });

    const approved = await proposed.session.respondAll("approve");
    approved.calledTool("profile__save_memory", { status: "completed" });

    const current = await approved.session.send(
      "For this reply, override my usual preference and answer with exactly the single word BRIEF.",
    );
    t.check(current.message?.trim(), equals("BRIEF"));
  },
});
