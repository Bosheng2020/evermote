# Agent contract

This document defines the product and authority contract of the checked-in
Evermote personal agent. It describes current behavior, not a roadmap promise.
If code and this document disagree, treat the narrower capability as the safe
assumption and fix the mismatch before release.

## Purpose

Evermote helps a person turn an intention into an inspectable next step while
preserving the person's ownership of the work. It can converse, research the
public web, keep approved current-thread planning state, and carry a small
approved profile notebook across sessions.

Evermote is not a person, employee, fiduciary, professional adviser, or
background worker. A warm visual presence does not grant it authority.

## Current capability and authority

| Capability | Reads | Writes or effects | Control boundary |
| --- | --- | --- | --- |
| Conversation | Current session events, attachments, recalled profile context | Model response in the current session | User can steer or cancel; model output is untrusted |
| Current-thread board | Focus, commitments, and confirmed decisions in the current session | Adds, changes, or removes board entries | Explicit user intent in agent policy, exact expected revision, and fresh approval for every tool call |
| Profile memory | One bounded document for the trusted user principal | Saves or removes low-sensitivity profile facts | Explicit user intent in agent policy plus fresh approval for every save or remove call |
| Root web research | User question and public search results | Search query sent to a hosted provider; response added to the session | Read-only search tool; no arbitrary fetch or external write |
| Research specialist | Public context included in its delegated task | Search query and research response | Separate instructions and only the read-only search tool |
| Daily heartbeat | No user session or profile memory | One fixed event in the operator log | Handler-only schedule; no model, tools, or user delivery |
| Dormant sandbox | Nothing through the current tool surface | Nothing through the current tool surface | Configured for build/runtime compatibility but not exposed to the model |

Evermote has no checked-in ability to send email or messages, modify a calendar
or task service, make a purchase, control a device, use a microphone or camera,
read a desktop, execute shell commands, or write files. A user discussing,
planning, or approving text about such an action does not perform it.

## Active-turn ownership

The current-thread board can label a commitment as owned by the assistant or
shared with it. The schema records `assistantScope: "active-turn-only"` for
either case. That means the agent should materially help during an active user
turn. It does not mean the runtime will:

- continue reasoning after the turn completes;
- wake itself for that commitment;
- notify the user;
- perform an external action; or
- guarantee completion.

The board is session-scoped working state, not a global project tracker. A new
session does not automatically receive another session's board.

Every mutation names the revision the user reviewed. If the board has changed,
the stale mutation fails and the agent must read the new revision and request
new approval.

The v2 board contains:

- one optional focus with a summary, desired outcome, and review cadence;
- at most 100 commitments, owned by `user`, `assistant`, or `shared`, with
  status `open`, `blocked`, `done`, or `cancelled` and optional next
  action, success criteria, due text, review cadence, and blocked reason; and
- at most 100 decisions, each marked as confirmed by the user and optionally
  superseding an earlier decision.

Changing the persisted state key to `evermote.session-board.v2` intentionally
starts a fresh board for sessions that only contain the incompatible v1 shape.

## Approval and user intent

Approval and intent are related but different controls:

1. Agent instructions require an explicit user request before changing the
   current-thread board or profile memory.
2. The corresponding mutation tool presents the exact proposed call for fresh
   approval.
3. Only an approved tool call may change that state.
4. Approval applies to that call only. It is not standing permission for later
   writes, a related action, or a delegated action.
5. If approval is denied or the tool fails, the agent must adapt without
   claiming that the change happened.

The explicit-intent rule is a behavioral policy interpreted by the model. It is
not itself an authentication or authorization control. The approval gate is the
deterministic execution boundary for the checked-in board and memory mutation
tools. Deployers should still inspect proposed content and can add deterministic
validation for their policy.

## Memory contract

Profile memory is a small model-maintained document, not an automatic transcript
archive, vector database, or complete personal history.

Evermote should save only an explicitly requested, durable, low-sensitivity
fact that will improve future sessions. It should not save:

- passwords, tokens, private keys, or recovery codes;
- payment data or government identifiers;
- precise location;
- medical or legal details;
- private information about another person;
- sensitive inferred traits; or
- transient conversation details.

Every save and remove call requires approval. Recalled memory is untrusted
context, can be stale or wrong, and cannot override the current user message,
agent instructions, authentication, approval, or tool policy.

The repository does not yet provide a complete memory-management screen for
inspection, correction, export, expiration, and account-wide deletion.
Deployers must establish those procedures before enabling memory for real users.
See [Data and privacy](DATA_AND_PRIVACY.md).

## Persistence contract

“Persistent” is never an unconditional property:

- conversation events survive only according to the configured Workflow store
  and retention policy;
- current-thread board state is part of that session and ends with it;
- profile memory can cross sessions only when a production backend and stable,
  trusted user principal are configured;
- local-development profile memory is shared within the process and disappears
  when that process ends; and
- the browser's presentation state is not agent memory.

## Identity and session access

The checked-in production placeholder fails closed. Vercel OIDC can authenticate
supported service-to-service calls, but it is not an end-user login system.

A production operator must provide a trusted user identity and enforce that the
user and tenant own every session they create, read, stream, message, cancel,
clear, or reset. A session ID is an address, not a bearer credential or proof of
ownership.

The profile-memory scope accepts a `user` principal supplied by that
authenticator; it does not independently verify a person's identity.

## Evidence and completion claims

The model must distinguish:

- a proposal from an approved change;
- an attempted tool call from a successful result;
- a commitment from completed work;
- search evidence from inference; and
- service availability from a successful end-to-end model turn.

No response should say that Evermote remembered, forgot, updated, verified,
contacted, published, scheduled, or completed something unless the relevant
checked-in capability returned success. External actions are absent, so the
agent cannot truthfully claim to have performed them.

## Extending the agent

Any new connection, external write, user-facing schedule, memory store, sensor,
or executable tool must ship with:

- the least authority needed for one named purpose;
- visible user intent and, for consequential changes, per-action approval;
- a success or failure receipt;
- revocation and credential-rotation behavior;
- data-retention and deletion semantics;
- rate, time, token, and spend limits;
- adversarial and denial-path tests; and
- corresponding updates to the capability table, architecture, data map,
  threat model, and evaluation guide.

## Explicit non-goals

- covert monitoring of microphone, camera, location, screen, or input;
- silently harvesting a personal profile from ordinary conversation;
- pretending that a diagnostic heartbeat is proactive personal work;
- autonomous high-impact medical, legal, financial, employment, housing, or
  safety decisions;
- using model output as authorization, trusted code, or proof; and
- presenting decorative interface state as sensed context.
