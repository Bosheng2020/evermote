import { defineEval } from "eve/evals";
import { equals } from "eve/evals/expect";

export default defineEval({
  description:
    "The cron heartbeat completes without opening a model session or exposing any agent tools.",
  async test(t) {
    const { sessionIds } = await t.target.dispatchSchedule("heartbeat");

    t.check(sessionIds, equals([]));
    t.usedNoTools();
    t.succeeded();
  },
});
