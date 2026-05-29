#!/bin/bash
# Block accidental branch creation/switching in agent sessions.
# The repo workflow is direct commits to main unless the user explicitly asks for a branch.

set -euo pipefail

payload="${TOOL_INPUT:-}"
if [ -z "$payload" ] && [ ! -t 0 ]; then
  payload="$(cat)"
fi

[ -z "$payload" ] && exit 0

cmd="$(printf '%s' "$payload" | jq -r '.tool_input.command // .tool_input.cmd // .command // .cmd // .input.command // .input.cmd // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

if echo "$cmd" | grep -qE '(^|[[:space:]])git[[:space:]]+(checkout[[:space:]]+-b|switch[[:space:]]+(-c|--create)|branch[[:space:]]+[^-])'; then
  echo "BLOCKED: This repo commits directly to main. Do not create branches. See AGENTS.md." >&2
  exit 2
fi

if echo "$cmd" | grep -qE '(^|[[:space:]])git[[:space:]]+switch[[:space:]]+[^-]'; then
  target="$(echo "$cmd" | grep -oE 'git[[:space:]]+switch[[:space:]]+[^[:space:]]+' | awk '{print $3}' | tail -1)"
  if [ -n "$target" ] && [ "$target" != "main" ]; then
    echo "BLOCKED: This repo commits directly to main. Do not switch to branch '$target'. See AGENTS.md." >&2
    exit 2
  fi
fi

if echo "$cmd" | grep -qE '(^|[[:space:]])git[[:space:]]+checkout[[:space:]]+[^-]'; then
  target="$(echo "$cmd" | grep -oE 'git[[:space:]]+checkout[[:space:]]+[^[:space:]]+' | awk '{print $3}' | tail -1)"
  if [ -n "$target" ] && [ "$target" != "main" ]; then
    if git rev-parse --verify --quiet "$target" >/dev/null || git rev-parse --verify --quiet "refs/heads/$target" >/dev/null || git rev-parse --verify --quiet "refs/remotes/origin/$target" >/dev/null; then
      echo "BLOCKED: This repo commits directly to main. Do not switch to branch '$target'. See AGENTS.md." >&2
      exit 2
    fi
  fi
fi

exit 0
