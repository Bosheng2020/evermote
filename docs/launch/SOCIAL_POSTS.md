# Social launch drafts

These are maintainer-review drafts, not an automated posting queue. Before
using one, verify the linked commit, run the clean-install path, adapt the post
to the community, and rewrite it in the maintainer's natural voice.

Every post below identifies the author as the maintainer. Do not add a request
for stars, votes, likes, reposts, or ranking support. A useful call to action is
to try one documented flow and report specific friction.

Repository: <https://github.com/Bosheng2020/evermote>

## Short post for Mastodon, Bluesky, or X

> I maintain Evermote (@Bosheng2020 on GitHub), an experimental MIT-licensed
> personal-agent starter built with eve.
>
> It combines a browser conversation workspace, a session-scoped board whose
> changes require approval, optional bounded profile memory, and read-only web
> research. It is source for developers—not a hosted or production-ready
> service.
>
> If you run the setup, I would value a bug report on the first point of
> friction: https://github.com/Bosheng2020/evermote

If the network has a lower character limit, keep the disclosure, one capability,
the experimental/source-only boundary, and the repository URL. Put further
detail in a reply written specifically for that network.

## Two-post technical thread

**Post 1**

> I’m the maintainer of Evermote (@Bosheng2020 on GitHub). I built it to
> explore a personal agent whose working state and authority are inspectable:
> conversation, current focus, commitments, confirmed decisions, and a small
> optional profile notebook. The source is MIT-licensed:
> https://github.com/Bosheng2020/evermote

**Post 2**

> The boundaries are intentional: board and profile mutations pause for fresh
> approval; research is read-only; there are no email/calendar/message/device
> actions; and there is no user-facing background work. Production auth and
> session ownership are integration work, so this is an experimental starter,
> not a hosted turnkey service. Setup feedback is welcome in Issues.

## LinkedIn or longer-form post

> Disclosure: I maintain Evermote under my GitHub account, Bosheng2020.
>
> Evermote v0.1.0 is an experimental open-source personal-agent starter built
> with eve. I wanted to explore a narrower question than “how autonomous can an
> agent be?”: can its current focus, commitments, decisions, and remembered
> profile facts remain visible and subject to explicit control?
>
> The checked-in source includes a browser conversation workspace, resumable
> session URLs, cancel and steering controls, a revisioned session board whose
> mutations require fresh approval, optional bounded profile memory, and a
> read-only research specialist.
>
> The limits matter. It has no external write actions and no user-facing
> background work. Cross-session memory requires a trusted user identity and a
> production backend. The production authentication placeholder fails closed,
> and a deployer still has to implement per-user session ownership before
> accepting browser traffic. This is a developer starter, not a hosted or
> production-ready service.
>
> The source and capability contract are here:
> https://github.com/Bosheng2020/evermote
>
> If you try the documented local setup, please file the first reproducible
> setup problem or authority-boundary ambiguity you encounter. Specific
> feedback is more useful than general promotion.

## Developer community post

Use only in a community whose current rules allow project sharing, and add a
community-specific first sentence that explains why this project fits there.

> I’m the maintainer of Evermote (@Bosheng2020 on GitHub), and I’m sharing it
> here because **[write a specific, truthful connection to this community]**.
>
> Evermote is an experimental MIT-licensed personal-agent starter built with
> eve and Next.js. The implementation has three deliberately different state
> boundaries: resumable session history, a revisioned current-thread board, and
> a bounded profile document that can cross sessions only when trusted identity
> and storage are configured. Board and profile mutations require fresh
> approval. Public-web research is read-only.
>
> It is runnable source, not a hosted service. The default production browser
> path remains closed until a deployer adds end-user authentication and
> per-session ownership checks. There are no external write actions or
> user-facing background tasks.
>
> Source and setup: https://github.com/Bosheng2020/evermote
>
> I would especially value a reproducible report about **[choose one: clean
> install / denied approval / stale board revision / session reconnect]**.

Do not reuse this post across multiple communities. Rewrite it around one
community's terminology, norms, and genuine technical interest.

## Follow-up after a real improvement

Publish a follow-up only when there is a material, shipped change prompted by
feedback. Link the issue or release that verifies it.

> I maintain Evermote (@Bosheng2020 on GitHub). After feedback about
> **[specific problem]**, I changed **[specific behavior or documentation]** in
> **[issue/release link]**. The project remains an experimental personal-agent
> starter rather than a hosted production service.
>
> If you can reproduce the original path, I would value confirmation that the
> change resolves it—or a minimal case showing that it does not.

## Screenshot or recording caption

Use media captured from a clean test session. Remove prompts, filenames,
account identifiers, session IDs, credentials, provider dashboards, and other
private data.

Suggested factual caption structure:

> Evermote test session showing **[visible UI elements]** while **[the action
> actually demonstrated]**. Captured locally from commit **[short SHA]** with
> synthetic content. I maintain the project as @Bosheng2020 on GitHub.

Write alt text that describes only what the image visibly contains. Do not use
alt text as a second promotional caption.

## Pre-post fact check

- [ ] I personally ran the exact flow described by this post.
- [ ] The repository URL and any issue/release links resolve publicly.
- [ ] I disclosed that I maintain the project.
- [ ] I called it experimental source/starter software, not a hosted product.
- [ ] Any statement about continuity names its storage or identity dependency.
- [ ] I did not claim external actions, background work, production readiness,
      official OpenAI status, local-only processing, or proven security.
- [ ] The call to action requests use, critique, or a reproducible report—not
      stars, votes, likes, reposts, or reciprocal engagement.
- [ ] The post is native to one relevant community and complies with its
      current self-promotion rules.

