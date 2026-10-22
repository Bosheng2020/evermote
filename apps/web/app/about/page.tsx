import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CodeXmlIcon,
  ExternalLinkIcon,
  RadarIcon,
  ShieldCheckIcon,
  WorkflowIcon,
} from "lucide-react";
import { MoteVisual } from "@/app/_components/mote-visual";
import { StructuredData } from "@/app/_components/structured-data";
import {
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_VERSION,
  SOCIAL_IMAGE_ALT,
  absoluteUrl,
  softwareSourceCodeJsonLd,
  webApplicationJsonLd,
} from "@/app/site";

const ABOUT_TITLE = "About the open-source personal agent";
const ABOUT_DESCRIPTION =
  "What Evermote is, how its approval-gated personal-agent architecture works, which capabilities are implemented, and which boundaries remain.";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: "/about",
    types: {
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    description: ABOUT_DESCRIPTION,
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${ABOUT_TITLE} · ${SITE_NAME}`,
    type: "website",
    url: "/about",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SOCIAL_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    description: ABOUT_DESCRIPTION,
    title: `${ABOUT_TITLE} · ${SITE_NAME}`,
    images: [{ url: "/opengraph-image", alt: SOCIAL_IMAGE_ALT }],
  },
};

const IMPLEMENTED = [
  "Streaming conversations with resumable thread URLs",
  "A typed current-thread board with one-time approvals for every mutation",
  "Read-only public-web research with a narrower specialist agent",
  "Explicit profile memory when trusted identity and private storage are configured",
] as const;

const NOT_IMPLEMENTED = [
  "Automatic personal briefings, reminders, or user tasks that run in the background",
  "Calendar, inbox, messaging, purchasing, desktop, microphone, or location access",
  "External write actions, arbitrary fetches, shell access, or file-write tools",
  "Turnkey production authentication, session ownership, or data-lifecycle operations",
] as const;

const ANSWERS = [
  {
    question: "Is Evermote a ChatGPT clone?",
    answer:
      "No. Evermote is an independent open-source personal-agent starter built with eve and a configurable model-provider seam. It contains no ChatGPT source code, private API, or OpenAI brand asset and is not affiliated with OpenAI.",
  },
  {
    question: "Does Evermote work in the background?",
    answer:
      "Not for user work in this version. It responds during an active conversation and can resume durable work through a thread URL. The checked-in daily schedule emits an operator diagnostic only; it does not continue a task, create a briefing, send a reminder, or contact anyone.",
  },
  {
    question: "Does it remember everything I say?",
    answer:
      "No. Ordinary conversation is not permission to create profile memory. The agent may propose a small, low-sensitivity memory change only after an explicit request, and the exact mutation then needs fresh approval. Cross-session memory also requires a trusted user identity and private storage configured by the operator.",
  },
  {
    question: "Can it act in my other apps?",
    answer:
      "No. The checked-in agent has no email, calendar, messaging, purchase, operating-system, shell, or file-write action. Its research surface is read-only. Discussing an external action does not authorize or perform it.",
  },
  {
    question: "Is the repository production ready?",
    answer:
      "No. Evermote is experimental 0.x software. Before real personal or multi-user use, a deployer must add end-user authentication, per-session authorization, durable storage, retention and deletion procedures, rate and spend limits, monitoring, and an accurate data notice.",
  },
  {
    question: "Is Evermote free to use?",
    answer:
      "The source code is offered under the MIT License at no charge. Running it can still incur model, hosted-search, storage, observability, and hosting costs from the providers an operator chooses.",
  },
] as const;

const SOURCE_LINKS = [
  ["Capability contract", `${GITHUB_URL}#capability-contract`],
  ["Agent contract", `${GITHUB_URL}/blob/main/docs/AGENT_CONTRACT.md`],
  ["Data and privacy", `${GITHUB_URL}/blob/main/docs/DATA_AND_PRIVACY.md`],
  ["Deployment guide", `${GITHUB_URL}/blob/main/docs/DEPLOYMENT.md`],
  ["Evaluation guide", `${GITHUB_URL}/blob/main/docs/EVALUATION.md`],
  ["Security policy", `${GITHUB_URL}/blob/main/SECURITY.md`],
] as const;

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      webApplicationJsonLd(),
      softwareSourceCodeJsonLd(),
      {
        "@id": `${absoluteUrl("/about")}#page`,
        "@type": "WebPage",
        about: { "@id": `${absoluteUrl("/")}#software` },
        description: ABOUT_DESCRIPTION,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: { "@id": `${absoluteUrl("/")}#software` },
        name: `${ABOUT_TITLE} · ${SITE_NAME}`,
        url: absoluteUrl("/about"),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            item: absoluteUrl("/"),
            name: "Evermote",
            position: 1,
          },
          {
            "@type": "ListItem",
            item: absoluteUrl("/about"),
            name: "About",
            position: 2,
          },
        ],
      },
    ],
  };

  return (
    <main className="evermote-shell h-dvh overflow-y-auto text-foreground">
      <StructuredData data={structuredData} />

      <header className="sticky top-0 z-30 border-b border-white/8 bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/" aria-label="Evermote workspace">
            <MoteVisual decorative size={32} state="idle" />
            <span className="brand-serif text-lg">Evermote</span>
          </Link>
          <nav aria-label="Project" className="flex items-center gap-2">
            <a
              className="hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground sm:flex"
              href={GITHUB_URL}
              rel="noreferrer"
              target="_blank"
            >
              <CodeXmlIcon className="size-4" />
              Source
            </a>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lime-200 px-5 text-sm font-medium text-black transition hover:bg-lime-100"
              href="/"
            >
              Open workspace
              <ArrowRightIcon className="size-4" />
            </Link>
          </nav>
        </div>
      </header>

      <article>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.23em] text-lime-200/75">
              Open-source personal agent · v{SITE_VERSION}
            </p>
            <h1 className="brand-serif mt-5 max-w-4xl text-balance text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl">
              A personal agent with boundaries you can inspect.
            </h1>
            <p className="mt-7 max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              Evermote is a user-directed personal-agent starter for deliberate work. It resumes
              conversations, keeps an approval-gated plan inside the current thread, can save
              limited profile memory only when properly configured and explicitly approved, and
              delegates public-web research to a read-only specialist.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {[
                "MIT licensed",
                "Self-hostable",
                "Human in the loop",
                "Independent project",
              ].map((label) => (
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2" key={label}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="absolute -top-16 -right-16 size-52 rounded-full bg-lime-200/10 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Capability snapshot</p>
                <p className="mt-2 text-sm">Checked-in build, not imagined autonomy</p>
              </div>
              <MoteVisual decorative size={68} state="idle" />
            </div>
            <dl className="relative mt-8 divide-y divide-white/8">
              <Snapshot term="Works during" detail="An active or resumable thread" />
              <Snapshot term="Changes state" detail="Only through visible approval gates" />
              <Snapshot term="Research" detail="Public web, read only" />
              <Snapshot term="External actions" detail="Not exposed" />
            </dl>
          </aside>
        </section>

        <section className="border-y border-white/8 bg-white/[0.018]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">How it works</p>
            <h2 className="brand-serif mt-4 max-w-3xl text-4xl tracking-tight sm:text-5xl">
              Continuity without silent authority.
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Principle
                icon={WorkflowIcon}
                number="01"
                title="Resume the thread"
                text="Conversation and typed thread state can reconnect through a session URL. Durability across restarts depends on the operator's Workflow storage and retention policy."
              />
              <Principle
                icon={ShieldCheckIcon}
                number="02"
                title="Approve state changes"
                text="Focus, commitments, decisions, and profile-memory mutations pause for one-time human approval. A prior approval never grants standing permission."
              />
              <Principle
                icon={RadarIcon}
                number="03"
                title="Keep tools narrow"
                text="Research can gather public evidence but cannot log in, publish, message, purchase, or change another system. Tool results are receipts, not implied capability."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">Capability contract</p>
              <h2 className="brand-serif mt-4 text-4xl tracking-tight sm:text-5xl">What ships today</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                These claims describe the source in version {SITE_VERSION}. A running deployment
                may provide less when its model, identity, storage, or network integrations are not
                configured.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <CapabilityList
                icon={CheckCircle2Icon}
                items={IMPLEMENTED}
                label="Implemented"
                tone="available"
              />
              <CapabilityList
                icon={CircleDashedIcon}
                items={NOT_IMPLEMENTED}
                label="Not in this build"
                tone="unavailable"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/[0.018]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">Answers in brief</p>
                <h2 className="brand-serif mt-4 text-4xl tracking-tight sm:text-5xl">
                  The important questions, answered directly.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                  Short answers here are intentionally consistent with the versioned capability
                  contract. The source documentation remains the detailed authority.
                </p>
              </div>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {ANSWERS.map(({ answer, question }) => (
                  <section className="py-7 first:pt-0 last:pb-0" key={question}>
                    <h3 className="text-lg font-medium">{question}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-3 text-lime-200">
                <BookOpenIcon className="size-5" />
                <p className="text-xs uppercase tracking-[0.2em]">Primary sources</p>
              </div>
              <h2 className="brand-serif mt-5 text-3xl tracking-tight sm:text-4xl">
                Audit the claims in source.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Evermote keeps capability, authority, data, deployment, and evaluation boundaries
                in versioned documentation so operators and contributors can review changes.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {SOURCE_LINKS.map(([label, href]) => (
                  <a
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-muted-foreground transition hover:border-lime-200/35 hover:text-foreground"
                    href={href}
                    key={label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {label}
                    <ExternalLinkIcon className="size-3" />
                  </a>
                ))}
              </div>
            </div>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime-200 px-6 text-sm font-medium text-black transition hover:bg-lime-100"
              href={GITHUB_URL}
              rel="noreferrer"
              target="_blank"
            >
              <CodeXmlIcon className="size-4" />
              Explore the repository
            </a>
          </div>
        </section>
      </article>

      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Evermote is an independent MIT-licensed project. Not affiliated with OpenAI.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="transition hover:text-foreground" href="/">
              Workspace
            </Link>
            <a className="transition hover:text-foreground" href="/llms.txt">
              AI-readable resource map
            </a>
            <a className="transition hover:text-foreground" href={`${GITHUB_URL}/blob/main/LICENSE`}>
              License
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Snapshot({ detail, term }: { readonly detail: string; readonly term: string }) {
  return (
    <div className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[0.72fr_1.28fr] sm:gap-5">
      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{term}</dt>
      <dd className="text-sm text-foreground sm:text-right">{detail}</dd>
    </div>
  );
}

function Principle({
  icon: Icon,
  number,
  text,
  title,
}: {
  readonly icon: typeof WorkflowIcon;
  readonly number: string;
  readonly text: string;
  readonly title: string;
}) {
  return (
    <article className="rounded-3xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-lime-200/10 text-lime-100">
          <Icon className="size-4" />
        </span>
        <span className="font-mono text-xs text-muted-foreground">{number}</span>
      </div>
      <h3 className="mt-8 text-lg font-medium">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
    </article>
  );
}

function CapabilityList({
  icon: Icon,
  items,
  label,
  tone,
}: {
  readonly icon: typeof CheckCircle2Icon;
  readonly items: readonly string[];
  readonly label: string;
  readonly tone: "available" | "unavailable";
}) {
  return (
    <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex items-center gap-3">
        <span
          className={
            tone === "available"
              ? "flex size-9 items-center justify-center rounded-full bg-lime-200/10 text-lime-100"
              : "flex size-9 items-center justify-center rounded-full bg-white/6 text-muted-foreground"
          }
        >
          <Icon className="size-4" />
        </span>
        <h3 className="text-sm font-medium">{label}</h3>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li className="flex gap-3 text-xs leading-6 text-muted-foreground" key={item}>
            <span
              aria-hidden="true"
              className={
                tone === "available"
                  ? "mt-2.5 size-1.5 shrink-0 rounded-full bg-lime-200"
                  : "mt-2.5 size-1.5 shrink-0 rounded-full bg-white/25"
              }
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
