# Ethical community outreach and seven-day rollout

This plan is for authentic discovery of Evermote by developers who may run,
inspect, critique, or contribute to it. It is not a plan to manufacture stars.
Stars may be observed as an unsolicited outcome, but no outreach should ask
for, trade, buy, reward, automate, or coordinate them.

**Maintainer disclosure:** outreach must state that the author maintains
Evermote as [`Bosheng2020`](https://github.com/Bosheng2020). The project is
independent, experimental open-source software and is not affiliated with or
endorsed by OpenAI.

## Non-negotiable rules

- Never buy stars, use bots or additional accounts, join engagement pods,
  trade stars, offer rewards for engagement, or hire a service that promises
  ranking manipulation.
- Never ask people to upvote a Show HN or Product Hunt submission. Do not send
  voting links to friends or group chats.
- Never send mass or unsolicited direct messages. A one-to-one note is
  appropriate only when there is an existing relationship and a specific
  reason that person's expertise is relevant.
- Never post the same copy across many communities. Read each community's
  current rules, participate in context, and make at most one relevant post.
- Never hide the author's relationship to the repository.
- Never present the repository as a hosted service, ChatGPT clone, official
  OpenAI project, secure production deployment, autonomous worker, or
  local-first/local-only application.
- Never expose a public deployment while the placeholder production
  authenticator or missing per-session ownership controls remain.
- Do not turn criticism into an argument. Correct factual errors, thank the
  reporter, and convert reproducible findings into visible work.

These practices align with GitHub's
[Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies),
the [HN guidelines](https://news.ycombinator.com/newsguidelines.html), Reddit's
[spam policy](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam),
and Product Hunt's guidance against asking outright for upvotes in its
[launch guide](https://help.producthunt.com/en/articles/17350772-launch-guide).
Re-check every policy on the day of use because community rules change.

GitHub's own operational references are the source of truth for
[Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases),
[repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics),
[social previews](https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview),
and [repository traffic](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository).

## Channel fit and order

| Channel | Current fit | Use it when | Call to action |
| --- | --- | --- | --- |
| GitHub Release | Strong | The tag, clean install, docs, and checks have been verified | Run one flow; open a reproducible issue |
| Maintainer's existing social profile | Strong | The post discloses ownership and reaches people who opted to follow the maintainer | Critique setup or one boundary |
| Show HN | Conditional | An eligible established account submits personally; another developer can run the work; the maintainer can participate live | Technical critique after trying or inspecting it |
| One relevant developer community | Conditional | Current rules permit project sharing and there is a specific technical fit | Answer one community-relevant question |
| eve or framework community | Conditional | There is an official venue that permits showcases and the post offers implementation detail useful to that ecosystem | Review the integration or report a framework-specific issue |
| Curated open-source list/newsletter | Later | The project meets published inclusion criteria and a human maintainer accepts direct submissions | Consider it on its merits |
| Product Hunt | Defer | Reconsider only if Evermote becomes a live, independently usable product with the required production controls | Product feedback, never votes |

Product Hunt currently says it does not generally feature templates or
boilerplates in its
[featuring guidelines](https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines).
Evermote v0.1.0 is a source starter, so launch effort is better spent on
technical communities unless that status materially changes.

## Seven-day rollout checklist

Keep the entire rollout manual. One thoughtful release and a few relevant
conversations are preferable to high-volume distribution.

### Day 1 — Make the repository convert qualified visits

- [ ] Publish a verified `v0.1.0` GitHub Release from the reviewed notes; do not
      claim the release exists before the tag is created.
- [ ] From a clean environment, time clone-to-first-response and record every
      undocumented step.
- [ ] Confirm the README's capability table, requirements, costs, privacy
      boundary, independence notice, and production-auth warning are visible.
- [ ] Add only accurate repository topics and a current social preview.
- [ ] Confirm Issues, private vulnerability reporting, license, contribution
      guide, and code of conduct are available.
- [ ] Capture baseline GitHub Traffic values and star count privately; do not
      turn the count into a public appeal.

**Exit criterion:** a developer who sees only the README can decide whether the
project fits, run it, and understand what it cannot do.

### Day 2 — Produce proof, not promises

- [ ] Record a 30–60 second clean test session or a small set of screenshots
      using synthetic content.
- [ ] Show one real control boundary, such as approval of a board mutation or
      rejection of a stale revision.
- [ ] Caption the exact commit and environment. Remove session IDs, credentials,
      user data, provider dashboards, and hidden notifications.
- [ ] Ask two or three existing technical contacts for private usability
      feedback only if they have relevant experience; do not ask for public
      engagement.
- [ ] Fix launch-blocking setup or documentation defects before broader
      outreach.

**Exit criterion:** every visible claim in the media can be reproduced from the
published source.

### Day 3 — One high-signal technical launch

- [ ] If the Show HN gate in `SHOW_HN.md` passes, the maintainer writes and
      submits their own post from an eligible account.
- [ ] If the gate does not pass, skip Show HN; publish the reviewed short post
      from `SOCIAL_POSTS.md` on one existing profile instead.
- [ ] Stay available to answer questions for several hours.
- [ ] Record recurring confusion, broken setup steps, and concrete feature
      requests without arguing about the launch framing.
- [ ] Do not contact anyone to vote, comment, like, repost, or star.

**Exit criterion:** every substantive question receives a factual response, or
an honest “not implemented” with a relevant documentation link.

### Day 4 — One community-specific deep dive

- [ ] Select at most one community based on an actual technical overlap, not
      its audience size.
- [ ] Read its current rules and recent project posts before writing.
- [ ] Write a new, community-specific explanation of one implementation choice:
      revisioned approval, state boundaries, read-only delegation, or
      production auth responsibilities.
- [ ] Disclose maintainership in the first paragraph.
- [ ] Ask one precise technical question and remain available for follow-up.
- [ ] If self-promotion is prohibited or ambiguous, do not post; contribute to
      unrelated discussions without inserting the project link.

**Exit criterion:** the post would still be useful to that community if readers
never clicked the repository link.

### Day 5 — Turn feedback into a shipped improvement

- [ ] Triage feedback into reproducible bug, documentation gap, design question,
      feature request, or out-of-scope request.
- [ ] Fix at least one high-confidence setup or documentation issue.
- [ ] Credit the reporter if they consent, without implying endorsement.
- [ ] Link the issue, change, and verification evidence.
- [ ] Publish a follow-up only if there is a material improvement; otherwise
      keep working quietly.

**Exit criterion:** the launch has produced a visible quality improvement, not
only attention metrics.

### Day 6 — Help the relevant ecosystem

- [ ] Publish a concise technical note explaining one reusable lesson from the
      implementation, with limitations and code references.
- [ ] If an official eve, Next.js, or agent-development venue permits showcases,
      share the note there; otherwise keep it in repository documentation.
- [ ] Review newly opened issues for minimal reproductions and label or respond
      consistently.
- [ ] Welcome a first-time contributor with a scoped issue only when the work
      is genuinely useful and maintainable.

**Exit criterion:** the project contributes knowledge or maintainer help back
to the ecosystem where it seeks attention.

### Day 7 — Report honestly and choose the next loop

- [ ] Compare the seven-day results with the baseline using GitHub Traffic and
      the issue/PR history.
- [ ] Publish a concise factual recap only if it includes useful learnings or
      shipped changes; do not use low numbers as a renewed engagement appeal.
- [ ] Close or clarify duplicate and out-of-scope requests.
- [ ] Choose one next product goal based on repeated evidence, such as smoother
      first use or an inspectable memory-management surface.
- [ ] Stop broad promotion for at least a week unless a genuine new release or
      material fix gives people a new reason to look.

**Exit criterion:** there is a prioritized evidence-based backlog and no
unanswered high-severity report.

## One-to-one feedback note

Use only for someone the maintainer already knows and whose experience is
directly relevant. Personalize it; do not send it in bulk.

> I maintain an experimental open-source personal-agent starter called
> Evermote under my GitHub account, Bosheng2020. You have experience with
> **[specific relevant area]**, so I wondered whether you would be willing to
> inspect **[one precise flow or document]**. I am looking for critical feedback
> on **[one question]**, not public promotion. No worries if you do not have
> time. Repository: https://github.com/Bosheng2020/evermote

Do not add a request to star, vote, repost, or comment publicly.

## Measurement plan

Use GitHub's
[repository traffic view](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository)
for views, unique visitors, clones, and referring sites. Keep a small manual log
of feedback and successful installations. Do not install invasive analytics in
the agent or track private session URLs for launch measurement.

These are internal working targets for the first seven days, not industry
benchmarks or promises:

| Measure | Seven-day working target | Why it matters |
| --- | ---: | --- |
| Qualified unique repository visitors | 100–300 | Enough relevant exposure to learn from |
| Unsolicited stars | 10–30 | A secondary indication that some visitors want to follow the project |
| Independently confirmed clean installs | 5 | Evidence that the source is actually approachable |
| Substantive feedback items | 5 | Specific input on setup, behavior, or boundaries |
| External issues or pull requests | 2 | Stronger participation signal than passive engagement |
| Median clone-to-first-response among testers | Under 10 minutes | A practical first-use target, assuming prerequisites are ready |
| Maintainer response to substantive reports | Within 24 hours during rollout | Keeps the feedback loop credible |

A qualified visitor is someone arriving from a relevant technical context, not
paid, automated, or untargeted traffic. A substantive feedback item contains a
reproduction, concrete question, design critique, or documentation correction;
emoji-only reactions and generic praise do not count.

### Daily log

```text
Date / channel:
Link:
Disclosure included: yes / no
Community rule checked:
Unique visitors / clones / unsolicited stars:
Confirmed installs:
Substantive feedback:
Issues or PRs created:
What changed because of the feedback:
Should this channel be used again? Why?
```

## Stop conditions

Pause outreach and fix the project if any of these occurs:

- the documented clean install fails for an independent tester;
- a published claim is broader than the code or capability contract;
- a credential, private transcript, user identifier, or session URL is exposed;
- a plausible security report arrives;
- a community moderator asks the maintainer to stop or remove the post;
- comments reveal that readers reasonably think the repository is a hosted,
  production-ready, official OpenAI product; or
- the maintainer cannot keep up with substantive reports.

When outreach resumes, explain the correction or shipped fix plainly. Do not
use a correction as a pretext for another engagement push.

