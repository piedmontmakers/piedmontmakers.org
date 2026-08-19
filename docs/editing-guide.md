# Editing the website with Claude

This guide is for Piedmont Makers folks who want to update the website by describing changes in plain English. No coding or command-line experience needed. If you're comfortable with git and npm, the developer section of the [README](../README.md) is the faster read.

## The one rule to understand

**Anything you save goes live on piedmontmakers.org within about a minute.** There is no draft mode and no approval step. That's less scary than it sounds:

- Every change is recorded in history and can be undone. Nothing is ever lost.
- Ben gets a Slack notification for every change, with your name on it.
- Automatic checks run before each deploy. If your change would break the site, the deploy stops and the old site stays up.

So: edit freely for normal content (calendar events, blog posts, dates, links, names, numbers). If Claude ever warns you that a change affects "the site's design or architecture," stop and check with Ben before saying yes.

## Pick your path

| You want to... | Use |
|---|---|
| Write or edit **blog posts** only | The web editor at [piedmontmakers.org/admin](https://piedmontmakers.org/admin/) — sign in with GitHub, no install. See [admin-setup.md](admin-setup.md) for access. |
| Make **any change** by describing it, no install | **Claude Code on the web** (below) |
| Work on your own computer with live preview | **Claude Code locally** (below) |

## Claude Code on the web (easiest)

1. Go to [claude.ai/code](https://claude.ai/code) and sign in.
2. Connect your GitHub account when prompted (you need access to the `piedmontmakers/piedmontmakers.org` repo — ask Ben).
3. Open the `piedmontmakers/piedmontmakers.org` repository.
4. Type what you want changed (see example prompts below). Claude edits the site in the cloud and shows you what it did.

One caution for web sessions: depending on how the session ends, your change may land directly on the live site or arrive as a "pull request" that Ben has to approve before it goes live. If Claude mentions a branch or a pull request at the end, tell Ben so your work doesn't sit unnoticed. <!-- TODO(Phase 7): after Ben's validation session, replace this paragraph with the confirmed behavior. -->

## Claude Code on your own computer

One-time setup (15 minutes, mostly waiting on installers):

1. **GitHub account** with write access to the repo — ask Ben.
2. **Install git**: on a Mac, open Terminal (Cmd+Space, type "Terminal") and run `git --version`; macOS offers to install it if missing.
3. **Install Node.js**: download the LTS installer from [nodejs.org](https://nodejs.org) (version 20 or newer).
4. **Install jq** (used by the repo's safety checks): `brew install jq` if you have Homebrew, or download from [jqlang.github.io/jq](https://jqlang.github.io/jq/).
5. **Install Claude Code**: follow [the install instructions](https://claude.com/claude-code), then run `claude` once to sign in.
6. **Get the site** — paste these into Terminal one line at a time:

   ```
   git clone https://github.com/piedmontmakers/piedmontmakers.org.git
   cd piedmontmakers.org
   npm ci
   ```

Every editing session after that is just:

```
cd piedmontmakers.org
claude
```

When Claude asks whether to trust the folder the first time, say yes — the repo's project instructions and safety hooks are what make it behave well here.

## Example prompts

Talk to Claude the way you'd brief a helpful colleague. Real examples that work:

- "Add an event to the calendar: FLL scrimmage at Havens Elementary on March 14 from 10am to 2pm. Registration link is https://…"
- "The FTC league meet on Nov 8 moved to 1pm. Update the calendar."
- "Update the robotics page: LEGO League Challenge registration is now open, the link is https://go.teamsnap.com/…"
- "Add Jane Doe to the board roster as VP, Popup Maker Spaces."
- "Fix the typo on the About Us page — 'engneering' should be 'engineering'."
- "Write a blog post about last weekend's tournament. Here are three photos and my notes: …"

Claude will make the edit, run the site's checks, show you what changed, commit it with your name, and push it live. Saying yes to its routine confirmations is normal.

**The exception:** if Claude warns that a file is "red-zone" or "changes the site's design/architecture," that's the guardrail for things like brand colors, the navigation bar, and the deploy machinery. Say no unless changing that was genuinely the point of your request, and loop in Ben.

## After you push

- The change is live at [piedmontmakers.org](https://piedmontmakers.org) in about a minute. Hard-refresh (Cmd+Shift+R) if you don't see it.
- The Slack channel shows your commit and the deploy status.
- A red ✗ on the deploy means the checks caught a problem and **nothing shipped** — the old site is still up. Paste the error to Claude ("the deploy failed, here's the log — fix it") or tell Ben. A green ✓ means you're live.

## Made a mistake?

Don't panic, and don't try to fix it by force. Every version of the site is saved.

- Tell Claude: **"Revert my last change and push."** It will restore the previous version and deploy it.
- Or message Ben with roughly what you changed and when.

## Rules Claude already knows (so you don't have to)

The repo carries instructions ([AGENTS.md](../AGENTS.md)) that Claude reads at the start of every session: the site's voice and audience, brand rules, which files are safe to edit, always pulling the latest version before starting, committing with clear messages, and pushing right after committing. You don't need to memorize any of it — but if Claude seems to be going against something you read there, trust the file and say so.
