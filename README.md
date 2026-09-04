# piedmontmakers.org

The website of [Piedmont Makers](https://piedmontmakers.org), a 501(c)(3) nonprofit running FIRST Robotics teams, a community engineering lab, the School Maker Faire, popup maker spaces, and Build Like a Girl across the East Bay.

This is a static site built with [Astro](https://astro.build) and Tailwind CSS. It auto-deploys to GitHub Pages every time someone pushes to `main`.

## Quick links

- **Live site**: <https://piedmontmakers.org>
- **Issues & feature requests**: <https://github.com/piedmontmakers/piedmontmakers.org/issues>

## Start here

Pick the row that sounds like you:

| You | Go to |
|---|---|
| "I just want to write blog posts" | The CMS at <https://piedmontmakers.org/admin/> — sign in with GitHub, write, publish. Access setup: [docs/admin-setup.md](docs/admin-setup.md) |
| "I want to change the site by describing it in plain English" (no coding needed) | **[docs/editing-guide.md](docs/editing-guide.md)** — Claude Code and Codex, step by step |
| "I'm comfortable with git and npm" | Keep reading this README |

Two things everyone should know before their first edit:

1. **A push to `main` is live on the public site in about a minute, with no review step.** The shared verification suite gates deployment, including browser regressions, so a broken build never ships — but wrong *content* will. Look at what you're pushing.
2. **Some files require explicit approval before editing.** Brand tokens, the nav, the footer, the base layout, configs, and workflows are "red-zone." Claude Code asks for confirmation; Codex blocks the patch until a maintainer enables the local bypass. The edit-zones section of [AGENTS.md](AGENTS.md) explains the tiers.

## What's where

Routine content lives in plain data files under `src/data/` — most edits never touch page markup.

| Need to edit... | Look in |
|---|---|
| Calendar of events | `src/content/events/` (one Markdown file per event) |
| Blog posts | `src/content/blog/` (or use the CMS at `/admin/`) |
| Robotics levels: registration open/closed, TeamSnap + deck links | `src/data/robotics-levels.ts` |
| Robotics FAQ | `src/data/robotics-faq.ts` |
| Board roster | `src/data/board.ts` |
| Teacher Grants tables | `src/data/teacher-grants.ts` |
| Headline stats (kids, teams, schools...) | `src/data/stats.ts` |
| Support page links + giving levels | `src/data/support.ts` |
| Program cards on /events | `src/data/programs.ts` |
| Community quotes on the home page | `src/data/voices.ts` |
| Home page sections | `src/pages/index.astro` |
| A specific program page | `src/pages/events/{slug}.astro` |
| Facilities (10th St + Engineering Lab) | `src/pages/facilities.astro` |
| 404 page (with dancing Makey) | `src/pages/404.astro` |
| Photos | `public/img/` (organized by section) |
| Brand colors & fonts | `src/styles/global.css` (red-zone — confirm before editing) |
| Analytics events | `src/components/PostHog.astro` + inline scripts on each page |

## Making changes

### For blog posts: the CMS at /admin

The fastest path for publishing blog posts is the **Sveltia CMS** at <https://piedmontmakers.org/admin/>. Sign in with GitHub (you need Write access on the repo), pick the Blog collection, and write your post in a friendly editor. Saves become commits authored by your GitHub user and deploy in about a minute.

Setup details + how to grant editors access live in [docs/admin-setup.md](docs/admin-setup.md).

### For everything else: three options

#### Option 1: GitHub web editor (no install needed)

Fastest for small text edits or adding a blog post / event.

1. Open the file on GitHub (e.g. `src/content/blog/2026-04-21-...md`)
2. Click the pencil icon to edit
3. Make your change
4. At the bottom, write a short commit message and click **Commit changes**
5. Wait ~30 seconds — the GitHub Action rebuilds and deploys

#### Option 2: Clone locally + edit by hand

Prerequisites: a GitHub account with write access to this repo, git, Node 24 LTS (see `.nvmrc`; CI builds on 24), and `jq` (used by the agent hook scripts; `brew install jq`). For agent editing, a plan with a frontier model: `.claude/settings.json` defaults Claude Code to Opus (Sonnet 4.5+ is also fine; override locally with `/model` or `.claude/settings.local.json`), and AGENTS.md tells small/fast-tier models to disclose themselves and stand down to content-only edits.

```bash
git clone https://github.com/piedmontmakers/piedmontmakers.org.git
cd piedmontmakers.org
npm run bootstrap
npm run dev
```

The site runs at <http://localhost:4321/> with hot reload — open the URL in a browser and your edits show up as you save.

PostHog needs no setup. The project token and host are hardcoded in `src/components/PostHog.astro` deliberately (they are public values that ship in every page); an older `.env` approach silently disabled analytics in production and was removed. See [docs/agent/posthog.md](docs/agent/posthog.md).

When you're happy:
```bash
git add path/to/changed-file
git commit -m "Short description of what changed"
git push
```

#### Option 3: Clone locally + use an AI coding agent

This is how most of the site was built. The repo is configured for Claude Code and Codex:

- Codex reads `AGENTS.md`.
- Claude Code reads `CLAUDE.md`, which imports `AGENTS.md`.
- Project hooks live in `.codex/hooks.json` and `.claude/settings.json`.
- Shared hook logic lives in `scripts/agent-hooks/`.
- If your agent asks whether to trust this repo, approve it only after reviewing the hook scripts.
- Confirm the committed hook wiring with `npm run test:hooks` and `node scripts/check-agent-config.mjs`. Claude Code also exposes `/hooks`; Codex users can review `.codex/hooks.json` and the project settings shown after trusting the repository.
- Portable project skills live in `.agents/skills/`; Claude discovers relative symlinks under `.claude/skills/`.

Three guardrails to know about:

- **Branch guard**: `block-branch.sh` blocks branch creation/switching; the workflow is direct commits to `main`, pushed immediately.
- **Red-zone protection**: Claude Code opens a confirmation prompt for design and architecture files. Codex denies the first patch and explains how to proceed. Both adapters use the same path list in `scripts/agent-hooks/red-zone-paths.sh`.
- **Maintainer bypass**: after the user approves a red-zone change, create the gitignored `.agent-maintainer` marker at the repository root or launch the client with `PM_MAINTAINER=1`. Remove the marker when the approved work is finished.

```bash
git clone https://github.com/piedmontmakers/piedmontmakers.org.git
cd piedmontmakers.org
npm run bootstrap
claude         # or open in the Claude Code IDE plugin
# or open this folder in the Codex app / run codex
```

Then talk to it: *"Add the FTC league championship to the events calendar for November 15"*, *"Swap the photo on the Maker Faire page"*, *"Add a banner to the robotics page announcing summer camp registration"*, etc. The agent will read the project instructions, follow the site's conventions, edit the right files, and you can review the changes before committing.

Keep `npm run dev` running in another terminal while you work so the agent can check the browser preview as it edits.

The clients share two project skills. Ask for `web-verify` after frontend changes (`/web-verify` in Claude Code or `$web-verify` in Codex). Claude Code sessions install dependencies automatically at startup when `node_modules` is missing; in Codex (no startup hook), run `npm run bootstrap` or ask for `project-bootstrap`.

Local writing work also uses the `pm-context` plugin from the sibling [agents hub](https://github.com/piedmontmakers/agents). Claude Code auto-enables it through this repository’s settings. Codex desktop and CLI users install `pm-context@piedmontmakers` by following the hub’s `GETTING-STARTED.md`. Codex IDE does not currently load plugins and uses the sibling checkout fallback in `AGENTS.md`.

Some hosted agent sessions must use a managed branch or worktree. The agent should say clearly when its commit has not reached `main`; no change is live until `main` is pushed and the deploy succeeds.

## Content and page procedures

Use [content recipes](docs/agent/content-recipes.md) for events, blog posts, and
photos. Use [site reference](docs/agent/site-reference.md) for page callouts and
shared components. These are the canonical procedures used by coding agents too.

## Optional extras (browser verification, analytics)

Nothing beyond the prerequisites is required — the repo carries its own skills, hooks, and agent config. Three optional layers, in increasing order of setup:

- **Chrome-DevTools MCP (zero install, ships with the repo).** The committed `.mcp.json` and `.codex/config.toml` configure the same [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) server for Claude Code and Codex CLI. Review the command when the client asks you to trust project configuration. The agent can then take screenshots, click through pages, check the mobile viewport, and read console errors during `web-verify`. Chrome must be installed; `npx` fetches the server on first use.
- **Claude in Chrome extension (manual, nicer).** The browser extension drives your real Chrome session. It can't be provisioned from the repo — install it from your Claude settings and sign in. Worth it if you do frequent layout work; redundant if the DevTools MCP covers you.
- **PostHog MCP (admins only).** For querying site analytics conversationally. Needs a PostHog API credential, so it stays in personal config rather than the repo. Editors never need it.

Cloud sessions (claude.ai/code) have none of these — no browser reaches the sandbox — so `web-verify` there falls back to build checks and `curl`, and says so. Do visually sensitive changes (layouts, new sections, brand-adjacent work) in a local session with browser verification.

## When something goes wrong

- **The deploy shows a red ✗**: nothing shipped; the previous version of the site is still live. Open the failed run in the Actions tab, expand the "Verify production build" step and read which check failed (type check, alt text, agent configuration, hook contracts, build, browser tests, calendar feed, structured data, or agent readiness), fix, and push again. Or paste the log to your agent.
- **Undo a bad change**: `git revert <sha> && git push`. The revert deploys like any other commit. Never force-push `main`.
- **Build broken after an install**: follow [dependency recovery](docs/troubleshooting.md).

## Notifications (Slack)

The `#github-notifications` channel in the Piedmont Makers Slack workspace gets a message for every commit and deploy via the official GitHub Slack app. One-time setup, for reference:

1. Install the [GitHub app for Slack](https://slack.github.com) in the workspace.
2. In the channel: `/github subscribe piedmontmakers/piedmontmakers.org commits:all workflows:{event:"push" branch:"main"} deployments`
3. Optional noise trim: `/github unsubscribe piedmontmakers/piedmontmakers.org issues pulls`

The `workflows` and `deployments` subscriptions are the safety net: a failed deploy (content that built locally but failed a check) shows up in the channel instead of failing silently.

## What's already external (don't touch)

These run on their own services and just get linked from the site:

- **Donations** → Square at `donate.piedmontmakers.org`
- **Newsletter** → Mailchimp (inline form on the home page posts there)
- **T-shirts** → [Bonfire](https://www.bonfire.com/piedmont-makers-t-shirt/)
- **Robotics registration** → TeamSnap (one form per level)
- **Maker Faire tickets** → Eventbrite
- **Forms** (exhibit signup, waiver, check-in) → Google Forms / Grasshopper

## Voice

Short version:
- Audience is **parents across the East Bay**, not just Piedmont
- **Kids and volunteers are the heroes**, not the org
- Keep "Piedmont" in the name and in literal place names; don't use it to scope the audience
- See `AGENTS.md` for the full set of voice rules

## Tech

Astro 5 (NOT 6 — Astro 6 has a known build issue with our setup), Tailwind CSS v4, `@tailwindcss/typography` for blog prose, content collections for blog + events, PostHog for analytics, a hand-rolled RSS feed at `/rss.xml`. SEO basics (canonical, Open Graph, Twitter Card, JSON-LD, `robots.txt`, `llms.txt`) all wired into `BaseLayout`. Full details in `AGENTS.md`.

## Troubleshooting

See [troubleshooting](docs/troubleshooting.md) for clean installs, native bindings,
preview ports, and deployment recovery.

## License

The source code is MIT (see `LICENSE`). The brand assets (logo, Makey mascot) and original photos are not — please don't reuse them without asking.

## Contact

Reach the board at <hello@piedmontmakers.org>.

## Automated regression checks

Run `npm run verify` before committing. Install the pinned browser once with
`npx playwright install chromium`. CI installs Chromium and runs the same suite.
Browser tests use their own production preview on port 4399, intercept external
requests, and cover menu keyboard behavior, event date boundaries and links,
newsletter validation, rendered local links/images, and WCAG A accessibility.
The accessibility scan is a baseline, not a full WCAG AA or screen-reader audit.
