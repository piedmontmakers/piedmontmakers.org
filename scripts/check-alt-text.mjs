// Fails the build if any <img> in src/ is missing an alt attribute.
// This is the audit prescribed in AGENTS.md ("Accessibility patterns"),
// run automatically in the deploy workflow.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["src"];
const exts = [".astro", ".md", ".mdx"];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return exts.some((e) => path.endsWith(e)) ? [path] : [];
  });
}

const failures = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/<img\b[^>]*>/gs)) {
      if (!/\balt\s*=/.test(match[0])) {
        const line = text.slice(0, match.index).split("\n").length;
        failures.push(`${file}:${line}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Images missing alt attributes:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("check-alt-text: all <img> tags have alt attributes.");
