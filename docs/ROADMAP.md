# Roadmap

Evermote is an experiment in a governed personal agent for deliberate work.
Roadmap items are directional, have no committed release date, and do not
describe current capability. The current source of truth is the
[Agent contract](AGENT_CONTRACT.md).

## Shipped foundation

- an original responsive personal-agent workspace;
- real streamed model responses through eve;
- URL-addressed session replay and reconnection, subject to Workflow storage;
- cancellation and turn steering;
- file input and supported human-in-the-loop prompt rendering;
- a typed current-thread board for focus, commitments, and confirmed decisions;
- fresh approval for every board mutation;
- a bounded, trusted-user-only profile notebook with `byPrincipal`
  partitioning, no automatic post-turn capture, and fresh approval for every
  save or removal;
- hosted public-web search plus a narrower read-only research specialist;
- a daily handler-only diagnostic heartbeat with no model session or tools;
- an explicit in-process `just-bash` compatibility baseline that no current
  agent tool exposes;
- initial behavioral and schedule evals;
- explicit server-side model configuration;
- documented local, Vercel, and self-hosted source paths; and
- fail-closed production browser authentication until an operator configures a
  real user identity and session-ownership policy.

## Current boundaries

- Evermote has no external-write tool. It cannot send, publish, purchase,
  schedule, modify another service, execute code, or operate a device.
- It performs no user-facing background work. Assistant-owned or shared
  commitments carry an `active-turn-only` scope, not asynchronous execution.
- The heartbeat is an operator log event, not a reminder, agent loop, or
  proactive check-in.
- The current-thread board belongs to one session and is not a global task
  manager.
- Profile memory is one small model-maintained document, not automatic semantic
  retrieval or a complete personal history.
- The model decides whether a request satisfies the explicit-intent policy;
  approval is the deterministic execution boundary for each proposed board or
  profile-memory mutation.
- Local-development profile memory is shared within the process and disappears
  with the process. Vercel needs private Blob setup; other hosts need an
  explicit backend.
- The repository has no complete profile inspect, correction, export,
  expiration, or account-wide deletion interface.
- The production channel has an authentication seam, not an end-user account
  system or per-user session ACL.
- Ambient activity, awareness, mood, listening, weather, calendar, location,
  and sensor-like presentation is decorative unless a documented integration
  supplies it.
- The default model and web research are hosted. The project is not local-only
  or local-first.
- The configured `just-bash` workspace is dormant and in-process, not a native
  isolation boundary.

## Milestone 1: trustworthy single-user agent

- publish a reference private-instance authenticator;
- enforce and test ownership on every session route;
- add a direct current-thread board view with accurate active-turn ownership
  language;
- add profile-memory inspect, correct, export, expiration, and verified deletion
  controls;
- cover approval denial, stale approvals, backend failures, and false-success
  paths;
- add end-to-end tests for create, stream, steer, cancel, reconnect, resume, and
  attachment failure;
- finish keyboard, screen-reader, reduced-motion, high-contrast, and mobile
  audits; and
- ship a tested data-retention and erasure example.

## Milestone 2: deployer-ready reference stack

- add a tested container image and health/readiness strategy;
- document one explicit self-hosted `MemoryDocumentBackend`;
- document one durable self-hosted Workflow store with backup and restoration;
- add reference CSP, CSRF, origin, cookie, rate, upload, concurrency, timeout,
  session, token, and spend controls;
- add two-principal and preview/production namespace isolation tests;
- add provider and model migration tests; and
- publish an operator privacy-notice template tied to the data map.

Completing this milestone would improve the reference stack; it would not make
every fork or deployment production-ready.

## Later, only by explicit opt-in

- user-created, revocable schedules for personal check-ins;
- scoped calendar, tasks, weather, or messaging connections;
- action receipts and retry/idempotency contracts for external writes;
- optional semantic memory with per-source capture consent and complete
  inspect/edit/export/delete/expiration controls;
- local or private-network model profiles;
- voice input/output with unmistakable listening state and hardware permission
  boundaries;
- native desktop/mobile shells; and
- multi-device session handoff.

Any external write, user-facing recurring schedule, sensor, executable tool, or
expansion of personal memory must ship with visible intent, revocation,
least-privilege credentials, bounded cost, receipts, denial/failure tests, and
updates to the agent contract, data map, threat model, and evaluation guide.

## Explicit non-goals

- copying proprietary code, assets, private APIs, prompts, or interaction
  details;
- covert microphone, camera, location, screen, or input monitoring;
- presenting simulated context as sensed data;
- silently building a personal profile from ordinary conversation;
- claiming a commitment or scheduled diagnostic is completed personal work;
- unaudited autonomous financial, medical, legal, employment, housing, safety,
  or other high-impact actions;
- treating model output as identity, authorization, trusted code, or proof; and
- hiding hosted model, search, storage, or logging dependencies behind “open
  source,” “self-hosted,” or “local-first.”

## Proposing roadmap work

Open a feature request describing:

- the user problem, not only a proposed technology;
- why the current capability contract is insufficient;
- data, identity, permission, retention, and provider changes;
- success, denial, failure, retry, revocation, and deletion behavior;
- deterministic controls versus model behavioral policy;
- evaluation evidence; and
- how the change keeps the user in control.

Large changes should be discussed before implementation.
