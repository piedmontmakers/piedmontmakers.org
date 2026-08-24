#!/bin/bash

# Shared payload and path helpers for Claude Code and Codex edit guards.

read_hook_payload() {
  local payload="${TOOL_INPUT:-}"

  if [ -z "$payload" ] && [ ! -t 0 ]; then
    payload="$(cat)"
  fi

  printf '%s' "$payload"
}

payload_cwd() {
  local payload="$1"

  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$payload" | jq -r '.cwd // empty' 2>/dev/null || true
  fi
}

hook_repo_root() {
  local payload="$1"
  local cwd root

  cwd="$(payload_cwd "$payload")"
  [ -z "$cwd" ] && cwd="${CLAUDE_PROJECT_DIR:-${CODEX_WORKSPACE:-$PWD}}"

  root="$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null || true)"
  if [ -n "$root" ]; then
    (cd "$root" && pwd -P)
    return
  fi

  (cd "$cwd" 2>/dev/null && pwd -P) || printf '%s' "$cwd"
}

hook_maintainer_bypass() {
  local root="$1"

  [ "${PM_MAINTAINER:-}" = "1" ] || [ -f "$root/.agent-maintainer" ]
}

# Collapse "." and ".." segments lexically so traversal through directories
# that do not exist on disk (where cd-based normalization can't help) still
# resolves before red-zone matching. Input must be absolute.
lexical_collapse() {
  local input="$1" out="" seg rest
  rest="${input#/}"
  while [ -n "$rest" ]; do
    seg="${rest%%/*}"
    if [ "$seg" = "$rest" ]; then rest=""; else rest="${rest#*/}"; fi
    case "$seg" in
      ''|'.') ;;
      '..') out="${out%/*}" ;;
      *) out="$out/$seg" ;;
    esac
  done
  printf '/%s' "${out#/}"
}

hook_relative_path() {
  local root="$1"
  local path="$2"
  local full_path parent basename normalized_parent

  path="${path#./}"
  case "$path" in
    /*) full_path="$path" ;;
    *) full_path="$root/$path" ;;
  esac

  full_path="$(lexical_collapse "$full_path")"

  parent="${full_path%/*}"
  basename="${full_path##*/}"
  normalized_parent="$(cd "$parent" 2>/dev/null && pwd -P || true)"
  if [ -n "$normalized_parent" ]; then
    full_path="$normalized_parent/$basename"
  fi

  case "$full_path" in
    "$root") printf '.' ;;
    "$root"/*) printf '%s' "${full_path#"$root"/}" ;;
    *) printf '%s' "$full_path" ;;
  esac
}

# Matching is case-insensitive (patterns below are lowercase): macOS APFS is
# case-insensitive, so agents.md and Package.json open the red-zone files.
is_red_zone_path() {
  local lowered
  lowered="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

  case "$lowered" in
    src/styles/global.css|\
    src/components/nav.astro|\
    src/components/footer.astro|\
    src/layouts/baselayout.astro|\
    astro.config.mjs|\
    package.json|package-lock.json|\
    src/content.config.ts|\
    .github/workflows/*|\
    public/admin/*|\
    scripts/agent-hooks/*|\
    .claude/settings.json|.mcp.json|\
    .codex/hooks.json|.codex/config.toml|\
    .agents/skills/*|.claude/skills/*|\
    claude.md|agents.md)
      return 0
      ;;
  esac

  return 1
}

red_zone_reason() {
  printf "%s is a red-zone file: it shapes the site's design or agent architecture, and a push to main goes live with no review. Proceed only when changing this file was the user's explicit goal. If it was not expected, stop and check with an admin. See 'Edit zones' in AGENTS.md." "$1"
}

claude_edit_paths() {
  local payload="$1"

  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$payload" | jq -r '
      [
        .tool_input.file_path?,
        .tool_input.path?,
        (.tool_input.edits[]?.file_path?)
      ]
      | .[]
      | select(type == "string" and length > 0)
    ' 2>/dev/null || true
    return
  fi

  printf '%s' "$payload" \
    | grep -oE '"(file_path|path)"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | sed -E 's/^[^:]*:[[:space:]]*"//; s/"$//' \
    || true
}

codex_patch_paths() {
  local payload="$1"
  local command

  if ! command -v jq >/dev/null 2>&1; then
    return 2
  fi

  command="$(printf '%s' "$payload" | jq -r '.tool_input.command // empty' 2>/dev/null || true)"
  [ -z "$command" ] && return 0

  printf '%s\n' "$command" \
    | sed -nE 's/^\*\*\* (Add|Update|Delete) File: (.*)$/\2/p; s/^\*\*\* Move to: (.*)$/\1/p'
}
