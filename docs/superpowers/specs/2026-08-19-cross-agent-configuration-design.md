# Cross-Agent Configuration Design

## Goal

Make the repository behave consistently in Claude Code and Codex without weakening the existing direct-to-`main` workflow or Claude's red-zone confirmation prompt.

## Instruction architecture

`AGENTS.md` remains the canonical project instruction file. `CLAUDE.md` stays as a small import wrapper. The canonical file will remain below 28 KiB so it fits within Codex's default 32 KiB project-document allowance with room for surrounding instruction layers.

Long procedures and reference material will move to focused files under `docs/agent/`. `AGENTS.md` will contain a routing table that tells agents which reference to read for the task at hand. Safety rules, voice requirements, verification commands, and the git workflow remain in the always-loaded file.

A project-local `.codex/config.toml` will set `project_doc_max_bytes = 65536` as a fallback. The smaller `AGENTS.md` remains the primary portability measure.

## Hook architecture

Claude and Codex keep separate hook manifests. Both call shared shell code where their event contracts agree, while platform adapters handle different edit payloads and decisions.

- Claude file tools supply `tool_input.file_path`. Its adapter keeps the current `permissionDecision: "ask"` behavior.
- Codex `apply_patch` supplies a patch in `tool_input.command`. Its adapter extracts every add, update, and delete path from patch headers.
- Codex does not currently support `permissionDecision: "ask"`. Its adapter denies unapproved red-zone edits with a clear explanation rather than returning a failed decision that allows the edit to continue.
- `PM_MAINTAINER=1` remains supported. A gitignored `.agent-maintainer` marker provides the same local bypass without relying on a Claude-only settings file.
- Hook scripts resolve the repository root from the payload's `cwd` and Git, so starting either client in a subdirectory works.

Claude's remote-session branch correction moves into a Claude-specific startup script. Dependency installation leaves `SessionStart` and becomes an explicit project-bootstrap skill. This keeps read-only sessions fast and prevents startup hooks from requiring network access.

## Skills

Repository skills use the Agent Skills format. The canonical copy lives under `.agents/skills`, which Codex discovers. Claude receives relative symlinks under `.claude/skills` and continues to expose the same commands.

Two skills will be committed:

- `web-verify`: detects the current checkout or worktree, reuses the matching Astro server, uses the browser capability exposed by the current client, checks mobile and accessibility behavior, then runs the production build.
- `project-bootstrap`: installs locked optional dependencies only when they are missing.

The ignored PostHog wizard skill copies will be removed because they are stale, untracked, and produce machine-dependent behavior. Current PostHog conventions remain in the project instructions and agent reference.

## Documentation

The README and editing guide will describe Claude Code and Codex as supported clients. They will explain hook trust, `/hooks`, the platform-neutral maintainer marker, skill discovery, and the difference between the shared policy and client-specific adapters.

Claims about repository instructions overruling system or managed-environment requirements will be removed. The direct-to-`main` workflow remains the repository default; when a managed environment prevents it, the agent must report the required handoff instead of fighting the host.

## Testing

A shell contract test will feed representative payloads into the hooks and assert:

- Claude red-zone edits request confirmation.
- Codex red-zone patches are denied.
- Multi-file Codex patches are checked path by path.
- Non-red-zone edits proceed.
- The maintainer bypass works.
- Common branch-creation forms are blocked.
- Hooks resolve correctly from a nested working directory.

Final verification includes the hook contract test, `npm run check`, and `npm run build`.

## Commit boundaries

1. Record this approved design.
2. Compact the canonical instructions and add routed reference documents.
3. Add portable hooks and their contract tests.
4. Add canonical cross-platform skills and remove stale local skill copies.
5. Update contributor onboarding and stale PostHog documentation.
6. Apply any final verification fixes in a separate commit if needed.
