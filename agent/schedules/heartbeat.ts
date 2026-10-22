import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  // Eve/Vercel cron expressions are UTC. This runs once per day at 04:17 UTC.
  cron: "17 4 * * *",
  run() {
    // A handler-only heartbeat never opens a model session, so it cannot call
    // tools, read user memory, trigger approval, or incur inference/search cost.
    console.info(
      JSON.stringify({
        event: "evermote.heartbeat",
        status: "ok",
        version: 1,
      }),
    );
  },
});
