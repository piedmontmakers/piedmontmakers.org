# AGENTS.md — orientation for AI agents

This is the canonical project instruction file for AI coding agents. Claude Code reads `CLAUDE.md`, which imports this file with `@AGENTS.md`; Codex reads this file directly. Project hook adapters live in `.claude/settings.json` and `.codex/hooks.json`, and both call shared scripts in `scripts/agent-hooks/`.

You are working on **piedmontmakers.org**, the public website of Piedmont Makers, a 501(c)(3) nonprofit running FIRST Robotics teams, a community engineering lab, a School Maker Faire, popup maker spaces, and Build Like a Girl across the **East Bay**. The site is maintained for the Piedmont Makers team, whose board members and program leads rely on these instructions to keep edits consistent.

The site is live at https://piedmontmakers.org/. The full Wix migration is done — there's no parallel staging site anymore. Blog post editing happens through Sveltia CMS at `/admin/` (see `docs/admin-setup.md`); page structure and design edits happen in the codebase.

## Live URLs

- Live: https://piedmontmakers.org/

`astro.config.mjs` flips `base` and `site` on the `USE_CUSTOM_DOMAIN=true` env var (set in `.github/workflows/deploy.yml`). To revert to the GH Pages subpath URL, drop that env var.

## Task references

Keep this file in context for every task. Read only the additional reference that matches the work:

- Page structure, brand implementation, shared components, SEO, CMS, services, facilities, or open page follow-ups: `docs/agent/site-reference.md`
- Routine data edits, blog posts, calendar events, or photos: `docs/agent/content-recipes.md`
- PostHog analytics or conversion tracking: `docs/agent/posthog.md`

These references contain procedures and inventory. This file remains authoritative for safety, voice, accessibility, verification, and git workflow.

## Edit zones (read this first)

Multiple people edit this site through AI agents, with a wide range of technical experience. A push to `main` is live on piedmontmakers.org in about a minute with no review step, so edits are tiered by blast radius:

**Green — edit freely.** Routine content. `src/content/blog/**`, `src/content/events/**`, `src/data/**`, `src/copy/**` (long-form page prose, currently just the privacy policy body), `public/img/**`, and copy tweaks inside existing page markup. This is where nearly all day-to-day requests land.

**Yellow — normal engineering care.** Structural changes scoped to a single page (`src/pages/*.astro`), or new components used by one page. Follow the existing patterns on the page, and run `npm run verify` before committing.

**Red — stop and confirm with the user before editing.** These files shape the whole site's design or architecture:

