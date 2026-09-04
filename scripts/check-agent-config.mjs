import { lstatSync, readFileSync, readlinkSync } from "node:fs";

const failures = [];
const fail = (message) => failures.push(message);
const read = (path) => readFileSync(path, "utf8");

const agents = read("AGENTS.md");
if (Buffer.byteLength(agents, "utf8") > 65_536) {
  fail("AGENTS.md exceeds the project_doc_max_bytes limit of 65536");
}

if (!read("CLAUDE.md").split(/\r?\n/).includes("@AGENTS.md")) {
  fail("CLAUDE.md does not import the canonical AGENTS.md");
}

const expectedSkills = ["web-verify", "project-bootstrap"];
for (const skill of expectedSkills) {
  const target = `.claude/skills/${skill}`;
  if (!lstatSync(target).isSymbolicLink()) {
    fail(`${target} is not a symlink`);
    continue;
  }
  const expected = `../../.agents/skills/${skill}`;
  if (readlinkSync(target) !== expected) {
    fail(`${target} points to ${readlinkSync(target)}, expected ${expected}`);
  }
}

const hooks = JSON.parse(read(".codex/hooks.json"));
const matchers = (hooks.hooks?.PreToolUse ?? []).map((entry) => entry.matcher);
for (const matcher of ["Bash", "apply_patch"]) {
  if (!matchers.includes(matcher)) fail(`.codex/hooks.json is missing the ${matcher} matcher`);
}

const claudeMcp = JSON.parse(read(".mcp.json")).mcpServers?.["chrome-devtools"];
if (!claudeMcp) fail(".mcp.json is missing chrome-devtools");

const codexConfig = read(".codex/config.toml");
const chromeSection = codexConfig.match(
  /^\[mcp_servers\.chrome-devtools\]\s*$([\s\S]*)/m
);
if (!chromeSection) {
  fail(".codex/config.toml is missing [mcp_servers.chrome-devtools]");
} else if (claudeMcp) {
  if (!/^command\s*=\s*"npx"\s*$/m.test(chromeSection[1])) {
    fail("Codex chrome-devtools command does not match the shared npx setup");
  }
  if (!/^args\s*=\s*\["-y",\s*"chrome-devtools-mcp@latest"\]\s*$/m.test(chromeSection[1])) {
    fail("Codex chrome-devtools args do not match .mcp.json");
  }
}

if (failures.length > 0) {
  console.error("Agent configuration contract failures:");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("check-agent-config: all contracts hold.");
