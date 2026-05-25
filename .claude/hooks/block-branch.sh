#!/bin/bash
# PreToolUse hook: block creating or switching to non-main branches.
# The harness assigns claude/* branches; this repo commits to main only.
# Exit 2 = block the tool call with a message.

# $TOOL_INPUT is the JSON blob; extract the command field.
cmd=$(echo "$TOOL_INPUT" | jq -r '.command // empty' 2>/dev/null)
[ -z "$cmd" ] && exit 0

# Block: git checkout -b, git switch -c, git branch <name> (creation)
if echo "$cmd" | grep -qE 'git\s+(checkout\s+-b|switch\s+(-c|--create)|branch\s+[^-])'; then
  echo "BLOCKED: This repo commits directly to main. Do not create branches. See CLAUDE.md." >&2
  exit 2
fi

# Block: git checkout / git switch to anything other than main
if echo "$cmd" | grep -qE 'git\s+(checkout|switch)\s+\S+'; then
  target=$(echo "$cmd" | grep -oE 'git\s+(checkout|switch)\s+\S+' | awk '{print $NF}')
  if [ -n "$target" ] && [ "$target" != "main" ] && [ "$target" != "-b" ] && [ "$target" != "--" ]; then
    echo "BLOCKED: This repo commits directly to main. Do not switch to branch '$target'. See CLAUDE.md." >&2
    exit 2
  fi
fi

exit 0
