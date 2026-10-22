# Show HN author worksheet

> **Do not paste this file into Hacker News.** The
> [Show HN rules](https://news.ycombinator.com/showhn.html) say posts should be
> the submitter's own work, and the
> [HN guidelines](https://news.ycombinator.com/newsguidelines.html) prohibit
> generated or AI-edited comments. The maintainer must write the title and
> post independently, in their own words, after personally running the project.
> This worksheet is only a private fact-checking and launch-readiness aid.

## Identity and relationship to disclose

- Submitter identity: GitHub maintainer
  [`Bosheng2020`](https://github.com/Bosheng2020).
- Relationship: creator/maintainer of Evermote.
- Project status: independent, experimental open-source software; not an
  OpenAI product and not endorsed by OpenAI.
- Destination URL: <https://github.com/Bosheng2020/evermote>

The human-written post should disclose that relationship near the beginning,
not only after someone asks.

## Go/no-go gate

Do not submit until every applicable item is true:

- [ ] The submitter has read the current Show HN rules and HN guidelines.
- [ ] The submitter is eligible under the current
      [Show HN account restriction](https://news.ycombinator.com/showlim) and
      will not create or borrow another account to bypass it.
- [ ] The repository is public and the exact clone/install commands work from
      a clean machine or container.
- [ ] Required model access, possible provider charges, and the Node/pnpm
      requirements are obvious before setup.
- [ ] The README makes clear that this is runnable source, not a hosted public
      app.
- [ ] No public deployment is exposed with placeholder authentication or
      without per-session ownership controls.
- [ ] A real screenshot or short recording is available if it materially helps
      readers understand the project; it contains no private prompt, key, or
      transcript.
- [ ] The submitter can remain available to answer technical questions and
      receive criticism on launch day.

If the project is not straightforward for another developer to run, delay the
post and fix first-use friction rather than treating the repository page as a
landing-page-only Show HN.

## Facts the maintainer can verify and explain

Use only the points the maintainer has personally checked. Rewrite all wording.

### One-sentence scope

Evermote is an experimental, MIT-licensed personal-agent starter built with
eve: a browser conversation workspace with session-scoped planning state,
optional approval-gated profile memory, and read-only public-web research.

### Why it exists

The design question is how a personal agent can feel continuous while keeping
its authority, memory, and completion claims visible and bounded. The project
records current focus, commitments, and confirmed decisions in typed state,
then requires fresh approval for each state mutation.

### Concrete implementation details

- Next.js browser workspace connected to an eve agent service.
- Streamed model responses with cancel, in-flight steering, attachments, and
  supported human-in-the-loop prompts.
- Resumable `/s/:sessionId` conversations, with durability determined by the
  configured Workflow store and retention policy.
- A revisioned current-thread board; each write includes the expected revision
  and pauses for fresh approval.
- A bounded profile-memory document that can cross sessions only with trusted
  identity and an appropriate backend; each save or removal requires fresh
  approval.
- A separate, narrower researcher with read-only hosted search.
- Tests/evals covering several consent, revision, memory, heartbeat, and
  false-background-work boundaries.

### The limitation worth leading with

This source is not a production-ready hosted agent. The checked-in production
authenticator rejects ordinary browser traffic until a deployer implements
real end-user authentication and per-session authorization. It also has no
external write actions and no user-facing background work.

### Questions that can produce useful discussion

Choose one or two, and ask for critique—not votes:

- Is the line between session board, cross-session profile memory, and
  provider-side transcript persistence understandable?
- Does the revision-plus-approval flow create a useful authority boundary, or
  too much interaction cost?
- Which part of the clean-install path is least clear?
- What additional denial or stale-state cases should the eval suite cover?
- What would a minimal, inspectable memory-management screen need before real
  personal use?

## Claims not to make

- Do not call Evermote a ChatGPT clone, an official ChatGPT/Dots implementation,
  or an OpenAI-compatible product.
- Do not say it is autonomous, always-on, proactive, secure, production-ready,
  local-first, local-only, private by default, or zero-cost.
- Do not call session or profile state simply “persistent” without explaining
  the store, identity, and retention conditions.
- Do not imply that a commitment means work will continue after the active
  turn, or that the daily heartbeat performs user work.
- Do not imply that passing builds or evals proves safety or correctness.
- Do not announce a hosted demo unless a working URL exists and production
  authentication, session ownership, retention, and deletion controls have
  actually been implemented and tested.

## Launch-day conduct

- Submit once, from the maintainer's established account, at a time when the
  maintainer can participate.
- Do not ask friends, users, followers, group chats, or other accounts to vote,
  comment, or “help it trend.” Do not coordinate reciprocal engagement.
- Do not repost a poorly performing submission or delete/re-submit to game
  ranking. Follow moderator guidance if a correction is needed.
- Answer questions directly. Distinguish checked facts from design intent and
  future work.
- Correct material errors in the README first, then add a brief transparent
  correction to the discussion.
- Treat critical comments as product evidence. Convert reproducible bugs or
  concrete documentation gaps into issues with the commenter's permission.

## Human drafting prompts

Without copying text from this file, the maintainer should independently write:

1. A factual `Show HN:` title that names what was built, without superlatives.
2. A short first-person account of the problem that motivated the work.
3. Two or three implementation choices the maintainer personally understands.
4. The most important current limitation.
5. One precise question for readers who run or inspect the source.

Then compare the human draft against the capability table in `README.md` and
the contract in `docs/AGENT_CONTRACT.md`. If the draft is broader, narrow it.

