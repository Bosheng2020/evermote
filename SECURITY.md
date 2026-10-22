# Security policy

Thank you for helping keep Evermote and its users safe.

Evermote is an experimental personal-agent starter, not a hosted service
operated by one central project. This policy covers the checked-in source.
Deployment operators remain responsible for their identity, authorization,
storage, provider, retention, and incident-response configuration.

## Supported versions

Evermote is pre-1.0 software. Security fixes are made on the latest `main`
branch and, when the project publishes releases, the newest release. Older
commits and forks are not maintained by the Evermote project.

## Report a vulnerability privately

Do not open a public issue for a suspected vulnerability or include secrets,
private transcripts, credentials, or exploit details in an issue or pull
request.

Use this repository's **Security → Report a vulnerability** flow to create a
[private GitHub Security Advisory](https://github.com/Bosheng2020/evermote/security/advisories/new).
Include, when safe:

- the affected commit or version;
- deployment topology (local, Vercel, or self-hosted);
- impact and realistic attack preconditions;
- minimal reproduction steps or a proof of concept;
- any suggested mitigation; and
- whether the issue has been disclosed elsewhere.

If private vulnerability reporting is unavailable, contact a repository
maintainer privately through the contact method on their GitHub profile. Do not
send credentials or live user data.

Maintainers aim to acknowledge a complete report within 7 days, validate and
triage it, coordinate a fix and disclosure window, and credit the reporter if
requested. These are best-effort targets, not a service-level agreement.

## In scope

- authentication or authorization bypasses on eve session routes;
- cross-user access to sessions, transcripts, attachments, current-thread board state,
  or profile memory;
- bypass of required board or profile-memory approval, or the `byPrincipal`
  memory scope;
- secret exposure through the browser bundle, logs, errors, or build output;
- injection that reaches a privileged tool, connection, callback, or host;
- cross-site scripting or unsafe rendering in the web client;
- workflow callback forgery or session fixation;
- unexpected external effects from the diagnostic heartbeat or read-only
  researcher boundary;
- sandbox escape caused by Evermote configuration or code; and
- dependency vulnerabilities with a demonstrated Evermote impact.

## Usually out of scope

- prompt injection with no privilege boundary or external side effect;
- model output that is merely inaccurate, offensive, or unexpected;
- denial of service that requires the attacker to control the deployment;
- issues only in an unsupported fork or modified authentication policy;
- reports generated only by an automated scanner with no reproduction or
  impact analysis; and
- vulnerabilities in a model or hosting provider that do not arise from this
  repository. Report those to the affected provider.

## Operator responsibility

The checked-in `placeholderAuth()` policy deliberately rejects production
browser requests. A public deployment is not complete until the operator adds
real end-user authentication and per-session ownership checks. Vercel OIDC is
not an end-user account system, and a session ID is not authorization.

The operator must also choose appropriate model and data-processing providers,
protect secrets, configure persistence and retention, provide profile-memory
inspection/export/deletion procedures, and validate the controls in the
[Agent contract](docs/AGENT_CONTRACT.md),
[Data and privacy](docs/DATA_AND_PRIVACY.md), and
[Threat model](docs/THREAT_MODEL.md).
