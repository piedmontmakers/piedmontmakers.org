#!/bin/bash
set -euo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-${CODEX_WORKSPACE:-${PWD}}}"
cd "$project_dir" 2>/dev/null || exit 0

# Claude Code web sessions may start on a harness branch. Local sessions keep
# their current branch and config untouched.
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  if [ -n "${CLAUDE_CODE_USER_EMAIL:-}" ]; then
    git config user.email "$CLAUDE_CODE_USER_EMAIL"
    git config user.name "${CLAUDE_CODE_USER_EMAIL%@*}"
  fi

  current_branch="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$current_branch" == claude/* ]]; then
    git fetch origin main
    git checkout main
    git pull --ff-only origin main
  fi
fi

# Keep optional native deps locked from package-lock.json. This is intentionally
# a no-op when dependencies are already present.
if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  npm ci --include=optional
fi
