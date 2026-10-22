# Deployment

Evermote is an experimental personal-agent starter. Its source can be published
and forked on GitHub, but GitHub does not run the agent, and this repository is
not a turnkey secure service. A usable deployment needs a Node runtime, model
connection, trusted end-user identity, per-session authorization, durable
Workflow storage, a production profile-memory backend, and explicit data
lifecycle procedures. You can obtain infrastructure from Vercel or operate it
yourself; either way, the deployer remains responsible for the resulting
service.

This guide follows eve `0.81.1`. Review `node_modules/eve/docs/guides/deployment`
after upgrading eve.

## Prerequisites

- Node.js `24.x` and the pnpm version pinned in `package.json`;
- a model credential or supported account connection;
- an HTTPS hostname for public use;
- an authentication design for the intended users;
- a decision about session and profile-memory retention, backup, deletion, and
  region; and
- a user-facing data notice covering model, search, hosting, storage, and
  observability providers.

Install and validate the source before choosing a deployment path:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build:agent
pnpm build:web
```

## Model credentials

The checked-in `agent/agent.ts` uses a string model ID. eve routes that form
through Vercel AI Gateway:

- on Vercel, the project can authenticate with Vercel OIDC;
- on another host, set `AI_GATEWAY_API_KEY`; or
- change `agent/agent.ts` to a provider-authored AI SDK model and provide that
  provider's server-side credential.

## Public origin and discovery metadata

Set `NEXT_PUBLIC_SITE_URL` to the stable HTTPS origin before building a
self-hosted public deployment:

```bash
NEXT_PUBLIC_SITE_URL=https://evermote.example.com pnpm build:web
```

The value is public configuration, not a secret. Evermote uses it to resolve
canonical links, Open Graph URLs, the sitemap, robots host, and schema.org
identifiers. Vercel builds fall back to `VERCEL_PROJECT_PRODUCTION_URL`; the
preview-specific `VERCEL_URL` is deliberately ignored. An explicit
`NEXT_PUBLIC_SITE_URL` takes precedence. A local build without either stable
deployment hostname uses `http://localhost:3000` for local verification only
and must not be promoted unchanged. An explicitly configured invalid URL fails
the build instead of silently publishing incorrect metadata; only a
credential-free `http://` or `https://` origin without a path, query, or
fragment is accepted.

`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` can hold the public Search Console token
when that verification method is used. Do not put a secret in any
`NEXT_PUBLIC_*` variable.

After deployment, inspect these URLs before submitting the sitemap:

```text
/
/about
/robots.txt
/sitemap.xml
/manifest.webmanifest
/opengraph-image
/llms.txt
```

Confirm that `/s/ANY_TEST_ID` returns both a `noindex` robots meta directive
and an `X-Robots-Tag` response header, contains no session identifier in title,
canonical, Open Graph, Twitter, or structured data, and is protected by the
same authentication and ownership controls as every session API. Search
directives and private-cache headers reduce accidental discovery; they do not
provide access control.

Do not put model credentials in browser code or any `NEXT_PUBLIC_*` variable.
The model/provider choice determines where prompts and attachments are
processed, what they cost, and which retention policy applies.

The checked-in default is not local-only or local-first. Replacing the model
does not automatically replace hosted search, Workflow storage, logs, or profile
memory; review each boundary in [Data and privacy](DATA_AND_PRIVACY.md).

## Required authentication change

The repository ships with `placeholderAuth()` after its local-development and
Vercel OIDC authenticators. This intentionally rejects ordinary production
browser requests.

Before public use, replace it with authentication appropriate to your
deployment—such as your application session, JWT/OIDC, or HTTP Basic for a
small private instance—and bind each session to the authenticated principal.
Vercel OIDC authenticates supported service calls; it is not an end-user login
system. Do not use a session URL as authorization.

Enforce ownership for every create, read, stream, message, cancel, clear, and
reset operation, including callback and reconnect paths. The checked-in channel
does not supply that per-user ACL. Read the installed eve authentication guide
before editing `agent/channels/eve.ts`.

## Option A: Vercel

Vercel is the integrated eve path: the same project can host Next.js, the eve
service, Vercel Workflow, and schedules. This repository deliberately keeps its
explicit `just-bash` sandbox selection on Vercel as well; it does not implicitly
switch to Vercel Sandbox.

