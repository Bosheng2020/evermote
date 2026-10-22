"use client";

import type { UserContent } from "ai";
import { type ConversationState, useEveAgent } from "eve/react";
import dynamic from "next/dynamic";
import {
  ActivityIcon,
  AlertCircleIcon,
  BookOpenIcon,
  BrainIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  ClipboardCheckIcon,
  HomeIcon,
  MemoryStickIcon,
  MessageCircleIcon,
  PlusIcon,
  RadarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SquareIcon,
  WorkflowIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationTopFade,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoteVisual, type MoteVisualState } from "./mote-visual";
import { WEB_CHAT_AGENT } from "@/app/eve-agent";

const AgentMessage = dynamic(() =>
  import("./agent-message").then((module) => module.AgentMessage),
);

type WorkspaceView = "today" | "review" | "memory" | "boundaries";

const NAV_ITEMS = [
  { icon: HomeIcon, id: "today", label: "Today" },
  { icon: ActivityIcon, id: "review", label: "Review" },
  { icon: MemoryStickIcon, id: "memory", label: "Memory" },
  { icon: ShieldCheckIcon, id: "boundaries", label: "Boundaries" },
] as const satisfies readonly {
  readonly icon: typeof HomeIcon;
  readonly id: WorkspaceView;
  readonly label: string;
}[];

const PERSONAL_AGENT_ACTIONS = [
  {
    eyebrow: "Today",
    label: "Make sense of today",
    prompt:
      "Give me an on-demand briefing for today using only this current conversation and any explicitly saved memory available to you. Clearly separate what you know from what you infer, say what you cannot see, and end with one useful next step.",
    summary: "An on-demand brief from context you have",
  },
  {
    eyebrow: "Review",
    label: "Review this thread",
    prompt:
      "Review this current thread and its session board. Summarize what changed, what remains open, which decisions are confirmed, and what needs my attention. Do not imply you can see work outside this thread.",
    summary: "Progress, decisions, and open questions",
  },
  {
    eyebrow: "Plan",
    label: "Plan the next move",
    prompt:
      "Help me build a plan for this current thread. First ask what outcome matters, then propose clear owners and next actions. Before changing the session board, show me the proposed change and use the required one-time approval.",
    summary: "A current-thread plan with clear ownership",
  },
  {
    eyebrow: "Working agreement",
    label: "Decide how we work",
    prompt:
      "Help me define a user-directed working agreement for this thread: your role, tone, how much you should challenge me, when to ask versus infer, approval boundaries, and memory boundaries. Ask one focused question at a time. Do not save anything as long-term memory unless I explicitly ask you to remember the final wording.",
    summary: "Role, tone, initiative, and boundaries",
  },
] as const;

const TODAY_PROMPT = PERSONAL_AGENT_ACTIONS[0].prompt;
const REVIEW_PROMPT = PERSONAL_AGENT_ACTIONS[1].prompt;
const PLAN_PROMPT = PERSONAL_AGENT_ACTIONS[2].prompt;
const WORKING_AGREEMENT_PROMPT = PERSONAL_AGENT_ACTIONS[3].prompt;

