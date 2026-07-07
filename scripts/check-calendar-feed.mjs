import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const feedPath = new URL("../dist/calendar.ics", import.meta.url);
const calendarPagePath = new URL("../dist/calendar/index.html", import.meta.url);
const eventsDir = new URL("../src/content/events/", import.meta.url);

const ics = await readFile(feedPath, "utf8");
const calendarPage = await readFile(calendarPagePath, "utf8");

assert.match(ics, /^BEGIN:VCALENDAR\r?\n/);
assert.match(ics, /\r?\nVERSION:2\.0\r?\n/);
assert.match(ics, /\r?\nPRODID:-\/\/Piedmont Makers\/\/Calendar\/\/EN\r?\n/);
assert.match(ics, /\r?\nMETHOD:PUBLISH\r?\n/);
assert.match(ics, /\r?\nX-WR-CALNAME:Piedmont Makers calendar\r?\n/);
assert.match(ics, /\r?\nBEGIN:VEVENT\r?\n/);
assert.match(ics, /\r?\nEND:VCALENDAR\r?\n?$/);

// Every event Markdown file must appear in the feed (UID is the file stem),
// and the feed must not carry events that no longer exist in the collection.
const eventFiles = (await readdir(eventsDir)).filter((f) => f.endsWith(".md"));
assert.ok(eventFiles.length > 0, "no event Markdown files found");

const uids = [...ics.matchAll(/\r?\nUID:([^\r\n]+)@piedmontmakers\.org\r?\n/g)].map(
  (m) => m[1]
);
for (const file of eventFiles) {
  const stem = file.replace(/\.md$/, "");
  assert.ok(uids.includes(stem), `event ${file} missing from calendar.ics`);
}
for (const uid of uids) {
  assert.ok(
    eventFiles.includes(`${uid}.md`),
    `feed carries UID ${uid} with no matching event file`
  );
}

const eventCount = (ics.match(/\r?\nBEGIN:VEVENT\r?\n/g) ?? []).length;
assert.equal(eventCount, eventFiles.length, "VEVENT count != event file count");
assert.equal(
  (ics.match(/\r?\nDTSTART[;:]/g) ?? []).length,
  eventCount,
  "every VEVENT needs a DTSTART"
);

// Timed events must carry the local timezone, and every event links back to
// a dated anchor on the calendar page at one of the two deploy hosts.
if (/startTime:/.test(await allFrontmatter())) {
  assert.match(ics, /\r?\nDTSTART;TZID=America\/Los_Angeles:\d{8}T\d{6}\r?\n/);
}
assert.match(
  ics,
  /\r?\nURL:https:\/\/(piedmontmakers\.org|piedmontmakers\.github\.io\/piedmontmakers\.org)\/calendar#\d{4}-\d{2}-\d{2}(-\d+)?\r?\n/
);

async function allFrontmatter() {
  const chunks = await Promise.all(
    eventFiles.map((f) => readFile(new URL(f, eventsDir), "utf8"))
  );
  return chunks.join("\n");
}

assert.match(
  calendarPage,
  /href="https:\/\/calendar\.google\.com\/calendar\/r\?cid=webcal%3A%2F%2F[^"]+calendar\.ics"/
);
assert.match(calendarPage, />Google Calendar</);
assert.match(calendarPage, /Apple Calendar/);
assert.match(calendarPage, /New Calendar Subscription/);
assert.match(calendarPage, />https:\/\/[^<]+calendar\.ics</);
assert.doesNotMatch(calendarPage, /href="webcal:\/\//);
assert.doesNotMatch(calendarPage, /calendar\/render\?cid=https%3A/);

console.log(
  `calendar.ics feed contract looks good (${eventCount} events, all matched to src/content/events)`
);
