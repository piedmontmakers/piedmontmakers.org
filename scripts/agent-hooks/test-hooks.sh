#!/bin/bash

set -uo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd -P)"
failures=0
marker="$repo_root/.agent-maintainer"
marker_backup=""

if [ -e "$marker" ]; then
  marker_backup="$(mktemp)"
  cp -p "$marker" "$marker_backup"
  rm -f "$marker"
fi

cleanup() {
  rm -f "$marker"
  if [ -n "$marker_backup" ]; then
    cp -p "$marker_backup" "$marker"
    rm -f "$marker_backup"
  fi
}
trap cleanup EXIT

record_failure() {
  printf 'not ok - %s: %s\n' "$1" "$2" >&2
  failures=$((failures + 1))
}

run_hook() {
  local workdir="$1"
  local script="$2"
  local payload="$3"
  local stdout_file="$4"
  local stderr_file="$5"
  local maintainer="${6:-0}"

  (
    cd "$workdir" || exit 99
    printf '%s' "$payload" | PM_MAINTAINER="$maintainer" bash "$script"
  ) >"$stdout_file" 2>"$stderr_file"
}

assert_hook() {
  local name="$1"
  local workdir="$2"
  local script="$3"
  local payload="$4"
  local expected_status="$5"
  local stdout_pattern="$6"
  local stderr_pattern="$7"
  local maintainer="${8:-0}"
  local stdout_file stderr_file hook_status

  stdout_file="$(mktemp)"
  stderr_file="$(mktemp)"

  run_hook "$workdir" "$script" "$payload" "$stdout_file" "$stderr_file" "$maintainer"
  hook_status=$?

  if [ "$hook_status" -ne "$expected_status" ]; then
    record_failure "$name" "expected exit $expected_status, got $hook_status"
  elif [ -n "$stdout_pattern" ] && ! grep -Fq "$stdout_pattern" "$stdout_file"; then
    record_failure "$name" "stdout did not contain: $stdout_pattern"
  elif [ -z "$stdout_pattern" ] && [ -s "$stdout_file" ]; then
    record_failure "$name" "expected empty stdout"
  elif [ -n "$stderr_pattern" ] && ! grep -Fq "$stderr_pattern" "$stderr_file"; then
    record_failure "$name" "stderr did not contain: $stderr_pattern"
  elif [ -z "$stderr_pattern" ] && [ -s "$stderr_file" ]; then
    record_failure "$name" "expected empty stderr"
  else
    printf 'ok - %s\n' "$name"
  fi

  rm -f "$stdout_file" "$stderr_file"
}

claude_red_payload="$(jq -cn --arg path "$repo_root/AGENTS.md" --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Edit",cwd:$cwd,tool_input:{file_path:$path}}')"
claude_footer_payload="$(jq -cn --arg path "$repo_root/src/components/Footer.astro" --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Edit",cwd:$cwd,tool_input:{file_path:$path}}')"
claude_green_payload="$(jq -cn --arg path "$repo_root/src/data/stats.ts" --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Edit",cwd:$cwd,tool_input:{file_path:$path}}')"
codex_red_payload="$(jq -cn --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"apply_patch",cwd:$cwd,tool_input:{command:"*** Begin Patch\n*** Update File: AGENTS.md\n@@\n-old\n+new\n*** End Patch"}}')"
codex_multi_payload="$(jq -cn --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"apply_patch",cwd:$cwd,tool_input:{command:"*** Begin Patch\n*** Update File: src/data/stats.ts\n@@\n-old\n+new\n*** Update File: src/components/Nav.astro\n@@\n-old\n+new\n*** End Patch"}}')"
codex_green_payload="$(jq -cn --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"apply_patch",cwd:$cwd,tool_input:{command:"*** Begin Patch\n*** Update File: src/data/stats.ts\n@@\n-old\n+new\n*** End Patch"}}')"
codex_traversal_payload="$(jq -cn --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"apply_patch",cwd:$cwd,tool_input:{command:"*** Begin Patch\n*** Update File: src/data/../../AGENTS.md\n@@\n-old\n+new\n*** End Patch"}}')"
nested_payload="$(jq -cn --arg path "$repo_root/AGENTS.md" --arg cwd "$repo_root/src/pages" '{hook_event_name:"PreToolUse",tool_name:"Edit",cwd:$cwd,tool_input:{file_path:$path}}')"

assert_hook "Claude asks before a red-zone edit" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths.sh" "$claude_red_payload" 0 '"permissionDecision":"ask"' ""
assert_hook "Claude allows a green-zone edit" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths.sh" "$claude_green_payload" 0 "" ""
assert_hook "Claude asks before editing the footer" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths.sh" "$claude_footer_payload" 0 '"permissionDecision":"ask"' ""
assert_hook "Codex denies a red-zone patch" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_red_payload" 2 "" "AGENTS.md is a red-zone file"
assert_hook "Codex checks every path in a patch" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_multi_payload" 2 "" "src/components/Nav.astro is a red-zone file"
assert_hook "Codex allows a green-zone patch" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_green_payload" 0 "" ""
assert_hook "Codex normalizes path traversal" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_traversal_payload" 2 "" "AGENTS.md is a red-zone file"
assert_hook "Environment bypass allows a red-zone patch" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_red_payload" 0 "" "" 1