export function AgentChat({
  sessionId,
}: {
  readonly sessionId?: string;
}) {
  const [cancellationError, setCancellationError] = useState<string>();
  const [hasInputText, setHasInputText] = useState(false);
  const [activeView, setActiveView] = useState<WorkspaceView>("today");
  const hasSubmittedMessage = useRef(false);
  const replaceSessionRoute = (nextSessionId: string) => {
    if (sessionId !== undefined) return;
    // Framework routers (Next.js, TanStack Router) patch window.history; navigating
    // through them would remount this route and detach the active stream.
    History.prototype.replaceState.call(
      window.history,
      window.history.state,
      "",
      `/s/${encodeURIComponent(nextSessionId)}`,
    );
  };
  const agent = useEveAgent({
    agent: WEB_CHAT_AGENT,
    prewarm: hasInputText,
    initialSession:
      sessionId === undefined
        ? undefined
        : {
            sessionId,
            streamIndex: 0,
          },
    resume: sessionId !== undefined,
    onSessionChange(session) {
      if (hasSubmittedMessage.current && session !== undefined) {
        replaceSessionRoute(session.sessionId);
      }
    },
  });

  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const isResuming = agent.status === "resuming";
  const isEmpty = agent.data.messages.length === 0;
  const lastMessage = agent.data.messages.at(-1);
  const isPendingAssistantShell =
    lastMessage?.role === "assistant" &&
    lastMessage.parts.every((part) => part.type === "step-start");
  const showPendingThinking =
    isBusy &&
    (agent.status === "submitted" || lastMessage?.role !== "assistant" || isPendingAssistantShell);
  const turnFailure = isBusy || isResuming ? undefined : getLatestTurnFailure(agent.events);
  const errorMessage = cancellationError ?? agent.error?.message ?? turnFailure;
  const hasConversationContent = !isEmpty || errorMessage !== undefined;
  const showConversationLayout = isResuming || hasConversationContent;
  const activeSessionId = sessionId ?? agent.session?.sessionId;
  const openInputs = Object.values(agent.data.inputs).filter((input) => input.status === "open");
  const agentStatus = statusLabel(agent.status, openInputs.length);
  const taskCalls = Object.values(agent.data.tasks).flatMap((task) =>
    Object.values(task.calls).map((call) => ({ ...call, kind: task.kind, name: task.name })),
  );
  const workingTasks = taskCalls.filter((call) => call.status === "working");
  const moteState: MoteVisualState = errorMessage
    ? "error"
    : openInputs.length > 0
      ? "attention"
      : agent.status === "streaming"
        ? "working"
        : agent.status === "submitted" || agent.status === "resuming"
          ? "thinking"
          : "idle";
  // Answers are accepted while work runs; the server's settlement closes each request.
  const canRespond = (requestId: string) =>
    !isResuming && agent.data.inputs[requestId]?.status === "open";
  // A tool call can ask several questions at once, and its message part holds only the latest.
  const questionsFor = (callId: string) =>
    Object.values(agent.data.inputs).filter(
      (input) => input.request.kind === "question" && input.request.action.callId === callId,
    );

  const requestCancellation = () => {
    setCancellationError(undefined);
    void agent.cancel().catch((error: unknown) => {
      setCancellationError(toErrorMessage(error));
    });
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if ((text.length === 0 && message.files.length === 0) || isResuming) return;

    setHasInputText(false);
    setCancellationError(undefined);
    hasSubmittedMessage.current = true;
    if (agent.session !== undefined) replaceSessionRoute(agent.session.sessionId);
    const options = isBusy ? { turnPolicy: "steer" as const } : undefined;

    if (message.files.length === 0) {
      await agent.send(text, options);
      return;
    }

    const parts: UserContent = [];
    if (text.length > 0) {
      parts.push({ text, type: "text" });
    }
    for (const file of message.files) {
      parts.push({
        data: file.url,
        filename: file.filename,
        mediaType: file.mediaType,
        type: "file",
      });
    }

    await agent.send(parts, options);
  };

  const sendStarter = (prompt: string) => {
    setActiveView("today");
    setCancellationError(undefined);
    hasSubmittedMessage.current = true;
    const options = isBusy ? { turnPolicy: "steer" as const } : undefined;
    void agent.send(prompt, options);
  };

  const composer = (
    <PromptInput className="evermote-composer" globalDrop onSubmit={handleSubmit}>
      <PromptInputTextarea
        disabled={isResuming}
        onChange={(event) => setHasInputText(event.currentTarget.value.trim().length > 0)}
        placeholder={isBusy ? "Add context or redirect Evermote…" : "What would help right now?"}
      />
      <ComposerAction
        hasInputText={hasInputText}
        isBusy={isBusy}
        isResuming={isResuming}
        onCancel={requestCancellation}
      />
    </PromptInput>
  );

  return (
    <div className="evermote-shell grid h-dvh grid-cols-1 overflow-hidden text-foreground lg:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_292px]">
      <a
        className="sr-only z-50 rounded-md bg-background px-4 py-3 text-sm focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
        href="#main-content"
      >
        Skip to workspace
      </a>
      <p aria-live="polite" className="sr-only" role="status">{agentStatus}</p>
      <WorkspaceSidebar
        activeView={activeView}
        agentStatus={agentStatus}
        moteState={moteState}
        onNewChat={() => window.location.assign("/")}
        onPrompt={sendStarter}
        onViewChange={setActiveView}
        showNewChat={activeSessionId !== undefined}
      />

      <main
        className="relative flex min-h-0 min-w-0 flex-col border-x border-white/7 bg-background/65 backdrop-blur-2xl"
        id="main-content"
      >
        <WorkspaceHeader
          activeView={activeView}
          moteState={moteState}
          onViewChange={setActiveView}
          status={agentStatus}
        />

        {activeView === "today" ? (
          <>
            {showConversationLayout ? (
              <Conversation
                className="min-h-0 flex-1"
                initial={sessionId === undefined ? undefined : false}
                resize={activeSessionId === undefined ? "smooth" : "instant"}
                scrollRestorationKey={
                  isEmpty || activeSessionId === undefined
                    ? undefined
                    : `eve:web-chat-scroll:${activeSessionId}`
                }
              >
                <ConversationTopFade className="top-16" />
                <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-5 pt-10 pb-40 sm:px-8">
                  {agent.data.messages.map((message, index) =>
                    showPendingThinking &&
                    isPendingAssistantShell &&
                    message.id === lastMessage.id ? null : (
                      <AgentMessage
                        canRespond={canRespond}
                        isStreaming={
                          agent.status === "streaming" && index === agent.data.messages.length - 1
                        }
                        key={message.id}
                        message={message}
                        questionsFor={questionsFor}
                        onInputResponses={(inputResponses) => {
                          setCancellationError(undefined);
                          return agent.respond(inputResponses);
                        }}
                      />
                    ),
                  )}
                  {showPendingThinking ? <PendingThinking /> : null}
                  {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
            ) : (
              <TodayWorkspace
                disabled={isResuming}
                moteState={moteState}
                onStarter={sendStarter}
              />
            )}

            <div className="evermote-composer-dock pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background/96 to-transparent px-4 pt-10 sm:px-7">
              <div className="pointer-events-auto mx-auto w-full max-w-3xl">
                {composer}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground">
                  <span>Files stay in this thread, not profile memory.</span>
                  <span>{isBusy ? "You can redirect the work anytime." : "Plan changes ask for one-time approval."}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeView === "review" ? (
          <ReviewView events={agent.events} onAsk={sendStarter} tasks={agent.data.tasks} />
        ) : null}

        {activeView === "memory" ? <MemoryView onAsk={sendStarter} /> : null}

        {activeView === "boundaries" ? <BoundariesView /> : null}
      </main>

      <ActivityRail
        eventCount={agent.events.length}
        moteState={moteState}
        onAsk={sendStarter}
        openInputCount={openInputs.length}
        status={agentStatus}
        workingTaskCount={workingTasks.length}
      />
    </div>
  );
}

function WorkspaceSidebar({
  activeView,
  agentStatus,
  moteState,
  onNewChat,
  onPrompt,
  onViewChange,
  showNewChat,
}: {
  readonly activeView: WorkspaceView;
  readonly agentStatus: string;
  readonly moteState: MoteVisualState;
  readonly onNewChat: () => void;
  readonly onPrompt: (prompt: string) => void;
  readonly onViewChange: (view: WorkspaceView) => void;
  readonly showNewChat: boolean;
}) {
  return (
    <aside className="hidden min-h-0 flex-col px-4 py-5 lg:flex">
      <div className="flex items-center gap-3 px-2">
        <MoteVisual ariaLabel={`Evermote status: ${agentStatus}`} size={34} state={moteState} />
        <div>
          <p className="brand-serif text-lg leading-none">Evermote</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Personal agent
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, id, label }) => (
          <button
            aria-current={activeView === id ? "page" : undefined}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70",
              activeView === id
                ? "bg-white/8 text-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
            key={id}
            onClick={() => onViewChange(id)}
            type="button"
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 px-2">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Current thread</p>
        <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5">
          <div className="flex items-start gap-2.5">
            <RadarIcon className="mt-0.5 size-4 text-lime-200" />
            <div>
              <p className="text-sm leading-snug">Your plan stays here</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Approved focus, commitments, and decisions belong to this thread, not every conversation.
              </p>
              <button
                className="mt-3 rounded-full border border-white/10 px-3 py-1.5 text-xs text-foreground transition hover:border-lime-200/35 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70"
                onClick={() => onPrompt(REVIEW_PROMPT)}
                type="button"
              >
                Review thread plan
              </button>
            </div>
          </div>
        </div>
        <button
          className="mt-2 w-full rounded-xl px-3 py-2 text-left text-xs text-muted-foreground transition hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70"
          onClick={() => onPrompt(WORKING_AGREEMENT_PROMPT)}
          type="button"
        >
          Set a working agreement
        </button>
      </div>

      <div className="mt-auto space-y-3 px-2">
        <div aria-hidden="true" className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-300 opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-lime-300" />
          </span>
          {agentStatus}
        </div>
        {showNewChat ? (
          <Button className="min-h-11 w-full justify-start" onClick={onNewChat} size="sm" variant="outline">
            <PlusIcon className="size-4" />
            Start a new thread
          </Button>
        ) : null}
        <nav aria-label="Project resources" className="flex items-center gap-4 text-xs text-muted-foreground">
          <a className="transition hover:text-foreground" href="/about">About</a>
          <a
            className="transition hover:text-foreground"
            href="https://github.com/Bosheng2020/evermote"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Independent open-source project. Not affiliated with OpenAI.
        </p>
      </div>
    </aside>
  );
}

function WorkspaceHeader({
  activeView,
  moteState,
  onViewChange,
  status,
}: {
  readonly activeView: WorkspaceView;
  readonly moteState: MoteVisualState;
  readonly onViewChange: (view: WorkspaceView) => void;
  readonly status: string;
}) {
  const label = NAV_ITEMS.find((item) => item.id === activeView)?.label ?? "Today";

  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/7 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <MoteVisual ariaLabel={`Evermote status: ${status}`} size={30} state={moteState} />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p aria-hidden="true" className="text-xs text-muted-foreground">{status}</p>
        </div>
      </div>
      <nav aria-label="Workspace" className="flex items-center gap-0.5 lg:hidden">
        {NAV_ITEMS.map(({ icon: Icon, id, label: navLabel }) => (
          <button
            aria-current={activeView === id ? "page" : undefined}
            aria-label={navLabel}
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70",
              activeView === id && "bg-white/8 text-foreground",
            )}
            key={id}
            onClick={() => onViewChange(id)}
            type="button"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </nav>
      <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground sm:flex">
        <ShieldCheckIcon className="size-3.5 text-lime-200" />
        User directed
      </div>
    </header>
  );
}

function TodayWorkspace({
  disabled,
  moteState,
  onStarter,
}: {
  readonly disabled: boolean;
  readonly moteState: MoteVisualState;
  readonly onStarter: (prompt: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-5 pt-6 pb-48 sm:px-8 sm:pt-10">
      <div className="w-full max-w-3xl text-center">
        <div className="relative mx-auto flex size-40 items-center justify-center sm:size-64">
          <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(197,242,124,0.13),transparent_67%)] blur-2xl" />
          <MoteVisual
            className="relative h-36 w-36 sm:h-[190px] sm:w-[190px]"
            decorative
            size={190}
            state={moteState}
          />
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-lime-200/70">Personal agent · on demand</p>
        <h1 className="brand-serif mx-auto mt-4 max-w-2xl text-balance text-4xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          What would make today lighter?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
          Evermote helps when you ask, keeps this thread resumable, and pauses before changing its
          plan. It does not monitor your day or run a personal briefing in the background.
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
          {PERSONAL_AGENT_ACTIONS.map((starter) => (
            <button
              className="group min-h-32 rounded-2xl border border-white/8 bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-lime-200/30 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70 disabled:opacity-50"
              disabled={disabled}
              key={starter.label}
              onClick={() => onStarter(starter.prompt)}
              type="button"
            >
              <span className="mb-4 block text-xs uppercase tracking-[0.16em] text-lime-200/80">
                {starter.eyebrow}
              </span>
              <span className="block text-sm leading-snug">{starter.label}</span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                {starter.summary}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewView({
  events,
  onAsk,
  tasks,
}: {
  readonly events: ReturnType<typeof useEveAgent>["events"];
  readonly onAsk: (prompt: string) => void;
  readonly tasks: ConversationState["tasks"];
}) {
  const calls = Object.values(tasks).flatMap((task) =>
    Object.values(task.calls).map((call) => ({ ...call, kind: task.kind, name: task.name })),
  );
  const recentEvents = events.slice(-10).toReversed();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">On-demand reflection</p>
        <h1 className="brand-serif mt-3 text-4xl tracking-tight sm:text-5xl">Review this thread</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Evermote can review the conversation and its approved plan when you ask. It cannot see
          your calendar, inbox, or other threads unless you bring that context here.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <ReviewAction
            icon={CalendarCheckIcon}
            label="Run a today check-in"
            onClick={() => onAsk(TODAY_PROMPT)}
            text="Build a brief now from the context available here."
          />
          <ReviewAction
            icon={ClipboardCheckIcon}
            label="Review the current-thread plan"
            onClick={() => onAsk(REVIEW_PROMPT)}
            text="Surface confirmed decisions, open work, and your next choice."
          />
        </div>

        <div className="mt-10 border-t border-white/8 pt-8">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Session evidence</p>
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Specialist work</h2>
              <span className="rounded-full bg-white/6 px-2 py-1 text-[10px] text-muted-foreground">
                {calls.length} total
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {calls.length === 0 ? (
                <EmptyLedger icon={WorkflowIcon} text="Research delegated in this thread will appear here." />
              ) : (
                calls.toReversed().map((call) => (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/6 p-3" key={call.callId}>
                    <span className={cn("size-2 rounded-full", taskStatusColor(call.status))} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{humanize(call.name)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {call.kind} · {humanize(call.status)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Recent session activity</h2>
              <span className="rounded-full bg-white/6 px-2 py-1 text-[10px] text-muted-foreground">
                live
              </span>
            </div>
            <div className="mt-5 space-y-0">
              {recentEvents.length === 0 ? (
                <EmptyLedger icon={ActivityIcon} text="Activity will appear after the first message." />
              ) : (
                recentEvents.map((event, index) => (
                  <div className="grid grid-cols-[16px_1fr] gap-3" key={`${event.type}-${events.length - index}`}>
                    <div className="flex flex-col items-center">
                      <span className="mt-1.5 size-2 rounded-full bg-lime-200/70" />
                      {index < recentEvents.length - 1 ? <span className="h-full w-px bg-white/8" /> : null}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm">{eventTitle(event.type)}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{event.type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MemoryView({ onAsk }: { readonly onAsk: (prompt: string) => void }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">You decide what carries forward</p>
        <h1 className="brand-serif mt-3 text-4xl tracking-tight sm:text-5xl">Memory only when you ask</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Ordinary conversation is not permission to remember. Evermote may save a small,
          low-sensitivity note only after you explicitly ask, and current instructions always win.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <PolicyCard icon={BookOpenIcon} title="Exact request" text="A memory change starts only after you clearly say to remember or forget something." />
          <PolicyCard icon={CheckCircle2Icon} title="Review the wording" text="Ask Evermote to restate the exact note first. Nothing is saved until you explicitly confirm the request." />
          <PolicyCard icon={ShieldCheckIcon} title="Sensitive-data ban" text="Passwords, tokens, payment data, private keys, and one-time codes are excluded by instruction." />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lime-200 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-lime-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-100 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => onAsk("List only the long-term profile memory currently saved about me. Separate it from this conversation and from your inferences. For each saved item, quote the stored meaning clearly and offer to forget it, but do not remove anything unless I explicitly ask.")}
            type="button"
          >
            <MessageCircleIcon className="size-4" />
            Review saved memory
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm font-medium transition hover:border-lime-200/35 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70"
            onClick={() => onAsk("Help me prepare one durable, low-sensitivity memory note. Ask what would help in future sessions, then show me the exact wording and explain what not to include. Do not save it until I explicitly say to remember that exact note.")}
            type="button"
          >
            <MemoryStickIcon className="size-4" />
            Prepare a memory note
          </button>
        </div>
        <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-xs leading-6 text-muted-foreground">
          <p className="font-medium text-foreground">Storage boundary</p>
          <p className="mt-1">
            Local development memory lasts only for the running process. Production persistence
            needs a private backend configured by the operator. This build does not yet include a
            direct item-by-item memory editor, so review and deletion happen through the conversation.
          </p>
        </div>
      </div>
    </div>
  );
}

function BoundariesView() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-lime-200/70">Clear capability boundaries</p>
        <h1 className="brand-serif mt-3 text-4xl tracking-tight sm:text-5xl">What Evermote can do</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          This page describes the checked-in build, not imagined autonomy. Availability still
          depends on the operator configuring a model, identity, and private storage.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CapabilityGroup
            eyebrow="Available now"
            icon={CheckCircle2Icon}
            items={[
              "Streaming conversation that can be resumed by this thread URL",
              "A current-thread plan whose changes require one-time approval",
              "Read-only public-web research and a focused research specialist",
              "Explicit profile memory when private storage and user identity are configured",
            ]}
            tone="available"
          />
          <CapabilityGroup
            eyebrow="Not in this build"
            icon={CircleDashedIcon}
            items={[
              "Automatic personal daily briefings, reminders, or check-ins",
              "Calendar, inbox, task-manager, or messaging connections",
              "Continuous device, microphone, location, or screen monitoring",
              "External actions such as sending messages or changing other apps",
            ]}
            tone="unavailable"
          />
        </div>
        <div className="mt-8 space-y-3">
          <ControlRow status="One time" title="You approve each plan change" text="An approval applies only to the exact current-thread change shown in its card." />
          <ControlRow status="Explicit" title="You choose what becomes memory" text="Conversation alone never authorizes a save. Ask to remember or forget a specific low-sensitivity note." />
          <ControlRow status="Read only" title="Research cannot take actions" text="The specialist can gather public evidence but cannot log in, publish, message people, or change data." />
          <ControlRow status="Operator setup" title="Production access fails closed" text="A deployer must configure real authentication and private memory storage before personal use." />
        </div>
        <a
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm font-medium transition hover:border-lime-200/35 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70"
          href="/about"
        >
          Read the public project overview
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

function ActivityRail({
  eventCount,
  moteState,
  onAsk,
  openInputCount,
  status,
  workingTaskCount,
}: {
  readonly eventCount: number;
  readonly moteState: MoteVisualState;
  readonly onAsk: (prompt: string) => void;
  readonly openInputCount: number;
  readonly status: string;
  readonly workingTaskCount: number;
}) {
  return (
    <aside className="hidden min-h-0 overflow-y-auto px-5 py-5 xl:block">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Now</p>
        <span className="rounded-full border border-white/8 px-2 py-1 font-mono text-[9px] text-muted-foreground">v0.1</span>
      </div>
      <div className="mt-5 rounded-3xl border border-white/8 bg-white/[0.025] p-5 text-center">
        <MoteVisual className="mx-auto" decorative size={112} state={moteState} />
        <p className="mt-3 text-sm font-medium">{status}</p>
        <p className="mt-1 text-xs text-muted-foreground">This resumable thread</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="Working" value={workingTaskCount} />
        <Metric label="Waiting" value={openInputCount} />
        <Metric label="Events" value={eventCount} />
      </div>
      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Ask now</p>
        <div className="mt-3 grid gap-2">
          <RailAction label="Today" onClick={() => onAsk(TODAY_PROMPT)} />
          <RailAction label="Review this thread" onClick={() => onAsk(REVIEW_PROMPT)} />
          <RailAction label="Plan the next move" onClick={() => onAsk(PLAN_PROMPT)} />
        </div>
      </div>
      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Available here</p>
        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
          <FeatureLine icon={SparklesIcon} text="Configurable model provider" />
          <FeatureLine icon={WorkflowIcon} text="Read-only research specialist" />
          <FeatureLine icon={ShieldCheckIcon} text="One-time plan approvals" />
          <FeatureLine icon={BrainIcon} text="Explicit, scoped memory" />
        </div>
      </div>
      <p className="mt-6 border-t border-white/8 pt-5 text-xs leading-relaxed text-muted-foreground">
        No personal briefing or monitoring runs in the background. The checked-in schedule is a
        service diagnostic only and does not contact you.
      </p>
    </aside>
  );
}

function ReviewAction({
  icon: Icon,
  label,
  onClick,
  text,
}: {
  readonly icon: typeof CalendarCheckIcon;
  readonly label: string;
  readonly onClick: () => void;
  readonly text: string;
}) {
  return (
    <button
      className="flex min-h-28 items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-5 text-left transition hover:-translate-y-0.5 hover:border-lime-200/30 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70"
      onClick={onClick}
      type="button"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime-200/10 text-lime-100">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-xs leading-6 text-muted-foreground">{text}</span>
      </span>
    </button>
  );
}

function CapabilityGroup({
  eyebrow,
  icon: Icon,
  items,
  tone,
}: {
  readonly eyebrow: string;
  readonly icon: typeof CheckCircle2Icon;
  readonly items: readonly string[];
  readonly tone: "available" | "unavailable";
}) {
  return (
    <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            tone === "available"
              ? "bg-lime-200/10 text-lime-100"
              : "bg-white/6 text-muted-foreground",
          )}
        >
          <Icon className="size-4" />
        </span>
        <h2 className="text-sm font-medium">{eyebrow}</h2>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li className="flex gap-3 text-xs leading-6 text-muted-foreground" key={item}>
            <span
              aria-hidden="true"
              className={cn(
                "mt-2.5 size-1.5 shrink-0 rounded-full",
                tone === "available" ? "bg-lime-200" : "bg-white/25",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RailAction({ label, onClick }: { readonly label: string; readonly onClick: () => void }) {
  return (
    <button
      className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-3 text-left text-xs transition hover:border-lime-200/30 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/70"
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-lime-200">→</span>
    </button>
  );
}

function PolicyCard({
  icon: Icon,
  text,
  title,
}: {
  readonly icon: typeof BookOpenIcon;
  readonly text: string;
  readonly title: string;
}) {
  return (
    <article className="rounded-3xl border border-white/8 bg-white/[0.025] p-5">
      <Icon className="size-5 text-lime-200" />
      <h2 className="mt-5 text-sm font-medium">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}

function ControlRow({ status, text, title }: { readonly status: string; readonly text: string; readonly title: string }) {
  return (
    <article className="grid gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">{text}</p>
      </div>
      <span className="w-fit rounded-full border border-lime-200/20 bg-lime-200/8 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-lime-100">
        {status}
      </span>
    </article>
  );
}

function EmptyLedger({ icon: Icon, text }: { readonly icon: typeof ActivityIcon; readonly text: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 text-center">
      <Icon className="size-5 text-muted-foreground" />
      <p className="mt-3 max-w-52 text-xs leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-2 py-3 text-center">
      <p className="font-mono text-lg text-foreground">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureLine({ icon: Icon, text }: { readonly icon: typeof SparklesIcon; readonly text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
      <Icon className="size-3.5 text-lime-200/80" />
      <span>{text}</span>
    </div>
  );
}

function statusLabel(status: ReturnType<typeof useEveAgent>["status"], openInputCount: number): string {
  if (openInputCount > 0) return "Waiting for your decision";
  switch (status) {
    case "submitted":
      return "Starting the next step";
    case "streaming":
      return "Working now";
    case "resuming":
      return "Reconnecting to durable work";
    case "error":
      return "Needs attention";
    default:
      return "Ready when you are";
  }
}

function eventTitle(type: string): string {
  const labels: Record<string, string> = {
    "action.partial": "Tool shared progress",
    "action.result": "Tool call settled",
    "actions.requested": "Agent chose an action",
    "agent.started": "Specialist session opened",
    "input.requested": "Human decision requested",
    "input.resolved": "Human decision recorded",
    "message.completed": "Reply completed",
    "session.started": "Durable session started",
    "task.settled": "Background task settled",
    "task.started": "Background task started",
    "turn.completed": "Turn completed",
    "turn.failed": "Turn failed",
    "turn.started": "Turn started",
  };
  return labels[type] ?? humanize(type);
}

function humanize(value: string): string {
  return value.replaceAll(/[._-]+/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function taskStatusColor(status: string): string {
  switch (status) {
    case "working":
      return "bg-orange-200";
    case "completed":
      return "bg-lime-200";
    case "failed":
      return "bg-red-300";
    default:
      return "bg-white/30";
  }
}

function ComposerAction({
  hasInputText,
  isBusy,
  isResuming,
  onCancel,
}: {
  readonly hasInputText: boolean;
  readonly isBusy: boolean;
  readonly isResuming: boolean;
  readonly onCancel: () => void;
}) {
  const attachments = usePromptInputAttachments();
  const canSubmit = hasInputText || attachments.files.length > 0;

  if (!isBusy || canSubmit) {
    return <PromptInputSubmit disabled={isResuming} />;
  }

  return (
    <PromptInputButton
      aria-label="Stop"
      className="absolute right-2.5 bottom-2.5"
      onClick={onCancel}
      variant="outline"
    >
      <SquareIcon className="size-3 fill-current" />
    </PromptInputButton>
  );
}

function ErrorMessage({ message }: { readonly message: string }) {
  return (
    <div
      className="flex w-full items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm"
      role="alert"
    >
      <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div>
        <p className="font-medium">Request failed</p>
        <p className="mt-0.5 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function PendingThinking() {
  return (
    <div aria-live="polite" className="w-full text-sm">
      <div className="mb-4 flex w-full items-center gap-2 text-muted-foreground">
        <BrainIcon className="size-4" />
        <Shimmer duration={1}>Thinking</Shimmer>
      </div>
    </div>
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to cancel the response.";
}

function getLatestTurnFailure(
  events: ReturnType<typeof useEveAgent>["events"],
): string | undefined {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];

    if (event.type === "turn.failed") {
      return event.data.code === "MODEL_CALL_FAILED"
        ? "The model is temporarily unavailable. Please try again."
        : event.data.message;
    }

    if (event.type === "turn.completed" || event.type === "turn.cancelled") {
      return undefined;
    }

    if (event.type === "message.received") {
      return undefined;
    }
  }

  return undefined;
}
