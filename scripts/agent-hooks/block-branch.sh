#!/bin/bash
# Block accidental branch creation/switching in agent sessions.
# The repo workflow is direct commits to main unless the user explicitly asks for a branch.

set -euo pipefail

payload="${TOOL_INPUT:-}"
if [ -z "$payload" ] && [ ! -t 0 ]; then
  payload="$(cat)"
fi

[ -z "$payload" ] && exit 0

# One creation alternation shared by the jq and no-jq paths so policy cannot
# differ by machine. Shapes covered:
#   checkout/switch with a creation flag anywhere among leading options
#     (git checkout -q -b x, git switch --orphan x)
#   worktree add, stash branch
#   branch <name>, including rename/copy/track/force flags (-m -M -c -C -t -f)
# Deliberately allowed: git branch (bare/-a/-v/--show-current), git branch -d/-D
# (needed for stray-branch cleanup), pipes and redirections after git branch
# (the name token must not start with '-', a digit, or a shell metacharacter,
# so "git branch | grep x" and "git branch 2>/dev/null" pass).
opt_flags='(-[^[:space:]]+[[:space:]]+)*'
name_tok='[^-0-9|&;<>[:space:]][^|&;<>[:space:]]*'
create_core="(checkout[[:space:]]+${opt_flags}(-b|-B|--orphan)([[:space:]]|\$)|switch[[:space:]]+${opt_flags}(-c|-C|--create|--orphan)([[:space:]]|\$)|worktree[[:space:]]+add|stash[[:space:]]+branch|branch[[:space:]]+((-m|-M|-c|-C|-t|-f|--move|--copy|--track|--force)[[:space:]]+)*${name_tok})"

if ! command -v jq >/dev/null 2>&1; then
  # jq missing: we can't parse the command out of the payload, but branch
  # creation is still detectable in the raw JSON. Block that; allow the rest
  # rather than degrading to allow-everything silently.
  if printf '%s' "$payload" | grep -qE "(^|[;&|[:space:]\"])([^[:space:]\"]*/)?git[[:space:]]+${create_core}"; then
    echo "BLOCKED: This repo commits directly to main. Do not create branches. See AGENTS.md." >&2
    exit 2
  fi
  exit 0
fi

cmd="$(printf '%s' "$payload" | jq -r '.tool_input.command // .tool_input.cmd // .command // .cmd // .input.command // .input.cmd // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

# Normalize so every later check sees a plain "git <subcommand> ...":
# strip a path prefix (/usr/bin/git) and global options with or without
# arguments (git -C <dir> switch x, git -c k=v checkout -b x).
cmd="$(printf '%s' "$cmd" | sed -E \
  -e 's#(^|[;&|[:space:]])[^[:space:]]*/git([[:space:]])#\1git\2#g' \
  -e 's#(^|[;&|[:space:]])git[[:space:]]+(((-C|-c)[[:space:]]+[^[:space:]]+|--[[:alnum:]-]+(=[^[:space:]]*)?|-[[:alnum:]])[[:space:]]+)*#\1git #g')"

git_prefix='(^|[;&|[:space:]])git[[:space:]]+'

if echo "$cmd" | grep -qE "${git_prefix}${create_core}"; then
  echo "BLOCKED: This repo commits directly to main. Do not create branches. See AGENTS.md." >&2
  exit 2
fi

if echo "$cmd" | grep -qE "${git_prefix}switch[[:space:]]"; then
  target="$(echo "$cmd" | grep -oE "git[[:space:]]+switch[[:space:]]+${opt_flags}[^[:space:]]+" | awk '{print $NF}' | tail -1)"
  if [ -n "$target" ] && [ "$target" != "main" ] && [ "${target#-}" = "$target" ]; then
    echo "BLOCKED: This repo commits directly to main. Do not switch to branch '$target'. See AGENTS.md." >&2
    exit 2
  fi
fi

if echo "$cmd" | grep -qE "${git_prefix}checkout[[:space:]]"; then
  target="$(echo "$cmd" | grep -oE "git[[:space:]]+checkout[[:space:]]+${opt_flags}[^[:space:]]+" | awk '{print $NF}' | tail -1)"
  if [ -n "$target" ] && [ "$target" != "main" ] && [ "${target#-}" = "$target" ]; then
    if git rev-parse --verify --quiet "$target" >/dev/null || git rev-parse --verify --quiet "refs/heads/$target" >/dev/null || git rev-parse --verify --quiet "refs/remotes/origin/$target" >/dev/null; then
      echo "BLOCKED: This repo commits directly to main. Do not switch to branch '$target'. See AGENTS.md." >&2
      exit 2
    fi
  fi
fi

exit 0
