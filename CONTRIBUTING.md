# Contributing to Evermote

Evermote welcomes focused, reviewable contributions. By participating, you
agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before opening a change

- Search existing issues and pull requests to avoid duplicate work.
- Use a feature request for behavior or architecture that changes the product
  boundary.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
- Keep the project independent: do not contribute copied product assets,
  proprietary prompts, reverse-engineered private APIs, or confusing OpenAI
  branding.
- Read the [Agent contract](docs/AGENT_CONTRACT.md) before changing behavior,
  state, tools, connections, schedules, or memory.

For a large feature, open an issue before implementation so maintainers can
align on authority, data flow, privacy, denial/failure behavior, and extension
points.

## Development setup

You need Node.js `24.x` and pnpm.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev:web
```

Use `pnpm dev` for the eve terminal UI. Keep credentials in `.env.local` or
your secret manager; `.env.example` must contain names and safe examples only.

## Project boundaries

- `agent/` defines the personal agent's model, behavior, state, memory, tools,
  schedules, and inbound channel policy.
- `apps/web/` contains the personal-agent workspace and event rendering.
- `docs/` records the capability contract, data boundaries, architecture,
  deployment assumptions, evaluation limits, and security claims.

If a change makes a decorative or roadmap feature real, adds a provider,
changes authority or data retention, introduces an external side effect, adds
background work, or broadens memory, update the README capability table,
[Agent contract](docs/AGENT_CONTRACT.md),
[Data map](docs/DATA_AND_PRIVACY.md),
[Evaluation guide](docs/EVALUATION.md), and
[Threat model](docs/THREAT_MODEL.md) in the same pull request.

Be precise about the type of guarantee:

- **deterministic mechanism** — enforced by code, schema, approval, identity, or
  storage policy;
- **behavioral policy** — interpreted by a model and supported by evals; or
- **operator configuration** — true only after a deployer supplies and tests it.

Do not promote a behavioral eval result into a deterministic security claim.

## Quality checks

Run the complete local gate before opening a pull request:

```bash
pnpm typecheck
pnpm build:agent
pnpm build:web
pnpm eval --list
```

Also test the behavior you changed. For UI work, cover keyboard navigation,
screen-reader names, reduced motion, narrow screens, empty/loading/error states,
denied approval, and readable color contrast. For agent work, test happy,
denial, failure, retry, cancellation, session resume, authentication failure,
false-success claims, and the absence of secrets where relevant. Follow
[Evaluation](docs/EVALUATION.md).

## Pull requests

Keep pull requests small enough to explain and review. Include:

- the problem and the chosen approach;
- screenshots or a short recording for visible UI changes;
- exact verification commands and results;
- whether each affected claim is deterministic, behavioral, or
  operator-configured;
- privacy, authority, retention, security, provider, cost, or hosting
  implications;
- denial, failure, revocation, and deletion behavior; and
- follow-up work that is intentionally out of scope.

Do not commit generated output (`.next/`, `.output/`, `.eve/`, `.vercel/`),
credentials, user transcripts, or local logs. Avoid unrelated lockfile churn.

AI-assisted contributions are welcome, but the submitter must understand,
test, and take responsibility for every line. Disclose substantial generated
content when it helps reviewers evaluate provenance or licensing.

## Commit style

Clear, imperative commit subjects are preferred, for example:

```text
Clarify active-turn ownership in the agent board
Document self-hosted callback routing
```

Conventional Commit prefixes are welcome but not required.

## Licensing

Unless stated otherwise, contributions submitted to this repository are
licensed under the project's [MIT License](LICENSE). You must have the right to
submit the code, text, or media you contribute.
