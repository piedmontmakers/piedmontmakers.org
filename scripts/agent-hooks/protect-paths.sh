#!/bin/bash
# Claude Code adapter for red-zone file confirmation.

set -uo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd -P)"
# shellcheck source=red-zone-paths.sh
source "$script_dir/red-zone-paths.sh"

payload="$(read_hook_payload)"
[ -z "$payload" ] && exit 0

root="$(hook_repo_root "$payload")"
hook_maintainer_bypass "$root" && exit 0

paths="$(claude_edit_paths "$payload")"
[ -z "$paths" ] && exit 0

while IFS= read -r path; do
  [ -z "$path" ] && continue
  rel="$(hook_relative_path "$root" "$path")"

  if is_red_zone_path "$rel"; then
    reason="$(red_zone_reason "$rel")"
    if command -v jq >/dev/null 2>&1; then
      jq -cn --arg reason "$reason" \
        '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:$reason}}'
    else
      escaped_reason="${reason//\\/\\\\}"
      escaped_reason="${escaped_reason//\"/\\\"}"
      printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}\n' "$escaped_reason"
    fi
    exit 0
  fi
done <<< "$paths"

exit 0