- `src/styles/global.css` (brand theme tokens)
- `src/components/Nav.astro`
- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`
- `astro.config.mjs` (base/site config + 33 legacy redirects + the sitemap filter)
- `package.json` / `package-lock.json`
- `src/content.config.ts` (content schemas)
- `.github/workflows/*`
- `public/admin/*` (CMS shell — breaking it locks editors out)
- `scripts/agent-hooks/*`, `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` (defines commands that run on every editor's machine)
- `.agents/skills/*`, `.claude/skills/*`
- `CLAUDE.md`, `AGENTS.md`

Before touching a red-zone file, confirm that the user has authorized the architectural change. Ask about the concrete scope only if that authorization is missing; do not request the same approval again. If the person you're working with isn't an admin, suggest checking with one before proceeding. PreToolUse hooks use the same path list as a backstop: Claude Code asks for confirmation, while Codex denies an unapproved patch until `PM_MAINTAINER=1` or the gitignored `.agent-maintainer` marker is present. A deliberate, confirmed red-zone change is fine.

## Tech stack

Astro 5 LTS, Tailwind CSS v4, Astro content collections, PostHog, Mailchimp, and GitHub Pages. Do not upgrade to Astro 6; see Known gotchas below. Detailed file and design-system references live in `docs/agent/site-reference.md`.

## Org voice & facts (canonical home: the agents hub)

The full voice and editorial rules live in the org's agents hub — the private repo `piedmontmakers/agents`, plugin `pm-context`, skill `voice`. They are canonical there and bind all site prose. The digest for a quick edit:

- **Audience: parents across the East Bay** shopping for kid programs. "East Bay", not "Piedmont", except in the org name, PUSD-specific content, and literal place names.
- **Always STEAM, never STEM** (the verbatim mission statement's "S.T.E.A.M." stays as is).
- **"LEGO League", not "FLL", in body prose** (FLL is fine in space-constrained UI).
- **Never publish the dollar amount a named donor gave us.** Amounts the org awards (teacher grants) are fine; the full policy is in the hub.
- **MailChimp: drafts only.** Agents never send or schedule a campaign; test emails only to addresses the user names in the conversation.

For anything beyond a small copy tweak, read the full rules first. Choose the path supported by the current client:

- **Local clients with plugins (Claude Code, Codex desktop, Codex CLI):** use the installed pm-context `voice` skill. This repository auto-enables pm-context for Claude Code; Codex users install it from the `piedmontmakers/agents` marketplace. Org numbers come from `/facts.json` through the `org-facts` skill, never from memory.
- **Claude Code cloud sessions:** local plugins did not provision in the verified 2026-08-27 test. Read the full rules through the GitHub MCP: attach `piedmontmakers/agents`, then read `plugins/pm-context/skills/voice/SKILL.md`. Fetch org numbers from `https://piedmontmakers.org/facts.json`.
- **Clients without plugin support:** read `../agents/plugins/pm-context/skills/voice/SKILL.md` from the sibling hub checkout, or fetch it with `gh api repos/piedmontmakers/agents/contents/plugins/pm-context/skills/voice/SKILL.md --jq .content | base64 -d`.

**Machine-readable facts**: `/facts.json` (see `src/pages/facts.json.ts`) serves stats, board, programs, grants, and the EIN, compiled from `src/data/` — the same modules the pages render — and the agent-readiness deploy gate contract-checks its shape. Edit numbers in `src/data/`; stats provenance notes are in `docs/agent/site-reference.md`.

## Page contracts

For mobile, accessibility, structured-data, and shared-component rules, read
`docs/agent/site-reference.md`. Content procedures live in
`docs/agent/content-recipes.md`; analytics procedures live in `docs/agent/posthog.md`.

## Workflow

1. Start at this repository root. Synchronize with `git fetch origin main && git merge --ff-only origin/main`; stop and inspect if local work prevents a fast-forward.
2. Use Node.js 24 (`.nvmrc`). Bootstrap with `npm run bootstrap`; install Chromium once with `npx playwright install chromium`.
3. Keep `npm run dev` running while the user previews. Do not stop an existing dev server. The default preview uses the production apex paths.
4. Run `npm run verify` before committing. It is the single complete gate used locally, in PR checks, and before deployment. It includes the production build and browser regressions. Investigate failing contracts rather than weakening them.
5. Stage specific paths, review the diff, and commit each coherent change. Use `Area: imperative summary`, with a short body for nontrivial changes. No Co-Authored-By line.
6. **Push immediately after every commit: `git push origin main`.** If rejected because another editor pushed, inspect and rebase on origin/main, rerun verification if the combined result changed, then push.
7. Confirm the deployment succeeded before saying a change is live. A passing push alone does not establish that.

Work directly on `main` unless the user requests a branch or PR. Do not create or
switch branches automatically. In a managed environment that prevents this,
report the required handoff. Revert mistakes with `git revert <sha>` and a normal
push; never force-push main. Inspect unmerged work before proposing branch cleanup.
Commit messages are used in Slack changelogs, so explain the concrete change.

Client guard coverage and smoke tests are documented in the sibling hub's
`docs/client-compatibility.md`. The optional `python3 scripts/smoke-client-runtime.py`
checks real Claude/Codex shell hook dispatch in temporary repositories.

## Troubleshooting

Read `docs/troubleshooting.md` for dependency recovery, deployment failures,
and historical compatibility constraints. Do not upgrade frameworks or rewrite
contracts to bypass a failing check.

## External services and open follow-ups

External-service ownership, facility addresses, and known page follow-ups live in `docs/agent/site-reference.md`.
