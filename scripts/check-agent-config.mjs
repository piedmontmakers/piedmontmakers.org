import {
  existsSync,
  lstatSync,
  readFileSync,
  readlinkSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const EXPECTED_SKILLS = ["web-verify", "project-bootstrap"];
const EXPECTED_HOOKS = {
  codex: {
    Bash: 'bash "$(git rev-parse --show-toplevel)/scripts/agent-hooks/block-branch.sh"',
    apply_patch:
      'bash "$(git rev-parse --show-toplevel)/scripts/agent-hooks/protect-paths-codex.sh"',
  },
  claude: {
    SessionStart:
      'bash "$CLAUDE_PROJECT_DIR/scripts/agent-hooks/session-start-claude.sh"',
    Bash: 'bash "$CLAUDE_PROJECT_DIR/scripts/agent-hooks/block-branch.sh"',
    "Edit|Write|MultiEdit":
      'bash "$CLAUDE_PROJECT_DIR/scripts/agent-hooks/protect-paths.sh"',
  },
};
const REQUIRED_HOOK_SCRIPTS = [
  "block-branch.sh",
  "protect-paths-codex.sh",
  "protect-paths.sh",
  "session-start-claude.sh",
];

function tomlSection(document, name) {
  const header = `[${name}]`;
  const start = document.indexOf(header);
  if (start === -1) return null;
  const rest = document.slice(start + header.length);
  const nextHeader = rest.search(/^\s*\[[^\]]+\]\s*$/m);
  return nextHeader === -1 ? rest : rest.slice(0, nextHeader);
}

function tomlString(section, key) {
  const match = section.match(
    new RegExp(`^${key}\\s*=\\s*("(?:\\\\.|[^"\\\\])*")\\s*$`, "m")
  );
  return match ? JSON.parse(match[1]) : null;
}

function tomlArray(section, key) {
  const match = section.match(
    new RegExp(`^${key}\\s*=\\s*(\\[[^\\n]*\\])\\s*$`, "m")
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function hookCommand(entries, matcher) {
  const entry = entries.find((candidate) => candidate.matcher === matcher);
  return entry?.hooks?.find((hook) => hook.type === "command")?.command;
}

export function checkAgentConfig(root = process.cwd()) {
  const failures = [];
  const fail = (message) => failures.push(message);
  const file = (path) => join(root, path);
  const read = (path) => readFileSync(file(path), "utf8");

  const agents = read("AGENTS.md");
  if (Buffer.byteLength(agents, "utf8") > 65_536) {
    fail("AGENTS.md exceeds the project_doc_max_bytes limit of 65536");
  }

  if (!read("CLAUDE.md").split(/\r?\n/).includes("@AGENTS.md")) {
    fail("CLAUDE.md does not import the canonical AGENTS.md");
  }

  for (const skill of EXPECTED_SKILLS) {
    const canonical = `.agents/skills/${skill}/SKILL.md`;
    if (!existsSync(file(canonical)) || !statSync(file(canonical)).isFile()) {
      fail(`canonical skill ${canonical} is missing`);
    }

    const target = `.claude/skills/${skill}`;
    let link;
    try {
      link = lstatSync(file(target));
    } catch {
      fail(`${target} is missing`);
      continue;
    }
    if (!link.isSymbolicLink()) {
      fail(`${target} is not a symlink`);
      continue;
    }
    const expected = `../../.agents/skills/${skill}`;
    const actual = readlinkSync(file(target));
    if (actual !== expected) {
      fail(`${target} points to ${actual}, expected ${expected}`);
    }
    if (!existsSync(file(`${target}/SKILL.md`))) {
      fail(`${target} does not resolve to an existing SKILL.md`);
    }
  }

  for (const script of REQUIRED_HOOK_SCRIPTS) {
    if (!existsSync(file(`scripts/agent-hooks/${script}`))) {
      fail(`hook implementation scripts/agent-hooks/${script} is missing`);
    }
  }

  const codexHooks = JSON.parse(read(".codex/hooks.json"));
  const codexPreToolUse = codexHooks.hooks?.PreToolUse ?? [];
  for (const [matcher, expected] of Object.entries(EXPECTED_HOOKS.codex)) {
    const actual = hookCommand(codexPreToolUse, matcher);
    if (actual !== expected) {
      fail(
        `Codex ${matcher} hook command is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`
      );
    }
  }

  const claudeSettings = JSON.parse(read(".claude/settings.json"));
  const sessionStart = claudeSettings.hooks?.SessionStart?.[0]?.hooks?.find(
    (hook) => hook.type === "command"
  )?.command;
  if (sessionStart !== EXPECTED_HOOKS.claude.SessionStart) {
    fail(
      `Claude SessionStart hook command is ${JSON.stringify(sessionStart)}, expected ${JSON.stringify(EXPECTED_HOOKS.claude.SessionStart)}`
    );
  }
  const claudePreToolUse = claudeSettings.hooks?.PreToolUse ?? [];
  for (const matcher of ["Bash", "Edit|Write|MultiEdit"]) {
    const actual = hookCommand(claudePreToolUse, matcher);
    const expected = EXPECTED_HOOKS.claude[matcher];
    if (actual !== expected) {
      fail(
        `Claude ${matcher} hook command is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`
      );
    }
  }

  const claudeMcp = JSON.parse(read(".mcp.json")).mcpServers?.["chrome-devtools"];
  if (!claudeMcp) fail(".mcp.json is missing chrome-devtools");

  const codexConfig = read(".codex/config.toml");
  if (!/^project_doc_max_bytes\s*=\s*65536\s*$/m.test(codexConfig)) {
    fail(".codex/config.toml must set project_doc_max_bytes = 65536");
  }
  const chromeSection = tomlSection(codexConfig, "mcp_servers.chrome-devtools");
  if (!chromeSection) {
    fail(".codex/config.toml is missing [mcp_servers.chrome-devtools]");
  } else if (claudeMcp) {
    const codexCommand = tomlString(chromeSection, "command");
    const codexArgs = tomlArray(chromeSection, "args");
    if (codexCommand !== claudeMcp.command) {
      fail("Codex chrome-devtools command does not match .mcp.json");
    }
    if (JSON.stringify(codexArgs) !== JSON.stringify(claudeMcp.args)) {
      fail("Codex chrome-devtools args do not match .mcp.json");
    }
  }

  return failures;
}

function run() {
  const failures = checkAgentConfig();
  if (failures.length > 0) {
    console.error("Agent configuration contract failures:");
    for (const failure of failures) console.error(`  ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log("check-agent-config: all contracts hold.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
