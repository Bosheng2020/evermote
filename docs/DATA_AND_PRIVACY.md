# Data and privacy

Evermote is source code that a person or organization can deploy. The
open-source project does not operate every deployment and cannot set one global
privacy policy for them. The deployment operator determines providers,
locations, retention, access, and legal obligations and must give users an
accurate notice before collecting real personal data.

This document maps the data handled by the checked-in application and identifies
decisions every operator must make.

## Data map

| Data | Purpose | Typical recipients or store | Default boundary |
| --- | --- | --- | --- |
| Prompts and model responses | Conversation and reasoning | eve Workflow state; configured model or gateway; operator logs if enabled | Session-scoped, but retention follows the Workflow and provider configuration |
| Attachments | Context for a model turn | Session/transport path and configured model or gateway | Can contain sensitive data; type, size, retention, and malware controls are operator responsibilities |
| Current-thread board | Current focus, commitments, and user-confirmed decisions | Typed state inside the current Workflow session | Does not automatically cross into another session; every mutation requires approval and names the reviewed revision |
| Profile memory | Small set of approved, durable, low-sensitivity facts | Private Vercel Blob after setup or an explicit self-hosted backend | Principal-scoped only if production identity is trustworthy; every save/remove requires approval |
| Search queries and results | Public-web research | Model-native search provider or Exa fallback, plus the session transcript | Leaves the Evermote runtime; do not include secrets or private data |
| Authentication and session identifiers | Route access and session lookup | Auth provider, eve runtime, cookies/headers, and possibly logs | Session ID is not authorization; production must enforce ownership separately |
| Tool names, arguments, results, and approval events | Execute and explain bounded capabilities | Workflow session, client event stream, and possibly observability systems | Can reveal user intent and personal context |
| Runtime errors, traces, and metrics | Operations and debugging | Hosting and observability providers chosen by the operator | Can accidentally contain prompts, identifiers, tool arguments, or provider errors |
| Heartbeat event | Service-level schedule signal | Runtime standard output and the operator's log pipeline | Contains a fixed event name, status, and version; it does not read user data |
| Browser scroll position | Restore presentation within a tab | Browser `sessionStorage` | Presentation state only; not agent memory |

The checked-in default model is hosted through Vercel AI Gateway, and public-web
research is hosted. Evermote is therefore not local-only or local-first by
default. Changing the model seam does not automatically make search, storage,
logging, or Workflow processing local.

## Three different kinds of continuity

### Session history

Conversation events, attachments, tool events, approvals, and the current-thread
board live in Workflow state. Their durability, backup, region, and deletion
depend on the selected Workflow world and operator policy.

Local Workflow data can appear under `.eve/.workflow-data`. It is ignored by
Git but can contain sensitive content. It is not a backup design.

### Current-thread board

The board belongs to one session. It can survive a reload when that session
survives, but it is not global profile memory and is not copied automatically to
new sessions. Removing a board item does not erase related statements from the
conversation transcript.

### Profile memory

The profile slot is a bounded, model-maintained document that can be recalled in
later sessions. Its custom scope accepts a trusted `user` principal and then
partitions storage with `byPrincipal`. The scope trusts the identity supplied
by production authentication; it does not independently prove who the caller
is.

In `eve dev`, every local conversation uses one shared, process-local
`local-dev` profile and the profile disappears on process exit. Never use that
scope for real multi-user or sensitive data.

On Vercel, profile memory requires a private Blob integration. Other production
hosts require an explicit `MemoryDocumentBackend`. Missing production storage
must not be papered over with a shared process-global fallback.

## Memory consent and limits

Evermote's agent policy requires an explicit user request before proposing a
profile save or removal. Every save or remove tool call then pauses for fresh
human approval. These are separate controls:

- the model interprets whether the request was explicit; and
- the tool approval is the deterministic boundary that permits that exact
  mutation to execute.

Approval is not blanket consent for later writes. A deployer that needs a
stricter content policy should add deterministic classification or validation
before storage rather than relying only on a model instruction.

Recalled memory is untrusted and may be stale, incomplete, poisoned, or wrong.
It must not override the current user message or any security control.

The current UI does not provide a complete account-level memory inspector,
bulk export, correction history, expiration control, or verified erasure
workflow. A user can ask the agent to list or remove remembered content, but an
operator must still provide reliable access, export, and deletion procedures
before enabling memory for real users.

## Current user controls

The checked-in interface supports:

- steering or cancelling an active model turn;
- approving or denying each current-thread board mutation;
- approving or denying each profile-memory save or removal;
- asking what the agent recalls and requesting a removal; and
- closing the browser without granting background authority.

It does not yet provide:

- an account or device management screen;
- direct transcript export or account-wide deletion;
- a provider-retention selector;
- a global list of sessions and profile records;
- a user-facing schedule manager; or
- connection and credential revocation for third-party apps, because no such
  app connections are checked in.

## Operator requirements

Before processing real personal data, document and test:

1. **Identity:** how an end user is authenticated and how sessions and profile
   memory are bound to that verified user and tenant.
2. **Purpose:** which data is necessary for conversation, memory, research, and
   operations, and which data must never be entered.
3. **Providers:** every model, gateway, search, hosting, storage, identity, and
   observability provider that receives data.
4. **Location and transfer:** processing regions and any cross-border transfer.
5. **Retention:** separate periods for sessions, attachments, profile memory,
   logs, backups, and provider copies.
6. **Access:** who can read production content and how access is reviewed.
7. **User rights:** authenticated inspection, correction, export, expiration,
   and deletion, including backups and provider-held copies.
8. **Security:** encryption, secret management, rate limits, incident response,
   restoration, and credential rotation.
9. **Model data use:** provider training, abuse monitoring, and zero-retention
   settings where available.
10. **Changes:** how users learn when a new tool, connection, memory source, or
    proactive behavior changes the data flow.

Do not enable analytics, replay, verbose traces, or error capture without
including them in this map and in the user-facing notice.

## Recommended user-facing notice

A deployment's notice should state, in plain language:

- who operates the instance and how to contact them;
- that an AI model can be wrong;
- which provider processes conversations and attachments;
- that web research sends queries to a hosted search provider;
- what session history and profile memory retain;
- that profile-memory changes require approval but transcript retention is a
  separate concern;
- how long each category is kept;
- how to inspect, correct, export, and delete it;
- whether humans can review content or logs; and
- that the current project performs no external write actions or user-facing
  background work.

## Development and support hygiene

- Never commit `.env`, `.eve`, `.vercel`, browser profiles, transcripts,
  raw traces, or screenshots containing personal data.
- Use synthetic fixtures for issues, pull requests, evals, and demos.
- Redact tokens, session IDs, user IDs, prompts, attachments, and tool arguments
  before sharing logs.
- Treat a public issue or pull request as public disclosure.
- Report suspected vulnerabilities through the process in
  [Security policy](../SECURITY.md).

See also the [Agent contract](AGENT_CONTRACT.md),
[Architecture](ARCHITECTURE.md), [Deployment](DEPLOYMENT.md), and
[Threat model](THREAT_MODEL.md).
