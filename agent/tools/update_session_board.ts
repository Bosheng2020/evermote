import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import {
  commitmentOwnerSchema,
  commitmentSchema,
  commitmentStatusSchema,
  decisionSchema,
  focusSchema,
  sessionBoard,
  sessionBoardSchema,
  type SessionBoard,
} from "../lib/session-board";

const expectedRevision = z.number().int().nonnegative();
const optionalTextPatch = (max: number) => z.string().trim().min(1).max(max).nullable().optional();

export const sessionBoardUpdateSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set_focus"),
    expectedRevision,
    summary: z.string().trim().min(1).max(300),
    desiredOutcome: z.string().trim().min(1).max(800).optional(),
    reviewCadence: z.string().trim().min(1).max(160).optional(),
  }),
  z.object({
    action: z.literal("clear_focus"),
    expectedRevision,
  }),
  z.object({
    action: z.literal("add_commitment"),
    expectedRevision,
    title: z.string().trim().min(1).max(300),
    owner: commitmentOwnerSchema,
    nextAction: z.string().trim().min(1).max(600).optional(),
    successCriteria: z.string().trim().min(1).max(800).optional(),
    due: z.string().trim().min(1).max(160).optional(),
    reviewCadence: z.string().trim().min(1).max(160).optional(),
  }),
  z
    .object({
      action: z.literal("update_commitment"),
      expectedRevision,
      id: z.string().trim().min(1).max(40),
      title: z.string().trim().min(1).max(300).optional(),
      owner: commitmentOwnerSchema.optional(),
      status: commitmentStatusSchema.optional(),
      nextAction: optionalTextPatch(600),
      successCriteria: optionalTextPatch(800),
      due: optionalTextPatch(160),
      reviewCadence: optionalTextPatch(160),
      blockedReason: optionalTextPatch(600),
    })
    .refine(
      ({ action: _action, expectedRevision: _revision, id: _id, ...patch }) =>
        Object.values(patch).some((value) => value !== undefined),
      { message: "At least one commitment field must change." },
    ),
  z.object({
    action: z.literal("record_decision"),
    expectedRevision,
    summary: z.string().trim().min(1).max(600),
    rationale: z.string().trim().min(1).max(1_200).optional(),
    supersedes: z.string().trim().min(1).max(40).optional(),
  }),
  z.object({
    action: z.literal("remove_item"),
    expectedRevision,
    kind: z.enum(["commitment", "decision"]),
    id: z.string().trim().min(1).max(40),
  }),
]);

const outputSchema = z.object({
  changed: z.literal(true),
  itemId: z.string(),
  board: sessionBoardSchema,
});

export type SessionBoardUpdate = z.infer<typeof sessionBoardUpdateSchema>;
type UpdateOutput = z.infer<typeof outputSchema>;

function nextId(prefix: "c" | "d", board: SessionBoard): string {
  return `${prefix}-${board.revision + 1}`;
}

function withAssistantScope(owner: z.infer<typeof commitmentOwnerSchema>): {
  assistantScope?: "active-turn-only";
} {
  return owner === "user" ? {} : { assistantScope: "active-turn-only" };
}

function applyOptionalPatch(
  target: Record<string, unknown>,
  key: string,
  value: string | null | undefined,
): void {
  if (value === undefined) return;
  if (value === null) delete target[key];
  else target[key] = value;
}

export function applySessionBoardUpdate(
  current: SessionBoard,
  input: SessionBoardUpdate,
): UpdateOutput {
  if (current.revision !== input.expectedRevision) {
    throw new Error(
      `Stale session-board update: approved revision ${input.expectedRevision}, current revision ${current.revision}. Read the board again and request fresh approval.`,
    );
  }

  const revision = current.revision + 1;
  let itemId: string;
  let next: SessionBoard;

  switch (input.action) {
    case "set_focus": {
      itemId = "focus";
      next = {
        ...current,
        revision,
        focus: focusSchema.parse({
          summary: input.summary,
          desiredOutcome: input.desiredOutcome,
          reviewCadence: input.reviewCadence,
        }),
      };
      break;
    }
    case "clear_focus": {
      itemId = "focus";
      next = { ...current, revision, focus: null };
      break;
    }
    case "add_commitment": {
      itemId = nextId("c", current);
      const commitment = commitmentSchema.parse({
        id: itemId,
        title: input.title,
        owner: input.owner,
        status: "open",
        nextAction: input.nextAction,
        successCriteria: input.successCriteria,
        due: input.due,
        reviewCadence: input.reviewCadence,
        ...withAssistantScope(input.owner),
      });
      next = {
        ...current,
        revision,
        commitments: [...current.commitments, commitment],
      };
      break;
    }
    case "update_commitment": {
      const existing = current.commitments.find((item) => item.id === input.id);
      if (!existing) throw new Error(`Unknown commitment: ${input.id}`);
      itemId = existing.id;

      const raw: Record<string, unknown> = { ...existing };
      if (input.title !== undefined) raw.title = input.title;
      if (input.status !== undefined) raw.status = input.status;
      if (input.owner !== undefined) {
        raw.owner = input.owner;
        delete raw.assistantScope;
        Object.assign(raw, withAssistantScope(input.owner));
      }
      applyOptionalPatch(raw, "nextAction", input.nextAction);
      applyOptionalPatch(raw, "successCriteria", input.successCriteria);
      applyOptionalPatch(raw, "due", input.due);
      applyOptionalPatch(raw, "reviewCadence", input.reviewCadence);
      applyOptionalPatch(raw, "blockedReason", input.blockedReason);

      const updated = commitmentSchema.parse(raw);
      next = {
        ...current,
        revision,
        commitments: current.commitments.map((item) => (item.id === input.id ? updated : item)),
      };
      break;
    }
    case "record_decision": {
      if (input.supersedes) {
        const prior = current.decisions.find((item) => item.id === input.supersedes);
        if (!prior) throw new Error(`Unknown decision to supersede: ${input.supersedes}`);
        if (prior.status === "superseded") {
          throw new Error(`Decision is already superseded: ${input.supersedes}`);
        }
      }

      itemId = nextId("d", current);
      const decision = decisionSchema.parse({
        id: itemId,
        summary: input.summary,
        rationale: input.rationale,
        status: "confirmed",
        confirmedBy: "user",
        supersedes: input.supersedes,
      });
      next = {
        ...current,
        revision,
        decisions: [
          ...current.decisions.map((item) =>
            item.id === input.supersedes ? { ...item, status: "superseded" as const } : item,
          ),
          decision,
        ],
      };
      break;
    }
    case "remove_item": {
      const collection = input.kind === "commitment" ? current.commitments : current.decisions;
      if (!collection.some((item) => item.id === input.id)) {
        throw new Error(`Unknown ${input.kind}: ${input.id}`);
      }
      itemId = input.id;
      next = {
        ...current,
        revision,
        commitments:
          input.kind === "commitment"
            ? current.commitments.filter((item) => item.id !== input.id)
            : current.commitments,
        decisions:
          input.kind === "decision"
            ? current.decisions.filter((item) => item.id !== input.id)
            : current.decisions,
      };
      break;
    }
  }

  return { changed: true, itemId, board: sessionBoardSchema.parse(next) };
}

