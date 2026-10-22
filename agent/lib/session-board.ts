import { defineState } from "eve/context";
import { z } from "zod";

export const commitmentOwnerSchema = z.enum(["user", "assistant", "shared"]);
export const commitmentStatusSchema = z.enum(["open", "blocked", "done", "cancelled"]);
export const decisionStatusSchema = z.enum(["confirmed", "superseded"]);

export const focusSchema = z.object({
  summary: z.string().trim().min(1).max(300),
  desiredOutcome: z.string().trim().min(1).max(800).optional(),
  reviewCadence: z.string().trim().min(1).max(160).optional(),
});

export const commitmentSchema = z
  .object({
    id: z.string(),
    title: z.string().trim().min(1).max(300),
    owner: commitmentOwnerSchema,
    status: commitmentStatusSchema,
    nextAction: z.string().trim().min(1).max(600).optional(),
    successCriteria: z.string().trim().min(1).max(800).optional(),
    due: z.string().trim().min(1).max(160).optional(),
    reviewCadence: z.string().trim().min(1).max(160).optional(),
    blockedReason: z.string().trim().min(1).max(600).optional(),
    assistantScope: z.literal("active-turn-only").optional(),
  })
  .superRefine((commitment, ctx) => {
    const assistantParticipates = commitment.owner !== "user";
    if (assistantParticipates && commitment.assistantScope !== "active-turn-only") {
      ctx.addIssue({
        code: "custom",
        message:
          "Assistant and shared commitments must state that assistant help is active-turn-only.",
        path: ["assistantScope"],
      });
    }
    if (!assistantParticipates && commitment.assistantScope !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "User-owned commitments cannot carry an assistant scope.",
        path: ["assistantScope"],
      });
    }
  });

export const decisionSchema = z.object({
  id: z.string(),
  summary: z.string().trim().min(1).max(600),
  rationale: z.string().trim().min(1).max(1_200).optional(),
  status: decisionStatusSchema,
  confirmedBy: z.literal("user"),
  supersedes: z.string().optional(),
});

export const sessionBoardSchema = z.object({
  revision: z.number().int().nonnegative(),
  focus: focusSchema.nullable(),
  commitments: z.array(commitmentSchema).max(100),
  decisions: z.array(decisionSchema).max(100),
});

export type SessionBoard = z.infer<typeof sessionBoardSchema>;

export function createInitialSessionBoard(): SessionBoard {
  return {
    revision: 0,
    focus: null,
    commitments: [],
    decisions: [],
  };
}

// The v2 key intentionally starts a fresh board for older sessions whose v1
// responsibility shape cannot represent focus or bounded assistant ownership.
export const sessionBoard = defineState<SessionBoard>(
  "evermote.session-board.v2",
  createInitialSessionBoard,
);
