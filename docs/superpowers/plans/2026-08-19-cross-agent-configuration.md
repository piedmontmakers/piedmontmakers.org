# Cross-Agent Configuration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repository's instructions, hooks, skills, and onboarding work predictably in Claude Code and Codex.

**Architecture:** Keep `AGENTS.md` as the compact canonical policy and route detailed procedures to `docs/agent/`. Preserve separate client manifests, with shared shell helpers and client-specific red-zone decisions. Store portable skills under `.agents/skills` and expose them to Claude through relative symlinks.

**Tech Stack:** Markdown, JSON, TOML, POSIX-oriented Bash, `jq`, Git, Astro 5, npm

**Spec:** `docs/superpowers/specs/2026-08-19-cross-agent-configuration-design.md`

## Global Constraints

- Work directly on `main` because Ben explicitly approved the repository's direct-to-`main` workflow.
- Push each atomic commit immediately.
- Keep Claude's `permissionDecision: "ask"` behavior for red-zone edits.
- Deny unapproved Codex red-zone patches because Codex does not support `PreToolUse` `"ask"` decisions.
- Keep `AGENTS.md` below 28 KiB and retain safety, voice, verification, and git rules there.
- Do not add package dependencies or modify the Astro application.
- Stage explicit paths only.

---

### Task 1: Compact canonical instructions

**Files:**
- Create: `docs/agent/site-reference.md`
- Create: `docs/agent/content-recipes.md`
- Create: `docs/agent/posthog.md`
- Create: `.codex/config.toml`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: the approved design and all existing guidance in `AGENTS.md`
- Produces: an always-loaded policy under 28 KiB plus routed references containing every moved instruction

- [ ] **Step 1: Extract detailed reference material without changing its meaning**

Move the file map, component implementation notes, external-service table, facility addresses, open page follow-ups, content recipes, and complete PostHog event table into the three `docs/agent/` files. Keep task-routing summaries in `AGENTS.md`.

- [ ] **Step 2: Make the critical workflow host-aware**

Replace the claim that project instructions outrank system instructions with this policy: direct commits to `main` are the repository default; a host-mandated branch or detached worktree must be reported with the required handoff rather than bypassed or rewritten.

- [ ] **Step 3: Add the Codex size fallback**

Create `.codex/config.toml` containing:

```toml
project_doc_max_bytes = 65536
```

- [ ] **Step 4: Verify instruction coverage and size**

Run:

```bash
wc -c AGENTS.md
rg -n "Edit zones|Voice|Donor-amount|Accessibility|Commit directly|Push immediately|npm run check|docs/agent" AGENTS.md
git diff --check
```

Expected: `AGENTS.md` is below 28,672 bytes, every critical heading is present, routed references are linked, and `git diff --check` exits 0.

- [ ] **Step 5: Commit and push**

```bash
git add AGENTS.md .codex/config.toml docs/agent/site-reference.md docs/agent/content-recipes.md docs/agent/posthog.md
git commit -m "Repo: compact cross-agent instructions" -m "Keep critical policy within Codex's default instruction budget, move detailed procedures into routed references, and add a project-level size fallback."
git push origin main
```

### Task 2: Add portable hook contracts

**Files:**
- Create: `scripts/agent-hooks/test-hooks.sh`
- Create: `scripts/agent-hooks/red-zone-paths.sh`
- Create: `scripts/agent-hooks/protect-paths-codex.sh`
- Create: `scripts/agent-hooks/session-start-claude.sh`
- Modify: `scripts/agent-hooks/protect-paths.sh`
- Modify: `scripts/agent-hooks/block-branch.sh`
- Modify: `.claude/settings.json`
- Modify: `.codex/hooks.json`
- Modify: `.gitignore`
- Delete: `scripts/agent-hooks/session-start.sh`

**Interfaces:**
- Consumes: Claude `Edit` payloads with `tool_input.file_path`, Codex `apply_patch` payloads with `tool_input.command`, and Bash payloads with `tool_input.command`
- Produces: `is_red_zone_path`, `hook_repo_root`, and `codex_patch_paths` shell functions; Claude ask decisions; Codex deny decisions; branch denials by exit code 2