```bash
pnpm exec eve link
pnpm exec eve integration setup file-memory
pnpm exec eve deploy
```

The memory setup creates or reuses a private Vercel Blob store, connects it to
the project's production, preview, and development environments, and prefers
project OIDC over a long-lived read/write token. It supplies the
`EVE_MEMORY_BLOB_*` bindings used by `fileMemory()`. Redeploy after setup so the
new environment is present in the running service.

For automated deployment, use a protected environment and reviewed source. Do
not expose `VERCEL_TOKEN` in command arguments or logs. Git integration can
build pull-request previews and production from the selected branch; the
repository CI intentionally verifies source only and does not deploy.

After deployment:

```bash
curl https://YOUR_HOST/eve/v1/health
pnpm exec eve remote connect --url https://YOUR_HOST
```

The health route is public by design. A successful health response does not
prove that browser authentication, model access, session persistence, profile
memory, or a complete turn works, so test all of them with two distinct test
principals. Exercise both approval and denial for current-thread board and
profile-memory mutations.

## Option B: self-host the combined application

`apps/web/next.config.ts` uses `eve/next`. On a Node host, build the agent first
and then the web app. Before building, configure the
`approvalGatedFileMemory()` provider in `agent/memory/profile.ts` with an
explicit `MemoryDocumentBackend` appropriate to your storage while preserving
its approval wrapper; outside Vercel and `eve dev`, the implicit file-memory
selection fails instead of using local disk.

```bash
pnpm build:agent
pnpm build:web
pnpm exec next start apps/web
```

In this topology, `next start` starts the built eve service on a loopback port
and proxies browser-facing routes. Supervise the Next.js process, terminate TLS
at a reverse proxy or load balancer, and preserve the repository layout and
installed dependencies in the runtime image.

Set `PORT` for the public Next.js service according to your host. The eve child
service uses its own loopback port; see the installed `eve/next` documentation
before overriding it.

## Option C: self-host split services

Build and supervise the agent separately:

```bash
pnpm build:agent
PORT=3001 pnpm start -- --host 127.0.0.1
```

Point the Next.js integration at that service in both build and runtime
environments, then build and start the UI:

```bash
EVE_NEXT_PRODUCTION_ORIGIN=https://agent.example.com pnpm build:web
EVE_NEXT_PRODUCTION_ORIGIN=https://agent.example.com pnpm exec next start apps/web
```

If your proxy mounts the agent below a public path, set
`EVE_PUBLIC_ROUTE_PREFIX` consistently during build and runtime. Forward the
eve routes and workflow callbacks without dropping or rewriting their internal
paths:

- `/eve/`
- `/.well-known/workflow/`

An instance can accept a message and then appear to hang when workflow callback
routing is missing.

## Persistence

Evermote has two distinct persistence domains. Configure and govern both.

### Sessions and workflow state

The default self-hosted Workflow world stores run state in
`.eve/.workflow-data`. Mount that directory on durable, access-controlled
storage if sessions must survive container replacement. Do not commit, publish,
or include it in a public build artifact.

For multi-instance or managed storage, configure a Workflow world compatible
with the version used by the installed eve release. Treat migrations, backups,
restore testing, retention, encryption, and erasure as production requirements.

### Principal-scoped profile memory

