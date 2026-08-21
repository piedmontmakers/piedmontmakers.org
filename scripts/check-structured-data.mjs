// Structured-data contract check, run against the built site in dist/.
// Fails the build when a page loses or malforms the JSON-LD its template is
// supposed to generate, so schema coverage tracks content automatically.
// Requires a build first (reads dist/).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const failures = [];
const fail = (msg) => failures.push(msg);

const extractSchemas = (file) => {
  const html = readFileSync(file, "utf8");
  const schemas = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      schemas.push(JSON.parse(m[1]));
    } catch {
      fail(`${file}: JSON-LD block does not parse as JSON`);
    }
  }
  return schemas;
};

const ofType = (schemas, type) => schemas.filter((s) => s["@type"] === type);

// ── Every page: exactly one NonprofitOrganization (from BaseLayout) ──
const home = extractSchemas("dist/index.html");
if (ofType(home, "NonprofitOrganization").length !== 1) {
  fail("dist/index.html: expected exactly one NonprofitOrganization schema");
}

// ── /calendar: one Event per content file, each with name + startDate ──
if (existsSync("dist/calendar/index.html")) {
  const eventFiles = readdirSync("src/content/events").filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const eventSchemas = ofType(extractSchemas("dist/calendar/index.html"), "Event");
  if (eventSchemas.length !== eventFiles.length) {
    fail(`dist/calendar/index.html: ${eventSchemas.length} Event schemas for ${eventFiles.length} event files`);
  }
  for (const e of eventSchemas) {
    if (!e.name || !e.startDate) fail(`calendar Event missing name/startDate: ${JSON.stringify(e).slice(0, 80)}`);
    if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/.test(e.startDate)) {
      fail(`calendar Event has malformed startDate "${e.startDate}" (${e.name})`);
    }
  }
} else {
  fail("dist/calendar/index.html missing");
}

// ── Blog posts: one BlogPosting per built post, with date + author ──
const postFiles = readdirSync("src/content/blog").filter((f) => f.endsWith(".md") && !f.startsWith("_"));
if (existsSync("dist/blog")) {
  const postDirs = readdirSync("dist/blog", { withFileTypes: true }).filter((d) => d.isDirectory());
  if (postDirs.length !== postFiles.length) {
    fail(`dist/blog: ${postDirs.length} built posts for ${postFiles.length} content files`);
  }
  for (const dir of postDirs) {
    const page = join("dist/blog", dir.name, "index.html");
    const postings = ofType(extractSchemas(page), "BlogPosting");
    if (postings.length !== 1) {
      fail(`${page}: expected exactly one BlogPosting schema, found ${postings.length}`);
      continue;
    }
    const p = postings[0];
    if (!p.headline || !p.datePublished || !p.author) {
      fail(`${page}: BlogPosting missing headline/datePublished/author`);
    }
    const html = readFileSync(page, "utf8");
    if (!html.includes('property="article:published_time"')) {
      fail(`${page}: missing article:published_time meta`);
    }
  }
} else {
  fail("dist/blog missing");
}

if (failures.length > 0) {
  console.error("Structured-data contract failures:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("check-structured-data: all contracts hold.");
