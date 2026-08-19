#!/bin/bash
set -euo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-${PWD}}"
cd "$project_dir" 2>/dev/null || exit 0

# Claude Code web sessions may start on a harness branch. Local sessions keep
# their current branch and configuration untouched.
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
