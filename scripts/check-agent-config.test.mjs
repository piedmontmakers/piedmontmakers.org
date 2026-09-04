import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { checkAgentConfig } from "./check-agent-config.mjs";

const CODEX_BASH =
  'bash "$(git rev-parse --show-toplevel)/scripts/agent-hooks/block-branch.sh"';
const CODEX_PATCH =
  'bash "$(git rev-parse --show-toplevel)/scripts/agent-hooks/protect-paths-codex.sh"';
const CLAUDE_START =
  'bash "$CLAUDE_PROJECT_DIR/scripts/agent-hooks/session-start-claude.sh"';
const CLAUDE_BASH =
  'bash "$CLAUDE_PROJECT_DIR/scripts/agent-hooks/block-branch.sh"';
const CLAUDE_EDIT =
  'bash "$CLAUDE_PROJECT_DIR/scripts/agent-hooks/protect-paths.sh"';

function write(root, path, contents = "") {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
}

function validFixture() {
  const root = mkdtempSync(join(tmpdir(), "pm-agent-config-"));
  write(root, "AGENTS.md", "# Project instructions\n");
  write(root, "CLAUDE.md", "# Claude Code\n\n@AGENTS.md\n");

  for (const skill of ["web-verify", "project-bootstrap"]) {
    write(root, `.agents/skills/${skill}/SKILL.md`, `# ${skill}\n`);
    mkdirSync(join(root, ".claude/skills"), { recursive: true });
    symlinkSync(`../../.agents/skills/${skill}`, join(root, `.claude/skills/${skill}`));
  }

  for (const script of [
    "block-branch.sh",
    "protect-paths-codex.sh",
    "protect-paths.sh",
    "session-start-claude.sh",
  ]) {
    write(root, `scripts/agent-hooks/${script}`, "#!/usr/bin/env bash\n");
  }

  write(
    root,
    ".codex/hooks.json",
    JSON.stringify({
      hooks: {
        PreToolUse: [
          {
            matcher: "Bash",
            hooks: [{ type: "command", command: CODEX_BASH }],
          },
          {
            matcher: "apply_patch",
            hooks: [{ type: "command", command: CODEX_PATCH }],
          },
        ],
      },
    })
  );
  write(
    root,
    ".claude/settings.json",
    JSON.stringify({
      hooks: {
        SessionStart: [
          { hooks: [{ type: "command", command: CLAUDE_START }] },
        ],
        PreToolUse: [
          {
            matcher: "Bash",
            hooks: [{ type: "command", command: CLAUDE_BASH }],
          },
          {
            matcher: "Edit|Write|MultiEdit",
            hooks: [{ type: "command", command: CLAUDE_EDIT }],
          },
        ],
      },
    })
  );
  write(
    root,
    ".mcp.json",
    JSON.stringify({
      mcpServers: {
        "chrome-devtools": {
          command: "npx",
          args: ["-y", "chrome-devtools-mcp@latest"],
        },
      },
    })
  );
  write(
    root,
    ".codex/config.toml",
    'project_doc_max_bytes = 65536\n\n[mcp_servers.chrome-devtools]\ncommand = "npx"\nargs = ["-y", "chrome-devtools-mcp@latest"]\n\n[mcp_servers.other]\ncommand = "ignored"\n'
  );
  return root;
}

function withFixture(run) {
  const root = validFixture();
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("accepts a complete portable agent configuration", () => {
  withFixture((root) => assert.deepEqual(checkAgentConfig(root), []));
});

test("rejects a dangling canonical skill", () => {
  withFixture((root) => {
    rmSync(join(root, ".agents/skills/web-verify/SKILL.md"));
    assert.match(checkAgentConfig(root).join("\n"), /canonical skill.*web-verify/);
  });
});

test("rejects disconnected Codex hook commands", () => {
  withFixture((root) => {
    const path = join(root, ".codex/hooks.json");
    const hooks = JSON.parse(readFileSync(path, "utf8"));
    hooks.hooks.PreToolUse[0].hooks[0].command = "bash stale.sh";
    writeFileSync(path, JSON.stringify(hooks));
    assert.match(checkAgentConfig(root).join("\n"), /Codex Bash hook command/);
  });
});

test("rejects disconnected Claude hook commands", () => {
  withFixture((root) => {
    const path = join(root, ".claude/settings.json");
    const settings = JSON.parse(readFileSync(path, "utf8"));
    settings.hooks.SessionStart[0].hooks[0].command = "bash stale.sh";
    writeFileSync(path, JSON.stringify(settings));
    assert.match(checkAgentConfig(root).join("\n"), /Claude SessionStart hook command/);
  });
});

test("rejects MCP command or argument drift", () => {
  withFixture((root) => {
    write(
      root,
      ".codex/config.toml",
      'project_doc_max_bytes = 65536\n\n[mcp_servers.chrome-devtools]\ncommand = "npx"\nargs = ["chrome-devtools-mcp@latest"]\n\n[mcp_servers.other]\ncommand = "ignored"\n'
    );
    assert.match(checkAgentConfig(root).join("\n"), /Codex chrome-devtools args/);
  });
});