touch "$marker"
assert_hook "Marker bypass allows a red-zone patch" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_red_payload" 0 "" ""
rm -f "$marker"

# Traversal through a directory that does not exist on disk must still resolve.
codex_ghost_traversal_payload="$(jq -cn --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"apply_patch",cwd:$cwd,tool_input:{command:"*** Begin Patch\n*** Add File: no-such-dir/../AGENTS.md\n@@\n+new\n*** End Patch"}}')"
assert_hook "Codex denies traversal through a nonexistent dir" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths-codex.sh" "$codex_ghost_traversal_payload" 2 "" "AGENTS.md is a red-zone file"

# APFS is case-insensitive: a differently-cased path opens the same file.
claude_case_payload="$(jq -cn --arg path "$repo_root/agents.md" --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Edit",cwd:$cwd,tool_input:{file_path:$path}}')"
assert_hook "Claude asks on a case-variant red-zone path" "$repo_root" "$repo_root/scripts/agent-hooks/protect-paths.sh" "$claude_case_payload" 0 '"permissionDecision":"ask"' ""

for command in \
  "git switch -c test-portability" \
  "git checkout -B test-portability" \
  "git switch --orphan test-portability" \
  "git worktree add -b test-portability /tmp/pm-test-worktree" \
  "git checkout -q -b test-portability" \
  "git -C . switch claude/test-portability" \
  "git -c user.name=x checkout -b test-portability" \
  "git stash branch test-portability" \
  "git branch --track test-portability main" \
  "git branch -m main claude/test-portability" \
  "git branch test-portability"; do
  branch_payload="$(jq -cn --arg command "$command" --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Bash",cwd:$cwd,tool_input:{command:$command}}')"
  assert_hook "Branch guard blocks: $command" "$repo_root" "$repo_root/scripts/agent-hooks/block-branch.sh" "$branch_payload" 2 "" "BLOCKED:"
done

checkout_file_payload="$(jq -cn --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Bash",cwd:$cwd,tool_input:{command:"git checkout src/data/stats.ts"}}')"
assert_hook "Branch guard allows file checkout" "$repo_root" "$repo_root/scripts/agent-hooks/block-branch.sh" "$checkout_file_payload" 0 "" ""

# Read-only and cleanup shapes must stay allowed (pipes, redirections, listing
# flags, branch deletion for stray-branch cleanup, plain stash).
for command in \
  "git branch | grep test" \
  "git branch 2>/dev/null" \
  "git branch -a" \
  "git branch --show-current" \
  "git branch -D stale-branch" \
  "git checkout main" \
  "git switch main" \
  "git stash && git pull --rebase origin main"; do
  allow_payload="$(jq -cn --arg command "$command" --arg cwd "$repo_root" '{hook_event_name:"PreToolUse",tool_name:"Bash",cwd:$cwd,tool_input:{command:$command}}')"
  assert_hook "Branch guard allows: $command" "$repo_root" "$repo_root/scripts/agent-hooks/block-branch.sh" "$allow_payload" 0 "" ""
done

no_jq_stdout="$(mktemp)"
no_jq_stderr="$(mktemp)"
no_jq_bin="$(mktemp -d)"
ln -s /bin/cat "$no_jq_bin/cat"
ln -s /usr/bin/grep "$no_jq_bin/grep"
no_jq_payload='{"tool_input":{"command":"git branch -M main claude/portability-test"}}'
printf '%s' "$no_jq_payload" | PATH="$no_jq_bin" /bin/bash "$repo_root/scripts/agent-hooks/block-branch.sh" >"$no_jq_stdout" 2>"$no_jq_stderr"
no_jq_status=$?
if [ "$no_jq_status" -ne 2 ]; then
  record_failure "Branch guard fallback works without jq" "expected exit 2, got $no_jq_status"
elif ! grep -Fq "BLOCKED:" "$no_jq_stderr"; then
  record_failure "Branch guard fallback works without jq" "stderr did not contain: BLOCKED:"
else
  printf 'ok - Branch guard fallback works without jq\n'
fi
rm -f "$no_jq_stdout" "$no_jq_stderr" "$no_jq_bin/cat" "$no_jq_bin/grep"
rmdir "$no_jq_bin"

assert_hook "Nested cwd resolves the repository root" "$repo_root/src/pages" "$repo_root/scripts/agent-hooks/protect-paths.sh" "$nested_payload" 0 '"permissionDecision":"ask"' ""

if [ "$failures" -gt 0 ]; then
  printf '%s hook contract test(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All hook contract tests passed\n'
