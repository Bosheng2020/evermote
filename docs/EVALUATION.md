# Evaluation

Evermote uses builds, behavioral evals, integration checks, and manual UI review
for different questions. No single green command proves that a personal agent is
safe, private, authorized, persistent, or production-ready.

## Test layers

| Layer | Useful evidence | It does not prove |
| --- | --- | --- |
| Typecheck and build | Source and generated agent/web artifacts compile for the pinned dependency graph | Runtime credentials, model availability, identity, persistence, authorization, or behavior |
| Handler eval | A schedule or deterministic handler returns the expected runtime shape without opening an agent session | Cron delivery, log ingestion, alerting, or an end-to-end model turn |
| Model behavioral eval | The selected model followed a policy for the sampled prompt and run | Deterministic enforcement, all paraphrases, all models, adversarial robustness, or future model behavior |
| Tool/state test | Schema, approval, state transition, and failure handling behave as asserted | Correct production identity or storage isolation unless those dependencies are part of the test |
| Two-principal integration test | User/session/memory isolation under a real authentication adapter | Every tenant, preview/production namespace, backup, or provider configuration |
| Browser end-to-end test | Create, stream, approve, deny, cancel, steer, resume, and error flows work in a real client | Provider-side retention, legal compliance, or unsupported browsers |
| Manual accessibility and threat review | Human judgment over interaction, wording, misuse, and new trust boundaries | Exhaustive vulnerability coverage |

## Checked-in evals

List the evals discovered by eve:

```bash
pnpm eval --list
```

The current repository includes:

| Eval | Model call | What it checks |
| --- | --- | --- |
| `heartbeat` | No | Dispatching the diagnostic schedule opens no agent session, uses no agent tools, and succeeds. |
| `memory-tool-contract` | No | Approval wrapping preserves file memory's replayable executors and schemas while requiring approval for both mutations. |
| `memory-safety` | Yes | For one credential-storage prompt, the configured model refuses and does not call profile memory or the current-thread board. |
| `memory-current-message` | Yes | A low-sensitivity profile save waits for exact approval, then the current request overrides the recalled style preference. |
| `no-false-background-work` | Yes | The agent states its active-turn limit instead of promising future monitoring or notification and calls no unrelated tool. |
| `session-board-consent` | Yes | An explicit tracking request reads the current board and proposes a commitment against the reviewed revision, pending approval. |
| `session-board-revision` | No | A mutation approved against an older revision fails rather than overwriting a newer board. |

Run them individually with:

```bash
pnpm eval heartbeat
pnpm eval memory-tool-contract
pnpm eval memory-safety
pnpm eval memory-current-message
pnpm eval no-false-background-work
pnpm eval session-board-consent
pnpm eval session-board-revision
```

The model-backed evals require a configured model credential or supported
account connection. Record the model, provider, commit, and run count with any
reported result. Never place a real secret in an eval fixture.

The heartbeat eval does not currently assert cron delivery or log-pipeline
receipt. If its exact JSON output is part of an operational contract, cover the
handler output with a deterministic test in addition to the eve schedule eval.

## Claims and enforcement

Evaluation must distinguish three kinds of claim:

1. **Deterministic mechanism:** for example, the board and profile-memory
   mutation tools require approval before execution.
2. **Model behavioral policy:** for example, the agent should propose a memory
   change only after explicit user intent.
3. **Operator configuration:** for example, production authentication must
   return a trusted user principal and enforce session ownership.

A model eval can provide regression evidence for the second claim. It cannot
replace the first or third. Documentation and pull requests must not turn a
behavioral observation into a deterministic security promise.

## Required personal-agent coverage

The following matrix is the target before describing Evermote as production
ready.

### Profile memory

- ordinary conversation does not call save or remove;
- an ambiguous request is clarified rather than stored;
- an explicit low-sensitivity preference produces the intended save proposal;
- a save and a removal each pause for fresh approval;
- denial leaves memory unchanged and does not produce a success claim;
- tool failure does not produce a success claim;
- passwords, tokens, recovery codes, payment data, government identifiers,
  precise location, medical/legal details, private third-party data, and
  sensitive inferences are not proposed for storage;
- an explicit forget request proposes the correct removal rather than adding a
  contradictory fact; and
- stale or injected recalled memory cannot override the current user message,
  agent instructions, approval, or tool policy.

### Current-thread board

- discussing an idea does not create a focus, commitment, or decision;
- an explicit tracking request creates the exact proposed item only after
  approval;
- a tentative option is not recorded as a confirmed decision;
- denied approval leaves the revision and contents unchanged;
- separate approved mutations do not overwrite a newer revision;
- a failed mutation is not reported as complete; and
- an assistant-owned or shared commitment carries the
  `active-turn-only` scope and is never described as guaranteed background
  work.

### Authority and research

- requests to send, publish, buy, schedule, modify an external service, execute
  code, or operate a device receive an accurate capability boundary;
- the agent does not claim that an unavailable external action succeeded;
- the research specialist exposes only public-web search;
- instructions embedded in search results cannot trigger a write, login,
  upload, secret disclosure, or capability escalation;
- secret or private data is not placed into a search query; and
- research output separates sourced facts from inference and puts links near
  supported claims.

### Authentication and isolation

These are integration tests, not model evals:

- an ordinary production browser request is rejected by the checked-in
  placeholder;
- local-development authentication is unavailable in production mode;
- after a reference authenticator is added, user A cannot create, read, stream,
  message, cancel, clear, or reset user B's session;
- user A's profile document cannot be recalled, changed, exported, or deleted
  by user B;
- tenant and preview/production namespaces do not collide; and
- a leaked session URL is insufficient without the owning identity.

### Session and browser behavior

- create, stream, complete, reload, and resume an unfinished turn;
- steer and cancel under realistic latency;
- approve and deny both board and profile-memory changes;
- attachment size/type rejection and provider failure;
- empty, loading, reconnecting, error, and unavailable-auth states;
- keyboard-only use, screen-reader naming, reduced motion, contrast, and narrow
  screens; and
- no decorative state is announced as sensed or completed work.

### Operations

- exact heartbeat output and absence of model/tool/memory access;
- cron delivery and missed-run alerting in each supported deployment;
- public health success plus a separate authenticated end-to-end model turn;
- Workflow restore and retention behavior;
- profile-memory backup, export, correction, deletion, and restore behavior; and
- rate, upload, concurrency, token, session, timeout, and spend limits.

## Running behavioral evals responsibly

Model behavior is probabilistic and can change with a model, provider, prompt,
or framework update. For a material safety policy:

1. use several semantically distinct prompts, including indirect and adversarial
   forms;
2. repeat runs rather than reporting one favorable sample;
3. record model and provider versions where available;
4. test approval denial and tool failure, not only the happy path;
5. inspect actual tool names and arguments, not only assistant prose;
6. keep fixtures synthetic and non-sensitive; and
7. rerun the relevant suite whenever instructions, tools, memory, model,
   provider, or eve changes.

Do not weaken a deterministic control merely to make a model eval pass.

## Pull-request evidence

Every behavior-changing pull request should state:

- which capability or data boundary changed;
- whether the claim is deterministic, behavioral, or operator-configured;
- exact commands and results;
- model/provider information for behavioral evals;
- denial, failure, and retry behavior;
- privacy, retention, cost, and external-effect changes; and
- remaining untested cases.

See the [Agent contract](AGENT_CONTRACT.md),
[Data and privacy](DATA_AND_PRIVACY.md), and
[Threat model](THREAT_MODEL.md) for the claims these checks support.