- [ ] **Step 1: Write the failing contract test**

Create `scripts/agent-hooks/test-hooks.sh` with isolated payload fixtures and assertions for:

```text
Claude Edit of AGENTS.md -> exit 0 and permissionDecision ask
Claude Edit of src/data/stats.ts -> exit 0 and no output
Codex patch of AGENTS.md -> exit 2 with a red-zone explanation
Codex multi-file patch containing Nav.astro -> exit 2
Codex patch of src/data/stats.ts -> exit 0
PM_MAINTAINER=1 -> red-zone edit exits 0
.agent-maintainer marker -> red-zone edit exits 0
git switch -c, git checkout -B, git switch --orphan, and git worktree add -b -> exit 2
git checkout src/data/stats.ts -> exit 0
payload cwd in src/pages -> repository root still resolves
```

- [ ] **Step 2: Run the test and observe the expected failure**

Run:

```bash
bash scripts/agent-hooks/test-hooks.sh
```

Expected: FAIL because `protect-paths-codex.sh` and the shared red-zone helper do not exist.

- [ ] **Step 3: Implement the shared helper and adapters**

`red-zone-paths.sh` must normalize absolute and relative paths, resolve the Git root from the payload `cwd`, recognize the complete red-zone list, parse every Codex patch header, and honor `PM_MAINTAINER=1` or `<repo>/.agent-maintainer`.

`protect-paths.sh` must keep Claude's ask JSON. `protect-paths-codex.sh` must write the reason to stderr and exit 2. Both adapters must check every supplied path.

- [ ] **Step 4: Make startup and manifests client-specific**

Rename the existing startup behavior to `session-start-claude.sh`, retain only Claude web branch correction, and remove dependency installation. Point Claude at that script. Remove Codex's empty startup hook. Resolve Codex hook scripts through `$(git rev-parse --show-toplevel)` and use the canonical `Bash` and `apply_patch` matchers.

Add `.agent-maintainer` to `.gitignore`.

- [ ] **Step 5: Run hook tests until green**

Run:

```bash
bash scripts/agent-hooks/test-hooks.sh
jq empty .claude/settings.json .codex/hooks.json
git diff --check
```

Expected: all contract cases print `ok`, both manifests parse, and the diff check exits 0.

- [ ] **Step 6: Commit and push**

```bash
git add .gitignore .claude/settings.json .codex/hooks.json scripts/agent-hooks/block-branch.sh scripts/agent-hooks/protect-paths.sh scripts/agent-hooks/protect-paths-codex.sh scripts/agent-hooks/red-zone-paths.sh scripts/agent-hooks/session-start-claude.sh scripts/agent-hooks/session-start.sh scripts/agent-hooks/test-hooks.sh
git commit -m "Hooks: support Claude and Codex contracts" -m "Preserve Claude confirmation prompts, deny unapproved Codex patches, resolve hooks from nested directories, and cover both payload formats with executable contract tests."
git push origin main
```

### Task 3: Commit portable project skills

**Files:**
- Create: `.agents/skills/web-verify/SKILL.md`
- Create: `.agents/skills/project-bootstrap/SKILL.md`
- Create symlink: `.claude/skills/web-verify`
- Create symlink: `.claude/skills/project-bootstrap`
- Modify: `.gitignore`
- Delete: `.claude/commands/web-verify.md`
- Remove local ignored copies: `.agents/skills/integration-astro-static`, `.claude/skills/integration-astro-static`

**Interfaces:**
- Consumes: Agent Skills `SKILL.md` discovery in Codex and symlink discovery in Claude
- Produces: `/web-verify` and `/project-bootstrap` with the same canonical instructions in both clients

- [ ] **Step 1: Narrow skill ignore rules**

Ignore untracked skill caches by default while explicitly allowing the two canonical `.agents` skill directories and two Claude symlinks.

- [ ] **Step 2: Write the two standard skills**

Use only standard `name`, `description`, and `compatibility` frontmatter. `web-verify` must detect linked worktrees through `git rev-parse --git-dir` and `--git-common-dir`, reuse a matching Astro server, choose the available browser tool, audit 390x844 mobile behavior, check accessibility, inspect errors, and run `npm run check` plus `npm run build`.

