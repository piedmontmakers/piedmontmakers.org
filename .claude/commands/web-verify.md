---
name: web-verify
description: Use this skill to verify front-end changes by actually loading the site in a real browser. Use it aggressively any time you touch a page, component, style, or asset.
---

1. Figure out which dev server to verify against — **a worktree must run its own server, not the primary checkout's**:
   - First check `pwd` + `git worktree list`. If the current directory is a worktree (path contains `/.claude/worktrees/`), the dev server on default port 4321 is almost certainly serving the primary checkout's files — it will NOT see your worktree changes.
   - List running Astro servers and their working directories: `ps -o pid,cwd,command -p $(pgrep -f "astro dev") 2>/dev/null` (or `lsof -p <pid> -d cwd` per pid). Match `cwd` to the current worktree.
   - **In the primary checkout** with a server already running for this directory: reuse it. Find its port from `lsof -iTCP -sTCP:LISTEN -P | grep node` (default 4321). Do NOT kill it — another maintainer may be previewing changes live via HMR.
   - **In a worktree**, or if no server matches this directory: start a worktree-local server on a non-4321 port: `NODE_OPTIONS=--max-http-header-size=65536 npm run dev -- --port 4322 > /tmp/pm-dev-worktree.log 2>&1 &` and wait for "ready" in the log. Pick a different port per worktree if multiple are active.
   - Heads up: a worktree-local dev server will emit a Vite `serving allow list` warning because `node_modules` lives in the primary checkout. It's harmless — pages still load and `npm run build` is unaffected. Only treat it as a blocker if a real asset 404s.
2. Open the relevant page(s) via the claude-in-chrome MCP at `http://localhost:<port>/piedmontmakers.org/<path>` (locally the site is served under the `/piedmontmakers.org` base path).
3. Take a screenshot and read the page to confirm the change rendered as intended.
4. Test all relevant features of the code we've touched so far and $ARGUMENTS:
   - Click any CTAs/links that were changed.
   - Resize to 390×844 (iPhone 14) to audit mobile per CLAUDE.md.
   - Check `:focus-visible` keyboard nav if you added interactive elements.
   - Verify alt text / aria-labels on new images and icon-only links.
5. Check the browser console for errors and the dev-server log (`/tmp/pm-dev.log`) for build warnings; correlate any unexpected behavior with logging.
6. Run `npm run build` to confirm the production build also passes (catches schema/route errors HMR hides).

If you run into blockers, find a solution and update this skill for the future.
