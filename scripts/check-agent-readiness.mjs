// Agent-readiness contract check, run against the built site in dist/.
// Guards the machine-facing surface that an "Is Agentic"-style audit grades:
// the /privacy trust-anchor page, the recovery pointers on the 404, and the
// when-to-use guidance in llms.txt. These are easy to break silently, because
// nothing on a rendered page looks wrong when they go missing.
// Requires a build first (reads dist/).
import { readFileSync, existsSync } from "node:fs";

const failures = [];
const fail = (msg) => failures.push(msg);

const read = (file) => (existsSync(file) ? readFileSync(file, "utf8") : null);

// Rough visible-text extraction: drop script/style bodies, then tags, then
// collapse whitespace. Good enough to measure whether a page has real content.
const visibleText = (html) =>
  html
    .replace(/<(script|style)\b[^>]*>.*?<\/\1>/gs, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// ── /privacy: a trust-anchor page with substantive content ──
// Audits check /about, /contact and /privacy for at least 500 characters
// before treating an organization as verifiable.
const MIN_TRUST_ANCHOR_CHARS = 500;
const privacy = read("dist/privacy/index.html");
if (!privacy) {
  fail("dist/privacy/index.html missing");
} else {
  const articles = [...privacy.matchAll(/<article\b[^>]*>(.*?)<\/article>/gs)].map((m) => m[1]);
  if (articles.length === 0) {
    fail("dist/privacy/index.html: no <article> wrapper around the policy body");
  } else {
    const chars = visibleText(articles.join(" ")).length;
    if (chars < MIN_TRUST_ANCHOR_CHARS) {
      fail(`dist/privacy/index.html: policy body is ${chars} chars, need >= ${MIN_TRUST_ANCHOR_CHARS}`);
    }
  }
  // Manrope substitutes a bare "(c)" to a copyright glyph, so rendered copy has
  // to carry a zero-width non-joiner. See AGENTS.md. Only the visible text is
  // checked: JSON-LD deliberately keeps a clean "501(c)(3)", since it is never
  // rendered and the invisible character would just pollute machine-read text.
  if (/501\(c\)\(3\)/.test(visibleText(privacy))) {
    fail('dist/privacy/index.html: bare "501(c)(3)" in visible text will render as 501©(3); needs a U+200C after the (');
  }
}

// ── /privacy is discoverable: sitemap + footer on every page ──
const sitemap = read("dist/sitemap-0.xml");
if (!sitemap) {
  fail("dist/sitemap-0.xml missing");
} else {
  if (!/<loc>[^<]*\/privacy<\/loc>/.test(sitemap)) {
    fail("dist/sitemap-0.xml: no /privacy entry");
  }
  // /styleguide is an internal design reference. It is filtered out in
  // astro.config.mjs and carries noindex; both halves are asserted here.
  if (/<loc>[^<]*\/styleguide<\/loc>/.test(sitemap)) {
    fail("dist/sitemap-0.xml: /styleguide should be filtered out of the sitemap");
  }
}

const styleguide = read("dist/styleguide/index.html");
if (!styleguide) {
  fail("dist/styleguide/index.html missing");
} else if (!/<meta name="robots" content="noindex/.test(styleguide)) {
  fail("dist/styleguide/index.html: missing robots noindex");
}

// ── robots.txt: keep the CMS shell out of search results ──
const robots = read("dist/robots.txt");
if (!robots) {
  fail("dist/robots.txt missing");
} else {
  if (!/^Disallow:\s*\S*\/admin\/\s*$/m.test(robots)) {
    fail("dist/robots.txt: no Disallow rule for the /admin/ CMS shell");
  }
  if (!/^Sitemap:\s*https?:\/\/\S+/m.test(robots)) {
    fail("dist/robots.txt: missing an absolute Sitemap line");
  }
}

const home = read("dist/index.html");
if (!home) {
  fail("dist/index.html missing");
} else if (!/href="[^"]*\/privacy"/.test(home)) {
  fail("dist/index.html: footer does not link to /privacy");
}

// ── 404: agents must be able to recover, and must not index the page ──
// GitHub Pages serves this file for every unmatched URL, so a canonical here
// would point every missing path at /404.
const notFound = read("dist/404.html");
if (!notFound) {
  fail("dist/404.html missing");
} else {
  if (!/<meta name="robots" content="noindex/.test(notFound)) {
    fail("dist/404.html: missing robots noindex");
  }
  if (/<link rel="canonical"/.test(notFound)) {
    fail("dist/404.html: has a canonical link; every missing URL would canonicalize to /404");
  }
  for (const target of ["/sitemap-index.xml", "/llms.txt"]) {
    if (!notFound.includes(`href="${target}"`) && !notFound.includes(target)) {
      fail(`dist/404.html: no pointer to ${target}`);
    }
  }
  const recovery = notFound.match(
    /<script type="text\/markdown" id="agent-recovery">(.*?)<\/script>/s
  );
  if (!recovery) {
    fail("dist/404.html: missing the text/markdown agent-recovery block");
  } else {
    const doc = recovery[1];
    if (!/^#\s/m.test(doc)) fail("dist/404.html: recovery block is not markdown (no heading)");
    for (const target of ["/sitemap-index.xml", "/llms.txt"]) {
      if (!doc.includes(target)) fail(`dist/404.html: recovery markdown omits ${target}`);
    }
    if (!/https?:\/\//.test(doc)) {
      fail("dist/404.html: recovery markdown uses relative URLs; agents lift it out of context");
    }
  }
}

// ── llms.txt: when-to-use guidance, not just a link dump ──
const llms = read("dist/llms.txt");
if (!llms) {
  fail("dist/llms.txt missing");
} else {
  if (!/^##\s+When to use/m.test(llms)) {
    fail('dist/llms.txt: missing a "## When to use" section');
  }
  for (const target of ["/privacy", "/calendar.ics", "/rss.xml", "/sitemap-index.xml"]) {
    if (!llms.includes(target)) fail(`dist/llms.txt: does not mention ${target}`);
  }
}

if (failures.length > 0) {
  console.error("Agent-readiness contract failures:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("check-agent-readiness: all contracts hold.");
