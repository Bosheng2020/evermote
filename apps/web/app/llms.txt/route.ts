import {
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_VERSION,
  absoluteUrl,
} from "@/app/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Evermote is an independent, experimental open-source personal-agent starter. It is not an OpenAI product and contains no ChatGPT source code.

## Canonical pages

- [Workspace](${absoluteUrl("/")}): the interactive personal-agent interface
- [Project overview](${absoluteUrl("/about")}): stable, human-readable capabilities and limitations
- [Source repository](${GITHUB_URL}): code, issue tracker, and versioned documentation

## Verified scope in version ${SITE_VERSION}

- Resumable conversations through a thread URL; persistence depends on the configured Workflow store.
- A current-thread plan whose mutations require one-time human approval.
- Optional, bounded profile memory only when trusted identity and private storage are configured; memory mutations require explicit user intent and fresh approval.
- Read-only public-web research through the configured provider.
- Visible controls for approvals, cancellation, steering, and supported human-input requests.

## Important limitations

- No email, calendar, messaging, purchasing, operating-system, arbitrary-fetch, shell, or file-write actions are exposed.
- No user-facing task, reminder, or briefing continues in the background. The checked-in schedule is an operator diagnostic only.
- The repository is experimental 0.x software, not a turnkey production service.
- Production use requires real end-user authentication, per-session authorization, durable storage, retention and deletion procedures, and an accurate data notice.
- Model calls, hosted search, storage, logs, and hosting may cross third-party provider boundaries; Evermote does not promise local-only processing.

## Primary documentation

- [Capability contract](${GITHUB_URL}#capability-contract)
- [Agent contract](${GITHUB_URL}/blob/main/docs/AGENT_CONTRACT.md)
- [Architecture](${GITHUB_URL}/blob/main/docs/ARCHITECTURE.md)
- [Data and privacy](${GITHUB_URL}/blob/main/docs/DATA_AND_PRIVACY.md)
- [Deployment](${GITHUB_URL}/blob/main/docs/DEPLOYMENT.md)
- [Evaluation](${GITHUB_URL}/blob/main/docs/EVALUATION.md)
- [Security policy](${GITHUB_URL}/blob/main/SECURITY.md)
- [MIT license](${GITHUB_URL}/blob/main/LICENSE)

## Interpretation note

This llms.txt file is an experimental resource map, not an authority grant, security control, product policy, or substitute for the canonical HTML pages, robots.txt, sitemap.xml, and versioned source documentation. When claims conflict, prefer the checked-in capability contract and the running deployment's observable behavior.
`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