`project-bootstrap` must run `npm ci --include=optional` only when `node_modules/.package-lock.json` is absent, then report the Node and npm versions.

- [ ] **Step 3: Expose canonical skills to Claude**

Create relative symlinks:

```text
.claude/skills/web-verify -> ../../.agents/skills/web-verify
.claude/skills/project-bootstrap -> ../../.agents/skills/project-bootstrap
```

Remove the legacy command after the new Claude skill resolves correctly. Move the ignored PostHog skill copies to a temporary backup before deleting the originals from the repository workspace.

- [ ] **Step 4: Verify discovery artifacts**

Run:

```bash
test -f .agents/skills/web-verify/SKILL.md
test -f .agents/skills/project-bootstrap/SKILL.md
test "$(readlink .claude/skills/web-verify)" = "../../.agents/skills/web-verify"
test "$(readlink .claude/skills/project-bootstrap)" = "../../.agents/skills/project-bootstrap"
git check-ignore .agents/skills/web-verify/SKILL.md && exit 1 || true
git diff --check
```

Expected: both canonical files and symlinks resolve, tracked skills are not ignored, and the diff check exits 0.

- [ ] **Step 5: Commit and push**

```bash
git add .gitignore .agents/skills/web-verify/SKILL.md .agents/skills/project-bootstrap/SKILL.md .claude/skills/web-verify .claude/skills/project-bootstrap .claude/commands/web-verify.md
git commit -m "Repo: share project skills across agents" -m "Make browser verification and dependency bootstrap available to Codex and Claude from one canonical Agent Skills source."
git push origin main
```

### Task 4: Update contributor onboarding

**Files:**
- Modify: `README.md`
- Modify: `docs/editing-guide.md`
- Modify: `posthog-setup-report.md`

**Interfaces:**
- Consumes: the implemented instruction, hook, and skill behavior
- Produces: accurate setup guidance for Claude Code and Codex users

- [ ] **Step 1: Correct README behavior claims**

Document both clients' `/hooks` inspection, trusted project hooks, the `.agent-maintainer` bypass, canonical skill layout, explicit bootstrap behavior, and the difference between Claude ask prompts and Codex denials.

- [ ] **Step 2: Make the novice guide client-neutral**

Rename its title and shared prose to AI coding agents. Keep the detailed Claude web path and add a Codex local/app path. State that host-managed branches may require a handoff and that the agent must say when a commit has not reached `main`.

- [ ] **Step 3: Remove the stale PostHog skill claim**

Replace the report's `.claude/skills/integration-astro-static` statement with a pointer to `docs/agent/posthog.md` and the current repository instructions.

- [ ] **Step 4: Verify documentation consistency**

Run:

```bash
rg -n "Claude Code|Codex|/hooks|agent-maintainer|project-bootstrap|web-verify" README.md docs/editing-guide.md
rg -n "integration-astro-static" README.md AGENTS.md docs posthog-setup-report.md && exit 1 || true
git diff --check
```

Expected: both clients and shared guardrails are documented, the stale skill name is absent, and the diff check exits 0.

- [ ] **Step 5: Commit and push**

```bash
git add README.md docs/editing-guide.md posthog-setup-report.md
git commit -m "Docs: explain Claude and Codex workflows" -m "Update contributor setup, hook behavior, maintainer bypass, portable skills, and managed-environment handoffs for both supported agents."
git push origin main
```

### Task 5: Full verification and review

**Files:**
- Modify only files that need a verified correction

**Interfaces:**
- Consumes: all prior task outputs
- Produces: a clean main branch whose agent infrastructure and Astro site checks pass

- [ ] **Step 1: Run agent infrastructure verification**

```bash
bash scripts/agent-hooks/test-hooks.sh
jq empty .claude/settings.json .codex/hooks.json
test "$(wc -c < AGENTS.md)" -lt 28672
```

- [ ] **Step 2: Run site verification**

```bash
npm run check
npm run build
```

- [ ] **Step 3: Review repository state**

```bash
git status --short --branch
git log --oneline -6
git diff HEAD~4..HEAD --check
```

Expected: every command exits 0, no uncommitted files remain, and the atomic commits appear on `main`.