function ownerLabel(owner: z.infer<typeof commitmentOwnerSchema>): string {
  if (owner === "user") return "the user";
  if (owner === "assistant") return "the assistant (active-turn help only)";
  return "shared ownership (assistant participation is active-turn only)";
}

function patchSummary(input: Extract<SessionBoardUpdate, { action: "update_commitment" }>): string {
  const changes = [
    input.title === undefined ? null : `title “${input.title}”`,
    input.owner === undefined ? null : `owner ${ownerLabel(input.owner)}`,
    input.status === undefined ? null : `status ${input.status}`,
    input.nextAction === undefined
      ? null
      : input.nextAction === null
        ? "clear next action"
        : `next action “${input.nextAction}”`,
    input.successCriteria === undefined
      ? null
      : input.successCriteria === null
        ? "clear success criteria"
        : `success criteria “${input.successCriteria}”`,
    input.due === undefined ? null : input.due === null ? "clear due date" : `due “${input.due}”`,
    input.reviewCadence === undefined
      ? null
      : input.reviewCadence === null
        ? "clear review cadence"
        : `review cadence “${input.reviewCadence}”`,
    input.blockedReason === undefined
      ? null
      : input.blockedReason === null
        ? "clear blocked reason"
        : `blocked reason “${input.blockedReason}”`,
  ].filter((change): change is string => change !== null);
  return changes.join(", ");
}

export default defineTool({
  availableInSubagents: false,
  description:
    "Change this conversation's focus, commitments, or confirmed decisions. First read get_session_board and pass its exact revision as expectedRevision. Assistant/shared ownership means help during the active turn only, never background execution. Every call pauses for human review; a stale approved call fails instead of changing newer state.",
  inputSchema: sessionBoardUpdateSchema,
  outputSchema,
  approval: {
    request: always(),
    prompt: ({ input }) => {
      const prefix = `Update session board revision ${input.expectedRevision}`;
      switch (input.action) {
        case "set_focus":
          return `${prefix}: set focus to “${input.summary}”${input.desiredOutcome ? ` with desired outcome “${input.desiredOutcome}”` : ""}${input.reviewCadence ? ` and review cadence “${input.reviewCadence}”` : ""}?`;
        case "clear_focus":
          return `${prefix}: clear the current focus?`;
        case "add_commitment":
          return `${prefix}: add commitment “${input.title}” for ${ownerLabel(input.owner)}${input.nextAction ? `, next action “${input.nextAction}”` : ""}${input.successCriteria ? `, success criteria “${input.successCriteria}”` : ""}${input.due ? `, due “${input.due}”` : ""}${input.reviewCadence ? `, review cadence “${input.reviewCadence}”` : ""}?`;
        case "update_commitment":
          return `${prefix}: update ${input.id} — ${patchSummary(input)}?`;
        case "record_decision":
          return `${prefix}: record the user-confirmed decision “${input.summary}”${input.rationale ? ` with rationale “${input.rationale}”` : ""}${input.supersedes ? ` and supersede ${input.supersedes}` : ""}?`;
        case "remove_item":
          return `${prefix}: remove ${input.kind} ${input.id}?`;
      }
    },
  },
  label: {
    start: ({ action }) =>
      action === "record_decision" ? "Record confirmed decision" : "Update personal focus board",
  },
  execute(input) {
    let output: UpdateOutput | undefined;
    sessionBoard.update((current) => {
      output = applySessionBoardUpdate(current, input);
      return output.board;
    });
    if (!output) throw new Error("Session board update did not complete.");
    return output;
  },
});