`agent/memory/profile.ts` uses `approvalGatedFileMemory()`, a thin approval
wrapper around a bounded `fileMemory()` document. Its custom scope accepts only
a production `user` principal supplied by the configured authenticator (plus
eve's synthetic `local-dev`) and then applies `byPrincipal` partitioning:

- `eve dev` selects shared, process-local memory for the synthetic `local-dev`
  principal. It is intentionally temporary and not safe for real personal
  data.
- Vercel selects private Blob only after its bindings have been configured.
- every other environment requires an explicit backend in code.

The provider partitions documents by an opaque key derived from the trusted
principal and deployment namespace. That isolation is only as sound as the
production authenticator: never derive the principal from prompt text or a
client-supplied user ID. Establish how users inspect, correct, export, expire,
and delete saved facts before enabling memory for real users.

The agent policy requires an explicit user request before proposing a profile
save or removal, and every memory mutation pauses for fresh approval. The
explicit-intent rule is model-interpreted behavioral policy; the approval gate
is the execution boundary for that exact mutation. Approval does not grant
standing permission for future writes. Test denied approvals and backend
failures, and do not equate removal from profile memory with deletion of the
conversation transcript or provider records.

## Scheduled heartbeat

The checked-in cron expression runs daily at `04:17 UTC`. On Vercel it becomes
a Vercel Cron Job; the standard self-hosted `eve start` path runs Nitro's
schedule runner. The TypeScript handler writes one fixed JSON event to stdout.
It opens no agent/model session, so it has no tools, memory, research, approval,
or inference/search cost.

The heartbeat is not user notification or end-to-end model monitoring by
itself. Route its structured log into the operator's monitoring system, or
remove `agent/schedules/heartbeat.ts` if scheduled diagnostics are unwanted.
It does not continue a user's commitment or make Evermote a background worker.

## Sandboxes and tools

The application exposes provider-managed public-web search to the root agent
and its read-only researcher; search queries and results cross the selected
provider boundary. `agent/sandbox.ts` explicitly selects
`JustBashSandbox.environment({ autoInstall: false })`, so builds do not probe for
Docker or microsandbox and do not install an optional sandbox runtime. The
checked-in agent disables default tools and defines no authored tool that opens
the sandbox, so users and the model currently have no shell or sandbox-file
capability.

`just-bash` runs inside the host Node.js process against a virtual filesystem.
It is useful as a deterministic compatibility layer, not as native process,
container, or VM isolation. Before adding `bash`, `read_file`, `write_file`,
code execution, or a tool that calls `ctx.getSandbox()`, select a hardened
sandbox appropriate to the threat model. Deny unnecessary network egress and
host mounts, constrain writable paths, and set CPU, memory, process, output,
and time limits. Treat that provider change as a security-sensitive deployment
change and test it in every supported topology.

## Observability and privacy

Logs and traces can contain prompts, model output, search queries, profile
memory operations, tool arguments, session IDs, and error details. Apply access
controls, redaction, retention, and regional requirements to every configured
observability system. Do not upload `.env`, `.eve` state, browser profiles, or
raw production traces as CI artifacts.

Give users an accurate notice before collecting real data. The open-source
project does not operate every deployment and cannot supply that deployment's
privacy policy. Use the checklist in
[Data and privacy](DATA_AND_PRIVACY.md).

At minimum, monitor:

- health and end-to-end turn success;
- authentication failures and anomalous session access;
- model latency, errors, token usage, and spend;
- profile-memory failures and isolation/deletion checks;
- workflow backlog/callback failures;
- missed heartbeat log events or schedule failures;
- process restarts and storage capacity; and
- dependency/security advisories.

## Production checklist

- [ ] CI passes on the exact commit being deployed.
- [ ] Production route authentication replaces the placeholder and rejects
      cross-user session access.
- [ ] Vercel OIDC or another service identity is not mistaken for end-user
      login.
- [ ] TLS is enforced and proxy/callback routes are correct.
- [ ] `NEXT_PUBLIC_SITE_URL` resolves to the stable production origin; canonical,
      Open Graph, robots, sitemap, manifest, and structured-data URLs were
      checked after deployment.
- [ ] Public `/about` claims match the checked-in capability contract, and
      `/s/*` returns `noindex` plus private no-store headers without exposing a
      session identifier in metadata.
- [ ] Model and identity credentials are scoped and stored as secrets.
- [ ] Workflow state is durable, backed up, and covered by a retention policy.
- [ ] Profile memory has a production backend, a verified per-user scope, and
      inspect/export/delete/retention procedures.
- [ ] Board and profile-memory approval, denial, and backend-failure paths have
      been tested without false success claims.
- [ ] The daily heartbeat is accepted, monitored, or deliberately removed.
- [ ] The explicit `just-bash` choice is still appropriate; any newly exposed
      executable or filesystem tool uses a reviewed isolation boundary.
- [ ] Rate, upload, concurrency, session, token, and spend limits are set.
- [ ] Provider processing and retention are disclosed to users.
- [ ] The deployed product makes no external-action or background-work claim
      beyond the tools and schedules actually enabled.
- [ ] Health plus a real authenticated model turn succeed after deployment.
- [ ] Rollback and credential-rotation procedures have been tested.

See the [Agent contract](AGENT_CONTRACT.md),
[Evaluation guide](EVALUATION.md), and [Threat model](THREAT_MODEL.md) for the
controls behind this checklist.
