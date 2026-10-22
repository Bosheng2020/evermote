# Evermote v0.1.0 — draft release notes

> **Publication status:** Draft only. This file does not mean that a Git tag or
> GitHub Release exists. Before publishing, confirm the tag, commit, build
> results, links, and release date.

**Maintainer disclosure:** Evermote is maintained by
[`Bosheng2020`](https://github.com/Bosheng2020), the owner of the repository.
It is an independent community project, not an OpenAI product, and is not
affiliated with, sponsored by, or endorsed by OpenAI.

## What v0.1.0 is

Evermote is an experimental, MIT-licensed personal-agent starter built with
[eve](https://eve.dev). It combines a browser conversation workspace with
explicitly bounded planning state, optional approval-gated profile memory, and
read-only public-web research.

This is source for developers to run and extend. It is not a hosted service or
a turnkey secure production deployment.

## Included in the source

- A responsive browser workspace with streamed model responses, file
  attachments, supported human-in-the-loop prompts, turn cancellation, and
  steering of an in-flight turn.
- Resumable session URLs. Durability across process or container replacement
  depends on the deployer's Workflow store and retention configuration.
- A session-scoped board for one current focus, commitments, and confirmed
  decisions. Every mutation requires fresh approval and the expected board
  revision, so stale updates are rejected.
- A bounded profile-memory document for a trusted user principal. Saving or
  removing a fact requires an explicit user request in agent policy and fresh
  approval. Cross-session use also requires stable identity and a production
  storage backend.
- Read-only public-web research for the root agent and a narrower research
  specialist. Search is performed by a configured hosted provider.
- A fixed daily operator heartbeat that writes a diagnostic event to logs. It
  does not run the model, continue user work, or send a notification.
- Capability, architecture, deployment, data, threat-model, evaluation, and
  security documentation, plus regression evals for important authority
  boundaries.
- Search-discovery surfaces for public project pages, including canonical
  metadata, a sitemap, `robots.txt`, structured data, a generated social
  preview, and an experimental `/llms.txt` documentation map.

## Important boundaries

- There are no checked-in email, calendar, messaging, purchase, device,
  operating-system, arbitrary-fetch, shell, or file-write actions.
- The current-thread board is not a cross-session task manager or scheduler,
  and a recorded commitment is not proof that work happened.
- Evermote does not perform user-facing background work, reminders, or
  briefings.
- Profile memory is partial. There is not yet a complete user interface for
  inspection, correction, export, expiration, or account-wide deletion.
- The production authentication placeholder fails closed. A deployer must add
  trusted end-user authentication and enforce per-user, per-tenant ownership
  for every session operation before accepting browser traffic.
- Vercel OIDC authenticates supported service calls; it is not an end-user
  login system. A session ID is an address, not authorization.
- The default model path uses an OpenAI model through Vercel AI Gateway.
  Provider choice is configurable in code, but the default is not local-only
  or local-first processing.
- Model calls, hosted search, storage, and runtime infrastructure may incur
  charges under the terms of the providers selected by a deployer.
- Builds and behavioral evals are regression signals, not proof of security,
  privacy, consent, persistence, authorization, or model correctness.

## Run locally

Requirements: Node.js `24.x`, the pnpm version pinned in `package.json`, and a
model connection supported by eve or an `AI_GATEWAY_API_KEY`.

```bash
git clone https://github.com/Bosheng2020/evermote.git
cd evermote
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev:web
```

Open the local URL printed by Next.js. On first use, eve may ask for a
supported model-account connection. Never commit `.env.local`.

Local development uses a shared, process-local profile-memory scope that
disappears with the process. Do not use local development with real multi-user,
personal, or secret data.

## Verify the source

```bash
pnpm typecheck
pnpm build:agent
pnpm build:web
pnpm eval --list
```

## Documentation

- [README and capability table](https://github.com/Bosheng2020/evermote#readme)
- [Agent contract](https://github.com/Bosheng2020/evermote/blob/main/docs/AGENT_CONTRACT.md)
- [Data and privacy](https://github.com/Bosheng2020/evermote/blob/main/docs/DATA_AND_PRIVACY.md)
- [Deployment guide](https://github.com/Bosheng2020/evermote/blob/main/docs/DEPLOYMENT.md)
- [Threat model](https://github.com/Bosheng2020/evermote/blob/main/docs/THREAT_MODEL.md)
- [Security policy](https://github.com/Bosheng2020/evermote/blob/main/SECURITY.md)
- [Contributing guide](https://github.com/Bosheng2020/evermote/blob/main/CONTRIBUTING.md)

## Feedback and contributions

Try the documented local setup and report reproducible friction through
[GitHub Issues](https://github.com/Bosheng2020/evermote/issues). For suspected
vulnerabilities, use the repository's private
[security-advisory flow](https://github.com/Bosheng2020/evermote/security/advisories/new)
instead of a public issue.

## Maintainer publication checklist

- [ ] Replace this draft heading with the release date.
- [ ] Confirm `v0.1.0` points to the intended reviewed commit.
- [ ] Run all four verification commands from a clean checkout and record the
      exact results.
- [ ] Re-run the documented local first-use flow with a fresh environment.
- [ ] Confirm every capability and limitation still matches `README.md` and
      `docs/AGENT_CONTRACT.md`.
- [ ] Confirm no credential, transcript, local state, or generated build output
      is included in the tag.
- [ ] Confirm repository links and the private security-report link work.
- [ ] Publish only after the maintainer has personally reviewed and accepted
      responsibility for this text.

