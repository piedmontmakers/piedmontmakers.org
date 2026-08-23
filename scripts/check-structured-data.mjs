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

// @type may be a single string or an array (the org schema is multi-typed as
// ["Organization", "NonprofitOrganization"]), so normalize before matching.
const ofType = (schemas, type) =>
  schemas.filter((s) => [s["@type"]].flat().includes(type));

// ── Every page: exactly one NonprofitOrganization (from BaseLayout) ──
const home = extractSchemas("dist/index.html");
if (ofType(home, "NonprofitOrganization").length !== 1) {
  fail("dist/index.html: expected exactly one NonprofitOrganization schema");
}

// ── Org identity: the fields agents and knowledge graphs look for ──
// Core-vocabulary consumers don't resolve the pending NonprofitOrganization
// type, so "Organization" has to be present too or the site reads as having
// no identity type. contactPoint + address are what let an agent verify the
// org is a real entity and answer contact questions.
const orgIdentity = ofType(home, "Organization")[0];
if (!orgIdentity) {
  fail('dist/index.html: org schema @type must include "Organization"');
} else {
  const addr = orgIdentity.address;
  if (addr?.["@type"] !== "PostalAddress") {
    fail("dist/index.html: org schema missing a PostalAddress address");
  } else {
    for (const field of ["addressLocality", "addressRegion", "addressCountry"]) {
      if (!addr[field]) fail(`dist/index.html: org PostalAddress missing ${field}`);
    }
  }
  const points = [orgIdentity.contactPoint ?? []].flat();
  if (points.length === 0) {
    fail("dist/index.html: org schema missing contactPoint");
  }
  for (const point of points) {
    if (!point.contactType) fail("dist/index.html: contactPoint missing contactType");
    if (!point.email && !point.telephone) {
      fail(`dist/index.html: contactPoint "${point.contactType}" has neither email nor telephone`);
    }
  }
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

// ── /robotics: FAQPage with one Question per src/data/robotics-faq.ts entry ──
if (existsSync("dist/robotics/index.html")) {
  const faqSource = readFileSync("src/data/robotics-faq.ts", "utf8");
  // Count question entries format-insensitively (q: followed by a string
  // literal; the interface's `q: string;` declaration doesn't match).
  const sourceCount = (faqSource.match(/\bq:\s*"/g) ?? []).length;
  const faqPages = ofType(extractSchemas("dist/robotics/index.html"), "FAQPage");
  if (faqPages.length !== 1) {
    fail(`dist/robotics/index.html: expected exactly one FAQPage schema, found ${faqPages.length}`);
  } else {
    const questions = faqPages[0].mainEntity ?? [];
    if (questions.length !== sourceCount) {
      fail(`dist/robotics/index.html: ${questions.length} FAQPage questions for ${sourceCount} faqItems entries`);
    }
    for (const q of questions) {
      if (!q.name || !q.acceptedAnswer?.text) fail(`robotics FAQ question missing name/answer: ${q.name ?? "?"}`);
      if (/<[a-z]/i.test(q.acceptedAnswer?.text ?? "")) fail(`robotics FAQ answer contains HTML: ${q.name}`);
    }
  }
} else {
  fail("dist/robotics/index.html missing");
}

// ── Org sameAs: stays in sync with the footer's social-profile links ──
const SOCIAL_HOSTS = ["instagram.com", "linkedin.com", "youtube.com", "x.com", "facebook.com"];
const footer = readFileSync("src/components/Footer.astro", "utf8");
const footerSocials = [...footer.matchAll(/href="(https:\/\/[^"]+)"/g)]
  .map((m) => m[1])
  .filter((url) => SOCIAL_HOSTS.some((h) => new URL(url).hostname.endsWith(h)));
const org = ofType(home, "NonprofitOrganization")[0];
const sameAs = org?.sameAs ?? [];
for (const url of footerSocials) {
  if (!sameAs.includes(url)) fail(`orgSchema sameAs missing footer social link: ${url}`);
}
for (const url of sameAs) {
  if (!footerSocials.includes(url)) fail(`orgSchema sameAs lists a URL not in the footer: ${url}`);
}

if (failures.length > 0) {
  console.error("Structured-data contract failures:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("check-structured-data: all contracts hold.");
