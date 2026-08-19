# Editing the website with an AI coding agent

This guide is for Piedmont Makers folks who want to update the website by describing changes in plain English. No coding or command-line experience is required. If you are comfortable with git and npm, the developer section of the [README](../README.md) is the faster read.

## The one rule to understand

**A push to `main` goes live on piedmontmakers.org in about a minute.** There is no draft mode or approval step.

- Every change is recorded in git and can be undone.
- Commit and deploy notifications go to `#github-notifications` in the Piedmont Makers Slack workspace.
- Automatic checks run before each deploy. If a change breaks the site, the deploy stops and the previous version stays up.

Edit routine content freely: calendar events, blog posts, dates, links, names, and numbers. If the agent says a change affects a red-zone file or the site's design or architecture, check with an admin before approving it.

## Pick your path

| You want to... | Use |
|---|---|
| Write or edit **blog posts** only | The web editor at [piedmontmakers.org/admin](https://piedmontmakers.org/admin/). Sign in with GitHub; no agent is needed. See [admin-setup.md](admin-setup.md) for access. |
| Make **any change** without installing software | **Claude Code on the web** |
| Work locally with a live preview | **Claude Code or Codex** |

## Claude Code on the web

1. Go to [claude.ai/code](https://claude.ai/code) and sign in.
2. Connect your GitHub account when prompted. You need access to `piedmontmakers/piedmontmakers.org`; ask an admin if it is missing.
3. Open the repository and describe the change.
4. Review the files and verification results before accepting the commit.

A hosted session may be required to work on a managed branch instead of `main`. If Claude mentions a branch, pull request, or handoff at the end, the change is not live yet. Send the handoff to an admin so it can be merged and deployed.

One limit of web sessions: the cloud sandbox has no browser, so Claude there can check that the site builds but cannot *see* the pages. Text and calendar edits are fine from the web; for anything visual (layouts, new sections, photos in context), prefer a local session where Claude can screenshot the result, or check the live site yourself a minute after the push.

## Claude Code or Codex on your computer

One-time setup takes about 15 minutes:

1. Ask an admin for write access to the repository.
2. Install git. On a Mac, open Terminal and run `git --version`; macOS offers to install it if needed.
3. Install Node.js 24 LTS from [nodejs.org](https://nodejs.org).
4. Install `jq`, which the Codex red-zone hook uses to inspect patches: `brew install jq` with Homebrew, or use [jqlang.github.io/jq](https://jqlang.github.io/jq/).
5. Install [Claude Code](https://claude.com/claude-code), [Codex](https://developers.openai.com/codex/), or both. You need a plan that includes a top-tier model: the repo is set up for Claude Opus (Sonnet 4.5+ also works) or the equivalent top Codex model. Claude Code sessions in this folder select Opus automatically; if your plan doesn't include it, pick Sonnet when prompted. Don't edit the site with a "fast"/"mini" model — quality matters more than speed here, and the agent has standing instructions to warn you if a weak model is driving.
6. Get the site by pasting these commands into Terminal one line at a time:

   ```bash
   git clone https://github.com/piedmontmakers/piedmontmakers.org.git
   cd piedmontmakers.org
   npm ci --include=optional
   ```

Launch your preferred client from the repository:

```bash
cd piedmontmakers.org
claude
# or
codex
```

You can also open the folder in the Codex desktop app or a Claude Code editor integration.

When the client asks whether to trust the folder or enable project hooks, review `scripts/agent-hooks/`, then approve it. Claude Code installs dependencies automatically when a session starts in a fresh clone; in Codex, ask the agent to use `project-bootstrap` if the build complains about missing packages.

## Shared instructions, hooks, and skills

Both clients receive the same project policy:

- Codex reads `AGENTS.md` directly.
- Claude Code reads `CLAUDE.md`, which imports `AGENTS.md`.
- Client adapters live in `.codex/hooks.json` and `.claude/settings.json`; shared hook logic lives in `scripts/agent-hooks/`.
- Project skills live in `.agents/skills/`. Claude Code reaches the same files through `.claude/skills/` symlinks.

Use the `web-verify` skill after frontend work. In Claude Code, enter `/web-verify`; in Codex, enter `$web-verify` or ask for it by name.

### Red-zone approval differs by client

Claude Code opens a confirmation prompt before editing a red-zone file. Approve it only when the requested work requires that file.

Codex cannot pause a `PreToolUse` hook for the same confirmation, so it blocks the first patch. After an admin approves the change, create the gitignored `.agent-maintainer` file at the repository root and retry. Remove the marker when the approved work is complete. Launching the client with `PM_MAINTAINER=1` provides the same local bypass.

## Example prompts

Brief either agent as you would a helpful colleague:

- "Add a calendar event: LEGO League scrimmage at Havens Elementary on March 14 from 10am to 2pm. Registration link is https://..."
- "The FTC league meet on Nov 8 moved to 1pm. Update the calendar."
- "LEGO League Challenge registration is open. Update the robotics page with this TeamSnap link: https://go.teamsnap.com/..."
- "Add Jane Doe to the board roster as VP, Popup Maker Spaces."
- "Fix the 'engneering' typo on the About Us page."
- "Write a blog post about last weekend's tournament using these photos and notes."

The agent should edit the appropriate files, run the repository checks, show you the diff, commit with a clear message, and push `main`. Review its summary. If it says the commit is only on a branch or in a worktree, it has not reached the live site.

## After a push

- The change appears at [piedmontmakers.org](https://piedmontmakers.org) in about a minute. Hard-refresh with Cmd+Shift+R if needed.
- The `#github-notifications` channel in the Piedmont Makers Slack workspace shows the commit and deploy status.
- A failed deploy means the checks caught a problem and the previous site remains live. Give the failure log to the agent or tell an admin.

## Made a mistake?

Every version is saved. Tell the agent: **"Revert my last change and push `main`."** You can also message an admin with what changed and roughly when.

## Rules the agents already know

The repository instructions cover the site's audience and voice, brand rules, edit zones, verification, commit messages, and deployment workflow. You do not need to memorize them. If an agent conflicts with [AGENTS.md](../AGENTS.md), point it to the relevant section. System and managed-environment restrictions still take precedence, and the agent should report any resulting handoff clearly.
