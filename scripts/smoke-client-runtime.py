#!/usr/bin/env python3
"""Verify real CLI PreToolUse dispatch in disposable repositories.

Requires authenticated Claude and Codex CLIs. Uses a small model request in each
client. The only requested operation is a branch creation expected to be blocked;
no application services or user files are modified. Never part of offline CI.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
PROMPT = ('This is a hook integration test in a disposable repository. Use your shell tool '
          'to run exactly `git switch -c pm-smoke-forbidden` once. The hook should deny it. '
          'Do not retry, bypass hooks, edit files, or run other commands. Report the denial.')


def main():
    for client in ('claude', 'codex'):
        if not shutil.which(client): raise SystemExit(f'{client} is required')
        with tempfile.TemporaryDirectory(prefix=f'pm-runtime-{client}-') as directory:
            root = Path(directory)
            subprocess.run(['git', 'init', '-q', str(root)], check=True)
            hook = root/'block-branch.sh'
            shutil.copy2(ROOT/'scripts/agent-hooks/block-branch.sh', hook)
            log = root/'hook-input.jsonl'
            wrapper = root/'observe.sh'
            wrapper.write_text('#!/bin/sh\npayload=$(cat)\nprintf "%s\\n" "$payload" >> "'+str(log)+'"\nprintf "%s" "$payload" | bash "'+str(hook)+'"\n')
            config = {'hooks': {'PreToolUse': [{'matcher': 'Bash', 'hooks': [{'type':'command','command':f'sh "{wrapper}"'}]}]}}
            config_dir = root/('.claude' if client=='claude' else '.codex')
            config_dir.mkdir()
            (config_dir/('settings.json' if client=='claude' else 'hooks.json')).write_text(json.dumps(config))
            env = dict(os.environ)
            env.pop('PM_MAINTAINER', None)
            env.pop('TOOL_INPUT', None)
            if client == 'claude':
                args = ['claude','-p','--no-session-persistence','--setting-sources','project','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--allowedTools','Bash(git switch *)','--',PROMPT]
            else:
                home = root/'client-home'
                home.mkdir()
                auth = Path(os.environ.get('CODEX_HOME', str(Path.home()/'.codex')))/'auth.json'
                if auth.exists(): (home/'auth.json').symlink_to(auth)
                # Only these test-owned hooks are trusted. No user config/plugins are copied.
                env['CODEX_HOME'] = str(home)
                args = ['codex','exec','--ephemeral','--dangerously-bypass-hook-trust','--sandbox','workspace-write','--',PROMPT]
            result = subprocess.run(args, cwd=root, env=env, capture_output=True, text=True, timeout=180)
            if not log.exists():
                raise RuntimeError(f'{client}: no real hook invocation recorded (exit {result.returncode}): {result.stderr[-1500:]} {result.stdout[-1000:]}')
            payloads = [json.loads(line) for line in log.read_text().splitlines()]
            if not any('pm-smoke-forbidden' in json.dumps(p) for p in payloads):
                raise RuntimeError(f'{client}: expected tool payload was not delivered')
            branch = subprocess.check_output(['git','symbolic-ref','--short','HEAD'],cwd=root,text=True).strip()
            if branch == 'pm-smoke-forbidden': raise RuntimeError(f'{client}: branch guard failed')
            if 'BLOCKED:' not in result.stdout + result.stderr:
                raise RuntimeError(f'{client}: missing hook denial in client output')
            print(f'{client}: real PreToolUse invocation blocked branch creation', flush=True)

if __name__ == '__main__': main()
