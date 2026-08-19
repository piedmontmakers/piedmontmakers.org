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

# Bootstrap dependencies on fresh clones and web sessions. Without this, the
# first failing build tempts a plain `npm install`, which drops the
# @rolldown/binding-* optional deps (see Known gotchas). The project-bootstrap
# skill remains the deeper repair path.
if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  npm ci --include=optional >/dev/null 2>&1 \
    || echo "session-start: npm ci failed — run the project-bootstrap skill before building." >&2
fi
