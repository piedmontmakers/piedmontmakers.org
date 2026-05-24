#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web — local sessions keep their branch/state.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Attribute commits to the session user instead of the harness default
# (Claude <noreply@anthropic.com>). Scoped to this repo via `git config`
# (no --global). Uses CLAUDE_CODE_USER_EMAIL, which the web harness sets
# to the signed-in Anthropic account's email — when that email is also
# verified on the user's GitHub account (github.com/settings/emails),
# GitHub auto-links the commit to that account (avatar + contributor
# graph). The display name falls back to the email local-part since the
# harness's global user.name is the generic "Claude".
if [ -n "${CLAUDE_CODE_USER_EMAIL:-}" ]; then
  git config user.email "$CLAUDE_CODE_USER_EMAIL"
  git config user.name "${CLAUDE_CODE_USER_EMAIL%@*}"
fi

# Bypass the harness-assigned claude/* branch. Per CLAUDE.md this project
# commits directly to main; switch over before the agent loop starts so we
# never edit on the throwaway branch.
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" == claude/* ]]; then
  git fetch origin main
  git checkout main
  git pull --ff-only origin main
fi

# Install npm deps. Use `npm ci` (not `npm install`) so the
# @rolldown/binding-* optional deps stay locked from package-lock.json —
# `npm install` is known to drop them and break the Astro build on this
# project (see CLAUDE.md "Known gotchas"). Skip if node_modules already
# present from a cached container snapshot.
if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
  npm ci --include=optional
fi
