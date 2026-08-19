---
name: web-verify
description: Use when a change touches frontend pages, components, styles, assets, interactions, responsive behavior, or accessibility and needs browser verification before completion.
---

# Verify Frontend Changes

Use this workflow after changing a page, component, style, or asset. Do not replace browser verification with source inspection when a browser-control capability is available.

## 1. Identify the checkout and server

Resolve the repository and Git metadata:

```bash
repo_root="$(git rev-parse --show-toplevel)"
git_dir="$(cd "$(git rev-parse --git-dir)" && pwd -P)"
git_common="$(cd "$(git rev-parse --git-common-dir)" && pwd -P)"
```

If `git_dir` differs from `git_common`, the checkout is a linked worktree and must use its own Astro server. Never assume port 4321 belongs to the current checkout.

Inspect running Astro processes and their working directories with `ps`, `pgrep`, or `lsof`, depending on what the environment permits. Reuse a server only when its working directory matches `repo_root`. Do not kill a server another maintainer may be using.

If dependencies are missing, follow the `project-bootstrap` skill before starting the server.

When no matching server exists, start one for this checkout. Use port 4321 in the primary checkout when free; use an available port from 4322 upward for a linked worktree. Write its log under `/tmp`, include the port and process ID in the filename, and wait until Astro reports that it is ready.

The local site base is `/piedmontmakers.org/`, so a page path uses:

```text
http://localhost:<port>/piedmontmakers.org/<path>
```

## 2. Use the available browser capability

Inspect the tools exposed by the current client and use its browser-control capability. Claude Code may expose a Chrome MCP tool. Codex may expose in-app browser control. Follow the installed browser skill when one is present.

If no browser tool is available, use `curl -fsS` to confirm the page responds and report that visual and interaction checks could not be completed. Do not describe those checks as passing.

## 3. Exercise the changed behavior

- Load every changed page and capture a screenshot when the client supports it.
- Click changed links, buttons, disclosure controls, and form actions.
- Resize to 390 by 844 pixels and check composition, source order, overflow, and touch targets.
- Use keyboard navigation for new interactive elements and confirm the focus indicator is visible.
- Check new images for useful alt text and icon-only controls for accessible names.
- Inspect the browser console and the matching Astro server log for errors or warnings.

## 4. Run repository verification

Run both commands from `repo_root`:

```bash
npm run check
npm run build
```

Report the URL and viewport tested, interactions exercised, console or log findings, and both command results. State any browser limitation explicitly.
