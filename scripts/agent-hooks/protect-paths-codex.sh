#!/bin/bash
# Codex adapter for red-zone file protection.
# Codex does not currently support PreToolUse permissionDecision "ask", so an
# unapproved edit is denied. Maintainers can opt out with PM_MAINTAINER=1 or a
# gitignored .agent-maintainer marker at the repository root.

set -uo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd -P)"
# shellcheck source=red-zone-paths.sh
source "$script_dir/red-zone-paths.sh"

payload="$(read_hook_payload)"
[ -z "$payload" ] && exit 0

root="$(hook_repo_root "$payload")"
hook_maintainer_bypass "$root" && exit 0

if ! command -v jq >/dev/null 2>&1; then
  echo "BLOCKED: jq is required to inspect Codex patches for red-zone files. Install jq and retry." >&2
  exit 2
fi

paths="$(codex_patch_paths "$payload")"
[ -z "$paths" ] && exit 0

while IFS= read -r path; do
  [ -z "$path" ] && continue
  rel="$(hook_relative_path "$root" "$path")"

  if is_red_zone_path "$rel"; then
    printf 'BLOCKED: %s\n' "$(red_zone_reason "$rel")" >&2
    exit 2
  fi
done <<< "$paths"

exit 0
