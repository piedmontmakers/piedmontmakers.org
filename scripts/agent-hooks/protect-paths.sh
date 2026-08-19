#!/bin/bash
# Ask-before-edit guard for red-zone files (site-wide design/architecture).
# Emits a PreToolUse "ask" decision so the person driving the session gets a
# confirmation prompt before Edit/Write touches one of these files. Soft
# guardrail by design: approving the prompt proceeds normally.
#
# The red-zone list below must stay in sync with the "Edit zones" section of
# AGENTS.md.
#
# Maintainer bypass: PM_MAINTAINER=1 skips the prompt entirely. Set it in the
# gitignored .claude/settings.local.json:  { "env": { "PM_MAINTAINER": "1" } }

set -uo pipefail

[ "${PM_MAINTAINER:-}" = "1" ] && exit 0

payload="${TOOL_INPUT:-}"
if [ -z "$payload" ] && [ ! -t 0 ]; then
  payload="$(cat)"
fi
[ -z "$payload" ] && exit 0

if command -v jq >/dev/null 2>&1; then
  fp="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null || true)"
else
  fp="$(printf '%s' "$payload" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*:[[:space:]]*"//; s/"$//')"
fi
[ -z "$fp" ] && exit 0

root="${CLAUDE_PROJECT_DIR:-${CODEX_WORKSPACE:-$PWD}}"
rel="${fp#"$root"/}"

case "$rel" in
  src/styles/global.css|\
  src/components/Nav.astro|\
  src/layouts/BaseLayout.astro|\
  astro.config.mjs|\
  package.json|package-lock.json|\
  src/content.config.ts|\
  .github/workflows/*|\
  public/admin/*|\
  scripts/agent-hooks/*|\
  .claude/settings.json|.codex/hooks.json|\
  CLAUDE.md|AGENTS.md)
    reason="$rel is a red-zone file: it shapes the whole site's design or architecture, and a push to main goes live with no review. Approve only if changing this file was the goal of your request. If you weren't expecting this, say no and check with Ben first. See 'Edit zones' in AGENTS.md."
    if command -v jq >/dev/null 2>&1; then
      jq -cn --arg reason "$reason" \
        '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:$reason}}'
    else
      printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}\n' "$reason"
    fi
    ;;
esac

exit 0
